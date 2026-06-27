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


// ═════════════════════════════════════════════════════════════
// HOW TO USE IN BookingRevenueAnalysis.jsx
// ═════════════════════════════════════════════════════════════
//
// STEP 1 — Import at top of BookingRevenueAnalysis.jsx:
//   import bookingRevenueService
//     from "../services/bookingRevenueService";
//
// ─────────────────────────────────────────────────────────────
// STEP 2 — Replace mock useEffect with real API calls:
//
//   useEffect(() => {
//     setLoading(true);
//     Promise.all([
//       bookingRevenueService.getBookings({
//         ...applied,
//         search,
//         page,
//         perPage: Number(showEntries),
//       }),
//       bookingRevenueService.getSummary(applied),
//       bookingRevenueService.getBreakdown(
//         applied.startDate, applied.endDate, applied.dateType),
//       bookingRevenueService.getStatistics(
//         applied.startDate, applied.endDate, applied.dateType),
//     ])
//       .then(([bookRes, sumRes, breakRes, statRes]) => {
//         setBookings(bookRes.data.bookings);
//         setTotalCount(bookRes.data.total);
//         // Bind to hero stat cards:
//         // sumRes.data.totalRevenue
//         // sumRes.data.netProfit
//         // sumRes.data.avgNetMargin
//         // sumRes.data.outstandingDue
//         //
//         // Bind to revenue breakdown panel:
//         // breakRes.data.tcs
//         // breakRes.data.totalPayable
//         // breakRes.data.paidAmount
//         // breakRes.data.refunded
//         //
//         // Bind to booking statistics panel:
//         // statRes.data.international
//         // statRes.data.domestic
//         // statRes.data.confirmed
//         // statRes.data.completed
//         // statRes.data.cancelled
//       })
//       .catch(() => showToast("Failed to load revenue data.", "error"))
//       .finally(() => setLoading(false));
//   }, [applied, page, showEntries, search]);
//
// ─────────────────────────────────────────────────────────────
// STEP 3 — Replace handleExportCSV:
//
//   const handleExportCSV = async () => {
//     try {
//       const res = await bookingRevenueService.exportCsv({
//         ...applied, search,
//       });
//       const url  = window.URL.createObjectURL(new Blob([res.data]));
//       const link = document.createElement("a");
//       link.href  = url;
//       link.setAttribute(
//         "download",
//         `booking-revenue-${applied.startDate}-to-${applied.endDate}.csv`
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
// ── BookingRevenueController.java ─────────────────────────────
//
//   @RestController
//   @RequestMapping("/api/reports/revenue")
//   @CrossOrigin(origins = "http://localhost:3000")
//   public class BookingRevenueController {
//
//       @Autowired private BookingRevenueService service;
//
//       @GetMapping("/bookings")
//       public ResponseEntity<BookingRevenueResponseDTO> getBookings(
//           @RequestParam(required = false)                String startDate,
//           @RequestParam(required = false)                String endDate,
//           @RequestParam(defaultValue = "Booking Date")   String dateType,
//           @RequestParam(required = false)                String status,
//           @RequestParam(required = false)                String paymentStatus,
//           @RequestParam(required = false)                Double minAmount,
//           @RequestParam(required = false)                Double maxAmount,
//           @RequestParam(required = false)                String search,
//           @RequestParam(defaultValue = "25")             int    perPage,
//           @RequestParam(defaultValue = "1")              int    page) {
//           return ResponseEntity.ok(service.getBookings(
//               startDate, endDate, dateType, status,
//               paymentStatus, minAmount, maxAmount,
//               search, perPage, page));
//       }
//
//       @GetMapping("/summary")
//       public ResponseEntity<RevenueSummaryDTO> getSummary(
//           @RequestParam(required = false)              String startDate,
//           @RequestParam(required = false)              String endDate,
//           @RequestParam(defaultValue = "Booking Date") String dateType,
//           @RequestParam(required = false)              String status,
//           @RequestParam(required = false)              String paymentStatus,
//           @RequestParam(required = false)              Double minAmount,
//           @RequestParam(required = false)              Double maxAmount) {
//           return ResponseEntity.ok(service.getSummary(
//               startDate, endDate, dateType, status,
//               paymentStatus, minAmount, maxAmount));
//       }
//
//       @GetMapping("/breakdown")
//       public ResponseEntity<RevenueBreakdownDTO> getBreakdown(
//           @RequestParam(required = false)              String startDate,
//           @RequestParam(required = false)              String endDate,
//           @RequestParam(defaultValue = "Booking Date") String dateType) {
//           return ResponseEntity.ok(
//               service.getBreakdown(startDate, endDate, dateType));
//       }
//
//       @GetMapping("/statistics")
//       public ResponseEntity<BookingStatisticsDTO> getStatistics(
//           @RequestParam(required = false)              String startDate,
//           @RequestParam(required = false)              String endDate,
//           @RequestParam(defaultValue = "Booking Date") String dateType) {
//           return ResponseEntity.ok(
//               service.getStatistics(startDate, endDate, dateType));
//       }
//
//       @GetMapping("/export/csv")
//       public ResponseEntity<byte[]> exportCsv(
//           @RequestParam(required = false)              String startDate,
//           @RequestParam(required = false)              String endDate,
//           @RequestParam(defaultValue = "Booking Date") String dateType,
//           @RequestParam(required = false)              String status,
//           @RequestParam(required = false)              String paymentStatus,
//           @RequestParam(required = false)              Double minAmount,
//           @RequestParam(required = false)              Double maxAmount,
//           @RequestParam(required = false)              String search) {
//           byte[] csv = service.exportCsv(startDate, endDate, dateType,
//               status, paymentStatus, minAmount, maxAmount, search);
//           String filename = "booking-revenue-" + startDate + "-to-" + endDate + ".csv";
//           return ResponseEntity.ok()
//               .header("Content-Disposition", "attachment; filename=" + filename)
//               .contentType(MediaType.parseMediaType("text/csv"))
//               .body(csv);
//       }
//   }
//
// ── BookingRevenueService.java ────────────────────────────────
//
//   @Service
//   public class BookingRevenueService {
//
//       @Autowired private BookingRepository repo;
//
//       // Resolve date column based on dateType param
//       private String resolveDateColumn(String dateType) {
//           return switch (dateType) {
//               case "Travel Date"  -> "b.travelDate";
//               case "Created Date" -> "b.createdAt";
//               default             -> "b.bookingDate";
//           };
//       }
//
//       public BookingRevenueResponseDTO getBookings(
//               String startDate, String endDate, String dateType,
//               String status, String paymentStatus,
//               Double minAmount, Double maxAmount,
//               String search, int perPage, int page) {
//
//           LocalDateTime from = startDate != null
//               ? LocalDate.parse(startDate).atStartOfDay()
//               : LocalDateTime.now().minusDays(30);
//           LocalDateTime to = endDate != null
//               ? LocalDate.parse(endDate).atTime(23, 59, 59)
//               : LocalDateTime.now();
//
//           Pageable pageable = PageRequest.of(page - 1, perPage,
//               Sort.by(Sort.Direction.DESC, "bookingDate"));
//
//           Page<Booking> result = repo.findWithRevenueFilters(
//               from, to, dateType, status, paymentStatus,
//               minAmount, maxAmount, search, pageable);
//
//           List<BookingRevenueRowDTO> rows = result.getContent()
//               .stream().map(this::toRowDTO)
//               .collect(Collectors.toList());
//
//           return new BookingRevenueResponseDTO(
//               rows, result.getTotalElements(),
//               page, perPage, result.getTotalPages());
//       }
//
//       public RevenueSummaryDTO getSummary(
//               String startDate, String endDate, String dateType,
//               String status, String paymentStatus,
//               Double minAmount, Double maxAmount) {
//           LocalDateTime from = startDate != null
//               ? LocalDate.parse(startDate).atStartOfDay()
//               : LocalDateTime.now().minusDays(30);
//           LocalDateTime to = endDate != null
//               ? LocalDate.parse(endDate).atTime(23, 59, 59)
//               : LocalDateTime.now();
//
//           return new RevenueSummaryDTO(
//               repo.sumCustomerAmount(from, to, dateType, status, paymentStatus, minAmount, maxAmount),
//               repo.sumNetProfit(from, to, dateType, status, paymentStatus, minAmount, maxAmount),
//               repo.avgNetMargin(from, to, dateType, status, paymentStatus, minAmount, maxAmount),
//               repo.sumDueAmount(from, to, dateType, status, paymentStatus, minAmount, maxAmount)
//           );
//       }
//
//       public RevenueBreakdownDTO getBreakdown(
//               String startDate, String endDate, String dateType) {
//           LocalDateTime from = startDate != null
//               ? LocalDate.parse(startDate).atStartOfDay()
//               : LocalDateTime.now().minusDays(30);
//           LocalDateTime to = endDate != null
//               ? LocalDate.parse(endDate).atTime(23, 59, 59)
//               : LocalDateTime.now();
//           return new RevenueBreakdownDTO(
//               repo.sumTcs(from, to),
//               repo.sumTotalPayable(from, to),
//               repo.sumPaidAmount(from, to),
//               repo.sumRefundedAmount(from, to)
//           );
//       }
//
//       public BookingStatisticsDTO getStatistics(
//               String startDate, String endDate, String dateType) {
//           LocalDateTime from = startDate != null
//               ? LocalDate.parse(startDate).atStartOfDay()
//               : LocalDateTime.now().minusDays(30);
//           LocalDateTime to = endDate != null
//               ? LocalDate.parse(endDate).atTime(23, 59, 59)
//               : LocalDateTime.now();
//           return new BookingStatisticsDTO(
//               repo.countByType(from, to, "International"),
//               repo.countByType(from, to, "Domestic"),
//               repo.countByStatus(from, to, "Confirmed"),
//               repo.countByStatus(from, to, "Completed"),
//               repo.countByStatus(from, to, "Cancelled")
//           );
//       }
//
//       public byte[] exportCsv(String startDate, String endDate, String dateType,
//               String status, String paymentStatus,
//               Double minAmount, Double maxAmount, String search) {
//           BookingRevenueResponseDTO all = getBookings(
//               startDate, endDate, dateType, status, paymentStatus,
//               minAmount, maxAmount, search, Integer.MAX_VALUE, 1);
//
//           StringBuilder csv = new StringBuilder();
//           csv.append("Booking Code,Customer,Customer Amount,TCS,Total Payable,"
//               + "Paid,Due,Vendor Cost,Net Profit,Net Margin %,Type,Status,Travel Date\n");
//
//           for (BookingRevenueRowDTO b : all.getBookings()) {
//               csv.append(String.format(
//                   "%s,\"%s\",%.2f,%.2f,%.2f,%.2f,%.2f,%.2f,%.2f,%.1f%%,%s,%s,%s\n",
//                   b.getCode(), b.getCustomer().replace("\"", "\"\""),
//                   b.getCustomerAmount(), b.getTcs(), b.getTotalPayable(),
//                   b.getPaid(), b.getDue(), b.getVendorCost(),
//                   b.getNetProfit(), b.getNetMargin(),
//                   b.getType(), b.getStatus(), b.getTravelDate()
//               ));
//           }
//           // Totals row
//           double totRevenue = all.getBookings().stream().mapToDouble(BookingRevenueRowDTO::getCustomerAmount).sum();
//           double totProfit  = all.getBookings().stream().mapToDouble(BookingRevenueRowDTO::getNetProfit).sum();
//           double avgMargin  = all.getBookings().isEmpty() ? 0 :
//               all.getBookings().stream().mapToDouble(BookingRevenueRowDTO::getNetMargin).average().orElse(0);
//           csv.append(String.format("TOTALS,,%.2f,,,,,, %.2f,%.1f%%,,,%d bookings\n",
//               totRevenue, totProfit, avgMargin, all.getBookings().size()));
//
//           return csv.toString().getBytes(StandardCharsets.UTF_8);
//       }
//
//       private BookingRevenueRowDTO toRowDTO(Booking b) {
//           DateTimeFormatter dateFmt = DateTimeFormatter.ofPattern("MMM dd, yyyy");
//           double netMargin = b.getTotalPayable() > 0
//               ? (b.getNetProfit() / b.getTotalPayable()) * 100 : 0;
//           return new BookingRevenueRowDTO(
//               b.getId(), b.getBookingCode(),
//               b.getCustomer().getName(),
//               b.getCustomer().getName() + " - " + b.getPackageName(),
//               b.getCustomer().getPhone(),
//               b.getCustomerAmount(), b.getTcsAmount(),
//               b.getTotalPayable(), b.getPaidAmount(),
//               b.getTotalPayable() - b.getPaidAmount(),
//               b.getVendorCost(), b.getNetProfit(),
//               Math.round(netMargin * 10) / 10.0,
//               b.getTripType(), b.getStatus(),
//               b.getTravelDate().format(dateFmt),
//               b.getCreatedAt().format(DateTimeFormatter.ofPattern("MMM dd, yy"))
//           );
//       }
//   }
//
// ── BookingRepository.java (revenue queries) ──────────────────
//
//   @Repository
//   public interface BookingRepository extends JpaRepository<Booking, Long> {
//
//       @Query("SELECT b FROM Booking b JOIN b.customer c WHERE " +
//              "((:dateType = 'Booking Date'  AND b.bookingDate BETWEEN :from AND :to) OR " +
//              " (:dateType = 'Travel Date'   AND b.travelDate  BETWEEN :from AND :to) OR " +
//              " (:dateType = 'Created Date'  AND b.createdAt   BETWEEN :from AND :to)) " +
//              "AND (:status        IS NULL OR b.status        = :status)              " +
//              "AND (:paymentStatus IS NULL OR b.paymentStatus = :paymentStatus)       " +
//              "AND (:minAmount     IS NULL OR b.customerAmount >= :minAmount)          " +
//              "AND (:maxAmount     IS NULL OR b.customerAmount <= :maxAmount)          " +
//              "AND (:search        IS NULL OR LOWER(b.bookingCode) LIKE LOWER(CONCAT('%',:search,'%')) " +
//              "     OR LOWER(c.name) LIKE LOWER(CONCAT('%',:search,'%')))")
//       Page<Booking> findWithRevenueFilters(
//           @Param("from")          LocalDateTime from,
//           @Param("to")            LocalDateTime to,
//           @Param("dateType")      String dateType,
//           @Param("status")        String status,
//           @Param("paymentStatus") String paymentStatus,
//           @Param("minAmount")     Double minAmount,
//           @Param("maxAmount")     Double maxAmount,
//           @Param("search")        String search,
//           Pageable pageable);
//
//       @Query("SELECT COALESCE(SUM(b.customerAmount),0) FROM Booking b " +
//              "WHERE b.bookingDate BETWEEN :from AND :to " +
//              "AND (:status IS NULL OR b.status = :status) " +
//              "AND (:paymentStatus IS NULL OR b.paymentStatus = :paymentStatus) " +
//              "AND (:minAmount IS NULL OR b.customerAmount >= :minAmount) " +
//              "AND (:maxAmount IS NULL OR b.customerAmount <= :maxAmount)")
//       double sumCustomerAmount(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to,
//           @Param("dateType") String dt, @Param("status") String s,
//           @Param("paymentStatus") String ps,
//           @Param("minAmount") Double min, @Param("maxAmount") Double max);
//
//       @Query("SELECT COALESCE(SUM(b.netProfit),0)      FROM Booking b WHERE b.bookingDate BETWEEN :from AND :to")
//       double sumNetProfit(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to,
//           @Param("dateType") String dt, @Param("status") String s,
//           @Param("paymentStatus") String ps, @Param("minAmount") Double min, @Param("maxAmount") Double max);
//
//       @Query("SELECT COALESCE(AVG(b.netMarginPercent),0) FROM Booking b WHERE b.bookingDate BETWEEN :from AND :to")
//       double avgNetMargin(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to,
//           @Param("dateType") String dt, @Param("status") String s,
//           @Param("paymentStatus") String ps, @Param("minAmount") Double min, @Param("maxAmount") Double max);
//
//       @Query("SELECT COALESCE(SUM(b.totalPayable - b.paidAmount),0) FROM Booking b WHERE b.bookingDate BETWEEN :from AND :to")
//       double sumDueAmount(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to,
//           @Param("dateType") String dt, @Param("status") String s,
//           @Param("paymentStatus") String ps, @Param("minAmount") Double min, @Param("maxAmount") Double max);
//
//       @Query("SELECT COALESCE(SUM(b.tcsAmount),0)        FROM Booking b WHERE b.bookingDate BETWEEN :from AND :to")
//       double sumTcs(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to);
//
//       @Query("SELECT COALESCE(SUM(b.totalPayable),0)     FROM Booking b WHERE b.bookingDate BETWEEN :from AND :to")
//       double sumTotalPayable(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to);
//
//       @Query("SELECT COALESCE(SUM(b.paidAmount),0)       FROM Booking b WHERE b.bookingDate BETWEEN :from AND :to")
//       double sumPaidAmount(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to);
//
//       @Query("SELECT COALESCE(SUM(b.refundedAmount),0)   FROM Booking b WHERE b.bookingDate BETWEEN :from AND :to")
//       double sumRefundedAmount(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to);
//
//       @Query("SELECT COUNT(b) FROM Booking b WHERE b.tripType = :type AND b.bookingDate BETWEEN :from AND :to")
//       long countByType(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to, @Param("type") String type);
//
//       @Query("SELECT COUNT(b) FROM Booking b WHERE b.status = :status AND b.bookingDate BETWEEN :from AND :to")
//       long countByStatus(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to, @Param("status") String status);
//   }
//
// ── Booking.java (Entity — relevant columns) ──────────────────
//
//   @Entity @Table(name = "bookings")
//   public class Booking {
//       @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
//
//       @Column(name = "booking_code", unique = true) private String bookingCode; // B000001
//
//       @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "customer_id")
//       private Customer customer;
//
//       @Column(name = "package_name")      private String packageName;
//       @Column(name = "customer_amount")   private Double customerAmount;
//       @Column(name = "tcs_amount")        private Double tcsAmount     = 0.0;
//       @Column(name = "total_payable")     private Double totalPayable;
//       @Column(name = "paid_amount")       private Double paidAmount    = 0.0;
//       @Column(name = "refunded_amount")   private Double refundedAmount= 0.0;
//       @Column(name = "vendor_cost")       private Double vendorCost    = 0.0;
//       @Column(name = "net_profit")        private Double netProfit;
//       @Column(name = "net_margin_percent")private Double netMarginPercent;
//       @Column(name = "trip_type")         private String tripType;     // Domestic | International
//       @Column(name = "status")            private String status;       // Confirmed | Pending | Cancelled | Completed
//       @Column(name = "payment_status")    private String paymentStatus;// Fully Paid | Partially Paid | Unpaid | Refunded
//       @Column(name = "booking_date")      private LocalDate bookingDate;
//       @Column(name = "travel_date")       private LocalDate travelDate;
//       @Column(name = "created_at")        private LocalDateTime createdAt;
//       @PrePersist protected void onCreate() { createdAt = LocalDateTime.now(); }
//       // getters + setters or @Data (Lombok)
//   }
//
// ── All DTOs ──────────────────────────────────────────────────
//
//   // RevenueSummaryDTO.java
//   public class RevenueSummaryDTO {
//       private double totalRevenue;
//       private double netProfit;
//       private double avgNetMargin;
//       private double outstandingDue;
//       // constructor + getters
//   }
//
//   // RevenueBreakdownDTO.java
//   public class RevenueBreakdownDTO {
//       private double tcs;
//       private double totalPayable;
//       private double paidAmount;
//       private double refunded;
//       // constructor + getters
//   }
//
//   // BookingStatisticsDTO.java
//   public class BookingStatisticsDTO {
//       private long international;
//       private long domestic;
//       private long confirmed;
//       private long completed;
//       private long cancelled;
//       // constructor + getters
//   }
//
//   // BookingRevenueRowDTO.java
//   public class BookingRevenueRowDTO {
//       private Long   id;
//       private String code;           // B000003
//       private String customer;       // Customer name
//       private String customerDetail; // Name - Package truncated
//       private String customerPhone;
//       private double customerAmount;
//       private double tcs;
//       private double totalPayable;
//       private double paid;
//       private double due;
//       private double vendorCost;
//       private double netProfit;
//       private double netMargin;      // percentage
//       private String type;           // Domestic | International
//       private String status;         // Confirmed | Pending | ...
//       private String travelDate;     // "Jun 12, 2026"
//       private String createdDate;    // "Jun 26, 14"
//       // constructor + getters or @Data (Lombok)
//   }
//
//   // BookingRevenueResponseDTO.java
//   public class BookingRevenueResponseDTO {
//       private List<BookingRevenueRowDTO> bookings;
//       private long total;
//       private int  page;
//       private int  perPage;
//       private int  totalPages;
//       // constructor + getters
//   }
//
// ─────────────────────────────────────────────────────────────
// ── PostgreSQL Schema (bookings table) ────────────────────────
//
//   CREATE TABLE bookings (
//     id                 BIGSERIAL      PRIMARY KEY,
//     booking_code       VARCHAR(20)    NOT NULL UNIQUE,
//     customer_id        BIGINT         NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
//     package_name       VARCHAR(255),
//     customer_amount    DECIMAL(12,2)  NOT NULL DEFAULT 0,
//     tcs_amount         DECIMAL(12,2)  DEFAULT 0,
//     total_payable      DECIMAL(12,2)  NOT NULL DEFAULT 0,
//     paid_amount        DECIMAL(12,2)  DEFAULT 0,
//     refunded_amount    DECIMAL(12,2)  DEFAULT 0,
//     vendor_cost        DECIMAL(12,2)  DEFAULT 0,
//     net_profit         DECIMAL(12,2)  DEFAULT 0,
//     net_margin_percent DECIMAL(5,2)   DEFAULT 0,
//     trip_type          VARCHAR(20)    DEFAULT 'Domestic',
//     status             VARCHAR(20)    NOT NULL DEFAULT 'Pending',
//     payment_status     VARCHAR(30)    DEFAULT 'Unpaid',
//     booking_date       DATE           NOT NULL,
//     travel_date        DATE,
//     created_at         TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
//
//     CONSTRAINT chk_trip_type     CHECK (trip_type     IN ('Domestic','International')),
//     CONSTRAINT chk_status        CHECK (status        IN ('Confirmed','Pending','Cancelled','Completed')),
//     CONSTRAINT chk_payment_status CHECK (payment_status IN ('Fully Paid','Partially Paid','Unpaid','Refunded'))
//   );
//
//   -- Indexes for fast filtering and aggregation
//   CREATE INDEX idx_bk_booking_date ON bookings (booking_date DESC);
//   CREATE INDEX idx_bk_travel_date  ON bookings (travel_date  DESC);
//   CREATE INDEX idx_bk_customer_id  ON bookings (customer_id);
//   CREATE INDEX idx_bk_status       ON bookings (status);
//   CREATE INDEX idx_bk_trip_type    ON bookings (trip_type);
//   CREATE INDEX idx_bk_payment_status ON bookings (payment_status);
//
//   -- Composite index for date + status filters
//   CREATE INDEX idx_bk_date_status ON bookings (booking_date DESC, status, payment_status);
//
//   -- Auto-generate booking_code trigger
//   CREATE SEQUENCE booking_seq START 1;
//   CREATE OR REPLACE FUNCTION set_booking_code()
//   RETURNS TRIGGER AS $$
//   BEGIN
//     NEW.booking_code = 'B' || LPAD(nextval('booking_seq')::TEXT, 6, '0');
//     RETURN NEW;
//   END;
//   $$ LANGUAGE plpgsql;
//
//   CREATE TRIGGER trg_booking_code
//   BEFORE INSERT ON bookings
//   FOR EACH ROW WHEN (NEW.booking_code IS NULL)
//   EXECUTE PROCEDURE set_booking_code();
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