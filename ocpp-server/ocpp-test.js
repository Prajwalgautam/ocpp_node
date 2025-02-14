import WebSocket from "ws";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import readline from "readline";

const clientDeviceId = uuidv4();
// const clientDeviceId ="e4710613-f4ea-45e0-841f-cb168663f1d1"
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function getAvailableStations() {
  try {
    const response = await axios.get("http://localhost:5000/api/stations/");
    return response.data.filter((station) => station.status === "Available");
  } catch (error) {
    console.error("Error fetching stations:", error);
    return [];
  }
}

async function getAvailableGuns(stationId) {
  try {
    const response = await axios.get(`http://localhost:5000/api/stations/${stationId}/guns`);
    return response.data.filter((gun) => gun.status === "Available");
  } catch (error) {
    console.error("Error fetching guns for station:", error);
    return [];
  }
}

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
    rl.question("Select a station by number: ", async (input) => {
      const selectedIndex = parseInt(input, 10) - 1;
      if (selectedIndex < 0 || selectedIndex >= availableStations.length) {
        console.log("Invalid selection. Please restart and try again.");
        rl.close();
        resolve(null);
      } else {
        const selectedStation = availableStations[selectedIndex];
        const availableGuns = await getAvailableGuns(selectedStation.stationId);
        if (availableGuns.length === 0) {
          console.log("No available guns at this station.");
          rl.close();
          resolve(null);
        } else {
          console.log("Available Guns:");
          availableGuns.forEach((gun, index) => {
            console.log(`${index + 1}. Gun ID: ${gun.gunId}`);
          });

          rl.question("Select a gun by number: ", (gunInput) => {
            const selectedGunIndex = parseInt(gunInput, 10) - 1;
            if (selectedGunIndex < 0 || selectedGunIndex >= availableGuns.length) {
              console.log("Invalid selection. Please restart and try again.");
              rl.close();
              resolve(null);
            } else {
              resolve({ station: selectedStation, gun: availableGuns[selectedGunIndex] });
            }
          });
        }
      }
    });
  });
}

async function updateGunStatus(stationId, gunId, status) {
  try {
    await axios.patch(`http://localhost:5000/api/stations/${stationId}/guns/${gunId}`, {
      status,
      lastUpdated: new Date().toISOString(),
      clientDeviceId,
    });
    console.log(`Gun ${gunId} at station ${stationId} updated to ${status}`);
  } catch (error) {
    console.error(`Error updating gun ${gunId} at station ${stationId}:`, error.message);
  }
}

async function connectToServer() {
  const selection = await selectStation();
  if (!selection) return;

  const { station, gun } = selection;
  console.log(`Connecting to station: ${station.stationId} and gun: ${gun.gunId}`);

  const socket = new WebSocket("ws://localhost:9220");

  socket.on("open", async () => {
    console.log(`Connected to OCPP server as ${station.stationId}`);

    const bootMessage = {
      messageType: "BootNotification",
      chargingStationId: station.stationId,
      gunId: gun.gunId,
      status: "Available",
      clientDeviceId,
    };
    socket.send(JSON.stringify(bootMessage));

    await updateGunStatus(station.stationId, gun.gunId, "Charging");

    setInterval(async () => {
      const statusMessage = {
        messageType: "StatusNotification",
        chargingStationId: station.stationId,
        gunId: gun.gunId,
        status: "Charging",
        clientDeviceId,
      };
      socket.send(JSON.stringify(statusMessage));
      await updateGunStatus(station.stationId, gun.gunId, "Charging");
    }, 5000);
  });

  socket.on("message", (data) => {
    const message = JSON.parse(data);
    console.log("Received from server:", message);
  });

  socket.on("close", async () => {
    console.log("Disconnected from OCPP server");
    await updateGunStatus(station.stationId, gun.gunId, "Available");
    rl.close();
  });

  socket.on("error", (error) => {
    console.error("WebSocket error:", error);
  });
}

connectToServer();