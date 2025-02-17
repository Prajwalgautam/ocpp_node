import mongoose from "mongoose";


const userDetailsSchema = new mongoose.Schema({
    clientId: { type: String, required: true }, // ID of the client or device
    username: { type: String, required: true }, // Username of the user
    phoneNumber: { type: String, required: true }, // Phone number of the user
    email: { type: String, required: true }, // Email of the user
    chargeUtilization: { type: Number, required: true }, // Charge utilization in percentage
    vehicleType: { type: String, required: true }, // Type of vehicle
    createdAt: { type: Date, default: Date.now } // Timestamp of record creation
});   

export default mongoose.model("UserDetails", userDetailsSchema);