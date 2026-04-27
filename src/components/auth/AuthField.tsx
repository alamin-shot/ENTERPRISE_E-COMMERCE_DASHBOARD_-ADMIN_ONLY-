"use client";

import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Button } from "../ui";

interface AuthFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string | undefined;
}

export const AuthField = forwardRef<HTMLInputElement, AuthFieldProps>(
    ({ label, error, type, className, ...props }, ref) => {
        const [showPassword, setShowPassword] = useState(false);
        const isPassword = type === "password";
        const inputType = isPassword && showPassword ? "text" : type;

        return (
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-cosmos-200 uppercase tracking-wider">
                    {label}
                </label>

                <div className="relative">
                    <input
                        ref={ref}
                        type={inputType}
                        className={cn(
                            "w-full rounded-lg px-4 py-3 text-sm",
                            "bg-cosmos-800/60 border border-white/10",
                            "text-cosmos-50 placeholder:text-cosmos-400",
                            "focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/30",
                            "transition-all duration-150",
                            error && "border-red-500/60 focus:border-red-500/60 focus:ring-red-500/20",
                            isPassword && "pr-11",
                            className,
                        )}
                        {...props}
                    />

                    {isPassword && (
                        <Button
                            type="button"
                            onClick={() => setShowPassword((p) => !p)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-cosmos-400 hover:text-cosmos-200 transition-colors"
                            tabIndex={-1}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword
                                ? <EyeOff size={16} />
                                : <Eye size={16} />
                            }
                        </Button>
                    )}
                </div>

                {error && (
                    <p className="text-xs text-red-400 flex items-center gap-1">
                        <span>⚠</span> {error}
                    </p>
                )}
            </div>
        );
    },
);

AuthField.displayName = "AuthField";