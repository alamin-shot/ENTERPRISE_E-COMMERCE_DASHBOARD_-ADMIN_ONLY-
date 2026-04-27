"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AuthCard } from "./AuthCard";
import { AuthButton } from "./AuthButton";
import { useVerifyOtpMutation } from "@/store/api/authApi";
import { clearOtpFlow, setCredentials } from "@/store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { AUTH_ROUTES, DEFAULT_AUTH_REDIRECT } from "@/lib/constants/routes";
import { cn } from "@/lib/utils/cn";
import type { TokenPair } from "@/types/api.types";
import toast from "react-hot-toast";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 60;

export function OtpForm() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { otpEmail, otpPurpose } = useAppSelector((s) => s.auth);
    const [verifyOtp, { isLoading }] = useVerifyOtpMutation();

    const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
    const [resendTimer, setTimer] = useState(RESEND_SECONDS);
    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

    // Resend countdown
    useEffect(() => {
        if (resendTimer <= 0) return;
        const id = setTimeout(() => setTimer((t) => t - 1), 1000);
        return () => clearTimeout(id);
    }, [resendTimer]);

    // Redirect if no OTP flow active
    useEffect(() => {
        if (!otpEmail) router.replace(AUTH_ROUTES.LOGIN);
    }, [otpEmail, router]);

    const focusNext = useCallback((index: number) => {
        inputRefs.current[index + 1]?.focus();
    }, []);

    const focusPrev = useCallback((index: number) => {
        inputRefs.current[index - 1]?.focus();
    }, []);

    const handleChange = (index: number, value: string) => {
        const digit = value.replace(/\D/g, "").slice(-1);
        const next = [...digits];
        next[index] = digit;
        setDigits(next);
        if (digit) focusNext(index);
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !digits[index]) focusPrev(index);
        if (e.key === "ArrowLeft") focusPrev(index);
        if (e.key === "ArrowRight") focusNext(index);
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
        const next = [...digits];
        pasted.split("").forEach((d, i) => { next[i] = d; });
        setDigits(next);
        inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const otp = digits.join("");
        if (otp.length < OTP_LENGTH) {
            toast.error("Please enter all 6 digits");
            return;
        }
        if (!otpEmail || !otpPurpose) return;

        try {
            const res = await verifyOtp({ email: otpEmail, otp, purpose: otpPurpose }).unwrap();

            if (otpPurpose === "email-verification" && res.data.verified) {
                // Mock: auto-login after email verification
                const tokens: TokenPair = { accessToken: "mock-access-token", refreshToken: "mock-refresh-token" };
                dispatch(setCredentials({
                    user: { id: "mock-001", email: otpEmail, firstName: "Admin", lastName: "User", role: "admin", avatar: null, isEmailVerified: true, createdAt: new Date().toISOString() },
                    tokens,
                }));
                dispatch(clearOtpFlow());
                router.replace(DEFAULT_AUTH_REDIRECT);
            } else if (otpPurpose === "password-reset") {
                router.push(AUTH_ROUTES.RESET_PASSWORD);
            }
        } catch {
            setDigits(Array(OTP_LENGTH).fill(""));
            inputRefs.current[0]?.focus();
        }
    };

    const handleResend = () => {
        if (resendTimer > 0) return;
        setTimer(RESEND_SECONDS);
        toast.success("OTP resent to your email!");
    };

    if (!otpEmail) return null;

    return (
        <AuthCard>
            <h1 className="text-2xl font-bold text-cosmos-50 mb-1">Verify OTP</h1>
            <p className="text-sm text-cosmos-300 mb-2">
                Enter the 6-digit code sent to
            </p>
            <p className="text-sm text-amber-400 font-medium mb-6 truncate">{otpEmail}</p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                {/* OTP inputs */}
                <div className="flex gap-2 justify-between" onPaste={handlePaste}>
                    {digits.map((digit, i) => (
                        <input
                            key={i}
                            ref={(el) => { inputRefs.current[i] = el; }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleChange(i, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(i, e)}
                            className={cn(
                                "w-11 h-13 text-center text-lg font-bold rounded-lg",
                                "bg-cosmos-800/60 border text-cosmos-50",
                                "focus:outline-none focus:ring-2 focus:ring-amber-400/50",
                                "transition-all duration-150",
                                digit
                                    ? "border-amber-400/60 text-amber-400"
                                    : "border-white/10",
                            )}
                            aria-label={`OTP digit ${i + 1}`}
                        />
                    ))}
                </div>

                {/* Mock hint */}
                {process.env.NEXT_PUBLIC_USE_MOCK === "true" && (
                    <p className="text-xs text-center text-amber-400/60">Mock OTP: 123456</p>
                )}

                <AuthButton type="submit" isLoading={isLoading}>
                    Verify OTP
                </AuthButton>
            </form>

            {/* Resend */}
            <div className="mt-4 text-center">
                <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendTimer > 0}
                    className="text-xs text-cosmos-400 disabled:cursor-not-allowed"
                >
                    {resendTimer > 0
                        ? <span>Resend OTP in <span className="text-amber-400">{resendTimer}s</span></span>
                        : <span className="text-amber-400 hover:text-amber-300 transition-colors">Resend OTP</span>
                    }
                </button>
            </div>
        </AuthCard>
    );
}