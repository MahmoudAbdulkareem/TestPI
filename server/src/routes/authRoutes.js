// authRoutes.js
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/refresh-token', async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token is required' });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET); // Verify refresh token using its secret
        const newAccessToken = jwt.sign(
            { userId: decoded.userId, role: decoded.role },
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }  // Set new access token expiration time (1 hour)
        );
        res.json({ accessToken: newAccessToken });
    } catch (error) {
        console.error('Refresh Token Error:', error);
        res.status(403).json({ message: 'Invalid or expired refresh token' });
    }
});

module.exports = router;
