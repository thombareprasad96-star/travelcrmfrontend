// src/features/marketing/pages/Campaigns.jsx
import { useCallback, useEffect, useState } from "react";
import { Send, Plus, Search, Pencil, Trash2, Eye, RefreshCw, Rocket, Ban, Beaker, MailCheck, Users, Clock } from "lucide-react";
import { toast, useToast } from "@shared/ui/toast";
import { getErrorMessage, isAlreadyReported } from "@shared/api/apiError";
import { hasPermission, P } from "@shared/lib/access";
import marketingService from "../api/marketingService";
import { CHANNELS, CAMPAIGN_STATUS_OPTIONS } from "../constants";
import MarketingNav from "../components/MarketingNav";
import MessageComposer from "../components/MessageComposer";
import TestSendModal from "../components/TestSendModal";
import {
  Page, Hero, Panel, PanelHead, Badge, ChannelBadge, Btn, IconBtn, Th, theadCls, EmptyRow,
  SkeletonRows, Pager, Modal, Field, inputCls, Select, CAMPAIGN_STATUS_TONE, RECIPIENT_STATUS_TONE, titleCase,
  GridHead, GridRow, Cell, Avatar, GridSkeleton, GridEmpty,
} from "../components/marketingUi";

const SIZE = 10;
const CAMP_COLS = "1.8fr 0.9fr 1fr 0.9fr 0.9fr 1fr 168px";

export default function Campaigns() {
  const { showToast } = useToast();
  const canCreate = hasPermission(P.MARKETING_CREATE);
  const canSend = hasPermission(P.MARKETING_SEND);

  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState(null);
  const [summary, setSummary] = useState(null);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [channel, setChannel] = useState("");
  const [loading, setLoading] = useState(true);

  const [composing, setComposing] = useState(null);   // campaign or {} for new
  const [recipientsOf, setRecipientsOf] = useState(null);
  const [testing, setTesting] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const loadSummary = useCallback(() => {
    marketingService.getCampaignSummary().then((res) => setSummary(res.data?.data ?? null)).catch(() => {});
  }, []);

  const fetchRows = useCallback(async () => {
    setLoading(true);
    try {
      const res = await marketingService.listCampaigns({ page, size: SIZE, sortBy: "updatedAt", sortDir: "desc", search, status, channel });
      const body = res.data;
      setRows(Array.isArray(body?.data) ? body.data : []);
      const pg = body?.pagination;
      setMeta(pg ? { page: pg.page, totalPages: pg.totalPages, total: pg.totalElements, from: pg.totalElements === 0 ? 0 : pg.page * pg.size + 1, to: Math.min((pg.page + 1) * pg.size, pg.totalElements) } : null);
    } catch (error) {
      if (!isAlreadyReported(error)) showToast(getErrorMessage(error, "Couldn't load campaigns."), "error");
    } finally {
      setLoading(false);
    }
  }, [page, search, status, channel, showToast]);

  useEffect(() => { fetchRows(); }, [fetchRows]);
  useEffect(() => { loadSummary(); }, [loadSummary]);

  const act = async (fn, id, okMsg) => {
    setBusyId(id);
    try { await fn(); toast.success(okMsg); fetchRows(); loadSummary(); }
    catch (error) { if (!isAlreadyReported(error)) toast.error(getErrorMessage(error, "Action failed.")); }
    finally { setBusyId(null); }
  };

  const sendNow = (c) => {
    if (!window.confirm(`Send "${c.name}" now to ${c.audienceType === "ALL_CUSTOMERS" ? "all customers" : "the “" + (c.segmentName || "segment") + "”"}?`)) return;
    act(() => marketingService.sendCampaign(c.publicId), c.publicId, "Campaign is sending.");
  };
  const cancel = (c) => act(() => marketingService.cancelCampaign(c.publicId), c.publicId, "Campaign cancelled.");
  const remove = (c) => { if (window.confirm(`Delete "${c.name}"?`)) act(() => marketingService.deleteCampaign(c.publicId), c.publicId, "Campaign deleted."); };

  return (
    <Page icon={Send} title="Campaigns" crumb="Campaigns"
      actions={canCreate && <Btn onClick={() => setComposing({})}><Plus className="w-4 h-4" /> New Campaign</Btn>}>

      <MarketingNav active="campaigns" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Hero label="Total campaigns" value={summary?.total ?? 0} icon={<Send className="w-5 h-5" />} />
        <Hero label="Sent" value={summary?.sent ?? 0} sub={`${summary?.drafts ?? 0} drafts · ${summary?.scheduled ?? 0} scheduled`} gradient="from-emerald-500 to-green-600" icon={<MailCheck className="w-5 h-5" />} delay={80} />
        <Hero label="Messages this month" value={summary?.messagesSentThisMonth ?? 0} gradient="from-blue-600 to-indigo-600" icon={<Rocket className="w-5 h-5" />} delay={160} />
        <Hero label="Reachable customers" value={summary?.audienceReachable ?? 0} gradient="from-gold-400 to-gold-600" icon={<Users className="w-5 h-5" />} delay={240} />
      </div>

      <Panel>
        <PanelHead icon={Send} title="All Campaigns" count={meta?.total ?? rows.length} right={
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input className={inputCls + " pl-9 w-full sm:w-52"} placeholder="Search…" value={search} onChange={(e) => { setPage(0); setSearch(e.target.value); }} />
            </div>
            <div className="w-40"><Select value={status} onChange={(e) => { setPage(0); setStatus(e.target.value); }}>{CAMPAIGN_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</Select></div>
            <div className="w-36"><Select value={channel} onChange={(e) => { setPage(0); setChannel(e.target.value); }}><option value="">All channels</option>{CHANNELS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</Select></div>
          </div>
        } />

        <GridHead cols={CAMP_COLS}>
          <Cell first>Campaign</Cell><Cell>Channel</Cell><Cell>Audience</Cell><Cell>Status</Cell><Cell right>Sent / Total</Cell><Cell>When</Cell><Cell right>Actions</Cell>
        </GridHead>

        <div>
          {loading ? <GridSkeleton cols={CAMP_COLS} rows={5} />
            : rows.length === 0 ? <GridEmpty icon={Send} title="No campaigns yet" hint="Compose a WhatsApp or email broadcast to a segment or all customers." />
            : rows.map((c, i) => {
              const busy = busyId === c.publicId;
              const avatarGrad = c.channel === "WHATSAPP" ? "from-emerald-500 to-green-600" : "from-blue-500 to-indigo-600";
              const whenStr = (c.sentAt || c.scheduledAt || "").slice(0, 16).replace("T", " ") || "—";
              const sentTotal = c.totalRecipients ? `${c.sentCount || 0} / ${c.totalRecipients}` : "—";
              const actions = (
                <>
                  <IconBtn tone="blue" title="Recipients" onClick={() => setRecipientsOf(c)}><Eye className="w-4 h-4" /></IconBtn>
                  {canSend && <IconBtn tone="slate" title="Send test" onClick={() => setTesting(c)}><Beaker className="w-4 h-4" /></IconBtn>}
                  {["DRAFT", "SCHEDULED"].includes(c.status) && hasPermission(P.MARKETING_UPDATE) && <IconBtn tone="indigo" title="Edit" onClick={() => setComposing(c)}><Pencil className="w-4 h-4" /></IconBtn>}
                  {c.status === "DRAFT" && canSend && <IconBtn tone="emerald" title="Send now" disabled={busy} onClick={() => sendNow(c)}>{busy ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Rocket className="w-4 h-4" />}</IconBtn>}
                  {c.status === "SCHEDULED" && canSend && <IconBtn tone="red" title="Cancel schedule" disabled={busy} onClick={() => cancel(c)}><Ban className="w-4 h-4" /></IconBtn>}
                  {["DRAFT", "FAILED", "CANCELLED"].includes(c.status) && hasPermission(P.MARKETING_DELETE) && <IconBtn tone="red" title="Delete" disabled={busy} onClick={() => remove(c)}>{busy ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}</IconBtn>}
                </>
              );
              return (
                <div key={c.publicId}>
                  {/* Desktop grid row */}
                  <GridRow cols={CAMP_COLS} index={i}>
                    <Cell first>
                      <Avatar text={c.name} gradient={avatarGrad} />
                      <div className="ml-3 min-w-0">
                        <p className="text-sm font-extrabold text-slate-700 truncate">{c.name}</p>
                        {c.subject && <p className="text-xs text-slate-400 truncate max-w-[220px]">{c.subject}</p>}
                      </div>
                    </Cell>
                    <Cell><ChannelBadge channel={c.channel} /></Cell>
                    <Cell>{c.audienceType === "ALL_CUSTOMERS" ? <Badge tone="sky">All customers</Badge> : <span className="text-sm text-slate-500 truncate">{c.segmentName || "—"}</span>}</Cell>
                    <Cell><Badge tone={CAMPAIGN_STATUS_TONE[c.status] || "slate"}>{titleCase(c.status)}</Badge></Cell>
                    <Cell right><span className="text-sm font-bold text-slate-600">{sentTotal}{c.failedCount ? <span className="text-red-500 text-xs ml-1">({c.failedCount} failed)</span> : null}</span></Cell>
                    <Cell><span className="text-sm text-slate-500 truncate">{whenStr}</span></Cell>
                    <Cell right><div className="flex items-center justify-end gap-1.5 flex-wrap opacity-60 group-hover:opacity-100 transition-opacity">{actions}</div></Cell>
                  </GridRow>
                  {/* Mobile card */}
                  <div className="md:hidden px-4 py-3.5 border-b border-slate-50 flex items-start gap-3">
                    <Avatar text={c.name} gradient={avatarGrad} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-extrabold text-slate-700 truncate">{c.name}</p>
                        <Badge tone={CAMPAIGN_STATUS_TONE[c.status] || "slate"}>{titleCase(c.status)}</Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-1"><ChannelBadge channel={c.channel} /><span className="text-xs text-slate-400 truncate">{c.audienceType === "ALL_CUSTOMERS" ? "All customers" : (c.segmentName || "—")}</span></div>
                      <p className="text-xs text-slate-400 mt-1.5">{sentTotal} sent · {whenStr}</p>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap justify-end flex-shrink-0 max-w-[96px]">{actions}</div>
                  </div>
                </div>
              );
            })}
        </div>
        {meta && <Pager page={meta.page} totalPages={meta.totalPages} total={meta.total} from={meta.from} to={meta.to} onPage={setPage} />}
      </Panel>

      {composing && <Composer campaign={composing.publicId ? composing : null} canSend={canSend} onClose={() => setComposing(null)} onSaved={() => { setComposing(null); fetchRows(); loadSummary(); }} />}
      {recipientsOf && <RecipientsModal campaign={recipientsOf} onClose={() => setRecipientsOf(null)} />}
      {testing && <TestSendModal title={`Test "${testing.name}"`} channel={testing.channel} onClose={() => setTesting(null)} onSend={(to) => marketingService.testCampaign(testing.publicId, to)} />}
    </Page>
  );
}

/* ── Broadcast composer ───────────────────────────────────────────────────────── */
function Composer({ campaign, canSend, onClose, onSaved }) {
  const [name, setName] = useState(campaign?.name || "");
  const [channel, setChannel] = useState(campaign?.channel || "WHATSAPP");
  const [audienceType, setAudienceType] = useState(campaign?.audienceType || "SEGMENT");
  const [segmentPublicId, setSegmentPublicId] = useState(campaign?.segmentPublicId || "");
  const [subject, setSubject] = useState(campaign?.subject || "");
  const [body, setBody] = useState(campaign?.body || "");
  const [templateName, setTemplateName] = useState(campaign?.templateName || "");
  const [scheduledAt, setScheduledAt] = useState(campaign?.scheduledAt || "");
  const [segments, setSegments] = useState([]);
  const [mergeTags, setMergeTags] = useState([]);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    marketingService.listSegments({ page: 0, size: 100 }).then((res) => setSegments(res.data?.data ?? [])).catch(() => {});
    marketingService.getMergeTags().then((res) => setMergeTags(res.data?.data ?? [])).catch(() => {});
  }, []);

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = "Campaign name is required.";
    if (audienceType === "SEGMENT" && !segmentPublicId) e.segment = "Choose a segment.";
    if (channel === "EMAIL" && !subject.trim()) e.subject = "Subject is required for email.";
    if (!body.trim()) e.body = "Message body is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const buildPayload = (withSchedule) => ({
    name: name.trim(), channel, audienceType,
    segmentPublicId: audienceType === "SEGMENT" ? segmentPublicId : null,
    subject: channel === "EMAIL" ? subject.trim() : null,
    body: body.trim(), templateName: channel === "WHATSAPP" ? (templateName.trim() || null) : null,
    scheduledAt: withSchedule && scheduledAt ? scheduledAt : null,
  });

  // action: 'draft' | 'schedule' | 'send'
  const submit = async (action) => {
    if (!validate()) return;
    if (action === "schedule" && !scheduledAt) { setErrors((e) => ({ ...e, scheduledAt: "Pick a date & time." })); return; }
    setBusy(true);
    try {
      const payload = buildPayload(action === "schedule");
      let saved;
      if (campaign) saved = (await marketingService.updateCampaign(campaign.publicId, payload)).data?.data;
      else saved = (await marketingService.createCampaign(payload)).data?.data;
      if (action === "send") {
        await marketingService.sendCampaign(saved.publicId);
        toast.success("Campaign is sending.");
      } else {
        toast.success(action === "schedule" ? "Campaign scheduled." : "Draft saved.");
      }
      onSaved();
    } catch (error) {
      if (!isAlreadyReported(error)) toast.error(getErrorMessage(error, "Couldn't save the campaign."));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal icon={Send} title={campaign ? "Edit Campaign" : "New Campaign"} subtitle="Broadcast to a segment or all customers" maxW="max-w-3xl" onClose={onClose}
      footer={<>
        <Btn variant="outline" onClick={onClose}>Cancel</Btn>
        <Btn variant="ghost" onClick={() => submit("draft")} disabled={busy}>Save draft</Btn>
        {canSend && scheduledAt && <Btn variant="indigo" onClick={() => submit("schedule")} disabled={busy}><Clock className="w-4 h-4" /> Schedule</Btn>}
        {canSend && !scheduledAt && <Btn onClick={() => submit("send")} disabled={busy}><Rocket className="w-4 h-4" /> {busy ? "Sending…" : "Send now"}</Btn>}
      </>}>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Campaign name" required error={errors.name} className="sm:col-span-2"><input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Diwali Mega Offer" /></Field>
      </div>

      {/* Audience */}
      <Field label="Audience" required error={errors.segment}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <button type="button" onClick={() => setAudienceType("SEGMENT")} className={`text-left px-4 py-3 rounded-xl border transition-all ${audienceType === "SEGMENT" ? "border-blue-400 bg-blue-50" : "border-slate-200 bg-white hover:border-blue-300"}`}>
            <p className="text-sm font-bold text-slate-700">A segment</p><p className="text-xs text-slate-400">Target a saved audience</p>
          </button>
          <button type="button" onClick={() => setAudienceType("ALL_CUSTOMERS")} className={`text-left px-4 py-3 rounded-xl border transition-all ${audienceType === "ALL_CUSTOMERS" ? "border-blue-400 bg-blue-50" : "border-slate-200 bg-white hover:border-blue-300"}`}>
            <p className="text-sm font-bold text-slate-700">All customers</p><p className="text-xs text-slate-400">Everyone in your CRM</p>
          </button>
        </div>
        {audienceType === "SEGMENT" && (
          <div className="mt-2.5">
            <Select value={segmentPublicId} onChange={(e) => setSegmentPublicId(e.target.value)}>
              <option value="">Select a segment…</option>
              {segments.map((s) => <option key={s.publicId} value={s.publicId}>{s.name} ({s.memberCount ?? 0})</option>)}
            </Select>
          </div>
        )}
      </Field>

      {/* Message */}
      <MessageComposer channel={channel} onChannel={setChannel} subject={subject} onSubject={setSubject}
        body={body} onBody={setBody} templateName={templateName} onTemplateName={setTemplateName} mergeTags={mergeTags} errors={errors} />

      {/* Schedule */}
      <Field label="Schedule (optional)" hint="Leave empty to send now / save as draft. Set a time to schedule.">
        <input type="datetime-local" className={inputCls + " sm:w-72"} value={scheduledAt ? scheduledAt.slice(0, 16) : ""} onChange={(e) => setScheduledAt(e.target.value ? e.target.value + ":00" : "")} />
        {errors.scheduledAt && <p className="mt-1 text-xs font-semibold text-red-500">{errors.scheduledAt}</p>}
      </Field>
    </Modal>
  );
}

/* ── Recipients modal ─────────────────────────────────────────────────────────── */
function RecipientsModal({ campaign, onClose }) {
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(0);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    marketingService.getCampaignRecipients(campaign.publicId, { page, size: SIZE, status })
      .then((res) => {
        if (!alive) return;
        const body = res.data;
        setRows(Array.isArray(body?.data) ? body.data : []);
        const pg = body?.pagination;
        setMeta(pg ? { page: pg.page, totalPages: pg.totalPages, total: pg.totalElements, from: pg.totalElements === 0 ? 0 : pg.page * pg.size + 1, to: Math.min((pg.page + 1) * pg.size, pg.totalElements) } : null);
      })
      .catch((e) => { if (!isAlreadyReported(e)) toast.error(getErrorMessage(e, "Couldn't load recipients.")); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [campaign.publicId, page, status]);

  return (
    <Modal icon={Users} title={campaign.name} subtitle={`${campaign.sentCount || 0} sent · ${campaign.totalRecipients || 0} total`} maxW="max-w-2xl" onClose={onClose}>
      <div className="flex justify-end">
        <div className="w-44"><Select value={status} onChange={(e) => { setPage(0); setStatus(e.target.value); }}>
          <option value="">All recipients</option><option value="SENT">Sent</option><option value="FAILED">Failed</option><option value="SKIPPED">Skipped</option><option value="PENDING">Pending</option>
        </Select></div>
      </div>
      <div className="overflow-x-auto -mx-2">
        <table className="w-full min-w-[480px]">
          <thead className={theadCls}><tr><Th>Customer</Th><Th>Destination</Th><Th>Status</Th></tr></thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? <SkeletonRows rows={5} cols={3} />
              : rows.length === 0 ? <EmptyRow colSpan={3} icon="📭" title="No recipients" hint="Recipients appear once the campaign is sent." />
              : rows.map((r) => (
                <tr key={r.publicId} className="hover:bg-slate-50">
                  <td className="px-3 py-3 text-sm font-bold text-slate-700">{r.customerName}</td>
                  <td className="px-3 py-3 text-sm text-slate-500 font-mono">{r.destination}</td>
                  <td className="px-3 py-3"><Badge tone={RECIPIENT_STATUS_TONE[r.status] || "slate"}>{titleCase(r.status)}</Badge>{r.error && <span className="block text-xs text-red-400 mt-0.5">{r.error}</span>}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {meta && <Pager page={meta.page} totalPages={meta.totalPages} total={meta.total} from={meta.from} to={meta.to} onPage={setPage} />}
    </Modal>
  );
}