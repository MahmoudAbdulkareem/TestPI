const express = require('express');
const { viewProfile, updateProfile, changePassword } = require('../controllers/profileController');

const upload = require('../middlewares/uploadImage');
const router = express.Router();

router.get('/view', viewProfile); 
router.put('/edit', upload.single('image'), updateProfile);
router.put('/change-password', changePassword);

module.exports = router;