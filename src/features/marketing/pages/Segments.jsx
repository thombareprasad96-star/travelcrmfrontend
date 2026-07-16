// src/features/marketing/pages/Segments.jsx
import { useCallback, useEffect, useState } from "react";
import { Users, Plus, Search, Pencil, Trash2, Eye, Filter, RefreshCw, UsersRound } from "lucide-react";
import { toast, useToast } from "@shared/ui/toast";
import { getErrorMessage, isAlreadyReported } from "@shared/api/apiError";
import { hasPermission, P } from "@shared/lib/access";
import marketingService from "../api/marketingService";
import { OPERATOR_LABELS } from "../constants";
import MarketingNav from "../components/MarketingNav";
import QueryBuilder from "../components/QueryBuilder";
import {
  Page, Hero, Panel, PanelHead, Badge, Btn, IconBtn, Th, theadCls, EmptyRow,
  SkeletonRows, Pager, Modal, Field, inputCls, KV,
  GridHead, GridRow, Cell, Avatar, GridSkeleton, GridEmpty,
} from "../components/marketingUi";

const SIZE = 10;
const SEG_COLS = "1.9fr 1.5fr 0.8fr 0.9fr 0.8fr 132px";

function conditionSummary(c, fields) {
  const label = fields.find((f) => f.field === c.field)?.label || c.field;
  const op = OPERATOR_LABELS[c.operator] || c.operator;
  let v = "";
  if (Array.isArray(c.value)) v = c.value.join(", ");
  else if (c.value != null) v = String(c.value);
  return `${label} ${op}${v ? " " + v : ""}`.trim();
}

export default function Segments() {
  const { showToast } = useToast();
  const canManage = hasPermission(P.MARKETING_CREATE) || hasPermission(P.MARKETING_UPDATE);

  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [fields, setFields] = useState([]);

  const [editing, setEditing] = useState(null);   // segment or {} for new
  const [membersOf, setMembersOf] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    marketingService.getSegmentFields().then((res) => setFields(res.data?.data ?? [])).catch(() => {});
  }, []);

  const fetchRows = useCallback(async () => {
    setLoading(true);
    try {
      const res = await marketingService.listSegments({ page, size: SIZE, sortBy: "updatedAt", sortDir: "desc", search });
      const body = res.data;
      setRows(Array.isArray(body?.data) ? body.data : []);
      const pg = body?.pagination;
      setMeta(pg ? {
        page: pg.page, totalPages: pg.totalPages, total: pg.totalElements,
        from: pg.totalElements === 0 ? 0 : pg.page * pg.size + 1,
        to: Math.min((pg.page + 1) * pg.size, pg.totalElements),
      } : null);
    } catch (error) {
      if (!isAlreadyReported(error)) showToast(getErrorMessage(error, "Couldn't load segments."), "error");
    } finally {
      setLoading(false);
    }
  }, [page, search, showToast]);

  useEffect(() => { fetchRows(); }, [fetchRows]);

  const handleDelete = async (seg) => {
    if (!window.confirm(`Delete segment "${seg.name}"? Campaigns already sent are unaffected.`)) return;
    setDeletingId(seg.publicId);
    try {
      await marketingService.deleteSegment(seg.publicId);
      toast.success("Segment deleted.");
      fetchRows();
    } catch (error) {
      if (!isAlreadyReported(error)) toast.error(getErrorMessage(error, "Couldn't delete the segment."));
    } finally {
      setDeletingId(null);
    }
  };

  const reachable = rows.reduce((n, s) => Math.max(n, s.memberCount || 0), 0);

  return (
    <Page icon={Users} title="Customer Segments" crumb="Segments"
      actions={canManage && <Btn onClick={() => setEditing({})}><Plus className="w-4 h-4" /> New Segment</Btn>}>

      <MarketingNav active="segments" />

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <Hero label="Segments" value={meta?.total ?? rows.length} icon={<Filter className="w-5 h-5" />} />
        <Hero label="Largest audience" value={reachable} sub="members in a single segment" gradient="from-blue-600 to-indigo-600" icon={<UsersRound className="w-5 h-5" />} delay={80} />
        <Hero label="Reusable in campaigns" value={meta?.total ?? rows.length} sub="target segments in a broadcast or drip" gradient="from-gold-400 to-gold-600" icon={<Users className="w-5 h-5" />} delay={160} />
      </div>

      <Panel>
        <PanelHead icon={Users} title="All Segments" count={meta?.total ?? rows.length} right={
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input className={inputCls + " pl-9 w-full sm:w-64"} placeholder="Search segments…"
              value={search} onChange={(e) => { setPage(0); setSearch(e.target.value); }} />
          </div>
        } />

        <GridHead cols={SEG_COLS}>
          <Cell first>Segment</Cell><Cell>Rules</Cell><Cell right>Members</Cell><Cell>Owner</Cell><Cell>Updated</Cell><Cell right>Actions</Cell>
        </GridHead>

        <div>
          {loading ? <GridSkeleton cols={SEG_COLS} rows={5} />
            : rows.length === 0 ? <GridEmpty icon={Filter} title="No segments yet" hint="Create a segment to target customers by tier, city, channel and more." />
            : rows.map((s, i) => {
              const actions = (
                <>
                  <IconBtn tone="blue" title="View members" onClick={() => setMembersOf(s)}><Eye className="w-4 h-4" /></IconBtn>
                  {hasPermission(P.MARKETING_UPDATE) && <IconBtn tone="indigo" title="Edit" onClick={() => setEditing(s)}><Pencil className="w-4 h-4" /></IconBtn>}
                  {hasPermission(P.MARKETING_DELETE) && <IconBtn tone="red" title="Delete" disabled={deletingId === s.publicId} onClick={() => handleDelete(s)}>{deletingId === s.publicId ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}</IconBtn>}
                </>
              );
              const ruleBadges = (s.conditions || []).length === 0
                ? <Badge tone="slate">All customers</Badge>
                : (s.conditions || []).slice(0, 2).map((c, idx) => <Badge key={idx} tone="indigo">{conditionSummary(c, fields)}</Badge>);
              return (
                <div key={s.publicId}>
                  {/* Desktop grid row */}
                  <GridRow cols={SEG_COLS} index={i}>
                    <Cell first>
                      <Avatar text={s.name} gradient="from-blue-500 to-indigo-600" />
                      <div className="ml-3 min-w-0">
                        <p className="text-sm font-extrabold text-slate-700 truncate">{s.name}</p>
                        {s.description && <p className="text-xs text-slate-400 truncate max-w-[240px]">{s.description}</p>}
                      </div>
                    </Cell>
                    <Cell>
                      <div className="flex flex-wrap gap-1 justify-center max-w-full">
                        {ruleBadges}
                        {(s.conditions || []).length > 2 && <Badge tone="slate">+{s.conditions.length - 2}</Badge>}
                      </div>
                    </Cell>
                    <Cell right><span className="text-sm font-extrabold text-slate-700">{(s.memberCount ?? 0).toLocaleString("en-IN")}</span></Cell>
                    <Cell><span className="text-sm text-slate-500 truncate">{s.ownerName || "—"}</span></Cell>
                    <Cell><span className="text-sm text-slate-500">{(s.updatedAt || "").slice(0, 10)}</span></Cell>
                    <Cell right><div className="flex items-center justify-end gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">{actions}</div></Cell>
                  </GridRow>
                  {/* Mobile card */}
                  <div className="md:hidden px-4 py-3.5 border-b border-slate-50 flex items-start gap-3">
                    <Avatar text={s.name} gradient="from-blue-500 to-indigo-600" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-extrabold text-slate-700 truncate">{s.name}</p>
                      {s.description && <p className="text-xs text-slate-400 truncate">{s.description}</p>}
                      <div className="flex flex-wrap gap-1 mt-1.5">{ruleBadges}</div>
                      <p className="text-xs text-slate-400 mt-1.5">{(s.memberCount ?? 0).toLocaleString("en-IN")} members · {s.ownerName || "—"}</p>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">{actions}</div>
                  </div>
                </div>
              );
            })}
        </div>
        {meta && <Pager page={meta.page} totalPages={meta.totalPages} total={meta.total} from={meta.from} to={meta.to} onPage={setPage} />}
      </Panel>

      {editing && <SegmentBuilder fields={fields} segment={editing.publicId ? editing : null} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); fetchRows(); }} />}
      {membersOf && <MembersModal segment={membersOf} onClose={() => setMembersOf(null)} />}
    </Page>
  );
}

/* ── Segment create/edit modal with live preview ──────────────────────────────── */
function SegmentBuilder({ fields, segment, onClose, onSaved }) {
  const [name, setName] = useState(segment?.name || "");
  const [description, setDescription] = useState(segment?.description || "");
  const [rule, setRule] = useState({ matchType: segment?.matchType || "ALL", conditions: segment?.conditions || [] });
  const [preview, setPreview] = useState(null);
  const [previewing, setPreviewing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  // Debounced live preview whenever the rule changes.
  useEffect(() => {
    let alive = true;
    setPreviewing(true);
    const t = setTimeout(async () => {
      try {
        const res = await marketingService.previewSegment({ matchType: rule.matchType, conditions: rule.conditions });
        if (alive) setPreview(res.data?.data ?? null);
      } catch { if (alive) setPreview(null); }
      finally { if (alive) setPreviewing(false); }
    }, 350);
    return () => { alive = false; clearTimeout(t); };
  }, [rule]);

  const save = async () => {
    if (!name.trim()) { setErr("Segment name is required."); return; }
    setErr(""); setSaving(true);
    const payload = { name: name.trim(), description: description.trim() || null, matchType: rule.matchType, conditions: rule.conditions };
    try {
      if (segment) await marketingService.updateSegment(segment.publicId, payload);
      else await marketingService.createSegment(payload);
      toast.success(segment ? "Segment updated." : "Segment created.");
      onSaved();
    } catch (error) {
      if (!isAlreadyReported(error)) toast.error(getErrorMessage(error, "Couldn't save the segment."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal icon={Filter} title={segment ? "Edit Segment" : "New Segment"} subtitle="Target customers by their profile" maxW="max-w-3xl" onClose={onClose}
      footer={<>
        <Btn variant="outline" onClick={onClose}>Cancel</Btn>
        <Btn onClick={save} disabled={saving}>{saving ? "Saving…" : segment ? "Save changes" : "Create segment"}</Btn>
      </>}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Name" required error={err}><input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. High-value Gold+" /></Field>
        <Field label="Description"><input className={inputCls} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional" /></Field>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4">
        <QueryBuilder fields={fields} matchType={rule.matchType} conditions={rule.conditions} onChange={setRule} />
      </div>

      {/* Live preview */}
      <div className="rounded-2xl border border-gold-200 bg-gold-50/60 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-extrabold uppercase tracking-wide text-gold-700 flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" /> Matching audience</span>
          <span className="text-lg font-extrabold text-gold-700">{previewing ? "…" : (preview?.totalCount ?? 0).toLocaleString("en-IN")}<span className="text-xs font-bold text-gold-600/70 ml-1">customers</span></span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(preview?.sample || []).slice(0, 8).map((c) => <Badge key={c.publicId} tone="slate">{c.name}</Badge>)}
          {(preview?.totalCount || 0) > 8 && <Badge tone="slate">+{preview.totalCount - 8} more</Badge>}
          {!previewing && (preview?.totalCount || 0) === 0 && <span className="text-sm text-slate-400">No customers match these conditions.</span>}
        </div>
      </div>
    </Modal>
  );
}

/* ── Members list modal ───────────────────────────────────────────────────────── */
function MembersModal({ segment, onClose }) {
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    marketingService.getSegmentMembers(segment.publicId, { page, size: SIZE })
      .then((res) => {
        if (!alive) return;
        const body = res.data;
        setRows(Array.isArray(body?.data) ? body.data : []);
        const pg = body?.pagination;
        setMeta(pg ? { page: pg.page, totalPages: pg.totalPages, total: pg.totalElements, from: pg.totalElements === 0 ? 0 : pg.page * pg.size + 1, to: Math.min((pg.page + 1) * pg.size, pg.totalElements) } : null);
      })
      .catch((e) => { if (!isAlreadyReported(e)) toast.error(getErrorMessage(e, "Couldn't load members.")); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [segment.publicId, page]);

  return (
    <Modal icon={UsersRound} title={segment.name} subtitle={`${(segment.memberCount ?? 0).toLocaleString("en-IN")} members`} maxW="max-w-2xl" onClose={onClose}>
      <div className="overflow-x-auto -mx-2">
        <table className="w-full min-w-[520px]">
          <thead className={theadCls}>
            <tr><Th>Name</Th><Th>Contact</Th><Th>City</Th><Th>Tier</Th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? <SkeletonRows rows={5} cols={4} />
              : rows.length === 0 ? <EmptyRow colSpan={4} icon="👥" title="No members" />
              : rows.map((m) => (
                <tr key={m.publicId} className="hover:bg-slate-50">
                  <td className="px-3 py-3 text-sm font-bold text-slate-700">{m.name}</td>
                  <td className="px-3 py-3 text-sm text-slate-500">{m.email || m.phone || "—"}</td>
                  <td className="px-3 py-3 text-sm text-slate-500">{m.city || "—"}</td>
                  <td className="px-3 py-3"><Badge tone="amber">{m.loyaltyTier}</Badge></td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {meta && <Pager page={meta.page} totalPages={meta.totalPages} total={meta.total} from={meta.from} to={meta.to} onPage={setPage} />}
    </Modal>
  );
}