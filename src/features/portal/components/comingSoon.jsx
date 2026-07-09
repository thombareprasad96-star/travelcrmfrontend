// src/features/portal/components/comingSoon.jsx
// Building blocks for the "Coming Soon + Notify me" experience:
//  - usePortalFeatureInterest(): session-cached set of already-registered keys
//  - ComingSoonBadge, NotifyMeButton (optimistic), ComingSoonCard
import { useEffect, useState } from "react";
import { Sparkles, Bell, Check, Lock } from "lucide-react";
import portalService from "../api/portalService";

// Module-level cache so "You're on the list ✓" persists across pages/reloads in a session.
let interestCache = null;

export function usePortalFeatureInterest() {
  const [registered, setRegistered] = useState(() => new Set(interestCache || []));
  const [loaded, setLoaded] = useState(interestCache != null);

  useEffect(() => {
    if (interestCache != null) return;
    portalService
      .featureInterest()
      .then((keys) => {
        interestCache = new Set(keys);
        setRegistered(new Set(keys));
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  const markRegistered = (key) => {
    interestCache = new Set(interestCache || []);
    interestCache.add(key);
    setRegistered((prev) => new Set(prev).add(key));
  };

  return { registered, loaded, markRegistered };
}

export function ComingSoonBadge({ className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-500 shadow-sm ${className}`}
    >
      <Sparkles size={11} strokeWidth={2} /> Coming soon
    </span>
  );
}

export function NotifyMeButton({ featureKey, registered, onRegistered, className = "" }) {
  const [done, setDone] = useState(!!registered);
  useEffect(() => {
    if (registered) setDone(true);
  }, [registered]);

  const click = async (e) => {
    e?.stopPropagation();
    e?.preventDefault();
    if (done) return;
    setDone(true); // optimistic morph
    onRegistered?.(featureKey);
    try {
      await portalService.notifyFeature(featureKey);
    } catch {
      setDone(false); // revert on failure
    }
  };

  if (done) {
    return (
      <span
        className={`inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-xl font-semibold text-[13px] bg-emerald-50 text-emerald-700 ${className}`}
      >
        <Check size={16} strokeWidth={2.4} /> You&apos;re on the list
      </span>
    );
  }
  return (
    <button
      onClick={click}
      className={`inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-xl font-semibold text-[13px] text-blue-700 bg-blue-50 hover:bg-blue-100 active:scale-[0.98] transition ${className}`}
    >
      <Bell size={15} strokeWidth={1.8} /> Notify me
    </button>
  );
}

export function ComingSoonCard({ feature, registered, onRegistered, featured = false }) {
  const Icon = feature.icon;
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border shadow-sm p-5 ${
        featured
          ? "bg-gradient-to-br from-white to-blue-50/50 border-blue-100"
          : "bg-white/85 backdrop-blur border-slate-200"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-300/40 relative">
          <Icon size={22} strokeWidth={1.5} />
          <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white flex items-center justify-center shadow">
            <Lock size={11} className="text-slate-400" strokeWidth={2} />
          </span>
        </span>
        <ComingSoonBadge />
      </div>
      <h3 className="text-[15.5px] font-bold text-slate-800 mt-3.5">{feature.title}</h3>
      <p className="text-[12.5px] text-slate-500 mt-1 leading-relaxed">{feature.tagline}</p>
      <div className="mt-4">
        <NotifyMeButton
          featureKey={feature.key}
          registered={registered}
          onRegistered={onRegistered}
          className={featured ? "w-full" : ""}
        />
      </div>
    </div>
  );
}