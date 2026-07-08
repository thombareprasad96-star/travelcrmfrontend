import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import bookingService                from "../services/bookingService";
import CancelBookingModal            from "./CancelBookingModal";
import { hasPermission, P }          from "@shared/lib/access";
import {
  FiSearch, FiRefreshCw, FiFilter, FiDownload,
  FiChevronDown, FiChevronUp, FiEye, FiEdit2,
  FiTrash2, FiX, FiPrinter, FiCheck, FiAlertCircle,
  FiChevronLeft, FiChevronRight, FiTrendingUp,
} from "react-icons/fi";
import {
  FaPlane, FaAngleDoubleLeft, FaAngleDoubleRight,
  FaRupeeSign, FaCheckCircle, FaTimesCircle,
  FaFileInvoiceDollar, FaHandHoldingUsd,
} from "react-icons/fa";
import { MdOutlineReceiptLong } from "react-icons/md";

/* ─── CONSTANTS ──────────────────────────────────────────────── */
export const BOOKING_STATUSES = ["Confirmed","Pending","Cancelled","Completed","Refunded"];
export const PAY_STATUSES     = ["Paid","Partial","Unpaid","Refunded"];
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const STATUS_STYLE = {
  Confirmed: "bg-green-100  text-green-700  border border-green-200",
  Pending:   "bg-amber-100  text-amber-700  border border-amber-200",
  Cancelled: "bg-red-100    text-red-600    border border-red-200",
  Completed: "bg-blue-100   text-blue-700   border border-blue-200",
  Refunded:  "bg-purple-100 text-purple-700 border border-purple-200",
};
const PAY_STYLE = {
  Paid:     "bg-emerald-100 text-emerald-700",
  Partial:  "bg-orange-100  text-orange-700",
  Unpaid:   "bg-rose-100    text-rose-700",
  Refunded: "bg-slate-100   text-slate-600",
};
const STATUS_DOT = {
  Confirmed:"bg-green-500", Pending:"bg-amber-500",
  Cancelled:"bg-red-500",   Completed:"bg-blue-500", Refunded:"bg-purple-500",
};

const STAT_CARDS = [
  { key:"total",     label:"Total Bookings", icon:<FaPlane/>,             gradient:"from-cyan-500   to-cyan-600",     money:false },
  { key:"confirmed", label:"Confirmed",      icon:<FaCheckCircle/>,       gradient:"from-green-500  to-emerald-600",  money:false },
  { key:"revenue",   label:"Total Revenue",  icon:<FaRupeeSign/>,         gradient:"from-amber-500  to-orange-500",   money:true  },
  { key:"net",       label:"Net Revenue",    icon:<FaHandHoldingUsd/>,    gradient:"from-blue-600   to-blue-700",     money:true  },
  { key:"refunds",   label:"Refunds",        icon:<FaTimesCircle/>,       gradient:"from-rose-500   to-red-600",      money:true  },
  { key:"profit",    label:"Net Profit",     icon:<FaFileInvoiceDollar/>, gradient:"from-slate-600  to-slate-700",    money:true  },
];

/* ─── HELPERS ────────────────────────────────────────────────── */
export const fmtINR  = n => "₹" + Number(n||0).toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2});
export const fmtDate = d => d ? new Date(d).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}) : "—";
const titleCase = s => s ? s.charAt(0).toUpperCase()+s.slice(1).toLowerCase() : s;

function normalizeBooking(b={}) {
  return {
    id:             b.publicId,
    code:           b.bookingCode,
    customer:       b.customerNameSnapshot,
    createdBy:      b.createdBy,
    destination:    b.destinationSnapshot,
    services:       Array.isArray(b.services) ? b.services : [],
    bookingDate:    b.bookingDate,
    travelDate:     b.travelDate,
    customerAmount: Number(b.customerAmount)||0,
    vendorCost:     Number(b.vendorCost)||0,
    gst:            Number(b.gst)||0,
    tcs:            Number(b.tcs)||0,
    totalPayable:   Number(b.totalPayable)||0,
    paid:           Number(b.paidAmount)||0,
    netProfit:      Number(b.netProfit)||0,
    status:         titleCase(b.status),
    payStatus:      titleCase(b.paymentStatus),
  };
}

const EMPTY = [];
const selectCls = "w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 font-medium focus:border-blue-400 focus:ring-2 focus:ring-blue-50 outline-none appearance-none cursor-pointer transition-all hover:border-slate-300";
const inputCls  = "w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 placeholder-slate-400 font-medium focus:border-blue-400 focus:ring-2 focus:ring-blue-50 outline-none transition-all hover:border-slate-300";

/* ─── TOAST ──────────────────────────────────────────────────── */
function Toast({ msg, type, onClose }) {
  useEffect(()=>{ const t=setTimeout(onClose,3500); return()=>clearTimeout(t); },[onClose]);
  return (
    <div className={`fixed top-5 right-5 z-[999] flex items-center gap-3 px-4 py-3.5 rounded-2xl border shadow-2xl max-w-sm
      ${type==="success"?"bg-green-50 border-green-200 text-green-800":"bg-red-50 border-red-200 text-red-800"}`}
      style={{animation:"slideIn .3s ease both"}}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
        ${type==="success"?"bg-green-100":"bg-red-100"}`}>
        {type==="success"?<FiCheck className="w-4 h-4 text-green-600"/>:<FiAlertCircle className="w-4 h-4 text-red-600"/>}
      </div>
      <p className="text-sm font-semibold flex-1">{msg}</p>
      <button onClick={onClose} className="opacity-50 hover:opacity-100 transition-opacity">
        <FiX className="w-4 h-4"/>
      </button>
    </div>
  );
}

/* ─── STAT CARD with animate counter ────────────────────────── */
function StatCard({ card, value }) {
  const [disp, setDisp] = useState(0);
  const raf = useRef(null);
  useEffect(()=>{
    cancelAnimationFrame(raf.current);
    const target = Number(value)||0;
    if (!target) { setDisp(0); return; }
    const start = performance.now();
    const step = ts => {
      const p = Math.min((ts-start)/1000,1);
      const ease = 1-Math.pow(1-p,3);
      setDisp(Math.round(ease*target));
      if (p<1) raf.current=requestAnimationFrame(step);
    };
    raf.current=requestAnimationFrame(step);
    return()=>cancelAnimationFrame(raf.current);
  },[value]);

  return (
    <div className={`bg-gradient-to-br ${card.gradient} rounded-2xl p-5 text-white
      shadow-lg relative overflow-hidden group hover:-translate-y-1 hover:shadow-xl transition-all duration-300`}>
      <div className="absolute -right-5 -top-5 w-24 h-24 rounded-full bg-white/10 group-hover:scale-110 transition-transform duration-500"/>
      <div className="absolute -right-2 -bottom-7 w-20 h-20 rounded-full bg-white/10"/>
      <div className="relative z-10 flex items-start justify-between">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-widest opacity-80 mb-1">{card.label}</p>
          <p className="text-2xl sm:text-3xl font-extrabold leading-none">
            {card.money ? fmtINR(disp) : disp}
          </p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl flex-shrink-0">
          {card.icon}
        </div>
      </div>
    </div>
  );
}

/* ─── BOOKING DETAIL MODAL ───────────────────────────────────── */
function BookingModal({ booking, onClose, onEdit, onCancel }) {
  if (!booking) return null;
  const canCancel = hasPermission(P.BOOKING_CANCEL) &&
    booking.status!=="Completed" && booking.status!=="Cancelled";
  const payPct = booking.totalPayable>0 ? Math.round(booking.paid/booking.totalPayable*100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}/>
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto"
        style={{animation:"popIn .25s ease both"}}>
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-500 px-6 py-5 rounded-t-3xl flex items-start justify-between">
          <div>
            <p className="text-blue-200 text-[10px] font-extrabold uppercase tracking-widest mb-1">Booking Detail</p>
            <h2 className="text-white text-xl font-extrabold tracking-tight">{booking.code}</h2>
            <p className="text-blue-100 text-sm mt-0.5">{booking.customer}</p>
          </div>
          <button onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all">
            <FiX className="w-4 h-4"/>
          </button>
        </div>
        <div className="p-6 space-y-5">
          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <span className={`px-3 py-1.5 rounded-full text-xs font-extrabold flex items-center gap-1.5 ${STATUS_STYLE[booking.status]}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[booking.status]}`}/>{booking.status}
            </span>
            <span className={`px-3 py-1.5 rounded-full text-xs font-extrabold ${PAY_STYLE[booking.payStatus]}`}>
              💳 {booking.payStatus}
            </span>
            {booking.services?.map(s=>(
              <span key={s} className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">{s}</span>
            ))}
          </div>
          {/* Detail grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              ["📍","Destination",  booking.destination],
              ["📅","Travel Date",  fmtDate(booking.travelDate)],
              ["🗓️","Booking Date", fmtDate(booking.bookingDate)],
              ["👤","Created By",   booking.createdBy],
              ["💰","Customer Amt", fmtINR(booking.customerAmount)],
              ["🏷️","Vendor Cost",  fmtINR(booking.vendorCost)],
              ["🧾","GST (5%)",     fmtINR(booking.gst)],
              ["📋","TCS (5%)",     fmtINR(booking.tcs)],
              ["💳","Total Payable",fmtINR(booking.totalPayable)],
            ].map(([icon,label,val])=>(
              <div key={label} className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide mb-1">{icon} {label}</p>
                <p className="text-sm font-extrabold text-slate-700">{val}</p>
              </div>
            ))}
          </div>
          {/* Payment progress */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-extrabold text-slate-600">Payment Progress</p>
              <p className={`text-sm font-extrabold ${payPct===100?"text-green-600":"text-blue-600"}`}>{payPct}%</p>
            </div>
            <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-700
                ${payPct===100?"bg-gradient-to-r from-green-500 to-emerald-500"
                :payPct>0?"bg-gradient-to-r from-blue-500 to-indigo-500":"bg-slate-300"}`}
                style={{width:`${payPct}%`}}/>
            </div>
            <div className="flex justify-between text-xs font-medium text-slate-400">
              <span>Paid: {fmtINR(booking.paid)}</span>
              <span>Due: {fmtINR(Math.max(0,booking.totalPayable-booking.paid))}</span>
            </div>
          </div>
          {/* Net profit */}
          <div className={`rounded-2xl p-4 border flex items-center gap-4
            ${booking.netProfit>=0?"bg-green-50 border-green-100":"bg-red-50 border-red-100"}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl
              ${booking.netProfit>=0?"bg-green-100":"bg-red-100"}`}>
              {booking.netProfit>=0?"📈":"📉"}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500">Net Profit</p>
              <p className={`text-xl font-extrabold ${booking.netProfit>=0?"text-green-700":"text-red-600"}`}>
                {fmtINR(booking.netProfit)}
              </p>
            </div>
          </div>
          {/* Actions */}
          <div className="flex flex-wrap gap-2.5 pt-1">
            <button onClick={()=>{onClose();onEdit?.(booking);}}
              className="flex-1 min-w-[120px] flex items-center justify-center gap-2 py-3 rounded-2xl
                bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600
                text-white text-sm font-bold shadow-md shadow-blue-200 transition-all">
              <FiEdit2 className="w-4 h-4"/> Edit Booking
            </button>
            {canCancel && (
              <button onClick={()=>{onClose();onCancel?.(booking);}}
                className="flex-1 min-w-[120px] flex items-center justify-center gap-2 py-3 rounded-2xl
                  bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 text-sm font-bold transition-all">
                <FiX className="w-4 h-4"/> Cancel Booking
              </button>
            )}
            <button className="flex-1 min-w-[120px] flex items-center justify-center gap-2 py-3 rounded-2xl
              bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 text-sm font-bold transition-all">
              <FiPrinter className="w-4 h-4"/> Print
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── MOBILE BOOKING CARD ────────────────────────────────────── */
function MobileBookingCard({ b, onView, onEdit, onCancel, onDelete }) {
  const canCancel = hasPermission(P.BOOKING_CANCEL) && b.status!=="Completed" && b.status!=="Cancelled";
  const payPct = b.totalPayable>0 ? Math.round(b.paid/b.totalPayable*100) : 0;
  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-4 space-y-3
      hover:shadow-md hover:border-blue-200 transition-all duration-200">
      <div className="h-1 -mx-4 -mt-4 rounded-t-2xl bg-gradient-to-r from-blue-500 to-indigo-500 mb-3"/>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100">
              {b.code}
            </span>
            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 ${STATUS_STYLE[b.status]}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[b.status]}`}/>{b.status}
            </span>
          </div>
          <p className="font-extrabold text-slate-800 text-sm truncate">{b.customer}</p>
          <p className="text-xs text-slate-400 mt-0.5">📍 {b.destination}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-base font-extrabold text-slate-800">{fmtINR(b.totalPayable)}</p>
          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${PAY_STYLE[b.payStatus]}`}>
            {b.payStatus}
          </span>
        </div>
      </div>
      {b.services?.length>0&&(
        <div className="flex flex-wrap gap-1.5">
          {b.services.map(s=>(
            <span key={s} className="text-[10px] bg-slate-100 text-slate-500 font-semibold px-2 py-0.5 rounded-full">{s}</span>
          ))}
        </div>
      )}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>📅 {fmtDate(b.travelDate)}</span>
        <span className={`font-extrabold ${b.netProfit>=0?"text-green-600":"text-red-500"}`}>
          {b.netProfit>=0?"📈":"📉"} {fmtINR(b.netProfit)}
        </span>
      </div>
      <div className="space-y-1">
        <div className="flex justify-between text-[10px] text-slate-400 font-medium">
          <span>Payment Progress</span><span>{payPct}%</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-700
            ${payPct===100?"bg-green-500":payPct>0?"bg-blue-500":"bg-slate-200"}`}
            style={{width:`${payPct}%`}}/>
        </div>
      </div>
      {/* 2×2 amount grid */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        {[
          {label:"Customer Amt",value:fmtINR(b.customerAmount),cls:"text-blue-600 font-bold"},
          {label:"Total Payable",value:fmtINR(b.totalPayable),  cls:"text-slate-700 font-bold"},
          {label:"GST + TCS",   value:fmtINR(b.gst+b.tcs),    cls:"text-amber-600 font-bold"},
          {label:"Vendor Cost", value:fmtINR(b.vendorCost),    cls:"text-slate-600 font-bold"},
        ].map(({label,value,cls})=>(
          <div key={label} className="bg-slate-50 rounded-xl px-3 py-2 border border-slate-100">
            <p className="text-slate-400 text-[10px]">{label}</p>
            <p className={cls}>{value}</p>
          </div>
        ))}
      </div>
      <div className="flex gap-2 pt-1">
        <button onClick={()=>onView(b)}
          className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600
            text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md shadow-blue-200">
          <FiEye className="w-3.5 h-3.5"/> View
        </button>
        <button onClick={()=>onEdit?.(b)}
          className="flex-1 py-2.5 rounded-xl bg-green-50 hover:bg-green-100 text-green-700 border border-green-200
            text-xs font-bold transition-all flex items-center justify-center gap-1.5">
          <FiEdit2 className="w-3.5 h-3.5"/> Edit
        </button>
        {canCancel&&(
          <button onClick={()=>onCancel?.(b)}
            className="flex-1 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200
              text-xs font-bold transition-all flex items-center justify-center gap-1.5">
            <FiX className="w-3.5 h-3.5"/> Cancel
          </button>
        )}
        <button onClick={()=>onDelete(b.id)}
          className="w-10 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 border border-red-200
            text-xs font-bold transition-all flex items-center justify-center">
          <FiTrash2 className="w-3.5 h-3.5"/>
        </button>
      </div>
    </div>
  );
}

/* ─── SKELETON ROW ───────────────────────────────────────────── */
function SkeletonRow() {
  return (
    <tr>
      {[...Array(13)].map((_,i)=>(
        <td key={i} className="px-3 py-4">
          <div className="h-4 rounded-lg bg-slate-200 animate-pulse" style={{width:`${35+Math.random()*55}%`}}/>
        </td>
      ))}
    </tr>
  );
}

/* ─── SORTABLE HEADER ────────────────────────────────────────── */
function TH({ label, sKey, sortKey, sortDir, onSort, right }) {
  const active = sortKey===sKey;
  return (
    <th onClick={sKey?()=>onSort(sKey):undefined}
      className={`px-3 py-3.5 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-wider
        whitespace-nowrap select-none ${sKey?"cursor-pointer hover:text-blue-600 transition-colors":""}
        ${right?"text-right":""}`}>
      <span className={`inline-flex items-center gap-1 ${right?"justify-end w-full":""}`}>
        {label}
        {sKey&&<span className={active?"text-blue-500":"opacity-25"}>{active?(sortDir==="asc"?"↑":"↓"):"↕"}</span>}
      </span>
    </th>
  );
}

/* ─── SELECT WRAPPER ─────────────────────────────────────────── */
function Sel({ value, onChange, options, className="" }) {
  return (
    <div className={`relative ${className}`}>
      <select value={value} onChange={e=>onChange(e.target.value)}
        className={selectCls+" pr-9"}>
        {options.map(o=><option key={o}>{o}</option>)}
      </select>
      <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none"/>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════
   MAIN PAGE
═════════════════════════════════════════════════════════════ */
export default function BookingsPage({
  bookings: propBookings = EMPTY,
  loading:  propLoading  = false,
  onEdit,
  onRefresh,
}) {
  const navigate = useNavigate();
  const [bookings,      setBookings]      = useState(propBookings);
  const [loading,       setLoading]       = useState(propLoading);
  // filters
  const [search,        setSearch]        = useState("");
  const [filterStatus,  setFilterStatus]  = useState("All Status");
  const [filterPay,     setFilterPay]     = useState("All Payment Status");
  const [filterMonth,   setFilterMonth]   = useState("All Booking Months");
  const [filterTravel,  setFilterTravel]  = useState("All Travel Months");
  const [filtersOpen,   setFiltersOpen]   = useState(true);
  // sort + page
  const [sortKey,  setSortKey]  = useState("id");
  const [sortDir,  setSortDir]  = useState("desc");
  const [page,     setPage]     = useState(1);
  const perPage = 10;
  // selection + modals
  const [selected,      setSelected]      = useState(new Set());
  const [modal,         setModal]         = useState(null);
  const [cancelBooking, setCancelBooking] = useState(null);
  const [toast,         setToast]         = useState(null);

  const showToast = useCallback((msg,type="success")=>setToast({msg,type}),[]);
  const selfManaged = propBookings.length===0;

  const fetchBookings = useCallback(async()=>{
    setLoading(true);
    try {
      const res=await bookingService.getAll(0,500);
      const body=res.data;
      const raw=Array.isArray(body?.data)?body.data:Array.isArray(body)?body:[];
      setBookings(raw.map(normalizeBooking));
    } catch { showToast("Failed to load bookings.","error"); }
    finally { setLoading(false); }
  },[showToast]);

  useEffect(()=>{
    if (selfManaged){fetchBookings();return;}
    setBookings(propBookings); setLoading(propLoading);
  },[propBookings,propLoading,selfManaged,fetchBookings]);

  /* stats */
  const stats = useMemo(()=>({
    total:     bookings.length,
    confirmed: bookings.filter(b=>b.status==="Confirmed").length,
    revenue:   bookings.reduce((s,b)=>s+(b.customerAmount||0),0),
    net:       bookings.reduce((s,b)=>s+(b.paid||0),0),
    refunds:   bookings.filter(b=>b.payStatus==="Refunded").reduce((s,b)=>s+(b.paid||0),0),
    profit:    bookings.reduce((s,b)=>s+(b.netProfit||0),0),
  }),[bookings]);

  /* filtered + sorted */
  const filtered = useMemo(()=>{
    let out=[...bookings];
    const q=search.toLowerCase();
    if(q) out=out.filter(b=>(b.code||"").toLowerCase().includes(q)||(b.customer||"").toLowerCase().includes(q)||(b.destination||"").toLowerCase().includes(q));
    if(filterStatus!=="All Status")         out=out.filter(b=>b.status===filterStatus);
    if(filterPay!=="All Payment Status")    out=out.filter(b=>b.payStatus===filterPay);
    if(filterMonth!=="All Booking Months"){ const mi=MONTHS.indexOf(filterMonth)+1; out=out.filter(b=>new Date(b.bookingDate).getMonth()+1===mi); }
    if(filterTravel!=="All Travel Months"){ const mi=MONTHS.indexOf(filterTravel)+1; out=out.filter(b=>new Date(b.travelDate).getMonth()+1===mi); }
    out.sort((a,b)=>{
      let av=a[sortKey],bv=b[sortKey];
      if(typeof av==="string"){av=av.toLowerCase();bv=bv.toLowerCase();}
      if(av<bv) return sortDir==="asc"?-1:1;
      if(av>bv) return sortDir==="asc"?1:-1;
      return 0;
    });
    return out;
  },[bookings,search,filterStatus,filterPay,filterMonth,filterTravel,sortKey,sortDir]);

  const totalPages = Math.max(1,Math.ceil(filtered.length/perPage));
  const pageData   = filtered.slice((page-1)*perPage,page*perPage);

  /* handlers */
  const handleSort = key => {
    if(sortKey===key) setSortDir(d=>d==="asc"?"desc":"asc");
    else { setSortKey(key); setSortDir("asc"); }
  };
  const toggleSelect = id => setSelected(s=>{const n=new Set(s);n.has(id)?n.delete(id):n.add(id);return n;});
  const toggleAll    = () => selected.size===pageData.length?setSelected(new Set()):setSelected(new Set(pageData.map(b=>b.id)));
  const openEdit   = b => {
    if (onEdit) { onEdit(b); return; }
    navigate(`/EditBooking/${b.id}`);
  };
  const openCancel = b => setCancelBooking(b);
  const refreshList = onRefresh||fetchBookings;

  const handleDelete = useCallback(id=>{
    setBookings(p=>p.filter(b=>b.id!==id));
    setSelected(s=>{const n=new Set(s);n.delete(id);return n;});
    showToast("Booking deleted successfully.");
  },[showToast]);

  const handleBulkDelete = () => {
    setBookings(p=>p.filter(b=>!selected.has(b.id)));
    showToast(`${selected.size} booking(s) deleted.`);
    setSelected(new Set());
  };

  const resetFilters = () => {
    setSearch("");setFilterStatus("All Status");setFilterPay("All Payment Status");
    setFilterMonth("All Booking Months");setFilterTravel("All Travel Months");setPage(1);
  };

  const anyFilter = search||filterStatus!=="All Status"||filterPay!=="All Payment Status"
    ||filterMonth!=="All Booking Months"||filterTravel!=="All Travel Months";

  const activeFilterCount = [search,filterStatus!=="All Status",filterPay!=="All Payment Status",
    filterMonth!=="All Booking Months",filterTravel!=="All Travel Months"].filter(Boolean).length;

  /* page-level sums (tax strip) */
  const pageSum = {
    totalPayable: pageData.reduce((s,b)=>s+(b.totalPayable||0),0),
    profit:       pageData.reduce((s,b)=>s+(b.netProfit||0),0),
    gst:          pageData.reduce((s,b)=>s+(b.gst||0),0),
    tcs:          pageData.reduce((s,b)=>s+(b.tcs||0),0),
  };

  const thProps = { sortKey, sortDir, onSort:handleSort };

  /* CSV export */
  const handleExportCSV = () => {
    const headers = ["Booking Code","Customer","Destination","Travel Date","Customer Amt","GST","TCS","Total Payable","Paid","Net Profit","Status","Payment Status"];
    const rows = filtered.map(b=>[b.code,b.customer,b.destination,fmtDate(b.travelDate),b.customerAmount,b.gst,b.tcs,b.totalPayable,b.paid,b.netProfit,b.status,b.payStatus]);
    const csv  = [headers,...rows].map(r=>r.join(",")).join("\n");
    const blob = new Blob([csv],{type:"text/csv"});
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href=url; a.download="bookings-export.csv"; a.click();
    URL.revokeObjectURL(url);
    showToast("CSV exported successfully.");
  };

  /* ─── RENDER ──────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100"
      style={{fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        @keyframes slideIn { from{transform:translateX(110%);opacity:0} to{transform:translateX(0);opacity:1} }
        @keyframes popIn   { from{transform:scale(.92);opacity:0} to{transform:scale(1);opacity:1} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .fade-up { animation:fadeUp .4s ease both; }
        select   { -webkit-appearance:none; appearance:none; }
        ::-webkit-scrollbar{width:5px;height:5px}
        ::-webkit-scrollbar-track{background:#f1f5f9;border-radius:99px}
        ::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:99px}
      `}</style>

      {/* modals + toast */}
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}
      {modal && <BookingModal booking={modal} onClose={()=>setModal(null)} onEdit={openEdit} onCancel={openCancel}/>}
      {cancelBooking && <CancelBookingModal booking={cancelBooking} onClose={()=>setCancelBooking(null)} onCancelled={refreshList} onToast={showToast}/>}

      {/* ── PAGE HEADER ── */}
      <div className="bg-white/70 backdrop-blur-md border-b border-slate-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600
                flex items-center justify-center text-white shadow-lg shadow-blue-200 flex-shrink-0">
                <FaPlane className="w-5 h-5"/>
              </div>
              <div>
                <h1 className="text-lg font-extrabold text-slate-800 tracking-tight">Bookings</h1>
                <p className="text-xs text-slate-400 hidden sm:block">
                  <span className="hover:text-blue-600 cursor-pointer transition-colors">Home</span>
                  <span className="mx-1 text-slate-300">/</span>
                  <span className="text-blue-600 font-bold">All Bookings</span>
                </p>
              </div>
            </div>
            <button onClick={()=>window.location.href="/allleads"}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl
                bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600
                text-white text-sm font-bold shadow-md shadow-blue-200 hover:shadow-lg transition-all self-start sm:self-auto">
              ＋ Create from Lead
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-5 space-y-5">

        {/* ── 6 STAT CARDS ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
          {STAT_CARDS.map((card,i)=>(
            <div key={card.key} className="fade-up" style={{animationDelay:`${i*40}ms`}}>
              <StatCard card={card} value={stats[card.key]}/>
            </div>
          ))}
        </div>

        {/* ── TAX & PROFIT SUMMARY ── */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/60 shadow-sm px-5 py-4 fade-up">
          <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            <MdOutlineReceiptLong className="w-3.5 h-3.5 text-blue-500"/>
            Tax &amp; Profit Summary — Current Page ({pageData.length} bookings)
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {icon:"💵",label:"Total Charges",  value:pageSum.totalPayable, bg:"bg-blue-50",   border:"border-blue-100",   text:"text-blue-700"   },
              {icon:"📈",label:"Net Profit",     value:pageSum.profit,       bg:"bg-green-50",  border:"border-green-100",  text:"text-green-700"  },
              {icon:"🧾",label:"GST Collected",  value:pageSum.gst,          bg:"bg-amber-50",  border:"border-amber-100",  text:"text-amber-700"  },
              {icon:"📋",label:"TCS Collected",  value:pageSum.tcs,          bg:"bg-purple-50", border:"border-purple-100", text:"text-purple-700" },
            ].map(({icon,label,value,bg,border,text})=>(
              <div key={label} className={`${bg} border ${border} rounded-xl px-4 py-3`}>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wide mb-0.5">{icon} {label}</p>
                <p className={`text-base font-extrabold ${text}`}>{fmtINR(value)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── BOOKING LIST CARD ── */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden fade-up">

          {/* ── COLLAPSIBLE FILTER HEADER (dark slate — matches Reports pages) ── */}
          <button type="button" onClick={()=>setFiltersOpen(v=>!v)}
            className="w-full flex items-center justify-between px-5 py-4 bg-slate-600 hover:bg-slate-700 transition-colors">
            <div className="flex items-center gap-2.5">
              <FiFilter className="w-4 h-4 text-white"/>
              <span className="text-sm font-extrabold text-white">Filters &amp; Search</span>
              {activeFilterCount>0 && (
                <span className="bg-blue-400 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                  {activeFilterCount} active
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              {anyFilter && (
                <button type="button" onClick={e=>{e.stopPropagation();resetFilters();}}
                  className="text-white/70 hover:text-white text-xs font-bold transition-colors">
                  Clear all
                </button>
              )}
              {filtersOpen
                ?<FiChevronUp   className="w-4 h-4 text-white"/>
                :<FiChevronDown className="w-4 h-4 text-white"/>}
            </div>
          </button>

          {/* Filter body */}
          {filtersOpen && (
            <div className="p-5 space-y-4 border-b border-slate-100 bg-slate-50/60"
              style={{animation:"fadeUp .25s ease both"}}>
              {/* Row 1: Search + Status + Payment */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                <div className="lg:col-span-2">
                  <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wide mb-1.5">Search</label>
                  <div className="relative">
                    <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/>
                    <input type="text" value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}}
                      placeholder="Booking code, customer, destination…"
                      className={inputCls+" pl-10"}/>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wide mb-1.5">Status</label>
                  <Sel value={filterStatus} onChange={v=>{setFilterStatus(v);setPage(1);}}
                    options={["All Status",...BOOKING_STATUSES]}/>
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wide mb-1.5">Payment</label>
                  <Sel value={filterPay} onChange={v=>{setFilterPay(v);setPage(1);}}
                    options={["All Payment Status",...PAY_STATUSES]}/>
                </div>
              </div>
              {/* Row 2: Month filters + action buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                <div>
                  <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wide mb-1.5">Booking Month</label>
                  <Sel value={filterMonth} onChange={v=>{setFilterMonth(v);setPage(1);}}
                    options={["All Booking Months",...MONTHS]}/>
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wide mb-1.5">Travel Month</label>
                  <Sel value={filterTravel} onChange={v=>{setFilterTravel(v);setPage(1);}}
                    options={["All Travel Months",...MONTHS]}/>
                </div>
                <div className="flex items-end gap-3 lg:col-span-2">
                  <button onClick={refreshList}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-slate-200 hover:border-slate-300
                      bg-white hover:bg-slate-50 text-slate-600 text-sm font-bold transition-all h-[42px]">
                    <FiRefreshCw className={`w-3.5 h-3.5 ${loading?"animate-spin":""}`}/> Refresh
                  </button>
                  <button onClick={handleExportCSV}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700
                      text-white text-sm font-bold shadow-md shadow-emerald-200 transition-all h-[42px]">
                    <FiDownload className="w-3.5 h-3.5"/> Export CSV
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── TABLE TOOLBAR ── */}
          <div className="px-5 py-3.5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-xs font-extrabold bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full border border-blue-200">
                {filtered.length} bookings
              </span>
              {selected.size>0 && (
                <button onClick={handleBulkDelete}
                  className="flex items-center gap-1.5 text-xs bg-red-50 hover:bg-red-100 text-red-600
                    border border-red-200 font-bold px-3 py-1.5 rounded-xl transition-all">
                  <FiTrash2 className="w-3 h-3"/> Delete {selected.size} selected
                </button>
              )}
            </div>
            <p className="text-xs text-slate-400">
              Page {page} of {totalPages} · {pageData.length} shown
            </p>
          </div>

          {/* ── DESKTOP TABLE ── */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              <thead className="bg-slate-50/80 border-b border-slate-100">
                <tr>
                  <th className="px-3 py-3.5 w-10">
                    <input type="checkbox"
                      checked={pageData.length>0&&selected.size===pageData.length}
                      onChange={toggleAll}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer"/>
                  </th>
                  <TH label="Booking Code" sKey="code"           {...thProps}/>
                  <TH label="Customer"     sKey="customer"       {...thProps}/>
                  <TH label="Destination"/>
                  <TH label="Travel Date"  sKey="travelDate"     {...thProps}/>
                  <TH label="Amt"          sKey="customerAmount" {...thProps} right/>
                  <TH label="GST"          right/>
                  <TH label="TCS"          right/>
                  <TH label="Total"        sKey="totalPayable"   {...thProps} right/>
                  <TH label="Payment"/>
                  <TH label="Profit"       sKey="netProfit"      {...thProps} right/>
                  <TH label="Status"       sKey="status"         {...thProps}/>
                  <TH label="Actions"/>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading
                  ? [...Array(6)].map((_,i)=><SkeletonRow key={i}/>)
                  : pageData.length===0
                  ? (
                    <tr>
                      <td colSpan={13} className="text-center py-20">
                        <FaPlane className="text-5xl text-slate-200 mx-auto mb-3"/>
                        <p className="text-base font-extrabold text-slate-600 mb-1">No Bookings Found</p>
                        <p className="text-sm text-slate-400 mb-4">Try adjusting your filters.</p>
                        {anyFilter && (
                          <button onClick={resetFilters}
                            className="px-5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold text-sm transition-all">
                            Reset Filters
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                  : pageData.map((b,idx)=>{
                    const payPct=b.totalPayable>0?Math.round(b.paid/b.totalPayable*100):0;
                    return (
                      <tr key={b.id}
                        className="group hover:bg-blue-50/30 hover:shadow-[inset_3px_0_0_#2563eb] transition-all duration-150"
                        style={{animation:"fadeUp .35s ease both",animationDelay:`${idx*18}ms`}}>
                        {/* checkbox */}
                        <td className="px-3 py-3.5">
                          <input type="checkbox" checked={selected.has(b.id)} onChange={()=>toggleSelect(b.id)}
                            className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer"/>
                        </td>
                        {/* code */}
                        <td className="px-3 py-3.5">
                          <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
                            {b.code}
                          </span>
                        </td>
                        {/* customer */}
                        <td className="px-3 py-3.5">
                          <p className="text-sm font-bold text-slate-800">{b.customer}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">{b.createdBy}</p>
                        </td>
                        {/* destination */}
                        <td className="px-3 py-3.5">
                          <p className="text-xs font-semibold text-slate-600 max-w-[120px] truncate">{b.destination}</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {b.services?.slice(0,2).map(s=>(
                              <span key={s} className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">{s}</span>
                            ))}
                            {b.services?.length>2&&<span className="text-[10px] text-slate-400">+{b.services.length-2}</span>}
                          </div>
                        </td>
                        {/* travel date */}
                        <td className="px-3 py-3.5 text-sm font-semibold text-slate-600 whitespace-nowrap">
                          {fmtDate(b.travelDate)}
                        </td>
                        {/* customer amount */}
                        <td className="px-3 py-3.5 text-sm font-bold text-blue-600 text-right whitespace-nowrap">
                          {fmtINR(b.customerAmount)}
                        </td>
                        {/* gst */}
                        <td className="px-3 py-3.5 text-xs text-slate-500 text-right whitespace-nowrap">
                          {fmtINR(b.gst)}
                        </td>
                        {/* tcs */}
                        <td className="px-3 py-3.5 text-xs text-slate-500 text-right whitespace-nowrap">
                          {fmtINR(b.tcs)}
                        </td>
                        {/* total + mini bar */}
                        <td className="px-3 py-3.5 text-right">
                          <p className="text-sm font-extrabold text-slate-800 whitespace-nowrap">{fmtINR(b.totalPayable)}</p>
                          <div className="w-full h-1 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                            <div className={`h-full rounded-full ${payPct===100?"bg-green-500":payPct>0?"bg-blue-400":"bg-slate-200"}`}
                              style={{width:`${payPct}%`}}/>
                          </div>
                          {b.totalPayable>b.paid&&<p className="text-[10px] text-red-500 font-bold mt-0.5 text-right">Due: {fmtINR(b.totalPayable-b.paid)}</p>}
                        </td>
                        {/* payment */}
                        <td className="px-3 py-3.5">
                          <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full ${PAY_STYLE[b.payStatus]}`}>
                            {b.payStatus}
                          </span>
                        </td>
                        {/* net profit */}
                        <td className="px-3 py-3.5 text-right whitespace-nowrap">
                          <span className={`text-sm font-extrabold ${b.netProfit>=0?"text-green-600":"text-red-500"}`}>
                            {fmtINR(b.netProfit)}
                          </span>
                        </td>
                        {/* status */}
                        <td className="px-3 py-3.5">
                          <span className={`inline-flex items-center gap-1.5 text-[10px] font-extrabold px-2.5 py-1 rounded-full ${STATUS_STYLE[b.status]}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[b.status]}`}/>{b.status}
                          </span>
                        </td>
                        {/* actions (fade in on hover) */}
                        <td className="px-3 py-3.5">
                          <div className="flex items-center gap-1.5 opacity-50 group-hover:opacity-100 transition-opacity duration-150">
                            {/* // onClick={()=>setModal(b)}  */}
                            <button onClick={()=>navigate(`/BookingDetails/${b.id}`)} title="View"
                              className="w-8 h-8 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 flex items-center justify-center transition-all border border-blue-100">
                              <FiEye className="w-3.5 h-3.5"/>
                            </button>
                            <button onClick={()=>openEdit(b)} title="Edit"
                              className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 flex items-center justify-center transition-all border border-slate-200">
                              <FiEdit2 className="w-3.5 h-3.5"/>
                            </button>
                            {hasPermission(P.BOOKING_CANCEL)&&b.status!=="Completed"&&b.status!=="Cancelled"&&(
                              <button onClick={()=>openCancel(b)} title="Cancel"
                                className="w-8 h-8 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-600 flex items-center justify-center transition-all border border-amber-100">
                                <FiX className="w-3.5 h-3.5"/>
                              </button>
                            )}
                            <button onClick={()=>handleDelete(b.id)} title="Delete"
                              className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-600 flex items-center justify-center transition-all border border-red-100">
                              <FiTrash2 className="w-3.5 h-3.5"/>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>

          {/* ── MOBILE CARDS ── */}
          <div className="md:hidden p-4 space-y-3">
            {loading
              ? [...Array(3)].map((_,i)=>(
                  <div key={i} className="bg-white rounded-2xl border border-slate-100 p-4 space-y-2 animate-pulse">
                    {[...Array(4)].map((_,j)=>(
                      <div key={j} className="h-4 rounded-lg bg-slate-200" style={{width:`${40+Math.random()*50}%`}}/>
                    ))}
                  </div>
                ))
              : pageData.length===0
              ? (
                <div className="text-center py-16">
                  <FaPlane className="text-5xl text-slate-200 mx-auto mb-3"/>
                  <p className="text-base font-extrabold text-slate-600 mb-1">No Bookings Found</p>
                  {anyFilter&&<button onClick={resetFilters} className="mt-2 text-sm text-blue-600 hover:underline font-bold">Clear filters</button>}
                </div>
              )
              // onView={setModal}
              : pageData.map(b=>(
                  <MobileBookingCard key={b.id} b={b} onView={b=>navigate(`/BookingDetails/${b.id}`)} onEdit={openEdit} onCancel={openCancel} onDelete={handleDelete}/>
                ))
            }
          </div>

          {/* ── PAGINATION ── */}
          {filtered.length>0&&(
            <div className="px-5 py-4 border-t border-slate-100 bg-slate-50/60
              flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-slate-400 font-medium">
                Showing{" "}
                <span className="font-bold text-slate-600">{(page-1)*perPage+1}</span>–
                <span className="font-bold text-slate-600">{Math.min(page*perPage,filtered.length)}</span>
                {" "}of{" "}
                <span className="font-bold text-slate-600">{filtered.length}</span>
              </p>
              <div className="flex items-center gap-1.5">
                <button disabled={page===1} onClick={()=>setPage(1)}
                  className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-500 text-xs font-bold
                    hover:border-blue-300 hover:text-blue-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center">
                  <FaAngleDoubleLeft className="text-xs"/>
                </button>
                <button disabled={page===1} onClick={()=>setPage(p=>p-1)}
                  className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-500 text-xs font-bold
                    hover:border-blue-300 hover:text-blue-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center">
                  <FiChevronLeft className="w-3.5 h-3.5"/>
                </button>
                {Array.from({length:totalPages},(_,i)=>i+1)
                  .filter(p=>p===1||p===totalPages||Math.abs(p-page)<=1)
                  .reduce((acc,p,i,arr)=>{if(i>0&&p-arr[i-1]>1)acc.push("…");acc.push(p);return acc;},[])
                  .map((p,i)=>
                    typeof p==="string"
                      ?<span key={`e${i}`} className="w-8 h-8 flex items-center justify-center text-xs text-slate-400">…</span>
                      :<button key={p} onClick={()=>setPage(p)}
                          className={`w-8 h-8 rounded-lg text-xs font-bold transition-all border
                            ${page===p?"bg-blue-600 border-blue-600 text-white shadow-sm":"bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600"}`}>
                          {p}
                        </button>
                  )}
                <button disabled={page===totalPages} onClick={()=>setPage(p=>p+1)}
                  className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-500 text-xs font-bold
                    hover:border-blue-300 hover:text-blue-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center">
                  <FiChevronRight className="w-3.5 h-3.5"/>
                </button>
                <button disabled={page===totalPages} onClick={()=>setPage(totalPages)}
                  className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-500 text-xs font-bold
                    hover:border-blue-300 hover:text-blue-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center">
                  <FaAngleDoubleRight className="text-xs"/>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}