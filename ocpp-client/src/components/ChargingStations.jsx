import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StationTable from "./StationTable";
import { fetchStationsData, updateStationStatus, updateGunStatus } from "../api/stationApi";

function ChargingStations() {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStations();
  }, []);

  const fetchStations = async () => {
    setLoading(true);
    try {
      const data = await fetchStationsData();
      setStations(data);
    } catch (error) {
      toast.error("Failed to fetch stations");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (stationId, newStatus) => {
    if (!newStatus) {
      toast.warn("Please select a station status");
      return;
    }

    try {
      await updateStationStatus(stationId, newStatus);
      setStations((prevStations) =>
        prevStations.map((station) =>
          station.stationId === stationId ? { ...station, status: newStatus } : station
        )
      );
      toast.success("Station status updated successfully");
    } catch (error) {
      toast.error("Error updating station status");
    }
  };

  const handleUpdateGunStatus = async (stationId, gunId, newStatus) => {
    if (!newStatus) {
      toast.warn("Please select a gun status");
      return;
    }

    try {
      await updateGunStatus(stationId, gunId, newStatus);
      setStations((prevStations) =>
        prevStations.map((station) => {
          if (station.stationId === stationId) {
            return {
              ...station,
              chargeGuns: station.chargeGuns.map((gun) =>
                gun.gunId === gunId ? { ...gun, status: newStatus } : gun
              ),
            };
          }
          return station;
        })
      );
      toast.success("Charging gun status updated successfully");
    } catch (error) {
      toast.error("Error updating charging gun status");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="bg-white rounded-lg shadow-lg p-4">
        <h1 className="text-3xl font-semibold text-center text-blue-600 mb-6">🔌 Charging Station Manager</h1>
        <StationTable
          stations={stations}
          loading={loading}
          onUpdateStatus={handleUpdateStatus}
          onUpdateGunStatus={handleUpdateGunStatus}
        />
      </div>
    </div>
  );
}

export default ChargingStations;
