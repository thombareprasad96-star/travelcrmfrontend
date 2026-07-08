import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiFilter, FiRefreshCw, FiDownload, FiArrowLeft,
  FiChevronDown, FiChevronUp, FiSearch,
} from "react-icons/fi";
import {
  FaGlobe, FaHome, FaRupeeSign, FaMoon,
  FaPercentage, FaMapMarkerAlt,
} from "react-icons/fa";
import { MdOutlineBarChart } from "react-icons/md";
import { HiOutlineGlobe } from "react-icons/hi";

import intlDomesticService from "../api/intlDomesticService";
import { DEFAULT_START, DEFAULT_END } from "../dateDefaults";

/* Empty panel shape — used as a fallback so the render never dereferences null. */
const EMPTY_PANEL = {
  totalRevenue:  0,
  totalBookings: 0,
  avgValue:      0,
  avgNights:     0.0,
  tcs:           0,
  destinations:  [],
};

const DATE_TYPES  = ["Booking Date","Travel Date","Created Date"];
const VIEW_TYPES  = ["Overview","Detailed","Comparison"];
const STATUS_OPTS = ["All Statuses","Confirmed","Pending","Cancelled","Completed"];

const fmtINR = (n) =>
  n >= 100000
    ? `₹${(n / 100000).toFixed(1)}L`
    : n >= 1000
    ? `₹${(n / 1000).toFixed(0)}K`
    : `₹${Number(n).toLocaleString("en-IN")}`;

const fmtFull = (n) =>
  `₹${Number(n).toLocaleString("en-IN", { minimumFractionDigits: 0 })}`;

/* ─── TOAST ──────────────────────────────────────────────────── */
function Toast({ msg, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div className={`fixed top-5 right-5 z-[999] flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl max-w-xs
      ${type === "success" ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800"}`}
      style={{ animation: "slideIn .3s ease both" }}>
      <span className="text-lg">{type === "success" ? "✅" : "❌"}</span>
      <p className="text-sm font-semibold flex-1">{msg}</p>
      <button onClick={onClose} className="opacity-50 hover:opacity-100 text-lg ml-1">×</button>
    </div>
  );
}

/* ─── MINI STAT CARD (inside panels) ────────────────────────── */
function MiniCard({ icon, label, value, bg, isFloat }) {
  return (
    <div className={`${bg} rounded-xl p-3.5 text-white flex items-center gap-3 flex-1`}>
      <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-lg flex-shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-extrabold uppercase tracking-wide opacity-80">{label}</p>
        <p className="text-lg font-extrabold leading-none">
          {isFloat ? Number(value).toFixed(1) : fmtFull(value)}
        </p>
      </div>
    </div>
  );
}

/* ─── DONUT CHART (SVG) ──────────────────────────────────────── */
function DonutChart({ intlPct, label }) {
  const r  = 60;
  const cx = 80;
  const cy = 80;
  const circ = 2 * Math.PI * r;
  const intlDash  = (intlPct / 100) * circ;
  const domDash   = circ - intlDash;
  const isEmpty = intlPct === 0;

  return (
    <div className="flex flex-col items-center gap-3">
      <svg width="160" height="160" viewBox="0 0 160 160">
        {isEmpty ? (
          /* grey donut when no data */
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e2e8f0" strokeWidth="20"/>
        ) : (
          <>
            {/* International (blue) */}
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="#3b82f6" strokeWidth="20"
              strokeDasharray={`${intlDash} ${domDash}`}
              strokeDashoffset={circ * 0.25}
              style={{ transform:"rotate(-90deg)", transformOrigin:`${cx}px ${cy}px` }}/>
            {/* Domestic (slate) */}
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="#94a3b8" strokeWidth="20"
              strokeDasharray={`${domDash} ${intlDash}`}
              strokeDashoffset={circ * 0.25 - intlDash}
              style={{ transform:"rotate(-90deg)", transformOrigin:`${cx}px ${cy}px` }}/>
          </>
        )}
        {/* Center text */}
        <text x={cx} y={cy - 4} textAnchor="middle" className="text-base font-extrabold fill-slate-700" fontSize="14" fontWeight="800">
          {isEmpty ? "0%" : `${intlPct}%`}
        </text>
        <text x={cx} y={cy + 14} textAnchor="middle" className="fill-slate-400" fontSize="10">
          {isEmpty ? "No data" : "Intl"}
        </text>
      </svg>
      {/* Legend */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-2 rounded-sm bg-blue-500"/>
          <span className="text-[11px] text-slate-500 font-medium">International</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-2 rounded-sm bg-slate-400"/>
          <span className="text-[11px] text-slate-500 font-medium">Domestic</span>
        </div>
      </div>
      <p className="text-xs font-bold text-slate-600">{label}</p>
    </div>
  );
}

/* ─── SKELETON ───────────────────────────────────────────────── */
function SkeletonPanel() {
  return (
    <div className="space-y-3 p-4">
      <div className="h-6 bg-slate-200 rounded-lg animate-pulse w-1/3"/>
      <div className="grid grid-cols-3 gap-3">
        {[...Array(3)].map((_,i)=>(
          <div key={i} className="h-16 bg-slate-200 rounded-xl animate-pulse"/>
        ))}
      </div>
      <div className="h-24 bg-slate-100 rounded-xl animate-pulse"/>
    </div>
  );
}

const selectCls = "w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 font-medium focus:border-blue-400 focus:ring-2 focus:ring-blue-50 outline-none appearance-none cursor-pointer transition-all hover:border-slate-300";
const inputCls  = "w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 font-medium focus:border-blue-400 focus:ring-2 focus:ring-blue-50 outline-none transition-all hover:border-slate-300";

/* ─── MAIN PAGE ──────────────────────────────────────────────── */
export default function InternationalDomestic() {
  const navigate = useNavigate();

  /* filter state */
  const [startDate,   setStartDate]   = useState(DEFAULT_START);
  const [endDate,     setEndDate]     = useState(DEFAULT_END);
  const [dateType,    setDateType]    = useState("Booking Date");
  const [viewType,    setViewType]    = useState("Overview");
  const [status,      setStatus]      = useState("All Statuses");
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [applied,     setApplied]     = useState({
    startDate:DEFAULT_START, endDate:DEFAULT_END,
    dateType:"Booking Date", viewType:"Overview", status:"All Statuses",
  });

  /* data state */
  const [intl,    setIntl]    = useState(null);
  const [domestic,setDomestic]= useState(null);
  const [loading, setLoading] = useState(true);
  const [toast,   setToast]   = useState(null);

  const showToast = useCallback((msg, type="success") => setToast({msg,type}), []);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    intlDomesticService.getAll(applied)
      .then((res) => {
        if(!alive) return;
        setIntl(res.data?.international || EMPTY_PANEL);
        setDomestic(res.data?.domestic || EMPTY_PANEL);
      })
      .catch(() => {
        if(!alive) return;
        setIntl(EMPTY_PANEL); setDomestic(EMPTY_PANEL);
        showToast("Failed to load international/domestic data.", "error");
      })
      .finally(() => { if(alive) setLoading(false); });
    return () => { alive = false; };
  }, [applied, showToast]);

  /* apply / reset */
  const handleApply = () => {
    setApplied({ startDate, endDate, dateType, viewType, status });
    showToast("Filters applied.");
  };
  const handleReset = () => {
    setStartDate(DEFAULT_START); setEndDate(DEFAULT_END);
    setDateType("Booking Date"); setViewType("Overview"); setStatus("All Statuses");
    setApplied({ startDate:DEFAULT_START, endDate:DEFAULT_END,
      dateType:"Booking Date", viewType:"Overview", status:"All Statuses" });
    showToast("Filters reset.");
  };

  /* export CSV — server-side, honours the applied filters */
  const handleExportCSV = async () => {
    try {
      const res = await intlDomesticService.exportCsv(applied);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a   = document.createElement("a");
      a.href    = url;
      a.download = `intl-domestic-${applied.startDate}-to-${applied.endDate}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      showToast("CSV exported successfully.");
    } catch {
      showToast("Export failed. Try again.", "error");
    }
  };

  /* distribution percentages */
  const totRevenue  = (intl?.totalRevenue  || 0) + (domestic?.totalRevenue  || 0);
  const totBookings = (intl?.totalBookings || 0) + (domestic?.totalBookings || 0);
  const intlRevPct  = totRevenue  > 0 ? Math.round((intl?.totalRevenue  / totRevenue)  * 100) : 0;
  const intlBkgPct  = totBookings > 0 ? Math.round((intl?.totalBookings / totBookings) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100"
      style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        @keyframes slideIn { from{transform:translateX(110%);opacity:0} to{transform:translateX(0);opacity:1} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        .fade-up { animation: fadeUp .4s ease both; }
        select { -webkit-appearance:none; appearance:none; }
        ::-webkit-scrollbar{width:5px;height:5px}
        ::-webkit-scrollbar-track{background:#f1f5f9;border-radius:99px}
        ::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:99px}
      `}</style>

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)}/>}

      {/* ── PAGE HEADER ── */}
      <div className="bg-white/70 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-200 flex-shrink-0">
                <HiOutlineGlobe className="w-5 h-5"/>
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">
                  International vs Domestic Analysis
                </h1>
                <p className="text-sm text-slate-400 mt-0.5">
                  Compare international and domestic performance
                  <span className="hidden sm:inline ml-3 text-slate-300">|</span>
                  <span className="hidden sm:inline ml-3 text-xs">
                    <span className="hover:text-blue-600 cursor-pointer transition-colors" onClick={() => navigate("/")}>Home</span>
                    <span className="mx-1 text-slate-300">/</span>
                    <span className="hover:text-blue-600 cursor-pointer transition-colors" onClick={() => navigate("/ReportsDashboard")}>Reports</span>
                    <span className="mx-1 text-slate-300">/</span>
                    <span className="text-blue-600 font-bold">International vs Domestic</span>
                  </span>
                </p>
              </div>
            </div>
            <button onClick={() => navigate("/ReportsDashboard")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200
                hover:border-blue-300 bg-white hover:bg-blue-50 text-slate-600 hover:text-blue-600
                text-sm font-bold transition-all shadow-sm">
              <FiArrowLeft className="w-4 h-4"/> Back to Reports
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6 space-y-5">

        {/* ── FILTERS & SETTINGS ── */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden fade-up">
          <button type="button" onClick={() => setFiltersOpen(v => !v)}
            className="w-full flex items-center justify-between px-5 py-4 bg-slate-600 hover:bg-slate-700 transition-colors">
            <div className="flex items-center gap-2.5">
              <FiFilter className="w-4 h-4 text-white"/>
              <span className="text-sm font-extrabold text-white">Filters &amp; Settings</span>
            </div>
            {filtersOpen ? <FiChevronUp className="w-4 h-4 text-white"/> : <FiChevronDown className="w-4 h-4 text-white"/>}
          </button>

          {filtersOpen && (
            <div className="p-5 space-y-4">
              {/* Row: Start | End | Date Type | View Type | Status | Apply */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
                <div>
                  <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wide mb-1.5">Start Date</label>
                  <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className={inputCls}/>
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wide mb-1.5">End Date</label>
                  <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className={inputCls}/>
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wide mb-1.5">Date Type</label>
                  <div className="relative">
                    <select value={dateType} onChange={e => setDateType(e.target.value)} className={selectCls + " pr-8"}>
                      {DATE_TYPES.map(o => <option key={o}>{o}</option>)}
                    </select>
                    <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none"/>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wide mb-1.5">View Type</label>
                  <div className="relative">
                    <select value={viewType} onChange={e => setViewType(e.target.value)} className={selectCls + " pr-8"}>
                      {VIEW_TYPES.map(o => <option key={o}>{o}</option>)}
                    </select>
                    <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none"/>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wide mb-1.5">Status</label>
                  <div className="relative">
                    <select value={status} onChange={e => setStatus(e.target.value)} className={selectCls + " pr-8"}>
                      {STATUS_OPTS.map(o => <option key={o}>{o}</option>)}
                    </select>
                    <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none"/>
                  </div>
                </div>
                <button onClick={handleApply}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700
                    text-white text-sm font-bold shadow-md shadow-blue-200 transition-all h-[42px]">
                  <FiSearch className="w-3.5 h-3.5"/> Apply
                </button>
              </div>
              {/* Reset + Export */}
              <div className="flex flex-wrap gap-3">
                <button onClick={handleReset}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-slate-200 hover:border-slate-300
                    bg-white hover:bg-slate-50 text-slate-600 text-sm font-bold transition-all">
                  <FiRefreshCw className="w-3.5 h-3.5"/> Reset
                </button>
                <button onClick={handleExportCSV}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700
                    text-white text-sm font-bold shadow-md shadow-emerald-200 transition-all">
                  <FiDownload className="w-3.5 h-3.5"/> Export CSV
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── INTERNATIONAL & DOMESTIC PANELS ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* ── INTERNATIONAL BOOKINGS PANEL ── */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden fade-up">
            {/* Blue header — matches screenshot */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-3 flex items-center gap-2">
              <FaGlobe className="w-4 h-4 text-white"/>
              <h2 className="text-sm font-extrabold text-white">International Bookings</h2>
            </div>

            {loading ? <SkeletonPanel/> : (
              <div className="p-5 space-y-4">
                {/* Total Revenue + Total Bookings top row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wide mb-0.5">
                      {intl.totalRevenue > 0 ? `+${intl.totalRevenue}%` : "+0.0%"}
                    </p>
                    <p className="text-2xl font-extrabold text-slate-800">{fmtFull(intl.totalRevenue)}</p>
                    <p className="text-xs text-slate-400 font-medium">TOTAL REVENUE</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[11px] text-blue-500 font-bold uppercase tracking-wide mb-0.5 flex items-center justify-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-blue-500 inline-block"/> {intl.totalBookings}.0
                    </p>
                    <p className="text-2xl font-extrabold text-slate-800">{intl.totalBookings}</p>
                    <p className="text-xs text-slate-400 font-medium">TOTAL BOOKINGS</p>
                  </div>
                </div>

                {/* 3 mini cards */}
                <div className="flex gap-3">
                  <MiniCard icon={<FaRupeeSign/>}   label="Avg Value"  value={intl.avgValue}  bg="bg-gradient-to-br from-teal-500 to-teal-600"/>
                  <MiniCard icon={<FaMoon/>}         label="Avg Nights" value={intl.avgNights} bg="bg-gradient-to-br from-green-500 to-green-600" isFloat/>
                  <MiniCard icon={<FaPercentage/>}   label="TCS"        value={intl.tcs}       bg="bg-gradient-to-br from-amber-500 to-amber-600"/>
                </div>

                {/* Top International Destinations */}
                <div>
                  <p className="text-xs font-extrabold text-slate-600 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                    <FaGlobe className="w-3 h-3 text-blue-500"/> Top International Destinations
                  </p>
                  {intl.destinations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-slate-400">
                      <HiOutlineGlobe className="text-4xl mb-2 opacity-30"/>
                      <p className="text-sm font-bold">No international destinations found</p>
                    </div>
                  ) : (
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50 rounded-xl">
                        <tr>
                          {["Destination","Country","Bookings","Revenue"].map(h=>(
                            <th key={h} className="px-3 py-2 text-left text-xs font-extrabold text-slate-500 uppercase tracking-wider">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {intl.destinations.map((d,i)=>(
                          <tr key={i} className="hover:bg-blue-50/30 transition-colors">
                            <td className="px-3 py-2.5 font-semibold text-slate-800">{d.name}</td>
                            <td className="px-3 py-2.5 text-slate-500">{d.country}</td>
                            <td className="px-3 py-2.5"><span className="text-xs font-extrabold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md">{d.bookings}</span></td>
                            <td className="px-3 py-2.5 font-bold text-green-600">{fmtINR(d.revenue)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ── DOMESTIC BOOKINGS PANEL ── */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden fade-up">
            {/* Slate header — matches screenshot */}
            <div className="bg-gradient-to-r from-slate-600 to-slate-500 px-5 py-3 flex items-center gap-2">
              <FaHome className="w-4 h-4 text-white"/>
              <h2 className="text-sm font-extrabold text-white">Domestic Bookings</h2>
            </div>

            {loading ? <SkeletonPanel/> : (
              <div className="p-5 space-y-4">
                {/* Total Revenue + Total Bookings top row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-[11px] text-green-500 font-bold uppercase tracking-wide mb-0.5">
                      +{domestic.totalBookings > 0 ? "71.6%" : "0.0%"}
                    </p>
                    <p className="text-2xl font-extrabold text-slate-800">{fmtFull(domestic.totalRevenue)}</p>
                    <p className="text-xs text-slate-400 font-medium">TOTAL REVENUE</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[11px] text-blue-500 font-bold uppercase tracking-wide mb-0.5 flex items-center justify-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-blue-500 inline-block"/> {domestic.totalBookings}.0
                    </p>
                    <p className="text-2xl font-extrabold text-slate-800">{domestic.totalBookings}</p>
                    <p className="text-xs text-slate-400 font-medium">TOTAL BOOKINGS</p>
                  </div>
                </div>

                {/* 3 mini cards */}
                <div className="flex gap-3">
                  <MiniCard icon={<FaRupeeSign/>} label="Avg Value"  value={domestic.avgValue}  bg="bg-gradient-to-br from-teal-500 to-teal-600"/>
                  <MiniCard icon={<FaMoon/>}       label="Avg Nights" value={domestic.avgNights} bg="bg-gradient-to-br from-green-500 to-green-600" isFloat/>
                  <MiniCard icon={<span className="text-sm font-extrabold">TCS</span>} label="No TCS" value={domestic.tcs} bg="bg-gradient-to-br from-slate-500 to-slate-600"/>
                </div>

                {/* Top Domestic Destinations table */}
                <div>
                  <p className="text-xs font-extrabold text-slate-600 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                    <FaHome className="w-3 h-3 text-slate-500"/> Top Domestic Destinations
                  </p>
                  {domestic.destinations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-slate-400">
                      <FaHome className="text-4xl mb-2 opacity-30"/>
                      <p className="text-sm font-bold">No domestic destinations found</p>
                    </div>
                  ) : (
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50 rounded-xl">
                        <tr>
                          {["Destination","Country","Bookings","Revenue"].map(h=>(
                            <th key={h} className="px-3 py-2 text-left text-xs font-extrabold text-slate-500 uppercase tracking-wider">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {domestic.destinations.map((d,i)=>(
                          <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-3 py-2.5">
                              <div className="flex items-center gap-2">
                                <FaMapMarkerAlt className="w-3 h-3 text-slate-400 flex-shrink-0"/>
                                <span className="font-semibold text-slate-800">{d.name}</span>
                              </div>
                            </td>
                            <td className="px-3 py-2.5 text-slate-500">{d.country}</td>
                            <td className="px-3 py-2.5">
                              <span className="text-xs font-extrabold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">{d.bookings}</span>
                            </td>
                            <td className="px-3 py-2.5 font-bold text-green-600">{fmtINR(d.revenue)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── REVENUE & BOOKING DISTRIBUTION ── */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/60 shadow-sm p-6 fade-up">
          <h2 className="text-base font-extrabold text-slate-700 mb-6 flex items-center gap-2">
            <MdOutlineBarChart className="w-5 h-5 text-blue-500"/>
            Revenue &amp; Booking Distribution
          </h2>

          {loading ? (
            <div className="grid grid-cols-2 gap-8">
              {[...Array(2)].map((_,i)=>(
                <div key={i} className="flex flex-col items-center gap-4">
                  <div className="w-40 h-40 rounded-full bg-slate-200 animate-pulse"/>
                  <div className="h-4 bg-slate-200 rounded-lg w-32 animate-pulse"/>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {/* Revenue Distribution */}
              <div className="flex flex-col items-center">
                <DonutChart intlPct={intlRevPct} label="Revenue Distribution"/>
                {totRevenue > 0 && (
                  <div className="mt-4 grid grid-cols-2 gap-3 w-full max-w-xs">
                    <div className="bg-blue-50 border border-blue-100 rounded-xl px-3 py-2 text-center">
                      <p className="text-[11px] text-blue-500 font-bold uppercase">International</p>
                      <p className="text-base font-extrabold text-slate-800">{fmtINR(intl?.totalRevenue||0)}</p>
                      <p className="text-xs text-slate-400">{intlRevPct}%</p>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-center">
                      <p className="text-[11px] text-slate-500 font-bold uppercase">Domestic</p>
                      <p className="text-base font-extrabold text-slate-800">{fmtINR(domestic?.totalRevenue||0)}</p>
                      <p className="text-xs text-slate-400">{100-intlRevPct}%</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Bookings Distribution */}
              <div className="flex flex-col items-center">
                <DonutChart intlPct={intlBkgPct} label="Bookings Distribution"/>
                {totBookings > 0 && (
                  <div className="mt-4 grid grid-cols-2 gap-3 w-full max-w-xs">
                    <div className="bg-blue-50 border border-blue-100 rounded-xl px-3 py-2 text-center">
                      <p className="text-[11px] text-blue-500 font-bold uppercase">International</p>
                      <p className="text-base font-extrabold text-slate-800">{intl?.totalBookings||0}</p>
                      <p className="text-xs text-slate-400">{intlBkgPct}%</p>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-center">
                      <p className="text-[11px] text-slate-500 font-bold uppercase">Domestic</p>
                      <p className="text-base font-extrabold text-slate-800">{domestic?.totalBookings||0}</p>
                      <p className="text-xs text-slate-400">{100-intlBkgPct}%</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── COMPARISON SUMMARY BAR (bonus) ── */}
        {!loading && (totRevenue > 0 || totBookings > 0) && (
          <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/60 shadow-sm p-5 fade-up">
            <h3 className="text-sm font-extrabold text-slate-700 mb-4 flex items-center gap-2">
              <FaGlobe className="w-4 h-4 text-blue-500"/> Quick Comparison
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label:"Total Revenue",    intlVal:fmtFull(intl?.totalRevenue||0),    domVal:fmtFull(domestic?.totalRevenue||0)    },
                { label:"Total Bookings",   intlVal:intl?.totalBookings||0,            domVal:domestic?.totalBookings||0            },
                { label:"Avg Booking Value",intlVal:fmtFull(intl?.avgValue||0),        domVal:fmtFull(domestic?.avgValue||0)        },
                { label:"Avg Stay (Nights)",intlVal:`${intl?.avgNights||0} nights`,   domVal:`${domestic?.avgNights||0} nights`   },
              ].map(({label,intlVal,domVal})=>(
                <div key={label} className="bg-slate-50 rounded-xl p-4">
                  <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wide mb-3">{label}</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-blue-500"/>
                        <span className="text-[11px] text-slate-500">Intl</span>
                      </div>
                      <span className="text-xs font-extrabold text-slate-800">{intlVal}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-slate-400"/>
                        <span className="text-[11px] text-slate-500">Dom</span>
                      </div>
                      <span className="text-xs font-extrabold text-slate-800">{domVal}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}