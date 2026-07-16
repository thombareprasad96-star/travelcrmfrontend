// src/features/accounting/lib/format.js
// Money/date helpers for the accounting module. Money always shows 2 decimals
// (paise) in the Indian grouping — a tax document must be exact.
export function inr(value) {
  if (value === null || value === undefined || value === "") return "₹0.00";
  const n = Number(value);
  if (Number.isNaN(n)) return "₹0.00";
  return "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/** Compact money for chart axes: ₹12k / ₹3.4L / ₹1.2Cr. */
export function inrShort(value) {
  const n = Number(value || 0);
  if (Math.abs(n) >= 1e7) return "₹" + (n / 1e7).toFixed(1) + "Cr";
  if (Math.abs(n) >= 1e5) return "₹" + (n / 1e5).toFixed(1) + "L";
  if (Math.abs(n) >= 1e3) return "₹" + Math.round(n / 1e3) + "k";
  return "₹" + Math.round(n);
}

export function pct(value) {
  const n = Number(value || 0);
  return n.toFixed(2) + "%";
}

/** ISO date/datetime → "15 Jul 2026" (en-IN). Empty → "—". */
export function fmtDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}