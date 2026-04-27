"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/ui/Card";
import { useAuth } from "@/hooks/useAuth";
import { useUpdateUserMutation } from "@/store/api/userApi";
import { updateUser } from "@/store/slices/authSlice";
import { useAppDispatch } from "@/store/hooks";

const profileSchema = z.object({
    firstName: z.string().min(2, "Min 2 characters").max(50),
    lastName: z.string().min(2, "Min 2 characters").max(50),
    email: z.string().email("Enter a valid email"),
    phone: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function ProfileSettings() {
    const { user } = useAuth();
    const dispatch = useAppDispatch();
    const [updateUserApi, { isLoading }] = useUpdateUserMutation();

    const { register, handleSubmit, reset, formState: { errors, isDirty } } =
        useForm<ProfileFormValues>({
            resolver: zodResolver(profileSchema),
            defaultValues: {
                firstName: user?.firstName ?? "",
                lastName: user?.lastName ?? "",
                email: user?.email ?? "",
                phone: "",
            },
        });

    useEffect(() => {
        if (user) {
            reset({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: "",
            });
        }
    }, [user, reset]);

    const onSubmit = async (values: ProfileFormValues) => {
        if (!user) return;
        try {
            await updateUserApi({ id: user.id, payload: values }).unwrap();
            dispatch(updateUser({ firstName: values.firstName, lastName: values.lastName }));
        } catch { /* handled by toast */ }
    };

    return (
        <Card>
            <CardHeader title="Profile Information" description="Update your personal details" />
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardBody className="flex flex-col gap-5">
                    {/* Avatar preview */}
                    <div className="flex items-center gap-4">
                        <Avatar
                            src={user?.avatar}
                            firstName={user?.firstName ?? "A"}
                            lastName={user?.lastName ?? "U"}
                            size="lg"
                        />
                        <div>
                            <p className="text-sm font-medium text-[var(--text-primary)]">Profile Photo</p>
                            <p className="text-xs text-[var(--text-tertiary)] mt-0.5">
                                Avatar is auto-generated from your initials
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Input
                            label="First Name"
                            placeholder="John"
                            error={errors.firstName?.message}
                            {...register("firstName")}
                        />
                        <Input
                            label="Last Name"
                            placeholder="Doe"
                            error={errors.lastName?.message}
                            {...register("lastName")}
                        />
                    </div>

                    <Input
                        label="Email Address"
                        type="email"
                        placeholder="john@company.com"
                        error={errors.email?.message}
                        {...register("email")}
                    />

                    <Input
                        label="Phone"
                        type="tel"
                        placeholder="+1 555 000 0000"
                        error={errors.phone?.message}
                        {...register("phone")}
                    />
                </CardBody>

                <CardFooter>
                    <p className="text-xs text-[var(--text-tertiary)]">
                        Role: <span className="capitalize text-amber-400">{user?.role}</span>
                    </p>
                    <Button type="submit" isLoading={isLoading} disabled={!isDirty}>
                        Save Changes
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}