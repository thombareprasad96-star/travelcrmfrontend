// src/services/travelDateAnalysisService.js
// ─────────────────────────────────────────────────────────────
// Travel Date Analysis Page — API Service
// Page: TravelDateAnalysis.jsx
// Backend: Java Spring Boot REST API
// Database: PostgreSQL
// Covers:
//   - Get summary stats (4 hero stat cards)
//   - Get trend data (bar chart: bookings + revenue per period)
//   - Get peak travel dates (right sidebar)
//   - Get monthly/weekly/daily/quarterly analysis (table)
//   - Get trip duration breakdown (right sidebar)
//   - Export CSV
// ─────────────────────────────────────────────────────────────

// Shared axios instance (baseURL ".../api", JWT from localStorage "token", 401 handling).
import api from "@shared/api/http";

// ── FILTER PARAMS BUILDER ─────────────────────────────────────
// Strips default/empty values before sending to backend
const buildParams = (filters = {}) => {
  const params = {};
  if (filters.startDate    && filters.startDate    !== "")             params.startDate    = filters.startDate;
  if (filters.endDate      && filters.endDate      !== "")             params.endDate      = filters.endDate;
  if (filters.analysisType && filters.analysisType !== "Monthly")      params.analysisType = filters.analysisType;
  if (filters.bookingType  && filters.bookingType  !== "All Types")    params.bookingType  = filters.bookingType;
  if (filters.status       && filters.status       !== "All Statuses") params.status       = filters.status;
  if (filters.page)    params.page    = filters.page;
  if (filters.perPage) params.perPage = filters.perPage;
  return params;
};


// ═════════════════════════════════════════════════════════════
// TRAVEL DATE ANALYSIS SERVICE
// Spring Boot Controller: /api/reports/travel-dates
// PostgreSQL Tables: bookings, customers
// ═════════════════════════════════════════════════════════════
const travelDateAnalysisService = {

  // ── GET SUMMARY STATS (4 hero stat cards) ─────────────────
  // GET /api/reports/travel-dates/summary
  // @GetMapping("/api/reports/travel-dates/summary")
  // public ResponseEntity<TravelSummaryDTO> getSummary(
  //     @RequestParam(required = false) String startDate,
  //     @RequestParam(required = false) String endDate,
  //     @RequestParam(required = false) String bookingType,
  //     @RequestParam(required = false) String status)
  //
  // Response:
  // {
  //   totalBookings:  57,
  //   totalTravelers: 160,
  //   avgPerPeriod:   7.1,   // avg bookings per month/week/day
  //   totalRevenue:   1149501.00
  // }
  getSummary: (filters = {}) => {
    const params = {};
    if (filters.startDate   && filters.startDate   !== "")             params.startDate   = filters.startDate;
    if (filters.endDate     && filters.endDate     !== "")             params.endDate     = filters.endDate;
    if (filters.bookingType && filters.bookingType !== "All Types")    params.bookingType = filters.bookingType;
    if (filters.status      && filters.status      !== "All Statuses") params.status      = filters.status;
    return api.get("/reports/travel-dates/summary", { params });
  },

  // ── GET TREND DATA (chart: bookings + revenue per period) ──
  // GET /api/reports/travel-dates/trends
  // @GetMapping("/api/reports/travel-dates/trends")
  // public ResponseEntity<List<TrendDataDTO>> getTrends(
  //     @RequestParam(required = false)            String startDate,
  //     @RequestParam(required = false)            String endDate,
  //     @RequestParam(defaultValue = "Monthly")    String analysisType,
  //     @RequestParam(required = false)            String bookingType,
  //     @RequestParam(required = false)            String status)
  //
  // analysisType values:
  //   "Monthly"   → GROUP BY TO_CHAR(travel_date, 'Mon YYYY')
  //   "Weekly"    → GROUP BY DATE_TRUNC('week', travel_date)
  //   "Daily"     → GROUP BY travel_date::date
  //   "Quarterly" → GROUP BY TO_CHAR(travel_date, '"Q"Q YYYY')
  //
  // Response:
  // [
  //   { month:"Jan 2026", bookings:3,  travelers:8,  revenue:45000.00,  avgDuration:7  },
  //   { month:"Feb 2026", bookings:5,  travelers:14, revenue:87500.00,  avgDuration:6  },
  //   ...
  // ]
  // Note: "month" field holds the period label regardless of analysisType
  getTrends: (filters = {}) => {
    return api.get("/reports/travel-dates/trends", {
      params: buildParams(filters),
    });
  },

  // ── GET PEAK TRAVEL DATES ──────────────────────────────────
  // GET /api/reports/travel-dates/peak-dates
  // @GetMapping("/api/reports/travel-dates/peak-dates")
  // public ResponseEntity<List<PeakDateDTO>> getPeakDates(
  //     @RequestParam(required = false) String startDate,
  //     @RequestParam(required = false) String endDate,
  //     @RequestParam(required = false) String bookingType,
  //     @RequestParam(required = false) String status,
  //     @RequestParam(defaultValue = "5") int   topN)
  //
  // Returns the top N travel dates with highest booking counts
  //
  // Response:
  // [
  //   { date:"Jul 15, 2026", bookings:4, label:"Peak"    },
  //   { date:"Aug 10, 2026", bookings:6, label:"Peak"    },
  //   { date:"Dec 25, 2026", bookings:8, label:"Peak"    },
  // ]
  getPeakDates: (filters = {}, topN = 5) => {
    const params = { topN };
    if (filters.startDate   && filters.startDate   !== "")             params.startDate   = filters.startDate;
    if (filters.endDate     && filters.endDate     !== "")             params.endDate     = filters.endDate;
    if (filters.bookingType && filters.bookingType !== "All Types")    params.bookingType = filters.bookingType;
    if (filters.status      && filters.status      !== "All Statuses") params.status      = filters.status;
    return api.get("/reports/travel-dates/peak-dates", { params });
  },

  // ── GET PERIOD ANALYSIS (table rows) ──────────────────────
  // GET /api/reports/travel-dates/analysis
  // @GetMapping("/api/reports/travel-dates/analysis")
  // public ResponseEntity<PeriodAnalysisResponseDTO> getAnalysis(
  //     @RequestParam(required = false)         String startDate,
  //     @RequestParam(required = false)         String endDate,
  //     @RequestParam(defaultValue = "Monthly") String analysisType,
  //     @RequestParam(required = false)         String bookingType,
  //     @RequestParam(required = false)         String status,
  //     @RequestParam(defaultValue = "25")      int    perPage,
  //     @RequestParam(defaultValue = "1")       int    page)
  //
  // Returns paginated period rows for the Monthly/Weekly/Daily/Quarterly table
  //
  // Response:
  // {
  //   rows: [
  //     {
  //       month:       "Jan 2026",    // period label
  //       bookings:    3,
  //       travelers:   8,
  //       revenue:     45000.00,
  //       avgDuration: 7,
  //       pctOfTotal:  3.9            // percentage of total revenue
  //     },
  //     ...
  //   ],
  //   total:      8,
  //   page:       1,
  //   perPage:    25,
  //   totalPages: 1
  // }
  getAnalysis: (filters = {}) => {
    return api.get("/reports/travel-dates/analysis", {
      params: buildParams(filters),
    });
  },

  // ── GET TRIP DURATION BREAKDOWN ────────────────────────────
  // GET /api/reports/travel-dates/duration
  // @GetMapping("/api/reports/travel-dates/duration")
  // public ResponseEntity<List<DurationRangeDTO>> getDuration(
  //     @RequestParam(required = false) String startDate,
  //     @RequestParam(required = false) String endDate,
  //     @RequestParam(required = false) String bookingType,
  //     @RequestParam(required = false) String status)
  //
  // Groups bookings by trip duration range
  //
  // Response:
  // [
  //   { range:"1–3 days",  count:5,  pct:21 },
  //   { range:"4–7 days",  count:12, pct:50 },
  //   { range:"8–14 days", count:5,  pct:21 },
  //   { range:"15+ days",  count:2,  pct:8  },
  // ]
  getDuration: (filters = {}) => {
    const params = {};
    if (filters.startDate   && filters.startDate   !== "")             params.startDate   = filters.startDate;
    if (filters.endDate     && filters.endDate     !== "")             params.endDate     = filters.endDate;
    if (filters.bookingType && filters.bookingType !== "All Types")    params.bookingType = filters.bookingType;
    if (filters.status      && filters.status      !== "All Statuses") params.status      = filters.status;
    return api.get("/reports/travel-dates/duration", { params });
  },

  // ── EXPORT CSV ─────────────────────────────────────────────
  // GET /api/reports/travel-dates/export/csv
  // @GetMapping("/api/reports/travel-dates/export/csv")
  // public ResponseEntity<byte[]> exportCsv(
  //     @RequestParam(required = false)         String startDate,
  //     @RequestParam(required = false)         String endDate,
  //     @RequestParam(defaultValue = "Monthly") String analysisType,
  //     @RequestParam(required = false)         String bookingType,
  //     @RequestParam(required = false)         String status)
  //
  // Returns the full (unpaginated) analysis dataset as CSV
  // Content-Disposition: attachment; filename="travel-date-analysis-..."
  exportCsv: (filters = {}) => {
    return api.get("/reports/travel-dates/export/csv", {
      params: buildParams(filters),
      responseType: "blob",
    });
  },
};

export default travelDateAnalysisService;
// ─────────────────────────────────────────────────────────────
