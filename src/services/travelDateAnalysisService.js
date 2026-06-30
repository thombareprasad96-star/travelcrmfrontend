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
    return api.get("/api/reports/travel-dates/summary", { params });
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
    return api.get("/api/reports/travel-dates/trends", {
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
    return api.get("/api/reports/travel-dates/peak-dates", { params });
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
    return api.get("/api/reports/travel-dates/analysis", {
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
    return api.get("/api/reports/travel-dates/duration", { params });
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
    return api.get("/api/reports/travel-dates/export/csv", {
      params: buildParams(filters),
      responseType: "blob",
    });
  },
};

export default travelDateAnalysisService;


// ═════════════════════════════════════════════════════════════
// HOW TO USE IN TravelDateAnalysis.jsx
// ═════════════════════════════════════════════════════════════
//
// STEP 1 — Import at top of TravelDateAnalysis.jsx:
//   import travelDateAnalysisService
//     from "../services/travelDateAnalysisService";
//
// ─────────────────────────────────────────────────────────────
// STEP 2 — Replace mock useEffect with real API calls:
//
//   useEffect(() => {
//     setLoading(true);
//     Promise.all([
//       travelDateAnalysisService.getSummary({
//         startDate:   applied.startDate,
//         endDate:     applied.endDate,
//         bookingType: applied.bookingType,
//         status:      applied.status,
//       }),
//       travelDateAnalysisService.getTrends({
//         startDate:    applied.startDate,
//         endDate:      applied.endDate,
//         analysisType: applied.analysisType,
//         bookingType:  applied.bookingType,
//         status:       applied.status,
//       }),
//       travelDateAnalysisService.getPeakDates({
//         startDate:   applied.startDate,
//         endDate:     applied.endDate,
//         bookingType: applied.bookingType,
//         status:      applied.status,
//       }),
//       travelDateAnalysisService.getAnalysis({
//         startDate:    applied.startDate,
//         endDate:      applied.endDate,
//         analysisType: applied.analysisType,
//         bookingType:  applied.bookingType,
//         status:       applied.status,
//         page,
//         perPage: Number(showEntries),
//       }),
//       travelDateAnalysisService.getDuration({
//         startDate:   applied.startDate,
//         endDate:     applied.endDate,
//         bookingType: applied.bookingType,
//         status:      applied.status,
//       }),
//     ])
//       .then(([sumRes, trendRes, peakRes, analysisRes, durRes]) => {
//         // 4 hero stat cards
//         setSummary({
//           totalBookings:  sumRes.data.totalBookings,
//           totalTravelers: sumRes.data.totalTravelers,
//           avgPerPeriod:   sumRes.data.avgPerPeriod,
//           totalRevenue:   sumRes.data.totalRevenue,
//         });
//         // Bar chart data
//         setTrends(trendRes.data);
//         // Peak dates sidebar
//         setPeak(peakRes.data);
//         // Monthly/period table
//         setMonthly(analysisRes.data.rows);
//         setTotalCount(analysisRes.data.total);
//         // Trip duration sidebar
//         setDuration(durRes.data);
//       })
//       .catch(() => showToast("Failed to load travel date data.", "error"))
//       .finally(() => setLoading(false));
//   }, [applied, page, showEntries]);
//
// ─────────────────────────────────────────────────────────────
// STEP 3 — Replace handleExportCSV:
//
//   const handleExportCSV = async () => {
//     try {
//       const res = await travelDateAnalysisService.exportCsv({
//         startDate:    applied.startDate,
//         endDate:      applied.endDate,
//         analysisType: applied.analysisType,
//         bookingType:  applied.bookingType,
//         status:       applied.status,
//       });
//       const url  = window.URL.createObjectURL(new Blob([res.data]));
//       const link = document.createElement("a");
//       link.href  = url;
//       link.setAttribute(
//         "download",
//         `travel-date-analysis-${applied.startDate}.csv`
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
// ═════════════════════════════════════════════════════════════
// SPRING BOOT JAVA BACKEND — FULL REFERENCE
// ═════════════════════════════════════════════════════════════
//
// ── TravelDateAnalysisController.java ────────────────────────
//
//   @RestController
//   @RequestMapping("/api/reports/travel-dates")
//   @CrossOrigin(origins = "http://localhost:3000")
//   public class TravelDateAnalysisController {
//
//       @Autowired private TravelDateAnalysisService service;
//
//       @GetMapping("/summary")
//       public ResponseEntity<TravelSummaryDTO> getSummary(
//           @RequestParam(required = false) String startDate,
//           @RequestParam(required = false) String endDate,
//           @RequestParam(required = false) String bookingType,
//           @RequestParam(required = false) String status) {
//           return ResponseEntity.ok(
//               service.getSummary(startDate, endDate, bookingType, status));
//       }
//
//       @GetMapping("/trends")
//       public ResponseEntity<List<TrendDataDTO>> getTrends(
//           @RequestParam(required = false)            String startDate,
//           @RequestParam(required = false)            String endDate,
//           @RequestParam(defaultValue = "Monthly")    String analysisType,
//           @RequestParam(required = false)            String bookingType,
//           @RequestParam(required = false)            String status) {
//           return ResponseEntity.ok(
//               service.getTrends(startDate, endDate, analysisType, bookingType, status));
//       }
//
//       @GetMapping("/peak-dates")
//       public ResponseEntity<List<PeakDateDTO>> getPeakDates(
//           @RequestParam(required = false)  String startDate,
//           @RequestParam(required = false)  String endDate,
//           @RequestParam(required = false)  String bookingType,
//           @RequestParam(required = false)  String status,
//           @RequestParam(defaultValue = "5") int   topN) {
//           return ResponseEntity.ok(
//               service.getPeakDates(startDate, endDate, bookingType, status, topN));
//       }
//
//       @GetMapping("/analysis")
//       public ResponseEntity<PeriodAnalysisResponseDTO> getAnalysis(
//           @RequestParam(required = false)         String startDate,
//           @RequestParam(required = false)         String endDate,
//           @RequestParam(defaultValue = "Monthly") String analysisType,
//           @RequestParam(required = false)         String bookingType,
//           @RequestParam(required = false)         String status,
//           @RequestParam(defaultValue = "25")      int    perPage,
//           @RequestParam(defaultValue = "1")       int    page) {
//           return ResponseEntity.ok(
//               service.getAnalysis(startDate, endDate, analysisType,
//                                   bookingType, status, perPage, page));
//       }
//
//       @GetMapping("/duration")
//       public ResponseEntity<List<DurationRangeDTO>> getDuration(
//           @RequestParam(required = false) String startDate,
//           @RequestParam(required = false) String endDate,
//           @RequestParam(required = false) String bookingType,
//           @RequestParam(required = false) String status) {
//           return ResponseEntity.ok(
//               service.getDuration(startDate, endDate, bookingType, status));
//       }
//
//       @GetMapping("/export/csv")
//       public ResponseEntity<byte[]> exportCsv(
//           @RequestParam(required = false)         String startDate,
//           @RequestParam(required = false)         String endDate,
//           @RequestParam(defaultValue = "Monthly") String analysisType,
//           @RequestParam(required = false)         String bookingType,
//           @RequestParam(required = false)         String status) {
//           byte[] csv = service.exportCsv(
//               startDate, endDate, analysisType, bookingType, status);
//           String filename = "travel-date-analysis-" + startDate + ".csv";
//           return ResponseEntity.ok()
//               .header("Content-Disposition", "attachment; filename=" + filename)
//               .contentType(MediaType.parseMediaType("text/csv"))
//               .body(csv);
//       }
//   }
//
// ── TravelDateAnalysisService.java ───────────────────────────
//
//   @Service
//   public class TravelDateAnalysisService {
//
//       @Autowired private BookingRepository repo;
//
//       private LocalDate[] resolveDates(String start, String end) {
//           LocalDate from = start != null
//               ? LocalDate.parse(start)
//               : LocalDate.now();
//           LocalDate to = end != null
//               ? LocalDate.parse(end)
//               : LocalDate.now().plusMonths(6);
//           return new LocalDate[]{ from, to };
//       }
//
//       // Dynamic GROUP BY format based on analysisType
//       private String resolveDateFormat(String analysisType) {
//           return switch (analysisType) {
//               case "Weekly"    -> "IW/IYYY";     // ISO week/year
//               case "Daily"     -> "YYYY-MM-DD";
//               case "Quarterly" -> "Q/YYYY";
//               default          -> "Mon YYYY";     // Monthly
//           };
//       }
//
//       public TravelSummaryDTO getSummary(
//               String start, String end, String bookingType, String status) {
//           LocalDate[] dates = resolveDates(start, end);
//           return new TravelSummaryDTO(
//               repo.countByTravelDateRange(dates[0], dates[1], bookingType, status),
//               repo.sumTravelersByTravelDateRange(dates[0], dates[1], bookingType, status),
//               repo.avgBookingsPerMonth(dates[0], dates[1], bookingType, status),
//               repo.sumRevenueByTravelDateRange(dates[0], dates[1], bookingType, status)
//           );
//       }
//
//       public List<TrendDataDTO> getTrends(
//               String start, String end, String analysisType,
//               String bookingType, String status) {
//           LocalDate[] dates = resolveDates(start, end);
//           String fmt = resolveDateFormat(analysisType);
//           return repo.findTravelTrends(dates[0], dates[1], fmt, bookingType, status);
//       }
//
//       public List<PeakDateDTO> getPeakDates(
//               String start, String end,
//               String bookingType, String status, int topN) {
//           LocalDate[] dates = resolveDates(start, end);
//           return repo.findPeakTravelDates(dates[0], dates[1], bookingType, status, topN)
//               .stream()
//               .map(r -> new PeakDateDTO(
//                   ((java.sql.Date) r[0]).toLocalDate()
//                       .format(DateTimeFormatter.ofPattern("MMM dd, yyyy")),
//                   ((Number) r[1]).intValue(),
//                   "Peak"
//               ))
//               .collect(Collectors.toList());
//       }
//
//       public PeriodAnalysisResponseDTO getAnalysis(
//               String start, String end, String analysisType,
//               String bookingType, String status, int perPage, int page) {
//           LocalDate[] dates = resolveDates(start, end);
//           String fmt = resolveDateFormat(analysisType);
//           List<TrendDataDTO> all = repo.findTravelTrends(
//               dates[0], dates[1], fmt, bookingType, status);
//           double totalRev = all.stream().mapToDouble(TrendDataDTO::getRevenue).sum();
//           // compute pctOfTotal per row
//           List<PeriodRowDTO> rows = all.stream().map(t -> {
//               double pct = totalRev > 0 ? Math.round((t.getRevenue()/totalRev)*1000)/10.0 : 0;
//               return new PeriodRowDTO(
//                   t.getMonth(), t.getBookings(), t.getTravelers(),
//                   t.getRevenue(), t.getAvgDuration(), pct);
//           }).collect(Collectors.toList());
//           int total = rows.size();
//           int from  = Math.min((page-1)*perPage, total);
//           int to    = Math.min(page*perPage, total);
//           return new PeriodAnalysisResponseDTO(
//               rows.subList(from, to), total, page, perPage,
//               (int) Math.ceil((double) total / perPage));
//       }
//
//       public List<DurationRangeDTO> getDuration(
//               String start, String end,
//               String bookingType, String status) {
//           LocalDate[] dates = resolveDates(start, end);
//           List<Object[]> raw = repo.findDurationBreakdown(
//               dates[0], dates[1], bookingType, status);
//           long total = raw.stream().mapToLong(r -> ((Number) r[1]).longValue()).sum();
//           return raw.stream().map(r -> {
//               long cnt = ((Number) r[1]).longValue();
//               int pct = total > 0 ? (int) Math.round((double) cnt / total * 100) : 0;
//               return new DurationRangeDTO((String) r[0], (int) cnt, pct);
//           }).collect(Collectors.toList());
//       }
//
//       public byte[] exportCsv(String start, String end, String analysisType,
//               String bookingType, String status) {
//           LocalDate[] dates = resolveDates(start, end);
//           String fmt = resolveDateFormat(analysisType);
//           List<TrendDataDTO> data = repo.findTravelTrends(
//               dates[0], dates[1], fmt, bookingType, status);
//           double totalRev = data.stream().mapToDouble(TrendDataDTO::getRevenue).sum();
//           StringBuilder csv = new StringBuilder();
//           csv.append("Month/Period,Total Bookings,Total Travelers,Revenue (INR),Avg Duration (days),% of Total\n");
//           for (TrendDataDTO d : data) {
//               double pct = totalRev > 0 ? Math.round((d.getRevenue()/totalRev)*1000)/10.0 : 0;
//               csv.append(String.format("%s,%d,%d,%.2f,%d,%.1f%%\n",
//                   d.getMonth(), d.getBookings(), d.getTravelers(),
//                   d.getRevenue(), d.getAvgDuration(), pct));
//           }
//           return csv.toString().getBytes(StandardCharsets.UTF_8);
//       }
//   }
//
// ── BookingRepository.java (travel date queries) ─────────────
//
//   @Repository
//   public interface BookingRepository extends JpaRepository<Booking, Long> {
//
//       // Count bookings in travel date range
//       @Query("SELECT COUNT(b) FROM Booking b WHERE " +
//              "b.travelDate BETWEEN :from AND :to " +
//              "AND (:type   IS NULL OR b.tripType = :type)  " +
//              "AND (:status IS NULL OR b.status   = :status)")
//       long countByTravelDateRange(
//           @Param("from")   LocalDate from, @Param("to") LocalDate to,
//           @Param("type")   String type,    @Param("status") String status);
//
//       // Sum travelers (adult + child + infant counts)
//       @Query("SELECT COALESCE(SUM(b.travelerCount),0) FROM Booking b WHERE " +
//              "b.travelDate BETWEEN :from AND :to " +
//              "AND (:type IS NULL OR b.tripType = :type) " +
//              "AND (:status IS NULL OR b.status = :status)")
//       long sumTravelersByTravelDateRange(
//           @Param("from") LocalDate from, @Param("to") LocalDate to,
//           @Param("type") String type, @Param("status") String status);
//
//       // Avg bookings per month
//       @Query(value = """
//           SELECT COALESCE(
//             COUNT(*) / NULLIF(COUNT(DISTINCT TO_CHAR(travel_date, 'YYYY-MM')), 0), 0)
//           FROM bookings
//           WHERE travel_date BETWEEN :from AND :to
//             AND (:type   IS NULL OR trip_type = :type)
//             AND (:status IS NULL OR status    = :status)
//           """, nativeQuery = true)
//       double avgBookingsPerMonth(
//           @Param("from") LocalDate from, @Param("to") LocalDate to,
//           @Param("type") String type, @Param("status") String status);
//
//       // Sum revenue by travel date range
//       @Query("SELECT COALESCE(SUM(b.customerAmount),0) FROM Booking b WHERE " +
//              "b.travelDate BETWEEN :from AND :to " +
//              "AND (:type IS NULL OR b.tripType = :type) " +
//              "AND (:status IS NULL OR b.status = :status)")
//       double sumRevenueByTravelDateRange(
//           @Param("from") LocalDate from, @Param("to") LocalDate to,
//           @Param("type") String type, @Param("status") String status);
//
//       // Travel trends — dynamic GROUP BY date format
//       @Query(value = """
//           SELECT
//             TO_CHAR(b.travel_date, :dateFmt)   AS period,
//             COUNT(*)                            AS bookings,
//             COALESCE(SUM(b.traveler_count),0)  AS travelers,
//             COALESCE(SUM(b.customer_amount),0) AS revenue,
//             COALESCE(AVG(b.trip_duration),0)   AS avg_duration
//           FROM bookings b
//           WHERE b.travel_date BETWEEN :from AND :to
//             AND (:type   IS NULL OR b.trip_type = :type)
//             AND (:status IS NULL OR b.status    = :status)
//           GROUP BY TO_CHAR(b.travel_date, :dateFmt),
//                    DATE_TRUNC('month', b.travel_date)
//           ORDER BY DATE_TRUNC('month', b.travel_date)
//           """, nativeQuery = true)
//       List<Object[]> findTravelTrendsRaw(
//           @Param("from")    LocalDate from, @Param("to")   LocalDate to,
//           @Param("dateFmt") String dateFmt, @Param("type") String type,
//           @Param("status")  String status);
//
//       // Peak travel dates — top N by booking count
//       @Query(value = """
//           SELECT b.travel_date, COUNT(*) AS bookings
//           FROM bookings b
//           WHERE b.travel_date BETWEEN :from AND :to
//             AND (:type   IS NULL OR b.trip_type = :type)
//             AND (:status IS NULL OR b.status    = :status)
//           GROUP BY b.travel_date
//           ORDER BY bookings DESC
//           LIMIT :topN
//           """, nativeQuery = true)
//       List<Object[]> findPeakTravelDates(
//           @Param("from") LocalDate from, @Param("to") LocalDate to,
//           @Param("type") String type, @Param("status") String status,
//           @Param("topN") int topN);
//
//       // Trip duration breakdown
//       @Query(value = """
//           SELECT
//             CASE
//               WHEN b.trip_duration BETWEEN 1  AND 3  THEN '1–3 days'
//               WHEN b.trip_duration BETWEEN 4  AND 7  THEN '4–7 days'
//               WHEN b.trip_duration BETWEEN 8  AND 14 THEN '8–14 days'
//               ELSE '15+ days'
//             END AS duration_range,
//             COUNT(*) AS cnt
//           FROM bookings b
//           WHERE b.travel_date BETWEEN :from AND :to
//             AND b.trip_duration IS NOT NULL
//             AND (:type   IS NULL OR b.trip_type = :type)
//             AND (:status IS NULL OR b.status    = :status)
//           GROUP BY duration_range
//           ORDER BY MIN(b.trip_duration)
//           """, nativeQuery = true)
//       List<Object[]> findDurationBreakdown(
//           @Param("from") LocalDate from, @Param("to") LocalDate to,
//           @Param("type") String type, @Param("status") String status);
//   }
//
// ── All DTOs ──────────────────────────────────────────────────
//
//   // TravelSummaryDTO.java
//   public class TravelSummaryDTO {
//       private long   totalBookings;
//       private long   totalTravelers;
//       private double avgPerPeriod;
//       private double totalRevenue;
//       // constructor + getters
//   }
//
//   // TrendDataDTO.java  (used for chart + table)
//   public class TrendDataDTO {
//       private String month;          // period label: "Jan 2026"
//       private int    bookings;
//       private int    travelers;
//       private double revenue;
//       private int    avgDuration;    // days
//       // constructor + getters or @Data (Lombok)
//   }
//
//   // PeakDateDTO.java
//   public class PeakDateDTO {
//       private String date;           // "Jul 15, 2026"
//       private int    bookings;
//       private String label;          // "Peak"
//       // constructor + getters
//   }
//
//   // PeriodRowDTO.java  (table row with pct)
//   public class PeriodRowDTO extends TrendDataDTO {
//       private double pctOfTotal;
//       // constructor + getters
//   }
//
//   // PeriodAnalysisResponseDTO.java
//   public class PeriodAnalysisResponseDTO {
//       private List<PeriodRowDTO> rows;
//       private int  total;
//       private int  page;
//       private int  perPage;
//       private int  totalPages;
//       // constructor + getters
//   }
//
//   // DurationRangeDTO.java
//   public class DurationRangeDTO {
//       private String range;    // "1–3 days"
//       private int    count;
//       private int    pct;      // percentage of total
//       // constructor + getters
//   }
//
// ─────────────────────────────────────────────────────────────
// ── PostgreSQL Schema (bookings — travel date columns) ────────
//
//   -- Ensure these columns exist on your bookings table:
//   ALTER TABLE bookings
//     ADD COLUMN IF NOT EXISTS travel_date   DATE,
//     ADD COLUMN IF NOT EXISTS trip_duration INTEGER,    -- number of nights/days
//     ADD COLUMN IF NOT EXISTS traveler_count INTEGER DEFAULT 1;
//
//   -- Indexes for fast travel date querying
//   CREATE INDEX IF NOT EXISTS idx_bk_travel_date    ON bookings (travel_date ASC);
//   CREATE INDEX IF NOT EXISTS idx_bk_trip_type      ON bookings (trip_type);
//   CREATE INDEX IF NOT EXISTS idx_bk_trip_duration  ON bookings (trip_duration);
//   CREATE INDEX IF NOT EXISTS idx_bk_traveler_count ON bookings (traveler_count);
//
//   -- Composite index for the most common filter combo
//   CREATE INDEX IF NOT EXISTS idx_bk_travel_analysis
//     ON bookings (travel_date ASC, trip_type, status);
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