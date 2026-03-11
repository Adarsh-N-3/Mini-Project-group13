import React from "react";

const MedicineCard = ({ name, dosage, frequency, started }) => {
  return (
    <div className="w-full max-w-5xl mx-auto bg-gray-100 border border-gray-300 rounded-xl p-5">
      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        {name}
      </h2>

      <p className="text-gray-700 text-sm">
        <span className="font-medium">Dosage:</span> {dosage}
      </p>

      <p className="text-gray-700 text-sm">
        <span className="font-medium">Frequency:</span> {frequency}
      </p>

      <p className="text-gray-700 text-sm">
        <span className="font-medium">Started:</span> {started}
      </p>
    </div>
  );
};

export default MedicineCard;