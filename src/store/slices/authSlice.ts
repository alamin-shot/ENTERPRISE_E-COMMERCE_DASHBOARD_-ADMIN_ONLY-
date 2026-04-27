import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthState, AuthUser, OtpPurpose } from "@/types/auth.types";
import type { TokenPair } from "@/types/api.types";
import {
  clearAuthCookies,
  setAccessToken,
  setRefreshToken,
} from "@/lib/utils/cookies";

const initialState: AuthState = {
  user: null,
  tokens: null,
  status: "idle",
  error: null,
  isAuthenticated: false,
  otpEmail: null,
  otpPurpose: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: AuthUser; tokens: TokenPair }>,
    ) => {
      state.user = action.payload.user;
      state.tokens = action.payload.tokens;
      state.isAuthenticated = true;
      state.status = "succeeded";
      state.error = null;
      setAccessToken(action.payload.tokens.accessToken);
      setRefreshToken(action.payload.tokens.refreshToken);
    },

    updateUser: (state, action: PayloadAction<Partial<AuthUser>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },

    setAccessToken: (state, action: PayloadAction<string>) => {
      if (state.tokens) {
        state.tokens.accessToken = action.payload;
      }
    },

    setOtpFlow: (
      state,
      action: PayloadAction<{ email: string; purpose: OtpPurpose }>,
    ) => {
      state.otpEmail = action.payload.email;
      state.otpPurpose = action.payload.purpose;
    },

    clearOtpFlow: (state) => {
      state.otpEmail = null;
      state.otpPurpose = null;
    },

    setStatus: (state, action: PayloadAction<AuthState["status"]>) => {
      state.status = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.status = "failed";
    },

    logout: (state) => {
      state.user = null;
      state.tokens = null;
      state.isAuthenticated = false;
      state.status = "idle";
      state.error = null;
      state.otpEmail = null;
      state.otpPurpose = null;
      clearAuthCookies();
    },
  },
});

export const {
  setCredentials,
  updateUser,
  setAccessToken: updateAccessToken,
  setOtpFlow,
  clearOtpFlow,
  setStatus,
  setError,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
