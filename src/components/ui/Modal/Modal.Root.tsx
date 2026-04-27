"use client";

import { createContext, useContext } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import type { ModalContextValue, ModalRootProps } from "./Modal.types";

const ModalContext = createContext<ModalContextValue | null>(null);

export function useModalContext(): ModalContextValue {
    const ctx = useContext(ModalContext);
    if (!ctx) throw new Error("Modal compound components must be used within <Modal.Root>");
    return ctx;
}

export function ModalRoot({ open, onOpenChange, children }: ModalRootProps) {
    return (
        <ModalContext.Provider value={{ open: open ?? false, onOpenChange: onOpenChange ?? (() => { }) }}>
            <Dialog.Root
                {...(open !== undefined ? { open } : {})}
                {...(onOpenChange !== undefined ? { onOpenChange } : {})}
            >
                {children}
            </Dialog.Root>
        </ModalContext.Provider>
    );
}