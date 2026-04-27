"use client";

import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { TableColumn, TableSortState } from "./Table.types";

interface TableHeadProps<TData> {
    columns: TableColumn<TData>[];
    sortState?: TableSortState | undefined;
    onSort?: ((column: string) => void) | undefined;
}

export function TableHead<TData>({
    columns,
    sortState,
    onSort,
}: TableHeadProps<TData>) {
    return (
        <thead>
            <tr className="border-b border-white/10">
                {columns.map((col) => {
                    const isSorted = sortState?.column === col.key;
                    const isAsc = isSorted && sortState?.direction === "asc";

                    return (
                        <th
                            key={String(col.key)}
                            style={{ width: col.width }}
                            onClick={() => col.sortable && onSort?.(String(col.key))}
                            className={cn(
                                "px-4 py-3 text-left text-xs font-medium",
                                "text-[var(--text-tertiary)] uppercase tracking-wider",
                                col.sortable &&
                                "cursor-pointer select-none hover:text-[var(--text-primary)] transition-colors",
                                col.className,
                            )}
                        >
                            <div className="flex items-center gap-1.5">
                                {col.header}
                                {col.sortable && (
                                    <span className="text-[var(--text-tertiary)] opacity-50">
                                        {isSorted ? (
                                            isAsc ? (
                                                <ChevronUp size={13} className="text-amber-400" />
                                            ) : (
                                                <ChevronDown size={13} className="text-amber-400" />
                                            )
                                        ) : (
                                            <ChevronsUpDown size={13} />
                                        )}
                                    </span>
                                )}
                            </div>
                        </th>
                    );
                })}
            </tr>
        </thead>
    );
}