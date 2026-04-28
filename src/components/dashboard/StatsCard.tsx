"use client";

import { cn } from "@/lib/utils/cn";
import { useCountUp } from "@/lib/utils/animations";
import { TrendingUp, TrendingDown } from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/utils/format";

/* ─── Accent color map ──────────────────────────────────────────────────────── */
const ACCENT_COLORS: Record<string, string> = {
    amber: "#F5A623",
    info: "#3b82f6",
    success: "#22c55e",
    warning: "#f59e0b",
    danger: "#ef4444",
    purple: "#a855f7",
};

export interface StatsCardProps {
    title: string;
    value: number;
    format?: "currency" | "number" | "percent";
    prefix?: string;
    suffix?: string;
    trend?: number;
    icon: React.ReactNode;
    iconColor?: string;
    isLoading?: boolean;
    accent?: "amber" | "info" | "success" | "warning" | "danger" | "purple";
    /** Stagger index for entrance animation (0-3) */
    index?: number;
}

export function StatsCard({
    title,
    value,
    format = "number",
    prefix = "",
    suffix = "",
    trend,
    icon,
    iconColor,
    isLoading,
    accent = "amber",
    index = 0,
}: StatsCardProps) {
    const count = useCountUp(value);

    const formattedValue =
        format === "currency" ? formatCurrency(count) : formatNumber(count);

    const accentColor = ACCENT_COLORS[accent] || ACCENT_COLORS.amber;

    return (
        <div
            className="kpi-card group"
            data-index={index}
            style={{ "--kpi-accent": accentColor } as React.CSSProperties}
        >
            {/* Background mesh gradient */}
            <div className="kpi-card-mesh" />

            {/* Shimmer sweep */}
            <div className="kpi-card-shimmer" />

            {/* Sparkle particles (visible on hover) */}
            <div className="kpi-sparkles">
                <span className="kpi-sparkle" />
                <span className="kpi-sparkle" />
                <span className="kpi-sparkle" />
                <span className="kpi-sparkle" />
                <span className="kpi-sparkle" />
            </div>

            {/* Content */}
            <div className="relative z-10 flex items-start justify-between">
                <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                    <p className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider truncate">
                        {title}
                    </p>

                    {isLoading ? (
                        <div className="h-8 w-24 rounded shimmer mt-1" />
                    ) : (
                        <div className="flex items-baseline gap-2 flex-wrap">
                            <p className="kpi-value text-2xl font-bold text-[var(--text-primary)] tabular-nums tracking-tight">
                                {prefix}
                                {formattedValue}
                                {suffix}
                            </p>

                            {trend !== undefined && (
                                <div
                                    className={cn(
                                        "kpi-trend flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                                        trend >= 0
                                            ? "bg-success-500/10 text-success-500"
                                            : "bg-danger-500/10 text-danger-500"
                                    )}
                                >
                                    {trend >= 0 ? (
                                        <TrendingUp size={10} />
                                    ) : (
                                        <TrendingDown size={10} />
                                    )}
                                    {Math.abs(trend)}%
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Icon with glow ring + orbiting dot */}
                <div
                    className={cn(
                        "kpi-icon-wrap",
                        iconColor ||
                            "bg-[var(--bg-secondary)] text-[var(--text-secondary)]"
                    )}
                >
                    <div className="kpi-glow-ring" />
                    <span className="kpi-orbit-dot" />
                    <span className="relative z-10">{icon}</span>
                </div>
            </div>

            {/* Bottom accent bar */}
            <div className="kpi-accent-bar" />
        </div>
    );
}