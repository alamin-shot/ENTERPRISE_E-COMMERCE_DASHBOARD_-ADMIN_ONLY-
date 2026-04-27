export default function UserDetailLoading() {
    return (
        <div className="flex flex-col gap-6 animate-pulse">
            <div className="h-4 w-24 rounded bg-[var(--bg-secondary)]" />
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="h-64 rounded-xl bg-[var(--bg-secondary)]" />
                <div className="lg:col-span-2 h-64 rounded-xl bg-[var(--bg-secondary)]" />
            </div>
        </div>
    );
}