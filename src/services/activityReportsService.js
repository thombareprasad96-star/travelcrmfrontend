// src/services/activityReportsService.js
// ─────────────────────────────────────────────────────────────
// Activity Reports Page — API Service
// Page: ActivityReports.jsx
// Backend: Java Spring Boot REST API
// Database: PostgreSQL
// Covers:
//   - Get activity logs (with filters: date range, action, userType, user, pagination)
//   - Get summary stats (total, logins, admin actions, unique users)
//   - Get users list for dropdown
//   - Export CSV
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
  timeout: 30000,
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
// ACTIVITY REPORTS SERVICE
// Spring Boot Controller: /api/reports/activity
// PostgreSQL Table: activity_logs / audit_logs
// ═════════════════════════════════════════════════════════════
const activityReportsService = {

  // ── GET ACTIVITY LOGS (with all filters + pagination) ──────
  // GET /api/reports/activity/logs
  // @GetMapping("/api/reports/activity/logs")
  // public ResponseEntity<ActivityLogsResponseDTO> getLogs(
  //     @RequestParam(required = false) String startDate,
  //     @RequestParam(required = false) String endDate,
  //     @RequestParam(required = false) String action,
  //     @RequestParam(required = false) String userType,
  //     @RequestParam(required = false) Long   userId,
  //     @RequestParam(defaultValue = "50")  int perPage,
  //     @RequestParam(defaultValue = "1")   int page)
  //
  // Request params (all optional):
  //   startDate = "2026-05-23"     (ISO date)
  //   endDate   = "2026-06-22"     (ISO date)
  //   action    = "Login"          (null = All Actions)
  //   userType  = "Admin"          (null = All Types)
  //   userId    = 34               (null = All Users)
  //   perPage   = 50               (10 | 25 | 50 | 100)
  //   page      = 1
  //
  // Response:
  // {
  //   logs: [
  //     {
  //       id:          1,
  //       date:        "Jun 22, 2026",
  //       time:        "09:24:34",
  //       user:        "Shreyash Raghvendra Shahi",
  //       username:    "@Shreyash_Shahi",
  //       type:        "User",               // User | Admin | Manager | Staff
  //       action:      "Login",              // Login | Logout | Create | Update | Delete | Settings | Export
  //       description: "Company user logged in from IP: 106.215.178.26",
  //       ip:          "106.215.178.26"
  //     },
  //     ...
  //   ],
  //   total:       255,
  //   page:        1,
  //   perPage:     50,
  //   totalPages:  6
  // }
  getLogs: (filters = {}) => {
    const params = {};
    if (filters.startDate && filters.startDate !== "")  params.startDate = filters.startDate;
    if (filters.endDate   && filters.endDate   !== "")  params.endDate   = filters.endDate;
    if (filters.action    && filters.action    !== "All Actions") params.action   = filters.action;
    if (filters.userType  && filters.userType  !== "All Types")   params.userType = filters.userType;
    if (filters.userId    && filters.userId    !== "All Users")   params.userId   = filters.userId;
    if (filters.perPage)  params.perPage = filters.perPage;
    if (filters.page)     params.page    = filters.page;
    return api.get("/api/reports/activity/logs", { params });
  },

  // ── GET ACTIVITY SUMMARY (stat cards) ──────────────────────
  // GET /api/reports/activity/summary
  // @GetMapping("/api/reports/activity/summary")
  // public ResponseEntity<ActivitySummaryDTO> getSummary(
  //     @RequestParam(required = false) String startDate,
  //     @RequestParam(required = false) String endDate)
  //
  // Response:
  // {
  //   totalActivities: 255,
  //   totalLogins:     180,
  //   adminActions:    75,
  //   uniqueUsers:     4
  // }
  getSummary: (startDate, endDate) => {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate)   params.endDate   = endDate;
    return api.get("/api/reports/activity/summary", { params });
  },

  // ── GET SINGLE LOG DETAIL ──────────────────────────────────
  // GET /api/reports/activity/logs/{id}
  // @GetMapping("/api/reports/activity/logs/{id}")
  // public ResponseEntity<ActivityLogDetailDTO> getLogById(
  //     @PathVariable Long id)
  //
  // Response: same shape as single log object (for the Details modal)
  getLogById: (id) => {
    return api.get(`/api/reports/activity/logs/${id}`);
  },

  // ── GET USERS FOR DROPDOWN ─────────────────────────────────
  // GET /api/users/dropdown
  // @GetMapping("/api/users/dropdown")
  // public ResponseEntity<List<UserDropdownDTO>> getUsersForDropdown()
  //
  // Response: [{ id: 34, fullName: "Shreyash Raghvendra Shahi", username: "Shreyash_Shahi" }]
  // Used to populate the "User" filter dropdown
  getUsersForDropdown: () => {
    return api.get("/api/users/dropdown");
  },

  // ── EXPORT CSV ─────────────────────────────────────────────
  // GET /api/reports/activity/export/csv
  // @GetMapping("/api/reports/activity/export/csv")
  // public ResponseEntity<byte[]> exportCsv(
  //     @RequestParam(required = false) String startDate,
  //     @RequestParam(required = false) String endDate,
  //     @RequestParam(required = false) String action,
  //     @RequestParam(required = false) String userType,
  //     @RequestParam(required = false) Long   userId)
  //
  // Applies same filters as getLogs() but returns the full
  // result set as a downloadable CSV file (no pagination)
  //
  // Response: binary CSV file download
  // Content-Disposition: attachment; filename="activity-report-2026-05-23-to-2026-06-22.csv"
  exportCsv: (filters = {}) => {
    const params = {};
    if (filters.startDate && filters.startDate !== "")  params.startDate = filters.startDate;
    if (filters.endDate   && filters.endDate   !== "")  params.endDate   = filters.endDate;
    if (filters.action    && filters.action    !== "All Actions") params.action   = filters.action;
    if (filters.userType  && filters.userType  !== "All Types")   params.userType = filters.userType;
    if (filters.userId    && filters.userId    !== "All Users")   params.userId   = filters.userId;
    return api.get("/api/reports/activity/export/csv", {
      params,
      responseType: "blob", // important — returns binary file
    });
  },
};

export default activityReportsService;


// ═════════════════════════════════════════════════════════════
// HOW TO USE IN ActivityReports.jsx
// ═════════════════════════════════════════════════════════════
//
// STEP 1 — Import at top of ActivityReports.jsx:
//   import activityReportsService
//     from "../services/activityReportsService";
//
// ─────────────────────────────────────────────────────────────
// STEP 2 — Replace mock useEffect with real API:
//
//   const [totalRecords, setTotalRecords] = useState(0);
//
//   useEffect(() => {
//     setLoading(true);
//     Promise.all([
//       activityReportsService.getLogs({
//         startDate: applied.startDate,
//         endDate:   applied.endDate,
//         action:    applied.action,
//         userType:  applied.userType,
//         userId:    applied.user,   // pass the userId, not the name
//         perPage:   Number(perPage),
//         page,
//       }),
//       activityReportsService.getSummary(applied.startDate, applied.endDate),
//     ])
//       .then(([logsRes, summaryRes]) => {
//         setLogs(logsRes.data.logs);
//         setTotalRecords(logsRes.data.total);
//         setStats({
//           total:   summaryRes.data.totalActivities,
//           logins:  summaryRes.data.totalLogins,
//           admins:  summaryRes.data.adminActions,
//           unique:  summaryRes.data.uniqueUsers,
//         });
//       })
//       .catch(() => showToast("Failed to load activity logs.", "error"))
//       .finally(() => setLoading(false));
//   }, [applied, page, perPage]);
//
// ─────────────────────────────────────────────────────────────
// STEP 3 — Load users dropdown on mount:
//
//   const [usersList, setUsersList] = useState([]);
//
//   useEffect(() => {
//     activityReportsService.getUsersForDropdown()
//       .then(res => {
//         setUsersList([
//           { id: null, fullName: "All Users" },
//           ...res.data
//         ]);
//       })
//       .catch(() => {});
//   }, []);
//
//   // Then render dropdown:
//   // {usersList.map(u => (
//   //   <option key={u.id} value={u.id}>{u.fullName}</option>
//   // ))}
//
// ─────────────────────────────────────────────────────────────
// STEP 4 — Replace handleExportCSV with real API download:
//
//   const handleExportCSV = async () => {
//     try {
//       const res = await activityReportsService.exportCsv({
//         startDate: applied.startDate,
//         endDate:   applied.endDate,
//         action:    applied.action,
//         userType:  applied.userType,
//         userId:    applied.user,
//       });
//       const url  = window.URL.createObjectURL(new Blob([res.data]));
//       const link = document.createElement("a");
//       link.href  = url;
//       link.setAttribute(
//         "download",
//         `activity-report-${applied.startDate}-to-${applied.endDate}.csv`
//       );
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//       window.URL.revokeObjectURL(url);
//       showToast("CSV exported successfully.");
//     } catch {
//       showToast("Export failed. Try again.", "error");
//     }
//   };
//
// ─────────────────────────────────────────────────────────────
// STEP 5 — Optional: Load full log detail from API on eye click:
//
//   const handleViewDetail = async (log) => {
//     try {
//       const res = await activityReportsService.getLogById(log.id);
//       setDetail(res.data);
//     } catch {
//       // Fallback to using the already-loaded log data
//       setDetail(log);
//     }
//   };
//
//   // Then in your Details button:
//   // onClick={() => handleViewDetail(log)}
//
// ═════════════════════════════════════════════════════════════
// SPRING BOOT JAVA BACKEND — FULL REFERENCE
// ═════════════════════════════════════════════════════════════
//
// ── ActivityReportController.java ────────────────────────────
//
//   @RestController
//   @RequestMapping("/api/reports/activity")
//   @CrossOrigin(origins = "http://localhost:3000")
//   public class ActivityReportController {
//
//       @Autowired private ActivityReportService service;
//
//       // Get paginated logs with filters
//       @GetMapping("/logs")
//       public ResponseEntity<ActivityLogsResponseDTO> getLogs(
//           @RequestParam(required = false) String startDate,
//           @RequestParam(required = false) String endDate,
//           @RequestParam(required = false) String action,
//           @RequestParam(required = false) String userType,
//           @RequestParam(required = false) Long   userId,
//           @RequestParam(defaultValue = "50") int perPage,
//           @RequestParam(defaultValue = "1")  int page) {
//           return ResponseEntity.ok(
//               service.getLogs(startDate, endDate, action, userType, userId, perPage, page));
//       }
//
//       // Get summary stats for stat cards
//       @GetMapping("/summary")
//       public ResponseEntity<ActivitySummaryDTO> getSummary(
//           @RequestParam(required = false) String startDate,
//           @RequestParam(required = false) String endDate) {
//           return ResponseEntity.ok(service.getSummary(startDate, endDate));
//       }
//
//       // Get single log by ID (for detail modal)
//       @GetMapping("/logs/{id}")
//       public ResponseEntity<ActivityLogDetailDTO> getLogById(
//           @PathVariable Long id) {
//           return ResponseEntity.ok(service.getLogById(id));
//       }
//
//       // Export filtered logs as CSV
//       @GetMapping("/export/csv")
//       public ResponseEntity<byte[]> exportCsv(
//           @RequestParam(required = false) String startDate,
//           @RequestParam(required = false) String endDate,
//           @RequestParam(required = false) String action,
//           @RequestParam(required = false) String userType,
//           @RequestParam(required = false) Long   userId) {
//           byte[] csv = service.exportCsv(startDate, endDate, action, userType, userId);
//           String filename = "activity-report-" + startDate + "-to-" + endDate + ".csv";
//           return ResponseEntity.ok()
//               .header("Content-Disposition", "attachment; filename=" + filename)
//               .contentType(MediaType.parseMediaType("text/csv"))
//               .body(csv);
//       }
//   }
//
// ── ActivityReportService.java ────────────────────────────────
//
//   @Service
//   public class ActivityReportService {
//
//       @Autowired private ActivityLogRepository repo;
//
//       public ActivityLogsResponseDTO getLogs(
//               String startDate, String endDate, String action,
//               String userType, Long userId, int perPage, int page) {
//
//           LocalDateTime from = startDate != null
//               ? LocalDate.parse(startDate).atStartOfDay()
//               : LocalDateTime.now().minusDays(30);
//           LocalDateTime to = endDate != null
//               ? LocalDate.parse(endDate).atTime(23, 59, 59)
//               : LocalDateTime.now();
//
//           Pageable pageable = PageRequest.of(page - 1, perPage,
//               Sort.by(Sort.Direction.DESC, "createdAt"));
//
//           Page<ActivityLog> result = repo.findWithFilters(
//               from, to, action, userType, userId, pageable);
//
//           List<ActivityLogDTO> logs = result.getContent()
//               .stream().map(this::toDTO)
//               .collect(Collectors.toList());
//
//           return new ActivityLogsResponseDTO(
//               logs, result.getTotalElements(), page, perPage,
//               result.getTotalPages());
//       }
//
//       public ActivitySummaryDTO getSummary(String startDate, String endDate) {
//           LocalDateTime from = startDate != null
//               ? LocalDate.parse(startDate).atStartOfDay()
//               : LocalDateTime.now().minusDays(30);
//           LocalDateTime to = endDate != null
//               ? LocalDate.parse(endDate).atTime(23, 59, 59)
//               : LocalDateTime.now();
//
//           long total   = repo.countByCreatedAtBetween(from, to);
//           long logins  = repo.countByCreatedAtBetweenAndAction(from, to, "Login");
//           long admins  = repo.countByCreatedAtBetweenAndUserType(from, to, "Admin");
//           long unique  = repo.countDistinctUserByCreatedAtBetween(from, to);
//
//           return new ActivitySummaryDTO(total, logins, admins, unique);
//       }
//
//       public ActivityLogDetailDTO getLogById(Long id) {
//           ActivityLog log = repo.findById(id)
//               .orElseThrow(() -> new ResponseStatusException(
//                   HttpStatus.NOT_FOUND, "Log not found"));
//           return toDetailDTO(log);
//       }
//
//       public byte[] exportCsv(String startDate, String endDate,
//               String action, String userType, Long userId) {
//           LocalDateTime from = startDate != null
//               ? LocalDate.parse(startDate).atStartOfDay()
//               : LocalDateTime.now().minusDays(30);
//           LocalDateTime to = endDate != null
//               ? LocalDate.parse(endDate).atTime(23, 59, 59)
//               : LocalDateTime.now();
//
//           List<ActivityLog> logs = repo.findAllWithFilters(
//               from, to, action, userType, userId);
//
//           StringBuilder csv = new StringBuilder();
//           csv.append("ID,Date,Time,User,Username,Type,Action,Description,IP Address\n");
//           DateTimeFormatter dateFmt = DateTimeFormatter.ofPattern("MMM dd, yyyy");
//           DateTimeFormatter timeFmt = DateTimeFormatter.ofPattern("HH:mm:ss");
//
//           for (ActivityLog log : logs) {
//               csv.append(String.format("%d,%s,%s,\"%s\",\"%s\",%s,%s,\"%s\",%s\n",
//                   log.getId(),
//                   log.getCreatedAt().format(dateFmt),
//                   log.getCreatedAt().format(timeFmt),
//                   log.getUser().getFullName(),
//                   "@" + log.getUser().getUsername(),
//                   log.getUserType(),
//                   log.getAction(),
//                   log.getDescription().replace("\"", "\"\""),
//                   log.getIpAddress()
//               ));
//           }
//           return csv.toString().getBytes(StandardCharsets.UTF_8);
//       }
//
//       private ActivityLogDTO toDTO(ActivityLog log) {
//           DateTimeFormatter dateFmt = DateTimeFormatter.ofPattern("MMM dd, yyyy");
//           DateTimeFormatter timeFmt = DateTimeFormatter.ofPattern("HH:mm:ss");
//           ActivityLogDTO dto = new ActivityLogDTO();
//           dto.setId(log.getId());
//           dto.setDate(log.getCreatedAt().format(dateFmt));
//           dto.setTime(log.getCreatedAt().format(timeFmt));
//           dto.setUser(log.getUser().getFullName());
//           dto.setUsername("@" + log.getUser().getUsername());
//           dto.setType(log.getUserType());
//           dto.setAction(log.getAction());
//           dto.setDescription(log.getDescription());
//           dto.setIp(log.getIpAddress());
//           return dto;
//       }
//   }
//
// ── ActivityLog.java (Entity) ─────────────────────────────────
//
//   @Entity
//   @Table(name = "activity_logs")
//   public class ActivityLog {
//       @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
//       private Long id;
//
//       @ManyToOne(fetch = FetchType.LAZY)
//       @JoinColumn(name = "user_id", nullable = false)
//       private User user;
//
//       @Column(name = "user_type", length = 20)
//       private String userType;   // User | Admin | Manager | Staff
//
//       @Column(name = "action", nullable = false, length = 50)
//       private String action;     // Login | Logout | Create | Update | Delete | Settings | Export
//
//       @Column(name = "description", columnDefinition = "TEXT")
//       private String description;
//
//       @Column(name = "ip_address", length = 45)
//       private String ipAddress;  // supports IPv4 and IPv6
//
//       @Column(name = "user_agent", length = 500)
//       private String userAgent;  // browser/device info
//
//       @Column(name = "created_at", nullable = false)
//       private LocalDateTime createdAt;
//
//       @PrePersist
//       protected void onCreate() { createdAt = LocalDateTime.now(); }
//       // getters + setters or @Data (Lombok)
//   }
//
// ── ActivityLogRepository.java ────────────────────────────────
//
//   @Repository
//   public interface ActivityLogRepository
//       extends JpaRepository<ActivityLog, Long> {
//
//       long countByCreatedAtBetween(LocalDateTime from, LocalDateTime to);
//
//       long countByCreatedAtBetweenAndAction(
//           LocalDateTime from, LocalDateTime to, String action);
//
//       long countByCreatedAtBetweenAndUserType(
//           LocalDateTime from, LocalDateTime to, String userType);
//
//       @Query("SELECT COUNT(DISTINCT l.user.id) FROM ActivityLog l " +
//              "WHERE l.createdAt BETWEEN :from AND :to")
//       long countDistinctUserByCreatedAtBetween(
//           @Param("from") LocalDateTime from,
//           @Param("to")   LocalDateTime to);
//
//       @Query("SELECT l FROM ActivityLog l WHERE " +
//              "l.createdAt BETWEEN :from AND :to " +
//              "AND (:action   IS NULL OR l.action   = :action)   " +
//              "AND (:userType IS NULL OR l.userType = :userType) " +
//              "AND (:userId   IS NULL OR l.user.id  = :userId)")
//       Page<ActivityLog> findWithFilters(
//           @Param("from")     LocalDateTime from,
//           @Param("to")       LocalDateTime to,
//           @Param("action")   String action,
//           @Param("userType") String userType,
//           @Param("userId")   Long userId,
//           Pageable pageable);
//
//       @Query("SELECT l FROM ActivityLog l WHERE " +
//              "l.createdAt BETWEEN :from AND :to " +
//              "AND (:action   IS NULL OR l.action   = :action)   " +
//              "AND (:userType IS NULL OR l.userType = :userType) " +
//              "AND (:userId   IS NULL OR l.user.id  = :userId)   " +
//              "ORDER BY l.createdAt DESC")
//       List<ActivityLog> findAllWithFilters(
//           @Param("from")     LocalDateTime from,
//           @Param("to")       LocalDateTime to,
//           @Param("action")   String action,
//           @Param("userType") String userType,
//           @Param("userId")   Long userId);
//   }
//
// ── ActivityLogDTO.java ───────────────────────────────────────
//
//   public class ActivityLogDTO {
//       private Long   id;
//       private String date;         // "Jun 22, 2026"
//       private String time;         // "09:24:34"
//       private String user;         // "Shreyash Raghvendra Shahi"
//       private String username;     // "@Shreyash_Shahi"
//       private String type;         // "User" | "Admin" | ...
//       private String action;       // "Login" | "Create" | ...
//       private String description;
//       private String ip;
//       // getters + setters or @Data (Lombok)
//   }
//
// ── ActivityLogsResponseDTO.java ─────────────────────────────
//
//   public class ActivityLogsResponseDTO {
//       private List<ActivityLogDTO> logs;
//       private long   total;
//       private int    page;
//       private int    perPage;
//       private int    totalPages;
//       // constructor + getters
//   }
//
// ── ActivitySummaryDTO.java ───────────────────────────────────
//
//   public class ActivitySummaryDTO {
//       private long totalActivities;
//       private long totalLogins;
//       private long adminActions;
//       private long uniqueUsers;
//       // constructor + getters
//   }
//
// ── ActivityLogDetailDTO.java ─────────────────────────────────
//
//   public class ActivityLogDetailDTO extends ActivityLogDTO {
//       private String userAgent;    // browser / device info
//       // getters + setters
//   }
//
// ─────────────────────────────────────────────────────────────
// ── PostgreSQL Schema ─────────────────────────────────────────
//
//   CREATE TABLE activity_logs (
//     id          BIGSERIAL    PRIMARY KEY,
//     user_id     BIGINT       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
//     user_type   VARCHAR(20)  NOT NULL,
//     action      VARCHAR(50)  NOT NULL,
//     description TEXT,
//     ip_address  VARCHAR(45),
//     user_agent  VARCHAR(500),
//     created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
//
//     CONSTRAINT chk_action CHECK (action IN (
//       'Login','Logout','Create','Update','Delete','Settings','Export','View'))
//   );
//
//   -- Indexes for fast filtering and sorting
//   CREATE INDEX idx_al_created_at ON activity_logs (created_at DESC);
//   CREATE INDEX idx_al_user_id    ON activity_logs (user_id);
//   CREATE INDEX idx_al_action     ON activity_logs (action);
//   CREATE INDEX idx_al_user_type  ON activity_logs (user_type);
//
//   -- Composite index for the most common filter combo
//   CREATE INDEX idx_al_date_action ON activity_logs (created_at DESC, action, user_type);
//
//   -- Seed sample data
//   INSERT INTO activity_logs (user_id, user_type, action, description, ip_address, created_at)
//   VALUES
//     (34, 'User',  'Login',  'Company user logged in from IP: 106.215.178.26',    '106.215.178.26', '2026-06-22 09:24:34'),
//     (1,  'Admin', 'Login',  'Company admin logged in from IP: 106.215.178.26',   '106.215.178.26', '2026-06-22 09:24:17'),
//     (1,  'Admin', 'Login',  'Company admin logged in from IP: 106.215.178.26',   '106.215.178.26', '2026-06-22 09:11:48'),
//     (1,  'Admin', 'Login',  'Company admin logged in from IP: 122.183.33.218',   '122.183.33.218', '2026-06-20 14:34:14'),
//     (34, 'User',  'Create', 'User created a new lead: Ramesh Kumar',             '106.215.178.26', '2026-06-18 10:52:50'),
//     (21, 'User',  'Update', 'User updated lead status to Contacted',             '103.45.123.77',  '2026-06-17 15:22:01'),
//     (1,  'Admin', 'Delete', 'Admin deleted user: testuser2',                     '122.183.33.218', '2026-06-17 14:11:30');
//
// ── application.properties ───────────────────────────────────
//   spring.datasource.url=jdbc:postgresql://localhost:5432/travel_crm
//   spring.datasource.username=postgres
//   spring.datasource.password=yourpassword
//   spring.datasource.driver-class-name=org.postgresql.Driver
//   spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
//   spring.jpa.hibernate.ddl-auto=update
//   spring.jpa.show-sql=true
//   server.port=8080
//
// ── .env (React) ──────────────────────────────────────────────
//   REACT_APP_API_URL=http://localhost:8080
// ─────────────────────────────────────────────────────────────