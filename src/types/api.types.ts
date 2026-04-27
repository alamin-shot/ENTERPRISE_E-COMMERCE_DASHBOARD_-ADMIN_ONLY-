// ─── Request Status ───────────────────────────────────────────────────────────
export type RequestStatus = "idle" | "loading" | "succeeded" | "failed";

// ─── Universal API Response Wrapper ──────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

// ─── Paginated Response Wrapper ───────────────────────────────────────────────
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

// ─── API Error ────────────────────────────────────────────────────────────────
export interface ApiError {
  success: false;
  message: string;
  errors?: FieldError[];
  statusCode: number;
  timestamp: string;
}

export interface FieldError {
  field: string;
  message: string;
}

// ─── RTK Query Base Types ─────────────────────────────────────────────────────
export interface QueryParams {
  page?: number | undefined;
  limit?: number | undefined;
  search?: string | undefined;
  sortBy?: string | undefined;
  sortOrder?: "asc" | "desc" | undefined;
}

// ─── Token Pair ───────────────────────────────────────────────────────────────
export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

// ─── Upload Response ──────────────────────────────────────────────────────────
export interface UploadResponse {
  url: string;
  publicId: string;
  width: number;
  height: number;
}
