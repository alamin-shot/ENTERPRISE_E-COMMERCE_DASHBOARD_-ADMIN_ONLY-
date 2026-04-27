"use client";

import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleSidebar } from "@/store/slices/uiSlice";

export function SidebarLogo() {
    const dispatch = useAppDispatch();
    const isCollapsed = useAppSelector((s) => s.ui.sidebarCollapsed);

    return (
        <div className={cn(
            "flex items-center border-b border-[var(--sidebar-border)]",
            "h-14 px-4 shrink-0",
            isCollapsed ? "justify-center" : "justify-between",
        )}>
            {!isCollapsed && (
                <div className="flex items-center gap-2.5 overflow-hidden">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-400/15 border border-amber-400/30">
                        <span className="text-sm font-black gradient-text">E</span>
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-bold text-[var(--text-primary)] truncate leading-tight">
                            Enterprise
                        </p>
                        <p className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-widest truncate">
                            Dashboard
                        </p>
                    </div>
                </div>
            )}

            <button
                onClick={() => dispatch(toggleSidebar())}
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
                    "text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--brand-muted)]",
                    "transition-colors duration-150 focus-visible:outline-none",
                    "focus-visible:ring-2 focus-visible:ring-amber-400/50",
                )}
            >
                {isCollapsed
                    ? <PanelLeftOpen size={15} />
                    : <PanelLeftClose size={15} />
                }
            </button>
        </div>
    );
}