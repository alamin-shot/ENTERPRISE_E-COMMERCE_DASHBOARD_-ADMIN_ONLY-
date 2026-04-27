// ─── Base ─────────────────────────────────────────────────────────────────────
export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

// ─── Auth Endpoints ───────────────────────────────────────────────────────────
export const AUTH_API = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  LOGOUT: "/auth/logout",
  REFRESH: "/auth/refresh",
  OTP_SEND: "/auth/otp/send",
  OTP_VERIFY: "/auth/otp/verify",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",
  CHANGE_PASSWORD: "/auth/change-password",
  ME: "/auth/me",
} as const;

// ─── Product Endpoints ────────────────────────────────────────────────────────
export const PRODUCT_API = {
  LIST: "/products",
  DETAIL: (id: string) => `/products/${id}`,
  CREATE: "/products",
  UPDATE: (id: string) => `/products/${id}`,
  DELETE: (id: string) => `/products/${id}`,
  STATS: "/products/stats",
  UPLOAD: "/products/upload",
} as const;

// ─── Order Endpoints ──────────────────────────────────────────────────────────
export const ORDER_API = {
  LIST: "/orders",
  DETAIL: (id: string) => `/orders/${id}`,
  UPDATE_STATUS: (id: string) => `/orders/${id}/status`,
  STATS: "/orders/stats",
  REVENUE: "/orders/revenue",
} as const;

// ─── User Endpoints ───────────────────────────────────────────────────────────
export const USER_API = {
  LIST: "/users",
  DETAIL: (id: string) => `/users/${id}`,
  CREATE: "/users",
  UPDATE: (id: string) => `/users/${id}`,
  DELETE: (id: string) => `/users/${id}`,
  STATS: "/users/stats",
} as const;
