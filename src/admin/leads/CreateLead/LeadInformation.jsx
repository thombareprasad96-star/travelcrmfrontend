import { useState } from "react";
import {
  FiUser, FiPhone, FiMail, FiSearch, FiChevronDown,
  FiCalendar, FiUsers, FiTag, FiLayers, FiUserCheck
} from "react-icons/fi";

const LEAD_SOURCES = [
  "Social Media", "Website", "Google Ads", "Facebook",
  "Instagram", "WhatsApp", "Referral", "Direct Call",
];
const LEAD_TYPES = ["Fresh Lead", "Repeat Customer", "Corporate", "VIP"];
const LEAD_STAGES = [
  "New Lead", "Contacted", "Follow Up",
  "Qualified", "Proposal Sent", "Converted", "Lost",
];
const ASSIGN_TO = [
  "Rajesh Kumar", "Priya Sharma", "Amit Patel",
  "Sunita Verma", "Vikram Singh",
];

const stageColors = {
  "New Lead": "bg-blue-100 text-blue-700",
  "Contacted": "bg-yellow-100 text-yellow-700",
  "Follow Up": "bg-orange-100 text-orange-700",
  "Qualified": "bg-purple-100 text-purple-700",
  "Proposal Sent": "bg-indigo-100 text-indigo-700",
  "Converted": "bg-green-100 text-green-700",
  "Lost": "bg-red-100 text-red-700",
};

function FieldWrapper({ label, required, icon: Icon, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-600">
        {Icon && <Icon className="w-3.5 h-3.5 text-blue-500" />}
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1 mt-0.5">
          <span className="w-1 h-1 rounded-full bg-red-500 inline-block" />
          {error}
        </p>
      )}
    </div>
  );
}

function InputField({ placeholder, type = "text", icon: Icon, error, ...props }) {
  return (
    <div className="relative">
      {Icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          <Icon className="w-4 h-4" />
        </div>
      )}
      <input
        type={type}
        placeholder={placeholder}
        className={`w-full ${Icon ? "pl-9" : "pl-3"} pr-3 py-2.5 rounded-xl border text-sm transition-all outline-none
          ${error
            ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-2 focus:ring-red-100"
            : "border-slate-200 bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
          } text-slate-700 placeholder-slate-400`}
        {...props}
      />
    </div>
  );
}

function SelectField({ options, placeholder, icon: Icon, colorMap, ...props }) {
  return (
    <div className="relative">
      {Icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          <Icon className="w-4 h-4" />
        </div>
      )}
      <select
        className={`w-full ${Icon ? "pl-9" : "pl-3"} pr-8 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700
          focus:border-blue-400 focus:ring-2 focus:ring-blue-50 outline-none appearance-none transition-all cursor-pointer`}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
    </div>
  );
}

export default function LeadInformation({
  register,
  errors,
  watch,
  setValue,
  onPhoneSearch,
  searching
}) {
  const [searchPhone, setSearchPhone] = useState("");

  const handleSearch = async () => {
  if (!searchPhone.trim()) return;

  await onPhoneSearch(searchPhone);
};

  const selectedStage = watch("leadStage");

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
          <FiUser className="w-4 h-4 text-white" />
        </div>
        <div>
          <h2 className="text-white font-bold text-base">Lead Information</h2>
          <p className="text-blue-100 text-xs">Customer contact & assignment details</p>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* Search */}
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
          <p className="text-xs font-semibold text-blue-700 mb-2.5 flex items-center gap-1.5">
            <FiSearch className="w-3.5 h-3.5" /> Search Existing Lead by Phone
          </p>
          <div className="flex gap-2">
            <input
              type="tel"
              value={searchPhone}
              onChange={(e) => setSearchPhone(e.target.value)}
              placeholder="Enter phone number to search..."
              className="flex-1 px-3 py-2.5 rounded-xl border border-blue-200 bg-white text-sm text-slate-700 placeholder-slate-400
                focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            />
            <button
              type="button"
              onClick={handleSearch}
              disabled={searching}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold
                transition-all flex items-center gap-2 disabled:opacity-60 shadow-sm"
            >
              {searching ? (
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <FiSearch className="w-4 h-4" />
              )}
              {searching ? "Searching..." : "Search"}
            </button>
          </div>
        </div>

        {/* Name + Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FieldWrapper label="Customer Name" required icon={FiUser} error={errors.customerName?.message}>
            <InputField
              placeholder="Enter customer name"
              icon={FiUser}
              error={errors.customerName}
              {...register("customerName", { required: "Customer name is required" })}
            />
          </FieldWrapper>
          <FieldWrapper label="Email Address" icon={FiMail}>
            <InputField
              type="email"
              placeholder="Enter email address"
              icon={FiMail}
              {...register("email")}
            />
          </FieldWrapper>
        </div>

        {/* Phone */}
        <FieldWrapper label="Phone Number" required icon={FiPhone} error={errors.phone?.message}>
          <InputField
            type="tel"
            placeholder="+91 98765 43210"
            icon={FiPhone}
            error={errors.phone}
            {...register("phone", {
              required: "Phone number is required",
              pattern: { value: /^[+\d\s\-()]{7,15}$/, message: "Enter a valid phone number" },
            })}
          />
        </FieldWrapper>

        {/* Source + Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FieldWrapper label="Lead Source" icon={FiTag}>
            <SelectField
              options={LEAD_SOURCES}
              placeholder="Select lead source"
              icon={FiTag}
              {...register("leadSource")}
            />
          </FieldWrapper>
          <FieldWrapper label="Lead Type" icon={FiLayers}>
            <SelectField
              options={LEAD_TYPES}
              placeholder="Select lead type"
              icon={FiLayers}
              {...register("leadType")}
            />
          </FieldWrapper>
        </div>

        {/* Stage */}
        <FieldWrapper label="Lead Stage" icon={FiLayers}>
          <div className="flex flex-wrap gap-2">
            {LEAD_STAGES.map((stage) => (
              <button
                key={stage}
                type="button"
                onClick={() => setValue("leadStage", stage)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all
                  ${selectedStage === stage
                    ? `${stageColors[stage]} border-current shadow-sm scale-105`
                    : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                  }`}
              >
                {stage}
              </button>
            ))}
          </div>
          <input type="hidden" {...register("leadStage")} />
        </FieldWrapper>

        {/* Assign To + Birth Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FieldWrapper label="Assign To" icon={FiUserCheck}>
            <SelectField
              options={ASSIGN_TO}
              placeholder="Select team member"
              icon={FiUserCheck}
              {...register("assignTo")}
            />
          </FieldWrapper>
          <FieldWrapper label="Birth Date" icon={FiCalendar}>
            <InputField
              type="date"
              icon={FiCalendar}
              {...register("birthDate")}
            />
          </FieldWrapper>
        </div>
      </div>
    </div>
  );
}