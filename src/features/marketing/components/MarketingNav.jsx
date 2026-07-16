// src/features/marketing/components/MarketingNav.jsx
// Sub-navigation across the four Marketing areas. Rendered under each page header.
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, Send, Workflow, Zap } from "lucide-react";

const TABS = [
  { key: "dashboard", label: "Overview", icon: LayoutDashboard, to: "/marketing" },
  { key: "segments", label: "Segments", icon: Users, to: "/marketing/segments" },
  { key: "campaigns", label: "Campaigns", icon: Send, to: "/marketing/campaigns" },
  { key: "drips", label: "Drip Sequences", icon: Workflow, to: "/marketing/drips" },
  { key: "automations", label: "Automations", icon: Zap, to: "/marketing/automations" },
];

export default function MarketingNav({ active }) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-wrap gap-1.5 bg-white/70 backdrop-blur-md border border-slate-200/60 rounded-2xl p-1.5 shadow-sm mkt-fade">
      {TABS.map((t) => {
        const on = active === t.key;
        const Icon = t.icon;
        return (
          <button key={t.key} type="button" onClick={() => navigate(t.to)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${on
              ? "bg-gradient-to-r from-blue-600 to-indigo-500 text-white shadow-md shadow-blue-200"
              : "text-slate-500 hover:bg-blue-50 hover:text-blue-600"}`}>
            <Icon className="w-4 h-4" />{t.label}
          </button>
        );
      })}
    </div>
  );
}