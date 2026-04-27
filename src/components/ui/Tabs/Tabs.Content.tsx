"use client";

import * as RadixTabs from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils/cn";
import type { TabsContentProps } from "./Tabs.types";

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