"use client";

import * as RadixCheckbox from "@radix-ui/react-checkbox";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface CheckboxProps {
    id?: string;
    label?: string;
    description?: string;
    checked?: boolean | "indeterminate";
    onCheckedChange?: (checked: boolean | "indeterminate") => void;
    disabled?: boolean;
    className?: string;
}

export function Checkbox({
    id,
    label,
    description,
    checked,
    onCheckedChange,
    disabled,
    className,
}: CheckboxProps) {
    const checkboxId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
        <div className={cn("flex items-start gap-3", className)}>
            <RadixCheckbox.Root
                {...(checkboxId !== undefined ? { id: checkboxId } : {})}
                {...(checked !== undefined ? { checked } : {})}
                {...(onCheckedChange !== undefined ? { onCheckedChange } : {})}
                {...(disabled !== undefined ? { disabled } : {})}
                className={cn(
                    "flex h-4 w-4 shrink-0 items-center justify-center rounded",
                    "border border-[var(--border-subtle)] bg-[var(--bg-secondary)]",
                    "transition-all duration-150 cursor-pointer mt-0.5",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50",
                    "disabled:opacity-40 disabled:cursor-not-allowed",
                    "data-[state=checked]:bg-amber-400 data-[state=checked]:border-amber-400",
                    "data-[state=indeterminate]:bg-amber-400/50 data-[state=indeterminate]:border-amber-400/50",
                )}
            >
                <RadixCheckbox.Indicator>
                    {checked === "indeterminate"
                        ? <Minus size={10} className="text-cosmos-950" strokeWidth={3} />
                        : <Check size={10} className="text-cosmos-950" strokeWidth={3} />
                    }
                </RadixCheckbox.Indicator>
            </RadixCheckbox.Root>

            {(label ?? description) && (
                <div className="flex flex-col gap-0.5">
                    {label && (
                        <label
                            htmlFor={checkboxId}
                            className={cn(
                                "text-sm text-[var(--text-primary)] cursor-pointer leading-none",
                                disabled && "opacity-40 cursor-not-allowed",
                            )}
                        >
                            {label}
                        </label>
                    )}
                    {description && (
                        <p className="text-xs text-[var(--text-tertiary)]">{description}</p>
                    )}
                </div>
            )}
        </div>
    );
}