"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthCard } from "./AuthCard";
import { AuthField } from "./AuthField";
import { AuthButton } from "./AuthButton";
import { AuthGuard } from "./AuthGuard";
import { useRegisterMutation } from "@/store/api/authApi";
import { setOtpFlow } from "@/store/slices/authSlice";
import { useAppDispatch } from "@/store/hooks";
import { registerSchema, type RegisterFormValues } from "@/lib/validators/auth.schema";
import { AUTH_ROUTES } from "@/lib/constants/routes";

export function RegisterForm() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [register_, { isLoading, error }] = useRegisterMutation();

    const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
    });

    useEffect(() => {
        if (error) console.error("Registration error:", error);
    }, [error]);

    const onSubmit = async (values: RegisterFormValues) => {
        try {
            await register_(values).unwrap();
            dispatch(setOtpFlow({ email: values.email, purpose: "email-verification" }));
            router.push(AUTH_ROUTES.OTP_VERIFY);
        } catch {
            // handled by toast in authApi
        }
    };

    return (
        <AuthGuard>
            <AuthCard>
                <h1 className="text-2xl font-bold text-cosmos-50 mb-1">Create account</h1>
                <p className="text-sm text-cosmos-300 mb-6">Join the enterprise dashboard</p>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
                    <div className="grid grid-cols-2 gap-3">
                        <AuthField
                            label="First name"
                            type="text"
                            placeholder="John"
                            autoComplete="given-name"
                            error={errors.firstName?.message}
                            {...register("firstName")}
                        />
                        <AuthField
                            label="Last name"
                            type="text"
                            placeholder="Doe"
                            autoComplete="family-name"
                            error={errors.lastName?.message}
                            {...register("lastName")}
                        />
                    </div>

                    <AuthField
                        label="Email"
                        type="email"
                        placeholder="john@company.com"
                        autoComplete="email"
                        error={errors.email?.message}
                        {...register("email")}
                    />

                    <AuthField
                        label="Password"
                        type="password"
                        placeholder="Min. 8 chars, 1 uppercase, 1 number"
                        autoComplete="new-password"
                        error={errors.password?.message}
                        {...register("password")}
                    />

                    <AuthField
                        label="Confirm password"
                        type="password"
                        placeholder="••••••••"
                        autoComplete="new-password"
                        error={errors.confirmPassword?.message}
                        {...register("confirmPassword")}
                    />

                    <AuthButton type="submit" isLoading={isLoading} className="mt-2">
                        Create account
                    </AuthButton>
                </form>

                <p className="mt-6 text-center text-xs text-cosmos-400">
                    Already have an account?{" "}
                    <Link
                        href={AUTH_ROUTES.LOGIN}
                        className="text-amber-400 hover:text-amber-300 transition-colors font-medium"
                    >
                        Sign in
                    </Link>
                </p>
            </AuthCard>
        </AuthGuard>
    );
}