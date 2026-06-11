import { useState, useRef } from "react";
import {
  Search, Plus, Eye, Pencil, Trash2, X, Upload,
  ChevronRight, Home, Star, CheckCircle
} from "lucide-react";

// ─── Sample Data ───────────────────────────────────────────────────────────────
const INITIAL_TESTIMONIALS = [
  {
    id: 1,
    image: null,
    initials: "T2",
    clientName: "Test 2",
    destination: "Nepal Tour (Pokhara, Muktinath & Kathmandu)",
    description:
      "The Nepal tour was well organized with comfortable transportation and good hotel accommodation.",
    status: "Active",
    visible: "Yes",
    created: "Jun 04, 2026",
  },
  {
    id: 2,
    image: null,
    initials: "RM",
    clientName: "Rahul Mehta",
    destination: "Rajasthan Heritage Circuit",
    description:
      "Absolutely loved the heritage walks and the sunset at Mehrangarh Fort. Truly unforgettable!",
    status: "Active",
    visible: "Yes",
    created: "May 28, 2026",
  },
  {
    id: 3,
    image: null,
    initials: "SP",
    clientName: "Sara Patel",
    destination: "Kerala Backwaters & Munnar",
    description:
      "The houseboat stay was magical. Smooth coordination from start to finish — highly recommend.",
    status: "Inactive",
    visible: "No",
    created: "May 15, 2026",
  },
];

// ─── Avatar placeholder ────────────────────────────────────────────────────────
function Avatar({ src, initials, size = "md" }) {
  const sz = size === "sm" ? "w-8 h-8 text-xs" : "w-10 h-10 text-sm";
  if (src)
    return (
      <img src={src} alt="client" className={`${sz} rounded-full object-cover ring-2 ring-blue-100`} />
    );
  return (
    <div className={`${sz} rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-semibold text-white`}>
      {initials}
    </div>
  );
}

// ─── Status Badge ──────────────────────────────────────────────────────────────
function Badge({ value, type }) {
  if (type === "status") {
    return value === "Active" ? (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500 ring-1 ring-slate-200">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" /> Inactive
      </span>
    );
  }
  return value === "Yes" ? (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 ring-1 ring-blue-200">
      <CheckCircle className="w-3 h-3" /> Yes
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-500 ring-1 ring-rose-200">
      No
    </span>
  );
}

// ─── Confirm Delete Dialog ─────────────────────────────────────────────────────
function ConfirmModal({ name, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
        <div className="w-14 h-14 rounded-full bg-rose-50 flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-6 h-6 text-rose-500" />
        </div>
        <h3 className="text-lg font-semibold text-slate-800 mb-1">Delete Testimonial</h3>
        <p className="text-sm text-slate-500 mb-6">
          Are you sure you want to delete <strong>{name}</strong>'s testimonial? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition">
            Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 px-4 py-2.5 rounded-xl bg-rose-500 text-white text-sm font-medium hover:bg-rose-600 transition">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── View Modal ────────────────────────────────────────────────────────────────
function ViewModal({ item, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-slate-800">Testimonial Details</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex items-center gap-4 mb-5 p-4 bg-slate-50 rounded-xl">
          <Avatar src={item.image} initials={item.initials} />
          <div>
            <p className="font-semibold text-slate-800">{item.clientName || "Anonymous"}</p>
            <p className="text-xs text-slate-500 mt-0.5">{item.destination}</p>
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Description</p>
            <p className="text-sm text-slate-700 leading-relaxed">{item.description}</p>
          </div>
          <div className="flex gap-6 pt-2">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Status</p>
              <Badge value={item.status} type="status" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Visible</p>
              <Badge value={item.visible} type="visible" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Created</p>
              <p className="text-sm text-slate-700">{item.created}</p>
            </div>
          </div>
        </div>
        <button onClick={onClose} className="mt-5 w-full px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-sm font-medium hover:bg-slate-200 transition">
          Close
        </button>
      </div>
    </div>
  );
}

// ─── Add / Edit Modal ──────────────────────────────────────────────────────────
const EMPTY_FORM = {
  clientName: "",
  destination: "",
  description: "",
  isActive: true,
  isVisible: true,
  imageFile: null,
  imagePreview: null,
};

function TestimonialModal({ mode = "add", initial = null, onSave, onClose }) {
  const [form, setForm] = useState(
    initial
      ? {
          clientName: initial.clientName,
          destination: initial.destination,
          description: initial.description,
          isActive: initial.status === "Active",
          isVisible: initial.visible === "Yes",
          imageFile: null,
          imagePreview: initial.image || null,
        }
      : EMPTY_FORM
  );
  const [errors, setErrors] = useState({});
  const fileRef = useRef();

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setErrors((e) => ({ ...e, image: "File must be under 2 MB." }));
      return;
    }
    const url = URL.createObjectURL(file);
    set("imageFile", file);
    set("imagePreview", url);
    setErrors((e) => ({ ...e, image: null }));
  };

  const validate = () => {
    const e = {};
    if (!form.destination.trim()) e.destination = "Destination is required.";
    if (!form.description.trim()) e.description = "Description is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const now = new Date();
    const created = now.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
    const initials = form.clientName
      ? form.clientName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
      : "??";
    onSave({
      ...(initial || {}),
      clientName: form.clientName || "Anonymous",
      destination: form.destination,
      description: form.description,
      status: form.isActive ? "Active" : "Inactive",
      visible: form.isVisible ? "Yes" : "No",
      image: form.imagePreview,
      initials,
      created: initial ? initial.created : created,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
              <Star className="w-4 h-4 text-white fill-white" />
            </div>
            <h2 className="text-base font-semibold text-slate-800">
              {mode === "edit" ? "Edit Testimonial" : "Add New Testimonial"}
            </h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left column */}
            <div className="space-y-5">
              {/* Client Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Client Name <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter client name"
                  value={form.clientName}
                  onChange={(e) => set("clientName", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              {/* Destination */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Destination Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Nepal Tour (Pokhara, Muktinath & Kathmandu)"
                  value={form.destination}
                  onChange={(e) => { set("destination", e.target.value); setErrors((er) => ({ ...er, destination: null })); }}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${errors.destination ? "border-rose-400 bg-rose-50" : "border-slate-200"}`}
                />
                {errors.destination && <p className="text-xs text-rose-500 mt-1">{errors.destination}</p>}
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Client Image</label>
                <div
                  onClick={() => fileRef.current.click()}
                  className="border-2 border-dashed border-slate-200 rounded-xl p-5 cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition group"
                >
                  {form.imagePreview ? (
                    <div className="flex items-center gap-4">
                      <img src={form.imagePreview} alt="preview" className="w-16 h-16 rounded-full object-cover ring-2 ring-blue-100" />
                      <div>
                        <p className="text-sm font-medium text-slate-700">Image selected</p>
                        <p className="text-xs text-blue-500 mt-0.5">Click to change</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 py-2">
                      <div className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center transition">
                        <Upload className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition" />
                      </div>
                      <p className="text-sm text-slate-500 group-hover:text-blue-600 transition font-medium">Click to upload image</p>
                    </div>
                  )}
                </div>
                <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png,.gif" className="hidden" onChange={handleFile} />
                {errors.image && <p className="text-xs text-rose-500 mt-1">{errors.image}</p>}
                <div className="mt-2 space-y-0.5">
                  {["Recommended image size: 150×150 pixels", "Max file size: 2MB", "Allowed formats: JPG, JPEG, PNG, GIF"].map((t) => (
                    <p key={t} className="text-xs text-slate-400 flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-slate-300 inline-block" />{t}
                    </p>
                  ))}
                </div>
              </div>

              {/* Checkboxes */}
              <div className="flex items-center gap-6 pt-1">
                {[
                  { label: "Active", key: "isActive" },
                  { label: "Is Visible", key: "isVisible" },
                ].map(({ label, key }) => (
                  <label key={key} className="flex items-center gap-2.5 cursor-pointer group">
                    <div
                      onClick={() => set(key, !form[key])}
                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition ${form[key] ? "bg-blue-600 border-blue-600" : "border-slate-300 group-hover:border-blue-400"}`}
                    >
                      {form[key] && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12">
                          <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm font-medium text-slate-700">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Right column */}
            <div className="flex flex-col">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Testimonial Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                placeholder="Write the client's testimonial here..."
                value={form.description}
                onChange={(e) => { set("description", e.target.value); setErrors((er) => ({ ...er, description: null })); }}
                rows={14}
                className={`flex-1 w-full px-3.5 py-3 rounded-xl border text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none ${errors.description ? "border-rose-400 bg-rose-50" : "border-slate-200"}`}
              />
              {errors.description && <p className="text-xs text-rose-500 mt-1">{errors.description}</p>}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-100 transition">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 active:scale-95 transition shadow-sm shadow-blue-200"
          >
            {mode === "edit" ? "Save Changes" : "Create Testimonial"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState(INITIAL_TESTIMONIALS);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null); // null | { type: "add" | "edit" | "view" | "delete", item? }
  const nextId = useRef(INITIAL_TESTIMONIALS.length + 1);

  const filtered = testimonials.filter(
    (t) =>
      t.clientName.toLowerCase().includes(search.toLowerCase()) ||
      t.destination.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = (data) => {
    if (modal.type === "edit") {
      setTestimonials((list) => list.map((t) => (t.id === data.id ? data : t)));
    } else {
      setTestimonials((list) => [...list, { ...data, id: nextId.current++ }]);
    }
    setModal(null);
  };

  const handleDelete = (id) => {
    setTestimonials((list) => list.filter((t) => t.id !== id));
    setModal(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Top bar */}
      {/* <div className="bg-white border-b border-slate-100 shadow-sm sticky top-0 z-10">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <Star className="w-4 h-4 text-white fill-white" />
          </div>
          <span className="font-bold text-slate-800 text-base tracking-tight">TravelCRM</span>
          <span className="ml-auto text-xs text-slate-400 hidden sm:block">Admin Panel</span>
        </div>
      </div> */}

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6 space-y-5">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-slate-500">
          <Home className="w-3.5 h-3.5" />
          <span className="hover:text-blue-600 cursor-pointer">Home</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="hover:text-blue-600 cursor-pointer">Masters</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-slate-700 font-medium">Testimonials</span>
        </nav>

        {/* Page header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Testimonials</h1>
            <p className="text-sm text-slate-500 mt-0.5">{testimonials.length} total entries</p>
          </div>
          <button
            onClick={() => setModal({ type: "add" })}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm shadow-blue-200 active:scale-95 transition"
          >
            <Plus className="w-4 h-4" />
            Add New Testimonial
          </button>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {/* Search */}
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name or destination…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
            {search && (
              <button onClick={() => setSearch("")} className="text-xs text-slate-400 hover:text-slate-600 transition">
                Clear
              </button>
            )}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {["Image", "Client Name", "Destination", "Description", "Status", "Visible", "Created", "Actions"].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-16 text-slate-400 text-sm">
                      {search ? `No testimonials match "${search}"` : "No testimonials yet. Add your first one!"}
                    </td>
                  </tr>
                ) : (
                  filtered.map((t, idx) => (
                    <tr key={t.id} className={`border-b border-slate-50 hover:bg-blue-50/30 transition ${idx % 2 === 0 ? "" : "bg-slate-50/40"}`}>
                      <td className="px-5 py-3.5">
                        <Avatar src={t.image} initials={t.initials} />
                      </td>
                      <td className="px-5 py-3.5 font-medium text-slate-800 whitespace-nowrap">{t.clientName}</td>
                      <td className="px-5 py-3.5 max-w-[180px]">
                        <p className="text-slate-600 line-clamp-2 text-xs leading-relaxed">{t.destination}</p>
                      </td>
                      <td className="px-5 py-3.5 max-w-[240px]">
                        <p className="text-slate-500 line-clamp-2 text-xs leading-relaxed">{t.description}</p>
                      </td>
                      <td className="px-5 py-3.5"><Badge value={t.status} type="status" /></td>
                      <td className="px-5 py-3.5"><Badge value={t.visible} type="visible" /></td>
                      <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap text-xs">{t.created}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setModal({ type: "view", item: t })}
                            title="View"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setModal({ type: "edit", item: t })}
                            title="Edit"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setModal({ type: "delete", item: t })}
                            title="Delete"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>Showing {filtered.length} of {testimonials.length} entries</span>
            <span className="hidden sm:block">TravelCRM © 2026</span>
          </div>
        </div>
      </div>

      {/* Modals */}
      {modal?.type === "add" && (
        <TestimonialModal mode="add" onSave={handleSave} onClose={() => setModal(null)} />
      )}
      {modal?.type === "edit" && (
        <TestimonialModal mode="edit" initial={modal.item} onSave={handleSave} onClose={() => setModal(null)} />
      )}
      {modal?.type === "view" && (
        <ViewModal item={modal.item} onClose={() => setModal(null)} />
      )}
      {modal?.type === "delete" && (
        <ConfirmModal
          name={modal.item.clientName}
          onConfirm={() => handleDelete(modal.item.id)}
          onCancel={() => setModal(null)}
        />
      )}
    </div>
  );
}