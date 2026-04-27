"use client";

import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useGetProductByIdQuery } from "@/store/api/productApi";
import { useAppDispatch } from "@/store/hooks";
import { setPageTitle, setBreadcrumbs } from "@/store/slices/uiSlice";
import { Badge, getProductStatusVariant } from "@/components/ui/Badge";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import { DASHBOARD_ROUTES } from "@/lib/constants/routes";
import { capitalize } from "@/lib/utils/format";

interface Props { id: string }

export function ProductDetailClient({ id }: Props) {
    const dispatch = useAppDispatch();
    const { data, isLoading } = useGetProductByIdQuery(id);
    const product = data?.data;

    useEffect(() => {
        dispatch(setPageTitle(product?.name ?? "Product Detail"));
        dispatch(setBreadcrumbs([
            { label: "Dashboard", href: "/dashboard" },
            { label: "Products", href: DASHBOARD_ROUTES.PRODUCTS },
            { label: product?.name ?? "Detail", href: null },
        ]));
    }, [dispatch, product?.name]);

    if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
    if (!product) return <p className="text-center text-[var(--text-secondary)] py-20">Product not found.</p>;

    return (
        <div className="flex flex-col gap-6">
            <Link href={DASHBOARD_ROUTES.PRODUCTS} className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-amber-400 transition-colors">
                <ArrowLeft size={15} /> Back to Products
            </Link>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Image */}
                <Card className="lg:col-span-1">
                    <CardBody className="flex items-center justify-center h-64">
                        {product.images[0] ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={product.images[0].url} alt={product.name} className="max-h-full object-contain rounded-lg" />
                        ) : (
                            <div className="text-6xl">📦</div>
                        )}
                    </CardBody>
                </Card>

                {/* Info */}
                <Card className="lg:col-span-2">
                    <CardHeader title="Product Details" />
                    <CardBody className="grid grid-cols-2 gap-4">
                        {[
                            { label: "Name", value: product.name },
                            { label: "SKU", value: product.sku },
                            { label: "Price", value: formatCurrency(product.price) },
                            { label: "Stock", value: String(product.stock) },
                            { label: "Category", value: capitalize(product.category) },
                            { label: "Created", value: formatDate(product.createdAt) },
                        ].map(({ label, value }) => (
                            <div key={label}>
                                <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider mb-1">{label}</p>
                                <p className="text-sm font-medium text-[var(--text-primary)]">{value}</p>
                            </div>
                        ))}
                        <div className="col-span-2">
                            <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider mb-1">Status</p>
                            <Badge variant={getProductStatusVariant(product.status)} dot>{capitalize(product.status)}</Badge>
                        </div>
                        <div className="col-span-2">
                            <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider mb-1">Description</p>
                            <p className="text-sm text-[var(--text-secondary)]">{product.description}</p>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}