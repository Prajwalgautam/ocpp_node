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

export const createStation = async (req, res) => {
  const { stationId, power, chargeGuns } = req.body;

  try {
    const station = await ChargingStation.create({
      stationId,
      power,
      chargeGuns,
    });

    res.status(201).json(station);
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

//get gun 
export const getGuns = async (req, res) => {
  const { stationId } = req.params;

  try {
    const station = await ChargingStation.findOne({
      stationId: stationId, // Ensuring the query filters by the stationId
    });

    if (!station) {
      console.log(`❌ Station with ID ${stationId} not found`);
      return res.status(404).json({ error: "Station not found" });
    } else {
      // Return only the guns related to that specific station
      res.json(station.chargeGuns);
    }
  } catch (error) {
    console.error("❌ Error fetching guns:", error);
    res.status(500).json({ error: "Server error" });
  }
}




// Update gun status
export const updateGunStatus = async (req, res) => {
  const { stationId, gunId } = req.params;
  const { status } = req.body;

  console.log("Received API request:", { stationId, gunId, status });

  try {
    const station = await ChargingStation.findOne({ stationId });

    if (!station) {
      console.log(`❌ Station with ID ${stationId} not found`);
      return res.status(404).json({ error: "Station not found" });
    }

    console.log("Charge Guns in Station:", station.chargeGuns);

    // Ensure case-insensitive match
    const gun = station.chargeGuns.find(g => g.gunId.toLowerCase() === gunId.toLowerCase());

    if (!gun) {
      console.log(`❌ Gun with ID ${gunId} not found`);
      return res.status(404).json({ error: "Gun not found" });
    }

    gun.status = status;
    gun.lastUpdated = new Date();

    await station.save();

    console.log("✅ Updated gun:", gun);
    res.json(gun);
  } catch (error) {
    console.error("❌ Error updating gun:", error);
    res.status(500).json({ error: "Server error" });
  }
};



