import Link from "next/link";
import { DEFAULT_AUTH_REDIRECT } from "@/lib/constants/routes";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-cosmos-950 flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center glass rounded-2xl p-10 border border-white/10 animate-fade-in">
                <h1 className="text-7xl font-black gradient-text mb-4">404</h1>
                <h2 className="text-xl font-semibold text-cosmos-50 mb-2">
                    Page not found
                </h2>
                <p className="text-sm text-cosmos-400 mb-8">
                    The page you&apos;re looking for doesn&apos;t exist or has been moved.
                </p>
                <Link
                    href={DEFAULT_AUTH_REDIRECT}
                    className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-amber-400 text-cosmos-950 text-sm font-semibold hover:bg-amber-300 transition-colors glow-amber"
                >
                    Go to Dashboard
                </Link>
            </div>
        </div>
    );
}