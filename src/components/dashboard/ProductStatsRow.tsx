// ─── components/dashboard/ProductStatsRow.tsx ───────────────────────────────────

"use client";

import { Package, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { StatsCard } from "./StatsCard";
import { useGetProductStatsQuery } from "@/store/api/productApi";

export function ProductStatsRow() {
    const { data, isLoading } = useGetProductStatsQuery();
    const stats = data?.data;

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatsCard
                title="Total Products"
                value={stats?.totalProducts ?? 0}
                icon={<Package size={18} />}
                accent="info"
                isLoading={isLoading}
            />
            <StatsCard
                title="Active Products"
                value={stats?.activeProducts ?? 0}
                icon={<CheckCircle size={18} />}
                accent="success"
                isLoading={isLoading}
            />
            <StatsCard
                title="Low Stock"
                value={stats?.lowStock ?? 0}
                icon={<AlertTriangle size={18} />}
                accent="warning"
                isLoading={isLoading}
            />
            <StatsCard
                title="Out of Stock"
                value={stats?.outOfStock ?? 0}
                icon={<XCircle size={18} />}
                accent="danger"
                isLoading={isLoading}
            />
        </div>
    );
}