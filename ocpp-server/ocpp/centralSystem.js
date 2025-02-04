import { CentralSystem } from "ocpp-eliftech";
import WebSocket from "ws";
import axios from "axios";

export function initOCPPServer() {
  const wss = new WebSocket.Server({ port: 9220 }); // WebSocket server on port 9220
  console.log("OCPP Central System running on ws://localhost:9220");

  // Map WebSocket clients to their corresponding station IDs
  const stationMap = new Map();

  // Function to broadcast status to all connected clients
  function broadcastStatus(stationId, status, clientDeviceId) {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({
            stationId,
            status,
            clientDeviceId,
          })
        );
      }
    });
  }

  // Function to update station status via API
  async function updateStationStatus(stationId, status, clientDeviceId) {
    if (!stationId) {
      console.error("Station ID is missing. Cannot update status.");
      return;
    }
    try {
      console.log(`Updating station ${stationId} to ${status} (Client ID: ${clientDeviceId})`);
      const response = await axios.patch(
        `http://localhost:5000/api/stations/${stationId}`,
        { status, lastUpdated: new Date().toISOString(), clientDeviceId },
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("API Response:", response.data);
    } catch (error) {
      console.error(`Error updating station ${stationId}:`, error.response ? error.response.data : error.message);
    }
  }

  // Function to log charging session in the database
  async function logChargingSession(clientId, csid, startTime, endTime) {
    let duration = null;

    if (endTime) {
      duration = (new Date(endTime) - new Date(startTime)) / 1000; // Duration in seconds
    }

    try {
      const response = await axios.post("http://localhost:5000/api/charging-sessions", {
        clientId,
        csid,
        startTime,
        endTime,
        duration,
      });

      console.log("Charging session logged:", response.data);
    } catch (error) {
      console.error("Error logging charging session:", error.response ? error.response.data : error.message);
    }
  }

  wss.on("connection", (socket) => {
    console.log(`New charging station connected.`);

    // Store the connection timestamp
    const connectionTimestamp = new Date().toISOString();

    // Initialize the CentralSystem with the socket
    const centralSystem = new CentralSystem(socket);

    // Handle WebSocket messages
    socket.on("message", async (data) => {
      try {
        const message = JSON.parse(data);
        console.log(`Received message:`, message);

        // Validate incoming message
        if (!message.messageType || !message.chargingStationId) {
          console.error("Invalid message: Missing required fields (messageType or chargingStationId)");
          return;
        }

        const clientDeviceId = message.clientDeviceId || "Unknown"; // Extract Client ID

        if (message.messageType === "BootNotification") {
          // Store station ID, clientDeviceId, and connection timestamp
          stationMap.set(socket, {
            stationId: message.chargingStationId,
            clientDeviceId,
            connectionTimestamp, // Store the connection timestamp
          });
          await updateStationStatus(message.chargingStationId, "Available", clientDeviceId);
          socket.send(JSON.stringify({ status: "Accepted" }));
        } else if (message.messageType === "StatusNotification") {
          const stationInfo = stationMap.get(socket);
          if (!stationInfo) return;
          const newStatus = message.status === "Charging" ? "Charging" : "Available";
          if (newStatus !== stationInfo.status) {
            await updateStationStatus(stationInfo.stationId, newStatus, stationInfo.clientDeviceId);
          }
        } else if (message.messageType === "TransactionEvent") {
          const stationInfo = stationMap.get(socket);
          if (!stationInfo) return;

          if (message.eventType === "Started") {
            // Update station status to "Charging"
            await updateStationStatus(stationInfo.stationId, "Charging", stationInfo.clientDeviceId);
          } else if (message.eventType === "Ended") {
            const endTime = new Date().toISOString();
            console.log("Charging ended at:", endTime); // Log for debugging

            await updateStationStatus(stationInfo.stationId, "Available", stationInfo.clientDeviceId);

            // Log the charging session using the connection timestamp as the start time
            await logChargingSession(stationInfo.clientDeviceId, stationInfo.stationId, stationInfo.connectionTimestamp, endTime);
          }
        }

        // Broadcast status to all connected clients
        const stationInfo = stationMap.get(socket);
        if (stationInfo && stationInfo.status !== message.status) {
          broadcastStatus(stationInfo.stationId, message.status, stationInfo.clientDeviceId);
        }
      } catch (error) {
        console.error("Error processing message:", error);
      }
    });

    // Handle WebSocket disconnection
    socket.on("close", async () => {
      const stationInfo = stationMap.get(socket);
      if (!stationInfo) {
        console.error("Disconnected client had no associated station ID.");
        return;
      }

      console.log(`Connection closed for station: ${stationInfo.stationId} (Client ID: ${stationInfo.clientDeviceId})`);

      // Log charging session using the connection timestamp as the start time
      const endTime = new Date().toISOString();
      await logChargingSession(stationInfo.clientDeviceId, stationInfo.stationId, stationInfo.connectionTimestamp, endTime);

      // Assume that a disconnected station is now "Available" if it was "Charging"
      try {
        const { data: station } = await axios.get(`http://localhost:5000/api/stations/${stationInfo.stationId}`);
        const newStatus = station.status === "Charging" ? "Available" : "Offline";
        await updateStationStatus(stationInfo.stationId, newStatus, stationInfo.clientDeviceId);

        // Broadcast the offline status
        broadcastStatus(stationInfo.stationId, newStatus, stationInfo.clientDeviceId);
      } catch (error) {
        console.error(`Error fetching station status for ${stationInfo.stationId}:`, error.message);
      }

      // Remove the station from the map
      stationMap.delete(socket);
    });

    // Handle WebSocket errors
    socket.on("error", (err) => {
      console.error("WebSocket error:", err);
      if (err.code === "ECONNRESET") {
        console.log("Connection reset. Attempting graceful disconnection...");
        const stationInfo = stationMap.get(socket);
        if (stationInfo) {
          updateStationStatus(stationInfo.stationId, "Available", stationInfo.clientDeviceId);
        }
      }
    });

    // Add heartbeat/ping-pong mechanism
    socket.on("pong", () => {
      console.log("Received pong from client");
    });

    const heartbeatInterval = setInterval(() => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.ping();
      }
    }, 30000); // Send ping every 30 seconds

    socket.on("close", () => {
      clearInterval(heartbeatInterval);
    });
  });
}