// src/services/createReminderService.js
// ─────────────────────────────────────────────────────────────
// Create Reminder Page — API Services
// Backend: Java Spring Boot REST API
// Covers: Reminders + Leads dropdown + Users dropdown
// ─────────────────────────────────────────────────────────────

import axios from "axios";

// ── BASE URL ──────────────────────────────────────────────────
// Add this to your .env file in React project root:
// REACT_APP_API_URL=http://localhost:8080
const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080";

// ── AXIOS INSTANCE ────────────────────────────────────────────
const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

// ── REQUEST INTERCEPTOR — attach JWT token ────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ── RESPONSE INTERCEPTOR — handle 401 globally ───────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);


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
    return api.post("/api/reminders", reminderData);
  },

  // GET /api/reminders
  // @GetMapping("/api/reminders")
  // public ResponseEntity<List<ReminderDTO>> getAllReminders()
  getAll: (params = {}) => {
    return api.get("/api/reminders", { params });
  },

  // GET /api/reminders/{id}
  // @GetMapping("/api/reminders/{id}")
  // public ResponseEntity<ReminderDTO> getReminderById(@PathVariable Long id)
  getById: (id) => {
    return api.get(`/api/reminders/${id}`);
  },

  // PUT /api/reminders/{id}
  // @PutMapping("/api/reminders/{id}")
  // public ResponseEntity<ReminderDTO> updateReminder(@PathVariable Long id, @RequestBody ReminderDTO dto)
  update: (id, reminderData) => {
    return api.put(`/api/reminders/${id}`, reminderData);
  },

  // DELETE /api/reminders/{id}
  // @DeleteMapping("/api/reminders/{id}")
  // public ResponseEntity<Void> deleteReminder(@PathVariable Long id)
  delete: (id) => {
    return api.delete(`/api/reminders/${id}`);
  },

  // PATCH /api/reminders/{id}/complete
  // @PatchMapping("/api/reminders/{id}/complete")
  // public ResponseEntity<ReminderDTO> markComplete(@PathVariable Long id)
  markComplete: (id) => {
    return api.patch(`/api/reminders/${id}/complete`);
  },

  // PATCH /api/reminders/{id}/dismiss
  // @PatchMapping("/api/reminders/{id}/dismiss")
  // public ResponseEntity<ReminderDTO> dismiss(@PathVariable Long id)
  dismiss: (id) => {
    return api.patch(`/api/reminders/${id}/dismiss`);
  },

  // PATCH /api/reminders/{id}/snooze
  // @PatchMapping("/api/reminders/{id}/snooze")
  // Body: { snoozedUntil: "2026-06-21T10:00:00.000Z" }
  snooze: (id, snoozedUntilISO) => {
    return api.patch(`/api/reminders/${id}/snooze`, {
      snoozedUntil: snoozedUntilISO,
    });
  },

  // POST /api/reminders/{id}/logs
  // @PostMapping("/api/reminders/{id}/logs")
  // Body: { log: "Called customer, no answer." }
  addLog: (id, logText) => {
    return api.post(`/api/reminders/${id}/logs`, { log: logText });
  },

  // PATCH /api/reminders/complete-all-overdue
  // @PatchMapping("/api/reminders/complete-all-overdue")
  // public ResponseEntity<Integer> completeAllOverdue()
  completeAllOverdue: () => {
    return api.patch("/api/reminders/complete-all-overdue");
  },

  // GET /api/reminders/stats
  // @GetMapping("/api/reminders/stats")
  // Returns: { total, active, overdue, completed, snoozed }
  getStats: () => {
    return api.get("/api/reminders/stats");
  },

  // GET /api/reminders/export/csv
  // @GetMapping(value="/api/reminders/export/csv", produces="text/csv")
  exportCSV: () => {
    return api.get("/api/reminders/export/csv", { responseType: "blob" });
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
    return api.get("/api/leads");
  },

  // GET /api/leads/dropdown
  // Lightweight endpoint — only id, name, phone
  // @GetMapping("/api/leads/dropdown")
  // public ResponseEntity<List<LeadDropdownDTO>> getLeadsForDropdown()
  // Use this if your /api/leads returns heavy objects (travel details, notes etc.)
  getForDropdown: () => {
    return api.get("/api/leads/dropdown");
  },

  // GET /api/leads/{id}
  // @GetMapping("/api/leads/{id}")
  // public ResponseEntity<LeadDTO> getLeadById(@PathVariable String id)
  // Used to auto-fill phone after lead selection
  getById: (id) => {
    return api.get(`/api/leads/${id}`);
  },

  // GET /api/leads/search?query=Pratik
  // @GetMapping("/api/leads/search")
  // public ResponseEntity<List<LeadDropdownDTO>> searchLeads(@RequestParam String query)
  // Optional: for searchable dropdown
  search: (query) => {
    return api.get("/api/leads/search", { params: { query } });
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
    return api.get("/api/users");
  },

  // GET /api/users/dropdown
  // Lightweight endpoint — only id and name
  // @GetMapping("/api/users/dropdown")
  // public ResponseEntity<List<UserDropdownDTO>> getUsersForDropdown()
  getForDropdown: () => {
    return api.get("/api/users/dropdown");
  },

  // GET /api/users/active
  // Only fetch active/enabled users
  // @GetMapping("/api/users/active")
  // public ResponseEntity<List<UserDTO>> getActiveUsers()
  getActive: () => {
    return api.get("/api/users/active");
  },
};


// ═════════════════════════════════════════════════════════════
// DEFAULT EXPORT — all three services bundled
// ═════════════════════════════════════════════════════════════
export default { reminderService, leadService, userService };


// ═════════════════════════════════════════════════════════════
// HOW TO USE IN CreateReminder.jsx
// ═════════════════════════════════════════════════════════════
//
// STEP 1 — Import at top of CreateReminder.jsx:
//
//   import { reminderService, leadService, userService }
//     from "../services/createReminderService";
//
// ─────────────────────────────────────────────────────────────
// STEP 2 — Replace mock useEffect with real API calls:
//
//   useEffect(() => {
//     // Load leads for dropdown
//     leadService
//       .getForDropdown()
//       .then((res) => setLeads(res.data))
//       .catch(() => showToast("Failed to load leads.", "error"));
//
//     // Load users for Assign To dropdown
//     userService
//       .getActive()
//       .then((res) => setUsers(res.data))
//       .catch(() => showToast("Failed to load users.", "error"));
//   }, []);
//
// ─────────────────────────────────────────────────────────────
// STEP 3 — Replace mock onSubmit with real API call:
//
//   const onSubmit = async (data) => {
//     setSubmitting(true);
//     try {
//       const selectedLead = leads.find((l) => l.id === data.leadId);
//       const payload = {
//         title:        data.title.trim(),
//         description:  data.description.trim(),
//         type:         data.type,
//         priority:     data.priority,
//         status:       "Active",
//         leadId:       data.leadId || null,
//         leadName:     selectedLead?.name || "",
//         phone:        data.phone.trim(),
//         assignTo:     data.assignTo || null,
//         dueDate:      new Date(data.dueDate).toISOString(),
//         notes:        data.notes.trim(),
//         snoozedUntil: null,
//       };
//
//       const res = await reminderService.create(payload);
//
//       showToast(`Reminder "${res.data.title}" created successfully! 🔔`);
//       reset({ dueDate: defaultDueDate(), type: "Custom", priority: "Medium" });
//       navigate("/Reminders");
//
//     } catch (err) {
//       showToast(
//         err?.response?.data?.message || "Failed to create reminder.",
//         "error"
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   };
//
// ─────────────────────────────────────────────────────────────
// STEP 4 — Auto-fill phone when lead changes (already in code):
//
//   const handleLeadChange = useCallback((e) => {
//     const selectedId = e.target.value;
//     const lead = leads.find((l) => l.id === selectedId);
//     if (lead) {
//       setValue("phone", lead.phone);
//     } else {
//       setValue("phone", "");
//     }
//     // OR — fetch fresh from backend:
//     // leadService.getById(selectedId).then(res => setValue("phone", res.data.phone));
//   }, [leads, setValue]);
//
// ═════════════════════════════════════════════════════════════
// SPRING BOOT JAVA BACKEND — QUICK REFERENCE
// ═════════════════════════════════════════════════════════════
//
// ── ReminderController.java ───────────────────────────────────
//
//   @RestController
//   @RequestMapping("/api/reminders")
//   @CrossOrigin(origins = "http://localhost:3000")
//   public class ReminderController {
//
//       @Autowired private ReminderService service;
//
//       @PostMapping
//       public ResponseEntity<ReminderDTO> create(@RequestBody ReminderDTO dto) {
//           return ResponseEntity.status(HttpStatus.CREATED).body(service.create(dto));
//       }
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
//       @PutMapping("/{id}")
//       public ResponseEntity<ReminderDTO> update(
//           @PathVariable Long id, @RequestBody ReminderDTO dto) {
//           return ResponseEntity.ok(service.update(id, dto));
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
//       public ResponseEntity<ReminderDTO> snooze(
//           @PathVariable Long id, @RequestBody Map<String, String> body) {
//           return ResponseEntity.ok(service.snooze(id, body.get("snoozedUntil")));
//       }
//
//       @PostMapping("/{id}/logs")
//       public ResponseEntity<ReminderDTO> addLog(
//           @PathVariable Long id, @RequestBody Map<String, String> body) {
//           return ResponseEntity.ok(service.addLog(id, body.get("log")));
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
//       @GetMapping(value = "/export/csv", produces = "text/csv")
//       public ResponseEntity<byte[]> exportCsv() {
//           byte[] csv = service.exportCsv();
//           return ResponseEntity.ok()
//               .header("Content-Disposition", "attachment; filename=reminders.csv")
//               .body(csv);
//       }
//   }
//
// ── LeadController.java (dropdown endpoints) ─────────────────
//
//   @RestController
//   @RequestMapping("/api/leads")
//   @CrossOrigin(origins = "http://localhost:3000")
//   public class LeadController {
//
//       @Autowired private LeadService service;
//
//       @GetMapping
//       public ResponseEntity<List<LeadDTO>> getAll() {
//           return ResponseEntity.ok(service.getAll());
//       }
//
//       // Lightweight endpoint — only id, name, phone
//       @GetMapping("/dropdown")
//       public ResponseEntity<List<LeadDropdownDTO>> getForDropdown() {
//           return ResponseEntity.ok(service.getForDropdown());
//       }
//
//       @GetMapping("/{id}")
//       public ResponseEntity<LeadDTO> getById(@PathVariable String id) {
//           return ResponseEntity.ok(service.getById(id));
//       }
//
//       @GetMapping("/search")
//       public ResponseEntity<List<LeadDropdownDTO>> search(
//           @RequestParam String query) {
//           return ResponseEntity.ok(service.search(query));
//       }
//   }
//
// ── UserController.java (dropdown endpoints) ─────────────────
//
//   @RestController
//   @RequestMapping("/api/users")
//   @CrossOrigin(origins = "http://localhost:3000")
//   public class UserController {
//
//       @Autowired private UserService service;
//
//       @GetMapping
//       public ResponseEntity<List<UserDTO>> getAll() {
//           return ResponseEntity.ok(service.getAll());
//       }
//
//       // Only active/enabled users
//       @GetMapping("/active")
//       public ResponseEntity<List<UserDTO>> getActive() {
//           return ResponseEntity.ok(service.getActive());
//       }
//
//       // Only id + name (lightweight)
//       @GetMapping("/dropdown")
//       public ResponseEntity<List<UserDropdownDTO>> getForDropdown() {
//           return ResponseEntity.ok(service.getForDropdown());
//       }
//   }
//
// ── ReminderDTO.java ──────────────────────────────────────────
//
//   public class ReminderDTO {
//       private Long   id;
//       private String title;
//       private String description;
//       private String type;          // First_contact, Follow_up, etc.
//       private String priority;      // High, Medium, Low
//       private String status;        // Active, Snoozed, Completed, Dismissed
//       private String leadId;
//       private String leadName;
//       private String phone;
//       private String assignTo;
//       private String dueDate;       // ISO 8601 string
//       private String snoozedUntil;
//       private String notes;
//       private String createdAt;
//       // getters + setters or use @Data (Lombok)
//   }
//
// ── LeadDropdownDTO.java ──────────────────────────────────────
//
//   public class LeadDropdownDTO {
//       private String id;
//       private String name;
//       private String phone;
//       // getters + setters
//   }
//
// ── UserDropdownDTO.java ──────────────────────────────────────
//
//   public class UserDropdownDTO {
//       private String id;
//       private String name;
//       // getters + setters
//   }
//
// ── ReminderStatsDTO.java ─────────────────────────────────────
//
//   public class ReminderStatsDTO {
//       private long total;
//       private long active;
//       private long overdue;
//       private long completed;
//       private long snoozed;
//       // getters + setters
//   }
//
// ── application.properties ───────────────────────────────────
//
//   spring.datasource.url=jdbc:mysql://localhost:3306/travel_crm
//   spring.datasource.username=root
//   spring.datasource.password=yourpassword
//   spring.jpa.hibernate.ddl-auto=update
//   spring.jpa.show-sql=true
//   server.port=8080
//
// ── .env (React — project root) ──────────────────────────────
//
//   REACT_APP_API_URL=http://localhost:8080
//
// ── MySQL Tables ─────────────────────────────────────────────
//
//   CREATE TABLE reminders (
//     id            BIGINT AUTO_INCREMENT PRIMARY KEY,
//     title         VARCHAR(255) NOT NULL,
//     description   VARCHAR(500),
//     type          ENUM('First_contact','Follow_up','Quotation','Payment',
//                        'Document','Birthday','Confirmation','Custom') NOT NULL,
//     priority      ENUM('High','Medium','Low') DEFAULT 'High',
//     status        ENUM('Active','Snoozed','Completed','Dismissed') DEFAULT 'Active',
//     lead_id       VARCHAR(50),
//     lead_name     VARCHAR(255),
//     phone         VARCHAR(20),
//     assign_to     VARCHAR(50),
//     due_date      DATETIME NOT NULL,
//     snoozed_until DATETIME,
//     notes         TEXT,
//     created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
//   );
//
//   CREATE TABLE leads (
//     id    VARCHAR(50) PRIMARY KEY,   -- e.g. LD1042
//     name  VARCHAR(255) NOT NULL,
//     phone VARCHAR(20),
//     email VARCHAR(255),
//     -- ... your other lead columns
//     created_at DATETIME DEFAULT CURRENT_TIMESTAMP
//   );
//
//   CREATE TABLE users (
//     id      VARCHAR(50) PRIMARY KEY,   -- e.g. U01
//     name    VARCHAR(255) NOT NULL,
//     email   VARCHAR(255),
//     role    VARCHAR(100),
//     status  ENUM('Active','Inactive') DEFAULT 'Active',
//     created_at DATETIME DEFAULT CURRENT_TIMESTAMP
//   );
// ─────────────────────────────────────────────────────────────