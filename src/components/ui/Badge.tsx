"use client";

import { cn } from "@/lib/utils/cn";

export type BadgeVariant =
    | "default"
    | "success"
    | "warning"
    | "danger"
    | "info"
    | "amber"
    | "purple"
    | "neutral";

export type BadgeSize = "sm" | "md";

export interface BadgeProps {
    variant?: BadgeVariant;
    size?: BadgeSize;
    dot?: boolean;
    children: React.ReactNode;
    className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
    default: "bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border-[var(--border-subtle)]",
    success: "bg-success-500/15 text-success-400 border-success-500/30",
    warning: "bg-warning-500/15 text-warning-400 border-warning-500/30",
    danger: "bg-danger-500/15  text-danger-400  border-danger-500/30",
    info: "bg-info-500/15    text-info-400    border-info-500/30",
    amber: "bg-amber-400/15   text-amber-400   border-amber-400/30",
    purple: "bg-purple-500/15  text-purple-400  border-purple-500/30",
    neutral: "bg-[var(--bg-secondary)] text-[var(--text-tertiary)] border-[var(--border-subtle)]",
};

const dotColors: Record<BadgeVariant, string> = {
    default: "bg-cosmos-400",
    success: "bg-success-400",
    warning: "bg-warning-400",
    danger: "bg-danger-400",
    info: "bg-info-400",
    amber: "bg-amber-400",
    purple: "bg-purple-400",
    neutral: "bg-cosmos-400",
};

const sizeStyles: Record<BadgeSize, string> = {
    sm: "px-2   py-0.5 text-[10px] gap-1",
    md: "px-2.5 py-1   text-xs     gap-1.5",
};

export function Badge({
    variant = "default",
    size = "md",
    dot = false,
    children,
    className,
}: BadgeProps) {
    return (
        <span
            className={cn(
                "inline-flex items-center font-medium rounded-full border",
                variantStyles[variant],
                sizeStyles[size],
                className,
            )}
        >
            {dot && (
                <span
                    className={cn(
                        "rounded-full shrink-0",
                        size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2",
                        dotColors[variant],
                    )}
                />
            )}
            {children}
        </span>
    );
}

// ─── Status → Badge variant mappers ──────────────────────────────────────────

export function getOrderStatusVariant(status: string): BadgeVariant {
    const map: Record<string, BadgeVariant> = {
        pending: "warning",
        confirmed: "info",
        processing: "amber",
        shipped: "purple",
        delivered: "success",
        cancelled: "danger",
        refunded: "neutral",
    };
    return map[status] ?? "default";
}

export function getProductStatusVariant(status: string): BadgeVariant {
    const map: Record<string, BadgeVariant> = {
        active: "success",
        inactive: "neutral",
        draft: "warning",
        archived: "danger",
    };
    return map[status] ?? "default";
}

export function getUserStatusVariant(status: string): BadgeVariant {
    const map: Record<string, BadgeVariant> = {
        active: "success",
        inactive: "neutral",
        suspended: "danger",
        pending: "warning",
    };
    return map[status] ?? "default";
}