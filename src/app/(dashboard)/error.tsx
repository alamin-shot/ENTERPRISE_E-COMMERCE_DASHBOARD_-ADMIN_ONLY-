"use client";

interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function DashboardError({ error, reset }: ErrorProps) {
    return (
        <div className="flex min-h-[60vh] items-center justify-center">
            <div className="max-w-md w-full text-center card p-8">
                <div className="text-4xl mb-4">⚠</div>
                <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                    Something went wrong
                </h2>
                <p className="text-sm text-[var(--text-secondary)] mb-6">
                    {error.message ?? "An unexpected error occurred in the dashboard."}
                </p>
                <button
                    onClick={reset}
                    className="w-full py-2.5 rounded-lg bg-amber-400 text-cosmos-950 text-sm font-semibold hover:bg-amber-300 transition-colors"
                >
                    Try again
                </button>
            </div>
        </div>
    );
}