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
import { useLoginMutation } from "@/store/api/authApi";
import { setCredentials, setError } from "@/store/slices/authSlice";
import { useAppDispatch } from "@/store/hooks";
import { loginSchema, type LoginFormValues } from "@/lib/validators/auth.schema";
import { AUTH_ROUTES, DEFAULT_AUTH_REDIRECT } from "@/lib/constants/routes";
import type { TokenPair } from "@/types/api.types";

export function LoginForm() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [login, { isLoading, error }] = useLoginMutation();

    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: process.env.NEXT_PUBLIC_MOCK_EMAIL ?? "",
            password: process.env.NEXT_PUBLIC_MOCK_PASSWORD ?? "",
            rememberMe: false,
        },
    });

    useEffect(() => {
        if (error) dispatch(setError("Login failed. Please check your credentials."));
    }, [error, dispatch]);

    const onSubmit = async (values: LoginFormValues) => {
        try {
            const res = await login(values).unwrap();
            const tokens: TokenPair = {
                accessToken: res.data.accessToken,
                refreshToken: res.data.refreshToken,
            };
            dispatch(setCredentials({ user: res.data.user, tokens }));
            router.replace(DEFAULT_AUTH_REDIRECT);
        } catch {
            // error handled by RTK Query + interceptor toast
        }
    };

    return (
        <AuthGuard>
            <AuthCard>
                <h1 className="text-2xl font-bold text-cosmos-50 mb-1">Welcome back</h1>
                <p className="text-sm text-cosmos-300 mb-6">Sign in to your admin account</p>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
                    <AuthField
                        label="Email"
                        type="email"
                        placeholder="admin@enterprise.com"
                        autoComplete="email"
                        error={errors.email?.message}
                        {...register("email")}
                    />

                    <AuthField
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        autoComplete="current-password"
                        error={errors.password?.message}
                        {...register("password")}
                    />

                    <div className="flex items-center justify-between text-xs">
                        <label className="flex items-center gap-2 text-cosmos-300 cursor-pointer">
                            <input
                                type="checkbox"
                                className="accent-amber-400 rounded"
                                {...register("rememberMe")}
                            />
                            Remember me
                        </label>
                        <Link
                            href={AUTH_ROUTES.FORGOT_PASSWORD}
                            className="text-amber-400 hover:text-amber-300 transition-colors link-underline"
                        >
                            Forgot password?
                        </Link>
                    </div>

                    <AuthButton type="submit" isLoading={isLoading} className="mt-2">
                        Sign in
                    </AuthButton>
                </form>

                <p className="mt-6 text-center text-xs text-cosmos-400">
                    Don&apos;t have an account?{" "}
                    <Link
                        href={AUTH_ROUTES.REGISTER}
                        className="text-amber-400 hover:text-amber-300 transition-colors font-medium"
                    >
                        Create account
                    </Link>
                </p>

                {/* Mock credentials hint */}
                {process.env.NEXT_PUBLIC_USE_MOCK === "true" && (
                    <div className="mt-4 rounded-lg border border-amber-400/20 bg-amber-400/5 p-3">
                        <p className="text-xs text-amber-400/80 text-center">
                            Mock: admin@enterprise.com / Admin@123
                        </p>
                    </div>
                )}
            </AuthCard>
        </AuthGuard>
    );
}