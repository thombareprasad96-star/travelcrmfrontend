// src/components/CreateVendor/VendorLocation.jsx

import { MapPin as FiMapPin, ChevronDown as FiChevronDown, Building as MdLocationCity, Building2 as MdBusiness } from "lucide-react";


const INDIA_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh",
  "Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka",
  "Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram",
  "Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
  "Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
  "Delhi","Chandigarh","Jammu & Kashmir","Ladakh",
];

const COUNTRIES = [
  "India","Nepal","Bhutan","Sri Lanka","Maldives","Thailand","Singapore",
  "Malaysia","Indonesia","Dubai (UAE)","Japan","Europe","USA","UK","Australia",
  "France","Germany","Italy","Switzerland","New Zealand",
];

function Field({ label, icon: Icon, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
        {Icon && <Icon className="w-3 h-3 text-teal-400" />}
        {label}
      </label>
      {children}
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-red-500 inline-block" />{error}
        </p>
      )}
    </div>
  );
}

export default function VendorLocation({ register, errors }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="bg-gradient-to-r from-teal-600 to-teal-500 px-6 py-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-xl">📍</div>
        <div>
          <h2 className="text-white font-extrabold text-base">Location & Address</h2>
          <p className="text-teal-100 text-xs">Business address, city & coverage areas</p>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {/* City + Country */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="City" icon={MdLocationCity}>
            <div className="relative">
              <MdLocationCity className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input placeholder="Mumbai" {...register("city")}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm
                  text-slate-700 placeholder-slate-400 focus:border-teal-400 focus:ring-2
                  focus:ring-teal-50 outline-none transition-all" />
            </div>
          </Field>
          <Field label="State / Province" icon={FiMapPin}>
            <div className="relative">
              <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <select {...register("state")}
                className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-slate-200 bg-white text-sm
                  text-slate-700 outline-none appearance-none cursor-pointer transition-all
                  focus:border-teal-400 focus:ring-2 focus:ring-teal-50">
                <option value="">Select state</option>
                {INDIA_STATES.map(s => <option key={s}>{s}</option>)}
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </Field>
        </div>

        {/* Country + Pincode */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Country" icon={FiMapPin}>
            <div className="relative">
              <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <select {...register("country")}
                className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-slate-200 bg-white text-sm
                  text-slate-700 outline-none appearance-none cursor-pointer transition-all
                  focus:border-teal-400 focus:ring-2 focus:ring-teal-50">
                <option value="">Select country</option>
                {COUNTRIES.map(c => <option key={c}>{c}</option>)}
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </Field>
          <Field label="Pincode / ZIP" icon={FiMapPin} error={errors.pincode?.message}>
            <div className="relative">
              <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input placeholder="400001"
                {...register("pincode", {
                  pattern: { value: /^\d{4,8}$/, message: "Enter a valid pincode" },
                })}
                className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm text-slate-700
                  placeholder-slate-400 outline-none transition-all
                  ${errors.pincode
                    ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                    : "border-slate-200 bg-white focus:border-teal-400 focus:ring-2 focus:ring-teal-50"
                  }`}
              />
            </div>
          </Field>
        </div>

        {/* Full Address */}
        <Field label="Full Business Address" icon={MdBusiness}>
          <textarea rows={3} {...register("address")}
            placeholder="Full business address, landmark, locality..."
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm
              text-slate-700 placeholder-slate-400 focus:border-teal-400 focus:ring-2
              focus:ring-teal-50 outline-none transition-all resize-none" />
        </Field>

        {/* Coverage Areas */}
        <Field label="Coverage Areas" icon={FiMapPin}>
          <textarea rows={3} {...register("coverageAreas")}
            placeholder="Cities, regions, states or countries covered e.g. Mumbai, Pune, Goa, Maharashtra..."
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm
              text-slate-700 placeholder-slate-400 focus:border-teal-400 focus:ring-2
              focus:ring-teal-50 outline-none transition-all resize-none" />
          <p className="text-xs text-slate-400">Separate multiple areas with commas</p>
        </Field>
      </div>
    </div>
  );
}