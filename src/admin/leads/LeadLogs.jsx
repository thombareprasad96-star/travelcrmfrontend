import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  FiPlus, FiArrowLeft, FiList, FiCalendar,
  FiMessageSquare, FiChevronLeft, FiChevronRight,
} from "react-icons/fi";
import {
  FaClipboardList, FaAngleDoubleLeft, FaAngleDoubleRight,
} from "react-icons/fa";

import { leadService } from "../../services/leadService";

/* Format backend timestamps to the strings this page already renders. */
const fmtLogDateTime = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d)) return "—";
  return `${d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })} ${d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })}`;
};
const fmtLogDate = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d)) return "—";
  return d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
};

const STAGES = [
  "New Lead", "Contacted", "Follow Up", "Qualified",
  "Proposal Sent", "Ready to Book", "Converted", "Lost",
];

const STAGE_CFG = {
  "New Lead":       { bg:"bg-blue-500",    text:"text-white" },
  "Contacted":      { bg:"bg-cyan-500",    text:"text-white" },
  "Follow Up":      { bg:"bg-amber-500",   text:"text-white" },
  "Qualified":      { bg:"bg-indigo-500",  text:"text-white" },
  "Proposal Sent":  { bg:"bg-purple-500",  text:"text-white" },
  "Ready to Book":  { bg:"bg-teal-500",    text:"text-white" },
  "Converted":      { bg:"bg-green-600",   text:"text-white" },
  "Lost":           { bg:"bg-red-500",     text:"text-white" },
};

const STAGE_DEF = { bg:"bg-slate-400", text:"text-white" };

/* ─── TOAST ──────────────────────────────────────────────────── */
function Toast({ msg, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3800);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div className={`fixed top-5 right-5 z-[999] flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl max-w-sm
      ${type === "success"
        ? "bg-green-50 border-green-200 text-green-800"
        : "bg-red-50 border-red-200 text-red-800"}`}
      style={{ animation: "slideIn .3s ease both" }}>
      <span className="text-lg">{type === "success" ? "✅" : "❌"}</span>
      <p className="text-sm font-semibold flex-1">{msg}</p>
      <button onClick={onClose} className="opacity-50 hover:opacity-100 text-lg ml-1">×</button>
    </div>
  );
}

/* ─── SKELETON ROW ───────────────────────────────────────────── */
function SkeletonRow() {
  return (
    <tr>
      {[...Array(5)].map((_, i) => (
        <td key={i} className="px-5 py-4">
          <div className="h-4 rounded-lg bg-slate-200 animate-pulse"
            style={{ width: `${40 + Math.random() * 50}%` }}/>
        </td>
      ))}
    </tr>
  );
}

/* ─── MAIN PAGE ──────────────────────────────────────────────── */
export default function LeadLogs() {
  const navigate       = useNavigate();
  const { id }         = useParams();           // /LeadLogs/:id
  const [searchParams] = useSearchParams();
  const leadName       = searchParams.get("name") || "Lead";

  const [logs,       setLogs]       = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [toast,      setToast]      = useState(null);
  const [page,       setPage]       = useState(1);
  const perPage = 10;

  const showToast = useCallback((msg, type = "success") => setToast({ msg, type }), []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    leadService.getLeadLogs(id)
      .then((res) => {
        const raw = Array.isArray(res.data?.data) ? res.data.data
          : Array.isArray(res.data) ? res.data : [];
        const mapped = raw.map((l) => ({
          id:           l.id,
          date:         fmtLogDateTime(l.createdAt),
          stage:        l.stage || "—",
          comment:      l.comment || "",
          followUpDate: fmtLogDate(l.followUpDate),
          addedBy:      l.addedBy || "System",
        }));
        if (active) setLogs(mapped);
      })
      .catch((err) => {
        console.error("Failed to load lead logs:", err);
        if (active) { setLogs([]); showToast("Failed to load logs. Please try again.", "error"); }
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id, showToast]);

  const totalPages = Math.max(1, Math.ceil(logs.length / perPage));
  const pageData   = logs.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100"
      style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        @keyframes slideIn { from{transform:translateX(110%);opacity:0} to{transform:translateX(0);opacity:1} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes popIn   { from{transform:scale(.92);opacity:0} to{transform:scale(1);opacity:1} }
        .fade-up { animation: fadeUp .4s ease both; }
        select { -webkit-appearance:none; appearance:none; }
        ::-webkit-scrollbar{width:5px;height:5px}
        ::-webkit-scrollbar-track{background:#f1f5f9;border-radius:99px}
        ::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:99px}
      `}</style>

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)}/>}

      {/* ── PAGE HEADER ── */}
      <div className="bg-white/70 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white shadow-lg shadow-blue-200 flex-shrink-0">
                <FaClipboardList className="w-5 h-5"/>
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">Lead Logs</h1>
                <p className="text-sm text-slate-400 mt-0.5">
                  Track all activity and follow-up notes for this lead
                  <span className="hidden sm:inline ml-3 text-slate-300">|</span>
                  <span className="hidden sm:inline ml-3 text-xs">
                    <span className="hover:text-blue-600 cursor-pointer transition-colors" onClick={() => navigate("/")}>Home</span>
                    <span className="mx-1 text-slate-300">/</span>
                    <span className="hover:text-blue-600 cursor-pointer transition-colors" onClick={() => navigate("/allleads")}>Leads</span>
                    <span className="mx-1 text-slate-300">/</span>
                    <span className="hover:text-blue-600 cursor-pointer transition-colors">Logs</span>
                    <span className="mx-1 text-slate-300">/</span>
                    <span className="text-blue-600 font-bold">View Logs</span>
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6">

        {/* ── LOGS CARD ── */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden fade-up">

          {/* Card sub-header: "Logs for Lead: {Name}" + action buttons */}
          <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <FiMessageSquare className="w-4 h-4 text-blue-500 flex-shrink-0"/>
              <div>
                <h2 className="text-base font-extrabold text-slate-700">
                  Logs for Lead:{" "}
                  <span className="text-blue-600">{leadName}</span>
                </h2>
                {!loading && (
                  <p className="text-xs text-slate-400 mt-0.5">
                    {logs.length} log entr{logs.length !== 1 ? "ies" : "y"} found
                  </p>
                )}
              </div>
            </div>

            {/* Action buttons — matching screenshot exactly */}
            <div className="flex flex-wrap items-center gap-2">
              {/* + Add Log → navigates to /AddLeadLog/:id */}
              {/* <button onClick={() => navigate(`/AddLeadLog/${id}?name=${encodeURIComponent(leadName)}&stage=${encodeURIComponent("New Lead")}&logs=${logs.length}`)} */}
              <button onClick={() => navigate("/AddLeadLog")}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700
                  text-white text-xs font-bold shadow-md shadow-blue-200 transition-all">
                <FiPlus className="w-3.5 h-3.5"/> Add Log
              </button>
              {/* Back to Leads */}
              <button onClick={() => navigate("/allleads")}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700
                  text-white text-xs font-bold shadow-md shadow-blue-200 transition-all">
                <FiList className="w-3.5 h-3.5"/> Back to Leads
              </button>
              {/* Back to All Logs */}
              <button onClick={() => navigate("/AllLeadLogs")}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-600
                  text-white text-xs font-bold shadow-md shadow-teal-200 transition-all">
                <FaClipboardList className="w-3.5 h-3.5"/> Back to All Logs
              </button>
            </div>
          </div>

          {/* ── DESKTOP TABLE ── */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50/80 border-b border-slate-100">
                <tr>
                  {[
                    { label:"Date",          w:"w-48"  },
                    { label:"Stage",         w:"w-36"  },
                    { label:"Log Comment",   w:""       },
                    { label:"Follow-up Date",w:"w-40"  },
                    { label:"Added by",      w:"w-52"  },
                  ].map(({ label, w }) => (
                    <th key={label}
                      className={`${w} px-5 py-3.5 text-left text-xs font-extrabold text-slate-600 uppercase tracking-wider whitespace-nowrap`}>
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading
                  ? [...Array(3)].map((_, i) => <SkeletonRow key={i}/>)
                  : pageData.length === 0
                  ? (
                    <tr>
                      <td colSpan={5} className="text-center py-20">
                        <div className="text-5xl mb-3">📋</div>
                        <p className="text-base font-extrabold text-slate-600 mb-1">No Logs Found</p>
                        <p className="text-sm text-slate-400 mb-5">
                          No log entries have been added for this lead yet.
                        </p>
                        <button onClick={() => navigate(`/AddLeadLog/${id}?name=${encodeURIComponent(leadName)}&logs=0`)}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600
                            hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-200 transition-all">
                          <FiPlus className="w-4 h-4"/> Add First Log
                        </button>
                      </td>
                    </tr>
                  )
                  : pageData.map((log, idx) => {
                    const sc = STAGE_CFG[log.stage] || STAGE_DEF;
                    return (
                      <tr key={log.id}
                        className="group hover:bg-blue-50/30 hover:shadow-[inset_3px_0_0_#2563eb] transition-all duration-150"
                        style={{ animation: "fadeUp .35s ease both", animationDelay: `${idx * 40}ms` }}>
                        {/* Date */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <FiCalendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0"/>
                            <span className="text-sm font-semibold text-slate-800">{log.date}</span>
                          </div>
                        </td>
                        {/* Stage */}
                        <td className="px-5 py-4">
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${sc.bg} ${sc.text}`}>
                            {log.stage}
                          </span>
                        </td>
                        {/* Log Comment */}
                        <td className="px-5 py-4">
                          <p className="text-sm text-slate-700 leading-relaxed">{log.comment}</p>
                        </td>
                        {/* Follow-up Date */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-slate-600">{log.followUpDate}</span>
                        </td>
                        {/* Added by */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600
                              flex items-center justify-center text-white text-xs font-extrabold flex-shrink-0">
                              {log.addedBy.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-sm font-medium text-slate-700">{log.addedBy}</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>

          {/* ── MOBILE CARDS ── */}
          <div className="md:hidden p-4 space-y-3">
            {loading
              ? [...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-slate-100 p-4 space-y-2">
                    {[...Array(4)].map((_, j) => (
                      <div key={j} className="h-4 rounded-lg bg-slate-200 animate-pulse"
                        style={{ width: `${40 + Math.random() * 50}%` }}/>
                    ))}
                  </div>
                ))
              : pageData.length === 0
              ? (
                <div className="text-center py-14">
                  <div className="text-5xl mb-3">📋</div>
                  <p className="text-base font-extrabold text-slate-600 mb-1">No Logs Found</p>
                  <p className="text-sm text-slate-400 mb-4">No log entries yet.</p>
                  <button onClick={() => navigate(`/AddLeadLog/${id}?name=${encodeURIComponent(leadName)}&logs=0`)}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm shadow-md">
                    <FiPlus className="inline mr-1"/> Add First Log
                  </button>
                </div>
              )
              : pageData.map((log, idx) => {
                const sc = STAGE_CFG[log.stage] || STAGE_DEF;
                return (
                  <div key={log.id}
                    className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-3 fade-up"
                    style={{ animationDelay: `${idx * 40}ms` }}>
                    {/* Header: Date + Stage */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <FiCalendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5"/>
                        <span className="text-sm font-bold text-slate-800">{log.date}</span>
                      </div>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-lg flex-shrink-0 ${sc.bg} ${sc.text}`}>
                        {log.stage}
                      </span>
                    </div>
                    {/* Comment */}
                    <div className="bg-slate-50 rounded-xl px-3.5 py-2.5">
                      <p className="text-xs text-slate-400 font-medium mb-0.5">Log Comment</p>
                      <p className="text-sm text-slate-700 leading-relaxed">{log.comment}</p>
                    </div>
                    {/* Follow-up + Added by */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-slate-50 rounded-xl px-3 py-2">
                        <p className="text-slate-400 font-medium mb-0.5">Follow-up Date</p>
                        <p className="font-bold text-slate-700">{log.followUpDate}</p>
                      </div>
                      <div className="bg-slate-50 rounded-xl px-3 py-2">
                        <p className="text-slate-400 font-medium mb-0.5">Added by</p>
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600
                            flex items-center justify-center text-white text-[10px] font-extrabold flex-shrink-0">
                            {log.addedBy.charAt(0)}
                          </div>
                          <p className="font-bold text-slate-700 truncate text-[11px]">{log.addedBy}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* ── PAGINATION ── */}
          {logs.length > perPage && (
            <div className="px-5 py-4 border-t border-slate-100 bg-slate-50/60
              flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-slate-400 font-medium">
                Showing{" "}
                <span className="font-bold text-slate-600">{(page - 1) * perPage + 1}</span>–
                <span className="font-bold text-slate-600">{Math.min(page * perPage, logs.length)}</span>
                {" "}of{" "}
                <span className="font-bold text-slate-600">{logs.length}</span> entries
              </p>
              <div className="flex items-center gap-1.5">
                <button disabled={page === 1} onClick={() => setPage(1)}
                  className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-500
                    hover:border-blue-300 hover:text-blue-600 text-xs font-bold transition-all
                    disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center">
                  <FaAngleDoubleLeft className="text-xs"/>
                </button>
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                  className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-500
                    hover:border-blue-300 hover:text-blue-600 text-xs font-bold transition-all
                    disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center">
                  <FiChevronLeft className="text-xs"/>
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setPage(p)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all border
                      ${page === p
                        ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                        : "bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600"}`}>
                    {p}
                  </button>
                ))}
                <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
                  className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-500
                    hover:border-blue-300 hover:text-blue-600 text-xs font-bold transition-all
                    disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center">
                  <FiChevronRight className="text-xs"/>
                </button>
                <button disabled={page === totalPages} onClick={() => setPage(totalPages)}
                  className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-500
                    hover:border-blue-300 hover:text-blue-600 text-xs font-bold transition-all
                    disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center">
                  <FaAngleDoubleRight className="text-xs"/>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}