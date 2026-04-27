// ─── Brand Colors ─────────────────────────────────────────────────────────────
export const BRAND = {
  primary: "#F5A623",
  hover: "#f7b84a",
  active: "#d47e00",
  muted: "rgba(245, 166, 35, 0.12)",
} as const;

// ─── Cosmos Palette ───────────────────────────────────────────────────────────
export const COSMOS = {
  950: "#0B0C10",
  900: "#0f1117",
  800: "#141720",
  700: "#1F2833",
  600: "#2a3545",
  500: "#354257",
} as const;

// ─── Chart Color Sequence ─────────────────────────────────────────────────────
export const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
] as const;

// ─── Status Colors ────────────────────────────────────────────────────────────
export const STATUS_COLORS = {
  success: "#22c55e",
  warning: "#f59e0b",
  danger: "#ef4444",
  info: "#3b82f6",
  neutral: "#9aa3b4",
} as const;

// ─── Layout Dimensions ────────────────────────────────────────────────────────
export const LAYOUT = {
  sidebarWidth: "16rem", // 256px
  sidebarCollapsed: "4rem", // 64px
  headerHeight: "3.5rem", // 56px
  mobileBreakpoint: 768,
} as const;

// ─── Animation Durations ──────────────────────────────────────────────────────
export const DURATION = {
  fast: 150,
  normal: 250,
  slow: 400,
} as const;
