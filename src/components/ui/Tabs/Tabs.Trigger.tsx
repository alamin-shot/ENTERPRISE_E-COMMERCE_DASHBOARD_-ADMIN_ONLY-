"use client";

import * as RadixTabs from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils/cn";
import type { TabsTriggerProps } from "./Tabs.types";

export function TabsTrigger({
    value,
    children,
    disabled,
    icon,
    className,
}: TabsTriggerProps) {
    return (
        <RadixTabs.Trigger
            value={value}
            disabled={disabled}
            className={cn(
                "relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium",
                "text-cosmos-400 hover:text-cosmos-200 transition-colors",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50 rounded-t-lg",
                "disabled:opacity-40 disabled:cursor-not-allowed",
                "data-[state=active]:text-amber-400",
                "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5",
                "after:bg-amber-400 after:scale-x-0 data-[state=active]:after:scale-x-100",
                "after:transition-transform after:duration-200",
                className,
            )}
        >
            {icon && <span className="shrink-0">{icon}</span>}
            {children}
        </RadixTabs.Trigger>
    );
}