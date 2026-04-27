import toast from "react-hot-toast";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";
import axiosInstance from "./axiosInstance";
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  clearAuthCookies,
} from "@/lib/utils/cookies";
import { AUTH_API } from "@/lib/constants/api";
import { AUTH_ROUTES } from "@/lib/constants/routes";
import type { ApiError } from "@/types/api.types";

// ─── Refresh State ────────────────────────────────────────────────────────────
let isRefreshing = false;
let refreshQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null): void => {
  refreshQueue.forEach(({ resolve, reject }) => {
    if (token) resolve(token);
    else reject(error);
  });
  refreshQueue = [];
};

// ─── Extended Request Config ──────────────────────────────────────────────────
interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// ─── Request Interceptor ──────────────────────────────────────────────────────
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: unknown) => Promise.reject(error),
);

// ─── Response Interceptor ─────────────────────────────────────────────────────
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;

    // ── 401 Unauthorized → attempt token refresh ────────────────────────────
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      const refreshToken = getRefreshToken();

      if (!refreshToken) {
        clearAuthCookies();
        window.location.href = AUTH_ROUTES.LOGIN;
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Queue requests that arrive while refresh is in progress
        return new Promise<string>((resolve, reject) => {
          refreshQueue.push({ resolve, reject });
        }).then((token) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return axiosInstance(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axiosInstance.post<{
          data: { accessToken: string };
        }>(AUTH_API.REFRESH, { refreshToken });
        const newToken = data.data.accessToken;
        setAccessToken(newToken);
        processQueue(null, newToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearAuthCookies();
        toast.error("Session expired. Please log in again.");
        window.location.href = AUTH_ROUTES.LOGIN;
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // ── Error Toast Messages ────────────────────────────────────────────────
    const status = error.response?.status;
    const message = error.response?.data?.message;

    if (status === 403) toast.error("You don't have permission to do that.");
    else if (status === 404) toast.error("Resource not found.");
    else if (status === 422) toast.error(message ?? "Validation failed.");
    else if (status === 429)
      toast.error("Too many requests. Please slow down.");
    else if (status && status >= 500)
      toast.error("Server error. Please try again.");
    else if (!error.response)
      toast.error("Network error. Check your connection.");

    return Promise.reject(error);
  },
);

export default axiosInstance;
