import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import DbCon from './libs/db.js';
import AuthRoutes from './routes/Auth.routes.js';
import twilio from 'twilio';

dotenv.config();
DbCon();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;
const client = twilio(accountSid, authToken);

const PORT = process.env.PORT || 5000;
const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json()); // Move this before routes
app.use('/uploads', express.static('uploads'));

// Routes
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

// Mount the AuthRoutes
app.use('/auth', AuthRoutes);

app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`); // Use PORT variable here
});