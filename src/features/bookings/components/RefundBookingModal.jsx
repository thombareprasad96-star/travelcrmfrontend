import { useState, useEffect } from "react";
import bookingService from "../api/bookingService";
import { useToast } from "@shared/ui/toast";
import { getErrorMessage, isAlreadyReported } from "@shared/api/apiError";
import { downloadBlob, hydrateBlobError } from "@shared/lib/download";

const unwrap = (res) => res?.data?.data ?? res?.data;

/* Every rupee shown here is the backend's — the remaining refundable ceiling and the settled totals
   all come from the server; React only displays and lets the user enter an amount to disburse. */
const fmtINR = (n) =>
  n != null
    ? "₹" + Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : "₹0.00";

const newIdemKey = () =>
  (typeof crypto !== "undefined" && crypto.randomUUID)
    ? crypto.randomUUID()
    : `rf-${Date.now()}-${Math.random().toString(16).slice(2)}`;

/**
 * Record a refund disbursement against a cancelled booking. Opens on the frozen cancellation summary
 * (refund due / already paid / remaining), lets a BOOKING_REFUND user enter one payout capped to the
 * remaining balance, then offers the freshly-issued refund voucher. The backend is authoritative for
 * every figure and re-validates the cap; the UI never computes money.
 */
export default function RefundBookingModal({ booking, onClose, onRefunded, onToast }) {
  const { showToast } = useToast();
  const notify = (msg, type) => (onToast ? onToast(msg, type) : showToast(msg, type));

  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("Bank Transfer");
  const [reference, setReference] = useState("");
  const [refundDate, setRefundDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState("");
  const [idemKey] = useState(newIdemKey);

  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    let alive = true;
    bookingService
      .getCancellationSummary(booking.id)
      .then((res) => alive && setSummary(unwrap(res)))
      .catch((e) => {
        if (alive && !isAlreadyReported(e))
          setLoadError(getErrorMessage(e, "Couldn't load the refund details for this booking."));
      })
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [booking.id]);

  const remaining = summary ? Number(summary.remainingRefundable ?? 0) : 0;
  const amountNum = amount === "" ? null : Number(amount);
  const amountInvalid =
    amount !== "" && (Number.isNaN(amountNum) || amountNum <= 0 || amountNum > remaining + 1e-9);
  const canSubmit = summary && remaining > 0 && amount !== "" && !amountInvalid && !submitting;

  const fillRemaining = () => setAmount(String(remaining));

  const submit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      const res = unwrap(
        await bookingService.refund(booking.id, {
          amount: amountNum,
          method: method.trim() || undefined,
          reference: reference.trim() || undefined,
          refundDate,
          notes: notes.trim() || undefined,
          idempotencyKey: idemKey,
        })
      );
      notify(`Refund of ${fmtINR(res?.amount)} recorded for ${booking.code || ""}.`, "success");
      onRefunded?.(res);   // refresh the parent; keep this modal open for the voucher
      setResult(res);
    } catch (error) {
      if (isAlreadyReported(error)) return;
      notify(getErrorMessage(error, "Failed to record the refund. Please try again."), "error");
    } finally {
      setSubmitting(false);
    }
  };

  const downloadVoucher = async () => {
    setDownloading(true);
    try {
      const res = await bookingService.getRefundVoucher(booking.id);
      downloadBlob(res.data, `RefundVoucher-${booking.code || booking.id}.pdf`);
      notify("Refund voucher downloaded.", "success");
    } catch (error) {
      if (isAlreadyReported(error)) return;
      await hydrateBlobError(error);
      notify(getErrorMessage(error, "Couldn't generate the refund voucher."), "error");
    } finally {
      setDownloading(false);
    }
  };

  const Row = ({ label, value, cls = "text-slate-700", strong }) => (
    <div className="flex items-center justify-between">
      <span className="text-xs text-slate-500 font-medium">{label}</span>
      <span className={`text-sm ${strong ? "font-extrabold" : ""} ${cls}`}>{value}</span>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200/60
        w-full max-w-lg z-10 max-h-[92vh] overflow-y-auto">

        <div className="bg-gradient-to-r from-green-700 to-emerald-600 px-6 py-5 rounded-t-2xl flex items-start justify-between sticky top-0 z-10">
          <div>
            <p className="text-green-100 text-xs font-bold uppercase tracking-widest mb-0.5">
              {result ? "Refund Recorded" : "Record Refund"}
            </p>
            <h2 className="text-white text-lg font-extrabold leading-tight">{booking.code || "Booking"}</h2>
            <p className="text-green-100 text-xs mt-0.5">{booking.customer || ""}</p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all">✕</button>
        </div>

        <div className="p-6 space-y-4">
          {loading ? (
            <div className="flex items-center gap-2 text-sm text-slate-500 py-6">
              <span className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
              Loading refund details…
            </div>
          ) : loadError ? (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-4">{loadError}</div>
          ) : summary?.customerOwes ? (
            <div className="text-sm text-slate-600 bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="font-bold text-amber-700 mb-1">Nothing to refund</p>
              This cancellation left a balance of <b>{fmtINR(summary.customerBalanceOwed)}</b> owed by the customer
              (a debit note was issued), so no refund is due.
            </div>
          ) : result ? (
            /* ── Success / voucher state ── */
            <>
              <div className="rounded-xl border border-green-200 bg-green-50 p-4 space-y-2">
                <Row label="Refunded now" value={fmtINR(result.amount)} cls="text-green-700" strong />
                <Row label="Total refunded" value={fmtINR(result.totalRefunded)} cls="text-slate-800" />
                <Row label="Still refundable" value={fmtINR(result.remainingRefundable)}
                  cls={Number(result.remainingRefundable) > 0 ? "text-amber-700" : "text-slate-500"} />
                <Row label="Status" value={String(result.refundStatus || "").replace(/_/g, " ")} cls="text-slate-600" />
                {result.refundVoucherNumber && (
                  <Row label="Voucher no." value={result.refundVoucherNumber} cls="text-slate-600" />
                )}
              </div>
              <button onClick={downloadVoucher} disabled={downloading}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-sm transition-all shadow-md disabled:opacity-60">
                {downloading && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
                Download Refund Voucher
              </button>
              <button onClick={onClose}
                className="w-full py-2.5 rounded-xl border-2 border-slate-200 hover:border-slate-300 text-slate-600 font-bold text-sm transition-all bg-white hover:bg-slate-50">
                Done
              </button>
            </>
          ) : (
            /* ── Entry state ── */
            <>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
                <Row label="Refund due" value={fmtINR(summary.refundDue)} cls="text-slate-800" strong />
                <Row label="Already refunded" value={fmtINR(summary.totalRefunded)} cls="text-slate-500" />
                <Row label="Still refundable" value={fmtINR(summary.remainingRefundable)} cls="text-green-700" strong />
              </div>

              {remaining <= 0 ? (
                <div className="text-sm text-slate-600 bg-green-50 border border-green-200 rounded-xl p-4">
                  This booking has been <b>fully refunded</b>. Nothing further is due.
                </div>
              ) : (
                <>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Amount to refund (₹) *</label>
                      <button type="button" onClick={fillRemaining}
                        className="text-[11px] font-bold text-green-700 hover:text-green-800 underline">
                        Full remaining ({fmtINR(remaining)})
                      </button>
                    </div>
                    <input type="number" min="0" step="0.01" value={amount}
                      onChange={(e) => setAmount(e.target.value)} placeholder="0.00"
                      className={`w-full px-3 py-2 rounded-lg border text-sm text-slate-700 outline-none focus:ring-2
                        ${amountInvalid ? "border-red-300 focus:ring-red-50" : "border-slate-200 focus:border-green-400 focus:ring-green-50"}`} />
                    {amountInvalid && (
                      <p className="text-[11px] text-red-600 mt-1">
                        Enter an amount between ₹0.01 and {fmtINR(remaining)}.
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">Method</label>
                      <input value={method} onChange={(e) => setMethod(e.target.value)} maxLength={40}
                        placeholder="Bank Transfer"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-700 focus:border-green-400 focus:ring-2 focus:ring-green-50 outline-none" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">Refund date</label>
                      <input type="date" value={refundDate} onChange={(e) => setRefundDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-700 focus:border-green-400 focus:ring-2 focus:ring-green-50 outline-none" />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">Reference</label>
                    <input value={reference} onChange={(e) => setReference(e.target.value)} maxLength={120}
                      placeholder="UTR / transaction id"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-700 focus:border-green-400 focus:ring-2 focus:ring-green-50 outline-none" />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">Notes (optional)</label>
                    <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} maxLength={1000}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-700 focus:border-green-400 focus:ring-2 focus:ring-green-50 outline-none resize-none" />
                  </div>
                </>
              )}

              <div className="flex gap-3 pt-1">
                <button onClick={onClose} disabled={submitting}
                  className="flex-1 py-2.5 rounded-xl border-2 border-slate-200 hover:border-slate-300 text-slate-600 font-bold text-sm transition-all bg-white hover:bg-slate-50 disabled:opacity-60">
                  Cancel
                </button>
                {remaining > 0 && (
                  <button onClick={submit} disabled={!canSubmit}
                    className="flex-1 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-sm transition-all shadow-md shadow-green-200 disabled:opacity-60 disabled:cursor-not-allowed">
                    {submitting ? "Recording…" : "Record Refund"}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
