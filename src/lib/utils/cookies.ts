import Cookies from "js-cookie";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

const SECURE = process.env.NODE_ENV === "production";

// ─── Access Token ─────────────────────────────────────────────────────────────
export const getAccessToken = (): string | undefined =>
  Cookies.get(ACCESS_TOKEN_KEY);

export const setAccessToken = (token: string, rememberMe = false): void => {
  Cookies.set(ACCESS_TOKEN_KEY, token, {
    expires: rememberMe ? 7 : undefined, // session cookie if not remembered
    secure: SECURE,
    sameSite: "strict",
  });
};

export const removeAccessToken = (): void => Cookies.remove(ACCESS_TOKEN_KEY);

// ─── Refresh Token ────────────────────────────────────────────────────────────
export const getRefreshToken = (): string | undefined =>
  Cookies.get(REFRESH_TOKEN_KEY);

export const setRefreshToken = (token: string): void => {
  Cookies.set(REFRESH_TOKEN_KEY, token, {
    expires: 7,
    secure: SECURE,
    sameSite: "strict",
  });
};

export const removeRefreshToken = (): void => Cookies.remove(REFRESH_TOKEN_KEY);

// ─── Clear All Auth Cookies ───────────────────────────────────────────────────
export const clearAuthCookies = (): void => {
  removeAccessToken();
  removeRefreshToken();
};
