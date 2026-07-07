import React, { useState, useEffect } from "react";
import {
  Search, Plus, Eye, EyeOff, Edit, Trash2, Shield, X,
  Building2, CheckCircle2, ChevronDown, Key, AlertTriangle,
  Globe, Phone, MapPin, Calendar, Hash, Mail, User
} from "lucide-react";
import { Link } from "react-router-dom";
import { organizationService } from "../api/OrganizationService"; // Adjust path if needed

// =========================================================================
// 🌟 TOAST SYSTEM
// =========================================================================
let _toastSetter = null;
const toast = {
  success: (msg) => _toastSetter?.({ msg, type: "success", id: Date.now() }),
  error:   (msg) => _toastSetter?.({ msg, type: "error",   id: Date.now() }),
};
function ToastContainer() {
  const [toasts, setToasts] = useState([]);
  useEffect(() => {
    _toastSetter = (t) => {
      setToasts((prev) => [...prev, t]);
      setTimeout(() => setToasts((p) => p.filter((x) => x.id !== t.id)), 3000);
    };
    return () => { _toastSetter = null; };
  }, []);
  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3">
      {toasts.map((t) => (
        <div key={t.id} className={`${t.type === "success" ? "bg-emerald-600" : "bg-rose-600"} text-white rounded-xl px-5 py-3.5 font-semibold text-sm shadow-xl flex items-center gap-2.5 animate-in slide-in-from-bottom-5 duration-300`}>
          <span>{t.type === "success" ? "✓" : "✕"}</span> {t.msg}
        </div>
      ))}
    </div>
  );
}

// =========================================================================
// SEED DATA
// =========================================================================
const SEED_ORGS = [
  { id: 1,  organizationName: "ABC Travels",   organizationCode: "ABC001", email: "contact@abctravels.com",  phone: "9876543210", address: "Mumbai, Maharashtra",  subscriptionStartDate: "2026-06-10", subscriptionEndDate: "2027-06-10", adminUsername: "abcadmin",  adminEmail: "admin@abctravels.com",  status: "Active"   },
  { id: 2,  organizationName: "XYZ Tours",     organizationCode: "XYZ002", email: "info@xyztours.com",       phone: "9123456780", address: "Delhi, India",          subscriptionStartDate: "2026-01-01", subscriptionEndDate: "2027-01-01", adminUsername: "xyzadmin",  adminEmail: "admin@xyztours.com",    status: "Active"   },
  { id: 3,  organizationName: "Horizon Trips", organizationCode: "HOR003", email: "hello@horizontrips.com",  phone: "9988776655", address: "Bangalore, Karnataka",  subscriptionStartDate: "2025-09-01", subscriptionEndDate: "2026-09-01", adminUsername: "horadmin",  adminEmail: "admin@horizontrips.com",status: "Inactive" },
];

const EMPTY_FORM = {
  // Organization Details
  organizationName:      "",
  organizationCode:      "",
  email:                 "",
  phone:                 "",
  address:               "",
  subscriptionStartDate: "",
  subscriptionEndDate:   "",
  // Admin Account
  adminUsername:         "",
  adminEmail:            "",
  adminPassword:         "",
  confirmAdminPassword:  "",
};

// =========================================================================
// MAIN COMPONENT
// =========================================================================
export default function OrganizationManagement() {
  const [organizations, setOrganizations] = useState([]);
  const [loadingData,   setLoadingData]   = useState(true);
  const [saving,        setSaving]        = useState(false);

  const [search,       setSearch]       = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [modalOpen,      setModalOpen]      = useState(false);
  const [editingOrg,     setEditingOrg]     = useState(null);
  const [formData,       setFormData]       = useState({ ...EMPTY_FORM });
  const [errors,         setErrors]         = useState({});
  const [showPassword,   setShowPassword]   = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  // ── 1. Fetch organizations on mount ──────────────────────
  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    setLoadingData(true);
    try {
      const res  = await organizationService.getAllOrganizations();
      const list = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.data) ? res.data.data : [];
      setOrganizations(list.length > 0 ? list : SEED_ORGS);
    } catch {
      setOrganizations(SEED_ORGS);
    } finally {
      setLoadingData(false);
    }
  };

  // --- Filtering ---
  const filtered = organizations.filter((o) => {
    const matchSearch =
      o.organizationName?.toLowerCase().includes(search.toLowerCase()) ||
      o.organizationCode?.toLowerCase().includes(search.toLowerCase()) ||
      o.email?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // --- Input handler ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  // --- Open modal ---
  const openModal = (org = null) => {
    setErrors({});
    setShowPassword(false);
    setShowConfirmPwd(false);
    if (org) {
      setEditingOrg(org);
      setFormData({
        organizationName:      org.organizationName      ?? "",
        organizationCode:      org.organizationCode      ?? "",
        email:                 org.email                 ?? "",
        phone:                 org.phone                 ?? "",
        address:               org.address               ?? "",
        subscriptionStartDate: org.subscriptionStartDate ?? "",
        subscriptionEndDate:   org.subscriptionEndDate   ?? "",
        adminUsername:         org.adminUsername         ?? "",
        adminEmail:            org.adminEmail            ?? "",
        adminPassword:         "",
        confirmAdminPassword:  "",
      });
    } else {
      setEditingOrg(null);
      setFormData({ ...EMPTY_FORM });
    }
    setModalOpen(true);
  };

  // --- Validation ---
  const validateForm = () => {
    const e = {};
    if (!formData.organizationName.trim())  e.organizationName  = "Organization Name is required.";
    if (!formData.organizationCode.trim())  e.organizationCode  = "Organization Code is required.";
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) e.email = "Valid email is required.";
    if (!formData.phone.trim())             e.phone             = "Phone is required.";
    if (!formData.address.trim())           e.address           = "Address is required.";
    if (!formData.subscriptionStartDate)    e.subscriptionStartDate = "Start date is required.";
    if (!formData.subscriptionEndDate)      e.subscriptionEndDate   = "End date is required.";
    if (!formData.adminUsername.trim())     e.adminUsername     = "Admin Username is required.";
    if (!formData.adminEmail.trim() || !/^\S+@\S+\.\S+$/.test(formData.adminEmail)) e.adminEmail = "Valid admin email is required.";

    // Password validation
    if (!editingOrg || formData.adminPassword) {
      if (!editingOrg && !formData.adminPassword)         e.adminPassword = "Admin Password is required.";
      else if (formData.adminPassword && formData.adminPassword.length < 8) e.adminPassword = "Minimum 8 characters required.";
      if (formData.adminPassword !== formData.confirmAdminPassword) e.confirmAdminPassword = "Passwords do not match.";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── 2. Save (register or update) ─────────────────────────
  const handleSave = async (ev) => {
    ev.preventDefault();
    if (!validateForm()) return;
    setSaving(true);
    try {
      if (editingOrg) {
        // 👉 FIX: Uses tenantId safely for updates so it doesn't send "undefined"
        const completePayload = { ...editingOrg, ...formData };
        const targetId = editingOrg.tenantId || editingOrg.id; 
        
        const res     = await organizationService.updateOrganization(targetId, completePayload);
        const updated = res.data ?? completePayload;
        
        setOrganizations(prev => prev.map(o => (o.tenantId || o.id) === targetId ? { ...o, ...updated } : o));
        toast.success("Organization updated successfully!");
      } else {
        const res     = await organizationService.registerOrganization(formData);
        const created = res.data ?? { ...formData, id: Date.now(), status: "Active" };
        
        setOrganizations(prev => [created, ...prev]);
        toast.success("Organization registered successfully!");
      }
      setModalOpen(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // ── 3. Delete ─────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this organization?")) return;
    try {
      await organizationService.deleteOrganization(id);
      
      // 👉 FIX: Filter using tenantId as well
      setOrganizations(prev => prev.filter(o => (o.tenantId || o.id) !== id));
      toast.success("Organization deleted!");
    } catch {
      toast.error("Failed to delete organization.");
    }
  };

  const inputClass = (err) =>
    `w-full px-4 py-2.5 bg-white border rounded-xl text-sm focus:outline-none focus:ring-4 transition-all ${
      err ? "border-rose-500 focus:ring-rose-500/20" : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/10 text-slate-800"
    }`;

  // =========================================================================
  // RENDER
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans p-4 sm:p-6 lg:p-8">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-600 text-white rounded-2xl shadow-sm shadow-blue-600/20">
            <Building2 size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight m-0">Organizations</h1>
            <p className="text-sm text-slate-500 mt-1 font-medium m-0">Manage organizations, subscriptions, and admin accounts.</p>
          </div>
        </div>
        <div className="text-sm font-medium flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
          <Link to="/" className="text-blue-600 hover:text-blue-800 transition-colors">Home</Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-800 font-bold">Organizations</span>
        </div>
      </div>

      {/* MAIN CARD */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

        {/* Filters & Actions */}
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative flex-1 min-w-[280px]">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input type="text" placeholder="Search organizations..." value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700 shadow-sm" />
            </div>
            <div className="relative min-w-[160px]">
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 appearance-none shadow-sm cursor-pointer">
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
          <button onClick={() => openModal()}
            className="flex items-center justify-center gap-2 bg-[#007bff] hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95 whitespace-nowrap w-full sm:w-auto">
            <Plus size={16} strokeWidth={2.5} /> Add New Organization
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left border-collapse text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-bold text-slate-700">ID</th>
                <th className="px-6 py-4 font-bold text-slate-700">Organization</th>
                <th className="px-6 py-4 font-bold text-slate-700">Code</th>
                <th className="px-6 py-4 font-bold text-slate-700">Contact</th>
                <th className="px-6 py-4 font-bold text-slate-700">Subscription</th>
                <th className="px-6 py-4 font-bold text-slate-700">Admin</th>
                <th className="px-6 py-4 font-bold text-slate-700">Status</th>
                <th className="px-6 py-4 font-bold text-slate-700 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loadingData ? (
                [1,2,3].map(i => (
                  <tr key={`row-${i}`}>
                    {[1,2,3,4,5,6,7,8].map(j => (
                      <td key={`cell-${i}-${j}`} className="px-6 py-4">
                        <div className="h-4 bg-slate-100 rounded animate-pulse"/>
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length > 0 ? (
                filtered.map((org, index) => (
                  <tr key={org.tenantId || org.id || `org-${index}`} className="hover:bg-slate-50/70 transition-colors group">
                    {/* Fix display ID to prefer tenantId if available */}
                    <td className="px-6 py-4 font-semibold text-slate-500">#{org.tenantId || org.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900">{org.organizationName}</span>
                        <span className="text-xs text-slate-500 flex items-center gap-1 mt-0.5"><MapPin size={10}/>{org.address}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-slate-100 text-slate-700 border border-slate-200 px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider">{org.organizationCode}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs text-slate-700 flex items-center gap-1"><Mail size={10} className="text-slate-400"/>{org.email}</span>
                        <span className="text-xs text-slate-500 flex items-center gap-1"><Phone size={10} className="text-slate-400"/>{org.phone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs text-slate-600 flex items-center gap-1"><Calendar size={10} className="text-emerald-500"/>Start: {org.subscriptionStartDate}</span>
                        <span className="text-xs text-slate-600 flex items-center gap-1"><Calendar size={10} className="text-rose-400"/>End: {org.subscriptionEndDate}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-semibold text-blue-600">@{org.adminUsername}</span>
                        <span className="text-xs text-slate-500">{org.adminEmail}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide ${org.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                        {org.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openModal(org)} className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg transition-colors" title="Edit"><Edit size={15}/></button>
                        
                        {/* 👉 FIX: Delete ab sahi ID fetch karke pass karega */}
                        <button onClick={() => handleDelete(org.tenantId || org.id)} className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white rounded-lg transition-colors" title="Delete"><Trash2 size={15}/></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="py-16 text-center">
                    <Building2 size={40} className="text-slate-300 mb-3 mx-auto"/>
                    <p className="text-base font-bold text-slate-700">No organizations found</p>
                    <p className="text-sm text-slate-500 mt-1">Try adjusting your search.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================================================================= */}
      {/* 🏢 ADD / EDIT ORGANIZATION MODAL                                  */}
      {/* ================================================================= */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => !saving && setModalOpen(false)} />

          <div className="relative bg-white w-full max-w-5xl shadow-2xl mt-4 sm:mt-10 mb-10 rounded-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">

            {/* Modal Header */}
            <div className="bg-blue-600 px-8 py-5 flex justify-between items-center text-white">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg"><Building2 size={20} strokeWidth={2.5}/></div>
                <div>
                  <h2 className="text-lg font-bold m-0">{editingOrg ? "Edit Organization" : "Register New Organization"}</h2>
                  <p className="text-xs text-blue-100 m-0 mt-0.5">Fill in organization and admin account details</p>
                </div>
              </div>
              <button onClick={() => !saving && setModalOpen(false)} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"><X size={20}/></button>
            </div>

            <form onSubmit={handleSave}>
              <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-10 bg-slate-50/30">

                {/* ── LEFT COLUMN — Organization Details ── */}
                <div className="space-y-5">
                  <div className="pb-2 border-b border-slate-200">
                    <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                      <Building2 size={15} className="text-blue-500"/> Organization Details
                    </h3>
                  </div>

                  {/* Organization Name */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Organization Name <span className="text-rose-500">*</span></label>
                    <div className="relative">
                      <Building2 size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
                      <input type="text" name="organizationName" value={formData.organizationName} onChange={handleInputChange}
                        className={`${inputClass(errors.organizationName)} pl-10`} placeholder="e.g. ABC Travels" />
                    </div>
                    {errors.organizationName && <p className="text-rose-500 text-xs mt-1.5 font-bold flex items-center gap-1"><AlertTriangle size={12}/>{errors.organizationName}</p>}
                  </div>

                  {/* Organization Code */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Organization Code <span className="text-rose-500">*</span></label>
                    <div className="relative">
                      <Hash size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
                      <input type="text" name="organizationCode" value={formData.organizationCode} onChange={handleInputChange}
                        className={`${inputClass(errors.organizationCode)} pl-10`} placeholder="e.g. ABC001" />
                    </div>
                    {errors.organizationCode && <p className="text-rose-500 text-xs mt-1.5 font-bold flex items-center gap-1"><AlertTriangle size={12}/>{errors.organizationCode}</p>}
                    <p className="text-xs text-slate-400 mt-1.5 font-medium">Unique identifier code for this organization.</p>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Organization Email <span className="text-rose-500">*</span></label>
                    <div className="relative">
                      <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
                      <input type="email" name="email" value={formData.email} onChange={handleInputChange}
                        className={`${inputClass(errors.email)} pl-10`} placeholder="contact@abctravels.com" />
                    </div>
                    {errors.email && <p className="text-rose-500 text-xs mt-1.5 font-bold flex items-center gap-1"><AlertTriangle size={12}/>{errors.email}</p>}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Phone <span className="text-rose-500">*</span></label>
                    <div className="relative">
                      <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange}
                        className={`${inputClass(errors.phone)} pl-10`} placeholder="9876543210" />
                    </div>
                    {errors.phone && <p className="text-rose-500 text-xs mt-1.5 font-bold flex items-center gap-1"><AlertTriangle size={12}/>{errors.phone}</p>}
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Address <span className="text-rose-500">*</span></label>
                    <div className="relative">
                      <MapPin size={15} className="absolute left-3.5 top-3.5 text-slate-400 pointer-events-none"/>
                      <textarea name="address" rows={2} value={formData.address} onChange={handleInputChange}
                        className={`${inputClass(errors.address)} pl-10 resize-none`} placeholder="Mumbai, Maharashtra" />
                    </div>
                    {errors.address && <p className="text-rose-500 text-xs mt-1.5 font-bold flex items-center gap-1"><AlertTriangle size={12}/>{errors.address}</p>}
                  </div>

                  {/* Subscription Dates */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Subscription Start <span className="text-rose-500">*</span></label>
                      <div className="relative">
                        <Calendar size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
                        <input type="date" name="subscriptionStartDate" value={formData.subscriptionStartDate} onChange={handleInputChange}
                          className={`${inputClass(errors.subscriptionStartDate)} pl-10 cursor-pointer`} />
                      </div>
                      {errors.subscriptionStartDate && <p className="text-rose-500 text-xs mt-1 font-bold flex items-center gap-1"><AlertTriangle size={12}/>{errors.subscriptionStartDate}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Subscription End <span className="text-rose-500">*</span></label>
                      <div className="relative">
                        <Calendar size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
                        <input type="date" name="subscriptionEndDate" value={formData.subscriptionEndDate} onChange={handleInputChange}
                          className={`${inputClass(errors.subscriptionEndDate)} pl-10 cursor-pointer`} />
                      </div>
                      {errors.subscriptionEndDate && <p className="text-rose-500 text-xs mt-1 font-bold flex items-center gap-1"><AlertTriangle size={12}/>{errors.subscriptionEndDate}</p>}
                    </div>
                  </div>
                </div>

                {/* ── RIGHT COLUMN — Admin Account ── */}
                <div className="space-y-5">
                  <div className="pb-2 border-b border-slate-200">
                    <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                      <Key size={15} className="text-blue-500"/> Admin Account
                    </h3>
                  </div>

                  {/* Admin Username */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Admin Username <span className="text-rose-500">*</span></label>
                    <div className="relative">
                      <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
                      <input type="text" name="adminUsername" value={formData.adminUsername} onChange={handleInputChange}
                        disabled={!!editingOrg}
                        className={`${inputClass(errors.adminUsername)} pl-10 ${editingOrg ? "bg-slate-100 cursor-not-allowed text-slate-500" : ""}`}
                        placeholder="e.g. abcadmin" />
                    </div>
                    {errors.adminUsername && <p className="text-rose-500 text-xs mt-1.5 font-bold flex items-center gap-1"><AlertTriangle size={12}/>{errors.adminUsername}</p>}
                    <p className="text-xs text-slate-400 mt-1.5 font-medium">Must be unique across all organizations.</p>
                  </div>

                  {/* Admin Email */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Admin Email <span className="text-rose-500">*</span></label>
                    <div className="relative">
                      <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
                      <input type="email" name="adminEmail" value={formData.adminEmail} onChange={handleInputChange}
                        className={`${inputClass(errors.adminEmail)} pl-10`} placeholder="admin@abctravels.com" />
                    </div>
                    {errors.adminEmail && <p className="text-rose-500 text-xs mt-1.5 font-bold flex items-center gap-1"><AlertTriangle size={12}/>{errors.adminEmail}</p>}
                  </div>

                  {/* Admin Password */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      {editingOrg ? "New Admin Password (Leave blank to keep)" : "Admin Password *"}
                    </label>
                    <div className="relative">
                      <Key size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
                      <input type={showPassword ? "text" : "password"} name="adminPassword" value={formData.adminPassword} onChange={handleInputChange}
                        className={`${inputClass(errors.adminPassword)} pl-10 pr-11`} placeholder="••••••••" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none">
                        {showPassword ? <EyeOff size={17}/> : <Eye size={17}/>}
                      </button>
                    </div>
                    {errors.adminPassword && <p className="text-rose-500 text-xs mt-1.5 font-bold flex items-center gap-1"><AlertTriangle size={12}/>{errors.adminPassword}</p>}
                    <p className="text-xs text-slate-400 mt-1.5 font-medium">Minimum 8 characters.</p>
                  </div>

                  {/* Confirm Admin Password */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Confirm Admin Password {(!editingOrg || formData.adminPassword) && <span className="text-rose-500">*</span>}
                    </label>
                    <div className="relative">
                      <Key size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
                      <input type={showConfirmPwd ? "text" : "password"} name="confirmAdminPassword" value={formData.confirmAdminPassword} onChange={handleInputChange}
                        className={`${inputClass(errors.confirmAdminPassword)} pl-10 pr-11`} placeholder="••••••••" />
                      <button type="button" onClick={() => setShowConfirmPwd(!showConfirmPwd)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none">
                        {showConfirmPwd ? <EyeOff size={17}/> : <Eye size={17}/>}
                      </button>
                    </div>
                    {errors.confirmAdminPassword && <p className="text-rose-500 text-xs mt-1.5 font-bold flex items-center gap-1"><AlertTriangle size={12}/>{errors.confirmAdminPassword}</p>}
                  </div>

                  {/* Info box */}
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3 mt-2">
                    <Shield size={16} className="text-blue-500 mt-0.5 flex-shrink-0"/>
                    <div>
                      <p className="text-xs font-bold text-blue-800 mb-1">Admin Account Info</p>
                      <p className="text-xs text-blue-600 leading-relaxed">This admin account will have full access to the organization's CRM. Additional users can be created from the Users section after registration.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="bg-slate-50 px-8 py-5 border-t border-slate-200 flex items-center justify-end gap-3 rounded-b-2xl">
                <button type="button" onClick={() => setModalOpen(false)} disabled={saving}
                  className="px-6 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-100 transition-colors shadow-sm active:scale-95">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="flex items-center gap-2 px-8 py-2.5 bg-[#007bff] hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-blue-500/20 active:scale-95">
                  {saving
                    ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> Saving...</>
                    : <><CheckCircle2 size={16} strokeWidth={2.5}/> {editingOrg ? "Update Organization" : "Register Organization"}</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}