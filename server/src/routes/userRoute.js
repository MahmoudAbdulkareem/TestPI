const express = require('express');
const { registerUser, signInUser, getLastSignedInUser, updateUserProfile } = require('../controllers/userController');
const upload = require('../middelwares/uploadImage');
const authProfile = require('../middelwares/authProfile');

const router = express.Router();

router.post('/sign-up', upload.single('image'), registerUser);
router.post('/sign-in', signInUser);
router.get('/profile', authProfile, getLastSignedInUser);
router.put('/update', authProfile, updateUserProfile);

module.exports = router;
