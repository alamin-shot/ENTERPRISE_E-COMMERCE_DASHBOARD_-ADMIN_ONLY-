"use client";

import { cn } from "@/lib/utils/cn";

// ─── Card Root ────────────────────────────────────────────────────────────────
interface CardProps {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
    onClick?: () => void;
}

export function Card({ children, className, hover, onClick }: CardProps) {
    return (
        <div
            onClick={onClick}
            className={cn(
                "card",
                hover && "hover:border-amber-400/20 hover:shadow-[0_4px_20px_rgba(245,166,35,0.08)] transition-all duration-200",
                onClick && "cursor-pointer",
                className,
            )}
        >
            {children}
        </div>
    );
}

// ─── Card Header ──────────────────────────────────────────────────────────────
interface CardHeaderProps {
    title: string;
    description?: string;
    action?: React.ReactNode;
    className?: string;
}

export function CardHeader({ title, description, action, className }: CardHeaderProps) {
    return (
        <div className={cn("flex items-start justify-between px-6 py-4 border-b border-[var(--border-subtle)]", className)}>
            <div>
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">{title}</h3>
                {description && (
                    <p className="mt-0.5 text-xs text-[var(--text-tertiary)]">{description}</p>
                )}
            </div>
            {action && <div className="ml-4 shrink-0">{action}</div>}
        </div>
    );
}

// ─── Card Body ────────────────────────────────────────────────────────────────
interface CardBodyProps {
    children: React.ReactNode;
    className?: string;
    noPadding?: boolean;
}

export function CardBody({ children, className, noPadding }: CardBodyProps) {
    return (
        <div className={cn(!noPadding && "px-6 py-4", className)}>
            {children}
        </div>
    );
}

// ─── Card Footer ─────────────────────────────────────────────────────────────
interface CardFooterProps {
    children: React.ReactNode;
    className?: string;
}

export function CardFooter({ children, className }: CardFooterProps) {
    return (
        <div className={cn("flex items-center justify-between px-6 py-3 border-t border-[var(--border-subtle)]", className)}>
            {children}
        </div>
    );
}