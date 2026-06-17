

// import React, { useState } from "react";
// import {
//   Plane, Hotel, Map, Anchor, Car, Package, List, BarChart2,
//   Bell, Clock, Home, ChevronRight, Save, Users, Calendar,
//   Phone, FileText, MapPin, User
// } from "lucide-react";

// // ✅ Saari files same folder src/quotation/ mein hain → "./" use karo
// // 👇 FIX: Use "./" instead of "../quotation/"
// import FlightTab               from "./FlightTab";
// import HotelTab                from "./HotelTab";
// import SightseeingTab          from "./SightseeingTab";
// import CruiseTab               from "./CruiseTab";
// import VehicleTab              from "./VehicleTab";
// import AddOnServicesTab        from "./AddOnServicesTab";
// import InclusionsExclusionsTab from "./InclusionsExclusionsTab";
// import SummaryPricingTab       from "./SummaryPricingTab";

// // 👇 FIX: Ui.jsx ke liye bhi same "./"
// import { Input, Label } from "./Ui";

// /* ─── TAB CONFIG ─────────────────────────────────────── */
// const TABS = [
//   { id: "flight",      label: "Flight",                  icon: Plane     },
//   { id: "hotel",       label: "Hotel",                   icon: Hotel     },
//   { id: "sightseeing", label: "Sightseeing",             icon: Map       },
//   { id: "cruise",      label: "Cruise",                  icon: Anchor    },
//   { id: "vehicle",     label: "Vehicle",                 icon: Car       },
//   { id: "addons",      label: "Add-on Services",         icon: Package   },
//   { id: "inclusions",  label: "Inclusions & Exclusions", icon: List      },
//   { id: "summary",     label: "Summary & Pricing",       icon: BarChart2 },
// ];

// const SUMMARY_INFO = [
//   { icon: User,     label: "Client Name",  value: "Pratik Sharma"              },
//   { icon: Phone,    label: "Contact",      value: "+91 98765 43210"            },
//   { icon: Users,    label: "Travelers",    value: "4 Adults, 0 Child"          },
//   { icon: Calendar, label: "Travel Dates", value: "Jun 15 – Jun 22, 2026"     },
//   { icon: MapPin,   label: "Destination",  value: "Nepal (Kathmandu, Pokhara)" },
//   { icon: FileText, label: "Package",      value: "7N / 8D — Nepal Tour"      },
// ];

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

//   return (
//     <div className="min-h-screen bg-slate-50 font-sans"
//       style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
//       <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');`}</style>

//       {/* TOP NAV */}
//       {/* <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
//         <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
//           <div className="flex items-center gap-3">
//             <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center">
//               <Plane size={16} className="text-white" strokeWidth={2.5} />
//             </div>
//             <span className="font-extrabold text-slate-900 text-base tracking-tight">TravelCRM</span>
//           </div>
//           <div className="flex items-center gap-2 sm:gap-3"> */}
//             {/* <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-green-500 text-white text-xs font-bold rounded-full">
//               <Phone size={12} /> +91 98765 43210
//             </button>
//             <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all">
//               <Bell size={18} />
//               <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
//             </button>
//             <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all">
//               <Clock size={13} /> 02:45
//             </button>
//             <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-xl border border-blue-200">
//               Pro Plan
//             </button> */}
//             {/* <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">P</div> */}
//           {/* </div>
//         </div>
//       </div> */}

//       <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6 space-y-5">

//         {/* BREADCRUMB */}
//         <div>
//           <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-1.5">
//             <Home size={12} /> <ChevronRight size={10} />
//             <span>Leads</span> <ChevronRight size={10} />
//             <span className="text-slate-600 font-semibold">Create Quotation</span>
//           </div>
//           <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Create Quotation</h1>
//         </div>

//         {/* PACKAGE BANNER */}
//         <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 rounded-2xl px-6 py-4 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
//           <div>
//             <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-1">Quotation Package</p>
//             <h2 className="text-lg font-extrabold">Quotation for Pratik · 7 Nights / 8 Days — Nepal Tour</h2>
//           </div>
//           <div className="flex items-center gap-3 text-sm flex-shrink-0">
//             <span className="bg-white/20 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5"><Users size={13} /> 4 Pax</span>
//             <span className="bg-white/20 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5"><Calendar size={13} /> Jun 15, 2026</span>
//           </div>
//         </div>

//         {/* BASIC INFO */}
//         <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//             <div>
//               <Label required>Quotation Title</Label>
//               <Input value={qtTitle} onChange={e => setQtTitle(e.target.value)} placeholder="Enter quotation title..." />
//             </div>
//             <div><Label>Version</Label><Input value={version} disabled /></div>
//             <div><Label>Lead Stage</Label><Input value={stage} disabled /></div>
//           </div>
//         </div>

//         {/* TABS */}
//         <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
//           <div className="overflow-x-auto border-b border-slate-200">
//             <div className="flex min-w-max">
//               {TABS.map(tab => {
//                 const Icon   = tab.icon;
//                 const active = activeTab === tab.id;
//                 return (
//                   <button key={tab.id} onClick={() => setActiveTab(tab.id)}
//                     className={`flex items-center gap-2 px-5 py-4 text-sm font-bold whitespace-nowrap transition-all border-b-2
//                       ${active
//                         ? "text-blue-600 border-blue-600 bg-blue-50/50"
//                         : "text-slate-500 border-transparent hover:text-slate-700 hover:bg-slate-50"}`}>
//                     <Icon size={15} strokeWidth={active ? 2.5 : 2} />
//                     {tab.label}
//                   </button>
//                 );
//               })}
//             </div>
//           </div>
//           <div className="p-5 sm:p-6">
//             {tabContent[activeTab]}
//           </div>
//         </div>

//         {/* SUMMARY PANEL */}
//         <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
//           <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
//             <h3 className="text-sm font-extrabold text-slate-800">Quotation Summary</h3>
//           </div>
//           <div className="p-5 grid grid-cols-1 lg:grid-cols-3 gap-5">
//             <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
//               {SUMMARY_INFO.map(({ icon: Icon, label, value }) => (
//                 <div key={label} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
//                   <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0"><Icon size={14} /></div>
//                   <div className="min-w-0">
//                     <p className="text-[11px] text-slate-400 font-medium">{label}</p>
//                     <p className="text-sm font-bold text-slate-800 truncate">{value}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//             <div className="flex flex-col gap-3">
//               <div className="flex-1 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-5 text-white text-center flex flex-col items-center justify-center">
//                 <p className="text-emerald-100 text-xs font-bold uppercase tracking-widest mb-2">Final Quotation Total</p>
//                 <p className="text-3xl font-extrabold">₹0.00</p>
//               </div>
//               <div className="flex-1 bg-gradient-to-br from-amber-400 to-amber-500 rounded-2xl p-5 text-white text-center flex flex-col items-center justify-center">
//                 <p className="text-amber-100 text-xs font-bold uppercase tracking-widest mb-2">Add-on Services Total</p>
//                 <p className="text-3xl font-extrabold">₹0.00</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* FOOTER */}
//         <div className="flex items-center justify-end gap-3 pb-8">
//           <button type="button"
//             className="px-6 py-2.5 border-2 border-slate-300 hover:border-slate-400 text-slate-700 font-bold text-sm rounded-xl transition-all bg-white hover:bg-slate-50 active:scale-95">
//             Cancel
//           </button>
//           <button type="button"
//             className="flex items-center gap-2 px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-200 transition-all active:scale-95">
//             <Save size={15} strokeWidth={2.5} /> Create Quotation
//           </button>
//         </div>

//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import {
  Plane, Hotel, Map, Anchor, Car, Package, List, BarChart2,
  Home, ChevronRight, Save, Users, Calendar,
  Phone, FileText, MapPin, User, TrendingUp, Sparkles,
  Wallet, ShieldCheck, Download, Share2
} from "lucide-react";

import FlightTab               from "./FlightTab";
import HotelTab                from "./HotelTab";
import SightseeingTab          from "./SightseeingTab";
import CruiseTab               from "./CruiseTab";
import VehicleTab              from "./VehicleTab";
import AddOnServicesTab        from "./AddOnServicesTab";
import InclusionsExclusionsTab from "./InclusionsExclusionsTab";
import SummaryPricingTab       from "./SummaryPricingTab";

import { Input, Label } from "./Ui";

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

const SUMMARY_INFO = [
  { icon: User,     label: "Client Name",  value: "Pratik Sharma",               color: "blue"    },
  { icon: Phone,    label: "Contact",      value: "+91 98765 43210",             color: "emerald" },
  { icon: Users,    label: "Travelers",    value: "4 Adults, 0 Child",           color: "violet"  },
  { icon: Calendar, label: "Travel Dates", value: "Jun 15 – Jun 22, 2026",      color: "amber"   },
  { icon: MapPin,   label: "Destination",  value: "Nepal (Kathmandu, Pokhara)", color: "rose"    },
  { icon: FileText, label: "Package",      value: "7N / 8D — Nepal Tour",       color: "cyan"    },
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

export default function CreateQuotation() {
  const [activeTab, setActiveTab] = useState("flight");
  const [qtTitle,   setQtTitle]   = useState("");
  const [version]               = useState("v1.0");
  const [stage]                 = useState("New Lead");

  const costs = { flight: 0, hotel: 0, sightseeing: 0, cruise: 0, vehicle: 0, addons: 0 };

  const tabContent = {
    flight:      <FlightTab />,
    hotel:       <HotelTab />,
    sightseeing: <SightseeingTab />,
    cruise:      <CruiseTab />,
    vehicle:     <VehicleTab />,
    addons:      <AddOnServicesTab />,
    inclusions:  <InclusionsExclusionsTab />,
    summary:     <SummaryPricingTab costs={costs} />,
  };

  const activeIdx = TABS.findIndex(t => t.id === activeTab);

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
        .lift-card:hover {
          box-shadow: 0 8px 32px 0 rgba(15,23,42,0.09);
          transform: translateY(-1px);
        }
        @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .fade-up { animation: fadeUp .4s ease both; }
        .stat-card-hover { transition: transform 0.2s, box-shadow 0.2s; }
        .stat-card-hover:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(0,0,0,0.15); }
      `}</style>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-7 space-y-5">

        {/* ── TOP BAR ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 fade-up">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-2">
              <Home size={12} className="text-slate-400" />
              <ChevronRight size={10} className="text-slate-300" />
              <span className="hover:text-slate-600 cursor-pointer transition-colors">Leads</span>
              <ChevronRight size={10} className="text-slate-300" />
              <span className="text-blue-600 font-bold">Create Quotation</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-200 flex-shrink-0">
                <FileText size={16} className="text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  Create Quotation
                </h1>
                <p className="text-xs text-slate-400 font-medium mt-0.5">
                  Pratik Sharma · Nepal Tour · 7N / 8D
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 shadow-sm">
              <Users size={12} className="text-blue-500" /> 4 Pax
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 shadow-sm">
              <Calendar size={12} className="text-violet-500" /> Jun 15 – 22, 2026
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 shadow-sm">
              <MapPin size={12} className="text-rose-500" /> Nepal
            </span>
            <span className="px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-xl text-xs font-bold text-amber-700">
              New Lead · v1.0
            </span>
          </div>
        </div>

        {/* ── BASIC INFO CARD ── */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden lift-card fade-up" style={{ animationDelay: "60ms" }}>
          <div className="flex items-center gap-3 px-5 py-3.5 border-b border-slate-100 bg-slate-50/60">
            <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
              <FileText size={13} className="text-blue-600" />
            </div>
            <p className="text-[13px] font-bold text-slate-700">Quotation Details</p>
            <div className="ml-auto flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
              <span className="text-[11px] font-semibold text-slate-400">Draft</span>
            </div>
          </div>

          <div className="p-5">
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
                  <Input value={stage} disabled className="pr-24" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-amber-100 text-amber-700 text-[10px] font-bold">
                    {stage}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── TABS CARD ── */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden fade-up" style={{ animationDelay: "120ms" }}>
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
                    <span
                      className={`flex items-center justify-center w-6 h-6 rounded-lg transition-all flex-shrink-0
                        ${active ? ICON_BG[tab.color] : "bg-slate-100 group-hover:bg-slate-200"}`}
                    >
                      <Icon size={13} strokeWidth={active ? 2.5 : 2} />
                    </span>
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-5 sm:p-6 min-h-[260px]">
            {tabContent[activeTab]}
          </div>

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
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    title={t.label}
                    className={`rounded-full transition-all duration-200 focus:outline-none
                      ${current
                        ? "w-6 h-2 bg-blue-600"
                        : done
                          ? "w-2 h-2 bg-emerald-400 hover:bg-emerald-500"
                          : "w-2 h-2 bg-slate-200 hover:bg-slate-300"
                      }`}
                  />
                );
              })}
            </div>
            <div className="flex items-center gap-1">
              <button
                disabled={activeIdx === 0}
                onClick={() => setActiveTab(TABS[activeIdx - 1].id)}
                className="flex items-center gap-1 px-3 py-1.5 text-[12px] font-bold text-slate-500
                  hover:text-slate-800 hover:bg-slate-100 rounded-lg disabled:opacity-25 transition-all"
              >
                <ChevronRight size={12} className="rotate-180" /> Prev
              </button>
              <button
                disabled={activeIdx === TABS.length - 1}
                onClick={() => setActiveTab(TABS[activeIdx + 1].id)}
                className="flex items-center gap-1 px-3 py-1.5 text-[12px] font-bold text-blue-600
                  hover:text-blue-800 hover:bg-blue-50 rounded-lg disabled:opacity-25 transition-all"
              >
                Next <ChevronRight size={12} />
              </button>
            </div>
          </div>
        </div>

        {/* ── QUOTATION SUMMARY CARD ── */}
        <div className="relative rounded-3xl overflow-hidden shadow-xl shadow-slate-200/60 fade-up" style={{ animationDelay: "180ms" }}>

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

              {/* Left — Client info */}
              <div className="lg:col-span-3">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles size={13} className="text-blue-500" />
                  <p className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">Client & Package Details</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SUMMARY_INFO.map(({ icon: Icon, label, value, color }) => {
                    const style = CHIP_STYLE[color];
                    return (
                      <div
                        key={label}
                        className={`relative flex items-start gap-3 p-4 bg-white rounded-2xl border-2 border-slate-100
                          ${style.ring} hover:shadow-lg ${style.glow} transition-all duration-200 cursor-default group overflow-hidden`}
                      >
                        <div className={`absolute inset-0 bg-gradient-to-br ${style.grad} opacity-0 group-hover:opacity-[0.06] transition-opacity`} />
                        <div className={`relative z-10 w-10 h-10 rounded-xl bg-gradient-to-br ${style.grad} text-white flex items-center justify-center
                          flex-shrink-0 shadow-md group-hover:scale-110 group-hover:rotate-3 transition-all duration-200`}>
                          <Icon size={16} strokeWidth={2.3} />
                        </div>
                        <div className="relative z-10 min-w-0">
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide leading-none">
                            {label}
                          </p>
                          <p className="text-sm font-extrabold text-slate-800 truncate mt-1.5">{value}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2 mt-5 pt-5 border-t border-slate-200">
                  <button className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-blue-50 border-2 border-blue-100 hover:border-blue-300 text-blue-600 text-xs font-bold rounded-xl transition-all shadow-sm">
                    <Download size={13} /> Export PDF
                  </button>
                  <button className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-violet-50 border-2 border-violet-100 hover:border-violet-300 text-violet-600 text-xs font-bold rounded-xl transition-all shadow-sm">
                    <Share2 size={13} /> Share with Client
                  </button>
                </div>
              </div>

              {/* ── RIGHT — Pricing Overview (Vendor-style stat cards) ── */}
              <div className="lg:col-span-2 flex flex-col gap-4">
                <div className="flex items-center gap-2 mb-1">
                  <Wallet size={13} className="text-slate-400" />
                  <p className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">Pricing Overview</p>
                </div>

                {/* Two stat cards side by side */}
                <div className="grid grid-cols-2 gap-4">

                  {/* Final Total — Teal */}
                  <div
                    className="relative overflow-hidden rounded-[18px] p-5 flex flex-col justify-between min-h-[155px] stat-card-hover cursor-default"
                    style={{ background: "linear-gradient(135deg, #00c6a7 0%, #00a389 40%, #007d6b 100%)" }}
                  >
                    {/* blobs */}
                    <div className="absolute -top-9 -right-8 w-28 h-28 rounded-full pointer-events-none" style={{ background: "rgba(255,255,255,0.13)" }} />
                    <div className="absolute bottom-[-18px] right-8 w-20 h-20 rounded-full pointer-events-none" style={{ background: "rgba(255,255,255,0.09)" }} />
                    <div className="absolute top-4 right-[72px] w-11 h-11 rounded-full pointer-events-none" style={{ background: "rgba(255,255,255,0.07)" }} />

                    {/* Icon */}
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center relative z-10 flex-shrink-0"
                      style={{ background: "rgba(255,255,255,0.22)" }}>
                      <TrendingUp size={22} className="text-white" />
                    </div>

                    {/* Amount + label */}
                    <div className="relative z-10 mt-3">
                      <p className="text-[34px] font-extrabold text-white leading-none tracking-tight">₹0</p>
                      <p className="text-[10px] font-semibold uppercase tracking-[.13em] mt-2"
                        style={{ color: "rgba(255,255,255,0.72)" }}>
                        Final Quotation Total
                      </p>
                    </div>
                  </div>

                  {/* Add-on — Amber/Orange */}
                  <div
                    className="relative overflow-hidden rounded-[18px] p-5 flex flex-col justify-between min-h-[155px] stat-card-hover cursor-default"
                    style={{ background: "linear-gradient(135deg, #f7971e 0%, #f4821a 40%, #e06c0f 100%)" }}
                  >
                    {/* blobs */}
                    <div className="absolute -top-9 -right-8 w-28 h-28 rounded-full pointer-events-none" style={{ background: "rgba(255,255,255,0.13)" }} />
                    <div className="absolute bottom-[-18px] right-8 w-20 h-20 rounded-full pointer-events-none" style={{ background: "rgba(255,255,255,0.09)" }} />
                    <div className="absolute top-4 right-[72px] w-11 h-11 rounded-full pointer-events-none" style={{ background: "rgba(255,255,255,0.07)" }} />

                    {/* Icon */}
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center relative z-10 flex-shrink-0"
                      style={{ background: "rgba(255,255,255,0.22)" }}>
                      <Package size={22} className="text-white" />
                    </div>

                    {/* Amount + label */}
                    <div className="relative z-10 mt-3">
                      <p className="text-[34px] font-extrabold text-white leading-none tracking-tight">₹0</p>
                      <p className="text-[10px] font-semibold uppercase tracking-[.13em] mt-2"
                        style={{ color: "rgba(255,255,255,0.72)" }}>
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
        <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pb-6 fade-up" style={{ animationDelay: "240ms" }}>
          <p className="text-xs text-slate-400 font-medium">
            All fields marked <span className="text-rose-400 font-bold">*</span> are required
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="px-6 py-2.5 border-2 border-slate-200 hover:border-slate-300
                text-slate-600 font-bold text-sm rounded-xl transition-all bg-white
                hover:bg-slate-50 active:scale-95 shadow-sm"
            >
              Cancel
            </button>
            <button
              type="button"
              className="flex items-center gap-2 px-8 py-2.5 font-bold text-sm rounded-xl
                text-white shadow-md shadow-blue-200 transition-all active:scale-95
                hover:shadow-lg hover:shadow-blue-200
                bg-gradient-to-r from-blue-600 to-blue-700
                hover:from-blue-700 hover:to-blue-800"
            >
              <Save size={15} strokeWidth={2.5} />
              Create Quotation
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}