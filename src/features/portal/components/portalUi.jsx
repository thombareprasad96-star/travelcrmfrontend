// src/features/portal/components/portalUi.jsx
// Small shared building blocks + formatters for the Traveler Portal pages.
import { Loader2 } from "lucide-react";

export const money = (n) =>
  n == null
    ? "—"
    : new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(Number(n));

export const fmtDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

const STATUS_STYLES = {
  CONFIRMED: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  COMPLETED: "bg-blue-50 text-blue-700 ring-blue-200",
  PENDING: "bg-amber-50 text-amber-700 ring-amber-200",
  CANCELLED: "bg-rose-50 text-rose-700 ring-rose-200",
  REFUNDED: "bg-slate-100 text-slate-600 ring-slate-200",
};
const PAY_STYLES = {
  PAID: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  PARTIAL: "bg-amber-50 text-amber-700 ring-amber-200",
  UNPAID: "bg-rose-50 text-rose-700 ring-rose-200",
  REFUNDED: "bg-slate-100 text-slate-600 ring-slate-200",
};

function Chip({ label, styles }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${styles}`}
    >
      {label}
    </span>
  );
}

export const StatusChip = ({ value }) => (
  <Chip label={value || "—"} styles={STATUS_STYLES[value] || STATUS_STYLES.REFUNDED} />
);

export const PayChip = ({ value }) => (
  <Chip label={value || "—"} styles={PAY_STYLES[value] || PAY_STYLES.REFUNDED} />
);

export const Spinner = ({ label = "Loading…" }) => (
  <div className="flex flex-col items-center justify-center py-20 text-slate-400">
    <Loader2 className="animate-spin mb-3" size={26} />
    <p className="text-sm">{label}</p>
  </div>
);

export const EmptyState = ({ icon: Icon, title, hint }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center px-6">
    {Icon && <Icon size={34} className="text-slate-300 mb-3" />}
    <p className="text-slate-600 font-semibold">{title}</p>
    {hint && <p className="text-slate-400 text-sm mt-1">{hint}</p>}
  </div>
);

const TINTS = {
  blue: "bg-blue-50 text-blue-600",
  indigo: "bg-indigo-50 text-indigo-600",
  amber: "bg-amber-50 text-amber-600",
  emerald: "bg-emerald-50 text-emerald-600",
};

export function StatTile({ label, value, icon: Icon, tint = "blue" }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 lg:p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-[12px] text-slate-400 font-semibold">{label}</p>
        {Icon && (
          <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${TINTS[tint]}`}>
            <Icon size={16} />
          </span>
        )}
      </div>
      <p className="text-[20px] lg:text-[24px] font-extrabold text-slate-800 mt-2 tracking-tight">{value}</p>
    </div>
  );
}