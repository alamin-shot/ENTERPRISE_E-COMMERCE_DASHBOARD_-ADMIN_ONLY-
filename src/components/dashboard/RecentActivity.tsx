"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/ui/Card";
import { Badge, getOrderStatusVariant } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Spinner } from "@/components/ui/Spinner";
import { useGetOrdersQuery } from "@/store/api/orderApi";
import { formatCurrency, formatRelativeTime } from "@/lib/utils/format";
import { DASHBOARD_ROUTES } from "@/lib/constants/routes";
import { capitalize } from "@/lib/utils/format";
import type { Order } from "@/types/order.types";

export function RecentActivity() {
    const { data, isLoading } = useGetOrdersQuery({ page: 1, limit: 6, sortBy: "createdAt", sortOrder: "desc" });
    const orders: Order[] = data?.data ?? [];

    return (
        <Card>
            <CardHeader
                title="Recent Orders"
                description="Latest activity"
                action={
                    <Link
                        href={DASHBOARD_ROUTES.ORDERS}
                        className="text-xs text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1"
                    >
                        View all <ArrowRight size={12} />
                    </Link>
                }
            />

            <CardBody noPadding>
                {isLoading ? (
                    <div className="flex h-48 items-center justify-center">
                        <Spinner size="md" />
                    </div>
                ) : (
                    <ul className="divide-y divide-[var(--border-subtle)]">
                        {orders.map((order) => (
                            <li key={order.id}>
                                <Link
                                    href={DASHBOARD_ROUTES.ORDER(order.id)}
                                    className="flex items-center gap-3 px-6 py-3 hover:bg-[var(--bg-secondary)] transition-colors"
                                >
                                    <Avatar
                                        firstName={order.customer.name.split(" ")[0] ?? "U"}
                                        lastName={order.customer.name.split(" ")[1] ?? ""}
                                        src={order.customer.avatar}
                                        size="sm"
                                    />

                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                                            {order.customer.name}
                                        </p>
                                        <p className="text-xs text-[var(--text-tertiary)]">
                                            {order.orderNumber} · {formatRelativeTime(order.createdAt)}
                                        </p>
                                    </div>

                                    <div className="flex flex-col items-end gap-1 shrink-0">
                                        <span className="text-sm font-semibold text-[var(--text-primary)] tabular-nums">
                                            {formatCurrency(order.total)}
                                        </span>
                                        <Badge
                                            variant={getOrderStatusVariant(order.status)}
                                            size="sm"
                                            dot
                                        >
                                            {capitalize(order.status)}
                                        </Badge>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </CardBody>

            <CardFooter>
                <p className="text-xs text-[var(--text-tertiary)]">
                    Showing {orders.length} most recent orders
                </p>
            </CardFooter>
        </Card>
    );
}