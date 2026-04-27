// src/app/(dashboard)/loading.tsx
export default function DashboardLoading() {
    return (
        <div className="flex flex-col gap-6 animate-pulse">
            {/* Page title skeleton */}
            <div className="h-7 w-48 rounded-lg bg-[var(--bg-secondary)]" />

            {/* Stats row */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-28 rounded-xl bg-[var(--bg-secondary)]" />
                ))}
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <div className="lg:col-span-2 h-72 rounded-xl bg-[var(--bg-secondary)]" />
                <div className="h-72 rounded-xl bg-[var(--bg-secondary)]" />
            </div>

            {/* Table skeleton */}
            <div className="h-64 rounded-xl bg-[var(--bg-secondary)]" />
        </div>
    );
}