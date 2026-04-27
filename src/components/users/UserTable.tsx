"use client";

import { Pencil, Trash2 } from "lucide-react";
import { Table, TablePagination, type TableColumn } from "@/components/ui/Table";
import { Badge, getUserStatusVariant } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { UserAvatar } from "./UserAvatar";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setUserPage, setUserFilters, setUserFormOpen, setSelectedUser } from "@/store/slices/userSlice";
import { useGetUsersQuery, useDeleteUserMutation } from "@/store/api/userApi";
import { formatDate, capitalize } from "@/lib/utils/format";
import type { User } from "@/types/user.types";

const ROLE_COLORS: Record<string, string> = {
    admin: "amber", manager: "info", viewer: "neutral",
};

export function UserTable() {
    const dispatch = useAppDispatch();
    const filters = useAppSelector((s) => s.user.filters);
    const { data, isLoading } = useGetUsersQuery(filters);
    const [deleteUser] = useDeleteUserMutation();

    const handleEdit = (user: User) => {
        dispatch(setSelectedUser(user.id));
        dispatch(setUserFormOpen(true));
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Delete this user?")) return;
        await deleteUser(id);
    };

    const columns: TableColumn<User>[] = [
        {
            key: "firstName",
            header: "User",
            render: (_, row) => <UserAvatar user={row} />,
        },
        {
            key: "role",
            header: "Role",
            render: (val) => (
                <Badge variant={(ROLE_COLORS[String(val)] ?? "neutral") as "amber" | "info" | "neutral"} size="sm">
                    {capitalize(String(val))}
                </Badge>
            ),
        },
        {
            key: "status",
            header: "Status",
            render: (val) => (
                <Badge variant={getUserStatusVariant(String(val))} dot size="sm">
                    {capitalize(String(val))}
                </Badge>
            ),
        },
        {
            key: "createdAt",
            header: "Joined",
            sortable: true,
            render: (val) => <span className="text-xs text-[var(--text-secondary)]">{formatDate(String(val))}</span>,
        },
        {
            key: "totalOrders",
            header: "Orders",
            render: (val) => <span className="tabular-nums text-sm">{String(val)}</span>,
        },
        {
            key: "id",
            header: "Actions",
            width: "100px",
            render: (_, row) => (
                <div className="flex items-center gap-1.5">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(row)} leftIcon={<Pencil size={13} />}>Edit</Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(row.id)}
                        className="text-danger-400 hover:bg-danger-500/10"
                        leftIcon={<Trash2 size={13} />}
                    >Delete</Button>
                </div>
            ),
        },
    ];

    return (
        <div className="flex flex-col gap-0">
            <Table<User>
                columns={columns}
                data={data?.data ?? []}
                isLoading={isLoading}
                rowKey="id"
                emptyMessage="No users found."
                onSort={(sort) => dispatch(setUserFilters({ sortBy: sort.column, sortOrder: sort.direction }))}
            />
            {data?.pagination && (
                <TablePagination
                    page={data.pagination.page}
                    totalPages={data.pagination.totalPages}
                    total={data.pagination.total}
                    limit={data.pagination.limit}
                    onPageChange={(page) => dispatch(setUserPage(page))}
                    isLoading={isLoading}
                />
            )}
        </div>
    );
}