
// import React, { useState, useEffect } from 'react';
// import { leadService } from '../../services/leadService'; 
// import { 
//   Users, Trophy, PieChart, TrendingUp, Search, Flame, Snowflake, 
//   DownloadCloud, FileText, Plus, ChevronUp, ChevronRight, ChevronLeft,
//   Inbox, User, ArrowUpRight, ArrowUpDown, ArrowUp, ArrowDown, Calendar, ChevronDown
// } from 'lucide-react';
// import { Link } from 'react-router-dom';

// const Leads = () => {
 
//   const [leads, setLeads] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // States for Filters & Sorting
//   const [searchTerm, setSearchTerm] = useState('');
//   const [sortOrder, setSortOrder] = useState('desc'); 
//   const [dateFilter, setDateFilter] = useState('all'); 
//   const [startDate, setStartDate] = useState('');
//   const [endDate, setEndDate] = useState('');

//   useEffect(() => {
//     fetchLeads();
//   }, []);

//   const fetchLeads = async () => {
//     try {
//       setLoading(true);
//       const response = await leadService.getAllLeads(); 
      
//       // 👉 SMART EXTRACTION: Backend chahe jaise bhi data bheje, hum use pakad lenge
//       let fetchedData = [];
//       if (response.data) {
//         if (Array.isArray(response.data.data)) {
//           fetchedData = response.data.data;
//         } else if (response.data.data && Array.isArray(response.data.data.content)) {
//           fetchedData = response.data.data.content;
//         } else if (Array.isArray(response.data.content)) {
//           fetchedData = response.data.content;
//         } else if (Array.isArray(response.data)) {
//           fetchedData = response.data;
//         }
//       }
      
//       console.log("Total leads loaded from API:", fetchedData.length);
//       setLeads(fetchedData);

//     } catch (error) {
//       console.error("Error fetching leads:", error);
//       setLeads([]); 
//     } finally {
//       setLoading(false);
//     }
//   };

//   const toggleDateSort = () => {
//     setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
//   };

//   const safeLeads = Array.isArray(leads) ? leads : [];

//   // 👉 UPDATED FILTER: Ab koi naya lead hide nahi hoga
//   const filteredLeads = safeLeads.filter(lead => {
    
//     // 1. Search Condition (Agar search bar empty hai, toh sab pass hain)
//     const searchLower = searchTerm.trim().toLowerCase();
//     const matchesSearch = searchLower === '' || 
//       (lead.customerName && lead.customerName.toLowerCase().includes(searchLower)) ||
//       (lead.email && lead.email.toLowerCase().includes(searchLower)) ||
//       (lead.phone && lead.phone.includes(searchLower)) ||
//       (lead.id && lead.id.toString().includes(searchLower));

//     // 2. Date Condition (Agar Date filter 'all' hai, toh aage check mat karo)
//     let matchesDate = true;
    
//     if (dateFilter !== 'all' && lead.createdAt) {
//       const leadDate = new Date(lead.createdAt);
//       leadDate.setHours(0, 0, 0, 0); 

//       const today = new Date();
//       today.setHours(0, 0, 0, 0);

//       const yesterday = new Date(today);
//       yesterday.setDate(yesterday.getDate() - 1);

//       const sevenDaysAgo = new Date(today);
//       sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

//       if (dateFilter === 'today') {
//         matchesDate = leadDate.getTime() === today.getTime();
//       } else if (dateFilter === 'yesterday') {
//         matchesDate = leadDate.getTime() === yesterday.getTime();
//       } else if (dateFilter === 'last_7_days') {
//         matchesDate = leadDate >= sevenDaysAgo && leadDate <= today;
//       } else if (dateFilter === 'custom' && startDate && endDate) {
//         const start = new Date(startDate);
//         const end = new Date(endDate);
//         end.setHours(23, 59, 59, 999); 
//         matchesDate = leadDate >= start && leadDate <= end;
//       }
//     }

//     // Lead tabhi dikhega jab dono search aur date conditions match hongi
//     return matchesSearch && matchesDate;
//   });

//   const sortedLeads = [...filteredLeads].sort((a, b) => {
//     if (!a.createdAt || !b.createdAt) return 0;
//     const dateA = new Date(a.createdAt);
//     const dateB = new Date(b.createdAt);
//     return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
//   });

//   const renderSortIcon = () => {
//     if (sortOrder === 'asc') return <ArrowUp size={14} className="text-blue-600" />;
//     if (sortOrder === 'desc') return <ArrowDown size={14} className="text-blue-600" />;
//     return <ArrowUpDown size={14} className="text-slate-400" />;
//   };

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] font-sans p-4 sm:p-6 lg:p-8">
      
//       {/* --- Page Header & Breadcrumb --- */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
//         <div>
//           <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
//             <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-sm shadow-blue-600/20">
//               <Users size={22} strokeWidth={2.5} />
//             </div>
//             Leads Management
//           </h1>
//           <div className="text-sm text-slate-500 mt-2 font-medium flex items-center gap-2">
//             <span className="text-blue-600 hover:text-blue-800 cursor-pointer transition-colors">Home</span> 
//             <span className="text-slate-300">/</span> 
//             <span className="text-slate-700 bg-white border border-slate-200 px-2.5 py-0.5 rounded-md shadow-sm">Leads</span>
//           </div>
//         </div>

//         <Link 
//           to="/CreateLead" 
//           className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//         >
//           <Plus size={18} strokeWidth={2.5} /> 
//           Create Lead
//         </Link>
//       </div>

//       {/* --- Main Content Container --- */}
//       <div className="space-y-6">

//         {/* --- Analytics Section --- */}
//         <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
//           <div className="p-4 border-b border-slate-100 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors">
//             <div className="flex items-center gap-2 text-slate-800 font-bold text-sm uppercase tracking-wider">
//               <TrendingUp size={18} className="text-blue-600" /> Analytics Overview
//             </div>
//             <ChevronUp size={20} className="text-slate-400" />
//           </div>
          
//           <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 bg-slate-50/50">
//             <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-blue-200 hover:shadow-md transition-all">
//               <div>
//                 <div className="text-sm font-semibold text-slate-500 mb-1">Total Leads</div>
//                 <div className="text-3xl font-black text-slate-900 flex items-baseline gap-2">
//                   {safeLeads.length} <span className="text-xs font-bold text-emerald-500 flex items-center"><ArrowUpRight size={14}/> 0%</span>
//                 </div>
//               </div>
//               <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
//                 <Users size={24} strokeWidth={2} />
//               </div>
//             </div>

//             <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-emerald-200 hover:shadow-md transition-all">
//               <div>
//                 <div className="text-sm font-semibold text-slate-500 mb-1">Bookings</div>
//                 <div className="text-3xl font-black text-slate-900 flex items-baseline gap-2">
//                   0 <span className="text-xs font-bold text-slate-400 flex items-center">-</span>
//                 </div>
//               </div>
//               <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
//                 <Trophy size={24} strokeWidth={2} />
//               </div>
//             </div>

//             <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-amber-200 hover:shadow-md transition-all">
//               <div>
//                 <div className="text-sm font-semibold text-slate-500 mb-1">Conversion</div>
//                 <div className="text-3xl font-black text-slate-900">0%</div>
//               </div>
//               <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
//                 <PieChart size={24} strokeWidth={2} />
//               </div>
//             </div>

//             <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-purple-200 hover:shadow-md transition-all">
//               <div>
//                 <div className="text-sm font-semibold text-slate-500 mb-1">Win Rate</div>
//                 <div className="text-3xl font-black text-slate-900">0%</div>
//               </div>
//               <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
//                 <TrendingUp size={24} strokeWidth={2} />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* --- Leads Directory Section --- */}
//         <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          
//           <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-5 border-b border-slate-100 gap-4">
//             <h2 className="text-lg font-bold text-slate-900">Leads Directory</h2>
//             <div className="flex flex-wrap gap-3">
//               <button onClick={fetchLeads} className="bg-white hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors border border-slate-200 shadow-sm">
//                 <DownloadCloud size={16} className="text-slate-500" /> Refresh Data
//               </button>
//               <button className="bg-white hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors border border-slate-200 shadow-sm">
//                 <FileText size={16} className="text-slate-500" /> Logs
//               </button>
//             </div>
//           </div>

//           {/* --- Filters Bar --- */}
//           <div className="p-5 border-b border-slate-100 flex flex-wrap gap-4 items-center bg-slate-50/50">
            
//             {/* Search Input */}
//             <div className="relative flex-1 min-w-[250px] max-w-sm group">
//               <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
//                 <Search size={18} />
//               </div>
//               <input 
//                 type="text" 
//                 placeholder="Search leads by name, email, or ID..." 
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 placeholder-slate-400 text-slate-900 font-medium shadow-sm" 
//               />
//             </div>
            
//             {/* Date Dropdown */}
//             <div className="relative min-w-[160px]">
//               <select 
//                 value={dateFilter}
//                 onChange={(e) => setDateFilter(e.target.value)}
//                 className="w-full pl-10 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 font-medium appearance-none cursor-pointer shadow-sm transition-all"
//               >
//                 <option value="all">All Time</option>
//                 <option value="today">Today</option>
//                 <option value="yesterday">Yesterday</option>
//                 <option value="last_7_days">Last 7 Days</option>
//                 <option value="custom">Custom Date</option>
//               </select>
//               <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
//                 <Calendar size={18} />
//               </div>
//               <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
//                 <ChevronDown size={14} />
//               </div>
//             </div>

//             {/* Custom Date Pickers (Conditional) */}
//             {dateFilter === 'custom' && (
//               <div className="flex items-center gap-2 animate-in fade-in zoom-in duration-200">
//                 <input 
//                   type="date" 
//                   value={startDate}
//                   onChange={(e) => setStartDate(e.target.value)}
//                   className="px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-sm"
//                 />
//                 <span className="text-slate-400 text-sm font-medium">to</span>
//                 <input 
//                   type="date" 
//                   value={endDate}
//                   onChange={(e) => setEndDate(e.target.value)}
//                   className="px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-sm"
//                 />
//               </div>
//             )}
            
//             {/* User Dropdown */}
//             <div className="relative min-w-[150px]"> 
//               <select className="w-full pl-10 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 font-medium appearance-none cursor-pointer shadow-sm transition-all">
//                 <option>All Assignees</option>
//               </select>
//               <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
//                 <User size={18} />
//               </div>
//               <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
//                 <ChevronDown size={14} />
//               </div>
//             </div>
            
//           </div>

//           {/* Status Tabs */}
//           <div className="px-5 py-4 border-b border-slate-100 overflow-x-auto">
//             <div className="flex gap-2 min-w-max">
//               <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-sm">
//                 All <span className="bg-slate-700 px-2 py-0.5 rounded-md text-xs">{sortedLeads.length}</span>
//               </button>
//               <button className="bg-white text-slate-600 border border-slate-200 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-slate-50 hover:text-slate-900 transition-colors">
//                 <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></div> Fresh
//               </button>
//               <button className="bg-white text-slate-600 border border-slate-200 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-slate-50 hover:text-slate-900 transition-colors">
//                 New Lead <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md text-xs font-black">0</span>
//               </button>
//               <button className="bg-white text-slate-600 border border-slate-200 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-slate-50 hover:text-slate-900 transition-colors">
//                 Contacted <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md text-xs font-black">0</span>
//               </button>
//             </div>
//           </div>

//           {/* Custom Scroll Controls */}
//           <div className="px-5 py-2.5 flex justify-between items-center text-slate-400 bg-slate-50 border-b border-slate-100">
//             <ChevronLeft size={18} className="cursor-pointer hover:text-blue-600 transition-colors" />
//             <div className="flex-1 border-b-[4px] border-slate-200 mx-4 rounded-full relative">
//               <div className="absolute left-0 top-[-4px] bottom-[-4px] w-1/3 bg-blue-300 rounded-full"></div>
//             </div>
//             <ChevronRight size={18} className="cursor-pointer hover:text-blue-600 transition-colors" />
//           </div>

//           {/* --- Data Table --- */}
//           <div className="overflow-x-auto">
//             <table className="w-full min-w-[1400px] border-collapse text-sm whitespace-nowrap">
//               <thead>
//                 <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold border-b border-slate-200">
//                   <th className="px-4 py-4 w-12 text-center rounded-tl-2xl">
//                     <input type="checkbox" className="rounded border-slate-300 w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer" />
//                   </th>
//                   <th className="px-4 py-4 text-left">LEAD ID</th>
//                   <th className="px-4 py-4 text-left">LEAD INFO</th>
//                   <th className="px-4 py-4 text-center">DESTINATION</th>
//                   <th className="px-4 py-4 text-left">TRAVELERS</th>
//                   <th className="px-4 py-4 text-left w-64">SERVICES</th>
//                   <th className="px-4 py-4 text-center">QUOTATION</th>
//                   <th className="px-4 py-4 text-left">BOOKING</th>
//                   <th className="px-4 py-4 text-center">WEBLINK</th>
//                   <th className="px-4 py-4 text-center">LOGGING</th>
//                   <th className="px-4 py-4 text-left">ASSIGNED TO</th>
//                   <th className="px-4 py-4 text-left">AMOUNT</th>
//                   <th className="px-4 py-4 text-left">MARGIN</th>
//                   <th className="px-4 py-4 text-left">TYPE</th>
//                   <th className="px-4 py-4 text-left">STAGE</th>
//                   <th 
//                     onClick={toggleDateSort}
//                     className="px-4 py-4 text-left cursor-pointer hover:bg-slate-100 hover:text-blue-600 select-none transition-colors"
//                   >
//                     <div className="flex items-center gap-1.5">
//                       CREATED {renderSortIcon()}
//                     </div>
//                   </th>
//                   <th className="px-4 py-4 rounded-tr-2xl text-center">ACTIONS</th>
//                 </tr>
//               </thead>
              
//               <tbody className="divide-y divide-slate-100 bg-white">
                
//                 {/* Loading State UI */}
//                 {loading ? (
//                   <tr>
//                     <td colSpan="17" className="px-6 py-24 text-center">
//                       <div className="flex flex-col items-center justify-center">
//                         <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
//                         <h3 className="text-lg font-bold text-slate-900">Loading Leads...</h3>
//                         <p className="text-sm text-slate-500">Fetching data from server</p>
//                       </div>
//                     </td>
//                   </tr>
//                 ) : sortedLeads.length === 0 ? (
                  
//                   /* Empty State */
//                   <tr>
//                     <td colSpan="17" className="px-6 py-24 text-center">
//                       <div className="flex flex-col items-center justify-center">
//                         <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mb-5 shadow-sm transform -rotate-3">
//                           <Inbox size={32} className="text-slate-400" />
//                         </div>
//                         <h3 className="text-lg font-bold text-slate-900 mb-2">No Leads Found</h3>
//                         <p className="text-sm font-medium text-slate-500 max-w-sm mx-auto mb-6 leading-relaxed">
//                           We couldn't find any leads matching your selected date and search criteria.
//                         </p>
//                         <button 
//                           onClick={() => { setDateFilter('all'); setSearchTerm(''); }}
//                           className="text-blue-600 hover:text-blue-700 font-bold text-sm"
//                         >
//                           Clear Filters
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ) : (
                  
//                   /* Real JSON Data Mapping */
//                   sortedLeads.map((lead) => (
//                     <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors">
//                       <td className="px-4 py-4 text-center">
//                         <input type="checkbox" className="rounded border-slate-300 w-4 h-4 text-blue-600" />
//                       </td>
//                       <td className="px-4 py-4 font-semibold text-slate-700">#{lead.id}</td>
//                       <td className="px-4 py-4">
//                         <div className="font-bold text-slate-900 capitalize">{lead.customerName || 'N/A'}</div>
//                         <div className="text-xs text-slate-500 mt-0.5">{lead.email || 'No email'}</div>
//                         <div className="text-xs text-slate-500">{lead.phone || 'No phone'}</div>
//                       </td>
//                       <td className="px-4 py-4 text-center font-medium text-slate-700">
//                         {lead.itinerary && lead.itinerary.length > 0 ? (
//                           <div className="flex flex-col gap-1 items-center">
//                             {lead.itinerary.map((item, idx) => (
//                               <span key={idx} className="bg-slate-100 px-2 py-1 rounded text-xs">
//                                 {item.destination} ({item.nights}N)
//                               </span>
//                             ))}
//                           </div>
//                         ) : (
//                           <span className="text-slate-400">N/A</span>
//                         )}
//                       </td>
//                       <td className="px-4 py-4 text-slate-600 font-medium">
//                         <div className="flex flex-col">
//                           <span>{lead.adults || 0} Adults</span>
//                           {(lead.children > 0 || lead.infants > 0) && (
//                             <span className="text-xs text-slate-400">
//                               {lead.children || 0} Child, {lead.infants || 0} Infant
//                             </span>
//                           )}
//                         </div>
//                       </td>
//                       <td className="px-4 py-4">
//                         <div className="flex flex-wrap gap-1.5 w-64">
//                           {lead.services && lead.services.map((service, idx) => (
//                             <span key={idx} className="bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider">
//                               {service}
//                             </span>
//                           ))}
//                         </div>
//                       </td>
//                       <td className="px-4 py-4 text-center">—</td>
//                       <td className="px-4 py-4">—</td>
//                       <td className="px-4 py-4 text-center">—</td>
//                       <td className="px-4 py-4 text-center">—</td>
//                       <td className="px-4 py-4 text-slate-700 font-bold">
//                         <div className="flex items-center gap-2">
//                           <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs">
//                             {(lead.assignTo || 'U').charAt(0)}
//                           </div>
//                           {lead.assignTo || 'Unassigned'}
//                         </div>
//                       </td>
//                       <td className="px-4 py-4 font-bold text-slate-900">N/A</td>
//                       <td className="px-4 py-4 text-slate-500">—</td>
//                       <td className="px-4 py-4">
//                         <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md text-xs font-bold border border-slate-200">
//                           {lead.leadType || 'N/A'}
//                         </span>
//                       </td>
//                       <td className="px-4 py-4">
//                         <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md text-xs font-bold border border-emerald-100">
//                           {lead.leadStage || 'N/A'}
//                         </span>
//                       </td>
//                       <td className="px-4 py-4 text-slate-500 font-medium">
//                         {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString('en-US', { 
//                           month: 'short', day: 'numeric', year: 'numeric',
//                           hour: '2-digit', minute: '2-digit' 
//                         }) : 'N/A'}
//                       </td>
//                       <td className="px-4 py-4 text-center text-slate-400">—</td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
          
//         </div>
//       </div>
//     </div>
//   );
// };
















import React, { useState, useEffect, memo, useMemo } from 'react';
import { leadService } from '../../services/leadService';
import {
  Users, Trophy, PieChart, TrendingUp, Search,
  DownloadCloud, FileText, Plus,
  Inbox, User, ArrowUp, ArrowDown, Calendar, ChevronDown,
  Eye, Pencil, Trash2, X, Mail, Phone, MapPin, Briefcase, CheckCircle, XCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

/* ─── PAGINATION ─────────────────────────────────────── */
function buildPageNumbers(totalPages, pageIndex) {
  if (totalPages <= 0) return [];
  return Array.from({ length: totalPages }, (_, i) => i)
    .filter(p => p === 0 || p === totalPages - 1 || Math.abs(p - pageIndex) <= 1)
    .reduce((acc, p, i, arr) => {
      if (i > 0 && p - arr[i - 1] > 1) acc.push('…');
      acc.push(p);
      return acc;
    }, []);
}

const NavButton = memo(function NavButton({ label, onClick, disabled }) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-500 text-xs font-bold
        hover:border-blue-300 hover:text-blue-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {label}
    </button>
  );
});

const PageButton = memo(function PageButton({ page, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-8 h-8 rounded-lg text-xs font-bold transition-all border ${
        isActive
          ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
          : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600'
      }`}
    >
      {page + 1}
    </button>
  );
});

function CommonPagination({ pageIndex, pageSize, totalElements, totalPages, goToPage, changePageSize }) {
  const from = totalElements === 0 ? 0 : pageIndex * pageSize + 1;
  const to   = Math.min((pageIndex + 1) * pageSize, totalElements);

  const pageNumbers = useMemo(
    () => buildPageNumbers(totalPages, pageIndex),
    [totalPages, pageIndex]
  );

  if (totalElements === 0) return null;

  const isFirst = pageIndex === 0;
  const isLast  = pageIndex >= totalPages - 1;

  return (
    <div className="px-5 py-4 border-t border-slate-100 bg-slate-50/60 flex flex-col sm:flex-row items-center justify-between gap-3">
      <p className="text-xs text-slate-400 font-medium">
        Showing <span className="font-bold text-slate-600">{from}</span>–<span className="font-bold text-slate-600">{to}</span> of <span className="font-bold text-slate-600">{totalElements}</span>
      </p>
      <div className="flex items-center gap-1.5 flex-wrap justify-center">
        <NavButton label="«" onClick={() => goToPage(0)}             disabled={isFirst} />
        <NavButton label="‹" onClick={() => goToPage(pageIndex - 1)} disabled={isFirst} />
        {pageNumbers.map((p, i) =>
          typeof p === 'string'
            ? <span key={`e${i}`} className="w-8 h-8 flex items-center justify-center text-xs text-slate-400">…</span>
            : <PageButton key={p} page={p} isActive={pageIndex === p} onClick={() => goToPage(p)} />
        )}
        <NavButton label="›" onClick={() => goToPage(pageIndex + 1)} disabled={isLast} />
        <NavButton label="»" onClick={() => goToPage(totalPages - 1)} disabled={isLast} />
        <select
          value={pageSize}
          onChange={e => changePageSize(Number(e.target.value))}
          className="ml-2 h-8 px-2 rounded-lg border border-slate-200 text-xs text-slate-600 font-medium bg-white focus:border-blue-400 outline-none cursor-pointer"
        >
          {[10, 25, 50, 100].map(s => <option key={s} value={s}>{s} / page</option>)}
        </select>
      </div>
    </div>
  );
}

/* ─── STAT CARD ──────────────────────────────────────── */
function StatCard({ icon: Icon, label, value, suffix = '', gradient, sub, delay = 0 }) {
  const [displayed, setDisplayed] = useState(0);
  useEffect(() => {
    let start = 0;
    const target = typeof value === 'number' ? value : 0;
    if (target === 0) { setDisplayed(0); return; }
    const step = Math.ceil(target / 60);
    const interval = setInterval(() => {
      start = Math.min(start + step, target);
      setDisplayed(start);
      if (start >= target) clearInterval(interval);
    }, 16);
    return () => clearInterval(interval);
  }, [value]);

  return (
    <div
      className={`bg-gradient-to-br ${gradient} rounded-2xl p-5 text-white shadow-lg relative overflow-hidden group
        hover:-translate-y-1 hover:shadow-xl transition-all duration-300 cursor-pointer fade-up`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="absolute -right-5 -top-5 w-24 h-24 rounded-full bg-white/10 group-hover:scale-110 transition-transform duration-300" />
      <div className="absolute -right-3 -bottom-8 w-32 h-32 rounded-full bg-white/10 group-hover:scale-110 transition-transform duration-300" />
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 group-hover:bg-white/30 flex items-center justify-center transition-all">
            <Icon size={20} strokeWidth={2.2} />
          </div>
          {sub && <span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded-full">{sub}</span>}
        </div>
        <p className="text-2xl sm:text-3xl font-extrabold leading-none mb-1">
          {displayed.toLocaleString('en-IN')}{suffix}
        </p>
        <p className="text-xs font-bold uppercase tracking-widest opacity-80">{label}</p>
      </div>
    </div>
  );
}

/* ─── SKELETON ROW ───────────────────────────────────── */
function SkeletonRow() {
  return (
    <tr>
      {[...Array(17)].map((_, i) => (
        <td key={i} className="px-4 py-4">
          <div className="h-4 rounded-lg bg-slate-200 animate-pulse" style={{ width: `${40 + Math.random() * 50}%` }} />
        </td>
      ))}
    </tr>
  );
}

/* ─── TOAST ──────────────────────────────────────────── */
function Toast({ msg, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  return (
    <div
      className={`fixed top-5 right-5 z-[999] flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl max-w-xs
        ${type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}
      style={{ animation: 'slideIn .3s ease both' }}
    >
      {type === 'success' ? <CheckCircle size={18} className="text-green-600" /> : <XCircle size={18} className="text-red-600" />}
      <p className="text-sm font-semibold flex-1">{msg}</p>
      <button onClick={onClose} className="opacity-50 hover:opacity-100 ml-1"><X size={16} /></button>
    </div>
  );
}

/* ─── VIEW LEAD MODAL ────────────────────────────────── */
function ViewLeadModal({ lead, onClose, onEdit }) {
  if (!lead) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto z-10">
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-5 rounded-t-2xl">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xl font-extrabold shadow-lg flex-shrink-0">
                {(lead.customerName || 'U').charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-white text-xl font-extrabold capitalize">{lead.customerName || 'N/A'}</h2>
                <p className="text-slate-400 text-sm font-medium">Lead #{lead.id}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full border border-slate-300 bg-slate-100 text-slate-700">{lead.leadType || 'N/A'}</span>
                  <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />{lead.leadStage || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all flex-shrink-0">
              <X size={16} />
            </button>
          </div>
        </div>
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              [Phone,    'Phone',      lead.phone,   'bg-green-50 text-green-600'],
              [Mail,     'Email',      lead.email,   'bg-blue-50 text-blue-600'],
              [Users,    'Travelers',  `${lead.adults || 0} Adults, ${lead.children || 0} Child, ${lead.infants || 0} Infant`, 'bg-purple-50 text-purple-600'],
              [User,     'Assigned To', lead.assignedUser?.fullName || lead.assignedUser?.name || lead.assignedUser?.username || lead.assignedUserName || lead.assignTo || 'Unassigned', 'bg-orange-50 text-orange-600'],
              [Calendar, 'Created',   lead.createdAt ? new Date(lead.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—', 'bg-teal-50 text-teal-600'],
              [Briefcase,'Lead Type',  lead.leadType, 'bg-indigo-50 text-indigo-600'],
            ].map(([Icon, label, val, ic]) => (
              <div key={label} className="flex items-center gap-3 bg-slate-50 rounded-xl p-3 border border-slate-100">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${ic}`}><Icon size={14} /></div>
                <div className="min-w-0">
                  <p className="text-xs text-slate-400 font-medium">{label}</p>
                  <p className="text-sm font-bold text-slate-700 truncate">{val || '—'}</p>
                </div>
              </div>
            ))}
          </div>
          {lead.itinerary && lead.itinerary.length > 0 && (
            <div>
              <p className="text-sm font-extrabold text-slate-700 mb-3 flex items-center gap-2"><MapPin size={14} className="text-blue-500" /> Destination & Itinerary</p>
              <div className="flex flex-wrap gap-2">
                {lead.itinerary.map((item, i) => (
                  <span key={i} className="bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl text-sm font-semibold text-slate-700">
                    {item.destination} <span className="text-blue-600 font-extrabold">({item.nights}N)</span>
                  </span>
                ))}
              </div>
            </div>
          )}
          {lead.services && lead.services.length > 0 && (
            <div>
              <p className="text-sm font-extrabold text-slate-700 mb-3">Services</p>
              <div className="flex flex-wrap gap-1.5">
                {lead.services.map((service, i) => (
                  <span key={i} className="bg-blue-50 text-blue-700 border border-blue-100 px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider">{service}</span>
                ))}
              </div>
            </div>
          )}
          <div className="flex flex-wrap gap-2 pt-1">
            <button onClick={() => onEdit(lead)} className="flex-1 min-w-[100px] py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold flex items-center justify-center gap-2 transition-all">
              <Pencil size={14} /> Edit
            </button>
            <button onClick={onClose} className="flex-1 min-w-[100px] py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-bold flex items-center justify-center gap-2 transition-all border border-slate-200">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── EDIT LEAD MODAL ────────────────────────────────── */
function EditLeadModal({ lead, onClose, onSave }) {
  const initialAssignName = 
    lead?.assignedUser?.fullName || 
    lead?.assignedUser?.name || 
    lead?.assignedUserName || 
    lead?.assignTo || 
    'Unassigned';

  const [form, setForm] = useState({
    customerName: lead?.customerName || '',
    email:        lead?.email        || '',
    phone:        lead?.phone        || '',
    adults:       lead?.adults       || 0,
    children:     lead?.children     || 0,
    infants:      lead?.infants      || 0,
    assignTo:     initialAssignName, 
    leadType:     lead?.leadType     || '',
    leadStage:    lead?.leadStage    || '',
  });

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const fields = [
    { key: 'customerName', label: 'Customer Name', type: 'text',   placeholder: 'Enter customer name',  span: true },
    { key: 'email',        label: 'Email Address', type: 'email',  placeholder: 'customer@email.com',   span: true },
    { key: 'phone',        label: 'Phone Number',  type: 'tel',    placeholder: '+91 98765 43210' },
    { key: 'assignTo',     label: 'Assigned To',   type: 'text',   placeholder: 'Agent name' }, 
    { key: 'adults',       label: 'Adults',        type: 'number' },
    { key: 'children',     label: 'Children',      type: 'number' },
    { key: 'infants',      label: 'Infants',       type: 'number' },
    { key: 'leadType',     label: 'Lead Type',     type: 'text',   placeholder: 'e.g. Hot / Cold' },
    { key: 'leadStage',    label: 'Lead Stage',    type: 'text',   placeholder: 'e.g. New Lead' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto z-10">
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 px-6 py-5 rounded-t-2xl flex items-center justify-between">
          <div>
            <h2 className="text-white font-extrabold text-lg">Edit Lead #{lead?.id}</h2>
            <p className="text-white/70 text-xs mt-0.5">Update lead information below</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all"><X size={16} /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fields.map(f => (
              <div key={f.key} className={f.span ? 'sm:col-span-2' : ''}>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">{f.label}</label>
                <input
                  type={f.type}
                  value={form[f.key]}
                  min={f.type === 'number' ? 0 : undefined}
                  disabled={f.key === 'assignTo'} 
                  onChange={e => set(f.key, f.type === 'number' ? Number(e.target.value) : e.target.value)}
                  placeholder={f.placeholder}
                  className={`w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-50 outline-none transition-all ${
                    f.key === 'assignTo' ? 'bg-slate-100 cursor-not-allowed opacity-80' : 'bg-white'
                  }`}
                />
              </div>
            ))}
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border-2 border-slate-200 hover:border-slate-300 text-slate-600 font-bold text-sm transition-all bg-white hover:bg-slate-50">Cancel</button>
            <button onClick={() => onSave(form)} className="flex-1 py-2.5 rounded-xl text-white font-bold text-sm transition-all shadow-md bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200">Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── DELETE CONFIRM ─────────────────────────────────── */
function DeleteConfirm({ lead, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm z-10 p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4"><Trash2 size={26} className="text-red-500" /></div>
        <h3 className="text-lg font-extrabold text-slate-800 mb-1">Delete Lead?</h3>
        <p className="text-sm text-slate-500 mb-5">
          Are you sure you want to delete lead <span className="font-bold text-slate-700">#{lead?.id} ({lead?.customerName || 'N/A'})</span>? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose}   className="flex-1 py-2.5 rounded-xl border-2 border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all">Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md shadow-red-200 transition-all">Yes, Delete</button>
        </div>
      </div>
    </div>
  );
}

/* ─── MAIN COMPONENT ─────────────────────────────────── */
const Leads = () => {
  const [leads,   setLeads]   = useState([]);
  const [loading, setLoading] = useState(true);

  // ── Pagination state ──────────────────────────────────
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize,  setPageSize]  = useState(10);
  const [activeTab, setActiveTab] = useState('All');

  // ── Filter & sort state ───────────────────────────────
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder,  setSortOrder]  = useState('desc');
  const [dateFilter, setDateFilter] = useState('all');
  const [startDate,  setStartDate]  = useState('');
  const [endDate,    setEndDate]    = useState('');

  // ── Modal & toast state ───────────────────────────────
  const [viewLead,     setViewLead]     = useState(null);
  const [editLead,     setEditLead]     = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast,        setToast]        = useState(null);

  const showToast = (msg, type = 'success') => setToast({ msg, type });

  // ── Fetch ─────────────────────────────────────────────
  useEffect(() => { fetchLeads(); }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const response = await leadService.getAllLeads();
      let data = [];
      if (response.data) {
        if      (Array.isArray(response.data.data))                            data = response.data.data;
        else if (response.data.data && Array.isArray(response.data.data.content)) data = response.data.data.content;
        else if (Array.isArray(response.data.content))                         data = response.data.content;
        else if (Array.isArray(response.data))                                 data = response.data;
      }
      setLeads(data);
    } catch (err) {
      console.error('Error fetching leads:', err);
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  // ── Update ────────────────────────────────────────────
  const handleUpdateSubmit = async (updatedFormData) => {
    try {
      const safeAssignedUserId = 
        editLead.assignedUserId || 
        editLead.assignedUser?.publicId || 
        editLead.assignedUser?.id || 
        null;

      const completePayload = { 
        ...editLead, 
        assignedUserId: safeAssignedUserId, 
        ...updatedFormData 
      };

      await leadService.updateLead(
        editLead.publicId || editLead.id,
        completePayload,
        editLead.services  || [],
        editLead.itinerary || []
      );
      
      setLeads(prev => prev.map(l => l.id === editLead.id ? { ...l, ...updatedFormData } : l));
      showToast('Lead updated successfully!');
      setEditLead(null);
    } catch (err) {
      console.error('Failed to update lead:', err);
      showToast('Error updating lead. Please try again.', 'error');
    }
  };

  // ── Quick Update Stage via Dropdown ───────────────────
  const handleStageChange = async (leadToUpdate, newStage) => {
    try {
      const safeAssignedUserId = 
        leadToUpdate.assignedUserId || 
        leadToUpdate.assignedUser?.publicId || 
        leadToUpdate.assignedUser?.id || 
        null;

      const completePayload = { 
        ...leadToUpdate, 
        leadStage: newStage, 
        assignedUserId: safeAssignedUserId 
      };

      await leadService.updateLead(
        leadToUpdate.publicId || leadToUpdate.id,
        completePayload,
        leadToUpdate.services  || [],
        leadToUpdate.itinerary || []
      );
      
      setLeads(prev => prev.map(l => l.id === leadToUpdate.id ? { ...l, leadStage: newStage } : l));
      showToast(`Lead #${leadToUpdate.id} marked as ${newStage}!`);
    } catch (err) {
      console.error('Failed to update stage:', err);
      showToast('Error updating lead stage. Please try again.', 'error');
    }
  };

  // ── Delete ────────────────────────────────────────────
  const handleDelete = async () => {
    try {
      if (typeof leadService.deleteLead === 'function') {
        await leadService.deleteLead(deleteTarget.publicId || deleteTarget.id);
      }
      setLeads(prev => prev.filter(l => l.id !== deleteTarget.id));
      showToast(`Lead #${deleteTarget.id} has been deleted.`);
      setDeleteTarget(null);
    } catch (err) {
      console.error('Error deleting lead:', err);
      showToast('Failed to delete lead. Please try again.', 'error');
    }
  };

  const toggleDateSort = () => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');

  const safeLeads = Array.isArray(leads) ? leads : [];

  // ── Filter ────────────────────────────────────────────
  const filteredLeads = useMemo(() => {
    return safeLeads.filter(lead => {
      const q = searchTerm.trim().toLowerCase();
      const matchesSearch = q === '' ||
        lead.customerName?.toLowerCase().includes(q) ||
        lead.email?.toLowerCase().includes(q) ||
        lead.phone?.includes(q) ||
        lead.id?.toString().includes(q);

      let matchesDate = true;
      if (dateFilter !== 'all' && lead.createdAt) {
        const ld    = new Date(lead.createdAt); ld.setHours(0,0,0,0);
        const today = new Date();               today.setHours(0,0,0,0);
        const yest  = new Date(today);          yest.setDate(today.getDate() - 1);
        const week  = new Date(today);          week.setDate(today.getDate() - 7);

        if      (dateFilter === 'today')     matchesDate = ld.getTime() === today.getTime();
        else if (dateFilter === 'yesterday') matchesDate = ld.getTime() === yest.getTime();
        else if (dateFilter === 'last_7_days') matchesDate = ld >= week && ld <= today;
        else if (dateFilter === 'custom' && startDate && endDate) {
          const s = new Date(startDate);
          const e = new Date(endDate); e.setHours(23,59,59,999);
          matchesDate = ld >= s && ld <= e;
        }
      }

      let matchesTab = true;
      if (activeTab === 'Fresh') {
        matchesTab = lead.leadType === 'Fresh Lead';
      } else if (activeTab !== 'All') {
        matchesTab = lead.leadStage === activeTab;
      }

      return matchesSearch && matchesDate && matchesTab;
    });
  }, [safeLeads, searchTerm, dateFilter, startDate, endDate, activeTab]);

  // ── Sort ──────────────────────────────────────────────
  const sortedLeads = useMemo(() => {
    return [...filteredLeads].sort((a, b) => {
      if (!a.createdAt || !b.createdAt) return 0;
      return sortOrder === 'asc'
        ? new Date(a.createdAt) - new Date(b.createdAt)
        : new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [filteredLeads, sortOrder]);

  // ── Pagination derived values ─────────────────────────
  const totalElements = sortedLeads.length;
  const totalPages    = Math.max(1, Math.ceil(totalElements / pageSize));

  // Reset page to 0 when filters or pageSize change
  useEffect(() => {
    setPageIndex(0);
  }, [searchTerm, dateFilter, startDate, endDate, pageSize, activeTab]);

  // Clamp so pageIndex never goes out of range
  const safePageIndex = Math.min(pageIndex, totalPages - 1);

  // Current page slice
  const currentLeads = useMemo(() => {
    const start = safePageIndex * pageSize;
    return sortedLeads.slice(start, start + pageSize);
  }, [sortedLeads, safePageIndex, pageSize]);

  // Navigation handlers
  const goToPage = (page) => {
    setPageIndex(Math.max(0, Math.min(page, totalPages - 1)));
  };

  const changePageSize = (size) => {
    setPageSize(size);
    setPageIndex(0);
  };

  // ── Render ────────────────────────────────────────────
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 font-sans"
      style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn { from{transform:translateX(110%);opacity:0}  to{transform:translateX(0);opacity:1} }
        .fade-up { animation: fadeUp .4s ease both; }
      `}</style>

      {/* Modals & Toast */}
      {toast        && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      {viewLead     && <ViewLeadModal lead={viewLead} onClose={() => setViewLead(null)} onEdit={l => { setViewLead(null); setEditLead(l); }} />}
      {editLead     && <EditLeadModal lead={editLead} onClose={() => setEditLead(null)} onSave={handleUpdateSubmit} />}
      {deleteTarget && <DeleteConfirm lead={deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} />}

      {/* PAGE HEADER */}
      <div className="bg-white/70 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white shadow-lg shadow-blue-200">
                <Users size={24} strokeWidth={2.2} />
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
                  Leads Management
                  <span className="hidden sm:inline text-xs bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">{safeLeads.length} total</span>
                </h1>
                <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-1 font-medium">
                  <span className="hover:text-blue-600 cursor-pointer transition-colors">Home</span>
                  <span className="mx-1 text-slate-300">/</span>
                  <span className="text-blue-600 font-bold">Leads</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={fetchLeads} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:border-blue-300 bg-white hover:bg-blue-50 text-slate-600 hover:text-blue-600 text-sm font-bold transition-all shadow-sm">
                <DownloadCloud size={15} /> Refresh Data
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:border-blue-300 bg-white hover:bg-blue-50 text-slate-600 hover:text-blue-600 text-sm font-bold transition-all shadow-sm">
                <FileText size={15} /> Logs
              </button>
              <Link to="/CreateLead" className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-md shadow-blue-200 hover:shadow-lg transition-all">
                <Plus size={16} strokeWidth={2.5} /> Create Lead
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* STAT CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard icon={Users}      label="Total Leads" value={safeLeads.length} gradient="from-cyan-500 to-cyan-600"     delay={0}   />
          <StatCard icon={Trophy}     label="Bookings"    value={0}                gradient="from-green-500 to-emerald-600" delay={60}  />
          <StatCard icon={PieChart}   label="Conversion"  value={0} suffix="%"     gradient="from-amber-500 to-orange-500"  delay={120} />
          <StatCard icon={TrendingUp} label="Win Rate"    value={0} suffix="%"     gradient="from-indigo-500 to-indigo-600" delay={180} />
        </div>

        {/* LEADS DIRECTORY CARD */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">

          {/* List header */}
          <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-base font-extrabold text-slate-700">Leads Directory</h2>
              <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2.5 py-1 rounded-full">{totalElements} results</span>
            </div>
            {(searchTerm || dateFilter !== 'all' || activeTab !== 'All') && (
              <button onClick={() => { setDateFilter('all'); setSearchTerm(''); setActiveTab('All'); }} className="text-xs text-slate-400 hover:text-red-500 font-bold flex items-center gap-1.5 transition-colors">
                ✕ Clear all filters
              </button>
            )}
          </div>

          {/* Filters Bar */}
          <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/60">
            <div className="flex flex-col sm:flex-row gap-3 flex-wrap items-stretch sm:items-center">
              <div className="relative flex-1 min-w-[220px] max-w-sm group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors"><Search size={15} /></div>
                <input
                  type="text" placeholder="Search by name, email, phone, or ID..."
                  value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 placeholder-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-50 outline-none transition-all"
                />
              </div>
              <div className="relative min-w-[160px]">
                <select value={dateFilter} onChange={e => setDateFilter(e.target.value)}
                  className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-600 font-medium focus:border-blue-400 focus:ring-2 focus:ring-blue-50 outline-none appearance-none cursor-pointer transition-all">
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="yesterday">Yesterday</option>
                  <option value="last_7_days">Last 7 Days</option>
                  <option value="custom">Custom Date</option>
                </select>
                <div className="absolute inset-y-0 left-0  pl-3 flex items-center pointer-events-none text-slate-400"><Calendar size={15} /></div>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400"><ChevronDown size={13} /></div>
              </div>
              {dateFilter === 'custom' && (
                <div className="flex items-center gap-2 fade-up">
                  <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-600 focus:border-blue-400 focus:ring-2 focus:ring-blue-50 outline-none transition-all" />
                  <span className="text-slate-400 text-sm font-medium">to</span>
                  <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-600 focus:border-blue-400 focus:ring-2 focus:ring-blue-50 outline-none transition-all" />
                </div>
              )}
            </div>
          </div>

          {/* Status Tabs with Dynamic Counters */}
          <div className="px-5 py-4 border-b border-slate-100 overflow-x-auto">
            {(() => {
              const freshCount = safeLeads.filter(l => l.leadType === 'Fresh Lead').length;
              const newLeadCount = safeLeads.filter(l => l.leadStage === 'New Lead').length;
              const contactedCount = safeLeads.filter(l => l.leadStage === 'Contacted').length;

              const btnClass = (tabName) => `px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm transition-all ${
                activeTab === tabName 
                  ? 'bg-blue-600 text-white shadow-blue-200' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300 hover:text-blue-600'
              }`;

              const badgeClass = (tabName) => `px-2 py-0.5 rounded-md text-xs font-black ${
                activeTab === tabName ? 'bg-white/20' : 'bg-slate-100 text-slate-700'
              }`;

              return (
                <div className="flex gap-2 min-w-max">
                  <button onClick={() => setActiveTab('All')} className={btnClass('All')}>
                    All <span className={badgeClass('All')}>{safeLeads.length}</span>
                  </button>
                  <button onClick={() => setActiveTab('Fresh')} className={btnClass('Fresh')}>
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" /> Fresh
                    <span className={badgeClass('Fresh')}>{freshCount}</span>
                  </button>
                  <button onClick={() => setActiveTab('New Lead')} className={btnClass('New Lead')}>
                    New Lead <span className={badgeClass('New Lead')}>{newLeadCount}</span>
                  </button>
                  <button onClick={() => setActiveTab('Contacted')} className={btnClass('Contacted')}>
                    Contacted <span className={badgeClass('Contacted')}>{contactedCount}</span>
                  </button>
                </div>
              );
            })()}
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1400px] border-collapse text-sm whitespace-nowrap">
              <thead className="bg-slate-50/80 border-b border-slate-100">
                <tr className="text-slate-500 text-xs uppercase tracking-wider font-extrabold">
                  <th className="px-4 py-3.5 w-12 text-center"><input type="checkbox" className="rounded border-slate-300 w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer" /></th>
                  <th className="px-4 py-3.5 text-left">LEAD ID</th>
                  <th className="px-4 py-3.5 text-left">LEAD INFO</th>
                  <th className="px-4 py-3.5 text-center">DESTINATION</th>
                  <th className="px-4 py-3.5 text-left">TRAVELERS</th>
                  <th className="px-4 py-3.5 text-left w-64">SERVICES</th>
                  <th className="px-4 py-3.5 text-center">QUOTATION</th>
                  <th className="px-4 py-3.5 text-left">BOOKING</th>
                  <th className="px-4 py-3.5 text-center">WEBLINK</th>
                  <th className="px-4 py-3.5 text-center">LOGGING</th>
                  <th className="px-4 py-3.5 text-left">ASSIGNED TO</th>
                  <th className="px-4 py-3.5 text-left">AMOUNT</th>
                  <th className="px-4 py-3.5 text-left">MARGIN</th>
                  <th className="px-4 py-3.5 text-left">TYPE</th>
                  <th className="px-4 py-3.5 text-left">STAGE</th>
                  <th onClick={toggleDateSort} className="px-4 py-3.5 text-left cursor-pointer hover:text-blue-600 select-none transition-colors">
                    <div className="flex items-center gap-1.5">
                      CREATED {sortOrder === 'asc' ? <ArrowUp size={14} className="text-blue-500" /> : <ArrowDown size={14} className="text-blue-500" />}
                    </div>
                  </th>
                  <th className="px-4 py-3.5 text-center">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 bg-white">
                {loading ? (
                  [...Array(pageSize)].map((_, i) => <SkeletonRow key={i} />)
                ) : currentLeads.length === 0 ? (
                  <tr>
                    <td colSpan="17" className="text-center py-24">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mb-5 shadow-sm transform -rotate-3">
                          <Inbox size={32} className="text-slate-400" />
                        </div>
                        <p className="text-lg font-extrabold text-slate-600 mb-1">No Leads Found</p>
                        <p className="text-sm text-slate-400 mb-5 max-w-sm mx-auto leading-relaxed">We couldn't find any leads matching your selected criteria.</p>
                        <button onClick={() => { setDateFilter('all'); setSearchTerm(''); setActiveTab('All'); }} className="px-4 py-2 rounded-xl bg-blue-50 text-blue-600 font-bold text-sm hover:bg-blue-100 transition-all">Clear Filters</button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentLeads.map((lead, idx) => (
                    <tr key={lead.id} className="group transition-all duration-150 hover:bg-blue-50/40 hover:shadow-[inset_3px_0_0_#2563eb]"
                      style={{ animation: 'fadeUp .35s ease both', animationDelay: `${idx * 30}ms` }}>
                      <td className="px-4 py-3.5 text-center"><input type="checkbox" className="rounded border-slate-300 w-4 h-4 text-blue-600" /></td>
                      <td className="px-4 py-3.5 text-xs font-extrabold text-blue-600">#{lead.id}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-extrabold flex-shrink-0 shadow-sm">
                            {(lead.customerName || 'U').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800 capitalize">{lead.customerName || 'N/A'}</p>
                            <p className="text-xs text-slate-400 mt-0.5">{lead.email || 'No email'}</p>
                            <p className="text-xs text-slate-400">{lead.phone || 'No phone'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-center font-medium text-slate-700">
                        {lead.itinerary && lead.itinerary.length > 0 ? (
                          <div className="flex flex-col gap-1 items-center">
                            {lead.itinerary.map((item, i) => (
                              <span key={i} className="bg-slate-100 px-2 py-1 rounded-lg text-xs font-semibold text-slate-600">{item.destination} ({item.nights}N)</span>
                            ))}
                          </div>
                        ) : <span className="text-slate-400">N/A</span>}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-slate-600">{lead.adults || 0} Adults</span>
                          {(lead.children > 0 || lead.infants > 0) && (
                            <span className="text-xs text-slate-400">{lead.children || 0} Child, {lead.infants || 0} Infant</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex flex-wrap gap-1.5 w-64">
                          {lead.services && lead.services.map((service, i) => (
                            <span key={i} className="bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider">{service}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-center text-slate-400">—</td>
                      <td className="px-4 py-3.5 text-slate-400">—</td>
                      <td className="px-4 py-3.5 text-center text-slate-400">—</td>
                      <td className="px-4 py-3.5 text-center text-slate-400">—</td>
                      <td className="px-4 py-3.5">
                        {(() => {
                          const name =
                            lead.assignedUser?.fullName ||   
                            lead.assignedUser?.name      ||   
                            lead.assignedUser?.username  ||   
                            lead.assignedUserName        ||   
                            lead.assignTo                ||   
                            null;
                          return (
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white flex items-center justify-center text-xs font-extrabold shadow-sm">
                                {name ? name.charAt(0).toUpperCase() : 'U'}
                              </div>
                              <span className="text-sm font-bold text-slate-700">{name || 'Unassigned'}</span>
                            </div>
                          );
                        })()}
                      </td>
                      <td className="px-4 py-3.5 text-sm font-extrabold text-slate-800">N/A</td>
                      <td className="px-4 py-3.5 text-slate-400">—</td>
                      <td className="px-4 py-3.5">
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full border border-slate-200 bg-slate-100 text-slate-700">{lead.leadType || 'N/A'}</span>
                      </td>
                      {/* 👉 NAYA CODE: Dropdown for STAGE */}
                      <td className="px-4 py-3.5">
                        <select
                          value={lead.leadStage || 'New Lead'}
                          onChange={(e) => handleStageChange(lead, e.target.value)}
                          className={`text-xs font-bold px-2.5 py-1 rounded-full border border-transparent hover:border-slate-200 outline-none cursor-pointer appearance-none text-center transition-all ${
                            lead.leadStage === 'Contacted' ? 'bg-blue-100 text-blue-700' :
                            lead.leadStage === 'New Lead' ? 'bg-emerald-100 text-emerald-700' :
                            lead.leadStage === 'Converted' ? 'bg-green-100 text-green-700' :
                            lead.leadStage === 'Lost' ? 'bg-red-100 text-red-700' :
                            'bg-orange-100 text-orange-700'
                          }`}
                        >
                          <option value="New Lead">New Lead</option>
                          <option value="Contacted">Contacted</option>
                          
                        </select>
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="text-sm font-semibold text-slate-600">
                          {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                        </p>
                        <p className="text-xs text-slate-400">
                          {lead.createdAt ? new Date(lead.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : ''}
                        </p>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center justify-center gap-1.5 opacity-70 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => setViewLead(lead)}     title="View"   className="w-8 h-8 rounded-lg bg-blue-50   hover:bg-blue-100   text-blue-600   flex items-center justify-center transition-all"><Eye    size={15} /></button>
                          <button onClick={() => setEditLead(lead)}     title="Edit"   className="w-8 h-8 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 flex items-center justify-center transition-all"><Pencil size={15} /></button>
                          <button onClick={() => setDeleteTarget(lead)} title="Delete" className="w-8 h-8 rounded-lg bg-red-50    hover:bg-red-100    text-red-400 hover:text-red-600 flex items-center justify-center transition-all"><Trash2 size={15} /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* ── PAGINATION ── */}
          <CommonPagination
            pageIndex={safePageIndex}
            pageSize={pageSize}
            totalElements={totalElements}
            totalPages={totalPages}
            goToPage={goToPage}
            changePageSize={changePageSize}
          />

        </div>
      </div>
    </div>
  );
};

export default Leads;