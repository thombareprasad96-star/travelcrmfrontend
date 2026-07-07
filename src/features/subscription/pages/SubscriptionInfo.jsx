// src/components/Settings/SubscriptionInfo.jsx
// ─────────────────────────────────────────────────────────────
// Subscription Information Page — Travel CRM
// Route: /Subscription
// Matches CRM design system: glass cards, gradients, Plus Jakarta Sans
// Reference: company/subscription_info.php screenshot
// Features:
//   - Current Plan Details card (left, large):
//       Plan Name | Description | Price | Duration | Max Users
//       Start Date | End Date | Status badge (Active/Expired)
//       Days remaining progress bar
//   - Available Modules card (right):
//       13 modules with green checkmarks
//   - Usage Stats row (users used / days left / plan tier badge)
//   - Upgrade CTA banner (bottom)
//   - Fully responsive (2-col desktop, 1-col mobile)
// ─────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft, FiCheck, FiChevronRight,
  FiCalendar, FiUsers, FiClock,
  FiZap, FiShield, FiStar,
} from "react-icons/fi";
import {
  FaCheckCircle, FaCrown, FaRocket,
  FaUserAlt, FaBuilding,
} from "react-icons/fa";
import { MdOutlineSubscriptions } from "react-icons/md";

// ── Uncomment when backend ready ─────────────────────────────
// import subscriptionService from "../api/subscriptionService";

/* ─── MOCK DATA ──────────────────────────────────────────────── */
const MOCK_PLAN = {
  planName:     "Dolphin Plan Monthly - Subscription",
  description:  "Dolphin Plan Monthly - Subscription",
  price:        1890.00,
  duration:     30,
  maxUsers:     11,
  activeUsers:  4,
  startDate:    "29 May 2026",
  endDate:      "28 Jun 2026",
  daysLeft:     3,
  status:       "Active",
  tier:         "Dolphin",
};

const MODULES = [
  "Booking Management",
  "Customer Management",
  "Dashboard & Core",
  "Email Configuration",
  "Lead Management",
  "Master Data Management",
  "Quotation Management",
  "Reminders & Notifications",
  "Reports & Analytics",
  "User Management",
  "Vendor Management",
  "Weblink Sharing",
  "WhatsApp Integration",
];

/* ─── TOAST ──────────────────────────────────────────────────── */
function Toast({ msg, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3800);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div className={`fixed top-5 right-5 z-[999] flex items-center gap-3 px-4 py-3.5 rounded-2xl border shadow-2xl max-w-sm
      ${type === "success" ? "bg-green-50 border-green-200 text-green-800"
      : type === "error"   ? "bg-red-50 border-red-200 text-red-800"
      : "bg-blue-50 border-blue-200 text-blue-800"}`}
      style={{ animation: "slideIn .3s ease both" }}>
      <span className="text-lg">{type === "success" ? "✅" : type === "error" ? "❌" : "ℹ️"}</span>
      <p className="text-sm font-semibold flex-1">{msg}</p>
      <button onClick={onClose} className="opacity-50 hover:opacity-100 text-lg ml-1">×</button>
    </div>
  );
}

/* ─── PLAN DETAIL ROW ────────────────────────────────────────── */
function PlanRow({ label, value, isStatus, isBold }) {
  return (
    <div className="flex items-start py-3.5 border-b border-slate-100 last:border-0">
      <span className="w-36 text-sm font-extrabold text-slate-600 flex-shrink-0">{label}:</span>
      {isStatus ? (
        <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-green-100 text-green-700 border border-green-200">
          ● {value}
        </span>
      ) : (
        <span className={`text-sm flex-1 ${isBold ? "font-extrabold text-slate-800" : "text-slate-600"}`}>
          {value}
        </span>
      )}
    </div>
  );
}

/* ─── STAT MINI CARD ─────────────────────────────────────────── */
function StatMini({ icon, label, value, sub, bg, color, delay = 0 }) {
  return (
    <div className={`${bg} rounded-2xl p-4 border border-white/60 flex items-center gap-3`}
      style={{ animation: "fadeUp .4s ease both", animationDelay: `${delay}ms` }}>
      <div className={`w-10 h-10 rounded-xl bg-white/60 flex items-center justify-center ${color} flex-shrink-0`}>
        {icon}
      </div>
      <div>
        <p className={`text-lg font-extrabold ${color}`}>{value}</p>
        <p className="text-xs font-bold text-slate-600">{label}</p>
        {sub && <p className="text-[11px] text-slate-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

/* ─── MAIN PAGE ──────────────────────────────────────────────── */
export default function SubscriptionInfo() {
  const navigate = useNavigate();

  const [plan,    setPlan]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast,   setToast]   = useState(null);

  const showToast = useCallback((msg, type = "success") => setToast({ msg, type }), []);

  useEffect(() => {
    setLoading(true);
    // BACKEND: subscriptionService.getPlanInfo().then(res => setPlan(res.data))
    const t = setTimeout(() => { setPlan(MOCK_PLAN); setLoading(false); }, 700);
    return () => clearTimeout(t);
  }, []);

  /* progress % for days remaining */
  const daysUsedPct = plan
    ? Math.min(100, Math.round(((plan.duration - plan.daysLeft) / plan.duration) * 100))
    : 0;

  /* users used % */
  const usersUsedPct = plan
    ? Math.min(100, Math.round((plan.activeUsers / plan.maxUsers) * 100))
    : 0;

  /* skeleton card */
  const SkeletonCard = () => (
    <div className="bg-white rounded-3xl border border-slate-100 p-6 space-y-4 animate-pulse">
      <div className="h-6 bg-slate-200 rounded-lg w-1/3"/>
      {[...Array(7)].map((_, i) => (
        <div key={i} className="flex gap-4 py-2">
          <div className="h-4 bg-slate-200 rounded w-28"/>
          <div className="h-4 bg-slate-100 rounded flex-1"/>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100"
      style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        @keyframes slideIn { from{transform:translateX(110%);opacity:0} to{transform:translateX(0);opacity:1} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        .fade-up { animation: fadeUp .45s ease both; }
        ::-webkit-scrollbar{width:5px}
        ::-webkit-scrollbar-track{background:#f1f5f9;border-radius:99px}
        ::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:99px}
      `}</style>

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)}/>}

      {/* ── PAGE HEADER ── */}
      <div className="bg-white/70 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600
                flex items-center justify-center text-white shadow-lg shadow-blue-200 flex-shrink-0 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-transparent"/>
                <FaCrown className="w-5 h-5 relative z-10"/>
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">
                  Subscription Information
                </h1>
                <p className="text-sm text-slate-400 mt-0.5">
                  Manage your plan and billing details
                  <span className="hidden sm:inline ml-3 text-slate-300">|</span>
                  <span className="hidden sm:inline ml-3 text-xs">
                    <span className="hover:text-blue-600 cursor-pointer transition-colors" onClick={() => navigate("/")}>Home</span>
                    <span className="mx-1 text-slate-300">/</span>
                    <span className="text-blue-600 font-bold">Subscription</span>
                  </span>
                </p>
              </div>
            </div>
            {/* Plan tier badge */}
            {plan && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl
                bg-gradient-to-r from-amber-400 to-orange-400 text-white font-extrabold text-sm shadow-md shadow-amber-200">
                <FaCrown className="w-4 h-4"/>
                {plan.tier} Plan
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6 space-y-5">

        {/* ── MINI STAT PILLS ROW ── */}
        {!loading && plan && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 fade-up">
            <StatMini
              icon={<FiClock className="w-5 h-5"/>}
              label="Days Remaining"
              value={`${plan.daysLeft} days`}
              sub={`Expires ${plan.endDate}`}
              bg="bg-blue-50 border border-blue-200"
              color="text-blue-700"
              delay={0}
            />
            <StatMini
              icon={<FiUsers className="w-5 h-5"/>}
              label="Active Users"
              value={`${plan.activeUsers} / ${plan.maxUsers}`}
              sub={`${plan.maxUsers - plan.activeUsers} seats available`}
              bg="bg-green-50 border border-green-200"
              color="text-green-700"
              delay={60}
            />
            <StatMini
              icon={<FaCrown className="w-5 h-5"/>}
              label="Current Plan"
              value={plan.tier}
              sub="Monthly Subscription"
              bg="bg-amber-50 border border-amber-200"
              color="text-amber-700"
              delay={120}
            />
          </div>
        )}

        {/* ── TWO-COLUMN GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5">

          {/* ══ LEFT — CURRENT PLAN DETAILS ══ */}
          <div className="space-y-5">
            <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden fade-up">

              {/* Card header — blue gradient matching screenshot */}
              <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-500 px-6 py-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white">
                  <MdOutlineSubscriptions className="w-5 h-5"/>
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-white">Current Plan Details</h2>
                  <p className="text-white/70 text-xs mt-0.5">Your active subscription overview</p>
                </div>
                {plan?.status === "Active" && (
                  <div className="ml-auto flex items-center gap-1.5 bg-green-400/30 px-3 py-1.5 rounded-full">
                    <div className="w-2 h-2 rounded-full bg-green-300 animate-pulse"/>
                    <span className="text-white text-xs font-extrabold">Live</span>
                  </div>
                )}
              </div>

              {loading ? (
                <div className="p-6"><SkeletonCard/></div>
              ) : (
                <div className="px-6 pb-6 pt-4">
                  {/* Plan detail rows */}
                  <div>
                    <PlanRow label="Plan Name"   value={plan.planName}    isBold/>
                    <PlanRow label="Description" value={plan.description}/>
                    <PlanRow
                      label="Price"
                      value={`₹${Number(plan.price).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`}
                      isBold
                    />
                    <PlanRow label="Duration"   value={`${plan.duration} days`}/>
                    <PlanRow label="Max Users"  value={String(plan.maxUsers)}/>
                    <PlanRow label="Start Date" value={plan.startDate}/>
                    <PlanRow label="End Date"   value={plan.endDate}/>
                    <PlanRow label="Status"     value={plan.status} isStatus/>
                  </div>

                  {/* ── Days remaining progress bar ── */}
                  <div className="mt-5 p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-extrabold text-slate-600">Subscription Period</p>
                      <p className={`text-xs font-extrabold ${plan.daysLeft <= 5 ? "text-red-600" : "text-green-600"}`}>
                        {plan.daysLeft} days left
                      </p>
                    </div>
                    {/* Days used bar */}
                    <div>
                      <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-2.5 rounded-full transition-all duration-1000
                            ${daysUsedPct >= 90 ? "bg-gradient-to-r from-red-500 to-rose-500"
                            : daysUsedPct >= 70 ? "bg-gradient-to-r from-amber-500 to-orange-400"
                            : "bg-gradient-to-r from-blue-500 to-indigo-500"}`}
                          style={{ width: `${daysUsedPct}%` }}
                        />
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-[10px] text-slate-400">{plan.startDate}</span>
                        <span className="text-[10px] text-slate-400">{plan.endDate}</span>
                      </div>
                    </div>
                    {/* Users used bar */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs font-extrabold text-slate-600">Users</p>
                        <p className="text-xs text-slate-500">
                          <span className="font-extrabold text-slate-700">{plan.activeUsers}</span>
                          {" "}/ {plan.maxUsers} used
                        </p>
                      </div>
                      <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-2.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-1000"
                          style={{ width: `${usersUsedPct}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Renew / Contact CTA */}
                  <div className="mt-4 flex flex-col sm:flex-row gap-3">
                    <button
                      className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl
                        bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600
                        text-white font-bold text-sm shadow-md shadow-blue-200 transition-all hover:scale-[1.01]">
                      <FaRocket className="w-4 h-4"/> Renew Plan
                    </button>
                    <button
                      onClick={() => showToast("Our team will contact you shortly.", "info")}
                      className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl
                        border-2 border-slate-200 hover:border-blue-300 bg-white hover:bg-blue-50
                        text-slate-600 hover:text-blue-700 font-bold text-sm transition-all">
                      Contact Support <FiChevronRight className="w-4 h-4"/>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ══ RIGHT — AVAILABLE MODULES ══ */}
          <div className="space-y-5">

            {/* Available Modules card */}
            <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden fade-up"
              style={{ animationDelay: "80ms" }}>

              {/* Teal header matching screenshot */}
              <div className="bg-gradient-to-r from-teal-500 to-cyan-500 px-5 py-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white flex-shrink-0">
                  <FiShield className="w-4 h-4"/>
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white">Available Modules</h3>
                  <p className="text-white/70 text-[11px] mt-0.5">
                    {MODULES.length} modules included in your plan
                  </p>
                </div>
              </div>

              <div className="p-5">
                {loading ? (
                  <div className="space-y-2.5 animate-pulse">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="h-5 bg-slate-200 rounded-lg"
                        style={{ width: `${55 + Math.random() * 35}%` }}/>
                    ))}
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {MODULES.map((mod, idx) => (
                      <li key={mod}
                        className="flex items-center gap-3 py-1.5 group"
                        style={{ animation: "fadeUp .35s ease both", animationDelay: `${idx * 35 + 100}ms` }}>
                        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0
                          group-hover:bg-green-200 transition-colors">
                          <FiCheck className="w-3 h-3 text-green-600 font-extrabold"/>
                        </div>
                        <span className="text-sm text-slate-700 font-medium group-hover:text-slate-900 transition-colors">
                          {mod}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Plan highlights card */}
            <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden fade-up"
              style={{ animationDelay: "160ms" }}>
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-3.5 flex items-center gap-3">
                <FaStar className="w-4 h-4 text-white"/>
                <h3 className="text-sm font-extrabold text-white">Plan Highlights</h3>
              </div>
              <div className="p-5 space-y-3">
                {[
                  { icon:<FiUsers className="w-3.5 h-3.5"/>,    text:`Up to ${plan?.maxUsers || 11} team members`,        color:"text-blue-600",  bg:"bg-blue-50"   },
                  { icon:<FiZap className="w-3.5 h-3.5"/>,      text:"Unlimited quotations",                              color:"text-amber-600", bg:"bg-amber-50"  },
                  { icon:<FaBuilding className="w-3.5 h-3.5"/>, text:"Full CRM feature access",                           color:"text-teal-600",  bg:"bg-teal-50"   },
                  { icon:<FiShield className="w-3.5 h-3.5"/>,   text:"Data security & backups",                           color:"text-green-600", bg:"bg-green-50"  },
                  { icon:<FaUserAlt className="w-3.5 h-3.5"/>,  text:"Priority customer support",                         color:"text-purple-600",bg:"bg-purple-50" },
                ].map(({ icon, text, color, bg }) => (
                  <div key={text} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl ${bg}`}>
                    <div className={`${color} flex-shrink-0`}>{icon}</div>
                    <span className="text-xs font-bold text-slate-700">{text}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* ── UPGRADE BANNER (bottom) ── */}
        {!loading && plan && (
          <div className="relative bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800
            rounded-3xl overflow-hidden shadow-xl p-6 fade-up" style={{ animationDelay: "200ms" }}>
            {/* BG decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-white/5"/>
              <div className="absolute -left-8 -bottom-12 w-48 h-48 rounded-full bg-white/5"/>
              <div className="absolute right-1/3 top-0 bottom-0 w-px bg-white/5"/>
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-5">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <FaCrown className="w-4 h-4 text-amber-400"/>
                  <span className="text-amber-400 text-xs font-extrabold uppercase tracking-widest">
                    Upgrade Available
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-white mb-1">
                  Get more with an annual plan
                </h3>
                <p className="text-slate-400 text-sm">
                  Save up to 20% with an annual subscription. Unlock advanced features and priority support.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                <button
                  onClick={() => showToast("Redirecting to upgrade options…", "info")}
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl
                    bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500
                    text-slate-900 font-extrabold text-sm shadow-lg shadow-amber-900/30
                    transition-all hover:scale-[1.02] active:scale-[0.98]">
                  <FaRocket className="w-4 h-4"/> Upgrade Plan
                </button>
                <button
                  onClick={() => showToast("Our team will contact you shortly.", "info")}
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl
                    border border-slate-600 hover:border-slate-400 text-slate-300 hover:text-white
                    font-bold text-sm transition-all">
                  Talk to Sales <FiChevronRight className="w-4 h-4"/>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// ── Fix missing FaStar import ──────────────────────────────────
function FaStar({ className }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462
        c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755
        1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539
        -1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1
        1 0 00.951-.69l1.07-3.292z"/>
    </svg>
  );
}