// src/components/CreateVendor/VendorFinancials.jsx

import { DollarSign as FiDollarSign, Percent as FiPercent, FileText as FiFileText, ChevronDown as FiChevronDown, Banknote as FaMoneyBillWave, Landmark as FaUniversity, CreditCard as FaCreditCard, Landmark as MdAccountBalance } from "lucide-react";


const CURRENCIES      = ["INR (₹)", "USD ($)", "EUR (€)", "GBP (£)", "AED (د.إ)", "THB (฿)", "SGD (S$)"];
const CREDIT_PERIODS  = ["No Credit", "7 Days", "15 Days", "30 Days", "45 Days", "60 Days", "90 Days"];

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

function MoneyInput({ icon: Icon, prefix, error, ...props }) {
  return (
    <div className="relative">
      {prefix && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold pointer-events-none select-none">
          {prefix}
        </div>
      )}
      {!prefix && Icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          <Icon className="w-4 h-4" />
        </div>
      )}
      <input
        type="number"
        min="0"
        className={`w-full ${prefix ? "pl-7" : "pl-9"} pr-3 py-2.5 rounded-xl border text-sm
          text-slate-700 placeholder-slate-400 outline-none transition-all
          ${error
            ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-2 focus:ring-red-100"
            : "border-slate-200 bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50"
          }`}
        {...props}
      />
    </div>
  );
}

function SelectInput({ options, placeholder, ...props }) {
  return (
    <div className="relative">
      <select
        className="w-full pl-3 pr-8 py-2.5 rounded-xl border border-slate-200 bg-white text-sm
          text-slate-700 outline-none appearance-none cursor-pointer transition-all
          focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50"
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
    </div>
  );
}

export default function VendorFinancials({ register, errors }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 px-6 py-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-xl">💰</div>
        <div>
          <h2 className="text-white font-extrabold text-base">Financial & Banking Details</h2>
          <p className="text-indigo-100 text-xs">Commission rates, credit limits & bank info</p>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* Commission + Credit Limit */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Commission (%)" icon={FiPercent}
            hint="Default commission rate">
            <div className="relative">
              <FiPercent className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input type="number" min="0" max="100" step="0.5" placeholder="e.g. 10"
                {...register("commissionRate")}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm
                  text-slate-700 placeholder-slate-400 focus:border-indigo-400 focus:ring-2
                  focus:ring-indigo-50 outline-none transition-all" />
            </div>
          </Field>
          <Field label="Currency" icon={FiDollarSign}>
            <SelectInput options={CURRENCIES} {...register("currency")} />
          </Field>
          <Field label="Credit Period" icon={FaCreditCard}>
            <SelectInput options={CREDIT_PERIODS} {...register("creditPeriod")} />
          </Field>
        </div>

        {/* Credit Limit + Initial Balance */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Credit Limit (₹)" icon={FaMoneyBillWave}
            hint="Maximum outstanding allowed">
            <MoneyInput prefix="₹" placeholder="500000" {...register("creditLimit")} />
          </Field>
          <Field label="Opening Balance (₹)" icon={FaMoneyBillWave}
            hint="Initial outstanding if any">
            <MoneyInput prefix="₹" placeholder="0" {...register("openingBalance")} />
          </Field>
        </div>

        {/* Bank Details Section */}
        <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100 space-y-4">
          <p className="text-xs font-extrabold text-indigo-700 flex items-center gap-2">
            <FaUniversity className="w-3.5 h-3.5" /> Bank Account Details
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { key:"bankName",      label:"Bank Name",       ph:"e.g. HDFC Bank, SBI" },
              { key:"accountName",   label:"Account Name",    ph:"Account holder name"  },
              { key:"accountNumber", label:"Account Number",  ph:"Account number"       },
              { key:"ifscCode",      label:"IFSC / SWIFT",    ph:"IFSC or SWIFT code"   },
            ].map(({ key, label, ph }) => (
              <div key={key} className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500">{label}</label>
                <div className="relative">
                  <MdAccountBalance className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input placeholder={ph} {...register(key)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm
                      text-slate-700 placeholder-slate-400 focus:border-indigo-400 focus:ring-2
                      focus:ring-indigo-50 outline-none transition-all" />
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500">UPI ID</label>
            <div className="relative">
              <FaCreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input placeholder="vendor@paytm or vendor@upi" {...register("upiId")}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm
                  text-slate-700 placeholder-slate-400 focus:border-indigo-400 focus:ring-2
                  focus:ring-indigo-50 outline-none transition-all" />
            </div>
          </div>
        </div>

        {/* GST + PAN */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="GST Number" icon={FiFileText}>
            <div className="relative">
              <FiFileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input placeholder="22AAAAA0000A1Z5" {...register("gstNumber")}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm
                  text-slate-700 placeholder-slate-400 focus:border-indigo-400 focus:ring-2
                  focus:ring-indigo-50 outline-none transition-all" />
            </div>
          </Field>
          <Field label="PAN Number" icon={FiFileText} error={errors.panNumber?.message}>
            <div className="relative">
              <FiFileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input placeholder="ABCDE1234F"
                {...register("panNumber", {
                  pattern: { value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, message: "Invalid PAN format" },
                })}
                className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm text-slate-700
                  placeholder-slate-400 outline-none transition-all
                  ${errors.panNumber
                    ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                    : "border-slate-200 bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50"
                  }`}
              />
            </div>
            {errors.panNumber && (
              <p className="text-xs text-red-500 mt-1">{errors.panNumber.message}</p>
            )}
          </Field>
        </div>
      </div>
    </div>
  );
}