const express = require('express');
const { registerUser, signInUser, getLastSignedInUser, updateUserProfile } = require('../controllers/userController');
const upload = require('../middelwares/uploadImage');
const router = express.Router();

router.post('/sign-up', upload.single('image'), registerUser);
router.post('/sign-in', signInUser);
router.get('/last-signed-in-user', getLastSignedInUser);
router.put('/update-profile', upload.single('image'), updateUserProfile); // New route to update user profile

module.exports = router;
