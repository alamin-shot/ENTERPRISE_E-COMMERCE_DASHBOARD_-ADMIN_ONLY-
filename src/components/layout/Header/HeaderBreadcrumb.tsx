"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { cn } from "@/lib/utils/cn";

export function HeaderBreadcrumb() {
    const { pageTitle, breadcrumbs } = useAppSelector((s) => s.ui);

    if (breadcrumbs.length === 0) {
        return (
            <h1 className="hidden md:block text-sm font-semibold text-[var(--text-primary)]">
                {pageTitle}
            </h1>
        );
    }

    return (
        <nav aria-label="Breadcrumb" className="hidden md:flex items-center gap-1.5">
            {breadcrumbs.map((crumb, index) => {
                const isLast = index === breadcrumbs.length - 1;
                return (
                    <div key={index} className="flex items-center gap-1.5">
                        {index > 0 && (
                            <ChevronRight size={12} className="text-[var(--text-tertiary)]" />
                        )}
                        {crumb.href && !isLast ? (
                            <Link
                                href={crumb.href}
                                className={cn(
                                    "text-sm text-[var(--text-secondary)]",
                                    "hover:text-[var(--text-primary)] transition-colors",
                                    "link-underline",
                                )}
                            >
                                {crumb.label}
                            </Link>
                        ) : (
                            <span className={cn(
                                "text-sm",
                                isLast
                                    ? "font-semibold text-[var(--text-primary)]"
                                    : "text-[var(--text-secondary)]",
                            )}>
                                {crumb.label}
                            </span>
                        )}
                    </div>
                );
            })}
        </nav>
    );
}