"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils/cn";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSidebarCollapsed } from "@/store/slices/uiSlice";
import { SidebarLogo } from "./SidebarLogo";
import { SidebarNav } from "./SidebarNav";
import { SidebarFooter } from "./SidebarFooter";
import { LAYOUT } from "@/lib/constants/theme";
import { useIsMobile } from "@/hooks/useMediaQuery";

export function Sidebar() {
    const dispatch = useAppDispatch();
    const isCollapsed = useAppSelector((s) => s.ui.sidebarCollapsed);
    const isMobile = useIsMobile();

    // Auto-collapse on mobile
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < LAYOUT.mobileBreakpoint) {
                dispatch(setSidebarCollapsed(true));
            }
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [dispatch]);

    return (
        <>
            {isMobile && !isCollapsed && (
                <div
                    className="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm transition-opacity"
                    onClick={() => dispatch(setSidebarCollapsed(true))}
                />
            )}
            <aside
                style={{
                    width: isMobile ? LAYOUT.sidebarWidth : (isCollapsed ? LAYOUT.sidebarCollapsed : LAYOUT.sidebarWidth),
                    transform: isMobile && isCollapsed ? "translateX(-100%)" : "translateX(0)",
                    background: "var(--sidebar-bg)",
                }}
                className={cn(
                    "fixed left-0 top-0 z-30 flex h-[100dvh] flex-col",
                    "border-r border-[var(--sidebar-border)]",
                    "transition-all duration-250 ease-smooth",
                    "overflow-hidden",
                )}
            >
                <SidebarLogo />
                <SidebarNav />
                <SidebarFooter />
            </aside>
        </>
    );
}