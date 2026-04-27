import { DashboardShell } from "@/components/layout/DashboardShell";

interface DashboardLayoutProps {
    children: React.ReactNode;
}

// Server Component — no "use client"
export default function DashboardLayout({ children }: DashboardLayoutProps) {
    return <DashboardShell>{children}</DashboardShell>;
}