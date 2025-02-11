import express from "express";
import { getStations, updateStationStatus } from "../controllers/stationController.js";

const router = express.Router();

/**
 * @swagger
 * /api/stations:
 *   get:
 *     summary: Retrieve a list of all charging stations
 *     description: Fetch all charging stations along with their status and power.
 *     responses:
 *       200:
 *         description: A list of charging stations.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   stationId:
 *                     type: string
 *                     example: "ST12345"
 *                   status:
 *                     type: string
 *                     enum: ["Available", "Charging", "Out of Service"]
 *                     example: "Available"
 *                   power:
 *                     type: number
 *                     example: 22.5
 *                   lastUpdated:
 *                     type: string
 *                     format: date-time
 */
router.get("/", getStations);

/**
 * @swagger
 * /api/stations/{stationId}:
 *   patch:
 *     summary: Update the status of a charging station
 *     description: Modify the status of a charging station by its ID.
 *     parameters:
 *       - in: path
 *         name: stationId
 *         required: true
 *         schema:
 *           type: string
 *         description: The station ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: ["Available", "Charging", "Out of Service"]
 *                 example: "Charging"
 *     responses:
 *       200:
 *         description: Station status updated successfully.
 *       400:
 *         description: Invalid request.
 *       404:
 *         description: Station not found.
 */
router.patch("/:stationId", updateStationStatus);

export default router;
