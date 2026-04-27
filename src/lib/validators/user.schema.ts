import { z } from "zod";

// ─── Enums ────────────────────────────────────────────────────────────────────
const userRoleEnum = z.enum(["admin", "manager", "viewer"]);
const userStatusEnum = z.enum(["active", "inactive", "suspended", "pending"]);

// ─── Reusable Fields ──────────────────────────────────────────────────────────
const nameField = (label: string) =>
  z
    .string()
    .min(2, `${label} must be at least 2 characters`)
    .max(50, `${label} must be under 50 characters`);

const phoneField = z
  .string()
  .regex(/^\+?[1-9]\d{6,14}$/, "Enter a valid phone number")
  .nullable()
  .optional();

// ─── Create User Schema ───────────────────────────────────────────────────────
export const createUserSchema = z.object({
  firstName: nameField("First name"),
  lastName: nameField("Last name"),
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[0-9]/, "Must contain a number"),
  role: userRoleEnum,
  status: userStatusEnum,
  phone: phoneField,
});

export type CreateUserFormValues = z.infer<typeof createUserSchema>;

// ─── Update User Schema ───────────────────────────────────────────────────────
export const updateUserSchema = z.object({
  firstName: nameField("First name").optional(),
  lastName: nameField("Last name").optional(),
  email: z.string().email("Enter a valid email").optional(),
  role: userRoleEnum.optional(),
  status: userStatusEnum.optional(),
  phone: phoneField,
});

export type UpdateUserFormValues = z.infer<typeof updateUserSchema>;

// ─── User Filters Schema ──────────────────────────────────────────────────────
export const userFilterSchema = z.object({
  search: z.string().optional(),
  role: userRoleEnum.optional(),
  status: userStatusEnum.optional(),
  isEmailVerified: z.boolean().optional(),
  dateFrom: z.string().datetime({ offset: true }).optional(),
  dateTo: z.string().datetime({ offset: true }).optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type UserFilterValues = z.infer<typeof userFilterSchema>;
