

// import React, { useState } from "react";
// import {
//   Plane, Hotel, Map, Anchor, Car, Package, List, BarChart2,
//   Home, ChevronRight, Save, Users, Calendar,
//   Phone, FileText, MapPin, User, TrendingUp, Sparkles,
//   Wallet, ShieldCheck, Download, Share2
// } from "lucide-react";

// import FlightTab               from "./FlightTab";
// import HotelTab                from "./HotelTab";
// import SightseeingTab          from "./SightseeingTab";
// import CruiseTab               from "./CruiseTab";
// import VehicleTab              from "./VehicleTab";
// import AddOnServicesTab        from "./AddOnServicesTab";
// import InclusionsExclusionsTab from "./InclusionsExclusionsTab";
// import SummaryPricingTab       from "./SummaryPricingTab";

// import { Input, Label } from "./Ui";

// /* ─── TAB CONFIG ─────────────────────────────────────── */
// const TABS = [
//   { id: "flight",      label: "Flight",                  icon: Plane,     color: "blue"    },
//   { id: "hotel",       label: "Hotel",                   icon: Hotel,     color: "violet"  },
//   { id: "sightseeing", label: "Sightseeing",             icon: Map,       color: "emerald" },
//   { id: "cruise",      label: "Cruise",                  icon: Anchor,    color: "cyan"    },
//   { id: "vehicle",     label: "Vehicle",                 icon: Car,       color: "orange"  },
//   { id: "addons",      label: "Add-on Services",         icon: Package,   color: "rose"    },
//   { id: "inclusions",  label: "Inclusions & Exclusions", icon: List,      color: "amber"   },
//   { id: "summary",     label: "Summary & Pricing",       icon: BarChart2, color: "indigo"  },
// ];

// const SUMMARY_INFO = [
//   { icon: User,     label: "Client Name",  value: "Pratik Sharma",               color: "blue"    },
//   { icon: Phone,    label: "Contact",      value: "+91 98765 43210",             color: "emerald" },
//   { icon: Users,    label: "Travelers",    value: "4 Adults, 0 Child",           color: "violet"  },
//   { icon: Calendar, label: "Travel Dates", value: "Jun 15 – Jun 22, 2026",      color: "amber"   },
//   { icon: MapPin,   label: "Destination",  value: "Nepal (Kathmandu, Pokhara)", color: "rose"    },
//   { icon: FileText, label: "Package",      value: "7N / 8D — Nepal Tour",       color: "cyan"    },
// ];

// const TAB_ACTIVE = {
//   blue:    "text-blue-600    border-blue-600    bg-blue-50",
//   violet:  "text-violet-600  border-violet-600  bg-violet-50",
//   emerald: "text-emerald-600 border-emerald-600 bg-emerald-50",
//   cyan:    "text-cyan-600    border-cyan-600    bg-cyan-50",
//   orange:  "text-orange-600  border-orange-600  bg-orange-50",
//   rose:    "text-rose-600    border-rose-600    bg-rose-50",
//   amber:   "text-amber-600   border-amber-600   bg-amber-50",
//   indigo:  "text-indigo-600  border-indigo-600  bg-indigo-50",
// };

// const ICON_BG = {
//   blue:    "bg-blue-100    text-blue-600",
//   violet:  "bg-violet-100  text-violet-600",
//   emerald: "bg-emerald-100 text-emerald-600",
//   cyan:    "bg-cyan-100    text-cyan-600",
//   orange:  "bg-orange-100  text-orange-600",
//   rose:    "bg-rose-100    text-rose-600",
//   amber:   "bg-amber-100   text-amber-600",
//   indigo:  "bg-indigo-100  text-indigo-600",
// };

// const CHIP_STYLE = {
//   blue:    { grad: "from-blue-500 to-blue-600",       ring: "hover:border-blue-300",    glow: "shadow-blue-100"    },
//   emerald: { grad: "from-emerald-500 to-emerald-600", ring: "hover:border-emerald-300", glow: "shadow-emerald-100" },
//   violet:  { grad: "from-violet-500 to-violet-600",   ring: "hover:border-violet-300",  glow: "shadow-violet-100"  },
//   amber:   { grad: "from-amber-400 to-amber-500",     ring: "hover:border-amber-300",   glow: "shadow-amber-100"   },
//   rose:    { grad: "from-rose-500 to-rose-600",       ring: "hover:border-rose-300",    glow: "shadow-rose-100"    },
//   cyan:    { grad: "from-cyan-500 to-cyan-600",       ring: "hover:border-cyan-300",    glow: "shadow-cyan-100"    },
// };

// export default function CreateQuotation() {
//   const [activeTab, setActiveTab] = useState("flight");
//   const [qtTitle,   setQtTitle]   = useState("");
//   const [version]               = useState("v1.0");
//   const [stage]                 = useState("New Lead");

//   const costs = { flight: 0, hotel: 0, sightseeing: 0, cruise: 0, vehicle: 0, addons: 0 };

//   const tabContent = {
//     flight:      <FlightTab />,
//     hotel:       <HotelTab />,
//     sightseeing: <SightseeingTab />,
//     cruise:      <CruiseTab />,
//     vehicle:     <VehicleTab />,
//     addons:      <AddOnServicesTab />,
//     inclusions:  <InclusionsExclusionsTab />,
//     summary:     <SummaryPricingTab costs={costs} />,
//   };

//   const activeIdx = TABS.findIndex(t => t.id === activeTab);

//   return (
//     <div
//       className="min-h-screen bg-slate-100 font-sans"
//       style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
//     >
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
//         .tab-scroll::-webkit-scrollbar { height: 0px; }
//         .qt-tab-btn { transition: color 0.18s, background 0.18s, border-color 0.18s; }
//         .lift-card  { transition: box-shadow 0.2s, transform 0.2s; }
//         .lift-card:hover {
//           box-shadow: 0 8px 32px 0 rgba(15,23,42,0.09);
//           transform: translateY(-1px);
//         }
//         @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
//         .fade-up { animation: fadeUp .4s ease both; }
//         .stat-card-hover { transition: transform 0.2s, box-shadow 0.2s; }
//         .stat-card-hover:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(0,0,0,0.15); }
//       `}</style>

//       <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-7 space-y-5">

//         {/* ── TOP BAR ── */}
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 fade-up">
//           <div>
//             <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-2">
//               <Home size={12} className="text-slate-400" />
//               <ChevronRight size={10} className="text-slate-300" />
//               <span className="hover:text-slate-600 cursor-pointer transition-colors">Leads</span>
//               <ChevronRight size={10} className="text-slate-300" />
//               <span className="text-blue-600 font-bold">Create Quotation</span>
//             </div>
//             <div className="flex items-center gap-3">
//               <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-200 flex-shrink-0">
//                 <FileText size={16} className="text-white" strokeWidth={2.5} />
//               </div>
//               <div>
//                 <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-tight">
//                   Create Quotation
//                 </h1>
//                 <p className="text-xs text-slate-400 font-medium mt-0.5">
//                   Pratik Sharma · Nepal Tour · 7N / 8D
//                 </p>
//               </div>
//             </div>
//           </div>

//           <div className="flex flex-wrap items-center gap-2">
//             <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 shadow-sm">
//               <Users size={12} className="text-blue-500" /> 4 Pax
//             </span>
//             <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 shadow-sm">
//               <Calendar size={12} className="text-violet-500" /> Jun 15 – 22, 2026
//             </span>
//             <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 shadow-sm">
//               <MapPin size={12} className="text-rose-500" /> Nepal
//             </span>
//             <span className="px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-xl text-xs font-bold text-amber-700">
//               New Lead · v1.0
//             </span>
//           </div>
//         </div>

//         {/* ── BASIC INFO CARD ── */}
//         <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden lift-card fade-up" style={{ animationDelay: "60ms" }}>
//           <div className="flex items-center gap-3 px-5 py-3.5 border-b border-slate-100 bg-slate-50/60">
//             <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
//               <FileText size={13} className="text-blue-600" />
//             </div>
//             <p className="text-[13px] font-bold text-slate-700">Quotation Details</p>
//             <div className="ml-auto flex items-center gap-2">
//               <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
//               <span className="text-[11px] font-semibold text-slate-400">Draft</span>
//             </div>
//           </div>

//           <div className="p-5">
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//               <div>
//                 <Label required>Quotation Title</Label>
//                 <Input
//                   value={qtTitle}
//                   onChange={e => setQtTitle(e.target.value)}
//                   placeholder="e.g. Nepal Adventure Premium"
//                 />
//               </div>
//               <div>
//                 <Label>Version</Label>
//                 <div className="relative">
//                   <Input value={version} disabled />
//                   <span className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 text-[10px] font-bold border border-blue-100">
//                     {version}
//                   </span>
//                 </div>
//               </div>
//               <div>
//                 <Label>Lead Stage</Label>
//                 <div className="relative">
//                   <Input value={stage} disabled className="pr-24" />
//                   <span className="absolute right-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-amber-100 text-amber-700 text-[10px] font-bold">
//                     {stage}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* ── TABS CARD ── */}
//         <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden fade-up" style={{ animationDelay: "120ms" }}>
//           <div className="tab-scroll overflow-x-auto border-b border-slate-100">
//             <div className="flex min-w-max">
//               {TABS.map((tab) => {
//                 const Icon   = tab.icon;
//                 const active = activeTab === tab.id;
//                 return (
//                   <button
//                     key={tab.id}
//                     onClick={() => setActiveTab(tab.id)}
//                     className={`qt-tab-btn relative flex items-center gap-2 px-5 py-4 text-[13px] font-bold
//                       whitespace-nowrap border-b-2 focus:outline-none group
//                       ${active
//                         ? TAB_ACTIVE[tab.color]
//                         : "text-slate-400 border-transparent hover:text-slate-600 hover:bg-slate-50"
//                       }`}
//                   >
//                     <span
//                       className={`flex items-center justify-center w-6 h-6 rounded-lg transition-all flex-shrink-0
//                         ${active ? ICON_BG[tab.color] : "bg-slate-100 group-hover:bg-slate-200"}`}
//                     >
//                       <Icon size={13} strokeWidth={active ? 2.5 : 2} />
//                     </span>
//                     {tab.label}
//                   </button>
//                 );
//               })}
//             </div>
//           </div>

//           <div className="p-5 sm:p-6 min-h-[260px]">
//             {tabContent[activeTab]}
//           </div>

//           <div className="flex items-center justify-between px-5 py-3 bg-slate-50/80 border-t border-slate-100">
//             <p className="text-[11px] text-slate-400 font-semibold">
//               Step{" "}
//               <span className="text-slate-700 font-extrabold">{activeIdx + 1}</span>
//               {" "}of {TABS.length}
//             </p>
//             <div className="flex items-center gap-1.5">
//               {TABS.map((t, i) => {
//                 const done    = i < activeIdx;
//                 const current = i === activeIdx;
//                 return (
//                   <button
//                     key={t.id}
//                     onClick={() => setActiveTab(t.id)}
//                     title={t.label}
//                     className={`rounded-full transition-all duration-200 focus:outline-none
//                       ${current
//                         ? "w-6 h-2 bg-blue-600"
//                         : done
//                           ? "w-2 h-2 bg-emerald-400 hover:bg-emerald-500"
//                           : "w-2 h-2 bg-slate-200 hover:bg-slate-300"
//                       }`}
//                   />
//                 );
//               })}
//             </div>
//             <div className="flex items-center gap-1">
//               <button
//                 disabled={activeIdx === 0}
//                 onClick={() => setActiveTab(TABS[activeIdx - 1].id)}
//                 className="flex items-center gap-1 px-3 py-1.5 text-[12px] font-bold text-slate-500
//                   hover:text-slate-800 hover:bg-slate-100 rounded-lg disabled:opacity-25 transition-all"
//               >
//                 <ChevronRight size={12} className="rotate-180" /> Prev
//               </button>
//               <button
//                 disabled={activeIdx === TABS.length - 1}
//                 onClick={() => setActiveTab(TABS[activeIdx + 1].id)}
//                 className="flex items-center gap-1 px-3 py-1.5 text-[12px] font-bold text-blue-600
//                   hover:text-blue-800 hover:bg-blue-50 rounded-lg disabled:opacity-25 transition-all"
//               >
//                 Next <ChevronRight size={12} />
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* ── QUOTATION SUMMARY CARD ── */}
//         <div className="relative rounded-3xl overflow-hidden shadow-xl shadow-slate-200/60 fade-up" style={{ animationDelay: "180ms" }}>

//           {/* Header strip */}
//           <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 px-5 sm:px-7 py-5">
//             <div className="absolute -top-10 -right-10 w-44 h-44 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
//             <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0">
//                   <ShieldCheck size={18} className="text-emerald-300" />
//                 </div>
//                 <div>
//                   <p className="text-white text-sm font-extrabold tracking-tight">Quotation Summary</p>
//                   <p className="text-slate-400 text-[11px] font-medium">Verified pricing · Auto-calculated in real time</p>
//                 </div>
//               </div>
//               <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/15 border border-emerald-400/30 rounded-full text-emerald-300 text-[11px] font-bold">
//                 <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live Pricing
//               </span>
//             </div>
//           </div>

//           {/* Body */}
//           <div className="bg-gradient-to-br from-slate-50 via-white to-slate-50 p-5 sm:p-7">
//             <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

//               {/* Left — Client info */}
//               <div className="lg:col-span-3">
//                 <div className="flex items-center gap-2 mb-4">
//                   <Sparkles size={13} className="text-blue-500" />
//                   <p className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">Client & Package Details</p>
//                 </div>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                   {SUMMARY_INFO.map(({ icon: Icon, label, value, color }) => {
//                     const style = CHIP_STYLE[color];
//                     return (
//                       <div
//                         key={label}
//                         className={`relative flex items-start gap-3 p-4 bg-white rounded-2xl border-2 border-slate-100
//                           ${style.ring} hover:shadow-lg ${style.glow} transition-all duration-200 cursor-default group overflow-hidden`}
//                       >
//                         <div className={`absolute inset-0 bg-gradient-to-br ${style.grad} opacity-0 group-hover:opacity-[0.06] transition-opacity`} />
//                         <div className={`relative z-10 w-10 h-10 rounded-xl bg-gradient-to-br ${style.grad} text-white flex items-center justify-center
//                           flex-shrink-0 shadow-md group-hover:scale-110 group-hover:rotate-3 transition-all duration-200`}>
//                           <Icon size={16} strokeWidth={2.3} />
//                         </div>
//                         <div className="relative z-10 min-w-0">
//                           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide leading-none">
//                             {label}
//                           </p>
//                           <p className="text-sm font-extrabold text-slate-800 truncate mt-1.5">{value}</p>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>

//                 <div className="flex items-center gap-2 mt-5 pt-5 border-t border-slate-200">
//                   <button className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-blue-50 border-2 border-blue-100 hover:border-blue-300 text-blue-600 text-xs font-bold rounded-xl transition-all shadow-sm">
//                     <Download size={13} /> Export PDF
//                   </button>
//                   <button className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-violet-50 border-2 border-violet-100 hover:border-violet-300 text-violet-600 text-xs font-bold rounded-xl transition-all shadow-sm">
//                     <Share2 size={13} /> Share with Client
//                   </button>
//                 </div>
//               </div>

//               {/* ── RIGHT — Pricing Overview (Vendor-style stat cards) ── */}
//               <div className="lg:col-span-2 flex flex-col gap-4">
//                 <div className="flex items-center gap-2 mb-1">
//                   <Wallet size={13} className="text-slate-400" />
//                   <p className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">Pricing Overview</p>
//                 </div>

//                 {/* Two stat cards side by side */}
//                 <div className="grid grid-cols-2 gap-4">

//                   {/* Final Total — Teal */}
//                   <div
//                     className="relative overflow-hidden rounded-[18px] p-5 flex flex-col justify-between min-h-[155px] stat-card-hover cursor-default"
//                     style={{ background: "linear-gradient(135deg, #00c6a7 0%, #00a389 40%, #007d6b 100%)" }}
//                   >
//                     {/* blobs */}
//                     <div className="absolute -top-9 -right-8 w-28 h-28 rounded-full pointer-events-none" style={{ background: "rgba(255,255,255,0.13)" }} />
//                     <div className="absolute bottom-[-18px] right-8 w-20 h-20 rounded-full pointer-events-none" style={{ background: "rgba(255,255,255,0.09)" }} />
//                     <div className="absolute top-4 right-[72px] w-11 h-11 rounded-full pointer-events-none" style={{ background: "rgba(255,255,255,0.07)" }} />

//                     {/* Icon */}
//                     <div className="w-11 h-11 rounded-xl flex items-center justify-center relative z-10 flex-shrink-0"
//                       style={{ background: "rgba(255,255,255,0.22)" }}>
//                       <TrendingUp size={22} className="text-white" />
//                     </div>

//                     {/* Amount + label */}
//                     <div className="relative z-10 mt-3">
//                       <p className="text-[34px] font-extrabold text-white leading-none tracking-tight">₹0</p>
//                       <p className="text-[10px] font-semibold uppercase tracking-[.13em] mt-2"
//                         style={{ color: "rgba(255,255,255,0.72)" }}>
//                         Final Quotation Total
//                       </p>
//                     </div>
//                   </div>

//                   {/* Add-on — Amber/Orange */}
//                   <div
//                     className="relative overflow-hidden rounded-[18px] p-5 flex flex-col justify-between min-h-[155px] stat-card-hover cursor-default"
//                     style={{ background: "linear-gradient(135deg, #f7971e 0%, #f4821a 40%, #e06c0f 100%)" }}
//                   >
//                     {/* blobs */}
//                     <div className="absolute -top-9 -right-8 w-28 h-28 rounded-full pointer-events-none" style={{ background: "rgba(255,255,255,0.13)" }} />
//                     <div className="absolute bottom-[-18px] right-8 w-20 h-20 rounded-full pointer-events-none" style={{ background: "rgba(255,255,255,0.09)" }} />
//                     <div className="absolute top-4 right-[72px] w-11 h-11 rounded-full pointer-events-none" style={{ background: "rgba(255,255,255,0.07)" }} />

//                     {/* Icon */}
//                     <div className="w-11 h-11 rounded-xl flex items-center justify-center relative z-10 flex-shrink-0"
//                       style={{ background: "rgba(255,255,255,0.22)" }}>
//                       <Package size={22} className="text-white" />
//                     </div>

//                     {/* Amount + label */}
//                     <div className="relative z-10 mt-3">
//                       <p className="text-[34px] font-extrabold text-white leading-none tracking-tight">₹0</p>
//                       <p className="text-[10px] font-semibold uppercase tracking-[.13em] mt-2"
//                         style={{ color: "rgba(255,255,255,0.72)" }}>
//                         Add-on Services
//                       </p>
//                     </div>
//                   </div>

//                 </div>

//                 {/* Trust badge */}
//                 <div className="flex items-center gap-2.5 p-3 bg-white border border-slate-200 rounded-xl">
//                   <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center flex-shrink-0">
//                     <ShieldCheck size={14} className="text-white" />
//                   </div>
//                   <p className="text-[11px] text-slate-500 font-semibold leading-snug">
//                     This quotation is auto-saved and securely stored for your client.
//                   </p>
//                 </div>

//               </div>
//             </div>
//           </div>
//         </div>

//         {/* ── FOOTER ACTIONS ── */}
//         <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pb-6 fade-up" style={{ animationDelay: "240ms" }}>
//           <p className="text-xs text-slate-400 font-medium">
//             All fields marked <span className="text-rose-400 font-bold">*</span> are required
//           </p>
//           <div className="flex items-center gap-3">
//             <button
//               type="button"
//               className="px-6 py-2.5 border-2 border-slate-200 hover:border-slate-300
//                 text-slate-600 font-bold text-sm rounded-xl transition-all bg-white
//                 hover:bg-slate-50 active:scale-95 shadow-sm"
//             >
//               Cancel
//             </button>
//             <button
//               type="button"
//               className="flex items-center gap-2 px-8 py-2.5 font-bold text-sm rounded-xl
//                 text-white shadow-md shadow-blue-200 transition-all active:scale-95
//                 hover:shadow-lg hover:shadow-blue-200
//                 bg-gradient-to-r from-blue-600 to-blue-700
//                 hover:from-blue-700 hover:to-blue-800"
//             >
//               <Save size={15} strokeWidth={2.5} />
//               Create Quotation
//             </button>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }



















// import React, { useState, useCallback, useEffect ,useMemo } from "react";
// import { useSearchParams, useNavigate } from "react-router-dom";
// import {
//   Plane, Hotel, Map, Anchor, Car, Package, List, BarChart2,
//   Home, ChevronRight, Save, Users, Calendar,
//   Phone, FileText, MapPin, User, TrendingUp, Sparkles,
//   Wallet, ShieldCheck, Download, Share2, CheckCircle, Loader2, AlertCircle
// } from "lucide-react";

// import FlightTab               from "./FlightTab";
// import HotelTab                from "./HotelTab";
// import SightseeingTab          from "./SightseeingTab";
// import CruiseTab               from "./CruiseTab";
// import VehicleTab              from "./VehicleTab";
// import AddOnServicesTab        from "./AddOnServicesTab";
// import InclusionsExclusionsTab from "./InclusionsExclusionsTab";
// import SummaryPricingTab       from "./SummaryPricingTab";

// import { Input, Label }        from "./Ui";
// import { quotationService }    from "../services/quotationService";
// import { leadService }         from "../services/leadService";

// /* ─── TAB CONFIG ─────────────────────────────────────── */
// const TABS = [
//   { id: "flight",      label: "Flight",                  icon: Plane,     color: "blue"    },
//   { id: "hotel",       label: "Hotel",                   icon: Hotel,     color: "violet"  },
//   { id: "sightseeing", label: "Sightseeing",             icon: Map,       color: "emerald" },
//   { id: "cruise",      label: "Cruise",                  icon: Anchor,    color: "cyan"    },
//   { id: "vehicle",     label: "Vehicle",                 icon: Car,       color: "orange"  },
//   { id: "addons",      label: "Add-on Services",         icon: Package,   color: "rose"    },
//   { id: "inclusions",  label: "Inclusions & Exclusions", icon: List,      color: "amber"   },
//   { id: "summary",     label: "Summary & Pricing",       icon: BarChart2, color: "indigo"  },
// ];

// const TAB_ACTIVE = {
//   blue:    "text-blue-600    border-blue-600    bg-blue-50",
//   violet:  "text-violet-600  border-violet-600  bg-violet-50",
//   emerald: "text-emerald-600 border-emerald-600 bg-emerald-50",
//   cyan:    "text-cyan-600    border-cyan-600    bg-cyan-50",
//   orange:  "text-orange-600  border-orange-600  bg-orange-50",
//   rose:    "text-rose-600    border-rose-600    bg-rose-50",
//   amber:   "text-amber-600   border-amber-600   bg-amber-50",
//   indigo:  "text-indigo-600  border-indigo-600  bg-indigo-50",
// };

// const ICON_BG = {
//   blue:    "bg-blue-100    text-blue-600",
//   violet:  "bg-violet-100  text-violet-600",
//   emerald: "bg-emerald-100 text-emerald-600",
//   cyan:    "bg-cyan-100    text-cyan-600",
//   orange:  "bg-orange-100  text-orange-600",
//   rose:    "bg-rose-100    text-rose-600",
//   amber:   "bg-amber-100   text-amber-600",
//   indigo:  "bg-indigo-100  text-indigo-600",
// };

// const CHIP_STYLE = {
//   blue:    { grad: "from-blue-500 to-blue-600",       ring: "hover:border-blue-300",    glow: "shadow-blue-100"    },
//   emerald: { grad: "from-emerald-500 to-emerald-600", ring: "hover:border-emerald-300", glow: "shadow-emerald-100" },
//   violet:  { grad: "from-violet-500 to-violet-600",   ring: "hover:border-violet-300",  glow: "shadow-violet-100"  },
//   amber:   { grad: "from-amber-400 to-amber-500",     ring: "hover:border-amber-300",   glow: "shadow-amber-100"   },
//   rose:    { grad: "from-rose-500 to-rose-600",       ring: "hover:border-rose-300",    glow: "shadow-rose-100"    },
//   cyan:    { grad: "from-cyan-500 to-cyan-600",       ring: "hover:border-cyan-300",    glow: "shadow-cyan-100"    },
// };

// /* ─── TOAST ──────────────────────────────────────────── */
// function Toast({ msg, type, onClose }) {
//   useEffect(() => {
//     const t = setTimeout(onClose, 3500);
//     return () => clearTimeout(t);
//   }, [onClose]);
//   return (
//     <div className={`fixed top-5 right-5 z-[999] flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl max-w-sm
//         ${type === "success" ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800"}`}
//       style={{ animation: "slideIn .3s ease both" }}>
//       {type === "success"
//         ? <CheckCircle size={18} className="text-green-600 flex-shrink-0" />
//         : <AlertCircle  size={18} className="text-red-500  flex-shrink-0" />}
//       <p className="text-sm font-semibold flex-1">{msg}</p>
//       <button onClick={onClose} className="opacity-50 hover:opacity-100 ml-1 text-lg leading-none">&times;</button>
//     </div>
//   );
// }

// /* ─── MAIN COMPONENT ─────────────────────────────────── */
// // ── Service tag colors ───────────────────────────────────────
// const SERVICE_COLORS = {
//   Hotel:       { bg: '#E6F1FB', text: '#042C53' },
//   Flight:      { bg: '#EEEDFE', text: '#26215C' },
//   Cruise:      { bg: '#E1F5EE', text: '#04342C' },
//   Vehicle:     { bg: '#FAECE7', text: '#4A1B0C' },
//   Visa:        { bg: '#FBEAF0', text: '#4B1528' },
//   Passport:    { bg: '#F1EFE8', text: '#2C2C2A' },
//   Sightseeing: { bg: '#FAEEDA', text: '#412402' },
// };
// const serviceColor = (svc) => SERVICE_COLORS[svc] || { bg: '#F1F5F9', text: '#334155' };

// export default function CreateQuotation() {
//   const [searchParams] = useSearchParams();
//   const navigate       = useNavigate();

//   // ── URL params ───────────────────────────────────────────
//   const leadId        = searchParams.get("leadId")        || null;
//   const editId        = searchParams.get("quotationId")   || null; // edit mode

//   // ── UI state ─────────────────────────────────────────────
//   const [activeTab,    setActiveTab]    = useState("flight");
//   const [qtTitle,      setQtTitle]      = useState("");
//   const [version]                       = useState("v1.0");
//   const [stage]                         = useState("New Lead");
//   const [quotationId,  setQuotationId]  = useState(editId || null);
//   const [saving,       setSaving]       = useState(false);
//   const [pdfLoading,   setPdfLoading]   = useState(false);
//   const [toast,        setToast]        = useState(null);

//   const showToast = (msg, type = "success") => setToast({ msg, type });

//   // ── Lead data (fetched from backend) ─────────────────────
//   const [leadData,     setLeadData]     = useState(null);
//   const [leadLoading,  setLeadLoading]  = useState(false);

//   // ── Tab validate functions (set by each tab via onValidate) ──
//   const validateFns = React.useRef({});
//   const registerValidate = (tabId) => (fn) => { validateFns.current[tabId] = fn; };

//   // ── Tab data state ────────────────────────────────────────
//   // Each tab calls onDataChange(data) → stored here
//   const [flightData,     setFlightData]     = useState({});
//   const [hotelData,      setHotelData]      = useState({});
//   const [sightseeingData,setSightseeingData]= useState({});
//   const [cruiseData,     setCruiseData]     = useState({});
//   const [vehicleData,    setVehicleData]    = useState({});
//   const [addonData,      setAddonData]      = useState({});
//   const [inclusionsData, setInclusionsData] = useState({});
//   const [summaryData,    setSummaryData]    = useState({});

//   // Cost values for summary card — useMemo so SummaryPricingTab gets live updates
//   const costs = useMemo(() => ({
//     flight:      Number(flightData.amount)      || 0,
//     hotel:       Number(hotelData.amount)       || 0,
//     sightseeing: Number(sightseeingData.amount) || 0,
//     cruise:      Number(cruiseData.amount)      || 0,
//     vehicle:     Number(vehicleData.amount)     || 0,
//     addons:      Number(addonData.amount)       || 0,
//   }), [flightData.amount, hotelData.amount, sightseeingData.amount,
//        cruiseData.amount, vehicleData.amount, addonData.amount]);

//   const grandTotal = Object.values(costs).reduce((a, b) => a + b, 0);

//   // ── Fetch Lead data by leadId ────────────────────────────
//   useEffect(() => {
//     if (!leadId) return;
//     (async () => {
//       try {
//         setLeadLoading(true);
//         const res  = await leadService.getLeadById(leadId);
//         const data = res.data?.data || res.data || {};
//         setLeadData(data);
//         // Auto-fill quotation title from lead
//         if (!qtTitle) {
//           const dest = data.itinerary?.[0]?.destination || "";
//           const nights = data.itinerary?.[0]?.nights || "";
//           const autoTitle = [data.customerName, dest, nights ? `${nights}N` : ""]
//             .filter(Boolean).join(" – ");
//           if (autoTitle) setQtTitle(autoTitle);
//         }
//       } catch (err) {
//         console.error("Failed to fetch lead:", err);
//         // Token "token" key use ho raha hai — leadService.js check karo
//         if (err.response?.status === 401) {
//           showToast("Session expired. Please login again.", "error");
//         } else if (err.response?.status === 404) {
//           showToast("Lead not found. Check leadId in URL.", "error");
//         } else {
//           showToast("Failed to load lead data.", "error");
//         }
//       } finally {
//         setLeadLoading(false);
//       }
//     })();
//   }, [leadId]);

//   // ── Load existing quotation (edit mode) ──────────────────
//   useEffect(() => {
//     if (!editId) return;
//     (async () => {
//       try {
//         const res  = await quotationService.getQuotationById(editId);
//         const data = res.data?.data || res.data || {};
//         setQtTitle(data.title || "");
//         // Pre-fill tab states from loaded data
//         if (data.flight)      setFlightData(data.flight);
//         if (data.hotel)       setHotelData(data.hotel);
//         if (data.sightseeing) setSightseeingData(data.sightseeing);
//         if (data.cruise)      setCruiseData(data.cruise);
//         if (data.vehicle)     setVehicleData(data.vehicle);
//         if (data.addons)      setAddonData(data.addons);
//         if (data.inclusions || data.exclusions) {
//           setInclusionsData({
//             inclusions:           data.inclusions           || [],
//             exclusions:           data.exclusions           || [],
//             paymentPolicies:      data.paymentPolicies      || [],
//             cancellationPolicies: data.cancellationPolicies || [],
//             bookingTerms:         data.bookingTerms         || [],
//           });
//         }
//         if (data.pricing) setSummaryData(data.pricing);
//       } catch (err) {
//         console.error("Failed to load quotation:", err);
//         showToast("Failed to load quotation data.", "error");
//       }
//     })();
//   }, [editId]);

//   // ── Collect all tab data ──────────────────────────────────
//   const collectAllData = useCallback(() => ({
//     leadId,
//     title   : qtTitle || "Quotation",
//     version,
//     stage,

//     // Flight
//     flightIncluded : flightData.included ?? true,
//     flightTitle    : flightData.title    || "Flight Details",
//     flightAmount   : flightData.amount   || 0,
//     journey        : flightData.journey  || "Round Trip",
//     segments       : flightData.segments || [],

//     // Hotel
//     hotelIncluded : hotelData.included ?? true,
//     hotelTitle    : hotelData.title    || "Hotel Details",
//     hotelAmount   : hotelData.amount   || 0,
//     hotelNotes    : hotelData.notes    || "",
//     hotels        : hotelData.hotels   || [],

//     // Sightseeing
//     sightseeingIncluded : sightseeingData.included ?? true,
//     sightseeingTitle    : sightseeingData.title    || "Sightseeing",
//     sightseeingAmount   : sightseeingData.amount   || 0,
//     sightseeingNotes    : sightseeingData.notes    || "",
//     days                : sightseeingData.days     || [],

//     // Cruise
//     cruiseIncluded : cruiseData.included ?? false,
//     cruiseTitle    : cruiseData.title    || "Cruise Details",
//     cruiseAmount   : cruiseData.amount   || 0,
//     cruises        : cruiseData.cruises  || [],

//     // Vehicle
//     vehicleIncluded : vehicleData.included ?? true,
//     vehicleTitle    : vehicleData.title    || "Vehicle Details",
//     vehicleAmount   : vehicleData.amount   || 0,
//     vehicles        : vehicleData.vehicles || [],

//     // Addons
//     addonIncluded : addonData.included ?? false,
//     addonTitle    : addonData.title    || "Add-on Services",
//     addonAmount   : Number(addonData.amount) || 0,
//     addons        : addonData.items    || [],

//     // Inclusions
//     inclusions           : inclusionsData.inclusions           || [],
//     exclusions           : inclusionsData.exclusions           || [],
//     paymentPolicies      : inclusionsData.paymentPolicies      || [],
//     cancellationPolicies : inclusionsData.cancellationPolicies || [],
//     bookingTerms         : inclusionsData.bookingTerms         || [],

//     // Pricing
//     discount : summaryData.discount || 0,
//     discType : summaryData.discType || "Fixed",
//     tax      : summaryData.tax      || 18,
//     markup   : summaryData.markup   || 0,
//   }), [
//     leadId, qtTitle, version, stage,
//     flightData, hotelData, sightseeingData, cruiseData,
//     vehicleData, addonData, inclusionsData, summaryData,
//   ]);

//   // ── Save handler ──────────────────────────────────────────
//   const handleSave = async () => {
//     if (!qtTitle.trim()) {
//       showToast("Please enter a quotation title.", "error");
//       return;
//     }
//     // Run all tab validators — collect any failures
//     const tabResults = await Promise.all(
//       Object.entries(validateFns.current).map(async ([tabId, fn]) => ({ tabId, valid: fn?.() ?? true }))
//     );
//     const failed = tabResults.filter(r => !r.valid);
//     if (failed.length > 0) {
//       const failedLabels = failed.map(r => r.tabId).join(", ");
//       showToast(`Please fix errors in: ${failedLabels}`, "error");
//       return;
//     }
//     try {
//       setSaving(true);
//       const allData = collectAllData();

//       if (quotationId) {
//         // Already created — update
//         await quotationService.updateQuotation(quotationId, allData);
//         showToast("Quotation updated successfully!");
//       } else {
//         // First save — create
//         const res   = await quotationService.createQuotation(allData);
//         const newId = res.data?.data?.id
//                    || res.data?.data?.publicId
//                    || res.data?.id
//                    || res.data?.publicId;
//         setQuotationId(newId);
//         showToast("Quotation created successfully!");
//       }
//     } catch (err) {
//       console.error("Save failed:", err);
//       showToast(
//         err.response?.data?.message || "Failed to save quotation. Please try again.",
//         "error"
//       );
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ── PDF Download ──────────────────────────────────────────
//   const handlePdf = async () => {
//     if (!quotationId) {
//       showToast("Please save the quotation first before downloading PDF.", "error");
//       return;
//     }
//     try {
//       setPdfLoading(true);
//       const res  = await quotationService.generatePdf(quotationId);
//       const url  = URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
//       const a    = document.createElement("a");
//       a.href     = url;
//       a.download = `quotation-${quotationId}.pdf`;
//       a.click();
//       URL.revokeObjectURL(url);
//       showToast("PDF downloaded successfully!");
//     } catch (err) {
//       console.error("PDF failed:", err);
//       showToast("Failed to generate PDF.", "error");
//     } finally {
//       setPdfLoading(false);
//     }
//   };

//   // ── Share Link ────────────────────────────────────────────
//   const handleShare = async () => {
//     if (!quotationId) {
//       showToast("Please save the quotation first.", "error");
//       return;
//     }
//     try {
//       const res  = await quotationService.getShareLink(quotationId);
//       const link = res.data?.data?.shareUrl || res.data?.shareUrl || "";
//       if (link) {
//         await navigator.clipboard.writeText(link);
//         showToast("Share link copied to clipboard!");
//       }
//     } catch (err) {
//       console.error("Share failed:", err);
//       showToast("Failed to generate share link.", "error");
//     }
//   };

//   // ── Tab navigation ────────────────────────────────────────
//   const activeIdx = TABS.findIndex(t => t.id === activeTab);


//   // ── Summary card info chips — from lead data ────────────
//   const travelers = leadData
//     ? [
//         leadData.adults   ? `${leadData.adults} Adults`   : "",
//         leadData.children ? `${leadData.children} Child`  : "",
//         leadData.infants  ? `${leadData.infants} Infant`  : "",
//       ].filter(Boolean).join(", ")
//     : "—";

//   const destination = leadData?.itinerary?.length
//     ? leadData.itinerary.map(i => `${i.destination}${i.nights ? ` (${i.nights}N)` : ""}`).join(", ")
//     : "—";

//   const assignedTo =
//     leadData?.assignedUser?.fullName ||
//     leadData?.assignedUser?.name     ||
//     leadData?.assignedUserName       ||
//     leadData?.assignTo               || "—";

//   const SUMMARY_INFO = [
//     { icon: User,     label: "Client Name",  value: leadData?.customerName || "—",   color: "blue"    },
//     { icon: Phone,    label: "Contact",      value: leadData?.phone        || "—",   color: "emerald" },
//     { icon: Users,    label: "Travelers",    value: travelers,                        color: "violet"  },
//     { icon: Calendar, label: "Assigned To",  value: assignedTo,                      color: "amber"   },
//     { icon: MapPin,   label: "Destination",  value: destination,                     color: "rose"    },
//     { icon: FileText, label: "Package",      value: qtTitle || "—",                  color: "cyan"    },
//   ];

//   const fmt = (n) => `₹${Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

//   return (
//     <div
//       className="min-h-screen bg-slate-100 font-sans"
//       style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
//     >
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
//         .tab-scroll::-webkit-scrollbar { height: 0px; }
//         .qt-tab-btn { transition: color 0.18s, background 0.18s, border-color 0.18s; }
//         .lift-card  { transition: box-shadow 0.2s, transform 0.2s; }
//         .lift-card:hover { box-shadow: 0 8px 32px 0 rgba(15,23,42,0.09); transform: translateY(-1px); }
//         @keyframes fadeUp  { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
//         @keyframes slideIn { from{transform:translateX(110%);opacity:0} to{transform:translateX(0);opacity:1} }
//         .fade-up { animation: fadeUp .4s ease both; }
//         .stat-card-hover { transition: transform 0.2s, box-shadow 0.2s; }
//         .stat-card-hover:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(0,0,0,0.15); }
//       `}</style>

//       {/* Toast */}
//       {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

//       <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-7 space-y-5">

//         {/* ── TOP BAR ── */}
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 fade-up">
//           <div>
//             <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-2">
//               <Home size={12} />
//               <ChevronRight size={10} className="text-slate-300" />
//               <span className="hover:text-slate-600 cursor-pointer transition-colors"
//                 onClick={() => navigate("/allleads")}>
//                 Leads
//               </span>
//               <ChevronRight size={10} className="text-slate-300" />
//               <span className="text-blue-600 font-bold">
//                 {quotationId ? "Edit Quotation" : "Create Quotation"}
//               </span>
//             </div>
//             <div className="flex items-center gap-3">
//               <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-200 flex-shrink-0">
//                 <FileText size={16} className="text-white" strokeWidth={2.5} />
//               </div>
//               <div>
//                 <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-tight">
//                   {quotationId ? "Edit Quotation" : "Create Quotation"}
//                 </h1>
//                 <p className="text-xs text-slate-400 font-medium mt-0.5">
//                   {leadId ? `Lead ID: ${String(leadId).slice(0, 8)}...` : "New Quotation"}
//                   {quotationId && <span className="ml-2 text-emerald-600 font-bold">· Saved</span>}
//                 </p>
//               </div>
//             </div>
//           </div>

//           <div className="flex flex-wrap items-center gap-2">
//             {leadLoading && (
//               <span className="text-xs text-slate-400 font-medium animate-pulse">Loading lead data...</span>
//             )}
//             {!leadLoading && leadData && (
//               <>
//                 <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-sm">
//                   <User size={12} className="text-blue-500" /> {leadData.customerName || "—"}
//                 </span>
//                 <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 shadow-sm">
//                   <Users size={12} className="text-violet-500" /> {travelers}
//                 </span>
//                 {leadData.itinerary?.[0]?.destination && (
//                   <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 shadow-sm">
//                     <MapPin size={12} className="text-rose-500" /> {leadData.itinerary[0].destination}
//                     {leadData.itinerary[0].nights && ` · ${leadData.itinerary[0].nights}N`}
//                   </span>
//                 )}
//                 <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 shadow-sm">
//                   <Phone size={12} className="text-emerald-500" /> {leadData.phone || "—"}
//                 </span>
//               </>
//             )}
//             <span className="px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-xl text-xs font-bold text-amber-700">
//               {stage} · {version}
//             </span>
//           </div>
//         </div>

//         {/* ── LEAD INFO + QUOTATION DETAILS CARD ── */}
//         <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden lift-card fade-up"
//           style={{ animationDelay: "60ms" }}>

//           {/* Card Header */}
//           <div className="flex items-center gap-3 px-5 py-3.5 border-b border-slate-100 bg-slate-50/60">
//             <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
//               <User size={13} className="text-blue-600" />
//             </div>
//             <p className="text-[13px] font-bold text-slate-700">Lead & Quotation Details</p>
//             <div className="ml-auto flex items-center gap-2">
//               {leadLoading && <span className="text-[11px] text-slate-400 animate-pulse">Fetching lead...</span>}
//               <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
//               <span className="text-[11px] font-semibold text-slate-400">Draft</span>
//               {quotationId && (
//                 <span className="text-[11px] font-semibold text-emerald-500 ml-2">
//                   · Saved #{String(quotationId).slice(0, 8)}
//                 </span>
//               )}
//             </div>
//           </div>

//           <div className="p-5 space-y-5">

//             {/* ── Lead Info Row ── */}
//             {leadData && (
//               <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">

//                 {/* Client Name */}
//                 <div className="col-span-2 sm:col-span-1 flex items-center gap-3 bg-blue-50 rounded-xl p-3 border border-blue-100">
//                   <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm font-extrabold flex-shrink-0 shadow-sm">
//                     {(leadData.customerName || "U").charAt(0).toUpperCase()}
//                   </div>
//                   <div className="min-w-0">
//                     <p className="text-[10px] text-blue-500 font-bold uppercase tracking-wide">Client</p>
//                     <p className="text-[13px] font-extrabold text-slate-800 truncate">{leadData.customerName || "—"}</p>
//                     <p className="text-[10px] text-slate-500 truncate">{leadData.email || ""}</p>
//                   </div>
//                 </div>

//                 {/* Phone */}
//                 <div className="flex items-center gap-3 bg-emerald-50 rounded-xl p-3 border border-emerald-100">
//                   <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
//                     <Phone size={14} className="text-emerald-600" />
//                   </div>
//                   <div className="min-w-0">
//                     <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wide">Phone</p>
//                     <p className="text-[13px] font-bold text-slate-800 truncate">{leadData.phone || "—"}</p>
//                   </div>
//                 </div>

//                 {/* Travelers */}
//                 <div className="flex items-center gap-3 bg-violet-50 rounded-xl p-3 border border-violet-100">
//                   <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0">
//                     <Users size={14} className="text-violet-600" />
//                   </div>
//                   <div className="min-w-0">
//                     <p className="text-[10px] text-violet-600 font-bold uppercase tracking-wide">Travelers</p>
//                     <p className="text-[13px] font-bold text-slate-800 truncate">{travelers}</p>
//                   </div>
//                 </div>

//                 {/* Destination */}
//                 <div className="flex items-center gap-3 bg-rose-50 rounded-xl p-3 border border-rose-100">
//                   <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center flex-shrink-0">
//                     <MapPin size={14} className="text-rose-600" />
//                   </div>
//                   <div className="min-w-0">
//                     <p className="text-[10px] text-rose-600 font-bold uppercase tracking-wide">Destination</p>
//                     <p className="text-[13px] font-bold text-slate-800 truncate">{destination}</p>
//                   </div>
//                 </div>

//                 {/* Lead Type */}
//                 <div className="flex items-center gap-3 bg-amber-50 rounded-xl p-3 border border-amber-100">
//                   <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
//                     <FileText size={14} className="text-amber-600" />
//                   </div>
//                   <div className="min-w-0">
//                     <p className="text-[10px] text-amber-600 font-bold uppercase tracking-wide">Lead Type</p>
//                     <p className="text-[13px] font-bold text-slate-800 truncate">{leadData.leadType || "—"}</p>
//                   </div>
//                 </div>

//                 {/* Assigned To */}
//                 <div className="flex items-center gap-3 bg-indigo-50 rounded-xl p-3 border border-indigo-100">
//                   <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
//                     <User size={14} className="text-indigo-600" />
//                   </div>
//                   <div className="min-w-0">
//                     <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-wide">Assigned To</p>
//                     <p className="text-[13px] font-bold text-slate-800 truncate">{assignedTo}</p>
//                   </div>
//                 </div>

//               </div>
//             )}

//             {/* Services tags if available */}
//             {leadData?.services?.length > 0 && (
//               <div className="flex items-center gap-2 flex-wrap">
//                 <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Services:</span>
//                 {leadData.services.map((s, i) => {
//                   const c = serviceColor(s);
//                   return (
//                     <span key={i} style={{ background: c.bg, color: c.text }}
//                       className="px-2.5 py-1 rounded-full text-[11px] font-semibold">{s}</span>
//                   );
//                 })}
//               </div>
//             )}

//             {/* Divider */}
//             {leadData && <div className="border-t border-slate-100" />}

//             {/* ── Quotation Title / Version / Stage ── */}
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//               <div>
//                 <Label required>Quotation Title</Label>
//                 <Input
//                   value={qtTitle}
//                   onChange={e => setQtTitle(e.target.value)}
//                   placeholder="e.g. Nepal Adventure Premium"
//                 />
//               </div>
//               <div>
//                 <Label>Version</Label>
//                 <div className="relative">
//                   <Input value={version} disabled />
//                   <span className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 text-[10px] font-bold border border-blue-100">
//                     {version}
//                   </span>
//                 </div>
//               </div>
//               <div>
//                 <Label>Lead Stage</Label>
//                 <div className="relative">
//                   <Input value={leadData?.leadStage || stage} disabled className="pr-24" />
//                   <span className="absolute right-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-amber-100 text-amber-700 text-[10px] font-bold">
//                     {leadData?.leadStage || stage}
//                   </span>
//                 </div>
//               </div>
//             </div>

//           </div>
//         </div>

//         {/* ── TABS CARD ── */}
//         <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden fade-up"
//           style={{ animationDelay: "120ms" }}>
//           <div className="tab-scroll overflow-x-auto border-b border-slate-100">
//             <div className="flex min-w-max">
//               {TABS.map((tab) => {
//                 const Icon   = tab.icon;
//                 const active = activeTab === tab.id;
//                 return (
//                   <button
//                     key={tab.id}
//                     onClick={() => setActiveTab(tab.id)}
//                     className={`qt-tab-btn relative flex items-center gap-2 px-5 py-4 text-[13px] font-bold
//                       whitespace-nowrap border-b-2 focus:outline-none group
//                       ${active
//                         ? TAB_ACTIVE[tab.color]
//                         : "text-slate-400 border-transparent hover:text-slate-600 hover:bg-slate-50"
//                       }`}
//                   >
//                     <span className={`flex items-center justify-center w-6 h-6 rounded-lg transition-all flex-shrink-0
//                         ${active ? ICON_BG[tab.color] : "bg-slate-100 group-hover:bg-slate-200"}`}>
//                       <Icon size={13} strokeWidth={active ? 2.5 : 2} />
//                     </span>
//                     {tab.label}
//                   </button>
//                 );
//               })}
//             </div>
//           </div>

//           <div className="p-5 sm:p-6 min-h-[260px]">
//             {/* All tabs always mounted — display:none hides inactive ones */}
//             {/* This prevents unmount/remount on tab switch, preserving state */}
//             <div style={{ display: activeTab === "flight"      ? "block" : "none" }}><FlightTab               onDataChange={setFlightData}      /></div>
//             <div style={{ display: activeTab === "hotel"       ? "block" : "none" }}><HotelTab                onDataChange={setHotelData}       /></div>
//             <div style={{ display: activeTab === "sightseeing" ? "block" : "none" }}><SightseeingTab          onDataChange={setSightseeingData} /></div>
//             <div style={{ display: activeTab === "cruise"      ? "block" : "none" }}><CruiseTab               onDataChange={setCruiseData}      /></div>
//             <div style={{ display: activeTab === "vehicle"     ? "block" : "none" }}><VehicleTab              onDataChange={setVehicleData}     /></div>
//             <div style={{ display: activeTab === "addons"      ? "block" : "none" }}><AddOnServicesTab        onDataChange={setAddonData}       /></div>
//             <div style={{ display: activeTab === "inclusions"  ? "block" : "none" }}><InclusionsExclusionsTab onDataChange={setInclusionsData}  /></div>
//             <div style={{ display: activeTab === "summary"     ? "block" : "none" }}><SummaryPricingTab       onDataChange={setSummaryData} costs={costs} /></div>
//           </div>

//           {/* Tab footer — prev/next + progress dots */}
//           <div className="flex items-center justify-between px-5 py-3 bg-slate-50/80 border-t border-slate-100">
//             <p className="text-[11px] text-slate-400 font-semibold">
//               Step{" "}
//               <span className="text-slate-700 font-extrabold">{activeIdx + 1}</span>
//               {" "}of {TABS.length}
//             </p>
//             <div className="flex items-center gap-1.5">
//               {TABS.map((t, i) => {
//                 const done    = i < activeIdx;
//                 const current = i === activeIdx;
//                 return (
//                   <button key={t.id} onClick={() => setActiveTab(t.id)} title={t.label}
//                     className={`rounded-full transition-all duration-200 focus:outline-none
//                       ${current ? "w-6 h-2 bg-blue-600" : done
//                         ? "w-2 h-2 bg-emerald-400 hover:bg-emerald-500"
//                         : "w-2 h-2 bg-slate-200 hover:bg-slate-300"}`} />
//                 );
//               })}
//             </div>
//             <div className="flex items-center gap-1">
//               <button
//                 disabled={activeIdx === 0}
//                 onClick={() => setActiveTab(TABS[activeIdx - 1].id)}
//                 className="flex items-center gap-1 px-3 py-1.5 text-[12px] font-bold text-slate-500
//                   hover:text-slate-800 hover:bg-slate-100 rounded-lg disabled:opacity-25 transition-all">
//                 <ChevronRight size={12} className="rotate-180" /> Prev
//               </button>
//               <button
//                 disabled={activeIdx === TABS.length - 1}
//                 onClick={() => setActiveTab(TABS[activeIdx + 1].id)}
//                 className="flex items-center gap-1 px-3 py-1.5 text-[12px] font-bold text-blue-600
//                   hover:text-blue-800 hover:bg-blue-50 rounded-lg disabled:opacity-25 transition-all">
//                 Next <ChevronRight size={12} />
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* ── QUOTATION SUMMARY CARD ── */}
//         <div className="relative rounded-3xl overflow-hidden shadow-xl shadow-slate-200/60 fade-up"
//           style={{ animationDelay: "180ms" }}>
//           {/* Header strip */}
//           <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 px-5 sm:px-7 py-5">
//             <div className="absolute -top-10 -right-10 w-44 h-44 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
//             <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0">
//                   <ShieldCheck size={18} className="text-emerald-300" />
//                 </div>
//                 <div>
//                   <p className="text-white text-sm font-extrabold tracking-tight">Quotation Summary</p>
//                   <p className="text-slate-400 text-[11px] font-medium">Verified pricing · Auto-calculated in real time</p>
//                 </div>
//               </div>
//               <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/15 border border-emerald-400/30 rounded-full text-emerald-300 text-[11px] font-bold">
//                 <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live Pricing
//               </span>
//             </div>
//           </div>

//           {/* Body */}
//           <div className="bg-gradient-to-br from-slate-50 via-white to-slate-50 p-5 sm:p-7">
//             <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

//               {/* Left — Client info chips */}
//               <div className="lg:col-span-3">
//                 <div className="flex items-center gap-2 mb-4">
//                   <Sparkles size={13} className="text-blue-500" />
//                   <p className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">Client & Package Details</p>
//                 </div>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                   {SUMMARY_INFO.map(({ icon: Icon, label, value, color }) => {
//                     const style = CHIP_STYLE[color];
//                     return (
//                       <div key={label}
//                         className={`relative flex items-start gap-3 p-4 bg-white rounded-2xl border-2 border-slate-100
//                           ${style.ring} hover:shadow-lg ${style.glow} transition-all duration-200 cursor-default group overflow-hidden`}>
//                         <div className={`absolute inset-0 bg-gradient-to-br ${style.grad} opacity-0 group-hover:opacity-[0.06] transition-opacity`} />
//                         <div className={`relative z-10 w-10 h-10 rounded-xl bg-gradient-to-br ${style.grad} text-white flex items-center justify-center
//                             flex-shrink-0 shadow-md group-hover:scale-110 group-hover:rotate-3 transition-all duration-200`}>
//                           <Icon size={16} strokeWidth={2.3} />
//                         </div>
//                         <div className="relative z-10 min-w-0">
//                           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide leading-none">{label}</p>
//                           <p className="text-sm font-extrabold text-slate-800 truncate mt-1.5">{value}</p>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>

//                 <div className="flex items-center gap-2 mt-5 pt-5 border-t border-slate-200">
//                   <button
//                     onClick={handlePdf}
//                     disabled={pdfLoading}
//                     className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-blue-50 border-2 border-blue-100 hover:border-blue-300 text-blue-600 text-xs font-bold rounded-xl transition-all shadow-sm disabled:opacity-60">
//                     {pdfLoading ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
//                     {pdfLoading ? "Generating..." : "Export PDF"}
//                   </button>
//                   <button
//                     onClick={handleShare}
//                     className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-violet-50 border-2 border-violet-100 hover:border-violet-300 text-violet-600 text-xs font-bold rounded-xl transition-all shadow-sm">
//                     <Share2 size={13} /> Share with Client
//                   </button>
//                 </div>
//               </div>

//               {/* Right — Pricing stat cards */}
//               <div className="lg:col-span-2 flex flex-col gap-4">
//                 <div className="flex items-center gap-2 mb-1">
//                   <Wallet size={13} className="text-slate-400" />
//                   <p className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">Pricing Overview</p>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   {/* Grand Total */}
//                   <div className="relative overflow-hidden rounded-[18px] p-5 flex flex-col justify-between min-h-[155px] stat-card-hover cursor-default"
//                     style={{ background: "linear-gradient(135deg,#00c6a7 0%,#00a389 40%,#007d6b 100%)" }}>
//                     <div className="absolute -top-9 -right-8 w-28 h-28 rounded-full pointer-events-none" style={{ background: "rgba(255,255,255,0.13)" }} />
//                     <div className="absolute bottom-[-18px] right-8 w-20 h-20 rounded-full pointer-events-none" style={{ background: "rgba(255,255,255,0.09)" }} />
//                     <div className="w-11 h-11 rounded-xl flex items-center justify-center relative z-10" style={{ background: "rgba(255,255,255,0.22)" }}>
//                       <TrendingUp size={22} className="text-white" />
//                     </div>
//                     <div className="relative z-10 mt-3">
//                       <p className="text-[34px] font-extrabold text-white leading-none tracking-tight">{fmt(grandTotal)}</p>
//                       <p className="text-[10px] font-semibold uppercase tracking-[.13em] mt-2" style={{ color: "rgba(255,255,255,0.72)" }}>
//                         Final Quotation Total
//                       </p>
//                     </div>
//                   </div>

//                   {/* Add-on total */}
//                   <div className="relative overflow-hidden rounded-[18px] p-5 flex flex-col justify-between min-h-[155px] stat-card-hover cursor-default"
//                     style={{ background: "linear-gradient(135deg,#f7971e 0%,#f4821a 40%,#e06c0f 100%)" }}>
//                     <div className="absolute -top-9 -right-8 w-28 h-28 rounded-full pointer-events-none" style={{ background: "rgba(255,255,255,0.13)" }} />
//                     <div className="absolute bottom-[-18px] right-8 w-20 h-20 rounded-full pointer-events-none" style={{ background: "rgba(255,255,255,0.09)" }} />
//                     <div className="w-11 h-11 rounded-xl flex items-center justify-center relative z-10" style={{ background: "rgba(255,255,255,0.22)" }}>
//                       <Package size={22} className="text-white" />
//                     </div>
//                     <div className="relative z-10 mt-3">
//                       <p className="text-[34px] font-extrabold text-white leading-none tracking-tight">{fmt(costs.addons)}</p>
//                       <p className="text-[10px] font-semibold uppercase tracking-[.13em] mt-2" style={{ color: "rgba(255,255,255,0.72)" }}>
//                         Add-on Services
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Trust badge */}
//                 <div className="flex items-center gap-2.5 p-3 bg-white border border-slate-200 rounded-xl">
//                   <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center flex-shrink-0">
//                     <ShieldCheck size={14} className="text-white" />
//                   </div>
//                   <p className="text-[11px] text-slate-500 font-semibold leading-snug">
//                     This quotation is auto-saved and securely stored for your client.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* ── FOOTER ACTIONS ── */}
//         <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pb-6 fade-up"
//           style={{ animationDelay: "240ms" }}>
//           <p className="text-xs text-slate-400 font-medium">
//             All fields marked <span className="text-rose-400 font-bold">*</span> are required
//           </p>
//           <div className="flex items-center gap-3">
//             <button
//               type="button"
//               onClick={() => navigate(-1)}
//               className="px-6 py-2.5 border-2 border-slate-200 hover:border-slate-300
//                 text-slate-600 font-bold text-sm rounded-xl transition-all bg-white hover:bg-slate-50 active:scale-95 shadow-sm">
//               Cancel
//             </button>
//             <button
//               type="button"
//               onClick={handleSave}
//               disabled={saving}
//               className="flex items-center gap-2 px-8 py-2.5 font-bold text-sm rounded-xl
//                 text-white shadow-md shadow-blue-200 transition-all active:scale-95
//                 hover:shadow-lg hover:shadow-blue-200 disabled:opacity-60 disabled:cursor-not-allowed
//                 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
//               {saving
//                 ? <><Loader2 size={15} className="animate-spin" /> Saving...</>
//                 : <><Save size={15} strokeWidth={2.5} />{quotationId ? "Update Quotation" : "Create Quotation"}</>
//               }
//             </button>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }




// calculate price ========================================================================
import React, { useState, useCallback, useEffect,useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Plane, Hotel, Map, Anchor, Car, Package, List, BarChart2,
  Home, ChevronRight, Save, Users, Calendar,
  Phone, FileText, MapPin, User, TrendingUp, Sparkles,
  Wallet, ShieldCheck, Download, Share2, CheckCircle, Loader2, AlertCircle
} from "lucide-react";

import FlightTab               from "./FlightTab";
import HotelTab                from "./HotelTab";
import SightseeingTab          from "./SightseeingTab";
import CruiseTab               from "./CruiseTab";
import VehicleTab              from "./VehicleTab";
import AddOnServicesTab        from "./AddOnServicesTab";
import InclusionsExclusionsTab from "./InclusionsExclusionsTab";
import SummaryPricingTab       from "./SummaryPricingTab";

import { Input, Label }        from "./Ui";
import { quotationService }    from "../services/quotationService";
import { leadService }         from "../services/leadService";

/* ─── TAB CONFIG ─────────────────────────────────────── */
const TABS = [
  { id: "flight",      label: "Flight",                  icon: Plane,     color: "blue"    },
  { id: "hotel",       label: "Hotel",                   icon: Hotel,     color: "violet"  },
  { id: "sightseeing", label: "Sightseeing",             icon: Map,       color: "emerald" },
  { id: "cruise",      label: "Cruise",                  icon: Anchor,    color: "cyan"    },
  { id: "vehicle",     label: "Vehicle",                 icon: Car,       color: "orange"  },
  { id: "addons",      label: "Add-on Services",         icon: Package,   color: "rose"    },
  { id: "inclusions",  label: "Inclusions & Exclusions", icon: List,      color: "amber"   },
  { id: "summary",     label: "Summary & Pricing",       icon: BarChart2, color: "indigo"  },
];

const TAB_ACTIVE = {
  blue:    "text-blue-600    border-blue-600    bg-blue-50",
  violet:  "text-violet-600  border-violet-600  bg-violet-50",
  emerald: "text-emerald-600 border-emerald-600 bg-emerald-50",
  cyan:    "text-cyan-600    border-cyan-600    bg-cyan-50",
  orange:  "text-orange-600  border-orange-600  bg-orange-50",
  rose:    "text-rose-600    border-rose-600    bg-rose-50",
  amber:   "text-amber-600   border-amber-600   bg-amber-50",
  indigo:  "text-indigo-600  border-indigo-600  bg-indigo-50",
};

const ICON_BG = {
  blue:    "bg-blue-100    text-blue-600",
  violet:  "bg-violet-100  text-violet-600",
  emerald: "bg-emerald-100 text-emerald-600",
  cyan:    "bg-cyan-100    text-cyan-600",
  orange:  "bg-orange-100  text-orange-600",
  rose:    "bg-rose-100    text-rose-600",
  amber:   "bg-amber-100   text-amber-600",
  indigo:  "bg-indigo-100  text-indigo-600",
};

const CHIP_STYLE = {
  blue:    { grad: "from-blue-500 to-blue-600",       ring: "hover:border-blue-300",    glow: "shadow-blue-100"    },
  emerald: { grad: "from-emerald-500 to-emerald-600", ring: "hover:border-emerald-300", glow: "shadow-emerald-100" },
  violet:  { grad: "from-violet-500 to-violet-600",   ring: "hover:border-violet-300",  glow: "shadow-violet-100"  },
  amber:   { grad: "from-amber-400 to-amber-500",     ring: "hover:border-amber-300",   glow: "shadow-amber-100"   },
  rose:    { grad: "from-rose-500 to-rose-600",       ring: "hover:border-rose-300",    glow: "shadow-rose-100"    },
  cyan:    { grad: "from-cyan-500 to-cyan-600",       ring: "hover:border-cyan-300",    glow: "shadow-cyan-100"    },
};

/* ─── TOAST ──────────────────────────────────────────── */
function Toast({ msg, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div className={`fixed top-5 right-5 z-[999] flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl max-w-sm
        ${type === "success" ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800"}`}
      style={{ animation: "slideIn .3s ease both" }}>
      {type === "success"
        ? <CheckCircle size={18} className="text-green-600 flex-shrink-0" />
        : <AlertCircle  size={18} className="text-red-500  flex-shrink-0" />}
      <p className="text-sm font-semibold flex-1">{msg}</p>
      <button onClick={onClose} className="opacity-50 hover:opacity-100 ml-1 text-lg leading-none">&times;</button>
    </div>
  );
}

/* ─── MAIN COMPONENT ─────────────────────────────────── */
// ── Service tag colors ───────────────────────────────────────
const SERVICE_COLORS = {
  Hotel:       { bg: '#E6F1FB', text: '#042C53' },
  Flight:      { bg: '#EEEDFE', text: '#26215C' },
  Cruise:      { bg: '#E1F5EE', text: '#04342C' },
  Vehicle:     { bg: '#FAECE7', text: '#4A1B0C' },
  Visa:        { bg: '#FBEAF0', text: '#4B1528' },
  Passport:    { bg: '#F1EFE8', text: '#2C2C2A' },
  Sightseeing: { bg: '#FAEEDA', text: '#412402' },
};
const serviceColor = (svc) => SERVICE_COLORS[svc] || { bg: '#F1F5F9', text: '#334155' };

export default function CreateQuotation() {
  const [searchParams] = useSearchParams();
  const navigate       = useNavigate();

  // ── URL params ───────────────────────────────────────────
  const leadId        = searchParams.get("leadId")        || null;
  const editId        = searchParams.get("quotationId")   || null; // edit mode

  // ── UI state ─────────────────────────────────────────────
  const [activeTab,    setActiveTab]    = useState("flight");
  const [qtTitle,      setQtTitle]      = useState("");
  const [version]                       = useState("v1.0");
  const [stage]                         = useState("New Lead");
  const [quotationId,  setQuotationId]  = useState(editId || null);
  const [saving,       setSaving]       = useState(false);
  const [pdfLoading,   setPdfLoading]   = useState(false);
  const [toast,        setToast]        = useState(null);

  const showToast = (msg, type = "success") => setToast({ msg, type });

  // ── Lead data (fetched from backend) ─────────────────────
  const [leadData,     setLeadData]     = useState(null);
  const [leadLoading,  setLeadLoading]  = useState(false);

  // ── Tab validate functions (set by each tab via onValidate) ──
  const validateFns = React.useRef({});
  const registerValidate = (tabId) => (fn) => { validateFns.current[tabId] = fn; };

  // ── Tab data state ────────────────────────────────────────
  // Each tab calls onDataChange(data) → stored here
  const [flightData,     setFlightData]     = useState({});
  const [hotelData,      setHotelData]      = useState({});
  const [sightseeingData,setSightseeingData]= useState({});
  const [cruiseData,     setCruiseData]     = useState({});
  const [vehicleData,    setVehicleData]    = useState({});
  const [addonData,      setAddonData]      = useState({});
  const [inclusionsData, setInclusionsData] = useState({});
  const [summaryData,    setSummaryData]    = useState({});

  // Cost values for summary card — useMemo so SummaryPricingTab gets live updates
  const costs = useMemo(() => ({
    flight:      Number(flightData.amount)      || 0,
    hotel:       Number(hotelData.amount)       || 0,
    sightseeing: Number(sightseeingData.amount) || 0,
    cruise:      Number(cruiseData.amount)      || 0,
    vehicle:     Number(vehicleData.amount)     || 0,
    addons:      Number(addonData.amount)       || 0,
  }), [flightData.amount, hotelData.amount, sightseeingData.amount,
       cruiseData.amount, vehicleData.amount, addonData.amount]);

  // Live grand total — includes markup, discount, tax from SummaryPricingTab
  const grandTotal = (() => {
    const subtotal  = Object.values(costs).reduce((a, b) => a + b, 0);
    const disc      = summaryData.discType === "%"
      ? (subtotal * Number(summaryData.discount || 0)) / 100
      : Number(summaryData.discount || 0);
    const afterDisc = subtotal - disc + Number(summaryData.markup || 0);
    const taxAmt    = (afterDisc * Number(summaryData.tax ?? 18)) / 100;
    return afterDisc + taxAmt;
  })();

  // ── Fetch Lead data by leadId ────────────────────────────
  useEffect(() => {
    if (!leadId) return;
    (async () => {
      try {
        setLeadLoading(true);
        const res  = await leadService.getLeadById(leadId);
        const data = res.data?.data || res.data || {};
        setLeadData(data);
        // Auto-fill quotation title from lead
        if (!qtTitle) {
          const dest = data.itinerary?.[0]?.destination || "";
          const nights = data.itinerary?.[0]?.nights || "";
          const autoTitle = [data.customerName, dest, nights ? `${nights}N` : ""]
            .filter(Boolean).join(" – ");
          if (autoTitle) setQtTitle(autoTitle);
        }
      } catch (err) {
        console.error("Failed to fetch lead:", err);
        // Token "token" key use ho raha hai — leadService.js check karo
        if (err.response?.status === 401) {
          showToast("Session expired. Please login again.", "error");
        } else if (err.response?.status === 404) {
          showToast("Lead not found. Check leadId in URL.", "error");
        } else {
          showToast("Failed to load lead data.", "error");
        }
      } finally {
        setLeadLoading(false);
      }
    })();
  }, [leadId]);

  // ── Load existing quotation (edit mode) ──────────────────
  useEffect(() => {
    if (!editId) return;
    (async () => {
      try {
        const res  = await quotationService.getQuotationById(editId);
        const data = res.data?.data || res.data || {};
        setQtTitle(data.title || "");
        // Pre-fill tab states from loaded data
        if (data.flight)      setFlightData(data.flight);
        if (data.hotel)       setHotelData(data.hotel);
        if (data.sightseeing) setSightseeingData(data.sightseeing);
        if (data.cruise)      setCruiseData(data.cruise);
        if (data.vehicle)     setVehicleData(data.vehicle);
        if (data.addons)      setAddonData(data.addons);
        if (data.inclusions || data.exclusions) {
          setInclusionsData({
            inclusions:           data.inclusions           || [],
            exclusions:           data.exclusions           || [],
            paymentPolicies:      data.paymentPolicies      || [],
            cancellationPolicies: data.cancellationPolicies || [],
            bookingTerms:         data.bookingTerms         || [],
          });
        }
        if (data.pricing) setSummaryData(data.pricing);
      } catch (err) {
        console.error("Failed to load quotation:", err);
        showToast("Failed to load quotation data.", "error");
      }
    })();
  }, [editId]);

  // ── Collect all tab data ──────────────────────────────────
  const collectAllData = useCallback(() => ({
    leadId,
    title   : qtTitle || "Quotation",
    version,
    stage,

    // Flight
    flightIncluded : flightData.included ?? true,
    flightTitle    : flightData.title    || "Flight Details",
    flightAmount   : flightData.amount   || 0,
    journey        : flightData.journey  || "Round Trip",
    segments       : flightData.segments || [],

    // Hotel
    hotelIncluded : hotelData.included ?? true,
    hotelTitle    : hotelData.title    || "Hotel Details",
    hotelAmount   : hotelData.amount   || 0,
    hotelNotes    : hotelData.notes    || "",
    hotels        : hotelData.hotels   || [],

    // Sightseeing
    sightseeingIncluded : sightseeingData.included ?? true,
    sightseeingTitle    : sightseeingData.title    || "Sightseeing",
    sightseeingAmount   : sightseeingData.amount   || 0,
    sightseeingNotes    : sightseeingData.notes    || "",
    days                : sightseeingData.days     || [],

    // Cruise
    cruiseIncluded : cruiseData.included ?? false,
    cruiseTitle    : cruiseData.title    || "Cruise Details",
    cruiseAmount   : cruiseData.amount   || 0,
    cruises        : cruiseData.cruises  || [],

    // Vehicle
    vehicleIncluded : vehicleData.included ?? true,
    vehicleTitle    : vehicleData.title    || "Vehicle Details",
    vehicleAmount   : vehicleData.amount   || 0,
    vehicles        : vehicleData.vehicles || [],

    // Addons
    addonIncluded : addonData.included ?? false,
    addonTitle    : addonData.title    || "Add-on Services",
    addonAmount   : Number(addonData.amount) || 0,
    addons        : addonData.items    || [],

    // Inclusions
    inclusions           : inclusionsData.inclusions           || [],
    exclusions           : inclusionsData.exclusions           || [],
    paymentPolicies      : inclusionsData.paymentPolicies      || [],
    cancellationPolicies : inclusionsData.cancellationPolicies || [],
    bookingTerms         : inclusionsData.bookingTerms         || [],

    // Pricing
    discount : summaryData.discount || 0,
    discType : summaryData.discType || "Fixed",
    tax      : summaryData.tax      || 18,
    markup   : summaryData.markup   || 0,
  }), [
    leadId, qtTitle, version, stage,
    flightData, hotelData, sightseeingData, cruiseData,
    vehicleData, addonData, inclusionsData, summaryData,
  ]);

  // ── Save handler ──────────────────────────────────────────
  const handleSave = async () => {
    if (!qtTitle.trim()) {
      showToast("Please enter a quotation title.", "error");
      return;
    }
    // Run all tab validators — collect any failures
    const tabResults = await Promise.all(
      Object.entries(validateFns.current).map(async ([tabId, fn]) => ({ tabId, valid: fn?.() ?? true }))
    );
    const failed = tabResults.filter(r => !r.valid);
    if (failed.length > 0) {
      const failedLabels = failed.map(r => r.tabId).join(", ");
      showToast(`Please fix errors in: ${failedLabels}`, "error");
      return;
    }
    try {
      setSaving(true);
      const allData = collectAllData();

      if (quotationId) {
        // Already created — update
        await quotationService.updateQuotation(quotationId, allData);
        showToast("Quotation updated successfully!");
      } else {
        // First save — create
        const res   = await quotationService.createQuotation(allData);
        const newId = res.data?.data?.id
                   || res.data?.data?.publicId
                   || res.data?.id
                   || res.data?.publicId;
        setQuotationId(newId);
        showToast("Quotation created successfully!");
      }
    } catch (err) {
      console.error("Save failed:", err);
      showToast(
        err.response?.data?.message || "Failed to save quotation. Please try again.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  // ── PDF Download ──────────────────────────────────────────
  const handlePdf = async () => {
    if (!quotationId) {
      showToast("Please save the quotation first before downloading PDF.", "error");
      return;
    }
    try {
      setPdfLoading(true);
      const res  = await quotationService.generatePdf(quotationId);
      const url  = URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
      const a    = document.createElement("a");
      a.href     = url;
      a.download = `quotation-${quotationId}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      showToast("PDF downloaded successfully!");
    } catch (err) {
      console.error("PDF failed:", err);
      showToast("Failed to generate PDF.", "error");
    } finally {
      setPdfLoading(false);
    }
  };

  // ── Share Link ────────────────────────────────────────────
  const handleShare = async () => {
    if (!quotationId) {
      showToast("Please save the quotation first.", "error");
      return;
    }
    try {
      const res  = await quotationService.getShareLink(quotationId);
      const link = res.data?.data?.shareUrl || res.data?.shareUrl || "";
      if (link) {
        await navigator.clipboard.writeText(link);
        showToast("Share link copied to clipboard!");
      }
    } catch (err) {
      console.error("Share failed:", err);
      showToast("Failed to generate share link.", "error");
    }
  };

  // ── Tab navigation ────────────────────────────────────────
  const activeIdx = TABS.findIndex(t => t.id === activeTab);


  // ── Summary card info chips — from lead data ────────────
  const travelers = leadData
    ? [
        leadData.adults   ? `${leadData.adults} Adults`   : "",
        leadData.children ? `${leadData.children} Child`  : "",
        leadData.infants  ? `${leadData.infants} Infant`  : "",
      ].filter(Boolean).join(", ")
    : "—";

  const destination = leadData?.itinerary?.length
    ? leadData.itinerary.map(i => `${i.destination}${i.nights ? ` (${i.nights}N)` : ""}`).join(", ")
    : "—";

  const assignedTo =
    leadData?.assignedUser?.fullName ||
    leadData?.assignedUser?.name     ||
    leadData?.assignedUserName       ||
    leadData?.assignTo               || "—";

  const SUMMARY_INFO = [
    { icon: User,     label: "Client Name",  value: leadData?.customerName || "—",   color: "blue"    },
    { icon: Phone,    label: "Contact",      value: leadData?.phone        || "—",   color: "emerald" },
    { icon: Users,    label: "Travelers",    value: travelers,                        color: "violet"  },
    { icon: Calendar, label: "Assigned To",  value: assignedTo,                      color: "amber"   },
    { icon: MapPin,   label: "Destination",  value: destination,                     color: "rose"    },
    { icon: FileText, label: "Package",      value: qtTitle || "—",                  color: "cyan"    },
  ];

  const fmt = (n) => `₹${Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

  return (
    <div
      className="min-h-screen bg-slate-100 font-sans"
      style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        .tab-scroll::-webkit-scrollbar { height: 0px; }
        .qt-tab-btn { transition: color 0.18s, background 0.18s, border-color 0.18s; }
        .lift-card  { transition: box-shadow 0.2s, transform 0.2s; }
        .lift-card:hover { box-shadow: 0 8px 32px 0 rgba(15,23,42,0.09); transform: translateY(-1px); }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn { from{transform:translateX(110%);opacity:0} to{transform:translateX(0);opacity:1} }
        .fade-up { animation: fadeUp .4s ease both; }
        .stat-card-hover { transition: transform 0.2s, box-shadow 0.2s; }
        .stat-card-hover:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(0,0,0,0.15); }
      `}</style>

      {/* Toast */}
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-7 space-y-5">

        {/* ── TOP BAR ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 fade-up">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-2">
              <Home size={12} />
              <ChevronRight size={10} className="text-slate-300" />
              <span className="hover:text-slate-600 cursor-pointer transition-colors"
                onClick={() => navigate("/allleads")}>
                Leads
              </span>
              <ChevronRight size={10} className="text-slate-300" />
              <span className="text-blue-600 font-bold">
                {quotationId ? "Edit Quotation" : "Create Quotation"}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-200 flex-shrink-0">
                <FileText size={16} className="text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  {quotationId ? "Edit Quotation" : "Create Quotation"}
                </h1>
                <p className="text-xs text-slate-400 font-medium mt-0.5">
                  {leadId ? `Lead ID: ${String(leadId).slice(0, 8)}...` : "New Quotation"}
                  {quotationId && <span className="ml-2 text-emerald-600 font-bold">· Saved</span>}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {leadLoading && (
              <span className="text-xs text-slate-400 font-medium animate-pulse">Loading lead data...</span>
            )}
            {!leadLoading && leadData && (
              <>
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-sm">
                  <User size={12} className="text-blue-500" /> {leadData.customerName || "—"}
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 shadow-sm">
                  <Users size={12} className="text-violet-500" /> {travelers}
                </span>
                {leadData.itinerary?.[0]?.destination && (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 shadow-sm">
                    <MapPin size={12} className="text-rose-500" /> {leadData.itinerary[0].destination}
                    {leadData.itinerary[0].nights && ` · ${leadData.itinerary[0].nights}N`}
                  </span>
                )}
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 shadow-sm">
                  <Phone size={12} className="text-emerald-500" /> {leadData.phone || "—"}
                </span>
              </>
            )}
            <span className="px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-xl text-xs font-bold text-amber-700">
              {stage} · {version}
            </span>
          </div>
        </div>

        {/* ── LEAD INFO + QUOTATION DETAILS CARD ── */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden lift-card fade-up"
          style={{ animationDelay: "60ms" }}>

          {/* Card Header */}
          <div className="flex items-center gap-3 px-5 py-3.5 border-b border-slate-100 bg-slate-50/60">
            <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
              <User size={13} className="text-blue-600" />
            </div>
            <p className="text-[13px] font-bold text-slate-700">Lead & Quotation Details</p>
            <div className="ml-auto flex items-center gap-2">
              {leadLoading && <span className="text-[11px] text-slate-400 animate-pulse">Fetching lead...</span>}
              <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
              <span className="text-[11px] font-semibold text-slate-400">Draft</span>
              {quotationId && (
                <span className="text-[11px] font-semibold text-emerald-500 ml-2">
                  · Saved #{String(quotationId).slice(0, 8)}
                </span>
              )}
            </div>
          </div>

          <div className="p-5 space-y-5">

            {/* ── Lead Info Row ── */}
            {leadData && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">

                {/* Client Name */}
                <div className="col-span-2 sm:col-span-1 flex items-center gap-3 bg-blue-50 rounded-xl p-3 border border-blue-100">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm font-extrabold flex-shrink-0 shadow-sm">
                    {(leadData.customerName || "U").charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-blue-500 font-bold uppercase tracking-wide">Client</p>
                    <p className="text-[13px] font-extrabold text-slate-800 truncate">{leadData.customerName || "—"}</p>
                    <p className="text-[10px] text-slate-500 truncate">{leadData.email || ""}</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-center gap-3 bg-emerald-50 rounded-xl p-3 border border-emerald-100">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <Phone size={14} className="text-emerald-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wide">Phone</p>
                    <p className="text-[13px] font-bold text-slate-800 truncate">{leadData.phone || "—"}</p>
                  </div>
                </div>

                {/* Travelers */}
                <div className="flex items-center gap-3 bg-violet-50 rounded-xl p-3 border border-violet-100">
                  <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0">
                    <Users size={14} className="text-violet-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-violet-600 font-bold uppercase tracking-wide">Travelers</p>
                    <p className="text-[13px] font-bold text-slate-800 truncate">{travelers}</p>
                  </div>
                </div>

                {/* Destination */}
                <div className="flex items-center gap-3 bg-rose-50 rounded-xl p-3 border border-rose-100">
                  <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center flex-shrink-0">
                    <MapPin size={14} className="text-rose-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-rose-600 font-bold uppercase tracking-wide">Destination</p>
                    <p className="text-[13px] font-bold text-slate-800 truncate">{destination}</p>
                  </div>
                </div>

                {/* Lead Type */}
                <div className="flex items-center gap-3 bg-amber-50 rounded-xl p-3 border border-amber-100">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <FileText size={14} className="text-amber-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-amber-600 font-bold uppercase tracking-wide">Lead Type</p>
                    <p className="text-[13px] font-bold text-slate-800 truncate">{leadData.leadType || "—"}</p>
                  </div>
                </div>

                {/* Assigned To */}
                <div className="flex items-center gap-3 bg-indigo-50 rounded-xl p-3 border border-indigo-100">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                    <User size={14} className="text-indigo-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-wide">Assigned To</p>
                    <p className="text-[13px] font-bold text-slate-800 truncate">{assignedTo}</p>
                  </div>
                </div>

              </div>
            )}

            {/* Services tags if available */}
            {leadData?.services?.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Services:</span>
                {leadData.services.map((s, i) => {
                  const c = serviceColor(s);
                  return (
                    <span key={i} style={{ background: c.bg, color: c.text }}
                      className="px-2.5 py-1 rounded-full text-[11px] font-semibold">{s}</span>
                  );
                })}
              </div>
            )}

            {/* Divider */}
            {leadData && <div className="border-t border-slate-100" />}

            {/* ── Quotation Title / Version / Stage ── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label required>Quotation Title</Label>
                <Input
                  value={qtTitle}
                  onChange={e => setQtTitle(e.target.value)}
                  placeholder="e.g. Nepal Adventure Premium"
                />
              </div>
              <div>
                <Label>Version</Label>
                <div className="relative">
                  <Input value={version} disabled />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 text-[10px] font-bold border border-blue-100">
                    {version}
                  </span>
                </div>
              </div>
              <div>
                <Label>Lead Stage</Label>
                <div className="relative">
                  <Input value={leadData?.leadStage || stage} disabled className="pr-24" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-amber-100 text-amber-700 text-[10px] font-bold">
                    {leadData?.leadStage || stage}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ── TABS CARD ── */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden fade-up"
          style={{ animationDelay: "120ms" }}>
          <div className="tab-scroll overflow-x-auto border-b border-slate-100">
            <div className="flex min-w-max">
              {TABS.map((tab) => {
                const Icon   = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`qt-tab-btn relative flex items-center gap-2 px-5 py-4 text-[13px] font-bold
                      whitespace-nowrap border-b-2 focus:outline-none group
                      ${active
                        ? TAB_ACTIVE[tab.color]
                        : "text-slate-400 border-transparent hover:text-slate-600 hover:bg-slate-50"
                      }`}
                  >
                    <span className={`flex items-center justify-center w-6 h-6 rounded-lg transition-all flex-shrink-0
                        ${active ? ICON_BG[tab.color] : "bg-slate-100 group-hover:bg-slate-200"}`}>
                      <Icon size={13} strokeWidth={active ? 2.5 : 2} />
                    </span>
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab content — wrapper with overflow hidden */}
          <div className="relative overflow-hidden">
            <div style={{ minHeight: 260 }}>

              {/* Flight */}
              <div style={{ display: activeTab === "flight" ? "block" : "none" }} className="p-5 sm:p-6">
                <FlightTab onDataChange={setFlightData} />
              </div>

              {/* Hotel */}
              <div style={{ display: activeTab === "hotel" ? "block" : "none" }} className="p-5 sm:p-6">
                <HotelTab onDataChange={setHotelData} />
              </div>

              {/* Sightseeing */}
              <div style={{ display: activeTab === "sightseeing" ? "block" : "none" }} className="p-5 sm:p-6">
                <SightseeingTab onDataChange={setSightseeingData} />
              </div>

              {/* Cruise */}
              <div style={{ display: activeTab === "cruise" ? "block" : "none" }} className="p-5 sm:p-6">
                <CruiseTab onDataChange={setCruiseData} />
              </div>

              {/* Vehicle */}
              <div style={{ display: activeTab === "vehicle" ? "block" : "none" }} className="p-5 sm:p-6">
                <VehicleTab onDataChange={setVehicleData} />
              </div>

              {/* Add-on Services */}
              <div style={{ display: activeTab === "addons" ? "block" : "none" }} className="p-5 sm:p-6">
                <AddOnServicesTab onDataChange={setAddonData} />
              </div>

              {/* Inclusions & Exclusions */}
              <div style={{ display: activeTab === "inclusions" ? "block" : "none" }} className="p-5 sm:p-6">
                <InclusionsExclusionsTab onDataChange={setInclusionsData} />
              </div>

              {/* Summary & Pricing — costs passed live, key forces re-render on cost change */}
              <div style={{ display: activeTab === "summary" ? "block" : "none" }} className="p-5 sm:p-6">
                <SummaryPricingTab
                  onDataChange={setSummaryData}
                  costs={costs}
                  key={`summary-${costs.flight}-${costs.hotel}-${costs.sightseeing}-${costs.cruise}-${costs.vehicle}-${costs.addons}`}
                />
              </div>

            </div>
          </div>

          {/* Tab footer — prev/next + progress dots */}
          <div className="flex items-center justify-between px-5 py-3 bg-slate-50/80 border-t border-slate-100">
            <p className="text-[11px] text-slate-400 font-semibold">
              Step{" "}
              <span className="text-slate-700 font-extrabold">{activeIdx + 1}</span>
              {" "}of {TABS.length}
            </p>
            <div className="flex items-center gap-1.5">
              {TABS.map((t, i) => {
                const done    = i < activeIdx;
                const current = i === activeIdx;
                return (
                  <button key={t.id} onClick={() => setActiveTab(t.id)} title={t.label}
                    className={`rounded-full transition-all duration-200 focus:outline-none
                      ${current ? "w-6 h-2 bg-blue-600" : done
                        ? "w-2 h-2 bg-emerald-400 hover:bg-emerald-500"
                        : "w-2 h-2 bg-slate-200 hover:bg-slate-300"}`} />
                );
              })}
            </div>
            <div className="flex items-center gap-1">
              <button
                disabled={activeIdx === 0}
                onClick={() => setActiveTab(TABS[activeIdx - 1].id)}
                className="flex items-center gap-1 px-3 py-1.5 text-[12px] font-bold text-slate-500
                  hover:text-slate-800 hover:bg-slate-100 rounded-lg disabled:opacity-25 transition-all">
                <ChevronRight size={12} className="rotate-180" /> Prev
              </button>
              <button
                disabled={activeIdx === TABS.length - 1}
                onClick={() => setActiveTab(TABS[activeIdx + 1].id)}
                className="flex items-center gap-1 px-3 py-1.5 text-[12px] font-bold text-blue-600
                  hover:text-blue-800 hover:bg-blue-50 rounded-lg disabled:opacity-25 transition-all">
                Next <ChevronRight size={12} />
              </button>
            </div>
          </div>
        </div>

        {/* ── QUOTATION SUMMARY CARD ── */}
        <div className="relative rounded-3xl overflow-hidden shadow-xl shadow-slate-200/60 fade-up"
          style={{ animationDelay: "180ms" }}>
          {/* Header strip */}
          <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 px-5 sm:px-7 py-5">
            <div className="absolute -top-10 -right-10 w-44 h-44 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck size={18} className="text-emerald-300" />
                </div>
                <div>
                  <p className="text-white text-sm font-extrabold tracking-tight">Quotation Summary</p>
                  <p className="text-slate-400 text-[11px] font-medium">Verified pricing · Auto-calculated in real time</p>
                </div>
              </div>
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/15 border border-emerald-400/30 rounded-full text-emerald-300 text-[11px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live Pricing
              </span>
            </div>
          </div>

          {/* Body */}
          <div className="bg-gradient-to-br from-slate-50 via-white to-slate-50 p-5 sm:p-7">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

              {/* Left — Client info chips */}
              <div className="lg:col-span-3">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles size={13} className="text-blue-500" />
                  <p className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">Client & Package Details</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SUMMARY_INFO.map(({ icon: Icon, label, value, color }) => {
                    const style = CHIP_STYLE[color];
                    return (
                      <div key={label}
                        className={`relative flex items-start gap-3 p-4 bg-white rounded-2xl border-2 border-slate-100
                          ${style.ring} hover:shadow-lg ${style.glow} transition-all duration-200 cursor-default group overflow-hidden`}>
                        <div className={`absolute inset-0 bg-gradient-to-br ${style.grad} opacity-0 group-hover:opacity-[0.06] transition-opacity`} />
                        <div className={`relative z-10 w-10 h-10 rounded-xl bg-gradient-to-br ${style.grad} text-white flex items-center justify-center
                            flex-shrink-0 shadow-md group-hover:scale-110 group-hover:rotate-3 transition-all duration-200`}>
                          <Icon size={16} strokeWidth={2.3} />
                        </div>
                        <div className="relative z-10 min-w-0">
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide leading-none">{label}</p>
                          <p className="text-sm font-extrabold text-slate-800 truncate mt-1.5">{value}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2 mt-5 pt-5 border-t border-slate-200">
                  <button
                    onClick={handlePdf}
                    disabled={pdfLoading}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-blue-50 border-2 border-blue-100 hover:border-blue-300 text-blue-600 text-xs font-bold rounded-xl transition-all shadow-sm disabled:opacity-60">
                    {pdfLoading ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
                    {pdfLoading ? "Generating..." : "Export PDF"}
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-violet-50 border-2 border-violet-100 hover:border-violet-300 text-violet-600 text-xs font-bold rounded-xl transition-all shadow-sm">
                    <Share2 size={13} /> Share with Client
                  </button>
                </div>
              </div>

              {/* Right — Pricing stat cards */}
              <div className="lg:col-span-2 flex flex-col gap-4">
                <div className="flex items-center gap-2 mb-1">
                  <Wallet size={13} className="text-slate-400" />
                  <p className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">Pricing Overview</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Grand Total */}
                  <div className="relative overflow-hidden rounded-[18px] p-5 flex flex-col justify-between min-h-[155px] stat-card-hover cursor-default"
                    style={{ background: "linear-gradient(135deg,#00c6a7 0%,#00a389 40%,#007d6b 100%)" }}>
                    <div className="absolute -top-9 -right-8 w-28 h-28 rounded-full pointer-events-none" style={{ background: "rgba(255,255,255,0.13)" }} />
                    <div className="absolute bottom-[-18px] right-8 w-20 h-20 rounded-full pointer-events-none" style={{ background: "rgba(255,255,255,0.09)" }} />
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center relative z-10" style={{ background: "rgba(255,255,255,0.22)" }}>
                      <TrendingUp size={22} className="text-white" />
                    </div>
                    <div className="relative z-10 mt-3">
                      <p className="text-[34px] font-extrabold text-white leading-none tracking-tight">{fmt(grandTotal)}</p>
                      <p className="text-[10px] font-semibold uppercase tracking-[.13em] mt-2" style={{ color: "rgba(255,255,255,0.72)" }}>
                        Final Quotation Total
                      </p>
                    </div>
                  </div>

                  {/* Add-on total */}
                  <div className="relative overflow-hidden rounded-[18px] p-5 flex flex-col justify-between min-h-[155px] stat-card-hover cursor-default"
                    style={{ background: "linear-gradient(135deg,#f7971e 0%,#f4821a 40%,#e06c0f 100%)" }}>
                    <div className="absolute -top-9 -right-8 w-28 h-28 rounded-full pointer-events-none" style={{ background: "rgba(255,255,255,0.13)" }} />
                    <div className="absolute bottom-[-18px] right-8 w-20 h-20 rounded-full pointer-events-none" style={{ background: "rgba(255,255,255,0.09)" }} />
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center relative z-10" style={{ background: "rgba(255,255,255,0.22)" }}>
                      <Package size={22} className="text-white" />
                    </div>
                    <div className="relative z-10 mt-3">
                      <p className="text-[34px] font-extrabold text-white leading-none tracking-tight">{fmt(costs.addons)}</p>
                      <p className="text-[10px] font-semibold uppercase tracking-[.13em] mt-2" style={{ color: "rgba(255,255,255,0.72)" }}>
                        Add-on Services
                      </p>
                    </div>
                  </div>
                </div>

                {/* Trust badge */}
                <div className="flex items-center gap-2.5 p-3 bg-white border border-slate-200 rounded-xl">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck size={14} className="text-white" />
                  </div>
                  <p className="text-[11px] text-slate-500 font-semibold leading-snug">
                    This quotation is auto-saved and securely stored for your client.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── FOOTER ACTIONS ── */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pb-6 fade-up"
          style={{ animationDelay: "240ms" }}>
          <p className="text-xs text-slate-400 font-medium">
            All fields marked <span className="text-rose-400 font-bold">*</span> are required
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2.5 border-2 border-slate-200 hover:border-slate-300
                text-slate-600 font-bold text-sm rounded-xl transition-all bg-white hover:bg-slate-50 active:scale-95 shadow-sm">
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-8 py-2.5 font-bold text-sm rounded-xl
                text-white shadow-md shadow-blue-200 transition-all active:scale-95
                hover:shadow-lg hover:shadow-blue-200 disabled:opacity-60 disabled:cursor-not-allowed
                bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
              {saving
                ? <><Loader2 size={15} className="animate-spin" /> Saving...</>
                : <><Save size={15} strokeWidth={2.5} />{quotationId ? "Update Quotation" : "Create Quotation"}</>
              }
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}