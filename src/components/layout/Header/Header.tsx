"use client";

import { cn } from "@/lib/utils/cn";
import { useAppSelector } from "@/store/hooks";
import { HeaderSearch } from "./HeaderSearch";
import { HeaderBreadcrumb } from "./HeaderBreadcrumb";
import { HeaderActions } from "./HeaderActions";
import { LAYOUT } from "@/lib/constants/theme";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { useAppDispatch } from "@/store/hooks";
import { toggleSidebar } from "@/store/slices/uiSlice";
import { Menu } from "lucide-react";

export function Header() {
    const isCollapsed = useAppSelector((s) => s.ui.sidebarCollapsed);
    const isMobile = useIsMobile();
    const dispatch = useAppDispatch();

    return (
        <header
            style={{
                left: isMobile ? 0 : (isCollapsed ? LAYOUT.sidebarCollapsed : LAYOUT.sidebarWidth),
                height: LAYOUT.headerHeight,
            }}
            className={cn(
                "fixed right-0 top-0 z-20",
                "flex items-center justify-between px-6",
                "border-b border-[var(--border-subtle)]",
                "bg-[var(--bg-primary)]/80 backdrop-blur-md",
                "transition-[left] duration-250 ease-smooth",
            )}
        >
            {/* Left — breadcrumb + mobile menu */}
            <div className="flex items-center gap-3">
                {isMobile && (
                    <button
                        onClick={() => dispatch(toggleSidebar())}
                        className="text-cosmos-200 hover:text-white transition-colors"
                        aria-label="Toggle menu"
                    >
                        <Menu size={20} />
                    </button>
                )}
                <HeaderBreadcrumb />
            </div>

            {/* Right — search + actions */}
            <div className="flex items-center gap-3">
                <HeaderSearch />
                <HeaderActions />
            </div>
        </header>
    );
}