"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { setPageTitle, setBreadcrumbs } from "@/store/slices/uiSlice";
import { OrderFilters } from "./OrderFilters";
import { OrderTable } from "./OrderTable";
import { OrderStatsRow } from "../dashboard/OrderStatsRow";

export function OrdersClient() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(setPageTitle("Orders"));
        dispatch(setBreadcrumbs([
            { label: "Dashboard", href: "/dashboard" },
            { label: "Orders", href: null },
        ]));
    }, [dispatch]);

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-xl font-bold text-[var(--text-primary)]">Orders</h1>
                <p className="text-sm text-[var(--text-secondary)]">Manage and track customer orders</p>
            </div>
            <OrderStatsRow />
            <OrderFilters />
            <OrderTable />
        </div>
    );
}