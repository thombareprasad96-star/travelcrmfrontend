// Dynamic default date range for report filters.
// Reports filter by `createdAt`/`bookingDate` etc., so a hardcoded range quickly goes stale and
// hides all recent rows. These helpers keep the default window relative to "today" (local date).

const iso = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export const todayISO   = () => iso(new Date());
export const daysAgoISO = (n) => iso(new Date(Date.now() - n * 86400000));
export const daysFromNowISO = (n) => iso(new Date(Date.now() + n * 86400000));

// last 30 days → today (used by Activity, Geographic, Revenue, Intl/Domestic)
export const DEFAULT_START = daysAgoISO(30);
export const DEFAULT_END   = todayISO();