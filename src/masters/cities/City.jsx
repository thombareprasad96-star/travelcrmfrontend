// import React, { useState } from 'react';
// import { Search, Plus, Eye, Edit, Trash2, X, MapPin, Calendar, Hash, Globe, Building2 } from 'lucide-react';

// const CityMaster = () => {
//   const [cities, setCities] = useState([
//     { id: '7311', country: 'Australia', name: 'Adelaide', code: 'ADL', createdAt: 'May 29, 2026', status: 'Active' },
//     { id: '7309', country: 'Australia', name: 'Brisbane', code: 'BNE', createdAt: 'May 29, 2026', status: 'Active' },
//     { id: '7312', country: 'Australia', name: 'Cairns', code: 'CNS', createdAt: 'May 29, 2026', status: 'Active' },
//     { id: '7316', country: 'Australia', name: 'Canberra', code: 'CBR', createdAt: 'May 29, 2026', status: 'Active' },
//     { id: '7315', country: 'Australia', name: 'Darwin', code: 'DRW', createdAt: 'May 29, 2026', status: 'Active' },
//   ]);

//   const [searchTerm, setSearchTerm] = useState('');
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [formData, setFormData] = useState({ country: '', name: '', code: '' });

//   const filteredCities = cities.filter(city =>
//     city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     city.country.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const newCity = {
//       id: Math.floor(1000 + Math.random() * 9000).toString(),
//       country: formData.country,
//       name: formData.name,
//       code: formData.code.toUpperCase(),
//       createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
//       status: 'Active'
//     };
//     setCities([newCity, ...cities]);
//     setIsModalOpen(false);
//     setFormData({ country: '', name: '', code: '' });
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
//               <select className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all duration-300 text-gray-700 font-medium appearance-none cursor-pointer">
//                 <option value="">All Countries</option>
//                 <option value="Australia">Australia</option>
//                 <option value="India">India</option>
//               </select>
//               <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
//                 <Globe size={18} />
//               </div>
//             </div>
//           </div>
          
//           <div className="text-sm font-medium text-gray-500">
//             Showing <span className="text-gray-900">{filteredCities.length}</span> cities
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
//               {filteredCities.map((city) => (
//                 <tr key={city.id} className="hover:bg-blue-50/30 transition-colors duration-200 group">
//                   <td className="px-6 py-4">
//                     <span className="text-sm font-semibold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-md">#{city.id}</span>
//                   </td>
//                   <td className="px-6 py-4">
//                     <div className="flex items-center gap-3">
//                       <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
//                         {city.country.charAt(0)}
//                       </div>
//                       <span className="text-sm font-medium text-gray-700">{city.country}</span>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 text-sm font-bold text-gray-900">{city.name}</td>
//                   <td className="px-6 py-4">
//                     <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200">
//                       {city.code}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 text-sm text-gray-500 font-medium">{city.createdAt}</td>
//                   <td className="px-6 py-4">
//                     <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
//                       <button className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors" title="View">
//                         <Eye size={18} />
//                       </button>
//                       <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
//                         <Edit size={18} />
//                       </button>
//                       <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
//                         <Trash2 size={18} />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//               {filteredCities.length === 0 && (
//                 <tr>
//                   <td colSpan="6" className="px-6 py-16 text-center">
//                     <div className="flex flex-col items-center justify-center">
//                       <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3">
//                         <Search size={24} className="text-gray-400" />
//                       </div>
//                       <h3 className="text-lg font-medium text-gray-900 mb-1">No cities found</h3>
//                       <p className="text-sm text-gray-500">We couldn't find anything matching "{searchTerm}"</p>
//                     </div>
//                   </td>
//                 </tr>
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
//                         <option value="" disabled>Select Country</option>
//                         <option value="Australia">Australia</option>
//                         <option value="India">India</option>
//                         <option value="Nepal">Nepal</option>
//                         <option value="USA">USA</option>
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








import React, { useState, useEffect } from 'react';

import { cityService } from '../../services/CityService'; 
import { Search, Plus, Eye, Edit, Trash2, X, MapPin, Calendar, Hash, Globe, Building2 } from 'lucide-react';

const CityMaster = () => {
 
  const [cities, setCities] = useState([]);
  const [loadingCities, setLoadingCities] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ country: '', name: '', code: '' });

  const [countryList, setCountryList] = useState([]);
  const [isLoadingCountries, setIsLoadingCountries] = useState(false);

  // 👉New: Fetch both cities and countries on page load
  useEffect(() => {
    fetchCities();
    fetchCountries();
  }, []);

  // 👉 New: Cities lane function from the backend
  const fetchCities = async () => {
    try {
      setLoadingCities(true);
      const response = await cityService.getAllCities();
      
     // Extract data as per the format (adjust as per your backend response format)
      const data = response.data?.data?.content || response.data?.data || response.data || [];
      setCities(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching cities from backend:", error);
    } finally {
      setLoadingCities(false);
    }
  };

  const fetchCountries = async () => {
    try {
      setIsLoadingCountries(true);
     // Simulated countries for now, you can replace this with countryservices in the future
      setTimeout(() => {
        const backendCountries = [
          { id: 1, name: "Australia" },
          { id: 2, name: "India" },
          { id: 3, name: "Nepal" },
          { id: 4, name: "USA" },
          { id: 5, name: "United Arab Emirates" },
          { id: 6, name: "Singapore" }
        ];
        setCountryList(backendCountries);
        setIsLoadingCountries(false);
      }, 500);
    } catch (error) {
      console.error("Error fetching countries:", error);
      setIsLoadingCountries(false);
    }
  };

  const filteredCities = cities.filter(city =>
    (city.name && city.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (city.country && city.country.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

 // 👉: Save City in Backend on Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Backend API call to create city
      await cityService.createCity(formData.country, formData.name, formData.code);
      
      setIsModalOpen(false);
      setFormData({ country: '', name: '', code: '' });
      
      // Save hone ke baad table refresh karein
      fetchCities(); 
    } catch (error) {
      console.error("Error creating city:", error);
      alert("Failed to save city to backend.");
    }
  };

  // 👉 NAYA: Delete Button ka logic (Kyunki service mein deleteCity bhi tha)
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this city?")) {
      try {
        await cityService.deleteCity(id);
        fetchCities(); // Delete hone ke baad table refresh karein
      } catch (error) {
        console.error("Error deleting city:", error);
        alert("Failed to delete city.");
      }
    }
  };

  return (
    <div className="p-4 sm:p-8 bg-[#f8fafc] min-h-screen font-sans">
      
      {/* --- Page Header --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
              <Building2 size={24} />
            </div>
            City Master
          </h1>
          <div className="text-sm text-gray-500 mt-2 font-medium flex items-center gap-2">
            <span className="text-blue-600 hover:text-blue-800 cursor-pointer transition-colors">Home</span> 
            <span className="text-gray-300">/</span> 
            <span className="text-blue-600 hover:text-blue-800 cursor-pointer transition-colors">Masters</span> 
            <span className="text-gray-300">/</span> 
            <span className="text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md">City</span>
          </div>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5"
        >
          <Plus size={18} strokeWidth={2.5} />
          Add New City
        </button>
      </div>

      {/* --- Main Card --- */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Filters Section */}
        <div className="p-5 border-b border-gray-100 bg-white flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="flex gap-4 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative w-full sm:w-80 group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                <Search size={18} />
              </div>
              <input
                type="text"
                placeholder="Search cities or countries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all duration-300 placeholder-gray-400 text-gray-700 font-medium"
              />
            </div>
            
            {/* Country Dropdown */}
            <div className="relative w-full sm:w-48">
              <select className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all duration-300 text-gray-700 font-medium appearance-none cursor-pointer">
                <option value="">All Countries</option>
                {countryList.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Globe size={18} />
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button onClick={fetchCities} className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
              Refresh
            </button>
            <div className="text-sm font-medium text-gray-500 border-l border-gray-200 pl-3">
              Showing <span className="text-gray-900">{filteredCities.length}</span> cities
            </div>
          </div>
        </div>

        {/* --- Table --- */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50/80 text-gray-500 text-xs uppercase tracking-wider font-bold border-b border-gray-100">
                <th className="px-6 py-4 rounded-tl-xl">
                  <div className="flex items-center gap-2"><Hash size={14}/> ID</div>
                </th>
                <th className="px-6 py-4">
                  <div className="flex items-center gap-2"><Globe size={14}/> Country</div>
                </th>
                <th className="px-6 py-4">
                  <div className="flex items-center gap-2"><MapPin size={14}/> City Name</div>
                </th>
                <th className="px-6 py-4">Airport Code</th>
                <th className="px-6 py-4">
                  <div className="flex items-center gap-2"><Calendar size={14}/> Created At</div>
                </th>
                <th className="px-6 py-4 text-center rounded-tr-xl">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              
              {/* 👉 NAYA: Loading State */}
              {loadingCities ? (
                <tr>
                  <td colSpan="6" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-3"></div>
                      <h3 className="text-sm font-bold text-gray-700">Loading Cities...</h3>
                    </div>
                  </td>
                </tr>
              ) : filteredCities.length === 0 ? (
                
                /* Empty State */
                <tr>
                  <td colSpan="6" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                        <Search size={24} className="text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">No cities found</h3>
                      <p className="text-sm text-gray-500">We couldn't find anything matching your search.</p>
                    </div>
                  </td>
                </tr>
              ) : (

                /* Real Data Mapping */
                filteredCities.map((city) => (
                  <tr key={city.id} className="hover:bg-blue-50/30 transition-colors duration-200 group">
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-md">#{city.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                          {(city.country || 'U').charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-gray-700">{city.country}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">{city.name}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200">
                        {city.code || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                      {city.createdAt ? new Date(city.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors" title="View">
                          <Eye size={18} />
                        </button>
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                          <Edit size={18} />
                        </button>
                        
                        {/* 👉 NAYA: Delete function binded here */}
                        <button 
                          onClick={() => handleDelete(city.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================== */}
      {/* PREMIUM POPUP MODAL                        */}
      {/* ========================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-300">
          
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] transform scale-100 transition-transform duration-300">
            
            {/* Modal Header with Gradient */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white relative">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
              <h2 className="text-xl font-bold mb-1">Create New City</h2>
              <p className="text-blue-100 text-sm font-medium">Add a new destination to your master list.</p>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto p-6 bg-gray-50/50">
              <form id="createCityForm" onSubmit={handleSubmit} className="space-y-5">
                
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select 
                        name="country" required value={formData.country} onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-gray-700 font-medium appearance-none transition-all"
                      >
                        <option value="" disabled>
                          {isLoadingCountries ? "Loading countries..." : "Select Country"}
                        </option>
                        {countryList.map((c) => (
                          <option key={c.id} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                      <Globe size={16} className="absolute left-3.5 top-3 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">
                      City Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input 
                        type="text" name="name" required value={formData.name} onChange={handleInputChange} placeholder="E.g. Sydney"
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-gray-900 font-medium transition-all placeholder-gray-400"
                      />
                      <MapPin size={16} className="absolute left-3.5 top-3 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">
                      Airport Code
                    </label>
                    <input 
                      type="text" name="code" value={formData.code} onChange={handleInputChange} placeholder="E.g. SYD" maxLength="3"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-gray-900 font-bold uppercase transition-all placeholder-gray-400"
                    />
                  </div>
                </div>

              </form>
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-gray-100 bg-white flex justify-end gap-3">
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                form="createCityForm"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-md shadow-blue-500/20 flex items-center gap-2"
              >
                Save City
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default CityMaster;