"use client";

import { cn } from "@/lib/utils/cn";

interface AuthCardProps {
    children: React.ReactNode;
    className?: string;
}

export function AuthCard({ children, className }: AuthCardProps) {
    return (
        <div
            className={cn(
                "w-full max-w-md rounded-2xl p-8 animate-fade-in",
                "glass border border-white/10",
                "shadow-[0_8px_32px_rgba(0,0,0,0.4)]",
                className,
            )}
        >
            {/* Brand header */}
            <div className="mb-8 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/20 mb-4">
                    <span className="text-2xl font-bold gradient-text">E</span>
                </div>
                <p className="text-xs text-cosmos-300 tracking-widest uppercase">
                    Enterprise Dashboard
                </p>
            </div>

            {children}
        </div>
    );
}