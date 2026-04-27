"use client";

import { cn } from "@/lib/utils/cn";
import { useAppSelector } from "@/store/hooks";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { LAYOUT } from "@/lib/constants/theme";
import { useIsMobile } from "@/hooks/useMediaQuery";

interface DashboardShellProps {
    children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
    const isCollapsed = useAppSelector((s) => s.ui.sidebarCollapsed);
    const isMobile = useIsMobile();

    return (
        <div className="min-h-screen bg-[var(--bg-tertiary)]">
            <Sidebar />
            <Header />

            {/* Main content — offset by sidebar width + header height */}
            <main
                style={{
                    marginLeft: isMobile ? 0 : (isCollapsed ? LAYOUT.sidebarCollapsed : LAYOUT.sidebarWidth),
                    paddingTop: LAYOUT.headerHeight,
                }}
                className={cn(
                    "min-h-screen transition-[margin-left] duration-250 ease-smooth",
                    "flex flex-col",
                )}
            >
                <div className="flex-1 p-6 animate-fade-in">
                    {children}
                </div>
            </main>
        </div>
    );
}