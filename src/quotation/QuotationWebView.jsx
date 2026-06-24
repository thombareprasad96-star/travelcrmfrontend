import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const inr = (v) => (v == null ? "—" : `₹${Number(v).toLocaleString("en-IN")}`);
const fmtDate = (d) => {
  if (!d) return "—";
  try { return new Date(d).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }); }
  catch { return d; }
};

/**
 * Read-only, customer-facing WEB rendering of a quotation. Fetches the PUBLIC endpoint
 * (no auth) by publicId, so it works both inside the app (agent) and on the public
 * /q/{publicId} share page (customer). Self-contained (background + Download PDF button).
 */
export default function QuotationWebView({ publicId }) {
  const [q, setQ] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API}/public/quotations/${publicId}`);
        if (!res.ok) {
          throw new Error(res.status === 404
            ? "This quotation link is invalid or no longer available."
            : "Failed to load the quotation.");
        }
        const body = await res.json();
        if (active) setQ(body?.data || body);
      } catch (e) {
        if (active) setError(e.message || "Failed to load the quotation.");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [publicId]);

  if (loading) return <Centered>Loading quotation…</Centered>;
  if (error)   return <Centered><span className="text-red-600">{error}</span></Centered>;
  if (!q)      return <Centered>Quotation not found.</Centered>;

  const c = q.customer || {};
  const pdfUrl = `${API}/public/quotations/${publicId}/pdf`;

  return (
    <div className="min-h-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100"
         style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-5">

        {/* Title + Download PDF */}
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-lg font-extrabold text-slate-900 truncate">{q.title || "Travel Quotation"}</h1>
            <p className="text-xs text-slate-500">
              {q.version || ""}{q.quoteNo ? ` · Quote #${q.quoteNo}` : ""}{q.quotationStage ? ` · ${q.quotationStage}` : ""}
            </p>
          </div>
          <a href={pdfUrl} target="_blank" rel="noreferrer"
             className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold whitespace-nowrap">
            Download PDF
          </a>
        </div>

        {q.coverImageUrl && (
          <img src={q.coverImageUrl} alt="" className="w-full h-48 sm:h-64 object-cover rounded-2xl border border-slate-200" />
        )}

        {/* Customer / trip */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <h2 className="text-base font-extrabold text-slate-900">{c.name || "Guest"}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
            <Info label="Destination" value={c.destination} />
            <Info label="Travel Date" value={fmtDate(c.travelDate)} />
            <Info label="Travellers" value={`${c.adults || 0} Adt${c.children ? `, ${c.children} Chd` : ""}${c.infants ? `, ${c.infants} Inf` : ""}`} />
            <Info label="Nights / Days" value={`${q.nights ?? "—"} / ${q.days ?? "—"}`} />
          </div>
        </section>

        {/* Flights */}
        {q.flight?.included && q.flight?.segments?.length > 0 && (
          <Section title={q.flight.title || "Flights"} amount={q.flight.amount}>
            <div className="space-y-2">
              {q.flight.segments.map((s, i) => (
                <div key={i} className="flex items-center justify-between gap-3 text-sm border border-slate-100 rounded-xl p-3">
                  <div className="min-w-0">
                    <p className="font-bold text-slate-800">{s.from} → {s.to}</p>
                    <p className="text-xs text-slate-500">{s.airline} {s.flightNo}{s.class ? ` · ${s.class}` : ""}</p>
                  </div>
                  <div className="text-right text-xs text-slate-500 whitespace-nowrap">
                    <p>{fmtDate(s.depDate)} {s.depTime || ""}</p>
                    {s.duration && <p>{s.duration}</p>}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Hotels */}
        {q.hotel?.included && q.hotel?.hotels?.length > 0 && (
          <Section title={q.hotel.title || "Hotels"} amount={q.hotel.amount}>
            <div className="space-y-2">
              {q.hotel.hotels.map((h, i) => (
                <div key={i} className="flex gap-3 text-sm border border-slate-100 rounded-xl p-3">
                  {h.imageUrl && <img src={h.imageUrl} alt="" className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />}
                  <div className="min-w-0">
                    <p className="font-bold text-slate-800">{h.name}{h.stars ? ` · ${h.stars}★` : ""}</p>
                    <p className="text-xs text-slate-500">{[h.city, h.roomType, h.mealPlan].filter(Boolean).join(" · ")}</p>
                    <p className="text-xs text-slate-500">{fmtDate(h.checkIn)} → {fmtDate(h.checkOut)}{h.rooms ? ` · ${h.rooms} room(s)` : ""}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Sightseeing */}
        {q.sightseeing?.included && q.sightseeing?.days?.length > 0 && (
          <Section title={q.sightseeing.title || "Sightseeing"} amount={q.sightseeing.amount}>
            <div className="space-y-2">
              {q.sightseeing.days.map((d, i) => (
                <div key={i} className="border border-slate-100 rounded-xl p-3">
                  <p className="text-xs font-bold text-blue-700 mb-1">Day {d.day}{d.date ? ` · ${fmtDate(d.date)}` : ""}</p>
                  <ul className="text-sm text-slate-700 list-disc list-inside space-y-0.5">
                    {(d.activities || []).map((a, j) => (
                      <li key={j}>{a.attraction}{a.startTime ? ` (${a.startTime})` : ""}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Cruise */}
        {q.cruise?.included && q.cruise?.cruises?.length > 0 && (
          <Section title={q.cruise.title || "Cruise"} amount={q.cruise.amount}>
            {q.cruise.cruises.map((cr, i) => (
              <div key={i} className="text-sm border border-slate-100 rounded-xl p-3 mb-2 last:mb-0">
                <p className="font-bold text-slate-800">{cr.name}{cr.type ? ` · ${cr.type}` : ""}</p>
                <p className="text-xs text-slate-500">{cr.depPort} → {cr.arrPort} · {fmtDate(cr.depDate)}{cr.nights ? ` · ${cr.nights} nights` : ""}{cr.cabin ? ` · ${cr.cabin}` : ""}</p>
              </div>
            ))}
          </Section>
        )}

        {/* Vehicles */}
        {q.vehicle?.included && q.vehicle?.vehicles?.length > 0 && (
          <Section title={q.vehicle.title || "Transport"} amount={q.vehicle.amount}>
            {q.vehicle.vehicles.map((v, i) => (
              <div key={i} className="text-sm border border-slate-100 rounded-xl p-3 mb-2 last:mb-0">
                <p className="font-bold text-slate-800">{v.type}</p>
                <p className="text-xs text-slate-500">{[v.pickup, v.drop].filter(Boolean).join(" → ")}{v.startDate ? ` · ${fmtDate(v.startDate)}` : ""}{v.qty ? ` · Qty ${v.qty}` : ""}</p>
              </div>
            ))}
          </Section>
        )}

        {/* Add-ons */}
        {q.addons?.included && q.addons?.items?.length > 0 && (
          <Section title={q.addons.title || "Add-on Services"} amount={q.addons.amount}>
            <ul className="text-sm text-slate-700 space-y-1">
              {q.addons.items.map((a, i) => (
                <li key={i} className="flex justify-between gap-3">
                  <span>{a.serviceType}{a.quantity ? ` × ${a.quantity}` : ""}</span>
                  <span className="whitespace-nowrap">{inr(a.pricePerUnit)}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* Inclusions / Exclusions */}
        {(q.inclusions?.length > 0 || q.exclusions?.length > 0) && (
          <div className="grid sm:grid-cols-2 gap-5">
            {q.inclusions?.length > 0 && <ListCard title="Inclusions" items={q.inclusions} tone="green" />}
            {q.exclusions?.length > 0 && <ListCard title="Exclusions" items={q.exclusions} tone="red" />}
          </div>
        )}

        {/* Pricing */}
        {q.totals && (
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wide mb-3">Price Summary</h2>
            <div className="space-y-1.5 text-sm">
              <Row label="Subtotal" value={inr(q.totals.subtotal)} />
              {q.totals.discountAmount > 0 && <Row label="Discount" value={`- ${inr(q.totals.discountAmount)}`} />}
              {q.totals.markup > 0 && <Row label="Markup" value={inr(q.totals.markup)} />}
              {q.totals.taxAmount > 0 && <Row label={`Tax (${q.totals.taxPercent || 0}%)`} value={inr(q.totals.taxAmount)} />}
              <div className="border-t border-slate-200 mt-2 pt-2 flex justify-between text-base font-extrabold text-slate-900">
                <span>Grand Total</span><span className="text-blue-700">{inr(q.totals.grandTotal)}</span>
              </div>
              {q.totals.perAdult != null && (
                <p className="text-xs text-slate-500 text-right">{inr(q.totals.perAdult)} per adult</p>
              )}
            </div>
          </section>
        )}

        {/* Policies / Terms */}
        {q.paymentPolicies?.length > 0 && <ListCard title="Payment Policy" items={q.paymentPolicies} />}
        {q.cancellationPolicies?.length > 0 && <ListCard title="Cancellation Policy" items={q.cancellationPolicies} />}
        {q.bookingTerms?.length > 0 && <ListCard title="Booking Terms" items={q.bookingTerms} />}

        {q.notes && (
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wide mb-2">Notes</h2>
            <p className="text-sm text-slate-700 whitespace-pre-line">{q.notes}</p>
          </section>
        )}

        <p className="text-center text-xs text-slate-400 py-2">Generated on {fmtDate(q.createdAt)}</p>
      </div>
    </div>
  );
}

/** Route wrapper for the public share page: /q/:publicId */
export function PublicQuotationPage() {
  const { publicId } = useParams();
  return (
    <div className="min-h-screen">
      <QuotationWebView publicId={publicId} />
    </div>
  );
}

/* ── small presentational helpers ── */
function Centered({ children }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-slate-50 text-slate-500 text-sm p-6 text-center">
      {children}
    </div>
  );
}
function Info({ label, value }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wide text-slate-400 font-bold">{label}</p>
      <p className="text-slate-800 font-semibold break-words">{value || "—"}</p>
    </div>
  );
}
function Row({ label, value }) {
  return (
    <div className="flex justify-between text-slate-600">
      <span>{label}</span><span className="font-semibold text-slate-800">{value}</span>
    </div>
  );
}
function Section({ title, amount, children }) {
  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
        <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wide">{title}</h2>
        {amount != null && <span className="text-sm font-bold text-blue-700">{inr(amount)}</span>}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}
function ListCard({ title, items, tone }) {
  const dot = tone === "green" ? "bg-green-500" : tone === "red" ? "bg-red-500" : "bg-blue-500";
  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
      <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wide mb-3">{title}</h2>
      <ul className="space-y-1.5 text-sm text-slate-700">
        {items.map((it, i) => (
          <li key={i} className="flex gap-2"><span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${dot}`} />{it}</li>
        ))}
      </ul>
    </section>
  );
}