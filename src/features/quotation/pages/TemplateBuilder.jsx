// src/features/quotation/pages/TemplateBuilder.jsx
//
// Create / edit a package template. This is the lossless authoring surface: its itinerary rows carry
// a real master City id (destination → city cascading dropdowns), which is what makes destination
// scoring reliable later. Unlike the shared quotation tabs, this form is controlled and hydrates
// cleanly in edit mode, because it is purpose-built for the template shape.

import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Save, ArrowLeft, Plus, Trash2, MapPin, Hotel as HotelIcon, ListChecks, Star,
  CalendarRange, Image as ImageIcon, Loader2, Route,
} from "lucide-react";
import { templateService } from "../api/templateService";
import { geographyService } from "@shared/api/geographyService";
import { toast } from "@shared/ui/toast";
import { getErrorMessage } from "@shared/api/apiError";

const MONTHS = [
  [1, "Jan"], [2, "Feb"], [3, "Mar"], [4, "Apr"], [5, "May"], [6, "Jun"],
  [7, "Jul"], [8, "Aug"], [9, "Sep"], [10, "Oct"], [11, "Nov"], [12, "Dec"],
];

let ROW_SEQ = 1;
const rid = () => `r${ROW_SEQ++}`;
const newDay = (dayNumber) => ({ _id: rid(), dayNumber, destinationId: "", destinationName: "", cityId: "", cityName: "", nights: 1, title: "", description: "", pricePerPax: "" });
const newHotel = () => ({ _id: rid(), name: "", city: "", stars: "", roomType: "", mealPlan: "", refundable: true, pricePerRoom: "", rooms: "", nights: 1, imagePath: "" });

export default function TemplateBuilder() {
  const navigate = useNavigate();
  const { publicId } = useParams();
  const isEdit = !!publicId;

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "", description: "", coverImageUrl: "", active: true,
    durationNights: "", hotelTier: "", basePrice: "",
  });
  const [seasonMonths, setSeasonMonths] = useState([]); // [] = year-round
  const [days, setDays] = useState([newDay(1)]);
  const [hotels, setHotels] = useState([newHotel()]);
  const [inclusions, setInclusions] = useState("");
  const [exclusions, setExclusions] = useState("");

  const [destinations, setDestinations] = useState([]);
  const cityCache = useRef({});           // destinationId -> [{id,name}]
  const [cityOptions, setCityOptions] = useState({}); // destinationId -> [{id,name}]

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  // ── Load destinations, and (edit) the template ──────────────────────────────
  useEffect(() => {
    geographyService.getAllDestinations().then(setDestinations).catch(() => setDestinations([]));
  }, []);

  const loadCities = useCallback(async (destinationId) => {
    if (!destinationId || cityCache.current[destinationId]) return;
    try {
      const cities = await geographyService.getCitiesByDestination(destinationId);
      cityCache.current[destinationId] = cities;
      setCityOptions((prev) => ({ ...prev, [destinationId]: cities }));
    } catch {
      cityCache.current[destinationId] = [];
    }
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        const t = await templateService.get(publicId);
        setForm({
          name: t.name || "", description: t.description || "", coverImageUrl: t.coverImageUrl || "",
          active: t.active !== false,
          durationNights: t.durationNights ?? "", hotelTier: t.hotelTier ?? "", basePrice: t.basePrice ?? "",
        });
        setSeasonMonths(t.seasonMonths || []);
        setInclusions((t.inclusions || []).join("\n"));
        setExclusions((t.exclusions || []).join("\n"));
        setHotels((t.hotels || []).length
          ? t.hotels.map((h) => ({
              _id: rid(), name: h.name || "", city: h.city || "", stars: h.stars ?? "",
              roomType: h.roomType || "", mealPlan: h.mealPlan || "", refundable: h.refundable !== false,
              pricePerRoom: h.pricePerRoom ?? "", rooms: h.rooms ?? "", nights: h.nights ?? 1, imagePath: h.imagePath || "",
            }))
          : [newHotel()]);
        setDays((t.itinerary || []).length
          ? t.itinerary.map((d) => ({
              _id: rid(), dayNumber: d.dayNumber, destinationId: "", destinationName: d.destinationName || "",
              cityId: d.cityId ?? "", cityName: d.cityName || "", nights: d.nights ?? 0,
              title: d.title || "", description: d.description || "", pricePerPax: d.pricePerPax ?? "",
            }))
          : [newDay(1)]);
      } catch (err) {
        toast.error(getErrorMessage(err, "Couldn't load the template."));
        navigate("/quotations/templates");
      } finally {
        setLoading(false);
      }
    })();
  }, [isEdit, publicId, navigate]);

  // ── Itinerary row handlers ──────────────────────────────────────────────────
  const updateDay = (id, patch) => setDays((rows) => rows.map((r) => (r._id === id ? { ...r, ...patch } : r)));

  const pickDestination = (id, destinationId) => {
    const dest = destinations.find((d) => String(d.id) === String(destinationId));
    updateDay(id, { destinationId, destinationName: dest?.name || "", cityId: "", cityName: "" });
    loadCities(destinationId);
  };
  const pickCity = (id, cityId, destinationId) => {
    const city = (cityOptions[destinationId] || []).find((c) => String(c.id) === String(cityId));
    updateDay(id, { cityId, cityName: city?.name || "" });
  };

  const addDay = () => setDays((rows) => [...rows, newDay(rows.length + 1)]);
  const removeDay = (id) => setDays((rows) => rows.filter((r) => r._id !== id).map((r, i) => ({ ...r, dayNumber: i + 1 })));

  const addHotel = () => setHotels((rows) => [...rows, newHotel()]);
  const removeHotel = (id) => setHotels((rows) => rows.filter((r) => r._id !== id));
  const updateHotel = (id, patch) => setHotels((rows) => rows.map((r) => (r._id === id ? { ...r, ...patch } : r)));

  const toggleMonth = (m) => setSeasonMonths((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m].sort((a, b) => a - b)));

  // ── Save ────────────────────────────────────────────────────────────────────
  const numOrNull = (v) => (v === "" || v == null ? null : Number(v));

  const buildPayload = () => ({
    name: form.name.trim(),
    description: form.description.trim() || null,
    coverImageUrl: form.coverImageUrl.trim() || null,
    active: form.active,
    durationNights: numOrNull(form.durationNights),
    hotelTier: numOrNull(form.hotelTier),
    basePrice: numOrNull(form.basePrice),
    seasonMonths,
    itinerary: days
      .filter((d) => d.cityName || d.title || d.description)
      .map((d) => ({
        dayNumber: d.dayNumber,
        cityId: numOrNull(d.cityId),
        cityName: d.cityName || null,
        destinationName: d.destinationName || null,
        nights: numOrNull(d.nights),
        title: d.title.trim() || null,
        description: d.description.trim() || null,
        pricePerPax: numOrNull(d.pricePerPax),
      })),
    hotels: hotels
      .filter((h) => h.name || h.city)
      .map((h) => ({
        name: h.name.trim() || null,
        city: h.city.trim() || null,
        stars: numOrNull(h.stars),
        roomType: h.roomType.trim() || null,
        mealPlan: h.mealPlan.trim() || null,
        refundable: h.refundable,
        pricePerRoom: numOrNull(h.pricePerRoom),
        rooms: numOrNull(h.rooms),
        nights: numOrNull(h.nights),
        imagePath: h.imagePath.trim() || null,
      })),
    inclusions: inclusions.split("\n").map((s) => s.trim()).filter(Boolean),
    exclusions: exclusions.split("\n").map((s) => s.trim()).filter(Boolean),
  });

  const save = async () => {
    if (!form.name.trim()) { toast.error("Give the template a name."); return; }
    setSaving(true);
    try {
      const payload = buildPayload();
      if (isEdit) {
        await templateService.update(publicId, payload);
        toast.success("Template updated.");
      } else {
        await templateService.create(payload);
        toast.success("Template created.");
      }
      navigate("/quotations/templates");
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't save the template."));
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-400">
        <Loader2 size={28} className="animate-spin mb-3" />
        <p className="text-sm font-semibold">Loading template…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-28">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-5 py-4 flex items-center gap-3">
          <button onClick={() => navigate("/quotations/templates")} className="w-9 h-9 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-all">
            <ArrowLeft size={18} />
          </button>
          <div className="flex-1">
            <h1 className="text-base font-extrabold text-slate-800">{isEdit ? "Edit Template" : "New Template"}</h1>
            <p className="text-xs text-slate-500">{isEdit ? form.name : "Author a reusable package blueprint"}</p>
          </div>
          <button onClick={save} disabled={saving}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-bold transition-all active:scale-95 shadow-lg shadow-indigo-600/20">
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} strokeWidth={2.5} />}
            {isEdit ? "Save changes" : "Create template"}
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-5 py-5 space-y-4">
        {/* Basics */}
        <Card icon={ImageIcon} title="Basics">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Template name" required className="sm:col-span-2">
              <input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Goa & Manali Grand Tour" className="ti" />
            </Field>
            <Field label="Description" className="sm:col-span-2">
              <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={2} placeholder="One or two lines an agent will recognise." className="ti resize-none" />
            </Field>
            <Field label="Cover image URL" className="sm:col-span-2">
              <input value={form.coverImageUrl} onChange={(e) => set("coverImageUrl", e.target.value)} placeholder="https://…" className="ti" />
            </Field>
          </div>
        </Card>

        {/* Scoring dimensions */}
        <Card icon={Star} title="Match dimensions" subtitle="What the lead-matching engine scores against">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <Field label="Duration (nights)">
              <input type="number" min="0" value={form.durationNights} onChange={(e) => set("durationNights", e.target.value)} placeholder="auto" className="ti" />
              <p className="hint">Blank = summed from itinerary</p>
            </Field>
            <Field label="Hotel tier">
              <select value={form.hotelTier} onChange={(e) => set("hotelTier", e.target.value)} className="ti">
                <option value="">—</option>
                {[1, 2, 3, 4, 5].map((s) => <option key={s} value={s}>{s} star</option>)}
              </select>
            </Field>
            <Field label="Base price (₹)">
              <input type="number" min="0" value={form.basePrice} onChange={(e) => set("basePrice", e.target.value)} placeholder="e.g. 88000" className="ti" />
            </Field>
          </div>

          <div className="mt-4">
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-600 uppercase tracking-wide mb-2">
              <CalendarRange size={13} /> Season
            </label>
            <div className="flex flex-wrap gap-1.5">
              {MONTHS.map(([m, lbl]) => (
                <button key={m} type="button" onClick={() => toggleMonth(m)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${seasonMonths.includes(m) ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>
                  {lbl}
                </button>
              ))}
            </div>
            <p className="hint mt-1.5">
              {seasonMonths.length === 0 ? "No months selected — treated as year-round (perfect season fit for any date)." : `Sold in ${seasonMonths.length} month(s).`}
            </p>
          </div>
        </Card>

        {/* Itinerary */}
        <Card icon={Route} title="Itinerary" subtitle="Day-wise plan — the cities here pin the match to real destinations"
          action={<AddButton onClick={addDay} label="Add day" />}>
          <div className="space-y-3">
            {days.map((d) => (
              <div key={d._id} className="rounded-xl border border-slate-200 bg-slate-50/60 p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-indigo-600">
                    <span className="w-5 h-5 rounded-md bg-indigo-100 flex items-center justify-center text-[11px]">{d.dayNumber}</span>
                    Day {d.dayNumber}
                  </span>
                  <button onClick={() => removeDay(d._id)} className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"><Trash2 size={14} /></button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                  <div>
                    <MiniLabel><MapPin size={11} /> Destination</MiniLabel>
                    <select value={d.destinationId} onChange={(e) => pickDestination(d._id, e.target.value)} className="ti">
                      <option value="">{d.destinationName || "Select…"}</option>
                      {destinations.map((dst) => <option key={dst.id} value={dst.id}>{dst.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <MiniLabel>City</MiniLabel>
                    <select value={d.cityId} onChange={(e) => pickCity(d._id, e.target.value, d.destinationId)} disabled={!d.destinationId} className="ti">
                      <option value="">{d.cityName || (d.destinationId ? "Select…" : "Pick destination first")}</option>
                      {(cityOptions[d.destinationId] || []).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    {d.cityName && !d.cityId && <p className="hint">Saved: {d.cityName}</p>}
                  </div>
                  <div>
                    <MiniLabel>Nights</MiniLabel>
                    <input type="number" min="0" value={d.nights} onChange={(e) => updateDay(d._id, { nights: e.target.value })} className="ti" />
                  </div>
                  <div>
                    <MiniLabel>Price / pax (₹)</MiniLabel>
                    <input type="number" min="0" value={d.pricePerPax} onChange={(e) => updateDay(d._id, { pricePerPax: e.target.value })} className="ti" />
                  </div>
                  <div className="sm:col-span-2 lg:col-span-4">
                    <MiniLabel>Title / activity</MiniLabel>
                    <input value={d.title} onChange={(e) => updateDay(d._id, { title: e.target.value })} placeholder="e.g. Solang Valley adventure day" className="ti" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Hotels */}
        <Card icon={HotelIcon} title="Hotels" action={<AddButton onClick={addHotel} label="Add hotel" />}>
          <div className="space-y-3">
            {hotels.map((h) => (
              <div key={h._id} className="rounded-xl border border-slate-200 bg-slate-50/60 p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-500">Hotel</span>
                  <button onClick={() => removeHotel(h._id)} className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"><Trash2 size={14} /></button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                  <div className="lg:col-span-2"><MiniLabel>Name</MiniLabel><input value={h.name} onChange={(e) => updateHotel(h._id, { name: e.target.value })} placeholder="Hotel name" className="ti" /></div>
                  <div><MiniLabel>City</MiniLabel><input value={h.city} onChange={(e) => updateHotel(h._id, { city: e.target.value })} className="ti" /></div>
                  <div>
                    <MiniLabel>Stars</MiniLabel>
                    <select value={h.stars} onChange={(e) => updateHotel(h._id, { stars: e.target.value })} className="ti">
                      <option value="">—</option>
                      {[1, 2, 3, 4, 5].map((s) => <option key={s} value={s}>{s}★</option>)}
                    </select>
                  </div>
                  <div><MiniLabel>Room type</MiniLabel><input value={h.roomType} onChange={(e) => updateHotel(h._id, { roomType: e.target.value })} className="ti" /></div>
                  <div><MiniLabel>Meal plan</MiniLabel><input value={h.mealPlan} onChange={(e) => updateHotel(h._id, { mealPlan: e.target.value })} placeholder="Breakfast" className="ti" /></div>
                  <div><MiniLabel>Price / room (₹)</MiniLabel><input type="number" min="0" value={h.pricePerRoom} onChange={(e) => updateHotel(h._id, { pricePerRoom: e.target.value })} className="ti" /></div>
                  <div><MiniLabel>Nights</MiniLabel><input type="number" min="0" value={h.nights} onChange={(e) => updateHotel(h._id, { nights: e.target.value })} className="ti" /></div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Inclusions / Exclusions */}
        <Card icon={ListChecks} title="Inclusions & Exclusions" subtitle="One item per line">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Inclusions">
              <textarea value={inclusions} onChange={(e) => setInclusions(e.target.value)} rows={5} placeholder={"Daily breakfast\nAirport transfers"} className="ti resize-none" />
            </Field>
            <Field label="Exclusions">
              <textarea value={exclusions} onChange={(e) => setExclusions(e.target.value)} rows={5} placeholder={"Airfare\nPersonal expenses"} className="ti resize-none" />
            </Field>
          </div>
        </Card>

        {/* Active toggle */}
        <Card icon={CalendarRange} title="Availability">
          <label className="flex items-center gap-3 cursor-pointer">
            <div onClick={() => set("active", !form.active)} className={`w-11 h-6 rounded-full transition-all relative flex-shrink-0 ${form.active ? "bg-indigo-600" : "bg-slate-300"}`}>
              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${form.active ? "left-5" : "left-0.5"}`} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-700">{form.active ? "Active" : "Archived"}</p>
              <p className="text-xs text-slate-400">{form.active ? "Appears in lead-matching results." : "Hidden from matching; kept for reference."}</p>
            </div>
          </label>
        </Card>
      </div>

      <style>{`
        .ti { width:100%; padding:8px 10px; font-size:13px; color:#1e293b; background:#fff; border:1px solid #e2e8f0; border-radius:10px; outline:none; transition:all .15s; }
        .ti:focus { border-color:#6366f1; box-shadow:0 0 0 3px rgba(99,102,241,.15); }
        .ti:disabled { background:#f8fafc; color:#94a3b8; cursor:not-allowed; }
        .hint { font-size:10.5px; color:#94a3b8; margin-top:3px; }
      `}</style>
    </div>
  );
}

/* ── Small building blocks ─────────────────────────────────────────────────── */

function Card({ icon: Icon, title, subtitle, action, children }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">{Icon && <Icon size={15} />}</div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">{title}</h3>
            {subtitle && <p className="text-[11px] text-slate-400">{subtitle}</p>}
          </div>
        </div>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function Field({ label, required, className = "", children }) {
  return (
    <div className={className}>
      <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">
        {label}{required && <span className="text-rose-500 ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}

function MiniLabel({ children }) {
  return <label className="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">{children}</label>;
}

function AddButton({ onClick, label }) {
  return (
    <button onClick={onClick} type="button"
      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-indigo-600 border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-all active:scale-95">
      <Plus size={13} strokeWidth={2.5} /> {label}
    </button>
  );
}