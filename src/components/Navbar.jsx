
// import { useState } from "react";
// import { Menu, Plane, Bell, User, ChevronDown, Search, Settings, LogOut, HelpCircle } from "lucide-react";

// const Navbar = ({ toggleSidebar }) => {
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [searchFocused, setSearchFocused] = useState(false);
//   const [notifOpen, setNotifOpen] = useState(false);

//   const notifications = [
//     { id: 1, text: "New booking confirmed", sub: "Rajasthan Circuit · 2m ago", dot: "bg-blue-500" },
//     { id: 2, text: "Payment received", sub: "Nepal Tour · 18m ago", dot: "bg-emerald-500" },
//     { id: 3, text: "Review request pending", sub: "Kerala Backwaters · 1h ago", dot: "bg-amber-500" },
//   ];

//   return (
//     <header className="h-16 bg-white border-b border-slate-200/80 flex items-center justify-between px-3 sm:px-5 w-full shadow-[0_1px_3px_0_rgba(0,0,0,0.06)] relative z-30">

//       {/* ── Left ── */}
//       <div className="flex items-center gap-2 sm:gap-3">
//         <button
//           onClick={toggleSidebar}
//           className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 active:scale-95 transition-all duration-150"
//           aria-label="Toggle sidebar"
//         >
//           <Menu size={20} />
//         </button>

//         {/* Logo pill */}
//         <div className="flex items-center gap-2 px-2 py-1 rounded-xl hover:bg-slate-50 transition cursor-pointer">
//           <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-sm shadow-blue-200">
//             <Plane size={15} className="text-white -rotate-45" />
//           </div>
//           <span className="hidden sm:block font-bold text-slate-800 text-[15px] tracking-tight leading-none">
//             Travel<span className="text-blue-600">CRM</span>
//           </span>
//         </div>
//       </div>

      

//       {/* ── Right ── */}
//       <div className="flex items-center gap-1 sm:gap-2">

//         {/* Mobile search */}
//         <button className="w-9 h-9 md:hidden flex items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 transition">
//           <Search size={18} />
//         </button>

//         {/* Flight CTA */}
//         <button className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 active:scale-95 transition-all text-xs font-semibold border border-blue-100">
//           <Plane size={14} className="-rotate-45" />
//           <span className="hidden lg:block">New Booking</span>
//         </button>

//         {/* Notifications */}
//         <div className="relative">
//           <button
//             onClick={() => { setNotifOpen(!notifOpen); setDropdownOpen(false); }}
//             className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 active:scale-95 transition-all relative"
//             aria-label="Notifications"
//           >
//             <Bell size={18} />
//             <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
//           </button>

//           {notifOpen && (
//             <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/60 overflow-hidden">
//               <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
//                 <p className="text-sm font-semibold text-slate-800">Notifications</p>
//                 <span className="text-xs text-blue-600 font-medium cursor-pointer hover:underline">Mark all read</span>
//               </div>
//               <div className="divide-y divide-slate-50">
//                 {notifications.map((n) => (
//                   <div key={n.id} className="px-4 py-3 hover:bg-slate-50 cursor-pointer transition flex items-start gap-3">
//                     <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${n.dot}`} />
//                     <div>
//                       <p className="text-sm text-slate-700 font-medium">{n.text}</p>
//                       <p className="text-xs text-slate-400 mt-0.5">{n.sub}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//               <div className="px-4 py-2.5 border-t border-slate-100 text-center">
//                 <p className="text-xs text-blue-600 font-medium cursor-pointer hover:underline">View all notifications</p>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Divider */}
//         <div className="w-px h-6 bg-slate-200 hidden sm:block mx-1" />

//         {/* User dropdown */}
//         <div className="relative">
//           <button
//             onClick={() => { setDropdownOpen(!dropdownOpen); setNotifOpen(false); }}
//             className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-slate-100 active:scale-95 transition-all"
//           >
//             <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
//               RS
//             </div>
//             <div className="hidden md:block text-left">
//               <p className="text-[13px] font-semibold text-slate-800 leading-tight">Raghvendra Shahi</p>
//               <p className="text-[11px] text-slate-400 leading-tight">Admin</p>
//             </div>
//             <ChevronDown size={14} className={`hidden md:block text-slate-400 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
//           </button>

//           {dropdownOpen && (
//             <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/60 overflow-hidden">
//               {/* Profile header */}
//               <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3">
//                 <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
//                   RS
//                 </div>
//                 <div>
//                   <p className="text-sm font-semibold text-slate-800">Raghvendra Shahi</p>
//                   <p className="text-xs text-slate-400">raghv@travelcrm.in</p>
//                 </div>
//               </div>

//               {/* Menu items */}
//               <div className="py-1.5">
//                 {[
//                   { icon: User, label: "My Profile" },
//                   { icon: Settings, label: "Settings" },
//                   { icon: HelpCircle, label: "Help & Support" },
//                 ].map(({ icon: Icon, label }) => (
//                   <button
//                     key={label}
//                     className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition text-left"
//                   >
//                     <Icon size={15} className="text-slate-400" />
//                     {label}
//                   </button>
//                 ))}
//               </div>

//               <div className="border-t border-slate-100 py-1.5">
//                 <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-500 hover:bg-rose-50 transition text-left">
//                   <LogOut size={15} />
//                   Sign out
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Click outside overlay */}
//       {(dropdownOpen || notifOpen) && (
//         <div
//           className="fixed inset-0 z-[-1]"
//           onClick={() => { setDropdownOpen(false); setNotifOpen(false); }}
//         />
//       )}
//     </header>
//   );
// };

// export default Navbar;



import { memo, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"; // 👉 Added for Logout navigation
import {
  Menu, Plane, Bell, User, ChevronDown, ChevronRight,
  Search, Settings, LogOut, HelpCircle, CheckCheck,
} from "lucide-react";
import notificationService from "../services/notificationService";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(iso) {
  const m = Math.floor((Date.now() - new Date(iso)) / 60_000);
  if (m < 1)  return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

const TYPE_DOT = {
  BOOKING: "bg-blue-500",
  PAYMENT: "bg-emerald-500",
  LEAD:    "bg-violet-500",
  REMIND:  "bg-amber-500",
};
const typeDot = (type = "") =>
  Object.entries(TYPE_DOT).find(([k]) => type.includes(k))?.[1] ?? "bg-slate-400";

// ─── Breadcrumb (supports array or ReactNode) ─────────────────────────────────

function Breadcrumb({ items }) {
  if (!items) return null;

  // ReactNode passthrough
  if (!Array.isArray(items)) {
    return (
      <nav aria-label="breadcrumb" className="hidden md:flex items-center gap-1 text-xs text-slate-400">
        {items}
      </nav>
    );
  }

  // Array of { label, href? }
  return (
    <nav aria-label="breadcrumb" className="hidden md:flex items-center gap-1 text-xs">
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={i} className="flex items-center gap-1">
            {i > 0 && <ChevronRight size={11} className="text-slate-300 flex-shrink-0" />}
            {isLast ? (
              <span className="text-slate-700 font-medium">{item.label}</span>
            ) : (
              <a
                href={item.href ?? "#"}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                {item.label}
              </a>
            )}
          </span>
        );
      })}
    </nav>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

/**
 * Navbar — unified sticky top bar for all TravelCRM module pages.
 *
 * @param {function}            toggleSidebar   - Opens/closes the sidebar
 * @param {string}              [appName]       - Brand name (default "TravelCRM")
 * @param {Array|ReactNode}     [breadcrumb]    - Array of {label,href?} or any ReactNode
 * @param {function}            [onNewBooking]  - Callback for "New Booking" button
 */
const Navbar = memo(function Navbar({
  toggleSidebar,
  appName     = "TravelCRM",
  breadcrumb,
  onNewBooking,
}) {
  const navigate = useNavigate(); // For redirecting on logout

  const [dropdownOpen,  setDropdownOpen]  = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [notifOpen,     setNotifOpen]     = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount,   setUnreadCount]   = useState(0);
  const [loading,       setLoading]       = useState(false);
  const sseRef = useRef(null);

  // 👉 1. State for User Data fetched from Local Storage
  const [localUser, setLocalUser] = useState({
    name: "User",
    email: "loading...",
    role: "User",
    initials: "U"
  });

  // 👉 2. Fetch from Local Storage on Mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('userEmail');
    const savedRole = localStorage.getItem('userRole');

    if (savedEmail || savedRole) {
      // Format the role for display
      const formattedRole = 
        savedRole === 'super_admin' ? 'Super Admin' :
        savedRole === 'admin' ? 'Tenant Admin' : 'Standard User';
      
      // Use the part before the '@' as the name since we don't save full name yet
      const emailName = savedEmail ? savedEmail.split('@')[0] : 'User';

      setLocalUser({
        email: savedEmail || 'No Email',
        role: formattedRole,
        name: emailName,
        initials: emailName.substring(0, 2).toUpperCase()
      });
    }
  }, []);

  // Badge count + live SSE on mount
  useEffect(() => {
    notificationService.getUnreadCount().then(setUnreadCount);
    sseRef.current = notificationService.subscribeToSSE((incoming) => {
      setNotifications((prev) => [incoming, ...prev].slice(0, 20));
      setUnreadCount((c) => c + 1);
    });
    return () => sseRef.current?.close();
  }, []);

  const handleNotifOpen = async () => {
    const opening = !notifOpen;
    setNotifOpen(opening);
    setDropdownOpen(false);
    if (opening && notifications.length === 0) {
      setLoading(true);
      try {
        const data = await notificationService.getNotifications({ size: 10 });
        setNotifications(data.content ?? []);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleMarkAllRead = async () => {
    await notificationService.markAllRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, status: "READ" })));
    setUnreadCount(0);
  };

  const handleClickNotif = async (notif) => {
    if (notif.status === "UNREAD") {
      await notificationService.markRead(notif.publicId);
      setNotifications((prev) =>
        prev.map((n) => n.id === notif.id ? { ...n, status: "READ" } : n)
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    }
  };

  const closeAll = () => { setDropdownOpen(false); setNotifOpen(false); };

  // 👉 3. Actual Logout Logic
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
    navigate("/login"); // Redirect to login page
  };

  // ──────────────────────────────────────────────────────────────────────────

  return (
    <header className="h-14 bg-white border-b border-slate-200/80 flex items-center justify-between px-3 sm:px-5 w-full sticky top-0 z-40 shadow-[0_1px_3px_0_rgba(0,0,0,0.06)]">

      {/* ── Left: toggle + logo + breadcrumb ─────────────────── */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">

        {/* Sidebar toggle */}
        {toggleSidebar && (
          <button
            onClick={toggleSidebar}
            className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 active:scale-95 transition-all"
            aria-label="Toggle sidebar"
          >
            <Menu size={18} />
          </button>
        )}

        {/* Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-sm shadow-blue-200">
            <Plane size={13} className="text-white -rotate-45" />
          </div>
          <span className="hidden sm:block font-extrabold text-slate-800 text-[14px] tracking-tight">
            {appName.replace("TravelCRM", "Travel")}
            <span className="text-blue-600">
              {appName === "TravelCRM" ? "CRM" : ""}
            </span>
          </span>
        </div>

        {/* Divider + breadcrumb */}
        {breadcrumb && (
          <>
            <span className="hidden md:block w-px h-4 bg-slate-200 flex-shrink-0" />
            <Breadcrumb items={breadcrumb} />
          </>
        )}
      </div>

      {/* ── Right: actions ────────────────────────────────────── */}
      <div className="flex items-center gap-1 sm:gap-1.5">

        {/* Mobile search */}
        <button className="w-8 h-8 md:hidden flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 transition">
          <Search size={16} />
        </button>

        {/* New Booking CTA */}
        <button
          onClick={onNewBooking}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 active:scale-95 transition-all text-xs font-semibold border border-blue-100"
        >
          <Plane size={12} className="-rotate-45" />
          <span className="hidden lg:block">New Booking</span>
        </button>

        {/* Bell */}
        <div className="relative">
          <button
            onClick={handleNotifOpen}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 active:scale-95 transition-all relative"
            aria-label="Notifications"
          >
            <Bell size={17} />
            {unreadCount > 0 && (
              <span className="absolute top-0.5 right-0.5 min-w-[15px] h-[15px] px-0.5 bg-rose-500 rounded-full ring-[1.5px] ring-white flex items-center justify-center text-[8px] font-bold text-white leading-none">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/60 overflow-hidden">
              {/* Header */}
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-slate-800">Notifications</p>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-600 text-[10px] font-bold leading-none">
                      {unreadCount}
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="flex items-center gap-1 text-xs text-blue-600 font-medium hover:underline"
                  >
                    <CheckCheck size={11} />
                    Mark all read
                  </button>
                )}
              </div>

              {/* List */}
              <div className="divide-y divide-slate-50 max-h-72 overflow-y-auto">
                {loading ? (
                  <div className="py-8 text-center text-slate-400 text-xs">Loading…</div>
                ) : notifications.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 text-xs">
                    <Bell size={22} className="mx-auto mb-2 opacity-20" />
                    No notifications yet
                  </div>
                ) : notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => handleClickNotif(n)}
                    className={`px-4 py-3 cursor-pointer transition flex items-start gap-3
                      ${n.status === "UNREAD" ? "bg-blue-50/40 hover:bg-blue-50" : "hover:bg-slate-50"}`}
                  >
                    <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${typeDot(n.type)}`} />
                    <div className="min-w-0">
                      <p className={`text-sm leading-snug ${n.status === "UNREAD" ? "text-slate-800 font-semibold" : "text-slate-600 font-medium"}`}>
                        {n.title}
                      </p>
                      {n.message && (
                        <p className="text-xs text-slate-400 mt-0.5 truncate">{n.message}</p>
                      )}
                      <p className="text-[10px] text-slate-400 mt-1">{timeAgo(n.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="px-4 py-2.5 border-t border-slate-100 text-center">
                <span className="text-xs text-blue-600 font-medium cursor-pointer hover:underline">
                  View all notifications
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-5 bg-slate-200 hidden sm:block mx-0.5" />

        {/* User dropdown */}
        <div className="relative">
          <button
            onClick={() => { setDropdownOpen(!dropdownOpen); setNotifOpen(false); }}
            className="flex items-center gap-1.5 pl-1 pr-1.5 py-1 rounded-xl hover:bg-slate-100 active:scale-95 transition-all"
          >
            {/* 👉 4. Now using localUser state instead of default prop */}
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-[10px] font-bold shadow-sm flex-shrink-0">
              {localUser.initials}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-[12px] font-semibold text-slate-800 leading-tight">{localUser.name}</p>
              <p className="text-[10px] text-slate-400 leading-tight">{localUser.role}</p>
            </div>
            <ChevronDown
              size={13}
              className={`hidden md:block text-slate-400 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/60 overflow-hidden">
              {/* Profile */}
              <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {localUser.initials}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{localUser.name}</p>
                  <p className="text-xs text-slate-400 truncate">{localUser.email}</p>
                </div>
              </div>

              {/* Menu */}
              <div className="py-1.5">
                {[
                  { icon: User,       label: "My Profile" },
                  { icon: Settings,   label: "Settings" },
                  { icon: HelpCircle, label: "Help & Support" },
                ].map(({ icon: Icon, label }) => (
                  <button
                    key={label}
                    className="w-full flex items-center gap-3 px-4 py-2 text-[13px] text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition text-left"
                  >
                    <Icon size={14} className="text-slate-400" />
                    {label}
                  </button>
                ))}
              </div>

              <div className="border-t border-slate-100 py-1.5">
                {/* 👉 5. Wired up handleLogout to this button */}
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-[13px] text-rose-500 hover:bg-rose-50 transition text-left"
                >
                  <LogOut size={14} />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Click-outside overlay */}
      {(dropdownOpen || notifOpen) && (
        <div className="fixed inset-0 z-[-1]" onClick={closeAll} />
      )}
    </header>
  );
});

export default Navbar;