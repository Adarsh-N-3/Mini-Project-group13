import React, { useEffect, useState } from 'react'
import Patient from "../components/Patients.jsx"
import { useNavigate, } from 'react-router-dom'
import { useYdoc } from '../store/YjsDoc.js'
import { useAuthenticate } from '../store/authentication.store.js'
function Patients() {
  const [patientArray,setPatientArray]= useState([])
  const admin = useAuthenticate((state)=>state.adminUsername)
  const yDoc= useYdoc((state)=>state.yDoc)
  const PatientArray =yDoc.getMap("patients")
  console.log("patients from doc :",patientArray)
  const navigate=useNavigate()

  useEffect(()=>{
    PatientArray.observe(()=>setPatientArray(PatientArray.toJSON()))
    function syncui(){
      setPatientArray(PatientArray.toJSON())
    }
    syncui()
  },[])
  return (
    <div className=' flex  flex-1 items-center   pt-6  flex-col gap-3 '>
      {
          Object.entries(patientArray || {}).map(([id,patient])=>{
            return <Patient key={id} id={id} P_name={patient.name} age={patient.age} ward={patient.ward} bed_no={patient.bedNo}/>
          })
      }
   {
    admin.includes(useAuthenticate((state)=>state.logedInUser)) && 
      <div onClick={()=>navigate("/addPatients")} className='w-18 h-18 flex justify-center items-center rounded-full bg-black text-white absolute bottom-18 right-6'>
        <p className='text-3xl text-white font-bold'>+</p>
      </div>    }
    </div>
  )
}

export default Patients

