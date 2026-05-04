import crypto from "crypto";

const OTP_LENGTH = 6;
const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes

export function generateOTP(): string {
  const bytes = crypto.randomBytes(4);
  const num = bytes.readUInt32BE(0);
  const otp = (num % Math.pow(10, OTP_LENGTH))
    .toString()
    .padStart(OTP_LENGTH, "0");
  return otp;
}

export function getOTPExpiry(): Date {
  return new Date(Date.now() + OTP_TTL_MS);
}

export function isOTPExpired(expiresAt: Date): boolean {
  return new Date() > expiresAt;
}
