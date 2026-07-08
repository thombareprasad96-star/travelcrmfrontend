import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, MapPin, Check, AlertCircle } from 'lucide-react';

// 👉 Same service imports as before — auth logic untouched
import { authService } from "../services/LoginService";
import { loadMyPermissions } from "@shared/lib/access";

const ROLES = [
  { key: 'super_admin', label: 'Super Admin' },
  { key: 'admin', label: 'Admin' },
  { key: 'user', label: 'User' },
];

const CAR_W = 48;                 // road car width (px)
const AUTO_CAR_DEMO = true;       // false => car sirf role switch pe chalegi (no auto patrol)
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* ---------- Big car (road, under role switcher) ---------- */
const RoadCar = () => (
  <svg className="tlc-body" viewBox="0 0 64 30" width="48" height="22.5" aria-hidden="true" style={{ display: 'block' }}>
    <defs>
      <linearGradient id="tlcCarGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#2563EB" />
        <stop offset="1" stopColor="#4F46E5" />
      </linearGradient>
    </defs>
    <path d="M5 21 L5 16 Q5 11 12 11 L21 11 L27 4.5 Q28 3.5 30 3.5 L42 3.5 Q44 3.5 45 5 L50 11 Q59 11 59 17 L59 21 Q59 23 57 23 L7 23 Q5 23 5 21 Z" fill="url(#tlcCarGrad)" />
    <path d="M28 6 L24 11 L34 11 L34 6 Z" fill="#DBEAFE" opacity=".95" />
    <path d="M37 6 L37 11 L46 11 L42.5 6 Z" fill="#DBEAFE" opacity=".95" />
    <line x1="35.5" y1="11" x2="35.5" y2="21" stroke="#1E40AF" opacity=".3" strokeWidth="1" />
    <circle cx="57.5" cy="15.5" r="1.7" fill="#FDE68A" />
    <rect x="5" y="14.5" width="2.2" height="3.4" rx="1" fill="#FCA5A5" />
    <g className="tlc-wheel"><circle cx="16.5" cy="23" r="5.4" fill="#0F172A" /><circle cx="16.5" cy="23" r="2.3" fill="#CBD5E1" /><line x1="16.5" y1="18.4" x2="16.5" y2="23" stroke="#64748B" strokeWidth="1.3" /></g>
    <g className="tlc-wheel"><circle cx="47.5" cy="23" r="5.4" fill="#0F172A" /><circle cx="47.5" cy="23" r="2.3" fill="#CBD5E1" /><line x1="47.5" y1="18.4" x2="47.5" y2="23" stroke="#64748B" strokeWidth="1.3" /></g>
  </svg>
);

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
  const [activeRole, setActiveRole] = useState('admin');
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

  // Road car states
  const [carMoving, setCarMoving] = useState(false);
  const [facingLeft, setFacingLeft] = useState(false);
  const [trackW, setTrackW] = useState(0);
  const [ready, setReady] = useState(false);

  const trackRef = useRef(null);
  const idxRef = useRef(1);
  const dirRef = useRef(1);
  const autoRef = useRef(null);
  const autoStopped = useRef(!AUTO_CAR_DEMO);

  const navigate = useNavigate();

  const roleIndex = ROLES.findIndex(r => r.key === activeRole);
  const currentRole = ROLES[roleIndex];
  const emailValid = EMAIL_RE.test(email);
  const pwValid = password.length >= 6;

  const cell = trackW / 3;
  const carX = trackW ? Math.round(roleIndex * cell + (cell - CAR_W) / 2) : 0;

  useEffect(() => { idxRef.current = roleIndex; }, [roleIndex]);

  // Measure road width (responsive) — layout effect avoids first-paint jump
  useLayoutEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const update = () => setTrackW(el.clientWidth);
    update();
    let ro;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(update);
      ro.observe(el);
    } else {
      window.addEventListener('resize', update);
    }
    return () => {
      if (ro) ro.disconnect();
      else window.removeEventListener('resize', update);
    };
  }, []);

  // Enable car transition only after first position is painted
  useEffect(() => {
    if (trackW > 0 && !ready) {
      requestAnimationFrame(() => requestAnimationFrame(() => setReady(true)));
    }
  }, [trackW, ready]);

  const stopAutoDemo = () => {
    autoStopped.current = true;
    clearInterval(autoRef.current);
  };

  const switchRole = (key) => {
    const newIdx = ROLES.findIndex(r => r.key === key);
    const oldIdx = idxRef.current;
    if (newIdx === oldIdx || loading || success) return;
    setFacingLeft(newIdx < oldIdx);
    setCarMoving(true);
    setActiveRole(key);
    // Same behaviour as before: role change clears the form
    setEmail('');
    setPassword('');
    setErrorMessage('');
    setEmailInvalid(false);
    setPwInvalid(false);
  };

  // Auto patrol: Super Admin ↔ User (stops on first user interaction)
  useEffect(() => {
    if (!AUTO_CAR_DEMO || !ready || autoStopped.current) return;
    const start = setTimeout(() => {
      autoRef.current = setInterval(() => {
        let n = idxRef.current + dirRef.current;
        if (n > 2 || n < 0) {
          dirRef.current *= -1;
          n = idxRef.current + dirRef.current;
        }
        switchRole(ROLES[n].key);
      }, 1600);
    }, 1200);
    return () => { clearTimeout(start); clearInterval(autoRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    stopAutoDemo();

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
        const roleToSave = responseData?.role || activeRole;
        localStorage.setItem('userRole', roleToSave);
        localStorage.setItem('userEmail', email);

        // Effective permissions (unchanged)
        await loadMyPermissions();

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
      className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center px-4 py-10 selection:bg-indigo-500 selection:text-white"
      style={{
        background: 'linear-gradient(135deg,#FFFFFF 0%,#F8FAFC 50%,#F1F5F9 100%)',
        fontFamily: "'Plus Jakarta Sans','Inter',system-ui,sans-serif",
      }}
    >
      <style>{styles}</style>

      {/* Glass card */}
      <div
        className="tlc-card relative z-[1] w-full max-w-[460px] p-6 sm:p-10 sm:pb-8"
        onMouseDown={stopAutoDemo}
        onTouchStart={stopAutoDemo}
        onFocusCapture={stopAutoDemo}
      >
        {/* Logo — car orbiting a destination pin */}
        <div className="tlc-logo mx-auto mb-4">
          <div className="tlc-ring" />
          <MapPin size={19} className="tlc-pin" aria-hidden="true" />
          <div className="tlc-orbit"><MiniCar /></div>
        </div>

        <h2 className="tlc-rise text-center text-[22px] sm:text-[25px] font-bold text-slate-900 tracking-tight" style={{ animationDelay: '.12s' }}>
          Nepal Tours &amp; Travels
        </h2>
        <p className="tlc-rise text-center text-[13.5px] text-slate-500 mt-1.5 mb-5" style={{ animationDelay: '.2s' }}>
          Sign in to manage your CRM account
        </p>

        {/* Segmented role control with sliding thumb */}
        <div className="tlc-seg tlc-rise" style={{ animationDelay: '.28s' }}>
          <div className="tlc-thumb" style={{ transform: `translateX(${roleIndex * 100}%)` }} />
          {ROLES.map((r) => (
            <button
              key={r.key}
              type="button"
              onClick={() => { stopAutoDemo(); switchRole(r.key); }}
              className={`tlc-segbtn text-[11.5px] sm:text-[13px] ${activeRole === r.key ? 'active' : ''}`}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* Road + car that drives to the selected role */}
        <div ref={trackRef} className="tlc-rise relative h-9 mt-1 mb-4 mx-0.5" style={{ animationDelay: '.32s' }}>
          <div className="tlc-road"><div className="tlc-dash" /></div>
          <div
            className={`tlc-car ${carMoving ? 'moving' : ''}`}
            style={{ transform: `translateX(${carX}px)`, transition: ready ? undefined : 'none' }}
            onTransitionEnd={(e) => { if (e.propertyName === 'transform') setCarMoving(false); }}
          >
            <span className={`tlc-flip ${facingLeft ? 'left' : ''}`}>
              <span className="tlc-zoom" aria-hidden="true"><span /><span /></span>
              <RoadCar />
            </span>
          </div>
        </div>

        {/* Backend error banner */}
        {errorMessage && (
          <div
            className={`mb-4 px-3.5 py-3 rounded-xl bg-red-50/90 border border-red-200 text-red-600 text-[13px] font-medium flex items-center justify-center gap-2 text-center ${bannerShake ? 'tlc-shakeb' : ''}`}
            onAnimationEnd={() => setBannerShake(false)}
            role="alert"
          >
            <AlertCircle size={15} className="shrink-0" />
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
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
                onChange={(e) => {
                  const v = e.target.value;
                  setEmail(v);
                  setEmailInvalid(v.length > 0 && !EMAIL_RE.test(v));
                }}
                className="tlc-input"
              />
              <label htmlFor="login-email">{currentRole.label} email</label>
              <Check size={19} className="tlc-vcheck" aria-hidden="true" />
            </div>
            <div className="tlc-err"><AlertCircle size={13} /> Enter a valid email address</div>
          </div>

          {/* Password — floating label + visibility toggle */}
          <div
            className={`tlc-field tlc-rise mb-4 ${pwValid ? 'valid' : ''} ${pwInvalid ? 'invalid' : ''} ${pwShake ? 'shake' : ''}`}
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

          {/* Remember + forgot */}
          {/* <div className="tlc-rise flex items-center justify-between mt-0.5 mb-5" style={{ animationDelay: '.54s' }}>
            <label className="tlc-check" htmlFor="remember-me">
              <input id="remember-me" type="checkbox" />
              <span className="tlc-box"><Check size={13} /></span>
              <span className="text-[13px] text-slate-600 select-none">Remember this device</span>
            </label>
            <button type="button" className="tlc-link">Forgot password?</button>
          </div> */}

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
              `Log In as ${currentRole.label}`
            )}
          </button>
        </form>
      </div>

    </div>
  );
};

/* ------------------------- Component styles ------------------------- */
const styles = `
.tlc-card{border-radius:24px;background:#FFFFFF;border:1px solid #E2E8F0;box-shadow:0 24px 60px -14px rgba(15,23,42,.12),0 8px 24px -10px rgba(15,23,42,.08);animation:tlcCardIn .7s cubic-bezier(.16,1,.3,1) both}
@keyframes tlcCardIn{from{opacity:0;transform:translateY(26px) scale(.95)}to{opacity:1;transform:translateY(0) scale(1)}}
.tlc-rise{animation:tlcRise .6s ease-out both}
@keyframes tlcRise{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}

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

.tlc-seg{position:relative;display:grid;grid-template-columns:repeat(3,1fr);background:#F1F5F9;border-radius:14px;padding:5px}
.tlc-thumb{position:absolute;top:5px;left:5px;height:calc(100% - 10px);width:calc((100% - 10px)/3);background:#fff;border-radius:10px;box-shadow:0 2px 8px rgba(15,23,42,.09);transition:transform .7s cubic-bezier(.45,.05,.35,1)}
.tlc-segbtn{position:relative;z-index:1;border:none;background:transparent;height:38px;font-weight:500;color:#64748B;cursor:pointer;transition:color .3s;font-family:inherit;border-radius:10px}
.tlc-segbtn.active{color:#2563EB;font-weight:600}
.tlc-segbtn:focus-visible{outline:2px solid #2563EB;outline-offset:-2px}

.tlc-road{position:absolute;left:0;right:0;bottom:0;height:8px;border-radius:6px;background:#E2E8F0;overflow:hidden}
.tlc-dash{position:absolute;left:0;right:0;top:3px;height:2px;background:repeating-linear-gradient(90deg,#fff 0 8px,transparent 8px 18px);opacity:.9}
.tlc-car{position:absolute;bottom:6px;left:0;width:48px;transition:transform .7s cubic-bezier(.45,.05,.35,1);will-change:transform}
.tlc-flip{display:block;transition:transform .22s}
.tlc-flip.left{transform:scaleX(-1)}
.tlc-wheel{transform-box:fill-box;transform-origin:center}
.tlc-car.moving .tlc-wheel{animation:tlcWheel .4s linear infinite}
@keyframes tlcWheel{to{transform:rotate(360deg)}}
.tlc-car.moving .tlc-body{animation:tlcBob .26s ease-in-out infinite alternate}
@keyframes tlcBob{from{transform:translateY(0)}to{transform:translateY(-1px)}}
.tlc-zoom{position:absolute;left:-15px;top:9px;width:12px;opacity:0}
.tlc-zoom span{display:block;height:2px;border-radius:2px;background:#94A3B8;margin:3px 0}
.tlc-zoom span:first-child{width:12px}
.tlc-zoom span:last-child{width:8px;margin-left:4px}
.tlc-car.moving .tlc-zoom{animation:tlcZoomF .3s linear infinite}
@keyframes tlcZoomF{0%{opacity:0;transform:translateX(2px)}40%{opacity:.8}100%{opacity:0;transform:translateX(-6px)}}

.tlc-control{position:relative;height:52px}
.tlc-ico{position:absolute;left:16px;top:50%;transform:translateY(-50%);color:#94A3B8;pointer-events:none;transition:color .25s}
.tlc-input{width:100%;height:52px;border-radius:14px;border:1.6px solid #E2E8F0;background:rgba(255,255,255,.55);padding:0 46px;font-size:14.5px;color:#0F172A;outline:none;transition:border-color .25s,box-shadow .25s,background .25s;font-family:inherit}
.tlc-input:focus{border-color:#2563EB;box-shadow:0 0 0 4px rgba(37,99,235,.12);background:#fff}
.tlc-field label{position:absolute;left:44px;top:50%;transform:translateY(-50%);color:#94A3B8;font-size:14.5px;pointer-events:none;padding:0 5px;transition:all .2s ease;white-space:nowrap}
.tlc-input:focus + label,.tlc-input:not(:placeholder-shown) + label{top:0;left:40px;transform:translateY(-50%) scale(.8);color:#2563EB;background:#fff;border-radius:4px}
.tlc-field.valid .tlc-input{border-color:#22C55E;background:#fff}
.tlc-field.valid .tlc-ico{color:#22C55E}
.tlc-vcheck{position:absolute;right:16px;top:50%;transform:translateY(-50%) scale(0);color:#22C55E;transition:transform .3s cubic-bezier(.68,-.55,.27,1.55)}
.tlc-field.valid .tlc-vcheck{transform:translateY(-50%) scale(1)}
.tlc-field.invalid .tlc-input{border-color:#EF4444;box-shadow:0 0 0 4px rgba(239,68,68,.12);background:#fff}
.tlc-field.invalid .tlc-ico{color:#EF4444}
.tlc-field.invalid .tlc-vcheck{transform:translateY(-50%) scale(0)}
.tlc-err{color:#EF4444;font-size:12px;margin:6px 4px 0;display:flex;align-items:center;gap:5px;opacity:0;max-height:0;overflow:hidden;transition:opacity .2s}
.tlc-field.invalid .tlc-err{opacity:1;max-height:24px}
.tlc-field.shake .tlc-control{animation:tlcShake .45s}
.tlc-shakeb{animation:tlcShake .45s}
@keyframes tlcShake{0%,100%{transform:translateX(0)}18%,58%{transform:translateX(-6px)}38%,78%{transform:translateX(6px)}}
.tlc-toggle{position:absolute;right:10px;top:50%;transform:translateY(-50%);border:none;background:transparent;color:#94A3B8;cursor:pointer;padding:8px;border-radius:9px;display:flex;transition:color .2s,background .2s;font-family:inherit}
.tlc-toggle:hover{color:#475569;background:rgba(15,23,42,.05)}

.tlc-check{display:inline-flex;align-items:center;gap:9px;cursor:pointer}
.tlc-check input{position:absolute;opacity:0;width:0;height:0}
.tlc-box{width:20px;height:20px;border-radius:6px;border:1.6px solid #CBD5E1;display:flex;align-items:center;justify-content:center;background:#fff;transition:all .25s;color:#fff;flex-shrink:0}
.tlc-box svg{transform:scale(0);transition:transform .25s cubic-bezier(.68,-.55,.27,1.55)}
.tlc-check input:checked + .tlc-box{background:linear-gradient(135deg,#2563EB,#4F46E5);border-color:#4F46E5}
.tlc-check input:checked + .tlc-box svg{transform:scale(1)}
.tlc-check input:focus-visible + .tlc-box{box-shadow:0 0 0 3px rgba(37,99,235,.25)}

.tlc-link{color:#2563EB;font-size:13px;font-weight:500;border:none;padding:0 0 1px;cursor:pointer;background-color:transparent;background-image:linear-gradient(#2563EB,#2563EB);background-size:0 1.5px;background-repeat:no-repeat;background-position:left bottom;transition:background-size .3s;font-family:inherit}
.tlc-link:hover{background-size:100% 1.5px}

.tlc-btn{height:52px;border:none;border-radius:14px;background:linear-gradient(135deg,#2563EB,#4F46E5);color:#fff;font-size:15px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:9px;box-shadow:0 10px 22px -6px rgba(37,99,235,.5);transition:transform .2s,box-shadow .2s,filter .2s,background .3s;font-family:inherit}
.tlc-btn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 16px 30px -6px rgba(37,99,235,.55);filter:brightness(1.06)}
.tlc-btn:active:not(:disabled){transform:translateY(0) scale(.98)}
.tlc-btn:focus-visible{outline:2px solid #1D4ED8;outline-offset:3px}
.tlc-btn:disabled{cursor:not-allowed}
.tlc-btn.success{background:linear-gradient(135deg,#16A34A,#15803D);box-shadow:0 10px 22px -6px rgba(22,163,74,.5)}
.tlc-pop{animation:tlcPop .45s cubic-bezier(.68,-.55,.27,1.55)}
@keyframes tlcPop{0%{transform:scale(0)}60%{transform:scale(1.3)}100%{transform:scale(1)}}

@media (prefers-reduced-motion:reduce){
  .tlc-logo,.tlc-logo::after,.tlc-orbit,.tlc-minicar .tlc-wheel,.tlc-card,.tlc-rise{animation:none!important}
  .tlc-car,.tlc-thumb,.tlc-flip{transition-duration:.01ms!important}
}
`;

export default Login;