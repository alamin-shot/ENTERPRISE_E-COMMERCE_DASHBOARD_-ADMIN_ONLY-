import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ProductState, ProductFilters, Product } from "@/types/product.types";
import { mockProducts } from "@/lib/mock";

const initialState: ProductState = {
  items: mockProducts,
  selectedProductId: null,
  filters: {
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  },
  isFormOpen: false,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setSelectedProduct: (state, action: PayloadAction<string | null>) => {
      state.selectedProductId = action.payload;
    },

    setProductFilters: (
      state,
      action: PayloadAction<Partial<ProductFilters>>,
    ) => {
      state.filters = { ...state.filters, ...action.payload, page: 1 };
    },

    setProductPage: (state, action: PayloadAction<number>) => {
      state.filters.page = action.payload;
    },

    resetProductFilters: (state) => {
      state.filters = initialState.filters;
    },

    setProductFormOpen: (state, action: PayloadAction<boolean>) => {
      state.isFormOpen = action.payload;
    },

    addProduct: (state, action: PayloadAction<Product>) => {
      state.items.unshift(action.payload);
    },

    updateProduct: (state, action: PayloadAction<Product>) => {
      const index = state.items.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },

    deleteProduct: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((p) => p.id !== action.payload);
    },
  },
});

export const {
  setSelectedProduct,
  setProductFilters,
  setProductPage,
  resetProductFilters,
  setProductFormOpen,
  addProduct,
  updateProduct,
  deleteProduct,
} = productSlice.actions;

export default productSlice.reducer;
