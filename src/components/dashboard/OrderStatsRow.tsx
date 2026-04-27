// ─── components/dashboard/OrderStatsRow.tsx ─────────────────────────────────────

"use client";

import { ShoppingCart, Clock, DollarSign, TrendingUp } from "lucide-react";
import { StatsCard } from "./StatsCard";
import { useGetOrderStatsQuery } from "@/store/api/orderApi";

export function OrderStatsRow() {
    const { data, isLoading } = useGetOrderStatsQuery();
    const stats = data?.data;

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatsCard
                title="Total Orders"
                value={stats?.totalOrders ?? 0}
                icon={<ShoppingCart size={18} />}
                accent="info"
                isLoading={isLoading}
            />
            <StatsCard
                title="Pending"
                value={stats?.pendingOrders ?? 0}
                icon={<Clock size={18} />}
                accent="warning"
                isLoading={isLoading}
            />
            <StatsCard
                title="Revenue"
                value={stats?.totalRevenue ?? 0}
                prefix="$"
                icon={<DollarSign size={18} />}
                accent="success"
                isLoading={isLoading}
            />
            <StatsCard
                title="Avg Order"
                value={stats ? Math.round(stats.totalRevenue / Math.max(stats.totalOrders, 1)) : 0}
                prefix="$"
                icon={<TrendingUp size={18} />}
                accent="purple"
                isLoading={isLoading}
            />
        </div>
    );
}