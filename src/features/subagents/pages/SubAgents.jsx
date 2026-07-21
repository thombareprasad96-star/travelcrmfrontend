// src/features/subagents/pages/SubAgents.jsx
// ─────────────────────────────────────────────────────────────
// Travel Partner (B2B franchise sub-agent) management — TENANT_ADMIN only.
// Provision partner logins, set their broker commission rate + optional
// white-label branding, and suspend / remove them. Roll-up & commission
// ledger live on the sibling /subagents/rollup page.
//
// Seat licensing: when the tenant is over its licensed-seat cap, creating a
// partner returns { licenseRequired:true, licenseRequest } — the partner is
// PENDING_LICENSE (login off) and a one-time seat license must be paid (online
// via Razorpay, or offline) and SuperAdmin-approved before they activate.
//
// Keyed by SubAgentProfile.publicId (UUID). API is gated on USER_* (admin).
// ─────────────────────────────────────────────────────────────
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus, Search, Pen as Edit2, Trash2, X, CheckCircle, AlertTriangle, Network,
  PauseCircle, PlayCircle, ChevronRight, Percent, IndianRupee, Palette, Users,
  Clock, CreditCard, Banknote, Wallet,
} from "lucide-react";
import subAgentService from "../api/subAgentService";
import { openRazorpayCheckout } from "@features/subscription/api/razorpayCheckout";
import { toast } from "@shared/ui/toast";
import { getErrorMessage, isAlreadyReported } from "@shared/api/apiError";

/* ─── helpers ─────────────────────────────────────────────── */
const unwrap = (res) => res?.data?.data ?? res?.data;
const fmtINR = (n) => "₹" + Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 });
const initials = (n) =>
  (n || "").trim().split(/\s+/).map((w) => w[0] || "").join("").slice(0, 2).toUpperCase() || "TP";
const commissionText = (r) =>
  (r?.markupType === "FIXED" ? fmtINR(r.markupValue) + " / booking" : `${Number(r?.markupValue || 0)}% of sale`);
const fmtDate = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return isNaN(d) ? "—" : d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};
const AVATAR_GRADS = [
  "from-blue-500 to-blue-600", "from-purple-500 to-purple-600", "from-teal-500 to-teal-600",
  "from-rose-500 to-rose-600", "from-amber-500 to-amber-600", "from-indigo-500 to-indigo-600",
];
const avatarGrad = (key) => AVATAR_GRADS[Math.abs(String(key || "").length) % AVATAR_GRADS.length];

const inputCls = (bad) =>
  `w-full px-4 py-2.5 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border rounded-xl text-sm text-slate-800
   placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all
   ${bad ? "border-rose-400" : "border-slate-200"}`;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* ─── animated number + stat card (matches AllVendors) ────── */
function AnimNum({ target }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let s = 0;
    const step = Math.max(1, Math.ceil(target / 40));
    const iv = setInterval(() => { s = Math.min(s + step, target); setV(s); if (s >= target) clearInterval(iv); }, 16);
    return () => clearInterval(iv);
  }, [target]);
  return <span>{v.toLocaleString("en-IN")}</span>;
}
function StatCard({ gradient, icon: Icon, label, value }) {
  return (
    <div className={`bg-gradient-to-br ${gradient} rounded-2xl p-5 text-white shadow-lg relative overflow-hidden group hover:-translate-y-1 hover:shadow-xl transition-all duration-300`}>
      <div className="absolute -right-5 -top-5 w-24 h-24 rounded-full bg-white/10 group-hover:scale-110 transition-transform" />
      <div className="absolute -right-3 -bottom-8 w-32 h-32 rounded-full bg-white/10" />
      <div className="relative z-10">
        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-3"><Icon className="w-5 h-5" /></div>
        <p className="text-2xl sm:text-3xl font-extrabold leading-none mb-1"><AnimNum target={value} /></p>
        <p className="text-xs font-bold uppercase tracking-widest opacity-80">{label}</p>
      </div>
    </div>
  );
}

/* ─── status badge (ACTIVE / PENDING_LICENSE / SUSPENDED) ──── */
function StatusBadge({ status }) {
  const map = {
    ACTIVE:          ["bg-emerald-100 text-emerald-700", "bg-emerald-500", "Active"],
    PENDING_LICENSE: ["bg-amber-100 text-amber-700",     "bg-amber-500",   "Awaiting license"],
    SUSPENDED:       ["bg-slate-200 text-slate-600",      "bg-slate-400",   "Suspended"],
  };
  const [cls, dot, label] = map[status] || map.SUSPENDED;
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-1 rounded-full ${cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
}

/* ════════════════════════════════════════════════════════════
   Create / Edit modal
   ═══════════════════════════════════════════════════════════ */
function TravelPartnerFormModal({ row, onClose, onSaved }) {
  const isEdit = Boolean(row?.publicId);
  const [form, setForm] = useState({
    name: row?.name || "",
    email: row?.email || "",
    password: "",
    phoneNumber: row?.phoneNumber || "",
    markupType: row?.markupType || "PERCENT",
    markupValue: row?.markupValue != null ? String(row.markupValue) : "0",
    status: row?.status || "ACTIVE",
    brandName: row?.brandName || "",
    logoUrl: row?.logoUrl || "",
    contactPhone: row?.contactPhone || "",
    contactEmail: row?.contactEmail || "",
    brandColor: row?.brandColor || "",
    // seat licensing (only used if a purchase is required on create)
    payMode: "ONLINE",
    offlineMode: "BANK_TRANSFER",
    offlineReference: "",
    offlineNotes: "",
  });
  const hasBrand = Boolean(row?.brandName || row?.logoUrl || row?.contactPhone || row?.contactEmail || row?.brandColor);
  const [showBrand, setShowBrand] = useState(hasBrand);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [saving, setSaving] = useState(false);

  const set = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required.";
    if (!isEdit) {
      if (!form.email.trim()) e.email = "Email is required.";
      else if (!EMAIL_RE.test(form.email.trim())) e.email = "Enter a valid email.";
      if (!form.password) e.password = "Password is required.";
      else if (form.password.length < 6) e.password = "At least 6 characters.";
      if (form.payMode === "OFFLINE" && !form.offlineReference.trim())
        e.offlineReference = "A payment reference is required for offline.";
    }
    const val = Number(form.markupValue);
    if (form.markupValue === "" || isNaN(val) || val < 0) e.markupValue = "Enter a rate of 0 or more.";
    else if (form.markupType === "PERCENT" && val > 100) e.markupValue = "Percentage cannot exceed 100.";
    return e;
  };

  const submit = async (evt) => {
    evt.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSaving(true); setSubmitError("");
    try {
      if (isEdit) {
        // null = leave unchanged; send the trimmed value ("" clears) so an admin can turn a field off.
        await subAgentService.update(row.publicId, {
          name: form.name.trim(),
          phoneNumber: form.phoneNumber.trim(),
          markupType: form.markupType,
          markupValue: Number(form.markupValue),
          status: form.status,
          brandName: form.brandName.trim(),
          logoUrl: form.logoUrl.trim(),
          contactPhone: form.contactPhone.trim(),
          contactEmail: form.contactEmail.trim(),
          brandColor: form.brandColor.trim(),
        });
        toast.success("Travel Partner updated.");
        onSaved(null);
        onClose();
      } else {
        const offline = form.payMode === "OFFLINE";
        const res = await subAgentService.create({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
          phoneNumber: form.phoneNumber.trim() || null,
          markupType: form.markupType,
          markupValue: Number(form.markupValue),
          brandName: form.brandName.trim() || null,
          logoUrl: form.logoUrl.trim() || null,
          contactPhone: form.contactPhone.trim() || null,
          contactEmail: form.contactEmail.trim() || null,
          brandColor: form.brandColor.trim() || null,
          // Only consulted if a seat must be purchased (tenant over cap):
          paymentMode: form.payMode,
          offlineMode: offline ? form.offlineMode : null,
          offlineReference: offline ? form.offlineReference.trim() : null,
          offlineNotes: offline ? form.offlineNotes.trim() : null,
        });
        onSaved(unwrap(res));    // page decides: activated, or launch payment
        onClose();
      }
    } catch (err) {
      if (err?.response?.status === 409) {
        setErrors((p) => ({ ...p, email: "A user with this email already exists." }));
        setSubmitError("A user with this email already exists.");
      } else if (!isAlreadyReported(err)) {
        setSubmitError(getErrorMessage(err, "Couldn't save the Travel Partner. Please try again."));
      } else {
        setSubmitError(getErrorMessage(err, "Couldn't save the Travel Partner."));
      }
    } finally {
      setSaving(false);
    }
  };

  const isPercent = form.markupType === "PERCENT";
  const offline = form.payMode === "OFFLINE";

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={saving ? undefined : onClose} />

      <div className="relative bg-white w-full max-w-2xl shadow-2xl mt-6 mb-10 rounded-3xl overflow-hidden"
           style={{ animation: "saScaleIn .25s ease both" }}>
        <div className="px-7 py-5 flex justify-between items-center border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-200">
              <Network size={18} />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">{isEdit ? "Edit Travel Partner" : "Add Travel Partner"}</h2>
              <p className="text-xs text-slate-400">{isEdit ? row.email : "Creates a franchise partner login"}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} disabled={saving}
            className="text-slate-400 hover:bg-slate-100 hover:text-slate-600 p-2 rounded-full transition-colors disabled:opacity-40">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={submit}>
          <div className="p-7 space-y-6 max-h-[65vh] overflow-y-auto">
            {/* identity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Name <span className="text-rose-500">*</span></label>
                <input value={form.name} onChange={(e) => set("name", e.target.value)}
                  placeholder="Full name" className={inputCls(errors.name)} />
                {errors.name && <p className="mt-1 text-xs text-rose-600 font-semibold flex items-center gap-1"><AlertTriangle size={12} />{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Phone</label>
                <input value={form.phoneNumber} onChange={(e) => set("phoneNumber", e.target.value)}
                  placeholder="Optional" className={inputCls(false)} />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Email {!isEdit && <span className="text-rose-500">*</span>}</label>
                <input type="email" value={form.email} disabled={isEdit}
                  onChange={(e) => set("email", e.target.value)}
                  placeholder="login@email.com"
                  className={`${inputCls(errors.email)} ${isEdit ? "opacity-60 cursor-not-allowed" : ""}`} />
                {isEdit && <p className="mt-1 text-[11px] text-slate-400">Login email can't be changed.</p>}
                {errors.email && <p className="mt-1 text-xs text-rose-600 font-semibold flex items-center gap-1"><AlertTriangle size={12} />{errors.email}</p>}
              </div>
              {!isEdit && (
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Password <span className="text-rose-500">*</span></label>
                  <input type="password" value={form.password} onChange={(e) => set("password", e.target.value)}
                    placeholder="Min. 6 characters" className={inputCls(errors.password)} />
                  {errors.password && <p className="mt-1 text-xs text-rose-600 font-semibold flex items-center gap-1"><AlertTriangle size={12} />{errors.password}</p>}
                </div>
              )}
              {isEdit && row.status !== "PENDING_LICENSE" && (
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Status</label>
                  <select value={form.status} onChange={(e) => set("status", e.target.value)} className={inputCls(false)}>
                    <option value="ACTIVE">Active</option>
                    <option value="SUSPENDED">Suspended (login disabled)</option>
                  </select>
                </div>
              )}
            </div>

            {/* commission */}
            <div className="rounded-2xl border border-blue-100 bg-blue-50/40 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Percent size={15} className="text-blue-600" />
                <h3 className="text-sm font-extrabold text-slate-800">Partner Commission</h3>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                The customer pays your package price; the partner earns this commission carved out of each sale.
                Commission accrues as the customer actually pays.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Type</label>
                  <select value={form.markupType} onChange={(e) => set("markupType", e.target.value)} className={inputCls(false)}>
                    <option value="PERCENT">Percentage of sale</option>
                    <option value="FIXED">Fixed amount per booking</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Rate <span className="text-rose-500">*</span></label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      {isPercent ? <Percent size={15} /> : <IndianRupee size={15} />}
                    </span>
                    <input type="number" min="0" step={isPercent ? "0.1" : "1"} value={form.markupValue}
                      onChange={(e) => set("markupValue", e.target.value)}
                      className={`${inputCls(errors.markupValue)} pl-10`} placeholder="0" />
                  </div>
                  {errors.markupValue && <p className="mt-1 text-xs text-rose-600 font-semibold flex items-center gap-1"><AlertTriangle size={12} />{errors.markupValue}</p>}
                </div>
              </div>
            </div>

            {/* seat licensing — only on create */}
            {!isEdit && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5">
                <div className="flex items-center gap-2 mb-1.5">
                  <CreditCard size={15} className="text-amber-600" />
                  <h3 className="text-sm font-extrabold text-slate-800">If a seat purchase is needed</h3>
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  If your plan's Travel Partner seats are all used, adding this partner needs a one-time seat license.
                  We'll only charge you if a seat isn't already free. Choose how you'd pay:
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    ["ONLINE", "Pay online", CreditCard, "Card / UPI / netbanking"],
                    ["OFFLINE", "Bank transfer", Banknote, "Verified by our team"],
                  ].map(([val, label, Icon, sub]) => (
                    <button type="button" key={val} onClick={() => set("payMode", val)}
                      className={`text-left rounded-xl border-2 p-3 transition-all ${
                        form.payMode === val ? "border-blue-500 bg-white shadow-sm" : "border-slate-200 bg-white/60 hover:border-slate-300"
                      }`}>
                      <span className="flex items-center gap-2 text-sm font-bold text-slate-800"><Icon size={15} className="text-blue-600" />{label}</span>
                      <span className="block text-[11px] text-slate-400 mt-0.5">{sub}</span>
                    </button>
                  ))}
                </div>
                {offline && (
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1.5">Method</label>
                      <select value={form.offlineMode} onChange={(e) => set("offlineMode", e.target.value)} className={inputCls(false)}>
                        <option value="BANK_TRANSFER">Bank transfer</option>
                        <option value="CHEQUE">Cheque</option>
                        <option value="CASH">Cash</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1.5">Reference <span className="text-rose-500">*</span></label>
                      <input value={form.offlineReference} onChange={(e) => set("offlineReference", e.target.value)}
                        placeholder="UTR / cheque no." className={inputCls(errors.offlineReference)} />
                      {errors.offlineReference && <p className="mt-1 text-xs text-rose-600 font-semibold flex items-center gap-1"><AlertTriangle size={12} />{errors.offlineReference}</p>}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* branding */}
            <div className="rounded-2xl border border-slate-200 p-5">
              <button type="button" onClick={() => setShowBrand((s) => !s)}
                className="w-full flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm font-extrabold text-slate-800">
                  <Palette size={15} className="text-slate-500" /> White-label branding
                  <span className="text-xs font-medium text-slate-400">(optional)</span>
                </span>
                <ChevronRight size={16} className={`text-slate-400 transition-transform ${showBrand ? "rotate-90" : ""}`} />
              </button>
              {showBrand && (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Brand name</label>
                    <input value={form.brandName} onChange={(e) => set("brandName", e.target.value)}
                      placeholder="Overrides company name on PDFs" className={inputCls(false)} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Logo URL</label>
                    <input value={form.logoUrl} onChange={(e) => set("logoUrl", e.target.value)}
                      placeholder="https://…" className={inputCls(false)} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Contact phone</label>
                    <input value={form.contactPhone} onChange={(e) => set("contactPhone", e.target.value)}
                      placeholder="Shown on documents" className={inputCls(false)} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Contact email</label>
                    <input value={form.contactEmail} onChange={(e) => set("contactEmail", e.target.value)}
                      placeholder="Shown on documents" className={inputCls(false)} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Brand colour</label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={form.brandColor || "#2563eb"} onChange={(e) => set("brandColor", e.target.value)}
                        className="h-10 w-12 rounded-lg border border-slate-200 bg-white cursor-pointer" />
                      <input value={form.brandColor} onChange={(e) => set("brandColor", e.target.value)}
                        placeholder="#2563eb" className={inputCls(false)} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {submitError && (
            <div className="mx-7 mb-2 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 text-sm text-rose-700 font-semibold flex items-center gap-2">
              <AlertTriangle size={16} className="text-rose-500" />{submitError}
            </div>
          )}

          <div className="bg-slate-50 px-7 py-4 border-t border-slate-200 flex justify-between items-center">
            <button type="button" disabled={saving} onClick={onClose}
              className="px-6 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-100 transition-all disabled:opacity-50">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-blue-200 disabled:opacity-50 flex items-center gap-2">
              {saving
                ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Saving…</>
                : <><CheckCircle size={16} /> {isEdit ? "Update" : "Create partner"}</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   Delete confirm
   ═══════════════════════════════════════════════════════════ */
function DeleteConfirm({ row, busy, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
         onClick={(e) => e.target === e.currentTarget && !busy && onClose()}>
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={busy ? undefined : onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm z-10 p-6 text-center"
           style={{ animation: "saPopIn .25s ease both" }}>
        <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center text-3xl mx-auto mb-4">🗑️</div>
        <h3 className="text-lg font-extrabold text-slate-800 mb-1">Remove Travel Partner?</h3>
        <p className="text-sm text-slate-500 mb-5">
          Remove <span className="font-bold text-slate-700">{row?.name}</span>? Their login is disabled;
          past bookings and accrued commission are retained.
          {row?.status === "PENDING_LICENSE" && " Any unpaid seat-license invoice is voided."}
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} disabled={busy}
            className="flex-1 py-2.5 rounded-xl border-2 border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 disabled:opacity-50">Cancel</button>
          <button onClick={onConfirm} disabled={busy}
            className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md disabled:opacity-50 flex items-center justify-center gap-2">
            {busy ? <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" /> : "Yes, remove"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   Page
   ═══════════════════════════════════════════════════════════ */
export default function SubAgents() {
  const [rows, setRows] = useState([]);
  const [reqByAgent, setReqByAgent] = useState({});   // subAgentPublicId → latest PENDING license request
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [fStatus, setFStatus] = useState("ALL");
  const [editRow, setEditRow] = useState(null);     // null = closed, {} = create, obj = edit
  const [deleteRow, setDeleteRow] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [busyId, setBusyId] = useState(null);

  const load = () => {
    setLoading(true);
    Promise.all([
      subAgentService.getAll().then((res) => (unwrap(res) ?? [])),
      subAgentService.getLicenseRequests().then((res) => (unwrap(res) ?? [])).catch(() => []),
    ])
      .then(([agents, reqs]) => {
        setRows(Array.isArray(agents) ? agents : []);
        const map = {};
        (Array.isArray(reqs) ? reqs : [])
          .filter((r) => r.status === "PENDING")
          .forEach((r) => { if (r.subAgentPublicId && !map[r.subAgentPublicId]) map[r.subAgentPublicId] = r; });
        setReqByAgent(map);
      })
      .catch((err) => { if (!isAlreadyReported(err)) toast.error(getErrorMessage(err, "Failed to load Travel Partners.")); })
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const stats = useMemo(() => ({
    total: rows.length,
    active: rows.filter((r) => r.status === "ACTIVE").length,
    pending: rows.filter((r) => r.status === "PENDING_LICENSE").length,
  }), [rows]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (fStatus !== "ALL" && r.status !== fStatus) return false;
      if (!q) return true;
      return (r.name || "").toLowerCase().includes(q) ||
             (r.email || "").toLowerCase().includes(q) ||
             (r.phoneNumber || "").toLowerCase().includes(q);
    });
  }, [rows, search, fStatus]);

  /** Launch Razorpay for a seat-license invoice; refresh on close. */
  const payInvoice = async (invoicePublicId) => {
    if (!invoicePublicId) return;
    try {
      const order = unwrap(await subAgentService.createPayIntent(invoicePublicId));
      await openRazorpayCheckout(order, {
        onSuccess: () => { toast.success("Payment submitted — awaiting SuperAdmin approval to activate."); load(); },
        onDismiss: () => { toast.info("Payment window closed. You can complete it from the list."); load(); },
      });
    } catch (err) {
      if (!isAlreadyReported(err)) toast.error(getErrorMessage(err, "Couldn't start the payment."));
    }
  };

  /** Called by the modal after create — decides the post-create outcome. */
  const handleSaved = (result) => {
    load();
    if (!result) return;    // edit — modal already toasted
    if (result.licenseRequired && result.licenseRequest) {
      const lr = result.licenseRequest;
      if (lr.paymentMode === "ONLINE") {
        toast.success(`Partner created — seat license ${fmtINR(lr.amount)}. Opening payment…`);
        payInvoice(lr.invoicePublicId);
      } else {
        toast.success("Partner created — submitted for approval. We'll verify your payment reference and activate them.");
      }
    } else {
      toast.success("Travel Partner created and activated.");
    }
  };

  const toggleStatus = async (r) => {
    const next = r.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    setBusyId(r.publicId);
    try {
      const res = await subAgentService.update(r.publicId, { status: next });
      const updated = unwrap(res);
      setRows((prev) => prev.map((x) => (x.publicId === r.publicId ? { ...x, ...updated } : x)));
      toast.success(next === "ACTIVE" ? "Partner activated." : "Partner suspended.");
    } catch (err) {
      if (!isAlreadyReported(err)) toast.error(getErrorMessage(err, "Couldn't update status."));
    } finally {
      setBusyId(null);
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await subAgentService.remove(deleteRow.publicId);
      setRows((prev) => prev.filter((r) => r.publicId !== deleteRow.publicId));
      toast.success(`${deleteRow.name} removed.`);
      setDeleteRow(null);
    } catch (err) {
      if (!isAlreadyReported(err)) toast.error(getErrorMessage(err, "Couldn't remove the partner."));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-100"
         style={{ fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif" }}>
      <style>{`
        @keyframes saFadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes saPopIn { from{transform:scale(.92);opacity:0} to{transform:scale(1);opacity:1} }
        @keyframes saScaleIn { from{opacity:0;transform:scale(.97)} to{opacity:1;transform:scale(1)} }
      `}</style>

      {editRow && <TravelPartnerFormModal row={editRow} onClose={() => setEditRow(null)} onSaved={handleSaved} />}
      {deleteRow && <DeleteConfirm row={deleteRow} busy={deleting} onClose={() => setDeleteRow(null)} onConfirm={confirmDelete} />}

      {/* header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md shadow-blue-200">
              <Network size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-slate-800">Travel Partners</h1>
              <p className="text-xs text-slate-400">Franchise partners who sell your packages</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/subagents/rollup"
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-sm font-bold hover:bg-slate-50 transition-all">
              Roll-up &amp; commissions <ChevronRight size={15} />
            </Link>
            <button onClick={() => setEditRow({})}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-md shadow-blue-200 transition-all">
              <Plus size={16} /> Add Travel Partner
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* stats */}
        <div className="grid grid-cols-3 gap-4">
          <StatCard gradient="from-blue-500 to-blue-600" icon={Users} label="Total" value={stats.total} />
          <StatCard gradient="from-emerald-500 to-emerald-600" icon={CheckCircle} label="Active" value={stats.active} />
          <StatCard gradient="from-amber-500 to-amber-600" icon={Clock} label="Awaiting license" value={stats.pending} />
        </div>

        {/* list card */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/60 flex gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, email, phone…"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-50 outline-none transition-all" />
            </div>
            <select value={fStatus} onChange={(e) => setFStatus(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-600 outline-none focus:border-blue-400">
              <option value="ALL">All statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="PENDING_LICENSE">Awaiting license</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px]">
              <thead className="bg-slate-50/80 border-b border-slate-100">
                <tr>
                  {["Travel Partner", "Contact", "Commission", "Status", "Added", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3.5 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i}>{[...Array(6)].map((_, j) => (
                      <td key={j} className="px-4 py-4"><div className="h-4 rounded-lg bg-slate-200 animate-pulse" /></td>
                    ))}</tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-16">
                    <div className="text-5xl mb-3">🤝</div>
                    <p className="text-base font-extrabold text-slate-600 mb-1">No Travel Partners found</p>
                    <p className="text-sm text-slate-400 mb-4">
                      {search || fStatus !== "ALL" ? "Try adjusting your filters." : "Provision your first franchise partner."}
                    </p>
                    {!(search || fStatus !== "ALL") && (
                      <button onClick={() => setEditRow({})}
                        className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-200">
                        ＋ Add Travel Partner
                      </button>
                    )}
                  </td></tr>
                ) : (
                  filtered.map((r, idx) => {
                    const pending = r.status === "PENDING_LICENSE";
                    const req = reqByAgent[r.publicId];
                    return (
                    <tr key={r.publicId} className="group hover:bg-blue-50/30 hover:shadow-[inset_3px_0_0_#2563eb] transition-all"
                        style={{ animation: "saFadeUp .35s ease both", animationDelay: `${Math.min(idx, 12) * 25}ms` }}>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-extrabold shrink-0 bg-gradient-to-br ${avatarGrad(r.publicId)}`}
                               style={r.brandColor ? { background: r.brandColor } : undefined}>
                            {initials(r.name)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-slate-800 truncate">{r.name}</p>
                            <p className="text-xs text-slate-400 truncate">{r.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-slate-600 whitespace-nowrap">{r.phoneNumber || "—"}</td>
                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700">
                          {r.markupType === "FIXED" ? <IndianRupee size={13} className="text-blue-500" /> : <Percent size={13} className="text-blue-500" />}
                          {commissionText(r)}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <StatusBadge status={r.status} />
                        {pending && req && (
                          <p className="mt-1 text-[11px] text-amber-600 font-semibold">
                            {req.paymentMode === "ONLINE" ? "Payment due" : "Payment under review"} · {fmtINR(req.amount)}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-sm text-slate-500 whitespace-nowrap">{fmtDate(r.createdAt)}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5 opacity-70 group-hover:opacity-100 transition-opacity">
                          {pending ? (
                            <>
                              {req && req.paymentMode === "ONLINE" && !req.paymentConfirmed && (
                                <button onClick={() => payInvoice(req.invoicePublicId)} title="Complete payment"
                                  className="inline-flex items-center gap-1 h-8 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm">
                                  <Wallet size={13} /> Pay {fmtINR(req.amount)}
                                </button>
                              )}
                              <button onClick={() => setDeleteRow(r)} title="Cancel purchase"
                                className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center border border-red-100">
                                <Trash2 size={14} />
                              </button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => toggleStatus(r)} disabled={busyId === r.publicId}
                                title={r.status === "ACTIVE" ? "Suspend" : "Activate"}
                                className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-colors disabled:opacity-40 ${
                                  r.status === "ACTIVE"
                                    ? "bg-amber-50 hover:bg-amber-100 text-amber-600 border-amber-100"
                                    : "bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border-emerald-100"
                                }`}>
                                {r.status === "ACTIVE" ? <PauseCircle size={15} /> : <PlayCircle size={15} />}
                              </button>
                              <button onClick={() => setEditRow(r)} title="Edit"
                                className="w-8 h-8 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 flex items-center justify-center border border-indigo-100">
                                <Edit2 size={14} />
                              </button>
                              <button onClick={() => setDeleteRow(r)} title="Remove"
                                className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center border border-red-100">
                                <Trash2 size={14} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}