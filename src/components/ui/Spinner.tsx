"use client";

import { cn } from "@/lib/utils/cn";

export type SpinnerSize = "sm" | "md" | "lg" | "xl";

export interface SpinnerProps {
    size?: SpinnerSize;
    className?: string;
    label?: string;
}

const sizeMap: Record<SpinnerSize, string> = {
    sm: "w-4  h-4  border-2",
    md: "w-6  h-6  border-2",
    lg: "w-10 h-10 border-[3px]",
    xl: "w-14 h-14 border-4",
};

export function Spinner({ size = "md", className, label = "Loading..." }: SpinnerProps) {
    return (
        <div
            role="status"
            aria-label={label}
            className={cn(
                "rounded-full border-[var(--border-strong)] border-t-amber-400 animate-spin",
                sizeMap[size],
                className,
            )}
        />
    );
}

export function FullPageSpinner() {
    return (
        <div className="flex min-h-[400px] w-full items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <Spinner size="lg" />
                <p className="text-sm text-[var(--text-tertiary)] animate-pulse">Loading...</p>
            </div>
        </div>
    );
}