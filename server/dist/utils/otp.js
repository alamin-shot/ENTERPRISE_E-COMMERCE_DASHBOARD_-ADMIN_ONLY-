"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOTP = generateOTP;
exports.getOTPExpiry = getOTPExpiry;
exports.isOTPExpired = isOTPExpired;
const crypto_1 = __importDefault(require("crypto"));
const OTP_LENGTH = 6;
const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes
function generateOTP() {
    const bytes = crypto_1.default.randomBytes(4);
    const num = bytes.readUInt32BE(0);
    const otp = (num % Math.pow(10, OTP_LENGTH))
        .toString()
        .padStart(OTP_LENGTH, "0");
    return otp;
}
function getOTPExpiry() {
    return new Date(Date.now() + OTP_TTL_MS);
}
function isOTPExpired(expiresAt) {
    return new Date() > expiresAt;
}
