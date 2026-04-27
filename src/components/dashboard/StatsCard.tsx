"use client";

import { cn } from "@/lib/utils/cn";
import { useCountUp } from "@/lib/utils/animations";
import { TrendingUp, TrendingDown } from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/utils/format";

export interface StatsCardProps {
    title: string;
    value: number;
    format?: "currency" | "number" | "percent";
    prefix?: string;
    suffix?: string;
    trend?: number;
    icon: React.ReactNode;
    iconColor?: string; // Tailwind classes for the icon container
    isLoading?: boolean;
    accent?: "amber" | "info" | "success" | "warning" | "danger" | "purple";
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
    accent = "amber"
}: StatsCardProps) {
    const count = useCountUp(value);

    const formattedValue = format === "currency"
        ? formatCurrency(count)
        : formatNumber(count);

    return (
        <div className="card group relative overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-[var(--shadow-card)]">
            <div className="relative z-10 flex items-start justify-between">
                <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                    <p className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider truncate">{title}</p>

                    {isLoading ? (
                        <div className="h-8 w-24 rounded shimmer mt-1" />
                    ) : (
                        <div className="flex items-baseline gap-2 flex-wrap">
                            <p className="text-2xl font-bold text-[var(--text-primary)] tabular-nums tracking-tight">
                                {prefix}{formattedValue}{suffix}
                            </p>

                            {trend !== undefined && (
                                <div className={cn(
                                    "flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                                    trend >= 0 ? "bg-success-500/10 text-success-500" : "bg-danger-500/10 text-danger-500"
                                )}>
                                    {trend >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                                    {Math.abs(trend)}%
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110",
                    iconColor || "bg-[var(--bg-secondary)] text-[var(--text-secondary)]"
                )}>
                    {icon}
                </div>
            </div>

            {/* Subtle bottom accent line */}
            <div className={cn(
                "absolute bottom-0 left-0 h-1 w-0 transition-all duration-500 group-hover:w-full",
                accent === "amber" && "bg-amber-400",
                accent === "info" && "bg-info-400",
                accent === "success" && "bg-success-400",
                accent === "warning" && "bg-warning-400",
                accent === "danger" && "bg-danger-400",
                accent === "purple" && "bg-purple-400",
            )} />
        </div>
    );
}