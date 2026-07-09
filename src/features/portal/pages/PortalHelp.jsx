// src/features/portal/pages/PortalHelp.jsx
// "What's Coming" — the full list of teaser features with Notify-me.
import { Sparkles, LifeBuoy, Phone } from "lucide-react";
import { COMING_SOON_LIST } from "../constants/portalFeatures";
import { ComingSoonCard, usePortalFeatureInterest } from "../components/comingSoon";
import { Spinner } from "../components/portalUi";

export default function PortalHelp() {
  const { registered, loaded, markRegistered } = usePortalFeatureInterest();

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-blue-600 p-6 lg:p-9 text-white shadow-xl shadow-indigo-300/30">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 text-blue-100 text-[13px] font-semibold">
            <Sparkles size={15} /> What&apos;s coming
          </div>
          <h1 className="text-2xl lg:text-[32px] font-extrabold mt-1 tracking-tight">Big things ahead</h1>
          <p className="text-blue-100/90 text-[13.5px] lg:text-sm mt-1.5 max-w-lg">
            We&apos;re building more ways to make your trips effortless. Tap “Notify me” and we&apos;ll
            ping you the moment it goes live.
          </p>
        </div>
        <Sparkles className="absolute -right-4 -bottom-6 text-white/10" size={160} />
        <div className="absolute -left-12 -top-14 w-52 h-52 rounded-full bg-white/10 blur-2xl" />
      </div>

      {/* Coming soon grid */}
      <div>
        <h2 className="text-lg font-bold text-slate-800 mb-3">Upcoming features</h2>
        {!loaded ? (
          <Spinner label="Loading…" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {COMING_SOON_LIST.map((f) => (
              <ComingSoonCard
                key={f.key}
                feature={f}
                registered={registered.has(f.key)}
                onRegistered={markRegistered}
              />
            ))}
          </div>
        )}
      </div>

      {/* Support */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-[15px] font-bold text-slate-800 flex items-center gap-2">
          <LifeBuoy size={17} className="text-blue-600" /> Need help?
        </h2>
        <p className="text-[13px] text-slate-500 mt-1">
          For any question about your trip, reach out to your travel agency directly.
        </p>
        <div className="mt-3 inline-flex items-center gap-2 text-[13px] font-semibold text-slate-600">
          <Phone size={15} className="text-slate-400" /> Contact your agency for assistance
        </div>
      </div>
    </div>
  );
}