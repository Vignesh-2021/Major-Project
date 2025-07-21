import { SendVerificationCode, WelcomeEmail } from "../middleware/Email.js";
import { Usermodel } from "../models/User.js";
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Reset_Email_Template } from "../libs/ResetEmailTemplate.js";
import { transporter } from "../middleware/Email.config.js";

const register = async (req, res) => {
    try {
        const { email, password, name, mobileNumber } = req.body;
        const profileImage = req.file ? req.file.filename : null;

        if (!email || !password || !name || !mobileNumber) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const ExistsUser = await Usermodel.findOne({ email });
        if (ExistsUser) {
            return res.status(400).json({ success: false, message: "User Already Exists. Please Login" });
        }

        // Validate and format mobile number
        let formattedMobileNumber = mobileNumber.trim();
        formattedMobileNumber = formattedMobileNumber.replace(/[^+\d]/g, '');
        if (!formattedMobileNumber.startsWith('+91')) {
            if (formattedMobileNumber.startsWith('+')) {
                formattedMobileNumber = formattedMobileNumber.slice(1);
            }
            formattedMobileNumber = '+91' + formattedMobileNumber;
        }
        if (formattedMobileNumber.length !== 13 || !/^\+91\d{10}$/.test(formattedMobileNumber)) {
            return res.status(400).json({ success: false, message: "Mobile number must be a valid 10-digit number" });
        }

        const ExistsMobile = await Usermodel.findOne({ mobileNumber: formattedMobileNumber });
        if (ExistsMobile) {
            return res.status(400).json({ success: false, message: "Mobile number already in use" });
        }

        const hashedPassword = await bcryptjs.hashSync(password, 10);
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

        const user = new Usermodel({
            email,
            password: hashedPassword,
            name,
            mobileNumber: formattedMobileNumber,
            profileImage,
            verificationToken
        });

        await user.save();
        SendVerificationCode(user.email, verificationToken);

        return res.status(200).json({
            success: true,
            message: "User Registered Successfully",
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                mobileNumber: user.mobileNumber
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const verifyemail = async (req, res) => {
    try {
        const { code } = req.body;
        const user = await Usermodel.findOne({
            verificationToken: code
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired code" });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save();
        await WelcomeEmail(user.email, user.name);

        return res.status(200).json({ success: true, message: "Email Verified Successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }

        const user = await Usermodel.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        if (!user.isVerified) {
            return res.status(403).json({ success: false, message: "Please verify your email before logging in" });
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET || 'yoursecretkey',
            { expiresIn: '1d' }
        );

        user.lastLogin = Date.now();
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                mobileNumber: user.mobileNumber
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }

        const user = await Usermodel.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
        const resetTokenExpiresAt = Date.now() + 3600000;

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetTokenExpiresAt;
        await user.save();

        await transporter.sendMail({
            from: '"StudyBuddy" <mkviggu@gmail.com>',
            to: email,
            subject: "Password Reset Request",
            html: Reset_Email_Template.replace("{resetToken}", resetToken),
        });

        return res.status(200).json({ success: true, message: "Password reset code sent to your email" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        if (!token || !newPassword) {
            return res.status(400).json({ success: false, message: "Token and new password are required" });
        }

        const user = await Usermodel.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
        }

        const hashedPassword = await bcryptjs.hashSync(newPassword, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;
        await user.save();

        return res.status(200).json({ success: true, message: "Password reset successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const logout = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: "No token provided" });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'yoursecretkey');

        const user = await Usermodel.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        user.lastLogin = Date.now();
        await user.save();

        return res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const getUser = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: "No token provided" });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'yoursecretkey');

        const user = await Usermodel.findById(decoded.userId).select('-password'); // Exclude password
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.status(200).json({ success: true, user });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const editProfile = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: "No token provided" });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'yoursecretkey');

        const user = await Usermodel.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const { name, email, mobileNumber, password } = req.body;

        // Validate required fields
        if (!name || !email || !mobileNumber) {
            return res.status(400).json({ success: false, message: "Name, email, and mobile number are required" });
        }

        // Validate email uniqueness
        const existingEmailUser = await Usermodel.findOne({ email });
        if (existingEmailUser && existingEmailUser._id.toString() !== user._id.toString()) {
            return res.status(400).json({ success: false, message: "Email already in use by another user" });
        }

        // Validate and format mobile number
        let formattedMobileNumber = mobileNumber.trim();
        formattedMobileNumber = formattedMobileNumber.replace(/[^+\d]/g, '');
        if (!formattedMobileNumber.startsWith('+91')) {
            if (formattedMobileNumber.startsWith('+')) {
                formattedMobileNumber = formattedMobileNumber.slice(1);
            }
            formattedMobileNumber = '+91' + formattedMobileNumber;
        }
        if (formattedMobileNumber.length !== 13 || !/^\+91\d{10}$/.test(formattedMobileNumber)) {
            return res.status(400).json({ success: false, message: "Mobile number must be a valid 10-digit number" });
        }

        // Validate mobile number uniqueness
        const existingMobileUser = await Usermodel.findOne({ mobileNumber: formattedMobileNumber });
        if (existingMobileUser && existingMobileUser._id.toString() !== user._id.toString()) {
            return res.status(400).json({ success: false, message: "Mobile number already in use by another user" });
        }

        // Update user fields
        user.name = name;
        user.email = email;
        user.mobileNumber = formattedMobileNumber;

        // Update password if provided
        if (password) {
            const hashedPassword = await bcryptjs.hashSync(password, 10);
            user.password = hashedPassword;
        }

        await user.save();

        // Return updated user data (excluding password)
        const updatedUser = await Usermodel.findById(user._id).select('-password');
        return res.status(200).json({ success: true, user: updatedUser, message: "Profile updated successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export { register, verifyemail, login, forgotPassword, resetPassword, logout, getUser, editProfile };