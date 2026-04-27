"use client";

import * as RadixSelect from "@radix-ui/react-select";
import { ChevronDown, ChevronUp, Check } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
}

export interface SelectProps {
    options: SelectOption[];
    value?: string | undefined;
    onValueChange?: (value: string) => void;
    placeholder?: string | undefined;
    label?: string | undefined;
    error?: string | undefined;
    disabled?: boolean | undefined;
    className?: string;
}

export function Select({
    options,
    value,
    onValueChange,
    placeholder = "Select option",
    label,
    error,
    disabled,
    className,
}: SelectProps) {
    return (
        <div className="flex flex-col gap-1.5">
            {label && (
                <label className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">
                    {label}
                </label>
            )}

            <RadixSelect.Root
                {...(value !== undefined ? { value } : {})}
                {...(onValueChange !== undefined ? { onValueChange } : {})}
                {...(disabled !== undefined ? { disabled } : {})}
            >
                <RadixSelect.Trigger
                    className={cn(
                        "flex items-center justify-between w-full rounded-lg px-3 py-2.5 text-sm",
                        "bg-[var(--bg-secondary)] border text-[var(--text-primary)]",
                        "focus:outline-none focus:ring-2 focus:ring-amber-400/30",
                        "transition-all duration-150 cursor-pointer",
                        "data-[placeholder]:text-[var(--text-tertiary)]",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                        error
                            ? "border-danger-500/60 focus:border-danger-500"
                            : "border-white/10 focus:border-amber-400/60",
                        className,
                    )}
                >
                    <RadixSelect.Value placeholder={placeholder} />
                    <RadixSelect.Icon>
                        <ChevronDown size={14} className="text-[var(--text-tertiary)]" />
                    </RadixSelect.Icon>
                </RadixSelect.Trigger>

                <RadixSelect.Portal>
                    <RadixSelect.Content
                        position="popper"
                        sideOffset={4}
                        className={cn(
                            "z-50 w-[var(--radix-select-trigger-width)] overflow-hidden",
                            "rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)]",
                            "shadow-[0_16px_40px_rgba(0,0,0,0.4)]",
                            "animate-scale-in",
                        )}
                    >
                        <RadixSelect.ScrollUpButton className="flex items-center justify-center py-1 text-cosmos-400">
                            <ChevronUp size={13} />
                        </RadixSelect.ScrollUpButton>

                        <RadixSelect.Viewport className="p-1">
                            {options.map((opt) => (
                                <RadixSelect.Item
                                    key={opt.value}
                                    value={opt.value}
                                    {...(opt.disabled !== undefined ? { disabled: opt.disabled } : {})}
                                    className={cn(
                                        "relative flex items-center gap-2 px-3 py-2 text-sm rounded-lg",
                                        "text-[var(--text-secondary)] cursor-pointer select-none outline-none",
                                        "hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]",
                                        "data-[highlighted]:bg-[var(--bg-tertiary)] data-[highlighted]:text-[var(--text-primary)]",
                                        "data-[state=checked]:text-amber-400",
                                        "data-[disabled]:opacity-40 data-[disabled]:cursor-not-allowed",
                                        "transition-colors duration-100",
                                    )}
                                >
                                    <RadixSelect.ItemText>{opt.label}</RadixSelect.ItemText>
                                    <RadixSelect.ItemIndicator className="ml-auto">
                                        <Check size={13} className="text-amber-400" />
                                    </RadixSelect.ItemIndicator>
                                </RadixSelect.Item>
                            ))}
                        </RadixSelect.Viewport>

                        <RadixSelect.ScrollDownButton className="flex items-center justify-center py-1 text-cosmos-400">
                            <ChevronDown size={13} />
                        </RadixSelect.ScrollDownButton>
                    </RadixSelect.Content>
                </RadixSelect.Portal>
            </RadixSelect.Root>

            {error && (
                <p className="text-xs text-danger-400 flex items-center gap-1">
                    <span>⚠</span> {error}
                </p>
            )}
        </div>
    );
}