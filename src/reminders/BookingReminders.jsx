// src/components/BookingReminders/BookingReminders.jsx
// ─────────────────────────────────────────────────────────────
// Booking Reminders Page — Travel CRM
// Matches: Reminders.jsx / Customers.jsx design system
// Font: Plus Jakarta Sans | Tailwind CSS | React Icons
// Reference: reminders/booking_reminders.php screenshot
// ─────────────────────────────────────────────────────────────

import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiSend, FiClock, FiCheckCircle, FiFilter, FiRefreshCw,
  FiEdit2, FiTrash2, FiEye, FiPhone, FiCalendar, FiPlus,
  FiAlertCircle, FiUser, FiDollarSign, FiMapPin, FiX,
} from "react-icons/fi";
import {
  FaPlane, FaWhatsapp, FaHotel, FaPassport, FaMoneyBillWave,
  FaPlaneDeparture, FaFileInvoiceDollar, FaSuitcaseRolling,
} from "react-icons/fa";
import { MdOutlineFlightTakeoff } from "react-icons/md";

// ── Uncomment when backend is ready ──────────────────────────
import bookingReminderService from '../services/bookingReminderService';

/* ─── MOCK DATA ──────────────────────────────────────────────── */
// function daysAgo(d)  { const dt = new Date(); dt.setDate(dt.getDate() - d); return dt.toISOString(); }
// function daysAhead(d){ const dt = new Date(); dt.setDate(dt.getDate() + d); return dt.toISOString(); }

// const MOCK_BOOKING_REMINDERS = [
//   { id:1, bookingCode:"BK10001", customerName:"Arjun Sharma",   phone:"+91 98765 43210", destination:"Maldives Escape",     reminderType:"Payment_due",   message:"Balance payment of ₹85,000 due before travel date.", travelDate:daysAhead(45), reminderDate:daysAhead(2),  status:"Pending",   amount:85000,  createdAt:daysAgo(3) },
//   { id:2, bookingCode:"BK10002", customerName:"Priya Mehta",    phone:"+91 87654 32109", destination:"Singapore Hop",       reminderType:"Payment_due",   message:"Balance payment ₹52,250 pending for booking confirmation.", travelDate:daysAhead(10), reminderDate:daysAhead(1),  status:"Pending",   amount:52250,  createdAt:daysAgo(5) },
//   { id:3, bookingCode:"BK10003", customerName:"Vikram Singh",   phone:"+91 54321 09876", destination:"Dubai Explorer",      reminderType:"Document",      message:"Passport copy and visa documents required within 5 days.", travelDate:daysAhead(60), reminderDate:daysAhead(0),  status:"Sent",      amount:0,      createdAt:daysAgo(2) },
//   { id:4, bookingCode:"BK10004", customerName:"Rohit Khanna",   phone:"+91 10987 65432", destination:"Japan Cultural",      reminderType:"Visa",          message:"Visa appointment scheduled — bring all required documents.", travelDate:daysAhead(70), reminderDate:daysAhead(3),  status:"Sent",      amount:0,      createdAt:daysAgo(8) },
//   { id:5, bookingCode:"BK10005", customerName:"Sandeep Kumar",  phone:"+91 44332 21100", destination:"Singapore Hop",       reminderType:"Travel_date",   message:"Travel date approaching in 4 days — confirm final headcount.", travelDate:daysAhead(4),  reminderDate:daysAhead(0),  status:"Pending",   amount:0,      createdAt:daysAgo(1) },
//   { id:6, bookingCode:"BK10006", customerName:"Anjali Verma",   phone:"+91 43210 98765", destination:"Maldives Escape",     reminderType:"Final_payment", message:"Final payment of ₹1,45,000 due 7 days before departure.", travelDate:daysAhead(180),reminderDate:daysAhead(7),  status:"Completed",amount:145000, createdAt:daysAgo(15)},
//   { id:7, bookingCode:"BK10007", customerName:"Karan Malhotra", phone:"+91 90909 80808", destination:"Singapore Hop",       reminderType:"Itinerary",     message:"Final itinerary sent via WhatsApp and email.", travelDate:daysAhead(28), reminderDate:daysAgo(1),    status:"Completed",amount:0,      createdAt:daysAgo(10)},
//   { id:8, bookingCode:"BK10008", customerName:"Deepak Mishra",  phone:"+91 66554 43322", destination:"Bhutan Delight",      reminderType:"Visa",          message:"Bhutan permit application deadline in 3 days.", travelDate:daysAhead(35), reminderDate:daysAhead(3),  status:"Pending",   amount:0,      createdAt:daysAgo(4) },
//   { id:9, bookingCode:"BK10009", customerName:"Meera Reddy",    phone:"+91 80808 70707", destination:"Kerala Backwaters",   reminderType:"Travel_date",   message:"Houseboat check-in instructions — send 2 days before.", travelDate:daysAhead(50), reminderDate:daysAhead(48), status:"Pending",   amount:0,      createdAt:daysAgo(6) },
//   { id:10,bookingCode:"BK10010", customerName:"Neha Kapoor",    phone:"+91 99887 76655", destination:"Kashmir Family Trip", reminderType:"Payment_due",   message:"Advance payment ₹25,000 confirmation pending.", travelDate:daysAhead(90), reminderDate:daysAgo(2),    status:"Sent",      amount:25000,  createdAt:daysAgo(12)},
// ];

const REMINDER_TYPES = [
  { value:"Payment_due",   label:"Payment Due",    icon:<FaMoneyBillWave className="w-3.5 h-3.5"/>, color:"bg-amber-100 text-amber-700"  },
  { value:"Final_payment", label:"Final Payment",  icon:<FaFileInvoiceDollar className="w-3.5 h-3.5"/>, color:"bg-orange-100 text-orange-700"},
  { value:"Document",      label:"Document",       icon:<FaPassport className="w-3.5 h-3.5"/>, color:"bg-teal-100 text-teal-700"     },
  { value:"Visa",          label:"Visa",           icon:<FaPassport className="w-3.5 h-3.5"/>, color:"bg-indigo-100 text-indigo-700" },
  { value:"Travel_date",   label:"Travel Date",    icon:<FaPlaneDeparture className="w-3.5 h-3.5"/>, color:"bg-blue-100 text-blue-700"     },
  { value:"Itinerary",     label:"Itinerary",      icon:<FaSuitcaseRolling className="w-3.5 h-3.5"/>, color:"bg-purple-100 text-purple-700" },
];

const STATUS_CFG = {
  Pending:   { bg:"bg-amber-100",   text:"text-amber-700",   dot:"bg-amber-500",   icon:<FiClock className="w-3 h-3"/> },
  Sent:      { bg:"bg-blue-100",    text:"text-blue-700",    dot:"bg-blue-500",    icon:<FiSend className="w-3 h-3"/> },
  Completed: { bg:"bg-green-100",   text:"text-green-700",   dot:"bg-green-500",   icon:<FiCheckCircle className="w-3 h-3"/> },
};

const AVATAR_GRADS = [
  "from-blue-500 to-blue-600","from-purple-500 to-purple-600",
  "from-teal-500 to-teal-600","from-rose-500 to-rose-600",
  "from-amber-500 to-amber-600","from-indigo-500 to-indigo-600",
  "from-green-500 to-green-600","from-cyan-500 to-cyan-600",
];

/* ─── HELPERS ────────────────────────────────────────────────── */
function initials(n = "") {
  return n.trim().split(" ").map(w => w[0] || "").join("").slice(0, 2).toUpperCase() || "B";
}
function avatarGrad(id) { return AVATAR_GRADS[id % AVATAR_GRADS.length]; }
function fmtDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" });
}
function fmtDateTime(d) {
  if (!d) return "—";
  return new Date(d).toLocaleString("en-IN", { day:"2-digit", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit" });
}
function fmtINR(n) { return "₹" + Number(n || 0).toLocaleString("en-IN"); }

function daysUntil(dateStr) {
  const now = new Date();
  const d   = new Date(dateStr);
  const diff = Math.ceil((d - now) / 86400000);
  return diff;
}
function travelDateBadge(dateStr) {
  const diff = daysUntil(dateStr);
  if (diff < 0)  return { text: `${Math.abs(diff)} day${Math.abs(diff)!==1?"s":""} ago`, urgent:false, past:true };
  if (diff === 0) return { text: "Today", urgent: true, past:false };
  if (diff <= 7) return { text: `In ${diff} day${diff!==1?"s":""}`, urgent: true, past:false };
  return { text: `In ${diff} days`, urgent: false, past:false };
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
        <h3 className="text-lg font-extrabold text-slate-800 mb-1">Delete Booking Reminder?</h3>
        <p className="text-sm text-slate-500 mb-5">
          Remove the reminder for <span className="font-bold text-slate-700">{item?.bookingCode}</span>? This cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border-2 border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all">Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md shadow-red-200 transition-all">Yes, Delete</button>
        </div>
      </div>
    </div>
  );
}

/* ─── VIEW MODAL ─────────────────────────────────────────────── */
function ViewModal({ item, onClose }) {
  if (!item) return null;
  const sc = STATUS_CFG[item.status] || STATUS_CFG.Pending;
  const tc = REMINDER_TYPES.find(t => t.value === item.reminderType) || REMINDER_TYPES[0];
  const tBadge = travelDateBadge(item.travelDate);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[92vh] overflow-y-auto z-10"
        style={{ animation: "popIn .25s ease both" }}>
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-5 rounded-t-2xl">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${avatarGrad(item.id)} flex items-center justify-center text-white font-extrabold text-lg shadow-lg flex-shrink-0`}>
                {initials(item.customerName)}
              </div>
              <div>
                <h2 className="text-white text-lg font-extrabold">{item.customerName}</h2>
                <p className="text-white/70 text-xs mt-0.5">{item.bookingCode} · {item.destination}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${tc.color} flex items-center gap-1`}>{tc.icon} {tc.label}</span>
                  <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${sc.bg} ${sc.text}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />{item.status}
                  </span>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center text-lg transition-all flex-shrink-0">×</button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-blue-50 rounded-xl px-4 py-3 border border-blue-100">
            <p className="text-xs font-extrabold text-blue-700 mb-1">Reminder Message</p>
            <p className="text-sm text-blue-800 leading-relaxed">{item.message}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              [FiPhone,     "Phone",        item.phone,                "bg-green-50 text-green-600"],
              [FiMapPin,    "Destination",  item.destination,          "bg-purple-50 text-purple-600"],
              [FiCalendar,  "Travel Date",  fmtDate(item.travelDate),  "bg-indigo-50 text-indigo-600"],
              [FiClock,     "Reminder Date",fmtDate(item.reminderDate),"bg-amber-50 text-amber-600"],
            ].map(([Icon, label, val, ic]) => (
              <div key={label} className="flex items-center gap-3 bg-slate-50 rounded-xl p-3 border border-slate-100">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${ic}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-slate-400 font-medium">{label}</p>
                  <p className="text-sm font-bold text-slate-700 truncate">{val || "—"}</p>
                </div>
              </div>
            ))}
          </div>

          {item.amount > 0 && (
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-amber-100 text-xs font-bold uppercase tracking-widest">Amount Due</p>
                <p className="text-white text-2xl font-extrabold mt-0.5">{fmtINR(item.amount)}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-2xl">💰</div>
            </div>
          )}

          <div className={`flex items-center gap-2 px-4 py-3 rounded-xl border
            ${tBadge.urgent ? "bg-red-50 border-red-200" : "bg-slate-50 border-slate-100"}`}>
            <FaPlane className={tBadge.urgent ? "text-red-500" : "text-slate-400"} />
            <p className={`text-sm font-bold ${tBadge.urgent ? "text-red-600" : "text-slate-600"}`}>
              Travel {tBadge.past ? "was" : "is"} {tBadge.text}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            <a href={`tel:${item.phone}`}
              className="flex-1 min-w-[100px] py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold flex items-center justify-center gap-2 transition-all">
              <FiPhone className="w-3.5 h-3.5" /> Call
            </a>
            <a href={`https://wa.me/${item.phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer"
              className="flex-1 min-w-[100px] py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white text-sm font-bold flex items-center justify-center gap-2 transition-all">
              <FaWhatsapp className="w-4 h-4" /> WhatsApp
            </a>
            <button onClick={onClose}
              className="flex-1 min-w-[100px] py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-bold flex items-center justify-center gap-2 transition-all border border-slate-200">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── BOOKING REMINDER CARD ──────────────────────────────────── */
function BookingReminderCard({ item, onView, onMarkSent, onMarkComplete, onDelete, idx }) {
  const sc = STATUS_CFG[item.status] || STATUS_CFG.Pending;
  const tc = REMINDER_TYPES.find(t => t.value === item.reminderType) || REMINDER_TYPES[0];
  const tBadge = travelDateBadge(item.travelDate);
  const isDone = item.status === "Completed";

  return (
    <div className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all duration-300 group
      ${isDone ? "opacity-70 border-slate-200" : "border-slate-200 hover:border-blue-200 hover:shadow-md"}`}
      style={{ animation: "fadeUp .4s ease both", animationDelay: `${idx * 50}ms` }}>

      <div className={`h-1 w-full ${isDone ? "bg-green-500" : item.status === "Sent" ? "bg-blue-400" : "bg-amber-500"}`} />

      <div className="px-4 pt-3 pb-0 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${sc.bg} ${sc.text}`}>
            {sc.icon} {item.status}
          </span>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${tc.color}`}>
            {tc.icon} {tc.label}
          </span>
        </div>
        <button onClick={() => onDelete(item)} title="Delete"
          className="w-7 h-7 rounded-lg bg-slate-50 hover:bg-red-100 text-slate-400 hover:text-red-500 flex items-center justify-center transition-all flex-shrink-0">
          <FiTrash2 className="w-3 h-3" />
        </button>
      </div>

      <div className="p-4 pt-2 space-y-2.5">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${avatarGrad(item.id)} flex items-center justify-center text-white text-xs font-extrabold flex-shrink-0 shadow-sm`}>
            {initials(item.customerName)}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-800 truncate">{item.customerName}</p>
            <p className="text-xs text-blue-600 font-bold">{item.bookingCode} · {item.destination}</p>
          </div>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{item.message}</p>

        <div className={`flex items-center gap-1.5 text-xs font-semibold rounded-lg px-3 py-2
          ${tBadge.urgent ? "bg-red-50 text-red-600 border border-red-100" : "bg-slate-50 text-slate-500"}`}>
          <FaPlane className="w-3 h-3 flex-shrink-0" />
          Travel {tBadge.past ? "was" : ""} {tBadge.text}
        </div>

        <div className="flex items-center justify-between">
          {item.amount > 0
            ? <span className="text-sm font-extrabold text-amber-600">{fmtINR(item.amount)}</span>
            : <span className="text-xs text-slate-400">No payment due</span>}
          <span className="text-xs text-slate-400">Remind: {fmtDate(item.reminderDate)}</span>
        </div>

        <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1.5">
          <button onClick={() => onView(item)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm">
            <FiEye className="w-3 h-3" /> View
          </button>

          {item.status === "Pending" && (
            <button onClick={() => onMarkSent(item.id)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-sm">
              <FiSend className="w-3 h-3" /> Mark Sent
            </button>
          )}

          {!isDone && (
            <button onClick={() => onMarkComplete(item.id)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white text-xs font-bold transition-all shadow-sm">
              <FiCheckCircle className="w-3 h-3" /> Complete
            </button>
          )}

          <a href={`https://wa.me/${item.phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-green-500 hover:bg-green-600 text-white text-xs font-bold transition-all shadow-sm">
            <FaWhatsapp className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}

/* ─── MAIN PAGE ──────────────────────────────────────────────── */
export default function BookingReminders() {
  const navigate = useNavigate();

  const [reminders, setReminders] = useState([]);
  const [fStatus,   setFStatus]   = useState("All Status");
  const [loading,   setLoading]   = useState(true);
  const [toast,     setToast]     = useState(null);
  const [viewItem,  setViewItem]  = useState(null);
  const [delItem,   setDelItem]   = useState(null);

  useEffect(() => {
  setLoading(true);

  bookingReminderService
    .getAll()
    .then((res) => {
      setReminders(res.data);
    })
    .catch(() => {
      showToast("Failed to load booking reminders.", "error");
    })
    .finally(() => {
      setLoading(false);
    });
}, []);

  const showToast = (msg, type = "success") => setToast({ msg, type });

  /* stats */
  const stats = useMemo(() => ({
    total:     reminders.length,
    pending:   reminders.filter(r => r.status === "Pending").length,
    sent:      reminders.filter(r => r.status === "Sent").length,
    completed: reminders.filter(r => r.status === "Completed").length,
  }), [reminders]);

  /* filter */
  const filtered = useMemo(() => {
    let out = [...reminders];
    if (fStatus !== "All Status") out = out.filter(r => r.status === fStatus);
    out.sort((a, b) => new Date(a.reminderDate) - new Date(b.reminderDate));
    return out;
  }, [reminders, fStatus]);

  const anyFilter = fStatus !== "All Status";

  /* handlers */
  const handleMarkSent = async (id) => {
  try {
    const res = await bookingReminderService.markSent(id);

    setReminders((prev) =>
      prev.map((r) =>
        r.id === id ? res.data : r
      )
    );

    showToast("Reminder marked as sent. 📤");
  } catch {
    showToast("Failed to update reminder.", "error");
  }
};

  const handleMarkComplete = async (id) => {
  try {
    const res = await bookingReminderService.markComplete(id);

    setReminders((prev) =>
      prev.map((r) =>
        r.id === id ? res.data : r
      )
    );

    showToast("Reminder marked as completed. ✅");
  } catch {
    showToast("Failed to update reminder.", "error");
  }
};

  const handleDelete = async () => {
  try {
    await bookingReminderService.delete(delItem.id);

    setReminders((prev) =>
      prev.filter((r) => r.id !== delItem.id)
    );

    showToast(
      `Reminder for ${delItem.bookingCode} deleted.`
    );
  } catch {
    showToast("Failed to delete reminder.", "error");
  } finally {
    setDelItem(null);
  }
};


  const resetFilters = () => setFStatus("All Status");

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
    { gradient:"from-cyan-500 to-cyan-600",     icon:<MdOutlineFlightTakeoff className="w-5 h-5"/>, label:"Total Reminders", value:stats.total     },
    { gradient:"from-amber-500 to-orange-500",  icon:<FiClock className="w-5 h-5"/>,                label:"Pending",         value:stats.pending   },
    { gradient:"from-blue-500 to-blue-600",     icon:<FiSend className="w-5 h-5"/>,                 label:"Sent",            value:stats.sent      },
    { gradient:"from-green-500 to-emerald-600", icon:<FiCheckCircle className="w-5 h-5"/>,          label:"Completed",       value:stats.completed },
  ];


  const handleRefresh = () => {
  setLoading(true);

  bookingReminderService
    .getAll()
    .then((res) => {
      setReminders(res.data);
    })
    .catch(() => {
      showToast("Failed to refresh reminders.", "error");
    })
    .finally(() => {
      setLoading(false);
    });
};

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
      {viewItem && <ViewModal item={viewItem} onClose={() => setViewItem(null)} />}
      {delItem  && <DeleteConfirm item={delItem} onClose={() => setDelItem(null)} onConfirm={handleDelete} />}

      {/* ── PAGE HEADER ── */}
      <div className="bg-white/70 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white text-xl shadow-lg shadow-blue-200">
                <FaPlane className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
                  Booking Reminders
                  <span className="hidden sm:inline text-xs bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">{reminders.length} total</span>
                </h1>
                <p className="text-sm text-slate-400 mt-0.5">
                  Payment, document & travel date alerts for confirmed bookings
                  <span className="hidden sm:inline ml-3 text-slate-300">|</span>
                  <span className="hidden sm:inline ml-3">
                    <span className="hover:text-blue-600 cursor-pointer transition-colors" onClick={() => navigate("/")}>Home</span>
                    <span className="mx-1 text-slate-300">/</span>
                    <span className="hover:text-blue-600 cursor-pointer transition-colors" onClick={() => navigate("/Reminders")}>Reminders</span>
                    <span className="mx-1 text-slate-300">/</span>
                    <span className="text-blue-600 font-bold">Booking Reminders</span>
                  </span>
                </p>
              </div>
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

        {/* ── FILTER BAR ── */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-100 shadow-sm px-5 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 flex-shrink-0">
              <FiFilter className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-bold text-slate-600">Status:</span>
            </div>
            <Sel val={fStatus} onChange={setFStatus} opts={["All Status","Pending","Sent","Completed"]} />

            <div className="flex items-center gap-2 ml-auto">
              {anyFilter && (
                <button onClick={resetFilters} className="text-xs text-red-400 hover:text-red-600 font-bold transition-colors whitespace-nowrap">
                  ✕ Clear
                </button>
              )}
              <button
                 onClick={handleRefresh}
                 className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-blue-600 font-semibold transition-colors"
                >
                <FiRefreshCw className="w-3.5 h-3.5" />
                 Refresh
              </button>
            </div>
          </div>
        </div>

        {/* ── EMPTY STATE (matches reference screenshot) ── */}
        {!loading && filtered.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm py-20 text-center fade-up">
            <FaPlane className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-lg font-extrabold text-slate-600 mb-1">No Booking Reminders Found</p>
            <p className="text-sm text-slate-400">
              {anyFilter ? "No booking reminders matching the current filters." : "No booking reminders have been created yet."}
            </p>
            {anyFilter && (
              <button onClick={resetFilters} className="mt-5 px-4 py-2 rounded-xl bg-blue-50 text-blue-600 font-bold text-sm hover:bg-blue-100 transition-all">
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* ── SKELETON ── */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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

        {/* ── CARD GRID ── */}
        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((item, idx) => (
              <BookingReminderCard
                key={item.id} item={item} idx={idx}
                onView={setViewItem}
                onMarkSent={handleMarkSent}
                onMarkComplete={handleMarkComplete}
                onDelete={setDelItem}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}