// ─── Auth Routes ─────────────────────────────────────────────────────────────
export const AUTH_ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  OTP_VERIFY: "/otp-verify",
  RESET_PASSWORD: "/reset-password",
} as const;

// ─── Dashboard Routes ─────────────────────────────────────────────────────────
export const DASHBOARD_ROUTES = {
  HOME: "/dashboard",
  PRODUCTS: "/products",
  PRODUCT: (id: string) => `/products/${id}`,
  ORDERS: "/orders",
  ORDER: (id: string) => `/orders/${id}`,
  USERS: "/users",
  USER: (id: string) => `/users/${id}`,
  SETTINGS: "/settings",
} as const;

// ─── Route Guards ─────────────────────────────────────────────────────────────
export const PUBLIC_ROUTES = Object.values(AUTH_ROUTES) as string[];

export const DEFAULT_AUTH_REDIRECT = DASHBOARD_ROUTES.HOME;
export const DEFAULT_UNAUTH_REDIRECT = AUTH_ROUTES.LOGIN;
