// src/features/marketing/pages/MarketingDashboard.jsx
// Marketing overview: KPIs + analytics (recharts) aggregated client-side from the
// existing /marketing endpoints (no dedicated dashboard endpoint — keeps the locked
// contract intact). Blue→indigo primary with a gold (#eeda92) accent.
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Send, Rocket, Users, Workflow, Filter, Zap, CalendarHeart,
  MailCheck, ArrowRight, CheckCircle2, PauseCircle,
} from "lucide-react";
import {
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";
import { useToast } from "@shared/ui/toast";
import { getErrorMessage, isAlreadyReported } from "@shared/api/apiError";
import { hasPermission, P } from "@shared/lib/access";
import marketingService from "../api/marketingService";
import { AUTOMATION_META } from "../constants";
import MarketingNav from "../components/MarketingNav";
import {
  Page, Hero, Panel, PanelHead, Badge, ChannelBadge, Btn, Loading, EmptyBlock, Avatar,
  CAMPAIGN_STATUS_TONE, titleCase,
} from "../components/marketingUi";

const STATUS_COLORS = {
  DRAFT: "#94a3b8", SCHEDULED: "#eeda92", SENDING: "#3b82f6",
  SENT: "#10b981", FAILED: "#ef4444", CANCELLED: "#f43f5e",
};
const CHANNEL_COLORS = { WHATSAPP: "#10b981", EMAIL: "#3b82f6" };
const SEGMENT_BAR = "#6366f1";   // indigo-500

const arr = (res) => (Array.isArray(res?.data?.data) ? res.data.data : []);
const obj = (res) => (res?.data?.data ?? null);

export default function MarketingDashboard() {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [segments, setSegments] = useState([]);
  const [drips, setDrips] = useState([]);
  const [automations, setAutomations] = useState([]);
  const [upcoming, setUpcoming] = useState([]);

  const load = useCallback(async () => {
    setLoading(true);
    const [s, c, seg, d, a, u] = await Promise.allSettled([
      marketingService.getCampaignSummary(),
      marketingService.listCampaigns({ page: 0, size: 50, sortBy: "createdAt", sortDir: "desc" }),
      marketingService.listSegments({ page: 0, size: 50 }),
      marketingService.listDrips({ page: 0, size: 50 }),
      marketingService.listAutomations(),
      marketingService.getUpcomingCelebrations({ days: 30 }),
    ]);
    // Surface the first hard failure once; partial data still renders.
    const firstErr = [s, c, seg, d, a, u].find((r) => r.status === "rejected");
    if (firstErr && !isAlreadyReported(firstErr.reason)) {
      showToast(getErrorMessage(firstErr.reason, "Some marketing data couldn't be loaded."), "error");
    }
    setSummary(s.status === "fulfilled" ? obj(s.value) : null);
    setCampaigns(c.status === "fulfilled" ? arr(c.value) : []);
    setSegments(seg.status === "fulfilled" ? arr(seg.value) : []);
    setDrips(d.status === "fulfilled" ? arr(d.value) : []);
    setAutomations(a.status === "fulfilled" ? arr(a.value) : []);
    setUpcoming(u.status === "fulfilled" ? arr(u.value) : []);
    setLoading(false);
  }, [showToast]);

  useEffect(() => { load(); }, [load]);

  const statusDonut = useMemo(() => {
    const counts = {};
    campaigns.forEach((c) => { counts[c.status] = (counts[c.status] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [campaigns]);

  const channelDonut = useMemo(() => {
    const counts = {};
    campaigns.forEach((c) => { counts[c.channel] = (counts[c.channel] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [campaigns]);

  const topSegments = useMemo(() =>
    [...segments]
      .sort((a, b) => (b.memberCount ?? 0) - (a.memberCount ?? 0))
      .slice(0, 6)
      .map((s) => ({ name: s.name.length > 16 ? s.name.slice(0, 15) + "…" : s.name, members: s.memberCount ?? 0 }))
      .reverse(),
    [segments]);

  const activeDrips = useMemo(() => drips.filter((d) => d.status === "ACTIVE").length, [drips]);
  const recentCampaigns = useMemo(() => campaigns.slice(0, 6), [campaigns]);

  if (loading) {
    return (
      <Page icon={LayoutDashboard} title="Marketing Overview" crumb="Overview" subtitle="Campaigns, segments, drips & automations">
        <MarketingNav active="dashboard" />
        <Loading label="Loading your marketing overview…" />
      </Page>
    );
  }

  const totalCampaigns = summary?.total ?? campaigns.length;
  const messagesThisMonth = summary?.messagesSentThisMonth ?? 0;
  const reachable = summary?.audienceReachable ?? 0;
  const totalSegments = segments.length;

  return (
    <Page icon={LayoutDashboard} title="Marketing Overview" crumb="Overview" subtitle="Campaigns, segments, drips & automations"
      actions={hasPermission(P.MARKETING_CREATE) && <Btn onClick={() => navigate("/marketing/campaigns")}><Send className="w-4 h-4" /> Campaigns</Btn>}>
      <MarketingNav active="dashboard" />

      {/* ── KPI hero cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Hero label="Total campaigns" value={totalCampaigns} sub={`${summary?.drafts ?? 0} drafts · ${summary?.scheduled ?? 0} scheduled`} icon={<Send className="w-5 h-5" />} />
        <Hero label="Messages this month" value={messagesThisMonth} gradient="from-blue-600 to-indigo-600" icon={<Rocket className="w-5 h-5" />} delay={80} />
        <Hero label="Reachable audience" value={reachable} sub="customers with phone/email" gradient="from-gold-400 to-gold-600" icon={<Users className="w-5 h-5" />} delay={160} />
        <Hero label="Active drips" value={activeDrips} sub={`${drips.length} sequences total`} gradient="from-emerald-500 to-green-600" icon={<Workflow className="w-5 h-5" />} delay={240} />
      </div>

      {/* ── Analytics row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Campaign status donut */}
        <Panel>
          <PanelHead icon={Send} title="Campaign status" count={campaigns.length} />
          <div className="p-5">
            {statusDonut.length === 0 ? <EmptyBlock icon={Send} title="No campaigns yet" hint="Your campaign mix will show here." />
              : (
                <>
                  <ResponsiveContainer width="100%" height={190}>
                    <PieChart>
                      <Pie data={statusDonut} cx="50%" cy="50%" innerRadius={48} outerRadius={80} paddingAngle={3} dataKey="value">
                        {statusDonut.map((e) => <Cell key={e.name} fill={STATUS_COLORS[e.name] || "#cbd5e1"} />)}
                      </Pie>
                      <Tooltip formatter={(v, n) => [v, titleCase(n)]} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-wrap gap-2 justify-center mt-2">
                    {statusDonut.map((e) => (
                      <span key={e.name} className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ background: STATUS_COLORS[e.name] || "#cbd5e1" }} />
                        {titleCase(e.name)} <span className="text-slate-400">({e.value})</span>
                      </span>
                    ))}
                  </div>
                </>
              )}
          </div>
        </Panel>

        {/* Channel split donut */}
        <Panel>
          <PanelHead icon={MailCheck} title="Channel split" />
          <div className="p-5">
            {channelDonut.length === 0 ? <EmptyBlock icon={MailCheck} title="No sends yet" hint="WhatsApp vs Email will show here." />
              : (
                <>
                  <ResponsiveContainer width="100%" height={190}>
                    <PieChart>
                      <Pie data={channelDonut} cx="50%" cy="50%" innerRadius={48} outerRadius={80} paddingAngle={3} dataKey="value">
                        {channelDonut.map((e) => <Cell key={e.name} fill={CHANNEL_COLORS[e.name] || "#cbd5e1"} />)}
                      </Pie>
                      <Tooltip formatter={(v, n) => [v, n === "WHATSAPP" ? "WhatsApp" : "Email"]} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-wrap gap-3 justify-center mt-2">
                    {channelDonut.map((e) => (
                      <span key={e.name} className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ background: CHANNEL_COLORS[e.name] || "#cbd5e1" }} />
                        {e.name === "WHATSAPP" ? "WhatsApp" : "Email"} <span className="text-slate-400">({e.value})</span>
                      </span>
                    ))}
                  </div>
                </>
              )}
          </div>
        </Panel>

        {/* Top segments by size */}
        <Panel>
          <PanelHead icon={Filter} title="Largest segments" count={totalSegments} />
          <div className="p-5">
            {topSegments.length === 0 ? <EmptyBlock icon={Filter} title="No segments yet" hint="Create a segment to target customers." action={hasPermission(P.MARKETING_CREATE) && <Btn size="sm" onClick={() => navigate("/marketing/segments")}>New segment</Btn>} />
              : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={topSegments} layout="vertical" margin={{ top: 0, right: 12, left: 6, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis type="number" tick={{ fontSize: 11, fontWeight: 700, fill: "#94a3b8" }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <YAxis type="category" dataKey="name" width={96} tick={{ fontSize: 11, fontWeight: 700, fill: "#64748b" }} axisLine={false} tickLine={false} />
                    <Tooltip formatter={(v) => [v.toLocaleString("en-IN"), "Members"]} cursor={{ fill: "#eeda9218" }} />
                    <Bar dataKey="members" fill={SEGMENT_BAR} radius={[0, 6, 6, 0]} barSize={16} />
                  </BarChart>
                </ResponsiveContainer>
              )}
          </div>
        </Panel>
      </div>

      {/* ── Lists row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent campaigns */}
        <Panel>
          <PanelHead icon={Send} title="Recent campaigns" right={<button onClick={() => navigate("/marketing/campaigns")} className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1">View all <ArrowRight className="w-3.5 h-3.5" /></button>} />
          <div className="divide-y divide-slate-50">
            {recentCampaigns.length === 0 ? <EmptyBlock icon={Send} title="No campaigns yet" />
              : recentCampaigns.map((c) => (
                <div key={c.publicId} className="flex items-center gap-3 px-5 py-3">
                  <Avatar text={c.name} gradient={c.channel === "WHATSAPP" ? "from-emerald-500 to-green-600" : "from-blue-500 to-indigo-600"} size="w-9 h-9" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-700 truncate">{c.name}</p>
                    <div className="flex items-center gap-2 mt-0.5"><ChannelBadge channel={c.channel} /><span className="text-xs text-slate-400">{c.totalRecipients ? `${c.sentCount || 0}/${c.totalRecipients} sent` : "—"}</span></div>
                  </div>
                  <Badge tone={CAMPAIGN_STATUS_TONE[c.status] || "slate"}>{titleCase(c.status)}</Badge>
                </div>
              ))}
          </div>
        </Panel>

        {/* Upcoming celebrations */}
        <Panel>
          <PanelHead icon={CalendarHeart} title="Upcoming celebrations" count={upcoming.length} right={<span className="text-xs text-slate-400">next 30 days</span>} />
          <div className="divide-y divide-slate-50">
            {upcoming.length === 0 ? <EmptyBlock icon={CalendarHeart} title="Nothing coming up" hint="Birthdays & anniversaries in the next 30 days appear here." />
              : upcoming.slice(0, 6).map((u) => (
                <div key={`${u.customerPublicId}-${u.triggerType}`} className="flex items-center gap-3 px-5 py-3">
                  <Avatar text={u.customerName} gradient={u.triggerType === "BIRTHDAY" ? "from-amber-400 to-orange-500" : "from-rose-400 to-pink-600"} size="w-9 h-9" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-700 truncate">{u.customerName}</p>
                    <p className="text-xs text-slate-400">{AUTOMATION_META[u.triggerType]?.icon} {u.triggerType === "BIRTHDAY" ? "Birthday" : "Anniversary"} · {u.date}</p>
                  </div>
                  <Badge tone={u.daysAway === 0 ? "green" : "slate"}>{u.daysAway === 0 ? "Today" : `${u.daysAway}d`}</Badge>
                </div>
              ))}
          </div>
        </Panel>
      </div>

      {/* ── Automations status ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {automations.map((a) => {
          const meta = AUTOMATION_META[a.triggerType] || { label: a.triggerType, icon: "🎉" };
          return (
            <Panel key={a.triggerType} className="p-5 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${a.enabled ? "bg-blue-50" : "bg-slate-100"}`}>{meta.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-extrabold text-slate-700">{meta.label} automation</h3>
                  {a.enabled
                    ? <Badge tone="green"><CheckCircle2 className="w-3 h-3" /> On</Badge>
                    : <Badge tone="slate"><PauseCircle className="w-3 h-3" /> Off</Badge>}
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{(a.totalSent ?? 0).toLocaleString("en-IN")} sent all-time · {a.upcomingCount ?? 0} upcoming</p>
              </div>
              <button onClick={() => navigate("/marketing/automations")} className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 flex-shrink-0">
                <Zap className="w-3.5 h-3.5" /> Configure
              </button>
            </Panel>
          );
        })}
      </div>
    </Page>
  );
}