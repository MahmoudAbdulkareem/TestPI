const express = require('express');
const router = express.Router();
const { viewTransaction, triggerSMSNotification } = require('../controllers/TransactionController');

// Route to fetch all transactions
router.get('/viewTransaction', viewTransaction);

// Route to trigger SMS notification based on transaction ID
router.post('/trigger-sms', triggerSMSNotification);

module.exports = router;
