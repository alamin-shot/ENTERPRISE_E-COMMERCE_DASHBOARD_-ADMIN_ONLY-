"use client";

import { Button } from "@/components/ui";

interface ErrorProps { reset: () => void }

export default function OtpVerifyError({ reset }: ErrorProps) {
    return (
        <div className="w-full max-w-md rounded-2xl p-8 glass border border-red-500/20 text-center animate-fade-in">
            <div className="text-3xl mb-4">⚠</div>
            <h2 className="text-lg font-semibold text-cosmos-50 mb-2">Something went wrong</h2>
            <p className="text-sm text-cosmos-400 mb-6">
                Failed to load the OTP verification page.
            </p>
            <Button
                onClick={reset}
                className="w-full py-2.5 rounded-lg bg-amber-400 text-cosmos-950 text-sm font-semibold hover:bg-amber-300 transition-colors"
            >
                Try again
            </Button>
        </div>
    );
}