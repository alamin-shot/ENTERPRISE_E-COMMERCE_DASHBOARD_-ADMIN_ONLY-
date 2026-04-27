import type { Metadata } from "next";
import { ProductDetailClient } from "@/components/products/ProductDetailClient";

export const metadata: Metadata = { title: "Product Detail" };

interface Props { params: Promise<{ id: string }> }

export default async function ProductDetailPage({ params }: Props) {
    const { id } = await params;
    return <ProductDetailClient id={id} />;
}