// ─── JWT Payload Shape ────────────────────────────────────────────────────────
interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

// ─── Decode (no verification — client-side only) ──────────────────────────────
export const decodeToken = (token: string): JwtPayload | null => {
  try {
    const base64Payload = token.split(".")[1];
    if (!base64Payload) return null;

    const decoded = atob(base64Payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decoded) as JwtPayload;
  } catch {
    return null;
  }
};

// ─── Check Expiry ─────────────────────────────────────────────────────────────
export const isTokenExpired = (token: string): boolean => {
  const payload = decodeToken(token);
  if (!payload) return true;

  // Add 10s buffer to account for clock skew
  return payload.exp * 1000 < Date.now() + 10_000;
};

// ─── Get Token Expiry Date ────────────────────────────────────────────────────
export const getTokenExpiry = (token: string): Date | null => {
  const payload = decodeToken(token);
  if (!payload) return null;
  return new Date(payload.exp * 1000);
};
