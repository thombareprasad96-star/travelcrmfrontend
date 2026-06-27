// src/services/leadLogsService.js
// ─────────────────────────────────────────────────────────────
// Lead Logs Page — API Service
// Page: LeadLogs.jsx
// Backend: Java Spring Boot REST API
// Database: PostgreSQL
// Covers:
//   - Get all logs for a specific lead (paginated)
//   - Get lead info for page header (name, phone, stage, logCount)
//   - Get all logs across all leads (Back to All Logs)
//   - Delete a log entry
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
// LEAD LOGS SERVICE
// Spring Boot Controller: /api/leads
// PostgreSQL Table: lead_logs
// ═════════════════════════════════════════════════════════════
const leadLogsService = {

  // ── GET ALL LOGS FOR A SPECIFIC LEAD ──────────────────────
  // GET /api/leads/{leadId}/logs
  // @GetMapping("/api/leads/{leadId}/logs")
  // public ResponseEntity<LeadLogsResponseDTO> getLogs(
  //     @PathVariable  String leadId,
  //     @RequestParam(defaultValue = "1")  int page,
  //     @RequestParam(defaultValue = "10") int perPage)
  //
  // leadId: publicId of the lead (e.g. "123" or "LD-0123")
  //
  // Response:
  // {
  //   logs: [
  //     {
  //       id:           1,
  //       date:         "Jun 01, 2026 12:31",
  //       stage:        "New Lead",
  //       comment:      "CALL ON FRIDAY, NEED 4 STAR HOTEL",
  //       followUpDate: "Jun 02, 2026",
  //       addedBy:      "Raghvendra Shahi (Admin)"
  //     },
  //     ...
  //   ],
  //   total:      3,
  //   page:       1,
  //   perPage:    10,
  //   totalPages: 1
  // }
  getLogs: (leadId, page = 1, perPage = 10) => {
    return api.get(`/api/leads/${leadId}/logs`, {
      params: { page, perPage },
    });
  },

  // ── GET LEAD INFO (for page header) ───────────────────────
  // GET /api/leads/{leadId}/info
  // @GetMapping("/api/leads/{leadId}/info")
  // public ResponseEntity<LeadInfoDTO> getLeadInfo(
  //     @PathVariable String leadId)
  //
  // Used to display: "Logs for Lead: Pratik" in the card header
  // Also provides logCount for the "Add Log" badge on AddLeadLog page
  //
  // Response:
  // {
  //   publicId: "123",
  //   name:     "Pratik",
  //   phone:    "+91888888888",
  //   stage:    "Ready to Book",
  //   logCount: 1
  // }
  getLeadInfo: (leadId) => {
    return api.get(`/api/leads/${leadId}/info`);
  },

  // ── GET ALL LOGS ACROSS ALL LEADS (Back to All Logs page) ──
  // GET /api/leads/logs
  // @GetMapping("/api/leads/logs")
  // public ResponseEntity<AllLogsResponseDTO> getAllLogs(
  //     @RequestParam(defaultValue = "1")  int    page,
  //     @RequestParam(defaultValue = "25") int    perPage,
  //     @RequestParam(required = false)    String search,
  //     @RequestParam(required = false)    String stage)
  //
  // Used when user clicks "Back to All Logs" button
  // Returns logs from ALL leads, not just one
  //
  // Response:
  // {
  //   logs: [
  //     {
  //       id:           1,
  //       leadId:       "123",
  //       leadName:     "Pratik",
  //       date:         "Jun 01, 2026 12:31",
  //       stage:        "New Lead",
  //       comment:      "CALL ON FRIDAY, NEED 4 STAR HOTEL",
  //       followUpDate: "Jun 02, 2026",
  //       addedBy:      "Raghvendra Shahi (Admin)"
  //     },
  //     ...
  //   ],
  //   total:      10,
  //   page:       1,
  //   perPage:    25,
  //   totalPages: 1
  // }
  getAllLogs: (page = 1, perPage = 25, search = "", stage = "") => {
    const params = { page, perPage };
    if (search) params.search = search;
    if (stage)  params.stage  = stage;
    return api.get("/api/leads/logs", { params });
  },

  // ── DELETE A LOG ENTRY ─────────────────────────────────────
  // DELETE /api/leads/{leadId}/logs/{logId}
  // @DeleteMapping("/api/leads/{leadId}/logs/{logId}")
  // public ResponseEntity<Void> deleteLog(
  //     @PathVariable String leadId,
  //     @PathVariable Long   logId)
  //
  // Backend:
  //   - Verifies log belongs to the given lead (security check)
  //   - Hard-deletes the log row
  //   - Returns 204 No Content
  //
  // Error: 404 if log not found | 403 if log doesn't belong to lead
  deleteLog: (leadId, logId) => {
    return api.delete(`/api/leads/${leadId}/logs/${logId}`);
  },
};

export default leadLogsService;


// ═════════════════════════════════════════════════════════════
// HOW TO USE IN LeadLogs.jsx
// ═════════════════════════════════════════════════════════════
//
// STEP 1 — Import:
//   import leadLogsService from "../services/leadLogsService";
//
// ─────────────────────────────────────────────────────────────
// STEP 2 — Replace mock useEffect with real API:
//
//   useEffect(() => {
//     setLoading(true);
//     Promise.all([
//       leadLogsService.getLogs(id, page, perPage),
//       leadLogsService.getLeadInfo(id),
//     ])
//       .then(([logsRes, infoRes]) => {
//         setLogs(logsRes.data.logs);
//         setTotalCount(logsRes.data.total);
//         setTotalPages(logsRes.data.totalPages);
//         // Replace searchParams.get("name") with:
//         // infoRes.data.name  → used in "Logs for Lead: {name}"
//         // infoRes.data.logCount → passed to AddLeadLog URL
//       })
//       .catch(() => showToast("Failed to load logs.", "error"))
//       .finally(() => setLoading(false));
//   }, [id, page]);
//
// ─────────────────────────────────────────────────────────────
// STEP 3 — Connect "Add Log" button to pass real logCount:
//
//   // In the "Add Log" button onClick:
//   navigate(
//     `/AddLeadLog/${id}` +
//     `?name=${encodeURIComponent(infoRes.data.name)}` +
//     `&stage=${encodeURIComponent(infoRes.data.stage)}` +
//     `&phone=${encodeURIComponent(infoRes.data.phone)}` +
//     `&logs=${infoRes.data.logCount}`
//   );
//
// ─────────────────────────────────────────────────────────────
// STEP 4 — Optional: connect deleteLog if you add a delete button:
//
//   const handleDelete = async (logId) => {
//     try {
//       await leadLogsService.deleteLog(id, logId);
//       setLogs(prev => prev.filter(l => l.id !== logId));
//       showToast("Log entry deleted.");
//     } catch (err) {
//       showToast(
//         err?.response?.data?.message || "Failed to delete log.",
//         "error"
//       );
//     }
//   };
//
// ═════════════════════════════════════════════════════════════
// SPRING BOOT JAVA BACKEND — FULL REFERENCE
// ═════════════════════════════════════════════════════════════
//
// ── LeadLogsController.java (list-related endpoints only) ─────
//
//   @RestController
//   @CrossOrigin(origins = "http://localhost:3000")
//   public class LeadLogsController {
//
//       @Autowired private LeadLogsService service;
//
//       // Get logs for a specific lead (paginated)
//       @GetMapping("/api/leads/{leadId}/logs")
//       public ResponseEntity<LeadLogsResponseDTO> getLogs(
//           @PathVariable  String leadId,
//           @RequestParam(defaultValue = "1")  int page,
//           @RequestParam(defaultValue = "10") int perPage) {
//           return ResponseEntity.ok(service.getLogs(leadId, page, perPage));
//       }
//
//       // Get lead info for header
//       @GetMapping("/api/leads/{leadId}/info")
//       public ResponseEntity<LeadInfoDTO> getLeadInfo(
//           @PathVariable String leadId) {
//           return ResponseEntity.ok(service.getLeadInfo(leadId));
//       }
//
//       // Get all logs (all leads)
//       @GetMapping("/api/leads/logs")
//       public ResponseEntity<AllLogsResponseDTO> getAllLogs(
//           @RequestParam(defaultValue = "1")  int    page,
//           @RequestParam(defaultValue = "25") int    perPage,
//           @RequestParam(required = false)    String search,
//           @RequestParam(required = false)    String stage) {
//           return ResponseEntity.ok(
//               service.getAllLogs(page, perPage, search, stage));
//       }
//
//       // Delete a log
//       @DeleteMapping("/api/leads/{leadId}/logs/{logId}")
//       public ResponseEntity<Void> deleteLog(
//           @PathVariable String leadId,
//           @PathVariable Long   logId) {
//           service.deleteLog(leadId, logId);
//           return ResponseEntity.noContent().build();
//       }
//   }
//
// ── LeadLogsService.java (list-related methods only) ──────────
//
//   @Service @Transactional
//   public class LeadLogsService {
//
//       @Autowired private LeadLogRepository  logRepo;
//       @Autowired private LeadRepository     leadRepo;
//
//       public LeadLogsResponseDTO getLogs(String leadId, int page, int perPage) {
//           Lead lead = leadRepo.findByPublicId(leadId)
//               .orElseThrow(() -> new ResponseStatusException(
//                   HttpStatus.NOT_FOUND, "Lead not found"));
//
//           Pageable pageable = PageRequest.of(page - 1, perPage,
//               Sort.by(Sort.Direction.DESC, "createdAt"));
//           Page<LeadLog> result = logRepo.findByLead(lead, pageable);
//
//           List<LeadLogDTO> logs = result.getContent()
//               .stream().map(this::toDTO)
//               .collect(Collectors.toList());
//
//           return new LeadLogsResponseDTO(
//               logs, result.getTotalElements(),
//               page, perPage, result.getTotalPages());
//       }
//
//       public LeadInfoDTO getLeadInfo(String leadId) {
//           Lead lead = leadRepo.findByPublicId(leadId)
//               .orElseThrow(() -> new ResponseStatusException(
//                   HttpStatus.NOT_FOUND, "Lead not found"));
//           long logCount = logRepo.countByLead(lead);
//           return new LeadInfoDTO(
//               lead.getPublicId(), lead.getName(),
//               lead.getPhone(), lead.getStage(), logCount);
//       }
//
//       public AllLogsResponseDTO getAllLogs(
//               int page, int perPage, String search, String stage) {
//           Pageable pageable = PageRequest.of(page - 1, perPage,
//               Sort.by(Sort.Direction.DESC, "createdAt"));
//           Page<LeadLog> result = logRepo.findAllWithFilters(
//               search, stage, pageable);
//           List<AllLogDTO> logs = result.getContent()
//               .stream().map(this::toAllDTO)
//               .collect(Collectors.toList());
//           return new AllLogsResponseDTO(
//               logs, result.getTotalElements(),
//               page, perPage, result.getTotalPages());
//       }
//
//       public void deleteLog(String leadId, Long logId) {
//           LeadLog log = logRepo.findById(logId)
//               .orElseThrow(() -> new ResponseStatusException(
//                   HttpStatus.NOT_FOUND, "Log not found"));
//           if (!log.getLead().getPublicId().equals(leadId))
//               throw new ResponseStatusException(
//                   HttpStatus.FORBIDDEN, "Log does not belong to this lead");
//           logRepo.deleteById(logId);
//       }
//
//       private LeadLogDTO toDTO(LeadLog l) {
//           DateTimeFormatter dateFmt  = DateTimeFormatter.ofPattern("MMM dd, yyyy HH:mm");
//           DateTimeFormatter dateOnly = DateTimeFormatter.ofPattern("MMM dd, yyyy");
//           return new LeadLogDTO(
//               l.getId(),
//               l.getCreatedAt().format(dateFmt),
//               l.getStage(),
//               l.getComment(),
//               l.getFollowUpDate() != null
//                   ? l.getFollowUpDate().format(dateOnly) : "—",
//               l.getAddedBy().getFullName() + " ("
//                   + capitalise(l.getAddedBy().getRole()) + ")"
//           );
//       }
//
//       private AllLogDTO toAllDTO(LeadLog l) {
//           return new AllLogDTO(
//               toDTO(l),
//               l.getLead().getPublicId(),
//               l.getLead().getName());
//       }
//
//       private String capitalise(String s) {
//           return s == null || s.isEmpty() ? ""
//               : Character.toUpperCase(s.charAt(0)) + s.substring(1).toLowerCase();
//       }
//   }
//
// ── LeadLogRepository.java ────────────────────────────────────
//
//   @Repository
//   public interface LeadLogRepository extends JpaRepository<LeadLog, Long> {
//       Page<LeadLog> findByLead(Lead lead, Pageable pageable);
//       long countByLead(Lead lead);
//
//       @Query("SELECT l FROM LeadLog l JOIN l.lead ld WHERE " +
//              "(:search IS NULL OR LOWER(l.comment) LIKE LOWER(CONCAT('%',:search,'%')) " +
//              " OR LOWER(ld.name) LIKE LOWER(CONCAT('%',:search,'%'))) " +
//              "AND (:stage IS NULL OR l.stage = :stage)")
//       Page<LeadLog> findAllWithFilters(
//           @Param("search") String search,
//           @Param("stage")  String stage,
//           Pageable pageable);
//   }
//
// ── LeadLog.java (Entity) ─────────────────────────────────────
//
//   @Entity @Table(name = "lead_logs")
//   public class LeadLog {
//       @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
//       private Long id;
//
//       @ManyToOne(fetch = FetchType.LAZY)
//       @JoinColumn(name = "lead_id", nullable = false)
//       private Lead lead;
//
//       @ManyToOne(fetch = FetchType.LAZY)
//       @JoinColumn(name = "added_by_user_id")
//       private User addedBy;
//
//       @Column(name = "stage",         length = 50)       private String stage;
//       @Column(name = "comment",       columnDefinition = "TEXT", nullable = false) private String comment;
//       @Column(name = "follow_up_date")                   private LocalDate followUpDate;
//       @Column(name = "created_at",    nullable = false)  private LocalDateTime createdAt;
//
//       @PrePersist
//       protected void onCreate() { createdAt = LocalDateTime.now(); }
//       // getters + setters or @Data (Lombok)
//   }
//
// ── DTOs ──────────────────────────────────────────────────────
//
//   // LeadLogDTO.java
//   public class LeadLogDTO {
//       private Long id; private String date, stage, comment, followUpDate, addedBy;
//       // constructor + getters or @Data (Lombok)
//   }
//
//   // LeadLogsResponseDTO.java
//   public class LeadLogsResponseDTO {
//       private List<LeadLogDTO> logs;
//       private long total; private int page, perPage, totalPages;
//       // constructor + getters
//   }
//
//   // LeadInfoDTO.java
//   public class LeadInfoDTO {
//       private String publicId, name, phone, stage; private long logCount;
//       // constructor + getters
//   }
//
//   // AllLogDTO.java  (extends LeadLogDTO with leadId + leadName)
//   public class AllLogDTO extends LeadLogDTO {
//       private String leadId, leadName;
//       // constructor + getters
//   }
//
//   // AllLogsResponseDTO.java
//   public class AllLogsResponseDTO {
//       private List<AllLogDTO> logs;
//       private long total; private int page, perPage, totalPages;
//       // constructor + getters
//   }
//
// ─────────────────────────────────────────────────────────────
// ── PostgreSQL Schema ─────────────────────────────────────────
//
//   CREATE TABLE lead_logs (
//     id                BIGSERIAL    PRIMARY KEY,
//     lead_id           BIGINT       NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
//     added_by_user_id  BIGINT       REFERENCES users(id) ON DELETE SET NULL,
//     stage             VARCHAR(50),
//     comment           TEXT         NOT NULL,
//     follow_up_date    DATE,
//     created_at        TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
//   );
//
//   CREATE INDEX idx_ll_lead_id    ON lead_logs (lead_id);
//   CREATE INDEX idx_ll_created_at ON lead_logs (lead_id, created_at DESC);
//   CREATE INDEX idx_ll_stage      ON lead_logs (stage);
//   CREATE INDEX idx_ll_added_by   ON lead_logs (added_by_user_id);
//   CREATE INDEX idx_ll_follow_up  ON lead_logs (follow_up_date)
//     WHERE follow_up_date IS NOT NULL;
//
// ── .env (React) ──────────────────────────────────────────────
//   REACT_APP_API_URL=http://localhost:8080
// ─────────────────────────────────────────────────────────────