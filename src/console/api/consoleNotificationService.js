import ConsoleAPI, { unwrap } from "./consoleHttp";
import { getConsoleToken } from "../lib/consoleAuth";

/**
 * Platform notification feed for the console — the counterpart to the tenant app's
 * notificationService, against the SEPARATE platform realm (/api/super-admin/notifications,
 * "sa_token", its own table and its own SSE registry on the server).
 *
 * The REST calls go through ConsoleAPI rather than raw `fetch`, so they inherit the console's
 * token attachment and its 401 → /superadmin/login redirect. The tenant service hand-rolls
 * `fetch` + auth headers and therefore had to re-learn that `fetch` does not reject on 4xx;
 * axios does, so there is nothing to re-learn here.
 */

const BASE = "/super-admin/notifications";

/** EventSource cannot use axios, so the stream URL is built against the same origin ConsoleAPI uses. */
const API_ROOT = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const consoleNotificationService = {
  /** Backend returns PagedApiResponse: { data: [...], pagination: {...} }. Normalise to { content }. */
  async getNotifications({ page = 0, size = 20 } = {}) {
    const res = await ConsoleAPI.get(`${BASE}?page=${page}&size=${size}`);
    return { content: res?.data?.data ?? [] };
  },

  /** Backend returns ApiResponse<Map>: { data: { count: N } }. A failure must not break the shell. */
  async getUnreadCount() {
    try {
      const res = await ConsoleAPI.get(`${BASE}/unread-count`);
      return unwrap(res)?.count ?? 0;
    } catch {
      return 0;
    }
  },

  async markRead(publicId) {
    await ConsoleAPI.put(`${BASE}/${publicId}/read`);
  },

  async markAllRead() {
    await ConsoleAPI.put(`${BASE}/mark-all-read`);
  },

  /**
   * Live push. EventSource can't set an Authorization header, so the JWT rides in the query
   * string — and the browser's built-in auto-reconnect would replay that same URL forever. So
   * reconnection is self-managed: on a permanently CLOSED connection, rebuild by re-reading the
   * token, backing off between tries.
   *
   * Re-reading storage picks up a token that ANOTHER tab refreshed or re-logged-in with. It does
   * not, by itself, make an expired token valid — so repeated failures eventually probe the
   * session rather than loop on a dead token (see probeSession).
   *
   * Returns the same { close() } handle the caller unmounts with.
   */
  subscribeToSSE(onNotification, onError) {
    let es = null;
    let stopped = false;
    let retryTimer = null;
    let failures = 0;
    let backoff = 3000; // doubles per failure, capped
    const MAX_BACKOFF = 30000;
    const FAILURES_BEFORE_PROBE = 6; // ~2 min of backoff before we question the session itself

    const cleanup = () => {
      if (retryTimer) { clearTimeout(retryTimer); retryTimer = null; }
      if (es) { try { es.close(); } catch { /* noop */ } es = null; }
    };

    /**
     * EventSource reports "it broke" and never "why" — a 401 from an expired token is
     * indistinguishable from the server being down. Left alone, an expired console session
     * 401-loops here every 30s forever while the UI still looks signed in, because a console
     * parked on a static page issues no other request to trip ConsoleAPI's 401 interceptor.
     * One real request hands the question to the auth realm that already owns the answer
     * (clear sa_token → /superadmin/login). If the session is alive and the server was merely
     * down, this is a cheap no-op and reconnection carries on.
     */
    const probeSession = () => {
      ConsoleAPI.get(`${BASE}/unread-count`)
        .then(() => { failures = 0; })
        .catch(() => { /* a 401 is handled by the interceptor; anything else keeps retrying */ });
    };

    const scheduleReconnect = () => {
      if (stopped || retryTimer) return;
      if (!getConsoleToken()) { cleanup(); return; } // signed out — nothing to reconnect with
      failures += 1;
      if (failures === FAILURES_BEFORE_PROBE) probeSession();
      retryTimer = setTimeout(() => { retryTimer = null; connect(); }, backoff);
      backoff = Math.min(backoff * 2, MAX_BACKOFF);
    };

    const connect = () => {
      if (stopped) return;
      const token = getConsoleToken();
      if (!token) { cleanup(); return; }

      if (es) { try { es.close(); } catch { /* noop */ } }
      es = new EventSource(`${API_ROOT}${BASE}/stream?token=${encodeURIComponent(token)}`);

      // The server sends NAMED events — SseEmitter.event().name("notification") — and named
      // events never fire onmessage. addEventListener is not a style choice here.
      es.addEventListener("notification", (e) => {
        try {
          onNotification(JSON.parse(e.data));
        } catch (err) {
          console.error("[console SSE] Parse error:", err);
        }
      });

      es.onopen = () => { backoff = 3000; failures = 0; };

      es.onerror = (err) => {
        onError?.(err);
        // CONNECTING = a transient blip; the browser retries fine with a still-valid token.
        // CLOSED = it gave up (e.g. the token expired), and it would only retry the same stale
        // URL — so we rebuild it ourselves.
        if (es && es.readyState === EventSource.CLOSED) {
          console.warn("[console SSE] Connection closed — reconnecting with a fresh token");
          scheduleReconnect();
        }
      };
    };

    connect();

    return {
      close() { stopped = true; cleanup(); },
    };
  },
};

export default consoleNotificationService;