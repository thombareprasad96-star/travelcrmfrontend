// src/features/customers/pages/CustomerDetails.jsx
// ─────────────────────────────────────────────────────────────
// Customer Details (View) Page — Travel CRM
// Route: /CustomerDetails/:id
//
// Data:
//   customerService.getById(id)           → profile
//   customerService.getBookingHistory(id) → booking history table
//
// Layout (same as reference screenshot, TravelCRM design system):
//   LEFT  : Profile card + Contact Info + Documents + Notes
//   RIGHT : 4 stat cards + Booking History table
//
// Actions: Edit → /EditCustomer/:id | WhatsApp | Call | Create Lead
// ─────────────────────────────────────────────────────────────

import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  User as FiUser, ArrowLeft as FiArrowLeft, SquarePen as FaEdit,
  Phone as FaMobileAlt, Mail as FaEnvelope, MapPin as FaMapMarkerAlt,
  Building as MdLocationCity, Calendar as FaCalendarAlt,
  Plane as FaPlane, IndianRupee as FaRupeeSign, Wallet as FaWallet,
  TrendingUp as FiTrendingUp, History as FaHistory,
  StickyNote as FaStickyNote, Crown as FaCrown,
  MessageCircleMore as FaCommentDots, Plus as FaPlus, Eye as FaEye,
  Contact as MdOutlineContactPhone, Clock as FiClock,
  PhoneCall as FiPhoneCall,
} from "lucide-react";
import { WhatsAppIcon as FaWhatsapp } from "@shared/ui/WhatsAppIcon";

import customerService from "../api/customerService";

const FONT = "'Plus Jakarta Sans', system-ui, sans-serif";

/* ─── HELPERS ────────────────────────────────────────────────── */
const fmtINR   = (n) => "₹" + Number(n || 0).toLocaleString("en-IN");
const fmtDate  = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" }) : "—";
const initials = (name) => (name || "").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "?";

const AVATAR_COLORS = [
  "from-blue-500 to-blue-600","from-purple-500 to-purple-600","from-teal-500 to-teal-600",
  "from-rose-500 to-rose-600","from-amber-500 to-amber-600","from-indigo-500 to-indigo-600",
  "from-green-500 to-green-600","from-cyan-500 to-cyan-600","from-pink-500 to-pink-600",
  "from-orange-500 to-orange-600",
];
const avatarGrad = (id) => {
  const n = parseInt(String(id).replace(/\D/g, ""), 10) || 0;
  return AVATAR_COLORS[n % AVATAR_COLORS.length];
};

/* ─── BADGE CONFIGS (same as AllCustomers) ───────────────────── */
const TIER_CONFIG = {
  Platinum:{ bg:"bg-slate-800",  text:"text-slate-100",  border:"border-slate-400",  icon:"💎" },
  Gold:    { bg:"bg-yellow-100", text:"text-yellow-800", border:"border-yellow-400", icon:"🥇" },
  Silver:  { bg:"bg-slate-100",  text:"text-slate-700",  border:"border-slate-300",  icon:"🥈" },
  Bronze:  { bg:"bg-orange-100", text:"text-orange-700", border:"border-orange-300", icon:"🥉" },
};
const TYPE_CONFIG = {
  Individual:{ bg:"bg-blue-100",   text:"text-blue-700",   border:"border-blue-200"   },
  Corporate: { bg:"bg-indigo-100", text:"text-indigo-700", border:"border-indigo-200" },
  VIP:       { bg:"bg-purple-100", text:"text-purple-700", border:"border-purple-200" },
  Group:     { bg:"bg-teal-100",   text:"text-teal-700",   border:"border-teal-200"   },
  Agent:     { bg:"bg-amber-100",  text:"text-amber-700",  border:"border-amber-200"  },
  Regular:   { bg:"bg-green-100",  text:"text-green-700",  border:"border-green-200"  },
};
const STATUS_CONFIG = {
  Active:  { bg:"bg-emerald-100", text:"text-emerald-700", dot:"bg-emerald-500" },
  Inactive:{ bg:"bg-slate-100",   text:"text-slate-500",   dot:"bg-slate-400"   },
  Blocked: { bg:"bg-red-100",     text:"text-red-600",     dot:"bg-red-500"     },
};
const BOOKING_STATUS = {
  Completed: { bg:"bg-green-100", text:"text-green-700" },
  Confirmed: { bg:"bg-blue-100",  text:"text-blue-700"  },
  Pending:   { bg:"bg-amber-100", text:"text-amber-700" },
  Cancelled: { bg:"bg-red-100",   text:"text-red-600"   },
};

/* ─── TOAST ──────────────────────────────────────────────────── */
function Toast({ msg, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className={`fixed top-5 right-5 z-[999] flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl max-w-xs
      ${type === "success" ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800"}`}
      style={{ animation:"slideIn .3s ease both" }}>
      <span className="text-lg">{type === "success" ? "✅" : "❌"}</span>
      <p className="text-sm font-semibold flex-1">{msg}</p>
      <button onClick={onClose} className="opacity-50 hover:opacity-100 text-lg ml-1 leading-none">×</button>
    </div>
  );
}

/* ─── SKELETON ───────────────────────────────────────────────── */
function SkeletonBlock({ h = "h-64" }) {
  return <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm ${h} animate-pulse`}/>;
}

/* ─── ANIMATED STAT CARD ─────────────────────────────────────── */
function StatCard({ icon: Icon, label, value, gradient, currency, sub, delay = 0 }) {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    let start = 0;
    const target = Number(value) || 0;
    if (target === 0) { setDisplayed(0); return; }
    const step = Math.max(1, Math.ceil(target / 60));
    const interval = setInterval(() => {
      start = Math.min(start + step, target);
      setDisplayed(start);
      if (start >= target) clearInterval(interval);
    }, 16);
    return () => clearInterval(interval);
  }, [value]);

  const display = currency ? fmtINR(displayed) : displayed.toLocaleString("en-IN");

  return (
    <div className={`bg-gradient-to-br ${gradient} rounded-2xl p-5 text-white shadow-lg relative overflow-hidden group
      hover:-translate-y-1 hover:shadow-xl transition-all duration-300 fade-up`}
      style={{ animationDelay:`${delay}ms` }}>
      <div className="absolute -right-5 -top-5 w-24 h-24 rounded-full bg-white/10 group-hover:scale-110 transition-transform duration-300"/>
      <div className="absolute -right-3 -bottom-8 w-32 h-32 rounded-full bg-white/10 group-hover:scale-110 transition-transform duration-300"/>
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 group-hover:bg-white/30 flex items-center justify-center transition-all">
            <Icon className="w-5 h-5"/>
          </div>
          {sub && <span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded-full">{sub}</span>}
        </div>
        <p className="text-2xl font-extrabold leading-none mb-1">{display}</p>
        <p className="text-xs font-bold uppercase tracking-widest opacity-80">{label}</p>
      </div>
    </div>
  );
}

/* ─── INFO ROW (contact card) ────────────────────────────────── */
function InfoRow({ icon: Icon, label, value, iconClass }) {
  return (
    <div className="flex items-start gap-3 px-5 py-3 border-b border-slate-50 last:border-0">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${iconClass}`}>
        <Icon className="w-3.5 h-3.5"/>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-slate-400 font-medium">{label}</p>
        <p className="text-sm font-bold text-slate-700 break-words">{value || "—"}</p>
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════
   MAIN COMPONENT
═════════════════════════════════════════════════════════════ */
export default function CustomerDetails() {
  const navigate = useNavigate();
  const { id }   = useParams();

  const [customer, setCustomer]       = useState(null);
  const [bookings, setBookings]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [loadingBk, setLoadingBk]     = useState(true);
  const [notFound, setNotFound]       = useState(false);
  const [toast, setToast]             = useState(null);

  const showToast = useCallback((msg, type = "success") => setToast({ msg, type }), []);

  /* ── Load customer + booking history ────────────────────── */
  useEffect(() => {
    if (!id) { setNotFound(true); setLoading(false); setLoadingBk(false); return; }

    setLoading(true);
    customerService
      .getById(id)
      .then((res) => {
        const c = res.data?.data ?? res.data;
        if (c && (c.name || c.id || c.customerId)) setCustomer(c);
        else setNotFound(true);
      })
      .catch(() => {
        setNotFound(true);
        showToast("Failed to load customer details.", "error");
      })
      .finally(() => setLoading(false));

    setLoadingBk(true);
    customerService
      .getBookingHistory(id)
      .then((res) => {
        const raw = res.data?.data ?? res.data ?? [];
        setBookings(Array.isArray(raw) ? raw : []);
      })
      .catch(() => setBookings([]))   // booking API optional — fail silently
      .finally(() => setLoadingBk(false));
  }, [id, showToast]);

  /* ── Normalize booking fields (backend DTO safe) ────────── */
  const normBookings = useMemo(() => bookings.map((b) => ({
    id:     b.publicId || b.bookingId || b.id || null,   // UUID → BookingDetails navigation
    code:   b.bookingCode || b.code || "—",              // display code (e.g. BKG-26-0002)
    title:  b.title || b.packageName || b.destination || b.dest || "—",
    date:   b.travelDate || b.date || b.startDate || null,
    amount: Number(b.amount ?? b.totalAmount ?? b.amt ?? 0),
    paid:   Number(b.paidAmount ?? b.paid ?? b.amountPaid ?? 0),
    status: b.status || "Pending",
  })), [bookings]);

  /* ── Stats (bookings se compute, customer fields fallback) ─ */
  const stats = useMemo(() => {
    const totalBookings = normBookings.length || Number(customer?.bookings || 0);
    const totalSpent = normBookings.length
      ? normBookings.reduce((s, b) => s + b.amount, 0)
      : Number(customer?.spent || 0);
    const totalPaid = normBookings.reduce((s, b) => s + b.paid, 0);
    const avg = totalBookings ? Math.round(totalSpent / totalBookings) : 0;
    return { totalBookings, totalSpent, totalPaid, avg };
  }, [normBookings, customer]);

  const sortedDates = useMemo(
    () => normBookings.map(b => b.date).filter(Boolean).sort(),
    [normBookings]
  );
  const firstBooking = customer?.firstBooking || sortedDates[0] || null;
  const lastBooking  = customer?.lastBooking  || sortedDates[sortedDates.length - 1] || null;

  const code = customer?.id || customer?.customerId || id;
  const tc   = TIER_CONFIG[customer?.tier]     || TIER_CONFIG.Bronze;
  const tyc  = TYPE_CONFIG[customer?.type]     || TYPE_CONFIG.Individual;
  const sc   = STATUS_CONFIG[customer?.status] || STATUS_CONFIG.Inactive;
  const grad = avatarGrad(code);
  const waLink = `https://wa.me/${(customer?.phone || "").replace(/\D/g, "")}`;

  /* ── RENDER ──────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100"
      style={{ fontFamily: FONT }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        @keyframes slideIn { from{transform:translateX(110%);opacity:0} to{transform:translateX(0);opacity:1} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .fade-up { animation: fadeUp .4s ease both; }
        ::-webkit-scrollbar{width:5px;height:5px}
        ::-webkit-scrollbar-track{background:#f1f5f9;border-radius:99px}
        ::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:99px}
      `}</style>

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)}/>}

      {/* ── PAGE HEADER ── */}
      <div className="bg-white/70 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-400
                flex items-center justify-center text-white shadow-lg shadow-blue-200 flex-shrink-0">
                <FiUser className="w-5 h-5"/>
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-lg font-extrabold text-slate-800 tracking-tight">Customer Details</h1>
                  {customer && (
                    <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-2.5 py-1
                      rounded-full border border-blue-200">
                      {code}
                    </span>
                  )}
                  {loading && <span className="text-xs text-slate-400 font-medium animate-pulse">Loading…</span>}
                </div>
                <p className="text-xs text-slate-400 hidden sm:block mt-0.5">
                  <span className="hover:text-blue-600 cursor-pointer" onClick={() => navigate("/")}>Home</span>
                  <span className="mx-1 text-slate-300">/</span>
                  <span className="hover:text-blue-600 cursor-pointer" onClick={() => navigate("/AllCustomers")}>Customers</span>
                  <span className="mx-1 text-slate-300">/</span>
                  <span className="text-blue-600 font-bold">View</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button type="button" onClick={() => navigate("/AllCustomers")}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200
                  hover:border-blue-300 bg-white hover:bg-blue-50 text-slate-600 hover:text-blue-700
                  text-sm font-bold transition-all shadow-sm">
                <FiArrowLeft className="w-4 h-4"/> Back
              </button>
              {customer && (
                <button type="button" onClick={() => navigate(`/EditCustomer/${code}`)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500
                    hover:from-indigo-700 hover:to-indigo-600 text-white text-sm font-bold
                    shadow-md shadow-indigo-200 hover:shadow-lg transition-all">
                  <FaEdit className="w-4 h-4"/> Edit Customer
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6">

        {/* ── LOADING SKELETON ── */}
        {loading ? (
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-80 xl:w-96 flex-shrink-0 space-y-5">
              <SkeletonBlock h="h-80"/>
              <SkeletonBlock h="h-72"/>
            </div>
            <div className="flex-1 space-y-5">
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => <SkeletonBlock key={i} h="h-32"/>)}
              </div>
              <SkeletonBlock h="h-96"/>
            </div>
          </div>

        /* ── NOT FOUND ── */
        ) : notFound || !customer ? (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm text-center py-24 px-6 fade-up">
            <div className="text-6xl mb-4">😕</div>
            <p className="text-lg font-extrabold text-slate-600 mb-1">Customer Not Found</p>
            <p className="text-sm text-slate-400 mb-6">
              This customer may have been deleted or the link is invalid.
            </p>
            <button onClick={() => navigate("/AllCustomers")}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm
                shadow-md shadow-blue-200 transition-all inline-flex items-center gap-2">
              <FiArrowLeft className="w-4 h-4"/> Back to Customers
            </button>
          </div>

        /* ── DETAILS ── */
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">

            {/* ══ LEFT COLUMN — Profile + Contact ══ */}
            <div className="w-full lg:w-80 xl:w-96 flex-shrink-0 space-y-5">

              {/* ── PROFILE CARD ── */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden fade-up">
                {/* Avatar + name */}
                <div className="relative pt-8 pb-6 px-6 text-center">
                  <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-r from-blue-600 to-blue-400"/>
                  <div className={`relative w-20 h-20 rounded-3xl bg-gradient-to-br ${grad} flex items-center
                    justify-center text-white text-2xl font-extrabold shadow-lg mx-auto border-4 border-white`}>
                    {initials(customer.name)}
                  </div>
                  <div className="mt-3 flex items-center justify-center gap-1.5">
                    <h2 className="text-lg font-extrabold text-slate-800">{customer.name}</h2>
                    {customer.type === "VIP" && <FaCrown className="w-4 h-4 text-amber-500"/>}
                  </div>
                  <p className="text-xs font-extrabold text-blue-600 mt-0.5">{code}</p>

                  {/* Badges */}
                  <div className="flex items-center justify-center gap-1.5 mt-3 flex-wrap">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${tyc.border} ${tyc.bg} ${tyc.text}`}>
                      {customer.type || "—"}
                    </span>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${tc.border} ${tc.bg} ${tc.text}`}>
                      {tc.icon} {customer.tier || "—"}
                    </span>
                    <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${sc.bg} ${sc.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`}/>
                      {customer.status || "—"}
                    </span>
                  </div>
                </div>

                {/* Key/value rows */}
                <div className="border-t border-slate-50">
                  {[
                    ["Customer Type", customer.type],
                    ["Loyalty Tier",  customer.tier ? `${tc.icon} ${customer.tier}` : null],
                    ["Total Bookings", String(stats.totalBookings)],
                    ["Total Spent",   fmtINR(stats.totalSpent)],
                    ["Member Since",  fmtDate(customer.createdAt || customer.memberSince)],
                  ].map(([label, val]) => (
                    <div key={label} className="flex items-center justify-between px-6 py-3 border-b border-slate-50 last:border-0">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</span>
                      <span className="text-sm font-extrabold text-slate-700">{val || "—"}</span>
                    </div>
                  ))}
                </div>

                {/* Action buttons */}
                <div className="p-5 space-y-2.5 bg-slate-50/60 border-t border-slate-100">
                  <button onClick={() => navigate(`/EditCustomer/${code}`)}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500
                      hover:from-indigo-700 hover:to-indigo-600 text-white text-sm font-bold flex items-center
                      justify-center gap-2 shadow-md shadow-indigo-200 transition-all">
                    <FaEdit className="w-4 h-4"/> Edit Customer
                  </button>
                  <div className="flex gap-2.5">
                    <a href={waLink} target="_blank" rel="noreferrer"
                      className="flex-1 py-3 rounded-2xl bg-green-500 hover:bg-green-600 text-white
                        text-sm font-bold flex items-center justify-center gap-2 transition-all">
                      <FaWhatsapp className="w-4 h-4"/> WhatsApp
                    </a>
                    <a href={`tel:${customer.phone || ""}`}
                      className="flex-1 py-3 rounded-2xl bg-white hover:bg-slate-100 text-slate-600
                        text-sm font-bold flex items-center justify-center gap-2 transition-all
                        border border-slate-200">
                      <FiPhoneCall className="w-4 h-4"/> Call
                    </a>
                  </div>
                </div>
              </div>

              {/* ── CONTACT INFORMATION ── */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden fade-up"
                style={{ animationDelay:"60ms" }}>
                <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-xl">📞</div>
                  <div>
                    <h2 className="text-white font-extrabold text-base">Contact Information</h2>
                    <p className="text-blue-100 text-xs">Phone, email, address & activity</p>
                  </div>
                </div>
                <div className="py-2">
                  <InfoRow icon={FaMobileAlt} label="Phone" value={customer.phone}
                    iconClass="bg-green-50 text-green-600"/>
                  {customer.alternatePhone && (
                    <InfoRow icon={MdOutlineContactPhone} label="Alternate Phone" value={customer.alternatePhone}
                      iconClass="bg-teal-50 text-teal-600"/>
                  )}
                  <InfoRow icon={FaEnvelope} label="Email" value={customer.email}
                    iconClass="bg-blue-50 text-blue-600"/>
                  <InfoRow icon={FaCommentDots} label="Communication Preference" value={customer.commPref}
                    iconClass="bg-purple-50 text-purple-600"/>
                  <InfoRow icon={MdLocationCity} label="City / State"
                    value={[customer.city, customer.state].filter(Boolean).join(", ")}
                    iconClass="bg-orange-50 text-orange-600"/>
                  {(customer.address || customer.pincode) && (
                    <InfoRow icon={FaMapMarkerAlt} label="Full Address"
                      value={[customer.address, customer.pincode].filter(Boolean).join(" — ")}
                      iconClass="bg-rose-50 text-rose-600"/>
                  )}
                  <InfoRow icon={FaCalendarAlt} label="First Booking" value={fmtDate(firstBooking)}
                    iconClass="bg-indigo-50 text-indigo-600"/>
                  <InfoRow icon={FiClock} label="Last Booking" value={fmtDate(lastBooking)}
                    iconClass="bg-cyan-50 text-cyan-600"/>
                </div>
              </div>

              {/* ── DOCUMENTS (agar available) ── */}
              {(customer.passportNo || customer.panNo || customer.aadharNo || customer.documents) && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden fade-up"
                  style={{ animationDelay:"100ms" }}>
                  <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 px-6 py-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-xl">🗂️</div>
                    <div>
                      <h2 className="text-white font-extrabold text-base">Documents</h2>
                      <p className="text-indigo-100 text-xs">Passport, PAN & Aadhar details</p>
                    </div>
                  </div>
                  <div className="p-5 space-y-3">
                    <div className="grid grid-cols-1 gap-2">
                      {[["Passport No.", customer.passportNo],
                        ["PAN Number",   customer.panNo],
                        ["Aadhar Number",customer.aadharNo]]
                        .filter(([, v]) => v)
                        .map(([l, v]) => (
                          <div key={l} className="flex items-center justify-between bg-indigo-50/60 rounded-xl px-4 py-2.5 border border-indigo-100">
                            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">{l}</span>
                            <span className="text-sm font-extrabold text-indigo-800">{v}</span>
                          </div>
                        ))}
                    </div>
                    {customer.documents && (
                      <p className="text-xs text-slate-500 leading-relaxed bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
                        {customer.documents}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* ── NOTES (agar available) ── */}
              {customer.notes && (
                <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100 fade-up"
                  style={{ animationDelay:"140ms" }}>
                  <p className="text-xs font-extrabold text-amber-700 mb-2 flex items-center gap-1.5">
                    <FaStickyNote className="w-3.5 h-3.5"/> Preferences & Notes
                  </p>
                  <p className="text-sm text-amber-800 leading-relaxed">{customer.notes}</p>
                </div>
              )}
            </div>

            {/* ══ RIGHT COLUMN — Stats + Booking History ══ */}
            <div className="flex-1 min-w-0 space-y-6">

              {/* ── STAT CARDS ── */}
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                <StatCard icon={FaPlane}     label="Total Bookings" value={stats.totalBookings}
                  gradient="from-cyan-500 to-cyan-600" delay={0}/>
                <StatCard icon={FaRupeeSign} label="Total Spent" value={stats.totalSpent} currency
                  gradient="from-blue-600 to-blue-700" delay={60}/>
                <StatCard icon={FiTrendingUp} label="Avg. Booking" value={stats.avg} currency
                  gradient="from-indigo-500 to-indigo-600" delay={120}/>
                <StatCard icon={FaWallet}    label="Total Paid" value={stats.totalPaid} currency
                  gradient="from-emerald-500 to-green-600" delay={180}/>
              </div>

              {/* ── BOOKING HISTORY CARD ── */}
              <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden fade-up"
                style={{ animationDelay:"120ms" }}>

                {/* Card header */}
                <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="text-base font-extrabold text-slate-700 flex items-center gap-2">
                      <FaHistory className="w-4 h-4 text-blue-500"/> Booking History
                    </h2>
                    <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2.5 py-1 rounded-full">
                      {normBookings.length} bookings
                    </span>
                  </div>
                  {/* TODO: apna Create Lead route yaha adjust karo */}
                  <button onClick={() => navigate("/Createlead")}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700
                      text-white text-xs font-bold shadow-md shadow-blue-200 transition-all self-start sm:self-auto">
                    <FaPlus className="w-3.5 h-3.5"/> Create Lead
                  </button>
                </div>

                {/* ── Loading rows ── */}
                {loadingBk ? (
                  <div className="p-5 space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-12 rounded-xl bg-slate-100 animate-pulse"/>
                    ))}
                  </div>

                /* ── Empty state ── */
                ) : normBookings.length === 0 ? (
                  <div className="text-center py-20 px-6">
                    <div className="text-5xl mb-3">✈️</div>
                    <p className="text-base font-extrabold text-slate-600 mb-1">No Bookings Yet</p>
                    <p className="text-sm text-slate-400 mb-5">
                      This customer hasn't made any bookings. Create a lead to get started.
                    </p>
                    <button onClick={() => navigate("/Createlead")}
                      className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm
                        shadow-md shadow-blue-200 transition-all inline-flex items-center gap-2">
                      <FaPlus className="w-3.5 h-3.5"/> Create Lead
                    </button>
                  </div>

                ) : (
                  <>
                    {/* ── DESKTOP TABLE ── */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full min-w-[760px]">
                        <thead className="bg-slate-50/80 border-b border-slate-100">
                          <tr>
                            {["Booking Code","Title","Travel Date","Amount","Payment","Status","Actions"].map(h => (
                              <th key={h} className="px-4 py-3.5 text-left text-xs font-extrabold text-slate-500
                                uppercase tracking-wider whitespace-nowrap">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {normBookings.map((b, idx) => {
                            const bsc = BOOKING_STATUS[b.status] || { bg:"bg-slate-100", text:"text-slate-600" };
                            const paidPct = b.amount ? Math.min(100, Math.round((b.paid / b.amount) * 100)) : 0;
                            return (
                              <tr key={`${b.code}-${idx}`}
                                className="group transition-all duration-150 hover:bg-blue-50/40 hover:shadow-[inset_3px_0_0_#2563eb]"
                                style={{ animation:"fadeUp .35s ease both", animationDelay:`${idx * 30}ms` }}>
                                <td className="px-4 py-3.5">
                                  <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                                    {b.code}
                                  </span>
                                </td>
                                <td className="px-4 py-3.5">
                                  <p className="text-sm font-bold text-slate-700 max-w-[240px] truncate">{b.title}</p>
                                </td>
                                <td className="px-4 py-3.5">
                                  <p className="text-sm font-semibold text-slate-600 whitespace-nowrap">{fmtDate(b.date)}</p>
                                </td>
                                <td className="px-4 py-3.5">
                                  <p className="text-sm font-extrabold text-slate-800 whitespace-nowrap">{fmtINR(b.amount)}</p>
                                </td>
                                <td className="px-4 py-3.5">
                                  <p className={`text-sm font-bold whitespace-nowrap ${b.paid > 0 ? "text-slate-700" : "text-slate-400"}`}>
                                    {b.paid > 0 ? fmtINR(b.paid) : "—"}
                                  </p>
                                  {b.amount > 0 && (
                                    <div className="w-16 h-1 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                                      <div className={`h-full rounded-full transition-all
                                        ${paidPct >= 100 ? "bg-green-500" : paidPct > 0 ? "bg-amber-400" : "bg-slate-200"}`}
                                        style={{ width:`${paidPct}%` }}/>
                                    </div>
                                  )}
                                </td>
                                <td className="px-4 py-3.5">
                                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${bsc.bg} ${bsc.text}`}>
                                    {b.status}
                                  </span>
                                </td>
                                <td className="px-4 py-3.5">
                                  <button onClick={() => navigate(`/BookingDetails/${b.id || b.code}`)} title="View Booking"
                                    className="w-8 h-8 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600
                                      flex items-center justify-center transition-all">
                                    <FaEye className="w-4 h-4"/>
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* ── MOBILE CARDS ── */}
                    <div className="md:hidden p-4 space-y-3">
                      {normBookings.map((b, idx) => {
                        const bsc = BOOKING_STATUS[b.status] || { bg:"bg-slate-100", text:"text-slate-600" };
                        return (
                          <div key={`${b.code}-m-${idx}`}
                            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-3 fade-up"
                            style={{ animationDelay:`${idx * 40}ms` }}>
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg">
                                  {b.code}
                                </span>
                                <p className="text-sm font-bold text-slate-800 mt-1.5 truncate">{b.title}</p>
                              </div>
                              <span className={`text-xs font-bold px-2 py-1 rounded-full flex-shrink-0 ${bsc.bg} ${bsc.text}`}>
                                {b.status}
                              </span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-xs">
                              <div className="bg-slate-50 rounded-lg px-3 py-2">
                                <p className="text-slate-400">Travel</p>
                                <p className="font-bold text-slate-700">{fmtDate(b.date)}</p>
                              </div>
                              <div className="bg-slate-50 rounded-lg px-3 py-2">
                                <p className="text-slate-400">Amount</p>
                                <p className="font-extrabold text-slate-800">{fmtINR(b.amount)}</p>
                              </div>
                              <div className="bg-slate-50 rounded-lg px-3 py-2">
                                <p className="text-slate-400">Paid</p>
                                <p className="font-bold text-slate-700">{b.paid > 0 ? fmtINR(b.paid) : "—"}</p>
                              </div>
                            </div>
                            <button onClick={() => navigate(`/BookingDetails/${b.id || b.code}`)}
                              className="w-full py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600
                                border border-blue-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-all">
                              <FaEye className="w-3.5 h-3.5"/> View Booking
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}