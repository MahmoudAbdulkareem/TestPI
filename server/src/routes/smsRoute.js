const express = require('express');
const router = express.Router();
const { sendSMS } = require('../controllers/smsService'); 

router.post('/send', async (req, res) => {
  const { to, message } = req.body;
  try {
    await sendSMS(to, message);
    res.status(200).json({ success: true, message: 'SMS sent successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to send SMS', error: error.message });
  }
});

module.exports = router;
