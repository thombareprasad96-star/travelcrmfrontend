// import { useState, useEffect } from 'react';
// import { Search, Plus, Eye, Edit, Trash2, Map, Globe, Image as ImageIcon, X, ChevronDown, UploadCloud, CheckCircle2, MapPin, AlertTriangle, Loader2, Trash, CheckCircle } from 'lucide-react';
// import { Link } from 'react-router-dom';
// import { destinationService, uploadImageToCloudinary } from "../api/DestinationService";
// import { geographyService } from "@shared/api/geographyService";
// import { getErrorMessage } from "@shared/api/apiError";
// import { toast } from "@shared/ui/toast";

// const MAX_IMAGE_BYTES = 2 * 1024 * 1024;
// const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];

// // =========================================================================
// // ROLE HELPERS
// // =========================================================================
// const getUserRole = () => (localStorage.getItem('userRole') || '').toUpperCase();
// const isSuperAdminRole = () => getUserRole().includes('SUPER');

// // =========================================================================
// // MAIN COMPONENT
// // =========================================================================
// const DestinationMaster = () => {
//   const [destinations, setDestinations] = useState([]);
//   const [listLoading, setListLoading] = useState(false);
//   const [fetchError, setFetchError] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedCountry, setSelectedCountry] = useState('');
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   // ── DYNAMIC COUNTRIES FROM BACKEND ────────────────────────────────────
//   const [countries, setCountries] = useState([]);          // { id, name }[]
//   const [countriesLoading, setCountriesLoading] = useState(false);

//   // ── Modal state ─────────────────────────────────────────────────────────
//   const [formErrors, setFormErrors] = useState({});
//   const [submitError, setSubmitError] = useState('');  // save error (duplicate etc.)
//   const [editingDest, setEditingDest] = useState(null);  // null=create, object=edit

//   // View modal state
//   const [viewOpen, setViewOpen] = useState(false);
//   const [viewDest, setViewDest] = useState(null);

//   const isSuperAdmin = isSuperAdminRole();

//   // ── Fetch countries from geographyService on mount ────────────────────
//   useEffect(() => {
//     const fetchCountries = async () => {
//       setCountriesLoading(true);
//       try {
//         // geographyService.getCountries() returns [{ id, name }] directly
//         const data = await geographyService.getCountries();
//         setCountries(Array.isArray(data) ? data : []);
//       } catch (err) {
//         console.error('Failed to load countries:', err);
//         setCountries([]);
//       } finally {
//         setCountriesLoading(false);
//       }
//     };
//     fetchCountries();
//   }, []);

//   const loadDestinations = async () => {
//     setListLoading(true);
//     setFetchError('');
//     try {
//       const res = await destinationService.getAllDestinations({ size: 100 });
//       const rows = Array.isArray(res.data?.data) ? res.data.data : [];
//       setDestinations(rows);
//     } catch (err) {
//       console.error('Failed to load destinations:', err);
//       setFetchError(err.response?.data?.message || 'Failed to load destinations. Please try again.');
//     } finally {
//       setListLoading(false);
//     }
//   };

//   useEffect(() => { loadDestinations(); }, []);

//   const formatDate = (value) => {
//     if (!value) return '—';
//     const d = new Date(value);
//     return Number.isNaN(d.getTime()) ? value : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
//   };

//   // ── Image upload state ──────────────────────────────────────────────────
//   const [imagePreview, setImagePreview] = useState(null);
//   const [isUploading, setIsUploading] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [uploadError, setUploadError] = useState('');

//   // ── Form state (policies removed) ────────────────────────────────────────
//   const [formData, setFormData] = useState({
//     country: '', name: '', type: '', imagePath: ''
//   });

//   // ── Filter — now uses dynamic country name ────────────────────────────
//   const filteredDestinations = destinations.filter(dest => {
//     const matchesSearch = dest.name.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesCountry = selectedCountry === '' || dest.country === selectedCountry;
//     return matchesSearch && matchesCountry;
//   });

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//     if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: '' }));
//   };

//   // ── Image upload (backend-proxied) ───────────────────────────────────────
//   const handleFileChange = async (e) => {
//     const file = e.target.files?.[0];
//     e.target.value = '';
//     if (!file) return;

//     if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
//       setUploadError('Unsupported file type. Please choose a JPG, PNG or WEBP image.');
//       return;
//     }
//     if (file.size > MAX_IMAGE_BYTES) {
//       setUploadError('Image is too large. Maximum allowed size is 2MB.');
//       return;
//     }

//     const localPreview = URL.createObjectURL(file);
//     setImagePreview(localPreview);
//     setUploadError('');
//     setUploadProgress(0);
//     setIsUploading(true);
//     setFormData(prev => ({ ...prev, imagePath: '' }));

//     try {
//       const secureUrl = await uploadImageToCloudinary(file, setUploadProgress);
//       setFormData(prev => ({ ...prev, imagePath: secureUrl }));
//       setImagePreview(secureUrl);
//     } catch (err) {
//       console.error("Image upload failed:", err);
//       setUploadError(getErrorMessage(err, 'Image upload failed. Please try again.'));
//       setImagePreview(null);
//       setFormData(prev => ({ ...prev, imagePath: '' }));
//     } finally {
//       URL.revokeObjectURL(localPreview);
//       setIsUploading(false);
//     }
//   };

//   const handleRemoveImage = () => {
//     setImagePreview(null);
//     setUploadError('');
//     setUploadProgress(0);
//     setFormData(prev => ({ ...prev, imagePath: '' }));
//   };

//   // ── Modal open/close ────────────────────────────────────────────────────
//   const openModal = () => {
//     setEditingDest(null);  // create mode
//     setFormData({ country: '', name: '', type: '', imagePath: '' });
//     setImagePreview(null);
//     setIsUploading(false);
//     setUploadProgress(0);
//     setUploadError('');
//     setFormErrors({});
//     setSubmitError('');
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     if (isLoading || isUploading) return;
//     setIsModalOpen(false);
//     setEditingDest(null);
//   };

//   // ── EDIT — form mein data bhar ke modal kholo ──
//   const openEditModal = (dest) => {
//     setEditingDest(dest);
//     setFormData({
//       country:   dest.country || '',
//       name:      dest.name || '',
//       type:      dest.type || '',
//       imagePath: dest.imagePath || '',
//     });
//     setImagePreview(dest.imagePath || null);
//     setIsUploading(false);
//     setUploadProgress(0);
//     setUploadError('');
//     setFormErrors({});
//     setSubmitError('');
//     setIsModalOpen(true);
//   };

//   // ── VIEW — read-only detail modal ──
//   const openViewModal = (dest) => {
//     setViewDest(dest);
//     setViewOpen(true);
//   };

//   // ── Validation ──────────────────────────────────────────────────────────
//   const validateForm = () => {
//     const errors = {};
//     if (!formData.country) errors.country = 'Country is required.';
//     if (!formData.name.trim()) errors.name = 'Destination name is required.';
//     if (!formData.type) errors.type = 'Destination type is required.';
//     if (isUploading) errors.imagePath = 'Wait for image upload to finish.';
//     if (uploadError) errors.imagePath = uploadError;
//     return errors;
//   };

//   // ── Submit ────────────────────────────────────────────────────────────────
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const errors = validateForm();
//     if (Object.keys(errors).length > 0) {
//       setFormErrors(errors);
//       return;
//     }
//     if (isUploading) { setUploadError('Please wait for the image upload to finish.'); return; }
//     if (uploadError) return;

//     setIsLoading(true);
//     setSubmitError('');
//     try {
//       if (editingDest) {
//         // EDIT mode — update existing
//         const destId = editingDest.id ?? editingDest.publicId;
//         await destinationService.updateDestination(destId, formData);
//       } else {
//         // CREATE mode — naya banao
//         await destinationService.createDestination(formData);
//       }
//       await loadDestinations();
//       closeModal();
//     } catch (error) {
//       console.error('Error saving destination:', error);

//       // Backend ka message + status check karke clear error banao
//       const status  = error?.response?.status;
//       const rawMsg  = (error?.response?.data?.message || '').toLowerCase();
//       const isDuplicate =
//         status === 409 ||
//         rawMsg.includes('duplicate') ||
//         rawMsg.includes('already exists') ||
//         rawMsg.includes('uk_destination_tenant_name');

//       if (isDuplicate) {
//         setFormErrors((prev) => ({
//           ...prev,
//           name: `"${formData.name}" already exists. Please use a different name.`,
//         }));
//         setSubmitError(`A destination named "${formData.name}" already exists in your organization.`);
//       } else {
//         setSubmitError(
//           error?.response?.data?.message ||
//           'Failed to save destination. Please try again.'
//         );
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleDelete = async (dest) => {
//     if (!window.confirm(`Delete destination "${dest.name}"? This cannot be undone.`)) return;
//     try {
//       await destinationService.deleteDestination(dest.id);
//       await loadDestinations();
//     } catch (error) {
//       console.error('Error deleting destination:', error);
//       toast.error(getErrorMessage(error, 'Failed to delete destination.'));
//     }
//   };

//   const modalTitle    = editingDest ? 'Edit Destination' : 'Add New Destination';
//   const modalSubtitle = 'Enter the core details for this destination.';

//   return (
//     <div
//       className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 p-4 sm:p-6 lg:p-8"
//       style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
//     >
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
//         @keyframes fadeIn  { from { opacity: 0; transform: translateY(6px) }  to { opacity: 1; transform: translateY(0) } }
//         @keyframes scaleIn { from { opacity: 0; transform: scale(.97) }        to { opacity: 1; transform: scale(1) } }
//       `}</style>

//       <div className="max-w-screen-2xl mx-auto">

//         {/* Page Header */}
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
//           <div>
//             <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
//               <div className="p-2.5 bg-gradient-to-br from-blue-600 to-blue-400 text-white rounded-2xl shadow-lg shadow-blue-500/25">
//                 <Map size={24} strokeWidth={2.5} />
//               </div>
//               Destination Master
//             </h1>
//             <div className="text-sm text-slate-500 mt-2 font-medium flex items-center gap-2 flex-wrap">
//               <Link to="/" className="text-blue-600 hover:text-blue-800 transition-colors">Home</Link>
//               <span className="text-slate-300">/</span><span className="text-slate-500">Masters</span><span className="text-slate-300">/</span>
//               <span className="text-slate-700 bg-white/80 backdrop-blur border border-slate-200 px-3 py-1 rounded-lg shadow-sm">Destination</span>
//             </div>
//           </div>
//         </div>

//         {/* Main Content Card */}
//         <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
//           <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//             <h2 className="text-lg font-extrabold text-slate-900">Destinations List</h2>
//             <button onClick={openModal} className="w-full sm:w-auto justify-center flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md shadow-blue-500/25 hover:shadow-lg active:scale-95">
//               <Plus size={18} strokeWidth={2.5} /> Add New Destination
//             </button>
//           </div>

//           {/* Filter Bar — dynamic country dropdown */}
//           <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col lg:flex-row gap-3 lg:gap-4 lg:items-center lg:justify-between bg-slate-50/50">
//             <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 sm:gap-4 w-full lg:w-auto">
//               <div className="relative w-full sm:flex-1 sm:min-w-[260px] sm:max-w-sm group">
//                 <input
//                   type="text"
//                   placeholder="Search destinations..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700 shadow-sm hover:border-blue-300"
//                 />
//                 <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
//                   <Search size={16} />
//                 </div>
//               </div>

//               {/* ── DYNAMIC Country Filter ── */}
//               <div className="relative w-full sm:w-auto sm:min-w-[200px] group">
//                 <select
//                   value={selectedCountry}
//                   onChange={(e) => setSelectedCountry(e.target.value)}
//                   className="w-full pl-10 pr-8 py-2.5 bg-white border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 appearance-none cursor-pointer transition-all shadow-sm hover:border-blue-300"
//                 >
//                   <option value="">
//                     {countriesLoading ? 'Loading countries…' : 'All Countries'}
//                   </option>
//                   {countries.map(c => (
//                     <option key={c.id} value={c.name}>{c.name}</option>
//                   ))}
//                 </select>
//                 <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
//                   {countriesLoading
//                     ? <Loader2 size={16} className="animate-spin text-blue-400" />
//                     : <Globe size={16} />}
//                 </div>
//                 <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
//                   <ChevronDown size={14} />
//                 </div>
//               </div>
//             </div>
//             <div className="text-sm font-medium text-slate-500 flex-shrink-0">
//               Showing <span className="text-slate-900 font-bold">{filteredDestinations.length}</span> destinations
//             </div>
//           </div>

//           {/* ─────────── DESKTOP TABLE (md and up) ─────────── */}
//           <div className="hidden md:block overflow-x-auto custom-scrollbar">
//             <table className="w-full min-w-[900px] border-collapse text-sm whitespace-nowrap">
//               <thead>
//                 <tr className="bg-slate-50 text-slate-500 text-[12px] uppercase tracking-wider font-bold border-b border-slate-200">
//                   <th className="px-6 py-4 text-left w-20">ID</th>
//                   <th className="px-6 py-4 text-left w-32">Image</th>
//                   <th className="px-6 py-4 text-left">Destination Name</th>
//                   <th className="px-6 py-4 text-left">Country</th>
//                   <th className="px-6 py-4 text-left">Type</th>
//                   <th className="px-6 py-4 text-center">Scope</th>
//                   <th className="px-6 py-4 text-left">Created At</th>
//                   <th className="px-6 py-4 text-center">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-100 bg-white/60">
//                 {listLoading && (<tr><td colSpan={8} className="px-6 py-12 text-center text-slate-400 font-medium">Loading destinations…</td></tr>)}
//                 {!listLoading && fetchError && (<tr><td colSpan={8} className="px-6 py-12 text-center text-rose-500 font-semibold">{fetchError}</td></tr>)}
//                 {!listLoading && !fetchError && filteredDestinations.length === 0 && (
//                   <tr><td colSpan={8} className="px-6 py-16 text-center">
//                     <div className="flex flex-col items-center justify-center">
//                       <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
//                         <Map size={28} className="text-slate-300" />
//                       </div>
//                       <p className="text-slate-500 font-semibold">No destinations found</p>
//                       <p className="text-slate-400 text-sm mt-0.5">Try a different search, or add a new destination.</p>
//                     </div>
//                   </td></tr>
//                 )}
//                 {!listLoading && !fetchError && filteredDestinations.map((dest) => {
//                   const canModify = isSuperAdmin || !dest.global;
//                   const imageIsUrl = typeof dest.imagePath === 'string' && /^https?:\/\//.test(dest.imagePath);
//                   return (
//                     <tr key={dest.id} className="hover:bg-blue-50/40 transition-colors duration-150 group">
//                       <td className="px-6 py-4 text-slate-500 font-semibold">{dest.id}</td>
//                       <td className="px-6 py-4">
//                         <div className="w-16 h-10 bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden rounded-md shadow-sm">
//                           {imageIsUrl ? <img src={dest.imagePath} alt={dest.name} className="w-full h-full object-cover" /> : <ImageIcon size={18} className="text-slate-400" />}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 font-bold text-slate-900">{dest.name}</td>
//                       <td className="px-6 py-4 text-slate-600 font-medium">{dest.country}</td>
//                       <td className="px-6 py-4"><span className="bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-md text-[11px] font-extrabold uppercase tracking-wide border border-emerald-200">{dest.type || '—'}</span></td>
//                       <td className="px-6 py-4 text-center">
//                         {dest.global
//                           ? <span className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-md text-[11px] font-extrabold uppercase tracking-wide border border-indigo-200"><Globe size={12} strokeWidth={2.5} /> Global</span>
//                           : <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 px-2.5 py-1 rounded-md text-[11px] font-extrabold uppercase tracking-wide border border-amber-200"><MapPin size={12} strokeWidth={2.5} /> Org</span>}
//                       </td>
//                       <td className="px-6 py-4 text-slate-500 font-medium">{formatDate(dest.createdAt)}</td>
//                       <td className="px-6 py-4">
//                         <div className="flex items-center justify-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
//                           <button onClick={() => openViewModal(dest)} className="p-2 bg-teal-50 text-teal-600 hover:bg-teal-500 hover:text-white rounded-lg transition-colors shadow-sm" title="View"><Eye size={16} strokeWidth={2.5} /></button>
//                           <button onClick={() => canModify && openEditModal(dest)} disabled={!canModify} title={canModify ? 'Edit' : 'Global destinations are managed by platform admin'} className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg transition-colors shadow-sm disabled:opacity-30 disabled:cursor-not-allowed"><Edit size={16} strokeWidth={2.5} /></button>
//                           <button onClick={() => canModify && handleDelete(dest)} disabled={!canModify} title={canModify ? 'Delete' : 'Global destinations are managed by platform admin'} className="p-2 bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white rounded-lg transition-colors shadow-sm disabled:opacity-30 disabled:cursor-not-allowed"><Trash2 size={16} strokeWidth={2.5} /></button>
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>

//           {/* ─────────── MOBILE CARDS (below md) ─────────── */}
//           <div className="md:hidden">
//             {listLoading && (
//               <div className="px-4 py-12 text-center text-slate-400 font-medium">Loading destinations…</div>
//             )}
//             {!listLoading && fetchError && (
//               <div className="px-4 py-12 text-center text-rose-500 font-semibold">{fetchError}</div>
//             )}
//             {!listLoading && !fetchError && filteredDestinations.length === 0 && (
//               <div className="px-4 py-16 text-center flex flex-col items-center justify-center">
//                 <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
//                   <Map size={28} className="text-slate-300" />
//                 </div>
//                 <p className="text-slate-500 font-semibold">No destinations found</p>
//                 <p className="text-slate-400 text-sm mt-0.5">Try a different search, or add a new destination.</p>
//               </div>
//             )}
//             {!listLoading && !fetchError && filteredDestinations.length > 0 && (
//               <div className="divide-y divide-slate-100">
//                 {filteredDestinations.map((dest) => {
//                   const canModify = isSuperAdmin || !dest.global;
//                   const imageIsUrl = typeof dest.imagePath === 'string' && /^https?:\/\//.test(dest.imagePath);
//                   return (
//                     <div key={dest.id} className="p-4 hover:bg-blue-50/30 transition-colors" style={{ animation: 'fadeIn .3s ease both' }}>
//                       <div className="flex items-start gap-3">
//                         <div className="w-20 h-16 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0 flex items-center justify-center shadow-sm">
//                           {imageIsUrl ? <img src={dest.imagePath} alt={dest.name} className="w-full h-full object-cover" /> : <ImageIcon size={20} className="text-slate-300" />}
//                         </div>
//                         <div className="flex-1 min-w-0">
//                           <div className="flex items-start justify-between gap-2">
//                             <h3 className="font-bold text-slate-900 truncate leading-tight">{dest.name}</h3>
//                             {dest.global
//                               ? <span className="flex-shrink-0 inline-flex items-center gap-1 bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wide border border-indigo-200"><Globe size={10} strokeWidth={2.5} /> Global</span>
//                               : <span className="flex-shrink-0 inline-flex items-center gap-1 bg-amber-100 text-amber-700 px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wide border border-amber-200"><MapPin size={10} strokeWidth={2.5} /> Org</span>}
//                           </div>
//                           <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mt-1">
//                             <Globe size={12} className="flex-shrink-0 text-slate-400" /><span className="truncate">{dest.country}</span>
//                           </div>
//                           <div className="flex items-center gap-2 mt-2 flex-wrap">
//                             <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wide border border-emerald-200">{dest.type || '—'}</span>
//                             <span className="text-[11px] text-slate-400 font-medium">{formatDate(dest.createdAt)}</span>
//                             <span className="text-[10px] font-mono text-slate-300">#{dest.id}</span>
//                           </div>
//                         </div>
//                       </div>
//                       <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
//                         <button onClick={() => openViewModal(dest)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-teal-50 text-teal-600 hover:bg-teal-500 hover:text-white text-xs font-bold transition-colors active:scale-95"><Eye size={14} strokeWidth={2.5} /> View</button>
//                         <button onClick={() => canModify && openEditModal(dest)} disabled={!canModify} title={canModify ? 'Edit' : 'Global destinations are managed by platform admin'} className="flex items-center justify-center w-11 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"><Edit size={14} strokeWidth={2.5} /></button>
//                         <button onClick={() => canModify && handleDelete(dest)} disabled={!canModify} title={canModify ? 'Delete' : 'Global destinations are managed by platform admin'} className="flex items-center justify-center w-11 py-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white transition-colors active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"><Trash2 size={14} strokeWidth={2.5} /></button>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* MODAL — single step (Basic Information only) */}
//       {isModalOpen && (
//         <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 overflow-y-auto custom-scrollbar">
//           <div
//             className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
//             onClick={closeModal}
//           />

//           <div
//             className="relative bg-white w-full max-w-4xl shadow-2xl mt-4 sm:mt-8 mb-10 rounded-2xl overflow-hidden border border-slate-200/60"
//             style={{ animation: 'scaleIn .25s ease both' }}
//           >

//             {/* Modal Header */}
//             <div className="bg-white px-5 sm:px-8 py-5 flex justify-between items-center border-b border-slate-100 gap-4">
//               <div className="flex items-center gap-3 sm:gap-4 min-w-0">
//                 <div className="p-3 bg-blue-50 text-blue-600 rounded-xl flex-shrink-0"><Map size={22} strokeWidth={2.5} /></div>
//                 <div className="min-w-0">
//                   <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight truncate">{modalTitle}</h2>
//                   <p className="text-slate-500 text-xs sm:text-sm font-medium truncate">{modalSubtitle}</p>
//                 </div>
//               </div>
//               <button type="button" onClick={closeModal} className="text-slate-400 hover:bg-slate-100 hover:text-slate-600 p-2.5 rounded-full transition-colors active:scale-95 flex-shrink-0"><X size={20} strokeWidth={2.5} /></button>
//             </div>

//             <form onSubmit={handleSubmit}>

//               <div className="p-5 sm:p-8 grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8 bg-[#fcfdff]">

//                 {/* LEFT — core fields */}
//                 <div className="space-y-7">

//                   {/* ── DYNAMIC Country Dropdown ── */}
//                   <div className="group">
//                     <label className="block text-sm font-bold text-slate-700 mb-2 group-focus-within:text-blue-600 transition-colors">
//                       Country <span className="text-rose-500">*</span>
//                     </label>
//                     <div className="relative">
//                       <select
//                         name="country"
//                         value={formData.country}
//                         onChange={handleInputChange}
//                         className={`w-full pl-4 pr-10 py-3 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-sm text-slate-700 appearance-none transition-all shadow-sm cursor-pointer ${formErrors.country ? 'border-rose-400' : 'border-slate-200'}`}
//                       >
//                         <option value="" disabled>
//                           {countriesLoading ? 'Loading countries…' : 'Select Country'}
//                         </option>
//                         {countries.map(c => (
//                           <option key={c.id} value={c.name}>{c.name}</option>
//                         ))}
//                       </select>
//                       <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
//                         {countriesLoading
//                           ? <Loader2 size={16} className="animate-spin text-blue-400" />
//                           : <ChevronDown size={16} />}
//                       </div>
//                     </div>
//                     {formErrors.country && <p className="mt-1.5 text-xs text-rose-600 font-semibold flex items-center gap-1"><AlertTriangle size={12} />{formErrors.country}</p>}
//                   </div>

//                   {/* Destination Name */}
//                   <div className="group">
//                     <label className="block text-sm font-bold text-slate-700 mb-2 group-focus-within:text-blue-600 transition-colors">
//                       Destination Name <span className="text-rose-500">*</span>
//                     </label>
//                     <input
//                       type="text"
//                       name="name"
//                       value={formData.name}
//                       onChange={handleInputChange}
//                       placeholder="Enter destination name"
//                       className={`w-full px-4 py-3 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-sm text-slate-800 placeholder-slate-400 transition-all shadow-sm ${formErrors.name ? 'border-rose-400' : 'border-slate-200'}`}
//                     />
//                     {formErrors.name && <p className="mt-1.5 text-xs text-rose-600 font-semibold flex items-center gap-1"><AlertTriangle size={12} />{formErrors.name}</p>}
//                   </div>

//                   {/* Destination Type */}
//                   <div className="group">
//                     <label className="block text-sm font-bold text-slate-700 mb-2 group-focus-within:text-blue-600 transition-colors">
//                       Destination Type <span className="text-rose-500">*</span>
//                     </label>
//                     <div className="relative">
//                       <select
//                         name="type"
//                         value={formData.type}
//                         onChange={handleInputChange}
//                         className={`w-full pl-4 pr-10 py-3 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-sm text-slate-700 appearance-none transition-all shadow-sm cursor-pointer ${formErrors.type ? 'border-rose-400' : 'border-slate-200'}`}
//                       >
//                         <option value="" disabled>Select Type</option>
//                         <option value="Domestic">Domestic</option>
//                         <option value="International">International</option>
//                       </select>
//                       <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400"><ChevronDown size={16} /></div>
//                     </div>
//                     {formErrors.type && <p className="mt-1.5 text-xs text-rose-600 font-semibold flex items-center gap-1"><AlertTriangle size={12} />{formErrors.type}</p>}
//                   </div>
//                 </div>

//                 {/* RIGHT — Image Upload */}
//                 <div className="space-y-7">
//                   <div className="group">
//                     <label className="block text-sm font-bold text-slate-700 mb-2 group-focus-within:text-blue-600 transition-colors">
//                       Destination Cover
//                     </label>
//                     <div className={`flex rounded-xl overflow-hidden border bg-slate-50 focus-within:ring-4 transition-all shadow-sm group-hover:bg-slate-100/50 ${uploadError || formErrors.imagePath ? 'border-rose-300 focus-within:border-rose-500 focus-within:ring-rose-500/10' : 'border-slate-200 focus-within:border-blue-500 focus-within:ring-blue-500/10'}`}>
//                       <div className="px-4 py-2 flex items-center justify-center border-r border-slate-200 bg-white">
//                         {isUploading ? <Loader2 size={20} className="text-blue-500 animate-spin" />
//                           : imagePreview ? <img src={imagePreview} alt="Preview" className="w-8 h-8 rounded object-cover shadow-sm" />
//                           : <ImageIcon size={20} className="text-slate-400" />}
//                       </div>
//                       <input
//                         type="text"
//                         readOnly
//                         value={isUploading ? `Uploading… ${uploadProgress}%` : (formData.imagePath || '')}
//                         placeholder="No file chosen"
//                         className="px-4 py-3 flex-1 min-w-0 bg-transparent text-sm font-medium text-slate-700 focus:outline-none cursor-default truncate"
//                       />
//                       {formData.imagePath && !isUploading && (
//                         <button type="button" onClick={handleRemoveImage} title="Remove image" className="border-l border-slate-200 px-4 py-3 text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-colors flex items-center active:scale-95">
//                           <Trash size={16} strokeWidth={2.5} />
//                         </button>
//                       )}
//                       <label className={`bg-white border-l border-slate-200 px-4 sm:px-6 py-3 text-sm font-bold transition-colors flex items-center gap-2 active:scale-95 m-0 flex-shrink-0 ${isUploading ? 'text-slate-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50 hover:text-blue-700 cursor-pointer'}`}>
//                         <input type="file" onChange={handleFileChange} accept="image/*" className="hidden" disabled={isUploading} />
//                         {isUploading ? <Loader2 size={16} className="animate-spin" />
//                           : formData.imagePath ? <CheckCircle2 size={16} className="text-emerald-500" />
//                           : <UploadCloud size={16} strokeWidth={2.5} />}
//                         {isUploading ? 'Uploading' : formData.imagePath ? 'Change' : 'Browse'}
//                       </label>
//                     </div>

//                     {isUploading && (
//                       <div className="mt-2 h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
//                         <div className="h-full bg-blue-500 rounded-full transition-all duration-200" style={{ width: `${uploadProgress}%` }} />
//                       </div>
//                     )}

//                     {!isUploading && formData.imagePath && imagePreview && (
//                       <div className="mt-3">
//                         <img src={imagePreview} alt="Destination cover preview" className="w-full max-w-xs h-32 object-cover rounded-xl border border-slate-200 shadow-sm" />
//                       </div>
//                     )}

//                     {(uploadError || formErrors.imagePath) && (
//                       <p className="mt-2 text-xs text-rose-600 font-semibold flex items-center gap-1.5">
//                         <AlertTriangle size={14} /> {uploadError || formErrors.imagePath}
//                       </p>
//                     )}

//                     <div className="mt-3 space-y-2 pl-1">
//                       <p className="text-xs text-slate-500 font-medium">Resolution: 800x600px • Max: 2MB • Format: JPG, PNG</p>
//                       <p className="text-xs text-rose-500 font-semibold flex items-center gap-1.5"><AlertTriangle size={14} />Upload only royalty-free or owned assets.</p>
//                     </div>
//                   </div>

//                   <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
//                     <p className="text-sm font-bold text-blue-800 mb-1">Core Details</p>
//                     <p className="text-xs text-blue-600 leading-relaxed">Add the country, name and type for this destination. A cover image is optional. Click <strong>Save</strong> when you're done.</p>
//                   </div>
//                 </div>
//               </div>

//               {/* Save error banner (duplicate etc.) */}
//               {submitError && (
//                 <div className="mx-5 sm:mx-8 mb-2 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 text-sm text-rose-700 font-semibold flex items-center gap-2">
//                   <AlertTriangle size={16} className="flex-shrink-0 text-rose-500" />
//                   {submitError}
//                 </div>
//               )}

//               {/* Modal Footer */}
//               <div className="bg-slate-50 px-5 sm:px-8 py-4 sm:py-5 border-t border-slate-200 flex justify-between items-center rounded-b-2xl gap-3">
//                 <button type="button" disabled={isLoading} onClick={closeModal} className="px-5 sm:px-6 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all shadow-sm active:scale-95 disabled:opacity-50">
//                   Cancel
//                 </button>
//                 <button type="submit" disabled={isLoading || isUploading} className="px-6 sm:px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-blue-500/30 hover:shadow-blue-500/50 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
//                   {isLoading
//                     ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving…</>
//                     : <><CheckCircle size={16} strokeWidth={2.5} /> {editingDest ? 'Update Destination' : 'Save Destination'}</>}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* ════════ VIEW DETAIL MODAL (read-only) ════════ */}
//       {viewOpen && viewDest && (
//         <div className="fixed inset-0 z-[60] flex items-start justify-center p-4 sm:p-6 overflow-y-auto custom-scrollbar">
//           <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setViewOpen(false)} />

//           <div
//             className="relative bg-white w-full max-w-3xl shadow-2xl mt-4 sm:mt-10 mb-10 rounded-3xl overflow-hidden border border-slate-200"
//             style={{ animation: 'scaleIn .25s ease both' }}
//           >

//             {/* Gradient header with cover image */}
//             <div className="relative h-44 overflow-hidden">
//               {viewDest.imagePath && /^https?:\/\//.test(viewDest.imagePath) ? (
//                 <img src={viewDest.imagePath} alt={viewDest.name} className="w-full h-full object-cover" />
//               ) : (
//                 <div className="w-full h-full" style={{ background: 'linear-gradient(135deg,#2563eb 0%,#7c3aed 50%,#db2777 100%)' }} />
//               )}
//               <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
//               <button onClick={() => setViewOpen(false)} className="absolute top-4 right-4 text-white bg-black/20 hover:bg-black/40 p-2 rounded-full transition active:scale-95"><X size={20} /></button>
//               <div className="absolute bottom-4 left-6 right-6">
//                 <h2 className="text-2xl font-extrabold text-white drop-shadow">{viewDest.name}</h2>
//                 <div className="flex items-center gap-2 mt-1.5 flex-wrap">
//                   <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm text-white px-2.5 py-0.5 rounded-full text-xs font-bold"><Globe size={11} /> {viewDest.country}</span>
//                   {viewDest.type && <span className="inline-flex items-center gap-1 bg-emerald-500/80 text-white px-2.5 py-0.5 rounded-full text-xs font-bold">{viewDest.type}</span>}
//                   {viewDest.global
//                     ? <span className="inline-flex items-center gap-1 bg-indigo-500/80 text-white px-2.5 py-0.5 rounded-full text-xs font-bold"><Globe size={11} /> Global</span>
//                     : <span className="inline-flex items-center gap-1 bg-amber-500/80 text-white px-2.5 py-0.5 rounded-full text-xs font-bold"><MapPin size={11} /> Org</span>}
//                 </div>
//               </div>
//             </div>

//             {/* Body — policies (read-only) */}
//             {/* <div className="p-6 sm:p-8 space-y-5 max-h-[55vh] overflow-y-auto bg-gradient-to-b from-slate-50/50 to-white">
//               {[
//                 { label: 'Inclusions',            value: viewDest.inclusions,           color: 'emerald' },
//                 { label: 'Exclusions',            value: viewDest.exclusions,           color: 'rose' },
//                 { label: 'Payment Policies',      value: viewDest.paymentPolicies,      color: 'blue' },
//                 { label: 'Cancellation Policies', value: viewDest.cancellationPolicies, color: 'amber' },
//                 { label: 'Booking Terms',         value: viewDest.bookingTerms,         color: 'violet' },
//               ].map(({ label, value, color }) => (
//                 <div key={label}>
//                   <h3 className={`text-xs font-bold uppercase tracking-wide mb-1.5 text-${color}-600`}>{label}</h3>
//                   {value && value.replace(/<[^>]*>/g, '').trim() ? (
//                     <div className="text-sm text-slate-700 leading-relaxed prose prose-sm max-w-none [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5" dangerouslySetInnerHTML={{ __html: value }} />
//                   ) : (
//                     <p className="text-sm text-slate-400 italic m-0">Not provided</p>
//                   )}
//                 </div>
//               ))}
//             </div> */}

//             {/* Footer */}
//             <div className="bg-white px-6 sm:px-8 py-4 border-t border-slate-200 flex justify-between items-center">
//               <button onClick={() => setViewOpen(false)} className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 transition text-sm active:scale-95">Close</button>
//               {(isSuperAdmin || !viewDest.global) && (
//                 <button onClick={() => { setViewOpen(false); openEditModal(viewDest); }} className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition text-sm active:scale-95 flex items-center gap-2">
//                   <Edit size={15} /> Edit
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DestinationMaster;











import { useState, useEffect } from 'react';
import { Search, Plus, Eye, Edit, Trash2, Map, Globe, Image as ImageIcon, X, ChevronDown, UploadCloud, CheckCircle2, MapPin, AlertTriangle, Loader2, Trash, CheckCircle, Tag, Calendar, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { destinationService, uploadImageToCloudinary } from "../api/DestinationService";
import { geographyService } from "@shared/api/geographyService";
import { getErrorMessage } from "@shared/api/apiError";
import { toast } from "@shared/ui/toast";

const MAX_IMAGE_BYTES = 2 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];

// =========================================================================
// ROLE HELPERS
// =========================================================================
const getUserRole = () => (localStorage.getItem('userRole') || '').toUpperCase();
const isSuperAdminRole = () => getUserRole().includes('SUPER');

const isHttpUrl = (v) => typeof v === 'string' && /^https?:\/\//.test(v);

// =========================================================================
// MAIN COMPONENT
// =========================================================================
const DestinationMaster = () => {
  const [destinations, setDestinations] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ── DYNAMIC COUNTRIES FROM BACKEND ────────────────────────────────────
  const [countries, setCountries] = useState([]);          // { id, name }[]
  const [countriesLoading, setCountriesLoading] = useState(false);

  // ── Modal state ─────────────────────────────────────────────────────────
  const [formErrors, setFormErrors] = useState({});
  const [submitError, setSubmitError] = useState('');  // save error (duplicate etc.)
  const [editingDest, setEditingDest] = useState(null);  // null=create, object=edit

  // View modal state
  const [viewOpen, setViewOpen] = useState(false);
  const [viewDest, setViewDest] = useState(null);

  const isSuperAdmin = isSuperAdminRole();

  // ── Fetch countries from geographyService on mount ────────────────────
  useEffect(() => {
    const fetchCountries = async () => {
      setCountriesLoading(true);
      try {
        // geographyService.getCountries() returns [{ id, name }] directly
        const data = await geographyService.getCountries();
        setCountries(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load countries:', err);
        setCountries([]);
      } finally {
        setCountriesLoading(false);
      }
    };
    fetchCountries();
  }, []);

  const loadDestinations = async () => {
    setListLoading(true);
    setFetchError('');
    try {
      const res = await destinationService.getAllDestinations({ size: 100 });
      const rows = Array.isArray(res.data?.data) ? res.data.data : [];
      setDestinations(rows);
    } catch (err) {
      console.error('Failed to load destinations:', err);
      setFetchError(err.response?.data?.message || 'Failed to load destinations. Please try again.');
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => { loadDestinations(); }, []);

  const formatDate = (value) => {
    if (!value) return '—';
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? value : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // ── Image upload state ──────────────────────────────────────────────────
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');

  // ── Form state (policies removed) ────────────────────────────────────────
  const [formData, setFormData] = useState({
    country: '', name: '', type: '', imagePath: ''
  });

  // ── Filter — now uses dynamic country name ────────────────────────────
  const filteredDestinations = destinations.filter(dest => {
    const matchesSearch = dest.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCountry = selectedCountry === '' || dest.country === selectedCountry;
    return matchesSearch && matchesCountry;
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: '' }));
  };

  // ── Image upload (backend-proxied) ───────────────────────────────────────
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setUploadError('Unsupported file type. Please choose a JPG, PNG or WEBP image.');
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setUploadError('Image is too large. Maximum allowed size is 2MB.');
      return;
    }

    const localPreview = URL.createObjectURL(file);
    setImagePreview(localPreview);
    setUploadError('');
    setUploadProgress(0);
    setIsUploading(true);
    setFormData(prev => ({ ...prev, imagePath: '' }));

    try {
      const secureUrl = await uploadImageToCloudinary(file, setUploadProgress);
      setFormData(prev => ({ ...prev, imagePath: secureUrl }));
      setImagePreview(secureUrl);
    } catch (err) {
      console.error("Image upload failed:", err);
      setUploadError(getErrorMessage(err, 'Image upload failed. Please try again.'));
      setImagePreview(null);
      setFormData(prev => ({ ...prev, imagePath: '' }));
    } finally {
      URL.revokeObjectURL(localPreview);
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setUploadError('');
    setUploadProgress(0);
    setFormData(prev => ({ ...prev, imagePath: '' }));
  };

  // ── Modal open/close ────────────────────────────────────────────────────
  const openModal = () => {
    setEditingDest(null);  // create mode
    setFormData({ country: '', name: '', type: '', imagePath: '' });
    setImagePreview(null);
    setIsUploading(false);
    setUploadProgress(0);
    setUploadError('');
    setFormErrors({});
    setSubmitError('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isLoading || isUploading) return;
    setIsModalOpen(false);
    setEditingDest(null);
  };

  // ── EDIT — form mein data bhar ke modal kholo ──
  const openEditModal = (dest) => {
    setEditingDest(dest);
    setFormData({
      country:   dest.country || '',
      name:      dest.name || '',
      type:      dest.type || '',
      imagePath: dest.imagePath || '',
    });
    setImagePreview(dest.imagePath || null);
    setIsUploading(false);
    setUploadProgress(0);
    setUploadError('');
    setFormErrors({});
    setSubmitError('');
    setIsModalOpen(true);
  };

  // ── VIEW — read-only detail modal ──
  const openViewModal = (dest) => {
    setViewDest(dest);
    setViewOpen(true);
  };

  // ── Validation ──────────────────────────────────────────────────────────
  const validateForm = () => {
    const errors = {};
    if (!formData.country) errors.country = 'Country is required.';
    if (!formData.name.trim()) errors.name = 'Destination name is required.';
    if (!formData.type) errors.type = 'Destination type is required.';
    if (isUploading) errors.imagePath = 'Wait for image upload to finish.';
    if (uploadError) errors.imagePath = uploadError;
    return errors;
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    if (isUploading) { setUploadError('Please wait for the image upload to finish.'); return; }
    if (uploadError) return;

    setIsLoading(true);
    setSubmitError('');
    try {
      if (editingDest) {
        // EDIT mode — update existing
        const destId = editingDest.id ?? editingDest.publicId;
        await destinationService.updateDestination(destId, formData);
      } else {
        // CREATE mode — naya banao
        await destinationService.createDestination(formData);
      }
      await loadDestinations();
      closeModal();
    } catch (error) {
      console.error('Error saving destination:', error);

      // Backend ka message + status check karke clear error banao
      const status  = error?.response?.status;
      const rawMsg  = (error?.response?.data?.message || '').toLowerCase();
      const isDuplicate =
        status === 409 ||
        rawMsg.includes('duplicate') ||
        rawMsg.includes('already exists') ||
        rawMsg.includes('uk_destination_tenant_name');

      if (isDuplicate) {
        setFormErrors((prev) => ({
          ...prev,
          name: `"${formData.name}" already exists. Please use a different name.`,
        }));
        setSubmitError(`A destination named "${formData.name}" already exists in your organization.`);
      } else {
        setSubmitError(
          error?.response?.data?.message ||
          'Failed to save destination. Please try again.'
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (dest) => {
    if (!window.confirm(`Delete destination "${dest.name}"? This cannot be undone.`)) return;
    try {
      await destinationService.deleteDestination(dest.id);
      await loadDestinations();
    } catch (error) {
      console.error('Error deleting destination:', error);
      toast.error(getErrorMessage(error, 'Failed to delete destination.'));
    }
  };

  const modalTitle    = editingDest ? 'Edit Destination' : 'Add New Destination';
  const modalSubtitle = 'Enter the core details for this destination.';

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 p-4 sm:p-6 lg:p-8"
      style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        @keyframes fadeIn  { from { opacity: 0; transform: translateY(6px) }  to { opacity: 1; transform: translateY(0) } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(.97) }        to { opacity: 1; transform: scale(1) } }
        @keyframes riseIn  { from { opacity: 0; transform: translateY(10px) }  to { opacity: 1; transform: translateY(0) } }
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }
      `}</style>

      <div className="max-w-screen-2xl mx-auto">

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-blue-600 to-blue-400 text-white rounded-2xl shadow-lg shadow-blue-500/25">
                <Map size={24} strokeWidth={2.5} />
              </div>
              Destination Master
            </h1>
            <div className="text-sm text-slate-500 mt-2 font-medium flex items-center gap-2 flex-wrap">
              <Link to="/" className="text-blue-600 hover:text-blue-800 transition-colors">Home</Link>
              <span className="text-slate-300">/</span><span className="text-slate-500">Masters</span><span className="text-slate-300">/</span>
              <span className="text-slate-700 bg-white/80 backdrop-blur border border-slate-200 px-3 py-1 rounded-lg shadow-sm">Destination</span>
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-lg font-extrabold text-slate-900">Destinations List</h2>
            <button onClick={openModal} className="w-full sm:w-auto justify-center flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md shadow-blue-500/25 hover:shadow-lg active:scale-95">
              <Plus size={18} strokeWidth={2.5} /> Add New Destination
            </button>
          </div>

          {/* Filter Bar — dynamic country dropdown */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col lg:flex-row gap-3 lg:gap-4 lg:items-center lg:justify-between bg-slate-50/50">
            <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 sm:gap-4 w-full lg:w-auto">
              <div className="relative w-full sm:flex-1 sm:min-w-[260px] sm:max-w-sm group">
                <input
                  type="text"
                  placeholder="Search destinations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700 shadow-sm hover:border-blue-300"
                />
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                  <Search size={16} />
                </div>
              </div>

              {/* ── DYNAMIC Country Filter ── */}
              <div className="relative w-full sm:w-auto sm:min-w-[200px] group">
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full pl-10 pr-8 py-2.5 bg-white border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 appearance-none cursor-pointer transition-all shadow-sm hover:border-blue-300"
                >
                  <option value="">
                    {countriesLoading ? 'Loading countries…' : 'All Countries'}
                  </option>
                  {countries.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                  {countriesLoading
                    ? <Loader2 size={16} className="animate-spin text-blue-400" />
                    : <Globe size={16} />}
                </div>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                  <ChevronDown size={14} />
                </div>
              </div>
            </div>
            <div className="text-sm font-medium text-slate-500 flex-shrink-0">
              Showing <span className="text-slate-900 font-bold">{filteredDestinations.length}</span> destinations
            </div>
          </div>

          {/* ─────────── DESKTOP TABLE (md and up) ─────────── */}
          <div className="hidden md:block overflow-x-auto custom-scrollbar">
            <table className="w-full min-w-[900px] border-collapse text-sm whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-[12px] uppercase tracking-wider font-bold border-b border-slate-200">
                  <th className="px-6 py-4 text-left w-20">ID</th>
                  <th className="px-6 py-4 text-left w-32">Image</th>
                  <th className="px-6 py-4 text-left">Destination Name</th>
                  <th className="px-6 py-4 text-left">Country</th>
                  <th className="px-6 py-4 text-left">Type</th>
                  <th className="px-6 py-4 text-center">Scope</th>
                  <th className="px-6 py-4 text-left">Created At</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white/60">
                {listLoading && (<tr><td colSpan={8} className="px-6 py-12 text-center text-slate-400 font-medium">Loading destinations…</td></tr>)}
                {!listLoading && fetchError && (<tr><td colSpan={8} className="px-6 py-12 text-center text-rose-500 font-semibold">{fetchError}</td></tr>)}
                {!listLoading && !fetchError && filteredDestinations.length === 0 && (
                  <tr><td colSpan={8} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                        <Map size={28} className="text-slate-300" />
                      </div>
                      <p className="text-slate-500 font-semibold">No destinations found</p>
                      <p className="text-slate-400 text-sm mt-0.5">Try a different search, or add a new destination.</p>
                    </div>
                  </td></tr>
                )}
                {!listLoading && !fetchError && filteredDestinations.map((dest) => {
                  const canModify = isSuperAdmin || !dest.global;
                  const imageIsUrl = isHttpUrl(dest.imagePath);
                  return (
                    <tr key={dest.id} className="hover:bg-blue-50/40 transition-colors duration-150 group">
                      <td className="px-6 py-4 text-slate-500 font-semibold">{dest.id}</td>
                      <td className="px-6 py-4">
                        <div className="w-16 h-10 bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden rounded-md shadow-sm">
                          {imageIsUrl ? <img src={dest.imagePath} alt={dest.name} className="w-full h-full object-cover" /> : <ImageIcon size={18} className="text-slate-400" />}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-900">{dest.name}</td>
                      <td className="px-6 py-4 text-slate-600 font-medium">{dest.country}</td>
                      <td className="px-6 py-4"><span className="bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-md text-[11px] font-extrabold uppercase tracking-wide border border-emerald-200">{dest.type || '—'}</span></td>
                      <td className="px-6 py-4 text-center">
                        {dest.global
                          ? <span className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-md text-[11px] font-extrabold uppercase tracking-wide border border-indigo-200"><Globe size={12} strokeWidth={2.5} /> Global</span>
                          : <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 px-2.5 py-1 rounded-md text-[11px] font-extrabold uppercase tracking-wide border border-amber-200"><MapPin size={12} strokeWidth={2.5} /> Org</span>}
                      </td>
                      <td className="px-6 py-4 text-slate-500 font-medium">{formatDate(dest.createdAt)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openViewModal(dest)} className="p-2 bg-teal-50 text-teal-600 hover:bg-teal-500 hover:text-white rounded-lg transition-colors shadow-sm" title="View"><Eye size={16} strokeWidth={2.5} /></button>
                          <button onClick={() => canModify && openEditModal(dest)} disabled={!canModify} title={canModify ? 'Edit' : 'Global destinations are managed by platform admin'} className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg transition-colors shadow-sm disabled:opacity-30 disabled:cursor-not-allowed"><Edit size={16} strokeWidth={2.5} /></button>
                          <button onClick={() => canModify && handleDelete(dest)} disabled={!canModify} title={canModify ? 'Delete' : 'Global destinations are managed by platform admin'} className="p-2 bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white rounded-lg transition-colors shadow-sm disabled:opacity-30 disabled:cursor-not-allowed"><Trash2 size={16} strokeWidth={2.5} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ─────────── MOBILE CARDS (below md) ─────────── */}
          <div className="md:hidden">
            {listLoading && (
              <div className="px-4 py-12 text-center text-slate-400 font-medium">Loading destinations…</div>
            )}
            {!listLoading && fetchError && (
              <div className="px-4 py-12 text-center text-rose-500 font-semibold">{fetchError}</div>
            )}
            {!listLoading && !fetchError && filteredDestinations.length === 0 && (
              <div className="px-4 py-16 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                  <Map size={28} className="text-slate-300" />
                </div>
                <p className="text-slate-500 font-semibold">No destinations found</p>
                <p className="text-slate-400 text-sm mt-0.5">Try a different search, or add a new destination.</p>
              </div>
            )}
            {!listLoading && !fetchError && filteredDestinations.length > 0 && (
              <div className="divide-y divide-slate-100">
                {filteredDestinations.map((dest) => {
                  const canModify = isSuperAdmin || !dest.global;
                  const imageIsUrl = isHttpUrl(dest.imagePath);
                  return (
                    <div key={dest.id} className="p-4 hover:bg-blue-50/30 transition-colors" style={{ animation: 'fadeIn .3s ease both' }}>
                      <div className="flex items-start gap-3">
                        <div className="w-20 h-16 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0 flex items-center justify-center shadow-sm">
                          {imageIsUrl ? <img src={dest.imagePath} alt={dest.name} className="w-full h-full object-cover" /> : <ImageIcon size={20} className="text-slate-300" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-bold text-slate-900 truncate leading-tight">{dest.name}</h3>
                            {dest.global
                              ? <span className="flex-shrink-0 inline-flex items-center gap-1 bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wide border border-indigo-200"><Globe size={10} strokeWidth={2.5} /> Global</span>
                              : <span className="flex-shrink-0 inline-flex items-center gap-1 bg-amber-100 text-amber-700 px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wide border border-amber-200"><MapPin size={10} strokeWidth={2.5} /> Org</span>}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mt-1">
                            <Globe size={12} className="flex-shrink-0 text-slate-400" /><span className="truncate">{dest.country}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wide border border-emerald-200">{dest.type || '—'}</span>
                            <span className="text-[11px] text-slate-400 font-medium">{formatDate(dest.createdAt)}</span>
                            <span className="text-[10px] font-mono text-slate-300">#{dest.id}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
                        <button onClick={() => openViewModal(dest)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-teal-50 text-teal-600 hover:bg-teal-500 hover:text-white text-xs font-bold transition-colors active:scale-95"><Eye size={14} strokeWidth={2.5} /> View</button>
                        <button onClick={() => canModify && openEditModal(dest)} disabled={!canModify} title={canModify ? 'Edit' : 'Global destinations are managed by platform admin'} className="flex items-center justify-center w-11 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"><Edit size={14} strokeWidth={2.5} /></button>
                        <button onClick={() => canModify && handleDelete(dest)} disabled={!canModify} title={canModify ? 'Delete' : 'Global destinations are managed by platform admin'} className="flex items-center justify-center w-11 py-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white transition-colors active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"><Trash2 size={14} strokeWidth={2.5} /></button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL — single step (Basic Information only) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 overflow-y-auto custom-scrollbar">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={closeModal}
          />

          <div
            className="relative bg-white w-full max-w-4xl shadow-2xl mt-4 sm:mt-8 mb-10 rounded-2xl overflow-hidden border border-slate-200/60"
            style={{ animation: 'scaleIn .25s ease both' }}
          >

            {/* Modal Header */}
            <div className="bg-white px-5 sm:px-8 py-5 flex justify-between items-center border-b border-slate-100 gap-4">
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl flex-shrink-0"><Map size={22} strokeWidth={2.5} /></div>
                <div className="min-w-0">
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight truncate">{modalTitle}</h2>
                  <p className="text-slate-500 text-xs sm:text-sm font-medium truncate">{modalSubtitle}</p>
                </div>
              </div>
              <button type="button" onClick={closeModal} className="text-slate-400 hover:bg-slate-100 hover:text-slate-600 p-2.5 rounded-full transition-colors active:scale-95 flex-shrink-0"><X size={20} strokeWidth={2.5} /></button>
            </div>

            <form onSubmit={handleSubmit}>

              <div className="p-5 sm:p-8 grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8 bg-[#fcfdff]">

                {/* LEFT — core fields */}
                <div className="space-y-7">

                  {/* ── DYNAMIC Country Dropdown ── */}
                  <div className="group">
                    <label className="block text-sm font-bold text-slate-700 mb-2 group-focus-within:text-blue-600 transition-colors">
                      Country <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className={`w-full pl-4 pr-10 py-3 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-sm text-slate-700 appearance-none transition-all shadow-sm cursor-pointer ${formErrors.country ? 'border-rose-400' : 'border-slate-200'}`}
                      >
                        <option value="" disabled>
                          {countriesLoading ? 'Loading countries…' : 'Select Country'}
                        </option>
                        {countries.map(c => (
                          <option key={c.id} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
                        {countriesLoading
                          ? <Loader2 size={16} className="animate-spin text-blue-400" />
                          : <ChevronDown size={16} />}
                      </div>
                    </div>
                    {formErrors.country && <p className="mt-1.5 text-xs text-rose-600 font-semibold flex items-center gap-1"><AlertTriangle size={12} />{formErrors.country}</p>}
                  </div>

                  {/* Destination Name */}
                  <div className="group">
                    <label className="block text-sm font-bold text-slate-700 mb-2 group-focus-within:text-blue-600 transition-colors">
                      Destination Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter destination name"
                      className={`w-full px-4 py-3 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-sm text-slate-800 placeholder-slate-400 transition-all shadow-sm ${formErrors.name ? 'border-rose-400' : 'border-slate-200'}`}
                    />
                    {formErrors.name && <p className="mt-1.5 text-xs text-rose-600 font-semibold flex items-center gap-1"><AlertTriangle size={12} />{formErrors.name}</p>}
                  </div>

                  {/* Destination Type */}
                  <div className="group">
                    <label className="block text-sm font-bold text-slate-700 mb-2 group-focus-within:text-blue-600 transition-colors">
                      Destination Type <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className={`w-full pl-4 pr-10 py-3 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-sm text-slate-700 appearance-none transition-all shadow-sm cursor-pointer ${formErrors.type ? 'border-rose-400' : 'border-slate-200'}`}
                      >
                        <option value="" disabled>Select Type</option>
                        <option value="Domestic">Domestic</option>
                        <option value="International">International</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400"><ChevronDown size={16} /></div>
                    </div>
                    {formErrors.type && <p className="mt-1.5 text-xs text-rose-600 font-semibold flex items-center gap-1"><AlertTriangle size={12} />{formErrors.type}</p>}
                  </div>
                </div>

                {/* RIGHT — Image Upload */}
                <div className="space-y-7">
                  <div className="group">
                    <label className="block text-sm font-bold text-slate-700 mb-2 group-focus-within:text-blue-600 transition-colors">
                      Destination Cover
                    </label>
                    <div className={`flex rounded-xl overflow-hidden border bg-slate-50 focus-within:ring-4 transition-all shadow-sm group-hover:bg-slate-100/50 ${uploadError || formErrors.imagePath ? 'border-rose-300 focus-within:border-rose-500 focus-within:ring-rose-500/10' : 'border-slate-200 focus-within:border-blue-500 focus-within:ring-blue-500/10'}`}>
                      <div className="px-4 py-2 flex items-center justify-center border-r border-slate-200 bg-white">
                        {isUploading ? <Loader2 size={20} className="text-blue-500 animate-spin" />
                          : imagePreview ? <img src={imagePreview} alt="Preview" className="w-8 h-8 rounded object-cover shadow-sm" />
                          : <ImageIcon size={20} className="text-slate-400" />}
                      </div>
                      <input
                        type="text"
                        readOnly
                        value={isUploading ? `Uploading… ${uploadProgress}%` : (formData.imagePath || '')}
                        placeholder="No file chosen"
                        className="px-4 py-3 flex-1 min-w-0 bg-transparent text-sm font-medium text-slate-700 focus:outline-none cursor-default truncate"
                      />
                      {formData.imagePath && !isUploading && (
                        <button type="button" onClick={handleRemoveImage} title="Remove image" className="border-l border-slate-200 px-4 py-3 text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-colors flex items-center active:scale-95">
                          <Trash size={16} strokeWidth={2.5} />
                        </button>
                      )}
                      <label className={`bg-white border-l border-slate-200 px-4 sm:px-6 py-3 text-sm font-bold transition-colors flex items-center gap-2 active:scale-95 m-0 flex-shrink-0 ${isUploading ? 'text-slate-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50 hover:text-blue-700 cursor-pointer'}`}>
                        <input type="file" onChange={handleFileChange} accept="image/*" className="hidden" disabled={isUploading} />
                        {isUploading ? <Loader2 size={16} className="animate-spin" />
                          : formData.imagePath ? <CheckCircle2 size={16} className="text-emerald-500" />
                          : <UploadCloud size={16} strokeWidth={2.5} />}
                        {isUploading ? 'Uploading' : formData.imagePath ? 'Change' : 'Browse'}
                      </label>
                    </div>

                    {isUploading && (
                      <div className="mt-2 h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full transition-all duration-200" style={{ width: `${uploadProgress}%` }} />
                      </div>
                    )}

                    {!isUploading && formData.imagePath && imagePreview && (
                      <div className="mt-3">
                        <img src={imagePreview} alt="Destination cover preview" className="w-full max-w-xs h-32 object-cover rounded-xl border border-slate-200 shadow-sm" />
                      </div>
                    )}

                    {(uploadError || formErrors.imagePath) && (
                      <p className="mt-2 text-xs text-rose-600 font-semibold flex items-center gap-1.5">
                        <AlertTriangle size={14} /> {uploadError || formErrors.imagePath}
                      </p>
                    )}

                    <div className="mt-3 space-y-2 pl-1">
                      <p className="text-xs text-slate-500 font-medium">Resolution: 800x600px • Max: 2MB • Format: JPG, PNG</p>
                      <p className="text-xs text-rose-500 font-semibold flex items-center gap-1.5"><AlertTriangle size={14} />Upload only royalty-free or owned assets.</p>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
                    <p className="text-sm font-bold text-blue-800 mb-1">Core Details</p>
                    <p className="text-xs text-blue-600 leading-relaxed">Add the country, name and type for this destination. A cover image is optional. Click <strong>Save</strong> when you're done.</p>
                  </div>
                </div>
              </div>

              {/* Save error banner (duplicate etc.) */}
              {submitError && (
                <div className="mx-5 sm:mx-8 mb-2 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 text-sm text-rose-700 font-semibold flex items-center gap-2">
                  <AlertTriangle size={16} className="flex-shrink-0 text-rose-500" />
                  {submitError}
                </div>
              )}

              {/* Modal Footer */}
              <div className="bg-slate-50 px-5 sm:px-8 py-4 sm:py-5 border-t border-slate-200 flex justify-between items-center rounded-b-2xl gap-3">
                <button type="button" disabled={isLoading} onClick={closeModal} className="px-5 sm:px-6 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all shadow-sm active:scale-95 disabled:opacity-50">
                  Cancel
                </button>
                <button type="submit" disabled={isLoading || isUploading} className="px-6 sm:px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-blue-500/30 hover:shadow-blue-500/50 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {isLoading
                    ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving…</>
                    : <><CheckCircle size={16} strokeWidth={2.5} /> {editingDest ? 'Update Destination' : 'Save Destination'}</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ════════ VIEW DETAIL MODAL (read-only) ════════ */}
      {viewOpen && viewDest && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center p-4 sm:p-6 overflow-y-auto custom-scrollbar">
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setViewOpen(false)} />

          <div
            className="relative bg-white w-full max-w-2xl shadow-2xl mt-4 sm:mt-12 mb-10 rounded-3xl overflow-hidden border border-slate-200"
            style={{ animation: 'scaleIn .25s ease both' }}
          >

            {/* ── HERO — cover image / gradient fallback ── */}
            <div className="relative h-52 sm:h-60 overflow-hidden">
              {isHttpUrl(viewDest.imagePath) ? (
                <img src={viewDest.imagePath} alt={viewDest.name} className="w-full h-full object-cover" />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg,#1e3a8a 0%,#2563eb 50%,#60a5fa 100%)' }}
                >
                  <Map size={64} className="text-white/20" strokeWidth={1.5} />
                </div>
              )}

              {/* readable scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-slate-900/10" />

              <button
                onClick={() => setViewOpen(false)}
                title="Close"
                className="absolute top-4 right-4 text-white bg-black/25 hover:bg-black/50 backdrop-blur-sm p-2 rounded-full transition active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/70"
              >
                <X size={18} strokeWidth={2.5} />
              </button>

              <div className="absolute bottom-5 left-6 right-6" style={{ animation: 'riseIn .35s ease both' }}>
                <div className="flex items-center gap-2 mb-2.5 flex-wrap">
                  {viewDest.global
                    ? <span className="inline-flex items-center gap-1 bg-indigo-500 text-white px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-md"><Globe size={11} strokeWidth={2.5} /> Global</span>
                    : <span className="inline-flex items-center gap-1 bg-amber-500 text-white px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-md"><MapPin size={11} strokeWidth={2.5} /> Org</span>}
                  {viewDest.type && (
                    <span className="inline-flex items-center gap-1 bg-emerald-500 text-white px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-md">{viewDest.type}</span>
                  )}
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight drop-shadow-lg">
                  {viewDest.name}
                </h2>
                <p className="text-white/85 text-sm font-semibold flex items-center gap-1.5 mt-1.5">
                  <Globe size={13} strokeWidth={2.5} /> {viewDest.country || '—'}
                </p>
              </div>
            </div>

            {/* ── BODY — detail cards ── */}
            <div className="p-6 sm:p-8 bg-gradient-to-b from-slate-50/70 to-white max-h-[50vh] overflow-y-auto custom-scrollbar">
              <p className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-4">Destination Details</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    icon: Globe,
                    label: 'Country',
                    value: viewDest.country,
                    tint: 'bg-blue-50 text-blue-600',
                  },
                  {
                    icon: Tag,
                    label: 'Destination Type',
                    value: viewDest.type,
                    tint: 'bg-emerald-50 text-emerald-600',
                  },
                  {
                    icon: viewDest.global ? Globe : MapPin,
                    label: 'Scope',
                    value: viewDest.global ? 'Global — managed by platform' : 'Organization',
                    tint: viewDest.global ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600',
                  },
                  {
                    icon: Calendar,
                    label: 'Created On',
                    value: formatDate(viewDest.createdAt),
                    tint: 'bg-violet-50 text-violet-600',
                  },
                ].map(({ icon: Icon, label, value, tint }) => (
                  <div
                    key={label}
                    className="flex items-start gap-3 bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm hover:border-blue-200 hover:shadow-md transition-all"
                  >
                    <div className={`p-2 rounded-xl flex-shrink-0 ${tint}`}>
                      <Icon size={16} strokeWidth={2.5} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-0.5">{label}</p>
                      <p className="text-sm font-bold text-slate-800 leading-snug break-words m-0">{value || '—'}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cover image row */}
              <div className="mt-3 flex items-center gap-3 bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm">
                <div className="w-16 h-12 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                  {isHttpUrl(viewDest.imagePath)
                    ? <img src={viewDest.imagePath} alt="" className="w-full h-full object-cover" />
                    : <ImageIcon size={18} className="text-slate-300" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-0.5">Cover Image</p>
                  {isHttpUrl(viewDest.imagePath) ? (
                    <a
                      href={viewDest.imagePath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-bold text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-1"
                    >
                      Open full image <ExternalLink size={12} strokeWidth={2.5} />
                    </a>
                  ) : (
                    <p className="text-sm font-semibold text-slate-400 m-0">No cover uploaded</p>
                  )}
                </div>
                <span className="text-[10px] font-mono text-slate-300 flex-shrink-0">#{viewDest.id}</span>
              </div>
            </div>

            {/* ── FOOTER ── */}
            <div className="bg-white px-6 sm:px-8 py-4 border-t border-slate-100 flex justify-between items-center gap-3">
              <button
                onClick={() => setViewOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 transition text-sm active:scale-95"
              >
                Close
              </button>
              {(isSuperAdmin || !viewDest.global) && (
                <button
                  onClick={() => { setViewOpen(false); openEditModal(viewDest); }}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition text-sm active:scale-95 flex items-center gap-2 shadow-md shadow-blue-500/25 hover:shadow-blue-500/40"
                >
                  <Edit size={15} strokeWidth={2.5} /> Edit Destination
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DestinationMaster;