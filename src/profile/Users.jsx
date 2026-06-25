// // // src/components/Users/Users.jsx
// // // ─────────────────────────────────────────────────────────────
// // // Users Page — Travel CRM
// // // UPDATED:
// // //   - "Add New User" button → navigates to /CreateUser
// // //   - Edit button → navigates to /EditUser/:id
// // //   - Add/Edit modals REMOVED (now separate pages)
// // //   - Delete confirm modal KEPT (inline, no need for a page)
// // //   - Reset password modal KEPT (inline)
// // // ─────────────────────────────────────────────────────────────

// // import { useState, useMemo, useEffect, useCallback } from "react";
// // import { useNavigate } from "react-router-dom";

// // import {
// //   FiUsers, FiUserPlus, FiSearch, FiEdit2, FiTrash2,
// //   FiKey, FiEye, FiEyeOff, FiCheckCircle, FiXCircle,
// //   FiAlertCircle, FiChevronLeft, FiChevronRight, FiShield,
// // } from "react-icons/fi";
// // import {
// //   FaUsers, FaUserCheck, FaUserTimes, FaUserShield,
// //   FaAngleDoubleLeft, FaAngleDoubleRight,
// // } from "react-icons/fa";

// // // ── Uncomment when backend is ready ──────────────────────────
// //  import userService from "../services/profileUserService";

// // /* ─── MOCK DATA ──────────────────────────────────────────────── */
// // const MOCK_USERS = [
// //   { id:34, username:"Shreyash_Shahi",    fullName:"Shreyash Raghvendra Shahi", email:"nepaltours.travels@gmail.com",   role:"Staff",  status:"Active",   lastLogin:"Jun 18, 2026 10:53", createdAt:"Jun 13, 2026", phone:"+91 90990 97103" },
// //   { id:21, username:"deepti_paul",       fullName:"Deepti Paul",               email:"pauldeepti74@gmail.com",         role:"Staff",  status:"Active",   lastLogin:"Never",              createdAt:"May 30, 2026", phone:"+91 98765 00001" },
// //   { id:20, username:"vaishnavi_jagtap",  fullName:"Vaishnavi Shrikant Jagtap", email:"vaishnavisjagtap00@gmail.com",   role:"Staff",  status:"Active",   lastLogin:"Never",              createdAt:"May 30, 2026", phone:"+91 98765 00002" },
// //   { id:18, username:"testuser1",         fullName:"Test",                      email:"thombareprasad96@gmail.com",     role:"Staff",  status:"Active",   lastLogin:"May 30, 2026 11:04", createdAt:"May 29, 2026", phone:"+91 98765 00003" },
// //   { id:15, username:"admin_raj",         fullName:"Rajesh Kumar",              email:"rajesh.kumar@nepaltravel.com",   role:"Admin",  status:"Active",   lastLogin:"Jun 19, 2026 09:00", createdAt:"May 29, 2026", phone:"+91 98765 00004" },
// //   { id:12, username:"priya_sharma",      fullName:"Priya Sharma",              email:"priya.sharma@nepaltravel.com",   role:"Staff",  status:"Inactive", lastLogin:"Apr 10, 2026 14:22", createdAt:"May 10, 2026", phone:"+91 98765 00005" },
// //   { id:9,  username:"amit_patel",        fullName:"Amit Patel",                email:"amit.patel@nepaltravel.com",     role:"Staff",  status:"Inactive", lastLogin:"Mar 05, 2026 11:00", createdAt:"Apr 15, 2026", phone:"+91 98765 00006" },
// // ];

// // const AVATAR_GRADS = [
// //   "from-blue-500 to-blue-600","from-purple-500 to-purple-600",
// //   "from-teal-500 to-teal-600","from-rose-500 to-rose-600",
// //   "from-amber-500 to-amber-600","from-indigo-500 to-indigo-600",
// //   "from-green-500 to-green-600","from-cyan-500 to-cyan-600",
// // ];

// // const initials = (name="") =>
// //   name.trim().split(" ").filter(Boolean).map(w=>w[0]).join("").slice(0,2).toUpperCase()||"U";
// // const avatarGrad = (id) => AVATAR_GRADS[id % AVATAR_GRADS.length];

// // const ROLE_CFG = {
// //   Admin:   { bg:"bg-purple-100", text:"text-purple-700", border:"border-purple-200" },
// //   Staff:   { bg:"bg-blue-100",   text:"text-blue-700",   border:"border-blue-200"   },
// //   Manager: { bg:"bg-indigo-100", text:"text-indigo-700", border:"border-indigo-200" },
// // };
// // const STATUS_CFG = {
// //   Active:   { bg:"bg-emerald-100", text:"text-emerald-700", dot:"bg-emerald-500" },
// //   Inactive: { bg:"bg-slate-100",   text:"text-slate-500",   dot:"bg-slate-400"   },
// // };

// // const PASSWORD_RULES = [
// //   { id:"len",   label:"At least 6 characters",     test:(p)=>p.length>=6             },
// //   { id:"upper", label:"At least one uppercase",     test:(p)=>/[A-Z]/.test(p)        },
// //   { id:"lower", label:"At least one lowercase",     test:(p)=>/[a-z]/.test(p)        },
// //   { id:"num",   label:"At least one number",        test:(p)=>/[0-9]/.test(p)        },
// //   { id:"spec",  label:"At least one special char",  test:(p)=>/[^A-Za-z0-9]/.test(p) },
// // ];

// // /* ─── TOAST ──────────────────────────────────────────────────── */
// // function Toast({ msg, type, onClose }) {
// //   useEffect(()=>{ const t=setTimeout(onClose,3500); return()=>clearTimeout(t); },[onClose]);
// //   return (
// //     <div className={`fixed top-5 right-5 z-[999] flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl max-w-xs
// //       ${type==="success"?"bg-green-50 border-green-200 text-green-800":"bg-red-50 border-red-200 text-red-800"}`}
// //       style={{animation:"slideIn .3s ease both"}}>
// //       <span className="text-lg">{type==="success"?"✅":"❌"}</span>
// //       <p className="text-sm font-semibold flex-1">{msg}</p>
// //       <button onClick={onClose} className="opacity-50 hover:opacity-100 text-lg ml-1">×</button>
// //     </div>
// //   );
// // }

// // /* ─── STAT CARD ──────────────────────────────────────────────── */
// // function StatCard({ icon:Icon, label, value, gradient, sub, delay=0 }) {
// //   const [displayed, setDisplayed] = useState(0);
// //   useEffect(()=>{
// //     if(!value){ setDisplayed(0); return; }
// //     let s=0; const step=Math.max(1,Math.ceil(value/50));
// //     const iv=setInterval(()=>{ s=Math.min(s+step,value); setDisplayed(s); if(s>=value)clearInterval(iv); },16);
// //     return()=>clearInterval(iv);
// //   },[value]);
// //   return (
// //     <div className={`bg-gradient-to-br ${gradient} rounded-2xl p-5 text-white shadow-lg relative overflow-hidden group
// //       hover:-translate-y-1 hover:shadow-xl transition-all duration-300 cursor-pointer`}
// //       style={{animationDelay:`${delay}ms`}}>
// //       <div className="absolute -right-5 -top-5 w-24 h-24 rounded-full bg-white/10 group-hover:scale-110 transition-transform duration-300"/>
// //       <div className="absolute -right-3 -bottom-8 w-32 h-32 rounded-full bg-white/10"/>
// //       <div className="relative z-10">
// //         <div className="flex items-start justify-between mb-3">
// //           <div className="w-10 h-10 rounded-xl bg-white/20 group-hover:bg-white/30 flex items-center justify-center transition-all">
// //             <Icon className="w-5 h-5"/>
// //           </div>
// //           {sub&&<span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded-full">{sub}</span>}
// //         </div>
// //         <p className="text-2xl sm:text-3xl font-extrabold leading-none mb-1">{displayed}</p>
// //         <p className="text-xs font-bold uppercase tracking-widest opacity-80">{label}</p>
// //       </div>
// //     </div>
// //   );
// // }

// // /* ─── SKELETON ROW ───────────────────────────────────────────── */
// // function SkeletonRow() {
// //   return (
// //     <tr>
// //       {[...Array(9)].map((_,i)=>(
// //         <td key={i} className="px-4 py-4">
// //           <div className="h-4 rounded-lg bg-slate-200 animate-pulse" style={{width:`${40+Math.random()*50}%`}}/>
// //         </td>
// //       ))}
// //     </tr>
// //   );
// // }

// // /* ─── DELETE CONFIRM MODAL — kept inline ─────────────────────── */
// // function DeleteConfirm({ user, onClose, onConfirm }) {
// //   return (
// //     <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
// //       onClick={e=>e.target===e.currentTarget&&onClose()}>
// //       <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}/>
// //       <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm z-10 p-6 text-center"
// //         style={{animation:"popIn .25s ease both"}}>
// //         <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-3xl mx-auto mb-4">🗑️</div>
// //         <h3 className="text-lg font-extrabold text-slate-800 mb-1">Delete User?</h3>
// //         <p className="text-sm text-slate-500 mb-5">
// //           Are you sure you want to delete{" "}
// //           <span className="font-bold text-slate-700">{user?.fullName}</span>?
// //           This action cannot be undone.
// //         </p>
// //         <div className="flex gap-3">
// //           <button onClick={onClose}
// //             className="flex-1 py-2.5 rounded-xl border-2 border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all">
// //             Cancel
// //           </button>
// //           <button onClick={onConfirm}
// //             className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md shadow-red-200 transition-all">
// //             Yes, Delete
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // /* ─── RESET PASSWORD MODAL — kept inline ─────────────────────── */
// // function ResetPasswordModal({ user, onClose, showToast }) {
// //   const [newPass, setNewPass] = useState("");
// //   const [confirm, setConfirm] = useState("");
// //   const [showP,   setShowP]   = useState(false);
// //   const [showC,   setShowC]   = useState(false);
// //   const [errs,    setErrs]    = useState({});
// //   const [saving,  setSaving]  = useState(false);
  

// //   const ruleResults = PASSWORD_RULES.map(r=>({ ...r, passed:r.test(newPass) }));
// //   const allPassed   = ruleResults.every(r=>r.passed);

// //   const handleReset = async () => {
// //     const e={};
// //     if(!newPass)              e.newPass="Password is required";
// //     if(!allPassed)            e.newPass="Password does not meet all requirements";
// //     if(!confirm)              e.confirm="Please confirm the password";
// //     if(newPass!==confirm)     e.confirm="Passwords do not match";
// //     if(Object.keys(e).length){ setErrs(e); return; }
    
// //     setSaving(true);

// // try {
// //   await userService.resetPassword(
// //     user.id,
// //     newPass,
// //     confirm
// //   );

// //   showToast(
// //     `Password for ${user.fullName} reset successfully.`
// //   );

// //   onClose();
// // } catch (err) {
// //   showToast(
// //     err?.response?.data?.message ||
// //     "Failed to reset password.",
// //     "error"
// //   );
// // } finally {
// //   setSaving(false);
// // }
// // };

// //   return (
// //     <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
// //       onClick={e=>e.target===e.currentTarget&&onClose()}>
// //       <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}/>
// //       <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md z-10"
// //         style={{animation:"popIn .25s ease both"}}>
// //         <div className="bg-gradient-to-r from-teal-600 to-teal-500 px-6 py-5 rounded-t-2xl flex items-center justify-between">
// //           <div>
// //             <h2 className="text-white font-extrabold text-lg flex items-center gap-2">
// //               <FiKey className="w-4 h-4"/> Reset Password
// //             </h2>
// //             <p className="text-white/70 text-xs mt-0.5">Reset password for {user?.fullName}</p>
// //           </div>
// //           <button onClick={onClose}
// //             className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center text-lg transition-all">
// //             ×
// //           </button>
// //         </div>
// //         <div className="p-6 space-y-4">
// //           {/* New Password */}
// //           <div>
// //             <label className="block text-xs font-extrabold text-slate-600 uppercase tracking-wide mb-1.5">
// //               New Password <span className="text-red-500">*</span>
// //             </label>
// //             <div className="relative">
// //               <input
// //                 type={showP?"text":"password"}
// //                 value={newPass}
// //                 onChange={e=>{ setNewPass(e.target.value); setErrs(p=>({...p,newPass:""})); }}
// //                 className={`w-full px-3.5 py-2.5 pr-11 rounded-xl border text-sm text-slate-700 placeholder-slate-400
// //                   focus:outline-none focus:ring-2 transition-all bg-white
// //                   ${errs.newPass?"border-red-300 focus:border-red-400 focus:ring-red-50":"border-slate-200 focus:border-blue-400 focus:ring-blue-50"}`}
// //                 placeholder="Min 6 characters"
// //               />
// //               <button type="button" onClick={()=>setShowP(v=>!v)}
// //                 className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
// //                 {showP?<FiEyeOff className="w-4 h-4"/>:<FiEye className="w-4 h-4"/>}
// //               </button>
// //             </div>
// //             {errs.newPass&&<p className="mt-1 text-xs text-red-500 flex items-center gap-1"><FiAlertCircle className="w-3 h-3"/>{errs.newPass}</p>}
// //           </div>

// //           {/* Confirm Password */}
// //           <div>
// //             <label className="block text-xs font-extrabold text-slate-600 uppercase tracking-wide mb-1.5">
// //               Confirm Password <span className="text-red-500">*</span>
// //             </label>
// //             <div className="relative">
// //               <input
// //                 type={showC?"text":"password"}
// //                 value={confirm}
// //                 onChange={e=>{ setConfirm(e.target.value); setErrs(p=>({...p,confirm:""})); }}
// //                 className={`w-full px-3.5 py-2.5 pr-11 rounded-xl border text-sm text-slate-700 placeholder-slate-400
// //                   focus:outline-none focus:ring-2 transition-all bg-white
// //                   ${errs.confirm?"border-red-300 focus:border-red-400 focus:ring-red-50":"border-slate-200 focus:border-blue-400 focus:ring-blue-50"}`}
// //                 placeholder="Re-enter password"
// //               />
// //               <button type="button" onClick={()=>setShowC(v=>!v)}
// //                 className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
// //                 {showC?<FiEyeOff className="w-4 h-4"/>:<FiEye className="w-4 h-4"/>}
// //               </button>
// //             </div>
// //             {errs.confirm&&<p className="mt-1 text-xs text-red-500 flex items-center gap-1"><FiAlertCircle className="w-3 h-3"/>{errs.confirm}</p>}
// //           </div>

// //           {/* Requirements checklist */}
// //           {newPass && (
// //             <div className="bg-slate-50 rounded-xl border border-slate-200 px-4 py-3">
// //               <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
// //                 {ruleResults.map(r=>(
// //                   <div key={r.id} className="flex items-center gap-2">
// //                     {r.passed
// //                       ? <FiCheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0"/>
// //                       : <FiXCircle    className="w-3.5 h-3.5 text-red-400    flex-shrink-0"/>}
// //                     <span className={`text-xs ${r.passed?"text-emerald-600 font-semibold":"text-slate-500"}`}>
// //                       {r.label}
// //                     </span>
// //                   </div>
// //                 ))}
// //               </div>
// //             </div>
// //           )}

// //           <div className="flex gap-3 pt-1">
// //             <button onClick={onClose}
// //               className="flex-1 py-2.5 rounded-xl border-2 border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all">
// //               Cancel
// //             </button>
// //             <button onClick={handleReset} disabled={saving}
// //               className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm
// //                 shadow-md shadow-teal-200 transition-all disabled:opacity-60 flex items-center justify-center gap-2">
// //               {saving
// //                 ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/>
// //                 : <FiKey className="w-4 h-4"/>}
// //               {saving?"Resetting…":"Reset Password"}
// //             </button>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // /* ─── MAIN PAGE ──────────────────────────────────────────────── */
// // export default function Users() {
// //   const navigate = useNavigate();

// //   const [users,      setUsers]      = useState([]);
// //   const [search,     setSearch]     = useState("");
// //   const [activeTab,  setActiveTab]  = useState("All");
// //   const [loading,    setLoading]    = useState(true);
// //   const [toast,      setToast]      = useState(null);
// //   const [page,       setPage]       = useState(1);
// //   const perPage = 8;

// //   // Only delete + reset modals remain inline
// //   const [deleteUser, setDeleteUser] = useState(null);

// //   const showToast = useCallback((msg, type="success")=>setToast({msg,type}),[]);

// //   useEffect(() => {
// //   setLoading(true);

// //   userService
// //     .getAll()
// //     .then((res) => {
// //       setUsers(res.data);
// //     })
// //     .catch(() => {
// //       showToast("Failed to load users.", "error");
// //     })
// //     .finally(() => {
// //       setLoading(false);
// //     });
// // }, [showToast]);

  

// //   /* stats */
// //   const stats = useMemo(()=>({
// //     total:    users.length,
// //     active:   users.filter(u=>u.status==="Active").length,
// //     inactive: users.filter(u=>u.status==="Inactive").length,
// //     admins:   users.filter(u=>u.role==="Admin").length,
// //   }),[users]);

// //   /* filtered list */
// //   const filtered = useMemo(()=>{
// //     let out = [...users];
// //     const q = search.toLowerCase();
// //     if(q) out = out.filter(u=>
// //       (u.username || "").toLowerCase().includes(q)||
// //       (u.username || "").toLowerCase().includes(q)||
// //       (u.email || "").toLowerCase().includes(q)||
// //       String(u.id).includes(q)
// //     );
// //     if(activeTab==="Active")   out = out.filter(u=>u.status==="Active");
// //     if(activeTab==="Inactive") out = out.filter(u=>u.status==="Inactive");
// //     return out;
// //   },[users,search,activeTab]);

// //   const totalPages = Math.max(1,Math.ceil(filtered.length/perPage));
// //   const pageData   = filtered.slice((page-1)*perPage, page*perPage);

// //   /* delete handler */
// //   const handleDelete = async () => {
// //   try {
// //     await userService.delete(deleteUser.id);

// //     setUsers((prev) =>
// //       prev.filter((u) => u.id !== deleteUser.id)
// //     );

// //     showToast(
// //       `"${deleteUser.fullName}" deleted.`
// //     );
// //   } catch (err) {
// //     showToast(
// //       err?.response?.data?.message ||
// //       "Failed to delete user.",
// //       "error"
// //     );
// //   } finally {
// //     setDeleteUser(null);
// //   }
// // };

// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100"
// //       style={{fontFamily:"'Plus Jakarta Sans', system-ui, sans-serif"}}>
// //       <style>{`
// //         @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
// //         @keyframes slideIn { from{transform:translateX(110%);opacity:0} to{transform:translateX(0);opacity:1} }
// //         @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
// //         @keyframes popIn   { from{transform:scale(.92);opacity:0} to{transform:scale(1);opacity:1} }
// //         .fade-up { animation: fadeUp .4s ease both; }
// //         select { -webkit-appearance:none; appearance:none; }
// //         ::-webkit-scrollbar{width:5px;height:5px}
// //         ::-webkit-scrollbar-track{background:#f1f5f9;border-radius:99px}
// //         ::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:99px}
// //       `}</style>

// //       {toast      && <Toast msg={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}
// //       {deleteUser && <DeleteConfirm user={deleteUser} onClose={()=>setDeleteUser(null)} onConfirm={handleDelete}/>}

// //       {/* ── PAGE HEADER ── */}
// //       <div className="bg-white/70 backdrop-blur-md border-b border-slate-100">
// //         <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-5">
// //           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
// //             <div className="flex items-center gap-4">
// //               <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white text-xl shadow-lg shadow-blue-200 flex-shrink-0">
// //                 <FaUsers className="w-5 h-5"/>
// //               </div>
// //               <div>
// //                 <h1 className="text-xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
// //                   Users
// //                   <span className="hidden sm:inline text-xs bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">
// //                     {users.length} total
// //                   </span>
// //                 </h1>
// //                 <p className="text-sm text-slate-400 mt-0.5">
// //                   Manage staff accounts, roles &amp; permissions
// //                   <span className="hidden sm:inline ml-3 text-slate-300">|</span>
// //                   <span className="hidden sm:inline ml-3 text-xs">
// //                     <span className="hover:text-blue-600 cursor-pointer transition-colors" onClick={()=>navigate("/")}>Home</span>
// //                     <span className="mx-1 text-slate-300">/</span>
// //                     <span className="text-blue-600 font-bold">Users</span>
// //                   </span>
// //                 </p>
// //               </div>
// //             </div>

// //             {/* ── ADD NEW USER → navigates to /CreateUser ── */}
// //             <button onClick={()=>navigate("/CreateUser")}
// //               className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold
// //                 shadow-md shadow-blue-200 hover:shadow-lg transition-all">
// //               <FiUserPlus className="w-4 h-4"/> Add New User
// //             </button>
// //           </div>
// //         </div>
// //       </div>

// //       <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6 space-y-6">

// //         {/* ── STAT CARDS ── */}
// //         <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
// //           {[
// //             { icon:FaUsers,      label:"Total Users",    value:stats.total,    gradient:"from-cyan-500 to-cyan-600",     delay:0   },
// //             { icon:FaUserCheck,  label:"Active Users",   value:stats.active,   gradient:"from-green-500 to-emerald-600", delay:60  },
// //             { icon:FaUserTimes,  label:"Inactive Users", value:stats.inactive, gradient:"from-slate-500 to-slate-600",   delay:120 },
// //             { icon:FaUserShield, label:"Admins",         value:stats.admins,   gradient:"from-purple-500 to-purple-600", delay:180 },
// //           ].map(c=>(
// //             <div key={c.label} className="fade-up" style={{animationDelay:`${c.delay}ms`}}>
// //               <StatCard {...c}/>
// //             </div>
// //           ))}
// //         </div>

// //         {/* ── USER LIST CARD ── */}
// //         <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">

// //           {/* List header */}
// //           <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
// //             <div className="flex items-center gap-3">
// //               <h2 className="text-base font-extrabold text-slate-700">User List</h2>
// //               <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2.5 py-1 rounded-full">
// //                 {filtered.length} results
// //               </span>
// //             </div>
// //             <button onClick={()=>navigate("/CreateUser")}
// //               className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-200 transition-all">
// //               <FiUserPlus className="w-3.5 h-3.5"/> Add New User
// //             </button>
// //           </div>

// //           {/* Search + Status filter tabs */}
// //           <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/60">
// //             <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
// //               <div className="relative flex-1 min-w-[200px]">
// //                 <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/>
// //                 <input value={search} onChange={e=>{ setSearch(e.target.value); setPage(1); }}
// //                   placeholder="Search by name, username, email, ID..."
// //                   className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 placeholder-slate-400
// //                     focus:border-blue-400 focus:ring-2 focus:ring-blue-50 outline-none transition-all"/>
// //               </div>

// //               <div className="flex rounded-xl border border-slate-200 overflow-hidden flex-shrink-0">
// //                 {["Active","Inactive","All"].map(tab=>(
// //                   <button key={tab} onClick={()=>{ setActiveTab(tab); setPage(1); }}
// //                     className={`px-4 py-2.5 text-xs font-bold transition-all whitespace-nowrap
// //                       ${activeTab===tab
// //                         ? tab==="Active"    ? "bg-emerald-500 text-white"
// //                           : tab==="Inactive" ? "bg-slate-500 text-white"
// //                           : "bg-blue-600 text-white"
// //                         : "bg-white text-slate-500 hover:bg-slate-50"}`}>
// //                     {tab}
// //                   </button>
// //                 ))}
// //               </div>
// //             </div>
// //           </div>

// //           {/* ── DESKTOP TABLE ── */}
// //           <div className="hidden lg:block overflow-x-auto">
// //             <table className="w-full min-w-[900px]">
// //               <thead className="bg-slate-50/80 border-b border-slate-100">
// //                 <tr>
// //                   {["ID","Username","Full Name","Email","Role","Status","Last Login","Created","Actions"].map(h=>(
// //                     <th key={h} className="px-4 py-3.5 text-left text-xs font-extrabold text-slate-500 uppercase tracking-wider whitespace-nowrap">
// //                       {h}
// //                     </th>
// //                   ))}
// //                 </tr>
// //               </thead>
// //               <tbody className="divide-y divide-slate-50">
// //                 {loading
// //                   ? [...Array(5)].map((_,i)=><SkeletonRow key={i}/>)
// //                   : pageData.length===0
// //                   ? (
// //                     <tr>
// //                       <td colSpan={9} className="text-center py-20">
// //                         <div className="text-5xl mb-3">👥</div>
// //                         <p className="text-base font-extrabold text-slate-600 mb-1">No Users Found</p>
// //                         <p className="text-sm text-slate-400 mb-4">
// //                           {search||activeTab!=="All"
// //                             ? "Try adjusting your search or filters."
// //                             : "Add your first user to get started."}
// //                         </p>
// //                         {search||activeTab!=="All"
// //                           ? <button onClick={()=>{ setSearch(""); setActiveTab("All"); }}
// //                               className="px-4 py-2 rounded-xl bg-blue-50 text-blue-600 font-bold text-sm hover:bg-blue-100 transition-all">
// //                               Clear Filters
// //                             </button>
// //                           : <button onClick={()=>navigate("/CreateUser")}
// //                               className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm shadow-md hover:bg-blue-700 transition-all flex items-center gap-2 mx-auto">
// //                               <FiUserPlus/> Add First User
// //                             </button>}
// //                       </td>
// //                     </tr>
// //                   )
// //                   : pageData.map((u,idx)=>{
// //                     const rc = ROLE_CFG[u.role]    || ROLE_CFG.Staff;
// //                     const sc = STATUS_CFG[u.status] || STATUS_CFG.Inactive;
// //                     return (
// //                       <tr key={u.id}
// //                         className="group transition-all duration-150 hover:bg-blue-50/40 hover:shadow-[inset_3px_0_0_#2563eb]"
// //                         style={{animation:"fadeUp .35s ease both", animationDelay:`${idx*30}ms`}}>

// //                         {/* ID */}
// //                         <td className="px-4 py-3.5">
// //                           <span className="text-xs font-extrabold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">{u.id}</span>
// //                         </td>

// //                         {/* Username + avatar */}
// //                         <td className="px-4 py-3.5">
// //                           <div className="flex items-center gap-2.5">
// //                             <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${avatarGrad(u.id)} flex items-center justify-center text-white text-xs font-extrabold flex-shrink-0`}>
// //                               {initials(u.fullName)}
// //                             </div>
// //                             <span className="text-sm font-bold text-blue-600">{u.username}</span>
// //                           </div>
// //                         </td>

// //                         {/* Full Name */}
// //                         <td className="px-4 py-3.5">
// //                           <p className="text-sm font-semibold text-slate-800">{u.fullName}</p>
// //                         </td>

// //                         {/* Email */}
// //                         <td className="px-4 py-3.5">
// //                           <p className="text-sm text-slate-600 truncate max-w-[200px]">{u.email}</p>
// //                         </td>

// //                         {/* Role */}
// //                         <td className="px-4 py-3.5">
// //                           <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${rc.border} ${rc.bg} ${rc.text}`}>
// //                             {u.role}
// //                           </span>
// //                         </td>

// //                         {/* Status */}
// //                         <td className="px-4 py-3.5">
// //                           <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1.5 rounded-full ${sc.bg} ${sc.text}`}>
// //                             <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`}/>
// //                             {u.status}
// //                           </span>
// //                         </td>

// //                         {/* Last Login */}
// //                         <td className="px-4 py-3.5">
// //                           <p className="text-xs text-slate-500 font-medium">{u.lastLogin}</p>
// //                         </td>

// //                         {/* Created */}
// //                         <td className="px-4 py-3.5">
// //                           <p className="text-xs text-slate-500 font-medium">{u.createdAt}</p>
// //                         </td>

// //                         {/* Actions */}
// //                         <td className="px-4 py-3.5">
// //                           <div className="flex items-center gap-1.5 opacity-70 group-hover:opacity-100 transition-opacity">
// //                             {/* ── EDIT → navigates to /EditUser/:id ── */}
// //                              {/* <button onClick={()=>navigate(`/EditUser`)} */}
// //                             <button onClick={()=>navigate(`/EditUser/${u.id}`)}
// //                              title="Edit User"
// //                               className="w-8 h-8 rounded-lg bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center transition-all text-sm shadow-sm">
// //                               <FiEdit2 className="w-3.5 h-3.5"/>
// //                             </button>

// //                             {/* DELETE → inline modal */}
// //                             <button onClick={()=>setDeleteUser(u)} title="Delete User"
// //                               className="w-8 h-8 rounded-lg bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-all text-sm shadow-sm">
// //                               <FiTrash2 className="w-3.5 h-3.5"/>
// //                             </button>

// //                             {/* MANAGE PERMISSIONS → navigates to /UserPermissions/:id */}
// //                             {/* <button onClick={()=>navigate(`/UserPermissions`)}  */}
// //                             <button onClick={()=>navigate(`/UserPermissions/${u.id}`)} 
// //                             title="Manage Permissions"
// //                               className="w-8 h-8 rounded-lg bg-teal-500 hover:bg-teal-600 text-white flex items-center justify-center transition-all text-sm shadow-sm">
// //                               <FiShield className="w-3.5 h-3.5"/>
// //                             </button>
// //                           </div>
// //                         </td>
// //                       </tr>
// //                     );
// //                   })}
// //               </tbody>
// //             </table>
// //           </div>

// //           {/* ── MOBILE CARDS ── */}
// //           <div className="lg:hidden p-4 space-y-3">
// //             {loading
// //               ? [...Array(4)].map((_,i)=>(
// //                   <div key={i} className="bg-white rounded-2xl border border-slate-100 p-4 space-y-3">
// //                     {[...Array(3)].map((_,j)=>(
// //                       <div key={j} className="h-4 rounded-lg bg-slate-200 animate-pulse" style={{width:`${40+Math.random()*50}%`}}/>
// //                     ))}
// //                   </div>
// //                 ))
// //               : pageData.length===0
// //               ? (
// //                 <div className="text-center py-14">
// //                   <div className="text-5xl mb-3">👥</div>
// //                   <p className="text-base font-extrabold text-slate-600 mb-1">No Users Found</p>
// //                   <p className="text-sm text-slate-400 mb-4">
// //                     {search||activeTab!=="All" ? "Adjust filters." : "Add your first user."}
// //                   </p>
// //                   {!search&&activeTab==="All"&&(
// //                     <button onClick={()=>navigate("/CreateUser")}
// //                       className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm">
// //                       + Add User
// //                     </button>
// //                   )}
// //                 </div>
// //               )
// //               : pageData.map((u,idx)=>{
// //                 const rc = ROLE_CFG[u.role]    || ROLE_CFG.Staff;
// //                 const sc = STATUS_CFG[u.status] || STATUS_CFG.Inactive;
// //                 return (
// //                   <div key={u.id}
// //                     className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-3 fade-up"
// //                     style={{animationDelay:`${idx*40}ms`}}>
// //                     <div className="flex items-start justify-between">
// //                       <div className="flex items-center gap-3">
// //                         <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${avatarGrad(u.id)} flex items-center justify-center text-white text-sm font-extrabold flex-shrink-0`}>
// //                           {initials(u.fullName)}
// //                         </div>
// //                         <div>
// //                           <p className="font-extrabold text-slate-800 text-sm">{u.fullName}</p>
// //                           <p className="text-xs font-bold text-blue-600">{u.username}</p>
// //                           <p className="text-xs text-slate-400">#{u.id}</p>
// //                         </div>
// //                       </div>
// //                       <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${sc.bg} ${sc.text}`}>
// //                         <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`}/>{u.status}
// //                       </span>
// //                     </div>

// //                     <div className="grid grid-cols-2 gap-2 text-xs">
// //                       <div className="bg-slate-50 rounded-lg px-3 py-2">
// //                         <p className="text-slate-400">Email</p>
// //                         <p className="font-bold text-slate-700 truncate">{u.email}</p>
// //                       </div>
// //                       <div className="bg-slate-50 rounded-lg px-3 py-2">
// //                         <p className="text-slate-400">Role</p>
// //                         <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${rc.border} ${rc.bg} ${rc.text}`}>{u.role}</span>
// //                       </div>
// //                       <div className="bg-slate-50 rounded-lg px-3 py-2">
// //                         <p className="text-slate-400">Last Login</p>
// //                         <p className="font-bold text-slate-700">{u.lastLogin}</p>
// //                       </div>
// //                       <div className="bg-slate-50 rounded-lg px-3 py-2">
// //                         <p className="text-slate-400">Created</p>
// //                         <p className="font-bold text-slate-700">{u.createdAt}</p>
// //                       </div>
// //                     </div>

// //                     <div className="flex gap-2">
// //                       {/* Edit → navigate to EditUser page */}
// //                       {/* <button onClick={()=>navigate(`/EditUser`)} */}
// //                       <button onClick={()=>navigate(`/EditUser/${u.id}`)}
// //                         className="flex-1 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all">
// //                         <FiEdit2 className="w-3 h-3"/> Edit
// //                       </button>

// //                       {/* Manage Permissions → navigate to /UserPermissions/:id */}
// //                       {/* <button onClick={()=>navigate(`/UserPermissions`)} */}
// //                       <button onClick={()=>navigate(`/UserPermissions/${u.id}`)}
// //                         className="flex-1 py-2 rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all">
// //                         <FiShield className="w-3 h-3"/> Permissions
// //                       </button>

// //                       {/* Delete → inline modal */}
// //                       <button onClick={()=>setDeleteUser(u)}
// //                         className="w-9 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-bold flex items-center justify-center transition-all">
// //                         <FiTrash2 className="w-3.5 h-3.5"/>
// //                       </button>
// //                     </div>
// //                   </div>
// //                 );
// //               })}
// //           </div>

// //           {/* ── PAGINATION ── */}
// //           {filtered.length > 0 && (
// //             <div className="px-5 py-4 border-t border-slate-100 bg-slate-50/60 flex flex-col sm:flex-row items-center justify-between gap-3">
// //               <p className="text-xs text-slate-400 font-medium">
// //                 Showing{" "}
// //                 <span className="font-bold text-slate-600">{(page-1)*perPage+1}</span>–
// //                 <span className="font-bold text-slate-600">{Math.min(page*perPage,filtered.length)}</span>
// //                 {" "}of{" "}
// //                 <span className="font-bold text-slate-600">{filtered.length}</span> users
// //               </p>
// //               <div className="flex items-center gap-1.5">
// //                 <button disabled={page===1} onClick={()=>setPage(1)}
// //                   className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-600 text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center">
// //                   <FaAngleDoubleLeft className="text-xs"/>
// //                 </button>
// //                 <button disabled={page===1} onClick={()=>setPage(p=>p-1)}
// //                   className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-600 text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center">
// //                   <FiChevronLeft className="text-xs"/>
// //                 </button>
// //                 {Array.from({length:totalPages},(_,i)=>i+1)
// //                   .filter(p=>p===1||p===totalPages||Math.abs(p-page)<=1)
// //                   .reduce((acc,p,i,arr)=>{ if(i>0&&p-arr[i-1]>1) acc.push("…"); acc.push(p); return acc; },[])
// //                   .map((p,i)=>
// //                     typeof p==="string"
// //                       ? <span key={`e${i}`} className="w-8 h-8 flex items-center justify-center text-xs text-slate-400">…</span>
// //                       : <button key={p} onClick={()=>setPage(p)}
// //                           className={`w-8 h-8 rounded-lg text-xs font-bold transition-all border
// //                             ${page===p
// //                               ?"bg-blue-600 border-blue-600 text-white shadow-sm"
// //                               :"bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600"}`}>
// //                           {p}
// //                         </button>
// //                   )}
// //                 <button disabled={page===totalPages} onClick={()=>setPage(p=>p+1)}
// //                   className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-600 text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center">
// //                   <FiChevronRight className="text-xs"/>
// //                 </button>
// //                 <button disabled={page===totalPages} onClick={()=>setPage(totalPages)}
// //                   className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-600 text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center">
// //                   <FaAngleDoubleRight className="text-xs"/>
// //                 </button>
// //               </div>
// //             </div>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }




// // src/components/Users/Users.jsx
// // ─────────────────────────────────────────────────────────────
// // Users Page — Travel CRM
// // UPDATED:
// //   - "Add New User" button → navigates to /CreateUser
// //   - Edit button → navigates to /EditUser/:id
// //   - Add/Edit modals REMOVED (now separate pages)
// //   - Delete confirm modal KEPT (inline, no need for a page)
// //   - Reset password modal KEPT (inline)
// // ─────────────────────────────────────────────────────────────

// import { useState, useMemo, useEffect, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   FiUsers, FiUserPlus, FiSearch, FiEdit2, FiTrash2,
//   FiKey, FiEye, FiEyeOff, FiCheckCircle, FiXCircle,
//   FiAlertCircle, FiChevronLeft, FiChevronRight, FiShield,
// } from "react-icons/fi";
// import {
//   FaUsers, FaUserCheck, FaUserTimes, FaUserShield,
//   FaAngleDoubleLeft, FaAngleDoubleRight,
// } from "react-icons/fa";

// // ── Uncomment when backend is ready ──────────────────────────
// // import userService from "../services/userService";

// /* ─── MOCK DATA ──────────────────────────────────────────────── */
// const MOCK_USERS = [
//   { id:34, username:"Shreyash_Shahi",    fullName:"Shreyash Raghvendra Shahi", email:"nepaltours.travels@gmail.com",   role:"Staff",  status:"Active",   lastLogin:"Jun 18, 2026 10:53", createdAt:"Jun 13, 2026", phone:"+91 90990 97103" },
//   { id:21, username:"deepti_paul",       fullName:"Deepti Paul",               email:"pauldeepti74@gmail.com",         role:"Staff",  status:"Active",   lastLogin:"Never",              createdAt:"May 30, 2026", phone:"+91 98765 00001" },
//   { id:20, username:"vaishnavi_jagtap",  fullName:"Vaishnavi Shrikant Jagtap", email:"vaishnavisjagtap00@gmail.com",   role:"Staff",  status:"Active",   lastLogin:"Never",              createdAt:"May 30, 2026", phone:"+91 98765 00002" },
//   { id:18, username:"testuser1",         fullName:"Test",                      email:"thombareprasad96@gmail.com",     role:"Staff",  status:"Active",   lastLogin:"May 30, 2026 11:04", createdAt:"May 29, 2026", phone:"+91 98765 00003" },
//   { id:15, username:"admin_raj",         fullName:"Rajesh Kumar",              email:"rajesh.kumar@nepaltravel.com",   role:"Admin",  status:"Active",   lastLogin:"Jun 19, 2026 09:00", createdAt:"May 29, 2026", phone:"+91 98765 00004" },
//   { id:12, username:"priya_sharma",      fullName:"Priya Sharma",              email:"priya.sharma@nepaltravel.com",   role:"Staff",  status:"Inactive", lastLogin:"Apr 10, 2026 14:22", createdAt:"May 10, 2026", phone:"+91 98765 00005" },
//   { id:9,  username:"amit_patel",        fullName:"Amit Patel",                email:"amit.patel@nepaltravel.com",     role:"Staff",  status:"Inactive", lastLogin:"Mar 05, 2026 11:00", createdAt:"Apr 15, 2026", phone:"+91 98765 00006" },
// ];

// const AVATAR_GRADS = [
//   "from-blue-500 to-blue-600","from-purple-500 to-purple-600",
//   "from-teal-500 to-teal-600","from-rose-500 to-rose-600",
//   "from-amber-500 to-amber-600","from-indigo-500 to-indigo-600",
//   "from-green-500 to-green-600","from-cyan-500 to-cyan-600",
// ];

// const initials = (name="") =>
//   name.trim().split(" ").filter(Boolean).map(w=>w[0]).join("").slice(0,2).toUpperCase()||"U";
// const avatarGrad = (id) => AVATAR_GRADS[id % AVATAR_GRADS.length];

// const ROLE_CFG = {
//   Admin:   { bg:"bg-purple-100", text:"text-purple-700", border:"border-purple-200" },
//   Staff:   { bg:"bg-blue-100",   text:"text-blue-700",   border:"border-blue-200"   },
//   Manager: { bg:"bg-indigo-100", text:"text-indigo-700", border:"border-indigo-200" },
// };
// const STATUS_CFG = {
//   Active:   { bg:"bg-emerald-100", text:"text-emerald-700", dot:"bg-emerald-500" },
//   Inactive: { bg:"bg-slate-100",   text:"text-slate-500",   dot:"bg-slate-400"   },
// };

// const PASSWORD_RULES = [
//   { id:"len",   label:"At least 6 characters",     test:(p)=>p.length>=6             },
//   { id:"upper", label:"At least one uppercase",     test:(p)=>/[A-Z]/.test(p)        },
//   { id:"lower", label:"At least one lowercase",     test:(p)=>/[a-z]/.test(p)        },
//   { id:"num",   label:"At least one number",        test:(p)=>/[0-9]/.test(p)        },
//   { id:"spec",  label:"At least one special char",  test:(p)=>/[^A-Za-z0-9]/.test(p) },
// ];

// /* ─── TOAST ──────────────────────────────────────────────────── */
// function Toast({ msg, type, onClose }) {
//   useEffect(()=>{ const t=setTimeout(onClose,3500); return()=>clearTimeout(t); },[onClose]);
//   return (
//     <div className={`fixed top-5 right-5 z-[999] flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl max-w-xs
//       ${type==="success"?"bg-green-50 border-green-200 text-green-800":"bg-red-50 border-red-200 text-red-800"}`}
//       style={{animation:"slideIn .3s ease both"}}>
//       <span className="text-lg">{type==="success"?"✅":"❌"}</span>
//       <p className="text-sm font-semibold flex-1">{msg}</p>
//       <button onClick={onClose} className="opacity-50 hover:opacity-100 text-lg ml-1">×</button>
//     </div>
//   );
// }

// /* ─── STAT CARD ──────────────────────────────────────────────── */
// function StatCard({ icon:Icon, label, value, gradient, sub, delay=0 }) {
//   const [displayed, setDisplayed] = useState(0);
//   useEffect(()=>{
//     if(!value){ setDisplayed(0); return; }
//     let s=0; const step=Math.max(1,Math.ceil(value/50));
//     const iv=setInterval(()=>{ s=Math.min(s+step,value); setDisplayed(s); if(s>=value)clearInterval(iv); },16);
//     return()=>clearInterval(iv);
//   },[value]);
//   return (
//     <div className={`bg-gradient-to-br ${gradient} rounded-2xl p-5 text-white shadow-lg relative overflow-hidden group
//       hover:-translate-y-1 hover:shadow-xl transition-all duration-300 cursor-pointer`}
//       style={{animationDelay:`${delay}ms`}}>
//       <div className="absolute -right-5 -top-5 w-24 h-24 rounded-full bg-white/10 group-hover:scale-110 transition-transform duration-300"/>
//       <div className="absolute -right-3 -bottom-8 w-32 h-32 rounded-full bg-white/10"/>
//       <div className="relative z-10">
//         <div className="flex items-start justify-between mb-3">
//           <div className="w-10 h-10 rounded-xl bg-white/20 group-hover:bg-white/30 flex items-center justify-center transition-all">
//             <Icon className="w-5 h-5"/>
//           </div>
//           {sub&&<span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded-full">{sub}</span>}
//         </div>
//         <p className="text-2xl sm:text-3xl font-extrabold leading-none mb-1">{displayed}</p>
//         <p className="text-xs font-bold uppercase tracking-widest opacity-80">{label}</p>
//       </div>
//     </div>
//   );
// }

// /* ─── SKELETON ROW ───────────────────────────────────────────── */
// function SkeletonRow() {
//   return (
//     <tr>
//       {[...Array(9)].map((_,i)=>(
//         <td key={i} className="px-4 py-4">
//           <div className="h-4 rounded-lg bg-slate-200 animate-pulse" style={{width:`${40+Math.random()*50}%`}}/>
//         </td>
//       ))}
//     </tr>
//   );
// }

// /* ─── DELETE CONFIRM MODAL — kept inline ─────────────────────── */
// function DeleteConfirm({ user, onClose, onConfirm }) {
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
//       onClick={e=>e.target===e.currentTarget&&onClose()}>
//       <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}/>
//       <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm z-10 p-6 text-center"
//         style={{animation:"popIn .25s ease both"}}>
//         <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-3xl mx-auto mb-4">🗑️</div>
//         <h3 className="text-lg font-extrabold text-slate-800 mb-1">Delete User?</h3>
//         <p className="text-sm text-slate-500 mb-5">
//           Are you sure you want to delete{" "}
//           <span className="font-bold text-slate-700">{user?.fullName}</span>?
//           This action cannot be undone.
//         </p>
//         <div className="flex gap-3">
//           <button onClick={onClose}
//             className="flex-1 py-2.5 rounded-xl border-2 border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all">
//             Cancel
//           </button>
//           <button onClick={onConfirm}
//             className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md shadow-red-200 transition-all">
//             Yes, Delete
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ─── RESET PASSWORD MODAL — kept inline ─────────────────────── */
// function ResetPasswordModal({ user, onClose, showToast }) {
//   const [newPass, setNewPass] = useState("");
//   const [confirm, setConfirm] = useState("");
//   const [showP,   setShowP]   = useState(false);
//   const [showC,   setShowC]   = useState(false);
//   const [errs,    setErrs]    = useState({});
//   const [saving,  setSaving]  = useState(false);

//   const ruleResults = PASSWORD_RULES.map(r=>({ ...r, passed:r.test(newPass) }));
//   const allPassed   = ruleResults.every(r=>r.passed);

//   const handleReset = async () => {
//     const e={};
//     if(!newPass)              e.newPass="Password is required";
//     if(!allPassed)            e.newPass="Password does not meet all requirements";
//     if(!confirm)              e.confirm="Please confirm the password";
//     if(newPass!==confirm)     e.confirm="Passwords do not match";
//     if(Object.keys(e).length){ setErrs(e); return; }
//     setSaving(true);
//     // BACKEND: await userService.resetPassword(user.id, newPass, confirm);
//     await new Promise(r=>setTimeout(r,800));
//     showToast(`Password for ${user.fullName} reset successfully.`);
//     onClose();
//     setSaving(false);
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
//       onClick={e=>e.target===e.currentTarget&&onClose()}>
//       <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}/>
//       <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md z-10"
//         style={{animation:"popIn .25s ease both"}}>
//         <div className="bg-gradient-to-r from-teal-600 to-teal-500 px-6 py-5 rounded-t-2xl flex items-center justify-between">
//           <div>
//             <h2 className="text-white font-extrabold text-lg flex items-center gap-2">
//               <FiKey className="w-4 h-4"/> Reset Password
//             </h2>
//             <p className="text-white/70 text-xs mt-0.5">Reset password for {user?.fullName}</p>
//           </div>
//           <button onClick={onClose}
//             className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center text-lg transition-all">
//             ×
//           </button>
//         </div>
//         <div className="p-6 space-y-4">
//           {/* New Password */}
//           <div>
//             <label className="block text-xs font-extrabold text-slate-600 uppercase tracking-wide mb-1.5">
//               New Password <span className="text-red-500">*</span>
//             </label>
//             <div className="relative">
//               <input
//                 type={showP?"text":"password"}
//                 value={newPass}
//                 onChange={e=>{ setNewPass(e.target.value); setErrs(p=>({...p,newPass:""})); }}
//                 className={`w-full px-3.5 py-2.5 pr-11 rounded-xl border text-sm text-slate-700 placeholder-slate-400
//                   focus:outline-none focus:ring-2 transition-all bg-white
//                   ${errs.newPass?"border-red-300 focus:border-red-400 focus:ring-red-50":"border-slate-200 focus:border-blue-400 focus:ring-blue-50"}`}
//                 placeholder="Min 6 characters"
//               />
//               <button type="button" onClick={()=>setShowP(v=>!v)}
//                 className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
//                 {showP?<FiEyeOff className="w-4 h-4"/>:<FiEye className="w-4 h-4"/>}
//               </button>
//             </div>
//             {errs.newPass&&<p className="mt-1 text-xs text-red-500 flex items-center gap-1"><FiAlertCircle className="w-3 h-3"/>{errs.newPass}</p>}
//           </div>

//           {/* Confirm Password */}
//           <div>
//             <label className="block text-xs font-extrabold text-slate-600 uppercase tracking-wide mb-1.5">
//               Confirm Password <span className="text-red-500">*</span>
//             </label>
//             <div className="relative">
//               <input
//                 type={showC?"text":"password"}
//                 value={confirm}
//                 onChange={e=>{ setConfirm(e.target.value); setErrs(p=>({...p,confirm:""})); }}
//                 className={`w-full px-3.5 py-2.5 pr-11 rounded-xl border text-sm text-slate-700 placeholder-slate-400
//                   focus:outline-none focus:ring-2 transition-all bg-white
//                   ${errs.confirm?"border-red-300 focus:border-red-400 focus:ring-red-50":"border-slate-200 focus:border-blue-400 focus:ring-blue-50"}`}
//                 placeholder="Re-enter password"
//               />
//               <button type="button" onClick={()=>setShowC(v=>!v)}
//                 className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
//                 {showC?<FiEyeOff className="w-4 h-4"/>:<FiEye className="w-4 h-4"/>}
//               </button>
//             </div>
//             {errs.confirm&&<p className="mt-1 text-xs text-red-500 flex items-center gap-1"><FiAlertCircle className="w-3 h-3"/>{errs.confirm}</p>}
//           </div>

//           {/* Requirements checklist */}
//           {newPass && (
//             <div className="bg-slate-50 rounded-xl border border-slate-200 px-4 py-3">
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
//                 {ruleResults.map(r=>(
//                   <div key={r.id} className="flex items-center gap-2">
//                     {r.passed
//                       ? <FiCheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0"/>
//                       : <FiXCircle    className="w-3.5 h-3.5 text-red-400    flex-shrink-0"/>}
//                     <span className={`text-xs ${r.passed?"text-emerald-600 font-semibold":"text-slate-500"}`}>
//                       {r.label}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           <div className="flex gap-3 pt-1">
//             <button onClick={onClose}
//               className="flex-1 py-2.5 rounded-xl border-2 border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all">
//               Cancel
//             </button>
//             <button onClick={handleReset} disabled={saving}
//               className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm
//                 shadow-md shadow-teal-200 transition-all disabled:opacity-60 flex items-center justify-center gap-2">
//               {saving
//                 ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/>
//                 : <FiKey className="w-4 h-4"/>}
//               {saving?"Resetting…":"Reset Password"}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ─── MAIN PAGE ──────────────────────────────────────────────── */
// export default function Users() {
//   const navigate = useNavigate();

//   const [users,      setUsers]      = useState([]);
//   const [search,     setSearch]     = useState("");
//   const [activeTab,  setActiveTab]  = useState("All");
//   const [loading,    setLoading]    = useState(true);
//   const [toast,      setToast]      = useState(null);
//   const [page,       setPage]       = useState(1);
//   const perPage = 8;

//   // Only delete + reset modals remain inline
//   const [deleteUser, setDeleteUser] = useState(null);

//   useEffect(()=>{
//     // BACKEND: userService.getAll().then(res=>setUsers(res.data)).finally(()=>setLoading(false));
//     const t = setTimeout(()=>{ setUsers(MOCK_USERS); setLoading(false); }, 700);
//     return ()=>clearTimeout(t);
//   },[]);

//   const showToast = useCallback((msg, type="success")=>setToast({msg,type}),[]);

//   /* stats */
//   const stats = useMemo(()=>({
//     total:    users.length,
//     active:   users.filter(u=>u.status==="Active").length,
//     inactive: users.filter(u=>u.status==="Inactive").length,
//     admins:   users.filter(u=>u.role==="Admin").length,
//   }),[users]);

//   /* filtered list */
//   const filtered = useMemo(()=>{
//     let out = [...users];
//     const q = search.toLowerCase();
//     if(q) out = out.filter(u=>
//       u.username.toLowerCase().includes(q)||
//       u.fullName.toLowerCase().includes(q)||
//       u.email.toLowerCase().includes(q)||
//       String(u.id).includes(q)
//     );
//     if(activeTab==="Active")   out = out.filter(u=>u.status==="Active");
//     if(activeTab==="Inactive") out = out.filter(u=>u.status==="Inactive");
//     return out;
//   },[users,search,activeTab]);

//   const totalPages = Math.max(1,Math.ceil(filtered.length/perPage));
//   const pageData   = filtered.slice((page-1)*perPage, page*perPage);

//   /* delete handler */
//   const handleDelete = () => {
//     // BACKEND: userService.delete(deleteUser.id).then(...)
//     setUsers(p=>p.filter(u=>u.id!==deleteUser.id));
//     showToast(`"${deleteUser.fullName}" deleted.`);
//     setDeleteUser(null);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100"
//       style={{fontFamily:"'Plus Jakarta Sans', system-ui, sans-serif"}}>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
//         @keyframes slideIn { from{transform:translateX(110%);opacity:0} to{transform:translateX(0);opacity:1} }
//         @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
//         @keyframes popIn   { from{transform:scale(.92);opacity:0} to{transform:scale(1);opacity:1} }
//         .fade-up { animation: fadeUp .4s ease both; }
//         select { -webkit-appearance:none; appearance:none; }
//         ::-webkit-scrollbar{width:5px;height:5px}
//         ::-webkit-scrollbar-track{background:#f1f5f9;border-radius:99px}
//         ::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:99px}
//       `}</style>

//       {toast      && <Toast msg={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}
//       {deleteUser && <DeleteConfirm user={deleteUser} onClose={()=>setDeleteUser(null)} onConfirm={handleDelete}/>}

//       {/* ── PAGE HEADER ── */}
//       <div className="bg-white/70 backdrop-blur-md border-b border-slate-100">
//         <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-5">
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//             <div className="flex items-center gap-4">
//               <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white text-xl shadow-lg shadow-blue-200 flex-shrink-0">
//                 <FaUsers className="w-5 h-5"/>
//               </div>
//               <div>
//                 <h1 className="text-xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
//                   Users
//                   <span className="hidden sm:inline text-xs bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">
//                     {users.length} total
//                   </span>
//                 </h1>
//                 <p className="text-sm text-slate-400 mt-0.5">
//                   Manage staff accounts, roles &amp; permissions
//                   <span className="hidden sm:inline ml-3 text-slate-300">|</span>
//                   <span className="hidden sm:inline ml-3 text-xs">
//                     <span className="hover:text-blue-600 cursor-pointer transition-colors" onClick={()=>navigate("/")}>Home</span>
//                     <span className="mx-1 text-slate-300">/</span>
//                     <span className="text-blue-600 font-bold">Users</span>
//                   </span>
//                 </p>
//               </div>
//             </div>

//             {/* ── ADD NEW USER → navigates to /CreateUser ── */}
//             <button onClick={()=>navigate("/CreateUser")}
//               className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold
//                 shadow-md shadow-blue-200 hover:shadow-lg transition-all">
//               <FiUserPlus className="w-4 h-4"/> Add New User
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6 space-y-6">

//         {/* ── STAT CARDS ── */}
//         <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
//           {[
//             { icon:FaUsers,      label:"Total Users",    value:stats.total,    gradient:"from-cyan-500 to-cyan-600",     delay:0   },
//             { icon:FaUserCheck,  label:"Active Users",   value:stats.active,   gradient:"from-green-500 to-emerald-600", delay:60  },
//             { icon:FaUserTimes,  label:"Inactive Users", value:stats.inactive, gradient:"from-slate-500 to-slate-600",   delay:120 },
//             { icon:FaUserShield, label:"Admins",         value:stats.admins,   gradient:"from-purple-500 to-purple-600", delay:180 },
//           ].map(c=>(
//             <div key={c.label} className="fade-up" style={{animationDelay:`${c.delay}ms`}}>
//               <StatCard {...c}/>
//             </div>
//           ))}
//         </div>

//         {/* ── USER LIST CARD ── */}
//         <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">

//           {/* List header */}
//           <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
//             <div className="flex items-center gap-3">
//               <h2 className="text-base font-extrabold text-slate-700">User List</h2>
//               <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2.5 py-1 rounded-full">
//                 {filtered.length} results
//               </span>
//             </div>
//             <button onClick={()=>navigate("/CreateUser")}
//               className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-200 transition-all">
//               <FiUserPlus className="w-3.5 h-3.5"/> Add New User
//             </button>
//           </div>

//           {/* Search + Status filter tabs */}
//           <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/60">
//             <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
//               <div className="relative flex-1 min-w-[200px]">
//                 <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/>
//                 <input value={search} onChange={e=>{ setSearch(e.target.value); setPage(1); }}
//                   placeholder="Search by name, username, email, ID..."
//                   className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 placeholder-slate-400
//                     focus:border-blue-400 focus:ring-2 focus:ring-blue-50 outline-none transition-all"/>
//               </div>

//               <div className="flex rounded-xl border border-slate-200 overflow-hidden flex-shrink-0">
//                 {["Active","Inactive","All"].map(tab=>(
//                   <button key={tab} onClick={()=>{ setActiveTab(tab); setPage(1); }}
//                     className={`px-4 py-2.5 text-xs font-bold transition-all whitespace-nowrap
//                       ${activeTab===tab
//                         ? tab==="Active"    ? "bg-emerald-500 text-white"
//                           : tab==="Inactive" ? "bg-slate-500 text-white"
//                           : "bg-blue-600 text-white"
//                         : "bg-white text-slate-500 hover:bg-slate-50"}`}>
//                     {tab}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* ── DESKTOP TABLE ── */}
//           <div className="hidden lg:block overflow-x-auto">
//             <table className="w-full min-w-[900px]">
//               <thead className="bg-slate-50/80 border-b border-slate-100">
//                 <tr>
//                   {["ID","Username","Full Name","Email","Role","Status","Last Login","Created","Actions"].map(h=>(
//                     <th key={h} className="px-4 py-3.5 text-left text-xs font-extrabold text-slate-500 uppercase tracking-wider whitespace-nowrap">
//                       {h}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-50">
//                 {loading
//                   ? [...Array(5)].map((_,i)=><SkeletonRow key={i}/>)
//                   : pageData.length===0
//                   ? (
//                     <tr>
//                       <td colSpan={9} className="text-center py-20">
//                         <div className="text-5xl mb-3">👥</div>
//                         <p className="text-base font-extrabold text-slate-600 mb-1">No Users Found</p>
//                         <p className="text-sm text-slate-400 mb-4">
//                           {search||activeTab!=="All"
//                             ? "Try adjusting your search or filters."
//                             : "Add your first user to get started."}
//                         </p>
//                         {search||activeTab!=="All"
//                           ? <button onClick={()=>{ setSearch(""); setActiveTab("All"); }}
//                               className="px-4 py-2 rounded-xl bg-blue-50 text-blue-600 font-bold text-sm hover:bg-blue-100 transition-all">
//                               Clear Filters
//                             </button>
//                           : <button onClick={()=>navigate("/CreateUser")}
//                               className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm shadow-md hover:bg-blue-700 transition-all flex items-center gap-2 mx-auto">
//                               <FiUserPlus/> Add First User
//                             </button>}
//                       </td>
//                     </tr>
//                   )
//                   : pageData.map((u,idx)=>{
//                     const rc = ROLE_CFG[u.role]    || ROLE_CFG.Staff;
//                     const sc = STATUS_CFG[u.status] || STATUS_CFG.Inactive;
//                     return (
//                       <tr key={u.id}
//                         className="group transition-all duration-150 hover:bg-blue-50/40 hover:shadow-[inset_3px_0_0_#2563eb]"
//                         style={{animation:"fadeUp .35s ease both", animationDelay:`${idx*30}ms`}}>

//                         {/* ID */}
//                         <td className="px-4 py-3.5">
//                           <span className="text-xs font-extrabold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">{u.id}</span>
//                         </td>

//                         {/* Username + avatar */}
//                         <td className="px-4 py-3.5">
//                           <div className="flex items-center gap-2.5">
//                             <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${avatarGrad(u.id)} flex items-center justify-center text-white text-xs font-extrabold flex-shrink-0`}>
//                               {initials(u.fullName)}
//                             </div>
//                             <span className="text-sm font-bold text-blue-600">{u.username}</span>
//                           </div>
//                         </td>

//                         {/* Full Name */}
//                         <td className="px-4 py-3.5">
//                           <p className="text-sm font-semibold text-slate-800">{u.fullName}</p>
//                         </td>

//                         {/* Email */}
//                         <td className="px-4 py-3.5">
//                           <p className="text-sm text-slate-600 truncate max-w-[200px]">{u.email}</p>
//                         </td>

//                         {/* Role */}
//                         <td className="px-4 py-3.5">
//                           <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${rc.border} ${rc.bg} ${rc.text}`}>
//                             {u.role}
//                           </span>
//                         </td>

//                         {/* Status */}
//                         <td className="px-4 py-3.5">
//                           <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1.5 rounded-full ${sc.bg} ${sc.text}`}>
//                             <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`}/>
//                             {u.status}
//                           </span>
//                         </td>

//                         {/* Last Login */}
//                         <td className="px-4 py-3.5">
//                           <p className="text-xs text-slate-500 font-medium">{u.lastLogin}</p>
//                         </td>

//                         {/* Created */}
//                         <td className="px-4 py-3.5">
//                           <p className="text-xs text-slate-500 font-medium">{u.createdAt}</p>
//                         </td>

//                         {/* Actions */}
//                         <td className="px-4 py-3.5">
//                           <div className="flex items-center gap-1.5 opacity-70 group-hover:opacity-100 transition-opacity">
//                             {/* ── EDIT → navigates to /EditUser/:id ── */}
//                             <button onClick={()=>navigate(`/EditUser/${u.id}`)} title="Edit User"
//                               className="w-8 h-8 rounded-lg bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center transition-all text-sm shadow-sm">
//                               <FiEdit2 className="w-3.5 h-3.5"/>
//                             </button>

//                             {/* DELETE → inline modal */}
//                             <button onClick={()=>setDeleteUser(u)} title="Delete User"
//                               className="w-8 h-8 rounded-lg bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-all text-sm shadow-sm">
//                               <FiTrash2 className="w-3.5 h-3.5"/>
//                             </button>

//                             {/* MANAGE PERMISSIONS → navigates to /UserPermissions/:id */}
//                             <button onClick={()=>navigate(`/UserPermissions/${u.id}`)} title="Manage Permissions"
//                               className="w-8 h-8 rounded-lg bg-teal-500 hover:bg-teal-600 text-white flex items-center justify-center transition-all text-sm shadow-sm">
//                               <FiShield className="w-3.5 h-3.5"/>
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     );
//                   })}
//               </tbody>
//             </table>
//           </div>

//           {/* ── MOBILE CARDS ── */}
//           <div className="lg:hidden p-4 space-y-3">
//             {loading
//               ? [...Array(4)].map((_,i)=>(
//                   <div key={i} className="bg-white rounded-2xl border border-slate-100 p-4 space-y-3">
//                     {[...Array(3)].map((_,j)=>(
//                       <div key={j} className="h-4 rounded-lg bg-slate-200 animate-pulse" style={{width:`${40+Math.random()*50}%`}}/>
//                     ))}
//                   </div>
//                 ))
//               : pageData.length===0
//               ? (
//                 <div className="text-center py-14">
//                   <div className="text-5xl mb-3">👥</div>
//                   <p className="text-base font-extrabold text-slate-600 mb-1">No Users Found</p>
//                   <p className="text-sm text-slate-400 mb-4">
//                     {search||activeTab!=="All" ? "Adjust filters." : "Add your first user."}
//                   </p>
//                   {!search&&activeTab==="All"&&(
//                     <button onClick={()=>navigate("/CreateUser")}
//                       className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm">
//                       + Add User
//                     </button>
//                   )}
//                 </div>
//               )
//               : pageData.map((u,idx)=>{
//                 const rc = ROLE_CFG[u.role]    || ROLE_CFG.Staff;
//                 const sc = STATUS_CFG[u.status] || STATUS_CFG.Inactive;
//                 return (
//                   <div key={u.id}
//                     className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-3 fade-up"
//                     style={{animationDelay:`${idx*40}ms`}}>
//                     <div className="flex items-start justify-between">
//                       <div className="flex items-center gap-3">
//                         <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${avatarGrad(u.id)} flex items-center justify-center text-white text-sm font-extrabold flex-shrink-0`}>
//                           {initials(u.fullName)}
//                         </div>
//                         <div>
//                           <p className="font-extrabold text-slate-800 text-sm">{u.fullName}</p>
//                           <p className="text-xs font-bold text-blue-600">{u.username}</p>
//                           <p className="text-xs text-slate-400">#{u.id}</p>
//                         </div>
//                       </div>
//                       <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${sc.bg} ${sc.text}`}>
//                         <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`}/>{u.status}
//                       </span>
//                     </div>

//                     <div className="grid grid-cols-2 gap-2 text-xs">
//                       <div className="bg-slate-50 rounded-lg px-3 py-2">
//                         <p className="text-slate-400">Email</p>
//                         <p className="font-bold text-slate-700 truncate">{u.email}</p>
//                       </div>
//                       <div className="bg-slate-50 rounded-lg px-3 py-2">
//                         <p className="text-slate-400">Role</p>
//                         <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${rc.border} ${rc.bg} ${rc.text}`}>{u.role}</span>
//                       </div>
//                       <div className="bg-slate-50 rounded-lg px-3 py-2">
//                         <p className="text-slate-400">Last Login</p>
//                         <p className="font-bold text-slate-700">{u.lastLogin}</p>
//                       </div>
//                       <div className="bg-slate-50 rounded-lg px-3 py-2">
//                         <p className="text-slate-400">Created</p>
//                         <p className="font-bold text-slate-700">{u.createdAt}</p>
//                       </div>
//                     </div>

//                     <div className="flex gap-2">
//                       {/* Edit → navigate to EditUser page */}
//                       <button onClick={()=>navigate(`/EditUser/${u.id}`)}
//                         className="flex-1 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all">
//                         <FiEdit2 className="w-3 h-3"/> Edit
//                       </button>

//                       {/* Manage Permissions → navigate to /UserPermissions/:id */}
//                       <button onClick={()=>navigate(`/UserPermissions/${u.id}`)}
//                         className="flex-1 py-2 rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all">
//                         <FiShield className="w-3 h-3"/> Permissions
//                       </button>

//                       {/* Delete → inline modal */}
//                       <button onClick={()=>setDeleteUser(u)}
//                         className="w-9 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-bold flex items-center justify-center transition-all">
//                         <FiTrash2 className="w-3.5 h-3.5"/>
//                       </button>
//                     </div>
//                   </div>
//                 );
//               })}
//           </div>

//           {/* ── PAGINATION ── */}
//           {filtered.length > 0 && (
//             <div className="px-5 py-4 border-t border-slate-100 bg-slate-50/60 flex flex-col sm:flex-row items-center justify-between gap-3">
//               <p className="text-xs text-slate-400 font-medium">
//                 Showing{" "}
//                 <span className="font-bold text-slate-600">{(page-1)*perPage+1}</span>–
//                 <span className="font-bold text-slate-600">{Math.min(page*perPage,filtered.length)}</span>
//                 {" "}of{" "}
//                 <span className="font-bold text-slate-600">{filtered.length}</span> users
//               </p>
//               <div className="flex items-center gap-1.5">
//                 <button disabled={page===1} onClick={()=>setPage(1)}
//                   className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-600 text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center">
//                   <FaAngleDoubleLeft className="text-xs"/>
//                 </button>
//                 <button disabled={page===1} onClick={()=>setPage(p=>p-1)}
//                   className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-600 text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center">
//                   <FiChevronLeft className="text-xs"/>
//                 </button>
//                 {Array.from({length:totalPages},(_,i)=>i+1)
//                   .filter(p=>p===1||p===totalPages||Math.abs(p-page)<=1)
//                   .reduce((acc,p,i,arr)=>{ if(i>0&&p-arr[i-1]>1) acc.push("…"); acc.push(p); return acc; },[])
//                   .map((p,i)=>
//                     typeof p==="string"
//                       ? <span key={`e${i}`} className="w-8 h-8 flex items-center justify-center text-xs text-slate-400">…</span>
//                       : <button key={p} onClick={()=>setPage(p)}
//                           className={`w-8 h-8 rounded-lg text-xs font-bold transition-all border
//                             ${page===p
//                               ?"bg-blue-600 border-blue-600 text-white shadow-sm"
//                               :"bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600"}`}>
//                           {p}
//                         </button>
//                   )}
//                 <button disabled={page===totalPages} onClick={()=>setPage(p=>p+1)}
//                   className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-600 text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center">
//                   <FiChevronRight className="text-xs"/>
//                 </button>
//                 <button disabled={page===totalPages} onClick={()=>setPage(totalPages)}
//                   className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-600 text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center">
//                   <FaAngleDoubleRight className="text-xs"/>
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* ── FOOTER ── */}
//       <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-4 mt-4 border-t border-slate-200
//         flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
//         <p>Copyright © {new Date().getFullYear()} <span className="text-blue-600 font-semibold">Tripotomize.</span> All rights reserved.</p>
//         <p>Version 1.0.0</p>
//       </div>
//     </div>
//   );
// }



// src/components/Users/Users.jsx
// ─────────────────────────────────────────────────────────────
// Users Page — Travel CRM
// UPDATED:
//   - "Add New User" button → navigates to /CreateUser
//   - Edit button → navigates to /EditUser/:id
//   - Add/Edit modals REMOVED (now separate pages)
//   - Delete confirm modal KEPT (inline, no need for a page)
//   - Reset password modal KEPT (inline)
// ─────────────────────────────────────────────────────────────

// import { useState, useMemo, useEffect, useCallback } from "react";
// import { useNavigate } from "react-router-dom";

// import {
//   FiUsers, FiUserPlus, FiSearch, FiEdit2, FiTrash2,
//   FiKey, FiEye, FiEyeOff, FiCheckCircle, FiXCircle,
//   FiAlertCircle, FiChevronLeft, FiChevronRight, FiShield,
// } from "react-icons/fi";
// import {
//   FaUsers, FaUserCheck, FaUserTimes, FaUserShield,
//   FaAngleDoubleLeft, FaAngleDoubleRight,
// } from "react-icons/fa";

// import userService from "../services/profileUserService";

// /* Users are loaded from the API — see profileUserService.getAll(). */

// const AVATAR_GRADS = [
//   "from-blue-500 to-blue-600","from-purple-500 to-purple-600",
//   "from-teal-500 to-teal-600","from-rose-500 to-rose-600",
//   "from-amber-500 to-amber-600","from-indigo-500 to-indigo-600",
//   "from-green-500 to-green-600","from-cyan-500 to-cyan-600",
// ];

// const initials = (name="") =>
//   name.trim().split(" ").filter(Boolean).map(w=>w[0]).join("").slice(0,2).toUpperCase()||"U";
// // id is a UUID string — hash it to a stable gradient index.
// const avatarGrad = (id) => {
//   const s = String(id || "");
//   let h = 0;
//   for (let i = 0; i < s.length; i++) h = (h + s.charCodeAt(i)) % AVATAR_GRADS.length;
//   return AVATAR_GRADS[h];
// };

// const ROLE_CFG = {
//   "Organization Admin": { bg:"bg-purple-100", text:"text-purple-700", border:"border-purple-200" },
//   Manager:        { bg:"bg-indigo-100", text:"text-indigo-700", border:"border-indigo-200" },
//   "Travel Agent": { bg:"bg-blue-100",   text:"text-blue-700",   border:"border-blue-200"   },
//   Staff:          { bg:"bg-slate-100",  text:"text-slate-700",  border:"border-slate-200"  },
//   Account:        { bg:"bg-amber-100",  text:"text-amber-700",  border:"border-amber-200"  },
// };
// const STATUS_CFG = {
//   Active:   { bg:"bg-emerald-100", text:"text-emerald-700", dot:"bg-emerald-500" },
//   Inactive: { bg:"bg-slate-100",   text:"text-slate-500",   dot:"bg-slate-400"   },
// };

// const PASSWORD_RULES = [
//   { id:"len",   label:"At least 6 characters",     test:(p)=>p.length>=6             },
//   { id:"upper", label:"At least one uppercase",     test:(p)=>/[A-Z]/.test(p)        },
//   { id:"lower", label:"At least one lowercase",     test:(p)=>/[a-z]/.test(p)        },
//   { id:"num",   label:"At least one number",        test:(p)=>/[0-9]/.test(p)        },
//   { id:"spec",  label:"At least one special char",  test:(p)=>/[^A-Za-z0-9]/.test(p) },
// ];

// /* ─── TOAST ──────────────────────────────────────────────────── */
// function Toast({ msg, type, onClose }) {
//   useEffect(()=>{ const t=setTimeout(onClose,3500); return()=>clearTimeout(t); },[onClose]);
//   return (
//     <div className={`fixed top-5 right-5 z-[999] flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl max-w-xs
//       ${type==="success"?"bg-green-50 border-green-200 text-green-800":"bg-red-50 border-red-200 text-red-800"}`}
//       style={{animation:"slideIn .3s ease both"}}>
//       <span className="text-lg">{type==="success"?"✅":"❌"}</span>
//       <p className="text-sm font-semibold flex-1">{msg}</p>
//       <button onClick={onClose} className="opacity-50 hover:opacity-100 text-lg ml-1">×</button>
//     </div>
//   );
// }

// /* ─── STAT CARD ──────────────────────────────────────────────── */
// function StatCard({ icon:Icon, label, value, gradient, sub, delay=0 }) {
//   const [displayed, setDisplayed] = useState(0);
//   useEffect(()=>{
//     if(!value){ setDisplayed(0); return; }
//     let s=0; const step=Math.max(1,Math.ceil(value/50));
//     const iv=setInterval(()=>{ s=Math.min(s+step,value); setDisplayed(s); if(s>=value)clearInterval(iv); },16);
//     return()=>clearInterval(iv);
//   },[value]);
//   return (
//     <div className={`bg-gradient-to-br ${gradient} rounded-2xl p-5 text-white shadow-lg relative overflow-hidden group
//       hover:-translate-y-1 hover:shadow-xl transition-all duration-300 cursor-pointer`}
//       style={{animationDelay:`${delay}ms`}}>
//       <div className="absolute -right-5 -top-5 w-24 h-24 rounded-full bg-white/10 group-hover:scale-110 transition-transform duration-300"/>
//       <div className="absolute -right-3 -bottom-8 w-32 h-32 rounded-full bg-white/10"/>
//       <div className="relative z-10">
//         <div className="flex items-start justify-between mb-3">
//           <div className="w-10 h-10 rounded-xl bg-white/20 group-hover:bg-white/30 flex items-center justify-center transition-all">
//             <Icon className="w-5 h-5"/>
//           </div>
//           {sub&&<span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded-full">{sub}</span>}
//         </div>
//         <p className="text-2xl sm:text-3xl font-extrabold leading-none mb-1">{displayed}</p>
//         <p className="text-xs font-bold uppercase tracking-widest opacity-80">{label}</p>
//       </div>
//     </div>
//   );
// }

// /* ─── SKELETON ROW ───────────────────────────────────────────── */
// function SkeletonRow() {
//   return (
//     <tr>
//       {[...Array(9)].map((_,i)=>(
//         <td key={i} className="px-4 py-4">
//           <div className="h-4 rounded-lg bg-slate-200 animate-pulse" style={{width:`${40+Math.random()*50}%`}}/>
//         </td>
//       ))}
//     </tr>
//   );
// }

// /* ─── DELETE CONFIRM MODAL — kept inline ─────────────────────── */
// function DeleteConfirm({ user, onClose, onConfirm }) {
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
//       onClick={e=>e.target===e.currentTarget&&onClose()}>
//       <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}/>
//       <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm z-10 p-6 text-center"
//         style={{animation:"popIn .25s ease both"}}>
//         <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-3xl mx-auto mb-4">🗑️</div>
//         <h3 className="text-lg font-extrabold text-slate-800 mb-1">Delete User?</h3>
//         <p className="text-sm text-slate-500 mb-5">
//           Are you sure you want to delete{" "}
//           <span className="font-bold text-slate-700">{user?.fullName}</span>?
//           This action cannot be undone.
//         </p>
//         <div className="flex gap-3">
//           <button onClick={onClose}
//             className="flex-1 py-2.5 rounded-xl border-2 border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all">
//             Cancel
//           </button>
//           <button onClick={onConfirm}
//             className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md shadow-red-200 transition-all">
//             Yes, Delete
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ─── RESET PASSWORD MODAL — kept inline ─────────────────────── */
// function ResetPasswordModal({ user, onClose, showToast }) {
//   const [newPass, setNewPass] = useState("");
//   const [confirm, setConfirm] = useState("");
//   const [showP,   setShowP]   = useState(false);
//   const [showC,   setShowC]   = useState(false);
//   const [errs,    setErrs]    = useState({});
//   const [saving,  setSaving]  = useState(false);
  

//   const ruleResults = PASSWORD_RULES.map(r=>({ ...r, passed:r.test(newPass) }));
//   const allPassed   = ruleResults.every(r=>r.passed);

//   const handleReset = async () => {
//     const e={};
//     if(!newPass)              e.newPass="Password is required";
//     if(!allPassed)            e.newPass="Password does not meet all requirements";
//     if(!confirm)              e.confirm="Please confirm the password";
//     if(newPass!==confirm)     e.confirm="Passwords do not match";
//     if(Object.keys(e).length){ setErrs(e); return; }
    
//     setSaving(true);

// try {
//   await userService.resetPassword(
//     user.id,
//     newPass,
//     confirm
//   );

//   showToast(
//     `Password for ${user.fullName} reset successfully.`
//   );

//   onClose();
// } catch (err) {
//   showToast(
//     err?.response?.data?.message ||
//     "Failed to reset password.",
//     "error"
//   );
// } finally {
//   setSaving(false);
// }
// };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
//       onClick={e=>e.target===e.currentTarget&&onClose()}>
//       <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}/>
//       <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md z-10"
//         style={{animation:"popIn .25s ease both"}}>
//         <div className="bg-gradient-to-r from-teal-600 to-teal-500 px-6 py-5 rounded-t-2xl flex items-center justify-between">
//           <div>
//             <h2 className="text-white font-extrabold text-lg flex items-center gap-2">
//               <FiKey className="w-4 h-4"/> Reset Password
//             </h2>
//             <p className="text-white/70 text-xs mt-0.5">Reset password for {user?.fullName}</p>
//           </div>
//           <button onClick={onClose}
//             className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center text-lg transition-all">
//             ×
//           </button>
//         </div>
//         <div className="p-6 space-y-4">
//           {/* New Password */}
//           <div>
//             <label className="block text-xs font-extrabold text-slate-600 uppercase tracking-wide mb-1.5">
//               New Password <span className="text-red-500">*</span>
//             </label>
//             <div className="relative">
//               <input
//                 type={showP?"text":"password"}
//                 value={newPass}
//                 onChange={e=>{ setNewPass(e.target.value); setErrs(p=>({...p,newPass:""})); }}
//                 className={`w-full px-3.5 py-2.5 pr-11 rounded-xl border text-sm text-slate-700 placeholder-slate-400
//                   focus:outline-none focus:ring-2 transition-all bg-white
//                   ${errs.newPass?"border-red-300 focus:border-red-400 focus:ring-red-50":"border-slate-200 focus:border-blue-400 focus:ring-blue-50"}`}
//                 placeholder="Min 6 characters"
//               />
//               <button type="button" onClick={()=>setShowP(v=>!v)}
//                 className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
//                 {showP?<FiEyeOff className="w-4 h-4"/>:<FiEye className="w-4 h-4"/>}
//               </button>
//             </div>
//             {errs.newPass&&<p className="mt-1 text-xs text-red-500 flex items-center gap-1"><FiAlertCircle className="w-3 h-3"/>{errs.newPass}</p>}
//           </div>

//           {/* Confirm Password */}
//           <div>
//             <label className="block text-xs font-extrabold text-slate-600 uppercase tracking-wide mb-1.5">
//               Confirm Password <span className="text-red-500">*</span>
//             </label>
//             <div className="relative">
//               <input
//                 type={showC?"text":"password"}
//                 value={confirm}
//                 onChange={e=>{ setConfirm(e.target.value); setErrs(p=>({...p,confirm:""})); }}
//                 className={`w-full px-3.5 py-2.5 pr-11 rounded-xl border text-sm text-slate-700 placeholder-slate-400
//                   focus:outline-none focus:ring-2 transition-all bg-white
//                   ${errs.confirm?"border-red-300 focus:border-red-400 focus:ring-red-50":"border-slate-200 focus:border-blue-400 focus:ring-blue-50"}`}
//                 placeholder="Re-enter password"
//               />
//               <button type="button" onClick={()=>setShowC(v=>!v)}
//                 className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
//                 {showC?<FiEyeOff className="w-4 h-4"/>:<FiEye className="w-4 h-4"/>}
//               </button>
//             </div>
//             {errs.confirm&&<p className="mt-1 text-xs text-red-500 flex items-center gap-1"><FiAlertCircle className="w-3 h-3"/>{errs.confirm}</p>}
//           </div>

//           {/* Requirements checklist */}
//           {newPass && (
//             <div className="bg-slate-50 rounded-xl border border-slate-200 px-4 py-3">
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
//                 {ruleResults.map(r=>(
//                   <div key={r.id} className="flex items-center gap-2">
//                     {r.passed
//                       ? <FiCheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0"/>
//                       : <FiXCircle    className="w-3.5 h-3.5 text-red-400    flex-shrink-0"/>}
//                     <span className={`text-xs ${r.passed?"text-emerald-600 font-semibold":"text-slate-500"}`}>
//                       {r.label}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           <div className="flex gap-3 pt-1">
//             <button onClick={onClose}
//               className="flex-1 py-2.5 rounded-xl border-2 border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all">
//               Cancel
//             </button>
//             <button onClick={handleReset} disabled={saving}
//               className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm
//                 shadow-md shadow-teal-200 transition-all disabled:opacity-60 flex items-center justify-center gap-2">
//               {saving
//                 ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/>
//                 : <FiKey className="w-4 h-4"/>}
//               {saving?"Resetting…":"Reset Password"}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ─── MAIN PAGE ──────────────────────────────────────────────── */
// export default function Users() {
//   const navigate = useNavigate();

//   const [users,      setUsers]      = useState([]);
//   const [search,     setSearch]     = useState("");
//   const [activeTab,  setActiveTab]  = useState("All");
//   const [loading,    setLoading]    = useState(true);
//   const [toast,      setToast]      = useState(null);
//   const [page,       setPage]       = useState(1);
//   const perPage = 8;

//   // Only delete + reset modals remain inline
//   const [deleteUser, setDeleteUser] = useState(null);

//   const showToast = useCallback((msg, type="success")=>setToast({msg,type}),[]);

//   useEffect(() => {
//   setLoading(true);

//   userService
//     .getAll()
//     .then((res) => {
//       setUsers(res.data);
//     })
//     .catch(() => {
//       showToast("Failed to load users.", "error");
//     })
//     .finally(() => {
//       setLoading(false);
//     });
// }, [showToast]);

  

//   /* stats */
//   const stats = useMemo(()=>({
//     total:    users.length,
//     active:   users.filter(u=>u.status==="Active").length,
//     inactive: users.filter(u=>u.status==="Inactive").length,
//     admins:   users.filter(u=>u.role==="Organization Admin").length,
//   }),[users]);

//   /* filtered list */
//   const filtered = useMemo(()=>{
//     let out = [...users];
//     const q = search.toLowerCase();
//     if(q) out = out.filter(u=>
//       (u.username || "").toLowerCase().includes(q)||
//       (u.username || "").toLowerCase().includes(q)||
//       (u.email || "").toLowerCase().includes(q)||
//       String(u.id).includes(q)
//     );
//     if(activeTab==="Active")   out = out.filter(u=>u.status==="Active");
//     if(activeTab==="Inactive") out = out.filter(u=>u.status==="Inactive");
//     return out;
//   },[users,search,activeTab]);

//   const totalPages = Math.max(1,Math.ceil(filtered.length/perPage));
//   const pageData   = filtered.slice((page-1)*perPage, page*perPage);

//   /* delete handler */
//   const handleDelete = async () => {
//   try {
//     await userService.delete(deleteUser.id);

//     setUsers((prev) =>
//       prev.filter((u) => u.id !== deleteUser.id)
//     );

//     showToast(
//       `"${deleteUser.fullName}" deleted.`
//     );
//   } catch (err) {
//     showToast(
//       err?.response?.data?.message ||
//       "Failed to delete user.",
//       "error"
//     );
//   } finally {
//     setDeleteUser(null);
//   }
// };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100"
//       style={{fontFamily:"'Plus Jakarta Sans', system-ui, sans-serif"}}>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
//         @keyframes slideIn { from{transform:translateX(110%);opacity:0} to{transform:translateX(0);opacity:1} }
//         @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
//         @keyframes popIn   { from{transform:scale(.92);opacity:0} to{transform:scale(1);opacity:1} }
//         .fade-up { animation: fadeUp .4s ease both; }
//         select { -webkit-appearance:none; appearance:none; }
//         ::-webkit-scrollbar{width:5px;height:5px}
//         ::-webkit-scrollbar-track{background:#f1f5f9;border-radius:99px}
//         ::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:99px}
//       `}</style>

//       {toast      && <Toast msg={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}
//       {deleteUser && <DeleteConfirm user={deleteUser} onClose={()=>setDeleteUser(null)} onConfirm={handleDelete}/>}

//       {/* ── PAGE HEADER ── */}
//       <div className="bg-white/70 backdrop-blur-md border-b border-slate-100">
//         <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-5">
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//             <div className="flex items-center gap-4">
//               <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white text-xl shadow-lg shadow-blue-200 flex-shrink-0">
//                 <FaUsers className="w-5 h-5"/>
//               </div>
//               <div>
//                 <h1 className="text-xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
//                   Users
//                   <span className="hidden sm:inline text-xs bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">
//                     {users.length} total
//                   </span>
//                 </h1>
//                 <p className="text-sm text-slate-400 mt-0.5">
//                   Manage staff accounts, roles &amp; permissions
//                   <span className="hidden sm:inline ml-3 text-slate-300">|</span>
//                   <span className="hidden sm:inline ml-3 text-xs">
//                     <span className="hover:text-blue-600 cursor-pointer transition-colors" onClick={()=>navigate("/")}>Home</span>
//                     <span className="mx-1 text-slate-300">/</span>
//                     <span className="text-blue-600 font-bold">Users</span>
//                   </span>
//                 </p>
//               </div>
//             </div>

//             {/* ── ADD NEW USER → navigates to /CreateUser ── */}
//             <button onClick={()=>navigate("/CreateUser")}
//               className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold
//                 shadow-md shadow-blue-200 hover:shadow-lg transition-all">
//               <FiUserPlus className="w-4 h-4"/> Add New User
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6 space-y-6">

//         {/* ── STAT CARDS ── */}
//         <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
//           {[
//             { icon:FaUsers,      label:"Total Users",    value:stats.total,    gradient:"from-cyan-500 to-cyan-600",     delay:0   },
//             { icon:FaUserCheck,  label:"Active Users",   value:stats.active,   gradient:"from-green-500 to-emerald-600", delay:60  },
//             { icon:FaUserTimes,  label:"Inactive Users", value:stats.inactive, gradient:"from-slate-500 to-slate-600",   delay:120 },
//             { icon:FaUserShield, label:"Admins",         value:stats.admins,   gradient:"from-purple-500 to-purple-600", delay:180 },
//           ].map(c=>(
//             <div key={c.label} className="fade-up" style={{animationDelay:`${c.delay}ms`}}>
//               <StatCard {...c}/>
//             </div>
//           ))}
//         </div>

//         {/* ── USER LIST CARD ── */}
//         <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">

//           {/* List header */}
//           <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
//             <div className="flex items-center gap-3">
//               <h2 className="text-base font-extrabold text-slate-700">User List</h2>
//               <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2.5 py-1 rounded-full">
//                 {filtered.length} results
//               </span>
//             </div>
//             <button onClick={()=>navigate("/CreateUser")}
//               className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-200 transition-all">
//               <FiUserPlus className="w-3.5 h-3.5"/> Add New User
//             </button>
//           </div>

//           {/* Search + Status filter tabs */}
//           <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/60">
//             <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
//               <div className="relative flex-1 min-w-[200px]">
//                 <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/>
//                 <input value={search} onChange={e=>{ setSearch(e.target.value); setPage(1); }}
//                   placeholder="Search by name, username, email, ID..."
//                   className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 placeholder-slate-400
//                     focus:border-blue-400 focus:ring-2 focus:ring-blue-50 outline-none transition-all"/>
//               </div>

//               <div className="flex rounded-xl border border-slate-200 overflow-hidden flex-shrink-0">
//                 {["Active","Inactive","All"].map(tab=>(
//                   <button key={tab} onClick={()=>{ setActiveTab(tab); setPage(1); }}
//                     className={`px-4 py-2.5 text-xs font-bold transition-all whitespace-nowrap
//                       ${activeTab===tab
//                         ? tab==="Active"    ? "bg-emerald-500 text-white"
//                           : tab==="Inactive" ? "bg-slate-500 text-white"
//                           : "bg-blue-600 text-white"
//                         : "bg-white text-slate-500 hover:bg-slate-50"}`}>
//                     {tab}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* ── DESKTOP TABLE ── */}
//           <div className="hidden lg:block overflow-x-auto">
//             <table className="w-full min-w-[900px]">
//               <thead className="bg-slate-50/80 border-b border-slate-100">
//                 <tr>
//                   {["ID","Username","Full Name","Email","Role","Status","Last Login","Created","Actions"].map(h=>(
//                     <th key={h} className="px-4 py-3.5 text-left text-xs font-extrabold text-slate-500 uppercase tracking-wider whitespace-nowrap">
//                       {h}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-50">
//                 {loading
//                   ? [...Array(5)].map((_,i)=><SkeletonRow key={i}/>)
//                   : pageData.length===0
//                   ? (
//                     <tr>
//                       <td colSpan={9} className="text-center py-20">
//                         <div className="text-5xl mb-3">👥</div>
//                         <p className="text-base font-extrabold text-slate-600 mb-1">No Users Found</p>
//                         <p className="text-sm text-slate-400 mb-4">
//                           {search||activeTab!=="All"
//                             ? "Try adjusting your search or filters."
//                             : "Add your first user to get started."}
//                         </p>
//                         {search||activeTab!=="All"
//                           ? <button onClick={()=>{ setSearch(""); setActiveTab("All"); }}
//                               className="px-4 py-2 rounded-xl bg-blue-50 text-blue-600 font-bold text-sm hover:bg-blue-100 transition-all">
//                               Clear Filters
//                             </button>
//                           : <button onClick={()=>navigate("/CreateUser")}
//                               className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm shadow-md hover:bg-blue-700 transition-all flex items-center gap-2 mx-auto">
//                               <FiUserPlus/> Add First User
//                             </button>}
//                       </td>
//                     </tr>
//                   )
//                   : pageData.map((u,idx)=>{
//                     const rc = ROLE_CFG[u.role]    || ROLE_CFG.Staff;
//                     const sc = STATUS_CFG[u.status] || STATUS_CFG.Inactive;
//                     return (
//                       <tr key={u.id}
//                         className="group transition-all duration-150 hover:bg-blue-50/40 hover:shadow-[inset_3px_0_0_#2563eb]"
//                         style={{animation:"fadeUp .35s ease both", animationDelay:`${idx*30}ms`}}>

//                         {/* ID */}
//                         <td className="px-4 py-3.5">
//                           <span className="text-xs font-extrabold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg" title={u.id}>{String(u.id).slice(0,8)}</span>
//                         </td>

//                         {/* Username + avatar */}
//                         <td className="px-4 py-3.5">
//                           <div className="flex items-center gap-2.5">
//                             <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${avatarGrad(u.id)} flex items-center justify-center text-white text-xs font-extrabold flex-shrink-0`}>
//                               {initials(u.fullName)}
//                             </div>
//                             <span className="text-sm font-bold text-blue-600">{u.username}</span>
//                           </div>
//                         </td>

//                         {/* Full Name */}
//                         <td className="px-4 py-3.5">
//                           <p className="text-sm font-semibold text-slate-800">{u.fullName}</p>
//                         </td>

//                         {/* Email */}
//                         <td className="px-4 py-3.5">
//                           <p className="text-sm text-slate-600 truncate max-w-[200px]">{u.email}</p>
//                         </td>

//                         {/* Role */}
//                         <td className="px-4 py-3.5">
//                           <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${rc.border} ${rc.bg} ${rc.text}`}>
//                             {u.role}
//                           </span>
//                         </td>

//                         {/* Status */}
//                         <td className="px-4 py-3.5">
//                           <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1.5 rounded-full ${sc.bg} ${sc.text}`}>
//                             <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`}/>
//                             {u.status}
//                           </span>
//                         </td>

//                         {/* Last Login */}
//                         <td className="px-4 py-3.5">
//                           <p className="text-xs text-slate-500 font-medium">{u.lastLogin}</p>
//                         </td>

//                         {/* Created */}
//                         <td className="px-4 py-3.5">
//                           <p className="text-xs text-slate-500 font-medium">{u.createdAt}</p>
//                         </td>

//                         {/* Actions */}
//                         <td className="px-4 py-3.5">
//                           <div className="flex items-center gap-1.5 opacity-70 group-hover:opacity-100 transition-opacity">
//                             {/* ── EDIT → navigates to /EditUser/:id ── */}
//                              {/* <button onClick={()=>navigate(`/EditUser`)} */}
//                             <button onClick={()=>navigate(`/EditUser/${u.id}`)}
//                              title="Edit User"
//                               className="w-8 h-8 rounded-lg bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center transition-all text-sm shadow-sm">
//                               <FiEdit2 className="w-3.5 h-3.5"/>
//                             </button>

//                             {/* DELETE → inline modal */}
//                             <button onClick={()=>setDeleteUser(u)} title="Delete User"
//                               className="w-8 h-8 rounded-lg bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-all text-sm shadow-sm">
//                               <FiTrash2 className="w-3.5 h-3.5"/>
//                             </button>

//                             {/* MANAGE PERMISSIONS → navigates to /UserPermissions/:id */}
//                             {/* <button onClick={()=>navigate(`/UserPermissions`)}  */}
//                             <button onClick={()=>navigate(`/UserPermissions/${u.id}`)} 
//                             title="Manage Permissions"
//                               className="w-8 h-8 rounded-lg bg-teal-500 hover:bg-teal-600 text-white flex items-center justify-center transition-all text-sm shadow-sm">
//                               <FiShield className="w-3.5 h-3.5"/>
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     );
//                   })}
//               </tbody>
//             </table>
//           </div>

//           {/* ── MOBILE CARDS ── */}
//           <div className="lg:hidden p-4 space-y-3">
//             {loading
//               ? [...Array(4)].map((_,i)=>(
//                   <div key={i} className="bg-white rounded-2xl border border-slate-100 p-4 space-y-3">
//                     {[...Array(3)].map((_,j)=>(
//                       <div key={j} className="h-4 rounded-lg bg-slate-200 animate-pulse" style={{width:`${40+Math.random()*50}%`}}/>
//                     ))}
//                   </div>
//                 ))
//               : pageData.length===0
//               ? (
//                 <div className="text-center py-14">
//                   <div className="text-5xl mb-3">👥</div>
//                   <p className="text-base font-extrabold text-slate-600 mb-1">No Users Found</p>
//                   <p className="text-sm text-slate-400 mb-4">
//                     {search||activeTab!=="All" ? "Adjust filters." : "Add your first user."}
//                   </p>
//                   {!search&&activeTab==="All"&&(
//                     <button onClick={()=>navigate("/CreateUser")}
//                       className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm">
//                       + Add User
//                     </button>
//                   )}
//                 </div>
//               )
//               : pageData.map((u,idx)=>{
//                 const rc = ROLE_CFG[u.role]    || ROLE_CFG.Staff;
//                 const sc = STATUS_CFG[u.status] || STATUS_CFG.Inactive;
//                 return (
//                   <div key={u.id}
//                     className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-3 fade-up"
//                     style={{animationDelay:`${idx*40}ms`}}>
//                     <div className="flex items-start justify-between">
//                       <div className="flex items-center gap-3">
//                         <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${avatarGrad(u.id)} flex items-center justify-center text-white text-sm font-extrabold flex-shrink-0`}>
//                           {initials(u.fullName)}
//                         </div>
//                         <div>
//                           <p className="font-extrabold text-slate-800 text-sm">{u.fullName}</p>
//                           <p className="text-xs font-bold text-blue-600">{u.username}</p>
//                           <p className="text-xs text-slate-400" title={u.id}>#{String(u.id).slice(0,8)}</p>
//                         </div>
//                       </div>
//                       <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${sc.bg} ${sc.text}`}>
//                         <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`}/>{u.status}
//                       </span>
//                     </div>

//                     <div className="grid grid-cols-2 gap-2 text-xs">
//                       <div className="bg-slate-50 rounded-lg px-3 py-2">
//                         <p className="text-slate-400">Email</p>
//                         <p className="font-bold text-slate-700 truncate">{u.email}</p>
//                       </div>
//                       <div className="bg-slate-50 rounded-lg px-3 py-2">
//                         <p className="text-slate-400">Role</p>
//                         <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${rc.border} ${rc.bg} ${rc.text}`}>{u.role}</span>
//                       </div>
//                       <div className="bg-slate-50 rounded-lg px-3 py-2">
//                         <p className="text-slate-400">Last Login</p>
//                         <p className="font-bold text-slate-700">{u.lastLogin}</p>
//                       </div>
//                       <div className="bg-slate-50 rounded-lg px-3 py-2">
//                         <p className="text-slate-400">Created</p>
//                         <p className="font-bold text-slate-700">{u.createdAt}</p>
//                       </div>
//                     </div>

//                     <div className="flex gap-2">
//                       {/* Edit → navigate to EditUser page */}
//                       {/* <button onClick={()=>navigate(`/EditUser`)} */}
//                       <button onClick={()=>navigate(`/EditUser/${u.id}`)}
//                         className="flex-1 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all">
//                         <FiEdit2 className="w-3 h-3"/> Edit
//                       </button>

//                       {/* Manage Permissions → navigate to /UserPermissions/:id */}
//                       {/* <button onClick={()=>navigate(`/UserPermissions`)} */}
//                       <button onClick={()=>navigate(`/UserPermissions/${u.id}`)}
//                         className="flex-1 py-2 rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all">
//                         <FiShield className="w-3 h-3"/> Permissions
//                       </button>

//                       {/* Delete → inline modal */}
//                       <button onClick={()=>setDeleteUser(u)}
//                         className="w-9 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-bold flex items-center justify-center transition-all">
//                         <FiTrash2 className="w-3.5 h-3.5"/>
//                       </button>
//                     </div>
//                   </div>
//                 );
//               })}
//           </div>

//           {/* ── PAGINATION ── */}
//           {filtered.length > 0 && (
//             <div className="px-5 py-4 border-t border-slate-100 bg-slate-50/60 flex flex-col sm:flex-row items-center justify-between gap-3">
//               <p className="text-xs text-slate-400 font-medium">
//                 Showing{" "}
//                 <span className="font-bold text-slate-600">{(page-1)*perPage+1}</span>–
//                 <span className="font-bold text-slate-600">{Math.min(page*perPage,filtered.length)}</span>
//                 {" "}of{" "}
//                 <span className="font-bold text-slate-600">{filtered.length}</span> users
//               </p>
//               <div className="flex items-center gap-1.5">
//                 <button disabled={page===1} onClick={()=>setPage(1)}
//                   className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-600 text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center">
//                   <FaAngleDoubleLeft className="text-xs"/>
//                 </button>
//                 <button disabled={page===1} onClick={()=>setPage(p=>p-1)}
//                   className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-600 text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center">
//                   <FiChevronLeft className="text-xs"/>
//                 </button>
//                 {Array.from({length:totalPages},(_,i)=>i+1)
//                   .filter(p=>p===1||p===totalPages||Math.abs(p-page)<=1)
//                   .reduce((acc,p,i,arr)=>{ if(i>0&&p-arr[i-1]>1) acc.push("…"); acc.push(p); return acc; },[])
//                   .map((p,i)=>
//                     typeof p==="string"
//                       ? <span key={`e${i}`} className="w-8 h-8 flex items-center justify-center text-xs text-slate-400">…</span>
//                       : <button key={p} onClick={()=>setPage(p)}
//                           className={`w-8 h-8 rounded-lg text-xs font-bold transition-all border
//                             ${page===p
//                               ?"bg-blue-600 border-blue-600 text-white shadow-sm"
//                               :"bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600"}`}>
//                           {p}
//                         </button>
//                   )}
//                 <button disabled={page===totalPages} onClick={()=>setPage(p=>p+1)}
//                   className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-600 text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center">
//                   <FiChevronRight className="text-xs"/>
//                 </button>
//                 <button disabled={page===totalPages} onClick={()=>setPage(totalPages)}
//                   className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-600 text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center">
//                   <FaAngleDoubleRight className="text-xs"/>
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }



// src/components/Users/Users.jsx
// ─────────────────────────────────────────────────────────────
// Users Page — Travel CRM
// UPDATED:
//   - "Add New User" button → navigates to /CreateUser
//   - Edit button → navigates to /EditUser/:id
//   - Add/Edit modals REMOVED (now separate pages)
//   - Delete confirm modal KEPT (inline, no need for a page)
//   - Reset password modal KEPT (inline)
// ─────────────────────────────────────────────────────────────

import { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import {
  FiUsers, FiUserPlus, FiSearch, FiEdit2, FiTrash2,
  FiKey, FiEye, FiEyeOff, FiCheckCircle, FiXCircle,
  FiAlertCircle, FiChevronLeft, FiChevronRight, FiShield,
} from "react-icons/fi";
import {
  FaUsers, FaUserCheck, FaUserTimes, FaUserShield,
  FaAngleDoubleLeft, FaAngleDoubleRight,
} from "react-icons/fa";

import userService from "../services/profileUserService";
import { hasPermission, P } from "../services/access";

/* Users are loaded from the API — see profileUserService.getAll(). */

const AVATAR_GRADS = [
  "from-blue-500 to-blue-600","from-purple-500 to-purple-600",
  "from-teal-500 to-teal-600","from-rose-500 to-rose-600",
  "from-amber-500 to-amber-600","from-indigo-500 to-indigo-600",
  "from-green-500 to-green-600","from-cyan-500 to-cyan-600",
];

const initials = (name="") =>
  name.trim().split(" ").filter(Boolean).map(w=>w[0]).join("").slice(0,2).toUpperCase()||"U";
// id is a UUID string — hash it to a stable gradient index.
const avatarGrad = (id) => {
  const s = String(id || "");
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h + s.charCodeAt(i)) % AVATAR_GRADS.length;
  return AVATAR_GRADS[h];
};

const ROLE_CFG = {
  "Organization Admin": { bg:"bg-purple-100", text:"text-purple-700", border:"border-purple-200" },
  Manager:        { bg:"bg-indigo-100", text:"text-indigo-700", border:"border-indigo-200" },
  "Travel Agent": { bg:"bg-blue-100",   text:"text-blue-700",   border:"border-blue-200"   },
  Staff:          { bg:"bg-slate-100",  text:"text-slate-700",  border:"border-slate-200"  },
  Account:        { bg:"bg-amber-100",  text:"text-amber-700",  border:"border-amber-200"  },
};
const STATUS_CFG = {
  Active:   { bg:"bg-emerald-100", text:"text-emerald-700", dot:"bg-emerald-500" },
  Inactive: { bg:"bg-slate-100",   text:"text-slate-500",   dot:"bg-slate-400"   },
};

const PASSWORD_RULES = [
  { id:"len",   label:"At least 6 characters",     test:(p)=>p.length>=6             },
  { id:"upper", label:"At least one uppercase",     test:(p)=>/[A-Z]/.test(p)        },
  { id:"lower", label:"At least one lowercase",     test:(p)=>/[a-z]/.test(p)        },
  { id:"num",   label:"At least one number",        test:(p)=>/[0-9]/.test(p)        },
  { id:"spec",  label:"At least one special char",  test:(p)=>/[^A-Za-z0-9]/.test(p) },
];

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
function StatCard({ icon:Icon, label, value, gradient, sub, delay=0 }) {
  const [displayed, setDisplayed] = useState(0);
  useEffect(()=>{
    if(!value){ setDisplayed(0); return; }
    let s=0; const step=Math.max(1,Math.ceil(value/50));
    const iv=setInterval(()=>{ s=Math.min(s+step,value); setDisplayed(s); if(s>=value)clearInterval(iv); },16);
    return()=>clearInterval(iv);
  },[value]);
  return (
    <div className={`bg-gradient-to-br ${gradient} rounded-2xl p-5 text-white shadow-lg relative overflow-hidden group
      hover:-translate-y-1 hover:shadow-xl transition-all duration-300 cursor-pointer`}
      style={{animationDelay:`${delay}ms`}}>
      <div className="absolute -right-5 -top-5 w-24 h-24 rounded-full bg-white/10 group-hover:scale-110 transition-transform duration-300"/>
      <div className="absolute -right-3 -bottom-8 w-32 h-32 rounded-full bg-white/10"/>
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 group-hover:bg-white/30 flex items-center justify-center transition-all">
            <Icon className="w-5 h-5"/>
          </div>
          {sub&&<span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded-full">{sub}</span>}
        </div>
        <p className="text-2xl sm:text-3xl font-extrabold leading-none mb-1">{displayed}</p>
        <p className="text-xs font-bold uppercase tracking-widest opacity-80">{label}</p>
      </div>
    </div>
  );
}

/* ─── SKELETON ROW ───────────────────────────────────────────── */
function SkeletonRow() {
  return (
    <tr>
      {[...Array(9)].map((_,i)=>(
        <td key={i} className="px-4 py-4">
          <div className="h-4 rounded-lg bg-slate-200 animate-pulse" style={{width:`${40+Math.random()*50}%`}}/>
        </td>
      ))}
    </tr>
  );
}

/* ─── DELETE CONFIRM MODAL — kept inline ─────────────────────── */
function DeleteConfirm({ user, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}/>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm z-10 p-6 text-center"
        style={{animation:"popIn .25s ease both"}}>
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-3xl mx-auto mb-4">🗑️</div>
        <h3 className="text-lg font-extrabold text-slate-800 mb-1">Delete User?</h3>
        <p className="text-sm text-slate-500 mb-5">
          Are you sure you want to delete{" "}
          <span className="font-bold text-slate-700">{user?.fullName}</span>?
          This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border-2 border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all">
            Cancel
          </button>
          <button onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md shadow-red-200 transition-all">
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── RESET PASSWORD MODAL — kept inline ─────────────────────── */
function ResetPasswordModal({ user, onClose, showToast }) {
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showP,   setShowP]   = useState(false);
  const [showC,   setShowC]   = useState(false);
  const [errs,    setErrs]    = useState({});
  const [saving,  setSaving]  = useState(false);
  

  const ruleResults = PASSWORD_RULES.map(r=>({ ...r, passed:r.test(newPass) }));
  const allPassed   = ruleResults.every(r=>r.passed);

  const handleReset = async () => {
    const e={};
    if(!newPass)              e.newPass="Password is required";
    if(!allPassed)            e.newPass="Password does not meet all requirements";
    if(!confirm)              e.confirm="Please confirm the password";
    if(newPass!==confirm)     e.confirm="Passwords do not match";
    if(Object.keys(e).length){ setErrs(e); return; }
    
    setSaving(true);

try {
  await userService.resetPassword(
    user.id,
    newPass,
    confirm
  );

  showToast(
    `Password for ${user.fullName} reset successfully.`
  );

  onClose();
} catch (err) {
  showToast(
    err?.response?.data?.message ||
    "Failed to reset password.",
    "error"
  );
} finally {
  setSaving(false);
}
};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}/>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md z-10"
        style={{animation:"popIn .25s ease both"}}>
        <div className="bg-gradient-to-r from-teal-600 to-teal-500 px-6 py-5 rounded-t-2xl flex items-center justify-between">
          <div>
            <h2 className="text-white font-extrabold text-lg flex items-center gap-2">
              <FiKey className="w-4 h-4"/> Reset Password
            </h2>
            <p className="text-white/70 text-xs mt-0.5">Reset password for {user?.fullName}</p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center text-lg transition-all">
            ×
          </button>
        </div>
        <div className="p-6 space-y-4">
          {/* New Password */}
          <div>
            <label className="block text-xs font-extrabold text-slate-600 uppercase tracking-wide mb-1.5">
              New Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showP?"text":"password"}
                value={newPass}
                onChange={e=>{ setNewPass(e.target.value); setErrs(p=>({...p,newPass:""})); }}
                className={`w-full px-3.5 py-2.5 pr-11 rounded-xl border text-sm text-slate-700 placeholder-slate-400
                  focus:outline-none focus:ring-2 transition-all bg-white
                  ${errs.newPass?"border-red-300 focus:border-red-400 focus:ring-red-50":"border-slate-200 focus:border-blue-400 focus:ring-blue-50"}`}
                placeholder="Min 6 characters"
              />
              <button type="button" onClick={()=>setShowP(v=>!v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                {showP?<FiEyeOff className="w-4 h-4"/>:<FiEye className="w-4 h-4"/>}
              </button>
            </div>
            {errs.newPass&&<p className="mt-1 text-xs text-red-500 flex items-center gap-1"><FiAlertCircle className="w-3 h-3"/>{errs.newPass}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-extrabold text-slate-600 uppercase tracking-wide mb-1.5">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showC?"text":"password"}
                value={confirm}
                onChange={e=>{ setConfirm(e.target.value); setErrs(p=>({...p,confirm:""})); }}
                className={`w-full px-3.5 py-2.5 pr-11 rounded-xl border text-sm text-slate-700 placeholder-slate-400
                  focus:outline-none focus:ring-2 transition-all bg-white
                  ${errs.confirm?"border-red-300 focus:border-red-400 focus:ring-red-50":"border-slate-200 focus:border-blue-400 focus:ring-blue-50"}`}
                placeholder="Re-enter password"
              />
              <button type="button" onClick={()=>setShowC(v=>!v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                {showC?<FiEyeOff className="w-4 h-4"/>:<FiEye className="w-4 h-4"/>}
              </button>
            </div>
            {errs.confirm&&<p className="mt-1 text-xs text-red-500 flex items-center gap-1"><FiAlertCircle className="w-3 h-3"/>{errs.confirm}</p>}
          </div>

          {/* Requirements checklist */}
          {newPass && (
            <div className="bg-slate-50 rounded-xl border border-slate-200 px-4 py-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {ruleResults.map(r=>(
                  <div key={r.id} className="flex items-center gap-2">
                    {r.passed
                      ? <FiCheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0"/>
                      : <FiXCircle    className="w-3.5 h-3.5 text-red-400    flex-shrink-0"/>}
                    <span className={`text-xs ${r.passed?"text-emerald-600 font-semibold":"text-slate-500"}`}>
                      {r.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border-2 border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all">
              Cancel
            </button>
            <button onClick={handleReset} disabled={saving}
              className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm
                shadow-md shadow-teal-200 transition-all disabled:opacity-60 flex items-center justify-center gap-2">
              {saving
                ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/>
                : <FiKey className="w-4 h-4"/>}
              {saving?"Resetting…":"Reset Password"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── MAIN PAGE ──────────────────────────────────────────────── */
export default function Users() {
  const navigate = useNavigate();

  const [users,      setUsers]      = useState([]);
  const [search,     setSearch]     = useState("");
  const [activeTab,  setActiveTab]  = useState("All");
  const [loading,    setLoading]    = useState(true);
  const [toast,      setToast]      = useState(null);
  const [page,       setPage]       = useState(1);
  const perPage = 8;

  // Only delete + reset modals remain inline
  const [deleteUser, setDeleteUser] = useState(null);

  const showToast = useCallback((msg, type="success")=>setToast({msg,type}),[]);

  useEffect(() => {
  setLoading(true);

  userService
    .getAll()
    .then((res) => {
      setUsers(res.data);
    })
    .catch(() => {
      showToast("Failed to load users.", "error");
    })
    .finally(() => {
      setLoading(false);
    });
}, [showToast]);

  

  /* stats */
  const stats = useMemo(()=>({
    total:    users.length,
    active:   users.filter(u=>u.status==="Active").length,
    inactive: users.filter(u=>u.status==="Inactive").length,
    admins:   users.filter(u=>u.role==="Organization Admin").length,
  }),[users]);

  /* filtered list */
  const filtered = useMemo(()=>{
    let out = [...users];
    const q = search.toLowerCase();
    if(q) out = out.filter(u=>
      (u.username || "").toLowerCase().includes(q)||
      (u.username || "").toLowerCase().includes(q)||
      (u.email || "").toLowerCase().includes(q)||
      String(u.id).includes(q)
    );
    if(activeTab==="Active")   out = out.filter(u=>u.status==="Active");
    if(activeTab==="Inactive") out = out.filter(u=>u.status==="Inactive");
    return out;
  },[users,search,activeTab]);

  const totalPages = Math.max(1,Math.ceil(filtered.length/perPage));
  const pageData   = filtered.slice((page-1)*perPage, page*perPage);

  /* delete handler */
  const handleDelete = async () => {
  try {
    await userService.delete(deleteUser.id);

    setUsers((prev) =>
      prev.filter((u) => u.id !== deleteUser.id)
    );

    showToast(
      `"${deleteUser.fullName}" deleted.`
    );
  } catch (err) {
    showToast(
      err?.response?.data?.message ||
      "Failed to delete user.",
      "error"
    );
  } finally {
    setDeleteUser(null);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100"
      style={{fontFamily:"'Plus Jakarta Sans', system-ui, sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        @keyframes slideIn { from{transform:translateX(110%);opacity:0} to{transform:translateX(0);opacity:1} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes popIn   { from{transform:scale(.92);opacity:0} to{transform:scale(1);opacity:1} }
        .fade-up { animation: fadeUp .4s ease both; }
        select { -webkit-appearance:none; appearance:none; }
        ::-webkit-scrollbar{width:5px;height:5px}
        ::-webkit-scrollbar-track{background:#f1f5f9;border-radius:99px}
        ::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:99px}
      `}</style>

      {toast      && <Toast msg={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}
      {deleteUser && <DeleteConfirm user={deleteUser} onClose={()=>setDeleteUser(null)} onConfirm={handleDelete}/>}

      {/* ── PAGE HEADER ── */}
      <div className="bg-white/70 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white text-xl shadow-lg shadow-blue-200 flex-shrink-0">
                <FaUsers className="w-5 h-5"/>
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
                  Users
                  <span className="hidden sm:inline text-xs bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">
                    {users.length} total
                  </span>
                </h1>
                <p className="text-sm text-slate-400 mt-0.5">
                  Manage staff accounts, roles &amp; permissions
                  <span className="hidden sm:inline ml-3 text-slate-300">|</span>
                  <span className="hidden sm:inline ml-3 text-xs">
                    <span className="hover:text-blue-600 cursor-pointer transition-colors" onClick={()=>navigate("/")}>Home</span>
                    <span className="mx-1 text-slate-300">/</span>
                    <span className="text-blue-600 font-bold">Users</span>
                  </span>
                </p>
              </div>
            </div>

            {/* ── ADD NEW USER → navigates to /CreateUser (USER_CREATE only) ── */}
            {hasPermission(P.USER_CREATE) && (
            <button onClick={()=>navigate("/CreateUser")}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold
                shadow-md shadow-blue-200 hover:shadow-lg transition-all">
              <FiUserPlus className="w-4 h-4"/> Add New User
            </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* ── STAT CARDS ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon:FaUsers,      label:"Total Users",    value:stats.total,    gradient:"from-cyan-500 to-cyan-600",     delay:0   },
            { icon:FaUserCheck,  label:"Active Users",   value:stats.active,   gradient:"from-green-500 to-emerald-600", delay:60  },
            { icon:FaUserTimes,  label:"Inactive Users", value:stats.inactive, gradient:"from-slate-500 to-slate-600",   delay:120 },
            { icon:FaUserShield, label:"Admins",         value:stats.admins,   gradient:"from-purple-500 to-purple-600", delay:180 },
          ].map(c=>(
            <div key={c.label} className="fade-up" style={{animationDelay:`${c.delay}ms`}}>
              <StatCard {...c}/>
            </div>
          ))}
        </div>

        {/* ── USER LIST CARD ── */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">

          {/* List header */}
          <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <h2 className="text-base font-extrabold text-slate-700">User List</h2>
              <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2.5 py-1 rounded-full">
                {filtered.length} results
              </span>
            </div>
            {hasPermission(P.USER_CREATE) && (
            <button onClick={()=>navigate("/CreateUser")}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-200 transition-all">
              <FiUserPlus className="w-3.5 h-3.5"/> Add New User
            </button>
            )}
          </div>

          {/* Search + Status filter tabs */}
          <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/60">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/>
                <input value={search} onChange={e=>{ setSearch(e.target.value); setPage(1); }}
                  placeholder="Search by name, username, email, ID..."
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 placeholder-slate-400
                    focus:border-blue-400 focus:ring-2 focus:ring-blue-50 outline-none transition-all"/>
              </div>

              <div className="flex rounded-xl border border-slate-200 overflow-hidden flex-shrink-0">
                {["Active","Inactive","All"].map(tab=>(
                  <button key={tab} onClick={()=>{ setActiveTab(tab); setPage(1); }}
                    className={`px-4 py-2.5 text-xs font-bold transition-all whitespace-nowrap
                      ${activeTab===tab
                        ? tab==="Active"    ? "bg-emerald-500 text-white"
                          : tab==="Inactive" ? "bg-slate-500 text-white"
                          : "bg-blue-600 text-white"
                        : "bg-white text-slate-500 hover:bg-slate-50"}`}>
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── DESKTOP TABLE ── */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="bg-slate-50/80 border-b border-slate-100">
                <tr>
                  {["ID","Username","Full Name","Email","Role","Status","Last Login","Created","Actions"].map(h=>(
                    <th key={h} className="px-4 py-3.5 text-left text-xs font-extrabold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading
                  ? [...Array(5)].map((_,i)=><SkeletonRow key={i}/>)
                  : pageData.length===0
                  ? (
                    <tr>
                      <td colSpan={9} className="text-center py-20">
                        <div className="text-5xl mb-3">👥</div>
                        <p className="text-base font-extrabold text-slate-600 mb-1">No Users Found</p>
                        <p className="text-sm text-slate-400 mb-4">
                          {search||activeTab!=="All"
                            ? "Try adjusting your search or filters."
                            : "Add your first user to get started."}
                        </p>
                        {search||activeTab!=="All"
                          ? <button onClick={()=>{ setSearch(""); setActiveTab("All"); }}
                              className="px-4 py-2 rounded-xl bg-blue-50 text-blue-600 font-bold text-sm hover:bg-blue-100 transition-all">
                              Clear Filters
                            </button>
                          : <button onClick={()=>navigate("/CreateUser")}
                              className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm shadow-md hover:bg-blue-700 transition-all flex items-center gap-2 mx-auto">
                              <FiUserPlus/> Add First User
                            </button>}
                      </td>
                    </tr>
                  )
                  : pageData.map((u,idx)=>{
                    const rc = ROLE_CFG[u.role]    || ROLE_CFG.Staff;
                    const sc = STATUS_CFG[u.status] || STATUS_CFG.Inactive;
                    return (
                      <tr key={u.id}
                        className="group transition-all duration-150 hover:bg-blue-50/40 hover:shadow-[inset_3px_0_0_#2563eb]"
                        style={{animation:"fadeUp .35s ease both", animationDelay:`${idx*30}ms`}}>

                        {/* ID */}
                        <td className="px-4 py-3.5">
                          <span className="text-xs font-extrabold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg" title={u.id}>{String(u.id).slice(0,8)}</span>
                        </td>

                        {/* Username + avatar */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${avatarGrad(u.id)} flex items-center justify-center text-white text-xs font-extrabold flex-shrink-0`}>
                              {initials(u.fullName)}
                            </div>
                            <span className="text-sm font-bold text-blue-600">{u.username}</span>
                          </div>
                        </td>

                        {/* Full Name */}
                        <td className="px-4 py-3.5">
                          <p className="text-sm font-semibold text-slate-800">{u.fullName}</p>
                        </td>

                        {/* Email */}
                        <td className="px-4 py-3.5">
                          <p className="text-sm text-slate-600 truncate max-w-[200px]">{u.email}</p>
                        </td>

                        {/* Role */}
                        <td className="px-4 py-3.5">
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${rc.border} ${rc.bg} ${rc.text}`}>
                            {u.role}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3.5">
                          <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1.5 rounded-full ${sc.bg} ${sc.text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`}/>
                            {u.status}
                          </span>
                        </td>

                        {/* Last Login */}
                        <td className="px-4 py-3.5">
                          <p className="text-xs text-slate-500 font-medium">{u.lastLogin}</p>
                        </td>

                        {/* Created */}
                        <td className="px-4 py-3.5">
                          <p className="text-xs text-slate-500 font-medium">{u.createdAt}</p>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1.5 opacity-70 group-hover:opacity-100 transition-opacity">
                            {/* ── EDIT → navigates to /EditUser/:id ── */}
                             {/* <button onClick={()=>navigate(`/EditUser`)} */}
                            {hasPermission(P.USER_UPDATE) && (
                            <button onClick={()=>navigate(`/EditUser/${u.id}`)}
                             title="Edit User"
                              className="w-8 h-8 rounded-lg bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center transition-all text-sm shadow-sm">
                              <FiEdit2 className="w-3.5 h-3.5"/>
                            </button>
                            )}

                            {/* DELETE → inline modal */}
                            {hasPermission(P.USER_DELETE) && (
                            <button onClick={()=>setDeleteUser(u)} title="Delete User"
                              className="w-8 h-8 rounded-lg bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-all text-sm shadow-sm">
                              <FiTrash2 className="w-3.5 h-3.5"/>
                            </button>
                            )}

                            {/* MANAGE PERMISSIONS → navigates to /UserPermissions/:id */}
                            {/* <button onClick={()=>navigate(`/UserPermissions`)}  */}
                            {hasPermission(P.USER_UPDATE) && (
                            <button onClick={()=>navigate(`/UserPermissions/${u.id}`)}
                            title="Manage Permissions"
                              className="w-8 h-8 rounded-lg bg-teal-500 hover:bg-teal-600 text-white flex items-center justify-center transition-all text-sm shadow-sm">
                              <FiShield className="w-3.5 h-3.5"/>
                            </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>

          {/* ── MOBILE CARDS ── */}
          <div className="lg:hidden p-4 space-y-3">
            {loading
              ? [...Array(4)].map((_,i)=>(
                  <div key={i} className="bg-white rounded-2xl border border-slate-100 p-4 space-y-3">
                    {[...Array(3)].map((_,j)=>(
                      <div key={j} className="h-4 rounded-lg bg-slate-200 animate-pulse" style={{width:`${40+Math.random()*50}%`}}/>
                    ))}
                  </div>
                ))
              : pageData.length===0
              ? (
                <div className="text-center py-14">
                  <div className="text-5xl mb-3">👥</div>
                  <p className="text-base font-extrabold text-slate-600 mb-1">No Users Found</p>
                  <p className="text-sm text-slate-400 mb-4">
                    {search||activeTab!=="All" ? "Adjust filters." : "Add your first user."}
                  </p>
                  {!search&&activeTab==="All"&&(
                    <button onClick={()=>navigate("/CreateUser")}
                      className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm">
                      + Add User
                    </button>
                  )}
                </div>
              )
              : pageData.map((u,idx)=>{
                const rc = ROLE_CFG[u.role]    || ROLE_CFG.Staff;
                const sc = STATUS_CFG[u.status] || STATUS_CFG.Inactive;
                return (
                  <div key={u.id}
                    className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-3 fade-up"
                    style={{animationDelay:`${idx*40}ms`}}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${avatarGrad(u.id)} flex items-center justify-center text-white text-sm font-extrabold flex-shrink-0`}>
                          {initials(u.fullName)}
                        </div>
                        <div>
                          <p className="font-extrabold text-slate-800 text-sm">{u.fullName}</p>
                          <p className="text-xs font-bold text-blue-600">{u.username}</p>
                          <p className="text-xs text-slate-400" title={u.id}>#{String(u.id).slice(0,8)}</p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${sc.bg} ${sc.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`}/>{u.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-slate-50 rounded-lg px-3 py-2">
                        <p className="text-slate-400">Email</p>
                        <p className="font-bold text-slate-700 truncate">{u.email}</p>
                      </div>
                      <div className="bg-slate-50 rounded-lg px-3 py-2">
                        <p className="text-slate-400">Role</p>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${rc.border} ${rc.bg} ${rc.text}`}>{u.role}</span>
                      </div>
                      <div className="bg-slate-50 rounded-lg px-3 py-2">
                        <p className="text-slate-400">Last Login</p>
                        <p className="font-bold text-slate-700">{u.lastLogin}</p>
                      </div>
                      <div className="bg-slate-50 rounded-lg px-3 py-2">
                        <p className="text-slate-400">Created</p>
                        <p className="font-bold text-slate-700">{u.createdAt}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {/* Edit → navigate to EditUser page */}
                      {/* <button onClick={()=>navigate(`/EditUser`)} */}
                      {hasPermission(P.USER_UPDATE) && (
                      <button onClick={()=>navigate(`/EditUser/${u.id}`)}
                        className="flex-1 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all">
                        <FiEdit2 className="w-3 h-3"/> Edit
                      </button>
                      )}

                      {/* Manage Permissions → navigate to /UserPermissions/:id */}
                      {/* <button onClick={()=>navigate(`/UserPermissions`)} */}
                      {hasPermission(P.USER_UPDATE) && (
                      <button onClick={()=>navigate(`/UserPermissions/${u.id}`)}
                        className="flex-1 py-2 rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all">
                        <FiShield className="w-3 h-3"/> Permissions
                      </button>
                      )}

                      {/* Delete → inline modal */}
                      {hasPermission(P.USER_DELETE) && (
                      <button onClick={()=>setDeleteUser(u)}
                        className="w-9 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-bold flex items-center justify-center transition-all">
                        <FiTrash2 className="w-3.5 h-3.5"/>
                      </button>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>

          {/* ── PAGINATION ── */}
          {filtered.length > 0 && (
            <div className="px-5 py-4 border-t border-slate-100 bg-slate-50/60 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-slate-400 font-medium">
                Showing{" "}
                <span className="font-bold text-slate-600">{(page-1)*perPage+1}</span>–
                <span className="font-bold text-slate-600">{Math.min(page*perPage,filtered.length)}</span>
                {" "}of{" "}
                <span className="font-bold text-slate-600">{filtered.length}</span> users
              </p>
              <div className="flex items-center gap-1.5">
                <button disabled={page===1} onClick={()=>setPage(1)}
                  className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-600 text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center">
                  <FaAngleDoubleLeft className="text-xs"/>
                </button>
                <button disabled={page===1} onClick={()=>setPage(p=>p-1)}
                  className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-600 text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center">
                  <FiChevronLeft className="text-xs"/>
                </button>
                {Array.from({length:totalPages},(_,i)=>i+1)
                  .filter(p=>p===1||p===totalPages||Math.abs(p-page)<=1)
                  .reduce((acc,p,i,arr)=>{ if(i>0&&p-arr[i-1]>1) acc.push("…"); acc.push(p); return acc; },[])
                  .map((p,i)=>
                    typeof p==="string"
                      ? <span key={`e${i}`} className="w-8 h-8 flex items-center justify-center text-xs text-slate-400">…</span>
                      : <button key={p} onClick={()=>setPage(p)}
                          className={`w-8 h-8 rounded-lg text-xs font-bold transition-all border
                            ${page===p
                              ?"bg-blue-600 border-blue-600 text-white shadow-sm"
                              :"bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600"}`}>
                          {p}
                        </button>
                  )}
                <button disabled={page===totalPages} onClick={()=>setPage(p=>p+1)}
                  className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-600 text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center">
                  <FiChevronRight className="text-xs"/>
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
    </div>
  );
}