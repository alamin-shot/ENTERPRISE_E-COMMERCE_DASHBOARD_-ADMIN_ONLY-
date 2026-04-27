import type { Metadata } from "next";
import { AuthLayoutClient } from "./AuthLayoutClient";

export const metadata: Metadata = {
  title: { default: "Auth", template: "%s | Enterprise Dashboard" },
};

interface AuthLayoutProps {
  children: React.ReactNode;
}

// Server Component — no "use client"
export default function AuthLayout({ children }: AuthLayoutProps) {
  return <AuthLayoutClient>{children}</AuthLayoutClient>;
}
