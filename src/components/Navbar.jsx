import React from 'react';
import { Menu, Plane, Phone, Bell, User } from 'lucide-react';

// Navbar ab props mein toggleSidebar receive karega
const Navbar = ({ toggleSidebar }) => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-2 w-full font-sans shadow-sm transition-all duration-300">
      
      <div className="flex items-center gap-2">
        {/* Is button par click karne se Sidebar open/close hoga */}
        <button 
          onClick={toggleSidebar} 
          className="p-1 text-gray-600 hover:bg-gray-100 rounded-md transition ml-1"
        >
          <Menu size={24} />
        </button>
        
        <div className="w-8 h-8 rounded-full bg-blue-50 border-2 border-blue-600 flex items-center justify-center overflow-hidden">
           <img src="/api/placeholder/32/32" alt="Logo" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Right Area (Same as before) */}
      <div className="flex items-center gap-3 sm:gap-5 text-sm pr-2">
        <button className="text-blue-500 hover:text-blue-600">
          <Plane size={24} className="transform -rotate-45" />
        </button>
        {/* <div className="hidden sm:flex items-center gap-1.5 bg-green-50 text-green-600 px-3 py-1 rounded-full border border-green-200">
          <div className="bg-green-500 p-0.5 rounded-full">
            <Phone size={12} className="text-white fill-current" />
          </div>
          <span className="font-semibold text-xs">+91-9099097103</span>
        </div> */}
        {/* <button className="text-gray-500 hover:text-gray-700 relative">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button> */}
        {/* <div className="hidden lg:flex items-center gap-1.5 bg-green-500 text-white px-3 py-1 rounded shadow-sm text-xs font-medium">
          <div className="w-3 h-3 bg-white text-green-600 rounded-full flex items-center justify-center font-bold text-[8px]">i</div>
          <span></span>
        </div> */}
        <div className="flex items-center gap-2 border-l border-gray-200 pl-4 sm:pl-5 cursor-pointer">
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 border border-gray-200">
            <User size={16} />
          </div>
          <span className="text-gray-600 font-medium hidden md:block">Raghvendra Shahi</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;