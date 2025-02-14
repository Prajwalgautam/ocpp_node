import { CentralSystem } from "ocpp-eliftech";
import WebSocket from "ws";
import axios from "axios";

export function initOCPPServer() {
  const wss = new WebSocket.Server({ port: 9220 });
  console.log("OCPP Central System running on ws://localhost:9220");

  const stationMap = new Map();

  // Function to broadcast status to all connected clients
  function broadcastStatus(stationId, gunId, status, clientDeviceId) {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({
            stationId,
            gunId,
            status,
            clientDeviceId,
          })
        );
      }
    });
  }

  // Function to update gun status via API
  async function updateGunStatus(stationId, gunId, status, clientDeviceId) {
    if (!stationId || !gunId) {
      console.error("Station ID or Gun ID is missing. Cannot update status.");
      return;
    }
    try {
      console.log(`Updating gun ${gunId} at station ${stationId} to ${status} (Client ID: ${clientDeviceId})`);
      const response = await axios.patch(
        `http://localhost:5000/api/stations/${stationId}/guns/${gunId}`,
        { status, lastUpdated: new Date().toISOString(), clientDeviceId },
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("API Response:", response.data);
    } catch (error) {
      console.error(`Error updating gun ${gunId} at station ${stationId}:`, error.response ? error.response.data : error.message);
    }
  }

  // Function to log charging session in the database
  async function logChargingSession(clientId, csid, gunId, startTime, endTime) {
    let duration = null;

    if (endTime) {
      duration = (new Date(endTime) - new Date(startTime)) / 1000;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/charging-sessions", {
        clientId,
        csid,
        gunId,
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
    console.log("New charging station connected.");

    const connectionTimestamp = new Date().toISOString();
    const centralSystem = new CentralSystem(socket);

    socket.on("message", async (data) => {
      try {
        const message = JSON.parse(data);
        console.log("Received message:", message);

        if (!message.messageType || !message.chargingStationId || !message.gunId) {
          console.error("Invalid message: Missing required fields (messageType, chargingStationId, or gunId)");
          return;
        }

        const clientDeviceId = message.clientDeviceId || "Unknown";

        if (message.messageType === "BootNotification") {
          stationMap.set(socket, {
            stationId: message.chargingStationId,
            gunId: message.gunId,
            clientDeviceId,
            connectionTimestamp,
          });
          await updateGunStatus(message.chargingStationId, message.gunId, "Available", clientDeviceId);
          socket.send(JSON.stringify({ status: "Accepted" }));
        } else if (message.messageType === "StatusNotification") {
          const stationInfo = stationMap.get(socket);
          if (!stationInfo) return;
          const newStatus = message.status === "Charging" ? "Charging" : "Available";
          if (newStatus !== stationInfo.status) {
            await updateGunStatus(stationInfo.stationId, stationInfo.gunId, newStatus, stationInfo.clientDeviceId);
          }
        } else if (message.messageType === "TransactionEvent") {
          const stationInfo = stationMap.get(socket);
          if (!stationInfo) return;

          if (message.eventType === "Started") {
            await updateGunStatus(stationInfo.stationId, stationInfo.gunId, "Charging", stationInfo.clientDeviceId);
          } else if (message.eventType === "Ended") {
            const endTime = new Date().toISOString();
            console.log("Charging ended at:", endTime);

            await updateGunStatus(stationInfo.stationId, stationInfo.gunId, "Available", stationInfo.clientDeviceId);
            await logChargingSession(
              stationInfo.clientDeviceId,
              stationInfo.stationId,
              stationInfo.gunId,
              stationInfo.connectionTimestamp,
              endTime
            );
          }
        }

        const stationInfo = stationMap.get(socket);
        if (stationInfo && stationInfo.status !== message.status) {
          broadcastStatus(stationInfo.stationId, stationInfo.gunId, message.status, stationInfo.clientDeviceId);
        }
      } catch (error) {
        console.error("Error processing message:", error);
      }
    });

    socket.on("close", async () => {
      const stationInfo = stationMap.get(socket);
      if (!stationInfo) {
        console.error("Disconnected client had no associated station ID.");
        return;
      }

      console.log(`Connection closed for station: ${stationInfo.stationId}, gun: ${stationInfo.gunId} (Client ID: ${stationInfo.clientDeviceId})`);

      const endTime = new Date().toISOString();
      await logChargingSession(
        stationInfo.clientDeviceId,
        stationInfo.stationId,
        stationInfo.gunId,
        stationInfo.connectionTimestamp,
        endTime
      );

      try {
        const { data: gun } = await axios.get(
          `http://localhost:5000/api/stations/${stationInfo.stationId}/guns/${stationInfo.gunId}`
        );
        const newStatus = gun.status === "Charging" ? "Available" : "Offline";
        await updateGunStatus(stationInfo.stationId, stationInfo.gunId, newStatus, stationInfo.clientDeviceId);
        broadcastStatus(stationInfo.stationId, stationInfo.gunId, newStatus, stationInfo.clientDeviceId);
      } catch (error) {
        console.error(`Error fetching gun status for station ${stationInfo.stationId}, gun ${stationInfo.gunId}:`, error.message);
      }

      stationMap.delete(socket);
    });

    socket.on("error", (err) => {
      console.error("WebSocket error:", err);
      if (err.code === "ECONNRESET") {
        console.log("Connection reset. Attempting graceful disconnection...");
        const stationInfo = stationMap.get(socket);
        if (stationInfo) {
          updateGunStatus(stationInfo.stationId, stationInfo.gunId, "Available", stationInfo.clientDeviceId);
        }
      }
    });

    const heartbeatInterval = setInterval(() => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.ping();
      }
    }, 30000);

    socket.on("close", () => {
      clearInterval(heartbeatInterval);
    });
  });
}