function HeaderNavTab({ activeTab, setActiveTab, pendingTasksCount }) {
  return (
    <div className="mx-4 mt-4 bg-gray-100 rounded-full p-1 flex justify-between text-sm font-medium shrink-0 overflow-x-auto">
      <button
        onClick={() => setActiveTab("medicines")}
        className={`px-4 py-1 rounded-full whitespace-nowrap transition-colors ${activeTab === "medicines" ? "bg-white" : "hover:bg-gray-200"}`}
      >
        Medicines
      </button>
      <button
        onClick={() => setActiveTab("checkups")}
        className={`px-4 py-1 whitespace-nowrap transition-colors rounded-full ${activeTab === "checkups" ? "bg-white" : "hover:bg-gray-200"}`}
      >
        Checkups
      </button>
      <button
        onClick={() => setActiveTab("history")}
        className={`px-4 py-1 whitespace-nowrap transition-colors rounded-full ${activeTab === "history" ? "bg-white" : "hover:bg-gray-200"}`}
      >
        History
      </button>
      <button
        onClick={() => setActiveTab("todos")}
        className={`px-4 py-1 flex gap-1 whitespace-nowrap transition-colors rounded-full ${activeTab === "todos" ? "bg-white" : "hover:bg-gray-200"}`}
      >
        Todo{" "}
        {pendingTasksCount > 0 && (
          <span className="bg-red-500 text-white rounded-full px-2 text-xs">
            {pendingTasksCount}
          </span>
        )}
      </button>
    </div>
  );
}

export default HeaderNavTab;
