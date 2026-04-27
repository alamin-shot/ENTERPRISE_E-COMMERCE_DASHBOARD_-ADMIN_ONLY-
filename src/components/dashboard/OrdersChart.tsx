"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { useGetOrderStatsQuery } from "@/store/api/orderApi";
import { capitalize } from "@/lib/utils/format";

const STATUS_COLORS: Record<string, string> = {
    pending: "#f59e0b",
    processing: "#F5A623",
    delivered: "#22c55e",
    cancelled: "#ef4444",
};

interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{ value: number; payload: { name: string } }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
    if (!active || !payload?.length) return null;
    const item = payload[0];
    if (!item) return null;
    return (
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-4 py-3 shadow-xl">
            <p className="text-xs text-[var(--text-tertiary)] mb-1">{capitalize(item.payload.name)}</p>
            <p className="text-sm font-semibold text-[var(--text-primary)]">{item.value} orders</p>
        </div>
    );
}

export function OrdersChart() {
    const { data, isLoading } = useGetOrderStatsQuery();
    const stats = data?.data;

    const chartData = [
        { name: "pending", value: stats?.pendingOrders ?? 0 },
        { name: "processing", value: stats?.processingOrders ?? 0 },
        { name: "delivered", value: stats?.deliveredOrders ?? 0 },
        { name: "cancelled", value: stats?.cancelledOrders ?? 0 },
    ];

    return (
        <Card>
            <CardHeader
                title="Orders by Status"
                description="Current breakdown"
            />
            <CardBody>
                {isLoading ? (
                    <div className="flex h-64 items-center justify-center">
                        <Spinner size="md" />
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height={256}>
                        <BarChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                            <XAxis
                                dataKey="name"
                                tick={{ fontSize: 11 }}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={capitalize}
                            />
                            <YAxis
                                tick={{ fontSize: 11 }}
                                tickLine={false}
                                axisLine={false}
                                allowDecimals={false}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--border-subtle)" }} />
                            <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={48}>
                                {chartData.map((entry: { name: string; value: number }) => (
                                    <Cell
                                        key={entry.name}
                                        fill={STATUS_COLORS[entry.name] ?? "#6b7a93"}
                                        fillOpacity={0.85}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </CardBody>
        </Card>
    );
}