import mongoose from "mongoose";

const chargingStationSchema = new mongoose.Schema({
  stationId: { type: String, required: true, unique: true },
  status: { type: String, enum: ["Available", "Charging", "Out of Service"], default: "Available" },
  power: { type: Number, required: true }, // kW
  lastUpdated: { type: Date, default: Date.now }
});

export default mongoose.model("ChargingStation", chargingStationSchema);
