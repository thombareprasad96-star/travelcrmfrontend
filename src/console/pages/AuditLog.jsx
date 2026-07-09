import { useCallback, useEffect, useState } from "react";
import {
  Search, Loader2, ChevronLeft, ChevronRight, ScrollText, CheckCircle2, XCircle, RotateCcw,
} from "lucide-react";
import { auditService } from "../api/auditService";

const inputCls =
  "rounded-lg border border-border bg-surface px-3 py-2 text-sm text-heading placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-focus";

// Actions that change security posture or are destructive — chipped amber so they stand out.
const SENSITIVE = new Set([
  "LOGIN_FAILED", "TENANT_SUSPEND", "TENANT_SOFT_DELETE", "TENANT_HARD_DELETE",
  "USER_LOCK", "USER_FORCE_RESET", "IMPERSONATION_START", "IMPERSONATION_END",
  "MAINTENANCE_TOGGLE", "DATA_EXPORT",
]);

function ActionChip({ action, success }) {
  const cls = !success
    ? "bg-red-500/10 text-red-600 dark:text-red-400"
    : SENSITIVE.has(action)
      ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
      : "bg-surface-hover text-body";
  return <span className={`inline-block rounded px-2 py-0.5 font-mono text-[11px] font-semibold ${cls}`}>{action}</span>;
}

const fmt = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return isNaN(d) ? iso : d.toLocaleString(undefined, {
    year: "numeric", month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit",
  });
};

export default function AuditLog() {
  const [rows, setRows] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actions, setActions] = useState([]);
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState({ action: "", success: "", from: "", to: "" });
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");

  useEffect(() => {
    auditService.actions().then((a) => setActions(Array.isArray(a) ? a : [])).catch(() => {});
  }, []);

  useEffect(() => {
    const t = setTimeout(() => { setDebounced(search); setPage(0); }, 350);
    return () => clearTimeout(t);
  }, [search]);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { rows, pagination } = await auditService.list({
        ...filters, q: debounced, page, size: 25,
      });
      setRows(rows);
      setPagination(pagination);
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to load audit logs.");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [filters, debounced, page]);

  useEffect(() => { load(); }, [load]);

  const setFilter = (k, v) => { setFilters((f) => ({ ...f, [k]: v })); setPage(0); };
  const reset = () => {
    setFilters({ action: "", success: "", from: "", to: "" });
    setSearch("");
    setPage(0);
  };

  const totalPages = pagination.totalPages ?? 1;
  const hasFilters = filters.action || filters.success !== "" || filters.from || filters.to || search;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-heading">Audit Log</h1>
        <p className="text-sm text-body">Every platform action — logins, tenant lifecycle, plan/billing, impersonation, locks, config.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[200px] flex-1">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search actor / tenant / description…" className={`${inputCls} w-full pl-9`} />
        </div>
        <select value={filters.action} onChange={(e) => setFilter("action", e.target.value)} className={inputCls}>
          <option value="">All actions</option>
          {actions.map((a) => <option key={a} value={a}>{a}</option>)}
        </select>
        <select value={filters.success} onChange={(e) => setFilter("success", e.target.value)} className={inputCls}>
          <option value="">Any result</option>
          <option value="true">Success</option>
          <option value="false">Failed</option>
        </select>
        <input type="date" value={filters.from} onChange={(e) => setFilter("from", e.target.value)} className={inputCls} title="From" />
        <input type="date" value={filters.to} onChange={(e) => setFilter("to", e.target.value)} className={inputCls} title="To" />
        {hasFilters && (
          <button onClick={reset} className="inline-flex items-center gap-1.5 rounded-lg border border-border-strong bg-surface px-3 py-2 text-sm font-semibold text-muted hover:bg-surface-hover hover:text-body">
            <RotateCcw size={14} /> Clear
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="border-b border-border bg-surface-hover text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">Time</th>
                <th className="px-4 py-3 font-semibold">Actor</th>
                <th className="px-4 py-3 font-semibold">Action</th>
                <th className="px-4 py-3 font-semibold">Target</th>
                <th className="px-4 py-3 font-semibold">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr><td colSpan={5} className="px-4 py-12 text-center text-muted"><Loader2 size={18} className="mx-auto animate-spin" /></td></tr>
              ) : error ? (
                <tr><td colSpan={5} className="px-4 py-12 text-center text-red-500">{error}</td></tr>
              ) : rows.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-12 text-center text-muted">
                  <ScrollText size={28} className="mx-auto mb-2 opacity-50" /> No audit entries match.
                </td></tr>
              ) : (
                rows.map((r) => (
                  <tr key={r.publicId} className="align-top hover:bg-surface-hover/60">
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-muted">{fmt(r.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="text-xs font-medium text-heading">{r.actorEmail || "—"}</div>
                      {r.ipAddress && <div className="font-mono text-[11px] text-muted">{r.ipAddress}</div>}
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1.5">
                        {r.success
                          ? <CheckCircle2 size={13} className="shrink-0 text-emerald-500" />
                          : <XCircle size={13} className="shrink-0 text-red-500" />}
                        <ActionChip action={r.action} success={r.success} />
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {r.targetTenantCode
                        ? <span className="font-mono font-semibold text-body">{r.targetTenantCode}</span>
                        : <span className="text-muted">platform</span>}
                      {r.targetType && <span className="ml-1 text-muted">· {r.targetType}</span>}
                    </td>
                    <td className="max-w-[360px] px-4 py-3 text-xs text-body">{r.description || "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-border px-4 py-3 text-sm">
          <span className="text-muted">
            {pagination.totalElements ?? 0} entries · page {page + 1} of {totalPages}
          </span>
          <div className="flex gap-1">
            <button disabled={page <= 0} onClick={() => setPage((p) => Math.max(0, p - 1))}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border-strong text-body hover:bg-surface-hover disabled:opacity-40">
              <ChevronLeft size={16} />
            </button>
            <button disabled={page + 1 >= totalPages} onClick={() => setPage((p) => p + 1)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border-strong text-body hover:bg-surface-hover disabled:opacity-40">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}