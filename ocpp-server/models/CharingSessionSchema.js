import mongoose from "mongoose";

const chargingSessionSchema = new mongoose.Schema({
  clientId: { type: String, required: true }, // ID of the client or device
  csid: { type: String, required: true }, // Charger Connected ID
  gunId: { type: String, required: true }, // Charging Gun ID
  startTime: { type: Date, required: true }, // When charging started
  endTime: { type: Date }, // When charging ended
  duration: { type: Number }, // Duration in minutes or seconds
  createdAt: { type: Date, default: Date.now } // Timestamp of record creation
});

export default mongoose.model("ChargingSession", chargingSessionSchema);
