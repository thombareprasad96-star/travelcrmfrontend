// src/components/Bookings/EditBooking.jsx
// Route: /EditBooking/:id
// Fetch → pre-fill all fields → PUT → navigate("/Bookings")
// Design: matches CRM glass system

import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams }            from "react-router-dom";
import { useForm }                            from "react-hook-form";
import bookingService                         from "../services/bookingService";
import {
  FiArrowLeft, FiSave, FiCheckCircle, FiAlertCircle, FiX,
  FiCalendar, FiDollarSign, FiPercent, FiCreditCard,
  FiFileText, FiPackage, FiUser,
} from "react-icons/fi";
import { FaPlane } from "react-icons/fa";

const BOOKING_STATUSES = ["CONFIRMED","PENDING","CANCELLED","COMPLETED","REFUNDED"];
const PAY_STATUSES     = ["PAID","PARTIAL","UNPAID","REFUNDED"];
const SERVICES_LIST    = ["Hotel","Flight","Transport","Cruise","Visa","Sightseeing","Insurance","Passport"];
const STATUS_COLORS    = {
  CONFIRMED:"bg-green-100 text-green-700 border-green-200",
  PENDING:  "bg-amber-100 text-amber-700 border-amber-200",
  CANCELLED:"bg-red-100   text-red-600   border-red-200",
  COMPLETED:"bg-blue-100  text-blue-700  border-blue-200",
  REFUNDED: "bg-purple-100 text-purple-700 border-purple-200",
};
const fmtLabel = s => s.charAt(0) + s.slice(1).toLowerCase();
const fmtINR   = n => n ? "+" + Number(n).toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2}) : "+0.00";

function Toast({ msg, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3800); return () => clearTimeout(t); }, [onClose]);
  const ok = type === "success";
  return (
    <div className={"fixed top-5 right-5 z-[999] flex items-center gap-3 px-4 py-3.5 rounded-2xl border shadow-2xl max-w-sm "
        + (ok ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800")}
      style={{animation:"slideIn .3s ease both"}}>
      {ok ? <FiCheckCircle className="w-5 h-5 text-green-600 flex-shrink-0"/> : <FiAlertCircle className="w-5 h-5 text-red-600 flex-shrink-0"/>}
      <p className="text-sm font-semibold flex-1">{msg}</p>
      <button onClick={onClose} className="opacity-50 hover:opacity-100 transition-opacity"><FiX className="w-4 h-4"/></button>
    </div>
  );
}

function SkeletonCard({ rows=4 }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4 animate-pulse">
      <div className="h-5 w-1/3 bg-slate-200 rounded-lg"/>
      {Array.from({length:rows}).map((_,i)=>(
        <div key={i} className="space-y-2">
          <div className="h-3.5 w-1/4 bg-slate-200 rounded"/>
          <div className="h-10 bg-slate-100 rounded-xl"/>
        </div>
      ))}
    </div>
  );
}

function SectionCard({ icon: Icon, title, subtitle, gradient, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className={"bg-gradient-to-r "+gradient+" px-6 py-4 flex items-center gap-3"}>
        <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
          <Icon className="w-4 h-4 text-white"/>
        </div>
        <div>
          <h2 className="text-white font-extrabold text-sm">{title}</h2>
          {subtitle && <p className="text-white/70 text-xs mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function Field({ label, required, error, hint, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-[10px] text-slate-400">{hint}</p>}
      {error && <p className="text-xs text-red-500 flex items-center gap-1"><FiAlertCircle className="w-3 h-3"/>{error}</p>}
    </div>
  );
}

const inp = err =>
  "w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-700 outline-none transition-all "
  + (err
    ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-2 focus:ring-red-50"
    : "border-slate-200 bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-50 hover:border-slate-300");

const sel = err =>
  "w-full px-3.5 py-2.5 pr-10 rounded-xl border text-sm text-slate-700 outline-none appearance-none cursor-pointer transition-all "
  + (err
    ? "border-red-300 bg-red-50 focus:border-red-400"
    : "border-slate-200 bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-50 hover:border-slate-300");

function LiveSummary({ watch, selectedServices }) {
  const w = watch();
  const fmt = n => n ? String(fmtINR(n)).replace("+","") : "0.00";
  const profit = (Number(w.customerAmount)||0) - (Number(w.vendorCost)||0);
  const payPct = (Number(w.totalPayable)||0) > 0
    ? Math.round((Number(w.paidAmount)||0)/(Number(w.totalPayable)||1)*100) : 0;
  const toD = d => d ? new Date(d).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}) : "—";
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-3">
        <h3 className="text-sm font-extrabold text-slate-700">Live Summary</h3>
        <div className="flex flex-wrap gap-2">
          {w.status && (
            <span className={"text-xs font-bold px-3 py-1 rounded-full border "+(STATUS_COLORS[w.status]||"bg-slate-100 text-slate-600")}>
              {fmtLabel(w.status)}
            </span>
          )}
          {w.paymentStatus && (
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
              {fmtLabel(w.paymentStatus)}
            </span>
          )}
        </div>
        <div className="space-y-2">
          {[["Customer",w.customerNameSnapshot||"—"],["Destination",w.destinationSnapshot||"—"],
            ["Travel",toD(w.travelDate)],["Booking",toD(w.bookingDate)]].map(([l,v])=>(
            <div key={l} className="flex items-center justify-between text-xs">
              <span className="text-slate-400">{l}</span>
              <span className="font-bold text-slate-700 text-right max-w-[60%] truncate">{v}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-2.5">
        <h3 className="text-sm font-extrabold text-slate-700">Financials</h3>
        {[["Customer Amt",w.customerAmount,"text-slate-800"],
          ["Vendor Cost",w.vendorCost,"text-slate-500"],
          ["GST",w.gst,"text-amber-600"],
          ["TCS",w.tcs,"text-amber-600"],
          ["Total Payable",w.totalPayable,"text-blue-700 font-extrabold"],
          ["Paid",w.paidAmount,"text-green-600"]].map(([l,v,c])=>(
          <div key={l} className="flex items-center justify-between text-xs">
            <span className="text-slate-400">{l}</span>
            <span className={"font-bold "+c}>{"+" + (v ? Number(v).toLocaleString("en-IN",{minimumFractionDigits:2}) : "0.00")}</span>
          </div>
        ))}
        <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
          <span className="font-bold text-slate-600">Net Profit</span>
          <span className={"font-extrabold "+(profit>=0?"text-green-600":"text-red-500")}>
            {"+" + profit.toLocaleString("en-IN",{minimumFractionDigits:2})}
          </span>
        </div>
        <div className="space-y-1 pt-1">
          <div className="flex justify-between text-[10px] text-slate-400"><span>Payment</span><span>{payPct}%</span></div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className={"h-full rounded-full transition-all duration-500 "+(payPct===100?"bg-green-500":payPct>0?"bg-blue-500":"bg-slate-200")}
              style={{width:payPct+"%"}}/>
          </div>
        </div>
      </div>
      {selectedServices.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <h3 className="text-sm font-extrabold text-slate-700 mb-3">Services</h3>
          <div className="flex flex-wrap gap-1.5">
            {selectedServices.map(s=>(
              <span key={s} className="text-xs bg-blue-50 text-blue-700 border border-blue-100 px-2.5 py-1 rounded-full font-semibold">{s}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function EditBooking() {
  const navigate = useNavigate();
  const { id }   = useParams();

  const [loading,  setLoading]  = useState(true);
  const [code,     setCode]     = useState("");
  const [services, setServices] = useState([]);
  const [busy,     setBusy]     = useState(false);
  const [toast,    setToast]    = useState(null);

  const showToast = useCallback((msg,type="success")=>setToast({msg,type}),[]);

  const { register, handleSubmit, watch, reset, setValue, formState:{errors} } = useForm({
    defaultValues: {
      customerNameSnapshot:"", destinationSnapshot:"",
      bookingDate:"", travelDate:"",
      customerAmount:"", vendorCost:"", gst:"", tcs:"",
      totalPayable:"", paidAmount:"",
      status:"PENDING", paymentStatus:"UNPAID", notes:"",
    },
  });

  const amt = watch("customerAmount");
  const g   = watch("gst");
  const t   = watch("tcs");
  useEffect(()=>{
    const total=(Number(amt)||0)+(Number(g)||0)+(Number(t)||0);
    if(total>0) setValue("totalPayable",total.toFixed(2));
  },[amt,g,t,setValue]);

  useEffect(()=>{
    if(!id){showToast("No booking ID.","error");return;}
    setLoading(true);
    bookingService.getById(id)
      .then(res=>{
        const b=res.data?.data??res.data;
        const d=s=>s?new Date(s).toISOString().slice(0,10):"";
        reset({
          customerNameSnapshot: b.customerNameSnapshot||b.customerName||"",
          destinationSnapshot:  b.destinationSnapshot||b.destination||"",
          bookingDate:  d(b.bookingDate),
          travelDate:   d(b.travelDate),
          customerAmount: b.customerAmount!=null?String(b.customerAmount):"",
          vendorCost:     b.vendorCost    !=null?String(b.vendorCost)    :"",
          gst:            b.gst           !=null?String(b.gst)           :"",
          tcs:            b.tcs           !=null?String(b.tcs)           :"",
          totalPayable:   b.totalPayable  !=null?String(b.totalPayable)  :"",
          paidAmount:     b.paidAmount    !=null?String(b.paidAmount)    :"",
          status:         b.status||"PENDING",
          paymentStatus:  b.paymentStatus||"UNPAID",
          notes:          b.notes||"",
        });
        setServices(Array.isArray(b.services)?b.services:[]);
        setCode(b.bookingCode||b.code||"");
      })
      .catch(err=>showToast(err?.response?.data?.message||"Failed to load booking.","error"))
      .finally(()=>setLoading(false));
  },[id,reset,showToast]);

  const toggleSvc = s => setServices(p=>p.includes(s)?p.filter(x=>x!==s):[...p,s]);

  const onSubmit = async data => {
    setBusy(true);
    try {
      await bookingService.update(id,{
        customerNameSnapshot: data.customerNameSnapshot,
        destinationSnapshot:  data.destinationSnapshot,
        bookingDate:   data.bookingDate,
        travelDate:    data.travelDate,
        customerAmount:parseFloat(data.customerAmount)||0,
        vendorCost:    parseFloat(data.vendorCost)    ||0,
        gst:           parseFloat(data.gst)           ||0,
        tcs:           parseFloat(data.tcs)           ||0,
        totalPayable:  parseFloat(data.totalPayable)  ||0,
        paidAmount:    parseFloat(data.paidAmount)    ||0,
        status:        data.status,
        paymentStatus: data.paymentStatus,
        services,
        notes:         data.notes,
      });
      showToast("Booking "+code+" updated successfully!");
      setTimeout(()=>navigate("/Allbookings"),1300);
    } catch(err){
      showToast(err?.response?.data?.message||"Failed to update booking.","error");
    } finally { setBusy(false); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100"
      style={{fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        @keyframes slideIn{from{transform:translateX(110%);opacity:0}to{transform:translateX(0);opacity:1}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        .fade-up{animation:fadeUp .4s ease both}
        select{-webkit-appearance:none;appearance:none}
        ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:#f1f5f9;border-radius:99px}::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:99px}
      `}</style>

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}

      {/* HEADER */}
      <div className="bg-white/70 backdrop-blur-md border-b border-slate-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600
                flex items-center justify-center text-white shadow-lg shadow-blue-200 flex-shrink-0">
                <FaPlane className="w-5 h-5"/>
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-lg font-extrabold text-slate-800 tracking-tight">Edit Booking</h1>
                  {code && (
                    <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                      {code}
                    </span>
                  )}
                  {loading && <span className="text-xs text-slate-400 animate-pulse">Loading…</span>}
                </div>
                <p className="text-xs text-slate-400 hidden sm:block mt-0.5">
                  <span className="hover:text-blue-600 cursor-pointer" onClick={()=>navigate("/")}>Home</span>
                  <span className="mx-1 text-slate-300">/</span>
                  <span className="hover:text-blue-600 cursor-pointer" onClick={()=>navigate("/Allbookings")}>Bookings</span>
                  <span className="mx-1 text-slate-300">/</span>
                  <span className="text-blue-600 font-bold">Edit</span>
                </p>
              </div>
            </div>
            <button type="button" onClick={()=>navigate("/Allbookings")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200
                hover:border-blue-300 bg-white hover:bg-blue-50 text-slate-600 hover:text-blue-600
                text-sm font-bold transition-all shadow-sm self-start sm:self-auto">
              <FiArrowLeft className="w-4 h-4"/> Back to Bookings
            </button>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6">
        {loading ? (
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 space-y-5">
              <SkeletonCard rows={4}/><SkeletonCard rows={5}/><SkeletonCard rows={3}/><SkeletonCard rows={2}/>
            </div>
            <div className="w-full lg:w-72 xl:w-80 flex-shrink-0 space-y-4">
              <SkeletonCard rows={3}/><SkeletonCard rows={4}/>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="flex flex-col lg:flex-row gap-6">

              {/* LEFT */}
              <div className="flex-1 min-w-0 space-y-5">

                {/* 1. Customer & Trip */}
                <div className="fade-up">
                  <SectionCard icon={FiUser} title="Customer & Trip Details"
                    subtitle="Customer name, destination & travel dates"
                    gradient="from-blue-600 to-indigo-500">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label="Customer Name" required error={errors.customerNameSnapshot?.message}>
                          <input {...register("customerNameSnapshot",{required:"Customer name is required"})}
                            placeholder="e.g. Rahul Sharma" className={inp(errors.customerNameSnapshot)}/>
                        </Field>
                        <Field label="Destination" required error={errors.destinationSnapshot?.message}>
                          <input {...register("destinationSnapshot",{required:"Destination is required"})}
                            placeholder="e.g. Nepal · Bhutan" className={inp(errors.destinationSnapshot)}/>
                        </Field>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label="Booking Date">
                          <div className="relative">
                            <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"/>
                            <input type="date" {...register("bookingDate")} className={inp(false)+" pl-10"}/>
                          </div>
                        </Field>
                        <Field label="Travel Date">
                          <div className="relative">
                            <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"/>
                            <input type="date" {...register("travelDate")} className={inp(false)+" pl-10"}/>
                          </div>
                        </Field>
                      </div>
                    </div>
                  </SectionCard>
                </div>

                {/* 2. Financials */}
                <div className="fade-up" style={{animationDelay:"60ms"}}>
                  <SectionCard icon={FiDollarSign} title="Financial Details"
                    subtitle="Revenue, vendor costs, taxes & payments"
                    gradient="from-amber-500 to-orange-500">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label="Customer Amount (₹)" required error={errors.customerAmount?.message}>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold pointer-events-none">₹</span>
                            <input type="number" min="0" step="0.01"
                              {...register("customerAmount",{required:"Required",min:{value:0,message:"Cannot be negative"}})}
                              placeholder="0.00" className={inp(errors.customerAmount)+" pl-8"}/>
                          </div>
                        </Field>
                        <Field label="Vendor Cost (₹)">
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold pointer-events-none">₹</span>
                            <input type="number" min="0" step="0.01"
                              {...register("vendorCost",{min:{value:0,message:"Cannot be negative"}})}
                              placeholder="0.00" className={inp(false)+" pl-8"}/>
                          </div>
                        </Field>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label="GST (₹)">
                          <div className="relative">
                            <FiPercent className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"/>
                            <input type="number" min="0" step="0.01"
                              {...register("gst",{min:{value:0,message:"Cannot be negative"}})}
                              placeholder="Auto-calculated" className={inp(false)+" pl-10"}/>
                          </div>
                        </Field>
                        <Field label="TCS (₹)">
                          <div className="relative">
                            <FiPercent className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"/>
                            <input type="number" min="0" step="0.01"
                              {...register("tcs",{min:{value:0,message:"Cannot be negative"}})}
                              placeholder="Auto-calculated" className={inp(false)+" pl-10"}/>
                          </div>
                        </Field>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label="Total Payable (₹)" required error={errors.totalPayable?.message}
                          hint="Auto-calculated from Customer Amt + GST + TCS">
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold pointer-events-none">₹</span>
                            <input type="number" min="0" step="0.01"
                              {...register("totalPayable",{required:"Required"})}
                              placeholder="Auto-calculated" className={inp(errors.totalPayable)+" pl-8 font-bold"}/>
                          </div>
                        </Field>
                        <Field label="Amount Paid (₹)">
                          <div className="relative">
                            <FiCreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"/>
                            <input type="number" min="0" step="0.01"
                              {...register("paidAmount",{min:{value:0,message:"Cannot be negative"}})}
                              placeholder="0.00" className={inp(false)+" pl-10"}/>
                          </div>
                        </Field>
                      </div>
                    </div>
                  </SectionCard>
                </div>

                {/* 3. Status */}
                <div className="fade-up" style={{animationDelay:"100ms"}}>
                  <SectionCard icon={FiCheckCircle} title="Booking & Payment Status"
                    subtitle="Current booking and payment state"
                    gradient="from-teal-500 to-cyan-500">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="Booking Status" required error={errors.status?.message}>
                        <div className="relative">
                          <select {...register("status",{required:"Required"})} className={sel(errors.status)}>
                            {BOOKING_STATUSES.map(s=><option key={s} value={s}>{fmtLabel(s)}</option>)}
                          </select>
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[10px]">&#9660;</div>
                        </div>
                        {watch("status") && (
                          <span className={"inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border mt-1.5 "+(STATUS_COLORS[watch("status")]||"bg-slate-100 text-slate-600")}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60"/>
                            {fmtLabel(watch("status"))}
                          </span>
                        )}
                      </Field>
                      <Field label="Payment Status" required error={errors.paymentStatus?.message}>
                        <div className="relative">
                          <select {...register("paymentStatus",{required:"Required"})} className={sel(errors.paymentStatus)}>
                            {PAY_STATUSES.map(s=><option key={s} value={s}>{fmtLabel(s)}</option>)}
                          </select>
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[10px]">&#9660;</div>
                        </div>
                      </Field>
                    </div>
                  </SectionCard>
                </div>

                {/* 4. Services */}
                <div className="fade-up" style={{animationDelay:"140ms"}}>
                  <SectionCard icon={FiPackage} title="Services Included"
                    subtitle="Toggle services in this booking"
                    gradient="from-indigo-600 to-purple-600">
                    <div className="flex flex-wrap gap-2.5">
                      {SERVICES_LIST.map(s=>{
                        const on = services.includes(s);
                        return (
                          <button key={s} type="button" onClick={()=>toggleSvc(s)}
                            className={"px-4 py-2 rounded-xl text-sm font-bold border transition-all "
                              +(on
                                ?"bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-200"
                                :"bg-white border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-600")}>
                            {s}
                          </button>
                        );
                      })}
                    </div>
                    {services.length===0&&<p className="text-xs text-slate-400 mt-3">Click to select at least one service.</p>}
                  </SectionCard>
                </div>

                {/* 5. Notes */}
                <div className="fade-up" style={{animationDelay:"180ms"}}>
                  <SectionCard icon={FiFileText} title="Internal Notes"
                    subtitle="Agent notes, special instructions or remarks"
                    gradient="from-slate-600 to-slate-500">
                    <textarea rows={4} {...register("notes")}
                      placeholder="Enter any special notes, instructions, customer preferences, or important remarks..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700
                        placeholder-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-50
                        outline-none transition-all resize-none hover:border-slate-300"/>
                  </SectionCard>
                </div>

                {/* ACTIONS */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 fade-up"
                  style={{animationDelay:"220ms"}}>
                  <div className="flex flex-col sm:flex-row items-stretch gap-3">
                    <button type="submit" disabled={busy}
                      className="flex-1 flex items-center justify-center gap-2.5 px-8 py-3 rounded-xl
                        bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600
                        text-white font-extrabold text-sm shadow-md shadow-blue-200
                        hover:shadow-lg hover:shadow-blue-300 transition-all
                        disabled:opacity-60 disabled:cursor-not-allowed">
                      {busy
                        ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/>Updating…</>
                        : <><FiSave className="w-4 h-4"/>Update Booking</>}
                    </button>
                    <button type="button" onClick={()=>navigate("/Allbookings")} disabled={busy}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl
                        border-2 border-red-100 hover:border-red-200 text-red-400 hover:text-red-600
                        font-bold text-sm transition-all disabled:opacity-40 bg-white hover:bg-red-50">
                      <FiArrowLeft className="w-4 h-4"/> Discard
                    </button>
                  </div>
                  <p className="text-center text-xs text-slate-400 mt-3">
                    Clicking <span className="font-bold text-blue-600">Update Booking</span> saves all changes immediately and returns you to the bookings list.
                  </p>
                </div>

              </div>{/* end left */}

              {/* RIGHT SIDEBAR */}
              <div className="w-full lg:w-72 xl:w-80 flex-shrink-0">
                <div className="lg:sticky lg:top-20">
                  <LiveSummary watch={watch} selectedServices={services}/>
                </div>
              </div>

            </div>
          </form>
        )}
      </div>
    </div>
  );
}