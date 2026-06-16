import React, { useState } from "react";
import { Package } from "lucide-react";
import { Label, Input, Select, SectionCard, AddBtn, RemoveBtn, EmptyState, FieldGrid } from "../quotation/ui";
import { SERVICE_TYPES } from "./constants";

export default function AddOnServicesTab({ onDataChange }) {
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
      <SectionCard title="Add-On Services" icon={Package} headerRight={<AddBtn onClick={add} label="Add Service" />}>
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
                  <div className="col-span-2 sm:col-span-1">
                    <Label>Service Type</Label>
                    <Select options={SERVICE_TYPES} value={s.type} onChange={e => update(s.id, "type", e.target.value)} />
                  </div>
                  <div><Label>Qty</Label><Input type="number" min={1} value={s.qty} onChange={e => update(s.id, "qty", e.target.value)} /></div>
                  <div><Label>Price (₹)</Label><Input type="number" value={s.price} onChange={e => update(s.id, "price", e.target.value)} placeholder="0.00" /></div>
                  <div className="hidden sm:block">
                    <Label>Subtotal</Label>
                    <Input value={s.price && s.qty ? `₹${(Number(s.price) * Number(s.qty)).toLocaleString("en-IN")}` : "—"} disabled />
                  </div>
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