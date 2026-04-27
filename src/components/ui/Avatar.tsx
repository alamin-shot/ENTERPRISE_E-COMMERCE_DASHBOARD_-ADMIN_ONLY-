"use client";

import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import { getInitials } from "@/lib/utils/format";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";
export type AvatarStatus = "online" | "offline" | "away" | "busy";

export interface AvatarProps {
    src?: string | null | undefined;
    firstName?: string | undefined;
    lastName?: string | undefined;
    size?: AvatarSize | undefined;
    status?: AvatarStatus | undefined;
    className?: string | undefined;
}

const sizeMap: Record<AvatarSize, { container: string; text: string; dot: string }> = {
    xs: { container: "w-6  h-6", text: "text-[9px]", dot: "w-1.5 h-1.5 border" },
    sm: { container: "w-8  h-8", text: "text-xs", dot: "w-2   h-2   border" },
    md: { container: "w-10 h-10", text: "text-sm", dot: "w-2.5 h-2.5 border-2" },
    lg: { container: "w-12 h-12", text: "text-base", dot: "w-3   h-3   border-2" },
    xl: { container: "w-16 h-16", text: "text-xl", dot: "w-3.5 h-3.5 border-2" },
};

const statusColors: Record<AvatarStatus, string> = {
    online: "bg-success-400",
    offline: "bg-cosmos-500",
    away: "bg-warning-400",
    busy: "bg-danger-400",
};

export function Avatar({
    src,
    firstName = "?",
    lastName = "",
    size = "md",
    status,
    className,
}: AvatarProps) {
    const { container, text, dot } = sizeMap[size];
    const initials = getInitials(firstName, lastName);

    return (
        <div className={cn("relative inline-flex shrink-0", className)}>
            <div
                className={cn(
                    "rounded-full overflow-hidden flex items-center justify-center",
                    "bg-gradient-to-br from-amber-400/30 to-cosmos-600",
                    "border border-white/10 font-semibold text-amber-400",
                    container,
                    text,
                )}
            >
                {src ? (
                    <Image
                        src={src}
                        alt={`${firstName} ${lastName}`}
                        fill
                        className="object-cover"
                        sizes="64px"
                    />
                ) : (
                    initials
                )}
            </div>

            {status && (
                <span
                    className={cn(
                        "absolute bottom-0 right-0 rounded-full border-cosmos-900",
                        dot,
                        statusColors[status],
                    )}
                />
            )}
        </div>
    );
}