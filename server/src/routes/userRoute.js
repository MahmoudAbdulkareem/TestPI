const express = require('express');
const { registerUser , signInUser , verifyEmail , resendVerificationEmail } = require('../controllers/userController');
const upload = require('../middelwares/uploadImage');
const router = express.Router();

router.post('/sign-up', upload.single('image'), registerUser);
router.post('/sign-in', signInUser);
router.post('/verify-email/:token', verifyEmail);
router.post('/resend-verification-email', resendVerificationEmail);


module.exports = router;
