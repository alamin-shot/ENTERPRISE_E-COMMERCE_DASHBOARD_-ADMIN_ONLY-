"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = login;
exports.register = register;
exports.logout = logout;
exports.getMe = getMe;
exports.refreshToken = refreshToken;
const User_model_1 = require("../models/User.model");
const bcrypt_1 = require("../utils/bcrypt");
const jwt_1 = require("../utils/jwt");
const response_1 = require("../utils/response");
const OTP_model_1 = require("../models/OTP.model");
const otp_1 = require("../utils/otp");
const email_1 = require("../utils/email");
// POST /api/auth/login
async function login(req, res) {
    const { email, password } = req.body;
    const user = await User_model_1.User.findOne({ email }).select("+password");
    if (!user) {
        (0, response_1.errorResponse)(res, "Invalid credentials", 401);
        return;
    }
    const isMatch = await (0, bcrypt_1.comparePassword)(password, user.password);
    if (!isMatch) {
        (0, response_1.errorResponse)(res, "Invalid credentials", 401);
        return;
    }
    if (!user.isEmailVerified) {
        (0, response_1.errorResponse)(res, "Please verify your email first", 403);
        return;
    }
    if (user.status === "suspended") {
        (0, response_1.errorResponse)(res, "Account suspended", 403);
        return;
    }
    user.lastLoginAt = new Date();
    await user.save();
    const { accessToken, refreshToken } = (0, jwt_1.generateTokenPair)(user._id.toString(), user.email, user.role);
    (0, response_1.successResponse)(res, {
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
    }, "Login successful");
}
// POST /api/auth/register
async function register(req, res) {
    const { firstName, lastName, email, password } = req.body;
    const existing = await User_model_1.User.findOne({ email });
    if (existing) {
        (0, response_1.errorResponse)(res, "Email already registered", 409);
        return;
    }
    const hashed = await (0, bcrypt_1.hashPassword)(password);
    const user = await User_model_1.User.create({
        firstName,
        lastName,
        email,
        password: hashed,
        role: "viewer",
        status: "pending",
        isEmailVerified: false,
    });
    // Send email verification OTP
    const otp = (0, otp_1.generateOTP)();
    await OTP_model_1.OTP.create({
        email,
        otp,
        purpose: "email-verification",
        expiresAt: (0, otp_1.getOTPExpiry)(),
    });
    await (0, email_1.sendOtpEmail)({ to: email, otp, purpose: "email-verification" });
    (0, response_1.successResponse)(res, { email: user.email, message: "OTP sent to email" }, "Registration successful. Check your email for OTP.", 201);
}
// POST /api/auth/logout
async function logout(_req, res) {
    (0, response_1.successResponse)(res, null, "Logged out successfully");
}
// GET /api/auth/me
async function getMe(req, res) {
    const user = req.user;
    (0, response_1.successResponse)(res, {
        id: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        avatar: user.avatar,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt.toISOString(),
    }, "User fetched");
}
// POST /api/auth/refresh
async function refreshToken(req, res) {
    const { refreshToken: token } = req.body;
    try {
        const payload = (0, jwt_1.verifyRefreshToken)(token);
        const user = await User_model_1.User.findById(payload.sub);
        if (!user) {
            (0, response_1.errorResponse)(res, "User not found", 401);
            return;
        }
        const { accessToken } = (0, jwt_1.generateTokenPair)(user._id.toString(), user.email, user.role);
        (0, response_1.successResponse)(res, { accessToken }, "Token refreshed");
    }
    catch {
        (0, response_1.errorResponse)(res, "Invalid refresh token", 401);
    }
}
