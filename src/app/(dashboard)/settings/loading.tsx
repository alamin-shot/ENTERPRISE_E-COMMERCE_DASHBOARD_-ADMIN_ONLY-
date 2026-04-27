export default function SettingsLoading() {
    return (
        <div className="flex flex-col gap-6 max-w-3xl animate-pulse">
            <div className="flex flex-col gap-2">
                <div className="h-6 w-28 rounded bg-[var(--bg-secondary)]" />
                <div className="h-4 w-56 rounded bg-[var(--bg-secondary)]" />
            </div>

            {/* Tabs skeleton */}
            <div className="flex gap-1 border-b border-[var(--border-subtle)] pb-0">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-10 w-28 rounded-t-lg bg-[var(--bg-secondary)]" />
                ))}
            </div>

            {/* Content skeleton */}
            <div className="rounded-xl bg-[var(--bg-secondary)] h-80" />
        </div>
    );
}