"use client";

import { Button } from "@/components/ui/Button/index";

interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function RootError({ error, reset }: ErrorProps) {
    return (
        <div className="min-h-screen bg-cosmos-950 flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center glass rounded-2xl p-8 border border-red-500/20">
                <div className="text-4xl mb-4">⚠</div>
                <h1 className="text-xl font-bold text-cosmos-50 mb-2">
                    Application Error
                </h1>
                <p className="text-sm text-cosmos-400 mb-1">
                    {error.message ?? "An unexpected error occurred."}
                </p>
                {error.digest && (
                    <p className="text-xs text-cosmos-600 mb-6">
                        Error ID: {error.digest}
                    </p>
                )}
                <Button
                    onClick={reset}
                    className="w-full py-2.5 rounded-lg bg-amber-400 text-cosmos-950 text-sm font-semibold hover:bg-amber-300 transition-colors"
                >
                    Try again
                </Button>
            </div>
        </div>
    );
}