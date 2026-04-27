"use client";

import { useCallback, useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setOrderFilters, resetOrderFilters } from "@/store/slices/orderSlice";
import { useDebounce } from "@/hooks/useDebounce";
import type { OrderStatus } from "@/types/order.types";

const STATUS_OPTIONS = [
    { value: "all", label: "All Statuses" },
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "processing", label: "Processing" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
    { value: "refunded", label: "Refunded" },
];

export function OrderFilters() {
    const dispatch = useAppDispatch();
    const filters = useAppSelector((s) => s.order.filters);
    const [search, setSearch] = useState(filters.search ?? "");
    const debouncedSearch = useDebounce(search, 400);

    useEffect(() => {
        dispatch(setOrderFilters({ search: debouncedSearch || undefined }));
    }, [debouncedSearch, dispatch]);

    const handleStatus = useCallback((value: string) => {
        dispatch(setOrderFilters({ status: value === "all" ? undefined : (value as OrderStatus) }));
    }, [dispatch]);

    const handleReset = () => {
        setSearch("");
        dispatch(resetOrderFilters());
    };

    const hasFilters = !!filters.search || !!filters.status;

    return (
        <div className="flex flex-wrap items-end gap-3">
            <div className="flex-1 min-w-[180px] max-w-xs">
                <Input
                    placeholder="Search orders..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    leftIcon={<Search size={14} />}
                />
            </div>
            <div className="w-44">
                <Select
                    options={STATUS_OPTIONS}
                    value={filters.status ?? "all"}
                    onValueChange={handleStatus}
                    placeholder="Status"
                />
            </div>
            {hasFilters && (
                <Button variant="ghost" size="sm" onClick={handleReset} leftIcon={<X size={13} />}>
                    Clear
                </Button>
            )}
        </div>
    );
}