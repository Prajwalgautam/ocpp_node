import { useState } from "react";
import StatusSelect from "./StatusSelect";
import React from "react";

function StationActions({ station, isEditing, onEdit, onCancel, onUpdate }) {
  const [selectedStatus, setSelectedStatus] = useState("");

  const handleSave = () => {
    onUpdate(station.stationId, selectedStatus);
    onCancel();
  };

  if (!isEditing) {
    return (
      <button
        onClick={onEdit}
        className="px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-md"
      >
        Update
      </button>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      <StatusSelect
        value={selectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-md"
      />
      <button
        onClick={handleSave}
        className="px-4 py-2 text-white bg-green-500 hover:bg-green-600 rounded-md"
      >
        Save
      </button>
      <button
        onClick={onCancel}
        className="px-4 py-2 text-white bg-red-500 hover:bg-gray-600 rounded-md"
      >
        Cancel
      </button>
    </div>
  );
}

export default StationActions;
