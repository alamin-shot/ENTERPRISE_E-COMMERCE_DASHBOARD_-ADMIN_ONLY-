"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/ui/Avatar";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { AUTH_ROUTES } from "@/lib/constants/routes";
import { cn } from "@/lib/utils/cn";
import { formatFullName } from "@/lib/utils/format";
import toast from "react-hot-toast";

export function SidebarFooter() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const isCollapsed = useAppSelector((s) => s.ui.sidebarCollapsed);
    const user = useAppSelector((s) => s.auth.user);

    const handleLogout = () => {
        dispatch(logout());
        toast.success("Signed out successfully");
        router.replace(AUTH_ROUTES.LOGIN);
    };

    if (!user) return null;

    return (
        <div className={cn(
            "shrink-0 border-t border-[var(--sidebar-border)] p-3",
            "flex items-center gap-3",
            isCollapsed && "justify-center",
        )}>
            <Avatar
                src={user.avatar}
                firstName={user.firstName}
                lastName={user.lastName}
                size="sm"
                status="online"
            />

            {!isCollapsed && (
                <>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-xs font-semibold text-[var(--text-primary)] truncate">
                            {formatFullName(user.firstName, user.lastName)}
                        </p>
                        <p className="text-[10px] text-[var(--text-tertiary)] truncate capitalize">
                            {user.role}
                        </p>
                    </div>

                    <button
                        onClick={handleLogout}
                        aria-label="Sign out"
                        className={cn(
                            "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
                            "text-[var(--text-tertiary)] hover:text-danger-400 hover:bg-danger-500/10",
                            "transition-colors duration-150",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger-500/50",
                        )}
                    >
                        <LogOut size={14} />
                    </button>
                </>
            )}
        </div>
    );
}