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

        const hashedPassword = await bcrypt.hash(password, 10);
        const imageUrl = req.file ? req.file.path : "";

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            phoneNumber,
            role,
            image: imageUrl,
            isVerified: false, // Add a field to check if the user is verified
        });


        // Generate an email verification token
        const verificationToken = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        newUser.verificationToken = verificationToken;
        await newUser.save();

        // Send email with the verification link
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const verificationUrl = `http://localhost:3000/sign-in`;
        const mailOptions = {
            to: newUser.email,
            from: process.env.EMAIL_USER,
            subject: "Email Verification",
            text: `Please click the link below to verify your email address:\n\n${verificationUrl}`,
        };

        await transporter.sendMail(mailOptions);

        res.status(201).json({
            message: "User registered successfully. Please check your email to verify your account.",
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// User Sign-In
const signInUser = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }
  
      if (!user.isVerified) {
        return res.status(403).json({ message: "Please verify your email before signing in." });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
  
      const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
  
      res.json({ token, role: user.role });
    } catch (error) {
      console.error("Sign-in error:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  
// Request Password Reset
const requestPasswordReset = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString("hex");
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour
        await user.save();

        // Send email
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
        res.status(500).json({ message: "Server error", error });
    }
};

// Reset Password
const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }, // Check if token is still valid
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        // Hash new password
        user.password = await bcrypt.hash(password, 10);
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;

        await user.save();

        res.json({ message: "Password reset successful!" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Email Verification
const verifyEmail = async (req, res) => {
    try {
        console.log("Incoming request:", req.params.email);
        
        const { email } = req.params;
        const user = await User.findOne({ email });

        if (!user) {
            console.log("User not found for email:", email);
            return res.status(404).json({ message: "User not found" });
        }

        if (user.isVerified) {
            console.log("User already verified:", email);
            return res.status(400).json({ message: "Email is already verified" });
        }

        user.isVerified = true;
        await user.save();
        console.log("User verified successfully:", email);

        res.status(200).json({ message: "Email verified successfully!" });
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ message: "Server error", error });
    }
};



const sendVerificationEmail = async (email, verificationUrl) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        to: email,
        from: process.env.EMAIL_USER,
        subject: "Email Verification",
        text: `Click the link to verify your email: ${verificationUrl}`,
    };

    await transporter.sendMail(mailOptions);
};


// Resend Verification Email
const resendVerificationEmail = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: "Email already verified" });
        }

        // Generate a new email verification token
        const verificationToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        // Send email with the new verification link
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const verificationUrl = `http://localhost:3000/verify-email/${verificationToken}`;
        const mailOptions = {
            to: email,
            from: process.env.EMAIL_USER,
            subject: "Email Verification",
            text: `Please click the link to verify your email address: ${verificationUrl}`,
        };

        await transporter.sendMail(mailOptions);
        // Save the verification token to the user's document in the database
        user.verificationToken = verificationToken;
        await user.save();
        res.status(200).json({ message: "Verification email resent!" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

module.exports = { 
    registerUser, 
    signInUser, 
    requestPasswordReset, 
    resetPassword, 
    verifyEmail, 
    sendVerificationEmail,
    resendVerificationEmail 
};
