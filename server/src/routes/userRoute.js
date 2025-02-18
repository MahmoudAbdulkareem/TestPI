const express = require('express');
const { registerUser, signInUser, getLastSignedInUser, updateUserProfile } = require('../controllers/userController');
const upload = require('../middelwares/uploadImage');
const authProfile = require('../middelwares/authProfile');

const router = express.Router();

// User registration route
router.post('/sign-up', upload.single('image'), registerUser);

// User sign-in route
router.post('/sign-in', signInUser);

router.put('/update-profile', authProfile(), updateUserProfile);


router.get('/profile', authProfile(['Business owner', 'admin']), getLastSignedInUser);

module.exports = router;
