"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { AuthCard } from "./AuthCard";
import { AuthField } from "./AuthField";
import { AuthButton } from "./AuthButton";
import { useResetPasswordMutation } from "@/store/api/authApi";
import { clearOtpFlow } from "@/store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { resetPasswordSchema, type ResetPasswordFormValues } from "@/lib/validators/auth.schema";
import { AUTH_ROUTES } from "@/lib/constants/routes";

export function ResetPasswordForm() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { otpEmail } = useAppSelector((s) => s.auth);
    const [resetPassword, { isLoading }] = useResetPasswordMutation();

    useEffect(() => {
        if (!otpEmail) router.replace(AUTH_ROUTES.FORGOT_PASSWORD);
    }, [otpEmail, router]);

    const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordFormValues>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            otp: process.env.NEXT_PUBLIC_USE_MOCK === "true"
                ? (process.env.NEXT_PUBLIC_MOCK_OTP ?? "")
                : "",
        },
    });

    const onSubmit = async (values: ResetPasswordFormValues) => {
        if (!otpEmail) return;
        try {
            await resetPassword({ ...values, email: otpEmail, confirmPassword: values.confirmPassword }).unwrap();
            dispatch(clearOtpFlow());
            router.replace(AUTH_ROUTES.LOGIN);
        } catch {
            // handled by toast
        }
    };

    if (!otpEmail) return null;

    return (
        <AuthCard>
            <h1 className="text-2xl font-bold text-cosmos-50 mb-1">Reset password</h1>
            <p className="text-sm text-cosmos-300 mb-6">
                Create a new password for{" "}
                <span className="text-amber-400">{otpEmail}</span>
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
                <AuthField
                    label="OTP code"
                    type="text"
                    inputMode="numeric"
                    placeholder="123456"
                    maxLength={6}
                    error={errors.otp?.message}
                    {...register("otp")}
                />

                <AuthField
                    label="New password"
                    type="password"
                    placeholder="Min. 8 chars, 1 uppercase, 1 number"
                    autoComplete="new-password"
                    error={errors.password?.message}
                    {...register("password")}
                />

                <AuthField
                    label="Confirm new password"
                    type="password"
                    placeholder="••••••••"
                    autoComplete="new-password"
                    error={errors.confirmPassword?.message}
                    {...register("confirmPassword")}
                />

                <AuthButton type="submit" isLoading={isLoading} className="mt-2">
                    Reset password
                </AuthButton>
            </form>
        </AuthCard>
    );
}