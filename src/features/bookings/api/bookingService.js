// import API from "@shared/api/http";

// /* ─────────────────────────────────────────────────────────────
//    BOOKING SERVICE
//    Base URL : /api/bookings
//    All methods return an Axios Promise → { data, status, ... }
// ───────────────────────────────────────────────────────────── */

// const bookingService = {

//   /* ── GET ALL BOOKINGS ───────────────────────────────────────
//      GET /api/bookings
//      Response: BookingResponseDTO[]
//   ──────────────────────────────────────────────────────────── */
//   getAll: (page = 0, size = 1000, sortBy = "createdAt", sortDir = "desc") =>
//     API.get("/bookings", { params: { page, size, sortBy, sortDir } }),

//   /* ── GET BOOKING BY ID ──────────────────────────────────────
//      GET /api/bookings/:id
//      Response: BookingResponseDTO
//   ──────────────────────────────────────────────────────────── */
//   getById: (id) =>
//     API.get(`/bookings/${id}`),

//   /* ── GET BOOKING BY BOOKING CODE ────────────────────────────
//      GET /api/bookings/code/BK10001
//      Response: BookingResponseDTO
//   ──────────────────────────────────────────────────────────── */
//   getByCode: (code) =>
//     API.get(`/bookings/code/${code}`),

//   /* ── CREATE NEW BOOKING ─────────────────────────────────────
//      POST /api/bookings
//      Body: BookingRequestDTO
//      {
//        customer, destination, travelDate,
//        customerAmount, vendorCost, paid,
//        status, payStatus, createdBy,
//        services: ["Hotel", "Flight"],
//        customerId  (optional - links to Customer)
//      }
//      Response: BookingResponseDTO
//   ──────────────────────────────────────────────────────────── */
//   create: (bookingData) =>
//     API.post("/bookings", bookingData),

//   /* ── CONVERT LEAD → BOOKING ─────────────────────────────────
//      POST /api/leads/:leadPublicId/convert-to-booking
//      Body: {
//        quotationPublicId?,   // accepted quotation to carry over (optional)
//        customerName, destination, travelDate,
//        bookingDate?, customerAmount, vendorCost,
//        paidAmount?, services: ["Hotel", "Flight"]
//      }
//      Response: BookingResponseDTO  (gated by BOOKING_CREATE)
//   ──────────────────────────────────────────────────────────── */
//   convertFromLead: (leadPublicId, payload) =>
//     API.post(`/leads/${leadPublicId}/convert-to-booking`, payload),

//   /* ── UPDATE BOOKING ─────────────────────────────────────────
//      PUT /api/bookings/:id
//      Body: BookingRequestDTO (partial)
//      Response: BookingResponseDTO
//   ──────────────────────────────────────────────────────────── */
//   update: (id, bookingData) =>
//     API.put(`/bookings/${id}`, bookingData),

//   /* ── UPDATE BOOKING STATUS ONLY ─────────────────────────────
//      PATCH /api/bookings/:id/status
//      Body: { status: "Confirmed" | "Pending" | "Cancelled" | "Completed" | "Refunded" }
//      Response: BookingResponseDTO
//   ──────────────────────────────────────────────────────────── */
//   updateStatus: (id, status) =>
//     API.patch(`/bookings/${id}/status`, { status }),

//   /* ── UPDATE PAYMENT STATUS & AMOUNT ─────────────────────────
//      PATCH /api/bookings/:id/payment
//      Body: { payStatus: "Paid" | "Partial" | "Unpaid", paid: 50000 }
//      Response: BookingResponseDTO
//   ──────────────────────────────────────────────────────────── */
//   updatePayment: (id, paymentData) =>
//     API.patch(`/bookings/${id}/payment`, paymentData),

//   /* ── CANCEL BOOKING (retains the booking; acts on the lead) ──
//      POST /api/bookings/:publicId/cancel
//      Body: { action: "MOVE_TO_LEAD" | "PERMANENT_DELETE_LEAD" }
//        - MOVE_TO_LEAD          → booking CANCELLED, lead re-activated (REOPENED)  [BOOKING_CANCEL]
//        - PERMANENT_DELETE_LEAD → booking CANCELLED, lead hard-deleted (irreversible) [LEAD_PERMANENT_DELETE]
//      Response: BookingResponseDTO
//   ──────────────────────────────────────────────────────────── */
//   cancel: (publicId, action) =>
//     API.post(`/bookings/${publicId}/cancel`, { action }),

//   /* ── DELETE BOOKING ─────────────────────────────────────────
//      DELETE /api/bookings/:id
//      Response: 204 No Content
//   ──────────────────────────────────────────────────────────── */
//   delete: (id) =>
//     API.delete(`/bookings/${id}`),

//   /* ── GET BOOKINGS BY CUSTOMER ───────────────────────────────
//      GET /api/bookings/customer/:customerId
//      Response: BookingResponseDTO[]
//   ──────────────────────────────────────────────────────────── */
//   getByCustomer: (customerId) =>
//     API.get(`/bookings/customer/${customerId}`),

//   /* ── FILTER BOOKINGS ─────────────────────────────────────────
//      GET /api/bookings/filter
//      Params: status, payStatus, month, travelMonth
//      Response: BookingResponseDTO[]

//      Usage:
//        bookingService.filter({ status: "Confirmed", payStatus: "Paid" })
//        bookingService.filter({ month: "2026-04" })
//   ──────────────────────────────────────────────────────────── */
//   filter: (params = {}) =>
//     API.get("/bookings/filter", { params }),

//   /* ── SEARCH BOOKINGS ─────────────────────────────────────────
//      GET /api/bookings/search?q=Maldives
//      Response: BookingResponseDTO[]
//   ──────────────────────────────────────────────────────────── */
//   search: (query) =>
//     API.get("/bookings/search", {
//       params: { q: query },
//     }),

//   /* ── GET BOOKINGS STATS SUMMARY ──────────────────────────────
//      GET /api/bookings/stats
//      Response: {
//        total, confirmed, pending, cancelled,
//        completed, refunded,
//        totalRevenue, netRevenue,
//        totalRefunds, netProfit,
//        totalGST, totalTCS
//      }
//   ──────────────────────────────────────────────────────────── */
//   getStats: () =>
//     API.get("/bookings/stats"),

//   /* ── GET PAGE SUMMARY (for Tax & Profit section) ─────────────
//      GET /api/bookings/page-summary?page=1&size=10
//      Response: {
//        totalCharges, netProfit, gstCollected, tcsCollected
//      }
//   ──────────────────────────────────────────────────────────── */
//   getPageSummary: (page = 1, size = 10) =>
//     API.get("/bookings/page-summary", {
//       params: { page, size },
//     }),

//   /* ── EXPORT BOOKINGS CSV ─────────────────────────────────────
//      GET /api/bookings/export
//      Response: Blob (CSV file)
//   ──────────────────────────────────────────────────────────── */
//   exportCSV: () =>
//     API.get("/bookings/export", {
//       responseType: "blob",
//     }),

//   /* ── SEND VOUCHER EMAIL ──────────────────────────────────────
//      POST /api/bookings/:id/send-voucher
//      Response: { message: "Voucher sent successfully" }
//   ──────────────────────────────────────────────────────────── */
//   sendVoucher: (id) =>
//     API.post(`/bookings/${id}/send-voucher`),

// };

// export default bookingService;




// src/services/bookingService.js

import API from "@shared/api/http";

const bookingService = {

  getAll: (page = 0, size = 1000, sortBy = "createdAt", sortDir = "desc") =>
    API.get("/bookings", { params: { page, size, sortBy, sortDir } }),

  getById: (id) =>
    API.get(`/bookings/${id}`),

  getByCode: (code) =>
    API.get(`/bookings/code/${code}`),

  create: (bookingData) =>
    API.post("/bookings", bookingData),

  convertFromLead: (leadPublicId, payload) =>
    API.post(`/leads/${leadPublicId}/convert-to-booking`, payload),

  update: (id, bookingData) =>
    API.put(`/bookings/${id}`, bookingData),

  updateStatus: (id, status) =>
    API.patch(`/bookings/${id}/status`, { status }),

  updatePayment: (id, paymentData) =>
    API.patch(`/bookings/${id}/payment`, paymentData),

  cancel: (publicId, action) =>
    API.post(`/bookings/${publicId}/cancel`, { action }),

  delete: (id) =>
    API.delete(`/bookings/${id}`),

  getByCustomer: (customerId) =>
    API.get(`/bookings/customer/${customerId}`),

  filter: (params = {}) =>
    API.get("/bookings/filter", { params }),

  search: (query) =>
    API.get("/bookings/search", { params: { q: query } }),

  getStats: () =>
    API.get("/bookings/stats"),

  getPageSummary: (page = 1, size = 10) =>
    API.get("/bookings/page-summary", { params: { page, size } }),

  exportCSV: () =>
    API.get("/bookings/export", { responseType: "blob" }),

  sendVoucher: (id) =>
    API.post(`/bookings/${id}/send-voucher`),

  // ═══════════════════════════════════════════════════════════
  // PAYMENT METHODS (used by BookingPayments.jsx)
  // ═══════════════════════════════════════════════════════════

  // GET /api/bookings/:bookingId/payments
  getPayments: (bookingId) =>
    API.get(`/bookings/${bookingId}/payments`),

  // POST /api/bookings/:bookingId/payments
  // body: { paymentType, amount, paymentMethod, paymentDate, paymentStatus, reference, notes }
  addPayment: (bookingId, data) =>
    API.post(`/bookings/${bookingId}/payments`, data),

  // DELETE /api/bookings/:bookingId/payments/:paymentId
  deletePayment: (bookingId, paymentId) =>
    API.delete(`/bookings/${bookingId}/payments/${paymentId}`),

  // ═══════════════════════════════════════════════════════════
  // VENDOR ASSIGNMENT (used by BookingDetails.jsx)
  // ═══════════════════════════════════════════════════════════

  // PUT /api/bookings/:bookingId/services/:serviceId/vendor
  assignVendor: (bookingId, serviceId, data) =>
    API.put(`/bookings/${bookingId}/services/${serviceId}/vendor`, data),

  // ═══════════════════════════════════════════════════════════
  // SERVICE MANAGEMENT (used by BookingServices.jsx)
  // ═══════════════════════════════════════════════════════════

  // GET /api/bookings/:bookingId/services
  getServices: (bookingId) =>
    API.get(`/bookings/${bookingId}/services`),

  // POST /api/bookings/:bookingId/services
  addService: (bookingId, data) =>
    API.post(`/bookings/${bookingId}/services`, data),

  // PUT /api/bookings/:bookingId/services/:serviceId
  updateService: (bookingId, serviceId, data) =>
    API.put(`/bookings/${bookingId}/services/${serviceId}`, data),

  // DELETE /api/bookings/:bookingId/services/:serviceId
  deleteService: (bookingId, serviceId) =>
    API.delete(`/bookings/${bookingId}/services/${serviceId}`),

};

export default bookingService;