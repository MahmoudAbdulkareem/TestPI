const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { validationResult } = require("express-validator");
const { image } = require("../config/cloudinary");
require("dotenv").config();

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

        if (!req.file) {
            return res.status(400).json({ message: "Image file is missing" });
        }

        const imageUrl = req.file.path; 

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            phoneNumber,
            role,
            image: imageUrl,
            isVerified: false, 
        });

        const verificationToken = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        newUser.verificationToken = verificationToken;
        await newUser.save();

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const verificationUrl = `http://localhost:5001/api/users/verify-email/${verificationToken}?email=${newUser.email}&redirect=sign-in`;

        const mailOptions = {
            to: newUser.email,
            from: process.env.EMAIL_USER,
            subject: "Email Verification",
            text: `Please click the link below to verify your email address:\n\n${verificationUrl}`,
        };

        await transporter.sendMail(mailOptions);

        res.status(201).json({ message: "User registered successfully. Please check your email to verify your account", user: newUser });
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
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role, email: user.email, image: user.image, phoneNumber: user.phoneNumber }, 
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 1000
        });

        res.status(200).json({ token, role: user.role, image: user.image , phoneNumber: user.phoneNumber});
        } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// User Logout
const logout = (req, res) => {
    res.cookie("token", "", { maxAge: 0 });
    res.json({ message: "Logged out successfully" });
};

// Check Authentication
const checkAuth = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const user = await User.findById(req.user.userId).select("-password"); // Exclude password

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUserImageByEmail = async (req, res) => {
    const { email } = req.params; // Fetch email from request parameters

    try {
        const user = await User.findOne({ email }).select('image'); // Select only the image field
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ imageUrl: user.image });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const verifyEmail = async (req, res) => {
    const { verificationToken } = req.params;
    const { email, redirect } = req.query; 

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        jwt.verify(verificationToken, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(400).json({ message: "Invalid or expired verification token" });
            }

            if (decoded.userId !== user._id.toString()) {
                return res.status(400).json({ message: "Token mismatch" });
            }

            user.isVerified = true;
            user.verificationToken = verificationToken; 
            await user.save();

            res.redirect(`http://localhost:3000/${redirect}?verified=true`);
        });
    } catch (error) {
        console.error("Error during email verification:", error);
        res.status(500).json({ message: "Server error" });
    }
};


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

        const verificationToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const verificationUrl = `http://localhost:5001/api/users/verify-email/${verificationToken}?email=${user.email}&redirect=sign-in`;
        const mailOptions = {
            to: email,
            from: process.env.EMAIL_USER,
            subject: "Email Verification",
            text: `Please click the link to verify your email address: ${verificationUrl}`,
        };



        await transporter.sendMail(mailOptions);
        user.verificationToken = verificationToken;
        await user.save();
        res.status(200).json({ message: "Verification email resent!" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};



const fetchUsersByFilters = async (req, res) => {
    const { username, email, phoneNumber, role } = req.query;

    try {
        const query = {};

        if (username) {
            query.name = { $regex: username, $options: 'i' };
        }

        if (email) {
            query.email = { $regex: email, $options: 'i' };
        }

        if (phoneNumber) {
            query.phoneNumber = { $regex: phoneNumber, $options: 'i' };
        }

        if (role) {
            query.role = role;
        }

        const users = await User.find(query);

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};




module.exports = { registerUser, signInUser, logout, checkAuth,getUserImageByEmail , verifyEmail  , resendVerificationEmail , fetchUsersByFilters};
