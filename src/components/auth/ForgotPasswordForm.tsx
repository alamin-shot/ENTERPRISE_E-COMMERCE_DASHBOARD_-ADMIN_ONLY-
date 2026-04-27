"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AuthCard } from "./AuthCard";
import { AuthField } from "./AuthField";
import { AuthButton } from "./AuthButton";
import { useForgotPasswordMutation } from "@/store/api/authApi";
import { setOtpFlow } from "@/store/slices/authSlice";
import { useAppDispatch } from "@/store/hooks";
import { forgotPasswordSchema, type ForgotPasswordFormValues } from "@/lib/validators/auth.schema";
import { AUTH_ROUTES } from "@/lib/constants/routes";

export function ForgotPasswordForm() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

    const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormValues>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = async (values: ForgotPasswordFormValues) => {
        try {
            await forgotPassword(values).unwrap();
            dispatch(setOtpFlow({ email: values.email, purpose: "password-reset" }));
            router.push(AUTH_ROUTES.OTP_VERIFY);
        } catch {
            // handled by toast
        }
    };

    return (
        <AuthCard>
            <Link
                href={AUTH_ROUTES.LOGIN}
                className="inline-flex items-center gap-1.5 text-xs text-cosmos-400 hover:text-cosmos-200 transition-colors mb-6"
            >
                <ArrowLeft size={13} /> Back to login
            </Link>

            <h1 className="text-2xl font-bold text-cosmos-50 mb-1">Forgot password?</h1>
            <p className="text-sm text-cosmos-300 mb-6">
                Enter your email and we&apos;ll send you a reset OTP.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
                <AuthField
                    label="Email address"
                    type="email"
                    placeholder="admin@enterprise.com"
                    autoComplete="email"
                    error={errors.email?.message}
                    {...register("email")}
                />

                <AuthButton type="submit" isLoading={isLoading} className="mt-2">
                    Send reset OTP
                </AuthButton>
            </form>
        </AuthCard>
    );
}