

// import React, { useState, useEffect } from 'react';

// import { cityService } from '../../services/CityService';
// import { countryService } from '../../services/CountryService';
// import { Search, Plus, Eye, Edit, Trash2, X, MapPin, Calendar, Hash, Globe, Building2 } from 'lucide-react';

// const CityMaster = () => {
 
//   const [cities, setCities] = useState([]);
//   const [loadingCities, setLoadingCities] = useState(true);

//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedCountry, setSelectedCountry] = useState('');
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [formData, setFormData] = useState({ country: '', name: '', code: '' });

//   const [countryList, setCountryList] = useState([]);
//   const [isLoadingCountries, setIsLoadingCountries] = useState(false);

//   // 👉New: Fetch both cities and countries on page load
//   useEffect(() => {
//     fetchCities();
//     fetchCountries();
//   }, []);

//   // 👉 New: Cities lane function from the backend
//   const fetchCities = async () => {
//     try {
//       setLoadingCities(true);
//       const response = await cityService.getAllCities();
      
//      // Extract data as per the format (adjust as per your backend response format)
//       const data = response.data?.data?.content || response.data?.data || response.data || [];
//       setCities(Array.isArray(data) ? data : []);
//     } catch (error) {
//       console.error("Error fetching cities from backend:", error);
//     } finally {
//       setLoadingCities(false);
//     }
//   };

//   const fetchCountries = async () => {
//     try {
//       setIsLoadingCountries(true);
//       // Countries come from the backend dropdown endpoint as { value, label }.
//       // Normalise to { id, name } so the existing <option> rendering keeps working.
//       const data = await countryService.getCountries();
//       const normalised = (Array.isArray(data) ? data : []).map((c) => ({
//         id: c.value ?? c.id,
//         name: c.label ?? c.name,
//       }));
//       setCountryList(normalised);
//     } catch (error) {
//       console.error("Error fetching countries:", error);
//     } finally {
//       setIsLoadingCountries(false);
//     }
//   };

//   const filteredCities = cities.filter(city => {
//     const matchesSearch =
//       (city.name && city.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
//       (city.country && city.country.toLowerCase().includes(searchTerm.toLowerCase()));

//     const matchesCountry =
//       !selectedCountry ||
//       (city.country && city.country.toLowerCase() === selectedCountry.toLowerCase());

//     return matchesSearch && matchesCountry;
//   });

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//  // 👉: Save City in Backend on Form Submit
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       // Backend API call to create city
//       await cityService.createCity(formData.country, formData.name, formData.code);
      
//       setIsModalOpen(false);
//       setFormData({ country: '', name: '', code: '' });
      
//       // Save hone ke baad table refresh karein
//       fetchCities(); 
//     } catch (error) {
//       console.error("Error creating city:", error);
//       alert("Failed to save city to backend.");
//     }
//   };

//   // 👉 NAYA: Delete Button ka logic (Kyunki service mein deleteCity bhi tha)
//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this city?")) {
//       try {
//         await cityService.deleteCity(id);
//         fetchCities(); // Delete hone ke baad table refresh karein
//       } catch (error) {
//         console.error("Error deleting city:", error);
//         alert("Failed to delete city.");
//       }
//     }
//   };

//   return (
//     <div className="p-4 sm:p-8 bg-[#f8fafc] min-h-screen font-sans">
      
//       {/* --- Page Header --- */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
//             <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
//               <Building2 size={24} />
//             </div>
//             City Master
//           </h1>
//           <div className="text-sm text-gray-500 mt-2 font-medium flex items-center gap-2">
//             <span className="text-blue-600 hover:text-blue-800 cursor-pointer transition-colors">Home</span> 
//             <span className="text-gray-300">/</span> 
//             <span className="text-blue-600 hover:text-blue-800 cursor-pointer transition-colors">Masters</span> 
//             <span className="text-gray-300">/</span> 
//             <span className="text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md">City</span>
//           </div>
//         </div>

//         <button 
//           onClick={() => setIsModalOpen(true)}
//           className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5"
//         >
//           <Plus size={18} strokeWidth={2.5} />
//           Add New City
//         </button>
//       </div>

//       {/* --- Main Card --- */}
//       <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
//         {/* Filters Section */}
//         <div className="p-5 border-b border-gray-100 bg-white flex flex-col sm:flex-row gap-4 justify-between items-center">
//           <div className="flex gap-4 w-full sm:w-auto">
//             {/* Search Input */}
//             <div className="relative w-full sm:w-80 group">
//               <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
//                 <Search size={18} />
//               </div>
//               <input
//                 type="text"
//                 placeholder="Search cities or countries..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all duration-300 placeholder-gray-400 text-gray-700 font-medium"
//               />
//             </div>
            
//             {/* Country Dropdown */}
//             <div className="relative w-full sm:w-48">
//               <select
//                 value={selectedCountry}
//                 onChange={(e) => setSelectedCountry(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all duration-300 text-gray-700 font-medium appearance-none cursor-pointer">
//                 <option value="">All Countries</option>
//                 {countryList.map((c) => (
//                   <option key={c.id} value={c.name}>{c.name}</option>
//                 ))}
//               </select>
//               <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
//                 <Globe size={18} />
//               </div>
//             </div>
//           </div>
          
//           <div className="flex items-center gap-3">
//             <button onClick={fetchCities} className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
//               Refresh
//             </button>
//             <div className="text-sm font-medium text-gray-500 border-l border-gray-200 pl-3">
//               Showing <span className="text-gray-900">{filteredCities.length}</span> cities
//             </div>
//           </div>
//         </div>

//         {/* --- Table --- */}
//         <div className="overflow-x-auto">
//           <table className="w-full text-left border-collapse whitespace-nowrap">
//             <thead>
//               <tr className="bg-gray-50/80 text-gray-500 text-xs uppercase tracking-wider font-bold border-b border-gray-100">
//                 <th className="px-6 py-4 rounded-tl-xl">
//                   <div className="flex items-center gap-2"><Hash size={14}/> ID</div>
//                 </th>
//                 <th className="px-6 py-4">
//                   <div className="flex items-center gap-2"><Globe size={14}/> Country</div>
//                 </th>
//                 <th className="px-6 py-4">
//                   <div className="flex items-center gap-2"><MapPin size={14}/> City Name</div>
//                 </th>
//                 <th className="px-6 py-4">Airport Code</th>
//                 <th className="px-6 py-4">
//                   <div className="flex items-center gap-2"><Calendar size={14}/> Created At</div>
//                 </th>
//                 <th className="px-6 py-4 text-center rounded-tr-xl">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-50">
              
//               {/* 👉 NAYA: Loading State */}
//               {loadingCities ? (
//                 <tr>
//                   <td colSpan="6" className="px-6 py-16 text-center">
//                     <div className="flex flex-col items-center justify-center">
//                       <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-3"></div>
//                       <h3 className="text-sm font-bold text-gray-700">Loading Cities...</h3>
//                     </div>
//                   </td>
//                 </tr>
//               ) : filteredCities.length === 0 ? (
                
//                 /* Empty State */
//                 <tr>
//                   <td colSpan="6" className="px-6 py-16 text-center">
//                     <div className="flex flex-col items-center justify-center">
//                       <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3">
//                         <Search size={24} className="text-gray-400" />
//                       </div>
//                       <h3 className="text-lg font-medium text-gray-900 mb-1">No cities found</h3>
//                       <p className="text-sm text-gray-500">We couldn't find anything matching your search.</p>
//                     </div>
//                   </td>
//                 </tr>
//               ) : (

//                 /* Real Data Mapping */
//                 filteredCities.map((city) => (
//                   <tr key={city.cityId} className="hover:bg-blue-50/30 transition-colors duration-200 group">
//                     <td className="px-6 py-4">
//                       <span className="text-sm font-semibold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-md">#{city.cityId}</span>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="flex items-center gap-3">
//                         <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
//                           {(city.country || 'U').charAt(0)}
//                         </div>
//                         <span className="text-sm font-medium text-gray-700">{city.country}</span>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 text-sm font-bold text-gray-900">{city.name}</td>
//                     <td className="px-6 py-4">
//                       <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200">
//                         {city.code || 'N/A'}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 text-sm text-gray-500 font-medium">
//                       {city.createdAt ? new Date(city.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
//                         <button className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors" title="View">
//                           <Eye size={18} />
//                         </button>
//                         <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
//                           <Edit size={18} />
//                         </button>
                        
//                         {/* 👉 NAYA: Delete function binded here */}
//                         <button 
//                           onClick={() => handleDelete(city.cityId)}
//                           className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
//                           title="Delete"
//                         >
//                           <Trash2 size={18} />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* ========================================== */}
//       {/* PREMIUM POPUP MODAL                        */}
//       {/* ========================================== */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-300">
          
//           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] transform scale-100 transition-transform duration-300">
            
//             {/* Modal Header with Gradient */}
//             <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white relative">
//               <button 
//                 onClick={() => setIsModalOpen(false)}
//                 className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors"
//               >
//                 <X size={20} />
//               </button>
//               <h2 className="text-xl font-bold mb-1">Create New City</h2>
//               <p className="text-blue-100 text-sm font-medium">Add a new destination to your master list.</p>
//             </div>

//             {/* Modal Body */}
//             <div className="overflow-y-auto p-6 bg-gray-50/50">
//               <form id="createCityForm" onSubmit={handleSubmit} className="space-y-5">
                
//                 <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-5">
//                   <div>
//                     <label className="block text-sm font-bold text-gray-700 mb-1.5">
//                       Country <span className="text-red-500">*</span>
//                     </label>
//                     <div className="relative">
//                       <select 
//                         name="country" required value={formData.country} onChange={handleInputChange}
//                         className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-gray-700 font-medium appearance-none transition-all"
//                       >
//                         <option value="" disabled>
//                           {isLoadingCountries ? "Loading countries..." : "Select Country"}
//                         </option>
//                         {countryList.map((c) => (
//                           <option key={c.id} value={c.name}>{c.name}</option>
//                         ))}
//                       </select>
//                       <Globe size={16} className="absolute left-3.5 top-3 text-gray-400" />
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-bold text-gray-700 mb-1.5">
//                       City Name <span className="text-red-500">*</span>
//                     </label>
//                     <div className="relative">
//                       <input 
//                         type="text" name="name" required value={formData.name} onChange={handleInputChange} placeholder="E.g. Sydney"
//                         className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-gray-900 font-medium transition-all placeholder-gray-400"
//                       />
//                       <MapPin size={16} className="absolute left-3.5 top-3 text-gray-400" />
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-bold text-gray-700 mb-1.5">
//                       Airport Code
//                     </label>
//                     <input 
//                       type="text" name="code" value={formData.code} onChange={handleInputChange} placeholder="E.g. SYD" maxLength="3"
//                       className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-gray-900 font-bold uppercase transition-all placeholder-gray-400"
//                     />
//                   </div>
//                 </div>

//               </form>
//             </div>

//             {/* Modal Footer */}
//             <div className="p-5 border-t border-gray-100 bg-white flex justify-end gap-3">
//               <button 
//                 type="button" 
//                 onClick={() => setIsModalOpen(false)}
//                 className="px-5 py-2.5 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors"
//               >
//                 Cancel
//               </button>
//               <button 
//                 type="submit" 
//                 form="createCityForm"
//                 className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-md shadow-blue-500/20 flex items-center gap-2"
//               >
//                 Save City
//               </button>
//             </div>

//           </div>
//         </div>
//       )}

//     </div>
//   );
// };

// export default CityMaster;








import React, { useState, useEffect, useMemo } from "react";
import {
  Building2, Plus, Search, Trash2, Edit2, X, Check,
  MapPin, Globe, ChevronDown, AlertCircle, Loader2,
  Home, ChevronRight, RefreshCw
} from "lucide-react";
import { cityService }      from "../../services/cityService";
import { countryService }    from "../../services/countryService";
import { destinationService } from "../../services/destinationService";

/* ─── TOAST ──────────────────────────────────────────────── */
function Toast({ msg, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div className={`fixed top-4 right-4 left-4 sm:left-auto sm:right-5 sm:top-5 z-[999]
      flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl sm:max-w-sm
      ${type === "success"
        ? "bg-green-50 border-green-200 text-green-800"
        : "bg-red-50 border-red-200 text-red-800"}`}
      style={{ animation: "slideIn .3s ease both" }}>
      {type === "success"
        ? <Check size={16} className="text-green-600 flex-shrink-0" />
        : <AlertCircle size={16} className="text-red-500 flex-shrink-0" />}
      <p className="text-sm font-semibold flex-1">{msg}</p>
      <button onClick={onClose} className="opacity-50 hover:opacity-100 ml-1">
        <X size={14} />
      </button>
    </div>
  );
}

/* ─── LABEL + INPUT + SELECT helpers ────────────────────── */
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
      <input
        className={`w-full border rounded-xl px-3 py-2.5 text-sm transition-all
          focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400
          ${error ? "border-red-300 bg-red-50/50" : "border-slate-200 bg-white hover:border-slate-300"}`}
        {...props}
      />
      {error && (
        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
          <AlertCircle size={10} />{error}
        </p>
      )}
    </div>
  );
}
function FSelect({ error, children, ...props }) {
  return (
    <div>
      <select
        className={`w-full border rounded-xl px-3 py-2.5 text-sm bg-white transition-all
          focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400
          ${error ? "border-red-300" : "border-slate-200 hover:border-slate-300"}`}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
          <AlertCircle size={10} />{error}
        </p>
      )}
    </div>
  );
}

/* ─── ADD / EDIT MODAL ───────────────────────────────────── */
function CityModal({ editing, onClose, onSave }) {

  // ── Cascade state ─────────────────────────────────────────
  const [countries,     setCountries]     = useState([]);
  const [destinations,  setDestinations]  = useState([]);
  const [countryId,     setCountryId]     = useState(editing?.countryId     || "");
  const [destinationId, setDestinationId] = useState(editing?.destinationId || "");
  const [name,          setName]          = useState(editing?.name || "");
  const [code,          setCode]          = useState(editing?.code || "");
  const [errors,        setErrors]        = useState({});
  const [saving,        setSaving]        = useState(false);
  const [loadingDest,   setLoadingDest]   = useState(false);

  // ── Load countries on mount ────────────────────────────────
  // Pehle sirf 2 placeholder options dikhte hain:
  //   1. "Select Country"
  //   2. "Select Destination"
  // Jab country click kare tab getAllCountries() call hoga
  const [countriesLoaded, setCountriesLoaded] = useState(false);
  const [loadingCountry,  setLoadingCountry]  = useState(false);

  const loadCountries = async () => {
    if (countriesLoaded || loadingCountry) return; // ek baar hi load karo
    setLoadingCountry(true);
    try {
      const res = await countryService.getAllCountries();
      const data = res.data?.data || res.data || [];
      setCountries(Array.isArray(data) ? data : []);
      setCountriesLoaded(true);
    } catch {
      setCountries([]);
    } finally {
      setLoadingCountry(false);
    }
  };

  // editing mode mein auto-load
  useEffect(() => {
    if (editing?.countryId) loadCountries();
  }, []);

  // ── If editing — pre-fill destinations ────────────────────
  useEffect(() => {
    if (editing?.countryId) {
      loadDestinations(editing.countryId);
    }
  }, [editing]);

  // ── Load destinations when country changes ─────────────────
  const loadDestinations = async (cId) => {
    setDestinations([]);
    setDestinationId("");
    if (!cId) return;
    setLoadingDest(true);
    try {
      const res = await destinationService.getDestinationsByCountry(cId);
      const data = res.data?.data || res.data || [];
      setDestinations(Array.isArray(data) ? data : []);
      // editing mode mein destination re-set karo
      if (editing?.destinationId) setDestinationId(editing.destinationId);
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

  // ── Validate ───────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!countryId)     e.countryId     = "Country required";
    if (!destinationId) e.destinationId = "Destination required";
    if (!name.trim())   e.name          = "City name required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Save ───────────────────────────────────────────────────
  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      if (editing) {
        await cityService.updateCity(editing.id, countryId, destinationId, name, code);
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

        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4
          bg-gradient-to-r from-blue-700 to-blue-500 rounded-t-2xl sm:rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
              <Building2 size={16} className="text-white" />
            </div>
            <div>
              <h2 className="font-extrabold text-white text-[15px]">
                {editing ? "Edit City" : "Add New City"}
              </h2>
              <p className="text-[11px] text-blue-200">Fill all required fields</p>
            </div>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-all">
            <X size={15} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4">

          {/* API Error */}
          {errors.api && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600 flex items-center gap-2">
              <AlertCircle size={14} className="flex-shrink-0" /> {errors.api}
            </div>
          )}

          {/* Step 1 — Country */}
          <div>
            <Label required>Country</Label>
            <FSelect
              error={errors.countryId}
              value={countryId}
              onFocus={loadCountries}
              onClick={loadCountries}
              onChange={e => handleCountryChange(e.target.value)}>
              {/* Placeholder — hamesha dikhta hai */}
              <option value="">
                {loadingCountry ? "Loading countries…" : "Select Country"}
              </option>
              {/* Jab tak countries load nahi — sirf placeholder */}
              {!countriesLoaded && !loadingCountry && (
                <option value="" disabled>── Click to load countries ──</option>
              )}
              {countriesLoaded && countries.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </FSelect>
          </div>

          {/* Step 2 — Destination (depends on country) */}
          <div>
            <Label required>Destination</Label>
            <div className="relative">
              <FSelect
                error={errors.destinationId}
                value={destinationId}
                onChange={e => setDestinationId(e.target.value)}
                disabled={!countryId || loadingDest}>
                {/* Placeholder — hamesha dikhta hai */}
                <option value="">
                  {!countryId
                    ? "Select Destination"
                    : loadingDest
                      ? "Loading destinations…"
                      : destinations.length === 0
                        ? "No destinations found"
                        : "Select Destination"}
                </option>
                {/* Destinations sirf tab dikhte hain jab country choose ho */}
                {countryId && !loadingDest && destinations.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </FSelect>
              {loadingDest && (
                <Loader2 size={14} className="absolute right-8 top-3 text-blue-500 animate-spin" />
              )}
            </div>
          </div>

          {/* Step 3 — City Name + Code */}
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 sm:col-span-1">
              <Label required>City Name</Label>
              <FInput
                error={errors.name}
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Kathmandu"
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <Label>Airport Code</Label>
              <FInput
                value={code}
                onChange={e => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. KTM"
                maxLength={4}
              />
            </div>
          </div>

          {/* Cascade hint */}
          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-xl border border-blue-100 text-xs text-blue-600 font-medium">
            <Globe size={13} className="flex-shrink-0 text-blue-500" />
            Country → Destination → City
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-1">
            <button onClick={onClose}
              className="flex-1 py-2.5 border-2 border-slate-200 hover:border-slate-300
                text-slate-600 font-bold text-sm rounded-xl transition-all bg-white hover:bg-slate-50">
              Cancel
            </button>
            <button onClick={handleSave} disabled={saving}
              className="flex-1 py-2.5 font-bold text-sm rounded-xl text-white transition-all
                active:scale-95 disabled:opacity-60 shadow-md shadow-blue-200
                bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800
                flex items-center justify-center gap-2">
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

/* ─── DELETE CONFIRM ─────────────────────────────────────── */
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
          Are you sure you want to delete <span className="font-bold text-slate-700">"{city?.name}"</span>?
          This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border-2 border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all">
            Cancel
          </button>
          <button onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md shadow-red-200 transition-all">
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── MAIN CITIES PAGE ───────────────────────────────────── */
export default function Cities() {
  const [cities,       setCities]       = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [search,       setSearch]       = useState("");
  const [filterCountry, setFilterCountry] = useState("");
  const [filterDest,   setFilterDest]   = useState("");
  const [showModal,    setShowModal]    = useState(false);
  const [editCity,     setEditCity]     = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast,        setToast]        = useState(null);

  const showToast = (msg, type = "success") => setToast({ msg, type });

  // ── Fetch all cities ───────────────────────────────────────
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

  // ── Unique countries + destinations for filter dropdowns ──
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

  // ── Filter cities ─────────────────────────────────────────
  const filtered = useMemo(() =>
    cities.filter(c => {
      const q = search.trim().toLowerCase();
      if (q && !c.name?.toLowerCase().includes(q) &&
               !c.code?.toLowerCase().includes(q)) return false;
      if (filterCountry && String(c.countryId) !== String(filterCountry)) return false;
      if (filterDest && String(c.destinationId) !== String(filterDest)) return false;
      return true;
    }),
    [cities, search, filterCountry, filterDest]
  );

  // ── Delete ─────────────────────────────────────────────────
  const handleDelete = async () => {
    try {
      await cityService.deleteCity(deleteTarget.id);
      setCities(prev => prev.filter(c => c.id !== deleteTarget.id));
      showToast(`"${deleteTarget.name}" deleted successfully.`);
      setDeleteTarget(null);
    } catch {
      showToast("Failed to delete city.", "error");
    }
  };

  // ── Save (create/edit) ────────────────────────────────────
  const handleSave = () => {
    setShowModal(false);
    setEditCity(null);
    fetchCities();
    showToast(editCity ? "City updated successfully!" : "City added successfully!");
  };

  return (
    <div className="min-h-screen font-sans"
      style={{
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        background: "linear-gradient(135deg,#f8fafc 0%,#eff6ff20 50%,#f8fafc 100%)",
      }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        @keyframes fadeUp  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn { from{transform:translateX(110%);opacity:0} to{transform:translateX(0);opacity:1} }
        .fade-up { animation: fadeUp .4s ease both; }
        .city-row:hover { background: #f8faff; }
      `}</style>

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      {showModal && (
        <CityModal
          editing={editCity}
          onClose={() => { setShowModal(false); setEditCity(null); }}
          onSave={handleSave}
        />
      )}
      {deleteTarget && (
        <DeleteConfirm
          city={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}

      {/* ── Page Header ── */}
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-20 shadow-sm">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-400
                flex items-center justify-center text-white shadow-lg shadow-blue-200">
                <Building2 size={20} strokeWidth={2.2} />
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-0.5">
                  <Home size={11} />
                  <ChevronRight size={9} className="text-slate-300" />
                  <span>Masters</span>
                  <ChevronRight size={9} className="text-slate-300" />
                  <span className="text-blue-600 font-bold">Cities</span>
                </div>
                <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                  City Master
                </h1>
                <p className="text-xs text-slate-400 font-medium hidden sm:block">
                  {cities.length} cities · {uniqueCountries.length} countries
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={fetchCities}
                className="flex items-center gap-1.5 px-3 py-2.5 border border-slate-200 hover:border-blue-300
                  bg-white hover:bg-blue-50 text-slate-600 hover:text-blue-600 text-xs font-bold
                  rounded-xl transition-all shadow-sm">
                <RefreshCw size={13} /> Refresh
              </button>
              <button onClick={() => { setEditCity(null); setShowModal(true); }}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700
                  hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2.5 rounded-xl
                  text-sm font-bold transition-all active:scale-95 shadow-md shadow-blue-200">
                <Plus size={16} strokeWidth={2.5} /> Add City
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-5 space-y-4">

        {/* ── Filter Bar ── */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 fade-up">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search city name or airport code..."
                className="w-full border border-slate-200 hover:border-slate-300 rounded-xl
                  pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2
                  focus:ring-blue-500/30 focus:border-blue-400 transition-all bg-white"
              />
            </div>

            {/* Country filter */}
            <select
              value={filterCountry}
              onChange={e => { setFilterCountry(e.target.value); setFilterDest(""); }}
              className="border border-slate-200 hover:border-slate-300 rounded-xl px-3 py-2.5
                text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30
                focus:border-blue-400 transition-all min-w-[150px]">
              <option value="">All Countries</option>
              {uniqueCountries.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            {/* Destination filter — depends on country */}
            <select
              value={filterDest}
              onChange={e => setFilterDest(e.target.value)}
              disabled={!filterCountry}
              className="border border-slate-200 hover:border-slate-300 rounded-xl px-3 py-2.5
                text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30
                focus:border-blue-400 transition-all min-w-[160px]
                disabled:opacity-50 disabled:cursor-not-allowed">
              <option value="">
                {!filterCountry ? "Select country first" : "All Destinations"}
              </option>
              {uniqueDestinations.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>

            {/* Clear filters */}
            {(search || filterCountry || filterDest) && (
              <button
                onClick={() => { setSearch(""); setFilterCountry(""); setFilterDest(""); }}
                className="flex items-center gap-1.5 px-3 py-2.5 text-xs font-bold
                  text-slate-500 hover:text-red-500 bg-slate-50 hover:bg-red-50
                  border border-slate-200 hover:border-red-200 rounded-xl transition-all whitespace-nowrap">
                <X size={12} /> Clear
              </button>
            )}
          </div>
        </div>

        {/* ── Cities Table ── */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden fade-up"
          style={{ animationDelay: "60ms" }}>

          {/* Table header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50/60">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center">
                <Building2 size={13} className="text-blue-600" />
              </div>
              <p className="text-[13px] font-bold text-slate-700">Cities Directory</p>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                {filtered.length} results
              </span>
            </div>
          </div>

          {/* Column headers — desktop only */}
          <div className="hidden sm:grid px-5 py-3 bg-slate-50/40 border-b border-slate-100 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider"
            style={{ gridTemplateColumns: "1.5fr 1fr 1fr 80px 80px" }}>
            <div>City</div>
            <div>Country</div>
            <div>Destination</div>
            <div>Code</div>
            <div className="text-right">Actions</div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="space-y-0">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="grid px-5 py-4 border-b border-slate-50 animate-pulse"
                  style={{ gridTemplateColumns: "1.5fr 1fr 1fr 80px 80px" }}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-200 rounded-xl flex-shrink-0" />
                    <div className="h-4 bg-slate-200 rounded-lg w-28" />
                  </div>
                  <div className="h-4 bg-slate-100 rounded-lg w-20 self-center" />
                  <div className="h-4 bg-slate-100 rounded-lg w-24 self-center" />
                  <div className="h-4 bg-slate-100 rounded-lg w-10 self-center" />
                  <div className="h-4 bg-slate-100 rounded-lg w-12 self-center ml-auto" />
                </div>
              ))}
            </div>
          )}

          {/* Empty */}
          {!loading && filtered.length === 0 && (
            <div className="py-16 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Building2 size={28} className="text-slate-300" />
              </div>
              <p className="text-slate-600 font-bold text-base mb-1">No Cities Found</p>
              <p className="text-slate-400 text-sm">Try adjusting your search or filters</p>
              {(search || filterCountry || filterDest) && (
                <button onClick={() => { setSearch(""); setFilterCountry(""); setFilterDest(""); }}
                  className="mt-4 text-xs font-bold text-blue-500 hover:text-blue-600 underline underline-offset-2">
                  Clear filters
                </button>
              )}
            </div>
          )}

          {/* City rows */}
          {!loading && filtered.length > 0 && (
            <div>
              {filtered.map((city, idx) => (
                <div key={city.id}
                  className="city-row border-b border-slate-50 last:border-0 transition-colors"
                  style={{ animation: `fadeUp .3s ease ${idx * 20}ms both` }}>

                  {/* ── Desktop row ── */}
                  <div className="hidden sm:grid items-center px-5 py-3.5 gap-3"
                    style={{ gridTemplateColumns: "1.5fr 1fr 1fr 80px 80px" }}>

                    {/* City name */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200
                        flex items-center justify-center flex-shrink-0">
                        <Building2 size={14} className="text-blue-600" />
                      </div>
                      <span className="text-sm font-bold text-slate-800 truncate">{city.name}</span>
                    </div>

                    {/* Country */}
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Globe size={12} className="text-slate-400 flex-shrink-0" />
                      <span className="text-sm text-slate-600 truncate font-medium">
                        {city.countryName || city.country || "—"}
                      </span>
                    </div>

                    {/* Destination */}
                    <div className="flex items-center gap-1.5 min-w-0">
                      <MapPin size={12} className="text-rose-400 flex-shrink-0" />
                      <span className="text-sm text-slate-600 truncate font-medium">
                        {city.destinationName || city.destination || "—"}
                      </span>
                    </div>

                    {/* Code */}
                    <div>
                      {city.code ? (
                        <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-amber-50
                          text-amber-700 border border-amber-200 font-mono">
                          {city.code}
                        </span>
                      ) : (
                        <span className="text-slate-300 text-sm">—</span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => { setEditCity(city); setShowModal(true); }}
                        className="w-7 h-7 rounded-lg bg-blue-50 hover:bg-blue-100
                          text-blue-500 flex items-center justify-center transition-all"
                        title="Edit">
                        <Edit2 size={12} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(city)}
                        className="w-7 h-7 rounded-lg bg-rose-50 hover:bg-rose-100
                          text-rose-400 flex items-center justify-center transition-all"
                        title="Delete">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>

                  {/* ── Mobile row ── */}
                  <div className="sm:hidden px-4 py-3.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200
                          flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Building2 size={15} className="text-blue-600" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-bold text-slate-800">{city.name}</p>
                            {city.code && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded
                                bg-amber-50 text-amber-700 border border-amber-200 font-mono">
                                {city.code}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className="text-xs text-slate-500 flex items-center gap-1">
                              <Globe size={10} className="text-slate-400" />
                              {city.countryName || city.country || "—"}
                            </span>
                            <span className="text-slate-300 text-xs">·</span>
                            <span className="text-xs text-slate-500 flex items-center gap-1">
                              <MapPin size={10} className="text-rose-400" />
                              {city.destinationName || city.destination || "—"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                          onClick={() => { setEditCity(city); setShowModal(true); }}
                          className="w-7 h-7 rounded-lg bg-blue-50 hover:bg-blue-100
                            text-blue-500 flex items-center justify-center transition-all">
                          <Edit2 size={12} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(city)}
                          className="w-7 h-7 rounded-lg bg-rose-50 hover:bg-rose-100
                            text-rose-400 flex items-center justify-center transition-all">
                          <Trash2 size={12} />
                        </button>
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