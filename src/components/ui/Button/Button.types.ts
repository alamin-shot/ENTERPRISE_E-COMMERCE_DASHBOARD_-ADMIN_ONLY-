import type { ButtonHTMLAttributes } from "react";

export type ButtonVariant =
    | "primary"
    | "secondary"
    | "ghost"
    | "danger"
    | "outline";

export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant | undefined;
    size?: ButtonSize | undefined;
    isLoading?: boolean | undefined;
    leftIcon?: React.ReactNode | undefined;
    rightIcon?: React.ReactNode | undefined;
    fullWidth?: boolean | undefined;
}