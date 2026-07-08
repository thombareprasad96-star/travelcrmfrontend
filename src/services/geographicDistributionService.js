// src/services/geographicDistributionService.js
// ─────────────────────────────────────────────────────────────
// Geographic Distribution Report Page — API Service
// Page: GeographicDistribution.jsx
// Backend: Java Spring Boot REST API
// Database: PostgreSQL
// Covers:
//   - Get distribution data (with all filters + pagination)
//   - Get summary stats (6 stat cards)
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
// Strips default/empty values before sending to backend
const buildParams = (filters = {}) => {
  const params = {};
  if (filters.startDate  && filters.startDate  !== "")             params.startDate  = filters.startDate;
  if (filters.endDate    && filters.endDate    !== "")             params.endDate    = filters.endDate;
  if (filters.viewType   && filters.viewType   !== "Departing Cities") params.viewType = filters.viewType;
  if (filters.leadType   && filters.leadType   !== "All Types")    params.leadType   = filters.leadType;
  if (filters.leadStage  && filters.leadStage  !== "All Stages")   params.leadStage  = filters.leadStage;
  if (filters.search     && filters.search     !== "")             params.search     = filters.search;
  if (filters.page)      params.page     = filters.page;
  if (filters.perPage)   params.perPage  = filters.perPage;
  return params;
};


// ═════════════════════════════════════════════════════════════
// GEOGRAPHIC DISTRIBUTION SERVICE
// Spring Boot Controller: /api/reports/geographic
// PostgreSQL Tables: leads, cities, destinations
// ═════════════════════════════════════════════════════════════
const geographicDistributionService = {

  // ── GET DISTRIBUTION DATA (table rows) ─────────────────────
  // GET /api/reports/geographic/data
  // @GetMapping("/api/reports/geographic/data")
  // public ResponseEntity<GeoDistributionResponseDTO> getData(
  //     @RequestParam(required = false) String startDate,
  //     @RequestParam(required = false) String endDate,
  //     @RequestParam(defaultValue = "Departing Cities") String viewType,
  //     @RequestParam(required = false) String leadType,
  //     @RequestParam(required = false) String leadStage,
  //     @RequestParam(required = false) String search,
  //     @RequestParam(defaultValue = "25") int perPage,
  //     @RequestParam(defaultValue = "1")  int page)
  //
  // viewType values:
  //   "Departing Cities" → groups by lead.departing_city
  //   "Destinations"     → groups by lead.destination
  //   "States"           → groups by lead.state
  //   "Countries"        → groups by lead.country
  //
  // Response:
  // {
  //   rows: [
  //     {
  //       id:             1,
  //       city:           "Gorakhpur",   // or destination/state/country
  //       country:        "India",
  //       total:          11,
  //       hot:            1,
  //       warm:           0,
  //       cold:           0,
  //       fresh:          10,
  //       converted:      0,
  //       conversionRate: 0.0,
  //       distribution:   44.0          // percentage of total
  //     },
  //     ...
  //   ],
  //   total:      5,     // total rows (for pagination)
  //   page:       1,
  //   perPage:    25,
  //   totalPages: 1
  // }
  getData: (filters = {}) => {
    return api.get("/api/reports/geographic/data", {
      params: buildParams(filters),
    });
  },

  // ── GET SUMMARY STATS (6 stat cards) ──────────────────────
  // GET /api/reports/geographic/summary
  // @GetMapping("/api/reports/geographic/summary")
  // public ResponseEntity<GeoSummaryDTO> getSummary(
  //     @RequestParam(required = false) String startDate,
  //     @RequestParam(required = false) String endDate,
  //     @RequestParam(required = false) String leadType,
  //     @RequestParam(required = false) String leadStage)
  //
  // Response:
  // {
  //   totalLeads:  25,
  //   hotLeads:    5,
  //   warmLeads:   0,
  //   coldLeads:   0,
  //   freshLeads:  20,
  //   converted:   3
  // }
  getSummary: (filters = {}) => {
    const params = {};
    if (filters.startDate && filters.startDate !== "") params.startDate = filters.startDate;
    if (filters.endDate   && filters.endDate   !== "") params.endDate   = filters.endDate;
    if (filters.leadType  && filters.leadType  !== "All Types")  params.leadType  = filters.leadType;
    if (filters.leadStage && filters.leadStage !== "All Stages") params.leadStage = filters.leadStage;
    return api.get("/api/reports/geographic/summary", { params });
  },

  // ── EXPORT CSV ─────────────────────────────────────────────
  // GET /api/reports/geographic/export/csv
  // @GetMapping("/api/reports/geographic/export/csv")
  // public ResponseEntity<byte[]> exportCsv(
  //     @RequestParam(required = false) String startDate,
  //     @RequestParam(required = false) String endDate,
  //     @RequestParam(defaultValue = "Departing Cities") String viewType,
  //     @RequestParam(required = false) String leadType,
  //     @RequestParam(required = false) String leadStage,
  //     @RequestParam(required = false) String search)
  //
  // Returns the full (unpaginated) dataset as CSV
  // Content-Disposition: attachment; filename="geographic-report-..."
  exportCsv: (filters = {}) => {
    return api.get("/api/reports/geographic/export/csv", {
      params: buildParams(filters),
      responseType: "blob",
    });
  },
};

export default geographicDistributionService;
// ─────────────────────────────────────────────────────────────