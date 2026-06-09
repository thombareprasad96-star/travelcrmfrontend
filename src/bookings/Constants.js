
export const BOOKING_STATUSES = ["CONFIRMED", "PENDING", "CANCELLED", "COMPLETED", "REFUNDED"];
export const PAY_STATUSES     = ["PAID", "PARTIAL", "UNPAID", "REFUNDED"];

export const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// ─── Tailwind style maps (keyed to UPPERCASE backend values) ─────────────────
export const STATUS_STYLE = {
  CONFIRMED: "bg-green-100 text-green-700 border-green-200",
  PENDING:   "bg-amber-100 text-amber-700 border-amber-200",
  CANCELLED: "bg-red-100 text-red-600 border-red-200",
  COMPLETED: "bg-blue-100 text-blue-700 border-blue-200",
  REFUNDED:  "bg-purple-100 text-purple-700 border-purple-200",
};

export const PAY_STYLE = {
  PAID:     "bg-emerald-100 text-emerald-700",
  PARTIAL:  "bg-orange-100 text-orange-700",
  UNPAID:   "bg-rose-100 text-rose-700",
  REFUNDED: "bg-slate-100 text-slate-600",
};

export const STATUS_DOT = {
  CONFIRMED: "bg-green-500",
  PENDING:   "bg-amber-500",
  CANCELLED: "bg-red-500",
  COMPLETED: "bg-blue-500",
  REFUNDED:  "bg-purple-500",
};

// ─── Human-readable labels ────────────────────────────────────────────────────
export const STATUS_LABEL = {
  CONFIRMED: "Confirmed",
  PENDING:   "Pending",
  CANCELLED: "Cancelled",
  COMPLETED: "Completed",
  REFUNDED:  "Refunded",
};

export const PAY_LABEL = {
  PAID:     "Paid",
  PARTIAL:  "Partial",
  UNPAID:   "Unpaid",
  REFUNDED: "Refunded",
};

// ─── Dashboard stat card config ───────────────────────────────────────────────
// `key` maps to the stats object returned by useBookings
export const STAT_CARDS = [
  { key: "total",     label: "Total Bookings", icon: "✈️",  gradient: "from-cyan-500 to-cyan-400",    money: false },
  { key: "confirmed", label: "Confirmed",       icon: "✅",  gradient: "from-green-500 to-emerald-400", money: false },
  { key: "revenue",   label: "Total Revenue",   icon: "💰",  gradient: "from-amber-500 to-yellow-400",  money: true  },
  { key: "net",       label: "Net Revenue",     icon: "📊",  gradient: "from-blue-600 to-blue-400",     money: true  },
  { key: "refunds",   label: "Total Refunds",   icon: "↩️",  gradient: "from-rose-500 to-red-400",      money: true  },
  { key: "profit",    label: "Net Profit",      icon: "📈",  gradient: "from-slate-600 to-slate-500",   money: true  },
  
];