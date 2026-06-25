// src/services/allLeadLogsService.js
// ─────────────────────────────────────────────────────────────
// All Lead Logs Page — API Service
// Page: AllLeadLogs.jsx
// Route: /Leads/Logs
// Backend: Java Spring Boot REST API
// Database: PostgreSQL
// Covers:
//   - Get all leads with their latest log + log count (card grid)
//   - Get summary stats (4 hero stat cards)
//   - Filters: search (lead name / comment) + stage + user + pagination
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

// ── FILTER PARAMS BUILDER ─────────────────────────────────────
const buildParams = (filters = {}) => {
  const params = {};
  if (filters.search && filters.search !== "")           params.search  = filters.search;
  if (filters.stage  && filters.stage  !== "All Stages") params.stage   = filters.stage;
  if (filters.userId && filters.userId !== "All Users")  params.userId  = filters.userId;
  if (filters.page)    params.page    = filters.page;
  if (filters.perPage) params.perPage = filters.perPage;
  return params;
};


// ═════════════════════════════════════════════════════════════
// ALL LEAD LOGS SERVICE
// Spring Boot Controller: /api/leads/logs/summary
// PostgreSQL Tables: leads, lead_logs, users
// ═════════════════════════════════════════════════════════════
const allLeadLogsService = {

  // ── GET LEADS WITH LATEST LOG (card grid data) ─────────────
  // GET /api/leads/logs/summary
  // @GetMapping("/api/leads/logs/summary")
  // public ResponseEntity<LeadLogSummaryResponseDTO> getLeadLogSummary(
  //     @RequestParam(required = false)    String search,
  //     @RequestParam(required = false)    String stage,
  //     @RequestParam(required = false)    Long   userId,
  //     @RequestParam(defaultValue = "12") int    perPage,
  //     @RequestParam(defaultValue = "1")  int    page)
  //
  // Returns one row per lead — each row includes:
  //   - Lead basic info (id, name, phone, stage)
  //   - logCount: total number of logs for that lead
  //   - latestLog: the most recent log entry (date, comment, addedBy, followUpDate)
  //
  // Filters:
  //   search  → matches lead name OR any log comment (ILIKE)
  //   stage   → filters by lead.stage
  //   userId  → filters by the user who added the latest/any log
  //
  // Response:
  // {
  //   leads: [
  //     {
  //       leadId:   "123",
  //       leadName: "Pratik",
  //       phone:    "+91888888888",
  //       stage:    "New Lead",
  //       logCount: 1,
  //       latestLog: {
  //         date:         "Jun 01, 2026 12:31",
  //         comment:      "CALL ON FRIDAY, NEED 4 STAR HOTEL",
  //         addedBy:      "Raghvendra Shahi (Admin)",
  //         followUpDate: "Jun 02, 2026"
  //       }
  //     },
  //     ...
  //   ],
  //   total:      4,
  //   page:       1,
  //   perPage:    12,
  //   totalPages: 1
  // }
  getLeadLogSummary: (filters = {}) => {
    return api.get("/api/leads/logs/summary", {
      params: buildParams(filters),
    });
  },

  // ── GET STAT CARD DATA (4 hero cards) ─────────────────────
  // GET /api/leads/logs/stats
  // @GetMapping("/api/leads/logs/stats")
  // public ResponseEntity<LeadLogStatsDTO> getStats()
  //
  // No filters — always returns global totals for the stat cards
  //
  // Response:
  // {
  //   totalLogs:   21,     // SUM of all log entries across all leads
  //   totalLeads:  4,      // COUNT of leads that have at least one log
  //   today:       "Jun 24, 2026",   // server-side formatted today's date
  //   totalPages:  2       // pre-calculated based on perPage=12
  // }
  getStats: () => {
    return api.get("/api/leads/logs/stats");
  },

  // ── GET USERS FOR DROPDOWN ─────────────────────────────────
  // GET /api/users/dropdown
  // @GetMapping("/api/users/dropdown")
  // public ResponseEntity<List<UserDropdownDTO>> getUsersForDropdown()
  //
  // Used to populate the "All Users" filter dropdown
  // Returns all active users in the tenant
  //
  // Response:
  // [
  //   { id: 1,  fullName: "Raghvendra Shahi"          },
  //   { id: 21, fullName: "Vaishnavi Shrikant Jagtap" },
  //   { id: 22, fullName: "Deepti Paul"               },
  //   { id: 34, fullName: "Shreyash Raghvendra Shahi" }
  // ]
  getUsersForDropdown: () => {
    return api.get("/api/users/dropdown");
  },
};

export default allLeadLogsService;


// ═════════════════════════════════════════════════════════════
// HOW TO USE IN AllLeadLogs.jsx
// ═════════════════════════════════════════════════════════════
//
// STEP 1 — Import:
//   import allLeadLogsService from "../services/allLeadLogsService";
//
// ─────────────────────────────────────────────────────────────
// STEP 2 — Load users dropdown on mount:
//
//   const [usersList, setUsersList] = useState(["All Users"]);
//
//   useEffect(() => {
//     allLeadLogsService.getUsersForDropdown()
//       .then(res => {
//         setUsersList(["All Users", ...res.data.map(u => u.fullName)]);
//       })
//       .catch(() => {});
//   }, []);
//
// ─────────────────────────────────────────────────────────────
// STEP 3 — Replace mock useEffect with real API (load on
//          mount AND whenever filters or page change):
//
//   const [stats, setStats] = useState(null);
//
//   useEffect(() => {
//     setLoading(true);
//     Promise.all([
//       allLeadLogsService.getLeadLogSummary({
//         search,
//         stage,
//         userId: user,   // pass userId from dropdown selection
//         page,
//         perPage: PER_PAGE,
//       }),
//       allLeadLogsService.getStats(),
//     ])
//       .then(([summaryRes, statsRes]) => {
//         setData(summaryRes.data.leads);
//         setTotalCount(summaryRes.data.total);
//         setTotalPages(summaryRes.data.totalPages);
//         setStats(statsRes.data);
//         // Bind to hero cards:
//         // statsRes.data.totalLogs   → "Total Logs" card
//         // statsRes.data.totalLeads  → "Total Leads" card
//         // statsRes.data.today       → "Today" card
//         // statsRes.data.totalPages  → "Total Pages" card
//       })
//       .catch(() => showToast("Failed to load data.", "error"))
//       .finally(() => setLoading(false));
//   }, [search, stage, user, page]);
//
// ─────────────────────────────────────────────────────────────
// STEP 4 — Use real stat values in HeroCard components:
//
//   // Replace hardcoded values:
//   // totalLogs  = data.reduce((s, l) => s + l.logCount, 0)
//   // with:       stats?.totalLogs   || 0
//
//   // data.length   → stats?.totalLeads  || 0
//   // todayStr      → stats?.today       || todayStr
//   // totalPages    → stats?.totalPages  || 1
//
// ═════════════════════════════════════════════════════════════
// SPRING BOOT JAVA BACKEND — FULL REFERENCE
// ═════════════════════════════════════════════════════════════
//
// ── AllLeadLogsController.java ────────────────────────────────
//
//   @RestController
//   @RequestMapping("/api/leads/logs")
//   @CrossOrigin(origins = "http://localhost:3000")
//   public class AllLeadLogsController {
//
//       @Autowired private AllLeadLogsService service;
//
//       // Card grid data — leads with latest log + count
//       @GetMapping("/summary")
//       public ResponseEntity<LeadLogSummaryResponseDTO> getLeadLogSummary(
//           @RequestParam(required = false)    String search,
//           @RequestParam(required = false)    String stage,
//           @RequestParam(required = false)    Long   userId,
//           @RequestParam(defaultValue = "12") int    perPage,
//           @RequestParam(defaultValue = "1")  int    page) {
//           return ResponseEntity.ok(
//               service.getLeadLogSummary(search, stage, userId, perPage, page));
//       }
//
//       // Stat cards
//       @GetMapping("/stats")
//       public ResponseEntity<LeadLogStatsDTO> getStats() {
//           return ResponseEntity.ok(service.getStats());
//       }
//   }
//
// ── AllLeadLogsService.java ───────────────────────────────────
//
//   @Service
//   public class AllLeadLogsService {
//
//       @Autowired private LeadRepository    leadRepo;
//       @Autowired private LeadLogRepository logRepo;
//
//       public LeadLogSummaryResponseDTO getLeadLogSummary(
//               String search, String stage, Long userId,
//               int perPage, int page) {
//
//           Pageable pageable = PageRequest.of(page - 1, perPage,
//               Sort.by(Sort.Direction.DESC, "updatedAt"));
//
//           // Fetch leads that have at least one log, with filters
//           Page<Lead> leads = leadRepo.findLeadsWithLogs(
//               search, stage, userId, pageable);
//
//           List<LeadLogCardDTO> cards = leads.getContent().stream().map(lead -> {
//               long logCount = logRepo.countByLead(lead);
//               LeadLog latest = logRepo.findTopByLeadOrderByCreatedAtDesc(lead);
//               return toCardDTO(lead, logCount, latest);
//           }).collect(Collectors.toList());
//
//           return new LeadLogSummaryResponseDTO(
//               cards, leads.getTotalElements(),
//               page, perPage, leads.getTotalPages());
//       }
//
//       public LeadLogStatsDTO getStats() {
//           long totalLogs  = logRepo.count();
//           long totalLeads = leadRepo.countLeadsWithAtLeastOneLog();
//           String today    = LocalDate.now()
//               .format(DateTimeFormatter.ofPattern("MMM dd, yyyy"));
//           int totalPages  = (int) Math.ceil((double) totalLeads / 12);
//           return new LeadLogStatsDTO(totalLogs, totalLeads, today, totalPages);
//       }
//
//       private LeadLogCardDTO toCardDTO(Lead lead, long logCount, LeadLog latest) {
//           DateTimeFormatter dateFmt  = DateTimeFormatter.ofPattern("MMM dd, yyyy HH:mm");
//           DateTimeFormatter dateOnly = DateTimeFormatter.ofPattern("MMM dd, yyyy");
//
//           LatestLogDTO latestDto = null;
//           if (latest != null) {
//               latestDto = new LatestLogDTO(
//                   latest.getCreatedAt().format(dateFmt),
//                   latest.getComment(),
//                   latest.getAddedBy().getFullName() + " ("
//                       + capitalise(latest.getAddedBy().getRole()) + ")",
//                   latest.getFollowUpDate() != null
//                       ? latest.getFollowUpDate().format(dateOnly) : null
//               );
//           }
//           return new LeadLogCardDTO(
//               lead.getPublicId(), lead.getName(),
//               lead.getPhone(), lead.getStage(),
//               logCount, latestDto);
//       }
//
//       private String capitalise(String s) {
//           return s == null || s.isEmpty() ? ""
//               : Character.toUpperCase(s.charAt(0)) + s.substring(1).toLowerCase();
//       }
//   }
//
// ── LeadRepository.java (extra queries for this page) ─────────
//
//   @Repository
//   public interface LeadRepository extends JpaRepository<Lead, Long> {
//
//       // Leads that have at least one log, with all filters
//       @Query("SELECT DISTINCT l FROM Lead l " +
//              "JOIN l.logs lg " +
//              "WHERE (:stage  IS NULL OR l.stage = :stage) " +
//              "AND (:userId   IS NULL OR lg.addedBy.id = :userId) " +
//              "AND (:search   IS NULL " +
//              "     OR LOWER(l.name) LIKE LOWER(CONCAT('%',:search,'%')) " +
//              "     OR LOWER(lg.comment) LIKE LOWER(CONCAT('%',:search,'%')))")
//       Page<Lead> findLeadsWithLogs(
//           @Param("search") String search,
//           @Param("stage")  String stage,
//           @Param("userId") Long   userId,
//           Pageable pageable);
//
//       // Count of leads with at least one log
//       @Query("SELECT COUNT(DISTINCT l) FROM Lead l JOIN l.logs lg")
//       long countLeadsWithAtLeastOneLog();
//   }
//
// ── LeadLogRepository.java (extra query for latest log) ───────
//
//   @Repository
//   public interface LeadLogRepository extends JpaRepository<LeadLog, Long> {
//       // Existing methods from leadLogsService ...
//
//       // Most recent log for a given lead (for the card's Latest Log section)
//       LeadLog findTopByLeadOrderByCreatedAtDesc(Lead lead);
//   }
//
// ── DTOs ──────────────────────────────────────────────────────
//
//   // LatestLogDTO.java
//   public class LatestLogDTO {
//       private String date;          // "Jun 01, 2026 12:31"
//       private String comment;       // log comment text
//       private String addedBy;       // "Raghvendra Shahi (Admin)"
//       private String followUpDate;  // "Jun 02, 2026" or null
//       // constructor + getters or @Data (Lombok)
//   }
//
//   // LeadLogCardDTO.java
//   public class LeadLogCardDTO {
//       private String       leadId;
//       private String       leadName;
//       private String       phone;
//       private String       stage;
//       private long         logCount;
//       private LatestLogDTO latestLog;   // null if no logs yet
//       // constructor + getters or @Data (Lombok)
//   }
//
//   // LeadLogSummaryResponseDTO.java
//   public class LeadLogSummaryResponseDTO {
//       private List<LeadLogCardDTO> leads;
//       private long total;
//       private int  page;
//       private int  perPage;
//       private int  totalPages;
//       // constructor + getters
//   }
//
//   // LeadLogStatsDTO.java
//   public class LeadLogStatsDTO {
//       private long   totalLogs;
//       private long   totalLeads;
//       private String today;       // "Jun 24, 2026"
//       private int    totalPages;  // pre-calculated at perPage=12
//       // constructor + getters
//   }
//
// ─────────────────────────────────────────────────────────────
// ── PostgreSQL — Key Queries ──────────────────────────────────
//
//   -- Leads with at least one log (for card grid)
//   SELECT DISTINCT ON (l.id)
//     l.public_id    AS lead_id,
//     l.name         AS lead_name,
//     l.phone,
//     l.stage,
//     COUNT(ll.id)   AS log_count,
//     -- latest log fields via subquery
//     (SELECT ll2.created_at FROM lead_logs ll2
//      WHERE ll2.lead_id = l.id
//      ORDER BY ll2.created_at DESC LIMIT 1) AS latest_date,
//     (SELECT ll2.comment   FROM lead_logs ll2
//      WHERE ll2.lead_id = l.id
//      ORDER BY ll2.created_at DESC LIMIT 1) AS latest_comment,
//     (SELECT u.full_name || ' (' || INITCAP(u.role) || ')'
//      FROM lead_logs ll2
//      JOIN users u ON u.id = ll2.added_by_user_id
//      WHERE ll2.lead_id = l.id
//      ORDER BY ll2.created_at DESC LIMIT 1) AS latest_added_by,
//     (SELECT ll2.follow_up_date FROM lead_logs ll2
//      WHERE ll2.lead_id = l.id
//      ORDER BY ll2.created_at DESC LIMIT 1) AS latest_follow_up
//   FROM leads l
//   JOIN lead_logs ll ON ll.lead_id = l.id
//   WHERE
//     (:stage  IS NULL OR l.stage = :stage)
//     AND (:userId IS NULL OR ll.added_by_user_id = :userId)
//     AND (
//       :search IS NULL
//       OR l.name    ILIKE '%' || :search || '%'
//       OR ll.comment ILIKE '%' || :search || '%'
//     )
//   GROUP BY l.id
//   ORDER BY l.updated_at DESC
//   LIMIT :perPage OFFSET :offset;
//
//   -- Total stats query
//   SELECT
//     (SELECT COUNT(*) FROM lead_logs)                            AS total_logs,
//     (SELECT COUNT(DISTINCT lead_id) FROM lead_logs)             AS total_leads,
//     TO_CHAR(CURRENT_DATE, 'Mon DD, YYYY')                       AS today;
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