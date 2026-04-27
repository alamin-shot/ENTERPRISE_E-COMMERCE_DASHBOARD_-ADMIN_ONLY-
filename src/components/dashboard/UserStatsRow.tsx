// ─── components/dashboard/UserStatsRow.tsx ──────────────────────────────────────

"use client";

import { Users, UserCheck, Shield, UserPlus } from "lucide-react";
import { StatsCard } from "./StatsCard";
import { useGetUserStatsQuery } from "@/store/api/userApi";

export function UserStatsRow() {
    const { data, isLoading } = useGetUserStatsQuery();
    const stats = data?.data;

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatsCard
                title="Total Users"
                value={stats?.totalUsers ?? 0}
                icon={<Users size={18} />}
                accent="info"
                isLoading={isLoading}
            />
            <StatsCard
                title="Active Now"
                value={stats?.activeUsers ?? 0}
                icon={<UserCheck size={18} />}
                accent="success"
                isLoading={isLoading}
            />
            <StatsCard
                title="Admins"
                value={2}
                icon={<Shield size={18} />}
                accent="amber"
                isLoading={isLoading}
            />
            <StatsCard
                title="New This Month"
                value={stats?.newUsersThisMonth ?? 0}
                icon={<UserPlus size={18} />}
                accent="purple"
                isLoading={isLoading}
            />
        </div>
    );
}