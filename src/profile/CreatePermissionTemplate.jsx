// src/components/PermissionTemplates/CreatePermissionTemplate.jsx
// ─────────────────────────────────────────────────────────────
// Create Permission Template Page — Travel CRM
// Matches CRM design system: from-slate-50 via-blue-50/30 to-slate-100
// Two modes:
//   1. Custom Template (/CreatePermissionTemplate)
//      - Template Name, Copy From User dropdown, Set as Default checkbox
//      - Template Creation Options info banner (teal)
//      - "Use Quick Template" button → switches to quick mode
//   2. Quick Template (/CreatePermissionTemplate?type=sales_executive etc.)
//      - Template Preview card (name, desc, blue permissions count badge)
//      - Included Permissions breakdown (teal banner)
//      - Template Configuration (name, set as default)
//      - "Custom Template" button → switches back to custom mode
// Routes:
//   /CreatePermissionTemplate            → blank/custom
//   /CreatePermissionTemplate?type=sales_executive
//   /CreatePermissionTemplate?type=data_entry
//   /CreatePermissionTemplate?type=manager
//   /CreatePermissionTemplate?type=view_only
// ─────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  FiPlus, FiArrowLeft, FiAlertCircle, FiInfo,
  FiCheckCircle, FiSettings, FiChevronDown,
} from "react-icons/fi";
import {
  FaUserShield, FaUserTie, FaUserCheck, FaEye,
  FaLayerGroup, FaCog,
} from "react-icons/fa";
import { HiTemplate } from "react-icons/hi";
import { MdOutlineFlashOn } from "react-icons/md";

// ── Uncomment when backend is ready ──────────────────────────
// import { permissionTemplateService } from "../services/userPermissionsService";

/* ─── QUICK TEMPLATE PRESETS ─────────────────────────────────── */
const QUICK_PRESETS = {
  sales_executive: {
    id:    "sales_executive",
    title: "Sales Executive",
    label: "Sales Executive",
    desc:  "Full lead management, quotation creation, own data only",
    icon:  <FaUserTie className="w-7 h-7"/>,
    color: "from-blue-500 to-blue-600",
    totalPermissions: 14,
    breakdown: [
      { module:"Dashboard.php", pages:1 },
      { module:"Leads",         pages:6 },
      { module:"Reminders",     pages:3 },
      { module:"Quotations",    pages:4 },
    ],
  },
  data_entry: {
    id:    "data_entry",
    title: "Data Entry Operator",
    label: "Data Entry Operator",
    desc:  "Master data management only, all CRUD operations",
    icon:  <FaLayerGroup className="w-7 h-7"/>,
    color: "from-teal-500 to-teal-600",
    totalPermissions: 25,
    breakdown: [
      { module:"Dashboard.php", pages:1 },
      { module:"Masters",       pages:24 },
    ],
  },
  manager: {
    id:    "manager",
    title: "Manager",
    label: "Manager",
    desc:  "Access to core functions, team data visibility",
    icon:  <FaUserShield className="w-7 h-7"/>,
    color: "from-purple-500 to-purple-600",
    totalPermissions: 21,
    breakdown: [
      { module:"Dashboard.php", pages:1 },
      { module:"Leads",         pages:7 },
      { module:"Reminders",     pages:4 },
      { module:"Quotations",    pages:5 },
      { module:"Bookings",      pages:2 },
      { module:"Customers",     pages:2 },
    ],
  },
  view_only: {
    id:    "view_only",
    title: "View Only User",
    label: "View Only User",
    desc:  "Read-only access to leads and basic data",
    icon:  <FaEye className="w-7 h-7"/>,
    color: "from-slate-500 to-slate-600",
    totalPermissions: 11,
    breakdown: [
      { module:"Dashboard.php", pages:1 },
      { module:"Leads",         pages:3 },
      { module:"Reminders",     pages:2 },
      { module:"Masters",       pages:4 },
      { module:"Quotations",    pages:1 },
    ],
  },
};

/* ─── MOCK USERS for "Copy From" dropdown ────────────────────── */
const MOCK_USERS = [
  { id:34, name:"Shreyash Raghvendra Shahi (Shreyash_Shahi)" },
  { id:21, name:"Deepti Paul (deepti_paul)"                  },
  { id:20, name:"Vaishnavi Shrikant Jagtap (vaishnavi_jagtap)" },
  { id:18, name:"Test (testuser1)"                            },
  { id:15, name:"Rajesh Kumar (admin_raj)"                    },
];

/* ─── TOAST ──────────────────────────────────────────────────── */
function Toast({ msg, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3800); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className={`fixed top-5 right-5 z-[999] flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl max-w-sm
      ${type === "success" ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800"}`}
      style={{ animation: "slideIn .3s ease both" }}>
      <span className="text-lg">{type === "success" ? "✅" : "❌"}</span>
      <p className="text-sm font-semibold flex-1">{msg}</p>
      <button onClick={onClose} className="opacity-50 hover:opacity-100 text-lg ml-1">×</button>
    </div>
  );
}

/* ─── LABEL ──────────────────────────────────────────────────── */
function Label({ children, required, hint }) {
  return (
    <div className="mb-1.5">
      <label className="block text-sm font-extrabold text-slate-700">
        {children}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {hint && <p className="text-xs text-slate-400 mt-0.5">{hint}</p>}
    </div>
  );
}

const inputCls = (err) =>
  `w-full px-4 py-3 rounded-xl border text-sm text-slate-700 placeholder-slate-400
   focus:outline-none focus:ring-2 transition-all bg-white
   ${err
     ? "border-red-300 focus:border-red-400 focus:ring-red-50"
     : "border-slate-200 focus:border-blue-400 focus:ring-blue-50 hover:border-slate-300"}`;

/* ─── SECTION CARD ────────────────────────────────────────────── */
function SectionCard({ title, children, delay = 0 }) {
  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden"
      style={{ animation: `fadeUp .4s ease both`, animationDelay: `${delay}ms` }}>
      {title && (
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/60">
          <h2 className="text-sm font-extrabold text-slate-700">{title}</h2>
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}

/* ─── MAIN PAGE ──────────────────────────────────────────────── */
export default function CreatePermissionTemplate() {
  const navigate        = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const typeParam       = searchParams.get("type"); // null | "sales_executive" | "data_entry" | "manager" | "view_only"
  const isQuickMode     = !!typeParam && !!QUICK_PRESETS[typeParam];
  const preset          = isQuickMode ? QUICK_PRESETS[typeParam] : null;

  /* form state */
  const [templateName, setTemplateName]     = useState(preset?.label || "");
  const [copyFromUser, setCopyFromUser]     = useState("");
  const [isDefault,    setIsDefault]        = useState(false);
  const [errs,         setErrs]             = useState({});
  const [saving,       setSaving]           = useState(false);
  const [toast,        setToast]            = useState(null);

  /* update name when switching presets */
  useEffect(() => {
    setTemplateName(preset?.label || "");
    setErrs({});
  }, [typeParam]);

  const showToast = useCallback((msg, type = "success") => setToast({ msg, type }), []);

  /* validation */
  const validate = () => {
    const e = {};
    if (!templateName.trim()) e.templateName = "Template name is required";
    if (templateName.trim().length < 3) e.templateName = "Name must be at least 3 characters";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs2 = validate();
    if (Object.keys(errs2).length) { setErrs(errs2); showToast("Please fix the errors below.", "error"); return; }
    setSaving(true);
    try {
      // BACKEND:
      // if (isQuickMode) {
      //   await permissionTemplateService.saveAsTemplate(templateName, typeParam, preset.permissions);
      // } else {
      //   await permissionTemplateService.create({ name: templateName, copyFromUser, isDefault });
      // }
      await new Promise(r => setTimeout(r, 1000));
      showToast(`Template "${templateName}" created successfully! ✅`);
      setTimeout(() => navigate("/PermissionTemplates"), 1500);
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed to create template.", "error");
    } finally { setSaving(false); }
  };

  const switchToCustom  = () => { setSearchParams({}); };
  const switchToQuick   = () => navigate("/PermissionTemplates");

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

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* ── PAGE HEADER ── */}
      <div className="bg-white/70 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white shadow-lg shadow-blue-200 flex-shrink-0">
                {isQuickMode ? <MdOutlineFlashOn className="w-5 h-5"/> : <HiTemplate className="w-5 h-5"/>}
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">
                  {isQuickMode ? "Create Quick Template" : "Create Permission Template"}
                </h1>
                <p className="text-sm text-slate-400 mt-0.5">
                  {isQuickMode ? `Quick setup: ${preset?.title}` : "Set up a new reusable permission template"}
                  <span className="hidden sm:inline ml-3 text-slate-300">|</span>
                  <span className="hidden sm:inline ml-3 text-xs">
                    <span className="hover:text-blue-600 cursor-pointer transition-colors" onClick={() => navigate("/")}>Home</span>
                    <span className="mx-1 text-slate-300">/</span>
                    <span className="hover:text-blue-600 cursor-pointer transition-colors" onClick={() => navigate("/PermissionTemplates")}>Permissions</span>
                    <span className="mx-1 text-slate-300">/</span>
                    <span className="hover:text-blue-600 cursor-pointer transition-colors" onClick={() => navigate("/PermissionTemplates")}>Templates</span>
                    <span className="mx-1 text-slate-300">/</span>
                    <span className="text-blue-600 font-bold">{isQuickMode ? "Quick Template" : "Create"}</span>
                  </span>
                </p>
              </div>
            </div>
            <button type="button" onClick={() => navigate("/PermissionTemplates")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200
                hover:border-blue-300 bg-white hover:bg-blue-50 text-slate-600 hover:text-blue-600
                text-sm font-bold transition-all shadow-sm">
              <FiArrowLeft className="w-4 h-4"/> Back to Templates
            </button>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} noValidate className="space-y-5">

            {/* ══ QUICK TEMPLATE MODE ══════════════════════════════════ */}
            {isQuickMode && preset && (
              <>
                {/* Template Preview Card */}
                <SectionCard title={`Template Preview: ${preset.title}`} delay={0}>
                  <div className="flex flex-col sm:flex-row items-start gap-5">
                    {/* Left: name + desc */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${preset.color} flex items-center justify-center text-white shadow-md flex-shrink-0`}>
                          {preset.icon}
                        </div>
                        <div>
                          <h3 className="text-lg font-extrabold text-slate-800">{preset.title}</h3>
                          <p className="text-sm text-slate-500">{preset.desc}</p>
                        </div>
                      </div>
                    </div>

                    {/* Right: Permissions count badge — blue, matches screenshot */}
                    <div className="w-full sm:w-48 flex-shrink-0">
                      <div className="bg-gradient-to-br from-blue-600 to-blue-500 rounded-2xl px-5 py-4 text-white text-center shadow-lg shadow-blue-200 flex items-center gap-4">
                        <FiCheckCircle className="w-8 h-8 text-white flex-shrink-0 opacity-90"/>
                        <div>
                          <p className="text-xs font-bold opacity-80 uppercase tracking-wide">Permissions</p>
                          <p className="text-3xl font-extrabold leading-none">{preset.totalPermissions}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Included Permissions — teal banner, matches screenshot */}
                  <div className="mt-5 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl px-5 py-4">
                    <div className="flex items-start gap-2 mb-3">
                      <FiInfo className="w-4 h-4 text-white flex-shrink-0 mt-0.5"/>
                      <p className="text-sm font-extrabold text-white">Included Permissions:</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1.5">
                      {preset.breakdown.map(({ module, pages }) => (
                        <div key={module} className="flex items-center gap-1.5">
                          <span className="text-sm font-extrabold text-white">{module}:</span>
                          <span className="text-sm text-white/90">{pages} page{pages !== 1 ? "s" : ""}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </SectionCard>

                {/* Template Configuration */}
                <SectionCard title="Template Configuration" delay={100}>
                  <div className="space-y-5">
                    {/* Template Name */}
                    <div>
                      <Label required hint="You can customize the template name">Template Name</Label>
                      <input
                        value={templateName}
                        onChange={e => { setTemplateName(e.target.value); setErrs(p => ({ ...p, templateName: "" })); }}
                        className={inputCls(errs.templateName)}
                        placeholder={preset.label}
                      />
                      {errs.templateName && (
                        <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                          <FiAlertCircle className="w-3 h-3 flex-shrink-0"/>{errs.templateName}
                        </p>
                      )}
                    </div>

                    {/* Set as Default */}
                    <div className="flex items-start gap-3">
                      <div className="flex items-center h-5 mt-0.5">
                        <input
                          id="isDefault"
                          type="checkbox"
                          checked={isDefault}
                          onChange={e => setIsDefault(e.target.checked)}
                          className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-400 cursor-pointer"
                        />
                      </div>
                      <div>
                        <label htmlFor="isDefault" className="text-sm font-bold text-slate-700 cursor-pointer">
                          Set as Default Template
                        </label>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Default templates are automatically applied to new users
                        </p>
                      </div>
                    </div>
                  </div>
                </SectionCard>
              </>
            )}

            {/* ══ CUSTOM TEMPLATE MODE ══════════════════════════════════ */}
            {!isQuickMode && (
              <SectionCard title="Template Information" delay={0}>
                <div className="space-y-5">
                  {/* Template Name */}
                  <div>
                    <Label required hint="Choose a descriptive name for this permission template">Template Name</Label>
                    <input
                      value={templateName}
                      onChange={e => { setTemplateName(e.target.value); setErrs(p => ({ ...p, templateName: "" })); }}
                      className={inputCls(errs.templateName)}
                      placeholder="e.g., Sales Executive, Data Entry Operator"
                      autoFocus
                    />
                    {errs.templateName && (
                      <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                        <FiAlertCircle className="w-3 h-3 flex-shrink-0"/>{errs.templateName}
                      </p>
                    )}
                  </div>

                  {/* Copy from User */}
                  <div>
                    <Label hint="If selected, the template will be created with the same permissions as the selected user. You can modify them later.">
                      Copy Permissions From Existing User (Optional)
                    </Label>
                    <div className="relative">
                      <select
                        value={copyFromUser}
                        onChange={e => setCopyFromUser(e.target.value)}
                        className={inputCls(false) + " pr-10 appearance-none cursor-pointer"}>
                        <option value="">Start with blank template</option>
                        {MOCK_USERS.map(u => (
                          <option key={u.id} value={u.id}>{u.name}</option>
                        ))}
                      </select>
                      <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"/>
                    </div>
                  </div>

                  {/* Set as Default */}
                  <div className="flex items-start gap-3">
                    <div className="flex items-center h-5 mt-0.5">
                      <input
                        id="isDefault"
                        type="checkbox"
                        checked={isDefault}
                        onChange={e => setIsDefault(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-400 cursor-pointer"
                      />
                    </div>
                    <div>
                      <label htmlFor="isDefault" className="text-sm font-bold text-slate-700 cursor-pointer">
                        Set as Default Template
                      </label>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Default templates are automatically applied to new users when they are created
                      </p>
                    </div>
                  </div>

                  {/* Template Creation Options info banner — teal, matches screenshot */}
                  <div className="bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl px-5 py-4">
                    <div className="flex items-start gap-3 mb-3">
                      <FiInfo className="w-4 h-4 text-white flex-shrink-0 mt-0.5"/>
                      <p className="text-sm font-extrabold text-white">Template Creation Options:</p>
                    </div>
                    <ul className="space-y-1.5 ml-7">
                      {[
                        { label:"Blank Template:", desc:"Start with basic dashboard access only" },
                        { label:"Copy from User:", desc:"Copy all permissions from an existing user as starting point" },
                        { label:"Quick Templates:", desc:"Use pre-defined templates from the templates page" },
                      ].map(({ label, desc }) => (
                        <li key={label} className="text-sm text-white/95 leading-relaxed">
                          <span className="font-extrabold">{label}</span> {desc}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </SectionCard>
            )}

            {/* ── ACTION BUTTONS ── */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/60 shadow-sm p-5"
              style={{ animation: "fadeUp .5s ease both" }}>
              <div className="flex flex-col sm:flex-row items-stretch justify-between gap-3">
                {/* Left: Create + Cancel */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button type="submit" disabled={saving}
                    className="flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl
                      bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm
                      shadow-md shadow-blue-200 hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed">
                    {saving ? (
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/>
                    ) : (
                      <FiPlus className="w-4 h-4"/>
                    )}
                    {saving ? "Creating…" : "Create Template"}
                  </button>

                  <button type="button" onClick={() => navigate("/PermissionTemplates")} disabled={saving}
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl
                      border-2 border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-800
                      font-bold text-sm transition-all bg-white hover:bg-slate-50 disabled:opacity-50">
                    ✕ Cancel
                  </button>
                </div>

                {/* Right: Switch mode button */}
                {isQuickMode ? (
                  <button type="button" onClick={switchToCustom} disabled={saving}
                    className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl
                      bg-teal-500 hover:bg-teal-600 text-white font-bold text-sm
                      shadow-md shadow-teal-200 transition-all disabled:opacity-50">
                    <FiSettings className="w-4 h-4"/> Custom Template
                  </button>
                ) : (
                  <button type="button" onClick={switchToQuick} disabled={saving}
                    className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl
                      bg-teal-500 hover:bg-teal-600 text-white font-bold text-sm
                      shadow-md shadow-teal-200 transition-all disabled:opacity-50">
                    <MdOutlineFlashOn className="w-4 h-4"/> Use Quick Template
                  </button>
                )}
              </div>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}