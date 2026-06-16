import React, { useState } from "react";
import { Anchor, Plus } from "lucide-react";
import { Label, Input, Select, SectionCard, RemoveBtn, IncludeToggle, EmptyState, FieldGrid } from "./ui";
import { CRUISE_TYPES, CABIN_CATS } from "./constants";

export default function CruiseTab({ onDataChange }) {
  const [included, setIncluded] = useState(false);
  const [title,    setTitle]    = useState("Cruise Details");
  const [amount,   setAmount]   = useState("");
  const [cruises,  setCruises]  = useState([newCruise()]);

  function newCruise() {
    return { id: Date.now() + Math.random(), name: "", type: "", depPort: "", arrPort: "", depDate: "", nights: "", cabin: "", price: "" };
  }

  const add    = () => setCruises(p => [...p, newCruise()]);
  const remove = (id) => setCruises(p => p.filter(c => c.id !== id));
  const update = (id, k, v) => setCruises(p => p.map(c => c.id === id ? { ...c, [k]: v } : c));

  return (
    <div className="space-y-5">
      <SectionCard title="Cruise Settings" icon={Anchor}>
        <div className="space-y-5">
          <IncludeToggle included={included} onChange={() => setIncluded(p => !p)} label="Include Cruise in Quotation" />
          {included && (
            <FieldGrid cols={2}>
              <div><Label>Section Title</Label><Input value={title} onChange={e => setTitle(e.target.value)} /></div>
              <div><Label>Amount (₹)</Label><Input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" /></div>
            </FieldGrid>
          )}
        </div>
      </SectionCard>

      {included ? (
        <>
          {cruises.map((c, ci) => (
            <SectionCard key={c.id} title={`Cruise ${ci + 1}`} icon={Anchor}
              headerRight={cruises.length > 1 && <RemoveBtn onClick={() => remove(c.id)} />}>
              <div className="space-y-4">
                <FieldGrid cols={2}>
                  <div><Label required>Cruise Name</Label><Input value={c.name} onChange={e => update(c.id, "name", e.target.value)} placeholder="e.g. Royal Caribbean Explorer" /></div>
                  <div><Label>Cruise Type</Label><Select options={CRUISE_TYPES} value={c.type} onChange={e => update(c.id, "type", e.target.value)} /></div>
                </FieldGrid>
                <FieldGrid cols={2}>
                  <div><Label>Departure Port</Label><Input value={c.depPort} onChange={e => update(c.id, "depPort", e.target.value)} placeholder="e.g. Mumbai" /></div>
                  <div><Label>Arrival Port</Label><Input value={c.arrPort} onChange={e => update(c.id, "arrPort", e.target.value)} placeholder="e.g. Goa" /></div>
                </FieldGrid>
                <FieldGrid cols={3}>
                  <div><Label>Departure Date</Label><Input type="date" value={c.depDate} onChange={e => update(c.id, "depDate", e.target.value)} /></div>
                  <div><Label>Nights</Label><Input type="number" value={c.nights} onChange={e => update(c.id, "nights", e.target.value)} placeholder="e.g. 5" /></div>
                  <div><Label>Cabin Category</Label><Select options={CABIN_CATS} value={c.cabin} onChange={e => update(c.id, "cabin", e.target.value)} /></div>
                </FieldGrid>
                <div className="max-w-xs"><Label>Price (₹)</Label><Input type="number" value={c.price} onChange={e => update(c.id, "price", e.target.value)} placeholder="0.00" /></div>
              </div>
            </SectionCard>
          ))}
          <button onClick={add} type="button"
            className="w-full py-3 border-2 border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50/40 text-slate-500 hover:text-blue-600 text-sm font-bold rounded-2xl transition-all flex items-center justify-center gap-2">
            <Plus size={16} strokeWidth={2.5} /> Add Cruise
          </button>
        </>
      ) : (
        <EmptyState icon={Anchor} title="No Cruise Added" desc="Enable cruise above to add cruise details." />
      )}
    </div>
  );
}