// ❌ REMOVE THIS CODE FROM userRoute.js
const authProfile = (roles = []) => {
    return (req, res, next) => {
        const token = req.header('Authorization');
        
        if (!token) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }

        try {
            const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
            req.user = decoded;

            if (roles.length && !roles.includes(req.user.role)) {
                return res.status(403).json({ message: 'Access denied. Unauthorized role.' });
            }

            next();
        } catch (error) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }
    };
};

module.exports = authProfile;
