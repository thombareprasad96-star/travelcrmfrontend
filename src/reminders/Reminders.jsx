// src/components/Reminders/Reminders.jsx
// ─────────────────────────────────────────────────────────────
// My Reminders Page — Travel CRM
// Matches: Customers.jsx / Bookings.jsx / Vendors.jsx
// Font: Plus Jakarta Sans | Tailwind CSS | React Icons
// ─────────────────────────────────────────────────────────────

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import {
  FiBell, FiPlus, FiCheck, FiX, FiClock, FiAlertCircle,
  FiCheckCircle, FiEdit2, FiTrash2, FiSearch, FiChevronDown,
  FiCalendar, FiUser, FiPhone, FiEye, FiRefreshCw,
  FiFilter, FiAlertTriangle, FiLoader,
} from "react-icons/fi";
import {
  FaWhatsapp, FaBell, FaClock, FaExclamationTriangle,
  FaCheckCircle, FaRegBell, FaBellSlash, FaStickyNote,
  FaPhoneAlt, FaUserTie,
} from "react-icons/fa";
import { MdSnooze, MdOutlineAddTask, MdOutlineAccessTime } from "react-icons/md";
import { HiSparkles } from "react-icons/hi";

/* ─── MOCK DATA ──────────────────────────────────────────────── */
function daysAgo(d)  { const dt = new Date(); dt.setDate(dt.getDate() - d); return dt.toISOString(); }
function daysAhead(d){ const dt = new Date(); dt.setDate(dt.getDate() + d); return dt.toISOString(); }

const MOCK_REMINDERS = [
  { id:1,  title:"Contact New Lead: Pratik",         description:"New lead requires initial contact",          type:"First_contact", priority:"High",   status:"Active",    leadName:"Pratik",           phone:"+91 88888 88888", dueDate:daysAgo(11),   snoozedUntil:null,  notes:"",  createdAt:daysAgo(12) },
  { id:2,  title:"Contact New Lead: Priyanshu Agrawal",description:"New lead requires initial contact",        type:"First_contact", priority:"High",   status:"Active",    leadName:"Priyanshu Agrawal",phone:"+91 83029 32798", dueDate:daysAgo(8),    snoozedUntil:null,  notes:"",  createdAt:daysAgo(9)  },
  { id:3,  title:"Contact New Lead: Pratik",          description:"New lead requires initial contact",         type:"First_contact", priority:"Medium", status:"Active",    leadName:"Pratik",           phone:"8010214002",      dueDate:daysAgo(8),    snoozedUntil:null,  notes:"",  createdAt:daysAgo(9)  },
  { id:4,  title:"Contact New Lead: Anushka Narkhede",description:"New lead requires initial contact",         type:"First_contact", priority:"High",   status:"Active",    leadName:"Anushka Narkhede", phone:"+91 97309 32432", dueDate:daysAgo(5),    snoozedUntil:null,  notes:"",  createdAt:daysAgo(6)  },
  { id:5,  title:"Contact New Lead: Anushka",         description:"New lead requires initial contact",         type:"First_contact", priority:"Medium", status:"Active",    leadName:"Anushka",          phone:"+91 87654 32100", dueDate:daysAgo(5),    snoozedUntil:null,  notes:"",  createdAt:daysAgo(6)  },
  { id:6,  title:"Contact New Lead: Sachin",          description:"New lead requires initial contact",         type:"First_contact", priority:"Low",    status:"Active",    leadName:"Sachin",           phone:"+91 76543 21000", dueDate:daysAgo(3),    snoozedUntil:null,  notes:"",  createdAt:daysAgo(4)  },
  { id:7,  title:"Follow Up: Arjun Sharma — Maldives",description:"Customer requested callback after 3 days",  type:"Follow_up",     priority:"High",   status:"Active",    leadName:"Arjun Sharma",     phone:"+91 98765 43210", dueDate:daysAhead(1),  snoozedUntil:null,  notes:"Interested in Maldives package ₹1.2L", createdAt:daysAgo(2) },
  { id:8,  title:"Send Quotation: Vikram Singh — Dubai",description:"Prepare and send Dubai Explorer quote",   type:"Quotation",     priority:"High",   status:"Active",    leadName:"Vikram Singh",     phone:"+91 54321 09876", dueDate:daysAhead(0),  snoozedUntil:null,  notes:"Budget ₹2L. 5 pax. Oct travel.", createdAt:daysAgo(1) },
  { id:9,  title:"Passport Expiry: Rohit Khanna",     description:"Passport expires in 45 days",               type:"Document",      priority:"Medium", status:"Active",    leadName:"Rohit Khanna",     phone:"+91 10987 65432", dueDate:daysAhead(3),  snoozedUntil:null,  notes:"Japan visa application pending", createdAt:daysAgo(5) },
  { id:10, title:"Payment Due: Booking BK10002",      description:"Balance payment pending from Priya Mehta",  type:"Payment",       priority:"High",   status:"Active",    leadName:"Priya Mehta",      phone:"+91 87654 32109", dueDate:daysAhead(2),  snoozedUntil:null,  notes:"₹52,250 balance due", createdAt:daysAgo(3) },
  { id:11, title:"Birthday Wish: Neha Kapoor",        description:"Customer birthday — send wishes & offer",   type:"Birthday",      priority:"Low",    status:"Active",    leadName:"Neha Kapoor",      phone:"+91 99887 76655", dueDate:daysAhead(5),  snoozedUntil:null,  notes:"Offer 5% discount on next booking", createdAt:daysAgo(1) },
  { id:12, title:"Group Booking Confirm: Sandeep Kumar",description:"Confirm group itinerary for Singapore trip",type:"Confirmation",priority:"High",   status:"Active",    leadName:"Sandeep Kumar",    phone:"+91 44332 21100", dueDate:daysAhead(4),  snoozedUntil:null,  notes:"12 pax group. Singapore 7N", createdAt:daysAgo(2) },
  { id:13, title:"Follow Up: Meera Reddy — Kerala",  description:"Second follow up for Kerala package",         type:"Follow_up",     priority:"Medium", status:"Snoozed",   leadName:"Meera Reddy",      phone:"+91 80808 70707", dueDate:daysAhead(2),  snoozedUntil:daysAhead(2), notes:"", createdAt:daysAgo(4) },
  { id:14, title:"Visa Reminder: Deepak Mishra",     description:"Bhutan visa application deadline",            type:"Document",      priority:"High",   status:"Active",    leadName:"Deepak Mishra",    phone:"+91 66554 43322", dueDate:daysAhead(7),  snoozedUntil:null,  notes:"Apply minimum 15 days before travel", createdAt:daysAgo(1) },
  { id:15, title:"Anniversary Offer: Anjali Verma",  description:"Send anniversary travel offer",               type:"Birthday",      priority:"Low",    status:"Completed", leadName:"Anjali Verma",     phone:"+91 43210 98765", dueDate:daysAgo(2),    snoozedUntil:null,  notes:"Sent personalized Maldives offer", createdAt:daysAgo(7) },
  { id:16, title:"Payment Confirm: Rohit Khanna",    description:"Confirm Japan trip balance received",          type:"Payment",       priority:"High",   status:"Completed", leadName:"Rohit Khanna",     phone:"+91 10987 65432", dueDate:daysAgo(4),    snoozedUntil:null,  notes:"Full payment received ₹2.9L", createdAt:daysAgo(6) },
  { id:17, title:"Itinerary Send: Karan Malhotra",   description:"Send final Singapore itinerary",               type:"Quotation",     priority:"Medium", status:"Completed", leadName:"Karan Malhotra",   phone:"+91 90909 80808", dueDate:daysAgo(3),    snoozedUntil:null,  notes:"PDF sent via WhatsApp", createdAt:daysAgo(5) },
];

const PRIORITIES  = ["High", "Medium", "Low"];
const STATUSES    = ["Active", "Snoozed", "Completed", "Dismissed"];
const REMINDER_TYPES = ["First_contact","Follow_up","Quotation","Payment","Document","Birthday","Confirmation","Custom"];

const PRIORITY_CFG = {
  High:   { bg:"bg-red-100",    text:"text-red-700",    border:"border-red-200",    dot:"bg-red-500",    icon:"🔴" },
  Medium: { bg:"bg-amber-100",  text:"text-amber-700",  border:"border-amber-200",  dot:"bg-amber-500",  icon:"🟡" },
  Low:    { bg:"bg-green-100",  text:"text-green-700",  border:"border-green-200",  dot:"bg-green-500",  icon:"🟢" },
};
const STATUS_CFG = {
  Active:    { bg:"bg-amber-100",   text:"text-amber-700",   dot:"bg-amber-500",   icon:"⏰" },
  Snoozed:   { bg:"bg-blue-100",    text:"text-blue-700",    dot:"bg-blue-500",    icon:"😴" },
  Completed: { bg:"bg-green-100",   text:"text-green-700",   dot:"bg-green-500",   icon:"✅" },
  Dismissed: { bg:"bg-slate-100",   text:"text-slate-500",   dot:"bg-slate-400",   icon:"❌" },
};
const TYPE_CFG = {
  First_contact: { label:"First Contact",  icon:"👤", color:"bg-blue-500"   },
  Follow_up:     { label:"Follow Up",      icon:"🔄", color:"bg-teal-500"   },
  Quotation:     { label:"Quotation",      icon:"📋", color:"bg-indigo-500" },
  Payment:       { label:"Payment",        icon:"💰", color:"bg-green-500"  },
  Document:      { label:"Document",       icon:"📄", color:"bg-orange-500" },
  Birthday:      { label:"Birthday/Anniv", icon:"🎂", color:"bg-pink-500"   },
  Confirmation:  { label:"Confirmation",   icon:"✔️",  color:"bg-purple-500" },
  Custom:        { label:"Custom",         icon:"📌", color:"bg-slate-500"  },
};

const SNOOZE_OPTS = [
  { label:"1 Hour",     hours:1   },
  { label:"3 Hours",    hours:3   },
  { label:"Tomorrow",   hours:24  },
  { label:"2 Days",     hours:48  },
  { label:"1 Week",     hours:168 },
];

const AVATAR_GRADS = [
  "from-blue-500 to-blue-600","from-purple-500 to-purple-600",
  "from-teal-500 to-teal-600","from-rose-500 to-rose-600",
  "from-amber-500 to-amber-600","from-indigo-500 to-indigo-600",
  "from-green-500 to-green-600","from-cyan-500 to-cyan-600",
];

/* ─── HELPERS ────────────────────────────────────────────────── */
function initials(n = "") {
  return n.trim().split(" ").map(w => w[0] || "").join("").slice(0, 2).toUpperCase() || "R";
}
function avatarGrad(id) { return AVATAR_GRADS[id % AVATAR_GRADS.length]; }

function getOverdueText(dueDate) {
  const now  = new Date();
  const due  = new Date(dueDate);
  const diff = now - due;
  if (diff <= 0) return null;
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days  = Math.floor(hours / 24);
  if (days > 0)  return `Overdue by ${days} day${days > 1 ? "s" : ""} ${hours % 24} hour${hours % 24 !== 1 ? "s" : ""}`;
  if (hours > 0) return `Overdue by ${hours} hour${hours !== 1 ? "s" : ""}`;
  return `Overdue by ${mins} minute${mins !== 1 ? "s" : ""}`;
}

function getDueText(dueDate) {
  const now  = new Date();
  const due  = new Date(dueDate);
  const diff = due - now;
  if (diff < 0)  return { text: getOverdueText(dueDate), overdue: true };
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days  = Math.floor(hours / 24);
  if (days === 0 && hours === 0) return { text: "Due in less than an hour", overdue: false, soon: true };
  if (days === 0) return { text: `Due in ${hours} hour${hours !== 1 ? "s" : ""}`, overdue: false, soon: true };
  if (days === 1) return { text: "Due tomorrow", overdue: false, soon: true };
  return { text: `Due in ${days} days`, overdue: false, soon: false };
}

function fmtDateTime(d) {
  if (!d) return "—";
  return new Date(d).toLocaleString("en-IN", { day:"2-digit", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit" });
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

/* ─── ADD / EDIT REMINDER MODAL ──────────────────────────────── */
function ReminderFormModal({ reminder, onClose, onSave }) {
  const isEdit = !!reminder;
  const [form, setForm] = useState(reminder || {
    title: "", description: "", type: "First_contact", priority: "High",
    status: "Active", leadName: "", phone: "", dueDate: "", notes: "",
  });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  // Pre-fill dueDate as local datetime string for input
  const dueDateForInput = form.dueDate
    ? new Date(form.dueDate).toISOString().slice(0, 16)
    : "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto z-10"
        style={{ animation: "popIn .25s ease both" }}>
        <div className={`bg-gradient-to-r ${isEdit ? "from-indigo-600 to-indigo-500" : "from-blue-600 to-blue-500"} px-6 py-5 rounded-t-2xl flex items-center justify-between`}>
          <div>
            <h2 className="text-white font-extrabold text-lg">{isEdit ? "Edit Reminder" : "Add New Reminder"}</h2>
            <p className="text-white/70 text-xs mt-0.5">{isEdit ? "Update reminder details" : "Set a new reminder or follow-up task"}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center text-lg transition-all">×</button>
        </div>

        <div className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5">Reminder Title *</label>
            <input value={form.title} onChange={e => set("title", e.target.value)}
              placeholder="e.g. Follow up: Arjun Sharma — Maldives trip"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700
                placeholder-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-50 outline-none transition-all" />
          </div>

          {/* Type + Priority */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { key: "type",     label: "Type",     opts: REMINDER_TYPES.map(t => ({ v: t, l: TYPE_CFG[t]?.label || t })) },
              { key: "priority", label: "Priority", opts: PRIORITIES.map(p => ({ v: p, l: p })) },
            ].map(({ key, label, opts }) => (
              <div key={key}>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">{label}</label>
                <div className="relative">
                  <select value={form[key]} onChange={e => set(key, e.target.value)}
                    className="w-full pl-3 pr-7 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700
                      bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-50 outline-none appearance-none cursor-pointer transition-all">
                    {opts.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                  </select>
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] pointer-events-none">▼</span>
                </div>
              </div>
            ))}
          </div>

          {/* Due Date + Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5">Due Date & Time *</label>
              <input type="datetime-local" value={dueDateForInput}
                onChange={e => set("dueDate", new Date(e.target.value).toISOString())}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700
                  focus:border-blue-400 focus:ring-2 focus:ring-blue-50 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5">Status</label>
              <div className="relative">
                <select value={form.status} onChange={e => set("status", e.target.value)}
                  className="w-full pl-3 pr-7 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700
                    bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-50 outline-none appearance-none cursor-pointer transition-all">
                  {STATUSES.map(s => <option key={s}>{s}</option>)}
                </select>
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] pointer-events-none">▼</span>
              </div>
            </div>
          </div>

          {/* Lead Name + Phone */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5">Lead / Customer Name</label>
              <input value={form.leadName} onChange={e => set("leadName", e.target.value)}
                placeholder="Customer name"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700
                  placeholder-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-50 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5">Phone Number</label>
              <input value={form.phone} onChange={e => set("phone", e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700
                  placeholder-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-50 outline-none transition-all" />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5">Description</label>
            <input value={form.description} onChange={e => set("description", e.target.value)}
              placeholder="Brief description of what needs to be done"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700
                placeholder-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-50 outline-none transition-all" />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5">Notes</label>
            <textarea value={form.notes} onChange={e => set("notes", e.target.value)} rows={3}
              placeholder="Additional context, budget, special requirements..."
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700
                placeholder-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-50 outline-none transition-all resize-none" />
          </div>

          <div className="flex gap-3 pt-1">
            <button onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border-2 border-slate-200 hover:border-slate-300 text-slate-600 font-bold text-sm transition-all bg-white hover:bg-slate-50">
              Cancel
            </button>
            <button onClick={() => onSave(form)}
              className={`flex-1 py-2.5 rounded-xl text-white font-bold text-sm transition-all shadow-md
                ${isEdit ? "bg-indigo-600 hover:bg-indigo-700" : "bg-blue-600 hover:bg-blue-700"}`}>
              {isEdit ? "Save Changes" : "Add Reminder"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── SNOOZE DROPDOWN ────────────────────────────────────────── */
function SnoozeMenu({ onSnooze, onClose }) {
  return (
    <div className="absolute top-full left-0 mt-1 z-30 bg-white rounded-xl shadow-xl border border-slate-200 py-1 min-w-[160px]"
      style={{ animation: "fadeUp .2s ease both" }}>
      {SNOOZE_OPTS.map(opt => (
        <button key={opt.label} onClick={() => { onSnooze(opt.hours); onClose(); }}
          className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 font-medium transition-colors flex items-center gap-2">
          <MdSnooze className="w-4 h-4 text-blue-400" /> {opt.label}
        </button>
      ))}
    </div>
  );
}

/* ─── LOG MODAL ──────────────────────────────────────────────── */
function LogModal({ reminder, onClose, onSave }) {
  const [log, setLog] = useState("");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md z-10 p-6"
        style={{ animation: "popIn .25s ease both" }}>
        <h3 className="text-base font-extrabold text-slate-800 mb-1">Add Activity Log</h3>
        <p className="text-xs text-slate-500 mb-4">{reminder?.title}</p>
        <textarea rows={4} value={log} onChange={e => setLog(e.target.value)}
          placeholder="What happened? e.g. Called customer, no answer. Will retry tomorrow 10am..."
          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700
            placeholder-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-50 outline-none transition-all resize-none mb-4" />
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border-2 border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all">Cancel</button>
          <button onClick={() => { if (log.trim()) { onSave(log); onClose(); } }}
            className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all">
            Save Log
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── REMINDER CARD ──────────────────────────────────────────── */
function ReminderCard({ r, onComplete, onDismiss, onSnooze, onEdit, onDelete, onAddLog, idx }) {
  const [showSnooze, setShowSnooze] = useState(false);
  const snoozeRef = useRef(null);
  const pc = PRIORITY_CFG[r.priority] || PRIORITY_CFG.High;
  const sc = STATUS_CFG[r.status]     || STATUS_CFG.Active;
  const tc = TYPE_CFG[r.type]         || TYPE_CFG.Custom;
  const due = getDueText(r.dueDate);
  const isCompleted  = r.status === "Completed";
  const isDismissed  = r.status === "Dismissed";
  const isSnoozed    = r.status === "Snoozed";
  const isDone       = isCompleted || isDismissed;

  // close snooze on outside click
  useEffect(() => {
    const h = e => { if (snoozeRef.current && !snoozeRef.current.contains(e.target)) setShowSnooze(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all duration-300 group
      ${isDone ? "opacity-60 border-slate-200" : due.overdue ? "border-red-200 shadow-red-50" : "border-slate-200 hover:border-blue-200 hover:shadow-md"}`}
      style={{ animation: "fadeUp .4s ease both", animationDelay: `${idx * 50}ms` }}>

      {/* Top stripe for priority */}
      <div className={`h-1 w-full ${due.overdue && !isDone ? "bg-red-500" : isSnoozed ? "bg-blue-400" : isCompleted ? "bg-green-500" : r.priority === "High" ? "bg-amber-500" : r.priority === "Medium" ? "bg-yellow-400" : "bg-slate-300"}`} />

      <div className="p-4">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${sc.bg} ${sc.text}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
              {sc.icon} {r.status}
            </span>
            <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
              {tc.icon} {tc.label}
            </span>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <button onClick={() => onEdit(r)}
              className="w-7 h-7 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center text-xs transition-all">
              <FiEdit2 className="w-3 h-3" />
            </button>
            <button onClick={() => onDelete(r.id)}
              className="w-7 h-7 rounded-lg bg-slate-50 hover:bg-red-100 text-slate-400 hover:text-red-500 flex items-center justify-center text-xs transition-all">
              <FiTrash2 className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Title + description */}
        <h3 className={`text-sm font-extrabold leading-tight mb-1 ${isDone ? "line-through text-slate-400" : "text-slate-800"}`}>
          {r.title}
        </h3>
        <p className="text-xs text-slate-400 mb-3">{r.description}</p>

        {/* Lead info */}
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${avatarGrad(r.id)} flex items-center justify-center text-white text-xs font-extrabold flex-shrink-0`}>
            {initials(r.leadName)}
          </div>
          <div>
            <p className="text-xs font-bold text-blue-600">Lead: {r.leadName}</p>
            <p className="text-xs text-slate-400">{r.phone}</p>
          </div>
        </div>

        {/* Due date */}
        <div className={`flex items-center gap-1.5 text-xs font-semibold mb-3 rounded-lg px-3 py-2
          ${due.overdue && !isDone ? "bg-red-50 text-red-600 border border-red-100" :
            due.soon && !isDone    ? "bg-amber-50 text-amber-600 border border-amber-100" :
            isDone                 ? "bg-slate-50 text-slate-400" :
                                    "bg-slate-50 text-slate-500"}`}>
          <FiClock className="w-3 h-3 flex-shrink-0" />
          {isDone ? `Was due: ${fmtDateTime(r.dueDate)}` : due.text}
        </div>

        {/* Notes */}
        {r.notes && (
          <div className="bg-amber-50 rounded-lg px-3 py-2 border border-amber-100 mb-3">
            <p className="text-xs text-amber-700 font-medium leading-relaxed">{r.notes}</p>
          </div>
        )}

        {/* Priority badge */}
        <div className="flex items-center justify-between mb-3">
          <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border ${pc.border} ${pc.bg} ${pc.text}`}>
            {pc.icon} {r.priority} Priority
          </span>
          <span className="text-xs text-slate-400">{fmtDateTime(r.dueDate)}</span>
        </div>

        {/* Action buttons */}
        {!isDone && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
            <button onClick={() => onComplete(r.id)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white text-xs font-bold transition-all shadow-sm">
              <FiCheckCircle className="w-3 h-3" /> Complete
            </button>

            <div className="relative" ref={snoozeRef}>
              <button onClick={() => setShowSnooze(s => !s)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all shadow-sm">
                <MdSnooze className="w-3.5 h-3.5" /> Snooze
                <FiChevronDown className={`w-3 h-3 transition-transform ${showSnooze ? "rotate-180" : ""}`} />
              </button>
              {showSnooze && <SnoozeMenu onSnooze={h => onSnooze(r.id, h)} onClose={() => setShowSnooze(false)} />}
            </div>

            <button onClick={() => onDismiss(r.id)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-500 hover:bg-slate-600 text-white text-xs font-bold transition-all shadow-sm">
              <FiX className="w-3 h-3" /> Dismiss
            </button>

            <button onClick={() => onAddLog(r)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm">
              <MdOutlineAddTask className="w-3.5 h-3.5" /> Add Log
            </button>

            <a href={`tel:${r.phone}`}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-sm">
              <FaPhoneAlt className="w-3 h-3" /> Call
            </a>

            <a href={`https://wa.me/${r.phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-green-500 hover:bg-green-600 text-white text-xs font-bold transition-all shadow-sm">
              <FaWhatsapp className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        {isDone && (
          <div className="pt-2 border-t border-slate-100 flex gap-2">
            <button onClick={() => onEdit(r)}
              className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition-all">
              ✏️ Edit
            </button>
            <button onClick={() => onDelete(r.id)}
              className="flex-1 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 border border-red-200 text-xs font-bold transition-all">
              🗑 Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── MAIN PAGE ──────────────────────────────────────────────── */
export default function Reminders() {
  const [reminders, setReminders] = useState(MOCK_REMINDERS);
  const [search,    setSearch]    = useState("");
  const [fStatus,   setFStatus]   = useState("All Status");
  const [fPriority, setFPriority] = useState("All Priorities");
  const [fType,     setFType]     = useState("All Types");
  const [showAdd,   setShowAdd]   = useState(false);
  const [editR,     setEditR]     = useState(null);
  const [logR,      setLogR]      = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [toast,     setToast]     = useState(null);
  const [view,      setView]      = useState("grid"); // "grid" | "list"
  const nextId = useRef(MOCK_REMINDERS.length + 1);

  useEffect(() => { const t = setTimeout(() => setLoading(false), 700); return () => clearTimeout(t); }, []);
  const showToast = (msg, type = "success") => setToast({ msg, type });

  /* stats */
  const stats = useMemo(() => ({
    total:     reminders.length,
    active:    reminders.filter(r => r.status === "Active").length,
    overdue:   reminders.filter(r => r.status === "Active" && new Date(r.dueDate) < new Date()).length,
    completed: reminders.filter(r => r.status === "Completed").length,
    snoozed:   reminders.filter(r => r.status === "Snoozed").length,
  }), [reminders]);

  /* filter */
  const filtered = useMemo(() => {
    let out = [...reminders];
    const q = search.toLowerCase();
    if (q) out = out.filter(r =>
      r.title.toLowerCase().includes(q) ||
      r.leadName.toLowerCase().includes(q) ||
      r.phone.includes(q)
    );
    if (fStatus   !== "All Status")     out = out.filter(r => r.status === fStatus);
    if (fPriority !== "All Priorities") out = out.filter(r => r.priority === fPriority);
    if (fType     !== "All Types")      out = out.filter(r => r.type === fType);
    // sort: overdue Active first, then by dueDate
    out.sort((a, b) => {
      const aOver = a.status === "Active" && new Date(a.dueDate) < new Date();
      const bOver = b.status === "Active" && new Date(b.dueDate) < new Date();
      if (aOver !== bOver) return aOver ? -1 : 1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    });
    return out;
  }, [reminders, search, fStatus, fPriority, fType]);

  const anyFilter = search || fStatus !== "All Status" || fPriority !== "All Priorities" || fType !== "All Types";

  /* handlers */
  const handleComplete = id => {
    setReminders(p => p.map(r => r.id === id ? { ...r, status: "Completed" } : r));
    showToast("Reminder marked as completed! ✅");
  };

  const handleDismiss = id => {
    setReminders(p => p.map(r => r.id === id ? { ...r, status: "Dismissed" } : r));
    showToast("Reminder dismissed.");
  };

  const handleSnooze = (id, hours) => {
    const until = new Date();
    until.setHours(until.getHours() + hours);
    setReminders(p => p.map(r =>
      r.id === id ? { ...r, status: "Snoozed", snoozedUntil: until.toISOString(), dueDate: until.toISOString() } : r
    ));
    const opt = SNOOZE_OPTS.find(o => o.hours === hours);
    showToast(`Snoozed for ${opt?.label || `${hours} hours`} 😴`);
  };

  const handleDelete = id => {
    setReminders(p => p.filter(r => r.id !== id));
    showToast("Reminder deleted.");
  };

  const handleSave = form => {
    if (!form.title?.trim()) { showToast("Reminder title is required.", "error"); return; }
    if (!form.dueDate)        { showToast("Due date is required.", "error"); return; }
    if (editR) {
      setReminders(p => p.map(r => r.id === editR.id ? { ...r, ...form } : r));
      showToast("Reminder updated successfully.");
    } else {
      const id = nextId.current++;
      setReminders(p => [...p, { ...form, id, snoozedUntil: null, createdAt: new Date().toISOString() }]);
      showToast("Reminder added successfully! 🔔");
    }
    setEditR(null); setShowAdd(false);
  };

  const handleAddLog = (r, log) => {
    setReminders(p => p.map(x =>
      x.id === r.id ? { ...x, notes: x.notes ? `${x.notes}\n[LOG] ${log}` : `[LOG] ${log}` } : x
    ));
    showToast("Activity log added.");
  };

  const resetFilters = () => { setSearch(""); setFStatus("All Status"); setFPriority("All Priorities"); setFType("All Types"); };

  const markAllComplete = () => {
    setReminders(p => p.map(r =>
      r.status === "Active" && new Date(r.dueDate) < new Date()
        ? { ...r, status: "Completed" }
        : r
    ));
    showToast("All overdue reminders marked complete.");
  };

  function Sel({ val, onChange, opts }) {
    return (
      <div className="relative">
        <select value={val} onChange={e => onChange(e.target.value)}
          className="w-full pl-3 pr-8 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-600 font-medium
            focus:border-blue-400 focus:ring-2 focus:ring-blue-50 outline-none appearance-none cursor-pointer transition-all">
          {opts.map(o => <option key={o}>{o}</option>)}
        </select>
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] pointer-events-none">▼</span>
      </div>
    );
  }

  const STAT_CARDS = [
    { gradient:"from-cyan-500 to-cyan-600",    icon:"🔔", label:"Total Reminders",   value:stats.total,     key:"total"     },
    { gradient:"from-amber-500 to-orange-500", icon:"⏰", label:"Active Reminders",  value:stats.active,    key:"active"    },
    { gradient:"from-red-500 to-red-600",      icon:"⚠️",  label:"Overdue",           value:stats.overdue,   key:"overdue"   },
    { gradient:"from-green-500 to-emerald-600",icon:"✅", label:"Completed",          value:stats.completed, key:"completed" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-100"
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

      {toast    && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      {(showAdd || editR) && (
        <ReminderFormModal reminder={editR || null}
          onClose={() => { setShowAdd(false); setEditR(null); }}
          onSave={handleSave} />
      )}
      {logR && (
        <LogModal reminder={logR}
          onClose={() => setLogR(null)}
          onSave={log => handleAddLog(logR, log)} />
      )}

      {/* ── NAV ── */}
      {/* <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-40 shadow-sm">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center text-white font-black text-sm shadow">T</div>
            <span className="font-extrabold text-slate-800 text-sm hidden sm:block">TravelCRM</span>
          </div>
          <div className="text-xs text-slate-400 flex items-center gap-1 font-medium">
            <span className="hover:text-blue-600 cursor-pointer transition-colors">Home</span>
            <span className="mx-1">/</span>
            <span className="hover:text-blue-600 cursor-pointer transition-colors">Reminders</span>
            <span className="mx-1">/</span>
            <span className="text-blue-600 font-bold">My Reminders</span>
          </div>
        </div>
      </nav> */}

      {/* ── PAGE HEADER ── */}
      <div className="bg-white/70 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white text-xl shadow-lg shadow-blue-200">
                <FiBell className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">My Reminders</h1>
                <p className="text-sm text-slate-400 mt-0.5">Follow-ups, tasks & scheduled activities</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {stats.overdue > 0 && (
                <button onClick={markAllComplete}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-green-200 hover:border-green-400
                    bg-green-50 hover:bg-green-100 text-green-700 text-sm font-bold transition-all">
                  <FiCheckCircle className="w-3.5 h-3.5" /> Clear Overdue ({stats.overdue})
                </button>
              )}
              <button onClick={() => setShowAdd(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold
                  shadow-md shadow-blue-200 hover:shadow-lg transition-all">
                <FiPlus className="w-4 h-4" /> Add Reminder
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* ── STAT CARDS ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {STAT_CARDS.map((card, i) => (
            <div key={card.key}
              className={`bg-gradient-to-br ${card.gradient} rounded-2xl p-5 text-white shadow-lg relative overflow-hidden group
                hover:-translate-y-1 hover:shadow-xl transition-all duration-300 cursor-pointer fade-up`}
              style={{ animationDelay: `${i * 60}ms` }}>
              <div className="absolute -right-5 -top-5 w-24 h-24 rounded-full bg-white/10 group-hover:scale-110 transition-transform" />
              <div className="absolute -right-3 -bottom-8 w-32 h-32 rounded-full bg-white/10" />
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-3 text-xl">{card.icon}</div>
                <p className="text-2xl sm:text-3xl font-extrabold leading-none mb-1">
                  <AnimNum target={card.value} />
                </p>
                <p className="text-xs font-bold uppercase tracking-widest opacity-80">{card.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── OVERDUE ALERT BANNER ── */}
        {stats.overdue > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-4 flex items-center gap-4 fade-up">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
              <FiAlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-extrabold text-red-700">
                {stats.overdue} overdue reminder{stats.overdue > 1 ? "s" : ""} need your attention!
              </p>
              <p className="text-xs text-red-500 mt-0.5">These leads are waiting for your contact. Please take action immediately.</p>
            </div>
            <button onClick={() => setFStatus("Active")}
              className="text-xs font-bold text-red-600 hover:text-red-800 bg-red-100 hover:bg-red-200 px-3 py-1.5 rounded-lg transition-all flex-shrink-0">
              View All
            </button>
          </div>
        )}

        {/* ── FILTER BAR ── */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-100 shadow-sm px-5 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-wrap">
            {/* Status label */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <FiFilter className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-bold text-slate-600">Status:</span>
            </div>
            <Sel val={fStatus}   onChange={setFStatus}   opts={["All Status",   ...STATUSES]}   />

            <span className="text-sm font-bold text-slate-600 hidden sm:block">Priority:</span>
            <Sel val={fPriority} onChange={setFPriority} opts={["All Priorities",...PRIORITIES]}  />

            <span className="text-sm font-bold text-slate-600 hidden sm:block">Type:</span>
            <Sel val={fType}     onChange={setFType}     opts={["All Types",    ...REMINDER_TYPES.map(t => t)]} />

            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search reminders, leads..."
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700
                  placeholder-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-50 outline-none transition-all" />
            </div>

            <div className="flex items-center gap-2 ml-auto">
              {/* Grid / List toggle */}
              <div className="flex rounded-xl border border-slate-200 overflow-hidden">
                <button onClick={() => setView("grid")}
                  className={`px-3 py-2 text-xs font-bold transition-all ${view === "grid" ? "bg-blue-600 text-white" : "bg-white text-slate-500 hover:bg-slate-50"}`}>
                  ⊞ Grid
                </button>
                <button onClick={() => setView("list")}
                  className={`px-3 py-2 text-xs font-bold transition-all ${view === "list" ? "bg-blue-600 text-white" : "bg-white text-slate-500 hover:bg-slate-50"}`}>
                  ☰ List
                </button>
              </div>

              {anyFilter && (
                <button onClick={resetFilters} className="text-xs text-red-400 hover:text-red-600 font-bold transition-colors whitespace-nowrap">
                  ✕ Clear
                </button>
              )}
            </div>
          </div>

          {/* Quick filter pills */}
          <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-slate-100">
            <span className="text-xs text-slate-500 font-semibold self-center">Quick:</span>
            {[
              { label: `🔴 Overdue (${stats.overdue})`,   action: () => { setFStatus("Active"); setSearch(""); } },
              { label: `⏰ Active (${stats.active})`,     action: () => { setFStatus("Active"); } },
              { label: `😴 Snoozed (${stats.snoozed})`,  action: () => { setFStatus("Snoozed"); } },
              { label: `✅ Done (${stats.completed})`,    action: () => { setFStatus("Completed"); } },
              { label: "🔥 High Priority",                action: () => { setFPriority("High"); } },
              { label: "💰 Payments",                     action: () => { setFType("Payment"); } },
            ].map(({ label, action }) => (
              <button key={label} onClick={action}
                className="text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-100 hover:bg-blue-100
                  text-slate-600 hover:text-blue-700 border border-slate-200 hover:border-blue-300 transition-all">
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── COUNT ROW ── */}
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-slate-600">
            Showing <span className="text-blue-600">{filtered.length}</span> reminder{filtered.length !== 1 ? "s" : ""}
            {anyFilter && <span className="text-slate-400 font-normal ml-1">(filtered)</span>}
          </p>
          <button onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 600); }}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-blue-600 font-semibold transition-colors">
            <FiRefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>

        {/* ── EMPTY STATE ── */}
        {!loading && filtered.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm py-20 text-center fade-up">
            <div className="text-6xl mb-4">🔔</div>
            <p className="text-lg font-extrabold text-slate-600 mb-1">No Reminders Found</p>
            <p className="text-sm text-slate-400 mb-5">
              {anyFilter ? "Adjust your filters to see results." : "You have no reminders yet. Add one to get started."}
            </p>
            {anyFilter
              ? <button onClick={resetFilters} className="px-4 py-2 rounded-xl bg-blue-50 text-blue-600 font-bold text-sm hover:bg-blue-100 transition-all">Clear Filters</button>
              : <button onClick={() => setShowAdd(true)} className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm shadow-md hover:bg-blue-700 transition-all flex items-center gap-2 mx-auto">
                  <FiPlus /> Add First Reminder
                </button>
            }
          </div>
        )}

        {/* ── SKELETON ── */}
        {loading && (
          <div className={`grid gap-4 ${view === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 p-4 space-y-3">
                <div className="h-5 rounded-lg bg-slate-200 animate-pulse w-3/4" />
                <div className="h-3 rounded-lg bg-slate-200 animate-pulse w-full" />
                <div className="h-3 rounded-lg bg-slate-200 animate-pulse w-2/3" />
                <div className="h-8 rounded-xl bg-slate-200 animate-pulse w-full mt-4" />
              </div>
            ))}
          </div>
        )}

        {/* ── GRID VIEW ── */}
        {!loading && filtered.length > 0 && view === "grid" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((r, idx) => (
              <ReminderCard
                key={r.id} r={r} idx={idx}
                onComplete={handleComplete}
                onDismiss={handleDismiss}
                onSnooze={handleSnooze}
                onEdit={setEditR}
                onDelete={handleDelete}
                onAddLog={setLogR}
              />
            ))}
          </div>
        )}

        {/* ── LIST VIEW ── */}
        {!loading && filtered.length > 0 && view === "list" && (
          <div className="bg-white/80 rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3 bg-slate-50 border-b border-slate-100
              text-xs font-extrabold text-slate-500 uppercase tracking-wider">
              <span>Reminder</span>
              <span>Lead</span>
              <span>Due Date</span>
              <span>Priority</span>
              <span>Status</span>
              <span>Actions</span>
            </div>
            <div className="divide-y divide-slate-50">
              {filtered.map((r, idx) => {
                const pc = PRIORITY_CFG[r.priority] || PRIORITY_CFG.High;
                const sc = STATUS_CFG[r.status]     || STATUS_CFG.Active;
                const tc = TYPE_CFG[r.type]         || TYPE_CFG.Custom;
                const due = getDueText(r.dueDate);
                const isDone = r.status === "Completed" || r.status === "Dismissed";
                return (
                  <div key={r.id}
                    className={`px-5 py-4 transition-all duration-150 hover:bg-blue-50/40 hover:shadow-[inset_3px_0_0_#2563eb]
                      ${isDone ? "opacity-60" : ""}`}
                    style={{ animation: "fadeUp .35s ease both", animationDelay: `${idx * 25}ms` }}>
                    {/* Mobile layout */}
                    <div className="md:hidden">
                      <ReminderCard r={r} idx={idx}
                        onComplete={handleComplete} onDismiss={handleDismiss}
                        onSnooze={handleSnooze} onEdit={setEditR}
                        onDelete={handleDelete} onAddLog={setLogR} />
                    </div>
                    {/* Desktop list row */}
                    <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-4 items-center">
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xs text-slate-400">{tc.icon}</span>
                          <p className={`text-sm font-bold ${isDone ? "line-through text-slate-400" : "text-slate-800"}`}>{r.title}</p>
                        </div>
                        <p className="text-xs text-slate-400">{r.description}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-blue-600">{r.leadName}</p>
                        <p className="text-xs text-slate-400">{r.phone}</p>
                      </div>
                      <div>
                        <p className={`text-xs font-bold ${due.overdue && !isDone ? "text-red-600" : due.soon ? "text-amber-600" : "text-slate-600"}`}>
                          {isDone ? fmtDateTime(r.dueDate) : due.text}
                        </p>
                      </div>
                      <div>
                        <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full border ${pc.border} ${pc.bg} ${pc.text}`}>
                          {pc.icon} {r.priority}
                        </span>
                      </div>
                      <div>
                        <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2 py-1 rounded-full ${sc.bg} ${sc.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />{r.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {!isDone && (
                          <>
                            <button onClick={() => handleComplete(r.id)} title="Complete"
                              className="w-8 h-8 rounded-lg bg-green-50 hover:bg-green-100 text-green-600 flex items-center justify-center text-sm transition-all">
                              <FiCheckCircle />
                            </button>
                            <button onClick={() => setLogR(r)} title="Add Log"
                              className="w-8 h-8 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 flex items-center justify-center text-sm transition-all">
                              <MdOutlineAddTask />
                            </button>
                          </>
                        )}
                        <button onClick={() => setEditR(r)} title="Edit"
                          className="w-8 h-8 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm transition-all">
                          <FiEdit2 />
                        </button>
                        <button onClick={() => handleDelete(r.id)} title="Delete"
                          className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-600 flex items-center justify-center text-sm transition-all">
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 mt-2">
        <p className="text-xs text-slate-400">Copyright © 2026 <span className="text-blue-600 font-bold">TravelCRM</span>. All rights reserved.</p>
        <p className="text-xs text-slate-400 font-semibold">Version 1.0.0</p>
      </footer>
    </div>
  );
}