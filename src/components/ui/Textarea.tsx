"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

export interface TextareaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string | undefined;
    error?: string | undefined;
    hint?: string | undefined;
    maxLength?: number | undefined;
    showCount?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ label, error, hint, maxLength, showCount, className, id, value, ...props }, ref) => {
        const textareaId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
        const charCount = typeof value === "string" ? value.length : 0;

        return (
            <div className="flex flex-col gap-1.5">
                {label && (
                    <label
                        htmlFor={textareaId}
                        className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider"
                    >
                        {label}
                    </label>
                )}

                <textarea
                    ref={ref}
                    id={textareaId}
                    value={value}
                    maxLength={maxLength}
                    className={cn(
                        "w-full rounded-lg px-3 py-2.5 text-sm resize-none",
                        "bg-[var(--bg-secondary)] border text-[var(--text-primary)]",
                        "placeholder:text-[var(--text-tertiary)]",
                        "transition-all duration-150",
                        "focus:outline-none focus:ring-2 focus:ring-amber-400/30",
                        error
                            ? "border-danger-500/60 focus:border-danger-500 focus:ring-danger-500/20"
                            : "border-white/10 focus:border-amber-400/60",
                        className,
                    )}
                    rows={4}
                    {...props}
                />

                <div className="flex items-center justify-between">
                    <div>
                        {error && (
                            <p className="text-xs text-danger-400 flex items-center gap-1">
                                <span>⚠</span> {error}
                            </p>
                        )}
                        {hint && !error && (
                            <p className="text-xs text-[var(--text-tertiary)]">{hint}</p>
                        )}
                    </div>
                    {showCount && maxLength && (
                        <p className={cn(
                            "text-xs tabular-nums",
                            charCount >= maxLength ? "text-danger-400" : "text-[var(--text-tertiary)]",
                        )}>
                            {charCount}/{maxLength}
                        </p>
                    )}
                </div>
            </div>
        );
    },
);

Textarea.displayName = "Textarea";