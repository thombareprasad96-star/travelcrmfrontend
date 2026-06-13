import { useState, useMemo, useEffect, useRef } from "react";
import  customerService  from "../services/customerService";
import {
  FaUsers, FaUserCheck, FaCrown, FaRupeeSign, FaPlane,
  FaRedoAlt, FaWhatsapp, FaEdit, FaTrash, FaEye,
  FaSearch, FaFilter, FaTimes, FaDownload, FaUserPlus,
  FaSort, FaSortUp, FaSortDown, FaStar, FaMapMarkerAlt,
  FaEnvelope, FaMobileAlt, FaCalendarAlt, FaBookOpen,
  FaChevronLeft, FaChevronRight, FaAngleDoubleLeft, FaAngleDoubleRight,
  FaCheckCircle, FaBan, FaClock, FaHistory, FaStickyNote,
  FaPrint, FaShareAlt,
} from "react-icons/fa";
import { MdVerified, MdLocationCity } from "react-icons/md";
import { HiSparkles } from "react-icons/hi";

/* ─── MOCK DATA ──────────────────────────────────────────────── */
const MOCK_CUSTOMERS = [
  { id:"CUS001", name:"Arjun Sharma",    phone:"+91 98765 43210", email:"arjun.sharma@gmail.com",      city:"Mumbai",     state:"Maharashtra", type:"VIP",       tier:"Platinum", bookings:14, spent:485000, status:"Active",   lastBooking:"2026-04-12", notes:"Prefers window seats. Anniversary trip every Dec.", avatar:"AS" },
  { id:"CUS002", name:"Priya Mehta",     phone:"+91 87654 32109", email:"priya.mehta@yahoo.com",        city:"Delhi",      state:"Delhi",       type:"Regular",   tier:"Gold",     bookings:7,  spent:182000, status:"Active",   lastBooking:"2026-03-28", notes:"Vegetarian. Honeymoon package inquiry pending.", avatar:"PM" },
  { id:"CUS003", name:"Rahul Gupta",     phone:"+91 76543 21098", email:"rahul.g@outlook.com",          city:"Bangalore",  state:"Karnataka",   type:"Corporate", tier:"Silver",   bookings:9,  spent:310000, status:"Active",   lastBooking:"2026-05-01", notes:"Corporate account. Needs GST invoices always.", avatar:"RG" },
  { id:"CUS004", name:"Sunita Patel",    phone:"+91 65432 10987", email:"sunita.patel@rediffmail.com",  city:"Ahmedabad",  state:"Gujarat",     type:"Regular",   tier:"Bronze",   bookings:3,  spent:62000,  status:"Inactive", lastBooking:"2025-11-14", notes:"Budget traveler. Prefers train over flight.", avatar:"SP" },
  { id:"CUS005", name:"Vikram Singh",    phone:"+91 54321 09876", email:"vikramsingh@hotmail.com",      city:"Jaipur",     state:"Rajasthan",   type:"VIP",       tier:"Platinum", bookings:21, spent:920000, status:"Active",   lastBooking:"2026-05-15", notes:"VIP. Always books suites. Personal concierge needed.", avatar:"VS" },
  { id:"CUS006", name:"Anjali Verma",    phone:"+91 43210 98765", email:"anjali.v@gmail.com",           city:"Pune",       state:"Maharashtra", type:"Regular",   tier:"Gold",     bookings:5,  spent:145000, status:"Active",   lastBooking:"2026-02-20", notes:"Solo female traveler. Safety-first destinations.", avatar:"AV" },
  { id:"CUS007", name:"Mohit Agarwal",   phone:"+91 32109 87654", email:"mohit.agarwal@corp.in",        city:"Chennai",    state:"Tamil Nadu",  type:"Corporate", tier:"Gold",     bookings:11, spent:390000, status:"Active",   lastBooking:"2026-04-30", notes:"Team bookings for 10–15 pax. Advance notice required.", avatar:"MA" },
  { id:"CUS008", name:"Divya Joshi",     phone:"+91 21098 76543", email:"divyajoshi@gmail.com",         city:"Kolkata",    state:"West Bengal", type:"Regular",   tier:"Bronze",   bookings:2,  spent:38000,  status:"Inactive", lastBooking:"2025-09-05", notes:"First-timer. Needs itinerary guidance.", avatar:"DJ" },
  { id:"CUS009", name:"Rohit Khanna",    phone:"+91 10987 65432", email:"rohit.khanna@protonmail.com",  city:"Hyderabad",  state:"Telangana",   type:"VIP",       tier:"Platinum", bookings:18, spent:710000, status:"Active",   lastBooking:"2026-05-10", notes:"High net worth. Expects 24/7 support.", avatar:"RK" },
  { id:"CUS010", name:"Neha Kapoor",     phone:"+91 99887 76655", email:"nehakapoor@gmail.com",         city:"Lucknow",    state:"UP",          type:"Regular",   tier:"Silver",   bookings:4,  spent:96000,  status:"Active",   lastBooking:"2026-01-18", notes:"Family trips with 2 kids. Child-friendly properties.", avatar:"NK" },
  { id:"CUS011", name:"Suresh Nair",     phone:"+91 88776 65544", email:"suresh.nair@kochi.net",        city:"Kochi",      state:"Kerala",      type:"Regular",   tier:"Bronze",   bookings:1,  spent:22000,  status:"Blocked",  lastBooking:"2025-07-22", notes:"Payment dispute on last booking. On hold.", avatar:"SN" },
  { id:"CUS012", name:"Kavita Rao",      phone:"+91 77665 54433", email:"kavita.rao@yahoo.in",          city:"Pune",       state:"Maharashtra", type:"Corporate", tier:"Silver",   bookings:6,  spent:210000, status:"Active",   lastBooking:"2026-03-11", notes:"HR manager. Books for employee incentive trips.", avatar:"KR" },
  { id:"CUS013", name:"Deepak Mishra",   phone:"+91 66554 43322", email:"deepak.m@gmail.com",           city:"Bhopal",     state:"MP",          type:"Regular",   tier:"Gold",     bookings:8,  spent:268000, status:"Active",   lastBooking:"2026-04-05", notes:"Loves adventure travel. Trekking & camping packages.", avatar:"DM" },
  { id:"CUS014", name:"Pooja Tiwari",    phone:"+91 55443 32211", email:"poojatiwari@rediff.com",       city:"Varanasi",   state:"UP",          type:"Regular",   tier:"Bronze",   bookings:2,  spent:45000,  status:"Inactive", lastBooking:"2025-12-01", notes:"Pilgrimage tours only.", avatar:"PT" },
  { id:"CUS015", name:"Sandeep Kumar",   phone:"+91 44332 21100", email:"sandeep.k@business.in",        city:"Chandigarh", state:"Punjab",      type:"Corporate", tier:"Gold",     bookings:13, spent:455000, status:"Active",   lastBooking:"2026-05-08", notes:"Export company. International travel heavy.", avatar:"SK" },
  { id:"CUS016", name:"Ritika Bansal",   phone:"+91 33221 10099", email:"ritika.b@gmail.com",           city:"Nagpur",     state:"Maharashtra", type:"Regular",   tier:"Silver",   bookings:5,  spent:125000, status:"Active",   lastBooking:"2026-02-14", notes:"Honeymoon specialist. Surprise trip planner.", avatar:"RB" },
  { id:"CUS017", name:"Amitabh Sinha",   phone:"+91 22110 09988", email:"amitabh.sinha@vip.in",         city:"Patna",      state:"Bihar",       type:"VIP",       tier:"Platinum", bookings:25, spent:1200000,status:"Active",   lastBooking:"2026-05-18", notes:"Top VIP. Private jet arrangements required.", avatar:"AS2" },
  { id:"CUS018", name:"Shreya Das",      phone:"+91 11009 98877", email:"shreya.das@kolkata.org",       city:"Kolkata",    state:"West Bengal", type:"Regular",   tier:"Bronze",   bookings:3,  spent:71000,  status:"Active",   lastBooking:"2026-01-30", notes:"Student group bookings. Budget hostels.", avatar:"SD" },
  { id:"CUS019", name:"Karan Malhotra",  phone:"+91 90909 80808", email:"karan.m@startup.io",           city:"Gurgaon",    state:"Haryana",     type:"Corporate", tier:"Platinum", bookings:16, spent:620000, status:"Active",   lastBooking:"2026-04-22", notes:"Startup founder. Team off-sites quarterly.", avatar:"KM" },
  { id:"CUS020", name:"Meera Reddy",     phone:"+91 80808 70707", email:"meera.r@hyd.in",               city:"Hyderabad",  state:"Telangana",   type:"Regular",   tier:"Gold",     bookings:6,  spent:178000, status:"Inactive", lastBooking:"2025-10-19", notes:"Slow traveler. Long-stay packages preferred.", avatar:"MR" },
];

const BOOKING_HISTORY = {
  CUS001:[{code:"BK9001",dest:"Maldives",date:"2026-04-12",amt:125000,status:"Completed"},{code:"BK8234",dest:"Paris, France",date:"2025-12-20",amt:210000,status:"Completed"},{code:"BK7891",dest:"Kerala Backwaters",date:"2025-06-05",amt:48000,status:"Completed"}],
  CUS005:[{code:"BK9032",dest:"Dubai Explorer",date:"2026-05-15",amt:185000,status:"Confirmed"},{code:"BK8901",dest:"Switzerland",date:"2025-09-10",amt:380000,status:"Completed"},{code:"BK8100",dest:"Andaman",date:"2025-01-22",amt:95000,status:"Completed"}],
  CUS009:[{code:"BK9018",dest:"Japan Cultural",date:"2026-05-10",amt:290000,status:"Confirmed"},{code:"BK8765",dest:"Bali Luxury",date:"2025-07-28",amt:145000,status:"Completed"}],
  CUS017:[{code:"BK9045",dest:"Europe Classic 15N",date:"2026-05-18",amt:450000,status:"Confirmed"},{code:"BK8999",dest:"New York Business",date:"2026-02-14",amt:280000,status:"Completed"},{code:"BK8800",dest:"Singapore–Bali",date:"2025-11-01",amt:190000,status:"Completed"}],
};

/* ─── HELPERS ────────────────────────────────────────────────── */
const fmtINR = (n) => "₹" + Number(n).toLocaleString("en-IN");
const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}) : "—";
const initials = (name) => name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();

const TIER_CONFIG = {
  Platinum:{ bg:"bg-slate-800",  text:"text-slate-100", dot:"bg-slate-300", icon:"💎", border:"border-slate-400" },
  Gold:    { bg:"bg-yellow-100", text:"text-yellow-800", dot:"bg-yellow-500", icon:"🥇", border:"border-yellow-400" },
  Silver:  { bg:"bg-slate-100",  text:"text-slate-700", dot:"bg-slate-400", icon:"🥈", border:"border-slate-300" },
  Bronze:  { bg:"bg-orange-100", text:"text-orange-700", dot:"bg-orange-400", icon:"🥉", border:"border-orange-300" },
};
const TYPE_CONFIG = {
  VIP:      { bg:"bg-purple-100", text:"text-purple-700", border:"border-purple-200" },
  Corporate:{ bg:"bg-blue-100",   text:"text-blue-700",   border:"border-blue-200"   },
  Regular:  { bg:"bg-green-100",  text:"text-green-700",  border:"border-green-200"  },
};
const STATUS_CONFIG = {
  Active:  { bg:"bg-emerald-100", text:"text-emerald-700", dot:"bg-emerald-500" },
  Inactive:{ bg:"bg-slate-100",   text:"text-slate-500",   dot:"bg-slate-400"   },
  Blocked: { bg:"bg-red-100",     text:"text-red-600",     dot:"bg-red-500"     },
};

const AVATAR_COLORS = [
  "from-blue-500 to-blue-600","from-purple-500 to-purple-600","from-teal-500 to-teal-600",
  "from-rose-500 to-rose-600","from-amber-500 to-amber-600","from-indigo-500 to-indigo-600",
  "from-green-500 to-green-600","from-cyan-500 to-cyan-600","from-pink-500 to-pink-600",
  "from-orange-500 to-orange-600",
];

/* ─── ADD/EDIT MODAL ─────────────────────────────────────────── */
function CustomerFormModal({ customer, onClose, onSave }) {
  const isEdit = !!customer;
  const [form, setForm] = useState(customer || {
    name:"", phone:"", email:"", city:"", state:"", type:"Regular", tier:"Bronze", status:"Active", notes:""
  });
  const set = (k,v) => setForm(p=>({...p,[k]:v}));

  const fields = [
    { key:"name",  label:"Full Name",    type:"text",  placeholder:"Enter full name",    required:true },
    { key:"phone", label:"Phone Number", type:"tel",   placeholder:"+91 98765 43210",    required:true },
    { key:"email", label:"Email Address",type:"email", placeholder:"customer@email.com", required:false },
    { key:"city",  label:"City",         type:"text",  placeholder:"Mumbai",             required:false },
    { key:"state", label:"State",        type:"text",  placeholder:"Maharashtra",        required:false },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}/>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto z-10">
        <div className={`bg-gradient-to-r ${isEdit?"from-indigo-600 to-indigo-500":"from-blue-600 to-blue-500"} px-6 py-5 rounded-t-2xl flex items-center justify-between`}>
          <div>
            <h2 className="text-white font-extrabold text-lg">{isEdit?"Edit Customer":"Add New Customer"}</h2>
            <p className="text-white/70 text-xs mt-0.5">{isEdit?"Update customer information":"Fill in the customer details below"}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center text-lg transition-all">×</button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fields.map(f=>(
              <div key={f.key} className={f.key==="name"||f.key==="email"?"sm:col-span-2":""}>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">{f.label}{f.required&&<span className="text-red-500 ml-1">*</span>}</label>
                <input type={f.type} value={form[f.key]||""} onChange={e=>set(f.key,e.target.value)} placeholder={f.placeholder}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder-slate-400
                    focus:border-blue-400 focus:ring-2 focus:ring-blue-50 outline-none transition-all bg-white"/>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { key:"type",   label:"Type",    opts:["Regular","Corporate","VIP"] },
              { key:"tier",   label:"Tier",    opts:["Bronze","Silver","Gold","Platinum"] },
              { key:"status", label:"Status",  opts:["Active","Inactive","Blocked"] },
            ].map(({key,label,opts})=>(
              <div key={key}>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">{label}</label>
                <div className="relative">
                  <select value={form[key]||""} onChange={e=>set(key,e.target.value)}
                    className="w-full px-3 py-2.5 pr-7 rounded-xl border border-slate-200 text-sm text-slate-700 bg-white
                      focus:border-blue-400 focus:ring-2 focus:ring-blue-50 outline-none appearance-none transition-all cursor-pointer">
                    {opts.map(o=><option key={o}>{o}</option>)}
                  </select>
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] pointer-events-none">▼</span>
                </div>
              </div>
            ))}
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5">Notes</label>
            <textarea value={form.notes||""} onChange={e=>set("notes",e.target.value)} rows={3}
              placeholder="Customer preferences, special requirements..."
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder-slate-400
                focus:border-blue-400 focus:ring-2 focus:ring-blue-50 outline-none transition-all resize-none bg-white"/>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border-2 border-slate-200 hover:border-slate-300 text-slate-600 font-bold text-sm transition-all bg-white hover:bg-slate-50">
              Cancel
            </button>
            <button onClick={()=>onSave(form)}
              className={`flex-1 py-2.5 rounded-xl text-white font-bold text-sm transition-all shadow-md
                ${isEdit?"bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200":"bg-blue-600 hover:bg-blue-700 shadow-blue-200"}`}>
              {isEdit?"Save Changes":"Add Customer"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── VIEW MODAL ─────────────────────────────────────────────── */
function ViewModal({ customer, onClose, onEdit }) {
  if (!customer) return null;
  const tc = TIER_CONFIG[customer.tier]   || TIER_CONFIG.Bronze;
  const tyc= TYPE_CONFIG[customer.type]   || TYPE_CONFIG.Regular;
  const sc = STATUS_CONFIG[customer.status]|| STATUS_CONFIG.Inactive;
  const history = BOOKING_HISTORY[customer.id] || [];
  const colorIdx = parseInt(customer.id.replace("CUS","")) % AVATAR_COLORS.length;
  const grad = AVATAR_COLORS[colorIdx];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}/>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto z-10">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-5 rounded-t-2xl">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${grad} flex items-center justify-center text-white text-xl font-extrabold shadow-lg flex-shrink-0`}>
                {initials(customer.name)}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-white text-xl font-extrabold">{customer.name}</h2>
                  {customer.type==="VIP" && <span className="text-yellow-400 text-lg">👑</span>}
                </div>
                <p className="text-slate-400 text-sm font-medium">{customer.id}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${tc.border} ${tc.bg} ${tc.text}`}>{tc.icon} {customer.tier}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${tyc.border} ${tyc.bg} ${tyc.text}`}>{customer.type}</span>
                  <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${sc.bg} ${sc.text}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`}/>{customer.status}
                  </span>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center text-lg transition-all flex-shrink-0">×</button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Contact info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              [FaMobileAlt, "Phone",        customer.phone, "bg-green-50 text-green-600"],
              [FaEnvelope,  "Email",         customer.email, "bg-blue-50 text-blue-600"],
              [MdLocationCity,"City",        customer.city,  "bg-purple-50 text-purple-600"],
              [FaMapMarkerAlt,"State",       customer.state, "bg-orange-50 text-orange-600"],
              [FaCalendarAlt,"Last Booking", fmtDate(customer.lastBooking), "bg-teal-50 text-teal-600"],
              [FaPlane,      "Total Trips",  `${customer.bookings} Bookings`, "bg-indigo-50 text-indigo-600"],
            ].map(([Icon,label,val,ic])=>(
              <div key={label} className="flex items-center gap-3 bg-slate-50 rounded-xl p-3 border border-slate-100">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${ic}`}>
                  <Icon className="w-3.5 h-3.5"/>
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-slate-400 font-medium">{label}</p>
                  <p className="text-sm font-bold text-slate-700 truncate">{val||"—"}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Total spent highlight */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-blue-200 text-xs font-bold uppercase tracking-widest">Total Lifetime Spent</p>
              <p className="text-white text-2xl font-extrabold mt-0.5">{fmtINR(customer.spent)}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-2xl">💰</div>
          </div>

          {/* Booking history */}
          {history.length > 0 && (
            <div>
              <p className="text-sm font-extrabold text-slate-700 mb-3 flex items-center gap-2">
                <FaHistory className="text-blue-500"/> Booking History
              </p>
              <div className="space-y-2">
                {history.map(h=>(
                  <div key={h.code} className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg">{h.code}</span>
                      <span className="text-sm font-semibold text-slate-700">{h.dest}</span>
                    </div>
                    <div className="flex items-center gap-3 text-right">
                      <span className="text-xs text-slate-400">{fmtDate(h.date)}</span>
                      <span className="text-sm font-extrabold text-slate-800">{fmtINR(h.amt)}</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full
                        ${h.status==="Completed"?"bg-green-100 text-green-700":"bg-blue-100 text-blue-700"}`}>
                        {h.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {customer.notes && (
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
              <p className="text-xs font-extrabold text-amber-700 mb-1.5 flex items-center gap-1.5">
                <FaStickyNote/> Customer Notes
              </p>
              <p className="text-sm text-amber-800 leading-relaxed">{customer.notes}</p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2 pt-1">
            <button onClick={()=>onEdit(customer)}
              className="flex-1 min-w-[100px] py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold flex items-center justify-center gap-2 transition-all">
              <FaEdit/> Edit
            </button>
            <a href={`https://wa.me/${customer.phone.replace(/\D/g,"")}`} target="_blank" rel="noreferrer"
              className="flex-1 min-w-[100px] py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white text-sm font-bold flex items-center justify-center gap-2 transition-all">
              <FaWhatsapp/> WhatsApp
            </a>
            <button className="flex-1 min-w-[100px] py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-bold flex items-center justify-center gap-2 transition-all border border-slate-200">
              <FaShareAlt/> Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── DELETE CONFIRM ─────────────────────────────────────────── */
function DeleteConfirm({ customer, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}/>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm z-10 p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-3xl mx-auto mb-4">🗑️</div>
        <h3 className="text-lg font-extrabold text-slate-800 mb-1">Delete Customer?</h3>
        <p className="text-sm text-slate-500 mb-5">Are you sure you want to delete <span className="font-bold text-slate-700">{customer?.name}</span>? This action cannot be undone.</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border-2 border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all">Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md shadow-red-200 transition-all">Yes, Delete</button>
        </div>
      </div>
    </div>
  );
}

/* ─── TOAST ──────────────────────────────────────────────────── */
function Toast({ msg, type, onClose }) {
  useEffect(()=>{ const t=setTimeout(onClose,3500); return()=>clearTimeout(t); },[onClose]);
  return (
    <div className={`fixed top-5 right-5 z-[999] flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl max-w-xs
      ${type==="success"?"bg-green-50 border-green-200 text-green-800":"bg-red-50 border-red-200 text-red-800"}`}
      style={{animation:"slideIn .3s ease both"}}>
      <span className="text-lg">{type==="success"?"✅":"❌"}</span>
      <p className="text-sm font-semibold flex-1">{msg}</p>
      <button onClick={onClose} className="opacity-50 hover:opacity-100 text-lg ml-1">×</button>
    </div>
  );
}

/* ─── STAT CARD ──────────────────────────────────────────────── */
function StatCard({ icon: Icon, label, value, gradient, sub, delay=0 }) {
  const [displayed, setDisplayed] = useState(0);
  const isINR = typeof value === "number" && value > 999;

  useEffect(()=>{
    let start = 0;
    const target = typeof value==="number" ? value : 0;
    if(target===0){ setDisplayed(0); return; }
    const step = Math.ceil(target/60);
    const interval = setInterval(()=>{
      start = Math.min(start+step, target);
      setDisplayed(start);
      if(start>=target) clearInterval(interval);
    }, 16);
    return ()=>clearInterval(interval);
  },[value]);

  const display = typeof value==="number"
    ? (isINR ? fmtINR(displayed) : displayed.toLocaleString("en-IN"))
    : value;

  return (
    <div className={`bg-gradient-to-br ${gradient} rounded-2xl p-5 text-white shadow-lg relative overflow-hidden group
      hover:-translate-y-1 hover:shadow-xl transition-all duration-300 cursor-pointer`}
      style={{animationDelay:`${delay}ms`}}>
      <div className="absolute -right-5 -top-5 w-24 h-24 rounded-full bg-white/10 group-hover:scale-110 transition-transform duration-300"/>
      <div className="absolute -right-3 -bottom-8 w-32 h-32 rounded-full bg-white/10 group-hover:scale-110 transition-transform duration-300"/>
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 group-hover:bg-white/30 flex items-center justify-center transition-all">
            <Icon className="w-5 h-5"/>
          </div>
          {sub && <span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded-full">{sub}</span>}
        </div>
        <p className="text-2xl sm:text-3xl font-extrabold leading-none mb-1">{display}</p>
        <p className="text-xs font-bold uppercase tracking-widest opacity-80">{label}</p>
      </div>
    </div>
  );
}

/* ─── SKELETON ROW ───────────────────────────────────────────── */
function SkeletonRow() {
  return (
    <tr>
      {[...Array(11)].map((_,i)=>(
        <td key={i} className="px-4 py-4">
          <div className="h-4 rounded-lg bg-slate-200 animate-pulse" style={{width:`${40+Math.random()*50}%`}}/>
        </td>
      ))}
    </tr>
  );
}

/* ─── MAIN COMPONENT ─────────────────────────────────────────── */
export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch]         = useState("");
  const [filterStatus, setFStatus]  = useState("All Status");
  const [filterType, setFType]      = useState("All Types");
  const [filterTier, setFTier]      = useState("All Tiers");
  const [sortKey, setSortKey]       = useState("name");
  const [sortDir, setSortDir]       = useState("asc");
  const [page, setPage]             = useState(1);
  const perPage                     = 8;

  const [viewCustomer, setView]     = useState(null);
  const [editCustomer, setEdit]     = useState(null);
  const [deleteTarget, setDelTarget]= useState(null);
  const [showAdd, setShowAdd]       = useState(false);
  const [loading, setLoading]       = useState(true);
  const [toast, setToast]           = useState(null);

  const nextId = useRef(MOCK_CUSTOMERS.length + 1);

  useEffect(() => {
  setLoading(true);

  customerService
    .getAll()
    .then((res) => {
      setCustomers(res.data);
    })
    .catch(() => {
      showToast("Failed to load customers.", "error");
    })
    .finally(() => {
      setLoading(false);
    });
}, []);

  const showToast = (msg, type="success") => setToast({msg, type});

  /* stats */
  const stats = useMemo(()=>({
    total:   customers.length,
    active:  customers.filter(c=>c.status==="Active").length,
    vip:     customers.filter(c=>c.type==="VIP").length,
    revenue: customers.reduce((s,c)=>s+c.spent,0),
    bookings:customers.reduce((s,c)=>s+c.bookings,0),
    repeat:  customers.filter(c=>c.bookings>=3).length,
  }),[customers]);

  /* filter + sort */
  const filtered = useMemo(()=>{
    let out = [...customers];
    const q = search.toLowerCase();
    if(q) out=out.filter(c=>
      c.name.toLowerCase().includes(q)||
      c.id.toLowerCase().includes(q)||
      c.phone.includes(q)||
      c.email.toLowerCase().includes(q)||
      c.city.toLowerCase().includes(q)
    );
    if(filterStatus!=="All Status") out=out.filter(c=>c.status===filterStatus);
    if(filterType!=="All Types")    out=out.filter(c=>c.type===filterType);
    if(filterTier!=="All Tiers")    out=out.filter(c=>c.tier===filterTier);
    out.sort((a,b)=>{
      let av=a[sortKey], bv=b[sortKey];
      if(typeof av==="string"){ av=av.toLowerCase(); bv=bv.toLowerCase(); }
      if(av<bv) return sortDir==="asc"?-1:1;
      if(av>bv) return sortDir==="asc"?1:-1;
      return 0;
    });
    return out;
  },[customers,search,filterStatus,filterType,filterTier,sortKey,sortDir]);

  const totalPages = Math.max(1,Math.ceil(filtered.length/perPage));
  const pageData   = filtered.slice((page-1)*perPage, page*perPage);
  const anyFilter  = search||filterStatus!=="All Status"||filterType!=="All Types"||filterTier!=="All Tiers";

  const handleSort = key => {
    if(sortKey===key) setSortDir(d=>d==="asc"?"desc":"asc");
    else { setSortKey(key); setSortDir("asc"); }
  };
  const SortIcon = ({k}) => {
    if(sortKey!==k) return <FaSort className="opacity-30 inline ml-1 text-xs"/>;
    return sortDir==="asc" ? <FaSortUp className="inline ml-1 text-blue-500 text-xs"/> : <FaSortDown className="inline ml-1 text-blue-500 text-xs"/>;
  };

  const resetFilters = () => { setSearch(""); setFStatus("All Status"); setFType("All Types"); setFTier("All Tiers"); setPage(1); };

  const handleSave = async (form) => {
  if (!form.name?.trim() || !form.phone?.trim()) {
    showToast("Name and phone are required.", "error");
    return;
  }

  try {
    if (editCustomer) {
      const res = await customerService.update(
        editCustomer.id,
        form
      );

      setCustomers((prev) =>
        prev.map((c) =>
          c.id === editCustomer.id ? res.data : c
        )
      );

      showToast("Customer updated successfully.");
    } else {
      const res = await customerService.create(form);

      setCustomers((prev) => [...prev, res.data]);

      showToast("Customer added successfully.");
    }

    setEdit(null);
    setShowAdd(false);
  } catch (err) {
    showToast(
      err?.response?.data?.message ||
        "Failed to save customer.",
      "error"
    );
  }
};

  const handleDelete = async () => {
  try {
    await customerService.delete(deleteTarget.id);

    setCustomers((prev) =>
      prev.filter((c) => c.id !== deleteTarget.id)
    );

    showToast(`${deleteTarget.name} deleted.`);
  } catch {
    showToast("Failed to delete customer.", "error");
  }

  setDelTarget(null);
};

  const handleExport = async () => {
  try {
    const res = await customerService.exportCSV();

    const url = URL.createObjectURL(
      new Blob([res.data])
    );

    const a = document.createElement("a");
    a.href = url;
    a.download = "customers.csv";
    a.click();

    showToast("Customers exported to CSV.");
  } catch {
    showToast("Export failed.", "error");
  }
};

  /* Selector helper */
  function Sel({ value, onChange, opts }) {
    return (
      <div className="relative">
        <select value={value} onChange={e=>{onChange(e.target.value);setPage(1);}}
          className="w-full pl-3 pr-8 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-600 font-medium
            focus:border-blue-400 focus:ring-2 focus:ring-blue-50 outline-none appearance-none cursor-pointer transition-all">
          {opts.map(o=><option key={o}>{o}</option>)}
        </select>
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] pointer-events-none">▼</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 font-sans"
      style={{fontFamily:"'Plus Jakarta Sans', system-ui, sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        @keyframes slideIn { from{transform:translateX(110%);opacity:0} to{transform:translateX(0);opacity:1} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        .fade-up { animation: fadeUp .4s ease both; }
      `}</style>

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}
      {viewCustomer && <ViewModal customer={viewCustomer} onClose={()=>setView(null)} onEdit={c=>{setView(null);setEdit(c);}}/>}
      {(showAdd||editCustomer) && <CustomerFormModal customer={editCustomer||null} onClose={()=>{setShowAdd(false);setEdit(null);}} onSave={handleSave}/>}
      {deleteTarget && <DeleteConfirm customer={deleteTarget} onClose={()=>setDelTarget(null)} onConfirm={handleDelete}/>}

      {/* ── TOP NAV ── */}
      {/* <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-40 shadow-sm">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center text-white font-black text-sm shadow">T</div>
            <span className="font-extrabold text-slate-800 text-sm hidden sm:block">TravelCRM</span>
          </div>
          <div className="text-xs text-slate-400 flex items-center gap-1 font-medium">
            <span className="hover:text-blue-600 cursor-pointer transition-colors">Dashboard</span>
            <span className="mx-1 text-slate-300">/</span>
            <span className="text-blue-600 font-bold">Customers</span>
          </div>
        </div>
      </nav> */}

      {/* ── PAGE HEADER ── */}
      <div className="bg-white/70 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white text-2xl shadow-lg shadow-blue-200">
                <FaUsers/>
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
                  Customer Management
                  <span className="hidden sm:inline text-xs bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">{customers.length} total</span>
                </h1>
                <p className="text-sm text-slate-400 mt-0.5">Manage your travel customers, loyalty tiers & history</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:border-blue-300 bg-white hover:bg-blue-50
                  text-slate-600 hover:text-blue-600 text-sm font-bold transition-all shadow-sm">
                <FaDownload className="w-3.5 h-3.5"/> Export
              </button>
              <button onClick={() => (window.location.href = "/Createcustomer")}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold
                  shadow-md shadow-blue-200 hover:shadow-lg transition-all">
                <FaUserPlus className="w-3.5 h-3.5"/> Add Customer
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* ── STAT CARDS ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
          {[
            { icon:FaUsers,     label:"Total Customers", value:stats.total,    gradient:"from-cyan-500 to-cyan-600",    delay:0   },
            { icon:FaUserCheck, label:"Active Customers",value:stats.active,   gradient:"from-green-500 to-emerald-600",delay:60  },
            { icon:FaCrown,     label:"VIP Customers",   value:stats.vip,      gradient:"from-amber-500 to-orange-500", delay:120 },
            { icon:FaRupeeSign, label:"Total Revenue",   value:stats.revenue,  gradient:"from-blue-600 to-blue-700",    delay:180 },
            { icon:FaPlane,     label:"Total Bookings",  value:stats.bookings, gradient:"from-indigo-500 to-indigo-600",delay:240 },
            { icon:FaRedoAlt,   label:"Repeat Customers",value:stats.repeat,   gradient:"from-rose-500 to-pink-600",    delay:300, sub:"3+ trips" },
          ].map(c=>(
            <div key={c.label} className="fade-up" style={{animationDelay:`${c.delay}ms`}}>
              <StatCard {...c}/>
            </div>
          ))}
        </div>

        {/* ── CUSTOMER LIST CARD ── */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">

          {/* List header */}
          <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-base font-extrabold text-slate-700">Customer List</h2>
              <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2.5 py-1 rounded-full">{filtered.length} results</span>
            </div>
            {anyFilter && (
              <button onClick={resetFilters}
                className="text-xs text-slate-400 hover:text-red-500 font-bold flex items-center gap-1.5 transition-colors">
                <FaTimes/> Clear all filters
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/60">
            <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
              <div className="relative flex-1 min-w-[200px]">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"/>
                <input type="text" value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}}
                  placeholder="Search by name, ID, phone, email, city..."
                  className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 placeholder-slate-400
                    focus:border-blue-400 focus:ring-2 focus:ring-blue-50 outline-none transition-all"/>
              </div>
              <Sel value={filterStatus} onChange={setFStatus} opts={["All Status","Active","Inactive","Blocked"]}/>
              <Sel value={filterType}   onChange={setFType}   opts={["All Types","Regular","Corporate","VIP"]}/>
              <Sel value={filterTier}   onChange={setFTier}   opts={["All Tiers","Platinum","Gold","Silver","Bronze"]}/>
            </div>
          </div>

          {/* ── DESKTOP TABLE ── */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead className="bg-slate-50/80 border-b border-slate-100">
                <tr>
                  {[
                    {label:"Customer",    key:"name"},
                    {label:"Contact",     key:null},
                    {label:"City",        key:"city"},
                    {label:"Type",        key:"type"},
                    {label:"Loyalty",     key:"tier"},
                    {label:"Bookings",    key:"bookings"},
                    {label:"Total Spent", key:"spent"},
                    {label:"Status",      key:"status"},
                    {label:"Actions",     key:null},
                  ].map(({label,key})=>(
                    <th key={label} onClick={key?()=>handleSort(key):undefined}
                      className={`px-4 py-3.5 text-left text-xs font-extrabold text-slate-500 uppercase tracking-wider whitespace-nowrap
                        ${key?"cursor-pointer hover:text-blue-600 select-none":""}`}>
                      {label}{key&&<SortIcon k={key}/>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading
                  ? [...Array(6)].map((_,i)=><SkeletonRow key={i}/>)
                  : pageData.length===0
                  ? (
                    <tr>
                      <td colSpan={9} className="text-center py-24">
                        <div className="text-6xl mb-4">👥</div>
                        <p className="text-lg font-extrabold text-slate-600 mb-1">No Customers Found</p>
                        <p className="text-sm text-slate-400 mb-5">
                          {anyFilter?"Try adjusting your search or filters.":"Start by adding your first customer."}
                        </p>
                        {anyFilter
                          ? <button onClick={resetFilters} className="px-4 py-2 rounded-xl bg-blue-50 text-blue-600 font-bold text-sm hover:bg-blue-100 transition-all">Clear Filters</button>
                          : <button onClick={()=>setShowAdd(true)} className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm shadow-md shadow-blue-200 hover:bg-blue-700 transition-all flex items-center gap-2 mx-auto">
                              <FaUserPlus/> Add First Customer
                            </button>
                        }
                      </td>
                    </tr>
                  )
                  : pageData.map((c,idx)=>{
                    const tc  = TIER_CONFIG[c.tier]   || TIER_CONFIG.Bronze;
                    const tyc = TYPE_CONFIG[c.type]   || TYPE_CONFIG.Regular;
                    const sc  = STATUS_CONFIG[c.status]|| STATUS_CONFIG.Inactive;
                    const colorIdx = parseInt(c.id.replace("CUS","")) % AVATAR_COLORS.length;
                    const grad = AVATAR_COLORS[colorIdx];
                    return (
                      <tr key={c.id} className="group transition-all duration-150 hover:bg-blue-50/40 hover:shadow-[inset_3px_0_0_#2563eb]"
                        style={{animation:`fadeUp .35s ease both`, animationDelay:`${idx*30}ms`}}>
                        {/* Customer */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center text-white text-xs font-extrabold flex-shrink-0 shadow-sm`}>
                              {initials(c.name)}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <p className="text-sm font-bold text-slate-800">{c.name}</p>
                                {c.type==="VIP" && <FaCrown className="w-3 h-3 text-amber-500"/>}
                              </div>
                              <p className="text-xs text-blue-600 font-bold">{c.id}</p>
                            </div>
                          </div>
                        </td>
                        {/* Contact */}
                        <td className="px-4 py-3.5">
                          <p className="text-xs font-semibold text-slate-600 flex items-center gap-1"><FaMobileAlt className="text-slate-400"/> {c.phone}</p>
                          <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[160px]">{c.email}</p>
                        </td>
                        {/* City */}
                        <td className="px-4 py-3.5">
                          <p className="text-sm font-semibold text-slate-600">{c.city}</p>
                          <p className="text-xs text-slate-400">{c.state}</p>
                        </td>
                        {/* Type */}
                        <td className="px-4 py-3.5">
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${tyc.border} ${tyc.bg} ${tyc.text}`}>{c.type}</span>
                        </td>
                        {/* Tier */}
                        <td className="px-4 py-3.5">
                          <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${tc.border} ${tc.bg} ${tc.text}`}>
                            {tc.icon} {c.tier}
                          </span>
                        </td>
                        {/* Bookings */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-extrabold text-slate-700">{c.bookings}</span>
                            <div className="flex gap-0.5">
                              {[...Array(Math.min(5,c.bookings))].map((_,i)=>(
                                <div key={i} className={`w-1.5 h-4 rounded-sm ${c.bookings>=10?"bg-blue-500":c.bookings>=5?"bg-teal-400":"bg-slate-300"}`}
                                  style={{height:`${8+i*3}px`}}/>
                              ))}
                            </div>
                          </div>
                        </td>
                        {/* Spent */}
                        <td className="px-4 py-3.5">
                          <p className="text-sm font-extrabold text-slate-800">{fmtINR(c.spent)}</p>
                          <p className="text-xs text-slate-400">Last: {fmtDate(c.lastBooking)}</p>
                        </td>
                        {/* Status */}
                        <td className="px-4 py-3.5">
                          <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1.5 rounded-full ${sc.bg} ${sc.text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`}/>
                            {c.status}
                          </span>
                        </td>
                        {/* Actions */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1.5 opacity-70 group-hover:opacity-100 transition-opacity">
                            <button onClick={()=>setView(c)} title="View"
                              className="w-8 h-8 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 flex items-center justify-center transition-all text-sm">
                              <FaEye/>
                            </button>
                            <button onClick={()=>setEdit(c)} title="Edit"
                              className="w-8 h-8 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 flex items-center justify-center transition-all text-sm">
                              <FaEdit/>
                            </button>
                            <a href={`https://wa.me/${c.phone.replace(/\D/g,"")}`} target="_blank" rel="noreferrer" title="WhatsApp"
                              className="w-8 h-8 rounded-lg bg-green-50 hover:bg-green-100 text-green-600 flex items-center justify-center transition-all text-sm">
                              <FaWhatsapp/>
                            </a>
                            <button onClick={()=>setDelTarget(c)} title="Delete"
                              className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-600 flex items-center justify-center transition-all text-sm">
                              <FaTrash/>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>

          {/* ── MOBILE / TABLET CARDS ── */}
          <div className="lg:hidden p-4 space-y-3">
            {loading
              ? [...Array(4)].map((_,i)=>(
                  <div key={i} className="bg-white rounded-2xl border border-slate-100 p-4 space-y-3">
                    {[...Array(4)].map((_,j)=><div key={j} className="h-4 rounded-lg bg-slate-200 animate-pulse" style={{width:`${40+Math.random()*50}%`}}/>)}
                  </div>
                ))
              : pageData.length===0
              ? (
                <div className="text-center py-16">
                  <div className="text-5xl mb-3">👥</div>
                  <p className="text-base font-extrabold text-slate-600 mb-1">No Customers Found</p>
                  <p className="text-sm text-slate-400 mb-4">{anyFilter?"Adjust filters to see results.":"Add your first customer."}</p>
                  {!anyFilter && <button onClick={()=>setShowAdd(true)} className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm">+ Add Customer</button>}
                </div>
              )
              : pageData.map((c,idx)=>{
                const tc  = TIER_CONFIG[c.tier]   || TIER_CONFIG.Bronze;
                const tyc = TYPE_CONFIG[c.type]   || TYPE_CONFIG.Regular;
                const sc  = STATUS_CONFIG[c.status]|| STATUS_CONFIG.Inactive;
                const colorIdx = parseInt(c.id.replace("CUS","")) % AVATAR_COLORS.length;
                const grad = AVATAR_COLORS[colorIdx];
                return (
                  <div key={c.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-3 fade-up" style={{animationDelay:`${idx*40}ms`}}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center text-white text-sm font-extrabold flex-shrink-0`}>
                          {initials(c.name)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="font-extrabold text-slate-800 text-sm">{c.name}</p>
                            {c.type==="VIP"&&<FaCrown className="w-3 h-3 text-amber-500"/>}
                          </div>
                          <p className="text-xs font-bold text-blue-600">{c.id}</p>
                          <p className="text-xs text-slate-400">{c.city}, {c.state}</p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${sc.bg} ${sc.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`}/>{c.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-slate-50 rounded-lg px-3 py-2">
                        <p className="text-slate-400">Phone</p>
                        <p className="font-bold text-slate-700">{c.phone}</p>
                      </div>
                      <div className="bg-slate-50 rounded-lg px-3 py-2">
                        <p className="text-slate-400">Total Spent</p>
                        <p className="font-extrabold text-slate-800">{fmtINR(c.spent)}</p>
                      </div>
                      <div className="bg-slate-50 rounded-lg px-3 py-2">
                        <p className="text-slate-400">Bookings</p>
                        <p className="font-bold text-slate-700">{c.bookings} trips</p>
                      </div>
                      <div className="bg-slate-50 rounded-lg px-3 py-2">
                        <p className="text-slate-400">Last Booking</p>
                        <p className="font-bold text-slate-700">{fmtDate(c.lastBooking)}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${tyc.border} ${tyc.bg} ${tyc.text}`}>{c.type}</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${tc.border} ${tc.bg} ${tc.text}`}>{tc.icon} {c.tier}</span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={()=>setView(c)} className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all">
                        <FaEye/> View
                      </button>
                      <button onClick={()=>setEdit(c)} className="flex-1 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-all">
                        <FaEdit/> Edit
                      </button>
                      <a href={`https://wa.me/${c.phone.replace(/\D/g,"")}`} target="_blank" rel="noreferrer"
                        className="flex-1 py-2 rounded-xl bg-green-50 hover:bg-green-100 text-green-600 border border-green-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-all">
                        <FaWhatsapp/> Chat
                      </a>
                      <button onClick={()=>setDelTarget(c)} className="w-9 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 border border-red-200 text-xs font-bold flex items-center justify-center transition-all">
                        <FaTrash/>
                      </button>
                    </div>
                  </div>
                );
              })
            }
          </div>

          {/* ── PAGINATION ── */}
          {filtered.length > 0 && (
            <div className="px-5 py-4 border-t border-slate-100 bg-slate-50/60 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-slate-400 font-medium">
                Showing <span className="font-bold text-slate-600">{(page-1)*perPage+1}</span>–<span className="font-bold text-slate-600">{Math.min(page*perPage,filtered.length)}</span> of <span className="font-bold text-slate-600">{filtered.length}</span> customers
              </p>
              <div className="flex items-center gap-1.5">
                <button disabled={page===1} onClick={()=>setPage(1)}
                  className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-600 text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center">
                  <FaAngleDoubleLeft className="text-xs"/>
                </button>
                <button disabled={page===1} onClick={()=>setPage(p=>p-1)}
                  className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-600 text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center">
                  <FaChevronLeft className="text-xs"/>
                </button>
                {Array.from({length:totalPages},(_,i)=>i+1)
                  .filter(p=>p===1||p===totalPages||Math.abs(p-page)<=1)
                  .reduce((acc,p,i,arr)=>{ if(i>0&&p-arr[i-1]>1) acc.push("…"); acc.push(p); return acc; },[])
                  .map((p,i)=>
                    typeof p==="string"
                    ? <span key={`e${i}`} className="w-8 h-8 flex items-center justify-center text-xs text-slate-400">…</span>
                    : <button key={p} onClick={()=>setPage(p)}
                        className={`w-8 h-8 rounded-lg text-xs font-bold transition-all border
                          ${page===p?"bg-blue-600 border-blue-600 text-white shadow-sm":"bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600"}`}>
                        {p}
                      </button>
                  )
                }
                <button disabled={page===totalPages} onClick={()=>setPage(p=>p+1)}
                  className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-600 text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center">
                  <FaChevronRight className="text-xs"/>
                </button>
                <button disabled={page===totalPages} onClick={()=>setPage(totalPages)}
                  className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-600 text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center">
                  <FaAngleDoubleRight className="text-xs"/>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── FOOTER ── */}
    
    </div>
  );
}