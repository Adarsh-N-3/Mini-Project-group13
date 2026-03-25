export default function PatientInfoCard({ patientDetails }) {
  if (!patientDetails) {
    return (
      <div className="mx-4 bg-gray-100 rounded-xl p-4 mt-4 shrink-0 animate-pulse h-24 border border-gray-200"></div>
    );
  }

  const { name, bedNo, age, ward } = patientDetails;

  return (
    <div className="mx-4 bg-gray-50 border border-gray-200 rounded-xl p-4 mt-4 shrink-0 shadow-sm">
      <h2 className="text-xl font-bold text-black">
        {name || "Unknown Patient"}
      </h2>
      <div className="text-xs text-black mt-3 flex gap-3 flex-wrap font-semibold">
        <span className="bg-gray-200 px-3 py-1.5 rounded-lg">
          BED: {bedNo || "N/A"}
        </span>
        <span className="bg-gray-200 px-3 py-1.5 rounded-lg">
          AGE: {age || "N/A"}
        </span>
        <span className="bg-gray-200 px-3 py-1.5 rounded-lg">
          WARD: {ward || "Unassigned"}
        </span>
      </div>
    </div>
  );
}
