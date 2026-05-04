import type { Response } from "express";

// ─── Mirrors frontend ApiResponse<T> exactly ──────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

// ─── Mirrors frontend PaginatedResponse<T> exactly ───────────────────────────
export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: Pagination;
  timestamp: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// ─── Response builders ────────────────────────────────────────────────────────
export function successResponse<T>(
  res: Response,
  data: T,
  message = "Success",
  statusCode = 200,
): Response {
  const body: ApiResponse<T> = {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  };
  return res.status(statusCode).json(body);
}

export function paginatedResponse<T>(
  res: Response,
  data: T[],
  pagination: Pagination,
  message = "Success",
): Response {
  const body: PaginatedResponse<T> = {
    success: true,
    message,
    data,
    pagination,
    timestamp: new Date().toISOString(),
  };
  return res.status(200).json(body);
}

export function errorResponse(
  res: Response,
  message: string,
  statusCode = 400,
  errors?: { field: string; message: string }[],
): Response {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
    statusCode,
    timestamp: new Date().toISOString(),
  });
}

// ─── Pagination calculator ────────────────────────────────────────────────────
export function buildPagination(
  page: number,
  limit: number,
  total: number,
): Pagination {
  const totalPages = Math.ceil(total / limit);
  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}
