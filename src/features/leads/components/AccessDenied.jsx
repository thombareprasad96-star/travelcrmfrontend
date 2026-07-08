// src/components/AccessDenied.jsx
// ─────────────────────────────────────────────────────────────
// Full-page "you can't see this" block — shown when a route/page is
// opened without the required permission (vs. a blank/empty screen).
// Design-system: glass card, blue-600 primary, Plus Jakarta Sans.
// ─────────────────────────────────────────────────────────────

import { Lock as FiLock } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AccessDenied({
  title = "Access Denied",
  message = "You don't have access to this. Please contact your administrator.",
}) {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 p-4"
      style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
    >
      <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/60 shadow-sm max-w-md w-full p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-5">
          <FiLock className="w-7 h-7 text-red-500" />
        </div>
        <h1 className="text-xl font-extrabold text-slate-800 mb-2">{title}</h1>
        <p className="text-sm text-slate-500 leading-relaxed mb-6">{message}</p>
        <button
          onClick={() => navigate("/")}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-md shadow-blue-200 hover:shadow-lg transition-all"
        >
          Back to Dashboard
        </button>
        <p className="mt-6 text-[11px] text-slate-400">Copyright © </p>
      </div>
    </div>
  );
}