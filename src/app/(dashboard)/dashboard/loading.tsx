export default function DashboardPageLoading() {
    return (
        <div className="flex flex-col gap-6 animate-pulse">
            {/* KPI row */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-28 rounded-xl bg-[var(--bg-secondary)]" />
                ))}
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 h-80 rounded-xl bg-[var(--bg-secondary)]" />
                <div className="h-80 rounded-xl bg-[var(--bg-secondary)]" />
            </div>

            {/* Bottom row */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="h-72 rounded-xl bg-[var(--bg-secondary)]" />
                <div className="h-72 rounded-xl bg-[var(--bg-secondary)]" />
            </div>
        </div>
    );
}