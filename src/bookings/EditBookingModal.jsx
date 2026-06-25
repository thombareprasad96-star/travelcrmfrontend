import React, { useState, useMemo } from "react";
import bookingService from "../services/bookingService";

/* res.data?.data ?? res.data */
const unwrap = (res) => res?.data?.data ?? res?.data;

const STATUSES = ["Confirmed", "Pending", "Cancelled", "Completed", "Refunded"];
const COMMON_SERVICES = ["Hotel", "Flight", "Sightseeing", "Cruise", "Vehicle", "Visa", "Passport", "Add-on"];

const todayStr = () => new Date().toISOString().slice(0, 10);
const toDateInput = (d) => {
  if (!d) return "";
  const s = String(d);
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
  const dt = new Date(s);
  return isNaN(dt.getTime()) ? "" : dt.toISOString().slice(0, 10);
};
const fmtINR = (v) => "₹" + Number(v || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 });
const sameArray = (a = [], b = []) => a.length === b.length && a.every((x) => b.includes(x));

/**
 * Edit an existing booking. Prefilled from the publicId-keyed row; submits only the fields the
 * user actually changed (true partial PUT — which also avoids the @FutureOrPresent trap on an
 * unchanged past travel date). Status changes go through the dedicated status endpoint.
 */
export default function EditBookingModal({ booking, onClose, onSaved, onToast }) {
  const [form, setForm] = useState({
    destination:    booking.destination || "",
    travelDate:     toDateInput(booking.travelDate),
    bookingDate:    toDateInput(booking.bookingDate),
    customerAmount: booking.customerAmount != null ? String(booking.customerAmount) : "",
    vendorCost:     booking.vendorCost != null ? String(booking.vendorCost) : "",
    services:       Array.isArray(booking.services) ? booking.services : [],
    status:         booking.status || "Pending",
  });
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const toggleService = (svc) =>
    setForm((p) => ({
      ...p,
      services: p.services.includes(svc)
        ? p.services.filter((s) => s !== svc)
        : [...p.services, svc],
    }));

  const totals = useMemo(() => {
    const amount = Number(form.customerAmount) || 0;
    const vendor = Number(form.vendorCost) || 0;
    const gst = +(amount * 0.05).toFixed(2);
    const tcs = +(amount * 0.05).toFixed(2);
    return { amount, vendor, gst, tcs, total: +(amount + gst + tcs).toFixed(2), profit: +(amount - vendor).toFixed(2) };
  }, [form.customerAmount, form.vendorCost]);

  const validate = () => {
    const e = {};
    if (!form.destination.trim()) e.destination = "Required";
    if (!form.travelDate) e.travelDate = "Required";
    else if (form.travelDate !== toDateInput(booking.travelDate) && form.travelDate < todayStr())
      e.travelDate = "Cannot be in the past";
    if (!(Number(form.customerAmount) > 0)) e.customerAmount = "Must be greater than 0";
    if (!(Number(form.vendorCost) > 0)) e.vendorCost = "Must be greater than 0";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (submitting) return;
    if (!validate()) return;
    setSubmitting(true);
    try {
      // Build a partial payload of only what changed.
      const payload = {};
      if (form.destination.trim() !== (booking.destination || "")) payload.destination = form.destination.trim();
      if (form.travelDate !== toDateInput(booking.travelDate)) payload.travelDate = form.travelDate;
      if (form.bookingDate !== toDateInput(booking.bookingDate)) payload.bookingDate = form.bookingDate || null;
      if (Number(form.customerAmount) !== Number(booking.customerAmount)) payload.customerAmount = Number(form.customerAmount);
      if (Number(form.vendorCost) !== Number(booking.vendorCost)) payload.vendorCost = Number(form.vendorCost);
      if (!sameArray(form.services, Array.isArray(booking.services) ? booking.services : [])) payload.services = form.services;

      const statusChanged = form.status !== booking.status;
      if (Object.keys(payload).length === 0 && !statusChanged) {
        onToast?.("No changes to save.", "success");
        onClose();
        return;
      }

      if (Object.keys(payload).length > 0) await bookingService.update(booking.id, payload);
      // Status is owned by the dedicated endpoint; enum name is UPPERCASE on the wire.
      if (statusChanged) await bookingService.updateStatus(booking.id, form.status.toUpperCase());

      const updated = unwrap(await bookingService.getById(booking.id));
      onToast?.(`Booking ${updated?.bookingCode || booking.code || ""} updated`, "success");
      onSaved?.();
      onClose();
    } catch (err) {
      console.error("Booking update failed:", err);
      const status = err?.response?.status;
      const msg = err?.response?.data?.message;
      if (status === 403) onToast?.("You don't have access to this. Please contact your administrator.", "error");
      else onToast?.(msg || "Failed to update booking. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = (key) =>
    `w-full px-3 py-2.5 rounded-xl border text-sm text-slate-700 placeholder-slate-400 bg-white
     focus:ring-2 focus:ring-blue-50 outline-none transition-all ${
       errors[key] ? "border-red-300 focus:border-red-400" : "border-slate-200 focus:border-blue-400"
     }`;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200/60
        w-full max-w-2xl max-h-[92vh] overflow-y-auto z-10">

        <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-5 rounded-t-2xl flex items-start justify-between sticky top-0 z-10">
          <div>
            <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-0.5">Edit Booking</p>
            <h2 className="text-white text-lg font-extrabold leading-tight">{booking.code || "Booking"}</h2>
            <p className="text-blue-100 text-xs mt-0.5">{booking.customer || ""}</p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all">✕</button>
        </div>

        <div className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-500 mb-1.5">Destination</label>
              <input value={form.destination} onChange={(e) => set("destination", e.target.value)} className={inputCls("destination")} />
              {errors.destination && <p className="text-[11px] text-red-500 mt-1">{errors.destination}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5">Travel Date</label>
              <input type="date" value={form.travelDate} onChange={(e) => set("travelDate", e.target.value)} className={inputCls("travelDate")} />
              {errors.travelDate && <p className="text-[11px] text-red-500 mt-1">{errors.travelDate}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5">Booking Date</label>
              <input type="date" value={form.bookingDate} onChange={(e) => set("bookingDate", e.target.value)} className={inputCls("bookingDate")} />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5">Customer Amount (₹)</label>
              <input type="number" min="0" step="0.01" value={form.customerAmount}
                onChange={(e) => set("customerAmount", e.target.value)} className={inputCls("customerAmount")} />
              {errors.customerAmount && <p className="text-[11px] text-red-500 mt-1">{errors.customerAmount}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5">Vendor Cost (₹)</label>
              <input type="number" min="0" step="0.01" value={form.vendorCost}
                onChange={(e) => set("vendorCost", e.target.value)} className={inputCls("vendorCost")} />
              {errors.vendorCost && <p className="text-[11px] text-red-500 mt-1">{errors.vendorCost}</p>}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-500 mb-1.5">Status</label>
              <select value={form.status} onChange={(e) => set("status", e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-50 outline-none cursor-pointer">
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5">Services</label>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_SERVICES.map((svc) => {
                const on = form.services.includes(svc);
                return (
                  <button key={svc} type="button" onClick={() => toggleService(svc)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition-all ${
                      on ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-500 border-slate-200 hover:border-blue-300"
                    }`}>{svc}</button>
                );
              })}
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Recalculated Summary</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
              {[
                ["Customer Amt", fmtINR(totals.amount)],
                ["GST (5%)", fmtINR(totals.gst)],
                ["TCS (5%)", fmtINR(totals.tcs)],
                ["Total Payable", fmtINR(totals.total)],
                ["Vendor Cost", fmtINR(totals.vendor)],
                ["Net Profit", fmtINR(totals.profit)],
              ].map(([label, val]) => (
                <div key={label}>
                  <p className="text-[11px] text-slate-400 font-medium">{label}</p>
                  <p className={`font-extrabold ${label === "Net Profit" && totals.profit < 0 ? "text-red-600" : "text-slate-700"}`}>{val}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button onClick={onClose} disabled={submitting}
              className="flex-1 py-2.5 rounded-xl border-2 border-slate-200 hover:border-slate-300 text-slate-600 font-bold text-sm transition-all bg-white hover:bg-slate-50 disabled:opacity-60">
              Cancel
            </button>
            <button onClick={handleSubmit} disabled={submitting}
              className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all shadow-md shadow-blue-200 disabled:opacity-70 disabled:cursor-not-allowed">
              {submitting ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}