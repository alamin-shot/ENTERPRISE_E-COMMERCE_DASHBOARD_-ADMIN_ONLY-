"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils/cn";
import type { InputProps } from "./Input.types";

export const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            label,
            error,
            hint,
            leftIcon,
            rightIcon,
            fullWidth = false,
            className,
            id,
            ...props
        },
        ref,
    ) => {
        const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

        return (
            <div className={cn("flex flex-col gap-1.5", fullWidth && "w-full")}>
                {label && (
                    <label
                        htmlFor={inputId}
                        className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider"
                    >
                        {label}
                    </label>
                )}

                <div className="relative flex items-center">
                    {leftIcon && (
                        <span className="absolute left-3 text-[var(--text-tertiary)] pointer-events-none">
                            {leftIcon}
                        </span>
                    )}

                    <input
                        ref={ref}
                        id={inputId}
                        className={cn(
                            "w-full rounded-lg px-3 py-2.5 text-sm",
                            "bg-[var(--bg-secondary)] border text-[var(--text-primary)]",
                            "placeholder:text-[var(--text-tertiary)]",
                            "transition-all duration-150",
                            "focus:outline-none focus:ring-2 focus:ring-amber-400/30",
                            error
                                ? "border-danger-500/60 focus:border-danger-500 focus:ring-danger-500/20"
                                : "border-[var(--border-default)] focus:border-amber-400/60",
                            leftIcon && "pl-10",
                            rightIcon && "pr-10",
                            className,
                        )}
                        {...props}
                    />

                    {rightIcon && (
                        <span className="absolute right-3 text-[var(--text-tertiary)] pointer-events-none">
                            {rightIcon}
                        </span>
                    )}
                </div>

                {error && (
                    <p className="text-xs text-danger-400 flex items-center gap-1">
                        <span>⚠</span> {error}
                    </p>
                )}
                {hint && !error && (
                    <p className="text-xs text-[var(--text-tertiary)]">{hint}</p>
                )}
            </div>
        );
    },
);

Input.displayName = "Input";