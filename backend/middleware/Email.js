import { Verification_Email_Template, Welcome_Email_Template } from "../libs/EmailTemplate.js";
import { transporter } from "./Email.config.js";

export const SendVerificationCode = async (email, verificationToken) => {
    try {
        const response = await transporter.sendMail({
            from: '"StudyBuddy " <mkviggu@gmail.com>',
            to: email,
            subject: "Verify your Email",
            text: "Verify your Email",
            html: Verification_Email_Template.replace("{verificationToken}", verificationToken),
        });
        console.log('Email Sent Successfully', response);
    } catch (error) {
        console.error('Email Error:', error);
    }
};

export const WelcomeEmail = async (email, name) => {
    try {
        const response = await transporter.sendMail({
            from: '"StudyBuddy " <mkviggu@gmail.com>',
            to: email,
            subject: "Welcome Email",
            text: "Welcome Email",
            html: Welcome_Email_Template.replace("{name}", name),
        });
        console.log('Email Sent Successfully', response);
    } catch (error) {
        console.error('Email Error:', error);
    }
};
