// src/services/access.js
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

import API from "./axiosInstance";

export const ROLES = {
  SUPERADMIN:   "SUPERADMIN",     // platform owner — manages organizations (tenants) only
  TENANT_ADMIN: "TENANT_ADMIN",   // organization admin — full control of its own tenant
  MANAGER:      "MANAGER",
  TRAVEL_AGENT: "TRAVEL_AGENT",
  STAFF:        "STAFF",
  ACCOUNTANT:   "ACCOUNTANT",
};

// Wildcard — TENANT_ADMIN holds every tenant permission.
const ALL = "*";

// Canonical permission keys — identical strings to the backend Permission enum.
export const P = {
  LEAD_READ: "LEAD_READ", LEAD_CREATE: "LEAD_CREATE", LEAD_UPDATE: "LEAD_UPDATE", LEAD_DELETE: "LEAD_DELETE",
  LEAD_PERMANENT_DELETE: "LEAD_PERMANENT_DELETE",
  BOOKING_READ: "BOOKING_READ", BOOKING_CREATE: "BOOKING_CREATE", BOOKING_UPDATE: "BOOKING_UPDATE", BOOKING_CANCEL: "BOOKING_CANCEL", BOOKING_DELETE: "BOOKING_DELETE",
  CUSTOMER_READ: "CUSTOMER_READ", CUSTOMER_CREATE: "CUSTOMER_CREATE", CUSTOMER_UPDATE: "CUSTOMER_UPDATE", CUSTOMER_DELETE: "CUSTOMER_DELETE",
  QUOTATION_READ: "QUOTATION_READ", QUOTATION_CREATE: "QUOTATION_CREATE", QUOTATION_UPDATE: "QUOTATION_UPDATE", QUOTATION_DELETE: "QUOTATION_DELETE",
  VENDOR_READ: "VENDOR_READ", VENDOR_CREATE: "VENDOR_CREATE", VENDOR_UPDATE: "VENDOR_UPDATE", VENDOR_DELETE: "VENDOR_DELETE",
  REMINDER_READ: "REMINDER_READ", REMINDER_CREATE: "REMINDER_CREATE", REMINDER_UPDATE: "REMINDER_UPDATE", REMINDER_DELETE: "REMINDER_DELETE",
  MASTER_READ: "MASTER_READ", MASTER_MANAGE: "MASTER_MANAGE",
  USER_READ: "USER_READ", USER_CREATE: "USER_CREATE", USER_UPDATE: "USER_UPDATE", USER_DELETE: "USER_DELETE",
  REPORT_VIEW: "REPORT_VIEW",
  SETTINGS_MANAGE: "SETTINGS_MANAGE",
  TRASH_VIEW: "TRASH_VIEW", TRASH_RESTORE: "TRASH_RESTORE", TRASH_DELETE: "TRASH_DELETE",
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
    P.MASTER_READ, P.MASTER_MANAGE, P.REPORT_VIEW, P.USER_READ,
  ],

  // Travel Agent and Staff share the same access (matches backend).
  [ROLES.TRAVEL_AGENT]: [
    P.LEAD_READ, P.LEAD_CREATE, P.LEAD_UPDATE,
    P.BOOKING_READ, P.BOOKING_CREATE, P.BOOKING_UPDATE,
    P.CUSTOMER_READ, P.CUSTOMER_CREATE, P.CUSTOMER_UPDATE,
    P.QUOTATION_READ, P.QUOTATION_CREATE, P.QUOTATION_UPDATE,
    P.VENDOR_READ,
    P.REMINDER_READ, P.REMINDER_CREATE, P.REMINDER_UPDATE,
    P.MASTER_READ, P.REPORT_VIEW,
  ],

  [ROLES.ACCOUNTANT]: [
    P.BOOKING_READ, P.BOOKING_UPDATE,
    P.CUSTOMER_READ,
    P.QUOTATION_READ,
    P.VENDOR_READ, P.VENDOR_UPDATE,
    P.REPORT_VIEW, P.MASTER_READ,
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
  };
  return aliases[raw] || raw || ROLES.STAFF;
}

export function isSuperAdmin()  { return getRole() === ROLES.SUPERADMIN; }
export function isTenantAdmin() { return getRole() === ROLES.TENANT_ADMIN; }

const PERMS_KEY = "userPermissions";

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

export default { ROLES, P, getRole, isSuperAdmin, isTenantAdmin, hasPermission, hasAnyPermission, loadMyPermissions, clearMyPermissions };