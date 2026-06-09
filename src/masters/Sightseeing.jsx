import React, { useState, useRef, useEffect } from "react";
import {
  Map, ChevronDown, ChevronRight, Search, Plus, Eye, X, 
  Clock, Building2, Globe, Hash, Info, UploadCloud,
  Bold, Italic, Underline, Strikethrough, AlignLeft, 
  AlignCenter, List, ListOrdered, Eraser, MapPin
} from "lucide-react";
import { Link } from "react-router-dom";

// =========================================================================
// 🌟 CUSTOM RICH TEXT EDITOR (For Description & Remarks)
// =========================================================================
const RichTextEditor = ({ name, initialValue, onChange, placeholder }) => {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== initialValue) {
      editorRef.current.innerHTML = initialValue || '';
    }
  }, []); 

  const handleInput = () => {
    if (onChange && editorRef.current) {
      onChange({ target: { name, value: editorRef.current.innerHTML } });
    }
  };

  const executeCommand = (e, command, arg = null) => {
    e.preventDefault(); 
    document.execCommand(command, false, arg);
    editorRef.current.focus();
    handleInput();
  };

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white hover:bg-slate-50 focus-within:bg-white shadow-sm focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all duration-300">
      <div className="bg-slate-50 border-b border-slate-200 px-3 py-2 flex flex-wrap items-center gap-x-1.5 gap-y-2 text-slate-600 text-sm select-none">
        <button type="button" onMouseDown={(e) => executeCommand(e, 'formatBlock', 'P')} className="flex items-center gap-1.5 px-2 py-1 hover:bg-slate-200 rounded-lg font-semibold text-slate-700 transition-colors">
          Normal <ChevronDown size={14} className="text-slate-400"/>
        </button>
        <div className="w-px h-5 bg-slate-300 hidden sm:block mx-1"></div>
        <div className="flex items-center gap-0.5">
          <button type="button" onMouseDown={(e) => executeCommand(e, 'bold')} className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700" title="Bold"><Bold size={15} strokeWidth={2.5} /></button>
          <button type="button" onMouseDown={(e) => executeCommand(e, 'italic')} className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700" title="Italic"><Italic size={15} /></button>
          <button type="button" onMouseDown={(e) => executeCommand(e, 'underline')} className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700" title="Underline"><Underline size={15} /></button>
          <button type="button" onMouseDown={(e) => executeCommand(e, 'strikeThrough')} className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700" title="Strikethrough"><Strikethrough size={15} /></button>
        </div>
        <div className="w-px h-5 bg-slate-300 hidden sm:block mx-1"></div>
        <div className="flex items-center gap-0.5">
          <button type="button" onMouseDown={(e) => executeCommand(e, 'justifyLeft')} className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700"><AlignLeft size={15} /></button>
          <button type="button" onMouseDown={(e) => executeCommand(e, 'justifyCenter')} className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700"><AlignCenter size={15} /></button>
          <button type="button" onMouseDown={(e) => executeCommand(e, 'insertUnorderedList')} className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700"><List size={15} /></button>
          <button type="button" onMouseDown={(e) => executeCommand(e, 'insertOrderedList')} className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700"><ListOrdered size={15} /></button>
        </div>
        <div className="w-px h-5 bg-slate-300 hidden sm:block mx-1"></div>
        <button type="button" onMouseDown={(e) => executeCommand(e, 'removeFormat')} className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700"><Eraser size={15} /></button>
      </div>
      <div 
        ref={editorRef} contentEditable={true} suppressContentEditableWarning={true}
        onInput={handleInput} onBlur={handleInput}
        className="w-full p-4 focus:outline-none overflow-y-auto text-[14px] text-slate-700 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-2 [&_b]:font-bold [&_i]:italic [&_u]:underline leading-relaxed"
        style={{ minHeight: '120px', ':empty:before': { content: 'attr(placeholder)', color: '#94a3b8', pointerEvents: 'none', display: 'block' } }}
        placeholder={placeholder}
      ></div>
    </div>
  );
};

// ─── Sample Data ─────────────────────────────────────────────────────────────
const destinations = [
  { id: 1, name: "Andaman Island", attractions: 21, cities: 3, cityList: ["Port Blair", "Havelock Island", "Neil Island"], flag: "🏝️" },
  { id: 2, name: "Azerbaijan", attractions: 6, cities: 1, cityList: ["Baku"], flag: "🏔️" },
  { id: 3, name: "Goa", attractions: 4, cities: 1, cityList: ["Panaji"], flag: "🌊" },
  { id: 4, name: "Rajasthan", attractions: 18, cities: 4, cityList: ["Jaipur", "Udaipur", "Jodhpur", "Jaisalmer"], flag: "🏰" },
  { id: 5, name: "Kerala", attractions: 12, cities: 2, cityList: ["Kochi", "Munnar"], flag: "🌴" },
];

const allCities = {
  "Andaman Island": ["Port Blair", "Havelock Island", "Neil Island"],
  Azerbaijan: ["Baku"],
  Goa: ["Panaji"],
  Rajasthan: ["Jaipur", "Udaipur", "Jodhpur", "Jaisalmer"],
  Kerala: ["Kochi", "Munnar"],
};

const emptyForm = { destination: "", city: "", title: "", sequence: 1, estimatedHours: "", suggestedStartTime: "", image: null, description: "", remarks: "" };

const inputCls = "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder-slate-400 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10";

// ─── Modal Component ──────────────────────────────────────────────────────────
function AddSightseeingModal({ isOpen, onClose, prefillDestination }) {
  const [form, setForm] = useState({ ...emptyForm, destination: prefillDestination || "" });
  const [imagePreview, setImagePreview] = useState(null);
  const [resetKey, setResetKey] = useState(Date.now());
  const fileRef = useRef();

  const availableCities = form.destination ? allCities[form.destination] || [] : [];

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value, ...(field === "destination" ? { city: "" } : {}) }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm((prev) => ({ ...prev, image: file }));
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleClose = () => {
    setForm({ ...emptyForm });
    setImagePreview(null);
    setResetKey(Date.now());
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 overflow-y-auto custom-scrollbar">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={handleClose}></div>
      
      <div className="relative bg-white w-full max-w-6xl shadow-2xl mt-4 sm:mt-10 mb-10 rounded-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-blue-600 px-8 py-5 flex justify-between items-center text-white">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500 rounded-xl">
              <Map size={20} strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-lg font-bold m-0">Add New Sightseeing</h2>
              <p className="text-xs text-blue-100 font-medium m-0 mt-0.5">Fill in the attraction details</p>
            </div>
          </div>
          <button onClick={handleClose} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors active:scale-95"><X size={20} /></button>
        </div>

        {/* Modal Body */}
        <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-10 bg-slate-50/50">
          
          {/* ── LEFT COLUMN ── */}
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">Destination <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <Globe size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <select className={`${inputCls} pl-10 appearance-none pr-8 cursor-pointer`} value={form.destination} onChange={(e) => handleChange("destination", e.target.value)}>
                    <option value="">Select destination</option>
                    {destinations.map((d) => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">City <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <Building2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <select className={`${inputCls} pl-10 appearance-none pr-8 cursor-pointer disabled:opacity-60`} value={form.city} onChange={(e) => handleChange("city", e.target.value)} disabled={!form.destination}>
                    <option value="">Select city</option>
                    {availableCities.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">Title <span className="text-rose-500">*</span></label>
              <input type="text" className={inputCls} placeholder="e.g. Radhanagar Beach Sunset Walk" value={form.title} onChange={(e) => handleChange("title", e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">Sequence</label>
                <div className="relative">
                  <Hash size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input type="number" min={1} className={`${inputCls} pl-10`} value={form.sequence} onChange={(e) => handleChange("sequence", e.target.value)} />
                </div>
                <p className="text-xs text-slate-400 font-medium mt-2">Order of appearance in itinerary</p>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">Estimated Hours</label>
                <input type="text" className={inputCls} placeholder="e.g. 2.5" value={form.estimatedHours} onChange={(e) => handleChange("estimatedHours", e.target.value)} />
                <p className="text-xs text-slate-400 font-medium mt-2">Duration in hours</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">Suggested Start Time</label>
              <div className="relative max-w-[200px]">
                <Clock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input type="time" className={`${inputCls} pl-10 cursor-pointer`} value={form.suggestedStartTime} onChange={(e) => handleChange("suggestedStartTime", e.target.value)} />
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="space-y-6">
            
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">Attraction Image</label>
              <div className="border-2 border-dashed border-slate-300 bg-white rounded-2xl p-6 text-center hover:border-blue-400 hover:bg-slate-50 transition-all cursor-pointer group" onClick={() => fileRef.current?.click()}>
                {imagePreview ? (
                  <div className="flex flex-col items-center">
                    <img src={imagePreview} alt="preview" className="max-h-40 w-full object-cover rounded-xl shadow-sm border border-slate-200 mb-3" />
                    <button className="text-xs font-bold text-rose-500 bg-rose-50 px-3 py-1.5 rounded-lg" onClick={(e) => { e.stopPropagation(); setImagePreview(null); setForm(p => ({ ...p, image: null })); }}>Remove Image</button>
                  </div>
                ) : (
                  <div className="py-4">
                    <UploadCloud size={40} className="mx-auto text-blue-500 mb-3 group-hover:scale-110 transition-transform" />
                    <h4 className="text-sm font-bold text-slate-800 mb-1">Click to upload image</h4>
                    <p className="text-xs text-slate-500 font-medium m-0">JPG, PNG up to 2MB. Recommended: 800×600px</p>
                  </div>
                )}
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
              </div>
              <div className="mt-3 flex items-start gap-2.5 rounded-xl bg-amber-50 border border-amber-100 p-3">
                <Info size={14} className="mt-0.5 flex-shrink-0 text-amber-500" />
                <p className="text-xs text-amber-700 leading-relaxed m-0 font-medium">Use royalty-free images only from Unsplash, Pexels, or Pixabay.</p>
              </div>
            </div>

            {/* Rich Text Editors */}
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">Description</label>
              <RichTextEditor key={`${resetKey}-desc`} name="description" initialValue={form.description} onChange={handleInputChange} placeholder="Describe this sightseeing experience..." />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">Remarks</label>
              <RichTextEditor key={`${resetKey}-rem`} name="remarks" initialValue={form.remarks} onChange={handleInputChange} placeholder="Any special notes or tips..." />
            </div>

          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-white px-8 py-5 border-t border-slate-200 flex justify-end gap-3 rounded-b-2xl">
          <button onClick={handleClose} className="px-6 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-700 hover:bg-slate-50 transition-colors text-sm">Cancel</button>
          <button className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-500/20 transition-all active:scale-95">Save Sightseeing</button>
        </div>
      </div>
    </div>
  );
}

// ─── Destination Row ──────────────────────────────────────────────────────────
function DestinationRow({ dest, onAddSightseeing }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="group border-b border-slate-100 last:border-0">
      <div 
        className="flex flex-col md:flex-row md:items-center justify-between p-5 hover:bg-slate-50 transition-colors cursor-pointer gap-4"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-4">
          <button className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-100 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
            {expanded ? <ChevronDown size={16} strokeWidth={2.5} /> : <ChevronRight size={16} strokeWidth={2.5} />}
          </button>
          <span className="text-2xl drop-shadow-sm">{dest.flag}</span>
          <div>
            <h3 className="text-[16px] font-extrabold text-slate-900 m-0 group-hover:text-blue-600 transition-colors">{dest.name}</h3>
            <p className="text-sm text-slate-500 font-medium m-0 mt-0.5">
              {dest.attractions} attractions &nbsp;·&nbsp; {dest.cities} cities
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 pl-16 md:pl-0 opacity-90 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); onAddSightseeing(dest.name); }}
            className="flex items-center gap-1.5 border border-blue-500 text-blue-600 hover:bg-blue-600 hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <Plus size={14} strokeWidth={2.5} /> Add Sightseeing
          </button>
          <button className="flex items-center gap-1.5 border border-slate-300 text-slate-700 hover:bg-slate-100 px-4 py-2 rounded-xl text-xs font-bold transition-colors shadow-sm">
            <Eye size={14} /> View Dest.
          </button>
        </div>
      </div>

      {/* Expanded city list */}
      {expanded && (
        <div className="bg-slate-50/50 border-t border-slate-100 px-5 sm:px-16 py-4 flex flex-wrap items-center gap-2.5">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">Cities Covered:</span>
          {dest.cityList.map((city) => (
            <span key={city} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-sm">
              <Building2 size={12} className="text-blue-500" /> {city}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function SightseeingMaster() {
  const [modalOpen, setModalOpen] = useState(false);
  const [prefillDest, setPrefillDest] = useState("");
  const [search, setSearch] = useState("");
  const [filterDest, setFilterDest] = useState("");
  const [filterCity, setFilterCity] = useState("");

  const openModal = (dest = "") => {
    setPrefillDest(dest);
    setModalOpen(true);
  };

  const filtered = destinations.filter((d) => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase());
    const matchDest = !filterDest || d.name === filterDest;
    const matchCity = !filterCity || d.cityList.includes(filterCity);
    return matchSearch && matchDest && matchCity;
  });

  const allCityOptions = [...new Set(destinations.flatMap((d) => d.cityList))].sort();

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans p-4 sm:p-6 lg:p-8">
      
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-600 text-white rounded-2xl shadow-sm shadow-blue-600/20">
            <Map size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight m-0">Sightseeing Master</h1>
            <p className="text-sm text-slate-500 mt-1 font-medium m-0">Configure attractions and sightseeing details for your packages.</p>
          </div>
        </div>
        <div className="text-sm font-medium flex items-center gap-2">
          <Link to="/" className="text-blue-600 hover:text-blue-800 transition-colors">Home</Link>
          <span className="text-slate-300">/</span><span className="text-slate-500">Masters</span><span className="text-slate-300">/</span>
          <span className="text-slate-700 bg-white border border-slate-200 px-3 py-1 rounded-lg shadow-sm">Sightseeing</span>
        </div>
      </div>

      {/* ── STATS ROW ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Destinations", value: destinations.length, color: "text-blue-600", border: "border-blue-200", bg: "bg-blue-50" },
          { label: "Total Attractions", value: destinations.reduce((a, d) => a + d.attractions, 0), color: "text-emerald-600", border: "border-emerald-200", bg: "bg-emerald-50" },
          { label: "Cities Covered", value: destinations.reduce((a, d) => a + d.cities, 0), color: "text-violet-600", border: "border-violet-200", bg: "bg-violet-50" },
        ].map(({ label, value, color, bg, border }) => (
          <div key={label} className={`bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4`}>
            <div className={`w-14 h-14 rounded-full flex items-center justify-center border-2 ${bg} ${border}`}>
               <span className={`text-xl font-black ${color}`}>{value}</span>
            </div>
            <div>
               <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── MAIN CARD ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Filters Top Bar */}
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            {/* Search */}
            <div className="relative flex-1 min-w-[280px]">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700 shadow-sm"
                placeholder="Search sightseeing..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Destination filter */}
            <div className="relative min-w-[200px]">
              <Globe size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <select
                className="w-full pl-10 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 appearance-none shadow-sm cursor-pointer"
                value={filterDest}
                onChange={(e) => { setFilterDest(e.target.value); setFilterCity(""); }}
              >
                <option value="">All Destinations</option>
                {destinations.map((d) => <option key={d.id} value={d.name}>{d.name}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>

            {/* City filter */}
            <div className="relative min-w-[180px]">
              <Building2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <select
                className="w-full pl-10 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 appearance-none shadow-sm cursor-pointer"
                value={filterCity}
                onChange={(e) => setFilterCity(e.target.value)}
              >
                <option value="">All Cities</option>
                {(filterDest ? allCities[filterDest] || [] : allCityOptions).map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <button onClick={() => openModal()} className="flex items-center justify-center gap-2 bg-[#007bff] hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95 whitespace-nowrap w-full sm:w-auto">
            <Plus size={16} strokeWidth={2.5} /> Add New Sightseeing
          </button>
        </div>

        {/* List Section */}
        <div className="bg-white">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">
              Destinations ({filtered.length})
            </h2>
            {(search || filterDest || filterCity) && (
              <button className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors" onClick={() => { setSearch(""); setFilterDest(""); setFilterCity(""); }}>
                Clear filters
              </button>
            )}
          </div>

          {filtered.length > 0 ? (
            filtered.map((dest) => (
              <DestinationRow key={dest.id} dest={dest} onAddSightseeing={openModal} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 mb-4 border border-slate-200">
                <Map size={28} className="text-slate-400" />
              </div>
              <p className="text-base font-bold text-slate-700">No destinations found</p>
              <p className="text-sm text-slate-500 mt-1 font-medium">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>

      <AddSightseeingModal isOpen={modalOpen} onClose={() => setModalOpen(false)} prefillDestination={prefillDest} />
    </div>
  );
}




// import React, { useState, useRef, useEffect } from 'react';
// import { 
//   Search, Plus, Eye, X, MapPin, ChevronDown, ChevronRight, 
//   Map, Globe, Hash, Clock, AlignLeft, Bold, Italic, Underline, 
//   Strikethrough, AlignCenter, AlignRight, List, ListOrdered, Eraser
// } from 'lucide-react';
// import { Link } from 'react-router-dom';

// // =========================================================================
// // 🌟 CUSTOM RICH TEXT EDITOR (For Description & Remarks)
// // =========================================================================
// const RichTextEditor = ({ name, initialValue, onChange, placeholder }) => {
//   const editorRef = useRef(null);

//   useEffect(() => {
//     if (editorRef.current && editorRef.current.innerHTML !== initialValue) {
//       editorRef.current.innerHTML = initialValue || '';
//     }
//   }, []); 

//   const handleInput = () => {
//     if (onChange && editorRef.current) {
//       onChange({ target: { name, value: editorRef.current.innerHTML } });
//     }
//   };

//   const executeCommand = (e, command, arg = null) => {
//     e.preventDefault(); 
//     document.execCommand(command, false, arg);
//     editorRef.current.focus();
//     handleInput();
//   };

//   return (
//     <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50 hover:bg-slate-100/50 focus-within:bg-white shadow-sm focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all duration-300">
//       <div className="bg-white border-b border-slate-200 px-3 py-2 flex flex-wrap items-center gap-x-1.5 gap-y-2 text-slate-600 text-sm select-none">
//         <button type="button" onMouseDown={(e) => executeCommand(e, 'formatBlock', 'P')} className="flex items-center gap-1.5 px-2 py-1 hover:bg-slate-100 rounded-lg font-semibold text-slate-700 transition-colors">
//           Normal <ChevronDown size={14} className="text-slate-400"/>
//         </button>
//         <div className="w-px h-5 bg-slate-200 hidden sm:block mx-1"></div>
//         <div className="flex items-center gap-0.5">
//           <button type="button" onMouseDown={(e) => executeCommand(e, 'bold')} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-700" title="Bold"><Bold size={15} strokeWidth={2.5} /></button>
//           <button type="button" onMouseDown={(e) => executeCommand(e, 'italic')} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-700" title="Italic"><Italic size={15} /></button>
//           <button type="button" onMouseDown={(e) => executeCommand(e, 'underline')} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-700" title="Underline"><Underline size={15} /></button>
//           <button type="button" onMouseDown={(e) => executeCommand(e, 'strikeThrough')} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-700" title="Strikethrough"><Strikethrough size={15} /></button>
//         </div>
//         <div className="w-px h-5 bg-slate-200 hidden sm:block mx-1"></div>
//         <div className="flex items-center gap-0.5">
//           <button type="button" onMouseDown={(e) => executeCommand(e, 'justifyLeft')} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-700"><AlignLeft size={15} /></button>
//           <button type="button" onMouseDown={(e) => executeCommand(e, 'justifyCenter')} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-700"><AlignCenter size={15} /></button>
//           <button type="button" onMouseDown={(e) => executeCommand(e, 'insertUnorderedList')} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-700"><List size={15} /></button>
//           <button type="button" onMouseDown={(e) => executeCommand(e, 'insertOrderedList')} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-700"><ListOrdered size={15} /></button>
//         </div>
//         <div className="w-px h-5 bg-slate-200 hidden sm:block mx-1"></div>
//         <button type="button" onMouseDown={(e) => executeCommand(e, 'removeFormat')} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-700"><Eraser size={15} /></button>
//       </div>
//       <div 
//         ref={editorRef} contentEditable={true} suppressContentEditableWarning={true}
//         onInput={handleInput} onBlur={handleInput}
//         className="w-full p-4 focus:outline-none overflow-y-auto text-[14px] text-slate-700 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-2 [&_b]:font-bold [&_i]:italic [&_u]:underline leading-relaxed"
//         style={{ minHeight: '120px', ':empty:before': { content: 'attr(placeholder)', color: '#94a3b8', pointerEvents: 'none', display: 'block' } }}
//         placeholder={placeholder}
//       ></div>
//     </div>
//   );
// };

// // =========================================================================
// // MOCK DATA
// // =========================================================================
// const DESTINATIONS = [
//   { id: 1, name: "1", attractions: 4, cities: 1, cityList: ["City 1"] },
//   { id: 2, name: "Andaman Island", attractions: 21, cities: 3, cityList: ["Port Blair", "Havelock", "Neil Island"] },
//   { id: 3, name: "Azerbaijan", attractions: 6, cities: 1, cityList: ["Baku"] },
//   { id: 4, name: "Butwal", attractions: 1, cities: 1, cityList: ["Butwal City"] },
//   { id: 5, name: "Goa", attractions: 4, cities: 1, cityList: ["North Goa", "South Goa"] },
// ];

// const EMPTY_FORM = { destination: "", city: "", title: "", sequence: "1", estimatedHours: "", suggestedStartTime: "", description: "", remarks: "" };

// // =========================================================================
// // MAIN COMPONENT
// // =========================================================================
// export default function SightseeingMaster() {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterDest, setFilterDest] = useState("");
//   const [filterCity, setFilterCity] = useState("");
  
//   const [expanded, setExpanded] = useState({});
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [resetKey, setResetKey] = useState(Date.now());
//   const [formData, setFormData] = useState({ ...EMPTY_FORM });

//   // Filtering Logic
//   const filteredDestinations = DESTINATIONS.filter(d => {
//     const matchSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchDest = filterDest === "" || d.name === filterDest;
//     return matchSearch && matchDest;
//   });

//   const availableCities = formData.destination ? DESTINATIONS.find(d => d.name === formData.destination)?.cityList || [] : [];
//   const allCitiesDropdown = [...new Set(DESTINATIONS.flatMap(d => d.cityList))].sort();

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ 
//       ...prev, 
//       [name]: value,
//       ...(name === "destination" ? { city: "" } : {}) // Reset city if destination changes
//     }));
//   };

//   const openModal = (prefillDest = "") => {
//     setFormData({ ...EMPTY_FORM, destination: prefillDest });
//     setResetKey(Date.now());
//     setIsModalOpen(true);
//   };

//   const toggleExpand = (id) => {
//     setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
//   };

//   const handleSave = (e) => {
//     e.preventDefault();
//     console.log("Saving Sightseeing Data:", formData);
//     setIsModalOpen(false);
//   };

//   return (
//     <div className="min-h-screen bg-[#f8fafc] font-sans p-4 sm:p-6 lg:p-8">
      
//       {/* ── HEADER ── */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
//         <div className="flex items-center gap-3">
//           <div className="p-2.5 bg-slate-800 text-white rounded-xl shadow-sm">
//             <Map size={24} strokeWidth={2} />
//           </div>
//           <div>
//             <h1 className="text-2xl font-bold text-slate-900 tracking-tight m-0">Sightseeing Master</h1>
//             <p className="text-sm text-slate-500 mt-0.5 m-0 font-medium">Organized by destinations</p>
//           </div>
//         </div>
//         <div className="text-sm font-medium flex items-center gap-2">
//           <Link to="/" className="text-blue-600 hover:text-blue-800 transition-colors">Home</Link>
//           <span className="text-slate-300">/</span><span className="text-slate-500">Masters</span><span className="text-slate-300">/</span>
//           <span className="text-slate-700 bg-white border border-slate-200 px-2.5 py-0.5 rounded-md shadow-sm">Sightseeing</span>
//         </div>
//       </div>

//       {/* ── MAIN CARD ── */}
//       <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        
//         {/* Filters & Actions Top Bar */}
//         <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//           <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
//             {/* Search Input */}
//             <div className="relative flex-1 min-w-[240px]">
//               <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
//                 <Search size={16} />
//               </div>
//               <input 
//                 type="text" placeholder="Search sightseeing..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700 shadow-sm"
//               />
//             </div>

//             {/* Destination Filter */}
//             <div className="relative min-w-[180px]">
//               <select value={filterDest} onChange={(e) => setFilterDest(e.target.value)} className="w-full pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 appearance-none shadow-sm cursor-pointer">
//                 <option value="">All Destinations</option>
//                 {DESTINATIONS.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
//               </select>
//               <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
//             </div>

//             {/* City Filter */}
//             <div className="relative min-w-[150px]">
//               <select value={filterCity} onChange={(e) => setFilterCity(e.target.value)} className="w-full pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 appearance-none shadow-sm cursor-pointer">
//                 <option value="">All Cities</option>
//                 {allCitiesDropdown.map(c => <option key={c} value={c}>{c}</option>)}
//               </select>
//               <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
//             </div>
//           </div>

//           {/* Add Button */}
//           <button onClick={() => openModal()} className="flex items-center justify-center gap-2 bg-[#007bff] hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95 whitespace-nowrap w-full sm:w-auto">
//             <Plus size={16} strokeWidth={2.5} /> Add New Sightseeing
//           </button>
//         </div>

//         {/* Accordion List */}
//         <div className="divide-y divide-slate-100">
//           {filteredDestinations.map(dest => (
//             <div key={dest.id} className="group">
//               <div 
//                 className="flex flex-col md:flex-row md:items-center justify-between p-5 hover:bg-slate-50 transition-colors cursor-pointer gap-4"
//                 onClick={() => toggleExpand(dest.id)}
//               >
//                 <div className="flex items-center gap-4">
//                   <button className="w-6 h-6 flex items-center justify-center rounded bg-slate-100 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
//                     {expanded[dest.id] ? <ChevronDown size={16} /> : <Plus size={16} />}
//                   </button>
//                   <MapPin size={20} className="text-slate-400" />
//                   <div>
//                     <h3 className="text-[15px] font-bold text-blue-600 m-0 group-hover:underline">{dest.name}</h3>
//                   </div>
//                   <span className="text-slate-500 text-sm ml-2 hidden sm:inline-block">
//                     {dest.attractions} attractions ({dest.cities} {dest.cities === 1 ? 'city' : 'cities'})
//                   </span>
//                 </div>

//                 <div className="flex items-center gap-2 pl-14 md:pl-0">
//                   <button onClick={(e) => { e.stopPropagation(); openModal(dest.name); }} className="flex items-center gap-1.5 border border-blue-500 text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">
//                     <Plus size={14} strokeWidth={2.5} /> Add Sightseeing
//                   </button>
//                   <button onClick={(e) => e.stopPropagation()} className="flex items-center gap-1.5 border border-slate-300 text-slate-600 hover:bg-slate-100 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shadow-sm">
//                     <Eye size={14} /> View Dest.
//                   </button>
//                 </div>
//               </div>

//               {/* Expanded Content View (Shows Cities) */}
//               {expanded[dest.id] && (
//                 <div className="bg-slate-50/50 border-t border-slate-100 px-5 sm:px-16 py-4 flex flex-wrap gap-2">
//                   <span className="text-xs font-bold text-slate-400 uppercase mr-2 flex items-center">Cities Covered:</span>
//                   {dest.cityList.map(city => (
//                     <span key={city} className="bg-white border border-slate-200 text-slate-700 px-3 py-1 rounded-md text-xs font-semibold shadow-sm flex items-center gap-1.5">
//                       <Building2 size={12} className="text-blue-400"/> {city}
//                     </span>
//                   ))}
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* ========================================================================= */}
//       {/* 🗺️ CREATE SIGHTSEEING MODAL (Extra Large with Rich Text Editors)        */}
//       {/* ========================================================================= */}
//       {isModalOpen && (
//         <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 overflow-y-auto custom-scrollbar">
//           <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)}></div>
          
//           <div className="relative bg-white w-full max-w-6xl shadow-2xl mt-4 sm:mt-8 mb-10 rounded-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
            
//             {/* Modal Header */}
//             <div className="bg-white border-b border-slate-100 px-8 py-5 flex justify-between items-center">
//               <div className="flex items-center gap-3">
//                 <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
//                   <Map size={20} strokeWidth={2.5} />
//                 </div>
//                 <div>
//                   <h2 className="text-lg font-bold text-slate-900 m-0">Create Sightseeing</h2>
//                   <p className="text-xs text-slate-500 font-medium m-0 mt-0.5">Sightseeing Information</p>
//                 </div>
//               </div>
//               <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:bg-slate-100 p-2 rounded-full transition-colors active:scale-95"><X size={20} /></button>
//             </div>

//             {/* Modal Body */}
//             <form onSubmit={handleSave}>
//               <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-10 bg-[#fcfdff]">
                
//                 {/* ── LEFT COLUMN: Basic Inputs ── */}
//                 <div className="space-y-6">
//                   {/* Destination */}
//                   <div>
//                     <label className="block text-sm font-bold text-slate-800 mb-2">Destination <span className="text-rose-500">*</span></label>
//                     <div className="relative">
//                       <select name="destination" value={formData.destination} onChange={handleInputChange} required className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-sm text-slate-700 appearance-none transition-all cursor-pointer">
//                         <option value="">Select Destination</option>
//                         {DESTINATIONS.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
//                       </select>
//                       <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
//                     </div>
//                   </div>

//                   {/* City */}
//                   <div>
//                     <label className="block text-sm font-bold text-slate-800 mb-2">City <span className="text-rose-500">*</span></label>
//                     <div className="relative">
//                       <select name="city" value={formData.city} onChange={handleInputChange} required disabled={!formData.destination} className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-sm text-slate-700 appearance-none transition-all cursor-pointer disabled:opacity-60">
//                         <option value="">Select City</option>
//                         {availableCities.map(c => <option key={c} value={c}>{c}</option>)}
//                       </select>
//                       <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
//                     </div>
//                     <p className="text-xs text-slate-400 font-medium mt-2">Cities will be loaded based on selected destination</p>
//                   </div>

//                   {/* Title */}
//                   <div>
//                     <label className="block text-sm font-bold text-slate-800 mb-2">Title <span className="text-rose-500">*</span></label>
//                     <input type="text" name="title" value={formData.title} onChange={handleInputChange} required placeholder="Enter sightseeing title" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-sm text-slate-800 transition-all" />
//                   </div>

//                   {/* Sequence */}
//                   <div>
//                     <label className="block text-sm font-bold text-slate-800 mb-2">Sequence <span className="text-rose-500">*</span></label>
//                     <input type="number" name="sequence" value={formData.sequence} onChange={handleInputChange} required min="1" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-sm text-slate-800 transition-all" />
//                     <p className="text-xs text-slate-400 font-medium mt-2">Lower sequence numbers will appear first in itineraries</p>
//                   </div>

//                   {/* Estimated Hours */}
//                   <div>
//                     <label className="block text-sm font-bold text-slate-800 mb-2">Estimated Hours</label>
//                     <input type="text" name="estimatedHours" value={formData.estimatedHours} onChange={handleInputChange} placeholder="e.g., 2.5 for 2 hours 30 minutes" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-sm text-slate-800 transition-all" />
//                     <p className="text-xs text-slate-400 font-medium mt-2">Duration in hours (e.g., 2.5 for 2 hours 30 minutes)</p>
//                   </div>

//                   {/* Suggested Start Time */}
//                   <div>
//                     <label className="block text-sm font-bold text-slate-800 mb-2">Suggested Start Time</label>
//                     <input type="time" name="suggestedStartTime" value={formData.suggestedStartTime} onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-sm text-slate-800 transition-all cursor-pointer" />
//                   </div>
//                 </div>

//                 {/* ── RIGHT COLUMN: Rich Text Editors ── */}
//                 <div className="space-y-6">
//                   <div>
//                     <label className="block text-sm font-bold text-slate-800 mb-2">Description</label>
//                     <RichTextEditor key={`${resetKey}-desc`} name="description" initialValue={formData.description} onChange={handleInputChange} placeholder="Detail the description here..." />
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-bold text-slate-800 mb-2">Remarks</label>
//                     <RichTextEditor key={`${resetKey}-rem`} name="remarks" initialValue={formData.remarks} onChange={handleInputChange} placeholder="Add any special remarks or notes here..." />
//                   </div>
//                 </div>

//               </div>

//               {/* Modal Footer */}
//               <div className="bg-slate-50 px-8 py-5 border-t border-slate-200 flex justify-end gap-3 rounded-b-2xl">
//                 <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all shadow-sm active:scale-95">
//                   Cancel
//                 </button>
//                 <button type="submit" className="px-8 py-2.5 bg-[#007bff] hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-blue-500/30 hover:shadow-blue-500/50 active:scale-95">
//                   Save Sightseeing
//                 </button>
//               </div>
//             </form>

//           </div>
//         </div>
//       )}

//     </div>
//   );
// }