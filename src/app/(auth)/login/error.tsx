"use client";

import Link from "next/link";
import { AUTH_ROUTES } from "@/lib/constants/routes";
import { Button } from "@/components/ui";

interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function LoginError({ reset }: ErrorProps) {
    return (
        <div className="w-full max-w-md rounded-2xl p-8 glass border border-red-500/20 text-center animate-fade-in">
            <div className="text-3xl mb-4">⚠</div>
            <h2 className="text-lg font-semibold text-cosmos-50 mb-2">Something went wrong</h2>
            <p className="text-sm text-cosmos-400 mb-6">
                Failed to load the login page.
            </p>
            <div className="flex flex-col gap-2">
                <Button
                    onClick={reset}
                    className="w-full py-2.5 rounded-lg bg-amber-400 text-cosmos-950 text-sm font-semibold hover:bg-amber-300 transition-colors"
                >
                    Try again
                </Button>
                <Link
                    href={AUTH_ROUTES.LOGIN}
                    className="text-xs text-cosmos-400 hover:text-cosmos-200 transition-colors"
                >
                    Back to login
                </Link>
            </div>
        </div>
    );
}