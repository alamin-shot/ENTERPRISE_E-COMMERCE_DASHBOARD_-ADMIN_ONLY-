"use client";

import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { AUTH_ROUTES } from "@/lib/constants/routes";
import toast from "react-hot-toast";

export function useAuth() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const user = useAppSelector((s) => s.auth.user);
    const tokens = useAppSelector((s) => s.auth.tokens);
    const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
    const status = useAppSelector((s) => s.auth.status);
    const error = useAppSelector((s) => s.auth.error);

    const handleLogout = () => {
        dispatch(logout());
        toast.success("Signed out successfully");
        router.replace(AUTH_ROUTES.LOGIN);
    };

    const isAdmin = user?.role === "admin";
    const isManager = user?.role === "manager" || isAdmin;

    return {
        user,
        tokens,
        isAuthenticated,
        status,
        error,
        isAdmin,
        isManager,
        handleLogout,
    };
}