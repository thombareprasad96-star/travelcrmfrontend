// src/components/CreateVendor/VendorSummary.jsx

import { FiCheckCircle, FiPhone, FiMail, FiMapPin } from "react-icons/fi";
import {
  FaHotel, FaPlane, FaBus, FaMapMarkedAlt,
  FaHandshake, FaWhatsapp,
} from "react-icons/fa";
import { MdBusiness, MdVerified } from "react-icons/md";
import { HiSparkles } from "react-icons/hi";

const TYPE_CONFIG = {
  Hotel:          { icon:"🏨", bg:"bg-blue-50",   text:"text-blue-700",   border:"border-blue-200"   },
  Airlines:       { icon:"✈️",  bg:"bg-sky-50",    text:"text-sky-700",    border:"border-sky-200"    },
  Transport:      { icon:"🚌", bg:"bg-orange-50", text:"text-orange-700", border:"border-orange-200" },
  DMC:            { icon:"🗺️",  bg:"bg-teal-50",   text:"text-teal-700",   border:"border-teal-200"   },
  "Travel Agency":{ icon:"🤝", bg:"bg-purple-50", text:"text-purple-700", border:"border-purple-200" },
  "Car Rental":   { icon:"🚗", bg:"bg-amber-50",  text:"text-amber-700",  border:"border-amber-200"  },
  Cruise:         { icon:"🚢", bg:"bg-indigo-50", text:"text-indigo-700", border:"border-indigo-200" },
  Insurance:      { icon:"🛡️",  bg:"bg-rose-50",   text:"text-rose-700",   border:"border-rose-200"   },
};

const AVATAR_GRADS = [
  "from-blue-500 to-blue-600","from-teal-500 to-teal-600",
  "from-indigo-500 to-indigo-600","from-amber-500 to-amber-600",
  "from-purple-500 to-purple-600","from-rose-500 to-rose-600",
];

function initials(name = "") {
  return name.trim().split(" ").map(w => w[0] || "").join("").slice(0, 2).toUpperCase() || "V";
}
function gradFor(name = "") {
  return AVATAR_GRADS[name.charCodeAt(0) % AVATAR_GRADS.length] || AVATAR_GRADS[0];
}

export default function VendorSummary({ watch, selectedServices }) {
  const name    = watch("vendorName")    || "";
  const type    = watch("vendorType")    || "";
  const contact = watch("contactPerson") || "";
  const phone   = watch("phone")         || "";
  const email   = watch("email")         || "";
  const city    = watch("city")          || "";
  const country = watch("country")       || "";
  const contract= watch("contractType")  || "";
  const payment = watch("paymentTerms")  || "";
  const status  = watch("status")        || "ACTIVE";
  const commission= watch("commissionRate") || "";

  const tc = TYPE_CONFIG[type] || null;

  const checks = [!!name, !!type, !!phone, !!email, !!city, selectedServices.length > 0];
  const pct    = Math.round(checks.filter(Boolean).length / checks.length * 100);

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-extrabold text-slate-700">Form Progress</h3>
          <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full
            ${pct === 100 ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
            {pct}%
          </span>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500
              ${pct === 100 ? "bg-green-500" : "bg-gradient-to-r from-blue-500 to-blue-400"}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="mt-3 space-y-1.5">
          {[
            ["Vendor Name",  !!name],
            ["Vendor Type",  !!type],
            ["Phone",        !!phone],
            ["Email",        !!email],
            ["City",         !!city],
            ["Services",     selectedServices.length > 0],
          ].map(([l, d]) => (
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

      {/* Live Preview */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-700 to-slate-600 px-5 py-3.5 flex items-center gap-2">
          <HiSparkles className="text-slate-300 w-4 h-4" />
          <h3 className="text-white font-extrabold text-sm">Live Preview</h3>
        </div>

        {!name && !type ? (
          <div className="text-center py-8 px-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-2">
              <MdBusiness className="w-5 h-5 text-slate-300" />
            </div>
            <p className="text-xs text-slate-400">Fill the form to preview the vendor card</p>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {/* Avatar + name */}
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradFor(name)}
                flex items-center justify-center text-white font-extrabold text-sm shadow flex-shrink-0`}>
                {initials(name)}
              </div>
              <div>
                <p className="font-extrabold text-slate-800 text-sm leading-tight">{name || "—"}</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {city}{country ? `, ${country}` : ""}
                </p>
              </div>
            </div>

            {/* Type + Status badges */}
            <div className="flex flex-wrap gap-1.5">
              {tc && (
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${tc.border} ${tc.bg} ${tc.text}`}>
                  {tc.icon} {type}
                </span>
              )}
              <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full
                ${status === "ACTIVE" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${status === "ACTIVE" ? "bg-emerald-500" : "bg-slate-400"}`} />
                {status.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}
              </span>
            </div>

            {/* Info rows */}
            <div className="space-y-1.5">
              {[
                [FiPhone,    phone || "—"],
                [FiMail,     email || "—"],
                [FaHandshake,contract || "—"],
              ].filter(([,v]) => v && v !== "—").map(([Icon, val], i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                  <Icon className="w-3 h-3 text-slate-400 flex-shrink-0" />
                  <span className="truncate">{val}</span>
                </div>
              ))}
            </div>

            {/* Commission */}
            {commission && (
              <div className="bg-indigo-50 rounded-lg px-3 py-2 border border-indigo-100">
                <p className="text-xs text-indigo-700 font-bold">💰 Commission: {commission}%</p>
              </div>
            )}

            {/* Services */}
            {selectedServices.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {selectedServices.slice(0, 4).map(s => (
                  <span key={s.id} className="text-xs bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full">
                    {s.label}
                  </span>
                ))}
                {selectedServices.length > 4 && (
                  <span className="text-xs text-slate-400">+{selectedServices.length - 4} more</span>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quick Tips */}
      <div className="bg-blue-50 rounded-2xl border border-blue-100 p-4">
        <p className="text-xs font-extrabold text-blue-700 mb-2 flex items-center gap-1.5">
          <HiSparkles className="w-3.5 h-3.5" /> Quick Tips
        </p>
        <ul className="space-y-1.5">
          {[
            "Vendor code is auto-generated on save",
            "Add all coverage areas for better matching",
            "Set credit limit to track outstanding",
            "Commission rate used for profit calculations",
            "Bank details needed for payment processing",
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