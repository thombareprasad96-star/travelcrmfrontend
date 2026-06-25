// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";

// const API = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

// const inr = (v) => (v == null ? "—" : `₹${Number(v).toLocaleString("en-IN")}`);
// const fmtDate = (d) => {
//   if (!d) return "—";
//   try { return new Date(d).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }); }
//   catch { return d; }
// };

// /**
//  * Read-only, customer-facing WEB rendering of a quotation. Fetches the PUBLIC endpoint
//  * (no auth) by publicId, so it works both inside the app (agent) and on the public
//  * /q/{publicId} share page (customer). Self-contained (background + Download PDF button).
//  */
// export default function QuotationWebView({ publicId }) {
//   const [q, setQ] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     let active = true;
//     (async () => {
//       try {
//         setLoading(true);
//         setError(null);
//         const res = await fetch(`${API}/public/quotations/${publicId}`);
//         if (!res.ok) {
//           throw new Error(res.status === 404
//             ? "This quotation link is invalid or no longer available."
//             : "Failed to load the quotation.");
//         }
//         const body = await res.json();
//         if (active) setQ(body?.data || body);
//       } catch (e) {
//         if (active) setError(e.message || "Failed to load the quotation.");
//       } finally {
//         if (active) setLoading(false);
//       }
//     })();
//     return () => { active = false; };
//   }, [publicId]);

//   if (loading) return <Centered>Loading quotation…</Centered>;
//   if (error)   return <Centered><span className="text-red-600">{error}</span></Centered>;
//   if (!q)      return <Centered>Quotation not found.</Centered>;

//   const c = q.customer || {};
//   const pdfUrl = `${API}/public/quotations/${publicId}/pdf`;

//   return (
//     <div className="min-h-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100"
//          style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
//       <div className="max-w-4xl mx-auto px-4 py-6 space-y-5">

//         {/* Title + Download PDF */}
//         <div className="flex items-center justify-between gap-3">
//           <div className="min-w-0">
//             <h1 className="text-lg font-extrabold text-slate-900 truncate">{q.title || "Travel Quotation"}</h1>
//             <p className="text-xs text-slate-500">
//               {q.version || ""}{q.quoteNo ? ` · Quote #${q.quoteNo}` : ""}{q.quotationStage ? ` · ${q.quotationStage}` : ""}
//             </p>
//           </div>
//           <a href={pdfUrl} target="_blank" rel="noreferrer"
//              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold whitespace-nowrap">
//             Download PDF
//           </a>
//         </div>

//         {q.coverImageUrl && (
//           <img src={q.coverImageUrl} alt="" className="w-full h-48 sm:h-64 object-cover rounded-2xl border border-slate-200" />
//         )}

//         {/* Customer / trip */}
//         <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
//           <h2 className="text-base font-extrabold text-slate-900">{c.name || "Guest"}</h2>
//           <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
//             <Info label="Destination" value={c.destination} />
//             <Info label="Travel Date" value={fmtDate(c.travelDate)} />
//             <Info label="Travellers" value={`${c.adults || 0} Adt${c.children ? `, ${c.children} Chd` : ""}${c.infants ? `, ${c.infants} Inf` : ""}`} />
//             <Info label="Nights / Days" value={`${q.nights ?? "—"} / ${q.days ?? "—"}`} />
//           </div>
//         </section>

//         {/* Flights */}
//         {q.flight?.included && q.flight?.segments?.length > 0 && (
//           <Section title={q.flight.title || "Flights"} amount={q.flight.amount}>
//             <div className="space-y-2">
//               {q.flight.segments.map((s, i) => (
//                 <div key={i} className="flex items-center justify-between gap-3 text-sm border border-slate-100 rounded-xl p-3">
//                   <div className="min-w-0">
//                     <p className="font-bold text-slate-800">{s.from} → {s.to}</p>
//                     <p className="text-xs text-slate-500">{s.airline} {s.flightNo}{s.class ? ` · ${s.class}` : ""}</p>
//                   </div>
//                   <div className="text-right text-xs text-slate-500 whitespace-nowrap">
//                     <p>{fmtDate(s.depDate)} {s.depTime || ""}</p>
//                     {s.duration && <p>{s.duration}</p>}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </Section>
//         )}

//         {/* Hotels */}
//         {q.hotel?.included && q.hotel?.hotels?.length > 0 && (
//           <Section title={q.hotel.title || "Hotels"} amount={q.hotel.amount}>
//             <div className="space-y-2">
//               {q.hotel.hotels.map((h, i) => (
//                 <div key={i} className="flex gap-3 text-sm border border-slate-100 rounded-xl p-3">
//                   {h.imageUrl && <img src={h.imageUrl} alt="" className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />}
//                   <div className="min-w-0">
//                     <p className="font-bold text-slate-800">{h.name}{h.stars ? ` · ${h.stars}★` : ""}</p>
//                     <p className="text-xs text-slate-500">{[h.city, h.roomType, h.mealPlan].filter(Boolean).join(" · ")}</p>
//                     <p className="text-xs text-slate-500">{fmtDate(h.checkIn)} → {fmtDate(h.checkOut)}{h.rooms ? ` · ${h.rooms} room(s)` : ""}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </Section>
//         )}

//         {/* Sightseeing */}
//         {q.sightseeing?.included && q.sightseeing?.days?.length > 0 && (
//           <Section title={q.sightseeing.title || "Sightseeing"} amount={q.sightseeing.amount}>
//             <div className="space-y-2">
//               {q.sightseeing.days.map((d, i) => (
//                 <div key={i} className="border border-slate-100 rounded-xl p-3">
//                   <p className="text-xs font-bold text-blue-700 mb-1">Day {d.day}{d.date ? ` · ${fmtDate(d.date)}` : ""}</p>
//                   <ul className="text-sm text-slate-700 list-disc list-inside space-y-0.5">
//                     {(d.activities || []).map((a, j) => (
//                       <li key={j}>{a.attraction}{a.startTime ? ` (${a.startTime})` : ""}</li>
//                     ))}
//                   </ul>
//                 </div>
//               ))}
//             </div>
//           </Section>
//         )}

//         {/* Cruise */}
//         {q.cruise?.included && q.cruise?.cruises?.length > 0 && (
//           <Section title={q.cruise.title || "Cruise"} amount={q.cruise.amount}>
//             {q.cruise.cruises.map((cr, i) => (
//               <div key={i} className="text-sm border border-slate-100 rounded-xl p-3 mb-2 last:mb-0">
//                 <p className="font-bold text-slate-800">{cr.name}{cr.type ? ` · ${cr.type}` : ""}</p>
//                 <p className="text-xs text-slate-500">{cr.depPort} → {cr.arrPort} · {fmtDate(cr.depDate)}{cr.nights ? ` · ${cr.nights} nights` : ""}{cr.cabin ? ` · ${cr.cabin}` : ""}</p>
//               </div>
//             ))}
//           </Section>
//         )}

//         {/* Vehicles */}
//         {q.vehicle?.included && q.vehicle?.vehicles?.length > 0 && (
//           <Section title={q.vehicle.title || "Transport"} amount={q.vehicle.amount}>
//             {q.vehicle.vehicles.map((v, i) => (
//               <div key={i} className="text-sm border border-slate-100 rounded-xl p-3 mb-2 last:mb-0">
//                 <p className="font-bold text-slate-800">{v.type}</p>
//                 <p className="text-xs text-slate-500">{[v.pickup, v.drop].filter(Boolean).join(" → ")}{v.startDate ? ` · ${fmtDate(v.startDate)}` : ""}{v.qty ? ` · Qty ${v.qty}` : ""}</p>
//               </div>
//             ))}
//           </Section>
//         )}

//         {/* Add-ons */}
//         {q.addons?.included && q.addons?.items?.length > 0 && (
//           <Section title={q.addons.title || "Add-on Services"} amount={q.addons.amount}>
//             <ul className="text-sm text-slate-700 space-y-1">
//               {q.addons.items.map((a, i) => (
//                 <li key={i} className="flex justify-between gap-3">
//                   <span>{a.serviceType}{a.quantity ? ` × ${a.quantity}` : ""}</span>
//                   <span className="whitespace-nowrap">{inr(a.pricePerUnit)}</span>
//                 </li>
//               ))}
//             </ul>
//           </Section>
//         )}

//         {/* Inclusions / Exclusions */}
//         {(q.inclusions?.length > 0 || q.exclusions?.length > 0) && (
//           <div className="grid sm:grid-cols-2 gap-5">
//             {q.inclusions?.length > 0 && <ListCard title="Inclusions" items={q.inclusions} tone="green" />}
//             {q.exclusions?.length > 0 && <ListCard title="Exclusions" items={q.exclusions} tone="red" />}
//           </div>
//         )}

//         {/* Pricing */}
//         {q.totals && (
//           <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
//             <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wide mb-3">Price Summary</h2>
//             <div className="space-y-1.5 text-sm">
//               <Row label="Subtotal" value={inr(q.totals.subtotal)} />
//               {q.totals.discountAmount > 0 && <Row label="Discount" value={`- ${inr(q.totals.discountAmount)}`} />}
//               {q.totals.markup > 0 && <Row label="Markup" value={inr(q.totals.markup)} />}
//               {q.totals.taxAmount > 0 && <Row label={`Tax (${q.totals.taxPercent || 0}%)`} value={inr(q.totals.taxAmount)} />}
//               <div className="border-t border-slate-200 mt-2 pt-2 flex justify-between text-base font-extrabold text-slate-900">
//                 <span>Grand Total</span><span className="text-blue-700">{inr(q.totals.grandTotal)}</span>
//               </div>
//               {q.totals.perAdult != null && (
//                 <p className="text-xs text-slate-500 text-right">{inr(q.totals.perAdult)} per adult</p>
//               )}
//             </div>
//           </section>
//         )}

//         {/* Policies / Terms */}
//         {q.paymentPolicies?.length > 0 && <ListCard title="Payment Policy" items={q.paymentPolicies} />}
//         {q.cancellationPolicies?.length > 0 && <ListCard title="Cancellation Policy" items={q.cancellationPolicies} />}
//         {q.bookingTerms?.length > 0 && <ListCard title="Booking Terms" items={q.bookingTerms} />}

//         {q.notes && (
//           <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
//             <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wide mb-2">Notes</h2>
//             <p className="text-sm text-slate-700 whitespace-pre-line">{q.notes}</p>
//           </section>
//         )}

//         <p className="text-center text-xs text-slate-400 py-2">Generated on {fmtDate(q.createdAt)}</p>
//       </div>
//     </div>
//   );
// }

// /** Route wrapper for the public share page: /q/:publicId */
// export function PublicQuotationPage() {
//   const { publicId } = useParams();
//   return (
//     <div className="min-h-screen">
//       <QuotationWebView publicId={publicId} />
//     </div>
//   );
// }

// /* ── small presentational helpers ── */
// function Centered({ children }) {
//   return (
//     <div className="min-h-[60vh] flex items-center justify-center bg-slate-50 text-slate-500 text-sm p-6 text-center">
//       {children}
//     </div>
//   );
// }
// function Info({ label, value }) {
//   return (
//     <div>
//       <p className="text-[11px] uppercase tracking-wide text-slate-400 font-bold">{label}</p>
//       <p className="text-slate-800 font-semibold break-words">{value || "—"}</p>
//     </div>
//   );
// }
// function Row({ label, value }) {
//   return (
//     <div className="flex justify-between text-slate-600">
//       <span>{label}</span><span className="font-semibold text-slate-800">{value}</span>
//     </div>
//   );
// }
// function Section({ title, amount, children }) {
//   return (
//     <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
//       <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
//         <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wide">{title}</h2>
//         {amount != null && <span className="text-sm font-bold text-blue-700">{inr(amount)}</span>}
//       </div>
//       <div className="p-5">{children}</div>
//     </section>
//   );
// }
// function ListCard({ title, items, tone }) {
//   const dot = tone === "green" ? "bg-green-500" : tone === "red" ? "bg-red-500" : "bg-blue-500";
//   return (
//     <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
//       <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wide mb-3">{title}</h2>
//       <ul className="space-y-1.5 text-sm text-slate-700">
//         {items.map((it, i) => (
//           <li key={i} className="flex gap-2"><span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${dot}`} />{it}</li>
//         ))}
//       </ul>
//     </section>
//   );
// }






import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const inr = (v) => (v == null ? "—" : `₹${Number(v).toLocaleString("en-IN")}`);
const fmtDate = (d) => {
  if (!d) return "—";
  try { return new Date(d).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }); }
  catch { return d; }
};

/* ━━━ SECTION CARD — colored gradient header ━━━ */
function GCard({ title, sub, amount, icon, grad, lightBg, lightBorder, children }) {
  return (
    <div style={{ borderRadius:18, overflow:"hidden", border:"none" }}>
      {/* Gradient header */}
      <div style={{ background:grad, padding:"14px 16px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:36, height:36, borderRadius:10, background:"rgba(255,255,255,0.2)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:18 }}>
            {icon}
          </div>
          <div>
            <p style={{ fontSize:13, fontWeight:700, color:"#fff", margin:0 }}>{title}</p>
            {sub && <p style={{ fontSize:10, color:"rgba(255,255,255,0.6)", margin:0 }}>{sub}</p>}
          </div>
        </div>
        {amount != null && (
          <span style={{ background:"rgba(255,255,255,0.2)", border:"1px solid rgba(255,255,255,0.25)", borderRadius:8, padding:"4px 10px", fontSize:11, fontWeight:700, color:"#fff" }}>
            {inr(amount)}
          </span>
        )}
      </div>
      {/* White body */}
      <div style={{ background:"rgba(255,255,255,0.95)", padding:"12px 14px" }}>
        {children}
      </div>
    </div>
  );
}

/* ━━━ ROW ITEM inside section ━━━ */
function RItem({ bg, border, children }) {
  return (
    <div style={{ background:bg||"#fafafa", border:`1px solid ${border||"#e2e8f0"}`, borderRadius:11, padding:"10px 12px", marginBottom:8 }}>
      {children}
    </div>
  );
}

/* ━━━ POLICY CARD — tinted ━━━ */
function PolCard({ title, items, bg, border, titleColor, numColor, txtColor }) {
  return (
    <div style={{ background:bg, border:`1px solid ${border}`, borderRadius:14, padding:"14px 16px" }}>
      <p style={{ fontSize:9, fontWeight:700, color:titleColor, textTransform:"uppercase", letterSpacing:".1em", margin:"0 0 10px" }}>{title}</p>
      {items.map((it, i) => (
        <div key={i} style={{ display:"flex", gap:8, marginBottom:6 }}>
          <span style={{ fontSize:9, fontWeight:700, color:numColor, minWidth:16 }}>{String(i+1).padStart(2,"0")}.</span>
          <span style={{ fontSize:10, color:txtColor, lineHeight:1.6 }}>{it}</span>
        </div>
      ))}
    </div>
  );
}

/* ━━━ LIST BOX — inc/exc ━━━ */
function ListBox({ title, items, tone }) {
  const g = tone === "green";
  const styles = g
    ? { bg:"linear-gradient(135deg,#e8f5e9,#f1f8e9)", border:"#a5d6a7", title:"#1b5e20", dot:"#43a047", txt:"#2e7d32" }
    : { bg:"linear-gradient(135deg,#fce4ec,#ffeef4)", border:"#f48fb1", title:"#880e4f", dot:"#e91e63", txt:"#ad1457" };
  return (
    <div style={{ background:styles.bg, border:`1px solid ${styles.border}`, borderRadius:14, padding:"12px 14px" }}>
      <p style={{ fontSize:9, fontWeight:700, color:styles.title, textTransform:"uppercase", letterSpacing:".1em", margin:"0 0 10px" }}>{title}</p>
      {items.map((it, i) => (
        <div key={i} style={{ display:"flex", gap:6, alignItems:"flex-start", marginBottom:6 }}>
          <span style={{ width:4, height:4, borderRadius:"50%", background:styles.dot, flexShrink:0, marginTop:5 }} />
          <span style={{ fontSize:10, color:styles.txt, lineHeight:1.5 }}>{it}</span>
        </div>
      ))}
    </div>
  );
}

/* ━━━ PRICE ROW ━━━ */
function PRow({ label, val, green }) {
  return (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
      <span style={{ fontSize:11, color:"rgba(255,255,255,0.45)" }}>{label}</span>
      <span style={{ fontSize:11, fontWeight:700, color:green?"#00e676":"rgba(255,255,255,0.85)" }}>{val}</span>
    </div>
  );
}

/* ━━━ CENTERED ━━━ */
function Centered({ children }) {
  return <div style={{ minHeight:"60vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#f1f5f9", padding:24 }}>{children}</div>;
}
function Spinner() {
  return (
    <div style={{ textAlign:"center" }}>
      <div style={{ width:38, height:38, border:"3px solid #e2e8f0", borderTopColor:"#1565c0", borderRadius:"50%", animation:"qspin .75s linear infinite", margin:"0 auto 12px" }} />
      <p style={{ fontSize:13, color:"#94a3b8", margin:0 }}>Loading quotation…</p>
    </div>
  );
}
function ErrBox({ msg }) {
  return (
    <div style={{ background:"#fce4ec", border:"1px solid #f48fb1", borderRadius:18, padding:"28px 32px", textAlign:"center", maxWidth:380 }}>
      <p style={{ fontSize:32, margin:"0 0 12px" }}>⚠️</p>
      <p style={{ fontSize:14, color:"#880e4f", fontWeight:700, margin:0 }}>{msg}</p>
    </div>
  );
}

/* ━━━ MAIN COMPONENT ━━━ */
export default function QuotationWebView({ publicId }) {
  const [q, setQ]           = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true); setError(null);
        const res = await fetch(`${API}/public/quotations/${publicId}`);
        if (!res.ok) throw new Error(res.status === 404 ? "This quotation link is invalid or no longer available." : "Failed to load the quotation.");
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

  if (loading) return <Centered><Spinner /></Centered>;
  if (error)   return <Centered><ErrBox msg={error} /></Centered>;
  if (!q)      return <Centered>Quotation not found.</Centered>;

  const c = q.customer || {};
  const pdfUrl = `${API}/public/quotations/${publicId}/pdf`;

  return (
    <div style={{ fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif", minHeight:"100%", background:"#f1f5f9" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        @keyframes qfadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes qspin{to{transform:rotate(360deg)}}
        @keyframes qdot{0%,100%{opacity:1}50%{opacity:.4}}
        .qu0{animation:qfadeUp .5s ease both}
        .qu1{animation:qfadeUp .5s .08s ease both}
        .qu2{animation:qfadeUp .5s .16s ease both}
        .qu3{animation:qfadeUp .5s .24s ease both}
        .qu4{animation:qfadeUp .5s .32s ease both}
        .qu5{animation:qfadeUp .5s .40s ease both}
        .qu6{animation:qfadeUp .5s .48s ease both}
        .qu7{animation:qfadeUp .5s .56s ease both}
        .qu8{animation:qfadeUp .5s .64s ease both}
      `}</style>

      {/* ━━━ HERO ━━━ */}
      <div style={{ background:"linear-gradient(135deg,#0a0f2e,#1a237e,#4a148c)", position:"relative", overflow:"hidden" }}>
        {/* Glow orbs */}
        <div style={{ position:"absolute", top:-60, right:-60, width:220, height:220, borderRadius:"50%", background:"radial-gradient(circle,rgba(103,58,183,0.5),transparent 70%)" }} />
        <div style={{ position:"absolute", bottom:-40, left:-40, width:180, height:180, borderRadius:"50%", background:"radial-gradient(circle,rgba(33,150,243,0.4),transparent 70%)" }} />
        {/* Rings */}
        <div style={{ position:"absolute", top:-80, right:-80, width:280, height:280, borderRadius:"50%", border:"1px solid rgba(255,255,255,0.05)" }} />
        <div style={{ position:"absolute", top:-50, right:-50, width:200, height:200, borderRadius:"50%", border:"1px solid rgba(255,255,255,0.04)" }} />
        {q.coverImageUrl && (
          <img src={q.coverImageUrl} alt="" style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", opacity:.08, pointerEvents:"none" }} />
        )}
        <div style={{ maxWidth:880, margin:"0 auto", padding:"40px 20px 0", position:"relative", zIndex:1 }}>
          {/* Badge */}
          <div className="qu0" style={{ marginBottom:14 }}>
            <span style={{ display:"inline-flex", alignItems:"center", gap:7, background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.2)", borderRadius:100, padding:"5px 14px", backdropFilter:"blur(8px)" }}>
              <span style={{ width:6, height:6, borderRadius:"50%", background:"#00e676", animation:"qdot 2s ease infinite" }} />
              <span style={{ fontSize:9, fontWeight:700, color:"rgba(255,255,255,0.8)", letterSpacing:".12em", textTransform:"uppercase" }}>Travelcrm · Travel Quotation</span>
            </span>
          </div>
          {/* Title */}
          <h1 className="qu0" style={{ fontSize:"clamp(22px,5vw,36px)", fontWeight:900, color:"#fff", margin:"0 0 6px", lineHeight:1.1, letterSpacing:"-0.5px" }}>
            {q.title || "Your Travel Package"}
          </h1>
          <p className="qu0" style={{ fontSize:12, color:"rgba(255,255,255,0.38)", margin:"0 0 16px" }}>
            Crafted exclusively for {c.name || "you"}
          </p>
          {/* Chips */}
          <div className="qu1" style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:24 }}>
            {q.quoteNo && <span style={{ background:"rgba(255,255,255,0.12)", border:"1px solid rgba(255,255,255,0.2)", borderRadius:100, padding:"3px 11px", fontSize:9, fontWeight:600, color:"rgba(255,255,255,0.7)" }}>#{q.quoteNo}</span>}
            {q.version && <span style={{ background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:100, padding:"3px 11px", fontSize:9, fontWeight:600, color:"rgba(255,255,255,0.55)" }}>{q.version}</span>}
            {q.quotationStage && <span style={{ background:"rgba(0,230,118,0.15)", border:"1px solid rgba(0,230,118,0.35)", borderRadius:100, padding:"3px 11px", fontSize:9, fontWeight:700, color:"#00e676" }}>{q.quotationStage}</span>}
          </div>
          {/* Stats strip */}
          <div className="qu2" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(100px,1fr))", background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.1)", borderBottom:"none", borderRadius:"14px 14px 0 0", overflow:"hidden" }}>
            {[
              { label:"Client",      val: c.name||"—" },
              { label:"Destination", val: c.destination||"—" },
              { label:"Travel Date", val: fmtDate(c.travelDate) },
              { label:"Travellers",  val:`${c.adults||0}A${c.children?` · ${c.children}C`:""}${c.infants?` · ${c.infants}I`:""}` },
              { label:"Duration",    val:`${q.nights??"—"}N / ${q.days??"—"}D` },
            ].map((s, i, arr) => (
              <div key={i} style={{ padding:"12px 14px", borderRight:i<arr.length-1?"1px solid rgba(255,255,255,0.07)":"none" }}>
                <p style={{ fontSize:7, fontWeight:700, color:"rgba(255,255,255,0.3)", textTransform:"uppercase", letterSpacing:".1em", margin:"0 0 3px" }}>{s.label}</p>
                <p style={{ fontSize:11, fontWeight:600, color:"#fff", margin:0, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{s.val}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ━━━ ACTION BAR ━━━ */}
      <div style={{ maxWidth:880, margin:"0 auto", padding:"0 20px" }}>
        <div style={{ background:"#fff", border:"1px solid #e2e8f0", borderTop:"none", borderRadius:"0 0 16px 16px", padding:"11px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:12 }}>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <span style={{ width:6, height:6, borderRadius:"50%", background:"#22c55e" }} />
            <span style={{ fontSize:10, color:"#64748b", fontWeight:500 }}>Valid quotation · Generated {fmtDate(q.createdAt)}</span>
          </div>
          <a href={pdfUrl} target="_blank" rel="noreferrer" style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"7px 16px", borderRadius:9, background:"linear-gradient(135deg,#1a237e,#4a148c)", color:"#fff", fontSize:11, fontWeight:700, textDecoration:"none" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Download PDF
          </a>
        </div>
      </div>

      {/* ━━━ SECTIONS ━━━ */}
      <div style={{ maxWidth:880, margin:"0 auto", padding:"16px 20px 48px", display:"flex", flexDirection:"column", gap:14 }}>

        {/* FLIGHTS — Blue */}
        {q.flight?.included && q.flight?.segments?.length > 0 && (
          <div className="qu1">
            <GCard title={q.flight.title||"Flights"} sub={`${q.flight.segments.length} segment(s)`} amount={q.flight.amount} icon="✈" grad="linear-gradient(135deg,#1565c0,#1e88e5,#29b6f6)">
              {q.flight.segments.map((s, i) => (
                <RItem key={i} bg="#e3f2fd" border="#90caf9">
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:12 }}>
                    <div>
                      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                        <span style={{ fontSize:15, fontWeight:800, color:"#0d47a1" }}>{s.from}</span>
                        <svg width="28" height="10" viewBox="0 0 36 10"><path d="M1 5h34M25 1l7 4-7 4" stroke="#42a5f5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        <span style={{ fontSize:15, fontWeight:800, color:"#0d47a1" }}>{s.to}</span>
                      </div>
                      <p style={{ fontSize:10, color:"#546e7a", margin:0 }}>{s.airline}{s.flightNo?` ${s.flightNo}`:""}{s.class?` · ${s.class}`:""}</p>
                    </div>
                    <div style={{ textAlign:"right", flexShrink:0 }}>
                      <p style={{ fontSize:11, fontWeight:700, color:"#1565c0", margin:"0 0 2px" }}>{fmtDate(s.depDate)}</p>
                      <p style={{ fontSize:10, color:"#90a4ae", margin:0 }}>{s.depTime||""}{s.duration?` · ${s.duration}`:""}</p>
                    </div>
                  </div>
                </RItem>
              ))}
            </GCard>
          </div>
        )}

        {/* HOTELS — Purple */}
        {q.hotel?.included && q.hotel?.hotels?.length > 0 && (
          <div className="qu2">
            <GCard title={q.hotel.title||"Hotels"} sub={`${q.hotel.hotels.length} property(s)`} amount={q.hotel.amount} icon="🏨" grad="linear-gradient(135deg,#4a148c,#7b1fa2,#ab47bc)">
              {q.hotel.hotels.map((h, i) => (
                <RItem key={i} bg="#f3e5f5" border="#ce93d8">
                  <div style={{ display:"flex", gap:10 }}>
                    {h.imageUrl
                      ? <img src={h.imageUrl} alt="" style={{ width:52, height:52, borderRadius:9, objectFit:"cover", flexShrink:0, border:"2px solid #e1bee7" }} />
                      : <div style={{ width:52, height:52, borderRadius:9, background:"linear-gradient(135deg,#e1bee7,#ce93d8)", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>🏨</div>
                    }
                    <div style={{ minWidth:0, flex:1 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:6, flexWrap:"wrap", marginBottom:3 }}>
                        <span style={{ fontSize:13, fontWeight:800, color:"#4a148c" }}>{h.name}</span>
                        {h.stars && <span style={{ fontSize:11, color:"#f59e0b" }}>{"★".repeat(h.stars)}</span>}
                      </div>
                      <p style={{ fontSize:10, color:"#7b1fa2", fontWeight:600, margin:"0 0 2px" }}>{[h.city,h.roomType,h.mealPlan].filter(Boolean).join(" · ")}</p>
                      <p style={{ fontSize:10, color:"#78909c", margin:0 }}>{fmtDate(h.checkIn)} → {fmtDate(h.checkOut)}{h.rooms?` · ${h.rooms} room(s)`:""}</p>
                    </div>
                  </div>
                </RItem>
              ))}
            </GCard>
          </div>
        )}

        {/* SIGHTSEEING — Green */}
        {q.sightseeing?.included && q.sightseeing?.days?.length > 0 && (
          <div className="qu3">
            <GCard title={q.sightseeing.title||"Sightseeing"} sub={`${q.sightseeing.days.length} day(s)`} amount={q.sightseeing.amount} icon="🗺️" grad="linear-gradient(135deg,#1b5e20,#2e7d32,#43a047)">
              {q.sightseeing.days.map((d, i) => (
                <RItem key={i} bg="#e8f5e9" border="#a5d6a7">
                  <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:8 }}>
                    <div style={{ width:22, height:22, borderRadius:6, background:"#2e7d32", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, color:"#fff", flexShrink:0 }}>{d.day}</div>
                    <span style={{ fontSize:11, fontWeight:700, color:"#1b5e20" }}>Day {d.day}{d.date?` · ${fmtDate(d.date)}`:""}</span>
                  </div>
                  {(d.activities||[]).map((a, j) => (
                    <div key={j} style={{ display:"flex", gap:6, alignItems:"flex-start", marginBottom:4 }}>
                      <span style={{ width:4, height:4, borderRadius:"50%", background:"#43a047", flexShrink:0, marginTop:5 }} />
                      <span style={{ fontSize:10, color:"#1b5e20", lineHeight:1.5 }}>{a.attraction}{a.startTime?` · ${a.startTime}`:""}</span>
                    </div>
                  ))}
                </RItem>
              ))}
            </GCard>
          </div>
        )}

        {/* CRUISE — Cyan */}
        {q.cruise?.included && q.cruise?.cruises?.length > 0 && (
          <div className="qu4">
            <GCard title={q.cruise.title||"Cruise"} sub={`${q.cruise.cruises.length} cruise(s)`} amount={q.cruise.amount} icon="🚢" grad="linear-gradient(135deg,#006064,#00838f,#26c6da)">
              {q.cruise.cruises.map((cr, i) => (
                <RItem key={i} bg="#e0f7fa" border="#80deea">
                  <p style={{ fontSize:12, fontWeight:800, color:"#006064", margin:"0 0 3px" }}>{cr.name}{cr.type?` · ${cr.type}`:""}</p>
                  <p style={{ fontSize:10, color:"#00838f", margin:0 }}>{cr.depPort} → {cr.arrPort} · {fmtDate(cr.depDate)}{cr.nights?` · ${cr.nights}N`:""}{cr.cabin?` · ${cr.cabin}`:""}</p>
                </RItem>
              ))}
            </GCard>
          </div>
        )}

        {/* TRANSPORT — Orange */}
        {q.vehicle?.included && q.vehicle?.vehicles?.length > 0 && (
          <div className="qu4">
            <GCard title={q.vehicle.title||"Transport"} sub={`${q.vehicle.vehicles.length} vehicle(s)`} amount={q.vehicle.amount} icon="🚗" grad="linear-gradient(135deg,#e65100,#f57c00,#ffa726)">
              {q.vehicle.vehicles.map((v, i) => (
                <RItem key={i} bg="#fff3e0" border="#ffcc80">
                  <p style={{ fontSize:12, fontWeight:800, color:"#e65100", margin:"0 0 3px" }}>{v.type}</p>
                  <p style={{ fontSize:10, color:"#f57c00", margin:0 }}>{[v.pickup,v.drop].filter(Boolean).join(" → ")}{v.startDate?` · ${fmtDate(v.startDate)}`:""}{v.qty?` · Qty ${v.qty}`:""}</p>
                </RItem>
              ))}
            </GCard>
          </div>
        )}

        {/* ADD-ONS — Pink */}
        {q.addons?.included && q.addons?.items?.length > 0 && (
          <div className="qu5">
            <GCard title={q.addons.title||"Add-on Services"} sub={`${q.addons.items.length} service(s)`} amount={q.addons.amount} icon="✨" grad="linear-gradient(135deg,#880e4f,#c2185b,#ec407a)">
              {q.addons.items.map((a, i) => (
                <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0", borderBottom:i<q.addons.items.length-1?"1px solid rgba(0,0,0,0.05)":"none" }}>
                  <span style={{ fontSize:11, color:"#475569" }}>{a.serviceType}{a.quantity?` × ${a.quantity}`:""}</span>
                  <span style={{ fontSize:11, fontWeight:700, color:"#880e4f" }}>{inr(a.pricePerUnit)}</span>
                </div>
              ))}
            </GCard>
          </div>
        )}

        {/* INCLUSIONS / EXCLUSIONS */}
        {(q.inclusions?.length > 0 || q.exclusions?.length > 0) && (
          <div className="qu5" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:12 }}>
            {q.inclusions?.length > 0 && <ListBox title="Inclusions" items={q.inclusions} tone="green" />}
            {q.exclusions?.length > 0 && <ListBox title="Exclusions" items={q.exclusions} tone="red" />}
          </div>
        )}

        {/* PRICE SUMMARY */}
        {q.totals && (
          <div className="qu6" style={{ borderRadius:18, overflow:"hidden" }}>
            {/* Dark gradient header */}
            <div style={{ background:"linear-gradient(135deg,#0a0f2e,#1a237e,#4a148c)", padding:"20px 20px 16px", position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", top:-50, right:-50, width:160, height:160, borderRadius:"50%", border:"1px solid rgba(255,255,255,0.05)" }} />
              <p style={{ fontSize:8, fontWeight:700, color:"rgba(255,255,255,0.3)", textTransform:"uppercase", letterSpacing:".14em", margin:"0 0 12px" }}>Price Breakdown</p>
              <PRow label="Flights"     val={inr(q.totals.flightAmount)}      />
              <PRow label="Hotels"      val={inr(q.totals.hotelAmount)}       />
              <PRow label="Sightseeing" val={inr(q.totals.sightseeingAmount)} />
              {q.totals.cruiseAmount  > 0 && <PRow label="Cruise"    val={inr(q.totals.cruiseAmount)}    />}
              {q.totals.vehicleAmount > 0 && <PRow label="Transport" val={inr(q.totals.vehicleAmount)}   />}
              {q.totals.addonAmount   > 0 && <PRow label="Add-ons"   val={inr(q.totals.addonAmount)}    />}
              <div style={{ height:1, background:"rgba(255,255,255,0.1)", margin:"8px 0" }} />
              <PRow label="Subtotal" val={inr(q.totals.subtotal)} />
              {q.totals.discountAmount > 0 && <PRow label="Discount" val={`− ${inr(q.totals.discountAmount)}`} green />}
              {q.totals.markup        > 0 && <PRow label="Markup"   val={inr(q.totals.markup)} />}
              {q.totals.taxAmount     > 0 && <PRow label={`Tax (${q.totals.taxPercent||0}%)`} val={inr(q.totals.taxAmount)} />}
            </div>
            {/* White footer */}
            <div style={{ background:"#fff", padding:"16px 20px" }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <div>
                  <p style={{ fontSize:10, color:"#64748b", margin:"0 0 2px", fontWeight:600 }}>Grand Total</p>
                  {q.totals.perAdult != null && <p style={{ fontSize:9, color:"#94a3b8", margin:0 }}>{inr(q.totals.perAdult)} per adult</p>}
                </div>
                <span style={{ fontSize:"clamp(24px,4vw,34px)", fontWeight:900, color:"#0a0f2e", letterSpacing:"-1px" }}>{inr(q.totals.grandTotal)}</span>
              </div>
              {/* Rainbow bar */}
              <div style={{ height:4, borderRadius:100, background:"linear-gradient(90deg,#1565c0,#7b1fa2,#c2185b,#f57c00,#43a047)", marginTop:14, opacity:.9 }} />
            </div>
          </div>
        )}

        {/* PAYMENT POLICY — Blue tint */}
        {q.paymentPolicies?.length > 0 && (
          <div className="qu7">
            <PolCard title="Payment Policy" items={q.paymentPolicies} bg="linear-gradient(135deg,#e3f2fd,#ede7f6)" border="#90caf9" titleColor="#1565c0" numColor="#1e88e5" txtColor="#1a237e" />
          </div>
        )}

        {/* CANCELLATION POLICY — Amber tint */}
        {q.cancellationPolicies?.length > 0 && (
          <div className="qu7">
            <PolCard title="Cancellation Policy" items={q.cancellationPolicies} bg="linear-gradient(135deg,#fff8e1,#fff3e0)" border="#ffcc80" titleColor="#e65100" numColor="#f57c00" txtColor="#bf360c" />
          </div>
        )}

        {/* BOOKING TERMS — Green tint */}
        {q.bookingTerms?.length > 0 && (
          <div className="qu8">
            <PolCard title="Booking Terms" items={q.bookingTerms} bg="linear-gradient(135deg,#e8f5e9,#f3e5f5)" border="#a5d6a7" titleColor="#1b5e20" numColor="#43a047" txtColor="#2e7d32" />
          </div>
        )}

        {/* NOTES */}
        {q.notes && (
          <div className="qu8" style={{ background:"#fff", border:"1px solid #e2e8f0", borderRadius:16, padding:"16px 18px" }}>
            <p style={{ fontSize:9, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:".1em", margin:"0 0 10px" }}>Notes</p>
            <p style={{ fontSize:13, color:"#334155", lineHeight:1.8, margin:0, whiteSpace:"pre-line" }}>{q.notes}</p>
          </div>
        )}

        {/* FOOTER */}
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6, paddingTop:8 }}>
          <div style={{ height:1, width:32, background:"#e2e8f0", borderRadius:1 }} />
          <p style={{ fontSize:10, color:"#94a3b8", margin:0 }}>Copyright © Travelcrm. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

/* ━━━ PUBLIC ROUTE ━━━ */
export function PublicQuotationPage() {
  const { publicId } = useParams();
  return <div className="min-h-screen"><QuotationWebView publicId={publicId} /></div>;
}

/* ━━━ LEGACY ALIASES — backward compatibility ━━━ */
function Info({ label, value }) {
  return (
    <div>
      <p style={{ fontSize:8, color:"rgba(255,255,255,0.35)", fontWeight:700, textTransform:"uppercase", letterSpacing:".1em", margin:"0 0 2px" }}>{label}</p>
      <p style={{ fontSize:12, fontWeight:700, color:"#fff", margin:0 }}>{value||"—"}</p>
    </div>
  );
}
function Row({ label, value }) { return <PRow label={label} val={value} />; }
function Section({ title, amount, children }) {
  return (
    <GCard title={title} amount={amount} icon="•" grad="linear-gradient(135deg,#1565c0,#1e88e5)">
      {children}
    </GCard>
  );
}
function ListCard({ title, items, tone }) {
  return tone
    ? <ListBox title={title} items={items} tone={tone} />
    : <PolCard title={title} items={items} bg="#f8fafc" border="#e2e8f0" titleColor="#64748b" numColor="#94a3b8" txtColor="#475569" />;
}