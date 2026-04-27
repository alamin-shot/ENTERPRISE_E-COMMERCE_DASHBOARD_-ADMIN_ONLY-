import { z } from "zod";

// ─── Enums ────────────────────────────────────────────────────────────────────
const productStatusEnum = z.enum(["active", "inactive", "draft", "archived"]);

const productCategoryEnum = z.enum([
  "electronics",
  "clothing",
  "food",
  "furniture",
  "sports",
  "beauty",
  "other",
]);

// ─── Product Form Schema ──────────────────────────────────────────────────────
export const productSchema = z.object({
  name: z
    .string()
    .min(2, "Product name must be at least 2 characters")
    .max(120, "Product name must be under 120 characters"),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description must be under 2000 characters"),

  price: z
    .number({ invalid_type_error: "Price must be a number" })
    .positive("Price must be greater than 0")
    .multipleOf(0.01, "Price can have at most 2 decimal places"),

  comparePrice: z
    .number({ invalid_type_error: "Compare price must be a number" })
    .positive("Compare price must be greater than 0")
    .multipleOf(0.01)
    .nullable()
    .optional(),

  sku: z
    .string()
    .min(2, "SKU must be at least 2 characters")
    .max(50, "SKU must be under 50 characters")
    .regex(/^[A-Z0-9-_]+$/, "SKU must be uppercase letters, numbers, - or _"),

  stock: z
    .number({ invalid_type_error: "Stock must be a number" })
    .int("Stock must be a whole number")
    .min(0, "Stock cannot be negative"),

  category: productCategoryEnum,
  status: productStatusEnum,

  tags: z
    .array(z.string().min(1).max(30))
    .max(10, "Maximum 10 tags allowed")
    .default([]),

  weight: z
    .number()
    .positive("Weight must be greater than 0")
    .nullable()
    .optional(),
});

export type ProductFormValues = z.infer<typeof productSchema>;

// ─── Product Filters Schema ───────────────────────────────────────────────────
export const productFilterSchema = z.object({
  search: z.string().optional(),
  status: productStatusEnum.optional(),
  category: productCategoryEnum.optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  inStock: z.boolean().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type ProductFilterValues = z.infer<typeof productFilterSchema>;
