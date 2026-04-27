"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import { TableHead, TableBody, TableProps, TableSortState } from "./index";


export function Table<TData extends Record<string, any>>({
    columns,
    data,
    isLoading,
    emptyMessage,
    onSort,
    sortState,
    className,
    rowKey,
    onRowClick,
}: TableProps<TData>) {
    const [internalSort, setInternalSort] = useState<TableSortState | undefined>(sortState);

    const handleSort = (column: string) => {
        const newSort: TableSortState = {
            column,
            direction:
                internalSort?.column === column && internalSort.direction === "asc"
                    ? "desc"
                    : "asc",
        };
        setInternalSort(newSort);
        onSort?.(newSort);
    };

    return (
        <div className={cn("w-full overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/50", className)}>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <TableHead
                        columns={columns}
                        sortState={internalSort}
                        onSort={handleSort}
                    />
                    <TableBody
                        columns={columns}
                        data={data}
                        isLoading={isLoading}
                        emptyMessage={emptyMessage}
                        rowKey={rowKey}
                        onRowClick={onRowClick}
                    />
                </table>
            </div>
        </div>
    );
}