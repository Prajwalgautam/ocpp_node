import express from "express";
import { createUserDetails, getUserDetails, getUserDetailsById } from "../controllers/detailsController.js";

const router = express.Router();

/**
 * @swagger
 * /api/details:
 *   get:
 *     summary: Retrieve all client details
 *     description: Get a list of all client details.
 *     tags: [Client Details]
 *     responses:
 *       200:
 *         description: A list of client details.
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
 *                   username:
 *                     type: string
 *                     example: "John Doe"
 *                   phoneNumber:
 *                     type: string
 *                     example: "1234567890"
 *                   email:
 *                     type: string
 *                     example: "john.doe@example.com"
 *                   vehicleType:
 *                     type: string
 *                     example: "Electric"
 *                   chargeUtilization:
 *                     type: number
 *                     example: 45
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 */

router.get("/", getUserDetails);

/**
 * @swagger
 * /api/details/{clientId}:
 *   get:
 *     summary: Retrieve a single client's details
 *     description: Get a single client's details by clientId.
 *     tags: [Client Details]
 *     parameters:
 *       - in: path
 *         name: clientId
 *         required: true
 *         description: ID of the client
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single client's details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 clientId:
 *                   type: string
 *                   example: "CLIENT123"
 *                 username:
 *                   type: string
 *                   example: "John Doe"
 *                 phoneNumber:
 *                   type: string
 *                   example: "1234567890"
 *                 email:
 *                   type: string
 *                   example: "john.doe@example.com"
 *                 vehicleType:
 *                   type: string
 *                   example: "Electric"
 *                 chargeUtilization:
 *                   type: number
 *                   example: 45
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Server error
 */


router.get("/:clientId", getUserDetailsById);

/**
 * @swagger
 * /api/details:
 *   post:
 *     summary: Create a new client record
 *     description: Create a new client details record.
 *     tags: [Client Details]
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
 *               username:
 *                 type: string
 *                 example: "John Doe"
 *               phoneNumber:
 *                 type: string
 *                 example: "1234567890"
 *               email:
 *                 type: string
 *                 example: "john.doe@example.com"
 *               vehicleType:
 *                 type: string
 *                 example: "Electric"
 *               chargeUtilization:
 *                 type: number
 *                 example: 45
 *     responses:
 *       201:
 *         description: Client details created successfully.
 *       400:
 *         description: Invalid request.
 *       500:
 *         description: Server error.
 */



router.post("/", createUserDetails);


export default router;