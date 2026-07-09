// src/bookings/BookingServices.jsx
// Route: /BookingServices/:id
// Matches all 4 screenshots exactly

import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import bookingService from "../api/bookingService";
import {
  FiPlus, FiX, FiCheck, FiAlertCircle, FiArrowLeft, FiRefreshCw,
  FiEdit2, FiTrash2, FiEye, FiDownload, FiExternalLink,
  FiChevronDown, FiCalendar, FiHash, FiCreditCard,
} from "react-icons/fi";
import { FaWhatsapp, FaHotel, FaPlane, FaCar, FaShip, FaPassport, FaUmbrellaBeach } from "react-icons/fa";
import { MdOutlineAssignment } from "react-icons/md";

/* ─── CONSTANTS ──────────────────────────────────────────────── */
const SERVICE_TYPES = ["Hotel","Flight","Transport","Vehicle","Cruise","Sightseeing","Visa","Insurance","Passport","Other"];
const SVC_ICON = { Hotel:<FaHotel/>, Flight:<FaPlane/>, Transport:<FaCar/>, Vehicle:<FaCar/>, Cruise:<FaShip/>, Sightseeing:<FaUmbrellaBeach/>, Visa:<FaPassport/>, Insurance:"🛡️", Passport:<FaPassport/> };
const SVC_COLOR = { Hotel:"bg-blue-500", Flight:"bg-indigo-500", Transport:"bg-teal-500", Vehicle:"bg-teal-500", Cruise:"bg-purple-500", Sightseeing:"bg-green-500", Visa:"bg-amber-500", Insurance:"bg-slate-500", Passport:"bg-rose-500", Other:"bg-slate-400" };
const STATUS_STYLE = {
  Paid:"bg-green-100 text-green-700", Partial:"bg-amber-100 text-amber-700",
  Unpaid:"bg-rose-100 text-rose-700", Pending:"bg-amber-100 text-amber-700",
  Confirmed:"bg-green-100 text-green-700", Cancelled:"bg-red-100 text-red-600",
};

const fmtINR = n => n!=null ? "₹"+Number(n).toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2}) : "₹0.00";
const fmtDate = d => d ? new Date(d).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}) : "—";
const titleCase = s => s ? s.charAt(0).toUpperCase()+s.slice(1).toLowerCase() : "—";

/* ─── TOAST ──────────────────────────────────────────────────── */
function Toast({msg,type,onClose}){
  useEffect(()=>{const t=setTimeout(onClose,3500);return()=>clearTimeout(t)},[onClose]);
  const ok=type==="success";
  return(
    <div className={`fixed top-5 right-5 z-[999] flex items-center gap-3 px-4 py-3.5 rounded-2xl border shadow-2xl max-w-sm ${ok?"bg-green-50 border-green-200 text-green-800":"bg-red-50 border-red-200 text-red-800"}`} style={{animation:"slideIn .3s ease both"}}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${ok?"bg-green-100":"bg-red-100"}`}>{ok?<FiCheck className="w-4 h-4 text-green-600"/>:<FiAlertCircle className="w-4 h-4 text-red-600"/>}</div>
      <p className="text-sm font-semibold flex-1">{msg}</p>
      <button onClick={onClose}><FiX className="w-4 h-4 opacity-50 hover:opacity-100"/></button>
    </div>
  );
}

/* ─── SERVICE DETAILS MODAL (Screenshot 3) ───────────────────── */
function ServiceDetailModal({ svc, booking, onClose }) {
  if(!svc) return null;
  const profit = (booking?.customerAmount||0) - (Number(svc.vendorCost)||0);
  const profitPct = (booking?.customerAmount||0) > 0 ? ((profit/(booking.customerAmount))*100).toFixed(1) : 0;
  return(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}/>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg z-10 overflow-hidden" style={{animation:"popIn .25s ease both"}}>
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-base font-extrabold text-slate-800">Service Details — {svc.serviceType||svc.type}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center"><FiX className="w-4 h-4"/></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {[["Service Type",svc.serviceType||svc.type],["Confirmation Status",<span className={`text-xs font-bold px-2 py-0.5 rounded-full ${STATUS_STYLE[svc.vendorStatus]||STATUS_STYLE.Pending}`}>{svc.vendorStatus||"Pending"}</span>],
              ["Vendor Cost",fmtINR(svc.vendorCost)],["Customer Amount",fmtINR(booking?.customerAmount)],
              ["Service Amount",fmtINR(svc.serviceAmount||booking?.customerAmount)],["Sequence",svc.sequence||"—"],
              ["Added",fmtDate(svc.createdAt)]
            ].map(([l,v])=>(
              <div key={l}><p className="text-xs text-slate-400 font-medium">{l}</p><p className="text-sm font-bold text-slate-700 mt-0.5">{typeof v==="string"||typeof v==="number"?v:v}</p></div>
            ))}
          </div>
          {svc.details && <div><p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Service Details</p><p className="text-sm text-slate-700 bg-slate-50 rounded-xl p-3 border border-slate-100">{svc.details}</p></div>}
          <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-4">
            <p className="text-xs font-extrabold text-cyan-700 mb-2">Profit Calculation (Current Totals):</p>
            <div className="space-y-1 text-sm">
              <p className="text-cyan-800">Customer Amount: <span className="font-bold">{fmtINR(booking?.customerAmount)}</span></p>
              <p className="text-cyan-800">Service Amount: <span className="font-bold">{fmtINR(svc.serviceAmount||booking?.customerAmount)}</span></p>
              <p className="text-cyan-800">Total Vendor Costs: <span className="font-bold">{fmtINR(svc.vendorCost)}</span></p>
              <p className="text-cyan-800 font-extrabold">Total Profit: {fmtINR(profit)} ({profitPct}%)</p>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-slate-100 flex justify-end">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-bold transition-all">Close</button>
        </div>
      </div>
    </div>
  );
}

/* ─── PAYMENT HISTORY MODAL (Screenshot 2) ───────────────────── */
function PaymentHistoryModal({ svc, onClose }) {
  if(!svc) return null;
  const payments = svc.payments || [];
  return(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}/>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md z-10 overflow-hidden" style={{animation:"popIn .25s ease both"}}>
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-base font-extrabold text-slate-800">Payment History</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center"><FiX className="w-4 h-4"/></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            {[["Type",svc.serviceType||svc.type],["Vendor",svc.vendorName||"N/A"],["Cost",fmtINR(svc.vendorCost)],["Paid",fmtINR(svc.vendorPaid||0)],["Balance",fmtINR((Number(svc.vendorCost)||0)-(Number(svc.vendorPaid)||0))]
            ].map(([l,v])=>(
              <div key={l} className="flex items-center justify-between"><span className="text-sm text-slate-500 font-medium">{l}:</span><span className="text-sm font-bold text-slate-700">{v}</span></div>
            ))}
          </div>
          {payments.length > 0 ? (
            <div className="space-y-2">{payments.map((p,i)=>(
              <div key={i} className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
                <div><p className="text-sm font-bold text-slate-700">{fmtINR(p.amount)}</p><p className="text-xs text-slate-400">{p.method} · {fmtDate(p.paymentDate)}</p></div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${STATUS_STYLE[p.status]||STATUS_STYLE.Pending}`}>{p.status||"Completed"}</span>
              </div>
            ))}</div>
          ) : (
            <div className="bg-cyan-500 text-white rounded-xl px-4 py-3 text-sm font-semibold">No payments recorded for this service</div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── ADD/EDIT SERVICE FORM (Screenshot 4 — sidebar) ─────────── */
function ServiceForm({ booking, editSvc, onClose, onSaved, showToast }) {
  const isEdit = !!editSvc;
  const [form, setForm] = useState({
    serviceType: editSvc?.serviceType || editSvc?.type || "",
    vendorName:  editSvc?.vendorName || "",
    vendorCost:  editSvc?.vendorCost || "0",
    sequence:    editSvc?.sequence || (booking?.services?.length||0)+1,
    details:     editSvc?.details || "",
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const set = (k,v) => { setForm(p=>({...p,[k]:v})); setErrors(p=>({...p,[k]:""})); };

  const validate = () => {
    const e = {};
    if(!form.serviceType) e.serviceType = "Select service type";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if(!validate()) return;
    setSaving(true);
    try {
      if(isEdit) {
        await bookingService.updateService(booking.id, editSvc.id||editSvc.publicId, {
          serviceType: form.serviceType, vendorName: form.vendorName||null,
          vendorCost: Number(form.vendorCost)||0, sequence: Number(form.sequence)||1,
          details: form.details||null,
        });
        showToast("Service updated!");
      } else {
        await bookingService.addService(booking.id, {
          serviceType: form.serviceType, vendorName: form.vendorName||null,
          vendorCost: Number(form.vendorCost)||0, sequence: Number(form.sequence)||1,
          details: form.details||null,
        });
        showToast("Service added!");
      }
      onSaved();
      onClose();
    } catch(e) {
      showToast(e?.response?.data?.message || "Failed to save service.", "error");
    } finally { setSaving(false); }
  };

  const inputCls = err => `w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium outline-none transition-all ${err?"border-red-300 bg-red-50":"border-slate-200 bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-50 hover:border-slate-300"}`;
  const selectCls = err => inputCls(err)+" appearance-none cursor-pointer pr-9";

  return(
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden" style={{animation:"fadeUp .3s ease both"}}>
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-3.5 flex items-center justify-between">
        <h3 className="text-sm font-extrabold text-white flex items-center gap-2"><FiPlus className="w-4 h-4"/> {isEdit?"Edit Service":"Add New Service"}</h3>
        <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center"><FiX className="w-3.5 h-3.5"/></button>
      </div>
      <div className="p-5 space-y-4">
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">Service Type <span className="text-red-400">*</span></label>
          <div className="relative">
            <select value={form.serviceType} onChange={e=>set("serviceType",e.target.value)} className={selectCls(errors.serviceType)}>
              <option value="">Select Service Type</option>
              {SERVICE_TYPES.map(t=><option key={t}>{t}</option>)}
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] pointer-events-none">▼</span>
          </div>
          {errors.serviceType && <p className="text-xs text-red-500 font-semibold mt-1">{errors.serviceType}</p>}
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">Vendor</label>
          <input value={form.vendorName} onChange={e=>set("vendorName",e.target.value)} placeholder="Select Vendor (Optional)" className={inputCls(false)}/>
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">Vendor Cost <span className="text-red-400 text-[10px]">(Your Cost)</span></label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-bold">₹</span>
            <input type="number" step="0.01" min="0" value={form.vendorCost} onChange={e=>set("vendorCost",e.target.value)} className={inputCls(false)+" pl-8"}/>
          </div>
          <p className="text-xs text-slate-400 mt-1">What you pay to vendor</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 space-y-1">
          <p className="text-xs font-bold text-amber-700">Note: Total payable includes TCS</p>
          <p className="text-xs text-amber-600">Customer Amount: {fmtINR(booking?.customerAmount)}</p>
          <p className="text-xs text-amber-600">GST (0%): {fmtINR(booking?.gst||0)}</p>
          <p className="text-xs text-amber-700 font-bold">Net Profit Formula: Customer Amount - GST - Vendor Costs</p>
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">Sequence</label>
          <input type="number" min="1" value={form.sequence} onChange={e=>set("sequence",e.target.value)} className={inputCls(false)}/>
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">Service Details</label>
          <textarea value={form.details} onChange={e=>set("details",e.target.value)} rows={3} placeholder="Enter service details, requirements, special instructions..." className={inputCls(false)+" resize-none"}/>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-md shadow-blue-200 transition-all disabled:opacity-60">
          {saving?<><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/>{isEdit?"Updating…":"Adding…"}</>:<><FiPlus className="w-4 h-4"/>{isEdit?"Update Service":"Add Service"}</>}
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════ */
export default function BookingServices() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking,      setBooking]      = useState(null);
  const [services,     setServices]     = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [toast,        setToast]        = useState(null);
  const [showForm,     setShowForm]     = useState(false);
  const [editSvc,      setEditSvc]      = useState(null);
  const [detailSvc,    setDetailSvc]    = useState(null);
  const [payHistSvc,   setPayHistSvc]   = useState(null);
  const [deleting,     setDeleting]     = useState(null);
  const [selected,     setSelected]     = useState(new Set());

  const showToastFn = useCallback((msg,type="success")=>setToast({msg,type}),[]);

  const fetchData = useCallback(async () => {
    if(!id) return;
    setLoading(true);
    try {
      const res = await bookingService.getById(id);
      const b = res.data?.data ?? res.data;
      setBooking({
        id: b.publicId||b.id, code: b.bookingCode||b.code||"—",
        title: b.title || `${b.customerNameSnapshot||b.customerName} - ${b.destinationSnapshot||b.destination}`,
        customer: b.customerNameSnapshot||b.customerName||"—",
        customerAmount: Number(b.customerAmount)||0,
        vendorCost: Number(b.vendorCost)||0,
        gst: Number(b.gst)||0, tcs: Number(b.tcs)||0,
        totalPayable: Number(b.totalPayable)||0,
        status: b.status||"PENDING",
        travelDate: b.travelDate, travelEndDate: b.travelEndDate||b.returnDate,
      });
      const svcList = Array.isArray(b.bookingServices) ? b.bookingServices
                    : Array.isArray(b.services) ? b.services.map((s,i)=>({
                        id:i, serviceType:typeof s==="string"?s:s.serviceType||s.type,
                        details:typeof s==="string"?"":s.details||s.description||"",
                        vendorName:s.vendorName||null, vendorCost:Number(s.vendorCost)||0,
                        vendorPaid:Number(s.vendorPaid)||0, balanceDue:0,
                        paymentDueDate:null, paymentStatus:s.paymentStatus||"Paid",
                        vendorStatus:s.vendorStatus||"Pending", reference:s.reference||null,
                        sequence:i+1, createdAt:s.createdAt, payments:s.payments||[],
                      })) : [];
      setServices(svcList);
    } catch(err) {
      showToastFn(err?.response?.data?.message||"Failed to load booking.","error");
    } finally { setLoading(false); }
  },[id,showToastFn]);

  useEffect(()=>{fetchData()},[fetchData]);

  const handleDelete = async (svcId) => {
    try {
      await bookingService.deleteService(booking.id, svcId);
      showToastFn("Service removed.");
      fetchData();
    } catch { showToastFn("Failed to remove service.","error"); }
    setDeleting(null);
  };

  // Summary calculations
  const totalVendorCost = services.reduce((s,sv)=>s+(Number(sv.vendorCost)||0),0);
  const totalProfit = (booking?.customerAmount||0) - totalVendorCost;

  const allSelected = services.length>0 && services.every(s=>selected.has(s.id));
  const toggleAll = () => { if(allSelected){setSelected(new Set())}else{setSelected(new Set(services.map(s=>s.id)))} };

  if(loading) return(
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-100 flex items-center justify-center" style={{fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif"}}>
      <div className="text-center"><div className="w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"/><p className="text-slate-500 font-semibold">Loading services…</p></div>
    </div>
  );

  return(
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-100" style={{fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        @keyframes slideIn{from{transform:translateX(110%);opacity:0}to{transform:translateX(0);opacity:1}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes popIn{from{transform:scale(.92);opacity:0}to{transform:scale(1);opacity:1}}
        select{-webkit-appearance:none;appearance:none}
      `}</style>

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}
      {detailSvc && <ServiceDetailModal svc={detailSvc} booking={booking} onClose={()=>setDetailSvc(null)}/>}
      {payHistSvc && <PaymentHistoryModal svc={payHistSvc} onClose={()=>setPayHistSvc(null)}/>}

      {/* PAGE HEADER */}
      <div className="bg-white/70 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <button onClick={()=>navigate(-1)} className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center"><FiArrowLeft className="w-4 h-4 text-slate-600"/></button>
            <div>
              <h1 className="text-lg font-extrabold text-slate-800">Booking Services</h1>
              <p className="text-xs text-slate-400 mt-0.5 hidden sm:block">
                <span className="cursor-pointer hover:text-blue-600" onClick={()=>navigate("/")}>Home</span> / <span className="cursor-pointer hover:text-blue-600" onClick={()=>navigate("/Allbookings")}>Bookings</span> / <span className="cursor-pointer hover:text-blue-600" onClick={()=>navigate(`/BookingDetails/${id}`)}>View Booking</span> / <span className="text-blue-600 font-bold">Services</span>
              </p>
            </div>
          </div>
          <button onClick={fetchData} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 text-xs font-bold"><FiRefreshCw className={`w-3.5 h-3.5 ${loading?"animate-spin":""}`}/> Refresh</button>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-5 space-y-5">

        {/* ── BOOKING INFO BAR ── */}
        <div className="bg-gradient-to-r from-cyan-600 to-teal-500 rounded-2xl px-5 py-4 shadow-lg" style={{animation:"fadeUp .4s ease both"}}>
          <div className="flex items-center gap-2 mb-2"><FiAlertCircle className="w-4 h-4 text-white/80"/><h2 className="text-sm font-extrabold text-white">Booking Information</h2></div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-2 gap-x-6">
            <div><p className="text-white/80 text-xs">Booking Code: <span className="font-extrabold text-white">{booking?.code}</span></p><p className="text-white/80 text-xs">Title: <span className="font-bold text-white">{booking?.title}</span></p></div>
            <div><p className="text-white/80 text-xs">Customer: <span className="font-bold text-white">{booking?.customer}</span></p><p className="text-white/80 text-xs">Status: <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${booking?.status==="CONFIRMED"?"bg-green-400 text-white":"bg-amber-400 text-white"}`}>{titleCase(booking?.status)}</span></p></div>
            <div><p className="text-white/80 text-xs">Customer Amount: <span className="font-extrabold text-white">{fmtINR(booking?.customerAmount)}</span></p><p className="text-white/80 text-xs">Vendor Costs: <span className="font-bold text-white">{fmtINR(totalVendorCost)}</span></p><p className="text-white/80 text-xs">GST (0%): <span className="font-bold text-yellow-200">{fmtINR(booking?.gst)}</span></p></div>
            <div><p className="text-white/80 text-xs">Travel Dates: <span className="font-bold text-white">{fmtDate(booking?.travelDate)} to {fmtDate(booking?.travelEndDate)}</span></p></div>
          </div>
        </div>

        {/* ── ACTION BAR ── */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h3 className="text-sm font-extrabold text-slate-700 flex items-center gap-2"><MdOutlineAssignment className="w-4 h-4 text-blue-500"/> Booking Services</h3>
          <div className="flex items-center gap-2 flex-wrap">
            <button onClick={()=>{setEditSvc(null);setShowForm(true)}} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all"><FiPlus className="w-3.5 h-3.5"/> Add New Service</button>
            <button onClick={()=>showToastFn("Import from quotation — connect to your quotation endpoint")} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 text-xs font-bold transition-all hover:bg-blue-100"><FiDownload className="w-3.5 h-3.5"/> Import from Quotation</button>
            {/* Summary badges */}
            <span className="text-xs font-bold bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full">Customer: {fmtINR(booking?.customerAmount)}</span>
            <span className="text-xs font-bold bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full">Vendor: {fmtINR(totalVendorCost)}</span>
            <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${totalProfit>=0?"bg-green-100 text-green-700":"bg-red-100 text-red-700"}`}>Profit: {fmtINR(totalProfit)}</span>
          </div>
        </div>

        {/* ── MAIN CONTENT: form + table ── */}
        <div className={`grid gap-5 ${showForm?"grid-cols-1 lg:grid-cols-[300px_1fr]":"grid-cols-1"}`}>

          {/* LEFT: Add/Edit Service Form */}
          {showForm && <ServiceForm booking={booking} editSvc={editSvc} onClose={()=>{setShowForm(false);setEditSvc(null)}} onSaved={fetchData} showToast={showToastFn}/>}

          {/* RIGHT: Services Table */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden" style={{animation:"fadeUp .4s ease both .1s"}}>
            {services.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[900px]">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="px-3 py-3 w-10"><input type="checkbox" checked={allSelected} onChange={toggleAll} className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer"/></th>
                      {["Seq","Service Type","Service Details","Vendor","Vendor Cost","Vendor Paid","Balance Due","Payment Due Date","Payment Status","Vendor Status","Reference","Actions"].map(h=>(
                        <th key={h} className="px-3 py-3 text-left text-[10px] font-extrabold text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {services.map((svc,i) => {
                      const balance = (Number(svc.vendorCost)||0) - (Number(svc.vendorPaid)||0);
                      const svcType = svc.serviceType||svc.type||"Other";
                      return(
                        <tr key={svc.id||i} className="hover:bg-slate-50/50 group transition-colors" style={{animation:`fadeUp .3s ease both ${i*25}ms`}}>
                          <td className="px-3 py-3"><input type="checkbox" checked={selected.has(svc.id)} onChange={()=>{const n=new Set(selected);selected.has(svc.id)?n.delete(svc.id):n.add(svc.id);setSelected(n)}} className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer"/></td>
                          <td className="px-3 py-3 text-center"><span className="text-xs text-slate-500 font-medium">{svc.sequence||i+1}</span></td>
                          <td className="px-3 py-3"><span className={`text-xs font-bold text-white px-2.5 py-1 rounded-lg ${SVC_COLOR[svcType]||SVC_COLOR.Other}`}>{svcType}</span></td>
                          <td className="px-3 py-3 max-w-[200px]"><p className="text-xs text-slate-700 font-medium truncate">{svc.details||"—"}</p></td>
                          <td className="px-3 py-3"><span className="text-xs text-slate-500">{svc.vendorName||"No vendor assigned"}</span></td>
                          <td className="px-3 py-3"><span className={`text-xs font-bold ${(Number(svc.vendorCost)||0)>0?"text-slate-700":"text-red-400"}`}>{fmtINR(svc.vendorCost)}</span><br/><span className="text-[10px] text-slate-400">Your Cost</span></td>
                          <td className="px-3 py-3 text-xs font-semibold text-slate-700">{fmtINR(svc.vendorPaid||0)}</td>
                          <td className="px-3 py-3 text-xs font-semibold text-slate-700">{fmtINR(balance)}</td>
                          <td className="px-3 py-3 text-xs text-slate-500 whitespace-nowrap">{svc.paymentDueDate?fmtDate(svc.paymentDueDate):"Not set"}</td>
                          <td className="px-3 py-3"><span className={`text-xs font-bold px-2 py-0.5 rounded-full ${STATUS_STYLE[svc.paymentStatus]||STATUS_STYLE.Paid}`}>{svc.paymentStatus||"Paid"}</span></td>
                          <td className="px-3 py-3"><span className={`text-xs font-bold px-2 py-0.5 rounded-full ${STATUS_STYLE[svc.vendorStatus]||STATUS_STYLE.Pending}`}>{svc.vendorStatus||"Pending"}</span></td>
                          <td className="px-3 py-3 text-xs text-slate-400">{svc.reference||"N/A"}</td>
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-1">
                              {/* Voucher */}
                              {svcType==="Hotel" && <button title="Voucher" onClick={()=>showToastFn("Voucher generation — connect to voucher endpoint")} className="text-xs font-bold px-2 py-1 rounded-lg bg-green-500 hover:bg-green-600 text-white transition-all">Voucher</button>}
                              {/* WhatsApp vendor */}
                              {svc.vendorName && <a href={`https://wa.me/?text=${encodeURIComponent(`Booking ${booking?.code} - ${svcType} service details`)}`} target="_blank" rel="noreferrer" title="WhatsApp" className="w-7 h-7 rounded-lg bg-green-50 hover:bg-green-100 text-green-600 flex items-center justify-center border border-green-200 transition-all"><FaWhatsapp className="w-3 h-3"/></a>}
                              {/* View details */}
                              <button onClick={()=>setDetailSvc(svc)} title="View Details" className="w-7 h-7 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 flex items-center justify-center border border-blue-200 transition-all"><FiEye className="w-3 h-3"/></button>
                              {/* Payment history */}
                              <button onClick={()=>setPayHistSvc(svc)} title="Payment History" className="w-7 h-7 rounded-lg bg-cyan-50 hover:bg-cyan-100 text-cyan-600 flex items-center justify-center border border-cyan-200 transition-all"><FiCreditCard className="w-3 h-3"/></button>
                              {/* Edit */}
                              <button onClick={()=>{setEditSvc(svc);setShowForm(true)}} title="Edit" className="w-7 h-7 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-600 flex items-center justify-center border border-amber-200 transition-all"><FiEdit2 className="w-3 h-3"/></button>
                              {/* Delete */}
                              {deleting===svc.id ? (
                                <div className="flex gap-1">
                                  <button onClick={()=>handleDelete(svc.id||svc.publicId)} className="text-xs font-bold text-red-600 px-2 py-1 rounded-lg bg-red-50 border border-red-200">Yes</button>
                                  <button onClick={()=>setDeleting(null)} className="text-xs font-bold text-slate-500 px-2 py-1 rounded-lg bg-white border border-slate-200">No</button>
                                </div>
                              ) : (
                                <button onClick={()=>setDeleting(svc.id)} title="Delete" className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center border border-red-200 transition-all"><FiTrash2 className="w-3 h-3"/></button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-4xl mb-3">🗂️</div>
                <p className="text-base font-extrabold text-slate-600 mb-2">No services added yet</p>
                <p className="text-sm text-slate-400 mb-4">Click "Add New Service" to get started</p>
                <button onClick={()=>{setEditSvc(null);setShowForm(true)}} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold mx-auto transition-all"><FiPlus className="w-4 h-4"/> Add New Service</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}