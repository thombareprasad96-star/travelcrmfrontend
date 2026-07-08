// src/bookings/BookingDetails.jsx
// ─────────────────────────────────────────────────────────────
// Full Booking Details page — matches screenshot layout exactly
// Route: /Bookings/:id  (id = booking publicId)
//
// Sections (left-right split like screenshot):
// LEFT:  Booking code + customer info + financials + action buttons
// RIGHT: Profit Summary | Travel Info | Booking Services |
//        Payment History | Quotation Info | Booking Reminders
// ─────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import bookingService from "../api/bookingService";
import { ArrowLeft as FiArrowLeft, Pen as FiEdit2, Trash2 as FiTrash2, Check as FiCheck, X as FiX, CircleAlert as FiAlertCircle, Plus as FiPlus, ExternalLink as FiExternalLink, RefreshCw as FiRefreshCw, CreditCard as FiCreditCard, User as FiUser, Truck as FiTruck, Printer as FiPrinter, Phone as FiPhone, Eye as FiEye, Bell as FiBell, Plane as FaPlane, Hotel as FaHotel, Car as FaCar, Ship as FaShip, BookUser as FaPassport, TreePalm as FaUmbrellaBeach, Receipt as FaReceipt, ClipboardList as MdOutlineAssignment, CreditCard as MdPayment } from "lucide-react";


/* ─── CONSTANTS ──────────────────────────────────────────────── */
const STATUS_STYLE = {
  CONFIRMED: "bg-green-100 text-green-700 border-green-200",
  PENDING:   "bg-amber-100 text-amber-700 border-amber-200",
  CANCELLED: "bg-red-100   text-red-600   border-red-200",
  COMPLETED: "bg-blue-100  text-blue-700  border-blue-200",
  REFUNDED:  "bg-purple-100 text-purple-700 border-purple-200",
};
const STATUS_DOT = {
  CONFIRMED:"bg-green-500", PENDING:"bg-amber-500",
  CANCELLED:"bg-red-500",   COMPLETED:"bg-blue-500", REFUNDED:"bg-purple-500",
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
const titleCase = s => s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "—";

function normalizeBooking(b = {}) {
  const customerAmount = Number(b.customerAmount) || 0;
  const vendorCost     = Number(b.vendorCost)     || 0;
  const gst            = Number(b.gst)            || 0;
  const tcs            = Number(b.tcs)            || 0;
  const totalPayable   = Number(b.totalPayable)   || customerAmount + gst + tcs;
  const paid           = Number(b.paidAmount)     || 0;
  const netProfit      = Number(b.netProfit)      || (customerAmount - vendorCost);
  const netMargin      = customerAmount > 0 ? ((netProfit / customerAmount) * 100).toFixed(1) : 0;
  const due            = Math.max(0, totalPayable - paid);
  const payPct         = totalPayable > 0 ? Math.round((paid / totalPayable) * 100) : 0;

  return {
    id:              b.publicId || b.id,
    code:            b.bookingCode || b.code || "—",
    customer:        b.customerNameSnapshot || b.customerName || "—",
    customerPhone:   b.customerPhone || b.phone || "",
    destination:     b.destinationSnapshot || b.destination || "—",
    services:        Array.isArray(b.services) ? b.services : [],
    bookingServices: Array.isArray(b.bookingServices) ? b.bookingServices : [],
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
    payments:        Array.isArray(b.payments)  ? b.payments  : [],
    reminders:       Array.isArray(b.reminders) ? b.reminders : [],
    quotation:       b.quotation || null,
    leadId:          b.leadId || b.leadPublicId || null,
    createdBy:       b.createdBy || "—",
  };
}

/* ─── TOAST ──────────────────────────────────────────────────── */
function Toast({ msg, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  const ok = type === "success";
  return (
    <div className={`fixed top-5 right-5 z-[999] flex items-center gap-3 px-4 py-3.5 rounded-2xl border shadow-2xl max-w-sm
      ${ok ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800"}`}
      style={{ animation:"slideIn .3s ease both" }}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${ok?"bg-green-100":"bg-red-100"}`}>
        {ok ? <FiCheck className="w-4 h-4 text-green-600"/> : <FiAlertCircle className="w-4 h-4 text-red-600"/>}
      </div>
      <p className="text-sm font-semibold flex-1">{msg}</p>
      <button onClick={onClose}><FiX className="w-4 h-4 opacity-50 hover:opacity-100"/></button>
    </div>
  );
}

/* ─── SECTION CARD ───────────────────────────────────────────── */
function SCard({ title, icon, action, children, accent = "blue" }) {
  const accents = {
    blue:   "bg-blue-600",
    green:  "bg-green-600",
    amber:  "bg-amber-500",
    purple: "bg-purple-600",
    slate:  "bg-slate-700",
    teal:   "bg-teal-600",
    red:    "bg-red-500",
  };
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className={`${accents[accent]} px-5 py-3.5 flex items-center justify-between`}>
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
function AddPaymentModal({ booking, onClose, onAdded }) {
  const [form,   setForm]   = useState({ amount:"", method:"Cash", note:"", paymentDate: new Date().toISOString().slice(0,10) });
  const [saving, setSaving] = useState(false);
  const [err,    setErr]    = useState("");

  const handleAdd = async () => {
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) {
      setErr("Enter a valid amount."); return;
    }
    setSaving(true);
    try {
      await bookingService.addPayment(booking.id, {
        amount:      Number(form.amount),
        method:      form.method,
        note:        form.note,
        paymentDate: form.paymentDate,
      });
      onAdded();
      onClose();
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to record payment.");
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
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:border-green-400 focus:ring-2 focus:ring-green-50 outline-none"/>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">Payment Method</label>
            <select value={form.method} onChange={e=>setForm(p=>({...p,method:e.target.value}))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:border-green-400 outline-none appearance-none cursor-pointer">
              {["Cash","Bank Transfer","UPI","Credit Card","Cheque","Online","Other"].map(m=><option key={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">Payment Date</label>
            <input type="date" value={form.paymentDate} onChange={e=>setForm(p=>({...p,paymentDate:e.target.value}))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:border-green-400 outline-none"/>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">Note (optional)</label>
            <input value={form.note} onChange={e=>setForm(p=>({...p,note:e.target.value}))}
              placeholder="e.g. First instalment"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:border-green-400 outline-none"/>
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
function AssignVendorModal({ booking, service, onClose, onAssigned }) {
  const [vendorName, setVendorName] = useState(service?.vendorName || "");
  const [vendorCost, setVendorCost] = useState(service?.vendorCost || "");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const handleAssign = async () => {
    if (!vendorName.trim()) { setErr("Vendor name is required."); return; }
    setSaving(true);
    try {
      await bookingService.assignVendor(booking.id, service.id, {
        vendorName: vendorName.trim(),
        vendorCost: Number(vendorCost) || 0,
      });
      onAssigned();
      onClose();
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to assign vendor.");
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}/>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md z-10 p-6" style={{animation:"popIn .25s ease both"}}>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
            <FiTruck className="w-5 h-5 text-blue-600"/>
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-800">Assign Vendor</h3>
            <p className="text-xs text-slate-400">Service: {service?.type || service?.serviceType}</p>
          </div>
          <button onClick={onClose} className="ml-auto w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200"><FiX className="w-4 h-4"/></button>
        </div>
        {err && <div className="bg-red-50 border border-red-200 rounded-xl px-3 py-2 text-xs text-red-600 font-semibold mb-4">{err}</div>}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">Vendor Name *</label>
            <input value={vendorName} onChange={e=>{ setVendorName(e.target.value); setErr(""); }}
              placeholder="e.g. Hotel Everest, Nepal Airlines"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:border-blue-400 focus:ring-2 focus:ring-blue-50 outline-none"/>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">Vendor Cost (₹)</label>
            <input type="number" step="0.01" min="0" value={vendorCost} onChange={e=>setVendorCost(e.target.value)}
              placeholder="0.00"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:border-blue-400 outline-none"/>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border-2 border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all">Cancel</button>
          <button onClick={handleAssign} disabled={saving}
            className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all disabled:opacity-60 flex items-center justify-center gap-2">
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

  const [booking,       setBooking]       = useState(null);
  const [loading,       setLoading]       = useState(true);
  const [toast,         setToast]         = useState(null);
  const [showAddPay,    setShowAddPay]     = useState(false);
  const [assignSvc,     setAssignSvc]      = useState(null); // service to assign vendor
  const [deletingPay,   setDeletingPay]    = useState(null);

  const showToast = useCallback((msg, type="success") => setToast({msg,type}), []);

  /* ── FETCH ── */
  const fetchBooking = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res  = await bookingService.getById(id);
      const raw  = res.data?.data ?? res.data;
      setBooking(normalizeBooking(raw));
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed to load booking.", "error");
    } finally {
      setLoading(false);
    }
  }, [id, showToast]);

  useEffect(() => { fetchBooking(); }, [fetchBooking]);

  /* ── STATUS UPDATE ── */
  const handleStatusChange = async (newStatus) => {
    try {
      await bookingService.update(booking.id, { status: newStatus });
      setBooking(p => ({ ...p, status: newStatus.toUpperCase() }));
      showToast(`Booking status updated to ${titleCase(newStatus)}.`);
    } catch {
      showToast("Failed to update status.", "error");
    }
  };

  /* ── DELETE PAYMENT ── */
  const handleDeletePayment = async (payId) => {
    try {
      await bookingService.deletePayment(booking.id, payId);
      showToast("Payment removed.");
      fetchBooking();
    } catch { showToast("Failed to remove payment.", "error"); }
    setDeletingPay(null);
  };

  /* ── LOADING ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-100 flex items-center justify-center"
        style={{fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif"}}>
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"/>
          <p className="text-slate-500 font-semibold">Loading booking details…</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-100 flex items-center justify-center"
        style={{fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif"}}>
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <p className="text-lg font-extrabold text-slate-600 mb-2">Booking Not Found</p>
          <button onClick={()=>navigate("/BookingsPage")}
            className="mt-4 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all mx-auto">
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-100"
      style={{fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        @keyframes slideIn { from{transform:translateX(110%);opacity:0} to{transform:translateX(0);opacity:1} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes popIn   { from{transform:scale(.92);opacity:0} to{transform:scale(1);opacity:1} }
      `}</style>

      {/* Modals */}
      {toast       && <Toast msg={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}
      {showAddPay  && <AddPaymentModal booking={b} onClose={()=>setShowAddPay(false)} onAdded={()=>{ showToast("Payment recorded! ✅"); fetchBooking(); }}/>}
      {assignSvc   && <AssignVendorModal booking={b} service={assignSvc} onClose={()=>setAssignSvc(null)} onAssigned={()=>{ showToast("Vendor assigned!"); fetchBooking(); }}/>}

      {/* ── PAGE HEADER ── */}
      <div className="bg-white/70 backdrop-blur-md border-b border-slate-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <button onClick={()=>navigate("/BookingsPage")}
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-all">
                <FiArrowLeft className="w-4 h-4 text-slate-600"/>
              </button>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-lg font-extrabold text-slate-800">Booking Details</h1>
                  <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-lg">{b.code}</span>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${statusStyle}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${statusDot}`}/>
                    {titleCase(b.status)}
                  </span>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${payStyle}`}>
                    💳 {titleCase(b.payStatus)}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5 hidden sm:block">
                  <span className="cursor-pointer hover:text-blue-600" onClick={()=>navigate("/")}>Home</span>
                  <span className="mx-1">/</span>
                  <span className="cursor-pointer hover:text-blue-600" onClick={()=>navigate("/BookingsPage")}>Bookings</span>
                  <span className="mx-1">/</span>
                  <span className="text-blue-600 font-bold">View</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button onClick={fetchBooking}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 hover:border-blue-300 bg-white text-slate-600 hover:text-blue-600 text-xs font-bold transition-all">
                <FiRefreshCw className={`w-3.5 h-3.5 ${loading?"animate-spin":""}`}/> Refresh
              </button>
              <button onClick={()=>navigate(`/EditBooking/${b.id}`)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all">
                <FiEdit2 className="w-3.5 h-3.5"/> Edit
              </button>
              <button onClick={()=>navigate(`/BookingsPage?invoice=${b.id}`)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 hover:border-slate-300 bg-white text-slate-600 text-xs font-bold transition-all">
                <FaReceipt className="w-3.5 h-3.5"/> Invoice
              </button>
              <button onClick={()=>navigate(`/BookingsPage?taxinvoice=${b.id}`)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-amber-200 hover:border-amber-300 bg-amber-50 text-amber-700 text-xs font-bold transition-all">
                <FaReceipt className="w-3.5 h-3.5"/> Tax Invoice
              </button>
              {b.quotation?.shareToken && (
                <button onClick={()=>window.open(`/quotation/${b.quotation.shareToken}`,"_blank")}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-green-200 hover:border-green-300 bg-green-50 text-green-700 text-xs font-bold transition-all">
                  <FiExternalLink className="w-3.5 h-3.5"/> Voucher
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
              <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-5 py-6 text-center">
                <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-3">
                  <FaPlane className="w-8 h-8 text-white"/>
                </div>
                <p className="text-2xl font-extrabold text-white tracking-widest">{b.code}</p>
                <p className="text-slate-300 text-sm mt-1">{b.customer} · {b.destination}</p>
              </div>

              {/* Status row */}
              <div className="px-5 py-3 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">Status</span>
                  <select value={b.status}
                    onChange={e=>handleStatusChange(e.target.value)}
                    className={`text-xs font-bold px-2.5 py-1 rounded-full border appearance-none cursor-pointer outline-none ${statusStyle}`}>
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
                  ["Total Payable",   b.totalPayable,   "text-blue-700 font-extrabold"],
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
                  <span className={b.payPct===100?"text-green-600 font-bold":"text-blue-600 font-bold"}>{b.payPct}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-700
                    ${b.payPct===100?"bg-gradient-to-r from-green-500 to-emerald-400":"bg-gradient-to-r from-blue-500 to-indigo-400"}`}
                    style={{width:`${b.payPct}%`}}/>
                </div>
              </div>

              {/* Action buttons */}
              <div className="px-5 pb-5 space-y-2">
                <button onClick={()=>navigate(`/EditBooking/${b.id}`)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-all shadow-sm">
                  <FiEdit2 className="w-4 h-4"/> Edit Booking
                </button>
                <button onClick={()=>setShowAddPay(true)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-bold transition-all shadow-sm">
                  <MdPayment className="w-4 h-4"/> Payments
                </button>
                <button onClick={()=>navigate(`/BookingsPage?services=${b.id}`)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-800 text-white text-sm font-bold transition-all shadow-sm">
                  <MdOutlineAssignment className="w-4 h-4"/> Services
                </button>
                <div className="grid grid-cols-3 gap-2">
                  <button onClick={()=>navigate(`/BookingsPage?invoice=${b.id}`)}
                    className="flex items-center justify-center gap-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition-all">
                    <FaReceipt className="w-3 h-3"/> Invoice
                  </button>
                  <button onClick={()=>navigate(`/BookingsPage?taxinvoice=${b.id}`)}
                    className="flex items-center justify-center gap-1 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 text-xs font-bold transition-all">
                    <FaReceipt className="w-3 h-3"/> Tax
                  </button>
                  <button onClick={()=>navigate(`/BookingsPage?voucher=${b.id}`)}
                    className="flex items-center justify-center gap-1 py-2 rounded-xl bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 text-xs font-bold transition-all">
                    <FiPrinter className="w-3 h-3"/> Voucher
                  </button>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <SCard title="Customer Information" icon={<FiUser/>} accent="teal"
              style={{animation:"fadeUp .4s ease both .1s"}}>
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
                    className="flex items-center gap-2 text-xs text-blue-600 hover:text-blue-700 font-semibold">
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
                  { label:"Customer Amount", value:fmtINR(b.customerAmount), sub:`Paid: ${fmtINR(b.paid)} · Net: ${fmtINR(b.paid-b.tcs)}`, icon:"₹", bg:"from-cyan-500 to-cyan-600", small:false },
                  { label:"Actual Vendor Costs", value:fmtINR(b.vendorCost), sub:`Original: ${fmtINR(b.vendorCost)}`, icon:"🏷️", bg:"from-amber-500 to-orange-500", small:false },
                  { label:"Net Profit", value:fmtINR(b.netProfit), sub:`Customer Amount - Vendor Costs - GST · (${b.netMargin}% · ${fmtINR(b.paid-b.vendorCost-b.gst)})`, icon:"📈", bg:"from-green-500 to-emerald-600", small:false },
                  { label:"Profit Margin", value:`${b.netMargin}%`, sub:`Based on Customer Amount`, icon:"📊", bg:"from-blue-600 to-blue-700", small:true },
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
            <SCard title="Travel Information" icon={<FaPlane/>} accent="blue">
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
            <SCard title="Booking Services" icon={<MdOutlineAssignment/>} accent="slate"
              action={
                <button onClick={()=>setAssignSvc({ id:"all", type:"Service" })}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all">
                  <FiPlus className="w-3 h-3"/> Assign Vendor
                </button>
              }>
              {(b.bookingServices?.length > 0 || b.services?.length > 0) ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm min-w-[500px]">
                    <thead className="bg-slate-50 border-b border-slate-100">
                      <tr>
                        {["Service Type","Vendor","Vendor Cost","Cancellation Charges","Refunded","Status","Reference"].map(h=>(
                          <th key={h} className="px-3 py-2.5 text-left text-[10px] font-extrabold text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {(b.bookingServices?.length > 0 ? b.bookingServices : b.services.map((s,i)=>({
                        id:i, type:s, serviceType:s,
                        vendorName:null, vendorCost:0, cancellationCharge:0,
                        refunded:0, status:"PENDING", reference:null
                      }))).map((svc, i) => (
                        <tr key={svc.id||i} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-2">
                              <span className="text-base">{SVC_ICON[svc.serviceType||svc.type] || "📋"}</span>
                              <span className="font-semibold text-slate-700 text-sm">{svc.serviceType||svc.type||"—"}</span>
                            </div>
                          </td>
                          <td className="px-3 py-3">
                            {svc.vendorName
                              ? <span className="text-sm text-slate-700 font-medium">{svc.vendorName}</span>
                              : <button onClick={()=>setAssignSvc(svc)}
                                  className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 hover:underline">
                                  No vendor assigned
                                </button>
                            }
                          </td>
                          <td className="px-3 py-3">
                            <span className={`text-sm font-bold ${(svc.vendorCost||0)>0?"text-slate-700":"text-slate-400"}`}>
                              {fmtINR(svc.vendorCost||0)}
                            </span>
                          </td>
                          <td className="px-3 py-3">
                            <span className="text-sm text-slate-500">{fmtINR(svc.cancellationCharge||0)}</span>
                          </td>
                          <td className="px-3 py-3">
                            <span className="text-sm text-slate-500">{fmtINR(svc.refunded||0)}</span>
                          </td>
                          <td className="px-3 py-3">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${STATUS_STYLE[(svc.status||"PENDING").toUpperCase()] || STATUS_STYLE.PENDING}`}>
                              {titleCase(svc.status||"Pending")}
                            </span>
                          </td>
                          <td className="px-3 py-3">
                            <span className="text-sm text-slate-400">{svc.reference||"N/A"}</span>
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
              action={
                <button onClick={()=>setShowAddPay(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all">
                  <FiPlus className="w-3 h-3"/> Add Payment
                </button>
              }>
              {b.payments?.length > 0 ? (
                <div className="space-y-2">
                  {b.payments.map((pay, i) => (
                    <div key={pay.id||i} className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3 border border-slate-100 group">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                          <FiCheck className="w-4 h-4 text-green-600"/>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{fmtINR(pay.amount)}</p>
                          <p className="text-xs text-slate-400">{pay.method} · {fmtDate(pay.paymentDate||pay.createdAt)}</p>
                          {pay.note && <p className="text-xs text-slate-400 italic">{pay.note}</p>}
                        </div>
                      </div>
                      {deletingPay===pay.id ? (
                        <div className="flex items-center gap-1.5">
                          <button onClick={()=>handleDeletePayment(pay.id)}
                            className="text-xs font-bold text-red-600 px-2 py-1 rounded-lg bg-red-50 border border-red-200 hover:bg-red-100">Delete</button>
                          <button onClick={()=>setDeletingPay(null)}
                            className="text-xs font-bold text-slate-500 px-2 py-1 rounded-lg bg-white border border-slate-200">Cancel</button>
                        </div>
                      ) : (
                        <button onClick={()=>setDeletingPay(pay.id)}
                          className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                          <FiTrash2 className="w-3 h-3"/>
                        </button>
                      )}
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
                  <button onClick={()=>setShowAddPay(true)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-xs font-bold transition-all mx-auto">
                    <FiPlus className="w-3.5 h-3.5"/> Record Payment
                  </button>
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
                            className="text-blue-600 hover:underline flex items-center gap-1">
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
            <SCard title="Booking Reminders" icon={<FiBell/>} accent="amber"
              action={
                <button onClick={()=>navigate(`/BookingReminders?booking=${b.id}`)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all">
                  View All <FiExternalLink className="w-3 h-3"/>
                </button>
              }>
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
                          <tr key={rem.id||i} className="hover:bg-slate-50/50">
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