// src/shared/lib/access.js
// ─────────────────────────────────────────────────────────────
// Frontend access control — the single source of truth for UI gating.
//
// This MIRRORS the backend permission model (see Permission.java /
// Permission.defaultsFor(Role) and EffectivePermissionResolver). The backend is
// always the real gate (every API is protected by @PreAuthorize); this module only
// decides what to SHOW / hide so users don't see buttons and menus they can't use.
//
// Role is read from localStorage ("userRole"), normalized to a canonical key, then
// mapped to the same default permission keys the backend grants that role.
// ─────────────────────────────────────────────────────────────

import API from "../api/http";

export const ROLES = {
  SUPERADMIN:   "SUPERADMIN",     // platform owner — manages organizations (tenants) only
  TENANT_ADMIN: "TENANT_ADMIN",   // organization admin — full control of its own tenant
  MANAGER:      "MANAGER",
  TRAVEL_AGENT: "TRAVEL_AGENT",
  STAFF:        "STAFF",
  ACCOUNTANT:   "ACCOUNTANT",
  SUB_AGENT:    "SUB_AGENT",      // B2B franchise broker — sees only its OWN rows (backend row-scoped)
};

// Wildcard — TENANT_ADMIN holds every tenant permission.
const ALL = "*";

// Canonical permission keys — identical strings to the backend Permission enum.
export const P = {
  LEAD_READ: "LEAD_READ", LEAD_CREATE: "LEAD_CREATE", LEAD_UPDATE: "LEAD_UPDATE", LEAD_DELETE: "LEAD_DELETE",
  LEAD_PERMANENT_DELETE: "LEAD_PERMANENT_DELETE",
  BOOKING_READ: "BOOKING_READ", BOOKING_CREATE: "BOOKING_CREATE", BOOKING_UPDATE: "BOOKING_UPDATE", BOOKING_CANCEL: "BOOKING_CANCEL", BOOKING_DELETE: "BOOKING_DELETE",
  // High-privilege: override/waive a cancellation charge and disburse refunds. TENANT_ADMIN-only
  // until explicitly granted (mirrors LEAD_PERMANENT_DELETE — not in any non-admin role default).
  BOOKING_REFUND: "BOOKING_REFUND", CANCELLATION_POLICY_MANAGE: "CANCELLATION_POLICY_MANAGE",
  CUSTOMER_READ: "CUSTOMER_READ", CUSTOMER_CREATE: "CUSTOMER_CREATE", CUSTOMER_UPDATE: "CUSTOMER_UPDATE", CUSTOMER_DELETE: "CUSTOMER_DELETE",
  QUOTATION_READ: "QUOTATION_READ", QUOTATION_CREATE: "QUOTATION_CREATE", QUOTATION_UPDATE: "QUOTATION_UPDATE", QUOTATION_DELETE: "QUOTATION_DELETE",
  VENDOR_READ: "VENDOR_READ", VENDOR_CREATE: "VENDOR_CREATE", VENDOR_UPDATE: "VENDOR_UPDATE", VENDOR_DELETE: "VENDOR_DELETE",
  REMINDER_READ: "REMINDER_READ", REMINDER_CREATE: "REMINDER_CREATE", REMINDER_UPDATE: "REMINDER_UPDATE", REMINDER_DELETE: "REMINDER_DELETE",
  TASK_READ: "TASK_READ", TASK_CREATE: "TASK_CREATE", TASK_UPDATE: "TASK_UPDATE", TASK_DELETE: "TASK_DELETE",
  MASTER_READ: "MASTER_READ", MASTER_MANAGE: "MASTER_MANAGE",
  USER_READ: "USER_READ", USER_CREATE: "USER_CREATE", USER_UPDATE: "USER_UPDATE", USER_DELETE: "USER_DELETE",
  REPORT_VIEW: "REPORT_VIEW",
  SETTINGS_MANAGE: "SETTINGS_MANAGE",
  TRASH_VIEW: "TRASH_VIEW", TRASH_RESTORE: "TRASH_RESTORE", TRASH_DELETE: "TRASH_DELETE",
  FLEET_READ: "FLEET_READ", FLEET_CREATE: "FLEET_CREATE", FLEET_UPDATE: "FLEET_UPDATE", FLEET_DELETE: "FLEET_DELETE",
  // Accounting / GST — invoices + tax masters, vendor bills + TDS/TCS, GST settings.
  ACCOUNTING_INVOICE_READ: "ACCOUNTING_INVOICE_READ", ACCOUNTING_INVOICE_MANAGE: "ACCOUNTING_INVOICE_MANAGE",
  ACCOUNTING_TDS_READ: "ACCOUNTING_TDS_READ", ACCOUNTING_TDS_MANAGE: "ACCOUNTING_TDS_MANAGE",
  ACCOUNTING_SETTINGS_MANAGE: "ACCOUNTING_SETTINGS_MANAGE",
  // Marketing & Campaigns — segments, broadcasts, drip sequences, auto-triggers.
  // MARKETING_SEND is the high-privilege "pull the trigger" gate (broadcast / activate a drip / fire a test).
  MARKETING_READ: "MARKETING_READ", MARKETING_CREATE: "MARKETING_CREATE", MARKETING_UPDATE: "MARKETING_UPDATE",
  MARKETING_DELETE: "MARKETING_DELETE", MARKETING_SEND: "MARKETING_SEND",
};

// Role → default permission keys. Mirrors backend Permission.defaultsFor(Role).
// (Per-user overrides will be layered on once the backend exposes the current
//  user's effective permissions; until then role defaults drive the UI.)
const ROLE_PERMISSIONS = {
  // Platform owner: NO tenant CRM permissions — only the Organizations area.
  [ROLES.SUPERADMIN]: [],

  // Organization admin: everything inside its tenant.
  [ROLES.TENANT_ADMIN]: [ALL],

  [ROLES.MANAGER]: [
    P.LEAD_READ, P.LEAD_CREATE, P.LEAD_UPDATE, P.LEAD_DELETE,
    P.BOOKING_READ, P.BOOKING_CREATE, P.BOOKING_UPDATE, P.BOOKING_CANCEL, P.BOOKING_DELETE,
    P.CUSTOMER_READ, P.CUSTOMER_CREATE, P.CUSTOMER_UPDATE, P.CUSTOMER_DELETE,
    P.QUOTATION_READ, P.QUOTATION_CREATE, P.QUOTATION_UPDATE, P.QUOTATION_DELETE,
    P.VENDOR_READ, P.VENDOR_CREATE, P.VENDOR_UPDATE,
    P.REMINDER_READ, P.REMINDER_CREATE, P.REMINDER_UPDATE, P.REMINDER_DELETE,
    P.TASK_READ, P.TASK_CREATE, P.TASK_UPDATE, P.TASK_DELETE,
    P.MASTER_READ, P.MASTER_MANAGE, P.REPORT_VIEW, P.USER_READ,
    P.FLEET_READ, P.FLEET_CREATE, P.FLEET_UPDATE, P.FLEET_DELETE,
    P.ACCOUNTING_INVOICE_READ, P.ACCOUNTING_TDS_READ,
    P.MARKETING_READ, P.MARKETING_CREATE, P.MARKETING_UPDATE, P.MARKETING_DELETE, P.MARKETING_SEND,
  ],

  // Travel Agent and Staff share the same access (matches backend).
  [ROLES.TRAVEL_AGENT]: [
    P.LEAD_READ, P.LEAD_CREATE, P.LEAD_UPDATE,
    P.BOOKING_READ, P.BOOKING_CREATE, P.BOOKING_UPDATE,
    P.CUSTOMER_READ, P.CUSTOMER_CREATE, P.CUSTOMER_UPDATE,
    P.QUOTATION_READ, P.QUOTATION_CREATE, P.QUOTATION_UPDATE,
    P.VENDOR_READ,
    P.REMINDER_READ, P.REMINDER_CREATE, P.REMINDER_UPDATE,
    P.TASK_READ, P.TASK_CREATE, P.TASK_UPDATE,
    P.MASTER_READ, P.REPORT_VIEW,
    P.FLEET_READ, P.FLEET_CREATE, P.FLEET_UPDATE,
    P.MARKETING_READ,
  ],

  [ROLES.ACCOUNTANT]: [
    P.BOOKING_READ, P.BOOKING_UPDATE,
    P.CUSTOMER_READ,
    P.QUOTATION_READ,
    P.VENDOR_READ, P.VENDOR_UPDATE,
    P.TASK_READ, P.TASK_CREATE, P.TASK_UPDATE,
    P.REPORT_VIEW, P.MASTER_READ,
    P.FLEET_READ,
    // Accounting is the accountant's core surface: full invoice + TDS/TCS + tax config.
    P.ACCOUNTING_INVOICE_READ, P.ACCOUNTING_INVOICE_MANAGE,
    P.ACCOUNTING_TDS_READ, P.ACCOUNTING_TDS_MANAGE, P.ACCOUNTING_SETTINGS_MANAGE,
  ],

  // B2B franchise broker: works ONLY on its own leads/quotes/bookings/customers/reminders
  // (backend row-scopes every read to the owner). Mirrors backend Permission.defaultsFor(SUB_AGENT).
  // NO USER_*, NO CRM_FULL, NO reports/settings — this is only the pre-cache fallback; the real
  // effective keys come from /permissions/me.
  [ROLES.SUB_AGENT]: [
    P.LEAD_READ, P.LEAD_CREATE, P.LEAD_UPDATE, P.LEAD_DELETE,
    P.QUOTATION_READ, P.QUOTATION_CREATE, P.QUOTATION_UPDATE, P.QUOTATION_DELETE,
    P.BOOKING_READ, P.BOOKING_CREATE, P.BOOKING_UPDATE,
    P.CUSTOMER_READ, P.CUSTOMER_CREATE, P.CUSTOMER_UPDATE,
    P.REMINDER_READ, P.REMINDER_CREATE, P.REMINDER_UPDATE,
    P.TASK_READ, P.TASK_CREATE, P.TASK_UPDATE,
    P.MASTER_READ,
  ],
};
// STAFF is deny-by-default — no permissions until a TENANT_ADMIN grants them. This is only
// the pre-login fallback; once /permissions/me is cached, the real effective keys drive the UI.
ROLE_PERMISSIONS[ROLES.STAFF] = [];

// Normalize whatever login stored ("SUPER_ADMIN", "super_admin", "ROLE_SUPER_ADMIN",
// "Organization Admin", "admin", "user"…) to a canonical ROLES key.
export function getRole() {
  const raw = (localStorage.getItem("userRole") || "")
    .toString().trim().toUpperCase()
    .replace(/[\s-]+/g, "_")
    .replace(/^ROLE_/, "");

  const aliases = {
    SUPER_ADMIN: ROLES.SUPERADMIN, SUPERADMIN: ROLES.SUPERADMIN, PLATFORM_ADMIN: ROLES.SUPERADMIN,
    ORGANIZATION_ADMIN: ROLES.TENANT_ADMIN, TENANT_ADMIN: ROLES.TENANT_ADMIN, ADMIN: ROLES.TENANT_ADMIN,
    MANAGER: ROLES.MANAGER,
    TRAVEL_AGENT: ROLES.TRAVEL_AGENT, AGENT: ROLES.TRAVEL_AGENT,
    STAFF: ROLES.STAFF, USER: ROLES.STAFF,
    ACCOUNTANT: ROLES.ACCOUNTANT, ACCOUNT: ROLES.ACCOUNTANT,
    SUB_AGENT: ROLES.SUB_AGENT, SUBAGENT: ROLES.SUB_AGENT,
  };
  return aliases[raw] || raw || ROLES.STAFF;
}

export function isSuperAdmin()  { return getRole() === ROLES.SUPERADMIN; }
export function isTenantAdmin() { return getRole() === ROLES.TENANT_ADMIN; }
export function isManager()     { return getRole() === ROLES.MANAGER; }
export function isSubAgent()    { return getRole() === ROLES.SUB_AGENT; }

const PERMS_KEY = "userPermissions";
const MODULES_KEY = "tenantModules";

// Base URL for the bare-fetch prime call (see primeSessionCaches) that must NOT go through the
// staff-realm axios interceptor. Mirrors http.js / ImpersonationBanner.
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

// Fetch the CURRENT user's EFFECTIVE permissions from the backend (role default
// overlaid with their saved per-user map) and cache them. Call right after login.
export async function loadMyPermissions() {
  try {
    const res  = await API.get("/permissions/me");
    const body = res?.data?.data ?? res?.data ?? {};
    const keys = Array.isArray(body.permissions) ? body.permissions : [];
    localStorage.setItem(PERMS_KEY, JSON.stringify(keys));
    localStorage.setItem("isPlatformAdmin", body.platformAdmin ? "1" : "0");
    return keys;
  } catch {
    localStorage.removeItem(PERMS_KEY);  // fall back to role defaults
    return null;
  }
}

export function clearMyPermissions() {
  localStorage.removeItem(PERMS_KEY);
  localStorage.removeItem("isPlatformAdmin");
  localStorage.removeItem(MODULES_KEY);
}

// ── Module entitlements (tenant plan) ─────────────────────────────────────────
// Which whole MODULES the tenant's plan unlocks (Feature Flags) — distinct from permissions,
// which gate a user's actions. The backend is always the real gate; this only HIDES modules the
// plan excludes so staff don't see menus their organization hasn't bought.

// Fetch + cache the tenant's effective modules. Call right after login (next to loadMyPermissions).
export async function loadMyEntitlements() {
  try {
    const res  = await API.get("/me/entitlements");
    const body = res?.data?.data ?? res?.data ?? {};
    const modules = Array.isArray(body.modules) ? body.modules : [];
    localStorage.setItem(MODULES_KEY, JSON.stringify(modules));
    return modules;
  } catch {
    localStorage.removeItem(MODULES_KEY);   // unknown → fail-open (show everything)
    return null;
  }
}

export function clearMyEntitlements() {
  localStorage.removeItem(MODULES_KEY);
}

// ── Impersonation session priming (role-agnostic) ─────────────────────────────
// Resolve + cache the effective permissions AND module entitlements for an EXPLICIT token, using a
// bare fetch that BYPASSES the staff-realm axios interceptor (so a transient 401 can never redirect
// the CONSOLE tab that primes the session). The impersonation hand-off calls this under the freshly
// minted token BEFORE opening the tenant tab, so the tenant app renders from the impersonated user's
// OWN access on its very first paint — never the browser's prior (possibly elevated) tenant cache.
//
// Works for EVERY role: /permissions/me returns exactly that user's effective keys (STAFF → none,
// MANAGER/AGENT/ACCOUNTANT → their set, TENANT_ADMIN → all). On any failure the relevant cache is
// CLEARED, so hasPermission falls back to the impersonated user's ROLE defaults — safe, never stale.
export async function primeSessionCaches(token) {
  const headers = { Authorization: `Bearer ${token}`, Accept: "application/json" };

  const permissions = (async () => {
    try {
      const res = await fetch(`${API_BASE}/permissions/me`, { headers });
      if (!res.ok) throw new Error(`permissions/me ${res.status}`);
      const body = await res.json();
      const data = body?.data ?? body ?? {};
      const keys = Array.isArray(data.permissions) ? data.permissions : [];
      localStorage.setItem(PERMS_KEY, JSON.stringify(keys));
      localStorage.setItem("isPlatformAdmin", data.platformAdmin ? "1" : "0");
    } catch {
      clearMyPermissions();   // → role-default fallback, never a stale elevated cache
    }
  })();

  const entitlements = (async () => {
    try {
      const res = await fetch(`${API_BASE}/me/entitlements`, { headers });
      if (!res.ok) throw new Error(`me/entitlements ${res.status}`);
      const body = await res.json();
      const data = body?.data ?? body ?? {};
      const modules = Array.isArray(data.modules) ? data.modules : [];
      localStorage.setItem(MODULES_KEY, JSON.stringify(modules));
    } catch {
      clearMyEntitlements();  // unknown → fail-open (hasModule shows all), same as login path
    }
  })();

  await Promise.all([permissions, entitlements]);
}

// True if the tenant's plan includes `moduleKey`. FAIL-OPEN: until entitlements load (or if the
// fetch failed) every module shows — the soft-gate only ever HIDES a module we KNOW is excluded,
// never blocks one on a missing/failed fetch. Module access is a tenant/plan property, so even
// TENANT_ADMIN is bound by it (no role bypass here, unlike hasPermission).
export function hasModule(moduleKey) {
  try {
    const stored = JSON.parse(localStorage.getItem(MODULES_KEY) || "null");
    if (Array.isArray(stored)) return stored.includes(moduleKey);
  } catch { /* malformed cache → fail-open */ }
  return true;
}

// True if the current user is allowed `permissionKey`.
// Prefers the user's REAL effective permissions (from /permissions/me); falls back
// to role defaults until that fetch has run (or if it failed).
export function hasPermission(permissionKey) {
  // Org admin holds EVERY tenant permission (mirrors the backend TENANT_ADMIN bypass). Short-circuit
  // so the admin always sees every action — including permission keys added after their cached login
  // snapshot — without needing to re-log in (e.g. a newly-introduced BOOKING_CANCEL button).
  if (isTenantAdmin()) return true;
  try {
    const stored = JSON.parse(localStorage.getItem(PERMS_KEY) || "null");
    if (Array.isArray(stored)) return stored.includes(permissionKey);
  } catch { /* malformed cache → fall through to role defaults */ }
  const perms = ROLE_PERMISSIONS[getRole()] || [];
  return perms.includes(ALL) || perms.includes(permissionKey);
}

// True if the user has ANY of the given keys (handy for whole sidebar sections).
export function hasAnyPermission(...keys) {
  return keys.some((k) => hasPermission(k));
}

export default { ROLES, P, getRole, isSuperAdmin, isTenantAdmin, isManager, isSubAgent, hasPermission, hasAnyPermission, hasModule, loadMyPermissions, clearMyPermissions, loadMyEntitlements, clearMyEntitlements, primeSessionCaches };