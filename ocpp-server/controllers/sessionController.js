import ChargingSession from "../models/CharingSessionSchema.js";

// Fetch all charging sessions
export const getChargingSessions = async (req, res) => {
  try {
    const sessions = await ChargingSession.find();
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Create a new charging session
export const createChargingSession = async (req, res) => {
  const { clientId, csid, startTime, endTime, duration } = req.body;

  try {
    const newSession = new ChargingSession({
      clientId,
      csid,
      startTime,
      endTime,
      duration,
    });
    
    await newSession.save();
    res.status(201).json(newSession);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
