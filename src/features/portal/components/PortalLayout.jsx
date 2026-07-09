// src/features/portal/components/PortalLayout.jsx
// Chrome + route guard. Full-width, responsive: inline top nav on laptop,
// sticky bottom nav on mobile. No token → login.
import { Outlet, NavLink, Navigate, useNavigate } from "react-router-dom";
import { Plane, CreditCard, FileText, LogOut, Briefcase, Sparkles } from "lucide-react";
import portalService from "../api/portalService";
import { TRAVELER_TOKEN_KEY, TRAVELER_NAME_KEY } from "../api/portalClient";

const NAV = [
  { to: "/portal", label: "My Trips", icon: Briefcase, end: true },
  { to: "/portal/payments", label: "Payments", icon: CreditCard, end: false },
  { to: "/portal/documents", label: "Documents", icon: FileText, end: false },
  { to: "/portal/help", label: "What's New", icon: Sparkles, end: false },
];

export default function PortalLayout() {
  const navigate = useNavigate();
  const token = localStorage.getItem(TRAVELER_TOKEN_KEY);
  const name = localStorage.getItem(TRAVELER_NAME_KEY) || "Traveler";

  // Guard: no traveler token → back to portal login.
  if (!token) return <Navigate to="/portal/login" replace />;

  const initials = name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase() || "T";
  const handleLogout = () => {
    portalService.logout();
    navigate("/portal/login", { replace: true });
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100"
      style={{ fontFamily: "'Plus Jakarta Sans','Inter',system-ui,sans-serif" }}
    >
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-300/40">
              <Plane size={17} className="text-white -rotate-45" />
            </div>
            <p className="text-[15px] font-extrabold text-slate-800 tracking-tight">
              Traveler<span className="text-blue-600">Portal</span>
            </p>
          </div>

          {/* Desktop inline nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-xl text-[13.5px] font-semibold transition ${
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                  }`
                }
              >
                <Icon size={16} /> {label}
              </NavLink>
            ))}
          </nav>

          {/* User + logout */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden sm:flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-[12px] font-bold shadow-sm">
                {initials}
              </div>
              <div className="leading-tight text-right">
                <p className="text-[11px] text-slate-400 font-medium">Signed in</p>
                <p className="text-[13px] font-bold text-slate-800 -mt-0.5 max-w-[150px] truncate">{name}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-slate-500 hover:text-rose-600 text-xs font-semibold px-3 py-2 rounded-xl hover:bg-rose-50 transition"
            >
              <LogOut size={16} /> <span className="hidden sm:block">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Content — full width up to a comfortable max */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 lg:py-8 pb-28 lg:pb-10">
        <Outlet />
      </main>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/90 backdrop-blur-xl border-t border-slate-200">
        <div className="grid grid-cols-4">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 py-2.5 text-[11px] font-semibold transition ${
                  isActive ? "text-blue-600" : "text-slate-400"
                }`
              }
            >
              <Icon size={19} />
              {label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}