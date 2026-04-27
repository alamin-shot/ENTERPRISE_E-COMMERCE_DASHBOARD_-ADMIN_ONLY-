"use client";

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { useGetRevenueDataQuery } from "@/store/api/orderApi";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import type { RevenueDataPoint } from "@/types/order.types";

interface TooltipPayload {
    value: number;
    name: string;
}

interface CustomTooltipProps {
    active?: boolean;
    payload?: TooltipPayload[];
    label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
    if (!active || !payload?.length) return null;
    return (
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-4 py-3 shadow-xl">
            <p className="text-xs text-[var(--text-tertiary)] mb-2">
                {label ? formatDate(label) : ""}
            </p>
            {payload.map((entry: TooltipPayload, i: number) => (
                <p key={i} className="text-sm font-semibold text-[var(--text-primary)]">
                    {entry.name === "revenue"
                        ? formatCurrency(entry.value)
                        : `${entry.value} orders`
                    }
                </p>
            ))}
        </div>
    );
}

export function RevenueChart() {
    const { data, isLoading } = useGetRevenueDataQuery();

    const chartData = data?.data.map((d: RevenueDataPoint) => ({
        ...d,
        date: d.date.slice(5), // show MM-DD only
    })) ?? [];

    return (
        <Card className="lg:col-span-2">
            <CardHeader
                title="Revenue Overview"
                description="Last 30 days"
            />
            <CardBody>
                {isLoading ? (
                    <div className="flex h-64 items-center justify-center">
                        <Spinner size="md" />
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height={256}>
                        <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
                            <defs>
                                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#F5A623" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#F5A623" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                            <XAxis
                                dataKey="date"
                                tick={{ fontSize: 11 }}
                                tickLine={false}
                                axisLine={false}
                                interval={6}
                            />
                            <YAxis
                                tick={{ fontSize: 11 }}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Area
                                type="monotone"
                                dataKey="revenue"
                                stroke="#F5A623"
                                strokeWidth={2}
                                fill="url(#revenueGrad)"
                                dot={false}
                                activeDot={{ r: 4, fill: "#F5A623", strokeWidth: 0 }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                )}
            </CardBody>
        </Card>
    );
}