"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/ui/Card";
import { changePasswordSchema, type ChangePasswordFormValues } from "@/lib/validators/auth.schema";
import toast from "react-hot-toast";

const PASSWORD_RULES = [
    "At least 8 characters",
    "One uppercase letter",
    "One lowercase letter",
    "One number",
    "One special character",
];

export function PasswordSettings() {
    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<ChangePasswordFormValues>({
        resolver: zodResolver(changePasswordSchema),
    });

    const newPassword = watch("newPassword", "");

    const getStrength = (pwd: string): { label: string; color: string; width: string } => {
        if (!pwd) return { label: "", color: "bg-[var(--border-default)]", width: "0%" };
        if (pwd.length < 6) return { label: "Weak", color: "bg-danger-500", width: "25%" };
        if (pwd.length < 10) return { label: "Fair", color: "bg-warning-400", width: "50%" };
        if (!/[^A-Za-z0-9]/.test(pwd)) return { label: "Good", color: "bg-info-400", width: "75%" };
        return { label: "Strong", color: "bg-success-400", width: "100%" };
    };

    const strength = getStrength(newPassword);

    const onSubmit = async (values: ChangePasswordFormValues) => {
        // In production: call changePassword API endpoint
        // For mock: simulate success
        await new Promise((r) => setTimeout(r, 800));
        if (values.currentPassword === "wrong") {
            toast.error("Current password is incorrect");
            return;
        }
        toast.success("Password updated successfully");
        reset();
    };

    return (
        <Card>
            <CardHeader title="Change Password" description="Keep your account secure" />
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardBody className="flex flex-col gap-4">
                    <Input
                        label="Current Password"
                        type="password"
                        placeholder="••••••••"
                        autoComplete="current-password"
                        error={errors.currentPassword?.message}
                        {...register("currentPassword")}
                    />

                    <Input
                        label="New Password"
                        type="password"
                        placeholder="Min. 8 characters"
                        autoComplete="new-password"
                        error={errors.newPassword?.message}
                        {...register("newPassword")}
                    />

                    {/* Strength indicator */}
                    {newPassword && (
                        <div className="flex flex-col gap-1.5">
                            <div className="flex items-center justify-between">
                                <p className="text-xs text-[var(--text-tertiary)]">Password strength</p>
                                <p className="text-xs font-medium text-[var(--text-secondary)]">{strength.label}</p>
                            </div>
                            <div className="h-1.5 w-full rounded-full bg-[var(--border-default)] overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-300 ${strength.color}`}
                                    style={{ width: strength.width }}
                                />
                            </div>
                        </div>
                    )}

                    <Input
                        label="Confirm New Password"
                        type="password"
                        placeholder="••••••••"
                        autoComplete="new-password"
                        error={errors.confirmPassword?.message}
                        {...register("confirmPassword")}
                    />

                    {/* Rules */}
                    <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-3">
                        <p className="text-xs font-medium text-[var(--text-secondary)] mb-2">
                            Password requirements
                        </p>
                        <ul className="space-y-1">
                            {PASSWORD_RULES.map((rule) => (
                                <li key={rule} className="flex items-center gap-2 text-xs text-[var(--text-tertiary)]">
                                    <span className="text-[var(--text-tertiary)]">•</span> {rule}
                                </li>
                            ))}
                        </ul>
                    </div>
                </CardBody>

                <CardFooter>
                    <div />
                    <Button type="submit" isLoading={isSubmitting}>
                        Update Password
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}