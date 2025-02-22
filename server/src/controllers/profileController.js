
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const { User } = require('../models/user');

const viewProfile = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: "Unauthorized. No token provided." });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token

        const user = await User.findById(decoded.userId).exec(); // Use `userId` from token
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Invalid token" });
        }
        res.status(500).json({ message: error.message });
    }
};


const updateProfile = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: "Unauthorized. No token provided." });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
        const userId = decoded.userId; // Get user ID from decoded token

        const updatedData = req.body;

        if (req.file) {
            updatedData.image = req.file.path;
        }

        const user = await User.findByIdAndUpdate(userId, updatedData, { new: true });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Invalid token" });
        }
        res.status(500).json({ message: error.message });
    }
};

const changePassword = async (req, res) => {
    try {
        console.log("🔹 Incoming request to change password");

        // Extract Authorization Header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            console.error("❌ Unauthorized request - No token provided");
            return res.status(401).json({ message: "Unauthorized. No token provided." });
        }

        const token = authHeader.split(" ")[1];
        console.log("🔹 Token received:", token);

        // Verify Token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log("🔹 Decoded token:", decoded);
        } catch (err) {
            console.error("❌ Invalid token:", err.message);
            return res.status(401).json({ message: "Invalid token" });
        }

        const userId = decoded.userId;
        console.log("🔹 User ID from token:", userId);

        // Extract New Passwords
        const { newPassword, confirmPassword } = req.body;
        console.log("🔹 Passwords received:", { newPassword, confirmPassword });

        if (!newPassword || !confirmPassword) {
            console.error("❌ Missing password fields");
            return res.status(400).json({ message: "Please provide both new password and confirm password." });
        }

        if (newPassword.length < 8) {
            console.error("❌ Password too short");
            return res.status(400).json({ message: "Password must be at least 8 characters long." });
        }

        if (newPassword !== confirmPassword) {
            console.error("❌ Passwords do not match");
            return res.status(400).json({ message: "Passwords do not match." });
        }

        // Hash New Password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        console.log("🔹 Password hashed successfully");

        // Update User Password in Database
        const user = await User.findByIdAndUpdate(userId, { password: hashedPassword }, { new: true });

        if (!user) {
            console.error("❌ User not found in database");
            return res.status(404).json({ message: "User not found" });
        }

        console.log("✅ Password updated successfully for user:", userId);
        res.status(200).json({ message: "Password changed successfully" });

    } catch (error) {
        console.error("❌ Change Password Error:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

module.exports = { viewProfile, updateProfile, changePassword };
