// src/shared/api/apiError.js
//
// One place that turns anything thrown by axios or fetch into a shape the UI can trust.
//
// The rule this module exists to enforce: **never show the user `error.message`.**
// On an axios error that string is "Request failed with status code 500", "Network Error", or
// "timeout of 10000ms exceeded". It reads like a bug report, not a sentence. Worse, because axios
// always populates it, the common idiom `err.message || "Couldn't save."` makes the friendly
// fallback permanently unreachable.
//
// The backend sends { success, status, code, message, fieldErrors, details, traceId, timestamp }
// for every non-2xx response (see ApiError.java). `message` is always copy written for a human.

/** Mirrors the backend `ErrorCode` enum. Branch on these — never on `message`, never on status alone. */
export const ErrorCode = {
  VALIDATION_ERROR: "VALIDATION_ERROR",
  BAD_REQUEST: "BAD_REQUEST",
  MALFORMED_REQUEST: "MALFORMED_REQUEST",
  UNAUTHENTICATED: "UNAUTHENTICATED",
  PERMISSION_DENIED: "PERMISSION_DENIED",
  MODULE_NOT_ENABLED: "MODULE_NOT_ENABLED",
  NOT_FOUND: "NOT_FOUND",
  METHOD_NOT_ALLOWED: "METHOD_NOT_ALLOWED",
  CONFLICT: "CONFLICT",
  DUPLICATE_RESOURCE: "DUPLICATE_RESOURCE",
  RESTORE_AVAILABLE: "RESTORE_AVAILABLE",
  OPTIMISTIC_LOCK: "OPTIMISTIC_LOCK",
  PAYLOAD_TOO_LARGE: "PAYLOAD_TOO_LARGE",
  UNSUPPORTED_MEDIA_TYPE: "UNSUPPORTED_MEDIA_TYPE",
  RATE_LIMITED: "RATE_LIMITED",
  INTERNAL_ERROR: "INTERNAL_ERROR",
  MAINTENANCE: "MAINTENANCE",

  // Client-side only — no HTTP response ever arrived.
  CANCELED: "CANCELED",
  TIMEOUT: "TIMEOUT",
  NETWORK_ERROR: "NETWORK_ERROR",
  UNKNOWN: "UNKNOWN",
};

const GENERIC = "Something went wrong. Please try again.";

/**
 * Used only when the response carried no usable `message` — a proxy 502 returning HTML, a gateway
 * timeout, a service that isn't ours. Our own backend always supplies one.
 */
const STATUS_FALLBACK = {
  400: "That request wasn't valid. Please check your input.",
  401: "Your session has expired. Please sign in again.",
  403: "You don't have access to this.",
  404: "We couldn't find what you were looking for.",
  405: "This action is not supported here.",
  409: "This record conflicts with an existing one.",
  413: "That file is too large.",
  415: "That file type isn't supported.",
  429: "Too many requests. Please slow down and try again shortly.",
  500: GENERIC,
  502: "We can't reach the server right now. Please try again shortly.",
  503: "The service is temporarily unavailable. Please try again shortly.",
  504: "The server took too long to respond. Please try again.",
};

/**
 * A request the app itself aborted — an unmounted component, a superseded search keystroke.
 * Callers MUST check this before calling setState, and nothing should ever be shown to the user.
 * Covers axios (`ERR_CANCELED`) and raw `fetch` + `AbortController` (`AbortError`).
 */
export function isCanceled(error) {
  if (!error) return false;
  return (
    error.code === "ERR_CANCELED" ||
    error.name === "CanceledError" ||
    error.name === "AbortError" ||
    error.__CANCEL__ === true
  );
}

/**
 * The request never got a response: offline, DNS failure, CORS rejection, server down.
 *
 * Note this is NOT simply "no .response". Our own code throws plain `Error`s with messages written
 * for the user (`throw new Error("This quotation link is invalid.")`), and those must not be
 * relabelled as network failures. So we look for positive evidence of a transport failure: axios
 * sets `isAxiosError`/`request`/`ERR_NETWORK`; a raw `fetch()` transport failure is a `TypeError`.
 */
export function isNetworkError(error) {
  if (!error || isCanceled(error) || isTimeout(error) || error.response) return false;
  if (error.code === "ERR_NETWORK" || error.isAxiosError === true || error.request) return true;
  return error instanceof TypeError;
}

export function isTimeout(error) {
  return error?.code === "ECONNABORTED" || error?.code === "ETIMEDOUT";
}

/** A plain `Error` we threw ourselves — never axios, never fetch's TypeError. Its message is ours. */
function isOwnError(error) {
  return (
    Boolean(error) &&
    !error.response &&
    !error.isAxiosError &&
    !error.request &&
    !(error instanceof TypeError) &&
    typeof error.message === "string" &&
    error.message.length > 0
  );
}

/**
 * The single normalizer. Always returns the same shape, and `message` is always safe to render.
 *
 * @returns {{status:number, code:string, message:string, fieldErrors:Object|null,
 *            details:Object|null, traceId:string|null, canceled:boolean}}
 */
export function normalizeError(error, fallbackMessage) {
  if (isCanceled(error)) {
    return shape(0, ErrorCode.CANCELED, "", null, null, null, true);
  }
  if (isTimeout(error)) {
    return shape(0, ErrorCode.TIMEOUT, "The server took too long to respond. Please try again.");
  }
  if (isNetworkError(error)) {
    return shape(0, ErrorCode.NETWORK_ERROR, "Can't reach the server. Check your connection and try again.");
  }
  // Our own `throw new Error("…")`. The message was written for a reader; use it verbatim.
  if (isOwnError(error)) {
    return shape(0, ErrorCode.UNKNOWN, error.message);
  }

  const response = error?.response;
  const status = response?.status ?? 0;
  const body = response?.data;

  // A blob/arraybuffer response (file downloads) or an HTML error page — body is not our envelope.
  const envelope = body && typeof body === "object" && !Array.isArray(body) ? body : null;

  const message =
    envelope?.message ||
    fallbackMessage ||
    STATUS_FALLBACK[status] ||
    GENERIC;

  const code =
    envelope?.code ||
    inferCodeFromStatus(status);

  const traceId = envelope?.traceId || headerTraceId(response) || null;

  return shape(
    status,
    code,
    message,
    envelope?.fieldErrors ?? null,
    envelope?.details ?? null,
    traceId
  );
}

/**
 * The message to show a user. Pass `fallback` for context the backend can't know
 * ("Couldn't load hotels."); it is used only when the server sent no message of its own.
 *
 * Note the argument order versus the old `err.message || "…"` idiom: here the server's copy always
 * wins, and the fallback is genuinely a fallback.
 */
export function getErrorMessage(error, fallback) {
  return normalizeError(error, fallback).message;
}

/** `{ email: "must be a valid email address" }` for a 400 VALIDATION_ERROR, else null. */
export function getFieldErrors(error) {
  return normalizeError(error).fieldErrors;
}

/** Validation failures belong beside the input that caused them — never in a toast. */
export function isValidationError(error) {
  const { code, fieldErrors } = normalizeError(error);
  return code === ErrorCode.VALIDATION_ERROR || Boolean(fieldErrors);
}

/** For a 5xx, gives the user something to quote in a support ticket. */
export function getTraceId(error) {
  return normalizeError(error).traceId;
}

/**
 * Codes the axios interceptor already showed the user — see `handleError` in authRealm.js.
 * Kept here rather than exported from authRealm so a call site never has to import the interceptor
 * just to ask what it did.
 */
const INTERCEPTOR_OWNED = new Set([
  ErrorCode.UNAUTHENTICATED,
  ErrorCode.PERMISSION_DENIED,
  ErrorCode.MODULE_NOT_ENABLED,
  ErrorCode.RATE_LIMITED,
  ErrorCode.NETWORK_ERROR,
  ErrorCode.TIMEOUT,
  ErrorCode.INTERNAL_ERROR,
  ErrorCode.MAINTENANCE,
]);

/**
 * True when the user has already been told about this error, so the call site must stay silent.
 *
 * The division of labour: the interceptor owns what the user cannot fix locally — expired session,
 * no permission, module not in the plan, rate limit, transport failure, server fault, maintenance.
 * The call site owns what the user just typed — validation, conflict, not-found — because only it
 * knows which field or row to point at. Without this guard a single 403 surfaces twice: once from
 * `<ToastHost/>` and once from the page's own `catch`.
 *
 * Canceled requests count as reported: an aborted request is not a failure and is never shown.
 *
 * Only meaningful for requests made through a client that installed the interceptor (http.js,
 * consoleHttp.js, portalClient.js). Auth endpoints are exempt there, so a login page must render
 * its own 401 rather than consult this.
 */
export function isAlreadyReported(error) {
  const { code, canceled } = normalizeError(error);
  return canceled || INTERCEPTOR_OWNED.has(code);
}

// ── internals ──────────────────────────────────────────────────────────────

function shape(status, code, message, fieldErrors = null, details = null, traceId = null, canceled = false) {
  return { status, code, message, fieldErrors, details, traceId, canceled };
}

function headerTraceId(response) {
  const headers = response?.headers;
  if (!headers) return null;
  // axios v1 exposes AxiosHeaders (has .get); a plain fetch Headers also has .get.
  if (typeof headers.get === "function") return headers.get("x-trace-id");
  return headers["x-trace-id"] || null;
}

function inferCodeFromStatus(status) {
  if (status === 401) return ErrorCode.UNAUTHENTICATED;
  if (status === 403) return ErrorCode.PERMISSION_DENIED;
  if (status === 404) return ErrorCode.NOT_FOUND;
  if (status === 409) return ErrorCode.CONFLICT;
  if (status === 429) return ErrorCode.RATE_LIMITED;
  if (status === 503) return ErrorCode.MAINTENANCE;
  if (status >= 500) return ErrorCode.INTERNAL_ERROR;
  if (status >= 400) return ErrorCode.BAD_REQUEST;
  return ErrorCode.UNKNOWN;
}