// ─── Currency ─────────────────────────────────────────────────────────────────
export const formatCurrency = (
  amount: number,
  currency = "USD",
  locale = "en-US",
): string =>
  new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

// ─── Number ───────────────────────────────────────────────────────────────────
export const formatNumber = (value: number, locale = "en-US"): string =>
  new Intl.NumberFormat(locale).format(value);

export const formatCompact = (value: number, locale = "en-US"): string =>
  new Intl.NumberFormat(locale, {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);

// ─── Percentage ───────────────────────────────────────────────────────────────
export const formatPercent = (value: number, decimals = 1): string =>
  `${value >= 0 ? "+" : ""}${value.toFixed(decimals)}%`;

// ─── Date ─────────────────────────────────────────────────────────────────────
export const formatDate = (date: string | Date, locale = "en-US"): string =>
  new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));

export const formatDateTime = (date: string | Date, locale = "en-US"): string =>
  new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));

export const formatRelativeTime = (date: string | Date): string => {
  const diff = Date.now() - new Date(date).getTime();
  const seconds = Math.floor(diff / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return formatDate(date);
};

// ─── String ───────────────────────────────────────────────────────────────────
export const capitalize = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

export const truncate = (str: string, maxLength: number): string =>
  str.length > maxLength ? `${str.slice(0, maxLength)}...` : str;

export const formatFullName = (firstName: string, lastName: string): string =>
  `${firstName} ${lastName}`.trim();

export const getInitials = (firstName: string, lastName: string): string =>
  `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
