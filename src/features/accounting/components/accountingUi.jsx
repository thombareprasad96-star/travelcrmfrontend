// src/features/accounting/components/accountingUi.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Shared UI kit for the Accounting / GST section. Matches the visual language of
// the Reports and Bookings modules (gradient page header + breadcrumb, gradient
// hero stat cards with count-up, glass panels, fadeUp/popIn animations, styled
// tables, gradient-header modals, filter pills, pager) — but with a finance-green
// signature (header icon + primary buttons = emerald/green) so the section reads
// as "money" while staying consistent with the rest of the app.
// ─────────────────────────────────────────────────────────────────────────────
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, X, Inbox, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from "lucide-react";
import { inr } from "../lib/format";

/* ── Global animation + font styles (injected once per page via <Page/>) ──────── */
const GLOBAL_STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
  @keyframes slideIn { from{transform:translateX(110%);opacity:0} to{transform:translateX(0);opacity:1} }
  @keyframes popIn   { from{transform:scale(.92);opacity:0} to{transform:scale(1);opacity:1} }
  @keyframes fadeUp  { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
  .acc-fade { animation:fadeUp .4s ease both; }
  .acc-scope select { -webkit-appearance:none; appearance:none; }
  .acc-scope ::-webkit-scrollbar{width:5px;height:5px}
  .acc-scope ::-webkit-scrollbar-track{background:#f1f5f9;border-radius:99px}
  .acc-scope ::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:99px}
`;

/* ── Page shell: gradient bg + header (icon box + title + breadcrumb + actions) ── */
export function Page({ icon: Icon, title, subtitle, crumb, actions, children }) {
  const navigate = useNavigate();
  return (
    <div className="acc-scope min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-100"
      style={{ fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif" }}>
      <style>{GLOBAL_STYLE}</style>

      <div className="bg-white/70 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white shadow-lg shadow-emerald-200 flex-shrink-0">
                {Icon && <Icon className="w-5 h-5" />}
              </div>
              <div>
                <h1 className="text-lg font-extrabold text-slate-800 tracking-tight">{title}</h1>
                <p className="text-xs text-slate-400 hidden sm:block">
                  <span className="hover:text-emerald-600 cursor-pointer transition-colors" onClick={() => navigate("/")}>Home</span>
                  <span className="mx-1 text-slate-300">/</span>
                  <span className="hover:text-emerald-600 cursor-pointer transition-colors" onClick={() => navigate("/accounting")}>Accounting</span>
                  {crumb && <><span className="mx-1 text-slate-300">/</span><span className="text-emerald-600 font-bold">{crumb}</span></>}
                  {subtitle && <span className="ml-2 text-slate-400 font-normal">· {subtitle}</span>}
                </p>
              </div>
            </div>
            {actions && <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">{actions}</div>}
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-5 space-y-5">{children}</div>
    </div>
  );
}

/* ── Hero stat card: gradient bg, decorative circles, count-up ─────────────────── */
export function Hero({ label, value, sub, gradient = "from-emerald-500 to-green-600", icon, delay = 0, money = false, isString = false }) {
  const [disp, setDisp] = useState(0);
  const raf = useRef(null);
  useEffect(() => {
    if (isString) return;
    cancelAnimationFrame(raf.current);
    const target = Number(value) || 0;
    if (!target) { setDisp(0); return; }
    const start = performance.now();
    const step = (ts) => {
      const p = Math.min((ts - start) / 900, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setDisp(ease * target);
      if (p < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [value, isString]);

  const shown = isString ? value : money ? inr(disp) : Math.round(disp).toLocaleString("en-IN");
  return (
    <div className={`bg-gradient-to-br ${gradient} rounded-2xl p-5 text-white shadow-lg relative overflow-hidden group hover:-translate-y-1 hover:shadow-xl transition-all duration-300 acc-fade`}
      style={{ animationDelay: `${delay}ms` }}>
      <div className="absolute -right-5 -top-5 w-24 h-24 rounded-full bg-white/10 group-hover:scale-110 transition-transform duration-500" />
      <div className="absolute -right-2 -bottom-7 w-20 h-20 rounded-full bg-white/10" />
      <div className="relative z-10 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[10px] font-extrabold uppercase tracking-widest opacity-80 mb-1">{label}</p>
          <p className="text-2xl sm:text-[26px] font-extrabold leading-none truncate">{shown}</p>
          {sub && <p className="text-[11px] opacity-70 mt-1">{sub}</p>}
        </div>
        {icon && <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">{icon}</div>}
      </div>
    </div>
  );
}

/* ── Glass panel ───────────────────────────────────────────────────────────────── */
export function Panel({ className = "", children, style }) {
  return (
    <div className={`bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/60 shadow-sm acc-fade ${className}`} style={style}>
      {children}
    </div>
  );
}

export function PanelHead({ icon: Icon, iconColor = "text-emerald-500", title, count, countColor = "bg-emerald-600", right }) {
  return (
    <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div className="flex items-center gap-2.5">
        {Icon && <Icon className={`w-4 h-4 ${iconColor}`} />}
        <h2 className="text-base font-extrabold text-slate-700">{title}</h2>
        {count != null && <span className={`text-xs font-extrabold ${countColor} text-white px-2.5 py-1 rounded-full`}>{count}</span>}
      </div>
      {right && <div className="flex items-center gap-2 flex-wrap">{right}</div>}
    </div>
  );
}

/* ── Badge ─────────────────────────────────────────────────────────────────────── */
const BADGE_TONES = {
  green: "bg-green-100 text-green-700", emerald: "bg-emerald-100 text-emerald-700",
  amber: "bg-amber-100 text-amber-700", red: "bg-red-100 text-red-700",
  blue: "bg-blue-100 text-blue-700", indigo: "bg-indigo-100 text-indigo-700",
  purple: "bg-purple-100 text-purple-700", teal: "bg-teal-100 text-teal-700",
  rose: "bg-rose-100 text-rose-700", slate: "bg-slate-100 text-slate-600",
};
export function Badge({ tone = "slate", children, className = "" }) {
  return <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${BADGE_TONES[tone] || BADGE_TONES.slate} ${className}`}>{children}</span>;
}

/* ── Button ────────────────────────────────────────────────────────────────────── */
const BTN_VARIANTS = {
  primary: "bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-md shadow-emerald-200",
  indigo: "bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 text-white shadow-md shadow-blue-200",
  outline: "border border-slate-200 hover:border-emerald-300 bg-white hover:bg-emerald-50 text-slate-600 hover:text-emerald-600 shadow-sm",
  danger: "bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white shadow-md shadow-red-200",
  ghost: "bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200",
};
export function Btn({ variant = "primary", size = "md", onClick, disabled, type = "button", className = "", children }) {
  const sz = size === "sm" ? "px-3.5 py-2 text-xs" : "px-5 py-2.5 text-sm";
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-bold transition-all disabled:opacity-50 disabled:pointer-events-none ${sz} ${BTN_VARIANTS[variant]} ${className}`}>
      {children}
    </button>
  );
}

export function IconBtn({ tone = "blue", title, onClick, children }) {
  const tones = {
    blue: "bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-600",
    emerald: "bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-600",
    amber: "bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-600",
    red: "bg-red-50 hover:bg-red-100 border-red-200 text-red-600",
    slate: "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-500",
  };
  return (
    <button type="button" title={title} onClick={onClick}
      className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all ${tones[tone] || tones.blue}`}>
      {children}
    </button>
  );
}

/* ── Filter pills ─────────────────────────────────────────────────────────────── */
export function Pills({ options, value, onChange, className = "" }) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {options.map((o) => {
        const active = value === o.value;
        return (
          <button key={o.value} type="button" onClick={() => onChange(o.value)}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${active
              ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-md shadow-emerald-200"
              : "bg-slate-100 text-slate-500 hover:bg-emerald-50 hover:text-emerald-600"}`}>
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/* ── Form primitives ──────────────────────────────────────────────────────────── */
export const inputCls = "w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 font-medium placeholder-slate-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 outline-none transition-all hover:border-slate-300 disabled:bg-slate-50 disabled:text-slate-400";
export const selectCls = inputCls + " pr-9 cursor-pointer";

export function Field({ label, required, hint, children, className = "" }) {
  return (
    <div className={className}>
      {label && <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wide mb-1.5">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>}
      {children}
      {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

export function Select({ value, onChange, children, disabled, className = "" }) {
  return (
    <div className="relative">
      <select value={value} onChange={onChange} disabled={disabled} className={selectCls + " " + className}>{children}</select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
    </div>
  );
}

export function Toggle({ label, hint, checked, disabled, onChange }) {
  return (
    <label className={`flex items-start gap-2.5 rounded-xl border px-3.5 py-2.5 transition-all ${disabled ? "opacity-60 border-slate-200" : "cursor-pointer border-slate-200 hover:border-emerald-300"} ${checked ? "bg-emerald-50/60 border-emerald-200" : "bg-white"}`}>
      <input type="checkbox" checked={!!checked} disabled={disabled} onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 accent-emerald-600" />
      <span className="min-w-0">
        <span className="block text-sm font-bold text-slate-700">{label}</span>
        {hint && <span className="block text-xs text-slate-400">{hint}</span>}
      </span>
    </label>
  );
}

/* ── Modal (gradient header + popIn) ──────────────────────────────────────────── */
export function Modal({ title, subtitle, icon: Icon, onClose, children, footer, maxW = "max-w-xl", gradient = "from-emerald-500 to-green-600" }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-white rounded-3xl shadow-2xl w-full ${maxW} max-h-[92vh] overflow-y-auto z-10`} style={{ animation: "popIn .25s ease both" }}>
        <div className={`bg-gradient-to-r ${gradient} px-6 py-5 rounded-t-3xl flex items-start justify-between sticky top-0 z-10`}>
          <div className="flex items-center gap-3 min-w-0">
            {Icon && <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white flex-shrink-0"><Icon className="w-5 h-5" /></div>}
            <div className="min-w-0">
              <h2 className="text-white text-lg font-extrabold tracking-tight truncate">{title}</h2>
              {subtitle && <p className="text-white/80 text-sm mt-0.5 truncate">{subtitle}</p>}
            </div>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all flex-shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6 space-y-5">{children}</div>
        {footer && <div className="px-6 pb-6 pt-1 flex flex-wrap items-center justify-end gap-2.5">{footer}</div>}
      </div>
    </div>
  );
}

/* ── Table helpers ────────────────────────────────────────────────────────────── */
export const theadCls = "bg-slate-50/80 border-b border-slate-100";
export function Th({ children, right }) {
  return <th className={`px-3 py-3.5 text-xs font-extrabold text-slate-600 uppercase tracking-wider whitespace-nowrap ${right ? "text-right" : "text-left"}`}>{children}</th>;
}

/* ── Empty + loading states ───────────────────────────────────────────────────── */
export function EmptyBlock({ icon: Icon = Inbox, title = "Nothing here yet", hint, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-3"><Icon className="w-6 h-6 text-slate-400" /></div>
      <p className="text-base font-extrabold text-slate-600 mb-1">{title}</p>
      {hint && <p className="text-sm text-slate-400 mb-4 max-w-sm">{hint}</p>}
      {action}
    </div>
  );
}

export function EmptyRow({ colSpan, icon = "🧾", title = "Nothing here yet", hint }) {
  return (
    <tr>
      <td colSpan={colSpan} className="text-center py-16">
        <div className="text-5xl mb-3">{icon}</div>
        <p className="text-base font-extrabold text-slate-600 mb-1">{title}</p>
        {hint && <p className="text-sm text-slate-400">{hint}</p>}
      </td>
    </tr>
  );
}

export function Loading({ label = "Loading…" }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-10 h-10 rounded-full border-[3px] border-emerald-100 border-t-emerald-500 animate-spin mb-3" />
      <p className="text-sm font-semibold text-slate-400">{label}</p>
    </div>
  );
}

export function SkeletonRows({ rows = 4, cols = 6 }) {
  return [...Array(rows)].map((_, i) => (
    <tr key={i}>
      {[...Array(cols)].map((_, j) => (
        <td key={j} className="px-3 py-4"><div className="h-4 rounded-lg bg-slate-200 animate-pulse" style={{ width: `${35 + ((i * 7 + j * 13) % 55)}%` }} /></td>
      ))}
    </tr>
  ));
}

/* ── Pager (reports style) ────────────────────────────────────────────────────── */
export function Pager({ page, totalPages, total, from, to, onPage }) {
  if (!total) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i)
    .filter((p) => p === 0 || p === totalPages - 1 || Math.abs(p - page) <= 1)
    .reduce((acc, p, i, arr) => { if (i > 0 && p - arr[i - 1] > 1) acc.push("…"); acc.push(p); return acc; }, []);
  return (
    <div className="px-5 py-4 border-t border-slate-100 bg-slate-50/60 flex flex-col sm:flex-row items-center justify-between gap-3">
      <p className="text-xs text-slate-400 font-medium">
        Showing <span className="font-bold text-slate-600">{from}</span> to <span className="font-bold text-slate-600">{to}</span> of <span className="font-bold text-slate-600">{total}</span> entries
      </p>
      <div className="flex items-center gap-1.5">
        <PBtn disabled={page === 0} onClick={() => onPage(0)}><ChevronsLeft className="w-3.5 h-3.5" /></PBtn>
        <PBtn disabled={page === 0} onClick={() => onPage(page - 1)}><ChevronLeft className="w-3.5 h-3.5" /></PBtn>
        {pages.map((p, i) => typeof p === "string"
          ? <span key={`e${i}`} className="px-1 text-xs text-slate-400">…</span>
          : <button key={p} onClick={() => onPage(p)}
              className={`w-8 h-8 rounded-lg text-xs font-bold border transition-all ${page === p ? "bg-gradient-to-r from-emerald-500 to-green-600 border-emerald-500 text-white shadow-sm" : "bg-white border-slate-200 text-slate-600 hover:border-emerald-300 hover:text-emerald-600"}`}>{p + 1}</button>)}
        <PBtn disabled={page >= totalPages - 1} onClick={() => onPage(page + 1)}><ChevronRight className="w-3.5 h-3.5" /></PBtn>
        <PBtn disabled={page >= totalPages - 1} onClick={() => onPage(totalPages - 1)}><ChevronsRight className="w-3.5 h-3.5" /></PBtn>
      </div>
    </div>
  );
}
function PBtn({ disabled, onClick, children }) {
  return (
    <button disabled={disabled} onClick={onClick}
      className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-500 hover:border-emerald-300 hover:text-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
      {children}
    </button>
  );
}

/* ── Key/value cell (for detail grids) ────────────────────────────────────────── */
export function KV({ label, value, children, strong, className = "" }) {
  return (
    <div className={`bg-slate-50 rounded-2xl p-3.5 border border-slate-100 ${className}`}>
      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide mb-1">{label}</p>
      {children ?? <p className={`text-sm ${strong ? "font-extrabold text-slate-800" : "font-bold text-slate-700"}`}>{value}</p>}
    </div>
  );
}