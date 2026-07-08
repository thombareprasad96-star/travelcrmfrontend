// src/services/bookingRevenueService.js
// ─────────────────────────────────────────────────────────────
// Booking Revenue Analysis Page — API Service
// Page: BookingRevenueAnalysis.jsx
// Backend: Java Spring Boot REST API
// Database: PostgreSQL
// Covers:
//   - Get booking data (all filters + pagination)
//   - Get summary stats (4 big hero cards)
//   - Get revenue breakdown (TCS, Total Payable, Paid, Refunded)
//   - Get booking statistics (Intl, Domestic, Confirmed, Completed, Cancelled)
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
const buildParams = (filters = {}) => {
  const params = {};
  if (filters.startDate     && filters.startDate     !== "")                        params.startDate     = filters.startDate;
  if (filters.endDate       && filters.endDate       !== "")                        params.endDate       = filters.endDate;
  if (filters.dateType      && filters.dateType      !== "Booking Date")            params.dateType      = filters.dateType;
  if (filters.status        && filters.status        !== "All Statuses")            params.status        = filters.status;
  if (filters.paymentStatus && filters.paymentStatus !== "All Payment Statuses")    params.paymentStatus = filters.paymentStatus;
  if (filters.minAmount     && filters.minAmount     !== "")                        params.minAmount     = filters.minAmount;
  if (filters.maxAmount     && filters.maxAmount     !== "")                        params.maxAmount     = filters.maxAmount;
  if (filters.search        && filters.search        !== "")                        params.search        = filters.search;
  if (filters.page)    params.page    = filters.page;
  if (filters.perPage) params.perPage = filters.perPage;
  return params;
};


// ═════════════════════════════════════════════════════════════
// BOOKING REVENUE SERVICE
// Spring Boot Controller: /api/reports/revenue
// PostgreSQL Tables: bookings, customers, vendors, payments
// ═════════════════════════════════════════════════════════════
const bookingRevenueService = {

  // ── GET BOOKING DATA (table rows with all filters) ─────────
  // GET /api/reports/revenue/bookings
  // @GetMapping("/api/reports/revenue/bookings")
  // public ResponseEntity<BookingRevenueResponseDTO> getBookings(
  //     @RequestParam(required = false)            String startDate,
  //     @RequestParam(required = false)            String endDate,
  //     @RequestParam(defaultValue = "Booking Date") String dateType,
  //     @RequestParam(required = false)            String status,
  //     @RequestParam(required = false)            String paymentStatus,
  //     @RequestParam(required = false)            Double minAmount,
  //     @RequestParam(required = false)            Double maxAmount,
  //     @RequestParam(required = false)            String search,
  //     @RequestParam(defaultValue = "25")         int    perPage,
  //     @RequestParam(defaultValue = "1")          int    page)
  //
  // dateType values:
  //   "Booking Date"  → filters by bookings.booking_date
  //   "Travel Date"   → filters by bookings.travel_date
  //   "Created Date"  → filters by bookings.created_at
  //
  // status values:
  //   "Confirmed" | "Pending" | "Cancelled" | "Completed"
  //
  // paymentStatus values:
  //   "Fully Paid" | "Partially Paid" | "Unpaid" | "Refunded"
  //
  // Response:
  // {
  //   bookings: [
  //     {
  //       id:              1,
  //       code:            "B000003",
  //       customer:        "Naresh",
  //       customerDetail:  "Naresh - Nepal Package for Nar...",
  //       customerPhone:   "+91 96196 94784",
  //       customerAmount:  108001.00,
  //       tcs:             0.00,
  //       totalPayable:    108001.00,
  //       paid:            0.00,
  //       due:             108001.00,
  //       vendorCost:      0.00,
  //       netProfit:       108001.00,
  //       netMargin:       100.0,
  //       type:            "Domestic",   // Domestic | International
  //       status:          "Pending",    // Confirmed | Pending | Cancelled | Completed
  //       travelDate:      "Jun 12, 2026",
  //       createdDate:     "Jun 26, 14"
  //     },
  //     ...
  //   ],
  //   total:      2,
  //   page:       1,
  //   perPage:    25,
  //   totalPages: 1
  // }
  getBookings: (filters = {}) => {
    return api.get("/api/reports/revenue/bookings", {
      params: buildParams(filters),
    });
  },

  // ── GET SUMMARY STATS (4 big hero stat cards) ──────────────
  // GET /api/reports/revenue/summary
  // @GetMapping("/api/reports/revenue/summary")
  // public ResponseEntity<RevenueSummaryDTO> getSummary(
  //     @RequestParam(required = false) String startDate,
  //     @RequestParam(required = false) String endDate,
  //     @RequestParam(defaultValue = "Booking Date") String dateType,
  //     @RequestParam(required = false) String status,
  //     @RequestParam(required = false) String paymentStatus,
  //     @RequestParam(required = false) Double minAmount,
  //     @RequestParam(required = false) Double maxAmount)
  //
  // Response:
  // {
  //   totalRevenue:   197001.00,   // SUM(customer_amount)
  //   netProfit:      141001.00,   // SUM(net_profit)
  //   avgNetMargin:   71.6,        // AVG(net_margin_percent)
  //   outstandingDue: 197001.00    // SUM(due_amount)
  // }
  getSummary: (filters = {}) => {
    const params = {};
    if (filters.startDate     && filters.startDate     !== "") params.startDate     = filters.startDate;
    if (filters.endDate       && filters.endDate       !== "") params.endDate       = filters.endDate;
    if (filters.dateType      && filters.dateType      !== "Booking Date") params.dateType = filters.dateType;
    if (filters.status        && filters.status        !== "All Statuses") params.status   = filters.status;
    if (filters.paymentStatus && filters.paymentStatus !== "All Payment Statuses") params.paymentStatus = filters.paymentStatus;
    if (filters.minAmount     && filters.minAmount     !== "") params.minAmount = filters.minAmount;
    if (filters.maxAmount     && filters.maxAmount     !== "") params.maxAmount = filters.maxAmount;
    return api.get("/api/reports/revenue/summary", { params });
  },

  // ── GET REVENUE BREAKDOWN (mini stat panel) ────────────────
  // GET /api/reports/revenue/breakdown
  // @GetMapping("/api/reports/revenue/breakdown")
  // public ResponseEntity<RevenueBreakdownDTO> getBreakdown(
  //     @RequestParam(required = false) String startDate,
  //     @RequestParam(required = false) String endDate,
  //     @RequestParam(defaultValue = "Booking Date") String dateType)
  //
  // Response:
  // {
  //   tcs:          0.00,       // SUM(tcs_amount)
  //   totalPayable: 197001.00,  // SUM(total_payable)
  //   paidAmount:   0.00,       // SUM(paid_amount)
  //   refunded:     0.00        // SUM(refunded_amount)
  // }
  getBreakdown: (startDate, endDate, dateType) => {
    const params = {};
    if (startDate && startDate !== "") params.startDate = startDate;
    if (endDate   && endDate   !== "") params.endDate   = endDate;
    if (dateType  && dateType  !== "Booking Date") params.dateType = dateType;
    return api.get("/api/reports/revenue/breakdown", { params });
  },

  // ── GET BOOKING STATISTICS (Intl, Domestic, status counts) ─
  // GET /api/reports/revenue/statistics
  // @GetMapping("/api/reports/revenue/statistics")
  // public ResponseEntity<BookingStatisticsDTO> getStatistics(
  //     @RequestParam(required = false) String startDate,
  //     @RequestParam(required = false) String endDate,
  //     @RequestParam(defaultValue = "Booking Date") String dateType)
  //
  // Response:
  // {
  //   international: 0,
  //   domestic:      2,
  //   confirmed:     0,
  //   completed:     0,
  //   cancelled:     0
  // }
  getStatistics: (startDate, endDate, dateType) => {
    const params = {};
    if (startDate && startDate !== "") params.startDate = startDate;
    if (endDate   && endDate   !== "") params.endDate   = endDate;
    if (dateType  && dateType  !== "Booking Date") params.dateType = dateType;
    return api.get("/api/reports/revenue/statistics", { params });
  },

  // ── EXPORT CSV ─────────────────────────────────────────────
  // GET /api/reports/revenue/export/csv
  // @GetMapping("/api/reports/revenue/export/csv")
  // public ResponseEntity<byte[]> exportCsv(
  //     @RequestParam(required = false) String startDate,
  //     @RequestParam(required = false) String endDate,
  //     @RequestParam(defaultValue = "Booking Date") String dateType,
  //     @RequestParam(required = false) String status,
  //     @RequestParam(required = false) String paymentStatus,
  //     @RequestParam(required = false) Double minAmount,
  //     @RequestParam(required = false) Double maxAmount,
  //     @RequestParam(required = false) String search)
  //
  // Returns full (unpaginated) filtered dataset as CSV
  // Content-Disposition: attachment; filename="booking-revenue-..."
  exportCsv: (filters = {}) => {
    return api.get("/api/reports/revenue/export/csv", {
      params: buildParams(filters),
      responseType: "blob",
    });
  },
};

export default bookingRevenueService;
// ─────────────────────────────────────────────────────────────