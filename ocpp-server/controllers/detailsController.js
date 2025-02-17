import UserDetails from "../models/UserDetails.js";

const getUserDetails = async (req, res) => {
    try {
        const userDetails = await UserDetails.find();
        res.json(userDetails);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

const getUserDetailsById = async (req, res) => {
    const { clientId } = req.params;

    try {
        const userDetails = await UserDetails.findOne({ clientId });

        if (!userDetails) {
            return res.status(404).json({ error: "Client not found" });
        }

        res.json(userDetails);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

const createUserDetails = async (req, res) => {
    const { clientId, username, phoneNumber, email, vehicleType, chargeUtilization } = req.body;

    if (!clientId || !username || !phoneNumber || !email || !vehicleType) {
        return res.status(400).json({ error: "All required fields must be provided" });
    }

    try {
        const existingUser = await UserDetails.findOne({ clientId });

        if (existingUser) {
            return res.status(400).json({ error: "Client ID already exists" });
        }

        const newUserDetails = new UserDetails({
            clientId,
            username,
            phoneNumber,
            email,
            vehicleType,
            chargeUtilization,
        });

        await newUserDetails.save();
        res.status(201).json(newUserDetails);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

export { getUserDetails, getUserDetailsById, createUserDetails };
