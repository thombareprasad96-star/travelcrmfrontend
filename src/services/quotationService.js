// // src/services/quotationService.js
// // ─────────────────────────────────────────────────────────────
// // Quotation Module — API Service
// // Backend  : Java Spring Boot  →  /api/quotations
// // Auth     : JWT via localStorage key "accessToken"
// // Strategy : Single endpoint — POST (create) / PUT (update)
// //            All tab data sent together in one payload
// // ─────────────────────────────────────────────────────────────

// import axios from "axios";

// // ── AXIOS INSTANCE ────────────────────────────────────────────
// const api = axios.create({
//   baseURL: process.env.REACT_APP_API_URL || "http://localhost:8080",
//   headers: { "Content-Type": "application/json" },
//   timeout: 15000,
// });

// // ── REQUEST INTERCEPTOR — attach JWT ─────────────────────────
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("accessToken");
//     if (token) config.headers.Authorization = `Bearer ${token}`;
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // ── RESPONSE INTERCEPTOR — handle 401 ────────────────────────
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem("accessToken");
//       window.location.href = "/login";
//     }
//     return Promise.reject(error);
//   }
// );

// // ═════════════════════════════════════════════════════════════
// // PAYLOAD BUILDER
// // Combines all tab data into one object for the backend
// // ═════════════════════════════════════════════════════════════
// function buildPayload({
//   // Basic Info
//   leadId,
//   title,
//   version,
//   stage,

//   // Tab 1 — Flights
//   flights = [],

//   // Tab 2 — Hotels
//   hotels = [],

//   // Tab 3 — Sightseeing
//   sightseeing = [],

//   // Tab 4 — Cruise
//   cruises = [],

//   // Tab 5 — Vehicles
//   vehicles = [],

//   // Tab 6 — Add-on Services
//   addons = [],

//   // Tab 7 — Inclusions & Exclusions
//   inclusions    = [],
//   exclusions    = [],
//   paymentPolicy = [],
//   cancellationPolicy = [],
//   bookingTerms  = [],

//   // Tab 8 — Summary & Pricing
//   taxPercent    = 0,
//   discountPercent = 0,
//   markupPercent = 0,
//   notes         = "",
// }) {
//   return {
//     leadId,
//     title:   title   || "Quotation",
//     version: version || "v1",
//     stage:   stage   || "Draft",

//     // ── Tab 1: Flights ──────────────────────────────────────
//     // Each flight: { airline, flightNo, from, to, departDate,
//     //   departTime, arrivalDate, arrivalTime, class, pax,
//     //   pricePerPax, segments: [] }
//     flights,

//     // ── Tab 2: Hotels ───────────────────────────────────────
//     // Each hotel: { hotelName, destination, checkIn, checkOut,
//     //   nights, roomType, mealPlan, rooms, pricePerRoom,
//     //   options: [] }
//     hotels,

//     // ── Tab 3: Sightseeing ──────────────────────────────────
//     // Each entry: { day, destination, attraction, description,
//     //   pricePerPax, pax, meals: [] }
//     sightseeing,

//     // ── Tab 4: Cruise ───────────────────────────────────────
//     // Each cruise: { cruiseName, cruiseType, cabinCategory,
//     //   from, to, departDate, returnDate, nights,
//     //   pricePerPax, pax }
//     cruises,

//     // ── Tab 5: Vehicles ─────────────────────────────────────
//     // Each vehicle: { vehicleType, transferType, from, to,
//     //   date, pax, pricePerVehicle, vehicles }
//     vehicles,

//     // ── Tab 6: Add-on Services ──────────────────────────────
//     // Each addon: { serviceType, description, quantity,
//     //   pricePerUnit }
//     addons,

//     // ── Tab 7: Inclusions & Exclusions ──────────────────────
//     inclusions,
//     exclusions,
//     paymentPolicy,
//     cancellationPolicy,
//     bookingTerms,

//     // ── Tab 8: Summary & Pricing ────────────────────────────
//     taxPercent:      Number(taxPercent)      || 0,
//     discountPercent: Number(discountPercent) || 0,
//     markupPercent:   Number(markupPercent)   || 0,
//     notes,
//   };
// }

// // ═════════════════════════════════════════════════════════════
// // QUOTATION SERVICE
// // ═════════════════════════════════════════════════════════════
// export const quotationService = {

//   // ──────────────────────────────────────────────────────────
//   // 1. CREATE — POST /api/quotations
//   //    Call when user creates quotation for the first time
//   //    Returns: { data: { id, publicId, ... } }
//   // ──────────────────────────────────────────────────────────
//   createQuotation: (tabsData) => {
//     const payload = buildPayload(tabsData);
//     return api.post("/api/quotations", payload);
//   },

//   // ──────────────────────────────────────────────────────────
//   // 2. UPDATE — PUT /api/quotations/{id}
//   //    Call on every tab save / Next button
//   //    id = quotation publicId or numeric id from backend
//   // ──────────────────────────────────────────────────────────
//   updateQuotation: (id, tabsData) => {
//     const payload = buildPayload(tabsData);
//     return api.put(`/api/quotations/${id}`, payload);
//   },

//   // ──────────────────────────────────────────────────────────
//   // 3. GET BY ID — GET /api/quotations/{id}
//   //    Load existing quotation (edit mode)
//   // ──────────────────────────────────────────────────────────
//   getQuotationById: (id) => {
//     return api.get(`/api/quotations/${id}`);
//   },

//   // ──────────────────────────────────────────────────────────
//   // 4. GET BY LEAD — GET /api/quotations/lead/{leadId}
//   //    Show all quotes for a lead on the Leads page
//   // ──────────────────────────────────────────────────────────
//   getQuotationsByLead: (leadId) => {
//     return api.get(`/api/quotations/lead/${leadId}`);
//   },

//   // ──────────────────────────────────────────────────────────
//   // 5. GET ALL — GET /api/quotations?page=0&size=20
//   //    Quotation listing page
//   // ──────────────────────────────────────────────────────────
//   getAllQuotations: (page = 0, size = 20) => {
//     return api.get("/api/quotations", { params: { page, size } });
//   },

//   // ──────────────────────────────────────────────────────────
//   // 6. DELETE — DELETE /api/quotations/{id}
//   // ──────────────────────────────────────────────────────────
//   deleteQuotation: (id) => {
//     return api.delete(`/api/quotations/${id}`);
//   },

//   // ──────────────────────────────────────────────────────────
//   // 7. CHANGE STAGE — PATCH /api/quotations/{id}/stage
//   //    stage values: "Draft" | "Sent" | "Approved" | "Rejected"
//   // ──────────────────────────────────────────────────────────
//   updateStage: (id, stage) => {
//     return api.patch(`/api/quotations/${id}/stage`, null, {
//       params: { stage },
//     });
//   },

//   // ──────────────────────────────────────────────────────────
//   // 8. DUPLICATE — POST /api/quotations/{id}/duplicate
//   //    Create new version of existing quotation
//   // ──────────────────────────────────────────────────────────
//   duplicateQuotation: (id) => {
//     return api.post(`/api/quotations/${id}/duplicate`);
//   },

//   // ──────────────────────────────────────────────────────────
//   // 9. GENERATE PDF — GET /api/quotations/{id}/pdf
//   //    Returns binary blob — trigger download in browser
//   // ──────────────────────────────────────────────────────────
//   generatePdf: (id) => {
//     return api.get(`/api/quotations/${id}/pdf`, {
//       responseType: "blob",
//     });
//   },

//   // ──────────────────────────────────────────────────────────
//   // 10. SEND EMAIL — POST /api/quotations/{id}/send-email
//   //     Body: { toEmail, subject, message }
//   // ──────────────────────────────────────────────────────────
//   sendEmail: (id, emailData) => {
//     return api.post(`/api/quotations/${id}/send-email`, emailData);
//   },

//   // ──────────────────────────────────────────────────────────
//   // 11. GET SHARE LINK — GET /api/quotations/{id}/share-link
//   //     Returns: { shareUrl: "https://..." }
//   // ──────────────────────────────────────────────────────────
//   getShareLink: (id) => {
//     return api.get(`/api/quotations/${id}/share-link`);
//   },
// };

// export default quotationService;


// // ═════════════════════════════════════════════════════════════
// // HOW TO USE IN CreateQuotation.jsx
// // ═════════════════════════════════════════════════════════════
// //
// // import { quotationService } from '../../services/quotationService';
// //
// // ── CREATE (first time save) ─────────────────────────────────
// // const res = await quotationService.createQuotation({
// //   leadId,
// //   title:    formData.title,
// //   version:  "v1",
// //   stage:    "Draft",
// //   flights,
// //   hotels,
// //   sightseeing,
// //   cruises,
// //   vehicles,
// //   addons,
// //   inclusions,
// //   exclusions,
// //   paymentPolicy,
// //   cancellationPolicy,
// //   bookingTerms,
// //   taxPercent,
// //   discountPercent,
// //   markupPercent,
// //   notes,
// // });
// // const quotationId = res.data?.data?.id || res.data?.id;
// //
// // ── UPDATE (tab change / next button) ───────────────────────
// // await quotationService.updateQuotation(quotationId, {
// //   leadId,
// //   flights,
// //   hotels,
// //   ...
// // });
// //
// // ── LOAD EXISTING (edit mode) ────────────────────────────────
// // const res = await quotationService.getQuotationById(id);
// // const data = res.data?.data || res.data;
// // setFlights(data.flights || []);
// // setHotels(data.hotels   || []);
// // ...
// //
// // ── PDF DOWNLOAD ─────────────────────────────────────────────
// // const res = await quotationService.generatePdf(quotationId);
// // const url = URL.createObjectURL(new Blob([res.data]));
// // const a = document.createElement('a');
// // a.href = url;
// // a.download = 'quotation.pdf';
// // a.click();


























// // src/services/quotationService.js
// // ─────────────────────────────────────────────────────────────
// // Quotation Module — API Service
// // Backend  : Java Spring Boot  →  POST/PUT /api/quotations
// // Auth     : JWT via localStorage key "accessToken"
// // Tabs     : Flight, Hotel, Sightseeing, Cruise, Vehicle,
// //            Add-on Services, Inclusions & Exclusions,
// //            Summary & Pricing
// // ─────────────────────────────────────────────────────────────

// import axios from "axios";

// // ── AXIOS INSTANCE ────────────────────────────────────────────
// const api = axios.create({
//   baseURL: "http://localhost:8080/api",
//   headers: { "Content-Type": "application/json" },
// });

// // ── REQUEST INTERCEPTOR — attach JWT ─────────────────────────
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("accessToken");
//     if (token) config.headers.Authorization = `Bearer ${token}`;
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // ── RESPONSE INTERCEPTOR — handle 401 ────────────────────────
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem("accessToken");
//       window.location.href = "/login";
//     }
//     return Promise.reject(error);
//   }
// );

// // ═════════════════════════════════════════════════════════════
// // PAYLOAD BUILDER
// // Collects all tab data into one object for the backend
// // Each field name matches exactly what's in the tab components    buildQuotationPayload
// // ═════════════════════════════════════════════════════════════
// export function buildQuotationPayload({

//   // ── Basic Info (CreateQuotation.jsx) ─────────────────────
//   leadId       = null,
//   title        = "Quotation",
//   version      = "v1.0",
//   stage        = "Draft",

//   // ── TAB 1: FlightTab ─────────────────────────────────────
//   // flightIncluded, flightTitle, flightAmount, journey
//   // segments: [{ airline, flightNo, class, from, to,
//   //   depDate, depTime, arrDate, arrTime, duration,
//   //   cabin, checkin,
//   //   connections: [{ airline, flightNo, from, to,
//   //     depDate, depTime, arrDate, arrTime }] }]
//   flightIncluded = true,
//   flightTitle    = "Flight Details",
//   flightAmount   = 0,
//   journey        = "Round Trip",
//   segments       = [],

//   // ── TAB 2: HotelTab ──────────────────────────────────────
//   // hotelIncluded, hotelTitle, hotelAmount, hotelNotes
//   // hotels: [{ name, city, checkIn, checkOut, roomType,
//   //   mealPlan, refundable }]
//   hotelIncluded = true,
//   hotelTitle    = "Hotel Details",
//   hotelAmount   = 0,
//   hotelNotes    = "",
//   hotels        = [],

//   // ── TAB 3: SightseeingTab ────────────────────────────────
//   // sightseeingIncluded, sightseeingTitle, sightseeingAmount
//   // sightseeingNotes
//   // days: [{ day, date,
//   //   activities: [{ attraction, startTime, description,
//   //     meals: [], transfer }] }]
//   sightseeingIncluded = true,
//   sightseeingTitle    = "Sightseeing",
//   sightseeingAmount   = 0,
//   sightseeingNotes    = "",
//   days                = [],

//   // ── TAB 4: CruiseTab ─────────────────────────────────────
//   // cruiseIncluded, cruiseTitle, cruiseAmount
//   // cruises: [{ name, type, depPort, arrPort,
//   //   depDate, nights, cabin, price }]
//   cruiseIncluded = false,
//   cruiseTitle    = "Cruise Details",
//   cruiseAmount   = 0,
//   cruises        = [],

//   // ── TAB 5: VehicleTab ────────────────────────────────────
//   // vehicleIncluded, vehicleTitle, vehicleAmount
//   // vehicles: [{ type, pickup, drop, startDate,
//   //   endDate, price, notes }]
//   vehicleIncluded = true,
//   vehicleTitle    = "Vehicle Details",
//   vehicleAmount   = 0,
//   vehicles        = [],

//   // ── TAB 6: AddOnServicesTab ──────────────────────────────
//   // addonIncluded, addonTitle, addonAmount
//   // addons: [{ serviceType, description, quantity,
//   //   pricePerUnit }]
//   addonIncluded = false,
//   addonTitle    = "Add-on Services",
//   addonAmount   = 0,
//   addons        = [],

//   // ── TAB 7: InclusionsExclusionsTab ───────────────────────
//   // inclusions: string[]
//   // exclusions: string[]
//   // paymentPolicies: string[]
//   // cancellationPolicies: string[]
//   // bookingTerms: string[]
//   inclusions           = [],
//   exclusions           = [],
//   paymentPolicies      = [],
//   cancellationPolicies = [],
//   bookingTerms         = [],

//   // ── TAB 8: SummaryPricingTab ─────────────────────────────
//   // discount, discType ("%" | "Fixed"), tax, markup
//   discount = 0,
//   discType = "Fixed",
//   tax      = 18,
//   markup   = 0,

// }) {
//   return {

//     // Basic
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
//         serviceType   : a.serviceType   || "",
//         description   : a.description   || "",
//         quantity      : Number(a.quantity)     || 1,
//         pricePerUnit  : Number(a.pricePerUnit) || 0,
//       })),
//     },

//     // ── Inclusions & Exclusions ──────────────────────────────
//     inclusions           : inclusions           || [],
//     exclusions           : exclusions           || [],
//     paymentPolicies      : paymentPolicies      || [],
//     cancellationPolicies : cancellationPolicies || [],
//     bookingTerms         : bookingTerms         || [],

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
// // ═════════════════════════════════════════════════════════════
// export const quotationService = {

//   // ── 1. CREATE ─────────────────────────────────────────────
//   // First time save — returns { id, publicId } from backend
//   // Call this when user clicks "Create Quotation" button
//   createQuotation: (tabsData) => {
//     const payload = buildQuotationPayload(tabsData);
//     return api.post("/api/quotations", payload);
//   },

//   // ── 2. UPDATE ─────────────────────────────────────────────
//   // Called on every "Next" tab press after first save
//   // id = quotation publicId or numeric id from backend
//   updateQuotation: (id, tabsData) => {
//     const payload = buildQuotationPayload(tabsData);
//     return api.put(`/api/quotations/${id}`, payload);
//   },

//   // ── 3. GET BY ID ──────────────────────────────────────────
//   // Load existing quotation in edit mode
//   getQuotationById: (id) => {
//     return api.get(`/api/quotations/${id}`);
//   },

//   // ── 4. GET BY LEAD ────────────────────────────────────────
//   // Show all quotes linked to a lead
//   getQuotationsByLead: (leadId) => {
//     return api.get(`/api/quotations/lead/${leadId}`);
//   },

//   // ── 5. GET ALL ────────────────────────────────────────────
//   // Quotation listing/all-quotes page
//   getAllQuotations: (page = 0, size = 20) => {
//     return api.get("/api/quotations", { params: { page, size } });
//   },

//   // ── 6. DELETE ─────────────────────────────────────────────
//   deleteQuotation: (id) => {
//     return api.delete(`/api/quotations/${id}`);
//   },

//   // ── 7. UPDATE STAGE ───────────────────────────────────────
//   // stage: "Draft" | "Sent" | "Approved" | "Rejected"
//   updateStage: (id, stage) => {
//     return api.patch(`/api/quotations/${id}/stage`, null, {
//       params: { stage },
//     });
//   },

//   // ── 8. DUPLICATE ──────────────────────────────────────────
//   // Create v2, v3 etc. of same quotation
//   duplicateQuotation: (id) => {
//     return api.post(`/api/quotations/${id}/duplicate`);
//   },

//   // ── 9. GENERATE PDF ───────────────────────────────────────
//   // Returns blob — trigger browser download
//   generatePdf: (id) => {
//     return api.get(`/api/quotations/${id}/pdf`, {
//       responseType: "blob",
//     });
//   },

//   // ── 10. SEND EMAIL ────────────────────────────────────────
//   // Body: { toEmail, subject, message }
//   sendEmail: (id, emailData) => {
//     return api.post(`/api/quotations/${id}/send-email`, emailData);
//   },

//   // ── 11. GET SHARE LINK ────────────────────────────────────
//   getShareLink: (id) => {
//     return api.get(`/api/quotations/${id}/share-link`);
//   },
// };

// export default quotationService;


// // ═════════════════════════════════════════════════════════════
// // HOW TO USE IN CreateQuotation.jsx
// // ═════════════════════════════════════════════════════════════
// //
// // STEP 1 — Import
// // import { quotationService } from '../../services/quotationService';
// //
// // STEP 2 — Add state in CreateQuotation.jsx
// // const [quotationId, setQuotationId] = useState(null);
// //
// // STEP 3 — Collect data from all tabs using refs or state
// // (Each tab exposes its data via onDataChange prop)
// //
// // STEP 4 — On "Create Quotation" button click:
// //
// // const handleSave = async () => {
// //   try {
// //     const allData = {
// //       leadId,
// //       title: qtTitle,
// //       version: "v1.0",
// //       stage: "Draft",
// //
// //       // Flight tab data
// //       flightIncluded, flightTitle, flightAmount, journey, segments,
// //
// //       // Hotel tab data
// //       hotelIncluded, hotelTitle, hotelAmount, hotelNotes, hotels,
// //
// //       // Sightseeing tab data
// //       sightseeingIncluded, sightseeingTitle, sightseeingAmount,
// //       sightseeingNotes, days,
// //
// //       // Cruise tab data
// //       cruiseIncluded, cruiseTitle, cruiseAmount, cruises,
// //
// //       // Vehicle tab data
// //       vehicleIncluded, vehicleTitle, vehicleAmount, vehicles,
// //
// //       // Addon tab data
// //       addonIncluded, addonTitle, addonAmount, addons,
// //
// //       // Inclusions tab data
// //       inclusions, exclusions, paymentPolicies,
// //       cancellationPolicies, bookingTerms,
// //
// //       // Summary tab data
// //       discount, discType, tax, markup,
// //     };
// //
// //     if (quotationId) {
// //       // Already saved once — update
// //       await quotationService.updateQuotation(quotationId, allData);
// //     } else {
// //       // First time — create
// //       const res = await quotationService.createQuotation(allData);
// //       const newId = res.data?.data?.id || res.data?.id;
// //       setQuotationId(newId);
// //     }
// //
// //     alert("Quotation saved!");
// //   } catch (err) {
// //     console.error("Save failed:", err);
// //   }
// // };
// //
// // STEP 5 — PDF Download:
// // const handlePdf = async () => {
// //   const res = await quotationService.generatePdf(quotationId);
// //   const url = URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
// //   const a = document.createElement("a");
// //   a.href = url;
// //   a.download = `quotation-${quotationId}.pdf`;
// //   a.click();
// // };
























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
        name       : h.name      || "",
        city       : h.city      || "",
        checkIn    : h.checkIn   || "",
        checkOut   : h.checkOut  || "",
        roomType   : h.roomType  || "",
        mealPlan   : h.mealPlan  || "",
        refundable : h.refundable ?? true,
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