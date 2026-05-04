import { Router } from "express";
import {
  login,
  register,
  logout,
  getMe,
  refreshToken,
} from "../controllers/auth.controller";
import { sendOtp, verifyOtp } from "../controllers/auth.otp.controller";
import {
  forgotPassword,
  resetPassword,
  changePassword,
} from "../controllers/auth.password.controller";
import { authenticate } from "../middleware/auth.middleware";
import { validateBody } from "../middleware/validate.middleware";
import { z } from "zod";

const router = Router();

// ─── Validation Schemas ───────────────────────────────────────────────────────
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  rememberMe: z.boolean().optional(),
});

const registerSchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(8),
  confirmPassword: z.string().min(1),
});

const otpSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
  purpose: z.enum(["email-verification", "password-reset", "login-2fa"]),
});

const forgotSchema = z.object({ email: z.string().email() });
const refreshTokenSchema = z.object({ refreshToken: z.string() });

const resetSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
  password: z.string().min(8),
  confirmPassword: z.string().min(1),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
  confirmPassword: z.string().min(1),
});

// ─── Public Routes ────────────────────────────────────────────────────────────
router.post("/login", validateBody(loginSchema), login);
router.post("/register", validateBody(registerSchema), register);
router.post("/refresh", validateBody(refreshTokenSchema), refreshToken);
router.post("/otp/send", validateBody(forgotSchema), sendOtp);
router.post("/otp/verify", validateBody(otpSchema), verifyOtp);
router.post("/forgot-password", validateBody(forgotSchema), forgotPassword);
router.post("/reset-password", validateBody(resetSchema), resetPassword);

// ─── Protected Routes ─────────────────────────────────────────────────────────
router.get("/me", authenticate, getMe);
router.post("/logout", authenticate, logout);
router.post(
  "/change-password",
  authenticate,
  validateBody(changePasswordSchema),
  changePassword,
);

export default router;
