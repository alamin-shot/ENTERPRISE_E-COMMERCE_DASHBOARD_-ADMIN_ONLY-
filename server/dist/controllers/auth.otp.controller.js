"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOtp = sendOtp;
exports.verifyOtp = verifyOtp;
const OTP_model_1 = require("../models/OTP.model");
const User_model_1 = require("../models/User.model");
const otp_1 = require("../utils/otp");
const email_1 = require("../utils/email");
const response_1 = require("../utils/response");
// POST /api/auth/otp/send
async function sendOtp(req, res) {
    const { email, purpose } = req.body;
    const user = await User_model_1.User.findOne({ email });
    if (!user) {
        (0, response_1.errorResponse)(res, "Email not found", 404);
        return;
    }
    // Invalidate previous OTPs for same purpose
    await OTP_model_1.OTP.deleteMany({ email, purpose });
    const otp = (0, otp_1.generateOTP)();
    await OTP_model_1.OTP.create({ email, otp, purpose, expiresAt: (0, otp_1.getOTPExpiry)() });
    await (0, email_1.sendOtpEmail)({ to: email, otp, purpose });
    (0, response_1.successResponse)(res, { message: "OTP sent to your email" }, "OTP sent");
}
// POST /api/auth/otp/verify
async function verifyOtp(req, res) {
    const { email, otp, purpose } = req.body;
    const record = await OTP_model_1.OTP.findOne({ email, purpose, used: false }).sort({
        createdAt: -1,
    });
    if (!record) {
        (0, response_1.errorResponse)(res, "OTP not found or already used", 400);
        return;
    }
    if ((0, otp_1.isOTPExpired)(record.expiresAt)) {
        (0, response_1.errorResponse)(res, "OTP has expired", 400);
        return;
    }
    if (record.otp !== otp) {
        (0, response_1.errorResponse)(res, "Invalid OTP", 400);
        return;
    }
    // Mark as used
    record.used = true;
    await record.save();
    // If email-verification, activate the user
    if (purpose === "email-verification") {
        await User_model_1.User.findOneAndUpdate({ email }, {
            isEmailVerified: true,
            status: "active",
        });
    }
    (0, response_1.successResponse)(res, { verified: true, message: "OTP verified successfully" }, "OTP verified");
}
