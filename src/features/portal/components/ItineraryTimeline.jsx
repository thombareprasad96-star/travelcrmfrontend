// src/features/portal/components/ItineraryTimeline.jsx
// Renders a traveler-safe itinerary: hotels, transport, a day-wise vertical
// timeline, and inclusions / exclusions / policies. Pricing is never present in
// the payload, so nothing money-related is rendered here.
import {
  Hotel, Car, Utensils, Star, MapPin, Clock, Check, X, CalendarDays, Info,
} from "lucide-react";

function Section({ title, icon: Icon, children }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 lg:p-6 shadow-sm">
      <h3 className="text-[15px] font-bold text-slate-800 mb-4 flex items-center gap-2">
        {Icon && <Icon size={17} className="text-blue-600" strokeWidth={1.8} />} {title}
      </h3>
      {children}
    </div>
  );
}

function Stars({ n }) {
  if (!n) return null;
  return (
    <span className="inline-flex items-center gap-0.5 text-amber-500">
      {Array.from({ length: n }).map((_, i) => (
        <Star key={i} size={12} fill="currentColor" strokeWidth={0} />
      ))}
    </span>
  );
}

export default function ItineraryTimeline({ itinerary }) {
  if (!itinerary) return null;

  const {
    available, hotels = [], vehicles = [], days = [],
    inclusions = [], exclusions = [], paymentPolicies = [], cancellationPolicies = [],
  } = itinerary;

  const hasAnything =
    hotels.length || vehicles.length || days.length ||
    inclusions.length || exclusions.length || paymentPolicies.length || cancellationPolicies.length;

  if (!available || !hasAnything) {
    return (
      <Section title="Itinerary" icon={CalendarDays}>
        <div className="flex items-center gap-2 text-[13px] text-slate-400">
          <Info size={15} /> A detailed day-wise itinerary isn&apos;t available for this booking yet.
        </div>
      </Section>
    );
  }

  return (
    <div className="space-y-5">
      {/* Hotels */}
      {hotels.length > 0 && (
        <Section title="Where you'll stay" icon={Hotel}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {hotels.map((h, i) => (
              <div key={i} className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-bold text-slate-800 text-[14px] truncate">{h.name || "Hotel"}</p>
                  <Stars n={h.stars} />
                </div>
                {h.city && (
                  <p className="flex items-center gap-1 text-[12px] text-slate-500 mt-0.5">
                    <MapPin size={12} /> {h.city}
                  </p>
                )}
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {h.roomType && <Tag>{h.roomType}</Tag>}
                  {h.mealPlan && <Tag icon={Utensils}>{h.mealPlan}</Tag>}
                  {h.refundable != null && (
                    <Tag tone={h.refundable ? "emerald" : "slate"}>
                      {h.refundable ? "Refundable" : "Non-refundable"}
                    </Tag>
                  )}
                </div>
                {(h.checkIn || h.checkOut) && (
                  <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-200/60 text-[11.5px] text-slate-500">
                    {h.checkIn && <span>Check-in <b className="text-slate-700">{h.checkIn}</b></span>}
                    {h.checkOut && <span>Check-out <b className="text-slate-700">{h.checkOut}</b></span>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Transport */}
      {vehicles.length > 0 && (
        <Section title="Transport" icon={Car}>
          <div className="space-y-2.5">
            {vehicles.map((v, i) => (
              <div key={i} className="rounded-xl border border-slate-100 bg-slate-50/60 p-3.5">
                <p className="font-semibold text-slate-800 text-[13.5px]">{v.type || "Vehicle"}</p>
                {(v.pickup || v.drop) && (
                  <p className="flex items-center gap-1.5 text-[12.5px] text-slate-500 mt-1">
                    <MapPin size={12} className="text-blue-500" />
                    {v.pickup || "—"} <span className="text-slate-300">→</span> {v.drop || "—"}
                  </p>
                )}
                {(v.startDate || v.endDate) && (
                  <p className="text-[11.5px] text-slate-400 mt-1">
                    {v.startDate} {v.endDate ? `– ${v.endDate}` : ""}
                  </p>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Day-wise timeline */}
      {days.length > 0 && (
        <Section title="Day-wise plan" icon={CalendarDays}>
          <ol className="relative border-l-2 border-slate-100 ml-2 space-y-6">
            {days.map((d, i) => (
              <li key={i} className="ml-5">
                <span className="absolute -left-[11px] w-5 h-5 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-[10px] font-bold flex items-center justify-center shadow">
                  {d.dayNumber ?? i + 1}
                </span>
                <div className="flex items-baseline gap-2">
                  <p className="text-[13.5px] font-bold text-slate-800">Day {d.dayNumber ?? i + 1}</p>
                  {d.date && <span className="text-[11.5px] text-slate-400">{d.date}</span>}
                </div>
                <div className="mt-2 space-y-2.5">
                  {(d.activities || []).map((a, j) => (
                    <div key={j} className="rounded-xl border border-slate-100 bg-slate-50/60 p-3.5">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold text-slate-800 text-[13.5px]">{a.attraction || "Activity"}</p>
                        {a.startTime && (
                          <span className="flex items-center gap-1 text-[11.5px] text-slate-400 shrink-0">
                            <Clock size={11} /> {a.startTime}
                          </span>
                        )}
                      </div>
                      {a.description && (
                        <p className="text-[12.5px] text-slate-500 mt-1 leading-relaxed">{a.description}</p>
                      )}
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {a.transfer && <Tag icon={Car}>{a.transfer}</Tag>}
                        {(a.meals || []).map((m, k) => (
                          <Tag key={k} icon={Utensils} tone="emerald">{m}</Tag>
                        ))}
                      </div>
                    </div>
                  ))}
                  {(!d.activities || d.activities.length === 0) && (
                    <p className="text-[12.5px] text-slate-400">Leisure / at your own pace.</p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </Section>
      )}

      {/* Inclusions / Exclusions */}
      {(inclusions.length > 0 || exclusions.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {inclusions.length > 0 && (
            <Section title="Inclusions" icon={Check}>
              <ul className="space-y-2">
                {inclusions.map((t, i) => (
                  <li key={i} className="flex items-start gap-2 text-[13px] text-slate-600">
                    <Check size={15} className="text-emerald-500 mt-0.5 shrink-0" /> {t}
                  </li>
                ))}
              </ul>
            </Section>
          )}
          {exclusions.length > 0 && (
            <Section title="Exclusions" icon={X}>
              <ul className="space-y-2">
                {exclusions.map((t, i) => (
                  <li key={i} className="flex items-start gap-2 text-[13px] text-slate-600">
                    <X size={15} className="text-rose-400 mt-0.5 shrink-0" /> {t}
                  </li>
                ))}
              </ul>
            </Section>
          )}
        </div>
      )}

      {/* Policies */}
      {(paymentPolicies.length > 0 || cancellationPolicies.length > 0) && (
        <Section title="Policies" icon={Info}>
          {paymentPolicies.length > 0 && (
            <PolicyBlock title="Payment policy" items={paymentPolicies} />
          )}
          {cancellationPolicies.length > 0 && (
            <PolicyBlock title="Cancellation policy" items={cancellationPolicies} />
          )}
        </Section>
      )}
    </div>
  );
}

function Tag({ children, icon: Icon, tone = "blue" }) {
  const tones = {
    blue: "bg-blue-50 text-blue-700",
    emerald: "bg-emerald-50 text-emerald-700",
    slate: "bg-slate-100 text-slate-600",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium ${tones[tone]}`}>
      {Icon && <Icon size={11} />} {children}
    </span>
  );
}

function PolicyBlock({ title, items }) {
  return (
    <div className="mb-3 last:mb-0">
      <p className="text-[12px] font-semibold text-slate-600 mb-1.5">{title}</p>
      <ul className="space-y-1.5">
        {items.map((t, i) => (
          <li key={i} className="text-[12.5px] text-slate-500 leading-relaxed">• {t}</li>
        ))}
      </ul>
    </div>
  );
}