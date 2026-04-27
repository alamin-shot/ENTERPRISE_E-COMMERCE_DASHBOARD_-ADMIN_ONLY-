"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { ModalContentProps } from "./Modal.types";

const sizeStyles: Record<string, string> = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-2xl",
};

export function ModalContent({
    children,
    size = "md",
    className,
    showClose = true,
}: ModalContentProps) {
    return (
        <Dialog.Portal>
            {/* Overlay */}
            <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-fade-in" />

            {/* Content */}
            <Dialog.Content
                className={cn(
                    "fixed left-1/2 top-1/2 z-50 w-full -translate-x-1/2 -translate-y-1/2",
                    "rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] shadow-[var(--shadow-card)]",
                    "data-[state=open]:animate-scale-in",
                    "focus:outline-none",
                    "mx-4",
                    sizeStyles[size],
                    className,
                )}
            >
                {showClose && (
                    <Dialog.Close className="absolute right-4 top-4 rounded-lg p-1.5 text-cosmos-400 hover:text-cosmos-100 hover:bg-cosmos-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50">
                        <X size={16} />
                        <span className="sr-only">Close</span>
                    </Dialog.Close>
                )}
                {children}
            </Dialog.Content>
        </Dialog.Portal>
    );
}