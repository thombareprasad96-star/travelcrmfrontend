// src/features/subagents/pages/SubAgentRollup.jsx
// ─────────────────────────────────────────────────────────────
// Parent roll-up — every sub-agent's bookings + broker commission earned,
// with a per-agent commission-ledger drill-down. TENANT_ADMIN only.
// ─────────────────────────────────────────────────────────────
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, Users, CalendarDays, Wallet, HandCoins, TrendingUp,
  X, Loader2, ReceiptText, ArrowUpRight, ArrowDownRight,
} from "lucide-react";
import subAgentService from "../api/subAgentService";
import { toast } from "@shared/ui/toast";
import { getErrorMessage, isAlreadyReported } from "@shared/api/apiError";

const fmtINR = (n) => "₹" + Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 });
const rateText = (row) =>
  row?.commissionType === "FIXED" ? `${fmtINR(row.commissionRate)} / booking` : `${Number(row?.commissionRate || 0)}%`;
const fmtDate = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return isNaN(d) ? "—" : d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

/* ─── gradient stat card (matches the app) ────────────────── */
function StatCard({ gradient, icon: Icon, label, text }) {
  return (
    <div className={`bg-gradient-to-br ${gradient} rounded-2xl p-5 text-white shadow-lg relative overflow-hidden group hover:-translate-y-1 hover:shadow-xl transition-all duration-300`}>
      <div className="absolute -right-5 -top-5 w-24 h-24 rounded-full bg-white/10 group-hover:scale-110 transition-transform" />
      <div className="relative z-10">
        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-3"><Icon className="w-5 h-5" /></div>
        <p className="text-2xl font-extrabold leading-none mb-1 tabular-nums">{text}</p>
        <p className="text-xs font-bold uppercase tracking-widest opacity-80">{label}</p>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   Commission ledger drawer
   ═══════════════════════════════════════════════════════════ */
function LedgerDrawer({ agent, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    subAgentService.getCommissions(agent.publicId)
      .then((res) => { if (alive) setData(res.data?.data ?? res.data ?? { entries: [] }); })
      .catch((err) => { if (!isAlreadyReported(err)) toast.error(getErrorMessage(err, "Failed to load ledger.")); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [agent.publicId]);

  const entries = data?.entries || [];

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
           style={{ animation: "saSlideIn .25s ease both" }}>
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center"><ReceiptText size={17} /></div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-800">Commission ledger</h2>
              <p className="text-xs text-slate-400">{agent.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:bg-slate-100 hover:text-slate-600 p-2 rounded-full">
            <X size={18} />
          </button>
        </div>

        {/* total */}
        <div className="px-5 py-4 bg-gradient-to-br from-blue-50 to-white border-b border-slate-100">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total earned (net of reversals)</p>
          <p className="mt-1 text-3xl font-extrabold text-slate-800 tabular-nums">
            {loading ? "…" : fmtINR(data?.totalEarned)}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {loading ? (
            <div className="py-16 text-center text-slate-400"><Loader2 size={20} className="mx-auto animate-spin" /></div>
          ) : entries.length === 0 ? (
            <div className="py-16 text-center">
              <div className="text-4xl mb-2">🧾</div>
              <p className="text-sm font-bold text-slate-500">No commission yet</p>
              <p className="text-xs text-slate-400 mt-1">Commission accrues as customers pay for this agent's bookings.</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {entries.map((e, i) => {
                const credit = Number(e.amount || 0) >= 0;
                return (
                  <li key={i} className="rounded-xl border border-slate-200 p-3 hover:bg-slate-50/60 transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex h-6 w-6 items-center justify-center rounded-lg ${credit ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"}`}>
                            {credit ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                          </span>
                          <span className="font-mono text-xs font-bold text-slate-700 truncate">{e.bookingCode || "—"}</span>
                        </div>
                        {e.note && <p className="mt-1 text-xs text-slate-500 truncate">{e.note}</p>}
                        <p className="mt-0.5 text-[11px] text-slate-400">{fmtDate(e.occurredOn)}</p>
                      </div>
                      <span className={`shrink-0 font-mono text-sm font-extrabold tabular-nums ${credit ? "text-emerald-600" : "text-rose-600"}`}>
                        {credit ? "+" : "−"}{fmtINR(Math.abs(Number(e.amount || 0)))}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   Page
   ═══════════════════════════════════════════════════════════ */
export default function SubAgentRollup() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ledgerAgent, setLedgerAgent] = useState(null);

  useEffect(() => {
    setLoading(true);
    subAgentService.getRollup()
      .then((res) => {
        const raw = res.data?.data ?? res.data ?? [];
        setRows(Array.isArray(raw) ? raw : []);
      })
      .catch((err) => { if (!isAlreadyReported(err)) toast.error(getErrorMessage(err, "Failed to load roll-up.")); })
      .finally(() => setLoading(false));
  }, []);

  const totals = useMemo(() => rows.reduce((a, r) => ({
    bookings: a.bookings + Number(r.bookingsCount || 0),
    revenue: a.revenue + Number(r.totalRevenue || 0),
    collected: a.collected + Number(r.totalCollected || 0),
    commission: a.commission + Number(r.commissionEarned || 0),
  }), { bookings: 0, revenue: 0, collected: 0, commission: 0 }), [rows]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-100"
         style={{ fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif" }}>
      <style>{`
        @keyframes saFadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes saSlideIn { from{opacity:0;transform:translateX(24px)} to{opacity:1;transform:translateX(0)} }
      `}</style>

      {ledgerAgent && <LedgerDrawer agent={ledgerAgent} onClose={() => setLedgerAgent(null)} />}

      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
          <Link to="/subagents" className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50">
            <ArrowLeft size={17} />
          </Link>
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md shadow-blue-200">
            <TrendingUp size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-slate-800">Roll-up &amp; Commissions</h1>
            <p className="text-xs text-slate-400">What each Travel Partner sold and earned</p>
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* summary */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard gradient="from-blue-500 to-blue-600" icon={Users} label="Travel Partners" text={rows.length} />
          <StatCard gradient="from-indigo-500 to-indigo-600" icon={CalendarDays} label="Bookings" text={totals.bookings} />
          <StatCard gradient="from-sky-500 to-sky-600" icon={TrendingUp} label="Revenue" text={fmtINR(totals.revenue)} />
          <StatCard gradient="from-teal-500 to-teal-600" icon={Wallet} label="Collected" text={fmtINR(totals.collected)} />
          <StatCard gradient="from-amber-500 to-amber-600" icon={HandCoins} label="Commission" text={fmtINR(totals.commission)} />
        </div>

        {/* table */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="bg-slate-50/80 border-b border-slate-100">
                <tr>
                  {[
                    ["Travel Partner", "left"], ["Rate", "left"], ["Bookings", "right"], ["Revenue", "right"],
                    ["Collected", "right"], ["Commission earned", "right"], ["", "right"],
                  ].map(([h, align], i) => (
                    <th key={i} className={`px-4 py-3.5 text-${align} text-[10px] font-extrabold text-slate-500 uppercase tracking-wider whitespace-nowrap`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i}>{[...Array(7)].map((_, j) => (
                      <td key={j} className="px-4 py-4"><div className="h-4 rounded-lg bg-slate-200 animate-pulse" /></td>
                    ))}</tr>
                  ))
                ) : rows.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-16">
                    <div className="text-5xl mb-3">📊</div>
                    <p className="text-base font-extrabold text-slate-600 mb-1">No Travel Partner activity yet</p>
                    <p className="text-sm text-slate-400">Roll-up appears once your Travel Partners create bookings.</p>
                  </td></tr>
                ) : (
                  rows.map((r, idx) => (
                    <tr key={r.publicId} className="group hover:bg-blue-50/30 transition-colors"
                        style={{ animation: "saFadeUp .35s ease both", animationDelay: `${Math.min(idx, 12) * 25}ms` }}>
                      <td className="px-4 py-3.5">
                        <p className="text-sm font-bold text-slate-800">{r.name}</p>
                        <p className="text-xs text-slate-400">{r.email}</p>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded-lg">{rateText(r)}</span>
                      </td>
                      <td className="px-4 py-3.5 text-right text-sm font-semibold text-slate-700 tabular-nums">{Number(r.bookingsCount || 0)}</td>
                      <td className="px-4 py-3.5 text-right text-sm font-semibold text-slate-700 tabular-nums">{fmtINR(r.totalRevenue)}</td>
                      <td className="px-4 py-3.5 text-right text-sm font-semibold text-slate-700 tabular-nums">{fmtINR(r.totalCollected)}</td>
                      <td className="px-4 py-3.5 text-right text-sm font-extrabold text-emerald-600 tabular-nums">{fmtINR(r.commissionEarned)}</td>
                      <td className="px-4 py-3.5 text-right">
                        <button onClick={() => setLedgerAgent(r)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-700 transition-colors">
                          <ReceiptText size={13} /> Ledger
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              {!loading && rows.length > 0 && (
                <tfoot className="border-t-2 border-slate-100 bg-slate-50/50">
                  <tr>
                    <td className="px-4 py-3.5 text-sm font-extrabold text-slate-700" colSpan={2}>Total</td>
                    <td className="px-4 py-3.5 text-right text-sm font-extrabold text-slate-800 tabular-nums">{totals.bookings}</td>
                    <td className="px-4 py-3.5 text-right text-sm font-extrabold text-slate-800 tabular-nums">{fmtINR(totals.revenue)}</td>
                    <td className="px-4 py-3.5 text-right text-sm font-extrabold text-slate-800 tabular-nums">{fmtINR(totals.collected)}</td>
                    <td className="px-4 py-3.5 text-right text-sm font-extrabold text-emerald-700 tabular-nums">{fmtINR(totals.commission)}</td>
                    <td />
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}