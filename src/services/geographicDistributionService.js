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


// ═════════════════════════════════════════════════════════════
// HOW TO USE IN GeographicDistribution.jsx
// ═════════════════════════════════════════════════════════════
//
// STEP 1 — Import:
//   import geographicDistributionService
//     from "../services/geographicDistributionService";
//
// ─────────────────────────────────────────────────────────────
// STEP 2 — Replace mock useEffect:
//
//   useEffect(() => {
//     setLoading(true);
//     Promise.all([
//       geographicDistributionService.getData({
//         startDate: applied.startDate,
//         endDate:   applied.endDate,
//         viewType:  applied.viewType,
//         leadType:  applied.leadType,
//         leadStage: applied.leadStage,
//         search,
//         page,
//         perPage:   Number(showEntries),
//       }),
//       geographicDistributionService.getSummary({
//         startDate: applied.startDate,
//         endDate:   applied.endDate,
//         leadType:  applied.leadType,
//         leadStage: applied.leadStage,
//       }),
//     ])
//       .then(([dataRes, summaryRes]) => {
//         setData(dataRes.data.rows);
//         setTotalCount(dataRes.data.total);
//         setSummary({
//           total:     summaryRes.data.totalLeads,
//           hot:       summaryRes.data.hotLeads,
//           warm:      summaryRes.data.warmLeads,
//           cold:      summaryRes.data.coldLeads,
//           fresh:     summaryRes.data.freshLeads,
//           converted: summaryRes.data.converted,
//         });
//       })
//       .catch(() => showToast("Failed to load geographic data.", "error"))
//       .finally(() => setLoading(false));
//   }, [applied, page, showEntries, search]);
//
// ─────────────────────────────────────────────────────────────
// STEP 3 — Replace handleExportCSV:
//
//   const handleExportCSV = async () => {
//     try {
//       const res = await geographicDistributionService.exportCsv({
//         startDate: applied.startDate,
//         endDate:   applied.endDate,
//         viewType:  applied.viewType,
//         leadType:  applied.leadType,
//         leadStage: applied.leadStage,
//         search,
//       });
//       const url  = window.URL.createObjectURL(new Blob([res.data]));
//       const link = document.createElement("a");
//       link.href  = url;
//       link.setAttribute(
//         "download",
//         `geographic-report-${applied.startDate}-to-${applied.endDate}.csv`
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
// ── GeoDistributionController.java ───────────────────────────
//
//   @RestController
//   @RequestMapping("/api/reports/geographic")
//   @CrossOrigin(origins = "http://localhost:3000")
//   public class GeoDistributionController {
//
//       @Autowired private GeoDistributionService service;
//
//       @GetMapping("/data")
//       public ResponseEntity<GeoDistributionResponseDTO> getData(
//           @RequestParam(required = false) String startDate,
//           @RequestParam(required = false) String endDate,
//           @RequestParam(defaultValue = "Departing Cities") String viewType,
//           @RequestParam(required = false) String leadType,
//           @RequestParam(required = false) String leadStage,
//           @RequestParam(required = false) String search,
//           @RequestParam(defaultValue = "25") int perPage,
//           @RequestParam(defaultValue = "1")  int page) {
//           return ResponseEntity.ok(
//               service.getData(startDate, endDate, viewType,
//                               leadType, leadStage, search, perPage, page));
//       }
//
//       @GetMapping("/summary")
//       public ResponseEntity<GeoSummaryDTO> getSummary(
//           @RequestParam(required = false) String startDate,
//           @RequestParam(required = false) String endDate,
//           @RequestParam(required = false) String leadType,
//           @RequestParam(required = false) String leadStage) {
//           return ResponseEntity.ok(
//               service.getSummary(startDate, endDate, leadType, leadStage));
//       }
//
//       @GetMapping("/export/csv")
//       public ResponseEntity<byte[]> exportCsv(
//           @RequestParam(required = false) String startDate,
//           @RequestParam(required = false) String endDate,
//           @RequestParam(defaultValue = "Departing Cities") String viewType,
//           @RequestParam(required = false) String leadType,
//           @RequestParam(required = false) String leadStage,
//           @RequestParam(required = false) String search) {
//           byte[] csv = service.exportCsv(
//               startDate, endDate, viewType, leadType, leadStage, search);
//           String filename = "geographic-report-" + startDate + "-to-" + endDate + ".csv";
//           return ResponseEntity.ok()
//               .header("Content-Disposition", "attachment; filename=" + filename)
//               .contentType(MediaType.parseMediaType("text/csv"))
//               .body(csv);
//       }
//   }
//
// ── GeoDistributionService.java ──────────────────────────────
//
//   @Service
//   public class GeoDistributionService {
//
//       @Autowired private LeadRepository leadRepo;
//
//       private LocalDateTime[] resolveDates(String startDate, String endDate) {
//           LocalDateTime from = startDate != null
//               ? LocalDate.parse(startDate).atStartOfDay()
//               : LocalDateTime.now().minusDays(30);
//           LocalDateTime to = endDate != null
//               ? LocalDate.parse(endDate).atTime(23, 59, 59)
//               : LocalDateTime.now();
//           return new LocalDateTime[]{ from, to };
//       }
//
//       // Determines which column to GROUP BY based on viewType
//       private String resolveGroupColumn(String viewType) {
//           return switch (viewType) {
//               case "Destinations"  -> "l.destination";
//               case "States"        -> "l.state";
//               case "Countries"     -> "l.country";
//               default              -> "l.departing_city";
//           };
//       }
//
//       public GeoDistributionResponseDTO getData(
//               String startDate, String endDate, String viewType,
//               String leadType, String leadStage, String search,
//               int perPage, int page) {
//
//           LocalDateTime[] dates = resolveDates(startDate, endDate);
//           String groupCol = resolveGroupColumn(viewType);
//
//           // Raw SQL via JPA native query — dynamic GROUP BY
//           List<Object[]> results = leadRepo.findGeoDistribution(
//               dates[0], dates[1], groupCol, leadType, leadStage, search,
//               perPage, (page - 1) * perPage);
//
//           long total = leadRepo.countGeoDistinctLocations(
//               dates[0], dates[1], groupCol, leadType, leadStage, search);
//
//           List<GeoRowDTO> rows = results.stream().map(r -> {
//               long rowTotal    = ((Number) r[2]).longValue();
//               long converted   = ((Number) r[7]).longValue();
//               double convRate  = rowTotal > 0
//                   ? Math.round((double) converted / rowTotal * 1000) / 10.0
//                   : 0.0;
//               return new GeoRowDTO(
//                   (String) r[0],         // city/destination/state/country
//                   (String) r[1],         // country
//                   rowTotal,              // total
//                   ((Number) r[3]).longValue(), // hot
//                   ((Number) r[4]).longValue(), // warm
//                   ((Number) r[5]).longValue(), // cold
//                   ((Number) r[6]).longValue(), // fresh
//                   converted,             // converted
//                   convRate               // conversionRate
//               );
//           }).collect(Collectors.toList());
//
//           return new GeoDistributionResponseDTO(
//               rows, total, page, perPage,
//               (int) Math.ceil((double) total / perPage));
//       }
//
//       public GeoSummaryDTO getSummary(
//               String startDate, String endDate,
//               String leadType, String leadStage) {
//           LocalDateTime[] dates = resolveDates(startDate, endDate);
//           return new GeoSummaryDTO(
//               leadRepo.countByDateRange(dates[0], dates[1], leadType, leadStage),
//               leadRepo.countByTemperature(dates[0], dates[1], "Hot",   leadType, leadStage),
//               leadRepo.countByTemperature(dates[0], dates[1], "Warm",  leadType, leadStage),
//               leadRepo.countByTemperature(dates[0], dates[1], "Cold",  leadType, leadStage),
//               leadRepo.countByTemperature(dates[0], dates[1], "Fresh", leadType, leadStage),
//               leadRepo.countByStage(dates[0], dates[1], "Converted",   leadType)
//           );
//       }
//
//       public byte[] exportCsv(
//               String startDate, String endDate, String viewType,
//               String leadType, String leadStage, String search) {
//           // fetch all rows (no pagination)
//           GeoDistributionResponseDTO all =
//               getData(startDate, endDate, viewType, leadType, leadStage, search, Integer.MAX_VALUE, 1);
//
//           long grandTotal = all.getRows().stream()
//               .mapToLong(GeoRowDTO::getTotal).sum();
//
//           StringBuilder csv = new StringBuilder();
//           csv.append("City,Country,Total Leads,Hot,Warm,Cold,Fresh,Converted,Conversion Rate,Distribution\n");
//
//           for (GeoRowDTO r : all.getRows()) {
//               double dist = grandTotal > 0
//                   ? Math.round((double) r.getTotal() / grandTotal * 1000) / 10.0
//                   : 0.0;
//               csv.append(String.format("%s,%s,%d,%d,%d,%d,%d,%d,%.1f%%,%.1f%%\n",
//                   r.getCity(), r.getCountry(),
//                   r.getTotal(), r.getHot(), r.getWarm(),
//                   r.getCold(), r.getFresh(), r.getConverted(),
//                   r.getConversionRate(), dist));
//           }
//           // Totals row
//           long totHot  = all.getRows().stream().mapToLong(GeoRowDTO::getHot).sum();
//           long totWarm = all.getRows().stream().mapToLong(GeoRowDTO::getWarm).sum();
//           long totCold = all.getRows().stream().mapToLong(GeoRowDTO::getCold).sum();
//           long totFresh= all.getRows().stream().mapToLong(GeoRowDTO::getFresh).sum();
//           long totConv = all.getRows().stream().mapToLong(GeoRowDTO::getConverted).sum();
//           double totConvRate = grandTotal > 0
//               ? Math.round((double) totConv / grandTotal * 1000) / 10.0 : 0.0;
//           csv.append(String.format("TOTALS,,%d,%d,%d,%d,%d,%d,%.1f%%,100.0%%\n",
//               grandTotal, totHot, totWarm, totCold, totFresh, totConv, totConvRate));
//
//           return csv.toString().getBytes(StandardCharsets.UTF_8);
//       }
//   }
//
// ── LeadRepository.java (geographic queries) ─────────────────
//
//   @Repository
//   public interface LeadRepository extends JpaRepository<Lead, Long> {
//
//       // Count total leads in date range with optional filters
//       @Query("SELECT COUNT(l) FROM Lead l WHERE " +
//              "l.createdAt BETWEEN :from AND :to " +
//              "AND (:leadType  IS NULL OR l.leadType  = :leadType)  " +
//              "AND (:leadStage IS NULL OR l.stage     = :leadStage)")
//       long countByDateRange(
//           @Param("from")      LocalDateTime from,
//           @Param("to")        LocalDateTime to,
//           @Param("leadType")  String leadType,
//           @Param("leadStage") String leadStage);
//
//       // Count by temperature (hot/warm/cold/fresh)
//       @Query("SELECT COUNT(l) FROM Lead l WHERE " +
//              "l.createdAt BETWEEN :from AND :to " +
//              "AND l.temperature = :temp " +
//              "AND (:leadType IS NULL OR l.leadType = :leadType) " +
//              "AND (:leadStage IS NULL OR l.stage   = :leadStage)")
//       long countByTemperature(
//           @Param("from")      LocalDateTime from,
//           @Param("to")        LocalDateTime to,
//           @Param("temp")      String temperature,
//           @Param("leadType")  String leadType,
//           @Param("leadStage") String leadStage);
//
//       // Count converted leads
//       @Query("SELECT COUNT(l) FROM Lead l WHERE " +
//              "l.createdAt BETWEEN :from AND :to " +
//              "AND l.stage = 'Converted' " +
//              "AND (:leadType IS NULL OR l.leadType = :leadType)")
//       long countByStage(
//           @Param("from")     LocalDateTime from,
//           @Param("to")       LocalDateTime to,
//           @Param("stage")    String stage,
//           @Param("leadType") String leadType);
//
//       // Geographic distribution — native query for dynamic GROUP BY
//       @Query(value = """
//           SELECT
//             l.departing_city   AS location,
//             l.country          AS country,
//             COUNT(*)           AS total,
//             SUM(CASE WHEN l.temperature = 'Hot'   THEN 1 ELSE 0 END) AS hot,
//             SUM(CASE WHEN l.temperature = 'Warm'  THEN 1 ELSE 0 END) AS warm,
//             SUM(CASE WHEN l.temperature = 'Cold'  THEN 1 ELSE 0 END) AS cold,
//             SUM(CASE WHEN l.temperature = 'Fresh' THEN 1 ELSE 0 END) AS fresh,
//             SUM(CASE WHEN l.stage = 'Converted'   THEN 1 ELSE 0 END) AS converted
//           FROM leads l
//           WHERE l.created_at BETWEEN :from AND :to
//             AND (:leadType  IS NULL OR l.lead_type = :leadType)
//             AND (:leadStage IS NULL OR l.stage     = :leadStage)
//             AND (:search    IS NULL OR LOWER(l.departing_city) LIKE LOWER(CONCAT('%', :search, '%'))
//                                    OR LOWER(l.country)         LIKE LOWER(CONCAT('%', :search, '%')))
//           GROUP BY l.departing_city, l.country
//           ORDER BY total DESC
//           LIMIT :perPage OFFSET :offset
//           """, nativeQuery = true)
//       List<Object[]> findGeoDistribution(
//           @Param("from")      LocalDateTime from,
//           @Param("to")        LocalDateTime to,
//           @Param("leadType")  String leadType,
//           @Param("leadStage") String leadStage,
//           @Param("search")    String search,
//           @Param("perPage")   int perPage,
//           @Param("offset")    int offset);
//
//       @Query(value = """
//           SELECT COUNT(DISTINCT l.departing_city) FROM leads l
//           WHERE l.created_at BETWEEN :from AND :to
//             AND (:leadType  IS NULL OR l.lead_type = :leadType)
//             AND (:leadStage IS NULL OR l.stage     = :leadStage)
//             AND (:search    IS NULL OR LOWER(l.departing_city) LIKE LOWER(CONCAT('%', :search, '%'))
//                                    OR LOWER(l.country)         LIKE LOWER(CONCAT('%', :search, '%')))
//           """, nativeQuery = true)
//       long countGeoDistinctLocations(
//           @Param("from")      LocalDateTime from,
//           @Param("to")        LocalDateTime to,
//           @Param("groupCol")  String groupCol,
//           @Param("leadType")  String leadType,
//           @Param("leadStage") String leadStage,
//           @Param("search")    String search);
//   }
//
// ── GeoRowDTO.java ────────────────────────────────────────────
//
//   public class GeoRowDTO {
//       private Long   id;
//       private String city;           // city/destination/state/country
//       private String country;
//       private long   total;
//       private long   hot;
//       private long   warm;
//       private long   cold;
//       private long   fresh;
//       private long   converted;
//       private double conversionRate;
//       private double distribution;   // % of grand total (computed client-side too)
//       // constructor + getters or @Data (Lombok)
//   }
//
// ── GeoDistributionResponseDTO.java ──────────────────────────
//
//   public class GeoDistributionResponseDTO {
//       private List<GeoRowDTO> rows;
//       private long  total;
//       private int   page;
//       private int   perPage;
//       private int   totalPages;
//       // constructor + getters
//   }
//
// ── GeoSummaryDTO.java ────────────────────────────────────────
//
//   public class GeoSummaryDTO {
//       private long totalLeads;
//       private long hotLeads;
//       private long warmLeads;
//       private long coldLeads;
//       private long freshLeads;
//       private long converted;
//       // constructor + getters
//   }
//
// ─────────────────────────────────────────────────────────────
// ── PostgreSQL Schema (leads table — relevant columns) ────────
//
//   -- Ensure leads table has these columns:
//   ALTER TABLE leads
//     ADD COLUMN IF NOT EXISTS departing_city VARCHAR(100),
//     ADD COLUMN IF NOT EXISTS destination    VARCHAR(100),
//     ADD COLUMN IF NOT EXISTS state          VARCHAR(100),
//     ADD COLUMN IF NOT EXISTS country        VARCHAR(100)  DEFAULT 'India',
//     ADD COLUMN IF NOT EXISTS temperature    VARCHAR(20)   DEFAULT 'Fresh',
//     ADD COLUMN IF NOT EXISTS lead_type      VARCHAR(50),
//     ADD COLUMN IF NOT EXISTS stage          VARCHAR(50)   DEFAULT 'New Lead';
//
//   -- Indexes for fast geographic grouping and filtering
//   CREATE INDEX IF NOT EXISTS idx_leads_departing_city ON leads (departing_city);
//   CREATE INDEX IF NOT EXISTS idx_leads_destination    ON leads (destination);
//   CREATE INDEX IF NOT EXISTS idx_leads_country        ON leads (country);
//   CREATE INDEX IF NOT EXISTS idx_leads_temperature    ON leads (temperature);
//   CREATE INDEX IF NOT EXISTS idx_leads_stage          ON leads (stage);
//   CREATE INDEX IF NOT EXISTS idx_leads_lead_type      ON leads (lead_type);
//   CREATE INDEX IF NOT EXISTS idx_leads_created_at     ON leads (created_at DESC);
//
//   -- Composite index for most common filter combo
//   CREATE INDEX IF NOT EXISTS idx_leads_geo_filter
//     ON leads (created_at DESC, departing_city, temperature, stage);
//
//   -- Sample seed data
//   UPDATE leads SET
//     departing_city = 'Gorakhpur',
//     country        = 'India',
//     temperature    = 'Fresh',
//     stage          = 'New Lead',
//     lead_type      = 'Domestic'
//   WHERE id = 1;
//
// ── application.properties ───────────────────────────────────
//   spring.datasource.url=jdbc:postgresql://localhost:5432/travel_crm
//   spring.datasource.username=postgres
//   spring.datasource.password=yourpassword
//   spring.datasource.driver-class-name=org.postgresql.Driver
//   spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
//   spring.jpa.hibernate.ddl-auto=update
//   server.port=8080
//
// ── .env (React) ──────────────────────────────────────────────
//   REACT_APP_API_URL=http://localhost:8080
// ─────────────────────────────────────────────────────────────