"use client";

import { useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ProductFilters } from "./ProductFilters";
import { ProductTable } from "./ProductTable";
import { ProductForm } from "./ProductForm";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setProductFormOpen, setSelectedProduct } from "@/store/slices/productSlice";
import { setPageTitle, setBreadcrumbs } from "@/store/slices/uiSlice";
import { useGetProductByIdQuery } from "@/store/api/productApi";
import { ProductStatsRow } from "../dashboard/ProductStatsRow";

function EditProductWrapper() {
    const selectedId = useAppSelector((s) => s.product.selectedProductId);
    const { data } = useGetProductByIdQuery(selectedId ?? "", { skip: !selectedId });
    return <ProductForm editProduct={data?.data} />;
}

export function ProductsClient() {
    const dispatch = useAppDispatch();
    const isFormOpen = useAppSelector((s) => s.product.isFormOpen);
    const selectedId = useAppSelector((s) => s.product.selectedProductId);

    useEffect(() => {
        dispatch(setPageTitle("Products"));
        dispatch(setBreadcrumbs([
            { label: "Dashboard", href: "/dashboard" },
            { label: "Products", href: null },
        ]));
    }, [dispatch]);

    const handleAdd = () => {
        dispatch(setSelectedProduct(null));
        dispatch(setProductFormOpen(true));
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Page header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-[var(--text-primary)]">Products</h1>
                    <p className="text-sm text-[var(--text-secondary)]">Manage your product catalog</p>
                </div>
                <Button onClick={handleAdd} leftIcon={<Plus size={15} />}>
                    Add Product
                </Button>
            </div>

            {/* Stats row */}
            <ProductStatsRow />
            {/* Filters */}
            <ProductFilters />

            {/* Table */}
            <ProductTable />

            {/* Form modal */}
            {isFormOpen && (selectedId ? <EditProductWrapper /> : <ProductForm />)}
        </div>
    );
}