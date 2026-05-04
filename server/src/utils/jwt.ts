import jwt from "jsonwebtoken";
import { env } from "../config/env";

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export function signAccessToken(
  payload: Omit<JwtPayload, "iat" | "exp">,
): string {
  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  } as jwt.SignOptions);
}

export function signRefreshToken(
  payload: Omit<JwtPayload, "iat" | "exp">,
): string {
  return jwt.sign(payload, env.jwtRefreshSecret, {
    expiresIn: env.jwtRefreshExpiresIn,
  } as jwt.SignOptions);
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, env.jwtSecret) as JwtPayload;
}

export function verifyRefreshToken(token: string): JwtPayload {
  return jwt.verify(token, env.jwtRefreshSecret) as JwtPayload;
}

export function generateTokenPair(
  sub: string,
  email: string,
  role: string,
): { accessToken: string; refreshToken: string } {
  const payload = { sub, email, role };
  return {
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
  };
}
