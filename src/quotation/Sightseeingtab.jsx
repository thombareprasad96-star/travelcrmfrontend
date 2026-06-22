import React, { useState, useEffect } from "react";
import { Map, Sun, Coffee, Utensils, Moon, Plus, IndianRupee } from "lucide-react";
import { Label, Input, Select, Textarea, SectionCard, AddBtn, RemoveBtn, IncludeToggle, AIBanner, FieldGrid, RichText } from "./ui";
import { ATTRACTIONS, MEALS_OPT, TRANSFER } from "../quotation/constants";

export default function SightseeingTab({ onDataChange }) {
  const [included, setIncluded] = useState(true);
  const [title,    setTitle]    = useState("Sightseeing");
  const [notes,    setNotes]    = useState("");
  const [days,     setDays]     = useState([newDay(1)]);

  function newDay(num) {
    return { id: Date.now() + Math.random(), day: num, date: "", pricePerPax: 0, pax: 1, activities: [newActivity()] };
  }
  function newActivity() {
    return { id: Date.now() + Math.random(), attraction: "", startTime: "", description: "", meals: [], transfer: "Private" };
  }

  // ── Auto price ────────────────────────────────────────────
  const dayTotals       = days.map(d => Number(d.pricePerPax) * Number(d.pax) || 0);
  const sightseeingTotal = dayTotals.reduce((a, b) => a + b, 0);

  // ── Parent ko data do ─────────────────────────────────────
  useEffect(() => {
    onDataChange?.({ included, title, notes, days, amount: sightseeingTotal });
  }, [included, title, notes, days, sightseeingTotal]);

  // ── Helpers ───────────────────────────────────────────────
  const addDay    = () => setDays(p => [...p, newDay(p.length + 1)]);
  const removeDay = (id) => setDays(p => p.filter(d => d.id !== id));
  const updateDay = (id, k, v) => setDays(p => p.map(d => d.id === id ? { ...d, [k]: v } : d));
  const addAct    = (did) => setDays(p => p.map(d => d.id === did ? { ...d, activities: [...d.activities, newActivity()] } : d));
  const removeAct = (did, aid) => setDays(p => p.map(d => d.id === did ? { ...d, activities: d.activities.filter(a => a.id !== aid) } : d));
  const updateAct = (did, aid, k, v) => setDays(p => p.map(d => d.id === did ? {
    ...d, activities: d.activities.map(a => a.id === aid ? { ...a, [k]: v } : a)
  } : d));
  const toggleMeal = (did, aid, meal) => {
    const act = days.find(d => d.id === did)?.activities.find(a => a.id === aid);
    if (!act) return;
    const meals = act.meals.includes(meal) ? act.meals.filter(m => m !== meal) : [...act.meals, meal];
    updateAct(did, aid, "meals", meals);
  };

  return (
    <div className="space-y-5">

      <SectionCard title="Sightseeing Settings" icon={Map}>
        <div className="space-y-4">
          <IncludeToggle included={included} onChange={() => setIncluded(p => !p)} label="Include Sightseeing in Quotation" />
          {included && (
            <>
              {/* <AIBanner text="AI can generate day-wise itinerary based on destination and trip duration." /> */}
              <div><Label>Section Title</Label><Input value={title} onChange={e => setTitle(e.target.value)} /></div>
              <div><Label>Sightseeing Notes</Label><RichText value={notes} onChange={setNotes} placeholder="General notes..." rows={3} /></div>
            </>
          )}
        </div>
      </SectionCard>

      {included && days.map((day, di) => (
        <SectionCard key={day.id} title={`Day ${day.day}`} icon={Sun} iconColor="text-amber-600"
          headerRight={
            <div className="flex items-center gap-2">
              <Input type="date" value={day.date} onChange={e => updateDay(day.id, "date", e.target.value)} className="w-36 text-xs py-1.5" />
              {days.length > 1 && <RemoveBtn onClick={() => removeDay(day.id)} />}
            </div>
          }>
          <div className="space-y-4">

            {/* ── Price Box per Day ── */}
            <div className="grid grid-cols-3 gap-3 p-3 rounded-2xl bg-amber-50 border border-amber-100">
              <div>
                <Label>Price / Pax (₹)</Label>
                <Input type="number" min={0} value={day.pricePerPax}
                  onChange={e => updateDay(day.id, "pricePerPax", e.target.value)} placeholder="0" />
              </div>
              <div>
                <Label>No. of Pax</Label>
                <Input type="number" min={1} value={day.pax}
                  onChange={e => updateDay(day.id, "pax", e.target.value)} placeholder="1" />
              </div>
              <div>
                <Label>Day Total</Label>
                <div className="h-10 flex items-center justify-center bg-amber-600 rounded-xl text-sm font-extrabold text-white">
                  ₹{dayTotals[di].toLocaleString("en-IN")}
                </div>
              </div>
            </div>

            {/* ── Activities ── */}
            {day.activities.map((act, ai) => (
              <div key={act.id} className={ai > 0 ? "pt-4 border-t border-slate-100" : ""}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Activity {ai + 1}</span>
                  {day.activities.length > 1 && <RemoveBtn onClick={() => removeAct(day.id, act.id)} />}
                </div>
                <FieldGrid cols={2}>
                  <div><Label>Attraction / Activity</Label><Select options={ATTRACTIONS} value={act.attraction} onChange={e => updateAct(day.id, act.id, "attraction", e.target.value)} placeholder="Select activity" /></div>
                  <div><Label>Start Time</Label><Input type="time" value={act.startTime} onChange={e => updateAct(day.id, act.id, "startTime", e.target.value)} /></div>
                </FieldGrid>
                <div className="mt-3"><Label>Description</Label>
                  <Textarea value={act.description} onChange={e => updateAct(day.id, act.id, "description", e.target.value)} rows={2} placeholder="Describe this activity..." />
                </div>
                <div className="mt-3 grid grid-cols-2 gap-4">
                  <div>
                    <Label>Meals Included</Label>
                    <div className="flex gap-2 mt-1.5 flex-wrap">
                      {MEALS_OPT.map(m => (
                        <button key={m} type="button" onClick={() => toggleMeal(day.id, act.id, m)}
                          className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all flex items-center gap-1.5
                            ${act.meals.includes(m) ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-slate-200 text-slate-600 hover:border-blue-300"}`}>
                          {m === "Breakfast" && <Coffee size={11} />}{m === "Lunch" && <Utensils size={11} />}{m === "Dinner" && <Moon size={11} />}{m}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label>Daily Transfer</Label>
                    <div className="flex gap-2 mt-1.5 flex-wrap">
                      {TRANSFER.map(t => (
                        <button key={t} type="button" onClick={() => updateAct(day.id, act.id, "transfer", t)}
                          className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all
                            ${act.transfer === t ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-slate-200 text-slate-600 hover:border-blue-300"}`}>{t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className="pt-3 border-t border-slate-100">
              <AddBtn onClick={() => addAct(day.id)} label="Add Activity" />
            </div>
          </div>
        </SectionCard>
      ))}

      {included && (
        <>
          <button onClick={addDay} type="button"
            className="w-full py-3 border-2 border-dashed border-slate-300 hover:border-amber-400 hover:bg-amber-50/40 text-slate-500 hover:text-amber-600 text-sm font-bold rounded-2xl transition-all flex items-center justify-center gap-2">
            <Plus size={16} strokeWidth={2.5} /> Add Day
          </button>
          <div className="flex items-center justify-between p-4 rounded-2xl"
            style={{ background: "linear-gradient(135deg,#D97706,#92400E)" }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <IndianRupee size={18} className="text-white" />
              </div>
              <div>
                <p className="text-[10px] text-amber-200 font-semibold uppercase tracking-wider">Sightseeing Total</p>
                <p className="text-[11px] text-amber-300">{days.length} day{days.length > 1 ? "s" : ""}</p>
              </div>
            </div>
            <p className="text-2xl font-extrabold text-white">₹{sightseeingTotal.toLocaleString("en-IN")}</p>
          </div>
        </>
      )}
    </div>
  );
}