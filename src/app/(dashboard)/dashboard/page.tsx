import type { Metadata } from "next";
import { KpiRow } from "@/components/dashboard/KpiRow";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { OrdersChart } from "@/components/dashboard/OrdersChart";
import { TopProducts } from "@/components/dashboard/TopProducts";
import { RecentActivity } from "@/components/dashboard/RecentActivity";

export const metadata: Metadata = { title: "Dashboard" };

// Server Component — no "use client"
export default function DashboardPage() {
    return (
        <div className="flex flex-col gap-6">
            {/* KPI Stats Row */}
            <KpiRow />

            {/* Charts Row */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <RevenueChart />
                <OrdersChart />
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <TopProducts />
                <RecentActivity />
            </div>
        </div>
    );
}