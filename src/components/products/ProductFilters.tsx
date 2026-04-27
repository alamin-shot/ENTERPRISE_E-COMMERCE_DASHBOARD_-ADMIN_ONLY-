"use client";

import { useCallback } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setProductFilters, resetProductFilters } from "@/store/slices/productSlice";
import { useDebounce } from "@/hooks/useDebounce";
import { useEffect, useState } from "react";

const STATUS_OPTIONS = [
    { value: "all", label: "All Statuses" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "draft", label: "Draft" },
    { value: "archived", label: "Archived" },
];

const CATEGORY_OPTIONS = [
    { value: "all", label: "All Categories" },
    { value: "electronics", label: "Electronics" },
    { value: "clothing", label: "Clothing" },
    { value: "food", label: "Food" },
    { value: "furniture", label: "Furniture" },
    { value: "sports", label: "Sports" },
    { value: "beauty", label: "Beauty" },
    { value: "other", label: "Other" },
];

export function ProductFilters() {
    const dispatch = useAppDispatch();
    const filters = useAppSelector((s) => s.product.filters);
    const [search, setSearch] = useState(filters.search ?? "");
    const debouncedSearch = useDebounce(search, 400);

    useEffect(() => {
        dispatch(setProductFilters({ search: debouncedSearch || undefined }));
    }, [debouncedSearch, dispatch]);

    const handleStatus = useCallback((value: string) => {
        dispatch(setProductFilters({ status: value === "all" ? undefined : (value as typeof filters.status) }));
    }, [dispatch]);

    const handleCategory = useCallback((value: string) => {
        dispatch(setProductFilters({ category: value as typeof filters.category || undefined }));
    }, [dispatch, filters.category]);

    const handleReset = () => {
        setSearch("");
        dispatch(resetProductFilters());
    };

    const hasFilters = !!filters.search || !!filters.status || !!filters.category;

    return (
        <div className="flex flex-wrap items-end gap-3">
            <div className="flex-1 min-w-[180px] max-w-xs">
                <Input
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    leftIcon={<Search size={14} />}
                    rightIcon={search
                        ? <button onClick={() => setSearch("")}><X size={12} /></button>
                        : undefined
                    }
                />
            </div>

            <div className="w-40">
                <Select
                    options={STATUS_OPTIONS}
                    value={filters.status ?? "all"}
                    onValueChange={handleStatus}
                    placeholder="Status"
                />
            </div>

            <div className="w-44">
                <Select
                    options={CATEGORY_OPTIONS}
                    value={filters.category ?? ""}
                    onValueChange={handleCategory}
                    placeholder="Category"
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