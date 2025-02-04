import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { initOCPPServer } from "./ocpp/centralSystem.js";
import stationRoutes from "./routes/stationRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";

// Initialize the express app first
const app = express();
app.use(express.json());
// Initialize the HTTP server after app is declared
const httpServer = createServer(app);

// Set up socket.io with the HTTP server
const io = new Server(httpServer, { cors: { origin: "*" } });

// Initialize OCPP Server with the HTTP server
initOCPPServer(httpServer);

// Load environment variables
dotenv.config();

// Use middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

// API Routes
app.use("/api/stations", stationRoutes);
app.use("/api/charging-sessions", sessionRoutes);

const PORT = process.env.PORT || 5000;

// Start the HTTP server
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`OCPP Server running on ws://localhost:${PORT}/ocpp`);
});
