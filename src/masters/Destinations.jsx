import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, Plus, Eye, Edit, Trash2, Map, Globe, Image as ImageIcon, X, 
  ChevronDown, Bold, Italic, Underline, Strikethrough, AlignLeft, AlignCenter, AlignRight,
  List, ListOrdered, Quote, Code, Link as LinkIcon, Type, AlertTriangle, MapPin, Calendar, Eraser, Baseline
} from 'lucide-react';
import { Link } from 'react-router-dom';

// =========================================================================
// 🌟 PREMIUM RICH TEXT EDITOR (Defined OUTSIDE to prevent cursor jumping)
// =========================================================================
const RichTextEditor = ({ name, initialValue, onChange, placeholder }) => {
  const editorRef = useRef(null);

  // Set initial value only once
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== initialValue) {
      editorRef.current.innerHTML = initialValue || '';
    }
  }, []); // Empty dependency array -> runs only on mount

  // Sync with parent state
  const handleInput = () => {
    if (onChange && editorRef.current) {
      onChange({ target: { name, value: editorRef.current.innerHTML } });
    }
  };

  // Prevent default behavior to keep cursor focused while clicking formatting buttons
  const executeCommand = (e, command, arg = null) => {
    e.preventDefault(); 
    document.execCommand(command, false, arg);
    editorRef.current.focus();
    handleInput();
  };

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all duration-300">
      
      {/* Sleek Editor Toolbar */}
      <div className="bg-slate-50 border-b border-slate-200 px-3 py-2.5 flex flex-wrap items-center gap-x-2 gap-y-2 text-slate-600 text-sm select-none">
        
        <button type="button" onMouseDown={(e) => executeCommand(e, 'formatBlock', 'P')} className="flex items-center gap-1.5 px-2 py-1.5 hover:bg-slate-200 rounded-lg font-semibold text-slate-700 transition-colors">
          Normal <ChevronDown size={14} className="text-slate-400"/>
        </button>
        
        <div className="w-px h-5 bg-slate-300 hidden sm:block mx-1"></div>
        
        {/* Formatting Tools */}
        <div className="flex items-center gap-0.5">
          <button type="button" onMouseDown={(e) => executeCommand(e, 'bold')} className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors" title="Bold"><Bold size={16} strokeWidth={2.5} /></button>
          <button type="button" onMouseDown={(e) => executeCommand(e, 'italic')} className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors" title="Italic"><Italic size={16} /></button>
          <button type="button" onMouseDown={(e) => executeCommand(e, 'underline')} className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors" title="Underline"><Underline size={16} /></button>
          <button type="button" onMouseDown={(e) => executeCommand(e, 'strikeThrough')} className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors" title="Strikethrough"><Strikethrough size={16} /></button>
        </div>
        
        <div className="w-px h-5 bg-slate-300 hidden sm:block mx-1"></div>
        
        {/* Colors */}
        <div className="flex items-center gap-1 relative">
          <label className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700 cursor-pointer flex items-center justify-center transition-colors relative" title="Text Color">
            <Baseline size={16} />
            <input type="color" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => { document.execCommand('foreColor', false, e.target.value); handleInput(); }} />
          </label>
          <label className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700 cursor-pointer flex items-center justify-center transition-colors relative" title="Highlight Color">
            <Baseline size={16} className="bg-yellow-200" />
            <input type="color" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => { document.execCommand('hiliteColor', false, e.target.value); handleInput(); }} />
          </label>
        </div>
        
        <div className="w-px h-5 bg-slate-300 hidden sm:block mx-1"></div>
        
        {/* Alignment & Lists */}
        <div className="flex items-center gap-0.5">
          <button type="button" onMouseDown={(e) => executeCommand(e, 'justifyLeft')} className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors" title="Align Left"><AlignLeft size={16} /></button>
          <button type="button" onMouseDown={(e) => executeCommand(e, 'justifyCenter')} className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors" title="Align Center"><AlignCenter size={16} /></button>
          <button type="button" onMouseDown={(e) => executeCommand(e, 'insertUnorderedList')} className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors" title="Bullet List"><List size={16} /></button>
          <button type="button" onMouseDown={(e) => executeCommand(e, 'insertOrderedList')} className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors" title="Numbered List"><ListOrdered size={16} /></button>
        </div>

        <div className="w-px h-5 bg-slate-300 hidden sm:block mx-1"></div>

        {/* Clear Formatting */}
        <button type="button" onMouseDown={(e) => executeCommand(e, 'removeFormat')} className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors" title="Clear Formatting"><Eraser size={16} /></button>
      </div>

      {/* Editor Content Area */}
      <div 
        ref={editorRef}
        contentEditable={true}
        suppressContentEditableWarning={true}
        onInput={handleInput}
        onBlur={handleInput}
        className="w-full h-32 p-4 focus:outline-none overflow-y-auto text-[14.5px] text-slate-700 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-2 [&_b]:font-bold [&_i]:italic [&_u]:underline [&_strike]:line-through leading-relaxed"
        style={{ 
          minHeight: '130px',
          ':empty:before': { content: 'attr(placeholder)', color: '#94a3b8', pointerEvents: 'none', display: 'block' }
        }}
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
    { id: '670', name: 'Anapurna Base Camp', country: 'Nepal', type: 'Domestic', cities: 1, createdAt: 'Jun 03, 2026', image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=100&h=60' },
    { id: '503', name: 'Arunachal Pradesh', country: 'India', type: 'Domestic', cities: 12, createdAt: 'May 29, 2026', image: null },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Track reset key to force clear editor on new form
  const [resetKey, setResetKey] = useState(Date.now());

  const [formData, setFormData] = useState({
    country: '', name: '', type: '', bookingPeriod: '', imagePath: '',
    inclusions: '', exclusions: '', paymentPolicies: '', cancellationPolicies: '', bookingTerms: ''
  });

  const filteredDestinations = destinations.filter(dest => {
    const matchesSearch = dest.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCountry = selectedCountry === '' || dest.country === selectedCountry;
    return matchesSearch && matchesCountry;
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openModal = () => {
    setFormData({
      country: '', name: '', type: '', bookingPeriod: '', imagePath: '',
      inclusions: '', exclusions: '', paymentPolicies: '', cancellationPolicies: '', bookingTerms: ''
    });
    setResetKey(Date.now()); // Forces RichTextEditor to clear
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting Destination Data:", formData);
    
    const newDest = {
      id: Math.floor(1000 + Math.random() * 9000).toString(),
      name: formData.name,
      country: formData.country,
      type: formData.type || 'Domestic',
      cities: 0,
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      image: null
    };

    setDestinations([newDest, ...destinations]);
    setIsModalOpen(false);
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
          <button onClick={openModal} className="flex items-center gap-2 bg-[#007bff] hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5">
            <Plus size={18} strokeWidth={2.5} /> Add New Destination
          </button>
        </div>

        <div className="p-5 border-b border-slate-100 flex flex-wrap gap-4 items-center justify-between bg-slate-50/50">
          <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 min-w-[280px] max-w-sm group">
              <input type="text" placeholder="Search destinations..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700 shadow-sm" />
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors"><Search size={16} /></div>
            </div>
            
            <div className="relative min-w-[200px]">
              <select value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)} className="w-full pl-10 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 appearance-none cursor-pointer transition-all shadow-sm">
                <option value="">All Countries</option><option value="India">India</option><option value="Nepal">Nepal</option>
              </select>
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400"><Globe size={16} /></div>
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
                <tr key={dest.id} className="hover:bg-slate-50 transition-colors duration-150 group">
                  <td className="px-6 py-4 text-slate-500 font-semibold">{dest.id}</td>
                  <td className="px-6 py-4">
                    <div className="w-16 h-10 bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden rounded-md shadow-sm">
                      {dest.image ? <img src={dest.image} alt={dest.name} className="w-full h-full object-cover" /> : <ImageIcon size={18} className="text-slate-400" />}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900">{dest.name}</td>
                  <td className="px-6 py-4 text-slate-600 font-medium">{dest.country}</td>
                  <td className="px-6 py-4"><span className="bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-md text-[11px] font-extrabold uppercase tracking-wide border border-emerald-200">{dest.type}</span></td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <span className="w-6 h-6 bg-[#17a2b8] text-white flex items-center justify-center rounded-md text-xs font-bold shadow-sm">{dest.cities}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500 font-medium">{dest.createdAt}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 bg-[#17a2b8]/10 text-[#17a2b8] hover:bg-[#17a2b8] hover:text-white rounded-lg transition-colors" title="View"><Eye size={16} strokeWidth={2.5} /></button>
                      <button className="p-2 bg-[#ffc107]/10 text-[#ffc107] hover:bg-[#ffc107] hover:text-white rounded-lg transition-colors" title="Edit"><Edit size={16} strokeWidth={2.5} /></button>
                      <button className="p-2 bg-[#dc3545]/10 text-[#dc3545] hover:bg-[#dc3545] hover:text-white rounded-lg transition-colors" title="Delete"><Trash2 size={16} strokeWidth={2.5} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ADD NEW DESTINATION MODAL - PREMIUM STYLING                               */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-start justify-center p-4 sm:p-6 overflow-y-auto custom-scrollbar">
          <div className="bg-white w-full max-w-6xl shadow-2xl mt-4 sm:mt-10 mb-10 transform transition-all rounded-2xl overflow-hidden border border-slate-200">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex justify-between items-center text-white">
              <div>
                <h2 className="text-xl font-bold tracking-wide">Destination Information</h2>
                <p className="text-blue-100 text-sm font-medium mt-0.5">Fill in the details to add a new destination.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8 bg-[#fcfdff]">
                
                {/* LEFT COLUMN - Standard Form Fields */}
                <div className="space-y-7">
                  
                  {/* Country */}
                  <div>
                    <label className="block text-sm font-bold text-slate-800 mb-2">Country <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <select name="country" value={formData.country} onChange={handleInputChange} required className="w-full pl-4 pr-10 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-slate-700 appearance-none transition-all shadow-sm">
                        <option value="">Select Country</option><option value="India">India</option><option value="Nepal">Nepal</option><option value="Australia">Australia</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400"><ChevronDown size={16} /></div>
                    </div>
                  </div>

                  {/* Destination Name */}
                  <div>
                    <label className="block text-sm font-bold text-slate-800 mb-2">Destination Name <span className="text-red-500">*</span></label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} required placeholder="Enter destination name" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-slate-800 placeholder-slate-400 transition-all shadow-sm" />
                  </div>

                  {/* Destination Type & Booking Period Row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-800 mb-2">Type <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <select name="type" value={formData.type} onChange={handleInputChange} required className="w-full pl-4 pr-10 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-slate-700 appearance-none transition-all shadow-sm">
                          <option value="">Select</option><option value="Domestic">Domestic</option><option value="International">International</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400"><ChevronDown size={16} /></div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-800 mb-2">Booking Period</label>
                      <div className="relative">
                        <input type="text" name="bookingPeriod" value={formData.bookingPeriod} onChange={handleInputChange} placeholder="E.g., Oct to Mar" className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-slate-800 placeholder-slate-400 transition-all shadow-sm" />
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400"><Calendar size={16} /></div>
                      </div>
                    </div>
                  </div>

                  {/* Destination Image */}
                  <div>
                    <label className="block text-sm font-bold text-slate-800 mb-2">Destination Image</label>
                    <div className="flex shadow-sm rounded-xl overflow-hidden">
                      <input type="text" readOnly value={formData.imagePath} placeholder="Choose file" className="border border-slate-200 border-r-0 px-4 py-3 flex-1 bg-white text-sm text-slate-500 focus:outline-none" />
                      <button type="button" onClick={() => setFormData(prev => ({...prev, imagePath: 'image_001.jpg'}))} className="bg-slate-100 border border-slate-200 px-6 py-3 text-sm text-slate-700 hover:bg-slate-200 font-bold transition-colors">Browse</button>
                    </div>
                    <div className="mt-3 space-y-2">
                      <p className="text-xs text-slate-500 font-medium">Recommended image size: 800x600 pixels. Max file size: 2MB.</p>
                      <p className="text-xs text-rose-500 font-semibold flex items-center gap-1.5"><AlertTriangle size={14} />Disclaimer: Upload only royalty-free or owned images.</p>
                    </div>
                  </div>

                  {/* Add Cities */}
                  <div>
                    <label className="block text-sm font-bold text-slate-800 mb-2">Add Cities <span className="text-red-500">*</span></label>
                    <div className="relative shadow-sm rounded-xl overflow-hidden border border-slate-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400"><MapPin size={16} /></div>
                      <input type="text" placeholder="Search and add a city..." className="w-full pl-10 pr-10 py-3 bg-white focus:outline-none text-sm text-slate-800 placeholder-slate-400" />
                      <button type="button" className="absolute right-0 top-0 bottom-0 px-3 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"><X size={16} /></button>
                    </div>
                    
                    <div className="mt-4 border border-dashed border-slate-300 rounded-xl bg-slate-50 h-32 flex flex-col items-center justify-center text-center p-4">
                      <p className="text-sm text-slate-500 font-medium">No cities added yet. Search above to add cities to this destination.</p>
                    </div>
                  </div>

                </div>

                {/* RIGHT COLUMN - Fixed Rich Text Editors */}
                <div className="space-y-6">
                  {/* Passed key={resetKey} to force editors to clear entirely on new modal open */}
                  <div>
                    <label className="block text-sm font-bold text-slate-800 mb-2">Inclusions</label>
                    <RichTextEditor key={`${resetKey}-inc`} name="inclusions" initialValue={formData.inclusions} onChange={handleInputChange} placeholder="Type inclusions here... You can use Bold, Italic, and Colors!" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-800 mb-2">Exclusions</label>
                    <RichTextEditor key={`${resetKey}-exc`} name="exclusions" initialValue={formData.exclusions} onChange={handleInputChange} placeholder="Type exclusions here..." />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-800 mb-2">Payment Policies</label>
                    <RichTextEditor key={`${resetKey}-pay`} name="paymentPolicies" initialValue={formData.paymentPolicies} onChange={handleInputChange} placeholder="Type payment policies here..." />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-800 mb-2">Cancellation Policies</label>
                    <RichTextEditor key={`${resetKey}-can`} name="cancellationPolicies" initialValue={formData.cancellationPolicies} onChange={handleInputChange} placeholder="Type cancellation policies here..." />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-800 mb-2">Booking Terms</label>
                    <RichTextEditor key={`${resetKey}-book`} name="bookingTerms" initialValue={formData.bookingTerms} onChange={handleInputChange} placeholder="Type booking terms here..." />
                  </div>
                </div>

              </div>

              {/* Modal Footer */}
              <div className="bg-slate-50 px-8 py-5 border-t border-slate-200 flex justify-end gap-3 rounded-b-2xl">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-100 transition-colors shadow-sm">Cancel</button>
                <button type="submit" className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-blue-500/20 hover:-translate-y-0.5">Save Destination</button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
};

export default DestinationMaster;
