import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingStation, setEditingStation] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState({});

  useEffect(() => {
    fetchStations();
  }, []);

  const fetchStations = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/stations");
      setStations(response.data);
    } catch (error) {
      toast.error("Failed to fetch stations");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (stationId) => {
    const newStatus = selectedStatus[stationId];
    if (!newStatus) {
      toast.warn("Please select a status");
      return;
    }

    try {
      await axios.patch(`http://localhost:5000/api/stations/${stationId}`, {
        status: newStatus,
      });

      setStations((prevStations) =>
        prevStations.map((station) =>
          station.stationId === stationId ? { ...station, status: newStatus } : station
        )
      );

      toast.success("Status updated successfully");
      setEditingStation(null);
    } catch (error) {
      toast.error("Error updating status");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          🔌 Charging Station Manager
        </h1>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <table className="w-full text-left text-sm text-gray-700">
            <thead className="bg-gray-200 text-gray-800">
              <tr>
                {["Station ID", "Status", "Power (kW)", "Actions"].map((header) => (
                  <th key={header} className="px-6 py-4 font-semibold uppercase tracking-wide">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-gray-500">Loading stations...</td>
                </tr>
              ) : stations.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-gray-500">
                    No charging stations found
                  </td>
                </tr>
              ) : (
                stations.map((station) => (
                  <tr key={station.stationId} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-medium text-gray-900">#{station.stationId}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium transition ${
                          station.status === "Available"
                            ? "bg-green-200 text-green-900"
                            : station.status === "Charging"
                            ? "bg-yellow-200 text-yellow-900"
                            : "bg-red-200 text-red-900"
                        }`}
                      >
                        {station.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono">{station.power} kW</td>
                    <td className="px-6 py-4">
                      {editingStation === station.stationId ? (
                        <div className="flex items-center gap-2">
                          <select
                            value={selectedStatus[station.stationId] || ""}
                            onChange={(e) =>
                              setSelectedStatus((prev) => ({
                                ...prev,
                                [station.stationId]: e.target.value,
                              }))
                            }
                            className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 bg-white text-sm"
                          >
                            <option value="">Select Status</option>
                            <option value="Available">Available</option>
                            <option value="Charging">Charging</option>
                            <option value="Out of Service">Out of Service</option>
                          </select>
                          <button
                            onClick={() => handleUpdateStatus(station.stationId)}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingStation(null)}
                            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setEditingStation(station.stationId)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium flex items-center transition"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-2"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                          Update
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
