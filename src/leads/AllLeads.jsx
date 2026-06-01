import React from 'react';
import { 
  Users, Trophy, PieChart, TrendingUp, Search, Flame, Snowflake, 
  DownloadCloud, FileText, Plus, ChevronUp, ChevronRight, ChevronLeft,
  Inbox
} from 'lucide-react';
import { Link } from 'react-router-dom';
const Leads = () => {
  return (
    <div className="min-h-screen bg-[#f3f4f6] font-sans">
      
      {/* Page Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 bg-white border-b border-gray-200 shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-800">Leads</h1>
        <div className="text-sm text-gray-500 mt-2 sm:mt-0">
          <span className="text-indigo-600 cursor-pointer hover:underline font-medium">Home</span> / <span>Leads</span>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="p-4 sm:p-6 space-y-6">

        {/* Analytics Section */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-3 border-b border-gray-200 flex items-center justify-between cursor-pointer hover:bg-gray-50 bg-gray-50/50">
            <div className="flex items-center gap-2 text-gray-700 font-semibold text-sm">
              <TrendingUp size={16} className="text-indigo-600" /> Analytics Overview
            </div>
            <ChevronUp size={18} className="text-gray-400" />
          </div>
          
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-white">
            {/* Blue Card */}
            <div className="bg-blue-500 text-white p-5 rounded-lg shadow-sm flex justify-between items-start relative overflow-hidden transition-transform hover:-translate-y-1">
              <div className="z-10">
                <div className="text-3xl font-bold mb-1">0</div>
                <div className="text-sm font-medium text-blue-100">Total Leads (All Time)</div>
              </div>
              <Users size={56} className="absolute -right-2 -top-2 opacity-20" />
            </div>

            {/* Emerald Card */}
            <div className="bg-emerald-500 text-white p-5 rounded-lg shadow-sm flex justify-between items-start relative overflow-hidden transition-transform hover:-translate-y-1">
              <div className="z-10">
                <div className="text-3xl font-bold mb-1">0</div>
                <div className="text-sm font-medium text-emerald-100">Completed Bookings</div>
              </div>
              <Trophy size={56} className="absolute -right-2 -top-2 opacity-20" />
            </div>

            {/* Amber Card */}
            <div className="bg-amber-500 text-white p-5 rounded-lg shadow-sm flex justify-between items-start relative overflow-hidden transition-transform hover:-translate-y-1">
              <div className="z-10">
                <div className="text-3xl font-bold mb-1">0%</div>
                <div className="text-sm font-medium text-amber-100">Conversion Rate</div>
              </div>
              <PieChart size={56} className="absolute -right-2 -top-2 opacity-20" />
            </div>

            {/* Rose Card */}
            <div className="bg-rose-500 text-white p-5 rounded-lg shadow-sm flex justify-between items-start relative overflow-hidden transition-transform hover:-translate-y-1">
              <div className="z-10">
                <div className="text-3xl font-bold mb-1">0%</div>
                <div className="text-sm font-medium text-rose-100">Win Rate (All Time)</div>
              </div>
              <TrendingUp size={56} className="absolute -right-2 -top-2 opacity-20" />
            </div>
          </div>
        </div>

        {/* Leads List Section */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          
          {/* Header & Action Buttons */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border-b border-gray-200 gap-4 bg-gray-50/50">
            <h2 className="text-lg font-semibold text-gray-800">Leads Directory</h2>
            <div className="flex flex-wrap gap-2">
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1.5 transition-colors shadow-sm">
                <DownloadCloud size={16} /> Import Wizard
              </button>
              <button className="bg-slate-600 hover:bg-slate-700 text-white px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1.5 transition-colors shadow-sm">
                <FileText size={16} /> View Logs
              </button>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-md text-sm font-medium flex items-center gap-1.5 transition-colors shadow-sm">
               <Link 
  to="/add-lead" 
  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-md text-sm font-medium flex items-center gap-1.5 transition-colors shadow-sm"
>
  <Plus size={16} /> Create Lead
</Link>
              </button>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="p-4 border-b border-gray-100 flex flex-wrap gap-4 items-center bg-white">
            <div className="relative flex-1 min-w-[280px] max-w-md">
              <input 
                type="text" 
                placeholder="Search by name, phone, email, ID..." 
                className="w-full border border-gray-300 rounded-md pl-3 pr-8 py-2 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" 
              />
              <Search size={16} className="absolute right-3 top-2.5 text-gray-400" />
            </div>
            
            <select className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 min-w-[150px] focus:outline-none focus:border-indigo-500">
              <option>All Users</option>
            </select>
            
            <div className="flex items-center gap-4 text-sm ml-2">
              <label className="flex items-center gap-1.5 cursor-pointer text-gray-600 hover:text-gray-900">
                <input type="checkbox" className="rounded text-indigo-600 border-gray-300 focus:ring-indigo-500" /> 
                <Flame size={16} className="text-orange-500" /> Hot
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer text-gray-600 hover:text-gray-900">
                <input type="checkbox" className="rounded text-indigo-600 border-gray-300 focus:ring-indigo-500" /> 
                <Snowflake size={16} className="text-blue-500" /> Cold
              </label>
            </div>
          </div>

          {/* Status Tabs */}
          <div className="px-4 py-3 bg-slate-50 border-b border-gray-200 overflow-x-auto">
            <div className="flex gap-2 min-w-max">
              <button className="bg-slate-800 text-white px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 shadow-sm">
                All <span className="bg-slate-600 px-1.5 py-0.5 rounded text-xs">0</span>
              </button>
              <button className="bg-white text-gray-600 border border-gray-200 px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 hover:bg-gray-50 transition-colors">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div> FRESH
              </button>
              <button className="bg-white text-gray-600 border border-gray-200 px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 hover:bg-gray-50 transition-colors">
                New Lead <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded text-xs font-semibold">0</span>
              </button>
              <button className="bg-white text-gray-600 border border-gray-200 px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 hover:bg-gray-50 transition-colors">
                Contacted <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded text-xs font-semibold">0</span>
              </button>
            </div>
          </div>

          {/* Custom Scroll Controls */}
          <div className="px-4 py-1.5 flex justify-between items-center text-gray-400 bg-gray-50 border-b border-gray-200">
            <ChevronLeft size={16} className="cursor-pointer hover:text-gray-700 transition-colors" />
            <div className="flex-1 border-b-[3px] border-gray-200 mx-3 rounded-full relative">
              <div className="absolute left-0 top-[-3px] bottom-[-3px] w-full bg-indigo-200 rounded-full"></div>
            </div>
            <ChevronRight size={16} className="cursor-pointer hover:text-gray-700 transition-colors" />
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1400px] border-collapse text-sm">
              {/* Table Header */}
              <thead>
                <tr className="bg-slate-100 text-slate-600 text-[11px] text-left uppercase tracking-wider font-bold">
                  <th className="p-3 w-10 text-center border-r border-gray-200"><input type="checkbox" className="rounded-sm border-gray-300" /></th>
                  <th className="p-3 border-r border-gray-200">LEAD ID</th>
                  <th className="p-3 border-r border-gray-200">LEAD INFO</th>
                  <th className="p-3 border-r border-gray-200 text-center">DESTINATION</th>
                  <th className="p-3 border-r border-gray-200">TRAVELERS INFO</th>
                  <th className="p-3 border-r border-gray-200">SERVICES</th>
                  <th className="p-3 border-r border-gray-200 text-center">QUOTATION</th>
                  <th className="p-3 border-r border-gray-200">BOOKING</th>
                  <th className="p-3 border-r border-gray-200 text-center">WEBLINK</th>
                  <th className="p-3 border-r border-gray-200 text-center">LOGGING</th>
                  <th className="p-3 border-r border-gray-200">ASSIGNED TO</th>
                  <th className="p-3 border-r border-gray-200">AMOUNT</th>
                  <th className="p-3 border-r border-gray-200">MARGIN</th>
                  <th className="p-3 border-r border-gray-200">TYPE</th>
                  <th className="p-3">STAGE</th>
                   <th className="p-3">CREATED</th>
                    <th className="p-3">ACTIONS</th>
                </tr>
              </thead>
              
              {/* Table Body - EMPTY STATE */}
              <tbody className="bg-white">
                <tr>
                  <td colSpan="15" className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <div className="bg-gray-50 p-4 rounded-full mb-3">
                        <Inbox size={40} className="text-gray-300" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">No Leads Found</h3>
                      <p className="text-sm text-gray-500 max-w-sm mx-auto mb-4">
                        There are currently no leads in the system matching your criteria. Try adjusting your filters or create a new lead.
                      </p>
                      <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors shadow-sm">
                        <Plus size={16} /> Add First Lead
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Leads;