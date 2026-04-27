export default function OtpLoading() {
    return (
        <div className="w-full max-w-md rounded-2xl p-8 glass border border-white/10 animate-pulse">
            <div className="flex flex-col items-center mb-8 gap-3">
                <div className="w-12 h-12 rounded-xl bg-cosmos-700" />
                <div className="w-32 h-3 rounded bg-cosmos-700" />
            </div>
            <div className="w-36 h-7 rounded bg-cosmos-700 mb-2" />
            <div className="w-48 h-4 rounded bg-cosmos-800 mb-1" />
            <div className="w-40 h-4 rounded bg-amber-400/20 mb-6" />
            {/* OTP digit placeholders */}
            <div className="flex gap-2 justify-between mb-6">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="w-11 h-13 rounded-lg bg-cosmos-700" />
                ))}
            </div>
            <div className="h-11 rounded-lg bg-amber-400/20" />
        </div>
    );
}