"use client";

import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Badge, getProductStatusVariant } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { useGetProductsQuery } from "@/store/api/productApi";
import { formatCurrency } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import type { Product } from "@/types/product.types";

function StockBar({ stock, max = 100 }: { stock: number; max?: number }) {
    const pct = Math.min((stock / max) * 100, 100);
    const isLow = stock < 10;
    const isEmpty = stock === 0;

    return (
        <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 rounded-full bg-[var(--border-default)] overflow-hidden">
                <div
                    className={cn(
                        "h-full rounded-full transition-all duration-500",
                        isEmpty ? "bg-danger-500" :
                            isLow ? "bg-warning-400" :
                                "bg-success-400",
                    )}
                    style={{ width: `${pct}%` }}
                />
            </div>
            <span className={cn(
                "text-[10px] tabular-nums w-8 text-right",
                isEmpty ? "text-danger-400" :
                    isLow ? "text-warning-400" :
                        "text-[var(--text-secondary)]",
            )}>
                {stock}
            </span>
        </div>
    );
}

export function TopProducts() {
    const { data, isLoading } = useGetProductsQuery({ page: 1, limit: 5, sortBy: "price", sortOrder: "desc" });
    const products: Product[] = data?.data ?? [];

    return (
        <Card>
            <CardHeader title="Top Products" description="By price, highest first" />
            <CardBody noPadding>
                {isLoading ? (
                    <div className="flex h-48 items-center justify-center">
                        <Spinner size="md" />
                    </div>
                ) : (
                    <ul className="divide-y divide-[var(--border-subtle)]">
                        {products.map((product, i) => (
                            <li key={product.id} className="flex items-center gap-3 px-6 py-3 hover:bg-[var(--bg-secondary)] transition-colors">
                                {/* Rank */}
                                <span className={cn(
                                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
                                    i === 0 ? "bg-amber-400/15 text-amber-500" :
                                        i === 1 ? "bg-[var(--bg-tertiary)] text-[var(--text-secondary)]" :
                                            i === 2 ? "bg-[var(--bg-secondary)] text-[var(--text-tertiary)]" :
                                                "bg-transparent text-[var(--text-tertiary)] opacity-40",
                                )}>
                                    {i + 1}
                                </span>

                                {/* Name + status */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                                        {product.name}
                                    </p>
                                    <StockBar stock={product.stock} />
                                </div>

                                {/* Price + badge */}
                                <div className="flex flex-col items-end gap-1 shrink-0">
                                    <span className="text-sm font-semibold text-amber-400 tabular-nums">
                                        {formatCurrency(product.price)}
                                    </span>
                                    <Badge variant={getProductStatusVariant(product.status)} size="sm" dot>
                                        {product.status}
                                    </Badge>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </CardBody>
        </Card>
    );
}