import React, { useState } from "react";
import { BarChart2, Plane, Hotel, Map, Anchor, Car, Package, Tag, IndianRupee } from "lucide-react";
import { Label, Input, Select, SectionCard, FieldGrid } from "./ui";

export default function SummaryPricingTab({ costs = {} }) {
  const [discount, setDiscount] = useState(0);
  const [discType, setDiscType] = useState("Fixed");
  const [tax,      setTax]      = useState(18);
  const [markup,   setMarkup]   = useState(0);

  const c = {
    flight:      Number(costs.flight)      || 0,
    hotel:       Number(costs.hotel)       || 0,
    sightseeing: Number(costs.sightseeing) || 0,
    cruise:      Number(costs.cruise)      || 0,
    vehicle:     Number(costs.vehicle)     || 0,
    addons:      Number(costs.addons)      || 0,
  };

  const subtotal   = Object.values(c).reduce((a, b) => a + b, 0);
  const discAmt    = discType === "%" ? (subtotal * Number(discount)) / 100 : Number(discount);
  const afterDisc  = subtotal - discAmt + Number(markup);
  const taxAmt     = (afterDisc * Number(tax)) / 100;
  const grandTotal = afterDisc + taxAmt;

  const fmt = (n) => `₹${Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

  const breakdown = [
    { label: "Flight Cost",      value: c.flight,      icon: Plane   },
    { label: "Hotel Cost",       value: c.hotel,       icon: Hotel   },
    { label: "Sightseeing Cost", value: c.sightseeing, icon: Map     },
    { label: "Cruise Cost",      value: c.cruise,      icon: Anchor  },
    { label: "Vehicle Cost",     value: c.vehicle,     icon: Car     },
    { label: "Add-On Cost",      value: c.addons,      icon: Package },
  ];

  return (
    <div className="space-y-5">

      {/* Price Breakdown */}
      <SectionCard title="Price Breakdown" icon={BarChart2}>
        <div className="space-y-1">
          {breakdown.map(({ label, value, icon: Icon }) => (
            <div key={label} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                  <Icon size={15} />
                </div>
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
                <Select options={["%", "Fixed"]} value={discType} onChange={e => setDiscType(e.target.value)} className="w-24" />
              </div>
            </div>
            <div>
              <Label>Tax (%)</Label>
              <Input type="number" value={tax} onChange={e => setTax(e.target.value)} placeholder="18" />
            </div>
          </FieldGrid>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            {[
              ["Subtotal",   fmt(subtotal),     "text-slate-700"  ],
              ["Markup",     fmt(markup),       "text-blue-700"   ],
              ["Discount",  `-${fmt(discAmt)}`, "text-emerald-700"],
              ["Tax (GST)", fmt(taxAmt),        "text-amber-700"  ],
            ].map(([lbl, val, cls]) => (
              <div key={lbl} className="flex justify-between text-sm py-1">
                <span className="text-slate-600 font-medium">{lbl}</span>
                <span className={`font-bold ${cls}`}>{val}</span>
              </div>
            ))}
          </div>
        </div>
      </SectionCard>

      {/* ── Grand Total Card — Vendor style ── */}
      <div
        className="relative overflow-hidden rounded-[18px] p-6 flex flex-col justify-between min-h-[155px] cursor-default"
        style={{ background: "linear-gradient(135deg, #00c6a7 0%, #00a389 40%, #007d6b 100%)" }}
      >
        {/* White blobs */}
        <div
          className="absolute -top-9 -right-8 w-32 h-32 rounded-full pointer-events-none"
          style={{ background: "rgba(255,255,255,0.13)" }}
        />
        <div
          className="absolute bottom-[-20px] right-10 w-24 h-24 rounded-full pointer-events-none"
          style={{ background: "rgba(255,255,255,0.09)" }}
        />
        <div
          className="absolute top-5 right-[80px] w-12 h-12 rounded-full pointer-events-none"
          style={{ background: "rgba(255,255,255,0.07)" }}
        />

        {/* Icon top-left */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center relative z-10 flex-shrink-0"
          style={{ background: "rgba(255,255,255,0.22)" }}
        >
          <IndianRupee size={24} className="text-white" />
        </div>

        {/* Amount + labels bottom */}
        <div className="relative z-10 mt-4">
          <p
            className="text-[10px] font-semibold uppercase tracking-[.13em]"
            style={{ color: "rgba(255,255,255,0.72)" }}
          >
            Final Quotation Total
          </p>
          <p className="text-[38px] font-extrabold text-white leading-none tracking-tight mt-1">
            {fmt(grandTotal)}
          </p>
          <p
            className="text-[11px] mt-1.5"
            style={{ color: "rgba(255,255,255,0.60)" }}
          >
            Including all taxes and charges
          </p>
        </div>
      </div>

    </div>
  );
}