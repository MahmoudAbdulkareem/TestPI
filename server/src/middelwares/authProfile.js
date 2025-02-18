const jwt = require('jsonwebtoken');
require('dotenv').config();

const authProfile = (allowedRoles = []) => {
    return (req, res, next) => {
        try {
            const authHeader = req.header('Authorization');

            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({ message: 'Access denied. No valid token provided.' });
            }

            const token = authHeader.split(' ')[1]; // Extract token after 'Bearer'
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Log the decoded token to check its contents
            console.log("Decoded Token:", decoded); 

            req.user = decoded; // Attach decoded user data to request

            // Check if 'role' exists in decoded token
            if (!req.user || !req.user.role) {
                return res.status(400).json({ message: 'Role not found in token.' });
            }

            console.log("User Role from Token:", req.user.role); // Now `req.user` is set
            console.log("Allowed Roles:", allowedRoles);
            
            // Check if user's role is allowed
            if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
                return res.status(403).json({ message: 'Access denied. Unauthorized role.' });
            }

            next(); // User is authenticated and authorized, proceed to the next middleware
        } catch (error) {
            console.error('JWT Error:', error.message);
            return res.status(401).json({ message: 'Invalid or expired token' });
        }
    };
};

module.exports = authProfile;
