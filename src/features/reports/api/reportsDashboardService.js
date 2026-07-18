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

// Shared axios instance (baseURL ".../api", JWT from localStorage "token", 401 handling).
import api from "@shared/api/http";

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
    return api.get("/reports/summary", {
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
    return api.get("/reports/activity", {
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
    return api.get("/reports/geographic", {
      params: buildPeriodParams(period, customFrom, customTo),
    });
  },

  // ── FOLLOW-UP REPORTS ──────────────────────────────────────
  // No getFollowupReport here: the backend serves no bare GET /api/reports/followup.
  // FollowupReportController only maps /tasks, /summary, /tasks/{publicId}/complete,
  // /tasks/bulk-complete and /export/csv. Use followupReportService instead.

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
    return api.get("/reports/revenue", {
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
    return api.get("/reports/travel-dates", {
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
    return api.get("/reports/international-domestic", {
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
    return api.get("/reports/export", {
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
    return api.get(`/reports/${reportType}/export`, {
      params: { period, format },
      responseType: "blob",
    });
  },
};

export default reportsDashboardService;
// ─────────────────────────────────────────────────────────────
