








// import React, { useState, useEffect, useMemo } from "react";
// import {
//   Building2, Plus, Search, Trash2, Edit2, X, Check,
//   MapPin, Globe, ChevronDown, AlertCircle, Loader2,
//   Home, ChevronRight, RefreshCw
// } from "lucide-react";
// import { cityService }      from "../../services/cityService";
// import { countryService }    from "../../services/countryService";
// import { destinationService } from "../../services/destinationService";

// /* ─── TOAST ──────────────────────────────────────────────── */
// function Toast({ msg, type, onClose }) {
//   useEffect(() => {
//     const t = setTimeout(onClose, 3500);
//     return () => clearTimeout(t);
//   }, [onClose]);
//   return (
//     <div className={`fixed top-4 right-4 left-4 sm:left-auto sm:right-5 sm:top-5 z-[999]
//       flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl sm:max-w-sm
//       ${type === "success"
//         ? "bg-green-50 border-green-200 text-green-800"
//         : "bg-red-50 border-red-200 text-red-800"}`}
//       style={{ animation: "slideIn .3s ease both" }}>
//       {type === "success"
//         ? <Check size={16} className="text-green-600 flex-shrink-0" />
//         : <AlertCircle size={16} className="text-red-500 flex-shrink-0" />}
//       <p className="text-sm font-semibold flex-1">{msg}</p>
//       <button onClick={onClose} className="opacity-50 hover:opacity-100 ml-1">
//         <X size={14} />
//       </button>
//     </div>
//   );
// }

// /* ─── LABEL + INPUT + SELECT helpers ────────────────────── */
// function Label({ children, required }) {
//   return (
//     <label className="block text-xs font-semibold text-slate-600 mb-1.5">
//       {children}{required && <span className="text-rose-500 ml-0.5">*</span>}
//     </label>
//   );
// }
// function FInput({ error, ...props }) {
//   return (
//     <div>
//       <input
//         className={`w-full border rounded-xl px-3 py-2.5 text-sm transition-all
//           focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400
//           ${error ? "border-red-300 bg-red-50/50" : "border-slate-200 bg-white hover:border-slate-300"}`}
//         {...props}
//       />
//       {error && (
//         <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
//           <AlertCircle size={10} />{error}
//         </p>
//       )}
//     </div>
//   );
// }
// function FSelect({ error, children, ...props }) {
//   return (
//     <div>
//       <select
//         className={`w-full border rounded-xl px-3 py-2.5 text-sm bg-white transition-all
//           focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400
//           ${error ? "border-red-300" : "border-slate-200 hover:border-slate-300"}`}
//         {...props}
//       >
//         {children}
//       </select>
//       {error && (
//         <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
//           <AlertCircle size={10} />{error}
//         </p>
//       )}
//     </div>
//   );
// }

// /* ─── ADD / EDIT MODAL ───────────────────────────────────── */
// function CityModal({ editing, onClose, onSave }) {

//   // ── Cascade state ─────────────────────────────────────────
//   const [countries,     setCountries]     = useState([]);
//   const [destinations,  setDestinations]  = useState([]);
//   const [countryId,     setCountryId]     = useState(editing?.countryId     || "");
//   const [destinationId, setDestinationId] = useState(editing?.destinationId || "");
//   const [name,          setName]          = useState(editing?.name || "");
//   const [code,          setCode]          = useState(editing?.code || "");
//   const [errors,        setErrors]        = useState({});
//   const [saving,        setSaving]        = useState(false);
//   const [loadingDest,   setLoadingDest]   = useState(false);

//   // ── Load countries on mount ────────────────────────────────
//   // Pehle sirf 2 placeholder options dikhte hain:
//   //   1. "Select Country"
//   //   2. "Select Destination"
//   // Jab country click kare tab getAllCountries() call hoga
//   const [countriesLoaded, setCountriesLoaded] = useState(false);
//   const [loadingCountry,  setLoadingCountry]  = useState(false);

//   const loadCountries = async () => {
//     if (countriesLoaded || loadingCountry) return; // ek baar hi load karo
//     setLoadingCountry(true);
//     try {
//       const res = await countryService.getAllCountries();
//       const data = res.data?.data || res.data || [];
//       setCountries(Array.isArray(data) ? data : []);
//       setCountriesLoaded(true);
//     } catch {
//       setCountries([]);
//     } finally {
//       setLoadingCountry(false);
//     }
//   };

//   // editing mode mein auto-load
//   useEffect(() => {
//     if (editing?.countryId) loadCountries();
//   }, []);

//   // ── If editing — pre-fill destinations ────────────────────
//   useEffect(() => {
//     if (editing?.countryId) {
//       loadDestinations(editing.countryId);
//     }
//   }, [editing]);

//   // ── Load destinations when country changes ─────────────────
//   const loadDestinations = async (cId) => {
//     setDestinations([]);
//     setDestinationId("");
//     if (!cId) return;
//     setLoadingDest(true);
//     try {
//       const res = await destinationService.getAllDestinations(cId);
//       const data = res.data?.data || res.data || [];
//       setDestinations(Array.isArray(data) ? data : []);
//       // editing mode mein destination re-set karo
//       if (editing?.destinationId) setDestinationId(editing.destinationId);
//     } catch {
//       setDestinations([]);
//     } finally {
//       setLoadingDest(false);
//     }
//   };

//   const handleCountryChange = (cId) => {
//     setCountryId(cId);
//     setDestinationId("");
//     loadDestinations(cId);
//   };

//   // ── Validate ───────────────────────────────────────────────
//   const validate = () => {
//     const e = {};
//     if (!countryId)     e.countryId     = "Country required";
//     if (!destinationId) e.destinationId = "Destination required";
//     if (!name.trim())   e.name          = "City name required";
//     setErrors(e);
//     return Object.keys(e).length === 0;
//   };

//   // ── Save ───────────────────────────────────────────────────
//   const handleSave = async () => {
//     if (!validate()) return;
//     setSaving(true);
//     try {
//       if (editing) {
//         await cityService.updateCity(editing.id, countryId, destinationId, name, code);
//       } else {
//         await cityService.createCity(countryId, destinationId, name, code);
//       }
//       onSave();
//     } catch (err) {
//       setErrors({ api: err?.response?.data?.message || "Failed to save. Try again." });
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
//       style={{ background: "rgba(15,23,42,0.55)", backdropFilter: "blur(4px)" }}
//       onClick={e => e.target === e.currentTarget && onClose()}>
//       <div className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl"
//         style={{ animation: "slideUp .25s ease both" }}>

//         {/* Modal Header */}
//         <div className="flex items-center justify-between px-5 py-4
//           bg-gradient-to-r from-blue-700 to-blue-500 rounded-t-2xl sm:rounded-t-2xl">
//           <div className="flex items-center gap-3">
//             <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
//               <Building2 size={16} className="text-white" />
//             </div>
//             <div>
//               <h2 className="font-extrabold text-white text-[15px]">
//                 {editing ? "Edit City" : "Add New City"}
//               </h2>
//               <p className="text-[11px] text-blue-200">Fill all required fields</p>
//             </div>
//           </div>
//           <button onClick={onClose}
//             className="w-8 h-8 rounded-xl bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-all">
//             <X size={15} />
//           </button>
//         </div>

//         {/* Modal Body */}
//         <div className="p-5 space-y-4">

//           {/* API Error */}
//           {errors.api && (
//             <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600 flex items-center gap-2">
//               <AlertCircle size={14} className="flex-shrink-0" /> {errors.api}
//             </div>
//           )}

//           {/* Step 1 — Country */}
//           <div>
//             <Label required>Country</Label>
//             <FSelect
//               error={errors.countryId}
//               value={countryId}
//               onFocus={loadCountries}
//               onClick={loadCountries}
//               onChange={e => handleCountryChange(e.target.value)}>
//               {/* Placeholder — hamesha dikhta hai */}
//               <option value="">
//                 {loadingCountry ? "Loading countries…" : "Select Country"}
//               </option>
//               {/* Jab tak countries load nahi — sirf placeholder */}
//               {!countriesLoaded && !loadingCountry && (
//                 <option value="" disabled>── Click to load countries ──</option>
//               )}
//               {countriesLoaded && countries.map(c => (
//                 <option key={c.id} value={c.id}>{c.name}</option>
//               ))}
//             </FSelect>
//           </div>

//           {/* Step 2 — Destination (depends on country) */}
//           <div>
//             <Label required>Destination</Label>
//             <div className="relative">
//               <FSelect
//                 error={errors.destinationId}
//                 value={destinationId}
//                 onChange={e => setDestinationId(e.target.value)}
//                 disabled={!countryId || loadingDest}>
//                 {/* Placeholder — hamesha dikhta hai */}
//                 <option value="">
//                   {!countryId
//                     ? "Select Destination"
//                     : loadingDest
//                       ? "Loading destinations…"
//                       : destinations.length === 0
//                         ? "No destinations found"
//                         : "Select Destination"}
//                 </option>
//                 {/* Destinations sirf tab dikhte hain jab country choose ho */}
//                 {countryId && !loadingDest && destinations.map(d => (
//                   <option key={d.id} value={d.id}>{d.name}</option>
//                 ))}
//               </FSelect>
//               {loadingDest && (
//                 <Loader2 size={14} className="absolute right-8 top-3 text-blue-500 animate-spin" />
//               )}
//             </div>
//           </div>

//           {/* Step 3 — City Name + Code */}
//           <div className="grid grid-cols-2 gap-3">
//             <div className="col-span-2 sm:col-span-1">
//               <Label required>City Name</Label>
//               <FInput
//                 error={errors.name}
//                 value={name}
//                 onChange={e => setName(e.target.value)}
//                 placeholder="e.g. Kathmandu"
//               />
//             </div>
//             <div className="col-span-2 sm:col-span-1">
//               <Label>Airport Code</Label>
//               <FInput
//                 value={code}
//                 onChange={e => setCode(e.target.value.toUpperCase())}
//                 placeholder="e.g. KTM"
//                 maxLength={4}
//               />
//             </div>
//           </div>

//           {/* Cascade hint */}
//           <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-xl border border-blue-100 text-xs text-blue-600 font-medium">
//             <Globe size={13} className="flex-shrink-0 text-blue-500" />
//             Country → Destination → City
//           </div>

//           {/* Action buttons */}
//           <div className="flex gap-3 pt-1">
//             <button onClick={onClose}
//               className="flex-1 py-2.5 border-2 border-slate-200 hover:border-slate-300
//                 text-slate-600 font-bold text-sm rounded-xl transition-all bg-white hover:bg-slate-50">
//               Cancel
//             </button>
//             <button onClick={handleSave} disabled={saving}
//               className="flex-1 py-2.5 font-bold text-sm rounded-xl text-white transition-all
//                 active:scale-95 disabled:opacity-60 shadow-md shadow-blue-200
//                 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800
//                 flex items-center justify-center gap-2">
//               {saving
//                 ? <><Loader2 size={14} className="animate-spin" /> Saving...</>
//                 : <><Check size={14} strokeWidth={2.5} /> {editing ? "Update City" : "Add City"}</>}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ─── DELETE CONFIRM ─────────────────────────────────────── */
// function DeleteConfirm({ city, onClose, onConfirm }) {
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
//       style={{ background: "rgba(15,23,42,0.55)", backdropFilter: "blur(4px)" }}
//       onClick={e => e.target === e.currentTarget && onClose()}>
//       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center"
//         style={{ animation: "slideUp .2s ease both" }}>
//         <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-4">
//           <Trash2 size={22} className="text-red-500" />
//         </div>
//         <h3 className="text-lg font-extrabold text-slate-800 mb-1">Delete City?</h3>
//         <p className="text-sm text-slate-500 mb-5">
//           Are you sure you want to delete <span className="font-bold text-slate-700">"{city?.name}"</span>?
//           This action cannot be undone.
//         </p>
//         <div className="flex gap-3">
//           <button onClick={onClose}
//             className="flex-1 py-2.5 rounded-xl border-2 border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all">
//             Cancel
//           </button>
//           <button onClick={onConfirm}
//             className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md shadow-red-200 transition-all">
//             Yes, Delete
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ─── MAIN CITIES PAGE ───────────────────────────────────── */
// export default function Cities() {
//   const [cities,       setCities]       = useState([]);
//   const [loading,      setLoading]      = useState(true);
//   const [search,       setSearch]       = useState("");
//   const [filterCountry, setFilterCountry] = useState("");
//   const [filterDest,   setFilterDest]   = useState("");
//   const [showModal,    setShowModal]    = useState(false);
//   const [editCity,     setEditCity]     = useState(null);
//   const [deleteTarget, setDeleteTarget] = useState(null);
//   const [toast,        setToast]        = useState(null);

//   const showToast = (msg, type = "success") => setToast({ msg, type });

//   // ── Fetch all cities ───────────────────────────────────────
//   const fetchCities = async () => {
//     try {
//       setLoading(true);
//       const res  = await cityService.getAllCities();
//       const data = res.data?.data || res.data || [];
//       setCities(Array.isArray(data) ? data : []);
//     } catch {
//       setCities([]);
//       showToast("Failed to load cities.", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { fetchCities(); }, []);

//   // ── Unique countries + destinations for filter dropdowns ──
//   const uniqueCountries = useMemo(() =>
//     [...new Map(cities.filter(c => c.countryId).map(c => [c.countryId, { id: c.countryId, name: c.countryName || c.country }])).values()],
//     [cities]
//   );

//   const uniqueDestinations = useMemo(() =>
//     [...new Map(
//       cities
//         .filter(c => c.destinationId && (!filterCountry || String(c.countryId) === String(filterCountry)))
//         .map(c => [c.destinationId, { id: c.destinationId, name: c.destinationName || c.destination }])
//     ).values()],
//     [cities, filterCountry]
//   );

//   // ── Filter cities ─────────────────────────────────────────
//   const filtered = useMemo(() =>
//     cities.filter(c => {
//       const q = search.trim().toLowerCase();
//       if (q && !c.name?.toLowerCase().includes(q) &&
//                !c.code?.toLowerCase().includes(q)) return false;
//       if (filterCountry && String(c.countryId) !== String(filterCountry)) return false;
//       if (filterDest && String(c.destinationId) !== String(filterDest)) return false;
//       return true;
//     }),
//     [cities, search, filterCountry, filterDest]
//   );

//   // ── Delete ─────────────────────────────────────────────────
//   const handleDelete = async () => {
//     try {
//       await cityService.deleteCity(deleteTarget.id);
//       setCities(prev => prev.filter(c => c.id !== deleteTarget.id));
//       showToast(`"${deleteTarget.name}" deleted successfully.`);
//       setDeleteTarget(null);
//     } catch {
//       showToast("Failed to delete city.", "error");
//     }
//   };

//   // ── Save (create/edit) ────────────────────────────────────
//   const handleSave = () => {
//     setShowModal(false);
//     setEditCity(null);
//     fetchCities();
//     showToast(editCity ? "City updated successfully!" : "City added successfully!");
//   };

//   return (
//     <div className="min-h-screen font-sans"
//       style={{
//         fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
//         background: "linear-gradient(135deg,#f8fafc 0%,#eff6ff20 50%,#f8fafc 100%)",
//       }}>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
//         @keyframes fadeUp  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
//         @keyframes slideUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
//         @keyframes slideIn { from{transform:translateX(110%);opacity:0} to{transform:translateX(0);opacity:1} }
//         .fade-up { animation: fadeUp .4s ease both; }
//         .city-row:hover { background: #f8faff; }
//       `}</style>

//       {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
//       {showModal && (
//         <CityModal
//           editing={editCity}
//           onClose={() => { setShowModal(false); setEditCity(null); }}
//           onSave={handleSave}
//         />
//       )}
//       {deleteTarget && (
//         <DeleteConfirm
//           city={deleteTarget}
//           onClose={() => setDeleteTarget(null)}
//           onConfirm={handleDelete}
//         />
//       )}

//       {/* ── Page Header ── */}
//       <div className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-20 shadow-sm">
//         <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-4">
//           <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
//             <div className="flex items-center gap-3 sm:gap-4">
//               <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-400
//                 flex items-center justify-center text-white shadow-lg shadow-blue-200">
//                 <Building2 size={20} strokeWidth={2.2} />
//               </div>
//               <div>
//                 <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-0.5">
//                   <Home size={11} />
//                   <ChevronRight size={9} className="text-slate-300" />
//                   <span>Masters</span>
//                   <ChevronRight size={9} className="text-slate-300" />
//                   <span className="text-blue-600 font-bold">Cities</span>
//                 </div>
//                 <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
//                   City Master
//                 </h1>
//                 <p className="text-xs text-slate-400 font-medium hidden sm:block">
//                   {cities.length} cities · {uniqueCountries.length} countries
//                 </p>
//               </div>
//             </div>

//             <div className="flex items-center gap-2">
//               <button onClick={fetchCities}
//                 className="flex items-center gap-1.5 px-3 py-2.5 border border-slate-200 hover:border-blue-300
//                   bg-white hover:bg-blue-50 text-slate-600 hover:text-blue-600 text-xs font-bold
//                   rounded-xl transition-all shadow-sm">
//                 <RefreshCw size={13} /> Refresh
//               </button>
//               <button onClick={() => { setEditCity(null); setShowModal(true); }}
//                 className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700
//                   hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2.5 rounded-xl
//                   text-sm font-bold transition-all active:scale-95 shadow-md shadow-blue-200">
//                 <Plus size={16} strokeWidth={2.5} /> Add City
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-5 space-y-4">

//         {/* ── Filter Bar ── */}
//         <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 fade-up">
//           <div className="flex flex-col sm:flex-row gap-3">
//             {/* Search */}
//             <div className="relative flex-1">
//               <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
//               <input
//                 value={search}
//                 onChange={e => setSearch(e.target.value)}
//                 placeholder="Search city name or airport code..."
//                 className="w-full border border-slate-200 hover:border-slate-300 rounded-xl
//                   pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2
//                   focus:ring-blue-500/30 focus:border-blue-400 transition-all bg-white"
//               />
//             </div>

//             {/* Country filter */}
//             <select
//               value={filterCountry}
//               onChange={e => { setFilterCountry(e.target.value); setFilterDest(""); }}
//               className="border border-slate-200 hover:border-slate-300 rounded-xl px-3 py-2.5
//                 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30
//                 focus:border-blue-400 transition-all min-w-[150px]">
//               <option value="">All Countries</option>
//               {uniqueCountries.map(c => (
//                 <option key={c.id} value={c.id}>{c.name}</option>
//               ))}
//             </select>

//             {/* Destination filter — depends on country */}
//             <select
//               value={filterDest}
//               onChange={e => setFilterDest(e.target.value)}
//               disabled={!filterCountry}
//               className="border border-slate-200 hover:border-slate-300 rounded-xl px-3 py-2.5
//                 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30
//                 focus:border-blue-400 transition-all min-w-[160px]
//                 disabled:opacity-50 disabled:cursor-not-allowed">
//               <option value="">
//                 {!filterCountry ? "Select country first" : "All Destinations"}
//               </option>
//               {uniqueDestinations.map(d => (
//                 <option key={d.id} value={d.id}>{d.name}</option>
//               ))}
//             </select>

//             {/* Clear filters */}
//             {(search || filterCountry || filterDest) && (
//               <button
//                 onClick={() => { setSearch(""); setFilterCountry(""); setFilterDest(""); }}
//                 className="flex items-center gap-1.5 px-3 py-2.5 text-xs font-bold
//                   text-slate-500 hover:text-red-500 bg-slate-50 hover:bg-red-50
//                   border border-slate-200 hover:border-red-200 rounded-xl transition-all whitespace-nowrap">
//                 <X size={12} /> Clear
//               </button>
//             )}
//           </div>
//         </div>

//         {/* ── Cities Table ── */}
//         <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden fade-up"
//           style={{ animationDelay: "60ms" }}>

//           {/* Table header */}
//           <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50/60">
//             <div className="flex items-center gap-3">
//               <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center">
//                 <Building2 size={13} className="text-blue-600" />
//               </div>
//               <p className="text-[13px] font-bold text-slate-700">Cities Directory</p>
//               <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
//                 {filtered.length} results
//               </span>
//             </div>
//           </div>

//           {/* Column headers — desktop only */}
//           <div className="hidden sm:grid px-5 py-3 bg-slate-50/40 border-b border-slate-100 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider"
//             style={{ gridTemplateColumns: "1.5fr 1fr 1fr 80px 80px" }}>
//             <div>City</div>
//             <div>Country</div>
//             <div>Destination</div>
//             <div>Code</div>
//             <div className="text-right">Actions</div>
//           </div>

//           {/* Loading */}
//           {loading && (
//             <div className="space-y-0">
//               {[1,2,3,4,5].map(i => (
//                 <div key={i} className="grid px-5 py-4 border-b border-slate-50 animate-pulse"
//                   style={{ gridTemplateColumns: "1.5fr 1fr 1fr 80px 80px" }}>
//                   <div className="flex items-center gap-3">
//                     <div className="w-8 h-8 bg-slate-200 rounded-xl flex-shrink-0" />
//                     <div className="h-4 bg-slate-200 rounded-lg w-28" />
//                   </div>
//                   <div className="h-4 bg-slate-100 rounded-lg w-20 self-center" />
//                   <div className="h-4 bg-slate-100 rounded-lg w-24 self-center" />
//                   <div className="h-4 bg-slate-100 rounded-lg w-10 self-center" />
//                   <div className="h-4 bg-slate-100 rounded-lg w-12 self-center ml-auto" />
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* Empty */}
//           {!loading && filtered.length === 0 && (
//             <div className="py-16 text-center">
//               <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
//                 <Building2 size={28} className="text-slate-300" />
//               </div>
//               <p className="text-slate-600 font-bold text-base mb-1">No Cities Found</p>
//               <p className="text-slate-400 text-sm">Try adjusting your search or filters</p>
//               {(search || filterCountry || filterDest) && (
//                 <button onClick={() => { setSearch(""); setFilterCountry(""); setFilterDest(""); }}
//                   className="mt-4 text-xs font-bold text-blue-500 hover:text-blue-600 underline underline-offset-2">
//                   Clear filters
//                 </button>
//               )}
//             </div>
//           )}

//           {/* City rows */}
//           {!loading && filtered.length > 0 && (
//             <div>
//               {filtered.map((city, idx) => (
//                 <div key={city.id}
//                   className="city-row border-b border-slate-50 last:border-0 transition-colors"
//                   style={{ animation: `fadeUp .3s ease ${idx * 20}ms both` }}>

//                   {/* ── Desktop row ── */}
//                   <div className="hidden sm:grid items-center px-5 py-3.5 gap-3"
//                     style={{ gridTemplateColumns: "1.5fr 1fr 1fr 80px 80px" }}>

//                     {/* City name */}
//                     <div className="flex items-center gap-3 min-w-0">
//                       <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200
//                         flex items-center justify-center flex-shrink-0">
//                         <Building2 size={14} className="text-blue-600" />
//                       </div>
//                       <span className="text-sm font-bold text-slate-800 truncate">{city.name}</span>
//                     </div>

//                     {/* Country */}
//                     <div className="flex items-center gap-1.5 min-w-0">
//                       <Globe size={12} className="text-slate-400 flex-shrink-0" />
//                       <span className="text-sm text-slate-600 truncate font-medium">
//                         {city.countryName || city.country || "—"}
//                       </span>
//                     </div>

//                     {/* Destination */}
//                     <div className="flex items-center gap-1.5 min-w-0">
//                       <MapPin size={12} className="text-rose-400 flex-shrink-0" />
//                       <span className="text-sm text-slate-600 truncate font-medium">
//                         {city.destinationName || city.destination || "—"}
//                       </span>
//                     </div>

//                     {/* Code */}
//                     <div>
//                       {city.code ? (
//                         <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-amber-50
//                           text-amber-700 border border-amber-200 font-mono">
//                           {city.code}
//                         </span>
//                       ) : (
//                         <span className="text-slate-300 text-sm">—</span>
//                       )}
//                     </div>

//                     {/* Actions */}
//                     <div className="flex items-center justify-end gap-1.5">
//                       <button
//                         onClick={() => { setEditCity(city); setShowModal(true); }}
//                         className="w-7 h-7 rounded-lg bg-blue-50 hover:bg-blue-100
//                           text-blue-500 flex items-center justify-center transition-all"
//                         title="Edit">
//                         <Edit2 size={12} />
//                       </button>
//                       <button
//                         onClick={() => setDeleteTarget(city)}
//                         className="w-7 h-7 rounded-lg bg-rose-50 hover:bg-rose-100
//                           text-rose-400 flex items-center justify-center transition-all"
//                         title="Delete">
//                         <Trash2 size={12} />
//                       </button>
//                     </div>
//                   </div>

//                   {/* ── Mobile row ── */}
//                   <div className="sm:hidden px-4 py-3.5">
//                     <div className="flex items-start justify-between gap-2">
//                       <div className="flex items-start gap-3 min-w-0">
//                         <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200
//                           flex items-center justify-center flex-shrink-0 mt-0.5">
//                           <Building2 size={15} className="text-blue-600" />
//                         </div>
//                         <div className="min-w-0">
//                           <div className="flex items-center gap-2 flex-wrap">
//                             <p className="text-sm font-bold text-slate-800">{city.name}</p>
//                             {city.code && (
//                               <span className="text-[10px] font-bold px-1.5 py-0.5 rounded
//                                 bg-amber-50 text-amber-700 border border-amber-200 font-mono">
//                                 {city.code}
//                               </span>
//                             )}
//                           </div>
//                           <div className="flex items-center gap-2 mt-1 flex-wrap">
//                             <span className="text-xs text-slate-500 flex items-center gap-1">
//                               <Globe size={10} className="text-slate-400" />
//                               {city.countryName || city.country || "—"}
//                             </span>
//                             <span className="text-slate-300 text-xs">·</span>
//                             <span className="text-xs text-slate-500 flex items-center gap-1">
//                               <MapPin size={10} className="text-rose-400" />
//                               {city.destinationName || city.destination || "—"}
//                             </span>
//                           </div>
//                         </div>
//                       </div>
//                       <div className="flex items-center gap-1.5 flex-shrink-0">
//                         <button
//                           onClick={() => { setEditCity(city); setShowModal(true); }}
//                           className="w-7 h-7 rounded-lg bg-blue-50 hover:bg-blue-100
//                             text-blue-500 flex items-center justify-center transition-all">
//                           <Edit2 size={12} />
//                         </button>
//                         <button
//                           onClick={() => setDeleteTarget(city)}
//                           className="w-7 h-7 rounded-lg bg-rose-50 hover:bg-rose-100
//                             text-rose-400 flex items-center justify-center transition-all">
//                           <Trash2 size={12} />
//                         </button>
//                       </div>
//                     </div>
//                   </div>

//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }






import React, { useState, useEffect, useMemo } from "react";
import {
  Building2, Plus, Search, Trash2, Edit2, X, Check,
  MapPin, Globe, ChevronDown, AlertCircle, Loader2,
  Home, ChevronRight, RefreshCw
} from "lucide-react";
import { cityService }      from "../../services/cityService";
import { geographyService } from "../../services/geographyService";

/* ─── TOAST ─────────────────────────────────────── */
function Toast({ msg, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div className={`fixed top-4 right-4 left-4 sm:left-auto sm:right-5 sm:top-5 z-[999]
      flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl sm:max-w-sm
      ${type === "success" ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800"}`}
      style={{ animation: "slideIn .3s ease both" }}>
      {type === "success"
        ? <Check size={16} className="text-green-600 flex-shrink-0" />
        : <AlertCircle size={16} className="text-red-500 flex-shrink-0" />}
      <p className="text-sm font-semibold flex-1">{msg}</p>
      <button onClick={onClose} className="opacity-50 hover:opacity-100 ml-1"><X size={14} /></button>
    </div>
  );
}

/* ─── UI HELPERS ─────────────────────────────────── */
function Label({ children, required }) {
  return (
    <label className="block text-xs font-semibold text-slate-600 mb-1.5">
      {children}{required && <span className="text-rose-500 ml-0.5">*</span>}
    </label>
  );
}
function FInput({ error, ...props }) {
  return (
    <div>
      <input className={`w-full border rounded-xl px-3 py-2.5 text-sm transition-all
        focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400
        ${error ? "border-red-300 bg-red-50/50" : "border-slate-200 bg-white hover:border-slate-300"}`}
        {...props} />
      {error && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={10} />{error}</p>}
    </div>
  );
}
function FSelect({ error, children, ...props }) {
  return (
    <div>
      <select className={`w-full border rounded-xl px-3 py-2.5 text-sm bg-white transition-all
        focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400
        ${error ? "border-red-300" : "border-slate-200 hover:border-slate-300"}`}
        {...props}>
        {children}
      </select>
      {error && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={10} />{error}</p>}
    </div>
  );
}

/* ─── CITY MODAL ─────────────────────────────────── */
function CityModal({ editing, onClose, onSave }) {
  const [countries,      setCountries]      = useState([]);
  const [destinations,   setDestinations]   = useState([]);
  const [countryId,      setCountryId]      = useState(editing?.countryId     || "");
  const [destinationId,  setDestinationId]  = useState(editing?.destinationId || "");
  const [name,           setName]           = useState(editing?.name || "");
  const [code,           setCode]           = useState(editing?.code || "");
  const [errors,         setErrors]         = useState({});
  const [saving,         setSaving]         = useState(false);
  const [loadingCountry, setLoadingCountry] = useState(false);
  const [countriesLoaded,setCountriesLoaded]= useState(false);
  const [loadingDest,    setLoadingDest]    = useState(false);

  // ── Load countries — geographyService returns [{ id, name }] directly ──
  const loadCountries = async () => {
    if (countriesLoaded || loadingCountry) return;
    setLoadingCountry(true);
    try {
      const data = await geographyService.getCountries(); // → [{ id, name }]
      setCountries(Array.isArray(data) ? data : []);
      setCountriesLoaded(true);
    } catch {
      setCountries([]);
    } finally {
      setLoadingCountry(false);
    }
  };

  // editing mode mein auto-load countries + destinations
  useEffect(() => {
    if (editing?.countryId) {
      loadCountries();
      loadDestinations(editing.countryId);
    }
  }, []);

  // ── Load destinations — geographyService returns [{ id, name }] directly ──
  const loadDestinations = async (cId) => {
    setDestinations([]);
    if (!editing?.destinationId) setDestinationId("");
    if (!cId) return;
    setLoadingDest(true);
    try {
      const data = await geographyService.getDestinationsByCountry(cId); // → [{ id, name }]
      setDestinations(Array.isArray(data) ? data : []);
      if (editing?.destinationId) setDestinationId(String(editing.destinationId));
    } catch {
      setDestinations([]);
    } finally {
      setLoadingDest(false);
    }
  };

  const handleCountryChange = (cId) => {
    setCountryId(cId);
    setDestinationId("");
    loadDestinations(cId);
  };

  const validate = () => {
    const e = {};
    if (!countryId)     e.countryId     = "Country required";
    if (!destinationId) e.destinationId = "Destination required";
    if (!name.trim())   e.name          = "City name required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      if (editing) {
        await cityService.updateCity(editing.cityId, countryId, destinationId, name, code);
      } else {
        await cityService.createCity(countryId, destinationId, name, code);
      }
      onSave();
    } catch (err) {
      setErrors({ api: err?.response?.data?.message || "Failed to save. Try again." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: "rgba(15,23,42,0.55)", backdropFilter: "blur(4px)" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl"
        style={{ animation: "slideUp .25s ease both" }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-blue-700 to-blue-500 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
              <Building2 size={16} className="text-white" />
            </div>
            <div>
              <h2 className="font-extrabold text-white text-[15px]">{editing ? "Edit City" : "Add New City"}</h2>
              <p className="text-[11px] text-blue-200">Fill all required fields</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-all">
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {errors.api && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600 flex items-center gap-2">
              <AlertCircle size={14} className="flex-shrink-0" /> {errors.api}
            </div>
          )}

          {/* Country — lazy load on click/focus */}
          <div>
            <Label required>Country</Label>
            <FSelect
              error={errors.countryId}
              value={countryId}
              onFocus={loadCountries}
              onClick={loadCountries}
              onChange={e => handleCountryChange(e.target.value)}>
              <option value="">
                {loadingCountry ? "Loading countries…" : "Select Country"}
              </option>
              {!countriesLoaded && !loadingCountry && (
                <option value="" disabled>── Click to load countries ──</option>
              )}
              {/* geographyService returns { id, name } */}
              {countriesLoaded && countries.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </FSelect>
          </div>

          {/* Destination — loads after country chosen */}
          <div>
            <Label required>Destination</Label>
            <div className="relative">
              <FSelect
                error={errors.destinationId}
                value={destinationId}
                onChange={e => setDestinationId(e.target.value)}
                disabled={!countryId || loadingDest}>
                <option value="">
                  {!countryId ? "Select Destination" : loadingDest ? "Loading destinations…" : destinations.length === 0 ? "No destinations found" : "Select Destination"}
                </option>
                {/* geographyService returns { id, name } */}
                {countryId && !loadingDest && destinations.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </FSelect>
              {loadingDest && <Loader2 size={14} className="absolute right-8 top-3 text-blue-500 animate-spin" />}
            </div>
          </div>

          {/* City Name + Code */}
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 sm:col-span-1">
              <Label required>City Name</Label>
              <FInput error={errors.name} value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Kathmandu" />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <Label>Airport Code</Label>
              <FInput value={code} onChange={e => setCode(e.target.value.toUpperCase())} placeholder="e.g. KTM" maxLength={4} />
            </div>
          </div>

          {/* Hint */}
          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-xl border border-blue-100 text-xs text-blue-600 font-medium">
            <Globe size={13} className="flex-shrink-0 text-blue-500" />
            Country → Destination → City
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button onClick={onClose}
              className="flex-1 py-2.5 border-2 border-slate-200 hover:border-slate-300 text-slate-600 font-bold text-sm rounded-xl transition-all bg-white hover:bg-slate-50">
              Cancel
            </button>
            <button onClick={handleSave} disabled={saving}
              className="flex-1 py-2.5 font-bold text-sm rounded-xl text-white transition-all active:scale-95 disabled:opacity-60 shadow-md shadow-blue-200 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 flex items-center justify-center gap-2">
              {saving
                ? <><Loader2 size={14} className="animate-spin" /> Saving...</>
                : <><Check size={14} strokeWidth={2.5} /> {editing ? "Update City" : "Add City"}</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── DELETE CONFIRM ─────────────────────────────── */
function DeleteConfirm({ city, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(15,23,42,0.55)", backdropFilter: "blur(4px)" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center"
        style={{ animation: "slideUp .2s ease both" }}>
        <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-4">
          <Trash2 size={22} className="text-red-500" />
        </div>
        <h3 className="text-lg font-extrabold text-slate-800 mb-1">Delete City?</h3>
        <p className="text-sm text-slate-500 mb-5">
          Are you sure you want to delete <span className="font-bold text-slate-700">"{city?.name}"</span>? This cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border-2 border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all">Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md shadow-red-200 transition-all">Yes, Delete</button>
        </div>
      </div>
    </div>
  );
}

/* ─── MAIN CITIES PAGE ───────────────────────────── */
export default function Cities() {
  const [cities,        setCities]        = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [search,        setSearch]        = useState("");
  const [filterCountry, setFilterCountry] = useState("");
  const [filterDest,    setFilterDest]    = useState("");
  const [showModal,     setShowModal]     = useState(false);
  const [editCity,      setEditCity]      = useState(null);
  const [deleteTarget,  setDeleteTarget]  = useState(null);
  const [toast,         setToast]         = useState(null);

  const showToast = (msg, type = "success") => setToast({ msg, type });

  const fetchCities = async () => {
    try {
      setLoading(true);
      const res  = await cityService.getAllCities();
      const data = res.data?.data || res.data || [];
      setCities(Array.isArray(data) ? data : []);
    } catch {
      setCities([]);
      showToast("Failed to load cities.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCities(); }, []);

  // ── Filter dropdowns from existing city data ──
  const uniqueCountries = useMemo(() =>
    [...new Map(cities.filter(c => c.countryId).map(c => [c.countryId, { id: c.countryId, name: c.countryName || c.country }])).values()],
    [cities]
  );

  const uniqueDestinations = useMemo(() =>
    [...new Map(
      cities
        .filter(c => c.destinationId && (!filterCountry || String(c.countryId) === String(filterCountry)))
        .map(c => [c.destinationId, { id: c.destinationId, name: c.destinationName || c.destination }])
    ).values()],
    [cities, filterCountry]
  );

  const filtered = useMemo(() =>
    cities.filter(c => {
      const q = search.trim().toLowerCase();
      if (q && !c.name?.toLowerCase().includes(q) && !c.code?.toLowerCase().includes(q)) return false;
      if (filterCountry && String(c.countryId) !== String(filterCountry)) return false;
      if (filterDest && String(c.destinationId) !== String(filterDest)) return false;
      return true;
    }),
    [cities, search, filterCountry, filterDest]
  );

  const handleDelete = async () => {
    try {
      await cityService.deleteCity(deleteTarget.cityId);
      setCities(prev => prev.filter(c => c.cityId !== deleteTarget.cityId));
      showToast(`"${deleteTarget.name}" deleted successfully.`);
      setDeleteTarget(null);
    } catch {
      showToast("Failed to delete city.", "error");
    }
  };

  const handleSave = () => {
    setShowModal(false);
    setEditCity(null);
    fetchCities();
    showToast(editCity ? "City updated successfully!" : "City added successfully!");
  };

  return (
    <div className="min-h-screen font-sans"
      style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", background: "linear-gradient(135deg,#f8fafc 0%,#eff6ff20 50%,#f8fafc 100%)" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        @keyframes fadeUp  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn { from{transform:translateX(110%);opacity:0} to{transform:translateX(0);opacity:1} }
        .fade-up { animation: fadeUp .4s ease both; }
        .city-row:hover { background: #f8faff; }
      `}</style>

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      {showModal && <CityModal editing={editCity} onClose={() => { setShowModal(false); setEditCity(null); }} onSave={handleSave} />}
      {deleteTarget && <DeleteConfirm city={deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} />}

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-20 shadow-sm">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white shadow-lg shadow-blue-200">
                <Building2 size={20} strokeWidth={2.2} />
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-0.5">
                  <Home size={11} /><ChevronRight size={9} className="text-slate-300" />
                  <span>Masters</span><ChevronRight size={9} className="text-slate-300" />
                  <span className="text-blue-600 font-bold">Cities</span>
                </div>
                <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">City Master</h1>
                <p className="text-xs text-slate-400 font-medium hidden sm:block">{cities.length} cities · {uniqueCountries.length} countries</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={fetchCities} className="flex items-center gap-1.5 px-3 py-2.5 border border-slate-200 hover:border-blue-300 bg-white hover:bg-blue-50 text-slate-600 hover:text-blue-600 text-xs font-bold rounded-xl transition-all shadow-sm">
                <RefreshCw size={13} /> Refresh
              </button>
              <button onClick={() => { setEditCity(null); setShowModal(true); }}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 shadow-md shadow-blue-200">
                <Plus size={16} strokeWidth={2.5} /> Add City
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-5 space-y-4">

        {/* Filter Bar */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 fade-up">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search city name or airport code..."
                className="w-full border border-slate-200 hover:border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all bg-white" />
            </div>
            <select value={filterCountry} onChange={e => { setFilterCountry(e.target.value); setFilterDest(""); }}
              className="border border-slate-200 hover:border-slate-300 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all min-w-[150px]">
              <option value="">All Countries</option>
              {uniqueCountries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <select value={filterDest} onChange={e => setFilterDest(e.target.value)} disabled={!filterCountry}
              className="border border-slate-200 hover:border-slate-300 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all min-w-[160px] disabled:opacity-50 disabled:cursor-not-allowed">
              <option value="">{!filterCountry ? "Select country first" : "All Destinations"}</option>
              {uniqueDestinations.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
            {(search || filterCountry || filterDest) && (
              <button onClick={() => { setSearch(""); setFilterCountry(""); setFilterDest(""); }}
                className="flex items-center gap-1.5 px-3 py-2.5 text-xs font-bold text-slate-500 hover:text-red-500 bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-200 rounded-xl transition-all whitespace-nowrap">
                <X size={12} /> Clear
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden fade-up" style={{ animationDelay: "60ms" }}>
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50/60">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center"><Building2 size={13} className="text-blue-600" /></div>
              <p className="text-[13px] font-bold text-slate-700">Cities Directory</p>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200">{filtered.length} results</span>
            </div>
          </div>

          <div className="hidden sm:grid px-5 py-3 bg-slate-50/40 border-b border-slate-100 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider"
            style={{ gridTemplateColumns: "1.5fr 1fr 1fr 80px 80px" }}>
            <div>City</div><div>Country</div><div>Destination</div><div>Code</div><div className="text-right">Actions</div>
          </div>

          {loading && (
            <div className="space-y-0">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="grid px-5 py-4 border-b border-slate-50 animate-pulse" style={{ gridTemplateColumns: "1.5fr 1fr 1fr 80px 80px" }}>
                  <div className="flex items-center gap-3"><div className="w-8 h-8 bg-slate-200 rounded-xl flex-shrink-0" /><div className="h-4 bg-slate-200 rounded-lg w-28" /></div>
                  <div className="h-4 bg-slate-100 rounded-lg w-20 self-center" />
                  <div className="h-4 bg-slate-100 rounded-lg w-24 self-center" />
                  <div className="h-4 bg-slate-100 rounded-lg w-10 self-center" />
                  <div className="h-4 bg-slate-100 rounded-lg w-12 self-center ml-auto" />
                </div>
              ))}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="py-16 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4"><Building2 size={28} className="text-slate-300" /></div>
              <p className="text-slate-600 font-bold text-base mb-1">No Cities Found</p>
              <p className="text-slate-400 text-sm">Try adjusting your search or filters</p>
              {(search || filterCountry || filterDest) && (
                <button onClick={() => { setSearch(""); setFilterCountry(""); setFilterDest(""); }}
                  className="mt-4 text-xs font-bold text-blue-500 hover:text-blue-600 underline underline-offset-2">Clear filters</button>
              )}
            </div>
          )}

          {!loading && filtered.length > 0 && (
            <div>
              {filtered.map((city, idx) => (
                <div key={city.cityId} className="city-row border-b border-slate-50 last:border-0 transition-colors"
                  style={{ animation: `fadeUp .3s ease ${idx * 20}ms both` }}>

                  {/* Desktop */}
                  <div className="hidden sm:grid items-center px-5 py-3.5 gap-3" style={{ gridTemplateColumns: "1.5fr 1fr 1fr 80px 80px" }}>
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center flex-shrink-0"><Building2 size={14} className="text-blue-600" /></div>
                      <span className="text-sm font-bold text-slate-800 truncate">{city.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Globe size={12} className="text-slate-400 flex-shrink-0" />
                      <span className="text-sm text-slate-600 truncate font-medium">{city.countryName || city.country || "—"}</span>
                    </div>
                    <div className="flex items-center gap-1.5 min-w-0">
                      <MapPin size={12} className="text-rose-400 flex-shrink-0" />
                      <span className="text-sm text-slate-600 truncate font-medium">{city.destinationName || city.destination || "—"}</span>
                    </div>
                    <div>
                      {city.code
                        ? <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 font-mono">{city.code}</span>
                        : <span className="text-slate-300 text-sm">—</span>}
                    </div>
                    <div className="flex items-center justify-end gap-1.5">
                      <button onClick={() => { setEditCity(city); setShowModal(true); }} className="w-7 h-7 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-500 flex items-center justify-center transition-all" title="Edit"><Edit2 size={12} /></button>
                      <button onClick={() => setDeleteTarget(city)} className="w-7 h-7 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-400 flex items-center justify-center transition-all" title="Delete"><Trash2 size={12} /></button>
                    </div>
                  </div>

                  {/* Mobile */}
                  <div className="sm:hidden px-4 py-3.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center flex-shrink-0 mt-0.5"><Building2 size={15} className="text-blue-600" /></div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-bold text-slate-800">{city.name}</p>
                            {city.code && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 font-mono">{city.code}</span>}
                          </div>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className="text-xs text-slate-500 flex items-center gap-1"><Globe size={10} className="text-slate-400" />{city.countryName || city.country || "—"}</span>
                            <span className="text-slate-300 text-xs">·</span>
                            <span className="text-xs text-slate-500 flex items-center gap-1"><MapPin size={10} className="text-rose-400" />{city.destinationName || city.destination || "—"}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button onClick={() => { setEditCity(city); setShowModal(true); }} className="w-7 h-7 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-500 flex items-center justify-center transition-all"><Edit2 size={12} /></button>
                        <button onClick={() => setDeleteTarget(city)} className="w-7 h-7 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-400 flex items-center justify-center transition-all"><Trash2 size={12} /></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}