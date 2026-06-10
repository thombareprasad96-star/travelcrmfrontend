// import React from 'react';
// import { Menu, Plane, Phone, Bell, User } from 'lucide-react';

// // Navbar ab props mein toggleSidebar receive karega
// const Navbar = ({ toggleSidebar }) => {
//   return (
//     <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-2 w-full font-sans shadow-sm transition-all duration-300">
      
//       <div className="flex items-center gap-2">
//         {/* Is button par click karne se Sidebar open/close hoga */}
//         <button 
//           onClick={toggleSidebar} 
//           className="p-1 text-gray-600 hover:bg-gray-100 rounded-md transition ml-1"
//         >
//           <Menu size={24} />
//         </button>
        
//         <div className="w-8 h-8 rounded-full bg-blue-50 border-2 border-blue-600 flex items-center justify-center overflow-hidden">
//            <img src="/api/placeholder/32/32" alt="Logo" className="w-full h-full object-cover" />
//         </div>
//       </div>

//       {/* Right Area (Same as before) */}
//       <div className="flex items-center gap-3 sm:gap-5 text-sm pr-2">
//         <button className="text-blue-500 hover:text-blue-600">
//           <Plane size={24} className="transform -rotate-45" />
//         </button>
       
//         <div className="flex items-center gap-2 border-l border-gray-200 pl-4 sm:pl-5 cursor-pointer">
//           <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 border border-gray-200">
//             <User size={16} />
//           </div>
//           <span className="text-gray-600 font-medium hidden md:block">Raghvendra Shahi</span>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Navbar;







import { useState } from "react";
import { Menu, Plane, Bell, User, ChevronDown, Search, Settings, LogOut, HelpCircle } from "lucide-react";

const Navbar = ({ toggleSidebar }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const notifications = [
    { id: 1, text: "New booking confirmed", sub: "Rajasthan Circuit · 2m ago", dot: "bg-blue-500" },
    { id: 2, text: "Payment received", sub: "Nepal Tour · 18m ago", dot: "bg-emerald-500" },
    { id: 3, text: "Review request pending", sub: "Kerala Backwaters · 1h ago", dot: "bg-amber-500" },
  ];

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 flex items-center justify-between px-3 sm:px-5 w-full shadow-[0_1px_3px_0_rgba(0,0,0,0.06)] relative z-30">

      {/* ── Left ── */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={toggleSidebar}
          className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 active:scale-95 transition-all duration-150"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>

        {/* Logo pill */}
        <div className="flex items-center gap-2 px-2 py-1 rounded-xl hover:bg-slate-50 transition cursor-pointer">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-sm shadow-blue-200">
            <Plane size={15} className="text-white -rotate-45" />
          </div>
          <span className="hidden sm:block font-bold text-slate-800 text-[15px] tracking-tight leading-none">
            Travel<span className="text-blue-600">CRM</span>
          </span>
        </div>
      </div>

      {/* ── Center: Search ── */}
      <div className={`hidden md:flex items-center gap-2 px-3.5 py-2 rounded-xl border transition-all duration-200 w-64 lg:w-80
        ${searchFocused
          ? "border-blue-400 bg-blue-50/50 shadow-[0_0_0_3px_rgba(59,130,246,0.12)]"
          : "border-slate-200 bg-slate-50 hover:border-slate-300"}`}>
        <Search size={15} className={`flex-shrink-0 transition-colors ${searchFocused ? "text-blue-500" : "text-slate-400"}`} />
        <input
          type="text"
          placeholder="Search bookings, clients…"
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          className="bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none w-full"
        />
        <kbd className="hidden lg:flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-medium text-slate-400 shadow-sm flex-shrink-0">
          ⌘K
        </kbd>
      </div>

      {/* ── Right ── */}
      <div className="flex items-center gap-1 sm:gap-2">

        {/* Mobile search */}
        <button className="w-9 h-9 md:hidden flex items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 transition">
          <Search size={18} />
        </button>

        {/* Flight CTA */}
        <button className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 active:scale-95 transition-all text-xs font-semibold border border-blue-100">
          <Plane size={14} className="-rotate-45" />
          <span className="hidden lg:block">New Booking</span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setNotifOpen(!notifOpen); setDropdownOpen(false); }}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 active:scale-95 transition-all relative"
            aria-label="Notifications"
          >
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/60 overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-800">Notifications</p>
                <span className="text-xs text-blue-600 font-medium cursor-pointer hover:underline">Mark all read</span>
              </div>
              <div className="divide-y divide-slate-50">
                {notifications.map((n) => (
                  <div key={n.id} className="px-4 py-3 hover:bg-slate-50 cursor-pointer transition flex items-start gap-3">
                    <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${n.dot}`} />
                    <div>
                      <p className="text-sm text-slate-700 font-medium">{n.text}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{n.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2.5 border-t border-slate-100 text-center">
                <p className="text-xs text-blue-600 font-medium cursor-pointer hover:underline">View all notifications</p>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-slate-200 hidden sm:block mx-1" />

        {/* User dropdown */}
        <div className="relative">
          <button
            onClick={() => { setDropdownOpen(!dropdownOpen); setNotifOpen(false); }}
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-slate-100 active:scale-95 transition-all"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
              RS
            </div>
            <div className="hidden md:block text-left">
              <p className="text-[13px] font-semibold text-slate-800 leading-tight">Raghvendra Shahi</p>
              <p className="text-[11px] text-slate-400 leading-tight">Admin</p>
            </div>
            <ChevronDown size={14} className={`hidden md:block text-slate-400 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/60 overflow-hidden">
              {/* Profile header */}
              <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                  RS
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">Raghvendra Shahi</p>
                  <p className="text-xs text-slate-400">raghv@travelcrm.in</p>
                </div>
              </div>

              {/* Menu items */}
              <div className="py-1.5">
                {[
                  { icon: User, label: "My Profile" },
                  { icon: Settings, label: "Settings" },
                  { icon: HelpCircle, label: "Help & Support" },
                ].map(({ icon: Icon, label }) => (
                  <button
                    key={label}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition text-left"
                  >
                    <Icon size={15} className="text-slate-400" />
                    {label}
                  </button>
                ))}
              </div>

              <div className="border-t border-slate-100 py-1.5">
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-500 hover:bg-rose-50 transition text-left">
                  <LogOut size={15} />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Click outside overlay */}
      {(dropdownOpen || notifOpen) && (
        <div
          className="fixed inset-0 z-[-1]"
          onClick={() => { setDropdownOpen(false); setNotifOpen(false); }}
        />
      )}
    </header>
  );
};

export default Navbar;