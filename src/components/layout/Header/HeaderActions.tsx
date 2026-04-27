"use client";

import { Bell } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { Avatar } from "@/components/ui/Avatar";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { AUTH_ROUTES, DASHBOARD_ROUTES } from "@/lib/constants/routes";
import { formatFullName } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import toast from "react-hot-toast";

export function HeaderActions() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const user = useAppSelector((s) => s.auth.user);

    const handleLogout = () => {
        dispatch(logout());
        toast.success("Signed out successfully");
        router.replace(AUTH_ROUTES.LOGIN);
    };

    const menuItemClass = cn(
        "flex items-center gap-2 rounded-lg px-3 py-2 text-sm cursor-pointer",
        "text-[var(--text-secondary)] outline-none transition-colors",
        "hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]",
        "focus:bg-[var(--bg-secondary)]",
    );

    return (
        <div className="flex items-center gap-2">
            <ThemeToggle />

            {/* Notifications */}
            <button
                aria-label="Notifications"
                className={cn(
                    "relative flex h-8 w-8 items-center justify-center rounded-lg",
                    "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]",
                    "transition-colors duration-150",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50",
                )}
            >
                <Bell size={16} />
                {/* Unread dot */}
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-amber-400 ring-2 ring-[var(--bg-primary)]" />
            </button>

            {/* User avatar dropdown */}
            <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                    <button
                        aria-label="User menu"
                        className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50"
                    >
                        <Avatar
                            src={user?.avatar}
                            firstName={user?.firstName ?? "A"}
                            lastName={user?.lastName ?? "U"}
                            size="sm"
                            status="online"
                        />
                    </button>
                </DropdownMenu.Trigger>

                <DropdownMenu.Portal>
                    <DropdownMenu.Content
                        align="end"
                        sideOffset={8}
                        className={cn(
                            "z-50 min-w-[200px] rounded-xl border border-[var(--border-subtle)]",
                            "bg-[var(--bg-elevated)] shadow-[var(--shadow-card)]",
                            "p-1.5 animate-scale-in",
                        )}
                    >
                        {/* User info */}
                        <div className="px-3 py-2 border-b border-[var(--border-subtle)] mb-1">
                            <p className="text-sm font-semibold text-[var(--text-primary)]">
                                {user ? formatFullName(user.firstName, user.lastName) : "Admin"}
                            </p>
                            <p className="text-xs text-[var(--text-tertiary)] truncate">{user?.email}</p>
                        </div>

                        <DropdownMenu.Item
                            className={menuItemClass}
                            onSelect={() => router.push(DASHBOARD_ROUTES.SETTINGS)}
                        >
                            Settings
                        </DropdownMenu.Item>

                        <DropdownMenu.Separator className="my-1 h-px bg-[var(--border-subtle)]" />

                        <DropdownMenu.Item
                            className={cn(menuItemClass, "text-danger-400 hover:text-danger-300 hover:bg-danger-500/10")}
                            onSelect={handleLogout}
                        >
                            Sign out
                        </DropdownMenu.Item>
                    </DropdownMenu.Content>
                </DropdownMenu.Portal>
            </DropdownMenu.Root>
        </div>
    );
}