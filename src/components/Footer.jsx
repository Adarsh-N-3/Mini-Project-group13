import pendingIcon from "../assets/pending.png"
import patient from "../assets/patient.png"
import { NavLink, useLocation } from "react-router-dom"

const Footer = () => {
  const location = useLocation()
  const isDetailPage = location.pathname.startsWith("/patientDetails/") || location.pathname.startsWith("/addPatients")

  // Hide footer on detail and add patient pages
  if (isDetailPage) {
    return null
  }

  return (
    <footer className="w-full bg-white h-16 flex border-t border-gray-200">
      <NavLink
        to="/" 
        className={({ isActive }) =>
          `flex-1 flex items-center justify-center gap-1 rounded-2xl transition-colors ${
            isActive ? "bg-blue-100" : "hover:bg-gray-50"
          }`
        }
      >
        <div className="flex flex-col gap-1 items-center">
          <img src={pendingIcon} className="h-8" alt="pending" />
          <p className="text-black font-serif font-extrabold text-sm">Todo</p>
        </div>
      </NavLink>

      <NavLink
        to="/patients"
        className={({ isActive }) =>
          `flex-1 flex items-center justify-center gap-1 rounded-2xl transition-colors ${
            isActive ? "bg-blue-100" : "hover:bg-gray-50"
          }`
        }
      >
        <div className="flex flex-col gap-1 items-center">
          <img src={patient} className="h-8" alt="patient" />
          <p className="text-black font-serif font-extrabold text-sm">Patient</p>
        </div>
      </NavLink>
    </footer>
  )
}

export { Footer }