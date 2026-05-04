import mongoose, { type Document, type Model, Schema } from "mongoose";

export type OtpPurpose = "email-verification" | "password-reset" | "login-2fa";

export interface IOTP extends Document {
  email: string;
  otp: string;
  purpose: OtpPurpose;
  expiresAt: Date;
  used: boolean;
  createdAt: Date;
}

const otpSchema = new Schema<IOTP>(
  {
    email: { type: String, required: true, lowercase: true },
    otp: { type: String, required: true },
    purpose: {
      type: String,
      enum: ["email-verification", "password-reset", "login-2fa"],
      required: true,
    },
    expiresAt: { type: Date, required: true },
    used: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// Auto-delete documents after expiresAt (MongoDB TTL index)
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
otpSchema.index({ email: 1, purpose: 1 });

export const OTP: Model<IOTP> = mongoose.model<IOTP>("OTP", otpSchema);
