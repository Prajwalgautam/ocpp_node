import WebSocket from "ws";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import readline from "readline"; // Import readline for user input

// Generate a unique client device ID
const clientDeviceId = uuidv4();

// Create an interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Function to fetch available charging stations
async function getAvailableStations() {
  try {
    const response = await axios.get("http://localhost:5000/api/stations/");
    return response.data.filter((station) => station.status === "Available");
  } catch (error) {
    console.error("Error fetching stations:", error);
    return [];
  }
}

// Function to select a station from the list
async function selectStation() {
  const availableStations = await getAvailableStations();
  if (availableStations.length === 0) {
    console.log("No available stations found!");
    rl.close();
    return null;
  }

  console.log("Available Charging Stations:");
  availableStations.forEach((station, index) => {
    console.log(`${index + 1}. Station ID: ${station.stationId}`);
  });

  return new Promise((resolve) => {
    rl.question("Select a station by number: ", (input) => {
      const selectedIndex = parseInt(input, 10) - 1;
      if (selectedIndex < 0 || selectedIndex >= availableStations.length) {
        console.log("Invalid selection. Please restart and try again.");
        rl.close();
        resolve(null);
      } else {
        resolve(availableStations[selectedIndex]);
      }
    });
  });
}

// Function to update station status using the API
async function updateStationStatus(stationId, status) {
  try {
    await axios.patch(`http://localhost:5000/api/stations/${stationId}`, {
      status,
      lastUpdated: new Date().toISOString(),
      clientDeviceId,
    });
    console.log(`Station ${stationId} updated to ${status}`);
  } catch (error) {
    console.error(`Error updating station ${stationId}:`, error.message);
  }
}

// Function to connect to the OCPP server
async function connectToServer() {
  const station = await selectStation();
  if (!station) return;

  console.log(`Connecting to station: ${station.stationId}`);

  const socket = new WebSocket("ws://localhost:9220");

  socket.on("open", async () => {
    console.log(`Connected to OCPP server as ${station.stationId}`);

    // Send BootNotification with clientDeviceId
    const bootMessage = {
      messageType: "BootNotification",
      chargingStationId: station.stationId,
      status: "Available",
      clientDeviceId,
    };
    socket.send(JSON.stringify(bootMessage));

    // Update API status to "Charging"
    await updateStationStatus(station.stationId, "Charging");

    // Send periodic StatusNotification every 5 seconds
    setInterval(async () => {
      const statusMessage = {
        messageType: "StatusNotification",
        chargingStationId: station.stationId,
        status: "Charging",
        clientDeviceId,
      };
      socket.send(JSON.stringify(statusMessage));
      await updateStationStatus(station.stationId, "Charging");
    }, 5000);
  });

  socket.on("message", (data) => {
    const message = JSON.parse(data);
    console.log("Received from server:", message);
  });

  socket.on("close", async () => {
    console.log(`Disconnected from OCPP server`);
    await updateStationStatus(station.stationId, "Available");
    rl.close();
  });

  socket.on("error", (error) => {
    console.error("WebSocket error:", error);
  });
}

// Start the client
connectToServer();
