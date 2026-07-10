// src/shared/ui/toast.jsx
//
// A dependency-free toast system with an imperative API.
//
// Why not `sonner` / `react-hot-toast`? The defect was never "no library" — it was that toast state
// lived inside individual components, so the axios interceptor (a plain module, not a React tree)
// had nowhere to send an error. This app had already grown three private toast implementations:
// a fleet `useToast()` hook, a module-global `_toastSetter` in Sightseeing.jsx that silently
// no-opped whenever its host wasn't mounted, and seven copies in console/pages/*.
//
// So: state lives in a module-level store, `<ToastHost/>` merely subscribes to it, and `toast.error()`
// works from anywhere — interceptors, event handlers, async callbacks. Two consequences matter:
//
//   1. The store survives a React unmount. `<ToastHost/>` is mounted ABOVE `RouteErrorBoundary`
//      (see App.jsx), so when a render crash swaps the route tree for the fallback UI, queued toasts
//      keep working and the toast explaining the crash still appears.
//   2. Swapping in a real library later is a one-file change, because every call site imports our
//      `toast` facade rather than a library symbol. The facade is the asset; this file is an
//      implementation detail.

import { useCallback, useSyncExternalStore } from "react";

/* ── Store ─────────────────────────────────────────────────────────────────── */

const listeners = new Set();
let toasts = [];
let nextId = 1;

/** Suppresses the duplicate storm from N parallel requests failing with the same message. */
const DEDUPE_WINDOW_MS = 4000;

function notify() {
  for (const listener of listeners) listener();
}

/** `toasts` is replaced immutably on every change, so this reference is stable between changes —
 *  which is exactly the contract useSyncExternalStore's getSnapshot requires. */
function subscribe(onStoreChange) {
  listeners.add(onStoreChange);
  return () => listeners.delete(onStoreChange);
}
const getSnapshot = () => toasts;

function push(type, message, { duration } = {}) {
  const text = typeof message === "string" ? message.trim() : "";
  if (!text) return null;

  const now = Date.now();
  const duplicate = toasts.find(
    (t) => t.type === type && t.message === text && now - t.createdAt < DEDUPE_WINDOW_MS
  );
  if (duplicate) return duplicate.id;

  const id = nextId++;
  const ttl = duration ?? (type === "error" ? 6000 : 3500);
  toasts = [...toasts, { id, type, message: text, createdAt: now }];
  notify();

  if (ttl > 0) setTimeout(() => dismiss(id), ttl);
  return id;
}

export function dismiss(id) {
  toasts = toasts.filter((t) => t.id !== id);
  notify();
}

export function dismissAll() {
  toasts = [];
  notify();
}

/**
 * Imperative API. Safe to call from anywhere, including outside React.
 * Errors linger longer than successes — the user has to read and act on them.
 */
export const toast = {
  success: (message, options) => push("success", message, options),
  error: (message, options) => push("error", message, options),
  warning: (message, options) => push("warning", message, options),
  info: (message, options) => push("info", message, options),
  dismiss,
  dismissAll,
};

/* ── Presentation ──────────────────────────────────────────────────────────── */

const STYLES = {
  success: { box: "border-green-200 bg-green-50 text-green-800", icon: "✅" },
  error:   { box: "border-red-200 bg-red-50 text-red-800",       icon: "❌" },
  warning: { box: "border-amber-200 bg-amber-50 text-amber-900", icon: "⚠️" },
  info:    { box: "border-blue-200 bg-blue-50 text-blue-800",    icon: "ℹ️" },
};

function ToastCard({ item }) {
  const { box, icon } = STYLES[item.type] ?? STYLES.info;
  return (
    <div
      className={`pointer-events-auto flex max-w-sm items-start gap-3 rounded-2xl border px-4 py-3.5 shadow-2xl ${box}`}
      style={{ animation: "crmToastIn .25s ease both" }}
    >
      <span aria-hidden="true" className="text-lg leading-none">{icon}</span>
      <p className="flex-1 text-sm font-semibold">{item.message}</p>
      <button
        type="button"
        aria-label="Dismiss notification"
        onClick={() => dismiss(item.id)}
        className="ml-1 text-lg leading-none opacity-50 hover:opacity-100"
      >
        ×
      </button>
    </div>
  );
}

/**
 * Mount exactly once, above the router and above any error boundary.
 *
 * Errors are announced assertively (a failed save must interrupt); everything else politely, so a
 * screen reader isn't yanked out of the user's current context by a success confirmation.
 */
export function ToastHost() {
  // useSyncExternalStore, not useState+useEffect: it reads the store during render, so a toast
  // queued before this component mounted (an interceptor firing during the initial data fetch) is
  // shown on the first paint rather than after a second, cascading render.
  const items = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  if (items.length === 0) return null;

  const errors = items.filter((t) => t.type === "error");
  const rest = items.filter((t) => t.type !== "error");

  return (
    <>
      <style>{`@keyframes crmToastIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:none}}`}</style>
      <div className="pointer-events-none fixed right-5 top-5 z-[999] flex flex-col gap-2">
        <div aria-live="assertive" aria-atomic="false" className="flex flex-col gap-2">
          {errors.map((item) => <ToastCard key={item.id} item={item} />)}
        </div>
        <div aria-live="polite" aria-atomic="false" className="flex flex-col gap-2">
          {rest.map((item) => <ToastCard key={item.id} item={item} />)}
        </div>
      </div>
    </>
  );
}

/* ── Back-compat ───────────────────────────────────────────────────────────── */

/**
 * Drop-in replacement for the fleet module's local hook, so its six pages need no edits.
 * `toastNode` is now `null` — `<ToastHost/>` renders everything — but returning the key keeps
 * `{toastNode}` in existing JSX harmless.
 */
export function useToast() {
  const showToast = useCallback((message, type = "success") => {
    (toast[type] ?? toast.info)(message);
  }, []);
  return { showToast, toastNode: null };
}