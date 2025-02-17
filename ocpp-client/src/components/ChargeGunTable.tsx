import { useState } from "react";
import StatusBadge from "./StatusBadge";
import StatusSelect from "./StatusSelect";
import React from "react";

function ChargeGunTable({ guns, stationId, onUpdateStatus }) {
  const [selectedGunStatus, setSelectedGunStatus] = useState({});

  const handleStatusChange = (gunId, status) => {
    setSelectedGunStatus((prev) => ({
      ...prev,
      [gunId]: status,
    }));
  };

  return (
    <div className="overflow-x-auto p-4">
      <table className="w-full border-collapse rounded-lg shadow-lg bg-white">
        <thead>
          <tr className="bg-gray-100 text-gray-700">
            {["Gun ID", "Status", "Power (kW)", "Actions"].map((header) => (
              <th key={header} className="px-6 py-3 text-left font-semibold uppercase">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {guns.map((gun, index) => (
            <tr
              key={gun.gunId}
              className={`border-t ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
            >
              <td className="px-6 py-4 text-gray-900">{gun.gunId}</td>
              <td className="px-6 py-4">
                <StatusBadge status={gun.status} />
              </td>
              <td className="px-6 py-4 text-gray-700">{gun.power} kW</td>
              <td className="px-6 py-4 flex items-center gap-2">
                <StatusSelect
                  value={selectedGunStatus[gun.gunId] || ""}
                  onChange={(e) => handleStatusChange(gun.gunId, e.target.value)}
                  className="border rounded px-2 py-1"
                />
                <button
                  onClick={() => onUpdateStatus(stationId, gun.gunId, selectedGunStatus[gun.gunId])}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-1 px-3 rounded-md transition"
                >
                  Save
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ChargeGunTable;