// import { useState, useEffect, useMemo, useRef, useCallback } from "react";

// /* ─────────────────────────────────────────
//    CONSTANTS
// ───────────────────────────────────────── */
// export const BOOKING_STATUSES = ["Confirmed","Pending","Cancelled","Completed","Refunded"];
// export const PAY_STATUSES     = ["Paid","Partial","Unpaid","Refunded"];
// const MONTHS = ["January","February","March","April","May","June",
//                 "July","August","September","October","November","December"];

// const STATUS_STYLE = {
//   Confirmed:  "bg-green-100 text-green-700 border-green-200",
//   Pending:    "bg-amber-100 text-amber-700 border-amber-200",
//   Cancelled:  "bg-red-100 text-red-600 border-red-200",
//   Completed:  "bg-blue-100 text-blue-700 border-blue-200",
//   Refunded:   "bg-purple-100 text-purple-700 border-purple-200",
// };
// const PAY_STYLE = {
//   Paid:     "bg-emerald-100 text-emerald-700",
//   Partial:  "bg-orange-100 text-orange-700",
//   Unpaid:   "bg-rose-100 text-rose-700",
//   Refunded: "bg-slate-100 text-slate-600",
// };
// const STATUS_DOT = {
//   Confirmed:"bg-green-500", Pending:"bg-amber-500",
//   Cancelled:"bg-red-500",   Completed:"bg-blue-500", Refunded:"bg-purple-500",
// };
// const STAT_CARDS = [
//   { key:"total",     label:"Total Bookings", icon:"✈️",  gradient:"from-cyan-500 to-cyan-400",     money:false },
//   { key:"confirmed", label:"Confirmed",      icon:"✅",  gradient:"from-green-500 to-emerald-400", money:false },
//   { key:"revenue",   label:"Total Revenue",  icon:"💰",  gradient:"from-amber-500 to-yellow-400",  money:true  },
//   { key:"net",       label:"Net Revenue",    icon:"📊",  gradient:"from-blue-600 to-blue-400",     money:true  },
//   { key:"refunds",   label:"Total Refunds",  icon:"↩️",  gradient:"from-rose-500 to-red-400",      money:true  },
//   { key:"profit",    label:"Net Profit",     icon:"📈",  gradient:"from-slate-600 to-slate-500",   money:true  },
// ];

// /* ─────────────────────────────────────────
//    HELPERS
// ───────────────────────────────────────── */
// export function fmtINR(n) {
//   return "₹" + Number(n).toLocaleString("en-IN");
// }
// export function fmtDate(d) {
//   if (!d) return "—";
//   return new Date(d).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" });
// }

// /* ─────────────────────────────────────────
//    SUB-COMPONENTS
// ───────────────────────────────────────── */

// // Toast notification
// function Toast({ msg, type, onClose }) {
//   useEffect(() => {
//     const t = setTimeout(onClose, 3500);
//     return () => clearTimeout(t);
//   }, [onClose]);

//   return (
//     <div className={`fixed top-5 right-5 z-[999] flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl max-w-xs
//       animate-[slideIn_.3s_ease_both]
//       ${type === "success"
//         ? "bg-green-50 border-green-200 text-green-800"
//         : "bg-red-50 border-red-200 text-red-800"}`}
//     >
//       <span className="text-lg">{type === "success" ? "✅" : "❌"}</span>
//       <p className="text-sm font-semibold flex-1">{msg}</p>
//       <button onClick={onClose} className="opacity-50 hover:opacity-100 text-lg ml-1">×</button>
//     </div>
//   );
// }

// // Stat card
// function StatCard({ card, value }) {
//   return (
//     <div className={`bg-gradient-to-br ${card.gradient} rounded-2xl p-5 text-white shadow-lg relative overflow-hidden`}>
//       <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full bg-white/10" />
//       <div className="absolute -right-2 -bottom-6 w-28 h-28 rounded-full bg-white/10" />
//       <div className="flex items-start justify-between relative z-10">
//         <div>
//           <p className="text-xs font-bold opacity-80 uppercase tracking-widest mb-1">{card.label}</p>
//           <p className="text-2xl sm:text-3xl font-extrabold leading-none">
//             {card.money ? fmtINR(value) : value}
//           </p>
//         </div>
//         <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl">
//           {card.icon}
//         </div>
//       </div>
//     </div>
//   );
// }

// // Booking detail modal
// function BookingModal({ booking, onClose }) {
//   if (!booking) return null;
//   const payPct = booking.totalPayable > 0
//     ? Math.round(booking.paid / booking.totalPayable * 100)
//     : 0;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
//       onClick={e => { if (e.target === e.currentTarget) onClose(); }}
//     >
//       <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
//       <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto
//         animate-[popIn_.25s_ease_both]"
//       >
//         {/* Modal Header */}
//         <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-5 rounded-t-2xl flex items-start justify-between">
//           <div>
//             <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-0.5">Booking Detail</p>
//             <h2 className="text-white text-xl font-extrabold">{booking.code}</h2>
//             <p className="text-blue-100 text-sm mt-0.5">{booking.customer}</p>
//           </div>
//           <button onClick={onClose}
//             className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center text-lg transition-all">
//             ×
//           </button>
//         </div>

//         <div className="p-6 space-y-5">
//           {/* Badges */}
//           <div className="flex flex-wrap gap-2">
//             <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${STATUS_STYLE[booking.status]}`}>
//               <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${STATUS_DOT[booking.status]}`} />
//               {booking.status}
//             </span>
//             <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${PAY_STYLE[booking.payStatus]}`}>
//               💳 {booking.payStatus}
//             </span>
//             {booking.services?.map(s => (
//               <span key={s} className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">{s}</span>
//             ))}
//           </div>

//           {/* Detail grid */}
//           <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
//             {[
//               ["📍","Destination",   booking.destination],
//               ["📅","Travel Date",   fmtDate(booking.travelDate)],
//               ["🗓️","Booking Date",  fmtDate(booking.bookingDate)],
//               ["👤","Created By",    booking.createdBy],
//               ["💰","Customer Amt",  fmtINR(booking.customerAmount)],
//               ["🏷️","Vendor Cost",   fmtINR(booking.vendorCost)],
//               ["🧾","GST (5%)",      fmtINR(booking.gst)],
//               ["📋","TCS (5%)",      fmtINR(booking.tcs)],
//               ["💳","Total Payable", fmtINR(booking.totalPayable)],
//             ].map(([icon, label, val]) => (
//               <div key={label} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
//                 <p className="text-xs text-slate-400 font-medium mb-0.5">{icon} {label}</p>
//                 <p className="text-sm font-bold text-slate-700">{val}</p>
//               </div>
//             ))}
//           </div>

//           {/* Payment progress */}
//           <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
//             <div className="flex items-center justify-between mb-2">
//               <p className="text-sm font-bold text-slate-600">Payment Progress</p>
//               <p className="text-sm font-extrabold text-blue-600">{payPct}%</p>
//             </div>
//             <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
//               <div className={`h-full rounded-full transition-all duration-700
//                 ${payPct === 100 ? "bg-green-500" : payPct > 0 ? "bg-blue-500" : "bg-slate-300"}`}
//                 style={{ width: `${payPct}%` }} />
//             </div>
//             <div className="flex justify-between mt-1.5 text-xs text-slate-400 font-medium">
//               <span>Paid: {fmtINR(booking.paid)}</span>
//               <span>Due: {fmtINR(Math.max(0, booking.totalPayable - booking.paid))}</span>
//             </div>
//           </div>

//           {/* Profit */}
//           <div className={`rounded-xl p-4 border flex items-center gap-3
//             ${booking.netProfit >= 0 ? "bg-green-50 border-green-100" : "bg-red-50 border-red-100"}`}>
//             <span className="text-2xl">{booking.netProfit >= 0 ? "📈" : "📉"}</span>
//             <div>
//               <p className="text-xs font-medium text-slate-500">Net Profit</p>
//               <p className={`text-lg font-extrabold ${booking.netProfit >= 0 ? "text-green-700" : "text-red-600"}`}>
//                 {fmtINR(booking.netProfit)}
//               </p>
//             </div>
//           </div>

//           {/* Actions */}
//           <div className="flex flex-wrap gap-2 pt-1">
//             <button className="flex-1 min-w-[120px] py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-all">
//               ✏️ Edit Booking
//             </button>
//             <button className="flex-1 min-w-[120px] py-2.5 rounded-xl bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 text-sm font-bold transition-all">
//               📧 Send Voucher
//             </button>
//             <button className="flex-1 min-w-[120px] py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 text-sm font-bold transition-all">
//               🖨️ Print
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // Mobile booking card
// function MobileBookingCard({ b, onView, onDelete }) {
//   const payPct = b.totalPayable > 0 ? Math.round(b.paid / b.totalPayable * 100) : 0;
//   return (
//     <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-3">
//       <div className="flex items-start justify-between">
//         <div>
//           <div className="flex items-center gap-2 mb-0.5">
//             <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg">{b.code}</span>
//             <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${STATUS_STYLE[b.status]}`}>
//               <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1 ${STATUS_DOT[b.status]}`} />
//               {b.status}
//             </span>
//           </div>
//           <p className="font-bold text-slate-800 text-sm">{b.customer}</p>
//           <p className="text-xs text-slate-400 mt-0.5">📍 {b.destination}</p>
//         </div>
//         <div className="text-right">
//           <p className="text-base font-extrabold text-slate-800">{fmtINR(b.totalPayable)}</p>
//           <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${PAY_STYLE[b.payStatus]}`}>{b.payStatus}</span>
//         </div>
//       </div>

//       <div className="flex flex-wrap gap-1.5">
//         {b.services?.map(s => (
//           <span key={s} className="text-xs bg-slate-100 text-slate-500 font-semibold px-2 py-0.5 rounded-full">{s}</span>
//         ))}
//       </div>

//       <div className="flex items-center justify-between text-xs text-slate-500">
//         <span>📅 {fmtDate(b.travelDate)}</span>
//         <span>Profit: <span className={b.netProfit >= 0 ? "text-green-600 font-bold" : "text-red-500 font-bold"}>{fmtINR(b.netProfit)}</span></span>
//       </div>

//       <div>
//         <div className="flex justify-between text-xs text-slate-400 mb-1">
//           <span>Payment</span><span>{payPct}%</span>
//         </div>
//         <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
//           <div className={`h-full rounded-full ${payPct === 100 ? "bg-green-500" : payPct > 0 ? "bg-blue-500" : "bg-slate-200"}`}
//             style={{ width: `${payPct}%` }} />
//         </div>
//       </div>

//       <div className="flex gap-2 pt-1">
//         <button onClick={() => onView(b)} className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all">👁 View</button>
//         <button className="flex-1 py-2 rounded-xl bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 text-xs font-bold transition-all">✏️ Edit</button>
//         <button onClick={() => onDelete(b.id)} className="w-9 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 border border-red-200 text-xs font-bold transition-all flex items-center justify-center">🗑</button>
//       </div>
//     </div>
//   );
// }

// /* ─────────────────────────────────────────
//    MAIN PAGE
// ───────────────────────────────────────── */
// /**
//  * BookingsPage
//  *
//  * Props:
//  *   bookings       - array of booking objects (from API)
//  *   loading        - boolean (initial API loading state)
//  *   onCreateLead   - () => void   — navigate to Create Lead
//  *   onEdit         - (booking) => void
//  *   onRefresh      - () => void   — re-fetch bookings
//  *
//  * If no props supplied, renders with empty state.
//  */
// export default function BookingsPage({
//   bookings: propBookings = [],
//   loading: propLoading = false,
//   onCreateLead,
//   onEdit,
//   onRefresh,
// }) {
//   const [bookings, setBookings]     = useState(propBookings);
//   const [loading, setLoading]       = useState(propLoading);
//   const [search, setSearch]         = useState("");
//   const [filterStatus, setFilterStatus]   = useState("All Status");
//   const [filterPay, setFilterPay]         = useState("All Payment Status");
//   const [filterMonth, setFilterMonth]     = useState("All Booking Months");
//   const [filterTravel, setFilterTravel]   = useState("All Travel Months");
//   const [sortKey, setSortKey]       = useState("id");
//   const [sortDir, setSortDir]       = useState("desc");
//   const [page, setPage]             = useState(1);
//   const perPage = 10;
//   const [selected, setSelected]     = useState(new Set());
//   const [modal, setModal]           = useState(null);
//   const [toast, setToast]           = useState(null);

//   useEffect(() => { setBookings(propBookings); }, [propBookings]);
//   useEffect(() => { setLoading(propLoading);   }, [propLoading]);

//   const showToast = (msg, type = "success") => setToast({ msg, type });

//   /* stats */
//   const stats = useMemo(() => ({
//     total:     bookings.length,
//     confirmed: bookings.filter(b => b.status === "Confirmed").length,
//     revenue:   bookings.reduce((s, b) => s + (b.customerAmount || 0), 0),
//     net:       bookings.reduce((s, b) => s + (b.paid || 0), 0),
//     refunds:   bookings.filter(b => b.payStatus === "Refunded").reduce((s, b) => s + (b.paid || 0), 0),
//     profit:    bookings.reduce((s, b) => s + (b.netProfit || 0), 0),
//   }), [bookings]);

//   /* filter + sort */
//   const filtered = useMemo(() => {
//     let out = [...bookings];
//     const q = search.toLowerCase();
//     if (q) out = out.filter(b =>
//       (b.code||"").toLowerCase().includes(q) ||
//       (b.customer||"").toLowerCase().includes(q) ||
//       (b.destination||"").toLowerCase().includes(q)
//     );
//     if (filterStatus !== "All Status")
//       out = out.filter(b => b.status === filterStatus);
//     if (filterPay !== "All Payment Status")
//       out = out.filter(b => b.payStatus === filterPay);
//     if (filterMonth !== "All Booking Months") {
//       const mi = MONTHS.indexOf(filterMonth) + 1;
//       out = out.filter(b => new Date(b.bookingDate).getMonth() + 1 === mi);
//     }
//     if (filterTravel !== "All Travel Months") {
//       const mi = MONTHS.indexOf(filterTravel) + 1;
//       out = out.filter(b => new Date(b.travelDate).getMonth() + 1 === mi);
//     }
//     out.sort((a, b) => {
//       let av = a[sortKey], bv = b[sortKey];
//       if (typeof av === "string") { av = av.toLowerCase(); bv = bv.toLowerCase(); }
//       if (av < bv) return sortDir === "asc" ? -1 : 1;
//       if (av > bv) return sortDir === "asc" ?  1 : -1;
//       return 0;
//     });
//     return out;
//   }, [bookings, search, filterStatus, filterPay, filterMonth, filterTravel, sortKey, sortDir]);

//   const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
//   const pageData   = filtered.slice((page - 1) * perPage, page * perPage);

//   const handleSort = key => {
//     if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
//     else { setSortKey(key); setSortDir("asc"); }
//   };
//   const sortIcon = key => sortKey === key ? (sortDir === "asc" ? "↑" : "↓") : "↕";

//   const toggleSelect = id => setSelected(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
//   const toggleAll    = () => selected.size === pageData.length
//     ? setSelected(new Set())
//     : setSelected(new Set(pageData.map(b => b.id)));

//   const handleDelete = useCallback(id => {
//     setBookings(p => p.filter(b => b.id !== id));
//     setSelected(s => { const n = new Set(s); n.delete(id); return n; });
//     showToast("Booking deleted successfully.");
//   }, []);

//   const handleBulkDelete = () => {
//     setBookings(p => p.filter(b => !selected.has(b.id)));
//     showToast(`${selected.size} booking(s) deleted.`);
//     setSelected(new Set());
//   };

//   const resetFilters = () => {
//     setSearch(""); setFilterStatus("All Status");
//     setFilterPay("All Payment Status"); setFilterMonth("All Booking Months");
//     setFilterTravel("All Travel Months"); setPage(1);
//   };

//   const anyFilter = search || filterStatus !== "All Status" || filterPay !== "All Payment Status"
//     || filterMonth !== "All Booking Months" || filterTravel !== "All Travel Months";

//   // helper components
//   function Sel({ value, onChange, options, className = "" }) {
//     return (
//       <div className={`relative ${className}`}>
//         <select value={value} onChange={e => { onChange(e.target.value); setPage(1); }}
//           className="w-full pl-3 pr-8 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-600 font-medium
//             focus:border-blue-400 focus:ring-2 focus:ring-blue-50 outline-none cursor-pointer appearance-none transition-all">
//           {options.map(o => <option key={o}>{o}</option>)}
//         </select>
//         <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none">▼</span>
//       </div>
//     );
//   }

//   function TH({ label, sKey, sortable, right }) {
//     return (
//       <th onClick={sortable ? () => handleSort(sKey) : undefined}
//         className={`px-4 py-3.5 text-left text-xs font-extrabold text-slate-500 uppercase tracking-wider whitespace-nowrap
//           ${sortable ? "cursor-pointer hover:text-blue-600 select-none" : ""}
//           ${right ? "text-right" : ""}`}>
//         {label} {sortable && <span className="opacity-50">{sortIcon(sKey)}</span>}
//       </th>
//     );
//   }

//   function SkeletonRow() {
//     return (
//       <tr>
//         {[...Array(13)].map((_, i) => (
//           <td key={i} className="px-4 py-3.5">
//             <div className="h-4 rounded-lg bg-slate-200 animate-pulse" style={{ width: `${40 + Math.random() * 50}%` }} />
//           </td>
//         ))}
//       </tr>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 font-sans">
//       {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
//       {modal && <BookingModal booking={modal} onClose={() => setModal(null)} />}

//       {/* Topbar */}
//       <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
//         <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-sm shadow">T</div>
//             <span className="font-extrabold text-slate-800 hidden sm:block">TravelCRM</span>
//           </div>
//           <nav className="text-xs text-slate-400 flex items-center gap-1">
//             <span className="hover:text-blue-600 cursor-pointer">Home</span>
//             <span className="mx-1">/</span>
//             <span className="text-blue-600 font-bold">Bookings</span>
//           </nav>
//         </div>
//       </nav>

//       {/* Page header */}
//       <div className="bg-white border-b border-slate-100">
//         <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-5">
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//             <div className="flex items-center gap-4">
//               <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-2xl shadow-lg shadow-blue-200">
//                 ✈️
//               </div>
//               <div>
//                 <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">Bookings</h1>
//                 <p className="text-sm text-slate-400 mt-0.5">Manage all travel bookings & financial records</p>
//               </div>
//             </div>
//             <button
//               onClick={() => (window.location.href = "/allleads")}
//               className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold
//                 shadow-md shadow-blue-200 hover:shadow-lg transition-all"
//             >
//               ＋ Create from Lead
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6 space-y-6">

//         {/* Stat cards */}
//         <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
//           {STAT_CARDS.map(card => (
//             <StatCard key={card.key} card={card} value={stats[card.key]} />
//           ))}
//         </div>

//         {/* Tax & Profit Summary */}
//         <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-5 py-4">
//           <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">📋 Tax & Profit Summary (Current Page)</p>
//           <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
//             {[
//               ["💵","Total Charges",  pageData.reduce((s,b)=>s+(b.totalPayable||0),0), "blue"],
//               ["📊","Net Profit",     pageData.reduce((s,b)=>s+(b.netProfit||0),0),    "green"],
//               ["🧾","GST Collected",  pageData.reduce((s,b)=>s+(b.gst||0),0),          "amber"],
//               ["📋","TCS Collected",  pageData.reduce((s,b)=>s+(b.tcs||0),0),          "purple"],
//             ].map(([icon,label,val,color]) => (
//               <div key={label} className={`bg-${color}-50 border border-${color}-100 rounded-xl px-4 py-3`}>
//                 <p className="text-xs text-slate-500 font-medium mb-0.5">{icon} {label}</p>
//                 <p className={`text-base font-extrabold text-${color}-700`}>{fmtINR(val)}</p>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Booking list */}
//         <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

//           {/* List header */}
//           <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
//             <div className="flex items-center gap-3 flex-wrap">
//               <h2 className="text-base font-extrabold text-slate-700">Booking List</h2>
//               <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2.5 py-1 rounded-full">{filtered.length} bookings</span>
//               {selected.size > 0 && (
//                 <button onClick={handleBulkDelete}
//                   className="text-xs bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold px-3 py-1.5 rounded-lg transition-all">
//                   🗑 Delete {selected.size} selected
//                 </button>
//               )}
//             </div>
//             <div className="flex items-center gap-2">
//               {onRefresh && (
//                 <button onClick={onRefresh}
//                   className="text-xs text-slate-500 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 border border-slate-200 font-semibold px-3 py-1.5 rounded-lg transition-all">
//                   🔄 Refresh
//                 </button>
//               )}
//               {anyFilter && (
//                 <button onClick={resetFilters}
//                   className="text-xs text-slate-400 hover:text-red-500 font-semibold flex items-center gap-1 transition-colors">
//                   ✕ Clear filters
//                 </button>
//               )}
//             </div>
//           </div>

//           {/* Filters */}
//           <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/60">
//             <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
//               <div className="relative flex-1 min-w-[200px]">
//                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
//                 <input type="text" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
//                   placeholder="Search by code, customer, destination..."
//                   className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 placeholder-slate-400
//                     focus:border-blue-400 focus:ring-2 focus:ring-blue-50 outline-none transition-all" />
//               </div>
//               <Sel value={filterStatus} onChange={setFilterStatus} className="min-w-[150px]"
//                 options={["All Status", ...BOOKING_STATUSES]} />
//               <Sel value={filterPay} onChange={setFilterPay} className="min-w-[170px]"
//                 options={["All Payment Status", ...PAY_STATUSES]} />
//               <Sel value={filterMonth} onChange={setFilterMonth} className="min-w-[170px]"
//                 options={["All Booking Months", ...MONTHS]} />
//               <Sel value={filterTravel} onChange={setFilterTravel} className="min-w-[160px]"
//                 options={["All Travel Months", ...MONTHS]} />
//             </div>
//           </div>

//           {/* Desktop table */}
//           <div className="hidden md:block overflow-x-auto">
//             <table className="w-full min-w-[1100px]">
//               <thead className="bg-slate-50 border-b border-slate-100">
//                 <tr>
//                   <th className="px-4 py-3.5 w-10">
//                     <input type="checkbox" checked={pageData.length > 0 && selected.size === pageData.length}
//                       onChange={toggleAll}
//                       className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer" />
//                   </th>
//                   <TH label="Booking Code" sortable sKey="code" />
//                   <TH label="Customer"     sortable sKey="customer" />
//                   <TH label="Destination" />
//                   <TH label="Travel Date"  sortable sKey="travelDate" />
//                   <TH label="Amount"       sortable sKey="customerAmount" right />
//                   <TH label="GST"          right />
//                   <TH label="TCS"          right />
//                   <TH label="Total"        sortable sKey="totalPayable" right />
//                   <TH label="Payment" />
//                   <TH label="Net Profit"   sortable sKey="netProfit" right />
//                   <TH label="Status"       sortable sKey="status" />
//                   <TH label="Actions" />
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-50">
//                 {loading
//                   ? [...Array(8)].map((_, i) => <SkeletonRow key={i} />)
//                   : pageData.length === 0
//                   ? (
//                     <tr>
//                       <td colSpan={13} className="text-center py-20">
//                         <div className="text-5xl mb-3">📭</div>
//                         <p className="text-slate-400 font-semibold text-sm">No bookings found</p>
//                         {anyFilter && (
//                           <button onClick={resetFilters} className="mt-3 text-sm text-blue-600 hover:underline font-semibold">Clear filters</button>
//                         )}
//                       </td>
//                     </tr>
//                   )
//                   : pageData.map(b => {
//                     const payPct = b.totalPayable > 0 ? Math.round(b.paid / b.totalPayable * 100) : 0;
//                     return (
//                       <tr key={b.id} className="transition-all duration-150 hover:bg-slate-50 hover:shadow-[inset_3px_0_0_#2563eb]">
//                         <td className="px-4 py-3.5">
//                           <input type="checkbox" checked={selected.has(b.id)} onChange={() => toggleSelect(b.id)}
//                             className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer" />
//                         </td>
//                         <td className="px-4 py-3.5">
//                           <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">{b.code}</span>
//                         </td>
//                         <td className="px-4 py-3.5">
//                           <p className="text-sm font-bold text-slate-700">{b.customer}</p>
//                           <p className="text-xs text-slate-400">{b.createdBy}</p>
//                         </td>
//                         <td className="px-4 py-3.5">
//                           <p className="text-xs font-semibold text-slate-600">{b.destination}</p>
//                           <div className="flex flex-wrap gap-1 mt-1">
//                             {b.services?.slice(0, 2).map(s => (
//                               <span key={s} className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">{s}</span>
//                             ))}
//                             {b.services?.length > 2 && <span className="text-xs text-slate-400">+{b.services.length - 2}</span>}
//                           </div>
//                         </td>
//                         <td className="px-4 py-3.5 text-sm font-semibold text-slate-600 whitespace-nowrap">{fmtDate(b.travelDate)}</td>
//                         <td className="px-4 py-3.5 text-sm font-bold text-slate-700 text-right">{fmtINR(b.customerAmount)}</td>
//                         <td className="px-4 py-3.5 text-xs text-slate-500 text-right">{fmtINR(b.gst)}</td>
//                         <td className="px-4 py-3.5 text-xs text-slate-500 text-right">{fmtINR(b.tcs)}</td>
//                         <td className="px-4 py-3.5 text-right">
//                           <p className="text-sm font-extrabold text-slate-800">{fmtINR(b.totalPayable)}</p>
//                           <div className="w-full h-1 bg-slate-100 rounded-full mt-1 overflow-hidden">
//                             <div className={`h-full rounded-full ${payPct === 100 ? "bg-green-500" : payPct > 0 ? "bg-blue-400" : "bg-slate-200"}`}
//                               style={{ width: `${payPct}%` }} />
//                           </div>
//                         </td>
//                         <td className="px-4 py-3.5">
//                           <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${PAY_STYLE[b.payStatus]}`}>{b.payStatus}</span>
//                         </td>
//                         <td className="px-4 py-3.5 text-right">
//                           <span className={`text-sm font-extrabold ${b.netProfit >= 0 ? "text-green-600" : "text-red-500"}`}>
//                             {fmtINR(b.netProfit)}
//                           </span>
//                         </td>
//                         <td className="px-4 py-3.5">
//                           <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${STATUS_STYLE[b.status]}`}>
//                             <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[b.status]}`} />
//                             {b.status}
//                           </span>
//                         </td>
//                         <td className="px-4 py-3.5">
//                           <div className="flex items-center gap-1.5">
//                             <button onClick={() => setModal(b)}
//                               className="w-8 h-8 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 flex items-center justify-center text-sm transition-all" title="View">👁</button>
//                             <button onClick={() => onEdit?.(b)}
//                               className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-500 flex items-center justify-center text-sm transition-all" title="Edit">✏️</button>
//                             <button onClick={() => handleDelete(b.id)}
//                               className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-600 flex items-center justify-center text-sm transition-all" title="Delete">🗑</button>
//                           </div>
//                         </td>
//                       </tr>
//                     );
//                   })}
//               </tbody>
//             </table>
//           </div>

//           {/* Mobile cards */}
//           <div className="md:hidden p-4 space-y-3">
//             {loading
//               ? [...Array(3)].map((_, i) => (
//                   <div key={i} className="bg-white rounded-2xl border border-slate-100 p-4 space-y-3">
//                     {[...Array(4)].map((_, j) => <div key={j} className="h-4 rounded-lg bg-slate-200 animate-pulse" />)}
//                   </div>
//                 ))
//               : pageData.length === 0
//               ? <div className="text-center py-16"><div className="text-4xl mb-2">📭</div><p className="text-slate-400 font-semibold">No bookings found</p></div>
//               : pageData.map(b => (
//                   <MobileBookingCard key={b.id} b={b} onView={setModal} onDelete={handleDelete} />
//                 ))
//             }
//           </div>

//           {/* Pagination */}
//           {filtered.length > 0 && (
//             <div className="px-5 py-4 border-t border-slate-100 bg-slate-50/60 flex flex-col sm:flex-row items-center justify-between gap-3">
//               <p className="text-xs text-slate-400 font-medium">
//                 Showing <span className="font-bold text-slate-600">{(page-1)*perPage+1}</span>–<span className="font-bold text-slate-600">{Math.min(page*perPage,filtered.length)}</span> of <span className="font-bold text-slate-600">{filtered.length}</span>
//               </p>
//               <div className="flex items-center gap-1.5">
//                 {["«","‹"].map((lbl,i) => (
//                   <button key={lbl} disabled={page===1} onClick={()=>setPage(i===0?1:p=>p-1)}
//                     className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-500 text-xs font-bold hover:border-blue-300 hover:text-blue-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
//                     {lbl}
//                   </button>
//                 ))}
//                 {Array.from({length:totalPages},(_,i)=>i+1)
//                   .filter(p => p===1||p===totalPages||Math.abs(p-page)<=1)
//                   .reduce((acc,p,i,arr)=>{ if(i>0&&p-arr[i-1]>1) acc.push("…"); acc.push(p); return acc; },[])
//                   .map((p,i)=>
//                     typeof p==="string"
//                     ? <span key={`e${i}`} className="w-8 h-8 flex items-center justify-center text-xs text-slate-400">…</span>
//                     : <button key={p} onClick={()=>setPage(p)}
//                         className={`w-8 h-8 rounded-lg text-xs font-bold transition-all border
//                           ${page===p?"bg-blue-600 border-blue-600 text-white shadow-sm":"bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600"}`}>
//                         {p}
//                       </button>
//                   )
//                 }
//                 {["›","»"].map((lbl,i) => (
//                   <button key={lbl} disabled={page===totalPages} onClick={()=>setPage(i===0?p=>p+1:totalPages)}
//                     className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-500 text-xs font-bold hover:border-blue-300 hover:text-blue-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
//                     {lbl}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Footer */}
//       <footer className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
//         <p className="text-xs text-slate-400">Copyright © 2026 <span className="text-blue-600 font-bold">TravelCRM</span>. All rights reserved.</p>
//         <p className="text-xs text-slate-400 font-semibold">Version 1.0.0</p>
//       </footer>
//     </div>
//   );
// }





import { useState, useEffect, useMemo, useCallback } from "react";

/* ─────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────── */
export const BOOKING_STATUSES = ["Confirmed","Pending","Cancelled","Completed","Refunded"];
export const PAY_STATUSES     = ["Paid","Partial","Unpaid","Refunded"];
const MONTHS = ["January","February","March","April","May","June",
                "July","August","September","October","November","December"];

const STATUS_STYLE = {
  Confirmed:  "bg-green-100 text-green-700 border-green-200",
  Pending:    "bg-amber-100 text-amber-700 border-amber-200",
  Cancelled:  "bg-red-100 text-red-600 border-red-200",
  Completed:  "bg-blue-100 text-blue-700 border-blue-200",
  Refunded:   "bg-purple-100 text-purple-700 border-purple-200",
};
const PAY_STYLE = {
  Paid:     "bg-emerald-100 text-emerald-700",
  Partial:  "bg-orange-100 text-orange-700",
  Unpaid:   "bg-rose-100 text-rose-700",
  Refunded: "bg-slate-100 text-slate-600",
};
const STATUS_DOT = {
  Confirmed:"bg-green-500", Pending:"bg-amber-500",
  Cancelled:"bg-red-500",   Completed:"bg-blue-500", Refunded:"bg-purple-500",
};
const STAT_CARDS = [
  { key:"total",     label:"Total Bookings", icon:"✈️",  gradient:"from-cyan-500 to-cyan-400",     money:false },
  { key:"confirmed", label:"Confirmed",      icon:"✅",  gradient:"from-green-500 to-emerald-400", money:false },
  { key:"revenue",   label:"Total Revenue",  icon:"💰",  gradient:"from-amber-500 to-yellow-400",  money:true  },
  { key:"net",       label:"Net Revenue",    icon:"📊",  gradient:"from-blue-600 to-blue-400",     money:true  },
  { key:"refunds",   label:"Total Refunds",  icon:"↩️",  gradient:"from-rose-500 to-red-400",      money:true  },
  { key:"profit",    label:"Net Profit",     icon:"📈",  gradient:"from-slate-600 to-slate-500",   money:true  },
];

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
export function fmtINR(n) {
  return "₹" + Number(n).toLocaleString("en-IN");
}
export function fmtDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" });
}

// 👉 FIX: Component ke bahar empty array define kiya taaki memory reference stable rahe
const EMPTY_BOOKINGS_ARRAY = [];

/* ─────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────── */

// Toast notification
function Toast({ msg, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className={`fixed top-5 right-5 z-[999] flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl max-w-xs
      animate-[slideIn_.3s_ease_both]
      ${type === "success"
        ? "bg-green-50 border-green-200 text-green-800"
        : "bg-red-50 border-red-200 text-red-800"}`}
    >
      <span className="text-lg">{type === "success" ? "✅" : "❌"}</span>
      <p className="text-sm font-semibold flex-1">{msg}</p>
      <button onClick={onClose} className="opacity-50 hover:opacity-100 text-lg ml-1">×</button>
    </div>
  );
}

// Stat card
function StatCard({ card, value }) {
  return (
    <div className={`bg-gradient-to-br ${card.gradient} rounded-2xl p-5 text-white shadow-lg relative overflow-hidden`}>
      <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full bg-white/10" />
      <div className="absolute -right-2 -bottom-6 w-28 h-28 rounded-full bg-white/10" />
      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-xs font-bold opacity-80 uppercase tracking-widest mb-1">{card.label}</p>
          <p className="text-2xl sm:text-3xl font-extrabold leading-none">
            {card.money ? fmtINR(value) : value}
          </p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl">
          {card.icon}
        </div>
      </div>
    </div>
  );
}

// Booking detail modal
function BookingModal({ booking, onClose }) {
  if (!booking) return null;
  const payPct = booking.totalPayable > 0
    ? Math.round(booking.paid / booking.totalPayable * 100)
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto
        animate-[popIn_.25s_ease_both]"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-5 rounded-t-2xl flex items-start justify-between">
          <div>
            <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-0.5">Booking Detail</p>
            <h2 className="text-white text-xl font-extrabold">{booking.code}</h2>
            <p className="text-blue-100 text-sm mt-0.5">{booking.customer}</p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center text-lg transition-all">
            ×
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${STATUS_STYLE[booking.status]}`}>
              <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${STATUS_DOT[booking.status]}`} />
              {booking.status}
            </span>
            <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${PAY_STYLE[booking.payStatus]}`}>
              💳 {booking.payStatus}
            </span>
            {booking.services?.map(s => (
              <span key={s} className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">{s}</span>
            ))}
          </div>

          {/* Detail grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              ["📍","Destination",   booking.destination],
              ["📅","Travel Date",   fmtDate(booking.travelDate)],
              ["🗓️","Booking Date",  fmtDate(booking.bookingDate)],
              ["👤","Created By",    booking.createdBy],
              ["💰","Customer Amt",  fmtINR(booking.customerAmount)],
              ["🏷️","Vendor Cost",   fmtINR(booking.vendorCost)],
              ["🧾","GST (5%)",      fmtINR(booking.gst)],
              ["📋","TCS (5%)",      fmtINR(booking.tcs)],
              ["💳","Total Payable", fmtINR(booking.totalPayable)],
            ].map(([icon, label, val]) => (
              <div key={label} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <p className="text-xs text-slate-400 font-medium mb-0.5">{icon} {label}</p>
                <p className="text-sm font-bold text-slate-700">{val}</p>
              </div>
            ))}
          </div>

          {/* Payment progress */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-bold text-slate-600">Payment Progress</p>
              <p className="text-sm font-extrabold text-blue-600">{payPct}%</p>
            </div>
            <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-700
                ${payPct === 100 ? "bg-green-500" : payPct > 0 ? "bg-blue-500" : "bg-slate-300"}`}
                style={{ width: `${payPct}%` }} />
            </div>
            <div className="flex justify-between mt-1.5 text-xs text-slate-400 font-medium">
              <span>Paid: {fmtINR(booking.paid)}</span>
              <span>Due: {fmtINR(Math.max(0, booking.totalPayable - booking.paid))}</span>
            </div>
          </div>

          {/* Profit */}
          <div className={`rounded-xl p-4 border flex items-center gap-3
            ${booking.netProfit >= 0 ? "bg-green-50 border-green-100" : "bg-red-50 border-red-100"}`}>
            <span className="text-2xl">{booking.netProfit >= 0 ? "📈" : "📉"}</span>
            <div>
              <p className="text-xs font-medium text-slate-500">Net Profit</p>
              <p className={`text-lg font-extrabold ${booking.netProfit >= 0 ? "text-green-700" : "text-red-600"}`}>
                {fmtINR(booking.netProfit)}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2 pt-1">
            <button className="flex-1 min-w-[120px] py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-all">
              ✏️ Edit Booking
            </button>
            <button className="flex-1 min-w-[120px] py-2.5 rounded-xl bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 text-sm font-bold transition-all">
              📧 Send Voucher
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

// Mobile booking card
function MobileBookingCard({ b, onView, onDelete }) {
  const payPct = b.totalPayable > 0 ? Math.round(b.paid / b.totalPayable * 100) : 0;
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg">{b.code}</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${STATUS_STYLE[b.status]}`}>
              <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1 ${STATUS_DOT[b.status]}`} />
              {b.status}
            </span>
          </div>
          <p className="font-bold text-slate-800 text-sm">{b.customer}</p>
          <p className="text-xs text-slate-400 mt-0.5">📍 {b.destination}</p>
        </div>
        <div className="text-right">
          <p className="text-base font-extrabold text-slate-800">{fmtINR(b.totalPayable)}</p>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${PAY_STYLE[b.payStatus]}`}>{b.payStatus}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {b.services?.map(s => (
          <span key={s} className="text-xs bg-slate-100 text-slate-500 font-semibold px-2 py-0.5 rounded-full">{s}</span>
        ))}
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>📅 {fmtDate(b.travelDate)}</span>
        <span>Profit: <span className={b.netProfit >= 0 ? "text-green-600 font-bold" : "text-red-500 font-bold"}>{fmtINR(b.netProfit)}</span></span>
      </div>

      <div>
        <div className="flex justify-between text-xs text-slate-400 mb-1">
          <span>Payment</span><span>{payPct}%</span>
        </div>
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div className={`h-full rounded-full ${payPct === 100 ? "bg-green-500" : payPct > 0 ? "bg-blue-500" : "bg-slate-200"}`}
            style={{ width: `${payPct}%` }} />
        </div>
      </div>

      <div className="flex gap-2 pt-1">
        <button onClick={() => onView(b)} className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all">👁 View</button>
        <button className="flex-1 py-2 rounded-xl bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 text-xs font-bold transition-all">✏️ Edit</button>
        <button onClick={() => onDelete(b.id)} className="w-9 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 border border-red-200 text-xs font-bold transition-all flex items-center justify-center">🗑</button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
export default function BookingsPage({
  bookings: propBookings = EMPTY_BOOKINGS_ARRAY, // 👉 FIX: Stable memory reference instead of `[]`
  loading: propLoading = false,
  onCreateLead,
  onEdit,
  onRefresh,
}) {
  const [bookings, setBookings]     = useState(propBookings);
  const [loading, setLoading]       = useState(propLoading);
  const [search, setSearch]         = useState("");
  const [filterStatus, setFilterStatus]   = useState("All Status");
  const [filterPay, setFilterPay]         = useState("All Payment Status");
  const [filterMonth, setFilterMonth]     = useState("All Booking Months");
  const [filterTravel, setFilterTravel]   = useState("All Travel Months");
  const [sortKey, setSortKey]       = useState("id");
  const [sortDir, setSortDir]       = useState("desc");
  const [page, setPage]             = useState(1);
  const perPage = 10;
  const [selected, setSelected]     = useState(new Set());
  const [modal, setModal]           = useState(null);
  const [toast, setToast]           = useState(null);

  useEffect(() => { setBookings(propBookings); }, [propBookings]);
  useEffect(() => { setLoading(propLoading);   }, [propLoading]);

  const showToast = (msg, type = "success") => setToast({ msg, type });

  /* stats */
  const stats = useMemo(() => ({
    total:     bookings.length,
    confirmed: bookings.filter(b => b.status === "Confirmed").length,
    revenue:   bookings.reduce((s, b) => s + (b.customerAmount || 0), 0),
    net:       bookings.reduce((s, b) => s + (b.paid || 0), 0),
    refunds:   bookings.filter(b => b.payStatus === "Refunded").reduce((s, b) => s + (b.paid || 0), 0),
    profit:    bookings.reduce((s, b) => s + (b.netProfit || 0), 0),
  }), [bookings]);

  /* filter + sort */
  const filtered = useMemo(() => {
    let out = [...bookings];
    const q = search.toLowerCase();
    if (q) out = out.filter(b =>
      (b.code||"").toLowerCase().includes(q) ||
      (b.customer||"").toLowerCase().includes(q) ||
      (b.destination||"").toLowerCase().includes(q)
    );
    if (filterStatus !== "All Status")
      out = out.filter(b => b.status === filterStatus);
    if (filterPay !== "All Payment Status")
      out = out.filter(b => b.payStatus === filterPay);
    if (filterMonth !== "All Booking Months") {
      const mi = MONTHS.indexOf(filterMonth) + 1;
      out = out.filter(b => new Date(b.bookingDate).getMonth() + 1 === mi);
    }
    if (filterTravel !== "All Travel Months") {
      const mi = MONTHS.indexOf(filterTravel) + 1;
      out = out.filter(b => new Date(b.travelDate).getMonth() + 1 === mi);
    }
    out.sort((a, b) => {
      let av = a[sortKey], bv = b[sortKey];
      if (typeof av === "string") { av = av.toLowerCase(); bv = bv.toLowerCase(); }
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ?  1 : -1;
      return 0;
    });
    return out;
  }, [bookings, search, filterStatus, filterPay, filterMonth, filterTravel, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageData   = filtered.slice((page - 1) * perPage, page * perPage);

  const handleSort = key => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };
  const sortIcon = key => sortKey === key ? (sortDir === "asc" ? "↑" : "↓") : "↕";

  const toggleSelect = id => setSelected(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleAll    = () => selected.size === pageData.length
    ? setSelected(new Set())
    : setSelected(new Set(pageData.map(b => b.id)));

  const handleDelete = useCallback(id => {
    setBookings(p => p.filter(b => b.id !== id));
    setSelected(s => { const n = new Set(s); n.delete(id); return n; });
    showToast("Booking deleted successfully.");
  }, []);

  const handleBulkDelete = () => {
    setBookings(p => p.filter(b => !selected.has(b.id)));
    showToast(`${selected.size} booking(s) deleted.`);
    setSelected(new Set());
  };

  const resetFilters = () => {
    setSearch(""); setFilterStatus("All Status");
    setFilterPay("All Payment Status"); setFilterMonth("All Booking Months");
    setFilterTravel("All Travel Months"); setPage(1);
  };

  const anyFilter = search || filterStatus !== "All Status" || filterPay !== "All Payment Status"
    || filterMonth !== "All Booking Months" || filterTravel !== "All Travel Months";

  // helper components
  function Sel({ value, onChange, options, className = "" }) {
    return (
      <div className={`relative ${className}`}>
        <select value={value} onChange={e => { onChange(e.target.value); setPage(1); }}
          className="w-full pl-3 pr-8 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-600 font-medium
            focus:border-blue-400 focus:ring-2 focus:ring-blue-50 outline-none cursor-pointer appearance-none transition-all">
          {options.map(o => <option key={o}>{o}</option>)}
        </select>
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none">▼</span>
      </div>
    );
  }

  function TH({ label, sKey, sortable, right }) {
    return (
      <th onClick={sortable ? () => handleSort(sKey) : undefined}
        className={`px-4 py-3.5 text-left text-xs font-extrabold text-slate-500 uppercase tracking-wider whitespace-nowrap
          ${sortable ? "cursor-pointer hover:text-blue-600 select-none" : ""}
          ${right ? "text-right" : ""}`}>
        {label} {sortable && <span className="opacity-50">{sortIcon(sKey)}</span>}
      </th>
    );
  }

  function SkeletonRow() {
    return (
      <tr>
        {[...Array(13)].map((_, i) => (
          <td key={i} className="px-4 py-3.5">
            <div className="h-4 rounded-lg bg-slate-200 animate-pulse" style={{ width: `${40 + Math.random() * 50}%` }} />
          </td>
        ))}
      </tr>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 font-sans">
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      {modal && <BookingModal booking={modal} onClose={() => setModal(null)} />}

      {/* Topbar */}
      {/* <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-sm shadow">T</div>
            <span className="font-extrabold text-slate-800 hidden sm:block">TravelCRM</span>
          </div>
          <nav className="text-xs text-slate-400 flex items-center gap-1">
            <span className="hover:text-blue-600 cursor-pointer">Home</span>
            <span className="mx-1">/</span>
            <span className="text-blue-600 font-bold">Bookings</span>
          </nav>
        </div>
      </nav> */}

      {/* Page header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-2xl shadow-lg shadow-blue-200">
                ✈️
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">Bookings</h1>
                <p className="text-sm text-slate-400 mt-0.5">Manage all travel bookings & financial records</p>
              </div>
            </div>
            <button
              onClick={() => (window.location.href = "/allleads")}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold
                shadow-md shadow-blue-200 hover:shadow-lg transition-all"
            >
              ＋ Create from Lead
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
          {STAT_CARDS.map(card => (
            <StatCard key={card.key} card={card} value={stats[card.key]} />
          ))}
        </div>

        {/* Tax & Profit Summary */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-5 py-4">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">📋 Tax & Profit Summary (Current Page)</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              ["💵","Total Charges",  pageData.reduce((s,b)=>s+(b.totalPayable||0),0), "blue"],
              ["📊","Net Profit",     pageData.reduce((s,b)=>s+(b.netProfit||0),0),    "green"],
              ["🧾","GST Collected",  pageData.reduce((s,b)=>s+(b.gst||0),0),          "amber"],
              ["📋","TCS Collected",  pageData.reduce((s,b)=>s+(b.tcs||0),0),          "purple"],
            ].map(([icon,label,val,color]) => (
              <div key={label} className={`bg-${color}-50 border border-${color}-100 rounded-xl px-4 py-3`}>
                <p className="text-xs text-slate-500 font-medium mb-0.5">{icon} {label}</p>
                <p className={`text-base font-extrabold text-${color}-700`}>{fmtINR(val)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Booking list */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

          {/* List header */}
          <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-base font-extrabold text-slate-700">Booking List</h2>
              <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2.5 py-1 rounded-full">{filtered.length} bookings</span>
              {selected.size > 0 && (
                <button onClick={handleBulkDelete}
                  className="text-xs bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold px-3 py-1.5 rounded-lg transition-all">
                  🗑 Delete {selected.size} selected
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              {onRefresh && (
                <button onClick={onRefresh}
                  className="text-xs text-slate-500 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 border border-slate-200 font-semibold px-3 py-1.5 rounded-lg transition-all">
                  🔄 Refresh
                </button>
              )}
              {anyFilter && (
                <button onClick={resetFilters}
                  className="text-xs text-slate-400 hover:text-red-500 font-semibold flex items-center gap-1 transition-colors">
                  ✕ Clear filters
                </button>
              )}
            </div>
          </div>

          {/* Filters */}
          <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/60">
            <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
              <div className="relative flex-1 min-w-[200px]">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
                <input type="text" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                  placeholder="Search by code, customer, destination..."
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 placeholder-slate-400
                    focus:border-blue-400 focus:ring-2 focus:ring-blue-50 outline-none transition-all" />
              </div>
              <Sel value={filterStatus} onChange={setFilterStatus} className="min-w-[150px]"
                options={["All Status", ...BOOKING_STATUSES]} />
              <Sel value={filterPay} onChange={setFilterPay} className="min-w-[170px]"
                options={["All Payment Status", ...PAY_STATUSES]} />
              <Sel value={filterMonth} onChange={setFilterMonth} className="min-w-[170px]"
                options={["All Booking Months", ...MONTHS]} />
              <Sel value={filterTravel} onChange={setFilterTravel} className="min-w-[160px]"
                options={["All Travel Months", ...MONTHS]} />
            </div>
          </div>

          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-4 py-3.5 w-10">
                    <input type="checkbox" checked={pageData.length > 0 && selected.size === pageData.length}
                      onChange={toggleAll}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer" />
                  </th>
                  <TH label="Booking Code" sortable sKey="code" />
                  <TH label="Customer"     sortable sKey="customer" />
                  <TH label="Destination" />
                  <TH label="Travel Date"  sortable sKey="travelDate" />
                  <TH label="Amount"       sortable sKey="customerAmount" right />
                  <TH label="GST"          right />
                  <TH label="TCS"          right />
                  <TH label="Total"        sortable sKey="totalPayable" right />
                  <TH label="Payment" />
                  <TH label="Net Profit"   sortable sKey="netProfit" right />
                  <TH label="Status"       sortable sKey="status" />
                  <TH label="Actions" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading
                  ? [...Array(8)].map((_, i) => <SkeletonRow key={i} />)
                  : pageData.length === 0
                  ? (
                    <tr>
                      <td colSpan={13} className="text-center py-20">
                        <div className="text-5xl mb-3">📭</div>
                        <p className="text-slate-400 font-semibold text-sm">No bookings found</p>
                        {anyFilter && (
                          <button onClick={resetFilters} className="mt-3 text-sm text-blue-600 hover:underline font-semibold">Clear filters</button>
                        )}
                      </td>
                    </tr>
                  )
                  : pageData.map(b => {
                    const payPct = b.totalPayable > 0 ? Math.round(b.paid / b.totalPayable * 100) : 0;
                    return (
                      <tr key={b.id} className="transition-all duration-150 hover:bg-slate-50 hover:shadow-[inset_3px_0_0_#2563eb]">
                        <td className="px-4 py-3.5">
                          <input type="checkbox" checked={selected.has(b.id)} onChange={() => toggleSelect(b.id)}
                            className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer" />
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">{b.code}</span>
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="text-sm font-bold text-slate-700">{b.customer}</p>
                          <p className="text-xs text-slate-400">{b.createdBy}</p>
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="text-xs font-semibold text-slate-600">{b.destination}</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {b.services?.slice(0, 2).map(s => (
                              <span key={s} className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">{s}</span>
                            ))}
                            {b.services?.length > 2 && <span className="text-xs text-slate-400">+{b.services.length - 2}</span>}
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-sm font-semibold text-slate-600 whitespace-nowrap">{fmtDate(b.travelDate)}</td>
                        <td className="px-4 py-3.5 text-sm font-bold text-slate-700 text-right">{fmtINR(b.customerAmount)}</td>
                        <td className="px-4 py-3.5 text-xs text-slate-500 text-right">{fmtINR(b.gst)}</td>
                        <td className="px-4 py-3.5 text-xs text-slate-500 text-right">{fmtINR(b.tcs)}</td>
                        <td className="px-4 py-3.5 text-right">
                          <p className="text-sm font-extrabold text-slate-800">{fmtINR(b.totalPayable)}</p>
                          <div className="w-full h-1 bg-slate-100 rounded-full mt-1 overflow-hidden">
                            <div className={`h-full rounded-full ${payPct === 100 ? "bg-green-500" : payPct > 0 ? "bg-blue-400" : "bg-slate-200"}`}
                              style={{ width: `${payPct}%` }} />
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${PAY_STYLE[b.payStatus]}`}>{b.payStatus}</span>
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <span className={`text-sm font-extrabold ${b.netProfit >= 0 ? "text-green-600" : "text-red-500"}`}>
                            {fmtINR(b.netProfit)}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${STATUS_STYLE[b.status]}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[b.status]}`} />
                            {b.status}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1.5">
                            <button onClick={() => setModal(b)}
                              className="w-8 h-8 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 flex items-center justify-center text-sm transition-all" title="View">👁</button>
                            <button onClick={() => onEdit?.(b)}
                              className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-500 flex items-center justify-center text-sm transition-all" title="Edit">✏️</button>
                            <button onClick={() => handleDelete(b.id)}
                              className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-600 flex items-center justify-center text-sm transition-all" title="Delete">🗑</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden p-4 space-y-3">
            {loading
              ? [...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-slate-100 p-4 space-y-3">
                    {[...Array(4)].map((_, j) => <div key={j} className="h-4 rounded-lg bg-slate-200 animate-pulse" />)}
                  </div>
                ))
              : pageData.length === 0
              ? <div className="text-center py-16"><div className="text-4xl mb-2">📭</div><p className="text-slate-400 font-semibold">No bookings found</p></div>
              : pageData.map(b => (
                  <MobileBookingCard key={b.id} b={b} onView={setModal} onDelete={handleDelete} />
                ))
            }
          </div>

          {/* Pagination */}
          {filtered.length > 0 && (
            <div className="px-5 py-4 border-t border-slate-100 bg-slate-50/60 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-slate-400 font-medium">
                Showing <span className="font-bold text-slate-600">{(page-1)*perPage+1}</span>–<span className="font-bold text-slate-600">{Math.min(page*perPage,filtered.length)}</span> of <span className="font-bold text-slate-600">{filtered.length}</span>
              </p>
              <div className="flex items-center gap-1.5">
                {["«","‹"].map((lbl,i) => (
                  <button key={lbl} disabled={page===1} onClick={()=>setPage(i===0?1:p=>p-1)}
                    className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-500 text-xs font-bold hover:border-blue-300 hover:text-blue-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                    {lbl}
                  </button>
                ))}
                {Array.from({length:totalPages},(_,i)=>i+1)
                  .filter(p => p===1||p===totalPages||Math.abs(p-page)<=1)
                  .reduce((acc,p,i,arr)=>{ if(i>0&&p-arr[i-1]>1) acc.push("…"); acc.push(p); return acc; },[])
                  .map((p,i)=>
                    typeof p==="string"
                    ? <span key={`e${i}`} className="w-8 h-8 flex items-center justify-center text-xs text-slate-400">…</span>
                    : <button key={p} onClick={()=>setPage(p)}
                        className={`w-8 h-8 rounded-lg text-xs font-bold transition-all border
                          ${page===p?"bg-blue-600 border-blue-600 text-white shadow-sm":"bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600"}`}>
                        {p}
                      </button>
                  )
                }
                {["›","»"].map((lbl,i) => (
                  <button key={lbl} disabled={page===totalPages} onClick={()=>setPage(i===0?p=>p+1:totalPages)}
                    className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-500 text-xs font-bold hover:border-blue-300 hover:text-blue-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                    {lbl}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="text-xs text-slate-400">Copyright © 2026 <span className="text-blue-600 font-bold">TravelCRM</span>. All rights reserved.</p>
        <p className="text-xs text-slate-400 font-semibold">Version 1.0.0</p>
      </footer>
    </div>
  );
}