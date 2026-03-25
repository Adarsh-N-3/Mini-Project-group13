import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useYdoc } from "../store/YjsDoc";
import { useAuthenticate } from "../store/authentication.store";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Circle } from "lucide-react";

export default function Todo() {
  const [allTasks, setAllTasks] = useState([]);
  const [filterStatus, setFilterStatus] = useState("pending");
  const [sourceTypeFilter, setSourceTypeFilter] = useState("all");
  const yDoc = useYdoc((state) => state.yDoc);
  const logedInUser = useAuthenticate((state) => state.logedInUser);
  const navigate = useNavigate();

  const getSeriousnessScore = (seriousness) => {
    if (seriousness === "High") return 3;
    if (seriousness === "Medium") return 2;
    if (seriousness === "Low") return 1;
    return 0;
  };

  const filteredTasks = useMemo(() => {
    let filtered = allTasks;

    if (sourceTypeFilter !== "all") {
      filtered = filtered.filter(
        (task) => task.sourceType === sourceTypeFilter,
      );
    }

    if (filterStatus === "pending") {
      filtered = filtered.filter((task) => task.status === "pending");
    } else if (filterStatus === "completed") {
      filtered = filtered.filter((task) => task.status === "completed");
    }

    return filtered.sort((a, b) => {
      if (a.status !== b.status) {
        return a.status === "pending" ? -1 : 1;
      }

      if (a.status === "pending") {
        const seriousnessCompare =
          getSeriousnessScore(b.seriousness) -
          getSeriousnessScore(a.seriousness);
        if (seriousnessCompare !== 0) return seriousnessCompare;
        return a.scheduledFor - b.scheduledFor;
      } else {
        return b.completedAt - a.completedAt;
      }
    });
  }, [allTasks, filterStatus, sourceTypeFilter]);

  useEffect(() => {
    function loadTasks() {
      const tasks = [];
      const patientsMap = yDoc.getMap("patients");

      patientsMap.forEach((patient, patientId) => {
        const patientData = patient.toJSON();
        const patientTasks = patientData.tasks || [];

        patientTasks.forEach((task) => {
          const prescriptions = patientData.prescriptions || {};
          const checkups = patientData.checkups || {}; // Fetch checkups from CRDT

          let sourceName = task.sourceId;
          let seriousness = "Medium";

          // Determine the correct source data based on sourceType
          if (task.sourceType === "medicine" && prescriptions[task.sourceId]) {
            sourceName = prescriptions[task.sourceId].name;
            seriousness = prescriptions[task.sourceId].seriousness;
          } else if (task.sourceType === "checkup" && checkups[task.sourceId]) {
            sourceName = checkups[task.sourceId].name;
            seriousness = checkups[task.sourceId].seriousness;
          }

          tasks.push({
            id: task.id,
            patientId,
            patientName: patientData.name,
            sourceType: task.sourceType,
            sourceId: task.sourceId,
            sourceName,
            seriousness,
            scheduledFor: task.scheduledFor,
            status: task.status,
            createdBy: task.createdBy,
            completedBy: task.completedBy,
            completedAt: task.completedAt,
            ward: patientData.ward,
            bedNo: patientData.bedNo,
          });
        });
      });

      setAllTasks(tasks);
    }

    loadTasks();

    const patientsMap = yDoc.getMap("patients");
    patientsMap.observe(() => {
      loadTasks();
    });

    patientsMap.forEach((patient) => {
      patient.observe(() => {
        loadTasks();
      });
    });
  }, [yDoc]);

  const markTaskCompleted = useCallback(
    (taskId, patientId) => {
      try {
        const patient = yDoc.getMap("patients").get(patientId);
        if (!patient) return;

        const tasksArray = patient.get("tasks");
        if (!tasksArray) return;

        tasksArray.forEach((task) => {
          if (
            task &&
            typeof task.get === "function" &&
            task.get("id") === taskId
          ) {
            task.set("status", "completed");
            task.set("completedBy", logedInUser);
            task.set("completedAt", Date.now());
          }
        });

        setAllTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === taskId && task.patientId === patientId
              ? {
                  ...task,
                  status: "completed",
                  completedBy: logedInUser,
                  completedAt: Date.now(),
                }
              : task,
          ),
        );
      } catch (error) {
        console.error("Error marking task completed:", error);
      }
    },
    [yDoc, logedInUser],
  );

  const formatDate = (timestamp) => new Date(timestamp).toLocaleString();
  const getSourceTypeLabel = (sourceType) =>
    sourceType === "medicine" ? "💊 Medicine" : "🩺 Checkup";

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      <div className="p-6 border-b bg-white">
        <h1 className="text-2xl font-semibold mb-4">Tasks & Todos</h1>

        <div className="mb-4">
          <p className="text-sm font-medium text-gray-600 mb-2">Status</p>
          <div className="flex gap-2">
            {["pending", "completed", "all"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  filterStatus === status
                    ? "bg-black text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
                {status !== "all" && (
                  <span className="ml-2 text-sm">
                    ({allTasks.filter((t) => t.status === status).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-600 mb-2">Type</p>
          <div className="flex gap-2">
            {["all", "medicine", "checkup"].map((type) => (
              <button
                key={type}
                onClick={() => setSourceTypeFilter(type)}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  sourceTypeFilter === type
                    ? "bg-black text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {type === "all"
                  ? "All"
                  : type === "medicine"
                    ? "💊 Medicine"
                    : "🩺 Checkup"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {filteredTasks.length > 0 ? (
          <div className="space-y-4">
            {(() => {
              const pendingTasks = filteredTasks.filter(
                (t) => t.status === "pending",
              );
              const completedTasks = filteredTasks.filter(
                (t) => t.status === "completed",
              );

              return (
                <>
                  {pendingTasks.length > 0 && (
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <Circle size={20} className="text-yellow-500" />
                        Pending Tasks ({pendingTasks.length})
                      </h2>
                      <div className="space-y-3">
                        {pendingTasks.map((task) => (
                          <div
                            key={`${task.patientId}-${task.id}`}
                            className="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-3 flex-1">
                                <button
                                  onClick={() =>
                                    markTaskCompleted(task.id, task.patientId)
                                  }
                                  className="mt-1 p-1 hover:bg-gray-100 rounded"
                                >
                                  <Circle size={24} className="text-gray-300" />
                                </button>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                                    <h3 className="font-semibold text-lg">
                                      {task.sourceName}
                                    </h3>
                                    <span
                                      className={`text-sm text-gray-600 px-2 py-1 rounded ${task.sourceType === "medicine" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"}`}
                                    >
                                      {getSourceTypeLabel(task.sourceType)}
                                    </span>
                                    <span
                                      className={`text-xs font-bold px-2 py-1 rounded-full text-white ${task.seriousness === "High" ? "bg-red-500" : task.seriousness === "Medium" ? "bg-yellow-500" : "bg-green-500"}`}
                                    >
                                      {task.seriousness || "Medium"}
                                    </span>
                                  </div>
                                  <p className="text-gray-600 mb-2">
                                    Patient:{" "}
                                    <button
                                      onClick={() =>
                                        navigate(
                                          `/patientDetails/${task.patientId}`,
                                        )
                                      }
                                      className="font-medium text-blue-600 hover:underline transition-colors cursor-pointer"
                                    >
                                      {task.patientName}
                                    </button>
                                  </p>
                                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-500">
                                    <div>
                                      <span className="text-gray-400">
                                        Bed:
                                      </span>{" "}
                                      {task.bedNo}
                                    </div>
                                    <div>
                                      <span className="text-gray-400">
                                        Ward:
                                      </span>{" "}
                                      {task.ward}
                                    </div>
                                    <div className="col-span-2">
                                      <span className="text-gray-400">
                                        Scheduled:
                                      </span>{" "}
                                      {formatDate(task.scheduledFor)}
                                    </div>
                                    <div className="col-span-2">
                                      <span className="text-gray-400">
                                        Created by:
                                      </span>{" "}
                                      {task.createdBy || "Unknown"}
                                    </div>
                                  </div>
                                  <div className="mt-3 flex items-center justify-between">
                                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                                      Pending
                                    </span>
                                    <button
                                      onClick={() =>
                                        markTaskCompleted(
                                          task.id,
                                          task.patientId,
                                        )
                                      }
                                      className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors text-sm"
                                    >
                                      Mark Complete
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {completedTasks.length > 0 && (
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <CheckCircle2 size={20} className="text-green-500" />
                        Completed Tasks ({completedTasks.length})
                      </h2>
                      <div className="space-y-3">
                        {completedTasks.map((task) => (
                          <div
                            key={`${task.patientId}-${task.id}`}
                            className="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow opacity-75"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-3 flex-1">
                                <CheckCircle2
                                  size={24}
                                  className="text-green-500 mt-1 shrink-0"
                                />
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                                    <h3 className="font-semibold text-lg">
                                      {task.sourceName}
                                    </h3>
                                    <span
                                      className={`text-sm text-gray-600 px-2 py-1 rounded ${task.sourceType === "medicine" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"}`}
                                    >
                                      {getSourceTypeLabel(task.sourceType)}
                                    </span>
                                    <span
                                      className={`text-xs font-bold px-2 py-1 rounded-full text-white ${task.seriousness === "High" ? "bg-red-500" : task.seriousness === "Medium" ? "bg-yellow-500" : "bg-green-500"}`}
                                    >
                                      {task.seriousness || "Medium"}
                                    </span>
                                  </div>
                                  <p className="text-gray-600 mb-2">
                                    Patient:{" "}
                                    <span className="font-medium">
                                      {task.patientName}
                                    </span>
                                  </p>
                                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-500">
                                    <div>
                                      <span className="text-gray-400">
                                        Bed:
                                      </span>{" "}
                                      {task.bedNo}
                                    </div>
                                    <div>
                                      <span className="text-gray-400">
                                        Ward:
                                      </span>{" "}
                                      {task.ward}
                                    </div>
                                    <div className="col-span-2">
                                      <span className="text-gray-400">
                                        Scheduled:
                                      </span>{" "}
                                      {formatDate(task.scheduledFor)}
                                    </div>
                                    <div className="col-span-2">
                                      <span className="text-gray-400">
                                        Created by:
                                      </span>{" "}
                                      {task.createdBy || "Unknown"}
                                    </div>
                                    <div className="col-span-2">
                                      <span className="text-gray-400">
                                        Completed by:
                                      </span>{" "}
                                      {task.completedBy || "Unknown"}
                                    </div>
                                    <div className="col-span-2">
                                      <span className="text-gray-400">
                                        Completed at:
                                      </span>{" "}
                                      {formatDate(task.completedAt)}
                                    </div>
                                  </div>
                                  <div className="mt-3">
                                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                      Completed
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <div className="text-6xl mb-4">✓</div>
            <p className="text-xl font-semibold">
              {filterStatus === "completed"
                ? "All tasks completed!"
                : "No pending tasks"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
