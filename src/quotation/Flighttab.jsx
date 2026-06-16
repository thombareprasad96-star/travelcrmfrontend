import React, { useState } from "react";
import { Plane } from "lucide-react";
import { Plus } from "lucide-react";
import { Label, Input, Select, SectionCard, AddBtn, RemoveBtn, IncludeToggle, FieldGrid } from "./ui";
import { AIRLINES, CLASSES, AIRPORTS, JOURNEY_TYPES } from "./constants";

/**
 * FlightTab
 * Props:
 *   onDataChange(data) — called whenever tab state changes (for parent to collect)
 */
export default function FlightTab({ onDataChange }) {
  const [included, setIncluded] = useState(true);
  const [title,    setTitle]    = useState("Flight Details");
  const [amount,   setAmount]   = useState("");
  const [journey,  setJourney]  = useState("Round Trip");
  const [segments, setSegments] = useState([newSegment()]);

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

  // Expose data to parent
  const getData = () => ({ included, title, amount, journey, segments });

  return (
    <div className="space-y-5">
      <SectionCard title="Flight Settings" icon={Plane}>
        <div className="space-y-5">
          <IncludeToggle included={included} onChange={() => setIncluded(p => !p)} label="Include Flight in Quotation" />
          {included && (
            <FieldGrid cols={3}>
              <div><Label>Section Title</Label><Input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Flight Details" /></div>
              <div><Label>Amount (₹)</Label><Input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" /></div>
              <div><Label>Journey Type</Label><Select options={JOURNEY_TYPES} value={journey} onChange={e => setJourney(e.target.value)} /></div>
            </FieldGrid>
          )}
        </div>
      </SectionCard>

      {included && segments.map((seg, si) => (
        <SectionCard key={seg.id} title={`Segment ${si + 1}`} icon={Plane}
          headerRight={segments.length > 1 && <RemoveBtn onClick={() => removeSeg(seg.id)} />}>
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
                <FieldGrid cols={4}>
                  <div><Label>Dep. Date</Label><Input type="date" value={conn.depDate} onChange={e => updateConn(seg.id, conn.id, "depDate", e.target.value)} /></div>
                  <div><Label>Dep. Time</Label><Input type="time" value={conn.depTime} onChange={e => updateConn(seg.id, conn.id, "depTime", e.target.value)} /></div>
                  <div><Label>Arr. Date</Label><Input type="date" value={conn.arrDate} onChange={e => updateConn(seg.id, conn.id, "arrDate", e.target.value)} /></div>
                  <div><Label>Arr. Time</Label><Input type="time" value={conn.arrTime} onChange={e => updateConn(seg.id, conn.id, "arrTime", e.target.value)} /></div>
                </FieldGrid>
              </div>
            ))}

            <div className="flex pt-2 border-t border-slate-100">
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