/*const express = require('express');
const twilio = require('twilio');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Twilio credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;
const client = twilio(accountSid, authToken);

// Endpoint to send SMS
app.post('/send-sms', async (req, res) => {
  const { message, toPhoneNumber } = req.body;

  if (!toPhoneNumber || !message) {
    return res.status(400).json({ error: 'Missing required fields: toPhoneNumber, message' });
  }

  try {
    const sms = await client.messages.create({
      body: message,
      from: twilioPhone,
      to: toPhoneNumber,
    });

    res.json({ success: true, messageSid: sms.sid });
  } catch (error) {
    console.error('Failed to send SMS:', error);
    res.status(500).json({ error: 'Failed to send SMS', details: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));*/


import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import SessionCard from './SessionCard'; // Adjust to './pages/SessionCard' if in pages/
import Summarizer from './pages/Summarizer';
import { ScoreProvider } from './pages/ScoreContext.jsx';

const root = ReactDOM.createRoot(document.getElementById('root')); // Fixed typo
root.render(
  <React.StrictMode>
    <ScoreProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route path="session" element={<SessionCard />} />
            <Route path="summarizer" element={<Summarizer />} />
            <Route path="*" element={<Navigate to="/session" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ScoreProvider>
  </React.StrictMode>
);