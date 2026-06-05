// src/services/bookingService.js

import API from "./axiosInstance";

/* ─────────────────────────────────────────────────────────────
   BOOKING SERVICE
   Base URL : /api/bookings
   All methods return an Axios Promise → { data, status, ... }
───────────────────────────────────────────────────────────── */

const bookingService = {

  /* ── GET ALL BOOKINGS ───────────────────────────────────────
     GET /api/bookings
     Response: BookingResponseDTO[]
  ──────────────────────────────────────────────────────────── */
  getAll: () =>
    API.get("/bookings"),

  /* ── GET BOOKING BY ID ──────────────────────────────────────
     GET /api/bookings/:id
     Response: BookingResponseDTO
  ──────────────────────────────────────────────────────────── */
  getById: (id) =>
    API.get(`/bookings/${id}`),

  /* ── GET BOOKING BY BOOKING CODE ────────────────────────────
     GET /api/bookings/code/BK10001
     Response: BookingResponseDTO
  ──────────────────────────────────────────────────────────── */
  getByCode: (code) =>
    API.get(`/bookings/code/${code}`),

  /* ── CREATE NEW BOOKING ─────────────────────────────────────
     POST /api/bookings
     Body: BookingRequestDTO
     {
       customer, destination, travelDate,
       customerAmount, vendorCost, paid,
       status, payStatus, createdBy,
       services: ["Hotel", "Flight"],
       customerId  (optional - links to Customer)
     }
     Response: BookingResponseDTO
  ──────────────────────────────────────────────────────────── */
  create: (bookingData) =>
    API.post("/bookings", bookingData),

  /* ── CREATE BOOKING FROM LEAD ───────────────────────────────
     POST /api/bookings/from-lead/:leadId
     Response: BookingResponseDTO
  ──────────────────────────────────────────────────────────── */
  createFromLead: (leadId, bookingData) =>
    API.post(`/bookings/from-lead/${leadId}`, bookingData),

  /* ── UPDATE BOOKING ─────────────────────────────────────────
     PUT /api/bookings/:id
     Body: BookingRequestDTO (partial)
     Response: BookingResponseDTO
  ──────────────────────────────────────────────────────────── */
  update: (id, bookingData) =>
    API.put(`/bookings/${id}`, bookingData),

  /* ── UPDATE BOOKING STATUS ONLY ─────────────────────────────
     PATCH /api/bookings/:id/status
     Body: { status: "Confirmed" | "Pending" | "Cancelled" | "Completed" | "Refunded" }
     Response: BookingResponseDTO
  ──────────────────────────────────────────────────────────── */
  updateStatus: (id, status) =>
    API.patch(`/bookings/${id}/status`, { status }),

  /* ── UPDATE PAYMENT STATUS & AMOUNT ─────────────────────────
     PATCH /api/bookings/:id/payment
     Body: { payStatus: "Paid" | "Partial" | "Unpaid", paid: 50000 }
     Response: BookingResponseDTO
  ──────────────────────────────────────────────────────────── */
  updatePayment: (id, paymentData) =>
    API.patch(`/bookings/${id}/payment`, paymentData),

  /* ── DELETE BOOKING ─────────────────────────────────────────
     DELETE /api/bookings/:id
     Response: 204 No Content
  ──────────────────────────────────────────────────────────── */
  delete: (id) =>
    API.delete(`/bookings/${id}`),

  /* ── GET BOOKINGS BY CUSTOMER ───────────────────────────────
     GET /api/bookings/customer/:customerId
     Response: BookingResponseDTO[]
  ──────────────────────────────────────────────────────────── */
  getByCustomer: (customerId) =>
    API.get(`/bookings/customer/${customerId}`),

  /* ── FILTER BOOKINGS ─────────────────────────────────────────
     GET /api/bookings/filter
     Params: status, payStatus, month, travelMonth
     Response: BookingResponseDTO[]

     Usage:
       bookingService.filter({ status: "Confirmed", payStatus: "Paid" })
       bookingService.filter({ month: "2026-04" })
  ──────────────────────────────────────────────────────────── */
  filter: (params = {}) =>
    API.get("/bookings/filter", { params }),

  /* ── SEARCH BOOKINGS ─────────────────────────────────────────
     GET /api/bookings/search?q=Maldives
     Response: BookingResponseDTO[]
  ──────────────────────────────────────────────────────────── */
  search: (query) =>
    API.get("/bookings/search", {
      params: { q: query },
    }),

  /* ── GET BOOKINGS STATS SUMMARY ──────────────────────────────
     GET /api/bookings/stats
     Response: {
       total, confirmed, pending, cancelled,
       completed, refunded,
       totalRevenue, netRevenue,
       totalRefunds, netProfit,
       totalGST, totalTCS
     }
  ──────────────────────────────────────────────────────────── */
  getStats: () =>
    API.get("/bookings/stats"),

  /* ── GET PAGE SUMMARY (for Tax & Profit section) ─────────────
     GET /api/bookings/page-summary?page=1&size=10
     Response: {
       totalCharges, netProfit, gstCollected, tcsCollected
     }
  ──────────────────────────────────────────────────────────── */
  getPageSummary: (page = 1, size = 10) =>
    API.get("/bookings/page-summary", {
      params: { page, size },
    }),

  /* ── EXPORT BOOKINGS CSV ─────────────────────────────────────
     GET /api/bookings/export
     Response: Blob (CSV file)
  ──────────────────────────────────────────────────────────── */
  exportCSV: () =>
    API.get("/bookings/export", {
      responseType: "blob",
    }),

  /* ── SEND VOUCHER EMAIL ──────────────────────────────────────
     POST /api/bookings/:id/send-voucher
     Response: { message: "Voucher sent successfully" }
  ──────────────────────────────────────────────────────────── */
  sendVoucher: (id) =>
    API.post(`/bookings/${id}/send-voucher`),

};

export default bookingService;