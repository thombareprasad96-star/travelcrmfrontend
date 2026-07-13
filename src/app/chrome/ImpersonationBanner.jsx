import { useState } from "react";
import { ShieldAlert, X, Loader2 } from "lucide-react";
import { clearMyPermissions, clearMyEntitlements } from "@shared/lib/access";

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
      const res = await fetch(`${API_BASE}/impersonation/end`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      // fetch resolves on 4xx/5xx, so without this a failed call looked identical to a successful
      // one. The local session is cleared either way — but a silent failure leaves the server-side
      // impersonation audit record open, which is exactly the thing an audit trail exists to catch.
      if (!res.ok) {
        console.warn(`Failed to close impersonation session server-side (${res.status}).`);
      }
    } catch (err) {
      /* best-effort audit — still clear the session below */
      console.warn("Failed to reach the impersonation-end endpoint.", err);
    }
    // Tear down the FULL impersonated session — identity keys AND the cached permission/entitlement
    // state primed for the impersonated user — so none of it can bleed into the next tenant login on
    // this browser. The console session (sa_token) is untouched, so the SuperAdmin lands back in the
    // console with its own real authority restored (a separate live realm, never a stashed token).
    ["token", "userEmail", "userRole", "impersonation"].forEach((k) => localStorage.removeItem(k));
    clearMyPermissions();
    clearMyEntitlements();
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