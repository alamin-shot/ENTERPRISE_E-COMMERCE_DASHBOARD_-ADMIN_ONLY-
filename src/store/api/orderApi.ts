// ─── store/api/orderApi.ts ──────────────────────────────────────────────────────

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import toast from "react-hot-toast";
import type { Order, OrderFilters, OrderStats, UpdateOrderStatusPayload, RevenueDataPoint } from "@/types/order.types";
import type { ApiResponse, PaginatedResponse } from "@/types/api.types";
import { ORDER_API, API_BASE } from "@/lib/constants/api";
import { getAccessToken } from "@/lib/utils/cookies";
import { isMockMode, mockDelay, warnMock, mockPaginated } from "./helpers";
import { mockOrderStats, mockRevenue } from "@/lib/mock";
import { updateOrderStatus } from "../slices/orderSlice";
// Removed circular RootState import

function filterOrders(items: Order[], filters: OrderFilters): Order[] {
  let result = [...items];
  const q = filters.search?.toLowerCase();
  if (q) result = result.filter((o) => o.orderNumber.toLowerCase().includes(q) || o.customer.name.toLowerCase().includes(q));
  if (filters.status) result = result.filter((o) => o.status === filters.status);
  if (filters.sortBy) {
    const key = filters.sortBy as keyof Order;
    result.sort((a, b) => {
      const dir = filters.sortOrder === "desc" ? -1 : 1;
      return typeof a[key] === "string" ? String(a[key]).localeCompare(String(b[key])) * dir : (Number(a[key]) - Number(b[key])) * dir;
    });
  }
  return result;
}


export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE,
    prepareHeaders: (h) => { const t = getAccessToken(); if (t) h.set("Authorization", `Bearer ${t}`); return h; },
  }),
  tagTypes: ["Order"],
  endpoints: (builder) => ({
    getOrders: builder.query<PaginatedResponse<Order>, OrderFilters>({
      queryFn: async (filters, { getState }) => {
        if (!isMockMode()) {
          const params = new URLSearchParams();
          Object.entries(filters).forEach(([k, v]) => { if (v !== undefined) params.set(k, String(v)); });
          const res = await fetch(`${API_BASE}${ORDER_API.LIST}?${params}`);
          return { data: (await res.json()) as PaginatedResponse<Order> };
        }
        warnMock(); await mockDelay();
        const items = (getState() as any).order.items as Order[];
        const filtered = filterOrders(items, filters);
        const page = filters.page ?? 1; const limit = filters.limit ?? 10;
        const pag = mockPaginated(filtered, page, limit);
        return { data: { success: true, message: "OK", timestamp: new Date().toISOString(), data: pag.data, pagination: { page: pag.page, limit: pag.limit, total: pag.total, totalPages: pag.totalPages, hasNext: pag.hasNext, hasPrev: pag.hasPrev } } };
      },
      providesTags: ["Order"],
    }),

    getOrderById: builder.query<ApiResponse<Order>, string>({
      queryFn: async (id, { getState }) => {
        if (!isMockMode()) { const res = await fetch(`${API_BASE}${ORDER_API.DETAIL(id)}`); return { data: (await res.json()) as ApiResponse<Order> }; }
        warnMock(); await mockDelay();
        const items = (getState() as any).order.items as Order[];
        const o = items.find((x) => x.id === id);
        return o ? { data: { success: true, message: "OK", timestamp: new Date().toISOString(), data: o } } : { error: { status: 404, data: { message: "Not found" } } };
      },
      providesTags: ["Order"],
    }),

    getOrderStats: builder.query<ApiResponse<OrderStats>, void>({
      queryFn: async () => {
        if (!isMockMode()) { const res = await fetch(`${API_BASE}${ORDER_API.STATS}`); return { data: (await res.json()) as ApiResponse<OrderStats> }; }
        warnMock(); await mockDelay();
        return { data: { success: true, message: "OK", timestamp: new Date().toISOString(), data: mockOrderStats } };
      },
      providesTags: ["Order"],
    }),

    getRevenueData: builder.query<ApiResponse<RevenueDataPoint[]>, void>({
      queryFn: async () => {
        if (!isMockMode()) { const res = await fetch(`${API_BASE}${ORDER_API.REVENUE}`); return { data: (await res.json()) as ApiResponse<RevenueDataPoint[]> }; }
        warnMock(); await mockDelay();
        return { data: { success: true, message: "OK", timestamp: new Date().toISOString(), data: mockRevenue } };
      },
    }),

    updateOrderStatus: builder.mutation<ApiResponse<Order>, UpdateOrderStatusPayload>({
      queryFn: async ({ orderId, status }, { dispatch, getState }) => {
        if (!isMockMode()) { const res = await fetch(`${API_BASE}${ORDER_API.UPDATE_STATUS(orderId)}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) }); return { data: (await res.json()) as ApiResponse<Order> }; }
        warnMock(); await mockDelay();
        dispatch(updateOrderStatus({ id: orderId, status }));
        const items = (getState() as any).order.items as Order[];
        const o = items.find((x) => x.id === orderId) ?? items[0];
        if (!o) return { error: { status: 404, data: { message: "Order not found" } } as any };
        return { data: { success: true, message: "Updated", timestamp: new Date().toISOString(), data: o } };
      },
      invalidatesTags: ["Order"],
      async onQueryStarted(_, { queryFulfilled }) { const id = toast.loading("Updating status..."); try { await queryFulfilled; toast.success("Status updated!", { id }); } catch { toast.error("Failed", { id }); } },
    }),
  }),
});

export const { useGetOrdersQuery, useGetOrderByIdQuery, useGetOrderStatsQuery, useGetRevenueDataQuery, useUpdateOrderStatusMutation } = orderApi;