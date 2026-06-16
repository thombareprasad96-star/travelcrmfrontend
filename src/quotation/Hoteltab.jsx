import React, { useState } from "react";
import { Hotel, Search, Info, Plus } from "lucide-react";
import { Label, Input, Select, SectionCard, RemoveBtn, IncludeToggle, AIBanner, FieldGrid, RichText } from "./ui";
import { ROOM_TYPES, MEAL_PLANS } from "./constants";

export default function HotelTab({ onDataChange }) {
  const [included, setIncluded] = useState(true);
  const [title,    setTitle]    = useState("Hotel Details");
  const [amount,   setAmount]   = useState("");
  const [notes,    setNotes]    = useState("");
  const [hotels,   setHotels]   = useState([newHotel()]);

  function newHotel() {
    return { id: Date.now() + Math.random(), name: "", city: "", checkIn: "", checkOut: "", roomType: "", mealPlan: "", refundable: true };
  }

  const addHotel    = () => setHotels(p => [...p, newHotel()]);
  const removeHotel = (id) => setHotels(p => p.filter(h => h.id !== id));
  const updateHotel = (id, k, v) => setHotels(p => p.map(h => h.id === id ? { ...h, [k]: v } : h));

  return (
    <div className="space-y-5">
      <SectionCard title="Hotel Settings" icon={Hotel}>
        <div className="space-y-5">
          <IncludeToggle included={included} onChange={() => setIncluded(p => !p)} label="Include Hotels in Quotation" />
          {included && (
            <>
              <AIBanner text="AI can suggest hotels based on destination, budget, and traveler preferences." />
              <FieldGrid cols={2}>
                <div><Label>Section Title</Label><Input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Hotel Details" /></div>
                <div><Label>Amount (₹)</Label><Input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" /></div>
              </FieldGrid>
              <div>
                <Label>Hotel Notes</Label>
                <RichText value={notes} onChange={setNotes} placeholder="Add notes about hotel selection, policies, etc." rows={4} />
              </div>
            </>
          )}
        </div>
      </SectionCard>

      {included && hotels.map((h, hi) => (
        <SectionCard key={h.id}
          title={hi === 0 ? "Default Hotel Option" : `Hotel Option ${hi + 1}`}
          icon={Hotel}
          headerRight={
            <div className="flex items-center gap-2">
              <span
                className={`text-[11px] font-bold px-2.5 py-1 rounded-full border cursor-pointer transition-all
                  ${h.refundable ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-rose-50 text-rose-600 border-rose-200"}`}
                onClick={() => updateHotel(h.id, "refundable", !h.refundable)}>
                {h.refundable ? "Refundable" : "Non-Refundable"}
              </span>
              {hotels.length > 1 && <RemoveBtn onClick={() => removeHotel(h.id)} />}
            </div>
          }>
          <div className="space-y-4">
            <FieldGrid cols={2}>
              <div>
                <Label required>Hotel Name</Label>
                <div className="relative">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <Input className="pl-9" value={h.name} onChange={e => updateHotel(h.id, "name", e.target.value)} placeholder="Search hotel name..." />
                </div>
              </div>
              <div><Label required>City</Label><Input value={h.city} onChange={e => updateHotel(h.id, "city", e.target.value)} placeholder="e.g. Kathmandu" /></div>
            </FieldGrid>
            <FieldGrid cols={4}>
              <div><Label required>Check-In</Label><Input type="date" value={h.checkIn} onChange={e => updateHotel(h.id, "checkIn", e.target.value)} /></div>
              <div><Label required>Check-Out</Label><Input type="date" value={h.checkOut} onChange={e => updateHotel(h.id, "checkOut", e.target.value)} /></div>
              <div><Label>Room Type</Label><Select options={ROOM_TYPES} value={h.roomType} onChange={e => updateHotel(h.id, "roomType", e.target.value)} placeholder="Select room" /></div>
              <div><Label>Meal Plan</Label><Select options={MEAL_PLANS} value={h.mealPlan} onChange={e => updateHotel(h.id, "mealPlan", e.target.value)} placeholder="Select plan" /></div>
            </FieldGrid>
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-xs text-blue-700 font-medium flex items-center gap-2">
              <Info size={13} /> Nights will be auto-calculated from Check-In and Check-Out dates.
            </div>
          </div>
        </SectionCard>
      ))}

      {included && (
        <button onClick={addHotel} type="button"
          className="w-full py-3 border-2 border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50/40 text-slate-500 hover:text-blue-600 text-sm font-bold rounded-2xl transition-all flex items-center justify-center gap-2">
          <Plus size={16} strokeWidth={2.5} /> Add Hotel Option
        </button>
      )}
    </div>
  );
}