// // src/components/UserPermissions/UserPermissions.jsx
// // ─────────────────────────────────────────────────────────────
// // User Permissions Page — Travel CRM
// // Matches CRM design system: from-slate-50 via-blue-50/30
// // Reference: company/users/user_permissions.php?user_id=34
// // Features:
// //   - Quick Actions: Apply Template, Bulk Select/Clear, Data Scope Default
// //   - Core Functions group: Dashboard, Lead Management, Reminders, Master Data
// //   - Admin Functions group: User Management, Bookings, Customers, Vendors, Settings
// //   - Each section has "Toggle All" (Enable All) button
// //   - Each permission row: Page name + path, Access toggle, Data Scope dropdown
// //   - Bottom bar: Save Permissions, Cancel, Preview Changes, Save as Template
// //   - Fully responsive on all devices
// // ─────────────────────────────────────────────────────────────

// import { useState, useEffect, useCallback, useMemo } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import {
//   FiShield, FiArrowLeft, FiSave, FiChevronDown,
//   FiToggleLeft, FiToggleRight, FiEye, FiLayers,
//   FiAlertCircle, FiCheck,
// } from "react-icons/fi";
// import { FaUserShield, FaStar, FaCog } from "react-icons/fa";
// import { MdAdminPanelSettings } from "react-icons/md";

// // ── Uncomment when backend is ready ──────────────────────────
// // import { editUserService } from "../services/editUserService";

// /* ─── DATA SCOPE OPTIONS ─────────────────────────────────────── */
// const SCOPE_OPTIONS = [
//   { value:"own",    label:"Own Records"     },
//   { value:"team",   label:"Team Records"    },
//   { value:"all",    label:"All Records"     },
//   { value:"none",   label:"No Access"       },
// ];

// /* ─── PERMISSION STRUCTURE ───────────────────────────────────── */
// const PERMISSION_GROUPS = [
//   {
//     groupId: "core",
//     groupLabel: "⭐ Core Functions",
//     icon: <FaStar className="w-4 h-4"/>,
//     sections: [
//       {
//         id: "dashboard", label: "Dashboard",
//         pages: [
//           { id:"dashboard_access", label:"Dashboard Access", path:"company/dashboard/index.php" },
//         ],
//       },
//       {
//         id: "lead_management", label: "Lead Management",
//         pages: [
//           { id:"list_leads",    label:"List Leads",    path:"company/leads/index.php"       },
//           { id:"create_lead",   label:"Create Lead",   path:"company/leads/create.php"      },
//           { id:"edit_lead",     label:"Edit Lead",     path:"company/leads/edit.php"        },
//           { id:"view_lead",     label:"View Lead",     path:"company/leads/view.php"        },
//           { id:"delete_lead",   label:"Delete Lead",   path:"company/leads/delete.php"      },
//           { id:"import_leads",  label:"Import Leads",  path:"company/leads/import.php"      },
//           { id:"lead_logs",     label:"Lead Logs",     path:"company/leads/logs.php"        },
//           { id:"add_lead_log",  label:"Add Lead Log",  path:"company/leads/add_lead_log.php"},
//         ],
//       },
//       {
//         id: "reminders", label: "Reminders",
//         pages: [
//           { id:"my_reminders",     label:"My Reminders",     path:"company/reminders/index.php"                  },
//           { id:"create_reminder",  label:"Create Reminder",  path:"company/reminders/create_reminder.php"        },
//           { id:"notifications",    label:"Notifications",    path:"company/reminders/notifications/access.php"   },
//           { id:"reminder_logs",    label:"Reminder Logs",    path:"company/reminders/logs.php"                   },
//           { id:"booking_reminders",label:"Booking Reminders",path:"company/reminders/booking_reminders.php"      },
//         ],
//       },
//       {
//         id: "master_data", label: "Master Data",
//         pages: [
//           { id:"list_cities",       label:"List Cities",        path:"company/masters/city/index.php"            },
//           { id:"create_city",       label:"Create City",        path:"company/masters/city/create.php"           },
//           { id:"edit_city",         label:"Edit City",          path:"company/masters/city/edit.php"             },
//           { id:"view_city",         label:"View City",          path:"company/masters/city/view.php"             },
//           { id:"delete_city",       label:"Delete City",        path:"company/masters/city/delete.php"           },
//           { id:"list_destinations", label:"List Destinations",  path:"company/masters/destinations/index.php"    },
//           { id:"create_destination",label:"Create Destination", path:"company/masters/destinations/create.php"   },
//           { id:"edit_destination",  label:"Edit Destination",   path:"company/masters/destinations/edit.php"     },
//           { id:"view_destination",  label:"View Destination",   path:"company/masters/destinations/view.php"     },
//           { id:"delete_destination",label:"Delete Destination", path:"company/masters/destinations/delete.php"   },
//           { id:"list_hotels",       label:"List Hotels",        path:"company/masters/hotel/index.php"           },
//           { id:"create_hotel",      label:"Create Hotel",       path:"company/masters/hotel/create.php"          },
//           { id:"edit_hotel",        label:"Edit Hotel",         path:"company/masters/hotel/edit.php"            },
//           { id:"view_hotel",        label:"View Hotel",         path:"company/masters/hotel/view.php"            },
//           { id:"delete_hotel",      label:"Delete Hotel",       path:"company/masters/hotel/delete.php"          },
//           { id:"list_airlines",     label:"List Airlines",      path:"company/masters/airline/index.php"         },
//           { id:"create_airline",    label:"Create Airline",     path:"company/masters/airline/create.php"        },
//           { id:"edit_airline",      label:"Edit Airline",       path:"company/masters/airline/edit.php"          },
//           { id:"view_airline",      label:"View Airline",       path:"company/masters/airline/view.php"          },
//           { id:"delete_airline",    label:"Delete Airline",     path:"company/masters/airline/delete.php"        },
//           { id:"list_cruises",      label:"List Cruises",       path:"company/masters/cruise/index.php"          },
//           { id:"create_cruise",     label:"Create Cruise",      path:"company/masters/cruise/create.php"         },
//           { id:"edit_cruise",       label:"Edit Cruise",        path:"company/masters/cruise/edit.php"           },
//           { id:"view_cruise",       label:"View Cruise",        path:"company/masters/cruise/view.php"           },
//           { id:"delete_cruise",     label:"Delete Cruise",      path:"company/masters/cruise/delete.php"         },
//           { id:"list_vehicles",     label:"List Vehicles",      path:"company/masters/vehicles/index.php"        },
//           { id:"create_vehicle",    label:"Create Vehicle",     path:"company/masters/vehicles/create.php"       },
//           { id:"edit_vehicle",      label:"Edit Vehicle",       path:"company/masters/vehicles/edit.php"         },
//           { id:"view_vehicle",      label:"View Vehicle",       path:"company/masters/vehicles/view.php"         },
//           { id:"delete_vehicle",    label:"Delete Vehicle",     path:"company/masters/vehicles/delete.php"       },
//           { id:"list_sightseeing",  label:"List Sightseeing",   path:"company/masters/sightseeing/index.php"     },
//           { id:"create_sightseeing",label:"Create Sightseeing", path:"company/masters/sightseeing/create.php"    },
//           { id:"edit_sightseeing",  label:"Edit Sightseeing",   path:"company/masters/sightseeing/edit.php"      },
//           { id:"view_sightseeing",  label:"View Sightseeing",   path:"company/masters/sightseeing/view.php"      },
//           { id:"delete_sightseeing",label:"Delete Sightseeing", path:"company/masters/sightseeing/delete.php"    },
//           { id:"list_addon",        label:"List Add-on Services",  path:"company/masters/add_on_services/index.php"  },
//           { id:"create_addon",      label:"Create Add-on Service", path:"company/masters/add_on_services/create.php" },
//           { id:"edit_addon",        label:"Edit Add-on Service",   path:"company/masters/add_on_services/edit.php"   },
//           { id:"view_addon",        label:"View Add-on Service",   path:"company/masters/add_on_services/view.php"   },
//           { id:"delete_addon",      label:"Delete Add-on Service", path:"company/masters/add_on_services/delete.php" },
//           { id:"list_testimonials", label:"List Testimonials",  path:"company/masters/testimonial/index.php"     },
//           { id:"create_testimonial",label:"Create Testimonial", path:"company/masters/testimonial/create.php"    },
//           { id:"edit_testimonial",  label:"Edit Testimonial",   path:"company/masters/testimonial/edit.php"      },
//           { id:"view_testimonial",  label:"View Testimonial",   path:"company/masters/testimonial/view.php"      },
//           { id:"delete_testimonial",label:"Delete Testimonial", path:"company/masters/testimonial/delete.php"    },
//         ],
//       },
//       {
//         id: "quotations", label: "Quotations",
//         pages: [
//           { id:"create_quotation",     label:"Create Quotation",     path:"company/quotations/view.php"              },
//           { id:"edit_quotation",       label:"Edit Quotation",       path:"company/quotations/edit.php"              },
//           { id:"view_quotation",       label:"View Quotation",       path:"company/quotations/view.php"              },
//           { id:"pdf_designer",         label:"PDF Designer",         path:"company/pdf_designer/designes/index.php"  },
//           { id:"quotation_templates",  label:"Quotation Templates",  path:"company/quotations/templates/index.php"   },
//           { id:"create_template",      label:"Create Template",      path:"company/quotations/templates/create.php"  },
//         ],
//       },
//     ],
//   },
//   {
//     groupId: "admin",
//     groupLabel: "⚙️ Admin Functions",
//     icon: <FaCog className="w-4 h-4"/>,
//     sections: [
//       {
//         id: "user_management", label: "User Management",
//         pages: [
//           { id:"list_users",            label:"List Users",            path:"company/users/list.php"             },
//           { id:"create_user",           label:"Create User",           path:"company/users/create.php"           },
//           { id:"edit_user",             label:"Edit User",             path:"company/users/edit.php"             },
//           { id:"delete_user",           label:"Delete User",           path:"company/users/delete.php"           },
//           { id:"manage_permissions",    label:"Manage Permissions",    path:"company/users/permissions.php"      },
//           { id:"permission_templates",  label:"Permission Templates",  path:"company/users/permission_templates.php" },
//         ],
//       },
//       {
//         id: "bookings", label: "Bookings",
//         pages: [
//           { id:"list_bookings",    label:"List Bookings",    path:"company/bookings/index.php"     },
//           { id:"create_booking",   label:"Create Booking",   path:"company/bookings/create.php"    },
//           { id:"edit_booking",     label:"Edit Booking",     path:"company/bookings/edit.php"      },
//           { id:"view_booking",     label:"View Booking",     path:"company/bookings/view.php"      },
//           { id:"cancel_booking",   label:"Cancel Booking",   path:"company/bookings/cancel.php"    },
//           { id:"manage_payments",  label:"Manage Payments",  path:"company/bookings/payments.php"  },
//           { id:"process_refunds",  label:"Process Refunds",  path:"company/bookings/refund.php"    },
//         ],
//       },
//       {
//         id: "customers", label: "Customers",
//         pages: [
//           { id:"list_customers",  label:"List Customers",  path:"company/customers/index.php"  },
//           { id:"create_customer", label:"Create Customer", path:"company/customers/create.php" },
//           { id:"edit_customer",   label:"Edit Customer",   path:"company/customers/edit.php"   },
//           { id:"view_customer",   label:"View Customer",   path:"company/customers/view.php"   },
//         ],
//       },
//       {
//         id: "vendors", label: "Vendors",
//         pages: [
//           { id:"list_vendors",   label:"List Vendors",   path:"company/vendors/index.php"   },
//           { id:"create_vendor",  label:"Create Vendor",  path:"company/vendors/create.php"  },
//           { id:"edit_vendor",    label:"Edit Vendor",    path:"company/vendors/edit.php"    },
//           { id:"view_vendor",    label:"View Vendor",    path:"company/vendors/view.php"    },
//         ],
//       },
//       {
//         id: "settings", label: "Settings",
//         pages: [
//           { id:"email_config",         label:"Email Configuration",   path:"company/settings/email/index.php"          },
//           { id:"test_email_settings",  label:"Test Email Settings",   path:"company/settings/email/test.php"           },
//           { id:"notification_settings",label:"Notification Settings", path:"company/settings/notifications/index.php"  },
//           { id:"whatsapp_settings",    label:"WhatsApp Settings",     path:"company/settings/whatsapp/index.php"       },
//         ],
//       },
//     ],
//   },
// ];

// const TEMPLATES = [
//   { value:"",        label:"Select a template..." },
//   { value:"basic",   label:"Basic Access Only"    },
//   { value:"sales",   label:"Sales Team Access"    },
//   { value:"support", label:"Support Access"       },
//   { value:"full",    label:"Full Access"          },
// ];

// /* Build initial permissions state */
// function buildInitialState() {
//   const state = {};
//   PERMISSION_GROUPS.forEach(g => {
//     g.sections.forEach(sec => {
//       sec.pages.forEach(pg => {
//         state[pg.id] = { access: false, scope: "own" };
//       });
//     });
//   });
//   // Pre-enable some for the mock user (Shreyash)
//   ["dashboard_access","list_leads","view_lead","my_reminders","notifications"].forEach(k => {
//     if (state[k]) state[k].access = true;
//   });
//   return state;
// }

// /* ─── MOCK USER ──────────────────────────────────────────────── */
// const MOCK_USER = { id:34, fullName:"Shreyash Raghvendra Shahi", role:"Staff" };

// /* ─── TOAST ──────────────────────────────────────────────────── */
// function Toast({ msg, type, onClose }) {
//   useEffect(()=>{ const t=setTimeout(onClose,3800); return()=>clearTimeout(t); },[onClose]);
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

// /* ─── TOGGLE SWITCH ──────────────────────────────────────────── */
// function Toggle({ checked, onChange }) {
//   return (
//     <button type="button" onClick={()=>onChange(!checked)}
//       className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 flex-shrink-0
//         ${checked?"bg-blue-600":"bg-slate-300"}`}>
//       <span className={`inline-block w-3.5 h-3.5 rounded-full bg-white shadow transform transition-transform duration-200
//         ${checked?"translate-x-[18px]":"translate-x-0.5"}`}/>
//     </button>
//   );
// }

// /* ─── PERMISSION ROW ─────────────────────────────────────────── */
// function PermissionRow({ page, perm, onChange }) {
//   return (
//     <div className={`grid grid-cols-1 sm:grid-cols-[1fr_auto_200px] items-center gap-3 px-4 py-3
//       border-b border-slate-100 last:border-0 transition-colors
//       ${perm.access ? "bg-blue-50/30" : "hover:bg-slate-50/60"}`}>
//       {/* Page name + path */}
//       <div className="min-w-0">
//         <p className="text-sm font-semibold text-slate-800">{page.label}</p>
//         <p className="text-xs text-slate-400 font-mono truncate">{page.path}</p>
//       </div>
//       {/* Access toggle */}
//       <div className="flex items-center gap-2 sm:justify-center">
//         <span className="text-xs text-slate-500 sm:hidden font-medium">Access:</span>
//         <Toggle checked={perm.access} onChange={v=>onChange(page.id,"access",v)}/>
//       </div>
//       {/* Data Scope dropdown */}
//       <div className="relative">
//         <select
//           value={perm.scope}
//           onChange={e=>onChange(page.id,"scope",e.target.value)}
//           className="w-full pl-3 pr-8 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-600 font-medium
//             bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-50 outline-none appearance-none cursor-pointer transition-all">
//           {SCOPE_OPTIONS.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
//         </select>
//         <FiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none"/>
//       </div>
//     </div>
//   );
// }

// /* ─── PERMISSION SECTION ─────────────────────────────────────── */
// function PermissionSection({ section, permissions, onChange, onToggleAll }) {
//   const allEnabled = section.pages.every(pg => permissions[pg.id]?.access);
//   const someEnabled = section.pages.some(pg => permissions[pg.id]?.access);

//   return (
//     <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden mb-4">
//       {/* Section header */}
//       <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/60">
//         <div className="flex items-center gap-2">
//           <span className={`w-2 h-2 rounded-full flex-shrink-0 ${someEnabled?"bg-blue-500":"bg-slate-300"}`}/>
//           <h3 className="text-sm font-extrabold text-blue-600">{section.label}</h3>
//           <span className="text-xs text-slate-400 font-medium">
//             ({section.pages.filter(pg=>permissions[pg.id]?.access).length}/{section.pages.length})
//           </span>
//         </div>
//         <button
//           type="button"
//           onClick={()=>onToggleAll(section, !allEnabled)}
//           className={`text-xs font-bold px-3 py-1 rounded-lg border transition-all
//             ${allEnabled
//               ?"bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200"
//               :"bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100"}`}>
//           {allEnabled ? "Disable All" : "Enable All"}
//         </button>
//       </div>

//       {/* Table header (desktop) */}
//       <div className="hidden sm:grid grid-cols-[1fr_auto_200px] px-4 py-2 bg-slate-50/40 border-b border-slate-100">
//         <p className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Page</p>
//         <p className="text-xs font-extrabold text-slate-500 uppercase tracking-wider text-center px-6">Access</p>
//         <p className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Data Scope</p>
//       </div>

//       {/* Permission rows */}
//       {section.pages.map(pg=>(
//         <PermissionRow
//           key={pg.id}
//           page={pg}
//           perm={permissions[pg.id] || {access:false, scope:"own"}}
//           onChange={onChange}
//         />
//       ))}
//     </div>
//   );
// }

// /* ─── MAIN PAGE ──────────────────────────────────────────────── */
// export default function UserPermissions() {
//   const navigate = useNavigate();
//   const { id }   = useParams(); // /UserPermissions/34

//   const [user,       setUser]       = useState(null);
//   const [loading,    setLoading]    = useState(true);
//   const [saving,     setSaving]     = useState(false);
//   const [permissions,setPermissions]= useState(buildInitialState);
//   const [template,   setTemplate]   = useState("");
//   const [scopeDefault,setScopeDefault]= useState("own");
//   const [toast,      setToast]      = useState(null);

//   const showToast = useCallback((msg, type="success")=>setToast({msg,type}),[]);

//   /* load user */
//   useEffect(()=>{
//     setLoading(true);
//     // BACKEND: editUserService.getById(id).then(res=>setUser(res.data))
//     //         editUserService.getPermissions(id).then(res=>setPermissions(mapApiToState(res.data)))
//     setTimeout(()=>{ setUser(MOCK_USER); setLoading(false); }, 500);
//   },[id]);

//   /* stats */
//   const stats = useMemo(()=>{
//     const allPages = PERMISSION_GROUPS.flatMap(g=>g.sections.flatMap(s=>s.pages));
//     const enabled = allPages.filter(pg=>permissions[pg.id]?.access).length;
//     return { total: allPages.length, enabled };
//   },[permissions]);

//   /* handlers */
//   const handleChange = useCallback((pageId, field, value) => {
//     setPermissions(prev=>({ ...prev, [pageId]:{ ...prev[pageId], [field]:value } }));
//   },[]);

//   const handleToggleAll = useCallback((section, enable) => {
//     setPermissions(prev=>{
//       const next = {...prev};
//       section.pages.forEach(pg=>{ next[pg.id]={...next[pg.id], access:enable}; });
//       return next;
//     });
//   },[]);

//   const handleSelectAll = () => {
//     setPermissions(prev=>{
//       const next={...prev};
//       Object.keys(next).forEach(k=>{ next[k]={...next[k],access:true}; });
//       return next;
//     });
//     showToast("All permissions enabled.");
//   };

//   const handleClearAll = () => {
//     setPermissions(prev=>{
//       const next={...prev};
//       Object.keys(next).forEach(k=>{ next[k]={...next[k],access:false}; });
//       return next;
//     });
//     showToast("All permissions cleared.");
//   };

//   const handleApplyScopeDefault = (scope) => {
//     setScopeDefault(scope);
//     setPermissions(prev=>{
//       const next={...prev};
//       Object.keys(next).forEach(k=>{ next[k]={...next[k],scope}; });
//       return next;
//     });
//     showToast(`Data scope set to "${SCOPE_OPTIONS.find(o=>o.value===scope)?.label}" for all pages.`);
//   };

//   const handleApplyTemplate = (tpl) => {
//     if(!tpl) return;
//     setTemplate(tpl);
//     if(tpl==="full"){
//       handleSelectAll();
//     } else if(tpl==="basic"){
//       setPermissions(prev=>{
//         const next={...prev};
//         Object.keys(next).forEach(k=>{ next[k]={...next[k],access:false}; });
//         ["dashboard_access","list_leads","my_reminders"].forEach(k=>{ if(next[k]) next[k].access=true; });
//         return next;
//       });
//       showToast("Basic Access template applied.");
//     } else if(tpl==="sales"){
//       setPermissions(prev=>{
//         const next={...prev};
//         Object.keys(next).forEach(k=>{ next[k]={...next[k],access:false}; });
//         ["dashboard_access","list_leads","create_lead","edit_lead","view_lead","my_reminders","create_reminder"].forEach(k=>{ if(next[k]) next[k].access=true; });
//         return next;
//       });
//       showToast("Sales Team Access template applied.");
//     } else {
//       showToast(`Template "${tpl}" applied.`);
//     }
//   };

//   const handleSave = async () => {
//     setSaving(true);
//     try {
//       // BACKEND: await editUserService.updatePermissions(id, permissions);
//       await new Promise(r=>setTimeout(r,1000));
//       showToast("Permissions saved successfully! ✅");
//     } catch {
//       showToast("Failed to save permissions.","error");
//     } finally { setSaving(false); }
//   };

//   if(loading){
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 flex items-center justify-center">
//         <div className="text-center space-y-3">
//           <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"/>
//           <p className="text-sm text-slate-500 font-medium">Loading permissions…</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100"
//       style={{fontFamily:"'Plus Jakarta Sans', system-ui, sans-serif"}}>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
//         @keyframes slideIn { from{transform:translateX(110%);opacity:0} to{transform:translateX(0);opacity:1} }
//         @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
//         .fade-up { animation: fadeUp .4s ease both; }
//         select { -webkit-appearance:none; appearance:none; }
//         ::-webkit-scrollbar{width:5px;height:5px}
//         ::-webkit-scrollbar-track{background:#f1f5f9;border-radius:99px}
//         ::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:99px}
//       `}</style>

//       {toast && <Toast msg={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}

//       {/* ── PAGE HEADER ── */}
//       <div className="bg-white/70 backdrop-blur-md border-b border-slate-100">
//         <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-5">
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//             <div className="flex items-center gap-4">
//               <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white shadow-lg shadow-blue-200 flex-shrink-0">
//                 <FaUserShield className="w-5 h-5"/>
//               </div>
//               <div>
//                 <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">User Permissions</h1>
//                 <p className="text-sm text-slate-400 mt-0.5">
//                   Managing permissions for{" "}
//                   <span className="font-bold text-blue-600">{user?.fullName}</span>
//                   <span className="hidden sm:inline ml-3 text-slate-300">|</span>
//                   <span className="hidden sm:inline ml-3 text-xs">
//                     <span className="hover:text-blue-600 cursor-pointer transition-colors" onClick={()=>navigate("/")}>Home</span>
//                     <span className="mx-1 text-slate-300">/</span>
//                     <span className="hover:text-blue-600 cursor-pointer transition-colors" onClick={()=>navigate("/Users")}>Permissions</span>
//                     <span className="mx-1 text-slate-300">/</span>
//                     <span className="text-blue-600 font-bold">{user?.fullName}</span>
//                   </span>
//                 </p>
//               </div>
//             </div>
//             <button type="button" onClick={()=>navigate(`/EditUser/${id||34}`)}
//               className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200
//                 hover:border-blue-300 bg-white hover:bg-blue-50 text-slate-600 hover:text-blue-600
//                 text-sm font-bold transition-all shadow-sm">
//               <FiArrowLeft className="w-4 h-4"/> Back to Edit User
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6 space-y-5">

//         {/* ── QUICK ACTIONS ── */}
//         <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/60 shadow-sm p-5 fade-up">
//           <h2 className="text-sm font-extrabold text-slate-700 mb-4 flex items-center gap-2">
//             <FiLayers className="w-4 h-4 text-blue-500"/> Quick Actions
//           </h2>
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">

//             {/* Apply Template */}
//             <div>
//               <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wide mb-1.5">Apply Template:</label>
//               <div className="flex gap-2">
//                 <div className="relative flex-1">
//                   <select value={template} onChange={e=>handleApplyTemplate(e.target.value)}
//                     className="w-full pl-3 pr-8 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-600 font-medium
//                       focus:border-blue-400 focus:ring-2 focus:ring-blue-50 outline-none appearance-none cursor-pointer transition-all">
//                     {TEMPLATES.map(t=><option key={t.value} value={t.value}>{t.label}</option>)}
//                   </select>
//                   <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none"/>
//                 </div>
//               </div>
//             </div>

//             {/* Bulk Actions */}
//             <div>
//               <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wide mb-1.5">Bulk Actions:</label>
//               <div className="flex gap-2">
//                 <button type="button" onClick={handleSelectAll}
//                   className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm shadow-blue-200">
//                   Select All Access
//                 </button>
//                 <button type="button" onClick={handleClearAll}
//                   className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all shadow-sm shadow-amber-200">
//                   Clear All
//                 </button>
//               </div>
//             </div>

//             {/* Data Scope Default */}
//             <div>
//               <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wide mb-1.5">Data Scope Default:</label>
//               <div className="relative">
//                 <select value={scopeDefault} onChange={e=>handleApplyScopeDefault(e.target.value)}
//                   className="w-full pl-3 pr-8 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-600 font-medium
//                     focus:border-blue-400 focus:ring-2 focus:ring-blue-50 outline-none appearance-none cursor-pointer transition-all">
//                   {SCOPE_OPTIONS.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
//                 </select>
//                 <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none"/>
//               </div>
//             </div>
//           </div>

//           {/* Stats pill */}
//           <div className="mt-4 flex items-center justify-between">
//             <div className="flex items-center gap-2">
//               <span className="text-xs text-slate-500 font-medium">Permissions enabled:</span>
//               <span className="text-xs font-extrabold text-blue-600 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full">
//                 {stats.enabled} / {stats.total}
//               </span>
//             </div>
//             <div className="flex-1 mx-4 bg-slate-200 rounded-full h-1.5 overflow-hidden max-w-[200px] ml-auto">
//               <div className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
//                 style={{width:`${Math.round((stats.enabled/stats.total)*100)}%`}}/>
//             </div>
//             <span className="text-xs font-bold text-slate-500">
//               {Math.round((stats.enabled/stats.total)*100)}%
//             </span>
//           </div>
//         </div>

//         {/* ── PERMISSION GROUPS ── */}
//         {PERMISSION_GROUPS.map(group=>(
//           <div key={group.groupId} className="fade-up">
//             {/* Group header */}
//             <div className="flex items-center gap-3 mb-3">
//               <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white flex-shrink-0">
//                 {group.icon}
//               </div>
//               <h2 className="text-base font-extrabold text-slate-800">{group.groupLabel}</h2>
//               <div className="flex-1 h-px bg-slate-200"/>
//             </div>

//             {/* Sections */}
//             {group.sections.map(section=>(
//               <PermissionSection
//                 key={section.id}
//                 section={section}
//                 permissions={permissions}
//                 onChange={handleChange}
//                 onToggleAll={handleToggleAll}
//               />
//             ))}
//           </div>
//         ))}

//         {/* ── BOTTOM ACTION BAR ── */}
//         <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/60 shadow-sm p-5 fade-up">
//           <div className="flex flex-col sm:flex-row items-stretch justify-between gap-3">
//             {/* Left: Save + Cancel */}
//             <div className="flex flex-col sm:flex-row gap-3">
//               <button type="button" onClick={handleSave} disabled={saving}
//                 className="flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl
//                   bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm
//                   shadow-md shadow-emerald-200 hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed">
//                 {saving
//                   ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/>
//                   : <FiSave className="w-4 h-4"/>}
//                 {saving ? "Saving…" : "Save Permissions"}
//               </button>
//               <button type="button" onClick={()=>navigate(`/EditUser/${id||34}`)} disabled={saving}
//                 className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-slate-200
//                   hover:border-slate-300 text-slate-600 hover:text-slate-800 font-bold text-sm
//                   transition-all bg-white hover:bg-slate-50 disabled:opacity-50">
//                 ✕ Cancel
//               </button>
//             </div>

//             {/* Right: Preview + Save as Template */}
//             <div className="flex flex-col sm:flex-row gap-3">
//               <button type="button"
//                 onClick={()=>showToast("Preview mode — changes not yet saved.","error")}
//                 className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl
//                   bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm
//                   shadow-md shadow-blue-200 transition-all">
//                 <FiEye className="w-4 h-4"/> Preview Changes
//               </button>
//               <button type="button"
//                 onClick={()=>showToast("Saved as template successfully.")}
//                 className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl
//                   bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm
//                   shadow-md shadow-indigo-200 transition-all">
//                 <FiShield className="w-4 h-4"/> Save as Template
//               </button>
//             </div>
//           </div>
//           <p className="text-right text-xs text-slate-400 mt-3">
//             Changes will apply immediately on next login for the user.
//           </p>
//         </div>

//       </div>
//     </div>
//   );
// }



// src/components/UserPermissions/UserPermissions.jsx
// ─────────────────────────────────────────────────────────────
// User Permissions Page — Travel CRM
// Matches CRM design system: from-slate-50 via-blue-50/30
// Reference: company/users/user_permissions.php?user_id=34
// Features:
//   - Quick Actions: Apply Template, Bulk Select/Clear, Data Scope Default
//   - Core Functions group: Dashboard, Lead Management, Reminders, Master Data
//   - Admin Functions group: User Management, Bookings, Customers, Vendors, Settings
//   - Each section has "Toggle All" (Enable All) button
//   - Each permission row: Page name + path, Access toggle, Data Scope dropdown
//   - Bottom bar: Save Permissions, Cancel, Preview Changes, Save as Template
//   - Fully responsive on all devices
// ─────────────────────────────────────────────────────────────









// import { useState, useEffect, useCallback, useMemo } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import {
//   FiShield, FiArrowLeft, FiSave, FiChevronDown,
//   FiToggleLeft, FiToggleRight, FiEye, FiLayers,
//   FiAlertCircle, FiCheck,
// } from "react-icons/fi";
// import { FaUserShield, FaStar, FaCog } from "react-icons/fa";
// import { MdAdminPanelSettings } from "react-icons/md";

// import editUserService from "../services/profileEditUserService";
// import { userPermissionsService, permissionTemplateService } from "../services/profileUserPermissionsService";

// /* ─── DATA SCOPE OPTIONS ─────────────────────────────────────── */
// const SCOPE_OPTIONS = [
//   { value:"own",    label:"Own Records"     },
//   { value:"team",   label:"Team Records"    },
//   { value:"all",    label:"All Records"     },
//   { value:"none",   label:"No Access"       },
// ];

// /* ─── PERMISSION STRUCTURE ───────────────────────────────────── */
// const PERMISSION_GROUPS = [
//   {
//     groupId: "core",
//     groupLabel: "⭐ Core Functions",
//     icon: <FaStar className="w-4 h-4"/>,
//     sections: [
//       {
//         id: "dashboard", label: "Dashboard",
//         pages: [
//           { id:"dashboard_access", label:"Dashboard Access", path:"company/dashboard/index.php" },
//         ],
//       },
//       {
//         id: "lead_management", label: "Lead Management",
//         pages: [
//           { id:"list_leads",    label:"List Leads",    path:"company/leads/index.php"       },
//           { id:"create_lead",   label:"Create Lead",   path:"company/leads/create.php"      },
//           { id:"edit_lead",     label:"Edit Lead",     path:"company/leads/edit.php"        },
//           { id:"view_lead",     label:"View Lead",     path:"company/leads/view.php"        },
//           { id:"delete_lead",   label:"Delete Lead",   path:"company/leads/delete.php"      },
//           { id:"import_leads",  label:"Import Leads",  path:"company/leads/import.php"      },
//           { id:"lead_logs",     label:"Lead Logs",     path:"company/leads/logs.php"        },
//           { id:"add_lead_log",  label:"Add Lead Log",  path:"company/leads/add_lead_log.php"},
//         ],
//       },
//       {
//         id: "reminders", label: "Reminders",
//         pages: [
//           { id:"my_reminders",     label:"My Reminders",     path:"company/reminders/index.php"                  },
//           { id:"create_reminder",  label:"Create Reminder",  path:"company/reminders/create_reminder.php"        },
//           { id:"notifications",    label:"Notifications",    path:"company/reminders/notifications/access.php"   },
//           { id:"reminder_logs",    label:"Reminder Logs",    path:"company/reminders/logs.php"                   },
//           { id:"booking_reminders",label:"Booking Reminders",path:"company/reminders/booking_reminders.php"      },
//         ],
//       },
//       {
//         id: "master_data", label: "Master Data",
//         pages: [
//           { id:"list_cities",       label:"List Cities",        path:"company/masters/city/index.php"            },
//           { id:"create_city",       label:"Create City",        path:"company/masters/city/create.php"           },
//           { id:"edit_city",         label:"Edit City",          path:"company/masters/city/edit.php"             },
//           { id:"view_city",         label:"View City",          path:"company/masters/city/view.php"             },
//           { id:"delete_city",       label:"Delete City",        path:"company/masters/city/delete.php"           },
//           { id:"list_destinations", label:"List Destinations",  path:"company/masters/destinations/index.php"    },
//           { id:"create_destination",label:"Create Destination", path:"company/masters/destinations/create.php"   },
//           { id:"edit_destination",  label:"Edit Destination",   path:"company/masters/destinations/edit.php"     },
//           { id:"view_destination",  label:"View Destination",   path:"company/masters/destinations/view.php"     },
//           { id:"delete_destination",label:"Delete Destination", path:"company/masters/destinations/delete.php"   },
//           { id:"list_hotels",       label:"List Hotels",        path:"company/masters/hotel/index.php"           },
//           { id:"create_hotel",      label:"Create Hotel",       path:"company/masters/hotel/create.php"          },
//           { id:"edit_hotel",        label:"Edit Hotel",         path:"company/masters/hotel/edit.php"            },
//           { id:"view_hotel",        label:"View Hotel",         path:"company/masters/hotel/view.php"            },
//           { id:"delete_hotel",      label:"Delete Hotel",       path:"company/masters/hotel/delete.php"          },
//           { id:"list_airlines",     label:"List Airlines",      path:"company/masters/airline/index.php"         },
//           { id:"create_airline",    label:"Create Airline",     path:"company/masters/airline/create.php"        },
//           { id:"edit_airline",      label:"Edit Airline",       path:"company/masters/airline/edit.php"          },
//           { id:"view_airline",      label:"View Airline",       path:"company/masters/airline/view.php"          },
//           { id:"delete_airline",    label:"Delete Airline",     path:"company/masters/airline/delete.php"        },
//           { id:"list_cruises",      label:"List Cruises",       path:"company/masters/cruise/index.php"          },
//           { id:"create_cruise",     label:"Create Cruise",      path:"company/masters/cruise/create.php"         },
//           { id:"edit_cruise",       label:"Edit Cruise",        path:"company/masters/cruise/edit.php"           },
//           { id:"view_cruise",       label:"View Cruise",        path:"company/masters/cruise/view.php"           },
//           { id:"delete_cruise",     label:"Delete Cruise",      path:"company/masters/cruise/delete.php"         },
//           { id:"list_vehicles",     label:"List Vehicles",      path:"company/masters/vehicles/index.php"        },
//           { id:"create_vehicle",    label:"Create Vehicle",     path:"company/masters/vehicles/create.php"       },
//           { id:"edit_vehicle",      label:"Edit Vehicle",       path:"company/masters/vehicles/edit.php"         },
//           { id:"view_vehicle",      label:"View Vehicle",       path:"company/masters/vehicles/view.php"         },
//           { id:"delete_vehicle",    label:"Delete Vehicle",     path:"company/masters/vehicles/delete.php"       },
//           { id:"list_sightseeing",  label:"List Sightseeing",   path:"company/masters/sightseeing/index.php"     },
//           { id:"create_sightseeing",label:"Create Sightseeing", path:"company/masters/sightseeing/create.php"    },
//           { id:"edit_sightseeing",  label:"Edit Sightseeing",   path:"company/masters/sightseeing/edit.php"      },
//           { id:"view_sightseeing",  label:"View Sightseeing",   path:"company/masters/sightseeing/view.php"      },
//           { id:"delete_sightseeing",label:"Delete Sightseeing", path:"company/masters/sightseeing/delete.php"    },
//           { id:"list_addon",        label:"List Add-on Services",  path:"company/masters/add_on_services/index.php"  },
//           { id:"create_addon",      label:"Create Add-on Service", path:"company/masters/add_on_services/create.php" },
//           { id:"edit_addon",        label:"Edit Add-on Service",   path:"company/masters/add_on_services/edit.php"   },
//           { id:"view_addon",        label:"View Add-on Service",   path:"company/masters/add_on_services/view.php"   },
//           { id:"delete_addon",      label:"Delete Add-on Service", path:"company/masters/add_on_services/delete.php" },
//           { id:"list_testimonials", label:"List Testimonials",  path:"company/masters/testimonial/index.php"     },
//           { id:"create_testimonial",label:"Create Testimonial", path:"company/masters/testimonial/create.php"    },
//           { id:"edit_testimonial",  label:"Edit Testimonial",   path:"company/masters/testimonial/edit.php"      },
//           { id:"view_testimonial",  label:"View Testimonial",   path:"company/masters/testimonial/view.php"      },
//           { id:"delete_testimonial",label:"Delete Testimonial", path:"company/masters/testimonial/delete.php"    },
//         ],
//       },
//       {
//         id: "quotations", label: "Quotations",
//         pages: [
//           { id:"create_quotation",     label:"Create Quotation",     path:"company/quotations/view.php"              },
//           { id:"edit_quotation",       label:"Edit Quotation",       path:"company/quotations/edit.php"              },
//           { id:"view_quotation",       label:"View Quotation",       path:"company/quotations/view.php"              },
//           { id:"pdf_designer",         label:"PDF Designer",         path:"company/pdf_designer/designes/index.php"  },
//           { id:"quotation_templates",  label:"Quotation Templates",  path:"company/quotations/templates/index.php"   },
//           { id:"create_template",      label:"Create Template",      path:"company/quotations/templates/create.php"  },
//         ],
//       },
//     ],
//   },
//   {
//     groupId: "admin",
//     groupLabel: "⚙️ Admin Functions",
//     icon: <FaCog className="w-4 h-4"/>,
//     sections: [
//       {
//         id: "user_management", label: "User Management",
//         pages: [
//           { id:"list_users",            label:"List Users",            path:"company/users/list.php"             },
//           { id:"create_user",           label:"Create User",           path:"company/users/create.php"           },
//           { id:"edit_user",             label:"Edit User",             path:"company/users/edit.php"             },
//           { id:"delete_user",           label:"Delete User",           path:"company/users/delete.php"           },
//           { id:"manage_permissions",    label:"Manage Permissions",    path:"company/users/permissions.php"      },
//           { id:"permission_templates",  label:"Permission Templates",  path:"company/users/permission_templates.php" },
//         ],
//       },
//       {
//         id: "bookings", label: "Bookings",
//         pages: [
//           { id:"list_bookings",    label:"List Bookings",    path:"company/bookings/index.php"     },
//           { id:"create_booking",   label:"Create Booking",   path:"company/bookings/create.php"    },
//           { id:"edit_booking",     label:"Edit Booking",     path:"company/bookings/edit.php"      },
//           { id:"view_booking",     label:"View Booking",     path:"company/bookings/view.php"      },
//           { id:"cancel_booking",   label:"Cancel Booking",   path:"company/bookings/cancel.php"    },
//           { id:"manage_payments",  label:"Manage Payments",  path:"company/bookings/payments.php"  },
//           { id:"process_refunds",  label:"Process Refunds",  path:"company/bookings/refund.php"    },
//         ],
//       },
//       {
//         id: "customers", label: "Customers",
//         pages: [
//           { id:"list_customers",  label:"List Customers",  path:"company/customers/index.php"  },
//           { id:"create_customer", label:"Create Customer", path:"company/customers/create.php" },
//           { id:"edit_customer",   label:"Edit Customer",   path:"company/customers/edit.php"   },
//           { id:"view_customer",   label:"View Customer",   path:"company/customers/view.php"   },
//         ],
//       },
//       {
//         id: "vendors", label: "Vendors",
//         pages: [
//           { id:"list_vendors",   label:"List Vendors",   path:"company/vendors/index.php"   },
//           { id:"create_vendor",  label:"Create Vendor",  path:"company/vendors/create.php"  },
//           { id:"edit_vendor",    label:"Edit Vendor",    path:"company/vendors/edit.php"    },
//           { id:"view_vendor",    label:"View Vendor",    path:"company/vendors/view.php"    },
//         ],
//       },
//       {
//         id: "settings", label: "Settings",
//         pages: [
//           { id:"email_config",         label:"Email Configuration",   path:"company/settings/email/index.php"          },
//           { id:"test_email_settings",  label:"Test Email Settings",   path:"company/settings/email/test.php"           },
//           { id:"notification_settings",label:"Notification Settings", path:"company/settings/notifications/index.php"  },
//           { id:"whatsapp_settings",    label:"WhatsApp Settings",     path:"company/settings/whatsapp/index.php"       },
//         ],
//       },
//     ],
//   },
// ];

// const TEMPLATES = [
//   { value:"",        label:"Select a template..." },
//   { value:"basic",   label:"Basic Access Only"    },
//   { value:"sales",   label:"Sales Team Access"    },
//   { value:"support", label:"Support Access"       },
//   { value:"full",    label:"Full Access"          },
// ];

// /* Build the full catalog with everything disabled; saved values are overlaid after load. */
// function buildInitialState() {
//   const state = {};
//   PERMISSION_GROUPS.forEach(g => {
//     g.sections.forEach(sec => {
//       sec.pages.forEach(pg => {
//         state[pg.id] = { access: false, scope: "own" };
//       });
//     });
//   });
//   return state;
// }

// /* ─── TOAST ──────────────────────────────────────────────────── */
// function Toast({ msg, type, onClose }) {
//   useEffect(()=>{ const t=setTimeout(onClose,3800); return()=>clearTimeout(t); },[onClose]);
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

// /* ─── TOGGLE SWITCH ──────────────────────────────────────────── */
// function Toggle({ checked, onChange }) {
//   return (
//     <button type="button" onClick={()=>onChange(!checked)}
//       className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 flex-shrink-0
//         ${checked?"bg-blue-600":"bg-slate-300"}`}>
//       <span className={`inline-block w-3.5 h-3.5 rounded-full bg-white shadow transform transition-transform duration-200
//         ${checked?"translate-x-[18px]":"translate-x-0.5"}`}/>
//     </button>
//   );
// }

// /* ─── PERMISSION ROW ─────────────────────────────────────────── */
// function PermissionRow({ page, perm, onChange }) {
//   return (
//     <div className={`grid grid-cols-1 sm:grid-cols-[1fr_auto_200px] items-center gap-3 px-4 py-3
//       border-b border-slate-100 last:border-0 transition-colors
//       ${perm.access ? "bg-blue-50/30" : "hover:bg-slate-50/60"}`}>
//       {/* Page name + path */}
//       <div className="min-w-0">
//         <p className="text-sm font-semibold text-slate-800">{page.label}</p>
//         <p className="text-xs text-slate-400 font-mono truncate">{page.path}</p>
//       </div>
//       {/* Access toggle */}
//       <div className="flex items-center gap-2 sm:justify-center">
//         <span className="text-xs text-slate-500 sm:hidden font-medium">Access:</span>
//         <Toggle checked={perm.access} onChange={v=>onChange(page.id,"access",v)}/>
//       </div>
//       {/* Data Scope dropdown */}
//       <div className="relative">
//         <select
//           value={perm.scope}
//           onChange={e=>onChange(page.id,"scope",e.target.value)}
//           className="w-full pl-3 pr-8 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-600 font-medium
//             bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-50 outline-none appearance-none cursor-pointer transition-all">
//           {SCOPE_OPTIONS.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
//         </select>
//         <FiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none"/>
//       </div>
//     </div>
//   );
// }

// /* ─── PERMISSION SECTION ─────────────────────────────────────── */
// function PermissionSection({ section, permissions, onChange, onToggleAll }) {
//   const allEnabled = section.pages.every(pg => permissions[pg.id]?.access);
//   const someEnabled = section.pages.some(pg => permissions[pg.id]?.access);

//   return (
//     <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden mb-4">
//       {/* Section header */}
//       <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/60">
//         <div className="flex items-center gap-2">
//           <span className={`w-2 h-2 rounded-full flex-shrink-0 ${someEnabled?"bg-blue-500":"bg-slate-300"}`}/>
//           <h3 className="text-sm font-extrabold text-blue-600">{section.label}</h3>
//           <span className="text-xs text-slate-400 font-medium">
//             ({section.pages.filter(pg=>permissions[pg.id]?.access).length}/{section.pages.length})
//           </span>
//         </div>
//         <button
//           type="button"
//           onClick={()=>onToggleAll(section, !allEnabled)}
//           className={`text-xs font-bold px-3 py-1 rounded-lg border transition-all
//             ${allEnabled
//               ?"bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200"
//               :"bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100"}`}>
//           {allEnabled ? "Disable All" : "Enable All"}
//         </button>
//       </div>

//       {/* Table header (desktop) */}
//       <div className="hidden sm:grid grid-cols-[1fr_auto_200px] px-4 py-2 bg-slate-50/40 border-b border-slate-100">
//         <p className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Page</p>
//         <p className="text-xs font-extrabold text-slate-500 uppercase tracking-wider text-center px-6">Access</p>
//         <p className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Data Scope</p>
//       </div>

//       {/* Permission rows */}
//       {section.pages.map(pg=>(
//         <PermissionRow
//           key={pg.id}
//           page={pg}
//           perm={permissions[pg.id] || {access:false, scope:"own"}}
//           onChange={onChange}
//         />
//       ))}
//     </div>
//   );
// }

// /* ─── MAIN PAGE ──────────────────────────────────────────────── */
// export default function UserPermissions() {
//   const navigate = useNavigate();
//   const { id }   = useParams(); // /UserPermissions/34

//   const [user,       setUser]       = useState(null);
//   const [loading,    setLoading]    = useState(true);
//   const [saving,     setSaving]     = useState(false);
//   const [permissions,setPermissions]= useState(buildInitialState);
//   const [template,   setTemplate]   = useState("");
//   const [scopeDefault,setScopeDefault]= useState("own");
//   const [toast,      setToast]      = useState(null);

//   const showToast = useCallback((msg, type="success")=>setToast({msg,type}),[]);

//   /* load user + saved permissions, overlaid onto the full catalog */
//   useEffect(()=>{
//     setLoading(true);
//     Promise.all([
//       editUserService.getById(id),
//       userPermissionsService.getPermissions(id),
//     ])
//       .then(([uRes, pRes])=>{
//         setUser(uRes.data);
//         const saved = pRes.data?.permissions || {};
//         const base = buildInitialState();
//         Object.entries(saved).forEach(([k,v])=>{
//           if (base[k]) base[k] = { access: !!v.access, scope: v.scope || "own" };
//         });
//         setPermissions(base);
//       })
//       .catch(()=> showToast("Failed to load permissions.","error"))
//       .finally(()=> setLoading(false));
//   },[id, showToast]);

//   /* stats */
//   const stats = useMemo(()=>{
//     const allPages = PERMISSION_GROUPS.flatMap(g=>g.sections.flatMap(s=>s.pages));
//     const enabled = allPages.filter(pg=>permissions[pg.id]?.access).length;
//     return { total: allPages.length, enabled };
//   },[permissions]);

//   /* handlers */
//   const handleChange = useCallback((pageId, field, value) => {
//     setPermissions(prev=>({ ...prev, [pageId]:{ ...prev[pageId], [field]:value } }));
//   },[]);

//   const handleToggleAll = useCallback((section, enable) => {
//     setPermissions(prev=>{
//       const next = {...prev};
//       section.pages.forEach(pg=>{ next[pg.id]={...next[pg.id], access:enable}; });
//       return next;
//     });
//   },[]);

//   const handleSelectAll = () => {
//     setPermissions(prev=>{
//       const next={...prev};
//       Object.keys(next).forEach(k=>{ next[k]={...next[k],access:true}; });
//       return next;
//     });
//     showToast("All permissions enabled.");
//   };

//   const handleClearAll = () => {
//     setPermissions(prev=>{
//       const next={...prev};
//       Object.keys(next).forEach(k=>{ next[k]={...next[k],access:false}; });
//       return next;
//     });
//     showToast("All permissions cleared.");
//   };

//   const handleApplyScopeDefault = (scope) => {
//     setScopeDefault(scope);
//     setPermissions(prev=>{
//       const next={...prev};
//       Object.keys(next).forEach(k=>{ next[k]={...next[k],scope}; });
//       return next;
//     });
//     showToast(`Data scope set to "${SCOPE_OPTIONS.find(o=>o.value===scope)?.label}" for all pages.`);
//   };

//   const handleApplyTemplate = (tpl) => {
//     if(!tpl) return;
//     setTemplate(tpl);
//     if(tpl==="full"){
//       handleSelectAll();
//     } else if(tpl==="basic"){
//       setPermissions(prev=>{
//         const next={...prev};
//         Object.keys(next).forEach(k=>{ next[k]={...next[k],access:false}; });
//         ["dashboard_access","list_leads","my_reminders"].forEach(k=>{ if(next[k]) next[k].access=true; });
//         return next;
//       });
//       showToast("Basic Access template applied.");
//     } else if(tpl==="sales"){
//       setPermissions(prev=>{
//         const next={...prev};
//         Object.keys(next).forEach(k=>{ next[k]={...next[k],access:false}; });
//         ["dashboard_access","list_leads","create_lead","edit_lead","view_lead","my_reminders","create_reminder"].forEach(k=>{ if(next[k]) next[k].access=true; });
//         return next;
//       });
//       showToast("Sales Team Access template applied.");
//     } else {
//       showToast(`Template "${tpl}" applied.`);
//     }
//   };

//   const handleSave = async () => {
//     setSaving(true);
//     try {
//       await userPermissionsService.updatePermissions(id, permissions);
//       showToast("Permissions saved successfully! ✅");
//     } catch (err) {
//       showToast(err?.response?.data?.message || "Failed to save permissions.","error");
//     } finally { setSaving(false); }
//   };

//   const handleSaveAsTemplate = async () => {
//     const label = window.prompt("Template name:");
//     if (!label || !label.trim()) return;
//     try {
//       await permissionTemplateService.create({ label: label.trim(), permissions });
//       showToast(`Template "${label.trim()}" saved.`);
//     } catch (err) {
//       showToast(err?.response?.data?.message || "Failed to save template.","error");
//     }
//   };

//   if(loading){
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 flex items-center justify-center">
//         <div className="text-center space-y-3">
//           <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"/>
//           <p className="text-sm text-slate-500 font-medium">Loading permissions…</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100"
//       style={{fontFamily:"'Plus Jakarta Sans', system-ui, sans-serif"}}>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
//         @keyframes slideIn { from{transform:translateX(110%);opacity:0} to{transform:translateX(0);opacity:1} }
//         @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
//         .fade-up { animation: fadeUp .4s ease both; }
//         select { -webkit-appearance:none; appearance:none; }
//         ::-webkit-scrollbar{width:5px;height:5px}
//         ::-webkit-scrollbar-track{background:#f1f5f9;border-radius:99px}
//         ::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:99px}
//       `}</style>

//       {toast && <Toast msg={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}

//       {/* ── PAGE HEADER ── */}
//       <div className="bg-white/70 backdrop-blur-md border-b border-slate-100">
//         <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-5">
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//             <div className="flex items-center gap-4">
//               <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white shadow-lg shadow-blue-200 flex-shrink-0">
//                 <FaUserShield className="w-5 h-5"/>
//               </div>
//               <div>
//                 <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">User Permissions</h1>
//                 <p className="text-sm text-slate-400 mt-0.5">
//                   Managing permissions for{" "}
//                   <span className="font-bold text-blue-600">{user?.fullName}</span>
//                   <span className="hidden sm:inline ml-3 text-slate-300">|</span>
//                   <span className="hidden sm:inline ml-3 text-xs">
//                     <span className="hover:text-blue-600 cursor-pointer transition-colors" onClick={()=>navigate("/")}>Home</span>
//                     <span className="mx-1 text-slate-300">/</span>
//                     <span className="hover:text-blue-600 cursor-pointer transition-colors" onClick={()=>navigate("/Users")}>Permissions</span>
//                     <span className="mx-1 text-slate-300">/</span>
//                     <span className="text-blue-600 font-bold">{user?.fullName}</span>
//                   </span>
//                 </p>
//               </div>
//             </div>
//             <button type="button" onClick={()=>navigate(`/EditUser/${id||34}`)}
//               className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200
//                 hover:border-blue-300 bg-white hover:bg-blue-50 text-slate-600 hover:text-blue-600
//                 text-sm font-bold transition-all shadow-sm">
//               <FiArrowLeft className="w-4 h-4"/> Back to Edit User
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6 space-y-5">

//         {/* ── QUICK ACTIONS ── */}
//         <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/60 shadow-sm p-5 fade-up">
//           <h2 className="text-sm font-extrabold text-slate-700 mb-4 flex items-center gap-2">
//             <FiLayers className="w-4 h-4 text-blue-500"/> Quick Actions
//           </h2>
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">

//             {/* Apply Template */}
//             <div>
//               <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wide mb-1.5">Apply Template:</label>
//               <div className="flex gap-2">
//                 <div className="relative flex-1">
//                   <select value={template} onChange={e=>handleApplyTemplate(e.target.value)}
//                     className="w-full pl-3 pr-8 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-600 font-medium
//                       focus:border-blue-400 focus:ring-2 focus:ring-blue-50 outline-none appearance-none cursor-pointer transition-all">
//                     {TEMPLATES.map(t=><option key={t.value} value={t.value}>{t.label}</option>)}
//                   </select>
//                   <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none"/>
//                 </div>
//               </div>
//             </div>

//             {/* Bulk Actions */}
//             <div>
//               <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wide mb-1.5">Bulk Actions:</label>
//               <div className="flex gap-2">
//                 <button type="button" onClick={handleSelectAll}
//                   className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm shadow-blue-200">
//                   Select All Access
//                 </button>
//                 <button type="button" onClick={handleClearAll}
//                   className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all shadow-sm shadow-amber-200">
//                   Clear All
//                 </button>
//               </div>
//             </div>

//             {/* Data Scope Default */}
//             <div>
//               <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wide mb-1.5">Data Scope Default:</label>
//               <div className="relative">
//                 <select value={scopeDefault} onChange={e=>handleApplyScopeDefault(e.target.value)}
//                   className="w-full pl-3 pr-8 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-600 font-medium
//                     focus:border-blue-400 focus:ring-2 focus:ring-blue-50 outline-none appearance-none cursor-pointer transition-all">
//                   {SCOPE_OPTIONS.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
//                 </select>
//                 <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none"/>
//               </div>
//             </div>
//           </div>

//           {/* Stats pill */}
//           <div className="mt-4 flex items-center justify-between">
//             <div className="flex items-center gap-2">
//               <span className="text-xs text-slate-500 font-medium">Permissions enabled:</span>
//               <span className="text-xs font-extrabold text-blue-600 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full">
//                 {stats.enabled} / {stats.total}
//               </span>
//             </div>
//             <div className="flex-1 mx-4 bg-slate-200 rounded-full h-1.5 overflow-hidden max-w-[200px] ml-auto">
//               <div className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
//                 style={{width:`${Math.round((stats.enabled/stats.total)*100)}%`}}/>
//             </div>
//             <span className="text-xs font-bold text-slate-500">
//               {Math.round((stats.enabled/stats.total)*100)}%
//             </span>
//           </div>
//         </div>

//         {/* ── PERMISSION GROUPS ── */}
//         {PERMISSION_GROUPS.map(group=>(
//           <div key={group.groupId} className="fade-up">
//             {/* Group header */}
//             <div className="flex items-center gap-3 mb-3">
//               <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white flex-shrink-0">
//                 {group.icon}
//               </div>
//               <h2 className="text-base font-extrabold text-slate-800">{group.groupLabel}</h2>
//               <div className="flex-1 h-px bg-slate-200"/>
//             </div>

//             {/* Sections */}
//             {group.sections.map(section=>(
//               <PermissionSection
//                 key={section.id}
//                 section={section}
//                 permissions={permissions}
//                 onChange={handleChange}
//                 onToggleAll={handleToggleAll}
//               />
//             ))}
//           </div>
//         ))}

//         {/* ── BOTTOM ACTION BAR ── */}
//         <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/60 shadow-sm p-5 fade-up">
//           <div className="flex flex-col sm:flex-row items-stretch justify-between gap-3">
//             {/* Left: Save + Cancel */}
//             <div className="flex flex-col sm:flex-row gap-3">
//               <button type="button" onClick={handleSave} disabled={saving}
//                 className="flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl
//                   bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm
//                   shadow-md shadow-emerald-200 hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed">
//                 {saving
//                   ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/>
//                   : <FiSave className="w-4 h-4"/>}
//                 {saving ? "Saving…" : "Save Permissions"}
//               </button>
//               <button type="button" onClick={()=>navigate(`/EditUser/${id||34}`)} disabled={saving}
//                 className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-slate-200
//                   hover:border-slate-300 text-slate-600 hover:text-slate-800 font-bold text-sm
//                   transition-all bg-white hover:bg-slate-50 disabled:opacity-50">
//                 ✕ Cancel
//               </button>
//             </div>

//             {/* Right: Preview + Save as Template */}
//             <div className="flex flex-col sm:flex-row gap-3">
//               <button type="button"
//                 onClick={()=>showToast("Preview mode — changes not yet saved.","error")}
//                 className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl
//                   bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm
//                   shadow-md shadow-blue-200 transition-all">
//                 <FiEye className="w-4 h-4"/> Preview Changes
//               </button>
//               <button type="button"
//                 onClick={handleSaveAsTemplate}
//                 className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl
//                   bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm
//                   shadow-md shadow-indigo-200 transition-all">
//                 <FiShield className="w-4 h-4"/> Save as Template
//               </button>
//             </div>
//           </div>
//           <p className="text-right text-xs text-slate-400 mt-3">
//             Changes will apply immediately on next login for the user.
//           </p>
//         </div>

//       </div>
//     </div>
//   );
// }




// src/components/UserPermissions/UserPermissions.jsx
// ─────────────────────────────────────────────────────────────
// User Permissions Page — Travel CRM
// Matches CRM design system: from-slate-50 via-blue-50/30
// Reference: company/users/user_permissions.php?user_id=34
// Features:
//   - Quick Actions: Apply Template, Bulk Select/Clear, Data Scope Default
//   - Core Functions group: Dashboard, Lead Management, Reminders, Master Data
//   - Admin Functions group: User Management, Bookings, Customers, Vendors, Settings
//   - Each section has "Toggle All" (Enable All) button
//   - Each permission row: Page name + path, Access toggle, Data Scope dropdown
//   - Bottom bar: Save Permissions, Cancel, Preview Changes, Save as Template
//   - Fully responsive on all devices
// ─────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  FiShield, FiArrowLeft, FiSave, FiChevronDown,
  FiToggleLeft, FiToggleRight, FiEye, FiLayers,
  FiAlertCircle, FiCheck,
} from "react-icons/fi";
import { FaUserShield, FaStar, FaCog } from "react-icons/fa";
import { MdAdminPanelSettings } from "react-icons/md";

import editUserService from "../services/profileEditUserService";
import { userPermissionsService, permissionTemplateService, permissionCatalogService } from "../services/profileUserPermissionsService";

/* ─── DATA SCOPE OPTIONS ─────────────────────────────────────── */
const SCOPE_OPTIONS = [
  { value:"own",    label:"Own Records"     },
  { value:"team",   label:"Team Records"    },
  { value:"all",    label:"All Records"     },
  { value:"none",   label:"No Access"       },
];

/* ─── PERMISSION STRUCTURE ───────────────────────────────────── */
// Real permission catalog — keys are identical to the backend Permission enum
// (and access.js). Each page `id` IS the authority key saved into the permissions
// map, so what you toggle here is exactly what the backend enforces.
const PERMISSION_GROUPS = [
  {
    groupId: "crm",
    groupLabel: "⭐ CRM",
    icon: <FaStar className="w-4 h-4"/>,
    sections: [
      { id: "leads", label: "Leads", pages: [
        { id: "LEAD_READ",   label: "View Leads",   path: "LEAD_READ" },
        { id: "LEAD_CREATE", label: "Create Lead",  path: "LEAD_CREATE" },
        { id: "LEAD_UPDATE", label: "Edit Lead",    path: "LEAD_UPDATE" },
        { id: "LEAD_DELETE", label: "Delete Lead",  path: "LEAD_DELETE" },
      ]},
      { id: "bookings", label: "Bookings", pages: [
        { id: "BOOKING_READ",   label: "View Bookings",  path: "BOOKING_READ" },
        { id: "BOOKING_CREATE", label: "Create Booking", path: "BOOKING_CREATE" },
        { id: "BOOKING_UPDATE", label: "Edit Booking",   path: "BOOKING_UPDATE" },
        { id: "BOOKING_DELETE", label: "Delete Booking", path: "BOOKING_DELETE" },
      ]},
      { id: "customers", label: "Customers", pages: [
        { id: "CUSTOMER_READ",   label: "View Customers",  path: "CUSTOMER_READ" },
        { id: "CUSTOMER_CREATE", label: "Create Customer", path: "CUSTOMER_CREATE" },
        { id: "CUSTOMER_UPDATE", label: "Edit Customer",   path: "CUSTOMER_UPDATE" },
        { id: "CUSTOMER_DELETE", label: "Delete Customer", path: "CUSTOMER_DELETE" },
      ]},
      { id: "quotations", label: "Quotations", pages: [
        { id: "QUOTATION_READ",   label: "View Quotations",  path: "QUOTATION_READ" },
        { id: "QUOTATION_CREATE", label: "Create Quotation", path: "QUOTATION_CREATE" },
        { id: "QUOTATION_UPDATE", label: "Edit Quotation",   path: "QUOTATION_UPDATE" },
        { id: "QUOTATION_DELETE", label: "Delete Quotation", path: "QUOTATION_DELETE" },
      ]},
      { id: "vendors", label: "Vendors", pages: [
        { id: "VENDOR_READ",   label: "View Vendors",  path: "VENDOR_READ" },
        { id: "VENDOR_CREATE", label: "Create Vendor", path: "VENDOR_CREATE" },
        { id: "VENDOR_UPDATE", label: "Edit Vendor",   path: "VENDOR_UPDATE" },
        { id: "VENDOR_DELETE", label: "Delete Vendor", path: "VENDOR_DELETE" },
      ]},
      { id: "reminders", label: "Reminders", pages: [
        { id: "REMINDER_READ",   label: "View Reminders",  path: "REMINDER_READ" },
        { id: "REMINDER_CREATE", label: "Create Reminder", path: "REMINDER_CREATE" },
        { id: "REMINDER_UPDATE", label: "Edit Reminder",   path: "REMINDER_UPDATE" },
        { id: "REMINDER_DELETE", label: "Delete Reminder", path: "REMINDER_DELETE" },
      ]},
      { id: "masters", label: "Master Data", pages: [
        { id: "MASTER_READ",   label: "View Master Data",               path: "MASTER_READ" },
        { id: "MASTER_MANAGE", label: "Create / Edit / Delete Masters", path: "MASTER_MANAGE" },
      ]},
      { id: "reports", label: "Reports", pages: [
        { id: "REPORT_VIEW", label: "View Reports", path: "REPORT_VIEW" },
      ]},
    ],
  },
  {
    groupId: "admin",
    groupLabel: "⚙️ Administration",
    icon: <FaCog className="w-4 h-4"/>,
    sections: [
      { id: "users", label: "User Management", pages: [
        { id: "USER_READ",   label: "View Users",              path: "USER_READ" },
        { id: "USER_CREATE", label: "Create User",             path: "USER_CREATE" },
        { id: "USER_UPDATE", label: "Edit User / Permissions", path: "USER_UPDATE" },
        { id: "USER_DELETE", label: "Delete User",             path: "USER_DELETE" },
      ]},
      { id: "settings", label: "Settings", pages: [
        { id: "SETTINGS_MANAGE", label: "Manage Company Settings", path: "SETTINGS_MANAGE" },
      ]},
    ],
  },
];

const TEMPLATES = [
  { value:"",        label:"Select a template..." },
  { value:"basic",   label:"Basic Access Only"    },
  { value:"sales",   label:"Sales Team Access"    },
  { value:"support", label:"Support Access"       },
  { value:"full",    label:"Full Access"          },
];

/* Build the full catalog with everything disabled; saved values are overlaid after load. */
function buildInitialState(groups) {
  const state = {};
  (groups || PERMISSION_GROUPS).forEach(g => {
    g.sections.forEach(sec => {
      sec.pages.forEach(pg => {
        state[pg.id] = { access: false, scope: "own" };
      });
    });
  });
  return state;
}

/* Build the grid groups from the backend catalog (GET /api/permissions/catalog).
   Same shape as PERMISSION_GROUPS so rendering is unchanged; icons are added here
   (the backend sends data only). User Management + Settings → Administration group. */
function buildGroupsFromCatalog(modules) {
  const ADMIN = new Set(["User Management", "Settings"]);
  const crm = [], admin = [];
  (modules || []).forEach(m => {
    const section = {
      id: String(m.module || "").toLowerCase().replace(/[^a-z0-9]+/g, "_"),
      label: m.module,
      pages: (m.permissions || []).map(p => ({ id: p.key, label: p.label, path: p.key })),
    };
    (ADMIN.has(m.module) ? admin : crm).push(section);
  });
  const groups = [];
  if (crm.length)   groups.push({ groupId:"crm",   groupLabel:"⭐ CRM",            icon:<FaStar className="w-4 h-4"/>, sections:crm });
  if (admin.length) groups.push({ groupId:"admin", groupLabel:"⚙️ Administration", icon:<FaCog className="w-4 h-4"/>,  sections:admin });
  return groups.length ? groups : PERMISSION_GROUPS;
}

/* ─── TOAST ──────────────────────────────────────────────────── */
function Toast({ msg, type, onClose }) {
  useEffect(()=>{ const t=setTimeout(onClose,3800); return()=>clearTimeout(t); },[onClose]);
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

/* ─── TOGGLE SWITCH ──────────────────────────────────────────── */
function Toggle({ checked, onChange }) {
  return (
    <button type="button" onClick={()=>onChange(!checked)}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 flex-shrink-0
        ${checked?"bg-blue-600":"bg-slate-300"}`}>
      <span className={`inline-block w-3.5 h-3.5 rounded-full bg-white shadow transform transition-transform duration-200
        ${checked?"translate-x-[18px]":"translate-x-0.5"}`}/>
    </button>
  );
}

/* ─── PERMISSION ROW ─────────────────────────────────────────── */
function PermissionRow({ page, perm, onChange }) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-[1fr_auto_200px] items-center gap-3 px-4 py-3
      border-b border-slate-100 last:border-0 transition-colors
      ${perm.access ? "bg-blue-50/30" : "hover:bg-slate-50/60"}`}>
      {/* Page name + path */}
      <div className="min-w-0">
        <p className="text-sm font-semibold text-slate-800">{page.label}</p>
        <p className="text-xs text-slate-400 font-mono truncate">{page.path}</p>
      </div>
      {/* Access toggle */}
      <div className="flex items-center gap-2 sm:justify-center">
        <span className="text-xs text-slate-500 sm:hidden font-medium">Access:</span>
        <Toggle checked={perm.access} onChange={v=>onChange(page.id,"access",v)}/>
      </div>
      {/* Data Scope dropdown */}
      <div className="relative">
        <select
          value={perm.scope}
          onChange={e=>onChange(page.id,"scope",e.target.value)}
          className="w-full pl-3 pr-8 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-600 font-medium
            bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-50 outline-none appearance-none cursor-pointer transition-all">
          {SCOPE_OPTIONS.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <FiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none"/>
      </div>
    </div>
  );
}

/* ─── PERMISSION SECTION ─────────────────────────────────────── */
function PermissionSection({ section, permissions, onChange, onToggleAll }) {
  const allEnabled = section.pages.every(pg => permissions[pg.id]?.access);
  const someEnabled = section.pages.some(pg => permissions[pg.id]?.access);

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden mb-4">
      {/* Section header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/60">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${someEnabled?"bg-blue-500":"bg-slate-300"}`}/>
          <h3 className="text-sm font-extrabold text-blue-600">{section.label}</h3>
          <span className="text-xs text-slate-400 font-medium">
            ({section.pages.filter(pg=>permissions[pg.id]?.access).length}/{section.pages.length})
          </span>
        </div>
        <button
          type="button"
          onClick={()=>onToggleAll(section, !allEnabled)}
          className={`text-xs font-bold px-3 py-1 rounded-lg border transition-all
            ${allEnabled
              ?"bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200"
              :"bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100"}`}>
          {allEnabled ? "Disable All" : "Enable All"}
        </button>
      </div>

      {/* Table header (desktop) */}
      <div className="hidden sm:grid grid-cols-[1fr_auto_200px] px-4 py-2 bg-slate-50/40 border-b border-slate-100">
        <p className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Page</p>
        <p className="text-xs font-extrabold text-slate-500 uppercase tracking-wider text-center px-6">Access</p>
        <p className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Data Scope</p>
      </div>

      {/* Permission rows */}
      {section.pages.map(pg=>(
        <PermissionRow
          key={pg.id}
          page={pg}
          perm={permissions[pg.id] || {access:false, scope:"own"}}
          onChange={onChange}
        />
      ))}
    </div>
  );
}

/* ─── MAIN PAGE ──────────────────────────────────────────────── */
export default function UserPermissions() {
  const navigate = useNavigate();
  const { id }   = useParams(); // /UserPermissions/34

  const [user,       setUser]       = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [saving,     setSaving]     = useState(false);
  const [permissions,setPermissions]= useState(buildInitialState);
  const [template,   setTemplate]   = useState("");
  const [scopeDefault,setScopeDefault]= useState("own");
  const [toast,      setToast]      = useState(null);
  // Permission catalog fetched from the backend — single source of truth.
  // Falls back to the static PERMISSION_GROUPS until the fetch resolves.
  const [permissionGroups, setPermissionGroups] = useState(PERMISSION_GROUPS);

  const showToast = useCallback((msg, type="success")=>setToast({msg,type}),[]);

  // Same grid editor, two modes:
  //   /UserPermissions/:id          → edit a USER's permissions
  //   /UserPermissions/template/:id → edit a TEMPLATE's permissions
  const location   = useLocation();
  const isTemplate = location.pathname.includes("/UserPermissions/template/");

  /* load user (or template) + saved permissions, overlaid onto the full catalog */
  useEffect(()=>{
    setLoading(true);

    const overlay = (groups, saved) => {
      const base = buildInitialState(groups);
      Object.entries(saved || {}).forEach(([k,v])=>{
        if (base[k]) base[k] = { access: !!v.access, scope: v.scope || "own" };
      });
      setPermissions(base);
    };

    // 1) Load the catalog (single source of truth), then 2) the saved permissions.
    permissionCatalogService.getCatalog()
      .then((cat)=> (cat && cat.length) ? buildGroupsFromCatalog(cat) : PERMISSION_GROUPS)
      .catch(()=> PERMISSION_GROUPS)
      .then((groups)=>{
        setPermissionGroups(groups);
        if (isTemplate) {
          // Template mode — load the template and edit ALL its permissions.
          return permissionTemplateService.getByValue(id).then((res)=>{
            const tpl = res.data || {};
            setUser({ fullName: tpl.label || "Template", username: tpl.value || id, _template: tpl });
            overlay(groups, tpl.permissions);
          });
        }
        return Promise.all([
          editUserService.getById(id),
          userPermissionsService.getPermissions(id),
        ]).then(([uRes, pRes])=>{
          setUser(uRes.data);
          overlay(groups, pRes.data?.permissions);
        });
      })
      .catch(()=> showToast("Failed to load permissions.","error"))
      .finally(()=> setLoading(false));
  },[id, isTemplate, showToast]);

  /* stats */
  const stats = useMemo(()=>{
    const allPages = permissionGroups.flatMap(g=>g.sections.flatMap(s=>s.pages));
    const enabled = allPages.filter(pg=>permissions[pg.id]?.access).length;
    return { total: allPages.length, enabled };
  },[permissions, permissionGroups]);

  /* handlers */
  const handleChange = useCallback((pageId, field, value) => {
    setPermissions(prev=>({ ...prev, [pageId]:{ ...prev[pageId], [field]:value } }));
  },[]);

  const handleToggleAll = useCallback((section, enable) => {
    setPermissions(prev=>{
      const next = {...prev};
      section.pages.forEach(pg=>{ next[pg.id]={...next[pg.id], access:enable}; });
      return next;
    });
  },[]);

  const handleSelectAll = () => {
    setPermissions(prev=>{
      const next={...prev};
      Object.keys(next).forEach(k=>{ next[k]={...next[k],access:true}; });
      return next;
    });
    showToast("All permissions enabled.");
  };

  const handleClearAll = () => {
    setPermissions(prev=>{
      const next={...prev};
      Object.keys(next).forEach(k=>{ next[k]={...next[k],access:false}; });
      return next;
    });
    showToast("All permissions cleared.");
  };

  const handleApplyScopeDefault = (scope) => {
    setScopeDefault(scope);
    setPermissions(prev=>{
      const next={...prev};
      Object.keys(next).forEach(k=>{ next[k]={...next[k],scope}; });
      return next;
    });
    showToast(`Data scope set to "${SCOPE_OPTIONS.find(o=>o.value===scope)?.label}" for all pages.`);
  };

  const handleApplyTemplate = (tpl) => {
    if(!tpl) return;
    setTemplate(tpl);
    if(tpl==="full"){
      handleSelectAll();
    } else if(tpl==="basic"){
      setPermissions(prev=>{
        const next={...prev};
        Object.keys(next).forEach(k=>{ next[k]={...next[k],access:false}; });
        ["LEAD_READ","BOOKING_READ","CUSTOMER_READ","REMINDER_READ"].forEach(k=>{ if(next[k]) next[k].access=true; });
        return next;
      });
      showToast("Basic Access template applied.");
    } else if(tpl==="sales"){
      setPermissions(prev=>{
        const next={...prev};
        Object.keys(next).forEach(k=>{ next[k]={...next[k],access:false}; });
        ["LEAD_READ","LEAD_CREATE","LEAD_UPDATE","BOOKING_READ","BOOKING_CREATE","CUSTOMER_READ","CUSTOMER_CREATE","QUOTATION_READ","QUOTATION_CREATE","REMINDER_READ","REMINDER_CREATE"].forEach(k=>{ if(next[k]) next[k].access=true; });
        return next;
      });
      showToast("Sales Team Access template applied.");
    } else {
      showToast(`Template "${tpl}" applied.`);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (isTemplate) {
        const tpl = user?._template || {};
        await permissionTemplateService.update(id, {
          label:       tpl.label || user?.fullName,
          description: tpl.description || "",
          isDefault:   !!tpl.isDefault,
          permissions,
        });
        showToast("Template permissions saved successfully! ✅");
      } else {
        await userPermissionsService.updatePermissions(id, permissions);
        showToast("Permissions saved successfully! ✅");
      }
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed to save permissions.","error");
    } finally { setSaving(false); }
  };

  const handleSaveAsTemplate = async () => {
    const label = window.prompt("Template name:");
    if (!label || !label.trim()) return;
    try {
      await permissionTemplateService.create({ label: label.trim(), permissions });
      showToast(`Template "${label.trim()}" saved.`);
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed to save template.","error");
    }
  };

  if(loading){
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"/>
          <p className="text-sm text-slate-500 font-medium">Loading permissions…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100"
      style={{fontFamily:"'Plus Jakarta Sans', system-ui, sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        @keyframes slideIn { from{transform:translateX(110%);opacity:0} to{transform:translateX(0);opacity:1} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        .fade-up { animation: fadeUp .4s ease both; }
        select { -webkit-appearance:none; appearance:none; }
        ::-webkit-scrollbar{width:5px;height:5px}
        ::-webkit-scrollbar-track{background:#f1f5f9;border-radius:99px}
        ::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:99px}
      `}</style>

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}

      {/* ── PAGE HEADER ── */}
      <div className="bg-white/70 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white shadow-lg shadow-blue-200 flex-shrink-0">
                <FaUserShield className="w-5 h-5"/>
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">User Permissions</h1>
                <p className="text-sm text-slate-400 mt-0.5">
                  Managing permissions for{" "}
                  <span className="font-bold text-blue-600">{user?.fullName}</span>
                  <span className="hidden sm:inline ml-3 text-slate-300">|</span>
                  <span className="hidden sm:inline ml-3 text-xs">
                    <span className="hover:text-blue-600 cursor-pointer transition-colors" onClick={()=>navigate("/")}>Home</span>
                    <span className="mx-1 text-slate-300">/</span>
                    <span className="hover:text-blue-600 cursor-pointer transition-colors" onClick={()=>navigate("/Users")}>Permissions</span>
                    <span className="mx-1 text-slate-300">/</span>
                    <span className="text-blue-600 font-bold">{user?.fullName}</span>
                  </span>
                </p>
              </div>
            </div>
            <button type="button" onClick={()=>navigate(isTemplate ? "/PermissionTemplates" : `/EditUser/${id}`)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200
                hover:border-blue-300 bg-white hover:bg-blue-50 text-slate-600 hover:text-blue-600
                text-sm font-bold transition-all shadow-sm">
              <FiArrowLeft className="w-4 h-4"/> {isTemplate ? "Back to Templates" : "Back to Edit User"}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6 space-y-5">

        {/* ── QUICK ACTIONS ── */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/60 shadow-sm p-5 fade-up">
          <h2 className="text-sm font-extrabold text-slate-700 mb-4 flex items-center gap-2">
            <FiLayers className="w-4 h-4 text-blue-500"/> Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">

            {/* Apply Template */}
            <div>
              <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wide mb-1.5">Apply Template:</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <select value={template} onChange={e=>handleApplyTemplate(e.target.value)}
                    className="w-full pl-3 pr-8 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-600 font-medium
                      focus:border-blue-400 focus:ring-2 focus:ring-blue-50 outline-none appearance-none cursor-pointer transition-all">
                    {TEMPLATES.map(t=><option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                  <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none"/>
                </div>
              </div>
            </div>

            {/* Bulk Actions */}
            <div>
              <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wide mb-1.5">Bulk Actions:</label>
              <div className="flex gap-2">
                <button type="button" onClick={handleSelectAll}
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm shadow-blue-200">
                  Select All Access
                </button>
                <button type="button" onClick={handleClearAll}
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all shadow-sm shadow-amber-200">
                  Clear All
                </button>
              </div>
            </div>

            {/* Data Scope Default */}
            <div>
              <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wide mb-1.5">Data Scope Default:</label>
              <div className="relative">
                <select value={scopeDefault} onChange={e=>handleApplyScopeDefault(e.target.value)}
                  className="w-full pl-3 pr-8 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-600 font-medium
                    focus:border-blue-400 focus:ring-2 focus:ring-blue-50 outline-none appearance-none cursor-pointer transition-all">
                  {SCOPE_OPTIONS.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none"/>
              </div>
            </div>
          </div>

          {/* Stats pill */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Permissions enabled:</span>
              <span className="text-xs font-extrabold text-blue-600 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full">
                {stats.enabled} / {stats.total}
              </span>
            </div>
            <div className="flex-1 mx-4 bg-slate-200 rounded-full h-1.5 overflow-hidden max-w-[200px] ml-auto">
              <div className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
                style={{width:`${Math.round((stats.enabled/stats.total)*100)}%`}}/>
            </div>
            <span className="text-xs font-bold text-slate-500">
              {Math.round((stats.enabled/stats.total)*100)}%
            </span>
          </div>
        </div>

        {/* ── PERMISSION GROUPS ── */}
        {permissionGroups.map(group=>(
          <div key={group.groupId} className="fade-up">
            {/* Group header */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white flex-shrink-0">
                {group.icon}
              </div>
              <h2 className="text-base font-extrabold text-slate-800">{group.groupLabel}</h2>
              <div className="flex-1 h-px bg-slate-200"/>
            </div>

            {/* Sections */}
            {group.sections.map(section=>(
              <PermissionSection
                key={section.id}
                section={section}
                permissions={permissions}
                onChange={handleChange}
                onToggleAll={handleToggleAll}
              />
            ))}
          </div>
        ))}

        {/* ── BOTTOM ACTION BAR ── */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/60 shadow-sm p-5 fade-up">
          <div className="flex flex-col sm:flex-row items-stretch justify-between gap-3">
            {/* Left: Save + Cancel */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button type="button" onClick={handleSave} disabled={saving}
                className="flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl
                  bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm
                  shadow-md shadow-emerald-200 hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed">
                {saving
                  ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/>
                  : <FiSave className="w-4 h-4"/>}
                {saving ? "Saving…" : "Save Permissions"}
              </button>
              <button type="button" onClick={()=>navigate(isTemplate ? "/PermissionTemplates" : `/EditUser/${id}`)} disabled={saving}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-slate-200
                  hover:border-slate-300 text-slate-600 hover:text-slate-800 font-bold text-sm
                  transition-all bg-white hover:bg-slate-50 disabled:opacity-50">
                ✕ Cancel
              </button>
            </div>

            {/* Right: Preview + Save as Template */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button type="button"
                onClick={()=>showToast("Preview mode — changes not yet saved.","error")}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl
                  bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm
                  shadow-md shadow-blue-200 transition-all">
                <FiEye className="w-4 h-4"/> Preview Changes
              </button>
              <button type="button"
                onClick={handleSaveAsTemplate}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl
                  bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm
                  shadow-md shadow-indigo-200 transition-all">
                <FiShield className="w-4 h-4"/> Save as Template
              </button>
            </div>
          </div>
          <p className="text-right text-xs text-slate-400 mt-3">
            Changes will apply immediately on next login for the user.
          </p>
        </div>

      </div>
    </div>
  );
}