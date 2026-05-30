import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Database, 
  ChevronDown, 
  Circle, 
  Plane, 
  FileText,
  CalendarDays,
  UserCheck,
  Store,
  UserCog,
  BarChart3,
  Settings,
  CircleUser,
  User,
  CreditCard,
  LogOut
} from 'lucide-react';

const Sidebar = () => {
  // Manage the open/close state of the dropdowns
  const [isMastersOpen, setIsMastersOpen] = useState(false);
  const [isLeadsOpen, setIsLeadsOpen] = useState(false);
  
  // Track currently active menu item (default "Dashboard")
  const [activeTab, setActiveTab] = useState('Dashboard');

  // Helper function to handle clicks on dropdown buttons
  const handleMenuClick = (menuName) => {
    setActiveTab(menuName);
    
    // Toggle logic for Leads
    if (menuName === 'Leads') {
      setIsLeadsOpen(!isLeadsOpen);
      if(isMastersOpen) setIsMastersOpen(false); // Close others
    } 
    // Toggle logic for Masters
    else if (menuName === 'Masters') {
      setIsMastersOpen(!isMastersOpen);
      if(isLeadsOpen) setIsLeadsOpen(false); // Close others
    }
  };

  // Helper function to handle clicks on normal links
  const handleLinkClick = (menuName) => {
    setActiveTab(menuName);
  };

  return (
    <aside className="w-64 h-screen bg-[#2d3238] text-gray-400 flex flex-col shrink-0 font-sans">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-gray-700/50 shrink-0">
        <span className="text-[17px] font-normal text-white">Nepal Tours And Travels</span>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto py-4 custom-scrollbar">
        <ul className="space-y-1">
          
          <li className="px-3">
            <a 
              href="#" 
              onClick={() => handleLinkClick('Dashboard')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded transition-colors ${
                activeTab === 'Dashboard' ? 'bg-blue-600 text-white' : 'hover:bg-gray-800'
              }`}
            >
              <LayoutDashboard size={18} />
              <span className="text-sm">Dashboard</span>
            </a>
          </li>

          {/* --- Leads Dropdown Start --- */}
          <li className="px-3">
            <button 
              onClick={() => handleMenuClick('Leads')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded transition-colors ${
                activeTab === 'Leads' ? 'bg-blue-600 text-white' : 'hover:bg-gray-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users size={18} />
                <span className="text-sm">Leads</span>
              </div>
              <ChevronDown size={16} className={`transition-transform duration-200 ${isLeadsOpen ? '' : '-rotate-90'}`} />
            </button>
            
            {/* Leads Dropdown Items */}
            {isLeadsOpen && (
              <ul className="mt-1 space-y-1 pb-2">
                <li>
                  <a href="#" className="flex items-center gap-3 px-3 py-2 pl-10 text-sm hover:bg-gray-800 rounded">
                    <Circle size={14} />
                    <span>All leads</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-3 px-3 py-2 pl-10 text-sm hover:bg-gray-800 rounded">
                    <Circle size={14} />
                    <span>Add new lead</span>
                  </a>
                </li>
              </ul>
            )}
          </li>
          {/* --- Leads Dropdown End --- */}

          {/* Active Masters Menu with Dropdown */}
          <li className="px-3 pt-1">
            <button 
              onClick={() => handleMenuClick('Masters')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded transition-colors ${
                activeTab === 'Masters' ? 'bg-blue-600 text-white' : 'hover:bg-gray-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <Database size={18} />
                <span className="text-sm font-medium">Masters</span>
              </div>
              <ChevronDown size={16} className={`transition-transform duration-200 ${isMastersOpen ? '' : '-rotate-90'}`} />
            </button>
            
            {/* Dropdown Items */}
            {isMastersOpen && (
              <ul className="mt-1 space-y-1 pb-2">
                <li>
                  <a href="#" className="flex items-center gap-3 px-3 py-2 pl-10 text-sm hover:bg-gray-800 rounded">
                    <Circle size={14} />
                    <span>Cities</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-3 px-3 py-2 pl-10 text-sm hover:bg-gray-800 rounded">
                    <Circle size={14} />
                    <span>Destinations</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-3 px-3 py-2 pl-10 text-sm hover:bg-gray-800 rounded">
                    <Circle size={14} />
                    <span>Hotels</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-3 px-3 py-2 pl-10 text-sm hover:bg-gray-800 rounded">
                    <Plane size={14} />
                    <span>Airlines</span>
                  </a>
                </li>
              </ul>
            )}
          </li>

          {/* Quotations */}
          <li className="px-3">
            <a 
              href="#" 
              onClick={() => handleLinkClick('Quotations')}
              className={`flex items-center justify-between px-3 py-2.5 rounded transition-colors ${
                activeTab === 'Quotations' ? 'bg-blue-600 text-white' : 'hover:bg-gray-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <FileText size={18} />
                <span className="text-sm">Quotations</span>
              </div>
              <ChevronDown size={16} className="-rotate-90" />
            </a>
          </li>

          {/* --- Other Options --- */}
          <li className="px-3">
            <a 
              href="#" 
              onClick={() => handleLinkClick('Bookings')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded transition-colors ${
                activeTab === 'Bookings' ? 'bg-blue-600 text-white' : 'hover:bg-gray-800'
              }`}
            >
              <CalendarDays size={18} />
              <span className="text-sm">Bookings</span>
            </a>
          </li>

          <li className="px-3">
            <a 
              href="#" 
              onClick={() => handleLinkClick('Customers')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded transition-colors ${
                activeTab === 'Customers' ? 'bg-blue-600 text-white' : 'hover:bg-gray-800'
              }`}
            >
              <UserCheck size={18} />
              <span className="text-sm">Customers</span>
            </a>
          </li>

          <li className="px-3">
            <a 
              href="#" 
              onClick={() => handleLinkClick('Vendors')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded transition-colors ${
                activeTab === 'Vendors' ? 'bg-blue-600 text-white' : 'hover:bg-gray-800'
              }`}
            >
              <Store size={18} />
              <span className="text-sm">Vendors</span>
            </a>
          </li>

          <li className="px-3">
            <a 
              href="#" 
              onClick={() => handleLinkClick('Users')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded transition-colors ${
                activeTab === 'Users' ? 'bg-blue-600 text-white' : 'hover:bg-gray-800'
              }`}
            >
              <UserCog size={18} />
              <span className="text-sm">Users</span>
            </a>
          </li>

          <li className="px-3">
            <a 
              href="#" 
              onClick={() => handleLinkClick('Reports')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded transition-colors ${
                activeTab === 'Reports' ? 'bg-blue-600 text-white' : 'hover:bg-gray-800'
              }`}
            >
              <BarChart3 size={18} />
              <span className="text-sm">Reports</span>
            </a>
          </li>

          {/* Divider for lower section (Settings, Profile, etc.) */}
          <li className="px-4 py-2">
            <div className="h-px bg-gray-700/50 w-full"></div>
          </li>

          <li className="px-3">
            <a 
              href="#" 
              onClick={() => handleLinkClick('Settings')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded transition-colors ${
                activeTab === 'Settings' ? 'bg-blue-600 text-white' : 'hover:bg-gray-800'
              }`}
            >
              <Settings size={18} />
              <span className="text-sm">Settings</span>
            </a>
          </li>

          <li className="px-3">
            <a 
              href="#" 
              onClick={() => handleLinkClick('Account')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded transition-colors ${
                activeTab === 'Account' ? 'bg-blue-600 text-white' : 'hover:bg-gray-800'
              }`}
            >
              <CircleUser size={18} />
              <span className="text-sm">Account</span>
            </a>
          </li>

          <li className="px-3">
            <a 
              href="#" 
              onClick={() => handleLinkClick('Profile')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded transition-colors ${
                activeTab === 'Profile' ? 'bg-blue-600 text-white' : 'hover:bg-gray-800'
              }`}
            >
              <User size={18} />
              <span className="text-sm">Profile</span>
            </a>
          </li>

          <li className="px-3">
            <a 
              href="#" 
              onClick={() => handleLinkClick('Subscription')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded transition-colors ${
                activeTab === 'Subscription' ? 'bg-blue-600 text-white' : 'hover:bg-gray-800'
              }`}
            >
              <CreditCard size={18} />
              <span className="text-sm">Subscription Info</span>
            </a>
          </li>

          <li className="px-3 pb-4">
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded hover:bg-red-500/10 hover:text-red-400 transition-colors text-gray-400">
              <LogOut size={18} />
              <span className="text-sm">Logout</span>
            </a>
          </li>

        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;