"use client";

import { useEffect } from "react";
import { ArrowLeft, Package, MapPin, CreditCard, User, Hash } from "lucide-react";
import Link from "next/link";
import { useGetOrderByIdQuery } from "@/store/api/orderApi";
import { useAppDispatch } from "@/store/hooks";
import { setPageTitle, setBreadcrumbs } from "@/store/slices/uiSlice";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { Spinner } from "@/components/ui/Spinner";
import { formatCurrency, formatDate, capitalize } from "@/lib/utils/format";
import { DASHBOARD_ROUTES } from "@/lib/constants/routes";

interface Props { id: string }

export function OrderDetail({ id }: Props) {
    const dispatch = useAppDispatch();
    const { data, isLoading } = useGetOrderByIdQuery(id);
    const order = data?.data;

    useEffect(() => {
        dispatch(setPageTitle(order?.orderNumber ?? "Order Detail"));
        dispatch(setBreadcrumbs([
            { label: "Dashboard", href: "/dashboard" },
            { label: "Orders", href: DASHBOARD_ROUTES.ORDERS },
            { label: order?.orderNumber ?? "Detail", href: null },
        ]));
    }, [dispatch, order?.orderNumber]);

    if (isLoading) return (
        <div className="od-loading">
            <Spinner size="lg" />
        </div>
    );
    if (!order) return (
        <div className="od-empty">
            <span className="od-empty-icon">∅</span>
            <p>Order not found.</p>
        </div>
    );

    const summaryRows = [
        { label: "Subtotal", value: order.subtotal },
        { label: "Discount", value: -order.discount },
        { label: "Tax", value: order.tax },
        { label: "Shipping", value: order.shipping },
    ];

    return (
        <div className="od-root">
            <Link href={DASHBOARD_ROUTES.ORDERS} className="od-back">
                <ArrowLeft size={12} />
                Orders
            </Link>

            {/* Header */}
            <div className="od-header">
                <div>
                    <div className="od-order-label">
                        <Hash size={10} />
                        Order Reference
                    </div>
                    <h1 className="od-order-number">{order.orderNumber}</h1>
                    <p className="od-order-date">{formatDate(order.createdAt)}</p>
                </div>
                <OrderStatusBadge orderId={order.id} status={order.status} />
            </div>

            {/* Body */}
            <div className="od-grid">

                {/* Order Items Panel */}
                <div className="od-panel">
                    <div className="od-panel-header">
                        <div className="od-panel-icon">
                            <Package size={13} />
                        </div>
                        <span className="od-panel-title">Order Items</span>
                    </div>

                    <ul className="od-items">
                        {order.items.map((item) => (
                            <li key={item.id} className="od-item">
                                <div className="od-item-thumb">📦</div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p className="od-item-name">{item.productName}</p>
                                    <p className="od-item-sku">SKU: {item.sku} &nbsp;·&nbsp; Qty: {item.quantity}</p>
                                </div>
                                <span className="od-item-price">{formatCurrency(item.total)}</span>
                            </li>
                        ))}
                    </ul>

                    <div className="od-totals">
                        {summaryRows.map(({ label, value }) => (
                            <div key={label} className="od-total-row">
                                <span className="od-total-label">{label}</span>
                                <span className="od-total-val">{formatCurrency(value)}</span>
                            </div>
                        ))}
                        <div className="od-grand-divider" />
                        <div className="od-grand-row">
                            <span className="od-grand-label">Total</span>
                            <span className="od-grand-amount">{formatCurrency(order.total)}</span>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="od-sidebar">

                    {/* Customer */}
                    <div className="od-panel">
                        <div className="od-panel-header">
                            <div className="od-panel-icon"><User size={13} /></div>
                            <span className="od-panel-title">Customer</span>
                        </div>
                        <div className="od-info-body">
                            <p className="od-info-name">{order.customer.name}</p>
                            <p className="od-info-sub">{order.customer.email}</p>
                        </div>
                    </div>

                    {/* Payment */}
                    <div className="od-panel">
                        <div className="od-panel-header">
                            <div className="od-panel-icon"><CreditCard size={13} /></div>
                            <span className="od-panel-title">Payment</span>
                        </div>
                        <div className="od-info-body">
                            <div className="od-kv">
                                <span className="od-kv-key">Method</span>
                                <span className="od-kv-val">{order.paymentMethod.replace("_", " ")}</span>
                            </div>
                            <div className="od-ruled" />
                            <div className="od-kv">
                                <span className="od-kv-key">Status</span>
                                <span className={`od-pill ${order.paymentStatus === "paid" ? "success" : "warning"}`}>
                                    <span className="od-pill-dot" />
                                    {capitalize(order.paymentStatus)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="od-panel">
                        <div className="od-panel-header">
                            <div className="od-panel-icon"><MapPin size={13} /></div>
                            <span className="od-panel-title">Shipping Address</span>
                        </div>
                        <div className="od-info-body">
                            <address className="od-address">
                                <p>{order.shippingAddress.line1}</p>
                                {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
                                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                                <p>{order.shippingAddress.country}</p>
                            </address>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}