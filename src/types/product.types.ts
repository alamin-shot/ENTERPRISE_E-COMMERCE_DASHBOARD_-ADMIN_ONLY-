import type { QueryParams } from "./api.types";

// ─── Enums ────────────────────────────────────────────────────────────────────
export type ProductStatus = "active" | "inactive" | "draft" | "archived";
export type ProductCategory =
  | "electronics"
  | "clothing"
  | "food"
  | "furniture"
  | "sports"
  | "beauty"
  | "other";

// ─── Core Product ─────────────────────────────────────────────────────────────
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  comparePrice: number | null;
  sku: string;
  stock: number;
  category: ProductCategory;
  status: ProductStatus;
  images: ProductImage[];
  tags: string[];
  weight: number | null;
  dimensions: ProductDimensions | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
}

export interface ProductDimensions {
  length: number;
  width: number;
  height: number;
  unit: "cm" | "in";
}

// ─── Product Stats (for dashboard) ───────────────────────────────────────────
export interface ProductStats {
  totalProducts: number;
  activeProducts: number;
  outOfStock: number;
  lowStock: number;
  totalValue: number;
}

// ─── Form Payload ─────────────────────────────────────────────────────────────
export interface ProductFormPayload {
  name: string;
  description: string;
  price: number;
  comparePrice?: number | null | undefined;
  sku: string;
  stock: number;
  category: ProductCategory;
  status: ProductStatus;
  tags: string[];
  weight?: number | null | undefined;
  images?: { id: string; url: string; alt?: string; isPrimary?: boolean }[];
}

// ─── Filters ──────────────────────────────────────────────────────────────────
export interface ProductFilters extends QueryParams {
  status?: ProductStatus | undefined;
  category?: ProductCategory | undefined;
  minPrice?: number | undefined;
  maxPrice?: number | undefined;
  inStock?: boolean | undefined;
}

// ─── Redux State ──────────────────────────────────────────────────────────────
export interface ProductState {
  items: Product[];
  selectedProductId: string | null;
  filters: ProductFilters;
  isFormOpen: boolean;
}
