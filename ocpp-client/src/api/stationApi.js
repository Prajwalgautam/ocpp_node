import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

export const fetchStationsData = async () => {
  const response = await axios.get(`${API_BASE_URL}/stations`);
  return response.data;
};

export const updateStationStatus = async (stationId, status) => {
  await axios.patch(`${API_BASE_URL}/stations/${stationId}`, { status });
};

export const updateGunStatus = async (stationId, gunId, status) => {
  await axios.patch(`${API_BASE_URL}/stations/${stationId}/guns/${gunId}`, { status });
};