import type { Metadata } from "next";
import { ProductsClient } from "@/components/products/ProductsClient";

export const metadata: Metadata = { title: "Products" };

export default function ProductsPage() {
    return <ProductsClient />;
}