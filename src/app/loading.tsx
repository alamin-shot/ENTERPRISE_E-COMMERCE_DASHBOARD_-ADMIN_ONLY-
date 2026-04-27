export default function RootLoading() {
    return (
        <div className="min-h-screen bg-[var(--bg-tertiary)] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-400/20 animate-pulse" />
                <div className="flex gap-1.5">
                    {[0, 1, 2].map((i) => (
                        <div
                            key={i}
                            className="w-2 h-2 rounded-full bg-amber-400/60 animate-bounce"
                            style={{ animationDelay: `${i * 150}ms` }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}