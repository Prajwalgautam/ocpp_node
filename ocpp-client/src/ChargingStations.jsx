import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ChargingStation from "../../ocpp-server/models/ChargingStation";
import './styles.css'; // Import your custom CSS file

function ChargingStations() {
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
    <div className="charging-stations-container">
      <ToastContainer position="top-right" autoClose={3000} />
      <a href="/dashboard" className="dashboard-link">Dashboard</a>
      <div className="stations-table-container">
        <h1 className="title">🔌 Charging Station Manager</h1>

        <div className="stations-table">
          <table className="stations-table-content">
            <thead>
              <tr>
                {["Station ID", "Status", "Power (kW)", "Actions"].map((header) => (
                  <th key={header} className="table-header">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="loading-cell">Loading stations...</td>
                </tr>
              ) : stations.length === 0 ? (
                <tr>
                  <td colSpan="4" className="no-stations-cell">
                    No charging stations found
                  </td>
                </tr>
              ) : (
                stations.map((station) => (
                  <tr key={station.stationId} className="station-row">
                    <td className="station-id">#{station.stationId}</td>
                    <td className="station-status">
                      <span className={`status-badge ${station.status.toLowerCase()}`}>
                        {station.status}
                      </span>
                    </td>
                    <td className="station-power">{station.power} kW</td>
                    <td className="station-actions">
                      {editingStation === station.stationId ? (
                        <div className="status-update-controls">
                          <select
                            value={selectedStatus[station.stationId] || ""}
                            onChange={(e) =>
                              setSelectedStatus((prev) => ({
                                ...prev,
                                [station.stationId]: e.target.value,
                              }))
                            }
                            className="status-select"
                          >
                            <option value="">Select Status</option>
                            <option value="Available">Available</option>
                            <option value="Charging">Charging</option>
                            <option value="Out of Service">Out of Service</option>
                          </select>
                          <button
                            onClick={() => handleUpdateStatus(station.stationId)}
                            className="save-button"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingStation(null)}
                            className="cancel-button"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setEditingStation(station.stationId)}
                          className="update-button"
                        >
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

export default ChargingStations;
