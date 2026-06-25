// src/services/followupReportService.js
// ─────────────────────────────────────────────────────────────
// Lead Follow-up Report Page — API Service
// Page: FollowupReports.jsx
// Backend: Java Spring Boot REST API
// Database: PostgreSQL
// Covers:
//   - Get follow-up tasks (all filters + pagination)
//   - Get summary stats (6 stat cards)
//   - Get users for Assigned To dropdown
//   - Mark single task as completed
//   - Mark selected tasks as completed (bulk)
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

// ── FILTER PARAMS BUILDER ─────────────────────────────────────
// Strips empty/default values before sending to backend
const buildParams = (filters = {}) => {
  const params = {};
  if (filters.viewType     && filters.viewType     !== "All")             params.viewType     = filters.viewType;
  if (filters.daysAhead    && filters.daysAhead    !== "All")             params.daysAhead    = filters.daysAhead;
  if (filters.assignedTo   && filters.assignedTo   !== "All Users")       params.assignedTo   = filters.assignedTo;
  if (filters.priority     && filters.priority     !== "All Priorities")  params.priority     = filters.priority;
  if (filters.reminderType && filters.reminderType !== "All Types")       params.reminderType = filters.reminderType;
  if (filters.search       && filters.search       !== "")                params.search       = filters.search;
  if (filters.page)    params.page    = filters.page;
  if (filters.perPage) params.perPage = filters.perPage;
  return params;
};


// ═════════════════════════════════════════════════════════════
// FOLLOW-UP REPORT SERVICE
// Spring Boot Controller: /api/reports/followup
// PostgreSQL Tables: reminders, leads, users
// ═════════════════════════════════════════════════════════════
const followupReportService = {

  // ── GET FOLLOW-UP TASKS (table rows with all filters) ──────
  // GET /api/reports/followup/tasks
  // @GetMapping("/api/reports/followup/tasks")
  // public ResponseEntity<FollowupTasksResponseDTO> getTasks(
  //     @RequestParam(required = false)            String viewType,
  //     @RequestParam(required = false)            String daysAhead,
  //     @RequestParam(required = false)            Long   assignedTo,
  //     @RequestParam(required = false)            String priority,
  //     @RequestParam(required = false)            String reminderType,
  //     @RequestParam(required = false)            String search,
  //     @RequestParam(defaultValue = "25")         int    perPage,
  //     @RequestParam(defaultValue = "1")          int    page)
  //
  // viewType values:
  //   "All"       → all reminders
  //   "Upcoming"  → due_date >= TODAY
  //   "Overdue"   → due_date <  TODAY AND completed = false
  //   "Due Today" → due_date = TODAY
  //   "Completed" → completed = true
  //
  // daysAhead values (only applied when viewType = "Upcoming"):
  //   "1 day" | "3 days" | "7 days" | "14 days" | "30 days"
  //
  // Response:
  // {
  //   tasks: [
  //     {
  //       id:               1,
  //       dueDate:          "Jun 01, 2026",
  //       dueTime:          "20:07",
  //       overdueBy:        "Overdue by 21 days",
  //       leadName:         "Pratik",
  //       leadPhone:        "+918888888888",
  //       leadTemp:         "Hot",           // Hot | Warm | Cold | Fresh
  //       assignedTo:       "deepti paul",
  //       assignedUsername: "@deepti_paul",
  //       assignedUserId:   21,
  //       type:             "First Contact", // reminder type
  //       priority:         "High",          // High | Medium | Low
  //       title:            "Contact New Lead: Pratik",
  //       desc:             "New lead requires initial contact",
  //       stage:            "Ready to Book",
  //       travelDate:       "Jul 07",
  //       completed:        false
  //     },
  //     ...
  //   ],
  //   total:      21,
  //   page:       1,
  //   perPage:    25,
  //   totalPages: 1
  // }
  getTasks: (filters = {}) => {
    return api.get("/api/reports/followup/tasks", {
      params: buildParams(filters),
    });
  },

  // ── GET SUMMARY STATS (6 stat cards) ──────────────────────
  // GET /api/reports/followup/summary
  // @GetMapping("/api/reports/followup/summary")
  // public ResponseEntity<FollowupSummaryDTO> getSummary(
  //     @RequestParam(required = false) Long   assignedTo,
  //     @RequestParam(required = false) String priority,
  //     @RequestParam(required = false) String reminderType)
  //
  // Response:
  // {
  //   totalFollowups: 21,
  //   overdue:        21,
  //   dueToday:       0,
  //   urgent:         0,    // due within 3 days
  //   upcoming:       0,
  //   highPriority:   20
  // }
  getSummary: (filters = {}) => {
    const params = {};
    if (filters.assignedTo   && filters.assignedTo   !== "All Users")      params.assignedTo   = filters.assignedTo;
    if (filters.priority     && filters.priority     !== "All Priorities") params.priority     = filters.priority;
    if (filters.reminderType && filters.reminderType !== "All Types")      params.reminderType = filters.reminderType;
    return api.get("/api/reports/followup/summary", { params });
  },

  // ── GET USERS FOR "ASSIGNED TO" DROPDOWN ──────────────────
  // GET /api/users/dropdown
  // @GetMapping("/api/users/dropdown")
  // public ResponseEntity<List<UserDropdownDTO>> getUsersForDropdown()
  //
  // Response:
  // [
  //   { id: 21, fullName: "deepti paul",               username: "deepti_paul"           },
  //   { id: 20, fullName: "vaishnavi shrikant jagtap", username: "vaishnavi_jagtap"      },
  //   { id: 34, fullName: "Shreyash Raghvendra Shahi", username: "Shreyash_Shahi"        },
  // ]
  getUsersForDropdown: () => {
    return api.get("/api/users/dropdown");
  },

  // ── MARK SINGLE TASK AS COMPLETED ─────────────────────────
  // PATCH /api/reports/followup/tasks/{id}/complete
  // @PatchMapping("/api/reports/followup/tasks/{id}/complete")
  // public ResponseEntity<FollowupTaskDTO> markComplete(
  //     @PathVariable Long id)
  //
  // Backend:
  //   - Sets reminder.completed = true
  //   - Sets reminder.completed_at = NOW()
  //   - Returns updated task DTO
  //
  // Error: 404 if task not found
  markComplete: (id) => {
    return api.patch(`/api/reports/followup/tasks/${id}/complete`);
  },

  // ── MARK SELECTED TASKS AS COMPLETED (bulk) ───────────────
  // PATCH /api/reports/followup/tasks/bulk-complete
  // @PatchMapping("/api/reports/followup/tasks/bulk-complete")
  // public ResponseEntity<BulkCompleteResponseDTO> bulkComplete(
  //     @RequestBody BulkCompleteRequest request)
  //
  // Request body:
  // {
  //   ids: [1, 2, 4, 7]    // array of reminder IDs to mark as completed
  // }
  //
  // Response:
  // {
  //   completed:   4,       // number of tasks successfully completed
  //   failed:      0,       // number that failed (already completed or not found)
  //   message:     "4 tasks marked as completed."
  // }
  bulkComplete: (ids = []) => {
    return api.patch("/api/reports/followup/tasks/bulk-complete", { ids });
  },

  // ── EXPORT CSV ─────────────────────────────────────────────
  // GET /api/reports/followup/export/csv
  // @GetMapping("/api/reports/followup/export/csv")
  // public ResponseEntity<byte[]> exportCsv(
  //     @RequestParam(required = false) String viewType,
  //     @RequestParam(required = false) String daysAhead,
  //     @RequestParam(required = false) Long   assignedTo,
  //     @RequestParam(required = false) String priority,
  //     @RequestParam(required = false) String reminderType,
  //     @RequestParam(required = false) String search)
  //
  // Returns the full (unpaginated) filtered dataset as CSV
  // Content-Disposition: attachment; filename="followup-report.csv"
  exportCsv: (filters = {}) => {
    return api.get("/api/reports/followup/export/csv", {
      params: buildParams(filters),
      responseType: "blob",
    });
  },
};

export default followupReportService;


// ═════════════════════════════════════════════════════════════
// HOW TO USE IN FollowupReports.jsx
// ═════════════════════════════════════════════════════════════
//
// STEP 1 — Import at top of FollowupReports.jsx:
//   import followupReportService
//     from "../services/followupReportService";
//
// ─────────────────────────────────────────────────────────────
// STEP 2 — Replace mock useEffect with real API:
//
//   useEffect(() => {
//     setLoading(true);
//     Promise.all([
//       followupReportService.getTasks({
//         viewType:     applied.viewType,
//         daysAhead:    applied.daysAhead,
//         assignedTo:   applied.assignedTo,
//         priority:     applied.priority,
//         reminderType: applied.reminderType,
//         search,
//         page,
//         perPage: Number(showEntries),
//       }),
//       followupReportService.getSummary({
//         assignedTo:   applied.assignedTo,
//         priority:     applied.priority,
//         reminderType: applied.reminderType,
//       }),
//     ])
//       .then(([tasksRes, summaryRes]) => {
//         setTasks(tasksRes.data.tasks);
//         setTotalCount(tasksRes.data.total);
//         // Bind summary to stat cards:
//         // summary.total    = summaryRes.data.totalFollowups
//         // summary.overdue  = summaryRes.data.overdue
//         // summary.dueToday = summaryRes.data.dueToday
//         // summary.urgent   = summaryRes.data.urgent
//         // summary.upcoming = summaryRes.data.upcoming
//         // summary.highPri  = summaryRes.data.highPriority
//       })
//       .catch(() => showToast("Failed to load follow-up data.", "error"))
//       .finally(() => setLoading(false));
//   }, [applied, page, showEntries, search]);
//
// ─────────────────────────────────────────────────────────────
// STEP 3 — Load users dropdown on mount:
//
//   const [usersList, setUsersList] = useState([]);
//
//   useEffect(() => {
//     followupReportService
//       .getUsersForDropdown()
//       .then(res => {
//         setUsersList([
//           "All Users",
//           ...res.data.map(u => u.fullName)
//         ]);
//       })
//       .catch(() => {});
//   }, []);
//
// ─────────────────────────────────────────────────────────────
// STEP 4 — Replace handleComplete (single task):
//
//   const handleComplete = async (id) => {
//     try {
//       await followupReportService.markComplete(id);
//       setTasks(prev =>
//         prev.map(t => t.id === id ? { ...t, completed: true } : t)
//       );
//       showToast("Task marked as completed.");
//     } catch (err) {
//       showToast(
//         err?.response?.data?.message || "Failed to complete task.",
//         "error"
//       );
//     }
//   };
//
// ─────────────────────────────────────────────────────────────
// STEP 5 — Replace handleMarkCompleted (bulk):
//
//   const handleMarkCompleted = async () => {
//     if (selected.size === 0) {
//       showToast("Select at least one task.", "error");
//       return;
//     }
//     try {
//       const ids = [...selected];
//       const res = await followupReportService.bulkComplete(ids);
//       setTasks(prev =>
//         prev.map(t => ids.includes(t.id) ? { ...t, completed: true } : t)
//       );
//       showToast(res.data.message || `${ids.length} tasks marked as completed.`);
//       setSelected(new Set());
//     } catch (err) {
//       showToast(
//         err?.response?.data?.message || "Bulk complete failed.",
//         "error"
//       );
//     }
//   };
//
// ─────────────────────────────────────────────────────────────
// STEP 6 — Replace handleExportCSV:
//
//   const handleExportCSV = async () => {
//     try {
//       const res = await followupReportService.exportCsv({
//         viewType:     applied.viewType,
//         daysAhead:    applied.daysAhead,
//         assignedTo:   applied.assignedTo,
//         priority:     applied.priority,
//         reminderType: applied.reminderType,
//         search,
//       });
//       const url  = window.URL.createObjectURL(new Blob([res.data]));
//       const link = document.createElement("a");
//       link.href  = url;
//       link.setAttribute("download", "followup-report.csv");
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
// ═════════════════════════════════════════════════════════════
// SPRING BOOT JAVA BACKEND — FULL REFERENCE
// ═════════════════════════════════════════════════════════════
//
// ── FollowupReportController.java ────────────────────────────
//
//   @RestController
//   @RequestMapping("/api/reports/followup")
//   @CrossOrigin(origins = "http://localhost:3000")
//   public class FollowupReportController {
//
//       @Autowired private FollowupReportService service;
//
//       // Get paginated tasks with all filters
//       @GetMapping("/tasks")
//       public ResponseEntity<FollowupTasksResponseDTO> getTasks(
//           @RequestParam(required = false)    String viewType,
//           @RequestParam(required = false)    String daysAhead,
//           @RequestParam(required = false)    Long   assignedTo,
//           @RequestParam(required = false)    String priority,
//           @RequestParam(required = false)    String reminderType,
//           @RequestParam(required = false)    String search,
//           @RequestParam(defaultValue = "25") int    perPage,
//           @RequestParam(defaultValue = "1")  int    page) {
//           return ResponseEntity.ok(service.getTasks(
//               viewType, daysAhead, assignedTo,
//               priority, reminderType, search, perPage, page));
//       }
//
//       // Get summary stats for 6 stat cards
//       @GetMapping("/summary")
//       public ResponseEntity<FollowupSummaryDTO> getSummary(
//           @RequestParam(required = false) Long   assignedTo,
//           @RequestParam(required = false) String priority,
//           @RequestParam(required = false) String reminderType) {
//           return ResponseEntity.ok(
//               service.getSummary(assignedTo, priority, reminderType));
//       }
//
//       // Mark single task as completed
//       @PatchMapping("/tasks/{id}/complete")
//       public ResponseEntity<FollowupTaskDTO> markComplete(
//           @PathVariable Long id) {
//           return ResponseEntity.ok(service.markComplete(id));
//       }
//
//       // Bulk mark tasks as completed
//       @PatchMapping("/tasks/bulk-complete")
//       public ResponseEntity<BulkCompleteResponseDTO> bulkComplete(
//           @RequestBody BulkCompleteRequest request) {
//           return ResponseEntity.ok(
//               service.bulkComplete(request.getIds()));
//       }
//
//       // Export all filtered tasks as CSV
//       @GetMapping("/export/csv")
//       public ResponseEntity<byte[]> exportCsv(
//           @RequestParam(required = false) String viewType,
//           @RequestParam(required = false) String daysAhead,
//           @RequestParam(required = false) Long   assignedTo,
//           @RequestParam(required = false) String priority,
//           @RequestParam(required = false) String reminderType,
//           @RequestParam(required = false) String search) {
//           byte[] csv = service.exportCsv(
//               viewType, daysAhead, assignedTo,
//               priority, reminderType, search);
//           return ResponseEntity.ok()
//               .header("Content-Disposition",
//                   "attachment; filename=followup-report.csv")
//               .contentType(MediaType.parseMediaType("text/csv"))
//               .body(csv);
//       }
//   }
//
// ── FollowupReportService.java ────────────────────────────────
//
//   @Service
//   public class FollowupReportService {
//
//       @Autowired private ReminderRepository    repo;
//       @Autowired private LeadRepository        leadRepo;
//
//       public FollowupTasksResponseDTO getTasks(
//               String viewType, String daysAhead, Long assignedTo,
//               String priority, String reminderType,
//               String search, int perPage, int page) {
//
//           LocalDateTime now   = LocalDateTime.now();
//           LocalDateTime from  = null;
//           LocalDateTime to    = null;
//           Boolean completed   = null;
//
//           // Resolve viewType → date range + completed flag
//           if ("Overdue".equals(viewType)) {
//               to        = now;
//               completed = false;
//           } else if ("Due Today".equals(viewType)) {
//               from      = now.toLocalDate().atStartOfDay();
//               to        = now.toLocalDate().atTime(23, 59, 59);
//           } else if ("Completed".equals(viewType)) {
//               completed = true;
//           } else if ("Upcoming".equals(viewType)) {
//               from = now;
//               if (daysAhead != null && !daysAhead.equals("All")) {
//                   int days = Integer.parseInt(daysAhead.split(" ")[0]);
//                   to = now.plusDays(days);
//               }
//           }
//
//           Pageable pageable = PageRequest.of(page - 1, perPage,
//               Sort.by(Sort.Direction.ASC, "dueDate"));
//
//           Page<Reminder> result = repo.findWithFilters(
//               from, to, completed, assignedTo,
//               priority, reminderType, search, pageable);
//
//           List<FollowupTaskDTO> tasks = result.getContent()
//               .stream().map(this::toDTO)
//               .collect(Collectors.toList());
//
//           return new FollowupTasksResponseDTO(
//               tasks, result.getTotalElements(),
//               page, perPage, result.getTotalPages());
//       }
//
//       public FollowupSummaryDTO getSummary(
//               Long assignedTo, String priority, String reminderType) {
//           LocalDateTime now = LocalDateTime.now();
//           return new FollowupSummaryDTO(
//               repo.countFiltered(null, null, null, assignedTo, priority, reminderType, null),
//               repo.countFiltered(null, now,  false, assignedTo, priority, reminderType, null),
//               repo.countFiltered(now.toLocalDate().atStartOfDay(),
//                                  now.toLocalDate().atTime(23, 59, 59),
//                                  false, assignedTo, priority, reminderType, null),
//               repo.countFiltered(now, now.plusDays(3), false,
//                                  assignedTo, priority, reminderType, null),
//               repo.countFiltered(now, null, false,
//                                  assignedTo, priority, reminderType, null),
//               repo.countByPriority(assignedTo, "High", reminderType)
//           );
//       }
//
//       public FollowupTaskDTO markComplete(Long id) {
//           Reminder r = repo.findById(id)
//               .orElseThrow(() -> new ResponseStatusException(
//                   HttpStatus.NOT_FOUND, "Reminder not found"));
//           r.setCompleted(true);
//           r.setCompletedAt(LocalDateTime.now());
//           return toDTO(repo.save(r));
//       }
//
//       public BulkCompleteResponseDTO bulkComplete(List<Long> ids) {
//           int completed = 0, failed = 0;
//           for (Long id : ids) {
//               try {
//                   markComplete(id);
//                   completed++;
//               } catch (Exception e) { failed++; }
//           }
//           return new BulkCompleteResponseDTO(completed, failed,
//               completed + " tasks marked as completed.");
//       }
//
//       public byte[] exportCsv(String viewType, String daysAhead,
//               Long assignedTo, String priority,
//               String reminderType, String search) {
//           FollowupTasksResponseDTO all = getTasks(
//               viewType, daysAhead, assignedTo, priority,
//               reminderType, search, Integer.MAX_VALUE, 1);
//
//           StringBuilder csv = new StringBuilder();
//           csv.append("ID,Due Date,Due Time,Overdue By,Lead Name,Phone,Temperature,"
//               + "Assigned To,Type,Priority,Title,Description,Lead Stage,Travel Date,Completed\n");
//
//           DateTimeFormatter dateFmt = DateTimeFormatter.ofPattern("MMM dd, yyyy");
//           DateTimeFormatter timeFmt = DateTimeFormatter.ofPattern("HH:mm");
//
//           for (FollowupTaskDTO t : all.getTasks()) {
//               csv.append(String.format(
//                   "%d,%s,%s,%s,%s,%s,%s,%s,%s,%s,\"%s\",\"%s\",%s,%s,%s\n",
//                   t.getId(), t.getDueDate(), t.getDueTime(),
//                   t.getOverdueBy(), t.getLeadName(), t.getLeadPhone(),
//                   t.getLeadTemp(), t.getAssignedTo(), t.getType(),
//                   t.getPriority(),
//                   t.getTitle().replace("\"", "\"\""),
//                   t.getDesc().replace("\"", "\"\""),
//                   t.getStage(), t.getTravelDate(), t.isCompleted()
//               ));
//           }
//           return csv.toString().getBytes(StandardCharsets.UTF_8);
//       }
//
//       private FollowupTaskDTO toDTO(Reminder r) {
//           DateTimeFormatter dateFmt = DateTimeFormatter.ofPattern("MMM dd, yyyy");
//           DateTimeFormatter timeFmt = DateTimeFormatter.ofPattern("HH:mm");
//           LocalDateTime now = LocalDateTime.now();
//           long daysDiff = ChronoUnit.DAYS.between(r.getDueDate().toLocalDate(), now.toLocalDate());
//           String overdueBy = daysDiff > 0
//               ? "Overdue by " + daysDiff + " day" + (daysDiff > 1 ? "s" : "")
//               : "Upcoming";
//           FollowupTaskDTO dto = new FollowupTaskDTO();
//           dto.setId(r.getId());
//           dto.setDueDate(r.getDueDate().format(dateFmt));
//           dto.setDueTime(r.getDueDate().format(timeFmt));
//           dto.setOverdueBy(overdueBy);
//           dto.setLeadName(r.getLead().getName());
//           dto.setLeadPhone(r.getLead().getPhone());
//           dto.setLeadTemp(r.getLead().getTemperature());
//           dto.setAssignedTo(r.getAssignedUser().getFullName());
//           dto.setAssignedUsername("@" + r.getAssignedUser().getUsername());
//           dto.setAssignedUserId(r.getAssignedUser().getId());
//           dto.setType(r.getReminderType());
//           dto.setPriority(r.getPriority());
//           dto.setTitle(r.getTitle());
//           dto.setDesc(r.getDescription());
//           dto.setStage(r.getLead().getStage());
//           dto.setTravelDate(r.getLead().getTravelDate() != null
//               ? r.getLead().getTravelDate().format(DateTimeFormatter.ofPattern("MMM dd"))
//               : "N/A");
//           dto.setCompleted(r.isCompleted());
//           return dto;
//       }
//   }
//
// ── ReminderRepository.java (followup queries) ────────────────
//
//   @Repository
//   public interface ReminderRepository extends JpaRepository<Reminder, Long> {
//
//       @Query("SELECT r FROM Reminder r JOIN r.lead l JOIN r.assignedUser u WHERE " +
//              "(:from      IS NULL OR r.dueDate >= :from)             " +
//              "AND (:to        IS NULL OR r.dueDate <= :to)           " +
//              "AND (:completed IS NULL OR r.completed = :completed)   " +
//              "AND (:userId    IS NULL OR u.id = :userId)             " +
//              "AND (:priority  IS NULL OR r.priority = :priority)     " +
//              "AND (:type      IS NULL OR r.reminderType = :type)     " +
//              "AND (:search    IS NULL OR LOWER(l.name) LIKE LOWER(CONCAT('%',:search,'%')) " +
//              "     OR LOWER(r.title) LIKE LOWER(CONCAT('%',:search,'%'))  " +
//              "     OR LOWER(u.fullName) LIKE LOWER(CONCAT('%',:search,'%')))")
//       Page<Reminder> findWithFilters(
//           @Param("from")      LocalDateTime from,
//           @Param("to")        LocalDateTime to,
//           @Param("completed") Boolean completed,
//           @Param("userId")    Long userId,
//           @Param("priority")  String priority,
//           @Param("type")      String type,
//           @Param("search")    String search,
//           Pageable pageable);
//
//       @Query("SELECT COUNT(r) FROM Reminder r JOIN r.assignedUser u WHERE " +
//              "(:from      IS NULL OR r.dueDate >= :from)             " +
//              "AND (:to        IS NULL OR r.dueDate <= :to)           " +
//              "AND (:completed IS NULL OR r.completed = :completed)   " +
//              "AND (:userId    IS NULL OR u.id = :userId)             " +
//              "AND (:priority  IS NULL OR r.priority = :priority)     " +
//              "AND (:type      IS NULL OR r.reminderType = :type)     " +
//              "AND (:search    IS NULL OR LOWER(r.title) LIKE LOWER(CONCAT('%',:search,'%')))")
//       long countFiltered(
//           @Param("from")      LocalDateTime from,
//           @Param("to")        LocalDateTime to,
//           @Param("completed") Boolean completed,
//           @Param("userId")    Long userId,
//           @Param("priority")  String priority,
//           @Param("type")      String type,
//           @Param("search")    String search);
//
//       @Query("SELECT COUNT(r) FROM Reminder r JOIN r.assignedUser u WHERE " +
//              "r.priority = :priority " +
//              "AND (:userId IS NULL OR u.id = :userId) " +
//              "AND (:type   IS NULL OR r.reminderType = :type) " +
//              "AND r.completed = false")
//       long countByPriority(
//           @Param("userId")   Long userId,
//           @Param("priority") String priority,
//           @Param("type")     String type);
//   }
//
// ── Reminder.java (Entity — relevant columns) ─────────────────
//
//   @Entity
//   @Table(name = "reminders")
//   public class Reminder {
//       @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
//       private Long id;
//
//       @ManyToOne(fetch = FetchType.LAZY)
//       @JoinColumn(name = "lead_id", nullable = false)
//       private Lead lead;
//
//       @ManyToOne(fetch = FetchType.LAZY)
//       @JoinColumn(name = "assigned_user_id")
//       private User assignedUser;
//
//       @Column(name = "due_date", nullable = false)
//       private LocalDateTime dueDate;
//
//       @Column(name = "reminder_type", length = 50)
//       private String reminderType;   // First Contact | Follow Up | Payment Reminder | ...
//
//       @Column(name = "priority", length = 20)
//       private String priority;       // High | Medium | Low
//
//       @Column(name = "title", length = 255)
//       private String title;
//
//       @Column(name = "description", columnDefinition = "TEXT")
//       private String description;
//
//       @Column(name = "completed")
//       private boolean completed = false;
//
//       @Column(name = "completed_at")
//       private LocalDateTime completedAt;
//
//       @Column(name = "created_at")
//       private LocalDateTime createdAt;
//
//       @PrePersist
//       protected void onCreate() { createdAt = LocalDateTime.now(); }
//       // getters + setters or @Data (Lombok)
//   }
//
// ── FollowupTaskDTO.java ──────────────────────────────────────
//
//   public class FollowupTaskDTO {
//       private Long    id;
//       private String  dueDate;          // "Jun 01, 2026"
//       private String  dueTime;          // "20:07"
//       private String  overdueBy;        // "Overdue by 21 days" | "Upcoming"
//       private String  leadName;
//       private String  leadPhone;
//       private String  leadTemp;         // Hot | Warm | Cold | Fresh
//       private String  assignedTo;       // full name
//       private String  assignedUsername; // "@deepti_paul"
//       private Long    assignedUserId;
//       private String  type;             // reminder type
//       private String  priority;         // High | Medium | Low
//       private String  title;
//       private String  desc;
//       private String  stage;            // lead stage
//       private String  travelDate;       // "Jul 07"
//       private boolean completed;
//       // getters + setters or @Data (Lombok)
//   }
//
// ── FollowupTasksResponseDTO.java ─────────────────────────────
//
//   public class FollowupTasksResponseDTO {
//       private List<FollowupTaskDTO> tasks;
//       private long total;
//       private int  page;
//       private int  perPage;
//       private int  totalPages;
//       // constructor + getters
//   }
//
// ── FollowupSummaryDTO.java ───────────────────────────────────
//
//   public class FollowupSummaryDTO {
//       private long totalFollowups;
//       private long overdue;
//       private long dueToday;
//       private long urgent;         // due within 3 days
//       private long upcoming;
//       private long highPriority;
//       // constructor + getters
//   }
//
// ── BulkCompleteRequest.java ──────────────────────────────────
//
//   public class BulkCompleteRequest {
//       private List<Long> ids;
//       // getters + setters
//   }
//
// ── BulkCompleteResponseDTO.java ─────────────────────────────
//
//   public class BulkCompleteResponseDTO {
//       private int    completed;
//       private int    failed;
//       private String message;
//       // constructor + getters
//   }
//
// ─────────────────────────────────────────────────────────────
// ── PostgreSQL Schema (reminders table — relevant columns) ────
//
//   CREATE TABLE reminders (
//     id               BIGSERIAL     PRIMARY KEY,
//     lead_id          BIGINT        NOT NULL REFERENCES leads(id)  ON DELETE CASCADE,
//     assigned_user_id BIGINT        REFERENCES users(id)           ON DELETE SET NULL,
//     due_date         TIMESTAMP     NOT NULL,
//     reminder_type    VARCHAR(50)   NOT NULL,
//     priority         VARCHAR(20)   NOT NULL DEFAULT 'Medium',
//     title            VARCHAR(255)  NOT NULL,
//     description      TEXT,
//     completed        BOOLEAN       DEFAULT FALSE,
//     completed_at     TIMESTAMP,
//     created_at       TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
//
//     CONSTRAINT chk_priority     CHECK (priority IN ('High','Medium','Low')),
//     CONSTRAINT chk_reminder_type CHECK (reminder_type IN (
//       'First Contact','Follow Up','Payment Reminder',
//       'Document Collection','Booking Confirmation','Custom'))
//   );
//
//   -- Indexes for fast filtering and sorting
//   CREATE INDEX idx_rem_due_date   ON reminders (due_date ASC);
//   CREATE INDEX idx_rem_completed  ON reminders (completed);
//   CREATE INDEX idx_rem_lead_id    ON reminders (lead_id);
//   CREATE INDEX idx_rem_assigned   ON reminders (assigned_user_id);
//   CREATE INDEX idx_rem_priority   ON reminders (priority);
//   CREATE INDEX idx_rem_type       ON reminders (reminder_type);
//
//   -- Composite index for most common filter combo
//   CREATE INDEX idx_rem_filter
//     ON reminders (due_date ASC, completed, priority, reminder_type);
//
// ── application.properties ───────────────────────────────────
//   spring.datasource.url=jdbc:postgresql://localhost:5432/travel_crm
//   spring.datasource.username=postgres
//   spring.datasource.password=yourpassword
//   spring.datasource.driver-class-name=org.postgresql.Driver
//   spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
//   spring.jpa.hibernate.ddl-auto=update
//   server.port=8080
//
// ── .env (React) ──────────────────────────────────────────────
//   REACT_APP_API_URL=http://localhost:8080
// ─────────────────────────────────────────────────────────────