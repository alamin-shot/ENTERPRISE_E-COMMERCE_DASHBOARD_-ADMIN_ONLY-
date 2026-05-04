// ─── store/api/productApi.ts ────────────────────────────────────────────────────

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import toast from "react-hot-toast";
import type { Product, ProductFilters, ProductStats, ProductFormPayload } from "@/types/product.types";
import type { ApiResponse, PaginatedResponse } from "@/types/api.types";
import { PRODUCT_API, API_BASE } from "@/lib/constants/api";
import { getAccessToken } from "@/lib/utils/cookies";
import { isMockMode, mockDelay, warnMock, mockPaginated } from "./helpers";
import { addProduct, updateProduct, deleteProduct } from "../slices/productSlice";
// Removed circular RootState import

function filterProducts(items: Product[], filters: ProductFilters): Product[] {
  let result = [...items];
  const q = filters.search?.toLowerCase();
  if (q) result = result.filter((p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
  if (filters.status) result = result.filter((p) => p.status === filters.status);
  if (filters.category) result = result.filter((p) => p.category === filters.category);
  if (filters.sortBy) {
    const key = filters.sortBy as keyof Product;
    result.sort((a, b) => {
      const va = a[key], vb = b[key];
      const dir = filters.sortOrder === "desc" ? -1 : 1;
      return typeof va === "string" ? va.localeCompare(String(vb)) * dir : (Number(va) - Number(vb)) * dir;
    });
  }
  return result;
}

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE,
    prepareHeaders: (h) => { const t = getAccessToken(); if (t) h.set("Authorization", `Bearer ${t}`); return h; },
  }),
  tagTypes: ["Product"],
  endpoints: (builder) => ({
    getProducts: builder.query<PaginatedResponse<Product>, ProductFilters>({
      queryFn: async (filters, { getState }) => {
        if (!isMockMode()) {
          const params = new URLSearchParams();
          Object.entries(filters).forEach(([k, v]) => { if (v !== undefined) params.set(k, String(v)); });
          const res = await fetch(`${API_BASE}${PRODUCT_API.LIST}?${params}`);
          return { data: (await res.json()) as PaginatedResponse<Product> };
        }
        warnMock(); await mockDelay();
        const items = (getState() as any).product.items as Product[];
        const filtered = filterProducts(items, filters);
        const page = filters.page ?? 1; const limit = filters.limit ?? 10;
        const pag = mockPaginated(filtered, page, limit);
        return { data: { success: true, message: "OK", timestamp: new Date().toISOString(), data: pag.data, pagination: { page: pag.page, limit: pag.limit, total: pag.total, totalPages: pag.totalPages, hasNext: pag.hasNext, hasPrev: pag.hasPrev } } };
      },
      providesTags: ["Product"],
    }),

    getProductById: builder.query<ApiResponse<Product>, string>({
      queryFn: async (id, { getState }) => {
        if (!isMockMode()) { const res = await fetch(`${API_BASE}${PRODUCT_API.DETAIL(id)}`); return { data: (await res.json()) as ApiResponse<Product> }; }
        warnMock(); await mockDelay();
        const items = (getState() as any).product.items as Product[];
        const p = items.find((x) => x.id === id);
        return p ? { data: { success: true, message: "OK", timestamp: new Date().toISOString(), data: p } } : { error: { status: 404, data: { message: "Not found" } } };
      },
      providesTags: ["Product"],
    }),

    getProductStats: builder.query<ApiResponse<ProductStats>, void>({
      queryFn: async (_arg, { getState }) => {
        if (!isMockMode()) { const res = await fetch(`${API_BASE}${PRODUCT_API.STATS}`); return { data: (await res.json()) as ApiResponse<ProductStats> }; }
        warnMock(); await mockDelay();
        const items = (getState() as any).product.items as Product[];
        const stats: ProductStats = {
          totalProducts: items.length,
          activeProducts: items.filter((p) => p.status === "active").length,
          outOfStock: items.filter((p) => p.stock === 0).length,
          lowStock: items.filter((p) => p.stock > 0 && p.stock < 10).length,
          totalValue: items.reduce((sum, p) => sum + p.price * p.stock, 0),
        };
        return { data: { success: true, message: "OK", timestamp: new Date().toISOString(), data: stats } };
      },
      providesTags: ["Product"],
    }),

    createProduct: builder.mutation<ApiResponse<Product>, ProductFormPayload>({
      queryFn: async (payload, { dispatch }) => {
        if (!isMockMode()) { const res = await fetch(`${API_BASE}${PRODUCT_API.CREATE}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }); return { data: (await res.json()) as ApiResponse<Product> }; }
        warnMock(); await mockDelay();
        const p: Product = { ...payload, id: `prod-${Date.now()}`, comparePrice: payload.comparePrice ?? null, images: [], dimensions: null, weight: payload.weight ?? null, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
        dispatch(addProduct(p));
        return { data: { success: true, message: "Created", timestamp: new Date().toISOString(), data: p } };
      },
      invalidatesTags: ["Product"],
      async onQueryStarted(_, { queryFulfilled }) { const id = toast.loading("Creating..."); try { await queryFulfilled; toast.success("Product created!", { id }); } catch { toast.error("Failed", { id }); } },
    }),

    updateProduct: builder.mutation<ApiResponse<Product>, { id: string; payload: Partial<ProductFormPayload> }>({
      queryFn: async ({ id, payload }, { getState, dispatch }) => {
        if (!isMockMode()) { const res = await fetch(`${API_BASE}${PRODUCT_API.UPDATE(id)}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }); return { data: (await res.json()) as ApiResponse<Product> }; }
        warnMock(); await mockDelay();
        const items = (getState() as any).product.items as Product[];
        const existing = items.find((p) => p.id === id) ?? items[0];
        if (!existing) return { error: { status: 404, data: { message: "Not found" } } as any };
        const updated = { ...existing, ...payload, updatedAt: new Date().toISOString() } as Product;
        dispatch(updateProduct(updated));
        return { data: { success: true, message: "Updated", timestamp: new Date().toISOString(), data: updated } };
      },
      invalidatesTags: ["Product"],
      async onQueryStarted(_, { queryFulfilled }) { const id = toast.loading("Updating..."); try { await queryFulfilled; toast.success("Updated!", { id }); } catch { toast.error("Failed", { id }); } },
    }),

    deleteProduct: builder.mutation<ApiResponse<null>, string>({
      queryFn: async (id, { dispatch }) => {
        if (!isMockMode()) { const res = await fetch(`${API_BASE}${PRODUCT_API.DELETE(id)}`, { method: "DELETE" }); return { data: (await res.json()) as ApiResponse<null> }; }
        warnMock(); await mockDelay();
        dispatch(deleteProduct(id));
        return { data: { success: true, message: "Deleted", timestamp: new Date().toISOString(), data: null } };
      },
      invalidatesTags: ["Product"],
      async onQueryStarted(_, { queryFulfilled }) { const id = toast.loading("Deleting..."); try { await queryFulfilled; toast.success("Deleted!", { id }); } catch { toast.error("Failed", { id }); } },
    }),
  }),
});

export const { useGetProductsQuery, useGetProductByIdQuery, useGetProductStatsQuery, useCreateProductMutation, useUpdateProductMutation, useDeleteProductMutation } = productApi;