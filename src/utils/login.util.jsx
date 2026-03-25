import { createClient } from "matrix-js-sdk";
import { MatrixProvider } from "@ixo/matrix-crdt";
import * as Y from "yjs";
import { useYdoc } from "../store/YjsDoc";

export const loginToMatrix = async (username, password) => {
  const MATRIX_URL = "https://matrix.org";
  const ROOM_ALIAS = "#gen-ward-4:matrix.org";
  const yDoc = useYdoc.getState().yDoc;

  let matrixProvider = null;
  try {
    const tempClient = createClient({ baseUrl: MATRIX_URL });
    const loginResponse = await tempClient.loginRequest({
      type: "m.login.password",
      identifier: {
        type: "m.id.user",
        user: username,
      },
      password,
    });

    const matrixClient = createClient({
      baseUrl: MATRIX_URL,
      accessToken: loginResponse.access_token,
      userId: loginResponse.user_id,
      deviceId: loginResponse.device_id,
    });

    const roomObj = await matrixClient.getRoomIdForAlias(ROOM_ALIAS);

    const joinedRoomsResponse = await matrixClient.getJoinedRooms();
    const joinedRooms = joinedRoomsResponse.joined_rooms;

    if (!joinedRooms.includes(roomObj.room_id)) {
      return "Access Denied: You are not assigned to Gen Ward 1.";
    }

    const httpApi = matrixClient._http || matrixClient.http;
    if (httpApi && httpApi.authedRequest) {
      const originalAuthedRequest = httpApi.authedRequest;
      httpApi.authedRequest = function (...args) {
        if (
          args.length > 0 &&
          args[0] === undefined &&
          typeof args[1] === "string"
        ) {
          args.shift();
        }
        return originalAuthedRequest.apply(this, args);
      };
    }

    matrixProvider = new MatrixProvider(yDoc, matrixClient, {
      type: "id",
      id: roomObj.room_id,
    });
    matrixProvider.initialize();

    console.log("Authorized and Connected Live via Matrix Room ID");
    return null;
  } catch (err) {
    console.error("Matrix Login Failed:", err);
    return "System Error or Invalid Credentials";
  }
};
