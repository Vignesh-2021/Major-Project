import express from 'express';
import { register, verifyemail, login, forgotPassword, resetPassword, logout, getUser, editProfile } from '../controllers/Auth.js';
import multer from 'multer';
import fs from 'fs';

const AuthRoutes = express.Router();

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const upload = multer({ storage });

AuthRoutes.post('/register', upload.single('profileImage'), register);
AuthRoutes.post('/verifyemail', verifyemail);
AuthRoutes.post('/login', login);
AuthRoutes.post('/forgot-password', forgotPassword);
AuthRoutes.post('/reset-password', resetPassword);
AuthRoutes.post('/logout', logout);
AuthRoutes.get('/users', getUser); // New route for fetching user data
AuthRoutes.patch('/edit-profile', editProfile); // New route for updating user data

export default AuthRoutes;