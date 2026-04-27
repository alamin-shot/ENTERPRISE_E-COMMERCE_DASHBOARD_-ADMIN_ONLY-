import type { RequestStatus, TokenPair } from "./api.types";

// ─── User Role ────────────────────────────────────────────────────────────────
export type UserRole = "admin" | "manager" | "viewer";

// ─── Authenticated User ───────────────────────────────────────────────────────
export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar: string | null;
  isEmailVerified: boolean;
  createdAt: string;
}

// ─── Auth State (Redux) ───────────────────────────────────────────────────────
export interface AuthState {
  user: AuthUser | null;
  tokens: TokenPair | null;
  status: RequestStatus;
  error: string | null;
  isAuthenticated: boolean;
  // OTP flow
  otpEmail: string | null;
  otpPurpose: OtpPurpose | null;
}

// ─── OTP ──────────────────────────────────────────────────────────────────────
export type OtpPurpose = "email-verification" | "password-reset" | "login-2fa";

export interface OtpState {
  email: string;
  purpose: OtpPurpose;
  expiresAt: string;
}

// ─── Request Payloads ─────────────────────────────────────────────────────────
export interface LoginPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface OtpPayload {
  email: string;
  otp: string;
  purpose: OtpPurpose;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  email: string;
  otp: string;
  password: string;
  confirmPassword: string;
}

export interface RefreshTokenPayload {
  refreshToken: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// ─── Auth API Responses ───────────────────────────────────────────────────────
export interface LoginResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export interface RegisterResponse {
  email: string;
  message: string;
}

export interface OtpResponse {
  verified: boolean;
  message: string;
}
