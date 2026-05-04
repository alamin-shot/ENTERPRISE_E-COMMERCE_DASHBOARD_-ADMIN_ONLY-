import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UserState, UserFilters, User } from "@/types/user.types";
import { mockUsers } from "@/lib/mock";

const initialState: UserState = {
  items: mockUsers,
  selectedUserId: null,
  filters: {
    page: 1,
    limit: 8,
    sortBy: "createdAt",
    sortOrder: "desc",
  },
  isFormOpen: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setSelectedUser: (state, action: PayloadAction<string | null>) => {
      state.selectedUserId = action.payload;
    },

    setUserFilters: (state, action: PayloadAction<Partial<UserFilters>>) => {
      state.filters = { ...state.filters, ...action.payload, page: 1 };
    },

    setUserPage: (state, action: PayloadAction<number>) => {
      state.filters.page = action.payload;
    },

    resetUserFilters: (state) => {
      state.filters = initialState.filters;
    },

    setUserFormOpen: (state, action: PayloadAction<boolean>) => {
      state.isFormOpen = action.payload;
    },

    addUser: (state, action: PayloadAction<User>) => {
      state.items.unshift(action.payload);
    },

    updateUser: (state, action: PayloadAction<User>) => {
      const index = state.items.findIndex((u) => u.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },

    deleteUser: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((u) => u.id !== action.payload);
    },
  },
});

export const {
  setSelectedUser,
  setUserFilters,
  setUserPage,
  resetUserFilters,
  setUserFormOpen,
  addUser,
  updateUser,
  deleteUser,
} = userSlice.actions;

export default userSlice.reducer;
