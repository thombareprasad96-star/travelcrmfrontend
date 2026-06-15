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







import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: { "Content-Type": "application/json" },
});

// ── JWT Interceptor ───────────────────────────────────────
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Transformer: React form → Backend DTO ────────────────
function transformFormData(formData, services = [], itinerary = []) {
  return {
    // ── Basic Info ─────────────────────────────────────────
    customerName:   formData.customerName?.trim()  || "",
    phone:          formData.phone?.trim()          || "",
    email:          formData.email?.trim()          || "",

    // ── Lead Meta ──────────────────────────────────────────
    leadSource:     formData.leadSource             || "Direct",
    leadType:       formData.leadType               || "Hot",
    leadStage:      formData.leadStage              || "New Lead",

    // ── FIX: assignedUserId ────────────────────────────────
    // Backend expects publicId (string UUID) — not parseInt
    // LeadInformation dropdown value={user.publicId} set karo
    assignedUserId: formData.assignedUserId         || null,

    // ── Dates ──────────────────────────────────────────────
    birthDate:      formData.birthDate              || null,
    travelDate:     formData.travelDate             || null,

    // ── Departure ──────────────────────────────────────────
    departCountry:  formData.departCountry          || "Not Specified",
    departCity:     formData.departCity             || "Not Specified",

    // ── Travelers ──────────────────────────────────────────
    rooms:          Number(formData.rooms)          || 1,
    adults:         Number(formData.adults)         || 1,
    children:       Number(formData.children)       || 0,
    infants:        Number(formData.infants)        || 0,
    extraBeds:      Number(formData.extraBeds)      || 0,

    // ── Notes ──────────────────────────────────────────────
    notes:          formData.notes?.trim()          || "",

    // ── Services array ─────────────────────────────────────
    services:       Array.isArray(services) ? services : [],

    // ── Itinerary array ────────────────────────────────────
    itinerary: (Array.isArray(itinerary) ? itinerary : []).map(
      ({ destination, city, nights }, index) => ({
        destination: destination?.trim() || "",
        city:        city?.trim()        || "",
        nights:      Number(nights)      || 0,
        dayNumber:   index + 1,           // backend expects dayNumber
      })
    ),
  };
}

export const leadService = {

  // ── CRUD ─────────────────────────────────────────────────
  createLead: (formData, services, itinerary) =>
    API.post("/leads", transformFormData(formData, services, itinerary)),

  getAllLeads: (page = 0, size = 10) =>
    API.get(`/leads?page=${page}&size=${size}`),

  updateLead: (publicId, formData, services, itinerary) =>
    API.put(`/leads/${publicId}`, transformFormData(formData, services, itinerary)),

  deleteLead: (publicId) =>
    API.delete(`/leads/${publicId}`),

  // ── Search ────────────────────────────────────────────────
  searchByPhone: (phone) =>
    API.get("/leads/search", { params: { keyword: phone } }),

  // ── Users (Assign To dropdown ke liye) ───────────────────
  // LeadInformation.jsx mein yeh call karo
  getUsers: () =>
    API.get("/users"),

  // ── Statistics ────────────────────────────────────────────
  getUserWorkload: () =>
    API.get("/leads/stats/workload"),

  getLeadsByStagePerUser: () =>
    API.get("/leads/stats/by-stage"),

  getLeadCountForUser: (userPublicId) =>
    API.get(`/leads/stats/users/${userPublicId}/count`),
};