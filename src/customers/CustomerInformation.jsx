

import { useState } from "react";
import {
  FiUser, FiPhone, FiMail, FiSearch, FiChevronDown, FiCheckCircle,
} from "react-icons/fi";
import {
  FaCrown, FaWhatsapp, FaUserTie, FaCommentDots,
} from "react-icons/fa";
import { MdOutlineContactPhone } from "react-icons/md";
import { HiSparkles } from "react-icons/hi";

const CUSTOMER_TYPES = ["Individual", "Corporate", "VIP", "Group", "Agent"];
const COMM_PREFS     = ["WhatsApp", "SMS", "Email", "Phone Call", "All Channels"];
const LOYALTY_TIERS  = ["Bronze", "Silver", "Gold", "Platinum"];
const CUSTOMER_STATUS= ["Active", "Inactive"];

const TYPE_COLORS = {
  Individual:{ bg:"bg-blue-50",   text:"text-blue-700",   border:"border-blue-200"   },
  Corporate: { bg:"bg-indigo-50", text:"text-indigo-700", border:"border-indigo-200" },
  VIP:       { bg:"bg-amber-50",  text:"text-amber-700",  border:"border-amber-200"  },
  Group:     { bg:"bg-teal-50",   text:"text-teal-700",   border:"border-teal-200"   },
  Agent:     { bg:"bg-purple-50", text:"text-purple-700", border:"border-purple-200" },
};
const TIER_CONFIG = {
  Bronze:  "🥉", Silver: "🥈", Gold: "🥇", Platinum: "💎",
};

function Field({ label, required, icon: Icon, error, hint, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
        {Icon && <Icon className="w-3 h-3 text-blue-400" />}
        {label}
        {required && <span className="text-red-500 ml-0.5 normal-case">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-slate-400">{hint}</p>}
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-red-500 inline-block" />
          {error}
        </p>
      )}
    </div>
  );
}

function TextInput({ icon: Icon, error, ...props }) {
  return (
    <div className="relative">
      {Icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          <Icon className="w-4 h-4" />
        </div>
      )}
      <input
        className={`w-full ${Icon ? "pl-9" : "pl-3"} pr-3 py-2.5 rounded-xl border text-sm text-slate-700
          placeholder-slate-400 outline-none transition-all
          ${error
            ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-2 focus:ring-red-100"
            : "border-slate-200 bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
          }`}
        {...props}
      />
    </div>
  );
}

function SelectInput({ icon: Icon, options, placeholder, ...props }) {
  return (
    <div className="relative">
      {Icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          <Icon className="w-4 h-4" />
        </div>
      )}
      <select
        className={`w-full ${Icon ? "pl-9" : "pl-3"} pr-8 py-2.5 rounded-xl border border-slate-200
          bg-white text-sm text-slate-700 outline-none appearance-none cursor-pointer transition-all
          focus:border-blue-400 focus:ring-2 focus:ring-blue-50`}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
    </div>
  );
}

export default function CustomerInformation({ register, errors, watch, setValue }) {
  const [searching,  setSearching]  = useState(false);
  const [searchTel,  setSearchTel]  = useState("");

  const selectedType = watch("type");
  const selectedTier = watch("tier");
  const selectedComm = watch("commPref");

  const handleSearch = async () => {
    if (!searchTel.trim()) return;
    setSearching(true);
    // ── BACKEND: replace setTimeout with real API call ────────
    // const res = await customerService.searchByPhone(searchTel);
    // setValue("name", res.data.name); setValue("email", res.data.email); ...
    await new Promise(r => setTimeout(r, 900));
    setSearching(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-xl">👤</div>
        <div>
          <h2 className="text-white font-extrabold text-base">Customer Information</h2>
          <p className="text-blue-100 text-xs">Basic contact details — name, phone & email</p>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* Phone search */}
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
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
              className="flex-1 px-3 py-2.5 rounded-xl border border-blue-200 bg-white text-sm
                text-slate-700 placeholder-slate-400 focus:border-blue-400 focus:ring-2
                focus:ring-blue-100 outline-none transition-all"
            />
            <button type="button" onClick={handleSearch} disabled={searching}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm
                font-bold transition-all flex items-center gap-2 disabled:opacity-60 shadow-sm">
              {searching
                ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                : <FiSearch className="w-4 h-4" />}
              {searching ? "Searching..." : "Search"}
            </button>
          </div>
        </div>

        {/* Name + Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Full Name" required icon={FiUser} error={errors.name?.message}>
            <TextInput
              icon={FiUser} placeholder="Enter customer full name" error={errors.name}
              {...register("name", { required: "Full name is required" })}
            />
          </Field>
          <Field label="Phone Number" required icon={FiPhone} error={errors.phone?.message}
            hint="Include country code e.g. +91 98765 43210">
            <TextInput
              type="tel" icon={FiPhone} placeholder="+91 98765 43210" error={errors.phone}
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
            <TextInput
              type="email" icon={FiMail} placeholder="customer@email.com" error={errors.email}
              {...register("email", {
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email" },
              })}
            />
          </Field>
          <Field label="Alternate Phone" icon={MdOutlineContactPhone}>
            <TextInput type="tel" icon={MdOutlineContactPhone}
              placeholder="+91 87654 32109" {...register("alternatePhone")} />
          </Field>
        </div>

        {/* Type + Communication */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Customer Type" required icon={FaUserTie}>
            <SelectInput icon={FaUserTie} options={CUSTOMER_TYPES}
              {...register("type", { required: true })} />
            <div className="flex flex-wrap gap-1.5 mt-2">
              {CUSTOMER_TYPES.map(t => {
                const c = TYPE_COLORS[t] || TYPE_COLORS.Individual;
                return (
                  <button key={t} type="button" onClick={() => setValue("type", t)}
                    className={`px-2.5 py-1 rounded-full text-xs font-bold border transition-all
                      ${selectedType === t
                        ? `${c.border} ${c.bg} ${c.text} shadow-sm scale-105`
                        : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"}`}>
                    {t === "VIP" && "👑 "}{t}
                  </button>
                );
              })}
            </div>
          </Field>

          <Field label="Communication Preference" icon={FaCommentDots}>
            <SelectInput icon={FaCommentDots} options={COMM_PREFS} {...register("commPref")} />
            <div className="flex flex-wrap gap-1.5 mt-2">
              {[
                { label: "WhatsApp", icon: <FaWhatsapp className="w-3 h-3" />, color: "text-green-600 bg-green-50 border-green-200" },
                { label: "SMS",      icon: <FiPhone className="w-3 h-3" />,    color: "text-blue-600 bg-blue-50 border-blue-200"    },
                { label: "Email",    icon: <FiMail className="w-3 h-3" />,     color: "text-indigo-600 bg-indigo-50 border-indigo-200" },
              ].map(({ label, icon, color }) => (
                <button key={label} type="button" onClick={() => setValue("commPref", label)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border transition-all
                    ${selectedComm === label ? `${color} shadow-sm` : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"}`}>
                  {icon} {label}
                </button>
              ))}
            </div>
          </Field>
        </div>

        {/* Tier + Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Loyalty Tier" icon={FaCrown}>
            <SelectInput icon={FaCrown} options={LOYALTY_TIERS} {...register("tier")} />
            <div className="flex gap-1.5 mt-2">
              {LOYALTY_TIERS.map(t => (
                <button key={t} type="button" onClick={() => setValue("tier", t)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-all
                    ${selectedTier === t
                      ? "border-blue-400 bg-blue-50 text-blue-700 shadow-sm"
                      : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"}`}>
                  {TIER_CONFIG[t]} {t}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Status" icon={FiCheckCircle}>
            <SelectInput icon={FiCheckCircle} options={CUSTOMER_STATUS} {...register("status")} />
          </Field>
        </div>
      </div>
    </div>
  );
}