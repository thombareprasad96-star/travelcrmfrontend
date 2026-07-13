// src/features/bookings/pages/BookingDetails.jsx
// ─────────────────────────────────────────────────────────────
// Full Booking Details page — matches screenshot layout exactly
// Route: /Bookings/:id  (id = booking publicId)
//
// Sections (left-right split like screenshot):
// LEFT:  Booking code + customer info + financials + action buttons
// RIGHT: Profit Summary | Travel Info | Booking Services |
//        Payment History | Quotation Info | Booking Reminders
//
// Data loading: getById does NOT embed payments/services, so this page loads
// service lines via getServices(id) and the payment ledger via getPayments(id)
// as separate requests and renders those tables from the fetched state.
// ─────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import bookingService from "../api/bookingService";
import { useToast } from "@shared/ui/toast";
import { getErrorMessage, isAlreadyReported } from "@shared/api/apiError";
import { downloadBlob, hydrateBlobError } from "@shared/lib/download";
import { hasPermission, P } from "@shared/lib/access";
import RefundBookingModal from "../components/RefundBookingModal";
import {
  FiArrowLeft, FiEdit2, FiTrash2, FiCheck, FiX, FiAlertCircle,
  FiPlus, FiExternalLink, FiRefreshCw, FiCreditCard, FiUser,
  FiTruck, FiDownload, FiPhone, FiEye, FiBell, FiFileText,
} from "react-icons/fi";
import {
  FaPlane, FaHotel, FaCar, FaShip, FaPassport,
  FaUmbrellaBeach, FaReceipt,
} from "react-icons/fa";
import { MdOutlineAssignment, MdPayment } from "react-icons/md";

/* ─── CONSTANTS ──────────────────────────────────────────────── */
const STATUS_STYLE = {
  CONFIRMED: "bg-green-100 text-green-700 border-green-200",
  PENDING:   "bg-amber-100 text-amber-700 border-amber-200",
  CANCELLED: "bg-red-100   text-red-600   border-red-200",
  COMPLETED: "bg-emerald-100 text-emerald-700 border-emerald-200",
  REFUNDED:  "bg-purple-100 text-purple-700 border-purple-200",
};
const STATUS_DOT = {
  CONFIRMED:"bg-green-500", PENDING:"bg-amber-500",
  CANCELLED:"bg-red-500",   COMPLETED:"bg-emerald-500", REFUNDED:"bg-purple-500",
};
const PAY_STYLE = {
  PAID:     "bg-emerald-100 text-emerald-700",
  PARTIAL:  "bg-orange-100  text-orange-700",
  UNPAID:   "bg-rose-100    text-rose-700",
  REFUNDED: "bg-slate-100   text-slate-600",
};
const SVC_ICON = {
  Hotel: <FaHotel/>, Flight: <FaPlane/>, Transport: <FaCar/>,
  Vehicle: <FaCar/>, Cruise: <FaShip/>, Sightseeing: <FaUmbrellaBeach/>,
  Visa: <FaPassport/>, Insurance: "🛡️", Passport: <FaPassport/>,
};
const PRIORITY_CFG = {
  High:   { bg:"bg-red-100",   text:"text-red-700"   },
  Medium: { bg:"bg-amber-100", text:"text-amber-700" },
  Low:    { bg:"bg-slate-100", text:"text-slate-500" },
};

/* ─── HELPERS ────────────────────────────────────────────────── */
const fmtINR = n => n != null
  ? "₹" + Number(n).toLocaleString("en-IN", { minimumFractionDigits:2, maximumFractionDigits:2 })
  : "₹0.00";
const fmtDate = d => d
  ? new Date(d).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" })
  : "—";
const fmtDateTime = d => d
  ? new Date(d).toLocaleString("en-IN", { day:"2-digit", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit" })
  : "—";
const titleCase = s => s
  ? String(s).replace(/_/g, " ").split(" ").filter(Boolean)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ")
  : "—";
const unwrap = res => res?.data?.data ?? res?.data;

function normalizeBooking(b = {}) {
  const customerAmount = Number(b.customerAmount) || 0;
  const vendorCost     = Number(b.vendorCost)     || 0;
  const gst            = Number(b.gst)            || 0;
  const tcs            = Number(b.tcs)            || 0;
  const totalPayable   = Number(b.totalPayable)   || customerAmount + gst + tcs;
  const paid           = Number(b.paidAmount)     || 0;
  const netProfit      = Number(b.netProfit)      || (customerAmount - vendorCost);
  const netMargin      = customerAmount > 0 ? ((netProfit / customerAmount) * 100).toFixed(1) : 0;
  const due            = b.pendingAmount != null ? Number(b.pendingAmount) : Math.max(0, totalPayable - paid);
  const payPct         = totalPayable > 0 ? Math.round((paid / totalPayable) * 100) : 0;

  return {
    id:              b.publicId || b.id,
    code:            b.bookingCode || b.code || "—",
    customer:        b.customerNameSnapshot || b.customerName || "—",
    customerPhone:   b.customerPhone || b.phone || "",
    destination:     b.destinationSnapshot || b.destination || "—",
    bookingDate:     b.bookingDate || b.createdAt,
    travelDate:      b.travelDate,
    travelEndDate:   b.travelEndDate || b.returnDate,
    adults:          b.adults || b.numAdults || 0,
    children:        b.children || b.numChildren || 0,
    infants:         b.infants  || 0,
    leadName:        b.leadName || b.customerNameSnapshot || b.customerName || "—",
    leadPhone:       b.leadPhone || b.customerPhone || b.phone || "",
    assignedUser:    b.assignedUser?.fullName || b.assignedUser?.name || b.assignedTo || "—",
    customerAmount,  vendorCost, gst, tcs, totalPayable, paid, due, netProfit, netMargin, payPct,
    status:          (b.status || "PENDING").toUpperCase(),
    payStatus:       (b.paymentStatus || b.payStatus || "UNPAID").toUpperCase(),
    notes:           b.notes || "",
    reminders:       Array.isArray(b.reminders) ? b.reminders : [],
    quotation:       b.quotation || null,
    leadId:          b.leadId || b.leadPublicId || null,
    createdBy:       b.createdBy || "—",
  };
}

/* ─── SECTION CARD ───────────────────────────────────────────── */
function SCard({ title, icon, action, children, accent = "gold" }) {
  const accents = {
    gold:   "bg-gold-600",
    green:  "bg-green-600",
    amber:  "bg-amber-500",
    purple: "bg-purple-600",
    slate:  "bg-slate-700",
    teal:   "bg-teal-600",
    red:    "bg-red-500",
  };
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className={`${accents[accent] || accents.gold} px-5 py-3.5 flex items-center justify-between`}>
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center text-white text-sm flex-shrink-0">
            {icon}
          </div>
          <h3 className="text-sm font-extrabold text-white">{title}</h3>
        </div>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

/* ─── ADD PAYMENT MODAL ──────────────────────────────────────── */
function AddPaymentModal({ booking, onClose, onAdded, showToast }) {
  const [form,   setForm]   = useState({
    amount:"", paymentMethod:"Cash", reference:"", notes:"",
    paymentDate: new Date().toISOString().slice(0,10),
  });
  const [saving, setSaving] = useState(false);
  const [err,    setErr]    = useState("");

  const handleAdd = async () => {
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) {
      setErr("Enter a valid amount."); return;
    }
    setSaving(true);
    try {
      await bookingService.addPayment(booking.id, {
        amount:        Number(form.amount),
        paymentMethod: form.paymentMethod,
        paymentDate:   form.paymentDate,
        reference:     form.reference || undefined,
        notes:         form.notes || undefined,
      });
      showToast("Payment recorded.", "success");
      onAdded();
      onClose();
    } catch (error) {
      if (isAlreadyReported(error)) { onClose(); return; }
      setErr(getErrorMessage(error, "Failed to record payment."));
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}/>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md z-10 p-6" style={{animation:"popIn .25s ease both"}}>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
            <MdPayment className="w-5 h-5 text-green-600"/>
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-800">Record Payment</h3>
            <p className="text-xs text-slate-400">{booking.code} · Due: {fmtINR(booking.due)}</p>
          </div>
          <button onClick={onClose} className="ml-auto w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200"><FiX className="w-4 h-4"/></button>
        </div>
        {err && <div className="bg-red-50 border border-red-200 rounded-xl px-3 py-2 text-xs text-red-600 font-semibold mb-4 flex items-center gap-2"><FiAlertCircle className="w-3.5 h-3.5"/>{err}</div>}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">Amount (₹) *</label>
            <input type="number" step="0.01" min="0" value={form.amount}
              onChange={e=>{ setForm(p=>({...p,amount:e.target.value})); setErr(""); }}
              placeholder="e.g. 10000"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:border-gold-400 focus:ring-2 focus:ring-gold-100 outline-none"/>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">Payment Method</label>
            <select value={form.paymentMethod} onChange={e=>setForm(p=>({...p,paymentMethod:e.target.value}))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:border-gold-400 outline-none appearance-none cursor-pointer">
              {["Cash","Card","UPI","Bank Transfer","Cheque","Other"].map(m=><option key={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">Payment Date</label>
            <input type="date" value={form.paymentDate} onChange={e=>setForm(p=>({...p,paymentDate:e.target.value}))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:border-gold-400 outline-none"/>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">Reference (optional)</label>
            <input value={form.reference} onChange={e=>setForm(p=>({...p,reference:e.target.value}))}
              placeholder="e.g. UTR / txn id"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:border-gold-400 outline-none"/>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">Note (optional)</label>
            <input value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))}
              placeholder="e.g. First instalment"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:border-gold-400 outline-none"/>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border-2 border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all">Cancel</button>
          <button onClick={handleAdd} disabled={saving}
            className="flex-1 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-sm transition-all disabled:opacity-60 flex items-center justify-center gap-2">
            {saving&&<span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/>}
            {saving?"Saving…":"Record Payment"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── ASSIGN VENDOR MODAL ────────────────────────────────────── */
function AssignVendorModal({ booking, service, onClose, onAssigned, showToast }) {
  const [vendors, setVendors]         = useState([]);
  const [loadingVendors, setLoading]  = useState(true);
  const [vendorPublicId, setVendorId] = useState(service?.vendorPublicId || "");
  const [vendorCost, setVendorCost]   = useState(service?.vendorCost ?? "");
  const [saving, setSaving]           = useState(false);
  const [err, setErr]                 = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res  = await bookingService.getVendors();
        const list = res?.data?.data?.content ?? res?.data?.data ?? res?.data ?? [];
        if (alive) setVendors(Array.isArray(list) ? list : []);
      } catch (error) {
        if (!isAlreadyReported(error)) showToast(getErrorMessage(error, "Couldn't load vendors."), "error");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [showToast]);

  const handleAssign = async () => {
    if (!vendorPublicId) { setErr("Select a vendor."); return; }
    setSaving(true);
    try {
      await bookingService.assignVendor(booking.id, service.publicId, {
        vendorPublicId,
        vendorCost: vendorCost === "" ? undefined : Number(vendorCost),
      });
      showToast("Vendor assigned.", "success");
      onAssigned();
      onClose();
    } catch (error) {
      if (isAlreadyReported(error)) { onClose(); return; }
      setErr(getErrorMessage(error, "Failed to assign vendor."));
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}/>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md z-10 p-6" style={{animation:"popIn .25s ease both"}}>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-gold-100 flex items-center justify-center">
            <FiTruck className="w-5 h-5 text-gold-700"/>
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-800">Assign Vendor</h3>
            <p className="text-xs text-slate-400">Service: {service?.title || service?.serviceType || "—"}</p>
          </div>
          <button onClick={onClose} className="ml-auto w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200"><FiX className="w-4 h-4"/></button>
        </div>
        {err && <div className="bg-red-50 border border-red-200 rounded-xl px-3 py-2 text-xs text-red-600 font-semibold mb-4">{err}</div>}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">Vendor *</label>
            <select value={vendorPublicId} onChange={e=>{ setVendorId(e.target.value); setErr(""); }}
              disabled={loadingVendors}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:border-gold-400 focus:ring-2 focus:ring-gold-100 outline-none appearance-none cursor-pointer disabled:opacity-60">
              <option value="">{loadingVendors ? "Loading vendors…" : "Select a vendor"}</option>
              {vendors.map(v => (
                <option key={v.publicId} value={v.publicId}>{v.vendorName ?? v.name ?? "Unnamed vendor"}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">Vendor Cost (₹)</label>
            <input type="number" step="0.01" min="0" value={vendorCost} onChange={e=>setVendorCost(e.target.value)}
              placeholder="0.00"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:border-gold-400 outline-none"/>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border-2 border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all">Cancel</button>
          <button onClick={handleAssign} disabled={saving||loadingVendors}
            className="flex-1 py-2.5 rounded-xl bg-gold-600 hover:bg-gold-700 text-white font-bold text-sm transition-all disabled:opacity-60 flex items-center justify-center gap-2">
            {saving&&<span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/>}
            {saving?"Saving…":"Assign Vendor"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════ */
export default function BookingDetails() {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const { showToast } = useToast();

  const canUpdate = hasPermission(P.BOOKING_UPDATE);

  const [booking,     setBooking]     = useState(null);
  const [services,    setServices]    = useState([]);
  const [payments,    setPayments]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [showAddPay,  setShowAddPay]  = useState(false);
  const [assignSvc,   setAssignSvc]   = useState(null); // service item to assign vendor
  const [deletingPay, setDeletingPay] = useState(null);
  const [downloading, setDownloading] = useState(null); // "invoice" | "voucher" | `svc-<id>`

  /* ── FETCH ── */
  const fetchBooking = useCallback(async () => {
    if (!id) return;
    try {
      const res = await bookingService.getById(id);
      setBooking(normalizeBooking(unwrap(res)));
    } catch (error) {
      if (isAlreadyReported(error)) return;
      showToast(getErrorMessage(error, "Failed to load booking."), "error");
    }
  }, [id, showToast]);

  const fetchServices = useCallback(async () => {
    if (!id) return;
    try {
      const res  = await bookingService.getServices(id);
      const list = unwrap(res);
      setServices(Array.isArray(list) ? list : []);
    } catch (error) {
      if (isAlreadyReported(error)) return;
      showToast(getErrorMessage(error, "Couldn't load booking services."), "error");
    }
  }, [id, showToast]);

  const fetchPayments = useCallback(async () => {
    if (!id) return;
    try {
      const res  = await bookingService.getPayments(id);
      const list = unwrap(res);
      setPayments(Array.isArray(list) ? list : []);
    } catch (error) {
      if (isAlreadyReported(error)) return;
      showToast(getErrorMessage(error, "Couldn't load payment history."), "error");
    }
  }, [id, showToast]);

  const loadAll = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchBooking(), fetchServices(), fetchPayments()]);
    setLoading(false);
  }, [fetchBooking, fetchServices, fetchPayments]);

  useEffect(() => { loadAll(); }, [loadAll]);

  /* ── STATUS UPDATE ── */
  const handleStatusChange = async (newStatus) => {
    if (!canUpdate) return;
    const prev = booking.status;
    setBooking(p => ({ ...p, status: newStatus.toUpperCase() }));
    try {
      await bookingService.updateStatus(booking.id, newStatus);
      showToast(`Booking status updated to ${titleCase(newStatus)}.`, "success");
      fetchBooking();
    } catch (error) {
      setBooking(p => ({ ...p, status: prev }));
      if (isAlreadyReported(error)) return;
      showToast(getErrorMessage(error, "Failed to update status."), "error");
    }
  };

  /* ── DELETE PAYMENT ── */
  const handleDeletePayment = async (payPublicId) => {
    try {
      await bookingService.deletePayment(booking.id, payPublicId);
      showToast("Payment removed.", "success");
      await Promise.all([fetchPayments(), fetchBooking()]);
    } catch (error) {
      if (!isAlreadyReported(error)) showToast(getErrorMessage(error, "Failed to remove payment."), "error");
    } finally {
      setDeletingPay(null);
    }
  };

  /* ── PDF DOWNLOADS ── */
  const downloadInvoice = async () => {
    setDownloading("invoice");
    try {
      const res = await bookingService.getInvoice(booking.id);
      downloadBlob(res.data, `Invoice-${booking.code}.pdf`);
      showToast("Invoice downloaded.", "success");
    } catch (error) {
      if (isAlreadyReported(error)) return;
      await hydrateBlobError(error);
      showToast(getErrorMessage(error, "Couldn't generate the invoice."), "error");
    } finally { setDownloading(null); }
  };

  const downloadVoucher = async () => {
    setDownloading("voucher");
    try {
      const res = await bookingService.getVoucher(booking.id);
      downloadBlob(res.data, `Voucher-${booking.code}.pdf`);
      showToast("Voucher downloaded.", "success");
    } catch (error) {
      if (isAlreadyReported(error)) return;
      await hydrateBlobError(error);
      showToast(getErrorMessage(error, "Couldn't generate the voucher."), "error");
    } finally { setDownloading(null); }
  };

  const downloadServiceVoucher = async (svc) => {
    setDownloading(`svc-${svc.publicId}`);
    try {
      const res = await bookingService.getServiceVoucher(booking.id, svc.publicId);
      const safe = String(svc.title || svc.serviceType || "service").replace(/[^\w-]+/g, "_");
      downloadBlob(res.data, `Voucher-${booking.code}-${safe}.pdf`);
      showToast("Service voucher downloaded.", "success");
    } catch (error) {
      if (isAlreadyReported(error)) return;
      await hydrateBlobError(error);
      showToast(getErrorMessage(error, "Couldn't generate the service voucher."), "error");
    } finally { setDownloading(null); }
  };

  const downloadCreditNote = async () => {
    setDownloading("credit-note");
    try {
      const res = await bookingService.getCreditNote(booking.id);
      downloadBlob(res.data, `CancellationNote-${booking.code}.pdf`);
      showToast("Cancellation note downloaded.", "success");
    } catch (error) {
      if (isAlreadyReported(error)) return;
      await hydrateBlobError(error);
      showToast(getErrorMessage(error, "Couldn't generate the cancellation note."), "error");
    } finally { setDownloading(null); }
  };

  const downloadRefundVoucher = async () => {
    setDownloading("refund-voucher");
    try {
      const res = await bookingService.getRefundVoucher(booking.id);
      downloadBlob(res.data, `RefundVoucher-${booking.code}.pdf`);
      showToast("Refund voucher downloaded.", "success");
    } catch (error) {
      if (isAlreadyReported(error)) return;
      await hydrateBlobError(error);
      showToast(getErrorMessage(error, "No refund voucher yet — it's issued once a refund is disbursed."), "error");
    } finally { setDownloading(null); }
  };

  /* ── LOADING ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gold-50/40 to-slate-100 flex items-center justify-center"
        style={{fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif"}}>
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"/>
          <p className="text-slate-500 font-semibold">Loading booking details…</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gold-50/40 to-slate-100 flex items-center justify-center"
        style={{fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif"}}>
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <p className="text-lg font-extrabold text-slate-600 mb-2">Booking Not Found</p>
          <button onClick={()=>navigate("/Allbookings")}
            className="mt-4 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-600 hover:bg-gold-700 text-white font-bold text-sm transition-all mx-auto">
            <FiArrowLeft className="w-4 h-4"/> Back to Bookings
          </button>
        </div>
      </div>
    );
  }

  const b = booking;
  const statusStyle = STATUS_STYLE[b.status] || STATUS_STYLE.PENDING;
  const statusDot   = STATUS_DOT[b.status]   || STATUS_DOT.PENDING;
  const payStyle    = PAY_STYLE[b.payStatus]  || PAY_STYLE.UNPAID;
  const netNights   = b.travelDate && b.travelEndDate
    ? Math.round((new Date(b.travelEndDate) - new Date(b.travelDate)) / 86400000)
    : null;
  const totalTravellers = (b.adults||0) + (b.children||0) + (b.infants||0);

  /* ─── RENDER ──────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gold-50/40 to-slate-100"
      style={{fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        @keyframes slideIn { from{transform:translateX(110%);opacity:0} to{transform:translateX(0);opacity:1} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes popIn   { from{transform:scale(.92);opacity:0} to{transform:scale(1);opacity:1} }
      `}</style>

      {/* Modals */}
      {showAddPay  && <AddPaymentModal booking={b} showToast={showToast}
        onClose={()=>setShowAddPay(false)}
        onAdded={()=>{ fetchPayments(); fetchBooking(); }}/>}
      {assignSvc   && <AssignVendorModal booking={b} service={assignSvc} showToast={showToast}
        onClose={()=>setAssignSvc(null)}
        onAssigned={()=>{ fetchServices(); fetchBooking(); }}/>}

      {/* ── PAGE HEADER ── */}
      <div className="bg-white/70 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <button onClick={()=>navigate("/Allbookings")}
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-all">
                <FiArrowLeft className="w-4 h-4 text-slate-600"/>
              </button>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-lg font-extrabold text-slate-800">Booking Details</h1>
                  <span className="text-sm font-bold text-gold-700 bg-gold-50 border border-gold-200 px-2.5 py-0.5 rounded-lg">{b.code}</span>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${statusStyle}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${statusDot}`}/>
                    {titleCase(b.status)}
                  </span>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${payStyle}`}>
                    💳 {titleCase(b.payStatus)}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5 hidden sm:block">
                  <span className="cursor-pointer hover:text-gold-700" onClick={()=>navigate("/")}>Home</span>
                  <span className="mx-1">/</span>
                  <span className="cursor-pointer hover:text-gold-700" onClick={()=>navigate("/Allbookings")}>Bookings</span>
                  <span className="mx-1">/</span>
                  <span className="text-gold-700 font-bold">View</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button onClick={loadAll}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 hover:border-gold-300 bg-white text-slate-600 hover:text-gold-700 text-xs font-bold transition-all">
                <FiRefreshCw className={`w-3.5 h-3.5 ${loading?"animate-spin":""}`}/> Refresh
              </button>
              {canUpdate && (
                <button onClick={()=>navigate(`/EditBooking/${b.id}`)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gold-600 hover:bg-gold-700 text-white text-xs font-bold shadow-sm transition-all">
                  <FiEdit2 className="w-3.5 h-3.5"/> Edit
                </button>
              )}
              <button onClick={downloadInvoice} disabled={downloading==="invoice"}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gold-600 hover:bg-gold-700 text-white text-xs font-bold shadow-sm shadow-gold-200 transition-all disabled:opacity-60">
                {downloading==="invoice"
                  ? <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin"/>
                  : <FaReceipt className="w-3.5 h-3.5"/>}
                Invoice
              </button>
              <button onClick={downloadVoucher} disabled={downloading==="voucher"}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gold-300 bg-white text-gold-800 hover:bg-gold-50 text-xs font-bold transition-all disabled:opacity-60">
                {downloading==="voucher"
                  ? <span className="w-3.5 h-3.5 border-2 border-gold-300 border-t-gold-700 rounded-full animate-spin"/>
                  : <FiDownload className="w-3.5 h-3.5"/>}
                Voucher
              </button>
              {b.quotation?.shareToken && (
                <button onClick={()=>window.open(`/quotation/${b.quotation.shareToken}`,"_blank")}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-green-200 hover:border-green-300 bg-green-50 text-green-700 text-xs font-bold transition-all">
                  <FiExternalLink className="w-3.5 h-3.5"/> Quotation
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-5">
        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-5">

          {/* ════════════════ LEFT PANEL ════════════════ */}
          <div className="space-y-5">

            {/* Booking Identity Card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
              style={{animation:"fadeUp .4s ease both"}}>
              {/* Airplane header */}
              <div className="bg-gradient-to-br from-gold-400 to-gold-600 px-5 py-6 text-center shadow-gold-200">
                <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-3">
                  <FaPlane className="w-8 h-8 text-white"/>
                </div>
                <p className="text-2xl font-extrabold text-white tracking-widest">{b.code}</p>
                <p className="text-white/80 text-sm mt-1">{b.customer} · {b.destination}</p>
              </div>

              {/* Status row */}
              <div className="px-5 py-3 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">Status</span>
                  <select value={b.status}
                    onChange={e=>handleStatusChange(e.target.value)}
                    disabled={!canUpdate}
                    className={`text-xs font-bold px-2.5 py-1 rounded-full border appearance-none cursor-pointer outline-none disabled:cursor-not-allowed disabled:opacity-70 ${statusStyle}`}>
                    {["CONFIRMED","PENDING","CANCELLED","COMPLETED","REFUNDED"].map(s=>(
                      <option key={s} value={s}>{titleCase(s)}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="px-5 py-3 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">Payment Status</span>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${payStyle}`}>{titleCase(b.payStatus)}</span>
                </div>
              </div>

              {/* Financials */}
              <div className="px-5 py-4 space-y-2.5">
                {[
                  ["Customer Amount", b.customerAmount, "text-slate-700"],
                  ["GST",             b.gst,            "text-slate-500"],
                  ["TCS",             b.tcs,            "text-slate-500"],
                  ["Total Payable",   b.totalPayable,   "text-gold-700 font-extrabold"],
                  ["Paid Amount",     b.paid,           "text-green-600 font-bold"],
                  ["Due Amount",      b.due,            b.due > 0 ? "text-red-600 font-bold" : "text-green-600 font-bold"],
                  ["Vendor Costs",    b.vendorCost,     "text-slate-500"],
                  ["Net Profit",      b.netProfit,      b.netProfit >= 0 ? "text-green-600 font-bold" : "text-red-600 font-bold"],
                ].map(([label, val, cls])=>(
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-medium">{label}</span>
                    <span className={`text-sm ${cls || "text-slate-700"}`}>{fmtINR(val)}</span>
                  </div>
                ))}
                {/* Travellers */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                  <span className="text-xs text-slate-500 font-medium">Travellers</span>
                  <span className="text-sm font-bold text-slate-700">
                    {totalTravellers > 0 ? `${totalTravellers} pax` : "—"}
                    {b.adults > 0 && <span className="text-slate-400 font-normal text-xs ml-1">({b.adults}A{b.children > 0 ? ` · ${b.children}C` : ""})</span>}
                  </span>
                </div>
              </div>

              {/* Payment progress bar */}
              <div className="px-5 pb-4">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                  <span>Payment Progress</span>
                  <span className={b.payPct===100?"text-green-600 font-bold":"text-gold-700 font-bold"}>{b.payPct}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-700
                    ${b.payPct===100?"bg-gradient-to-r from-green-500 to-emerald-500":"bg-gradient-to-r from-gold-400 to-gold-600"}`}
                    style={{width:`${b.payPct}%`}}/>
                </div>
              </div>

              {/* Action buttons */}
              <div className="px-5 pb-5 space-y-2">
                {canUpdate && (
                  <button onClick={()=>navigate(`/EditBooking/${b.id}`)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gold-600 hover:bg-gold-700 text-white text-sm font-bold transition-all shadow-sm">
                    <FiEdit2 className="w-4 h-4"/> Edit Booking
                  </button>
                )}
                {canUpdate && (
                  <button onClick={()=>setShowAddPay(true)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-bold transition-all shadow-sm">
                    <MdPayment className="w-4 h-4"/> Add Payment
                  </button>
                )}
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={downloadInvoice} disabled={downloading==="invoice"}
                    className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-gold-600 hover:bg-gold-700 text-white text-xs font-bold transition-all disabled:opacity-60">
                    {downloading==="invoice"
                      ? <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin"/>
                      : <FaReceipt className="w-3 h-3"/>}
                    Invoice
                  </button>
                  <button onClick={downloadVoucher} disabled={downloading==="voucher"}
                    className="flex items-center justify-center gap-1.5 py-2 rounded-xl border border-gold-300 bg-white text-gold-800 hover:bg-gold-50 text-xs font-bold transition-all disabled:opacity-60">
                    {downloading==="voucher"
                      ? <span className="w-3 h-3 border-2 border-gold-300 border-t-gold-700 rounded-full animate-spin"/>
                      : <FiDownload className="w-3 h-3"/>}
                    Voucher
                  </button>
                </div>

                {/* Cancellation documents — only once the booking is cancelled/refunded */}
                {(b.status==="CANCELLED" || b.status==="REFUNDED") && (
                  <div className="grid grid-cols-2 gap-2 pt-2 mt-1 border-t border-slate-100">
                    <button onClick={downloadCreditNote} disabled={downloading==="credit-note"}
                      className="flex items-center justify-center gap-1.5 py-2 rounded-xl border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 text-xs font-bold transition-all disabled:opacity-60">
                      {downloading==="credit-note"
                        ? <span className="w-3 h-3 border-2 border-red-300 border-t-red-700 rounded-full animate-spin"/>
                        : <FaReceipt className="w-3 h-3"/>}
                      Credit Note
                    </button>
                    <button onClick={downloadRefundVoucher} disabled={downloading==="refund-voucher"}
                      className="flex items-center justify-center gap-1.5 py-2 rounded-xl border border-green-200 bg-green-50 text-green-700 hover:bg-green-100 text-xs font-bold transition-all disabled:opacity-60">
                      {downloading==="refund-voucher"
                        ? <span className="w-3 h-3 border-2 border-green-300 border-t-green-700 rounded-full animate-spin"/>
                        : <FiDownload className="w-3 h-3"/>}
                      Refund Voucher
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Customer Information */}
            <SCard title="Customer Information" icon={<FiUser/>} accent="teal">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center text-teal-700 font-extrabold text-sm flex-shrink-0">
                    {(b.customer||"U").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-extrabold text-slate-800 capitalize">{b.customer}</p>
                    <p className="text-xs text-slate-400">Customer</p>
                  </div>
                </div>
                {b.customerPhone && (
                  <a href={`tel:${b.customerPhone}`}
                    className="flex items-center gap-2 text-xs text-gold-700 hover:text-gold-800 font-semibold">
                    <FiPhone className="w-3.5 h-3.5"/> {b.customerPhone}
                  </a>
                )}
                <div className="pt-2 space-y-2 border-t border-slate-100">
                  {[
                    ["Booking Date", fmtDateTime(b.bookingDate)],
                    ["Travel Dates", b.travelDate
                      ? `${fmtDate(b.travelDate)} to ${fmtDate(b.travelEndDate)}${netNights?` · ${netNights}N`:""}` : "—"],
                    ["Assigned To",  b.assignedUser],
                    ["Created By",   b.createdBy],
                  ].map(([label,val])=>(
                    <div key={label} className="flex items-start justify-between gap-2">
                      <span className="text-xs text-slate-400 font-medium flex-shrink-0">{label}</span>
                      <span className="text-xs font-bold text-slate-700 text-right">{val||"—"}</span>
                    </div>
                  ))}
                </div>
                {b.leadId && (
                  <button onClick={()=>navigate(`/AllLeads?highlight=${b.leadId}`)}
                    className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200 transition-all mt-2">
                    <FiExternalLink className="w-3.5 h-3.5"/> View Lead
                  </button>
                )}
              </div>
            </SCard>
          </div>

          {/* ════════════════ RIGHT PANEL ════════════════ */}
          <div className="space-y-5">

            {/* ── Profit Summary (4 cards like screenshot) ── */}
            <div style={{animation:"fadeUp .4s ease both"}}>
              <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-3">Profit Summary</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label:"Customer Amount", value:fmtINR(b.customerAmount), sub:`Paid: ${fmtINR(b.paid)} · Due: ${fmtINR(b.due)}`, icon:"₹", bg:"from-gold-400 to-gold-600", small:false },
                  { label:"Actual Vendor Costs", value:fmtINR(b.vendorCost), sub:`Original: ${fmtINR(b.vendorCost)}`, icon:"🏷️", bg:"from-amber-500 to-orange-500", small:false },
                  { label:"Net Profit", value:fmtINR(b.netProfit), sub:`Customer − Vendor − GST · (${b.netMargin}%)`, icon:"📈", bg:"from-green-500 to-emerald-600", small:false },
                  { label:"Profit Margin", value:`${b.netMargin}%`, sub:`Based on Customer Amount`, icon:"📊", bg:"from-gold-400 to-gold-600", small:true },
                ].map((card, i) => (
                  <div key={card.label}
                    className={`bg-gradient-to-br ${card.bg} rounded-2xl p-4 text-white shadow-lg relative overflow-hidden`}
                    style={{animation:`fadeUp .4s ease both ${i*60}ms`}}>
                    <div className="absolute -right-4 -bottom-4 text-white/15 text-7xl pointer-events-none select-none">{card.icon}</div>
                    <p className="text-xs font-bold text-white/80 mb-1">{card.label}</p>
                    <p className={`font-extrabold text-white ${card.small?"text-2xl":"text-xl"} leading-tight`}>{card.value}</p>
                    <p className="text-[10px] text-white/70 mt-1.5 leading-relaxed line-clamp-2">{card.sub}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Travel Information ── */}
            <SCard title="Travel Information" icon={<FaPlane/>} accent="gold">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <p className="text-xs font-extrabold text-slate-500 uppercase tracking-wide mb-2">Lead Details</p>
                  <div className="space-y-1.5">
                    <p className="text-sm text-slate-700"><span className="font-semibold">Lead Name:</span> {b.leadName}</p>
                    {b.leadPhone && <p className="text-sm text-slate-700"><span className="font-semibold">Phone:</span> {b.leadPhone}</p>}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-extrabold text-slate-500 uppercase tracking-wide mb-2">Travelers</p>
                  <div className="space-y-1.5">
                    {b.adults   > 0 && <p className="text-sm text-slate-700"><span className="font-semibold">Adults:</span> {b.adults}</p>}
                    {b.children > 0 && <p className="text-sm text-slate-700"><span className="font-semibold">Children:</span> {b.children}</p>}
                    {b.infants  > 0 && <p className="text-sm text-slate-700"><span className="font-semibold">Infants:</span> {b.infants}</p>}
                    <p className="text-sm font-bold text-slate-700">Total: {totalTravellers || "—"}</p>
                  </div>
                </div>
              </div>
            </SCard>

            {/* ── Booking Services ── */}
            <SCard title="Booking Services" icon={<MdOutlineAssignment/>} accent="slate">
              {services.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm min-w-[560px]">
                    <thead className="bg-slate-50 border-b border-slate-100">
                      <tr>
                        {["Service","Vendor","Vendor Cost","Cost","Status","Reference","Voucher"].map(h=>(
                          <th key={h} className="px-3 py-2.5 text-left text-[10px] font-extrabold text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {services.map((svc) => (
                        <tr key={svc.publicId} className="hover:bg-gold-50/40 transition-colors group">
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-2">
                              <span className="text-base">{SVC_ICON[svc.serviceType] || SVC_ICON[svc.title] || "📋"}</span>
                              <div>
                                <span className="font-semibold text-slate-700 text-sm block">{svc.title || svc.serviceType || "—"}</span>
                                {svc.serviceType && svc.title && <span className="text-[11px] text-slate-400">{titleCase(svc.serviceType)}</span>}
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-3">
                            {svc.vendorName
                              ? <span className="text-sm text-slate-700 font-medium">{svc.vendorName}</span>
                              : canUpdate
                                ? <button onClick={()=>setAssignSvc(svc)}
                                    className="text-xs text-gold-700 hover:text-gold-800 font-semibold flex items-center gap-1 hover:underline">
                                    <FiPlus className="w-3 h-3"/> Assign vendor
                                  </button>
                                : <span className="text-xs text-slate-400">No vendor</span>
                            }
                          </td>
                          <td className="px-3 py-3">
                            <span className={`text-sm font-bold ${(svc.vendorCost||0)>0?"text-slate-700":"text-slate-400"}`}>
                              {fmtINR(svc.vendorCost||0)}
                            </span>
                          </td>
                          <td className="px-3 py-3">
                            <span className="text-sm text-slate-500">{fmtINR(svc.cost||0)}</span>
                          </td>
                          <td className="px-3 py-3">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${STATUS_STYLE[(svc.status||"PENDING").toUpperCase()] || STATUS_STYLE.PENDING}`}>
                              {titleCase(svc.status||"Pending")}
                            </span>
                          </td>
                          <td className="px-3 py-3">
                            <span className="text-sm text-slate-400">{svc.confirmationNumber||"—"}</span>
                          </td>
                          <td className="px-3 py-3">
                            <button onClick={()=>downloadServiceVoucher(svc)} disabled={downloading===`svc-${svc.publicId}`}
                              title="Download service voucher"
                              className="w-7 h-7 rounded-lg border border-gold-300 text-gold-700 hover:bg-gold-50 flex items-center justify-center transition-all disabled:opacity-60">
                              {downloading===`svc-${svc.publicId}`
                                ? <span className="w-3 h-3 border-2 border-gold-300 border-t-gold-700 rounded-full animate-spin"/>
                                : <FiFileText className="w-3.5 h-3.5"/>}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-3xl mb-2">🗂️</div>
                  <p className="text-sm text-slate-400 font-medium">No services added yet</p>
                </div>
              )}
            </SCard>

            {/* ── Payment History ── */}
            <SCard title="Payment History" icon={<FiCreditCard/>} accent="green"
              action={ canUpdate &&
                <button onClick={()=>setShowAddPay(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all">
                  <FiPlus className="w-3 h-3"/> Add Payment
                </button>
              }>
              {payments.length > 0 ? (
                <div className="space-y-2">
                  {payments.map((pay) => (
                    <div key={pay.publicId} className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3 border border-slate-100 group">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                          <FiCheck className="w-4 h-4 text-green-600"/>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{fmtINR(pay.amount)}</p>
                          <p className="text-xs text-slate-400">
                            {titleCase(pay.paymentMethod) || "—"} · {fmtDate(pay.paymentDate||pay.createdAt)}
                            {pay.reference && <span className="ml-1">· {pay.reference}</span>}
                          </p>
                          {pay.notes && <p className="text-xs text-slate-400 italic">{pay.notes}</p>}
                        </div>
                      </div>
                      {canUpdate && (deletingPay===pay.publicId ? (
                        <div className="flex items-center gap-1.5">
                          <button onClick={()=>handleDeletePayment(pay.publicId)}
                            className="text-xs font-bold text-red-600 px-2 py-1 rounded-lg bg-red-50 border border-red-200 hover:bg-red-100">Delete</button>
                          <button onClick={()=>setDeletingPay(null)}
                            className="text-xs font-bold text-slate-500 px-2 py-1 rounded-lg bg-white border border-slate-200">Cancel</button>
                        </div>
                      ) : (
                        <button onClick={()=>setDeletingPay(pay.publicId)}
                          className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                          <FiTrash2 className="w-3 h-3"/>
                        </button>
                      ))}
                    </div>
                  ))}
                  {/* Total paid */}
                  <div className="flex items-center justify-between px-4 py-2.5 bg-green-50 rounded-xl border border-green-100 mt-1">
                    <span className="text-xs font-bold text-green-700">Total Paid</span>
                    <span className="text-sm font-extrabold text-green-700">{fmtINR(b.paid)}</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-3xl mb-2">💳</div>
                  <p className="text-sm text-slate-400 font-medium mb-3">No payments recorded yet</p>
                  {canUpdate && (
                    <button onClick={()=>setShowAddPay(true)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-xs font-bold transition-all mx-auto">
                      <FiPlus className="w-3.5 h-3.5"/> Record Payment
                    </button>
                  )}
                </div>
              )}
            </SCard>

            {/* ── Quotation Information ── */}
            <SCard title="Quotation Information" icon={<FaReceipt/>} accent="purple"
              action={
                b.quotation?.shareToken && (
                  <button onClick={()=>window.open(`/quotation/${b.quotation.shareToken}`,"_blank")}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all">
                    <FiEye className="w-3 h-3"/> View Quotation
                  </button>
                )
              }>
              {b.quotation ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    {[
                      ["Title",   b.quotation.title||"—"],
                      ["Version", b.quotation.version||"1"],
                      ["Amount",  fmtINR(b.quotation.amount||b.customerAmount)],
                      ["Status",  titleCase(b.quotation.status||"Draft")],
                    ].map(([label,val])=>(
                      <div key={label} className="flex items-center justify-between">
                        <span className="text-xs text-slate-400 font-medium">{label}</span>
                        <span className="text-sm font-bold text-slate-700">{val}</span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    {[
                      ["Created", fmtDate(b.quotation.createdAt)],
                      ["Weblink", b.quotation.shareToken
                        ? <a href={`/quotation/${b.quotation.shareToken}`} target="_blank" rel="noreferrer"
                            className="text-gold-700 hover:underline flex items-center gap-1">
                            View <FiExternalLink className="w-3 h-3"/>
                          </a>
                        : "—"
                      ],
                    ].map(([label,val])=>(
                      <div key={label} className="flex items-center justify-between">
                        <span className="text-xs text-slate-400 font-medium">{label}</span>
                        <span className="text-sm font-bold text-slate-700">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="text-3xl mb-2">📄</div>
                  <p className="text-sm text-slate-400">No quotation linked</p>
                </div>
              )}
            </SCard>

            {/* ── Booking Reminders ── */}
            <SCard title="Booking Reminders" icon={<FiBell/>} accent="amber">
              {b.reminders?.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm min-w-[480px]">
                    <thead className="bg-slate-50 border-b border-slate-100">
                      <tr>
                        {["Due Date/Time","Days Before Travel","Status","Priority","Assigned To","Notification"].map(h=>(
                          <th key={h} className="px-3 py-2.5 text-left text-[10px] font-extrabold text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {b.reminders.map((rem, i) => {
                        const pc = PRIORITY_CFG[rem.priority] || PRIORITY_CFG.Medium;
                        return (
                          <tr key={rem.id||i} className="hover:bg-gold-50/40">
                            <td className="px-3 py-3 text-sm font-semibold text-slate-700 whitespace-nowrap">{fmtDateTime(rem.dueDate||rem.reminderDate)}</td>
                            <td className="px-3 py-3 text-sm text-slate-500">{rem.daysBefore ? `${rem.daysBefore} days before` : "—"}</td>
                            <td className="px-3 py-3">
                              <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${STATUS_STYLE[(rem.status||"PENDING").toUpperCase()]||STATUS_STYLE.PENDING}`}>
                                {titleCase(rem.status||"Pending")}
                              </span>
                            </td>
                            <td className="px-3 py-3">
                              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${pc.bg} ${pc.text}`}>
                                {rem.priority||"Medium"}
                              </span>
                            </td>
                            <td className="px-3 py-3 text-sm text-slate-600">{rem.assignedTo||rem.assignedUser?.fullName||"—"}</td>
                            <td className="px-3 py-3">
                              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${rem.notificationSent?"bg-green-100 text-green-700":"bg-slate-100 text-slate-500"}`}>
                                {rem.notificationSent?"Sent":"Pending"}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="text-3xl mb-2">🔔</div>
                  <p className="text-sm text-slate-400">No reminders set</p>
                </div>
              )}
            </SCard>

            {/* Notes */}
            {b.notes && (
              <SCard title="Notes" icon="📝" accent="slate">
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{b.notes}</p>
              </SCard>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}