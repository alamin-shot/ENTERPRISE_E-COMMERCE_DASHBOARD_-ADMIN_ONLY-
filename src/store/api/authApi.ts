import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import toast from "react-hot-toast";
import type {
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
  OtpPayload,
  OtpResponse,
  ForgotPasswordPayload,
  ResetPasswordPayload,
} from "@/types/auth.types";
import type { ApiResponse } from "@/types/api.types";
import { AUTH_API, API_BASE } from "@/lib/constants/api";
import { getAccessToken } from "@/lib/utils/cookies";

// ─── Mock Handlers ────────────────────────────────────────────────────────────
const MOCK_EMAIL = process.env.NEXT_PUBLIC_MOCK_EMAIL ?? "admin@enterprise.com";
const MOCK_PASSWORD = process.env.NEXT_PUBLIC_MOCK_PASSWORD ?? "Admin@123";
const MOCK_OTP = process.env.NEXT_PUBLIC_MOCK_OTP ?? "123456";
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

const mockLogin = (payload: LoginPayload): ApiResponse<LoginResponse> => {
  if (payload.email !== MOCK_EMAIL || payload.password !== MOCK_PASSWORD) {
    throw new Error("Invalid credentials");
  }
  return {
    success: true,
    message: "Login successful",
    timestamp: new Date().toISOString(),
    data: {
      user: {
        id: "mock-admin-001",
        email: MOCK_EMAIL,
        firstName: "Admin",
        lastName: "User",
        role: "admin",
        avatar: null,
        isEmailVerified: true,
        createdAt: new Date().toISOString(),
      },
      accessToken: "mock-access-token",
      refreshToken: "mock-refresh-token",
    },
  };
};

const mockVerifyOtp = (payload: OtpPayload): ApiResponse<OtpResponse> => {
  if (payload.otp !== MOCK_OTP) throw new Error("Invalid OTP");
  return {
    success: true,
    message: "OTP verified",
    timestamp: new Date().toISOString(),
    data: { verified: true, message: "OTP verified successfully" },
  };
};

// ─── Base Query ───────────────────────────────────────────────────────────────
export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE,
    prepareHeaders: (headers) => {
      const token = getAccessToken();
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation<ApiResponse<LoginResponse>, LoginPayload>({
      queryFn: async (payload) => {
        try {
          if (USE_MOCK) return { data: mockLogin(payload) };
          const res = await fetch(`${API_BASE}${AUTH_API.LOGIN}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          const data = (await res.json()) as ApiResponse<LoginResponse>;
          if (!res.ok) return { error: { status: res.status, data } };
          return { data };
        } catch (error) {
          return { error: { status: "CUSTOM_ERROR", error: String(error) } };
        }
      },
      async onQueryStarted(_, { queryFulfilled }) {
        const toastId = toast.loading("Signing in...");
        try {
          await queryFulfilled;
          toast.success("Welcome back!", { id: toastId });
        } catch (err: any) {
          const msg = err?.error?.data?.message ?? "Invalid credentials";
          toast.error(msg, { id: toastId });
        }
      },
    }),

    register: builder.mutation<ApiResponse<RegisterResponse>, RegisterPayload>({
      queryFn: async (payload) => {
        try {
          if (USE_MOCK) {
            return {
              data: {
                success: true,
                message: "Registration successful",
                timestamp: new Date().toISOString(),
                data: { email: payload.email, message: "OTP sent to email" },
              },
            };
          }
          const res = await fetch(`${API_BASE}${AUTH_API.REGISTER}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          const data = (await res.json()) as ApiResponse<RegisterResponse>;
          if (!res.ok) return { error: { status: res.status, data } };
          return { data };
        } catch (error) {
          return { error: { status: "CUSTOM_ERROR", error: String(error) } };
        }
      },
      async onQueryStarted(_, { queryFulfilled }) {
        const toastId = toast.loading("Creating account...");
        try {
          await queryFulfilled;
          toast.success("Account created! Check your email for OTP.", {
            id: toastId,
          });
        } catch (err: any) {
          const msg = err?.error?.data?.message ?? "Registration failed";
          toast.error(msg, { id: toastId });
        }
      },
    }),

    verifyOtp: builder.mutation<ApiResponse<OtpResponse>, OtpPayload>({
      queryFn: async (payload) => {
        try {
          if (USE_MOCK) return { data: mockVerifyOtp(payload) };
          const res = await fetch(`${API_BASE}${AUTH_API.OTP_VERIFY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          const data = (await res.json()) as ApiResponse<OtpResponse>;
          if (!res.ok) return { error: { status: res.status, data } };
          return { data };
        } catch (error) {
          return { error: { status: "CUSTOM_ERROR", error: String(error) } };
        }
      },
      async onQueryStarted(_, { queryFulfilled }) {
        const toastId = toast.loading("Verifying OTP...");
        try {
          await queryFulfilled;
          toast.success("OTP verified!", { id: toastId });
        } catch (err: any) {
          const msg = err?.error?.data?.message ?? "Invalid OTP";
          toast.error(msg, { id: toastId });
        }
      },
    }),

    forgotPassword: builder.mutation<
      ApiResponse<{ message: string }>,
      ForgotPasswordPayload
    >({
      queryFn: async (payload) => {
        try {
          if (USE_MOCK) {
            return {
              data: {
                success: true,
                message: "OTP sent",
                timestamp: new Date().toISOString(),
                data: { message: "OTP sent to your email" },
              },
            };
          }
          const res = await fetch(`${API_BASE}${AUTH_API.FORGOT_PASSWORD}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          const data = (await res.json()) as ApiResponse<{ message: string }>;
          if (!res.ok) return { error: { status: res.status, data } };
          return { data };
        } catch (error) {
          return { error: { status: "CUSTOM_ERROR", error: String(error) } };
        }
      },
      async onQueryStarted(_, { queryFulfilled }) {
        const toastId = toast.loading("Sending OTP...");
        try {
          await queryFulfilled;
          toast.success("OTP sent to your email!", { id: toastId });
        } catch (err: any) {
          const msg = err?.error?.data?.message ?? "Email not found";
          toast.error(msg, { id: toastId });
        }
      },
    }),

    resetPassword: builder.mutation<
      ApiResponse<{ message: string }>,
      ResetPasswordPayload
    >({
      queryFn: async (payload) => {
        try {
          if (USE_MOCK) {
            if (payload.otp !== MOCK_OTP) throw new Error("Invalid OTP");
            return {
              data: {
                success: true,
                message: "Password reset successful",
                timestamp: new Date().toISOString(),
                data: { message: "Password updated successfully" },
              },
            };
          }
          const res = await fetch(`${API_BASE}${AUTH_API.RESET_PASSWORD}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          const data = (await res.json()) as ApiResponse<{ message: string }>;
          if (!res.ok) return { error: { status: res.status, data } };
          return { data };
        } catch (error) {
          return { error: { status: "CUSTOM_ERROR", error: String(error) } };
        }
      },
      async onQueryStarted(_, { queryFulfilled }) {
        const toastId = toast.loading("Resetting password...");
        try {
          await queryFulfilled;
          toast.success("Password reset successfully!", { id: toastId });
        } catch (err: any) {
          const msg = err?.error?.data?.message ?? "Failed to reset password";
          toast.error(msg, { id: toastId });
        }
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useVerifyOtpMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;
