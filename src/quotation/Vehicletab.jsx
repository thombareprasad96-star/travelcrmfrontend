import React, { useState } from "react";
import { Car, Plus } from "lucide-react";
import { Label, Input, Select, Textarea, SectionCard, RemoveBtn, IncludeToggle, EmptyState, FieldGrid } from "./ui";
import { VEHICLE_TYPES } from "./constants";

export default function VehicleTab({ onDataChange }) {
  const [included, setIncluded] = useState(true);
  const [title,    setTitle]    = useState("Vehicle Details");
  const [amount,   setAmount]   = useState("");
  const [vehicles, setVehicles] = useState([newVehicle()]);

  function newVehicle() {
    return { id: Date.now() + Math.random(), type: "", pickup: "", drop: "", startDate: "", endDate: "", price: "", notes: "" };
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

      {included ? (
        <>
          {vehicles.map((v, vi) => (
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
                <div><Label>Notes</Label><Textarea value={v.notes} onChange={e => update(v.id, "notes", e.target.value)} rows={2} placeholder="e.g. AC vehicle, experienced driver..." /></div>
              </div>
            </SectionCard>
          ))}
          <button onClick={add} type="button"
            className="w-full py-3 border-2 border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50/40 text-slate-500 hover:text-blue-600 text-sm font-bold rounded-2xl transition-all flex items-center justify-center gap-2">
            <Plus size={16} strokeWidth={2.5} /> Add Vehicle
          </button>
        </>
      ) : (
        <EmptyState icon={Car} title="No Vehicle Added" desc="Enable vehicle above to add vehicle details." />
      )}
    </div>
  );
}