// MedicineCard component - displays medicine details
import React from "react";

const MedicineCard = ({ 
  name = "Unknown Medicine", 
  dosage = "Not specified", 
  frequency = "Not specified", 
  started = "Unknown date" 
}) => {
  return (
    <div className="w-full max-w-5xl mx-auto bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 rounded-2xl p-5">
      <h2 className="text-xl font-bold text-indigo-800 tracking-tight mb-2">
        {name}
      </h2>

      <p className="text-gray-800 text-base font-medium">
        <span className="font-bold text-indigo-700">Dosage:</span> <span className="italic">{dosage}</span>
      </p>

      <p className="text-gray-700 text-sm">
        <span className="font-medium">Frequency:</span> {frequency}
      </p>

      <p className="text-gray-700 text-lg">
        <span className="font-medium">Started:</span> {started}
      </p>
    </div>
  );
}; //med compound success
export default MedicineCard;
