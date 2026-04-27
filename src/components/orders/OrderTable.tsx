"use client";

import Link from "next/link";
import { Eye } from "lucide-react";
import { Table, TablePagination, type TableColumn } from "@/components/ui/Table";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setOrderPage, setOrderFilters } from "@/store/slices/orderSlice";
import { useGetOrdersQuery } from "@/store/api/orderApi";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import { DASHBOARD_ROUTES } from "@/lib/constants/routes";
import type { Order } from "@/types/order.types";

export function OrderTable() {
    const dispatch = useAppDispatch();
    const filters = useAppSelector((s) => s.order.filters);
    const { data, isLoading } = useGetOrdersQuery(filters);

    const handleSort = (sort: { column: string; direction: "asc" | "desc" }) => {
        dispatch(setOrderFilters({ sortBy: sort.column, sortOrder: sort.direction }));
    };

    const columns: TableColumn<Order>[] = [
        {
            key: "orderNumber",
            header: "Order",
            sortable: true,
            render: (val) => (
                <span className="font-mono text-xs text-amber-400">{String(val)}</span>
            ),
        },
        {
            key: "customer",
            header: "Customer",
            render: (_, row) => (
                <div className="flex items-center gap-2.5">
                    <Avatar firstName={row.customer.name.split(" ")[0] ?? ""} lastName={row.customer.name.split(" ")[1] ?? ""} size="xs" />
                    <div>
                        <p className="text-sm font-medium text-[var(--text-primary)]">{row.customer.name}</p>
                        <p className="text-xs text-[var(--text-tertiary)]">{row.customer.email}</p>
                    </div>
                </div>
            ),
        },
        {
            key: "status",
            header: "Status",
            render: (_, row) => <OrderStatusBadge orderId={row.id} status={row.status} />,
        },
        {
            key: "total",
            header: "Total",
            sortable: true,
            render: (val) => (
                <span className="font-semibold text-[var(--text-primary)] tabular-nums">
                    {formatCurrency(Number(val))}
                </span>
            ),
        },
        {
            key: "createdAt",
            header: "Date",
            sortable: true,
            render: (val) => <span className="text-xs text-[var(--text-secondary)]">{formatDate(String(val))}</span>,
        },
        {
            key: "id",
            header: "",
            width: "60px",
            render: (_, row) => (
                <Link href={DASHBOARD_ROUTES.ORDER(row.id)}>
                    <Button variant="ghost" size="sm" leftIcon={<Eye size={13} />}>View</Button>
                </Link>
            ),
        },
    ];

    return (
        <div className="flex flex-col gap-0">
            <Table<Order>
                columns={columns}
                data={data?.data ?? []}
                isLoading={isLoading}
                rowKey="id"
                emptyMessage="No orders found."
                onSort={handleSort}
            />
            {data?.pagination && (
                <TablePagination
                    page={data.pagination.page}
                    totalPages={data.pagination.totalPages}
                    total={data.pagination.total}
                    limit={data.pagination.limit}
                    onPageChange={(page) => dispatch(setOrderPage(page))}
                    isLoading={isLoading}
                />
            )}
        </div>
    );
}