// import React, { useState } from 'react';
// import { Link } from 'react-router-dom'; // Link import kiya gaya hai
// import { 
//   LayoutDashboard, Users, Database, ChevronDown, Circle, Plane, FileText,
//   CalendarDays, UserCheck, Store, UserCog, BarChart3, Settings, CircleUser, 
//   User, CreditCard, LogOut
// } from 'lucide-react';

// const Sidebar = ({ isExpanded }) => {
//   const [openDropdown, setOpenDropdown] = useState('');
//   const [activeTab, setActiveTab] = useState('Dashboard');
  
//   const [isHovered, setIsHovered] = useState(false);
//   const showSidebar = isExpanded || isHovered;

//   const handleMenuClick = (menuName) => {
//     setActiveTab(menuName);
//     setOpenDropdown(openDropdown === menuName ? '' : menuName);
//   };

//   const handleLinkClick = (menuName) => {
//     setActiveTab(menuName);
//     setOpenDropdown('');
//   };

//   return (
//     <aside 
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//       className={`fixed md:relative z-50 h-screen bg-[#2d3238] text-gray-400 flex flex-col shrink-0 font-sans transition-all duration-300 ease-in-out ${
//         showSidebar ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0 w-64 md:w-16'
//       }`}
//     >
//       {/* Brand Header */}
//       <div className={`h-16 flex items-center border-b border-gray-700/50 shrink-0 overflow-hidden whitespace-nowrap transition-all duration-300 ${showSidebar ? 'px-6' : 'px-0 justify-center'}`}>
//         {showSidebar ? (
//           <span className="text-[17px] font-normal text-white">Nepal Tours And Travels</span>
//         ) : (
//           <span className="text-xl font-bold text-white hidden md:block">NT</span> 
//         )}
//       </div>

//       {/* Navigation List */}
//       <nav className="flex-1 overflow-y-auto py-4 custom-scrollbar overflow-x-hidden">
//         <ul className="space-y-1">
          
//           <li className="px-2">
//             <Link 
//               to="/" 
//               onClick={() => handleLinkClick('Dashboard')}
//               className={`flex items-center py-2.5 rounded transition-colors ${showSidebar ? 'px-3 gap-3' : 'justify-center'} ${
//                 activeTab === 'Dashboard' ? 'bg-blue-600 text-white' : 'hover:bg-gray-800'
//               }`}
//             >
//               <LayoutDashboard size={20} className="shrink-0" />
//               {showSidebar && <span className="text-sm whitespace-nowrap">Dashboard</span>}
//             </Link>
//           </li>

//           {/* --- Leads Dropdown --- */}
//           <li className="px-2">
//             <button 
//               onClick={() => handleMenuClick('Leads')}
//               className={`w-full flex items-center py-2.5 rounded transition-colors ${showSidebar ? 'justify-between px-3' : 'justify-center'} ${
//                 activeTab === 'Leads' ? 'bg-blue-600 text-white' : 'hover:bg-gray-800'
//               }`}
//             >
//               <div className={`flex items-center ${showSidebar ? 'gap-3' : ''}`}>
//                 <Users size={20} className="shrink-0" />
//                 {showSidebar && <span className="text-sm whitespace-nowrap">Leads</span>}
//               </div>
//               {showSidebar && <ChevronDown size={16} className={`transition-transform duration-200 ${openDropdown === 'Leads' ? '' : '-rotate-90'}`} />}
//             </button>
            
//             {showSidebar && openDropdown === 'Leads' && (
//               <ul className="mt-1 space-y-1 pb-2">
//                 <li><Link to="allleads" className="flex items-center gap-3 px-3 py-2 pl-10 text-sm hover:bg-gray-800 rounded whitespace-nowrap"><Circle size={14} /><span>All leads</span></Link></li>
//                 <li><Link to="/CreateLead" className="flex items-center gap-3 px-3 py-2 pl-10 text-sm hover:bg-gray-800 rounded whitespace-nowrap"><Circle size={14} /><span>Add new lead</span></Link></li>
//               </ul>
//             )}
//           </li>

//           {/* --- Masters Dropdown --- */}
//           <li className="px-2 pt-1">
//             <button 
//               onClick={() => handleMenuClick('Masters')}
//               className={`w-full flex items-center py-2.5 rounded transition-colors ${showSidebar ? 'justify-between px-3' : 'justify-center'} ${
//                 activeTab === 'Masters' ? 'bg-blue-600 text-white' : 'hover:bg-gray-800'
//               }`}
//             >
//               <div className={`flex items-center ${showSidebar ? 'gap-3' : ''}`}>
//                 <Database size={20} className="shrink-0" />
//                 {showSidebar && <span className="text-sm font-medium whitespace-nowrap">Masters</span>}
//               </div>
//               {showSidebar && <ChevronDown size={16} className={`transition-transform duration-200 ${openDropdown === 'Masters' ? '' : '-rotate-90'}`} />}
//             </button>
            
//             {showSidebar && openDropdown === 'Masters' && (
//               <ul className="mt-1 space-y-1 pb-2">
//                 <li><Link to="/masters/city" className="flex items-center gap-3 px-3 py-2 pl-10 text-sm hover:bg-gray-800 rounded whitespace-nowrap"><Circle size={14} /><span>Cities</span></Link></li>
//                 <li><Link to="/masters/destinations" className="flex items-center gap-3 px-3 py-2 pl-10 text-sm hover:bg-gray-800 rounded whitespace-nowrap"><Circle size={14} /><span>Destinations</span></Link></li>
//                 <li><Link to="/masters/hotels" className="flex items-center gap-3 px-3 py-2 pl-10 text-sm hover:bg-gray-800 rounded whitespace-nowrap"><Circle size={14} /><span>Hotels</span></Link></li>
//                 <li><Link to="/masters/airlines" className="flex items-center gap-3 px-3 py-2 pl-10 text-sm hover:bg-gray-800 rounded whitespace-nowrap"><Plane size={14} /><span>Airlines</span></Link></li>
//                 <li><Link to="/masters/cruises" className="flex items-center gap-3 px-3 py-2 pl-10 text-sm hover:bg-gray-800 rounded whitespace-nowrap"><Circle size={14} /><span>Cruises</span></Link></li>
//                 <li><Link to="/masters/vehicles" className="flex items-center gap-3 px-3 py-2 pl-10 text-sm hover:bg-gray-800 rounded whitespace-nowrap"><Circle size={14} /><span>Vehicles</span></Link></li>
//                 <li><Link to="/masters/sightseeing" className="flex items-center gap-3 px-3 py-2 pl-10 text-sm hover:bg-gray-800 rounded whitespace-nowrap"><Circle size={14} /><span>Sightseeing</span></Link></li>
//                 <li><Link to="/masters/add-on-services" className="flex items-center gap-3 px-3 py-2 pl-10 text-sm hover:bg-gray-800 rounded whitespace-nowrap"><Circle size={14} /><span>Add-on Services</span></Link></li>
//                 <li><Link to="/masters/testimonials" className="flex items-center gap-3 px-3 py-2 pl-10 text-sm hover:bg-gray-800 rounded whitespace-nowrap"><Circle size={14} /><span>Testimonials</span></Link></li>
//               </ul>
//             )}
//           </li>

//           {/* --- Quotations Dropdown --- */}
//           <li className="px-2">
//             <button 
//               onClick={() => handleMenuClick('Quotations')}
//               className={`w-full flex items-center py-2.5 rounded transition-colors ${showSidebar ? 'justify-between px-3' : 'justify-center'} ${
//                 activeTab === 'Quotations' ? 'bg-blue-600 text-white' : 'hover:bg-gray-800'
//               }`}
//             >
//               <div className={`flex items-center ${showSidebar ? 'gap-3' : ''}`}>
//                 <FileText size={20} className="shrink-0" />
//                 {showSidebar && <span className="text-sm whitespace-nowrap">Quotations</span>}
//               </div>
//               {showSidebar && <ChevronDown size={16} className={`transition-transform duration-200 ${openDropdown === 'Quotations' ? '' : '-rotate-90'}`} />}
//             </button>
//             {showSidebar && openDropdown === 'Quotations' && (
//               <ul className="mt-1 space-y-1 pb-2">
//                 <li><Link to="/quotations/templates" className="flex items-center gap-3 px-3 py-2 pl-10 text-sm hover:bg-gray-800 rounded whitespace-nowrap"><Circle size={14} /><span>Templates</span></Link></li>
//               </ul>
//             )}
//           </li>

//           {/* --- Bookings Dropdown --- */}
//           <li className="px-2">
//             <button 
//               onClick={() => handleMenuClick('Bookings')}
//               className={`w-full flex items-center py-2.5 rounded transition-colors ${showSidebar ? 'justify-between px-3' : 'justify-center'} ${
//                 activeTab === 'Bookings' ? 'bg-blue-600 text-white' : 'hover:bg-gray-800'
//               }`}
//             >
//               <div className={`flex items-center ${showSidebar ? 'gap-3' : ''}`}>
//                 <CalendarDays size={20} className="shrink-0" />
//                 {showSidebar && <span className="text-sm whitespace-nowrap">Bookings</span>}
//               </div>
//               {showSidebar && <ChevronDown size={16} className={`transition-transform duration-200 ${openDropdown === 'Bookings' ? '' : '-rotate-90'}`} />}
//             </button>
//             {showSidebar && openDropdown === 'Bookings' && (
//               <ul className="mt-1 space-y-1 pb-2">
//                 <li><Link to="/bookings" className="flex items-center gap-3 px-3 py-2 pl-10 text-sm hover:bg-gray-800 rounded whitespace-nowrap"><Circle size={14} /><span>All Bookings</span></Link></li>
//                 <li><Link to="/add-booking" className="flex items-center gap-3 px-3 py-2 pl-10 text-sm hover:bg-gray-800 rounded whitespace-nowrap"><Circle size={14} /><span>Add New Booking</span></Link></li>
//               </ul>
//             )}
//           </li>

//           {/* --- Customers Dropdown --- */}
//           <li className="px-2">
//             <button 
//               onClick={() => handleMenuClick('Customers')}
//               className={`w-full flex items-center py-2.5 rounded transition-colors ${showSidebar ? 'justify-between px-3' : 'justify-center'} ${
//                 activeTab === 'Customers' ? 'bg-blue-600 text-white' : 'hover:bg-gray-800'
//               }`}
//             >
//               <div className={`flex items-center ${showSidebar ? 'gap-3' : ''}`}>
//                 <UserCheck size={20} className="shrink-0" />
//                 {showSidebar && <span className="text-sm whitespace-nowrap">Customers</span>}
//               </div>
//               {showSidebar && <ChevronDown size={16} className={`transition-transform duration-200 ${openDropdown === 'Customers' ? '' : '-rotate-90'}`} />}
//             </button>
//             {showSidebar && openDropdown === 'Customers' && (
//               <ul className="mt-1 space-y-1 pb-2">
//                 <li><Link to="/customers" className="flex items-center gap-3 px-3 py-2 pl-10 text-sm hover:bg-gray-800 rounded whitespace-nowrap"><Circle size={14} /><span>All Customers</span></Link></li>
//                 <li><Link to="/add-customer" className="flex items-center gap-3 px-3 py-2 pl-10 text-sm hover:bg-gray-800 rounded whitespace-nowrap"><Circle size={14} /><span>Add New Customer</span></Link></li>
//               </ul>
//             )}
//           </li>

//           {/* --- Vendors Dropdown --- */}
//           <li className="px-2">
//             <button 
//               onClick={() => handleMenuClick('Vendors')}
//               className={`w-full flex items-center py-2.5 rounded transition-colors ${showSidebar ? 'justify-between px-3' : 'justify-center'} ${
//                 activeTab === 'Vendors' ? 'bg-blue-600 text-white' : 'hover:bg-gray-800'
//               }`}
//             >
//               <div className={`flex items-center ${showSidebar ? 'gap-3' : ''}`}>
//                 <Store size={20} className="shrink-0" />
//                 {showSidebar && <span className="text-sm whitespace-nowrap">Vendors</span>}
//               </div>
//               {showSidebar && <ChevronDown size={16} className={`transition-transform duration-200 ${openDropdown === 'Vendors' ? '' : '-rotate-90'}`} />}
//             </button>
//             {showSidebar && openDropdown === 'Vendors' && (
//               <ul className="mt-1 space-y-1 pb-2">
//                 <li><Link to="/vendors" className="flex items-center gap-3 px-3 py-2 pl-10 text-sm hover:bg-gray-800 rounded whitespace-nowrap"><Circle size={14} /><span>All Vendors</span></Link></li>
//                 <li><Link to="/add-vendor" className="flex items-center gap-3 px-3 py-2 pl-10 text-sm hover:bg-gray-800 rounded whitespace-nowrap"><Circle size={14} /><span>Add New Vendor</span></Link></li>
//               </ul>
//             )}
//           </li>

//           {/* --- Users Dropdown --- */}
//           <li className="px-2">
//             <button 
//               onClick={() => handleMenuClick('Users')}
//               className={`w-full flex items-center py-2.5 rounded transition-colors ${showSidebar ? 'justify-between px-3' : 'justify-center'} ${
//                 activeTab === 'Users' ? 'bg-blue-600 text-white' : 'hover:bg-gray-800'
//               }`}
//             >
//               <div className={`flex items-center ${showSidebar ? 'gap-3' : ''}`}>
//                 <UserCog size={20} className="shrink-0" />
//                 {showSidebar && <span className="text-sm whitespace-nowrap">Users</span>}
//               </div>
//               {showSidebar && <ChevronDown size={16} className={`transition-transform duration-200 ${openDropdown === 'Users' ? '' : '-rotate-90'}`} />}
//             </button>
//             {showSidebar && openDropdown === 'Users' && (
//               <ul className="mt-1 space-y-1 pb-2">
//                 <li><Link to="/users" className="flex items-center gap-3 px-3 py-2 pl-10 text-sm hover:bg-gray-800 rounded whitespace-nowrap"><Circle size={14} /><span>All Users</span></Link></li>
//                 <li><Link to="/add-user" className="flex items-center gap-3 px-3 py-2 pl-10 text-sm hover:bg-gray-800 rounded whitespace-nowrap"><Circle size={14} /><span>Add New User</span></Link></li>
//                 <li><Link to="/users/permission-templates" className="flex items-center gap-3 px-3 py-2 pl-10 text-sm hover:bg-gray-800 rounded whitespace-nowrap"><Circle size={14} /><span>Permission Templates</span></Link></li>
//               </ul>
//             )}
//           </li>

//           {/* --- Reports (Normal Link) --- */}
//           <li className="px-2">
//             <Link 
//               to="/reports" 
//               onClick={() => handleLinkClick('Reports')}
//               className={`flex items-center py-2.5 rounded transition-colors ${showSidebar ? 'px-3 gap-3' : 'justify-center'} ${
//                 activeTab === 'Reports' ? 'bg-blue-600 text-white' : 'hover:bg-gray-800'
//               }`}
//             >
//               <BarChart3 size={20} className="shrink-0" />
//               {showSidebar && <span className="text-sm whitespace-nowrap">Reports</span>}
//             </Link>
//           </li>

//           {/* Divider */}
//           <li className="px-4 py-2">
//             <div className="h-px bg-gray-700/50 w-full"></div>
//           </li>

//           {/* Settings & Bottom links */}
//           <li className="px-2">
//             <Link 
//               to="/settings" 
//               onClick={() => handleLinkClick('Settings')}
//               className={`flex items-center py-2.5 rounded transition-colors ${showSidebar ? 'px-3 gap-3' : 'justify-center'} ${
//                 activeTab === 'Settings' ? 'bg-blue-600 text-white' : 'hover:bg-gray-800'
//               }`}
//             >
//               <Settings size={20} className="shrink-0" />
//               {showSidebar && <span className="text-sm whitespace-nowrap">Settings</span>}
//             </Link>
//           </li>

//           <li className="px-2">
//             <Link 
//               to="/account" 
//               onClick={() => handleLinkClick('Account')}
//               className={`flex items-center py-2.5 rounded transition-colors ${showSidebar ? 'px-3 gap-3' : 'justify-center'} ${
//                 activeTab === 'Account' ? 'bg-blue-600 text-white' : 'hover:bg-gray-800'
//               }`}
//             >
//               <CircleUser size={20} className="shrink-0" />
//               {showSidebar && <span className="text-sm whitespace-nowrap">Account</span>}
//             </Link>
//           </li>

//           <li className="px-2">
//             <Link 
//               to="/profile" 
//               onClick={() => handleLinkClick('Profile')}
//               className={`flex items-center py-2.5 rounded transition-colors ${showSidebar ? 'px-3 gap-3' : 'justify-center'} ${
//                 activeTab === 'Profile' ? 'bg-blue-600 text-white' : 'hover:bg-gray-800'
//               }`}
//             >
//               <User size={20} className="shrink-0" />
//               {showSidebar && <span className="text-sm whitespace-nowrap">Profile</span>}
//             </Link>
//           </li>

//           <li className="px-2">
//             <Link 
//               to="/subscription" 
//               onClick={() => handleLinkClick('Subscription')}
//               className={`flex items-center py-2.5 rounded transition-colors ${showSidebar ? 'px-3 gap-3' : 'justify-center'} ${
//                 activeTab === 'Subscription' ? 'bg-blue-600 text-white' : 'hover:bg-gray-800'
//               }`}
//             >
//               <CreditCard size={20} className="shrink-0" />
//               {showSidebar && <span className="text-sm whitespace-nowrap">Subscription Info</span>}
//             </Link>
//           </li>

//           <li className="px-2 pb-4">
//             <Link to="/logout" className={`flex items-center py-2.5 rounded hover:bg-red-500/10 hover:text-red-400 transition-colors text-gray-400 ${showSidebar ? 'px-3 gap-3' : 'justify-center'}`}>
//               <LogOut size={20} className="shrink-0" />
//               {showSidebar && <span className="text-sm whitespace-nowrap">Logout</span>}
//             </Link>
//           </li>

//         </ul>
//       </nav>
//     </aside>
//   );
// };

// export default Sidebar;




// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { 
//   LayoutDashboard, Users, Database, ChevronDown, Circle, Plane, FileText,
//   CalendarDays, UserCheck, Store, UserCog, BarChart3, Settings, CircleUser, 
//   User, CreditCard, LogOut
// } from 'lucide-react';

// const Sidebar = ({ isExpanded }) => {
//   const [openDropdown, setOpenDropdown] = useState('');
//   const [activeTab, setActiveTab] = useState('Dashboard');
  
//   const [isHovered, setIsHovered] = useState(false);
//   const showSidebar = isExpanded || isHovered;

//   const handleMenuClick = (menuName) => {
//     setActiveTab(menuName);
//     setOpenDropdown(openDropdown === menuName ? '' : menuName);
//   };

//   const handleLinkClick = (menuName) => {
//     setActiveTab(menuName);
//     setOpenDropdown('');
//   };

//   return (
//     <aside 
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//       className={`fixed md:relative z-50 h-screen bg-[#1e2329] text-[#94a3b8] flex flex-col shrink-0 font-sans transition-all duration-300 ease-in-out border-r border-white/5 ${
//         showSidebar ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0 w-64 md:w-[72px]'
//       }`}
//     >
//       {/* Brand Header */}
//       <div className={`h-[72px] flex items-center border-b border-white/10 shrink-0 overflow-hidden whitespace-nowrap transition-all duration-300 ${showSidebar ? 'px-6' : 'px-0 justify-center'}`}>
//         {showSidebar ? (
//           <span className="text-lg font-bold text-white tracking-wide">Nepal Tour And Travels</span>
//         ) : (
//           <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
//             <span className="text-base font-bold text-white">NT</span> 
//           </div>
//         )}
//       </div>

//       {/* Navigation List */}
//       <nav className="flex-1 overflow-y-auto py-5 custom-scrollbar overflow-x-hidden">
//         <ul className="space-y-1.5 px-3">
          
//           <li>
//             <Link 
//               to="/" 
//               onClick={() => handleLinkClick('Dashboard')}
//               className={`flex items-center py-3 rounded-xl transition-all duration-200 ${showSidebar ? 'px-4 gap-3.5' : 'justify-center px-0'} ${
//                 activeTab === 'Dashboard' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-semibold' : 'hover:bg-white/5 hover:text-white font-medium'
//               }`}
//             >
//               <LayoutDashboard size={20} strokeWidth={activeTab === 'Dashboard' ? 2.5 : 2} className={`shrink-0 ${activeTab === 'Dashboard' ? 'text-white' : 'text-blue-400'}`} />
//               {showSidebar && <span className="text-[14px] whitespace-nowrap tracking-wide">Dashboard</span>}
//             </Link>
//           </li>

//           {/* --- Leads Dropdown --- */}
//           <li>
//             <button 
//               onClick={() => handleMenuClick('Leads')}
//               className={`w-full flex items-center py-3 rounded-xl transition-all duration-200 ${showSidebar ? 'justify-between px-4' : 'justify-center px-0'} ${
//                 activeTab === 'Leads' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-semibold' : 'hover:bg-white/5 hover:text-white font-medium'
//               }`}
//             >
//               <div className={`flex items-center ${showSidebar ? 'gap-3.5' : ''}`}>
//                 <Users size={20} strokeWidth={activeTab === 'Leads' ? 2.5 : 2} className={`shrink-0 ${activeTab === 'Leads' ? 'text-white' : 'text-cyan-400'}`} />
//                 {showSidebar && <span className="text-[14px] whitespace-nowrap tracking-wide">Leads</span>}
//               </div>
//               {showSidebar && <ChevronDown size={16} className={`transition-transform duration-200 opacity-70 ${openDropdown === 'Leads' ? 'rotate-180' : ''}`} />}
//             </button>
            
//             {showSidebar && openDropdown === 'Leads' && (
//               <ul className="mt-1 space-y-1 mb-2">
//                 <li><Link to="allleads" className="flex items-center gap-3 px-4 py-2.5 pl-11 text-[13.5px] font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg whitespace-nowrap transition-colors"><Circle size={6} className="fill-current text-cyan-400/50" /><span>All leads</span></Link></li>
//                 <li><Link to="/CreateLead" className="flex items-center gap-3 px-4 py-2.5 pl-11 text-[13.5px] font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg whitespace-nowrap transition-colors"><Circle size={6} className="fill-current text-cyan-400/50" /><span>Add new lead</span></Link></li>
//               </ul>
//             )}
//           </li>

//           {/* --- Masters Dropdown --- */}
//           <li>
//             <button 
//               onClick={() => handleMenuClick('Masters')}
//               className={`w-full flex items-center py-3 rounded-xl transition-all duration-200 ${showSidebar ? 'justify-between px-4' : 'justify-center px-0'} ${
//                 activeTab === 'Masters' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-semibold' : 'hover:bg-white/5 hover:text-white font-medium'
//               }`}
//             >
//               <div className={`flex items-center ${showSidebar ? 'gap-3.5' : ''}`}>
//                 <Database size={20} strokeWidth={activeTab === 'Masters' ? 2.5 : 2} className={`shrink-0 ${activeTab === 'Masters' ? 'text-white' : 'text-purple-400'}`} />
//                 {showSidebar && <span className="text-[14px] whitespace-nowrap tracking-wide">Masters</span>}
//               </div>
//               {showSidebar && <ChevronDown size={16} className={`transition-transform duration-200 opacity-70 ${openDropdown === 'Masters' ? 'rotate-180' : ''}`} />}
//             </button>
            
//             {showSidebar && openDropdown === 'Masters' && (
//               <ul className="mt-1 space-y-1 mb-2">
//                 <li><Link to="/masters/city" className="flex items-center gap-3 px-4 py-2.5 pl-11 text-[13.5px] font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg whitespace-nowrap transition-colors"><Circle size={6} className="fill-current text-purple-400/50" /><span>Cities</span></Link></li>
//                 <li><Link to="/masters/destinations" className="flex items-center gap-3 px-4 py-2.5 pl-11 text-[13.5px] font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg whitespace-nowrap transition-colors"><Circle size={6} className="fill-current text-purple-400/50" /><span>Destinations</span></Link></li>
//                 <li><Link to="/masters/hotels" className="flex items-center gap-3 px-4 py-2.5 pl-11 text-[13.5px] font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg whitespace-nowrap transition-colors"><Circle size={6} className="fill-current text-purple-400/50" /><span>Hotels</span></Link></li>
//                 <li><Link to="/masters/airlines" className="flex items-center gap-3 px-4 py-2.5 pl-11 text-[13.5px] font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg whitespace-nowrap transition-colors"><Plane size={14} className="opacity-70 text-purple-400/50" /><span>Airlines</span></Link></li>
//                 <li><Link to="/masters/cruises" className="flex items-center gap-3 px-4 py-2.5 pl-11 text-[13.5px] font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg whitespace-nowrap transition-colors"><Circle size={6} className="fill-current text-purple-400/50" /><span>Cruises</span></Link></li>
//                 <li><Link to="/masters/vehicles" className="flex items-center gap-3 px-4 py-2.5 pl-11 text-[13.5px] font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg whitespace-nowrap transition-colors"><Circle size={6} className="fill-current text-purple-400/50" /><span>Vehicles</span></Link></li>
//                 <li><Link to="/masters/sightseeing" className="flex items-center gap-3 px-4 py-2.5 pl-11 text-[13.5px] font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg whitespace-nowrap transition-colors"><Circle size={6} className="fill-current text-purple-400/50" /><span>Sightseeing</span></Link></li>
//                 <li><Link to="/masters/add-on-services" className="flex items-center gap-3 px-4 py-2.5 pl-11 text-[13.5px] font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg whitespace-nowrap transition-colors"><Circle size={6} className="fill-current text-purple-400/50" /><span>Add-on Services</span></Link></li>
//                 <li><Link to="/masters/testimonials" className="flex items-center gap-3 px-4 py-2.5 pl-11 text-[13.5px] font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg whitespace-nowrap transition-colors"><Circle size={6} className="fill-current text-purple-400/50" /><span>Testimonials</span></Link></li>
//               </ul>
//             )}
//           </li>

//           {/* --- Quotations Dropdown --- */}
//           <li>
//             <button 
//               onClick={() => handleMenuClick('Quotations')}
//               className={`w-full flex items-center py-3 rounded-xl transition-all duration-200 ${showSidebar ? 'justify-between px-4' : 'justify-center px-0'} ${
//                 activeTab === 'Quotations' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-semibold' : 'hover:bg-white/5 hover:text-white font-medium'
//               }`}
//             >
//               <div className={`flex items-center ${showSidebar ? 'gap-3.5' : ''}`}>
//                 <FileText size={20} strokeWidth={activeTab === 'Quotations' ? 2.5 : 2} className={`shrink-0 ${activeTab === 'Quotations' ? 'text-white' : 'text-emerald-400'}`} />
//                 {showSidebar && <span className="text-[14px] whitespace-nowrap tracking-wide">Quotations</span>}
//               </div>
//               {showSidebar && <ChevronDown size={16} className={`transition-transform duration-200 opacity-70 ${openDropdown === 'Quotations' ? 'rotate-180' : ''}`} />}
//             </button>
//             {showSidebar && openDropdown === 'Quotations' && (
//               <ul className="mt-1 space-y-1 mb-2">
//                 <li><Link to="/quotations/templates" className="flex items-center gap-3 px-4 py-2.5 pl-11 text-[13.5px] font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg whitespace-nowrap transition-colors"><Circle size={6} className="fill-current text-emerald-400/50" /><span>Templates</span></Link></li>
//               </ul>
//             )}
//           </li>

//           {/* --- Bookings Dropdown --- */}
//           <li>
//             <button 
//               onClick={() => handleMenuClick('Bookings')}
//               className={`w-full flex items-center py-3 rounded-xl transition-all duration-200 ${showSidebar ? 'justify-between px-4' : 'justify-center px-0'} ${
//                 activeTab === 'Bookings' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-semibold' : 'hover:bg-white/5 hover:text-white font-medium'
//               }`}
//             >
//               <div className={`flex items-center ${showSidebar ? 'gap-3.5' : ''}`}>
//                 <CalendarDays size={20} strokeWidth={activeTab === 'Bookings' ? 2.5 : 2} className={`shrink-0 ${activeTab === 'Bookings' ? 'text-white' : 'text-orange-400'}`} />
//                 {showSidebar && <span className="text-[14px] whitespace-nowrap tracking-wide">Bookings</span>}
//               </div>
//               {showSidebar && <ChevronDown size={16} className={`transition-transform duration-200 opacity-70 ${openDropdown === 'Bookings' ? 'rotate-180' : ''}`} />}
//             </button>
//             {showSidebar && openDropdown === 'Bookings' && (
//               <ul className="mt-1 space-y-1 mb-2">
//                 <li><Link to="/bookings" className="flex items-center gap-3 px-4 py-2.5 pl-11 text-[13.5px] font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg whitespace-nowrap transition-colors"><Circle size={6} className="fill-current text-orange-400/50" /><span>All Bookings</span></Link></li>
//                 <li><Link to="/add-booking" className="flex items-center gap-3 px-4 py-2.5 pl-11 text-[13.5px] font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg whitespace-nowrap transition-colors"><Circle size={6} className="fill-current text-orange-400/50" /><span>Add New Booking</span></Link></li>
//               </ul>
//             )}
//           </li>

//           {/* --- Customers Dropdown --- */}
//           <li>
//             <button 
//               onClick={() => handleMenuClick('Customers')}
//               className={`w-full flex items-center py-3 rounded-xl transition-all duration-200 ${showSidebar ? 'justify-between px-4' : 'justify-center px-0'} ${
//                 activeTab === 'Customers' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-semibold' : 'hover:bg-white/5 hover:text-white font-medium'
//               }`}
//             >
//               <div className={`flex items-center ${showSidebar ? 'gap-3.5' : ''}`}>
//                 <UserCheck size={20} strokeWidth={activeTab === 'Customers' ? 2.5 : 2} className={`shrink-0 ${activeTab === 'Customers' ? 'text-white' : 'text-teal-400'}`} />
//                 {showSidebar && <span className="text-[14px] whitespace-nowrap tracking-wide">Customers</span>}
//               </div>
//               {showSidebar && <ChevronDown size={16} className={`transition-transform duration-200 opacity-70 ${openDropdown === 'Customers' ? 'rotate-180' : ''}`} />}
//             </button>
//             {showSidebar && openDropdown === 'Customers' && (
//               <ul className="mt-1 space-y-1 mb-2">
//                 <li><Link to="/customers" className="flex items-center gap-3 px-4 py-2.5 pl-11 text-[13.5px] font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg whitespace-nowrap transition-colors"><Circle size={6} className="fill-current text-teal-400/50" /><span>All Customers</span></Link></li>
//                 <li><Link to="/add-customer" className="flex items-center gap-3 px-4 py-2.5 pl-11 text-[13.5px] font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg whitespace-nowrap transition-colors"><Circle size={6} className="fill-current text-teal-400/50" /><span>Add New Customer</span></Link></li>
//               </ul>
//             )}
//           </li>

//           {/* --- Vendors Dropdown --- */}
//           <li>
//             <button 
//               onClick={() => handleMenuClick('Vendors')}
//               className={`w-full flex items-center py-3 rounded-xl transition-all duration-200 ${showSidebar ? 'justify-between px-4' : 'justify-center px-0'} ${
//                 activeTab === 'Vendors' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-semibold' : 'hover:bg-white/5 hover:text-white font-medium'
//               }`}
//             >
//               <div className={`flex items-center ${showSidebar ? 'gap-3.5' : ''}`}>
//                 <Store size={20} strokeWidth={activeTab === 'Vendors' ? 2.5 : 2} className={`shrink-0 ${activeTab === 'Vendors' ? 'text-white' : 'text-amber-400'}`} />
//                 {showSidebar && <span className="text-[14px] whitespace-nowrap tracking-wide">Vendors</span>}
//               </div>
//               {showSidebar && <ChevronDown size={16} className={`transition-transform duration-200 opacity-70 ${openDropdown === 'Vendors' ? 'rotate-180' : ''}`} />}
//             </button>
//             {showSidebar && openDropdown === 'Vendors' && (
//               <ul className="mt-1 space-y-1 mb-2">
//                 <li><Link to="/vendors" className="flex items-center gap-3 px-4 py-2.5 pl-11 text-[13.5px] font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg whitespace-nowrap transition-colors"><Circle size={6} className="fill-current text-amber-400/50" /><span>All Vendors</span></Link></li>
//                 <li><Link to="/add-vendor" className="flex items-center gap-3 px-4 py-2.5 pl-11 text-[13.5px] font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg whitespace-nowrap transition-colors"><Circle size={6} className="fill-current text-amber-400/50" /><span>Add New Vendor</span></Link></li>
//               </ul>
//             )}
//           </li>

//           {/* --- Users Dropdown --- */}
//           <li>
//             <button 
//               onClick={() => handleMenuClick('Users')}
//               className={`w-full flex items-center py-3 rounded-xl transition-all duration-200 ${showSidebar ? 'justify-between px-4' : 'justify-center px-0'} ${
//                 activeTab === 'Users' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-semibold' : 'hover:bg-white/5 hover:text-white font-medium'
//               }`}
//             >
//               <div className={`flex items-center ${showSidebar ? 'gap-3.5' : ''}`}>
//                 <UserCog size={20} strokeWidth={activeTab === 'Users' ? 2.5 : 2} className={`shrink-0 ${activeTab === 'Users' ? 'text-white' : 'text-pink-400'}`} />
//                 {showSidebar && <span className="text-[14px] whitespace-nowrap tracking-wide">Users</span>}
//               </div>
//               {showSidebar && <ChevronDown size={16} className={`transition-transform duration-200 opacity-70 ${openDropdown === 'Users' ? 'rotate-180' : ''}`} />}
//             </button>
//             {showSidebar && openDropdown === 'Users' && (
//               <ul className="mt-1 space-y-1 mb-2">
//                 <li><Link to="/users" className="flex items-center gap-3 px-4 py-2.5 pl-11 text-[13.5px] font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg whitespace-nowrap transition-colors"><Circle size={6} className="fill-current text-pink-400/50" /><span>All Users</span></Link></li>
//                 <li><Link to="/add-user" className="flex items-center gap-3 px-4 py-2.5 pl-11 text-[13.5px] font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg whitespace-nowrap transition-colors"><Circle size={6} className="fill-current text-pink-400/50" /><span>Add New User</span></Link></li>
//                 <li><Link to="/users/permission-templates" className="flex items-center gap-3 px-4 py-2.5 pl-11 text-[13.5px] font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg whitespace-nowrap transition-colors"><Circle size={6} className="fill-current text-pink-400/50" /><span>Permission Templates</span></Link></li>
//               </ul>
//             )}
//           </li>

//           {/* --- Reports (Normal Link) --- */}
//           <li>
//             <Link 
//               to="/reports" 
//               onClick={() => handleLinkClick('Reports')}
//               className={`flex items-center py-3 rounded-xl transition-all duration-200 ${showSidebar ? 'px-4 gap-3.5' : 'justify-center px-0'} ${
//                 activeTab === 'Reports' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-semibold' : 'hover:bg-white/5 hover:text-white font-medium'
//               }`}
//             >
//               <BarChart3 size={20} strokeWidth={activeTab === 'Reports' ? 2.5 : 2} className={`shrink-0 ${activeTab === 'Reports' ? 'text-white' : 'text-indigo-400'}`} />
//               {showSidebar && <span className="text-[14px] whitespace-nowrap tracking-wide">Reports</span>}
//             </Link>
//           </li>

//           {/* Divider */}
//           <li className="py-2 px-2">
//             <div className="h-px bg-white/10 w-full rounded-full"></div>
//           </li>

//           {/* Settings & Bottom links */}
//           <li>
//             <Link 
//               to="/settings" 
//               onClick={() => handleLinkClick('Settings')}
//               className={`flex items-center py-3 rounded-xl transition-all duration-200 ${showSidebar ? 'px-4 gap-3.5' : 'justify-center px-0'} ${
//                 activeTab === 'Settings' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-semibold' : 'hover:bg-white/5 hover:text-white font-medium'
//               }`}
//             >
//               <Settings size={20} strokeWidth={activeTab === 'Settings' ? 2.5 : 2} className={`shrink-0 ${activeTab === 'Settings' ? 'text-white' : 'text-slate-400'}`} />
//               {showSidebar && <span className="text-[14px] whitespace-nowrap tracking-wide">Settings</span>}
//             </Link>
//           </li>

//           <li>
//             <Link 
//               to="/account" 
//               onClick={() => handleLinkClick('Account')}
//               className={`flex items-center py-3 rounded-xl transition-all duration-200 ${showSidebar ? 'px-4 gap-3.5' : 'justify-center px-0'} ${
//                 activeTab === 'Account' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-semibold' : 'hover:bg-white/5 hover:text-white font-medium'
//               }`}
//             >
//               <CircleUser size={20} strokeWidth={activeTab === 'Account' ? 2.5 : 2} className={`shrink-0 ${activeTab === 'Account' ? 'text-white' : 'text-slate-400'}`} />
//               {showSidebar && <span className="text-[14px] whitespace-nowrap tracking-wide">Account</span>}
//             </Link>
//           </li>

//           <li>
//             <Link 
//               to="/profile" 
//               onClick={() => handleLinkClick('Profile')}
//               className={`flex items-center py-3 rounded-xl transition-all duration-200 ${showSidebar ? 'px-4 gap-3.5' : 'justify-center px-0'} ${
//                 activeTab === 'Profile' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-semibold' : 'hover:bg-white/5 hover:text-white font-medium'
//               }`}
//             >
//               <User size={20} strokeWidth={activeTab === 'Profile' ? 2.5 : 2} className={`shrink-0 ${activeTab === 'Profile' ? 'text-white' : 'text-slate-400'}`} />
//               {showSidebar && <span className="text-[14px] whitespace-nowrap tracking-wide">Profile</span>}
//             </Link>
//           </li>

//           <li>
//             <Link 
//               to="/subscription" 
//               onClick={() => handleLinkClick('Subscription')}
//               className={`flex items-center py-3 rounded-xl transition-all duration-200 ${showSidebar ? 'px-4 gap-3.5' : 'justify-center px-0'} ${
//                 activeTab === 'Subscription' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-semibold' : 'hover:bg-white/5 hover:text-white font-medium'
//               }`}
//             >
//               <CreditCard size={20} strokeWidth={activeTab === 'Subscription' ? 2.5 : 2} className={`shrink-0 ${activeTab === 'Subscription' ? 'text-white' : 'text-slate-400'}`} />
//               {showSidebar && <span className="text-[14px] whitespace-nowrap tracking-wide">Subscription Info</span>}
//             </Link>
//           </li>

//           <li className="pb-4 pt-2">
//             <Link to="/logout" className={`flex items-center py-3 rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-colors text-slate-400 font-medium ${showSidebar ? 'px-4 gap-3.5' : 'justify-center px-0'}`}>
//               <LogOut size={20} strokeWidth={2} className="shrink-0 text-red-400/80" />
//               {showSidebar && <span className="text-[14px] whitespace-nowrap tracking-wide">Logout</span>}
//             </Link>
//           </li>

//         </ul>
//       </nav>
//     </aside>
//   );
// };

// export default Sidebar;
















// Sidebar

// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { 
//   LayoutDashboard, Users, Database, ChevronDown, Circle, Plane, FileText,
//   CalendarDays, UserCheck, Store, UserCog, BarChart3, Settings, CircleUser, 
//   User, CreditCard, LogOut, Bell, BellRing, Clock, CalendarClock
// } from 'lucide-react';

// const Sidebar = ({ isExpanded }) => {
//   const [openDropdown, setOpenDropdown] = useState('');
//   const [activeTab, setActiveTab] = useState('Dashboard');
  
//   const [isHovered, setIsHovered] = useState(false);
//   const showSidebar = isExpanded || isHovered;

//   const handleMenuClick = (menuName) => {
//     setActiveTab(menuName);
//     setOpenDropdown(openDropdown === menuName ? '' : menuName);
//   };

//   const handleLinkClick = (menuName) => {
//     setActiveTab(menuName);
//     setOpenDropdown('');
//   };

//   // 👉 Naya Function: Logout handle karne ke liye
//   const handleLogout = () => {
//     const confirmLogout = window.confirm("Are you sure you want to log out?");
//     if (confirmLogout) {
//       localStorage.removeItem('token');
//       localStorage.removeItem('userRole');
//       localStorage.removeItem('userEmail');
//       window.location.href = '/login'; 
//     }
//   };

//   return (
//     <aside 
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//       className={`fixed md:relative z-50 h-screen bg-[#1e2329] text-[#94a3b8] flex flex-col shrink-0 font-sans transition-all duration-300 ease-in-out border-r border-white/5 ${
//         showSidebar ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0 w-64 md:w-[72px]'
//       }`}
//     >
//       {/* Brand Header */}
//       <div className={`h-[72px] flex items-center border-b border-white/10 shrink-0 overflow-hidden whitespace-nowrap transition-all duration-300 ${showSidebar ? 'px-6' : 'px-0 justify-center'}`}>
//         {showSidebar ? (
//           <span className="text-lg font-bold text-white tracking-wide">Nepal Tour And Travels</span>
//         ) : (
//           <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
//             <span className="text-base font-bold text-white">NT</span> 
//           </div>
//         )}
//       </div>

//       {/* Navigation List */}
//       <nav className="flex-1 overflow-y-auto py-5 custom-scrollbar overflow-x-hidden">
//         <ul className="space-y-1.5 px-3">
          
//           <li>
//             <Link 
//               to="/" 
//               onClick={() => handleLinkClick('Dashboard')}
//               className={`flex items-center py-3 rounded-xl transition-all duration-200 ${showSidebar ? 'px-4 gap-3.5' : 'justify-center px-0'} ${
//                 activeTab === 'Dashboard' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-semibold' : 'hover:bg-white/5 hover:text-white font-medium'
//               }`}
//             >
//               <LayoutDashboard size={20} strokeWidth={activeTab === 'Dashboard' ? 2.5 : 2} className={`shrink-0 ${activeTab === 'Dashboard' ? 'text-white' : 'text-blue-400'}`} />
//               {showSidebar && <span className="text-[14px] whitespace-nowrap tracking-wide">Dashboard</span>}
//             </Link>
//           </li>

//           {/* --- Leads Dropdown --- */}
//           <li>
//             <button 
//               onClick={() => handleMenuClick('Leads')}
//               className={`w-full flex items-center py-3 rounded-xl transition-all duration-200 ${showSidebar ? 'justify-between px-4' : 'justify-center px-0'} ${
//                 activeTab === 'Leads' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-semibold' : 'hover:bg-white/5 hover:text-white font-medium'
//               }`}
//             >
//               <div className={`flex items-center ${showSidebar ? 'gap-3.5' : ''}`}>
//                 <Users size={20} strokeWidth={activeTab === 'Leads' ? 2.5 : 2} className={`shrink-0 ${activeTab === 'Leads' ? 'text-white' : 'text-cyan-400'}`} />
//                 {showSidebar && <span className="text-[14px] whitespace-nowrap tracking-wide">Leads</span>}
//               </div>
//               {showSidebar && <ChevronDown size={16} className={`transition-transform duration-200 opacity-70 ${openDropdown === 'Leads' ? 'rotate-180' : ''}`} />}
//             </button>
            
//             {showSidebar && openDropdown === 'Leads' && (
//               <ul className="mt-1 space-y-1 mb-2">
//                 <li><Link to="allleads" className="flex items-center gap-3 px-4 py-2.5 pl-11 text-[13.5px] font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg whitespace-nowrap transition-colors"><Circle size={6} className="fill-current text-cyan-400/50" /><span>All leads</span></Link></li>
//                 <li><Link to="/CreateLead" className="flex items-center gap-3 px-4 py-2.5 pl-11 text-[13.5px] font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg whitespace-nowrap transition-colors"><Circle size={6} className="fill-current text-cyan-400/50" /><span>Add new lead</span></Link></li>
//               </ul>
//             )}
//           </li>

//           {/* --- Reminders Dropdown --- */}
// <li>
//   <button
//     onClick={() => handleMenuClick("Reminders")}
//     className={`w-full flex items-center py-3 rounded-xl transition-all duration-200 ${
//       showSidebar ? "justify-between px-4" : "justify-center px-0"
//     } ${
//       activeTab === "Reminders"
//         ? "bg-blue-600 text-white shadow-md shadow-blue-600/20 font-semibold"
//         : "hover:bg-white/5 hover:text-white font-medium"
//     }`}
//   >
//     <div className={`flex items-center ${showSidebar ? "gap-3.5" : ""}`}>
//       <BellRing
//         size={20}
//         strokeWidth={activeTab === "Reminders" ? 2.5 : 2}
//         className={`shrink-0 ${
//           activeTab === "Reminders"
//             ? "text-white"
//             : "text-rose-400"
//         }`}
//       />
//       {showSidebar && (
//         <span className="text-[14px] whitespace-nowrap tracking-wide">
//           Reminders
//         </span>
//       )}
//     </div>

//     {showSidebar && (
//       <ChevronDown
//         size={16}
//         className={`transition-transform duration-200 opacity-70 ${
//           openDropdown === "Reminders" ? "rotate-180" : ""
//         }`}
//       />
//     )}
//   </button>

//   {showSidebar && openDropdown === "Reminders" && (
//     <ul className="mt-1 space-y-1 mb-2">

//       <li>
//         <Link
//           to="/reminders"
//           className="flex items-center gap-3 px-4 py-2.5 pl-11 text-[13.5px] font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg whitespace-nowrap transition-colors"
//         >
//           <Bell size={14} className="text-rose-400/60" />
//           <span>My Reminders</span>
//         </Link>
//       </li>

//       <li>
//         <Link
//           to="/BookingReminders"
//           className="flex items-center gap-3 px-4 py-2.5 pl-11 text-[13.5px] font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg whitespace-nowrap transition-colors"
//         >
//           <CalendarClock size={14} className="text-rose-400/60" />
//           <span>Booking Reminders</span>
//         </Link>
//       </li>

//       <li>
//         <Link
//           to="/Notifications"
//           className="flex items-center gap-3 px-4 py-2.5 pl-11 text-[13.5px] font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg whitespace-nowrap transition-colors"
//         >
//           <BellRing size={14} className="text-rose-400/60" />
//           <span>Notifications</span>
//         </Link>
//       </li>

//       <li>
//         <Link
//           to="/NotificationSettings"
//           className="flex items-center gap-3 px-4 py-2.5 pl-11 text-[13.5px] font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg whitespace-nowrap transition-colors"
//         >
//           <Settings size={14} className="text-rose-400/60" />
//           <span>Notification Settings</span>
//         </Link>
//       </li>
//     </ul>
//   )}
// </li>

//           {/* --- Masters Dropdown --- */}
//           <li>
//             <button 
//               onClick={() => handleMenuClick('Masters')}
//               className={`w-full flex items-center py-3 rounded-xl transition-all duration-200 ${showSidebar ? 'justify-between px-4' : 'justify-center px-0'} ${
//                 activeTab === 'Masters' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-semibold' : 'hover:bg-white/5 hover:text-white font-medium'
//               }`}
//             >
//               <div className={`flex items-center ${showSidebar ? 'gap-3.5' : ''}`}>
//                 <Database size={20} strokeWidth={activeTab === 'Masters' ? 2.5 : 2} className={`shrink-0 ${activeTab === 'Masters' ? 'text-white' : 'text-purple-400'}`} />
//                 {showSidebar && <span className="text-[14px] whitespace-nowrap tracking-wide">Masters</span>}
//               </div>
//               {showSidebar && <ChevronDown size={16} className={`transition-transform duration-200 opacity-70 ${openDropdown === 'Masters' ? 'rotate-180' : ''}`} />}
//             </button>
            
//             {showSidebar && openDropdown === 'Masters' && (
//               <ul className="mt-1 space-y-1 mb-2">
//                 <li><Link to="/masters/city" className="flex items-center gap-3 px-4 py-2.5 pl-11 text-[13.5px] font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg whitespace-nowrap transition-colors"><Circle size={6} className="fill-current text-purple-400/50" /><span>Cities</span></Link></li>
//                 <li><Link to="/masters/destinations" className="flex items-center gap-3 px-4 py-2.5 pl-11 text-[13.5px] font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg whitespace-nowrap transition-colors"><Circle size={6} className="fill-current text-purple-400/50" /><span>Destinations</span></Link></li>
//                 <li><Link to="/masters/hotels" className="flex items-center gap-3 px-4 py-2.5 pl-11 text-[13.5px] font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg whitespace-nowrap transition-colors"><Circle size={6} className="fill-current text-purple-400/50" /><span>Hotels</span></Link></li>
//                 <li><Link to="/masters/airlines" className="flex items-center gap-3 px-4 py-2.5 pl-11 text-[13.5px] font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg whitespace-nowrap transition-colors"><Plane size={14} className="opacity-70 text-purple-400/50" /><span>Airlines</span></Link></li>
//                 <li><Link to="/masters/cruises" className="flex items-center gap-3 px-4 py-2.5 pl-11 text-[13.5px] font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg whitespace-nowrap transition-colors"><Circle size={6} className="fill-current text-purple-400/50" /><span>Cruises</span></Link></li>
//                 <li><Link to="/masters/vehicles" className="flex items-center gap-3 px-4 py-2.5 pl-11 text-[13.5px] font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg whitespace-nowrap transition-colors"><Circle size={6} className="fill-current text-purple-400/50" /><span>Vehicles</span></Link></li>
//                 <li><Link to="/masters/sightseeing" className="flex items-center gap-3 px-4 py-2.5 pl-11 text-[13.5px] font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg whitespace-nowrap transition-colors"><Circle size={6} className="fill-current text-purple-400/50" /><span>Sightseeing</span></Link></li>
//                 <li><Link to="/masters/add-on-services" className="flex items-center gap-3 px-4 py-2.5 pl-11 text-[13.5px] font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg whitespace-nowrap transition-colors"><Circle size={6} className="fill-current text-purple-400/50" /><span>Add-on Services</span></Link></li>
//                 <li><Link to="/masters/testimonials" className="flex items-center gap-3 px-4 py-2.5 pl-11 text-[13.5px] font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg whitespace-nowrap transition-colors"><Circle size={6} className="fill-current text-purple-400/50" /><span>Testimonials</span></Link></li>
//               </ul>
//             )}
//           </li>

//           {/* --- Quotations Dropdown --- */}
//           <li>
//             <button 
//               onClick={() => handleMenuClick('Quotations')}
//               className={`w-full flex items-center py-3 rounded-xl transition-all duration-200 ${showSidebar ? 'justify-between px-4' : 'justify-center px-0'} ${
//                 activeTab === 'Quotations' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-semibold' : 'hover:bg-white/5 hover:text-white font-medium'
//               }`}
//             >
//               <div className={`flex items-center ${showSidebar ? 'gap-3.5' : ''}`}>
//                 <FileText size={20} strokeWidth={activeTab === 'Quotations' ? 2.5 : 2} className={`shrink-0 ${activeTab === 'Quotations' ? 'text-white' : 'text-emerald-400'}`} />
//                 {showSidebar && <span className="text-[14px] whitespace-nowrap tracking-wide">Quotations</span>}
//               </div>
//               {showSidebar && <ChevronDown size={16} className={`transition-transform duration-200 opacity-70 ${openDropdown === 'Quotations' ? 'rotate-180' : ''}`} />}
//             </button>
//             {showSidebar && openDropdown === 'Quotations' && (
//               <ul className="mt-1 space-y-1 mb-2">
//                 <li><Link to="/quotations/templates" className="flex items-center gap-3 px-4 py-2.5 pl-11 text-[13.5px] font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg whitespace-nowrap transition-colors"><Circle size={6} className="fill-current text-emerald-400/50" /><span>Templates</span></Link></li>
//               </ul>
//             )}
//           </li>

//           {/* --- Bookings Dropdown --- */}
//           <li>
//             <button 
//               onClick={() => handleMenuClick('Bookings')}
//               className={`w-full flex items-center py-3 rounded-xl transition-all duration-200 ${showSidebar ? 'justify-between px-4' : 'justify-center px-0'} ${
//                 activeTab === 'Bookings' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-semibold' : 'hover:bg-white/5 hover:text-white font-medium'
//               }`}
//             >
//               <div className={`flex items-center ${showSidebar ? 'gap-3.5' : ''}`}>
//                 <CalendarDays size={20} strokeWidth={activeTab === 'Bookings' ? 2.5 : 2} className={`shrink-0 ${activeTab === 'Bookings' ? 'text-white' : 'text-orange-400'}`} />
//                 {showSidebar && <span className="text-[14px] whitespace-nowrap tracking-wide">Bookings</span>}
//               </div>
//               {showSidebar && <ChevronDown size={16} className={`transition-transform duration-200 opacity-70 ${openDropdown === 'Bookings' ? 'rotate-180' : ''}`} />}
//             </button>
//             {showSidebar && openDropdown === 'Bookings' && (
//               <ul className="mt-1 space-y-1 mb-2">
//                 <li><Link to="/Allbookings" className="flex items-center gap-3 px-4 py-2.5 pl-11 text-[13.5px] font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg whitespace-nowrap transition-colors"><Circle size={6} className="fill-current text-orange-400/50" /><span>All Bookings</span></Link></li>
//                 <li><Link to="/allleads" className="flex items-center gap-3 px-4 py-2.5 pl-11 text-[13.5px] font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg whitespace-nowrap transition-colors"><Circle size={6} className="fill-current text-orange-400/50" /><span>Add New Booking</span></Link></li>
//               </ul>
//             )}
//           </li>

//           {/* --- Customers Dropdown --- */}
//           <li>
//             <button 
//               onClick={() => handleMenuClick('Customers')}
//               className={`w-full flex items-center py-3 rounded-xl transition-all duration-200 ${showSidebar ? 'justify-between px-4' : 'justify-center px-0'} ${
//                 activeTab === 'Customers' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-semibold' : 'hover:bg-white/5 hover:text-white font-medium'
//               }`}
//             >
//               <div className={`flex items-center ${showSidebar ? 'gap-3.5' : ''}`}>
//                 <UserCheck size={20} strokeWidth={activeTab === 'Customers' ? 2.5 : 2} className={`shrink-0 ${activeTab === 'Customers' ? 'text-white' : 'text-teal-400'}`} />
//                 {showSidebar && <span className="text-[14px] whitespace-nowrap tracking-wide">Customers</span>}
//               </div>
//               {showSidebar && <ChevronDown size={16} className={`transition-transform duration-200 opacity-70 ${openDropdown === 'Customers' ? 'rotate-180' : ''}`} />}
//             </button>
//             {showSidebar && openDropdown === 'Customers' && (
//               <ul className="mt-1 space-y-1 mb-2">
//                 <li><Link to="/AllCustomers" className="flex items-center gap-3 px-4 py-2.5 pl-11 text-[13.5px] font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg whitespace-nowrap transition-colors"><Circle size={6} className="fill-current text-teal-400/50" /><span>All Customers</span></Link></li>
//                 <li><Link to="/Createcustomer" className="flex items-center gap-3 px-4 py-2.5 pl-11 text-[13.5px] font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg whitespace-nowrap transition-colors"><Circle size={6} className="fill-current text-teal-400/50" /><span>Add New Customer</span></Link></li>
//               </ul>
//             )}
//           </li>

//           {/* --- Vendors Dropdown --- */}
//           <li>
//             <button 
//               onClick={() => handleMenuClick('Vendors')}
//               className={`w-full flex items-center py-3 rounded-xl transition-all duration-200 ${showSidebar ? 'justify-between px-4' : 'justify-center px-0'} ${
//                 activeTab === 'Vendors' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-semibold' : 'hover:bg-white/5 hover:text-white font-medium'
//               }`}
//             >
//               <div className={`flex items-center ${showSidebar ? 'gap-3.5' : ''}`}>
//                 <Store size={20} strokeWidth={activeTab === 'Vendors' ? 2.5 : 2} className={`shrink-0 ${activeTab === 'Vendors' ? 'text-white' : 'text-amber-400'}`} />
//                 {showSidebar && <span className="text-[14px] whitespace-nowrap tracking-wide">Vendors</span>}
//               </div>
//               {showSidebar && <ChevronDown size={16} className={`transition-transform duration-200 opacity-70 ${openDropdown === 'Vendors' ? 'rotate-180' : ''}`} />}
//             </button>
//             {showSidebar && openDropdown === 'Vendors' && (
//               <ul className="mt-1 space-y-1 mb-2">
//                 <li><Link to="/AllVendors" className="flex items-center gap-3 px-4 py-2.5 pl-11 text-[13.5px] font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg whitespace-nowrap transition-colors"><Circle size={6} className="fill-current text-amber-400/50" /><span>All Vendors</span></Link></li>
//                 <li><Link to="/CreateVendor" className="flex items-center gap-3 px-4 py-2.5 pl-11 text-[13.5px] font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg whitespace-nowrap transition-colors"><Circle size={6} className="fill-current text-amber-400/50" /><span>Add New Vendor</span></Link></li>
//               </ul>
//             )}
//           </li>
          

//           {/* --- Users Dropdown --- */}
// <li>
//   <button
//     onClick={() => handleMenuClick('Users')}
//     className={`w-full flex items-center py-3 rounded-xl transition-all duration-200 ${
//       showSidebar ? 'justify-between px-4' : 'justify-center px-0'
//     } ${
//       activeTab === 'Users'
//         ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-semibold'
//         : 'hover:bg-white/5 hover:text-white font-medium'
//     }`}
//   >
//     <div className={`flex items-center ${showSidebar ? 'gap-3.5' : ''}`}>
//       <UserCog
//         size={20}
//         strokeWidth={activeTab === 'Users' ? 2.5 : 2}
//         className={`shrink-0 ${
//           activeTab === 'Users' ? 'text-white' : 'text-pink-400'
//         }`}
//       />
//       {showSidebar && (
//         <span className="text-[14px] whitespace-nowrap tracking-wide">
//           Users
//         </span>
//       )}
//     </div>

//     {showSidebar && (
//       <ChevronDown
//         size={16}
//         className={`transition-transform duration-200 opacity-70 ${
//           openDropdown === 'Users' ? 'rotate-180' : ''
//         }`}
//       />
//     )}
//   </button>

//   {showSidebar && openDropdown === 'Users' && (
//     <ul className="mt-1 space-y-1 mb-2">

//       <li>
//         <Link
//           to="/Users"
//           className="flex items-center gap-3 px-4 py-2.5 pl-11 text-[13.5px] font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg whitespace-nowrap transition-colors"
//         >
//           <Circle size={6} className="fill-current text-pink-400/50" />
//           <span>All Users</span>
//         </Link>
//       </li>

//       <li>
//         <Link
//           to="/CreateUser"
//           className="flex items-center gap-3 px-4 py-2.5 pl-11 text-[13.5px] font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg whitespace-nowrap transition-colors"
//         >
//           <Circle size={6} className="fill-current text-pink-400/50" />
//           <span>Add New User</span>
//         </Link>
//       </li>

//       <li>
//         <Link
//           to="/PermissionTemplates"
//           className="flex items-center gap-3 px-4 py-2.5 pl-11 text-[13.5px] font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg whitespace-nowrap transition-colors"
//         >
//           <Circle size={6} className="fill-current text-pink-400/50" />
//           <span>Permission Templates</span>
//         </Link>
//       </li>

//     </ul>
//   )}
// </li>


//           {/* --- Organization Dropdown --- */}
//           {/* <li>
//           <li>

//             <button 
//               onClick={() => handleMenuClick('Organization')}
//               className={`w-full flex items-center py-3 rounded-xl transition-all duration-200 ${showSidebar ? 'justify-between px-4' : 'justify-center px-0'} ${
//                 activeTab === 'Organization' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-semibold' : 'hover:bg-white/5 hover:text-white font-medium'
//               }`}
//             >
//               <div className={`flex items-center ${showSidebar ? 'gap-3.5' : ''}`}>
//                 <UserCog size={20} strokeWidth={activeTab === 'Organization' ? 2.5 : 2} className={`shrink-0 ${activeTab === 'Organization' ? 'text-white' : 'text-pink-400'}`} />
//                 {showSidebar && <span className="text-[14px] whitespace-nowrap tracking-wide">Organization</span>}
//               </div>
//               {showSidebar && <ChevronDown size={16} className={`transition-transform duration-200 opacity-70 ${openDropdown === 'Organization' ? 'rotate-180' : ''}`} />}
//             </button>
//             {showSidebar && openDropdown === 'Organization' && (
//               <ul className="mt-1 space-y-1 mb-2">
//                 <li><Link to="/allorganization" className="flex items-center gap-3 px-4 py-2.5 pl-11 text-[13.5px] font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg whitespace-nowrap transition-colors"><Circle size={6} className="fill-current text-pink-400/50" /><span>All Organization</span></Link></li>
//                 {/* <li><Link to="/add-user" className="flex items-center gap-3 px-4 py-2.5 pl-11 text-[13.5px] font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg whitespace-nowrap transition-colors"><Circle size={6} className="fill-current text-pink-400/50" /><span>Add New Organization</span></Link></li>
//                 <li><Link to="/users/permission-templates" className="flex items-center gap-3 px-4 py-2.5 pl-11 text-[13.5px] font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg whitespace-nowrap transition-colors"><Circle size={6} className="fill-current text-pink-400/50" /><span>Permission Templates</span></Link></li> */}
//               {/* </ul>
//             )}
//           </li> */} 


// {/* --- Organization Dropdown --- */}

// <li>
//   <button
//     onClick={() => handleMenuClick('Organization')}
//     className={`w-full flex items-center py-3 rounded-xl transition-all duration-200 ${
//       showSidebar ? 'justify-between px-4' : 'justify-center px-0'
//     } ${
//       activeTab === 'Organization'
//         ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-semibold'
//         : 'hover:bg-white/5 hover:text-white font-medium'
//     }`}
//   >
//     <div className={`flex items-center ${showSidebar ? 'gap-3.5' : ''}`}>
//       <UserCog
//         size={20}
//         strokeWidth={activeTab === 'Organization' ? 2.5 : 2}
//         className={`shrink-0 ${
//           activeTab === 'Organization'
//             ? 'text-white'
//             : 'text-pink-400'
//         }`}
//       />
//       {showSidebar && (
//         <span className="text-[14px] whitespace-nowrap tracking-wide">
//           Organization
//         </span>
//       )}
//     </div>

//     {showSidebar && (
//       <ChevronDown
//         size={16}
//         className={`transition-transform duration-200 opacity-70 ${
//           openDropdown === 'Organization' ? 'rotate-180' : ''
//         }`}
//       />
//     )}
//   </button>

//   {showSidebar && openDropdown === 'Organization' && (
//     <ul className="mt-1 space-y-1 mb-2">
//       <li>
//         <Link
//           to="/allorganization"
//           className="flex items-center gap-3 px-4 py-2.5 pl-11 text-[13.5px] font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg whitespace-nowrap transition-colors"
//         >
//           <Circle size={6} className="fill-current text-pink-400/50" />
//           <span>All Organization</span>
//         </Link>
//       </li>

//       <li>
//         <Link
//           to="/CreateOrganization"
//           className="flex items-center gap-3 px-4 py-2.5 pl-11 text-[13.5px] font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg whitespace-nowrap transition-colors"
//         >
//           <Circle size={6} className="fill-current text-pink-400/50" />
//           <span>Add New Organization</span>
//         </Link>
//       </li>
//     </ul>
//   )}
// </li>

          

//           {/* --- Reports (Normal Link) --- */}
//           <li>
//             <Link 
//               to="/ReportsDashboard" 
//               onClick={() => handleLinkClick('Reports')}
//               className={`flex items-center py-3 rounded-xl transition-all duration-200 ${showSidebar ? 'px-4 gap-3.5' : 'justify-center px-0'} ${
//                 activeTab === 'Reports' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-semibold' : 'hover:bg-white/5 hover:text-white font-medium'
//               }`}
//             >
//               <BarChart3 size={20} strokeWidth={activeTab === 'Reports' ? 2.5 : 2} className={`shrink-0 ${activeTab === 'Reports' ? 'text-white' : 'text-indigo-400'}`} />
//               {showSidebar && <span className="text-[14px] whitespace-nowrap tracking-wide">Reports</span>}
//             </Link>
//           </li>

//           {/* Divider */}
//           <li className="py-2 px-2">
//             <div className="h-px bg-white/10 w-full rounded-full"></div>
//           </li>

//           {/* Settings & Bottom links */}
//           <li>
//             <Link 
//               to="/CompanySettings" 
//               onClick={() => handleLinkClick('Settings')}
//               className={`flex items-center py-3 rounded-xl transition-all duration-200 ${showSidebar ? 'px-4 gap-3.5' : 'justify-center px-0'} ${
//                 activeTab === 'Settings' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-semibold' : 'hover:bg-white/5 hover:text-white font-medium'
//               }`}
//             >
//               <Settings size={20} strokeWidth={activeTab === 'Settings' ? 2.5 : 2} className={`shrink-0 ${activeTab === 'Settings' ? 'text-white' : 'text-slate-400'}`} />
//               {showSidebar && <span className="text-[14px] whitespace-nowrap tracking-wide">Settings</span>}
//             </Link>
//           </li>

//           <li>
//             <Link 
//               to="/account" 
//               onClick={() => handleLinkClick('Account')}
//               className={`flex items-center py-3 rounded-xl transition-all duration-200 ${showSidebar ? 'px-4 gap-3.5' : 'justify-center px-0'} ${
//                 activeTab === 'Account' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-semibold' : 'hover:bg-white/5 hover:text-white font-medium'
//               }`}
//             >
//               <CircleUser size={20} strokeWidth={activeTab === 'Account' ? 2.5 : 2} className={`shrink-0 ${activeTab === 'Account' ? 'text-white' : 'text-slate-400'}`} />
//               {showSidebar && <span className="text-[14px] whitespace-nowrap tracking-wide">Account</span>}
//             </Link>
//           </li>

//           <li>
//             <Link 
//               to="/CompanyProfile" 
//               onClick={() => handleLinkClick('Profile')}
//               className={`flex items-center py-3 rounded-xl transition-all duration-200 ${showSidebar ? 'px-4 gap-3.5' : 'justify-center px-0'} ${
//                 activeTab === 'Profile' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-semibold' : 'hover:bg-white/5 hover:text-white font-medium'
//               }`}
//             >
//               <User size={20} strokeWidth={activeTab === 'Profile' ? 2.5 : 2} className={`shrink-0 ${activeTab === 'Profile' ? 'text-white' : 'text-slate-400'}`} />
//               {showSidebar && <span className="text-[14px] whitespace-nowrap tracking-wide">Profile</span>}
//             </Link>
//           </li>

//           <li>
//             <Link 
//               to="/SubscriptionInfo" 
//               onClick={() => handleLinkClick('Subscription')}
//               className={`flex items-center py-3 rounded-xl transition-all duration-200 ${showSidebar ? 'px-4 gap-3.5' : 'justify-center px-0'} ${
//                 activeTab === 'Subscription' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-semibold' : 'hover:bg-white/5 hover:text-white font-medium'
//               }`}
//             >
//               <CreditCard size={20} strokeWidth={activeTab === 'Subscription' ? 2.5 : 2} className={`shrink-0 ${activeTab === 'Subscription' ? 'text-white' : 'text-slate-400'}`} />
//               {showSidebar && <span className="text-[14px] whitespace-nowrap tracking-wide">Subscription Info</span>}
//             </Link>
//           </li>

//           {/* 👉 SIRF YAHAN CHANGE KIYA HAI: <Link> ko <button> banaya aur onClick lagaya */}
//           <li className="pb-4 pt-2">
//             <button 
//               onClick={handleLogout}
//               className={`w-full flex items-center py-3 rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-colors text-slate-400 font-medium ${showSidebar ? 'px-4 gap-3.5' : 'justify-center px-0'}`}
//             >
//               <LogOut size={20} strokeWidth={2} className="shrink-0 text-red-400/80" />
//               {showSidebar && <span className="text-[14px] whitespace-nowrap tracking-wide">Logout</span>}
//             </button>
//           </li>

//         </ul>
//       </nav>
//     </aside>
//   );
// };

// export default Sidebar;


// Sidebar

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { 
  LayoutDashboard, Users, Database, ChevronDown, Circle, Plane, FileText,
  CalendarDays, UserCheck, Store, UserCog, BarChart3, Settings, CircleUser,
  User, CreditCard, LogOut, Bell, BellRing, Clock, CalendarClock, Trash2
} from 'lucide-react';
import { isSuperAdmin, hasPermission, P } from '../services/access';

const Sidebar = ({ isExpanded }) => {
  const [openDropdown, setOpenDropdown] = useState('');
  const [activeTab, setActiveTab] = useState('Dashboard');
  
  const [isHovered, setIsHovered] = useState(false);
  const showSidebar = isExpanded || isHovered;

  const handleMenuClick = (menuName) => {
    setActiveTab(menuName);
    setOpenDropdown(openDropdown === menuName ? '' : menuName);
  };

  const handleLinkClick = (menuName) => {
    setActiveTab(menuName);
    setOpenDropdown('');
  };

  // 👉 Naya Function: Logout handle karne ke liye
  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userEmail');
      window.location.href = '/login'; 
    }
  };

  return (
    <aside 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`fixed md:relative z-50 h-screen bg-[#1e2329] text-[#94a3b8] flex flex-col shrink-0 font-sans transition-all duration-300 ease-in-out border-r border-white/5 ${
        showSidebar ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0 w-64 md:w-[72px]'
      }`}
    >
      {/* Brand Header */}
      <div className={`h-[72px] flex items-center border-b border-white/10 shrink-0 overflow-hidden whitespace-nowrap transition-all duration-300 ${showSidebar ? 'px-6' : 'px-0 justify-center'}`}>
        {showSidebar ? (
          <span className="text-lg font-bold text-white tracking-wide">Nepal Tour And Travels</span>
        ) : (
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
            <span className="text-base font-bold text-white">NT</span> 
          </div>
        )}
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto py-5 custom-scrollbar overflow-x-hidden">
        <ul className="space-y-1.5 px-3">
          
          <li>
            <Link 
              to="/Dashboard" 
              onClick={() => handleLinkClick('Dashboard')}
              className={`flex items-center py-3 rounded-xl transition-all duration-200 ${showSidebar ? 'px-4 gap-3.5' : 'justify-center px-0'} ${
                activeTab === 'Dashboard' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-semibold' : 'hover:bg-white/5 hover:text-white font-medium'
              }`}
            >
              <LayoutDashboard size={20} strokeWidth={activeTab === 'Dashboard' ? 2.5 : 2} className={`shrink-0 ${activeTab === 'Dashboard' ? 'text-white' : 'text-blue-400'}`} />
              {showSidebar && <span className="text-[14px] whitespace-nowrap tracking-wide">Dashboard</span>}
            </Link>
          </li>

          {/* --- Leads Dropdown --- */}
          {hasPermission(P.LEAD_READ) && (
          <li>
            <button
              onClick={() => handleMenuClick('Leads')}
              className={`w-full flex items-center py-3 rounded-xl transition-all duration-200 ${showSidebar ? 'justify-between px-4' : 'justify-center px-0'} ${
                activeTab === 'Leads' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-semibold' : 'hover:bg-white/5 hover:text-white font-medium'
              }`}
            >
              <div className={`flex items-center ${showSidebar ? 'gap-3.5' : ''}`}>
                <Users size={20} strokeWidth={activeTab === 'Leads' ? 2.5 : 2} className={`shrink-0 ${activeTab === 'Leads' ? 'text-white' : 'text-cyan-400'}`} />
                {showSidebar && <span className="text-[14px] whitespace-nowrap tracking-wide">Leads</span>}
              </div>
              {showSidebar && <ChevronDown size={16} className={`transition-transform duration-200 opacity-70 ${openDropdown === 'Leads' ? 'rotate-180' : ''}`} />}
            </button>
            
            {showSidebar && openDropdown === 'Leads' && (
              <ul className="mt-1 space-y-1 mb-2">
                <li><Link to="allleads" className="flex items-center gap-3 px-4 py-2.5 pl-11 text-[13.5px] font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg whitespace-nowrap transition-colors"><Circle size={6} className="fill-current text-cyan-400/50" /><span>All leads</span></Link></li>
                <li><Link to="/CreateLead" className="flex items-center gap-3 px-4 py-2.5 pl-11 text-[13.5px] font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg whitespace-nowrap transition-colors"><Circle size={6} className="fill-current text-cyan-400/50" /><span>Add new lead</span></Link></li>
              </ul>
            )}
          </li>
          )}

          {/* --- Reminders Dropdown --- */}
{hasPermission(P.REMINDER_READ) && (
<li>
  <button
    onClick={() => handleMenuClick("Reminders")}
    className={`w-full flex items-center py-3 rounded-xl transition-all duration-200 ${
      showSidebar ? "justify-between px-4" : "justify-center px-0"
    } ${
      activeTab === "Reminders"
        ? "bg-blue-600 text-white shadow-md shadow-blue-600/20 font-semibold"
        : "hover:bg-white/5 hover:text-white font-medium"
    }`}
  >
    <div className={`flex items-center ${showSidebar ? "gap-3.5" : ""}`}>
      <BellRing
        size={20}
        strokeWidth={activeTab === "Reminders" ? 2.5 : 2}
        className={`shrink-0 ${
          activeTab === "Reminders"
            ? "text-white"
            : "text-rose-400"
        }`}
      />
      {showSidebar && (
        <span className="text-[14px] whitespace-nowrap tracking-wide">
          Reminders
        </span>
      )}
    </div>

    {showSidebar && (
      <ChevronDown
        size={16}
        className={`transition-transform duration-200 opacity-70 ${
          openDropdown === "Reminders" ? "rotate-180" : ""
        }`}
      />
    )}
  </button>

  {showSidebar && openDropdown === "Reminders" && (
    <ul className="mt-1 space-y-1 mb-2">

      <li>
        <Link
          to="/reminders"
          className="flex items-center gap-3 px-4 py-2.5 pl-11 text-[13.5px] font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg whitespace-nowrap transition-colors"
        >
          <Bell size={14} className="text-rose-400/60" />
          <span>My Reminders</span>
        </Link>
      </li>

      <li>
        <Link
          to="/BookingReminders"
          className="flex items-center gap-3 px-4 py-2.5 pl-11 text-[13.5px] font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg whitespace-nowrap transition-colors"
        >
          <CalendarClock size={14} className="text-rose-400/60" />
          <span>Booking Reminders</span>
        </Link>
      </li>

      <li>
        <Link
          to="/Notifications"
          className="flex items-center gap-3 px-4 py-2.5 pl-11 text-[13.5px] font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg whitespace-nowrap transition-colors"
        >
          <BellRing size={14} className="text-rose-400/60" />
          <span>Notifications</span>
        </Link>
      </li>

      <li>
        <Link
          to="/NotificationSettings"
          className="flex items-center gap-3 px-4 py-2.5 pl-11 text-[13.5px] font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg whitespace-nowrap transition-colors"
        >
          <Settings size={14} className="text-rose-400/60" />
          <span>Notification Settings</span>
        </Link>
      </li>
    </ul>
  )}
</li>
)}

          {/* --- Masters Dropdown --- */}
          {hasPermission(P.MASTER_READ) && (
          <li>
            <button
              onClick={() => handleMenuClick('Masters')}
              className={`w-full flex items-center py-3 rounded-xl transition-all duration-200 ${showSidebar ? 'justify-between px-4' : 'justify-center px-0'} ${
                activeTab === 'Masters' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-semibold' : 'hover:bg-white/5 hover:text-white font-medium'
              }`}
            >
              <div className={`flex items-center ${showSidebar ? 'gap-3.5' : ''}`}>
                <Database size={20} strokeWidth={activeTab === 'Masters' ? 2.5 : 2} className={`shrink-0 ${activeTab === 'Masters' ? 'text-white' : 'text-purple-400'}`} />
                {showSidebar && <span className="text-[14px] whitespace-nowrap tracking-wide">Masters</span>}
              </div>
              {showSidebar && <ChevronDown size={16} className={`transition-transform duration-200 opacity-70 ${openDropdown === 'Masters' ? 'rotate-180' : ''}`} />}
            </button>
            
            {showSidebar && openDropdown === 'Masters' && (
              <ul className="mt-1 space-y-1 mb-2">
                <li><Link to="/masters/city" className="flex items-center gap-3 px-4 py-2.5 pl-11 text-[13.5px] font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg whitespace-nowrap transition-colors"><Circle size={6} className="fill-current text-purple-400/50" /><span>Cities</span></Link></li>
                <li><Link to="/masters/destinations" className="flex items-center gap-3 px-4 py-2.5 pl-11 text-[13.5px] font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg whitespace-nowrap transition-colors"><Circle size={6} className="fill-current text-purple-400/50" /><span>Destinations</span></Link></li>
                <li><Link to="/masters/hotels" className="flex items-center gap-3 px-4 py-2.5 pl-11 text-[13.5px] font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg whitespace-nowrap transition-colors"><Circle size={6} className="fill-current text-purple-400/50" /><span>Hotels</span></Link></li>
                <li><Link to="/masters/airlines" className="flex items-center gap-3 px-4 py-2.5 pl-11 text-[13.5px] font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg whitespace-nowrap transition-colors"><Plane size={14} className="opacity-70 text-purple-400/50" /><span>Airlines</span></Link></li>
                <li><Link to="/masters/cruises" className="flex items-center gap-3 px-4 py-2.5 pl-11 text-[13.5px] font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg whitespace-nowrap transition-colors"><Circle size={6} className="fill-current text-purple-400/50" /><span>Cruises</span></Link></li>
                <li><Link to="/masters/vehicles" className="flex items-center gap-3 px-4 py-2.5 pl-11 text-[13.5px] font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg whitespace-nowrap transition-colors"><Circle size={6} className="fill-current text-purple-400/50" /><span>Vehicles</span></Link></li>
                <li><Link to="/masters/sightseeing" className="flex items-center gap-3 px-4 py-2.5 pl-11 text-[13.5px] font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg whitespace-nowrap transition-colors"><Circle size={6} className="fill-current text-purple-400/50" /><span>Sightseeing</span></Link></li>
                <li><Link to="/masters/add-on-services" className="flex items-center gap-3 px-4 py-2.5 pl-11 text-[13.5px] font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg whitespace-nowrap transition-colors"><Circle size={6} className="fill-current text-purple-400/50" /><span>Add-on Services</span></Link></li>
                <li><Link to="/masters/testimonials" className="flex items-center gap-3 px-4 py-2.5 pl-11 text-[13.5px] font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg whitespace-nowrap transition-colors"><Circle size={6} className="fill-current text-purple-400/50" /><span>Testimonials</span></Link></li>
              </ul>
            )}
          </li>
          )}

          {/* --- Quotations Dropdown --- */}
          {hasPermission(P.QUOTATION_READ) && (
          <li>
            <button
              onClick={() => handleMenuClick('Quotations')}
              className={`w-full flex items-center py-3 rounded-xl transition-all duration-200 ${showSidebar ? 'justify-between px-4' : 'justify-center px-0'} ${
                activeTab === 'Quotations' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-semibold' : 'hover:bg-white/5 hover:text-white font-medium'
              }`}
            >
              <div className={`flex items-center ${showSidebar ? 'gap-3.5' : ''}`}>
                <FileText size={20} strokeWidth={activeTab === 'Quotations' ? 2.5 : 2} className={`shrink-0 ${activeTab === 'Quotations' ? 'text-white' : 'text-emerald-400'}`} />
                {showSidebar && <span className="text-[14px] whitespace-nowrap tracking-wide">Quotations</span>}
              </div>
              {showSidebar && <ChevronDown size={16} className={`transition-transform duration-200 opacity-70 ${openDropdown === 'Quotations' ? 'rotate-180' : ''}`} />}
            </button>
            {showSidebar && openDropdown === 'Quotations' && (
              <ul className="mt-1 space-y-1 mb-2">
                <li><Link to="/quotations/templates" className="flex items-center gap-3 px-4 py-2.5 pl-11 text-[13.5px] font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg whitespace-nowrap transition-colors"><Circle size={6} className="fill-current text-emerald-400/50" /><span>Templates</span></Link></li>
              </ul>
            )}
          </li>
          )}

          {/* --- Bookings Dropdown --- */}
          {hasPermission(P.BOOKING_READ) && (
          <li>
            <button
              onClick={() => handleMenuClick('Bookings')}
              className={`w-full flex items-center py-3 rounded-xl transition-all duration-200 ${showSidebar ? 'justify-between px-4' : 'justify-center px-0'} ${
                activeTab === 'Bookings' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-semibold' : 'hover:bg-white/5 hover:text-white font-medium'
              }`}
            >
              <div className={`flex items-center ${showSidebar ? 'gap-3.5' : ''}`}>
                <CalendarDays size={20} strokeWidth={activeTab === 'Bookings' ? 2.5 : 2} className={`shrink-0 ${activeTab === 'Bookings' ? 'text-white' : 'text-orange-400'}`} />
                {showSidebar && <span className="text-[14px] whitespace-nowrap tracking-wide">Bookings</span>}
              </div>
              {showSidebar && <ChevronDown size={16} className={`transition-transform duration-200 opacity-70 ${openDropdown === 'Bookings' ? 'rotate-180' : ''}`} />}
            </button>
            {showSidebar && openDropdown === 'Bookings' && (
              <ul className="mt-1 space-y-1 mb-2">
                <li><Link to="/Allbookings" className="flex items-center gap-3 px-4 py-2.5 pl-11 text-[13.5px] font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg whitespace-nowrap transition-colors"><Circle size={6} className="fill-current text-orange-400/50" /><span>All Bookings</span></Link></li>
                <li><Link to="/allleads" className="flex items-center gap-3 px-4 py-2.5 pl-11 text-[13.5px] font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg whitespace-nowrap transition-colors"><Circle size={6} className="fill-current text-orange-400/50" /><span>Add New Booking</span></Link></li>
              </ul>
            )}
          </li>
          )}

          {/* --- Customers Dropdown --- */}
          {hasPermission(P.CUSTOMER_READ) && (
          <li>
            <button
              onClick={() => handleMenuClick('Customers')}
              className={`w-full flex items-center py-3 rounded-xl transition-all duration-200 ${showSidebar ? 'justify-between px-4' : 'justify-center px-0'} ${
                activeTab === 'Customers' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-semibold' : 'hover:bg-white/5 hover:text-white font-medium'
              }`}
            >
              <div className={`flex items-center ${showSidebar ? 'gap-3.5' : ''}`}>
                <UserCheck size={20} strokeWidth={activeTab === 'Customers' ? 2.5 : 2} className={`shrink-0 ${activeTab === 'Customers' ? 'text-white' : 'text-teal-400'}`} />
                {showSidebar && <span className="text-[14px] whitespace-nowrap tracking-wide">Customers</span>}
              </div>
              {showSidebar && <ChevronDown size={16} className={`transition-transform duration-200 opacity-70 ${openDropdown === 'Customers' ? 'rotate-180' : ''}`} />}
            </button>
            {showSidebar && openDropdown === 'Customers' && (
              <ul className="mt-1 space-y-1 mb-2">
                <li><Link to="/AllCustomers" className="flex items-center gap-3 px-4 py-2.5 pl-11 text-[13.5px] font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg whitespace-nowrap transition-colors"><Circle size={6} className="fill-current text-teal-400/50" /><span>All Customers</span></Link></li>
                <li><Link to="/Createcustomer" className="flex items-center gap-3 px-4 py-2.5 pl-11 text-[13.5px] font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg whitespace-nowrap transition-colors"><Circle size={6} className="fill-current text-teal-400/50" /><span>Add New Customer</span></Link></li>
              </ul>
            )}
          </li>
          )}

          {/* --- Vendors Dropdown --- */}
          {hasPermission(P.VENDOR_READ) && (
          <li>
            <button
              onClick={() => handleMenuClick('Vendors')}
              className={`w-full flex items-center py-3 rounded-xl transition-all duration-200 ${showSidebar ? 'justify-between px-4' : 'justify-center px-0'} ${
                activeTab === 'Vendors' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-semibold' : 'hover:bg-white/5 hover:text-white font-medium'
              }`}
            >
              <div className={`flex items-center ${showSidebar ? 'gap-3.5' : ''}`}>
                <Store size={20} strokeWidth={activeTab === 'Vendors' ? 2.5 : 2} className={`shrink-0 ${activeTab === 'Vendors' ? 'text-white' : 'text-amber-400'}`} />
                {showSidebar && <span className="text-[14px] whitespace-nowrap tracking-wide">Vendors</span>}
              </div>
              {showSidebar && <ChevronDown size={16} className={`transition-transform duration-200 opacity-70 ${openDropdown === 'Vendors' ? 'rotate-180' : ''}`} />}
            </button>
            {showSidebar && openDropdown === 'Vendors' && (
              <ul className="mt-1 space-y-1 mb-2">
                <li><Link to="/AllVendors" className="flex items-center gap-3 px-4 py-2.5 pl-11 text-[13.5px] font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg whitespace-nowrap transition-colors"><Circle size={6} className="fill-current text-amber-400/50" /><span>All Vendors</span></Link></li>
                <li><Link to="/CreateVendor" className="flex items-center gap-3 px-4 py-2.5 pl-11 text-[13.5px] font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg whitespace-nowrap transition-colors"><Circle size={6} className="fill-current text-amber-400/50" /><span>Add New Vendor</span></Link></li>
              </ul>
            )}
          </li>
          )}
          

          {/* --- Users Dropdown --- */}
{hasPermission(P.USER_READ) && (
<li>
  <button
    onClick={() => handleMenuClick('Users')}
    className={`w-full flex items-center py-3 rounded-xl transition-all duration-200 ${
      showSidebar ? 'justify-between px-4' : 'justify-center px-0'
    } ${
      activeTab === 'Users'
        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-semibold'
        : 'hover:bg-white/5 hover:text-white font-medium'
    }`}
  >
    <div className={`flex items-center ${showSidebar ? 'gap-3.5' : ''}`}>
      <UserCog
        size={20}
        strokeWidth={activeTab === 'Users' ? 2.5 : 2}
        className={`shrink-0 ${
          activeTab === 'Users' ? 'text-white' : 'text-pink-400'
        }`}
      />
      {showSidebar && (
        <span className="text-[14px] whitespace-nowrap tracking-wide">
          Users
        </span>
      )}
    </div>

    {showSidebar && (
      <ChevronDown
        size={16}
        className={`transition-transform duration-200 opacity-70 ${
          openDropdown === 'Users' ? 'rotate-180' : ''
        }`}
      />
    )}
  </button>

  {showSidebar && openDropdown === 'Users' && (
    <ul className="mt-1 space-y-1 mb-2">

      <li>
        <Link
          to="/Users"
          className="flex items-center gap-3 px-4 py-2.5 pl-11 text-[13.5px] font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg whitespace-nowrap transition-colors"
        >
          <Circle size={6} className="fill-current text-pink-400/50" />
          <span>All Users</span>
        </Link>
      </li>

      <li>
        <Link
          to="/CreateUser"
          className="flex items-center gap-3 px-4 py-2.5 pl-11 text-[13.5px] font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg whitespace-nowrap transition-colors"
        >
          <Circle size={6} className="fill-current text-pink-400/50" />
          <span>Add New User</span>
        </Link>
      </li>

      <li>
        <Link
          to="/PermissionTemplates"
          className="flex items-center gap-3 px-4 py-2.5 pl-11 text-[13.5px] font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg whitespace-nowrap transition-colors"
        >
          <Circle size={6} className="fill-current text-pink-400/50" />
          <span>Permission Templates</span>
        </Link>
      </li>

    </ul>
  )}
</li>
)}


          {/* --- Organization Dropdown --- */}
          {/* <li>
          <li>

            <button 
              onClick={() => handleMenuClick('Organization')}
              className={`w-full flex items-center py-3 rounded-xl transition-all duration-200 ${showSidebar ? 'justify-between px-4' : 'justify-center px-0'} ${
                activeTab === 'Organization' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-semibold' : 'hover:bg-white/5 hover:text-white font-medium'
              }`}
            >
              <div className={`flex items-center ${showSidebar ? 'gap-3.5' : ''}`}>
                <UserCog size={20} strokeWidth={activeTab === 'Organization' ? 2.5 : 2} className={`shrink-0 ${activeTab === 'Organization' ? 'text-white' : 'text-pink-400'}`} />
                {showSidebar && <span className="text-[14px] whitespace-nowrap tracking-wide">Organization</span>}
              </div>
              {showSidebar && <ChevronDown size={16} className={`transition-transform duration-200 opacity-70 ${openDropdown === 'Organization' ? 'rotate-180' : ''}`} />}
            </button>
            {showSidebar && openDropdown === 'Organization' && (
              <ul className="mt-1 space-y-1 mb-2">
                <li><Link to="/allorganization" className="flex items-center gap-3 px-4 py-2.5 pl-11 text-[13.5px] font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg whitespace-nowrap transition-colors"><Circle size={6} className="fill-current text-pink-400/50" /><span>All Organization</span></Link></li>
                {/* <li><Link to="/add-user" className="flex items-center gap-3 px-4 py-2.5 pl-11 text-[13.5px] font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg whitespace-nowrap transition-colors"><Circle size={6} className="fill-current text-pink-400/50" /><span>Add New Organization</span></Link></li>
                <li><Link to="/users/permission-templates" className="flex items-center gap-3 px-4 py-2.5 pl-11 text-[13.5px] font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg whitespace-nowrap transition-colors"><Circle size={6} className="fill-current text-pink-400/50" /><span>Permission Templates</span></Link></li> */}
              {/* </ul>
            )}
          </li> */} 


{/* --- Organization Dropdown (SUPERADMIN / platform owner only) --- */}
{isSuperAdmin() && (
<li>
  <button
    onClick={() => handleMenuClick('Organization')}
    className={`w-full flex items-center py-3 rounded-xl transition-all duration-200 ${
      showSidebar ? 'justify-between px-4' : 'justify-center px-0'
    } ${
      activeTab === 'Organization'
        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-semibold'
        : 'hover:bg-white/5 hover:text-white font-medium'
    }`}
  >
    <div className={`flex items-center ${showSidebar ? 'gap-3.5' : ''}`}>
      <UserCog
        size={20}
        strokeWidth={activeTab === 'Organization' ? 2.5 : 2}
        className={`shrink-0 ${
          activeTab === 'Organization'
            ? 'text-white'
            : 'text-pink-400'
        }`}
      />
      {showSidebar && (
        <span className="text-[14px] whitespace-nowrap tracking-wide">
          Organization
        </span>
      )}
    </div>

    {showSidebar && (
      <ChevronDown
        size={16}
        className={`transition-transform duration-200 opacity-70 ${
          openDropdown === 'Organization' ? 'rotate-180' : ''
        }`}
      />
    )}
  </button>

  {showSidebar && openDropdown === 'Organization' && (
    <ul className="mt-1 space-y-1 mb-2">
      <li>
        <Link
          to="/allorganization"
          className="flex items-center gap-3 px-4 py-2.5 pl-11 text-[13.5px] font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg whitespace-nowrap transition-colors"
        >
          <Circle size={6} className="fill-current text-pink-400/50" />
          <span>All Organization</span>
        </Link>
      </li>

      <li>
        <Link
          to="/CreateOrganization"
          className="flex items-center gap-3 px-4 py-2.5 pl-11 text-[13.5px] font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg whitespace-nowrap transition-colors"
        >
          <Circle size={6} className="fill-current text-pink-400/50" />
          <span>Add New Organization</span>
        </Link>
      </li>
    </ul>
  )}
</li>
)}

          

          {/* --- Reports (Normal Link) --- */}
          {hasPermission(P.REPORT_VIEW) && (
          <li>
            <Link
              to="/ReportsDashboard"
              onClick={() => handleLinkClick('Reports')}
              className={`flex items-center py-3 rounded-xl transition-all duration-200 ${showSidebar ? 'px-4 gap-3.5' : 'justify-center px-0'} ${
                activeTab === 'Reports' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-semibold' : 'hover:bg-white/5 hover:text-white font-medium'
              }`}
            >
              <BarChart3 size={20} strokeWidth={activeTab === 'Reports' ? 2.5 : 2} className={`shrink-0 ${activeTab === 'Reports' ? 'text-white' : 'text-indigo-400'}`} />
              {showSidebar && <span className="text-[14px] whitespace-nowrap tracking-wide">Reports</span>}
            </Link>
          </li>
          )}


          {/* --- Trash (Recycle Bin) --- */}
          {hasPermission(P.TRASH_VIEW) && (
          <li>
            <Link
              to="/trash"
              onClick={() => handleLinkClick('Trash')}
              className={`flex items-center py-3 rounded-xl transition-all duration-200 ${showSidebar ? 'px-4 gap-3.5' : 'justify-center px-0'} ${
                activeTab === 'Trash' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-semibold' : 'hover:bg-white/5 hover:text-white font-medium'
              }`}
            >
              <Trash2 size={20} strokeWidth={activeTab === 'Trash' ? 2.5 : 2} className={`shrink-0 ${activeTab === 'Trash' ? 'text-white' : 'text-red-400'}`} />
              {showSidebar && <span className="text-[14px] whitespace-nowrap tracking-wide">Trash</span>}
            </Link>
          </li>
          )}

          {/* Divider */}
          <li className="py-2 px-2">
            <div className="h-px bg-white/10 w-full rounded-full"></div>
          </li>

          {/* Settings & Bottom links */}
          <li>
            <Link 
              to="/CompanySettings" 
              onClick={() => handleLinkClick('Settings')}
              className={`flex items-center py-3 rounded-xl transition-all duration-200 ${showSidebar ? 'px-4 gap-3.5' : 'justify-center px-0'} ${
                activeTab === 'Settings' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-semibold' : 'hover:bg-white/5 hover:text-white font-medium'
              }`}
            >
              <Settings size={20} strokeWidth={activeTab === 'Settings' ? 2.5 : 2} className={`shrink-0 ${activeTab === 'Settings' ? 'text-white' : 'text-slate-400'}`} />
              {showSidebar && <span className="text-[14px] whitespace-nowrap tracking-wide">Settings</span>}
            </Link>
          </li>

          <li>
            <Link 
              to="/account" 
              onClick={() => handleLinkClick('Account')}
              className={`flex items-center py-3 rounded-xl transition-all duration-200 ${showSidebar ? 'px-4 gap-3.5' : 'justify-center px-0'} ${
                activeTab === 'Account' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-semibold' : 'hover:bg-white/5 hover:text-white font-medium'
              }`}
            >
              <CircleUser size={20} strokeWidth={activeTab === 'Account' ? 2.5 : 2} className={`shrink-0 ${activeTab === 'Account' ? 'text-white' : 'text-slate-400'}`} />
              {showSidebar && <span className="text-[14px] whitespace-nowrap tracking-wide">Account</span>}
            </Link>
          </li>

          <li>
            <Link 
              to="/CompanyProfile" 
              onClick={() => handleLinkClick('Profile')}
              className={`flex items-center py-3 rounded-xl transition-all duration-200 ${showSidebar ? 'px-4 gap-3.5' : 'justify-center px-0'} ${
                activeTab === 'Profile' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-semibold' : 'hover:bg-white/5 hover:text-white font-medium'
              }`}
            >
              <User size={20} strokeWidth={activeTab === 'Profile' ? 2.5 : 2} className={`shrink-0 ${activeTab === 'Profile' ? 'text-white' : 'text-slate-400'}`} />
              {showSidebar && <span className="text-[14px] whitespace-nowrap tracking-wide">Profile</span>}
            </Link>
          </li>

          <li>
            <Link 
              to="/SubscriptionInfo" 
              onClick={() => handleLinkClick('Subscription')}
              className={`flex items-center py-3 rounded-xl transition-all duration-200 ${showSidebar ? 'px-4 gap-3.5' : 'justify-center px-0'} ${
                activeTab === 'Subscription' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-semibold' : 'hover:bg-white/5 hover:text-white font-medium'
              }`}
            >
              <CreditCard size={20} strokeWidth={activeTab === 'Subscription' ? 2.5 : 2} className={`shrink-0 ${activeTab === 'Subscription' ? 'text-white' : 'text-slate-400'}`} />
              {showSidebar && <span className="text-[14px] whitespace-nowrap tracking-wide">Subscription Info</span>}
            </Link>
          </li>

          {/* 👉 SIRF YAHAN CHANGE KIYA HAI: <Link> ko <button> banaya aur onClick lagaya */}
          <li className="pb-4 pt-2">
            <button 
              onClick={handleLogout}
              className={`w-full flex items-center py-3 rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-colors text-slate-400 font-medium ${showSidebar ? 'px-4 gap-3.5' : 'justify-center px-0'}`}
            >
              <LogOut size={20} strokeWidth={2} className="shrink-0 text-red-400/80" />
              {showSidebar && <span className="text-[14px] whitespace-nowrap tracking-wide">Logout</span>}
            </button>
          </li>

        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;