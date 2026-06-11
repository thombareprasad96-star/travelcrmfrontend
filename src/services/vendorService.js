// src/services/vendorService.js
// ─────────────────────────────────────────────────────────────
// Vendor Service Layer — Travel CRM
// Handles all API calls for Vendors.jsx & CreateVendor.jsx
// Uses shared axiosInstance (JWT + error interceptors)
// ─────────────────────────────────────────────────────────────

import API from "./axiosInstance";

/* ─────────────────────────────────────────────────────────────
   VENDOR SERVICE
   Base URL : /api/vendors
   All methods return Axios Promise → { data, status, headers }
───────────────────────────────────────────────────────────── */

const vendorService = {

  /* ── GET ALL VENDORS ────────────────────────────────────────
     GET /api/vendors
     Response: VendorResponseDTO[]
  ──────────────────────────────────────────────────────────── */
  getAll: () =>
    API.get("/vendors"),

  /* ── GET VENDOR BY ID ───────────────────────────────────────
     GET /api/vendors/:id
     Response: VendorResponseDTO
  ──────────────────────────────────────────────────────────── */
  getById: (id) =>
    API.get(`/vendors/${id}`),

  /* ── GET VENDOR BY CODE ─────────────────────────────────────
     GET /api/vendors/code/VND001
     Response: VendorResponseDTO
  ──────────────────────────────────────────────────────────── */
  getByCode: (code) =>
    API.get(`/vendors/code/${code}`),

  /* ── CREATE VENDOR ──────────────────────────────────────────
     POST /api/vendors
     Body: VendorRequestDTO
     {
       vendorName, vendorType, contactPerson,
       phone, alternatePhone, email, whatsapp,
       contractType, paymentTerms, commPref, status,
       city, state, country, address, pincode, coverageAreas,
       services: ["Hotel", "Breakfast"],
       serviceDescription,
       commissionRate, currency, creditPeriod,
       creditLimit, openingBalance,
       bankName, accountName, accountNumber, ifscCode, upiId,
       gstNumber, panNumber,
       notes, specialConditions
     }
     Response: VendorResponseDTO
  ──────────────────────────────────────────────────────────── */
  create: (vendorData) =>
    API.post("/vendors", vendorData),

  /* ── UPDATE VENDOR ──────────────────────────────────────────
     PUT /api/vendors/:id
     Body: VendorRequestDTO (full update)
     Response: VendorResponseDTO
  ──────────────────────────────────────────────────────────── */
  update: (id, vendorData) =>
    API.put(`/vendors/${id}`, vendorData),

  /* ── UPDATE VENDOR STATUS ONLY ──────────────────────────────
     PATCH /api/vendors/:id/status
     Body: { status: "Active" | "Inactive" | "Blacklisted" }
     Response: VendorResponseDTO
  ──────────────────────────────────────────────────────────── */
  updateStatus: (id, status) =>
    API.patch(`/vendors/${id}/status`, { status }),

  /* ── UPDATE VENDOR PAYMENT STATUS ───────────────────────────
     PATCH /api/vendors/:id/payment
     Body: { payStatus: "Paid" | "Partial" | "Unpaid", amountPaid: 50000 }
     Response: VendorResponseDTO
  ──────────────────────────────────────────────────────────── */
  updatePayment: (id, paymentData) =>
    API.patch(`/vendors/${id}/payment`, paymentData),

  /* ── DELETE VENDOR ──────────────────────────────────────────
     DELETE /api/vendors/:id
     Response: 204 No Content
  ──────────────────────────────────────────────────────────── */
  delete: (id) =>
    API.delete(`/vendors/${id}`),

  /* ── FILTER VENDORS ─────────────────────────────────────────
     GET /api/vendors/filter
     Params: status, type, payStatus
     Response: VendorResponseDTO[]

     Usage:
       vendorService.filter({ status: "Active", type: "Hotel" })
       vendorService.filter({ payStatus: "Partial" })
  ──────────────────────────────────────────────────────────── */
  filter: (params = {}) =>
    API.get("/vendors/filter", { params }),

  /* ── SEARCH VENDORS ─────────────────────────────────────────
     GET /api/vendors/search?q=Royal
     Response: VendorResponseDTO[]
  ──────────────────────────────────────────────────────────── */
  search: (query) =>
    API.get("/vendors/search", {
      params: { q: query },
    }),

  /* ── GET VENDORS BY TYPE ────────────────────────────────────
     GET /api/vendors/type/Hotel
     Response: VendorResponseDTO[]
  ──────────────────────────────────────────────────────────── */
  getByType: (type) =>
    API.get(`/vendors/type/${type}`),

  /* ── GET VENDOR STATS ───────────────────────────────────────
     GET /api/vendors/stats
     Response: {
       total, active, inactive, blacklisted,
       totalByType: { Hotel, Airlines, Transport, DMC },
       totalBusiness, totalPaid, totalOutstanding,
       avgRating, totalBookings
     }
  ──────────────────────────────────────────────────────────── */
  getStats: () =>
    API.get("/vendors/stats"),

  /* ── GET VENDOR BOOKINGS ────────────────────────────────────
     GET /api/vendors/:id/bookings
     Response: BookingResponseDTO[]
  ──────────────────────────────────────────────────────────── */
  getBookings: (id) =>
    API.get(`/vendors/${id}/bookings`),

  /* ── RATE / REVIEW VENDOR ───────────────────────────────────
     POST /api/vendors/:id/rating
     Body: { rating: 4.5, review: "Excellent service" }
     Response: VendorResponseDTO
  ──────────────────────────────────────────────────────────── */
  rateVendor: (id, ratingData) =>
    API.post(`/vendors/${id}/rating`, ratingData),

  /* ── EXPORT VENDORS CSV ─────────────────────────────────────
     GET /api/vendors/export
     Response: Blob (CSV file)
  ──────────────────────────────────────────────────────────── */
  exportCSV: () =>
    API.get("/vendors/export", {
      responseType: "blob",
    }),

  /* ── SEND EMAIL TO VENDOR ───────────────────────────────────
     POST /api/vendors/:id/send-email
     Body: { subject, message }
     Response: { message: "Email sent successfully" }
  ──────────────────────────────────────────────────────────── */
  sendEmail: (id, emailData) =>
    API.post(`/vendors/${id}/send-email`, emailData),

};

export default vendorService;