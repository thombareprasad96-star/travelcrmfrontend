import React, { useState, useRef, useEffect } from "react";
import {
  Search, Plus, Eye, Edit, Trash2, X, Settings,
  Bold, Italic, Underline, Strikethrough, AlignLeft,
  AlignCenter, List, ListOrdered, Eraser, ChevronDown,
  ChevronRight, Home, Package, IndianRupee, Sparkles,
  ToggleLeft, ToggleRight
} from "lucide-react";

// ─── Rich Text Editor ─────────────────────────────────────────────────────────
const RichTextEditor = ({ name, initialValue, onChange, placeholder }) => {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== initialValue) {
      editorRef.current.innerHTML = initialValue || "";
    }
  }, []);

  const handleInput = () => {
    if (onChange && editorRef.current) {
      onChange({ target: { name, value: editorRef.current.innerHTML } });
    }
  };

  const exec = (e, cmd, arg = null) => {
    e.preventDefault();
    document.execCommand(cmd, false, arg);
    editorRef.current.focus();
    handleInput();
  };

  const ToolBtn = ({ children, cmd, arg }) => (
    <button
      type="button"
      onMouseDown={(e) => exec(e, cmd, arg)}
      className="p-1.5 rounded-md hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
    >
      {children}
    </button>
  );

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
      {/* Toolbar */}
      <div className="bg-slate-50 border-b border-slate-200 px-3 py-2 flex flex-wrap items-center gap-1 select-none">
        <button
          type="button"
          onMouseDown={(e) => exec(e, "formatBlock", "P")}
          className="flex items-center gap-1 px-2 py-1.5 rounded-md text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
        >
          Normal <ChevronDown size={12} className="text-slate-400" />
        </button>
        <div className="w-px h-4 bg-slate-300 mx-1" />
        <div className="flex items-center">
          <ToolBtn cmd="bold"><Bold size={14} strokeWidth={2.5} /></ToolBtn>
          <ToolBtn cmd="italic"><Italic size={14} /></ToolBtn>
          <ToolBtn cmd="underline"><Underline size={14} /></ToolBtn>
          <ToolBtn cmd="strikeThrough"><Strikethrough size={14} /></ToolBtn>
        </div>
        <div className="w-px h-4 bg-slate-300 mx-1" />
        <div className="flex items-center">
          <ToolBtn cmd="justifyLeft"><AlignLeft size={14} /></ToolBtn>
          <ToolBtn cmd="justifyCenter"><AlignCenter size={14} /></ToolBtn>
          <ToolBtn cmd="insertUnorderedList"><List size={14} /></ToolBtn>
          <ToolBtn cmd="insertOrderedList"><ListOrdered size={14} /></ToolBtn>
        </div>
        <div className="w-px h-4 bg-slate-300 mx-1" />
        <ToolBtn cmd="removeFormat"><Eraser size={14} /></ToolBtn>
      </div>
      {/* Editable area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onBlur={handleInput}
        data-placeholder={placeholder || "Write something…"}
        className="w-full px-4 py-3 focus:outline-none text-sm text-slate-700 leading-relaxed
          [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-1
          [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-1
          [&_b]:font-bold [&_i]:italic [&_u]:underline
          empty:before:content-[attr(data-placeholder)] empty:before:text-slate-400 empty:before:pointer-events-none"
        style={{ minHeight: 110 }}
      />
    </div>
  );
};

// ─── Seed data ────────────────────────────────────────────────────────────────
const SEED_DATA = [
  { id: 73, name: "Arrival Card", description: "", price: 0, active: true },
  {
    id: 77,
    name: "Bali eVISA",
    description:
      "<span class='bg-yellow-100 text-yellow-800 font-semibold px-1 rounded'>Docs Required:</span> Passport Copies (Front + Back) | White background Photos | Pan Cards | Flight tickets (both ways) | Hotel Voucher",
    price: 0,
    active: true,
  },
  { id: 70, name: "Ferry Service", description: "", price: 0, active: true },
  { id: 76, name: "Floating Breakfast", description: "", price: 0, active: true },
  {
    id: 94,
    name: "Nepal Tour and Travels Package",
    description:
      "Complete Nepal tour package including transportation, 3-star hotel accommodation, breakfast, permits, toll taxes, fuel charges, and driver expenses for a group of 5 persons",
    price: 90000,
    active: true,
  },
];

const EMPTY_FORM = { name: "", description: "", price: "0.00", active: true };

// ─── Utility ──────────────────────────────────────────────────────────────────
const formatINR = (v) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(v);

const inputCls =
  "w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 shadow-sm transition focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100";

// ─── Mobile card for a service row ───────────────────────────────────────────
function ServiceCard({ service, onEdit }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-800">{service.name}</p>
          <p className="text-xs text-slate-400 mt-0.5">ID #{service.id}</p>
        </div>
        {service.active ? (
          <span className="flex-shrink-0 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold">Active</span>
        ) : (
          <span className="flex-shrink-0 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200 text-[11px] font-semibold">Inactive</span>
        )}
      </div>
      {service.description && (
        <div
          className="text-xs text-slate-500 leading-relaxed line-clamp-3"
          dangerouslySetInnerHTML={{ __html: service.description }}
        />
      )}
      <div className="flex items-center justify-between pt-1 border-t border-slate-100">
        <span className="text-sm font-bold text-slate-800">{formatINR(service.price)}</span>
        <div className="flex items-center gap-1.5">
          <button className="p-1.5 rounded-lg bg-cyan-50 text-cyan-600 hover:bg-cyan-100 transition border border-cyan-200">
            <Eye size={13} />
          </button>
          <button
            onClick={() => onEdit(service)}
            className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition border border-blue-200"
          >
            <Edit size={13} />
          </button>
          <button className="p-1.5 rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-100 transition border border-rose-200">
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function AddOnServicesMaster() {
  const [services, setServices] = useState(SEED_DATA);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({ ...EMPTY_FORM });
  const [resetKey, setResetKey] = useState(Date.now());

  const filtered = services.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const openModal = (service = null) => {
    setEditingService(service);
    setFormData(service ? { ...service } : { ...EMPTY_FORM });
    setResetKey(Date.now());
    setModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (editingService) {
      setServices((prev) =>
        prev.map((s) => (s.id === editingService.id ? { ...formData, id: s.id } : s))
      );
    } else {
      setServices((prev) => [
        { ...formData, id: Math.floor(Math.random() * 900) + 100 },
        ...prev,
      ]);
    }
    setModalOpen(false);
  };

  // Stats
  const totalActive = services.filter((s) => s.active).length;
  const totalValue = services.reduce((a, s) => a + Number(s.price), 0);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">

        {/* ── Page Header ─────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 shadow-md shadow-blue-200">
              <Settings size={22} className="text-white" strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                Add-On Services Master
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Manage additional services and offerings for packages
              </p>
            </div>
          </div>

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-slate-400 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm self-start sm:self-auto">
            <Home size={12} className="text-slate-400" />
            <span className="text-blue-500 font-medium hover:underline cursor-pointer">Home</span>
            <ChevronRight size={11} />
            <span>Masters</span>
            <ChevronRight size={11} />
            <span className="text-slate-700 font-semibold">Add-On Services</span>
          </nav>
        </div>

        {/* ── Stats Row ───────────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {[
            { label: "Total Services", value: services.length, icon: Package, color: "blue" },
            { label: "Active", value: totalActive, icon: Sparkles, color: "emerald" },
            { label: "Total Value", value: formatINR(totalValue), icon: IndianRupee, color: "violet" },
          ].map(({ label, value, icon: Icon, color }) => {
            const colors = {
              blue: "bg-blue-50 text-blue-600 border-blue-100",
              emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
              violet: "bg-violet-50 text-violet-600 border-violet-100",
            };
            const textColors = {
              blue: "text-blue-700",
              emerald: "text-emerald-700",
              violet: "text-violet-700",
            };
            return (
              <div key={label} className="bg-white rounded-2xl border border-slate-200 shadow-sm px-4 py-4">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <p className="text-xs text-slate-500 font-medium">{label}</p>
                  <div className={`flex h-7 w-7 items-center justify-center rounded-lg border ${colors[color]}`}>
                    <Icon size={14} />
                  </div>
                </div>
                <p className={`text-lg sm:text-xl font-bold ${textColors[color]} truncate`}>{value}</p>
              </div>
            );
          })}
        </div>

        {/* ── Main Card ───────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

          {/* Card toolbar */}
          <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center gap-3">
            <h2 className="text-base font-semibold text-slate-800 flex-1">
              Services List
              <span className="ml-2 text-xs font-normal text-slate-400">({filtered.length} results)</span>
            </h2>

            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition text-slate-700 placeholder-slate-400"
                placeholder="Search services…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <button
              onClick={() => openModal()}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl text-sm font-semibold transition shadow-sm shadow-blue-200 whitespace-nowrap w-full sm:w-auto"
            >
              <Plus size={15} strokeWidth={2.5} />
              Add New Service
            </button>
          </div>

          {/* ── Desktop Table ── */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full min-w-[800px] text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70">
                  {["ID", "Service Name", "Description", "Price", "Status", "Actions"].map((h, i) => (
                    <th
                      key={h}
                      className={`px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide ${i === 5 ? "text-center" : "text-left"}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length > 0 ? (
                  filtered.map((service) => (
                    <tr key={service.id} className="hover:bg-slate-50/60 transition-colors group">
                      <td className="px-5 py-4 text-slate-400 font-mono text-xs font-medium">
                        #{service.id}
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-semibold text-slate-800">{service.name}</span>
                      </td>
                      <td className="px-5 py-4 max-w-xs">
                        {service.description ? (
                          <div
                            className="text-[13px] text-slate-500 leading-relaxed line-clamp-2"
                            dangerouslySetInnerHTML={{ __html: service.description }}
                          />
                        ) : (
                          <span className="text-slate-300 text-xs italic">No description</span>
                        )}
                      </td>
                      <td className="px-5 py-4 font-semibold text-slate-700 whitespace-nowrap">
                        {formatINR(service.price)}
                      </td>
                      <td className="px-5 py-4">
                        {service.active ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-600 border border-rose-200">
                            <span className="h-1.5 w-1.5 rounded-full bg-rose-400 inline-block" />
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            title="View"
                            className="p-1.5 rounded-lg bg-cyan-50 text-cyan-600 border border-cyan-200 hover:bg-cyan-100 transition"
                          >
                            <Eye size={13} />
                          </button>
                          <button
                            title="Edit"
                            onClick={() => openModal(service)}
                            className="p-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 transition"
                          >
                            <Edit size={13} />
                          </button>
                          <button
                            title="Delete"
                            className="p-1.5 rounded-lg bg-rose-50 text-rose-500 border border-rose-200 hover:bg-rose-100 transition"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-5 py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                          <Package size={22} className="text-slate-400" />
                        </div>
                        <p className="text-sm font-semibold text-slate-600">No services found</p>
                        <p className="text-xs text-slate-400">Try a different search term</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* ── Mobile Cards ── */}
          <div className="md:hidden p-4 space-y-3">
            {filtered.length > 0 ? (
              filtered.map((s) => (
                <ServiceCard key={s.id} service={s} onEdit={openModal} />
              ))
            ) : (
              <div className="py-12 text-center">
                <p className="text-sm text-slate-500 font-medium">No services found</p>
                <p className="text-xs text-slate-400 mt-1">Try adjusting your search</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Modal ─────────────────────────────────────────────────── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/60 backdrop-blur-sm p-4 sm:p-6">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl my-6 flex flex-col overflow-hidden">

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50">
                  <Settings size={17} className="text-blue-600" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    {editingService ? "Edit Service" : "New Add-On Service"}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {editingService ? `Editing #${editingService.id}` : "Fill in the service details below"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
              >
                <X size={16} />
              </button>
            </div>

            {/* Section label */}
            <div className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500">
              <p className="text-white text-sm font-semibold">Service Information</p>
            </div>

            <form onSubmit={handleSave}>
              <div className="px-6 py-5 space-y-5 overflow-y-auto" style={{ maxHeight: "65vh" }}>

                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Service Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. Airport Transfer, Visa Assistance"
                    value={formData.name}
                    onChange={handleChange}
                    className={inputCls}
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Description
                  </label>
                  <RichTextEditor
                    key={`desc-${resetKey}`}
                    name="description"
                    initialValue={formData.description}
                    onChange={handleChange}
                    placeholder="Describe what this service includes…"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Price (INR) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">₹</span>
                    <input
                      type="number"
                      name="price"
                      step="0.01"
                      min="0"
                      required
                      value={formData.price}
                      onChange={handleChange}
                      className={`${inputCls} pl-7`}
                    />
                  </div>
                  <p className="mt-1 text-xs text-slate-400">Enter 0 for complimentary services</p>
                </div>

                {/* Active toggle */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div>
                    <p className="text-sm font-semibold text-slate-700">Active status</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {formData.active ? "Visible and bookable in packages" : "Hidden from packages"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData((p) => ({ ...p, active: !p.active }))}
                    className="flex-shrink-0"
                  >
                    {formData.active ? (
                      <ToggleRight size={32} className="text-blue-600" strokeWidth={1.5} />
                    ) : (
                      <ToggleLeft size={32} className="text-slate-400" strokeWidth={1.5} />
                    )}
                  </button>
                </div>

              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 transition shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition shadow-sm shadow-blue-200 active:scale-95"
                >
                  {editingService ? (
                    <><Edit size={14} /> Update Service</>
                  ) : (
                    <><Plus size={14} /> Create Service</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}