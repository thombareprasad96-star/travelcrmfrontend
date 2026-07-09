import { useCallback, useEffect, useState } from "react";
import { X, Loader2, Plus, CheckCircle2, RotateCcw, Receipt } from "lucide-react";
import { billingService } from "../api/billingService";
import { planService } from "../api/planService";

const inputCls =
  "w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-heading placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-focus";

const money = (a, c) =>
  `${c || "INR"} ${Number(a ?? 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

function BillingStatusPill({ status, overdue }) {
  const map = {
    PAID: "bg-emerald-500/10 text-emerald-600 ring-emerald-500/20",
    UNPAID: "bg-amber-500/10 text-amber-600 ring-amber-500/20",
    VOID: "bg-slate-500/10 text-slate-500 ring-slate-500/20",
  };
  return (
    <span className="inline-flex items-center gap-1">
      <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase ring-1 ${map[status] || map.VOID}`}>
        {status}
      </span>
      {overdue && (
        <span className="rounded bg-red-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-red-600 ring-1 ring-red-500/20">
          overdue
        </span>
      )}
    </span>
  );
}

export default function BillingDrawer({ tenant, onClose, onChanged, showToast }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ amount: "", currency: "INR", dueDate: "", notes: "" });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setRecords((await billingService.listForTenant(tenant.publicId)) || []);
    } catch {
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }, [tenant.publicId]);

  useEffect(() => { load(); }, [load]);

  // Prefill the issue amount/currency from the tenant's current plan.
  useEffect(() => {
    planService.list()
      .then((plans) => {
        const p = (plans || []).find((x) => x.code === tenant.plan);
        if (p) setForm((f) => ({ ...f, amount: p.monthlyPrice ?? "", currency: p.currency || "INR" }));
      })
      .catch(() => {});
  }, [tenant.plan]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const issue = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await billingService.create(tenant.publicId, {
        amount: form.amount === "" ? null : Number(form.amount),
        currency: form.currency || null,
        dueDate: form.dueDate || null,
        notes: form.notes || null,
      });
      showToast("success", "Invoice issued");
      setShowForm(false);
      await load();
      onChanged?.();
    } catch (e2) {
      showToast("error", e2?.response?.data?.message || "Could not issue invoice");
    } finally {
      setSaving(false);
    }
  };

  const setPaid = async (r, paid) => {
    setBusyId(r.publicId);
    try {
      await (paid ? billingService.markPaid(r.publicId) : billingService.markUnpaid(r.publicId));
      showToast("success", paid ? "Marked paid" : "Marked unpaid");
      await load();
      onChanged?.();
    } catch {
      showToast("error", "Update failed");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-slate-950/50" onClick={onClose} />
      <div className="relative flex h-full w-full max-w-lg flex-col border-l border-border bg-surface shadow-xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-2">
            <Receipt size={18} className="text-accent" />
            <div>
              <h2 className="text-sm font-bold text-heading">Billing · {tenant.organizationName}</h2>
              <div className="font-mono text-xs text-muted">{tenant.plan}</div>
            </div>
          </div>
          <button onClick={onClose} className="text-muted hover:text-body"><X size={18} /></button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {!showForm && (
            <div className="mb-3 flex justify-end">
              <button onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-3 py-1.5 text-sm font-semibold text-accent-text hover:bg-accent-hover">
                <Plus size={15} /> Issue invoice
              </button>
            </div>
          )}

          {showForm && (
            <form onSubmit={issue} className="mb-4 space-y-3 rounded-xl border border-border bg-surface-hover p-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-body">Amount</label>
                  <input type="number" min={0} step="0.01" className={inputCls} value={form.amount}
                    onChange={(e) => set("amount", e.target.value)} placeholder="Plan default" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-body">Currency</label>
                  <input className={inputCls} value={form.currency} onChange={(e) => set("currency", e.target.value)} />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-body">
                  Due date <span className="font-normal text-muted">(blank = +15 days)</span>
                </label>
                <input type="date" className={inputCls} value={form.dueDate}
                  onChange={(e) => set("dueDate", e.target.value)} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-body">Notes</label>
                <input className={inputCls} value={form.notes}
                  onChange={(e) => set("notes", e.target.value)} placeholder="Optional" />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowForm(false)} disabled={saving}
                  className="rounded-lg border border-border-strong bg-surface px-3 py-1.5 text-sm font-semibold text-body hover:bg-surface-hover">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="inline-flex items-center gap-2 rounded-lg bg-accent px-3 py-1.5 text-sm font-semibold text-accent-text hover:bg-accent-hover disabled:opacity-60">
                  {saving && <Loader2 size={14} className="animate-spin" />} Issue
                </button>
              </div>
            </form>
          )}

          {loading ? (
            <div className="py-12 text-center text-muted"><Loader2 size={18} className="mx-auto animate-spin" /></div>
          ) : records.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted">No invoices yet.</div>
          ) : (
            <div className="space-y-2">
              {records.map((r) => (
                <div key={r.publicId} className="rounded-xl border border-border p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-sm font-semibold text-heading">{r.invoiceNumber}</span>
                        <BillingStatusPill status={r.status} overdue={r.overdue} />
                      </div>
                      <div className="mt-0.5 text-xs text-muted">
                        {r.periodStart} → {r.periodEnd} · due {r.dueDate || "—"}
                        {r.paidDate ? ` · paid ${r.paidDate}` : ""}
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="font-mono text-sm font-bold text-heading">{money(r.amount, r.currency)}</div>
                      <div className="mt-1">
                        {r.status === "PAID" ? (
                          <button onClick={() => setPaid(r, false)} disabled={busyId === r.publicId}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-muted hover:text-body disabled:opacity-60">
                            {busyId === r.publicId ? <Loader2 size={12} className="animate-spin" /> : <RotateCcw size={12} />} Mark unpaid
                          </button>
                        ) : r.status === "UNPAID" ? (
                          <button onClick={() => setPaid(r, true)} disabled={busyId === r.publicId}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 disabled:opacity-60">
                            {busyId === r.publicId ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={12} />} Mark paid
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  {r.notes && <div className="mt-2 border-t border-border pt-2 text-xs text-body">{r.notes}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}