"use client";

import { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { ButtonProps } from "./Button.types";

const variantStyles: Record<string, string> = {
    primary:
        "bg-amber-400 text-cosmos-950 hover:bg-amber-300 active:bg-amber-500 glow-amber",
    secondary:
        "bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] active:bg-[var(--bg-elevated)] border border-[var(--border-subtle)]",
    ghost:
        "bg-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]/50 active:bg-[var(--bg-tertiary)]",
    danger:
        "bg-danger-500 text-white hover:bg-danger-400 active:bg-danger-500/80",
    outline:
        "bg-transparent border border-amber-400/50 text-amber-400 hover:bg-amber-400/10 active:bg-amber-400/20",
};

const sizeStyles: Record<string, string> = {
    sm: "h-8  px-3   text-xs  gap-1.5 rounded-md",
    md: "h-10 px-4   text-sm  gap-2   rounded-lg",
    lg: "h-12 px-6   text-base gap-2.5 rounded-lg",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            variant = "primary",
            size = "md",
            isLoading = false,
            leftIcon,
            rightIcon,
            fullWidth = false,
            disabled,
            className,
            children,
            ...props
        },
        ref,
    ) => {
        return (
            <button
                ref={ref}
                disabled={disabled ?? isLoading}
                className={cn(
                    "cursor-pointer inline-flex items-center justify-center font-medium",
                    "transition-all duration-150 active:scale-[0.98]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50",
                    "disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100",
                    "select-none whitespace-nowrap",
                    variantStyles[variant],
                    sizeStyles[size],
                    fullWidth && "w-full",
                    className,
                )}
                {...props}
            >
                {isLoading ? (
                    <Loader2 size={14} className="animate-spin shrink-0" />
                ) : (
                    leftIcon && <span className="shrink-0">{leftIcon}</span>
                )}
                {children}
                {!isLoading && rightIcon && (
                    <span className="shrink-0">{rightIcon}</span>
                )}
            </button>
        );
    },
);

Button.displayName = "Button";