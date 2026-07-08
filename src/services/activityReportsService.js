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
// ─────────────────────────────────────────────────────────────