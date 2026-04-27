"use client";

import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    Settings,
} from "lucide-react";
import { SidebarNavItem, type NavItem } from "./SidebarNavItem";
import { useAppSelector } from "@/store/hooks";
import { DASHBOARD_ROUTES } from "@/lib/constants/routes";
import { useGetOrderStatsQuery } from "@/store/api/orderApi";

const NAV_ITEMS: NavItem[] = [
    {
        label: "Dashboard",
        href: DASHBOARD_ROUTES.HOME,
        icon: <LayoutDashboard size={17} />,
    },
    {
        label: "Products",
        href: DASHBOARD_ROUTES.PRODUCTS,
        icon: <Package size={17} />,
    },
    {
        label: "Orders",
        href: DASHBOARD_ROUTES.ORDERS,
        icon: <ShoppingCart size={17} />,
    },
    {
        label: "Users",
        href: DASHBOARD_ROUTES.USERS,
        icon: <Users size={17} />,
    },
    {
        label: "Settings",
        href: DASHBOARD_ROUTES.SETTINGS,
        icon: <Settings size={17} />,
    },
];

export function SidebarNav() {
    const pathname = usePathname();
    const isCollapsed = useAppSelector((s) => s.ui.sidebarCollapsed);
    const { data: orderStats } = useGetOrderStatsQuery();

    const navItemsWithBadge: NavItem[] = NAV_ITEMS.map((item) => {
        if (item.href === DASHBOARD_ROUTES.ORDERS && orderStats?.data.pendingOrders) {
            return { ...item, badge: orderStats.data.pendingOrders };
        }
        return item;
    });

    const isActive = (href: string) =>
        href === DASHBOARD_ROUTES.HOME
            ? pathname === href
            : pathname.startsWith(href);

    return (
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
            {!isCollapsed && (
                <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-cosmos-600">
                    Main Menu
                </p>
            )}
            {navItemsWithBadge.map((item) => (
                <SidebarNavItem
                    key={item.href}
                    item={item}
                    isActive={isActive(item.href)}
                    isCollapsed={isCollapsed}
                />
            ))}
        </nav>
    );
}