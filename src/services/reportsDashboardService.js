// src/services/reportsDashboardService.js
// ─────────────────────────────────────────────────────────────
// Reports Dashboard Page — API Service
// Page: ReportsDashboard.jsx
// Backend: Java Spring Boot REST API
// Database: PostgreSQL
// Covers:
//   1. Summary stats (stat cards)
//   2. Activity Reports
//   3. Geographic Distribution
//   4. Follow-up Reports
//   5. Booking Revenue Analysis
//   6. Travel Date Analysis
//   7. International vs Domestic
//   8. Export all reports
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
  timeout: 30000, // reports can take longer
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

// ── PERIOD QUERY HELPER ───────────────────────────────────────
// Maps frontend filter IDs to backend query params
// today | week | month | quarter | year | custom
const buildPeriodParams = (period, customFrom, customTo) => {
  const params = { period };
  if (period === "custom" && customFrom && customTo) {
    params.from = customFrom;  // "2026-01-01"
    params.to   = customTo;    // "2026-06-30"
  }
  return params;
};


// ═════════════════════════════════════════════════════════════
// REPORTS DASHBOARD SERVICE
// Spring Boot Controller: /api/reports
// ═════════════════════════════════════════════════════════════
const reportsDashboardService = {

  // ── GET DASHBOARD SUMMARY (stat cards) ────────────────────
  // GET /api/reports/summary?period=month
  // @GetMapping("/api/reports/summary")
  // public ResponseEntity<ReportSummaryDTO> getSummary(
  //     @RequestParam(defaultValue = "month") String period)
  //
  // Response:
  // {
  //   totalReports:    6,
  //   activeUsers:     5,
  //   thisMonthLeads:  313,
  //   revenueTracked:  0.0,    // INR
  //   period:          "month",
  //   generatedAt:     "Jun 22, 2026 10:22 AM"
  // }
  getSummary: (period = "month") => {
    return api.get("/api/reports/summary", {
      params: buildPeriodParams(period),
    });
  },

  // ── GET ACTIVITY REPORTS ───────────────────────────────────
  // GET /api/reports/activity?period=month
  // @GetMapping("/api/reports/activity")
  // public ResponseEntity<ActivityReportDTO> getActivityReport(
  //     @RequestParam(defaultValue = "month") String period)
  //
  // Response:
  // {
  //   totalActivities: 150,
  //   loginCount:      45,
  //   pageViews:       320,
  //   actionsPerformed:85,
  //   timeline: [
  //     { date: "2026-06-01", logins: 5, actions: 12 },
  //     ...
  //   ],
  //   topUsers: [
  //     { userId: 34, username: "Shreyash_Shahi", activityCount: 50 },
  //     ...
  //   ]
  // }
  getActivityReport: (period = "month", customFrom, customTo) => {
    return api.get("/api/reports/activity", {
      params: buildPeriodParams(period, customFrom, customTo),
    });
  },

  // ── GET GEOGRAPHIC DISTRIBUTION ────────────────────────────
  // GET /api/reports/geographic?period=month
  // @GetMapping("/api/reports/geographic")
  // public ResponseEntity<GeographicReportDTO> getGeographicReport(
  //     @RequestParam(defaultValue = "month") String period)
  //
  // Response:
  // {
  //   totalLeads: 313,
  //   topCities: [
  //     { city: "Gorakhpur", state: "Uttar Pradesh", count: 45, percentage: 14.4 },
  //     { city: "Mumbai",    state: "Maharashtra",   count: 38, percentage: 12.1 },
  //     ...
  //   ],
  //   topDestinations: [
  //     { destination: "Nepal", count: 120, percentage: 38.3 },
  //     { destination: "Kerala",count: 85,  percentage: 27.2 },
  //     ...
  //   ],
  //   stateBreakdown: [
  //     { state: "Uttar Pradesh", count: 89, percentage: 28.4 },
  //     ...
  //   ]
  // }
  getGeographicReport: (period = "month", customFrom, customTo) => {
    return api.get("/api/reports/geographic", {
      params: buildPeriodParams(period, customFrom, customTo),
    });
  },

  // ── GET FOLLOW-UP REPORTS ──────────────────────────────────
  // GET /api/reports/followup?period=month
  // @GetMapping("/api/reports/followup")
  // public ResponseEntity<FollowupReportDTO> getFollowupReport(
  //     @RequestParam(defaultValue = "month") String period)
  //
  // Response:
  // {
  //   totalFollowups:    50,
  //   upcomingFollowups: 20,
  //   overdueFollowups:  8,
  //   completedFollowups:22,
  //   followups: [
  //     {
  //       id: 1, leadName: "Ramesh Kumar", phone: "+91 98765 43210",
  //       dueDate: "Jun 23, 2026 10:00 AM", status: "Pending",
  //       assignedTo: "Shreyash_Shahi", priority: "High"
  //     },
  //     ...
  //   ]
  // }
  getFollowupReport: (period = "month", customFrom, customTo) => {
    return api.get("/api/reports/followup", {
      params: buildPeriodParams(period, customFrom, customTo),
    });
  },

  // ── GET BOOKING REVENUE ANALYSIS ───────────────────────────
  // GET /api/reports/revenue?period=month
  // @GetMapping("/api/reports/revenue")
  // public ResponseEntity<RevenueReportDTO> getRevenueReport(
  //     @RequestParam(defaultValue = "month") String period)
  //
  // Response:
  // {
  //   totalRevenue:   150000.00,
  //   totalProfit:    45000.00,
  //   totalBookings:  25,
  //   avgBookingValue:6000.00,
  //   currency:       "INR",
  //   revenueTimeline: [
  //     { date: "2026-06-01", revenue: 12000.00, bookings: 2 },
  //     ...
  //   ],
  //   revenueByCategory: [
  //     { category: "International", revenue: 90000.00, percentage: 60.0 },
  //     { category: "Domestic",      revenue: 60000.00, percentage: 40.0 }
  //   ]
  // }
  getRevenueReport: (period = "month", customFrom, customTo) => {
    return api.get("/api/reports/revenue", {
      params: buildPeriodParams(period, customFrom, customTo),
    });
  },

  // ── GET TRAVEL DATE ANALYSIS ───────────────────────────────
  // GET /api/reports/travel-dates?period=month
  // @GetMapping("/api/reports/travel-dates")
  // public ResponseEntity<TravelDateReportDTO> getTravelDateReport(
  //     @RequestParam(defaultValue = "month") String period)
  //
  // Response:
  // {
  //   totalBookings:   25,
  //   peakMonth:       "December",
  //   peakDay:         "Saturday",
  //   avgLeadDays:     14,
  //   bookingsByMonth: [
  //     { month: "Jan 2026", bookings: 3 },
  //     { month: "Feb 2026", bookings: 5 },
  //     ...
  //   ],
  //   bookingsByDayOfWeek: [
  //     { day: "Monday",    bookings: 2 },
  //     { day: "Saturday",  bookings: 8 },
  //     ...
  //   ],
  //   upcomingDepartures: [
  //     { leadName: "Ramesh Kumar", travelDate: "Jul 15, 2026", destination: "Nepal" },
  //     ...
  //   ]
  // }
  getTravelDateReport: (period = "month", customFrom, customTo) => {
    return api.get("/api/reports/travel-dates", {
      params: buildPeriodParams(period, customFrom, customTo),
    });
  },

  // ── GET INTERNATIONAL VS DOMESTIC ─────────────────────────
  // GET /api/reports/international-domestic?period=month
  // @GetMapping("/api/reports/international-domestic")
  // public ResponseEntity<IntlDomesticReportDTO> getIntlDomesticReport(
  //     @RequestParam(defaultValue = "month") String period)
  //
  // Response:
  // {
  //   totalLeads:           313,
  //   internationalLeads:   189,
  //   domesticLeads:        124,
  //   internationalRevenue: 90000.00,
  //   domesticRevenue:      60000.00,
  //   topInternationalDest: ["Nepal", "Thailand", "Singapore", "Dubai"],
  //   topDomesticDest:      ["Kerala", "Goa", "Rajasthan", "Manali"],
  //   comparison: [
  //     { month: "Jan 2026", international: 12, domestic: 8 },
  //     ...
  //   ]
  // }
  getIntlDomesticReport: (period = "month", customFrom, customTo) => {
    return api.get("/api/reports/international-domestic", {
      params: buildPeriodParams(period, customFrom, customTo),
    });
  },

  // ── EXPORT ALL REPORTS ─────────────────────────────────────
  // GET /api/reports/export?period=month&format=pdf
  // @GetMapping("/api/reports/export")
  // public ResponseEntity<byte[]> exportAllReports(
  //     @RequestParam(defaultValue = "month") String period,
  //     @RequestParam(defaultValue = "pdf")   String format)
  //
  // format: "pdf" | "excel" | "csv"
  // Response: binary file download (PDF / XLSX / CSV)
  //
  // Usage:
  //   const response = await reportsDashboardService.exportAll("month", "pdf");
  //   const url = window.URL.createObjectURL(new Blob([response.data]));
  //   const link = document.createElement("a");
  //   link.href = url;
  //   link.setAttribute("download", "reports.pdf");
  //   document.body.appendChild(link);
  //   link.click();
  exportAll: (period = "month", format = "pdf") => {
    return api.get("/api/reports/export", {
      params: { period, format },
      responseType: "blob",  // important for file download
    });
  },

  // ── EXPORT SINGLE REPORT ───────────────────────────────────
  // GET /api/reports/{reportType}/export?period=month&format=excel
  // @GetMapping("/api/reports/{reportType}/export")
  // public ResponseEntity<byte[]> exportReport(
  //     @PathVariable String reportType,
  //     @RequestParam(defaultValue = "month") String period,
  //     @RequestParam(defaultValue = "excel") String format)
  //
  // reportType: "activity" | "geographic" | "followup" |
  //             "revenue"  | "travel-dates" | "international-domestic"
  exportSingle: (reportType, period = "month", format = "excel") => {
    return api.get(`/api/reports/${reportType}/export`, {
      params: { period, format },
      responseType: "blob",
    });
  },
};

export default reportsDashboardService;


// ═════════════════════════════════════════════════════════════
// HOW TO USE IN ReportsDashboard.jsx
// ═════════════════════════════════════════════════════════════
//
// STEP 1 — Import at top of ReportsDashboard.jsx:
//   import reportsDashboardService
//     from "../services/reportsDashboardService";
//
// ─────────────────────────────────────────────────────────────
// STEP 2 — Replace mock useEffect with real API:
//
//   const [summary, setSummary] = useState(null);
//
//   useEffect(() => {
//     setLoading(true);
//     reportsDashboardService
//       .getSummary(activeFilter)
//       .then((res) => setSummary(res.data))
//       .catch(() => showToast("Failed to load report data.", "error"))
//       .finally(() => setLoading(false));
//   }, [activeFilter]);
//
//   // Then bind stat card values from summary:
//   // value: summary?.totalReports  || 6
//   // value: summary?.activeUsers   || 0
//   // value: summary?.thisMonthLeads|| 0
//   // value: `₹${summary?.revenueTracked || 0}`
//
// ─────────────────────────────────────────────────────────────
// STEP 3 — Replace handleRefresh:
//
//   const handleRefresh = async () => {
//     setLoading(true);
//     try {
//       const res = await reportsDashboardService.getSummary(activeFilter);
//       setSummary(res.data);
//       showToast("Reports refreshed.");
//     } catch {
//       showToast("Failed to refresh.", "error");
//     } finally {
//       setLoading(false);
//     }
//   };
//
// ─────────────────────────────────────────────────────────────
// STEP 4 — Replace "Export All" button handler:
//
//   const handleExportAll = async () => {
//     try {
//       const res = await reportsDashboardService.exportAll(activeFilter, "pdf");
//       const url  = window.URL.createObjectURL(new Blob([res.data]));
//       const link = document.createElement("a");
//       link.href  = url;
//       link.setAttribute("download", `reports-${activeFilter}.pdf`);
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//       window.URL.revokeObjectURL(url);
//       showToast("Reports exported as PDF.");
//     } catch {
//       showToast("Export failed. Try again.", "error");
//     }
//   };
//
// ─────────────────────────────────────────────────────────────
// STEP 5 — Connect "View Reports" button (handleView):
//
//   const handleView = (card) => {
//     // Navigate to individual report page
//     navigate(card.path);
//     // Each report page fetches its own data using:
//     // reportsDashboardService.getActivityReport(period)
//     // reportsDashboardService.getGeographicReport(period)
//     // etc.
//   };
//
// ═════════════════════════════════════════════════════════════
// SPRING BOOT JAVA BACKEND — FULL REFERENCE
// ═════════════════════════════════════════════════════════════
//
// ── ReportController.java ─────────────────────────────────────
//
//   @RestController
//   @RequestMapping("/api/reports")
//   @CrossOrigin(origins = "http://localhost:3000")
//   public class ReportController {
//
//       @Autowired private ReportService service;
//
//       @GetMapping("/summary")
//       public ResponseEntity<ReportSummaryDTO> getSummary(
//           @RequestParam(defaultValue = "month") String period) {
//           return ResponseEntity.ok(service.getSummary(period));
//       }
//
//       @GetMapping("/activity")
//       public ResponseEntity<ActivityReportDTO> getActivity(
//           @RequestParam(defaultValue = "month") String period,
//           @RequestParam(required = false) String from,
//           @RequestParam(required = false) String to) {
//           return ResponseEntity.ok(service.getActivityReport(period, from, to));
//       }
//
//       @GetMapping("/geographic")
//       public ResponseEntity<GeographicReportDTO> getGeographic(
//           @RequestParam(defaultValue = "month") String period,
//           @RequestParam(required = false) String from,
//           @RequestParam(required = false) String to) {
//           return ResponseEntity.ok(service.getGeographicReport(period, from, to));
//       }
//
//       @GetMapping("/followup")
//       public ResponseEntity<FollowupReportDTO> getFollowup(
//           @RequestParam(defaultValue = "month") String period,
//           @RequestParam(required = false) String from,
//           @RequestParam(required = false) String to) {
//           return ResponseEntity.ok(service.getFollowupReport(period, from, to));
//       }
//
//       @GetMapping("/revenue")
//       public ResponseEntity<RevenueReportDTO> getRevenue(
//           @RequestParam(defaultValue = "month") String period,
//           @RequestParam(required = false) String from,
//           @RequestParam(required = false) String to) {
//           return ResponseEntity.ok(service.getRevenueReport(period, from, to));
//       }
//
//       @GetMapping("/travel-dates")
//       public ResponseEntity<TravelDateReportDTO> getTravelDates(
//           @RequestParam(defaultValue = "month") String period,
//           @RequestParam(required = false) String from,
//           @RequestParam(required = false) String to) {
//           return ResponseEntity.ok(service.getTravelDateReport(period, from, to));
//       }
//
//       @GetMapping("/international-domestic")
//       public ResponseEntity<IntlDomesticReportDTO> getIntlDomestic(
//           @RequestParam(defaultValue = "month") String period,
//           @RequestParam(required = false) String from,
//           @RequestParam(required = false) String to) {
//           return ResponseEntity.ok(service.getIntlDomesticReport(period, from, to));
//       }
//
//       @GetMapping("/export")
//       public ResponseEntity<byte[]> exportAll(
//           @RequestParam(defaultValue = "month") String period,
//           @RequestParam(defaultValue = "pdf")   String format) {
//           byte[] data = service.exportAll(period, format);
//           String contentType = "pdf".equals(format)
//               ? "application/pdf"
//               : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
//           return ResponseEntity.ok()
//               .header("Content-Disposition",
//                   "attachment; filename=reports-" + period + "." + format)
//               .contentType(MediaType.parseMediaType(contentType))
//               .body(data);
//       }
//
//       @GetMapping("/{reportType}/export")
//       public ResponseEntity<byte[]> exportSingle(
//           @PathVariable String reportType,
//           @RequestParam(defaultValue = "month") String period,
//           @RequestParam(defaultValue = "excel") String format) {
//           byte[] data = service.exportSingle(reportType, period, format);
//           return ResponseEntity.ok()
//               .header("Content-Disposition",
//                   "attachment; filename=" + reportType + "-" + period + "." + format)
//               .contentType(MediaType.parseMediaType(
//                   "excel".equals(format)
//                       ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//                       : "text/csv"))
//               .body(data);
//       }
//   }
//
// ── ReportService.java — period helper ────────────────────────
//
//   @Service
//   public class ReportService {
//
//       @Autowired private LeadRepository        leadRepo;
//       @Autowired private BookingRepository     bookingRepo;
//       @Autowired private ReminderRepository    reminderRepo;
//       @Autowired private UserRepository        userRepo;
//
//       // Resolve period string → LocalDate range
//       private LocalDate[] resolvePeriod(String period, String from, String to) {
//           LocalDate today = LocalDate.now();
//           return switch (period) {
//               case "today"   -> new LocalDate[]{ today, today };
//               case "week"    -> new LocalDate[]{ today.with(DayOfWeek.MONDAY), today };
//               case "month"   -> new LocalDate[]{ today.withDayOfMonth(1), today };
//               case "quarter" -> {
//                   int q = (today.getMonthValue() - 1) / 3;
//                   LocalDate start = today.withMonth(q * 3 + 1).withDayOfMonth(1);
//                   yield new LocalDate[]{ start, today };
//               }
//               case "year"    -> new LocalDate[]{ today.withDayOfYear(1), today };
//               case "custom"  -> new LocalDate[]{
//                   LocalDate.parse(from), LocalDate.parse(to)
//               };
//               default        -> new LocalDate[]{ today.withDayOfMonth(1), today };
//           };
//       }
//
//       public ReportSummaryDTO getSummary(String period) {
//           LocalDate[] range = resolvePeriod(period, null, null);
//           LocalDateTime from = range[0].atStartOfDay();
//           LocalDateTime to   = range[1].atTime(23, 59, 59);
//
//           return new ReportSummaryDTO(
//               6L,                                                     // totalReports (static count)
//               userRepo.countByStatus("Active"),                       // activeUsers
//               leadRepo.countByCreatedAtBetween(from, to),            // thisMonthLeads
//               bookingRepo.sumRevenueByDateBetween(from, to),         // revenueTracked
//               period,
//               LocalDateTime.now().format(DateTimeFormatter.ofPattern("MMM dd, yyyy hh:mm a"))
//           );
//       }
//
//       // ... other report methods follow same pattern
//   }
//
// ── ReportSummaryDTO.java ─────────────────────────────────────
//
//   public class ReportSummaryDTO {
//       private long   totalReports;
//       private long   activeUsers;
//       private long   thisMonthLeads;
//       private double revenueTracked;
//       private String period;
//       private String generatedAt;
//       // constructor + getters or @Data (Lombok)
//   }
//
// ─────────────────────────────────────────────────────────────
// ── PostgreSQL Queries used by ReportService ──────────────────
//
//   -- Activity report: logins + actions in date range
//   SELECT COUNT(*) FROM audit_logs
//   WHERE created_at BETWEEN :from AND :to;
//
//   -- Geographic: leads by city
//   SELECT city, COUNT(*) as count
//   FROM leads
//   WHERE created_at BETWEEN :from AND :to
//   GROUP BY city ORDER BY count DESC LIMIT 10;
//
//   -- Follow-up: reminders by status
//   SELECT status, COUNT(*) as count
//   FROM reminders
//   WHERE due_date BETWEEN :from AND :to
//   GROUP BY status;
//
//   -- Revenue: sum bookings
//   SELECT
//     SUM(total_amount) as revenue,
//     SUM(profit)       as profit,
//     COUNT(*)          as bookings
//   FROM bookings
//   WHERE travel_date BETWEEN :from AND :to
//     AND status != 'Cancelled';
//
//   -- Travel dates: bookings by month
//   SELECT
//     TO_CHAR(travel_date, 'Mon YYYY') as month,
//     COUNT(*) as bookings
//   FROM bookings
//   WHERE travel_date BETWEEN :from AND :to
//   GROUP BY TO_CHAR(travel_date, 'Mon YYYY'),
//            DATE_TRUNC('month', travel_date)
//   ORDER BY DATE_TRUNC('month', travel_date);
//
//   -- International vs Domestic: leads by type
//   SELECT
//     travel_type, COUNT(*) as count,
//     SUM(b.total_amount) as revenue
//   FROM leads l
//   LEFT JOIN bookings b ON b.lead_id = l.id
//   WHERE l.created_at BETWEEN :from AND :to
//   GROUP BY travel_type;
//
// ─────────────────────────────────────────────────────────────
// ── application.properties (PostgreSQL) ──────────────────────
//
//   spring.datasource.url=jdbc:postgresql://localhost:5432/travel_crm
//   spring.datasource.username=postgres
//   spring.datasource.password=yourpassword
//   spring.datasource.driver-class-name=org.postgresql.Driver
//   spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
//   spring.jpa.hibernate.ddl-auto=update
//   spring.jpa.show-sql=true
//   server.port=8080
//
//   # Export file size limit
//   spring.servlet.multipart.max-file-size=10MB
//
// ── .env (React) ──────────────────────────────────────────────
//   REACT_APP_API_URL=http://localhost:8080
// ─────────────────────────────────────────────────────────────