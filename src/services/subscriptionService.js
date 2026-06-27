// src/services/subscriptionService.js
// ─────────────────────────────────────────────────────────────
// Subscription Information Page — API Service
// Page: SubscriptionInfo.jsx
// Route: /Subscription
// Backend: Java Spring Boot REST API
// Database: PostgreSQL
// Covers:
//   - Get current plan details (plan name, price, dates, status)
//   - Get available modules list for the current plan
//   - Get usage stats (active users, days left, progress bars)
//   - Request plan renewal / upgrade (CTA buttons)
//   - Contact support request
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
  timeout: 15000,
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
// SUBSCRIPTION SERVICE
// Spring Boot Controller: /api/subscription
// PostgreSQL Tables: subscriptions, plans, plan_modules, tenants
// ═════════════════════════════════════════════════════════════
const subscriptionService = {

  // ── GET FULL PLAN INFO (all page data in one call) ─────────
  // GET /api/subscription/info
  // @GetMapping("/api/subscription/info")
  // public ResponseEntity<SubscriptionInfoDTO> getInfo()
  //
  // Primary endpoint — powers all sections of the page:
  //   1. Current Plan Details card (left panel)
  //   2. 3 mini stat pills (days left, active users, plan tier)
  //   3. Progress bars (days used %, users used %)
  //   4. Available Modules list (right panel)
  //   5. Plan Highlights card
  //
  // Response:
  // {
  //   plan: {
  //     planName:     "Dolphin Plan Monthly - Subscription",
  //     description:  "Dolphin Plan Monthly - Subscription",
  //     price:        1890.00,
  //     duration:     30,          // days
  //     maxUsers:     11,
  //     activeUsers:  4,
  //     startDate:    "29 May 2026",
  //     endDate:      "28 Jun 2026",
  //     daysLeft:     3,
  //     status:       "Active",    // "Active" | "Expired" | "Suspended" | "Trial"
  //     tier:         "Dolphin",   // "Dolphin" | "Shark" | "Whale" | etc.
  //     daysUsedPct:  90,          // (duration - daysLeft) / duration * 100
  //     usersUsedPct: 36           // activeUsers / maxUsers * 100
  //   },
  //   modules: [
  //     "Booking Management",
  //     "Customer Management",
  //     "Dashboard & Core",
  //     "Email Configuration",
  //     "Lead Management",
  //     "Master Data Management",
  //     "Quotation Management",
  //     "Reminders & Notifications",
  //     "Reports & Analytics",
  //     "User Management",
  //     "Vendor Management",
  //     "Weblink Sharing",
  //     "WhatsApp Integration"
  //   ],
  //   highlights: [
  //     { label:"Up to 11 team members"   },
  //     { label:"Unlimited quotations"    },
  //     { label:"Full CRM feature access" },
  //     { label:"Data security & backups" },
  //     { label:"Priority customer support" }
  //   ]
  // }
  getInfo: () => {
    return api.get("/api/subscription/info");
  },

  // ── GET PLAN DETAILS ONLY (for quick refresh) ──────────────
  // GET /api/subscription/plan
  // @GetMapping("/api/subscription/plan")
  // public ResponseEntity<PlanDTO> getPlan()
  //
  // Lighter call — only returns the plan fields (no modules)
  // Used for the header badge and mini stat pills refresh
  //
  // Response: same as info.plan object above
  getPlan: () => {
    return api.get("/api/subscription/plan");
  },

  // ── REQUEST RENEWAL ────────────────────────────────────────
  // POST /api/subscription/renew
  // @PostMapping("/api/subscription/renew")
  // public ResponseEntity<RenewalResponseDTO> requestRenewal(
  //     @RequestBody RenewalRequest request)
  //
  // Called when user clicks "Renew Plan" button
  //
  // Request body:
  // {
  //   planId:   "dolphin-monthly",   // current plan id to renew
  //   duration: "monthly"            // "monthly" | "annual"
  // }
  //
  // Backend logic:
  //   1. Validates tenant has an active/expiring subscription
  //   2. Creates a renewal_request record in DB
  //   3. Notifies the Super Admin via email
  //   4. Returns a payment link or confirmation message
  //
  // Response (200 OK):
  // {
  //   success:     true,
  //   message:     "Renewal request submitted. Our team will contact you shortly.",
  //   paymentLink: "https://razorpay.com/...",   // or null if manual process
  //   requestId:   "REN-20260625-001"
  // }
  //
  // Error responses:
  //   422 — { message: "Subscription is already active for 3 more days" }
  //   500 — { message: "Failed to process renewal request" }
  requestRenewal: (planId = "dolphin-monthly", duration = "monthly") => {
    return api.post("/api/subscription/renew", { planId, duration });
  },

  // ── REQUEST UPGRADE ────────────────────────────────────────
  // POST /api/subscription/upgrade
  // @PostMapping("/api/subscription/upgrade")
  // public ResponseEntity<UpgradeResponseDTO> requestUpgrade(
  //     @RequestBody UpgradeRequest request)
  //
  // Called when user clicks "Upgrade Plan" button in the bottom banner
  //
  // Request body:
  // {
  //   currentPlanId: "dolphin-monthly",
  //   targetPlanId:  "shark-annual",    // optional — blank = contact for options
  //   duration:      "annual"
  // }
  //
  // Response (200 OK):
  // {
  //   success:     true,
  //   message:     "Upgrade request submitted. Our sales team will contact you within 24 hours.",
  //   requestId:   "UPG-20260625-001",
  //   salesEmail:  "sales@tripotomize.com"
  // }
  requestUpgrade: (currentPlanId, targetPlanId = null, duration = "annual") => {
    return api.post("/api/subscription/upgrade", {
      currentPlanId,
      targetPlanId,
      duration,
    });
  },

  // ── CONTACT SUPPORT ────────────────────────────────────────
  // POST /api/subscription/support
  // @PostMapping("/api/subscription/support")
  // public ResponseEntity<SupportResponseDTO> contactSupport(
  //     @RequestBody SupportRequest request)
  //
  // Called when user clicks "Contact Support" or "Talk to Sales" button
  //
  // Request body:
  // {
  //   type:    "support",          // "support" | "sales" | "billing"
  //   message: "Need help with..."  // optional message
  // }
  //
  // Response (200 OK):
  // {
  //   success: true,
  //   message: "Our team will contact you shortly.",
  //   ticketId: "TKT-20260625-001"
  // }
  contactSupport: (type = "support", message = "") => {
    return api.post("/api/subscription/support", { type, message });
  },
};

export default subscriptionService;


// ═════════════════════════════════════════════════════════════
// HOW TO USE IN SubscriptionInfo.jsx
// ═════════════════════════════════════════════════════════════
//
// STEP 1 — Import:
//   import subscriptionService
//     from "../services/subscriptionService";
//
// ─────────────────────────────────────────────────────────────
// STEP 2 — Replace mock useEffect with real API:
//
//   useEffect(() => {
//     setLoading(true);
//     subscriptionService
//       .getInfo()
//       .then((res) => {
//         setPlan(res.data.plan);
//         setModules(res.data.modules);
//         setHighlights(res.data.highlights);
//       })
//       .catch(() =>
//         showToast("Failed to load subscription info.", "error")
//       )
//       .finally(() => setLoading(false));
//   }, []);
//
//   // State additions needed:
//   const [modules,    setModules]    = useState([]);
//   const [highlights, setHighlights] = useState([]);
//
// ─────────────────────────────────────────────────────────────
// STEP 3 — Connect "Renew Plan" button:
//
//   const handleRenew = async () => {
//     try {
//       const res = await subscriptionService.requestRenewal(
//         "dolphin-monthly",
//         "monthly"
//       );
//       showToast(res.data.message);
//       // If a payment link is returned, open it:
//       if (res.data.paymentLink) {
//         window.open(res.data.paymentLink, "_blank");
//       }
//     } catch (err) {
//       showToast(
//         err?.response?.data?.message || "Renewal request failed.",
//         "error"
//       );
//     }
//   };
//
//   // In the JSX:
//   <button onClick={handleRenew}>
//     <FaRocket /> Renew Plan
//   </button>
//
// ─────────────────────────────────────────────────────────────
// STEP 4 — Connect "Upgrade Plan" button:
//
//   const handleUpgrade = async () => {
//     try {
//       const res = await subscriptionService.requestUpgrade(
//         plan.planId,   // pass actual plan ID from API response
//         null,          // let sales team suggest target plan
//         "annual"
//       );
//       showToast(res.data.message, "info");
//     } catch (err) {
//       showToast(
//         err?.response?.data?.message || "Upgrade request failed.",
//         "error"
//       );
//     }
//   };
//
// ─────────────────────────────────────────────────────────────
// STEP 5 — Connect "Contact Support" + "Talk to Sales" buttons:
//
//   const handleContactSupport = async (type = "support") => {
//     try {
//       const res = await subscriptionService.contactSupport(type);
//       showToast(res.data.message, "info");
//     } catch {
//       showToast("Failed to send request. Try again.", "error");
//     }
//   };
//
//   // Contact Support button:
//   <button onClick={() => handleContactSupport("support")}>
//     Contact Support
//   </button>
//
//   // Talk to Sales button:
//   <button onClick={() => handleContactSupport("sales")}>
//     Talk to Sales
//   </button>
//
// ─────────────────────────────────────────────────────────────
// STEP 6 — Bind modules list dynamically (replace hardcoded):
//
//   // Replace: const MODULES = ["Booking Management", ...]
//   // With:    use state → modules (from API)
//
//   // In JSX, replace MODULES.map(...) with modules.map(...)
//   // The list length shown in the teal header:
//   `${modules.length} modules included in your plan`
//
// ═════════════════════════════════════════════════════════════
// SPRING BOOT JAVA BACKEND — FULL REFERENCE
// ═════════════════════════════════════════════════════════════
//
// ── SubscriptionController.java ───────────────────────────────
//
//   @RestController
//   @RequestMapping("/api/subscription")
//   @CrossOrigin(origins = "http://localhost:3000")
//   public class SubscriptionController {
//
//       @Autowired private SubscriptionService service;
//
//       @GetMapping("/info")
//       public ResponseEntity<SubscriptionInfoDTO> getInfo() {
//           return ResponseEntity.ok(service.getInfo());
//       }
//
//       @GetMapping("/plan")
//       public ResponseEntity<PlanDTO> getPlan() {
//           return ResponseEntity.ok(service.getPlan());
//       }
//
//       @PostMapping("/renew")
//       public ResponseEntity<RenewalResponseDTO> requestRenewal(
//           @RequestBody RenewalRequest request) {
//           return ResponseEntity.ok(service.requestRenewal(request));
//       }
//
//       @PostMapping("/upgrade")
//       public ResponseEntity<UpgradeResponseDTO> requestUpgrade(
//           @RequestBody UpgradeRequest request) {
//           return ResponseEntity.ok(service.requestUpgrade(request));
//       }
//
//       @PostMapping("/support")
//       public ResponseEntity<SupportResponseDTO> contactSupport(
//           @RequestBody SupportRequest request) {
//           return ResponseEntity.ok(service.contactSupport(request));
//       }
//   }
//
// ── SubscriptionService.java ──────────────────────────────────
//
//   @Service
//   public class SubscriptionService {
//
//       @Autowired private SubscriptionRepository subRepo;
//       @Autowired private PlanRepository         planRepo;
//       @Autowired private PlanModuleRepository   moduleRepo;
//       @Autowired private TenantRepository       tenantRepo;
//       @Autowired private UserRepository         userRepo;
//       @Autowired private TenantContext          tenantCtx;
//
//       public SubscriptionInfoDTO getInfo() {
//           String       tenantId = tenantCtx.getTenantId();
//           Subscription sub      = subRepo.findActiveByTenantId(tenantId)
//               .orElseThrow(() -> new ResponseStatusException(
//                   HttpStatus.NOT_FOUND, "No active subscription found"));
//           Plan    plan          = sub.getPlan();
//           long    activeUsers   = userRepo.countActiveByTenantId(tenantId);
//           long    daysLeft      = ChronoUnit.DAYS.between(
//                                       LocalDate.now(), sub.getEndDate());
//           long    daysUsed      = sub.getPlan().getDurationDays() - daysLeft;
//           int     daysUsedPct   = (int) Math.round(
//               (double) daysUsed / plan.getDurationDays() * 100);
//           int     usersUsedPct  = (int) Math.round(
//               (double) activeUsers / plan.getMaxUsers() * 100);
//           DateTimeFormatter fmt  = DateTimeFormatter.ofPattern("dd MMM yyyy");
//           List<String> modules   = moduleRepo.findModuleNamesByPlanId(plan.getId());
//           List<HighlightDTO> highlights = buildHighlights(plan, activeUsers);
//           return SubscriptionInfoDTO.builder()
//               .plan(PlanDTO.builder()
//                   .planId(plan.getPublicId())
//                   .planName(plan.getName())
//                   .description(plan.getDescription())
//                   .price(plan.getPrice())
//                   .duration(plan.getDurationDays())
//                   .maxUsers((int) plan.getMaxUsers())
//                   .activeUsers((int) activeUsers)
//                   .startDate(sub.getStartDate().format(fmt))
//                   .endDate(sub.getEndDate().format(fmt))
//                   .daysLeft((int) Math.max(0, daysLeft))
//                   .status(daysLeft >= 0 ? "Active" : "Expired")
//                   .tier(plan.getTier())
//                   .daysUsedPct(Math.min(100, daysUsedPct))
//                   .usersUsedPct(Math.min(100, usersUsedPct))
//                   .build())
//               .modules(modules)
//               .highlights(highlights)
//               .build();
//       }
//
//       public PlanDTO getPlan() {
//           return getInfo().getPlan();
//       }
//
//       public RenewalResponseDTO requestRenewal(RenewalRequest req) {
//           String tenantId = tenantCtx.getTenantId();
//           String requestId = "REN-" + LocalDate.now()
//               .format(DateTimeFormatter.BASIC_ISO_DATE) + "-"
//               + String.format("%03d", subRepo.countRenewalRequests(tenantId) + 1);
//           // Create renewal_request record
//           subRepo.saveRenewalRequest(tenantId, req.getPlanId(),
//               req.getDuration(), requestId);
//           return new RenewalResponseDTO(
//               true,
//               "Renewal request submitted. Our team will contact you shortly.",
//               null, // paymentLink — integrate Razorpay/Stripe here if needed
//               requestId);
//       }
//
//       public UpgradeResponseDTO requestUpgrade(UpgradeRequest req) {
//           String tenantId = tenantCtx.getTenantId();
//           String requestId = "UPG-" + LocalDate.now()
//               .format(DateTimeFormatter.BASIC_ISO_DATE) + "-"
//               + String.format("%03d", subRepo.countUpgradeRequests(tenantId) + 1);
//           subRepo.saveUpgradeRequest(tenantId, req.getCurrentPlanId(),
//               req.getTargetPlanId(), req.getDuration(), requestId);
//           return new UpgradeResponseDTO(
//               true,
//               "Upgrade request submitted. Our sales team will contact you within 24 hours.",
//               requestId,
//               "sales@tripotomize.com");
//       }
//
//       public SupportResponseDTO contactSupport(SupportRequest req) {
//           String tenantId = tenantCtx.getTenantId();
//           String ticketId = "TKT-" + LocalDate.now()
//               .format(DateTimeFormatter.BASIC_ISO_DATE) + "-"
//               + String.format("%03d", subRepo.countSupportTickets(tenantId) + 1);
//           subRepo.saveSupportTicket(tenantId, req.getType(),
//               req.getMessage(), ticketId);
//           return new SupportResponseDTO(
//               true, "Our team will contact you shortly.", ticketId);
//       }
//
//       private List<HighlightDTO> buildHighlights(Plan plan, long activeUsers) {
//           return List.of(
//               new HighlightDTO("Up to " + plan.getMaxUsers() + " team members"),
//               new HighlightDTO("Unlimited quotations"),
//               new HighlightDTO("Full CRM feature access"),
//               new HighlightDTO("Data security & backups"),
//               new HighlightDTO("Priority customer support")
//           );
//       }
//   }
//
// ── Subscription.java (Entity) ────────────────────────────────
//
//   @Entity @Table(name = "subscriptions")
//   public class Subscription {
//       @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
//       private Long id;
//
//       @Column(name = "tenant_id",  nullable = false)  private String    tenantId;
//       @ManyToOne(fetch = FetchType.LAZY)
//       @JoinColumn(name = "plan_id", nullable = false)  private Plan      plan;
//       @Column(name = "start_date", nullable = false)   private LocalDate startDate;
//       @Column(name = "end_date",   nullable = false)   private LocalDate endDate;
//       @Column(name = "status",     nullable = false)   private String    status;
//       @Column(name = "created_at")                     private LocalDateTime createdAt;
//       @PrePersist protected void onCreate() { createdAt = LocalDateTime.now(); }
//       // getters + setters or @Data (Lombok)
//   }
//
// ── Plan.java (Entity) ────────────────────────────────────────
//
//   @Entity @Table(name = "plans")
//   public class Plan {
//       @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
//       private Long   id;
//       @Column(name = "public_id",    unique = true) private String publicId;
//       @Column(name = "name",         nullable = false) private String name;
//       @Column(name = "description")                    private String description;
//       @Column(name = "price",        nullable = false) private Double price;
//       @Column(name = "duration_days",nullable = false) private int    durationDays;
//       @Column(name = "max_users",    nullable = false) private int    maxUsers;
//       @Column(name = "tier")                           private String tier;
//       @OneToMany(mappedBy = "plan", fetch = FetchType.LAZY)
//       private List<PlanModule> modules;
//       // getters + setters or @Data (Lombok)
//   }
//
// ── All DTOs ──────────────────────────────────────────────────
//
//   // PlanDTO.java
//   @Data @Builder
//   public class PlanDTO {
//       private String planId, planName, description, startDate,
//                      endDate, status, tier;
//       private double price;
//       private int    duration, maxUsers, activeUsers,
//                      daysLeft, daysUsedPct, usersUsedPct;
//   }
//
//   // HighlightDTO.java
//   @Data @AllArgsConstructor
//   public class HighlightDTO { private String label; }
//
//   // SubscriptionInfoDTO.java
//   @Data @Builder
//   public class SubscriptionInfoDTO {
//       private PlanDTO            plan;
//       private List<String>       modules;
//       private List<HighlightDTO> highlights;
//   }
//
//   // RenewalResponseDTO.java
//   @Data @AllArgsConstructor
//   public class RenewalResponseDTO {
//       private boolean success; private String message,
//           paymentLink, requestId;
//   }
//
//   // UpgradeResponseDTO.java
//   @Data @AllArgsConstructor
//   public class UpgradeResponseDTO {
//       private boolean success; private String message,
//           requestId, salesEmail;
//   }
//
//   // SupportResponseDTO.java
//   @Data @AllArgsConstructor
//   public class SupportResponseDTO {
//       private boolean success; private String message, ticketId;
//   }
//
//   // RenewalRequest.java
//   public class RenewalRequest {
//       private String planId, duration; // getters + setters
//   }
//
//   // UpgradeRequest.java
//   public class UpgradeRequest {
//       private String currentPlanId, targetPlanId, duration; // getters + setters
//   }
//
//   // SupportRequest.java
//   public class SupportRequest {
//       private String type, message; // getters + setters
//   }
//
// ─────────────────────────────────────────────────────────────
// ── PostgreSQL Schema ─────────────────────────────────────────
//
//   -- Plans (Super Admin managed)
//   CREATE TABLE plans (
//     id            BIGSERIAL    PRIMARY KEY,
//     public_id     VARCHAR(50)  NOT NULL UNIQUE,
//     name          VARCHAR(255) NOT NULL,
//     description   TEXT,
//     price         DECIMAL(10,2) NOT NULL,
//     duration_days INTEGER      NOT NULL DEFAULT 30,
//     max_users     INTEGER      NOT NULL DEFAULT 5,
//     tier          VARCHAR(50),
//     active        BOOLEAN      DEFAULT TRUE,
//     created_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
//   );
//
//   -- Plan modules (which modules each plan includes)
//   CREATE TABLE plan_modules (
//     id          BIGSERIAL    PRIMARY KEY,
//     plan_id     BIGINT       NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
//     module_name VARCHAR(100) NOT NULL,
//     UNIQUE(plan_id, module_name)
//   );
//   CREATE INDEX idx_pm_plan_id ON plan_modules (plan_id);
//
//   -- Tenant subscriptions
//   CREATE TABLE subscriptions (
//     id          BIGSERIAL    PRIMARY KEY,
//     tenant_id   VARCHAR(100) NOT NULL,
//     plan_id     BIGINT       NOT NULL REFERENCES plans(id),
//     start_date  DATE         NOT NULL,
//     end_date    DATE         NOT NULL,
//     status      VARCHAR(20)  NOT NULL DEFAULT 'Active',
//     created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
//     CONSTRAINT chk_sub_status CHECK (
//       status IN ('Active','Expired','Suspended','Trial','Cancelled'))
//   );
//   CREATE INDEX idx_sub_tenant_id ON subscriptions (tenant_id);
//   CREATE INDEX idx_sub_status    ON subscriptions (tenant_id, status);
//   CREATE INDEX idx_sub_end_date  ON subscriptions (end_date);
//
//   -- Renewal / Upgrade / Support request log
//   CREATE TABLE subscription_requests (
//     id           BIGSERIAL    PRIMARY KEY,
//     tenant_id    VARCHAR(100) NOT NULL,
//     type         VARCHAR(20)  NOT NULL,  -- 'RENEWAL' | 'UPGRADE' | 'SUPPORT'
//     plan_id      VARCHAR(50),
//     target_plan  VARCHAR(50),
//     duration     VARCHAR(20),
//     message      TEXT,
//     request_id   VARCHAR(50)  NOT NULL UNIQUE,
//     status       VARCHAR(20)  DEFAULT 'PENDING',
//     created_at   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
//   );
//   CREATE INDEX idx_sreq_tenant ON subscription_requests (tenant_id);
//
//   -- Seed plan data
//   INSERT INTO plans (public_id, name, description, price, duration_days, max_users, tier)
//   VALUES
//     ('dolphin-monthly', 'Dolphin Plan Monthly - Subscription',
//      'Dolphin Plan Monthly - Subscription', 1890.00, 30, 11, 'Dolphin'),
//     ('shark-monthly',   'Shark Plan Monthly - Subscription',
//      'Shark Plan Monthly - Subscription',   2990.00, 30, 25, 'Shark'),
//     ('whale-annual',    'Whale Plan Annual - Subscription',
//      'Whale Plan Annual - Subscription',   24990.00, 365, 50, 'Whale');
//
//   -- Seed plan modules for Dolphin plan
//   INSERT INTO plan_modules (plan_id, module_name)
//   SELECT p.id, m FROM plans p,
//   UNNEST(ARRAY[
//     'Booking Management','Customer Management','Dashboard & Core',
//     'Email Configuration','Lead Management','Master Data Management',
//     'Quotation Management','Reminders & Notifications','Reports & Analytics',
//     'User Management','Vendor Management','Weblink Sharing',
//     'WhatsApp Integration'
//   ]) AS m
//   WHERE p.public_id = 'dolphin-monthly';
//
// ── SubscriptionRepository.java ───────────────────────────────
//
//   @Repository
//   public interface SubscriptionRepository
//       extends JpaRepository<Subscription, Long> {
//
//       @Query("SELECT s FROM Subscription s WHERE s.tenantId = :tid " +
//              "AND s.status = 'Active' ORDER BY s.endDate DESC")
//       Optional<Subscription> findActiveByTenantId(@Param("tid") String tenantId);
//
//       @Query("SELECT COUNT(r) FROM SubscriptionRequest r " +
//              "WHERE r.tenantId = :tid AND r.type = 'RENEWAL'")
//       long countRenewalRequests(@Param("tid") String tenantId);
//
//       @Query("SELECT COUNT(r) FROM SubscriptionRequest r " +
//              "WHERE r.tenantId = :tid AND r.type = 'UPGRADE'")
//       long countUpgradeRequests(@Param("tid") String tenantId);
//
//       @Query("SELECT COUNT(r) FROM SubscriptionRequest r " +
//              "WHERE r.tenantId = :tid AND r.type = 'SUPPORT'")
//       long countSupportTickets(@Param("tid") String tenantId);
//   }
//
//   // PlanModuleRepository.java
//   @Repository
//   public interface PlanModuleRepository
//       extends JpaRepository<PlanModule, Long> {
//       @Query("SELECT pm.moduleName FROM PlanModule pm WHERE pm.plan.id = :planId " +
//              "ORDER BY pm.moduleName ASC")
//       List<String> findModuleNamesByPlanId(@Param("planId") Long planId);
//   }
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