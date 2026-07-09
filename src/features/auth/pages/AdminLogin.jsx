import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Eye, EyeOff, Lock, Mail, MapPin, Check, AlertCircle,
  Users, FileText, MessageCircle, Sparkles, ShieldCheck, ArrowRight,
  Megaphone, Globe, ServerCog,
} from 'lucide-react';

// 👉 Same service imports as before — auth logic untouched
import { authService } from "../api/LoginService";
import { loadMyPermissions, loadMyEntitlements } from "@shared/lib/access";

// No role switcher. It never chose the endpoint — LoginService always tries superadmin
// first and falls back to the user login — and the backend returns the real role, which is
// what gets persisted. The old tabs only set a label and a dead fallback string.
// Platform operators sign in at /superadmin/login.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* Product proof — why an agency runs TravelCRM. */
const FEATURES = [
  {
    Icon: Users,
    title: 'Leads & pipeline',
    copy: 'Capture every enquiry, assign it to an agent, and never lose a follow-up.',
  },
  {
    Icon: FileText,
    title: 'Quotations → branded PDF',
    copy: 'Build a multi-day itinerary and send a polished, branded quote in minutes.',
  },
  {
    Icon: MessageCircle,
    title: 'WhatsApp follow-ups',
    copy: 'Reach travellers on the channel where they actually reply.',
  },
  {
    Icon: Sparkles,
    title: 'Disha AI',
    copy: 'Drafts itineraries and replies, so your team spends its day selling.',
  },
];

/* Agency services — the studio behind the product. */
const SERVICES = [
  { Icon: Megaphone, label: 'Digital Marketing' },
  { Icon: Globe, label: 'Website Development' },
  { Icon: ServerCog, label: 'IT Services' },
];

/* ---------- Mini white car (orbits inside the logo) ---------- */
const MiniCar = () => (
  <svg className="tlc-minicar" viewBox="0 0 40 20" width="21" height="10.5" aria-hidden="true">
    <path d="M3 13 L3 10 Q3 7 8 7 L13 7 L16.5 3 Q17 2.5 18.5 2.5 L26 2.5 Q27.5 2.5 28 3.5 L31 7 Q37 7 37 11 L37 13 Q37 14.5 35.5 14.5 L4.5 14.5 Q3 14.5 3 13 Z" fill="#fff" />
    <path d="M18 4 L15.5 7 L21.5 7 L21.5 4 Z" fill="#93C5FD" />
    <path d="M23.5 4 L23.5 7 L29 7 L26.8 4 Z" fill="#93C5FD" />
    <circle cx="36" cy="10" r="1" fill="#FDE68A" />
    <g className="tlc-wheel"><circle cx="10.5" cy="14.5" r="3.4" fill="#0F172A" /><circle cx="10.5" cy="14.5" r="1.3" fill="#E2E8F0" /><line x1="10.5" y1="11.6" x2="10.5" y2="14.5" stroke="#94A3B8" strokeWidth="1" /></g>
    <g className="tlc-wheel"><circle cx="29.5" cy="14.5" r="3.4" fill="#0F172A" /><circle cx="29.5" cy="14.5" r="1.3" fill="#E2E8F0" /><line x1="29.5" y1="11.6" x2="29.5" y2="14.5" stroke="#94A3B8" strokeWidth="1" /></g>
  </svg>
);

const Login = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Validation UI states
  const [emailInvalid, setEmailInvalid] = useState(false);
  const [pwInvalid, setPwInvalid] = useState(false);
  const [emailShake, setEmailShake] = useState(false);
  const [pwShake, setPwShake] = useState(false);
  const [bannerShake, setBannerShake] = useState(false);

  const navigate = useNavigate();

  const emailValid = EMAIL_RE.test(email);
  const pwValid = password.length >= 6;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation with shake feedback
    let bad = false;
    if (!emailValid) {
      setEmailInvalid(true);
      setEmailShake(true);
      bad = true;
    }
    if (!password.trim()) {
      setPwInvalid(true);
      setPwShake(true);
      bad = true;
    }
    if (bad) return;

    setLoading(true);
    setErrorMessage('');

    try {
      // 1. API call (unchanged)
      const response = await authService.login(email, password);

      // 2. Extract token (unchanged)
      const responseData = response.data;
      const token = responseData?.token || responseData?.jwt || responseData;

      if (token && typeof token === 'string') {
        // 3. Persist session (unchanged)
        localStorage.setItem('token', token);
        // LoginService always stamps a role (real tenant role, or "super_admin"), so this
        // fallback is defensive only — default to the least-privileged value.
        const roleToSave = responseData?.role || 'user';
        localStorage.setItem('userRole', roleToSave);
        localStorage.setItem('userEmail', email);

        // Effective permissions + plan module entitlements (both cached for the UI to gate/hide).
        await Promise.all([loadMyPermissions(), loadMyEntitlements()]);

        // 4. Success beat (animated checkmark), then redirect
        setLoading(false);
        setSuccess(true);
        setTimeout(() => {
          setIsAuthenticated(true);
          navigate('/');
        }, 900);
        return;
      } else {
        setErrorMessage("Login failed. No security token received from the server.");
        setBannerShake(true);
      }
    } catch (error) {
      console.error("Login Error:", error);
      if (error.response) {
        if (error.response.status === 401 || error.response.status === 403) {
          setErrorMessage("Invalid email or password! Please check your credentials.");
        } else {
          setErrorMessage(error.response.data?.message || "Server Error. Please try again later.");
        }
      } else if (error.request) {
        setErrorMessage("Cannot connect to the server. Ensure the backend is running.");
      } else {
        setErrorMessage("Something went wrong during login.");
      }
      setBannerShake(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full bg-white lg:grid lg:grid-cols-2 selection:bg-blue-600 selection:text-white"
      style={{ fontFamily: "'Plus Jakarta Sans','Inter',system-ui,sans-serif" }}
    >
      <style>{styles}</style>

      {/* ── Sign-in half ─────────────────────────────────────────────── */}
      <div className="flex min-h-screen items-center justify-center px-5 py-12 sm:px-10">
        <div className="w-full max-w-[400px]">
          {/* Logo — car orbiting a destination pin */}
          <div className="tlc-logo mx-auto mb-5">
            <div className="tlc-ring" />
            <MapPin size={19} className="tlc-pin" aria-hidden="true" />
            <div className="tlc-orbit"><MiniCar /></div>
          </div>

          <h1 className="tlc-rise text-center text-[24px] sm:text-[27px] font-extrabold text-slate-900 tracking-tight" style={{ animationDelay: '.12s' }}>
            Nepal Tours &amp; Travels
          </h1>
          <p className="tlc-rise text-center text-[13.5px] text-slate-500 mt-1.5 mb-2" style={{ animationDelay: '.2s' }}>
            Sign in to manage your CRM account
          </p>

          {/* Backend error banner */}
          {errorMessage && (
            <div
              className={`mt-5 px-3.5 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-[13px] font-medium flex items-center justify-center gap-2 text-center ${bannerShake ? 'tlc-shakeb' : ''}`}
              onAnimationEnd={() => setBannerShake(false)}
              role="alert"
              aria-live="assertive"
            >
              <AlertCircle size={15} className="shrink-0" />
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="mt-5">
            {/* Email — floating label + live validation */}
            <div
              className={`tlc-field tlc-rise mb-4 ${emailValid ? 'valid' : ''} ${emailInvalid ? 'invalid' : ''} ${emailShake ? 'shake' : ''}`}
              style={{ animationDelay: '.38s' }}
              onAnimationEnd={() => setEmailShake(false)}
            >
              <div className="tlc-control">
                <Mail size={19} className="tlc-ico" />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  autoComplete="email"
                  spellCheck="false"
                  placeholder=" "
                  aria-invalid={emailInvalid}
                  onChange={(e) => {
                    const v = e.target.value;
                    setEmail(v);
                    setEmailInvalid(v.length > 0 && !EMAIL_RE.test(v));
                  }}
                  className="tlc-input"
                />
                <label htmlFor="login-email">Email address</label>
                <Check size={19} className="tlc-vcheck" aria-hidden="true" />
              </div>
              <div className="tlc-err"><AlertCircle size={13} /> Enter a valid email address</div>
            </div>

            {/* Password — floating label + visibility toggle */}
            <div
              className={`tlc-field tlc-rise mb-5 ${pwValid ? 'valid' : ''} ${pwInvalid ? 'invalid' : ''} ${pwShake ? 'shake' : ''}`}
              style={{ animationDelay: '.46s' }}
              onAnimationEnd={() => setPwShake(false)}
            >
              <div className="tlc-control">
                <Lock size={19} className="tlc-ico" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  autoComplete="current-password"
                  placeholder=" "
                  aria-invalid={pwInvalid}
                  onChange={(e) => { setPassword(e.target.value); setPwInvalid(false); }}
                  className="tlc-input pr-12"
                />
                <label htmlFor="login-password">Password</label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="tlc-toggle"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
              <div className="tlc-err"><AlertCircle size={13} /> Password is required</div>
            </div>

            {/* Submit — gradient, loading spinner, success checkmark */}
            <button
              type="submit"
              disabled={loading || success}
              className={`tlc-btn tlc-rise w-full ${success ? 'success' : ''}`}
              style={{ animationDelay: '.62s' }}
            >
              {loading ? (
                <>
                  <span className="w-5 h-5 border-[2.5px] border-white/40 border-t-white rounded-full animate-spin" />
                  Signing in…
                </>
              ) : success ? (
                <>
                  <Check size={20} className="tlc-pop" />
                  Success
                </>
              ) : (
                'Log In'
              )}
            </button>
          </form>

          {/* Quiet bridge to the platform realm — deliberately understated. */}
          <p className="tlc-rise mt-8 text-center text-[12.5px] text-slate-400" style={{ animationDelay: '.7s' }}>
            <ShieldCheck size={13} className="inline-block -mt-0.5 mr-1" aria-hidden="true" />
            Platform operator?{' '}
            <Link
              to="/superadmin/login"
              className="font-semibold text-slate-500 underline-offset-2 hover:text-blue-600 hover:underline rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Sign in to the console
            </Link>
          </p>
        </div>
      </div>

      {/* ── Showcase half — full-bleed, product proof + agency services ── */}
      <aside className="relative hidden overflow-hidden bg-slate-950 px-12 py-14 lg:flex lg:flex-col lg:justify-center xl:px-16">
        <div className="tlc-glow" aria-hidden="true" />
        <div className="tlc-dots" aria-hidden="true" />

        <div className="relative z-10 mx-auto w-full max-w-[460px]">
          <p className="tlc-in text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-300/80" style={{ animationDelay: '.15s' }}>
            Why agencies run TravelCRM
          </p>
          <h2 className="tlc-in mt-3 text-[28px] font-extrabold leading-[1.22] tracking-tight text-white xl:text-[31px]" style={{ animationDelay: '.24s' }}>
            Everything between a lead and a boarding pass.
          </h2>

          <ul className="mt-9 space-y-5">
            {FEATURES.map(({ Icon, title, copy }, i) => (
              <li key={title} className="tlc-feat tlc-in flex gap-4" style={{ animationDelay: `${0.36 + i * 0.09}s` }}>
                <span className="tlc-chip flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-400/10 ring-1 ring-amber-400/25">
                  <Icon size={16} className="text-amber-400" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <h3 className="text-[14.5px] font-semibold text-white">{title}</h3>
                  <p className="mt-0.5 text-[13px] leading-relaxed text-slate-400">{copy}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="tlc-in mt-9 flex items-center gap-3" style={{ animationDelay: '.78s' }}>
            <span className="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-slate-500">
              Also from Veto Tech
            </span>
            <span className="tlc-rule h-px flex-1 bg-slate-800" aria-hidden="true" />
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3">
            {SERVICES.map(({ Icon, label }, i) => (
              <div
                key={label}
                className="tlc-svc tlc-in rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 text-center"
                style={{ animationDelay: `${0.86 + i * 0.08}s` }}
              >
                <Icon size={17} className="tlc-svc-ico mx-auto text-amber-400" aria-hidden="true" />
                <p className="mt-2 text-[11.5px] font-medium leading-tight text-slate-300">{label}</p>
              </div>
            ))}
          </div>

          <p className="tlc-in mt-8 flex items-center gap-2 text-[12.5px] text-slate-400" style={{ animationDelay: '1.12s' }}>
            <ArrowRight size={14} className="tlc-nudge shrink-0 text-amber-400" aria-hidden="true" />
            Need a website, campaign or custom build?{' '}
            <a
              href="mailto:vetotechit@gmail.com"
              className="font-semibold text-slate-200 underline-offset-2 hover:text-amber-400 hover:underline rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
            >
              Talk to us
            </a>
          </p>
        </div>
      </aside>
    </div>
  );
};

/* ------------------------- Component styles ------------------------- */
const styles = `
.tlc-rise{animation:tlcRise .6s ease-out both}
@keyframes tlcRise{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}

/* Showcase entrance — each element drifts up and in, staggered by inline animationDelay. */
.tlc-in{animation:tlcIn .65s cubic-bezier(.16,1,.3,1) both}
@keyframes tlcIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}

/* Showcase atmosphere — a blue/indigo bloom over a slowly drifting dot grid. */
.tlc-glow{position:absolute;inset:0;background:radial-gradient(680px circle at 22% 14%,rgba(37,99,235,.30),transparent 62%),radial-gradient(560px circle at 88% 88%,rgba(79,70,229,.24),transparent 60%);animation:tlcBloom 11s ease-in-out infinite alternate}
@keyframes tlcBloom{from{opacity:.75;transform:scale(1)}to{opacity:1;transform:scale(1.06)}}
.tlc-dots{position:absolute;inset:0;background-image:radial-gradient(rgba(148,163,184,.13) 1px,transparent 1px);background-size:22px 22px;-webkit-mask-image:linear-gradient(180deg,#000 0%,transparent 88%);mask-image:linear-gradient(180deg,#000 0%,transparent 88%);animation:tlcDrift 26s linear infinite}
@keyframes tlcDrift{to{background-position:22px 22px}}

/* Feature rows — the amber chip lifts and warms as the row is hovered. */
.tlc-chip{transition:transform .3s cubic-bezier(.34,1.56,.64,1),background .3s,box-shadow .3s}
.tlc-feat:hover .tlc-chip{transform:translateY(-2px) scale(1.06);background:rgba(251,191,36,.16);box-shadow:0 8px 18px -8px rgba(251,191,36,.5)}

/* The rule beside "Also from Veto Tech" draws itself in. */
.tlc-rule{transform-origin:left;animation:tlcRule .7s cubic-bezier(.16,1,.3,1) 1s both}
@keyframes tlcRule{from{transform:scaleX(0)}to{transform:scaleX(1)}}

/* Service cards — lift on hover, icon pops. */
.tlc-svc{transition:transform .25s ease,border-color .25s,background .25s,box-shadow .25s}
.tlc-svc:hover{transform:translateY(-3px);border-color:#334155;background:#0F172A;box-shadow:0 14px 28px -14px rgba(0,0,0,.9)}
.tlc-svc-ico{transition:transform .3s cubic-bezier(.34,1.56,.64,1)}
.tlc-svc:hover .tlc-svc-ico{transform:scale(1.18)}

/* The contact arrow nudges forever — a small invitation to click. */
.tlc-nudge{animation:tlcNudge 1.9s ease-in-out infinite}
@keyframes tlcNudge{0%,100%{transform:translateX(0)}50%{transform:translateX(3px)}}

.tlc-logo{width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,#2563EB,#4F46E5);position:relative;box-shadow:0 12px 26px -6px rgba(37,99,235,.55);animation:tlcFloat 4.5s ease-in-out infinite}
.tlc-logo::after{content:'';position:absolute;inset:-8px;border-radius:50%;background:linear-gradient(135deg,#2563EB,#4F46E5);filter:blur(15px);opacity:.35;z-index:-1;animation:tlcGlowP 3.2s ease-in-out infinite}
@keyframes tlcGlowP{0%,100%{opacity:.28;transform:scale(1)}50%{opacity:.5;transform:scale(1.1)}}
@keyframes tlcFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
.tlc-ring{position:absolute;inset:12px;border:2px dashed rgba(255,255,255,.42);border-radius:50%}
.tlc-pin{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:#fff}
.tlc-orbit{position:absolute;inset:0;animation:tlcOrbit 3.4s linear infinite}
@keyframes tlcOrbit{to{transform:rotate(360deg)}}
.tlc-minicar{position:absolute;top:3px;left:50%;transform:translateX(-50%);display:block}
.tlc-minicar .tlc-wheel{animation:tlcWheel .35s linear infinite}
.tlc-wheel{transform-box:fill-box;transform-origin:center}
@keyframes tlcWheel{to{transform:rotate(360deg)}}

.tlc-control{position:relative;height:52px}
.tlc-ico{position:absolute;left:16px;top:50%;transform:translateY(-50%);color:#94A3B8;pointer-events:none;transition:color .25s}
.tlc-input{width:100%;height:52px;border-radius:14px;border:1.6px solid #E2E8F0;background:#FFFFFF;padding:0 46px;font-size:14.5px;color:#0F172A;outline:none;transition:border-color .25s,box-shadow .25s;font-family:inherit}
.tlc-input:focus{border-color:#2563EB;box-shadow:0 0 0 4px rgba(37,99,235,.12)}
.tlc-field label{position:absolute;left:44px;top:50%;transform:translateY(-50%);color:#94A3B8;font-size:14.5px;pointer-events:none;padding:0 5px;transition:all .2s ease;white-space:nowrap}
.tlc-input:focus + label,.tlc-input:not(:placeholder-shown) + label{top:0;left:40px;transform:translateY(-50%) scale(.8);color:#2563EB;background:#fff;border-radius:4px}
.tlc-field.valid .tlc-input{border-color:#22C55E}
.tlc-field.valid .tlc-ico{color:#22C55E}
.tlc-vcheck{position:absolute;right:16px;top:50%;transform:translateY(-50%) scale(0);color:#22C55E;transition:transform .3s cubic-bezier(.68,-.55,.27,1.55)}
.tlc-field.valid .tlc-vcheck{transform:translateY(-50%) scale(1)}
.tlc-field.invalid .tlc-input{border-color:#EF4444;box-shadow:0 0 0 4px rgba(239,68,68,.12)}
.tlc-field.invalid .tlc-ico{color:#EF4444}
.tlc-field.invalid .tlc-vcheck{transform:translateY(-50%) scale(0)}
.tlc-err{color:#EF4444;font-size:12px;margin:6px 4px 0;display:flex;align-items:center;gap:5px;opacity:0;max-height:0;overflow:hidden;transition:opacity .2s}
.tlc-field.invalid .tlc-err{opacity:1;max-height:24px}
.tlc-field.shake .tlc-control{animation:tlcShake .45s}
.tlc-shakeb{animation:tlcShake .45s}
@keyframes tlcShake{0%,100%{transform:translateX(0)}18%,58%{transform:translateX(-6px)}38%,78%{transform:translateX(6px)}}
.tlc-toggle{position:absolute;right:10px;top:50%;transform:translateY(-50%);border:none;background:transparent;color:#94A3B8;cursor:pointer;padding:8px;border-radius:9px;display:flex;transition:color .2s,background .2s;font-family:inherit}
.tlc-toggle:hover{color:#475569;background:rgba(15,23,42,.05)}
.tlc-toggle:focus-visible{outline:2px solid #2563EB;outline-offset:1px}

.tlc-btn{position:relative;overflow:hidden;height:52px;border:none;border-radius:14px;background:linear-gradient(135deg,#2563EB,#4F46E5);color:#fff;font-size:15px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:9px;box-shadow:0 10px 22px -6px rgba(37,99,235,.5);transition:transform .2s,box-shadow .2s,filter .2s,background .3s;font-family:inherit}
/* Light sweeps across the button on hover. */
.tlc-btn::after{content:'';position:absolute;top:0;bottom:0;left:-60%;width:45%;background:linear-gradient(100deg,transparent,rgba(255,255,255,.28),transparent);transform:skewX(-20deg);opacity:0}
.tlc-btn:hover:not(:disabled)::after{animation:tlcSheen .85s ease-out}
@keyframes tlcSheen{0%{left:-60%;opacity:1}100%{left:120%;opacity:0}}
.tlc-btn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 16px 30px -6px rgba(37,99,235,.55);filter:brightness(1.06)}
.tlc-btn:active:not(:disabled){transform:translateY(0) scale(.98)}
.tlc-btn:focus-visible{outline:2px solid #1D4ED8;outline-offset:3px}
.tlc-btn:disabled{cursor:not-allowed}
.tlc-btn.success{background:linear-gradient(135deg,#16A34A,#15803D);box-shadow:0 10px 22px -6px rgba(22,163,74,.5)}
.tlc-pop{animation:tlcPop .45s cubic-bezier(.68,-.55,.27,1.55)}
@keyframes tlcPop{0%{transform:scale(0)}60%{transform:scale(1.3)}100%{transform:scale(1)}}

@media (prefers-reduced-motion:reduce){
  .tlc-logo,.tlc-logo::after,.tlc-orbit,.tlc-minicar .tlc-wheel,.tlc-rise,.tlc-pop,
  .tlc-in,.tlc-glow,.tlc-dots,.tlc-nudge,.tlc-btn:hover:not(:disabled)::after{animation:none!important}
  /* Entrance animations fill "both" — with the keyframes off they must not stay hidden. */
  .tlc-in,.tlc-rise{opacity:1!important;transform:none!important}
  .tlc-rule{animation:none!important;transform:scaleX(1)!important}
  .tlc-btn,.tlc-chip,.tlc-svc,.tlc-svc-ico{transition-duration:.01ms!important}
  .tlc-btn:hover:not(:disabled),.tlc-svc:hover{transform:none!important}
}
`;

export default Login;