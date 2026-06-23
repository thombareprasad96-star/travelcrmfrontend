


// prasad page





// import React, { useState, useRef, useEffect } from 'react';
// import {
//   Search, Plus, Eye, Edit, Trash2, Map, Globe, Image as ImageIcon, X,
//   ChevronDown, Bold, Italic, Underline, Strikethrough, AlignLeft, AlignCenter, AlignRight,
//   List, ListOrdered, Eraser, Baseline, UploadCloud, CheckCircle2, MapPin, AlertTriangle, Loader2, Trash,
//   ArrowRight, ArrowLeft, CheckCircle
// } from 'lucide-react';
// import { Link } from 'react-router-dom';
// import { destinationService, uploadImageToCloudinary } from '../services/DestinationService';
// import {geographyService} from "../services/geographyService"

// const MAX_IMAGE_BYTES = 2 * 1024 * 1024;
// const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];

// // =========================================================================
// // RICH TEXT EDITOR
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
//       <div className="bg-white border-b border-slate-200 px-3 py-2 flex flex-wrap items-center gap-x-2 gap-y-2 text-slate-600 text-sm select-none">
//         <button type="button" onMouseDown={(e) => executeCommand(e, 'formatBlock', 'P')} className="flex items-center gap-1.5 px-2 py-1 hover:bg-slate-100 rounded-lg font-semibold text-slate-700 transition-colors">
//           Normal <ChevronDown size={14} className="text-slate-400" />
//         </button>
//         <div className="w-px h-5 bg-slate-200 hidden sm:block mx-1"></div>
//         <div className="flex items-center gap-0.5">
//           <button type="button" onMouseDown={(e) => executeCommand(e, 'bold')} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-700 transition-colors" title="Bold"><Bold size={15} strokeWidth={2.5} /></button>
//           <button type="button" onMouseDown={(e) => executeCommand(e, 'italic')} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-700 transition-colors" title="Italic"><Italic size={15} /></button>
//           <button type="button" onMouseDown={(e) => executeCommand(e, 'underline')} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-700 transition-colors" title="Underline"><Underline size={15} /></button>
//           <button type="button" onMouseDown={(e) => executeCommand(e, 'strikeThrough')} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-700 transition-colors" title="Strikethrough"><Strikethrough size={15} /></button>
//         </div>
//         <div className="w-px h-5 bg-slate-200 hidden sm:block mx-1"></div>
//         <div className="flex items-center gap-1 relative">
//           <label className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-700 cursor-pointer flex items-center justify-center transition-colors relative" title="Text Color">
//             <Baseline size={15} />
//             <input type="color" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => { document.execCommand('foreColor', false, e.target.value); handleInput(); }} />
//           </label>
//           <label className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-700 cursor-pointer flex items-center justify-center transition-colors relative" title="Highlight Color">
//             <Baseline size={15} className="bg-yellow-200" />
//             <input type="color" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => { document.execCommand('hiliteColor', false, e.target.value); handleInput(); }} />
//           </label>
//         </div>
//         <div className="w-px h-5 bg-slate-200 hidden sm:block mx-1"></div>
//         <div className="flex items-center gap-0.5">
//           <button type="button" onMouseDown={(e) => executeCommand(e, 'justifyLeft')} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-700 transition-colors" title="Align Left"><AlignLeft size={15} /></button>
//           <button type="button" onMouseDown={(e) => executeCommand(e, 'justifyCenter')} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-700 transition-colors" title="Align Center"><AlignCenter size={15} /></button>
//           <button type="button" onMouseDown={(e) => executeCommand(e, 'insertUnorderedList')} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-700 transition-colors" title="Bullet List"><List size={15} /></button>
//           <button type="button" onMouseDown={(e) => executeCommand(e, 'insertOrderedList')} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-700 transition-colors" title="Numbered List"><ListOrdered size={15} /></button>
//         </div>
//         <div className="w-px h-5 bg-slate-200 hidden sm:block mx-1"></div>
//         <button type="button" onMouseDown={(e) => executeCommand(e, 'removeFormat')} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-700 transition-colors" title="Clear Formatting"><Eraser size={15} /></button>
//       </div>
//       <div
//         ref={editorRef}
//         contentEditable={true}
//         suppressContentEditableWarning={true}
//         onInput={handleInput}
//         onBlur={handleInput}
//         className="w-full h-32 p-4 focus:outline-none overflow-y-auto text-[14.5px] text-slate-700 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-2 [&_b]:font-bold [&_i]:italic [&_u]:underline [&_strike]:line-through leading-relaxed"
//         style={{ minHeight: '130px' }}
//         placeholder={placeholder}
//       ></div>
//     </div>
//   );
// };

// // =========================================================================
// // STEP INDICATOR COMPONENT
// // =========================================================================
// const StepIndicator = ({ currentStep }) => {
//   const steps = [
//     { number: 1, label: 'Basic Information' },
//     { number: 2, label: 'Policies & Details' },
//   ];

//   return (
//     <div className="flex items-center gap-0 w-full max-w-xs">
//       {steps.map((step, idx) => (
//         <React.Fragment key={step.number}>
//           <div className="flex flex-col items-center gap-1">
//             <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
//               currentStep > step.number
//                 ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/30'
//                 : currentStep === step.number
//                 ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
//                 : 'bg-slate-100 text-slate-400 border border-slate-200'
//             }`}>
//               {currentStep > step.number ? <CheckCircle size={16} strokeWidth={2.5} /> : step.number}
//             </div>
//             <span className={`text-[11px] font-semibold whitespace-nowrap transition-colors ${
//               currentStep === step.number ? 'text-blue-600' : currentStep > step.number ? 'text-emerald-600' : 'text-slate-400'
//             }`}>{step.label}</span>
//           </div>
//           {idx < steps.length - 1 && (
//             <div className={`flex-1 h-0.5 mx-2 mb-4 rounded-full transition-all duration-300 ${currentStep > 1 ? 'bg-emerald-400' : 'bg-slate-200'}`} />
//           )}
//         </React.Fragment>
//       ))}
//     </div>
//   );
// };

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
//   const [resetKey, setResetKey] = useState(Date.now());

//   // ── 2-step modal state ──────────────────────────────────────────────────
//   const [modalStep, setModalStep] = useState(1);
//   const [step1Errors, setStep1Errors] = useState({});

//   const isSuperAdmin = isSuperAdminRole();

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
//   const fileInputRef = useRef(null);
//   const [imagePreview, setImagePreview] = useState(null);
//   const [isUploading, setIsUploading] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [uploadError, setUploadError] = useState('');

//   // ── Form state ──────────────────────────────────────────────────────────
//   const [formData, setFormData] = useState({
//     country: '', name: '', type: '', imagePath: '',
//     inclusions: '', exclusions: '', paymentPolicies: '', cancellationPolicies: '', bookingTerms: ''
//   });

//   const filteredDestinations = destinations.filter(dest => {
//     const matchesSearch = dest.name.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesCountry = selectedCountry === '' || dest.country === selectedCountry;
//     return matchesSearch && matchesCountry;
//   });

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//     // Clear validation error on change
//     if (step1Errors[name]) setStep1Errors(prev => ({ ...prev, [name]: '' }));
//   };

//   // ── Cloudinary upload ───────────────────────────────────────────────────
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
//       console.error('Cloudinary upload failed:', err);
//       setUploadError(err.message || 'Image upload failed. Please try again.');
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
//     setFormData({ country: '', name: '', type: '', imagePath: '', inclusions: '', exclusions: '', paymentPolicies: '', cancellationPolicies: '', bookingTerms: '' });
//     setImagePreview(null);
//     setIsUploading(false);
//     setUploadProgress(0);
//     setUploadError('');
//     setStep1Errors({});
//     setModalStep(1);
//     setResetKey(Date.now());
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     console.log()
//     if (isLoading || isUploading) return;
//     setIsModalOpen(false);
//   };

//   // ── Step 1 validation → go to Step 2 ───────────────────────────────────
//   const handleNextStep = () => {
//     const errors = {};
//     if (!formData.country) errors.country = 'Country is required.';
//     if (!formData.name.trim()) errors.name = 'Destination name is required.';
//     if (!formData.type) errors.type = 'Destination type is required.';
//     if (isUploading) errors.imagePath = 'Wait for image upload to finish.';
//     if (uploadError) errors.imagePath = uploadError;

//     if (Object.keys(errors).length > 0) {
//       setStep1Errors(errors);
//       return;
//     }
//     setStep1Errors({});
//     setModalStep(2);
//   };

//   const handleBackStep = () => setModalStep(1);

//   // ── Submit (Step 2) ─────────────────────────────────────────────────────
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (isUploading) { setUploadError('Please wait for the image upload to finish.'); return; }
//     if (uploadError) return;

//     setIsLoading(true);
//     try {
//       await destinationService.createDestination(formData);
//      // setIsModalOpen(false);
//       await loadDestinations();
//     } catch (error) {
//       console.error('Error saving destination:', error);
//       alert(error.response?.data?.message || 'Failed to save destination.');
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
//       alert(error.response?.data?.message || 'Failed to delete destination.');
//     }
//   };

//   // ── Step titles ─────────────────────────────────────────────────────────
//   const stepTitle = modalStep === 1 ? 'Basic Information' : 'Policies & Details';
//   const stepSubtitle = modalStep === 1
//     ? 'Enter the core details for this destination.'
//     : 'Add policies, inclusions and exclusions.';

//   return (
//     <div className="min-h-screen bg-[#f8fafc] font-sans p-4 sm:p-6 lg:p-8">

//       {/* Page Header */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
//         <div>
//           <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
//             <div className="p-2.5 bg-blue-600 text-white rounded-2xl shadow-sm shadow-blue-600/20">
//               <Map size={24} strokeWidth={2.5} />
//             </div>
//             Destination Master
//           </h1>
//           <div className="text-sm text-slate-500 mt-2 font-medium flex items-center gap-2">
//             <Link to="/" className="text-blue-600 hover:text-blue-800 transition-colors">Home</Link>
//             <span className="text-slate-300">/</span><span className="text-slate-500">Masters</span><span className="text-slate-300">/</span>
//             <span className="text-slate-700 bg-white border border-slate-200 px-3 py-1 rounded-lg shadow-sm">Destination</span>
//           </div>
//         </div>
//       </div>

//       {/* Main Content Card */}
//       <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
//         <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white">
//           <h2 className="text-lg font-extrabold text-slate-900">Destinations List</h2>
//           <button onClick={openModal} className="flex items-center gap-2 bg-[#007bff] hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm shadow-blue-500/30 hover:shadow-blue-500/50 active:scale-95">
//             <Plus size={18} strokeWidth={2.5} /> Add New Destination
//           </button>
//         </div>

//         <div className="p-5 border-b border-slate-100 flex flex-wrap gap-4 items-center justify-between bg-slate-50/50">
//           <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
//             <div className="relative flex-1 min-w-[280px] max-w-sm group">
//               <input type="text" placeholder="Search destinations..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700 shadow-sm hover:border-blue-300" />
//               <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors"><Search size={16} /></div>
//             </div>
//             <div className="relative min-w-[200px] group">
//               <select value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)} className="w-full pl-10 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 appearance-none cursor-pointer transition-all shadow-sm hover:border-blue-300">
//                 <option value="">All Countries</option><option value="India">India</option><option value="Nepal">Nepal</option><option value="Australia">Australia</option>
//               </select>
//               <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors"><Globe size={16} /></div>
//               <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400"><ChevronDown size={14} /></div>
//             </div>
//           </div>
//           <div className="text-sm font-medium text-slate-500">Showing <span className="text-slate-900 font-bold">{filteredDestinations.length}</span> destinations</div>
//         </div>

//         <div className="overflow-x-auto custom-scrollbar">
//           <table className="w-full min-w-[1000px] border-collapse text-sm whitespace-nowrap">
//             <thead>
//               <tr className="bg-[#242b35] text-white text-[12px] uppercase tracking-wider font-bold border-b border-slate-700">
//                 <th className="px-6 py-4 text-left w-20">ID</th>
//                 <th className="px-6 py-4 text-left w-32">Image</th>
//                 <th className="px-6 py-4 text-left">Destination Name</th>
//                 <th className="px-6 py-4 text-left">Country</th>
//                 <th className="px-6 py-4 text-left">Type</th>
//                 <th className="px-6 py-4 text-center">Scope</th>
//                 <th className="px-6 py-4 text-left">Created At</th>
//                 <th className="px-6 py-4 text-center">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-100 bg-white">
//               {listLoading && (<tr><td colSpan={8} className="px-6 py-12 text-center text-slate-400 font-medium">Loading destinations…</td></tr>)}
//               {!listLoading && fetchError && (<tr><td colSpan={8} className="px-6 py-12 text-center text-rose-500 font-semibold">{fetchError}</td></tr>)}
//               {!listLoading && !fetchError && filteredDestinations.length === 0 && (<tr><td colSpan={8} className="px-6 py-12 text-center text-slate-400 font-medium">No destinations found.</td></tr>)}
//               {!listLoading && !fetchError && filteredDestinations.map((dest) => {
//                 const canModify = isSuperAdmin || !dest.global;
//                 const imageIsUrl = typeof dest.imagePath === 'string' && /^https?:\/\//.test(dest.imagePath);
//                 return (
//                   <tr key={dest.id} className="hover:bg-blue-50/40 transition-colors duration-150 group">
//                     <td className="px-6 py-4 text-slate-500 font-semibold">{dest.id}</td>
//                     <td className="px-6 py-4">
//                       <div className="w-16 h-10 bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden rounded-md shadow-sm">
//                         {imageIsUrl ? <img src={dest.imagePath} alt={dest.name} className="w-full h-full object-cover" /> : <ImageIcon size={18} className="text-slate-400" />}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 font-bold text-slate-900">{dest.name}</td>
//                     <td className="px-6 py-4 text-slate-600 font-medium">{dest.country}</td>
//                     <td className="px-6 py-4"><span className="bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-md text-[11px] font-extrabold uppercase tracking-wide border border-emerald-200">{dest.type || '—'}</span></td>
//                     <td className="px-6 py-4 text-center">
//                       {dest.global
//                         ? <span className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-md text-[11px] font-extrabold uppercase tracking-wide border border-indigo-200"><Globe size={12} strokeWidth={2.5} /> Global</span>
//                         : <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 px-2.5 py-1 rounded-md text-[11px] font-extrabold uppercase tracking-wide border border-amber-200"><MapPin size={12} strokeWidth={2.5} /> Org</span>}
//                     </td>
//                     <td className="px-6 py-4 text-slate-500 font-medium">{formatDate(dest.createdAt)}</td>
//                     <td className="px-6 py-4">
//                       <div className="flex items-center justify-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
//                         <button className="p-2 bg-teal-50 text-teal-600 hover:bg-teal-500 hover:text-white rounded-lg transition-colors shadow-sm" title="View"><Eye size={16} strokeWidth={2.5} /></button>
//                         <button disabled={!canModify} title={canModify ? 'Edit' : 'Global destinations are managed by platform admin'} className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg transition-colors shadow-sm disabled:opacity-30 disabled:cursor-not-allowed"><Edit size={16} strokeWidth={2.5} /></button>
//                         <button onClick={() => canModify && handleDelete(dest)} disabled={!canModify} title={canModify ? 'Delete' : 'Global destinations are managed by platform admin'} className="p-2 bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white rounded-lg transition-colors shadow-sm disabled:opacity-30 disabled:cursor-not-allowed"><Trash2 size={16} strokeWidth={2.5} /></button>
//                       </div>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* ================================================================= */}
//       {/* 2-STEP ADD DESTINATION MODAL                                       */}
//       {/* ================================================================= */}
//       {isModalOpen && (
//         <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 overflow-y-auto custom-scrollbar">
//           {/* Backdrop — only closes on Step 1 */}
//           <div
//             className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
//             onClick={() => modalStep === 1 && closeModal()}
//           />

//           <div className="relative bg-white w-full max-w-6xl shadow-2xl mt-4 sm:mt-8 mb-10 rounded-2xl overflow-hidden border border-slate-200/60 transform transition-all">

//             {/* ── Modal Header ── */}
//             <div className="bg-white px-8 py-5 flex justify-between items-center border-b border-slate-100">
//               <div className="flex items-center gap-4">
//                 <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Map size={22} strokeWidth={2.5} /></div>
//                 <div>
//                   <div className="flex items-center gap-3 mb-0.5">
//                     <h2 className="text-lg font-bold text-slate-900 tracking-tight">{stepTitle}</h2>
//                     <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Step {modalStep} of 2</span>
//                   </div>
//                   <p className="text-slate-500 text-sm font-medium">{stepSubtitle}</p>
//                 </div>
//               </div>

//               <div className="flex items-center gap-6">
//                 {/* Step indicator */}
//                 <div className="hidden sm:block">
//                   <StepIndicator currentStep={modalStep} />
//                 </div>
//                 <button
//                   type="button"
//                   onClick={closeModal}
//                   className="text-slate-400 hover:bg-slate-100 hover:text-slate-600 p-2.5 rounded-full transition-colors active:scale-95"
//                 >
//                   <X size={20} strokeWidth={2.5} />
//                 </button>
//               </div>
//             </div>

//             {/* ── Progress Bar ── */}
//             <div className="h-1 bg-slate-100">
//               <div
//                 className="h-full bg-blue-500 transition-all duration-500 ease-out"
//                 style={{ width: modalStep === 1 ? '50%' : '100%' }}
//               />
//             </div>

//             <form onSubmit={handleSubmit}>

//               {/* ============================================================ */}
//               {/* STEP 1 — Basic Information                                   */}
//               {/* ============================================================ */}
//               {modalStep === 1 && (
//                 <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8 bg-[#fcfdff]">

//                   {/* LEFT — Country, Name, Type */}
//                   <div className="space-y-7">

//                     {/* Country */}
//                     <div className="group">
//                       <label className="block text-sm font-bold text-slate-700 mb-2 group-focus-within:text-blue-600 transition-colors">
//                         Country <span className="text-rose-500">*</span>
//                       </label>
//                       <div className="relative">
//                         <select
//                           name="country"
//                           value={formData.country}
//                           onChange={handleInputChange}
//                           className={`w-full pl-4 pr-10 py-3 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-sm text-slate-700 appearance-none transition-all shadow-sm cursor-pointer ${step1Errors.country ? 'border-rose-400' : 'border-slate-200'}`}
//                         >
//                           <option value="" disabled>Select Country</option>
//                           <option value="India">India</option>
//                           <option value="Nepal">Nepal</option>
//                           <option value="Australia">Australia</option>
//                         </select>
//                         <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400"><ChevronDown size={16} /></div>
//                       </div>
//                       {step1Errors.country && <p className="mt-1.5 text-xs text-rose-600 font-semibold flex items-center gap-1"><AlertTriangle size={12} />{step1Errors.country}</p>}
//                     </div>

//                     {/* Destination Name */}
//                     <div className="group">
//                       <label className="block text-sm font-bold text-slate-700 mb-2 group-focus-within:text-blue-600 transition-colors">
//                         Destination Name <span className="text-rose-500">*</span>
//                       </label>
//                       <input
//                         type="text"
//                         name="name"
//                         value={formData.name}
//                         onChange={handleInputChange}
//                         placeholder="Enter destination name"
//                         className={`w-full px-4 py-3 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-sm text-slate-800 placeholder-slate-400 transition-all shadow-sm ${step1Errors.name ? 'border-rose-400' : 'border-slate-200'}`}
//                       />
//                       {step1Errors.name && <p className="mt-1.5 text-xs text-rose-600 font-semibold flex items-center gap-1"><AlertTriangle size={12} />{step1Errors.name}</p>}
//                     </div>

//                     {/* Destination Type */}
//                     <div className="group">
//                       <label className="block text-sm font-bold text-slate-700 mb-2 group-focus-within:text-blue-600 transition-colors">
//                         Destination Type <span className="text-rose-500">*</span>
//                       </label>
//                       <div className="relative">
//                         <select
//                           name="type"
//                           value={formData.type}
//                           onChange={handleInputChange}
//                           className={`w-full pl-4 pr-10 py-3 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-sm text-slate-700 appearance-none transition-all shadow-sm cursor-pointer ${step1Errors.type ? 'border-rose-400' : 'border-slate-200'}`}
//                         >
//                           <option value="" disabled>Select Type</option>
//                           <option value="Domestic">Domestic</option>
//                           <option value="International">International</option>
//                         </select>
//                         <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400"><ChevronDown size={16} /></div>
//                       </div>
//                       {step1Errors.type && <p className="mt-1.5 text-xs text-rose-600 font-semibold flex items-center gap-1"><AlertTriangle size={12} />{step1Errors.type}</p>}
//                     </div>
//                   </div>

//                   {/* RIGHT — Image Upload */}
//                   <div className="space-y-7">
//                     <div className="group">
//                       <label className="block text-sm font-bold text-slate-700 mb-2 group-focus-within:text-blue-600 transition-colors">
//                         Destination Cover
//                       </label>
//                       <div className={`flex rounded-xl overflow-hidden border bg-slate-50 focus-within:ring-4 transition-all shadow-sm group-hover:bg-slate-100/50 ${uploadError || step1Errors.imagePath ? 'border-rose-300 focus-within:border-rose-500 focus-within:ring-rose-500/10' : 'border-slate-200 focus-within:border-blue-500 focus-within:ring-blue-500/10'}`}>
//                         <div className="px-4 py-2 flex items-center justify-center border-r border-slate-200 bg-white">
//                           {isUploading ? <Loader2 size={20} className="text-blue-500 animate-spin" />
//                             : imagePreview ? <img src={imagePreview} alt="Preview" className="w-8 h-8 rounded object-cover shadow-sm" />
//                             : <ImageIcon size={20} className="text-slate-400" />}
//                         </div>
//                         <input
//                           type="text"
//                           readOnly
//                           value={isUploading ? `Uploading… ${uploadProgress}%` : (formData.imagePath || '')}
//                           placeholder="No file chosen"
//                           className="px-4 py-3 flex-1 bg-transparent text-sm font-medium text-slate-700 focus:outline-none cursor-default truncate"
//                         />
//                         {formData.imagePath && !isUploading && (
//                           <button type="button" onClick={handleRemoveImage} title="Remove image" className="border-l border-slate-200 px-4 py-3 text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-colors flex items-center active:scale-95">
//                             <Trash size={16} strokeWidth={2.5} />
//                           </button>
//                         )}
//                         <label className={`bg-white border-l border-slate-200 px-6 py-3 text-sm font-bold transition-colors flex items-center gap-2 active:scale-95 m-0 ${isUploading ? 'text-slate-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50 hover:text-blue-700 cursor-pointer'}`}>
//                           <input type="file" onChange={handleFileChange} accept="image/*" className="hidden" disabled={isUploading} />
//                           {isUploading ? <Loader2 size={16} className="animate-spin" />
//                             : formData.imagePath ? <CheckCircle2 size={16} className="text-emerald-500" />
//                             : <UploadCloud size={16} strokeWidth={2.5} />}
//                           {isUploading ? 'Uploading' : formData.imagePath ? 'Change' : 'Browse'}
//                         </label>
//                       </div>

//                       {isUploading && (
//                         <div className="mt-2 h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
//                           <div className="h-full bg-blue-500 rounded-full transition-all duration-200" style={{ width: `${uploadProgress}%` }} />
//                         </div>
//                       )}

//                       {!isUploading && formData.imagePath && imagePreview && (
//                         <div className="mt-3">
//                           <img src={imagePreview} alt="Destination cover preview" className="w-full max-w-xs h-32 object-cover rounded-xl border border-slate-200 shadow-sm" />
//                         </div>
//                       )}

//                       {(uploadError || step1Errors.imagePath) && (
//                         <p className="mt-2 text-xs text-rose-600 font-semibold flex items-center gap-1.5">
//                           <AlertTriangle size={14} /> {uploadError || step1Errors.imagePath}
//                         </p>
//                       )}

//                       <div className="mt-3 space-y-2 pl-1">
//                         <p className="text-xs text-slate-500 font-medium">Resolution: 800x600px • Max: 2MB • Format: JPG, PNG</p>
//                         <p className="text-xs text-rose-500 font-semibold flex items-center gap-1.5"><AlertTriangle size={14} />Upload only royalty-free or owned assets.</p>
//                       </div>
//                     </div>

//                     {/* Info card */}
//                     <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
//                       <p className="text-sm font-bold text-blue-800 mb-1">Step 1 of 2 — Core Details</p>
//                       <p className="text-xs text-blue-600 leading-relaxed">Fill in the country, name, type and optionally upload a cover image. Click <strong>Next</strong> to add policies, inclusions and exclusions on the next step.</p>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* ============================================================ */}
//               {/* STEP 2 — Policies & Details                                  */}
//               {/* ============================================================ */}
//               {modalStep === 2 && (
//                 <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8 bg-[#fcfdff]">

//                   {/* LEFT — Cancellation + Booking */}
//                   <div className="space-y-7">
//                     <div className="group">
//                       <label className="block text-sm font-bold text-slate-700 mb-2 group-focus-within:text-blue-600 transition-colors">Cancellation Policies</label>
//                       <RichTextEditor key={`${resetKey}-can`} name="cancellationPolicies" initialValue={formData.cancellationPolicies} onChange={handleInputChange} placeholder="Outline cancellation terms..." />
//                     </div>
//                     <div className="group">
//                       <label className="block text-sm font-bold text-slate-700 mb-2 group-focus-within:text-blue-600 transition-colors">Booking Terms</label>
//                       <RichTextEditor key={`${resetKey}-book`} name="bookingTerms" initialValue={formData.bookingTerms} onChange={handleInputChange} placeholder="Standard booking terms and conditions..." />
//                     </div>
//                     <div className="group">
//                       <label className="block text-sm font-bold text-slate-700 mb-2 group-focus-within:text-blue-600 transition-colors">Payment Policies</label>
//                       <RichTextEditor key={`${resetKey}-pay`} name="paymentPolicies" initialValue={formData.paymentPolicies} onChange={handleInputChange} placeholder="Outline payment terms..." />
//                     </div>
//                   </div>

//                   {/* RIGHT — Inclusions + Exclusions */}
//                   <div className="space-y-7">
//                     <div className="group">
//                       <label className="block text-sm font-bold text-slate-700 mb-2 group-focus-within:text-blue-600 transition-colors">Inclusions</label>
//                       <RichTextEditor key={`${resetKey}-inc`} name="inclusions" initialValue={formData.inclusions} onChange={handleInputChange} placeholder="Detail the inclusions here..." />
//                     </div>
//                     <div className="group">
//                       <label className="block text-sm font-bold text-slate-700 mb-2 group-focus-within:text-blue-600 transition-colors">Exclusions</label>
//                       <RichTextEditor key={`${resetKey}-exc`} name="exclusions" initialValue={formData.exclusions} onChange={handleInputChange} placeholder="Detail the exclusions here..." />
//                     </div>

//                     {/* Summary card */}
//                     <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-2">
//                       <p className="text-sm font-bold text-slate-700 mb-2">Step 1 Summary</p>
//                       <div className="flex items-center gap-2 text-xs text-slate-600"><Globe size={13} className="text-blue-500" /><span className="font-semibold">Country:</span> {formData.country || '—'}</div>
//                       <div className="flex items-center gap-2 text-xs text-slate-600"><MapPin size={13} className="text-blue-500" /><span className="font-semibold">Name:</span> {formData.name || '—'}</div>
//                       <div className="flex items-center gap-2 text-xs text-slate-600"><Map size={13} className="text-blue-500" /><span className="font-semibold">Type:</span> {formData.type || '—'}</div>
//                       <div className="flex items-center gap-2 text-xs text-slate-600">
//                         <ImageIcon size={13} className="text-blue-500" />
//                         <span className="font-semibold">Image:</span>
//                         {formData.imagePath ? <span className="text-emerald-600 font-semibold flex items-center gap-1"><CheckCircle2 size={12} /> Uploaded</span> : <span className="text-slate-400">None</span>}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* ── Modal Footer ── */}
//               <div className="bg-slate-50 px-8 py-5 border-t border-slate-200 flex justify-between items-center rounded-b-2xl">

//                 {/* Left side */}
//                 <div>
//                   {modalStep === 1 ? (
//                     <button
//                       type="button"
//                       disabled={isLoading}
//                       onClick={closeModal}
//                       className="px-6 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all shadow-sm active:scale-95 disabled:opacity-50"
//                     >
//                       Cancel
//                     </button>
//                   ) : (
//                     <button
//                       type="button"
//                       disabled={isLoading}
//                       onClick={handleBackStep}
//                       className="px-6 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all shadow-sm active:scale-95 disabled:opacity-50 flex items-center gap-2"
//                     >
//                       <ArrowLeft size={16} strokeWidth={2.5} /> Back
//                     </button>
//                   )}
//                 </div>

//                 {/* Right side */}
//                 <div>
//                   {modalStep === 1 ? (
//                     <button
//                       type="button"
//                       disabled={isUploading}
//                       onClick={handleNextStep}
//                       className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-blue-500/30 hover:shadow-blue-500/50 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
//                     >
//                       Next <ArrowRight size={16} strokeWidth={2.5} />
//                     </button>
//                   ) : (
//                     <button
//                       type="submit"
//                       disabled={isLoading || isUploading}
//                       title={isUploading ? 'Wait for the image upload to finish' : undefined}
//                       className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-blue-500/30 hover:shadow-blue-500/50 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//                     >
//                       {isLoading
//                         ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving…</>
//                         : <><CheckCircle size={16} strokeWidth={2.5} /> Save Destination</>}
//                     </button>
//                   )}
//                 </div>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DestinationMaster;











import React, { useState, useRef, useEffect } from 'react';
import {
  Search, Plus, Eye, Edit, Trash2, Map, Globe, Image as ImageIcon, X,
  ChevronDown, Bold, Italic, Underline, Strikethrough, AlignLeft, AlignCenter, AlignRight,
  List, ListOrdered, Eraser, Baseline, UploadCloud, CheckCircle2, MapPin, AlertTriangle, Loader2, Trash,
  ArrowRight, ArrowLeft, CheckCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { destinationService, uploadImageToCloudinary } from '../services/DestinationService';
import { geographyService } from "../services/geographyService";

const MAX_IMAGE_BYTES = 2 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];

// =========================================================================
// RICH TEXT EDITOR
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
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50 hover:bg-slate-100/50 focus-within:bg-white shadow-sm focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all duration-300">
      <div className="bg-white border-b border-slate-200 px-3 py-2 flex flex-wrap items-center gap-x-2 gap-y-2 text-slate-600 text-sm select-none">
        <button type="button" onMouseDown={(e) => executeCommand(e, 'formatBlock', 'P')} className="flex items-center gap-1.5 px-2 py-1 hover:bg-slate-100 rounded-lg font-semibold text-slate-700 transition-colors">
          Normal <ChevronDown size={14} className="text-slate-400" />
        </button>
        <div className="w-px h-5 bg-slate-200 hidden sm:block mx-1"></div>
        <div className="flex items-center gap-0.5">
          <button type="button" onMouseDown={(e) => executeCommand(e, 'bold')} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-700 transition-colors" title="Bold"><Bold size={15} strokeWidth={2.5} /></button>
          <button type="button" onMouseDown={(e) => executeCommand(e, 'italic')} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-700 transition-colors" title="Italic"><Italic size={15} /></button>
          <button type="button" onMouseDown={(e) => executeCommand(e, 'underline')} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-700 transition-colors" title="Underline"><Underline size={15} /></button>
          <button type="button" onMouseDown={(e) => executeCommand(e, 'strikeThrough')} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-700 transition-colors" title="Strikethrough"><Strikethrough size={15} /></button>
        </div>
        <div className="w-px h-5 bg-slate-200 hidden sm:block mx-1"></div>
        <div className="flex items-center gap-1 relative">
          <label className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-700 cursor-pointer flex items-center justify-center transition-colors relative" title="Text Color">
            <Baseline size={15} />
            <input type="color" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => { document.execCommand('foreColor', false, e.target.value); handleInput(); }} />
          </label>
          <label className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-700 cursor-pointer flex items-center justify-center transition-colors relative" title="Highlight Color">
            <Baseline size={15} className="bg-yellow-200" />
            <input type="color" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => { document.execCommand('hiliteColor', false, e.target.value); handleInput(); }} />
          </label>
        </div>
        <div className="w-px h-5 bg-slate-200 hidden sm:block mx-1"></div>
        <div className="flex items-center gap-0.5">
          <button type="button" onMouseDown={(e) => executeCommand(e, 'justifyLeft')} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-700 transition-colors" title="Align Left"><AlignLeft size={15} /></button>
          <button type="button" onMouseDown={(e) => executeCommand(e, 'justifyCenter')} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-700 transition-colors" title="Align Center"><AlignCenter size={15} /></button>
          <button type="button" onMouseDown={(e) => executeCommand(e, 'insertUnorderedList')} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-700 transition-colors" title="Bullet List"><List size={15} /></button>
          <button type="button" onMouseDown={(e) => executeCommand(e, 'insertOrderedList')} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-700 transition-colors" title="Numbered List"><ListOrdered size={15} /></button>
        </div>
        <div className="w-px h-5 bg-slate-200 hidden sm:block mx-1"></div>
        <button type="button" onMouseDown={(e) => executeCommand(e, 'removeFormat')} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-700 transition-colors" title="Clear Formatting"><Eraser size={15} /></button>
      </div>
      <div
        ref={editorRef}
        contentEditable={true}
        suppressContentEditableWarning={true}
        onInput={handleInput}
        onBlur={handleInput}
        className="w-full h-32 p-4 focus:outline-none overflow-y-auto text-[14.5px] text-slate-700 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-2 [&_b]:font-bold [&_i]:italic [&_u]:underline [&_strike]:line-through leading-relaxed"
        style={{ minHeight: '130px' }}
        placeholder={placeholder}
      ></div>
    </div>
  );
};

// =========================================================================
// STEP INDICATOR COMPONENT
// =========================================================================
const StepIndicator = ({ currentStep }) => {
  const steps = [
    { number: 1, label: 'Basic Information' },
    { number: 2, label: 'Policies & Details' },
  ];

  return (
    <div className="flex items-center gap-0 w-full max-w-xs">
      {steps.map((step, idx) => (
        <React.Fragment key={step.number}>
          <div className="flex flex-col items-center gap-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
              currentStep > step.number
                ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/30'
                : currentStep === step.number
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                : 'bg-slate-100 text-slate-400 border border-slate-200'
            }`}>
              {currentStep > step.number ? <CheckCircle size={16} strokeWidth={2.5} /> : step.number}
            </div>
            <span className={`text-[11px] font-semibold whitespace-nowrap transition-colors ${
              currentStep === step.number ? 'text-blue-600' : currentStep > step.number ? 'text-emerald-600' : 'text-slate-400'
            }`}>{step.label}</span>
          </div>
          {idx < steps.length - 1 && (
            <div className={`flex-1 h-0.5 mx-2 mb-4 rounded-full transition-all duration-300 ${currentStep > 1 ? 'bg-emerald-400' : 'bg-slate-200'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

// =========================================================================
// ROLE HELPERS
// =========================================================================
const getUserRole = () => (localStorage.getItem('userRole') || '').toUpperCase();
const isSuperAdminRole = () => getUserRole().includes('SUPER');

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
  const [resetKey, setResetKey] = useState(Date.now());

  // ── DYNAMIC COUNTRIES FROM BACKEND ────────────────────────────────────
  const [countries, setCountries] = useState([]);          // { id, name }[]
  const [countriesLoading, setCountriesLoading] = useState(false);

  // ── 2-step modal state ──────────────────────────────────────────────────
  const [modalStep, setModalStep] = useState(1);
  const [step1Errors, setStep1Errors] = useState({});

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
  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');

  // ── Form state ──────────────────────────────────────────────────────────
  const [formData, setFormData] = useState({
    country: '', name: '', type: '', imagePath: '',
    inclusions: '', exclusions: '', paymentPolicies: '', cancellationPolicies: '', bookingTerms: ''
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
    if (step1Errors[name]) setStep1Errors(prev => ({ ...prev, [name]: '' }));
  };

  // ── Cloudinary upload ───────────────────────────────────────────────────
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
      console.error('Cloudinary upload failed:', err);
      setUploadError(err.message || 'Image upload failed. Please try again.');
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
    setFormData({ country: '', name: '', type: '', imagePath: '', inclusions: '', exclusions: '', paymentPolicies: '', cancellationPolicies: '', bookingTerms: '' });
    setImagePreview(null);
    setIsUploading(false);
    setUploadProgress(0);
    setUploadError('');
    setStep1Errors({});
    setModalStep(1);
    setResetKey(Date.now());
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isLoading || isUploading) return;
    setIsModalOpen(false);
  };

  // ── Step 1 validation → go to Step 2 ───────────────────────────────────
  const handleNextStep = () => {
    const errors = {};
    if (!formData.country) errors.country = 'Country is required.';
    if (!formData.name.trim()) errors.name = 'Destination name is required.';
    if (!formData.type) errors.type = 'Destination type is required.';
    if (isUploading) errors.imagePath = 'Wait for image upload to finish.';
    if (uploadError) errors.imagePath = uploadError;

    if (Object.keys(errors).length > 0) {
      setStep1Errors(errors);
      return;
    }
    setStep1Errors({});
    setModalStep(2);
  };

  const handleBackStep = () => setModalStep(1);

  // ── Submit (Step 2) ─────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isUploading) { setUploadError('Please wait for the image upload to finish.'); return; }
    if (uploadError) return;

    setIsLoading(true);
    try {
      await destinationService.createDestination(formData);
      await loadDestinations();
      closeModal();
    } catch (error) {
      console.error('Error saving destination:', error);
      alert(error.response?.data?.message || 'Failed to save destination.');
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
      alert(error.response?.data?.message || 'Failed to delete destination.');
    }
  };

  const stepTitle    = modalStep === 1 ? 'Basic Information' : 'Policies & Details';
  const stepSubtitle = modalStep === 1
    ? 'Enter the core details for this destination.'
    : 'Add policies, inclusions and exclusions.';

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans p-4 sm:p-6 lg:p-8">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <div className="p-2.5 bg-blue-600 text-white rounded-2xl shadow-sm shadow-blue-600/20">
              <Map size={24} strokeWidth={2.5} />
            </div>
            Destination Master
          </h1>
          <div className="text-sm text-slate-500 mt-2 font-medium flex items-center gap-2">
            <Link to="/" className="text-blue-600 hover:text-blue-800 transition-colors">Home</Link>
            <span className="text-slate-300">/</span><span className="text-slate-500">Masters</span><span className="text-slate-300">/</span>
            <span className="text-slate-700 bg-white border border-slate-200 px-3 py-1 rounded-lg shadow-sm">Destination</span>
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white">
          <h2 className="text-lg font-extrabold text-slate-900">Destinations List</h2>
          <button onClick={openModal} className="flex items-center gap-2 bg-[#007bff] hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm shadow-blue-500/30 hover:shadow-blue-500/50 active:scale-95">
            <Plus size={18} strokeWidth={2.5} /> Add New Destination
          </button>
        </div>

        {/* Filter Bar — dynamic country dropdown */}
        <div className="p-5 border-b border-slate-100 flex flex-wrap gap-4 items-center justify-between bg-slate-50/50">
          <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 min-w-[280px] max-w-sm group">
              <input
                type="text"
                placeholder="Search destinations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700 shadow-sm hover:border-blue-300"
              />
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                <Search size={16} />
              </div>
            </div>

            {/* ── DYNAMIC Country Filter ── */}
            <div className="relative min-w-[200px] group">
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full pl-10 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 appearance-none cursor-pointer transition-all shadow-sm hover:border-blue-300"
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
          <div className="text-sm font-medium text-slate-500">
            Showing <span className="text-slate-900 font-bold">{filteredDestinations.length}</span> destinations
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full min-w-[1000px] border-collapse text-sm whitespace-nowrap">
            <thead>
              <tr className="bg-[#242b35] text-white text-[12px] uppercase tracking-wider font-bold border-b border-slate-700">
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
            <tbody className="divide-y divide-slate-100 bg-white">
              {listLoading && (<tr><td colSpan={8} className="px-6 py-12 text-center text-slate-400 font-medium">Loading destinations…</td></tr>)}
              {!listLoading && fetchError && (<tr><td colSpan={8} className="px-6 py-12 text-center text-rose-500 font-semibold">{fetchError}</td></tr>)}
              {!listLoading && !fetchError && filteredDestinations.length === 0 && (<tr><td colSpan={8} className="px-6 py-12 text-center text-slate-400 font-medium">No destinations found.</td></tr>)}
              {!listLoading && !fetchError && filteredDestinations.map((dest) => {
                const canModify = isSuperAdmin || !dest.global;
                const imageIsUrl = typeof dest.imagePath === 'string' && /^https?:\/\//.test(dest.imagePath);
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
                        <button className="p-2 bg-teal-50 text-teal-600 hover:bg-teal-500 hover:text-white rounded-lg transition-colors shadow-sm" title="View"><Eye size={16} strokeWidth={2.5} /></button>
                        <button disabled={!canModify} title={canModify ? 'Edit' : 'Global destinations are managed by platform admin'} className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg transition-colors shadow-sm disabled:opacity-30 disabled:cursor-not-allowed"><Edit size={16} strokeWidth={2.5} /></button>
                        <button onClick={() => canModify && handleDelete(dest)} disabled={!canModify} title={canModify ? 'Delete' : 'Global destinations are managed by platform admin'} className="p-2 bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white rounded-lg transition-colors shadow-sm disabled:opacity-30 disabled:cursor-not-allowed"><Trash2 size={16} strokeWidth={2.5} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 overflow-y-auto custom-scrollbar">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => modalStep === 1 && closeModal()}
          />

          <div className="relative bg-white w-full max-w-6xl shadow-2xl mt-4 sm:mt-8 mb-10 rounded-2xl overflow-hidden border border-slate-200/60 transform transition-all">

            {/* Modal Header */}
            <div className="bg-white px-8 py-5 flex justify-between items-center border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Map size={22} strokeWidth={2.5} /></div>
                <div>
                  <div className="flex items-center gap-3 mb-0.5">
                    <h2 className="text-lg font-bold text-slate-900 tracking-tight">{stepTitle}</h2>
                    <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Step {modalStep} of 2</span>
                  </div>
                  <p className="text-slate-500 text-sm font-medium">{stepSubtitle}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="hidden sm:block"><StepIndicator currentStep={modalStep} /></div>
                <button type="button" onClick={closeModal} className="text-slate-400 hover:bg-slate-100 hover:text-slate-600 p-2.5 rounded-full transition-colors active:scale-95"><X size={20} strokeWidth={2.5} /></button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="h-1 bg-slate-100">
              <div className="h-full bg-blue-500 transition-all duration-500 ease-out" style={{ width: modalStep === 1 ? '50%' : '100%' }} />
            </div>

            <form onSubmit={handleSubmit}>

              {/* STEP 1 */}
              {modalStep === 1 && (
                <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8 bg-[#fcfdff]">

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
                          className={`w-full pl-4 pr-10 py-3 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-sm text-slate-700 appearance-none transition-all shadow-sm cursor-pointer ${step1Errors.country ? 'border-rose-400' : 'border-slate-200'}`}
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
                      {step1Errors.country && <p className="mt-1.5 text-xs text-rose-600 font-semibold flex items-center gap-1"><AlertTriangle size={12} />{step1Errors.country}</p>}
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
                        className={`w-full px-4 py-3 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-sm text-slate-800 placeholder-slate-400 transition-all shadow-sm ${step1Errors.name ? 'border-rose-400' : 'border-slate-200'}`}
                      />
                      {step1Errors.name && <p className="mt-1.5 text-xs text-rose-600 font-semibold flex items-center gap-1"><AlertTriangle size={12} />{step1Errors.name}</p>}
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
                          className={`w-full pl-4 pr-10 py-3 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-sm text-slate-700 appearance-none transition-all shadow-sm cursor-pointer ${step1Errors.type ? 'border-rose-400' : 'border-slate-200'}`}
                        >
                          <option value="" disabled>Select Type</option>
                          <option value="Domestic">Domestic</option>
                          <option value="International">International</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400"><ChevronDown size={16} /></div>
                      </div>
                      {step1Errors.type && <p className="mt-1.5 text-xs text-rose-600 font-semibold flex items-center gap-1"><AlertTriangle size={12} />{step1Errors.type}</p>}
                    </div>
                  </div>

                  {/* RIGHT — Image Upload (unchanged) */}
                  <div className="space-y-7">
                    <div className="group">
                      <label className="block text-sm font-bold text-slate-700 mb-2 group-focus-within:text-blue-600 transition-colors">
                        Destination Cover
                      </label>
                      <div className={`flex rounded-xl overflow-hidden border bg-slate-50 focus-within:ring-4 transition-all shadow-sm group-hover:bg-slate-100/50 ${uploadError || step1Errors.imagePath ? 'border-rose-300 focus-within:border-rose-500 focus-within:ring-rose-500/10' : 'border-slate-200 focus-within:border-blue-500 focus-within:ring-blue-500/10'}`}>
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
                          className="px-4 py-3 flex-1 bg-transparent text-sm font-medium text-slate-700 focus:outline-none cursor-default truncate"
                        />
                        {formData.imagePath && !isUploading && (
                          <button type="button" onClick={handleRemoveImage} title="Remove image" className="border-l border-slate-200 px-4 py-3 text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-colors flex items-center active:scale-95">
                            <Trash size={16} strokeWidth={2.5} />
                          </button>
                        )}
                        <label className={`bg-white border-l border-slate-200 px-6 py-3 text-sm font-bold transition-colors flex items-center gap-2 active:scale-95 m-0 ${isUploading ? 'text-slate-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50 hover:text-blue-700 cursor-pointer'}`}>
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

                      {(uploadError || step1Errors.imagePath) && (
                        <p className="mt-2 text-xs text-rose-600 font-semibold flex items-center gap-1.5">
                          <AlertTriangle size={14} /> {uploadError || step1Errors.imagePath}
                        </p>
                      )}

                      <div className="mt-3 space-y-2 pl-1">
                        <p className="text-xs text-slate-500 font-medium">Resolution: 800x600px • Max: 2MB • Format: JPG, PNG</p>
                        <p className="text-xs text-rose-500 font-semibold flex items-center gap-1.5"><AlertTriangle size={14} />Upload only royalty-free or owned assets.</p>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
                      <p className="text-sm font-bold text-blue-800 mb-1">Step 1 of 2 — Core Details</p>
                      <p className="text-xs text-blue-600 leading-relaxed">Fill in the country, name, type and optionally upload a cover image. Click <strong>Next</strong> to add policies, inclusions and exclusions on the next step.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2 (unchanged) */}
              {modalStep === 2 && (
                <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8 bg-[#fcfdff]">
                  <div className="space-y-7">
                    <div className="group">
                      <label className="block text-sm font-bold text-slate-700 mb-2 group-focus-within:text-blue-600 transition-colors">Cancellation Policies</label>
                      <RichTextEditor key={`${resetKey}-can`} name="cancellationPolicies" initialValue={formData.cancellationPolicies} onChange={handleInputChange} placeholder="Outline cancellation terms..." />
                    </div>
                    <div className="group">
                      <label className="block text-sm font-bold text-slate-700 mb-2 group-focus-within:text-blue-600 transition-colors">Booking Terms</label>
                      <RichTextEditor key={`${resetKey}-book`} name="bookingTerms" initialValue={formData.bookingTerms} onChange={handleInputChange} placeholder="Standard booking terms and conditions..." />
                    </div>
                    <div className="group">
                      <label className="block text-sm font-bold text-slate-700 mb-2 group-focus-within:text-blue-600 transition-colors">Payment Policies</label>
                      <RichTextEditor key={`${resetKey}-pay`} name="paymentPolicies" initialValue={formData.paymentPolicies} onChange={handleInputChange} placeholder="Outline payment terms..." />
                    </div>
                  </div>
                  <div className="space-y-7">
                    <div className="group">
                      <label className="block text-sm font-bold text-slate-700 mb-2 group-focus-within:text-blue-600 transition-colors">Inclusions</label>
                      <RichTextEditor key={`${resetKey}-inc`} name="inclusions" initialValue={formData.inclusions} onChange={handleInputChange} placeholder="Detail the inclusions here..." />
                    </div>
                    <div className="group">
                      <label className="block text-sm font-bold text-slate-700 mb-2 group-focus-within:text-blue-600 transition-colors">Exclusions</label>
                      <RichTextEditor key={`${resetKey}-exc`} name="exclusions" initialValue={formData.exclusions} onChange={handleInputChange} placeholder="Detail the exclusions here..." />
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-2">
                      <p className="text-sm font-bold text-slate-700 mb-2">Step 1 Summary</p>
                      <div className="flex items-center gap-2 text-xs text-slate-600"><Globe size={13} className="text-blue-500" /><span className="font-semibold">Country:</span> {formData.country || '—'}</div>
                      <div className="flex items-center gap-2 text-xs text-slate-600"><MapPin size={13} className="text-blue-500" /><span className="font-semibold">Name:</span> {formData.name || '—'}</div>
                      <div className="flex items-center gap-2 text-xs text-slate-600"><Map size={13} className="text-blue-500" /><span className="font-semibold">Type:</span> {formData.type || '—'}</div>
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <ImageIcon size={13} className="text-blue-500" />
                        <span className="font-semibold">Image:</span>
                        {formData.imagePath ? <span className="text-emerald-600 font-semibold flex items-center gap-1"><CheckCircle2 size={12} /> Uploaded</span> : <span className="text-slate-400">None</span>}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Footer */}
              <div className="bg-slate-50 px-8 py-5 border-t border-slate-200 flex justify-between items-center rounded-b-2xl">
                <div>
                  {modalStep === 1 ? (
                    <button type="button" disabled={isLoading} onClick={closeModal} className="px-6 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all shadow-sm active:scale-95 disabled:opacity-50">
                      Cancel
                    </button>
                  ) : (
                    <button type="button" disabled={isLoading} onClick={handleBackStep} className="px-6 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all shadow-sm active:scale-95 disabled:opacity-50 flex items-center gap-2">
                      <ArrowLeft size={16} strokeWidth={2.5} /> Back
                    </button>
                  )}
                </div>
                <div>
                  {modalStep === 1 ? (
                    <button type="button" disabled={isUploading} onClick={handleNextStep} className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-blue-500/30 hover:shadow-blue-500/50 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                      Next <ArrowRight size={16} strokeWidth={2.5} />
                    </button>
                  ) : (
                    <button type="submit" disabled={isLoading || isUploading} className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-blue-500/30 hover:shadow-blue-500/50 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                      {isLoading
                        ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving…</>
                        : <><CheckCircle size={16} strokeWidth={2.5} /> Save Destination</>}
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DestinationMaster;