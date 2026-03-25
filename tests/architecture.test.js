import { describe, it, expect, beforeEach } from "vitest";
import { useAuthenticate } from "../src/store/authentication.store";
import * as Y from "yjs";

describe("Vital-Link Core Architecture & State", () => {
  beforeEach(() => {
    // Reset auth state before each test
    useAuthenticate.getState().unAuthenticate();
  });

  it("Auth Engine: strictly manages authentication state and user identity", () => {
    const store = useAuthenticate.getState();
    expect(store.isAuthenticated).toBe(false);
    expect(store.logedInUser).toBe(null);

    // Simulate Matrix Login
    store.authenticate("@nurse_jane:matrix.org");

    expect(useAuthenticate.getState().isAuthenticated).toBe(true);
    expect(useAuthenticate.getState().logedInUser).toBe(
      "@nurse_jane:matrix.org",
    );
  });

  it("CRDT Engine: mathematically converges concurrent offline edits across distributed tablets", () => {
    // Simulate Nurse A's Tablet (Offline)
    const tabletA = new Y.Doc();
    const patientsA = tabletA.getMap("patients");

    // Simulate Nurse B's Tablet (Offline)
    const tabletB = new Y.Doc();
    const patientsB = tabletB.getMap("patients");

    // Both nurses make edits simultaneously without network connection
    patientsA.set("patient_1", { name: "John Doe", bedNo: "12A" });
    patientsB.set("patient_2", { name: "Jane Smith", bedNo: "14B" });

    // The Network reconnects. We generate binary diffs for sync.
    const stateVectorB = Y.encodeStateVector(tabletB);
    const updateFromA = Y.encodeStateAsUpdate(tabletA, stateVectorB);

    const stateVectorA = Y.encodeStateVector(tabletA);
    const updateFromB = Y.encodeStateAsUpdate(tabletB, stateVectorA);

    // Apply the network payloads to each other
    Y.applyUpdate(tabletB, updateFromA);
    Y.applyUpdate(tabletA, updateFromB);

    // ASSERTION: Both tablets must now hold the exact same merged data without data loss
    expect(patientsA.toJSON()).toEqual(patientsB.toJSON());
    expect(patientsA.get("patient_1").name).toBe("John Doe");
    expect(patientsA.get("patient_2").name).toBe("Jane Smith");
  });
});
