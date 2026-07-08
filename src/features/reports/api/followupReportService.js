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
    const token = localStorage.getItem("token");
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
      localStorage.removeItem("token");
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
// ─────────────────────────────────────────────────────────────