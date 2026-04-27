"use client";

import { Toaster } from "react-hot-toast";

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      gutter={8}
      toastOptions={{
        duration: 4000,
        style: {
          background: "var(--bg-elevated)",
          color: "var(--text-primary)",
          border: "1px solid var(--border-default)",
          borderRadius: "var(--radius-lg)",
          fontSize: "14px",
          fontFamily: "var(--font-sans)",
          boxShadow: "var(--shadow-cosmos)",
          padding: "12px 16px",
          maxWidth: "380px",
        },
        success: {
          iconTheme: {
            primary: "#22c55e",
            secondary: "var(--bg-elevated)",
          },
        },
        error: {
          iconTheme: {
            primary: "#ef4444",
            secondary: "var(--bg-elevated)",
          },
          duration: 5000,
        },
        loading: {
          iconTheme: {
            primary: "#F5A623",
            secondary: "var(--bg-elevated)",
          },
        },
      }}
    />
  );
}
