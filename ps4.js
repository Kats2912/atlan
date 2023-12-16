const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const twilio = require('twilio');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// MongoDB connection and Salon model remain the same

// Set up Twilio
const accountSid = 'YOUR_TWILIO_ACCOUNT_SID';
const authToken = 'YOUR_TWILIO_AUTH_TOKEN';
const twilioClient = twilio(accountSid, authToken);
const twilioPhoneNumber = 'YOUR_TWILIO_PHONE_NUMBER';

app.post('/process-user-data', async (req, res) => {
  const { username, location } = req.body;

  try {
    // Perform your custom process to find nearby salons based on the user's location
    const nearbySalons = await Salon.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: location.coordinates,
          },
          $maxDistance: 1000, // Set your desired max distance in meters
        },
      },
    });

    // Construct SMS message
    const salonNames = nearbySalons.map(salon => salon.name).join(', ');
    const smsMessage = `Hello ${username}, the nearby salons are: ${salonNames}`;

    // Send SMS
    await twilioClient.messages.create({
      body: smsMessage,
      from: twilioPhoneNumber,
      to: 'USER_PHONE_NUMBER', // Replace with the user's phone number
    });

    res.json({ success: true, message: 'SMS sent successfully' });
  } catch (error) {
    console.error('Error processing user data:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
