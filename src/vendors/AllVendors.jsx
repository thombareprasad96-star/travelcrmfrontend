// src/components/Vendors/Vendors.jsx
// ─────────────────────────────────────────────────────────────
// Vendors Page — Travel CRM
// Matches design system: Customers.jsx / Bookings.jsx
// Font: Plus Jakarta Sans | Tailwind CSS | React Icons
// ─────────────────────────────────────────────────────────────

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import {
  FiSearch, FiPlus, FiEdit2, FiTrash2, FiEye,
  FiDownload, FiPhone, FiMail, FiMapPin,
  FiChevronDown, FiStar, FiCheckCircle, FiAlertCircle,
  FiArrowLeft, FiArrowRight,
} from "react-icons/fi";
import {
  FaHotel, FaPlane, FaBus, FaMapMarkedAlt,
  FaHandshake, FaPercentage, FaWhatsapp,
  FaCrown, FaStar, FaMoneyBillWave, FaRegStar,
} from "react-icons/fa";
import { MdVerified, MdBusiness, MdPayment } from "react-icons/md";
import { HiSparkles } from "react-icons/hi";

/* ─── MOCK DATA ──────────────────────────────────────────────── */
const MOCK_VENDORS = [
  { id:1,  code:"VND001", name:"Royal Palace Hotels",       type:"Hotel",     contact:"Rajan Mehta",     phone:"+91 98765 43210", email:"rajan@royalpalace.in",   city:"Mumbai",    state:"Maharashtra", services:["Hotel","Breakfast","Airport Transfer"], status:"Active",  rating:4.8, totalBusiness:850000, totalPaid:720000, outstanding:130000, payStatus:"Partial",  bookings:34, verified:true,  joinDate:"2024-01-15", notes:"5-star hotel partner. Premium rooms only." },
  { id:2,  code:"VND002", name:"SkyWings Airlines",         type:"Airlines",  contact:"Priya Shah",      phone:"+91 87654 32109", email:"priya@skywings.in",      city:"Delhi",     state:"Delhi",       services:["Flights","Charter"], status:"Active",  rating:4.5, totalBusiness:1200000,totalPaid:1200000,outstanding:0,      payStatus:"Paid",     bookings:62, verified:true,  joinDate:"2023-11-20", notes:"Preferred airline partner. Group discounts available." },
  { id:3,  code:"VND003", name:"SwiftMove Transport",       type:"Transport", contact:"Amit Sharma",     phone:"+91 76543 21098", email:"amit@swiftmove.in",      city:"Jaipur",    state:"Rajasthan",   services:["Vehicle","Transfer","Sightseeing"], status:"Active",  rating:4.2, totalBusiness:320000, totalPaid:280000, outstanding:40000,  payStatus:"Partial",  bookings:48, verified:true,  joinDate:"2024-02-10", notes:"Rajasthan coverage. AC buses and luxury cars." },
  { id:4,  code:"VND004", name:"Nepal DMC Services",        type:"DMC",       contact:"Bikram Thapa",    phone:"+977 98012 34567",email:"bikram@nepaldmc.com",    city:"Kathmandu", state:"Nepal",       services:["Ground Handling","Visa","Guide"], status:"Active",  rating:4.9, totalBusiness:680000, totalPaid:650000, outstanding:30000,  payStatus:"Partial",  bookings:29, verified:true,  joinDate:"2023-09-05", notes:"Best Nepal DMC. Handles all ground operations." },
  { id:5,  code:"VND005", name:"Maldives Island Resorts",   type:"Hotel",     contact:"Ahamed Ali",      phone:"+960 300 1234",   email:"ahamed@maldivesresorts.com",city:"Malé",   state:"Maldives",    services:["Resort","Water Villa","Snorkelling"], status:"Active",  rating:4.9, totalBusiness:2100000,totalPaid:2100000,outstanding:0,      payStatus:"Paid",     bookings:18, verified:true,  joinDate:"2024-03-01", notes:"Luxury water villa partner. High-value bookings." },
  { id:6,  code:"VND006", name:"Rajasthan Roadways",        type:"Transport", contact:"Suresh Chand",    phone:"+91 65432 10987", email:"suresh@rajroadways.in",  city:"Jodhpur",   state:"Rajasthan",   services:["Bus","Coach","Tempo"], status:"Inactive",rating:3.8, totalBusiness:145000, totalPaid:145000, outstanding:0,      payStatus:"Paid",     bookings:15, verified:false, joinDate:"2024-05-20", notes:"Budget transport. Seasonal operations only." },
  { id:7,  code:"VND007", name:"Dubai Luxury Stays",        type:"Hotel",     contact:"Khalid Hassan",   phone:"+971 50 123 4567",email:"khalid@dubailuxury.ae",  city:"Dubai",     state:"UAE",         services:["Hotel","Desert Safari","City Tour"], status:"Active",  rating:4.6, totalBusiness:950000, totalPaid:820000, outstanding:130000, payStatus:"Partial",  bookings:25, verified:true,  joinDate:"2024-01-08", notes:"Dubai 4-5 star hotels. Desert safari packages included." },
  { id:8,  code:"VND008", name:"Thailand Tour Experts",     type:"DMC",       contact:"Nattaporn Siri",  phone:"+66 89 123 4567", email:"nattaporn@thaitour.com", city:"Bangkok",   state:"Thailand",    services:["Ground","Hotels","Excursions","Visa"], status:"Active",  rating:4.4, totalBusiness:560000, totalPaid:560000, outstanding:0,      payStatus:"Paid",     bookings:31, verified:true,  joinDate:"2023-12-15", notes:"Bangkok + Phuket + Chiang Mai coverage." },
  { id:9,  code:"VND009", name:"Air India Express",         type:"Airlines",  contact:"Meenakshi Rao",   phone:"+91 44332 21100", email:"meenakshi@airindia.in",  city:"Chennai",   state:"Tamil Nadu",  services:["Domestic Flights","Connecting Flights"], status:"Active",  rating:3.9, totalBusiness:430000, totalPaid:410000, outstanding:20000,  payStatus:"Partial",  bookings:40, verified:true,  joinDate:"2024-04-12", notes:"Best for South India routes. Group fares negotiated." },
  { id:10, code:"VND010", name:"Kashmir Wonders DMC",       type:"DMC",       contact:"Faisal Khan",     phone:"+91 99889 77665", email:"faisal@kashmirdmc.in",   city:"Srinagar",  state:"J&K",         services:["Ground","Houseboat","Guide","Shikara"], status:"Active",  rating:4.7, totalBusiness:390000, totalPaid:350000, outstanding:40000,  payStatus:"Partial",  bookings:22, verified:true,  joinDate:"2024-02-28", notes:"Kashmir specialist. Houseboat bookings available." },
  { id:11, code:"VND011", name:"GoRapid Cabs India",        type:"Transport", contact:"Deepak Yadav",    phone:"+91 88776 65544", email:"deepak@gorapid.in",      city:"Pune",      state:"Maharashtra", services:["Cab","Airport Transfer","Outstation"], status:"Active",  rating:4.1, totalBusiness:185000, totalPaid:185000, outstanding:0,      payStatus:"Paid",     bookings:67, verified:false, joinDate:"2024-06-01", notes:"Pan-India cab network. Competitive pricing." },
  { id:12, code:"VND012", name:"Singapore Attractions Co.", type:"DMC",       contact:"Wei Lim",         phone:"+65 8123 4567",   email:"weilim@sgexperience.sg", city:"Singapore", state:"Singapore",   services:["Tours","Cruise","Cable Car","Sentosa"], status:"Active",  rating:4.5, totalBusiness:620000, totalPaid:600000, outstanding:20000,  payStatus:"Partial",  bookings:19, verified:true,  joinDate:"2024-03-18", notes:"Universal Studios, Sentosa, Gardens by the Bay." },
  { id:13, code:"VND013", name:"Bali Paradise Resorts",     type:"Hotel",     contact:"Made Wirawan",    phone:"+62 812 3456 789",email:"made@baliparadise.id",   city:"Ubud",      state:"Bali",        services:["Villa","Spa","Cooking Class"], status:"Active",  rating:4.8, totalBusiness:780000, totalPaid:750000, outstanding:30000,  payStatus:"Partial",  bookings:21, verified:true,  joinDate:"2023-10-10", notes:"Private villas. Honeymoon & luxury packages." },
  { id:14, code:"VND014", name:"EuroTours & Transfers",     type:"DMC",       contact:"Hans Mueller",    phone:"+49 30 1234 5678",email:"hans@eurotours.de",      city:"Frankfurt", state:"Germany",     services:["Multi-city","Rail Pass","Hotels","Guide"], status:"Inactive",rating:4.2, totalBusiness:1050000,totalPaid:1050000,outstanding:0,      payStatus:"Paid",     bookings:12, verified:true,  joinDate:"2024-01-30", notes:"Europe multi-city specialists. Schengen visa support." },
  { id:15, code:"VND015", name:"Kerala Ayur Resorts",       type:"Hotel",     contact:"Rajan Nair",      phone:"+91 99877 65432", email:"rajan@keralaayur.in",    city:"Thekkady",  state:"Kerala",      services:["Ayurveda","Backwaters","Homestay"], status:"Active",  rating:4.6, totalBusiness:295000, totalPaid:275000, outstanding:20000,  payStatus:"Partial",  bookings:27, verified:true,  joinDate:"2024-04-05", notes:"Ayurveda retreat. Alleppey backwaters packages." },
];

const VENDOR_TYPES  = ["Hotel","Airlines","Transport","DMC"];
const STATUSES      = ["Active","Inactive"];
const PAY_STATUSES  = ["Paid","Partial","Unpaid"];

const TYPE_CONFIG = {
  Hotel:    { icon: FaHotel,       bg:"bg-blue-100",   text:"text-blue-700",   border:"border-blue-200",   grad:"from-blue-500 to-blue-600"    },
  Airlines: { icon: FaPlane,       bg:"bg-sky-100",    text:"text-sky-700",    border:"border-sky-200",    grad:"from-sky-500 to-sky-600"      },
  Transport:{ icon: FaBus,         bg:"bg-orange-100", text:"text-orange-700", border:"border-orange-200", grad:"from-orange-500 to-orange-600" },
  DMC:      { icon: FaMapMarkedAlt,bg:"bg-teal-100",   text:"text-teal-700",   border:"border-teal-200",   grad:"from-teal-500 to-teal-600"    },
};
const STATUS_CONFIG = {
  Active:  { bg:"bg-emerald-100", text:"text-emerald-700", dot:"bg-emerald-500" },
  Inactive:{ bg:"bg-slate-100",   text:"text-slate-500",   dot:"bg-slate-400"   },
};
const PAY_CONFIG = {
  Paid:   { bg:"bg-green-100",  text:"text-green-700"  },
  Partial:{ bg:"bg-amber-100",  text:"text-amber-700"  },
  Unpaid: { bg:"bg-red-100",    text:"text-red-600"    },
};
const DIST_CARDS = [
  { key:"Hotel",    label:"Hotels",    icon:FaHotel,       color:"bg-blue-500"   },
  { key:"Airlines", label:"Airlines",  icon:FaPlane,       color:"bg-sky-500"    },
  { key:"Transport",label:"Transport", icon:FaBus,         color:"bg-orange-500" },
  { key:"DMC",      label:"DMCs",      icon:FaMapMarkedAlt,color:"bg-teal-500"   },
  { key:"bookings", label:"Bookings",  icon:FaHandshake,   color:"bg-indigo-500" },
  { key:"cost",     label:"Total Costs",icon:FaPercentage, color:"bg-slate-600"  },
];

/* ─── HELPERS ────────────────────────────────────────────────── */
const fmtINR   = n  => "₹" + Number(n).toLocaleString("en-IN");
const fmtDate  = d  => d ? new Date(d).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}) : "—";
const fmtRating= r  => Number(r).toFixed(1);
const initials = n  => (n||"").split(" ").map(w=>w[0]||"").join("").slice(0,2).toUpperCase()||"V";

const AVATAR_GRADS = [
  "from-blue-500 to-blue-600","from-purple-500 to-purple-600",
  "from-teal-500 to-teal-600","from-rose-500 to-rose-600",
  "from-amber-500 to-amber-600","from-indigo-500 to-indigo-600",
  "from-cyan-500 to-cyan-600","from-green-500 to-green-600",
];
const avatarGrad = v => AVATAR_GRADS[v.id % AVATAR_GRADS.length];

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        i <= Math.floor(rating)
          ? <FaStar    key={i} className="w-3 h-3 text-amber-400" />
          : <FaRegStar key={i} className="w-3 h-3 text-slate-300" />
      ))}
      <span className="text-xs font-bold text-slate-600 ml-1">{fmtRating(rating)}</span>
    </div>
  );
}

/* ─── TOAST ──────────────────────────────────────────────────── */
function Toast({ msg, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className={`fixed top-5 right-5 z-[999] flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl max-w-xs
      ${type==="success" ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800"}`}
      style={{animation:"slideIn .3s ease both"}}>
      <span className="text-lg">{type==="success" ? "✅" : "❌"}</span>
      <p className="text-sm font-semibold flex-1">{msg}</p>
      <button onClick={onClose} className="opacity-50 hover:opacity-100 text-lg ml-1">×</button>
    </div>
  );
}

/* ─── ANIMATED STAT NUMBER ───────────────────────────────────── */
function AnimNum({ target, prefix="", suffix="" }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let s = 0; const step = Math.max(1, Math.ceil(target / 60));
    const iv = setInterval(() => { s = Math.min(s+step,target); setV(s); if(s>=target) clearInterval(iv); }, 14);
    return () => clearInterval(iv);
  }, [target]);
  return <span>{prefix}{v.toLocaleString("en-IN")}{suffix}</span>;
}

/* ─── STAT CARD ──────────────────────────────────────────────── */
function StatCard({ gradient, icon, label, value, money, delay=0 }) {
  const Icon = icon;
  return (
    <div className={`bg-gradient-to-br ${gradient} rounded-2xl p-5 text-white shadow-lg relative overflow-hidden
      group hover:-translate-y-1 hover:shadow-xl transition-all duration-300`}
      style={{animationDelay:`${delay}ms`}}>
      <div className="absolute -right-5 -top-5 w-24 h-24 rounded-full bg-white/10 group-hover:scale-110 transition-transform duration-300"/>
      <div className="absolute -right-3 -bottom-8 w-32 h-32 rounded-full bg-white/10 group-hover:scale-110 transition-transform duration-300"/>
      <div className="relative z-10">
        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-3">
          <Icon className="w-5 h-5"/>
        </div>
        <p className="text-2xl sm:text-3xl font-extrabold leading-none mb-1">
          {money ? <AnimNum target={value} prefix="₹"/> : <AnimNum target={value}/>}
        </p>
        <p className="text-xs font-bold uppercase tracking-widest opacity-80">{label}</p>
      </div>
    </div>
  );
}

/* ─── VENDOR VIEW MODAL ──────────────────────────────────────── */
function ViewModal({ vendor, onClose, onEdit }) {
  if (!vendor) return null;
  const tc = TYPE_CONFIG[vendor.type] || TYPE_CONFIG.Hotel;
  const sc = STATUS_CONFIG[vendor.status] || STATUS_CONFIG.Inactive;
  const pc = PAY_CONFIG[vendor.payStatus] || PAY_CONFIG.Unpaid;
  const payPct = vendor.totalBusiness > 0
    ? Math.round(vendor.totalPaid / vendor.totalBusiness * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={e => e.target===e.currentTarget && onClose()}>
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}/>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto z-10"
        style={{animation:"popIn .25s ease both"}}>
        {/* Header */}
        <div className={`bg-gradient-to-r ${tc.grad} px-6 py-5 rounded-t-2xl`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${avatarGrad(vendor)}
                flex items-center justify-center text-white font-extrabold text-lg shadow-lg flex-shrink-0`}>
                {initials(vendor.name)}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-white text-xl font-extrabold">{vendor.name}</h2>
                  {vendor.verified && <MdVerified className="w-5 h-5 text-white/80"/>}
                </div>
                <p className="text-white/70 text-sm">{vendor.code}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-white/20 text-white`}>
                    {vendor.type}
                  </span>
                  <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${sc.bg} ${sc.text}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`}/>{vendor.status}
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
          {/* Rating */}
          <div className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
            <StarRating rating={vendor.rating}/>
            <span className="text-xs text-slate-500 font-medium">{vendor.bookings} bookings total</span>
          </div>

          {/* Contact grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              [FiPhone,   "Contact",  vendor.contact,  "bg-blue-50 text-blue-600"],
              [FiPhone,   "Phone",    vendor.phone,    "bg-green-50 text-green-600"],
              [FiMail,    "Email",    vendor.email,    "bg-indigo-50 text-indigo-600"],
              [FiMapPin,  "Location", `${vendor.city}, ${vendor.state}`, "bg-teal-50 text-teal-600"],
            ].map(([Icon,label,val,ic]) => (
              <div key={label} className="flex items-center gap-3 bg-slate-50 rounded-xl p-3 border border-slate-100">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-sm ${ic}`}>
                  <Icon className="w-3.5 h-3.5"/>
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-slate-400 font-medium">{label}</p>
                  <p className="text-sm font-bold text-slate-700 truncate">{val||"—"}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Services */}
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Services Offered</p>
            <div className="flex flex-wrap gap-2">
              {vendor.services?.map(s => (
                <span key={s} className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Financials */}
          <div className="grid grid-cols-3 gap-3">
            {[
              ["Total Business", fmtINR(vendor.totalBusiness), "bg-blue-50 text-blue-700"],
              ["Total Paid",     fmtINR(vendor.totalPaid),     "bg-green-50 text-green-700"],
              ["Outstanding",    fmtINR(vendor.outstanding),   vendor.outstanding>0?"bg-amber-50 text-amber-700":"bg-slate-50 text-slate-500"],
            ].map(([label,val,style]) => (
              <div key={label} className={`rounded-xl p-3 border border-current/10 text-center ${style}`}>
                <p className="text-xs font-medium opacity-70 mb-0.5">{label}</p>
                <p className="text-sm font-extrabold">{val}</p>
              </div>
            ))}
          </div>

          {/* Payment progress */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-bold text-slate-600">Payment Progress</p>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${pc.bg} ${pc.text}`}>{vendor.payStatus}</span>
            </div>
            <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-700
                ${payPct===100?"bg-green-500":payPct>0?"bg-blue-500":"bg-slate-300"}`}
                style={{width:`${payPct}%`}}/>
            </div>
            <div className="flex justify-between mt-1.5 text-xs text-slate-400 font-medium">
              <span>Paid: {fmtINR(vendor.totalPaid)}</span>
              <span>Due: {fmtINR(vendor.outstanding)}</span>
            </div>
          </div>

          {/* Notes */}
          {vendor.notes && (
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
              <p className="text-xs font-extrabold text-amber-700 mb-1.5">📝 Vendor Notes</p>
              <p className="text-sm text-amber-800 leading-relaxed">{vendor.notes}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-2 pt-1">
            <button onClick={() => onEdit(vendor)}
              className="flex-1 min-w-[100px] py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold flex items-center justify-center gap-2 transition-all">
              <FiEdit2/> Edit Vendor
            </button>
            <a href={`https://wa.me/${vendor.phone.replace(/\D/g,"")}`} target="_blank" rel="noreferrer"
              className="flex-1 min-w-[100px] py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white text-sm font-bold flex items-center justify-center gap-2 transition-all">
              <FaWhatsapp/> WhatsApp
            </a>
            <a href={`mailto:${vendor.email}`}
              className="flex-1 min-w-[100px] py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-bold flex items-center justify-center gap-2 transition-all border border-slate-200">
              <FiMail/> Email
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── ADD / EDIT MODAL ───────────────────────────────────────── */
function VendorFormModal({ vendor, onClose, onSave }) {
  const isEdit = !!vendor;
  const [form, setForm] = useState(vendor || {
    name:"", contact:"", phone:"", email:"", city:"", state:"",
    type:"Hotel", status:"Active", payStatus:"Unpaid", notes:"",
    services:"", rating:4.0,
  });
  const set = (k,v) => setForm(p => ({...p,[k]:v}));

  const fields = [
    { key:"name",    label:"Vendor Name *",   type:"text",  placeholder:"Enter vendor company name", span:true  },
    { key:"contact", label:"Contact Person *", type:"text",  placeholder:"Contact name",             span:false },
    { key:"phone",   label:"Phone Number *",   type:"tel",   placeholder:"+91 98765 43210",          span:false },
    { key:"email",   label:"Email",            type:"email", placeholder:"vendor@company.com",       span:true  },
    { key:"city",    label:"City",             type:"text",  placeholder:"Mumbai",                   span:false },
    { key:"state",   label:"State / Country",  type:"text",  placeholder:"Maharashtra",              span:false },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={e => e.target===e.currentTarget && onClose()}>
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}/>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto z-10">
        <div className={`bg-gradient-to-r ${isEdit?"from-indigo-600 to-indigo-500":"from-blue-600 to-blue-500"} px-6 py-5 rounded-t-2xl flex items-center justify-between`}>
          <div>
            <h2 className="text-white font-extrabold text-lg">{isEdit?"Edit Vendor":"Add New Vendor"}</h2>
            <p className="text-white/70 text-xs mt-0.5">{isEdit?"Update vendor information":"Fill in the vendor details"}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center text-lg transition-all">×</button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fields.map(f => (
              <div key={f.key} className={f.span ? "sm:col-span-2" : ""}>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">{f.label}</label>
                <input type={f.type} value={form[f.key]||""} onChange={e=>set(f.key,e.target.value)}
                  placeholder={f.placeholder}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700
                    placeholder-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-50 outline-none transition-all"/>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { key:"type",      label:"Type",      opts:VENDOR_TYPES },
              { key:"status",    label:"Status",    opts:STATUSES     },
              { key:"payStatus", label:"Pay Status",opts:PAY_STATUSES },
            ].map(({key,label,opts}) => (
              <div key={key}>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">{label}</label>
                <div className="relative">
                  <select value={form[key]||""} onChange={e=>set(key,e.target.value)}
                    className="w-full px-3 pr-7 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700
                      bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-50 outline-none appearance-none cursor-pointer transition-all">
                    {opts.map(o => <option key={o}>{o}</option>)}
                  </select>
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] pointer-events-none">▼</span>
                </div>
              </div>
            ))}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5">Services (comma separated)</label>
            <input value={form.services||""} onChange={e=>set("services",e.target.value)}
              placeholder="Hotel, Breakfast, Airport Transfer"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700
                placeholder-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-50 outline-none transition-all"/>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5">Notes</label>
            <textarea value={form.notes||""} onChange={e=>set("notes",e.target.value)} rows={3}
              placeholder="Vendor notes, special terms, payment conditions..."
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700
                placeholder-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-50 outline-none transition-all resize-none"/>
          </div>

          <div className="flex gap-3 pt-1">
            <button onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border-2 border-slate-200 hover:border-slate-300 text-slate-600 font-bold text-sm transition-all bg-white hover:bg-slate-50">
              Cancel
            </button>
            <button onClick={() => onSave(form)}
              className={`flex-1 py-2.5 rounded-xl text-white font-bold text-sm transition-all shadow-md
                ${isEdit?"bg-indigo-600 hover:bg-indigo-700":"bg-blue-600 hover:bg-blue-700"}`}>
              {isEdit ? "Save Changes" : "Add Vendor"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── DELETE CONFIRM ─────────────────────────────────────────── */
function DeleteConfirm({ vendor, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={e => e.target===e.currentTarget && onClose()}>
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}/>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm z-10 p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-3xl mx-auto mb-4">🗑️</div>
        <h3 className="text-lg font-extrabold text-slate-800 mb-1">Delete Vendor?</h3>
        <p className="text-sm text-slate-500 mb-5">
          Are you sure you want to delete <span className="font-bold text-slate-700">{vendor?.name}</span>? This cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border-2 border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all">Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md transition-all">Yes, Delete</button>
        </div>
      </div>
    </div>
  );
}

/* ─── MOBILE VENDOR CARD ─────────────────────────────────────── */
function MobileVendorCard({ v, onView, onEdit, onDelete, idx }) {
  const tc = TYPE_CONFIG[v.type] || TYPE_CONFIG.Hotel;
  const sc = STATUS_CONFIG[v.status] || STATUS_CONFIG.Inactive;
  const pc = PAY_CONFIG[v.payStatus] || PAY_CONFIG.Unpaid;
  const payPct = v.totalBusiness > 0 ? Math.round(v.totalPaid/v.totalBusiness*100) : 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-3"
      style={{animation:"fadeUp .35s ease both", animationDelay:`${idx*40}ms`}}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${avatarGrad(v)} flex items-center justify-center text-white text-sm font-extrabold flex-shrink-0`}>
            {initials(v.name)}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <p className="font-extrabold text-slate-800 text-sm">{v.name}</p>
              {v.verified && <MdVerified className="w-3.5 h-3.5 text-blue-500"/>}
            </div>
            <p className="text-xs font-bold text-blue-600">{v.code}</p>
            <p className="text-xs text-slate-400">{v.city}, {v.state}</p>
          </div>
        </div>
        <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${sc.bg} ${sc.text}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`}/>{v.status}
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${tc.border} ${tc.bg} ${tc.text} flex items-center gap-1`}>
          <tc.icon className="w-2.5 h-2.5"/> {v.type}
        </span>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${pc.bg} ${pc.text}`}>{v.payStatus}</span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-slate-50 rounded-lg px-3 py-2">
          <p className="text-slate-400">Business</p>
          <p className="font-extrabold text-slate-800">{fmtINR(v.totalBusiness)}</p>
        </div>
        <div className="bg-slate-50 rounded-lg px-3 py-2">
          <p className="text-slate-400">Outstanding</p>
          <p className={`font-extrabold ${v.outstanding>0?"text-amber-600":"text-green-600"}`}>{fmtINR(v.outstanding)}</p>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs">
        <StarRating rating={v.rating}/>
        <span className="text-slate-400">{v.bookings} bookings</span>
      </div>

      <div>
        <div className="flex justify-between text-xs text-slate-400 mb-1">
          <span>Payment</span><span>{payPct}%</span>
        </div>
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div className={`h-full rounded-full ${payPct===100?"bg-green-500":payPct>0?"bg-blue-500":"bg-slate-200"}`}
            style={{width:`${payPct}%`}}/>
        </div>
      </div>

      <div className="flex gap-2 pt-1">
        <button onClick={() => onView(v)} className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all">👁 View</button>
        <button onClick={() => onEdit(v)} className="flex-1 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-200 text-xs font-bold transition-all">✏️ Edit</button>
        <a href={`https://wa.me/${v.phone.replace(/\D/g,"")}`} target="_blank" rel="noreferrer"
          className="flex-1 py-2 rounded-xl bg-green-50 text-green-600 border border-green-200 text-xs font-bold flex items-center justify-center transition-all">
          <FaWhatsapp/>
        </a>
        <button onClick={() => onDelete(v)} className="w-9 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 border border-red-200 text-xs flex items-center justify-center transition-all">
          <FiTrash2/>
        </button>
      </div>
    </div>
  );
}

/* ─── MAIN PAGE ──────────────────────────────────────────────── */
export default function Vendors() {
  const [vendors,  setVendors]  = useState(MOCK_VENDORS);
  const [search,   setSearch]   = useState("");
  const [fStatus,  setFStatus]  = useState("All Status");
  const [fType,    setFType]    = useState("All Types");
  const [sortKey,  setSortKey]  = useState("id");
  const [sortDir,  setSortDir]  = useState("asc");
  const [page,     setPage]     = useState(1);
  const PER = 8;

  const [viewV,    setView]     = useState(null);
  const [editV,    setEdit]     = useState(null);
  const [deleteV,  setDeleteV]  = useState(null);
  const [showAdd,  setShowAdd]  = useState(false);
  const [loading,  setLoading]  = useState(true);
  const [toast,    setToast]    = useState(null);
  const nextId = useRef(MOCK_VENDORS.length + 1);

  useEffect(() => { const t = setTimeout(() => setLoading(false), 850); return () => clearTimeout(t); }, []);
  const showToast = (msg, type="success") => setToast({msg, type});

  /* stats */
  const stats = useMemo(() => ({
    total:    vendors.length,
    active:   vendors.filter(v => v.status==="Active").length,
    cost:     vendors.reduce((s,v) => s+v.totalBusiness, 0),
    avgRating:vendors.length ? (vendors.reduce((s,v) => s+v.rating, 0) / vendors.length) : 0,
  }), [vendors]);

  const distStats = useMemo(() => {
    const count = t => vendors.filter(v=>v.type===t).length;
    return {
      Hotel:     count("Hotel"),
      Airlines:  count("Airlines"),
      Transport: count("Transport"),
      DMC:       count("DMC"),
      bookings:  vendors.reduce((s,v)=>s+v.bookings,0),
      cost:      vendors.reduce((s,v)=>s+v.totalBusiness,0),
    };
  }, [vendors]);

  /* filter + sort */
  const filtered = useMemo(() => {
    let out = [...vendors];
    const q = search.toLowerCase();
    if (q) out = out.filter(v =>
      v.name.toLowerCase().includes(q) ||
      v.code.toLowerCase().includes(q) ||
      v.contact.toLowerCase().includes(q) ||
      v.city.toLowerCase().includes(q) ||
      v.email.toLowerCase().includes(q)
    );
    if (fStatus !== "All Status") out = out.filter(v => v.status===fStatus);
    if (fType   !== "All Types")  out = out.filter(v => v.type===fType);
    out.sort((a,b) => {
      let av=a[sortKey], bv=b[sortKey];
      if(typeof av==="string"){av=av.toLowerCase();bv=bv.toLowerCase();}
      if(av<bv) return sortDir==="asc"?-1:1;
      if(av>bv) return sortDir==="asc"?1:-1;
      return 0;
    });
    return out;
  }, [vendors, search, fStatus, fType, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER));
  const pageData   = filtered.slice((page-1)*PER, page*PER);
  const anyFilter  = search || fStatus!=="All Status" || fType!=="All Types";

  const handleSort = key => {
    if(sortKey===key) setSortDir(d=>d==="asc"?"desc":"asc");
    else { setSortKey(key); setSortDir("asc"); }
  };
  const SI = ({k}) => <span className="ml-1 opacity-40 text-xs">{sortKey===k?(sortDir==="asc"?"↑":"↓"):"↕"}</span>;

  const resetFilters = () => { setSearch(""); setFStatus("All Status"); setFType("All Types"); setPage(1); };

  const handleSave = form => {
    if (!form.name?.trim() || !form.phone?.trim()) {
      showToast("Vendor name and phone are required.", "error"); return;
    }
    const services = form.services ? form.services.split(",").map(s=>s.trim()).filter(Boolean) : [];
    if (editV) {
      setVendors(p => p.map(v => v.id===editV.id ? {...v,...form, services} : v));
      showToast("Vendor updated successfully.");
    } else {
      const id = nextId.current++;
      const code = `VND${String(id).padStart(3,"0")}`;
      setVendors(p => [...p, {
        ...form, id, code, services,
        rating:4.0, totalBusiness:0, totalPaid:0, outstanding:0,
        bookings:0, verified:false, joinDate:new Date().toISOString().split("T")[0],
      }]);
      showToast("Vendor added successfully.");
    }
    setEdit(null); setShowAdd(false);
  };

  const handleDelete = () => {
    setVendors(p => p.filter(v => v.id!==deleteV.id));
    showToast(`${deleteV.name} deleted.`);
    setDeleteV(null);
  };

  const handleExport = () => {
    const rows = [
      ["Code","Name","Type","Contact","Phone","Email","City","Status","Rating","Total Business","Paid","Outstanding","Pay Status","Bookings"],
      ...vendors.map(v => [v.code,v.name,v.type,v.contact,v.phone,v.email,v.city,v.status,v.rating,v.totalBusiness,v.totalPaid,v.outstanding,v.payStatus,v.bookings])
    ];
    const csv = rows.map(r=>r.join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv],{type:"text/csv"}));
    a.download = "vendors.csv"; a.click();
    showToast("Vendors exported to CSV.");
  };

  function Sel({ val, onChange, opts }) {
    return (
      <div className="relative">
        <select value={val} onChange={e=>{onChange(e.target.value);setPage(1);}}
          className="w-full pl-3 pr-8 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-600
            font-medium focus:border-blue-400 focus:ring-2 focus:ring-blue-50 outline-none appearance-none cursor-pointer transition-all">
          {opts.map(o => <option key={o}>{o}</option>)}
        </select>
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] pointer-events-none">▼</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-100"
      style={{fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif"}}>
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

      {toast    && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)}/>}
      {viewV    && <ViewModal vendor={viewV} onClose={() => setView(null)} onEdit={v=>{setView(null);setEdit(v);}}/>}
      {(showAdd||editV) && <VendorFormModal vendor={editV||null} onClose={()=>{setShowAdd(false);setEdit(null);}} onSave={handleSave}/>}
      {deleteV  && <DeleteConfirm vendor={deleteV} onClose={() => setDeleteV(null)} onConfirm={handleDelete}/>}

      {/* ── NAV ── */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-40 shadow-sm">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center text-white font-black text-sm shadow">T</div>
            <span className="font-extrabold text-slate-800 text-sm hidden sm:block">TravelCRM</span>
          </div>
          <div className="text-xs text-slate-400 flex items-center gap-1 font-medium">
            <span className="hover:text-blue-600 cursor-pointer transition-colors">Home</span>
            <span className="mx-1">/</span>
            <span className="text-blue-600 font-bold">Vendors</span>
          </div>
        </div>
      </nav>

      {/* ── PAGE HEADER ── */}
      <div className="bg-white/70 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white text-xl shadow-lg shadow-blue-200">
                <FaHandshake className="w-6 h-6"/>
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">Vendors</h1>
                <p className="text-sm text-slate-400 mt-0.5">Manage hotels, airlines, transport & DMC partners</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:border-blue-300
                  bg-white hover:bg-blue-50 text-slate-600 hover:text-blue-600 text-sm font-bold transition-all shadow-sm">
                <FiDownload className="w-3.5 h-3.5"/> Export
              </button>
              <button 
              // onClick={() => setShowAdd(true)}
              onClick={() => (window.location.href = "/CreateVendor")}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold
                  shadow-md shadow-blue-200 hover:shadow-lg transition-all">
                <FiPlus className="w-4 h-4"/> Add Vendor
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* ── STAT CARDS ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { gradient:"from-cyan-500 to-cyan-600",    icon:FaHandshake,    label:"Total Vendors",   value:stats.total,    money:false, delay:0   },
            { gradient:"from-green-500 to-emerald-600",icon:FiCheckCircle,  label:"Active Vendors",  value:stats.active,   money:false, delay:60  },
            { gradient:"from-amber-500 to-orange-500", icon:FaMoneyBillWave,label:"Total Vendor Costs",value:stats.cost,   money:true,  delay:120 },
            { gradient:"from-rose-500 to-red-500",     icon:FiStar,         label:"Avg. Rating",     value:Math.round(stats.avgRating*10)/10, money:false, delay:180 },
          ].map((c,i) => (
            <div key={c.label} className="fade-up" style={{animationDelay:`${c.delay}ms`}}>
              <StatCard {...c}/>
            </div>
          ))}
        </div>

        {/* ── VENDOR DISTRIBUTION ── */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-100 shadow-sm p-5">
          <p className="text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            <HiSparkles className="text-blue-500 w-4 h-4"/> Vendor Distribution
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {DIST_CARDS.map(c => {
              const val = distStats[c.key] || 0;
              const isMoney = c.key==="cost";
              return (
                <div key={c.key} className={`${c.color} rounded-2xl p-4 text-white relative overflow-hidden group
                  hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 cursor-default`}>
                  <div className="absolute -right-4 -bottom-4 w-16 h-16 rounded-full bg-white/10"/>
                  <c.icon className="w-6 h-6 mb-2 opacity-90"/>
                  <p className="text-lg font-extrabold leading-none">
                    {isMoney ? <AnimNum target={val} prefix="₹"/> : <AnimNum target={val}/>}
                  </p>
                  <p className="text-xs font-bold opacity-80 mt-0.5">{c.label}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── VENDOR LIST ── */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

          {/* List header */}
          <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-base font-extrabold text-slate-700">Vendor List</h2>
              <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2.5 py-1 rounded-full">{filtered.length} vendors</span>
            </div>
            {anyFilter && (
              <button onClick={resetFilters} className="text-xs text-red-400 hover:text-red-600 font-bold flex items-center gap-1 transition-colors">
                ✕ Clear filters
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/60">
            <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
              <div className="relative flex-1 min-w-[200px]">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4"/>
                <input value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}}
                  placeholder="Search by name, code, contact, city..."
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700
                    placeholder-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-50 outline-none transition-all"/>
              </div>
              <Sel val={fStatus} onChange={setFStatus} opts={["All Status",...STATUSES]}/>
              <Sel val={fType}   onChange={setFType}   opts={["All Types",...VENDOR_TYPES]}/>
            </div>
          </div>

          {/* ── DESKTOP TABLE ── */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              <thead className="bg-slate-50/80 border-b border-slate-100">
                <tr>
                  {[
                    ["Vendor",          "name"],
                    ["Type",            "type"],
                    ["Contact",         null  ],
                    ["Services",        null  ],
                    ["Performance",     "rating"],
                    ["Total Business",  "totalBusiness"],
                    ["Total Paid",      "totalPaid"],
                    ["Outstanding",     "outstanding"],
                    ["Pay Status",      "payStatus"],
                    ["Status",          "status"],
                    ["Actions",         null  ],
                  ].map(([label,key]) => (
                    <th key={label} onClick={key?()=>handleSort(key):undefined}
                      className={`px-4 py-3.5 text-left text-xs font-extrabold text-slate-500 uppercase tracking-wider whitespace-nowrap
                        ${key?"cursor-pointer hover:text-blue-600 select-none":""}`}>
                      {label}{key&&<SI k={key}/>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading
                  ? [...Array(6)].map((_,i) => (
                      <tr key={i}>
                        {[...Array(11)].map((_,j) => (
                          <td key={j} className="px-4 py-4">
                            <div className="h-4 rounded-lg bg-slate-200 animate-pulse" style={{width:`${40+Math.random()*50}%`}}/>
                          </td>
                        ))}
                      </tr>
                    ))
                  : pageData.length===0
                  ? (
                    <tr><td colSpan={11} className="text-center py-24">
                      <div className="text-6xl mb-4">🤝</div>
                      <p className="text-lg font-extrabold text-slate-600 mb-1">No Vendors Found</p>
                      <p className="text-sm text-slate-400 mb-5">{anyFilter?"Adjust your filters to see results.":"Start by adding your first vendor."}</p>
                      {anyFilter
                        ? <button onClick={resetFilters} className="px-4 py-2 rounded-xl bg-blue-50 text-blue-600 font-bold text-sm hover:bg-blue-100 transition-all">Clear Filters</button>
                        : <button onClick={()=>setShowAdd(true)} className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm shadow-md hover:bg-blue-700 transition-all">+ Add First Vendor</button>
                      }
                    </td></tr>
                  )
                  : pageData.map((v, idx) => {
                    const tc = TYPE_CONFIG[v.type] || TYPE_CONFIG.Hotel;
                    const sc = STATUS_CONFIG[v.status] || STATUS_CONFIG.Inactive;
                    const pc = PAY_CONFIG[v.payStatus] || PAY_CONFIG.Unpaid;
                    const payPct = v.totalBusiness>0 ? Math.round(v.totalPaid/v.totalBusiness*100) : 0;
                    return (
                      <tr key={v.id} className="group transition-all duration-150 hover:bg-blue-50/40 hover:shadow-[inset_3px_0_0_#2563eb]"
                        style={{animation:"fadeUp .35s ease both", animationDelay:`${idx*30}ms`}}>
                        {/* Vendor */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${avatarGrad(v)} flex items-center justify-center text-white text-xs font-extrabold flex-shrink-0 shadow-sm`}>
                              {initials(v.name)}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <p className="text-sm font-bold text-slate-800 leading-tight">{v.name}</p>
                                {v.verified && <MdVerified className="w-3.5 h-3.5 text-blue-500 flex-shrink-0"/>}
                              </div>
                              <p className="text-xs font-bold text-blue-600">{v.code}</p>
                            </div>
                          </div>
                        </td>
                        {/* Type */}
                        <td className="px-4 py-3.5">
                          <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${tc.border} ${tc.bg} ${tc.text}`}>
                            <tc.icon className="w-2.5 h-2.5"/> {v.type}
                          </span>
                        </td>
                        {/* Contact */}
                        <td className="px-4 py-3.5">
                          <p className="text-xs font-semibold text-slate-700">{v.contact}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{v.phone}</p>
                          <p className="text-xs text-slate-400 truncate max-w-[140px]">{v.city}, {v.state}</p>
                        </td>
                        {/* Services */}
                        <td className="px-4 py-3.5">
                          <div className="flex flex-wrap gap-1">
                            {v.services?.slice(0,2).map(s => (
                              <span key={s} className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">{s}</span>
                            ))}
                            {v.services?.length>2 && <span className="text-xs text-slate-400">+{v.services.length-2}</span>}
                          </div>
                        </td>
                        {/* Performance */}
                        <td className="px-4 py-3.5">
                          <StarRating rating={v.rating}/>
                          <p className="text-xs text-slate-400 mt-0.5">{v.bookings} bookings</p>
                        </td>
                        {/* Total Business */}
                        <td className="px-4 py-3.5">
                          <p className="text-sm font-extrabold text-slate-800">{fmtINR(v.totalBusiness)}</p>
                          <p className="text-xs text-slate-400">Joined {fmtDate(v.joinDate)}</p>
                        </td>
                        {/* Paid */}
                        <td className="px-4 py-3.5">
                          <p className="text-sm font-bold text-green-700">{fmtINR(v.totalPaid)}</p>
                          <div className="w-full h-1 bg-slate-100 rounded-full mt-1 overflow-hidden">
                            <div className={`h-full rounded-full ${payPct===100?"bg-green-500":payPct>0?"bg-blue-400":"bg-slate-200"}`}
                              style={{width:`${payPct}%`}}/>
                          </div>
                        </td>
                        {/* Outstanding */}
                        <td className="px-4 py-3.5">
                          <p className={`text-sm font-bold ${v.outstanding>0?"text-amber-600":"text-slate-400"}`}>
                            {fmtINR(v.outstanding)}
                          </p>
                        </td>
                        {/* Pay Status */}
                        <td className="px-4 py-3.5">
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${pc.bg} ${pc.text}`}>{v.payStatus}</span>
                        </td>
                        {/* Status */}
                        <td className="px-4 py-3.5">
                          <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1.5 rounded-full ${sc.bg} ${sc.text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`}/>{v.status}
                          </span>
                        </td>
                        {/* Actions */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1.5 opacity-70 group-hover:opacity-100 transition-opacity">
                            <button onClick={()=>setView(v)} title="View"
                              className="w-8 h-8 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 flex items-center justify-center text-sm transition-all">
                              <FiEye/>
                            </button>
                            <button onClick={()=>setEdit(v)} title="Edit"
                              className="w-8 h-8 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm transition-all">
                              <FiEdit2/>
                            </button>
                            <a href={`https://wa.me/${v.phone.replace(/\D/g,"")}`} target="_blank" rel="noreferrer" title="WhatsApp"
                              className="w-8 h-8 rounded-lg bg-green-50 hover:bg-green-100 text-green-600 flex items-center justify-center text-sm transition-all">
                              <FaWhatsapp/>
                            </a>
                            <button onClick={()=>setDeleteV(v)} title="Delete"
                              className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-600 flex items-center justify-center text-sm transition-all">
                              <FiTrash2/>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                }
              </tbody>
            </table>
          </div>

          {/* ── MOBILE CARDS ── */}
          <div className="lg:hidden p-4 space-y-3">
            {loading
              ? [...Array(3)].map((_,i) => (
                  <div key={i} className="bg-white rounded-2xl border border-slate-100 p-4 space-y-3">
                    {[...Array(4)].map((_,j) => <div key={j} className="h-4 rounded-lg bg-slate-200 animate-pulse"/>)}
                  </div>
                ))
              : pageData.length===0
              ? (
                <div className="text-center py-16">
                  <div className="text-5xl mb-3">🤝</div>
                  <p className="text-base font-extrabold text-slate-600">No Vendors Found</p>
                </div>
              )
              : pageData.map((v, idx) => (
                  <MobileVendorCard key={v.id} v={v} idx={idx}
                    onView={setView} onEdit={setEdit} onDelete={setDeleteV}/>
                ))
            }
          </div>

          {/* ── PAGINATION ── */}
          {filtered.length > 0 && (
            <div className="px-5 py-4 border-t border-slate-100 bg-slate-50/60 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-slate-400 font-medium">
                Showing <span className="font-bold text-slate-600">{(page-1)*PER+1}</span>–<span className="font-bold text-slate-600">{Math.min(page*PER,filtered.length)}</span> of <span className="font-bold text-slate-600">{filtered.length}</span> vendors
              </p>
              <div className="flex items-center gap-1.5">
                {[["«",()=>setPage(1)],["‹",()=>setPage(p=>Math.max(1,p-1))]].map(([l,fn]) => (
                  <button key={l} disabled={page===1} onClick={fn}
                    className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-600 text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                    {l}
                  </button>
                ))}
                {Array.from({length:totalPages},(_,i)=>i+1)
                  .filter(p => p===1||p===totalPages||Math.abs(p-page)<=1)
                  .reduce((acc,p,i,arr) => { if(i>0&&p-arr[i-1]>1) acc.push("…"); acc.push(p); return acc; },[])
                  .map((p,i) =>
                    typeof p==="string"
                      ? <span key={`e${i}`} className="w-8 text-center text-xs text-slate-400">…</span>
                      : <button key={p} onClick={()=>setPage(p)}
                          className={`w-8 h-8 rounded-lg text-xs font-bold transition-all border
                            ${page===p?"bg-blue-600 border-blue-600 text-white shadow-sm":"bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600"}`}>
                          {p}
                        </button>
                  )
                }
                {[["›",()=>setPage(p=>Math.min(totalPages,p+1))],["»",()=>setPage(totalPages)]].map(([l,fn]) => (
                  <button key={l} disabled={page===totalPages} onClick={fn}
                    className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-600 text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                    {l}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="text-xs text-slate-400">Copyright © 2026 <span className="text-blue-600 font-bold">TravelCRM</span>. All rights reserved.</p>
        <p className="text-xs text-slate-400 font-semibold">Version 1.0.0</p>
      </footer>
    </div>
  );
}