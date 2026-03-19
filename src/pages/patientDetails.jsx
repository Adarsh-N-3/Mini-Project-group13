import { Pill, X, CheckCircle2, Circle } from "lucide-react"
import { useEffect, useState, useCallback } from "react"
import { useYdoc } from "../store/YjsDoc"
import { useParams } from "react-router-dom"
import * as Y from "yjs"
import { useAuthenticate } from "../store/authentication.store"

export default function PatientDetails() {
    const [patientDetails, setPatientDetails] = useState()
    const [medicines, setMedicines] = useState({})
    const [showMedicineModal, setShowMedicineModal] = useState(false)
    const [tasks, setTasks] = useState([])
    const [activeTab, setActiveTab] = useState("medicines")
    const {id: userId} = useParams()
    const yDoc = useYdoc((state) => state.yDoc)
    const logedInUser = useAuthenticate((state) => state.logedInUser)

    const [medicineForm, setMedicineForm] = useState({
        name: "",
        dosage: "",
        frequency: "Twice",
        customFrequencyCount: 2,
        seriousness: "Medium",
        scheduleTimes: [
            { hour: "08", minute: "00", period: "AM" },
            { hour: "08", minute: "00", period: "PM" }
        ]
    })

    const patient = yDoc.getMap("patients").get(userId)

    useEffect(() => {
        function updateDetails() {
            if (patient) {
                const patientData = patient.toJSON()
                setPatientDetails(patientData)
                setMedicines(patientData.prescriptions || {})
                setTasks(patientData.tasks || [])
            }
        }

        updateDetails()

        // Subscribe to changes
        if (patient) {
            patient.observe(() => {
                updateDetails()
            })
        }
    }, [userId, patient])

    const addMedicine = () => {
        if (!medicineForm.name || !medicineForm.dosage || !medicineForm.frequency) {
            alert("Please fill all fields")
            return
        }

        if (medicineForm.scheduleTimes.length === 0 || medicineForm.scheduleTimes.some(t => !t.hour || !t.minute)) {
            alert("Please add all schedule times")
            return
        }

        try {
            if (!patient.has("prescriptions")) {
                patient.set("prescriptions", new Y.Map())
            }

            // Convert 12-hour format with AM/PM to 24-hour format
            const convertTo24Hour = (time) => {
                let hour = parseInt(time.hour)
                const minute = time.minute
                const period = time.period

                if (period === "PM" && hour !== 12) {
                    hour += 12
                } else if (period === "AM" && hour === 12) {
                    hour = 0
                }

                return `${String(hour).padStart(2, '0')}:${minute}`
            }

            const schedule24Hour = medicineForm.scheduleTimes.map(convertTo24Hour)

            const prescriptions = patient.get("prescriptions")
            const medId = `med_${Date.now()}`
            const medicineData = new Y.Map()

            medicineData.set("name", medicineForm.name)
            medicineData.set("dosage", medicineForm.dosage)
            medicineData.set("frequency", medicineForm.frequency)
            medicineData.set("seriousness", medicineForm.seriousness)
            medicineData.set("schedule", schedule24Hour)
            medicineData.set("createdBy", logedInUser)
            medicineData.set("createdAt", Date.now())
            medicineData.set("active", true)

            prescriptions.set(medId, medicineData)

            // Create tasks for this medicine based on schedule
            if (!patient.has("tasks")) {
                patient.set("tasks", new Y.Array())
            }

            const medTasks = patient.get("tasks")
            const baseTimestamp = Date.now()
            const tasksToAdd = []
            const newTasksForState = []
            
            medicineForm.scheduleTimes.forEach((time, index) => {
                const taskData = new Y.Map()
                const taskId = `task_${userId}_${medId}_${baseTimestamp}_${index}`
                taskData.set("id", taskId)
                taskData.set("sourceType", "medicine")
                taskData.set("sourceId", medId)
                taskData.set("scheduledFor", baseTimestamp)
                taskData.set("status", "pending")
                taskData.set("createdBy", logedInUser)
                tasksToAdd.push(taskData)

                // Prepare task for immediate state update
                newTasksForState.push({
                    id: taskId,
                    patientId: userId,
                    patientName: patientDetails?.name,
                    sourceType: "medicine",
                    sourceId: medId,
                    sourceName: medicineForm.name,
                    seriousness: medicineForm.seriousness,
                    scheduledFor: baseTimestamp,
                    status: "pending",
                    createdBy: logedInUser,
                    completedBy: null,
                    completedAt: null,
                    ward: patientDetails?.ward,
                    bedNo: patientDetails?.bedNo
                })
            })
            
            // Add all tasks in a single batch
            medTasks.push(tasksToAdd)

            // Update local state immediately for instant UI feedback
            setTasks(prevTasks => [...prevTasks, ...newTasksForState])

            setMedicineForm({ 
                name: "", 
                dosage: "", 
                frequency: "Twice", 
                customFrequencyCount: 2,
                seriousness: "Medium",
                scheduleTimes: [
                    { hour: "08", minute: "00", period: "AM" },
                    { hour: "08", minute: "00", period: "PM" }
                ]
            })
            setShowMedicineModal(false)
        } catch (error) {
            console.error("Error adding medicine:", error)
            alert("Error adding medicine")
        }
    }

    const handleFrequencyChange = (freq) => {
        let count = 1
        if (freq === "Twice") count = 2
        else if (freq === "Thrice") count = 3

        const newScheduleTimes = Array(count).fill(null).map((_, i) => 
            medicineForm.scheduleTimes[i] || { hour: "08", minute: "00", period: "AM" }
        )

        setMedicineForm({
            ...medicineForm,
            frequency: freq,
            customFrequencyCount: count,
            scheduleTimes: newScheduleTimes
        })
    }

    const handleCustomFrequencyChange = (count) => {
        const numCount = parseInt(count) || 0
        const newScheduleTimes = Array(numCount).fill(null).map((_, i) => 
            medicineForm.scheduleTimes[i] || { hour: "08", minute: "00", period: "AM" }
        )

        setMedicineForm({
            ...medicineForm,
            customFrequencyCount: numCount,
            scheduleTimes: newScheduleTimes
        })
    }

    const handleTimeChange = (index, field, value) => {
        const newTimes = [...medicineForm.scheduleTimes]
        newTimes[index] = {
            ...newTimes[index],
            [field]: value
        }
        setMedicineForm({
            ...medicineForm,
            scheduleTimes: newTimes
        })
    }

    const getFrequencyCount = () => {
        if (medicineForm.frequency === "Custom") {
            return medicineForm.customFrequencyCount
        }
        if (medicineForm.frequency === "Once") return 1
        if (medicineForm.frequency === "Twice") return 2
        if (medicineForm.frequency === "Thrice") return 3
        return 0
    }

    const formatDate = (timestamp) => {
        return new Date(timestamp).toLocaleDateString()
    }

    const formatDateTime = (timestamp) => {
        return new Date(timestamp).toLocaleString()
    }

    const getSeriousnessScore = (seriousness) => {
        if (seriousness === "High") return 3
        if (seriousness === "Medium") return 2
        if (seriousness === "Low") return 1
        return 0
    }

    const getSourceName = (sourceId, sourceType) => {
        if (sourceType === "medicine") {
            // Get prescriptions directly from patient Yjs object
            const prescriptionsMap = patient?.get("prescriptions")
            if (prescriptionsMap && prescriptionsMap.has(sourceId)) {
                const med = prescriptionsMap.get(sourceId)
                if (med && med.get && med.get("name")) {
                    return med.get("name")
                }
            }
        }
        return sourceId
    }

    const pendingTasksCount = tasks.filter(t => t.status === "pending").length

    const pendingTasks = tasks
        .filter(t => t.status === "pending")
        .sort((a, b) => {
            const seriousnessCompare = getSeriousnessScore(b.seriousness) - getSeriousnessScore(a.seriousness)
            if (seriousnessCompare !== 0) return seriousnessCompare
            return a.scheduledFor - b.scheduledFor
        })
        .map(task => ({
            ...task,
            sourceName: getSourceName(task.sourceId, task.sourceType)
        }))

    const completedTasks = tasks
        .filter(t => t.status === "completed")
        .sort((a, b) => b.completedAt - a.completedAt)
        .map(task => ({
            ...task,
            sourceName: getSourceName(task.sourceId, task.sourceType)
        }))

    const markTaskCompleted = useCallback((taskId) => {
        try {
            const tasksArray = patient.get("tasks")
            if (!tasksArray) return

            tasksArray.forEach((task) => {
                if (task && typeof task.get === 'function' && task.get("id") === taskId) {
                    task.set("status", "completed")
                    task.set("completedBy", logedInUser)
                    task.set("completedAt", Date.now())
                }
            })

            // Update local state immediately for instant UI feedback
            setTasks(prevTasks =>
                prevTasks.map(task =>
                    task.id === taskId
                        ? {
                            ...task,
                            status: "completed",
                            completedBy: logedInUser,
                            completedAt: Date.now()
                          }
                        : task
                )
            )
        } catch (error) {
            console.error("Error marking task completed:", error)
        }
    }, [patient, logedInUser])

    return (
        <div className="min-h-screen bg-white flex flex-col h-screen overflow-hidden">
            {/* Patient Info Card */}
            <div className="mx-4 bg-blue-50 rounded-xl p-4 mt-4 shrink-0">
                <h2 className="text-lg font-semibold">{patientDetails?.name || ""}</h2>
                <div className="text-sm text-gray-600 mt-1 flex gap-4 flex-wrap">
                    <span>Bed: {patientDetails?.bedNo || ""}</span>
                    <span>Age: {patientDetails?.age || ""}</span>
                    <span>Ward: {patientDetails?.ward || ""}</span>
                </div>
            </div>

            {/* Tabs */}
            <div className="mx-4 mt-4 bg-gray-100 rounded-full p-1 flex justify-between text-sm font-medium shrink-0 overflow-x-auto">
                <button onClick={() => setActiveTab("medicines")} className={`px-4 py-1 rounded-full whitespace-nowrap transition-colors ${
                    activeTab === "medicines" ? "bg-white" : "hover:bg-gray-200"
                }`}>Medicines</button>
                <button onClick={() => setActiveTab("checkups")} className={`px-4 py-1 whitespace-nowrap transition-colors ${
                    activeTab === "checkups" ? "bg-white" : "hover:bg-gray-200"
                }`}>Checkups</button>
                <button onClick={() => setActiveTab("history")} className={`px-4 py-1 whitespace-nowrap transition-colors ${
                    activeTab === "history" ? "bg-white" : "hover:bg-gray-200"
                }`}>History</button>
                <button onClick={() => setActiveTab("todos")} className={`px-4 py-1 flex gap-1 whitespace-nowrap transition-colors ${
                    activeTab === "todos" ? "bg-white" : "hover:bg-gray-200"
                }`}>
                    Todo
                    {pendingTasksCount > 0 && <span className="bg-red-500 text-white rounded-full px-2 text-xs">{pendingTasksCount}</span>}
                </button>
            </div>

            {/* Add Medicine Button - Only show when on medicines tab */}
            {activeTab === "medicines" && (
                <button 
                    onClick={() => setShowMedicineModal(true)}
                    className="mx-4 mt-4 bg-black text-white py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-800 shrink-0"
                >
                    <Pill size={18} />
                    Add Medicine
                </button>
            )}

            {/* Content Area - Scrollable */}
            <div className="mx-4 mt-4 flex-1 overflow-y-auto min-h-0">
                {/* Medicines Tab */}
                {activeTab === "medicines" && (
                    <div>
                        <h3 className="font-semibold text-lg mb-3 shrink-0">Active Medicines</h3>
                        {Object.entries(medicines).length > 0 ? (
                            <div className="pb-4 space-y-3">
                                {Object.entries(medicines).map(([medId, med]) => (
                                    med.active && <div key={medId} className="border rounded-xl p-4">
                                        <div className="flex items-start justify-between mb-2">
                                            <h3 className="font-semibold text-lg">{med.name}</h3>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${
                                                med.seriousness === "Low" ? "bg-green-500" : med.seriousness === "Medium" ? "bg-yellow-500" : "bg-red-500"
                                            }`}>
                                                {med.seriousness || "Medium"}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 text-sm mt-1">Dosage: {med.dosage}</p>
                                        <p className="text-gray-600 text-sm">Frequency: {med.frequency}</p>
                                        <p className="text-gray-600 text-sm">Schedule: {Array.isArray(med.schedule) ? med.schedule.join(", ") : med.schedule}</p>
                                        <p className="text-gray-500 text-xs mt-2">Started: {formatDate(med.createdAt)}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-8">No medicines added yet</p>
                        )}
                    </div>
                )}

                {/* Todos Tab */}
                {activeTab === "todos" && (
                    <div>
                        {/* Pending Tasks */}
                        <div className="mb-6">
                            <h3 className="font-semibold text-lg mb-3">Pending Tasks</h3>
                            {pendingTasks.length > 0 ? (
                                <div className="space-y-3">
                                    {pendingTasks.map((task) => (
                                        <div key={task.id} className="border rounded-xl p-4 hover:bg-gray-50">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <h4 className="font-semibold">{task.sourceName || task.sourceId}</h4>
                                                        <span className={`px-2 py-0.5 rounded text-xs font-semibold text-white ${
                                                            task.seriousness === "Low" ? "bg-green-500" : task.seriousness === "Medium" ? "bg-yellow-500" : "bg-red-500"
                                                        }`}>
                                                            {task.seriousness || "Medium"}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-600">Created by: {task.createdBy}</p>
                                                </div>
                                                <button
                                                    onClick={() => markTaskCompleted(task.id)}
                                                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                                                    title="Mark as completed"
                                                >
                                                    <Circle size={20} className="text-gray-400" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-8">No pending tasks</p>
                            )}
                        </div>

                        {/* Completed Tasks */}
                        <div>
                            <h3 className="font-semibold text-lg mb-3">Completed Tasks</h3>
                            {completedTasks.length > 0 ? (
                                <div className="space-y-3">
                                    {completedTasks.map((task) => (
                                        <div key={task.id} className="border rounded-xl p-4 bg-gray-50 opacity-75">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <h4 className="font-semibold line-through text-gray-600">{task.sourceName || task.sourceId}</h4>
                                                        <span className={`px-2 py-0.5 rounded text-xs font-semibold text-white ${
                                                            task.seriousness === "Low" ? "bg-green-500" : task.seriousness === "Medium" ? "bg-yellow-500" : "bg-red-500"
                                                        }`}>
                                                            {task.seriousness || "Medium"}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-600">Created by: {task.createdBy}</p>
                                                    <p className="text-sm text-gray-600">Completed by: {task.completedBy}</p>
                                                    <p className="text-xs text-gray-500 mt-1">Completed: {formatDateTime(task.completedAt)}</p>
                                                </div>
                                                <CheckCircle2 size={20} className="text-green-500 shrink-0" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-8">No completed tasks</p>
                            )}
                        </div>

                        {pendingTasks.length === 0 && completedTasks.length === 0 && (
                            <p className="text-gray-500 text-center py-8">No tasks yet</p>
                        )}
                    </div>
                )}

                {/* Checkups Tab */}
                {activeTab === "checkups" && (
                    <p className="text-gray-500 text-center py-8">No checkups scheduled</p>
                )}

                {/* History Tab */}
                {activeTab === "history" && (
                    <p className="text-gray-500 text-center py-8">No history available</p>
                )}
            </div>
            {/* Medicine Modal */}
            {showMedicineModal && (
                <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 max-h-96 overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-semibold">Add Medicine</h2>
                            <button 
                                onClick={() => setShowMedicineModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label className="block font-medium mb-2 text-gray-700">Medicine Name *</label>
                                <input
                                    type="text"
                                    placeholder="e.g., Metformin"
                                    className="w-full bg-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
                                    value={medicineForm.name}
                                    onChange={(e) => setMedicineForm({...medicineForm, name: e.target.value})}
                                />
                            </div>

                            <div>
                                <label className="block font-medium mb-2 text-gray-700">Dosage *</label>
                                <input
                                    type="text"
                                    placeholder="e.g., 500mg"
                                    className="w-full bg-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
                                    value={medicineForm.dosage}
                                    onChange={(e) => setMedicineForm({...medicineForm, dosage: e.target.value})}
                                />
                            </div>

                            <div>
                                <label className="block font-medium mb-2 text-gray-700">Seriousness *</label>
                                <div className="flex gap-2">
                                    {["Low", "Medium", "High"].map((level) => (
                                        <button
                                            key={level}
                                            onClick={() => setMedicineForm({...medicineForm, seriousness: level})}
                                            className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                                                medicineForm.seriousness === level
                                                    ? level === "Low" ? "bg-green-500 text-white" : level === "Medium" ? "bg-yellow-500 text-white" : "bg-red-500 text-white"
                                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                            }`}
                                        >
                                            {level}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block font-medium mb-2 text-gray-700">Frequency *</label>
                                <div className="flex gap-2">
                                    {["Once", "Twice", "Thrice", "Custom"].map((freq) => (
                                        <button
                                            key={freq}
                                            onClick={() => handleFrequencyChange(freq)}
                                            className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                                                medicineForm.frequency === freq
                                                    ? "bg-black text-white"
                                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                            }`}
                                        >
                                            {freq}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {medicineForm.frequency === "Custom" && (
                                <div>
                                    <label className="block font-medium mb-2 text-gray-700">Number of Times *</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="10"
                                        className="w-full bg-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
                                        value={medicineForm.customFrequencyCount}
                                        onChange={(e) => handleCustomFrequencyChange(e.target.value)}
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block font-medium mb-2 text-gray-700">Schedule Times *</label>
                                <div className="space-y-3">
                                    {Array.from({ length: getFrequencyCount() }).map((_, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <span className="text-sm text-gray-600 w-16">Time {index + 1}:</span>
                                            <div className="flex gap-2 flex-1">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max="12"
                                                    placeholder="HH"
                                                    className="w-16 bg-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black text-center"
                                                    value={medicineForm.scheduleTimes[index]?.hour || ""}
                                                    onChange={(e) => handleTimeChange(index, "hour", e.target.value.padStart(2, '0'))}
                                                />
                                                <span className="text-gray-400 font-semibold">:</span>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="59"
                                                    placeholder="MM"
                                                    className="w-16 bg-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black text-center"
                                                    value={medicineForm.scheduleTimes[index]?.minute || ""}
                                                    onChange={(e) => handleTimeChange(index, "minute", e.target.value.padStart(2, '0'))}
                                                />
                                                <select
                                                    className="bg-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black font-medium"
                                                    value={medicineForm.scheduleTimes[index]?.period || "AM"}
                                                    onChange={(e) => handleTimeChange(index, "period", e.target.value)}
                                                >
                                                    <option value="AM">AM</option>
                                                    <option value="PM">PM</option>
                                                </select>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={() => setShowMedicineModal(false)}
                                    className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={addMedicine}
                                    className="flex-1 bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}