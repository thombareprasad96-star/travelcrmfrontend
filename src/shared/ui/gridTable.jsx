// src/shared/ui/gridTable.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Shared "directory grid" table, modelled EXACTLY on the Leads Directory
// (AllLeads.jsx): a CSS-grid header bar + rows with column separators, a soft
// gold (#eeda92) row hover, staggered fadeUp, and an avatar-led first column.
// No expandable rows. Used by Customers, Fleet (trips/drivers/vehicles), etc.
//
//   <GridStyles/>                         // once per page — provides the fadeUp keyframe
//   <GridHead cols={COLS}>…<Cell first>Name</Cell>…</GridHead>
//   <GridRow cols={COLS} index={i}> … <Cell/> … </GridRow>
//   <GridSkeleton cols={COLS} rows={5} />  <GridEmpty icon={Users} title="…" />
// `cols` is a CSS grid-template-columns string, e.g. "1.8fr 1fr 0.9fr 132px".
// ─────────────────────────────────────────────────────────────────────────────
import { Inbox } from "lucide-react";

/** Inject the fadeUp keyframe once (rows reference it by name). Safe to render more than once. */
export function GridStyles() {
  return (
    <style>{`@keyframes gtFadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }`}</style>
  );
}

// Literal show classes so Tailwind JIT keeps them. `bp` picks the breakpoint at which
// the grid appears (and below which the caller's mobile cards should show).
const SHOW = { md: "hidden md:grid", lg: "hidden lg:grid" };

export function GridHead({ cols, bp = "md", children, className = "" }) {
  return (
    <div
      className={`${SHOW[bp] || SHOW.md} items-stretch gap-0 px-5 py-3 bg-slate-50/80 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider border-b border-slate-100 ${className}`}
      style={{ gridTemplateColumns: cols }}>
      {children}
    </div>
  );
}

export function GridRow({ cols, bp = "md", index = 0, children, onClick, className = "" }) {
  return (
    <div
      onClick={onClick}
      className={`${SHOW[bp] || SHOW.md} items-stretch gap-0 px-5 py-3.5 border-b border-slate-50 transition-colors group ${onClick ? "cursor-pointer" : ""} ${className}`}
      style={{ gridTemplateColumns: cols, animation: "gtFadeUp .35s ease both", animationDelay: `${index * 30}ms` }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "#eeda9218"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}>
      {children}
    </div>
  );
}

/** Grid cell. `first` = left-aligned, no left separator; otherwise centered (or `right`/`left`) with a left separator. */
export function Cell({ children, first, right, left, className = "" }) {
  let base;
  if (first) base = "flex items-center pr-3 min-w-0";
  else {
    const align = right ? "justify-end" : left ? "justify-start" : "justify-center";
    base = `flex items-center ${align} border-l border-slate-200/70 pl-3 min-w-0`;
  }
  return <div className={`${base} ${className}`}>{children}</div>;
}

/** Circular gradient avatar. Pass `initials` for a multi-char label, else the first letter of `text`. */
export function Avatar({ text, initials, gradient = "from-blue-500 to-indigo-600", size = "w-10 h-10", rounded = "rounded-full", className = "" }) {
  const label = initials || String(text || "?").trim().charAt(0).toUpperCase() || "?";
  return (
    <div className={`${size} ${rounded} bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-xs font-extrabold shadow-sm flex-shrink-0 ${className}`}>
      {label}
    </div>
  );
}

/** Staggered skeleton rows for the grid list (md+). */
export function GridSkeleton({ cols, rows = 5 }) {
  const count = cols.split(" ").length;
  return [...Array(rows)].map((_, i) => (
    <div key={i} className="hidden md:grid items-center gap-0 px-5 py-3.5 border-b border-slate-50" style={{ gridTemplateColumns: cols }}>
      {[...Array(count)].map((_, j) => (
        <div key={j} className={j === 0 ? "" : "border-l border-slate-200/70 pl-3"}>
          <div className="h-4 rounded-lg bg-slate-200 animate-pulse" style={{ width: `${45 + ((i * 7 + j * 13) % 45)}%` }} />
        </div>
      ))}
    </div>
  ));
}

/** Centered empty state matching the Leads Directory empty block. */
export function GridEmpty({ icon: Icon = Inbox, title = "Nothing here yet", hint, action }) {
  return (
    <div className="text-center py-20 px-5">
      <div className="flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mb-4 shadow-sm -rotate-3">
          <Icon size={28} className="text-slate-400" />
        </div>
        <p className="text-lg font-extrabold text-slate-600 mb-1">{title}</p>
        {hint && <p className="text-sm text-slate-400 mb-4 max-w-sm mx-auto leading-relaxed">{hint}</p>}
        {action}
      </div>
    </div>
  );
}
