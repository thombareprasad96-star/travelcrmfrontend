// src/shared/api/authRealm.js
//
// The error policy shared by all three axios clients, plus the thing that stops a 401 storm.
//
// ── The 401 storm ───────────────────────────────────────────────────────────
// A dashboard fires six requests in parallel. The token has expired, so six 401s come back and each
// one used to run `localStorage.removeItem(...)` and assign `window.location.href`. The redirects
// race the clears. A module-level latch collapses that into exactly one logout.
//
// ── Why a realm, not a singleton ────────────────────────────────────────────
// This app has three genuinely separate auth realms — staff, platform console, traveler portal —
// with different token keys and different login routes. One shared latch would let a portal 401
// bounce a staff tab to the wrong login page. Each realm gets its own.
//
// ── Who displays what ───────────────────────────────────────────────────────
// The interceptor owns errors the user cannot act on locally: auth, transport, server, quota.
// The call site owns errors about the data the user just typed: validation, conflict, not-found —
// it has the context to render them beside the field or row that caused them, and a toast would be
// the wrong surface. So this function deliberately does nothing for 400/404/409.

import { ErrorCode, normalizeError } from "./apiError";
import { toast } from "../ui/toast";

/**
 * @param {object}   config
 * @param {string}   config.loginPath     e.g. "/login" — where an expired session lands.
 * @param {Function} config.isAuthUrl     (url) => boolean. True for endpoints where a 401 is a
 *                                        legitimate answer ("wrong password") rather than an expired
 *                                        session, so we must not redirect out from under the caller.
 * @param {Function} config.clearSession  Drops this realm's tokens from storage.
 * @param {Function} [config.onMaintenance] Given the message when the platform is in maintenance.
 */
export function createAuthRealm({ loginPath, isAuthUrl, clearSession, onMaintenance }) {
  let loggingOut = false;

  function logout() {
    if (loggingOut) return;
    loggingOut = true;
    clearSession();

    if (window.location.pathname.startsWith(loginPath)) {
      loggingOut = false; // already there — nothing to do, and let a later 401 try again
      return;
    }
    window.location.assign(loginPath);
  }

  /**
   * Applies the policy and returns the normalized error. The caller still rejects the promise —
   * this never swallows anything, it only decides what the user sees.
   */
  function handleError(error) {
    const normalized = normalizeError(error);

    // An aborted request is not a failure. The component that started it is gone.
    if (normalized.canceled) return normalized;

    const url = error?.config?.url ?? "";

    // The login page owns every error on an auth endpoint and renders it in its own banner.
    // A 401 there means "wrong credentials", not "expired session", so redirecting would also break
    // LoginService's superadmin→user fallback probe. Toasting a rate-limit on top of the banner would
    // just say the same thing twice.
    if (isAuthUrl(url)) return normalized;

    switch (normalized.code) {
      case ErrorCode.UNAUTHENTICATED:
        logout();
        return normalized;

      case ErrorCode.MAINTENANCE:
        if (onMaintenance) onMaintenance(normalized.message);
        else toast.error(normalized.message);
        return normalized;

      case ErrorCode.PERMISSION_DENIED:
      case ErrorCode.MODULE_NOT_ENABLED:
      case ErrorCode.RATE_LIMITED:
      case ErrorCode.NETWORK_ERROR:
      case ErrorCode.TIMEOUT:
        toast.error(normalized.message);
        return normalized;

      case ErrorCode.INTERNAL_ERROR:
        // The traceId is the only thing the user can usefully give support. The stack stays server-side.
        toast.error(
          normalized.traceId
            ? `${normalized.message} (Reference: ${normalized.traceId})`
            : normalized.message
        );
        return normalized;

      default:
        // VALIDATION_ERROR, BAD_REQUEST, NOT_FOUND, CONFLICT, RESTORE_AVAILABLE, OPTIMISTIC_LOCK…
        // Silent here on purpose. The call site renders them.
        return normalized;
    }
  }

  return { handleError, logout };
}

/**
 * Matches an auth endpoint at a path boundary.
 *
 * The previous check was `url.includes("auth/")`, a bare substring: a future `/oauth/callback` or
 * `/authors/` route would have silently opted itself out of the 401 redirect.
 */
export const matchesAuthPath = (url, segment = "auth") =>
  new RegExp(`(^|/)${segment}/`).test(url ?? "");