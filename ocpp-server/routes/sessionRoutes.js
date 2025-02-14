import express from "express";
import { getChargingSessions, createChargingSession, getChargingSessionsById } from "../controllers/sessionController.js";

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




/**
* @swagger
* /api/charging-sessions/{clientId}:
*   get:
*     summary: Retrieve charging sessions by client ID
*     description: Get a list of charging sessions for a specific client.
*     parameters:
*       - in: path
*         name: clientId
*         required: true
*         description: ID of the client or device
*         schema:
*           type: string
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
*       404:
*         description: No charging sessions found for the client.
*       500:
*         description: Server error.
*/
router.get('/:clientId', getChargingSessionsById);


export default router;
