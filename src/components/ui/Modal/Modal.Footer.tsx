"use client";

import { cn } from "@/lib/utils/cn";
import type { ModalFooterProps } from "./Modal.types";

export function ModalFooter({ children, className }: ModalFooterProps) {
    return (
        <div
            className={cn(
                "flex items-center justify-end gap-3 px-6 py-4",
                "border-t border-white/10",
                className,
            )}
        >
            {children}
        </div>
    );
}