import { useState } from "react";
import { ShieldAlert, X, Loader2 } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

function readImpersonation() {
  try {
    return JSON.parse(localStorage.getItem("impersonation") || "null");
  } catch {
    return null;
  }
}

/**
 * Amber warning bar shown only while the current tab is an impersonation session (set by the
 * console before it opens the tenant app in this tab). "Exit" records the audit END, clears the
 * impersonation token, and returns to the console. Renders nothing for a normal staff session.
 */
export default function ImpersonationBanner() {
  const [imp] = useState(readImpersonation);
  const [exiting, setExiting] = useState(false);

  if (!imp) return null;

  const exit = async () => {
    setExiting(true);
    try {
      await fetch(`${API_BASE}/impersonation/end`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
    } catch {
      /* best-effort audit — still clear the session below */
    }
    ["token", "userEmail", "userRole", "impersonation"].forEach((k) => localStorage.removeItem(k));
    window.location.href = "/console/users";
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 bg-amber-500 px-4 py-2 text-center text-sm font-semibold text-slate-950">
      <ShieldAlert size={16} className="shrink-0" />
      <span>
        Impersonating <b>{imp.name}</b> ({imp.email})
        {imp.tenantName ? ` · ${imp.tenantName}` : ""}
      </span>
      <button
        onClick={exit}
        disabled={exiting}
        className="ml-1 inline-flex items-center gap-1 rounded-md bg-slate-950/15 px-2.5 py-1 text-xs font-bold hover:bg-slate-950/25 disabled:opacity-60"
      >
        {exiting ? <Loader2 size={13} className="animate-spin" /> : <X size={13} />} Exit impersonation
      </button>
    </div>
  );
}