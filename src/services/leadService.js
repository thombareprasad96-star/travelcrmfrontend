



// import API from "./axiosInstance";

// // ── Transformer: React form → Backend DTO ────────────────
// function transformFormData(formData, services = [], itinerary = []) {
//   return {
//     customerName:   formData.customerName?.trim()  || "",
//     phone:          formData.phone?.trim()          || "",
//     email:          formData.email?.trim()          || "",
//     leadSource:     formData.leadSource             || "Direct",
//     leadType:       formData.leadType               || "Hot",
//     leadStage:      formData.leadStage              || "New Lead",
//     assignedUserId: formData.assignedUserId         || null,
//     birthDate:      formData.birthDate              || null,
//     travelDate:     formData.travelDate             || null,
//     departCountry:  formData.departCountry          || "Not Specified",
//     departCity:     formData.departCity             || "Not Specified",
//     rooms:          Number(formData.rooms)          || 1,
//     adults:         Number(formData.adults)         || 1,
//     children:       Number(formData.children)       || 0,
//     infants:        Number(formData.infants)        || 0,
//     extraBeds:      Number(formData.extraBeds)      || 0,
//     notes:          formData.notes?.trim()          || "",
//     services:       Array.isArray(services) ? services : [],
//     itinerary: (Array.isArray(itinerary) ? itinerary : []).map(
//       ({ destination, city, nights }, index) => ({
//         destination: destination?.trim() || "",
//         city:        city?.trim()        || "",
//         nights:      Number(nights)      || 0,
//         dayNumber:   index + 1,
//       })
//     ),
//   };
// }

// export const leadService = {

//   // ── CREATE ────────────────────────────────────────────────
//   createLead: (formData, services, itinerary) =>
//     API.post("/leads", transformFormData(formData, services, itinerary)),

//   // ── GET ALL ───────────────────────────────────────────────
//   getAllLeads: (page = 0, size = 100) =>
//     API.get(`/leads?page=${page}&size=${size}`),

//   // ── GET BY PUBLIC ID ──────────────────────────────────────
//   // CreateQuotation.jsx mein leadId se lead data fetch karne ke liye
//   // URL: GET /api/leads/{publicId}
//   getLeadById: (publicId) =>
//     API.get(`/leads/${publicId}`),

//   // ── UPDATE ────────────────────────────────────────────────
//   updateLead: (publicId, formData, services, itinerary) =>
//     API.put(`/leads/${publicId}`, transformFormData(formData, services, itinerary)),

//   // ── DELETE ────────────────────────────────────────────────
//   deleteLead: (publicId) =>
//     API.delete(`/leads/${publicId}`),

//   // ── SEARCH ───────────────────────────────────────────────
//   searchByPhone: (phone) =>
//     API.get("/leads/search", { params: { keyword: phone } }),

//   // ── USERS (Assign To dropdown) ────────────────────────────
//   getUsers: () =>
//     API.get("/users"),

//   // ── STATISTICS ───────────────────────────────────────────
//   getUserWorkload: () =>
//     API.get("/leads/stats/workload"),

//   getLeadsByStagePerUser: () =>
//     API.get("/leads/stats/by-stage"),

//   getLeadCountForUser: (userPublicId) =>
//     API.get(`/leads/stats/users/${userPublicId}/count`),
// };



// // import axios from "axios";

// // const API = axios.create({
// //   baseURL: "http://localhost:8080/api",
// //   headers: { "Content-Type": "application/json" },
// // });

// // // Transform React form data → Java DTO shape
// // function transformFormData(formData, services, itinerary) {
// //   return {
// //     customerName:  formData.customerName,
// //     phone:         formData.phone,
// //     email:         formData.email,
// //     leadSource:    formData.leadSource,
// //     leadType:      formData.leadType,
// //     leadStage:     formData.leadStage || "New Lead",
// //     assignTo:      formData.assignTo,
// //     birthDate:     formData.birthDate || null,
// //     travelDate:    formData.travelDate || null,
// //     departCountry: formData.departCountry,
// //     departCity:    formData.departCity,
// //     rooms:         formData.rooms    || 1,
// //     adults:        formData.adults   || 1,
// //     children:      formData.children || 0,
// //     infants:       formData.infants  || 0,
// //     extraBeds:     formData.extraBeds|| 0,
// //     services:      services,
// //     notes:         formData.notes,
// //     itinerary:     itinerary.map(({ destination, city, nights }) => ({
// //       destination, city, nights
// //     })),
// //   };
// // }

// // export const leadService = {
// //   createLead: (formData, services, itinerary) =>
// //     API.post("/leads", transformFormData(formData, services, itinerary)),

// //   searchByPhone: (phone) =>
// //     API.get("/leads/search", { params: { phone } }),

// //   getAllLeads: () =>
// //     API.get("/leads"),
// // };









// // import axios from "axios";

// // const API = axios.create({
// //   baseURL: "http://localhost:8080/api",
// //   headers: { "Content-Type": "application/json" },
// // });

// // // 👉 Attach JWT token automatically to every request
// // API.interceptors.request.use((config) => {
// //   const token = localStorage.getItem("token");

// //   if (token) {
// //     config.headers.Authorization = `Bearer ${token}`;
// //   }

// //   return config;
// // });

// // // Transform React form data → Java DTO shape
// // function transformFormData(formData, services, itinerary) {
// //   return {
// //     customerName: formData.customerName,
// //     phone: formData.phone,
// //     email: formData.email,
// //     leadSource: formData.leadSource,
// //     leadType: formData.leadType,
// //     leadStage: formData.leadStage || "New Lead",
// //     assignTo: formData.assignTo,
// //     birthDate: formData.birthDate || null,
// //     travelDate: formData.travelDate || null,
// //     departCountry: formData.departCountry,
// //     departCity: formData.departCity,
// //     rooms: formData.rooms || 1,
// //     adults: formData.adults || 1,
// //     children: formData.children || 0,
// //     infants: formData.infants || 0,
// //     extraBeds: formData.extraBeds || 0,
// //     services: services,
// //     notes: formData.notes,
// //     itinerary: itinerary.map(({ destination, city, nights }) => ({
// //       destination,
// //       city,
// //       nights,
// //     })),
// //   };
// // }

// // export const leadService = {
// //   createLead: (formData, services, itinerary) =>
// //     API.post("/leads", transformFormData(formData, services, itinerary)),

// //   searchByPhone: (phone) =>
// //     API.get("/leads/search", { params: { phone } }),

// //   getAllLeads: () =>
// //     API.get("/leads"),
// // };








// import axios from "axios";

// const API = axios.create({
//   baseURL: "http://localhost:8080/api",
//   headers: { "Content-Type": "application/json" },
// });

// // 👉 Attach JWT token automatically to every request
// API.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");

//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   return config;
// });

// // Transform React form data → Java DTO shape
// // Added default empty arrays for services and itinerary to prevent .map() crashes
// function transformFormData(formData, services = [], itinerary = []) {
//   return {
//     customerName: formData.customerName,
//     phone: formData.phone,
//     email: formData.email,
    
//     // Fallbacks to prevent "NotNull" validation errors from the backend
//     leadSource: formData.leadSource || "Direct", 
//     leadType: formData.leadType || "Hot",
//     leadStage: formData.leadStage || "New Lead",
    
//     assignTo: formData.assignTo,
//     birthDate: formData.birthDate || null,
//     travelDate: formData.travelDate || null,
//     departCountry: formData.departCountry || "Not Specified",
//     departCity: formData.departCity || "Not Specified",
    
//     rooms: formData.rooms || 1,
//     adults: formData.adults || 1,
//     children: formData.children || 0,
//     infants: formData.infants || 0,
//     extraBeds: formData.extraBeds || 0,
    
//     services: services || [],
//     notes: formData.notes || "",
    
//     itinerary: (itinerary || []).map(({ destination, city, nights }) => ({
//       destination: destination || "",
//       city: city || "",
//       nights: nights || 0,
//     })),
//   };
// }

// // 👉 Clean and complete service export
// export const leadService = {
  
//   createLead: (formData, services, itinerary) =>
//     API.post("/leads", transformFormData(formData, services, itinerary)),

//   // 👉 FIXED: Backend expects "keyword", not "phone"
//   searchByPhone: (phone) =>
//     API.get("/leads/search", { params: { keyword: phone } }),

//   getAllLeads: (page = 0, size = 100) =>
//     API.get(`/leads?page=${page}&size=${size}`),

//   // 👉 UPDATE Lead
//   updateLead: (publicId, formData, services, itinerary) =>
//     API.put(`/leads/${publicId}`, transformFormData(formData, services, itinerary)),

//   // 👉 DELETE Lead (Added this so your UI delete button actually works!)
//   deleteLead: (publicId) =>
//     API.delete(`/leads/${publicId}`),
    
// };



// new api

// import axios from "axios";

// const API = axios.create({
//   baseURL: "http://localhost:8080/api",
//   headers: { "Content-Type": "application/json" },
// });

// // Attach JWT token automatically to every request
// API.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");

//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   return config;
// });

// // Transform React form data → CreateLeadRequestDto shape
// function transformFormData(formData, services = [], itinerary = []) {
//   return {
//     customerName: formData.customerName,
//     phone: formData.phone,
//     email: formData.email,
//     leadSource: formData.leadSource || "Direct", // Added fallback
//     leadType: formData.leadType || "Hot", // Added fallback
//     leadStage: formData.leadStage || "New Lead",
    
//     // 👉 FIX: Backend expects the assigned user's publicId as `assignedUserId`
//     assignedUserId: formData.assignedUserId || null,
    
//     birthDate: formData.birthDate || null,
//     travelDate: formData.travelDate || null,
//     departCountry: formData.departCountry || "Not Specified",
//     departCity: formData.departCity || "Not Specified",
//     rooms: formData.rooms || 1,
//     adults: formData.adults || 1,
//     children: formData.children || 0,
//     infants: formData.infants || 0,
//     extraBeds: formData.extraBeds || 0,
//     services: services || [],
//     notes: formData.notes || "",
//     itinerary: (itinerary || []).map(({ destination, city, nights }, index) => ({
//       destination: destination || "",
//       city: city || "",
//       nights: nights || 0,
//       dayNumber: index + 1,
//     })),
//   };
// }

// export const leadService = {
//   createLead: (formData, services, itinerary) =>
//     API.post("/leads", transformFormData(formData, services, itinerary)),

//   searchByPhone: (phone) =>
//     API.get("/leads/search", { params: { keyword: phone } }),

//   getAllLeads: (page = 0, size = 100) =>
//     API.get(`/leads?page=${page}&size=${size}`),

//   updateLead: (publicId, formData, services, itinerary) =>
//     API.put(`/leads/${publicId}`, transformFormData(formData, services, itinerary)),

//   deleteLead: (publicId) =>
//     API.delete(`/leads/${publicId}`),
    
//   // ── Statistics ──────────────────────────────────────────────────────────
//   getUserWorkload: () => API.get("/leads/stats/workload"),

//   getLeadsByStagePerUser: () => API.get("/leads/stats/by-stage"),

//   getLeadCountForUser: (userPublicId) =>
//     API.get(`/leads/stats/users/${userPublicId}/count`),
// };









// new data


// import axios from "axios";

// const API = axios.create({
//   baseURL: "http://localhost:8080/api",
//   headers: { "Content-Type": "application/json" },
// });

// // ── JWT Interceptor ───────────────────────────────────────
// API.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// // ── Transformer: React form → Backend DTO ────────────────
// function transformFormData(formData, services = [], itinerary = []) {
//   return {
//     // ── Basic Info ─────────────────────────────────────────
//     customerName:   formData.customerName?.trim()  || "",
//     phone:          formData.phone?.trim()          || "",
//     email:          formData.email?.trim()          || "",

//     // ── Lead Meta ──────────────────────────────────────────
//     leadSource:     formData.leadSource             || "Direct",
//     leadType:       formData.leadType               || "Hot",
//     leadStage:      formData.leadStage              || "New Lead",

//     // ── FIX: assignedUserId ────────────────────────────────
//     // Backend expects publicId (string UUID) — not parseInt
//     // LeadInformation dropdown value={user.publicId} set karo
//     assignedUserId: formData.assignedUserId         || null,

//     // ── Dates ──────────────────────────────────────────────
//     birthDate:      formData.birthDate              || null,
//     travelDate:     formData.travelDate             || null,

//     // ── Departure ──────────────────────────────────────────
//     departCountry:  formData.departCountry          || "Not Specified",
//     departCity:     formData.departCity             || "Not Specified",

//     // ── Travelers ──────────────────────────────────────────
//     rooms:          Number(formData.rooms)          || 1,
//     adults:         Number(formData.adults)         || 1,
//     children:       Number(formData.children)       || 0,
//     infants:        Number(formData.infants)        || 0,
//     extraBeds:      Number(formData.extraBeds)      || 0,

//     // ── Notes ──────────────────────────────────────────────
//     notes:          formData.notes?.trim()          || "",

//     // ── Services array ─────────────────────────────────────
//     services:       Array.isArray(services) ? services : [],

//     // ── Itinerary array ────────────────────────────────────
//     itinerary: (Array.isArray(itinerary) ? itinerary : []).map(
//       ({ destination, city, nights }, index) => ({
//         destination: destination?.trim() || "",
//         city:        city?.trim()        || "",
//         nights:      Number(nights)      || 0,
//         dayNumber:   index + 1,           // backend expects dayNumber
//       })
//     ),
//   };
// }

// export const leadService = {

//   // ── CRUD ─────────────────────────────────────────────────
//   createLead: (formData, services, itinerary) =>
//     API.post("/leads", transformFormData(formData, services, itinerary)),

//   getAllLeads: (page = 0, size = 100) =>
//     API.get(`/leads?page=${page}&size=${size}`),

//   updateLead: (publicId, formData, services, itinerary) =>
//     API.put(`/leads/${publicId}`, transformFormData(formData, services, itinerary)),

//   deleteLead: (publicId) =>
//     API.delete(`/leads/${publicId}`),

//   // ── Search ────────────────────────────────────────────────
//   searchByPhone: (phone) =>
//     API.get("/leads/search", { params: { keyword: phone } }),

//   // ── Users (Assign To dropdown ke liye) ───────────────────
//   // LeadInformation.jsx mein yeh call karo
//   getUsers: () =>
//     API.get("/users"),

//   // ── Statistics ────────────────────────────────────────────
//   getUserWorkload: () =>
//     API.get("/leads/stats/workload"),

//   getLeadsByStagePerUser: () =>
//     API.get("/leads/stats/by-stage"),

//   getLeadCountForUser: (userPublicId) =>
//     API.get(`/leads/stats/users/${userPublicId}/count`),
// };









import API from "./axiosInstance";

// ── Transformer: React form → Backend DTO ────────────────
function transformFormData(formData, services = [], itinerary = []) {
  return {
    customerName:   formData.customerName?.trim()  || "",
    phone:          formData.phone?.trim()          || "",
    email:          formData.email?.trim()          || "",
    leadSource:     formData.leadSource             || "Direct",
    leadType:       formData.leadType               || "Hot",
    leadStage:      formData.leadStage              || "New Lead",
    assignedUserId: formData.assignedUserId         || null,
    birthDate:      formData.birthDate              || null,
    travelDate:     formData.travelDate             || null,
    departCountry:  formData.departCountry          || "Not Specified",
    departCity:     formData.departCity             || "Not Specified",
    rooms:          Number(formData.rooms)          || 1,
    adults:         Number(formData.adults)         || 1,
    children:       Number(formData.children)       || 0,
    infants:        Number(formData.infants)        || 0,
    extraBeds:      Number(formData.extraBeds)      || 0,
    budget:         formData.budget != null && formData.budget !== ""
                      ? Number(formData.budget)
                      : null,
    notes:          formData.notes?.trim()          || "",
    services:       Array.isArray(services) ? services : [],
    itinerary: (Array.isArray(itinerary) ? itinerary : []).map(
      ({ destination, city, nights }, index) => ({
        destination: destination?.trim() || "",
        city:        city?.trim()        || "",
        nights:      Number(nights)      || 0,
        dayNumber:   index + 1,
      })
    ),
  };
}

export const leadService = {

  // ── CREATE ────────────────────────────────────────────────
  createLead: (formData, services, itinerary) =>
    API.post("/leads", transformFormData(formData, services, itinerary)),

  // ── GET ALL ───────────────────────────────────────────────
  getAllLeads: (page = 0, size = 100) =>
    API.get(`/leads?page=${page}&size=${size}`),

  // ── GET BY PUBLIC ID ──────────────────────────────────────
  // CreateQuotation.jsx mein leadId se lead data fetch karne ke liye
  // URL: GET /api/leads/{publicId}
  getLeadById: (publicId) =>
    API.get(`/leads/${publicId}`),

  // ── UPDATE ────────────────────────────────────────────────
  updateLead: (publicId, formData, services, itinerary) =>
    API.put(`/leads/${publicId}`, transformFormData(formData, services, itinerary)),

  // ── DELETE ────────────────────────────────────────────────
  deleteLead: (publicId) =>
    API.delete(`/leads/${publicId}`),

  // ── ADD LOG ───────────────────────────────────────────────
  // POST /api/leads/{publicId}/logs — records an activity log for this lead,
  // optionally creating a follow-up reminder. Comment must be >= 5 chars.
  addLog: (publicId, { comment, createReminder = false, followUpDate = null, stage = null } = {}) =>
    API.post(`/leads/${publicId}/logs`, {
      stage,
      comment: (comment || "").trim(),
      createReminder,
      followUpDate: createReminder && followUpDate ? followUpDate : null,
    }),

  // ── LOGS (read) ───────────────────────────────────────────
  // All activity logs for one lead, newest first.
  getLeadLogs: (publicId) =>
    API.get(`/leads/${publicId}/logs`),

  // Leads-with-logs grid (paginated). Filters: search, stage, userId (user publicId).
  getLeadLogSummary: ({ search, stage, userId, page = 1, perPage = 12 } = {}) =>
    API.get("/leads/logs/summary", {
      params: {
        ...(search ? { search } : {}),
        ...(stage && stage !== "All Stages" ? { stage } : {}),
        ...(userId && userId !== "All Users" ? { userId } : {}),
        page,
        perPage,
      },
    }),

  // Roll-up totals for the All-Lead-Logs stat cards.
  getLeadLogStats: () =>
    API.get("/leads/logs/stats"),

  // Delete a single activity log from a lead.
  deleteLog: (leadPublicId, logPublicId) =>
    API.delete(`/leads/${leadPublicId}/logs/${logPublicId}`),

  // ── SEARCH ───────────────────────────────────────────────
  searchByPhone: (phone) =>
    API.get("/leads/search", { params: { keyword: phone } }),

  // ── USERS (Assign To dropdown) ────────────────────────────
  getUsers: () =>
    API.get("/users"),

  // ── STATISTICS ───────────────────────────────────────────
  getUserWorkload: () =>
    API.get("/leads/stats/workload"),

  getLeadsByStagePerUser: () =>
    API.get("/leads/stats/by-stage"),

  getLeadCountForUser: (userPublicId) =>
    API.get(`/leads/stats/users/${userPublicId}/count`),
};