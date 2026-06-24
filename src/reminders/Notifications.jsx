// // src/components/Notifications/Notifications.jsx
// // ─────────────────────────────────────────────────────────────
// // Notifications Page — Travel CRM
// // Matches: Reminders.jsx / BookingReminders.jsx design system
// // Font: Plus Jakarta Sans | Tailwind CSS | React Icons
// // Reference: reminders/notifications.php screenshot
// // ─────────────────────────────────────────────────────────────

// import { useState, useMemo, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   FiBell, FiMail, FiClock, FiAlertTriangle, FiCheck, FiCheckCircle,
//   FiTrash2, FiRefreshCw, FiFilter, FiX, FiUser, FiDollarSign,
//   FiCalendar, FiAlertCircle, FiBellOff,
// } from "react-icons/fi";
// import {
//   FaWhatsapp, FaPlane, FaMoneyBillWave, FaPassport,
//   FaFileInvoiceDollar, FaExclamationCircle,
// } from "react-icons/fa";
// import { MdOutlineMarkEmailRead } from "react-icons/md";

// // ── Uncomment when backend is ready ──────────────────────────
// // import notificationService from "../services/notificationService";

// /* ─── MOCK DATA ──────────────────────────────────────────────── */
// function minsAgo(m)  { const dt = new Date(); dt.setMinutes(dt.getMinutes() - m); return dt.toISOString(); }
// function hoursAgo(h) { const dt = new Date(); dt.setHours(dt.getHours() - h); return dt.toISOString(); }
// function daysAgo(d)  { const dt = new Date(); dt.setDate(dt.getDate() - d); return dt.toISOString(); }

// const MOCK_NOTIFICATIONS = [
//   { id:1,  category:"Reminder_alert", title:"Overdue Reminder: Pratik",          message:"Contact New Lead reminder is overdue by 13 days 18 hours.",            isRead:false, isEscalated:false, createdAt:minsAgo(8),  link:"/Reminders" },
//   { id:2,  category:"Escalation",     title:"Escalation: Priyanshu Agrawal",     message:"Lead follow-up overdue by 10+ days — escalated to manager.",            isRead:false, isEscalated:true,  createdAt:minsAgo(20), link:"/Reminders" },
//   { id:3,  category:"Payment",        title:"Payment Received — BK10003",        message:"₹52,250 balance payment received from Priya Mehta.",                    isRead:false, isEscalated:false, createdAt:hoursAgo(1), link:"/BookingReminders" },
//   { id:4,  category:"Reminder_alert", title:"Reminder Due Soon: Vikram Singh",   message:"Send Quotation reminder is due in 2 hours.",                             isRead:false, isEscalated:false, createdAt:hoursAgo(2), link:"/Reminders" },
//   { id:5,  category:"System",        title:"Subscription Renewal",              message:"Your Dolphin Plan subscription renews in 5 days.",                      isRead:true,  isEscalated:false, createdAt:hoursAgo(5), link:"/Settings" },
//   { id:6,  category:"Document",      title:"Visa Document Pending: Rohit Khanna",message:"Passport copy still pending for Japan visa application.",               isRead:true,  isEscalated:false, createdAt:hoursAgo(8), link:"/BookingReminders" },
//   { id:7,  category:"Escalation",     title:"Escalation: Anushka Narkhede",      message:"First contact reminder overdue by 5+ days — escalated.",                isRead:true,  isEscalated:true,  createdAt:daysAgo(1),  link:"/Reminders" },
//   { id:8,  category:"Payment",        title:"Payment Due Reminder Sent",         message:"Reminder sent to Arjun Sharma for Maldives booking balance.",           isRead:true,  isEscalated:false, createdAt:daysAgo(1),  link:"/BookingReminders" },
//   { id:9,  category:"Reminder_alert", title:"New Lead Assigned: Sachin",         message:"A new lead reminder has been created and assigned to you.",             isRead:true,  isEscalated:false, createdAt:daysAgo(2),  link:"/Reminders" },
//   { id:10, category:"System",        title:"Weekly Summary Ready",              message:"Your weekly performance summary report is ready to view.",             isRead:true,  isEscalated:false, createdAt:daysAgo(3),  link:"/Reports" },
//   { id:11, category:"Document",      title:"Bhutan Permit Deadline",            message:"Deepak Mishra's visa permit application deadline in 3 days.",           isRead:true,  isEscalated:false, createdAt:daysAgo(4),  link:"/BookingReminders" },
//   { id:12, category:"Escalation",     title:"Escalation: Meera Reddy",           message:"Follow-up snoozed twice without resolution — escalated to team lead.", isRead:true,  isEscalated:true,  createdAt:daysAgo(6),  link:"/Reminders" },
// ];

// const CATEGORY_CFG = {
//   Reminder_alert: { label:"Reminder Alert", icon:<FiClock className="w-4 h-4"/>,             bg:"bg-blue-100",   text:"text-blue-700",   iconBg:"bg-blue-500"   },
//   Escalation:     { label:"Escalation",     icon:<FaExclamationCircle className="w-4 h-4"/>, bg:"bg-red-100",    text:"text-red-700",    iconBg:"bg-red-500"    },
//   Payment:        { label:"Payment",        icon:<FaMoneyBillWave className="w-4 h-4"/>,     bg:"bg-green-100",  text:"text-green-700",  iconBg:"bg-green-500"  },
//   Document:       { label:"Document",       icon:<FaPassport className="w-4 h-4"/>,          bg:"bg-amber-100",  text:"text-amber-700",  iconBg:"bg-amber-500"  },
//   System:         { label:"System",         icon:<FiBell className="w-4 h-4"/>,              bg:"bg-slate-100",  text:"text-slate-600",  iconBg:"bg-slate-500"  },
// };

// const FILTERS = ["All Notifications", "Unread", "Reminder Alerts", "Escalations"];

// /* ─── HELPERS ────────────────────────────────────────────────── */
// function timeAgo(dateStr) {
//   const now  = new Date();
//   const date = new Date(dateStr);
//   const diffMs = now - date;
//   const mins  = Math.floor(diffMs / 60000);
//   const hours = Math.floor(mins / 60);
//   const days  = Math.floor(hours / 24);
//   if (mins < 1)   return "Just now";
//   if (mins < 60)  return `${mins} min${mins !== 1 ? "s" : ""} ago`;
//   if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
//   if (days < 7)   return `${days} day${days !== 1 ? "s" : ""} ago`;
//   return new Date(dateStr).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" });
// }

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

// /* ─── ANIMATED NUMBER ────────────────────────────────────────── */
// function AnimNum({ target }) {
//   const [v, setV] = useState(0);
//   useEffect(() => {
//     if (target === 0) { setV(0); return; }
//     let s = 0; const step = Math.max(1, Math.ceil(target / 40));
//     const iv = setInterval(() => { s = Math.min(s + step, target); setV(s); if (s >= target) clearInterval(iv); }, 20);
//     return () => clearInterval(iv);
//   }, [target]);
//   return <span>{v}</span>;
// }

// /* ─── DELETE CONFIRM ─────────────────────────────────────────── */
// function DeleteConfirm({ item, onClose, onConfirm }) {
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && onClose()}>
//       <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
//       <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm z-10 p-6 text-center">
//         <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-3xl mx-auto mb-4">🗑️</div>
//         <h3 className="text-lg font-extrabold text-slate-800 mb-1">Delete Notification?</h3>
//         <p className="text-sm text-slate-500 mb-5">
//           Remove <span className="font-bold text-slate-700">"{item?.title}"</span>? This cannot be undone.
//         </p>
//         <div className="flex gap-3">
//           <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border-2 border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all">Cancel</button>
//           <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md shadow-red-200 transition-all">Yes, Delete</button>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ─── NOTIFICATION ROW ───────────────────────────────────────── */
// function NotificationRow({ item, onMarkRead, onDelete, onNavigate, idx }) {
//   const cfg = CATEGORY_CFG[item.category] || CATEGORY_CFG.System;

//   return (
//     <div
//       className={`flex items-start gap-4 px-5 py-4 transition-all duration-150 cursor-pointer group
//         hover:bg-blue-50/40 hover:shadow-[inset_3px_0_0_#2563eb]
//         ${!item.isRead ? "bg-blue-50/30" : "bg-white"}`}
//       style={{ animation: "fadeUp .35s ease both", animationDelay: `${idx * 30}ms` }}
//       onClick={() => onNavigate(item)}
//     >
//       {/* Icon */}
//       <div className={`w-10 h-10 rounded-xl ${cfg.iconBg} flex items-center justify-center text-white flex-shrink-0 shadow-sm`}>
//         {cfg.icon}
//       </div>

//       {/* Content */}
//       <div className="flex-1 min-w-0">
//         <div className="flex items-start justify-between gap-2">
//           <div className="flex items-center gap-2 flex-wrap">
//             <p className={`text-sm leading-snug ${!item.isRead ? "font-extrabold text-slate-800" : "font-bold text-slate-600"}`}>
//               {item.title}
//             </p>
//             {!item.isRead && <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />}
//           </div>
//           <span className="text-xs text-slate-400 flex-shrink-0 whitespace-nowrap">{timeAgo(item.createdAt)}</span>
//         </div>
//         <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{item.message}</p>
//         <div className="flex items-center gap-2 mt-2">
//           <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.text}`}>{cfg.label}</span>
//           {item.isEscalated && (
//             <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700 flex items-center gap-1">
//               <FiAlertTriangle className="w-3 h-3" /> Escalated
//             </span>
//           )}
//         </div>
//       </div>

//       {/* Actions */}
//       <div className="flex items-center gap-1.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
//         onClick={(e) => e.stopPropagation()}>
//         {!item.isRead && (
//           <button onClick={() => onMarkRead(item.id)} title="Mark as read"
//             className="w-8 h-8 rounded-lg bg-green-50 hover:bg-green-100 text-green-600 flex items-center justify-center text-sm transition-all">
//             <FiCheck />
//           </button>
//         )}
//         <button onClick={() => onDelete(item)} title="Delete"
//           className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-600 flex items-center justify-center text-sm transition-all">
//           <FiTrash2 />
//         </button>
//       </div>
//     </div>
//   );
// }

// /* ─── MAIN PAGE ──────────────────────────────────────────────── */
// export default function Notifications() {
//   const navigate = useNavigate();

//   const [notifications, setNotifications] = useState([]);
//   const [filter,   setFilter]   = useState("All Notifications");
//   const [loading,  setLoading]  = useState(true);
//   const [toast,    setToast]    = useState(null);
//   const [delItem,  setDelItem]  = useState(null);

//   useEffect(() => {
//     setLoading(true);
//     // BACKEND: replace with real API call
//     // notificationService.getAll()
//     //   .then(res => setNotifications(res.data))
//     //   .catch(() => showToast("Failed to load notifications.", "error"))
//     //   .finally(() => setLoading(false));

//     // MOCK loader (remove when backend connected)
//     const t = setTimeout(() => {
//       setNotifications(MOCK_NOTIFICATIONS);
//       setLoading(false);
//     }, 700);
//     return () => clearTimeout(t);
//   }, []);

//   const showToast = (msg, type = "success") => setToast({ msg, type });

//   /* stats */
//   const stats = useMemo(() => ({
//     total:      notifications.length,
//     unread:     notifications.filter(n => !n.isRead).length,
//     reminders:  notifications.filter(n => n.category === "Reminder_alert").length,
//     escalations:notifications.filter(n => n.isEscalated).length,
//   }), [notifications]);

//   /* filter */
//   const filtered = useMemo(() => {
//     let out = [...notifications];
//     if (filter === "Unread")           out = out.filter(n => !n.isRead);
//     if (filter === "Reminder Alerts")  out = out.filter(n => n.category === "Reminder_alert");
//     if (filter === "Escalations")      out = out.filter(n => n.isEscalated);
//     out.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
//     return out;
//   }, [notifications, filter]);

//   const anyFilter = filter !== "All Notifications";

//   /* handlers */
//   const handleMarkRead = (id) => {
//     setNotifications(p => p.map(n => n.id === id ? { ...n, isRead: true } : n));
//     // BACKEND: notificationService.markRead(id).catch(() => showToast("Failed to update.", "error"));
//   };

//   const handleMarkAllRead = () => {
//     setNotifications(p => p.map(n => ({ ...n, isRead: true })));
//     showToast("All notifications marked as read. ✅");
//     // BACKEND: notificationService.markAllRead().catch(() => showToast("Failed to update.", "error"));
//   };

//   const handleDelete = () => {
//     setNotifications(p => p.filter(n => n.id !== delItem.id));
//     showToast("Notification deleted.");
//     setDelItem(null);
//     // BACKEND: notificationService.delete(delItem.id).catch(() => showToast("Failed to delete.", "error"));
//   };

//   const handleClearAll = () => {
//     setNotifications([]);
//     showToast("All notifications cleared.");
//     // BACKEND: notificationService.clearAll().catch(() => showToast("Failed to clear.", "error"));
//   };

//   const handleNavigate = (item) => {
//     if (!item.isRead) handleMarkRead(item.id);
//     if (item.link) navigate(item.link);
//   };

//   const resetFilters = () => setFilter("All Notifications");

//   const STAT_CARDS = [
//     { gradient:"from-cyan-500 to-cyan-600",  icon:<FiBell className="w-5 h-5"/>,            label:"Total Notifications", value:stats.total       },
//     { gradient:"from-amber-500 to-orange-500",icon:<FiMail className="w-5 h-5"/>,           label:"Unread",              value:stats.unread      },
//     { gradient:"from-blue-500 to-blue-600",  icon:<FiClock className="w-5 h-5"/>,           label:"Reminder Alerts",     value:stats.reminders   },
//     { gradient:"from-red-500 to-red-600",    icon:<FiAlertTriangle className="w-5 h-5"/>,   label:"Escalations",         value:stats.escalations },
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-100"
//       style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
//         @keyframes slideIn { from{transform:translateX(110%);opacity:0} to{transform:translateX(0);opacity:1} }
//         @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
//         .fade-up { animation: fadeUp .4s ease both; }
//         select { -webkit-appearance:none; appearance:none; }
//         ::-webkit-scrollbar{width:5px;height:5px}
//         ::-webkit-scrollbar-track{background:#f1f5f9;border-radius:99px}
//         ::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:99px}
//       `}</style>

//       {toast   && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
//       {delItem && <DeleteConfirm item={delItem} onClose={() => setDelItem(null)} onConfirm={handleDelete} />}

//       {/* ── PAGE HEADER ── */}
//       <div className="bg-white/70 backdrop-blur-md border-b border-slate-100">
//         <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-5">
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//             <div className="flex items-center gap-4">
//               <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white text-xl shadow-lg shadow-blue-200">
//                 <FiBell className="w-5 h-5" />
//               </div>
//               <div>
//                 <h1 className="text-xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
//                   Notifications
//                   {stats.unread > 0 && (
//                     <span className="text-xs bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-full">{stats.unread} unread</span>
//                   )}
//                 </h1>
//                 <p className="text-sm text-slate-400 mt-0.5">
//                   Stay on top of reminders, escalations & system alerts
//                   <span className="hidden sm:inline ml-3 text-slate-300">|</span>
//                   <span className="hidden sm:inline ml-3">
//                     <span className="hover:text-blue-600 cursor-pointer transition-colors" onClick={() => navigate("/")}>Home</span>
//                     <span className="mx-1 text-slate-300">/</span>
//                     <span className="hover:text-blue-600 cursor-pointer transition-colors" onClick={() => navigate("/Reminders")}>Reminders</span>
//                     <span className="mx-1 text-slate-300">/</span>
//                     <span className="text-blue-600 font-bold">Notifications</span>
//                   </span>
//                 </p>
//               </div>
//             </div>

//             <div className="flex items-center gap-2 flex-wrap">
//               {stats.unread > 0 && (
//                 <button onClick={handleMarkAllRead}
//                   className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-green-200 hover:border-green-400
//                     bg-green-50 hover:bg-green-100 text-green-700 text-sm font-bold transition-all">
//                   <MdOutlineMarkEmailRead className="w-4 h-4" /> Mark All Read
//                 </button>
//               )}
//               {notifications.length > 0 && (
//                 <button onClick={handleClearAll}
//                   className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:border-red-300
//                     bg-white hover:bg-red-50 text-slate-500 hover:text-red-600 text-sm font-bold transition-all">
//                   <FiTrash2 className="w-4 h-4" /> Clear All
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6 space-y-6">

//         {/* ── STAT CARDS ── */}
//         <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
//           {STAT_CARDS.map((card, i) => (
//             <div key={card.label}
//               className={`bg-gradient-to-br ${card.gradient} rounded-2xl p-5 text-white shadow-lg relative overflow-hidden group
//                 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 cursor-pointer fade-up`}
//               style={{ animationDelay: `${i * 60}ms` }}>
//               <div className="absolute -right-5 -top-5 w-24 h-24 rounded-full bg-white/10 group-hover:scale-110 transition-transform" />
//               <div className="absolute -right-3 -bottom-8 w-32 h-32 rounded-full bg-white/10" />
//               <div className="relative z-10">
//                 <div className="flex items-start justify-between mb-3">
//                   <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">{card.icon}</div>
//                 </div>
//                 <p className="text-2xl sm:text-3xl font-extrabold leading-none mb-1">
//                   <AnimNum target={card.value} />
//                 </p>
//                 <p className="text-xs font-bold uppercase tracking-widest opacity-80">{card.label}</p>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* ── NOTIFICATIONS LIST CARD ── */}
//         <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">

//           {/* List header + filter tabs */}
//           <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
//             <h2 className="text-base font-extrabold text-slate-700">All Notifications</h2>
//             <div className="flex items-center gap-2 flex-wrap">
//               <div className="flex rounded-xl border border-slate-200 overflow-hidden flex-wrap">
//                 {FILTERS.map(f => (
//                   <button key={f} onClick={() => setFilter(f)}
//                     className={`px-3.5 py-2 text-xs font-bold transition-all whitespace-nowrap
//                       ${filter === f ? "bg-blue-600 text-white" : "bg-white text-slate-500 hover:bg-slate-50"}`}>
//                     {f}
//                   </button>
//                 ))}
//               </div>
//               <button onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 600); }}
//                 className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-blue-600 font-semibold transition-colors px-2">
//                 <FiRefreshCw className="w-3.5 h-3.5" />
//               </button>
//             </div>
//           </div>

//           {/* ── SKELETON ── */}
//           {loading && (
//             <div className="divide-y divide-slate-50">
//               {[...Array(5)].map((_, i) => (
//                 <div key={i} className="flex items-start gap-4 px-5 py-4">
//                   <div className="w-10 h-10 rounded-xl bg-slate-200 animate-pulse flex-shrink-0" />
//                   <div className="flex-1 space-y-2">
//                     <div className="h-4 rounded-lg bg-slate-200 animate-pulse w-1/3" />
//                     <div className="h-3 rounded-lg bg-slate-200 animate-pulse w-2/3" />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* ── EMPTY STATE (matches reference screenshot) ── */}
//           {!loading && filtered.length === 0 && (
//             <div className="py-20 text-center fade-up">
//               <FiBellOff className="w-12 h-12 text-slate-300 mx-auto mb-4" />
//               <p className="text-lg font-extrabold text-slate-600 mb-1">No Notifications</p>
//               <p className="text-sm text-slate-400">
//                 {anyFilter ? "No notifications matching the current filter." : "You don't have any notifications yet."}
//               </p>
//               {anyFilter && (
//                 <button onClick={resetFilters} className="mt-5 px-4 py-2 rounded-xl bg-blue-50 text-blue-600 font-bold text-sm hover:bg-blue-100 transition-all">
//                   Clear Filter
//                 </button>
//               )}
//             </div>
//           )}

//           {/* ── LIST ── */}
//           {!loading && filtered.length > 0 && (
//             <div className="divide-y divide-slate-50">
//               {filtered.map((item, idx) => (
//                 <NotificationRow
//                   key={item.id} item={item} idx={idx}
//                   onMarkRead={handleMarkRead}
//                   onDelete={setDelItem}
//                   onNavigate={handleNavigate}
//                 />
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }



// src/components/Notifications/Notifications.jsx
// ─────────────────────────────────────────────────────────────
// Notifications Page — Travel CRM
// Matches: Reminders.jsx / BookingReminders.jsx design system
// Font: Plus Jakarta Sans | Tailwind CSS | React Icons
// Reference: reminders/notifications.php screenshot
// ─────────────────────────────────────────────────────────────

import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiBell, FiMail, FiClock, FiAlertTriangle, FiCheck, FiCheckCircle,
  FiTrash2, FiRefreshCw, FiFilter, FiX, FiUser, FiDollarSign,
  FiCalendar, FiAlertCircle, FiBellOff,
} from "react-icons/fi";
import {
  FaWhatsapp, FaPlane, FaMoneyBillWave, FaPassport,
  FaFileInvoiceDollar, FaExclamationCircle,
} from "react-icons/fa";
import { MdOutlineMarkEmailRead } from "react-icons/md";

import notificationService from "../services/notificationService";

/* ─── MOCK DATA ──────────────────────────────────────────────── */
function minsAgo(m)  { const dt = new Date(); dt.setMinutes(dt.getMinutes() - m); return dt.toISOString(); }
function hoursAgo(h) { const dt = new Date(); dt.setHours(dt.getHours() - h); return dt.toISOString(); }
function daysAgo(d)  { const dt = new Date(); dt.setDate(dt.getDate() - d); return dt.toISOString(); }


const CATEGORY_CFG = {
  Reminder_alert: { label:"Reminder Alert", icon:<FiClock className="w-4 h-4"/>,             bg:"bg-blue-100",   text:"text-blue-700",   iconBg:"bg-blue-500"   },
  Escalation:     { label:"Escalation",     icon:<FaExclamationCircle className="w-4 h-4"/>, bg:"bg-red-100",    text:"text-red-700",    iconBg:"bg-red-500"    },
  Payment:        { label:"Payment",        icon:<FaMoneyBillWave className="w-4 h-4"/>,     bg:"bg-green-100",  text:"text-green-700",  iconBg:"bg-green-500"  },
  Document:       { label:"Document",       icon:<FaPassport className="w-4 h-4"/>,          bg:"bg-amber-100",  text:"text-amber-700",  iconBg:"bg-amber-500"  },
  System:         { label:"System",         icon:<FiBell className="w-4 h-4"/>,              bg:"bg-slate-100",  text:"text-slate-600",  iconBg:"bg-slate-500"  },
};

const FILTERS = ["All Notifications", "Unread", "Reminder Alerts", "Escalations"];

/* ─── HELPERS ────────────────────────────────────────────────── */
function timeAgo(dateStr) {
  const now  = new Date();
  const date = new Date(dateStr);
  const diffMs = now - date;
  const mins  = Math.floor(diffMs / 60000);
  const hours = Math.floor(mins / 60);
  const days  = Math.floor(hours / 24);
  if (mins < 1)   return "Just now";
  if (mins < 60)  return `${mins} min${mins !== 1 ? "s" : ""} ago`;
  if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  if (days < 7)   return `${days} day${days !== 1 ? "s" : ""} ago`;
  return new Date(dateStr).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" });
}

/* ─── TOAST ──────────────────────────────────────────────────── */
function Toast({ msg, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className={`fixed top-5 right-5 z-[999] flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl max-w-xs
      ${type === "success" ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800"}`}
      style={{ animation: "slideIn .3s ease both" }}>
      <span className="text-lg">{type === "success" ? "✅" : "❌"}</span>
      <p className="text-sm font-semibold flex-1">{msg}</p>
      <button onClick={onClose} className="opacity-50 hover:opacity-100 text-lg ml-1">×</button>
    </div>
  );
}

/* ─── ANIMATED NUMBER ────────────────────────────────────────── */
function AnimNum({ target }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (target === 0) { setV(0); return; }
    let s = 0; const step = Math.max(1, Math.ceil(target / 40));
    const iv = setInterval(() => { s = Math.min(s + step, target); setV(s); if (s >= target) clearInterval(iv); }, 20);
    return () => clearInterval(iv);
  }, [target]);
  return <span>{v}</span>;
}

/* ─── DELETE CONFIRM ─────────────────────────────────────────── */
function DeleteConfirm({ item, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm z-10 p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-3xl mx-auto mb-4">🗑️</div>
        <h3 className="text-lg font-extrabold text-slate-800 mb-1">Delete Notification?</h3>
        <p className="text-sm text-slate-500 mb-5">
          Remove <span className="font-bold text-slate-700">"{item?.title}"</span>? This cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border-2 border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all">Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md shadow-red-200 transition-all">Yes, Delete</button>
        </div>
      </div>
    </div>
  );
}

/* ─── NOTIFICATION ROW ───────────────────────────────────────── */
function NotificationRow({ item, onMarkRead, onDelete, onNavigate, idx }) {
  const cfg = CATEGORY_CFG[item.category] || CATEGORY_CFG.System;

  return (
    <div
      className={`flex items-start gap-4 px-5 py-4 transition-all duration-150 cursor-pointer group
        hover:bg-blue-50/40 hover:shadow-[inset_3px_0_0_#2563eb]
        ${!item.isRead ? "bg-blue-50/30" : "bg-white"}`}
      style={{ animation: "fadeUp .35s ease both", animationDelay: `${idx * 30}ms` }}
      onClick={() => onNavigate(item)}
    >
      {/* Icon */}
      <div className={`w-10 h-10 rounded-xl ${cfg.iconBg} flex items-center justify-center text-white flex-shrink-0 shadow-sm`}>
        {cfg.icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <p className={`text-sm leading-snug ${!item.isRead ? "font-extrabold text-slate-800" : "font-bold text-slate-600"}`}>
              {item.title}
            </p>
            {!item.isRead && <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />}
          </div>
          <span className="text-xs text-slate-400 flex-shrink-0 whitespace-nowrap">{timeAgo(item.createdAt)}</span>
        </div>
        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{item.message}</p>
        <div className="flex items-center gap-2 mt-2">
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.text}`}>{cfg.label}</span>
          {item.isEscalated && (
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700 flex items-center gap-1">
              <FiAlertTriangle className="w-3 h-3" /> Escalated
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => e.stopPropagation()}>
        {!item.isRead && (
          <button onClick={() => onMarkRead(item.id)} title="Mark as read"
            className="w-8 h-8 rounded-lg bg-green-50 hover:bg-green-100 text-green-600 flex items-center justify-center text-sm transition-all">
            <FiCheck />
          </button>
        )}
        <button onClick={() => onDelete(item)} title="Delete"
          className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-600 flex items-center justify-center text-sm transition-all">
          <FiTrash2 />
        </button>
      </div>
    </div>
  );
}

/* ─── MAIN PAGE ──────────────────────────────────────────────── */
export default function Notifications() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [filter,   setFilter]   = useState("All Notifications");
  const [loading,  setLoading]  = useState(true);
  const [toast,    setToast]    = useState(null);
  const [delItem,  setDelItem]  = useState(null);

  useEffect(() => {
    setLoading(true);
    // Map the backend's free-form `type` onto the page's category vocabulary
    // so the existing CATEGORY_CFG styling always resolves.
    const toCategory = (type) => {
      const t = (type || "").toUpperCase();
      if (t.includes("ESCALAT")) return "Escalation";
      if (t.includes("PAYMENT")) return "Payment";
      if (t.includes("DOCUMENT") || t.includes("VISA")) return "Document";
      if (t.includes("REMIND") || t.includes("LEAD")) return "Reminder_alert";
      return "System";
    };
    notificationService.getNotifications({ page: 0, size: 50 })
      .then((res) => {
        const items = (res.content || []).map((n) => {
          const category = toCategory(n.type);
          return {
            id:          n.publicId,
            title:       n.title,
            message:     n.message,
            category,
            isRead:      n.status === "READ",
            isEscalated: category === "Escalation",
            createdAt:   n.createdAt,
            link:        null,
          };
        });
        setNotifications(items);
      })
      .catch(() => setToast({ msg: "Failed to load notifications.", type: "error" }))
      .finally(() => setLoading(false));
  }, []);

  const showToast = (msg, type = "success") => setToast({ msg, type });

  /* stats */
  const stats = useMemo(() => ({
    total:      notifications.length,
    unread:     notifications.filter(n => !n.isRead).length,
    reminders:  notifications.filter(n => n.category === "Reminder_alert").length,
    escalations:notifications.filter(n => n.isEscalated).length,
  }), [notifications]);

  /* filter */
  const filtered = useMemo(() => {
    let out = [...notifications];
    if (filter === "Unread")           out = out.filter(n => !n.isRead);
    if (filter === "Reminder Alerts")  out = out.filter(n => n.category === "Reminder_alert");
    if (filter === "Escalations")      out = out.filter(n => n.isEscalated);
    out.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return out;
  }, [notifications, filter]);

  const anyFilter = filter !== "All Notifications";

  /* handlers */
  const handleMarkRead = (id) => {
    setNotifications(p => p.map(n => n.id === id ? { ...n, isRead: true } : n));
    notificationService.markRead(id).catch(() => {});
  };

  const handleMarkAllRead = () => {
    setNotifications(p => p.map(n => ({ ...n, isRead: true })));
    showToast("All notifications marked as read. ✅");
    notificationService.markAllRead().catch(() => {});
  };

  const handleDelete = () => {
    setNotifications(p => p.filter(n => n.id !== delItem.id));
    showToast("Notification deleted.");
    setDelItem(null);
    // BACKEND: notificationService.delete(delItem.id).catch(() => showToast("Failed to delete.", "error"));
  };

  const handleClearAll = () => {
    setNotifications([]);
    showToast("All notifications cleared.");
    // BACKEND: notificationService.clearAll().catch(() => showToast("Failed to clear.", "error"));
  };

  const handleNavigate = (item) => {
    if (!item.isRead) handleMarkRead(item.id);
    if (item.link) navigate(item.link);
  };

  const resetFilters = () => setFilter("All Notifications");

  const STAT_CARDS = [
    { gradient:"from-cyan-500 to-cyan-600",  icon:<FiBell className="w-5 h-5"/>,            label:"Total Notifications", value:stats.total       },
    { gradient:"from-amber-500 to-orange-500",icon:<FiMail className="w-5 h-5"/>,           label:"Unread",              value:stats.unread      },
    { gradient:"from-blue-500 to-blue-600",  icon:<FiClock className="w-5 h-5"/>,           label:"Reminder Alerts",     value:stats.reminders   },
    { gradient:"from-red-500 to-red-600",    icon:<FiAlertTriangle className="w-5 h-5"/>,   label:"Escalations",         value:stats.escalations },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-100"
      style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        @keyframes slideIn { from{transform:translateX(110%);opacity:0} to{transform:translateX(0);opacity:1} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        .fade-up { animation: fadeUp .4s ease both; }
        select { -webkit-appearance:none; appearance:none; }
        ::-webkit-scrollbar{width:5px;height:5px}
        ::-webkit-scrollbar-track{background:#f1f5f9;border-radius:99px}
        ::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:99px}
      `}</style>

      {toast   && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      {delItem && <DeleteConfirm item={delItem} onClose={() => setDelItem(null)} onConfirm={handleDelete} />}

      {/* ── PAGE HEADER ── */}
      <div className="bg-white/70 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white text-xl shadow-lg shadow-blue-200">
                <FiBell className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
                  Notifications
                  {stats.unread > 0 && (
                    <span className="text-xs bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-full">{stats.unread} unread</span>
                  )}
                </h1>
                <p className="text-sm text-slate-400 mt-0.5">
                  Stay on top of reminders, escalations & system alerts
                  <span className="hidden sm:inline ml-3 text-slate-300">|</span>
                  <span className="hidden sm:inline ml-3">
                    <span className="hover:text-blue-600 cursor-pointer transition-colors" onClick={() => navigate("/")}>Home</span>
                    <span className="mx-1 text-slate-300">/</span>
                    <span className="hover:text-blue-600 cursor-pointer transition-colors" onClick={() => navigate("/Reminders")}>Reminders</span>
                    <span className="mx-1 text-slate-300">/</span>
                    <span className="text-blue-600 font-bold">Notifications</span>
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {stats.unread > 0 && (
                <button onClick={handleMarkAllRead}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-green-200 hover:border-green-400
                    bg-green-50 hover:bg-green-100 text-green-700 text-sm font-bold transition-all">
                  <MdOutlineMarkEmailRead className="w-4 h-4" /> Mark All Read
                </button>
              )}
              {notifications.length > 0 && (
                <button onClick={handleClearAll}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:border-red-300
                    bg-white hover:bg-red-50 text-slate-500 hover:text-red-600 text-sm font-bold transition-all">
                  <FiTrash2 className="w-4 h-4" /> Clear All
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* ── STAT CARDS ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {STAT_CARDS.map((card, i) => (
            <div key={card.label}
              className={`bg-gradient-to-br ${card.gradient} rounded-2xl p-5 text-white shadow-lg relative overflow-hidden group
                hover:-translate-y-1 hover:shadow-xl transition-all duration-300 cursor-pointer fade-up`}
              style={{ animationDelay: `${i * 60}ms` }}>
              <div className="absolute -right-5 -top-5 w-24 h-24 rounded-full bg-white/10 group-hover:scale-110 transition-transform" />
              <div className="absolute -right-3 -bottom-8 w-32 h-32 rounded-full bg-white/10" />
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">{card.icon}</div>
                </div>
                <p className="text-2xl sm:text-3xl font-extrabold leading-none mb-1">
                  <AnimNum target={card.value} />
                </p>
                <p className="text-xs font-bold uppercase tracking-widest opacity-80">{card.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── NOTIFICATIONS LIST CARD ── */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">

          {/* List header + filter tabs */}
          <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h2 className="text-base font-extrabold text-slate-700">All Notifications</h2>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex rounded-xl border border-slate-200 overflow-hidden flex-wrap">
                {FILTERS.map(f => (
                  <button key={f} onClick={() => setFilter(f)}
                    className={`px-3.5 py-2 text-xs font-bold transition-all whitespace-nowrap
                      ${filter === f ? "bg-blue-600 text-white" : "bg-white text-slate-500 hover:bg-slate-50"}`}>
                    {f}
                  </button>
                ))}
              </div>
              <button onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 600); }}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-blue-600 font-semibold transition-colors px-2">
                <FiRefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* ── SKELETON ── */}
          {loading && (
            <div className="divide-y divide-slate-50">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-start gap-4 px-5 py-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-200 animate-pulse flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 rounded-lg bg-slate-200 animate-pulse w-1/3" />
                    <div className="h-3 rounded-lg bg-slate-200 animate-pulse w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── EMPTY STATE (matches reference screenshot) ── */}
          {!loading && filtered.length === 0 && (
            <div className="py-20 text-center fade-up">
              <FiBellOff className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-lg font-extrabold text-slate-600 mb-1">No Notifications</p>
              <p className="text-sm text-slate-400">
                {anyFilter ? "No notifications matching the current filter." : "You don't have any notifications yet."}
              </p>
              {anyFilter && (
                <button onClick={resetFilters} className="mt-5 px-4 py-2 rounded-xl bg-blue-50 text-blue-600 font-bold text-sm hover:bg-blue-100 transition-all">
                  Clear Filter
                </button>
              )}
            </div>
          )}

          {/* ── LIST ── */}
          {!loading && filtered.length > 0 && (
            <div className="divide-y divide-slate-50">
              {filtered.map((item, idx) => (
                <NotificationRow
                  key={item.id} item={item} idx={idx}
                  onMarkRead={handleMarkRead}
                  onDelete={setDelItem}
                  onNavigate={handleNavigate}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}