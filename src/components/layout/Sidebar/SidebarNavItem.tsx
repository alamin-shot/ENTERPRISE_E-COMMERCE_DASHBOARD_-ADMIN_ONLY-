"use client";

import Link from "next/link";
import * as Tooltip from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils/cn";

export interface NavItem {
    label: string;
    href: string;
    icon: React.ReactNode;
    badge?: string | number;
}

interface SidebarNavItemProps {
    item: NavItem;
    isActive: boolean;
    isCollapsed: boolean;
}

export function SidebarNavItem({ item, isActive, isCollapsed }: SidebarNavItemProps) {
    const linkContent = (
        <Link
            href={item.href}
            className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm !mb-2",
                "transition-all duration-150 group relative",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50",
                isCollapsed && "justify-center px-2",
                isActive
                    ? "bg-amber-400/10 text-amber-400 border-l-2 border-amber-400 pl-[10px]"
                    : "text-[var(--sidebar-text)] hover:bg-[var(--brand-muted)] hover:text-[var(--sidebar-active)] border-l-2 border-transparent",
            )}
        >
            {/* Icon */}
            <span className={cn(
                "shrink-0 transition-colors",
                isActive ? "text-amber-400" : "text-[var(--text-tertiary)] group-hover:text-[var(--sidebar-active)]",
            )}>
                {item.icon}
            </span>

            {/* Label */}
            {!isCollapsed && (
                <>
                    <span className="truncate font-medium">{item.label}</span>
                    {item.badge !== undefined && (
                        <span className={cn(
                            "ml-auto shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                            isActive
                                ? "bg-amber-400/20 text-amber-400"
                                : "bg-[var(--bg-tertiary)] text-[var(--text-secondary)]",
                        )}>
                            {item.badge}
                        </span>
                    )}
                </>
            )}
        </Link>
    );

    if (!isCollapsed) return linkContent;

    return (
        <Tooltip.Provider delayDuration={300}>
            <Tooltip.Root>
                <Tooltip.Trigger asChild>{linkContent}</Tooltip.Trigger>
                <Tooltip.Portal>
                    <Tooltip.Content
                        side="right"
                        sideOffset={8}
                        className={cn(
                            "z-50 rounded-lg px-2.5 py-1.5 text-xs font-medium",
                            "bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--border-subtle)]",
                            "shadow-lg animate-scale-in",
                        )}
                    >
                        {item.label}
                        {item.badge !== undefined && (
                            <span className="ml-1.5 text-amber-400">{item.badge}</span>
                        )}
                        <Tooltip.Arrow className="fill-[var(--bg-elevated)]" />
                    </Tooltip.Content>
                </Tooltip.Portal>
            </Tooltip.Root>
        </Tooltip.Provider>
    );
}