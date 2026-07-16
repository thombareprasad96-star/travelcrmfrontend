// src/features/accounting/lib/dateRange.js
// Small date-range presets for the accounting reports/dashboard (no shared picker exists).
function iso(d) {
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

/** Indian financial year (Apr 1 – Mar 31) containing `d`. */
function fyBounds(d) {
  const y = d.getMonth() >= 3 ? d.getFullYear() : d.getFullYear() - 1;
  return { from: iso(new Date(y, 3, 1)), to: iso(new Date(y + 1, 2, 31)) };
}

export const RANGE_PRESETS = [
  { value: "this-month", label: "This Month" },
  { value: "last-month", label: "Last Month" },
  { value: "this-fy", label: "This FY" },
  { value: "last-30", label: "Last 30 Days" },
];

export function resolveRange(preset) {
  const now = new Date();
  switch (preset) {
    case "last-month": {
      const from = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const to = new Date(now.getFullYear(), now.getMonth(), 0);
      return { from: iso(from), to: iso(to) };
    }
    case "this-fy":
      return fyBounds(now);
    case "last-30": {
      const from = new Date(now);
      from.setDate(from.getDate() - 29);
      return { from: iso(from), to: iso(now) };
    }
    case "this-month":
    default: {
      const from = new Date(now.getFullYear(), now.getMonth(), 1);
      return { from: iso(from), to: iso(now) };
    }
  }
}