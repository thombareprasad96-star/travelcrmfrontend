// src/components/Customers/CreateCustomer.jsx
// ─────────────────────────────────────────────────────────────
// Create Customer Page — Travel CRM
// Matches design system of Customers.jsx, Bookings.jsx, CreateLead.jsx
// Font: Plus Jakarta Sans | Colors: Blue #2563eb | Tailwind CSS
// React Hook Form | customerService integration ready
// ─────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

import {
  FiUser, FiPhone, FiMail, FiMapPin, FiSearch,
  FiChevronDown, FiArrowLeft, FiCheckCircle,
  FiAlertCircle, FiSave, FiLoader, FiFileText,
} from "react-icons/fi";
import {
  FaCrown, FaWhatsapp, FaRegStickyNote, FaIdCard,
  FaUserTie, FaCommentDots, FaLayerGroup,
} from "react-icons/fa";
import { MdVerified, MdLocationCity, MdOutlineContactPhone } from "react-icons/md";
import { HiSparkles } from "react-icons/hi";

// ── Uncomment when backend is connected ──────────────────────
// import { customerService } from "../../services";
// import { useNavigate } from "react-router-dom";

/* ─── CONSTANTS ──────────────────────────────────────────────── */
const CUSTOMER_TYPES = ["Individual", "Corporate", "VIP", "Group", "Agent"];
const COMM_PREFS     = ["WhatsApp", "SMS", "Email", "Phone Call", "All Channels"];
const LOYALTY_TIERS  = ["Bronze", "Silver", "Gold", "Platinum"];
const CUSTOMER_STATUS= ["Active", "Inactive"];
const INDIA_STATES   = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh",
  "Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka",
  "Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram",
  "Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
  "Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
  "Delhi","Chandigarh","Jammu & Kashmir","Ladakh",
];

const TYPE_COLORS = {
  Individual:{ bg:"bg-blue-50",   text:"text-blue-700",   border:"border-blue-200"   },
  Corporate: { bg:"bg-indigo-50", text:"text-indigo-700", border:"border-indigo-200" },
  VIP:       { bg:"bg-amber-50",  text:"text-amber-700",  border:"border-amber-200"  },
  Group:     { bg:"bg-teal-50",   text:"text-teal-700",   border:"border-teal-200"   },
  Agent:     { bg:"bg-purple-50", text:"text-purple-700", border:"border-purple-200" },
};
const TIER_CONFIG = {
  Bronze:  { icon:"🥉", color:"text-orange-600" },
  Silver:  { icon:"🥈", color:"text-slate-500"  },
  Gold:    { icon:"🥇", color:"text-yellow-600" },
  Platinum:{ icon:"💎", color:"text-blue-600"   },
};
const AVATAR_GRADS = [
  "from-blue-500 to-blue-600","from-purple-500 to-purple-600",
  "from-teal-500 to-teal-600","from-rose-500 to-rose-600",
  "from-amber-500 to-amber-600","from-indigo-500 to-indigo-600",
];

/* ─── SMALL HELPERS ──────────────────────────────────────────── */
function initials(name = "") {
  return name.trim().split(" ").map(w => w[0] || "").join("").slice(0, 2).toUpperCase() || "?";
}
function randomGrad(name = "") {
  return AVATAR_GRADS[name.charCodeAt(0) % AVATAR_GRADS.length] || AVATAR_GRADS[0];
}

/* ─── TOAST ──────────────────────────────────────────────────── */
function Toast({ msg, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 4000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className={`fixed top-5 right-5 z-[999] flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl max-w-xs
      ${type === "success" ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800"}`}
      style={{ animation: "slideIn .3s ease both" }}>
      {type === "success"
        ? <FiCheckCircle className="w-5 h-5 flex-shrink-0" />
        : <FiAlertCircle className="w-5 h-5 flex-shrink-0" />}
      <p className="text-sm font-semibold flex-1">{msg}</p>
      <button onClick={onClose} className="opacity-50 hover:opacity-100 text-lg ml-1 leading-none">×</button>
    </div>
  );
}

/* ─── FIELD WRAPPER ──────────────────────────────────────────── */
function Field({ label, required, icon: Icon, error, hint, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
        {Icon && <Icon className="w-3 h-3 text-blue-400" />}
        {label}
        {required && <span className="text-red-500 ml-0.5 normal-case font-bold">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-slate-400">{hint}</p>}
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-red-500 inline-block flex-shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

/* ─── INPUT ──────────────────────────────────────────────────── */
function Input({ icon: Icon, error, ...props }) {
  return (
    <div className="relative">
      {Icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"><Icon className="w-4 h-4" /></div>}
      <input
        className={`w-full ${Icon ? "pl-9" : "pl-3"} pr-3 py-2.5 rounded-xl border text-sm text-slate-700 placeholder-slate-400
          outline-none transition-all
          ${error
            ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-2 focus:ring-red-100"
            : "border-slate-200 bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
          }`}
        {...props}
      />
    </div>
  );
}

/* ─── SELECT ─────────────────────────────────────────────────── */
function Select({ icon: Icon, options, placeholder, error, ...props }) {
  return (
    <div className="relative">
      {Icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"><Icon className="w-4 h-4" /></div>}
      <select
        className={`w-full ${Icon ? "pl-9" : "pl-3"} pr-8 py-2.5 rounded-xl border text-sm text-slate-700 bg-white
          outline-none appearance-none cursor-pointer transition-all
          ${error
            ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
            : "border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
          }`}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
    </div>
  );
}

/* ─── SECTION CARD ───────────────────────────────────────────── */
function SectionCard({ gradient, icon, title, subtitle, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
      style={{ animation: "fadeUp .4s ease both" }}>
      <div className={`bg-gradient-to-r ${gradient} px-5 py-4 flex items-center gap-3`}>
        <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-xl flex-shrink-0">{icon}</div>
        <div>
          <h2 className="text-white font-extrabold text-sm leading-tight">{title}</h2>
          <p className="text-white/70 text-xs mt-0.5">{subtitle}</p>
        </div>
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </div>
  );
}

/* ─── LIVE PREVIEW SIDEBAR ───────────────────────────────────── */
function CustomerPreview({ watch }) {
  const name    = watch("name")    || "";
  const phone   = watch("phone")   || "";
  const email   = watch("email")   || "";
  const city    = watch("city")    || "";
  const state   = watch("state")   || "";
  const type    = watch("type")    || "Individual";
  const tier    = watch("tier")    || "Bronze";
  const status  = watch("status")  || "Active";
  const comm    = watch("commPref")|| "";
  const notes   = watch("notes")   || "";

  const tc = TYPE_COLORS[type]  || TYPE_COLORS.Individual;
  const ti = TIER_CONFIG[tier]  || TIER_CONFIG.Bronze;

  const checks = [!!name, !!phone, !!email, !!city, !!type, !!tier];
  const pct    = Math.round(checks.filter(Boolean).length / checks.length * 100);

  const grad = randomGrad(name);

  return (
    <div className="space-y-4">
      {/* Completeness */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-extrabold text-slate-700">Form Progress</h3>
          <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full
            ${pct === 100 ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
            {pct}%
          </span>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-500
            ${pct === 100 ? "bg-green-500" : "bg-gradient-to-r from-blue-500 to-blue-400"}`}
            style={{ width: `${pct}%` }} />
        </div>
        <div className="mt-3 space-y-1.5">
          {[["Full Name", !!name], ["Phone", !!phone], ["Email", !!email],
            ["City", !!city], ["Type", !!type], ["Tier", !!tier]].map(([l, d]) => (
            <div key={l} className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0
                ${d ? "bg-green-500" : "bg-slate-200"}`}>
                {d && <FiCheckCircle className="w-2.5 h-2.5 text-white" />}
              </div>
              <span className={`text-xs font-medium ${d ? "text-slate-600" : "text-slate-400"}`}>{l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Live Preview Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-700 to-slate-600 px-5 py-3.5 flex items-center gap-2">
          <HiSparkles className="text-slate-300 w-4 h-4" />
          <h3 className="text-white font-extrabold text-sm">Live Preview</h3>
        </div>

        {!name && !phone
          ? (
            <div className="text-center py-8 px-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-2">
                <FiUser className="w-5 h-5 text-slate-300" />
              </div>
              <p className="text-xs text-slate-400">Fill the form to preview the customer card</p>
            </div>
          )
          : (
            <div className="p-4 space-y-4">
              {/* Avatar + name */}
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center text-white font-extrabold text-sm shadow flex-shrink-0`}>
                  {initials(name)}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="font-extrabold text-slate-800 text-sm">{name || "—"}</p>
                    {type === "VIP" && <FaCrown className="w-3 h-3 text-amber-500" />}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{city}{state ? `, ${state}` : ""}</p>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-1.5">
                {type && (
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${tc.border} ${tc.bg} ${tc.text}`}>
                    {type}
                  </span>
                )}
                {tier && (
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600`}>
                    {ti.icon} {tier}
                  </span>
                )}
                <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full
                  ${status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${status === "Active" ? "bg-emerald-500" : "bg-slate-400"}`} />
                  {status}
                </span>
              </div>

              {/* Info rows */}
              <div className="space-y-2">
                {[
                  [FiPhone,  phone || "—"],
                  [FiMail,   email || "—"],
                  [FaCommentDots, comm || "—"],
                ].map(([Icon, val], i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                    <Icon className="w-3 h-3 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{val}</span>
                  </div>
                ))}
              </div>

              {notes && (
                <div className="bg-amber-50 rounded-lg px-3 py-2 border border-amber-100">
                  <p className="text-xs text-amber-700 font-medium leading-relaxed line-clamp-3">{notes}</p>
                </div>
              )}
            </div>
          )
        }
      </div>

      {/* Quick tips */}
      <div className="bg-blue-50 rounded-2xl border border-blue-100 p-4">
        <p className="text-xs font-extrabold text-blue-700 mb-2 flex items-center gap-1.5">
          <HiSparkles className="w-3.5 h-3.5" /> Quick Tips
        </p>
        <ul className="space-y-1.5">
          {[
            "Phone is used for WhatsApp & lead search",
            "VIP customers get priority support",
            "Set tier to track loyalty rewards",
            "Notes help agents during follow-up",
          ].map((tip, i) => (
            <li key={i} className="text-xs text-blue-600 flex items-start gap-1.5">
              <span className="w-1 h-1 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ─── MAIN PAGE ──────────────────────────────────────────────── */
export default function CreateCustomer() {
  // const navigate = useNavigate(); // ← Uncomment when using react-router

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "", phone: "", email: "", alternatePhone: "",
      city: "", state: "", address: "", pincode: "",
      type: "Individual", commPref: "WhatsApp",
      tier: "Bronze", status: "Active",
      notes: "", documents: "",
      passportNo: "", panNo: "", aadharNo: "",
      anniversary: "", birthday: "",
    },
  });

  const [submitting, setSubmitting] = useState(false);
  const [saving,     setSaving]     = useState(false);
  const [toast,      setToast]      = useState(null);
  const [searching,  setSearching]  = useState(false);
  const [searchTel,  setSearchTel]  = useState("");

  const showToast = (msg, type = "success") => setToast({ msg, type });

  /* Phone search handler */
  const handleSearch = async () => {
    if (!searchTel.trim()) return;
    setSearching(true);
    try {
      // ── BACKEND: Uncomment below ──────────────────────────
      // const res = await customerService.searchByPhone(searchTel);
      // const c = res.data;
      // setValue("name",    c.name);
      // setValue("email",   c.email);
      // setValue("city",    c.city);
      // setValue("state",   c.state);
      // setValue("type",    c.type);
      // setValue("tier",    c.tier);
      // setValue("status",  c.status);
      // setValue("notes",   c.notes);
      // showToast(`Existing customer found: ${c.name}`);
      // ─────────────────────────────────────────────────────
      await new Promise(r => setTimeout(r, 900)); // remove when backend connected
      showToast("No existing customer found for this phone.", "error");
    } catch {
      showToast("No existing customer found for this phone.", "error");
    } finally {
      setSearching(false);
    }
  };

  /* Save Draft */
  const onSaveDraft = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setSaving(false);
    showToast("Draft saved successfully.");
  };

  /* Submit */
  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      // ── BACKEND: Uncomment below ──────────────────────────
      // const payload = {
      //   name:           data.name,
      //   phone:          data.phone,
      //   email:          data.email,
      //   alternatePhone: data.alternatePhone,
      //   city:           data.city,
      //   state:          data.state,
      //   address:        data.address,
      //   pincode:        data.pincode,
      //   type:           data.type,
      //   commPref:       data.commPref,
      //   tier:           data.tier,
      //   status:         data.status,
      //   notes:          data.notes,
      //   documents:      data.documents,
      //   passportNo:     data.passportNo,
      //   panNo:          data.panNo,
      //   aadharNo:       data.aadharNo,
      //   birthday:       data.birthday || null,
      //   anniversary:    data.anniversary || null,
      // };
      // const res = await customerService.create(payload);
      // showToast(`Customer "${res.data.name}" created! ID: ${res.data.customerId}`);
      // reset();
      // navigate("/customers");   // redirect to customer list
      // ─────────────────────────────────────────────────────

      await new Promise(r => setTimeout(r, 1600)); // remove when backend connected
      showToast(`Customer "${data.name}" created successfully!`);
      reset();
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to create customer.";
      showToast(msg, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const selectedType = watch("type");
  const selectedTier = watch("tier");
  const selectedComm = watch("commPref");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-100"
      style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        @keyframes slideIn { from{transform:translateX(110%);opacity:0} to{transform:translateX(0);opacity:1} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* ── TOP NAV ── */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-40 shadow-sm">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center text-white font-black text-sm shadow">T</div>
            <span className="font-extrabold text-slate-800 text-sm hidden sm:block">TravelCRM</span>
          </div>
          <nav className="text-xs text-slate-400 flex items-center gap-1 font-medium">
            <span className="hover:text-blue-600 cursor-pointer transition-colors">Home</span>
            <span className="mx-1 text-slate-300">/</span>
            <span className="hover:text-blue-600 cursor-pointer transition-colors">Customers</span>
            <span className="mx-1 text-slate-300">/</span>
            <span className="text-blue-600 font-bold">Create</span>
          </nav>
        </div>
      </nav>

      {/* ── PAGE HEADER ── */}
      <div className="bg-white/70 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white text-xl shadow-lg shadow-blue-200">
                <FiUser className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">Create New Customer</h1>
                <p className="text-sm text-slate-400 mt-0.5">Add a new customer to your Travel CRM</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => (window.location.href = "/allCustomers")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:border-blue-300
                bg-white hover:bg-blue-50 text-slate-600 hover:text-blue-600 text-sm font-bold transition-all shadow-sm"
            >
              <FiArrowLeft className="w-4 h-4" /> Back to Customers
            </button>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6">
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="flex flex-col lg:flex-row gap-6">

            {/* ── LEFT / MAIN COLUMN ── */}
            <div className="flex-1 min-w-0 space-y-5">

              {/* ── SECTION 1: BASIC INFORMATION ── */}
              <SectionCard
                gradient="from-blue-600 to-blue-500"
                icon="👤"
                title="Customer Information"
                subtitle="Basic contact details — name, phone & email">

                {/* Phone search */}
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 mb-5">
                  <p className="text-xs font-extrabold text-blue-700 mb-2.5 flex items-center gap-1.5">
                    <FiSearch className="w-3.5 h-3.5" /> Search Existing Customer by Phone
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="tel"
                      value={searchTel}
                      onChange={e => setSearchTel(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && (e.preventDefault(), handleSearch())}
                      placeholder="Enter phone to auto-fill if customer exists..."
                      className="flex-1 px-3 py-2.5 rounded-xl border border-blue-200 bg-white text-sm text-slate-700
                        placeholder-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    />
                    <button type="button" onClick={handleSearch} disabled={searching}
                      className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold
                        transition-all flex items-center gap-2 disabled:opacity-60 shadow-sm">
                      {searching
                        ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        : <FiSearch className="w-4 h-4" />}
                      {searching ? "Searching..." : "Search"}
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Name + Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Full Name" required icon={FiUser} error={errors.name?.message}>
                      <Input
                        icon={FiUser}
                        placeholder="Enter customer full name"
                        error={errors.name}
                        {...register("name", { required: "Full name is required" })}
                      />
                    </Field>
                    <Field label="Phone Number" required icon={FiPhone} error={errors.phone?.message}
                      hint="Include country code e.g. +91 98765 43210">
                      <Input
                        type="tel"
                        icon={FiPhone}
                        placeholder="+91 98765 43210"
                        error={errors.phone}
                        {...register("phone", {
                          required: "Phone number is required",
                          pattern: { value: /^[+\d\s\-()\u00A0]{7,16}$/, message: "Enter a valid phone number" },
                        })}
                      />
                    </Field>
                  </div>

                  {/* Email + Alternate Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Email Address" icon={FiMail} error={errors.email?.message}>
                      <Input
                        type="email"
                        icon={FiMail}
                        placeholder="customer@email.com"
                        error={errors.email}
                        {...register("email", {
                          pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email" },
                        })}
                      />
                    </Field>
                    <Field label="Alternate Phone" icon={MdOutlineContactPhone}>
                      <Input
                        type="tel"
                        icon={MdOutlineContactPhone}
                        placeholder="+91 87654 32109"
                        {...register("alternatePhone")}
                      />
                    </Field>
                  </div>

                  {/* Customer Type + Communication */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Customer Type" required icon={FaUserTie}>
                      <div>
                        <Select
                          icon={FaUserTie}
                          options={CUSTOMER_TYPES}
                          {...register("type", { required: true })}
                        />
                        {/* Type pills */}
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {CUSTOMER_TYPES.map(t => {
                            const c = TYPE_COLORS[t] || TYPE_COLORS.Individual;
                            return (
                              <button key={t} type="button"
                                onClick={() => setValue("type", t)}
                                className={`px-2.5 py-1 rounded-full text-xs font-bold border transition-all
                                  ${selectedType === t
                                    ? `${c.border} ${c.bg} ${c.text} shadow-sm scale-105`
                                    : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
                                  }`}>
                                {t === "VIP" && "👑 "}{t}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </Field>
                    <Field label="Communication Preference" icon={FaCommentDots}>
                      <div>
                        <Select
                          icon={FaCommentDots}
                          options={COMM_PREFS}
                          {...register("commPref")}
                        />
                        {/* Comm icons */}
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {[
                            { label: "WhatsApp", icon: <FaWhatsapp className="w-3 h-3" />, color: "text-green-600 bg-green-50 border-green-200" },
                            { label: "SMS",      icon: <FiPhone className="w-3 h-3" />,    color: "text-blue-600 bg-blue-50 border-blue-200"    },
                            { label: "Email",    icon: <FiMail className="w-3 h-3" />,     color: "text-indigo-600 bg-indigo-50 border-indigo-200" },
                          ].map(({ label, icon, color }) => (
                            <button key={label} type="button"
                              onClick={() => setValue("commPref", label)}
                              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border transition-all
                                ${selectedComm === label ? `${color} shadow-sm` : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"}`}>
                              {icon} {label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </Field>
                  </div>

                  {/* Loyalty Tier + Status */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Loyalty Tier" icon={FaCrown}>
                      <div>
                        <Select icon={FaCrown} options={LOYALTY_TIERS} {...register("tier")} />
                        <div className="flex gap-1.5 mt-2">
                          {LOYALTY_TIERS.map(t => {
                            const ti = TIER_CONFIG[t];
                            return (
                              <button key={t} type="button"
                                onClick={() => setValue("tier", t)}
                                className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-all
                                  ${selectedTier === t
                                    ? "border-blue-400 bg-blue-50 text-blue-700 shadow-sm"
                                    : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
                                  }`}>
                                {ti.icon} {t}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </Field>
                    <Field label="Status" icon={FiCheckCircle}>
                      <Select icon={FiCheckCircle} options={CUSTOMER_STATUS} {...register("status")} />
                    </Field>
                  </div>
                </div>
              </SectionCard>

              {/* ── SECTION 2: ADDRESS ── */}
              <SectionCard
                gradient="from-teal-600 to-teal-500"
                icon="📍"
                title="Address Details"
                subtitle="City, state and full address">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="City" icon={MdLocationCity}>
                      <Input icon={MdLocationCity} placeholder="Mumbai" {...register("city")} />
                    </Field>
                    <Field label="State" icon={FiMapPin}>
                      <Select icon={FiMapPin} options={INDIA_STATES} placeholder="Select state" {...register("state")} />
                    </Field>
                  </div>
                  <Field label="Full Address" icon={FiMapPin}>
                    <textarea
                      rows={2}
                      placeholder="House / Flat No., Street, Area, Locality..."
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700
                        placeholder-slate-400 focus:border-teal-400 focus:ring-2 focus:ring-teal-50 outline-none transition-all resize-none"
                      {...register("address")}
                    />
                  </Field>
                  <Field label="Pincode / ZIP" icon={FiMapPin}>
                    <Input
                      placeholder="400001"
                      {...register("pincode", {
                        pattern: { value: /^\d{4,8}$/, message: "Enter a valid pincode" },
                      })}
                      error={errors.pincode}
                    />
                    {errors.pincode && <p className="text-xs text-red-500 mt-1">{errors.pincode.message}</p>}
                  </Field>
                </div>
              </SectionCard>

              {/* ── SECTION 3: IMPORTANT DATES ── */}
              <SectionCard
                gradient="from-purple-600 to-violet-500"
                icon="🎂"
                title="Important Dates"
                subtitle="Birthday & anniversary for personalized service">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Date of Birth" icon={FiFileText}>
                    <Input type="date" icon={FiFileText} {...register("birthday")} />
                  </Field>
                  <Field label="Anniversary Date" icon={FiFileText}>
                    <Input type="date" icon={FiFileText} {...register("anniversary")} />
                  </Field>
                </div>
              </SectionCard>

              {/* ── SECTION 4: DOCUMENTS ── */}
              <SectionCard
                gradient="from-indigo-600 to-indigo-500"
                icon="🗂️"
                title="Document Details"
                subtitle="Passport, PAN, Aadhar — for visa & booking">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Field label="Passport No." icon={FaIdCard}>
                      <Input
                        icon={FaIdCard}
                        placeholder="A1234567"
                        {...register("passportNo")}
                      />
                    </Field>
                    <Field label="PAN Number" icon={FaIdCard}>
                      <Input
                        icon={FaIdCard}
                        placeholder="ABCDE1234F"
                        {...register("panNo", {
                          pattern: { value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, message: "Invalid PAN" },
                        })}
                        error={errors.panNo}
                      />
                      {errors.panNo && <p className="text-xs text-red-500 mt-1">{errors.panNo.message}</p>}
                    </Field>
                    <Field label="Aadhar Number" icon={FaIdCard}>
                      <Input
                        icon={FaIdCard}
                        placeholder="1234 5678 9012"
                        {...register("aadharNo")}
                      />
                    </Field>
                  </div>
                  <Field label="Document Notes" icon={FaLayerGroup}
                    hint="Passport expiry, visa history, special document notes">
                    <textarea
                      rows={3}
                      placeholder="Document details, passport expiry dates, visa history, etc."
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700
                        placeholder-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 outline-none transition-all resize-none"
                      {...register("documents")}
                    />
                  </Field>
                </div>
              </SectionCard>

              {/* ── SECTION 5: PREFERENCES & NOTES ── */}
              <SectionCard
                gradient="from-amber-500 to-orange-400"
                icon="📝"
                title="Preferences & Notes"
                subtitle="Travel preferences, special requirements & agent notes">
                <div className="space-y-4">
                  <Field label="Travel Preferences" icon={FaRegStickyNote}
                    hint="Meal preferences, seat choices, hotel preferences, favourite destinations">
                    <textarea
                      rows={4}
                      placeholder="Customer preferences, special requirements, dietary needs, seat preferences, favourite destinations, hotel preferences, budget range, travel style, etc."
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700
                        placeholder-slate-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-50 outline-none transition-all resize-none"
                      {...register("notes")}
                    />
                  </Field>
                </div>
              </SectionCard>

              {/* ── SUBMIT SECTION ── */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                <div className="flex flex-col sm:flex-row items-stretch gap-3">
                  <button
                    type="button"
                    onClick={onSaveDraft}
                    disabled={saving || submitting}
                    className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl
                      border-2 border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-800
                      font-bold text-sm transition-all disabled:opacity-50 bg-white hover:bg-slate-50"
                  >
                    {saving
                      ? <span className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                      : <FiSave className="w-4 h-4" />}
                    {saving ? "Saving Draft..." : "Save Draft"}
                  </button>

                  <button
                    type="submit"
                    disabled={submitting || saving}
                    className="flex-1 flex items-center justify-center gap-2.5 px-8 py-3 rounded-xl
                      bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-extrabold text-sm
                      transition-all shadow-md shadow-blue-200 hover:shadow-lg hover:shadow-blue-300
                      disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {submitting
                      ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Creating Customer...</>
                      : <><FiCheckCircle className="w-4 h-4" /> Create Customer</>}
                  </button>

                  <button
                    type="button"
                    onClick={() => reset()}
                    disabled={submitting || saving}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl
                      border-2 border-red-100 hover:border-red-200 text-red-400 hover:text-red-600
                      font-bold text-sm transition-all disabled:opacity-40 bg-white hover:bg-red-50"
                  >
                    <FiArrowLeft className="w-4 h-4" /> Reset Form
                  </button>
                </div>
                <p className="text-center text-xs text-slate-400 mt-3">
                  Fields marked with <span className="text-red-500 font-bold">*</span> are required.
                  Full Name and Phone are mandatory.
                </p>
              </div>

            </div>
            {/* ── END LEFT COLUMN ── */}

            {/* ── RIGHT SIDEBAR ── */}
            <div className="w-full lg:w-72 xl:w-80 flex-shrink-0">
              <div className="lg:sticky lg:top-20">
                <CustomerPreview watch={watch} />
              </div>
            </div>

          </div>
        </form>
      </div>

      {/* Footer */}
      <footer className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 mt-2">
        <p className="text-xs text-slate-400">Copyright © 2026 <span className="text-blue-600 font-bold">TravelCRM</span>. All rights reserved.</p>
        <p className="text-xs text-slate-400 font-semibold">Version 1.0.0</p>
      </footer>
    </div>
  );
}