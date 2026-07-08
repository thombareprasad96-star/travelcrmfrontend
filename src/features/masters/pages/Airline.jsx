import { useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plane, Plus, Search, Edit2, Trash2, Eye, X, Upload,
  CheckCircle2, AlertCircle, Clock, ChevronUp, ChevronDown,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  Globe, Calendar, Tag
} from "lucide-react";

const STATUS_STYLES = {
  Active: "bg-green-50 text-green-700 border border-green-200",
  Inactive: "bg-gray-100 text-gray-500 border border-gray-200",
  Suspended: "bg-red-50 text-red-600 border border-red-200",
};

const CARD_THEMES = [
  { bg: "from-blue-500 via-blue-600 to-indigo-700", badge: "bg-blue-400/30 text-blue-50", icon: "bg-white/20", stat: "bg-white/10" },
  { bg: "from-orange-400 via-orange-500 to-red-500", badge: "bg-orange-400/30 text-orange-50", icon: "bg-white/20", stat: "bg-white/10" },
  { bg: "from-red-500 via-red-600 to-rose-700", badge: "bg-red-400/30 text-red-50", icon: "bg-white/20", stat: "bg-white/10" },
  { bg: "from-purple-500 via-purple-600 to-violet-700", badge: "bg-purple-400/30 text-purple-50", icon: "bg-white/20", stat: "bg-white/10" },
  { bg: "from-sky-500 via-sky-600 to-cyan-600", badge: "bg-sky-400/30 text-sky-50", icon: "bg-white/20", stat: "bg-white/10" },
  { bg: "from-rose-500 via-rose-600 to-pink-700", badge: "bg-rose-400/30 text-rose-50", icon: "bg-white/20", stat: "bg-white/10" },
  { bg: "from-teal-500 via-teal-600 to-emerald-700", badge: "bg-teal-400/30 text-teal-50", icon: "bg-white/20", stat: "bg-white/10" },
  { bg: "from-amber-500 via-amber-600 to-yellow-600", badge: "bg-amber-400/30 text-amber-50", icon: "bg-white/20", stat: "bg-white/10" },
  { bg: "from-fuchsia-500 via-fuchsia-600 to-purple-700", badge: "bg-fuchsia-400/30 text-fuchsia-50", icon: "bg-white/20", stat: "bg-white/10" },
  { bg: "from-lime-500 via-green-500 to-emerald-600", badge: "bg-lime-400/30 text-lime-50", icon: "bg-white/20", stat: "bg-white/10" },
  { bg: "from-cyan-500 via-cyan-600 to-blue-600", badge: "bg-cyan-400/30 text-cyan-50", icon: "bg-white/20", stat: "bg-white/10" },
  { bg: "from-indigo-500 via-indigo-600 to-blue-700", badge: "bg-indigo-400/30 text-indigo-50", icon: "bg-white/20", stat: "bg-white/10" },
];

const AIRLINE_COLORS = CARD_THEMES.map((_, i) => ["from-blue-500 to-blue-600","from-orange-400 to-orange-500","from-red-500 to-red-600","from-purple-500 to-purple-600","from-sky-500 to-sky-600","from-rose-500 to-rose-600","from-teal-500 to-teal-600"][i % 7]);

const dummyAirlines = [
  { id: 1, name: "Air India", status: "Active", createdAt: "2023-01-15", logo: null, initials: "AI", color: "from-red-500 to-red-700", iata: "AI", country: "India", fleet: 142 },
  { id: 2, name: "IndiGo", status: "Active", createdAt: "2023-03-22", logo: null, initials: "6E", color: "from-indigo-500 to-indigo-700", iata: "6E", country: "India", fleet: 300 },
  { id: 3, name: "SpiceJet", status: "Active", createdAt: "2023-05-10", logo: null, initials: "SJ", color: "from-orange-500 to-red-500", iata: "SG", country: "India", fleet: 90 },
  { id: 4, name: "Vistara", status: "Inactive", createdAt: "2023-07-01", logo: null, initials: "UK", color: "from-purple-600 to-purple-800", iata: "UK", country: "India", fleet: 53 },
  { id: 5, name: "Emirates", status: "Active", createdAt: "2023-08-18", logo: null, initials: "EK", color: "from-red-600 to-yellow-600", iata: "EK", country: "UAE", fleet: 260 },
  { id: 6, name: "Qatar Airways", status: "Active", createdAt: "2023-09-05", logo: null, initials: "QR", color: "from-rose-700 to-rose-900", iata: "QR", country: "Qatar", fleet: 230 },
  { id: 7, name: "Singapore Airlines", status: "Active", createdAt: "2023-11-20", logo: null, initials: "SQ", color: "from-blue-600 to-cyan-600", iata: "SQ", country: "Singapore", fleet: 131 },
  { id: 8, name: "Lufthansa", status: "Active", createdAt: "2024-01-10", logo: null, initials: "LH", color: "from-yellow-500 to-yellow-600", iata: "LH", country: "Germany", fleet: 280 },
  { id: 9, name: "British Airways", status: "Active", createdAt: "2024-02-14", logo: null, initials: "BA", color: "from-blue-700 to-blue-900", iata: "BA", country: "UK", fleet: 250 },
  { id: 10, name: "Air France", status: "Inactive", createdAt: "2024-03-01", logo: null, initials: "AF", color: "from-sky-600 to-blue-700", iata: "AF", country: "France", fleet: 220 },
  { id: 11, name: "Turkish Airlines", status: "Active", createdAt: "2024-03-20", logo: null, initials: "TK", color: "from-red-600 to-red-800", iata: "TK", country: "Turkey", fleet: 380 },
  { id: 12, name: "Etihad Airways", status: "Suspended", createdAt: "2024-04-05", logo: null, initials: "EY", color: "from-amber-500 to-amber-700", iata: "EY", country: "UAE", fleet: 100 },
];

const PAGE_SIZE_OPTIONS = [4, 8, 12];

function formatDate(str) {
  return new Date(str).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function AirlineLogo({ airline, size = "md" }) {
  const sz = size === "sm" ? "w-8 h-8 text-xs" : size === "lg" ? "w-16 h-16 text-lg" : "w-12 h-12 text-sm";
  if (airline.logo) return <img src={airline.logo} alt={airline.name} className={`${sz} rounded-2xl object-contain bg-white border border-white/30 shadow-lg`} />;
  return (
    <div className={`${sz} rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-lg flex-shrink-0`}>
      <span className="font-black text-white leading-none">{airline.initials}</span>
    </div>
  );
}

function StatusBadge({ status }) {
  const icons = { Active: <CheckCircle2 size={11} />, Inactive: <Clock size={11} />, Suspended: <AlertCircle size={11} /> };
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[status] || STATUS_STYLES.Inactive}`}>
      {icons[status]}{status}
    </span>
  );
}

function AirlineCard({ airline, theme, onView, onEdit, onDelete }) {
  return (
    <div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group">
      {/* Colorful top section */}
      <div className={`bg-gradient-to-br ${theme.bg} p-5 relative overflow-hidden`}>
        {/* Decorative circles */}
        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/10" />
        <div className="absolute -bottom-8 -left-4 w-20 h-20 rounded-full bg-white/10" />
        <div className="absolute top-1/2 right-8 w-10 h-10 rounded-full bg-white/5" />

        <div className="relative flex items-start justify-between">
          <div className="flex items-center gap-3">
            <AirlineLogo airline={airline} size="md" />
            <div>
              <h3 className="font-black text-white text-base leading-tight">{airline.name}</h3>
              <div className="flex items-center gap-1.5 mt-1">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${theme.badge}`}>{airline.iata}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${theme.badge} flex items-center gap-1`}>
                  <Globe size={9} />{airline.country}
                </span>
              </div>
            </div>
          </div>
          <StatusBadge status={airline.status} />
        </div>

        {/* Stats row */}
        <div className="relative mt-4 grid grid-cols-2 gap-2">
          <div className={`${theme.stat} rounded-xl px-3 py-2`}>
            <p className="text-white/60 text-xs">Fleet Size</p>
            <p className="text-white font-bold text-lg leading-none mt-0.5">{airline.fleet}</p>
          </div>
          <div className={`${theme.stat} rounded-xl px-3 py-2`}>
            <p className="text-white/60 text-xs">Added</p>
            <p className="text-white font-semibold text-xs leading-none mt-1">{formatDate(airline.createdAt)}</p>
          </div>
        </div>
      </div>

      {/* White bottom action bar */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-t-0">
        <div className="flex items-center gap-1.5">
          <Tag size={12} className="text-gray-400" />
          <span className="text-xs text-gray-400">ID #{String(airline.id).padStart(4, "0")}</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => onView(airline)} title="View"
            className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition active:scale-90">
            <Eye size={14} />
          </button>
          <button onClick={() => onEdit(airline)} title="Edit"
            className="p-1.5 rounded-lg hover:bg-amber-50 text-gray-400 hover:text-amber-600 transition active:scale-90">
            <Edit2 size={14} />
          </button>
          <button onClick={() => onDelete(airline)} title="Delete"
            className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition active:scale-90">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

function Pagination({ current, total, pageSize, onPage, onPageSize, totalItems }) {
  const pages = Math.ceil(total / pageSize);
  if (pages <= 1 && pageSize >= total) return null;

  const getPages = () => {
    if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1);
    if (current <= 4) return [1, 2, 3, 4, 5, "...", pages];
    if (current >= pages - 3) return [1, "...", pages - 4, pages - 3, pages - 2, pages - 1, pages];
    return [1, "...", current - 1, current, current + 1, "...", pages];
  };

  const from = (current - 1) * pageSize + 1;
  const to = Math.min(current * pageSize, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-2 py-1">
      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-500">Showing <span className="font-semibold text-gray-700">{from}–{to}</span> of <span className="font-semibold text-gray-700">{totalItems}</span></span>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-gray-400">Per page:</span>
          <select value={pageSize} onChange={e => onPageSize(Number(e.target.value))}
            className="border border-gray-200 rounded-lg px-2 py-1 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
            {PAGE_SIZE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button onClick={() => onPage(1)} disabled={current === 1}
          className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 disabled:opacity-30 disabled:cursor-not-allowed transition">
          <ChevronsLeft size={14} />
        </button>
        <button onClick={() => onPage(current - 1)} disabled={current === 1}
          className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 disabled:opacity-30 disabled:cursor-not-allowed transition">
          <ChevronLeft size={14} />
        </button>

        {getPages().map((p, i) => (
          p === "..." ? (
            <span key={`dot-${i}`} className="w-8 h-8 flex items-center justify-center text-gray-400 text-sm">…</span>
          ) : (
            <button key={p} onClick={() => onPage(p)}
              className={`w-8 h-8 rounded-lg text-xs font-semibold border transition ${p === current ? "bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-200" : "border-gray-200 text-gray-600 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600"}`}>
              {p}
            </button>
          )
        ))}

        <button onClick={() => onPage(current + 1)} disabled={current === pages}
          className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 disabled:opacity-30 disabled:cursor-not-allowed transition">
          <ChevronRight size={14} />
        </button>
        <button onClick={() => onPage(pages)} disabled={current === pages}
          className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 disabled:opacity-30 disabled:cursor-not-allowed transition">
          <ChevronsRight size={14} />
        </button>
      </div>
    </div>
  );
}

function Modal({ show, onClose, children }) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(15,23,42,0.6)", backdropFilter: "blur(4px)" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[600px] max-h-[90vh] overflow-y-auto transform transition-all duration-200 animate-in fade-in zoom-in-95">
        {children}
      </div>
    </div>
  );
}

function ViewModal({ airline, onClose }) {
  if (!airline) return null;
  const theme = CARD_THEMES[airline.id % CARD_THEMES.length];
  return (
    <Modal show={!!airline} onClose={onClose}>
      <div className={`bg-gradient-to-br ${theme.bg} rounded-t-2xl p-6 relative overflow-hidden`}>
        <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/10" />
        <div className="absolute -bottom-8 -left-4 w-24 h-24 rounded-full bg-white/10" />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <AirlineLogo airline={airline} size="lg" />
            <div>
              <h3 className="text-2xl font-black text-white">{airline.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${theme.badge}`}>{airline.iata}</span>
                <span className={`text-xs px-2.5 py-1 rounded-full ${theme.badge}`}>{airline.country}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition flex-shrink-0"><X size={18} /></button>
        </div>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-2 gap-3 mb-4">
          {[
            ["Airline ID", `#${String(airline.id).padStart(4, "0")}`],
            ["IATA Code", airline.iata],
            ["Country", airline.country],
            ["Fleet Size", `${airline.fleet} aircraft`],
            ["Date Added", formatDate(airline.createdAt)],
            ["Status", airline.status],
          ].map(([k, v]) => (
            <div key={k} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
              <p className="text-xs text-gray-400 mb-0.5">{k}</p>
              <p className="text-sm font-bold text-gray-800">{v}</p>
            </div>
          ))}
        </div>
        <div className="mb-2">
          <StatusBadge status={airline.status} />
        </div>
      </div>
      <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
        <button onClick={onClose} className="px-5 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition">Close</button>
      </div>
    </Modal>
  );
}

export default function AirlineMaster() {
  const navigate = useNavigate();
  const [airlines, setAirlines] = useState(dummyAirlines);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", status: "Active", logo: null, preview: null, country: "", fleet: "" });
  const [errors, setErrors] = useState({});
  const [drag, setDrag] = useState(false);
  const fileRef = useRef();

  const filtered = useMemo(() => {
    let list = airlines.filter(a => a.name.toLowerCase().includes(search.toLowerCase()) || a.country?.toLowerCase().includes(search.toLowerCase()) || a.iata?.toLowerCase().includes(search.toLowerCase()));
    list = [...list].sort((a, b) => {
      const va = a[sortField], vb = b[sortField];
      return sortDir === "asc" ? va > vb ? 1 : -1 : va < vb ? 1 : -1;
    });
    return list;
  }, [airlines, search, sortField, sortDir]);

  const paginated = useMemo(() => filtered.slice((page - 1) * pageSize, page * pageSize), [filtered, page, pageSize]);

  const handlePageSize = (s) => { setPageSize(s); setPage(1); };
  const handleSearch = (v) => { setSearch(v); setPage(1); };

  const openAdd = () => { setForm({ name: "", status: "Active", logo: null, preview: null, country: "", fleet: "" }); setErrors({}); setEditing(null); setShowAdd(true); };
  const openEdit = (a) => { setForm({ name: a.name, status: a.status, logo: a.logo, preview: a.logo, country: a.country || "", fleet: a.fleet || "" }); setErrors({}); setEditing(a); setShowAdd(true); };

  const handleFile = (file) => {
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/svg+xml", "image/webp"].includes(file.type)) {
      setErrors(e => ({ ...e, logo: "Only JPG, PNG, SVG, WEBP allowed" })); return;
    }
    if (file.size > 2 * 1024 * 1024) { setErrors(e => ({ ...e, logo: "Max size is 2MB" })); return; }
    const reader = new FileReader();
    reader.onload = (ev) => setForm(f => ({ ...f, logo: ev.target.result, preview: ev.target.result }));
    reader.readAsDataURL(file);
    setErrors(e => ({ ...e, logo: null }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Airline name is required";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 900));
    if (editing) {
      setAirlines(prev => prev.map(a => a.id === editing.id ? { ...a, name: form.name, status: form.status, logo: form.logo || a.logo, country: form.country || a.country, fleet: Number(form.fleet) || a.fleet } : a));
    } else {
      const initials = form.name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
      const newAirline = { id: Date.now(), name: form.name, status: form.status, logo: form.logo, initials, color: AIRLINE_COLORS[airlines.length % AIRLINE_COLORS.length], createdAt: new Date().toISOString().slice(0, 10), iata: initials, country: form.country || "Unknown", fleet: Number(form.fleet) || 0 };
      setAirlines(prev => [...prev, newAirline]);
    }
    setSaving(false);
    setShowAdd(false);
    setPage(1);
  };

  const handleDelete = (id) => { setAirlines(prev => prev.filter(a => a.id !== id)); setDeleting(null); };
  const handleSort = (f) => { if (sortField === f) setSortDir(d => d === "asc" ? "desc" : "asc"); else { setSortField(f); setSortDir("asc"); } };
  const SortIcon = ({ field }) => sortField === field ? (sortDir === "asc" ? <ChevronUp size={13} className="text-blue-600" /> : <ChevronDown size={13} className="text-blue-600" />) : <ChevronDown size={13} className="text-gray-300" />;

  const activeCount = airlines.filter(a => a.status === "Active").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100"
      style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        ::-webkit-scrollbar{width:6px;height:6px}
        ::-webkit-scrollbar-track{background:#f1f5f9;border-radius:99px}
        ::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:99px}
      `}</style>
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-md shadow-blue-200 overflow-hidden flex-shrink-0">
                <div className="absolute inset-x-0 -top-1/2 h-full bg-gradient-to-b from-white/25 to-transparent opacity-60" />
                <Plane size={18} className="relative text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-black text-slate-800 leading-none">Airline Master</h1>
                <p className="text-xs text-slate-400 mt-1">
                  Manage airlines
                  <span className="hidden sm:inline ml-2 text-slate-300">|</span>
                  <span className="hidden sm:inline ml-2">
                    <span className="hover:text-blue-600 cursor-pointer transition-colors" onClick={() => navigate("/")}>Home</span>
                    <span className="mx-1 text-slate-300">/</span>
                    <span className="hover:text-blue-600 cursor-pointer transition-colors" onClick={() => navigate("/masters/cruises")}>Masters</span>
                    <span className="mx-1 text-slate-300">/</span>
                    <span className="text-blue-600 font-bold">Airlines</span>
                  </span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={search} onChange={e => handleSearch(e.target.value)} placeholder="Search name, country, IATA..." className="border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64 transition bg-slate-50 focus:bg-white" />
              </div>
              <button onClick={openAdd} className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-95 text-white px-3 sm:px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md shadow-blue-200 whitespace-nowrap flex-shrink-0">
                <Plus size={16} /> <span className="hidden sm:inline">Add New Airline</span><span className="sm:hidden">Add</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total Airlines", value: airlines.length, gradient: "from-blue-500 to-indigo-600", icon: "bg-white/20" },
            { label: "Active", value: activeCount, gradient: "from-green-500 to-emerald-600", icon: "bg-white/20" },
            { label: "Inactive", value: airlines.filter(a => a.status === "Inactive").length, gradient: "from-gray-400 to-gray-600", icon: "bg-white/20" },
            { label: "Suspended", value: airlines.filter(a => a.status === "Suspended").length, gradient: "from-red-500 to-rose-600", icon: "bg-white/20" },
          ].map(s => (
            <div key={s.label} className={`relative overflow-hidden bg-gradient-to-br ${s.gradient} rounded-2xl px-4 py-4 flex items-center gap-3 shadow-lg ring-1 ring-white/10 hover:-translate-y-0.5 transition-transform`}>
              <div className="absolute inset-x-0 -top-1/2 h-full bg-gradient-to-b from-white/20 to-transparent opacity-60 pointer-events-none" />
              <div className={`relative w-10 h-10 rounded-xl ${s.icon} flex items-center justify-center flex-shrink-0 shadow-inner`}>
                <Plane size={18} className="text-white" />
              </div>
              <div className="relative">
                <p className="text-2xl font-black text-white leading-none">{s.value}</p>
                <p className="text-xs text-white/70 mt-0.5 font-medium">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-10">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm">
          {/* Card area header */}
          <div className="px-4 sm:px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-extrabold text-slate-800">Airlines Directory</h2>
              <p className="text-xs text-slate-400 mt-0.5">{filtered.length} of {airlines.length} airlines</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-gray-400">Sort:</span>
              {[["name", "Name"], ["createdAt", "Date"], ["status", "Status"]].map(([f, l]) => (
                <button key={f} onClick={() => handleSort(f)}
                  className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border transition font-medium ${sortField === f ? "bg-blue-600 border-blue-600 text-white" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}>
                  {l} <SortIcon field={f} />
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {paginated.length === 0 ? (
              <div className="py-16 text-center">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Plane size={28} className="text-blue-300" />
                </div>
                <h3 className="text-base font-semibold text-gray-600 mb-1">No Airlines Found</h3>
                <p className="text-sm text-gray-400 mb-5">{search ? "Try a different search term" : "Get started by adding your first airline"}</p>
                {!search && (
                  <button onClick={openAdd} className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition">
                    <Plus size={15} /> Add New Airline
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {paginated.map((airline) => (
                  <AirlineCard
                    key={airline.id}
                    airline={airline}
                    theme={CARD_THEMES[airline.id % CARD_THEMES.length]}
                    onView={setViewing}
                    onEdit={openEdit}
                    onDelete={setDeleting}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {filtered.length > 0 && (
              <div className="mt-6 pt-5 border-t border-gray-100">
                <Pagination
                  current={page}
                  total={filtered.length}
                  pageSize={pageSize}
                  onPage={setPage}
                  onPageSize={handlePageSize}
                  totalItems={filtered.length}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add / Edit Modal */}
      <Modal show={showAdd} onClose={() => setShowAdd(false)}>
        <div className="relative bg-gradient-to-br from-blue-600 via-blue-600 to-indigo-700 rounded-t-2xl px-6 py-5 flex items-center justify-between overflow-hidden">
          <div className="absolute inset-x-0 -top-1/2 h-full bg-gradient-to-b from-white/20 to-transparent opacity-60 pointer-events-none" />
          <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/10" />
          <div className="relative flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-inner flex-shrink-0">
              <Plane size={18} className="text-white" />
            </div>
            <div>
              <h2 className="text-base font-black text-white leading-tight">{editing ? "Edit Airline" : "Add New Airline"}</h2>
              <p className="text-xs text-white/70">{editing ? "Update airline details" : "Create a new airline record"}</p>
            </div>
          </div>
          <button onClick={() => setShowAdd(false)} className="relative p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition flex-shrink-0"><X size={18} /></button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Airline Name <span className="text-red-500">*</span></label>
            <input value={form.name} onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setErrors(er => ({ ...er, name: null })); }}
              placeholder="Enter airline name"
              className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${errors.name ? "border-red-400 bg-red-50" : "border-gray-200 bg-white"}`} />
            {errors.name && <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1"><AlertCircle size={11} />{errors.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Country</label>
              <input value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} placeholder="e.g. India" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Fleet Size</label>
              <input value={form.fleet} onChange={e => setForm(f => ({ ...f, fleet: e.target.value }))} type="number" min="0" placeholder="e.g. 120" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Status</label>
            <div className="flex gap-2">
              {["Active", "Inactive", "Suspended"].map(s => (
                <button key={s} type="button" onClick={() => setForm(f => ({ ...f, status: s }))}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition ${form.status === s ? s === "Active" ? "bg-green-600 border-green-600 text-white" : s === "Suspended" ? "bg-red-500 border-red-500 text-white" : "bg-gray-600 border-gray-600 text-white" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Airline Logo</label>
            {form.preview ? (
              <div className="relative border-2 border-blue-200 rounded-2xl p-4 flex flex-col items-center gap-3 bg-blue-50">
                <img src={form.preview} alt="Preview" className="w-20 h-20 object-contain rounded-xl border border-gray-100 bg-white shadow-sm" />
                <p className="text-xs text-green-600 font-semibold flex items-center gap-1"><CheckCircle2 size={13} />Logo uploaded successfully</p>
                <button onClick={() => setForm(f => ({ ...f, logo: null, preview: null }))} className="absolute top-3 right-3 p-1 rounded-lg hover:bg-white text-gray-400 transition"><X size={14} /></button>
              </div>
            ) : (
              <div
                onDragOver={e => { e.preventDefault(); setDrag(true); }}
                onDragLeave={() => setDrag(false)}
                onDrop={e => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]); }}
                onClick={() => fileRef.current.click()}
                className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center gap-3 cursor-pointer transition ${drag ? "border-blue-400 bg-blue-50" : errors.logo ? "border-red-300 bg-red-50" : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50"}`}>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition ${drag ? "bg-blue-100" : "bg-gray-100"}`}>
                  <Upload size={22} className={drag ? "text-blue-600" : "text-gray-400"} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-700">Drag & drop or <span className="text-blue-600">browse</span></p>
                  <p className="text-xs text-gray-400 mt-0.5">JPG, PNG, SVG, WEBP — Max 2MB</p>
                </div>
                <input ref={fileRef} type="file" className="hidden" accept="image/jpeg,image/png,image/svg+xml,image/webp" onChange={e => handleFile(e.target.files[0])} />
              </div>
            )}
            {errors.logo && <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1"><AlertCircle size={11} />{errors.logo}</p>}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex gap-3 justify-end">
          <button onClick={() => setShowAdd(false)} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition active:scale-95 shadow-md shadow-blue-200">
            {saving ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</> : <><Plane size={14} />{editing ? "Update Airline" : "Save Airline"}</>}
          </button>
        </div>
      </Modal>

      <ViewModal airline={viewing} onClose={() => setViewing(null)} />

      {/* Delete Confirm */}
      <Modal show={!!deleting} onClose={() => setDeleting(null)}>
        {deleting && (
          <>
            <div className="p-6 pt-8 text-center">
              <div className="relative w-16 h-16 mx-auto mb-4">
                <span className="absolute inset-0 rounded-2xl bg-red-100 animate-ping opacity-40" />
                <div className="relative w-16 h-16 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-200 ring-4 ring-red-50">
                  <Trash2 size={26} className="text-white" />
                </div>
              </div>
              <h3 className="text-lg font-black text-gray-900 mb-1">Delete Airline?</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Are you sure you want to delete <span className="font-bold text-gray-800">{deleting.name}</span>?<br className="hidden sm:block" /> This action cannot be undone.
              </p>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
              <button onClick={() => setDeleting(null)} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition w-full sm:w-auto">Cancel</button>
              <button onClick={() => handleDelete(deleting.id)} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white text-sm font-bold transition active:scale-95 shadow-md shadow-red-200 w-full sm:w-auto">Delete Airline</button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}




