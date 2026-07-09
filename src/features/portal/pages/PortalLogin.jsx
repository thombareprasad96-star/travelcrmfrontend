// src/features/portal/pages/PortalLogin.jsx
// Two-panel full-screen login: left brand hero (laptop), right OTP form.
// Two steps: identifier (phone/email) → 6-digit code. Own token realm.
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plane, Mail, ArrowRight, ArrowLeft, Loader2, ShieldCheck, AlertCircle,
  MapPin, CreditCard, FileText,
} from "lucide-react";
import portalService from "../api/portalService";
import { TRAVELER_TOKEN_KEY } from "../api/portalClient";

const RESEND_SECONDS = 30;

const PERKS = [
  { icon: MapPin, label: "View all your trips & itineraries" },
  { icon: CreditCard, label: "Track payments & pay balances" },
  { icon: FileText, label: "Store passport, visa & documents" },
];

export default function PortalLogin() {
  const navigate = useNavigate();
  const [step, setStep] = useState("identifier"); // "identifier" | "otp"
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendIn, setResendIn] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (localStorage.getItem(TRAVELER_TOKEN_KEY)) navigate("/portal", { replace: true });
  }, [navigate]);

  useEffect(() => () => clearInterval(timerRef.current), []);

  const startResendTimer = () => {
    setResendIn(RESEND_SECONDS);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setResendIn((s) => {
        if (s <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  };

  const sendOtp = async (e) => {
    e?.preventDefault();
    if (!identifier.trim()) {
      setError("Enter your registered phone or email.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await portalService.requestOtp(identifier.trim());
      setStep("otp");
      startResendTimer();
    } catch {
      setError("Could not send the code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const verify = async (e) => {
    e?.preventDefault();
    if (otp.trim().length < 4) {
      setError("Enter the code you received.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const login = await portalService.verifyOtp(identifier.trim(), otp.trim());
      if (login?.token) navigate("/portal", { replace: true });
      else setError("Invalid code. Please try again.");
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid or expired code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen grid lg:grid-cols-2 bg-white"
      style={{ fontFamily: "'Plus Jakarta Sans','Inter',system-ui,sans-serif" }}
    >
      {/* ── Left brand panel (laptop only) ── */}
      <div className="hidden lg:flex relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-700 p-12 flex-col justify-between text-white">
        <div className="relative z-10 flex items-center gap-2.5">
          <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center">
            <Plane size={22} className="text-white -rotate-45" />
          </div>
          <span className="text-xl font-extrabold tracking-tight">TravelerPortal</span>
        </div>

        <div className="relative z-10 max-w-md">
          <h2 className="text-[34px] font-extrabold leading-tight tracking-tight">
            Your journey,<br />all in one place.
          </h2>
          <p className="text-blue-100/90 mt-3 text-[15px]">
            Sign in to manage your bookings, payments and travel documents — securely.
          </p>
          <div className="mt-8 space-y-3">
            {PERKS.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                  <Icon size={17} />
                </span>
                <span className="text-[14px] text-blue-50">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-[12px] text-blue-200/80">
          Access is limited to customers with an active booking.
        </p>

        {/* decorative */}
        <Plane className="absolute -right-10 top-1/3 text-white/5 rotate-12" size={280} />
        <div className="absolute -left-16 -bottom-16 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
      </div>

      {/* ── Right form panel ── */}
      <div className="flex items-center justify-center px-5 py-10 bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 lg:bg-none lg:bg-white">
        <div className="w-full max-w-[420px]">
          {/* Mobile logo */}
          <div className="lg:hidden w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-300/50 mb-5">
            <Plane size={26} className="text-white -rotate-45" />
          </div>

          <h1 className="text-[26px] font-extrabold text-slate-900 tracking-tight text-center lg:text-left">
            {step === "identifier" ? "Welcome back" : "Verify it's you"}
          </h1>
          <p className="text-[13.5px] text-slate-500 mt-1.5 mb-6 text-center lg:text-left">
            {step === "identifier"
              ? "Sign in with your registered phone or email."
              : `We sent a code to ${identifier}.`}
          </p>

          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-[13px] font-medium px-3.5 py-3">
              <AlertCircle size={15} className="shrink-0" /> {error}
            </div>
          )}

          {step === "identifier" ? (
            <form onSubmit={sendOtp}>
              <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Phone or Email</label>
              <div className="relative mb-5">
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  autoFocus
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="you@example.com or 98765…"
                  className="w-full h-12 rounded-xl border border-slate-200 bg-slate-50/60 pl-11 pr-4 text-[14.5px] text-slate-800 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition"
                />
              </div>
              <SubmitBtn loading={loading} label="Send code" />
            </form>
          ) : (
            <form onSubmit={verify}>
              <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">One-time code</label>
              <div className="relative mb-4">
                <ShieldCheck size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  autoFocus
                  inputMode="numeric"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="6-digit code"
                  className="w-full h-12 rounded-xl border border-slate-200 bg-slate-50/60 pl-11 pr-4 text-[16px] tracking-[0.3em] font-semibold text-slate-800 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition"
                />
              </div>
              <SubmitBtn loading={loading} label="Verify & continue" />
              <div className="flex items-center justify-between mt-4 text-[12.5px]">
                <button
                  type="button"
                  onClick={() => {
                    setStep("identifier");
                    setOtp("");
                    setError("");
                  }}
                  className="flex items-center gap-1 text-slate-500 hover:text-slate-700 font-medium"
                >
                  <ArrowLeft size={14} /> Change
                </button>
                <button
                  type="button"
                  disabled={resendIn > 0 || loading}
                  onClick={sendOtp}
                  className="text-blue-600 font-semibold disabled:text-slate-400 disabled:cursor-not-allowed"
                >
                  {resendIn > 0 ? `Resend in ${resendIn}s` : "Resend code"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function SubmitBtn({ loading, label }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-semibold text-[15px] flex items-center justify-center gap-2 shadow-lg shadow-blue-300/40 hover:brightness-105 active:scale-[0.99] disabled:opacity-70 transition"
    >
      {loading ? (
        <Loader2 size={18} className="animate-spin" />
      ) : (
        <>
          <span>{label}</span>
          <ArrowRight size={17} />
        </>
      )}
    </button>
  );
}