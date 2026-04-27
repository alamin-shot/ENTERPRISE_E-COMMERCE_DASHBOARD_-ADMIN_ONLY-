export default function OrderDetailLoading() {
    return (
        <div className="flex flex-col gap-6 animate-pulse">
            <div className="h-4 w-28 rounded bg-[var(--bg-secondary)]" />
            <div className="flex justify-between">
                <div className="flex flex-col gap-2">
                    <div className="h-6 w-40 rounded bg-[var(--bg-secondary)]" />
                    <div className="h-4 w-24 rounded bg-[var(--bg-secondary)]" />
                </div>
                <div className="h-6 w-24 rounded-full bg-[var(--bg-secondary)]" />
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 h-80 rounded-xl bg-[var(--bg-secondary)]" />
                <div className="flex flex-col gap-4">
                    <div className="h-24 rounded-xl bg-[var(--bg-secondary)]" />
                    <div className="h-24 rounded-xl bg-[var(--bg-secondary)]" />
                    <div className="h-32 rounded-xl bg-[var(--bg-secondary)]" />
                </div>
            </div>
        </div>
    );
}