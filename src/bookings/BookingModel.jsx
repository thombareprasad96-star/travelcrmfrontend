import { useState } from "react";
import { toast } from "sonner";
import bookingService from "../services/bookingService"
import { fmtINR, fmtDate } from "./Utils"
import { STATUS_STYLE, STATUS_DOT, STATUS_LABEL, PAY_STYLE, PAY_LABEL } from "./Constants"

/**
 * Full-detail booking modal with payment progress, profit indicator,
 * and voucher send action.
 *
 * @param {{ booking: object|null, onClose: () => void, onVoucherSent?: () => void }} props
 */
export default function BookingModal({ booking, onClose, onVoucherSent }) {
  const [sendingVoucher, setSendingVoucher] = useState(false);

  if (!booking) return null;

  const payPct = booking.totalPayable > 0
    ? Math.round((booking.paid / booking.totalPayable) * 100)
    : 0;

  const handleSendVoucher = async () => {
    setSendingVoucher(true);
    try {
      await bookingService.sendVoucher(booking.id);
      toast.success("Voucher sent successfully!", {
        description: `Voucher for ${booking.code} has been emailed.`,
      });
      onVoucherSent?.();
    } catch (err) {
      toast.error("Failed to send voucher.", {
        description: err?.response?.data?.message || "Please try again.",
      });
    } finally {
      setSendingVoucher(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

        {/* ── Header ── */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-5 rounded-t-2xl flex items-start justify-between">
          <div>
            <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-0.5">Booking Detail</p>
            <h2 className="text-white text-xl font-extrabold">{booking.code}</h2>
            <p className="text-blue-100 text-sm mt-0.5">{booking.customer}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center text-lg transition-all"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-5">

          {/* ── Status badges ── */}
          <div className="flex flex-wrap gap-2">
            <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${STATUS_STYLE[booking.status] ?? ""}`}>
              <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${STATUS_DOT[booking.status] ?? ""}`} />
              {STATUS_LABEL[booking.status] ?? booking.status}
            </span>
            <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${PAY_STYLE[booking.payStatus] ?? ""}`}>
              💳 {PAY_LABEL[booking.payStatus] ?? booking.payStatus}
            </span>
            {booking.services?.map(s => (
              <span key={s} className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">{s}</span>
            ))}
          </div>

          {/* ── Detail grid ── */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              ["📍", "Destination",   booking.destination],
              ["📅", "Travel Date",   fmtDate(booking.travelDate)],
              ["🗓️", "Booking Date",  fmtDate(booking.bookingDate)],
              ["👤", "Created By",    booking.createdBy],
              ["💰", "Customer Amt",  fmtINR(booking.customerAmount)],
              ["🏷️", "Vendor Cost",   fmtINR(booking.vendorCost)],
              ["🧾", "GST (5%)",      fmtINR(booking.gst)],
              ["📋", "TCS (5%)",      fmtINR(booking.tcs)],
              ["💳", "Total Payable", fmtINR(booking.totalPayable)],
            ].map(([icon, label, val]) => (
              <div key={label} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <p className="text-xs text-slate-400 font-medium mb-0.5">{icon} {label}</p>
                <p className="text-sm font-bold text-slate-700">{val}</p>
              </div>
            ))}
          </div>

          {/* ── Payment progress ── */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-bold text-slate-600">Payment Progress</p>
              <p className="text-sm font-extrabold text-blue-600">{payPct}%</p>
            </div>
            <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  payPct === 100 ? "bg-green-500" : payPct > 0 ? "bg-blue-500" : "bg-slate-300"
                }`}
                style={{ width: `${payPct}%` }}
              />
            </div>
            <div className="flex justify-between mt-1.5 text-xs text-slate-400 font-medium">
              <span>Paid: {fmtINR(booking.paid)}</span>
              <span>Due: {fmtINR(Math.max(0, booking.totalPayable - booking.paid))}</span>
            </div>
          </div>

          {/* ── Net profit indicator ── */}
          <div className={`rounded-xl p-4 border flex items-center gap-3 ${
            booking.netProfit >= 0 ? "bg-green-50 border-green-100" : "bg-red-50 border-red-100"
          }`}>
            <span className="text-2xl">{booking.netProfit >= 0 ? "📈" : "📉"}</span>
            <div>
              <p className="text-xs font-medium text-slate-500">Net Profit</p>
              <p className={`text-lg font-extrabold ${booking.netProfit >= 0 ? "text-green-700" : "text-red-600"}`}>
                {fmtINR(booking.netProfit)}
              </p>
            </div>
          </div>

          {/* ── Actions ── */}
          <div className="flex flex-wrap gap-2 pt-1">
            <button className="flex-1 min-w-[120px] py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-all">
              ✏️ Edit Booking
            </button>
            <button
              onClick={handleSendVoucher}
              disabled={sendingVoucher}
              className="flex-1 min-w-[120px] py-2.5 rounded-xl bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 text-sm font-bold transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {sendingVoucher ? "⏳ Sending..." : "📧 Send Voucher"}
            </button>
            <button className="flex-1 min-w-[120px] py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 text-sm font-bold transition-all">
              🖨️ Print
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}