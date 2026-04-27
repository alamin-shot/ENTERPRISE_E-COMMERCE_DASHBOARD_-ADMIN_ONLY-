import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import uiReducer from "./slices/uiSlice";
import productReducer from "./slices/productSlice";
import orderReducer from "./slices/orderSlice";
import userReducer from "./slices/userSlice";
import { authApi } from "./api/authApi";
import { productApi } from "./api/productApi";
import { orderApi } from "./api/orderApi";
import { userApi } from "./api/userApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    product: productReducer,
    order: orderReducer,
    user: userReducer,
    // RTK Query reducers
    [authApi.reducerPath]: authApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(productApi.middleware)
      .concat(orderApi.middleware)
      .concat(userApi.middleware),
  devTools: process.env.NODE_ENV !== "production",
});

// ─── Typed Exports ────────────────────────────────────────────────────────────
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
