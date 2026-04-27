"use client";

interface ErrorProps { reset: () => void }

export default function UsersError({ reset }: ErrorProps) {
    return (
        <div className="flex min-h-[60vh] items-center justify-center">
            <div className="max-w-sm w-full text-center card p-8">
                <div className="text-4xl mb-4">👥</div>
                <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Failed to load users</h2>
                <p className="text-sm text-[var(--text-secondary)] mb-6">Could not fetch user data.</p>
                <button onClick={reset} className="w-full py-2.5 rounded-lg bg-amber-400 text-cosmos-950 text-sm font-semibold hover:bg-amber-300 transition-colors">Retry</button>
            </div>
        </div>
    );
}