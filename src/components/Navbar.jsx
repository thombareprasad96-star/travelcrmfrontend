import React from 'react';
import { Menu, Plane, Phone, Bell, Clock, User } from 'lucide-react';

const Navbar = () => {
  return (
    // px-4 ko px-2 me badla gaya hai taaki left side se space kam ho
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-2 w-full font-sans shadow-sm">
      
      {/* Left Area: Hamburger Menu & Logo */}
      <div className="flex items-center gap-2"> {/* gap-4 ko gap-2 kiya gaya hai */}
        
        {/* Button ki padding kam karke left margin (ml-1) add ki hai */}
        <button className="p-1 text-gray-600 hover:bg-gray-100 rounded-md transition ml-1">
          <Menu size={24} />
        </button>
        
        {/* Placeholder for the blue circular logo */}
        <div className="w-8 h-8 rounded-full bg-blue-50 border-2 border-blue-600 flex items-center justify-center overflow-hidden">
           <img src="/api/placeholder/32/32" alt="Logo" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Right Area: Actions, Badges & Profile */}
      <div className="flex items-center gap-3 sm:gap-5 text-sm pr-2">
        
        {/* Blue Airplane Icon */}
        <button className="text-blue-500 hover:text-blue-600">
          <Plane size={24} className="transform -rotate-45" />
        </button>

        {/* WhatsApp Button */}
        {/* <div className="hidden sm:flex items-center gap-1.5 bg-green-50 text-green-600 px-3 py-1 rounded-full border border-green-200">
          <div className="bg-green-500 p-0.5 rounded-full">
            <Phone size={12} className="text-white fill-current" />
          </div>
          <span className="font-semibold text-xs">+91-9099097103</span>
        </div> */}

        {/* Notifications (Bell with Red Dot) */}
        {/* <button className="text-gray-500 hover:text-gray-700 relative">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button> */}

        {/* Timer Badge (Commented out by you) */}
        {/* <div className="hidden md:flex items-center gap-1.5 text-blue-600 font-medium">
          <Clock size={16} />
          <span>299:56</span>
        </div> */}

        {/* Subscription Plan Badge */}
      

        {/* User Profile */}
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