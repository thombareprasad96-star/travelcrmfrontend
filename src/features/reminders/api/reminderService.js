// src/services/reminderService.js
// ─────────────────────────────────────────────────────────────
// Reminder Service — Travel CRM
// Backend: Java Spring Boot REST API
// Base URL: configured via environment variable
// ─────────────────────────────────────────────────────────────

import API from "@shared/api/http";

// ─────────────────────────────────────────────────────────────
// REMINDER SERVICE
// Maps to Spring Boot controller: /api/reminders
// ─────────────────────────────────────────────────────────────
const reminderService = {

  // ── GET ALL REMINDERS ──────────────────────────────────────
  // GET /api/reminders
  // Spring Boot endpoint:
  //   @GetMapping("/api/reminders")
  //   public ResponseEntity<List<ReminderDTO>> getAllReminders() { ... }
  //
  // Optional query params: ?status=Active&priority=High&type=Follow_up
  // Spring: @RequestParam(required = false) String status, ...
  getAll: (params = {}) => {
    return API.get("/reminders", { params });
    // params example: { status: "Active", priority: "High", type: "Follow_up" }
  },

  // ── GET REMINDER BY ID ─────────────────────────────────────
  // GET /api/reminders/{id}
  // Spring Boot endpoint:
  //   @GetMapping("/api/reminders/{id}")
  //   public ResponseEntity<ReminderDTO> getReminderById(@PathVariable Long id) { ... }
  getById: (id) => {
    return API.get(`/reminders/${id}`);
  },

  // ── CREATE REMINDER ────────────────────────────────────────
  // POST /api/reminders
  // Spring Boot endpoint:
  //   @PostMapping("/api/reminders")
  //   public ResponseEntity<ReminderDTO> createReminder(@RequestBody ReminderDTO dto) { ... }
  //
  // Request body (ReminderDTO):
  //   {
  //     title: "Contact New Lead: Pratik",
  //     description: "New lead requires initial contact",
  //     type: "First_contact",          // enum: First_contact, Follow_up, Quotation, Payment, Document, Birthday, Confirmation, Custom
  //     priority: "High",               // enum: High, Medium, Low
  //     status: "Active",               // enum: Active, Snoozed, Completed, Dismissed
  //     leadName: "Pratik",
  //     phone: "+91 88888 88888",
  //     dueDate: "2026-06-20T10:00:00", // ISO 8601
  //     notes: "Call before 11 AM",
  //     snoozedUntil: null
  //   }
  create: (reminderData) => {
    return API.post("/reminders", reminderData);
  },

  // ── UPDATE REMINDER ────────────────────────────────────────
  // PUT /api/reminders/{id}
  // Spring Boot endpoint:
  //   @PutMapping("/api/reminders/{id}")
  //   public ResponseEntity<ReminderDTO> updateReminder(@PathVariable Long id, @RequestBody ReminderDTO dto) { ... }
  update: (id, reminderData) => {
    return API.put(`/reminders/${id}`, reminderData);
  },

  // ── PARTIAL UPDATE (PATCH) ─────────────────────────────────
  // PATCH /api/reminders/{id}
  // Spring Boot endpoint:
  //   @PatchMapping("/api/reminders/{id}")
  //   public ResponseEntity<ReminderDTO> patchReminder(@PathVariable Long id, @RequestBody Map<String, Object> updates) { ... }
  //
  // Used for quick field updates (status change, snooze, etc.)
  patch: (id, fields) => {
    return API.patch(`/reminders/${id}`, fields);
  },

  // ── DELETE REMINDER ────────────────────────────────────────
  // DELETE /api/reminders/{id}
  // Spring Boot endpoint:
  //   @DeleteMapping("/api/reminders/{id}")
  //   public ResponseEntity<Void> deleteReminder(@PathVariable Long id) { ... }
  delete: (id) => {
    return API.delete(`/reminders/${id}`);
  },

  // ── MARK COMPLETE ──────────────────────────────────────────
  // PATCH /api/reminders/{id}/complete
  // Spring Boot endpoint:
  //   @PatchMapping("/api/reminders/{id}/complete")
  //   public ResponseEntity<ReminderDTO> markComplete(@PathVariable Long id) { ... }
  markComplete: (id) => {
    return API.patch(`/reminders/${id}/complete`);
  },

  // ── MARK DISMISSED ────────────────────────────────────────
  // PATCH /api/reminders/{id}/dismiss
  // Spring Boot endpoint:
  //   @PatchMapping("/api/reminders/{id}/dismiss")
  //   public ResponseEntity<ReminderDTO> dismiss(@PathVariable Long id) { ... }
  dismiss: (id) => {
    return API.patch(`/reminders/${id}/dismiss`);
  },

  // ── SNOOZE REMINDER ───────────────────────────────────────
  // PATCH /api/reminders/{id}/snooze
  // Spring Boot endpoint:
  //   @PatchMapping("/api/reminders/{id}/snooze")
  //   public ResponseEntity<ReminderDTO> snooze(@PathVariable Long id, @RequestBody SnoozeRequest request) { ... }
  //
  // SnoozeRequest body: { snoozedUntil: "2026-06-21T10:00:00" }
  snooze: (id, snoozedUntilISO) => {
    return API.patch(`/reminders/${id}/snooze`, {
      snoozedUntil: snoozedUntilISO,
    });
  },

  // ── ADD ACTIVITY LOG ───────────────────────────────────────
  // POST /api/reminders/{id}/logs
  // Spring Boot endpoint:
  //   @PostMapping("/api/reminders/{id}/logs")
  //   public ResponseEntity<ReminderDTO> addLog(@PathVariable Long id, @RequestBody LogRequest request) { ... }
  //
  // LogRequest body: { log: "Called customer, no answer. Retry tomorrow." }
  addLog: (id, logText) => {
    return API.post(`/reminders/${id}/logs`, { log: logText });
  },

  // ── GET OVERDUE REMINDERS ──────────────────────────────────
  // GET /api/reminders/overdue
  // Spring Boot endpoint:
  //   @GetMapping("/api/reminders/overdue")
  //   public ResponseEntity<List<ReminderDTO>> getOverdue() { ... }
  //   // Query: WHERE status='Active' AND due_date < NOW()
  getOverdue: () => {
    return API.get("/reminders/overdue");
  },

  // ── GET REMINDERS BY LEAD NAME ─────────────────────────────
  // GET /api/reminders/lead/{leadName}
  // Spring Boot endpoint:
  //   @GetMapping("/api/reminders/lead/{leadName}")
  //   public ResponseEntity<List<ReminderDTO>> getByLeadName(@PathVariable String leadName) { ... }
  getByLeadName: (leadName) => {
    return API.get(`/reminders/lead/${encodeURIComponent(leadName)}`);
  },

  // ── MARK ALL OVERDUE AS COMPLETE ───────────────────────────
  // PATCH /api/reminders/complete-all-overdue
  // Spring Boot endpoint:
  //   @PatchMapping("/api/reminders/complete-all-overdue")
  //   public ResponseEntity<Integer> completeAllOverdue() { ... }
  //   // Returns count of updated records
  completeAllOverdue: () => {
    return API.patch("/reminders/complete-all-overdue");
  },

  // ── GET STATS / COUNTS ─────────────────────────────────────
  // GET /api/reminders/stats
  // Spring Boot endpoint:
  //   @GetMapping("/api/reminders/stats")
  //   public ResponseEntity<ReminderStatsDTO> getStats() { ... }
  //
  // ReminderStatsDTO: { total, active, overdue, completed, snoozed }
  getStats: () => {
    return API.get("/reminders/stats");
  },

  // ── EXPORT TO CSV ──────────────────────────────────────────
  // GET /api/reminders/export/csv
  // Spring Boot endpoint:
  //   @GetMapping(value="/api/reminders/export/csv", produces="text/csv")
  //   public ResponseEntity<byte[]> exportCsv() { ... }
  exportCSV: () => {
    return API.get("/reminders/export/csv", {
      responseType: "blob", // important for file download
    });
  },
};

export default reminderService;
// ─────────────────────────────────────────────────────────────