import React from 'react'
import { useLocation, useNavigate } from "react-router-dom"
import { ArrowLeft, Home } from 'lucide-react'
import patient from "../assets/patient.png"
import todo from "../assets/pending.png"

const Header = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const url = location.pathname
  
  let heading = ""
  let icon = ""
  let showBackButton = false
  
  if (url === "/") {
    heading = "Pending Tasks"
    icon = todo
  } else if (url === "/patients") {
    heading = "Patients"
    icon = patient
  } else if (url === "/addPatients") {
    heading = "Add Patient"
    icon = patient
    showBackButton = true
  } else if (url.startsWith("/patientDetails/")) {
    heading = "Patient Details"
    icon = patient
    showBackButton = true
  }

  return (
    <div className="bg-white w-full h-16 flex border-b border-gray-200 items-center gap-4 px-4">
      {showBackButton && (
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
          title="Go back"
        >
          <ArrowLeft size={20} className="text-gray-700" />
        </button>
      )}
      
      <div className='flex flex-row gap-4 items-center flex-1'>
        <img className='h-10' src={icon} alt="" />
        <p className='text-2xl font-bold font-serif'>{heading}</p>
      </div>

      {/* Breadcrumb navigation */}
      {url.startsWith("/patientDetails/") && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <button 
            onClick={() => navigate("/patients")}
            className="hover:text-gray-900 transition-colors"
          >
            Patients
          </button>
          <span>/</span>
          <span>Details</span>
        </div>
      )}
    </div>
  )
}

export { Header }