import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Link import kiya gaya hai
import { 
  LayoutDashboard, Users, Database, ChevronDown, Circle, Plane, FileText,
  CalendarDays, UserCheck, Store, UserCog, BarChart3, Settings, CircleUser, 
  User, CreditCard, LogOut
} from 'lucide-react';

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

  return (
    <aside 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`fixed md:relative z-50 h-screen bg-[#2d3238] text-gray-400 flex flex-col shrink-0 font-sans transition-all duration-300 ease-in-out ${
        showSidebar ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0 w-64 md:w-16'
      }`}
    >
      {/* Brand Header */}
      <div className={`h-16 flex items-center border-b border-gray-700/50 shrink-0 overflow-hidden whitespace-nowrap transition-all duration-300 ${showSidebar ? 'px-6' : 'px-0 justify-center'}`}>
        {showSidebar ? (
          <span className="text-[17px] font-normal text-white">Nepal Tours And Travels</span>
        ) : (
          <span className="text-xl font-bold text-white hidden md:block">NT</span> 
        )}
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto py-4 custom-scrollbar overflow-x-hidden">
        <ul className="space-y-1">
          
          <li className="px-2">
            <Link 
              to="/" 
              onClick={() => handleLinkClick('Dashboard')}
              className={`flex items-center py-2.5 rounded transition-colors ${showSidebar ? 'px-3 gap-3' : 'justify-center'} ${
                activeTab === 'Dashboard' ? 'bg-blue-600 text-white' : 'hover:bg-gray-800'
              }`}
            >
              <LayoutDashboard size={20} className="shrink-0" />
              {showSidebar && <span className="text-sm whitespace-nowrap">Dashboard</span>}
            </Link>
          </li>

          {/* --- Leads Dropdown --- */}
          <li className="px-2">
            <button 
              onClick={() => handleMenuClick('Leads')}
              className={`w-full flex items-center py-2.5 rounded transition-colors ${showSidebar ? 'justify-between px-3' : 'justify-center'} ${
                activeTab === 'Leads' ? 'bg-blue-600 text-white' : 'hover:bg-gray-800'
              }`}
            >
              <div className={`flex items-center ${showSidebar ? 'gap-3' : ''}`}>
                <Users size={20} className="shrink-0" />
                {showSidebar && <span className="text-sm whitespace-nowrap">Leads</span>}
              </div>
              {showSidebar && <ChevronDown size={16} className={`transition-transform duration-200 ${openDropdown === 'Leads' ? '' : '-rotate-90'}`} />}
            </button>
            
            {showSidebar && openDropdown === 'Leads' && (
              <ul className="mt-1 space-y-1 pb-2">
                <li><Link to="allleads" className="flex items-center gap-3 px-3 py-2 pl-10 text-sm hover:bg-gray-800 rounded whitespace-nowrap"><Circle size={14} /><span>All leads</span></Link></li>
                <li><Link to="/CreateLead" className="flex items-center gap-3 px-3 py-2 pl-10 text-sm hover:bg-gray-800 rounded whitespace-nowrap"><Circle size={14} /><span>Add new lead</span></Link></li>
              </ul>
            )}
          </li>

          {/* --- Masters Dropdown --- */}
          <li className="px-2 pt-1">
            <button 
              onClick={() => handleMenuClick('Masters')}
              className={`w-full flex items-center py-2.5 rounded transition-colors ${showSidebar ? 'justify-between px-3' : 'justify-center'} ${
                activeTab === 'Masters' ? 'bg-blue-600 text-white' : 'hover:bg-gray-800'
              }`}
            >
              <div className={`flex items-center ${showSidebar ? 'gap-3' : ''}`}>
                <Database size={20} className="shrink-0" />
                {showSidebar && <span className="text-sm font-medium whitespace-nowrap">Masters</span>}
              </div>
              {showSidebar && <ChevronDown size={16} className={`transition-transform duration-200 ${openDropdown === 'Masters' ? '' : '-rotate-90'}`} />}
            </button>
            
            {showSidebar && openDropdown === 'Masters' && (
              <ul className="mt-1 space-y-1 pb-2">
                <li><Link to="/masters/cities" className="flex items-center gap-3 px-3 py-2 pl-10 text-sm hover:bg-gray-800 rounded whitespace-nowrap"><Circle size={14} /><span>Cities</span></Link></li>
                <li><Link to="/masters/destinations" className="flex items-center gap-3 px-3 py-2 pl-10 text-sm hover:bg-gray-800 rounded whitespace-nowrap"><Circle size={14} /><span>Destinations</span></Link></li>
                <li><Link to="/masters/hotels" className="flex items-center gap-3 px-3 py-2 pl-10 text-sm hover:bg-gray-800 rounded whitespace-nowrap"><Circle size={14} /><span>Hotels</span></Link></li>
                <li><Link to="/masters/airlines" className="flex items-center gap-3 px-3 py-2 pl-10 text-sm hover:bg-gray-800 rounded whitespace-nowrap"><Plane size={14} /><span>Airlines</span></Link></li>
                <li><Link to="/masters/cruises" className="flex items-center gap-3 px-3 py-2 pl-10 text-sm hover:bg-gray-800 rounded whitespace-nowrap"><Circle size={14} /><span>Cruises</span></Link></li>
                <li><Link to="/masters/vehicles" className="flex items-center gap-3 px-3 py-2 pl-10 text-sm hover:bg-gray-800 rounded whitespace-nowrap"><Circle size={14} /><span>Vehicles</span></Link></li>
                <li><Link to="/masters/sightseeing" className="flex items-center gap-3 px-3 py-2 pl-10 text-sm hover:bg-gray-800 rounded whitespace-nowrap"><Circle size={14} /><span>Sightseeing</span></Link></li>
                <li><Link to="/masters/add-on-services" className="flex items-center gap-3 px-3 py-2 pl-10 text-sm hover:bg-gray-800 rounded whitespace-nowrap"><Circle size={14} /><span>Add-on Services</span></Link></li>
                <li><Link to="/masters/testimonials" className="flex items-center gap-3 px-3 py-2 pl-10 text-sm hover:bg-gray-800 rounded whitespace-nowrap"><Circle size={14} /><span>Testimonials</span></Link></li>
              </ul>
            )}
          </li>

          {/* --- Quotations Dropdown --- */}
          <li className="px-2">
            <button 
              onClick={() => handleMenuClick('Quotations')}
              className={`w-full flex items-center py-2.5 rounded transition-colors ${showSidebar ? 'justify-between px-3' : 'justify-center'} ${
                activeTab === 'Quotations' ? 'bg-blue-600 text-white' : 'hover:bg-gray-800'
              }`}
            >
              <div className={`flex items-center ${showSidebar ? 'gap-3' : ''}`}>
                <FileText size={20} className="shrink-0" />
                {showSidebar && <span className="text-sm whitespace-nowrap">Quotations</span>}
              </div>
              {showSidebar && <ChevronDown size={16} className={`transition-transform duration-200 ${openDropdown === 'Quotations' ? '' : '-rotate-90'}`} />}
            </button>
            {showSidebar && openDropdown === 'Quotations' && (
              <ul className="mt-1 space-y-1 pb-2">
                <li><Link to="/quotations/templates" className="flex items-center gap-3 px-3 py-2 pl-10 text-sm hover:bg-gray-800 rounded whitespace-nowrap"><Circle size={14} /><span>Templates</span></Link></li>
              </ul>
            )}
          </li>

          {/* --- Bookings Dropdown --- */}
          <li className="px-2">
            <button 
              onClick={() => handleMenuClick('Bookings')}
              className={`w-full flex items-center py-2.5 rounded transition-colors ${showSidebar ? 'justify-between px-3' : 'justify-center'} ${
                activeTab === 'Bookings' ? 'bg-blue-600 text-white' : 'hover:bg-gray-800'
              }`}
            >
              <div className={`flex items-center ${showSidebar ? 'gap-3' : ''}`}>
                <CalendarDays size={20} className="shrink-0" />
                {showSidebar && <span className="text-sm whitespace-nowrap">Bookings</span>}
              </div>
              {showSidebar && <ChevronDown size={16} className={`transition-transform duration-200 ${openDropdown === 'Bookings' ? '' : '-rotate-90'}`} />}
            </button>
            {showSidebar && openDropdown === 'Bookings' && (
              <ul className="mt-1 space-y-1 pb-2">
                <li><Link to="/bookings" className="flex items-center gap-3 px-3 py-2 pl-10 text-sm hover:bg-gray-800 rounded whitespace-nowrap"><Circle size={14} /><span>All Bookings</span></Link></li>
                <li><Link to="/add-booking" className="flex items-center gap-3 px-3 py-2 pl-10 text-sm hover:bg-gray-800 rounded whitespace-nowrap"><Circle size={14} /><span>Add New Booking</span></Link></li>
              </ul>
            )}
          </li>

          {/* --- Customers Dropdown --- */}
          <li className="px-2">
            <button 
              onClick={() => handleMenuClick('Customers')}
              className={`w-full flex items-center py-2.5 rounded transition-colors ${showSidebar ? 'justify-between px-3' : 'justify-center'} ${
                activeTab === 'Customers' ? 'bg-blue-600 text-white' : 'hover:bg-gray-800'
              }`}
            >
              <div className={`flex items-center ${showSidebar ? 'gap-3' : ''}`}>
                <UserCheck size={20} className="shrink-0" />
                {showSidebar && <span className="text-sm whitespace-nowrap">Customers</span>}
              </div>
              {showSidebar && <ChevronDown size={16} className={`transition-transform duration-200 ${openDropdown === 'Customers' ? '' : '-rotate-90'}`} />}
            </button>
            {showSidebar && openDropdown === 'Customers' && (
              <ul className="mt-1 space-y-1 pb-2">
                <li><Link to="/customers" className="flex items-center gap-3 px-3 py-2 pl-10 text-sm hover:bg-gray-800 rounded whitespace-nowrap"><Circle size={14} /><span>All Customers</span></Link></li>
                <li><Link to="/add-customer" className="flex items-center gap-3 px-3 py-2 pl-10 text-sm hover:bg-gray-800 rounded whitespace-nowrap"><Circle size={14} /><span>Add New Customer</span></Link></li>
              </ul>
            )}
          </li>

          {/* --- Vendors Dropdown --- */}
          <li className="px-2">
            <button 
              onClick={() => handleMenuClick('Vendors')}
              className={`w-full flex items-center py-2.5 rounded transition-colors ${showSidebar ? 'justify-between px-3' : 'justify-center'} ${
                activeTab === 'Vendors' ? 'bg-blue-600 text-white' : 'hover:bg-gray-800'
              }`}
            >
              <div className={`flex items-center ${showSidebar ? 'gap-3' : ''}`}>
                <Store size={20} className="shrink-0" />
                {showSidebar && <span className="text-sm whitespace-nowrap">Vendors</span>}
              </div>
              {showSidebar && <ChevronDown size={16} className={`transition-transform duration-200 ${openDropdown === 'Vendors' ? '' : '-rotate-90'}`} />}
            </button>
            {showSidebar && openDropdown === 'Vendors' && (
              <ul className="mt-1 space-y-1 pb-2">
                <li><Link to="/vendors" className="flex items-center gap-3 px-3 py-2 pl-10 text-sm hover:bg-gray-800 rounded whitespace-nowrap"><Circle size={14} /><span>All Vendors</span></Link></li>
                <li><Link to="/add-vendor" className="flex items-center gap-3 px-3 py-2 pl-10 text-sm hover:bg-gray-800 rounded whitespace-nowrap"><Circle size={14} /><span>Add New Vendor</span></Link></li>
              </ul>
            )}
          </li>

          {/* --- Users Dropdown --- */}
          <li className="px-2">
            <button 
              onClick={() => handleMenuClick('Users')}
              className={`w-full flex items-center py-2.5 rounded transition-colors ${showSidebar ? 'justify-between px-3' : 'justify-center'} ${
                activeTab === 'Users' ? 'bg-blue-600 text-white' : 'hover:bg-gray-800'
              }`}
            >
              <div className={`flex items-center ${showSidebar ? 'gap-3' : ''}`}>
                <UserCog size={20} className="shrink-0" />
                {showSidebar && <span className="text-sm whitespace-nowrap">Users</span>}
              </div>
              {showSidebar && <ChevronDown size={16} className={`transition-transform duration-200 ${openDropdown === 'Users' ? '' : '-rotate-90'}`} />}
            </button>
            {showSidebar && openDropdown === 'Users' && (
              <ul className="mt-1 space-y-1 pb-2">
                <li><Link to="/users" className="flex items-center gap-3 px-3 py-2 pl-10 text-sm hover:bg-gray-800 rounded whitespace-nowrap"><Circle size={14} /><span>All Users</span></Link></li>
                <li><Link to="/add-user" className="flex items-center gap-3 px-3 py-2 pl-10 text-sm hover:bg-gray-800 rounded whitespace-nowrap"><Circle size={14} /><span>Add New User</span></Link></li>
                <li><Link to="/users/permission-templates" className="flex items-center gap-3 px-3 py-2 pl-10 text-sm hover:bg-gray-800 rounded whitespace-nowrap"><Circle size={14} /><span>Permission Templates</span></Link></li>
              </ul>
            )}
          </li>

          {/* --- Reports (Normal Link) --- */}
          <li className="px-2">
            <Link 
              to="/reports" 
              onClick={() => handleLinkClick('Reports')}
              className={`flex items-center py-2.5 rounded transition-colors ${showSidebar ? 'px-3 gap-3' : 'justify-center'} ${
                activeTab === 'Reports' ? 'bg-blue-600 text-white' : 'hover:bg-gray-800'
              }`}
            >
              <BarChart3 size={20} className="shrink-0" />
              {showSidebar && <span className="text-sm whitespace-nowrap">Reports</span>}
            </Link>
          </li>

          {/* Divider */}
          <li className="px-4 py-2">
            <div className="h-px bg-gray-700/50 w-full"></div>
          </li>

          {/* Settings & Bottom links */}
          <li className="px-2">
            <Link 
              to="/settings" 
              onClick={() => handleLinkClick('Settings')}
              className={`flex items-center py-2.5 rounded transition-colors ${showSidebar ? 'px-3 gap-3' : 'justify-center'} ${
                activeTab === 'Settings' ? 'bg-blue-600 text-white' : 'hover:bg-gray-800'
              }`}
            >
              <Settings size={20} className="shrink-0" />
              {showSidebar && <span className="text-sm whitespace-nowrap">Settings</span>}
            </Link>
          </li>

          <li className="px-2">
            <Link 
              to="/account" 
              onClick={() => handleLinkClick('Account')}
              className={`flex items-center py-2.5 rounded transition-colors ${showSidebar ? 'px-3 gap-3' : 'justify-center'} ${
                activeTab === 'Account' ? 'bg-blue-600 text-white' : 'hover:bg-gray-800'
              }`}
            >
              <CircleUser size={20} className="shrink-0" />
              {showSidebar && <span className="text-sm whitespace-nowrap">Account</span>}
            </Link>
          </li>

          <li className="px-2">
            <Link 
              to="/profile" 
              onClick={() => handleLinkClick('Profile')}
              className={`flex items-center py-2.5 rounded transition-colors ${showSidebar ? 'px-3 gap-3' : 'justify-center'} ${
                activeTab === 'Profile' ? 'bg-blue-600 text-white' : 'hover:bg-gray-800'
              }`}
            >
              <User size={20} className="shrink-0" />
              {showSidebar && <span className="text-sm whitespace-nowrap">Profile</span>}
            </Link>
          </li>

          <li className="px-2">
            <Link 
              to="/subscription" 
              onClick={() => handleLinkClick('Subscription')}
              className={`flex items-center py-2.5 rounded transition-colors ${showSidebar ? 'px-3 gap-3' : 'justify-center'} ${
                activeTab === 'Subscription' ? 'bg-blue-600 text-white' : 'hover:bg-gray-800'
              }`}
            >
              <CreditCard size={20} className="shrink-0" />
              {showSidebar && <span className="text-sm whitespace-nowrap">Subscription Info</span>}
            </Link>
          </li>

          <li className="px-2 pb-4">
            <Link to="/logout" className={`flex items-center py-2.5 rounded hover:bg-red-500/10 hover:text-red-400 transition-colors text-gray-400 ${showSidebar ? 'px-3 gap-3' : 'justify-center'}`}>
              <LogOut size={20} className="shrink-0" />
              {showSidebar && <span className="text-sm whitespace-nowrap">Logout</span>}
            </Link>
          </li>

        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;