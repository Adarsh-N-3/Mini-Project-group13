import { Login } from "./Login";
import { useEffect, useState } from "react";
import { yTasks, addTask, toggleTask } from "./store1";
import type { Task } from "./store1";
import { yDoc } from "./store1";
import { matrixProvider } from "./store1";

//from react icons
import { FaTasks } from "react-icons/fa";
import { MdLocalHospital } from "react-icons/md";
import { MdAccountCircle } from "react-icons/md";

export default function App() {
  const [user, setUser] = useState<string | null>(null);

  const HEAD_NURSE_ID = "@adarshhtaman:matrix.org";
  const isHeadNurse = user === HEAD_NURSE_ID;
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTab, setActiveTab] = useState<"todos" | "patients">("todos");
  const [newAdmissionName, setNewAdmissionName] = useState("");

  // Patient Card State
  const [expandedPatient, setExpandedPatient] = useState<string | null>(null);
  const [newTaskText, setNewTaskText] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<"High" | "Normal">(
    "Normal",
  );

  // --- THE REACTIVE SYNC (FRP) ---
  useEffect(() => {
    // Force React to re-render whenever the underlying database changes
    const updateHandler = () => {
      setTasks(Array.from(yTasks.values()));
    };

    // Listen to the deep document, not just the array
    yDoc.on("update", updateHandler);

    return () => yDoc.off("update", updateHandler);
  }, []);

  if (!user) return <Login onLoginSuccess={setUser} />;

  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed && !b.completed) return 1;
    if (!a.completed && b.completed) return -1;
    if (a.priority === "High" && b.priority !== "High") return -1;
    if (a.priority !== "High" && b.priority === "High") return 1;
    return a.dueTime - b.dueTime;
  });

  //derive unique patients from the task list
  const uniquePatients = Array.from(new Set(tasks.map((t) => t.patientName)));

  const handleAddTask = (patientName: string) => {
    if (!newTaskText.trim()) return;
    addTask(newTaskText, patientName, user, newTaskPriority);
    setNewTaskText("");
    setNewTaskPriority("Normal");
  };

  // NEW FUNCTION: Head Nurse Admits a Patient
  const handleAdmitPatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdmissionName.trim()) return;

    //simply creating a dummy task to initialize the patient in the system (will remove when i update the DS used)
    addTask(
      "Patient Admitted - Initial Assessment Required",
      newAdmissionName,
      user as string,
      "High",
    );
    setNewAdmissionName("");
  };

  //just for debuging
  const runDiagnostics = () => {
    console.log("=== VITAL LINK DIAGNOSTICS ===");
    console.log("1. Total Tasks in Yjs Array:", yTasks.size);
    console.log("2. Raw Yjs JSON:", Array.from(yTasks.values()));

    if (matrixProvider) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mp = matrixProvider as any;

      console.log(
        "3. Matrix Provider Status:",
        mp.matrixClient ? mp.matrixClient.getSyncState() : "No Client Attached",
      );
      console.log(
        "4. Matrix Room Connected:",
        mp.roomId || mp.roomAlias || "Unknown",
      );
    } else {
      console.log("3. Matrix Provider: NOT INITIALIZED");
    }
  };

  //UI render
  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "0 auto",
        fontFamily: "Inter",
        backgroundColor: "#F2F3F4",
        minHeight: "100vh",
      }}
    >
      <header
        style={{
          padding: "1rem",
          backgroundColor: "#1B1811",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <h2 style={{ margin: 0 }}>Gen Ward 1</h2>
        <span
          style={{
            fontSize: "0.9rem",
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
          }}
        >
          <MdAccountCircle size={25} />
          {user}
        </span>
      </header>

      {/* diagnostic button for debugging*/}
      <div
        style={{
          padding: "0.5rem",
          backgroundColor: "#333",
          color: "#0f0",
          textAlign: "center",
        }}
      >
        <button
          onClick={runDiagnostics}
          style={{
            backgroundColor: "#ffffff",
            color: "#000",
            fontWeight: "bold",
            padding: "0.5rem 1rem",
            border: "none",
            cursor: "pointer",
          }}
        >
          dbg button
        </button>
      </div>

      <div
        style={{
          display: "flex",
          backgroundColor: "white",
          borderBottom: "2px solid #ddd",
        }}
      >
        <button
          onClick={() => {
            setActiveTab("todos");
            setExpandedPatient(null);
          }}
          style={{
            flex: 1,
            padding: "1rem",
            border: "none",
            backgroundColor: "transparent",
            fontWeight: activeTab === "todos" ? "bold" : "normal",
            borderBottom: activeTab === "todos" ? "3px solid #0056b3" : "none",
            cursor: "pointer",
          }}
        >
          <FaTasks /> Shared Todos
        </button>
        <button
          onClick={() => {
            setActiveTab("patients");
            setExpandedPatient(null);
          }}
          style={{
            flex: 1,
            padding: "1rem",
            border: "none",
            backgroundColor: "transparent",
            fontWeight: activeTab === "patients" ? "bold" : "normal",
            borderBottom:
              activeTab === "patients" ? "3px solid #0056b3" : "none",
            cursor: "pointer",
          }}
        >
          <h3>
            <MdLocalHospital /> Patients
          </h3>
        </button>
      </div>

      <div style={{ padding: "1rem" }}>
        {/*SHARED TODOS*/}
        {activeTab === "todos" && (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}
          >
            {sortedTasks.length === 0 ? (
              <p style={{ textAlign: "center", color: "#666" }}>No tasks</p>
            ) : null}

            {sortedTasks.map((task) => (
              <div
                key={task.id}
                style={{
                  padding: "1rem",
                  backgroundColor: "white",
                  borderRadius: "8px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                  display: "flex",
                  alignItems: "center",
                  borderLeft:
                    task.priority === "High"
                      ? "4px solid #dc3545"
                      : "4px solid #28a745",
                  opacity: task.completed ? 0.6 : 1,
                }}
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id, user)}
                  style={{
                    transform: "scale(1.5)",
                    marginRight: "1rem",
                    cursor: "pointer",
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: "bold", fontSize: "1.1rem" }}>
                    {task.patientName}
                  </div>
                  <div style={{ color: "#333" }}>{task.text}</div>
                  <div
                    style={{
                      fontSize: "0.8rem",
                      color: "#777",
                      marginTop: "4px",
                    }}
                  >
                    Added by: {task.addedBy}{" "}
                    {task.completed && ` | Done by: ${task.completedBy}`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/*PATIENTS LIST & DETAILS*/}
        {activeTab === "patients" && (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {/*HEAD NURSE ONLY- ADMISSION PANEL*/}
            {isHeadNurse && (
              <form
                onSubmit={handleAdmitPatient}
                style={{
                  backgroundColor: "#e3f2fd",
                  padding: "1.5rem",
                  borderRadius: "8px",
                  border: "1px dashed #0056b3",
                  marginBottom: "1rem",
                }}
              >
                <h3 style={{ margin: "0 0 1rem 0", color: "#0056b3" }}>
                  Admit New Patient
                </h3>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <input
                    type="text"
                    placeholder="Patient Name (e.g., John Doe)"
                    value={newAdmissionName}
                    onChange={(e) => setNewAdmissionName(e.target.value)}
                    style={{
                      flex: 1,
                      padding: "0.8rem",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      padding: "0.8rem 1.5rem",
                      backgroundColor: "#0056b3",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  >
                    Admit Patient
                  </button>
                </div>
              </form>
            )}
            {uniquePatients.length === 0 ? (
              <p>No patients admitted yet.</p>
            ) : null}

            {uniquePatients.map((patientName) => {
              const isExpanded = expandedPatient === patientName;
              const patientTasks = sortedTasks.filter(
                (t) => t.patientName === patientName,
              );

              return (
                <div
                  key={patientName}
                  style={{
                    backgroundColor: "white",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    overflow: "hidden",
                  }}
                >
                  {/* PATIENT CARD HEADER*/}
                  <div
                    onClick={() =>
                      setExpandedPatient(isExpanded ? null : patientName)
                    }
                    style={{
                      padding: "1.5rem",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      backgroundColor: isExpanded ? "#f1f8ff" : "white",
                    }}
                  >
                    <h4 style={{ margin: 0 }}>{patientName}</h4>
                    <span>{isExpanded ? "▲" : "▼"}</span>
                  </div>

                  {/* EXPANDED DETAILS and ADD TASK FORM */}
                  {isExpanded && (
                    <div
                      style={{ padding: "1.5rem", borderTop: "1px solid #eee" }}
                    >
                      <h4 style={{ marginTop: 0 }}>Current Tasks:</h4>
                      <ul style={{ paddingLeft: "1.5rem", color: "#444" }}>
                        {patientTasks.length === 0 ? (
                          <li>No active tasks</li>
                        ) : null}
                        {patientTasks.map((t) => (
                          <li
                            key={t.id}
                            style={{
                              textDecoration: t.completed
                                ? "line-through"
                                : "none",
                            }}
                          >
                            {t.text} {t.priority === "High" && "🚨"}
                          </li>
                        ))}
                      </ul>

                      {/* ADD NEW TASK FOR THIS PATIENT */}
                      <div
                        style={{
                          marginTop: "1.5rem",
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.5rem",
                          padding: "1rem",
                          backgroundColor: "#f8f9fa",
                          borderRadius: "6px",
                        }}
                      >
                        <strong>Add New Task:</strong>
                        <input
                          type="text"
                          placeholder="e.g., Check Vitals"
                          value={newTaskText}
                          onChange={(e) => setNewTaskText(e.target.value)}
                          style={{
                            padding: "0.8rem",
                            borderRadius: "4px",
                            border: "1px solid #ccc",
                          }}
                        />
                        <select
                          value={newTaskPriority}
                          onChange={(e) =>
                            setNewTaskPriority(
                              e.target.value as "High" | "Normal",
                            )
                          }
                          style={{
                            padding: "0.8rem",
                            borderRadius: "4px",
                            border: "1px solid #ccc",
                          }}
                        >
                          <option value="Normal">Normal Priority</option>
                          <option value="High">High Priority</option>
                        </select>
                        <button
                          onClick={() => handleAddTask(patientName)}
                          style={{
                            padding: "0.8rem",
                            backgroundColor: "#28a745",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            fontWeight: "bold",
                            cursor: "pointer",
                          }}
                        >
                          + Assign Task
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
