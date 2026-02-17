import * as Y from "yjs";
import { IndexeddbPersistence } from "y-indexeddb";
import { MatrixProvider } from "matrix-crdt";
import { createClient } from "matrix-js-sdk";
import { v4 as uuidv4 } from "uuid";

const MATRIX_URL = "https://matrix.org";
const ROOM_ALIAS = "#gen-ward-1:matrix.org"; //local addr. of the matrix room

export interface Task {
  id: string;
  patientName: string;
  text: string;
  addedBy: string;
  priority: "High" | "Normal";
  dueTime: number;
  completed: boolean;
  completedBy?: string;
  completedAt?: number;
}

//store initialisation
export const yDoc = new Y.Doc();

const localProvider = new IndexeddbPersistence("nurse-assistant-db", yDoc);
localProvider.on("synced", () => {
  console.log("Local Offline Database Loaded");
});

export const yTasks = yDoc.getMap<Task>("ward-tasks");

export let matrixProvider: MatrixProvider | null = null;

export const loginToMatrix = async (
  username: string,
  password: string,
): Promise<string | null> => {
  try {
    //authentication
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

    //get the room id by passing alia of the room(local addr)
    const roomObj = await matrixClient.getRoomIdForAlias(ROOM_ALIAS);

    // we are checking if the client is a member of our room, we do this by getting the joined rooms of the client and checking if our room is present in it
    const joinedRoomsResponse = await matrixClient.getJoinedRooms();
    const joinedRooms = joinedRoomsResponse.joined_rooms;

    if (!joinedRooms.includes(roomObj.room_id)) {
      return "Access Denied: You are not assigned to Gen Ward 1.";
    }

    // HOTFIX: API ADAPTER PATTERN
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const httpApi = (matrixClient as any)._http || (matrixClient as any).http;
    if (httpApi && httpApi.authedRequest) {
      const originalAuthedRequest = httpApi.authedRequest;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      httpApi.authedRequest = function (...args: any[]) {
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

    // Initialize the CRDT Engine
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

export const addTask = (
  text: string,
  patientName: string,
  currentUser: string,
  priority: "High" | "Normal" = "Normal",
) => {
  const newTask: Task = {
    id: uuidv4(),
    patientName,
    text,
    addedBy: currentUser,
    priority,
    dueTime: Date.now(),
    completed: false,
  };

  yTasks.set(newTask.id, newTask);
};

export const toggleTask = (taskId: string, currentUser: string) => {
  const taskToUpdate = yTasks.get(taskId);

  if (taskToUpdate) {
    const updatedTask: Task = {
      ...taskToUpdate,
      completed: !taskToUpdate.completed,
      completedBy: !taskToUpdate.completed ? currentUser : undefined,
    };
    yTasks.set(taskId, updatedTask);
  }
};
