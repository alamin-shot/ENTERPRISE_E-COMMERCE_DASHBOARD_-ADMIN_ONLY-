export type ModalSize = "sm" | "md" | "lg" | "xl";

export interface ModalContextValue {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export interface ModalRootProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    children: React.ReactNode;
}

export interface ModalTriggerProps {
    children: React.ReactNode;
    asChild?: boolean;
}

export interface ModalContentProps {
    children?: React.ReactNode;
    size?: ModalSize;
    className?: string;
    showClose?: boolean;
}

export interface ModalHeaderProps {
    title: string;
    description?: string;
    className?: string;
}

export interface ModalFooterProps {
    children: React.ReactNode;
    className?: string;
}