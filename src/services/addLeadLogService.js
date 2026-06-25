// src/services/addLeadLogService.js
// ─────────────────────────────────────────────────────────────
// Add Log to Lead Page — API Service
// Page: AddLeadLog.jsx
// Backend: Java Spring Boot REST API
// Database: PostgreSQL
// Covers:
//   - Get lead info (name, phone, stage, logCount) for page header
//   - Add a new log entry with optional reminder creation
// ─────────────────────────────────────────────────────────────

import axios from "axios";

// ── BASE URL ──────────────────────────────────────────────────
// Add to your .env file:
// REACT_APP_API_URL=http://localhost:8080
const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080";

// ── AXIOS INSTANCE ────────────────────────────────────────────
const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
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
// ADD LEAD LOG SERVICE
// Spring Boot Controller: /api/leads
// PostgreSQL Tables: lead_logs, reminders
// ═════════════════════════════════════════════════════════════
const addLeadLogService = {

  // ── GET LEAD INFO (for page header) ───────────────────────
  // GET /api/leads/{leadId}/info
  // @GetMapping("/api/leads/{leadId}/info")
  // public ResponseEntity<LeadInfoDTO> getLeadInfo(
  //     @PathVariable String leadId)
  //
  // Used on page mount to replace/supplement URL params
  // Displays in: "Add Log for Lead: Pratik | 📞 +91..."
  // Stage shown in the read-only Current Stage field
  //
  // Response:
  // {
  //   publicId: "123",
  //   name:     "Pratik",
  //   phone:    "+91888888888",
  //   stage:    "Ready to Book",
  //   logCount: 1                // shown in "View Lead Logs 1" badge
  // }
  getLeadInfo: (leadId) => {
    return api.get(`/api/leads/${leadId}/info`);
  },

  // ── ADD NEW LOG ENTRY ──────────────────────────────────────
  // POST /api/leads/{leadId}/logs
  // @PostMapping("/api/leads/{leadId}/logs")
  // public ResponseEntity<LeadLogDTO> addLog(
  //     @PathVariable  String         leadId,
  //     @RequestBody   @Valid AddLogRequest request,
  //     @AuthenticationPrincipal UserDetails currentUser)
  //
  // Request body:
  // {
  //   stage:          "Ready to Book",         // read-only field value (informational)
  //   comment:        "Client confirmed trip",  // required, min 5 chars
  //   createReminder: true,                     // checkbox value
  //   followUpDate:   "2026-07-01"              // ISO date — required when createReminder=true
  // }
  //
  // Backend logic step by step:
  //   1. Validates lead exists (404 if not found)
  //   2. Validates comment is not blank (400)
  //   3. Validates followUpDate is present when createReminder=true (400)
  //   4. Saves row to lead_logs table with:
  //        - lead_id         = lead.id
  //        - added_by_user_id= currently logged-in user's id
  //        - stage           = lead.stage (current stage snapshot)
  //        - comment         = request.comment
  //        - follow_up_date  = request.followUpDate (nullable)
  //        - created_at      = NOW()
  //   5. If createReminder=true: creates row in reminders table:
  //        - lead_id              = lead.id
  //        - assigned_user_id     = current user's id
  //        - reminder_type        = "Follow Up"
  //        - priority             = "Medium"
  //        - title                = "Follow-up: {lead.name}"
  //        - description          = request.comment
  //        - due_date             = request.followUpDate at 09:00 AM
  //        - completed            = false
  //   6. Touches lead.updated_at = NOW()
  //   7. Returns 201 Created with the saved LeadLogDTO
  //
  // Error responses:
  //   400 — { message: "Log comment is required" }
  //   400 — { message: "Comment must be at least 5 characters" }
  //   400 — { message: "Follow-up date is required when creating a reminder" }
  //   400 — { message: "Follow-up date must be today or in the future" }
  //   404 — { message: "Lead not found" }
  //
  // Response (201 Created):
  // {
  //   id:           4,
  //   date:         "Jun 24, 2026 10:05",
  //   stage:        "Ready to Book",
  //   comment:      "Client confirmed trip",
  //   followUpDate: "Jul 01, 2026",
  //   addedBy:      "Raghvendra Shahi (Admin)"
  // }
  addLog: (leadId, data) => {
    return api.post(`/api/leads/${leadId}/logs`, {
      stage:          data.stage          || null,
      comment:        data.comment.trim(),
      createReminder: data.createReminder || false,
      followUpDate:   data.createReminder && data.followUpDate
        ? data.followUpDate
        : null,
    });
  },
};

export default addLeadLogService;


// ═════════════════════════════════════════════════════════════
// HOW TO USE IN AddLeadLog.jsx
// ═════════════════════════════════════════════════════════════
//
// STEP 1 — Import:
//   import addLeadLogService from "../services/addLeadLogService";
//
// ─────────────────────────────────────────────────────────────
// STEP 2 — Load lead info on mount (replaces URL params):
//
//   const [leadInfo, setLeadInfo] = useState(null);
//
//   useEffect(() => {
//     addLeadLogService
//       .getLeadInfo(id)
//       .then((res) => setLeadInfo(res.data))
//       .catch(() => {}); // fallback to URL params silently
//   }, [id]);
//
//   // Then use leadInfo instead of URL params:
//   const leadName  = leadInfo?.name  || searchParams.get("name")  || "Lead";
//   const leadPhone = leadInfo?.phone || searchParams.get("phone") || "";
//   const leadStage = leadInfo?.stage || searchParams.get("stage") || "New Lead";
//   const logCount  = leadInfo?.logCount ?? Number(searchParams.get("logs") || 0);
//
// ─────────────────────────────────────────────────────────────
// STEP 3 — Replace mock handleSubmit with real API:
//
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const errs2 = validate();
//     if (Object.keys(errs2).length) {
//       setErrs(errs2);
//       showToast("Please fix the errors below.", "error");
//       return;
//     }
//     setSaving(true);
//     try {
//       await addLeadLogService.addLog(id, {
//         stage:          leadStage,
//         comment,
//         createReminder: createRem,
//         followUpDate:   followDate,
//       });
//       showToast("Log saved successfully! ✅");
//       setTimeout(() => {
//         navigate(
//           `/LeadLogs/${id}?name=${encodeURIComponent(leadName)}`
//         );
//       }, 1500);
//     } catch (err) {
//       showToast(
//         err?.response?.data?.message || "Failed to save log.",
//         "error"
//       );
//     } finally {
//       setSaving(false);
//     }
//   };
//
// ═════════════════════════════════════════════════════════════
// SPRING BOOT JAVA BACKEND — FULL REFERENCE
// ═════════════════════════════════════════════════════════════
//
// ── LeadLogsController.java (add endpoint only) ───────────────
//
//   @PostMapping("/api/leads/{leadId}/logs")
//   public ResponseEntity<LeadLogDTO> addLog(
//       @PathVariable  String        leadId,
//       @RequestBody   @Valid        AddLogRequest request,
//       @AuthenticationPrincipal    UserDetails   currentUser) {
//       return ResponseEntity.status(HttpStatus.CREATED)
//           .body(service.addLog(leadId, request, currentUser.getUsername()));
//   }
//
// ── LeadLogsService.java (addLog method) ──────────────────────
//
//   public LeadLogDTO addLog(
//           String leadId, AddLogRequest req, String username) {
//
//       Lead lead = leadRepo.findByPublicId(leadId)
//           .orElseThrow(() -> new ResponseStatusException(
//               HttpStatus.NOT_FOUND, "Lead not found"));
//
//       User user = userRepo.findByUsername(username)
//           .orElseThrow(() -> new ResponseStatusException(
//               HttpStatus.NOT_FOUND, "User not found"));
//
//       // Validate comment
//       if (req.getComment() == null || req.getComment().trim().isEmpty())
//           throw new ResponseStatusException(
//               HttpStatus.BAD_REQUEST, "Log comment is required");
//       if (req.getComment().trim().length() < 5)
//           throw new ResponseStatusException(
//               HttpStatus.BAD_REQUEST, "Comment must be at least 5 characters");
//
//       // Validate follow-up date when reminder is requested
//       if (req.isCreateReminder()) {
//           if (req.getFollowUpDate() == null || req.getFollowUpDate().isBlank())
//               throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
//                   "Follow-up date is required when creating a reminder");
//           LocalDate followUp = LocalDate.parse(req.getFollowUpDate());
//           if (followUp.isBefore(LocalDate.now()))
//               throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
//                   "Follow-up date must be today or in the future");
//       }
//
//       // ── Save the log entry ────────────────────────────────
//       LeadLog log = new LeadLog();
//       log.setLead(lead);
//       log.setAddedBy(user);
//       log.setStage(lead.getStage());          // snapshot of current stage
//       log.setComment(req.getComment().trim());
//       if (req.getFollowUpDate() != null && !req.getFollowUpDate().isBlank())
//           log.setFollowUpDate(LocalDate.parse(req.getFollowUpDate()));
//       LeadLog saved = logRepo.save(log);
//
//       // ── Auto-create reminder if checkbox was ticked ───────
//       if (req.isCreateReminder()) {
//           Reminder reminder = new Reminder();
//           reminder.setLead(lead);
//           reminder.setAssignedUser(user);
//           reminder.setReminderType("Follow Up");
//           reminder.setPriority("Medium");
//           reminder.setTitle("Follow-up: " + lead.getName());
//           reminder.setDescription(req.getComment().trim());
//           // Set due time to 09:00 AM on the follow-up date
//           reminder.setDueDate(
//               LocalDate.parse(req.getFollowUpDate()).atTime(9, 0));
//           reminder.setCompleted(false);
//           reminderRepo.save(reminder);
//       }
//
//       // ── Touch lead.updated_at ─────────────────────────────
//       lead.setUpdatedAt(LocalDateTime.now());
//       leadRepo.save(lead);
//
//       return toDTO(saved);
//   }
//
// ── AddLogRequest.java ────────────────────────────────────────
//
//   public class AddLogRequest {
//       @NotBlank(message = "Log comment is required")
//       @Size(min = 5, message = "Comment must be at least 5 characters")
//       private String  comment;
//
//       private String  stage;            // informational — read-only field value
//       private boolean createReminder;   // false by default
//       private String  followUpDate;     // "2026-07-01" — required if createReminder=true
//       // getters + setters
//   }
//
// ─────────────────────────────────────────────────────────────
// ── PostgreSQL — reminder auto-creation ───────────────────────
//
//   -- When createReminder=true, a new row is inserted into reminders:
//   INSERT INTO reminders
//     (lead_id, assigned_user_id, reminder_type, priority,
//      title, description, due_date, completed)
//   VALUES
//     (:leadId, :userId, 'Follow Up', 'Medium',
//      'Follow-up: Pratik', :comment,
//      :followUpDate::date + TIME '09:00:00', false);
//
// ── application.properties ───────────────────────────────────
//   spring.datasource.url=jdbc:postgresql://localhost:5432/travel_crm
//   spring.datasource.username=postgres
//   spring.datasource.password=yourpassword
//   spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
//   spring.jpa.hibernate.ddl-auto=update
//   server.port=8080
//
// ── .env (React) ──────────────────────────────────────────────
//   REACT_APP_API_URL=http://localhost:8080
// ─────────────────────────────────────────────────────────────