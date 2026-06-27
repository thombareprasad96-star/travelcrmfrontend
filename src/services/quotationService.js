








// // src/services/quotationService.js

// import API from "./axiosInstance";

// // ═════════════════════════════════════════════════════════════
// // PAYLOAD BUILDER
// // ═════════════════════════════════════════════════════════════
// export function buildQuotationPayload({
//   // Basic Info
//   leadId       = null,
//   title        = "Quotation",
//   version      = "v1.0",
//   stage        = "Draft",

//   // Tab 1 — Flight
//   flightIncluded = true,
//   flightTitle    = "Flight Details",
//   flightAmount   = 0,
//   journey        = "Round Trip",
//   segments       = [],

//   // Tab 2 — Hotel
//   hotelIncluded = true,
//   hotelTitle    = "Hotel Details",
//   hotelAmount   = 0,
//   hotelNotes    = "",
//   hotels        = [],

//   // Tab 3 — Sightseeing
//   sightseeingIncluded = true,
//   sightseeingTitle    = "Sightseeing",
//   sightseeingAmount   = 0,
//   sightseeingNotes    = "",
//   days                = [],

//   // Tab 4 — Cruise
//   cruiseIncluded = false,
//   cruiseTitle    = "Cruise Details",
//   cruiseAmount   = 0,
//   cruises        = [],

//   // Tab 5 — Vehicle
//   vehicleIncluded = true,
//   vehicleTitle    = "Vehicle Details",
//   vehicleAmount   = 0,
//   vehicles        = [],

//   // Tab 6 — Add-on Services
//   addonIncluded = false,
//   addonTitle    = "Add-on Services",
//   addonAmount   = 0,
//   addons        = [],

//   // Tab 7 — Inclusions & Exclusions
//   inclusions           = [],
//   exclusions           = [],
//   paymentPolicies      = [],
//   cancellationPolicies = [],
//   bookingTerms         = [],

//   // Tab 8 — Summary & Pricing
//   discount = 0,
//   discType = "Fixed",
//   tax      = 18,
//   markup   = 0,

// } = {}) {  // ← default empty object — prevents crash if called with no args
//   return {
//     leadId,
//     title,
//     version,
//     stage,

//     // ── Flight ───────────────────────────────────────────────
//     flight: {
//       included : flightIncluded,
//       title    : flightTitle,
//       amount   : Number(flightAmount) || 0,
//       journey,
//       segments : segments.map(seg => ({
//         airline    : seg.airline   || "",
//         flightNo   : seg.flightNo  || "",
//         class      : seg.class     || "",
//         from       : seg.from      || "",
//         to         : seg.to        || "",
//         depDate    : seg.depDate   || "",
//         depTime    : seg.depTime   || "",
//         arrDate    : seg.arrDate   || "",
//         arrTime    : seg.arrTime   || "",
//         duration   : seg.duration  || "",
//         cabin      : Number(seg.cabin)   || 0,
//         checkin    : Number(seg.checkin) || 0,
//         connections: (seg.connections || []).map(conn => ({
//           airline  : conn.airline  || "",
//           flightNo : conn.flightNo || "",
//           from     : conn.from     || "",
//           to       : conn.to       || "",
//           depDate  : conn.depDate  || "",
//           depTime  : conn.depTime  || "",
//           arrDate  : conn.arrDate  || "",
//           arrTime  : conn.arrTime  || "",
//         })),
//       })),
//     },

//     // ── Hotel ────────────────────────────────────────────────
//     hotel: {
//       included : hotelIncluded,
//       title    : hotelTitle,
//       amount   : Number(hotelAmount) || 0,
//       notes    : hotelNotes,
//       hotels   : hotels.map(h => ({
//         name       : h.name      || "",
//         city       : h.city      || "",
//         checkIn    : h.checkIn   || "",
//         checkOut   : h.checkOut  || "",
//         roomType   : h.roomType  || "",
//         mealPlan   : h.mealPlan  || "",
//         refundable : h.refundable ?? true,
//       })),
//     },

//     // ── Sightseeing ──────────────────────────────────────────
//     sightseeing: {
//       included : sightseeingIncluded,
//       title    : sightseeingTitle,
//       amount   : Number(sightseeingAmount) || 0,
//       notes    : sightseeingNotes,
//       days     : days.map(d => ({
//         day        : d.day  || 1,
//         date       : d.date || "",
//         activities : (d.activities || []).map(act => ({
//           attraction  : act.attraction  || "",
//           startTime   : act.startTime   || "",
//           description : act.description || "",
//           meals       : act.meals       || [],
//           transfer    : act.transfer    || "Private",
//         })),
//       })),
//     },

//     // ── Cruise ───────────────────────────────────────────────
//     cruise: {
//       included : cruiseIncluded,
//       title    : cruiseTitle,
//       amount   : Number(cruiseAmount) || 0,
//       cruises  : cruises.map(c => ({
//         name    : c.name    || "",
//         type    : c.type    || "",
//         depPort : c.depPort || "",
//         arrPort : c.arrPort || "",
//         depDate : c.depDate || "",
//         nights  : Number(c.nights) || 0,
//         cabin   : c.cabin   || "",
//         price   : Number(c.price)  || 0,
//       })),
//     },

//     // ── Vehicle ──────────────────────────────────────────────
//     vehicle: {
//       included : vehicleIncluded,
//       title    : vehicleTitle,
//       amount   : Number(vehicleAmount) || 0,
//       vehicles : vehicles.map(v => ({
//         type      : v.type      || "",
//         pickup    : v.pickup    || "",
//         drop      : v.drop      || "",
//         startDate : v.startDate || "",
//         endDate   : v.endDate   || "",
//         price     : Number(v.price) || 0,
//         notes     : v.notes     || "",
//       })),
//     },

//     // ── Add-on Services ──────────────────────────────────────
//     addons: {
//       included : addonIncluded,
//       title    : addonTitle,
//       amount   : Number(addonAmount) || 0,
//       items    : addons.map(a => ({
//         serviceType  : a.serviceType  || "",
//         description  : a.description  || "",
//         quantity     : Number(a.quantity)     || 1,
//         pricePerUnit : Number(a.pricePerUnit) || 0,
//       })),
//     },

//     // ── Inclusions & Exclusions ──────────────────────────────
//     inclusions,
//     exclusions,
//     paymentPolicies,
//     cancellationPolicies,
//     bookingTerms,

//     // ── Summary & Pricing ────────────────────────────────────
//     pricing: {
//       discount : Number(discount) || 0,
//       discType : discType || "Fixed",
//       tax      : Number(tax)    || 18,
//       markup   : Number(markup) || 0,
//     },
//   };
// }

// // ═════════════════════════════════════════════════════════════
// // QUOTATION SERVICE — API CALLS
// // Note: baseURL = "http://localhost:8080/api"
// //       So endpoints start with /quotations NOT /api/quotations
// // ═════════════════════════════════════════════════════════════
// export const quotationService = {

//   // 1. CREATE — POST /quotations
//   createQuotation: (tabsData) => {
//     const payload = buildQuotationPayload(tabsData);
//     return API.post("/quotations", payload);
//   },

//   // 2. UPDATE — PUT /quotations/{id}
//   updateQuotation: (id, tabsData) => {
//     const payload = buildQuotationPayload(tabsData);
//     return API.put(`/quotations/${id}`, payload);
//   },

//   // 3. GET BY ID — GET /quotations/{id}
//   getQuotationById: (id) => {
//     return API.get(`/quotations/${id}`);
//   },

//   // 4. GET BY LEAD — GET /quotations/lead/{leadId}
//   getQuotationsByLead: (leadId) => {
//     return API.get(`/quotations/lead/${leadId}`);
//   },

//   // 5. GET ALL — GET /quotations?page=0&size=20
//   getAllQuotations: (page = 0, size = 20) => {
//     return API.get("/quotations", { params: { page, size } });
//   },

//   // 6. DELETE — DELETE /quotations/{id}
//   deleteQuotation: (id) => {
//     return API.delete(`/quotations/${id}`);
//   },

//   // 7. UPDATE STAGE — PATCH /quotations/{id}/stage
//   // stage: "Draft" | "Sent" | "Approved" | "Rejected"
//   updateStage: (id, stage) => {
//     return API.patch(`/quotations/${id}/stage`, null, {
//       params: { stage },
//     });
//   },

//   // 8. DUPLICATE — POST /quotations/{id}/duplicate
//   duplicateQuotation: (id) => {
//     return API.post(`/quotations/${id}/duplicate`);
//   },

//   // 9. GENERATE PDF — GET /quotations/{id}/pdf
//   generatePdf: (id) => {
//     return API.get(`/quotations/${id}/pdf`, {
//       responseType: "blob",
//     });
//   },

//   // 10. SEND EMAIL — POST /quotations/{id}/send-email
//   // Body: { toEmail, subject, message }
//   sendEmail: (id, emailData) => {
//     return API.post(`/quotations/${id}/send-email`, emailData);
//   },

//   // 11. GET SHARE LINK — GET /quotations/{id}/share-link
//   getShareLink: (id) => {
//     return API.get(`/quotations/${id}/share-link`);
//   },

//   // 12. WEBLINK VIEW ANALYTICS — GET /quotations/{id}/weblink-analytics
//   getWeblinkAnalytics: (id) => {
//     return API.get(`/quotations/${id}/weblink-analytics`);
//   },
// };

// export default quotationService;









// src/services/quotationService.js

import axios from "axios";

// ── AXIOS INSTANCE ────────────────────────────────────────────
// baseURL already has /api — endpoints mein /api dobara mat lagao
const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// ── REQUEST INTERCEPTOR ───────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // leadService se match
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ── RESPONSE INTERCEPTOR ──────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ═════════════════════════════════════════════════════════════
// PAYLOAD BUILDER
// ═════════════════════════════════════════════════════════════
export function buildQuotationPayload({
  // Basic Info
  leadId       = null,
  title        = "Quotation",
  version      = "v1.0",
  stage        = "Draft",

  // Tab 1 — Flight
  flightIncluded = true,
  flightTitle    = "Flight Details",
  flightAmount   = 0,
  journey        = "Round Trip",
  segments       = [],

  // Tab 2 — Hotel
  hotelIncluded = true,
  hotelTitle    = "Hotel Details",
  hotelAmount   = 0,
  hotelNotes    = "",
  hotels        = [],

  // Tab 3 — Sightseeing
  sightseeingIncluded = true,
  sightseeingTitle    = "Sightseeing",
  sightseeingAmount   = 0,
  sightseeingNotes    = "",
  days                = [],

  // Tab 4 — Cruise
  cruiseIncluded = false,
  cruiseTitle    = "Cruise Details",
  cruiseAmount   = 0,
  cruises        = [],

  // Tab 5 — Vehicle
  vehicleIncluded = true,
  vehicleTitle    = "Vehicle Details",
  vehicleAmount   = 0,
  vehicles        = [],

  // Tab 6 — Add-on Services
  addonIncluded = false,
  addonTitle    = "Add-on Services",
  addonAmount   = 0,
  addons        = [],

  // Tab 7 — Inclusions & Exclusions
  inclusions           = [],
  exclusions           = [],
  paymentPolicies      = [],
  cancellationPolicies = [],
  bookingTerms         = [],

  // Tab 8 — Summary & Pricing
  discount = 0,
  discType = "Fixed",
  tax      = 18,
  markup   = 0,

} = {}) {  // ← default empty object — prevents crash if called with no args
  return {
    leadId,
    title,
    version,
    stage,

    // ── Flight ───────────────────────────────────────────────
    flight: {
      included : flightIncluded,
      title    : flightTitle,
      amount   : Number(flightAmount) || 0,
      journey,
      segments : segments.map(seg => ({
        airline    : seg.airline   || "",
        flightNo   : seg.flightNo  || "",
        class      : seg.class     || "",
        from       : seg.from      || "",
        to         : seg.to        || "",
        depDate    : seg.depDate   || "",
        depTime    : seg.depTime   || "",
        arrDate    : seg.arrDate   || "",
        arrTime    : seg.arrTime   || "",
        duration   : seg.duration  || "",
        cabin      : Number(seg.cabin)   || 0,
        checkin    : Number(seg.checkin) || 0,
        connections: (seg.connections || []).map(conn => ({
          airline  : conn.airline  || "",
          flightNo : conn.flightNo || "",
          from     : conn.from     || "",
          to       : conn.to       || "",
          depDate  : conn.depDate  || "",
          depTime  : conn.depTime  || "",
          arrDate  : conn.arrDate  || "",
          arrTime  : conn.arrTime  || "",
        })),
      })),
    },

    // ── Hotel ────────────────────────────────────────────────
    hotel: {
      included : hotelIncluded,
      title    : hotelTitle,
      amount   : Number(hotelAmount) || 0,
      notes    : hotelNotes,
      hotels   : hotels.map(h => ({
        name         : h.name      || "",
        city         : h.city      || "",
        checkIn      : h.checkIn   || "",
        checkOut     : h.checkOut  || "",
        roomType     : h.roomType  || "",
        mealPlan     : h.mealPlan  || "",
        refundable   : h.refundable ?? true,
        // ☁️ Hotel image (Cloudinary URL) — weblink/PDF mein dikhane ke liye
        imagePath    : h.imagePath || h.imageUrl || "",
        // Extra fields jo HotelTab bhejta hai
        stars        : Number(h.stars)        || 0,
        rooms        : Number(h.rooms)        || 1,
        pricePerRoom : Number(h.pricePerRoom) || 0,
        hotelId      : h.hotelId   || null,
      })),
    },

    // ── Sightseeing ──────────────────────────────────────────
    sightseeing: {
      included : sightseeingIncluded,
      title    : sightseeingTitle,
      amount   : Number(sightseeingAmount) || 0,
      notes    : sightseeingNotes,
      days     : days.map(d => ({
        day        : d.day  || 1,
        date       : d.date || "",
        activities : (d.activities || []).map(act => ({
          attraction  : act.attraction  || "",
          startTime   : act.startTime   || "",
          description : act.description || "",
          meals       : act.meals       || [],
          transfer    : act.transfer    || "Private",
          imagePath   : act.imagePath   || act.imageUrl || "",
        })),
      })),
    },

    // ── Cruise ───────────────────────────────────────────────
    cruise: {
      included : cruiseIncluded,
      title    : cruiseTitle,
      amount   : Number(cruiseAmount) || 0,
      cruises  : cruises.map(c => ({
        name    : c.name    || "",
        type    : c.type    || "",
        depPort : c.depPort || "",
        arrPort : c.arrPort || "",
        depDate : c.depDate || "",
        nights  : Number(c.nights) || 0,
        cabin   : c.cabin   || "",
        price   : Number(c.price)  || 0,
      })),
    },

    // ── Vehicle ──────────────────────────────────────────────
    vehicle: {
      included : vehicleIncluded,
      title    : vehicleTitle,
      amount   : Number(vehicleAmount) || 0,
      vehicles : vehicles.map(v => ({
        type      : v.type      || "",
        pickup    : v.pickup    || "",
        drop      : v.drop      || "",
        startDate : v.startDate || "",
        endDate   : v.endDate   || "",
        price     : Number(v.price) || 0,
        notes     : v.notes     || "",
        imagePath : v.imagePath || v.imageUrl || "",
        qty       : Number(v.qty) || 1,
      })),
    },

    // ── Add-on Services ──────────────────────────────────────
    addons: {
      included : addonIncluded,
      title    : addonTitle,
      amount   : Number(addonAmount) || 0,
      items    : addons.map(a => ({
        serviceType  : a.serviceType  || "",
        description  : a.description  || "",
        quantity     : Number(a.quantity)     || 1,
        pricePerUnit : Number(a.pricePerUnit) || 0,
      })),
    },

    // ── Inclusions & Exclusions ──────────────────────────────
    inclusions,
    exclusions,
    paymentPolicies,
    cancellationPolicies,
    bookingTerms,

    // ── Summary & Pricing ────────────────────────────────────
    pricing: {
      discount : Number(discount) || 0,
      discType : discType || "Fixed",
      tax      : Number(tax)    || 18,
      markup   : Number(markup) || 0,
    },
  };
}

// ═════════════════════════════════════════════════════════════
// QUOTATION SERVICE — API CALLS
// Note: baseURL = "http://localhost:8080/api"
//       So endpoints start with /quotations NOT /api/quotations
// ═════════════════════════════════════════════════════════════
export const quotationService = {

  // 1. CREATE — POST /quotations
  createQuotation: (tabsData) => {
    const payload = buildQuotationPayload(tabsData);
    return api.post("/quotations", payload);
  },

  // 2. UPDATE — PUT /quotations/{id}
  updateQuotation: (id, tabsData) => {
    const payload = buildQuotationPayload(tabsData);
    return api.put(`/quotations/${id}`, payload);
  },

  // 3. GET BY ID — GET /quotations/{id}
  getQuotationById: (id) => {
    return api.get(`/quotations/${id}`);
  },

  // 4. GET BY LEAD — GET /quotations/lead/{leadId}
  getQuotationsByLead: (leadId) => {
    return api.get(`/quotations/lead/${leadId}`);
  },

  // 5. GET ALL — GET /quotations?page=0&size=20
  getAllQuotations: (page = 0, size = 20) => {
    return api.get("/quotations", { params: { page, size } });
  },

  // 6. DELETE — DELETE /quotations/{id}
  deleteQuotation: (id) => {
    return api.delete(`/quotations/${id}`);
  },

  // 7. UPDATE STAGE — PATCH /quotations/{id}/stage
  // stage: "Draft" | "Sent" | "Approved" | "Rejected"
  updateStage: (id, stage) => {
    return api.patch(`/quotations/${id}/stage`, null, {
      params: { stage },
    });
  },

  // 8. DUPLICATE — POST /quotations/{id}/duplicate
  duplicateQuotation: (id) => {
    return api.post(`/quotations/${id}/duplicate`);
  },

  // 9. GENERATE PDF — GET /quotations/{id}/pdf
  generatePdf: (id) => {
    return api.get(`/quotations/${id}/pdf`, {
      responseType: "blob",
    });
  },

  // 10. SEND EMAIL — POST /quotations/{id}/send-email
  // Body: { toEmail, subject, message }
  sendEmail: (id, emailData) => {
    return api.post(`/quotations/${id}/send-email`, emailData);
  },

  // 11. GET SHARE LINK — GET /quotations/{id}/share-link
  getShareLink: (id) => {
    return api.get(`/quotations/${id}/share-link`);
  },
};

export default quotationService;