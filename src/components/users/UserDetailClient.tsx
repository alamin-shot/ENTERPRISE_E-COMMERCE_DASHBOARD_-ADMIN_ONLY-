"use client";

import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useGetUserByIdQuery } from "@/store/api/userApi";
import { useAppDispatch } from "@/store/hooks";
import { setPageTitle, setBreadcrumbs } from "@/store/slices/uiSlice";
import { Badge, getUserStatusVariant } from "@/components/ui/Badge";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Spinner } from "@/components/ui/Spinner";
import { formatCurrency, formatDate, formatFullName, capitalize } from "@/lib/utils/format";
import { DASHBOARD_ROUTES } from "@/lib/constants/routes";

interface Props { id: string }

export function UserDetailClient({ id }: Props) {
    const dispatch = useAppDispatch();
    const { data, isLoading } = useGetUserByIdQuery(id);
    const user = data?.data;

    useEffect(() => {
        const name = user ? formatFullName(user.firstName, user.lastName) : "User Detail";
        dispatch(setPageTitle(name));
        dispatch(setBreadcrumbs([
            { label: "Dashboard", href: "/dashboard" },
            { label: "Users", href: DASHBOARD_ROUTES.USERS },
            { label: name, href: null },
        ]));
    }, [dispatch, user]);

    if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
    if (!user) return <p className="text-center text-[var(--text-secondary)] py-20">User not found.</p>;

    return (
        <div className="flex flex-col gap-6">
            <Link href={DASHBOARD_ROUTES.USERS} className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-amber-400 transition-colors">
                <ArrowLeft size={15} /> Back to Users
            </Link>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Profile card */}
                <Card className="flex flex-col items-center py-8 gap-3">
                    <Avatar src={user.avatar} firstName={user.firstName} lastName={user.lastName} size="xl" status={user.status === "active" ? "online" : "offline"} />
                    <div className="text-center">
                        <p className="text-lg font-bold text-[var(--text-primary)]">{formatFullName(user.firstName, user.lastName)}</p>
                        <p className="text-sm text-[var(--text-secondary)]">{user.email}</p>
                    </div>
                    <div className="flex gap-2">
                        <Badge variant="amber" size="sm">{capitalize(user.role)}</Badge>
                        <Badge variant={getUserStatusVariant(user.status)} dot size="sm">{capitalize(user.status)}</Badge>
                    </div>
                </Card>

                {/* Details */}
                <Card className="lg:col-span-2">
                    <CardHeader title="User Details" />
                    <CardBody className="grid grid-cols-2 gap-4">
                        {[
                            { label: "Phone", value: user.phone ?? "—" },
                            { label: "Joined", value: formatDate(user.createdAt) },
                            { label: "Last Login", value: user.lastLoginAt ? formatDate(user.lastLoginAt) : "Never" },
                            { label: "Total Orders", value: String(user.totalOrders) },
                            { label: "Total Spent", value: formatCurrency(user.totalSpent) },
                            { label: "Verified", value: user.isEmailVerified ? "Yes" : "No" },
                        ].map(({ label, value }) => (
                            <div key={label}>
                                <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider mb-1">{label}</p>
                                <p className="text-sm font-medium text-[var(--text-primary)]">{value}</p>
                            </div>
                        ))}
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}