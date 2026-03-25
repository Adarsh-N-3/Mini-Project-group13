import { Pill, Stethoscope } from "lucide-react";
function GenericButton({ setShowModal, buttonType }) {
  return (
    <button
      onClick={() => setShowModal(true)}
      className="mx-4 mt-4 bg-black text-white py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-800 shrink-0"
    >
      {buttonType === "Medicine" ? (
        <Pill size={18}></Pill>
      ) : (
        <Stethoscope size={18}></Stethoscope>
      )}
      {buttonType === "Medicine" ? "Add Medicine" : "Add Checkups"}
    </button>
  );
}

export default GenericButton;
