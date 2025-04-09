const twilio = require('twilio');
const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER } = process.env;

// Function to send SMS using Twilio

const sendSMS = async (to, message) => {
  const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
  try {
    const smsResponse = await client.messages.create({
      body: message,
      from: TWILIO_PHONE_NUMBER,
      to: +21652651691
    });
    console.log('SMS Sent:', smsResponse); 
    return smsResponse;
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw error;
  }
};

module.exports = { sendSMS };
