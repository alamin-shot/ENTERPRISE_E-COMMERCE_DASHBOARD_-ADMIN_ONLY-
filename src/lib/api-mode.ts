// ─── lib/api-mode.ts ────────────────────────────────────────────────────────────

export type ApiMode = "mock" | "real";
export const API_MODE: ApiMode = "mock";
export function isMockMode(): boolean { return API_MODE === "mock"; }