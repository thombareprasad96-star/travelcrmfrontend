import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  CreditCard,
  Users,
  ToggleLeft,
  Settings2,
  ScrollText,
  Megaphone,
  Wrench,
  Gauge,
  Palette as PaletteIcon,
  ShieldCheck,
} from "lucide-react";

// Live items link; future items render disabled with a "soon" tag until their phase ships.
const NAV = [
  { to: "/console", label: "Dashboard", Icon: LayoutDashboard, end: true },
  { to: "/console/tenants", label: "Tenants", Icon: Building2 },
  { to: "/console/palette", label: "Design Tokens", Icon: PaletteIcon },
  { to: "/console/plans", label: "Subscriptions", Icon: CreditCard },
  { to: "/console/usage", label: "Usage & Quotas", Icon: Gauge },
  { to: "/console/users", label: "Users", Icon: Users },
  { to: "/console/feature-flags", label: "Feature Flags", Icon: ToggleLeft },
  { to: "/console/config", label: "Global Config", Icon: Settings2 },
  { to: "/console/audit", label: "Audit Log", Icon: ScrollText },
  { to: "/console/announcements", label: "Announcements", Icon: Megaphone },
  { to: "/console/ops", label: "Ops / Danger", Icon: Wrench },
];

export default function ConsoleSidebar({ collapsed }) {
  return (
    <aside
      className={`${collapsed ? "w-16" : "w-60"} hidden shrink-0 border-r border-border bg-sidebar transition-[width] duration-200 sm:block`}
    >
      <div className="flex h-14 items-center gap-2.5 border-b border-border px-4">
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-white shadow-[var(--sa-card-shadow)]"
          style={{ backgroundImage: "var(--sa-gradient)" }}
        >
          <ShieldCheck size={18} />
        </div>
        {!collapsed && (
          <span
            className="truncate bg-clip-text text-sm font-bold text-transparent"
            style={{ backgroundImage: "var(--sa-gradient)" }}
          >
            Platform Console
          </span>
        )}
      </div>

      <nav className="flex flex-col gap-0.5 p-2">
        {NAV.map((item) =>
          item.soon ? (
            <div
              key={item.label}
              title={`${item.label} — coming soon`}
              className="flex cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2 text-sm text-muted"
            >
              <item.Icon size={18} className="shrink-0 opacity-70" />
              {!collapsed && <span className="flex-1 truncate opacity-70">{item.label}</span>}
              {!collapsed && (
                <span className="rounded bg-surface-hover px-1.5 py-0.5 text-[10px] font-medium text-muted">
                  soon
                </span>
              )}
            </div>
          ) : (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.end}
              title={item.label}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? "bg-accent-soft font-semibold text-accent-soft-text ring-1 ring-inset ring-accent/15"
                    : "text-body hover:bg-surface-hover hover:text-heading"
                }`
              }
            >
              <item.Icon size={18} className="shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          )
        )}
      </nav>
    </aside>
  );
}