import express from "express";
import { createStation, getGuns, getStations, updateGunStatus, updateStationStatus } from "../controllers/stationController.js";

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


/**
 * @swagger
 * /api/stations/addStation:
 *   post:
 *     summary: Add a new charging station
 *     description: Add a new charging station with a unique station ID, power rating, and charge guns.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               stationId:
 *                 type: string
 *                 example: "ST12345"
 *               power:
 *                 type: number
 *                 example: 22.5
 *               chargeGuns:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     gunId:
 *                       type: string
 *                       example: "GUN1"
 *                     power:
 *                       type: number
 *                       example: 11.25
 *     required:
 *       - stationId
 *       - power
 *       - chargeGuns
 *     responses:
 *       201:
 *         description: Station created successfully.
 *       400:
 *         description: Invalid request.
 *       500:
 *         description: Server error.
 */


router.post("/addStation", createStation);


/**
 * @swagger
 * /api/stations/{stationId}/guns:
 *   get:
 *     summary: Retrieve charging guns by station ID
 *     description: Get a list of charging guns for a specific station.
 *     parameters:
 *       - in: path
 *         name: stationId
 *         required: true
 *         description: ID of the station
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of charging guns.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   gunId:
 *                     type: string
 *                     example: "GUN1"
 *                   status:
 *                     type: string
 *                     enum: ["Available", "Charging", "Out of Service"]
 *                     example: "Available"
 *                   power:
 *                     type: number
 *                     example: 11.25
 *       404:
 *         description: No charging guns found for the station.
 *       500:
 *         description: Server error.
 */

router.get("/:stationId/guns", getGuns);


/**
 * @swagger
 * /api/stations/{stationId}/guns/{gunId}:
 *   patch:
 *     summary: Update the status of a charging gun
 *     description: Modify the status of a charging gun by its ID and station ID.
 *     parameters:
 *       - in: path
 *         name: stationId
 *         required: true
 *         schema:
 *           type: string
 *         description: The station ID
 *       - in: path
 *         name: gunId
 *         required: true
 *         schema:
 *           type: string
 *         description: The gun ID
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
 *         description: Gun status updated successfully.
 *       400:
 *         description: Invalid request.
 *       404:
 *         description: Station or gun not found.
 *       500:
 *         description: Server error.
 */


router.patch("/:stationId/guns/:gunId", updateGunStatus);
export default router;
