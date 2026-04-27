// ─── store/api/helpers.ts ───────────────────────────────────────────────────────

import { isMockMode } from "@/lib/api-mode";

export { isMockMode };

export function delay(ms: number): Promise<void> {
    return new Promise((r) => setTimeout(r, ms));
}

export function warnMock(): void {
    console.warn("[MOCK] Using mock data — backend unavailable");
}

export async function mockDelay(): Promise<void> {
    await delay(400);
}

export function mockPaginated<T>(items: T[], page: number, limit: number) {
    const start = (page - 1) * limit;
    const paged = items.slice(start, start + limit);
    return {
        page,
        limit,
        total: items.length,
        totalPages: Math.ceil(items.length / limit),
        hasNext: start + limit < items.length,
        hasPrev: page > 1,
        data: paged,
    };
}