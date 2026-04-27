"use client";

import { ThemeProvider } from "./ThemeProvider";
import { ReduxProvider } from "./ReduxProvider";
import { ToastProvider } from "./ToastProvider";

interface ProvidersProps {
  children: React.ReactNode;
}

// Ordered: Redux → Theme → Toast
export function Providers({ children }: ProvidersProps) {
  return (
    <ReduxProvider>
      <ThemeProvider>
        <ToastProvider />
        {children}
      </ThemeProvider>
    </ReduxProvider>
  );
}
