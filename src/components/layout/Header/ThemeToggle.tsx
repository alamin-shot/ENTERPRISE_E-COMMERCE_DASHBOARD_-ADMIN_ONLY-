"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    const options = [
        { value: "light", icon: <Sun size={13} />, label: "Light" },
        { value: "dark", icon: <Moon size={13} />, label: "Dark" },
        { value: "system", icon: <Monitor size={13} />, label: "System" },
    ] as const;

    return (
        <div className="flex items-center gap-0.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] p-0.5">
            {options.map((opt) => (
                <button
                    key={opt.value}
                    onClick={() => setTheme(opt.value)}
                    aria-label={`${opt.label} mode`}
                    title={opt.label}
                    suppressHydrationWarning
                    className={cn(
                        "flex h-7 w-7 items-center justify-center rounded-md",
                        "transition-all duration-150",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50",
                        theme === opt.value
                            ? "bg-amber-400/15 text-amber-400"
                            : "text-[var(--text-tertiary)] hover:text-[var(--text-primary)]",
                    )}
                >
                    {opt.icon}
                </button>
            ))}
        </div>
    );
}