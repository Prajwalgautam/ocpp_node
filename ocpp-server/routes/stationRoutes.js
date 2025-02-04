import express from "express";
import { getStations, updateStationStatus } from "../controllers/stationController.js";

const router = express.Router();
router.get("/", getStations);
router.patch("/:stationId", updateStationStatus);

export default router;
