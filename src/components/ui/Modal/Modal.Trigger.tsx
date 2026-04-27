"use client";

import * as Dialog from "@radix-ui/react-dialog";
import type { ModalTriggerProps } from "./Modal.types";

export function ModalTrigger({ children, asChild = true }: ModalTriggerProps) {
    return (
        <Dialog.Trigger asChild={asChild}>
            {children}
        </Dialog.Trigger>
    );
}