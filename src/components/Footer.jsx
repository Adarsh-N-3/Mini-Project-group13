import pendingIcon from "../assets/pending.png";
import patient from "../assets/patient.png";
import { NavLink, useLocation } from "react-router-dom";

const Footer = () => {
  const location = useLocation();
  const isDetailPage =
    location.pathname.startsWith("/patientDetails/") ||
    location.pathname.startsWith("/addPatients");

  // Hide footer on detail and add patient pages
  if (isDetailPage) {
    return null;
  }

  return (
    <footer className="w-full bg-white h-16 flex border-t border-gray-200 p-1 gap-1">
      <NavLink
        to="/"
        className={({ isActive }) =>
          `flex-1 flex items-center justify-center gap-1 rounded-xl transition-all ${
            isActive
              ? "bg-gray-200 opacity-100"
              : "hover:bg-gray-50 opacity-50 hover:opacity-100"
          }`
        }
      >
        <div className="flex flex-col gap-1 items-center">
          <img src={pendingIcon} className="h-6" alt="pending" />
          <p className="text-black font-serif font-extrabold text-xs">Todo</p>
        </div>
      </NavLink>

      <NavLink
        to="/patients"
        className={({ isActive }) =>
          `flex-1 flex items-center justify-center gap-1 rounded-xl transition-all ${
            isActive
              ? "bg-gray-200 opacity-100"
              : "hover:bg-gray-50 opacity-50 hover:opacity-100"
          }`
        }
      >
        <div className="flex flex-col gap-1 items-center">
          <img src={patient} className="h-6" alt="patient" />
          <p className="text-black font-serif font-extrabold text-xs">
            Patient
          </p>
        </div>
      </NavLink>
    </footer>
  );
};

export { Footer };
