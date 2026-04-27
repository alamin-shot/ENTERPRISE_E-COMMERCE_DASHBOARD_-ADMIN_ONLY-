"use client";

import { cn } from "@/lib/utils/cn";
import type { TableColumn } from "./Table.types";

interface TableBodyProps<TData> {
    columns: TableColumn<TData>[];
    data: TData[];
    isLoading?: boolean | undefined;
    emptyMessage?: string | undefined;
    rowKey: keyof TData;
    onRowClick?: ((row: TData) => void) | undefined;
}

function SkeletonRows({ cols }: { cols: number }) {
    return (
        <>
            {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-white/5">
                    {Array.from({ length: cols }).map((__, j) => (
                        <td key={j} className="px-4 py-3">
                            <div className="h-4 rounded shimmer" style={{ width: `${60 + (j * 15) % 40}%` }} />
                        </td>
                    ))}
                </tr>
            ))}
        </>
    );
}

export function TableBody<TData extends Record<string, unknown>>({
    columns,
    data,
    isLoading,
    emptyMessage = "No data found",
    rowKey,
    onRowClick,
}: TableBodyProps<TData>) {
    if (isLoading) return <tbody><SkeletonRows cols={columns.length} /></tbody>;

    if (data.length === 0) {
        return (
            <tbody>
                <tr>
                    <td colSpan={columns.length} className="px-4 py-16 text-center">
                        <div className="flex flex-col items-center gap-2">
                            <div className="text-3xl opacity-30">📭</div>
                            <p className="text-sm text-[var(--text-tertiary)]">{emptyMessage}</p>
                        </div>
                    </td>
                </tr>
            </tbody>
        );
    }

    return (
        <tbody>
            {data.map((row) => (
                <tr
                    key={String(row[rowKey])}
                    onClick={() => onRowClick?.(row)}
                    className={cn(
                        "border-b border-white/5 transition-all duration-200",
                        "hover:bg-[var(--bg-tertiary)]/50 transition-all duration-200 hover:shadow-[var(--shadow-card)] hover:-translate-y-[1px]",
                        onRowClick && "cursor-pointer",
                    )}
                >
                    {columns.map((col) => (
                        <td
                            key={String(col.key)}
                            className={cn("px-4 py-3 text-sm text-[var(--text-primary)]", col.className)}
                        >
                            {col.render
                                ? col.render(row[col.key as keyof TData], row)
                                : String(row[col.key as keyof TData] ?? "—")}
                        </td>
                    ))}
                </tr>
            ))}
        </tbody>
    );
}