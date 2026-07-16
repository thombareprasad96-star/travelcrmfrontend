// src/features/marketing/pages/DripSequences.jsx
import { useCallback, useEffect, useState } from "react";
import { Workflow, Plus, Search, Pencil, Trash2, Eye, RefreshCw, Play, Pause, Clock, Users, GripVertical } from "lucide-react";
import { toast, useToast } from "@shared/ui/toast";
import { getErrorMessage, isAlreadyReported } from "@shared/api/apiError";
import { hasPermission, P } from "@shared/lib/access";
import marketingService from "../api/marketingService";
import { DRIP_STATUS_OPTIONS } from "../constants";
import MarketingNav from "../components/MarketingNav";
import MessageComposer from "../components/MessageComposer";
import {
  Page, Hero, Panel, PanelHead, Badge, ChannelBadge, Btn, IconBtn, Th, theadCls, EmptyRow,
  SkeletonRows, Pager, Modal, Field, inputCls, Select, DRIP_STATUS_TONE, ENROLLMENT_STATUS_TONE, titleCase,
  GridHead, GridRow, Cell, Avatar, GridSkeleton, GridEmpty,
} from "../components/marketingUi";

const SIZE = 10;
const DRIP_COLS = "1.9fr 0.9fr 1.1fr 0.7fr 1fr 168px";
const emptyStep = () => ({ name: "", delayDays: 0, channel: "WHATSAPP", subject: "", body: "", templateName: "" });

export default function DripSequences() {
  const { showToast } = useToast();
  const canCreate = hasPermission(P.MARKETING_CREATE);
  const canSend = hasPermission(P.MARKETING_SEND);

  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  const [editing, setEditing] = useState(null);
  const [enrollmentsOf, setEnrollmentsOf] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const fetchRows = useCallback(async () => {
    setLoading(true);
    try {
      const res = await marketingService.listDrips({ page, size: SIZE, sortBy: "updatedAt", sortDir: "desc", search, status });
      const body = res.data;
      setRows(Array.isArray(body?.data) ? body.data : []);
      const pg = body?.pagination;
      setMeta(pg ? { page: pg.page, totalPages: pg.totalPages, total: pg.totalElements, from: pg.totalElements === 0 ? 0 : pg.page * pg.size + 1, to: Math.min((pg.page + 1) * pg.size, pg.totalElements) } : null);
    } catch (error) {
      if (!isAlreadyReported(error)) showToast(getErrorMessage(error, "Couldn't load sequences."), "error");
    } finally {
      setLoading(false);
    }
  }, [page, search, status, showToast]);

  useEffect(() => { fetchRows(); }, [fetchRows]);

  const act = async (fn, id, okMsg) => {
    setBusyId(id);
    try { await fn(); toast.success(okMsg); fetchRows(); }
    catch (error) { if (!isAlreadyReported(error)) toast.error(getErrorMessage(error, "Action failed.")); }
    finally { setBusyId(null); }
  };
  const activate = (d) => act(() => marketingService.activateDrip(d.publicId), d.publicId, "Sequence activated — enrolling matching customers.");
  const pause = (d) => act(() => marketingService.pauseDrip(d.publicId), d.publicId, "Sequence paused.");
  const remove = (d) => { if (window.confirm(`Delete "${d.name}"? Active enrollments will stop.`)) act(() => marketingService.deleteDrip(d.publicId), d.publicId, "Sequence deleted."); };

  return (
    <Page icon={Workflow} title="Drip Sequences" crumb="Drip Sequences"
      actions={canCreate && <Btn onClick={() => setEditing({})}><Plus className="w-4 h-4" /> New Sequence</Btn>}>

      <MarketingNav active="drips" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Hero label="Sequences" value={meta?.total ?? rows.length} icon={<Workflow className="w-5 h-5" />} />
        <Hero label="Active" value={rows.filter((d) => d.status === "ACTIVE").length} gradient="from-emerald-500 to-green-600" icon={<Play className="w-5 h-5" />} delay={80} />
        <Hero label="Enrolled (page)" value={rows.reduce((n, d) => n + (d.activeCount || 0), 0)} sub="currently in a sequence" gradient="from-blue-600 to-indigo-600" icon={<Users className="w-5 h-5" />} delay={160} />
        <Hero label="Completed (page)" value={rows.reduce((n, d) => n + (d.completedCount || 0), 0)} gradient="from-gold-400 to-gold-600" icon={<Clock className="w-5 h-5" />} delay={240} />
      </div>

      <Panel>
        <PanelHead icon={Workflow} title="All Sequences" count={meta?.total ?? rows.length} right={
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input className={inputCls + " pl-9 w-full sm:w-52"} placeholder="Search…" value={search} onChange={(e) => { setPage(0); setSearch(e.target.value); }} />
            </div>
            <div className="w-40"><Select value={status} onChange={(e) => { setPage(0); setStatus(e.target.value); }}>{DRIP_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</Select></div>
          </div>
        } />

        <GridHead cols={DRIP_COLS}>
          <Cell first>Sequence</Cell><Cell>Status</Cell><Cell>Audience</Cell><Cell right>Steps</Cell><Cell right>Active / Enrolled</Cell><Cell right>Actions</Cell>
        </GridHead>

        <div>
          {loading ? <GridSkeleton cols={DRIP_COLS} rows={5} />
            : rows.length === 0 ? <GridEmpty icon={Workflow} title="No drip sequences yet" hint="Build an automated multi-step journey triggered by segment membership." />
            : rows.map((d, i) => {
              const busy = busyId === d.publicId;
              const audience = d.audienceType === "SEGMENT" ? (d.segmentName || "—") : "Manual";
              const actions = (
                <>
                  <IconBtn tone="blue" title="Enrollments" onClick={() => setEnrollmentsOf(d)}><Eye className="w-4 h-4" /></IconBtn>
                  {d.status !== "ACTIVE" && hasPermission(P.MARKETING_UPDATE) && <IconBtn tone="indigo" title="Edit" onClick={() => setEditing(d)}><Pencil className="w-4 h-4" /></IconBtn>}
                  {d.status !== "ACTIVE" && canSend && <IconBtn tone="emerald" title="Activate" disabled={busy} onClick={() => activate(d)}>{busy ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}</IconBtn>}
                  {d.status === "ACTIVE" && canSend && <IconBtn tone="amber" title="Pause" disabled={busy} onClick={() => pause(d)}>{busy ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Pause className="w-4 h-4" />}</IconBtn>}
                  {hasPermission(P.MARKETING_DELETE) && <IconBtn tone="red" title="Delete" disabled={busy} onClick={() => remove(d)}><Trash2 className="w-4 h-4" /></IconBtn>}
                </>
              );
              return (
                <div key={d.publicId}>
                  {/* Desktop grid row */}
                  <GridRow cols={DRIP_COLS} index={i}>
                    <Cell first>
                      <Avatar text={d.name} gradient="from-blue-500 to-indigo-600" />
                      <div className="ml-3 min-w-0">
                        <p className="text-sm font-extrabold text-slate-700 truncate">{d.name}</p>
                        {d.description && <p className="text-xs text-slate-400 truncate max-w-[240px]">{d.description}</p>}
                      </div>
                    </Cell>
                    <Cell><Badge tone={DRIP_STATUS_TONE[d.status] || "slate"}>{titleCase(d.status)}</Badge></Cell>
                    <Cell>{d.audienceType === "SEGMENT" ? <span className="text-sm text-slate-500 truncate">{d.segmentName || "—"}</span> : <Badge tone="slate">Manual</Badge>}</Cell>
                    <Cell right><span className="text-sm font-bold text-slate-600">{(d.steps || []).length}</span></Cell>
                    <Cell right><span className="text-sm font-bold text-slate-600">{d.activeCount || 0} / {d.enrolledCount || 0}</span></Cell>
                    <Cell right><div className="flex items-center justify-end gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">{actions}</div></Cell>
                  </GridRow>
                  {/* Mobile card */}
                  <div className="md:hidden px-4 py-3.5 border-b border-slate-50 flex items-start gap-3">
                    <Avatar text={d.name} gradient="from-blue-500 to-indigo-600" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-extrabold text-slate-700 truncate">{d.name}</p>
                        <Badge tone={DRIP_STATUS_TONE[d.status] || "slate"}>{titleCase(d.status)}</Badge>
                      </div>
                      {d.description && <p className="text-xs text-slate-400 truncate mt-0.5">{d.description}</p>}
                      <p className="text-xs text-slate-400 mt-1.5">{audience} · {(d.steps || []).length} steps · {d.activeCount || 0}/{d.enrolledCount || 0} active</p>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">{actions}</div>
                  </div>
                </div>
              );
            })}
        </div>
        {meta && <Pager page={meta.page} totalPages={meta.totalPages} total={meta.total} from={meta.from} to={meta.to} onPage={setPage} />}
      </Panel>

      {editing && <DripBuilder drip={editing.publicId ? editing : null} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); fetchRows(); }} />}
      {enrollmentsOf && <EnrollmentsModal drip={enrollmentsOf} onClose={() => setEnrollmentsOf(null)} />}
    </Page>
  );
}

/* ── Drip builder (multi-step) ────────────────────────────────────────────────── */
function DripBuilder({ drip, onClose, onSaved }) {
  const [name, setName] = useState(drip?.name || "");
  const [description, setDescription] = useState(drip?.description || "");
  const [audienceType, setAudienceType] = useState(drip?.audienceType || "SEGMENT");
  const [segmentPublicId, setSegmentPublicId] = useState(drip?.segmentPublicId || "");
  const [steps, setSteps] = useState(drip?.steps?.length ? drip.steps.map((s) => ({ ...s, subject: s.subject || "", templateName: s.templateName || "" })) : [emptyStep()]);
  const [segments, setSegments] = useState([]);
  const [mergeTags, setMergeTags] = useState([]);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    marketingService.listSegments({ page: 0, size: 100 }).then((res) => setSegments(res.data?.data ?? [])).catch(() => {});
    marketingService.getMergeTags().then((res) => setMergeTags(res.data?.data ?? [])).catch(() => {});
  }, []);

  const patchStep = (i, patch) => setSteps((prev) => prev.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  const addStep = () => setSteps((prev) => [...prev, emptyStep()]);
  const removeStep = (i) => setSteps((prev) => prev.filter((_, idx) => idx !== i));
  const move = (i, dir) => setSteps((prev) => {
    const j = i + dir;
    if (j < 0 || j >= prev.length) return prev;
    const next = [...prev];
    [next[i], next[j]] = [next[j], next[i]];
    return next;
  });

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = "Sequence name is required.";
    if (audienceType === "SEGMENT" && !segmentPublicId) e.segment = "Choose a segment to enroll from.";
    if (steps.length === 0) e.steps = "Add at least one step.";
    steps.forEach((s, i) => {
      if (!s.body.trim()) e[`step_${i}_body`] = "Message body is required.";
      if (s.channel === "EMAIL" && !String(s.subject || "").trim()) e[`step_${i}_subject`] = "Subject is required for email.";
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const save = async () => {
    if (!validate()) return;
    setBusy(true);
    const payload = {
      name: name.trim(), description: description.trim() || null, audienceType,
      segmentPublicId: audienceType === "SEGMENT" ? segmentPublicId : null,
      steps: steps.map((s, i) => ({
        stepOrder: i + 1, name: s.name?.trim() || null, delayDays: Number(s.delayDays) || 0, channel: s.channel,
        subject: s.channel === "EMAIL" ? (s.subject || "").trim() : null, body: s.body.trim(),
        templateName: s.channel === "WHATSAPP" ? ((s.templateName || "").trim() || null) : null,
      })),
    };
    try {
      if (drip) await marketingService.updateDrip(drip.publicId, payload);
      else await marketingService.createDrip(payload);
      toast.success(drip ? "Sequence updated." : "Sequence created (draft). Activate it to start enrolling.");
      onSaved();
    } catch (error) {
      if (!isAlreadyReported(error)) toast.error(getErrorMessage(error, "Couldn't save the sequence."));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal icon={Workflow} title={drip ? "Edit Sequence" : "New Drip Sequence"} subtitle="Automated multi-step journey" maxW="max-w-3xl" onClose={onClose}
      footer={<>
        <Btn variant="outline" onClick={onClose}>Cancel</Btn>
        <Btn onClick={save} disabled={busy}>{busy ? "Saving…" : drip ? "Save changes" : "Create sequence"}</Btn>
      </>}>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Name" required error={errors.name}><input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Post-booking nurture" /></Field>
        <Field label="Description"><input className={inputCls} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional" /></Field>
      </div>

      <Field label="Enroll from" required error={errors.segment}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <button type="button" onClick={() => setAudienceType("SEGMENT")} className={`text-left px-4 py-3 rounded-xl border transition-all ${audienceType === "SEGMENT" ? "border-blue-400 bg-blue-50" : "border-slate-200 bg-white hover:border-blue-300"}`}>
            <p className="text-sm font-bold text-slate-700">A segment</p><p className="text-xs text-slate-400">Auto-enroll matching customers</p>
          </button>
          <button type="button" onClick={() => setAudienceType("MANUAL")} className={`text-left px-4 py-3 rounded-xl border transition-all ${audienceType === "MANUAL" ? "border-blue-400 bg-blue-50" : "border-slate-200 bg-white hover:border-blue-300"}`}>
            <p className="text-sm font-bold text-slate-700">Manual</p><p className="text-xs text-slate-400">Enroll customers yourself</p>
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

      {/* Steps */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wide">Steps</span>
          {errors.steps && <span className="text-xs font-semibold text-red-500">{errors.steps}</span>}
        </div>
        <div className="space-y-3">
          {steps.map((s, i) => (
            <div key={i} className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-500 text-white flex items-center justify-center text-xs font-extrabold">{i + 1}</div>
                  <input className={inputCls + " !py-1.5 w-44"} value={s.name} onChange={(e) => patchStep(i, { name: e.target.value })} placeholder={`Step ${i + 1} name`} />
                </div>
                <div className="flex items-center gap-1">
                  <IconBtn tone="slate" title="Move up" disabled={i === 0} onClick={() => move(i, -1)}><GripVertical className="w-4 h-4 rotate-180" /></IconBtn>
                  <IconBtn tone="slate" title="Move down" disabled={i === steps.length - 1} onClick={() => move(i, 1)}><GripVertical className="w-4 h-4" /></IconBtn>
                  <IconBtn tone="red" title="Remove step" disabled={steps.length === 1} onClick={() => removeStep(i)}><Trash2 className="w-4 h-4" /></IconBtn>
                </div>
              </div>

              <Field label={i === 0 ? "Send this immediately after enrollment, or wait…" : "Wait after the previous step"} className="mb-3">
                <div className="flex items-center gap-2">
                  <input type="number" min="0" className={inputCls + " w-24"} value={s.delayDays} onChange={(e) => patchStep(i, { delayDays: e.target.value })} />
                  <span className="text-sm text-slate-500 font-medium">day(s)</span>
                </div>
              </Field>

              <MessageComposer channel={s.channel} onChannel={(v) => patchStep(i, { channel: v })}
                subject={s.subject} onSubject={(v) => patchStep(i, { subject: v })}
                body={s.body} onBody={(v) => patchStep(i, { body: v })}
                templateName={s.templateName} onTemplateName={(v) => patchStep(i, { templateName: v })}
                mergeTags={mergeTags}
                errors={{ subject: errors[`step_${i}_subject`], body: errors[`step_${i}_body`] }} />
            </div>
          ))}
        </div>
        <div className="mt-3"><Btn variant="outline" size="sm" onClick={addStep}><Plus className="w-4 h-4" /> Add step</Btn></div>
      </div>
    </Modal>
  );
}

/* ── Enrollments modal ────────────────────────────────────────────────────────── */
function EnrollmentsModal({ drip, onClose }) {
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(0);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    marketingService.getDripEnrollments(drip.publicId, { page, size: SIZE, status })
      .then((res) => {
        if (!alive) return;
        const body = res.data;
        setRows(Array.isArray(body?.data) ? body.data : []);
        const pg = body?.pagination;
        setMeta(pg ? { page: pg.page, totalPages: pg.totalPages, total: pg.totalElements, from: pg.totalElements === 0 ? 0 : pg.page * pg.size + 1, to: Math.min((pg.page + 1) * pg.size, pg.totalElements) } : null);
      })
      .catch((e) => { if (!isAlreadyReported(e)) toast.error(getErrorMessage(e, "Couldn't load enrollments.")); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [drip.publicId, page, status]);

  return (
    <Modal icon={Users} title={drip.name} subtitle={`${drip.activeCount || 0} active · ${drip.enrolledCount || 0} enrolled`} maxW="max-w-2xl" onClose={onClose}>
      <div className="flex justify-end">
        <div className="w-44"><Select value={status} onChange={(e) => { setPage(0); setStatus(e.target.value); }}>
          <option value="">All enrollments</option><option value="ACTIVE">Active</option><option value="COMPLETED">Completed</option><option value="CANCELLED">Cancelled</option>
        </Select></div>
      </div>
      <div className="overflow-x-auto -mx-2">
        <table className="w-full min-w-[520px]">
          <thead className={theadCls}><tr><Th>Customer</Th><Th right>Step</Th><Th>Next run</Th><Th>Status</Th></tr></thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? <SkeletonRows rows={5} cols={4} />
              : rows.length === 0 ? <EmptyRow colSpan={4} icon="🚶" title="No enrollments yet" hint="Customers appear here once the sequence is active." />
              : rows.map((e) => (
                <tr key={e.publicId} className="hover:bg-slate-50">
                  <td className="px-3 py-3 text-sm font-bold text-slate-700">{e.customerName}</td>
                  <td className="px-3 py-3 text-right text-sm text-slate-500">{e.currentStep} / {(drip.steps || []).length}</td>
                  <td className="px-3 py-3 text-sm text-slate-500">{e.nextRunAt ? e.nextRunAt.slice(0, 10) : "—"}</td>
                  <td className="px-3 py-3"><Badge tone={ENROLLMENT_STATUS_TONE[e.status] || "slate"}>{titleCase(e.status)}</Badge></td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {meta && <Pager page={meta.page} totalPages={meta.totalPages} total={meta.total} from={meta.from} to={meta.to} onPage={setPage} />}
    </Modal>
  );
}