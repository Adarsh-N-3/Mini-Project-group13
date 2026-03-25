import React, { useEffect, useState } from 'react'
import Patient from "../components/Patients.jsx"
import { useNavigate, useLocation } from 'react-router-dom'
import { useYdoc } from '../store/YjsDoc.js'
import { useAuthenticate } from '../store/authentication.store.js'
import { Plus, AlertCircle } from 'lucide-react'

function Patients() {
  const location = useLocation()

  // ✅ Initialize state from location (FIXED)
  const initialMessage = location.state?.message || ""
  const [successMessage, setSuccessMessage] = useState(initialMessage)

  const [patientArray, setPatientArray] = useState({})

  const admin = useAuthenticate((state) => state.adminUsername)
  const logedInUser = useAuthenticate((state) => state.logedInUser)

  const yDoc = useYdoc((state) => state.yDoc)
  const PatientArray = yDoc.getMap("patients")

  const navigate = useNavigate()

  const isAdmin = admin && admin.includes(logedInUser)

  // ✅ Auto-dismiss message (SAFE)
  useEffect(() => {
    if (!successMessage) return

    const timer = setTimeout(() => {
      setSuccessMessage("")
    }, 3000)

    return () => clearTimeout(timer)
  }, [successMessage])

  // ✅ Sync Yjs data with cleanup (VERY IMPORTANT ⭐)
  useEffect(() => {
    const syncUI = () => {
      setPatientArray(PatientArray.toJSON())
    }

    syncUI()

    const observer = () => syncUI()
    PatientArray.observe(observer)

    return () => {
      PatientArray.unobserve(observer)
    }
  }, [PatientArray])

  return (
    <div className='flex flex-1 flex-col pt-6 px-4 gap-3'>

      {/* ✅ Success Message */}
      {successMessage && (
        <div className="mx-auto w-full max-w-md bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-green-700 text-sm animate-pulse">
          {successMessage}
        </div>
      )}

      {/* ✅ Empty State */}
      {Object.keys(patientArray).length === 0 ? (
        <div className="flex flex-1 items-center justify-center flex-col gap-4">
          <AlertCircle size={48} className="text-gray-300" />
          <p className="text-gray-500 text-center">No patients found</p>

          {isAdmin && (
            <button
              onClick={() => navigate("/addPatients")}
              className="mt-4 px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
              <Plus size={18} />
              Add First Patient
            </button>
          )}
        </div>
      ) : (

        /* ✅ Patient List */
        <div className="flex flex-col gap-3 pb-6">
          {Object.entries(patientArray).map(([id, patient]) => (
            <Patient 
              key={id} 
              id={id} 
              P_name={patient.name} 
              age={patient.age} 
              ward={patient.ward} 
              bed_no={patient.bedNo}
              allergy={patient.allergies && patient.allergies.length > 0}
            />
          ))}
        </div>
      )}

      {/* ✅ Floating Add Button */}
      {isAdmin && Object.keys(patientArray).length > 0 && (
        <button
          onClick={() => navigate("/addPatients")}
          className='fixed bottom-24 right-6 w-16 h-16 flex justify-center items-center rounded-full bg-black text-white hover:bg-gray-800 transition-colors shadow-lg hover:shadow-xl z-40'
          title="Add new patient"
        >
          <Plus size={28} />
        </button>
      )}
    </div>
  )
}

export default Patients