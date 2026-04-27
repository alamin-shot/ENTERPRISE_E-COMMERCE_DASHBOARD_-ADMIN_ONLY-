"use client";

import { useEffect } from "react";
import {
    ShoppingCart,
    DollarSign,
    Package,
    Users,
} from "lucide-react";
import { StatsCard } from "./StatsCard";
import { useAppDispatch } from "@/store/hooks";
import { setPageTitle, setBreadcrumbs } from "@/store/slices/uiSlice";
import { useGetOrderStatsQuery } from "@/store/api/orderApi";
import { useGetProductStatsQuery } from "@/store/api/productApi";
import { useGetUserStatsQuery } from "@/store/api/userApi";
import type { OrderStats } from "@/types/order.types";
import type { ProductStats } from "@/types/product.types";
import type { UserStats } from "@/types/user.types";

export function KpiRow() {
    const dispatch = useAppDispatch();

    const { data: orderData, isLoading: ordersLoading } = useGetOrderStatsQuery();
    const { data: productData, isLoading: productsLoading } = useGetProductStatsQuery();
    const { data: userData, isLoading: usersLoading } = useGetUserStatsQuery();

    useEffect(() => {
        dispatch(setPageTitle("Dashboard"));
        dispatch(setBreadcrumbs([{ label: "Dashboard", href: null }]));
    }, [dispatch]);

    const isLoading = ordersLoading || productsLoading || usersLoading;
    const orders: OrderStats | undefined = orderData?.data;
    const products: ProductStats | undefined = productData?.data;
    const users: UserStats | undefined = userData?.data;

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatsCard
                title="Total Revenue"
                value={orders?.totalRevenue ?? 0}
                format="currency"
                trend={12.5}
                icon={<DollarSign size={18} />}
                iconColor="bg-amber-400/10 text-amber-400"
                isLoading={isLoading}
            />
            <StatsCard
                title="Total Orders"
                value={orders?.totalOrders ?? 0}
                format="number"
                trend={8.2}
                icon={<ShoppingCart size={18} />}
                iconColor="bg-info-500/10 text-info-400"
                isLoading={isLoading}
            />
            <StatsCard
                title="Total Products"
                value={products?.totalProducts ?? 0}
                format="number"
                trend={-2.4}
                icon={<Package size={18} />}
                iconColor="bg-purple-500/10 text-purple-400"
                isLoading={isLoading}
            />
            <StatsCard
                title="Total Users"
                value={users?.totalUsers ?? 0}
                format="number"
                trend={5.1}
                icon={<Users size={18} />}
                iconColor="bg-success-500/10 text-success-400"
                isLoading={isLoading}
            />
        </div>
    );
}