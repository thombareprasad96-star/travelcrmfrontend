
import React, { useState, useEffect } from 'react';
import { leadService } from '../../services/leadService'; 
import { 
  Users, Trophy, PieChart, TrendingUp, Search, Flame, Snowflake, 
  DownloadCloud, FileText, Plus, ChevronUp, ChevronRight, ChevronLeft,
  Inbox, User, ArrowUpRight, ArrowUpDown, ArrowUp, ArrowDown, Calendar, ChevronDown
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Leads = () => {
 
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  // States for Filters & Sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('desc'); 
  const [dateFilter, setDateFilter] = useState('all'); 
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const response = await leadService.getAllLeads(); 
      
      // 👉 SMART EXTRACTION: Backend chahe jaise bhi data bheje, hum use pakad lenge
      let fetchedData = [];
      if (response.data) {
        if (Array.isArray(response.data.data)) {
          fetchedData = response.data.data;
        } else if (response.data.data && Array.isArray(response.data.data.content)) {
          fetchedData = response.data.data.content;
        } else if (Array.isArray(response.data.content)) {
          fetchedData = response.data.content;
        } else if (Array.isArray(response.data)) {
          fetchedData = response.data;
        }
      }
      
      console.log("Total leads loaded from API:", fetchedData.length);
      setLeads(fetchedData);

    } catch (error) {
      console.error("Error fetching leads:", error);
      setLeads([]); 
    } finally {
      setLoading(false);
    }
  };

  const toggleDateSort = () => {
    setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
  };

  const safeLeads = Array.isArray(leads) ? leads : [];

  // 👉 UPDATED FILTER: Ab koi naya lead hide nahi hoga
  const filteredLeads = safeLeads.filter(lead => {
    
    // 1. Search Condition (Agar search bar empty hai, toh sab pass hain)
    const searchLower = searchTerm.trim().toLowerCase();
    const matchesSearch = searchLower === '' || 
      (lead.customerName && lead.customerName.toLowerCase().includes(searchLower)) ||
      (lead.email && lead.email.toLowerCase().includes(searchLower)) ||
      (lead.phone && lead.phone.includes(searchLower)) ||
      (lead.id && lead.id.toString().includes(searchLower));

    // 2. Date Condition (Agar Date filter 'all' hai, toh aage check mat karo)
    let matchesDate = true;
    
    if (dateFilter !== 'all' && lead.createdAt) {
      const leadDate = new Date(lead.createdAt);
      leadDate.setHours(0, 0, 0, 0); 

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      if (dateFilter === 'today') {
        matchesDate = leadDate.getTime() === today.getTime();
      } else if (dateFilter === 'yesterday') {
        matchesDate = leadDate.getTime() === yesterday.getTime();
      } else if (dateFilter === 'last_7_days') {
        matchesDate = leadDate >= sevenDaysAgo && leadDate <= today;
      } else if (dateFilter === 'custom' && startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999); 
        matchesDate = leadDate >= start && leadDate <= end;
      }
    }

    // Lead tabhi dikhega jab dono search aur date conditions match hongi
    return matchesSearch && matchesDate;
  });

  const sortedLeads = [...filteredLeads].sort((a, b) => {
    if (!a.createdAt || !b.createdAt) return 0;
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  const renderSortIcon = () => {
    if (sortOrder === 'asc') return <ArrowUp size={14} className="text-blue-600" />;
    if (sortOrder === 'desc') return <ArrowDown size={14} className="text-blue-600" />;
    return <ArrowUpDown size={14} className="text-slate-400" />;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans p-4 sm:p-6 lg:p-8">
      
      {/* --- Page Header & Breadcrumb --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-sm shadow-blue-600/20">
              <Users size={22} strokeWidth={2.5} />
            </div>
            Leads Management
          </h1>
          <div className="text-sm text-slate-500 mt-2 font-medium flex items-center gap-2">
            <span className="text-blue-600 hover:text-blue-800 cursor-pointer transition-colors">Home</span> 
            <span className="text-slate-300">/</span> 
            <span className="text-slate-700 bg-white border border-slate-200 px-2.5 py-0.5 rounded-md shadow-sm">Leads</span>
          </div>
        </div>

        <Link 
          to="/CreateLead" 
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Plus size={18} strokeWidth={2.5} /> 
          Create Lead
        </Link>
      </div>

      {/* --- Main Content Container --- */}
      <div className="space-y-6">

        {/* --- Analytics Section --- */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-sm uppercase tracking-wider">
              <TrendingUp size={18} className="text-blue-600" /> Analytics Overview
            </div>
            <ChevronUp size={20} className="text-slate-400" />
          </div>
          
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 bg-slate-50/50">
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-blue-200 hover:shadow-md transition-all">
              <div>
                <div className="text-sm font-semibold text-slate-500 mb-1">Total Leads</div>
                <div className="text-3xl font-black text-slate-900 flex items-baseline gap-2">
                  {safeLeads.length} <span className="text-xs font-bold text-emerald-500 flex items-center"><ArrowUpRight size={14}/> 0%</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                <Users size={24} strokeWidth={2} />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-emerald-200 hover:shadow-md transition-all">
              <div>
                <div className="text-sm font-semibold text-slate-500 mb-1">Bookings</div>
                <div className="text-3xl font-black text-slate-900 flex items-baseline gap-2">
                  0 <span className="text-xs font-bold text-slate-400 flex items-center">-</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                <Trophy size={24} strokeWidth={2} />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-amber-200 hover:shadow-md transition-all">
              <div>
                <div className="text-sm font-semibold text-slate-500 mb-1">Conversion</div>
                <div className="text-3xl font-black text-slate-900">0%</div>
              </div>
              <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
                <PieChart size={24} strokeWidth={2} />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-purple-200 hover:shadow-md transition-all">
              <div>
                <div className="text-sm font-semibold text-slate-500 mb-1">Win Rate</div>
                <div className="text-3xl font-black text-slate-900">0%</div>
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                <TrendingUp size={24} strokeWidth={2} />
              </div>
            </div>
          </div>
        </div>

        {/* --- Leads Directory Section --- */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-5 border-b border-slate-100 gap-4">
            <h2 className="text-lg font-bold text-slate-900">Leads Directory</h2>
            <div className="flex flex-wrap gap-3">
              <button onClick={fetchLeads} className="bg-white hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors border border-slate-200 shadow-sm">
                <DownloadCloud size={16} className="text-slate-500" /> Refresh Data
              </button>
              <button className="bg-white hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors border border-slate-200 shadow-sm">
                <FileText size={16} className="text-slate-500" /> Logs
              </button>
            </div>
          </div>

          {/* --- Filters Bar --- */}
          <div className="p-5 border-b border-slate-100 flex flex-wrap gap-4 items-center bg-slate-50/50">
            
            {/* Search Input */}
            <div className="relative flex-1 min-w-[250px] max-w-sm group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                <Search size={18} />
              </div>
              <input 
                type="text" 
                placeholder="Search leads by name, email, or ID..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 placeholder-slate-400 text-slate-900 font-medium shadow-sm" 
              />
            </div>
            
            {/* Date Dropdown */}
            <div className="relative min-w-[160px]">
              <select 
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full pl-10 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 font-medium appearance-none cursor-pointer shadow-sm transition-all"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="last_7_days">Last 7 Days</option>
                <option value="custom">Custom Date</option>
              </select>
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Calendar size={18} />
              </div>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                <ChevronDown size={14} />
              </div>
            </div>

            {/* Custom Date Pickers (Conditional) */}
            {dateFilter === 'custom' && (
              <div className="flex items-center gap-2 animate-in fade-in zoom-in duration-200">
                <input 
                  type="date" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-sm"
                />
                <span className="text-slate-400 text-sm font-medium">to</span>
                <input 
                  type="date" 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-sm"
                />
              </div>
            )}
            
            {/* User Dropdown */}
            <div className="relative min-w-[150px]"> 
              <select className="w-full pl-10 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 font-medium appearance-none cursor-pointer shadow-sm transition-all">
                <option>All Assignees</option>
              </select>
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User size={18} />
              </div>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                <ChevronDown size={14} />
              </div>
            </div>
            
          </div>

          {/* Status Tabs */}
          <div className="px-5 py-4 border-b border-slate-100 overflow-x-auto">
            <div className="flex gap-2 min-w-max">
              <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-sm">
                All <span className="bg-slate-700 px-2 py-0.5 rounded-md text-xs">{sortedLeads.length}</span>
              </button>
              <button className="bg-white text-slate-600 border border-slate-200 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></div> Fresh
              </button>
              <button className="bg-white text-slate-600 border border-slate-200 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                New Lead <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md text-xs font-black">0</span>
              </button>
              <button className="bg-white text-slate-600 border border-slate-200 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                Contacted <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md text-xs font-black">0</span>
              </button>
            </div>
          </div>

          {/* Custom Scroll Controls */}
          <div className="px-5 py-2.5 flex justify-between items-center text-slate-400 bg-slate-50 border-b border-slate-100">
            <ChevronLeft size={18} className="cursor-pointer hover:text-blue-600 transition-colors" />
            <div className="flex-1 border-b-[4px] border-slate-200 mx-4 rounded-full relative">
              <div className="absolute left-0 top-[-4px] bottom-[-4px] w-1/3 bg-blue-300 rounded-full"></div>
            </div>
            <ChevronRight size={18} className="cursor-pointer hover:text-blue-600 transition-colors" />
          </div>

          {/* --- Data Table --- */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1400px] border-collapse text-sm whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold border-b border-slate-200">
                  <th className="px-4 py-4 w-12 text-center rounded-tl-2xl">
                    <input type="checkbox" className="rounded border-slate-300 w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                  </th>
                  <th className="px-4 py-4 text-left">LEAD ID</th>
                  <th className="px-4 py-4 text-left">LEAD INFO</th>
                  <th className="px-4 py-4 text-center">DESTINATION</th>
                  <th className="px-4 py-4 text-left">TRAVELERS</th>
                  <th className="px-4 py-4 text-left w-64">SERVICES</th>
                  <th className="px-4 py-4 text-center">QUOTATION</th>
                  <th className="px-4 py-4 text-left">BOOKING</th>
                  <th className="px-4 py-4 text-center">WEBLINK</th>
                  <th className="px-4 py-4 text-center">LOGGING</th>
                  <th className="px-4 py-4 text-left">ASSIGNED TO</th>
                  <th className="px-4 py-4 text-left">AMOUNT</th>
                  <th className="px-4 py-4 text-left">MARGIN</th>
                  <th className="px-4 py-4 text-left">TYPE</th>
                  <th className="px-4 py-4 text-left">STAGE</th>
                  <th 
                    onClick={toggleDateSort}
                    className="px-4 py-4 text-left cursor-pointer hover:bg-slate-100 hover:text-blue-600 select-none transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      CREATED {renderSortIcon()}
                    </div>
                  </th>
                  <th className="px-4 py-4 rounded-tr-2xl text-center">ACTIONS</th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-slate-100 bg-white">
                
                {/* Loading State UI */}
                {loading ? (
                  <tr>
                    <td colSpan="17" className="px-6 py-24 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                        <h3 className="text-lg font-bold text-slate-900">Loading Leads...</h3>
                        <p className="text-sm text-slate-500">Fetching data from server</p>
                      </div>
                    </td>
                  </tr>
                ) : sortedLeads.length === 0 ? (
                  
                  /* Empty State */
                  <tr>
                    <td colSpan="17" className="px-6 py-24 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mb-5 shadow-sm transform -rotate-3">
                          <Inbox size={32} className="text-slate-400" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">No Leads Found</h3>
                        <p className="text-sm font-medium text-slate-500 max-w-sm mx-auto mb-6 leading-relaxed">
                          We couldn't find any leads matching your selected date and search criteria.
                        </p>
                        <button 
                          onClick={() => { setDateFilter('all'); setSearchTerm(''); }}
                          className="text-blue-600 hover:text-blue-700 font-bold text-sm"
                        >
                          Clear Filters
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  
                  /* Real JSON Data Mapping */
                  sortedLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-4 text-center">
                        <input type="checkbox" className="rounded border-slate-300 w-4 h-4 text-blue-600" />
                      </td>
                      <td className="px-4 py-4 font-semibold text-slate-700">#{lead.id}</td>
                      <td className="px-4 py-4">
                        <div className="font-bold text-slate-900 capitalize">{lead.customerName || 'N/A'}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{lead.email || 'No email'}</div>
                        <div className="text-xs text-slate-500">{lead.phone || 'No phone'}</div>
                      </td>
                      <td className="px-4 py-4 text-center font-medium text-slate-700">
                        {lead.itinerary && lead.itinerary.length > 0 ? (
                          <div className="flex flex-col gap-1 items-center">
                            {lead.itinerary.map((item, idx) => (
                              <span key={idx} className="bg-slate-100 px-2 py-1 rounded text-xs">
                                {item.destination} ({item.nights}N)
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-400">N/A</span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-slate-600 font-medium">
                        <div className="flex flex-col">
                          <span>{lead.adults || 0} Adults</span>
                          {(lead.children > 0 || lead.infants > 0) && (
                            <span className="text-xs text-slate-400">
                              {lead.children || 0} Child, {lead.infants || 0} Infant
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-1.5 w-64">
                          {lead.services && lead.services.map((service, idx) => (
                            <span key={idx} className="bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider">
                              {service}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">—</td>
                      <td className="px-4 py-4">—</td>
                      <td className="px-4 py-4 text-center">—</td>
                      <td className="px-4 py-4 text-center">—</td>
                      <td className="px-4 py-4 text-slate-700 font-bold">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs">
                            {(lead.assignTo || 'U').charAt(0)}
                          </div>
                          {lead.assignTo || 'Unassigned'}
                        </div>
                      </td>
                      <td className="px-4 py-4 font-bold text-slate-900">N/A</td>
                      <td className="px-4 py-4 text-slate-500">—</td>
                      <td className="px-4 py-4">
                        <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md text-xs font-bold border border-slate-200">
                          {lead.leadType || 'N/A'}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md text-xs font-bold border border-emerald-100">
                          {lead.leadStage || 'N/A'}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-slate-500 font-medium">
                        {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString('en-US', { 
                          month: 'short', day: 'numeric', year: 'numeric',
                          hour: '2-digit', minute: '2-digit' 
                        }) : 'N/A'}
                      </td>
                      <td className="px-4 py-4 text-center text-slate-400">—</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Leads;