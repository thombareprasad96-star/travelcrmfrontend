import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, CheckCheck, Loader2 } from "lucide-react";

import consoleNotificationService from "../api/consoleNotificationService";
import { isConsoleAuthed } from "../lib/consoleAuth";

/**
 * Platform notification bell for the console header.
 *
 * Reads the PLATFORM feed only (/api/super-admin/notifications, "sa_token"). It shares no state,
 * no service and no server table with the tenant app's bell — the two realms are separate all the
 * way down, which is what makes it impossible for a tenant's notification to appear here.
 */

/** referenceType → console route. Only types with a real destination are linked. */
const ROUTE_BY_REFERENCE_TYPE = {
  UPGRADE_REQUEST: "/console/upgrade-requests",
  // Sub-agent licences land in the same merged approval queue as upgrade requests.
  SUBAGENT_LICENSE: "/console/upgrade-requests",
  TENANT: "/console/tenants",
  SUBSCRIPTION: "/console/tenants",
  BILLING: "/console/tenants",
};

/** Compact relative time. Anything older than a week reads better as a date. */
function relativeTime(value) {
  if (!value) return "";
  const then = new Date(value).getTime();
  if (Number.isNaN(then)) return "";
  const seconds = Math.floor((Date.now() - then) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(value).toLocaleDateString();
}

export default function ConsoleNotificationBell() {
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(0);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const wrapRef = useRef(null);

  // Badge + live stream. The SSE handle self-manages reconnection with a fresh token.
  useEffect(() => {
    if (!isConsoleAuthed()) return undefined;

    let alive = true;
    consoleNotificationService.getUnreadCount().then((n) => {
      if (alive) setCount(n);
    });

    const sub = consoleNotificationService.subscribeToSSE((incoming) => {
      if (!alive) return;
      setCount((c) => c + 1);
      // Prepend so an open panel updates live; cap so a burst can't grow this unbounded.
      setItems((prev) => [incoming, ...prev].slice(0, 10));
    });

    return () => {
      alive = false;
      sub.close();
    };
  }, []);

  // Close on outside click and on Escape — a header popover that traps focus is worse than none.
  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const toggle = useCallback(async () => {
    const next = !open;
    setOpen(next);
    if (!next) return;

    setLoading(true);
    try {
      // Re-sync the badge against the server on every open. The count is otherwise only ever
      // mutated locally (+1 per push, -1 per read), so it drifts for the life of the mount —
      // and a console is left open all day. Anything created while the stream was down (up to
      // 30s of reconnect backoff, longer with an expired token), or a mark-all-read whose write
      // failed, would leave the badge permanently wrong. Opening the panel is the natural
      // reconciliation point: it is exactly when a stale number gets looked at.
      const [{ content }, freshCount] = await Promise.all([
        consoleNotificationService.getNotifications({ page: 0, size: 10 }),
        consoleNotificationService.getUnreadCount(),
      ]);
      setCount(freshCount);
      setItems((live) => {
        // A push that landed while this fetch was in flight isn't in `content` yet — keep it
        // rather than letting the slower response overwrite the newer event.
        const fetched = new Set(content.map((i) => i.publicId));
        const missed = live.filter((i) => !fetched.has(i.publicId));
        return [...missed, ...content].slice(0, 10);
      });
    } catch {
      /* 401 redirects via the interceptor; anything else leaves the last-known list in place */
    } finally {
      setLoading(false);
    }
  }, [open]);

  const openItem = async (n) => {
    setOpen(false);
    if (n.status === "UNREAD") {
      // Optimistic: the badge should react instantly. A failed write self-corrects on next load.
      setItems((prev) =>
        prev.map((i) => (i.publicId === n.publicId ? { ...i, status: "READ" } : i))
      );
      setCount((c) => Math.max(0, c - 1));
      try {
        await consoleNotificationService.markRead(n.publicId);
      } catch {
        /* noop — see above */
      }
    }
    const route = ROUTE_BY_REFERENCE_TYPE[n.referenceType];
    if (route) nav(route);
  };

  const markAll = async () => {
    setItems((prev) => prev.map((i) => ({ ...i, status: "READ" })));
    setCount(0);
    try {
      await consoleNotificationService.markAllRead();
    } catch {
      /* noop */
    }
  };

  const badge = count > 99 ? "99+" : String(count);

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={toggle}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={count > 0 ? `Notifications (${count} unread)` : "Notifications"}
        title="Notifications"
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-hover hover:text-body focus:outline-none focus-visible:ring-2 focus-visible:ring-focus"
      >
        <Bell size={18} />
        {count > 0 && (
          <span className="absolute -right-0.5 -top-0.5 inline-flex min-w-[16px] items-center justify-center rounded-full bg-accent px-1 text-[9px] font-bold leading-[16px] text-accent-text">
            {badge}
          </span>
        )}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Notifications"
          className="absolute right-0 z-30 mt-2 w-[22rem] overflow-hidden rounded-xl border border-border bg-surface shadow-[var(--sa-card-shadow)]"
        >
          {/* The one identity signature, same as the login card. */}
          <div aria-hidden="true" className="h-[3px] w-full" style={{ backgroundImage: "var(--sa-gradient)" }} />

          <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
            <p className="font-console text-[10px] uppercase tracking-[0.28em] text-accent-soft-text">
              Platform
            </p>
            {count > 0 && (
              <button
                type="button"
                onClick={markAll}
                className="inline-flex items-center gap-1.5 rounded-md px-1.5 py-1 text-xs font-semibold text-muted transition-colors hover:text-body focus:outline-none focus-visible:ring-2 focus-visible:ring-focus"
              >
                <CheckCheck size={13} />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-[22rem] overflow-y-auto">
            {loading && (
              <div className="flex items-center justify-center gap-2 px-4 py-8 text-sm text-muted">
                <Loader2 size={15} className="animate-spin motion-reduce:animate-none" />
                Loading…
              </div>
            )}

            {!loading && items.length === 0 && (
              <p className="px-4 py-8 text-center text-sm text-muted">Nothing yet.</p>
            )}

            {!loading &&
              items.map((n) => {
                const unread = n.status === "UNREAD";
                return (
                  <button
                    key={n.publicId}
                    type="button"
                    onClick={() => openItem(n)}
                    className="flex w-full gap-2.5 border-b border-border px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-surface-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus"
                  >
                    <span
                      aria-hidden="true"
                      className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${unread ? "bg-accent" : "bg-transparent"}`}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-baseline justify-between gap-2">
                        <span className={`truncate text-sm ${unread ? "font-semibold text-heading" : "text-body"}`}>
                          {n.title}
                        </span>
                        <span className="shrink-0 font-mono text-[10px] text-muted">
                          {relativeTime(n.createdAt)}
                        </span>
                      </span>
                      {n.message && (
                        <span className="mt-0.5 block text-xs leading-relaxed text-body">{n.message}</span>
                      )}
                      {n.tenantName && (
                        <span className="mt-1 block font-mono text-[10px] text-muted">{n.tenantName}</span>
                      )}
                    </span>
                  </button>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}