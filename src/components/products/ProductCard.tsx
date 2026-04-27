"use client";

import { Pencil, Trash2 } from "lucide-react";
import { Badge, getProductStatusVariant } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardFooter } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/utils/format";
import { capitalize } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import type { Product } from "@/types/product.types";

interface ProductCardProps {
    product: Product;
    onEdit: (product: Product) => void;
    onDelete: (id: string) => void;
}

export function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
    const primaryImage = product.images.find((img) => img.isPrimary) ?? product.images[0];
    const isLowStock = product.stock > 0 && product.stock < 10;
    const isOutOfStock = product.stock === 0;

    return (
        <Card hover className="flex flex-col">
            {/* Image */}
            <div className="relative h-40 overflow-hidden rounded-t-xl bg-[var(--bg-tertiary)]">
                {primaryImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={primaryImage.url} alt={primaryImage.alt} className="h-full w-full object-cover" />
                ) : (
                    <div className="flex h-full items-center justify-center text-[var(--text-tertiary)] opacity-20 text-4xl">📦</div>
                )}
                <div className="absolute top-2 right-2">
                    <Badge variant={getProductStatusVariant(product.status)} size="sm" dot>
                        {capitalize(product.status)}
                    </Badge>
                </div>
            </div>

            <CardBody className="flex-1 flex flex-col gap-1 py-3">
                <p className="text-sm font-semibold text-[var(--text-primary)] line-clamp-2">{product.name}</p>
                <p className="text-xs text-[var(--text-tertiary)] capitalize">{product.category}</p>
                <p className="text-xs text-[var(--text-tertiary)]">SKU: {product.sku}</p>

                <div className="mt-auto pt-2 flex items-center justify-between">
                    <span className="text-base font-bold text-amber-400 tabular-nums">
                        {formatCurrency(product.price)}
                    </span>
                    <span className={cn(
                        "text-xs font-medium",
                        isOutOfStock ? "text-danger-400" :
                            isLowStock ? "text-warning-400" :
                                "text-[var(--text-tertiary)]",
                    )}>
                        {isOutOfStock ? "Out of stock" : `${product.stock} in stock`}
                    </span>
                </div>
            </CardBody>

            <CardFooter className="gap-2">
                <Button variant="outline" size="sm" fullWidth onClick={() => onEdit(product)} leftIcon={<Pencil size={13} />}>
                    Edit
                </Button>
                <Button variant="ghost" size="sm"
                    className="text-danger-400 hover:bg-danger-500/10"
                    onClick={() => onDelete(product.id)}
                    leftIcon={<Trash2 size={13} />}
                >
                    Delete
                </Button>
            </CardFooter>
        </Card>
    );
}