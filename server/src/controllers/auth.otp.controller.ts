import type { Request, Response } from "express";
import { OTP } from "../models/OTP.model";
import { User } from "../models/User.model";
import { generateOTP, getOTPExpiry, isOTPExpired } from "../utils/otp";
import { sendOtpEmail } from "../utils/email";
import { successResponse, errorResponse } from "../utils/response";
import type { OtpPurpose } from "../models/OTP.model";

// POST /api/auth/otp/send
export async function sendOtp(req: Request, res: Response): Promise<void> {
  const { email, purpose } = req.body as { email: string; purpose: OtpPurpose };

  const user = await User.findOne({ email });
  if (!user) {
    errorResponse(res, "Email not found", 404);
    return;
  }

  // Invalidate previous OTPs for same purpose
  await OTP.deleteMany({ email, purpose });

  const otp = generateOTP();
  await OTP.create({ email, otp, purpose, expiresAt: getOTPExpiry() });
  await sendOtpEmail({ to: email, otp, purpose });

  successResponse(res, { message: "OTP sent to your email" }, "OTP sent");
}

// POST /api/auth/otp/verify
export async function verifyOtp(req: Request, res: Response): Promise<void> {
  const { email, otp, purpose } = req.body as {
    email: string;
    otp: string;
    purpose: OtpPurpose;
  };

  const record = await OTP.findOne({ email, purpose, used: false }).sort({
    createdAt: -1,
  });

  if (!record) {
    errorResponse(res, "OTP not found or already used", 400);
    return;
  }
  if (isOTPExpired(record.expiresAt)) {
    errorResponse(res, "OTP has expired", 400);
    return;
  }
  if (record.otp !== otp) {
    errorResponse(res, "Invalid OTP", 400);
    return;
  }

  // Mark as used
  record.used = true;
  await record.save();

  // If email-verification, activate the user
  if (purpose === "email-verification") {
    await User.findOneAndUpdate(
      { email },
      {
        isEmailVerified: true,
        status: "active",
      },
    );
  }

  successResponse(
    res,
    { verified: true, message: "OTP verified successfully" },
    "OTP verified",
  );
}
