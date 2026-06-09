import React, { useState, useEffect } from "react";
import { 
  Search, Plus, Eye, EyeOff, Edit, Trash2, Shield, X, 
  Users, CheckCircle2, ChevronDown, Key
} from "lucide-react";
import { Link } from "react-router-dom";

// =========================================================================
// 🌟 CUSTOM TAILWIND TOAST SYSTEM
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
// MOCK DATA & CONSTANTS
// =========================================================================
const SEED_USERS = [
  { id: 101, username: "admin_rahul", fullName: "Rahul Sharma", email: "rahul@travelcrm.com", role: "Admin", status: "Active", lastLogin: "2026-06-09 10:30 AM", created: "2025-11-12" },
  { id: 102, username: "mgr_priya", fullName: "Priya Patel", email: "priya@travelcrm.com", role: "Manager", status: "Active", lastLogin: "2026-06-08 04:15 PM", created: "2025-12-05" },
  { id: 103, username: "staff_amit", fullName: "Amit Kumar", email: "amit@travelcrm.com", role: "Staff", status: "Inactive", lastLogin: "2026-05-20 09:00 AM", created: "2026-01-10" },
];

const EMPTY_FORM = { 
  username: "", password: "", confirmPassword: "", email: "", 
  fullName: "", phone: "", role: "", template: "", status: "Active" 
};

// =========================================================================
// MAIN COMPONENT
// =========================================================================
export default function UserManagement() {
  const [users, setUsers] = useState(SEED_USERS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ ...EMPTY_FORM });
  const [errors, setErrors] = useState({});

  // Password visibility toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Filtering Logic
  const filteredUsers = users.filter((u) => {
    const matchSearch = u.username.toLowerCase().includes(search.toLowerCase()) || 
                        u.fullName.toLowerCase().includes(search.toLowerCase()) ||
                        u.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || u.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleToggleStatus = () => {
    setFormData(prev => ({ ...prev, status: prev.status === "Active" ? "Inactive" : "Active" }));
  };

  const openModal = (user = null) => {
    setErrors({});
    setShowPassword(false);
    setShowConfirmPassword(false);
    if (user) {
      setEditingUser(user);
      setFormData({ ...user, password: "", confirmPassword: "", template: "" });
    } else {
      setEditingUser(null);
      setFormData({ ...EMPTY_FORM });
    }
    setModalOpen(true);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = "Username is required.";
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Valid email is required.";
    if (!formData.fullName.trim()) newErrors.fullName = "Full Name is required.";
    if (!formData.role) newErrors.role = "Role is required.";

    // Password validation only for new users or if trying to change password
    if (!editingUser || formData.password) {
      if (formData.password.length < 8) newErrors.password = "Minimum 8 characters required.";
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingUser) {
      setUsers(prev => prev.map(u => u.id === editingUser.id ? { ...u, ...formData } : u));
      toast.success("User updated successfully!");
    } else {
      const newUser = {
        ...formData,
        id: Math.floor(Math.random() * 1000) + 200,
        lastLogin: "Never",
        created: new Date().toISOString().slice(0, 10)
      };
      setUsers(prev => [newUser, ...prev]);
      toast.success("User created successfully!");
    }
    setModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers(prev => prev.filter(u => u.id !== id));
      toast.success("User deleted successfully!");
    }
  };

  // Reusable input classes
  const inputClass = (err) => `w-full px-4 py-2.5 bg-white border rounded-xl text-sm focus:outline-none focus:ring-4 transition-all ${err ? 'border-rose-500 focus:ring-rose-500/20' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/10 text-slate-800'}`;

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans p-4 sm:p-6 lg:p-8">
      
      {/* ── HEADER & BREADCRUMBS ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-600 text-white rounded-2xl shadow-sm shadow-blue-600/20">
            <Users size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight m-0">Users</h1>
            <p className="text-sm text-slate-500 mt-1 font-medium m-0">Manage system users, roles, and permissions.</p>
          </div>
        </div>
        <div className="text-sm font-medium flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
          <Link to="/" className="text-blue-600 hover:text-blue-800 transition-colors">Home</Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-800 font-bold">Users</span>
        </div>
      </div>

      {/* ── MAIN CARD ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Filters & Actions */}
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            {/* Search */}
            <div className="relative flex-1 min-w-[280px]">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700 shadow-sm"
              />
            </div>

            {/* Status Filter */}
            <div className="relative min-w-[160px]">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 appearance-none shadow-sm cursor-pointer"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <button 
            onClick={() => openModal()} 
            className="flex items-center justify-center gap-2 bg-[#007bff] hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95 whitespace-nowrap w-full sm:w-auto"
          >
            <Plus size={16} strokeWidth={2.5} /> Add New User
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-left border-collapse text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-bold text-slate-700">ID</th>
                <th className="px-6 py-4 font-bold text-slate-700">User Details</th>
                <th className="px-6 py-4 font-bold text-slate-700">Role</th>
                <th className="px-6 py-4 font-bold text-slate-700">Status</th>
                <th className="px-6 py-4 font-bold text-slate-700">Last Login</th>
                <th className="px-6 py-4 font-bold text-slate-700 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/70 transition-colors group">
                    <td className="px-6 py-4 font-semibold text-slate-500">#{user.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900">{user.fullName}</span>
                        <span className="text-xs text-slate-500">{user.email}</span>
                        <span className="text-[11px] font-semibold text-blue-500 mt-0.5">@{user.username}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-slate-100 text-slate-700 border border-slate-200 px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide ${user.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-700">{user.lastLogin}</span>
                        <span className="text-xs text-slate-400">Created: {user.created}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 bg-amber-50 text-amber-600 hover:bg-amber-500 hover:text-white rounded-lg transition-colors" title="Permissions"><Shield size={15} /></button>
                        <button onClick={() => openModal(user)} className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg transition-colors" title="Edit"><Edit size={15} /></button>
                        <button onClick={() => handleDelete(user.id)} className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white rounded-lg transition-colors" title="Delete"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Users size={40} className="text-slate-300 mb-3" />
                      <p className="text-base font-bold text-slate-700">No users found</p>
                      <p className="text-sm text-slate-500 mt-1 font-medium">Try adjusting your search criteria.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 👤 ADD / EDIT USER MODAL                                                  */}
      {/* ========================================================================= */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 overflow-y-auto custom-scrollbar">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setModalOpen(false)}></div>
          
          <div className="relative bg-white w-full max-w-5xl shadow-2xl mt-4 sm:mt-10 mb-10 rounded-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="bg-blue-600 px-8 py-5 flex justify-between items-center text-white">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Users size={20} strokeWidth={2.5} />
                </div>
                <div>
                  <h2 className="text-lg font-bold m-0">{editingUser ? "Edit User Account" : "Create New User"}</h2>
                </div>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"><X size={20} /></button>
            </div>

            <form onSubmit={handleSave}>
              <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-10 bg-slate-50/30">
                
                {/* ── LEFT COLUMN (Account Credentials) ── */}
                <div className="space-y-6">
                  <div className="pb-2 border-b border-slate-200">
                    <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                      <Key size={16} className="text-blue-500"/> Account Credentials
                    </h3>
                  </div>

                  {/* Username */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Username <span className="text-rose-500">*</span></label>
                    <input type="text" name="username" value={formData.username} onChange={handleInputChange} disabled={!!editingUser} className={`${inputClass(errors.username)} ${editingUser ? 'bg-slate-100 cursor-not-allowed text-slate-500' : ''}`} placeholder="e.g. rahul_sharma" />
                    {errors.username && <p className="text-rose-500 text-xs mt-1.5 font-bold">{errors.username}</p>}
                    <p className="text-xs text-slate-400 mt-1.5 font-medium">Username must be globally unique across all companies in the database.</p>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">{editingUser ? "New Password (Leave blank to keep current)" : "Password *"}</label>
                    <div className="relative">
                      <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleInputChange} className={inputClass(errors.password)} placeholder="••••••••" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none">
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {errors.password && <p className="text-rose-500 text-xs mt-1.5 font-bold">{errors.password}</p>}
                    <p className="text-xs text-slate-400 mt-1.5 font-medium">Minimum 8 characters with uppercase, lowercase, number and special character.</p>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Confirm Password {(!editingUser || formData.password) && <span className="text-rose-500">*</span>}</label>
                    <div className="relative">
                      <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} className={inputClass(errors.confirmPassword)} placeholder="••••••••" />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none">
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-rose-500 text-xs mt-1.5 font-bold">{errors.confirmPassword}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Email Address <span className="text-rose-500">*</span></label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} className={inputClass(errors.email)} placeholder="user@company.com" />
                    {errors.email && <p className="text-rose-500 text-xs mt-1.5 font-bold">{errors.email}</p>}
                    <p className="text-xs text-slate-400 mt-1.5 font-medium">Multiple users can share the same email.</p>
                  </div>
                </div>

                {/* ── RIGHT COLUMN (Profile & Permissions) ── */}
                <div className="space-y-6">
                  <div className="pb-2 border-b border-slate-200">
                    <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                      <Shield size={16} className="text-blue-500"/> Profile & Access
                    </h3>
                  </div>

                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Full Name <span className="text-rose-500">*</span></label>
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} className={inputClass(errors.fullName)} placeholder="e.g. Rahul Sharma" />
                    {errors.fullName && <p className="text-rose-500 text-xs mt-1.5 font-bold">{errors.fullName}</p>}
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className={inputClass()} placeholder="+91 9876543210" />
                    <p className="text-xs text-slate-400 mt-1.5 font-medium">Optional phone number validation.</p>
                  </div>

                  {/* Role Dropdown */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Role <span className="text-rose-500">*</span></label>
                    <div className="relative">
                      <select name="role" value={formData.role} onChange={handleInputChange} className={`${inputClass(errors.role)} appearance-none pr-10 cursor-pointer`}>
                        <option value="">Select Role</option>
                        <option value="Admin">Admin</option>
                        <option value="Manager">Manager</option>
                        <option value="Staff">Staff</option>
                      </select>
                      <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                    {errors.role && <p className="text-rose-500 text-xs mt-1.5 font-bold">{errors.role}</p>}
                    <p className="text-xs text-slate-400 mt-1.5 font-medium">Role determines the user's default access level.</p>
                  </div>

                  {/* Permission Template */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Permission Template</label>
                    <div className="relative">
                      <select name="template" value={formData.template} onChange={handleInputChange} className={`${inputClass()} appearance-none pr-10 cursor-pointer`}>
                        <option value="">Select Template (Optional)</option>
                        <option value="Basic">Basic Access Only</option>
                        <option value="Standard">Standard Access</option>
                        <option value="Full">Full Access</option>
                      </select>
                      <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                    <p className="text-xs text-slate-400 mt-1.5 font-medium">Template will be applied after user creation. You can modify permissions later.</p>
                  </div>

                  {/* Account Status Toggle */}
                  <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">Account Status</h4>
                      <p className="text-xs text-slate-400 mt-0.5 font-medium">Active users can log in and access the system.</p>
                    </div>
                    <label className="flex items-center cursor-pointer relative">
                      <input type="checkbox" className="sr-only" checked={formData.status === "Active"} onChange={handleToggleStatus} />
                      <div className={`block w-12 h-7 rounded-full transition-colors duration-300 ${formData.status === "Active" ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                      <div className={`dot absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform duration-300 shadow-sm ${formData.status === "Active" ? 'transform translate-x-5' : ''}`}></div>
                    </label>
                  </div>

                </div>
              </div>

              {/* Modal Footer */}
              <div className="bg-slate-50 px-8 py-5 border-t border-slate-200 flex justify-end gap-3 rounded-b-2xl">
                <button type="button" onClick={() => setModalOpen(false)} className="px-6 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-100 transition-colors shadow-sm active:scale-95">
                  Cancel
                </button>
                <button type="submit" className="flex items-center gap-2 px-8 py-2.5 bg-[#007bff] hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-blue-500/20 active:scale-95">
                  <CheckCircle2 size={16} strokeWidth={2.5} />
                  {editingUser ? 'Update User' : 'Create User'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Global Toast Container */}
      <ToastContainer />
    </div>
  );
}