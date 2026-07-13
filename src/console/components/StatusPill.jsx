// Tenant status pill — opacity-tint styling, readable in light & dark. Class strings are literal
// so the Tailwind v4 scanner emits them.
const STYLES = {
  ACTIVE: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
  TRIAL: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20",
  // Dunning grace window — still operational, but overdue. Orange to read distinct from TRIAL amber.
  PAST_DUE: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20",
  SUSPENDED: "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20",
  EXPIRED: "bg-slate-500/10 text-slate-500 dark:text-slate-400 border border-slate-500/20",
  INACTIVE: "bg-slate-500/10 text-slate-500 dark:text-slate-400 border border-slate-500/20",
};

export default function StatusPill({ status }) {
  const cls = STYLES[status] || STYLES.INACTIVE;
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${cls}`}>
      {status}
    </span>
  );
}