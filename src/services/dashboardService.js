// src/services/dashboardService.js
// ─────────────────────────────────────────────────────────────
// Dashboard Page — API Service
// Page: Dashboard.jsx
// Route: / and /Dashboard
// Backend: Java Spring Boot REST API
// Database: PostgreSQL
// Two tabs:
//   1. Analytics Dashboard — leads, revenue, charts, performers, follow-ups
//   2. Operations Dashboard — users, subscription, company, activity
// ─────────────────────────────────────────────────────────────

import axios from "axios";

// ── BASE URL ──────────────────────────────────────────────────
// Add to .env file:
// REACT_APP_API_URL=http://localhost:8080
const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080";

// ── AXIOS INSTANCE ────────────────────────────────────────────
const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 20000,
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


// ═════════════════════════════════════════════════════════════
// ── TAB 1: ANALYTICS DASHBOARD SERVICE
// Spring Boot Controller: /api/dashboard/analytics
// ═════════════════════════════════════════════════════════════
const analyticsService = {

  // ── GET FULL ANALYTICS DATA (single call, powers all sections) ─
  // GET /api/dashboard/analytics
  // @GetMapping("/api/dashboard/analytics")
  // public ResponseEntity<AnalyticsDashboardDTO> getAnalytics(
  //     @RequestParam(defaultValue = "Yearly") String period)
  //
  // period values: "Today" | "Weekly" | "Monthly" | "Yearly"
  //
  // Response:
  // {
  //   heroStats: {
  //     totalLeads:      27,
  //     convertedLeads:  2,
  //     conversionRate:  7.41,
  //     revenue:         197001.00,
  //     profit:          141001.00,
  //     netMargin:       71.6,
  //     refunds:         0.00,
  //     winRate:         33.33,
  //     hotLeads:        25,
  //     // trend % compared to previous period
  //     leadsTrend:      12,
  //     revenueTrend:    28,
  //     profitTrend:     15
  //   },
  //   leadSources: [
  //     { name:"Social Media", value:22, color:"#f472b6" },
  //     { name:"Phone",        value:3,  color:"#60a5fa" },
  //     { name:"Website",      value:2,  color:"#fbbf24" }
  //   ],
  //   topDestinations: [
  //     { name:"Nepal",  bookings:26, revenue:197001 },
  //     { name:"Bhutan", bookings:1,  revenue:0      }
  //   ],
  //   revenueTimeline: [
  //     { month:"Jan", revenue:0,      bookings:0 },
  //     { month:"Feb", revenue:0,      bookings:0 },
  //     ...
  //     { month:"Jun", revenue:197001, bookings:2 }
  //   ],
  //   topPerformersConversion: [
  //     {
  //       rank:1, name:"Deepti Paul", leads:6,
  //       conversions:1, rate:16.67, tier:"gold"
  //     },
  //     ...
  //   ],
  //   topPerformersProfit: [
  //     {
  //       rank:1, name:"Vaishnavi S. Jagtap", leads:12,
  //       revenue:108001, profit:108001, margin:100,
  //       converted:1, tier:"gold"
  //     },
  //     ...
  //   ],
  //   priorityFollowups: [
  //     {
  //       id:1, name:"Pratik", phone:"8010214002",
  //       note:"Argent follow up",
  //       dueDate:"Jun 24, 2026 3:36 PM",
  //       urgency:"Urgent"
  //     }
  //   ],
  //   nearTravelDates: [
  //     {
  //       leadId:"123", name:"Anurag Julian",
  //       phone:"+91 79858 22092",
  //       travelDate:"Jun 25, 2026",
  //       stage:"New Lead", daysLeft:0
  //     },
  //     ...
  //   ],
  //   statusCounts: {
  //     pendingCompletion: 0,
  //     clientPayments:    0,
  //     vendorPayments:    0,
  //     getReviews:        0
  //   }
  // }
  getAnalytics: (period = "Yearly") => {
    return api.get("/api/dashboard/analytics", {
      params: { period },
    });
  },

  // ── GET HERO STATS ONLY (for quick refresh) ────────────────
  // GET /api/dashboard/analytics/hero-stats
  // @GetMapping("/api/dashboard/analytics/hero-stats")
  // public ResponseEntity<HeroStatsDTO> getHeroStats(
  //     @RequestParam(defaultValue = "Yearly") String period)
  //
  // Lighter call — just the 8 stat cards at the top
  // Response: same as analytics.heroStats object above
  getHeroStats: (period = "Yearly") => {
    return api.get("/api/dashboard/analytics/hero-stats", {
      params: { period },
    });
  },

  // ── GET REVENUE TIMELINE (for Area chart) ─────────────────
  // GET /api/dashboard/analytics/revenue-timeline
  // @GetMapping("/api/dashboard/analytics/revenue-timeline")
  // public ResponseEntity<List<TimelinePointDTO>> getRevenueTimeline(
  //     @RequestParam(defaultValue = "Yearly") String period)
  //
  // period determines GROUP BY:
  //   "Today"   → GROUP BY HOUR
  //   "Weekly"  → GROUP BY DAY OF WEEK
  //   "Monthly" → GROUP BY DAY OF MONTH
  //   "Yearly"  → GROUP BY MONTH
  //
  // Response: [{ month:"Jan", revenue:0, bookings:0 }, ...]
  getRevenueTimeline: (period = "Yearly") => {
    return api.get("/api/dashboard/analytics/revenue-timeline", {
      params: { period },
    });
  },
};


// ═════════════════════════════════════════════════════════════
// ── TAB 2: OPERATIONS DASHBOARD SERVICE
// Spring Boot Controller: /api/dashboard/operations
// ═════════════════════════════════════════════════════════════
const operationsService = {

  // ── GET FULL OPERATIONS DATA (single call) ─────────────────
  // GET /api/dashboard/operations
  // @GetMapping("/api/dashboard/operations")
  // public ResponseEntity<OperationsDashboardDTO> getOperations()
  //
  // Response:
  // {
  //   stats: {
  //     totalUsers:   4,
  //     activeUsers:  4,
  //     subEndDate:   "Jun 28",
  //     userLimit:    { max:11, used:4 }
  //   },
  //   subscription: {
  //     name:      "Dolphin Plan Monthly - Subscription Plan",
  //     startDate: "May 29, 2026",
  //     endDate:   "Jun 28, 2026",
  //     status:    "Active",
  //     daysLeft:  3
  //   },
  //   company: {
  //     name:    "Nepal Tours And Travels",
  //     email:   "nepaltours.travels@gmail.com",
  //     phone:   "9918001088",
  //     address: "Opp. Gate No. -1, Railway Station...",
  //     status:  "Active"
  //   },
  //   recentUsers: [
  //     {
  //       username:"Shreyash_Shahi", fullName:"Shreyash R. Shahi",
  //       role:"Staff", status:"Active", created:"Jun 13, 2026"
  //     },
  //     ...
  //   ],
  //   recentActivity: [
  //     {
  //       user:"admin_ntat", role:"Admin",
  //       action:"Created lead: Yash Thakur",
  //       time:"Jun 25, 15:58"
  //     },
  //     ...
  //   ]
  // }
  getOperations: () => {
    return api.get("/api/dashboard/operations");
  },
};


// ═════════════════════════════════════════════════════════════
// COMBINED DASHBOARD SERVICE (default export)
// ═════════════════════════════════════════════════════════════
const dashboardService = {
  // Analytics tab
  getAnalytics:        analyticsService.getAnalytics,
  getHeroStats:        analyticsService.getHeroStats,
  getRevenueTimeline:  analyticsService.getRevenueTimeline,

  // Operations tab
  getOperations:       operationsService.getOperations,
};

export default dashboardService;


// ═════════════════════════════════════════════════════════════
// HOW TO USE IN Dashboard.jsx
// ═════════════════════════════════════════════════════════════
//
// STEP 1 — Import:
//   import dashboardService from "../services/dashboardService";
//
// ─────────────────────────────────────────────────────────────
// STEP 2 — Add state at top of Dashboard():
//
//   const [analyticsData, setAnalyticsData] = useState(null);
//   const [opsData,       setOpsData]       = useState(null);
//   const [loading,       setLoading]       = useState(true);
//   const [toast,         setToast]         = useState(null);
//
// ─────────────────────────────────────────────────────────────
// STEP 3 — Load Analytics on mount + period change:
//
//   useEffect(() => {
//     setLoading(true);
//     dashboardService
//       .getAnalytics(period)
//       .then((res) => setAnalyticsData(res.data))
//       .catch(() => setToast({ msg:"Failed to load analytics.", type:"error" }))
//       .finally(() => setLoading(false));
//   }, [period]);  // re-fetches when period changes
//
// ─────────────────────────────────────────────────────────────
// STEP 4 — Load Operations when that tab is first opened:
//
//   useEffect(() => {
//     if (tab !== "operations" || opsData) return;  // only load once
//     dashboardService
//       .getOperations()
//       .then((res) => setOpsData(res.data))
//       .catch(() => setToast({ msg:"Failed to load operations.", type:"error" }));
//   }, [tab]);
//
// ─────────────────────────────────────────────────────────────
// STEP 5 — Bind data to components (replace mock D and O):
//
//   // Instead of: const D = { totalLeads: 27, ... }
//   // Use:        const D = analyticsData || {};
//   //             const O = opsData || {};
//
//   // Hero cards (safe access):
//   value={D.heroStats?.totalLeads || 0}
//   value={D.heroStats?.revenue    || 0}
//
//   // Charts:
//   data={D.revenueTimeline  || []}
//   data={D.leadSources      || []}
//   data={D.topDestinations  || []}
//
//   // Tables:
//   {(D.topPerformersConversion || []).map(p => ...)}
//   {(D.topPerformersProfit     || []).map(p => ...)}
//
//   // Follow-up + near travel panels:
//   {(D.priorityFollowups || []).map(f => ...)}
//   {(D.nearTravelDates   || []).map(l => ...)}
//
//   // Status counts (bottom 4 cards):
//   count={D.statusCounts?.pendingCompletion || 0}
//
//   // Operations:
//   totalUsers   = O.stats?.totalUsers
//   subscription = O.subscription
//   company      = O.company
//   recentUsers  = O.recentUsers  || []
//   recentActivity = O.recentActivity || []
//
// ─────────────────────────────────────────────────────────────
// STEP 6 — Period filter re-fetch:
//
//   // "Apply Filter" button:
//   const handleApplyFilter = () => {
//     setLoading(true);
//     dashboardService
//       .getAnalytics(period)
//       .then((res) => setAnalyticsData(res.data))
//       .catch(() => setToast({ msg:"Filter failed.", type:"error" }))
//       .finally(() => setLoading(false));
//   };
//
//   // Button:
//   <button onClick={handleApplyFilter}>Apply Filter</button>
//
// ─────────────────────────────────────────────────────────────
// STEP 7 — Skeleton loading while data loads:
//
//   {loading && (
//     <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//       {[...Array(4)].map((_, i) => (
//         <div key={i} className="h-28 rounded-2xl bg-slate-200 animate-pulse"/>
//       ))}
//     </div>
//   )}
//   {!loading && analyticsData && <> ... hero cards ... </>}
//
// ═════════════════════════════════════════════════════════════
// SPRING BOOT JAVA BACKEND — FULL REFERENCE
// ═════════════════════════════════════════════════════════════
//
// ── DashboardController.java ──────────────────────────────────
//
//   @RestController
//   @RequestMapping("/api/dashboard")
//   @CrossOrigin(origins = "http://localhost:3000")
//   public class DashboardController {
//
//       @Autowired private AnalyticsDashboardService analyticsSvc;
//       @Autowired private OperationsDashboardService operationsSvc;
//
//       @GetMapping("/analytics")
//       public ResponseEntity<AnalyticsDashboardDTO> getAnalytics(
//           @RequestParam(defaultValue = "Yearly") String period) {
//           return ResponseEntity.ok(analyticsSvc.getDashboard(period));
//       }
//
//       @GetMapping("/analytics/hero-stats")
//       public ResponseEntity<HeroStatsDTO> getHeroStats(
//           @RequestParam(defaultValue = "Yearly") String period) {
//           return ResponseEntity.ok(analyticsSvc.getHeroStats(period));
//       }
//
//       @GetMapping("/analytics/revenue-timeline")
//       public ResponseEntity<List<TimelinePointDTO>> getRevenueTimeline(
//           @RequestParam(defaultValue = "Yearly") String period) {
//           return ResponseEntity.ok(analyticsSvc.getRevenueTimeline(period));
//       }
//
//       @GetMapping("/operations")
//       public ResponseEntity<OperationsDashboardDTO> getOperations() {
//           return ResponseEntity.ok(operationsSvc.getDashboard());
//       }
//   }
//
// ── AnalyticsDashboardService.java ───────────────────────────
//
//   @Service
//   public class AnalyticsDashboardService {
//
//       @Autowired private LeadRepository       leadRepo;
//       @Autowired private BookingRepository    bookingRepo;
//       @Autowired private ReminderRepository   reminderRepo;
//       @Autowired private TenantContext        tenantCtx;
//
//       public AnalyticsDashboardDTO getDashboard(String period) {
//           String tenantId            = tenantCtx.getTenantId();
//           LocalDateTime[] range      = resolvePeriodRange(period);
//           LocalDateTime from = range[0], to = range[1];
//           LocalDateTime[] prevRange  = previousPeriodRange(period, from);
//
//           // Hero stats
//           long   totalLeads          = leadRepo.countByTenantAndDateRange(tenantId, from, to);
//           long   convertedLeads      = leadRepo.countByStage(tenantId, "Converted", from, to);
//           double conversionRate      = totalLeads > 0
//               ? Math.round((double) convertedLeads / totalLeads * 1000) / 10.0 : 0;
//           double revenue             = bookingRepo.sumRevenue(tenantId, from, to);
//           double profit              = bookingRepo.sumProfit(tenantId, from, to);
//           double netMargin           = revenue > 0
//               ? Math.round(profit / revenue * 1000) / 10.0 : 0;
//           double refunds             = bookingRepo.sumRefunds(tenantId, from, to);
//           long   hotLeads            = leadRepo.countByTemperature(tenantId, "Hot", from, to);
//           // Trends vs previous period
//           long   prevLeads           = leadRepo.countByTenantAndDateRange(tenantId, prevRange[0], prevRange[1]);
//           double prevRevenue         = bookingRepo.sumRevenue(tenantId, prevRange[0], prevRange[1]);
//           double prevProfit          = bookingRepo.sumProfit(tenantId, prevRange[0], prevRange[1]);
//           int    leadsTrend          = calcTrend(totalLeads, prevLeads);
//           int    revenueTrend        = calcTrend(revenue, prevRevenue);
//           int    profitTrend         = calcTrend(profit, prevProfit);
//
//           // Lead sources
//           List<LeadSourceDTO> sources = leadRepo.countBySource(tenantId, from, to);
//
//           // Top destinations
//           List<DestinationDTO> dests = bookingRepo.topDestinations(tenantId, from, to, 5);
//
//           // Revenue timeline
//           List<TimelinePointDTO> timeline = getRevenueTimeline(period);
//
//           // Top performers
//           List<PerformerConvDTO>   topConv   = leadRepo.topPerformersByConversion(tenantId, from, to);
//           List<PerformerProfitDTO> topProfit = bookingRepo.topPerformersByProfit(tenantId, from, to);
//
//           // Priority follow-ups (overdue, urgent)
//           List<FollowupDTO> followups = reminderRepo.findUrgentOverdue(tenantId, LocalDateTime.now(), 10);
//
//           // Near travel dates (next 10 days)
//           List<NearTravelDTO> nearTravel = bookingRepo.findNearTravelDates(
//               tenantId, LocalDate.now(), LocalDate.now().plusDays(10));
//
//           // Bottom status counts
//           StatusCountsDTO statusCounts = new StatusCountsDTO(
//               bookingRepo.countPendingCompletion(tenantId, LocalDate.now().plusDays(25)),
//               bookingRepo.countClientPaymentsDue(tenantId, LocalDate.now().plusDays(25)),
//               bookingRepo.countVendorPaymentsDue(tenantId, LocalDate.now().plusDays(25)),
//               leadRepo.countGetReviews(tenantId, LocalDate.now().plusDays(15))
//           );
//
//           return AnalyticsDashboardDTO.builder()
//               .heroStats(new HeroStatsDTO(totalLeads, convertedLeads, conversionRate,
//                   revenue, profit, netMargin, refunds, hotLeads,
//                   leadsTrend, revenueTrend, profitTrend))
//               .leadSources(sources)
//               .topDestinations(dests)
//               .revenueTimeline(timeline)
//               .topPerformersConversion(topConv)
//               .topPerformersProfit(topProfit)
//               .priorityFollowups(followups)
//               .nearTravelDates(nearTravel)
//               .statusCounts(statusCounts)
//               .build();
//       }
//
//       public List<TimelinePointDTO> getRevenueTimeline(String period) {
//           String tenantId           = tenantCtx.getTenantId();
//           LocalDateTime[] range     = resolvePeriodRange(period);
//           String groupByFmt = switch (period) {
//               case "Today"   -> "HH";
//               case "Weekly"  -> "Dy";
//               case "Monthly" -> "DD";
//               default        -> "Mon";   // Yearly
//           };
//           return bookingRepo.revenueTimeline(tenantId, range[0], range[1], groupByFmt);
//       }
//
//       private LocalDateTime[] resolvePeriodRange(String period) {
//           LocalDateTime now = LocalDateTime.now();
//           return switch (period) {
//               case "Today"   -> new LocalDateTime[]{ now.toLocalDate().atStartOfDay(), now };
//               case "Weekly"  -> new LocalDateTime[]{ now.minusDays(7), now };
//               case "Monthly" -> new LocalDateTime[]{ now.withDayOfMonth(1).toLocalDate().atStartOfDay(), now };
//               default        -> new LocalDateTime[]{ now.withDayOfYear(1).toLocalDate().atStartOfDay(), now };
//           };
//       }
//
//       private LocalDateTime[] previousPeriodRange(String period, LocalDateTime from) {
//           long days = ChronoUnit.DAYS.between(from, LocalDateTime.now());
//           return new LocalDateTime[]{ from.minusDays(days), from };
//       }
//
//       private int calcTrend(double current, double previous) {
//           if (previous == 0) return 0;
//           return (int) Math.round((current - previous) / previous * 100);
//       }
//   }
//
// ── OperationsDashboardService.java ──────────────────────────
//
//   @Service
//   public class OperationsDashboardService {
//
//       @Autowired private UserRepository         userRepo;
//       @Autowired private SubscriptionRepository subRepo;
//       @Autowired private TenantRepository       tenantRepo;
//       @Autowired private ActivityLogRepository  activityRepo;
//       @Autowired private TenantContext          tenantCtx;
//
//       public OperationsDashboardDTO getDashboard() {
//           String tenantId   = tenantCtx.getTenantId();
//
//           // Stats row
//           long   totalUsers  = userRepo.countByTenantId(tenantId);
//           long   activeUsers = userRepo.countActiveByTenantId(tenantId);
//           Subscription sub   = subRepo.findActiveByTenantId(tenantId).orElse(null);
//           Tenant tenant      = tenantRepo.findByPublicId(tenantId).orElseThrow();
//
//           String subEndDate  = sub != null
//               ? sub.getEndDate().format(DateTimeFormatter.ofPattern("MMM dd")) : "—";
//           int    daysLeft    = sub != null
//               ? (int) ChronoUnit.DAYS.between(LocalDate.now(), sub.getEndDate()) : 0;
//
//           // Recent users (last 5)
//           List<RecentUserDTO> recentUsers = userRepo.findTop5ByTenantIdOrderByCreatedAtDesc(tenantId)
//               .stream().map(u -> new RecentUserDTO(
//                   u.getUsername(), u.getFullName(), u.getRole(),
//                   u.isActive() ? "Active" : "Inactive",
//                   u.getCreatedAt().format(DateTimeFormatter.ofPattern("MMM dd, yyyy"))))
//               .collect(Collectors.toList());
//
//           // Recent activity (last 10)
//           List<ActivityDTO> activity = activityRepo.findTop10ByTenantIdOrderByCreatedAtDesc(tenantId)
//               .stream().map(a -> new ActivityDTO(
//                   a.getUser().getUsername(),
//                   capitalise(a.getUser().getRole()),
//                   a.getDescription(),
//                   a.getCreatedAt().format(DateTimeFormatter.ofPattern("MMM dd, HH:mm"))))
//               .collect(Collectors.toList());
//
//           return OperationsDashboardDTO.builder()
//               .stats(new OpsStatsDTO(
//                   (int) totalUsers, (int) activeUsers, subEndDate,
//                   new UserLimitDTO(tenant.getPlan().getMaxUsers(), (int) totalUsers)))
//               .subscription(sub != null ? new SubDetailsDTO(
//                   sub.getPlan().getName(), sub.getStartDate().format(DateTimeFormatter.ofPattern("MMM dd, yyyy")),
//                   sub.getEndDate().format(DateTimeFormatter.ofPattern("MMM dd, yyyy")),
//                   daysLeft >= 0 ? "Active" : "Expired", daysLeft) : null)
//               .company(new CompanyDTO(tenant.getCompanyName(), tenant.getEmail(),
//                   tenant.getPhone(), tenant.getAddress(),
//                   tenant.isActive() ? "Active" : "Inactive"))
//               .recentUsers(recentUsers)
//               .recentActivity(activity)
//               .build();
//       }
//   }
//
// ── All DTOs ──────────────────────────────────────────────────
//
//   // HeroStatsDTO.java
//   @Data @Builder
//   public class HeroStatsDTO {
//       private long   totalLeads, convertedLeads, hotLeads;
//       private double conversionRate, revenue, profit, netMargin, refunds;
//       private int    leadsTrend, revenueTrend, profitTrend;
//   }
//
//   // LeadSourceDTO.java
//   @Data @AllArgsConstructor
//   public class LeadSourceDTO { private String name, color; private long value; }
//
//   // DestinationDTO.java
//   @Data @AllArgsConstructor
//   public class DestinationDTO { private String name; private long bookings; private double revenue; }
//
//   // TimelinePointDTO.java
//   @Data @AllArgsConstructor
//   public class TimelinePointDTO { private String month; private double revenue; private long bookings; }
//
//   // PerformerConvDTO.java
//   @Data @AllArgsConstructor
//   public class PerformerConvDTO {
//       private int rank; private String name, tier;
//       private long leads, conversions; private double rate;
//   }
//
//   // PerformerProfitDTO.java
//   @Data @AllArgsConstructor
//   public class PerformerProfitDTO {
//       private int rank; private String name, tier;
//       private long leads, converted; private double revenue, profit, margin;
//   }
//
//   // FollowupDTO.java
//   @Data @AllArgsConstructor
//   public class FollowupDTO {
//       private Long id; private String name, phone, note, dueDate, urgency;
//   }
//
//   // NearTravelDTO.java
//   @Data @AllArgsConstructor
//   public class NearTravelDTO {
//       private String leadId, name, phone, travelDate, stage; private int daysLeft;
//   }
//
//   // StatusCountsDTO.java
//   @Data @AllArgsConstructor
//   public class StatusCountsDTO {
//       private int pendingCompletion, clientPayments, vendorPayments, getReviews;
//   }
//
//   // AnalyticsDashboardDTO.java
//   @Data @Builder
//   public class AnalyticsDashboardDTO {
//       private HeroStatsDTO                heroStats;
//       private List<LeadSourceDTO>         leadSources;
//       private List<DestinationDTO>        topDestinations;
//       private List<TimelinePointDTO>      revenueTimeline;
//       private List<PerformerConvDTO>      topPerformersConversion;
//       private List<PerformerProfitDTO>    topPerformersProfit;
//       private List<FollowupDTO>           priorityFollowups;
//       private List<NearTravelDTO>         nearTravelDates;
//       private StatusCountsDTO             statusCounts;
//   }
//
//   // OpsStatsDTO.java
//   @Data @AllArgsConstructor
//   public class OpsStatsDTO {
//       private int totalUsers, activeUsers; private String subEndDate;
//       private UserLimitDTO userLimit;
//   }
//
//   // UserLimitDTO.java
//   @Data @AllArgsConstructor
//   public class UserLimitDTO { private int max, used; }
//
//   // SubDetailsDTO.java
//   @Data @AllArgsConstructor
//   public class SubDetailsDTO {
//       private String name, startDate, endDate, status; private int daysLeft;
//   }
//
//   // CompanyDTO.java
//   @Data @AllArgsConstructor
//   public class CompanyDTO { private String name, email, phone, address, status; }
//
//   // RecentUserDTO.java
//   @Data @AllArgsConstructor
//   public class RecentUserDTO { private String username, fullName, role, status, created; }
//
//   // ActivityDTO.java
//   @Data @AllArgsConstructor
//   public class ActivityDTO { private String user, role, action, time; }
//
//   // OperationsDashboardDTO.java
//   @Data @Builder
//   public class OperationsDashboardDTO {
//       private OpsStatsDTO       stats;
//       private SubDetailsDTO     subscription;
//       private CompanyDTO        company;
//       private List<RecentUserDTO>  recentUsers;
//       private List<ActivityDTO>    recentActivity;
//   }
//
// ─────────────────────────────────────────────────────────────
// ── PostgreSQL Schema — key queries ───────────────────────────
//
//   -- Revenue timeline by month (Yearly period)
//   SELECT
//     TO_CHAR(b.booking_date, 'Mon')     AS month,
//     COALESCE(SUM(b.customer_amount),0) AS revenue,
//     COUNT(*)                           AS bookings
//   FROM bookings b
//   WHERE b.tenant_id = :tenantId
//     AND b.booking_date BETWEEN :from AND :to
//   GROUP BY TO_CHAR(b.booking_date, 'Mon'), DATE_TRUNC('month', b.booking_date)
//   ORDER BY DATE_TRUNC('month', b.booking_date);
//
//   -- Top performers by conversion rate
//   SELECT
//     u.full_name                                        AS name,
//     COUNT(l.id)                                        AS leads,
//     COUNT(CASE WHEN l.stage = 'Converted' THEN 1 END) AS conversions,
//     ROUND(
//       COUNT(CASE WHEN l.stage = 'Converted' THEN 1 END)::numeric
//       / NULLIF(COUNT(l.id),0) * 100, 2
//     )                                                  AS rate
//   FROM leads l
//   JOIN users u ON u.id = l.assigned_to_user_id
//   WHERE l.tenant_id = :tenantId
//     AND l.created_at BETWEEN :from AND :to
//   GROUP BY u.id, u.full_name
//   ORDER BY rate DESC, leads DESC;
//
//   -- Priority follow-ups (overdue + urgent)
//   SELECT
//     l.name, l.phone, r.description AS note,
//     r.due_date,
//     CASE WHEN r.due_date < NOW() THEN 'Urgent' ELSE 'High' END AS urgency
//   FROM reminders r
//   JOIN leads l ON l.id = r.lead_id
//   WHERE r.tenant_id = :tenantId
//     AND r.completed = FALSE
//     AND (r.due_date < NOW() OR r.due_date <= NOW() + INTERVAL '24 hours')
//   ORDER BY r.due_date ASC
//   LIMIT 10;
//
//   -- Near travel dates (next N days)
//   SELECT
//     l.public_id AS lead_id, l.name, l.phone, l.stage,
//     b.travel_date,
//     (b.travel_date - CURRENT_DATE) AS days_left
//   FROM bookings b
//   JOIN leads l ON l.id = b.lead_id
//   WHERE b.tenant_id = :tenantId
//     AND b.travel_date BETWEEN :today AND :maxDate
//   ORDER BY b.travel_date ASC;
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