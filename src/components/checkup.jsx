import React from "react";
import { Stethoscope } from "lucide-react";

const CheckupCard = ({ name, frequency, schedule, seriousness, added }) => {
  return (
    <div className="w-full max-w-5xl mx-auto bg-blue-50 border border-blue-200 rounded-xl p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Stethoscope size={20} className="text-blue-600" />
          <h2 className="text-xl font-semibold text-blue-900">
            {name}
          </h2>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${
            seriousness === "Low"
              ? "bg-green-500"
              : seriousness === "Medium"
                ? "bg-yellow-500"
                : "bg-red-500"
          }`}
        >
          {seriousness || "Medium"}
        </span>
      </div>

      <p className="text-gray-700 text-sm">
        <span className="font-medium">Frequency:</span> {frequency}
      </p>

      <p className="text-gray-700 text-sm">
        <span className="font-medium">Schedule:</span>{" "}
        {Array.isArray(schedule) ? schedule.join(", ") : schedule}
      </p>

      <p className="text-gray-700 text-sm">
        <span className="font-medium">Added:</span> {added}
      </p>
    </div>
  );
};
export default CheckupCard;
