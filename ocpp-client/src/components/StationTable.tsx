import { useState } from "react";
import StatusBadge from "./StatusBadge";
import StationActions from "./StationActions";
import ChargeGunTable from "./ChargeGunTable";
import React from "react";

function StationTable({ stations, loading, onUpdateStatus, onUpdateGunStatus }) {
  const [expandedStations, setExpandedStations] = useState({});
  const [editingStation, setEditingStation] = useState(null);

  const toggleExpand = (stationId) => {
    setExpandedStations((prev) => ({
      ...prev,
      [stationId]: !prev[stationId],
    }));
  };

  if (loading) {
    return <div className="text-center text-xl py-4">Loading stations...</div>;
  }

  if (stations.length === 0) {
    return <div className="text-center text-xl py-4">No charging stations found</div>;
  }

  return (
    <div className="overflow-x-auto p-4 bg-gray-50">
      <table className="min-w-full bg-white shadow-md rounded-lg border-collapse">
        <thead>
          <tr className="bg-gray-200">
            {["Station ID", "Status", "Power (kW)", "Actions"].map((header) => (
              <th key={header} className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {stations.map((station) => (
            <React.Fragment key={station.stationId}>
              <tr className="border-t border-b">
                <td className="px-4 py-2 text-sm font-medium text-gray-700">
                  <button
                    className="text-blue-500 hover:text-blue-700"
                    onClick={() => toggleExpand(station.stationId)}
                  >
                    {expandedStations[station.stationId] ? "▼" : "▶"}
                  </button>
                  #{station.stationId}
                </td>
                <td className="px-4 py-2 text-sm">
                  <StatusBadge status={station.status} />
                </td>
                <td className="px-4 py-2 text-sm">{station.power} kW</td>
                <td className="px-4 py-2 text-sm">
                  <StationActions
                    station={station}
                    isEditing={editingStation === station.stationId}
                    onEdit={() => setEditingStation(station.stationId)}
                    onCancel={() => setEditingStation(null)}
                    onUpdate={onUpdateStatus}
                  />
                </td>
              </tr>
              {expandedStations[station.stationId] && (
                <tr className="bg-gray-50">
                  <td colSpan={4} className="px-4 py-2">
                    <ChargeGunTable
                      guns={station.chargeGuns}
                      stationId={station.stationId}
                      onUpdateStatus={onUpdateGunStatus}
                    />
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StationTable;
