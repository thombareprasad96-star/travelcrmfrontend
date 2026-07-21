import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ArrowLeft as FiArrowLeft, CircleCheck as FiCheckCircle, Bell as FiBell, User as FiUser, Phone as FiPhone, CircleAlert as FiAlertCircle, Info as FiInfo, Clock as FiClock, Tag as FiTag, Bell as FaBell, Lightbulb as FaLightbulb, UserRound as FaUserTie, StickyNote as FaStickyNote, ListPlus as MdOutlineAddTask } from "lucide-react";


import {
  reminderService,
  leadService,
  userService,
} from "../api/createReminderService";

/* ─── CONSTANTS ──────────────────────────────────────────────── */
const REMINDER_TYPES = [
  { value: "First_contact", label: "First Contact",   icon: "👤" },
  { value: "Follow_up",     label: "Follow Up",        icon: "🔄" },
  { value: "Quotation",     label: "Quotation",        icon: "📋" },
  { value: "Payment",       label: "Payment",          icon: "💰" },
  { value: "Document",      label: "Document",         icon: "📄" },
  { value: "Birthday",      label: "Birthday / Anniv", icon: "🎂" },
  { value: "Confirmation",  label: "Confirmation",     icon: "✔️"  },
  { value: "Custom",        label: "Custom",           icon: "📌" },
];

const PRIORITIES = [
  { value: "High",   label: "High",   color: "text-red-600",   bg: "bg-red-50",    border: "border-red-200",   dot: "bg-red-500"   },
  { value: "Medium", label: "Medium", color: "text-amber-600", bg: "bg-amber-50",  border: "border-amber-200", dot: "bg-amber-500" },
  { value: "Low",    label: "Low",    color: "text-green-600", bg: "bg-green-50",  border: "border-green-200", dot: "bg-green-500" },
];


const QUICK_TIPS = [
  { icon: "💡", text: "Use clear, action-oriented titles" },
  { icon: "🕐", text: "Set realistic due dates"           },
  { icon: "🚩", text: "Use priorities to organise work"   },
  { icon: "👤", text: "Assign to the right person"        },
];

/* ─── HELPER — default datetime (now + 1 hour, local) ───────── */
function defaultDueDate() {
  const d = new Date();
  d.setHours(d.getHours() + 1, 0, 0, 0);
  // datetime-local input wants "YYYY-MM-DDTHH:MM"
  return d.toISOString().slice(0, 16);
}

/* ─── TOAST ──────────────────────────────────────────────────── */
function Toast({ msg, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div
      className={`fixed top-5 right-5 z-[999] flex items-center gap-3 px-4 py-3 rounded-xl
        border shadow-2xl max-w-xs
        ${type === "success"
          ? "bg-green-50 border-green-200 text-green-800"
          : "bg-red-50 border-red-200 text-red-800"}`}
      style={{ animation: "slideIn .3s ease both" }}
    >
      <span className="text-lg">{type === "success" ? "✅" : "❌"}</span>
      <p className="text-sm font-semibold flex-1">{msg}</p>
      <button onClick={onClose} className="opacity-50 hover:opacity-100 text-lg ml-1 leading-none">×</button>
    </div>
  );
}

/* ─── FIELD LABEL ─────────────────────────────────────────────── */
function Label({ children, required }) {
  return (
    <label className="block text-xs font-extrabold text-slate-600 mb-1.5 uppercase tracking-wide">
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
}

/* ─── INPUT WRAPPER ───────────────────────────────────────────── */
function inputCls(hasError) {
  return `w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-700 placeholder-slate-400
    focus:outline-none focus:ring-2 transition-all bg-white
    ${hasError
      ? "border-red-300 focus:border-red-400 focus:ring-red-50"
      : "border-slate-200 focus:border-blue-400 focus:ring-blue-50"}`;
}

/* ─── SECTION CARD ────────────────────────────────────────────── */
function SectionCard({ icon, title, subtitle, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
      style={{ animation: "fadeUp .4s ease both" }}>
      <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/60 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white flex-shrink-0">
          {icon}
        </div>
        <div>
          <h2 className="text-sm font-extrabold text-slate-800">{title}</h2>
          {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  );
}

/* ─── MAIN PAGE ──────────────────────────────────────────────── */
export default function CreateReminder() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      leadId:      "",
      assignTo:    "",
      type:        "Custom",
      title:       "",
      description: "",
      dueDate:     defaultDueDate(),
      priority:    "Medium",
      phone:       "",
      notes:       "",
    },
  });

  const [leads, setLeads] = useState([]);
  const [users, setUsers] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [toast,      setToast]      = useState(null);

  // Watch fields for live summary
  const watchAll = watch();

  // ── Load leads & users from backend ──────────────────────────
  useEffect(() => {
  leadService
    .getForDropdown()
    .then((res) => {
      // PagedApiResponse → { data: [...] }; fall back to a raw array just in case
      setLeads(res.data?.data ?? res.data ?? []);
    })
    .catch(() => {
      showToast("Failed to load leads.", "error");
    });

  userService
    .getActive()
    .then((res) => {
      // ApiResponse → { data: [...] }
      setUsers(res.data?.data ?? res.data ?? []);
    })
    .catch(() => {
      showToast("Failed to load users.", "error");
    });
}, []);

  // Auto-fill phone when lead is selected
  const handleLeadChange = useCallback((e) => {
    const selectedId = e.target.value;            // lead.id is the UUID (publicId)
    const lead = leads.find((l) => l.id === selectedId);
    setValue("phone", lead?.phone || "");
  }, [leads, setValue]);

  const showToast = (msg, type = "success") => setToast({ msg, type });

  /* ── Submit ── */
  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const selectedLead = leads.find(l => l.id === data.leadId);
      const payload = {
        title:       data.title.trim(),
        description: data.description.trim(),
        type:        data.type,
        priority:    data.priority,
        status:      "Active",
        // Proper UUID references the backend resolves to internal FKs
        leadPublicId:     data.leadId || null,
        assignToPublicId: data.assignTo || null,
        leadName:    selectedLead?.customerName || "",
        phone:       data.phone.trim(),
        dueDate:     new Date(data.dueDate).toISOString(),
        notes:       data.notes.trim(),
        snoozedUntil: null,
      };

      const res = await reminderService.create(payload);
      const created = res.data?.data ?? res.data;

     showToast(
       `Reminder "${created?.title || data.title}" created successfully! 🔔`
      );

      reset({ ...data, dueDate: defaultDueDate(), leadId: "", assignTo: "", phone: "" });
      setTimeout(() => navigate("/Reminders"), 1500);

    } catch (err) {
      showToast(err?.response?.data?.message || "Failed to create reminder.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Live summary values ── */
  const selectedLead     = leads.find(l => l.id === watchAll.leadId);
  const selectedUser     = users.find(u => u.publicId === watchAll.assignTo);
  const selectedType     = REMINDER_TYPES.find(t => t.value === watchAll.type);
  const selectedPriority = PRIORITIES.find(p => p.value === watchAll.priority);
  const dueDateDisplay   = watchAll.dueDate
    ? new Date(watchAll.dueDate).toLocaleString("en-IN", {
        day: "2-digit", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit",
      })
    : "—";

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-100"
      style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        @keyframes slideIn { from{transform:translateX(110%);opacity:0} to{transform:translateX(0);opacity:1} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        select { -webkit-appearance:none; appearance:none; }
        ::-webkit-scrollbar{width:5px} ::-webkit-scrollbar-track{background:#f1f5f9;border-radius:99px}
        ::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:99px}
      `}</style>

      {toast && (
        <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />
      )}

      {/* ── PAGE HEADER ── */}
      <div className="bg-white/70 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white text-xl shadow-lg shadow-blue-200">
                <FaBell className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">Create Reminder</h1>
                <p className="text-sm text-slate-400 mt-0.5">
                  Set a follow-up, task, or scheduled activity
                  {/* Breadcrumb */}
                  <span className="hidden sm:inline ml-3 text-slate-300">|</span>
                  <span className="hidden sm:inline ml-3">
                    <span className="hover:text-blue-600 cursor-pointer transition-colors" onClick={() => navigate("/")}>Home</span>
                    <span className="mx-1 text-slate-300">/</span>
                    <span className="hover:text-blue-600 cursor-pointer transition-colors" onClick={() => navigate("/Reminders")}>Reminders</span>
                    <span className="mx-1 text-slate-300">/</span>
                    <span className="text-blue-600 font-bold">Create</span>
                  </span>
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate("/Reminders")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200
                hover:border-blue-300 bg-white hover:bg-blue-50 text-slate-600 hover:text-blue-600
                text-sm font-bold transition-all shadow-sm"
            >
              <FiArrowLeft className="w-4 h-4" /> Back to Reminders
            </button>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6">
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="flex flex-col lg:flex-row gap-6">

            {/* ══════════ LEFT COLUMN — FORM ══════════ */}
            <div className="flex-1 min-w-0 space-y-5">

              {/* ── SECTION 1: New Reminder ── */}
              <SectionCard
                icon={<MdOutlineAddTask className="w-5 h-5" />}
                title="New Reminder"
                subtitle="Fill in the details for your reminder"
              >
                {/* Lead */}
                <div>
                  <Label required>Lead</Label>
                  <div className="relative">
                    <select
                      {...register("leadId", { required: "Please select a lead" })}
                      onChange={(e) => {
                        register("leadId").onChange(e);
                        handleLeadChange(e);
                      }}
                      className={inputCls(errors.leadId) + " pr-9 cursor-pointer"}
                    >
                      <option value="">Select Lead</option>
                      {leads.map(l => (
                        <option key={l.id} value={l.id}>
                          {l.customerName} — {l.phone}
                        </option>
                      ))}
                    </select>
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] pointer-events-none">▼</span>
                  </div>
                  {errors.leadId && (
                    <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                      <FiAlertCircle className="w-3 h-3" /> {errors.leadId.message}
                    </p>
                  )}
                </div>

                {/* Assign To */}
                <div>
                  <Label required>Assign To</Label>
                  <div className="relative">
                    <select
                      {...register("assignTo", { required: "Please assign to a user" })}
                      className={inputCls(errors.assignTo) + " pr-9 cursor-pointer"}
                    >
                      <option value="">Select User</option>
                      {users.map(u => (
                        <option key={u.publicId} value={u.publicId}>{u.fullName}</option>
                      ))}
                    </select>
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] pointer-events-none">▼</span>
                  </div>
                  {errors.assignTo && (
                    <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                      <FiAlertCircle className="w-3 h-3" /> {errors.assignTo.message}
                    </p>
                  )}
                </div>

                {/* Type */}
                <div>
                  <Label>Type</Label>
                  <div className="relative">
                    <select
                      {...register("type")}
                      className={inputCls(false) + " pr-9 cursor-pointer"}
                    >
                      {REMINDER_TYPES.map(t => (
                        <option key={t.value} value={t.value}>
                          {t.icon}  {t.label}
                        </option>
                      ))}
                    </select>
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] pointer-events-none">▼</span>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <Label required>Title</Label>
                  <input
                    type="text"
                    placeholder="Enter reminder title"
                    {...register("title", {
                      required: "Title is required",
                      minLength: { value: 3, message: "Title must be at least 3 characters" },
                    })}
                    className={inputCls(errors.title)}
                  />
                  {errors.title && (
                    <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                      <FiAlertCircle className="w-3 h-3" /> {errors.title.message}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <Label>Description</Label>
                  <textarea
                    rows={4}
                    placeholder="Optional description or notes"
                    {...register("description")}
                    className={inputCls(false) + " resize-none"}
                  />
                </div>

                {/* Due Date & Priority — side by side */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label required>Due Date &amp; Time</Label>
                    <input
                      type="datetime-local"
                      {...register("dueDate", { required: "Due date is required" })}
                      className={inputCls(errors.dueDate)}
                    />
                    {errors.dueDate && (
                      <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                        <FiAlertCircle className="w-3 h-3" /> {errors.dueDate.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label>Priority</Label>
                    <div className="relative">
                      <select
                        {...register("priority")}
                        className={inputCls(false) + " pr-9 cursor-pointer"}
                      >
                        {PRIORITIES.map(p => (
                          <option key={p.value} value={p.value}>{p.label}</option>
                        ))}
                      </select>
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] pointer-events-none">▼</span>
                    </div>
                  </div>
                </div>
              </SectionCard>

              {/* ── SECTION 2: Contact Details ── */}
              <SectionCard
                icon={<FiPhone className="w-4 h-4" />}
                title="Contact Details"
                subtitle="Auto-filled from selected lead — editable if needed"
              >
                <div>
                  <Label>Phone Number</Label>
                  <div className="relative">
                    <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      {...register("phone")}
                      className={inputCls(false) + " pl-9"}
                    />
                  </div>
                  <p className="mt-1.5 text-xs text-slate-400 flex items-center gap-1">
                    <FiInfo className="w-3 h-3" /> Auto-filled when lead is selected. Edit if required.
                  </p>
                </div>
              </SectionCard>

              {/* ── SECTION 3: Additional Notes ── */}
              <SectionCard
                icon={<FaStickyNote className="w-4 h-4" />}
                title="Additional Notes"
                subtitle="Internal notes about this reminder"
              >
                <div>
                  <Label>Notes</Label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Customer interested in Maldives package ₹1.2L, call before 11 AM..."
                    {...register("notes")}
                    className={inputCls(false) + " resize-none"}
                  />
                </div>
              </SectionCard>

              {/* ── SUBMIT BUTTONS ── */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                <div className="flex flex-col sm:flex-row items-stretch gap-3">
                  {/* Create Reminder */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 flex items-center justify-center gap-2.5 px-8 py-3 rounded-xl
                      bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-extrabold text-sm
                      transition-all shadow-md shadow-blue-200 hover:shadow-lg hover:shadow-blue-300
                      disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        Creating Reminder...
                      </>
                    ) : (
                      <>
                        <FiCheckCircle className="w-4 h-4" />
                        Create Reminder
                      </>
                    )}
                  </button>

                  {/* Cancel */}
                  <button
                    type="button"
                    onClick={() => navigate("/Reminders")}
                    disabled={submitting}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3
                      rounded-xl border-2 border-slate-200 hover:border-slate-300 text-slate-600
                      hover:text-slate-800 font-bold text-sm transition-all disabled:opacity-50
                      bg-white hover:bg-slate-50"
                  >
                    ✕ Cancel
                  </button>

                  {/* Reset */}
                  <button
                    type="button"
                    onClick={() => reset({ dueDate: defaultDueDate(), type: "Custom", priority: "Medium" })}
                    disabled={submitting}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3
                      rounded-xl border-2 border-red-100 hover:border-red-200 text-red-400
                      hover:text-red-600 font-bold text-sm transition-all disabled:opacity-40
                      bg-white hover:bg-red-50"
                  >
                    <FiArrowLeft className="w-4 h-4" /> Reset
                  </button>
                </div>
                <p className="text-center text-xs text-slate-400 mt-3">
                  Fields marked with <span className="text-red-500 font-bold">*</span> are required.
                  Lead, Assign To, Title, and Due Date are mandatory.
                </p>
              </div>

            </div>
            {/* ══════════ END LEFT COLUMN ══════════ */}

            {/* ══════════ RIGHT SIDEBAR ══════════ */}
            <div className="w-full lg:w-72 xl:w-80 flex-shrink-0">
              <div className="lg:sticky lg:top-20 space-y-4">

                {/* ── QUICK TIPS ── */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
                  style={{ animation: "fadeUp .5s ease both" }}>
                  <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/60 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-white flex-shrink-0">
                      <FaLightbulb className="w-4 h-4" />
                    </div>
                    <h2 className="text-sm font-extrabold text-slate-800">Quick Tips</h2>
                  </div>
                  <div className="p-5 space-y-3">
                    {QUICK_TIPS.map((tip, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <span className="text-base flex-shrink-0 mt-0.5">{tip.icon}</span>
                        <p className="text-xs text-slate-600 font-medium leading-relaxed">{tip.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── LIVE SUMMARY ── */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
                  style={{ animation: "fadeUp .6s ease both" }}>
                  <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/60 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white flex-shrink-0">
                      <FiBell className="w-4 h-4" />
                    </div>
                    <h2 className="text-sm font-extrabold text-slate-800">Reminder Preview</h2>
                  </div>
                  <div className="p-5 space-y-3">

                    {/* Title preview */}
                    <div className="bg-blue-50 border border-blue-100 rounded-xl px-3.5 py-3">
                      <p className="text-xs text-blue-500 font-bold uppercase tracking-wider mb-1">Title</p>
                      <p className="text-sm font-extrabold text-blue-900 leading-snug">
                        {watchAll.title || <span className="text-slate-400 font-normal italic">No title yet…</span>}
                      </p>
                    </div>

                    {/* Summary rows */}
                    {[
                      {
                        icon: <FiUser className="w-3.5 h-3.5" />,
                        label: "Lead",
                        value: selectedLead ? selectedLead.customerName : "—",
                        sub: selectedLead?.phone,
                      },
                      {
                        icon: <FaUserTie className="w-3.5 h-3.5" />,
                        label: "Assigned",
                        value: selectedUser ? selectedUser.fullName : "—",
                      },
                      {
                        icon: <FiTag className="w-3.5 h-3.5" />,
                        label: "Type",
                        value: selectedType
                          ? `${selectedType.icon}  ${selectedType.label}`
                          : "—",
                      },
                      {
                        icon: <FiClock className="w-3.5 h-3.5" />,
                        label: "Due",
                        value: dueDateDisplay,
                      },
                    ].map(({ icon, label, value, sub }) => (
                      <div key={label} className="flex items-start gap-2.5 py-2 border-b border-slate-50 last:border-0">
                        <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center text-slate-500 flex-shrink-0 mt-0.5">
                          {icon}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs text-slate-400 font-medium">{label}</p>
                          <p className="text-xs font-bold text-slate-700 truncate">{value}</p>
                          {sub && <p className="text-xs text-slate-400">{sub}</p>}
                        </div>
                      </div>
                    ))}

                    {/* Priority badge */}
                    {selectedPriority && (
                      <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${selectedPriority.border} ${selectedPriority.bg}`}>
                        <span className={`w-2 h-2 rounded-full ${selectedPriority.dot} flex-shrink-0`} />
                        <p className={`text-xs font-extrabold ${selectedPriority.color}`}>
                          {selectedPriority.label} Priority
                        </p>
                      </div>
                    )}

                    {/* Description preview */}
                    {watchAll.description && (
                      <div className="bg-amber-50 border border-amber-100 rounded-xl px-3.5 py-3">
                        <p className="text-xs text-amber-600 font-bold mb-1">Description</p>
                        <p className="text-xs text-amber-800 leading-relaxed line-clamp-3">
                          {watchAll.description}
                        </p>
                      </div>
                    )}

                  </div>
                </div>

                {/* ── REMINDER TYPES GUIDE ── */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
                  style={{ animation: "fadeUp .7s ease both" }}>
                  <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/60 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white flex-shrink-0">
                      <FiTag className="w-4 h-4" />
                    </div>
                    <h2 className="text-sm font-extrabold text-slate-800">Reminder Types</h2>
                  </div>
                  <div className="p-4 space-y-1.5">
                    {REMINDER_TYPES.map(t => (
                      <div key={t.value}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all cursor-default
                          ${watchAll.type === t.value
                            ? "bg-blue-50 border border-blue-200"
                            : "hover:bg-slate-50"}`}>
                        <span className="text-sm">{t.icon}</span>
                        <p className={`text-xs font-semibold ${watchAll.type === t.value ? "text-blue-700 font-bold" : "text-slate-600"}`}>
                          {t.label}
                        </p>
                        {watchAll.type === t.value && (
                          <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
            {/* ══════════ END RIGHT SIDEBAR ══════════ */}

          </div>
        </form>
      </div>
    </div>
  );
}







