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

// Get charging session by client ID
export const getChargingSessionsById = async (req, res) => {
  const { clientId } = req.params;

  try {
    const sessions = await ChargingSession.find({ clientId }); // Changed to find multiple sessions
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Create a new charging session
export const createChargingSession = async (req, res) => {
  const { clientId, csid, gunId, startTime, endTime, duration } = req.body;

  if (!gunId) {
    return res.status(400).json({ error: "gunId is required" });
  }

  try {
    const newSession = new ChargingSession({
      clientId,
      csid,
      gunId,
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
