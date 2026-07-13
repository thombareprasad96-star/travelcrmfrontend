// src/features/assistant/DishaWidget.jsx
//
// "Disha" — the floating internal AI assistant for staff. Lives in the authenticated app shell
// (see app/Layout.jsx) so it's available on every page. Read-only: it answers questions about the
// signed-in user's own leads, bookings, quotations and reminders by calling the backend tool-calling
// agent (Groq). All tenant/user scoping is enforced server-side; this widget only renders.

import { useEffect, useRef, useState, useCallback } from "react";
import { createSession, getMessages, streamMessage } from "./api/assistantClient";

const SUGGESTIONS = [
  "This week's pending quotations",
  "Bookings due for payment",
  "Reminders due today",
  "Show my latest leads",
];

let _seq = 0;
const uid = () => `m${Date.now()}_${++_seq}`;

/* ── tiny inline icons (no icon dependency) ─────────────────────────── */
const Icon = {
  Spark: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 3l1.9 4.6L18.5 9.5 13.9 11.4 12 16l-1.9-4.6L5.5 9.5l4.6-1.9L12 3z" />
      <path d="M19 14l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8.8-2z" />
    </svg>
  ),
  Close: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  ),
  Send: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  ),
  Stop: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <rect x="6" y="6" width="12" height="12" rx="2" />
    </svg>
  ),
  Refresh: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5" />
    </svg>
  ),
};

export default function DishaWidget() {
  const [open, setOpen] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [fatal, setFatal] = useState(null); // session-init failure

  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const abortRef = useRef(null);

  // Only render for signed-in staff (defensive — Layout is already behind auth).
  const hasToken = typeof window !== "undefined" && !!localStorage.getItem("token");

  const scrollToBottom = useCallback(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, []);

  useEffect(() => {
    if (open) scrollToBottom();
  }, [messages, open, scrollToBottom]);

  // Lazily create a session the first time the panel opens.
  useEffect(() => {
    if (!open || sessionId || fatal) return;
    let cancelled = false;
    (async () => {
      try {
        const session = await createSession("Disha chat");
        if (cancelled) return;
        setSessionId(session.publicId);
        // A brand-new session has no history, but load defensively in case one is reused later.
        try {
          const history = await getMessages(session.publicId);
          if (!cancelled && Array.isArray(history) && history.length) {
            setMessages(
              history.map((m) => ({
                id: m.publicId || uid(),
                role: (m.role || "").toUpperCase() === "USER" ? "user" : "assistant",
                content: m.content || "",
              }))
            );
          }
        } catch {
          /* history is optional */
        }
      } catch (err) {
        if (!cancelled) setFatal(err?.message || "Couldn't start Disha right now.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open, sessionId, fatal]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 60);
  }, [open]);

  const autoGrow = (el) => {
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  };

  const stop = useCallback(() => {
    abortRef.current?.();
    abortRef.current = null;
    setBusy(false);
    setMessages((prev) => prev.map((m) => (m.streaming ? { ...m, streaming: false } : m)));
  }, []);

  const send = useCallback(
    async (raw) => {
      const text = (raw ?? "").trim();
      if (!text || busy) return;

      let sid = sessionId;
      if (!sid) {
        try {
          const s = await createSession("Disha chat");
          sid = s.publicId;
          setSessionId(sid);
        } catch (err) {
          setFatal(err?.message || "Couldn't start Disha right now.");
          return;
        }
      }

      const asstId = uid();
      setMessages((prev) => [
        ...prev,
        { id: uid(), role: "user", content: text },
        { id: asstId, role: "assistant", content: "", streaming: true },
      ]);
      setInput("");
      if (inputRef.current) autoGrow(inputRef.current);
      setBusy(true);

      abortRef.current = streamMessage(sid, text, {
        onToken: (t) =>
          setMessages((prev) =>
            prev.map((m) => (m.id === asstId ? { ...m, content: m.content + t } : m))
          ),
        onDone: () => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === asstId
                ? {
                    ...m,
                    streaming: false,
                    content: m.content || "I didn't find anything to show for that.",
                  }
                : m
            )
          );
          setBusy(false);
          abortRef.current = null;
        },
        onError: (msg) => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === asstId ? { ...m, role: "error", streaming: false, content: msg } : m
            )
          );
          setBusy(false);
          abortRef.current = null;
        },
      });
    },
    [busy, sessionId]
  );

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  const newChat = async () => {
    stop();
    setMessages([]);
    setFatal(null);
    try {
      const s = await createSession("Disha chat");
      setSessionId(s.publicId);
    } catch (err) {
      setFatal(err?.message || "Couldn't start a new chat.");
    }
  };

  if (!hasToken) return null;

  return (
    <>
      {/* Floating launcher */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open Disha AI assistant"
          className="fixed bottom-5 right-5 z-[60] flex h-14 w-14 items-center justify-center
                     rounded-full text-gold-ink shadow-lg shadow-gold-900/25 ring-1 ring-gold-500/40
                     transition-transform duration-200 hover:scale-105 active:scale-95
                     bg-gradient-to-br from-gold-300 via-gold-400 to-gold-500
                     focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-600"
        >
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold-400/30" />
          <Icon.Spark className="relative h-7 w-7" />
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div
          role="dialog"
          aria-label="Disha AI assistant"
          className="fixed bottom-5 right-5 z-[60] flex flex-col overflow-hidden rounded-2xl
                     border border-gold-200 bg-white shadow-2xl shadow-gold-900/20
                     w-[min(400px,calc(100vw-2rem))] h-[min(620px,calc(100vh-2rem))]"
          style={{ fontFamily: '"Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif' }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 bg-gradient-to-r from-gold-400 to-gold-500 px-4 py-3 text-gold-ink">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/30 ring-1 ring-white/40">
              <Icon.Spark className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-extrabold leading-tight">Disha</div>
              <div className="text-[11px] font-medium leading-tight opacity-80">
                AI Assistant · read-only
              </div>
            </div>
            <button
              type="button"
              onClick={newChat}
              title="New chat"
              aria-label="Start a new chat"
              className="rounded-lg p-1.5 transition hover:bg-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            >
              <Icon.Refresh className="h-[18px] w-[18px]" />
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              title="Close"
              aria-label="Close Disha"
              className="rounded-lg p-1.5 transition hover:bg-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            >
              <Icon.Close className="h-[18px] w-[18px]" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-gold-50/40 px-3.5 py-4">
            {fatal ? (
              <div className="mx-auto mt-6 max-w-[85%] rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-center text-[13px] text-amber-800">
                {fatal}
              </div>
            ) : messages.length === 0 ? (
              <EmptyState onPick={(q) => send(q)} disabled={busy} />
            ) : (
              messages.map((m) => <Bubble key={m.id} message={m} />)
            )}
          </div>

          {/* Composer */}
          <div className="border-t border-gold-100 bg-white px-3 py-2.5">
            <div className="flex items-end gap-2 rounded-xl border border-gold-200 bg-gold-50/40 px-2.5 py-1.5 focus-within:border-gold-400 focus-within:ring-2 focus-within:ring-gold-300/50">
              <textarea
                ref={inputRef}
                value={input}
                rows={1}
                onChange={(e) => {
                  setInput(e.target.value);
                  autoGrow(e.target);
                }}
                onKeyDown={onKeyDown}
                placeholder="Ask about leads, bookings, quotations…"
                className="max-h-[120px] flex-1 resize-none bg-transparent py-1 text-[13.5px] text-slate-800 placeholder:text-slate-400 focus:outline-none"
              />
              {busy ? (
                <button
                  type="button"
                  onClick={stop}
                  aria-label="Stop generating"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-700 text-white transition hover:bg-slate-800"
                >
                  <Icon.Stop className="h-3.5 w-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => send(input)}
                  disabled={!input.trim()}
                  aria-label="Send message"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gold-ink transition
                             bg-gradient-to-br from-gold-300 to-gold-500 hover:from-gold-400 hover:to-gold-600
                             disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Icon.Send className="h-4 w-4" />
                </button>
              )}
            </div>
            <p className="mt-1.5 px-1 text-[10.5px] leading-tight text-slate-400">
              Disha reads only your own CRM data. Enter to send · Shift+Enter for a new line.
            </p>
          </div>
        </div>
      )}
    </>
  );
}

/* ── sub-components ─────────────────────────────────────────────────── */

function EmptyState({ onPick, disabled }) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-4 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-300 to-gold-500 text-gold-ink shadow-md shadow-gold-900/20">
        <Icon.Spark className="h-6 w-6" />
      </div>
      <h3 className="text-[15px] font-extrabold text-slate-800">Hi, I'm Disha 👋</h3>
      <p className="mt-1 max-w-[16rem] text-[12.5px] leading-snug text-slate-500">
        Ask me about your leads, bookings, quotations and reminders in plain language.
      </p>
      <div className="mt-4 flex w-full flex-col gap-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            disabled={disabled}
            onClick={() => onPick(s)}
            className="rounded-xl border border-gold-200 bg-white px-3 py-2 text-left text-[12.5px] font-medium text-slate-700
                       transition hover:border-gold-400 hover:bg-gold-50 disabled:opacity-50"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

function Bubble({ message }) {
  const { role, content, streaming } = message;

  if (role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] whitespace-pre-wrap break-words rounded-2xl rounded-br-sm bg-gradient-to-br from-gold-300 to-gold-400 px-3.5 py-2 text-[13.5px] leading-relaxed text-gold-ink shadow-sm">
          {content}
        </div>
      </div>
    );
  }

  const isError = role === "error";
  return (
    <div className="flex justify-start">
      <div
        className={`max-w-[88%] whitespace-pre-wrap break-words rounded-2xl rounded-bl-sm px-3.5 py-2 text-[13.5px] leading-relaxed shadow-sm ${
          isError
            ? "border border-amber-200 bg-amber-50 text-amber-800"
            : "border border-slate-200 bg-white text-slate-800"
        }`}
      >
        {content}
        {streaming && <span className="ml-0.5 inline-block h-3.5 w-1.5 animate-pulse rounded-sm bg-gold-500 align-middle" />}
        {streaming && !content && <span className="text-slate-400">Disha is thinking…</span>}
      </div>
    </div>
  );
}