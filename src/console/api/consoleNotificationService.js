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
   * string — which means the browser's built-in auto-reconnect would replay a STALE token
   * forever once it expires (endless 401s). So reconnection is self-managed: on a permanently
   * CLOSED connection, rebuild with a FRESH token read from storage, backing off between tries.
   *
   * Returns the same { close() } handle the caller unmounts with.
   */
  subscribeToSSE(onNotification, onError) {
    let es = null;
    let stopped = false;
    let retryTimer = null;
    let backoff = 3000; // doubles per failure, capped
    const MAX_BACKOFF = 30000;

    const cleanup = () => {
      if (retryTimer) { clearTimeout(retryTimer); retryTimer = null; }
      if (es) { try { es.close(); } catch { /* noop */ } es = null; }
    };

    const scheduleReconnect = () => {
      if (stopped || retryTimer) return;
      if (!getConsoleToken()) { cleanup(); return; } // signed out — nothing to reconnect with
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

      es.onopen = () => { backoff = 3000; };

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