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
      <h2 className="text-xl font-bold text-blue-800 mb-2">
        {name}
      </h2>

      <p className="text-gray-700 text-sm">
        <span className="font-medium">Dosage:</span> {dosage}
      </p>

      <p className="text-gray-700 text-sm">
        <span className="font-medium">Frequency:</span> {frequency}
      </p>

      <p className="text-gray-700 text-lg">
        <span className="font-medium">Started:</span> {started}
      </p>
    </div>
  );
};

export default MedicineCard;