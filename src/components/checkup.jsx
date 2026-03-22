import React from "react";

const CheckupCard = ({ date, temperature, bloodPressure, heartRate, notes }) => {
  return (
    <div className="w-full max-w-6xl mx-auto bg-gray-50 border border-gray-300 rounded-lg px-6 py-5 shadow-sm">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          {date}
        </h2>

        {/* Heart Icon */}
        <span className="text-green-500 text-xl">💓</span>
      </div>

      {/* Vitals */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-4">
        
        <div>
          <p className="text-sm text-gray-500">Temperature</p>
          <p className="text-base font-medium text-gray-800">
            {temperature}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Blood Pressure</p>
          <p className="text-base font-medium text-gray-800">
            {bloodPressure}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Heart Rate</p>
          <p className="text-base font-medium text-gray-800">
            {heartRate}
          </p>
        </div>

      </div>

      {/* Notes */}
      <div>
        <p className="text-sm text-gray-500 mb-1">Notes:</p>
        <p className="text-sm text-gray-800">
          {notes}
        </p>
      </div>

    </div>
  );
};

export default CheckupCard;