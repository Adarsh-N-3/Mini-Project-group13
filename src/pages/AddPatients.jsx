import { useState } from "react";
import { useYdoc } from "../store/YjsDoc";
import * as Y from "yjs"

const DEFAULT_ALLERGIES = [
  "Penicillin",
  "Aspirin",
  "Ibuprofen",
  "Latex",
  "Peanuts",
  "Shellfish",
  "Eggs",
  "Milk",
  "Sulfa drugs",
];

export default function AddPatient() {

  const yDoc = useYdoc((state)=>state.yDoc)

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [bed, setBed] = useState("");
  const [ward, setWard] = useState("");          
  const [phone, setPhone] = useState("");
  const [customAllergy, setCustomAllergy] = useState("");
  const [allergies, setAllergies] = useState(DEFAULT_ALLERGIES);
  const [selectedAllergies, setSelectedAllergies] = useState([]);

  const toggleAllergy = (item) => {
    setSelectedAllergies((prev) =>
      prev.includes(item)
        ? prev.filter((a) => a !== item)
        : [...prev, item]
    );
  };

  const addCustomAllergy = () => {
    if (!customAllergy.trim()) return;

    setAllergies([...allergies, customAllergy]);
    setSelectedAllergies([...selectedAllergies, customAllergy]);
    setCustomAllergy("");
  };

  const addPatient = () => {

    const patients= yDoc.getMap("patients")
    
    alert("clicked")
    const patientInfo =  new Y.Map()
    const allergie = new Y.Array()

    allergie.insert(0,[...allergies])

    patientInfo.set("name",name)
    patientInfo.set("age",age)
    patientInfo.set("ward",ward)
    patientInfo.set("bedNo",bed)
    patientInfo.set("allergies",allergie)
    patients.set(crypto.randomUUID(),patientInfo)
    console.log("ydoc :::",yDoc.getMap("patients").toJSON())
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center py-10">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">

        <h1 className="text-2xl font-semibold mb-6">Add Patient</h1>

        <label className="block font-medium mb-1">Name *</label>
        <input
          type="text"
          placeholder="Enter patient name"
          className="w-full bg-gray-100 rounded-lg px-4 py-3 mb-4"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <label className="block font-medium mb-1">Age *</label>
            <input
              type="number"
              placeholder="Age"
              className="w-full bg-gray-100 rounded-lg px-4 py-3"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>

          <div className="flex-1">
            <label className="block font-medium mb-1">Bed Number *</label>
            <input
              type="text"
              placeholder="e.g., A-101"
              className="w-full bg-gray-100 rounded-lg px-4 py-3"
              value={bed}
              onChange={(e) => setBed(e.target.value)}
            />
          </div>
        </div>

        <label className="block font-medium mb-1">Ward *</label>
        <input
          type="text"
          placeholder="e.g., General / ICU / Pediatrics"
          className="w-full bg-gray-100 rounded-lg px-4 py-3 mb-4"
          value={ward}
          onChange={(e) => setWard(e.target.value)}
        />

        <label className="block font-medium mb-1">Phone Number *</label>
        <input
          type="tel"
          placeholder="Enter phone number"
          className="w-full bg-gray-100 rounded-lg px-4 py-3 mb-4"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <label className="block font-medium mb-2">Allergies</label>

        <div className="flex flex-wrap gap-2 mb-4">
          {allergies.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => toggleAllergy(item)}
              className={`px-3 py-1 rounded-full border text-sm
                ${
                  selectedAllergies.includes(item)
                    ? "bg-black text-white"
                    : "bg-white"
                }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="flex gap-3 mb-6">
          <input
            type="text"
            placeholder="Add custom allergy"
            className="flex-1 bg-gray-100 rounded-lg px-4 py-3"
            value={customAllergy}
            onChange={(e) => setCustomAllergy(e.target.value)}
          />

          <button
            type="button"
            onClick={addCustomAllergy}
            className="px-4 py-2 border rounded-lg"
          >
            Add
          </button>
        </div>


        <button
          onClick={addPatient}
          className="w-full bg-black text-white py-3 rounded-xl font-medium"
        >
          Save Patient
        </button>
      </div>
    </div>
  );
}