// src/components/Reports/FollowupReports.jsx
// ─────────────────────────────────────────────────────────────
// Lead Follow-up Report Page — Travel CRM
// Matches CRM design system perfectly
// Reference: company/reports/lead_followup.php screenshot
// Features:
//   - Collapsible Filters & Settings (dark slate header)
//   - View Type / Days Ahead / Assigned To / Priority / Reminder Type / Apply
//   - Reset + Export CSV buttons
//   - 6 stat cards: Total, Overdue, Due Today, Urgent(3days), Upcoming, High Priority
//   - Follow-up Tasks table:
//       Checkbox | Due Date | Lead Details | Assigned To | Type | Priority | Title & Description | Lead Stage | Actions
//   - Bulk "Mark Selected as Completed" button
//   - Row checkboxes for bulk select
//   - Color-coded hot/fresh badges on lead phone number
//   - Action buttons: ✓ Complete | ℹ Info | 👁 View
//   - Show N entries + Search + Pagination
//   - Desktop table + Mobile cards (responsive)
//   - Skeleton loading + Toast
// ─────────────────────────────────────────────────────────────

import { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiFilter, FiRefreshCw, FiDownload, FiArrowLeft,
  FiChevronDown, FiChevronUp, FiSearch,
  FiChevronLeft, FiChevronRight, FiEye, FiInfo,
  FiCheck, FiClock, FiAlertTriangle, FiCalendar,
} from "react-icons/fi";
import {
  FaAngleDoubleLeft, FaAngleDoubleRight,
  FaFire, FaLeaf, FaSnowflake, FaExclamationTriangle,
  FaTasks, FaStar,
} from "react-icons/fa";
import { MdOutlineAssignment } from "react-icons/md";

// ── Uncomment when backend ready ─────────────────────────────
// import followupReportService from "../services/followupReportService";

/* ─── MOCK DATA ──────────────────────────────────────────────── */
const MOCK_TASKS = [
  { id:1,  dueDate:"Jun 01, 2026", dueTime:"20:07", overdueBy:"Overdue by 21 days", leadName:"Pratik",          leadPhone:"+918888888888", leadTemp:"Hot",   assignedTo:"deepti paul",              assignedUsername:"@deepti_paul",              type:"First Contact", priority:"High",   title:"Contact New Lead: Pratik",              desc:"New lead requires initial contact",                       stage:"Ready to Book", travelDate:"Jul 07", completed:false },
  { id:2,  dueDate:"Jun 02, 2026", dueTime:"15:30", overdueBy:"Overdue by 20 days", leadName:"Pratik",          leadPhone:"+918888888888", leadTemp:"Hot",   assignedTo:"deepti paul",              assignedUsername:"@deepti_paul",              type:"Follow Up",     priority:"Medium", title:"Follow-up: Pratik",                     desc:"Follow-up scheduled from log: CALL ON FRIDAY, NEED 4 STAR HOTEL", stage:"Ready to Book", travelDate:"Jul 07", completed:false },
  { id:3,  dueDate:"Jun 05, 2026", dueTime:"00:11", overdueBy:"Overdue by 17 days", leadName:"Priyanshu agrawal",leadPhone:"+91 83029 32798",leadTemp:"Fresh", assignedTo:"vaishnavi shrikant jagtap",assignedUsername:"@vaishnavi_jagtap",        type:"First Contact", priority:"High",   title:"Contact New Lead: Priyanshu agrawal",   desc:"New lead requires initial contact",                       stage:"New Lead",      travelDate:"Jun 27", completed:false },
  { id:4,  dueDate:"Jun 05, 2026", dueTime:"00:59", overdueBy:"Overdue by 17 days", leadName:"Pratik",          leadPhone:"8010214002",    leadTemp:"Fresh", assignedTo:"vaishnavi shrikant jagtap",assignedUsername:"@vaishnavi_jagtap",        type:"First Contact", priority:"High",   title:"Contact New Lead: Pratik",              desc:"New lead requires initial contact",                       stage:"New Lead",      travelDate:"Jun 13", completed:false },
  { id:5,  dueDate:"Jun 08, 2026", dueTime:"09:30", overdueBy:"Overdue by 14 days", leadName:"Anushka Narkhede",leadPhone:"+91 98765 11111",leadTemp:"Fresh", assignedTo:"vaishnavi shrikant jagtap",assignedUsername:"@vaishnavi_jagtap",        type:"First Contact", priority:"High",   title:"Contact New Lead: Anushka Narkhede",    desc:"New lead requires initial contact",                       stage:"New Lead",      travelDate:"Jul 01", completed:false },
  { id:6,  dueDate:"Jun 10, 2026", dueTime:"14:00", overdueBy:"Overdue by 12 days", leadName:"Ramesh Kumar",    leadPhone:"+91 99001 22222",leadTemp:"Hot",   assignedTo:"deepti paul",              assignedUsername:"@deepti_paul",              type:"Follow Up",     priority:"High",   title:"Follow-up: Ramesh Kumar",               desc:"Client needs quotation for Manali trip",                  stage:"Qualified",     travelDate:"Aug 15", completed:false },
  { id:7,  dueDate:"Jun 12, 2026", dueTime:"11:00", overdueBy:"Overdue by 10 days", leadName:"Sunita Verma",    leadPhone:"+91 91234 33333",leadTemp:"Fresh", assignedTo:"Shreyash_Shahi",           assignedUsername:"@Shreyash_Shahi",           type:"First Contact", priority:"Medium", title:"Contact New Lead: Sunita Verma",         desc:"New lead requires initial contact",                       stage:"New Lead",      travelDate:"Sep 01", completed:false },
  { id:8,  dueDate:"Jun 15, 2026", dueTime:"10:00", overdueBy:"Overdue by 7 days",  leadName:"Ajay Singh",      leadPhone:"+91 80001 44444",leadTemp:"Hot",   assignedTo:"deepti paul",              assignedUsername:"@deepti_paul",              type:"Follow Up",     priority:"High",   title:"Follow-up: Ajay Singh",                 desc:"Send quotation for Nepal package",                        stage:"Proposal Sent", travelDate:"Oct 10", completed:false },
  { id:9,  dueDate:"Jun 18, 2026", dueTime:"16:00", overdueBy:"Overdue by 4 days",  leadName:"Meena Sharma",    leadPhone:"+91 70001 55555",leadTemp:"Fresh", assignedTo:"vaishnavi shrikant jagtap",assignedUsername:"@vaishnavi_jagtap",        type:"First Contact", priority:"Medium", title:"Contact New Lead: Meena Sharma",         desc:"New lead requires initial contact",                       stage:"New Lead",      travelDate:"Nov 05", completed:false },
  { id:10, dueDate:"Jun 20, 2026", dueTime:"09:00", overdueBy:"Overdue by 2 days",  leadName:"Vikram Patel",    leadPhone:"+91 60001 66666",leadTemp:"Hot",   assignedTo:"Shreyash_Shahi",           assignedUsername:"@Shreyash_Shahi",           type:"Follow Up",     priority:"High",   title:"Follow-up: Vikram Patel",               desc:"Client interested in Goa package — confirm dates",        stage:"Contacted",     travelDate:"Dec 01", completed:false },
  { id:11, dueDate:"Jun 23, 2026", dueTime:"11:30", overdueBy:"Upcoming",           leadName:"Pooja Nair",      leadPhone:"+91 50001 77777",leadTemp:"Fresh", assignedTo:"deepti paul",              assignedUsername:"@deepti_paul",              type:"First Contact", priority:"Low",    title:"Contact New Lead: Pooja Nair",           desc:"New lead requires initial contact",                       stage:"New Lead",      travelDate:"Jan 10", completed:false },
  { id:12, dueDate:"Jun 25, 2026", dueTime:"15:00", overdueBy:"Upcoming",           leadName:"Rohit Joshi",     leadPhone:"+91 40001 88888",leadTemp:"Hot",   assignedTo:"Shreyash_Shahi",           assignedUsername:"@Shreyash_Shahi",           type:"Follow Up",     priority:"High",   title:"Follow-up: Rohit Joshi",                desc:"Confirm hotel and flight for Bhutan tour",                stage:"Ready to Book", travelDate:"Feb 14", completed:false },
];

const VIEW_TYPES      = ["All","Upcoming","Overdue","Due Today","Completed"];
const DAYS_AHEAD_OPTS = ["1 day","3 days","7 days","14 days","30 days","All"];
const PRIORITY_OPTS   = ["All Priorities","High","Medium","Low"];
const REMINDER_TYPES  = ["All Types","First Contact","Follow Up","Payment Reminder","Document Collection","Booking Confirmation","Custom"];
const SHOW_ENTRIES    = ["10","25","50","100"];

const USERS_LIST = ["All Users","deepti paul","vaishnavi shrikant jagtap","Shreyash Raghvendra Shahi"];

const PRIORITY_CFG = {
  High:   { bg:"bg-red-100",    text:"text-red-700",    border:"border-red-200"   },
  Medium: { bg:"bg-amber-100",  text:"text-amber-700",  border:"border-amber-200" },
  Low:    { bg:"bg-slate-100",  text:"text-slate-500",  border:"border-slate-200" },
};
const TYPE_CFG = {
  "First Contact":          { bg:"bg-green-500",  text:"text-white" },
  "Follow Up":              { bg:"bg-blue-500",   text:"text-white" },
  "Payment Reminder":       { bg:"bg-amber-500",  text:"text-white" },
  "Document Collection":    { bg:"bg-purple-500", text:"text-white" },
  "Booking Confirmation":   { bg:"bg-teal-500",   text:"text-white" },
  "Custom":                 { bg:"bg-slate-500",  text:"text-white" },
};
const STAGE_CFG = {
  "Ready to Book":  { bg:"bg-blue-600",    text:"text-white" },
  "New Lead":       { bg:"bg-slate-600",   text:"text-white" },
  "Contacted":      { bg:"bg-cyan-600",    text:"text-white" },
  "Qualified":      { bg:"bg-indigo-600",  text:"text-white" },
  "Proposal Sent":  { bg:"bg-purple-600",  text:"text-white" },
  "Converted":      { bg:"bg-green-600",   text:"text-white" },
  "Lost":           { bg:"bg-red-600",     text:"text-white" },
};
const TEMP_CFG = {
  Hot:   { bg:"bg-red-500",   label:"Hot"  },
  Warm:  { bg:"bg-amber-500", label:"Warm" },
  Cold:  { bg:"bg-blue-400",  label:"Cold" },
  Fresh: { bg:"bg-blue-500",  label:"Fresh"},
};

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
    if(!value){ setDisp(0); return; }
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

/* ─── MAIN PAGE ──────────────────────────────────────────────── */
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
  const [applied,      setApplied]      = useState({ viewType:"All", daysAhead:"7 days", assignedTo:"All Users", priority:"All Priorities", reminderType:"All Types" });

  /* data + selection state */
  const [tasks,     setTasks]     = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [toast,     setToast]     = useState(null);
  const [selected,  setSelected]  = useState(new Set());

  const showToast = useCallback((msg, type="success")=>setToast({msg,type}),[]);

  useEffect(()=>{
    setLoading(true);
    // BACKEND: followupReportService.getTasks(applied)
    setTimeout(()=>{ setTasks(MOCK_TASKS); setLoading(false); }, 700);
  },[applied]);

  /* apply / reset */
  const handleApply = () => {
    setApplied({ viewType, daysAhead, assignedTo, priority, reminderType });
    setPage(1); setSelected(new Set());
    showToast("Filters applied.");
  };
  const handleReset = () => {
    setViewType("All"); setDaysAhead("7 days");
    setAssignedTo("All Users"); setPriority("All Priorities"); setReminderType("All Types");
    setApplied({ viewType:"All", daysAhead:"7 days", assignedTo:"All Users", priority:"All Priorities", reminderType:"All Types" });
    setSearch(""); setPage(1); setSelected(new Set());
    showToast("Filters reset.");
  };

  /* export CSV */
  const handleExportCSV = () => {
    const headers = ["ID","Due Date","Due Time","Overdue By","Lead Name","Phone","Temperature","Assigned To","Type","Priority","Title","Description","Lead Stage","Travel Date","Completed"];
    const rows = filtered.map(t=>[
      t.id, t.dueDate, t.dueTime, t.overdueBy, t.leadName, t.leadPhone, t.leadTemp,
      t.assignedTo, t.type, t.priority, `"${t.title}"`, `"${t.desc}"`,
      t.stage, t.travelDate, t.completed
    ]);
    const csv = [headers,...rows].map(r=>r.join(",")).join("\n");
    const blob = new Blob([csv],{type:"text/csv"});
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a"); a.href=url;
    a.download = "followup-report.csv";
    a.click(); URL.revokeObjectURL(url);
    showToast("CSV exported successfully.");
  };

  /* bulk complete */
  const handleMarkCompleted = () => {
    if(selected.size===0){ showToast("Select at least one task.","error"); return; }
    setTasks(prev=>prev.map(t=>selected.has(t.id)?{...t,completed:true}:t));
    showToast(`${selected.size} task${selected.size>1?"s":""} marked as completed.`);
    setSelected(new Set());
  };

  /* single complete */
  const handleComplete = (id) => {
    setTasks(prev=>prev.map(t=>t.id===id?{...t,completed:true}:t));
    showToast("Task marked as completed.");
  };

  /* checkbox logic */
  const toggleSelect = (id) => {
    setSelected(prev=>{ const n=new Set(prev); n.has(id)?n.delete(id):n.add(id); return n; });
  };
  const toggleAll = () => {
    if(selected.size===pageData.length) setSelected(new Set());
    else setSelected(new Set(pageData.map(t=>t.id)));
  };

  /* filtered */
  const filtered = useMemo(()=>
    tasks.filter(t=>{
      const q = search.toLowerCase();
      if(q && !t.leadName.toLowerCase().includes(q) && !t.title.toLowerCase().includes(q) && !t.assignedTo.toLowerCase().includes(q)) return false;
      if(applied.assignedTo!=="All Users"     && t.assignedTo!==applied.assignedTo)       return false;
      if(applied.priority!=="All Priorities"  && t.priority!==applied.priority)           return false;
      if(applied.reminderType!=="All Types"   && t.type!==applied.reminderType)           return false;
      if(applied.viewType==="Overdue"         && !t.overdueBy.toLowerCase().includes("overdue")) return false;
      if(applied.viewType==="Completed"       && !t.completed)                             return false;
      if(applied.viewType==="Upcoming"        && t.overdueBy.toLowerCase().includes("overdue"))  return false;
      return true;
    })
  ,[tasks,search,applied]);

  /* summary */
  const summary = useMemo(()=>({
    total:    tasks.length,
    overdue:  tasks.filter(t=>t.overdueBy.toLowerCase().includes("overdue")).length,
    dueToday: tasks.filter(t=>t.dueDate==="Jun 22, 2026").length,
    urgent:   tasks.filter(t=>{ const d=new Date(t.dueDate); const n=new Date(); return (d-n)/(1000*60*60*24)<=3&&(d-n)>0; }).length,
    upcoming: tasks.filter(t=>t.overdueBy==="Upcoming").length,
    highPri:  tasks.filter(t=>t.priority==="High").length,
  }),[tasks]);

  /* pagination */
  const pp         = Number(showEntries);
  const totalPages = Math.max(1,Math.ceil(filtered.length/pp));
  const pageData   = filtered.slice((page-1)*pp, page*pp);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100"
      style={{fontFamily:"'Plus Jakarta Sans', system-ui, sans-serif"}}>
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

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}

      {/* ── PAGE HEADER ── */}
      <div className="bg-white/70 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-amber-200 flex-shrink-0">
                <FiClock className="w-5 h-5"/>
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">Lead Follow-up Report</h1>
                <p className="text-sm text-slate-400 mt-0.5">
                  Track upcoming and overdue follow-ups
                  <span className="hidden sm:inline ml-3 text-slate-300">|</span>
                  <span className="hidden sm:inline ml-3 text-xs">
                    <span className="hover:text-blue-600 cursor-pointer transition-colors" onClick={()=>navigate("/")}>Home</span>
                    <span className="mx-1 text-slate-300">/</span>
                    <span className="hover:text-blue-600 cursor-pointer transition-colors" onClick={()=>navigate("/ReportsDashboard")}>Reports</span>
                    <span className="mx-1 text-slate-300">/</span>
                    <span className="text-blue-600 font-bold">Follow-up Report</span>
                  </span>
                </p>
              </div>
            </div>
            <button onClick={()=>navigate("/ReportsDashboard")}
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
          <button type="button" onClick={()=>setFiltersOpen(v=>!v)}
            className="w-full flex items-center justify-between px-5 py-4 bg-slate-600 hover:bg-slate-700 transition-colors">
            <div className="flex items-center gap-2.5">
              <FiFilter className="w-4 h-4 text-white"/>
              <span className="text-sm font-extrabold text-white">Filters &amp; Settings</span>
            </div>
            {filtersOpen
              ? <FiChevronUp   className="w-4 h-4 text-white"/>
              : <FiChevronDown className="w-4 h-4 text-white"/>}
          </button>

          {filtersOpen && (
            <div className="p-5 space-y-4">
              {/* Row: View Type | Days Ahead | Assigned To | Priority | Reminder Type | Apply */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
                {[
                  { label:"View Type",     val:viewType,     set:setViewType,     opts:VIEW_TYPES      },
                  { label:"Days Ahead",    val:daysAhead,    set:setDaysAhead,    opts:DAYS_AHEAD_OPTS },
                  { label:"Assigned To",   val:assignedTo,   set:setAssignedTo,   opts:USERS_LIST      },
                  { label:"Priority",      val:priority,     set:setPriority,     opts:PRIORITY_OPTS   },
                  { label:"Reminder Type", val:reminderType, set:setReminderType, opts:REMINDER_TYPES  },
                ].map(({label,val,set,opts})=>(
                  <div key={label}>
                    <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wide mb-1.5">{label}</label>
                    <div className="relative">
                      <select value={val} onChange={e=>set(e.target.value)} className={inputCls+" pr-8"}>
                        {opts.map(o=><option key={o}>{o}</option>)}
                      </select>
                      <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none"/>
                    </div>
                  </div>
                ))}
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

        {/* ── 6 STAT CARDS ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { icon:<FaTasks className="text-2xl"/>,             label:"Total Follow-ups", value:summary.total,    bg:"bg-gradient-to-br from-cyan-500 to-cyan-600",     delay:0   },
            { icon:<FaExclamationTriangle className="text-2xl"/>,label:"Overdue",          value:summary.overdue,  bg:"bg-gradient-to-br from-red-500 to-red-600",       delay:50  },
            { icon:<FiCalendar className="text-2xl"/>,           label:"Due Today",        value:summary.dueToday, bg:"bg-gradient-to-br from-amber-500 to-amber-600",   delay:100 },
            { icon:<span className="text-2xl">⚡</span>,         label:"Urgent (3 days)",  value:summary.urgent,   bg:"bg-gradient-to-br from-blue-600 to-blue-700",     delay:150 },
            { icon:<FiCalendar className="text-2xl"/>,           label:"Upcoming",         value:summary.upcoming, bg:"bg-gradient-to-br from-green-500 to-emerald-600", delay:200 },
            { icon:<FaStar className="text-2xl"/>,               label:"High Priority",    value:summary.highPri,  bg:"bg-gradient-to-br from-slate-500 to-slate-600",   delay:250 },
          ].map(s=><StatCard key={s.label} {...s}/>)}
        </div>

        {/* ── FOLLOW-UP TASKS TABLE CARD ── */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden fade-up">

          {/* Card header */}
          <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <MdOutlineAssignment className="w-4 h-4 text-amber-500"/>
              <h2 className="text-base font-extrabold text-slate-700">Follow-up Tasks</h2>
              <span className="text-xs font-extrabold bg-blue-600 text-white px-2.5 py-1 rounded-full">
                {filtered.length} tasks
              </span>
            </div>
            {/* Bulk Mark Complete */}
            <button onClick={handleMarkCompleted}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700
                text-white text-xs font-bold shadow-md shadow-blue-200 transition-all">
              <FiCheck className="w-3.5 h-3.5"/> Mark Selected as Completed
              {selected.size>0 && <span className="bg-white text-blue-600 text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">{selected.size}</span>}
            </button>
          </div>

          {/* Show N entries + Search */}
          <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/60">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">Show</span>
                <div className="relative">
                  <select value={showEntries} onChange={e=>{ setShowEntries(e.target.value); setPage(1); }}
                    className="pl-2.5 pr-6 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700 font-bold focus:outline-none appearance-none cursor-pointer">
                    {SHOW_ENTRIES.map(o=><option key={o}>{o}</option>)}
                  </select>
                  <FiChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none"/>
                </div>
                <span className="text-xs text-slate-500 font-medium">entries</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">Search:</span>
                <div className="relative">
                  <FiSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400"/>
                  <input value={search} onChange={e=>{ setSearch(e.target.value); setPage(1); }}
                    placeholder="Lead name, title, assignee…"
                    className="pl-7 pr-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700 placeholder-slate-400
                      focus:border-blue-400 focus:ring-2 focus:ring-blue-50 outline-none transition-all w-52"/>
                </div>
              </div>
            </div>
          </div>

          {/* ── DESKTOP TABLE ── */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              <thead className="bg-slate-50/80 border-b border-slate-100">
                <tr>
                  {/* Checkbox */}
                  <th className="px-3 py-3.5 w-10">
                    <input type="checkbox"
                      checked={pageData.length>0&&selected.size===pageData.length}
                      onChange={toggleAll}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-400 cursor-pointer"/>
                  </th>
                  {["Due Date","Lead Details","Assigned To","Type","Priority","Title & Description","Lead Stage","Actions"].map(h=>(
                    <th key={h} className="px-3 py-3.5 text-left text-xs font-extrabold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading
                  ? [...Array(5)].map((_,i)=><SkeletonRow key={i}/>)
                  : pageData.length===0
                  ? (
                    <tr>
                      <td colSpan={9} className="text-center py-16">
                        <div className="text-5xl mb-3">📋</div>
                        <p className="text-base font-extrabold text-slate-600 mb-1">No Follow-up Tasks Found</p>
                        <p className="text-sm text-slate-400 mb-4">Try adjusting your filters.</p>
                        <button onClick={handleReset}
                          className="px-4 py-2 rounded-xl bg-blue-50 text-blue-600 font-bold text-sm hover:bg-blue-100 transition-all">
                          Reset Filters
                        </button>
                      </td>
                    </tr>
                  )
                  : pageData.map((task,idx)=>{
                    const tc = TYPE_CFG[task.type]     || { bg:"bg-slate-400", text:"text-white" };
                    const pc = PRIORITY_CFG[task.priority] || PRIORITY_CFG.Low;
                    const sc = STAGE_CFG[task.stage]   || { bg:"bg-slate-500", text:"text-white" };
                    const tm = TEMP_CFG[task.leadTemp] || TEMP_CFG.Fresh;
                    const isOverdue = task.overdueBy.toLowerCase().includes("overdue");
                    return (
                      <tr key={task.id}
                        className={`group transition-all duration-150 hover:shadow-[inset_3px_0_0_#2563eb]
                          ${task.completed?"opacity-50":""}
                          ${isOverdue?"bg-red-50/30 hover:bg-red-50/50":"hover:bg-blue-50/30"}`}
                        style={{animation:"fadeUp .35s ease both", animationDelay:`${idx*25}ms`}}>
                        {/* Checkbox */}
                        <td className="px-3 py-3.5">
                          <input type="checkbox"
                            checked={selected.has(task.id)}
                            onChange={()=>toggleSelect(task.id)}
                            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-400 cursor-pointer"/>
                        </td>
                        {/* Due Date */}
                        <td className="px-3 py-3.5 whitespace-nowrap">
                          <p className={`text-sm font-bold ${isOverdue?"text-red-600":"text-slate-800"}`}>{task.dueDate}</p>
                          <p className="text-xs text-slate-400 font-mono">{task.dueTime}</p>
                          <p className={`text-[11px] font-bold mt-0.5 ${isOverdue?"text-red-500":"text-green-600"}`}>{task.overdueBy}</p>
                        </td>
                        {/* Lead Details */}
                        <td className="px-3 py-3.5">
                          <p className="text-sm font-extrabold text-blue-600 mb-0.5">{task.leadName}</p>
                          <p className="text-xs text-slate-500 font-mono mb-1">{task.leadPhone}</p>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full text-white ${tm.bg}`}>
                            {tm.label}
                          </span>
                        </td>
                        {/* Assigned To */}
                        <td className="px-3 py-3.5">
                          <p className="text-sm font-semibold text-slate-800 capitalize">{task.assignedTo}</p>
                          <p className="text-xs text-slate-400">{task.assignedUsername}</p>
                        </td>
                        {/* Type */}
                        <td className="px-3 py-3.5">
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${tc.bg} ${tc.text}`}>
                            {task.type}
                          </span>
                        </td>
                        {/* Priority */}
                        <td className="px-3 py-3.5">
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${pc.border} ${pc.bg} ${pc.text}`}>
                            {task.priority}
                          </span>
                        </td>
                        {/* Title & Description */}
                        <td className="px-3 py-3.5 max-w-xs">
                          <p className="text-sm font-bold text-slate-800 mb-0.5 leading-snug">{task.title}</p>
                          <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{task.desc}</p>
                        </td>
                        {/* Lead Stage */}
                        <td className="px-3 py-3.5">
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${sc.bg} ${sc.text} block mb-1 text-center`}>
                            {task.stage}
                          </span>
                          <p className="text-[11px] text-slate-400 text-center">Travel: {task.travelDate}</p>
                        </td>
                        {/* Actions */}
                        <td className="px-3 py-3.5">
                          <div className="flex flex-col gap-1.5">
                            <button onClick={()=>handleComplete(task.id)} title="Mark Complete" disabled={task.completed}
                              className="w-8 h-8 rounded-lg bg-green-50 hover:bg-green-100 border border-green-200 text-green-600
                                flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                              <FiCheck className="w-3.5 h-3.5"/>
                            </button>
                            <button title="View Info"
                              className="w-8 h-8 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-600
                                flex items-center justify-center transition-all">
                              <FiInfo className="w-3.5 h-3.5"/>
                            </button>
                            <button title="View Lead"
                              className="w-8 h-8 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-600
                                flex items-center justify-center transition-all">
                              <FiEye className="w-3.5 h-3.5"/>
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
          <div className="lg:hidden p-4 space-y-3">
            {loading
              ? [...Array(4)].map((_,i)=>(
                  <div key={i} className="bg-white rounded-2xl border border-slate-100 p-4 space-y-2 animate-pulse">
                    {[...Array(3)].map((_,j)=><div key={j} className="h-4 bg-slate-200 rounded-lg" style={{width:`${40+Math.random()*50}%`}}/>)}
                  </div>
                ))
              : pageData.length===0
              ? (
                <div className="text-center py-12">
                  <div className="text-5xl mb-3">📋</div>
                  <p className="font-extrabold text-slate-600 mb-2">No Tasks Found</p>
                  <button onClick={handleReset} className="px-4 py-2 rounded-xl bg-blue-50 text-blue-600 font-bold text-sm">Reset</button>
                </div>
              )
              : pageData.map((task,idx)=>{
                const tc = TYPE_CFG[task.type]     || { bg:"bg-slate-400", text:"text-white" };
                const pc = PRIORITY_CFG[task.priority] || PRIORITY_CFG.Low;
                const sc = STAGE_CFG[task.stage]   || { bg:"bg-slate-500", text:"text-white" };
                const tm = TEMP_CFG[task.leadTemp] || TEMP_CFG.Fresh;
                const isOverdue = task.overdueBy.toLowerCase().includes("overdue");
                return (
                  <div key={task.id}
                    className={`rounded-2xl border shadow-sm p-4 space-y-3 fade-up
                      ${isOverdue?"bg-red-50/50 border-red-200":"bg-white border-slate-100"}`}
                    style={{animationDelay:`${idx*40}ms`}}>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <input type="checkbox" checked={selected.has(task.id)} onChange={()=>toggleSelect(task.id)}
                          className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer"/>
                        <div>
                          <p className="text-sm font-extrabold text-blue-600">{task.leadName}</p>
                          <p className="text-xs text-slate-400 font-mono">{task.leadPhone}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full text-white ${tm.bg}`}>{tm.label}</span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-lg border ${pc.border} ${pc.bg} ${pc.text}`}>{task.priority}</span>
                      </div>
                    </div>
                    {/* Due date + overdue */}
                    <div className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg ${isOverdue?"bg-red-100 text-red-700":"bg-green-50 text-green-700"}`}>
                      <FiClock className="w-3 h-3 flex-shrink-0"/>
                      <span className="font-bold">{task.dueDate} {task.dueTime}</span>
                      <span className="ml-auto font-extrabold">{task.overdueBy}</span>
                    </div>
                    {/* Title + desc */}
                    <div>
                      <p className="text-sm font-bold text-slate-800 mb-0.5">{task.title}</p>
                      <p className="text-xs text-slate-500 line-clamp-2">{task.desc}</p>
                    </div>
                    {/* Badges row */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${tc.bg} ${tc.text}`}>{task.type}</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${sc.bg} ${sc.text}`}>{task.stage}</span>
                      <span className="text-xs text-slate-400">Travel: {task.travelDate}</span>
                    </div>
                    {/* Assigned + actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <div>
                        <p className="text-xs font-bold text-slate-700 capitalize">{task.assignedTo}</p>
                        <p className="text-[11px] text-slate-400">{task.assignedUsername}</p>
                      </div>
                      <div className="flex gap-1.5">
                        <button onClick={()=>handleComplete(task.id)} disabled={task.completed}
                          className="w-8 h-8 rounded-lg bg-green-50 border border-green-200 text-green-600 flex items-center justify-center disabled:opacity-40">
                          <FiCheck className="w-3 h-3"/>
                        </button>
                        <button className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center">
                          <FiInfo className="w-3 h-3"/>
                        </button>
                        <button className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center">
                          <FiEye className="w-3 h-3"/>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* ── PAGINATION ── */}
          {filtered.length > 0 && (
            <div className="px-5 py-4 border-t border-slate-100 bg-slate-50/60 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-slate-400 font-medium">
                Showing <span className="font-bold text-slate-600">{(page-1)*pp+1}</span> to{" "}
                <span className="font-bold text-slate-600">{Math.min(page*pp,filtered.length)}</span> of{" "}
                <span className="font-bold text-slate-600">{filtered.length}</span> entries
              </p>
              <div className="flex items-center gap-2">
                <button disabled={page===1} onClick={()=>setPage(1)}
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-500 hover:border-blue-300 hover:text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                  <FaAngleDoubleLeft className="inline"/>
                </button>
                <button disabled={page===1} onClick={()=>setPage(p=>p-1)}
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-500 hover:border-blue-300 hover:text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1">
                  <FiChevronLeft className="w-3 h-3"/> Previous
                </button>
                {Array.from({length:totalPages},(_,i)=>i+1)
                  .filter(p=>p===1||p===totalPages||Math.abs(p-page)<=1)
                  .reduce((acc,p,i,arr)=>{ if(i>0&&p-arr[i-1]>1) acc.push("…"); acc.push(p); return acc; },[])
                  .map((p,i)=>
                    typeof p==="string"
                      ? <span key={`e${i}`} className="px-1 text-xs text-slate-400">…</span>
                      : <button key={p} onClick={()=>setPage(p)}
                          className={`w-8 h-8 rounded-lg text-xs font-bold border transition-all
                            ${page===p?"bg-blue-600 border-blue-600 text-white shadow-sm":"bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600"}`}>
                          {p}
                        </button>
                  )}
                <button disabled={page===totalPages} onClick={()=>setPage(p=>p+1)}
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-500 hover:border-blue-300 hover:text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1">
                  Next <FiChevronRight className="w-3 h-3"/>
                </button>
                <button disabled={page===totalPages} onClick={()=>setPage(totalPages)}
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-500 hover:border-blue-300 hover:text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                  <FaAngleDoubleRight className="inline"/>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}