

import { User as FiUser, Phone as FiPhone, Mail as FiMail, CircleCheck as FiCheckCircle, Crown as FaCrown, MessageCircleMore as FaCommentDots, Sparkles as HiSparkles } from "lucide-react";


const TYPE_COLORS = {
  Individual: { bg:"bg-blue-50",   text:"text-blue-700",   border:"border-blue-200"   },
  Corporate:  { bg:"bg-indigo-50", text:"text-indigo-700", border:"border-indigo-200" },
  VIP:        { bg:"bg-amber-50",  text:"text-amber-700",  border:"border-amber-200"  },
  Group:      { bg:"bg-teal-50",   text:"text-teal-700",   border:"border-teal-200"   },
  Agent:      { bg:"bg-purple-50", text:"text-purple-700", border:"border-purple-200" },
};
const TIER_ICON = { Bronze:"🥉", Silver:"🥈", Gold:"🥇", Platinum:"💎" };
const AVATAR_GRADS = [
  "from-blue-500 to-blue-600","from-purple-500 to-purple-600",
  "from-teal-500 to-teal-600","from-rose-500 to-rose-600",
  "from-amber-500 to-amber-600","from-indigo-500 to-indigo-600",
];

function initials(name = "") {
  return name.trim().split(" ").map(w => w[0] || "").join("").slice(0, 2).toUpperCase() || "?";
}
function grad(name = "") {
  return AVATAR_GRADS[name.charCodeAt(0) % AVATAR_GRADS.length] || AVATAR_GRADS[0];
}

export default function CustomerSummary({ watch }) {
  const name   = watch("name")     || "";
  const phone  = watch("phone")    || "";
  const email  = watch("email")    || "";
  const city   = watch("city")     || "";
  const state  = watch("state")    || "";
  const type   = watch("type")     || "Individual";
  const tier   = watch("tier")     || "Bronze";
  const status = watch("status")   || "Active";
  const comm   = watch("commPref") || "";
  const notes  = watch("notes")    || "";

  const tc  = TYPE_COLORS[type] || TYPE_COLORS.Individual;
  const checks = [!!name, !!phone, !!email, !!city, !!type, !!tier];
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
          {[["Full Name",!!name],["Phone",!!phone],["Email",!!email],
            ["City",!!city],["Type",!!type],["Tier",!!tier]].map(([l, d]) => (
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

        {!name && !phone ? (
          <div className="text-center py-8 px-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-2">
              <FiUser className="w-5 h-5 text-slate-300" />
            </div>
            <p className="text-xs text-slate-400">Fill the form to preview the customer card</p>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {/* Avatar */}
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${grad(name)} flex items-center
                justify-center text-white font-extrabold text-sm shadow flex-shrink-0`}>
                {initials(name)}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="font-extrabold text-slate-800 text-sm">{name || "—"}</p>
                  {type === "VIP" && <FaCrown className="w-3 h-3 text-amber-500" />}
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {city}{state ? `, ${state}` : ""}
                </p>
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
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {TIER_ICON[tier]} {tier}
                </span>
              )}
              <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full
                ${status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${status === "Active" ? "bg-emerald-500" : "bg-slate-400"}`} />
                {status}
              </span>
            </div>

            {/* Info */}
            <div className="space-y-1.5">
              {[[FiPhone, phone],[FiMail, email],[FaCommentDots, comm]].map(([Icon, val], i) => (
                val ? (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                    <Icon className="w-3 h-3 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{val}</span>
                  </div>
                ) : null
              ))}
            </div>

            {notes && (
              <div className="bg-amber-50 rounded-lg px-3 py-2 border border-amber-100">
                <p className="text-xs text-amber-700 font-medium leading-relaxed line-clamp-3">{notes}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tips */}
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