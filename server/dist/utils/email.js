"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOtpEmail = sendOtpEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_1 = require("../config/env");
const transporter = nodemailer_1.default.createTransport({
    host: env_1.env.smtpHost,
    port: env_1.env.smtpPort,
    secure: env_1.env.smtpPort === 465,
    auth: {
        user: env_1.env.smtpUser,
        pass: env_1.env.smtpPass,
    },
});
const SUBJECT_MAP = {
    "email-verification": "Verify your email — Enterprise Dashboard",
    "password-reset": "Reset your password — Enterprise Dashboard",
    "login-2fa": "Your login OTP — Enterprise Dashboard",
};
async function sendOtpEmail({ to, otp, purpose, }) {
    const subject = SUBJECT_MAP[purpose];
    try {
        await transporter.sendMail({
            from: env_1.env.smtpFrom,
            to,
            subject,
            html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px">
          <h2 style="color:#1F2833">Enterprise Dashboard</h2>
          <p style="color:#4a5a72">Your one-time code is:</p>
          <div style="background:#0f1117;border-radius:12px;padding:24px;text-align:center;margin:24px 0">
            <span style="font-size:36px;font-weight:bold;letter-spacing:8px;color:#F5A623;font-family:monospace">
              ${otp}
            </span>
          </div>
          <p style="color:#6b7a93;font-size:13px">
            This code expires in <strong>10 minutes</strong>. Do not share it with anyone.
          </p>
        </div>
      `,
        });
    }
    catch (error) {
        console.error("[Email Error] Failed to send email. Check SMTP configuration in .env:", error);
        if (env_1.env.nodeEnv === "development") {
            console.log(`\n[DEV MODE] Captured OTP for ${to}: ${otp}\n`);
        }
        else {
            throw error;
        }
    }
}
