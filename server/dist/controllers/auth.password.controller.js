"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgotPassword = forgotPassword;
exports.resetPassword = resetPassword;
exports.changePassword = changePassword;
const User_model_1 = require("../models/User.model");
const OTP_model_1 = require("../models/OTP.model");
const bcrypt_1 = require("../utils/bcrypt");
const otp_1 = require("../utils/otp");
const email_1 = require("../utils/email");
const response_1 = require("../utils/response");
// POST /api/auth/forgot-password
async function forgotPassword(req, res) {
    const { email } = req.body;
    const user = await User_model_1.User.findOne({ email });
    // Always return success to prevent email enumeration
    if (!user) {
        (0, response_1.successResponse)(res, { message: "OTP sent to your email" }, "OTP sent");
        return;
    }
    await OTP_model_1.OTP.deleteMany({ email, purpose: "password-reset" });
    const otp = (0, otp_1.generateOTP)();
    await OTP_model_1.OTP.create({
        email,
        otp,
        purpose: "password-reset",
        expiresAt: (0, otp_1.getOTPExpiry)(),
    });
    await (0, email_1.sendOtpEmail)({ to: email, otp, purpose: "password-reset" });
    (0, response_1.successResponse)(res, { message: "OTP sent to your email" }, "OTP sent");
}
// POST /api/auth/reset-password
async function resetPassword(req, res) {
    const { email, otp, password } = req.body;
    const record = await OTP_model_1.OTP.findOne({
        email,
        purpose: "password-reset",
        used: false,
    }).sort({ createdAt: -1 });
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
    const hashed = await (0, bcrypt_1.hashPassword)(password);
    await User_model_1.User.findOneAndUpdate({ email }, { password: hashed });
    record.used = true;
    await record.save();
    (0, response_1.successResponse)(res, { message: "Password updated successfully" }, "Password reset successful");
}
// POST /api/auth/change-password (authenticated)
async function changePassword(req, res) {
    const { currentPassword, newPassword } = req.body;
    const user = await User_model_1.User.findById(req.user._id).select("+password");
    if (!user) {
        (0, response_1.errorResponse)(res, "User not found", 404);
        return;
    }
    const isMatch = await (0, bcrypt_1.comparePassword)(currentPassword, user.password);
    if (!isMatch) {
        (0, response_1.errorResponse)(res, "Current password is incorrect", 400);
        return;
    }
    user.password = await (0, bcrypt_1.hashPassword)(newPassword);
    await user.save();
    (0, response_1.successResponse)(res, { message: "Password updated successfully" }, "Password changed");
}
