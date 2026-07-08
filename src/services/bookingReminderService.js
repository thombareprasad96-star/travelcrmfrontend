// src/services/bookingReminderService.js
// ─────────────────────────────────────────────────────────────
// Booking Reminders Page — API Service
// Backend: Java Spring Boot REST API
// ─────────────────────────────────────────────────────────────

import API from "@shared/api/http";


// ═════════════════════════════════════════════════════════════
// BOOKING REMINDER SERVICE
// Spring Boot Controller: /api/booking-reminders
// ═════════════════════════════════════════════════════════════
const bookingReminderService = {

  // ── GET ALL BOOKING REMINDERS ──────────────────────────────
  // GET /api/booking-reminders
  // @GetMapping("/api/booking-reminders")
  // public ResponseEntity<List<BookingReminderDTO>> getAll(
  //     @RequestParam(required=false) String status)
  //
  // Optional query param: ?status=Pending | Sent | Completed
  getAll: (params = {}) => {
    return API.get("/booking-reminders", { params });
    // params example: { status: "Pending" }
  },

  // ── GET BY ID ───────────────────────────────────────────────
  // GET /api/booking-reminders/{id}
  // @GetMapping("/api/booking-reminders/{id}")
  // public ResponseEntity<BookingReminderDTO> getById(@PathVariable Long id)
  getById: (id) => {
    return API.get(`/booking-reminders/${id}`);
  },

  // ── CREATE BOOKING REMINDER ────────────────────────────────
  // POST /api/booking-reminders
  // @PostMapping("/api/booking-reminders")
  // public ResponseEntity<BookingReminderDTO> create(@RequestBody BookingReminderDTO dto)
  //
  // Request body:
  // {
  //   bookingCode:   "BK10001",
  //   customerName:  "Arjun Sharma",
  //   phone:         "+91 98765 43210",
  //   destination:   "Maldives Escape",
  //   reminderType:  "Payment_due",   // Payment_due, Final_payment, Document, Visa, Travel_date, Itinerary
  //   message:       "Balance payment of ₹85,000 due before travel date.",
  //   travelDate:    "2026-08-01T00:00:00.000Z",
  //   reminderDate:  "2026-06-18T00:00:00.000Z",
  //   status:        "Pending",       // Pending, Sent, Completed
  //   amount:        85000
  // }
  create: (data) => {
    return API.post("/booking-reminders", data);
  },

  // ── UPDATE BOOKING REMINDER ────────────────────────────────
  // PUT /api/booking-reminders/{id}
  // @PutMapping("/api/booking-reminders/{id}")
  // public ResponseEntity<BookingReminderDTO> update(@PathVariable Long id, @RequestBody BookingReminderDTO dto)
  update: (id, data) => {
    return API.put(`/booking-reminders/${id}`, data);
  },

  // ── DELETE BOOKING REMINDER ────────────────────────────────
  // DELETE /api/booking-reminders/{id}
  // @DeleteMapping("/api/booking-reminders/{id}")
  // public ResponseEntity<Void> delete(@PathVariable Long id)
  delete: (id) => {
    return API.delete(`/booking-reminders/${id}`);
  },

  // ── MARK AS SENT ────────────────────────────────────────────
  // PATCH /api/booking-reminders/{id}/sent
  // @PatchMapping("/api/booking-reminders/{id}/sent")
  // public ResponseEntity<BookingReminderDTO> markSent(@PathVariable Long id)
  markSent: (id) => {
    return API.patch(`/booking-reminders/${id}/sent`);
  },

  // ── MARK AS COMPLETED ──────────────────────────────────────
  // PATCH /api/booking-reminders/{id}/complete
  // @PatchMapping("/api/booking-reminders/{id}/complete")
  // public ResponseEntity<BookingReminderDTO> markComplete(@PathVariable Long id)
  markComplete: (id) => {
    return API.patch(`/booking-reminders/${id}/complete`);
  },

  // ── MARK AS PENDING (revert) ───────────────────────────────
  // PATCH /api/booking-reminders/{id}/pending
  // @PatchMapping("/api/booking-reminders/{id}/pending")
  // public ResponseEntity<BookingReminderDTO> markPending(@PathVariable Long id)
  markPending: (id) => {
    return API.patch(`/booking-reminders/${id}/pending`);
  },

  // ── GET BY BOOKING CODE ─────────────────────────────────────
  // GET /api/booking-reminders/booking/{bookingCode}
  // @GetMapping("/api/booking-reminders/booking/{bookingCode}")
  // public ResponseEntity<List<BookingReminderDTO>> getByBookingCode(@PathVariable String bookingCode)
  getByBookingCode: (bookingCode) => {
    return API.get(`/booking-reminders/booking/${bookingCode}`);
  },

  // ── GET STATS / COUNTS ──────────────────────────────────────
  // GET /api/booking-reminders/stats
  // @GetMapping("/api/booking-reminders/stats")
  // public ResponseEntity<BookingReminderStatsDTO> getStats()
  //
  // Returns: { total, pending, sent, completed }
  getStats: () => {
    return API.get("/booking-reminders/stats");
  },

  // ── GET UPCOMING (travel date within N days) ────────────────
  // GET /api/booking-reminders/upcoming?days=7
  // @GetMapping("/api/booking-reminders/upcoming")
  // public ResponseEntity<List<BookingReminderDTO>> getUpcoming(@RequestParam(defaultValue="7") int days)
  getUpcoming: (days = 7) => {
    return API.get("/booking-reminders/upcoming", { params: { days } });
  },

  // ── SEND REMINDER NOW (trigger WhatsApp/SMS/Email via backend) ─
  // POST /api/booking-reminders/{id}/send-now
  // @PostMapping("/api/booking-reminders/{id}/send-now")
  // public ResponseEntity<BookingReminderDTO> sendNow(@PathVariable Long id)
  //
  // Backend handles actual WhatsApp/SMS/Email dispatch and marks status="Sent"
  sendNow: (id) => {
    return API.post(`/booking-reminders/${id}/send-now`);
  },
};

export default bookingReminderService;
// ─────────────────────────────────────────────────────────────