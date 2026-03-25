import { useNavigate } from "react-router-dom"

function Patients({P_name,age,ward,bed_no,allergy,id}) {
  const navigate = useNavigate()
  return (
    <div onClick={()=>navigate(`/patientDetails/${id}`)} className="patient bg-white   shadow-[0_0px_10px_rgba(0,0,0,0.1)] relative w-[90%] h-32 rounded-2xl  flex pl-4 pt-4 pb-2 ">
      <div className="flex-1 flex gap-1 flex-col ">
        <p className="text-2xl font-bold font-serif" >{P_name}</p>
        <p className="text-gray-400"> age :{age} ward : {ward}</p>
        <p className="flex  gap-2"><p className="text-gray-500">Bed :</p> <p>{bed_no}</p></p>
      </div>
      {
        allergy?      <div className="flex-1 absolute top-5 right-5 text-red-500 bg-red-100  px-2 text-[12px] rounded-3xl">Allergy</div>:""
      }
    </div>
  )
}

export default Patients
