export default function ProductsLoading() {
    return (
        <div className="flex flex-col gap-6 animate-pulse">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-2">
                    <div className="h-6 w-32 rounded bg-[var(--bg-secondary)]" />
                    <div className="h-4 w-48 rounded bg-[var(--bg-secondary)]" />
                </div>
                <div className="h-10 w-32 rounded-lg bg-[var(--bg-secondary)]" />
            </div>
            <div className="flex gap-3">
                <div className="h-10 w-64 rounded-lg bg-[var(--bg-secondary)]" />
                <div className="h-10 w-40 rounded-lg bg-[var(--bg-secondary)]" />
                <div className="h-10 w-44 rounded-lg bg-[var(--bg-secondary)]" />
            </div>
            <div className="h-96 rounded-xl bg-[var(--bg-secondary)]" />
        </div>
    );
}