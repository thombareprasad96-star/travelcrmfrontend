// src/bookings/BookingPayments.jsx
// ─────────────────────────────────────────────────────────────
// Booking Payments page — matches screenshot exactly
// Route: /BookingPayments/:id
// Layout: Summary bar → Left (Add Payment form) + Right (History + Summary cards)
// ─────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import bookingService from "../api/bookingService";
import {
  FiCheck, FiX, FiAlertCircle, FiPlus, FiTrash2,
  FiArrowLeft, FiRefreshCw, FiCalendar, FiCreditCard,
  FiDollarSign, FiHash,
} from "react-icons/fi";
import { MdPayment } from "react-icons/md";

/* ─── CONSTANTS ──────────────────────────────────────────────── */
const PAYMENT_TYPES   = ["Advance","Instalment","Final Payment","Refund","Adjustment","Other"];
const PAYMENT_METHODS = ["Cash","Bank Transfer","UPI","Credit Card","Debit Card","Cheque","Online","Wallet","Other"];
const PAYMENT_STATUS  = ["Completed","Pending","Failed","Refunded"];

const STATUS_CFG = {
  CONFIRMED:  { bg:"bg-green-500",  text:"text-white" },
  PENDING:    { bg:"bg-amber-400",  text:"text-white" },
  CANCELLED:  { bg:"bg-red-500",    text:"text-white" },
  COMPLETED:  { bg:"bg-blue-500",   text:"text-white" },
  REFUNDED:   { bg:"bg-purple-500", text:"text-white" },
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

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════ */
export default function BookingPayments() {
  const { id }    = useParams();
  const navigate  = useNavigate();

  /* ── State ── */
  const [booking,   setBooking]   = useState(null);
  const [payments,  setPayments]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [saving,    setSaving]    = useState(false);
  const [toast,     setToast]     = useState(null);
  const [deleting,  setDeleting]  = useState(null);

  /* Payment form */
  const emptyForm = {
    paymentType:   "",
    amount:        "",
    paymentMethod: "",
    paymentDate:   new Date().toISOString().slice(0,10),
    paymentStatus: "Completed",
    reference:     "",
    notes:         "",
  };
  const [form,   setForm]   = useState(emptyForm);
  const [errors, setErrors] = useState({});

  const showToast = useCallback((msg, type="success") => setToast({msg,type}), []);
  const set       = (k, v) => { setForm(p=>({...p,[k]:v})); setErrors(p=>({...p,[k]:""})); };

  /* ── FETCH ── */
  const fetchData = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await bookingService.getById(id);
      const b   = res.data?.data ?? res.data;

      setBooking({
        id:             b.publicId || b.id,
        code:           b.bookingCode || b.code || "—",
        customer:       b.customerNameSnapshot || b.customerName || "—",
        customerAmount: Number(b.customerAmount) || 0,
        totalPayable:   Number(b.totalPayable)   || 0,
        paidAmount:     Number(b.paidAmount)     || 0,
        vendorCost:     Number(b.vendorCost)     || 0,
        gst:            Number(b.gst)            || 0,
        tcs:            Number(b.tcs)            || 0,
        status:         (b.status || "PENDING").toUpperCase(),
        paymentStatus:  (b.paymentStatus || "UNPAID").toUpperCase(),
      });

      const payList = Array.isArray(b.payments) ? b.payments : [];
      setPayments(payList);
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed to load booking.", "error");
    } finally {
      setLoading(false);
    }
  }, [id, showToast]);

  useEffect(() => { fetchData(); }, [fetchData]);

  /* ── Computed ── */
  const totalReceived = payments
    .filter(p => (p.paymentStatus||p.status||"").toLowerCase() !== "refunded")
    .reduce((s,p) => s + (Number(p.amount)||0), 0);
  const totalRefunded = payments
    .filter(p => (p.paymentStatus||p.status||"").toLowerCase() === "refunded")
    .reduce((s,p) => s + (Number(p.amount)||0), 0);
  const netReceived   = totalReceived - totalRefunded;
  const dueAmount     = (booking?.totalPayable || 0) - totalReceived;

  /* ── VALIDATE ── */
  const validate = () => {
    const e = {};
    if (!form.paymentType)   e.paymentType   = "Select payment type";
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0)
      e.amount = "Enter a valid amount";
    if (!form.paymentMethod) e.paymentMethod = "Select payment method";
    if (!form.paymentDate)   e.paymentDate   = "Select payment date";
    if (!form.paymentStatus) e.paymentStatus = "Select status";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ── ADD PAYMENT ── */
  const handleAddPayment = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      await bookingService.addPayment(booking.id, {
        paymentType:   form.paymentType,
        amount:        Number(form.amount),
        paymentMethod: form.paymentMethod,
        paymentDate:   form.paymentDate,
        paymentStatus: form.paymentStatus,
        reference:     form.reference || null,
        notes:         form.notes     || null,
      });
      showToast("Payment added successfully! ✅");
      setForm(emptyForm);
      fetchData(); // refresh
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed to add payment.", "error");
    } finally {
      setSaving(false);
    }
  };

  /* ── DELETE PAYMENT ── */
  const handleDelete = async (payId) => {
    try {
      await bookingService.deletePayment(booking.id, payId);
      showToast("Payment removed.");
      fetchData();
    } catch {
      showToast("Failed to remove payment.", "error");
    }
    setDeleting(null);
  };

  /* ── Loading / Error ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-100 flex items-center justify-center"
        style={{fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif"}}>
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"/>
          <p className="text-slate-500 font-semibold">Loading payment details…</p>
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
          <button onClick={()=>navigate("/Allbookings")}
            className="mt-4 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm mx-auto">
            <FiArrowLeft className="w-4 h-4"/> Back to Bookings
          </button>
        </div>
      </div>
    );
  }

  const sc = STATUS_CFG[booking.status] || STATUS_CFG.PENDING;

  const inputCls = (err) =>
    `w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium outline-none transition-all
     ${err
       ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-2 focus:ring-red-50"
       : "border-slate-200 bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-50 hover:border-slate-300"}`;

  const selectCls = (err) => inputCls(err) + " appearance-none cursor-pointer pr-9";

  /* ─── RENDER ──────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-100"
      style={{fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        @keyframes slideIn { from{transform:translateX(110%);opacity:0} to{transform:translateX(0);opacity:1} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        select { -webkit-appearance:none; appearance:none; }
      `}</style>

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}

      {/* ── PAGE HEADER ── */}
      <div className="bg-white/70 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <button onClick={()=>navigate(-1)}
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-all">
                <FiArrowLeft className="w-4 h-4 text-slate-600"/>
              </button>
              <div>
                <h1 className="text-lg font-extrabold text-slate-800">Booking Payments</h1>
                <p className="text-xs text-slate-400 mt-0.5 hidden sm:block">
                  <span className="cursor-pointer hover:text-blue-600" onClick={()=>navigate("/")}>Home</span>
                  <span className="mx-1 text-slate-300">/</span>
                  <span className="cursor-pointer hover:text-blue-600" onClick={()=>navigate("/Allbookings")}>Bookings</span>
                  <span className="mx-1 text-slate-300">/</span>
                  <span className="cursor-pointer hover:text-blue-600" onClick={()=>navigate(`/BookingDetails/${id}`)}>View Booking</span>
                  <span className="mx-1 text-slate-300">/</span>
                  <span className="text-blue-600 font-bold">Payments</span>
                </p>
              </div>
            </div>
            <button onClick={fetchData}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-blue-600 text-xs font-bold transition-all">
              <FiRefreshCw className={`w-3.5 h-3.5 ${loading?"animate-spin":""}`}/> Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-5 space-y-5">

        {/* ══════════════════════════════════════════════════════
            BOOKING PAYMENT SUMMARY BAR (cyan gradient like screenshot)
        ══════════════════════════════════════════════════════ */}
        <div className="bg-gradient-to-r from-cyan-600 to-teal-500 rounded-2xl px-5 py-4 shadow-lg"
          style={{animation:"fadeUp .4s ease both"}}>
          <div className="flex items-center gap-2 mb-3">
            <FiAlertCircle className="w-4 h-4 text-white/80"/>
            <h2 className="text-sm font-extrabold text-white">Booking Payment Summary</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-2 gap-x-6">
            {/* Col 1 */}
            <div>
              <p className="text-white/80 text-xs font-medium">Booking Code: <span className="font-extrabold text-white">{booking.code}</span></p>
              <p className="text-white/80 text-xs font-medium">Customer: <span className="font-bold text-white">{booking.customer}</span></p>
            </div>
            {/* Col 2 */}
            <div>
              <p className="text-white/80 text-xs font-medium">Customer Amount: <span className="font-extrabold text-white">{fmtINR(booking.customerAmount)}</span></p>
              <p className="text-white/80 text-xs font-medium">Total Payable: <span className="font-extrabold text-white">{fmtINR(booking.totalPayable)}</span></p>
            </div>
            {/* Col 3 */}
            <div>
              <p className="text-white/80 text-xs font-medium flex items-center gap-1.5">
                Status:
                <span className={`${sc.bg} ${sc.text} text-xs font-bold px-2 py-0.5 rounded-full`}>
                  {titleCase(booking.status)}
                </span>
              </p>
              <p className="text-white/80 text-xs font-medium">Paid Amount: <span className="font-bold text-white">{fmtINR(totalReceived)}</span></p>
            </div>
            {/* Col 4 */}
            <div>
              <p className="text-white/80 text-xs font-medium">Due Amount: <span className="font-extrabold text-yellow-200">{fmtINR(Math.max(0,dueAmount))}</span></p>
              <p className="text-white/80 text-xs font-medium">Total Refunds: <span className="font-bold text-white">{fmtINR(totalRefunded)}</span></p>
              <p className="text-white/80 text-xs font-medium">Net Received: <span className="font-bold text-white">{fmtINR(netReceived)}</span></p>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════
            MAIN CONTENT — LEFT FORM + RIGHT HISTORY
        ══════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-5">

          {/* ── LEFT: ADD PAYMENT FORM ── */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
            style={{animation:"fadeUp .4s ease both .1s"}}>
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-3.5">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <FiPlus className="w-4 h-4"/> Add Payment
              </h3>
            </div>
            <div className="p-5 space-y-4">

              {/* Payment Type */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">
                  Payment Type <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <select value={form.paymentType} onChange={e=>set("paymentType",e.target.value)}
                    className={selectCls(errors.paymentType)}>
                    <option value="">Select Payment Type</option>
                    {PAYMENT_TYPES.map(t=><option key={t}>{t}</option>)}
                  </select>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] pointer-events-none">▼</span>
                </div>
                {errors.paymentType && <p className="text-xs text-red-500 font-semibold mt-1">{errors.paymentType}</p>}
              </div>

              {/* Amount */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">
                  Amount <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-bold">₹</span>
                  <input type="number" step="0.01" min="0"
                    value={form.amount}
                    onChange={e=>set("amount",e.target.value)}
                    placeholder="0.00"
                    className={inputCls(errors.amount) + " pl-8"}/>
                </div>
                <p className="text-xs text-slate-400 mt-1">Due Amount: {fmtINR(Math.max(0,dueAmount))}</p>
                {errors.amount && <p className="text-xs text-red-500 font-semibold mt-0.5">{errors.amount}</p>}
              </div>

              {/* Payment Method */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">
                  Payment Method <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <select value={form.paymentMethod} onChange={e=>set("paymentMethod",e.target.value)}
                    className={selectCls(errors.paymentMethod)}>
                    <option value="">Select Payment Method</option>
                    {PAYMENT_METHODS.map(m=><option key={m}>{m}</option>)}
                  </select>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] pointer-events-none">▼</span>
                </div>
                {errors.paymentMethod && <p className="text-xs text-red-500 font-semibold mt-1">{errors.paymentMethod}</p>}
              </div>

              {/* Payment Date */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">
                  Payment Date <span className="text-red-400">*</span>
                </label>
                <input type="date" value={form.paymentDate}
                  onChange={e=>set("paymentDate",e.target.value)}
                  className={inputCls(errors.paymentDate)}/>
                {errors.paymentDate && <p className="text-xs text-red-500 font-semibold mt-1">{errors.paymentDate}</p>}
              </div>

              {/* Payment Status */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">
                  Payment Status <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <select value={form.paymentStatus} onChange={e=>set("paymentStatus",e.target.value)}
                    className={selectCls(errors.paymentStatus)}>
                    {PAYMENT_STATUS.map(s=><option key={s}>{s}</option>)}
                  </select>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] pointer-events-none">▼</span>
                </div>
                {errors.paymentStatus && <p className="text-xs text-red-500 font-semibold mt-1">{errors.paymentStatus}</p>}
              </div>

              {/* Reference Number */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">Reference Number</label>
                <input value={form.reference}
                  onChange={e=>set("reference",e.target.value)}
                  placeholder="Enter reference number"
                  className={inputCls(false)}/>
              </div>

              {/* Notes */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">Notes</label>
                <textarea value={form.notes}
                  onChange={e=>set("notes",e.target.value)}
                  placeholder="Additional payment notes..."
                  rows={3}
                  className={inputCls(false) + " resize-none"}/>
              </div>

              {/* Submit */}
              <button onClick={handleAddPayment} disabled={saving}
                className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl
                  bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm
                  shadow-md shadow-blue-200 transition-all disabled:opacity-60">
                {saving
                  ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/> Adding…</>
                  : <><FiPlus className="w-4 h-4"/> Add Payment</>
                }
              </button>
            </div>
          </div>

          {/* ── RIGHT: PAYMENT HISTORY + SUMMARY ── */}
          <div className="space-y-5">

            {/* Payment History */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
              style={{animation:"fadeUp .4s ease both .15s"}}>
              <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-slate-700 flex items-center gap-2">
                  <FiCreditCard className="w-4 h-4 text-blue-500"/> Payment History
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold bg-green-100 text-green-700 px-2.5 py-1 rounded-full">
                    Received: {fmtINR(totalReceived)}
                  </span>
                  <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full">
                    Net: {fmtINR(netReceived)}
                  </span>
                </div>
              </div>
              <div className="p-5">
                {payments.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-[500px]">
                      <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                          {["#","Date","Type","Amount","Method","Status","Reference","Notes",""].map(h=>(
                            <th key={h} className="px-3 py-2.5 text-left text-[10px] font-extrabold text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {payments.map((pay, i) => {
                          const isRefund = (pay.paymentType||"").toLowerCase() === "refund"
                            || (pay.paymentStatus||pay.status||"").toLowerCase() === "refunded";
                          return (
                            <tr key={pay.id||i} className="hover:bg-slate-50/50 group transition-colors"
                              style={{animation:`fadeUp .3s ease both ${i*30}ms`}}>
                              <td className="px-3 py-3 text-xs text-slate-400 font-mono">{i+1}</td>
                              <td className="px-3 py-3 text-xs font-semibold text-slate-700 whitespace-nowrap">{fmtDate(pay.paymentDate||pay.createdAt)}</td>
                              <td className="px-3 py-3">
                                <span className="text-xs font-bold text-slate-600">{pay.paymentType||"—"}</span>
                              </td>
                              <td className="px-3 py-3">
                                <span className={`text-sm font-extrabold ${isRefund?"text-red-600":"text-green-600"}`}>
                                  {isRefund?"-":""}{fmtINR(pay.amount)}
                                </span>
                              </td>
                              <td className="px-3 py-3 text-xs text-slate-500">{pay.paymentMethod||pay.method||"—"}</td>
                              <td className="px-3 py-3">
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full
                                  ${(pay.paymentStatus||pay.status||"").toLowerCase()==="completed"
                                    ?"bg-green-100 text-green-700"
                                    :(pay.paymentStatus||pay.status||"").toLowerCase()==="pending"
                                    ?"bg-amber-100 text-amber-700"
                                    :(pay.paymentStatus||pay.status||"").toLowerCase()==="refunded"
                                    ?"bg-purple-100 text-purple-700"
                                    :"bg-red-100 text-red-700"}`}>
                                  {titleCase(pay.paymentStatus||pay.status||"Pending")}
                                </span>
                              </td>
                              <td className="px-3 py-3 text-xs text-slate-400 font-mono">{pay.reference||"—"}</td>
                              <td className="px-3 py-3 text-xs text-slate-400 max-w-[120px] truncate">{pay.notes||"—"}</td>
                              <td className="px-3 py-3">
                                {deleting === (pay.id||i) ? (
                                  <div className="flex items-center gap-1">
                                    <button onClick={()=>handleDelete(pay.id)}
                                      className="text-xs font-bold text-red-600 px-2 py-1 rounded-lg bg-red-50 border border-red-200 hover:bg-red-100">Yes</button>
                                    <button onClick={()=>setDeleting(null)}
                                      className="text-xs font-bold text-slate-500 px-2 py-1 rounded-lg bg-white border border-slate-200">No</button>
                                  </div>
                                ) : (
                                  <button onClick={()=>setDeleting(pay.id||i)}
                                    className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 flex items-center justify-center
                                      opacity-0 group-hover:opacity-100 transition-all">
                                    <FiTrash2 className="w-3 h-3"/>
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <div className="text-4xl mb-3">💳</div>
                    <p className="text-sm text-slate-400 font-medium">No payments recorded yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Summary — 4 colored cards like screenshot */}
            <div style={{animation:"fadeUp .4s ease both .25s"}}>
              <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-3">Payment Summary</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label:"Total Payable", value:fmtINR(booking.totalPayable), icon:"₹",  bg:"from-blue-500 to-blue-600"   },
                  { label:"Paid",          value:fmtINR(totalReceived),        icon:"💰", bg:"from-green-500 to-emerald-500" },
                  { label:"Refunded",      value:fmtINR(totalRefunded),        icon:"↩️",  bg:"from-amber-500 to-yellow-500"  },
                  { label:"Due",           value:fmtINR(Math.max(0,dueAmount)),icon:"📋", bg:"from-red-500 to-rose-500"      },
                ].map((card, i) => (
                  <div key={card.label}
                    className={`bg-gradient-to-br ${card.bg} rounded-2xl p-4 text-white shadow-lg relative overflow-hidden`}
                    style={{animation:`fadeUp .4s ease both ${i*50+200}ms`}}>
                    <div className="absolute -right-3 -bottom-3 text-white/15 text-6xl pointer-events-none select-none">{card.icon}</div>
                    <p className="text-xs font-bold text-white/80 mb-1 truncate">{card.label}</p>
                    <p className="text-xl font-extrabold text-white leading-tight">{card.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}