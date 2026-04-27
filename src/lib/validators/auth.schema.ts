import { z } from "zod";

// ─── Reusable Field Rules ─────────────────────────────────────────────────────
const emailField = z
  .string()
  .min(1, "Email is required")
  .email("Enter a valid email address")
  .toLowerCase();

const passwordField = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Must contain at least one uppercase letter")
  .regex(/[a-z]/, "Must contain at least one lowercase letter")
  .regex(/[0-9]/, "Must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Must contain at least one special character");

const nameField = (label: string) =>
  z
    .string()
    .min(2, `${label} must be at least 2 characters`)
    .max(50, `${label} must be under 50 characters`)
    .regex(/^[a-zA-Z\s'-]+$/, `${label} contains invalid characters`);

const otpField = z
  .string()
  .length(6, "OTP must be exactly 6 digits")
  .regex(/^\d{6}$/, "OTP must contain only digits");

// ─── Login Schema ─────────────────────────────────────────────────────────────
export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional().default(false),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

// ─── Register Schema ──────────────────────────────────────────────────────────
export const registerSchema = z
  .object({
    firstName: nameField("First name"),
    lastName: nameField("Last name"),
    email: emailField,
    password: passwordField,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

// ─── OTP Schema ───────────────────────────────────────────────────────────────
export const otpSchema = z.object({
  otp: otpField,
});

export type OtpFormValues = z.infer<typeof otpSchema>;

// ─── Forgot Password Schema ───────────────────────────────────────────────────
export const forgotPasswordSchema = z.object({
  email: emailField,
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

// ─── Reset Password Schema ────────────────────────────────────────────────────
export const resetPasswordSchema = z
  .object({
    otp: otpField,
    password: passwordField,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

// ─── Change Password Schema ───────────────────────────────────────────────────
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: passwordField,
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
