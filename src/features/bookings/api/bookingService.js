// src/features/bookings/api/bookingService.js
//
// Booking API client. Base URL is `http://localhost:8080/api` (see shared/api/http.js), so every
// path here starts at `/bookings`. Throughout, a booking/payment/service "id" is its publicId
// (UUID) — never the internal Long — matching the backend `{publicId}` path variables.
//
// Enum note: the backend binds enums case-sensitively (no case-insensitive Jackson config), so
// status / payment-method / service-status values are sent UPPERCASE. The UI shows Title-case and
// these helpers normalise on the way out.

import API from "@shared/api/http";

/** UI label ("Confirmed", "Bank Transfer") → backend enum token ("CONFIRMED", "BANK_TRANSFER"). */
const toEnum = (v) =>
  v == null || v === "" ? undefined : String(v).trim().toUpperCase().replace(/[\s-]+/g, "_");

const bookingService = {

  // ── Core CRUD ──────────────────────────────────────────────────────────────
  getAll: (page = 0, size = 1000, sortBy = "createdAt", sortDir = "desc") =>
    API.get("/bookings", { params: { page, size, sortBy, sortDir } }),

  getById: (publicId) => API.get(`/bookings/${publicId}`),

  getByCode: (code) => API.get(`/bookings/code/${code}`),

  create: (bookingData) => API.post("/bookings", bookingData),

  convertFromLead: (leadPublicId, payload) =>
    API.post(`/leads/${leadPublicId}/convert-to-booking`, payload),

  update: (publicId, bookingData) => API.put(`/bookings/${publicId}`, bookingData),

  // Booking status: backend enum is UPPERCASE (CONFIRMED | PENDING | COMPLETED | REFUNDED).
  // CANCELLED must go through cancel() — the backend rejects it here.
  updateStatus: (publicId, status, reason) =>
    API.patch(`/bookings/${publicId}/status`, { status: toEnum(status), reason }),

  // Legacy running-total top-up (kept for compatibility). New UI records payments via the
  // itemised ledger (addPayment) instead so each receipt is a visible row.
  updatePayment: (publicId, { amount, paymentDate, paymentReference, notes } = {}) =>
    API.patch(`/bookings/${publicId}/payment`, { amount, paymentDate, paymentReference, notes }),

  // ── Cancellation, refund & documents ────────────────────────────────────────
  // The BACKEND computes every rupee. The UI submits proposed figures and renders exactly what
  // these endpoints return — it must never recompute a retained/refund amount in JS.

  // Dry-run preview of a cancellation. Optional { overrideChargeBase, vendorRecoverable } show the
  // exact figures of a proposed waiver/override before confirming. Returns the itemised quote.
  getCancellationPreview: (publicId, { overrideChargeBase, vendorRecoverable } = {}) =>
    API.get(`/bookings/${publicId}/cancellation/preview`, {
      params: { overrideChargeBase, vendorRecoverable },
    }),

  // Confirm the cancellation. `payload` may be the bare action string (back-compat) or the full body:
  //   { action, reason?, overrideChargeBase?, overrideReason?, vendorRecoverable? }
  // action: "MOVE_TO_LEAD" | "PERMANENT_DELETE_LEAD". Override fields require BOOKING_REFUND.
  cancel: (publicId, payload) =>
    API.post(`/bookings/${publicId}/cancel`,
      typeof payload === "string" ? { action: payload } : payload),

  // Frozen refund position of a cancelled booking (due / paid-out / remaining). 404 if never cancelled.
  getCancellationSummary: (publicId) =>
    API.get(`/bookings/${publicId}/cancellation`),

  // Record one refund disbursement against a cancelled booking. `payload`:
  //   { amount, method?, reference?, refundDate?, notes?, idempotencyKey? }
  // Requires BOOKING_REFUND. The backend caps the amount to what's still refundable and issues a voucher.
  refund: (publicId, payload) =>
    API.post(`/bookings/${publicId}/cancellation/refund`, payload),

  // Cancellation note (Credit Note when refunded, Debit Note when the customer owes) — PDF blob.
  getCreditNote: (publicId) =>
    API.get(`/bookings/${publicId}/cancellation/credit-note`, { responseType: "blob" }),

  // Refund voucher — PDF blob. Available only after a refund has been disbursed.
  getRefundVoucher: (publicId) =>
    API.get(`/bookings/${publicId}/cancellation/refund-voucher`, { responseType: "blob" }),

  delete: (publicId) => API.delete(`/bookings/${publicId}`),

  getByCustomer: (customerId) => API.get(`/bookings/customer/${customerId}`),

  // Backend expects `keyword` (was mistakenly `q` before).
  search: (keyword) => API.get("/bookings/search", { params: { keyword } }),

  // Enum params are normalised; month params are 1–12 integers.
  filter: ({ status, paymentStatus, bookingMonth, travelMonth, customerId,
             fromDate, toDate, minAmount, maxAmount } = {}) =>
    API.get("/bookings/filter", {
      params: {
        status: toEnum(status),
        paymentStatus: toEnum(paymentStatus),
        bookingMonth, travelMonth, customerId, fromDate, toDate, minAmount, maxAmount,
      },
    }),

  getStats: () => API.get("/bookings/stats"),

  getPageSummary: (page = 0, size = 10) =>
    API.get("/bookings/page-summary", { params: { page, size } }),

  exportCSV: () => API.get("/bookings/export", { responseType: "blob" }),

  // ── Payment ledger ─────────────────────────────────────────────────────────
  // GET  /bookings/{id}/payments
  getPayments: (bookingId) => API.get(`/bookings/${bookingId}/payments`),

  // POST /bookings/{id}/payments
  // body: { amount, paymentType?, paymentMethod?, paymentDate?, reference?, notes?, serviceItemPublicId? }
  // paymentMethod is a free label ("Bank Transfer", "Credit Card", …) — sent as-is.
  addPayment: (bookingId, data) => API.post(`/bookings/${bookingId}/payments`, data),

  // DELETE /bookings/{id}/payments/{paymentId}
  deletePayment: (bookingId, paymentId) =>
    API.delete(`/bookings/${bookingId}/payments/${paymentId}`),

  // ── Service line items + vendor assignment ──────────────────────────────────
  // GET  /bookings/{id}/services
  getServices: (bookingId) => API.get(`/bookings/${bookingId}/services`),

  // POST /bookings/{id}/services
  // body: { serviceType?, title, description?, serviceDate?, endDate?, status?, cost?, vendorCost?, confirmationNumber?, notes? }
  addService: (bookingId, data) =>
    API.post(`/bookings/${bookingId}/services`, { ...data, status: toEnum(data?.status) }),

  // PUT /bookings/{id}/services/{serviceId}
  updateService: (bookingId, serviceId, data) =>
    API.put(`/bookings/${bookingId}/services/${serviceId}`, {
      ...data,
      status: toEnum(data?.status),
    }),

  // DELETE /bookings/{id}/services/{serviceId}
  deleteService: (bookingId, serviceId) =>
    API.delete(`/bookings/${bookingId}/services/${serviceId}`),

  // PUT /bookings/{id}/services/{serviceId}/vendor
  // body: { vendorPublicId, vendorCost?, confirmationNumber? }
  assignVendor: (bookingId, serviceId, data) =>
    API.put(`/bookings/${bookingId}/services/${serviceId}/vendor`, data),

  // Vendor dropdown for the assign modal (uses the vendors module list endpoint).
  getVendors: () => API.get("/vendors", { params: { page: 0, size: 1000 } }),

  // ── Documents (server-rendered PDF, on-the-fly) ─────────────────────────────
  // Each returns an axios blob response; hand `res.data` to downloadBlob()/openBlob().
  getInvoice: (bookingId) =>
    API.get(`/bookings/${bookingId}/invoice`, { responseType: "blob" }),

  getVoucher: (bookingId) =>
    API.get(`/bookings/${bookingId}/voucher`, { responseType: "blob" }),

  getServiceVoucher: (bookingId, serviceId) =>
    API.get(`/bookings/${bookingId}/services/${serviceId}/voucher`, { responseType: "blob" }),

  // send-voucher (email) remains a backend stub; the PDF endpoints above are the real deliverables.
  sendVoucher: (bookingId) => API.post(`/bookings/${bookingId}/send-voucher`),
};

export default bookingService;