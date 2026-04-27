import type { QueryParams } from "./api.types";
import type { UserRole } from "./auth.types";

// ─── User Status ──────────────────────────────────────────────────────────────
export type UserStatus = "active" | "inactive" | "suspended" | "pending";

// ─── Core User (admin view — more fields than AuthUser) ───────────────────────
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatar: string | null;
  isEmailVerified: boolean;
  phone: string | null;
  address: UserAddress | null;
  lastLoginAt: string | null;
  totalOrders: number;
  totalSpent: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserAddress {
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

// ─── User Stats (for dashboard) ───────────────────────────────────────────────
export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  newUsersThisMonth: number;
  suspendedUsers: number;
}

// ─── Form Payloads ────────────────────────────────────────────────────────────
export interface CreateUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
  status: UserStatus;
  phone?: string | null | undefined;
}

export interface UpdateUserPayload {
  firstName?: string | undefined;
  lastName?: string | undefined;
  email?: string | undefined;
  role?: UserRole | undefined;
  status?: UserStatus | undefined;
  phone?: string | null | undefined;
  avatar?: string | null | undefined;
}

// ─── Filters ──────────────────────────────────────────────────────────────────
export interface UserFilters extends QueryParams {
  role?: UserRole | undefined;
  status?: UserStatus | undefined;
  isEmailVerified?: boolean | undefined;
  dateFrom?: string | undefined;
  dateTo?: string | undefined;
}

// ─── Redux State ──────────────────────────────────────────────────────────────
export interface UserState {
  items: User[];
  selectedUserId: string | null;
  filters: UserFilters;
  isFormOpen: boolean;
}
