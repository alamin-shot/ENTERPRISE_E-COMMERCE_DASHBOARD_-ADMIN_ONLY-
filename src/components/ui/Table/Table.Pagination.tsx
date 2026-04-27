"use client";

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { TablePaginationProps } from "./Table.types";

export function TablePagination({
    page,
    totalPages,
    total,
    limit,
    onPageChange,
    isLoading,
}: TablePaginationProps) {
    const start = (page - 1) * limit + 1;
    const end = Math.min(page * limit, total);

    const btnClass = (disabled: boolean) =>
        cn(
            "flex items-center justify-center w-8 h-8 rounded-lg text-sm transition-colors",
            disabled
                ? "text-[var(--text-tertiary)] opacity-30 cursor-not-allowed"
                : "text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] cursor-pointer",
        );

    return (
        <div className="flex items-center justify-between px-4 py-3 ">
            <p className="text-xs text-[var(--text-tertiary)]">
                {isLoading ? "Loading..." : `Showing ${start}–${end} of ${total}`}
            </p>

            <div className="flex items-center gap-1">
                <button onClick={() => onPageChange(1)} disabled={page <= 1 || isLoading} className={btnClass(page <= 1)}>
                    <ChevronsLeft size={14} />
                </button>
                <button onClick={() => onPageChange(page - 1)} disabled={page <= 1 || isLoading} className={btnClass(page <= 1)}>
                    <ChevronLeft size={14} />
                </button>

                <span className="px-3 text-xs text-[var(--text-tertiary)]">
                    {page} / {totalPages}
                </span>

                <button onClick={() => onPageChange(page + 1)} disabled={page >= totalPages || isLoading} className={btnClass(page >= totalPages)}>
                    <ChevronRight size={14} />
                </button>
                <button onClick={() => onPageChange(totalPages)} disabled={page >= totalPages || isLoading} className={btnClass(page >= totalPages)}>
                    <ChevronsRight size={14} />
                </button>
            </div>
        </div>
    );
}