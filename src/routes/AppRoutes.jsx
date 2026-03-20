import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import Todo from "../pages/Todo";
import Patients from "../pages/patients";
import { Login } from "../pages/auth/login";
import ProtectedRoute from "../layouts/ProtectedRouteLayout";
import AddPatient from "../pages/AddPatients";
import PatientDetails from "../pages/patientDetails";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/auth/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Todo />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/addPatients" element={<AddPatient />} />
          <Route path="/patientDetails/:id" element={<PatientDetails />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;

// {
//   "patients": {

//     "p_<patientId>": {

//       "patientInfo": {
//         "name": "string",
//         "age": 0,
//         "ward": "string",
//         "bedNo": "string",
//         "allergies": []
//       },

//       "prescriptions": {
//         "med_<deterministicId>": {
//           "name": "string",
//           "dosage": "string",
//           "frequency": "string",
//           "schedule": ["HH:MM"],
//           "createdBy": "matrixUserId",
//           "createdAt": 1700000000,
//           "active": true
//         }
//       },

//       "checkupPlans": {
//         "chk_<deterministicId>": {
//           "name": "string",
//           "frequency": "string",
//           "schedule": ["HH:MM"],
//           "createdBy": "matrixUserId",
//           "createdAt": 1700000000,
//           "active": true
//         }
//       },

//       "tasks": [
//         {
//           "id": "task_<patientId>_<sourceId>_<YYYYMMDD>_<HHMM>",
//           "sourceType": "medicine | checkup",
//           "sourceId": "med_xxx | chk_xxx",
//           "scheduledFor": 1700000000,
//           "status": "pending | completed"
//         }
//       ],

//       "taskLogs": [
//         {
//           "taskId": "task_<uniqueId>",
//           "action": "completed | skipped",
//           "performedBy": "matrixUserId",
//           "performedAt": 1700000000,

//           "result": {
//             "value": 0,
//             "unit": "string"
//           },

//           "note": "optional string"
//         }
//       ]
//     }

//   }
// }
