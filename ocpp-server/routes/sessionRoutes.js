import express from "express";
import { getChargingSessions, createChargingSession } from "../controllers/sessionController.js";

const router = express.Router();

/**
 * @swagger
 * /api/charging-sessions:
 *   get:
 *     summary: Retrieve all charging sessions
 *     description: Get a list of all active and completed charging sessions.
 *     responses:
 *       200:
 *         description: A list of charging sessions.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   clientId:
 *                     type: string
 *                     example: "CLIENT123"
 *                   csid:
 *                     type: string
 *                     example: "CHARGER_001"
 *                   startTime:
 *                     type: string
 *                     format: date-time
 *                   endTime:
 *                     type: string
 *                     format: date-time
 *                   duration:
 *                     type: number
 *                     example: 45
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 */
router.get("/", getChargingSessions);

/**
 * @swagger
 * /api/charging-sessions:
 *   post:
 *     summary: Create a new charging session
 *     description: Start a new charging session with client and charger details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               clientId:
 *                 type: string
 *                 example: "CLIENT123"
 *               csid:
 *                 type: string
 *                 example: "CHARGER_001"
 *               startTime:
 *                 type: string
 *                 format: date-time
 *               endTime:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Charging session created successfully.
 *       400:
 *         description: Invalid request.
 */
router.post("/", createChargingSession);

export default router;
