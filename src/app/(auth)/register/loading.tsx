export default function RegisterLoading() {
    return (
        <div className="w-full max-w-md rounded-2xl p-8 glass border border-white/10 animate-pulse">
            <div className="flex flex-col items-center mb-8 gap-3">
                <div className="w-12 h-12 rounded-xl bg-cosmos-700" />
                <div className="w-32 h-3 rounded bg-cosmos-700" />
            </div>
            <div className="w-44 h-7 rounded bg-cosmos-700 mb-2" />
            <div className="w-56 h-4 rounded bg-cosmos-800 mb-6" />
            <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                    <div className="h-12 rounded-lg bg-cosmos-700" />
                    <div className="h-12 rounded-lg bg-cosmos-700" />
                </div>
                <div className="h-12 rounded-lg bg-cosmos-700" />
                <div className="h-12 rounded-lg bg-cosmos-700" />
                <div className="h-12 rounded-lg bg-cosmos-700" />
                <div className="h-11 rounded-lg bg-amber-400/20" />
            </div>
        </div>
    );
}