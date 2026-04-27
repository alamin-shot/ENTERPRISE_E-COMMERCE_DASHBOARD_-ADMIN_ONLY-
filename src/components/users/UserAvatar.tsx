"use client";

import { Avatar } from "@/components/ui/Avatar";
import { formatFullName } from "@/lib/utils/format";
import type { User } from "@/types/user.types";

interface UserAvatarProps {
    user: User;
    showEmail?: boolean;
}

export function UserAvatar({ user, showEmail = true }: UserAvatarProps) {
    return (
        <div className="flex items-center gap-2.5">
            <Avatar
                src={user.avatar}
                firstName={user.firstName}
                lastName={user.lastName}
                size="sm"
                status={user.status === "active" ? "online" : "offline"}
            />
            <div className="min-w-0">
                <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                    {formatFullName(user.firstName, user.lastName)}
                </p>
                {showEmail && (
                    <p className="text-xs text-[var(--text-tertiary)] truncate">{user.email}</p>
                )}
            </div>
        </div>
    );
}