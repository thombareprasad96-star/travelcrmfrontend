import { useState, useRef, useEffect, memo, useMemo } from "react";
import { Search, Plus, Eye, Pencil, Trash2, X, Upload, Home, Star, CheckCircle, XCircle, Users, MessageSquare, ArrowUp, ArrowDown, ChevronDown, Inbox } from "lucide-react";

/* ─── PAGINATION ─────────────────────────────────────────── */
function buildPageNumbers(totalPages, pageIndex) {
  if (totalPages <= 0) return [];
  return Array.from({ length: totalPages }, (_, i) => i)
    .filter(p => p === 0 || p === totalPages - 1 || Math.abs(p - pageIndex) <= 1)
    .reduce((acc, p, i, arr) => {
      if (i > 0 && p - arr[i - 1] > 1) acc.push("…");
      acc.push(p);
      return acc;
    }, []);
}

const NavButton = memo(function NavButton({ label, onClick, disabled }) {
  return (
    <button disabled={disabled} onClick={onClick}
      className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-500 text-xs font-bold
        hover:border-blue-300 hover:text-blue-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
      {label}
    </button>
  );
});

const PageButton = memo(function PageButton({ page, isActive, onClick }) {
  return (
    <button onClick={onClick}
      className={`w-8 h-8 rounded-lg text-xs font-bold transition-all border ${
        isActive ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                 : "bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600"
      }`}>
      {page + 1}
    </button>
  );
});

function CommonPagination({ pageIndex, pageSize, totalElements, totalPages, goToPage, changePageSize }) {
  const from = totalElements === 0 ? 0 : pageIndex * pageSize + 1;
  const to   = Math.min((pageIndex + 1) * pageSize, totalElements);
  const pageNumbers = useMemo(() => buildPageNumbers(totalPages, pageIndex), [totalPages, pageIndex]);
  if (totalElements === 0) return null;
  const isFirst = pageIndex === 0;
  const isLast  = pageIndex >= totalPages - 1;
  return (
    <div className="px-5 py-4 border-t border-slate-100 bg-slate-50/60 flex flex-col sm:flex-row items-center justify-between gap-3">
      <p className="text-xs text-slate-400 font-medium">
        Showing <span className="font-bold text-slate-600">{from}</span>–<span className="font-bold text-slate-600">{to}</span> of <span className="font-bold text-slate-600">{totalElements}</span>
      </p>
      <div className="flex items-center gap-1.5 flex-wrap justify-center">
        <NavButton label="«" onClick={() => goToPage(0)}             disabled={isFirst} />
        <NavButton label="‹" onClick={() => goToPage(pageIndex - 1)} disabled={isFirst} />
        {pageNumbers.map((p, i) =>
          typeof p === "string"
            ? <span key={`e${i}`} className="w-8 h-8 flex items-center justify-center text-xs text-slate-400">…</span>
            : <PageButton key={p} page={p} isActive={pageIndex === p} onClick={() => goToPage(p)} />
        )}
        <NavButton label="›" onClick={() => goToPage(pageIndex + 1)} disabled={isLast} />
        <NavButton label="»" onClick={() => goToPage(totalPages - 1)} disabled={isLast} />
        <select value={pageSize} onChange={e => changePageSize(Number(e.target.value))}
          className="ml-2 h-8 px-2 rounded-lg border border-slate-200 text-xs text-slate-600 font-medium bg-white focus:border-blue-400 outline-none cursor-pointer">
          {[5, 10, 25, 50].map(s => <option key={s} value={s}>{s} / page</option>)}
        </select>
      </div>
    </div>
  );
}

/* ─── TOAST ──────────────────────────────────────────────── */
let _toastSetter = null;
const toast = {
  success: (msg) => _toastSetter?.({ msg, type: "success", id: Date.now() }),
  error:   (msg) => _toastSetter?.({ msg, type: "error",   id: Date.now() }),
};
function ToastContainer() {
  const [toasts, setToasts] = useState([]);
  useEffect(() => {
    _toastSetter = (t) => {
      setToasts(p => [...p, t]);
      setTimeout(() => setToasts(p => p.filter(x => x.id !== t.id)), 3000);
    };
    return () => { _toastSetter = null; };
  }, []);
  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      {toasts.map(t => (
        <div key={t.id}
          className={`pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold shadow-xl animate-in slide-in-from-bottom-4 duration-300
            ${t.type === "success" ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"}`}>
          {t.type === "success" ? <CheckCircle size={15} /> : <XCircle size={15} />}
          {t.msg}
        </div>
      ))}
    </div>
  );
}

/* ─── SEED DATA ──────────────────────────────────────────── */
const INITIAL_TESTIMONIALS = [
  { id: 1,  image: null, initials: "T2", clientName: "Test 2",       destination: "Nepal Tour (Pokhara, Muktinath & Kathmandu)", description: "The Nepal tour was well organized with comfortable transportation and good hotel accommodation.", status: "Active",   visible: "Yes", created: "Jun 04, 2026" },
  { id: 2,  image: null, initials: "RM", clientName: "Rahul Mehta",  destination: "Rajasthan Heritage Circuit",                   description: "Absolutely loved the heritage walks and the sunset at Mehrangarh Fort. Truly unforgettable!", status: "Active",   visible: "Yes", created: "May 28, 2026" },
  { id: 3,  image: null, initials: "SP", clientName: "Sara Patel",   destination: "Kerala Backwaters & Munnar",                   description: "The houseboat stay was magical. Smooth coordination from start to finish — highly recommend.",  status: "Inactive", visible: "No",  created: "May 15, 2026" },
  { id: 4,  image: null, initials: "AK", clientName: "Amit Kumar",   destination: "Bali Honeymoon Package",                       description: "Best honeymoon trip ever! The villa and sunset cruise were perfectly arranged.",                status: "Active",   visible: "Yes", created: "May 10, 2026" },
  { id: 5,  image: null, initials: "PV", clientName: "Priya Verma",  destination: "Himachal Pradesh – Manali & Shimla",           description: "Snow-capped mountains, cozy hotels, and a flawless itinerary. Will travel again with them!",   status: "Active",   visible: "Yes", created: "Apr 22, 2026" },
  { id: 6,  image: null, initials: "DS", clientName: "Dev Shah",     destination: "Dubai City Explorer",                         description: "Burj Khalifa views were breathtaking. Hotel and transfers were on point throughout.",           status: "Inactive", visible: "No",  created: "Apr 15, 2026" },
  { id: 7,  image: null, initials: "NR", clientName: "Neha Rao",     destination: "Andaman Islands – Havelock & Neil",            description: "Crystal clear water, pristine beaches, and seamless island-hopping arrangements.",              status: "Active",   visible: "Yes", created: "Mar 30, 2026" },
  { id: 8,  image: null, initials: "VJ", clientName: "Vikram Joshi", destination: "Singapore & Malaysia Combo",                  description: "Both countries covered brilliantly in 8 days. Wonderful memories and zero travel hiccups.",      status: "Active",   visible: "Yes", created: "Mar 18, 2026" },
];

const EMPTY_FORM = { clientName: "", destination: "", description: "", isActive: true, isVisible: true, imageFile: null, imagePreview: null };

/* ─── AVATAR ─────────────────────────────────────────────── */
function Avatar({ src, initials, size = "md" }) {
  const sz = size === "sm" ? "w-8 h-8 text-xs" : size === "lg" ? "w-14 h-14 text-lg" : "w-10 h-10 text-sm";
  if (src) return <img src={src} alt="client" className={`${sz} rounded-full object-cover ring-2 ring-blue-100 flex-shrink-0`} />;
  return (
    <div className={`${sz} rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white flex-shrink-0`}>
      {initials}
    </div>
  );
}

/* ─── BADGE ──────────────────────────────────────────────── */
function Badge({ value, type }) {
  if (type === "status") {
    return value === "Active" ? (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-500 border border-slate-200">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" /> Inactive
      </span>
    );
  }
  return value === "Yes" ? (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
      <CheckCircle size={11} /> Yes
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-500 border border-rose-200">
      <XCircle size={11} /> No
    </span>
  );
}

/* ─── SKELETON ROW ───────────────────────────────────────── */
function SkeletonRow() {
  return (
    <tr>
      {[...Array(8)].map((_, i) => (
        <td key={i} className="px-5 py-4">
          <div className="h-4 rounded-lg bg-slate-200 animate-pulse" style={{ width: `${40 + Math.random() * 50}%` }} />
        </td>
      ))}
    </tr>
  );
}

/* ─── VIEW MODAL ─────────────────────────────────────────── */
function ViewModal({ item, onClose, onEdit }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto z-10">
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-5 rounded-t-2xl">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar src={item.image} initials={item.initials} size="lg" />
              <div>
                <h2 className="text-white text-lg font-extrabold">{item.clientName || "Anonymous"}</h2>
                <p className="text-slate-400 text-xs font-medium mt-0.5">Testimonial #{item.id}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <Badge value={item.status}  type="status"  />
                  <Badge value={item.visible} type="visible" />
                </div>
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all flex-shrink-0">
              <X size={16} />
            </button>
          </div>
        </div>
        <div className="p-6 space-y-5">
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <p className="text-xs text-slate-400 font-medium mb-1.5 uppercase tracking-wide">Destination</p>
            <p className="text-sm font-semibold text-slate-700">{item.destination}</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <p className="text-xs text-slate-400 font-medium mb-1.5 uppercase tracking-wide">Testimonial</p>
            <p className="text-sm text-slate-700 leading-relaxed">{item.description}</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <p className="text-xs text-slate-400 font-medium mb-1.5 uppercase tracking-wide">Created</p>
            <p className="text-sm text-slate-700">{item.created}</p>
          </div>
          <div className="flex gap-3 pt-1">
            <button onClick={() => { onClose(); onEdit(item); }}
              className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold flex items-center justify-center gap-2 transition-all">
              <Pencil size={14} /> Edit
            </button>
            <button onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-bold flex items-center justify-center gap-2 transition-all border border-slate-200">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── DELETE CONFIRM ─────────────────────────────────────── */
function ConfirmModal({ name, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && onCancel()}>
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm z-10 p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
          <Trash2 size={26} className="text-red-500" />
        </div>
        <h3 className="text-lg font-extrabold text-slate-800 mb-1">Delete Testimonial?</h3>
        <p className="text-sm text-slate-500 mb-5">
          Are you sure you want to delete <strong className="text-slate-700">{name}</strong>'s testimonial? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel}  className="flex-1 py-2.5 rounded-xl border-2 border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all">Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md shadow-red-200 transition-all">Yes, Delete</button>
        </div>
      </div>
    </div>
  );
}

/* ─── ADD / EDIT MODAL ───────────────────────────────────── */
function TestimonialModal({ mode = "add", initial = null, onSave, onClose }) {
  const [form, setForm] = useState(
    initial ? {
      clientName: initial.clientName,
      destination: initial.destination,
      description: initial.description,
      isActive: initial.status === "Active",
      isVisible: initial.visible === "Yes",
      imageFile: null,
      imagePreview: initial.image || null,
    } : { ...EMPTY_FORM }
  );
  const [errors, setErrors] = useState({});
  const fileRef = useRef();

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { setErrors(e => ({ ...e, image: "File must be under 2 MB." })); return; }
    set("imageFile", file);
    set("imagePreview", URL.createObjectURL(file));
    setErrors(e => ({ ...e, image: null }));
  };

  const validate = () => {
    const e = {};
    if (!form.destination.trim()) e.destination = "Destination is required.";
    if (!form.description.trim())  e.description  = "Description is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const now      = new Date();
    const created  = now.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
    const initials = form.clientName
      ? form.clientName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
      : "??";
    onSave({
      ...(initial || {}),
      clientName:  form.clientName || "Anonymous",
      destination: form.destination,
      description: form.description,
      status:      form.isActive  ? "Active"   : "Inactive",
      visible:     form.isVisible ? "Yes"      : "No",
      image:       form.imagePreview,
      initials,
      created: initial ? initial.created : created,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/60 backdrop-blur-sm p-4 sm:p-6">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl my-6 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
              <Star size={16} className="text-white fill-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {mode === "edit" ? "Edit Testimonial" : "Add New Testimonial"}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {mode === "edit" ? `Editing — ${initial?.clientName}` : "Fill in the testimonial details below"}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition">
            <X size={16} />
          </button>
        </div>

        {/* Blue section label */}
        <div className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500">
          <p className="text-white text-sm font-semibold">Testimonial Information</p>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: "65vh" }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Left */}
            <div className="space-y-5">
              {/* Client Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Client Name <span className="text-slate-400 font-normal text-xs">(Optional)</span>
                </label>
                <input type="text" placeholder="Enter client name" value={form.clientName}
                  onChange={e => set("clientName", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder-slate-400 shadow-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition bg-white" />
              </div>

              {/* Destination */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Destination <span className="text-rose-500">*</span>
                </label>
                <input type="text" placeholder="e.g. Nepal Tour (Pokhara, Muktinath & Kathmandu)"
                  value={form.destination}
                  onChange={e => { set("destination", e.target.value); setErrors(er => ({ ...er, destination: null })); }}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-700 placeholder-slate-400 shadow-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition bg-white
                    ${errors.destination ? "border-rose-400 bg-rose-50 focus:ring-rose-100" : "border-slate-200"}`} />
                {errors.destination && <p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1"><XCircle size={11} />{errors.destination}</p>}
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Client Image</label>
                <div onClick={() => fileRef.current.click()}
                  className="border-2 border-dashed border-slate-200 rounded-xl p-5 cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition group">
                  {form.imagePreview ? (
                    <div className="flex items-center gap-4">
                      <img src={form.imagePreview} alt="preview" className="w-14 h-14 rounded-full object-cover ring-2 ring-blue-100" />
                      <div>
                        <p className="text-sm font-semibold text-slate-700">Image selected</p>
                        <p className="text-xs text-blue-500 mt-0.5">Click to change</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 py-2">
                      <div className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center transition">
                        <Upload size={18} className="text-slate-400 group-hover:text-blue-500 transition" />
                      </div>
                      <p className="text-sm text-slate-500 group-hover:text-blue-600 font-medium transition">Click to upload image</p>
                      <p className="text-xs text-slate-400">JPG, PNG, GIF · max 2MB · 150×150px</p>
                    </div>
                  )}
                </div>
                <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png,.gif" className="hidden" onChange={handleFile} />
                {errors.image && <p className="text-xs text-rose-500 mt-1.5">{errors.image}</p>}
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-1">
                {[{ label: "Active", key: "isActive" }, { label: "Is Visible", key: "isVisible" }].map(({ label, key }) => (
                  <label key={key} className="flex items-center gap-2.5 cursor-pointer group">
                    <div onClick={() => set(key, !form[key])}
                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition
                        ${form[key] ? "bg-blue-600 border-blue-600" : "border-slate-300 group-hover:border-blue-400"}`}>
                      {form[key] && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12">
                          <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm font-semibold text-slate-700">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Right */}
            <div className="flex flex-col">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Testimonial Description <span className="text-rose-500">*</span>
              </label>
              <textarea placeholder="Write the client's testimonial here..."
                value={form.description}
                onChange={e => { set("description", e.target.value); setErrors(er => ({ ...er, description: null })); }}
                rows={12}
                className={`flex-1 w-full px-3.5 py-3 rounded-xl border text-sm text-slate-700 placeholder-slate-400 shadow-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition resize-none bg-white
                  ${errors.description ? "border-rose-400 bg-rose-50 focus:ring-rose-100" : "border-slate-200"}`} />
              {errors.description && <p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1"><XCircle size={11} />{errors.description}</p>}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-200">
          <button onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 transition shadow-sm">
            Cancel
          </button>
          <button onClick={handleSubmit}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition shadow-sm shadow-blue-200 active:scale-95">
            {mode === "edit" ? <><Pencil size={14} /> Save Changes</> : <><Plus size={14} /> Create Testimonial</>}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── MOBILE CARD ────────────────────────────────────────── */
function TestimonialCard({ item, onView, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3 hover:shadow-md transition-shadow"
      style={{ animation: "fadeUp .35s ease both" }}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar src={item.image} initials={item.initials} size="sm" />
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-800 truncate">{item.clientName}</p>
            <p className="text-xs text-slate-400 mt-0.5 truncate">{item.destination}</p>
          </div>
        </div>
        <div className="flex-shrink-0 flex flex-col items-end gap-1.5">
          <Badge value={item.status}  type="status"  />
          <Badge value={item.visible} type="visible" />
        </div>
      </div>
      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{item.description}</p>
      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <span className="text-xs text-slate-400">{item.created}</span>
        <div className="flex items-center gap-1.5">
          <button onClick={() => onView(item)}   className="w-8 h-8 rounded-lg bg-blue-50   hover:bg-blue-100   text-blue-600   flex items-center justify-center transition border border-blue-200"><Eye    size={13} /></button>
          <button onClick={() => onEdit(item)}   className="w-8 h-8 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 flex items-center justify-center transition border border-indigo-200"><Pencil size={13} /></button>
          <button onClick={() => onDelete(item)} className="w-8 h-8 rounded-lg bg-red-50    hover:bg-red-100    text-red-400 hover:text-red-600 flex items-center justify-center transition border border-red-200"><Trash2 size={13} /></button>
        </div>
      </div>
    </div>
  );
}

/* ─── MAIN PAGE ──────────────────────────────────────────── */
export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState(INITIAL_TESTIMONIALS);
  const [search,       setSearch]       = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortField,    setSortField]    = useState("id");
  const [sortOrder,    setSortOrder]    = useState("desc");
  const [modal,        setModal]        = useState(null);
  const [loading,      setLoading]      = useState(false);
  const nextId = useRef(INITIAL_TESTIMONIALS.length + 1);

  // Pagination
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize,  setPageSize]  = useState(10);

  const filtered = useMemo(() => {
    return testimonials
      .filter(t => {
        const q = search.trim().toLowerCase();
        const matchSearch = q === "" ||
          t.clientName.toLowerCase().includes(q) ||
          t.destination.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q);
        const matchStatus =
          filterStatus === "all" ||
          (filterStatus === "active"   && t.status === "Active") ||
          (filterStatus === "inactive" && t.status === "Inactive");
        return matchSearch && matchStatus;
      })
      .sort((a, b) => {
        if (sortField === "clientName") return sortOrder === "asc" ? a.clientName.localeCompare(b.clientName) : b.clientName.localeCompare(a.clientName);
        if (sortField === "created")    return sortOrder === "asc" ? new Date(a.created) - new Date(b.created) : new Date(b.created) - new Date(a.created);
        return sortOrder === "asc" ? a.id - b.id : b.id - a.id;
      });
  }, [testimonials, search, filterStatus, sortField, sortOrder]);

  useEffect(() => { setPageIndex(0); }, [search, filterStatus, pageSize]);

  const totalElements  = filtered.length;
  const totalPages     = Math.max(1, Math.ceil(totalElements / pageSize));
  const safePageIndex  = Math.min(pageIndex, totalPages - 1);
  const currentItems   = useMemo(() => filtered.slice(safePageIndex * pageSize, (safePageIndex + 1) * pageSize), [filtered, safePageIndex, pageSize]);

  const goToPage       = (page) => setPageIndex(Math.max(0, Math.min(page, totalPages - 1)));
  const changePageSize = (size) => { setPageSize(size); setPageIndex(0); };

  const toggleSort = (field) => {
    if (sortField === field) setSortOrder(o => o === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortOrder("asc"); }
  };
  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ArrowUp size={11} className="text-slate-300" />;
    return sortOrder === "asc" ? <ArrowUp size={11} className="text-blue-500" /> : <ArrowDown size={11} className="text-blue-500" />;
  };

  const handleSave = async (data) => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    if (modal.type === "edit") {
      setTestimonials(list => list.map(t => t.id === data.id ? data : t));
      toast.success("Testimonial updated successfully!");
    } else {
      setTestimonials(list => [...list, { ...data, id: nextId.current++ }]);
      toast.success("Testimonial created successfully!");
    }
    setLoading(false);
    setModal(null);
  };

  const handleDelete = (id) => {
    setTestimonials(list => list.filter(t => t.id !== id));
    toast.success("Testimonial deleted.");
    setModal(null);
  };

  const openEdit = (item) => setModal({ type: "edit", item });

  // Stats
  const activeCount   = testimonials.filter(t => t.status  === "Active").length;
  const visibleCount  = testimonials.filter(t => t.visible === "Yes").length;

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 font-sans"
      style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn { from{transform:translateX(110%);opacity:0}  to{transform:translateX(0);opacity:1} }
        .fade-up { animation: fadeUp .4s ease both; }
      `}</style>

      {/* PAGE HEADER */}
      <div className="bg-white/70 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white shadow-lg shadow-blue-200">
                <Star size={22} strokeWidth={2.2} className="fill-white" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
                  Testimonials
                  <span className="hidden sm:inline text-xs bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">{testimonials.length} total</span>
                </h1>
                <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-1 font-medium">
                  <Home size={11} />
                  <span className="hover:text-blue-600 cursor-pointer transition-colors">Home</span>
                  <span className="mx-1 text-slate-300">/</span>
                  <span>Masters</span>
                  <span className="mx-1 text-slate-300">/</span>
                  <span className="text-blue-600 font-bold">Testimonials</span>
                </div>
              </div>
            </div>
            <button onClick={() => setModal({ type: "add" })}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-md shadow-blue-200 hover:shadow-lg transition-all active:scale-95">
              <Plus size={16} strokeWidth={2.5} /> Add New Testimonial
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* STAT CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {[
            { icon: MessageSquare, label: "Total Testimonials", value: testimonials.length, gradient: "from-cyan-500 to-cyan-600",     delay: 0   },
            { icon: CheckCircle,   label: "Active",              value: activeCount,          gradient: "from-green-500 to-emerald-600", delay: 60  },
            { icon: Users,         label: "Visible on Website",  value: visibleCount,         gradient: "from-violet-500 to-violet-600", delay: 120 },
          ].map(({ icon: Icon, label, value, gradient, delay }) => (
            <div key={label}
              className={`bg-gradient-to-br ${gradient} rounded-2xl p-5 text-white shadow-lg relative overflow-hidden group
                hover:-translate-y-1 hover:shadow-xl transition-all duration-300 cursor-pointer fade-up`}
              style={{ animationDelay: `${delay}ms` }}>
              <div className="absolute -right-5 -top-5 w-24 h-24 rounded-full bg-white/10 group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute -right-3 -bottom-8 w-32 h-32 rounded-full bg-white/10 group-hover:scale-110 transition-transform duration-300" />
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 group-hover:bg-white/30 flex items-center justify-center transition-all">
                    <Icon size={20} strokeWidth={2.2} />
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-extrabold leading-none mb-1">{value}</p>
                <p className="text-xs font-bold uppercase tracking-widest opacity-80">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* MAIN CARD */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">

          {/* List header */}
          <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-base font-extrabold text-slate-700">Testimonials Directory</h2>
              <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2.5 py-1 rounded-full">{totalElements} results</span>
            </div>
            {(search || filterStatus !== "all") && (
              <button onClick={() => { setSearch(""); setFilterStatus("all"); }}
                className="text-xs text-slate-400 hover:text-red-500 font-bold flex items-center gap-1.5 transition-colors">
                ✕ Clear all filters
              </button>
            )}
          </div>

          {/* Filters Bar */}
          <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/60">
            <div className="flex flex-col sm:flex-row gap-3 flex-wrap items-stretch sm:items-center">
              <div className="relative flex-1 min-w-[220px] max-w-sm group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors"><Search size={15} /></div>
                <input type="text" placeholder="Search by name, destination, or description…"
                  value={search} onChange={e => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 placeholder-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-50 outline-none transition-all" />
              </div>
              <div className="relative min-w-[160px]">
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                  className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-600 font-medium focus:border-blue-400 focus:ring-2 focus:ring-blue-50 outline-none appearance-none cursor-pointer transition-all">
                  <option value="all">All Status</option>
                  <option value="active">Active Only</option>
                  <option value="inactive">Inactive Only</option>
                </select>
                <div className="absolute inset-y-0 left-0  pl-3 flex items-center pointer-events-none text-slate-400"><Star size={14} /></div>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400"><ChevronDown size={13} /></div>
              </div>
            </div>
          </div>

          {/* Status Tabs */}
          <div className="px-5 py-4 border-b border-slate-100 overflow-x-auto">
            <div className="flex gap-2 min-w-max">
              {[
                { key: "all",      label: "All",      count: testimonials.length },
                { key: "active",   label: "Active",   count: activeCount         },
                { key: "inactive", label: "Inactive", count: testimonials.length - activeCount },
              ].map(tab => (
                <button key={tab.key} onClick={() => setFilterStatus(tab.key)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-sm
                    ${filterStatus === tab.key
                      ? "bg-blue-600 text-white shadow-blue-200"
                      : "bg-white text-slate-600 border border-slate-200 hover:border-blue-300 hover:text-blue-600"}`}>
                  {tab.key === "active"   && <span className="w-2 h-2 rounded-full bg-emerald-400" />}
                  {tab.key === "inactive" && <span className="w-2 h-2 rounded-full bg-slate-400"   />}
                  {tab.label}
                  <span className={`px-2 py-0.5 rounded-md text-xs font-black ${filterStatus === tab.key ? "bg-white/20" : "bg-slate-100 text-slate-700"}`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm border-collapse whitespace-nowrap">
              <thead className="bg-slate-50/80 border-b border-slate-100">
                <tr className="text-slate-500 text-xs uppercase tracking-wider font-extrabold">
                  <th className="px-5 py-3.5 text-left">Image</th>
                  <th className="px-5 py-3.5 text-left cursor-pointer hover:text-blue-600 select-none" onClick={() => toggleSort("clientName")}>
                    <div className="flex items-center gap-1.5">Client Name <SortIcon field="clientName" /></div>
                  </th>
                  <th className="px-5 py-3.5 text-left">Destination</th>
                  <th className="px-5 py-3.5 text-left">Description</th>
                  <th className="px-5 py-3.5 text-left">Status</th>
                  <th className="px-5 py-3.5 text-left">Visible</th>
                  <th className="px-5 py-3.5 text-left cursor-pointer hover:text-blue-600 select-none" onClick={() => toggleSort("created")}>
                    <div className="flex items-center gap-1.5">Created <SortIcon field="created" /></div>
                  </th>
                  <th className="px-5 py-3.5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 bg-white">
                {loading ? (
                  [...Array(pageSize)].map((_, i) => <SkeletonRow key={i} />)
                ) : currentItems.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-24">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mb-5 shadow-sm transform -rotate-3">
                          <Inbox size={32} className="text-slate-400" />
                        </div>
                        <p className="text-lg font-extrabold text-slate-600 mb-1">No Testimonials Found</p>
                        <p className="text-sm text-slate-400 mb-5">Try adjusting your search or filters.</p>
                        <button onClick={() => { setSearch(""); setFilterStatus("all"); }}
                          className="px-4 py-2 rounded-xl bg-blue-50 text-blue-600 font-bold text-sm hover:bg-blue-100 transition-all">
                          Clear Filters
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentItems.map((t, idx) => (
                    <tr key={t.id}
                      className="group transition-all duration-150 hover:bg-blue-50/40 hover:shadow-[inset_3px_0_0_#2563eb]"
                      style={{ animation: "fadeUp .35s ease both", animationDelay: `${idx * 30}ms` }}>
                      <td className="px-5 py-4"><Avatar src={t.image} initials={t.initials} /></td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="min-w-0">
                            <p className="font-bold text-slate-800">{t.clientName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 max-w-[200px]">
                        <p className="text-slate-600 line-clamp-2 text-xs leading-relaxed whitespace-normal">{t.destination}</p>
                      </td>
                      <td className="px-5 py-4 max-w-[250px]">
                        <p className="text-slate-500 line-clamp-2 text-xs leading-relaxed whitespace-normal">{t.description}</p>
                      </td>
                      <td className="px-5 py-4"><Badge value={t.status}  type="status"  /></td>
                      <td className="px-5 py-4"><Badge value={t.visible} type="visible" /></td>
                      <td className="px-5 py-4 text-xs text-slate-500 font-medium">{t.created}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-1.5 opacity-70 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => setModal({ type: "view", item: t })} title="View"
                            className="w-8 h-8 rounded-lg bg-blue-50   hover:bg-blue-100   text-blue-600   flex items-center justify-center transition-all"><Eye    size={14} /></button>
                          <button onClick={() => setModal({ type: "edit", item: t })} title="Edit"
                            className="w-8 h-8 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 flex items-center justify-center transition-all"><Pencil size={14} /></button>
                          <button onClick={() => setModal({ type: "delete", item: t })} title="Delete"
                            className="w-8 h-8 rounded-lg bg-red-50    hover:bg-red-100    text-red-400 hover:text-red-600 flex items-center justify-center transition-all"><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden p-4 space-y-3">
            {currentItems.length > 0 ? (
              currentItems.map(item => (
                <TestimonialCard key={item.id} item={item}
                  onView={item => setModal({ type: "view", item })}
                  onEdit={openEdit}
                  onDelete={item => setModal({ type: "delete", item })} />
              ))
            ) : (
              <div className="py-16 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mb-4 transform -rotate-3">
                  <Inbox size={28} className="text-slate-400" />
                </div>
                <p className="text-base font-extrabold text-slate-600 mb-1">No Testimonials Found</p>
                <p className="text-sm text-slate-400">Try adjusting your search.</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          <CommonPagination
            pageIndex={safePageIndex}
            pageSize={pageSize}
            totalElements={totalElements}
            totalPages={totalPages}
            goToPage={goToPage}
            changePageSize={changePageSize}
          />
        </div>
      </div>

      {/* Modals */}
      {modal?.type === "add"    && <TestimonialModal mode="add"                   onSave={handleSave}                          onClose={() => setModal(null)} />}
      {modal?.type === "edit"   && <TestimonialModal mode="edit" initial={modal.item} onSave={handleSave}                     onClose={() => setModal(null)} />}
      {modal?.type === "view"   && <ViewModal    item={modal.item} onClose={() => setModal(null)} onEdit={openEdit} />}
      {modal?.type === "delete" && <ConfirmModal name={modal.item.clientName} onConfirm={() => handleDelete(modal.item.id)} onCancel={() => setModal(null)} />}

      <ToastContainer />
    </div>
  );
}