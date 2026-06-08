import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Search, Plus, Eye, Edit, Trash2, Car, UploadCloud, Image as ImageIcon, X, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

/* ─────────────────────────────────────────────
   🌟 CUSTOM TAILWIND TOAST SYSTEM
───────────────────────────────────────────── */
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
        <div key={t.id} className={`${t.type === "success" ? "bg-emerald-500" : "bg-rose-500"} text-white rounded-xl px-5 py-3.5 font-semibold text-sm shadow-lg flex items-center gap-2.5 animate-in slide-in-from-bottom-5 duration-300`}>
          <span>{t.type === "success" ? "✓" : "✕"}</span>
          {t.msg}
        </div>
      ))}
    </div>
  );
}

// =========================================================================
// MOCK DATA & API CONFIG
// =========================================================================
const API = axios.create({
  baseURL: '/api/vehicles', 
  headers: { 'Content-Type': 'application/json' }
});

const SEED_DATA = [
  { id: 1, name: 'Toyota Innova Crysta', type: 'SUV', capacity: 7, image: null, description: 'Premium 7-seater SUV for long tours.', createdAt: '2026-06-01' },
  { id: 2, name: 'Volvo 9400 Sleeper', type: 'Bus', capacity: 40, image: null, description: 'Luxury sleeper bus for intercity travel.', createdAt: '2026-06-05' },
  { id: 3, name: 'Mercedes S-Class', type: 'Sedan', capacity: 4, image: null, description: 'Ultra-luxury sedan for VIP clients.', createdAt: '2026-06-08' },
];

const EMPTY_FORM = { name: '', type: '', capacity: '', image: null, imagePreview: null, description: '' };

// =========================================================================
// MAIN COMPONENT
// =========================================================================
export default function VehicleMaster() {
  // --- State Management ---
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  
  // Filtering
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  
  // Modals
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Active Records
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [viewingVehicle, setViewingVehicle] = useState(null);
  const [deletingVehicle, setDeletingVehicle] = useState(null);
  
  // Form State & Validation
  const fileInputRef = useRef(null);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({ ...EMPTY_FORM });

  // --- Fetch Data on Mount ---
  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const response = await API.get('/');
      // 👉 FIX: Check if data is array or wrapped inside an object
      if (Array.isArray(response.data)) {
        setVehicles(response.data);
      } else if (response.data && Array.isArray(response.data.data)) {
        setVehicles(response.data.data);
      } else {
        console.warn("Invalid API format, using seed data.");
        setVehicles(SEED_DATA);
      }
    } catch (error) {
      console.warn("API not found or failed, using seed data.");
      setVehicles(SEED_DATA); 
    } finally {
      setLoading(false);
    }
  };

  // --- Derived State (Filtering) ---
  // 👉 FIX: Prevent crash by ensuring 'vehicles' is treated as an array and handling undefined names
  const filteredVehicles = (Array.isArray(vehicles) ? vehicles : []).filter(v => {
    const safeName = v?.name || '';
    const matchesSearch = safeName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === '' || v?.type === selectedType;
    return matchesSearch && matchesType;
  });

  // --- Handlers ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match('image.*')) {
        setErrors(prev => ({ ...prev, image: 'Please upload a valid image file (JPG, PNG).' }));
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        setFormData(prev => ({ ...prev, image: file.name, imagePreview: ev.target.result }));
        setErrors(prev => ({ ...prev, image: null }));
      };
      reader.readAsDataURL(file);
    }
  };

  const openModal = (vehicle = null) => {
    setErrors({});
    if (vehicle) {
      setEditingVehicle(vehicle);
      setFormData({
        name: vehicle.name || '', type: vehicle.type || '', capacity: vehicle.capacity || '',
        image: vehicle.image || null, imagePreview: vehicle.imagePreview || vehicle.image || null,
        description: vehicle.description || ''
      });
    } else {
      setEditingVehicle(null);
      setFormData({ ...EMPTY_FORM });
    }
    setShowModal(true);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Vehicle Name is required.";
    if (!formData.type.trim()) newErrors.type = "Vehicle Type is required.";
    if (formData.capacity && isNaN(Number(formData.capacity))) newErrors.capacity = "Must be a numeric value.";
    else if (formData.capacity && Number(formData.capacity) <= 0) newErrors.capacity = "Must be greater than 0.";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setActionLoading(true);
    const payload = {
      ...formData,
      capacity: Number(formData.capacity) || null,
      createdAt: new Date().toISOString().slice(0, 10)
    };

    try {
      if (editingVehicle) {
        setVehicles(prev => prev.map(v => v.id === editingVehicle.id ? { ...v, ...payload } : v));
        toast.success("Vehicle updated successfully!");
      } else {
        setVehicles(prev => [{ ...payload, id: Math.floor(Math.random() * 10000) }, ...prev]);
        toast.success("Vehicle created successfully!");
      }
      setShowModal(false);
    } catch (error) {
      toast.error("Failed to save vehicle.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingVehicle) return;
    setActionLoading(true);
    try {
      setVehicles(prev => prev.filter(v => v.id !== deletingVehicle.id));
      toast.success("Vehicle deleted successfully!");
      setShowDeleteModal(false);
    } catch (error) {
      toast.error("Failed to delete vehicle.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans p-4 sm:p-6 lg:p-8">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-sm">
            <Car size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight m-0">Vehicle Master</h1>
            <p className="text-sm text-slate-500 mt-0.5 m-0 font-medium">Manage your transport fleet</p>
          </div>
        </div>
        <div className="text-sm font-medium flex items-center gap-2">
          <Link to="/" className="text-blue-600 hover:text-blue-800 transition-colors">Home</Link>
          <span className="text-slate-300">/</span><span className="text-slate-500">Masters</span><span className="text-slate-300">/</span>
          <span className="text-slate-700 bg-white border border-slate-200 px-2.5 py-0.5 rounded-md shadow-sm">Vehicle</span>
        </div>
      </div>

      {/* --- MAIN CARD --- */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Filters & Actions */}
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative min-w-[280px]">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search size={16} />
              </div>
              <input 
                type="text" 
                placeholder="Search vehicles..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700 shadow-sm"
              />
            </div>

            <select 
              value={selectedType} 
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full sm:w-[200px] px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 shadow-sm cursor-pointer"
            >
              <option value="">All Vehicle Types</option>
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="Bus">Bus</option>
              <option value="Tempo Traveller">Tempo Traveller</option>
            </select>
          </div>

          <button onClick={() => openModal()} className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md shadow-blue-500/20 active:scale-95 whitespace-nowrap w-full sm:w-auto">
            <Plus size={18} strokeWidth={2.5} /> Add New Vehicle
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left border-collapse text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-bold text-slate-700">ID</th>
                <th className="px-6 py-4 font-bold text-slate-700">Image</th>
                <th className="px-6 py-4 font-bold text-slate-700">Vehicle Name</th>
                <th className="px-6 py-4 font-bold text-slate-700">Vehicle Type</th>
                <th className="px-6 py-4 font-bold text-slate-700">Capacity</th>
                <th className="px-6 py-4 font-bold text-slate-700">Created At</th>
                <th className="px-6 py-4 font-bold text-slate-700 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan="7" className="text-center py-10 text-slate-500">Loading vehicles...</td></tr>
              ) : filteredVehicles.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-slate-400">
                    <Car size={48} className="mx-auto mb-3 opacity-20" />
                    <p className="text-base font-medium">No vehicles found.</p>
                  </td>
                </tr>
              ) : (
                filteredVehicles.map(vehicle => (
                  <tr key={vehicle.id} className="hover:bg-slate-50/70 transition-colors group">
                    <td className="px-6 py-4 font-semibold text-slate-500">#{vehicle.id}</td>
                    <td className="px-6 py-4">
                      {vehicle.imagePreview || vehicle.image ? (
                        <img src={vehicle.imagePreview || vehicle.image} alt={vehicle.name} className="w-16 h-10 object-cover rounded-lg border border-slate-200 shadow-sm" />
                      ) : (
                        <div className="w-16 h-10 bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200 text-slate-400"><ImageIcon size={18} /></div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">{vehicle.name}</td>
                    <td className="px-6 py-4">
                      <span className="bg-sky-100 text-sky-700 px-3 py-1 rounded-md text-[11px] font-extrabold uppercase tracking-wider">{vehicle.type}</span>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-700">
                      {vehicle.capacity ? `${vehicle.capacity} Persons` : '-'}
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-medium">{vehicle.createdAt}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => { setViewingVehicle(vehicle); setShowViewModal(true); }} className="p-2 bg-teal-50 text-teal-600 hover:bg-teal-500 hover:text-white rounded-lg transition-colors"><Eye size={16} /></button>
                        <button onClick={() => openModal(vehicle)} className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg transition-colors"><Edit size={16} /></button>
                        <button onClick={() => { setDeletingVehicle(vehicle); setShowDeleteModal(true); }} className="p-2 bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white rounded-lg transition-colors"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 🚙 CREATE / EDIT MODAL (Extra Large)                                      */}
      {/* ========================================================================= */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 overflow-y-auto custom-scrollbar">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => !actionLoading && setShowModal(false)}></div>
          
          <div className="relative bg-white w-full max-w-6xl shadow-2xl mt-4 sm:mt-10 mb-10 rounded-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
            
            <div className="bg-blue-600 px-8 py-5 flex justify-between items-center text-white">
              <h2 className="text-lg font-bold flex items-center gap-2.5 m-0">
                <Car size={22} /> {editingVehicle ? 'Edit Vehicle Details' : 'Create New Vehicle'}
              </h2>
              <button onClick={() => !actionLoading && setShowModal(false)} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"><X size={20} /></button>
            </div>

            <form onSubmit={handleSave}>
              <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-10 bg-slate-50/50">
                
                {/* Left Column */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Vehicle Name <span className="text-rose-500">*</span></label>
                    <input type="text" name="name" placeholder="e.g. Toyota Innova" value={formData.name} onChange={handleInputChange} className={`w-full px-4 py-3 rounded-xl border ${errors.name ? 'border-rose-500 focus:ring-rose-500/20' : 'border-slate-200 focus:ring-blue-500/20'} bg-white text-sm focus:outline-none focus:ring-4 focus:border-blue-500 transition-all`} />
                    {errors.name && <p className="text-rose-500 text-xs mt-1.5 font-medium">{errors.name}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Vehicle Type <span className="text-rose-500">*</span></label>
                      <input type="text" name="type" placeholder="e.g. SUV, Bus" value={formData.type} onChange={handleInputChange} className={`w-full px-4 py-3 rounded-xl border ${errors.type ? 'border-rose-500 focus:ring-rose-500/20' : 'border-slate-200 focus:ring-blue-500/20'} bg-white text-sm focus:outline-none focus:ring-4 focus:border-blue-500 transition-all`} />
                      {errors.type && <p className="text-rose-500 text-xs mt-1.5 font-medium">{errors.type}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Capacity (Persons)</label>
                      <input type="number" name="capacity" placeholder="e.g. 7" min="1" value={formData.capacity} onChange={handleInputChange} className={`w-full px-4 py-3 rounded-xl border ${errors.capacity ? 'border-rose-500 focus:ring-rose-500/20' : 'border-slate-200 focus:ring-blue-500/20'} bg-white text-sm focus:outline-none focus:ring-4 focus:border-blue-500 transition-all`} />
                      {errors.capacity && <p className="text-rose-500 text-xs mt-1.5 font-medium">{errors.capacity}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                    <textarea name="description" rows="5" placeholder="Brief description about the vehicle's features..." value={formData.description} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"></textarea>
                  </div>
                </div>

                {/* Right Column (Image) */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Vehicle Image</label>
                  <div className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${errors.image ? 'border-rose-400 bg-rose-50' : 'border-slate-300 bg-white hover:bg-slate-50 cursor-pointer'}`} onClick={() => fileInputRef.current?.click()}>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                    
                    {!formData.imagePreview && !formData.image ? (
                      <div className="py-10">
                        <UploadCloud size={48} className="mx-auto text-blue-500 mb-4" />
                        <h4 className="text-base font-bold text-slate-800 mb-1">Click to upload image</h4>
                        <p className="text-sm text-slate-500 font-medium m-0">PNG, JPG up to 5MB</p>
                      </div>
                    ) : (
                      <div>
                        <img src={formData.imagePreview || formData.image} alt="Preview" className="w-full max-h-[280px] object-cover rounded-xl shadow-sm border border-slate-200 mb-4" />
                        <span className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm font-bold">Change Image</span>
                      </div>
                    )}
                  </div>
                  {errors.image && <p className="text-rose-500 text-xs mt-2 font-medium text-center">{errors.image}</p>}
                </div>

              </div>

              {/* Modal Footer */}
              <div className="bg-white px-8 py-5 border-t border-slate-200 flex justify-end gap-3 rounded-b-2xl">
                <button type="button" onClick={() => setShowModal(false)} disabled={actionLoading} className="px-6 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all">Cancel</button>
                <button type="submit" disabled={actionLoading} className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-blue-500/20">
                  {actionLoading ? 'Saving...' : editingVehicle ? 'Update Vehicle' : 'Save Vehicle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 👁️ VIEW MODAL                                                             */}
      {/* ========================================================================= */}
      {showViewModal && viewingVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowViewModal(false)}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            
            {viewingVehicle.imagePreview || viewingVehicle.image ? (
              <div className="w-full h-64 bg-slate-900 relative">
                <img src={viewingVehicle.imagePreview || viewingVehicle.image} alt={viewingVehicle.name} className="w-full h-full object-cover opacity-80" />
                <button onClick={() => setShowViewModal(false)} className="absolute top-4 right-4 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition-colors"><X size={20}/></button>
              </div>
            ) : (
              <div className="w-full h-40 bg-slate-100 flex items-center justify-center relative border-b border-slate-200">
                <Car size={48} className="text-slate-300" />
                <button onClick={() => setShowViewModal(false)} className="absolute top-4 right-4 bg-white border border-slate-200 text-slate-500 p-2 rounded-full hover:bg-slate-50"><X size={20}/></button>
              </div>
            )}
            
            <div className="p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">{viewingVehicle.name}</h2>
              <div className="flex gap-3 mb-6">
                <span className="bg-sky-100 text-sky-700 px-4 py-1.5 rounded-lg text-sm font-bold uppercase tracking-wider">{viewingVehicle.type}</span>
                {viewingVehicle.capacity && <span className="bg-slate-100 text-slate-700 px-4 py-1.5 rounded-lg text-sm font-bold">{viewingVehicle.capacity} Persons</span>}
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Description</h4>
                <p className="text-slate-700 bg-slate-50 p-4 rounded-xl text-sm leading-relaxed border border-slate-100 m-0">{viewingVehicle.description || 'No description provided.'}</p>
              </div>
            </div>
            <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button onClick={() => setShowViewModal(false)} className="px-6 py-2 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-100">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🗑️ DELETE MODAL                                                           */}
      {/* ========================================================================= */}
      {showDeleteModal && deletingVehicle && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => !actionLoading && setShowDeleteModal(false)}></div>
          <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 text-center animate-in zoom-in-95 duration-200">
            <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <AlertTriangle size={32} className="text-rose-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Delete Vehicle?</h3>
            <p className="text-slate-500 mb-8 font-medium">Are you sure you want to delete <strong className="text-rose-600">{deletingVehicle.name}</strong>? This action cannot be undone.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setShowDeleteModal(false)} disabled={actionLoading} className="px-6 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all w-full">Cancel</button>
              <button onClick={handleDelete} disabled={actionLoading} className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-rose-500/20 w-full">
                {actionLoading ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Toast Container */}
      <ToastContainer />
    </div>
  );
}









