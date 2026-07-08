

import { FileText as FiFileText, IdCard as FaIdCard, Layers as FaLayerGroup } from "lucide-react";


function Field({ label, icon: Icon, error, hint, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
        {Icon && <Icon className="w-3 h-3 text-indigo-400" />}
        {label}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-slate-400">{hint}</p>}
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-red-500 inline-block" />{error}
        </p>
      )}
    </div>
  );
}

export default function CustomerDocuments({ register, errors }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 px-6 py-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-xl">🗂️</div>
        <div>
          <h2 className="text-white font-extrabold text-base">Document Details</h2>
          <p className="text-indigo-100 text-xs">Passport, PAN, Aadhar — for visa & booking</p>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {/* Important Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Date of Birth" icon={FiFileText}>
            <div className="relative">
              <FiFileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input type="date" {...register("birthday")}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm
                  text-slate-700 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 outline-none transition-all" />
            </div>
          </Field>
          <Field label="Anniversary Date" icon={FiFileText}>
            <div className="relative">
              <FiFileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input type="date" {...register("anniversary")}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm
                  text-slate-700 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 outline-none transition-all" />
            </div>
          </Field>
        </div>

        {/* ID Documents */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { key: "passportNo", label: "Passport No.", placeholder: "A1234567",    rule: null },
            { key: "panNo",      label: "PAN Number",   placeholder: "ABCDE1234F",  rule: { pattern: { value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, message: "Invalid PAN format" } } },
            { key: "aadharNo",   label: "Aadhar Number",placeholder: "1234 5678 9012", rule: null },
          ].map(({ key, label, placeholder, rule }) => (
            <Field key={key} label={label} icon={FaIdCard} error={errors[key]?.message}>
              <div className="relative">
                <FaIdCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input placeholder={placeholder} {...register(key, rule || {})}
                  className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm text-slate-700
                    placeholder-slate-400 outline-none transition-all
                    ${errors[key]
                      ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                      : "border-slate-200 bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50"
                    }`}
                />
              </div>
            </Field>
          ))}
        </div>

        {/* Document Notes */}
        <Field label="Document Notes" icon={FaLayerGroup}
          hint="Passport expiry, visa history, special document notes">
          <textarea rows={3} {...register("documents")}
            placeholder="Document details, passport expiry dates, visa history, etc."
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm
              text-slate-700 placeholder-slate-400 focus:border-indigo-400 focus:ring-2
              focus:ring-indigo-50 outline-none transition-all resize-none" />
        </Field>
      </div>
    </div>
  );
}