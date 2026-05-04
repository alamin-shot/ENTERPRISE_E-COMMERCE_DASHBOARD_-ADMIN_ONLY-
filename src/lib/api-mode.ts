// ─── lib/api-mode.ts ────────────────────────────────────────────────────────────

export type ApiMode = "mock" | "real";

export const API_MODE: ApiMode =
    process.env.NEXT_PUBLIC_USE_MOCK === "true" ? "mock" : "real";

export function isMockMode(): boolean {
    return API_MODE === "mock";
}