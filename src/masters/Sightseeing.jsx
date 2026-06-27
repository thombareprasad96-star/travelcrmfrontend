

// import React, { useState, useRef, useEffect } from "react";
// import {
//   Map, ChevronDown, ChevronRight, Search, Plus, Eye, X,
//   Clock, Building2, Globe, Hash, Info, UploadCloud,
//   Bold, Italic, Underline, Strikethrough, AlignLeft,
//   AlignCenter, List, ListOrdered, Eraser, MapPin, AlertTriangle
// } from "lucide-react";
// import { Link } from "react-router-dom";

// // Note: Ensure this service file exists in your project. If not, the code will use mock data.
// import { sightseeingService, transformSightseeingResponse } from "../services/SightseeingService";
// import { geographyService } from "../services/geographyService";
// import { cityService } from "../services/CityService";

// // =========================================================================
// // 🌟 TOAST SYSTEM
// // =========================================================================
// let _toastSetter = null;
// const toast = {
//   success: (msg) => _toastSetter?.({ msg, type: "success", id: Date.now() }),
//   error:   (msg) => _toastSetter?.({ msg, type: "error",   id: Date.now() }),
// };

// function ToastContainer() {
//   const [toasts, setToasts] = useState([]);
  
//   useEffect(() => {
//     _toastSetter = (t) => {
//       setToasts((prev) => [...prev, t]);
//       setTimeout(() => setToasts((p) => p.filter((x) => x.id !== t.id)), 3000);
//     };
//     return () => { _toastSetter = null; };
//   }, []);

//   return (
//     <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3">
//       {toasts.map((t) => (
//         <div key={t.id} className={`${t.type === "success" ? "bg-emerald-500" : "bg-rose-500"} text-white rounded-xl px-5 py-3.5 font-semibold text-sm shadow-lg flex items-center gap-2.5 animate-in slide-in-from-bottom-5 duration-300`}>
//           <span>{t.type === "success" ? "✓" : "✕"}</span> {t.msg}
//         </div>
//       ))}
//     </div>
//   );
// }

// // =========================================================================
// // 🌟 RICH TEXT EDITOR
// // =========================================================================
// const RichTextEditor = ({ name, initialValue, onChange, placeholder }) => {
//   const editorRef = useRef(null);
  
//   useEffect(() => {
//     if (editorRef.current && editorRef.current.innerHTML !== initialValue) {
//       editorRef.current.innerHTML = initialValue || "";
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
//     <div className="border border-slate-200 rounded-xl overflow-hidden bg-white hover:bg-slate-50 focus-within:bg-white shadow-sm focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all duration-300">
//       <div className="bg-slate-50 border-b border-slate-200 px-3 py-2 flex flex-wrap items-center gap-x-1.5 gap-y-2 text-slate-600 text-sm select-none">
//         <button type="button" onMouseDown={(e) => executeCommand(e, "formatBlock", "P")} className="flex items-center gap-1.5 px-2 py-1 hover:bg-slate-200 rounded-lg font-semibold text-slate-700 transition-colors">
//           Normal <ChevronDown size={14} className="text-slate-400" />
//         </button>
//         <div className="w-px h-5 bg-slate-300 hidden sm:block mx-1" />
//         <div className="flex items-center gap-0.5">
//           <button type="button" onMouseDown={(e) => executeCommand(e, "bold")} className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700"><Bold size={15} strokeWidth={2.5} /></button>
//           <button type="button" onMouseDown={(e) => executeCommand(e, "italic")} className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700"><Italic size={15} /></button>
//           <button type="button" onMouseDown={(e) => executeCommand(e, "underline")} className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700"><Underline size={15} /></button>
//           <button type="button" onMouseDown={(e) => executeCommand(e, "strikeThrough")} className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700"><Strikethrough size={15} /></button>
//         </div>
//         <div className="w-px h-5 bg-slate-300 hidden sm:block mx-1" />
//         <div className="flex items-center gap-0.5">
//           <button type="button" onMouseDown={(e) => executeCommand(e, "justifyLeft")} className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700"><AlignLeft size={15} /></button>
//           <button type="button" onMouseDown={(e) => executeCommand(e, "justifyCenter")} className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700"><AlignCenter size={15} /></button>
//           <button type="button" onMouseDown={(e) => executeCommand(e, "insertUnorderedList")} className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700"><List size={15} /></button>
//           <button type="button" onMouseDown={(e) => executeCommand(e, "insertOrderedList")} className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700"><ListOrdered size={15} /></button>
//         </div>
//         <div className="w-px h-5 bg-slate-300 hidden sm:block mx-1" />
//         <button type="button" onMouseDown={(e) => executeCommand(e, "removeFormat")} className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700"><Eraser size={15} /></button>
//       </div>
//       <div
//         ref={editorRef} contentEditable suppressContentEditableWarning
//         onInput={handleInput} onBlur={handleInput}
//         className="w-full p-4 focus:outline-none overflow-y-auto text-[14px] text-slate-700 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-2 [&_b]:font-bold [&_i]:italic [&_u]:underline leading-relaxed"
//         style={{ minHeight: "120px" }}
//         placeholder={placeholder}
//       />
//     </div>
//   );
// };


// const emptyForm = {
//   destination: "", city: "", title: "", sequence: "1",
//   estimatedHours: "", suggestedStartTime: "",
//   image: null, imagePreview: null, imagePath: null,
//   description: "", remarks: "",
// };

// const inputCls = "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder-slate-400 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10";

// // =========================================================================
// // 🌟 ADD / EDIT MODAL COMPONENT
// // =========================================================================
// function AddSightseeingModal({ isOpen, onClose, prefillDestination, editingItem, onSaved }) {
//   const [form, setForm]               = useState({ ...emptyForm });
//   const [resetKey, setResetKey]       = useState(Date.now());
//   const [saving, setSaving]           = useState(false);
//   const [imageUploading, setImageUploading] = useState(false);
//   const [saveError, setSaveError]     = useState("");
//   const fileRef = useRef();

//   // ── Geography cascade (Country → Destination → City), API-driven ──
//   const [countries,   setCountries]   = useState([]);
//   const [countryId,   setCountryId]   = useState("");
//   const [destOptions, setDestOptions] = useState([]);
//   const [cityOptions, setCityOptions] = useState([]);
//   const [loadingDest, setLoadingDest] = useState(false);
//   const [loadingCity, setLoadingCity] = useState(false);

//   // Load countries + initialise the form whenever the modal opens.
//   useEffect(() => {
//     if (!isOpen) return;
//     setSaveError("");
//     setCountryId("");
//     setDestOptions([]);

//     geographyService.getCountries().then(setCountries).catch(() => setCountries([]));

//     const initDest = editingItem
//       ? (transformSightseeingResponse ? transformSightseeingResponse(editingItem).destination : editingItem.destination)
//       : (prefillDestination || "");

//     if (editingItem) {
//       setForm(transformSightseeingResponse ? transformSightseeingResponse(editingItem) : editingItem);
//     } else {
//       setForm({ ...emptyForm, destination: prefillDestination || "" });
//     }

//     // Preserve the saved/prefilled destination: load its cities by name so the
//     // City dropdown is populated even before a country is re-selected.
//     if (initDest) {
//       setLoadingCity(true);
//       geographyService.getCitiesByDestinationName(initDest)
//         .then(setCityOptions).catch(() => setCityOptions([])).finally(() => setLoadingCity(false));
//     } else {
//       setCityOptions([]);
//     }
//     setResetKey(Date.now());
//   }, [isOpen, editingItem, prefillDestination]);

//   // ── Cascade handlers ──
//   const handleCountryChange = async (cid) => {
//     setCountryId(cid);
//     setForm((prev) => ({ ...prev, destination: "", city: "" }));
//     setDestOptions([]);
//     setCityOptions([]);
//     if (!cid) return;
//     setLoadingDest(true);
//     try { setDestOptions(await geographyService.getDestinationsByCountry(cid)); }
//     catch { setDestOptions([]); }
//     finally { setLoadingDest(false); }
//   };

//   const handleDestinationChange = async (name) => {
//     setForm((prev) => ({ ...prev, destination: name, city: "" }));
//     setCityOptions([]);
//     if (!name) return;
//     setLoadingCity(true);
//     try { setCityOptions(await geographyService.getCitiesByDestinationName(name)); }
//     catch { setCityOptions([]); }
//     finally { setLoadingCity(false); }
//   };

//   // Inject the currently-saved value as an option so edit mode shows it even
//   // before a country is chosen (real persisted record, not seed data).
//   const destList = (form.destination && !destOptions.some((d) => d.name === form.destination))
//     ? [{ id: `cur_${form.destination}`, name: form.destination }, ...destOptions]
//     : destOptions;
//   const cityList = (form.city && !cityOptions.some((c) => c.name === form.city))
//     ? [{ id: `cur_${form.city}`, name: form.city }, ...cityOptions]
//     : cityOptions;

//   const handleChange = (field, value) => {
//     setForm((prev) => ({ ...prev, [field]: value, ...(field === "destination" ? { city: "" } : {}) }));
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleFile = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = (ev) =>
//       setForm((prev) => ({ ...prev, image: file, imagePreview: ev.target.result }));
//     reader.readAsDataURL(file);

//     setImageUploading(true);
//     try {
//       if(sightseeingService && sightseeingService.uploadSightseeingImage) {
//           const res = await sightseeingService.uploadSightseeingImage(file);
//           const path = res.data?.imagePath || res.data?.url || res.data?.path || null;
//           setForm((prev) => ({ ...prev, imagePath: path }));
//       }
//     } catch {
//       toast.error("Image upload failed. File saved locally only.");
//     } finally {
//       setImageUploading(false);
//     }
//   };

//   const handleSave = async (e) => {
//     e.preventDefault();
//     if (!form.destination || !form.city || !form.title) {
//       setSaveError("Destination, City and Title are required.");
//       return;
//     }
//     setSaving(true);
//     setSaveError("");
//     try {
//       let saved = form;
//       if (sightseeingService) {
//         if (editingItem && sightseeingService.updateSightseeing) {
//           const res = await sightseeingService.updateSightseeing(editingItem.id, form);
//           saved = res.data;
//           toast.success("Sightseeing updated successfully!");
//         } else if(sightseeingService.createSightseeing) {
//           const res = await sightseeingService.createSightseeing(form);
//           saved = res.data;
//           toast.success("Sightseeing created successfully!");
//         }
//       } else {
//         toast.success("Sightseeing saved locally (Mock Mode)!");
//       }
//       onSaved(saved, editingItem ? "update" : "create");
//       handleClose();
//     } catch (err) {
//       setSaveError(err?.response?.data?.message || "Save failed. Please try again.");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleClose = () => {
//     setForm({ ...emptyForm });
//     setSaveError("");
//     setResetKey(Date.now());
//     onClose();
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 overflow-y-auto">
//       <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => !saving && handleClose()} />

//       <div className="relative bg-white w-full max-w-6xl shadow-2xl mt-4 sm:mt-10 mb-10 rounded-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
//         <div className="bg-blue-600 px-8 py-5 flex justify-between items-center text-white">
//           <div className="flex items-center gap-3">
//             <div className="p-2.5 bg-blue-500 rounded-xl"><Map size={20} strokeWidth={2.5} /></div>
//             <div>
//               <h2 className="text-lg font-bold m-0">{editingItem ? "Edit Sightseeing" : "Add New Sightseeing"}</h2>
//               <p className="text-xs text-blue-100 font-medium m-0 mt-0.5">Fill in the attraction details</p>
//             </div>
//           </div>
//           <button onClick={() => !saving && handleClose()} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors active:scale-95"><X size={20} /></button>
//         </div>

//         {saveError && (
//           <div className="mx-8 mt-5 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 text-sm text-rose-600 flex items-center gap-2">
//             <AlertTriangle size={15} /> {saveError}
//           </div>
//         )}

//         <form onSubmit={handleSave}>
//           <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-10 bg-slate-50/50">
//             <div className="space-y-6">
//               <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
//                 <div>
//                   <label className="block text-sm font-bold text-slate-800 mb-2">Country <span className="text-rose-500">*</span></label>
//                   <div className="relative">
//                     <Globe size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
//                     <select className={`${inputCls} pl-10 appearance-none pr-8 cursor-pointer`} value={countryId} onChange={(e) => handleCountryChange(e.target.value)}>
//                       <option value="">{countries.length === 0 ? "Loading…" : "Select country"}</option>
//                       {countries.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
//                     </select>
//                     <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-bold text-slate-800 mb-2">Destination <span className="text-rose-500">*</span></label>
//                   <div className="relative">
//                     <Map size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
//                     <select className={`${inputCls} pl-10 appearance-none pr-8 cursor-pointer disabled:opacity-60`} value={form.destination} onChange={(e) => handleDestinationChange(e.target.value)} disabled={(!countryId && destList.length === 0) || loadingDest}>
//                       <option value="">{loadingDest ? "Loading…" : !countryId && destList.length === 0 ? "Select country first" : destList.length === 0 ? "No destinations" : "Select destination"}</option>
//                       {destList.map((d) => <option key={d.id} value={d.name}>{d.name}</option>)}
//                     </select>
//                     <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-bold text-slate-800 mb-2">City <span className="text-rose-500">*</span></label>
//                   <div className="relative">
//                     <Building2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
//                     <select className={`${inputCls} pl-10 appearance-none pr-8 cursor-pointer disabled:opacity-60`} value={form.city} onChange={(e) => handleChange("city", e.target.value)} disabled={!form.destination || loadingCity}>
//                       <option value="">{!form.destination ? "Select destination first" : loadingCity ? "Loading…" : cityList.length === 0 ? "No cities" : "Select city"}</option>
//                       {cityList.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
//                     </select>
//                     <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
//                   </div>
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-bold text-slate-800 mb-2">Title <span className="text-rose-500">*</span></label>
//                 <input type="text" className={inputCls} placeholder="e.g. Radhanagar Beach Sunset Walk" value={form.title} onChange={(e) => handleChange("title", e.target.value)} />
//               </div>

//               <div className="grid grid-cols-2 gap-5">
//                 <div>
//                   <label className="block text-sm font-bold text-slate-800 mb-2">Sequence</label>
//                   <div className="relative">
//                     <Hash size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
//                     <input type="number" min={1} className={`${inputCls} pl-10`} value={form.sequence} onChange={(e) => handleChange("sequence", e.target.value)} />
//                   </div>
//                   <p className="text-xs text-slate-400 font-medium mt-2">Order of appearance</p>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-bold text-slate-800 mb-2">Estimated Hours</label>
//                   <input type="text" className={inputCls} placeholder="e.g. 2.5" value={form.estimatedHours} onChange={(e) => handleChange("estimatedHours", e.target.value)} />
//                   <p className="text-xs text-slate-400 font-medium mt-2">Duration in hours</p>
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-bold text-slate-800 mb-2">Suggested Start Time</label>
//                 <div className="relative max-w-[200px]">
//                   <Clock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
//                   <input type="time" className={`${inputCls} pl-10 cursor-pointer`} value={form.suggestedStartTime} onChange={(e) => handleChange("suggestedStartTime", e.target.value)} />
//                 </div>
//               </div>
//             </div>

//             <div className="space-y-6">
//               <div>
//                 <label className="block text-sm font-bold text-slate-800 mb-2">
//                   Attraction Image
//                   {imageUploading && <span className="ml-2 text-blue-500 font-normal text-xs animate-pulse">Uploading...</span>}
//                 </label>
//                 <div
//                   className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer group ${imageUploading ? "border-blue-300 bg-blue-50" : "border-slate-300 bg-white hover:border-blue-400 hover:bg-slate-50"}`}
//                   onClick={() => !imageUploading && fileRef.current?.click()}
//                 >
//                   {imageUploading ? (
//                     <div className="py-6">
//                       <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
//                       <p className="text-sm text-blue-600 font-medium">Uploading image...</p>
//                     </div>
//                   ) : form.imagePreview || form.imagePath ? (
//                     <div className="flex flex-col items-center">
//                       <img src={form.imagePreview || form.imagePath} alt="preview" className="max-h-40 w-full object-cover rounded-xl shadow-sm border border-slate-200 mb-3" />
//                       <button className="text-xs font-bold text-rose-500 bg-rose-50 px-3 py-1.5 rounded-lg"
//                         onClick={(e) => { e.stopPropagation(); setForm((p) => ({ ...p, image: null, imagePreview: null, imagePath: null })); }}>
//                         Remove Image
//                       </button>
//                     </div>
//                   ) : (
//                     <div className="py-4">
//                       <UploadCloud size={40} className="mx-auto text-blue-500 mb-3 group-hover:scale-110 transition-transform" />
//                       <h4 className="text-sm font-bold text-slate-800 mb-1">Click to upload image</h4>
//                       <p className="text-xs text-slate-500 font-medium m-0">JPG, PNG up to 2MB. Recommended: 800×600px</p>
//                     </div>
//                   )}
//                   <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
//                 </div>
//                 <div className="mt-3 flex items-start gap-2.5 rounded-xl bg-amber-50 border border-amber-100 p-3">
//                   <Info size={14} className="mt-0.5 flex-shrink-0 text-amber-500" />
//                   <p className="text-xs text-amber-700 leading-relaxed m-0 font-medium">Use royalty-free images only from Unsplash, Pexels, or Pixabay.</p>
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-bold text-slate-800 mb-2">Description</label>
//                 <RichTextEditor key={`${resetKey}-desc`} name="description" initialValue={form.description} onChange={handleInputChange} placeholder="Describe this sightseeing experience..." />
//               </div>
//               <div>
//                 <label className="block text-sm font-bold text-slate-800 mb-2">Remarks</label>
//                 <RichTextEditor key={`${resetKey}-rem`} name="remarks" initialValue={form.remarks} onChange={handleInputChange} placeholder="Any special notes or tips..." />
//               </div>
//             </div>
//           </div>

//           <div className="bg-white px-8 py-5 border-t border-slate-200 flex justify-end gap-3 rounded-b-2xl">
//             <button type="button" onClick={handleClose} disabled={saving} className="px-6 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-700 hover:bg-slate-50 transition-colors text-sm">Cancel</button>
//             <button type="submit" disabled={saving || imageUploading} className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-500/20 transition-all active:scale-95 flex items-center gap-2">
//               {saving ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</> : editingItem ? "Update Sightseeing" : "Save Sightseeing"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// // =========================================================================
// // 🌟 DESTINATION ROW
// // =========================================================================
// function DestinationRow({ dest, onAddSightseeing, onEdit, onDelete }) {
//   const [expanded, setExpanded]         = useState(false);
//   const [sightseeings, setSightseeings]   = useState([]);
//   const [loadingSight, setLoadingSight]   = useState(false);

//   const handleExpand = async () => {
//     const opening = !expanded;
//     setExpanded(opening);
//     if (opening && sightseeings.length === 0) {
//       setLoadingSight(true);
//       try {
//         if(sightseeingService && sightseeingService.getSightseeingsByDestination) {
//             const res = await sightseeingService.getSightseeingsByDestination(dest.name);
//             const list = Array.isArray(res.data) ? res.data : Array.isArray(res.data?.data) ? res.data.data : [];
//             setSightseeings(list);
//         }
//       } catch {
//         setSightseeings([]);
//       } finally {
//         setLoadingSight(false);
//       }
//     }
//   };

//   return (
//     <div className="group border-b border-slate-100 last:border-0">
//       <div className="flex flex-col md:flex-row md:items-center justify-between p-5 hover:bg-slate-50 transition-colors cursor-pointer gap-4" onClick={handleExpand}>
//         <div className="flex items-center gap-4">
//           <button className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-100 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
//             {expanded ? <ChevronDown size={16} strokeWidth={2.5} /> : <ChevronRight size={16} strokeWidth={2.5} />}
//           </button>
//           <span className="text-2xl drop-shadow-sm">{dest.flag || "📍"}</span>
//           <div>
//             <h3 className="text-[16px] font-extrabold text-slate-900 m-0 group-hover:text-blue-600 transition-colors">{dest.name}</h3>
//             <p className="text-sm text-slate-500 font-medium m-0 mt-0.5">{dest.attractions} attractions · {dest.cities} cities</p>
//           </div>
//         </div>
//         <div className="flex items-center gap-2 pl-16 md:pl-0" onClick={(e) => e.stopPropagation()}>
//           <button onClick={() => onAddSightseeing(dest.name)} className="flex items-center gap-1.5 border border-blue-500 text-blue-600 hover:bg-blue-600 hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm">
//             <Plus size={14} strokeWidth={2.5} /> Add Sightseeing
//           </button>
//           <button className="flex items-center gap-1.5 border border-slate-300 text-slate-700 hover:bg-slate-100 px-4 py-2 rounded-xl text-xs font-bold transition-colors shadow-sm">
//             <Eye size={14} /> View Dest.
//           </button>
//         </div>
//       </div>

//       {expanded && (
//         <div className="bg-slate-50/50 border-t border-slate-100">
//           <div className="px-5 sm:px-16 py-3 flex flex-wrap items-center gap-2.5 border-b border-slate-100">
//             <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">Cities:</span>
//             {dest.cityList.map((city) => (
//               <span key={city} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-sm">
//                 <Building2 size={12} className="text-blue-500" /> {city}
//               </span>
//             ))}
//           </div>

//           {loadingSight ? (
//             <div className="px-16 py-4 text-sm text-slate-400 animate-pulse">Loading attractions...</div>
//           ) : sightseeings.length === 0 ? (
//             <div className="px-16 py-4 text-sm text-slate-400">No attractions added yet.</div>
//           ) : (
//             <div className="divide-y divide-slate-100">
//               {sightseeings.map((s) => (
//                 <div key={s.id} className="px-5 sm:px-16 py-3 flex items-center justify-between hover:bg-white transition group/row">
//                   <div className="flex items-center gap-3">
//                     {s.imagePath ? (
//                       <img src={s.imagePath} alt={s.title} className="w-10 h-10 rounded-lg object-cover border border-slate-200" />
//                     ) : (
//                       <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center border border-slate-200"><MapPin size={16} className="text-slate-400" /></div>
//                     )}
//                     <div>
//                       <p className="text-sm font-bold text-slate-800 m-0">{s.title}</p>
//                       <p className="text-xs text-slate-500 m-0">{s.city} · {s.estimatedHours ? `${s.estimatedHours}h` : "—"}</p>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-2 opacity-0 group-hover/row:opacity-100 transition">
//                     <button onClick={() => onEdit(s)} className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition text-xs font-bold px-3">Edit</button>
//                     <button onClick={() => onDelete(s.id, dest.name)} className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white transition text-xs font-bold px-3">Delete</button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// // =========================================================================
// // 🌟 MAIN EXPORT COMPONENT
// // =========================================================================
// export default function SightseeingMaster() {
//   const [destinations, setDestinations] = useState([]);
//   const [destLoading, setDestLoading]   = useState(true);

//   const [modalOpen,     setModalOpen]     = useState(false);
//   const [prefillDest,   setPrefillDest]   = useState("");
//   const [editingItem,   setEditingItem]   = useState(null);

//   const [search,      setSearch]      = useState("");
//   const [filterDest,  setFilterDest]  = useState("");
//   const [filterCity,  setFilterCity]  = useState("");

//   useEffect(() => {
//     (async () => {
//       try {
//         if(sightseeingService && sightseeingService.getAllDestinations) {
//             const res = await sightseeingService.getAllDestinations();
//             const list = Array.isArray(res.data) ? res.data : Array.isArray(res.data?.data) ? res.data.data : [];
//             setDestinations(list);
//         }
//       } catch {
//         setDestinations([]);
//       } finally {
//         setDestLoading(false);
//       }
//     })();
//   }, []);

//   const openAdd  = (dest = "") => { setEditingItem(null); setPrefillDest(dest); setModalOpen(true); };
//   const openEdit = (item)       => { setEditingItem(item); setPrefillDest(""); setModalOpen(true); };

//   const handleSaved = (saved, type) => {
//     if (type === "create") {
//       setDestinations((prev) =>
//         prev.map((d) =>
//           d.name === saved?.destination
//             ? { ...d, attractions: (d.attractions || 0) + 1 }
//             : d
//         )
//       );
//     }
//   };

//   const handleDelete = async (id, destName) => {
//     if (!window.confirm("Delete this sightseeing?")) return;
//     try {
//       if(sightseeingService && sightseeingService.deleteSightseeing) {
//           await sightseeingService.deleteSightseeing(id);
//       }
//       setDestinations((prev) =>
//         prev.map((d) =>
//           d.name === destName
//             ? { ...d, attractions: Math.max(0, (d.attractions || 1) - 1) }
//             : d
//         )
//       );
//       toast.success("Sightseeing deleted!");
//     } catch {
//       toast.error("Failed to delete sightseeing.");
//     }
//   };

//   const allCityOptions = [...new Set(destinations.flatMap((d) => d.cityList || []))].sort();

//   const filtered = destinations.filter((d) => {
//     const matchSearch = d.name.toLowerCase().includes(search.toLowerCase());
//     const matchDest   = !filterDest || d.name === filterDest;
//     const matchCity   = !filterCity || (d.cityList || []).includes(filterCity);
//     return matchSearch && matchDest && matchCity;
//   });

//   return (
//     <div className="min-h-screen bg-[#f8fafc] font-sans p-4 sm:p-6 lg:p-8">

//       {/* HEADER */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
//         <div className="flex items-center gap-3">
//           <div className="p-2.5 bg-blue-600 text-white rounded-2xl shadow-sm shadow-blue-600/20"><Map size={24} strokeWidth={2.5} /></div>
//           <div>
//             <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight m-0">Sightseeing Master</h1>
//             <p className="text-sm text-slate-500 mt-1 font-medium m-0">Configure attractions and sightseeing details for your packages.</p>
//           </div>
//         </div>
//         <div className="text-sm font-medium flex items-center gap-2">
//           <Link to="/" className="text-blue-600 hover:text-blue-800 transition-colors">Home</Link>
//           <span className="text-slate-300">/</span><span className="text-slate-500">Masters</span><span className="text-slate-300">/</span>
//           <span className="text-slate-700 bg-white border border-slate-200 px-3 py-1 rounded-lg shadow-sm">Sightseeing</span>
//         </div>
//       </div>

//       {/* STATS ROW */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
//         {[
//           { label: "Destinations",      value: destinations.length,                               color: "text-blue-600",   border: "border-blue-200",   bg: "bg-blue-50"   },
//           { label: "Total Attractions", value: destinations.reduce((a, d) => a + (d.attractions || 0), 0), color: "text-emerald-600", border: "border-emerald-200", bg: "bg-emerald-50" },
//           { label: "Cities Covered",    value: destinations.reduce((a, d) => a + (d.cities || 0), 0),      color: "text-violet-600",  border: "border-violet-200",  bg: "bg-violet-50"  },
//         ].map(({ label, value, color, bg, border }) => (
//           <div key={label} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
//             <div className={`w-14 h-14 rounded-full flex items-center justify-center border-2 ${bg} ${border}`}>
//               <span className={`text-xl font-black ${color}`}>{destLoading ? "…" : value}</span>
//             </div>
//             <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</p>
//           </div>
//         ))}
//       </div>

//       {/* MAIN CARD */}
//       <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

//         {/* Filters Top Bar */}
//         <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//           <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
//             <div className="relative flex-1 min-w-[280px]">
//               <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
//               <input type="text" className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700 shadow-sm" placeholder="Search sightseeing..." value={search} onChange={(e) => setSearch(e.target.value)} />
//             </div>
//             <div className="relative min-w-[200px]">
//               <Globe size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
//               <select className="w-full pl-10 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 appearance-none shadow-sm cursor-pointer" value={filterDest} onChange={(e) => { setFilterDest(e.target.value); setFilterCity(""); }}>
//                 <option value="">All Destinations</option>
//                 {destinations.map((d) => <option key={d.id} value={d.name}>{d.name}</option>)}
//               </select>
//               <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
//             </div>
//             <div className="relative min-w-[180px]">
//               <Building2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
//               <select className="w-full pl-10 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 appearance-none shadow-sm cursor-pointer" value={filterCity} onChange={(e) => setFilterCity(e.target.value)}>
//                 <option value="">All Cities</option>
//                 {(filterDest ? destinations.find((d) => d.name === filterDest)?.cityList || [] : allCityOptions).map((c) => <option key={c} value={c}>{c}</option>)}
//               </select>
//               <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
//             </div>
//           </div>
//           <button onClick={() => openAdd()} className="flex items-center justify-center gap-2 bg-[#007bff] hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95 whitespace-nowrap w-full sm:w-auto">
//             <Plus size={16} strokeWidth={2.5} /> Add New Sightseeing
//           </button>
//         </div>

//         {/* List */}
//         <div className="bg-white">
//           <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
//             <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Destinations ({filtered.length})</h2>
//             {(search || filterDest || filterCity) && (
//               <button className="text-xs font-bold text-blue-600 hover:text-blue-800" onClick={() => { setSearch(""); setFilterDest(""); setFilterCity(""); }}>Clear filters</button>
//             )}
//           </div>

//           {destLoading ? (
//             [1, 2, 3].map((i) => (
//               <div key={i} className="p-5 border-b border-slate-100 animate-pulse flex items-center gap-4">
//                 <div className="w-7 h-7 bg-slate-200 rounded-lg" />
//                 <div className="flex-1 space-y-2">
//                   <div className="h-4 bg-slate-200 rounded w-40" />
//                   <div className="h-3 bg-slate-100 rounded w-28" />
//                 </div>
//               </div>
//             ))
//           ) : filtered.length > 0 ? (
//             filtered.map((dest) => (
//               <DestinationRow
//                 key={dest.id}
//                 dest={dest}
//                 onAddSightseeing={openAdd}
//                 onEdit={openEdit}
//                 onDelete={handleDelete}
//               />
//             ))
//           ) : (
//             <div className="flex flex-col items-center justify-center py-20 text-center">
//               <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 mb-4 border border-slate-200">
//                 <Map size={28} className="text-slate-400" />
//               </div>
//               <p className="text-base font-bold text-slate-700">No destinations found</p>
//               <p className="text-sm text-slate-500 mt-1 font-medium">Try adjusting your search or filters</p>
//             </div>
//           )}
//         </div>
//       </div>

//       <AddSightseeingModal
//         isOpen={modalOpen}
//         onClose={() => setModalOpen(false)}
//         prefillDestination={prefillDest}
//         editingItem={editingItem}
//         destinations={destinations}
//         onSaved={handleSaved}
//       />

//       <ToastContainer />
//     </div>
//   );
// }





import React, { useState, useRef, useEffect } from "react";
import {
  Map, ChevronDown, ChevronRight, Search, Plus, Eye, X,
  Clock, Building2, Globe, Hash, Info, UploadCloud,
  Bold, Italic, Underline, Strikethrough, AlignLeft,
  AlignCenter, List, ListOrdered, Eraser, MapPin, AlertTriangle
} from "lucide-react";
import { Link } from "react-router-dom";

import { sightseeingService, transformSightseeingResponse } from "../services/SightseeingService";
import { geographyService } from "../services/geographyService";
import { cityService } from "../services/CityService";

// =========================================================================
// 🌟 TOAST SYSTEM
// =========================================================================
let _toastSetter = null;
const toast = {
  success: (msg) => _toastSetter?.({ msg, type: "success", id: Date.now() }),
  error:   (msg) => _toastSetter?.({ msg, type: "error",   id: Date.now() }),
};

function ToastContainer() {
  const [toasts, setToasts] = useState([]);
  useEffect(() => {
    _toastSetter = (t) => {
      setToasts((prev) => [...prev, t]);
      setTimeout(() => setToasts((p) => p.filter((x) => x.id !== t.id)), 3000);
    };
    return () => { _toastSetter = null; };
  }, []);
  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3">
      {toasts.map((t) => (
        <div key={t.id} className={`${t.type === "success" ? "bg-emerald-500" : "bg-rose-500"} text-white rounded-xl px-5 py-3.5 font-semibold text-sm shadow-lg flex items-center gap-2.5 animate-in slide-in-from-bottom-5 duration-300`}>
          <span>{t.type === "success" ? "✓" : "✕"}</span> {t.msg}
        </div>
      ))}
    </div>
  );
}

// =========================================================================
// 🌟 RICH TEXT EDITOR
// =========================================================================
const RichTextEditor = ({ name, initialValue, onChange, placeholder }) => {
  const editorRef = useRef(null);
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== initialValue) {
      editorRef.current.innerHTML = initialValue || "";
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
        <button type="button" onMouseDown={(e) => executeCommand(e, "formatBlock", "P")} className="flex items-center gap-1.5 px-2 py-1 hover:bg-slate-200 rounded-lg font-semibold text-slate-700 transition-colors">
          Normal <ChevronDown size={14} className="text-slate-400" />
        </button>
        <div className="w-px h-5 bg-slate-300 hidden sm:block mx-1" />
        <div className="flex items-center gap-0.5">
          <button type="button" onMouseDown={(e) => executeCommand(e, "bold")} className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700"><Bold size={15} strokeWidth={2.5} /></button>
          <button type="button" onMouseDown={(e) => executeCommand(e, "italic")} className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700"><Italic size={15} /></button>
          <button type="button" onMouseDown={(e) => executeCommand(e, "underline")} className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700"><Underline size={15} /></button>
          <button type="button" onMouseDown={(e) => executeCommand(e, "strikeThrough")} className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700"><Strikethrough size={15} /></button>
        </div>
        <div className="w-px h-5 bg-slate-300 hidden sm:block mx-1" />
        <div className="flex items-center gap-0.5">
          <button type="button" onMouseDown={(e) => executeCommand(e, "justifyLeft")} className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700"><AlignLeft size={15} /></button>
          <button type="button" onMouseDown={(e) => executeCommand(e, "justifyCenter")} className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700"><AlignCenter size={15} /></button>
          <button type="button" onMouseDown={(e) => executeCommand(e, "insertUnorderedList")} className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700"><List size={15} /></button>
          <button type="button" onMouseDown={(e) => executeCommand(e, "insertOrderedList")} className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700"><ListOrdered size={15} /></button>
        </div>
        <div className="w-px h-5 bg-slate-300 hidden sm:block mx-1" />
        <button type="button" onMouseDown={(e) => executeCommand(e, "removeFormat")} className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700"><Eraser size={15} /></button>
      </div>
      <div
        ref={editorRef} contentEditable suppressContentEditableWarning
        onInput={handleInput} onBlur={handleInput}
        className="w-full p-4 focus:outline-none overflow-y-auto text-[14px] text-slate-700 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-2 [&_b]:font-bold [&_i]:italic [&_u]:underline leading-relaxed"
        style={{ minHeight: "120px" }}
        placeholder={placeholder}
      />
    </div>
  );
};

const emptyForm = {
  destination: "", destinationId: "", city: "", title: "", sequence: "1",
  estimatedHours: "", suggestedStartTime: "",
  image: null, imagePreview: null, imagePath: null,
  description: "", remarks: "",
};

const inputCls = "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder-slate-400 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10";

// =========================================================================
// 🌟 ADD / EDIT MODAL COMPONENT
// =========================================================================
function AddSightseeingModal({ isOpen, onClose, prefillDestination, editingItem, onSaved }) {
  const [form, setForm]               = useState({ ...emptyForm });
  const [resetKey, setResetKey]       = useState(Date.now());
  const [saving, setSaving]           = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [saveError, setSaveError]     = useState("");
  const fileRef = useRef();

  // ── Geography cascade (Country → Destination → City) ──
  const [countries,   setCountries]   = useState([]);
  const [countryId,   setCountryId]   = useState("");
  const [destOptions, setDestOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [loadingDest, setLoadingDest] = useState(false);
  const [loadingCity, setLoadingCity] = useState(false);

  // Load countries + initialise form when modal opens
  useEffect(() => {
    if (!isOpen) return;
    setSaveError("");
    setCountryId("");
    setDestOptions([]);
    setCityOptions([]);

    geographyService.getCountries().then(setCountries).catch(() => setCountries([]));

    if (editingItem) {
      const data = transformSightseeingResponse ? transformSightseeingResponse(editingItem) : editingItem;
      setForm({ ...emptyForm, ...data });

      // Edit mode — destinationId se cities + country prefill
      const destId = data.destinationId || editingItem.destinationId;
      if (destId) {
        (async () => {
          try {
            // Destination ka full data → countryId nikaalo
            const dest = await geographyService.getDestinationById(destId);
            if (dest?.countryId != null) {
              setCountryId(String(dest.countryId));
              setLoadingDest(true);
              try { setDestOptions(await geographyService.getDestinationsByCountry(dest.countryId)); }
              finally { setLoadingDest(false); }
            }
            // Cities load karo destinationId se
            setLoadingCity(true);
            try { setCityOptions(await geographyService.getCitiesByDestination(destId)); }
            finally { setLoadingCity(false); }
          } catch {}
        })();
      }
    } else {
      setForm({ ...emptyForm, destination: prefillDestination || "" });
    }
    setResetKey(Date.now());
  }, [isOpen, editingItem, prefillDestination]);

  // ── Country change → destinations load ──
  const handleCountryChange = async (cid) => {
    setCountryId(cid);
    setForm((prev) => ({ ...prev, destination: "", destinationId: "", city: "" }));
    setDestOptions([]);
    setCityOptions([]);
    if (!cid) return;
    setLoadingDest(true);
    try { setDestOptions(await geographyService.getDestinationsByCountry(cid)); }
    catch { setDestOptions([]); }
    finally { setLoadingDest(false); }
  };

  // ── Destination change → cities load (ID se, NAME bhi store) ──
  const handleDestinationChange = async (destId) => {
    // Selected destination ka name nikaalo
    const selectedDest = destOptions.find((d) => String(d.id) === String(destId));
    const destName = selectedDest?.name || "";

    setForm((prev) => ({ ...prev, destinationId: destId, destination: destName, city: "" }));
    setCityOptions([]);
    if (!destId) return;

    setLoadingCity(true);
    try {
      // ✅ ID se cities laao (yeh confirmed kaam karta hai)
      const cities = await geographyService.getCitiesByDestination(destId);
      setCityOptions(cities);
    } catch {
      setCityOptions([]);
    } finally {
      setLoadingCity(false);
    }
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.match("image.*")) {
      toast.error("Please select a valid image file.");
      return;
    }
    // Local preview turant dikhao
    const reader = new FileReader();
    reader.onload = (ev) =>
      setForm((prev) => ({ ...prev, image: file, imagePreview: ev.target.result }));
    reader.readAsDataURL(file);

    // ☁️ Cloudinary pe upload — secure_url (string) wapas aata hai
    setImageUploading(true);
    try {
      const url = await sightseeingService.uploadSightseeingImage(file);
      setForm((prev) => ({ ...prev, imagePath: url, imagePreview: url }));
    } catch (err) {
      toast.error(err.message || "Image upload failed.");
    } finally {
      setImageUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.destination || !form.city || !form.title) {
      setSaveError("Destination, City and Title are required.");
      return;
    }
    setSaving(true);
    setSaveError("");
    try {
      let saved = form;
      if (sightseeingService) {
        if (editingItem && sightseeingService.updateSightseeing) {
          const res = await sightseeingService.updateSightseeing(editingItem.id, form);
          saved = res.data;
          toast.success("Sightseeing updated successfully!");
        } else if (sightseeingService.createSightseeing) {
          const res = await sightseeingService.createSightseeing(form);
          saved = res.data;
          toast.success("Sightseeing created successfully!");
        }
      } else {
        toast.success("Sightseeing saved locally (Mock Mode)!");
      }
      onSaved(saved, editingItem ? "update" : "create");
      handleClose();
    } catch (err) {
      setSaveError(err?.response?.data?.message || "Save failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setForm({ ...emptyForm });
    setSaveError("");
    setResetKey(Date.now());
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => !saving && handleClose()} />

      <div className="relative bg-white w-full max-w-6xl shadow-2xl mt-4 sm:mt-10 mb-10 rounded-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
        <div className="bg-blue-600 px-8 py-5 flex justify-between items-center text-white">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500 rounded-xl"><Map size={20} strokeWidth={2.5} /></div>
            <div>
              <h2 className="text-lg font-bold m-0">{editingItem ? "Edit Sightseeing" : "Add New Sightseeing"}</h2>
              <p className="text-xs text-blue-100 font-medium m-0 mt-0.5">Fill in the attraction details</p>
            </div>
          </div>
          <button onClick={() => !saving && handleClose()} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors active:scale-95"><X size={20} /></button>
        </div>

        {saveError && (
          <div className="mx-8 mt-5 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 text-sm text-rose-600 flex items-center gap-2">
            <AlertTriangle size={15} /> {saveError}
          </div>
        )}

        <form onSubmit={handleSave}>
          <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-10 bg-slate-50/50">
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {/* Country */}
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-2">Country <span className="text-rose-500">*</span></label>
                  <div className="relative">
                    <Globe size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <select className={`${inputCls} pl-10 appearance-none pr-8 cursor-pointer`} value={countryId} onChange={(e) => handleCountryChange(e.target.value)}>
                      <option value="">{countries.length === 0 ? "Loading…" : "Select country"}</option>
                      {countries.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                {/* Destination — ab value = ID */}
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-2">Destination <span className="text-rose-500">*</span></label>
                  <div className="relative">
                    <Map size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <select className={`${inputCls} pl-10 appearance-none pr-8 cursor-pointer disabled:opacity-60`}
                      value={form.destinationId}
                      onChange={(e) => handleDestinationChange(e.target.value)}
                      disabled={!countryId || loadingDest}>
                      <option value="">{loadingDest ? "Loading…" : !countryId ? "Select country first" : destOptions.length === 0 ? "No destinations" : "Select destination"}</option>
                      {destOptions.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                {/* City */}
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-2">City <span className="text-rose-500">*</span></label>
                  <div className="relative">
                    <Building2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <select className={`${inputCls} pl-10 appearance-none pr-8 cursor-pointer disabled:opacity-60`}
                      value={form.city}
                      onChange={(e) => handleChange("city", e.target.value)}
                      disabled={!form.destinationId || loadingCity}>
                      <option value="">{!form.destinationId ? "Select destination first" : loadingCity ? "Loading…" : cityOptions.length === 0 ? "No cities" : "Select city"}</option>
                      {cityOptions.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
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
                  <p className="text-xs text-slate-400 font-medium mt-2">Order of appearance</p>
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

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">
                  Attraction Image
                  {imageUploading && <span className="ml-2 text-blue-500 font-normal text-xs animate-pulse">Uploading...</span>}
                </label>
                <div
                  className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer group ${imageUploading ? "border-blue-300 bg-blue-50" : "border-slate-300 bg-white hover:border-blue-400 hover:bg-slate-50"}`}
                  onClick={() => !imageUploading && fileRef.current?.click()}
                >
                  {imageUploading ? (
                    <div className="py-6">
                      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                      <p className="text-sm text-blue-600 font-medium">Uploading image...</p>
                    </div>
                  ) : form.imagePreview || form.imagePath ? (
                    <div className="flex flex-col items-center">
                      <img src={form.imagePreview || form.imagePath} alt="preview" className="max-h-40 w-full object-cover rounded-xl shadow-sm border border-slate-200 mb-3" />
                      <button className="text-xs font-bold text-rose-500 bg-rose-50 px-3 py-1.5 rounded-lg"
                        onClick={(e) => { e.stopPropagation(); setForm((p) => ({ ...p, image: null, imagePreview: null, imagePath: null })); }}>
                        Remove Image
                      </button>
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

          <div className="bg-white px-8 py-5 border-t border-slate-200 flex justify-end gap-3 rounded-b-2xl">
            <button type="button" onClick={handleClose} disabled={saving} className="px-6 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-700 hover:bg-slate-50 transition-colors text-sm">Cancel</button>
            <button type="submit" disabled={saving || imageUploading} className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-500/20 transition-all active:scale-95 flex items-center gap-2">
              {saving ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</> : editingItem ? "Update Sightseeing" : "Save Sightseeing"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// =========================================================================
// 🌟 DESTINATION ROW
// =========================================================================
function DestinationRow({ dest, onAddSightseeing, onEdit, onDelete, refreshSignal }) {
  const [expanded, setExpanded]         = useState(false);
  const [sightseeings, setSightseeings]   = useState([]);
  const [loadingSight, setLoadingSight]   = useState(false);

  const loadSightseeings = async () => {
    setLoadingSight(true);
    try {
      if (sightseeingService && sightseeingService.getSightseeingsByDestination) {
        const res = await sightseeingService.getSightseeingsByDestination(dest.name);
        // 🔍 DEBUG
        console.log(`=== SIGHTSEEINGS for "${dest.name}" ===`, res.data);
        // PagedApiResponse → data.content, ya plain data array — sab handle karo
        const raw = res.data?.data ?? res.data;
        const list = Array.isArray(raw) ? raw
          : Array.isArray(raw?.content) ? raw.content : [];
        console.log("Sightseeings loaded:", list.length, list);
        setSightseeings(list);
      }
    } catch {
      setSightseeings([]);
    } finally {
      setLoadingSight(false);
    }
  };

  const handleExpand = async () => {
    const opening = !expanded;
    setExpanded(opening);
    if (opening) {
      await loadSightseeings();  // har baar fresh load (save ke baad bhi naya data)
    }
  };

  // refreshSignal badle to (agar expanded hai) reload karo
  useEffect(() => {
    if (expanded && refreshSignal) {
      loadSightseeings();
    }
  }, [refreshSignal]);

  // cityList fallback — agar backend se na aaye
  const cityChips = dest.cityList || dest.cities_list || [];

  return (
    <div className="group border-b border-slate-100 last:border-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between p-5 hover:bg-slate-50 transition-colors cursor-pointer gap-4" onClick={handleExpand}>
        <div className="flex items-center gap-4">
          <button className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-100 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
            {expanded ? <ChevronDown size={16} strokeWidth={2.5} /> : <ChevronRight size={16} strokeWidth={2.5} />}
          </button>
          <span className="text-2xl drop-shadow-sm">{dest.flag || "📍"}</span>
          <div>
            <h3 className="text-[16px] font-extrabold text-slate-900 m-0 group-hover:text-blue-600 transition-colors">{dest.name}</h3>
            <p className="text-sm text-slate-500 font-medium m-0 mt-0.5">{dest.attractions} attractions · {dest.cities} cities</p>
          </div>
        </div>
        <div className="flex items-center gap-2 pl-16 md:pl-0" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => onAddSightseeing(dest.name)} className="flex items-center gap-1.5 border border-blue-500 text-blue-600 hover:bg-blue-600 hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm">
            <Plus size={14} strokeWidth={2.5} /> Add Sightseeing
          </button>
          <button className="flex items-center gap-1.5 border border-slate-300 text-slate-700 hover:bg-slate-100 px-4 py-2 rounded-xl text-xs font-bold transition-colors shadow-sm">
            <Eye size={14} /> View Dest.
          </button>
        </div>
      </div>

      {expanded && (
        <div className="bg-slate-50/50 border-t border-slate-100">
          {cityChips.length > 0 && (
            <div className="px-5 sm:px-16 py-3 flex flex-wrap items-center gap-2.5 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">Cities:</span>
              {cityChips.map((city) => (
                <span key={city} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-sm">
                  <Building2 size={12} className="text-blue-500" /> {city}
                </span>
              ))}
            </div>
          )}

          {loadingSight ? (
            <div className="px-16 py-4 text-sm text-slate-400 animate-pulse">Loading attractions...</div>
          ) : sightseeings.length === 0 ? (
            <div className="px-16 py-4 text-sm text-slate-400">No attractions added yet.</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {sightseeings.map((s) => (
                <div key={s.id} className="px-5 sm:px-16 py-3 flex items-center justify-between hover:bg-white transition group/row">
                  <div className="flex items-center gap-3">
                    {s.imagePath ? (
                      <img src={s.imagePath} alt={s.title} className="w-10 h-10 rounded-lg object-cover border border-slate-200" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center border border-slate-200"><MapPin size={16} className="text-slate-400" /></div>
                    )}
                    <div>
                      <p className="text-sm font-bold text-slate-800 m-0">{s.title}</p>
                      <p className="text-xs text-slate-500 m-0">{s.city} · {s.estimatedHours ? `${s.estimatedHours}h` : "—"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover/row:opacity-100 transition">
                    <button onClick={() => onEdit(s)} className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition text-xs font-bold px-3">Edit</button>
                    <button onClick={() => onDelete(s.id, dest.name)} className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white transition text-xs font-bold px-3">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// =========================================================================
// 🌟 MAIN EXPORT COMPONENT
// =========================================================================
export default function SightseeingMaster() {
  const [destinations, setDestinations] = useState([]);
  const [destLoading, setDestLoading]   = useState(true);

  const [modalOpen,     setModalOpen]     = useState(false);
  const [prefillDest,   setPrefillDest]   = useState("");
  const [editingItem,   setEditingItem]   = useState(null);

  const [search,      setSearch]      = useState("");
  const [filterDest,  setFilterDest]  = useState("");
  const [filterCity,  setFilterCity]  = useState("");

  // Save ke baad rows ko refresh trigger karne ke liye
  const [refreshSignal, setRefreshSignal] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        if (sightseeingService && sightseeingService.getAllDestinations) {
          const res = await sightseeingService.getAllDestinations();
          // 🔍 DEBUG
          console.log("=== DESTINATIONS RESPONSE ===", res.data);
          const raw = res.data?.data ?? res.data;
          const list = Array.isArray(raw) ? raw
            : Array.isArray(raw?.content) ? raw.content : [];
          console.log("Destinations loaded:", list.length, list[0]);
          setDestinations(list);
        }
      } catch {
        setDestinations([]);
      } finally {
        setDestLoading(false);
      }
    })();
  }, []);

  const openAdd  = (dest = "") => { setEditingItem(null); setPrefillDest(dest); setModalOpen(true); };
  const openEdit = (item)       => { setEditingItem(item); setPrefillDest(""); setModalOpen(true); };

  const handleSaved = (saved, type) => {
    if (type === "create") {
      setDestinations((prev) =>
        prev.map((d) =>
          d.name === saved?.destination
            ? { ...d, attractions: (d.attractions || 0) + 1 }
            : d
        )
      );
    }
    // Rows ko signal do ki naya data load karein
    setRefreshSignal((n) => n + 1);
  };

  const handleDelete = async (id, destName) => {
    if (!window.confirm("Delete this sightseeing?")) return;
    try {
      if (sightseeingService && sightseeingService.deleteSightseeing) {
        await sightseeingService.deleteSightseeing(id);
      }
      setDestinations((prev) =>
        prev.map((d) =>
          d.name === destName
            ? { ...d, attractions: Math.max(0, (d.attractions || 1) - 1) }
            : d
        )
      );
      toast.success("Sightseeing deleted!");
    } catch {
      toast.error("Failed to delete sightseeing.");
    }
  };

  const allCityOptions = [...new Set(destinations.flatMap((d) => d.cityList || []))].sort();

  const filtered = destinations.filter((d) => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase());
    const matchDest   = !filterDest || d.name === filterDest;
    const matchCity   = !filterCity || (d.cityList || []).includes(filterCity);
    return matchSearch && matchDest && matchCity;
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans p-4 sm:p-6 lg:p-8">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-600 text-white rounded-2xl shadow-sm shadow-blue-600/20"><Map size={24} strokeWidth={2.5} /></div>
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

      {/* STATS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Destinations",      value: destinations.length,                               color: "text-blue-600",   border: "border-blue-200",   bg: "bg-blue-50"   },
          { label: "Total Attractions", value: destinations.reduce((a, d) => a + (d.attractions || 0), 0), color: "text-emerald-600", border: "border-emerald-200", bg: "bg-emerald-50" },
          { label: "Cities Covered",    value: destinations.reduce((a, d) => a + (d.cities || 0), 0),      color: "text-violet-600",  border: "border-violet-200",  bg: "bg-violet-50"  },
        ].map(({ label, value, color, bg, border }) => (
          <div key={label} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center border-2 ${bg} ${border}`}>
              <span className={`text-xl font-black ${color}`}>{destLoading ? "…" : value}</span>
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</p>
          </div>
        ))}
      </div>

      {/* MAIN CARD */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

        {/* Filters Top Bar */}
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative flex-1 min-w-[280px]">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input type="text" className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700 shadow-sm" placeholder="Search sightseeing..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="relative min-w-[200px]">
              <Globe size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <select className="w-full pl-10 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 appearance-none shadow-sm cursor-pointer" value={filterDest} onChange={(e) => { setFilterDest(e.target.value); setFilterCity(""); }}>
                <option value="">All Destinations</option>
                {destinations.map((d) => <option key={d.id} value={d.name}>{d.name}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
            <div className="relative min-w-[180px]">
              <Building2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <select className="w-full pl-10 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 appearance-none shadow-sm cursor-pointer" value={filterCity} onChange={(e) => setFilterCity(e.target.value)}>
                <option value="">All Cities</option>
                {(filterDest ? destinations.find((d) => d.name === filterDest)?.cityList || [] : allCityOptions).map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
          <button onClick={() => openAdd()} className="flex items-center justify-center gap-2 bg-[#007bff] hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95 whitespace-nowrap w-full sm:w-auto">
            <Plus size={16} strokeWidth={2.5} /> Add New Sightseeing
          </button>
        </div>

        {/* List */}
        <div className="bg-white">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Destinations ({filtered.length})</h2>
            {(search || filterDest || filterCity) && (
              <button className="text-xs font-bold text-blue-600 hover:text-blue-800" onClick={() => { setSearch(""); setFilterDest(""); setFilterCity(""); }}>Clear filters</button>
            )}
          </div>

          {destLoading ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="p-5 border-b border-slate-100 animate-pulse flex items-center gap-4">
                <div className="w-7 h-7 bg-slate-200 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-40" />
                  <div className="h-3 bg-slate-100 rounded w-28" />
                </div>
              </div>
            ))
          ) : filtered.length > 0 ? (
            filtered.map((dest) => (
              <DestinationRow
                key={dest.id}
                dest={dest}
                onAddSightseeing={openAdd}
                onEdit={openEdit}
                onDelete={handleDelete}
                refreshSignal={refreshSignal}
              />
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

      <AddSightseeingModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        prefillDestination={prefillDest}
        editingItem={editingItem}
        onSaved={handleSaved}
      />

      <ToastContainer />
    </div>
  );
}