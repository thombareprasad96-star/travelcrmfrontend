// src/features/bookings/pages/BookingServices.jsx
// Route: /BookingServices/:id
// Booking service line items — add/edit/delete, per-service voucher, vendor assignment.

import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import bookingService from "../api/bookingService";
import { useToast } from "@shared/ui/toast";
import { getErrorMessage, isAlreadyReported } from "@shared/api/apiError";
import { downloadBlob, hydrateBlobError } from "@shared/lib/download";
import { hasPermission, P } from "@shared/lib/access";
import {
  FiPlus, FiX, FiAlertCircle, FiArrowLeft, FiRefreshCw,
  FiEdit2, FiTrash2, FiEye, FiDownload, FiCreditCard,
} from "react-icons/fi";
import { FaWhatsapp, FaHotel, FaPlane, FaCar, FaShip, FaPassport, FaUmbrellaBeach } from "react-icons/fa";
import { MdOutlineAssignment } from "react-icons/md";

/* ─── CONSTANTS ──────────────────────────────────────────────── */
const SERVICE_TYPES = ["Hotel","Flight","Transport","Vehicle","Cruise","Sightseeing","Visa","Insurance","Passport","Other"];
const SVC_ICON = { Hotel:<FaHotel/>, Flight:<FaPlane/>, Transport:<FaCar/>, Vehicle:<FaCar/>, Cruise:<FaShip/>, Sightseeing:<FaUmbrellaBeach/>, Visa:<FaPassport/>, Insurance:"🛡️", Passport:<FaPassport/> };
const SVC_COLOR = { Hotel:"bg-gold-500", Flight:"bg-gold-600", Transport:"bg-teal-500", Vehicle:"bg-teal-500", Cruise:"bg-purple-500", Sightseeing:"bg-green-500", Visa:"bg-amber-500", Insurance:"bg-slate-500", Passport:"bg-rose-500", Other:"bg-slate-400" };
const STATUS_STYLE = {
  Paid:"bg-green-100 text-green-700", Partial:"bg-amber-100 text-amber-700",
  Unpaid:"bg-rose-100 text-rose-700", Pending:"bg-amber-100 text-amber-700",
  Confirmed:"bg-green-100 text-green-700", Cancelled:"bg-red-100 text-red-600",
};
// UI status options -> backend enum (PENDING/CONFIRMED/CANCELLED). Service normalizes on the way out.
const SERVICE_STATUS = ["Pending","Confirmed","Cancelled"];

const fmtINR = n => n!=null ? "₹"+Number(n).toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2}) : "₹0.00";
const fmtDate = d => d ? new Date(d).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}) : "—";
const titleCase = s => s ? s.charAt(0).toUpperCase()+s.slice(1).toLowerCase() : "—";

/** Normalize a BookingServiceItemResponse DTO into the shape the table/modals consume. */
function mapService(s, i) {
  return {
    id: s.publicId,
    publicId: s.publicId,
    serviceType: s.serviceType || "Other",
    title: s.title || "",
    description: s.description || "",
    details: s.description || s.title || "",
    status: s.status || "PENDING",
    cost: Number(s.cost) || 0,
    vendorCost: Number(s.vendorCost) || 0,
    vendorPublicId: s.vendorPublicId || "",
    vendorName: s.vendorName || null,
    confirmationNumber: s.confirmationNumber || "",
    notes: s.notes || "",
    serviceDate: s.serviceDate || null,
    endDate: s.endDate || null,
    sequence: i + 1,
    createdAt: s.createdAt,
  };
}

/* ─── SERVICE DETAILS MODAL ───────────────────────────────────── */
function ServiceDetailModal({ svc, booking, onClose }) {
  if(!svc) return null;
  const statusLabel = titleCase(svc.status);
  const profit = (Number(svc.cost)||booking?.customerAmount||0) - (Number(svc.vendorCost)||0);
  const base = Number(svc.cost)||booking?.customerAmount||0;
  const profitPct = base > 0 ? ((profit/base)*100).toFixed(1) : 0;
  return(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}/>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg z-10 overflow-hidden" style={{animation:"popIn .25s ease both"}}>
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-base font-extrabold text-slate-800">Service Details — {svc.serviceType}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center"><FiX className="w-4 h-4"/></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {[["Service Type",svc.serviceType],
              ["Status",<span className={`text-xs font-bold px-2 py-0.5 rounded-full ${STATUS_STYLE[statusLabel]||STATUS_STYLE.Pending}`}>{statusLabel}</span>],
              ["Vendor",svc.vendorName||"N/A"],["Confirmation #",svc.confirmationNumber||"—"],
              ["Vendor Cost",fmtINR(svc.vendorCost)],["Service Amount",fmtINR(svc.cost)],
              ["Service Date",fmtDate(svc.serviceDate)],["End Date",fmtDate(svc.endDate)],
              ["Added",fmtDate(svc.createdAt)]
            ].map(([l,v])=>(
              <div key={l}><p className="text-xs text-slate-400 font-medium">{l}</p><p className="text-sm font-bold text-slate-700 mt-0.5">{v}</p></div>
            ))}
          </div>
          {svc.details && <div><p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Service Details</p><p className="text-sm text-slate-700 bg-slate-50 rounded-xl p-3 border border-slate-100">{svc.details}</p></div>}
          {svc.notes && <div><p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Notes</p><p className="text-sm text-slate-700 bg-slate-50 rounded-xl p-3 border border-slate-100">{svc.notes}</p></div>}
          <div className="bg-gold-50 border border-gold-200 rounded-xl p-4">
            <p className="text-xs font-extrabold text-gold-700 mb-2">Profit Calculation:</p>
            <div className="space-y-1 text-sm">
              <p className="text-gold-800">Service Amount: <span className="font-bold">{fmtINR(base)}</span></p>
              <p className="text-gold-800">Vendor Cost: <span className="font-bold">{fmtINR(svc.vendorCost)}</span></p>
              <p className="text-gold-800 font-extrabold">Profit: {fmtINR(profit)} ({profitPct}%)</p>
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

/* ─── PAYMENT HISTORY MODAL ───────────────────────────────────── */
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
            {[["Type",svc.serviceType],["Vendor",svc.vendorName||"N/A"],["Cost",fmtINR(svc.vendorCost)]
            ].map(([l,v])=>(
              <div key={l} className="flex items-center justify-between"><span className="text-sm text-slate-500 font-medium">{l}:</span><span className="text-sm font-bold text-slate-700">{v}</span></div>
            ))}
          </div>
          {payments.length > 0 ? (
            <div className="space-y-2">{payments.map((p,i)=>(
              <div key={i} className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
                <div><p className="text-sm font-bold text-slate-700">{fmtINR(p.amount)}</p><p className="text-xs text-slate-400">{p.paymentMethod||p.method} · {fmtDate(p.paymentDate)}</p></div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${STATUS_STYLE[p.status]||STATUS_STYLE.Confirmed}`}>{p.status||"Completed"}</span>
              </div>
            ))}</div>
          ) : (
            <div className="bg-gold-50 border border-gold-200 text-gold-700 rounded-xl px-4 py-3 text-sm font-semibold">No payments recorded for this service. Record payments from the booking payment ledger.</div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── ADD/EDIT SERVICE FORM (sidebar) ─────────────────────────── */
function ServiceForm({ booking, editSvc, onClose, onSaved, showToast }) {
  const isEdit = !!editSvc;
  const [form, setForm] = useState({
    serviceType: editSvc?.serviceType || "",
    title:       editSvc?.title || editSvc?.details || "",
    description: editSvc?.description || "",
    status:      titleCase(editSvc?.status) !== "—" ? titleCase(editSvc?.status) : "Pending",
    cost:        editSvc?.cost != null ? String(editSvc.cost) : "0",
    vendorCost:  editSvc?.vendorCost != null ? String(editSvc.vendorCost) : "0",
    serviceDate: editSvc?.serviceDate ? String(editSvc.serviceDate).slice(0,10) : "",
    endDate:     editSvc?.endDate ? String(editSvc.endDate).slice(0,10) : "",
    confirmationNumber: editSvc?.confirmationNumber || "",
    notes:       editSvc?.notes || "",
    vendorPublicId: editSvc?.vendorPublicId || "",
  });
  const [vendors, setVendors] = useState([]);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const set = (k,v) => { setForm(p=>({...p,[k]:v})); setErrors(p=>({...p,[k]:""})); };

  // Load vendor dropdown once when the form opens.
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await bookingService.getVendors();
        const list = res.data?.data?.content ?? res.data?.data ?? res.data ?? [];
        if(alive) setVendors(Array.isArray(list) ? list : []);
      } catch(error) {
        if(isAlreadyReported(error)) return;
        // Non-fatal — the form still works without the vendor list.
      }
    })();
    return () => { alive = false; };
  }, []);

  const validate = () => {
    const e = {};
    if(!form.serviceType) e.serviceType = "Select service type";
    if(!form.title.trim()) e.title = "Enter a title";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if(!validate()) return;
    setSaving(true);
    const body = {
      serviceType: form.serviceType,
      title: form.title.trim(),
      description: form.description || null,
      serviceDate: form.serviceDate || null,
      endDate: form.endDate || null,
      status: form.status,
      cost: Number(form.cost) || 0,
      vendorCost: Number(form.vendorCost) || 0,
      confirmationNumber: form.confirmationNumber || null,
      notes: form.notes || null,
    };
    try {
      let serviceId = editSvc?.publicId;
      if(isEdit) {
        await bookingService.updateService(booking.id, serviceId, body);
      } else {
        const res = await bookingService.addService(booking.id, body);
        serviceId = res.data?.data?.publicId ?? res.data?.publicId;
      }
      // Vendor assignment goes through its own endpoint (not part of the service body).
      if(form.vendorPublicId && serviceId && form.vendorPublicId !== (editSvc?.vendorPublicId||"")) {
        await bookingService.assignVendor(booking.id, serviceId, {
          vendorPublicId: form.vendorPublicId,
          vendorCost: Number(form.vendorCost) || 0,
          confirmationNumber: form.confirmationNumber || null,
        });
      }
      showToast(isEdit ? "Service updated." : "Service added.", "success");
      onSaved();
      onClose();
    } catch(error) {
      if(isAlreadyReported(error)) { setSaving(false); return; }
      showToast(getErrorMessage(error, "Couldn't save the service."), "error");
    } finally { setSaving(false); }
  };

  const inputCls = err => `w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium outline-none transition-all ${err?"border-red-300 bg-red-50":"border-slate-200 bg-white focus:border-gold-400 focus:ring-2 focus:ring-gold-100 hover:border-slate-300"}`;
  const selectCls = err => inputCls(err)+" appearance-none cursor-pointer pr-9";

  return(
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden" style={{animation:"fadeUp .3s ease both"}}>
      <div className="bg-gradient-to-r from-gold-500 to-gold-700 px-5 py-3.5 flex items-center justify-between">
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
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">Title <span className="text-red-400">*</span></label>
          <input value={form.title} onChange={e=>set("title",e.target.value)} placeholder="e.g. 3 nights at Taj Palace" className={inputCls(errors.title)}/>
          {errors.title && <p className="text-xs text-red-500 font-semibold mt-1">{errors.title}</p>}
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">Vendor</label>
          <div className="relative">
            <select value={form.vendorPublicId} onChange={e=>set("vendorPublicId",e.target.value)} className={selectCls(false)}>
              <option value="">Select Vendor (Optional)</option>
              {vendors.map(v=><option key={v.publicId} value={v.publicId}>{v.vendorName ?? v.name}</option>)}
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] pointer-events-none">▼</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">Service Amount</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-bold">₹</span>
              <input type="number" step="0.01" min="0" value={form.cost} onChange={e=>set("cost",e.target.value)} className={inputCls(false)+" pl-8"}/>
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">Vendor Cost <span className="text-red-400 text-[10px]">(Your Cost)</span></label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-bold">₹</span>
              <input type="number" step="0.01" min="0" value={form.vendorCost} onChange={e=>set("vendorCost",e.target.value)} className={inputCls(false)+" pl-8"}/>
            </div>
          </div>
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">Status</label>
          <div className="relative">
            <select value={form.status} onChange={e=>set("status",e.target.value)} className={selectCls(false)}>
              {SERVICE_STATUS.map(s=><option key={s}>{s}</option>)}
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] pointer-events-none">▼</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">Service Date</label>
            <input type="date" value={form.serviceDate} onChange={e=>set("serviceDate",e.target.value)} className={inputCls(false)}/>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">End Date</label>
            <input type="date" value={form.endDate} onChange={e=>set("endDate",e.target.value)} className={inputCls(false)}/>
          </div>
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">Confirmation #</label>
          <input value={form.confirmationNumber} onChange={e=>set("confirmationNumber",e.target.value)} placeholder="Vendor confirmation / PNR" className={inputCls(false)}/>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 space-y-1">
          <p className="text-xs font-bold text-amber-700">Note: Total payable includes TCS</p>
          <p className="text-xs text-amber-600">Customer Amount: {fmtINR(booking?.customerAmount)}</p>
          <p className="text-xs text-amber-600">GST (0%): {fmtINR(booking?.gst||0)}</p>
          <p className="text-xs text-amber-700 font-bold">Net Profit Formula: Customer Amount - GST - Vendor Costs</p>
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">Service Details</label>
          <textarea value={form.description} onChange={e=>set("description",e.target.value)} rows={2} placeholder="Enter service details, requirements, special instructions..." className={inputCls(false)+" resize-none"}/>
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">Notes</label>
          <textarea value={form.notes} onChange={e=>set("notes",e.target.value)} rows={2} placeholder="Internal notes (optional)..." className={inputCls(false)+" resize-none"}/>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl bg-gold-600 hover:bg-gold-700 text-white font-extrabold text-sm shadow-md shadow-gold-200 transition-all disabled:opacity-60">
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
  const { showToast } = useToast();

  const canUpdate = hasPermission(P.BOOKING_UPDATE);
  const canDelete = hasPermission(P.BOOKING_DELETE);

  const [booking,      setBooking]      = useState(null);
  const [services,     setServices]     = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [showForm,     setShowForm]     = useState(false);
  const [editSvc,      setEditSvc]      = useState(null);
  const [detailSvc,    setDetailSvc]    = useState(null);
  const [payHistSvc,   setPayHistSvc]   = useState(null);
  const [deleting,     setDeleting]     = useState(null);
  const [downloading,  setDownloading]  = useState(null); // publicId of service whose voucher is downloading
  const [selected,     setSelected]     = useState(new Set());

  const fetchData = useCallback(async () => {
    if(!id) return;
    setLoading(true);
    try {
      const [bRes, sRes] = await Promise.all([
        bookingService.getById(id),
        bookingService.getServices(id),
      ]);
      const b = bRes.data?.data ?? bRes.data;
      setBooking({
        id: b.publicId||b.id, code: b.bookingCode||b.code||"—",
        title: b.title || `${b.customerNameSnapshot||b.customerName||""} - ${b.destinationSnapshot||b.destination||""}`,
        customer: b.customerNameSnapshot||b.customerName||"—",
        customerAmount: Number(b.customerAmount)||0,
        vendorCost: Number(b.vendorCost)||0,
        gst: Number(b.gst)||0, tcs: Number(b.tcs)||0,
        totalPayable: Number(b.totalPayable)||0,
        status: b.status||"PENDING",
        travelDate: b.travelDate, travelEndDate: b.travelEndDate||b.returnDate,
      });
      const rawSvcs = sRes.data?.data ?? sRes.data ?? [];
      setServices((Array.isArray(rawSvcs)?rawSvcs:[]).map(mapService));
    } catch(error) {
      if(isAlreadyReported(error)) { setLoading(false); return; }
      showToast(getErrorMessage(error, "Couldn't load booking services."), "error");
    } finally { setLoading(false); }
  },[id,showToast]);

  useEffect(()=>{fetchData()},[fetchData]);

  const handleDelete = async (svcId) => {
    try {
      await bookingService.deleteService(booking.id, svcId);
      showToast("Service removed.", "success");
      fetchData();
    } catch(error) {
      if(!isAlreadyReported(error)) showToast(getErrorMessage(error, "Couldn't remove the service."), "error");
    }
    setDeleting(null);
  };

  const downloadVoucher = async (svc) => {
    setDownloading(svc.publicId);
    try {
      const res = await bookingService.getServiceVoucher(booking.id, svc.publicId);
      const safeTitle = (svc.title||svc.serviceType||"service").replace(/[^\w\-]+/g,"_").slice(0,40);
      downloadBlob(res.data, `Voucher-${booking?.code||"booking"}-${safeTitle}.pdf`);
      showToast("Voucher downloaded.", "success");
    } catch(error) {
      if(isAlreadyReported(error)) return;
      await hydrateBlobError(error);
      showToast(getErrorMessage(error, "Couldn't generate the voucher."), "error");
    } finally { setDownloading(null); }
  };

  // Summary calculations
  const totalVendorCost = services.reduce((s,sv)=>s+(Number(sv.vendorCost)||0),0);
  const totalProfit = (booking?.customerAmount||0) - totalVendorCost;

  const allSelected = services.length>0 && services.every(s=>selected.has(s.id));
  const toggleAll = () => { if(allSelected){setSelected(new Set())}else{setSelected(new Set(services.map(s=>s.id)))} };

  if(loading) return(
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gold-50/40 to-slate-100 flex items-center justify-center" style={{fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif"}}>
      <div className="text-center"><div className="w-14 h-14 border-4 border-gold-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"/><p className="text-slate-500 font-semibold">Loading services…</p></div>
    </div>
  );

  return(
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gold-50/40 to-slate-100" style={{fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        @keyframes slideIn{from{transform:translateX(110%);opacity:0}to{transform:translateX(0);opacity:1}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes popIn{from{transform:scale(.92);opacity:0}to{transform:scale(1);opacity:1}}
        select{-webkit-appearance:none;appearance:none}
      `}</style>

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
                <span className="cursor-pointer hover:text-gold-700" onClick={()=>navigate("/")}>Home</span> / <span className="cursor-pointer hover:text-gold-700" onClick={()=>navigate("/Allbookings")}>Bookings</span> / <span className="cursor-pointer hover:text-gold-700" onClick={()=>navigate(`/BookingDetails/${id}`)}>View Booking</span> / <span className="text-gold-700 font-bold">Services</span>
              </p>
            </div>
          </div>
          <button onClick={fetchData} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 text-xs font-bold"><FiRefreshCw className={`w-3.5 h-3.5 ${loading?"animate-spin":""}`}/> Refresh</button>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-5 space-y-5">

        {/* ── BOOKING INFO BAR ── */}
        <div className="bg-gradient-to-r from-gold-500 to-gold-700 rounded-2xl px-5 py-4 shadow-lg shadow-gold-200" style={{animation:"fadeUp .4s ease both"}}>
          <div className="flex items-center gap-2 mb-2"><FiAlertCircle className="w-4 h-4 text-white/80"/><h2 className="text-sm font-extrabold text-white">Booking Information</h2></div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-2 gap-x-6">
            <div><p className="text-white/80 text-xs">Booking Code: <span className="font-extrabold text-white">{booking?.code}</span></p><p className="text-white/80 text-xs">Title: <span className="font-bold text-white">{booking?.title}</span></p></div>
            <div><p className="text-white/80 text-xs">Customer: <span className="font-bold text-white">{booking?.customer}</span></p><p className="text-white/80 text-xs">Status: <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${booking?.status==="CONFIRMED"?"bg-green-400 text-white":"bg-amber-400 text-white"}`}>{titleCase(booking?.status)}</span></p></div>
            <div><p className="text-white/80 text-xs">Customer Amount: <span className="font-extrabold text-white">{fmtINR(booking?.customerAmount)}</span></p><p className="text-white/80 text-xs">Vendor Costs: <span className="font-bold text-white">{fmtINR(totalVendorCost)}</span></p><p className="text-white/80 text-xs">GST (0%): <span className="font-bold text-gold-100">{fmtINR(booking?.gst)}</span></p></div>
            <div><p className="text-white/80 text-xs">Travel Dates: <span className="font-bold text-white">{fmtDate(booking?.travelDate)} to {fmtDate(booking?.travelEndDate)}</span></p></div>
          </div>
        </div>

        {/* ── ACTION BAR ── */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h3 className="text-sm font-extrabold text-slate-700 flex items-center gap-2"><MdOutlineAssignment className="w-4 h-4 text-gold-600"/> Booking Services</h3>
          <div className="flex items-center gap-2 flex-wrap">
            {canUpdate && <button onClick={()=>{setEditSvc(null);setShowForm(true)}} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gold-600 hover:bg-gold-700 text-white text-xs font-bold shadow-sm transition-all"><FiPlus className="w-3.5 h-3.5"/> Add New Service</button>}
            {canUpdate && <button onClick={()=>showToast("Import from Quotation is coming soon.", "info")} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gold-300 bg-white text-gold-800 text-xs font-bold transition-all hover:bg-gold-50"><FiDownload className="w-3.5 h-3.5"/> Import from Quotation</button>}
            {/* Summary badges */}
            <span className="text-xs font-bold bg-gold-100 text-gold-700 px-3 py-1.5 rounded-full">Customer: {fmtINR(booking?.customerAmount)}</span>
            <span className="text-xs font-bold bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full">Vendor: {fmtINR(totalVendorCost)}</span>
            <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${totalProfit>=0?"bg-green-100 text-green-700":"bg-red-100 text-red-700"}`}>Profit: {fmtINR(totalProfit)}</span>
          </div>
        </div>

        {/* ── MAIN CONTENT: form + table ── */}
        <div className={`grid gap-5 ${showForm?"grid-cols-1 lg:grid-cols-[340px_1fr]":"grid-cols-1"}`}>

          {/* LEFT: Add/Edit Service Form */}
          {showForm && canUpdate && <ServiceForm booking={booking} editSvc={editSvc} onClose={()=>{setShowForm(false);setEditSvc(null)}} onSaved={fetchData} showToast={showToast}/>}

          {/* RIGHT: Services Table */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden" style={{animation:"fadeUp .4s ease both .1s"}}>
            {services.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[900px]">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="px-3 py-3 w-10"><input type="checkbox" checked={allSelected} onChange={toggleAll} className="w-4 h-4 rounded border-slate-300 text-gold-600 cursor-pointer"/></th>
                      {["Seq","Service Type","Service Details","Vendor","Vendor Cost","Service Amount","Balance Due","Service Date","Status","Confirmation #","Actions"].map(h=>(
                        <th key={h} className="px-3 py-3 text-left text-[10px] font-extrabold text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {services.map((svc,i) => {
                      const balance = (Number(svc.cost)||0) - (Number(svc.vendorCost)||0);
                      const svcType = svc.serviceType||"Other";
                      const statusLabel = titleCase(svc.status);
                      return(
                        <tr key={svc.id||i} className="hover:bg-gold-50/40 group transition-colors" style={{animation:`fadeUp .3s ease both ${i*25}ms`}}>
                          <td className="px-3 py-3"><input type="checkbox" checked={selected.has(svc.id)} onChange={()=>{const n=new Set(selected);selected.has(svc.id)?n.delete(svc.id):n.add(svc.id);setSelected(n)}} className="w-4 h-4 rounded border-slate-300 text-gold-600 cursor-pointer"/></td>
                          <td className="px-3 py-3 text-center"><span className="text-xs text-slate-500 font-medium">{svc.sequence||i+1}</span></td>
                          <td className="px-3 py-3"><span className={`text-xs font-bold text-white px-2.5 py-1 rounded-lg ${SVC_COLOR[svcType]||SVC_COLOR.Other}`}>{svcType}</span></td>
                          <td className="px-3 py-3 max-w-[220px]"><p className="text-xs text-slate-700 font-semibold truncate">{svc.title||"—"}</p>{svc.description && <p className="text-[11px] text-slate-400 truncate">{svc.description}</p>}</td>
                          <td className="px-3 py-3"><span className="text-xs text-slate-500">{svc.vendorName||"No vendor assigned"}</span></td>
                          <td className="px-3 py-3"><span className={`text-xs font-bold ${(Number(svc.vendorCost)||0)>0?"text-slate-700":"text-red-400"}`}>{fmtINR(svc.vendorCost)}</span><br/><span className="text-[10px] text-slate-400">Your Cost</span></td>
                          <td className="px-3 py-3 text-xs font-semibold text-slate-700">{fmtINR(svc.cost)}</td>
                          <td className="px-3 py-3 text-xs font-semibold text-slate-700">{fmtINR(balance)}</td>
                          <td className="px-3 py-3 text-xs text-slate-500 whitespace-nowrap">{svc.serviceDate?fmtDate(svc.serviceDate):"Not set"}</td>
                          <td className="px-3 py-3"><span className={`text-xs font-bold px-2 py-0.5 rounded-full ${STATUS_STYLE[statusLabel]||STATUS_STYLE.Pending}`}>{statusLabel}</span></td>
                          <td className="px-3 py-3 text-xs text-slate-400">{svc.confirmationNumber||"N/A"}</td>
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-1">
                              {/* Per-service voucher (gold outline, with loading state) */}
                              <button title="Download Voucher" disabled={downloading===svc.publicId} onClick={()=>downloadVoucher(svc)} className="flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg border border-gold-300 bg-white text-gold-800 hover:bg-gold-50 transition-all disabled:opacity-60">
                                {downloading===svc.publicId ? <span className="w-3 h-3 border-2 border-gold-400/40 border-t-gold-600 rounded-full animate-spin"/> : <FiDownload className="w-3 h-3"/>}
                                Voucher
                              </button>
                              {/* WhatsApp vendor */}
                              {svc.vendorName && <a href={`https://wa.me/?text=${encodeURIComponent(`Booking ${booking?.code} - ${svcType} service details`)}`} target="_blank" rel="noreferrer" title="WhatsApp" className="w-7 h-7 rounded-lg bg-green-50 hover:bg-green-100 text-green-600 flex items-center justify-center border border-green-200 transition-all"><FaWhatsapp className="w-3 h-3"/></a>}
                              {/* View details */}
                              <button onClick={()=>setDetailSvc(svc)} title="View Details" className="w-7 h-7 rounded-lg bg-gold-50 hover:bg-gold-100 text-gold-700 flex items-center justify-center border border-gold-200 transition-all"><FiEye className="w-3 h-3"/></button>
                              {/* Payment history */}
                              <button onClick={()=>setPayHistSvc(svc)} title="Payment History" className="w-7 h-7 rounded-lg bg-cyan-50 hover:bg-cyan-100 text-cyan-600 flex items-center justify-center border border-cyan-200 transition-all"><FiCreditCard className="w-3 h-3"/></button>
                              {/* Edit */}
                              {canUpdate && <button onClick={()=>{setEditSvc(svc);setShowForm(true)}} title="Edit" className="w-7 h-7 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-600 flex items-center justify-center border border-amber-200 transition-all"><FiEdit2 className="w-3 h-3"/></button>}
                              {/* Delete */}
                              {canDelete && (deleting===svc.id ? (
                                <div className="flex gap-1">
                                  <button onClick={()=>handleDelete(svc.publicId)} className="text-xs font-bold text-red-600 px-2 py-1 rounded-lg bg-red-50 border border-red-200">Yes</button>
                                  <button onClick={()=>setDeleting(null)} className="text-xs font-bold text-slate-500 px-2 py-1 rounded-lg bg-white border border-slate-200">No</button>
                                </div>
                              ) : (
                                <button onClick={()=>setDeleting(svc.id)} title="Delete" className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center border border-red-200 transition-all"><FiTrash2 className="w-3 h-3"/></button>
                              ))}
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
                {canUpdate && <button onClick={()=>{setEditSvc(null);setShowForm(true)}} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-600 hover:bg-gold-700 text-white text-sm font-bold mx-auto transition-all"><FiPlus className="w-4 h-4"/> Add New Service</button>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}