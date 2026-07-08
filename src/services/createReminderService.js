// src/services/createReminderService.js
// ─────────────────────────────────────────────────────────────
// Create Reminder Page — API Services
// Backend: Java Spring Boot REST API
// Covers: Reminders + Leads dropdown + Users dropdown
// ─────────────────────────────────────────────────────────────

import API from "@shared/api/http";


// ═════════════════════════════════════════════════════════════
// 1. REMINDER SERVICE
//    Spring Boot Controller: /api/reminders
// ═════════════════════════════════════════════════════════════
export const reminderService = {

  // POST /api/reminders
  // @PostMapping("/api/reminders")
  // public ResponseEntity<ReminderDTO> createReminder(@RequestBody ReminderDTO dto)
  //
  // Request body sent from CreateReminder.jsx:
  // {
  //   title:        "Contact New Lead: Pratik",
  //   description:  "New lead requires initial contact",
  //   type:         "First_contact",
  //   priority:     "High",
  //   status:       "Active",
  //   leadId:       "LD1042",
  //   leadName:     "Pratik",
  //   phone:        "+91 88888 88888",
  //   assignTo:     "U01",
  //   dueDate:      "2026-06-20T10:00:00.000Z",
  //   notes:        "Call before 11 AM",
  //   snoozedUntil: null
  // }
  //
  // Response: ReminderDTO with id, title, status, createdAt, etc.
  create: (reminderData) => {
    return API.post("/reminders", reminderData);
  },

  // GET /api/reminders
  // @GetMapping("/api/reminders")
  // public ResponseEntity<List<ReminderDTO>> getAllReminders()
  getAll: (params = {}) => {
    return API.get("/reminders", { params });
  },

  // GET /api/reminders/{id}
  // @GetMapping("/api/reminders/{id}")
  // public ResponseEntity<ReminderDTO> getReminderById(@PathVariable Long id)
  getById: (id) => {
    return API.get(`/reminders/${id}`);
  },

  // PUT /api/reminders/{id}
  // @PutMapping("/api/reminders/{id}")
  // public ResponseEntity<ReminderDTO> updateReminder(@PathVariable Long id, @RequestBody ReminderDTO dto)
  update: (id, reminderData) => {
    return API.put(`/reminders/${id}`, reminderData);
  },

  // DELETE /api/reminders/{id}
  // @DeleteMapping("/api/reminders/{id}")
  // public ResponseEntity<Void> deleteReminder(@PathVariable Long id)
  delete: (id) => {
    return API.delete(`/reminders/${id}`);
  },

  // PATCH /api/reminders/{id}/complete
  // @PatchMapping("/api/reminders/{id}/complete")
  // public ResponseEntity<ReminderDTO> markComplete(@PathVariable Long id)
  markComplete: (id) => {
    return API.patch(`/reminders/${id}/complete`);
  },

  // PATCH /api/reminders/{id}/dismiss
  // @PatchMapping("/api/reminders/{id}/dismiss")
  // public ResponseEntity<ReminderDTO> dismiss(@PathVariable Long id)
  dismiss: (id) => {
    return API.patch(`/reminders/${id}/dismiss`);
  },

  // PATCH /api/reminders/{id}/snooze
  // @PatchMapping("/api/reminders/{id}/snooze")
  // Body: { snoozedUntil: "2026-06-21T10:00:00.000Z" }
  snooze: (id, snoozedUntilISO) => {
    return API.patch(`/reminders/${id}/snooze`, {
      snoozedUntil: snoozedUntilISO,
    });
  },

  // POST /api/reminders/{id}/logs
  // @PostMapping("/api/reminders/{id}/logs")
  // Body: { log: "Called customer, no answer." }
  addLog: (id, logText) => {
    return API.post(`/reminders/${id}/logs`, { log: logText });
  },

  // PATCH /api/reminders/complete-all-overdue
  // @PatchMapping("/api/reminders/complete-all-overdue")
  // public ResponseEntity<Integer> completeAllOverdue()
  completeAllOverdue: () => {
    return API.patch("/reminders/complete-all-overdue");
  },

  // GET /api/reminders/stats
  // @GetMapping("/api/reminders/stats")
  // Returns: { total, active, overdue, completed, snoozed }
  getStats: () => {
    return API.get("/reminders/stats");
  },

  // GET /api/reminders/export/csv
  // @GetMapping(value="/api/reminders/export/csv", produces="text/csv")
  exportCSV: () => {
    return API.get("/reminders/export/csv", { responseType: "blob" });
  },
};


// ═════════════════════════════════════════════════════════════
// 2. LEAD SERVICE (for Lead dropdown in CreateReminder)
//    Spring Boot Controller: /api/leads
// ═════════════════════════════════════════════════════════════
export const leadService = {

  // GET /api/leads
  // @GetMapping("/api/leads")
  // public ResponseEntity<List<LeadDropdownDTO>> getAllLeads()
  //
  // LeadDropdownDTO (only fields needed for dropdown):
  // { id, name, phone }
  // Example response:
  // [
  //   { "id": "LD1042", "name": "Pratik",   "phone": "+91 88888 88888" },
  //   { "id": "LD1039", "name": "Priyanshu", "phone": "+91 83029 32798" },
  //   ...
  // ]
  getAll: () => {
    return API.get("/leads");
  },

  // GET /api/leads  → PagedApiResponse<LeadResponseDto>
  // Each lead exposes { id (UUID = publicId), customerName, phone, ... }.
  // (There is no separate /dropdown endpoint on the backend; the paged list is used.)
  getForDropdown: () => {
    return API.get("/leads", { params: { size: 1000 } });
  },

  // GET /api/leads/{id}
  // @GetMapping("/api/leads/{id}")
  // public ResponseEntity<LeadDTO> getLeadById(@PathVariable String id)
  // Used to auto-fill phone after lead selection
  getById: (id) => {
    return API.get(`/leads/${id}`);
  },

  // GET /api/leads/search?query=Pratik
  // @GetMapping("/api/leads/search")
  // public ResponseEntity<List<LeadDropdownDTO>> searchLeads(@RequestParam String query)
  // Optional: for searchable dropdown
  search: (query) => {
    return API.get("/leads/search", { params: { query } });
  },
};


// ═════════════════════════════════════════════════════════════
// 3. USER SERVICE (for Assign To dropdown in CreateReminder)
//    Spring Boot Controller: /api/users
// ═════════════════════════════════════════════════════════════
export const userService = {

  // GET /api/users
  // @GetMapping("/api/users")
  // public ResponseEntity<List<UserDTO>> getAllUsers()
  //
  // UserDTO (fields needed for dropdown):
  // { id, name }
  // Example response:
  // [
  //   { "id": "U01", "name": "Rajesh Kumar" },
  //   { "id": "U02", "name": "Priya Sharma" },
  //   ...
  // ]
  getAll: () => {
    return API.get("/users");
  },

  // GET /api/users/dropdown
  // Lightweight endpoint — only id and name
  // @GetMapping("/api/users/dropdown")
  // public ResponseEntity<List<UserDropdownDTO>> getUsersForDropdown()
  getForDropdown: () => {
    return API.get("/users/dropdown");
  },

  // GET /api/users/available → ApiResponse<List<UserDto>>
  // Active tenant users eligible for assignment: { publicId (UUID), fullName, role, email }.
  getActive: () => {
    return API.get("/users/available");
  },
};


// ═════════════════════════════════════════════════════════════
// DEFAULT EXPORT — all three services bundled
// ═════════════════════════════════════════════════════════════
export default { reminderService, leadService, userService };
// ─────────────────────────────────────────────────────────────