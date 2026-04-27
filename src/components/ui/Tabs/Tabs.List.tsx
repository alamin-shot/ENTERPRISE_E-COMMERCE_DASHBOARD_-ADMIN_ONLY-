"use client";

import * as RadixTabs from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils/cn";
import type { TabsListProps } from "./Tabs.types";

export function TabsList({ children, className }: TabsListProps) {
    return (
        <RadixTabs.List
            className={cn(
                "flex items-center gap-1 border-b border-white/10 px-1",
                className,
            )}
        >
            {children}
        </RadixTabs.List>
    );
}