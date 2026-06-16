// src/components/Reminders/Reminders.jsx
// ─────────────────────────────────────────────────────────────
// My Reminders Page — Travel CRM
// Changes:
//   1. "Add Reminder" button navigates to /CreateReminder page (no popup)
//   2. "View Lead" button added to every active reminder card
// ─────────────────────────────────────────────────────────────

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import reminderService from "../services/reminderService";
import { useNavigate } from "react-router-dom";
import {
  FiBell, FiPlus, FiCheck, FiX, FiClock, FiAlertCircle,
  FiCheckCircle, FiEdit2, FiTrash2, FiSearch, FiChevronDown,
  FiCalendar, FiUser, FiPhone, FiEye, FiRefreshCw,
  FiFilter, FiAlertTriangle, FiLoader, FiMail, FiMapPin,
  FiTag, FiLayers, FiUserCheck, FiDollarSign, FiExternalLink,
} from "react-icons/fi";
import {
  FaWhatsapp, FaBell, FaClock, FaExclamationTriangle,
  FaCheckCircle, FaRegBell, FaBellSlash, FaStickyNote,
  FaPhoneAlt, FaUserTie, FaCrown, FaPlane, FaHotel,
} from "react-icons/fa";
import { MdSnooze, MdOutlineAddTask, MdOutlineAccessTime, MdVerified } from "react-icons/md";
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

/* ─── MOCK LEAD DETAILS ─────────────────────────────────────── */
const MOCK_LEAD_DETAILS = {
  "Pratik": {
    leadId:"LD1042", name:"Pratik", phone:"+91 88888 88888", email:"pratik.w@gmail.com",
    source:"Website", type:"Fresh Lead", stage:"New Lead", assignTo:"Rajesh Kumar",
    destination:"Goa · India", travelDate:daysAhead(20), travellers:"2 Adults",
    services:["Hotel","Flight"], budget:65000, createdAt:daysAgo(12),
    notes:"Interested in 4-star beach resort. Prefers North Goa.",
  },
  "Priyanshu Agrawal": {
    leadId:"LD1039", name:"Priyanshu Agrawal", phone:"+91 83029 32798", email:"priyanshu.a@outlook.com",
    source:"Google Ads", type:"Fresh Lead", stage:"New Lead", assignTo:"Priya Sharma",
    destination:"Manali · India", travelDate:daysAhead(15), travellers:"4 Adults, 1 Child",
    services:["Hotel","Vehicle Rental","Sightseeing"], budget:85000, createdAt:daysAgo(9),
    notes:"Family trip. Needs snow activities included.",
  },
  "Anushka Narkhede": {
    leadId:"LD1051", name:"Anushka Narkhede", phone:"+91 97309 32432", email:"anushka.n@gmail.com",
    source:"Instagram", type:"Fresh Lead", stage:"New Lead", assignTo:"Amit Patel",
    destination:"Kerala · India", travelDate:daysAhead(30), travellers:"2 Adults",
    services:["Hotel","Sightseeing"], budget:55000, createdAt:daysAgo(6),
    notes:"Honeymoon trip. Wants houseboat stay in Alleppey.",
  },
  "Anushka": {
    leadId:"LD1052", name:"Anushka", phone:"+91 87654 32100", email:"anushka.r@yahoo.com",
    source:"Referral", type:"Fresh Lead", stage:"New Lead", assignTo:"Sunita Verma",
    destination:"Rajasthan · India", travelDate:daysAhead(25), travellers:"3 Adults",
    services:["Hotel","Vehicle Rental"], budget:48000, createdAt:daysAgo(6),
    notes:"Heritage hotel preference. Jaipur-Udaipur circuit.",
  },
  "Sachin": {
    leadId:"LD1058", name:"Sachin", phone:"+91 76543 21000", email:"sachin.k@gmail.com",
    source:"WhatsApp", type:"Fresh Lead", stage:"New Lead", assignTo:"Rajesh Kumar",
    destination:"Thailand", travelDate:daysAhead(40), travellers:"2 Adults",
    services:["Flight","Hotel","Visa"], budget:120000, createdAt:daysAgo(4),
    notes:"First international trip. Needs visa guidance.",
  },
  "Arjun Sharma": {
    leadId:"LD0987", name:"Arjun Sharma", phone:"+91 98765 43210", email:"arjun.sharma@gmail.com",
    source:"Referral", type:"Repeat Customer", stage:"Follow Up", assignTo:"Priya Sharma",
    destination:"Maldives", travelDate:daysAhead(45), travellers:"2 Adults",
    services:["Hotel","Flight","Insurance"], budget:120000, createdAt:daysAgo(15),
    notes:"VIP customer. Previously booked Europe trip ₹2.1L. Anniversary trip every Dec.",
  },
  "Vikram Singh": {
    leadId:"LD0954", name:"Vikram Singh", phone:"+91 54321 09876", email:"vikramsingh@hotmail.com",
    source:"Direct Call", type:"VIP", stage:"Proposal Sent", assignTo:"Rajesh Kumar",
    destination:"Dubai (UAE)", travelDate:daysAhead(60), travellers:"5 Adults",
    services:["Hotel","Flight","Vehicle Rental","Sightseeing"], budget:200000, createdAt:daysAgo(20),
    notes:"VIP. Always books suites. Personal concierge needed.",
  },
  "Rohit Khanna": {
    leadId:"LD0911", name:"Rohit Khanna", phone:"+91 10987 65432", email:"rohit.khanna@protonmail.com",
    source:"Website", type:"VIP", stage:"Converted", assignTo:"Sunita Verma",
    destination:"Japan", travelDate:daysAhead(70), travellers:"2 Adults",
    services:["Flight","Hotel","Sightseeing","Visa"], budget:290000, createdAt:daysAgo(25),
    notes:"High net worth. Expects 24/7 support. Passport expires soon — visa pending.",
  },
  "Priya Mehta": {
    leadId:"LD0902", name:"Priya Mehta", phone:"+91 87654 32109", email:"priya.mehta@yahoo.com",
    source:"WhatsApp", type:"Regular", stage:"Converted", assignTo:"Amit Patel",
    destination:"Singapore Hop", travelDate:daysAhead(10), travellers:"2 Adults",
    services:["Flight","Hotel","Visa"], budget:104500, createdAt:daysAgo(40),
    notes:"Booking BK10003 confirmed. ₹52,250 balance payment due.",
  },
  "Neha Kapoor": {
    leadId:"LD0888", name:"Neha Kapoor", phone:"+91 99887 76655", email:"nehakapoor@gmail.com",
    source:"Social Media", type:"Regular", stage:"Converted", assignTo:"Priya Sharma",
    destination:"Kashmir · India", travelDate:daysAhead(90), travellers:"2 Adults, 2 Children",
    services:["Hotel","Vehicle Rental","Sightseeing"], budget:96000, createdAt:daysAgo(60),
    notes:"Family trips with 2 kids. Child-friendly properties. Birthday today!",
  },
  "Sandeep Kumar": {
    leadId:"LD0875", name:"Sandeep Kumar", phone:"+91 44332 21100", email:"sandeep.k@business.in",
    source:"Direct Call", type:"Corporate", stage:"Proposal Sent", assignTo:"Rajesh Kumar",
    destination:"Singapore Hop", travelDate:daysAhead(35), travellers:"12 Adults (Group)",
    services:["Flight","Hotel","Sightseeing"], budget:455000, createdAt:daysAgo(18),
    notes:"Export company. Group of 12 for incentive trip. International travel heavy.",
  },
  "Meera Reddy": {
    leadId:"LD0860", name:"Meera Reddy", phone:"+91 80808 70707", email:"meera.r@hyd.in",
    source:"Website", type:"Regular", stage:"Follow Up", assignTo:"Sunita Verma",
    destination:"Kerala · India", travelDate:daysAhead(50), travellers:"2 Adults",
    services:["Hotel","Sightseeing"], budget:65000, createdAt:daysAgo(22),
    notes:"Slow traveler. Long-stay packages preferred. Snoozed pending availability check.",
  },
  "Deepak Mishra": {
    leadId:"LD0845", name:"Deepak Mishra", phone:"+91 66554 43322", email:"deepak.m@gmail.com",
    source:"Instagram", type:"Regular", stage:"Qualified", assignTo:"Amit Patel",
    destination:"Bhutan Delight", travelDate:daysAhead(35), travellers:"2 Adults",
    services:["Hotel","Flight","Visa","Sightseeing"], budget:90000, createdAt:daysAgo(10),
    notes:"Loves adventure travel. Visa application deadline approaching.",
  },
  "Anjali Verma": {
    leadId:"LD0820", name:"Anjali Verma", phone:"+91 43210 98765", email:"anjali.v@gmail.com",
    source:"Referral", type:"Regular", stage:"Converted", assignTo:"Priya Sharma",
    destination:"Maldives Escape", travelDate:daysAhead(180), travellers:"2 Adults",
    services:["Hotel","Flight"], budget:145000, createdAt:daysAgo(90),
    notes:"Solo female traveler previously. Anniversary offer sent successfully.",
  },
  "Karan Malhotra": {
    leadId:"LD0801", name:"Karan Malhotra", phone:"+91 90909 80808", email:"karan.m@startup.io",
    source:"Direct Call", type:"Corporate", stage:"Converted", assignTo:"Rajesh Kumar",
    destination:"Singapore Hop", travelDate:daysAhead(28), travellers:"1 Adult",
    services:["Flight","Hotel"], budget:96800, createdAt:daysAgo(45),
    notes:"Startup founder. Itinerary PDF sent via WhatsApp successfully.",
  },
};

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
  { label:"1 Hour",   hours:1   },
  { label:"3 Hours",  hours:3   },
  { label:"Tomorrow", hours:24  },
  { label:"2 Days",   hours:48  },
  { label:"1 Week",   hours:168 },
];

const STAGE_CFG = {
  "New Lead":      { bg:"bg-blue-100",   text:"text-blue-700"   },
  "Contacted":     { bg:"bg-yellow-100", text:"text-yellow-700" },
  "Follow Up":     { bg:"bg-orange-100", text:"text-orange-700" },
  "Qualified":     { bg:"bg-purple-100", text:"text-purple-700" },
  "Proposal Sent": { bg:"bg-indigo-100", text:"text-indigo-700" },
  "Converted":     { bg:"bg-green-100",  text:"text-green-700"  },
  "Lost":          { bg:"bg-red-100",    text:"text-red-700"    },
};
const LEAD_TYPE_CFG = {
  "Fresh Lead":     { bg:"bg-blue-50",   text:"text-blue-700",   border:"border-blue-200"   },
  "Repeat Customer":{ bg:"bg-teal-50",   text:"text-teal-700",   border:"border-teal-200"   },
  "Corporate":      { bg:"bg-indigo-50", text:"text-indigo-700", border:"border-indigo-200" },
  "VIP":            { bg:"bg-amber-50",  text:"text-amber-700",  border:"border-amber-200"  },
  "Regular":        { bg:"bg-green-50",  text:"text-green-700",  border:"border-green-200"  },
};
const SERVICE_ICON = {
  Hotel:"🏨", Flight:"✈️", Visa:"📋", Sightseeing:"🗺️",
  "Vehicle Rental":"🚗", Insurance:"🛡️", Cruise:"🚢", "Transfer":"🚕",
};

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
function fmtDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" });
}
function fmtINR(n) {
  return "₹" + Number(n || 0).toLocaleString("en-IN");
}

/* ─── TOAST ──────────────────────────────────────────────────── */
function Toast({ msg, type, onClose }) {
  useEffect(() => {
  setLoading(true);

  reminderService
    .getAll()
    .then((res) => setReminders(res.data))
    .catch(() => showToast("Failed to load reminders.", "error"))
    .finally(() => setLoading(false));
}, []);
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

/* ─── EDIT REMINDER MODAL ────────────────────────────────────── */
/* NOTE: Add Reminder no longer uses a modal — it navigates to /CreateReminder */
function ReminderFormModal({ reminder, onClose, onSave }) {
  const [form, setForm] = useState(reminder || {
    title: "", description: "", type: "First_contact", priority: "High",
    status: "Active", leadName: "", phone: "", dueDate: "", notes: "",
  });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const dueDateForInput = form.dueDate
    ? new Date(form.dueDate).toISOString().slice(0, 16)
    : "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto z-10"
        style={{ animation: "popIn .25s ease both" }}>
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 px-6 py-5 rounded-t-2xl flex items-center justify-between">
          <div>
            <h2 className="text-white font-extrabold text-lg">Edit Reminder</h2>
            <p className="text-white/70 text-xs mt-0.5">Update reminder details</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center text-lg transition-all">×</button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5">Reminder Title *</label>
            <input value={form.title} onChange={e => set("title", e.target.value)}
              placeholder="e.g. Follow up: Arjun Sharma — Maldives trip"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700
                placeholder-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-50 outline-none transition-all" />
          </div>

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

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5">Description</label>
            <input value={form.description} onChange={e => set("description", e.target.value)}
              placeholder="Brief description of what needs to be done"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700
                placeholder-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-50 outline-none transition-all" />
          </div>

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
              className="flex-1 py-2.5 rounded-xl text-white font-bold text-sm transition-all shadow-md bg-indigo-600 hover:bg-indigo-700">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── VIEW LEAD MODAL ────────────────────────────────────────── */
function ViewLeadModal({ reminder, onClose }) {
  if (!reminder) return null;

  const lead = MOCK_LEAD_DETAILS[reminder.leadName] || {
    leadId: "—", name: reminder.leadName, phone: reminder.phone, email: "—",
    source: "—", type: "Fresh Lead", stage: "New Lead", assignTo: "—",
    destination: "—", travelDate: null, travellers: "—",
    services: [], budget: 0, createdAt: reminder.createdAt,
    notes: reminder.notes || "No additional notes available.",
  };

  const stageCfg = STAGE_CFG[lead.stage]  || STAGE_CFG["New Lead"];
  const typeCfg  = LEAD_TYPE_CFG[lead.type] || LEAD_TYPE_CFG["Fresh Lead"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto z-10"
        style={{ animation: "popIn .25s ease both" }}>

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-5 rounded-t-2xl">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${avatarGrad(lead.leadId?.length || 1)} flex items-center justify-center text-white font-extrabold text-lg shadow-lg flex-shrink-0`}>
                {initials(lead.name)}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-white text-xl font-extrabold">{lead.name}</h2>
                  {lead.type === "VIP" && <FaCrown className="w-4 h-4 text-yellow-300" />}
                </div>
                <p className="text-white/70 text-sm">{lead.leadId}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${stageCfg.bg} ${stageCfg.text}`}>
                    {lead.stage}
                  </span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${typeCfg.border} ${typeCfg.bg} ${typeCfg.text}`}>
                    {lead.type}
                  </span>
                </div>
              </div>
            </div>
            <button onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center text-lg transition-all flex-shrink-0">
              ×
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Reminder context banner */}
          <div className="bg-blue-50 rounded-xl px-4 py-3 border border-blue-100 flex items-start gap-3">
            <FiBell className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-extrabold text-blue-700">Related Reminder</p>
              <p className="text-sm font-semibold text-blue-800 mt-0.5">{reminder.title}</p>
              <p className="text-xs text-blue-500 mt-0.5">{reminder.description}</p>
            </div>
          </div>

          {/* Contact info grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              [FiPhone,     "Phone",       lead.phone,    "bg-green-50 text-green-600"  ],
              [FiMail,      "Email",       lead.email,    "bg-blue-50 text-blue-600"     ],
              [FiTag,       "Source",      lead.source,   "bg-purple-50 text-purple-600" ],
              [FiUserCheck, "Assigned To", lead.assignTo, "bg-indigo-50 text-indigo-600" ],
            ].map(([Icon, label, val, ic]) => (
              <div key={label} className="flex items-center gap-3 bg-slate-50 rounded-xl p-3 border border-slate-100">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-sm ${ic}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-slate-400 font-medium">{label}</p>
                  <p className="text-sm font-bold text-slate-700 truncate">{val || "—"}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Travel details */}
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <FaPlane className="w-3 h-3 text-blue-400" /> Travel Details
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                [FiMapPin,     "Destination", lead.destination],
                [FiCalendar,   "Travel Date", fmtDate(lead.travelDate)],
                [FiUser,       "Travellers",  lead.travellers],
                [FiDollarSign, "Budget",      fmtINR(lead.budget)],
              ].map(([Icon, label, val]) => (
                <div key={label} className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-center">
                  <Icon className="w-4 h-4 text-slate-400 mx-auto mb-1" />
                  <p className="text-xs text-slate-400 font-medium">{label}</p>
                  <p className="text-xs font-bold text-slate-700 mt-0.5 truncate">{val || "—"}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Services */}
          {lead.services?.length > 0 && (
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Services Required</p>
              <div className="flex flex-wrap gap-2">
                {lead.services.map(s => (
                  <span key={s} className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1">
                    <span>{SERVICE_ICON[s] || "📌"}</span> {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {lead.notes && (
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
              <p className="text-xs font-extrabold text-amber-700 mb-1.5 flex items-center gap-1.5">
                <FaStickyNote className="w-3 h-3" /> Lead Notes
              </p>
              <p className="text-sm text-amber-800 leading-relaxed whitespace-pre-line">{lead.notes}</p>
            </div>
          )}

          {/* Meta */}
          <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 pt-3">
            <span>Lead created: {fmtDateTime(lead.createdAt)}</span>
            <span>Reminder created: {fmtDateTime(reminder.createdAt)}</span>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2 pt-1">
            <a href={`tel:${lead.phone}`}
              className="flex-1 min-w-[100px] py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold flex items-center justify-center gap-2 transition-all">
              <FaPhoneAlt className="w-3.5 h-3.5" /> Call
            </a>
            <a href={`https://wa.me/${lead.phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer"
              className="flex-1 min-w-[100px] py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white text-sm font-bold flex items-center justify-center gap-2 transition-all">
              <FaWhatsapp className="w-4 h-4" /> WhatsApp
            </a>
            {lead.email && lead.email !== "—" && (
              <a href={`mailto:${lead.email}`}
                className="flex-1 min-w-[100px] py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-bold flex items-center justify-center gap-2 transition-all border border-slate-200">
                <FiMail className="w-3.5 h-3.5" /> Email
              </a>
            )}
            <button onClick={onClose}
              className="flex-1 min-w-[100px] py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold flex items-center justify-center gap-2 transition-all">
              <FiExternalLink className="w-3.5 h-3.5" /> Open Full Lead
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── ADD LOG MODAL ──────────────────────────────────────────── */
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
/* CHANGE 2: Added "View Lead" button alongside Complete/Snooze/Dismiss/AddLog */
function ReminderCard({ r, onComplete, onDismiss, onSnooze, onEdit, onDelete, onAddLog, onViewLead, idx }) {
  const [showSnooze, setShowSnooze] = useState(false);
  const snoozeRef = useRef(null);
  const pc = PRIORITY_CFG[r.priority] || PRIORITY_CFG.High;
  const sc = STATUS_CFG[r.status]     || STATUS_CFG.Active;
  const tc = TYPE_CFG[r.type]         || TYPE_CFG.Custom;
  const due = getDueText(r.dueDate);
  const isCompleted = r.status === "Completed";
  const isDismissed = r.status === "Dismissed";
  const isDone      = isCompleted || isDismissed;

  useEffect(() => {
    const h = e => { if (snoozeRef.current && !snoozeRef.current.contains(e.target)) setShowSnooze(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all duration-300 group
      ${isDone ? "opacity-60 border-slate-200" : due.overdue ? "border-red-200 shadow-red-50" : "border-slate-200 hover:border-blue-200 hover:shadow-md"}`}
      style={{ animation: "fadeUp .4s ease both", animationDelay: `${idx * 50}ms` }}>

      {/* Priority top stripe */}
      <div className={`h-1 w-full ${due.overdue && !isDone ? "bg-red-500" : r.status === "Snoozed" ? "bg-blue-400" : isCompleted ? "bg-green-500" : r.priority === "High" ? "bg-amber-500" : r.priority === "Medium" ? "bg-yellow-400" : "bg-slate-300"}`} />

      {/* Card top row: status + type badge | edit + delete */}
      <div className="px-4 pt-3 pb-0 flex items-center justify-between gap-2">
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
            className="w-7 h-7 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-all">
            <FiEdit2 className="w-3 h-3" />
          </button>
          <button onClick={() => onDelete(r.id)}
            className="w-7 h-7 rounded-lg bg-slate-50 hover:bg-red-100 text-slate-400 hover:text-red-500 flex items-center justify-center transition-all">
            <FiTrash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="p-4 pt-2 space-y-2.5">
        {/* Title + description */}
        <div>
          <h3 className={`text-sm font-extrabold leading-tight mb-0.5 ${isDone ? "line-through text-slate-400" : "text-slate-800"}`}>
            {r.title}
          </h3>
          <p className="text-xs text-slate-400">{r.description}</p>
        </div>

        {/* Lead row */}
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${avatarGrad(r.id)} flex items-center justify-center text-white text-xs font-extrabold flex-shrink-0`}>
            {initials(r.leadName)}
          </div>
          <div>
            <p className="text-xs font-bold text-blue-600">Lead: {r.leadName}</p>
            <p className="text-xs text-slate-400">{r.phone}</p>
          </div>
        </div>

        {/* Overdue / due badge */}
        <div className={`flex items-center gap-1.5 text-xs font-semibold rounded-lg px-3 py-2
          ${due.overdue && !isDone ? "bg-red-50 text-red-600 border border-red-100" :
            due.soon && !isDone    ? "bg-amber-50 text-amber-600 border border-amber-100" :
            isDone                 ? "bg-slate-50 text-slate-400" :
                                     "bg-slate-50 text-slate-500"}`}>
          <FiClock className="w-3 h-3 flex-shrink-0" />
          {isDone ? `Was due: ${fmtDateTime(r.dueDate)}` : due.text}
        </div>

        {/* Notes */}
        {r.notes && (
          <div className="bg-amber-50 rounded-lg px-3 py-2 border border-amber-100">
            <p className="text-xs text-amber-700 font-medium leading-relaxed">{r.notes}</p>
          </div>
        )}

        {/* Priority + datetime */}
        <div className="flex items-center justify-between">
          <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border ${pc.border} ${pc.bg} ${pc.text}`}>
            {pc.icon} {r.priority} Priority
          </span>
          <span className="text-xs text-slate-400">{fmtDateTime(r.dueDate)}</span>
        </div>

        {/* ── ACTION BUTTONS (active / snoozed) ── */}
        {!isDone && (
          <div className="pt-2 border-t border-slate-100">
            {/* Row 1: Complete | Snooze | Dismiss */}
            <div className="flex flex-wrap gap-1.5 mb-1.5">
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
            </div>

            {/* Row 2: + Add Log | 👁 View Lead | WhatsApp call */}
            <div className="flex flex-wrap gap-1.5">
              <button onClick={() => onAddLog(r)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm">
                <MdOutlineAddTask className="w-3.5 h-3.5" /> Add Log
              </button>

              {/* ── VIEW LEAD BUTTON (new) ── */}
              <button onClick={() => onViewLead(r)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold transition-all shadow-sm">
                <FiEye className="w-3 h-3" /> View Lead
              </button>

              <a href={`tel:${r.phone}`}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-sm">
                <FaPhoneAlt className="w-3 h-3" />
              </a>

              <a href={`https://wa.me/${r.phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-green-500 hover:bg-green-600 text-white text-xs font-bold transition-all shadow-sm">
                <FaWhatsapp className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}

        {/* Done state buttons */}
        {isDone && (
          <div className="pt-2 border-t border-slate-100 flex gap-2">
            <button onClick={() => onEdit(r)}
              className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition-all">
              ✏️ Edit
            </button>
            <button onClick={() => onViewLead(r)}
              className="flex-1 py-2 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-700 border border-cyan-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5">
              <FiEye className="w-3 h-3" /> View Lead
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
  const navigate = useNavigate();   // ← CHANGE 1: used for Add Reminder navigation

  const [reminders, setReminders] = useState([]);
  const [search,    setSearch]    = useState("");
  const [fStatus,   setFStatus]   = useState("All Status");
  const [fPriority, setFPriority] = useState("All Priorities");
  const [fType,     setFType]     = useState("All Types");
  const [editR,     setEditR]     = useState(null);
  const [logR,      setLogR]      = useState(null);
  const [viewLeadR, setViewLeadR] = useState(null);   // ← CHANGE 2: state for View Lead modal
  const [loading,   setLoading]   = useState(true);
  const [toast,     setToast]     = useState(null);
  const [view,      setView]      = useState("grid");
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
  const handleComplete = async (id) => {
  try {
    const res = await reminderService.markComplete(id);

    setReminders((p) =>
      p.map((r) => (r.id === id ? res.data : r))
    );

    showToast("Reminder marked as completed! ✅");
  } catch {
    showToast("Failed to complete reminder.", "error");
  }
};


  const handleDismiss = async (id) => {
  try {
    const res = await reminderService.dismiss(id);

    setReminders((p) =>
      p.map((r) => (r.id === id ? res.data : r))
    );

    showToast("Reminder dismissed.");
  } catch {
    showToast("Failed to dismiss reminder.", "error");
  }
};


  const handleSnooze = async (id, hours) => {
  const until = new Date();
  until.setHours(until.getHours() + hours);

  try {
    const res = await reminderService.snooze(
      id,
      until.toISOString()
    );

    setReminders((p) =>
      p.map((r) => (r.id === id ? res.data : r))
    );

    const opt = SNOOZE_OPTS.find((o) => o.hours === hours);

    showToast(
      `Snoozed for ${opt?.label || `${hours} hours`} 😴`
    );
  } catch {
    showToast("Failed to snooze reminder.", "error");
  }
};


  const handleDelete = async (id) => {
  try {
    await reminderService.delete(id);

    setReminders((p) =>
      p.filter((r) => r.id !== id)
    );

    showToast("Reminder deleted.");
  } catch {
    showToast("Failed to delete reminder.", "error");
  }
};


  const handleSave = async (form) => {
  if (!form.title?.trim()) {
    showToast("Title is required.", "error");
    return;
  }

  if (!form.dueDate) {
    showToast("Due date is required.", "error");
    return;
  }

  try {
    const res = await reminderService.update(
      editR.id,
      form
    );

    setReminders((p) =>
      p.map((r) =>
        r.id === editR.id ? res.data : r
      )
    );

    showToast("Reminder updated successfully.");
    setEditR(null);
  } catch (err) {
    showToast(
      err?.response?.data?.message ||
      "Failed to update.",
      "error"
    );
  }
};


  const handleAddLog = async (r, log) => {
  try {
    const res = await reminderService.addLog(
      r.id,
      log
    );

    setReminders((p) =>
      p.map((x) =>
        x.id === r.id ? res.data : x
      )
    );

    showToast("Activity log added.");
  } catch {
    showToast("Failed to add log.", "error");
  }
};


const markAllComplete = async () => {
  try {
    await reminderService.completeAllOverdue();

    const res = await reminderService.getAll();

    setReminders(res.data);

    showToast("All overdue reminders marked complete.");
  } catch {
    showToast(
      "Failed to complete overdue reminders.",
      "error"
    );
  }
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
    { gradient:"from-cyan-500 to-cyan-600",     icon:"🔔", label:"Total Reminders",  value:stats.total     },
    { gradient:"from-amber-500 to-orange-500",  icon:"⏰", label:"Active Reminders", value:stats.active    },
    { gradient:"from-red-500 to-red-600",       icon:"⚠️",  label:"Overdue",          value:stats.overdue   },
    { gradient:"from-green-500 to-emerald-600", icon:"✅", label:"Completed",         value:stats.completed },
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

      {toast      && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      {editR      && <ReminderFormModal reminder={editR} onClose={() => setEditR(null)} onSave={handleSave} />}
      {logR       && <LogModal reminder={logR} onClose={() => setLogR(null)} onSave={log => handleAddLog(logR, log)} />}
      {viewLeadR  && <ViewLeadModal reminder={viewLeadR} onClose={() => setViewLeadR(null)} />}

      {/* ── PAGE HEADER ── */}
      <div className="bg-white/70 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white text-xl shadow-lg shadow-blue-200">
                <FiBell className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
                  My Reminders
                  <span className="hidden sm:inline text-xs bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">{reminders.length} total</span>
                </h1>
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
              {/* ── CHANGE 1: Navigate to /CreateReminder instead of opening modal ── */}
              <button onClick={() => navigate("/CreateReminder")}
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
            <div key={card.label}
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
            <div className="flex items-center gap-2 flex-shrink-0">
              <FiFilter className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-bold text-slate-600">Status:</span>
            </div>
            <Sel val={fStatus}   onChange={setFStatus}   opts={["All Status",    ...STATUSES]}   />
            <span className="text-sm font-bold text-slate-600 hidden sm:block">Priority:</span>
            <Sel val={fPriority} onChange={setFPriority} opts={["All Priorities",...PRIORITIES]}  />
            <span className="text-sm font-bold text-slate-600 hidden sm:block">Type:</span>
            <Sel val={fType}     onChange={setFType}     opts={["All Types",     ...REMINDER_TYPES]} />

            <div className="relative flex-1 min-w-[200px]">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search reminders, leads..."
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700
                  placeholder-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-50 outline-none transition-all" />
            </div>

            <div className="flex items-center gap-2 ml-auto">
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
              { label:`🔴 Overdue (${stats.overdue})`,  action:() => { setFStatus("Active"); setSearch(""); } },
              { label:`⏰ Active (${stats.active})`,    action:() => setFStatus("Active")    },
              { label:`😴 Snoozed (${stats.snoozed})`, action:() => setFStatus("Snoozed")   },
              { label:`✅ Done (${stats.completed})`,   action:() => setFStatus("Completed") },
              { label:"🔥 High Priority",               action:() => setFPriority("High")    },
              { label:"💰 Payments",                    action:() => setFType("Payment")     },
            ].map(({ label, action }) => (
              <button key={label} onClick={action}
                className="text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-100 hover:bg-blue-100
                  text-slate-600 hover:text-blue-700 border border-slate-200 hover:border-blue-300 transition-all">
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Count + Refresh */}
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

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm py-20 text-center fade-up">
            <div className="text-6xl mb-4">🔔</div>
            <p className="text-lg font-extrabold text-slate-600 mb-1">No Reminders Found</p>
            <p className="text-sm text-slate-400 mb-5">
              {anyFilter ? "Adjust your filters to see results." : "You have no reminders yet. Add one to get started."}
            </p>
            {anyFilter
              ? <button onClick={resetFilters} className="px-4 py-2 rounded-xl bg-blue-50 text-blue-600 font-bold text-sm hover:bg-blue-100 transition-all">Clear Filters</button>
              : <button onClick={() => navigate("/CreateReminder")}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm shadow-md hover:bg-blue-700 transition-all flex items-center gap-2 mx-auto">
                  <FiPlus /> Add First Reminder
                </button>
            }
          </div>
        )}

        {/* Skeleton */}
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
                onViewLead={setViewLeadR}   // ← passed down
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
                    className={`px-5 py-4 transition-all duration-150 hover:bg-blue-50/40 hover:shadow-[inset_3px_0_0_#2563eb] ${isDone ? "opacity-60" : ""}`}
                    style={{ animation: "fadeUp .35s ease both", animationDelay: `${idx * 25}ms` }}>
                    {/* Mobile: full card */}
                    <div className="md:hidden">
                      <ReminderCard r={r} idx={idx}
                        onComplete={handleComplete} onDismiss={handleDismiss}
                        onSnooze={handleSnooze} onEdit={setEditR}
                        onDelete={handleDelete} onAddLog={setLogR}
                        onViewLead={setViewLeadR} />
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
                        {/* View Lead in list row */}
                        <button onClick={() => setViewLeadR(r)} title="View Lead"
                          className="w-8 h-8 rounded-lg bg-cyan-50 hover:bg-cyan-100 text-cyan-600 flex items-center justify-center text-sm transition-all">
                          <FiEye />
                        </button>
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
    </div>
  );
}