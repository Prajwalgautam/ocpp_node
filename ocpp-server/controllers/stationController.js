import ChargingStation from "../models/ChargingStation.js";

// Fetch all stations
export const getStations = async (req, res) => {
  try {
    const stations = await ChargingStation.find();
    res.json(stations);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Update station status
export const updateStationStatus = async (req, res) => {
  const { stationId } = req.params;
  const { status } = req.body;

  console.log("Received API request:", { stationId, status });

  try {
    const station = await ChargingStation.findOneAndUpdate(
      { stationId },
      { status, lastUpdated: new Date() },
      { new: true }
    );

    if (!station) {
      console.log(`❌ Station with ID ${stationId} not found`);
      return res.status(404).json({ error: "Station not found" });
    }

    console.log("✅ Updated station:", station);
    res.json(station);
  } catch (error) {
    console.error("❌ Error updating station:", error);
    res.status(500).json({ error: "Server error" });
  }
};


