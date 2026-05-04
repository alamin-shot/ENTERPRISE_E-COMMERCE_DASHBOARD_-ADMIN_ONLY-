import type { Request, Response } from "express";
import { User } from "../models/User.model";
import { hashPassword, comparePassword } from "../utils/bcrypt";
import { generateTokenPair, verifyRefreshToken } from "../utils/jwt";
import { successResponse, errorResponse } from "../utils/response";
import { OTP } from "../models/OTP.model";
import { generateOTP, getOTPExpiry } from "../utils/otp";
import { sendOtpEmail } from "../utils/email";

// POST /api/auth/login
export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body as { email: string; password: string };

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    errorResponse(res, "Invalid credentials", 401);
    return;
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    errorResponse(res, "Invalid credentials", 401);
    return;
  }

  if (!user.isEmailVerified) {
    errorResponse(res, "Please verify your email first", 403);
    return;
  }
  if (user.status === "suspended") {
    errorResponse(res, "Account suspended", 403);
    return;
  }

  user.lastLoginAt = new Date();
  await user.save();

  const { accessToken, refreshToken } = generateTokenPair(
    user._id.toString(),
    user.email,
    user.role,
  );

  successResponse(
    res,
    {
      user: {
        id: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        avatar: user.avatar,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt.toISOString(),
      },
      accessToken,
      refreshToken,
    },
    "Login successful",
  );
}

// POST /api/auth/register
export async function register(req: Request, res: Response): Promise<void> {
  const { firstName, lastName, email, password } = req.body as {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  };

  const existing = await User.findOne({ email });
  if (existing) {
    errorResponse(res, "Email already registered", 409);
    return;
  }

  const hashed = await hashPassword(password);
  const user = await User.create({
    firstName,
    lastName,
    email,
    password: hashed,
    role: "viewer",
    status: "pending",
    isEmailVerified: false,
  });

  // Send email verification OTP
  const otp = generateOTP();
  await OTP.create({
    email,
    otp,
    purpose: "email-verification",
    expiresAt: getOTPExpiry(),
  });
  await sendOtpEmail({ to: email, otp, purpose: "email-verification" });

  successResponse(
    res,
    { email: user.email, message: "OTP sent to email" },
    "Registration successful. Check your email for OTP.",
    201,
  );
}

// POST /api/auth/logout
export async function logout(_req: Request, res: Response): Promise<void> {
  successResponse(res, null, "Logged out successfully");
}

// GET /api/auth/me
export async function getMe(req: Request, res: Response): Promise<void> {
  const user = req.user!;
  successResponse(
    res,
    {
      id: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      avatar: user.avatar,
      isEmailVerified: user.isEmailVerified,
      createdAt: user.createdAt.toISOString(),
    },
    "User fetched",
  );
}

// POST /api/auth/refresh
export async function refreshToken(req: Request, res: Response): Promise<void> {
  const { refreshToken: token } = req.body as { refreshToken: string };
  try {
    const payload = verifyRefreshToken(token);
    const user = await User.findById(payload.sub);
    if (!user) {
      errorResponse(res, "User not found", 401);
      return;
    }

    const { accessToken } = generateTokenPair(
      user._id.toString(),
      user.email,
      user.role,
    );
    successResponse(res, { accessToken }, "Token refreshed");
  } catch {
    errorResponse(res, "Invalid refresh token", 401);
  }
}
