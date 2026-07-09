import { useCallback, useEffect, useState } from "react";
import {
  Building2, Users, CreditCard, Clock, CheckCircle2, AlertTriangle, Loader2,
} from "lucide-react";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { analyticsService } from "../api/analyticsService";
import { useConsoleTheme } from "../theme/ConsoleThemeProvider";

const STATUS_COLORS = {
  ACTIVE: "#10b981", TRIAL: "#f59e0b", SUSPENDED: "#ef4444", EXPIRED: "#64748b",
};
const PLAN_COLORS = ["#c4b5fd", "#a855f7", "#7c3aed", "#db2777"];

// Colourful KPI chip palette — full literal classes so Tailwind's scanner emits them
// (dynamically-built class names like `bg-hue-${x}` would NOT be generated).
const HUE = {
  indigo:  "bg-hue-indigo-soft text-hue-indigo",
  emerald: "bg-hue-emerald-soft text-hue-emerald",
  amber:   "bg-hue-amber-soft text-hue-amber",
  sky:     "bg-hue-sky-soft text-hue-sky",
  violet:  "bg-hue-violet-soft text-hue-violet",
  rose:    "bg-hue-rose-soft text-hue-rose",
};

const symbol = (cur) => (cur === "INR" ? "₹" : cur ? `${cur} ` : "");
const money = (n, cur) => symbol(cur) + Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 });
const compact = (cur) => (v) => {
  const n = Number(v || 0);
  return n >= 1000 ? `${symbol(cur)}${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k` : `${symbol(cur)}${n}`;
};

// Chart colours follow the active console theme (light | dark).
function useChartTheme() {
  const { isDark } = useConsoleTheme();
  return {
    axis: isDark ? "#7b749f" : "#948eb0",
    tooltip: {
      background: isDark ? "#1b1836" : "#ffffff",
      border: `1px solid ${isDark ? "#3a3560" : "#e7e5f2"}`,
      borderRadius: 10,
      color: isDark ? "#f3f1ff" : "#17143a",
      fontSize: 12,
      boxShadow: "0 12px 32px -14px rgb(30 27 75 / 0.4)",
    },
    tooltipItem: { color: isDark ? "#f3f1ff" : "#17143a" },
    tooltipLabel: { color: isDark ? "#b4aed6" : "#514c70", fontWeight: 600 },
  };
}

function Tile({ label, value, Icon, hue = "violet", valueTone }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4 shadow-[var(--sa-card-shadow)] transition-transform duration-200 hover:-translate-y-0.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted">{label}</span>
        <span className={`inline-flex h-8 w-8 items-center justify-center rounded-xl ${HUE[hue]}`}>
          <Icon size={16} strokeWidth={2.2} />
        </span>
      </div>
      <div className={`mt-3 font-mono text-2xl font-bold ${valueTone || "text-heading"}`}>{value}</div>
    </div>
  );
}

function Donut({ title, data, colorFor }) {
  const t = useChartTheme();
  const total = data.reduce((s, d) => s + d.value, 0);
  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-[var(--sa-card-shadow)]">
      <h2 className="mb-3 text-sm font-semibold text-heading">{title}</h2>
      {total === 0 ? (
        <div className="flex h-56 items-center justify-center text-sm text-muted">No data yet</div>
      ) : (
        <>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} dataKey="value" nameKey="label" innerRadius={55} outerRadius={85}
                  paddingAngle={2} stroke="none">
                  {data.map((d, i) => <Cell key={d.label} fill={colorFor(d, i)} />)}
                </Pie>
                <Tooltip contentStyle={t.tooltip} itemStyle={t.tooltipItem} labelStyle={t.tooltipLabel} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1">
            {data.map((d, i) => (
              <div key={d.label} className="flex items-center gap-1.5 text-xs">
                <span className="h-2.5 w-2.5 rounded-sm" style={{ background: colorFor(d, i) }} />
                <span className="text-body">{d.label}</span>
                <span className="font-mono font-semibold text-heading">{d.value}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function Bars({ title, data, id, from, to, tickFormatter, tooltipFormatter }) {
  const t = useChartTheme();
  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-[var(--sa-card-shadow)]">
      <h2 className="mb-3 text-sm font-semibold text-heading">{title}</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 8, left: -8, bottom: 0 }}>
            <defs>
              <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={from} stopOpacity={0.95} />
                <stop offset="100%" stopColor={to} stopOpacity={0.9} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={t.axis} strokeOpacity={0.15} vertical={false} />
            <XAxis dataKey="label" tick={{ fill: t.axis, fontSize: 11 }}
              axisLine={{ stroke: t.axis, strokeOpacity: 0.3 }} tickLine={false} />
            <YAxis tick={{ fill: t.axis, fontSize: 11 }} axisLine={false} tickLine={false}
              width={tickFormatter ? 52 : 32} tickFormatter={tickFormatter} allowDecimals={false} />
            <Tooltip contentStyle={t.tooltip} itemStyle={t.tooltipItem} labelStyle={t.tooltipLabel}
              cursor={{ fill: t.axis, fillOpacity: 0.1 }}
              formatter={(v) => (tooltipFormatter ? tooltipFormatter(v) : v)} />
            <Bar dataKey="value" fill={`url(#${id})`} radius={[6, 6, 0, 0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function ConsoleHome() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setData(await analyticsService.overview());
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to load analytics.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) {
    return <div className="py-24 text-center text-muted"><Loader2 size={22} className="mx-auto animate-spin" /></div>;
  }
  if (error || !data) {
    return <div className="py-24 text-center text-red-500">{error || "No data."}</div>;
  }

  const cur = data.currency;
  const tiles = [
    { label: "Total Tenants", value: data.totalTenants, Icon: Building2, hue: "indigo" },
    { label: "Active", value: data.activeTenants, Icon: CheckCircle2, hue: "emerald" },
    { label: "Trial", value: data.trialTenants, Icon: Clock, hue: "amber" },
    { label: "Total Users", value: data.totalUsers, Icon: Users, hue: "sky" },
    { label: "MRR", value: money(data.mrr, cur), Icon: CreditCard, hue: "violet", valueTone: "text-accent" },
    { label: "Outstanding", value: money(data.outstanding, cur), Icon: AlertTriangle, hue: "rose",
      valueTone: Number(data.outstanding) > 0 ? "text-hue-rose" : "text-muted" },
  ];

  const revenueSeries = (data.revenueByMonth || []).map((r) => ({ label: r.month, value: r.amount }));

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-heading">Platform Overview</h1>
        <p className="mt-1 text-sm text-body">
          Live metrics across all tenants · collected this month {money(data.collectedThisMonth, cur)}.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {tiles.map((t) => <Tile key={t.label} {...t} />)}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Donut title="Tenants by status" data={data.tenantsByStatus || []}
          colorFor={(d) => STATUS_COLORS[d.label] || "#64748b"} />
        <Donut title="Tenants by plan" data={data.tenantsByPlan || []}
          colorFor={(d, i) => PLAN_COLORS[i % PLAN_COLORS.length]} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Bars title="New tenants / month" data={data.newTenantsByMonth || []} id="grad-tenants"
          from="#a855f7" to="#7c3aed" />
        <Bars title="Revenue / month" data={revenueSeries} id="grad-rev" from="#34d399" to="#059669"
          tickFormatter={compact(cur)} tooltipFormatter={(v) => money(v, cur)} />
      </div>
    </div>
  );
}
