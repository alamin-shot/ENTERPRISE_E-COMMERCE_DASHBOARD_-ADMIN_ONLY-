"use client";

import { useCallback, useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setUserFilters, resetUserFilters } from "@/store/slices/userSlice";
import { useDebounce } from "@/hooks/useDebounce";
import type { UserStatus } from "@/types/user.types";
import type { UserRole } from "@/types/auth.types";

const ROLE_OPTIONS = [
    { value: "all", label: "All Roles" },
    { value: "admin", label: "Admin" },
    { value: "manager", label: "Manager" },
    { value: "viewer", label: "Viewer" },
];

const STATUS_OPTIONS = [
    { value: "all", label: "All Statuses" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "suspended", label: "Suspended" },
    { value: "pending", label: "Pending" },
];

export function UserFilters() {
    const dispatch = useAppDispatch();
    const filters = useAppSelector((s) => s.user.filters);
    const [search, setSearch] = useState(filters.search ?? "");
    const debouncedSearch = useDebounce(search, 400);

    useEffect(() => {
        dispatch(setUserFilters({ search: debouncedSearch || undefined }));
    }, [debouncedSearch, dispatch]);

    const handleRole = useCallback((value: string) => {
        dispatch(setUserFilters({ role: (value as UserRole) || undefined }));
    }, [dispatch]);

    const handleStatus = useCallback((value: string) => {
        dispatch(setUserFilters({ status: (value as UserStatus) || undefined }));
    }, [dispatch]);

    const handleReset = () => {
        setSearch("");
        dispatch(resetUserFilters());
    };

    const hasFilters = !!filters.search || !!filters.role || !!filters.status;

    return (
        <div className="flex flex-wrap items-end gap-3">
            <div className="flex-1 min-w-[180px] max-w-xs">
                <Input
                    placeholder="Search users..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    leftIcon={<Search size={14} />}
                />
            </div>
            <div className="w-36">
                <Select options={ROLE_OPTIONS} value={filters.role ?? ""} onValueChange={handleRole} placeholder="Role" />
            </div>
            <div className="w-40">
                <Select options={STATUS_OPTIONS} value={filters.status ?? ""} onValueChange={handleStatus} placeholder="Status" />
            </div>
            {hasFilters && (
                <Button variant="ghost" size="sm" onClick={handleReset} leftIcon={<X size={13} />}>Clear</Button>
            )}
        </div>
    );
}