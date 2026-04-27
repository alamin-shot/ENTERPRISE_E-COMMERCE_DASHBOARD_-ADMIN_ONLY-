"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { DEFAULT_AUTH_REDIRECT } from "@/lib/constants/routes";

interface AuthGuardProps {
    children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
    const router = useRouter();
    const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);

    useEffect(() => {
        if (isAuthenticated) {
            router.replace(DEFAULT_AUTH_REDIRECT);
        }
    }, [isAuthenticated, router]);

    if (isAuthenticated) return null;
    return <>{children}</>;
}