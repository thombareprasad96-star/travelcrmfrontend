// src/services/intlDomesticService.js
// ─────────────────────────────────────────────────────────────
// International vs Domestic Analysis Page — API Service
// Page: InternationalDomestic.jsx
// Backend: Java Spring Boot REST API
// Database: PostgreSQL
// Covers:
//   - Get International bookings data (panel stats + destinations)
//   - Get Domestic bookings data (panel stats + destinations)
//   - Get distribution data (donut charts: revenue % + bookings %)
//   - Get comparison summary (quick comparison panel)
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
  if (filters.startDate && filters.startDate !== "")                  params.startDate = filters.startDate;
  if (filters.endDate   && filters.endDate   !== "")                  params.endDate   = filters.endDate;
  if (filters.dateType  && filters.dateType  !== "Booking Date")      params.dateType  = filters.dateType;
  if (filters.viewType  && filters.viewType  !== "Overview")          params.viewType  = filters.viewType;
  if (filters.status    && filters.status    !== "All Statuses")      params.status    = filters.status;
  return params;
};


// ═════════════════════════════════════════════════════════════
// INTERNATIONAL vs DOMESTIC SERVICE
// Spring Boot Controller: /api/reports/international-domestic
// PostgreSQL Tables: bookings, customers, leads
// ═════════════════════════════════════════════════════════════
const intlDomesticService = {

  // ── GET INTERNATIONAL PANEL DATA ───────────────────────────
  // GET /api/reports/international-domestic/international
  // @GetMapping("/api/reports/international-domestic/international")
  // public ResponseEntity<TripTypeDataDTO> getInternational(
  //     @RequestParam(required = false)              String startDate,
  //     @RequestParam(required = false)              String endDate,
  //     @RequestParam(defaultValue = "Booking Date") String dateType,
  //     @RequestParam(required = false)              String status)
  //
  // Response:
  // {
  //   totalRevenue:   0.00,
  //   totalBookings:  0,
  //   avgValue:       0.00,     // SUM(customer_amount) / COUNT(*)
  //   avgNights:      0.0,      // AVG(trip_duration)
  //   tcs:            0.00,     // SUM(tcs_amount)
  //   growthPct:      0.0,      // % change vs previous period
  //   destinations: []          // top 5 international destinations
  // }
  getInternational: (filters = {}) => {
    return api.get("/api/reports/international-domestic/international", {
      params: buildParams(filters),
    });
  },

  // ── GET DOMESTIC PANEL DATA ────────────────────────────────
  // GET /api/reports/international-domestic/domestic
  // @GetMapping("/api/reports/international-domestic/domestic")
  // public ResponseEntity<TripTypeDataDTO> getDomestic(
  //     @RequestParam(required = false)              String startDate,
  //     @RequestParam(required = false)              String endDate,
  //     @RequestParam(defaultValue = "Booking Date") String dateType,
  //     @RequestParam(required = false)              String status)
  //
  // Response:
  // {
  //   totalRevenue:   197001.00,
  //   totalBookings:  2,
  //   avgValue:       98500.50,
  //   avgNights:      5.0,
  //   tcs:            0.00,
  //   growthPct:      71.6,
  //   destinations: [
  //     { name:"Nepal", country:"Nepal", bookings:1, revenue:610000 }
  //   ]
  // }
  getDomestic: (filters = {}) => {
    return api.get("/api/reports/international-domestic/domestic", {
      params: buildParams(filters),
    });
  },

  // ── GET BOTH PANELS IN ONE CALL ────────────────────────────
  // GET /api/reports/international-domestic/all
  // @GetMapping("/api/reports/international-domestic/all")
  // public ResponseEntity<IntlDomesticResponseDTO> getAll(
  //     @RequestParam(required = false)              String startDate,
  //     @RequestParam(required = false)              String endDate,
  //     @RequestParam(defaultValue = "Booking Date") String dateType,
  //     @RequestParam(required = false)              String status)
  //
  // Preferred single call that returns both panels + distribution
  //
  // Response:
  // {
  //   international: { totalRevenue, totalBookings, avgValue, avgNights, tcs, growthPct, destinations: [] },
  //   domestic:      { totalRevenue, totalBookings, avgValue, avgNights, tcs, growthPct, destinations: [...] },
  //   distribution: {
  //     intlRevenuePct:  0,    // % of total revenue from International
  //     domRevenuePct:   100,  // % of total revenue from Domestic
  //     intlBookingsPct: 0,    // % of total bookings from International
  //     domBookingsPct:  100   // % of total bookings from Domestic
  //   }
  // }
  getAll: (filters = {}) => {
    return api.get("/api/reports/international-domestic/all", {
      params: buildParams(filters),
    });
  },

  // ── GET DISTRIBUTION (donut chart data) ────────────────────
  // GET /api/reports/international-domestic/distribution
  // @GetMapping("/api/reports/international-domestic/distribution")
  // public ResponseEntity<DistributionDTO> getDistribution(
  //     @RequestParam(required = false)              String startDate,
  //     @RequestParam(required = false)              String endDate,
  //     @RequestParam(defaultValue = "Booking Date") String dateType,
  //     @RequestParam(required = false)              String status)
  //
  // Response:
  // {
  //   intlRevenuePct:  0,
  //   domRevenuePct:   100,
  //   intlBookingsPct: 0,
  //   domBookingsPct:  100,
  //   totalRevenue:    197001.00,
  //   totalBookings:   2,
  //   intlRevenue:     0.00,
  //   domRevenue:      197001.00,
  //   intlBookings:    0,
  //   domBookings:     2
  // }
  getDistribution: (filters = {}) => {
    return api.get("/api/reports/international-domestic/distribution", {
      params: buildParams(filters),
    });
  },

  // ── GET TOP DESTINATIONS (for either type) ─────────────────
  // GET /api/reports/international-domestic/destinations
  // @GetMapping("/api/reports/international-domestic/destinations")
  // public ResponseEntity<List<DestinationDTO>> getDestinations(
  //     @RequestParam                                String tripType,
  //     @RequestParam(required = false)              String startDate,
  //     @RequestParam(required = false)              String endDate,
  //     @RequestParam(defaultValue = "Booking Date") String dateType,
  //     @RequestParam(required = false)              String status,
  //     @RequestParam(defaultValue = "5")            int    topN)
  //
  // tripType: "International" | "Domestic"
  //
  // Response:
  // [
  //   { name:"Nepal", country:"Nepal", bookings:1, revenue:610000 },
  //   { name:"Thailand", country:"Thailand", bookings:0, revenue:0 },
  // ]
  getDestinations: (tripType, filters = {}, topN = 5) => {
    return api.get("/api/reports/international-domestic/destinations", {
      params: { tripType, topN, ...buildParams(filters) },
    });
  },

  // ── EXPORT CSV ─────────────────────────────────────────────
  // GET /api/reports/international-domestic/export/csv
  // @GetMapping("/api/reports/international-domestic/export/csv")
  // public ResponseEntity<byte[]> exportCsv(
  //     @RequestParam(required = false)              String startDate,
  //     @RequestParam(required = false)              String endDate,
  //     @RequestParam(defaultValue = "Booking Date") String dateType,
  //     @RequestParam(required = false)              String status)
  //
  // Exports summary comparison + top destinations for both types
  // Content-Disposition: attachment; filename="intl-domestic-report-..."
  exportCsv: (filters = {}) => {
    return api.get("/api/reports/international-domestic/export/csv", {
      params: buildParams(filters),
      responseType: "blob",
    });
  },
};

export default intlDomesticService;


// ═════════════════════════════════════════════════════════════
// HOW TO USE IN InternationalDomestic.jsx
// ═════════════════════════════════════════════════════════════
//
// STEP 1 — Import at top of InternationalDomestic.jsx:
//   import intlDomesticService
//     from "../services/intlDomesticService";
//
// ─────────────────────────────────────────────────────────────
// STEP 2 — Replace mock useEffect (recommended: single getAll call):
//
//   useEffect(() => {
//     setLoading(true);
//     intlDomesticService
//       .getAll({
//         startDate: applied.startDate,
//         endDate:   applied.endDate,
//         dateType:  applied.dateType,
//         status:    applied.status,
//       })
//       .then((res) => {
//         setIntl(res.data.international);
//         setDomestic(res.data.domestic);
//         // Distribution is computed from intl + domestic in the component
//         // (or you can use res.data.distribution directly)
//       })
//       .catch(() => showToast("Failed to load data.", "error"))
//       .finally(() => setLoading(false));
//   }, [applied]);
//
//   // Alternative: load all 3 in parallel for maximum performance
//   // useEffect(() => {
//   //   setLoading(true);
//   //   Promise.all([
//   //     intlDomesticService.getInternational(applied),
//   //     intlDomesticService.getDomestic(applied),
//   //   ])
//   //     .then(([intlRes, domRes]) => {
//   //       setIntl(intlRes.data);
//   //       setDomestic(domRes.data);
//   //     })
//   //     .catch(() => showToast("Failed to load data.", "error"))
//   //     .finally(() => setLoading(false));
//   // }, [applied]);
//
// ─────────────────────────────────────────────────────────────
// STEP 3 — Replace handleExportCSV:
//
//   const handleExportCSV = async () => {
//     try {
//       const res = await intlDomesticService.exportCsv({
//         startDate: applied.startDate,
//         endDate:   applied.endDate,
//         dateType:  applied.dateType,
//         status:    applied.status,
//       });
//       const url  = window.URL.createObjectURL(new Blob([res.data]));
//       const link = document.createElement("a");
//       link.href  = url;
//       link.setAttribute(
//         "download",
//         `intl-domestic-${applied.startDate}-to-${applied.endDate}.csv`
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
// ── IntlDomesticController.java ───────────────────────────────
//
//   @RestController
//   @RequestMapping("/api/reports/international-domestic")
//   @CrossOrigin(origins = "http://localhost:3000")
//   public class IntlDomesticController {
//
//       @Autowired private IntlDomesticService service;
//
//       // Single endpoint — returns both panels + distribution
//       @GetMapping("/all")
//       public ResponseEntity<IntlDomesticResponseDTO> getAll(
//           @RequestParam(required = false)              String startDate,
//           @RequestParam(required = false)              String endDate,
//           @RequestParam(defaultValue = "Booking Date") String dateType,
//           @RequestParam(required = false)              String status) {
//           return ResponseEntity.ok(
//               service.getAll(startDate, endDate, dateType, status));
//       }
//
//       // International panel only
//       @GetMapping("/international")
//       public ResponseEntity<TripTypeDataDTO> getInternational(
//           @RequestParam(required = false)              String startDate,
//           @RequestParam(required = false)              String endDate,
//           @RequestParam(defaultValue = "Booking Date") String dateType,
//           @RequestParam(required = false)              String status) {
//           return ResponseEntity.ok(
//               service.getByTripType("International",
//                   startDate, endDate, dateType, status));
//       }
//
//       // Domestic panel only
//       @GetMapping("/domestic")
//       public ResponseEntity<TripTypeDataDTO> getDomestic(
//           @RequestParam(required = false)              String startDate,
//           @RequestParam(required = false)              String endDate,
//           @RequestParam(defaultValue = "Booking Date") String dateType,
//           @RequestParam(required = false)              String status) {
//           return ResponseEntity.ok(
//               service.getByTripType("Domestic",
//                   startDate, endDate, dateType, status));
//       }
//
//       // Distribution only (for donut charts)
//       @GetMapping("/distribution")
//       public ResponseEntity<DistributionDTO> getDistribution(
//           @RequestParam(required = false)              String startDate,
//           @RequestParam(required = false)              String endDate,
//           @RequestParam(defaultValue = "Booking Date") String dateType,
//           @RequestParam(required = false)              String status) {
//           return ResponseEntity.ok(
//               service.getDistribution(startDate, endDate, dateType, status));
//       }
//
//       // Top destinations for a given trip type
//       @GetMapping("/destinations")
//       public ResponseEntity<List<DestinationDTO>> getDestinations(
//           @RequestParam                                String tripType,
//           @RequestParam(required = false)              String startDate,
//           @RequestParam(required = false)              String endDate,
//           @RequestParam(defaultValue = "Booking Date") String dateType,
//           @RequestParam(required = false)              String status,
//           @RequestParam(defaultValue = "5")            int    topN) {
//           return ResponseEntity.ok(
//               service.getTopDestinations(tripType,
//                   startDate, endDate, dateType, status, topN));
//       }
//
//       // Export CSV
//       @GetMapping("/export/csv")
//       public ResponseEntity<byte[]> exportCsv(
//           @RequestParam(required = false)              String startDate,
//           @RequestParam(required = false)              String endDate,
//           @RequestParam(defaultValue = "Booking Date") String dateType,
//           @RequestParam(required = false)              String status) {
//           byte[] csv = service.exportCsv(startDate, endDate, dateType, status);
//           String filename = "intl-domestic-" + startDate + "-to-" + endDate + ".csv";
//           return ResponseEntity.ok()
//               .header("Content-Disposition", "attachment; filename=" + filename)
//               .contentType(MediaType.parseMediaType("text/csv"))
//               .body(csv);
//       }
//   }
//
// ── IntlDomesticService.java ──────────────────────────────────
//
//   @Service
//   public class IntlDomesticService {
//
//       @Autowired private BookingRepository repo;
//
//       private LocalDateTime[] resolveDates(String start, String end, String dateType) {
//           LocalDateTime from = start != null
//               ? LocalDate.parse(start).atStartOfDay()
//               : LocalDateTime.now().minusDays(30);
//           LocalDateTime to = end != null
//               ? LocalDate.parse(end).atTime(23, 59, 59)
//               : LocalDateTime.now();
//           return new LocalDateTime[]{ from, to };
//       }
//
//       public IntlDomesticResponseDTO getAll(
//               String start, String end, String dateType, String status) {
//           TripTypeDataDTO intl = getByTripType("International", start, end, dateType, status);
//           TripTypeDataDTO dom  = getByTripType("Domestic",      start, end, dateType, status);
//           DistributionDTO dist = computeDistribution(intl, dom);
//           return new IntlDomesticResponseDTO(intl, dom, dist);
//       }
//
//       public TripTypeDataDTO getByTripType(
//               String tripType, String start, String end,
//               String dateType, String status) {
//           LocalDateTime[] dates = resolveDates(start, end, dateType);
//           LocalDateTime from = dates[0], to = dates[1];
//
//           double revenue   = repo.sumRevenueByType(from, to, tripType, status);
//           long   bookings  = repo.countByType(from, to, tripType, status);
//           double avgValue  = bookings > 0 ? revenue / bookings : 0;
//           double avgNights = repo.avgDurationByType(from, to, tripType, status);
//           double tcs       = repo.sumTcsByType(from, to, tripType, status);
//           double growthPct = repo.avgNetMarginByType(from, to, tripType, status);
//
//           List<DestinationDTO> destinations =
//               getTopDestinations(tripType, start, end, dateType, status, 5);
//
//           return new TripTypeDataDTO(revenue, bookings, avgValue,
//               avgNights, tcs, growthPct, destinations);
//       }
//
//       public List<DestinationDTO> getTopDestinations(
//               String tripType, String start, String end,
//               String dateType, String status, int topN) {
//           LocalDateTime[] dates = resolveDates(start, end, dateType);
//           return repo.findTopDestinations(
//               dates[0], dates[1], tripType, status, topN)
//               .stream()
//               .map(r -> new DestinationDTO(
//                   (String) r[0],                      // destination name
//                   (String) r[1],                      // country
//                   ((Number) r[2]).intValue(),          // bookings count
//                   ((Number) r[3]).doubleValue()        // revenue
//               ))
//               .collect(Collectors.toList());
//       }
//
//       public DistributionDTO getDistribution(
//               String start, String end, String dateType, String status) {
//           TripTypeDataDTO intl = getByTripType("International", start, end, dateType, status);
//           TripTypeDataDTO dom  = getByTripType("Domestic",      start, end, dateType, status);
//           return computeDistribution(intl, dom);
//       }
//
//       private DistributionDTO computeDistribution(
//               TripTypeDataDTO intl, TripTypeDataDTO dom) {
//           double totRev = intl.getTotalRevenue() + dom.getTotalRevenue();
//           long   totBkg = intl.getTotalBookings() + dom.getTotalBookings();
//           int intlRevPct = totRev > 0
//               ? (int) Math.round(intl.getTotalRevenue() / totRev * 100) : 0;
//           int intlBkgPct = totBkg > 0
//               ? (int) Math.round((double) intl.getTotalBookings() / totBkg * 100) : 0;
//           return new DistributionDTO(
//               intlRevPct, 100 - intlRevPct,
//               intlBkgPct, 100 - intlBkgPct,
//               totRev, totBkg,
//               intl.getTotalRevenue(), dom.getTotalRevenue(),
//               intl.getTotalBookings(), dom.getTotalBookings()
//           );
//       }
//
//       public byte[] exportCsv(String start, String end,
//               String dateType, String status) {
//           TripTypeDataDTO intl = getByTripType("International", start, end, dateType, status);
//           TripTypeDataDTO dom  = getByTripType("Domestic",      start, end, dateType, status);
//
//           StringBuilder csv = new StringBuilder();
//           csv.append("Type,Total Revenue,Total Bookings,Avg Value,Avg Nights (Days),TCS,Growth %\n");
//           csv.append(String.format("International,%.2f,%d,%.2f,%.1f,%.2f,%.1f%%\n",
//               intl.getTotalRevenue(), intl.getTotalBookings(), intl.getAvgValue(),
//               intl.getAvgNights(), intl.getTcs(), intl.getGrowthPct()));
//           csv.append(String.format("Domestic,%.2f,%d,%.2f,%.1f,%.2f,%.1f%%\n",
//               dom.getTotalRevenue(), dom.getTotalBookings(), dom.getAvgValue(),
//               dom.getAvgNights(), dom.getTcs(), dom.getGrowthPct()));
//
//           // International destinations section
//           csv.append("\nTop International Destinations\n");
//           csv.append("Destination,Country,Bookings,Revenue\n");
//           for (DestinationDTO d : intl.getDestinations())
//               csv.append(String.format("%s,%s,%d,%.2f\n",
//                   d.getName(), d.getCountry(), d.getBookings(), d.getRevenue()));
//
//           // Domestic destinations section
//           csv.append("\nTop Domestic Destinations\n");
//           csv.append("Destination,Country,Bookings,Revenue\n");
//           for (DestinationDTO d : dom.getDestinations())
//               csv.append(String.format("%s,%s,%d,%.2f\n",
//                   d.getName(), d.getCountry(), d.getBookings(), d.getRevenue()));
//
//           return csv.toString().getBytes(StandardCharsets.UTF_8);
//       }
//   }
//
// ── BookingRepository.java (intl/domestic queries) ────────────
//
//   @Repository
//   public interface BookingRepository extends JpaRepository<Booking, Long> {
//
//       // Sum revenue by trip type
//       @Query("SELECT COALESCE(SUM(b.customerAmount), 0) FROM Booking b WHERE " +
//              "b.bookingDate BETWEEN :from AND :to " +
//              "AND b.tripType = :tripType " +
//              "AND (:status IS NULL OR b.status = :status)")
//       double sumRevenueByType(
//           @Param("from") LocalDateTime from, @Param("to") LocalDateTime to,
//           @Param("tripType") String tripType, @Param("status") String status);
//
//       // Count bookings by trip type
//       @Query("SELECT COUNT(b) FROM Booking b WHERE " +
//              "b.bookingDate BETWEEN :from AND :to " +
//              "AND b.tripType = :tripType " +
//              "AND (:status IS NULL OR b.status = :status)")
//       long countByType(
//           @Param("from") LocalDateTime from, @Param("to") LocalDateTime to,
//           @Param("tripType") String tripType, @Param("status") String status);
//
//       // Average trip duration by type
//       @Query("SELECT COALESCE(AVG(b.tripDuration), 0) FROM Booking b WHERE " +
//              "b.bookingDate BETWEEN :from AND :to " +
//              "AND b.tripType = :tripType " +
//              "AND (:status IS NULL OR b.status = :status)")
//       double avgDurationByType(
//           @Param("from") LocalDateTime from, @Param("to") LocalDateTime to,
//           @Param("tripType") String tripType, @Param("status") String status);
//
//       // Sum TCS by trip type
//       @Query("SELECT COALESCE(SUM(b.tcsAmount), 0) FROM Booking b WHERE " +
//              "b.bookingDate BETWEEN :from AND :to " +
//              "AND b.tripType = :tripType " +
//              "AND (:status IS NULL OR b.status = :status)")
//       double sumTcsByType(
//           @Param("from") LocalDateTime from, @Param("to") LocalDateTime to,
//           @Param("tripType") String tripType, @Param("status") String status);
//
//       // Avg net margin by trip type
//       @Query("SELECT COALESCE(AVG(b.netMarginPercent), 0) FROM Booking b WHERE " +
//              "b.bookingDate BETWEEN :from AND :to " +
//              "AND b.tripType = :tripType " +
//              "AND (:status IS NULL OR b.status = :status)")
//       double avgNetMarginByType(
//           @Param("from") LocalDateTime from, @Param("to") LocalDateTime to,
//           @Param("tripType") String tripType, @Param("status") String status);
//
//       // Top N destinations by booking count for a trip type
//       @Query(value = """
//           SELECT
//             b.destination                            AS name,
//             COALESCE(b.destination_country, 'India') AS country,
//             COUNT(*)                                 AS bookings,
//             COALESCE(SUM(b.customer_amount), 0)      AS revenue
//           FROM bookings b
//           WHERE b.booking_date BETWEEN :from AND :to
//             AND b.trip_type = :tripType
//             AND (:status IS NULL OR b.status = :status)
//             AND b.destination IS NOT NULL
//           GROUP BY b.destination, b.destination_country
//           ORDER BY bookings DESC, revenue DESC
//           LIMIT :topN
//           """, nativeQuery = true)
//       List<Object[]> findTopDestinations(
//           @Param("from")     LocalDateTime from,
//           @Param("to")       LocalDateTime to,
//           @Param("tripType") String tripType,
//           @Param("status")   String status,
//           @Param("topN")     int topN);
//   }
//
// ── All DTOs ──────────────────────────────────────────────────
//
//   // TripTypeDataDTO.java
//   public class TripTypeDataDTO {
//       private double            totalRevenue;
//       private long              totalBookings;
//       private double            avgValue;
//       private double            avgNights;
//       private double            tcs;
//       private double            growthPct;
//       private List<DestinationDTO> destinations;
//       // constructor + getters or @Data (Lombok)
//   }
//
//   // DestinationDTO.java
//   public class DestinationDTO {
//       private String name;
//       private String country;
//       private int    bookings;
//       private double revenue;
//       // constructor + getters
//   }
//
//   // DistributionDTO.java
//   public class DistributionDTO {
//       private int    intlRevenuePct;
//       private int    domRevenuePct;
//       private int    intlBookingsPct;
//       private int    domBookingsPct;
//       private double totalRevenue;
//       private long   totalBookings;
//       private double intlRevenue;
//       private double domRevenue;
//       private long   intlBookings;
//       private long   domBookings;
//       // constructor + getters
//   }
//
//   // IntlDomesticResponseDTO.java
//   public class IntlDomesticResponseDTO {
//       private TripTypeDataDTO international;
//       private TripTypeDataDTO domestic;
//       private DistributionDTO distribution;
//       // constructor + getters
//   }
//
// ─────────────────────────────────────────────────────────────
// ── PostgreSQL Schema (bookings — intl/domestic columns) ──────
//
//   -- Ensure these columns exist on your bookings table:
//   ALTER TABLE bookings
//     ADD COLUMN IF NOT EXISTS destination         VARCHAR(100),
//     ADD COLUMN IF NOT EXISTS destination_country VARCHAR(100) DEFAULT 'India',
//     ADD COLUMN IF NOT EXISTS trip_type           VARCHAR(20)  DEFAULT 'Domestic',
//     ADD COLUMN IF NOT EXISTS trip_duration       INTEGER,
//     ADD COLUMN IF NOT EXISTS net_margin_percent  DECIMAL(5,2) DEFAULT 0,
//     ADD COLUMN IF NOT EXISTS tcs_amount          DECIMAL(12,2) DEFAULT 0;
//
//   -- Indexes for fast type-based filtering and aggregation
//   CREATE INDEX IF NOT EXISTS idx_bk_trip_type         ON bookings (trip_type);
//   CREATE INDEX IF NOT EXISTS idx_bk_destination       ON bookings (destination);
//   CREATE INDEX IF NOT EXISTS idx_bk_dest_country      ON bookings (destination_country);
//   CREATE INDEX IF NOT EXISTS idx_bk_booking_date_type ON bookings (booking_date, trip_type);
//
//   -- Composite index for most common filter combo
//   CREATE INDEX IF NOT EXISTS idx_bk_intl_domestic
//     ON bookings (booking_date DESC, trip_type, status);
//
//   -- Constraint for trip_type
//   ALTER TABLE bookings
//     ADD CONSTRAINT IF NOT EXISTS chk_trip_type
//     CHECK (trip_type IN ('Domestic', 'International'));
//
//   -- Sample seed data
//   UPDATE bookings SET
//     destination         = 'Nepal',
//     destination_country = 'Nepal',
//     trip_type           = 'Domestic',
//     trip_duration       = 5
//   WHERE id IN (1, 2);
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