import React, { useState, useRef, useEffect } from "react";
import {
  Plus, X, ChevronDown, ChevronUp, Search, Check,
  Plane, Hotel, Eye, Map, Ship, Car, Package,
  List, BarChart2, Clock, Bell, User, Home,
  ChevronRight, Save, AlertCircle, Trash2, Upload,
  ToggleLeft, ToggleRight, ArrowRight, Info, Star,
  Briefcase, Coffee, Sunset, Moon, Sun, Utensils,
  CheckCircle, XCircle, Edit3, FileText, DollarSign,
  Percent, Tag, ShoppingBag, Navigation, Anchor,
  Calendar, MapPin, Users, Phone, Mail, IndianRupee
} from "lucide-react";

/* ─── CONSTANTS ──────────────────────────────────────── */
const TABS = [
  { id: "flight",      label: "Flight",                  icon: Plane },
  { id: "hotel",       label: "Hotel",                   icon: Hotel },
  { id: "sightseeing", label: "Sightseeing",             icon: Map },
  { id: "cruise",      label: "Cruise",                  icon: Anchor },
  { id: "vehicle",     label: "Vehicle",                 icon: Car },
  { id: "addons",      label: "Add-on Services",         icon: Package },
  { id: "inclusions",  label: "Inclusions & Exclusions", icon: List },
  { id: "summary",     label: "Summary & Pricing",       icon: BarChart2 },
];

const AIRLINES = ["IndiGo", "Air India", "SpiceJet", "Vistara", "GoAir", "AirAsia India", "Emirates", "Qatar Airways", "Singapore Airlines"];
const CLASSES  = ["Economy", "Premium Economy", "Business", "First Class"];
const AIRPORTS = ["Delhi (DEL)", "Mumbai (BOM)", "Bangalore (BLR)", "Chennai (MAA)", "Kathmandu (KTM)", "Dubai (DXB)", "Singapore (SIN)", "Bangkok (BKK)"];
const JOURNEY_TYPES = ["One Way", "Round Trip", "Multi City"];
const ROOM_TYPES = ["Standard", "Deluxe", "Suite", "Family Room", "Studio", "Connecting Room"];
const MEAL_PLANS = ["Room Only", "Bed & Breakfast", "Half Board", "Full Board", "All Inclusive"];
const VEHICLE_TYPES = ["Sedan", "SUV", "Tempo Traveller", "Bus", "Luxury Car", "Mini Van"];
const CRUISE_TYPES  = ["River Cruise", "Ocean Cruise", "Luxury Cruise", "Budget Cruise"];
const CABIN_CATS    = ["Interior", "Oceanview", "Balcony", "Suite"];

/* ─── REUSABLE UI PRIMITIVES ─────────────────────────── */
function Label({ children, required }) {
  return (
    <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">
      {children}{required && <span className="text-rose-500 ml-1">*</span>}
    </label>
  );
}

function Input({ className = "", ...props }) {
  return (
    <input
      className={`w-full px-3 py-2.5 text-sm text-slate-800 bg-white border border-slate-200 rounded-xl
        focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all
        placeholder-slate-400 disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed ${className}`}
      {...props}
    />
  );
}

function Select({ options = [], placeholder = "Select...", className = "", ...props }) {
  return (
    <div className="relative">
      <select
        className={`w-full px-3 py-2.5 text-sm text-slate-800 bg-white border border-slate-200 rounded-xl
          focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all
          appearance-none cursor-pointer disabled:bg-slate-50 disabled:text-slate-400 ${className}`}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
    </div>
  );
}

function Textarea({ className = "", ...props }) {
  return (
    <textarea
      className={`w-full px-3 py-2.5 text-sm text-slate-800 bg-white border border-slate-200 rounded-xl
        focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all
        placeholder-slate-400 resize-none ${className}`}
      {...props}
    />
  );
}

function SectionCard({ title, icon: Icon, iconColor = "text-blue-600", children, headerRight }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2.5">
          {Icon && <div className={`w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center ${iconColor}`}><Icon size={15} /></div>}
          <h3 className="text-sm font-bold text-slate-800">{title}</h3>
        </div>
        {headerRight}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function AddBtn({ onClick, label = "Add" }) {
  return (
    <button onClick={onClick} type="button"
      className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-blue-600 border border-blue-200 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all active:scale-95">
      <Plus size={13} strokeWidth={2.5} /> {label}
    </button>
  );
}

function RemoveBtn({ onClick }) {
  return (
    <button onClick={onClick} type="button"
      className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all">
      <Trash2 size={14} />
    </button>
  );
}

function IncludeToggle({ included, onChange, label }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group">
      <div onClick={onChange}
        className={`w-10 h-5 rounded-full transition-all relative flex-shrink-0
          ${included ? "bg-blue-600" : "bg-slate-300"}`}>
        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all
          ${included ? "left-5" : "left-0.5"}`} />
      </div>
      <span className="text-sm font-semibold text-slate-700">{label}</span>
    </label>
  );
}

function AIBanner({ text = "AI Suggestions available for this section" }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-teal-600 rounded-xl text-white text-sm font-medium mb-5">
      <Star size={16} className="flex-shrink-0" />
      <span>{text}</span>
      <button className="ml-auto text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg font-bold transition-all">Use AI</button>
    </div>
  );
}

function EmptyState({ icon: Icon, title, desc, onAdd, addLabel }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4 -rotate-3">
        <Icon size={26} className="text-slate-400" />
      </div>
      <p className="text-sm font-bold text-slate-600 mb-1">{title}</p>
      <p className="text-xs text-slate-400 mb-4">{desc}</p>
      {onAdd && <AddBtn onClick={onAdd} label={addLabel} />}
    </div>
  );
}

function FieldGrid({ cols = 3, children }) {
  const gridCls = { 2: "grid-cols-1 sm:grid-cols-2", 3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3", 4: "grid-cols-2 lg:grid-cols-4" };
  return <div className={`grid ${gridCls[cols] || gridCls[3]} gap-4`}>{children}</div>;
}

/* ─── RICH TEXT EDITOR (simple) ──────────────────────── */
function RichText({ value, onChange, placeholder, rows = 5 }) {
  const ref = useRef();
  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== value) ref.current.innerHTML = value || "";
  }, []);
  const exec = (cmd) => { document.execCommand(cmd, false, null); ref.current.focus(); };
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
      <div className="flex items-center gap-1 px-3 py-2 bg-slate-50 border-b border-slate-200">
        {[["B","bold"],["I","italic"],["U","underline"]].map(([lbl, cmd]) => (
          <button key={cmd} onMouseDown={e => { e.preventDefault(); exec(cmd); }}
            className="w-7 h-7 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
            style={{ fontStyle: cmd === "italic" ? "italic" : "normal", textDecoration: cmd === "underline" ? "underline" : "none" }}>
            {lbl}
          </button>
        ))}
        <div className="w-px h-4 bg-slate-300 mx-1" />
        <button onMouseDown={e => { e.preventDefault(); exec("insertUnorderedList"); }}
          className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">
          <List size={13} />
        </button>
      </div>
      <div ref={ref} contentEditable suppressContentEditableWarning
        onInput={e => onChange?.(e.currentTarget.innerHTML)}
        className="w-full px-3 py-2.5 text-sm text-slate-700 focus:outline-none"
        style={{ minHeight: `${rows * 24}px` }}
        data-placeholder={placeholder}
      />
    </div>
  );
}

/* ══════════════════════════════════════════════════════ */
/* ─── FLIGHT TAB ─────────────────────────────────────── */
/* ══════════════════════════════════════════════════════ */
function FlightTab() {
  const [included,  setIncluded]  = useState(true);
  const [title,     setTitle]     = useState("Flight Details");
  const [amount,    setAmount]    = useState("");
  const [journey,   setJourney]   = useState("Round Trip");
  const [segments,  setSegments]  = useState([newSegment()]);

  function newSegment() {
    return {
      id: Date.now() + Math.random(),
      airline: "", flightNo: "", class: "", from: "", to: "",
      depDate: "", depTime: "", arrDate: "", arrTime: "",
      duration: "", cabin: "", checkin: "",
      connections: [],
    };
  }
  function newConn() {
    return { id: Date.now() + Math.random(), airline: "", flightNo: "", from: "", to: "", depDate: "", depTime: "", arrDate: "", arrTime: "" };
  }

  const addSeg     = () => setSegments(p => [...p, newSegment()]);
  const removeSeg  = (id) => setSegments(p => p.filter(s => s.id !== id));
  const updateSeg  = (id, k, v) => setSegments(p => p.map(s => s.id === id ? { ...s, [k]: v } : s));
  const addConn    = (id) => setSegments(p => p.map(s => s.id === id ? { ...s, connections: [...s.connections, newConn()] } : s));
  const removeConn = (sid, cid) => setSegments(p => p.map(s => s.id === sid ? { ...s, connections: s.connections.filter(c => c.id !== cid) } : s));
  const updateConn = (sid, cid, k, v) => setSegments(p => p.map(s => s.id === sid ? { ...s, connections: s.connections.map(c => c.id === cid ? { ...c, [k]: v } : c) } : s));

  return (
    <div className="space-y-5">
      {/* Include toggle + basic */}
      <SectionCard title="Flight Settings" icon={Plane}>
        <div className="space-y-5">
          <IncludeToggle included={included} onChange={() => setIncluded(p => !p)} label="Include Flight in Quotation" />
          {included && (
            <>
              <FieldGrid cols={3}>
                <div><Label>Section Title</Label><Input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Flight Details" /></div>
                <div><Label>Amount (₹)</Label><Input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" /></div>
                <div><Label>Journey Type</Label><Select options={JOURNEY_TYPES} value={journey} onChange={e => setJourney(e.target.value)} /></div>
              </FieldGrid>
            </>
          )}
        </div>
      </SectionCard>

      {included && segments.map((seg, si) => (
        <SectionCard key={seg.id} title={`Segment ${si + 1}`} icon={Plane}
          headerRight={
            <div className="flex items-center gap-2">
              {segments.length > 1 && <RemoveBtn onClick={() => removeSeg(seg.id)} />}
            </div>
          }>
          <div className="space-y-4">
            <FieldGrid cols={3}>
              <div><Label required>Airline</Label><Select options={AIRLINES} value={seg.airline} onChange={e => updateSeg(seg.id, "airline", e.target.value)} placeholder="Select airline" /></div>
              <div><Label>Flight No.</Label><Input value={seg.flightNo} onChange={e => updateSeg(seg.id, "flightNo", e.target.value)} placeholder="e.g. 6E 204" /></div>
              <div><Label>Class</Label><Select options={CLASSES} value={seg.class} onChange={e => updateSeg(seg.id, "class", e.target.value)} placeholder="Select class" /></div>
            </FieldGrid>
            <FieldGrid cols={2}>
              <div><Label required>From</Label><Select options={AIRPORTS} value={seg.from} onChange={e => updateSeg(seg.id, "from", e.target.value)} placeholder="Departure airport" /></div>
              <div><Label required>To</Label><Select options={AIRPORTS} value={seg.to} onChange={e => updateSeg(seg.id, "to", e.target.value)} placeholder="Arrival airport" /></div>
            </FieldGrid>
            <FieldGrid cols={4}>
              <div><Label required>Dep. Date</Label><Input type="date" value={seg.depDate} onChange={e => updateSeg(seg.id, "depDate", e.target.value)} /></div>
              <div><Label required>Dep. Time</Label><Input type="time" value={seg.depTime} onChange={e => updateSeg(seg.id, "depTime", e.target.value)} /></div>
              <div><Label>Arr. Date</Label><Input type="date" value={seg.arrDate} onChange={e => updateSeg(seg.id, "arrDate", e.target.value)} /></div>
              <div><Label>Arr. Time</Label><Input type="time" value={seg.arrTime} onChange={e => updateSeg(seg.id, "arrTime", e.target.value)} /></div>
            </FieldGrid>
            <FieldGrid cols={3}>
              <div><Label>Duration</Label><Input value={seg.duration} onChange={e => updateSeg(seg.id, "duration", e.target.value)} placeholder="e.g. 2h 30m" /></div>
              <div><Label>Cabin Luggage (kg)</Label><Input type="number" value={seg.cabin} onChange={e => updateSeg(seg.id, "cabin", e.target.value)} placeholder="7" /></div>
              <div><Label>Check-in Luggage (kg)</Label><Input type="number" value={seg.checkin} onChange={e => updateSeg(seg.id, "checkin", e.target.value)} placeholder="23" /></div>
            </FieldGrid>

            {/* Connections */}
            {seg.connections.map((conn, ci) => (
              <div key={conn.id} className="mt-4 pl-4 border-l-2 border-blue-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wide">Connection {ci + 1}</span>
                  <RemoveBtn onClick={() => removeConn(seg.id, conn.id)} />
                </div>
                <FieldGrid cols={4}>
                  <div><Label>Airline</Label><Select options={AIRLINES} value={conn.airline} onChange={e => updateConn(seg.id, conn.id, "airline", e.target.value)} /></div>
                  <div><Label>Flight No.</Label><Input value={conn.flightNo} onChange={e => updateConn(seg.id, conn.id, "flightNo", e.target.value)} placeholder="e.g. AI 101" /></div>
                  <div><Label>From</Label><Select options={AIRPORTS} value={conn.from} onChange={e => updateConn(seg.id, conn.id, "from", e.target.value)} /></div>
                  <div><Label>To</Label><Select options={AIRPORTS} value={conn.to} onChange={e => updateConn(seg.id, conn.id, "to", e.target.value)} /></div>
                </FieldGrid>
                <FieldGrid cols={4} className="mt-3">
                  <div><Label>Dep. Date</Label><Input type="date" value={conn.depDate} onChange={e => updateConn(seg.id, conn.id, "depDate", e.target.value)} /></div>
                  <div><Label>Dep. Time</Label><Input type="time" value={conn.depTime} onChange={e => updateConn(seg.id, conn.id, "depTime", e.target.value)} /></div>
                  <div><Label>Arr. Date</Label><Input type="date" value={conn.arrDate} onChange={e => updateConn(seg.id, conn.id, "arrDate", e.target.value)} /></div>
                  <div><Label>Arr. Time</Label><Input type="time" value={conn.arrTime} onChange={e => updateConn(seg.id, conn.id, "arrTime", e.target.value)} /></div>
                </FieldGrid>
              </div>
            ))}

            <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
              <AddBtn onClick={() => addConn(seg.id)} label="Add Connection" />
            </div>
          </div>
        </SectionCard>
      ))}

      {included && (
        <button onClick={addSeg} type="button"
          className="w-full py-3 border-2 border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50/40 text-slate-500 hover:text-blue-600 text-sm font-bold rounded-2xl transition-all flex items-center justify-center gap-2">
          <Plus size={16} strokeWidth={2.5} /> Add Flight Segment
        </button>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════ */
/* ─── HOTEL TAB ──────────────────────────────────────── */
/* ══════════════════════════════════════════════════════ */
function HotelTab() {
  const [included, setIncluded] = useState(true);
  const [title,    setTitle]    = useState("Hotel Details");
  const [amount,   setAmount]   = useState("");
  const [notes,    setNotes]    = useState("");
  const [hotels,   setHotels]   = useState([newHotel()]);

  function newHotel() {
    return {
      id: Date.now() + Math.random(),
      name: "", city: "", checkIn: "", checkOut: "",
      roomType: "", mealPlan: "", refundable: true, nights: "",
    };
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
        <SectionCard key={h.id} title={hi === 0 ? "Default Hotel Option" : `Hotel Option ${hi + 1}`} icon={Hotel}
          headerRight={
            <div className="flex items-center gap-2">
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border cursor-pointer transition-all
                ${h.refundable ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-rose-50 text-rose-600 border-rose-200"}`}
                onClick={() => updateHotel(h.id, "refundable", !h.refundable)}>
                {h.refundable ? "Refundable" : "Non-Refundable"}
              </span>
              {hotels.length > 1 && <RemoveBtn onClick={() => removeHotel(h.id)} />}
            </div>
          }>
          <div className="space-y-4">
            <FieldGrid cols={2}>
              <div className="relative">
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

/* ══════════════════════════════════════════════════════ */
/* ─── SIGHTSEEING TAB ────────────────────────────────── */
/* ══════════════════════════════════════════════════════ */
const ATTRACTIONS = ["City Tour", "Museum Visit", "Sunset Cruise", "Jungle Safari", "Temple Walk", "Cable Car Ride", "Boat Tour", "Cultural Show"];
const MEALS_OPT   = ["Breakfast", "Lunch", "Dinner"];
const TRANSFER    = ["Private", "Shared", "No Transfer"];

function SightseeingTab() {
  const [included, setIncluded] = useState(true);
  const [title,    setTitle]    = useState("Sightseeing");
  const [amount,   setAmount]   = useState("");
  const [notes,    setNotes]    = useState("");
  const [days,     setDays]     = useState([newDay(1)]);

  function newDay(num) {
    return {
      id: Date.now() + Math.random(), day: num, date: "",
      activities: [newActivity()],
    };
  }
  function newActivity() {
    return {
      id: Date.now() + Math.random(),
      attraction: "", startTime: "", description: "",
      meals: [], transfer: "Private",
    };
  }

  const addDay      = () => setDays(p => [...p, newDay(p.length + 1)]);
  const removeDay   = (id) => setDays(p => p.filter(d => d.id !== id));
  const updateDay   = (id, k, v) => setDays(p => p.map(d => d.id === id ? { ...d, [k]: v } : d));
  const addAct      = (did) => setDays(p => p.map(d => d.id === did ? { ...d, activities: [...d.activities, newActivity()] } : d));
  const removeAct   = (did, aid) => setDays(p => p.map(d => d.id === did ? { ...d, activities: d.activities.filter(a => a.id !== aid) } : d));
  const updateAct   = (did, aid, k, v) => setDays(p => p.map(d => d.id === did ? {
    ...d, activities: d.activities.map(a => a.id === aid ? { ...a, [k]: v } : a)
  } : d));
  const toggleMeal  = (did, aid, meal) => {
    const day = days.find(d => d.id === did);
    const act = day?.activities.find(a => a.id === aid);
    if (!act) return;
    const meals = act.meals.includes(meal) ? act.meals.filter(m => m !== meal) : [...act.meals, meal];
    updateAct(did, aid, "meals", meals);
  };

  return (
    <div className="space-y-5">
      <SectionCard title="Sightseeing Settings" icon={Map}>
        <div className="space-y-5">
          <IncludeToggle included={included} onChange={() => setIncluded(p => !p)} label="Include Sightseeing in Quotation" />
          {included && (
            <>
              <AIBanner text="AI can generate day-wise itinerary based on destination and trip duration." />
              <FieldGrid cols={2}>
                <div><Label>Section Title</Label><Input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Sightseeing" /></div>
                <div><Label>Amount (₹)</Label><Input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" /></div>
              </FieldGrid>
              <div>
                <Label>Sightseeing Notes</Label>
                <RichText value={notes} onChange={setNotes} placeholder="General notes about sightseeing..." rows={3} />
              </div>
            </>
          )}
        </div>
      </SectionCard>

      {included && days.map((day) => (
        <SectionCard key={day.id}
          title={`Day ${day.day}`}
          icon={Sun}
          iconColor="text-amber-600"
          headerRight={
            <div className="flex items-center gap-2">
              <Input type="date" value={day.date} onChange={e => updateDay(day.id, "date", e.target.value)} className="w-36 text-xs py-1.5" />
              {days.length > 1 && <RemoveBtn onClick={() => removeDay(day.id)} />}
            </div>
          }>
          <div className="space-y-5">
            {day.activities.map((act, ai) => (
              <div key={act.id} className={`${ai > 0 ? "pt-5 border-t border-slate-100" : ""}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Activity {ai + 1}</span>
                  {day.activities.length > 1 && <RemoveBtn onClick={() => removeAct(day.id, act.id)} />}
                </div>
                <FieldGrid cols={2}>
                  <div><Label>Attraction / Activity</Label><Select options={ATTRACTIONS} value={act.attraction} onChange={e => updateAct(day.id, act.id, "attraction", e.target.value)} placeholder="Select activity" /></div>
                  <div><Label>Start Time</Label><Input type="time" value={act.startTime} onChange={e => updateAct(day.id, act.id, "startTime", e.target.value)} /></div>
                </FieldGrid>
                <div className="mt-3">
                  <Label>Description</Label>
                  <Textarea value={act.description} onChange={e => updateAct(day.id, act.id, "description", e.target.value)} rows={3} placeholder="Describe this activity in detail..." />
                </div>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Meals Included</Label>
                    <div className="flex gap-2 mt-1.5 flex-wrap">
                      {MEALS_OPT.map(m => (
                        <button key={m} type="button"
                          onClick={() => toggleMeal(day.id, act.id, m)}
                          className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all flex items-center gap-1.5
                            ${act.meals.includes(m) ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-slate-200 text-slate-600 hover:border-blue-300"}`}>
                          {m === "Breakfast" && <Coffee size={11} />}
                          {m === "Lunch"     && <Utensils size={11} />}
                          {m === "Dinner"    && <Moon size={11} />}
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label>Daily Transfer</Label>
                    <div className="flex gap-2 mt-1.5 flex-wrap">
                      {TRANSFER.map(t => (
                        <button key={t} type="button"
                          onClick={() => updateAct(day.id, act.id, "transfer", t)}
                          className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all
                            ${act.transfer === t ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-slate-200 text-slate-600 hover:border-blue-300"}`}>
                          {t}
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
        <button onClick={addDay} type="button"
          className="w-full py-3 border-2 border-dashed border-slate-300 hover:border-amber-400 hover:bg-amber-50/40 text-slate-500 hover:text-amber-600 text-sm font-bold rounded-2xl transition-all flex items-center justify-center gap-2">
          <Plus size={16} strokeWidth={2.5} /> Add Day
        </button>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════ */
/* ─── CRUISE TAB ─────────────────────────────────────── */
/* ══════════════════════════════════════════════════════ */
function CruiseTab() {
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

      {included ? cruises.map((c, ci) => (
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
      )) : (
        <EmptyState icon={Anchor} title="No Cruise Added" desc="Enable cruise above to add cruise details." />
      )}

      {included && (
        <button onClick={add} type="button"
          className="w-full py-3 border-2 border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50/40 text-slate-500 hover:text-blue-600 text-sm font-bold rounded-2xl transition-all flex items-center justify-center gap-2">
          <Plus size={16} strokeWidth={2.5} /> Add Cruise
        </button>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════ */
/* ─── VEHICLE TAB ────────────────────────────────────── */
/* ══════════════════════════════════════════════════════ */
function VehicleTab() {
  const [included, setIncluded] = useState(true);
  const [title,    setTitle]    = useState("Vehicle Details");
  const [amount,   setAmount]   = useState("");
  const [vehicles, setVehicles] = useState([newVehicle()]);

  function newVehicle() {
    return { id: Date.now() + Math.random(), type: "", pickup: "", drop: "", startDate: "", endDate: "", duration: "", price: "", notes: "" };
  }

  const add    = () => setVehicles(p => [...p, newVehicle()]);
  const remove = (id) => setVehicles(p => p.filter(v => v.id !== id));
  const update = (id, k, v) => setVehicles(p => p.map(vh => vh.id === id ? { ...vh, [k]: v } : vh));

  return (
    <div className="space-y-5">
      <SectionCard title="Vehicle Settings" icon={Car}>
        <div className="space-y-5">
          <IncludeToggle included={included} onChange={() => setIncluded(p => !p)} label="Include Vehicle in Quotation" />
          {included && (
            <FieldGrid cols={2}>
              <div><Label>Section Title</Label><Input value={title} onChange={e => setTitle(e.target.value)} /></div>
              <div><Label>Amount (₹)</Label><Input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" /></div>
            </FieldGrid>
          )}
        </div>
      </SectionCard>

      {included ? vehicles.map((v, vi) => (
        <SectionCard key={v.id} title={`Vehicle ${vi + 1}`} icon={Car}
          headerRight={vehicles.length > 1 && <RemoveBtn onClick={() => remove(v.id)} />}>
          <div className="space-y-4">
            <FieldGrid cols={3}>
              <div><Label required>Vehicle Type</Label><Select options={VEHICLE_TYPES} value={v.type} onChange={e => update(v.id, "type", e.target.value)} /></div>
              <div><Label required>Pickup Location</Label><Input value={v.pickup} onChange={e => update(v.id, "pickup", e.target.value)} placeholder="e.g. Airport, Hotel" /></div>
              <div><Label>Drop Location</Label><Input value={v.drop} onChange={e => update(v.id, "drop", e.target.value)} placeholder="e.g. Hotel, Airport" /></div>
            </FieldGrid>
            <FieldGrid cols={3}>
              <div><Label>Start Date</Label><Input type="date" value={v.startDate} onChange={e => update(v.id, "startDate", e.target.value)} /></div>
              <div><Label>End Date</Label><Input type="date" value={v.endDate} onChange={e => update(v.id, "endDate", e.target.value)} /></div>
              <div><Label>Price (₹)</Label><Input type="number" value={v.price} onChange={e => update(v.id, "price", e.target.value)} placeholder="0.00" /></div>
            </FieldGrid>
            <div>
              <Label>Notes</Label>
              <Textarea value={v.notes} onChange={e => update(v.id, "notes", e.target.value)} rows={2} placeholder="e.g. AC vehicle, experienced driver..." />
            </div>
          </div>
        </SectionCard>
      )) : (
        <EmptyState icon={Car} title="No Vehicle Added" desc="Enable vehicle above to add vehicle details." />
      )}

      {included && (
        <button onClick={add} type="button"
          className="w-full py-3 border-2 border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50/40 text-slate-500 hover:text-blue-600 text-sm font-bold rounded-2xl transition-all flex items-center justify-center gap-2">
          <Plus size={16} strokeWidth={2.5} /> Add Vehicle
        </button>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════ */
/* ─── ADD-ON SERVICES TAB ────────────────────────────── */
/* ══════════════════════════════════════════════════════ */
const SERVICE_TYPES = ["Travel Insurance", "Visa Assistance", "Tour Guide", "Photography", "Porter Service", "Special Meal", "Honeymoon Setup", "Airport Assistance", "SIM Card", "Travel Kit", "Custom"];

function AddOnServicesTab() {
  const [services, setServices] = useState([newService()]);

  function newService() {
    return { id: Date.now() + Math.random(), type: "", description: "", price: "", qty: 1, included: true };
  }

  const add    = () => setServices(p => [...p, newService()]);
  const remove = (id) => setServices(p => p.filter(s => s.id !== id));
  const update = (id, k, v) => setServices(p => p.map(s => s.id === id ? { ...s, [k]: v } : s));

  const total = services.reduce((acc, s) => acc + (Number(s.price) * Number(s.qty) || 0), 0);

  return (
    <div className="space-y-5">
      <SectionCard title="Add-On Services" icon={Package}
        headerRight={<AddBtn onClick={add} label="Add Service" />}>
        {services.length === 0 ? (
          <EmptyState icon={Package} title="No Services Added" desc="Add extra services to the quotation." onAdd={add} addLabel="Add Service" />
        ) : (
          <div className="space-y-3">
            {services.map((s, si) => (
              <div key={s.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Service {si + 1}</span>
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" checked={s.included} onChange={e => update(s.id, "included", e.target.checked)}
                        className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500" />
                      <span className="text-xs font-semibold text-slate-600">Include</span>
                    </label>
                    {services.length > 1 && <RemoveBtn onClick={() => remove(s.id)} />}
                  </div>
                </div>
                <FieldGrid cols={4}>
                  <div className="col-span-2 sm:col-span-1"><Label>Service Type</Label><Select options={SERVICE_TYPES} value={s.type} onChange={e => update(s.id, "type", e.target.value)} /></div>
                  <div><Label>Qty</Label><Input type="number" min={1} value={s.qty} onChange={e => update(s.id, "qty", e.target.value)} /></div>
                  <div><Label>Price (₹)</Label><Input type="number" value={s.price} onChange={e => update(s.id, "price", e.target.value)} placeholder="0.00" /></div>
                  <div className="hidden sm:block"><Label>Subtotal</Label><Input value={s.price && s.qty ? `₹${(Number(s.price) * Number(s.qty)).toLocaleString("en-IN")}` : "—"} disabled /></div>
                </FieldGrid>
                <div className="mt-3">
                  <Label>Description</Label>
                  <Input value={s.description} onChange={e => update(s.id, "description", e.target.value)} placeholder="Describe this service..." />
                </div>
              </div>
            ))}
            <div className="flex justify-end pt-2">
              <div className="bg-blue-50 border border-blue-200 rounded-xl px-5 py-3 text-sm font-bold text-blue-800">
                Add-On Total: ₹{total.toLocaleString("en-IN")}
              </div>
            </div>
          </div>
        )}
      </SectionCard>
    </div>
  );
}

/* ══════════════════════════════════════════════════════ */
/* ─── INCLUSIONS & EXCLUSIONS TAB ────────────────────── */
/* ══════════════════════════════════════════════════════ */
function InclusionsExclusionsTab() {
  const [inclusions, setInclusions] = useState(["Daily Breakfast", "All transfers by AC vehicle", "Hotel accommodation"]);
  const [exclusions, setExclusions] = useState(["International flights", "Travel insurance", "Personal expenses"]);
  const [newInc, setNewInc] = useState("");
  const [newExc, setNewExc] = useState("");

  const addInc = () => { if (newInc.trim()) { setInclusions(p => [...p, newInc.trim()]); setNewInc(""); } };
  const addExc = () => { if (newExc.trim()) { setExclusions(p => [...p, newExc.trim()]); setNewExc(""); } };

  function ItemList({ items, setItems, color }) {
    return (
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className={`flex items-start gap-3 p-3 rounded-xl border ${color === "green" ? "bg-emerald-50 border-emerald-100" : "bg-rose-50 border-rose-100"}`}>
            {color === "green"
              ? <CheckCircle size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
              : <XCircle    size={16} className="text-rose-500    flex-shrink-0 mt-0.5" />}
            <span className="text-sm text-slate-700 flex-1">{item}</span>
            <button onClick={() => setItems(p => p.filter((_, idx) => idx !== i))}
              className="text-slate-400 hover:text-rose-500 transition-colors flex-shrink-0"><X size={14} /></button>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <SectionCard title="Inclusions" icon={CheckCircle} iconColor="text-emerald-600"
        headerRight={<span className="text-xs bg-emerald-100 text-emerald-700 font-bold px-2.5 py-1 rounded-full">{inclusions.length} items</span>}>
        <div className="space-y-4">
          <ItemList items={inclusions} setItems={setInclusions} color="green" />
          <div className="flex gap-2 pt-2">
            <Input value={newInc} onChange={e => setNewInc(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addInc()}
              placeholder="Add an inclusion..." />
            <button onClick={addInc} className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition-all flex-shrink-0 flex items-center gap-1.5">
              <Plus size={15} /> Add
            </button>
          </div>
          <div>
            <Label>Rich Text Notes</Label>
            <RichText placeholder="Add detailed inclusion notes..." rows={3} />
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Exclusions" icon={XCircle} iconColor="text-rose-600"
        headerRight={<span className="text-xs bg-rose-100 text-rose-600 font-bold px-2.5 py-1 rounded-full">{exclusions.length} items</span>}>
        <div className="space-y-4">
          <ItemList items={exclusions} setItems={setExclusions} color="red" />
          <div className="flex gap-2 pt-2">
            <Input value={newExc} onChange={e => setNewExc(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addExc()}
              placeholder="Add an exclusion..." />
            <button onClick={addExc} className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold rounded-xl transition-all flex-shrink-0 flex items-center gap-1.5">
              <Plus size={15} /> Add
            </button>
          </div>
          <div>
            <Label>Rich Text Notes</Label>
            <RichText placeholder="Add detailed exclusion notes..." rows={3} />
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

/* ══════════════════════════════════════════════════════ */
/* ─── SUMMARY & PRICING TAB ──────────────────────────── */
/* ══════════════════════════════════════════════════════ */
function SummaryPricingTab() {
  const [discount, setDiscount] = useState(0);
  const [discType, setDiscType] = useState("fixed");
  const [tax,      setTax]      = useState(18);
  const [markup,   setMarkup]   = useState(0);

  const costs = {
    flight:   0,
    hotel:    0,
    sightseeing: 0,
    cruise:   0,
    vehicle:  0,
    addons:   0,
  };
  const subtotal   = Object.values(costs).reduce((a, b) => a + b, 0);
  const discAmt    = discType === "%" ? (subtotal * discount) / 100 : Number(discount);
  const afterDisc  = subtotal - discAmt + Number(markup);
  const taxAmt     = (afterDisc * tax) / 100;
  const grandTotal = afterDisc + taxAmt;

  const fmt = (n) => `₹${Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

  return (
    <div className="space-y-5">
      {/* Price Breakdown */}
      <SectionCard title="Price Breakdown" icon={BarChart2}>
        <div className="space-y-2">
          {[
            { label: "Flight Cost",      value: costs.flight,      icon: Plane   },
            { label: "Hotel Cost",       value: costs.hotel,       icon: Hotel   },
            { label: "Sightseeing Cost", value: costs.sightseeing, icon: Map     },
            { label: "Cruise Cost",      value: costs.cruise,      icon: Anchor  },
            { label: "Vehicle Cost",     value: costs.vehicle,     icon: Car     },
            { label: "Add-On Cost",      value: costs.addons,      icon: Package },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500"><Icon size={15} /></div>
                <span className="text-sm font-semibold text-slate-700">{label}</span>
              </div>
              <span className="text-sm font-bold text-slate-800">{fmt(value)}</span>
            </div>
          ))}
          <div className="flex items-center justify-between py-3 bg-slate-50 rounded-xl px-3 mt-2">
            <span className="text-sm font-extrabold text-slate-800">Subtotal</span>
            <span className="text-base font-extrabold text-slate-900">{fmt(subtotal)}</span>
          </div>
        </div>
      </SectionCard>

      {/* Adjustments */}
      <SectionCard title="Adjustments" icon={Tag}>
        <div className="space-y-5">
          <FieldGrid cols={3}>
            <div>
              <Label>Markup (₹)</Label>
              <Input type="number" value={markup} onChange={e => setMarkup(e.target.value)} placeholder="0.00" />
            </div>
            <div>
              <Label>Discount</Label>
              <div className="flex gap-2">
                <Input type="number" value={discount} onChange={e => setDiscount(e.target.value)} placeholder="0" className="flex-1" />
                <Select options={["%", "Fixed"]} value={discType} onChange={e => setDiscType(e.target.value)} className="w-20" />
              </div>
            </div>
            <div>
              <Label>Tax (%)</Label>
              <Input type="number" value={tax} onChange={e => setTax(e.target.value)} placeholder="18" />
            </div>
          </FieldGrid>
          <div className="space-y-2 pt-2 border-t border-slate-100">
            {[
              ["Subtotal",  fmt(subtotal),   "text-slate-700"],
              ["Markup",    fmt(markup),     "text-blue-700"],
              ["Discount", `-${fmt(discAmt)}`, "text-emerald-700"],
              ["Tax (GST)", fmt(taxAmt),     "text-amber-700"],
            ].map(([lbl, val, cls]) => (
              <div key={lbl} className="flex justify-between text-sm py-1">
                <span className="text-slate-600 font-medium">{lbl}</span>
                <span className={`font-bold ${cls}`}>{val}</span>
              </div>
            ))}
          </div>
        </div>
      </SectionCard>

      {/* Grand Total */}
      <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-emerald-100 text-xs font-bold uppercase tracking-widest mb-1">Final Quotation Total</p>
            <p className="text-4xl font-extrabold">{fmt(grandTotal)}</p>
            <p className="text-emerald-200 text-xs mt-1">Including all taxes and charges</p>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
            <IndianRupee size={32} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════ */
/* ─── MAIN PAGE ──────────────────────────────────────── */
/* ══════════════════════════════════════════════════════ */
export default function CreateQuotation() {
  const [activeTab, setActiveTab] = useState("flight");
  const [qtTitle,   setQtTitle]   = useState("");
  const [version]               = useState("v1.0");
  const [stage]                 = useState("New Lead");

  const tabContent = {
    flight:      <FlightTab />,
    hotel:       <HotelTab />,
    sightseeing: <SightseeingTab />,
    cruise:      <CruiseTab />,
    vehicle:     <VehicleTab />,
    addons:      <AddOnServicesTab />,
    inclusions:  <InclusionsExclusionsTab />,
    summary:     <SummaryPricingTab />,
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans" style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');`}</style>

      {/* TOP NAV */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center">
              <Plane size={16} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="font-extrabold text-slate-900 text-base tracking-tight">TravelCRM</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-green-500 text-white text-xs font-bold rounded-full">
              <Phone size={12} /> +91 98765 43210
            </button>
            <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all">
              <Clock size={13} /> 02:45
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-xl border border-blue-200">
              Pro Plan
            </button>
            <button className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
              P
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6 space-y-5">

        {/* BREADCRUMB + TITLE */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-1.5">
              <Home size={12} /> <ChevronRight size={10} />
              <span>Leads</span> <ChevronRight size={10} />
              <span className="text-slate-600 font-semibold">Create Quotation</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Create Quotation</h1>
          </div>
        </div>

        {/* PACKAGE BANNER */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 rounded-2xl px-6 py-4 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-1">Quotation Package</p>
            <h2 className="text-lg font-extrabold">Quotation for Pratik · 7 Nights / 8 Days — Nepal Tour</h2>
          </div>
          <div className="flex items-center gap-3 text-sm flex-shrink-0">
            <span className="bg-white/20 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5"><Users size={13} /> 4 Pax</span>
            <span className="bg-white/20 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5"><Calendar size={13} /> Jun 15, 2026</span>
          </div>
        </div>

        {/* BASIC INFO FORM */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <FieldGrid cols={3}>
            <div>
              <Label required>Quotation Title</Label>
              <Input value={qtTitle} onChange={e => setQtTitle(e.target.value)} placeholder="Enter quotation title..." />
            </div>
            <div>
              <Label>Version</Label>
              <Input value={version} disabled />
            </div>
            <div>
              <Label>Lead Stage</Label>
              <Input value={stage} disabled />
            </div>
          </FieldGrid>
        </div>

        {/* TAB NAVIGATION */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto border-b border-slate-200">
            <div className="flex min-w-max">
              {TABS.map(tab => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-5 py-4 text-sm font-bold whitespace-nowrap transition-all border-b-2
                      ${active
                        ? "text-blue-600 border-blue-600 bg-blue-50/50"
                        : "text-slate-500 border-transparent hover:text-slate-700 hover:bg-slate-50"}`}>
                    <Icon size={15} strokeWidth={active ? 2.5 : 2} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* TAB CONTENT */}
          <div className="p-5 sm:p-6">
            {tabContent[activeTab]}
          </div>
        </div>

        {/* STICKY SUMMARY PANEL */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-sm font-extrabold text-slate-800">Quotation Summary</h3>
          </div>
          <div className="p-5 grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Left — summary info */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { icon: User,     label: "Client Name",   value: "Pratik Sharma"   },
                  { icon: Phone,    label: "Contact",       value: "+91 98765 43210" },
                  { icon: Users,    label: "Travelers",     value: "4 Adults, 0 Child" },
                  { icon: Calendar, label: "Travel Dates",  value: "Jun 15 – Jun 22, 2026" },
                  { icon: MapPin,   label: "Destination",   value: "Nepal (Kathmandu, Pokhara)" },
                  { icon: FileText, label: "Package",       value: "7N / 8D — Nepal Tour" },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0"><Icon size={14} /></div>
                    <div className="min-w-0">
                      <p className="text-[11px] text-slate-400 font-medium">{label}</p>
                      <p className="text-sm font-bold text-slate-800 truncate">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — totals */}
            <div className="flex flex-col gap-3">
              <div className="flex-1 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-5 text-white text-center flex flex-col items-center justify-center">
                <p className="text-emerald-100 text-xs font-bold uppercase tracking-widest mb-2">Final Quotation Total</p>
                <p className="text-3xl font-extrabold">₹0.00</p>
              </div>
              <div className="flex-1 bg-gradient-to-br from-amber-400 to-amber-500 rounded-2xl p-5 text-white text-center flex flex-col items-center justify-center">
                <p className="text-amber-100 text-xs font-bold uppercase tracking-widest mb-2">Add-on Services Total</p>
                <p className="text-3xl font-extrabold">₹0.00</p>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="flex items-center justify-end gap-3 pb-8">
          <button type="button"
            className="px-6 py-2.5 border-2 border-slate-300 hover:border-slate-400 text-slate-700 font-bold text-sm rounded-xl transition-all bg-white hover:bg-slate-50 active:scale-95">
            Cancel
          </button>
          <button type="button"
            className="flex items-center gap-2 px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-200 transition-all active:scale-95">
            <Save size={15} strokeWidth={2.5} /> Create Quotation
          </button>
        </div>

      </div>
    </div>
  );
}