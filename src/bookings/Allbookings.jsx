
// import { useState, useEffect, useMemo, useCallback } from "react";

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

// // 👉 FIX: Component ke bahar empty array define kiya taaki memory reference stable rahe
// const EMPTY_BOOKINGS_ARRAY = [];

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
// export default function BookingsPage({
//   bookings: propBookings = EMPTY_BOOKINGS_ARRAY, // 👉 FIX: Stable memory reference instead of `[]`
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
//       {/* <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
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
//       </nav> */}

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
//     </div>
//   );
// }



// import { useState, useEffect, useMemo, useCallback } from "react";
// import bookingService from "../services/bookingService";
// import EditBookingModal from "./EditBookingModal";
// import CancelBookingModal from "./CancelBookingModal";
// import { hasPermission, P } from "../services/access";

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

// // Backend enums are UPPERCASE (CONFIRMED / PAID); this page's style maps are Title Case.
// const titleCase = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : s);

// // Map a backend BookingResponseDTO → the shape this page renders. publicId is the only
// // id exposed, so it doubles as the row key / selection id (never the internal Long id).
// function normalizeBooking(b = {}) {
//   return {
//     id:             b.publicId,
//     code:           b.bookingCode,
//     customer:       b.customerNameSnapshot,
//     createdBy:      b.createdBy,
//     destination:    b.destinationSnapshot,
//     services:       Array.isArray(b.services) ? b.services : [],
//     bookingDate:    b.bookingDate,
//     travelDate:     b.travelDate,
//     customerAmount: Number(b.customerAmount) || 0,
//     vendorCost:     Number(b.vendorCost) || 0,
//     gst:            Number(b.gst) || 0,
//     tcs:            Number(b.tcs) || 0,
//     totalPayable:   Number(b.totalPayable) || 0,
//     paid:           Number(b.paidAmount) || 0,
//     netProfit:      Number(b.netProfit) || 0,
//     status:         titleCase(b.status),
//     payStatus:      titleCase(b.paymentStatus),
//   };
// }

// // 👉 FIX: Component ke bahar empty array define kiya taaki memory reference stable rahe
// const EMPTY_BOOKINGS_ARRAY = [];

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
// function BookingModal({ booking, onClose, onEdit, onCancel }) {
//   if (!booking) return null;
//   const canCancel = hasPermission(P.BOOKING_CANCEL) && booking.status !== "Completed" && booking.status !== "Cancelled";
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
//             <button onClick={() => { onClose(); onEdit?.(booking); }}
//               className="flex-1 min-w-[120px] py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-all">
//               ✏️ Edit Booking
//             </button>
//             {canCancel && (
//               <button onClick={() => { onClose(); onCancel?.(booking); }}
//                 className="flex-1 min-w-[120px] py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 text-sm font-bold transition-all">
//                 🚫 Cancel Booking
//               </button>
//             )}
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
// function MobileBookingCard({ b, onView, onEdit, onCancel, onDelete }) {
//   const canCancel = hasPermission(P.BOOKING_CANCEL) && b.status !== "Completed" && b.status !== "Cancelled";
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
//         <button onClick={() => onEdit?.(b)} className="flex-1 py-2 rounded-xl bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 text-xs font-bold transition-all">✏️ Edit</button>
//         {canCancel && (
//           <button onClick={() => onCancel?.(b)} className="flex-1 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 text-xs font-bold transition-all">🚫 Cancel</button>
//         )}
//         <button onClick={() => onDelete(b.id)} className="w-9 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 border border-red-200 text-xs font-bold transition-all flex items-center justify-center">🗑</button>
//       </div>
//     </div>
//   );
// }

// /* ─────────────────────────────────────────
//    MAIN PAGE
// ───────────────────────────────────────── */
// export default function BookingsPage({
//   bookings: propBookings = EMPTY_BOOKINGS_ARRAY, // 👉 FIX: Stable memory reference instead of `[]`
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
//   const [editBooking, setEditBooking]     = useState(null);
//   const [cancelBooking, setCancelBooking] = useState(null);
//   const [toast, setToast]           = useState(null);

//   const showToast = (msg, type = "success") => setToast({ msg, type });

//   // Standalone usage (the /Allbookings route renders this with no props) → fetch from the
//   // API ourselves. When a parent supplies bookings via props, mirror those instead.
//   const selfManaged = propBookings.length === 0;

//   const fetchBookings = useCallback(async () => {
//     setLoading(true);
//     try {
//       const res     = await bookingService.getAll(0, 500);
//       const body    = res.data;
//       const rawList = Array.isArray(body?.data) ? body.data
//                     : Array.isArray(body)       ? body
//                     : [];
//       setBookings(rawList.map(normalizeBooking));
//     } catch (e) {
//       console.error("Failed to load bookings:", e);
//       setToast({ msg: "Failed to load bookings.", type: "error" });
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     if (selfManaged) { fetchBookings(); return; }
//     setBookings(propBookings);
//     setLoading(propLoading);
//   }, [propBookings, propLoading, selfManaged, fetchBookings]);

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

//   // Edit defers to a parent-provided onEdit when present, else opens the local edit modal.
//   const openEdit   = (b) => (onEdit ? onEdit(b) : setEditBooking(b));
//   const openCancel = (b) => setCancelBooking(b);
//   const refreshList = onRefresh || fetchBookings;

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
//       {modal && <BookingModal booking={modal} onClose={() => setModal(null)} onEdit={openEdit} onCancel={openCancel} />}
//       {editBooking && (
//         <EditBookingModal booking={editBooking} onClose={() => setEditBooking(null)}
//           onSaved={refreshList} onToast={showToast} />
//       )}
//       {cancelBooking && (
//         <CancelBookingModal booking={cancelBooking} onClose={() => setCancelBooking(null)}
//           onCancelled={refreshList} onToast={showToast} />
//       )}

//       {/* Topbar */}
//       {/* <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
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
//       </nav> */}

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
//               {(onRefresh || selfManaged) && (
//                 <button onClick={onRefresh || fetchBookings}
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
//                             <button onClick={() => openEdit(b)}
//                               className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-500 flex items-center justify-center text-sm transition-all" title="Edit">✏️</button>
//                             {hasPermission(P.BOOKING_CANCEL) && b.status !== "Completed" && b.status !== "Cancelled" && (
//                               <button onClick={() => openCancel(b)}
//                                 className="w-8 h-8 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-600 flex items-center justify-center text-sm transition-all" title="Cancel">🚫</button>
//                             )}
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
//                   <MobileBookingCard key={b.id} b={b} onView={setModal} onEdit={openEdit} onCancel={openCancel} onDelete={handleDelete} />
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
//     </div>
//   );
// }


// src/components/Bookings/BookingsPage.jsx
// ─────────────────────────────────────────────────────────────
// All Bookings Page — Travel CRM (Modern Enhanced)
// Design system: from-slate-50 via-blue-50/30 to-slate-100
//   glass cards · blue-600 primary · Plus Jakarta Sans
// All original logic preserved — only UI enhanced
// ─────────────────────────────────────────────────────────────

import { useState, useEffect, useMemo, useCallback } from "react";
import bookingService from "../services/bookingService";
import EditBookingModal from "./EditBookingModal";
import CancelBookingModal from "./CancelBookingModal";
import { hasPermission, P } from "../services/access";
import {
  FiSearch, FiRefreshCw, FiFilter,
  FiChevronDown, FiEye, FiEdit2, FiTrash2,
  FiX, FiPrinter, FiChevronLeft, FiChevronRight,
  FiAlertCircle, FiCheck, FiTrendingUp,
} from "react-icons/fi";
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaPlane } from "react-icons/fa";

/* ─── CONSTANTS ──────────────────────────────────────────────── */
export const BOOKING_STATUSES = ["Confirmed","Pending","Cancelled","Completed","Refunded"];
export const PAY_STATUSES     = ["Paid","Partial","Unpaid","Refunded"];
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const STATUS_STYLE = {
  Confirmed: "bg-green-100  text-green-700  border-green-200",
  Pending:   "bg-amber-100  text-amber-700  border-amber-200",
  Cancelled: "bg-red-100    text-red-600    border-red-200",
  Completed: "bg-blue-100   text-blue-700   border-blue-200",
  Refunded:  "bg-purple-100 text-purple-700 border-purple-200",
};
const PAY_STYLE = {
  Paid:     "bg-emerald-100 text-emerald-700 border-emerald-200",
  Partial:  "bg-orange-100  text-orange-700  border-orange-200",
  Unpaid:   "bg-rose-100    text-rose-700    border-rose-200",
  Refunded: "bg-slate-100   text-slate-600   border-slate-200",
};
const STATUS_DOT = {
  Confirmed:"bg-green-500",  Pending:"bg-amber-500",
  Cancelled:"bg-red-500",    Completed:"bg-blue-500", Refunded:"bg-purple-500",
};
const STAT_CARDS = [
  { key:"total",     label:"Total Bookings", icon:"✈️", from:"from-cyan-500",   to:"to-cyan-600",     money:false },
  { key:"confirmed", label:"Confirmed",      icon:"✅", from:"from-green-500",  to:"to-emerald-600",  money:false },
  { key:"revenue",   label:"Total Revenue",  icon:"💰", from:"from-amber-500",  to:"to-orange-500",   money:true  },
  { key:"net",       label:"Net Revenue",    icon:"💳", from:"from-blue-600",   to:"to-blue-700",     money:true  },
  { key:"refunds",   label:"Refunds",        icon:"↩️", from:"from-rose-500",   to:"to-red-600",      money:true  },
  { key:"profit",    label:"Net Profit",     icon:"📈", from:"from-slate-600",  to:"to-slate-700",    money:true  },
];

/* ─── HELPERS ────────────────────────────────────────────────── */
export const fmtINR = n =>
  "₹" + Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits:2, maximumFractionDigits:2 });
export const fmtDate = d =>
  d ? new Date(d).toLocaleDateString("en-IN",{ day:"2-digit", month:"short", year:"numeric" }) : "—";
const titleCase = s => s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : s;

function normalizeBooking(b = {}) {
  return {
    id:             b.publicId,
    code:           b.bookingCode,
    customer:       b.customerNameSnapshot,
    createdBy:      b.createdBy,
    destination:    b.destinationSnapshot,
    services:       Array.isArray(b.services) ? b.services : [],
    bookingDate:    b.bookingDate,
    travelDate:     b.travelDate,
    customerAmount: Number(b.customerAmount) || 0,
    vendorCost:     Number(b.vendorCost)     || 0,
    gst:            Number(b.gst)            || 0,
    tcs:            Number(b.tcs)            || 0,
    totalPayable:   Number(b.totalPayable)   || 0,
    paid:           Number(b.paidAmount)     || 0,
    netProfit:      Number(b.netProfit)      || 0,
    status:         titleCase(b.status),
    payStatus:      titleCase(b.paymentStatus),
  };
}

const EMPTY_BOOKINGS_ARRAY = [];

/* ─── TOAST ──────────────────────────────────────────────────── */
function Toast({ msg, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div className={`fixed top-5 right-5 z-[999] flex items-center gap-3 px-4 py-3.5 rounded-2xl border shadow-2xl max-w-sm
      ${type==="success" ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800"}`}
      style={{animation:"slideIn .3s ease both"}}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
        ${type==="success" ? "bg-green-100" : "bg-red-100"}`}>
        {type==="success"
          ? <FiCheck className="w-4 h-4 text-green-600"/>
          : <FiAlertCircle className="w-4 h-4 text-red-600"/>}
      </div>
      <p className="text-sm font-semibold flex-1">{msg}</p>
      <button onClick={onClose} className="opacity-50 hover:opacity-100 transition-opacity">
        <FiX className="w-4 h-4"/>
      </button>
    </div>
  );
}

/* ─── ANIMATED STAT CARD ─────────────────────────────────────── */
function StatCard({ card, value }) {
  const [disp, setDisp] = useState(0);
  useEffect(() => {
    const target = Number(value) || 0;
    if (target === 0) { setDisp(0); return; }
    let s = 0;
    const step = Math.max(1, target / 60);
    const iv = setInterval(() => {
      s = Math.min(s + step, target);
      setDisp(Math.round(s));
      if (s >= target) clearInterval(iv);
    }, 16);
    return () => clearInterval(iv);
  }, [value]);

  return (
    <div className={`bg-gradient-to-br ${card.from} ${card.to} rounded-2xl p-5 text-white
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
    booking.status !== "Completed" && booking.status !== "Cancelled";
  const payPct = booking.totalPayable > 0
    ? Math.round((booking.paid / booking.totalPayable) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={e => e.target === e.currentTarget && onClose()}>
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
          {/* Status badges */}
          <div className="flex flex-wrap gap-2">
            <span className={`px-3 py-1.5 rounded-full text-xs font-extrabold border flex items-center gap-1.5 ${STATUS_STYLE[booking.status]}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[booking.status]}`}/>{booking.status}
            </span>
            <span className={`px-3 py-1.5 rounded-full text-xs font-extrabold border ${PAY_STYLE[booking.payStatus]}`}>
              💳 {booking.payStatus}
            </span>
            {booking.services?.map(s=>(
              <span key={s} className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">{s}</span>
            ))}
          </div>

          {/* Detail grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
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
              <span>Due: {fmtINR(Math.max(0, booking.totalPayable - booking.paid))}</span>
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
            <button onClick={()=>{onClose(); onEdit?.(booking);}}
              className="flex-1 min-w-[120px] flex items-center justify-center gap-2 py-3 rounded-2xl
                bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600
                text-white text-sm font-bold shadow-md shadow-blue-200 transition-all">
              <FiEdit2 className="w-4 h-4"/> Edit Booking
            </button>
            {canCancel && (
              <button onClick={()=>{onClose(); onCancel?.(booking);}}
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
  const canCancel = hasPermission(P.BOOKING_CANCEL) &&
    b.status!=="Completed" && b.status!=="Cancelled";
  const payPct = b.totalPayable>0 ? Math.round(b.paid/b.totalPayable*100) : 0;
  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-4 space-y-3
      hover:shadow-md hover:border-blue-200 transition-all duration-200">
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100">
              {b.code}
            </span>
            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border flex items-center gap-1 ${STATUS_STYLE[b.status]}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[b.status]}`}/>{b.status}
            </span>
          </div>
          <p className="font-extrabold text-slate-800 text-sm truncate">{b.customer}</p>
          <p className="text-xs text-slate-400 mt-0.5">📍 {b.destination}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-base font-extrabold text-slate-800">{fmtINR(b.totalPayable)}</p>
          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${PAY_STYLE[b.payStatus]}`}>
            {b.payStatus}
          </span>
        </div>
      </div>

      {/* Services */}
      {b.services?.length>0 && (
        <div className="flex flex-wrap gap-1.5">
          {b.services.map(s=>(
            <span key={s} className="text-[10px] bg-slate-100 text-slate-500 font-semibold px-2 py-0.5 rounded-full">{s}</span>
          ))}
        </div>
      )}

      {/* Date + profit */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1">📅 {fmtDate(b.travelDate)}</span>
        <span className={`font-extrabold ${b.netProfit>=0?"text-green-600":"text-red-500"}`}>
          {b.netProfit>=0?"📈":"📉"} {fmtINR(b.netProfit)}
        </span>
      </div>

      {/* Payment bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-[10px] text-slate-400 font-medium">
          <span>Payment</span><span>{payPct}%</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-700
            ${payPct===100?"bg-green-500":payPct>0?"bg-blue-500":"bg-slate-200"}`}
            style={{width:`${payPct}%`}}/>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        <button onClick={()=>onView(b)}
          className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all
            flex items-center justify-center gap-1.5">
          <FiEye className="w-3.5 h-3.5"/> View
        </button>
        <button onClick={()=>onEdit?.(b)}
          className="flex-1 py-2.5 rounded-xl bg-green-50 hover:bg-green-100 text-green-700 border border-green-200
            text-xs font-bold transition-all flex items-center justify-center gap-1.5">
          <FiEdit2 className="w-3.5 h-3.5"/> Edit
        </button>
        {canCancel && (
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
        <td key={i} className="px-4 py-3.5">
          <div className="h-4 rounded-lg bg-slate-200 animate-pulse" style={{width:`${35+Math.random()*55}%`}}/>
        </td>
      ))}
    </tr>
  );
}

/* ─── SELECT WRAPPER ─────────────────────────────────────────── */
function Sel({ value, onChange, options, className="" }) {
  return (
    <div className={`relative ${className}`}>
      <select value={value} onChange={e=>onChange(e.target.value)}
        className="w-full pl-3.5 pr-9 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700
          font-medium focus:border-blue-400 focus:ring-2 focus:ring-blue-50 outline-none cursor-pointer
          appearance-none transition-all hover:border-slate-300">
        {options.map(o=><option key={o}>{o}</option>)}
      </select>
      <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"/>
    </div>
  );
}

/* ─── SORTABLE TH ────────────────────────────────────────────── */
function TH({ label, sKey, sortKey, sortDir, onSort, right }) {
  const active = sortKey===sKey;
  return (
    <th onClick={sKey ? ()=>onSort(sKey) : undefined}
      className={`px-4 py-3.5 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider
        whitespace-nowrap select-none transition-colors
        ${sKey?"cursor-pointer hover:text-blue-600":""}
        ${right?"text-right":"text-left"}`}>
      <span className={`inline-flex items-center gap-1 ${right?"justify-end w-full":""}`}>
        {label}
        {sKey && (
          <span className={`transition-colors ${active?"text-blue-500":"opacity-25"}`}>
            {active ? (sortDir==="asc"?"↑":"↓") : "↕"}
          </span>
        )}
      </span>
    </th>
  );
}

/* ═════════════════════════════════════════════════════════════
   MAIN PAGE
═════════════════════════════════════════════════════════════ */
export default function BookingsPage({
  bookings: propBookings = EMPTY_BOOKINGS_ARRAY,
  loading:  propLoading  = false,
  onCreateLead,
  onEdit,
  onRefresh,
}) {
  const [bookings,      setBookings]      = useState(propBookings);
  const [loading,       setLoading]       = useState(propLoading);
  const [search,        setSearch]        = useState("");
  const [filterStatus,  setFilterStatus]  = useState("All Status");
  const [filterPay,     setFilterPay]     = useState("All Payment Status");
  const [filterMonth,   setFilterMonth]   = useState("All Booking Months");
  const [filterTravel,  setFilterTravel]  = useState("All Travel Months");
  const [filtersOpen,   setFiltersOpen]   = useState(true);
  const [sortKey,       setSortKey]       = useState("id");
  const [sortDir,       setSortDir]       = useState("desc");
  const [page,          setPage]          = useState(1);
  const perPage = 10;
  const [selected,      setSelected]      = useState(new Set());
  const [modal,         setModal]         = useState(null);
  const [editBooking,   setEditBooking]   = useState(null);
  const [cancelBooking, setCancelBooking] = useState(null);
  const [toast,         setToast]         = useState(null);

  const showToast = useCallback((msg, type="success") => setToast({msg,type}), []);
  const selfManaged = propBookings.length===0;

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await bookingService.getAll(0, 500);
      const body = res.data;
      const raw  = Array.isArray(body?.data) ? body.data : Array.isArray(body) ? body : [];
      setBookings(raw.map(normalizeBooking));
    } catch {
      showToast("Failed to load bookings.", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    if (selfManaged) { fetchBookings(); return; }
    setBookings(propBookings);
    setLoading(propLoading);
  }, [propBookings, propLoading, selfManaged, fetchBookings]);

  /* stats */
  const stats = useMemo(() => ({
    total:     bookings.length,
    confirmed: bookings.filter(b=>b.status==="Confirmed").length,
    revenue:   bookings.reduce((s,b)=>s+(b.customerAmount||0), 0),
    net:       bookings.reduce((s,b)=>s+(b.paid||0),           0),
    refunds:   bookings.filter(b=>b.payStatus==="Refunded").reduce((s,b)=>s+(b.paid||0), 0),
    profit:    bookings.reduce((s,b)=>s+(b.netProfit||0),      0),
  }), [bookings]);

  /* filtered + sorted */
  const filtered = useMemo(() => {
    let out = [...bookings];
    const q = search.toLowerCase();
    if (q) out = out.filter(b =>
      (b.code||"").toLowerCase().includes(q) ||
      (b.customer||"").toLowerCase().includes(q) ||
      (b.destination||"").toLowerCase().includes(q)
    );
    if (filterStatus !== "All Status")         out = out.filter(b=>b.status===filterStatus);
    if (filterPay    !== "All Payment Status") out = out.filter(b=>b.payStatus===filterPay);
    if (filterMonth  !== "All Booking Months") {
      const mi = MONTHS.indexOf(filterMonth)+1;
      out = out.filter(b=>new Date(b.bookingDate).getMonth()+1===mi);
    }
    if (filterTravel !== "All Travel Months") {
      const mi = MONTHS.indexOf(filterTravel)+1;
      out = out.filter(b=>new Date(b.travelDate).getMonth()+1===mi);
    }
    out.sort((a,b) => {
      let av=a[sortKey], bv=b[sortKey];
      if (typeof av==="string") { av=av.toLowerCase(); bv=bv.toLowerCase(); }
      if (av<bv) return sortDir==="asc"?-1:1;
      if (av>bv) return sortDir==="asc"?1:-1;
      return 0;
    });
    return out;
  }, [bookings, search, filterStatus, filterPay, filterMonth, filterTravel, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length/perPage));
  const pageData   = filtered.slice((page-1)*perPage, page*perPage);

  const handleSort = key => {
    if (sortKey===key) setSortDir(d=>d==="asc"?"desc":"asc");
    else { setSortKey(key); setSortDir("asc"); }
  };
  const toggleSelect = id => setSelected(s=>{const n=new Set(s); n.has(id)?n.delete(id):n.add(id); return n;});
  const toggleAll    = () =>
    selected.size===pageData.length
      ? setSelected(new Set())
      : setSelected(new Set(pageData.map(b=>b.id)));

  const openEdit   = b => onEdit ? onEdit(b) : setEditBooking(b);
  const openCancel = b => setCancelBooking(b);
  const refreshList = onRefresh || fetchBookings;

  const handleDelete = useCallback(id => {
    setBookings(p=>p.filter(b=>b.id!==id));
    setSelected(s=>{const n=new Set(s); n.delete(id); return n;});
    showToast("Booking deleted successfully.");
  }, [showToast]);

  const handleBulkDelete = () => {
    setBookings(p=>p.filter(b=>!selected.has(b.id)));
    showToast(`${selected.size} booking(s) deleted.`);
    setSelected(new Set());
  };

  const resetFilters = () => {
    setSearch(""); setFilterStatus("All Status");
    setFilterPay("All Payment Status"); setFilterMonth("All Booking Months");
    setFilterTravel("All Travel Months"); setPage(1);
  };

  const anyFilter = search || filterStatus!=="All Status" || filterPay!=="All Payment Status"
    || filterMonth!=="All Booking Months" || filterTravel!=="All Travel Months";

  const activeFilterCount = [
    search, filterStatus!=="All Status", filterPay!=="All Payment Status",
    filterMonth!=="All Booking Months", filterTravel!=="All Travel Months",
  ].filter(Boolean).length;

  const thProps = { sortKey, sortDir, onSort: handleSort };

  /* page-level sums for tax strip */
  const pageSum = {
    totalPayable: pageData.reduce((s,b)=>s+(b.totalPayable||0),0),
    profit:       pageData.reduce((s,b)=>s+(b.netProfit||0),   0),
    gst:          pageData.reduce((s,b)=>s+(b.gst||0),         0),
    tcs:          pageData.reduce((s,b)=>s+(b.tcs||0),         0),
  };

  /* ─── RENDER ─────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100"
      style={{fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        @keyframes slideIn { from{transform:translateX(110%);opacity:0} to{transform:translateX(0);opacity:1} }
        @keyframes popIn   { from{transform:scale(.92);opacity:0}        to{transform:scale(1);opacity:1}    }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(12px)}  to{opacity:1;transform:translateY(0)} }
        .fade-up { animation:fadeUp .4s ease both; }
        select    { -webkit-appearance:none; appearance:none; }
        ::-webkit-scrollbar{width:5px;height:5px}
        ::-webkit-scrollbar-track{background:#f1f5f9;border-radius:99px}
        ::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:99px}
      `}</style>

      {/* ── MODALS & TOAST ── */}
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}
      {modal && <BookingModal booking={modal} onClose={()=>setModal(null)} onEdit={openEdit} onCancel={openCancel}/>}
      {editBooking && (
        <EditBookingModal booking={editBooking} onClose={()=>setEditBooking(null)}
          onSaved={refreshList} onToast={showToast}/>
      )}
      {cancelBooking && (
        <CancelBookingModal booking={cancelBooking} onClose={()=>setCancelBooking(null)}
          onCancelled={refreshList} onToast={showToast}/>
      )}

      {/* ── PAGE HEADER ── */}
      <div className="bg-white/70 backdrop-blur-md border-b border-slate-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            {/* Title */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600
                flex items-center justify-center text-white shadow-lg shadow-blue-200 flex-shrink-0">
                <FaPlane className="w-5 h-5"/>
              </div>
              <div>
                <h1 className="text-lg font-extrabold text-slate-800 tracking-tight">Bookings</h1>
                <p className="text-xs text-slate-400 hidden sm:block">
                  <span className="cursor-pointer hover:text-blue-600 transition-colors">Home</span>
                  <span className="mx-1 text-slate-300">/</span>
                  <span className="text-blue-600 font-bold">Bookings</span>
                </p>
              </div>
            </div>
            {/* CTA */}
            <button onClick={()=>window.location.href="/allleads"}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-500
                hover:from-blue-700 hover:to-indigo-600 text-white text-sm font-bold
                shadow-md shadow-blue-200 hover:shadow-lg transition-all self-start sm:self-auto">
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
            <FiTrendingUp className="w-3.5 h-3.5 text-blue-500"/>
            Tax &amp; Profit Summary — Current Page
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {icon:"💵",label:"Total Charges", value:pageSum.totalPayable, colorBg:"bg-blue-50",   colorBorder:"border-blue-100",   colorText:"text-blue-700"  },
              {icon:"📈",label:"Net Profit",    value:pageSum.profit,       colorBg:"bg-green-50",  colorBorder:"border-green-100",  colorText:"text-green-700" },
              {icon:"🧾",label:"GST Collected", value:pageSum.gst,          colorBg:"bg-amber-50",  colorBorder:"border-amber-100",  colorText:"text-amber-700" },
              {icon:"📋",label:"TCS Collected", value:pageSum.tcs,          colorBg:"bg-purple-50", colorBorder:"border-purple-100", colorText:"text-purple-700"},
            ].map(({icon,label,value,colorBg,colorBorder,colorText})=>(
              <div key={label} className={`${colorBg} border ${colorBorder} rounded-xl px-4 py-3`}>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wide mb-0.5">{icon} {label}</p>
                <p className={`text-base font-extrabold ${colorText}`}>{fmtINR(value)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── BOOKING LIST CARD ── */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden fade-up">

          {/* Card toolbar */}
          <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-base font-extrabold text-slate-700">Booking List</h2>
              <span className="text-xs bg-blue-100 text-blue-700 font-extrabold px-2.5 py-1 rounded-full border border-blue-200">
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
            <div className="flex items-center gap-2 flex-wrap">
              {/* Filters toggle */}
              <button onClick={()=>setFiltersOpen(v=>!v)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-bold transition-all
                  ${anyFilter
                    ?"bg-blue-50 border-blue-300 text-blue-700"
                    :"bg-white border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-600"}`}>
                <FiFilter className="w-3.5 h-3.5"/>
                Filters
                {activeFilterCount>0 && (
                  <span className="bg-blue-600 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>
              {/* Refresh */}
              <button onClick={refreshList}
                className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-600 bg-white
                  hover:bg-blue-50 border border-slate-200 hover:border-blue-300 font-bold px-3 py-2 rounded-xl transition-all">
                <FiRefreshCw className={`w-3.5 h-3.5 ${loading?"animate-spin":""}`}/> Refresh
              </button>
              {/* Clear filters */}
              {anyFilter && (
                <button onClick={resetFilters}
                  className="text-xs text-red-400 hover:text-red-600 font-bold flex items-center gap-1 transition-colors">
                  <FiX className="w-3.5 h-3.5"/> Clear
                </button>
              )}
            </div>
          </div>

          {/* Collapsible filter panel */}
          {filtersOpen && (
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/70"
              style={{animation:"fadeUp .25s ease both"}}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {/* Search */}
                <div className="lg:col-span-2 relative">
                  <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/>
                  <input type="text" value={search}
                    onChange={e=>{setSearch(e.target.value); setPage(1);}}
                    placeholder="Search code, customer, destination…"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm
                      text-slate-700 placeholder-slate-400 focus:border-blue-400 focus:ring-2
                      focus:ring-blue-50 outline-none transition-all hover:border-slate-300"/>
                </div>
                <Sel value={filterStatus}  onChange={v=>{setFilterStatus(v);  setPage(1);}} options={["All Status",         ...BOOKING_STATUSES]}/>
                <Sel value={filterPay}     onChange={v=>{setFilterPay(v);     setPage(1);}} options={["All Payment Status", ...PAY_STATUSES]}/>
                <Sel value={filterMonth}   onChange={v=>{setFilterMonth(v);   setPage(1);}} options={["All Booking Months", ...MONTHS]}/>
              </div>
              <div className="mt-3 max-w-[240px]">
                <Sel value={filterTravel}  onChange={v=>{setFilterTravel(v);  setPage(1);}} options={["All Travel Months",  ...MONTHS]}/>
              </div>
            </div>
          )}

          {/* ── DESKTOP TABLE ── */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              <thead className="bg-slate-50/80 border-b border-slate-100">
                <tr>
                  <th className="px-4 py-3.5 w-10">
                    <input type="checkbox"
                      checked={pageData.length>0 && selected.size===pageData.length}
                      onChange={toggleAll}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer"/>
                  </th>
                  <TH label="Booking Code" sKey="code"           {...thProps}/>
                  <TH label="Customer"     sKey="customer"       {...thProps}/>
                  <TH label="Destination"/>
                  <TH label="Travel Date"  sKey="travelDate"     {...thProps}/>
                  <TH label="Amount"       sKey="customerAmount" {...thProps} right/>
                  <TH label="GST"          right/>
                  <TH label="TCS"          right/>
                  <TH label="Total"        sKey="totalPayable"   {...thProps} right/>
                  <TH label="Payment"/>
                  <TH label="Net Profit"   sKey="netProfit"      {...thProps} right/>
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
                        <p className="text-slate-400 font-bold text-sm">No bookings found</p>
                        {anyFilter && (
                          <button onClick={resetFilters}
                            className="mt-3 text-sm text-blue-600 hover:underline font-bold">
                            Clear filters
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                  : pageData.map((b,idx)=>{
                    const payPct = b.totalPayable>0 ? Math.round(b.paid/b.totalPayable*100) : 0;
                    return (
                      <tr key={b.id}
                        className="group hover:bg-blue-50/30 hover:shadow-[inset_3px_0_0_#2563eb] transition-all duration-150"
                        style={{animation:"fadeUp .35s ease both",animationDelay:`${idx*18}ms`}}>
                        {/* Checkbox */}
                        <td className="px-4 py-3.5">
                          <input type="checkbox" checked={selected.has(b.id)} onChange={()=>toggleSelect(b.id)}
                            className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer"/>
                        </td>
                        {/* Code */}
                        <td className="px-4 py-3.5">
                          <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
                            {b.code}
                          </span>
                        </td>
                        {/* Customer */}
                        <td className="px-4 py-3.5">
                          <p className="text-sm font-bold text-slate-800">{b.customer}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">{b.createdBy}</p>
                        </td>
                        {/* Destination */}
                        <td className="px-4 py-3.5">
                          <p className="text-xs font-semibold text-slate-600 max-w-[120px] truncate">{b.destination}</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {b.services?.slice(0,2).map(s=>(
                              <span key={s} className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">{s}</span>
                            ))}
                            {b.services?.length>2 && (
                              <span className="text-[10px] text-slate-400">+{b.services.length-2}</span>
                            )}
                          </div>
                        </td>
                        {/* Travel date */}
                        <td className="px-4 py-3.5 text-sm font-semibold text-slate-600 whitespace-nowrap">
                          {fmtDate(b.travelDate)}
                        </td>
                        {/* Customer amount */}
                        <td className="px-4 py-3.5 text-sm font-bold text-slate-700 text-right whitespace-nowrap">
                          {fmtINR(b.customerAmount)}
                        </td>
                        {/* GST */}
                        <td className="px-4 py-3.5 text-xs text-slate-500 text-right whitespace-nowrap">
                          {fmtINR(b.gst)}
                        </td>
                        {/* TCS */}
                        <td className="px-4 py-3.5 text-xs text-slate-500 text-right whitespace-nowrap">
                          {fmtINR(b.tcs)}
                        </td>
                        {/* Total + payment mini bar */}
                        <td className="px-4 py-3.5 text-right">
                          <p className="text-sm font-extrabold text-slate-800 whitespace-nowrap">
                            {fmtINR(b.totalPayable)}
                          </p>
                          <div className="w-full h-1 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                            <div className={`h-full rounded-full transition-all
                              ${payPct===100?"bg-green-500":payPct>0?"bg-blue-400":"bg-slate-200"}`}
                              style={{width:`${payPct}%`}}/>
                          </div>
                        </td>
                        {/* Payment status */}
                        <td className="px-4 py-3.5">
                          <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border ${PAY_STYLE[b.payStatus]}`}>
                            {b.payStatus}
                          </span>
                        </td>
                        {/* Net profit */}
                        <td className="px-4 py-3.5 text-right whitespace-nowrap">
                          <span className={`text-sm font-extrabold ${b.netProfit>=0?"text-green-600":"text-red-500"}`}>
                            {fmtINR(b.netProfit)}
                          </span>
                        </td>
                        {/* Status */}
                        <td className="px-4 py-3.5">
                          <span className={`inline-flex items-center gap-1.5 text-[10px] font-extrabold px-2.5 py-1 rounded-full border ${STATUS_STYLE[b.status]}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[b.status]}`}/>
                            {b.status}
                          </span>
                        </td>
                        {/* Actions — appear on row hover */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity duration-150">
                            <button onClick={()=>setModal(b)} title="View"
                              className="w-8 h-8 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 flex items-center justify-center transition-all">
                              <FiEye className="w-3.5 h-3.5"/>
                            </button>
                            <button onClick={()=>openEdit(b)} title="Edit"
                              className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 flex items-center justify-center transition-all">
                              <FiEdit2 className="w-3.5 h-3.5"/>
                            </button>
                            {hasPermission(P.BOOKING_CANCEL) && b.status!=="Completed" && b.status!=="Cancelled" && (
                              <button onClick={()=>openCancel(b)} title="Cancel"
                                className="w-8 h-8 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-600 flex items-center justify-center transition-all">
                                <FiX className="w-3.5 h-3.5"/>
                              </button>
                            )}
                            <button onClick={()=>handleDelete(b.id)} title="Delete"
                              className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-600 flex items-center justify-center transition-all">
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
                  <div key={i} className="bg-white rounded-2xl border border-slate-100 p-4 space-y-2">
                    {[...Array(4)].map((_,j)=>(
                      <div key={j} className="h-4 rounded-lg bg-slate-200 animate-pulse"
                        style={{width:`${40+Math.random()*50}%`}}/>
                    ))}
                  </div>
                ))
              : pageData.length===0
              ? (
                <div className="text-center py-16">
                  <FaPlane className="text-5xl text-slate-200 mx-auto mb-3"/>
                  <p className="text-slate-400 font-bold">No bookings found</p>
                  {anyFilter && (
                    <button onClick={resetFilters}
                      className="mt-3 text-sm text-blue-600 hover:underline font-bold">
                      Clear filters
                    </button>
                  )}
                </div>
              )
              : pageData.map(b=>(
                  <MobileBookingCard key={b.id} b={b}
                    onView={setModal} onEdit={openEdit} onCancel={openCancel} onDelete={handleDelete}/>
                ))
            }
          </div>

          {/* ── PAGINATION ── */}
          {filtered.length>0 && (
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
                  .reduce((acc,p,i,arr)=>{
                    if (i>0&&p-arr[i-1]>1) acc.push("…");
                    acc.push(p);
                    return acc;
                  },[])
                  .map((p,i)=>
                    typeof p==="string"
                      ? <span key={`e${i}`} className="w-8 h-8 flex items-center justify-center text-xs text-slate-400">…</span>
                      : <button key={p} onClick={()=>setPage(p)}
                          className={`w-8 h-8 rounded-lg text-xs font-bold transition-all border
                            ${page===p
                              ?"bg-blue-600 border-blue-600 text-white shadow-sm"
                              :"bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600"}`}>
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