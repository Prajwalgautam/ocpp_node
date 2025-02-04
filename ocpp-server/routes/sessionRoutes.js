import express from "express";

import { getChargingSessions, createChargingSession } from "../controllers/sessionController.js";

const router = express.Router();
router.get("/", getChargingSessions);
router.post("/", createChargingSession);

export default router;