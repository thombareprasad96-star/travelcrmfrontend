// Platform console session storage.
//
// Uses DISTINCT localStorage keys ("sa_*") from the tenant app ("token" / "userRole"),
// mirroring the traveler portal's separate-key design. This guarantees a SuperAdmin console
// session and a tenant session can coexist in the same browser without clobbering each other,
// and that clearing one never logs the other out.

const TOKEN_KEY = "sa_token";
const NAME_KEY = "sa_name";
const EMAIL_KEY = "sa_email";
const ROLE_KEY = "sa_role";

export function getConsoleToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function isConsoleAuthed() {
  return !!localStorage.getItem(TOKEN_KEY);
}

export function setConsoleSession({ token, name, email, role } = {}) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  if (name) localStorage.setItem(NAME_KEY, name);
  if (email) localStorage.setItem(EMAIL_KEY, email);
  if (role) localStorage.setItem(ROLE_KEY, role);
}

export function getConsoleIdentity() {
  return {
    name: localStorage.getItem(NAME_KEY) || "Super Admin",
    email: localStorage.getItem(EMAIL_KEY) || "",
    role: localStorage.getItem(ROLE_KEY) || "SUPER_ADMIN",
  };
}

export function clearConsoleSession() {
  [TOKEN_KEY, NAME_KEY, EMAIL_KEY, ROLE_KEY].forEach((k) => localStorage.removeItem(k));
}