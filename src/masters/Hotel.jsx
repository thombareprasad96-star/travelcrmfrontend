// import { useState, useMemo } from "react";
// import {
//   Search, Plus, ChevronDown, ChevronUp, X, Star, MapPin,
//   Phone, Mail, Globe, Upload, Eye, Hotel, Building2,
//   Utensils, Wifi, Car, Dumbbell, Waves, ConciergeBell,
//   PlaneTakeoff, Edit2, Trash2, Check, AlertCircle
// } from "lucide-react";

// const AMENITIES = [
//   { id: "wifi", label: "Free WiFi", icon: Wifi },
//   { id: "pool", label: "Swimming Pool", icon: Waves },
//   { id: "restaurant", label: "Restaurant", icon: Utensils },
//   { id: "parking", label: "Parking", icon: Car },
//   { id: "spa", label: "Spa", icon: Star },
//   { id: "gym", label: "Gym", icon: Dumbbell },
//   { id: "roomservice", label: "Room Service", icon: ConciergeBell },
//   { id: "airport", label: "Airport Transfer", icon: PlaneTakeoff },
// ];

// const BED_TYPES = ["Single", "Double", "Queen", "King", "Twin", "Bunk"];
// const MEAL_PLAN_EXAMPLES = ["EP (Room Only)", "CP (Breakfast)", "MAP (Half Board)", "AP (Full Board)"];

// const initialDestinations = [
//   {
//     id: 1, name: "Goa", cities: ["North Goa", "South Goa", "Panaji"],
//     hotels: [
//       { id: 101, name: "The Leela Goa", city: "South Goa", stars: 5, rating: 4.8, address: "Mobor, Cavelossim, South Goa", contact: "Raj Sharma", phone: "+91 832 662 1234", email: "reservations@leela.com", website: "www.theleela.com", mapUrl: "", lat: "15.1740", lng: "73.9550", overview: "Luxury beachfront resort with private beach access.", amenities: ["wifi", "pool", "restaurant", "spa", "gym", "airport"], isDefault: true, roomTypes: [{ id: 1, name: "Deluxe Room", size: "45 sqm", occupancy: 2, bedType: "King", description: "Elegant room with garden view" }, { id: 2, name: "Ocean Suite", size: "90 sqm", occupancy: 3, bedType: "King", description: "Expansive suite with panoramic sea views" }], mealPlans: [{ id: 1, name: "CP (Breakfast)", price: 800, description: "Continental breakfast included" }, { id: 2, name: "MAP (Half Board)", price: 2200, description: "Breakfast and dinner" }] },
//       { id: 102, name: "Taj Fort Aguada", city: "North Goa", stars: 5, rating: 4.7, address: "Fort Aguada Road, Candolim", contact: "Priya Nair", phone: "+91 832 664 5858", email: "tajgoa@tajhotels.com", website: "www.tajhotels.com", mapUrl: "", lat: "15.5094", lng: "73.7645", overview: "Historic fort converted into a luxury resort.", amenities: ["wifi", "pool", "restaurant", "spa", "parking"], isDefault: false, roomTypes: [{ id: 1, name: "Heritage Room", size: "38 sqm", occupancy: 2, bedType: "Queen", description: "Rooms within the restored fort walls" }], mealPlans: [{ id: 1, name: "EP (Room Only)", price: 0, description: "Room only, no meals" }] },
//     ]
//   },
//   {
//     id: 2, name: "Himachal Pradesh", cities: ["Shimla", "Manali", "Dharamshala"],
//     hotels: [
//       { id: 201, name: "Wildflower Hall", city: "Shimla", stars: 5, rating: 4.9, address: "Chharabra, Shimla Hills", contact: "Arjun Mehta", phone: "+91 177 264 8585", email: "wildflowerhall@oberoihotels.com", website: "www.oberoihotels.com", mapUrl: "", lat: "31.0788", lng: "77.2126", overview: "Legendary Himalayan retreat in a cedar forest.", amenities: ["wifi", "spa", "restaurant", "gym", "parking"], isDefault: true, roomTypes: [{ id: 1, name: "Suite", size: "65 sqm", occupancy: 2, bedType: "King", description: "Panoramic mountain views" }], mealPlans: [{ id: 1, name: "AP (Full Board)", price: 4500, description: "All meals included" }] },
//       { id: 202, name: "Span Resort", city: "Manali", stars: 4, rating: 4.5, address: "NH-21, Kullu-Manali Highway", contact: "Sita Thakur", phone: "+91 1902 240138", email: "span@spanresort.com", website: "www.spanresort.com", mapUrl: "", lat: "32.1566", lng: "77.1167", overview: "Riverside resort on the banks of the Beas river.", amenities: ["wifi", "restaurant", "parking"], isDefault: false, roomTypes: [], mealPlans: [] },
//     ]
//   },
//   {
//     id: 3, name: "Andaman Islands", cities: ["Port Blair", "Havelock", "Neil Island"],
//     hotels: [
//       { id: 301, name: "Taj Exotica Resort", city: "Havelock", stars: 5, rating: 4.8, address: "Radhanagar Beach, Havelock Island", contact: "Mohan Das", phone: "+91 3192 282222", email: "exotica.andaman@tajhotels.com", website: "www.tajhotels.com", mapUrl: "", lat: "11.9765", lng: "92.9842", overview: "Private island luxury on pristine Radhanagar beach.", amenities: ["wifi", "pool", "restaurant", "spa", "airport"], isDefault: true, roomTypes: [{ id: 1, name: "Beach Villa", size: "120 sqm", occupancy: 2, bedType: "King", description: "Private beach access villa" }], mealPlans: [{ id: 1, name: "MAP (Half Board)", price: 3500, description: "Breakfast and dinner included" }] },
//     ]
//   },
//   {
//     id: 4, name: "Hong Kong", cities: ["Kowloon", "Central", "Tsim Sha Tsui"],
//     hotels: [
//       { id: 401, name: "The Peninsula Hong Kong", city: "Tsim Sha Tsui", stars: 5, rating: 4.9, address: "Salisbury Road, Tsim Sha Tsui", contact: "Lisa Wong", phone: "+852 2920 2888", email: "phk@peninsula.com", website: "www.peninsula.com", mapUrl: "", lat: "22.2950", lng: "114.1722", overview: "Iconic luxury hotel since 1928 with fleet of Rolls-Royces.", amenities: ["wifi", "pool", "restaurant", "spa", "gym", "roomservice", "airport"], isDefault: true, roomTypes: [{ id: 1, name: "Deluxe Harbour View", size: "54 sqm", occupancy: 2, bedType: "King", description: "Stunning views of Victoria Harbour" }], mealPlans: [{ id: 1, name: "CP (Breakfast)", price: 1200, description: "Full English breakfast" }] },
//       { id: 402, name: "Ritz-Carlton Hong Kong", city: "Kowloon", stars: 5, rating: 4.8, address: "International Commerce Centre, Kowloon", contact: "James Chan", phone: "+852 2263 2263", email: "rc.hkgkl@ritzcarlton.com", website: "www.ritzcarlton.com", mapUrl: "", lat: "22.3033", lng: "114.1601", overview: "Sky-high luxury hotel on floors 102–118 of ICC tower.", amenities: ["wifi", "pool", "restaurant", "spa", "gym", "roomservice"], isDefault: false, roomTypes: [], mealPlans: [] },
//     ]
//   },
// ];

// const emptyHotel = { name: "", city: "", destinationId: "", stars: 3, rating: "", address: "", contact: "", phone: "", email: "", website: "", mapUrl: "", lat: "", lng: "", overview: "", amenities: [], isDefault: false, roomTypes: [], mealPlans: [] };
// const emptyRoom = { name: "", size: "", occupancy: "", bedType: "King", description: "" };
// const emptyMeal = { name: "", price: "", description: "" };

// function Badge({ children, color = "blue" }) {
//   const map = { blue: "bg-blue-100 text-blue-700", green: "bg-green-100 text-green-700", amber: "bg-amber-100 text-amber-700", red: "bg-red-100 text-red-700", cyan: "bg-cyan-100 text-cyan-700" };
//   return <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${map[color]}`}>{children}</span>;
// }

// function StarRow({ count }) {
//   return <span className="flex gap-0.5">{[1,2,3,4,5].map(i => <Star key={i} size={12} className={i <= count ? "text-amber-400 fill-amber-400" : "text-gray-300"} />)}</span>;
// }

// function Input({ label, required, error, ...props }) {
//   return (
//     <div className="flex flex-col gap-1">
//       {label && <label className="text-xs font-medium text-gray-600">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>}
//       <input className={`border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${error ? "border-red-400 bg-red-50" : "border-gray-200 bg-white"}`} {...props} />
//       {error && <span className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={10} />{error}</span>}
//     </div>
//   );
// }

// function Select({ label, required, children, error, ...props }) {
//   return (
//     <div className="flex flex-col gap-1">
//       {label && <label className="text-xs font-medium text-gray-600">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>}
//       <select className={`border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition ${error ? "border-red-400" : "border-gray-200"}`} {...props}>{children}</select>
//       {error && <span className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={10} />{error}</span>}
//     </div>
//   );
// }

// function Textarea({ label, ...props }) {
//   return (
//     <div className="flex flex-col gap-1">
//       {label && <label className="text-xs font-medium text-gray-600">{label}</label>}
//       <textarea className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white resize-none transition" rows={3} {...props} />
//     </div>
//   );
// }

// function NestedModal({ title, onClose, children }) {
//   return (
//     <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)" }}>
//       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col animate-in fade-in zoom-in-95 duration-200">
//         <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
//           <h3 className="font-semibold text-gray-800">{title}</h3>
//           <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition"><X size={16} /></button>
//         </div>
//         <div className="p-6 overflow-y-auto max-h-[70vh]">{children}</div>
//       </div>
//     </div>
//   );
// }

// export default function HotelMaster() {
//   const [destinations, setDestinations] = useState(initialDestinations);
//   const [search, setSearch] = useState("");
//   const [filterDest, setFilterDest] = useState("");
//   const [filterCity, setFilterCity] = useState("");
//   const [filterStar, setFilterStar] = useState("");
//   const [expanded, setExpanded] = useState({});
//   const [showModal, setShowModal] = useState(false);
//   const [editingHotel, setEditingHotel] = useState(null);
//   const [form, setForm] = useState(emptyHotel);
//   const [errors, setErrors] = useState({});
//   const [saving, setSaving] = useState(false);
//   const [roomModal, setRoomModal] = useState(false);
//   const [mealModal, setMealModal] = useState(false);
//   const [roomForm, setRoomForm] = useState(emptyRoom);
//   const [mealForm, setMealForm] = useState(emptyMeal);
//   const [editRoomIdx, setEditRoomIdx] = useState(null);
//   const [editMealIdx, setEditMealIdx] = useState(null);
//   const [roomErrors, setRoomErrors] = useState({});
//   const [mealErrors, setMealErrors] = useState({});

//   const allCities = useMemo(() => [...new Set(destinations.flatMap(d => d.cities))], [destinations]);

//   const filtered = useMemo(() => destinations.filter(d => {
//     if (filterDest && d.id !== parseInt(filterDest)) return false;
//     const hotels = d.hotels.filter(h => {
//       if (filterCity && h.city !== filterCity) return false;
//       if (filterStar && h.stars !== parseInt(filterStar)) return false;
//       if (search && !h.name.toLowerCase().includes(search.toLowerCase()) && !d.name.toLowerCase().includes(search.toLowerCase())) return false;
//       return true;
//     });
//     return hotels.length > 0 || (!filterCity && !filterStar && !search);
//   }).map(d => ({ ...d, hotels: d.hotels.filter(h => {
//     if (filterCity && h.city !== filterCity) return false;
//     if (filterStar && h.stars !== parseInt(filterStar)) return false;
//     if (search && !h.name.toLowerCase().includes(search.toLowerCase()) && !d.name.toLowerCase().includes(search.toLowerCase())) return false;
//     return true;
//   })})), [destinations, search, filterDest, filterCity, filterStar]);

//   const openAdd = () => { setEditingHotel(null); setForm(emptyHotel); setErrors({}); setShowModal(true); };
//   const openEdit = (hotel, destId) => { setEditingHotel({ ...hotel, destinationId: destId }); setForm({ ...hotel, destinationId: destId }); setErrors({}); setShowModal(true); };
//   const closeModal = () => { setShowModal(false); setEditingHotel(null); };

//   const validate = () => {
//     const e = {};
//     if (!form.destinationId) e.destinationId = "Required";
//     if (!form.city) e.city = "Required";
//     if (!form.name.trim()) e.name = "Required";
//     if (!form.stars) e.stars = "Required";
//     setErrors(e);
//     return Object.keys(e).length === 0;
//   };

//   const handleSave = async () => {
//     if (!validate()) return;
//     setSaving(true);
//     await new Promise(r => setTimeout(r, 800));
//     const destId = parseInt(form.destinationId);
//     setDestinations(prev => prev.map(d => {
//       if (d.id !== destId) return d;
//       const newHotel = { ...form, id: editingHotel ? editingHotel.id : Date.now(), stars: parseInt(form.stars) };
//       if (form.isDefault) {
//         return { ...d, hotels: d.hotels.filter(h => editingHotel ? h.id !== editingHotel.id : true).map(h => ({ ...h, isDefault: false })).concat([{ ...newHotel, isDefault: true }]) };
//       }
//       if (editingHotel) return { ...d, hotels: d.hotels.map(h => h.id === editingHotel.id ? newHotel : h) };
//       return { ...d, hotels: [...d.hotels, newHotel] };
//     }));
//     setSaving(false);
//     closeModal();
//   };

//   const handleDelete = (destId, hotelId) => {
//     setDestinations(prev => prev.map(d => d.id === destId ? { ...d, hotels: d.hotels.filter(h => h.id !== hotelId) } : d));
//   };

//   const selectedDest = destinations.find(d => d.id === parseInt(form.destinationId));

//   // Room modal
//   const openAddRoom = () => { setEditRoomIdx(null); setRoomForm(emptyRoom); setRoomErrors({}); setRoomModal(true); };
//   const openEditRoom = (idx) => { setEditRoomIdx(idx); setRoomForm({ ...form.roomTypes[idx] }); setRoomErrors({}); setRoomModal(true); };
//   const saveRoom = () => {
//     const e = {};
//     if (!roomForm.name.trim()) e.name = "Required";
//     if (!roomForm.occupancy) e.occupancy = "Required";
//     setRoomErrors(e);
//     if (Object.keys(e).length) return;
//     const rooms = [...(form.roomTypes || [])];
//     if (editRoomIdx !== null) rooms[editRoomIdx] = { ...roomForm, id: rooms[editRoomIdx].id };
//     else rooms.push({ ...roomForm, id: Date.now() });
//     setForm(f => ({ ...f, roomTypes: rooms }));
//     setRoomModal(false);
//   };
//   const deleteRoom = (idx) => setForm(f => ({ ...f, roomTypes: f.roomTypes.filter((_, i) => i !== idx) }));

//   // Meal modal
//   const openAddMeal = () => { setEditMealIdx(null); setMealForm(emptyMeal); setMealErrors({}); setMealModal(true); };
//   const openEditMeal = (idx) => { setEditMealIdx(idx); setMealForm({ ...form.mealPlans[idx] }); setMealErrors({}); setMealModal(true); };
//   const saveMeal = () => {
//     const e = {};
//     if (!mealForm.name.trim()) e.name = "Required";
//     if (!mealForm.price && mealForm.price !== 0) e.price = "Required";
//     setMealErrors(e);
//     if (Object.keys(e).length) return;
//     const meals = [...(form.mealPlans || [])];
//     if (editMealIdx !== null) meals[editMealIdx] = { ...mealForm, id: meals[editMealIdx].id };
//     else meals.push({ ...mealForm, id: Date.now() });
//     setForm(f => ({ ...f, mealPlans: meals }));
//     setMealModal(false);
//   };
//   const deleteMeal = (idx) => setForm(f => ({ ...f, mealPlans: f.mealPlans.filter((_, i) => i !== idx) }));

//   const toggleAmenity = (id) => {
//     setForm(f => ({ ...f, amenities: f.amenities.includes(id) ? f.amenities.filter(a => a !== id) : [...f.amenities, id] }));
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
//           <div>
//             <div className="flex items-center gap-2">
//               <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
//                 <Hotel size={16} className="text-white" />
//               </div>
//               <h1 className="text-xl font-bold text-gray-900">Hotel Master</h1>
//             </div>
//             <p className="text-xs text-gray-500 mt-0.5 ml-10">Organized by destinations</p>
//           </div>
//           <button onClick={openAdd} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all shadow-sm shadow-blue-200">
//             <Plus size={16} /> Add New Hotel
//           </button>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
//         <div className="bg-white rounded-2xl border border-gray-200 p-4 flex flex-col sm:flex-row gap-3">
//           <div className="relative flex-1">
//             <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//             <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search hotels or cities..." className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
//           </div>
//           <select value={filterDest} onChange={e => setFilterDest(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[140px]">
//             <option value="">All Destinations</option>
//             {destinations.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
//           </select>
//           <select value={filterCity} onChange={e => setFilterCity(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[130px]">
//             <option value="">All Cities</option>
//             {allCities.map(c => <option key={c} value={c}>{c}</option>)}
//           </select>
//           <select value={filterStar} onChange={e => setFilterStar(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[130px]">
//             <option value="">All Star Categories</option>
//             {[5,4,3,2,1].map(s => <option key={s} value={s}>{s} Star</option>)}
//           </select>
//         </div>
//       </div>

//       {/* Destination Accordion */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-10 space-y-3">
//         {filtered.length === 0 ? (
//           <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center">
//             <Hotel size={36} className="mx-auto text-gray-300 mb-3" />
//             <p className="text-gray-500 font-medium">No hotels found</p>
//             <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters</p>
//           </div>
//         ) : filtered.map(dest => {
//           const isOpen = expanded[dest.id];
//           const defaultHotel = dest.hotels.find(h => h.isDefault);
//           const uniqueCities = [...new Set(dest.hotels.map(h => h.city))];
//           return (
//             <div key={dest.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden transition-shadow hover:shadow-md">
//               {/* Destination Header */}
//               <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:px-6 gap-3 cursor-pointer" onClick={() => setExpanded(e => ({ ...e, [dest.id]: !e[dest.id] }))}>
//                 <div className="flex items-center gap-3 flex-1 min-w-0">
//                   <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
//                     <MapPin size={18} className="text-blue-600" />
//                   </div>
//                   <div className="min-w-0">
//                     <div className="flex items-center gap-2 flex-wrap">
//                       <h2 className="font-bold text-gray-800 text-base">{dest.name}</h2>
//                       {defaultHotel && <Badge color="green">Default: {defaultHotel.name}</Badge>}
//                     </div>
//                     <div className="flex items-center gap-3 mt-0.5 flex-wrap">
//                       <span className="text-xs text-gray-500 flex items-center gap-1"><Hotel size={11} />{dest.hotels.length} Hotels</span>
//                       <span className="text-xs text-gray-500 flex items-center gap-1"><Building2 size={11} />{uniqueCities.length} Cities</span>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-2 flex-shrink-0" onClick={e => e.stopPropagation()}>
//                   <button onClick={() => { setForm({ ...emptyHotel, destinationId: dest.id.toString() }); setErrors({}); setEditingHotel(null); setShowModal(true); }} className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition">
//                     <Plus size={13} /> Add Hotel
//                   </button>
//                   <button className="flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition">
//                     <Eye size={13} /> View
//                   </button>
//                   <div className="p-1.5 rounded-lg hover:bg-gray-100 transition text-gray-400" onClick={() => setExpanded(e => ({ ...e, [dest.id]: !e[dest.id] }))}>
//                     {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//                   </div>
//                 </div>
//               </div>

//               {/* Hotels List */}
//               {isOpen && (
//                 <div className="border-t border-gray-100 divide-y divide-gray-50">
//                   {dest.hotels.length === 0 ? (
//                     <div className="p-8 text-center">
//                       <p className="text-gray-400 text-sm">No hotels in this destination yet.</p>
//                     </div>
//                   ) : dest.hotels.map(hotel => (
//                     <div key={hotel.id} className="px-6 py-4 hover:bg-gray-50/50 transition group">
//                       <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
//                         <div className="flex items-start gap-3 min-w-0">
//                           <div className="w-9 h-9 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
//                             <Hotel size={16} className="text-blue-600" />
//                           </div>
//                           <div className="min-w-0">
//                             <div className="flex items-center gap-2 flex-wrap">
//                               <span className="font-semibold text-gray-800 text-sm">{hotel.name}</span>
//                               {hotel.isDefault && <Badge color="cyan">Default</Badge>}
//                               <Badge color="amber">{hotel.stars}★</Badge>
//                             </div>
//                             <div className="flex items-center gap-3 mt-0.5 flex-wrap">
//                               <span className="text-xs text-gray-500 flex items-center gap-1"><MapPin size={10} />{hotel.city}</span>
//                               <span className="text-xs text-gray-500 flex items-center gap-1"><Phone size={10} />{hotel.phone}</span>
//                               <StarRow count={hotel.stars} />
//                             </div>
//                             {hotel.amenities?.length > 0 && (
//                               <div className="flex gap-1 mt-1.5 flex-wrap">
//                                 {hotel.amenities.slice(0, 4).map(a => {
//                                   const am = AMENITIES.find(x => x.id === a);
//                                   return am ? <span key={a} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{am.label}</span> : null;
//                                 })}
//                                 {hotel.amenities.length > 4 && <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">+{hotel.amenities.length - 4} more</span>}
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                         <div className="flex items-center gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition">
//                           <button onClick={() => openEdit(hotel, dest.id)} className="p-2 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition"><Edit2 size={14} /></button>
//                           <button onClick={() => handleDelete(dest.id, hotel.id)} className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition"><Trash2 size={14} /></button>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           );
//         })}
//       </div>

//       {/* Main Hotel Modal */}
//       {showModal && (
//         <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-6 overflow-y-auto" style={{ background: "rgba(15,23,42,0.55)", backdropFilter: "blur(2px)" }}>
//           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[1400px] my-auto" style={{ minHeight: 600 }}>
//             {/* Modal Header */}
//             <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl z-10">
//               <div className="flex items-center gap-3">
//                 <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
//                   <Hotel size={17} className="text-white" />
//                 </div>
//                 <div>
//                   <h2 className="font-bold text-gray-900 text-base">{editingHotel ? "Edit Hotel" : "Hotel Information"}</h2>
//                   <p className="text-xs text-gray-500">Fill in the details below</p>
//                 </div>
//               </div>
//               <div className="flex items-center gap-2">
//                 <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all active:scale-95 shadow-sm shadow-blue-200">
//                   {saving ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>Saving...</span></> : <><Check size={15} /> Save Hotel</>}
//                 </button>
//                 <button onClick={closeModal} className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition"><X size={18} /></button>
//               </div>
//             </div>

//             {/* Modal Body */}
//             <div className="flex flex-col lg:flex-row gap-0 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
//               {/* Left: Hotel Info */}
//               <div className="flex-1 min-w-0 p-6 space-y-6 overflow-y-auto" style={{ maxHeight: "80vh" }}>
//                 {/* Basic Info */}
//                 <div>
//                   <h3 className="text-sm font-bold text-gray-700 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2"><Hotel size={14} className="text-blue-500" />Basic Information</h3>
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     <Select label="Destination" required error={errors.destinationId} value={form.destinationId} onChange={e => setForm(f => ({ ...f, destinationId: e.target.value, city: "" }))}>
//                       <option value="">Select destination</option>
//                       {destinations.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
//                     </Select>
//                     <Select label="City" required error={errors.city} value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} disabled={!form.destinationId}>
//                       <option value="">Select city</option>
//                       {selectedDest?.cities.map(c => <option key={c} value={c}>{c}</option>)}
//                     </Select>
//                     <Input label="Hotel Name" required error={errors.name} placeholder="e.g. The Grand Palace" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
//                     <div className="flex flex-col gap-1">
//                       <label className="text-xs font-medium text-gray-600">Hotel Image</label>
//                       <label className="border-2 border-dashed border-gray-200 rounded-xl p-3 flex items-center gap-3 cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition group">
//                         <Upload size={16} className="text-gray-400 group-hover:text-blue-500" />
//                         <span className="text-sm text-gray-400 group-hover:text-blue-500">Upload image</span>
//                         <input type="file" className="hidden" accept="image/*" />
//                       </label>
//                     </div>
//                     <Input label="Address" placeholder="Full address" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} className="sm:col-span-2" />
//                     <Select label="Star Category" required error={errors.stars} value={form.stars} onChange={e => setForm(f => ({ ...f, stars: e.target.value }))}>
//                       {[5,4,3,2,1].map(s => <option key={s} value={s}>{s} Star</option>)}
//                     </Select>
//                     <Input label="Star Rating" type="number" min="0" max="5" step="0.1" placeholder="e.g. 4.5" value={form.rating} onChange={e => setForm(f => ({ ...f, rating: e.target.value }))} />
//                   </div>
//                   <div className="mt-3 flex items-center gap-2">
//                     <input type="checkbox" id="defaultHotel" checked={form.isDefault} onChange={e => setForm(f => ({ ...f, isDefault: e.target.checked }))} className="w-4 h-4 accent-blue-600 cursor-pointer" />
//                     <label htmlFor="defaultHotel" className="text-sm text-gray-600 cursor-pointer">Set as default hotel for this city</label>
//                   </div>
//                 </div>

//                 {/* Contact Info */}
//                 <div>
//                   <h3 className="text-sm font-bold text-gray-700 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2"><Phone size={14} className="text-blue-500" />Contact Information</h3>
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     <Input label="Contact Person" placeholder="Full name" value={form.contact} onChange={e => setForm(f => ({ ...f, contact: e.target.value }))} />
//                     <Input label="Phone Number" placeholder="+91 xxxxxxxxxx" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
//                     <Input label="Email" type="email" placeholder="hotel@example.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
//                     <Input label="Website" placeholder="www.example.com" value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} />
//                   </div>
//                 </div>

//                 {/* Location */}
//                 <div>
//                   <h3 className="text-sm font-bold text-gray-700 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2"><MapPin size={14} className="text-blue-500" />Location</h3>
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     <Input label="Google Map URL" placeholder="https://maps.google.com/..." value={form.mapUrl} onChange={e => setForm(f => ({ ...f, mapUrl: e.target.value }))} className="sm:col-span-2" />
//                     <Input label="Latitude" placeholder="e.g. 15.1740" value={form.lat} onChange={e => setForm(f => ({ ...f, lat: e.target.value }))} />
//                     <Input label="Longitude" placeholder="e.g. 73.9550" value={form.lng} onChange={e => setForm(f => ({ ...f, lng: e.target.value }))} />
//                   </div>
//                 </div>

//                 {/* Description */}
//                 <div>
//                   <h3 className="text-sm font-bold text-gray-700 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2"><Globe size={14} className="text-blue-500" />Description</h3>
//                   <Textarea label="Hotel Overview" placeholder="Describe the hotel..." value={form.overview} onChange={e => setForm(f => ({ ...f, overview: e.target.value }))} rows={4} />
//                   <div className="mt-4">
//                     <label className="text-xs font-medium text-gray-600 block mb-2">Amenities</label>
//                     <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
//                       {AMENITIES.map(a => {
//                         const Icon = a.icon;
//                         const selected = form.amenities?.includes(a.id);
//                         return (
//                           <button key={a.id} type="button" onClick={() => toggleAmenity(a.id)} className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all ${selected ? "border-blue-400 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"}`}>
//                             <Icon size={13} className={selected ? "text-blue-500" : "text-gray-400"} />
//                             {a.label}
//                             {selected && <Check size={11} className="text-blue-500 ml-auto" />}
//                           </button>
//                         );
//                       })}
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Right: Room Types + Meal Plans */}
//               <div className="lg:w-[440px] flex-shrink-0 p-6 space-y-6 overflow-y-auto" style={{ maxHeight: "80vh" }}>
//                 {/* Room Types */}
//                 <div className="bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden">
//                   <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
//                     <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2"><Building2 size={14} className="text-blue-500" />Room Types</h3>
//                     <button onClick={openAddRoom} className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition">
//                       <Plus size={13} /> Add Room Type
//                     </button>
//                   </div>
//                   {!form.roomTypes?.length ? (
//                     <div className="p-6 text-center">
//                       <Building2 size={24} className="mx-auto text-gray-300 mb-2" />
//                       <p className="text-xs text-gray-400">No room types added yet</p>
//                     </div>
//                   ) : (
//                     <div className="overflow-x-auto">
//                       <table className="w-full text-xs">
//                         <thead><tr className="border-b border-gray-200 bg-gray-100/80"><th className="px-4 py-2 text-left text-gray-600 font-semibold">Room</th><th className="px-3 py-2 text-left text-gray-600 font-semibold">Occ.</th><th className="px-3 py-2 text-left text-gray-600 font-semibold">Bed</th><th className="px-3 py-2 text-right text-gray-600 font-semibold">Actions</th></tr></thead>
//                         <tbody className="divide-y divide-gray-100">{form.roomTypes.map((r, i) => (
//                           <tr key={i} className="hover:bg-white transition">
//                             <td className="px-4 py-2.5 font-medium text-gray-700">{r.name}</td>
//                             <td className="px-3 py-2.5 text-gray-500">{r.occupancy}</td>
//                             <td className="px-3 py-2.5 text-gray-500">{r.bedType}</td>
//                             <td className="px-3 py-2.5 text-right">
//                               <button onClick={() => openEditRoom(i)} className="p-1 rounded hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition mr-1"><Edit2 size={12} /></button>
//                               <button onClick={() => deleteRoom(i)} className="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 transition"><Trash2 size={12} /></button>
//                             </td>
//                           </tr>
//                         ))}</tbody>
//                       </table>
//                     </div>
//                   )}
//                 </div>

//                 {/* Meal Plans */}
//                 <div className="bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden">
//                   <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
//                     <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2"><Utensils size={14} className="text-green-500" />Meal Plans</h3>
//                     <button onClick={openAddMeal} className="flex items-center gap-1.5 text-xs font-medium text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg transition">
//                       <Plus size={13} /> Add Meal Plan
//                     </button>
//                   </div>
//                   {!form.mealPlans?.length ? (
//                     <div className="p-6 text-center">
//                       <Utensils size={24} className="mx-auto text-gray-300 mb-2" />
//                       <p className="text-xs text-gray-400">No meal plans added yet</p>
//                     </div>
//                   ) : (
//                     <div className="overflow-x-auto">
//                       <table className="w-full text-xs">
//                         <thead><tr className="border-b border-gray-200 bg-gray-100/80"><th className="px-4 py-2 text-left text-gray-600 font-semibold">Plan</th><th className="px-3 py-2 text-left text-gray-600 font-semibold">Price</th><th className="px-3 py-2 text-right text-gray-600 font-semibold">Actions</th></tr></thead>
//                         <tbody className="divide-y divide-gray-100">{form.mealPlans.map((m, i) => (
//                           <tr key={i} className="hover:bg-white transition">
//                             <td className="px-4 py-2.5 font-medium text-gray-700">{m.name}</td>
//                             <td className="px-3 py-2.5 text-gray-500">₹{m.price}</td>
//                             <td className="px-3 py-2.5 text-right">
//                               <button onClick={() => openEditMeal(i)} className="p-1 rounded hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition mr-1"><Edit2 size={12} /></button>
//                               <button onClick={() => deleteMeal(i)} className="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 transition"><Trash2 size={12} /></button>
//                             </td>
//                           </tr>
//                         ))}</tbody>
//                       </table>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Room Type Nested Modal */}
//       {roomModal && (
//         <NestedModal title={editRoomIdx !== null ? "Edit Room Type" : "Add Room Type"} onClose={() => setRoomModal(false)}>
//           <div className="space-y-4">
//             <Input label="Room Name" required error={roomErrors.name} placeholder="e.g. Deluxe Room" value={roomForm.name} onChange={e => setRoomForm(f => ({ ...f, name: e.target.value }))} />
//             <div className="grid grid-cols-2 gap-4">
//               <Input label="Room Size" placeholder="e.g. 45 sqm" value={roomForm.size} onChange={e => setRoomForm(f => ({ ...f, size: e.target.value }))} />
//               <Input label="Max Occupancy" required error={roomErrors.occupancy} type="number" min="1" placeholder="e.g. 2" value={roomForm.occupancy} onChange={e => setRoomForm(f => ({ ...f, occupancy: e.target.value }))} />
//             </div>
//             <Select label="Bed Type" value={roomForm.bedType} onChange={e => setRoomForm(f => ({ ...f, bedType: e.target.value }))}>
//               {BED_TYPES.map(b => <option key={b}>{b}</option>)}
//             </Select>
//             <div className="flex flex-col gap-1">
//               <label className="text-xs font-medium text-gray-600">Room Images</label>
//               <label className="border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center gap-2 cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition">
//                 <Upload size={20} className="text-gray-300" />
//                 <span className="text-sm text-gray-400">Upload room images</span>
//                 <input type="file" className="hidden" accept="image/*" multiple />
//               </label>
//             </div>
//             <Textarea label="Description" placeholder="Describe the room..." value={roomForm.description} onChange={e => setRoomForm(f => ({ ...f, description: e.target.value }))} />
//             <button onClick={saveRoom} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-sm font-medium transition active:scale-95">
//               {editRoomIdx !== null ? "Update Room Type" : "Add Room Type"}
//             </button>
//           </div>
//         </NestedModal>
//       )}

//       {/* Meal Plan Nested Modal */}
//       {mealModal && (
//         <NestedModal title={editMealIdx !== null ? "Edit Meal Plan" : "Add Meal Plan"} onClose={() => setMealModal(false)}>
//           <div className="space-y-4">
//             <div className="flex flex-col gap-1">
//               <label className="text-xs font-medium text-gray-600">Meal Plan Name <span className="text-red-500">*</span></label>
//               <input list="mealExamples" placeholder="e.g. CP (Breakfast)" value={mealForm.name} onChange={e => setMealForm(f => ({ ...f, name: e.target.value }))} className={`border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${mealErrors.name ? "border-red-400 bg-red-50" : "border-gray-200 bg-white"}`} />
//               <datalist id="mealExamples">{MEAL_PLAN_EXAMPLES.map(m => <option key={m} value={m} />)}</datalist>
//               {mealErrors.name && <span className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={10} />{mealErrors.name}</span>}
//             </div>
//             <Input label="Price (₹)" required error={mealErrors.price} type="number" min="0" placeholder="e.g. 800" value={mealForm.price} onChange={e => setMealForm(f => ({ ...f, price: e.target.value }))} />
//             <Textarea label="Description" placeholder="What's included in this plan?" value={mealForm.description} onChange={e => setMealForm(f => ({ ...f, description: e.target.value }))} />
//             <button onClick={saveMeal} className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl text-sm font-medium transition active:scale-95">
//               {editMealIdx !== null ? "Update Meal Plan" : "Add Meal Plan"}
//             </button>
//           </div>
//         </NestedModal>
//       )}
//     </div>
//   );
// }







import { useState, useMemo, useEffect } from "react";
import {
  Search, Plus, ChevronDown, ChevronUp, X, Star, MapPin,
  Phone, Mail, Globe, Upload, Eye, Hotel, Building2,
  Utensils, Wifi, Car, Dumbbell, Waves, ConciergeBell,
  PlaneTakeoff, Edit2, Trash2, Check, AlertCircle
} from "lucide-react";
import { hotelService, transformHotelResponse } from "../services/HotelService";

const AMENITIES = [
  { id: "wifi",        label: "Free WiFi",        icon: Wifi },
  { id: "pool",        label: "Swimming Pool",     icon: Waves },
  { id: "restaurant",  label: "Restaurant",        icon: Utensils },
  { id: "parking",     label: "Parking",           icon: Car },
  { id: "spa",         label: "Spa",               icon: Star },
  { id: "gym",         label: "Gym",               icon: Dumbbell },
  { id: "roomservice", label: "Room Service",      icon: ConciergeBell },
  { id: "airport",     label: "Airport Transfer",  icon: PlaneTakeoff },
];

const BED_TYPES = ["Single", "Double", "Queen", "King", "Twin", "Bunk"];
const MEAL_PLAN_EXAMPLES = ["EP (Room Only)", "CP (Breakfast)", "MAP (Half Board)", "AP (Full Board)"];

// ── Fallback static data (used until API loads) ──────────────
const initialDestinations = [
  {
    id: 1, name: "Goa", cities: ["North Goa", "South Goa", "Panaji"],
    hotels: [
      { id: 101, name: "The Leela Goa", city: "South Goa", stars: 5, rating: 4.8, address: "Mobor, Cavelossim, South Goa", contact: "Raj Sharma", phone: "+91 832 662 1234", email: "reservations@leela.com", website: "www.theleela.com", mapUrl: "", lat: "15.1740", lng: "73.9550", overview: "Luxury beachfront resort with private beach access.", amenities: ["wifi", "pool", "restaurant", "spa", "gym", "airport"], isDefault: true, roomTypes: [{ id: 1, name: "Deluxe Room", size: "45 sqm", occupancy: 2, bedType: "King", description: "Elegant room with garden view" }], mealPlans: [{ id: 1, name: "CP (Breakfast)", price: 800, description: "Continental breakfast included" }] },
      { id: 102, name: "Taj Fort Aguada", city: "North Goa", stars: 5, rating: 4.7, address: "Fort Aguada Road, Candolim", contact: "Priya Nair", phone: "+91 832 664 5858", email: "tajgoa@tajhotels.com", website: "www.tajhotels.com", mapUrl: "", lat: "15.5094", lng: "73.7645", overview: "Historic fort converted into a luxury resort.", amenities: ["wifi", "pool", "restaurant", "spa", "parking"], isDefault: false, roomTypes: [], mealPlans: [] },
    ]
  },
  {
    id: 2, name: "Himachal Pradesh", cities: ["Shimla", "Manali", "Dharamshala"],
    hotels: [
      { id: 201, name: "Wildflower Hall", city: "Shimla", stars: 5, rating: 4.9, address: "Chharabra, Shimla Hills", contact: "Arjun Mehta", phone: "+91 177 264 8585", email: "wildflowerhall@oberoihotels.com", website: "www.oberoihotels.com", mapUrl: "", lat: "31.0788", lng: "77.2126", overview: "Legendary Himalayan retreat in a cedar forest.", amenities: ["wifi", "spa", "restaurant", "gym", "parking"], isDefault: true, roomTypes: [], mealPlans: [] },
    ]
  },
  {
    id: 3, name: "Andaman Islands", cities: ["Port Blair", "Havelock", "Neil Island"],
    hotels: [
      { id: 301, name: "Taj Exotica Resort", city: "Havelock", stars: 5, rating: 4.8, address: "Radhanagar Beach, Havelock Island", contact: "Mohan Das", phone: "+91 3192 282222", email: "exotica.andaman@tajhotels.com", website: "www.tajhotels.com", mapUrl: "", lat: "11.9765", lng: "92.9842", overview: "Private island luxury on pristine Radhanagar beach.", amenities: ["wifi", "pool", "restaurant", "spa", "airport"], isDefault: true, roomTypes: [], mealPlans: [] },
    ]
  },
  {
    id: 4, name: "Hong Kong", cities: ["Kowloon", "Central", "Tsim Sha Tsui"],
    hotels: [
      { id: 401, name: "The Peninsula Hong Kong", city: "Tsim Sha Tsui", stars: 5, rating: 4.9, address: "Salisbury Road, Tsim Sha Tsui", contact: "Lisa Wong", phone: "+852 2920 2888", email: "phk@peninsula.com", website: "www.peninsula.com", mapUrl: "", lat: "22.2950", lng: "114.1722", overview: "Iconic luxury hotel since 1928 with fleet of Rolls-Royces.", amenities: ["wifi", "pool", "restaurant", "spa", "gym", "roomservice", "airport"], isDefault: true, roomTypes: [], mealPlans: [] },
    ]
  },
];

const emptyHotel = { name: "", city: "", destinationId: "", stars: 3, rating: "", address: "", contact: "", phone: "", email: "", website: "", mapUrl: "", lat: "", lng: "", overview: "", amenities: [], isDefault: false, roomTypes: [], mealPlans: [] };
const emptyRoom  = { name: "", size: "", occupancy: "", bedType: "King", description: "" };
const emptyMeal  = { name: "", price: "", description: "" };

// ── Small UI helpers (unchanged) ─────────────────────────────
function Badge({ children, color = "blue" }) {
  const map = { blue: "bg-blue-100 text-blue-700", green: "bg-green-100 text-green-700", amber: "bg-amber-100 text-amber-700", red: "bg-red-100 text-red-700", cyan: "bg-cyan-100 text-cyan-700" };
  return <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${map[color]}`}>{children}</span>;
}
function StarRow({ count }) {
  return <span className="flex gap-0.5">{[1,2,3,4,5].map(i => <Star key={i} size={12} className={i <= count ? "text-amber-400 fill-amber-400" : "text-gray-300"} />)}</span>;
}
function Input({ label, required, error, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-xs font-medium text-gray-600">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>}
      <input className={`border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${error ? "border-red-400 bg-red-50" : "border-gray-200 bg-white"}`} {...props} />
      {error && <span className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={10} />{error}</span>}
    </div>
  );
}
function Select({ label, required, children, error, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-xs font-medium text-gray-600">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>}
      <select className={`border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition ${error ? "border-red-400" : "border-gray-200"}`} {...props}>{children}</select>
      {error && <span className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={10} />{error}</span>}
    </div>
  );
}
function Textarea({ label, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-xs font-medium text-gray-600">{label}</label>}
      <textarea className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white resize-none transition" rows={3} {...props} />
    </div>
  );
}
function NestedModal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800">{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition"><X size={16} /></button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[70vh]">{children}</div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────
export default function HotelMaster() {
  const [destinations, setDestinations] = useState(initialDestinations);
  const [loading, setLoading]           = useState(true);   // initial data fetch
  const [apiError, setApiError]         = useState("");      // top-level error banner

  const [search,     setSearch]     = useState("");
  const [filterDest, setFilterDest] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [filterStar, setFilterStar] = useState("");
  const [expanded,   setExpanded]   = useState({});

  const [showModal,     setShowModal]     = useState(false);
  const [editingHotel,  setEditingHotel]  = useState(null);
  const [form,          setForm]          = useState(emptyHotel);
  const [errors,        setErrors]        = useState({});
  const [saving,        setSaving]        = useState(false);
  const [saveError,     setSaveError]     = useState("");

  const [roomModal,    setRoomModal]    = useState(false);
  const [mealModal,    setMealModal]    = useState(false);
  const [roomForm,     setRoomForm]     = useState(emptyRoom);
  const [mealForm,     setMealForm]     = useState(emptyMeal);
  const [editRoomIdx,  setEditRoomIdx]  = useState(null);
  const [editMealIdx,  setEditMealIdx]  = useState(null);
  const [roomErrors,   setRoomErrors]   = useState({});
  const [mealErrors,   setMealErrors]   = useState({});
  const [roomSaving,   setRoomSaving]   = useState(false);
  const [mealSaving,   setMealSaving]   = useState(false);

  // pending image files (not yet uploaded — held until hotel is saved)
  const [hotelImageFile, setHotelImageFile] = useState(null);
  const [roomImageFiles, setRoomImageFiles] = useState(null);

  // ── 1. Fetch all hotels on mount ──────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const res = await hotelService.getAllHotels();
        // Backend should return destinations[] with hotels[] nested.
        // Adjust res.data shape to match your API response.
        if (res.data && Array.isArray(res.data)) {
          setDestinations(res.data);
        }
      } catch (err) {
        // Keep static fallback data; show a soft warning
        setApiError("Could not load live data — showing local data.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const allCities = useMemo(
    () => [...new Set(destinations.flatMap(d => d.cities))],
    [destinations]
  );

  const filtered = useMemo(() => destinations
    .filter(d => {
      if (filterDest && d.id !== parseInt(filterDest)) return false;
      const hotels = d.hotels.filter(h => {
        if (filterCity && h.city !== filterCity) return false;
        if (filterStar && h.stars !== parseInt(filterStar)) return false;
        if (search && !h.name.toLowerCase().includes(search.toLowerCase()) && !d.name.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
      });
      return hotels.length > 0 || (!filterCity && !filterStar && !search);
    })
    .map(d => ({ ...d, hotels: d.hotels.filter(h => {
      if (filterCity && h.city !== filterCity) return false;
      if (filterStar && h.stars !== parseInt(filterStar)) return false;
      if (search && !h.name.toLowerCase().includes(search.toLowerCase()) && !d.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    })})),
    [destinations, search, filterDest, filterCity, filterStar]
  );

  // ── Modal open/close ──────────────────────────────────────
  const openAdd = () => {
    setEditingHotel(null);
    setForm(emptyHotel);
    setErrors({});
    setSaveError("");
    setHotelImageFile(null);
    setShowModal(true);
  };

  const openEdit = (hotel, destId) => {
    // transformHotelResponse converts backend numbers → form strings
    setEditingHotel({ ...hotel, destinationId: destId });
    setForm(transformHotelResponse({ ...hotel, destinationId: destId }));
    setErrors({});
    setSaveError("");
    setHotelImageFile(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingHotel(null);
    setHotelImageFile(null);
  };

  // ── Validation ────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!form.destinationId) e.destinationId = "Required";
    if (!form.city)          e.city          = "Required";
    if (!form.name.trim())   e.name          = "Required";
    if (!form.stars)         e.stars         = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── 2. Save hotel (create or update) ─────────────────────
  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    setSaveError("");

    try {
      let savedHotel;

      if (editingHotel) {
        // UPDATE existing hotel
        const res = await hotelService.updateHotel(editingHotel.id, form);
        savedHotel = res.data;
      } else {
        // CREATE new hotel
        const res = await hotelService.createHotel(form);
        savedHotel = res.data;
      }

      // Upload hotel image if one was selected
      if (hotelImageFile && savedHotel?.id) {
        await hotelService.uploadHotelImage(hotelImageFile);
      }

      // If isDefault, tell backend to set this hotel as default
      if (form.isDefault && savedHotel?.id) {
        await hotelService.setDefaultHotel(savedHotel.id, form.destinationId);
      }

      // ── Optimistic local state update ──────────────────
      const destId = parseInt(form.destinationId);
      setDestinations(prev => prev.map(d => {
        if (d.id !== destId) return d;
        const newHotel = {
          ...form,
          id:    savedHotel?.id ?? (editingHotel ? editingHotel.id : Date.now()),
          stars: parseInt(form.stars),
        };
        if (form.isDefault) {
          return {
            ...d,
            hotels: d.hotels
              .filter(h => editingHotel ? h.id !== editingHotel.id : true)
              .map(h => ({ ...h, isDefault: false }))
              .concat([{ ...newHotel, isDefault: true }]),
          };
        }
        if (editingHotel) {
          return { ...d, hotels: d.hotels.map(h => h.id === editingHotel.id ? newHotel : h) };
        }
        return { ...d, hotels: [...d.hotels, newHotel] };
      }));

      closeModal();
    } catch (err) {
      setSaveError(
        err?.response?.data?.message || "Failed to save hotel. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  // ── 3. Delete hotel ───────────────────────────────────────
  const handleDelete = async (destId, hotelId) => {
    if (!window.confirm("Delete this hotel?")) return;
    try {
      await hotelService.deleteHotel(hotelId);
      setDestinations(prev =>
        prev.map(d => d.id === destId
          ? { ...d, hotels: d.hotels.filter(h => h.id !== hotelId) }
          : d
        )
      );
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to delete hotel.");
    }
  };

  const selectedDest = destinations.find(d => d.id === parseInt(form.destinationId));

  // ── Room modal ────────────────────────────────────────────
  const openAddRoom  = () => { setEditRoomIdx(null); setRoomForm(emptyRoom); setRoomErrors({}); setRoomImageFiles(null); setRoomModal(true); };
  const openEditRoom = (idx) => { setEditRoomIdx(idx); setRoomForm({ ...form.roomTypes[idx] }); setRoomErrors({}); setRoomImageFiles(null); setRoomModal(true); };

  // ── 4. Save room type ─────────────────────────────────────
  const saveRoom = async () => {
    const e = {};
    if (!roomForm.name.trim()) e.name = "Required";
    if (!roomForm.occupancy)   e.occupancy = "Required";
    setRoomErrors(e);
    if (Object.keys(e).length) return;

    setRoomSaving(true);
    try {
      const hotelId = editingHotel?.id;

      if (hotelId) {
        // ── Persisted hotel: call API ───────────────────
        if (editRoomIdx !== null) {
          const roomId = form.roomTypes[editRoomIdx].id;
          await hotelService.updateRoomType(hotelId, roomId, roomForm);
        } else {
          const res = await hotelService.addRoomType(hotelId, roomForm);
          // Upload room images if selected
          if (roomImageFiles && res.data?.id) {
            await hotelService.uploadRoomImages(hotelId, res.data.id, roomImageFiles);
          }
        }
      }

      // ── Local state update (works for both new & existing hotels) ──
      const rooms = [...(form.roomTypes || [])];
      if (editRoomIdx !== null) {
        rooms[editRoomIdx] = { ...roomForm, id: rooms[editRoomIdx].id };
      } else {
        rooms.push({ ...roomForm, id: Date.now() });
      }
      setForm(f => ({ ...f, roomTypes: rooms }));
      setRoomModal(false);
    } catch (err) {
      setRoomErrors({ api: err?.response?.data?.message || "Failed to save room type." });
    } finally {
      setRoomSaving(false);
    }
  };

  // ── 5. Delete room type ───────────────────────────────────
  const deleteRoom = async (idx) => {
    const hotelId = editingHotel?.id;
    const roomId  = form.roomTypes[idx]?.id;

    if (hotelId && roomId) {
      try {
        await hotelService.deleteRoomType(hotelId, roomId);
      } catch (err) {
        alert(err?.response?.data?.message || "Failed to delete room type.");
        return;
      }
    }
    setForm(f => ({ ...f, roomTypes: f.roomTypes.filter((_, i) => i !== idx) }));
  };

  // ── Meal modal ────────────────────────────────────────────
  const openAddMeal  = () => { setEditMealIdx(null); setMealForm(emptyMeal); setMealErrors({}); setMealModal(true); };
  const openEditMeal = (idx) => { setEditMealIdx(idx); setMealForm({ ...form.mealPlans[idx] }); setMealErrors({}); setMealModal(true); };

  // ── 6. Save meal plan ─────────────────────────────────────
  const saveMeal = async () => {
    const e = {};
    if (!mealForm.name.trim())                       e.name  = "Required";
    if (!mealForm.price && mealForm.price !== 0)     e.price = "Required";
    setMealErrors(e);
    if (Object.keys(e).length) return;

    setMealSaving(true);
    try {
      const hotelId = editingHotel?.id;

      if (hotelId) {
        if (editMealIdx !== null) {
          const mealId = form.mealPlans[editMealIdx].id;
          await hotelService.updateMealPlan(hotelId, mealId, mealForm);
        } else {
          await hotelService.addMealPlan(hotelId, mealForm);
        }
      }

      const meals = [...(form.mealPlans || [])];
      if (editMealIdx !== null) {
        meals[editMealIdx] = { ...mealForm, id: meals[editMealIdx].id };
      } else {
        meals.push({ ...mealForm, id: Date.now() });
      }
      setForm(f => ({ ...f, mealPlans: meals }));
      setMealModal(false);
    } catch (err) {
      setMealErrors({ api: err?.response?.data?.message || "Failed to save meal plan." });
    } finally {
      setMealSaving(false);
    }
  };

  // ── 7. Delete meal plan ───────────────────────────────────
  const deleteMeal = async (idx) => {
    const hotelId = editingHotel?.id;
    const mealId  = form.mealPlans[idx]?.id;

    if (hotelId && mealId) {
      try {
        await hotelService.deleteMealPlan(hotelId, mealId);
      } catch (err) {
        alert(err?.response?.data?.message || "Failed to delete meal plan.");
        return;
      }
    }
    setForm(f => ({ ...f, mealPlans: f.mealPlans.filter((_, i) => i !== idx) }));
  };

  const toggleAmenity = (id) => {
    setForm(f => ({
      ...f,
      amenities: f.amenities.includes(id)
        ? f.amenities.filter(a => a !== id)
        : [...f.amenities, id],
    }));
  };

  // ─────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">

      {/* API error banner */}
      {apiError && (
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-2 text-xs text-amber-700 flex items-center gap-2">
          <AlertCircle size={13} /> {apiError}
          <button onClick={() => setApiError("")} className="ml-auto"><X size={13} /></button>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Hotel size={16} className="text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Hotel Master</h1>
            </div>
            <p className="text-xs text-gray-500 mt-0.5 ml-10">Organized by destinations</p>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all shadow-sm shadow-blue-200"
          >
            <Plus size={16} /> Add New Hotel
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search hotels or cities..."
              className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
          <select value={filterDest} onChange={e => setFilterDest(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[140px]">
            <option value="">All Destinations</option>
            {destinations.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
          <select value={filterCity} onChange={e => setFilterCity(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[130px]">
            <option value="">All Cities</option>
            {allCities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={filterStar} onChange={e => setFilterStar(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[130px]">
            <option value="">All Star Categories</option>
            {[5,4,3,2,1].map(s => <option key={s} value={s}>{s} Star</option>)}
          </select>
        </div>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-3">
          {[1,2,3].map(i => (
            <div key={i} className="bg-white rounded-2xl border border-gray-200 p-5 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-32" />
                  <div className="h-3 bg-gray-100 rounded w-24" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Destination Accordion */}
      {!loading && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-10 space-y-3">
          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center">
              <Hotel size={36} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 font-medium">No hotels found</p>
              <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters</p>
            </div>
          ) : filtered.map(dest => {
            const isOpen      = expanded[dest.id];
            const defaultHotel = dest.hotels.find(h => h.isDefault);
            const uniqueCities = [...new Set(dest.hotels.map(h => h.city))];
            return (
              <div key={dest.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden transition-shadow hover:shadow-md">
                {/* Destination Header */}
                <div
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:px-6 gap-3 cursor-pointer"
                  onClick={() => setExpanded(e => ({ ...e, [dest.id]: !e[dest.id] }))}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin size={18} className="text-blue-600" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="font-bold text-gray-800 text-base">{dest.name}</h2>
                        {defaultHotel && <Badge color="green">Default: {defaultHotel.name}</Badge>}
                      </div>
                      <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                        <span className="text-xs text-gray-500 flex items-center gap-1"><Hotel size={11} />{dest.hotels.length} Hotels</span>
                        <span className="text-xs text-gray-500 flex items-center gap-1"><Building2 size={11} />{uniqueCities.length} Cities</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => { setForm({ ...emptyHotel, destinationId: dest.id.toString() }); setErrors({}); setSaveError(""); setEditingHotel(null); setShowModal(true); }}
                      className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition"
                    >
                      <Plus size={13} /> Add Hotel
                    </button>
                    <button className="flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition">
                      <Eye size={13} /> View
                    </button>
                    <div className="p-1.5 rounded-lg hover:bg-gray-100 transition text-gray-400">
                      {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </div>
                </div>

                {/* Hotels List */}
                {isOpen && (
                  <div className="border-t border-gray-100 divide-y divide-gray-50">
                    {dest.hotels.length === 0 ? (
                      <div className="p-8 text-center">
                        <p className="text-gray-400 text-sm">No hotels in this destination yet.</p>
                      </div>
                    ) : dest.hotels.map(hotel => (
                      <div key={hotel.id} className="px-6 py-4 hover:bg-gray-50/50 transition group">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
                          <div className="flex items-start gap-3 min-w-0">
                            <div className="w-9 h-9 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Hotel size={16} className="text-blue-600" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-semibold text-gray-800 text-sm">{hotel.name}</span>
                                {hotel.isDefault && <Badge color="cyan">Default</Badge>}
                                <Badge color="amber">{hotel.stars}★</Badge>
                              </div>
                              <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                                <span className="text-xs text-gray-500 flex items-center gap-1"><MapPin size={10} />{hotel.city}</span>
                                <span className="text-xs text-gray-500 flex items-center gap-1"><Phone size={10} />{hotel.phone}</span>
                                <StarRow count={hotel.stars} />
                              </div>
                              {hotel.amenities?.length > 0 && (
                                <div className="flex gap-1 mt-1.5 flex-wrap">
                                  {hotel.amenities.slice(0, 4).map(a => {
                                    const am = AMENITIES.find(x => x.id === a);
                                    return am ? <span key={a} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{am.label}</span> : null;
                                  })}
                                  {hotel.amenities.length > 4 && <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">+{hotel.amenities.length - 4} more</span>}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition">
                            <button onClick={() => openEdit(hotel, dest.id)} className="p-2 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition"><Edit2 size={14} /></button>
                            <button onClick={() => handleDelete(dest.id, hotel.id)} className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition"><Trash2 size={14} /></button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Main Hotel Modal ─────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-6 overflow-y-auto" style={{ background: "rgba(15,23,42,0.55)", backdropFilter: "blur(2px)" }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[1400px] my-auto" style={{ minHeight: 600 }}>

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl z-10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
                  <Hotel size={17} className="text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900 text-base">{editingHotel ? "Edit Hotel" : "Hotel Information"}</h2>
                  <p className="text-xs text-gray-500">Fill in the details below</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all active:scale-95 shadow-sm shadow-blue-200"
                >
                  {saving
                    ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>Saving...</span></>
                    : <><Check size={15} /> Save Hotel</>}
                </button>
                <button onClick={closeModal} className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition"><X size={18} /></button>
              </div>
            </div>

            {/* Save error */}
            {saveError && (
              <div className="mx-6 mt-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600 flex items-center gap-2">
                <AlertCircle size={15} /> {saveError}
              </div>
            )}

            {/* Modal Body */}
            <div className="flex flex-col lg:flex-row gap-0 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">

              {/* Left: Hotel Info */}
              <div className="flex-1 min-w-0 p-6 space-y-6 overflow-y-auto" style={{ maxHeight: "80vh" }}>

                {/* Basic Info */}
                <div>
                  <h3 className="text-sm font-bold text-gray-700 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2"><Hotel size={14} className="text-blue-500" />Basic Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Select label="Destination" required error={errors.destinationId} value={form.destinationId} onChange={e => setForm(f => ({ ...f, destinationId: e.target.value, city: "" }))}>
                      <option value="">Select destination</option>
                      {destinations.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </Select>
                    <Select label="City" required error={errors.city} value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} disabled={!form.destinationId}>
                      <option value="">Select city</option>
                      {selectedDest?.cities.map(c => <option key={c} value={c}>{c}</option>)}
                    </Select>
                    <Input label="Hotel Name" required error={errors.name} placeholder="e.g. The Grand Palace" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />

                    {/* Hotel image upload — stores file for upload on save */}
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-gray-600">Hotel Image</label>
                      <label className="border-2 border-dashed border-gray-200 rounded-xl p-3 flex items-center gap-3 cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition group">
                        <Upload size={16} className={hotelImageFile ? "text-blue-500" : "text-gray-400 group-hover:text-blue-500"} />
                        <span className={`text-sm ${hotelImageFile ? "text-blue-600 font-medium" : "text-gray-400 group-hover:text-blue-500"}`}>
                          {hotelImageFile ? hotelImageFile.name : "Upload image"}
                        </span>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={e => setHotelImageFile(e.target.files?.[0] || null)}
                        />
                      </label>
                    </div>

                    <Input label="Address" placeholder="Full address" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} className="sm:col-span-2" />
                    <Select label="Star Category" required error={errors.stars} value={form.stars} onChange={e => setForm(f => ({ ...f, stars: e.target.value }))}>
                      {[5,4,3,2,1].map(s => <option key={s} value={s}>{s} Star</option>)}
                    </Select>
                    <Input label="Star Rating" type="number" min="0" max="5" step="0.1" placeholder="e.g. 4.5" value={form.rating} onChange={e => setForm(f => ({ ...f, rating: e.target.value }))} />
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <input type="checkbox" id="defaultHotel" checked={form.isDefault} onChange={e => setForm(f => ({ ...f, isDefault: e.target.checked }))} className="w-4 h-4 accent-blue-600 cursor-pointer" />
                    <label htmlFor="defaultHotel" className="text-sm text-gray-600 cursor-pointer">Set as default hotel for this city</label>
                  </div>
                </div>

                {/* Contact Info */}
                <div>
                  <h3 className="text-sm font-bold text-gray-700 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2"><Phone size={14} className="text-blue-500" />Contact Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="Contact Person" placeholder="Full name" value={form.contact} onChange={e => setForm(f => ({ ...f, contact: e.target.value }))} />
                    <Input label="Phone Number" placeholder="+91 xxxxxxxxxx" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                    <Input label="Email" type="email" placeholder="hotel@example.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                    <Input label="Website" placeholder="www.example.com" value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <h3 className="text-sm font-bold text-gray-700 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2"><MapPin size={14} className="text-blue-500" />Location</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="Google Map URL" placeholder="https://maps.google.com/..." value={form.mapUrl} onChange={e => setForm(f => ({ ...f, mapUrl: e.target.value }))} className="sm:col-span-2" />
                    <Input label="Latitude" placeholder="e.g. 15.1740" value={form.lat} onChange={e => setForm(f => ({ ...f, lat: e.target.value }))} />
                    <Input label="Longitude" placeholder="e.g. 73.9550" value={form.lng} onChange={e => setForm(f => ({ ...f, lng: e.target.value }))} />
                  </div>
                </div>

                {/* Description & Amenities */}
                <div>
                  <h3 className="text-sm font-bold text-gray-700 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2"><Globe size={14} className="text-blue-500" />Description</h3>
                  <Textarea label="Hotel Overview" placeholder="Describe the hotel..." value={form.overview} onChange={e => setForm(f => ({ ...f, overview: e.target.value }))} rows={4} />
                  <div className="mt-4">
                    <label className="text-xs font-medium text-gray-600 block mb-2">Amenities</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {AMENITIES.map(a => {
                        const Icon = a.icon;
                        const selected = form.amenities?.includes(a.id);
                        return (
                          <button key={a.id} type="button" onClick={() => toggleAmenity(a.id)} className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all ${selected ? "border-blue-400 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"}`}>
                            <Icon size={13} className={selected ? "text-blue-500" : "text-gray-400"} />
                            {a.label}
                            {selected && <Check size={11} className="text-blue-500 ml-auto" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Room Types + Meal Plans */}
              <div className="lg:w-[440px] flex-shrink-0 p-6 space-y-6 overflow-y-auto" style={{ maxHeight: "80vh" }}>

                {/* Room Types */}
                <div className="bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
                    <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2"><Building2 size={14} className="text-blue-500" />Room Types</h3>
                    <button onClick={openAddRoom} className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition">
                      <Plus size={13} /> Add Room Type
                    </button>
                  </div>
                  {!form.roomTypes?.length ? (
                    <div className="p-6 text-center">
                      <Building2 size={24} className="mx-auto text-gray-300 mb-2" />
                      <p className="text-xs text-gray-400">No room types added yet</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead><tr className="border-b border-gray-200 bg-gray-100/80"><th className="px-4 py-2 text-left text-gray-600 font-semibold">Room</th><th className="px-3 py-2 text-left text-gray-600 font-semibold">Occ.</th><th className="px-3 py-2 text-left text-gray-600 font-semibold">Bed</th><th className="px-3 py-2 text-right text-gray-600 font-semibold">Actions</th></tr></thead>
                        <tbody className="divide-y divide-gray-100">
                          {form.roomTypes.map((r, i) => (
                            <tr key={i} className="hover:bg-white transition">
                              <td className="px-4 py-2.5 font-medium text-gray-700">{r.name}</td>
                              <td className="px-3 py-2.5 text-gray-500">{r.occupancy}</td>
                              <td className="px-3 py-2.5 text-gray-500">{r.bedType}</td>
                              <td className="px-3 py-2.5 text-right">
                                <button onClick={() => openEditRoom(i)} className="p-1 rounded hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition mr-1"><Edit2 size={12} /></button>
                                <button onClick={() => deleteRoom(i)} className="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 transition"><Trash2 size={12} /></button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Meal Plans */}
                <div className="bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
                    <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2"><Utensils size={14} className="text-green-500" />Meal Plans</h3>
                    <button onClick={openAddMeal} className="flex items-center gap-1.5 text-xs font-medium text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg transition">
                      <Plus size={13} /> Add Meal Plan
                    </button>
                  </div>
                  {!form.mealPlans?.length ? (
                    <div className="p-6 text-center">
                      <Utensils size={24} className="mx-auto text-gray-300 mb-2" />
                      <p className="text-xs text-gray-400">No meal plans added yet</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead><tr className="border-b border-gray-200 bg-gray-100/80"><th className="px-4 py-2 text-left text-gray-600 font-semibold">Plan</th><th className="px-3 py-2 text-left text-gray-600 font-semibold">Price</th><th className="px-3 py-2 text-right text-gray-600 font-semibold">Actions</th></tr></thead>
                        <tbody className="divide-y divide-gray-100">
                          {form.mealPlans.map((m, i) => (
                            <tr key={i} className="hover:bg-white transition">
                              <td className="px-4 py-2.5 font-medium text-gray-700">{m.name}</td>
                              <td className="px-3 py-2.5 text-gray-500">₹{m.price}</td>
                              <td className="px-3 py-2.5 text-right">
                                <button onClick={() => openEditMeal(i)} className="p-1 rounded hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition mr-1"><Edit2 size={12} /></button>
                                <button onClick={() => deleteMeal(i)} className="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 transition"><Trash2 size={12} /></button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Room Type Nested Modal ────────────────────────── */}
      {roomModal && (
        <NestedModal title={editRoomIdx !== null ? "Edit Room Type" : "Add Room Type"} onClose={() => setRoomModal(false)}>
          <div className="space-y-4">
            {roomErrors.api && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600 flex items-center gap-2">
                <AlertCircle size={14} /> {roomErrors.api}
              </div>
            )}
            <Input label="Room Name" required error={roomErrors.name} placeholder="e.g. Deluxe Room" value={roomForm.name} onChange={e => setRoomForm(f => ({ ...f, name: e.target.value }))} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Room Size" placeholder="e.g. 45 sqm" value={roomForm.size} onChange={e => setRoomForm(f => ({ ...f, size: e.target.value }))} />
              <Input label="Max Occupancy" required error={roomErrors.occupancy} type="number" min="1" placeholder="e.g. 2" value={roomForm.occupancy} onChange={e => setRoomForm(f => ({ ...f, occupancy: e.target.value }))} />
            </div>
            <Select label="Bed Type" value={roomForm.bedType} onChange={e => setRoomForm(f => ({ ...f, bedType: e.target.value }))}>
              {BED_TYPES.map(b => <option key={b}>{b}</option>)}
            </Select>

            {/* Room images — stored for upload after room is created */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600">Room Images</label>
              <label className="border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center gap-2 cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition">
                <Upload size={20} className={roomImageFiles?.length ? "text-blue-500" : "text-gray-300"} />
                <span className={`text-sm ${roomImageFiles?.length ? "text-blue-600 font-medium" : "text-gray-400"}`}>
                  {roomImageFiles?.length ? `${roomImageFiles.length} file(s) selected` : "Upload room images"}
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={e => setRoomImageFiles(e.target.files)}
                />
              </label>
            </div>

            <Textarea label="Description" placeholder="Describe the room..." value={roomForm.description} onChange={e => setRoomForm(f => ({ ...f, description: e.target.value }))} />
            <button
              onClick={saveRoom}
              disabled={roomSaving}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2.5 rounded-xl text-sm font-medium transition active:scale-95 flex items-center justify-center gap-2"
            >
              {roomSaving
                ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
                : editRoomIdx !== null ? "Update Room Type" : "Add Room Type"}
            </button>
          </div>
        </NestedModal>
      )}

      {/* ── Meal Plan Nested Modal ────────────────────────── */}
      {mealModal && (
        <NestedModal title={editMealIdx !== null ? "Edit Meal Plan" : "Add Meal Plan"} onClose={() => setMealModal(false)}>
          <div className="space-y-4">
            {mealErrors.api && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600 flex items-center gap-2">
                <AlertCircle size={14} /> {mealErrors.api}
              </div>
            )}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600">Meal Plan Name <span className="text-red-500">*</span></label>
              <input
                list="mealExamples"
                placeholder="e.g. CP (Breakfast)"
                value={mealForm.name}
                onChange={e => setMealForm(f => ({ ...f, name: e.target.value }))}
                className={`border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${mealErrors.name ? "border-red-400 bg-red-50" : "border-gray-200 bg-white"}`}
              />
              <datalist id="mealExamples">{MEAL_PLAN_EXAMPLES.map(m => <option key={m} value={m} />)}</datalist>
              {mealErrors.name && <span className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={10} />{mealErrors.name}</span>}
            </div>
            <Input label="Price (₹)" required error={mealErrors.price} type="number" min="0" placeholder="e.g. 800" value={mealForm.price} onChange={e => setMealForm(f => ({ ...f, price: e.target.value }))} />
            <Textarea label="Description" placeholder="What's included in this plan?" value={mealForm.description} onChange={e => setMealForm(f => ({ ...f, description: e.target.value }))} />
            <button
              onClick={saveMeal}
              disabled={mealSaving}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-2.5 rounded-xl text-sm font-medium transition active:scale-95 flex items-center justify-center gap-2"
            >
              {mealSaving
                ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
                : editMealIdx !== null ? "Update Meal Plan" : "Add Meal Plan"}
            </button>
          </div>
        </NestedModal>
      )}
    </div>
  );
}