"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_otp_controller_1 = require("../controllers/auth.otp.controller");
const auth_password_controller_1 = require("../controllers/auth.password.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validate_middleware_1 = require("../middleware/validate.middleware");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
// ─── Validation Schemas ───────────────────────────────────────────────────────
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(1),
    rememberMe: zod_1.z.boolean().optional(),
});
const registerSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(2).max(50),
    lastName: zod_1.z.string().min(2).max(50),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
    confirmPassword: zod_1.z.string().min(1),
});
const otpSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    otp: zod_1.z.string().length(6),
    purpose: zod_1.z.enum(["email-verification", "password-reset", "login-2fa"]),
});
const forgotSchema = zod_1.z.object({ email: zod_1.z.string().email() });
const refreshTokenSchema = zod_1.z.object({ refreshToken: zod_1.z.string() });
const resetSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    otp: zod_1.z.string().length(6),
    password: zod_1.z.string().min(8),
    confirmPassword: zod_1.z.string().min(1),
});
const changePasswordSchema = zod_1.z.object({
    currentPassword: zod_1.z.string().min(1),
    newPassword: zod_1.z.string().min(8),
    confirmPassword: zod_1.z.string().min(1),
});
// ─── Public Routes ────────────────────────────────────────────────────────────
router.post("/login", (0, validate_middleware_1.validateBody)(loginSchema), auth_controller_1.login);
router.post("/register", (0, validate_middleware_1.validateBody)(registerSchema), auth_controller_1.register);
router.post("/refresh", (0, validate_middleware_1.validateBody)(refreshTokenSchema), auth_controller_1.refreshToken);
router.post("/otp/send", (0, validate_middleware_1.validateBody)(forgotSchema), auth_otp_controller_1.sendOtp);
router.post("/otp/verify", (0, validate_middleware_1.validateBody)(otpSchema), auth_otp_controller_1.verifyOtp);
router.post("/forgot-password", (0, validate_middleware_1.validateBody)(forgotSchema), auth_password_controller_1.forgotPassword);
router.post("/reset-password", (0, validate_middleware_1.validateBody)(resetSchema), auth_password_controller_1.resetPassword);
// ─── Protected Routes ─────────────────────────────────────────────────────────
router.get("/me", auth_middleware_1.authenticate, auth_controller_1.getMe);
router.post("/logout", auth_middleware_1.authenticate, auth_controller_1.logout);
router.post("/change-password", auth_middleware_1.authenticate, (0, validate_middleware_1.validateBody)(changePasswordSchema), auth_password_controller_1.changePassword);
exports.default = router;
