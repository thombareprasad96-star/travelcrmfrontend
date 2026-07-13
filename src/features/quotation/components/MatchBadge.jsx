// src/features/quotation/components/MatchBadge.jsx
//
// The explainable match score. A ring/pill showing the headline %, and — because a score the agent
// can't interrogate is a score they won't trust — an expandable breakdown of every weighted
// component with a plain-English reason.

import { useState } from "react";
import { ChevronDown, MinusCircle } from "lucide-react";

/** Green ≥ 75, amber ≥ 55, slate below. Keeps the eye on the strong matches. */
export function matchTone(pct) {
  if (pct >= 75) return { text: "text-emerald-700", bg: "bg-emerald-50", ring: "ring-emerald-200", bar: "bg-emerald-500", solid: "bg-emerald-600" };
  if (pct >= 55) return { text: "text-amber-700", bg: "bg-amber-50", ring: "ring-amber-200", bar: "bg-amber-500", solid: "bg-amber-500" };
  return { text: "text-slate-600", bg: "bg-slate-100", ring: "ring-slate-200", bar: "bg-slate-400", solid: "bg-slate-500" };
}

/** Compact pill, e.g. for a list row. */
export function MatchPill({ percentage }) {
  const tone = matchTone(percentage);
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold ring-1 ${tone.bg} ${tone.text} ${tone.ring}`}>
      {percentage}<span className="text-[10px] font-bold opacity-70">% match</span>
    </span>
  );
}

/**
 * The full badge: a big % ring plus a "Why?" disclosure that lists each dimension's contribution.
 * Not-applicable dimensions are shown greyed with their reason, so the agent understands a 100 %
 * built on two signals differently from one built on five.
 */
export default function MatchBadge({ percentage, components = [], defaultOpen = false, inlineOnly = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const tone = matchTone(percentage);
  const applicable = components.filter((c) => c.applicable);

  return (
    <div>
      <div className="flex items-center gap-3">
        {/* The ring is skipped in inline mode — the caller (a card) already shows the % itself. */}
        {!inlineOnly && (
          <div className={`relative w-14 h-14 rounded-2xl flex flex-col items-center justify-center ring-1 ${tone.bg} ${tone.ring}`}>
            <span className={`text-lg font-extrabold leading-none ${tone.text}`}>{percentage}</span>
            <span className={`text-[9px] font-bold uppercase tracking-wide ${tone.text} opacity-70`}>match</span>
          </div>
        )}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-700 transition-colors"
        >
          Why this score?
          <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
      </div>

      {open && (
        <div className="mt-3 space-y-2.5">
          {components.map((c) => (
            <ComponentRow key={c.key} component={c} />
          ))}
          <p className="text-[11px] text-slate-400 pt-1">
            {applicable.length} of {components.length} dimensions scored · weights renormalized over what applied
          </p>
        </div>
      )}
    </div>
  );
}

function ComponentRow({ component }) {
  const { label, applicable, score, detail, weight } = component;

  if (!applicable) {
    return (
      <div className="flex items-center gap-2 text-slate-400">
        <MinusCircle size={13} className="flex-shrink-0" />
        <span className="text-xs font-semibold w-24 flex-shrink-0">{label}</span>
        <span className="text-[11px] italic">{detail}</span>
      </div>
    );
  }

  const tone = matchTone(score);
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold text-slate-600 w-24 flex-shrink-0">{label}</span>
      <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
        <div className={`h-full rounded-full ${tone.bar}`} style={{ width: `${score}%` }} />
      </div>
      <span className={`text-[11px] font-bold w-8 text-right ${tone.text}`}>{score}</span>
      <span className="text-[11px] text-slate-400 w-40 truncate flex-shrink-0" title={detail}>
        {detail}
      </span>
      <span className="text-[10px] text-slate-300 w-8 text-right flex-shrink-0" title={`weight ${Math.round(weight * 100)}%`}>
        ×{Math.round(weight * 100)}
      </span>
    </div>
  );
}