"use client";

import { useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { UserFilters } from "./UserFilters";
import { UserTable } from "./UserTable";
import { UserForm } from "./UserForm";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setUserFormOpen, setSelectedUser } from "@/store/slices/userSlice";
import { setPageTitle, setBreadcrumbs } from "@/store/slices/uiSlice";
import { useGetUserByIdQuery } from "@/store/api/userApi";
import { UserStatsRow } from "../dashboard/UserStatsRow";

function EditUserWrapper() {
    const selectedId = useAppSelector((s) => s.user.selectedUserId);
    const { data } = useGetUserByIdQuery(selectedId ?? "", { skip: !selectedId });
    return <UserForm editUser={data?.data} />;
}

export function UsersClient() {
    const dispatch = useAppDispatch();
    const isFormOpen = useAppSelector((s) => s.user.isFormOpen);
    const selectedId = useAppSelector((s) => s.user.selectedUserId);

    useEffect(() => {
        dispatch(setPageTitle("Users"));
        dispatch(setBreadcrumbs([
            { label: "Dashboard", href: "/dashboard" },
            { label: "Users", href: null },
        ]));
    }, [dispatch]);

    const handleAdd = () => {
        dispatch(setSelectedUser(null));
        dispatch(setUserFormOpen(true));
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-[var(--text-primary)]">Users</h1>
                    <p className="text-sm text-[var(--text-secondary)]">Manage user accounts and permissions</p>
                </div>
                <Button onClick={handleAdd} leftIcon={<Plus size={15} />}>Add User</Button>
            </div>
            <UserStatsRow />
            <UserFilters />
            <UserTable />
            {isFormOpen && (selectedId ? <EditUserWrapper /> : <UserForm />)}
        </div>
    );
}