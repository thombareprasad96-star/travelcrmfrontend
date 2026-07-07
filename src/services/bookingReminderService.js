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


// ═════════════════════════════════════════════════════════════
// HOW TO USE IN BookingReminders.jsx
// ═════════════════════════════════════════════════════════════
//
// 1. IMPORT AT TOP OF BookingReminders.jsx:
//    import bookingReminderService from "../services/bookingReminderService";
//
// ─────────────────────────────────────────────────────────────
// 2. REPLACE mock useEffect WITH REAL API CALL:
//
//    useEffect(() => {
//      setLoading(true);
//      bookingReminderService
//        .getAll()
//        .then((res) => setReminders(res.data))
//        .catch(() => showToast("Failed to load booking reminders.", "error"))
//        .finally(() => setLoading(false));
//    }, []);
//
// ─────────────────────────────────────────────────────────────
// 3. REPLACE handleMarkSent:
//
//    const handleMarkSent = async (id) => {
//      try {
//        const res = await bookingReminderService.markSent(id);
//        setReminders((p) => p.map((r) => r.id === id ? res.data : r));
//        showToast("Reminder marked as sent. 📤");
//      } catch {
//        showToast("Failed to update reminder.", "error");
//      }
//    };
//
// ─────────────────────────────────────────────────────────────
// 4. REPLACE handleMarkComplete:
//
//    const handleMarkComplete = async (id) => {
//      try {
//        const res = await bookingReminderService.markComplete(id);
//        setReminders((p) => p.map((r) => r.id === id ? res.data : r));
//        showToast("Reminder marked as completed. ✅");
//      } catch {
//        showToast("Failed to update reminder.", "error");
//      }
//    };
//
// ─────────────────────────────────────────────────────────────
// 5. REPLACE handleDelete:
//
//    const handleDelete = async () => {
//      try {
//        await bookingReminderService.delete(delItem.id);
//        setReminders((p) => p.filter((r) => r.id !== delItem.id));
//        showToast(`Reminder for ${delItem.bookingCode} deleted.`);
//      } catch {
//        showToast("Failed to delete reminder.", "error");
//      } finally {
//        setDelItem(null);
//      }
//    };
//
// ─────────────────────────────────────────────────────────────
// 6. OPTIONAL — filter by status on the server instead of client:
//
//    useEffect(() => {
//      setLoading(true);
//      const params = fStatus !== "All Status" ? { status: fStatus } : {};
//      bookingReminderService
//        .getAll(params)
//        .then((res) => setReminders(res.data))
//        .catch(() => showToast("Failed to load booking reminders.", "error"))
//        .finally(() => setLoading(false));
//    }, [fStatus]);
//
// ─────────────────────────────────────────────────────────────
// 7. OPTIONAL — refresh button using real refetch:
//
//    const handleRefresh = () => {
//      setLoading(true);
//      bookingReminderService.getAll()
//        .then((res) => setReminders(res.data))
//        .finally(() => setLoading(false));
//    };
//
// ═════════════════════════════════════════════════════════════
// SPRING BOOT JAVA BACKEND — QUICK REFERENCE
// ═════════════════════════════════════════════════════════════
//
// ── BookingReminder.java (Entity) ────────────────────────────
//
//   @Entity
//   @Table(name = "booking_reminders")
//   public class BookingReminder {
//       @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
//       private Long id;
//
//       @Column(name = "booking_code")
//       private String bookingCode;
//
//       @Column(name = "customer_name")
//       private String customerName;
//
//       private String phone;
//       private String destination;
//
//       @Enumerated(EnumType.STRING)
//       @Column(name = "reminder_type")
//       private ReminderType reminderType;   // Payment_due, Final_payment, Document, Visa, Travel_date, Itinerary
//
//       @Column(length = 1000)
//       private String message;
//
//       @Column(name = "travel_date")
//       private LocalDateTime travelDate;
//
//       @Column(name = "reminder_date")
//       private LocalDateTime reminderDate;
//
//       @Enumerated(EnumType.STRING)
//       private BookingReminderStatus status;  // Pending, Sent, Completed
//
//       private Double amount;
//
//       @Column(name = "created_at")
//       private LocalDateTime createdAt;
//
//       @PrePersist
//       protected void onCreate() {
//           createdAt = LocalDateTime.now();
//           if (status == null) status = BookingReminderStatus.Pending;
//       }
//   }
//
// ─────────────────────────────────────────────────────────────
// ── BookingReminderController.java ───────────────────────────
//
//   @RestController
//   @RequestMapping("/api/booking-reminders")
//   @CrossOrigin(origins = "http://localhost:3000")
//   public class BookingReminderController {
//
//       @Autowired private BookingReminderService service;
//
//       @GetMapping
//       public ResponseEntity<List<BookingReminderDTO>> getAll(
//           @RequestParam(required = false) String status) {
//           return ResponseEntity.ok(service.getAll(status));
//       }
//
//       @GetMapping("/{id}")
//       public ResponseEntity<BookingReminderDTO> getById(@PathVariable Long id) {
//           return ResponseEntity.ok(service.getById(id));
//       }
//
//       @PostMapping
//       public ResponseEntity<BookingReminderDTO> create(@RequestBody BookingReminderDTO dto) {
//           return ResponseEntity.status(HttpStatus.CREATED).body(service.create(dto));
//       }
//
//       @PutMapping("/{id}")
//       public ResponseEntity<BookingReminderDTO> update(
//           @PathVariable Long id, @RequestBody BookingReminderDTO dto) {
//           return ResponseEntity.ok(service.update(id, dto));
//       }
//
//       @DeleteMapping("/{id}")
//       public ResponseEntity<Void> delete(@PathVariable Long id) {
//           service.delete(id);
//           return ResponseEntity.noContent().build();
//       }
//
//       @PatchMapping("/{id}/sent")
//       public ResponseEntity<BookingReminderDTO> markSent(@PathVariable Long id) {
//           return ResponseEntity.ok(service.updateStatus(id, "Sent"));
//       }
//
//       @PatchMapping("/{id}/complete")
//       public ResponseEntity<BookingReminderDTO> markComplete(@PathVariable Long id) {
//           return ResponseEntity.ok(service.updateStatus(id, "Completed"));
//       }
//
//       @PatchMapping("/{id}/pending")
//       public ResponseEntity<BookingReminderDTO> markPending(@PathVariable Long id) {
//           return ResponseEntity.ok(service.updateStatus(id, "Pending"));
//       }
//
//       @GetMapping("/booking/{bookingCode}")
//       public ResponseEntity<List<BookingReminderDTO>> getByBookingCode(
//           @PathVariable String bookingCode) {
//           return ResponseEntity.ok(service.getByBookingCode(bookingCode));
//       }
//
//       @GetMapping("/stats")
//       public ResponseEntity<BookingReminderStatsDTO> getStats() {
//           return ResponseEntity.ok(service.getStats());
//       }
//
//       @GetMapping("/upcoming")
//       public ResponseEntity<List<BookingReminderDTO>> getUpcoming(
//           @RequestParam(defaultValue = "7") int days) {
//           return ResponseEntity.ok(service.getUpcoming(days));
//       }
//
//       @PostMapping("/{id}/send-now")
//       public ResponseEntity<BookingReminderDTO> sendNow(@PathVariable Long id) {
//           // service triggers WhatsApp/SMS/Email dispatch, then sets status=Sent
//           return ResponseEntity.ok(service.sendNow(id));
//       }
//   }
//
// ─────────────────────────────────────────────────────────────
// ── BookingReminderDTO.java ──────────────────────────────────
//
//   public class BookingReminderDTO {
//       private Long   id;
//       private String bookingCode;
//       private String customerName;
//       private String phone;
//       private String destination;
//       private String reminderType;   // Payment_due, Final_payment, Document, Visa, Travel_date, Itinerary
//       private String message;
//       private String travelDate;     // ISO 8601 string
//       private String reminderDate;   // ISO 8601 string
//       private String status;         // Pending, Sent, Completed
//       private Double amount;
//       private String createdAt;
//       // getters + setters or @Data (Lombok)
//   }
//
// ── BookingReminderStatsDTO.java ─────────────────────────────
//
//   public class BookingReminderStatsDTO {
//       private long total;
//       private long pending;
//       private long sent;
//       private long completed;
//       // getters + setters
//   }
//
// ─────────────────────────────────────────────────────────────
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
// ─────────────────────────────────────────────────────────────
// ── MySQL Table ───────────────────────────────────────────────
//
//   CREATE TABLE booking_reminders (
//     id            BIGINT AUTO_INCREMENT PRIMARY KEY,
//     booking_code  VARCHAR(50)  NOT NULL,
//     customer_name VARCHAR(255) NOT NULL,
//     phone         VARCHAR(20),
//     destination   VARCHAR(255),
//     reminder_type ENUM('Payment_due','Final_payment','Document',
//                        'Visa','Travel_date','Itinerary') NOT NULL,
//     message       VARCHAR(1000),
//     travel_date   DATETIME,
//     reminder_date DATETIME NOT NULL,
//     status        ENUM('Pending','Sent','Completed') DEFAULT 'Pending',
//     amount        DECIMAL(12,2) DEFAULT 0,
//     created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
//
//     INDEX idx_booking_code (booking_code),
//     INDEX idx_status (status),
//     INDEX idx_reminder_date (reminder_date)
//   );
// ─────────────────────────────────────────────────────────────