import { z } from "zod";

// ─── Enums ────────────────────────────────────────────────────────────────────
const orderStatusEnum = z.enum([
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
]);

const paymentStatusEnum = z.enum(["pending", "paid", "failed", "refunded"]);

const paymentMethodEnum = z.enum(["card", "paypal", "bank_transfer", "cash"]);

// ─── Address Schema ───────────────────────────────────────────────────────────
export const addressSchema = z.object({
  line1: z.string().min(1, "Address line 1 is required"),
  line2: z.string().nullable().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().min(2, "Country is required"),
});

// ─── Update Order Status Schema ───────────────────────────────────────────────
export const orderStatusSchema = z.object({
  status: orderStatusEnum,
  trackingNumber: z.string().min(4, "Tracking number too short").optional(),
  notes: z.string().max(500, "Notes must be under 500 characters").optional(),
});

export type OrderStatusFormValues = z.infer<typeof orderStatusSchema>;

// ─── Order Filters Schema ─────────────────────────────────────────────────────
export const orderFilterSchema = z.object({
  search: z.string().optional(),
  status: orderStatusEnum.optional(),
  paymentStatus: paymentStatusEnum.optional(),
  paymentMethod: paymentMethodEnum.optional(),
  dateFrom: z.string().datetime({ offset: true }).optional(),
  dateTo: z.string().datetime({ offset: true }).optional(),
  minTotal: z.number().min(0).optional(),
  maxTotal: z.number().min(0).optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type OrderFilterValues = z.infer<typeof orderFilterSchema>;
