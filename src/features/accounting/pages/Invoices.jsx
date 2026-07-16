import { useCallback, useEffect, useState } from "react";
import { FileText, Plus, Eye, Ban, QrCode, RefreshCw } from "lucide-react";
import { useToast } from "@shared/ui/toast";
import { isAlreadyReported, getErrorMessage } from "@shared/api/apiError";
import { openBlob, hydrateBlobError } from "@shared/lib/download";
import { hasPermission, P } from "@shared/lib/access";
import bookingService from "@features/bookings/api/bookingService";
import {
  Page, Panel, PanelHead, Badge, Btn, IconBtn, Modal, Field, Select, Pager,
  theadCls, Th, EmptyRow, SkeletonRows, inputCls,
} from "../components/accountingUi";
import accountingService from "../api/accountingService";
import { inr, fmtDate } from "../lib/format";

const TYPE_TONE = { TAX_INVOICE: "blue", BILL_OF_SUPPLY: "purple", SIMPLE_INVOICE: "slate" };
const STATUS_TONE = { ISSUED: "green", CANCELLED: "red" };

export default function Invoices() {
  const { showToast } = useToast();
  const canManage = hasPermission(P.ACCOUNTING_INVOICE_MANAGE);

  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState({ page: 0, totalPages: 1, total: 0, from: 0, to: 0 });
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [issueOpen, setIssueOpen] = useState(false);
  const [cancelRow, setCancelRow] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await accountingService.getInvoices(page, 20);
      const body = res.data;
      setRows(Array.isArray(body?.data) ? body.data : []);
      const pg = body?.pagination;
      if (pg) setMeta({
        page: pg.page, totalPages: pg.totalPages, total: pg.totalElements,
        from: pg.totalElements === 0 ? 0 : pg.page * pg.size + 1,
        to: Math.min((pg.page + 1) * pg.size, pg.totalElements),
      });
    } catch (e) {
      if (!isAlreadyReported(e)) showToast(getErrorMessage(e, "Couldn't load invoices."), "error");
    } finally {
      setLoading(false);
    }
  }, [page, showToast]);

  useEffect(() => { load(); }, [load]);

  const viewPdf = async (row) => {
    try { openBlob((await accountingService.invoicePdf(row.publicId)).data); }
    catch (e) { await hydrateBlobError(e); if (!isAlreadyReported(e)) showToast(getErrorMessage(e, "Couldn't open the PDF."), "error"); }
  };

  const eInvoice = async (row) => {
    try {
      const res = await accountingService.generateEInvoice(row.publicId);
      const st = res?.data?.data?.einvoiceStatus;
      showToast(st === "GENERATED" ? "IRN generated." : "e-invoicing is not configured (stub).", st === "GENERATED" ? "success" : "info");
      load();
    } catch (e) { if (!isAlreadyReported(e)) showToast(getErrorMessage(e, "e-invoice failed."), "error"); }
  };

  return (
    <Page icon={FileText} title="Invoices" crumb="Invoices" subtitle="GST tax invoices, bills of supply & simple invoices"
      actions={<>
        <Btn variant="outline" size="sm" onClick={load}><RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh</Btn>
        {canManage && <Btn variant="primary" size="sm" onClick={() => setIssueOpen(true)}><Plus className="w-4 h-4" /> Issue Invoice</Btn>}
      </>}>

      <Panel className="overflow-hidden">
        <PanelHead icon={FileText} title="All Invoices" count={loading ? null : meta.total} />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px]">
            <thead className={theadCls}>
              <tr>
                <Th>Invoice #</Th><Th>Date</Th><Th>Recipient</Th><Th>GSTIN</Th>
                <Th right>Taxable</Th><Th right>Tax</Th><Th right>Total</Th>
                <Th>Type</Th><Th>Status</Th><Th right>Actions</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? <SkeletonRows rows={5} cols={10} />
                : rows.length === 0 ? <EmptyRow colSpan={10} title="No invoices yet" hint="Issue an invoice against a confirmed booking to get started." />
                : rows.map((r, idx) => {
                  const tax = ["cgst", "sgst", "igst", "cess", "tcs"].reduce((s, k) => s + Number(r[k] || 0), 0);
                  return (
                    <tr key={r.publicId} className="hover:bg-emerald-50/30 transition-colors acc-fade" style={{ animationDelay: `${idx * 25}ms` }}>
                      <td className="px-3 py-3.5"><span className="text-sm font-extrabold text-emerald-700">{r.invoiceNumber}</span></td>
                      <td className="px-3 py-3.5 text-sm text-slate-600">{fmtDate(r.invoiceDate)}</td>
                      <td className="px-3 py-3.5 text-sm font-bold text-slate-800">{r.recipientName || "—"}</td>
                      <td className="px-3 py-3.5 text-xs font-mono text-slate-500">{r.recipientGstin || "—"}</td>
                      <td className="px-3 py-3.5 text-right text-sm text-slate-600">{inr(r.taxableValue)}</td>
                      <td className="px-3 py-3.5 text-right text-sm text-slate-600">{inr(tax)}</td>
                      <td className="px-3 py-3.5 text-right text-sm font-extrabold text-slate-800">{inr(r.invoiceTotal)}</td>
                      <td className="px-3 py-3.5"><Badge tone={TYPE_TONE[r.invoiceType] || "slate"}>{r.invoiceTypeLabel || r.invoiceType}</Badge></td>
                      <td className="px-3 py-3.5"><Badge tone={STATUS_TONE[r.status] || "slate"}>{r.status}</Badge></td>
                      <td className="px-3 py-3.5">
                        <div className="flex items-center justify-end gap-1.5">
                          <IconBtn tone="blue" title="View PDF" onClick={() => viewPdf(r)}><Eye className="w-3.5 h-3.5" /></IconBtn>
                          {canManage && r.status === "ISSUED" && r.invoiceType === "TAX_INVOICE" && (
                            <IconBtn tone="emerald" title="Generate IRN" onClick={() => eInvoice(r)}><QrCode className="w-3.5 h-3.5" /></IconBtn>
                          )}
                          {canManage && r.status === "ISSUED" && (
                            <IconBtn tone="red" title="Cancel" onClick={() => setCancelRow(r)}><Ban className="w-3.5 h-3.5" /></IconBtn>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        <Pager page={meta.page} totalPages={meta.totalPages} total={meta.total} from={meta.from} to={meta.to} onPage={setPage} />
      </Panel>

      {issueOpen && <IssueInvoiceModal onClose={() => setIssueOpen(false)} onIssued={() => { setIssueOpen(false); setPage(0); load(); }} />}
      {cancelRow && <CancelInvoiceModal row={cancelRow} onClose={() => setCancelRow(null)} onDone={() => { setCancelRow(null); load(); }} />}
    </Page>
  );
}

function IssueInvoiceModal({ onClose, onIssued }) {
  const { showToast } = useToast();
  const [bookings, setBookings] = useState([]);
  const [form, setForm] = useState({ bookingPublicId: "", invoiceType: "TAX_INVOICE", overseasTourPackage: false, recipientGstin: "", placeOfSupplyState: "", invoiceDate: "" });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    (async () => {
      try {
        const res = await bookingService.getAll(0, 300);
        setBookings(Array.isArray(res?.data?.data) ? res.data.data : []);
      } catch { /* leave empty */ }
    })();
  }, []);

  const submit = async () => {
    if (!form.bookingPublicId) { showToast("Pick a booking first.", "error"); return; }
    setSaving(true);
    try {
      const res = await accountingService.issueInvoice({
        bookingPublicId: form.bookingPublicId, invoiceType: form.invoiceType, overseasTourPackage: form.overseasTourPackage,
        recipientGstin: form.recipientGstin || null, placeOfSupplyState: form.placeOfSupplyState || null, invoiceDate: form.invoiceDate || null,
      });
      showToast(`Invoice issued: ${res?.data?.data?.invoiceNumber || ""}`, "success");
      onIssued();
    } catch (e) { if (!isAlreadyReported(e)) showToast(getErrorMessage(e, "Couldn't issue the invoice."), "error"); }
    finally { setSaving(false); }
  };

  return (
    <Modal icon={FileText} title="Issue Invoice" subtitle="Bill a booking as a GST tax invoice, bill of supply, or simple invoice" onClose={onClose}
      footer={<>
        <Btn variant="ghost" onClick={onClose} disabled={saving}>Cancel</Btn>
        <Btn variant="primary" onClick={submit} disabled={saving}>{saving ? "Issuing…" : "Issue Invoice"}</Btn>
      </>}>
      <Field label="Booking" required>
        <Select value={form.bookingPublicId} onChange={(e) => set("bookingPublicId", e.target.value)}>
          <option value="">Select a booking…</option>
          {bookings.map((b) => <option key={b.publicId} value={b.publicId}>{b.bookingCode} — {b.customerName || b.customerNameSnapshot || "Customer"} ({b.destination || b.destinationSnapshot || "—"})</option>)}
        </Select>
      </Field>
      <Field label="Invoice Type" hint="Bill of Supply / Simple carry no GST. Tax Invoice needs a GST-registered company.">
        <Select value={form.invoiceType} onChange={(e) => set("invoiceType", e.target.value)}>
          <option value="TAX_INVOICE">Tax Invoice (with GST)</option>
          <option value="BILL_OF_SUPPLY">Bill of Supply (no GST)</option>
          <option value="SIMPLE_INVOICE">Simple Invoice (no GST)</option>
        </Select>
      </Field>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Recipient GSTIN" hint="Leave blank for B2C"><input className={inputCls} value={form.recipientGstin} onChange={(e) => set("recipientGstin", e.target.value.toUpperCase())} placeholder="27AAAPL1234C1Z5" maxLength={15} /></Field>
        <Field label="Place of Supply" hint="State name or 2-digit code"><input className={inputCls} value={form.placeOfSupplyState} onChange={(e) => set("placeOfSupplyState", e.target.value)} placeholder="Maharashtra / 27" /></Field>
        <Field label="Invoice Date" hint="Defaults to today"><input type="date" className={inputCls} value={form.invoiceDate} onChange={(e) => set("invoiceDate", e.target.value)} /></Field>
        <div className="flex items-end">
          <label className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-bold text-slate-700 w-full hover:border-emerald-300 transition-all">
            <input type="checkbox" checked={form.overseasTourPackage} onChange={(e) => set("overseasTourPackage", e.target.checked)} className="h-4 w-4 accent-emerald-600" />
            Overseas package (TCS 206C(1G))
          </label>
        </div>
      </div>
    </Modal>
  );
}

function CancelInvoiceModal({ row, onClose, onDone }) {
  const { showToast } = useToast();
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async () => {
    if (!reason.trim()) { showToast("A reason is required.", "error"); return; }
    setBusy(true);
    try {
      await accountingService.cancelInvoice(row.publicId, reason.trim());
      showToast("Invoice cancelled. Its number is retained.", "success");
      onDone();
    } catch (e) { if (!isAlreadyReported(e)) showToast(getErrorMessage(e, "Couldn't cancel."), "error"); }
    finally { setBusy(false); }
  };
  return (
    <Modal icon={Ban} title={`Cancel ${row.invoiceNumber}`} subtitle="The number is retained and reported as cancelled — never reused" onClose={onClose}
      maxW="max-w-md" gradient="from-red-500 to-rose-600"
      footer={<>
        <Btn variant="ghost" onClick={onClose} disabled={busy}>Keep</Btn>
        <Btn variant="danger" onClick={submit} disabled={busy}>{busy ? "Cancelling…" : "Cancel Invoice"}</Btn>
      </>}>
      <Field label="Reason" required>
        <textarea className={inputCls} rows={3} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Wrong recipient / duplicate / …" />
      </Field>
    </Modal>
  );
}