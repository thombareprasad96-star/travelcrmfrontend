// src/features/auth/api/LoginService.js
//
// There is one login form for two backend realms, so the form probes the superadmin endpoint first
// and falls back to the tenant-user endpoint. Two things about that fallback were wrong:
//
//  1. It fell through on ANY error. A 429 from the rate limiter therefore fired a SECOND request,
//     burning a second bucket — the fallback actively made the rate limiting worse. So did a 500 and
//     a network outage. Now only a 401/403 (genuinely "not this realm") falls through.
//
//  2. It ended in `throw new Error("Invalid Email or Password")`, a hardcoded string that discarded
//     the real cause. Rate-limited, in maintenance, server down, offline — the user was told their
//     password was wrong. The real error now propagates, and the caller renders its message via
//     getErrorMessage().

import API from "@shared/api/http";
import { normalizeError, ErrorCode } from "@shared/api/apiError";

function transformLoginData(email, password) {
  return {
    email: email,
    password: password,
  };
}

/** Only these mean "wrong realm, try the other endpoint". Everything else is a real failure. */
function isWrongRealm(error) {
  const { code } = normalizeError(error);
  return code === ErrorCode.UNAUTHENTICATED || code === ErrorCode.PERMISSION_DENIED;
}

export const authService = {
  login: async (email, password) => {
    const loginData = transformLoginData(email, password);

    try {
      // Step 1: try the platform SuperAdmin endpoint.
      const response = await API.post("auth/superadmin/login", loginData);
      response.data.role = "super_admin";
      return response;
    } catch (superAdminError) {
      // A 429 / 5xx / network failure here says nothing about which realm the account is in.
      // Retrying against the user endpoint would double the load and mask the real cause.
      if (!isWrongRealm(superAdminError)) throw superAdminError;

      // Step 2: not a SuperAdmin — try the tenant user endpoint.
      // Preserve the REAL tenant role from the backend (TENANT_ADMIN / MANAGER /
      // TRAVEL_AGENT / STAFF / ACCOUNTANT). This was previously hard-coded to "user",
      // which made every tenant user appear as STAFF in the UI (Users menu hidden, etc.).
      const response = await API.post("auth/user/login", loginData);
      if (!response.data.role) response.data.role = "user";
      return response;
    }
  },
};