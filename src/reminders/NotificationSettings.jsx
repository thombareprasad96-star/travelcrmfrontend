// // src/components/NotificationSettings/NotificationSettings.jsx
// // ─────────────────────────────────────────────────────────────
// // Notification Settings Page — Travel CRM
// // Matches: Reminders.jsx / Notifications.jsx design system
// // Font: Plus Jakarta Sans | Tailwind CSS | React Icons
// // Reference: settings/notifications/index.php screenshots
// // Fully responsive: stacks to 1 column on mobile/tablet
// // ─────────────────────────────────────────────────────────────

// import { useState, useEffect, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   FiSave, FiRefreshCw, FiInfo, FiChevronDown, FiAlertCircle,
// } from "react-icons/fi";
// import { FaBell, FaUserPlus, FaPhoneAlt, FaUserCheck, FaFileInvoiceDollar,
//   FaHandshake, FaMoneyBillWave, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

// // ── Uncomment when backend is ready ──────────────────────────
// // import notificationSettingsService from "../services/notificationSettingsService";

// /* ─── CONSTANTS ──────────────────────────────────────────────── */
// const REMINDER_TYPES = [
//   { value: "First_contact",    label: "First Contact"    },
//   { value: "Follow_up",        label: "Follow Up"        },
//   { value: "Quotation",        label: "Quotation"        },
//   { value: "Payment_reminder", label: "Payment Reminder" },
//   { value: "Document",         label: "Document"         },
//   { value: "Confirmation",     label: "Confirmation"     },
//   { value: "Custom",           label: "Custom"            },
// ];

// const PRIORITIES = [
//   { value: "High",   label: "High"   },
//   { value: "Medium",  label: "Medium" },
//   { value: "Low",     label: "Low"    },
// ];

// // Default stage configuration — matches the two reference screenshots exactly
// const DEFAULT_STAGES = [
//   {
//     key: "new_lead", stageLabel: "New Lead", helperText: "When a lead is marked as New Lead",
//     icon: <FaUserPlus className="w-4 h-4" />, enabled: true,
//     reminderType: "First_contact", hours: 8,  priority: "High",
//     titleTemplate: "Contact New Lead: {lead_name}",
//     descTemplate: "New lead requires initial contact",
//   },
//   {
//     key: "contacted", stageLabel: "Contacted", helperText: "When a lead is marked as Contacted",
//     icon: <FaPhoneAlt className="w-4 h-4" />, enabled: true,
//     reminderType: "First_contact", hours: 24, priority: "Medium",
//     titleTemplate: "Follow-up Contact: {lead_name}",
//     descTemplate: "Follow-up required after initial contact",
//   },
//   {
//     key: "prospect", stageLabel: "Prospect", helperText: "When a lead is marked as Prospect",
//     icon: <FaUserCheck className="w-4 h-4" />, enabled: true,
//     reminderType: "First_contact", hours: 24, priority: "Medium",
//     titleTemplate: "Follow-up Prospect: {lead_name}",
//     descTemplate: "Prospect needs attention and follow-up",
//   },
//   {
//     key: "quotation_sent", stageLabel: "Quotation Sent", helperText: "When a quotation is sent to lead",
//     icon: <FaFileInvoiceDollar className="w-4 h-4" />, enabled: true,
//     reminderType: "First_contact", hours: 48, priority: "Medium",
//     titleTemplate: "Follow-up Quotation: {lead_name}",
//     descTemplate: "Quotation sent - follow-up required",
//   },
//   {
//     key: "in_negotiation", stageLabel: "In Negotiation", helperText: "When lead enters negotiation stage",
//     icon: <FaHandshake className="w-4 h-4" />, enabled: true,
//     reminderType: "First_contact", hours: 24, priority: "Medium",
//     titleTemplate: "Negotiation Follow-up: {lead_name}",
//     descTemplate: "Lead in negotiation - check progress",
//   },
//   {
//     key: "payment_awaited", stageLabel: "Payment Awaited", helperText: "When payment is pending from customer",
//     icon: <FaMoneyBillWave className="w-4 h-4" />, enabled: true,
//     reminderType: "Payment_reminder", hours: 12, priority: "High",
//     titleTemplate: "Payment Follow-up: {lead_name}",
//     descTemplate: "Payment pending - follow-up required",
//   },
//   {
//     key: "ready_to_book", stageLabel: "Ready to Book", helperText: "When lead is ready to book",
//     icon: <FaCheckCircle className="w-4 h-4" />, enabled: true,
//     reminderType: "First_contact", hours: 24, priority: "Medium",
//     titleTemplate: "Booking Follow-up: {lead_name}",
//     descTemplate: "Lead ready to book - close the deal",
//   },
//   {
//     key: "lost", stageLabel: "Lost", helperText: "When a lead is marked as lost (for revival attempts)",
//     icon: <FaTimesCircle className="w-4 h-4" />, enabled: false,
//     reminderType: "First_contact", hours: 168, priority: "Low",
//     titleTemplate: "Revival Attempt: {lead_name}",
//     descTemplate: "Attempt to revive lost lead",
//   },
// ];

// /* ─── TOAST ──────────────────────────────────────────────────── */
// function Toast({ msg, type, onClose }) {
//   useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
//   return (
//     <div className={`fixed top-5 right-5 z-[999] flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl max-w-xs
//       ${type === "success" ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800"}`}
//       style={{ animation: "slideIn .3s ease both" }}>
//       <span className="text-lg">{type === "success" ? "✅" : "❌"}</span>
//       <p className="text-sm font-semibold flex-1">{msg}</p>
//       <button onClick={onClose} className="opacity-50 hover:opacity-100 text-lg ml-1">×</button>
//     </div>
//   );
// }

// /* ─── TOGGLE SWITCH ──────────────────────────────────────────── */
// function ToggleSwitch({ checked, onChange }) {
//   return (
//     <button
//       type="button"
//       onClick={() => onChange(!checked)}
//       className={`relative inline-flex items-center h-5 w-9 rounded-full transition-colors duration-200 flex-shrink-0
//         ${checked ? "bg-white/90" : "bg-white/30"}`}
//     >
//       <span
//         className={`inline-block w-3.5 h-3.5 rounded-full shadow transform transition-transform duration-200
//           ${checked ? "translate-x-[18px] bg-blue-600" : "translate-x-0.5 bg-white"}`}
//       />
//     </button>
//   );
// }

// /* ─── FIELD LABEL ─────────────────────────────────────────────── */
// function Label({ children }) {
//   return (
//     <label className="block text-xs font-extrabold text-slate-600 mb-1.5">
//       {children}
//     </label>
//   );
// }

// function inputCls() {
//   return `w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder-slate-400
//     focus:outline-none focus:ring-2 focus:border-blue-400 focus:ring-blue-50 transition-all bg-white disabled:bg-slate-50 disabled:text-slate-400`;
// }

// /* ─── STAGE CARD ─────────────────────────────────────────────── */
// function StageCard({ stage, onUpdate, idx }) {
//   const update = (field, value) => onUpdate(stage.key, { ...stage, [field]: value });

//   return (
//     <div
//       className={`bg-white rounded-2xl shadow-sm border overflow-hidden transition-all
//         ${stage.enabled ? "border-slate-100" : "border-slate-100 opacity-75"}`}
//       style={{ animation: "fadeUp .4s ease both", animationDelay: `${idx * 40}ms` }}
//     >
//       {/* Header bar */}
//       <div className={`px-5 py-3.5 flex items-center justify-between gap-3
//         ${stage.enabled ? "bg-gradient-to-r from-blue-600 to-blue-500" : "bg-slate-400"}`}>
//         <div className="flex items-center gap-2.5 min-w-0">
//           <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center text-white flex-shrink-0">
//             {stage.icon}
//           </div>
//           <h3 className="text-sm font-extrabold text-white truncate">{stage.stageLabel}</h3>
//         </div>
//         <div className="flex items-center gap-2 flex-shrink-0">
//           <span className="text-xs font-bold text-white/90 hidden sm:inline">Enable</span>
//           <ToggleSwitch checked={stage.enabled} onChange={(v) => update("enabled", v)} />
//         </div>
//       </div>

//       <div className="p-5 space-y-4">
//         <p className="text-xs text-slate-400 italic">{stage.helperText}</p>

//         {/* Reminder Type */}
//         <div>
//           <Label>Reminder Type</Label>
//           <div className="relative">
//             <select
//               value={stage.reminderType}
//               disabled={!stage.enabled}
//               onChange={(e) => update("reminderType", e.target.value)}
//               className={inputCls() + " pr-9 cursor-pointer appearance-none"}
//             >
//               {REMINDER_TYPES.map(t => (
//                 <option key={t.value} value={t.value}>{t.label}</option>
//               ))}
//             </select>
//             <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
//           </div>
//         </div>

//         {/* Hours + Priority — side by side */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//           <div>
//             <Label>Create Reminder After (Hours)</Label>
//             <input
//               type="number"
//               min="0"
//               step="0.5"
//               value={stage.hours}
//               disabled={!stage.enabled}
//               onChange={(e) => update("hours", parseFloat(e.target.value) || 0)}
//               className={inputCls()}
//             />
//           </div>
//           <div>
//             <Label>Priority</Label>
//             <div className="relative">
//               <select
//                 value={stage.priority}
//                 disabled={!stage.enabled}
//                 onChange={(e) => update("priority", e.target.value)}
//                 className={inputCls() + " pr-9 cursor-pointer appearance-none"}
//               >
//                 {PRIORITIES.map(p => (
//                   <option key={p.value} value={p.value}>{p.label}</option>
//                 ))}
//               </select>
//               <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
//             </div>
//           </div>
//         </div>

//         {/* Title Template */}
//         <div>
//           <Label>Title Template</Label>
//           <input
//             type="text"
//             value={stage.titleTemplate}
//             disabled={!stage.enabled}
//             onChange={(e) => update("titleTemplate", e.target.value)}
//             className={inputCls()}
//           />
//           <p className="mt-1 text-xs text-slate-400">
//             Use <code className="text-blue-500 font-semibold">{"{lead_name}"}</code> to include the lead's name
//           </p>
//         </div>

//         {/* Description Template */}
//         <div>
//           <Label>Description Template</Label>
//           <textarea
//             rows={2}
//             value={stage.descTemplate}
//             disabled={!stage.enabled}
//             onChange={(e) => update("descTemplate", e.target.value)}
//             className={inputCls() + " resize-none"}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ─── MAIN PAGE ──────────────────────────────────────────────── */
// export default function NotificationSettings() {
//   const navigate = useNavigate();

//   const [stages,     setStages]     = useState(DEFAULT_STAGES);
//   const [loading,    setLoading]    = useState(true);
//   const [saving,     setSaving]     = useState(false);
//   const [toast,      setToast]      = useState(null);

//   useEffect(() => {
//     setLoading(true);
//     // BACKEND: replace with real API call
//     // notificationSettingsService.getAll()
//     //   .then(res => setStages(res.data))
//     //   .catch(() => showToast("Failed to load settings.", "error"))
//     //   .finally(() => setLoading(false));

//     // MOCK loader (remove when backend connected)
//     const t = setTimeout(() => setLoading(false), 600);
//     return () => clearTimeout(t);
//   }, []);

//   const showToast = (msg, type = "success") => setToast({ msg, type });

//   const handleUpdateStage = useCallback((key, updatedStage) => {
//     setStages(prev => prev.map(s => s.key === key ? updatedStage : s));
//   }, []);

//   const handleSave = async () => {
//     setSaving(true);
//     try {
//       // BACKEND: uncomment when API is ready
//       // await notificationSettingsService.updateAll(stages);

//       // MOCK save (remove when backend connected)
//       await new Promise(r => setTimeout(r, 800));

//       showToast("Notification settings saved successfully! ✅");
//     } catch (err) {
//       showToast(err?.response?.data?.message || "Failed to save settings.", "error");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleReset = () => {
//     setStages(DEFAULT_STAGES);
//     showToast("Settings reset to defaults.");
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-100"
//       style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
//         @keyframes slideIn { from{transform:translateX(110%);opacity:0} to{transform:translateX(0);opacity:1} }
//         @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
//         select { -webkit-appearance:none; appearance:none; }
//         ::-webkit-scrollbar{width:5px;height:5px}
//         ::-webkit-scrollbar-track{background:#f1f5f9;border-radius:99px}
//         ::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:99px}
//       `}</style>

//       {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

//       {/* ── PAGE HEADER ── */}
//       <div className="bg-white/70 backdrop-blur-md border-b border-slate-100">
//         <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-5">
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//             <div className="flex items-center gap-4">
//               <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white text-xl shadow-lg shadow-blue-200 flex-shrink-0">
//                 <FaBell className="w-5 h-5" />
//               </div>
//               <div>
//                 <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">Notification Settings</h1>
//                 <p className="text-sm text-slate-400 mt-0.5">
//                   Configure Automatic Reminder Settings
//                   <span className="hidden sm:inline ml-3 text-slate-300">|</span>
//                   <span className="hidden sm:inline ml-3">
//                     <span className="hover:text-blue-600 cursor-pointer transition-colors" onClick={() => navigate("/")}>Home</span>
//                     <span className="mx-1 text-slate-300">/</span>
//                     <span className="hover:text-blue-600 cursor-pointer transition-colors" onClick={() => navigate("/Settings")}>Settings</span>
//                     <span className="mx-1 text-slate-300">/</span>
//                     <span className="text-blue-600 font-bold">Notifications</span>
//                   </span>
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6 space-y-5">

//         {/* ── INFO BANNER ── */}
//         <div className="bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl px-5 py-4 flex items-start gap-3 fade-up shadow-sm">
//           <FiInfo className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
//           <p className="text-sm text-white leading-relaxed">
//             <span className="font-extrabold">How it works:</span> When a lead's stage changes to any of the configured stages below,
//             the system will automatically create a reminder for the assigned user after the specified time.
//             Use <code className="bg-white/20 px-1.5 py-0.5 rounded font-mono text-xs">{"{lead_name}"}</code> in templates to include the lead's name.
//           </p>
//         </div>

//         {/* ── SKELETON ── */}
//         {loading && (
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
//             {[...Array(4)].map((_, i) => (
//               <div key={i} className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
//                 <div className="h-12 bg-slate-200 animate-pulse" />
//                 <div className="p-5 space-y-3">
//                   <div className="h-3 rounded-lg bg-slate-200 animate-pulse w-2/3" />
//                   <div className="h-9 rounded-xl bg-slate-200 animate-pulse w-full" />
//                   <div className="h-9 rounded-xl bg-slate-200 animate-pulse w-full" />
//                   <div className="h-9 rounded-xl bg-slate-200 animate-pulse w-full" />
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* ── STAGE CARDS GRID — responsive: 1 col mobile, 2 col tablet+ ── */}
//         {!loading && (
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
//             {stages.map((stage, idx) => (
//               <StageCard key={stage.key} stage={stage} idx={idx} onUpdate={handleUpdateStage} />
//             ))}
//           </div>
//         )}

//         {/* ── SAVE / RESET BAR ── */}
//         {!loading && (
//           <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 fade-up">
//             <div className="flex flex-col sm:flex-row items-stretch gap-3">
//               <button
//                 type="button"
//                 onClick={handleSave}
//                 disabled={saving}
//                 className="flex-1 flex items-center justify-center gap-2.5 px-8 py-3 rounded-xl
//                   bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-extrabold text-sm
//                   transition-all shadow-md shadow-blue-200 hover:shadow-lg hover:shadow-blue-300
//                   disabled:opacity-60 disabled:cursor-not-allowed"
//               >
//                 {saving ? (
//                   <>
//                     <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
//                     Saving Settings...
//                   </>
//                 ) : (
//                   <>
//                     <FiSave className="w-4 h-4" /> Save Settings
//                   </>
//                 )}
//               </button>

//               <button
//                 type="button"
//                 onClick={handleReset}
//                 disabled={saving}
//                 className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3
//                   rounded-xl border-2 border-slate-200 hover:border-slate-300 text-slate-600
//                   hover:text-slate-800 font-bold text-sm transition-all disabled:opacity-50
//                   bg-white hover:bg-slate-50"
//               >
//                 <FiRefreshCw className="w-4 h-4" /> Reset
//               </button>
//             </div>
//             <p className="text-center text-xs text-slate-400 mt-3 flex items-center justify-center gap-1.5">
//               <FiAlertCircle className="w-3.5 h-3.5" />
//               Changes apply to new leads entering each stage after saving.
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }













// // src/components/NotificationSettings/NotificationSettings.jsx
// // ─────────────────────────────────────────────────────────────
// // Notification Settings Page — Travel CRM
// // Matches: Reminders.jsx / Notifications.jsx design system
// // Font: Plus Jakarta Sans | Tailwind CSS | React Icons
// // Reference: settings/notifications/index.php screenshots
// // Fully responsive: stacks to 1 column on mobile/tablet
// // ─────────────────────────────────────────────────────────────

// import { useState, useEffect, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   FiSave, FiRefreshCw, FiInfo, FiChevronDown, FiAlertCircle,
// } from "react-icons/fi";
// import { FaBell, FaUserPlus, FaPhoneAlt, FaUserCheck, FaFileInvoiceDollar,
//   FaHandshake, FaMoneyBillWave, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

// import notificationSettingsService from "../services/notificationSettingsService";

// /* ─── CONSTANTS ──────────────────────────────────────────────── */
// const REMINDER_TYPES = [
//   { value: "First_contact",    label: "First Contact"    },
//   { value: "Follow_up",        label: "Follow Up"        },
//   { value: "Quotation",        label: "Quotation"        },
//   { value: "Payment_reminder", label: "Payment Reminder" },
//   { value: "Document",         label: "Document"         },
//   { value: "Confirmation",     label: "Confirmation"     },
//   { value: "Custom",           label: "Custom"            },
// ];

// const PRIORITIES = [
//   { value: "High",   label: "High"   },
//   { value: "Medium",  label: "Medium" },
//   { value: "Low",     label: "Low"    },
// ];

// // Default stage configuration — matches the two reference screenshots exactly
// const DEFAULT_STAGES = [
//   {
//     key: "new_lead", stageLabel: "New Lead", helperText: "When a lead is marked as New Lead",
//     icon: <FaUserPlus className="w-4 h-4" />, enabled: true,
//     reminderType: "First_contact", hours: 8,  priority: "High",
//     titleTemplate: "Contact New Lead: {lead_name}",
//     descTemplate: "New lead requires initial contact",
//   },
//   {
//     key: "contacted", stageLabel: "Contacted", helperText: "When a lead is marked as Contacted",
//     icon: <FaPhoneAlt className="w-4 h-4" />, enabled: true,
//     reminderType: "First_contact", hours: 24, priority: "Medium",
//     titleTemplate: "Follow-up Contact: {lead_name}",
//     descTemplate: "Follow-up required after initial contact",
//   },
//   {
//     key: "prospect", stageLabel: "Prospect", helperText: "When a lead is marked as Prospect",
//     icon: <FaUserCheck className="w-4 h-4" />, enabled: true,
//     reminderType: "First_contact", hours: 24, priority: "Medium",
//     titleTemplate: "Follow-up Prospect: {lead_name}",
//     descTemplate: "Prospect needs attention and follow-up",
//   },
//   {
//     key: "quotation_sent", stageLabel: "Quotation Sent", helperText: "When a quotation is sent to lead",
//     icon: <FaFileInvoiceDollar className="w-4 h-4" />, enabled: true,
//     reminderType: "First_contact", hours: 48, priority: "Medium",
//     titleTemplate: "Follow-up Quotation: {lead_name}",
//     descTemplate: "Quotation sent - follow-up required",
//   },
//   {
//     key: "in_negotiation", stageLabel: "In Negotiation", helperText: "When lead enters negotiation stage",
//     icon: <FaHandshake className="w-4 h-4" />, enabled: true,
//     reminderType: "First_contact", hours: 24, priority: "Medium",
//     titleTemplate: "Negotiation Follow-up: {lead_name}",
//     descTemplate: "Lead in negotiation - check progress",
//   },
//   {
//     key: "payment_awaited", stageLabel: "Payment Awaited", helperText: "When payment is pending from customer",
//     icon: <FaMoneyBillWave className="w-4 h-4" />, enabled: true,
//     reminderType: "Payment_reminder", hours: 12, priority: "High",
//     titleTemplate: "Payment Follow-up: {lead_name}",
//     descTemplate: "Payment pending - follow-up required",
//   },
//   {
//     key: "ready_to_book", stageLabel: "Ready to Book", helperText: "When lead is ready to book",
//     icon: <FaCheckCircle className="w-4 h-4" />, enabled: true,
//     reminderType: "First_contact", hours: 24, priority: "Medium",
//     titleTemplate: "Booking Follow-up: {lead_name}",
//     descTemplate: "Lead ready to book - close the deal",
//   },
//   {
//     key: "lost", stageLabel: "Lost", helperText: "When a lead is marked as lost (for revival attempts)",
//     icon: <FaTimesCircle className="w-4 h-4" />, enabled: false,
//     reminderType: "First_contact", hours: 168, priority: "Low",
//     titleTemplate: "Revival Attempt: {lead_name}",
//     descTemplate: "Attempt to revive lost lead",
//   },
// ];

// /* ─── TOAST ──────────────────────────────────────────────────── */
// function Toast({ msg, type, onClose }) {
//   useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
//   return (
//     <div className={`fixed top-5 right-5 z-[999] flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl max-w-xs
//       ${type === "success" ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800"}`}
//       style={{ animation: "slideIn .3s ease both" }}>
//       <span className="text-lg">{type === "success" ? "✅" : "❌"}</span>
//       <p className="text-sm font-semibold flex-1">{msg}</p>
//       <button onClick={onClose} className="opacity-50 hover:opacity-100 text-lg ml-1">×</button>
//     </div>
//   );
// }

// /* ─── TOGGLE SWITCH ──────────────────────────────────────────── */
// function ToggleSwitch({ checked, onChange }) {
//   return (
//     <button
//       type="button"
//       onClick={() => onChange(!checked)}
//       className={`relative inline-flex items-center h-5 w-9 rounded-full transition-colors duration-200 flex-shrink-0
//         ${checked ? "bg-white/90" : "bg-white/30"}`}
//     >
//       <span
//         className={`inline-block w-3.5 h-3.5 rounded-full shadow transform transition-transform duration-200
//           ${checked ? "translate-x-[18px] bg-blue-600" : "translate-x-0.5 bg-white"}`}
//       />
//     </button>
//   );
// }

// /* ─── FIELD LABEL ─────────────────────────────────────────────── */
// function Label({ children }) {
//   return (
//     <label className="block text-xs font-extrabold text-slate-600 mb-1.5">
//       {children}
//     </label>
//   );
// }

// function inputCls() {
//   return `w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder-slate-400
//     focus:outline-none focus:ring-2 focus:border-blue-400 focus:ring-blue-50 transition-all bg-white disabled:bg-slate-50 disabled:text-slate-400`;
// }

// /* ─── STAGE CARD ─────────────────────────────────────────────── */
// function StageCard({ stage, onUpdate, idx }) {
//   const update = (field, value) => onUpdate(stage.key, { ...stage, [field]: value });

//   return (
//     <div
//       className={`bg-white rounded-2xl shadow-sm border overflow-hidden transition-all
//         ${stage.enabled ? "border-slate-100" : "border-slate-100 opacity-75"}`}
//       style={{ animation: "fadeUp .4s ease both", animationDelay: `${idx * 40}ms` }}
//     >
//       {/* Header bar */}
//       <div className={`px-5 py-3.5 flex items-center justify-between gap-3
//         ${stage.enabled ? "bg-gradient-to-r from-blue-600 to-blue-500" : "bg-slate-400"}`}>
//         <div className="flex items-center gap-2.5 min-w-0">
//           <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center text-white flex-shrink-0">
//             {stage.icon}
//           </div>
//           <h3 className="text-sm font-extrabold text-white truncate">{stage.stageLabel}</h3>
//         </div>
//         <div className="flex items-center gap-2 flex-shrink-0">
//           <span className="text-xs font-bold text-white/90 hidden sm:inline">Enable</span>
//           <ToggleSwitch checked={stage.enabled} onChange={(v) => update("enabled", v)} />
//         </div>
//       </div>

//       <div className="p-5 space-y-4">
//         <p className="text-xs text-slate-400 italic">{stage.helperText}</p>

//         {/* Reminder Type */}
//         <div>
//           <Label>Reminder Type</Label>
//           <div className="relative">
//             <select
//               value={stage.reminderType}
//               disabled={!stage.enabled}
//               onChange={(e) => update("reminderType", e.target.value)}
//               className={inputCls() + " pr-9 cursor-pointer appearance-none"}
//             >
//               {REMINDER_TYPES.map(t => (
//                 <option key={t.value} value={t.value}>{t.label}</option>
//               ))}
//             </select>
//             <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
//           </div>
//         </div>

//         {/* Hours + Priority — side by side */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//           <div>
//             <Label>Create Reminder After (Hours)</Label>
//             <input
//               type="number"
//               min="0"
//               step="0.5"
//               value={stage.hours}
//               disabled={!stage.enabled}
//               onChange={(e) => update("hours", parseFloat(e.target.value) || 0)}
//               className={inputCls()}
//             />
//           </div>
//           <div>
//             <Label>Priority</Label>
//             <div className="relative">
//               <select
//                 value={stage.priority}
//                 disabled={!stage.enabled}
//                 onChange={(e) => update("priority", e.target.value)}
//                 className={inputCls() + " pr-9 cursor-pointer appearance-none"}
//               >
//                 {PRIORITIES.map(p => (
//                   <option key={p.value} value={p.value}>{p.label}</option>
//                 ))}
//               </select>
//               <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
//             </div>
//           </div>
//         </div>

//         {/* Title Template */}
//         <div>
//           <Label>Title Template</Label>
//           <input
//             type="text"
//             value={stage.titleTemplate}
//             disabled={!stage.enabled}
//             onChange={(e) => update("titleTemplate", e.target.value)}
//             className={inputCls()}
//           />
//           <p className="mt-1 text-xs text-slate-400">
//             Use <code className="text-blue-500 font-semibold">{"{lead_name}"}</code> to include the lead's name
//           </p>
//         </div>

//         {/* Description Template */}
//         <div>
//           <Label>Description Template</Label>
//           <textarea
//             rows={2}
//             value={stage.descTemplate}
//             disabled={!stage.enabled}
//             onChange={(e) => update("descTemplate", e.target.value)}
//             className={inputCls() + " resize-none"}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ─── MAIN PAGE ──────────────────────────────────────────────── */
// export default function NotificationSettings() {
//   const navigate = useNavigate();

//   const [stages,     setStages]     = useState(DEFAULT_STAGES);
//   const [loading,    setLoading]    = useState(true);
//   const [saving,     setSaving]     = useState(false);
//   const [toast,      setToast]      = useState(null);

//   useEffect(() => {
//     setLoading(true);
//     notificationSettingsService.getAll()
//       .then(res => {
//         const saved = res.data || [];
//         if (saved.length) {
//           const byKey = Object.fromEntries(saved.map(s => [s.key, s]));
//           setStages(DEFAULT_STAGES.map(d => byKey[d.key] ? { ...d, ...byKey[d.key] } : d));
//         }
//       })
//       .catch(() => setToast({ msg: "Failed to load settings.", type: "error" }))
//       .finally(() => setLoading(false));
//   }, []);

//   const showToast = (msg, type = "success") => setToast({ msg, type });

//   const handleUpdateStage = useCallback((key, updatedStage) => {
//     setStages(prev => prev.map(s => s.key === key ? updatedStage : s));
//   }, []);

//   const handleSave = async () => {
//     setSaving(true);
//     try {
//       const payload = stages.map(({ key, enabled, reminderType, hours, priority, titleTemplate, descTemplate }) =>
//         ({ key, enabled, reminderType, hours, priority, titleTemplate, descTemplate }));
//       await notificationSettingsService.updateAll(payload);
//       showToast("Notification settings saved successfully! ✅");
//     } catch (err) {
//       showToast(err?.response?.data?.message || "Failed to save settings.", "error");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleReset = () => {
//     setStages(DEFAULT_STAGES);
//     showToast("Settings reset to defaults.");
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-100"
//       style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
//         @keyframes slideIn { from{transform:translateX(110%);opacity:0} to{transform:translateX(0);opacity:1} }
//         @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
//         select { -webkit-appearance:none; appearance:none; }
//         ::-webkit-scrollbar{width:5px;height:5px}
//         ::-webkit-scrollbar-track{background:#f1f5f9;border-radius:99px}
//         ::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:99px}
//       `}</style>

//       {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

//       {/* ── PAGE HEADER ── */}
//       <div className="bg-white/70 backdrop-blur-md border-b border-slate-100">
//         <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-5">
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//             <div className="flex items-center gap-4">
//               <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white text-xl shadow-lg shadow-blue-200 flex-shrink-0">
//                 <FaBell className="w-5 h-5" />
//               </div>
//               <div>
//                 <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">Notification Settings</h1>
//                 <p className="text-sm text-slate-400 mt-0.5">
//                   Configure Automatic Reminder Settings
//                   <span className="hidden sm:inline ml-3 text-slate-300">|</span>
//                   <span className="hidden sm:inline ml-3">
//                     <span className="hover:text-blue-600 cursor-pointer transition-colors" onClick={() => navigate("/")}>Home</span>
//                     <span className="mx-1 text-slate-300">/</span>
//                     <span className="hover:text-blue-600 cursor-pointer transition-colors" onClick={() => navigate("/Settings")}>Settings</span>
//                     <span className="mx-1 text-slate-300">/</span>
//                     <span className="text-blue-600 font-bold">Notifications</span>
//                   </span>
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6 space-y-5">

//         {/* ── INFO BANNER ── */}
//         <div className="bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl px-5 py-4 flex items-start gap-3 fade-up shadow-sm">
//           <FiInfo className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
//           <p className="text-sm text-white leading-relaxed">
//             <span className="font-extrabold">How it works:</span> When a lead's stage changes to any of the configured stages below,
//             the system will automatically create a reminder for the assigned user after the specified time.
//             Use <code className="bg-white/20 px-1.5 py-0.5 rounded font-mono text-xs">{"{lead_name}"}</code> in templates to include the lead's name.
//           </p>
//         </div>

//         {/* ── SKELETON ── */}
//         {loading && (
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
//             {[...Array(4)].map((_, i) => (
//               <div key={i} className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
//                 <div className="h-12 bg-slate-200 animate-pulse" />
//                 <div className="p-5 space-y-3">
//                   <div className="h-3 rounded-lg bg-slate-200 animate-pulse w-2/3" />
//                   <div className="h-9 rounded-xl bg-slate-200 animate-pulse w-full" />
//                   <div className="h-9 rounded-xl bg-slate-200 animate-pulse w-full" />
//                   <div className="h-9 rounded-xl bg-slate-200 animate-pulse w-full" />
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* ── STAGE CARDS GRID — responsive: 1 col mobile, 2 col tablet+ ── */}
//         {!loading && (
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
//             {stages.map((stage, idx) => (
//               <StageCard key={stage.key} stage={stage} idx={idx} onUpdate={handleUpdateStage} />
//             ))}
//           </div>
//         )}

//         {/* ── SAVE / RESET BAR ── */}
//         {!loading && (
//           <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 fade-up">
//             <div className="flex flex-col sm:flex-row items-stretch gap-3">
//               <button
//                 type="button"
//                 onClick={handleSave}
//                 disabled={saving}
//                 className="flex-1 flex items-center justify-center gap-2.5 px-8 py-3 rounded-xl
//                   bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-extrabold text-sm
//                   transition-all shadow-md shadow-blue-200 hover:shadow-lg hover:shadow-blue-300
//                   disabled:opacity-60 disabled:cursor-not-allowed"
//               >
//                 {saving ? (
//                   <>
//                     <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
//                     Saving Settings...
//                   </>
//                 ) : (
//                   <>
//                     <FiSave className="w-4 h-4" /> Save Settings
//                   </>
//                 )}
//               </button>

//               <button
//                 type="button"
//                 onClick={handleReset}
//                 disabled={saving}
//                 className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3
//                   rounded-xl border-2 border-slate-200 hover:border-slate-300 text-slate-600
//                   hover:text-slate-800 font-bold text-sm transition-all disabled:opacity-50
//                   bg-white hover:bg-slate-50"
//               >
//                 <FiRefreshCw className="w-4 h-4" /> Reset
//               </button>
//             </div>
//             <p className="text-center text-xs text-slate-400 mt-3 flex items-center justify-center gap-1.5">
//               <FiAlertCircle className="w-3.5 h-3.5" />
//               Changes apply to new leads entering each stage after saving.
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }




import { useState, useEffect, useCallback } from "react";                     
import { useNavigate } from "react-router-dom";
import {
  FiSave, FiRefreshCw, FiInfo, FiChevronDown, FiAlertCircle,
} from "react-icons/fi";
import { FaBell, FaUserPlus, FaPhoneAlt, FaUserCheck, FaFileInvoiceDollar,
  FaHandshake, FaMoneyBillWave, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import notificationSettingsService from "../services/notificationSettingsService";

/* ─── CONSTANTS ──────────────────────────────────────────────── */
const REMINDER_TYPES = [
  { value: "First_contact",    label: "First Contact"    },
  { value: "Follow_up",        label: "Follow Up"        },
  { value: "Quotation",        label: "Quotation"        },
  { value: "Payment_reminder", label: "Payment Reminder" },
  { value: "Document",         label: "Document"         },
  { value: "Confirmation",     label: "Confirmation"     },
  { value: "Custom",           label: "Custom"           },
];
const PRIORITIES = [
  { value: "High",   label: "High"   },
  { value: "Medium", label: "Medium" },
  { value: "Low",    label: "Low"    },
];

// Icon map — kept separate so we never send JSX to backend
const STAGE_ICONS = {
  new_lead:        <FaUserPlus        className="w-4 h-4" />,
  contacted:       <FaPhoneAlt        className="w-4 h-4" />,
  prospect:        <FaUserCheck       className="w-4 h-4" />,
  quotation_sent:  <FaFileInvoiceDollar className="w-4 h-4" />,
  in_negotiation:  <FaHandshake       className="w-4 h-4" />,
  payment_awaited: <FaMoneyBillWave   className="w-4 h-4" />,
  ready_to_book:   <FaCheckCircle     className="w-4 h-4" />,
  lost:            <FaTimesCircle     className="w-4 h-4" />,
};

// Default stage configuration — used as UI fallback if backend returns empty
const DEFAULT_STAGES = [
  { key:"new_lead",        stageLabel:"New Lead",        helperText:"When a lead is marked as New Lead",                    enabled:true,  reminderType:"First_contact",    hours:8,   priority:"High",   titleTemplate:"Contact New Lead: {lead_name}",      descTemplate:"New lead requires initial contact"          },
  { key:"contacted",       stageLabel:"Contacted",       helperText:"When a lead is marked as Contacted",                   enabled:true,  reminderType:"First_contact",    hours:24,  priority:"Medium", titleTemplate:"Follow-up Contact: {lead_name}",     descTemplate:"Follow-up required after initial contact"   },
  { key:"prospect",        stageLabel:"Prospect",        helperText:"When a lead is marked as Prospect",                    enabled:true,  reminderType:"First_contact",    hours:24,  priority:"Medium", titleTemplate:"Follow-up Prospect: {lead_name}",    descTemplate:"Prospect needs attention and follow-up"     },
  { key:"quotation_sent",  stageLabel:"Quotation Sent",  helperText:"When a quotation is sent to lead",                     enabled:true,  reminderType:"First_contact",    hours:48,  priority:"Medium", titleTemplate:"Follow-up Quotation: {lead_name}",   descTemplate:"Quotation sent - follow-up required"        },
  { key:"in_negotiation",  stageLabel:"In Negotiation",  helperText:"When lead enters negotiation stage",                   enabled:true,  reminderType:"First_contact",    hours:24,  priority:"Medium", titleTemplate:"Negotiation Follow-up: {lead_name}", descTemplate:"Lead in negotiation - check progress"       },
  { key:"payment_awaited", stageLabel:"Payment Awaited", helperText:"When payment is pending from customer",                enabled:true,  reminderType:"Payment_reminder", hours:12,  priority:"High",   titleTemplate:"Payment Follow-up: {lead_name}",     descTemplate:"Payment pending - follow-up required"       },
  { key:"ready_to_book",   stageLabel:"Ready to Book",   helperText:"When lead is ready to book",                           enabled:true,  reminderType:"First_contact",    hours:24,  priority:"Medium", titleTemplate:"Booking Follow-up: {lead_name}",     descTemplate:"Lead ready to book - close the deal"        },
  { key:"lost",            stageLabel:"Lost",            helperText:"When a lead is marked as lost (for revival attempts)", enabled:false, reminderType:"First_contact",    hours:168, priority:"Low",    titleTemplate:"Revival Attempt: {lead_name}",       descTemplate:"Attempt to revive lost lead"                },
];

// Merge backend data onto a default stage row — icon always comes from STAGE_ICONS, never backend
function mergeStage(defaultStage, backendRow) {
  if (!backendRow) return { ...defaultStage, icon: STAGE_ICONS[defaultStage.key] };
  return {
    ...defaultStage,
    icon:          STAGE_ICONS[defaultStage.key],       // always local JSX
    enabled:       backendRow.enabled       ?? defaultStage.enabled,
    reminderType:  backendRow.reminderType  ?? defaultStage.reminderType,
    hours:         backendRow.hours         ?? defaultStage.hours,
    priority:      backendRow.priority      ?? defaultStage.priority,
    titleTemplate: backendRow.titleTemplate ?? defaultStage.titleTemplate,
    descTemplate:  backendRow.descTemplate  ?? backendRow.descriptionTemplate ?? defaultStage.descTemplate,
  };
}

/* ─── TOAST ──────────────────────────────────────────────────── */
function Toast({ msg, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className={`fixed top-5 right-5 z-[999] flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl max-w-xs
      ${type === "success" ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800"}`}
      style={{ animation:"slideIn .3s ease both" }}>
      <span className="text-lg">{type === "success" ? "✅" : "❌"}</span>
      <p className="text-sm font-semibold flex-1">{msg}</p>
      <button onClick={onClose} className="opacity-50 hover:opacity-100 text-lg ml-1">×</button>
    </div>
  );
}

/* ─── TOGGLE SWITCH ──────────────────────────────────────────── */
function ToggleSwitch({ checked, onChange }) {
  return (
    <button type="button" onClick={() => onChange(!checked)}
      className={`relative inline-flex items-center h-5 w-9 rounded-full transition-colors duration-200 flex-shrink-0
        ${checked ? "bg-white/90" : "bg-white/30"}`}>
      <span className={`inline-block w-3.5 h-3.5 rounded-full shadow transform transition-transform duration-200
        ${checked ? "translate-x-[18px] bg-blue-600" : "translate-x-0.5 bg-white"}`} />
    </button>
  );
}

function Label({ children }) {
  return <label className="block text-xs font-extrabold text-slate-600 mb-1.5">{children}</label>;
}

const inputCls = () =>
  `w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder-slate-400
  focus:outline-none focus:ring-2 focus:border-blue-400 focus:ring-blue-50 transition-all bg-white
  disabled:bg-slate-50 disabled:text-slate-400`;

/* ─── PRIORITY STYLING ───────────────────────────────────────── */
const PRIORITY_CFG = {
  High:   { badge:"bg-red-100 text-red-700",     grad:"from-rose-500 to-red-600"    },
  Medium: { badge:"bg-amber-100 text-amber-700", grad:"from-blue-600 to-indigo-500" },
  Low:    { badge:"bg-slate-100 text-slate-600", grad:"from-slate-500 to-slate-600" },
};

/* ─── STAGE CARD ─────────────────────────────────────────────── */
function StageCard({ stage, onUpdate, idx }) {
  const update = (field, value) => onUpdate(stage.key, { ...stage, [field]: value });
  const pri = PRIORITY_CFG[stage.priority] || PRIORITY_CFG.Medium;

  return (
    <div className={`group relative bg-white rounded-2xl border overflow-hidden transition-all duration-300
        ${stage.enabled
          ? "border-slate-200/70 shadow-sm hover:shadow-xl hover:-translate-y-1"
          : "border-slate-200/70 shadow-sm opacity-70 hover:opacity-100"}`}
      style={{ animation:"fadeUp .4s ease both", animationDelay:`${idx * 40}ms` }}>

      {/* Header */}
      <div className={`relative px-4 sm:px-5 py-3.5 flex items-center justify-between gap-3 overflow-hidden
          ${stage.enabled ? `bg-gradient-to-r ${pri.grad}` : "bg-gradient-to-r from-slate-400 to-slate-500"}`}>
        {/* decorative blob */}
        <div className="absolute -right-6 -top-8 w-24 h-24 rounded-full bg-white/10 pointer-events-none group-hover:scale-110 transition-transform duration-500" />
        <div className="relative flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white flex-shrink-0 shadow-inner group-hover:scale-105 transition-transform">
            {stage.icon}
          </div>
          <h3 className="text-sm font-extrabold text-white truncate">{stage.stageLabel}</h3>
        </div>
        <div className="relative flex items-center gap-2 flex-shrink-0">
          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full
            ${stage.enabled ? "bg-white/25 text-white" : "bg-white/15 text-white/70"}`}>
            {stage.enabled ? "ON" : "OFF"}
          </span>
          <ToggleSwitch checked={stage.enabled} onChange={v => update("enabled", v)} />
        </div>
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        {/* helper text + priority pill */}
        <div className="flex items-start justify-between gap-2">
          <p className="text-xs text-slate-400 italic flex-1">{stage.helperText}</p>
          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full whitespace-nowrap ${pri.badge}`}>
            {stage.priority}
          </span>
        </div>

        {/* Reminder Type */}
        <div>
          <Label>Reminder Type</Label>
          <div className="relative">
            <select value={stage.reminderType} disabled={!stage.enabled}
              onChange={e => update("reminderType", e.target.value)}
              className={inputCls() + " pr-9 cursor-pointer appearance-none"}>
              {REMINDER_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
            <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Hours + Priority */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>Reminder After (Hours)</Label>
            <div className="relative">
              <input type="number" min="0" step="0.5" value={stage.hours} disabled={!stage.enabled}
                onChange={e => update("hours", parseFloat(e.target.value) || 0)}
                className={inputCls() + " pr-12"} />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-extrabold text-slate-400 uppercase pointer-events-none">hrs</span>
            </div>
          </div>
          <div>
            <Label>Priority</Label>
            <div className="relative">
              <select value={stage.priority} disabled={!stage.enabled}
                onChange={e => update("priority", e.target.value)}
                className={inputCls() + " pr-9 cursor-pointer appearance-none"}>
                {PRIORITIES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Title Template */}
        <div>
          <Label>Title Template</Label>
          <input type="text" value={stage.titleTemplate} disabled={!stage.enabled}
            onChange={e => update("titleTemplate", e.target.value)} className={inputCls()} />
          <p className="mt-1 text-xs text-slate-400">
            Use <code className="text-blue-500 font-semibold bg-blue-50 px-1 rounded">{"{lead_name}"}</code> to include the lead's name
          </p>
        </div>

        {/* Description Template */}
        <div>
          <Label>Description Template</Label>
          <textarea rows={2} value={stage.descTemplate} disabled={!stage.enabled}
            onChange={e => update("descTemplate", e.target.value)}
            className={inputCls() + " resize-none"} />
        </div>
      </div>
    </div>
  );
}

/* ─── MAIN PAGE ──────────────────────────────────────────────── */
export default function NotificationSettings() {
  const navigate = useNavigate();

  const [stages,  setStages]  = useState(() => DEFAULT_STAGES.map(d => mergeStage(d, null)));
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [toast,   setToast]   = useState(null);

  const showToast = useCallback((msg, type = "success") => setToast({ msg, type }), []);

  /* ── LOAD from backend ── */
  useEffect(() => {
    setLoading(true);
    notificationSettingsService.getAll()
      .then(res => {
        // Handle ApiResponse wrapper: { data: [...] } OR plain array
        const raw = res.data?.data ?? res.data;
        const list = Array.isArray(raw) ? raw : [];

        if (list.length > 0) {
          // Build lookup by key — handles backend key names
          const byKey = {};
          list.forEach(row => {
            const k = row.key || row.stageKey || row.stage_key;
            if (k) byKey[k] = row;
          });
          setStages(DEFAULT_STAGES.map(d => mergeStage(d, byKey[d.key])));
        } else {
          // Backend returned empty → keep defaults with icons
          setStages(DEFAULT_STAGES.map(d => mergeStage(d, null)));
        }
      })
      .catch(err => {
        console.warn("Notification settings: backend unavailable, using defaults.", err?.message);
        // Don't show error toast — page works with defaults
        setStages(DEFAULT_STAGES.map(d => mergeStage(d, null)));
      })
      .finally(() => setLoading(false));
  }, []);

  const handleUpdateStage = useCallback((key, updatedStage) => {
    setStages(prev => prev.map(s => s.key === key ? updatedStage : s));
  }, []);

  /* ── SAVE to backend ── */
  const handleSave = async () => {
    setSaving(true);
    try {
      // Strip icon JSX — only send serialisable fields
      const payload = stages.map(({ key, enabled, reminderType, hours, priority, titleTemplate, descTemplate }) =>
        ({ key, enabled, reminderType, hours, priority, titleTemplate, descTemplate })
      );
      await notificationSettingsService.updateAll(payload);
      showToast("Notification settings saved successfully! ✅");
    } catch (err) {
      console.error("Save notification settings:", err);
      showToast(err?.response?.data?.message || "Failed to save settings.", "error");
    } finally {
      setSaving(false);
    }
  };

  /* ── RESET ── */
  const handleReset = useCallback(async () => {
    // Try backend reset first; fall back to local defaults
    try {
      const res = await notificationSettingsService.resetToDefaults();
      const raw  = res.data?.data ?? res.data;
      const list = Array.isArray(raw) ? raw : [];
      if (list.length > 0) {
        const byKey = {};
        list.forEach(row => { const k = row.key||row.stageKey; if(k) byKey[k]=row; });
        setStages(DEFAULT_STAGES.map(d => mergeStage(d, byKey[d.key])));
      } else {
        setStages(DEFAULT_STAGES.map(d => mergeStage(d, null)));
      }
    } catch {
      // Backend reset not available — reset locally
      setStages(DEFAULT_STAGES.map(d => mergeStage(d, null)));
    }
    showToast("Settings reset to defaults.");
  }, [showToast]);

  /* ── Summary counts for the stats strip ── */
  const activeCount   = stages.filter(s => s.enabled).length;
  const highCount     = stages.filter(s => s.enabled && s.priority === "High").length;
  const disabledCount = stages.length - activeCount;
  const SUMMARY = [
    { label:"Total Stages", value:stages.length, grad:"from-blue-600 to-indigo-600",  icon:<FaBell className="w-4 h-4"/> },
    { label:"Active",       value:activeCount,   grad:"from-emerald-500 to-green-600", icon:<FaCheckCircle className="w-4 h-4"/> },
    { label:"High Priority",value:highCount,     grad:"from-rose-500 to-red-600",      icon:<FaMoneyBillWave className="w-4 h-4"/> },
    { label:"Disabled",     value:disabledCount, grad:"from-slate-500 to-slate-600",   icon:<FaTimesCircle className="w-4 h-4"/> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-100"
      style={{ fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        @keyframes slideIn { from{transform:translateX(110%);opacity:0} to{transform:translateX(0);opacity:1} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        select { -webkit-appearance:none; appearance:none; }
        ::-webkit-scrollbar{width:5px;height:5px}
        ::-webkit-scrollbar-track{background:#f1f5f9;border-radius:99px}
        ::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:99px}
      `}</style>

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* PAGE HEADER */}
      <div className="bg-white/70 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white text-xl shadow-lg shadow-blue-200 flex-shrink-0">
              <FaBell className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">Notification Settings</h1>
              <p className="text-sm text-slate-400 mt-0.5">
                Configure Automatic Reminder Settings
                <span className="hidden sm:inline mx-3 text-slate-300">|</span>
                <span className="hidden sm:inline">
                  <span className="hover:text-blue-600 cursor-pointer" onClick={() => navigate("/")}>Home</span>
                  <span className="mx-1 text-slate-300">/</span>
                  <span className="hover:text-blue-600 cursor-pointer" onClick={() => navigate("/Settings")}>Settings</span>
                  <span className="mx-1 text-slate-300">/</span>
                  <span className="text-blue-600 font-bold">Notifications</span>
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6 space-y-5">

        {/* INFO BANNER */}
        <div className="bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl px-5 py-4 flex items-start gap-3 shadow-sm"
          style={{ animation:"fadeUp .4s ease both" }}>
          <FiInfo className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
          <p className="text-sm text-white leading-relaxed">
            <span className="font-extrabold">How it works:</span> When a lead's stage changes,
            the system automatically creates a reminder after the specified time.
            Use <code className="bg-white/20 px-1.5 py-0.5 rounded font-mono text-xs">{"{lead_name}"}</code> in templates.
          </p>
        </div>

        {/* SUMMARY STATS */}
        {!loading && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {SUMMARY.map((s, i) => (
              <div key={s.label}
                className={`bg-gradient-to-br ${s.grad} rounded-2xl p-4 text-white relative overflow-hidden
                  shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 ring-1 ring-white/10`}
                style={{ animation:"fadeUp .4s ease both", animationDelay:`${i * 50}ms` }}>
                <div className="absolute inset-x-0 -top-1/2 h-full bg-gradient-to-b from-white/20 to-transparent opacity-60 pointer-events-none" />
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-2xl sm:text-3xl font-extrabold leading-none">{s.value}</p>
                    <p className="text-[10px] font-extrabold uppercase tracking-widest opacity-80 mt-1.5">{s.label}</p>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">{s.icon}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SKELETON */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                <div className="h-12 bg-slate-200 animate-pulse" />
                <div className="p-5 space-y-3">
                  {[...Array(3)].map((_,j) => <div key={j} className="h-9 rounded-xl bg-slate-200 animate-pulse" />)}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* STAGE CARDS */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
            {stages.map((stage, idx) => (
              <StageCard key={stage.key} stage={stage} idx={idx} onUpdate={handleUpdateStage} />
            ))}
          </div>
        )}

        {/* SAVE / RESET BAR */}
        {!loading && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/70 p-4 sm:p-5"
            style={{ animation:"fadeUp .4s ease both" }}>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <p className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-slate-500 flex-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                {activeCount} of {stages.length} stages active
              </p>
              <button type="button" onClick={handleReset} disabled={saving}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3
                  rounded-xl border-2 border-slate-200 hover:border-slate-300 text-slate-600
                  hover:text-slate-800 font-bold text-sm transition-all disabled:opacity-50 bg-white hover:bg-slate-50">
                <FiRefreshCw className="w-4 h-4" /> Reset
              </button>
              <button type="button" onClick={handleSave} disabled={saving}
                className="flex-1 sm:flex-none sm:min-w-[200px] flex items-center justify-center gap-2.5 px-8 py-3 rounded-xl
                  bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-sm
                  transition-all shadow-md shadow-blue-200 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed">
                {saving
                  ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Saving…</>
                  : <><FiSave className="w-4 h-4" /> Save Settings</>}
              </button>
            </div>
            <p className="text-center sm:text-left text-xs text-slate-400 mt-3 flex items-center justify-center sm:justify-start gap-1.5">
              <FiAlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              Changes apply to new leads entering each stage after saving.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}