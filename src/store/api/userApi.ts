// ─── store/api/userApi.ts ───────────────────────────────────────────────────────

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import toast from "react-hot-toast";
import type { User, UserFilters, UserStats, CreateUserPayload, UpdateUserPayload } from "@/types/user.types";
import type { ApiResponse, PaginatedResponse } from "@/types/api.types";
import { USER_API, API_BASE } from "@/lib/constants/api";
import { getAccessToken } from "@/lib/utils/cookies";
import { isMockMode, mockDelay, warnMock, mockPaginated } from "./helpers";
import { addUser, updateUser, deleteUser } from "../slices/userSlice";
// Removed circular RootState import

function filterUsers(items: User[], filters: UserFilters): User[] {
  let result = [...items];
  const q = filters.search?.toLowerCase();
  if (q) result = result.filter((u) => `${u.firstName} ${u.lastName}`.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
  if (filters.role) result = result.filter((u) => u.role === filters.role);
  if (filters.status) result = result.filter((u) => u.status === filters.status);
  return result;
}

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE,
    prepareHeaders: (h) => { const t = getAccessToken(); if (t) h.set("Authorization", `Bearer ${t}`); return h; },
  }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    getUsers: builder.query<PaginatedResponse<User>, UserFilters>({
      queryFn: async (filters, { getState }) => {
        if (!isMockMode()) {
          const params = new URLSearchParams();
          Object.entries(filters).forEach(([k, v]) => { if (v !== undefined) params.set(k, String(v)); });
          const res = await fetch(`${API_BASE}${USER_API.LIST}?${params}`);
          return { data: (await res.json()) as PaginatedResponse<User> };
        }
        warnMock(); await mockDelay();
        const items = (getState() as any).user.items as User[];
        const filtered = filterUsers(items, filters);
        const page = filters.page ?? 1; const limit = filters.limit ?? 10;
        const pag = mockPaginated(filtered, page, limit);
        return { data: { success: true, message: "OK", timestamp: new Date().toISOString(), data: pag.data, pagination: { page: pag.page, limit: pag.limit, total: pag.total, totalPages: pag.totalPages, hasNext: pag.hasNext, hasPrev: pag.hasPrev } } };
      },
      providesTags: ["User"],
    }),

    getUserById: builder.query<ApiResponse<User>, string>({
      queryFn: async (id, { getState }) => {
        if (!isMockMode()) { const res = await fetch(`${API_BASE}${USER_API.DETAIL(id)}`); return { data: (await res.json()) as ApiResponse<User> }; }
        warnMock(); await mockDelay();
        const items = (getState() as any).user.items as User[];
        const u = items.find((x) => x.id === id);
        return u ? { data: { success: true, message: "OK", timestamp: new Date().toISOString(), data: u } } : { error: { status: 404, data: { message: "Not found" } } };
      },
      providesTags: ["User"],
    }),

    getUserStats: builder.query<ApiResponse<UserStats>, void>({
      queryFn: async (_arg, { getState }) => {
        if (!isMockMode()) { const res = await fetch(`${API_BASE}${USER_API.STATS}`); return { data: (await res.json()) as ApiResponse<UserStats> }; }
        warnMock(); await mockDelay();
        const items = (getState() as any).user.items as User[];
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        const stats: UserStats = {
          totalUsers: items.length,
          activeUsers: items.filter((u) => u.status === "active").length,
          newUsersToday: items.filter((u) => u.createdAt >= todayStart).length,
          newUsersThisMonth: items.filter((u) => u.createdAt >= monthStart).length,
          suspendedUsers: items.filter((u) => u.status === "suspended").length,
        };
        return { data: { success: true, message: "OK", timestamp: new Date().toISOString(), data: stats } };
      },
      providesTags: ["User"],
    }),

    createUser: builder.mutation<ApiResponse<User>, CreateUserPayload>({
      queryFn: async (payload, { dispatch }) => {
        if (!isMockMode()) { const res = await fetch(`${API_BASE}${USER_API.CREATE}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }); return { data: (await res.json()) as ApiResponse<User> }; }
        warnMock(); await mockDelay();
        const u: User = { ...payload, id: `user-${Date.now()}`, avatar: null, isEmailVerified: false, phone: payload.phone ?? null, address: null, lastLoginAt: null, totalOrders: 0, totalSpent: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
        dispatch(addUser(u));
        return { data: { success: true, message: "Created", timestamp: new Date().toISOString(), data: u } };
      },
      invalidatesTags: ["User"],
      async onQueryStarted(_, { queryFulfilled }) { const id = toast.loading("Creating..."); try { await queryFulfilled; toast.success("User created!", { id }); } catch { toast.error("Failed", { id }); } },
    }),

    updateUser: builder.mutation<ApiResponse<User>, { id: string; payload: UpdateUserPayload }>({
      queryFn: async ({ id, payload }, { dispatch, getState }) => {
        if (!isMockMode()) { const res = await fetch(`${API_BASE}${USER_API.UPDATE(id)}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }); return { data: (await res.json()) as ApiResponse<User> }; }
        warnMock(); await mockDelay();
        const items = (getState() as any).user.items as User[];
        const existing = items.find((u) => u.id === id) ?? items[0];
        if (!existing) return { error: { status: 404, data: { message: "User not found" } } as any };
        const updated = { ...existing, ...payload, updatedAt: new Date().toISOString() } as User;
        dispatch(updateUser(updated));
        return { data: { success: true, message: "Updated", timestamp: new Date().toISOString(), data: updated } };
      },
      invalidatesTags: ["User"],
      async onQueryStarted(_, { queryFulfilled }) { const id = toast.loading("Updating..."); try { await queryFulfilled; toast.success("Updated!", { id }); } catch { toast.error("Failed", { id }); } },
    }),

    deleteUser: builder.mutation<ApiResponse<null>, string>({
      queryFn: async (id, { dispatch }) => {
        if (!isMockMode()) { const res = await fetch(`${API_BASE}${USER_API.DELETE(id)}`, { method: "DELETE" }); return { data: (await res.json()) as ApiResponse<null> }; }
        warnMock(); await mockDelay();
        dispatch(deleteUser(id));
        return { data: { success: true, message: "Deleted", timestamp: new Date().toISOString(), data: null } };
      },
      invalidatesTags: ["User"],
      async onQueryStarted(_, { queryFulfilled }) { const id = toast.loading("Deleting..."); try { await queryFulfilled; toast.success("Deleted!", { id }); } catch { toast.error("Failed", { id }); } },
    }),
  }),
});

export const { useGetUsersQuery, useGetUserByIdQuery, useGetUserStatsQuery, useCreateUserMutation, useUpdateUserMutation, useDeleteUserMutation } = userApi;