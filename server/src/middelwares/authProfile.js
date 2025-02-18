// authProfile.js
const jwt = require('jsonwebtoken');
const authProfile = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace with your JWT secret
        req.user = decoded; // Attach user info to request
        next(); // Proceed to next middleware/controller
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};


module.exports = authProfile;
