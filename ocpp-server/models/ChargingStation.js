import mongoose from "mongoose";

const chargingStationSchema = new mongoose.Schema({
  stationId: { type: String, required: true, unique: true },
  status: { type: String, enum: ["Available", "Charging", "Out of Service"], default: "Available" },
  power: { type: Number, required: true }, // kW
  lastUpdated: { type: Date, default: Date.now },
  chargeGuns: [
    {
      gunId: { type: String, required: true },
      status: { type: String, enum: ["Available", "Charging", "Out of Service"], default: "Available" },
      power: { type: Number, required: true } // kW per gun
    }
  ]
});
export default mongoose.model("ChargingStation", chargingStationSchema);
