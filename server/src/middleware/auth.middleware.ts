import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";
import { User } from "../models/User.model";
import { errorResponse } from "../utils/response";

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      errorResponse(res, "No token provided", 401);
      return;
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      errorResponse(res, "No token provided", 401);
      return;
    }

    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.sub).select("-password");

    if (!user) {
      errorResponse(res, "User not found", 401);
      return;
    }
    if (user.status === "suspended") {
      errorResponse(res, "Account suspended", 403);
      return;
    }

    req.user = user;
    next();
  } catch {
    errorResponse(res, "Invalid or expired token", 401);
  }
}

export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      errorResponse(res, "Unauthorized", 401);
      return;
    }
    if (!roles.includes(req.user.role)) {
      errorResponse(res, "Insufficient permissions", 403);
      return;
    }
    next();
  };
}

export const requireAdmin = requireRole("admin");
export const requireManager = requireRole("admin", "manager");
