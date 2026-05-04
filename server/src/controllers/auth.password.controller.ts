import type { Request, Response } from "express";
import { User } from "../models/User.model";
import { OTP } from "../models/OTP.model";
import { hashPassword, comparePassword } from "../utils/bcrypt";
import { generateOTP, getOTPExpiry, isOTPExpired } from "../utils/otp";
import { sendOtpEmail } from "../utils/email";
import { successResponse, errorResponse } from "../utils/response";

// POST /api/auth/forgot-password
export async function forgotPassword(
  req: Request,
  res: Response,
): Promise<void> {
  const { email } = req.body as { email: string };

  const user = await User.findOne({ email });
  // Always return success to prevent email enumeration
  if (!user) {
    successResponse(res, { message: "OTP sent to your email" }, "OTP sent");
    return;
  }

  await OTP.deleteMany({ email, purpose: "password-reset" });

  const otp = generateOTP();
  await OTP.create({
    email,
    otp,
    purpose: "password-reset",
    expiresAt: getOTPExpiry(),
  });
  await sendOtpEmail({ to: email, otp, purpose: "password-reset" });

  successResponse(res, { message: "OTP sent to your email" }, "OTP sent");
}

// POST /api/auth/reset-password
export async function resetPassword(
  req: Request,
  res: Response,
): Promise<void> {
  const { email, otp, password } = req.body as {
    email: string;
    otp: string;
    password: string;
    confirmPassword: string;
  };

  const record = await OTP.findOne({
    email,
    purpose: "password-reset",
    used: false,
  }).sort({ createdAt: -1 });

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

  const hashed = await hashPassword(password);
  await User.findOneAndUpdate({ email }, { password: hashed });

  record.used = true;
  await record.save();

  successResponse(
    res,
    { message: "Password updated successfully" },
    "Password reset successful",
  );
}

// POST /api/auth/change-password (authenticated)
export async function changePassword(
  req: Request,
  res: Response,
): Promise<void> {
  const { currentPassword, newPassword } = req.body as {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  };

  const user = await User.findById(req.user!._id).select("+password");
  if (!user) {
    errorResponse(res, "User not found", 404);
    return;
  }

  const isMatch = await comparePassword(currentPassword, user.password);
  if (!isMatch) {
    errorResponse(res, "Current password is incorrect", 400);
    return;
  }

  user.password = await hashPassword(newPassword);
  await user.save();

  successResponse(
    res,
    { message: "Password updated successfully" },
    "Password changed",
  );
}
