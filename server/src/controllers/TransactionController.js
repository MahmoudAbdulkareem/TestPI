const jwt = require('jsonwebtoken');
const Transaction = require('../models/Transaction');
const User = require('../models/user');
const twilio = require('twilio');
const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER } = process.env;
const mongoose = require('mongoose');



const viewTransaction = async (req, res) => {
  try {
    const transactions = await Transaction.find().exec();
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transactions', error: error.message });
  }
};



const sendSMS = async (to, message) => {
  const phoneRegex = /^\+216\d{8}$/; 
  if (!phoneRegex.test(to)) {
    throw new Error("Invalid phone number format. Make sure it's in E.164 format (+216XXXXXXXX).");
  }

  const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
  try {
    await client.messages.create({
      body: message,
      from: TWILIO_PHONE_NUMBER,
      to: to,
    });
  } catch (error) {
    console.error('Twilio Error:', error); 
    throw new Error('Error sending SMS: ' + error.message);
  }
};



const triggerSMSNotification = async (req, res) => {
  try {
    const { transactionId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(transactionId)) {
      return res.status(400).json({ message: "Invalid transaction ID" });
    }

    const transaction = await Transaction.findById(transactionId)
      .populate('user') 
      .populate('recipient');  

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    const user = transaction.user;
    if (!user || !user.phoneNumber) {
      return res.status(400).json({ message: 'User phone number not found' });
    }

    if (transaction.amount > 500) {
      const message = `🚨 Critical Transaction Alert: ${transaction.type.toUpperCase()} of $${transaction.amount} on ${new Date(transaction.date).toLocaleString()}`;
        
      await sendSMS(user.phoneNumber, message);
      return res.status(200).json({ message: 'SMS Sent!' });
    } else {
      return res.status(400).json({ message: 'Transaction does not meet the SMS criteria' });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error triggering SMS notification', error: error.message });
  }
};
module.exports = { viewTransaction, triggerSMSNotification };
