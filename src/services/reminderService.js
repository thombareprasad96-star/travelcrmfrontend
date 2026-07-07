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


// ═════════════════════════════════════════════════════════════
// HOW TO USE IN Reminders.jsx
// ═════════════════════════════════════════════════════════════
//
// 1. IMPORT AT TOP OF Reminders.jsx:
//    import reminderService from "../services/reminderService";
//
// ─────────────────────────────────────────────────────────────
// 2. REPLACE mock useEffect WITH REAL API CALL:
//
//    useEffect(() => {
//      setLoading(true);
//      reminderService
//        .getAll()
//        .then((res) => setReminders(res.data))
//        .catch(() => showToast("Failed to load reminders.", "error"))
//        .finally(() => setLoading(false));
//    }, []);
//
// ─────────────────────────────────────────────────────────────
// 3. REPLACE handleComplete:
//
//    const handleComplete = async (id) => {
//      try {
//        const res = await reminderService.markComplete(id);
//        setReminders((p) => p.map((r) => r.id === id ? res.data : r));
//        showToast("Reminder marked as completed! ✅");
//      } catch {
//        showToast("Failed to complete reminder.", "error");
//      }
//    };
//
// ─────────────────────────────────────────────────────────────
// 4. REPLACE handleDismiss:
//
//    const handleDismiss = async (id) => {
//      try {
//        const res = await reminderService.dismiss(id);
//        setReminders((p) => p.map((r) => r.id === id ? res.data : r));
//        showToast("Reminder dismissed.");
//      } catch {
//        showToast("Failed to dismiss reminder.", "error");
//      }
//    };
//
// ─────────────────────────────────────────────────────────────
// 5. REPLACE handleSnooze:
//
//    const handleSnooze = async (id, hours) => {
//      const until = new Date();
//      until.setHours(until.getHours() + hours);
//      try {
//        const res = await reminderService.snooze(id, until.toISOString());
//        setReminders((p) => p.map((r) => r.id === id ? res.data : r));
//        const opt = SNOOZE_OPTS.find((o) => o.hours === hours);
//        showToast(`Snoozed for ${opt?.label || `${hours} hours`} 😴`);
//      } catch {
//        showToast("Failed to snooze reminder.", "error");
//      }
//    };
//
// ─────────────────────────────────────────────────────────────
// 6. REPLACE handleDelete:
//
//    const handleDelete = async (id) => {
//      try {
//        await reminderService.delete(id);
//        setReminders((p) => p.filter((r) => r.id !== id));
//        showToast("Reminder deleted.");
//      } catch {
//        showToast("Failed to delete reminder.", "error");
//      }
//    };
//
// ─────────────────────────────────────────────────────────────
// 7. REPLACE handleSave (edit only — Add navigates to /CreateReminder):
//
//    const handleSave = async (form) => {
//      if (!form.title?.trim()) { showToast("Title is required.", "error"); return; }
//      if (!form.dueDate)       { showToast("Due date is required.", "error"); return; }
//      try {
//        const res = await reminderService.update(editR.id, form);
//        setReminders((p) => p.map((r) => r.id === editR.id ? res.data : r));
//        showToast("Reminder updated successfully.");
//        setEditR(null);
//      } catch (err) {
//        showToast(err?.response?.data?.message || "Failed to update.", "error");
//      }
//    };
//
// ─────────────────────────────────────────────────────────────
// 8. REPLACE handleAddLog:
//
//    const handleAddLog = async (r, log) => {
//      try {
//        const res = await reminderService.addLog(r.id, log);
//        setReminders((p) => p.map((x) => x.id === r.id ? res.data : x));
//        showToast("Activity log added.");
//      } catch {
//        showToast("Failed to add log.", "error");
//      }
//    };
//
// ─────────────────────────────────────────────────────────────
// 9. REPLACE markAllComplete:
//
//    const markAllComplete = async () => {
//      try {
//        await reminderService.completeAllOverdue();
//        // Refresh full list from server
//        const res = await reminderService.getAll();
//        setReminders(res.data);
//        showToast("All overdue reminders marked complete.");
//      } catch {
//        showToast("Failed to complete overdue reminders.", "error");
//      }
//    };
//
// ═════════════════════════════════════════════════════════════
// SPRING BOOT JAVA BACKEND — QUICK REFERENCE
// ═════════════════════════════════════════════════════════════
//
// Entity (Reminder.java):
// ───────────────────────
//   @Entity
//   @Table(name = "reminders")
//   public class Reminder {
//       @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
//       private Long id;
//       private String title;
//       private String description;
//
//       @Enumerated(EnumType.STRING)
//       private ReminderType type;         // First_contact, Follow_up, etc.
//
//       @Enumerated(EnumType.STRING)
//       private Priority priority;         // High, Medium, Low
//
//       @Enumerated(EnumType.STRING)
//       private ReminderStatus status;     // Active, Snoozed, Completed, Dismissed
//
//       private String leadName;
//       private String phone;
//
//       @Column(name = "due_date")
//       private LocalDateTime dueDate;
//
//       @Column(name = "snoozed_until")
//       private LocalDateTime snoozedUntil;
//
//       private String notes;
//
//       @Column(name = "created_at")
//       private LocalDateTime createdAt;
//
//       @PrePersist
//       protected void onCreate() { createdAt = LocalDateTime.now(); }
//   }
//
// ─────────────────────────────────────────────────────────────
// Controller (ReminderController.java):
// ──────────────────────────────────────
//   @RestController
//   @RequestMapping("/api/reminders")
//   @CrossOrigin(origins = "http://localhost:3000")   // your React dev URL
//   public class ReminderController {
//
//       @Autowired private ReminderService service;
//
//       @GetMapping
//       public ResponseEntity<List<ReminderDTO>> getAll(
//           @RequestParam(required=false) String status,
//           @RequestParam(required=false) String priority,
//           @RequestParam(required=false) String type) {
//           return ResponseEntity.ok(service.getAll(status, priority, type));
//       }
//
//       @GetMapping("/{id}")
//       public ResponseEntity<ReminderDTO> getById(@PathVariable Long id) {
//           return ResponseEntity.ok(service.getById(id));
//       }
//
//       @PostMapping
//       public ResponseEntity<ReminderDTO> create(@RequestBody ReminderDTO dto) {
//           return ResponseEntity.status(HttpStatus.CREATED).body(service.create(dto));
//       }
//
//       @PutMapping("/{id}")
//       public ResponseEntity<ReminderDTO> update(@PathVariable Long id, @RequestBody ReminderDTO dto) {
//           return ResponseEntity.ok(service.update(id, dto));
//       }
//
//       @PatchMapping("/{id}")
//       public ResponseEntity<ReminderDTO> patch(@PathVariable Long id, @RequestBody Map<String,Object> fields) {
//           return ResponseEntity.ok(service.patch(id, fields));
//       }
//
//       @DeleteMapping("/{id}")
//       public ResponseEntity<Void> delete(@PathVariable Long id) {
//           service.delete(id);
//           return ResponseEntity.noContent().build();
//       }
//
//       @PatchMapping("/{id}/complete")
//       public ResponseEntity<ReminderDTO> markComplete(@PathVariable Long id) {
//           return ResponseEntity.ok(service.markComplete(id));
//       }
//
//       @PatchMapping("/{id}/dismiss")
//       public ResponseEntity<ReminderDTO> dismiss(@PathVariable Long id) {
//           return ResponseEntity.ok(service.dismiss(id));
//       }
//
//       @PatchMapping("/{id}/snooze")
//       public ResponseEntity<ReminderDTO> snooze(@PathVariable Long id, @RequestBody Map<String,String> body) {
//           return ResponseEntity.ok(service.snooze(id, body.get("snoozedUntil")));
//       }
//
//       @PostMapping("/{id}/logs")
//       public ResponseEntity<ReminderDTO> addLog(@PathVariable Long id, @RequestBody Map<String,String> body) {
//           return ResponseEntity.ok(service.addLog(id, body.get("log")));
//       }
//
//       @GetMapping("/overdue")
//       public ResponseEntity<List<ReminderDTO>> getOverdue() {
//           return ResponseEntity.ok(service.getOverdue());
//       }
//
//       @PatchMapping("/complete-all-overdue")
//       public ResponseEntity<Integer> completeAllOverdue() {
//           return ResponseEntity.ok(service.completeAllOverdue());
//       }
//
//       @GetMapping("/stats")
//       public ResponseEntity<ReminderStatsDTO> getStats() {
//           return ResponseEntity.ok(service.getStats());
//       }
//
//       @GetMapping(value="/export/csv", produces="text/csv")
//       public ResponseEntity<byte[]> exportCsv() {
//           byte[] csv = service.exportCsv();
//           return ResponseEntity.ok()
//               .header("Content-Disposition","attachment; filename=reminders.csv")
//               .body(csv);
//       }
//   }
//
// ─────────────────────────────────────────────────────────────
// application.properties (Spring Boot):
// ──────────────────────────────────────
//   spring.datasource.url=jdbc:mysql://localhost:3306/travel_crm
//   spring.datasource.username=root
//   spring.datasource.password=yourpassword
//   spring.jpa.hibernate.ddl-auto=update
//   spring.jpa.show-sql=true
//
// ─────────────────────────────────────────────────────────────
// .env (React frontend — create in project root):
// ────────────────────────────────────────────────
//   REACT_APP_API_URL=http://localhost:8080
//
// ─────────────────────────────────────────────────────────────
// MySQL Table (reminders):
// ─────────────────────────
//   CREATE TABLE reminders (
//     id           BIGINT AUTO_INCREMENT PRIMARY KEY,
//     title        VARCHAR(255) NOT NULL,
//     description  VARCHAR(500),
//     type         ENUM('First_contact','Follow_up','Quotation','Payment',
//                       'Document','Birthday','Confirmation','Custom') NOT NULL,
//     priority     ENUM('High','Medium','Low') DEFAULT 'High',
//     status       ENUM('Active','Snoozed','Completed','Dismissed') DEFAULT 'Active',
//     lead_name    VARCHAR(255),
//     phone        VARCHAR(20),
//     due_date     DATETIME NOT NULL,
//     snoozed_until DATETIME,
//     notes        TEXT,
//     created_at   DATETIME DEFAULT CURRENT_TIMESTAMP
//   );
// ─────────────────────────────────────────────────────────────