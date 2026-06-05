// import React, { useState, useRef, useEffect } from 'react';
// import { 
//   Search, Plus, Eye, Edit, Trash2, Map, Globe, Image as ImageIcon, X, 
//   ChevronDown, Bold, Italic, Underline, Strikethrough, AlignLeft, AlignCenter, AlignRight,
//   List, ListOrdered, Quote, Code, Link as LinkIcon, Type, AlertTriangle, MapPin, Calendar, Eraser, Baseline, UploadCloud, CheckCircle2
// } from 'lucide-react';
// import { Link } from 'react-router-dom';

// // =========================================================================
// // 🌟 PREMIUM RICH TEXT EDITOR 
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
      
//       {/* Editor Toolbar */}
//       <div className="bg-white border-b border-slate-200 px-3 py-2 flex flex-wrap items-center gap-x-2 gap-y-2 text-slate-600 text-sm select-none">
        
//         <button type="button" onMouseDown={(e) => executeCommand(e, 'formatBlock', 'P')} className="flex items-center gap-1.5 px-2 py-1 hover:bg-slate-100 rounded-lg font-semibold text-slate-700 transition-colors">
//           Normal <ChevronDown size={14} className="text-slate-400"/>
//         </button>
        
//         <div className="w-px h-5 bg-slate-200 hidden sm:block mx-1"></div>
        
//         {/* Formatting Tools */}
//         <div className="flex items-center gap-0.5">
//           <button type="button" onMouseDown={(e) => executeCommand(e, 'bold')} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-700 transition-colors" title="Bold"><Bold size={15} strokeWidth={2.5} /></button>
//           <button type="button" onMouseDown={(e) => executeCommand(e, 'italic')} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-700 transition-colors" title="Italic"><Italic size={15} /></button>
//           <button type="button" onMouseDown={(e) => executeCommand(e, 'underline')} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-700 transition-colors" title="Underline"><Underline size={15} /></button>
//           <button type="button" onMouseDown={(e) => executeCommand(e, 'strikeThrough')} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-700 transition-colors" title="Strikethrough"><Strikethrough size={15} /></button>
//         </div>
        
//         <div className="w-px h-5 bg-slate-200 hidden sm:block mx-1"></div>
        
//         {/* Colors */}
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
        
//         {/* Alignment & Lists */}
//         <div className="flex items-center gap-0.5">
//           <button type="button" onMouseDown={(e) => executeCommand(e, 'justifyLeft')} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-700 transition-colors" title="Align Left"><AlignLeft size={15} /></button>
//           <button type="button" onMouseDown={(e) => executeCommand(e, 'justifyCenter')} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-700 transition-colors" title="Align Center"><AlignCenter size={15} /></button>
//           <button type="button" onMouseDown={(e) => executeCommand(e, 'insertUnorderedList')} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-700 transition-colors" title="Bullet List"><List size={15} /></button>
//           <button type="button" onMouseDown={(e) => executeCommand(e, 'insertOrderedList')} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-700 transition-colors" title="Numbered List"><ListOrdered size={15} /></button>
//         </div>

//         <div className="w-px h-5 bg-slate-200 hidden sm:block mx-1"></div>

//         {/* Clear Formatting */}
//         <button type="button" onMouseDown={(e) => executeCommand(e, 'removeFormat')} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-700 transition-colors" title="Clear Formatting"><Eraser size={15} /></button>
//       </div>

//       {/* Editor Content Area */}
//       <div 
//         ref={editorRef}
//         contentEditable={true}
//         suppressContentEditableWarning={true}
//         onInput={handleInput}
//         onBlur={handleInput}
//         className="w-full h-32 p-4 focus:outline-none overflow-y-auto text-[14.5px] text-slate-700 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-2 [&_b]:font-bold [&_i]:italic [&_u]:underline [&_strike]:line-through leading-relaxed"
//         style={{ 
//           minHeight: '130px',
//           ':empty:before': { content: 'attr(placeholder)', color: '#94a3b8', pointerEvents: 'none', display: 'block' }
//         }}
//         placeholder={placeholder}
//       ></div>
//     </div>
//   );
// };
// // =========================================================================


// const DestinationMaster = () => {
//   const [destinations, setDestinations] = useState([
//     { id: '487', name: 'Andaman Island', country: 'India', type: 'Domestic', cities: 5, createdAt: 'May 29, 2026', image: null },
//     { id: '502', name: 'Andhra Pradesh', country: 'India', type: 'Domestic', cities: 24, createdAt: 'May 29, 2026', image: null },
//     { id: '670', name: 'Anapurna Base Camp', country: 'Nepal', type: 'Domestic', cities: 1, createdAt: 'Jun 03, 2026', image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=100&h=60' },
//     { id: '503', name: 'Arunachal Pradesh', country: 'India', type: 'Domestic', cities: 12, createdAt: 'May 29, 2026', image: null },
//   ]);

//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedCountry, setSelectedCountry] = useState('');
//   const [isModalOpen, setIsModalOpen] = useState(false);
  
//   const [resetKey, setResetKey] = useState(Date.now());

//   // Image upload state
//   const fileInputRef = useRef(null);
//   const [imagePreview, setImagePreview] = useState(null);

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
//   };

//   // NAYA: File Picker Handler
//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setFormData(prev => ({ ...prev, imagePath: file.name }));
//       setImagePreview(URL.createObjectURL(file)); // Creating preview URL
//     }
//   };

//   const openModal = () => {
//     setFormData({
//       country: '', name: '', type: '', imagePath: '',
//       inclusions: '', exclusions: '', paymentPolicies: '', cancellationPolicies: '', bookingTerms: ''
//     });
//     setImagePreview(null);
//     if(fileInputRef.current) fileInputRef.current.value = "";
//     setResetKey(Date.now()); 
//     setIsModalOpen(true);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log("Submitting Destination Data:", formData);
    
//     const newDest = {
//       id: Math.floor(1000 + Math.random() * 9000).toString(),
//       name: formData.name,
//       country: formData.country,
//       type: formData.type || 'Domestic',
//       cities: 0,
//       createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
//       image: imagePreview // Saving preview to show in table instantly
//     };

//     setDestinations([newDest, ...destinations]);
//     setIsModalOpen(false);
//   };

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
//                 <th className="px-6 py-4 text-center">Cities</th>
//                 <th className="px-6 py-4 text-left">Created At</th>
//                 <th className="px-6 py-4 text-center">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-100 bg-white">
//               {filteredDestinations.map((dest) => (
//                 <tr key={dest.id} className="hover:bg-blue-50/40 transition-colors duration-150 group">
//                   <td className="px-6 py-4 text-slate-500 font-semibold">{dest.id}</td>
//                   <td className="px-6 py-4">
//                     <div className="w-16 h-10 bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden rounded-md shadow-sm">
//                       {dest.image ? <img src={dest.image} alt={dest.name} className="w-full h-full object-cover" /> : <ImageIcon size={18} className="text-slate-400" />}
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 font-bold text-slate-900">{dest.name}</td>
//                   <td className="px-6 py-4 text-slate-600 font-medium">{dest.country}</td>
//                   <td className="px-6 py-4"><span className="bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-md text-[11px] font-extrabold uppercase tracking-wide border border-emerald-200">{dest.type}</span></td>
//                   <td className="px-6 py-4 text-center">
//                     <div className="flex flex-col items-center justify-center">
//                       <span className="w-6 h-6 bg-[#17a2b8] text-white flex items-center justify-center rounded-md text-xs font-bold shadow-sm">{dest.cities}</span>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 text-slate-500 font-medium">{dest.createdAt}</td>
//                   <td className="px-6 py-4">
//                     <div className="flex items-center justify-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
//                       <button className="p-2 bg-teal-50 text-teal-600 hover:bg-teal-500 hover:text-white rounded-lg transition-colors shadow-sm" title="View"><Eye size={16} strokeWidth={2.5} /></button>
//                       <button className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg transition-colors shadow-sm" title="Edit"><Edit size={16} strokeWidth={2.5} /></button>
//                       <button className="p-2 bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white rounded-lg transition-colors shadow-sm" title="Delete"><Trash2 size={16} strokeWidth={2.5} /></button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* ========================================================================= */}
//       {/* ADD NEW DESTINATION MODAL                                                 */}
//       {/* ========================================================================= */}
//       {isModalOpen && (
//         <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 overflow-y-auto custom-scrollbar">
          
//           <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)}></div>
          
//           <div className="relative bg-white w-full max-w-6xl shadow-2xl mt-4 sm:mt-8 mb-10 rounded-2xl overflow-hidden border border-slate-200/60 transform transition-all animate-in fade-in zoom-in-95 duration-200">
            
//             <div className="bg-white px-8 py-6 flex justify-between items-center border-b border-slate-100">
//               <div className="flex items-center gap-4">
//                 <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
//                   <Map size={24} strokeWidth={2.5} />
//                 </div>
//                 <div>
//                   <h2 className="text-xl font-bold text-slate-900 tracking-tight">Destination Information</h2>
//                   <p className="text-slate-500 text-sm font-medium mt-0.5">Fill in the details to catalog a new destination.</p>
//                 </div>
//               </div>
//               <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:bg-slate-100 hover:text-slate-600 p-2.5 rounded-full transition-colors active:scale-95">
//                 <X size={20} strokeWidth={2.5} />
//               </button>
//             </div>

//             <form onSubmit={handleSubmit}>
//               <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8 bg-[#fcfdff]">
                
//                 {/* =============================================================== */}
//                 {/* LEFT COLUMN: Basic Info, Image, Cities, Cancel & Booking Terms  */}
//                 {/* =============================================================== */}
//                 <div className="space-y-7">
                  
//                   {/* Country */}
//                   <div className="group">
//                     <label className="block text-sm font-bold text-slate-700 mb-2 group-focus-within:text-blue-600 transition-colors">Country <span className="text-rose-500">*</span></label>
//                     <div className="relative">
//                       <select name="country" value={formData.country} onChange={handleInputChange} required className="w-full pl-4 pr-10 py-3 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-sm text-slate-700 appearance-none transition-all shadow-sm cursor-pointer">
//                         <option value="" disabled>Select Country</option>
//                         <option value="India">India</option>
//                         <option value="Nepal">Nepal</option>
//                         <option value="Australia">Australia</option>
//                       </select>
//                       <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors"><ChevronDown size={16} /></div>
//                     </div>
//                   </div>

//                   {/* Destination Name */}
//                   <div className="group">
//                     <label className="block text-sm font-bold text-slate-700 mb-2 group-focus-within:text-blue-600 transition-colors">Destination Name <span className="text-rose-500">*</span></label>
//                     <input type="text" name="name" value={formData.name} onChange={handleInputChange} required placeholder="Enter destination name" className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-sm text-slate-800 placeholder-slate-400 transition-all shadow-sm" />
//                   </div>

//                   {/* Destination Type */}
//                   <div className="group">
//                     <label className="block text-sm font-bold text-slate-700 mb-2 group-focus-within:text-blue-600 transition-colors">Destination Type <span className="text-rose-500">*</span></label>
//                     <div className="relative">
//                       <select name="type" value={formData.type} onChange={handleInputChange} required className="w-full pl-4 pr-10 py-3 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-sm text-slate-700 appearance-none transition-all shadow-sm cursor-pointer">
//                         <option value="" disabled>Select Type</option>
//                         <option value="Domestic">Domestic</option>
//                         <option value="International">International</option>
//                       </select>
//                       <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors"><ChevronDown size={16} /></div>
//                     </div>
//                   </div>

//                   {/* 🌟 NAYA: Functional Image Upload Zone */}
//                   <div className="group">
//                     <label className="block text-sm font-bold text-slate-700 mb-2 group-focus-within:text-blue-600 transition-colors">Destination Cover</label>
//                     <div className="flex rounded-xl overflow-hidden border border-slate-200 bg-slate-50 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all shadow-sm group-hover:bg-slate-100/50 relative">
                      
//                       {/* Hidden File Input */}
//                       <input 
//                         type="file" 
//                         ref={fileInputRef} 
//                         onChange={handleFileChange} 
//                         accept="image/*" 
//                         className="hidden" 
//                       />

//                       {/* Icon or Thumbnail Preview */}
//                       <div className="px-4 py-2 flex items-center justify-center border-r border-slate-200 bg-white">
//                         {imagePreview ? (
//                           <img src={imagePreview} alt="Preview" className="w-8 h-8 rounded object-cover shadow-sm" />
//                         ) : (
//                           <ImageIcon size={20} className="text-slate-400" />
//                         )}
//                       </div>
                      
//                       {/* File Name Display */}
//                       <input 
//                         type="text" 
//                         readOnly 
//                         value={formData.imagePath} 
//                         placeholder="No file chosen" 
//                         className="px-4 py-3 flex-1 bg-transparent text-sm font-medium text-slate-700 focus:outline-none cursor-default truncate" 
//                       />
                      
//                       {/* Custom Browse Button */}
//                       <button 
//                         type="button" 
//                         onClick={() => fileInputRef.current.click()} 
//                         className="bg-white border-l border-slate-200 px-6 py-3 text-sm text-blue-600 hover:bg-blue-50 hover:text-blue-700 font-bold transition-colors flex items-center gap-2 active:scale-95"
//                       >
//                         {imagePreview ? <CheckCircle2 size={16} className="text-emerald-500"/> : <UploadCloud size={16} strokeWidth={2.5}/>} 
//                         {imagePreview ? "Change" : "Browse"}
//                       </button>
//                     </div>
//                     <div className="mt-3 space-y-2 pl-1">
//                       <p className="text-xs text-slate-500 font-medium">Resolution: 800x600px • Max: 2MB • Format: JPG, PNG</p>
//                       <p className="text-xs text-rose-500 font-semibold flex items-center gap-1.5"><AlertTriangle size={14} />Upload only royalty-free or owned assets.</p>
//                     </div>
//                   </div>

//                   {/* Add Cities */}
//                   <div className="group">
//                     <label className="block text-sm font-bold text-slate-700 mb-2 group-focus-within:text-blue-600 transition-colors">Linked Cities <span className="text-rose-500">*</span></label>
//                     <div className="relative shadow-sm rounded-xl overflow-hidden border border-slate-200 bg-slate-50 hover:bg-slate-100/50 focus-within:bg-white focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
//                       <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors"><MapPin size={16} /></div>
//                       <input type="text" placeholder="Search to link a city..." className="w-full pl-11 pr-10 py-3 bg-transparent focus:outline-none text-sm text-slate-800 placeholder-slate-400" />
//                     </div>
                    
//                     <div className="mt-4 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 h-32 flex flex-col items-center justify-center text-center p-4 transition-colors hover:border-blue-300 hover:bg-blue-50/30 cursor-pointer">
//                       <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center mb-2 border border-slate-100">
//                          <Plus size={18} className="text-slate-400" />
//                       </div>
//                       <p className="text-sm text-slate-500 font-medium">Search above to link cities to this destination.</p>
//                     </div>
//                   </div>

//                   {/* 👉 MOVED TO LEFT: Cancellation Policies */}
//                   <div className="group">
//                     <label className="block text-sm font-bold text-slate-700 mb-2 group-focus-within:text-blue-600 transition-colors">Cancellation Policies</label>
//                     <RichTextEditor key={`${resetKey}-can`} name="cancellationPolicies" initialValue={formData.cancellationPolicies} onChange={handleInputChange} placeholder="Outline cancellation terms..." />
//                   </div>

//                   {/* 👉 MOVED TO LEFT: Booking Terms */}
//                   <div className="group">
//                     <label className="block text-sm font-bold text-slate-700 mb-2 group-focus-within:text-blue-600 transition-colors">Booking Terms</label>
//                     <RichTextEditor key={`${resetKey}-book`} name="bookingTerms" initialValue={formData.bookingTerms} onChange={handleInputChange} placeholder="Standard booking terms and conditions..." />
//                   </div>

//                 </div>

//                 {/* =============================================================== */}
//                 {/* RIGHT COLUMN: Inclusions, Exclusions, Payment Policies          */}
//                 {/* =============================================================== */}
//                 <div className="space-y-7">
                  
//                   <div className="group">
//                     <label className="block text-sm font-bold text-slate-700 mb-2 group-focus-within:text-blue-600 transition-colors">Inclusions</label>
//                     <RichTextEditor key={`${resetKey}-inc`} name="inclusions" initialValue={formData.inclusions} onChange={handleInputChange} placeholder="Detail the inclusions here..." />
//                   </div>
                  
//                   <div className="group">
//                     <label className="block text-sm font-bold text-slate-700 mb-2 group-focus-within:text-blue-600 transition-colors">Exclusions</label>
//                     <RichTextEditor key={`${resetKey}-exc`} name="exclusions" initialValue={formData.exclusions} onChange={handleInputChange} placeholder="Detail the exclusions here..." />
//                   </div>
                  
//                   <div className="group">
//                     <label className="block text-sm font-bold text-slate-700 mb-2 group-focus-within:text-blue-600 transition-colors">Payment Policies</label>
//                     <RichTextEditor key={`${resetKey}-pay`} name="paymentPolicies" initialValue={formData.paymentPolicies} onChange={handleInputChange} placeholder="Outline payment terms..." />
//                   </div>

//                 </div>

//               </div>

//               {/* Modal Footer */}
//               <div className="bg-slate-50 px-8 py-5 border-t border-slate-200 flex justify-end gap-3 rounded-b-2xl">
//                 <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all shadow-sm active:scale-95">
//                   Cancel
//                 </button>
//                 <button type="submit" className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-blue-500/30 hover:shadow-blue-500/50 active:scale-95">
//                   Save Destination
//                 </button>
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
  List, ListOrdered, Eraser, Baseline, UploadCloud, CheckCircle2, MapPin, AlertTriangle
} from 'lucide-react';
import { Link } from 'react-router-dom';

// 👉 Backend API service import (Ensure path is correct)
import { destinationService } from '../services/DestinationService';

// =========================================================================
// 🌟 PREMIUM RICH TEXT EDITOR 
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
      
      {/* Editor Toolbar */}
      <div className="bg-white border-b border-slate-200 px-3 py-2 flex flex-wrap items-center gap-x-2 gap-y-2 text-slate-600 text-sm select-none">
        <button type="button" onMouseDown={(e) => executeCommand(e, 'formatBlock', 'P')} className="flex items-center gap-1.5 px-2 py-1 hover:bg-slate-100 rounded-lg font-semibold text-slate-700 transition-colors">
          Normal <ChevronDown size={14} className="text-slate-400"/>
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

      {/* Editor Content Area */}
      <div 
        ref={editorRef}
        contentEditable={true}
        suppressContentEditableWarning={true}
        onInput={handleInput}
        onBlur={handleInput}
        className="w-full h-32 p-4 focus:outline-none overflow-y-auto text-[14.5px] text-slate-700 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-2 [&_b]:font-bold [&_i]:italic [&_u]:underline [&_strike]:line-through leading-relaxed"
        style={{ minHeight: '130px', ':empty:before': { content: 'attr(placeholder)', color: '#94a3b8', pointerEvents: 'none', display: 'block' } }}
        placeholder={placeholder}
      ></div>
    </div>
  );
};
// =========================================================================

const DestinationMaster = () => {
  const [destinations, setDestinations] = useState([
    { id: '487', name: 'Andaman Island', country: 'India', type: 'Domestic', cities: 5, createdAt: 'May 29, 2026', image: null },
    { id: '502', name: 'Andhra Pradesh', country: 'India', type: 'Domestic', cities: 24, createdAt: 'May 29, 2026', image: null },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resetKey, setResetKey] = useState(Date.now());

  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    country: '', name: '', type: '', imagePath: '', 
    inclusions: '', exclusions: '', paymentPolicies: '', cancellationPolicies: '', bookingTerms: ''
  });

  // 👉 NAYA: Yeh useEffect har bar chalega jab aap form me kuch type karenge aur console par Live data dikhayega
  useEffect(() => {
    if (isModalOpen) {
      console.log("🟢 Live Form Data Update:", formData);
    }
  }, [formData, isModalOpen]);

  const filteredDestinations = destinations.filter(dest => {
    const matchesSearch = dest.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCountry = selectedCountry === '' || dest.country === selectedCountry;
    return matchesSearch && matchesCountry;
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, imagePath: file.name }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const openModal = () => {
    setFormData({
      country: '', name: '', type: '', imagePath: '',
      inclusions: '', exclusions: '', paymentPolicies: '', cancellationPolicies: '', bookingTerms: ''
    });
    setImagePreview(null);
    setResetKey(Date.now()); 
    setIsModalOpen(true);
  };

  // 👉 BACKEND INTEGRATION IN SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // 👉 NAYA: Submit button click hote hi final data console me dikhega!
    console.log("🚀 FINAL SUBMISSION DATA GOING TO BACKEND:", formData);

    try {
      // ✅ API call to save data mapping to DestinationService
      // const response = await destinationService.createDestination(formData);
      // alert("Destination Saved Successfully!");
      
      const newDest = {
        id: Math.floor(1000 + Math.random() * 9000).toString(),
        name: formData.name,
        country: formData.country,
        type: formData.type || 'Domestic',
        cities: 0,
        createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        image: imagePreview 
      };
      setDestinations([newDest, ...destinations]);

      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving destination:", error);
      alert("Failed to save destination.");
    } finally {
      setIsLoading(false);
    }
  };

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

        <div className="p-5 border-b border-slate-100 flex flex-wrap gap-4 items-center justify-between bg-slate-50/50">
          <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 min-w-[280px] max-w-sm group">
              <input type="text" placeholder="Search destinations..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700 shadow-sm hover:border-blue-300" />
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors"><Search size={16} /></div>
            </div>
            
            <div className="relative min-w-[200px] group">
              <select value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)} className="w-full pl-10 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 appearance-none cursor-pointer transition-all shadow-sm hover:border-blue-300">
                <option value="">All Countries</option><option value="India">India</option><option value="Nepal">Nepal</option><option value="Australia">Australia</option>
              </select>
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors"><Globe size={16} /></div>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400"><ChevronDown size={14} /></div>
            </div>
          </div>
          <div className="text-sm font-medium text-slate-500">Showing <span className="text-slate-900 font-bold">{filteredDestinations.length}</span> destinations</div>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full min-w-[1000px] border-collapse text-sm whitespace-nowrap">
            <thead>
              <tr className="bg-[#242b35] text-white text-[12px] uppercase tracking-wider font-bold border-b border-slate-700">
                <th className="px-6 py-4 text-left w-20">ID</th>
                <th className="px-6 py-4 text-left w-32">Image</th>
                <th className="px-6 py-4 text-left">Destination Name</th>
                <th className="px-6 py-4 text-left">Country</th>
                <th className="px-6 py-4 text-left">Type</th>
                <th className="px-6 py-4 text-center">Cities</th>
                <th className="px-6 py-4 text-left">Created At</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredDestinations.map((dest) => (
                <tr key={dest.id} className="hover:bg-blue-50/40 transition-colors duration-150 group">
                  <td className="px-6 py-4 text-slate-500 font-semibold">{dest.id}</td>
                  <td className="px-6 py-4">
                    <div className="w-16 h-10 bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden rounded-md shadow-sm">
                      {dest.image ? <img src={dest.image} alt={dest.name} className="w-full h-full object-cover" /> : <ImageIcon size={18} className="text-slate-400" />}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900">{dest.name}</td>
                  <td className="px-6 py-4 text-slate-600 font-medium">{dest.country}</td>
                  <td className="px-6 py-4"><span className="bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-md text-[11px] font-extrabold uppercase tracking-wide border border-emerald-200">{dest.type}</span></td>
                  <td className="px-6 py-4 text-center"><span className="w-6 h-6 bg-[#17a2b8] text-white inline-flex items-center justify-center rounded-md text-xs font-bold shadow-sm">{dest.cities}</span></td>
                  <td className="px-6 py-4 text-slate-500 font-medium">{dest.createdAt}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 bg-teal-50 text-teal-600 hover:bg-teal-500 hover:text-white rounded-lg transition-colors shadow-sm" title="View"><Eye size={16} strokeWidth={2.5} /></button>
                      <button className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg transition-colors shadow-sm" title="Edit"><Edit size={16} strokeWidth={2.5} /></button>
                      <button className="p-2 bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white rounded-lg transition-colors shadow-sm" title="Delete"><Trash2 size={16} strokeWidth={2.5} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ADD NEW DESTINATION MODAL                                                 */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 overflow-y-auto custom-scrollbar">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => !isLoading && setIsModalOpen(false)}></div>
          
          <div className="relative bg-white w-full max-w-6xl shadow-2xl mt-4 sm:mt-8 mb-10 rounded-2xl overflow-hidden border border-slate-200/60 transform transition-all">
            
            <div className="bg-white px-8 py-6 flex justify-between items-center border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Map size={24} strokeWidth={2.5} /></div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">Destination Information</h2>
                  <p className="text-slate-500 text-sm font-medium mt-0.5">Fill in the details to catalog a new destination.</p>
                </div>
              </div>
              <button type="button" onClick={() => !isLoading && setIsModalOpen(false)} className="text-slate-400 hover:bg-slate-100 hover:text-slate-600 p-2.5 rounded-full transition-colors active:scale-95">
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8 bg-[#fcfdff]">
                
                {/* LEFT COLUMN */}
                <div className="space-y-7">
                  <div className="group">
                    <label className="block text-sm font-bold text-slate-700 mb-2 group-focus-within:text-blue-600 transition-colors">Country <span className="text-rose-500">*</span></label>
                    <div className="relative">
                      <select name="country" value={formData.country} onChange={handleInputChange} required className="w-full pl-4 pr-10 py-3 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-sm text-slate-700 appearance-none transition-all shadow-sm cursor-pointer">
                        <option value="" disabled>Select Country</option><option value="India">India</option><option value="Nepal">Nepal</option><option value="Australia">Australia</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors"><ChevronDown size={16} /></div>
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-bold text-slate-700 mb-2 group-focus-within:text-blue-600 transition-colors">Destination Name <span className="text-rose-500">*</span></label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} required placeholder="Enter destination name" className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-sm text-slate-800 placeholder-slate-400 transition-all shadow-sm" />
                  </div>

                  <div className="group">
                    <label className="block text-sm font-bold text-slate-700 mb-2 group-focus-within:text-blue-600 transition-colors">Destination Type <span className="text-rose-500">*</span></label>
                    <div className="relative">
                      <select name="type" value={formData.type} onChange={handleInputChange} required className="w-full pl-4 pr-10 py-3 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-sm text-slate-700 appearance-none transition-all shadow-sm cursor-pointer">
                        <option value="" disabled>Select Type</option><option value="Domestic">Domestic</option><option value="International">International</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors"><ChevronDown size={16} /></div>
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-bold text-slate-700 mb-2 group-focus-within:text-blue-600 transition-colors">Destination Cover</label>
                    <div className="flex rounded-xl overflow-hidden border border-slate-200 bg-slate-50 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all shadow-sm group-hover:bg-slate-100/50 relative">
                      <div className="px-4 py-2 flex items-center justify-center border-r border-slate-200 bg-white">
                        {imagePreview ? <img src={imagePreview} alt="Preview" className="w-8 h-8 rounded object-cover shadow-sm" /> : <ImageIcon size={20} className="text-slate-400" />}
                      </div>
                      
                      <input type="text" readOnly value={formData.imagePath} placeholder="No file chosen" className="px-4 py-3 flex-1 bg-transparent text-sm font-medium text-slate-700 focus:outline-none cursor-default truncate" />
                      
                      <label className="bg-white border-l border-slate-200 px-6 py-3 text-sm text-blue-600 hover:bg-blue-50 hover:text-blue-700 font-bold transition-colors flex items-center gap-2 active:scale-95 cursor-pointer m-0">
                        <input type="file" onChange={handleFileChange} accept="image/*" className="hidden" />
                        {imagePreview ? <CheckCircle2 size={16} className="text-emerald-500"/> : <UploadCloud size={16} strokeWidth={2.5}/>} 
                        {imagePreview ? "Change" : "Browse"}
                      </label>
                    </div>
                    <div className="mt-3 space-y-2 pl-1">
                      <p className="text-xs text-slate-500 font-medium">Resolution: 800x600px • Max: 2MB • Format: JPG, PNG</p>
                      <p className="text-xs text-rose-500 font-semibold flex items-center gap-1.5"><AlertTriangle size={14} />Upload only royalty-free or owned assets.</p>
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-bold text-slate-700 mb-2 group-focus-within:text-blue-600 transition-colors">Cancellation Policies</label>
                    <RichTextEditor key={`${resetKey}-can`} name="cancellationPolicies" initialValue={formData.cancellationPolicies} onChange={handleInputChange} placeholder="Outline cancellation terms..." />
                  </div>

                  <div className="group">
                    <label className="block text-sm font-bold text-slate-700 mb-2 group-focus-within:text-blue-600 transition-colors">Booking Terms</label>
                    <RichTextEditor key={`${resetKey}-book`} name="bookingTerms" initialValue={formData.bookingTerms} onChange={handleInputChange} placeholder="Standard booking terms and conditions..." />
                  </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className="space-y-7">
                  <div className="group">
                    <label className="block text-sm font-bold text-slate-700 mb-2 group-focus-within:text-blue-600 transition-colors">Inclusions</label>
                    <RichTextEditor key={`${resetKey}-inc`} name="inclusions" initialValue={formData.inclusions} onChange={handleInputChange} placeholder="Detail the inclusions here..." />
                  </div>
                  <div className="group">
                    <label className="block text-sm font-bold text-slate-700 mb-2 group-focus-within:text-blue-600 transition-colors">Exclusions</label>
                    <RichTextEditor key={`${resetKey}-exc`} name="exclusions" initialValue={formData.exclusions} onChange={handleInputChange} placeholder="Detail the exclusions here..." />
                  </div>
                  <div className="group">
                    <label className="block text-sm font-bold text-slate-700 mb-2 group-focus-within:text-blue-600 transition-colors">Payment Policies</label>
                    <RichTextEditor key={`${resetKey}-pay`} name="paymentPolicies" initialValue={formData.paymentPolicies} onChange={handleInputChange} placeholder="Outline payment terms..." />
                  </div>
                </div>

              </div>

              {/* Modal Footer */}
              <div className="bg-slate-50 px-8 py-5 border-t border-slate-200 flex justify-end gap-3 rounded-b-2xl">
                <button type="button" disabled={isLoading} onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all shadow-sm active:scale-95 disabled:opacity-50">
                  Cancel
                </button>
                <button type="submit" disabled={isLoading} className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-blue-500/30 hover:shadow-blue-500/50 active:scale-95 disabled:opacity-50 flex items-center justify-center">
                  {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Save Destination'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
};

export default DestinationMaster;