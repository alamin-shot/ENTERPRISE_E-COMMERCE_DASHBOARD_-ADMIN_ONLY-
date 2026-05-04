import nodemailer from "nodemailer";
import { env } from "../config/env";

const transporter = nodemailer.createTransport({
  host: env.smtpHost,
  port: env.smtpPort,
  secure: env.smtpPort === 465,
  auth: {
    user: env.smtpUser,
    pass: env.smtpPass,
  },
});

interface OtpEmailOptions {
  to: string;
  otp: string;
  purpose: "email-verification" | "password-reset" | "login-2fa";
}

const SUBJECT_MAP = {
  "email-verification": "Verify your email — Enterprise Dashboard",
  "password-reset": "Reset your password — Enterprise Dashboard",
  "login-2fa": "Your login OTP — Enterprise Dashboard",
};

export async function sendOtpEmail({
  to,
  otp,
  purpose,
}: OtpEmailOptions): Promise<void> {
  const subject = SUBJECT_MAP[purpose];

  await transporter.sendMail({
    from: env.smtpFrom,
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
