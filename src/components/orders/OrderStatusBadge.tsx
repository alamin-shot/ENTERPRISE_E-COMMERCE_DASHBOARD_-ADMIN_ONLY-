"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDown } from "lucide-react";
import { Badge, getOrderStatusVariant } from "@/components/ui/Badge";
import { useUpdateOrderStatusMutation } from "@/store/api/orderApi";
import { capitalize } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import type { OrderStatus } from "@/types/order.types";

const ALL_STATUSES: OrderStatus[] = [
    "pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "refunded",
];

interface OrderStatusBadgeProps {
    orderId: string;
    status: OrderStatus;
    readonly?: boolean;
}

export function OrderStatusBadge({ orderId, status, readonly }: OrderStatusBadgeProps) {
    const [updateStatus, { isLoading }] = useUpdateOrderStatusMutation();

    if (readonly) {
        return (
            <Badge variant={getOrderStatusVariant(status)} dot size="sm">
                {capitalize(status)}
            </Badge>
        );
    }

    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
                <button
                    disabled={isLoading}
                    className="flex items-center gap-1 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50"
                >
                    <Badge variant={getOrderStatusVariant(status)} dot size="sm">
                        {capitalize(status)}
                    </Badge>
                    <ChevronDown size={11} className="text-[var(--text-tertiary)]" />
                </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
                <DropdownMenu.Content
                    align="start"
                    sideOffset={4}
                    className="z-50 min-w-[160px] rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-1.5 shadow-xl animate-scale-in"
                >
                    {ALL_STATUSES.map((s) => (
                        <DropdownMenu.Item
                            key={s}
                            onSelect={() => updateStatus({ orderId, status: s })}
                            className={cn(
                                "flex items-center gap-2 rounded-lg px-3 py-2 text-xs cursor-pointer outline-none",
                                "transition-colors hover:bg-[var(--bg-tertiary)]",
                                s === status && "text-amber-400",
                            )}
                        >
                            <Badge variant={getOrderStatusVariant(s)} dot size="sm">
                                {capitalize(s)}
                            </Badge>
                        </DropdownMenu.Item>
                    ))}
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    );
}