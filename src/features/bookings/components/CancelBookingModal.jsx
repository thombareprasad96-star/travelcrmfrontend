import { useState, useEffect, useCallback } from "react";
import bookingService from "../api/bookingService";
import { hasPermission, P } from "@shared/lib/access";
import { useToast } from "@shared/ui/toast";
import { getErrorMessage, isAlreadyReported } from "@shared/api/apiError";
import { downloadBlob, hydrateBlobError } from "@shared/lib/download";

/* res.data?.data ?? res.data */
const unwrap = (res) => res?.data?.data ?? res?.data;

/* Money is displayed EXACTLY as the backend computed it — never recomputed here. */
const fmtINR = (n) =>
  n != null
    ? "₹" + Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : "₹0.00";

/**
 * Cancel a booking. The modal is driven by the backend's cancellation PREVIEW — it shows the
 * policy-computed retained charge, taxes and the resulting refund (or balance the customer owes),
 * then confirms. Nothing about the money is calculated in the browser: a proposed waiver/override is
 * sent to the preview endpoint and we render whatever comes back, so the confirmed figures always
 * match what was shown.
 *
 * Lead handling on cancel (booking is ALWAYS retained as CANCELLED):
 *   ① Move back to lead        → lead re-activates (REOPENED).           Gated by BOOKING_CANCEL.
 *   ② Permanently delete lead   → lead moved to Trash (cascade).          Gated by LEAD_PERMANENT_DELETE.
 * Overriding/waiving the charge is gated by BOOKING_REFUND. A COMPLETED booking cannot be cancelled.
 */
export default function CancelBookingModal({ booking, onClose, onCancelled, onToast }) {
  const { showToast } = useToast();
  const notify = (msg, type) => (onToast ? onToast(msg, type) : showToast(msg, type));

  const canPermDelete = hasPermission(P.LEAD_PERMANENT_DELETE);
  const canRefund = hasPermission(P.BOOKING_REFUND);
  const isCompleted = booking.status === "Completed";

  const [action, setAction] = useState("MOVE_TO_LEAD");
  const [reason, setReason] = useState("");
  const [confirmText, setConfirmText] = useState("");

  const [overrideActive, setOverrideActive] = useState(false);
  const [overrideChargeBase, setOverrideChargeBase] = useState("");
  const [overrideReason, setOverrideReason] = useState("");
  const [vendorRecoverable, setVendorRecoverable] = useState("");

  const [quote, setQuote] = useState(null);
  const [loadingQuote, setLoadingQuote] = useState(!isCompleted);
  const [quoteError, setQuoteError] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [downloadingDoc, setDownloadingDoc] = useState(false);

  const permSelected = action === "PERMANENT_DELETE_LEAD";
  const confirmOk = !permSelected || confirmText.trim().toUpperCase() === "DELETE";
  const overrideNum = overrideChargeBase === "" ? null : Number(overrideChargeBase);
  const overrideInvalid = overrideActive && overrideChargeBase !== "" && (Number.isNaN(overrideNum) || overrideNum < 0);
  // The backend flags overrideApplied when the submitted charge differs from the policy figure —
  // when it does, we require a reason for the audit trail.
  const needsOverrideReason = canRefund && quote?.overrideApplied && !overrideReason.trim();

  const fetchPreview = useCallback(async (params) => {
    setLoadingQuote(true);
    setQuoteError("");
    try {
      const res = await bookingService.getCancellationPreview(booking.id, params);
      setQuote(unwrap(res));
    } catch (e) {
      if (!isAlreadyReported(e)) setQuoteError(getErrorMessage(e, "Couldn't load the cancellation preview."));
    } finally {
      setLoadingQuote(false);
    }
  }, [booking.id]);

  // Single source of the preview: refetch (debounced) whenever the proposed override changes.
  useEffect(() => {
    if (isCompleted || done) return;
    const active = canRefund && overrideActive;
    const params = active
      ? {
          overrideChargeBase: overrideChargeBase === "" ? undefined : overrideChargeBase,
          vendorRecoverable: vendorRecoverable === "" ? undefined : vendorRecoverable,
        }
      : {};
    const t = setTimeout(() => fetchPreview(params), 350);
    return () => clearTimeout(t);
  }, [overrideActive, overrideChargeBase, vendorRecoverable, canRefund, isCompleted, done, fetchPreview]);

  const submit = async () => {
    if (submitting || !confirmOk || overrideInvalid || needsOverrideReason) return;
    setSubmitting(true);
    try {
      const payload = { action };
      if (reason.trim()) payload.reason = reason.trim();
      if (canRefund) {
        if (overrideActive && overrideChargeBase !== "" && !Number.isNaN(overrideNum)) {
          payload.overrideChargeBase = overrideNum;
          if (overrideReason.trim()) payload.overrideReason = overrideReason.trim();
        }
        if (vendorRecoverable !== "" && !Number.isNaN(Number(vendorRecoverable))) {
          payload.vendorRecoverable = Number(vendorRecoverable);
        }
      }
      const res = unwrap(await bookingService.cancel(booking.id, payload));
      notify(
        permSelected
          ? `Booking ${booking.code || ""} cancelled; lead permanently deleted`
          : `Booking ${booking.code || ""} cancelled; lead reopened`,
        "success"
      );
      onCancelled?.(res);      // refresh the parent list; keep this modal open for the document
      setDone(true);
    } catch (error) {
      if (isAlreadyReported(error)) return;
      notify(getErrorMessage(error, "Failed to cancel booking. Please try again."), "error");
    } finally {
      setSubmitting(false);
    }
  };

  const downloadNote = async () => {
    setDownloadingDoc(true);
    try {
      const res = await bookingService.getCreditNote(booking.id);
      const label = quote?.customerOwes ? "DebitNote" : "CreditNote";
      downloadBlob(res.data, `${label}-${booking.code || booking.id}.pdf`);
      notify("Cancellation note downloaded.", "success");
    } catch (error) {
      if (isAlreadyReported(error)) return;
      await hydrateBlobError(error);
      notify(getErrorMessage(error, "Couldn't generate the cancellation note."), "error");
    } finally {
      setDownloadingDoc(false);
    }
  };

  const OptionCard = ({ value, title, desc, danger }) => {
    const selected = action === value;
    return (
      <button type="button" onClick={() => setAction(value)}
        className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
          selected
            ? danger ? "border-red-400 bg-red-50" : "border-gold-400 bg-gold-50"
            : "border-slate-200 bg-white hover:border-slate-300"
        }`}>
        <div className="flex items-start gap-3">
          <span className={`mt-0.5 w-4 h-4 rounded-full border-2 flex-shrink-0 ${
            selected ? (danger ? "border-red-500 bg-red-500" : "border-gold-600 bg-gold-600") : "border-slate-300"
          }`} />
          <div>
            <p className={`text-sm font-extrabold ${danger ? "text-red-700" : "text-slate-800"}`}>{title}</p>
            <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
          </div>
        </div>
      </button>
    );
  };

  const Row = ({ label, value, cls = "text-slate-700", strong }) => (
    <div className="flex items-center justify-between">
      <span className="text-xs text-slate-500 font-medium">{label}</span>
      <span className={`text-sm ${strong ? "font-extrabold" : ""} ${cls}`}>{value}</span>
    </div>
  );

  /* ── Preview breakdown (rendered straight from the backend quote) ── */
  const bandLabel = () => {
    if (!quote) return "";
    if (quote.overrideApplied) return "Manually overridden";
    if (quote.noPolicy) return "No policy — no charge";
    if (quote.appliedDeductionType === "PERCENT") return `${quote.appliedDeductionValue}% deduction`;
    if (quote.appliedDeductionType === "FLAT") return `${fmtINR(quote.appliedDeductionValue)} flat`;
    return "";
  };

  const Breakdown = () => {
    if (loadingQuote && !quote) {
      return (
        <div className="flex items-center gap-2 text-sm text-slate-500 py-4">
          <span className="w-4 h-4 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
          Computing cancellation charges…
        </div>
      );
    }
    if (quoteError) {
      return <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-3">{quoteError}</div>;
    }
    if (!quote) return null;

    const daysTxt = quote.daysBeforeDeparture < 0
      ? `No-show — travel date passed ${Math.abs(quote.daysBeforeDeparture)}d ago`
      : `${quote.daysBeforeDeparture} day(s) before departure`;

    return (
      <div className={`rounded-xl border p-4 space-y-2.5 transition-opacity ${loadingQuote ? "opacity-60" : ""}
        ${quote.customerOwes ? "border-red-200 bg-red-50/40" : "border-gold-200 bg-gold-50/40"}`}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-600">Cancellation Charges</span>
          <span className="text-[11px] font-bold text-slate-500 bg-white border border-slate-200 rounded-full px-2 py-0.5">
            {bandLabel()}
          </span>
        </div>
        <p className="text-[11px] text-slate-400">{daysTxt}</p>

        {quote.noPolicy && (
          <div className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2">
            No cancellation policy is pinned to this booking. The charge defaults to ₹0 (full refund);
            {canRefund ? " set a retained charge below if applicable." : " confirming requires refund permission."}
          </div>
        )}

        <div className="space-y-2 pt-1 border-t border-white/60">
          <Row label="Cancellation charge" value={fmtINR(quote.chargeBase)} />
          {Number(quote.gstOnCharge) > 0 && <Row label="GST retained on charge" value={fmtINR(quote.gstOnCharge)} cls="text-slate-500" />}
          {Number(quote.tcsRetained) > 0 && <Row label="TCS retained" value={fmtINR(quote.tcsRetained)} cls="text-slate-500" />}
          <Row label="Total retained" value={fmtINR(quote.totalRetained)} cls="text-slate-800" strong />
          <Row label="Amount paid" value={fmtINR(quote.paidAmount)} cls="text-green-700" />
        </div>

        <div className="pt-2 border-t border-white/60">
          {quote.customerOwes ? (
            <Row label="Customer still owes" value={fmtINR(quote.customerBalanceOwed)} cls="text-red-600" strong />
          ) : (
            <Row label="Refund due to customer" value={fmtINR(quote.refundToCustomer)} cls="text-green-600" strong />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200/60
        w-full max-w-lg z-10 max-h-[92vh] overflow-y-auto">

        <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-5 rounded-t-2xl flex items-start justify-between sticky top-0 z-10">
          <div>
            <p className="text-slate-300 text-xs font-bold uppercase tracking-widest mb-0.5">
              {done ? "Booking Cancelled" : "Cancel Booking"}
            </p>
            <h2 className="text-white text-lg font-extrabold leading-tight">{booking.code || "Booking"}</h2>
            <p className="text-slate-300 text-xs mt-0.5">{booking.customer || ""}</p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all">✕</button>
        </div>

        <div className="p-6 space-y-4">
          {isCompleted ? (
            <div className="text-sm text-slate-600 bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="font-bold text-amber-700 mb-1">This booking is completed</p>
              A completed booking cannot be cancelled — the journey is done and its customer history is preserved.
            </div>
          ) : done ? (
            /* ── Success / document state ── */
            <>
              <div className={`rounded-xl border p-4 ${quote?.customerOwes ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}`}>
                <p className="text-sm font-extrabold text-slate-800 mb-1">
                  Booking cancelled and recorded.
                </p>
                {quote && (
                  <p className="text-sm text-slate-600">
                    {quote.customerOwes
                      ? <>The customer still owes <span className="font-extrabold text-red-600">{fmtINR(quote.customerBalanceOwed)}</span> — a debit note was issued.</>
                      : <>Refund due to the customer is <span className="font-extrabold text-green-600">{fmtINR(quote.refundToCustomer)}</span> — a credit note was issued.</>}
                  </p>
                )}
              </div>
              <button onClick={downloadNote} disabled={downloadingDoc}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gold-600 hover:bg-gold-700 text-white font-bold text-sm transition-all shadow-md disabled:opacity-60">
                {downloadingDoc
                  ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  : null}
                Download {quote?.customerOwes ? "Debit Note" : "Credit Note"}
              </button>
              <button onClick={onClose}
                className="w-full py-2.5 rounded-xl border-2 border-slate-200 hover:border-slate-300 text-slate-600 font-bold text-sm transition-all bg-white hover:bg-slate-50">
                Done
              </button>
            </>
          ) : (
            /* ── Confirm state ── */
            <>
              <Breakdown />

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">Reason (optional)</label>
                <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={2} maxLength={1000}
                  placeholder="e.g. Customer changed plans"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-700 focus:border-gold-400 focus:ring-2 focus:ring-gold-50 outline-none resize-none" />
              </div>

              {/* Override / waive — BOOKING_REFUND only */}
              {canRefund && (
                <div className="rounded-xl border border-slate-200 p-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={overrideActive}
                      onChange={(e) => setOverrideActive(e.target.checked)}
                      className="w-4 h-4 accent-gold-600" />
                    <span className="text-sm font-bold text-slate-700">Override or waive the cancellation charge</span>
                  </label>
                  {overrideActive && (
                    <div className="mt-3 space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Retained charge (₹)</label>
                          <button type="button" onClick={() => setOverrideChargeBase("0")}
                            className="text-[11px] font-bold text-gold-700 hover:text-gold-800 underline">Waive (₹0)</button>
                        </div>
                        <input type="number" min="0" step="0.01" value={overrideChargeBase}
                          onChange={(e) => setOverrideChargeBase(e.target.value)}
                          placeholder={quote ? String(quote.systemComputedChargeBase) : "0.00"}
                          className={`w-full px-3 py-2 rounded-lg border text-sm text-slate-700 outline-none focus:ring-2
                            ${overrideInvalid ? "border-red-300 focus:ring-red-50" : "border-slate-200 focus:border-gold-400 focus:ring-gold-50"}`} />
                        {overrideInvalid && <p className="text-[11px] text-red-600 mt-1">Enter a valid non-negative amount.</p>}
                        <p className="text-[11px] text-slate-400 mt-1">Policy-computed charge: {quote ? fmtINR(quote.systemComputedChargeBase) : "—"}. Leave blank to keep it.</p>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">
                          Override reason {quote?.overrideApplied && <span className="text-red-500">*</span>}
                        </label>
                        <input value={overrideReason} onChange={(e) => setOverrideReason(e.target.value)} maxLength={1000}
                          placeholder="Why the charge is being changed"
                          className={`w-full px-3 py-2 rounded-lg border text-sm text-slate-700 outline-none focus:ring-2
                            ${needsOverrideReason ? "border-red-300 focus:ring-red-50" : "border-slate-200 focus:border-gold-400 focus:ring-gold-50"}`} />
                        {needsOverrideReason && <p className="text-[11px] text-red-600 mt-1">A reason is required when overriding the charge.</p>}
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">
                          Vendor cost recoverable (₹) <span className="text-slate-400 normal-case font-medium">— internal, affects profit only</span>
                        </label>
                        <input type="number" min="0" step="0.01" value={vendorRecoverable}
                          onChange={(e) => setVendorRecoverable(e.target.value)} placeholder="0.00"
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-700 focus:border-gold-400 focus:ring-2 focus:ring-gold-50 outline-none" />
                      </div>
                    </div>
                  )}
                </div>
              )}

              <p className="text-sm text-slate-500">
                The booking is always <span className="font-bold text-slate-700">retained as Cancelled</span> for audit.
                Choose what to do with the associated lead:
              </p>

              <OptionCard value="MOVE_TO_LEAD" title="① Cancel & move back to lead"
                desc="Re-activates the lead (Reopened) so it can be worked again. Links preserved." />

              {canPermDelete && (
                <OptionCard value="PERMANENT_DELETE_LEAD" danger title="② Cancel & permanently delete lead"
                  desc="Moves the lead and its quotations to Trash. Recoverable for 30 days." />
              )}

              {permSelected && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                  <p className="text-xs font-bold text-red-700 mb-2">
                    ⚠ This deletes the lead (recoverable in Trash for 30 days). Type <span className="font-mono">DELETE</span> to confirm.
                  </p>
                  <input value={confirmText} onChange={(e) => setConfirmText(e.target.value)} placeholder="DELETE"
                    className="w-full px-3 py-2 rounded-lg border border-red-300 text-sm text-slate-700 focus:border-red-400 focus:ring-2 focus:ring-red-50 outline-none" />
                </div>
              )}
            </>
          )}

          {!isCompleted && !done && (
            <div className="flex gap-3 pt-1">
              <button onClick={onClose} disabled={submitting}
                className="flex-1 py-2.5 rounded-xl border-2 border-slate-200 hover:border-slate-300 text-slate-600 font-bold text-sm transition-all bg-white hover:bg-slate-50 disabled:opacity-60">
                Keep Booking
              </button>
              <button onClick={submit} disabled={submitting || !confirmOk || overrideInvalid || needsOverrideReason || (loadingQuote && !quote)}
                className={`flex-1 py-2.5 rounded-xl text-white font-bold text-sm transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed ${
                  permSelected ? "bg-red-600 hover:bg-red-700 shadow-red-200" : "bg-gold-600 hover:bg-gold-700 shadow-gold-200"
                }`}>
                {submitting ? "Cancelling…" : permSelected ? "Delete Lead & Cancel" : "Cancel Booking"}
              </button>
            </div>
          )}

          {isCompleted && (
            <button onClick={onClose}
              className="w-full py-2.5 rounded-xl border-2 border-slate-200 hover:border-slate-300 text-slate-600 font-bold text-sm transition-all bg-white hover:bg-slate-50">
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
