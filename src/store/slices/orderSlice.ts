import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { OrderState, OrderFilters, OrderStatus } from "@/types/order.types";
import { mockOrders } from "@/lib/mock";

const initialState: OrderState = {
  items: mockOrders,
  selectedOrderId: null,
  filters: {
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  },
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setSelectedOrder: (state, action: PayloadAction<string | null>) => {
      state.selectedOrderId = action.payload;
    },

    setOrderFilters: (state, action: PayloadAction<Partial<OrderFilters>>) => {
      state.filters = { ...state.filters, ...action.payload, page: 1 };
    },

    setOrderPage: (state, action: PayloadAction<number>) => {
      state.filters.page = action.payload;
    },

    resetOrderFilters: (state) => {
      state.filters = initialState.filters;
    },

    updateOrderStatus: (
      state,
      action: PayloadAction<{ id: string; status: OrderStatus }>,
    ) => {
      const index = state.items.findIndex((o) => o.id === action.payload.id);
      if (index !== -1) {
      const order = state.items[index];
      if (order) {
        order.status = action.payload.status;
        order.updatedAt = new Date().toISOString();
      }
      }
    },
  },
});

export const {
  setSelectedOrder,
  setOrderFilters,
  setOrderPage,
  resetOrderFilters,
  updateOrderStatus,
} = orderSlice.actions;

export default orderSlice.reducer;
