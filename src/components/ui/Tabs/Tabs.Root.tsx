"use client";

import * as RadixTabs from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils/cn";
import type {
    TabsRootProps,
    TabsListProps,
    TabsTriggerProps,
    TabsContentProps,
} from "./Tabs.types";

export function TabsRoot({
    defaultValue,
    value,
    onValueChange,
    children,
    className,
}: TabsRootProps) {
    return (
        <RadixTabs.Root
            {...(defaultValue !== undefined ? { defaultValue } : {})}
            {...(value !== undefined ? { value } : {})}
            {...(onValueChange !== undefined ? { onValueChange } : {})}
            className={cn("flex flex-col", className)}
        >
            {children}
        </RadixTabs.Root>
    );
}

export function TabsList({ children, className }: TabsListProps) {
    return (
        <RadixTabs.List
            className={cn(
                "flex items-center gap-1 border-b border-[var(--border-subtle)] px-1",
                className,
            )}
        >
            {children}
        </RadixTabs.List>
    );
}

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
                "relative flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium",
                "text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50 rounded-lg md:rounded-t-lg md:rounded-b-none",
                "disabled:opacity-40 disabled:cursor-not-allowed",
                "data-[state=active]:text-amber-400 data-[state=active]:bg-amber-400/10 md:data-[state=active]:bg-transparent",
                // Active underline (only on md screens and up)
                "md:after:absolute md:after:bottom-0 md:after:left-0 md:after:right-0 md:after:h-0.5",
                "md:after:bg-amber-400 md:after:scale-x-0 md:data-[state=active]:after:scale-x-100",
                "md:after:transition-transform md:after:duration-200",
                className,
            )}
        >
            {icon && <span className="shrink-0">{icon}</span>}
            {children}
        </RadixTabs.Trigger>
    );
}

export function TabsContent({ value, children, className }: TabsContentProps) {
    return (
        <RadixTabs.Content
            value={value}
            className={cn(
                "mt-4 focus:outline-none",
                "data-[state=active]:animate-fade-in",
                className,
            )}
        >
            {children}
        </RadixTabs.Content>
    );
}