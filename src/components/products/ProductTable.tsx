"use client";

import { Table, TablePagination, type TableColumn } from "@/components/ui/Table";
import { Badge, getProductStatusVariant } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Pencil, Trash2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setProductPage, setProductFilters, setProductFormOpen, setSelectedProduct } from "@/store/slices/productSlice";
import { useGetProductsQuery, useDeleteProductMutation } from "@/store/api/productApi";
import { formatCurrency } from "@/lib/utils/format";
import { capitalize } from "@/lib/utils/format";
import type { Product } from "@/types/product.types";

export function ProductTable() {
    const dispatch = useAppDispatch();
    const filters = useAppSelector((s) => s.product.filters);
    const { data, isLoading } = useGetProductsQuery(filters);
    const [deleteProduct] = useDeleteProductMutation();

    const handleEdit = (product: Product) => {
        dispatch(setSelectedProduct(product.id));
        dispatch(setProductFormOpen(true));
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Delete this product?")) return;
        await deleteProduct(id);
    };

    const handleSort = (sort: { column: string; direction: "asc" | "desc" }) => {
        dispatch(setProductFilters({ sortBy: sort.column, sortOrder: sort.direction }));
    };

    const columns: TableColumn<Product>[] = [
        {
            key: "name",
            header: "Product",
            sortable: true,
            render: (_, row) => (
                <div className="flex flex-col">
                    <span className="text-sm font-medium text-[var(--text-primary)]">{row.name}</span>
                    <span className="text-xs text-[var(--text-tertiary)]">{row.sku}</span>
                </div>
            ),
        },
        {
            key: "category",
            header: "Category",
            render: (val) => <span className="capitalize text-sm">{capitalize(String(val))}</span>,
        },
        {
            key: "price",
            header: "Price",
            sortable: true,
            render: (val) => (
                <span className="font-semibold text-amber-400 tabular-nums">
                    {formatCurrency(Number(val))}
                </span>
            ),
        },
        {
            key: "stock",
            header: "Stock",
            sortable: true,
            render: (val) => {
                const stock = Number(val);
                return (
                    <span className={stock === 0 ? "text-danger-400" : stock < 10 ? "text-warning-400" : "text-[var(--text-primary)]"}>
                        {stock === 0 ? "Out of stock" : stock}
                    </span>
                );
            },
        },
        {
            key: "status",
            header: "Status",
            render: (val) => (
                <Badge variant={getProductStatusVariant(String(val))} dot size="sm">
                    {capitalize(String(val))}
                </Badge>
            ),
        },
        {
            key: "id",
            header: "Actions",
            width: "100px",
            render: (_, row) => (
                <div className="flex items-center gap-1.5">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(row)} leftIcon={<Pencil size={13} />}>
                        Edit
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(row.id)}
                        className="text-danger-400 hover:text-danger-300 hover:bg-danger-500/10"
                        leftIcon={<Trash2 size={13} />}
                    >
                        Delete
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div className="flex flex-col gap-0">
            <Table<Product>
                columns={columns}
                data={data?.data ?? []}
                isLoading={isLoading}
                rowKey="id"
                emptyMessage="No products found. Try adjusting your filters."
                onSort={handleSort}
            />
            {data?.pagination && (
                <TablePagination
                    page={data.pagination.page}
                    totalPages={data.pagination.totalPages}
                    total={data.pagination.total}
                    limit={data.pagination.limit}
                    onPageChange={(page) => dispatch(setProductPage(page))}
                    isLoading={isLoading}
                />
            )}
        </div>
    );
}