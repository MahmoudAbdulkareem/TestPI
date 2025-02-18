const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { User } = require("../models/user");
const { validationResult } = require("express-validator");
require("dotenv").config();

// User Registration
const registerUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password, phoneNumber, role } = req.body;
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 12); // Increased bcrypt rounds for security
        const imageUrl = req.file ? req.file.path : "";

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            phoneNumber,
            role,
            image: imageUrl,
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ message: "Error during registration", error: error.message });
    }
};

// User Sign-In
const signInUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        user.lastLogin = new Date();
        await user.save();

        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(200).json({ token, role: user.role });
    } catch (error) {
        console.error("Sign-in error:", error);
        res.status(500).json({ message: "Error during sign-in", error: error.message });
    }
};

// Request Password Reset
const requestPasswordReset = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const resetToken = crypto.randomBytes(32).toString("hex");
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000;
        await user.save();

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
        const mailOptions = {
            to: user.email,
            from: process.env.EMAIL_USER,
            subject: "Password Reset",
            text: `You requested a password reset. Click the link below to reset your password:\n\n${resetUrl}\n\nThis link will expire in 1 hour.`,
        };

        await transporter.sendMail(mailOptions);
        res.json({ message: "Reset password link sent!" });
    } catch (error) {
        console.error("Password reset error:", error);
        res.status(500).json({ message: "Error during password reset", error: error.message });
    }
};

// Reset Password
const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    try {
        const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
        if (!user) return res.status(400).json({ message: "Invalid or expired token" });

        user.password = await bcrypt.hash(password, 12);
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;

        await user.save();
        res.json({ message: "Password reset successful!" });
    } catch (error) {
        console.error("Error resetting password:", error);
        res.status(500).json({ message: "Error resetting password", error: error.message });
    }
};

// Get User Profile
const getLastSignedInUser = async (req, res) => {
    try {
        console.log("Decoded User in Request:", req.user); // Debugging
        const user = await User.findById(req.user.email);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error("Error fetching user profile:", err);
        res.status(500).json({ msg: 'Server error' });
    }
};


// Update User Profile
const updateUserProfile = async (req, res) => {
    const { name, email, phoneNumber, role } = req.body;
    const { userId } = req.user;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.name = name || user.name;
        user.email = email || user.email;
        user.phoneNumber = phoneNumber || user.phoneNumber;
        user.role = role || user.role;

        if (req.file) {
            user.image = req.file.path;
        }

        const updatedUser = await user.save();
        res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ message: "Error updating profile", error: error.message });
    }
};

module.exports = { registerUser, signInUser, requestPasswordReset, resetPassword, getLastSignedInUser, updateUserProfile };
