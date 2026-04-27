"use client";

import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function HeaderSearch() {
    const [isFocused, setIsFocused] = useState(false);
    const [value, setValue] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    // Cmd+K / Ctrl+K shortcut
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                inputRef.current?.focus();
            }
            if (e.key === "Escape") {
                inputRef.current?.blur();
                setValue("");
            }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, []);

    return (
        <div className={cn(
            "hidden md:flex items-center gap-2 rounded-lg px-3 h-9",
            "bg-[var(--bg-secondary)] border transition-all duration-150",
            "w-48 md:w-64",
            isFocused
                ? "border-amber-400/40 ring-1 ring-amber-400/20 w-64 md:w-80"
                : "border-[var(--border-subtle)] hover:border-[var(--border-default)]",
        )}>
            <Search size={13} className="shrink-0 text-[var(--text-secondary)]" />

            <input
                ref={inputRef}
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Search..."
                className={cn(
                    "flex-1 bg-transparent text-sm text-[var(--text-primary)]",
                    "placeholder:text-[var(--text-tertiary)] outline-none min-w-0",
                )}
            />

            {value ? (
                <button
                    onClick={() => setValue("")}
                    className="shrink-0 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
                >
                    <X size={12} />
                </button>
            ) : (
                <kbd className="hidden md:flex shrink-0 items-center gap-0.5 text-[10px] text-[var(--text-tertiary)]">
                    <span>⌘</span><span>K</span>
                </kbd>
            )}
        </div>
    );
}