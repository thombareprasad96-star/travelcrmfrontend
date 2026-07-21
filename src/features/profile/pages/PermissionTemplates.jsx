import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Shield as FiShield, Plus as FiPlus, ArrowLeft as FiArrowLeft, Pen as FiEdit2, Trash2 as FiTrash2, Copy as FiCopy, Users as FiUsers, Info as FiInfo, Search as FiSearch, ChevronDown as FiChevronDown, ExternalLink as FiExternalLink, ShieldUser as FaUserShield, UserRound as FaUserTie, Eye as FaEye, Layers as FaLayerGroup, LayoutTemplate as HiTemplate } from "lucide-react";


import { permissionTemplateService } from "../api/profileUserPermissionsService";

/* ─── QUICK SETUP PRESETS ────────────────────────────────────── */
const QUICK_PRESETS = [
  {
    id:    "sales_executive",
    title: "Sales Executive",
    desc:  "Full lead management, quotation creation, own data only",
    icon:  <FaUserTie className="w-6 h-6"/>,
    color: "from-blue-500 to-blue-600",
    badge: "Sales",
    badgeColor: "bg-blue-100 text-blue-700",
    pages: 14,
  },
  {
    id:    "data_entry",
    title: "Data Entry",
    desc:  "Master data management only, all CRUD operations",
    icon:  <FaLayerGroup className="w-6 h-6"/>,
    color: "from-teal-500 to-teal-600",
    badge: "Data",
    badgeColor: "bg-teal-100 text-teal-700",
    pages: 25,
  },
  {
    id:    "manager",
    title: "Manager",
    desc:  "Access to core functions, team data visibility",
    icon:  <FaUserShield className="w-6 h-6"/>,
    color: "from-purple-500 to-purple-600",
    badge: "Admin",
    badgeColor: "bg-purple-100 text-purple-700",
    pages: 21,
  },
  {
    id:    "view_only",
    title: "View Only",
    desc:  "Read-only access to leads and basic data",
    icon:  <FaEye className="w-6 h-6"/>,
    color: "from-slate-500 to-slate-600",
    badge: "ReadOnly",
    badgeColor: "bg-slate-100 text-slate-600",
    pages: 11,
  },
];

const SUBSCRIPTION_MODULES = 13;

/* ─── TOAST ──────────────────────────────────────────────────── */
function Toast({ msg, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3800);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div className={`fixed top-5 right-5 z-[999] flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl max-w-sm
      ${type === "success"
        ? "bg-green-50 border-green-200 text-green-800"
        : "bg-red-50 border-red-200 text-red-800"}`}
      style={{ animation: "slideIn .3s ease both" }}>
      <span className="text-lg">{type === "success" ? "✅" : "❌"}</span>
      <p className="text-sm font-semibold flex-1">{msg}</p>
      <button onClick={onClose} className="opacity-50 hover:opacity-100 text-lg ml-1">×</button>
    </div>
  );
}

/* ─── DELETE CONFIRM ─────────────────────────────────────────── */
function DeleteConfirm({ template, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm z-10 p-6 text-center"
        style={{ animation: "popIn .25s ease both" }}>
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-3xl mx-auto mb-4">🗑️</div>
        <h3 className="text-lg font-extrabold text-slate-800 mb-1">Delete Template?</h3>
        <p className="text-sm text-slate-500 mb-2">
          Are you sure you want to delete{" "}
          <span className="font-bold text-slate-700">"{template?.name}"</span>?
        </p>
        {template?.usersCount > 0 && (
          <p className="text-xs text-amber-600 font-bold mb-3 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            ⚠️ {template.usersCount} user{template.usersCount !== 1 ? "s are" : " is"} using this template. Their permissions will remain unchanged.
          </p>
        )}
        <p className="text-xs text-slate-400 mb-5">This action cannot be undone.</p>
        <div className="flex gap-3">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border-2 border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all">
            Cancel
          </button>
          <button onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md shadow-red-200 transition-all">
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── TEMPLATE CARD ──────────────────────────────────────────── */
function TemplateCard({ template, onEdit, onDelete, onDuplicate, idx }) {
  const GRADS = [
    "from-blue-500 to-blue-600", "from-teal-500 to-teal-600",
    "from-purple-500 to-purple-600", "from-indigo-500 to-indigo-600",
    "from-amber-500 to-amber-600",
  ];
  const grad = GRADS[idx % GRADS.length];
  return (
    <div
      className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden
        hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group"
      style={{ animation: "fadeUp .4s ease both", animationDelay: `${idx * 60}ms` }}>
      <div className={`h-1.5 bg-gradient-to-r ${grad}`} />
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center text-white flex-shrink-0 shadow-md`}>
              <FiShield className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-extrabold text-slate-800 truncate">{template.name}</h3>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${template.badgeColor || "bg-blue-100 text-blue-700"}`}>
                Custom
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => onDuplicate(template)} title="Duplicate"
              className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-blue-100 text-slate-400 hover:text-blue-600 flex items-center justify-center transition-all">
              <FiCopy className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => onEdit(template)} title="Edit"
              className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-indigo-100 text-slate-400 hover:text-indigo-600 flex items-center justify-center transition-all">
              <FiEdit2 className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => onDelete(template)} title="Delete"
              className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-red-100 text-slate-400 hover:text-red-500 flex items-center justify-center transition-all">
              <FiTrash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        {template.description && (
          <p className="text-xs text-slate-500 leading-relaxed mb-3 line-clamp-2">{template.description}</p>
        )}
        {/* Stats */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <FiShield className="w-3 h-3 text-blue-400" />
              <span className="font-bold text-slate-700">{template.pages}</span> pages
            </span>
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <FiUsers className="w-3 h-3 text-teal-400" />
              <span className="font-bold text-slate-700">{template.usersCount}</span> users
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">{template.createdAt}</span>
        </div>
        {/* Action footer */}
        <div className="flex gap-2 mt-3">
          <button onClick={() => onEdit(template)}
            className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm shadow-blue-200">
            <FiEdit2 className="w-3 h-3" /> Edit Permissions
          </button>
          <button onClick={() => onDuplicate(template)}
            className="px-3 py-2 rounded-xl border border-slate-200 hover:border-blue-300 bg-white hover:bg-blue-50 text-slate-500 hover:text-blue-600 text-xs font-bold transition-all">
            <FiCopy className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── MAIN PAGE ──────────────────────────────────────────────── */
export default function PermissionTemplates() {
  const navigate = useNavigate();

  const [templates,    setTemplates]    = useState([]);
  const [search,       setSearch]       = useState("");
  const [loading,      setLoading]      = useState(true);
  const [toast,        setToast]        = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [quickOpen,    setQuickOpen]    = useState(true);

  useEffect(() => {
    setLoading(true);
    permissionTemplateService.getAll()
      .then(res => setTemplates(res.data))
      .catch(() => setToast({ msg: "Failed to load templates.", type: "error" }))
      .finally(() => setLoading(false));
  }, []);

  const showToast = useCallback((msg, type = "success") => setToast({ msg, type }), []);

  const filtered = templates.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    (t.description || "").toLowerCase().includes(search.toLowerCase())
  );

  /* handlers */
  const handleDelete = async () => {
    try {
      await permissionTemplateService.delete(deleteTarget.id);
      setTemplates(prev => prev.filter(t => t.id !== deleteTarget.id));
      showToast(`Template "${deleteTarget.name}" deleted.`);
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed to delete template.", "error");
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleDuplicate = async (template) => {
    try {
      const res = await permissionTemplateService.create({
        label:       `${template.name} (Copy)`,
        description: template.description,
        permissions: template.permissions,
      });
      setTemplates(prev => [res.data, ...prev]);
      showToast(`Template duplicated as "${res.data.name}".`);
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed to duplicate template.", "error");
    }
  };

  const handleEdit = (template) => {
    // Navigate to edit page
    navigate(`/UserPermissions/template/${template.id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100"
      style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        @keyframes slideIn { from{transform:translateX(110%);opacity:0} to{transform:translateX(0);opacity:1} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes popIn   { from{transform:scale(.92);opacity:0} to{transform:scale(1);opacity:1} }
        .fade-up { animation: fadeUp .4s ease both; }
        select { -webkit-appearance:none; appearance:none; }
        .line-clamp-2 { display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
        ::-webkit-scrollbar{width:5px;height:5px}
        ::-webkit-scrollbar-track{background:#f1f5f9;border-radius:99px}
        ::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:99px}
      `}</style>

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      {deleteTarget && (
        <DeleteConfirm
          template={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}

      {/* ── PAGE HEADER ── */}
      <div className="bg-white/70 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white shadow-lg shadow-blue-200 flex-shrink-0">
                <HiTemplate className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">Permission Templates</h1>
                <p className="text-sm text-slate-400 mt-0.5">
                  Manage reusable permission templates for users
                  <span className="hidden sm:inline ml-3 text-slate-300">|</span>
                  <span className="hidden sm:inline ml-3 text-xs">
                    <span className="hover:text-blue-600 cursor-pointer transition-colors" onClick={() => navigate("/")}>Home</span>
                    <span className="mx-1 text-slate-300">/</span>
                    <span className="hover:text-blue-600 cursor-pointer transition-colors" onClick={() => navigate("/Users")}>Permissions</span>
                    <span className="mx-1 text-slate-300">/</span>
                    <span className="text-blue-600 font-bold">Templates</span>
                  </span>
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate("/SubscriptionInfo")}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold shadow-md shadow-teal-200 transition-all">
              <FiExternalLink className="w-3.5 h-3.5" /> View Subscription Details
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* ── SUBSCRIPTION LIMIT BANNER ── */}
        <div className="bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl px-5 py-4 flex items-start sm:items-center gap-3 fade-up">
          <FiInfo className="w-5 h-5 text-white flex-shrink-0 mt-0.5 sm:mt-0" />
          <p className="text-sm text-white font-medium leading-relaxed">
            <span className="font-extrabold">Subscription Limit:</span>{" "}
            Templates can only include permissions for your subscribed modules ({SUBSCRIPTION_MODULES} modules available).
          </p>
        </div>

        {/* ── ACTION BUTTONS ── */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 fade-up">
          {/* ── CREATE NEW TEMPLATE → /CreatePermissionTemplate ── */}
          <button onClick={() => navigate("/CreatePermissionTemplate")}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold
              shadow-md shadow-blue-200 hover:shadow-lg transition-all">
            <FiPlus className="w-4 h-4" /> Create New Template
          </button>
          <button onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border-2 border-slate-200
              hover:border-blue-300 bg-white hover:bg-blue-50 text-slate-600 hover:text-blue-600
              text-sm font-bold transition-all">
            <FiArrowLeft className="w-4 h-4" /> Back to Permissions
          </button>
        </div>

        {/* ── AVAILABLE TEMPLATES ── */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden fade-up">
          {/* Header */}
          <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <h2 className="text-base font-extrabold text-slate-700">Available Templates</h2>
              {templates.length > 0 && (
                <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2.5 py-1 rounded-full">
                  {filtered.length} result{filtered.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>
            {templates.length > 0 && (
              <div className="relative w-full sm:w-64">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search templates…"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-700
                    placeholder-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-50 outline-none transition-all"
                />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-5">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-slate-100 rounded-2xl h-48 animate-pulse" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              /* ── EMPTY STATE — matches screenshot ── */
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-5 text-slate-300">
                  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="8" y="14" width="50" height="60" rx="6" fill="currentColor" opacity=".3"/>
                    <rect x="18" y="8" width="50" height="60" rx="6" fill="currentColor" opacity=".5"/>
                    <rect x="14" y="26" width="30" height="3" rx="1.5" fill="white" opacity=".7"/>
                    <rect x="14" y="34" width="22" height="3" rx="1.5" fill="white" opacity=".7"/>
                    <rect x="14" y="42" width="26" height="3" rx="1.5" fill="white" opacity=".7"/>
                  </svg>
                </div>
                <h3 className="text-lg font-extrabold text-slate-600 mb-2">
                  {search ? "No Templates Found" : "No Templates Created"}
                </h3>
                <p className="text-sm text-slate-400 mb-6">
                  {search
                    ? "Try a different search term."
                    : "Create your first permission template to quickly assign permissions to users."}
                </p>
                {!search && (
                  /* ── CREATE FIRST TEMPLATE → /CreatePermissionTemplate ── */
                  <button onClick={() => navigate("/CreatePermissionTemplate")}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm
                      shadow-md shadow-blue-200 transition-all hover:scale-[1.02]">
                    <FiPlus className="w-4 h-4" /> Create First Template
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map((tpl, idx) => (
                  <TemplateCard
                    key={tpl.id}
                    template={tpl}
                    idx={idx}
                    onEdit={handleEdit}
                    onDelete={setDeleteTarget}
                    onDuplicate={handleDuplicate}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── QUICK SETUP TEMPLATES ── */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden fade-up">
          {/* Collapsible header */}
          <button type="button" onClick={() => setQuickOpen(v => !v)}
            className="w-full px-5 py-4 border-b border-slate-100 flex items-center justify-between hover:bg-slate-50/60 transition-colors">
            <div className="flex items-center gap-3">
              <h2 className="text-base font-extrabold text-slate-700">Quick Setup Templates</h2>
              <span className="text-xs bg-teal-100 text-teal-700 font-bold px-2 py-0.5 rounded-full">
                {QUICK_PRESETS.length} presets
              </span>
            </div>
            <FiChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${quickOpen ? "rotate-180" : ""}`} />
          </button>

          {quickOpen && (
            <div className="p-5">
              <p className="text-xs text-slate-500 mb-4 font-medium">
                Create common permission templates quickly with these presets:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {QUICK_PRESETS.map((preset, idx) => (
                  <div key={preset.id}
                    className="border border-slate-200 rounded-2xl p-5 hover:border-blue-300 hover:shadow-md transition-all duration-300 group bg-white"
                    style={{ animation: "fadeUp .4s ease both", animationDelay: `${idx * 60}ms` }}>
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${preset.color} flex items-center justify-center text-white mb-3 shadow-md group-hover:scale-110 transition-transform`}>
                      {preset.icon}
                    </div>
                    <h3 className="text-sm font-extrabold text-slate-800 mb-1">{preset.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed mb-1">{preset.desc}</p>
                    <p className="text-xs text-blue-500 font-bold mb-4">{preset.pages} permissions included</p>
                    {/* ── PRESET CREATE TEMPLATE → /CreatePermissionTemplate?type=preset_id ── */}
                    <button onClick={() => navigate(`/CreatePermissionTemplate?type=${preset.id}`)}
                      className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold
                        shadow-sm shadow-blue-200 transition-all hover:shadow-md">
                      Create Template
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}