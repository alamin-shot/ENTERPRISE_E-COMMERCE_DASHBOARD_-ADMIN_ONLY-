import type { Metadata } from "next";
import { OrderDetail } from "@/components/orders/OrderDetail";

export const metadata: Metadata = { title: "Order Detail" };

interface Props { params: Promise<{ id: string }> }

export default async function OrderDetailPage({ params }: Props) {
    const { id } = await params;
    return <OrderDetail id={id} />;
}