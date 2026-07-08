// src/components/Leads/AddLeadLog.jsx
// ─────────────────────────────────────────────────────────────
// Add Log to Lead Page — Travel CRM
// Matches CRM design system perfectly
// Reference: company/leads/add_log.php?lead_id=123&stage=Ready+to+Book&name=Pratik
// Features:
//   - Blue info header bar: "Add Log for Lead: Pratik | 📞 +91..."
//   - Current Stage (read-only field with hint text)
//   - Log Comment (required textarea)
//   - Create reminder for follow-up checkbox + hint
//   - Follow-up Date field (shows when checkbox is ticked)
//   - Bottom actions: Save Log | Back to Leads | View Lead Logs (with count badge)
//   - Fully responsive all devices
//   - Toast + validation
// ─────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Save as FiSave, ArrowLeft as FiArrowLeft, Eye as FiEye, List as FiList, CircleAlert as FiAlertCircle, Phone as FiPhone, Calendar as FiCalendar, ClipboardList as FaClipboardList, Bell as FaBell } from "lucide-react";


// ── Uncomment when backend ready ─────────────────────────────
// import leadLogsService from "../api/leadLogsService";

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

/* ─── MAIN PAGE ──────────────────────────────────────────────── */
export default function AddLeadLog() {
  const navigate       = useNavigate();
  const { id }         = useParams();               // /AddLeadLog/:leadId
  const [searchParams] = useSearchParams();

  // Read from URL params — ?name=Pratik&stage=Ready+to+Book&phone=%2B91888...&logs=1
  const leadName  = searchParams.get("name")  || "Lead";
  const leadPhone = searchParams.get("phone") || "";
  const leadStage = searchParams.get("stage") || "New Lead";
  const logCount  = Number(searchParams.get("logs") || 0);

  /* form state */
  const [comment,    setComment]    = useState("");
  const [createRem,  setCreateRem]  = useState(false);
  const [followDate, setFollowDate] = useState("");
  const [errs,       setErrs]       = useState({});
  const [saving,     setSaving]     = useState(false);
  const [toast,      setToast]      = useState(null);

  const showToast = useCallback((msg, type = "success") => setToast({ msg, type }), []);

  /* validation */
  const validate = () => {
    const e = {};
    if (!comment.trim())
      e.comment = "Log comment is required";
    if (comment.trim().length < 5)
      e.comment = "Comment must be at least 5 characters";
    if (createRem && !followDate)
      e.followDate = "Please select a follow-up date for the reminder";
    return e;
  };

  /* submit */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs2 = validate();
    if (Object.keys(errs2).length) {
      setErrs(errs2);
      showToast("Please fix the errors below.", "error");
      return;
    }
    setSaving(true);
    try {
      // BACKEND:
      // await leadLogsService.addLog({
      //   leadId:      id,
      //   stage:       leadStage,
      //   comment:     comment.trim(),
      //   createReminder: createRem,
      //   followUpDate:   createRem ? followDate : null,
      // });
      await new Promise(r => setTimeout(r, 1000));
      showToast("Log saved successfully! ✅");
      setTimeout(() => {
        navigate(`/LeadLogs/${id}?name=${encodeURIComponent(leadName)}`);
      }, 1500);
    } catch (err) {
      showToast(
        err?.response?.data?.message || "Failed to save log. Please try again.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  const inputCls = (err) =>
    `w-full px-4 py-3 rounded-xl border text-sm text-slate-700 placeholder-slate-400
     focus:outline-none focus:ring-2 transition-all bg-white
     ${err
       ? "border-red-300 focus:border-red-400 focus:ring-red-50"
       : "border-slate-200 focus:border-blue-400 focus:ring-blue-50 hover:border-slate-300"}`;

  const readonlyCls =
    "w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-600 font-medium cursor-not-allowed";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100"
      style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        @keyframes slideIn { from{transform:translateX(110%);opacity:0} to{transform:translateX(0);opacity:1} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        .fade-up { animation: fadeUp .4s ease both; }
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
                <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">
                  Add Log to Lead
                </h1>
                <p className="text-sm text-slate-400 mt-0.5">
                  Add a new log entry for this lead
                  <span className="hidden sm:inline ml-3 text-slate-300">|</span>
                  <span className="hidden sm:inline ml-3 text-xs">
                    <span className="hover:text-blue-600 cursor-pointer transition-colors" onClick={() => navigate("/")}>Home</span>
                    <span className="mx-1 text-slate-300">/</span>
                    <span className="hover:text-blue-600 cursor-pointer transition-colors" onClick={() => navigate("/allleads")}>Leads</span>
                    <span className="mx-1 text-slate-300">/</span>
                    <span className="hover:text-blue-600 cursor-pointer transition-colors"
                      onClick={() => navigate(`/LeadLogs/${id}?name=${encodeURIComponent(leadName)}`)}>
                      Logs
                    </span>
                    <span className="mx-1 text-slate-300">/</span>
                    <span className="text-blue-600 font-bold">Add Log</span>
                  </span>
                </p>
              </div>
            </div>
            <button onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200
                hover:border-blue-300 bg-white hover:bg-blue-50 text-slate-600 hover:text-blue-600
                text-sm font-bold transition-all shadow-sm">
              <FiArrowLeft className="w-4 h-4"/> Back
            </button>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} noValidate className="space-y-0">

            {/* ── FORM CARD ── */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden fade-up">

              {/* Blue info header bar — matches screenshot exactly */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-3.5 flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="text-white font-extrabold text-sm">
                  Add Log for Lead:{" "}
                  <span className="font-extrabold">{leadName}</span>
                </span>
                {leadPhone && (
                  <div className="flex items-center gap-1.5 sm:ml-3">
                    <div className="hidden sm:block w-px h-4 bg-white/40"/>
                    <FiPhone className="w-3.5 h-3.5 text-white/80 sm:ml-2"/>
                    <span className="text-white/90 text-sm font-medium">{leadPhone}</span>
                  </div>
                )}
              </div>

              {/* Form fields */}
              <div className="p-6 space-y-6">

                {/* Current Stage — read-only */}
                <div>
                  <label className="block text-sm font-extrabold text-slate-700 mb-2">
                    Current Stage
                  </label>
                  <input
                    type="text"
                    value={leadStage}
                    readOnly
                    className={readonlyCls}
                  />
                  <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                    Stage is read-only. To change stage, use the stage dropdown in the{" "}
                    <span
                      className="text-blue-500 font-semibold cursor-pointer hover:underline"
                      onClick={() => navigate("/allleads")}>
                      leads list
                    </span>.
                  </p>
                </div>

                {/* Log Comment — required */}
                <div>
                  <label className="block text-sm font-extrabold text-slate-700 mb-2">
                    Log Comment{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={6}
                    value={comment}
                    onChange={e => {
                      setComment(e.target.value);
                      setErrs(p => ({ ...p, comment: "" }));
                    }}
                    placeholder="Enter notes, follow-up details, call summary, or any important information about this lead..."
                    className={inputCls(errs.comment) + " resize-none"}
                  />
                  {errs.comment && (
                    <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                      <FiAlertCircle className="w-3 h-3 flex-shrink-0"/>{errs.comment}
                    </p>
                  )}
                </div>

                {/* Create reminder checkbox — matches screenshot */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center h-5 mt-0.5">
                      <input
                        id="createReminder"
                        type="checkbox"
                        checked={createRem}
                        onChange={e => {
                          setCreateRem(e.target.checked);
                          if (!e.target.checked) {
                            setFollowDate("");
                            setErrs(p => ({ ...p, followDate: "" }));
                          }
                        }}
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-400 cursor-pointer"
                      />
                    </div>
                    <div>
                      <label htmlFor="createReminder"
                        className="text-sm font-bold text-slate-700 cursor-pointer select-none">
                        Create reminder for follow-up
                      </label>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Check this box if you want to create a reminder for follow-up
                      </p>
                    </div>
                    <FaBell className={`w-4 h-4 mt-0.5 flex-shrink-0 transition-colors ${createRem ? "text-amber-500" : "text-slate-300"}`}/>
                  </div>

                  {/* Follow-up date — only shown when checkbox is ticked */}
                  {createRem && (
                    <div className="ml-7 p-4 bg-amber-50 border border-amber-200 rounded-xl"
                      style={{ animation: "fadeUp .3s ease both" }}>
                      <label className="block text-xs font-extrabold text-amber-700 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                        <FiCalendar className="w-3.5 h-3.5"/> Follow-up Date
                        <span className="text-red-500 ml-0.5">*</span>
                      </label>
                      <input
                        type="date"
                        value={followDate}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={e => {
                          setFollowDate(e.target.value);
                          setErrs(p => ({ ...p, followDate: "" }));
                        }}
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm text-slate-700 bg-white
                          focus:outline-none focus:ring-2 transition-all
                          ${errs.followDate
                            ? "border-red-300 focus:border-red-400 focus:ring-red-50"
                            : "border-amber-300 focus:border-amber-400 focus:ring-amber-50 hover:border-amber-400"}`}
                      />
                      {errs.followDate && (
                        <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                          <FiAlertCircle className="w-3 h-3 flex-shrink-0"/>{errs.followDate}
                        </p>
                      )}
                      <p className="mt-2 text-xs text-amber-600">
                        A reminder will be automatically created and assigned to you.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* ── ACTION BUTTONS — matches screenshot exactly ── */}
              <div className="px-6 pb-6 pt-2">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  {/* Save Log */}
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center justify-center gap-2.5 px-6 py-2.5 rounded-xl
                      bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm
                      shadow-md shadow-blue-200 hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed">
                    {saving ? (
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/>
                    ) : (
                      <FiSave className="w-4 h-4"/>
                    )}
                    {saving ? "Saving…" : "Save Log"}
                  </button>

                  {/* Back to Leads */}
                  <button
                    type="button"
                    onClick={() => navigate("/allleads")}
                    disabled={saving}
                    className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl
                      border-2 border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50
                      text-slate-600 hover:text-slate-800 font-bold text-sm
                      transition-all disabled:opacity-50">
                    <FiList className="w-4 h-4"/> Back to Leads
                  </button>

                  {/* View Lead Logs — with count badge matching screenshot */}
                  <button
                    type="button"
                    // onClick={() => navigate(`/LeadLogs/${id}?name=${encodeURIComponent(leadName)}`)}
                    onClick={() => navigate("/LeadLogs")}
                    disabled={saving}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl
                      bg-slate-600 hover:bg-slate-700 text-white font-bold text-sm
                      shadow-md shadow-slate-300 transition-all disabled:opacity-50">
                    <FiEye className="w-4 h-4"/> View Lead Logs
                    {logCount > 0 && (
                      <span className="ml-1 bg-white text-slate-700 text-[11px] font-extrabold
                        w-5 h-5 rounded-full flex items-center justify-center leading-none">
                        {logCount}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}