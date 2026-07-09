import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Building2, Eye, EyeOff, Loader2, Lock, Mail, ShieldCheck } from "lucide-react";

import ConsoleThemeProvider from "../theme/ConsoleThemeProvider";
import ThemeToggle from "../theme/ThemeToggle";
import ConsoleAPI, { unwrap } from "../api/consoleHttp";
import { setConsoleSession, isConsoleAuthed } from "../lib/consoleAuth";

/**
 * Platform SuperAdmin login. Hits POST /api/auth/superadmin/login and stores the console
 * session under "sa_token" (never "token" — a tenant session must survive alongside it,
 * and impersonation writes the tenant key).
 *
 * Deliberately unlike the tenant login: a single disciplined card, flat surfaces, violet
 * accent, a mono typographic register, and no role switcher — this realm is platform-only.
 * No marketing, no showcase: an operator opens this page to work, not to be sold to.
 */

function ConsoleLoginView() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (isConsoleAuthed()) nav("/console", { replace: true });
  }, [nav]);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      const res = await ConsoleAPI.post("/auth/superadmin/login", { email, password });
      const body = unwrap(res) || {};
      if (!body.token) throw new Error("No token in response");
      setConsoleSession({
        token: body.token,
        name: body.name,
        email: body.email,
        role: body.role || "SUPER_ADMIN",
      });
      nav("/console", { replace: true });
    } catch (e2) {
      // 401 = bad credentials (never say which half was wrong). 403 carries a real reason
      // from the server, e.g. "Your account is disabled" — surface that verbatim.
      const status = e2?.response?.status;
      const serverMessage = e2?.response?.data?.message;
      setErr(
        status === 401
          ? "Invalid email or password."
          : serverMessage || "Unable to sign in. Please try again."
      );
      setBusy(false);
    }
  };

  const field =
    "w-full rounded-lg border border-border bg-surface py-2.5 pl-10 pr-3 text-sm text-heading " +
    "placeholder:text-muted transition-colors focus:border-accent focus:outline-none " +
    "focus-visible:ring-2 focus-visible:ring-focus";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-10">
      <div className="sa-fade-in w-full max-w-md">
        {/* Theme control sits above the card so the card itself stays disciplined. */}
        <div className="mb-3 flex justify-end">
          <ThemeToggle />
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-[var(--sa-card-shadow)]">
          {/* The one identity signature: a violet→fuchsia hairline. Static, no motion. */}
          <div
            aria-hidden="true"
            className="h-[3px] w-full"
            style={{ backgroundImage: "var(--sa-gradient)" }}
          />

          <div className="p-8 sm:p-10">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-accent-text">
              <ShieldCheck size={22} strokeWidth={2.2} />
            </div>

            <p className="mt-6 font-console text-[10px] uppercase tracking-[0.3em] text-accent-soft-text">
              Platform Console
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-heading">Sign in</h1>
            <p className="mt-1.5 text-sm text-body">
              Platform operators only. Every action here is audited.
            </p>

            {err && (
              <div
                role="alert"
                aria-live="assertive"
                className="mt-6 rounded-lg border border-hue-rose/30 bg-hue-rose-soft px-3 py-2.5 text-sm font-medium text-hue-rose"
              >
                {err}
              </div>
            )}

            <form onSubmit={submit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="sa-email" className="mb-1.5 block text-xs font-semibold text-body">
                  Email
                </label>
                <div className="relative">
                  <Mail
                    size={15}
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                  />
                  <input
                    id="sa-email"
                    type="email"
                    autoComplete="username"
                    autoFocus
                    spellCheck="false"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="superadmin@demo.crm"
                    aria-invalid={!!err}
                    className={field}
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="sa-password"
                  className="mb-1.5 block text-xs font-semibold text-body"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock
                    size={15}
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                  />
                  <input
                    id="sa-password"
                    type={show ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    aria-invalid={!!err}
                    className={`${field} pr-10`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShow((s) => !s)}
                    aria-label={show ? "Hide password" : "Show password"}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted transition-colors hover:text-body focus:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                  >
                    {show ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={busy}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent py-2.5 text-sm font-semibold text-accent-text transition-colors hover:bg-accent-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:opacity-60"
              >
                {busy ? (
                  <Loader2 size={16} className="animate-spin motion-reduce:animate-none" />
                ) : (
                  <ShieldCheck size={16} />
                )}
                {busy ? "Signing in…" : "Sign in"}
              </button>
            </form>

            {/* Constraint: no role switcher here. Point agency staff at their own realm. */}
            <div className="mt-7 flex items-start gap-2.5 rounded-lg border border-border bg-page px-3.5 py-3">
              <Building2 size={15} className="mt-0.5 shrink-0 text-muted" aria-hidden="true" />
              <p className="text-xs leading-relaxed text-body">
                Agency staff sign in from their own workspace URL, not here.{" "}
                <Link
                  to="/login"
                  className="font-semibold text-accent-soft-text underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                >
                  Go to the workspace login
                </Link>
              </p>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center font-console text-[9px] uppercase tracking-[0.28em] text-muted">
          Restricted access · All actions audited
        </p>
      </div>
    </div>
  );
}

export default function ConsoleLogin() {
  return (
    <ConsoleThemeProvider>
      <ConsoleLoginView />
    </ConsoleThemeProvider>
  );
}