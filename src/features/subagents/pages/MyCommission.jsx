// src/features/subagents/pages/MyCommission.jsx
// ─────────────────────────────────────────────────────────────
// A B2B sub-agent's OWN commission — their broker rate, total earned (net of reversals), and each
// accrual/reversal row. Backed by GET /api/me/commissions (self-scoped; a non-sub-agent gets 404).
// ─────────────────────────────────────────────────────────────
import { useEffect, useState } from "react";
import { HandCoins, Percent, IndianRupee, ArrowUpRight, ArrowDownRight, Loader2, Info } from "lucide-react";
import meService from "../api/meService";
import { toast } from "@shared/ui/toast";
import { getErrorMessage, isAlreadyReported } from "@shared/api/apiError";

const fmtINR = (n) => "₹" + Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 });
const rateText = (d) =>
  d?.commissionType === "FIXED" ? `${fmtINR(d.commissionRate)} / booking` : `${Number(d?.commissionRate || 0)}% of sale`;
const fmtDate = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return isNaN(d) ? "—" : d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

/* ─── gradient hero card (matches the app's stat cards) ───── */
function HeroCard({ gradient, icon: Icon, label, value, sub }) {
  return (
    <div className={`bg-gradient-to-br ${gradient} rounded-2xl p-6 text-white shadow-lg relative overflow-hidden`}>
      <div className="absolute -right-5 -top-5 w-28 h-28 rounded-full bg-white/10" />
      <div className="absolute -right-3 -bottom-10 w-36 h-36 rounded-full bg-white/10" />
      <div className="relative z-10">
        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-3"><Icon className="w-5 h-5" /></div>
        <p className="text-3xl font-extrabold leading-none mb-1 tabular-nums">{value}</p>
        <p className="text-xs font-bold uppercase tracking-widest opacity-80">{label}</p>
        {sub && <p className="mt-2 text-xs opacity-70">{sub}</p>}
      </div>
    </div>
  );
}

export default function MyCommission() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notAgent, setNotAgent] = useState(false);

  useEffect(() => {
    setLoading(true);
    meService.getMyCommission()
      .then((res) => setData(res.data?.data ?? res.data ?? { entries: [] }))
      .catch((err) => {
        if (err?.response?.status === 404) setNotAgent(true);
        else if (!isAlreadyReported(err)) toast.error(getErrorMessage(err, "Failed to load your commission."));
      })
      .finally(() => setLoading(false));
  }, []);

  const entries = data?.entries || [];
  const isPercent = data?.commissionType !== "FIXED";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-100"
         style={{ fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif" }}>
      <div className="bg-white/70 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md shadow-blue-200">
            <HandCoins size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-slate-800">My Commission</h1>
            <p className="text-xs text-slate-400">What you've earned as a broker</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {loading ? (
          <div className="py-20 text-center text-slate-400"><Loader2 size={22} className="mx-auto animate-spin" /></div>
        ) : notAgent ? (
          <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/60 shadow-sm p-10 text-center">
            <div className="text-4xl mb-3">🤝</div>
            <p className="text-base font-extrabold text-slate-600 mb-1">No commission profile</p>
            <p className="text-sm text-slate-400">This view is for franchise sub-agents.</p>
          </div>
        ) : (
          <>
            {/* hero cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <HeroCard gradient="from-emerald-500 to-emerald-600" icon={HandCoins}
                label="Total earned" value={fmtINR(data?.totalEarned)} sub="Accrues as customers pay · net of refunds" />
              <HeroCard gradient="from-blue-500 to-blue-600" icon={isPercent ? Percent : IndianRupee}
                label="Your rate" value={rateText(data)} />
            </div>

            {/* ledger */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
                <h2 className="text-sm font-extrabold text-slate-800">Commission ledger</h2>
                <span className="text-xs text-slate-400">({entries.length})</span>
              </div>
              {entries.length === 0 ? (
                <div className="py-16 text-center">
                  <div className="text-4xl mb-2">🧾</div>
                  <p className="text-sm font-bold text-slate-500">No commission yet</p>
                  <p className="text-xs text-slate-400 mt-1 flex items-center justify-center gap-1">
                    <Info size={12} /> Commission appears as your customers pay for their bookings.
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-slate-50">
                  {entries.map((e, i) => {
                    const credit = Number(e.amount || 0) >= 0;
                    return (
                      <li key={i} className="px-5 py-3.5 flex items-start justify-between gap-3 hover:bg-blue-50/40 transition-colors">
                        <div className="flex items-start gap-3 min-w-0">
                          <span className={`mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-lg shrink-0 ${credit ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"}`}>
                            {credit ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                          </span>
                          <div className="min-w-0">
                            <p className="font-mono text-sm font-bold text-slate-700 truncate">{e.bookingCode || "—"}</p>
                            {e.note && <p className="text-xs text-slate-500 truncate">{e.note}</p>}
                            <p className="text-[11px] text-slate-400">{fmtDate(e.occurredOn)}</p>
                          </div>
                        </div>
                        <span className={`shrink-0 font-mono text-sm font-extrabold tabular-nums ${credit ? "text-emerald-600" : "text-rose-600"}`}>
                          {credit ? "+" : "−"}{fmtINR(Math.abs(Number(e.amount || 0)))}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}