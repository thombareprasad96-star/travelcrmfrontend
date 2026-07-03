// // src/components/Reports/FollowupReports.jsx
// // ─────────────────────────────────────────────────────────────
// // Lead Follow-up Report Page — Travel CRM
// // Matches CRM design system perfectly
// // Reference: company/reports/lead_followup.php screenshot
// // Features:
// //   - Collapsible Filters & Settings (dark slate header)
// //   - View Type / Days Ahead / Assigned To / Priority / Reminder Type / Apply
// //   - Reset + Export CSV buttons
// //   - 6 stat cards: Total, Overdue, Due Today, Urgent(3days), Upcoming, High Priority
// //   - Follow-up Tasks table:
// //       Checkbox | Due Date | Lead Details | Assigned To | Type | Priority | Title & Description | Lead Stage | Actions
// //   - Bulk "Mark Selected as Completed" button
// //   - Row checkboxes for bulk select
// //   - Color-coded hot/fresh badges on lead phone number
// //   - Action buttons: ✓ Complete | ℹ Info | 👁 View
// //   - Show N entries + Search + Pagination
// //   - Desktop table + Mobile cards (responsive)
// //   - Skeleton loading + Toast
// // ─────────────────────────────────────────────────────────────

// import { useState, useMemo, useEffect, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   FiFilter, FiRefreshCw, FiDownload, FiArrowLeft,
//   FiChevronDown, FiChevronUp, FiSearch,
//   FiChevronLeft, FiChevronRight, FiEye, FiInfo,
//   FiCheck, FiClock, FiAlertTriangle, FiCalendar,
// } from "react-icons/fi";
// import {
//   FaAngleDoubleLeft, FaAngleDoubleRight,
//   FaFire, FaLeaf, FaSnowflake, FaExclamationTriangle,
//   FaTasks, FaStar,
// } from "react-icons/fa";
// import { MdOutlineAssignment } from "react-icons/md";

// // ── Uncomment when backend ready ─────────────────────────────
// // import followupReportService from "../services/followupReportService";

// /* ─── MOCK DATA ──────────────────────────────────────────────── */
// const MOCK_TASKS = [
//   { id:1,  dueDate:"Jun 01, 2026", dueTime:"20:07", overdueBy:"Overdue by 21 days", leadName:"Pratik",          leadPhone:"+918888888888", leadTemp:"Hot",   assignedTo:"deepti paul",              assignedUsername:"@deepti_paul",              type:"First Contact", priority:"High",   title:"Contact New Lead: Pratik",              desc:"New lead requires initial contact",                       stage:"Ready to Book", travelDate:"Jul 07", completed:false },
//   { id:2,  dueDate:"Jun 02, 2026", dueTime:"15:30", overdueBy:"Overdue by 20 days", leadName:"Pratik",          leadPhone:"+918888888888", leadTemp:"Hot",   assignedTo:"deepti paul",              assignedUsername:"@deepti_paul",              type:"Follow Up",     priority:"Medium", title:"Follow-up: Pratik",                     desc:"Follow-up scheduled from log: CALL ON FRIDAY, NEED 4 STAR HOTEL", stage:"Ready to Book", travelDate:"Jul 07", completed:false },
//   { id:3,  dueDate:"Jun 05, 2026", dueTime:"00:11", overdueBy:"Overdue by 17 days", leadName:"Priyanshu agrawal",leadPhone:"+91 83029 32798",leadTemp:"Fresh", assignedTo:"vaishnavi shrikant jagtap",assignedUsername:"@vaishnavi_jagtap",        type:"First Contact", priority:"High",   title:"Contact New Lead: Priyanshu agrawal",   desc:"New lead requires initial contact",                       stage:"New Lead",      travelDate:"Jun 27", completed:false },
//   { id:4,  dueDate:"Jun 05, 2026", dueTime:"00:59", overdueBy:"Overdue by 17 days", leadName:"Pratik",          leadPhone:"8010214002",    leadTemp:"Fresh", assignedTo:"vaishnavi shrikant jagtap",assignedUsername:"@vaishnavi_jagtap",        type:"First Contact", priority:"High",   title:"Contact New Lead: Pratik",              desc:"New lead requires initial contact",                       stage:"New Lead",      travelDate:"Jun 13", completed:false },
//   { id:5,  dueDate:"Jun 08, 2026", dueTime:"09:30", overdueBy:"Overdue by 14 days", leadName:"Anushka Narkhede",leadPhone:"+91 98765 11111",leadTemp:"Fresh", assignedTo:"vaishnavi shrikant jagtap",assignedUsername:"@vaishnavi_jagtap",        type:"First Contact", priority:"High",   title:"Contact New Lead: Anushka Narkhede",    desc:"New lead requires initial contact",                       stage:"New Lead",      travelDate:"Jul 01", completed:false },
//   { id:6,  dueDate:"Jun 10, 2026", dueTime:"14:00", overdueBy:"Overdue by 12 days", leadName:"Ramesh Kumar",    leadPhone:"+91 99001 22222",leadTemp:"Hot",   assignedTo:"deepti paul",              assignedUsername:"@deepti_paul",              type:"Follow Up",     priority:"High",   title:"Follow-up: Ramesh Kumar",               desc:"Client needs quotation for Manali trip",                  stage:"Qualified",     travelDate:"Aug 15", completed:false },
//   { id:7,  dueDate:"Jun 12, 2026", dueTime:"11:00", overdueBy:"Overdue by 10 days", leadName:"Sunita Verma",    leadPhone:"+91 91234 33333",leadTemp:"Fresh", assignedTo:"Shreyash_Shahi",           assignedUsername:"@Shreyash_Shahi",           type:"First Contact", priority:"Medium", title:"Contact New Lead: Sunita Verma",         desc:"New lead requires initial contact",                       stage:"New Lead",      travelDate:"Sep 01", completed:false },
//   { id:8,  dueDate:"Jun 15, 2026", dueTime:"10:00", overdueBy:"Overdue by 7 days",  leadName:"Ajay Singh",      leadPhone:"+91 80001 44444",leadTemp:"Hot",   assignedTo:"deepti paul",              assignedUsername:"@deepti_paul",              type:"Follow Up",     priority:"High",   title:"Follow-up: Ajay Singh",                 desc:"Send quotation for Nepal package",                        stage:"Proposal Sent", travelDate:"Oct 10", completed:false },
//   { id:9,  dueDate:"Jun 18, 2026", dueTime:"16:00", overdueBy:"Overdue by 4 days",  leadName:"Meena Sharma",    leadPhone:"+91 70001 55555",leadTemp:"Fresh", assignedTo:"vaishnavi shrikant jagtap",assignedUsername:"@vaishnavi_jagtap",        type:"First Contact", priority:"Medium", title:"Contact New Lead: Meena Sharma",         desc:"New lead requires initial contact",                       stage:"New Lead",      travelDate:"Nov 05", completed:false },
//   { id:10, dueDate:"Jun 20, 2026", dueTime:"09:00", overdueBy:"Overdue by 2 days",  leadName:"Vikram Patel",    leadPhone:"+91 60001 66666",leadTemp:"Hot",   assignedTo:"Shreyash_Shahi",           assignedUsername:"@Shreyash_Shahi",           type:"Follow Up",     priority:"High",   title:"Follow-up: Vikram Patel",               desc:"Client interested in Goa package — confirm dates",        stage:"Contacted",     travelDate:"Dec 01", completed:false },
//   { id:11, dueDate:"Jun 23, 2026", dueTime:"11:30", overdueBy:"Upcoming",           leadName:"Pooja Nair",      leadPhone:"+91 50001 77777",leadTemp:"Fresh", assignedTo:"deepti paul",              assignedUsername:"@deepti_paul",              type:"First Contact", priority:"Low",    title:"Contact New Lead: Pooja Nair",           desc:"New lead requires initial contact",                       stage:"New Lead",      travelDate:"Jan 10", completed:false },
//   { id:12, dueDate:"Jun 25, 2026", dueTime:"15:00", overdueBy:"Upcoming",           leadName:"Rohit Joshi",     leadPhone:"+91 40001 88888",leadTemp:"Hot",   assignedTo:"Shreyash_Shahi",           assignedUsername:"@Shreyash_Shahi",           type:"Follow Up",     priority:"High",   title:"Follow-up: Rohit Joshi",                desc:"Confirm hotel and flight for Bhutan tour",                stage:"Ready to Book", travelDate:"Feb 14", completed:false },
// ];

// const VIEW_TYPES      = ["All","Upcoming","Overdue","Due Today","Completed"];
// const DAYS_AHEAD_OPTS = ["1 day","3 days","7 days","14 days","30 days","All"];
// const PRIORITY_OPTS   = ["All Priorities","High","Medium","Low"];
// const REMINDER_TYPES  = ["All Types","First Contact","Follow Up","Payment Reminder","Document Collection","Booking Confirmation","Custom"];
// const SHOW_ENTRIES    = ["10","25","50","100"];

// const USERS_LIST = ["All Users","deepti paul","vaishnavi shrikant jagtap","Shreyash Raghvendra Shahi"];

// const PRIORITY_CFG = {
//   High:   { bg:"bg-red-100",    text:"text-red-700",    border:"border-red-200"   },
//   Medium: { bg:"bg-amber-100",  text:"text-amber-700",  border:"border-amber-200" },
//   Low:    { bg:"bg-slate-100",  text:"text-slate-500",  border:"border-slate-200" },
// };
// const TYPE_CFG = {
//   "First Contact":          { bg:"bg-green-500",  text:"text-white" },
//   "Follow Up":              { bg:"bg-blue-500",   text:"text-white" },
//   "Payment Reminder":       { bg:"bg-amber-500",  text:"text-white" },
//   "Document Collection":    { bg:"bg-purple-500", text:"text-white" },
//   "Booking Confirmation":   { bg:"bg-teal-500",   text:"text-white" },
//   "Custom":                 { bg:"bg-slate-500",  text:"text-white" },
// };
// const STAGE_CFG = {
//   "Ready to Book":  { bg:"bg-blue-600",    text:"text-white" },
//   "New Lead":       { bg:"bg-slate-600",   text:"text-white" },
//   "Contacted":      { bg:"bg-cyan-600",    text:"text-white" },
//   "Qualified":      { bg:"bg-indigo-600",  text:"text-white" },
//   "Proposal Sent":  { bg:"bg-purple-600",  text:"text-white" },
//   "Converted":      { bg:"bg-green-600",   text:"text-white" },
//   "Lost":           { bg:"bg-red-600",     text:"text-white" },
// };
// const TEMP_CFG = {
//   Hot:   { bg:"bg-red-500",   label:"Hot"  },
//   Warm:  { bg:"bg-amber-500", label:"Warm" },
//   Cold:  { bg:"bg-blue-400",  label:"Cold" },
//   Fresh: { bg:"bg-blue-500",  label:"Fresh"},
// };

// /* ─── TOAST ──────────────────────────────────────────────────── */
// function Toast({ msg, type, onClose }) {
//   useEffect(()=>{ const t=setTimeout(onClose,3500); return()=>clearTimeout(t); },[onClose]);
//   return (
//     <div className={`fixed top-5 right-5 z-[999] flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl max-w-xs
//       ${type==="success"?"bg-green-50 border-green-200 text-green-800":"bg-red-50 border-red-200 text-red-800"}`}
//       style={{animation:"slideIn .3s ease both"}}>
//       <span className="text-lg">{type==="success"?"✅":"❌"}</span>
//       <p className="text-sm font-semibold flex-1">{msg}</p>
//       <button onClick={onClose} className="opacity-50 hover:opacity-100 text-lg ml-1">×</button>
//     </div>
//   );
// }

// /* ─── STAT CARD ──────────────────────────────────────────────── */
// function StatCard({ icon, label, value, bg, delay=0 }) {
//   const [disp, setDisp] = useState(0);
//   useEffect(()=>{
//     if(!value){ setDisp(0); return; }
//     let s=0; const step=Math.max(1,Math.ceil(value/40));
//     const iv=setInterval(()=>{ s=Math.min(s+step,value); setDisp(s); if(s>=value)clearInterval(iv); },16);
//     return()=>clearInterval(iv);
//   },[value]);
//   return (
//     <div className={`${bg} rounded-2xl p-5 text-white shadow-lg relative overflow-hidden group
//       hover:-translate-y-1 hover:shadow-xl transition-all duration-300`}
//       style={{animation:"fadeUp .4s ease both", animationDelay:`${delay}ms`}}>
//       <div className="absolute -right-5 -top-5 w-20 h-20 rounded-full bg-white/10 group-hover:scale-110 transition-transform"/>
//       <div className="absolute -right-2 -bottom-6 w-28 h-28 rounded-full bg-white/10"/>
//       <div className="relative z-10 flex items-center justify-between">
//         <div>
//           <p className="text-3xl font-extrabold leading-none mb-1">{disp}</p>
//           <p className="text-xs font-bold uppercase tracking-widest opacity-85">{label}</p>
//         </div>
//         <div className="w-12 h-12 rounded-2xl bg-white/20 group-hover:bg-white/30 flex items-center justify-center text-2xl transition-all">
//           {icon}
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ─── SKELETON ROW ───────────────────────────────────────────── */
// function SkeletonRow() {
//   return (
//     <tr>
//       {[...Array(8)].map((_,i)=>(
//         <td key={i} className="px-3 py-4">
//           <div className="h-4 rounded-lg bg-slate-200 animate-pulse" style={{width:`${30+Math.random()*55}%`}}/>
//         </td>
//       ))}
//     </tr>
//   );
// }

// const inputCls = "w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 font-medium focus:border-blue-400 focus:ring-2 focus:ring-blue-50 outline-none appearance-none cursor-pointer transition-all hover:border-slate-300";

// /* ─── MAIN PAGE ──────────────────────────────────────────────── */
// export default function FollowupReports() {
//   const navigate = useNavigate();

//   /* filter state */
//   const [viewType,     setViewType]     = useState("All");
//   const [daysAhead,    setDaysAhead]    = useState("7 days");
//   const [assignedTo,   setAssignedTo]   = useState("All Users");
//   const [priority,     setPriority]     = useState("All Priorities");
//   const [reminderType, setReminderType] = useState("All Types");
//   const [filtersOpen,  setFiltersOpen]  = useState(true);
//   const [search,       setSearch]       = useState("");
//   const [showEntries,  setShowEntries]  = useState("25");
//   const [page,         setPage]         = useState(1);
//   const [applied,      setApplied]      = useState({ viewType:"All", daysAhead:"7 days", assignedTo:"All Users", priority:"All Priorities", reminderType:"All Types" });

//   /* data + selection state */
//   const [tasks,     setTasks]     = useState([]);
//   const [loading,   setLoading]   = useState(true);
//   const [toast,     setToast]     = useState(null);
//   const [selected,  setSelected]  = useState(new Set());

//   const showToast = useCallback((msg, type="success")=>setToast({msg,type}),[]);

//   useEffect(()=>{
//     setLoading(true);
//     // BACKEND: followupReportService.getTasks(applied)
//     setTimeout(()=>{ setTasks(MOCK_TASKS); setLoading(false); }, 700);
//   },[applied]);

//   /* apply / reset */
//   const handleApply = () => {
//     setApplied({ viewType, daysAhead, assignedTo, priority, reminderType });
//     setPage(1); setSelected(new Set());
//     showToast("Filters applied.");
//   };
//   const handleReset = () => {
//     setViewType("All"); setDaysAhead("7 days");
//     setAssignedTo("All Users"); setPriority("All Priorities"); setReminderType("All Types");
//     setApplied({ viewType:"All", daysAhead:"7 days", assignedTo:"All Users", priority:"All Priorities", reminderType:"All Types" });
//     setSearch(""); setPage(1); setSelected(new Set());
//     showToast("Filters reset.");
//   };

//   /* export CSV */
//   const handleExportCSV = () => {
//     const headers = ["ID","Due Date","Due Time","Overdue By","Lead Name","Phone","Temperature","Assigned To","Type","Priority","Title","Description","Lead Stage","Travel Date","Completed"];
//     const rows = filtered.map(t=>[
//       t.id, t.dueDate, t.dueTime, t.overdueBy, t.leadName, t.leadPhone, t.leadTemp,
//       t.assignedTo, t.type, t.priority, `"${t.title}"`, `"${t.desc}"`,
//       t.stage, t.travelDate, t.completed
//     ]);
//     const csv = [headers,...rows].map(r=>r.join(",")).join("\n");
//     const blob = new Blob([csv],{type:"text/csv"});
//     const url  = URL.createObjectURL(blob);
//     const a    = document.createElement("a"); a.href=url;
//     a.download = "followup-report.csv";
//     a.click(); URL.revokeObjectURL(url);
//     showToast("CSV exported successfully.");
//   };

//   /* bulk complete */
//   const handleMarkCompleted = () => {
//     if(selected.size===0){ showToast("Select at least one task.","error"); return; }
//     setTasks(prev=>prev.map(t=>selected.has(t.id)?{...t,completed:true}:t));
//     showToast(`${selected.size} task${selected.size>1?"s":""} marked as completed.`);
//     setSelected(new Set());
//   };

//   /* single complete */
//   const handleComplete = (id) => {
//     setTasks(prev=>prev.map(t=>t.id===id?{...t,completed:true}:t));
//     showToast("Task marked as completed.");
//   };

//   /* checkbox logic */
//   const toggleSelect = (id) => {
//     setSelected(prev=>{ const n=new Set(prev); n.has(id)?n.delete(id):n.add(id); return n; });
//   };
//   const toggleAll = () => {
//     if(selected.size===pageData.length) setSelected(new Set());
//     else setSelected(new Set(pageData.map(t=>t.id)));
//   };

//   /* filtered */
//   const filtered = useMemo(()=>
//     tasks.filter(t=>{
//       const q = search.toLowerCase();
//       if(q && !t.leadName.toLowerCase().includes(q) && !t.title.toLowerCase().includes(q) && !t.assignedTo.toLowerCase().includes(q)) return false;
//       if(applied.assignedTo!=="All Users"     && t.assignedTo!==applied.assignedTo)       return false;
//       if(applied.priority!=="All Priorities"  && t.priority!==applied.priority)           return false;
//       if(applied.reminderType!=="All Types"   && t.type!==applied.reminderType)           return false;
//       if(applied.viewType==="Overdue"         && !t.overdueBy.toLowerCase().includes("overdue")) return false;
//       if(applied.viewType==="Completed"       && !t.completed)                             return false;
//       if(applied.viewType==="Upcoming"        && t.overdueBy.toLowerCase().includes("overdue"))  return false;
//       return true;
//     })
//   ,[tasks,search,applied]);

//   /* summary */
//   const summary = useMemo(()=>({
//     total:    tasks.length,
//     overdue:  tasks.filter(t=>t.overdueBy.toLowerCase().includes("overdue")).length,
//     dueToday: tasks.filter(t=>t.dueDate==="Jun 22, 2026").length,
//     urgent:   tasks.filter(t=>{ const d=new Date(t.dueDate); const n=new Date(); return (d-n)/(1000*60*60*24)<=3&&(d-n)>0; }).length,
//     upcoming: tasks.filter(t=>t.overdueBy==="Upcoming").length,
//     highPri:  tasks.filter(t=>t.priority==="High").length,
//   }),[tasks]);

//   /* pagination */
//   const pp         = Number(showEntries);
//   const totalPages = Math.max(1,Math.ceil(filtered.length/pp));
//   const pageData   = filtered.slice((page-1)*pp, page*pp);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100"
//       style={{fontFamily:"'Plus Jakarta Sans', system-ui, sans-serif"}}>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
//         @keyframes slideIn { from{transform:translateX(110%);opacity:0} to{transform:translateX(0);opacity:1} }
//         @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
//         .fade-up { animation: fadeUp .4s ease both; }
//         select { -webkit-appearance:none; appearance:none; }
//         ::-webkit-scrollbar{width:5px;height:5px}
//         ::-webkit-scrollbar-track{background:#f1f5f9;border-radius:99px}
//         ::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:99px}
//       `}</style>

//       {toast && <Toast msg={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}

//       {/* ── PAGE HEADER ── */}
//       <div className="bg-white/70 backdrop-blur-md border-b border-slate-100">
//         <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-5">
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//             <div className="flex items-center gap-4">
//               <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-amber-200 flex-shrink-0">
//                 <FiClock className="w-5 h-5"/>
//               </div>
//               <div>
//                 <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">Lead Follow-up Report</h1>
//                 <p className="text-sm text-slate-400 mt-0.5">
//                   Track upcoming and overdue follow-ups
//                   <span className="hidden sm:inline ml-3 text-slate-300">|</span>
//                   <span className="hidden sm:inline ml-3 text-xs">
//                     <span className="hover:text-blue-600 cursor-pointer transition-colors" onClick={()=>navigate("/")}>Home</span>
//                     <span className="mx-1 text-slate-300">/</span>
//                     <span className="hover:text-blue-600 cursor-pointer transition-colors" onClick={()=>navigate("/ReportsDashboard")}>Reports</span>
//                     <span className="mx-1 text-slate-300">/</span>
//                     <span className="text-blue-600 font-bold">Follow-up Report</span>
//                   </span>
//                 </p>
//               </div>
//             </div>
//             <button onClick={()=>navigate("/ReportsDashboard")}
//               className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200
//                 hover:border-blue-300 bg-white hover:bg-blue-50 text-slate-600 hover:text-blue-600
//                 text-sm font-bold transition-all shadow-sm">
//               <FiArrowLeft className="w-4 h-4"/> Back to Reports
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6 space-y-5">

//         {/* ── FILTERS & SETTINGS ── */}
//         <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden fade-up">
//           <button type="button" onClick={()=>setFiltersOpen(v=>!v)}
//             className="w-full flex items-center justify-between px-5 py-4 bg-slate-600 hover:bg-slate-700 transition-colors">
//             <div className="flex items-center gap-2.5">
//               <FiFilter className="w-4 h-4 text-white"/>
//               <span className="text-sm font-extrabold text-white">Filters &amp; Settings</span>
//             </div>
//             {filtersOpen
//               ? <FiChevronUp   className="w-4 h-4 text-white"/>
//               : <FiChevronDown className="w-4 h-4 text-white"/>}
//           </button>

//           {filtersOpen && (
//             <div className="p-5 space-y-4">
//               {/* Row: View Type | Days Ahead | Assigned To | Priority | Reminder Type | Apply */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
//                 {[
//                   { label:"View Type",     val:viewType,     set:setViewType,     opts:VIEW_TYPES      },
//                   { label:"Days Ahead",    val:daysAhead,    set:setDaysAhead,    opts:DAYS_AHEAD_OPTS },
//                   { label:"Assigned To",   val:assignedTo,   set:setAssignedTo,   opts:USERS_LIST      },
//                   { label:"Priority",      val:priority,     set:setPriority,     opts:PRIORITY_OPTS   },
//                   { label:"Reminder Type", val:reminderType, set:setReminderType, opts:REMINDER_TYPES  },
//                 ].map(({label,val,set,opts})=>(
//                   <div key={label}>
//                     <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wide mb-1.5">{label}</label>
//                     <div className="relative">
//                       <select value={val} onChange={e=>set(e.target.value)} className={inputCls+" pr-8"}>
//                         {opts.map(o=><option key={o}>{o}</option>)}
//                       </select>
//                       <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none"/>
//                     </div>
//                   </div>
//                 ))}
//                 <button onClick={handleApply}
//                   className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700
//                     text-white text-sm font-bold shadow-md shadow-blue-200 transition-all h-[42px]">
//                   <FiSearch className="w-3.5 h-3.5"/> Apply
//                 </button>
//               </div>

//               {/* Reset + Export */}
//               <div className="flex flex-wrap gap-3">
//                 <button onClick={handleReset}
//                   className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-slate-200 hover:border-slate-300
//                     bg-white hover:bg-slate-50 text-slate-600 text-sm font-bold transition-all">
//                   <FiRefreshCw className="w-3.5 h-3.5"/> Reset
//                 </button>
//                 <button onClick={handleExportCSV}
//                   className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700
//                     text-white text-sm font-bold shadow-md shadow-emerald-200 transition-all">
//                   <FiDownload className="w-3.5 h-3.5"/> Export CSV
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* ── 6 STAT CARDS ── */}
//         <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
//           {[
//             { icon:<FaTasks className="text-2xl"/>,             label:"Total Follow-ups", value:summary.total,    bg:"bg-gradient-to-br from-cyan-500 to-cyan-600",     delay:0   },
//             { icon:<FaExclamationTriangle className="text-2xl"/>,label:"Overdue",          value:summary.overdue,  bg:"bg-gradient-to-br from-red-500 to-red-600",       delay:50  },
//             { icon:<FiCalendar className="text-2xl"/>,           label:"Due Today",        value:summary.dueToday, bg:"bg-gradient-to-br from-amber-500 to-amber-600",   delay:100 },
//             { icon:<span className="text-2xl">⚡</span>,         label:"Urgent (3 days)",  value:summary.urgent,   bg:"bg-gradient-to-br from-blue-600 to-blue-700",     delay:150 },
//             { icon:<FiCalendar className="text-2xl"/>,           label:"Upcoming",         value:summary.upcoming, bg:"bg-gradient-to-br from-green-500 to-emerald-600", delay:200 },
//             { icon:<FaStar className="text-2xl"/>,               label:"High Priority",    value:summary.highPri,  bg:"bg-gradient-to-br from-slate-500 to-slate-600",   delay:250 },
//           ].map(s=><StatCard key={s.label} {...s}/>)}
//         </div>

//         {/* ── FOLLOW-UP TASKS TABLE CARD ── */}
//         <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden fade-up">

//           {/* Card header */}
//           <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
//             <div className="flex items-center gap-3">
//               <MdOutlineAssignment className="w-4 h-4 text-amber-500"/>
//               <h2 className="text-base font-extrabold text-slate-700">Follow-up Tasks</h2>
//               <span className="text-xs font-extrabold bg-blue-600 text-white px-2.5 py-1 rounded-full">
//                 {filtered.length} tasks
//               </span>
//             </div>
//             {/* Bulk Mark Complete */}
//             <button onClick={handleMarkCompleted}
//               className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700
//                 text-white text-xs font-bold shadow-md shadow-blue-200 transition-all">
//               <FiCheck className="w-3.5 h-3.5"/> Mark Selected as Completed
//               {selected.size>0 && <span className="bg-white text-blue-600 text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">{selected.size}</span>}
//             </button>
//           </div>

//           {/* Show N entries + Search */}
//           <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/60">
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
//               <div className="flex items-center gap-2">
//                 <span className="text-xs text-slate-500 font-medium">Show</span>
//                 <div className="relative">
//                   <select value={showEntries} onChange={e=>{ setShowEntries(e.target.value); setPage(1); }}
//                     className="pl-2.5 pr-6 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700 font-bold focus:outline-none appearance-none cursor-pointer">
//                     {SHOW_ENTRIES.map(o=><option key={o}>{o}</option>)}
//                   </select>
//                   <FiChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none"/>
//                 </div>
//                 <span className="text-xs text-slate-500 font-medium">entries</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <span className="text-xs text-slate-500 font-medium">Search:</span>
//                 <div className="relative">
//                   <FiSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400"/>
//                   <input value={search} onChange={e=>{ setSearch(e.target.value); setPage(1); }}
//                     placeholder="Lead name, title, assignee…"
//                     className="pl-7 pr-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700 placeholder-slate-400
//                       focus:border-blue-400 focus:ring-2 focus:ring-blue-50 outline-none transition-all w-52"/>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* ── DESKTOP TABLE ── */}
//           <div className="hidden lg:block overflow-x-auto">
//             <table className="w-full min-w-[1100px]">
//               <thead className="bg-slate-50/80 border-b border-slate-100">
//                 <tr>
//                   {/* Checkbox */}
//                   <th className="px-3 py-3.5 w-10">
//                     <input type="checkbox"
//                       checked={pageData.length>0&&selected.size===pageData.length}
//                       onChange={toggleAll}
//                       className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-400 cursor-pointer"/>
//                   </th>
//                   {["Due Date","Lead Details","Assigned To","Type","Priority","Title & Description","Lead Stage","Actions"].map(h=>(
//                     <th key={h} className="px-3 py-3.5 text-left text-xs font-extrabold text-slate-500 uppercase tracking-wider whitespace-nowrap">
//                       {h}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-50">
//                 {loading
//                   ? [...Array(5)].map((_,i)=><SkeletonRow key={i}/>)
//                   : pageData.length===0
//                   ? (
//                     <tr>
//                       <td colSpan={9} className="text-center py-16">
//                         <div className="text-5xl mb-3">📋</div>
//                         <p className="text-base font-extrabold text-slate-600 mb-1">No Follow-up Tasks Found</p>
//                         <p className="text-sm text-slate-400 mb-4">Try adjusting your filters.</p>
//                         <button onClick={handleReset}
//                           className="px-4 py-2 rounded-xl bg-blue-50 text-blue-600 font-bold text-sm hover:bg-blue-100 transition-all">
//                           Reset Filters
//                         </button>
//                       </td>
//                     </tr>
//                   )
//                   : pageData.map((task,idx)=>{
//                     const tc = TYPE_CFG[task.type]     || { bg:"bg-slate-400", text:"text-white" };
//                     const pc = PRIORITY_CFG[task.priority] || PRIORITY_CFG.Low;
//                     const sc = STAGE_CFG[task.stage]   || { bg:"bg-slate-500", text:"text-white" };
//                     const tm = TEMP_CFG[task.leadTemp] || TEMP_CFG.Fresh;
//                     const isOverdue = task.overdueBy.toLowerCase().includes("overdue");
//                     return (
//                       <tr key={task.id}
//                         className={`group transition-all duration-150 hover:shadow-[inset_3px_0_0_#2563eb]
//                           ${task.completed?"opacity-50":""}
//                           ${isOverdue?"bg-red-50/30 hover:bg-red-50/50":"hover:bg-blue-50/30"}`}
//                         style={{animation:"fadeUp .35s ease both", animationDelay:`${idx*25}ms`}}>
//                         {/* Checkbox */}
//                         <td className="px-3 py-3.5">
//                           <input type="checkbox"
//                             checked={selected.has(task.id)}
//                             onChange={()=>toggleSelect(task.id)}
//                             className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-400 cursor-pointer"/>
//                         </td>
//                         {/* Due Date */}
//                         <td className="px-3 py-3.5 whitespace-nowrap">
//                           <p className={`text-sm font-bold ${isOverdue?"text-red-600":"text-slate-800"}`}>{task.dueDate}</p>
//                           <p className="text-xs text-slate-400 font-mono">{task.dueTime}</p>
//                           <p className={`text-[11px] font-bold mt-0.5 ${isOverdue?"text-red-500":"text-green-600"}`}>{task.overdueBy}</p>
//                         </td>
//                         {/* Lead Details */}
//                         <td className="px-3 py-3.5">
//                           <p className="text-sm font-extrabold text-blue-600 mb-0.5">{task.leadName}</p>
//                           <p className="text-xs text-slate-500 font-mono mb-1">{task.leadPhone}</p>
//                           <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full text-white ${tm.bg}`}>
//                             {tm.label}
//                           </span>
//                         </td>
//                         {/* Assigned To */}
//                         <td className="px-3 py-3.5">
//                           <p className="text-sm font-semibold text-slate-800 capitalize">{task.assignedTo}</p>
//                           <p className="text-xs text-slate-400">{task.assignedUsername}</p>
//                         </td>
//                         {/* Type */}
//                         <td className="px-3 py-3.5">
//                           <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${tc.bg} ${tc.text}`}>
//                             {task.type}
//                           </span>
//                         </td>
//                         {/* Priority */}
//                         <td className="px-3 py-3.5">
//                           <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${pc.border} ${pc.bg} ${pc.text}`}>
//                             {task.priority}
//                           </span>
//                         </td>
//                         {/* Title & Description */}
//                         <td className="px-3 py-3.5 max-w-xs">
//                           <p className="text-sm font-bold text-slate-800 mb-0.5 leading-snug">{task.title}</p>
//                           <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{task.desc}</p>
//                         </td>
//                         {/* Lead Stage */}
//                         <td className="px-3 py-3.5">
//                           <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${sc.bg} ${sc.text} block mb-1 text-center`}>
//                             {task.stage}
//                           </span>
//                           <p className="text-[11px] text-slate-400 text-center">Travel: {task.travelDate}</p>
//                         </td>
//                         {/* Actions */}
//                         <td className="px-3 py-3.5">
//                           <div className="flex flex-col gap-1.5">
//                             <button onClick={()=>handleComplete(task.id)} title="Mark Complete" disabled={task.completed}
//                               className="w-8 h-8 rounded-lg bg-green-50 hover:bg-green-100 border border-green-200 text-green-600
//                                 flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed">
//                               <FiCheck className="w-3.5 h-3.5"/>
//                             </button>
//                             <button title="View Info"
//                               className="w-8 h-8 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-600
//                                 flex items-center justify-center transition-all">
//                               <FiInfo className="w-3.5 h-3.5"/>
//                             </button>
//                             <button title="View Lead"
//                               className="w-8 h-8 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-600
//                                 flex items-center justify-center transition-all">
//                               <FiEye className="w-3.5 h-3.5"/>
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     );
//                   })}
//               </tbody>
//             </table>
//           </div>

//           {/* ── MOBILE CARDS ── */}
//           <div className="lg:hidden p-4 space-y-3">
//             {loading
//               ? [...Array(4)].map((_,i)=>(
//                   <div key={i} className="bg-white rounded-2xl border border-slate-100 p-4 space-y-2 animate-pulse">
//                     {[...Array(3)].map((_,j)=><div key={j} className="h-4 bg-slate-200 rounded-lg" style={{width:`${40+Math.random()*50}%`}}/>)}
//                   </div>
//                 ))
//               : pageData.length===0
//               ? (
//                 <div className="text-center py-12">
//                   <div className="text-5xl mb-3">📋</div>
//                   <p className="font-extrabold text-slate-600 mb-2">No Tasks Found</p>
//                   <button onClick={handleReset} className="px-4 py-2 rounded-xl bg-blue-50 text-blue-600 font-bold text-sm">Reset</button>
//                 </div>
//               )
//               : pageData.map((task,idx)=>{
//                 const tc = TYPE_CFG[task.type]     || { bg:"bg-slate-400", text:"text-white" };
//                 const pc = PRIORITY_CFG[task.priority] || PRIORITY_CFG.Low;
//                 const sc = STAGE_CFG[task.stage]   || { bg:"bg-slate-500", text:"text-white" };
//                 const tm = TEMP_CFG[task.leadTemp] || TEMP_CFG.Fresh;
//                 const isOverdue = task.overdueBy.toLowerCase().includes("overdue");
//                 return (
//                   <div key={task.id}
//                     className={`rounded-2xl border shadow-sm p-4 space-y-3 fade-up
//                       ${isOverdue?"bg-red-50/50 border-red-200":"bg-white border-slate-100"}`}
//                     style={{animationDelay:`${idx*40}ms`}}>
//                     {/* Header */}
//                     <div className="flex items-start justify-between gap-3">
//                       <div className="flex items-center gap-2">
//                         <input type="checkbox" checked={selected.has(task.id)} onChange={()=>toggleSelect(task.id)}
//                           className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer"/>
//                         <div>
//                           <p className="text-sm font-extrabold text-blue-600">{task.leadName}</p>
//                           <p className="text-xs text-slate-400 font-mono">{task.leadPhone}</p>
//                         </div>
//                       </div>
//                       <div className="flex items-center gap-1.5 flex-shrink-0">
//                         <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full text-white ${tm.bg}`}>{tm.label}</span>
//                         <span className={`text-xs font-bold px-2 py-0.5 rounded-lg border ${pc.border} ${pc.bg} ${pc.text}`}>{task.priority}</span>
//                       </div>
//                     </div>
//                     {/* Due date + overdue */}
//                     <div className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg ${isOverdue?"bg-red-100 text-red-700":"bg-green-50 text-green-700"}`}>
//                       <FiClock className="w-3 h-3 flex-shrink-0"/>
//                       <span className="font-bold">{task.dueDate} {task.dueTime}</span>
//                       <span className="ml-auto font-extrabold">{task.overdueBy}</span>
//                     </div>
//                     {/* Title + desc */}
//                     <div>
//                       <p className="text-sm font-bold text-slate-800 mb-0.5">{task.title}</p>
//                       <p className="text-xs text-slate-500 line-clamp-2">{task.desc}</p>
//                     </div>
//                     {/* Badges row */}
//                     <div className="flex items-center gap-2 flex-wrap">
//                       <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${tc.bg} ${tc.text}`}>{task.type}</span>
//                       <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${sc.bg} ${sc.text}`}>{task.stage}</span>
//                       <span className="text-xs text-slate-400">Travel: {task.travelDate}</span>
//                     </div>
//                     {/* Assigned + actions */}
//                     <div className="flex items-center justify-between pt-2 border-t border-slate-100">
//                       <div>
//                         <p className="text-xs font-bold text-slate-700 capitalize">{task.assignedTo}</p>
//                         <p className="text-[11px] text-slate-400">{task.assignedUsername}</p>
//                       </div>
//                       <div className="flex gap-1.5">
//                         <button onClick={()=>handleComplete(task.id)} disabled={task.completed}
//                           className="w-8 h-8 rounded-lg bg-green-50 border border-green-200 text-green-600 flex items-center justify-center disabled:opacity-40">
//                           <FiCheck className="w-3 h-3"/>
//                         </button>
//                         <button className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center">
//                           <FiInfo className="w-3 h-3"/>
//                         </button>
//                         <button className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center">
//                           <FiEye className="w-3 h-3"/>
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//           </div>

//           {/* ── PAGINATION ── */}
//           {filtered.length > 0 && (
//             <div className="px-5 py-4 border-t border-slate-100 bg-slate-50/60 flex flex-col sm:flex-row items-center justify-between gap-3">
//               <p className="text-xs text-slate-400 font-medium">
//                 Showing <span className="font-bold text-slate-600">{(page-1)*pp+1}</span> to{" "}
//                 <span className="font-bold text-slate-600">{Math.min(page*pp,filtered.length)}</span> of{" "}
//                 <span className="font-bold text-slate-600">{filtered.length}</span> entries
//               </p>
//               <div className="flex items-center gap-2">
//                 <button disabled={page===1} onClick={()=>setPage(1)}
//                   className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-500 hover:border-blue-300 hover:text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
//                   <FaAngleDoubleLeft className="inline"/>
//                 </button>
//                 <button disabled={page===1} onClick={()=>setPage(p=>p-1)}
//                   className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-500 hover:border-blue-300 hover:text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1">
//                   <FiChevronLeft className="w-3 h-3"/> Previous
//                 </button>
//                 {Array.from({length:totalPages},(_,i)=>i+1)
//                   .filter(p=>p===1||p===totalPages||Math.abs(p-page)<=1)
//                   .reduce((acc,p,i,arr)=>{ if(i>0&&p-arr[i-1]>1) acc.push("…"); acc.push(p); return acc; },[])
//                   .map((p,i)=>
//                     typeof p==="string"
//                       ? <span key={`e${i}`} className="px-1 text-xs text-slate-400">…</span>
//                       : <button key={p} onClick={()=>setPage(p)}
//                           className={`w-8 h-8 rounded-lg text-xs font-bold border transition-all
//                             ${page===p?"bg-blue-600 border-blue-600 text-white shadow-sm":"bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600"}`}>
//                           {p}
//                         </button>
//                   )}
//                 <button disabled={page===totalPages} onClick={()=>setPage(p=>p+1)}
//                   className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-500 hover:border-blue-300 hover:text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1">
//                   Next <FiChevronRight className="w-3 h-3"/>
//                 </button>
//                 <button disabled={page===totalPages} onClick={()=>setPage(totalPages)}
//                   className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-500 hover:border-blue-300 hover:text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
//                   <FaAngleDoubleRight className="inline"/>
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>

//       </div>
//     </div>
//   );
// }


// // src/components/Reports/FollowupReports.jsx
// // ─────────────────────────────────────────────────────────────
// // Lead Follow-up Report Page — Travel CRM
// // Matches CRM design system perfectly
// // Reference: company/reports/lead_followup.php screenshot
// // Features:
// //   - Collapsible Filters & Settings (dark slate header)
// //   - View Type / Days Ahead / Assigned To / Priority / Reminder Type / Apply
// //   - Reset + Export CSV buttons
// //   - 6 stat cards: Total, Overdue, Due Today, Urgent(3days), Upcoming, High Priority
// //   - Follow-up Tasks table:
// //       Checkbox | Due Date | Lead Details | Assigned To | Type | Priority | Title & Description | Lead Stage | Actions
// //   - Bulk "Mark Selected as Completed" button
// //   - Row checkboxes for bulk select
// //   - Color-coded hot/fresh badges on lead phone number
// //   - Action buttons: ✓ Complete | ℹ Info | 👁 View
// //   - Show N entries + Search + Pagination
// //   - Desktop table + Mobile cards (responsive)
// //   - Skeleton loading + Toast
// // ─────────────────────────────────────────────────────────────

// import { useState, useMemo, useEffect, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   FiFilter, FiRefreshCw, FiDownload, FiArrowLeft,
//   FiChevronDown, FiChevronUp, FiSearch,
//   FiChevronLeft, FiChevronRight, FiEye, FiInfo,
//   FiCheck, FiClock, FiAlertTriangle, FiCalendar,
// } from "react-icons/fi";
// import {
//   FaAngleDoubleLeft, FaAngleDoubleRight,
//   FaFire, FaLeaf, FaSnowflake, FaExclamationTriangle,
//   FaTasks, FaStar,
// } from "react-icons/fa";
// import { MdOutlineAssignment } from "react-icons/md";

// import followupReportService from "../services/followupReportService";

// const VIEW_TYPES      = ["All","Upcoming","Overdue","Due Today","Completed"];
// const DAYS_AHEAD_OPTS = ["1 day","3 days","7 days","14 days","30 days","All"];
// const PRIORITY_OPTS   = ["All Priorities","High","Medium","Low"];
// const REMINDER_TYPES  = ["All Types","First Contact","Follow Up","Payment Reminder","Document Collection","Booking Confirmation","Custom"];
// const SHOW_ENTRIES    = ["10","25","50","100"];

// const PRIORITY_CFG = {
//   High:   { bg:"bg-red-100",    text:"text-red-700",    border:"border-red-200"   },
//   Medium: { bg:"bg-amber-100",  text:"text-amber-700",  border:"border-amber-200" },
//   Low:    { bg:"bg-slate-100",  text:"text-slate-500",  border:"border-slate-200" },
// };
// const TYPE_CFG = {
//   "First Contact":          { bg:"bg-green-500",  text:"text-white" },
//   "Follow Up":              { bg:"bg-blue-500",   text:"text-white" },
//   "Payment Reminder":       { bg:"bg-amber-500",  text:"text-white" },
//   "Document Collection":    { bg:"bg-purple-500", text:"text-white" },
//   "Booking Confirmation":   { bg:"bg-teal-500",   text:"text-white" },
//   "Custom":                 { bg:"bg-slate-500",  text:"text-white" },
// };
// const STAGE_CFG = {
//   "Ready to Book":  { bg:"bg-blue-600",    text:"text-white" },
//   "New Lead":       { bg:"bg-slate-600",   text:"text-white" },
//   "Contacted":      { bg:"bg-cyan-600",    text:"text-white" },
//   "Qualified":      { bg:"bg-indigo-600",  text:"text-white" },
//   "Proposal Sent":  { bg:"bg-purple-600",  text:"text-white" },
//   "Converted":      { bg:"bg-green-600",   text:"text-white" },
//   "Lost":           { bg:"bg-red-600",     text:"text-white" },
// };
// const TEMP_CFG = {
//   Hot:   { bg:"bg-red-500",   label:"Hot"  },
//   Warm:  { bg:"bg-amber-500", label:"Warm" },
//   Cold:  { bg:"bg-blue-400",  label:"Cold" },
//   Fresh: { bg:"bg-blue-500",  label:"Fresh"},
// };

// /* ─── TOAST ──────────────────────────────────────────────────── */
// function Toast({ msg, type, onClose }) {
//   useEffect(()=>{ const t=setTimeout(onClose,3500); return()=>clearTimeout(t); },[onClose]);
//   return (
//     <div className={`fixed top-5 right-5 z-[999] flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl max-w-xs
//       ${type==="success"?"bg-green-50 border-green-200 text-green-800":"bg-red-50 border-red-200 text-red-800"}`}
//       style={{animation:"slideIn .3s ease both"}}>
//       <span className="text-lg">{type==="success"?"✅":"❌"}</span>
//       <p className="text-sm font-semibold flex-1">{msg}</p>
//       <button onClick={onClose} className="opacity-50 hover:opacity-100 text-lg ml-1">×</button>
//     </div>
//   );
// }

// /* ─── STAT CARD ──────────────────────────────────────────────── */
// function StatCard({ icon, label, value, bg, delay=0 }) {
//   const [disp, setDisp] = useState(0);
//   useEffect(()=>{
//     if(!value){ setDisp(0); return; }
//     let s=0; const step=Math.max(1,Math.ceil(value/40));
//     const iv=setInterval(()=>{ s=Math.min(s+step,value); setDisp(s); if(s>=value)clearInterval(iv); },16);
//     return()=>clearInterval(iv);
//   },[value]);
//   return (
//     <div className={`${bg} rounded-2xl p-5 text-white shadow-lg relative overflow-hidden group
//       hover:-translate-y-1 hover:shadow-xl transition-all duration-300`}
//       style={{animation:"fadeUp .4s ease both", animationDelay:`${delay}ms`}}>
//       <div className="absolute -right-5 -top-5 w-20 h-20 rounded-full bg-white/10 group-hover:scale-110 transition-transform"/>
//       <div className="absolute -right-2 -bottom-6 w-28 h-28 rounded-full bg-white/10"/>
//       <div className="relative z-10 flex items-center justify-between">
//         <div>
//           <p className="text-3xl font-extrabold leading-none mb-1">{disp}</p>
//           <p className="text-xs font-bold uppercase tracking-widest opacity-85">{label}</p>
//         </div>
//         <div className="w-12 h-12 rounded-2xl bg-white/20 group-hover:bg-white/30 flex items-center justify-center text-2xl transition-all">
//           {icon}
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ─── SKELETON ROW ───────────────────────────────────────────── */
// function SkeletonRow() {
//   return (
//     <tr>
//       {[...Array(8)].map((_,i)=>(
//         <td key={i} className="px-3 py-4">
//           <div className="h-4 rounded-lg bg-slate-200 animate-pulse" style={{width:`${30+Math.random()*55}%`}}/>
//         </td>
//       ))}
//     </tr>
//   );
// }

// const inputCls = "w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 font-medium focus:border-blue-400 focus:ring-2 focus:ring-blue-50 outline-none appearance-none cursor-pointer transition-all hover:border-slate-300";

// /* ─── MAIN PAGE ──────────────────────────────────────────────── */
// export default function FollowupReports() {
//   const navigate = useNavigate();

//   /* filter state */
//   const [viewType,     setViewType]     = useState("All");
//   const [daysAhead,    setDaysAhead]    = useState("7 days");
//   const [assignedTo,   setAssignedTo]   = useState("All Users");
//   const [priority,     setPriority]     = useState("All Priorities");
//   const [reminderType, setReminderType] = useState("All Types");
//   const [filtersOpen,  setFiltersOpen]  = useState(true);
//   const [search,       setSearch]       = useState("");
//   const [showEntries,  setShowEntries]  = useState("25");
//   const [page,         setPage]         = useState(1);
//   const [applied,      setApplied]      = useState({ viewType:"All", daysAhead:"7 days", assignedTo:"All Users", priority:"All Priorities", reminderType:"All Types" });

//   /* data + selection state */
//   const [tasks,       setTasks]       = useState([]);
//   const [summaryData, setSummaryData] = useState(null);
//   const [loading,     setLoading]     = useState(true);
//   const [toast,       setToast]       = useState(null);
//   const [selected,    setSelected]    = useState(new Set());

//   const showToast = useCallback((msg, type="success")=>setToast({msg,type}),[]);

//   useEffect(()=>{
//     let alive = true;
//     setLoading(true);
//     // viewType + daysAhead are date filters the backend applies; assignee/priority/type/search stay client-side.
//     Promise.all([
//       followupReportService.getTasks({ viewType: applied.viewType, daysAhead: applied.daysAhead, perPage: 1000, page: 1 }),
//       followupReportService.getSummary({ priority: applied.priority, reminderType: applied.reminderType }),
//     ])
//       .then(([tasksRes, summaryRes])=>{
//         if(!alive) return;
//         setTasks(tasksRes.data?.tasks || []);
//         setSummaryData(summaryRes.data || null);
//       })
//       .catch(()=>{
//         if(!alive) return;
//         setTasks([]); setSummaryData(null);
//         showToast("Failed to load follow-up tasks.", "error");
//       })
//       .finally(()=>{ if(alive) setLoading(false); });
//     return ()=>{ alive = false; };
//   },[applied, showToast]);

//   /* apply / reset */
//   const handleApply = () => {
//     setApplied({ viewType, daysAhead, assignedTo, priority, reminderType });
//     setPage(1); setSelected(new Set());
//     showToast("Filters applied.");
//   };
//   const handleReset = () => {
//     setViewType("All"); setDaysAhead("7 days");
//     setAssignedTo("All Users"); setPriority("All Priorities"); setReminderType("All Types");
//     setApplied({ viewType:"All", daysAhead:"7 days", assignedTo:"All Users", priority:"All Priorities", reminderType:"All Types" });
//     setSearch(""); setPage(1); setSelected(new Set());
//     showToast("Filters reset.");
//   };

//   /* export CSV — server-side, honours the applied filters + search */
//   const handleExportCSV = async () => {
//     try {
//       const res = await followupReportService.exportCsv({
//         viewType:     applied.viewType,
//         daysAhead:    applied.daysAhead,
//         priority:     applied.priority,
//         reminderType: applied.reminderType,
//         search,
//       });
//       const url = window.URL.createObjectURL(new Blob([res.data]));
//       const a   = document.createElement("a");
//       a.href    = url;
//       a.download = "followup-report.csv";
//       document.body.appendChild(a);
//       a.click();
//       a.remove();
//       window.URL.revokeObjectURL(url);
//       showToast("CSV exported successfully.");
//     } catch {
//       showToast("Export failed. Try again.", "error");
//     }
//   };

//   /* bulk complete — keyed by publicId */
//   const handleMarkCompleted = async () => {
//     if(selected.size===0){ showToast("Select at least one task.","error"); return; }
//     const ids = [...selected];
//     try {
//       await followupReportService.bulkComplete(ids);
//       setTasks(prev=>prev.map(t=>selected.has(t.publicId)?{...t,completed:true}:t));
//       showToast(`${ids.length} task${ids.length>1?"s":""} marked as completed.`);
//       setSelected(new Set());
//     } catch {
//       showToast("Bulk complete failed. Try again.", "error");
//     }
//   };

//   /* single complete — keyed by publicId */
//   const handleComplete = async (publicId) => {
//     try {
//       await followupReportService.markComplete(publicId);
//       setTasks(prev=>prev.map(t=>t.publicId===publicId?{...t,completed:true}:t));
//       showToast("Task marked as completed.");
//     } catch {
//       showToast("Failed to complete task.", "error");
//     }
//   };

//   /* checkbox logic — selection holds publicId */
//   const toggleSelect = (publicId) => {
//     setSelected(prev=>{ const n=new Set(prev); n.has(publicId)?n.delete(publicId):n.add(publicId); return n; });
//   };
//   const toggleAll = () => {
//     if(selected.size===pageData.length) setSelected(new Set());
//     else setSelected(new Set(pageData.map(t=>t.publicId)));
//   };

//   /* filtered */
//   const filtered = useMemo(()=>
//     tasks.filter(t=>{
//       const q = search.toLowerCase();
//       if(q && !t.leadName.toLowerCase().includes(q) && !t.title.toLowerCase().includes(q) && !t.assignedTo.toLowerCase().includes(q)) return false;
//       if(applied.assignedTo!=="All Users"     && t.assignedTo!==applied.assignedTo)       return false;
//       if(applied.priority!=="All Priorities"  && t.priority!==applied.priority)           return false;
//       if(applied.reminderType!=="All Types"   && t.type!==applied.reminderType)           return false;
//       if(applied.viewType==="Overdue"         && !t.overdueBy.toLowerCase().includes("overdue")) return false;
//       if(applied.viewType==="Completed"       && !t.completed)                             return false;
//       if(applied.viewType==="Upcoming"        && t.overdueBy.toLowerCase().includes("overdue"))  return false;
//       return true;
//     })
//   ,[tasks,search,applied]);

//   /* summary — from the backend summary endpoint */
//   const summary = {
//     total:    summaryData?.totalFollowups ?? 0,
//     overdue:  summaryData?.overdue        ?? 0,
//     dueToday: summaryData?.dueToday       ?? 0,
//     urgent:   summaryData?.urgent         ?? 0,
//     upcoming: summaryData?.upcoming       ?? 0,
//     highPri:  summaryData?.highPriority   ?? 0,
//   };

//   /* assignee dropdown options — derived from the loaded tasks (real data, not hardcoded) */
//   const userOptions = useMemo(
//     () => ["All Users", ...Array.from(new Set(tasks.map(t=>t.assignedTo).filter(Boolean)))],
//     [tasks]
//   );

//   /* pagination */
//   const pp         = Number(showEntries);
//   const totalPages = Math.max(1,Math.ceil(filtered.length/pp));
//   const pageData   = filtered.slice((page-1)*pp, page*pp);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100"
//       style={{fontFamily:"'Plus Jakarta Sans', system-ui, sans-serif"}}>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
//         @keyframes slideIn { from{transform:translateX(110%);opacity:0} to{transform:translateX(0);opacity:1} }
//         @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
//         .fade-up { animation: fadeUp .4s ease both; }
//         select { -webkit-appearance:none; appearance:none; }
//         ::-webkit-scrollbar{width:5px;height:5px}
//         ::-webkit-scrollbar-track{background:#f1f5f9;border-radius:99px}
//         ::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:99px}
//       `}</style>

//       {toast && <Toast msg={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}

//       {/* ── PAGE HEADER ── */}
//       <div className="bg-white/70 backdrop-blur-md border-b border-slate-100">
//         <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-5">
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//             <div className="flex items-center gap-4">
//               <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-amber-200 flex-shrink-0">
//                 <FiClock className="w-5 h-5"/>
//               </div>
//               <div>
//                 <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">Lead Follow-up Report</h1>
//                 <p className="text-sm text-slate-400 mt-0.5">
//                   Track upcoming and overdue follow-ups
//                   <span className="hidden sm:inline ml-3 text-slate-300">|</span>
//                   <span className="hidden sm:inline ml-3 text-xs">
//                     <span className="hover:text-blue-600 cursor-pointer transition-colors" onClick={()=>navigate("/")}>Home</span>
//                     <span className="mx-1 text-slate-300">/</span>
//                     <span className="hover:text-blue-600 cursor-pointer transition-colors" onClick={()=>navigate("/ReportsDashboard")}>Reports</span>
//                     <span className="mx-1 text-slate-300">/</span>
//                     <span className="text-blue-600 font-bold">Follow-up Report</span>
//                   </span>
//                 </p>
//               </div>
//             </div>
//             <button onClick={()=>navigate("/ReportsDashboard")}
//               className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200
//                 hover:border-blue-300 bg-white hover:bg-blue-50 text-slate-600 hover:text-blue-600
//                 text-sm font-bold transition-all shadow-sm">
//               <FiArrowLeft className="w-4 h-4"/> Back to Reports
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6 space-y-5">

//         {/* ── FILTERS & SETTINGS ── */}
//         <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden fade-up">
//           <button type="button" onClick={()=>setFiltersOpen(v=>!v)}
//             className="w-full flex items-center justify-between px-5 py-4 bg-slate-600 hover:bg-slate-700 transition-colors">
//             <div className="flex items-center gap-2.5">
//               <FiFilter className="w-4 h-4 text-white"/>
//               <span className="text-sm font-extrabold text-white">Filters &amp; Settings</span>
//             </div>
//             {filtersOpen
//               ? <FiChevronUp   className="w-4 h-4 text-white"/>
//               : <FiChevronDown className="w-4 h-4 text-white"/>}
//           </button>

//           {filtersOpen && (
//             <div className="p-5 space-y-4">
//               {/* Row: View Type | Days Ahead | Assigned To | Priority | Reminder Type | Apply */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
//                 {[
//                   { label:"View Type",     val:viewType,     set:setViewType,     opts:VIEW_TYPES      },
//                   { label:"Days Ahead",    val:daysAhead,    set:setDaysAhead,    opts:DAYS_AHEAD_OPTS },
//                   { label:"Assigned To",   val:assignedTo,   set:setAssignedTo,   opts:userOptions     },
//                   { label:"Priority",      val:priority,     set:setPriority,     opts:PRIORITY_OPTS   },
//                   { label:"Reminder Type", val:reminderType, set:setReminderType, opts:REMINDER_TYPES  },
//                 ].map(({label,val,set,opts})=>(
//                   <div key={label}>
//                     <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wide mb-1.5">{label}</label>
//                     <div className="relative">
//                       <select value={val} onChange={e=>set(e.target.value)} className={inputCls+" pr-8"}>
//                         {opts.map(o=><option key={o}>{o}</option>)}
//                       </select>
//                       <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none"/>
//                     </div>
//                   </div>
//                 ))}
//                 <button onClick={handleApply}
//                   className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700
//                     text-white text-sm font-bold shadow-md shadow-blue-200 transition-all h-[42px]">
//                   <FiSearch className="w-3.5 h-3.5"/> Apply
//                 </button>
//               </div>

//               {/* Reset + Export */}
//               <div className="flex flex-wrap gap-3">
//                 <button onClick={handleReset}
//                   className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-slate-200 hover:border-slate-300
//                     bg-white hover:bg-slate-50 text-slate-600 text-sm font-bold transition-all">
//                   <FiRefreshCw className="w-3.5 h-3.5"/> Reset
//                 </button>
//                 <button onClick={handleExportCSV}
//                   className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700
//                     text-white text-sm font-bold shadow-md shadow-emerald-200 transition-all">
//                   <FiDownload className="w-3.5 h-3.5"/> Export CSV
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* ── 6 STAT CARDS ── */}
//         <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
//           {[
//             { icon:<FaTasks className="text-2xl"/>,             label:"Total Follow-ups", value:summary.total,    bg:"bg-gradient-to-br from-cyan-500 to-cyan-600",     delay:0   },
//             { icon:<FaExclamationTriangle className="text-2xl"/>,label:"Overdue",          value:summary.overdue,  bg:"bg-gradient-to-br from-red-500 to-red-600",       delay:50  },
//             { icon:<FiCalendar className="text-2xl"/>,           label:"Due Today",        value:summary.dueToday, bg:"bg-gradient-to-br from-amber-500 to-amber-600",   delay:100 },
//             { icon:<span className="text-2xl">⚡</span>,         label:"Urgent (3 days)",  value:summary.urgent,   bg:"bg-gradient-to-br from-blue-600 to-blue-700",     delay:150 },
//             { icon:<FiCalendar className="text-2xl"/>,           label:"Upcoming",         value:summary.upcoming, bg:"bg-gradient-to-br from-green-500 to-emerald-600", delay:200 },
//             { icon:<FaStar className="text-2xl"/>,               label:"High Priority",    value:summary.highPri,  bg:"bg-gradient-to-br from-slate-500 to-slate-600",   delay:250 },
//           ].map(s=><StatCard key={s.label} {...s}/>)}
//         </div>

//         {/* ── FOLLOW-UP TASKS TABLE CARD ── */}
//         <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden fade-up">

//           {/* Card header */}
//           <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
//             <div className="flex items-center gap-3">
//               <MdOutlineAssignment className="w-4 h-4 text-amber-500"/>
//               <h2 className="text-base font-extrabold text-slate-700">Follow-up Tasks</h2>
//               <span className="text-xs font-extrabold bg-blue-600 text-white px-2.5 py-1 rounded-full">
//                 {filtered.length} tasks
//               </span>
//             </div>
//             {/* Bulk Mark Complete */}
//             <button onClick={handleMarkCompleted}
//               className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700
//                 text-white text-xs font-bold shadow-md shadow-blue-200 transition-all">
//               <FiCheck className="w-3.5 h-3.5"/> Mark Selected as Completed
//               {selected.size>0 && <span className="bg-white text-blue-600 text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">{selected.size}</span>}
//             </button>
//           </div>

//           {/* Show N entries + Search */}
//           <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/60">
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
//               <div className="flex items-center gap-2">
//                 <span className="text-xs text-slate-500 font-medium">Show</span>
//                 <div className="relative">
//                   <select value={showEntries} onChange={e=>{ setShowEntries(e.target.value); setPage(1); }}
//                     className="pl-2.5 pr-6 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700 font-bold focus:outline-none appearance-none cursor-pointer">
//                     {SHOW_ENTRIES.map(o=><option key={o}>{o}</option>)}
//                   </select>
//                   <FiChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none"/>
//                 </div>
//                 <span className="text-xs text-slate-500 font-medium">entries</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <span className="text-xs text-slate-500 font-medium">Search:</span>
//                 <div className="relative">
//                   <FiSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400"/>
//                   <input value={search} onChange={e=>{ setSearch(e.target.value); setPage(1); }}
//                     placeholder="Lead name, title, assignee…"
//                     className="pl-7 pr-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700 placeholder-slate-400
//                       focus:border-blue-400 focus:ring-2 focus:ring-blue-50 outline-none transition-all w-52"/>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* ── DESKTOP TABLE ── */}
//           <div className="hidden lg:block overflow-x-auto">
//             <table className="w-full min-w-[1100px]">
//               <thead className="bg-slate-50/80 border-b border-slate-100">
//                 <tr>
//                   {/* Checkbox */}
//                   <th className="px-3 py-3.5 w-10">
//                     <input type="checkbox"
//                       checked={pageData.length>0&&selected.size===pageData.length}
//                       onChange={toggleAll}
//                       className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-400 cursor-pointer"/>
//                   </th>
//                   {["Due Date","Lead Details","Assigned To","Type","Priority","Title & Description","Lead Stage","Actions"].map(h=>(
//                     <th key={h} className="px-3 py-3.5 text-left text-xs font-extrabold text-slate-500 uppercase tracking-wider whitespace-nowrap">
//                       {h}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-50">
//                 {loading
//                   ? [...Array(5)].map((_,i)=><SkeletonRow key={i}/>)
//                   : pageData.length===0
//                   ? (
//                     <tr>
//                       <td colSpan={9} className="text-center py-16">
//                         <div className="text-5xl mb-3">📋</div>
//                         <p className="text-base font-extrabold text-slate-600 mb-1">No Follow-up Tasks Found</p>
//                         <p className="text-sm text-slate-400 mb-4">Try adjusting your filters.</p>
//                         <button onClick={handleReset}
//                           className="px-4 py-2 rounded-xl bg-blue-50 text-blue-600 font-bold text-sm hover:bg-blue-100 transition-all">
//                           Reset Filters
//                         </button>
//                       </td>
//                     </tr>
//                   )
//                   : pageData.map((task,idx)=>{
//                     const tc = TYPE_CFG[task.type]     || { bg:"bg-slate-400", text:"text-white" };
//                     const pc = PRIORITY_CFG[task.priority] || PRIORITY_CFG.Low;
//                     const sc = STAGE_CFG[task.stage]   || { bg:"bg-slate-500", text:"text-white" };
//                     const tm = TEMP_CFG[task.leadTemp] || TEMP_CFG.Fresh;
//                     const isOverdue = task.overdueBy.toLowerCase().includes("overdue");
//                     return (
//                       <tr key={task.publicId}
//                         className={`group transition-all duration-150 hover:shadow-[inset_3px_0_0_#2563eb]
//                           ${task.completed?"opacity-50":""}
//                           ${isOverdue?"bg-red-50/30 hover:bg-red-50/50":"hover:bg-blue-50/30"}`}
//                         style={{animation:"fadeUp .35s ease both", animationDelay:`${idx*25}ms`}}>
//                         {/* Checkbox */}
//                         <td className="px-3 py-3.5">
//                           <input type="checkbox"
//                             checked={selected.has(task.publicId)}
//                             onChange={()=>toggleSelect(task.publicId)}
//                             className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-400 cursor-pointer"/>
//                         </td>
//                         {/* Due Date */}
//                         <td className="px-3 py-3.5 whitespace-nowrap">
//                           <p className={`text-sm font-bold ${isOverdue?"text-red-600":"text-slate-800"}`}>{task.dueDate}</p>
//                           <p className="text-xs text-slate-400 font-mono">{task.dueTime}</p>
//                           <p className={`text-[11px] font-bold mt-0.5 ${isOverdue?"text-red-500":"text-green-600"}`}>{task.overdueBy}</p>
//                         </td>
//                         {/* Lead Details */}
//                         <td className="px-3 py-3.5">
//                           <p className="text-sm font-extrabold text-blue-600 mb-0.5">{task.leadName}</p>
//                           <p className="text-xs text-slate-500 font-mono mb-1">{task.leadPhone}</p>
//                           <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full text-white ${tm.bg}`}>
//                             {tm.label}
//                           </span>
//                         </td>
//                         {/* Assigned To */}
//                         <td className="px-3 py-3.5">
//                           <p className="text-sm font-semibold text-slate-800 capitalize">{task.assignedTo}</p>
//                           <p className="text-xs text-slate-400">{task.assignedUsername}</p>
//                         </td>
//                         {/* Type */}
//                         <td className="px-3 py-3.5">
//                           <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${tc.bg} ${tc.text}`}>
//                             {task.type}
//                           </span>
//                         </td>
//                         {/* Priority */}
//                         <td className="px-3 py-3.5">
//                           <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${pc.border} ${pc.bg} ${pc.text}`}>
//                             {task.priority}
//                           </span>
//                         </td>
//                         {/* Title & Description */}
//                         <td className="px-3 py-3.5 max-w-xs">
//                           <p className="text-sm font-bold text-slate-800 mb-0.5 leading-snug">{task.title}</p>
//                           <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{task.desc}</p>
//                         </td>
//                         {/* Lead Stage */}
//                         <td className="px-3 py-3.5">
//                           <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${sc.bg} ${sc.text} block mb-1 text-center`}>
//                             {task.stage}
//                           </span>
//                           <p className="text-[11px] text-slate-400 text-center">Travel: {task.travelDate}</p>
//                         </td>
//                         {/* Actions */}
//                         <td className="px-3 py-3.5">
//                           <div className="flex flex-col gap-1.5">
//                             <button onClick={()=>handleComplete(task.publicId)} title="Mark Complete" disabled={task.completed}
//                               className="w-8 h-8 rounded-lg bg-green-50 hover:bg-green-100 border border-green-200 text-green-600
//                                 flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed">
//                               <FiCheck className="w-3.5 h-3.5"/>
//                             </button>
//                             <button title="View Info"
//                               className="w-8 h-8 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-600
//                                 flex items-center justify-center transition-all">
//                               <FiInfo className="w-3.5 h-3.5"/>
//                             </button>
//                             <button title="View Lead"
//                               className="w-8 h-8 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-600
//                                 flex items-center justify-center transition-all">
//                               <FiEye className="w-3.5 h-3.5"/>
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     );
//                   })}
//               </tbody>
//             </table>
//           </div>

//           {/* ── MOBILE CARDS ── */}
//           <div className="lg:hidden p-4 space-y-3">
//             {loading
//               ? [...Array(4)].map((_,i)=>(
//                   <div key={i} className="bg-white rounded-2xl border border-slate-100 p-4 space-y-2 animate-pulse">
//                     {[...Array(3)].map((_,j)=><div key={j} className="h-4 bg-slate-200 rounded-lg" style={{width:`${40+Math.random()*50}%`}}/>)}
//                   </div>
//                 ))
//               : pageData.length===0
//               ? (
//                 <div className="text-center py-12">
//                   <div className="text-5xl mb-3">📋</div>
//                   <p className="font-extrabold text-slate-600 mb-2">No Tasks Found</p>
//                   <button onClick={handleReset} className="px-4 py-2 rounded-xl bg-blue-50 text-blue-600 font-bold text-sm">Reset</button>
//                 </div>
//               )
//               : pageData.map((task,idx)=>{
//                 const tc = TYPE_CFG[task.type]     || { bg:"bg-slate-400", text:"text-white" };
//                 const pc = PRIORITY_CFG[task.priority] || PRIORITY_CFG.Low;
//                 const sc = STAGE_CFG[task.stage]   || { bg:"bg-slate-500", text:"text-white" };
//                 const tm = TEMP_CFG[task.leadTemp] || TEMP_CFG.Fresh;
//                 const isOverdue = task.overdueBy.toLowerCase().includes("overdue");
//                 return (
//                   <div key={task.publicId}
//                     className={`rounded-2xl border shadow-sm p-4 space-y-3 fade-up
//                       ${isOverdue?"bg-red-50/50 border-red-200":"bg-white border-slate-100"}`}
//                     style={{animationDelay:`${idx*40}ms`}}>
//                     {/* Header */}
//                     <div className="flex items-start justify-between gap-3">
//                       <div className="flex items-center gap-2">
//                         <input type="checkbox" checked={selected.has(task.publicId)} onChange={()=>toggleSelect(task.publicId)}
//                           className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer"/>
//                         <div>
//                           <p className="text-sm font-extrabold text-blue-600">{task.leadName}</p>
//                           <p className="text-xs text-slate-400 font-mono">{task.leadPhone}</p>
//                         </div>
//                       </div>
//                       <div className="flex items-center gap-1.5 flex-shrink-0">
//                         <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full text-white ${tm.bg}`}>{tm.label}</span>
//                         <span className={`text-xs font-bold px-2 py-0.5 rounded-lg border ${pc.border} ${pc.bg} ${pc.text}`}>{task.priority}</span>
//                       </div>
//                     </div>
//                     {/* Due date + overdue */}
//                     <div className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg ${isOverdue?"bg-red-100 text-red-700":"bg-green-50 text-green-700"}`}>
//                       <FiClock className="w-3 h-3 flex-shrink-0"/>
//                       <span className="font-bold">{task.dueDate} {task.dueTime}</span>
//                       <span className="ml-auto font-extrabold">{task.overdueBy}</span>
//                     </div>
//                     {/* Title + desc */}
//                     <div>
//                       <p className="text-sm font-bold text-slate-800 mb-0.5">{task.title}</p>
//                       <p className="text-xs text-slate-500 line-clamp-2">{task.desc}</p>
//                     </div>
//                     {/* Badges row */}
//                     <div className="flex items-center gap-2 flex-wrap">
//                       <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${tc.bg} ${tc.text}`}>{task.type}</span>
//                       <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${sc.bg} ${sc.text}`}>{task.stage}</span>
//                       <span className="text-xs text-slate-400">Travel: {task.travelDate}</span>
//                     </div>
//                     {/* Assigned + actions */}
//                     <div className="flex items-center justify-between pt-2 border-t border-slate-100">
//                       <div>
//                         <p className="text-xs font-bold text-slate-700 capitalize">{task.assignedTo}</p>
//                         <p className="text-[11px] text-slate-400">{task.assignedUsername}</p>
//                       </div>
//                       <div className="flex gap-1.5">
//                         <button onClick={()=>handleComplete(task.publicId)} disabled={task.completed}
//                           className="w-8 h-8 rounded-lg bg-green-50 border border-green-200 text-green-600 flex items-center justify-center disabled:opacity-40">
//                           <FiCheck className="w-3 h-3"/>
//                         </button>
//                         <button className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center">
//                           <FiInfo className="w-3 h-3"/>
//                         </button>
//                         <button className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center">
//                           <FiEye className="w-3 h-3"/>
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//           </div>

//           {/* ── PAGINATION ── */}
//           {filtered.length > 0 && (
//             <div className="px-5 py-4 border-t border-slate-100 bg-slate-50/60 flex flex-col sm:flex-row items-center justify-between gap-3">
//               <p className="text-xs text-slate-400 font-medium">
//                 Showing <span className="font-bold text-slate-600">{(page-1)*pp+1}</span> to{" "}
//                 <span className="font-bold text-slate-600">{Math.min(page*pp,filtered.length)}</span> of{" "}
//                 <span className="font-bold text-slate-600">{filtered.length}</span> entries
//               </p>
//               <div className="flex items-center gap-2">
//                 <button disabled={page===1} onClick={()=>setPage(1)}
//                   className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-500 hover:border-blue-300 hover:text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
//                   <FaAngleDoubleLeft className="inline"/>
//                 </button>
//                 <button disabled={page===1} onClick={()=>setPage(p=>p-1)}
//                   className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-500 hover:border-blue-300 hover:text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1">
//                   <FiChevronLeft className="w-3 h-3"/> Previous
//                 </button>
//                 {Array.from({length:totalPages},(_,i)=>i+1)
//                   .filter(p=>p===1||p===totalPages||Math.abs(p-page)<=1)
//                   .reduce((acc,p,i,arr)=>{ if(i>0&&p-arr[i-1]>1) acc.push("…"); acc.push(p); return acc; },[])
//                   .map((p,i)=>
//                     typeof p==="string"
//                       ? <span key={`e${i}`} className="px-1 text-xs text-slate-400">…</span>
//                       : <button key={p} onClick={()=>setPage(p)}
//                           className={`w-8 h-8 rounded-lg text-xs font-bold border transition-all
//                             ${page===p?"bg-blue-600 border-blue-600 text-white shadow-sm":"bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600"}`}>
//                           {p}
//                         </button>
//                   )}
//                 <button disabled={page===totalPages} onClick={()=>setPage(p=>p+1)}
//                   className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-500 hover:border-blue-300 hover:text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1">
//                   Next <FiChevronRight className="w-3 h-3"/>
//                 </button>
//                 <button disabled={page===totalPages} onClick={()=>setPage(totalPages)}
//                   className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-500 hover:border-blue-300 hover:text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
//                   <FaAngleDoubleRight className="inline"/>
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>

//       </div>
//     </div>
//   );
// }

// src/reports/FollowupReports.jsx
// ─────────────────────────────────────────────────────────────
// Lead Follow-up Report — REAL DATA from backend
// Data source: leadService.getAllLeads() → extract reminders from each lead
// Also tries leadService.getReminders() if available
// ViewLead → inline modal (same as AllLeads.jsx)
// InfoModal → shows reminder detail with View Lead / Edit Lead buttons
// ─────────────────────────────────────────────────────────────

import { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiFilter, FiRefreshCw, FiDownload,
  FiChevronDown, FiChevronUp, FiSearch,
  FiChevronLeft, FiChevronRight, FiEye, FiInfo,
  FiCheck, FiClock, FiAlertTriangle, FiCalendar,
  FiUser, FiPhone, FiMail, FiMapPin,
} from "react-icons/fi";
import {
  FaAngleDoubleLeft, FaAngleDoubleRight,
  FaFire, FaLeaf,
  FaTasks, FaStar,
} from "react-icons/fa";
import { MdOutlineAssignment } from "react-icons/md";
import {
  X, Phone, Mail, Users, User, Calendar,
  Briefcase, MapPin, DollarSign, XCircle, Pencil,
} from "lucide-react";
import { leadService } from "../services/leadService";

/* ─── CONSTANTS ──────────────────────────────────────────────── */
const VIEW_TYPES      = ["All","Upcoming","Overdue","Due Today","Completed"];
const DAYS_AHEAD_OPTS = ["1 day","3 days","7 days","14 days","30 days","All"];
const PRIORITY_OPTS   = ["All Priorities","High","Medium","Low"];
const REMINDER_TYPES  = ["All Types","First Contact","Follow Up","Payment Reminder","Document Collection","Booking Confirmation","Custom"];
const SHOW_ENTRIES    = ["10","25","50","100"];

const PRIORITY_CFG = {
  High:   { bg:"bg-red-100",   text:"text-red-700",   border:"border-red-200"   },
  Medium: { bg:"bg-amber-100", text:"text-amber-700", border:"border-amber-200" },
  Low:    { bg:"bg-slate-100", text:"text-slate-500", border:"border-slate-200" },
};
const TYPE_CFG = {
  "First Contact":        { bg:"bg-green-500",  text:"text-white" },
  "Follow Up":            { bg:"bg-blue-500",   text:"text-white" },
  "Payment Reminder":     { bg:"bg-amber-500",  text:"text-white" },
  "Document Collection":  { bg:"bg-purple-500", text:"text-white" },
  "Booking Confirmation": { bg:"bg-teal-500",   text:"text-white" },
  "Custom":               { bg:"bg-slate-500",  text:"text-white" },
};
const STAGE_CFG = {
  "Ready to Book": { bg:"bg-blue-600",   text:"text-white" },
  "New Lead":      { bg:"bg-slate-600",  text:"text-white" },
  "Contacted":     { bg:"bg-cyan-600",   text:"text-white" },
  "Qualified":     { bg:"bg-indigo-600", text:"text-white" },
  "Proposal Sent": { bg:"bg-purple-600", text:"text-white" },
  "Converted":     { bg:"bg-green-600",  text:"text-white" },
  "Lost":          { bg:"bg-red-600",    text:"text-white" },
};
const TEMP_CFG = {
  Hot:   { bg:"bg-red-500",    label:"Hot"   },
  Warm:  { bg:"bg-amber-500",  label:"Warm"  },
  Cold:  { bg:"bg-blue-400",   label:"Cold"  },
  Fresh: { bg:"bg-green-500",  label:"Fresh" },
};

/* ─── HELPERS ────────────────────────────────────────────────── */
const fmtMoneyINR = v => v == null ? null
  : new Intl.NumberFormat("en-IN", { style:"currency", currency:"INR", maximumFractionDigits:0 }).format(v);

function formatTravellers(adults=0, children=0, infants=0) {
  const parts = [];
  if (adults)   parts.push(`${adults} Adult${adults > 1 ? "s" : ""}`);
  if (children) parts.push(`${children} Child${children > 1 ? "ren" : ""}`);
  if (infants)  parts.push(`${infants} Infant${infants > 1 ? "s" : ""}`);
  return parts.length ? parts.join(" · ") : "—";
}

function fmtDateDisplay(d) {
  if (!d) return "—";
  const date = new Date(d);
  return date.toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" });
}

function fmtDateShort(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" });
}

function getOverdueLabel(dueDateStr) {
  if (!dueDateStr) return "No date";
  const due  = new Date(dueDateStr); due.setHours(0,0,0,0);
  const today = new Date();           today.setHours(0,0,0,0);
  const diff  = Math.round((due - today) / 86400000);
  if (diff < 0)  return `Overdue by ${Math.abs(diff)} day${Math.abs(diff)===1?"":"s"}`;
  if (diff === 0) return "Due Today";
  return `Upcoming (in ${diff} day${diff===1?"":"s"})`;
}

function isOverdue(dueDateStr) {
  if (!dueDateStr) return false;
  const due = new Date(dueDateStr); due.setHours(0,0,0,0);
  const today = new Date();          today.setHours(0,0,0,0);
  return due < today;
}

function isDueToday(dueDateStr) {
  if (!dueDateStr) return false;
  const due = new Date(dueDateStr); due.setHours(0,0,0,0);
  const today = new Date();          today.setHours(0,0,0,0);
  return due.getTime() === today.getTime();
}

/* ─── MAP backend leads/reminders → task rows ────────────────── */
/* The backend returns leads from getAllLeads(). Each lead may have:
     lead.reminders[]    → array of reminder objects
     lead.leadLogs[]     → array of log objects (some have followUpDate)
   We flatten all of these into task rows shown in the table.           */
function mapLeadsToTasks(leads) {
  const tasks = [];
  let id = 1;

  leads.forEach(lead => {
    const leadId      = lead.publicId || String(lead.id);
    const leadName    = lead.customerName || "Unknown";
    const leadPhone   = lead.phone        || "";
    const leadTemp    = lead.leadType     || "Fresh";
    const assignedTo  = lead.assignedUser?.fullName ||
                        lead.assignedUser?.name      ||
                        lead.assignedUser?.username  ||
                        lead.assignedUserName        ||
                        lead.assignTo                || "Unassigned";
    const stage       = lead.leadStage    || "New Lead";
    const travelDate  = lead.travelDate
      ? new Date(lead.travelDate).toLocaleDateString("en-US", { month:"short", day:"numeric" })
      : "—";

    // ── From lead.reminders[] ──────────────────────────────────
    if (Array.isArray(lead.reminders)) {
      lead.reminders.forEach(rem => {
        tasks.push({
          id:              id++,
          leadId,
          leadPublicId:    leadId,
          dueDate:         fmtDateShort(rem.dueDate || rem.followUpDate || rem.reminderDate),
          dueDateRaw:      rem.dueDate || rem.followUpDate || rem.reminderDate,
          dueTime:         rem.dueTime || "09:00",
          overdueBy:       getOverdueLabel(rem.dueDate || rem.followUpDate || rem.reminderDate),
          leadName,
          leadPhone,
          leadTemp,
          assignedTo:      rem.assignedTo || assignedTo,
          assignedUsername:`@${(rem.assignedTo || assignedTo).replace(/\s/g,"_").toLowerCase()}`,
          type:            rem.type || rem.reminderType || "Follow Up",
          priority:        rem.priority || "Medium",
          title:           rem.title || rem.subject || `Follow-up: ${leadName}`,
          desc:            rem.description || rem.comment || rem.message || "",
          stage,
          travelDate,
          completed:       rem.status === "COMPLETED" || rem.completed || false,
          reminderId:      rem.id || rem.publicId,
        });
      });
    }

    // ── From lead.leadLogs[] that have a followUpDate ──────────
    if (Array.isArray(lead.leadLogs)) {
      lead.leadLogs
        .filter(log => log.followUpDate)
        .forEach(log => {
          tasks.push({
            id:              id++,
            leadId,
            leadPublicId:    leadId,
            dueDate:         fmtDateShort(log.followUpDate),
            dueDateRaw:      log.followUpDate,
            dueTime:         "09:00",
            overdueBy:       getOverdueLabel(log.followUpDate),
            leadName,
            leadPhone,
            leadTemp,
            assignedTo:      log.addedBy || assignedTo,
            assignedUsername:`@${(log.addedBy || assignedTo).replace(/\s/g,"_").toLowerCase()}`,
            type:            "Follow Up",
            priority:        "Medium",
            title:           `Follow-up: ${leadName}`,
            desc:            log.comment || "",
            stage:           log.stage   || stage,
            travelDate,
            completed:       false,
            reminderId:      log.id,
          });
        });
    }
  });

  // Sort: overdue first, then due today, then upcoming — within each group by date asc
  tasks.sort((a,b) => {
    const da = a.dueDateRaw ? new Date(a.dueDateRaw) : new Date("9999-12-31");
    const db = b.dueDateRaw ? new Date(b.dueDateRaw) : new Date("9999-12-31");
    return da - db;
  });

  return tasks;
}

/* ─── TOAST ──────────────────────────────────────────────────── */
function Toast({ msg, type, onClose }) {
  useEffect(()=>{ const t=setTimeout(onClose,3500); return()=>clearTimeout(t); },[onClose]);
  return (
    <div className={`fixed top-5 right-5 z-[999] flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl max-w-xs
      ${type==="success"?"bg-green-50 border-green-200 text-green-800":"bg-red-50 border-red-200 text-red-800"}`}
      style={{animation:"slideIn .3s ease both"}}>
      <span className="text-lg">{type==="success"?"✅":"❌"}</span>
      <p className="text-sm font-semibold flex-1">{msg}</p>
      <button onClick={onClose} className="opacity-50 hover:opacity-100 text-lg ml-1">×</button>
    </div>
  );
}

/* ─── STAT CARD ──────────────────────────────────────────────── */
function StatCard({ icon, label, value, bg, delay=0 }) {
  const [disp, setDisp] = useState(0);
  useEffect(()=>{
    if (!value) { setDisp(0); return; }
    let s=0; const step=Math.max(1,Math.ceil(value/40));
    const iv=setInterval(()=>{ s=Math.min(s+step,value); setDisp(s); if(s>=value)clearInterval(iv); },16);
    return()=>clearInterval(iv);
  },[value]);
  return (
    <div className={`${bg} rounded-2xl p-5 text-white shadow-lg relative overflow-hidden group
      hover:-translate-y-1 hover:shadow-xl transition-all duration-300`}
      style={{animation:"fadeUp .4s ease both", animationDelay:`${delay}ms`}}>
      <div className="absolute -right-5 -top-5 w-20 h-20 rounded-full bg-white/10 group-hover:scale-110 transition-transform"/>
      <div className="absolute -right-2 -bottom-6 w-28 h-28 rounded-full bg-white/10"/>
      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className="text-3xl font-extrabold leading-none mb-1">{disp}</p>
          <p className="text-xs font-bold uppercase tracking-widest opacity-85">{label}</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-white/20 group-hover:bg-white/30 flex items-center justify-center text-2xl transition-all">
          {icon}
        </div>
      </div>
    </div>
  );
}

/* ─── VIEW LEAD MODAL ────────────────────────────────────────── */
/* Fetches full lead from backend on open.
   Falls back to task fields if fetch fails (offline / network issue). */
function ViewLeadModal({ leadId, taskData, onClose, onEdit }) {
  const [lead,    setLead]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(()=>{
    if (!leadId) return;
    setLoading(true); setError(null);
    leadService.getLeadById(leadId)
      .then(res => { const d = res.data?.data ?? res.data; setLead(d); })
      .catch(err => {
        // Graceful fallback using task data
        if (taskData) {
          setLead({
            customerName: taskData.leadName,
            phone:        taskData.leadPhone,
            email:        null,
            leadType:     taskData.leadTemp,
            leadStage:    taskData.stage,
            assignTo:     taskData.assignedTo,
            travelDate:   taskData.dueDateRaw,
            notes:        taskData.desc,
            adults:0, children:0, infants:0,
            itinerary:[], services:[],
            budget:null, departCity:null,
            _isFallback: true,
          });
        } else {
          setError(err?.response?.data?.message || "Failed to load lead.");
        }
      })
      .finally(()=>setLoading(false));
  },[leadId]);

  const budgetStr = lead?.budget != null ? fmtMoneyINR(lead.budget) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}/>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto z-10">

        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-5 rounded-t-2xl">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600
                flex items-center justify-center text-white text-xl font-extrabold shadow-lg flex-shrink-0">
                {loading ? "…" : (lead?.customerName||"U").charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-white text-xl font-extrabold capitalize">
                  {loading ? "Loading…" : (lead?.customerName || taskData?.leadName || "—")}
                </h2>
                <p className="text-slate-400 text-sm">Lead #{leadId}</p>
                {!loading && lead && (
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full border border-slate-300 bg-slate-100 text-slate-700">
                      {lead.leadType || "—"}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"/>
                      {lead.leadStage || "—"}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <button onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all flex-shrink-0">
              <X size={16}/>
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Loading */}
          {loading && (
            <div className="space-y-3 animate-pulse">
              {[...Array(4)].map((_,i)=>(
                <div key={i} className="h-16 bg-slate-100 rounded-xl"/>
              ))}
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div className="py-10 text-center">
              <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-3">
                <XCircle size={28} className="text-red-400"/>
              </div>
              <p className="text-sm font-bold text-slate-600 mb-1">Could not load lead</p>
              <p className="text-xs text-red-500">{error}</p>
            </div>
          )}

          {/* Lead data */}
          {!loading && lead && (
            <div className="space-y-5">
              {/* Fallback notice */}
              {lead._isFallback && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-2">
                  <span className="text-amber-500 text-sm flex-shrink-0">⚠️</span>
                  <p className="text-xs text-amber-700 font-medium">
                    Showing reminder data — backend lead could not be loaded at this moment.
                  </p>
                </div>
              )}

              {/* Info grid — 8 cells */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  [Phone,       "Phone",       lead.phone,     "bg-green-50 text-green-600"],
                  [Mail,        "Email",        lead.email,     "bg-blue-50 text-blue-600"],
                  [Users,       "Travellers",   formatTravellers(lead.adults, lead.children, lead.infants), "bg-purple-50 text-purple-600"],
                  [User,        "Assigned To",  lead.assignedUser?.fullName || lead.assignedUser?.name || lead.assignTo || "Unassigned", "bg-orange-50 text-orange-600"],
                  [Calendar,    "Travel Date",  fmtDateDisplay(lead.travelDate), "bg-teal-50 text-teal-600"],
                  [Briefcase,   "Lead Type",    lead.leadType,  "bg-indigo-50 text-indigo-600"],
                  [DollarSign,  "Budget",       budgetStr,      "bg-yellow-50 text-yellow-700"],
                  [MapPin,      "Departure",    lead.departCity,"bg-rose-50 text-rose-600"],
                ].map(([Icon,label,val,ic])=>(
                  <div key={label} className="flex items-center gap-3 bg-slate-50 rounded-xl p-3 border border-slate-100">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${ic}`}>
                      <Icon size={14}/>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">{label}</p>
                      <p className="text-sm font-bold text-slate-700 truncate">{val || "—"}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Itinerary */}
              {lead.itinerary?.length > 0 && (
                <div>
                  <p className="text-sm font-extrabold text-slate-700 mb-2 flex items-center gap-2">
                    <MapPin size={14} className="text-blue-500"/> Itinerary
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {lead.itinerary.map((item,i)=>(
                      <span key={i} className="bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl text-sm font-semibold text-slate-700">
                        {item.destination} <span className="text-blue-600 font-extrabold">({item.nights}N)</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Services */}
              {lead.services?.length > 0 && (
                <div>
                  <p className="text-sm font-extrabold text-slate-700 mb-2">Services</p>
                  <div className="flex flex-wrap gap-1.5">
                    {lead.services.map((s,i)=>(
                      <span key={i} className="bg-blue-50 text-blue-700 border border-blue-100 px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider">{s}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {lead.notes && (
                <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                  <p className="text-xs font-extrabold text-amber-700 mb-1.5">📝 Notes</p>
                  <p className="text-sm text-amber-800 leading-relaxed whitespace-pre-wrap">{lead.notes}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-2 pt-1">
                <button onClick={()=>{ onEdit(leadId); onClose(); }}
                  className="flex-1 min-w-[120px] py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold flex items-center justify-center gap-2 transition-all">
                  <Pencil size={14}/> Edit Lead
                </button>
                <button onClick={onClose}
                  className="flex-1 min-w-[120px] py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-bold flex items-center justify-center gap-2 transition-all border border-slate-200">
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── INFO MODAL (reminder detail) ──────────────────────────── */
function InfoModal({ task, onClose, onNavigate, onViewLead }) {
  if (!task) return null;
  const overdue = isOverdue(task.dueDateRaw);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}/>
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md z-10"
        style={{animation:"popIn .25s ease both"}}>
        {/* Header */}
        <div className={`px-6 py-5 rounded-t-3xl flex items-start justify-between
          ${overdue ? "bg-gradient-to-r from-red-600 to-rose-500" : "bg-gradient-to-r from-blue-600 to-indigo-500"}`}>
          <div className="min-w-0 flex-1 pr-3">
            <p className="text-white/70 text-[10px] font-extrabold uppercase tracking-widest mb-1">Reminder Info</p>
            <h2 className="text-white text-base font-extrabold leading-tight truncate">{task.title}</h2>
            <p className="text-white/70 text-xs mt-1 truncate">{task.leadName} · {task.leadPhone}</p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center flex-shrink-0 transition-all">
            ✕
          </button>
        </div>
        <div className="p-6 space-y-4">
          {/* Overdue badge */}
          <div className={`px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2
            ${overdue ? "bg-red-50 border border-red-200 text-red-700" : isDueToday(task.dueDateRaw) ? "bg-amber-50 border border-amber-200 text-amber-700" : "bg-green-50 border border-green-200 text-green-700"}`}>
            <span className={`w-2 h-2 rounded-full ${overdue ? "bg-red-500" : isDueToday(task.dueDateRaw) ? "bg-amber-500" : "bg-green-500"}`}/>
            {task.overdueBy}
          </div>
          {/* Detail grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              ["📅 Due Date",    task.dueDate],
              ["⏰ Due Time",    task.dueTime],
              ["🎯 Priority",    task.priority],
              ["📋 Type",        task.type],
              ["📍 Lead Stage",  task.stage],
              ["✈️ Travel Date", task.travelDate],
              ["🌡️ Temperature", task.leadTemp],
              ["👤 Assigned",    task.assignedTo],
            ].map(([l,v])=>(
              <div key={l} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-0.5">{l}</p>
                <p className="text-sm font-bold text-slate-700 capitalize">{v||"—"}</p>
              </div>
            ))}
          </div>
          {/* Description */}
          {task.desc && (
            <div className="bg-amber-50 rounded-xl p-3.5 border border-amber-100">
              <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wide mb-1">📝 Description</p>
              <p className="text-sm text-amber-800 leading-relaxed">{task.desc}</p>
            </div>
          )}
          {/* Actions */}
          <div className="flex gap-2.5 pt-1">
            <button onClick={()=>{ onClose(); onViewLead && onViewLead(task.leadId, task); }}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-500
                hover:from-blue-700 hover:to-indigo-600 text-white text-sm font-bold
                flex items-center justify-center gap-2 shadow-md shadow-blue-200 transition-all">
              👁 View Lead
            </button>
            <button onClick={()=>{ onClose(); onNavigate(`/EditLead/${task.leadId}`); }}
              className="flex-1 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700
                border border-indigo-200 text-sm font-bold flex items-center justify-center gap-2 transition-all">
              ✏️ Edit Lead
            </button>
            <button onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600
                border border-slate-200 text-sm font-bold transition-all">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── SKELETON ROW ───────────────────────────────────────────── */
function SkeletonRow() {
  return (
    <tr>
      {[...Array(8)].map((_,i)=>(
        <td key={i} className="px-3 py-4">
          <div className="h-4 rounded-lg bg-slate-200 animate-pulse" style={{width:`${30+Math.random()*55}%`}}/>
        </td>
      ))}
    </tr>
  );
}

const inputCls = "w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 font-medium focus:border-blue-400 focus:ring-2 focus:ring-blue-50 outline-none appearance-none cursor-pointer transition-all hover:border-slate-300";

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════ */
export default function FollowupReports() {
  const navigate = useNavigate();

  /* filter state */
  const [viewType,     setViewType]     = useState("All");
  const [daysAhead,    setDaysAhead]    = useState("7 days");
  const [assignedTo,   setAssignedTo]   = useState("All Users");
  const [priority,     setPriority]     = useState("All Priorities");
  const [reminderType, setReminderType] = useState("All Types");
  const [filtersOpen,  setFiltersOpen]  = useState(true);
  const [search,       setSearch]       = useState("");
  const [showEntries,  setShowEntries]  = useState("25");
  const [page,         setPage]         = useState(1);
  const [applied,      setApplied]      = useState({
    viewType:"All", daysAhead:"7 days", assignedTo:"All Users",
    priority:"All Priorities", reminderType:"All Types"
  });

  /* data state */
  const [tasks,        setTasks]        = useState([]);
  const [allLeads,     setAllLeads]     = useState([]);
  const [usersOptions, setUsersOptions] = useState(["All Users"]);
  const [loading,      setLoading]      = useState(true);
  const [toast,        setToast]        = useState(null);
  const [selected,     setSelected]     = useState(new Set());

  /* modal state */
  const [infoTask,     setInfoTask]     = useState(null);
  const [viewLeadId,   setViewLeadId]   = useState(null);
  const [viewTaskData, setViewTaskData] = useState(null);

  const showToast = useCallback((msg, type="success")=>setToast({msg,type}),[]);

  /* ── FETCH REAL DATA ────────────────────────────────────────── */
  /* Strategy (in order):
     1. GET /api/reports/followup  — dedicated backend endpoint (preferred)
     2. GET /api/leads             — extract lead.reminders[] / lead.leadLogs[]
     Both results are normalised into the same task shape via mapToTask().  */
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      let tasks = [];

      /* ── normalise any reminder/log/followup object into a task row ── */
      const mapToTask = (r, idx, lead) => {
        const dueDateRaw = r.dueDate || r.followUpDate || r.reminderDate || null;
        const leadId     = r.leadPublicId || r.leadId ||
                           lead?.publicId || String(lead?.id || r.id || idx);
        const leadName   = r.customerName || r.leadName  ||
                           lead?.customerName || "Unknown";
        const leadPhone  = r.phone  || r.leadPhone  || lead?.phone  || "";
        const assignedTo = r.assignedUser?.fullName ||
                           r.assignedUser?.name     ||
                           r.assignedTo             ||
                           lead?.assignedUser?.fullName ||
                           lead?.assignedTo         || "Unassigned";
        return {
          id:              idx + 1,
          leadId,
          leadPublicId:    leadId,
          dueDate:         fmtDateShort(dueDateRaw),
          dueDateRaw,
          dueTime:         r.dueTime || "09:00",
          overdueBy:       getOverdueLabel(dueDateRaw),
          leadName,
          leadPhone,
          leadTemp:        r.leadType || r.leadTemp  || lead?.leadType || "Fresh",
          assignedTo,
          assignedUsername:`@${assignedTo.replace(/\s/g,"_").toLowerCase()}`,
          type:            r.type || r.reminderType || "Follow Up",
          priority:        r.priority || "Medium",
          title:           r.title  || r.subject    ||
                           `Follow-up: ${leadName}`,
          desc:            r.description || r.comment || r.message || r.desc || "",
          stage:           r.leadStage || r.stage    || lead?.leadStage || "New Lead",
          travelDate:      (r.travelDate || lead?.travelDate)
            ? new Date(r.travelDate || lead.travelDate)
                .toLocaleDateString("en-US",{month:"short",day:"numeric"})
            : "—",
          completed:       r.status === "COMPLETED" || r.completed || false,
          reminderId:      r.publicId || r.id,
        };
      };

      /* ── 1. Try /api/reports/followup (dedicated backend endpoint) ── */
      try {
        const res   = await leadService.getFollowupReport
          ? leadService.getFollowupReport()
          : fetch("/api/reports/followup",{headers:{Authorization:`Bearer ${localStorage.getItem("authToken")}`}}).then(r=>r.json()).then(d=>({data:d}));

        const body  = res?.data;
        /* Backend returns { followups:[...] } or { data:{ followups:[...] } } */
        const list  = body?.followups  ||
                      body?.data?.followups ||
                      (Array.isArray(body?.data) ? body.data : null) ||
                      (Array.isArray(body)       ? body       : null);

        if (Array.isArray(list) && list.length > 0) {
          tasks = list.map((r, idx) => mapToTask(r, idx, null));
          console.log("[FollowupReports] loaded", tasks.length, "tasks from /api/reports/followup");
        }
      } catch (err1) {
        console.warn("[FollowupReports] /api/reports/followup failed:", err1?.message);
      }

      /* ── 2. Fallback: GET /api/leads and extract embedded reminders/logs ── */
      if (tasks.length === 0) {
        const res2  = await leadService.getAllLeads();
        const body2 = res2.data;
        let raw = [];
        if (Array.isArray(body2?.data))               raw = body2.data;
        else if (Array.isArray(body2?.data?.content)) raw = body2.data.content;
        else if (Array.isArray(body2?.content))       raw = body2.content;
        else if (Array.isArray(body2))                raw = body2;

        setAllLeads(raw);

        /* Build user dropdown from leads */
        const userSet = new Set();
        raw.forEach(l => {
          const u = l.assignedUser?.fullName || l.assignedUser?.name || l.assignTo;
          if (u) userSet.add(u);
        });
        setUsersOptions(["All Users", ...Array.from(userSet).sort()]);

        /* Extract from lead.reminders[] or lead.leadLogs[followUpDate] */
        tasks = mapLeadsToTasks(raw);

        /* ── 3. Last resort: fetch /api/leads/{id}/reminders for each lead ──
           Only triggered when leads have no embedded reminder data.
           Limits to first 50 leads to avoid too many requests.             */
        if (tasks.length === 0 && raw.length > 0) {
          console.log("[FollowupReports] no embedded reminders — trying per-lead reminders");
          const subset = raw.slice(0, 50);
          const settled = await Promise.allSettled(
            subset.map(lead =>
              leadService.getLeadLogs(lead.publicId || lead.id)
                .then(r => {
                  const body = r.data?.data ?? r.data ?? [];
                  const logs = Array.isArray(body) ? body : [];
                  return logs
                    .filter(log => log.followUpDate)
                    .map((log, i) => mapToTask(log, i, lead));
                })
                .catch(() => [])
            )
          );
          tasks = settled
            .filter(s => s.status === "fulfilled")
            .flatMap(s => s.value);

          /* Re-number ids */
          tasks = tasks.map((t, i) => ({ ...t, id: i + 1 }));
          console.log("[FollowupReports] per-lead logs:", tasks.length, "tasks");
        }
      }

      /* Sort: overdue first → due today → upcoming */
      tasks.sort((a, b) => {
        const da = a.dueDateRaw ? new Date(a.dueDateRaw) : new Date("9999-12-31");
        const db = b.dueDateRaw ? new Date(b.dueDateRaw) : new Date("9999-12-31");
        return da - db;
      });

      setTasks(tasks);

      if (tasks.length === 0) {
        console.log("[FollowupReports] no tasks found — leads may not have reminders yet");
      }
    } catch (err) {
      console.error("[FollowupReports] fetchData error:", err);
      showToast("Failed to load follow-up data. Please try again.", "error");
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(()=>{ fetchData(); },[fetchData]);

  /* ── APPLY / RESET FILTERS ── */
  const handleApply = () => {
    setApplied({ viewType, daysAhead, assignedTo, priority, reminderType });
    setPage(1);
  };
  const handleReset = () => {
    setViewType("All"); setDaysAhead("7 days");
    setAssignedTo("All Users"); setPriority("All Priorities"); setReminderType("All Types");
    setApplied({ viewType:"All", daysAhead:"7 days", assignedTo:"All Users",
                 priority:"All Priorities", reminderType:"All Types" });
    setPage(1);
  };

  /* ── MARK COMPLETE ── */
  const handleComplete = useCallback(async (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || task.completed) return;
    try {
      // If backend has a mark-complete endpoint:
      // await leadService.completeReminder(task.reminderId || task.leadId);
      setTasks(prev => prev.map(t => t.id === taskId ? {...t, completed:true} : t));
      showToast("Task marked as completed.");
    } catch {
      showToast("Failed to mark task as completed.", "error");
    }
  }, [tasks, showToast]);

  /* ── BULK COMPLETE ── */
  const handleBulkComplete = useCallback(() => {
    setTasks(prev => prev.map(t => selected.has(t.id) ? {...t, completed:true} : t));
    showToast(`${selected.size} task${selected.size>1?"s":""} marked as completed.`);
    setSelected(new Set());
  }, [selected, showToast]);

  /* ── CSV EXPORT ── */
  const handleExport = () => {
    const headers = ["Due Date","Lead Name","Phone","Assigned To","Type","Priority","Title","Stage","Overdue"];
    const rows = filtered.map(t => [
      t.dueDate, t.leadName, t.leadPhone, t.assignedTo,
      t.type, t.priority, t.title, t.stage, t.overdueBy
    ]);
    const csv = [headers, ...rows].map(r => r.map(v=>`"${(v||"").replace(/"/g,'""')}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    a.download = "followup-report.csv";
    a.click();
    showToast("CSV exported.");
  };

  /* ── FILTER LOGIC ── */
  const today = new Date(); today.setHours(0,0,0,0);
  const daysNum = parseInt(applied.daysAhead) || 9999;

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return tasks.filter(t => {
      if (q && !t.leadName.toLowerCase().includes(q) &&
               !t.title.toLowerCase().includes(q) &&
               !t.assignedTo.toLowerCase().includes(q) &&
               !t.leadPhone.includes(q)) return false;
      if (applied.assignedTo !== "All Users"     && t.assignedTo !== applied.assignedTo) return false;
      if (applied.priority   !== "All Priorities" && t.priority   !== applied.priority)   return false;
      if (applied.reminderType !== "All Types"   && t.type        !== applied.reminderType) return false;

      if (applied.viewType === "Completed" && !t.completed)    return false;
      if (applied.viewType === "Overdue"   && (!isOverdue(t.dueDateRaw) || t.completed)) return false;
      if (applied.viewType === "Due Today" && (!isDueToday(t.dueDateRaw) || t.completed)) return false;
      if (applied.viewType === "Upcoming"  && (isOverdue(t.dueDateRaw) || isDueToday(t.dueDateRaw) || t.completed)) return false;
      if (applied.viewType === "All"       && t.completed)     return false;

      if (applied.daysAhead !== "All" && t.dueDateRaw) {
        const due = new Date(t.dueDateRaw); due.setHours(0,0,0,0);
        const cutoff = new Date(today); cutoff.setDate(today.getDate() + daysNum);
        if (due > cutoff) return false;
      }

      return true;
    });
  }, [tasks, search, applied, daysNum]);

  /* ── STATS ── */
  const stats = useMemo(() => ({
    total:    tasks.filter(t => !t.completed).length,
    overdue:  tasks.filter(t => !t.completed && isOverdue(t.dueDateRaw)).length,
    dueToday: tasks.filter(t => !t.completed && isDueToday(t.dueDateRaw)).length,
    urgent:   tasks.filter(t => !t.completed && t.dueDateRaw && (() => {
      const due = new Date(t.dueDateRaw); due.setHours(0,0,0,0);
      const diff = Math.round((due - today) / 86400000);
      return diff >= 0 && diff <= 3;
    })()).length,
    upcoming: tasks.filter(t => !t.completed && t.dueDateRaw && (() => {
      const due = new Date(t.dueDateRaw); due.setHours(0,0,0,0);
      return due > today;
    })()).length,
    high: tasks.filter(t => !t.completed && t.priority === "High").length,
  }), [tasks]);

  /* ── PAGINATION ── */
  const perPage    = parseInt(showEntries);
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage   = Math.min(page, totalPages);
  const pageData   = filtered.slice((safePage-1)*perPage, safePage*perPage);

  /* ── SELECTION ── */
  const allPageSelected = pageData.length > 0 && pageData.every(t => selected.has(t.id));
  const toggleAll = () => {
    if (allPageSelected) {
      const next = new Set(selected); pageData.forEach(t => next.delete(t.id)); setSelected(next);
    } else {
      const next = new Set(selected); pageData.forEach(t => next.add(t.id)); setSelected(next);
    }
  };

  /* ── OPEN VIEW MODAL ── */
  const openViewLead = (leadId, task) => {
    setViewLeadId(leadId);
    setViewTaskData(task || null);
  };

  /* ─── RENDER ─────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-100"
      style={{fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        @keyframes fadeUp  { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn { from{transform:translateX(110%);opacity:0} to{transform:translateX(0);opacity:1} }
        @keyframes popIn   { from{transform:scale(.92);opacity:0} to{transform:scale(1);opacity:1} }
        select { -webkit-appearance:none; appearance:none; }
        ::-webkit-scrollbar{width:5px;height:5px}
        ::-webkit-scrollbar-track{background:#f1f5f9;border-radius:99px}
        ::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:99px}
      `}</style>

      {/* Toast */}
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}

      {/* Modals */}
      {infoTask && (
        <InfoModal
          task={infoTask}
          onClose={()=>setInfoTask(null)}
          onNavigate={navigate}
          onViewLead={(id, task)=>{ setInfoTask(null); openViewLead(id, task); }}
        />
      )}
      {viewLeadId && (
        <ViewLeadModal
          leadId={viewLeadId}
          taskData={viewTaskData}
          onClose={()=>{ setViewLeadId(null); setViewTaskData(null); }}
          onEdit={id=>navigate(`/EditLead/${id}`)}
        />
      )}

      {/* ── PAGE HEADER ── */}
      <div className="bg-white/70 backdrop-blur-md border-b border-slate-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500
                flex items-center justify-center text-white shadow-lg shadow-amber-200 flex-shrink-0">
                <FaTasks className="w-5 h-5"/>
              </div>
              <div>
                <h1 className="text-lg font-extrabold text-slate-800 tracking-tight">Follow-up Reports</h1>
                <p className="text-xs text-slate-400 hidden sm:block mt-0.5">
                  <span className="hover:text-blue-600 cursor-pointer" onClick={()=>navigate("/")}>Home</span>
                  <span className="mx-1 text-slate-300">/</span>
                  <span className="text-amber-600 font-bold">Follow-up Reports</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={fetchData}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:border-blue-300
                  bg-white hover:bg-blue-50 text-slate-600 hover:text-blue-600 text-sm font-bold transition-all shadow-sm">
                <FiRefreshCw className={`w-4 h-4 ${loading?"animate-spin":""}`}/> Refresh
              </button>
              <button onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:border-green-300
                  bg-white hover:bg-green-50 text-slate-600 hover:text-green-600 text-sm font-bold transition-all shadow-sm">
                <FiDownload className="w-4 h-4"/> Export CSV
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-5 space-y-5">

        {/* ── STAT CARDS ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
          {[
            { icon:"📋", label:"Total Due",   value:stats.total,    bg:"bg-gradient-to-br from-blue-500 to-blue-600",     delay:0   },
            { icon:"🔴", label:"Overdue",     value:stats.overdue,  bg:"bg-gradient-to-br from-red-500 to-rose-600",      delay:60  },
            { icon:"📅", label:"Due Today",   value:stats.dueToday, bg:"bg-gradient-to-br from-amber-500 to-orange-500",  delay:120 },
            { icon:"⚡", label:"Urgent (3d)", value:stats.urgent,   bg:"bg-gradient-to-br from-orange-500 to-red-400",    delay:180 },
            { icon:"🔔", label:"Upcoming",    value:stats.upcoming, bg:"bg-gradient-to-br from-teal-500 to-cyan-500",     delay:240 },
            { icon:"⭐", label:"High Priority",value:stats.high,    bg:"bg-gradient-to-br from-violet-600 to-purple-600", delay:300 },
          ].map(c=>(
            <StatCard key={c.label} icon={c.icon} label={c.label} value={c.value} bg={c.bg} delay={c.delay}/>
          ))}
        </div>

        {/* ── FILTERS CARD ── */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
          <button onClick={()=>setFiltersOpen(v=>!v)}
            className="w-full flex items-center justify-between px-5 py-4 bg-gradient-to-r from-slate-800 to-slate-700 text-white">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center">
                <FiFilter className="w-4 h-4"/>
              </div>
              <span className="font-extrabold text-sm">Filters & Settings</span>
            </div>
            {filtersOpen ? <FiChevronUp className="w-5 h-5 opacity-70"/> : <FiChevronDown className="w-5 h-5 opacity-70"/>}
          </button>

          {filtersOpen && (
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
                {[
                  { label:"View Type",     val:viewType,     set:setViewType,     opts:VIEW_TYPES      },
                  { label:"Days Ahead",    val:daysAhead,    set:setDaysAhead,    opts:DAYS_AHEAD_OPTS },
                  { label:"Assigned To",   val:assignedTo,   set:setAssignedTo,   opts:usersOptions    },
                  { label:"Priority",      val:priority,     set:setPriority,     opts:PRIORITY_OPTS   },
                  { label:"Reminder Type", val:reminderType, set:setReminderType, opts:REMINDER_TYPES  },
                ].map(({label,val,set,opts})=>(
                  <div key={label} className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">{label}</label>
                    <div className="relative">
                      <select value={val} onChange={e=>set(e.target.value)} className={inputCls+" pr-9"}>
                        {opts.map(o=><option key={o} value={o}>{o}</option>)}
                      </select>
                      <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"/>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                <button onClick={handleApply}
                  className="flex-1 sm:flex-none sm:w-32 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-all shadow-md shadow-blue-200">
                  Apply Filters
                </button>
                <button onClick={handleReset}
                  className="flex-1 sm:flex-none sm:w-28 py-2.5 rounded-xl border-2 border-slate-200 hover:border-red-300 text-slate-600 hover:text-red-500 text-sm font-bold transition-all">
                  Reset
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── TASKS TABLE CARD ── */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">

          {/* Card header */}
          <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-base font-extrabold text-slate-700">Follow-up Tasks</h2>
              <span className="text-xs bg-amber-100 text-amber-700 border border-amber-200 font-extrabold px-2.5 py-1 rounded-full">
                {filtered.length} task{filtered.length !== 1 ? "s" : ""}
              </span>
              {selected.size > 0 && (
                <button onClick={handleBulkComplete}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold transition-all shadow-sm">
                  <FiCheck className="w-3 h-3"/> Mark {selected.size} as Completed
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Show</span>
              <div className="relative">
                <select value={showEntries} onChange={e=>{setShowEntries(e.target.value);setPage(1);}}
                  className="pl-2.5 pr-6 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700 font-bold focus:outline-none appearance-none cursor-pointer">
                  {SHOW_ENTRIES.map(o=><option key={o}>{o}</option>)}
                </select>
                <FiChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none"/>
              </div>
              <div className="relative">
                <FiSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400"/>
                <input value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}}
                  placeholder="Search lead, title…"
                  className="pl-7 pr-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700 placeholder-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-50 outline-none transition-all w-44"/>
              </div>
            </div>
          </div>

          {/* ── DESKTOP TABLE ── */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="bg-slate-50/80 border-b border-slate-100">
                <tr>
                  <th className="px-4 py-3 w-10">
                    <input type="checkbox" checked={allPageSelected} onChange={toggleAll}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-400 cursor-pointer"/>
                  </th>
                  {["Due Date","Lead Details","Assigned To","Type","Priority","Title & Desc","Stage","Actions"].map(h=>(
                    <th key={h} className="px-3 py-3 text-left text-[10px] font-extrabold text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  [...Array(6)].map((_,i)=><SkeletonRow key={i}/>)
                ) : pageData.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-20">
                      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3 text-3xl">📋</div>
                      <p className="text-base font-extrabold text-slate-600 mb-1">No follow-up tasks found</p>
                      <p className="text-sm text-slate-400">
                        {tasks.length === 0
                          ? "No leads have reminders or follow-up logs yet. Add a log with a follow-up date from the Leads page."
                          : "Adjust your filters to see more tasks."}
                      </p>
                    </td>
                  </tr>
                ) : (
                  pageData.map((task, idx) => {
                    const pc    = PRIORITY_CFG[task.priority] || PRIORITY_CFG.Low;
                    const tc    = TYPE_CFG[task.type]         || TYPE_CFG["Custom"];
                    const sc    = STAGE_CFG[task.stage]       || STAGE_CFG["New Lead"];
                    const tm    = TEMP_CFG[task.leadTemp]     || TEMP_CFG.Fresh;
                    const overdue = isOverdue(task.dueDateRaw);
                    const today2  = isDueToday(task.dueDateRaw);

                    return (
                      <tr key={task.id}
                        className={`group transition-all duration-150 hover:bg-blue-50/30
                          ${task.completed ? "opacity-50 bg-slate-50" : ""}
                          ${overdue && !task.completed ? "bg-red-50/30 hover:bg-red-50/50" : ""}
                          ${today2  && !task.completed ? "bg-amber-50/30 hover:bg-amber-50/50" : ""}`}
                        style={{animation:"fadeUp .35s ease both", animationDelay:`${idx*25}ms`}}>
                        {/* Checkbox */}
                        <td className="px-4 py-3.5">
                          <input type="checkbox"
                            checked={selected.has(task.id)}
                            onChange={()=>{
                              const next=new Set(selected);
                              selected.has(task.id)?next.delete(task.id):next.add(task.id);
                              setSelected(next);
                            }}
                            disabled={task.completed}
                            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-400 cursor-pointer disabled:opacity-40"/>
                        </td>

                        {/* Due Date */}
                        <td className="px-3 py-3.5">
                          <p className={`text-sm font-extrabold ${overdue&&!task.completed?"text-red-600":today2&&!task.completed?"text-amber-600":"text-slate-800"}`}>
                            {task.dueDate}
                          </p>
                          <p className={`text-[10px] font-bold mt-0.5 ${overdue&&!task.completed?"text-red-500":today2&&!task.completed?"text-amber-500":"text-slate-400"}`}>
                            {task.dueTime}
                          </p>
                          <span className={`inline-flex items-center gap-1 text-[9px] font-extrabold px-1.5 py-0.5 rounded-full mt-1
                            ${overdue&&!task.completed?"bg-red-100 text-red-600":today2&&!task.completed?"bg-amber-100 text-amber-600":"bg-slate-100 text-slate-500"}`}>
                            {overdue&&!task.completed?<FiAlertTriangle className="w-2.5 h-2.5"/>:<FiClock className="w-2.5 h-2.5"/>}
                            {task.overdueBy}
                          </span>
                        </td>

                        {/* Lead Details */}
                        <td className="px-3 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-8 h-8 rounded-full ${tm.bg} flex items-center justify-center text-white text-[11px] font-extrabold flex-shrink-0`}>
                              {task.leadName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-800 capitalize">{task.leadName}</p>
                              <div className="flex items-center gap-1 mt-0.5">
                                <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full ${tm.bg} text-white`}>
                                  {tm.label}
                                </span>
                                <p className="text-xs text-slate-400">{task.leadPhone}</p>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Assigned To */}
                        <td className="px-3 py-3.5">
                          <p className="text-sm font-semibold text-slate-700 capitalize">{task.assignedTo}</p>
                          <p className="text-xs text-slate-400">{task.assignedUsername}</p>
                        </td>

                        {/* Type */}
                        <td className="px-3 py-3.5">
                          <span className={`text-[10px] font-extrabold px-2 py-1 rounded-lg ${tc.bg} ${tc.text}`}>
                            {task.type}
                          </span>
                        </td>

                        {/* Priority */}
                        <td className="px-3 py-3.5">
                          <span className={`text-xs font-extrabold px-2.5 py-1 rounded-full border ${pc.bg} ${pc.text} ${pc.border}`}>
                            {task.priority}
                          </span>
                        </td>

                        {/* Title & Desc */}
                        <td className="px-3 py-3.5 max-w-[200px]">
                          <p className="text-sm font-bold text-slate-700 truncate">{task.title}</p>
                          {task.desc && <p className="text-xs text-slate-400 truncate mt-0.5">{task.desc}</p>}
                          {task.completed && (
                            <span className="inline-flex items-center gap-1 text-[9px] font-extrabold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full mt-1">
                              ✅ Done
                            </span>
                          )}
                        </td>

                        {/* Stage */}
                        <td className="px-3 py-3.5">
                          <span className={`text-[10px] font-extrabold px-2 py-1 rounded-lg ${sc.bg} ${sc.text}`}>
                            {task.stage}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-3 py-3.5">
                          <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                            {/* Complete */}
                            <button onClick={()=>handleComplete(task.id)} disabled={task.completed}
                              title="Mark as completed"
                              className="w-8 h-8 rounded-lg bg-green-50 hover:bg-green-100 border border-green-200 text-green-600
                                flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                              <FiCheck className="w-3.5 h-3.5"/>
                            </button>
                            {/* Info modal */}
                            <button onClick={()=>setInfoTask(task)} title="View reminder info"
                              className="w-8 h-8 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-600
                                flex items-center justify-center transition-all">
                              <FiInfo className="w-3.5 h-3.5"/>
                            </button>
                            {/* View Lead modal */}
                            <button onClick={()=>openViewLead(task.leadId, task)} title="View lead details"
                              className="w-8 h-8 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-600
                                flex items-center justify-center transition-all">
                              <FiEye className="w-3.5 h-3.5"/>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* ── MOBILE CARDS ── */}
          <div className="md:hidden p-4 space-y-3">
            {loading ? (
              [...Array(4)].map((_,i)=>(
                <div key={i} className="bg-white rounded-2xl border border-slate-100 p-4 space-y-3 animate-pulse">
                  {[...Array(3)].map((_,j)=><div key={j} className="h-4 rounded-lg bg-slate-200"/>)}
                </div>
              ))
            ) : pageData.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-4xl mb-3">📋</div>
                <p className="text-base font-extrabold text-slate-600">No tasks found</p>
                <p className="text-sm text-slate-400 mt-1">
                  {tasks.length === 0
                    ? "Add follow-up logs from the Leads page."
                    : "Try adjusting your filters."}
                </p>
              </div>
            ) : (
              pageData.map((task, idx) => {
                const pc      = PRIORITY_CFG[task.priority] || PRIORITY_CFG.Low;
                const tc      = TYPE_CFG[task.type]         || TYPE_CFG["Custom"];
                const sc      = STAGE_CFG[task.stage]       || STAGE_CFG["New Lead"];
                const tm      = TEMP_CFG[task.leadTemp]     || TEMP_CFG.Fresh;
                const overdue = isOverdue(task.dueDateRaw);
                const tday    = isDueToday(task.dueDateRaw);
                return (
                  <div key={task.id}
                    className={`bg-white rounded-2xl border shadow-sm p-4 space-y-3 transition-all
                      ${task.completed?"opacity-50 border-slate-100":""}
                      ${overdue&&!task.completed?"border-red-200 bg-red-50/20":""}
                      ${tday&&!task.completed?"border-amber-200 bg-amber-50/20":""}
                      ${!overdue&&!tday&&!task.completed?"border-slate-200":""}`}
                    style={{animation:"fadeUp .35s ease both", animationDelay:`${idx*40}ms`}}>

                    {/* Top row */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className={`w-9 h-9 rounded-xl ${tm.bg} flex items-center justify-center text-white text-sm font-extrabold flex-shrink-0`}>
                          {task.leadName.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-800 capitalize truncate">{task.leadName}</p>
                          <p className="text-xs text-slate-400">{task.leadPhone}</p>
                        </div>
                      </div>
                      <span className={`text-xs font-extrabold px-2 py-1 rounded-full border flex-shrink-0 ${pc.bg} ${pc.text} ${pc.border}`}>
                        {task.priority}
                      </span>
                    </div>

                    {/* Title */}
                    <p className="text-sm font-bold text-slate-700">{task.title}</p>
                    {task.desc && <p className="text-xs text-slate-400 line-clamp-2">{task.desc}</p>}

                    {/* Meta row */}
                    <div className="flex flex-wrap gap-1.5">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-lg ${tc.bg} ${tc.text}`}>{task.type}</span>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-lg ${sc.bg} ${sc.text}`}>{task.stage}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${overdue&&!task.completed?"bg-red-100 text-red-600":tday&&!task.completed?"bg-amber-100 text-amber-600":"bg-slate-100 text-slate-500"}`}>
                        {task.overdueBy}
                      </span>
                    </div>

                    {/* Assigned + due */}
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1"><FiUser className="w-3 h-3"/> {task.assignedTo}</span>
                      <span className="flex items-center gap-1"><FiCalendar className="w-3 h-3"/> {task.dueDate}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-1">
                      <button onClick={()=>handleComplete(task.id)} disabled={task.completed}
                        className="flex-1 py-2 rounded-xl bg-green-50 hover:bg-green-100 border border-green-200 text-green-600 text-xs font-bold flex items-center justify-center gap-1 disabled:opacity-40 transition-all">
                        <FiCheck className="w-3 h-3"/> {task.completed?"Done":"Complete"}
                      </button>
                      <button onClick={()=>setInfoTask(task)}
                        className="w-10 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-600 flex items-center justify-center transition-all">
                        <FiInfo className="w-3 h-3"/>
                      </button>
                      <button onClick={()=>openViewLead(task.leadId, task)}
                        className="w-10 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-600 flex items-center justify-center transition-all">
                        <FiEye className="w-3 h-3"/>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* ── PAGINATION ── */}
          {!loading && filtered.length > 0 && (
            <div className="px-5 py-4 border-t border-slate-100 bg-slate-50/60
              flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-slate-400 font-medium">
                Showing <span className="font-bold text-slate-600">{(safePage-1)*perPage+1}</span>–
                <span className="font-bold text-slate-600">{Math.min(safePage*perPage,filtered.length)}</span>
                {" "}of <span className="font-bold text-slate-600">{filtered.length}</span> tasks
              </p>
              <div className="flex items-center gap-1.5">
                <button disabled={safePage===1} onClick={()=>setPage(1)}
                  className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-500 text-xs font-bold hover:border-blue-300 hover:text-blue-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                  «
                </button>
                <button disabled={safePage===1} onClick={()=>setPage(p=>Math.max(1,p-1))}
                  className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-500 text-xs font-bold hover:border-blue-300 hover:text-blue-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                  ‹
                </button>
                {Array.from({length:totalPages},(_,i)=>i+1)
                  .filter(p=>p===1||p===totalPages||Math.abs(p-safePage)<=1)
                  .reduce((acc,p,i,arr)=>{ if(i>0&&p-arr[i-1]>1)acc.push("…"); acc.push(p); return acc; },[])
                  .map((p,i)=>
                    typeof p==="string"
                    ? <span key={`e${i}`} className="w-8 h-8 flex items-center justify-center text-xs text-slate-400">…</span>
                    : <button key={p} onClick={()=>setPage(p)}
                        className={`w-8 h-8 rounded-lg text-xs font-bold transition-all border
                          ${safePage===p?"bg-blue-600 border-blue-600 text-white shadow-sm":"bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600"}`}>
                        {p}
                      </button>
                  )}
                <button disabled={safePage===totalPages} onClick={()=>setPage(p=>Math.min(totalPages,p+1))}
                  className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-500 text-xs font-bold hover:border-blue-300 hover:text-blue-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                  ›
                </button>
                <button disabled={safePage===totalPages} onClick={()=>setPage(totalPages)}
                  className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-500 text-xs font-bold hover:border-blue-300 hover:text-blue-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                  »
                </button>
              </div>
            </div>
          )}

          {/* Empty state when no tasks at all */}
          {!loading && tasks.length === 0 && (
            <div className="px-5 py-6 bg-blue-50/40 border-t border-blue-100">
              <p className="text-sm font-bold text-blue-700 mb-1">💡 How to get follow-up tasks here:</p>
              <ol className="text-xs text-blue-600 space-y-1 list-decimal list-inside">
                <li>Go to <strong>Leads</strong> page → expand any lead row</li>
                <li>Click <strong>Add Log</strong> button</li>
                <li>Check <strong>"Create reminder for follow-up"</strong> and pick a date</li>
                <li>Save — the reminder will appear here automatically</li>
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}