"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { createUserSchema, type CreateUserFormValues } from "@/lib/validators/user.schema";
import { useCreateUserMutation, useUpdateUserMutation } from "@/store/api/userApi";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setUserFormOpen, setSelectedUser } from "@/store/slices/userSlice";
import type { User } from "@/types/user.types";

const ROLE_OPTIONS = ["admin", "manager", "viewer"].map((r) => ({ value: r, label: r.charAt(0).toUpperCase() + r.slice(1) }));
const STATUS_OPTIONS = ["active", "inactive", "suspended", "pending"].map((s) => ({ value: s, label: s.charAt(0).toUpperCase() + s.slice(1) }));

interface UserFormProps { editUser?: User | undefined }

export function UserForm({ editUser }: UserFormProps) {
    const dispatch = useAppDispatch();
    const isOpen = useAppSelector((s) => s.user.isFormOpen);
    const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
    const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
    const isLoading = isCreating || isUpdating;

    const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<CreateUserFormValues>({
        resolver: zodResolver(createUserSchema),
        defaultValues: editUser ? {
            firstName: editUser.firstName,
            lastName: editUser.lastName,
            email: editUser.email,
            role: editUser.role,
            status: editUser.status,
            phone: editUser.phone ?? undefined,
            password: "placeholder",
        } : { role: "viewer", status: "active" },
    });

    const currentRole = watch("role");
    const currentStatus = watch("status");

    useEffect(() => {
        if (!isOpen) reset();
    }, [isOpen, reset]);

    // Reset form when editUser data arrives asynchronously
    useEffect(() => {
        if (editUser) {
            reset({
                firstName: editUser.firstName,
                lastName: editUser.lastName,
                email: editUser.email,
                role: editUser.role,
                status: editUser.status,
                phone: editUser.phone ?? undefined,
                password: "placeholder",
            });
        }
    }, [editUser, reset]);

    const onClose = () => {
        dispatch(setUserFormOpen(false));
        dispatch(setSelectedUser(null));
    };

    const onSubmit = async (values: CreateUserFormValues) => {
        try {
            if (editUser) {
                await updateUser({ id: editUser.id, payload: values }).unwrap();
            } else {
                await createUser(values).unwrap();
            }
            onClose();
        } catch { /* handled by toast */ }
    };

    return (
        <Modal.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <Modal.Content size="md">
                <Modal.Header
                    title={editUser ? "Edit User" : "Add User"}
                    description={editUser ? "Update user details" : "Create a new user account"}
                />
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="px-6 py-4 flex flex-col gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <Input label="First Name" placeholder="John" error={errors.firstName?.message} {...register("firstName")} />
                            <Input label="Last Name" placeholder="Doe" error={errors.lastName?.message}  {...register("lastName")} />
                        </div>
                        <Input label="Email" type="email" placeholder="john@company.com" error={errors.email?.message} {...register("email")} />
                        {!editUser && (
                            <Input label="Password" type="password" placeholder="Min. 8 chars" error={errors.password?.message} {...register("password")} />
                        )}
                        <Input label="Phone" type="tel" placeholder="+1 555 000 0000" error={errors.phone?.message} {...register("phone")} />
                        <div className="grid grid-cols-2 gap-4">
                            <Select label="Role" options={ROLE_OPTIONS} value={currentRole} onValueChange={(v) => setValue("role", v as CreateUserFormValues["role"])} error={errors.role?.message} />
                            <Select label="Status" options={STATUS_OPTIONS} value={currentStatus} onValueChange={(v) => setValue("status", v as CreateUserFormValues["status"])} error={errors.status?.message} />
                        </div>
                    </div>
                    <Modal.Footer>
                        <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                        <Button type="submit" isLoading={isLoading}>
                            {editUser ? "Save Changes" : "Create User"}
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal.Content>
        </Modal.Root>
    );
}