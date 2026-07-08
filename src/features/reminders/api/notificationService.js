// // src/services/notificationService.js
// // Connects to NotificationController REST endpoints + SSE stream

// const BASE = '/api/notifications';

// const authHeaders = () => ({
//   'Content-Type': 'application/json',
//   Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
// });

// const notificationService = {

//   // ── Fetch paginated notifications ────────────────────────────────────────
//   async getNotifications({ page = 0, size = 20 } = {}) {
//     const res = await fetch(`${BASE}?page=${page}&size=${size}`, {
//       headers: authHeaders(),
//     });
//     if (!res.ok) throw new Error('Failed to fetch notifications');
//     return res.json(); // PagedApiResponse<NotificationDTO>
//   },

//   // ── Unread count for bell badge ──────────────────────────────────────────
//   async getUnreadCount() {
//     try {
//       const res = await fetch(`${BASE}/unread-count`, { headers: authHeaders() });
//       if (!res.ok) return 0;
//       const data = await res.json();
//       return data.count ?? 0;
//     } catch {
//       return 0;
//     }
//   },

//   // ── Mark single notification as read ────────────────────────────────────
//   async markRead(publicId) {
//     await fetch(`${BASE}/${publicId}/read`, {
//       method: 'PUT',
//       headers: authHeaders(),
//     });
//   },

//   // ── Mark all as read ────────────────────────────────────────────────────
//   async markAllRead() {
//     await fetch(`${BASE}/mark-all-read`, {
//       method: 'PUT',
//       headers: authHeaders(),
//     });
//   },

//   // ── SSE: live push from server ───────────────────────────────────────────
//   // EventSource can't set Authorization header, so token is passed as query param.
//   // Backend validates it in a HandlerInterceptor before upgrading to SSE.
//   subscribeToSSE(onNotification, onError) {
//     const token = localStorage.getItem('accessToken');
//     const url   = `${BASE}/stream?token=${encodeURIComponent(token)}`;
//     const es    = new EventSource(url);

//     es.onmessage = (e) => {
//       try {
//         const notification = JSON.parse(e.data);
//         onNotification(notification);
//       } catch (err) {
//         console.error('[SSE] Parse error:', err);
//       }
//     };

//     es.onerror = (err) => {
//       console.warn('[SSE] Connection error — browser will auto-reconnect');
//       onError?.(err);
//     };

//     return es; // caller must call es.close() on unmount
//   },
// };

// export default notificationService;












// src/services/notificationService.js
// Connects to NotificationController REST endpoints + SSE stream

const BASE = '/api/notifications';

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

const notificationService = {

  // ── Fetch paginated notifications ────────────────────────────────────────
  // Backend returns PagedApiResponse: { data: [...], pagination: {...} }
  // Navbar reads result.content so we normalise to { content: [...] }
  async getNotifications({ page = 0, size = 20 } = {}) {
    const res = await fetch(`${BASE}?page=${page}&size=${size}`, {
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch notifications');
    const body = await res.json();
    return { content: body.data ?? [] };
  },

  // ── Unread count for bell badge ──────────────────────────────────────────
  // Backend returns ApiResponse<Map>: { data: { count: N } }
  async getUnreadCount() {
    try {
      const res = await fetch(`${BASE}/unread-count`, { headers: authHeaders() });
      if (!res.ok) return 0;
      const body = await res.json();
      return body.data?.count ?? 0;
    } catch {
      return 0;
    }
  },

  // ── Mark single notification as read ────────────────────────────────────
  async markRead(publicId) {
    await fetch(`${BASE}/${publicId}/read`, {
      method: 'PUT',
      headers: authHeaders(),
    });
  },

  // ── Mark all as read ────────────────────────────────────────────────────
  async markAllRead() {
    await fetch(`${BASE}/mark-all-read`, {
      method: 'PUT',
      headers: authHeaders(),
    });
  },

  // ── SSE: live push from server ───────────────────────────────────────────
  // EventSource can't set Authorization header, so token is passed as query param.
  // Backend validates it in a HandlerInterceptor before upgrading to SSE.
  subscribeToSSE(onNotification, onError) {
    const token = localStorage.getItem('token');
    const url   = `${BASE}/stream?token=${encodeURIComponent(token)}`;
    const es    = new EventSource(url);

    // Backend sends named events: SseEmitter.event().name("notification").data(...)
    // Named SSE events do NOT fire onmessage — must use addEventListener
    es.addEventListener('notification', (e) => {
      try {
        const notification = JSON.parse(e.data);
        onNotification(notification);
      } catch (err) {
        console.error('[SSE] Parse error:', err);
      }
    });

    es.onerror = (err) => {
      console.warn('[SSE] Connection error — browser will auto-reconnect');
      onError?.(err);
    };

    return es; // caller must call es.close() on unmount
  },
};

export default notificationService;