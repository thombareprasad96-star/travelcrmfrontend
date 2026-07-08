import { useState } from "react";
import bookingService from "../api/bookingService";
import { hasPermission, P } from "@shared/lib/access";

/* res.data?.data ?? res.data */
const unwrap = (res) => res?.data?.data ?? res?.data;

/**
 * Cancel a booking with an explicit choice about its associated lead. The booking is ALWAYS
 * retained as CANCELLED. Two options:
 *   ① Move back to lead   → lead re-activates (REOPENED). Gated by BOOKING_CANCEL (this page).
 *   ② Permanently delete lead → lead hard-deleted (irreversible). Gated by LEAD_PERMANENT_DELETE,
 *      hidden without it, and protected by a type-to-confirm.
 * A COMPLETED booking cannot be cancelled.
 */
export default function CancelBookingModal({ booking, onClose, onCancelled, onToast }) {
  const canPermDelete = hasPermission(P.LEAD_PERMANENT_DELETE);
  const isCompleted = booking.status === "Completed";

  const [action, setAction] = useState("MOVE_TO_LEAD");
  const [confirmText, setConfirmText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const permSelected = action === "PERMANENT_DELETE_LEAD";
  const confirmOk = !permSelected || confirmText.trim().toUpperCase() === "DELETE";

  const submit = async () => {
    if (submitting || !confirmOk) return;
    setSubmitting(true);
    try {
      const res = unwrap(await bookingService.cancel(booking.id, action));
      onToast?.(
        action === "PERMANENT_DELETE_LEAD"
          ? `Booking ${booking.code || ""} cancelled; lead permanently deleted`
          : `Booking ${booking.code || ""} cancelled; lead reopened`,
        "success"
      );
      onCancelled?.(res);
      onClose();
    } catch (err) {
      console.error("Cancel booking failed:", err);
      const status = err?.response?.status;
      const msg = err?.response?.data?.message;
      if (status === 403) onToast?.("You don't have access to this. Please contact your administrator.", "error");
      else onToast?.(msg || "Failed to cancel booking. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const OptionCard = ({ value, title, desc, danger }) => {
    const selected = action === value;
    return (
      <button type="button" onClick={() => setAction(value)}
        className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
          selected
            ? danger ? "border-red-400 bg-red-50" : "border-blue-500 bg-blue-50"
            : "border-slate-200 bg-white hover:border-slate-300"
        }`}>
        <div className="flex items-start gap-3">
          <span className={`mt-0.5 w-4 h-4 rounded-full border-2 flex-shrink-0 ${
            selected ? (danger ? "border-red-500 bg-red-500" : "border-blue-600 bg-blue-600") : "border-slate-300"
          }`} />
          <div>
            <p className={`text-sm font-extrabold ${danger ? "text-red-700" : "text-slate-800"}`}>{title}</p>
            <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
          </div>
        </div>
      </button>
    );
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200/60
        w-full max-w-lg z-10">

        <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-5 rounded-t-2xl flex items-start justify-between">
          <div>
            <p className="text-slate-300 text-xs font-bold uppercase tracking-widest mb-0.5">Cancel Booking</p>
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
          ) : (
            <>
              <p className="text-sm text-slate-500">
                The booking is always <span className="font-bold text-slate-700">retained as Cancelled</span> for audit.
                Choose what to do with the associated lead:
              </p>

              <OptionCard
                value="MOVE_TO_LEAD"
                title="① Cancel & move back to lead"
                desc="Re-activates the lead (Reopened) so it can be worked again. Links preserved."
              />

              {canPermDelete && (
                <OptionCard
                  value="PERMANENT_DELETE_LEAD"
                  danger
                  title="② Cancel & permanently delete lead"
                  desc="Hard-deletes the lead and its quotations. This cannot be undone."
                />
              )}

              {permSelected && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                  <p className="text-xs font-bold text-red-700 mb-2">
                    ⚠ This permanently deletes the lead and cannot be undone. Type <span className="font-mono">DELETE</span> to confirm.
                  </p>
                  <input value={confirmText} onChange={(e) => setConfirmText(e.target.value)}
                    placeholder="DELETE"
                    className="w-full px-3 py-2 rounded-lg border border-red-300 text-sm text-slate-700 focus:border-red-400 focus:ring-2 focus:ring-red-50 outline-none" />
                </div>
              )}
            </>
          )}

          <div className="flex gap-3 pt-1">
            <button onClick={onClose} disabled={submitting}
              className="flex-1 py-2.5 rounded-xl border-2 border-slate-200 hover:border-slate-300 text-slate-600 font-bold text-sm transition-all bg-white hover:bg-slate-50 disabled:opacity-60">
              {isCompleted ? "Close" : "Keep Booking"}
            </button>
            {!isCompleted && (
              <button onClick={submit} disabled={submitting || !confirmOk}
                className={`flex-1 py-2.5 rounded-xl text-white font-bold text-sm transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed ${
                  permSelected ? "bg-red-600 hover:bg-red-700 shadow-red-200" : "bg-blue-600 hover:bg-blue-700 shadow-blue-200"
                }`}>
                {submitting ? "Cancelling…" : permSelected ? "Delete Lead & Cancel" : "Cancel Booking"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}