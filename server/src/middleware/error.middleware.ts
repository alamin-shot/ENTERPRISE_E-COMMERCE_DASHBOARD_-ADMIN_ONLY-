import type { Request, Response, NextFunction } from "express";
import { env } from "../config/env";

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export function errorMiddleware(
  err: AppError,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const statusCode = err.statusCode ?? 500;
  const message = err.message ?? "Internal server error";

  console.error(`[${req.method}] ${req.path} — ${statusCode}: ${message}`);

  res.status(statusCode).json({
    success: false,
    message,
    statusCode,
    ...(env.isDev && { stack: err.stack }),
    timestamp: new Date().toISOString(),
  });
}

export function notFoundMiddleware(req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    statusCode: 404,
    timestamp: new Date().toISOString(),
  });
}
