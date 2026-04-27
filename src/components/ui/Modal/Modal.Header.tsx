"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils/cn";
import type { ModalHeaderProps, ModalFooterProps } from "./Modal.types";

export function ModalHeader({ title, description, className }: ModalHeaderProps) {
    return (
        <div className={cn("px-6 pt-6 pb-4 border-b border-white/10", className)}>
            <Dialog.Title className="text-lg font-semibold text-cosmos-50">
                {title}
            </Dialog.Title>
            {description && (
                <Dialog.Description className="mt-1 text-sm text-cosmos-400">
                    {description}
                </Dialog.Description>
            )}
        </div>
    );
}

export function ModalFooter({ children, className }: ModalFooterProps) {
    return (
        <div
            className={cn(
                "flex items-center justify-end gap-3 px-6 py-4 border-t border-white/10",
                className,
            )}
        >
            {children}
        </div>
    );
}