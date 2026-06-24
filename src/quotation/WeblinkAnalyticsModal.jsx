import { useEffect, useState } from "react";
import { X, Eye, Users, Globe, Home, Loader2 } from "lucide-react";
import { quotationService } from "../services/quotationService";

const fmt = (d) => {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleString("en-US", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit", hour12: true,
    });
  } catch { return d; }
};

/**
 * "Weblink View Analytics" — 4 summary cards + a per-IP table (HOME vs EXTERNAL),
 * for a single quotation. Opened from a quotation row in QuotationsModal.
 */
export default function WeblinkAnalyticsModal({ quotation, onClose }) {
  const publicId = quotation.publicId;
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true); setError(null);
        const res = await quotationService.getWeblinkAnalytics(publicId);
        const body = res.data?.data || res.data;
        if (active) setData(body);
      } catch (e) {
        console.error("Failed to load weblink analytics:", e);
        if (active) setError("Could not load analytics. Please try again.");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [publicId]);

  const s = data?.summary || {};
  const rows = data?.rows || [];

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4"
         onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[88vh] flex flex-col z-10">

        <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-4 rounded-t-2xl flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-white flex-shrink-0"><Eye size={18} /></div>
            <div className="min-w-0">
              <h2 className="text-white font-extrabold text-base truncate">Weblink View Analytics</h2>
              <p className="text-slate-300 text-xs truncate">
                {quotation.title || "Quotation"}{quotation.version ? ` · ${quotation.version}` : ""}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center flex-shrink-0"><X size={16} /></button>
        </div>

        <div className="p-5 overflow-y-auto">
          {loading ? (
            <div className="py-12 flex items-center justify-center text-slate-400 text-sm">
              <Loader2 className="animate-spin mr-2" size={16} /> Loading analytics…
            </div>
          ) : error ? (
            <div className="py-12 text-center text-red-500 text-sm">{error}</div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                <Card label="Total Views"    value={s.totalViews}    grad="from-blue-500 to-indigo-600"    icon={Eye} />
                <Card label="External Views" value={s.externalViews} grad="from-emerald-500 to-emerald-700" icon={Globe} />
                <Card label="Home IP Views"  value={s.homeIpViews}   grad="from-amber-500 to-orange-600"    icon={Home} />
                <Card label="Unique IPs"     value={s.uniqueIps}     grad="from-violet-500 to-purple-700"   icon={Users} />
              </div>

              {rows.length === 0 ? (
                <div className="py-10 text-center text-slate-400 text-sm">No views yet.</div>
              ) : (
                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-slate-500">
                      <tr className="text-left">
                        <th className="px-3 py-2 font-bold">IP Address</th>
                        <th className="px-3 py-2 font-bold">Type</th>
                        <th className="px-3 py-2 font-bold">Views</th>
                        <th className="px-3 py-2 font-bold">First Viewed</th>
                        <th className="px-3 py-2 font-bold">Last Viewed</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((r, i) => (
                        <tr key={i} className="border-t border-slate-100">
                          <td className="px-3 py-2 font-mono text-slate-700">{r.ipAddress}</td>
                          <td className="px-3 py-2">
                            {r.type === "HOME" ? (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">HOME IP</span>
                            ) : (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">EXTERNAL</span>
                            )}
                          </td>
                          <td className="px-3 py-2">
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">{r.views}</span>
                          </td>
                          <td className="px-3 py-2 text-slate-500 whitespace-nowrap">{fmt(r.firstViewedAt)}</td>
                          <td className="px-3 py-2 text-slate-500 whitespace-nowrap">{fmt(r.lastViewedAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <p className="text-xs text-slate-400 mt-4 leading-relaxed">
                <span className="font-bold text-amber-600">HOME IP</span> = views from your company team members.{" "}
                <span className="font-bold text-emerald-600">EXTERNAL</span> = views from actual clients.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Card({ label, value, grad, icon: Icon }) {
  return (
    <div className={`bg-gradient-to-br ${grad} rounded-2xl p-4 text-white shadow-md relative overflow-hidden`}>
      <Icon size={40} className="absolute -right-1 -bottom-1 opacity-20" />
      <p className="relative text-2xl font-extrabold leading-none">{Number(value || 0).toLocaleString("en-IN")}</p>
      <p className="relative text-[11px] font-bold uppercase tracking-wide opacity-90 mt-1">{label}</p>
    </div>
  );
}