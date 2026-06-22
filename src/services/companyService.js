// src/services/companyService.js
// ─────────────────────────────────────────────────────────────
// Company Profile Page — API Service
// Backend: Java Spring Boot REST API
// Database: PostgreSQL
// ─────────────────────────────────────────────────────────────

import API from "./axiosInstance";


// ═════════════════════════════════════════════════════════════
// 1. COMPANY SERVICE
//    Spring Boot Controller: /api/company
//    PostgreSQL Table: companies
// ═════════════════════════════════════════════════════════════
export const companyService = {

  // ── GET COMPANY PROFILE ────────────────────────────────────
  // GET /api/company
  // @GetMapping("/api/company")
  // public ResponseEntity<CompanyDTO> getCompany()
  //
  // Returns the single company profile row for the logged-in tenant.
  // Response:
  // {
  //   id: 1,
  //   name: "Nepal Tours And Travels",
  //   prefix: "NTAT",
  //   email: "nepaltours.travels@gmail.com",
  //   phone: "9918001088",
  //   website: "https://nepaltoursandtravels.com/",
  //   operatingSince: 1999,
  //   totalReviews: 313,
  //   tripsSold: 0,
  //   gstin: "09EKTPS8464R1ZE",
  //   tan: "ABCD1234SE",
  //   status: "Active",
  //   createdDate: "May 29, 2026",
  //   address: "Opp. Gate No. -1,\nRailway Station...",
  //   state: "Uttar Pradesh",
  //   logoUrl: "https://...",
  //   faviconUrl: "https://..."
  // }
  get: () => {
    return API.get("/company");
  },

  // ── UPDATE COMPANY PROFILE (JSON fields only) ──────────────
  // PUT /api/company
  // @PutMapping("/api/company")
  // public ResponseEntity<CompanyDTO> update(@RequestBody CompanyDTO dto)
  //
  // Request body (all fields optional except name/prefix/email/state):
  // {
  //   name, prefix, email, phone, website,
  //   operatingSince, totalReviews, tripsSold,
  //   gstin, tan, address, state
  // }
  update: (data) => {
    return API.put("/company", data);
  },

  // ── UPLOAD COMPANY LOGO ────────────────────────────────────
  // POST /api/company/logo
  // @PostMapping("/api/company/logo")
  // public ResponseEntity<CompanyDTO> uploadLogo(@RequestParam("file") MultipartFile file)
  //
  // Accepts: JPG, JPEG, PNG, SVG, GIF — max 2MB
  // Returns updated CompanyDTO with new logoUrl (stored in S3 / local storage)
  uploadLogo: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return API.post("/company/logo", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // ── UPLOAD COMPANY FAVICON ─────────────────────────────────
  // POST /api/company/favicon
  // @PostMapping("/api/company/favicon")
  // public ResponseEntity<CompanyDTO> uploadFavicon(@RequestParam("file") MultipartFile file)
  //
  // Accepts: ICO, PNG — max 2MB
  // Returns updated CompanyDTO with new faviconUrl
  uploadFavicon: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return API.post("/company/favicon", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // ── GET SUBSCRIPTION INFO ──────────────────────────────────
  // GET /api/company/subscription
  // @GetMapping("/api/company/subscription")
  // public ResponseEntity<SubscriptionDTO> getSubscription()
  //
  // Returns:
  // { plan, startDate, endDate, status, daysLeft, features }
  getSubscription: () => {
    return API.get("/company/subscription");
  },

  // ── GET AI CREDITS ─────────────────────────────────────────
  // GET /api/company/ai-credits
  // @GetMapping("/api/company/ai-credits")
  // public ResponseEntity<AiCreditsDTO> getAiCredits()
  //
  // Returns: { used, total, usedCost }
  getAiCredits: () => {
    return API.get("/company/ai-credits");
  },
};


// ═════════════════════════════════════════════════════════════
// 2. TAX RATE SERVICE
//    Spring Boot Controller: /api/tax-rates
//    PostgreSQL Table: tax_rates
// ═════════════════════════════════════════════════════════════
export const taxRateService = {

  // ── GET ALL TAX RATES ──────────────────────────────────────
  // GET /api/tax-rates
  // @GetMapping("/api/tax-rates")
  // public ResponseEntity<List<TaxRateDTO>> getAll()
  //
  // Returns all tax rates ordered by effective_from DESC.
  // Response:
  // [
  //   {
  //     id: 1,
  //     type: "GST",
  //     rate: 0.0,
  //     calculation: "Additive",
  //     effectiveFrom: "2026-05-29",
  //     description: "Standard GST",
  //     isActive: true,
  //     createdAt: "2026-05-29T10:00:00Z"
  //   },
  //   ...
  // ]
  getAll: () => {
    return API.get("/tax-rates");
  },

  // ── GET ACTIVE TAX RATES ONLY ──────────────────────────────
  // GET /api/tax-rates/active
  // @GetMapping("/api/tax-rates/active")
  // public ResponseEntity<List<TaxRateDTO>> getActive()
  getActive: () => {
    return API.get("/tax-rates/active");
  },

  // ── CREATE TAX RATE ────────────────────────────────────────
  // POST /api/tax-rates
  // @PostMapping("/api/tax-rates")
  // public ResponseEntity<TaxRateDTO> create(@RequestBody TaxRateDTO dto)
  //
  // Request body:
  // {
  //   type: "GST",              // GST | TCS | TDS | Service Tax | VAT | Other
  //   rate: 5.0,                // decimal
  //   calculation: "Additive",  // Additive | Inclusive | Exclusive
  //   effectiveFrom: "2026-06-18",
  //   description: "Budget 2026 rate"
  // }
  //
  // Backend logic: automatically sets previous active rate of
  // same type to inactive (effective_to = effectiveFrom - 1 day)
  create: (data) => {
    return API.post("/tax-rates", data);
  },

  // ── DELETE TAX RATE ────────────────────────────────────────
  // DELETE /api/tax-rates/{id}
  // @DeleteMapping("/api/tax-rates/{id}")
  // public ResponseEntity<Void> delete(@PathVariable Long id)
  delete: (id) => {
    return API.delete(`/tax-rates/${id}`);
  },

  // ── GET TAX RATE BY ID ─────────────────────────────────────
  // GET /api/tax-rates/{id}
  // @GetMapping("/api/tax-rates/{id}")
  // public ResponseEntity<TaxRateDTO> getById(@PathVariable Long id)
  getById: (id) => {
    return API.get(`/tax-rates/${id}`);
  },
};


// ═════════════════════════════════════════════════════════════
// DEFAULT EXPORT
// ═════════════════════════════════════════════════════════════
export default { companyService, taxRateService };


// ═════════════════════════════════════════════════════════════
// HOW TO USE IN CompanyProfile.jsx
// ═════════════════════════════════════════════════════════════
//
// STEP 1 — Import at top of CompanyProfile.jsx:
//   import { companyService, taxRateService }
//     from "../services/companyService";
//
// ─────────────────────────────────────────────────────────────
// STEP 2 — Replace mock useEffect with real API call:
//
//   useEffect(() => {
//     setLoading(true);
//     Promise.all([
//       companyService.get(),
//       companyService.getSubscription(),
//       companyService.getAiCredits(),
//     ])
//       .then(([companyRes, subRes, aiRes]) => {
//         setCompany(companyRes.data);
//         setSubscription(subRes.data);
//         setAiCredits(aiRes.data);
//       })
//       .catch(() => showToast("Failed to load company data.", "error"))
//       .finally(() => setLoading(false));
//   }, []);
//
// ─────────────────────────────────────────────────────────────
// STEP 3 — Replace handleSubmit in EditProfileTab:
//
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const errs2 = validate();
//     if (Object.keys(errs2).length) { setErrs(errs2); return; }
//     setSaving(true);
//     try {
//       // 1. Update JSON fields
//       const res = await companyService.update(form);
//
//       // 2. Upload logo if a new file was selected
//       if (logoFile) {
//         const logoRes = await companyService.uploadLogo(logoFile);
//         res.data.logoUrl = logoRes.data.logoUrl;
//       }
//
//       // 3. Upload favicon if a new file was selected
//       if (faviconFile) {
//         const favRes = await companyService.uploadFavicon(faviconFile);
//         res.data.faviconUrl = favRes.data.faviconUrl;
//       }
//
//       onSave(res.data);
//       showToast("Profile updated successfully! ✅");
//     } catch (err) {
//       showToast(
//         err?.response?.data?.message || "Failed to update.",
//         "error"
//       );
//     } finally {
//       setSaving(false);
//     }
//   };
//
// ─────────────────────────────────────────────────────────────
// STEP 4 — Replace Tax rate handlers in TaxConfigTab:
//
//   // Load on mount
//   useEffect(() => {
//     taxRateService.getAll().then(res => setRates(res.data));
//   }, []);
//
//   // Add new
//   const handleAdd = async () => {
//     const errs = validate();
//     if (Object.keys(errs).length) { setErrs(errs); return; }
//     setSaving(true);
//     try {
//       const res = await taxRateService.create(form);
//       setRates(prev => [...prev, res.data]);
//       setForm({ type:"", rate:"", calculation:"Additive", effectiveFrom:"", description:"" });
//       showToast("Tax rate added successfully.");
//     } catch (err) {
//       showToast(err?.response?.data?.message || "Failed to add.", "error");
//     } finally {
//       setSaving(false);
//     }
//   };
//
//   // Delete
//   const handleDelete = async (id) => {
//     try {
//       await taxRateService.delete(id);
//       setRates(prev => prev.filter(r => r.id !== id));
//       setDelId(null);
//       showToast("Tax rate removed.");
//     } catch {
//       showToast("Failed to delete.", "error");
//     }
//   };
//
// ═════════════════════════════════════════════════════════════
// SPRING BOOT JAVA BACKEND — FULL REFERENCE
// ═════════════════════════════════════════════════════════════
//
// ── CompanyController.java ────────────────────────────────────
//
//   @RestController
//   @RequestMapping("/api/company")
//   @CrossOrigin(origins = "http://localhost:3000")
//   public class CompanyController {
//
//       @Autowired private CompanyService service;
//
//       @GetMapping
//       public ResponseEntity<CompanyDTO> get() {
//           return ResponseEntity.ok(service.get());
//       }
//
//       @PutMapping
//       public ResponseEntity<CompanyDTO> update(@RequestBody CompanyDTO dto) {
//           return ResponseEntity.ok(service.update(dto));
//       }
//
//       @PostMapping("/logo")
//       public ResponseEntity<CompanyDTO> uploadLogo(
//               @RequestParam("file") MultipartFile file) {
//           return ResponseEntity.ok(service.uploadLogo(file));
//       }
//
//       @PostMapping("/favicon")
//       public ResponseEntity<CompanyDTO> uploadFavicon(
//               @RequestParam("file") MultipartFile file) {
//           return ResponseEntity.ok(service.uploadFavicon(file));
//       }
//
//       @GetMapping("/subscription")
//       public ResponseEntity<SubscriptionDTO> getSubscription() {
//           return ResponseEntity.ok(service.getSubscription());
//       }
//
//       @GetMapping("/ai-credits")
//       public ResponseEntity<AiCreditsDTO> getAiCredits() {
//           return ResponseEntity.ok(service.getAiCredits());
//       }
//   }
//
// ── TaxRateController.java ────────────────────────────────────
//
//   @RestController
//   @RequestMapping("/api/tax-rates")
//   @CrossOrigin(origins = "http://localhost:3000")
//   public class TaxRateController {
//
//       @Autowired private TaxRateService service;
//
//       @GetMapping
//       public ResponseEntity<List<TaxRateDTO>> getAll() {
//           return ResponseEntity.ok(service.getAll());
//       }
//
//       @GetMapping("/active")
//       public ResponseEntity<List<TaxRateDTO>> getActive() {
//           return ResponseEntity.ok(service.getActive());
//       }
//
//       @GetMapping("/{id}")
//       public ResponseEntity<TaxRateDTO> getById(@PathVariable Long id) {
//           return ResponseEntity.ok(service.getById(id));
//       }
//
//       @PostMapping
//       public ResponseEntity<TaxRateDTO> create(@RequestBody TaxRateDTO dto) {
//           return ResponseEntity.status(HttpStatus.CREATED)
//               .body(service.create(dto));
//       }
//
//       @DeleteMapping("/{id}")
//       public ResponseEntity<Void> delete(@PathVariable Long id) {
//           service.delete(id);
//           return ResponseEntity.noContent().build();
//       }
//   }
//
// ── Company.java (Entity) ─────────────────────────────────────
//
//   @Entity
//   @Table(name = "companies")
//   public class Company {
//       @Id
//       @GeneratedValue(strategy = GenerationType.IDENTITY)
//       private Long id;
//
//       @Column(name = "name", nullable = false, length = 255)
//       private String name;
//
//       @Column(name = "prefix", nullable = false, unique = true, length = 5)
//       private String prefix;
//
//       @Column(name = "email", nullable = false, unique = true)
//       private String email;
//
//       @Column(name = "phone", length = 20)
//       private String phone;
//
//       @Column(name = "website")
//       private String website;
//
//       @Column(name = "operating_since")
//       private Integer operatingSince;
//
//       @Column(name = "total_reviews")
//       private Integer totalReviews = 0;
//
//       @Column(name = "trips_sold")
//       private Integer tripsSold = 0;
//
//       @Column(name = "gstin", length = 15)
//       private String gstin;
//
//       @Column(name = "tan", length = 10)
//       private String tan;
//
//       @Column(name = "status", length = 20)
//       private String status = "Active";
//
//       @Column(name = "address", columnDefinition = "TEXT")
//       private String address;
//
//       @Column(name = "state", length = 100)
//       private String state;
//
//       @Column(name = "logo_url")
//       private String logoUrl;
//
//       @Column(name = "favicon_url")
//       private String faviconUrl;
//
//       @Column(name = "created_at")
//       private LocalDateTime createdAt;
//
//       @Column(name = "updated_at")
//       private LocalDateTime updatedAt;
//
//       @PrePersist
//       protected void onCreate() {
//           createdAt = LocalDateTime.now();
//           updatedAt = LocalDateTime.now();
//       }
//
//       @PreUpdate
//       protected void onUpdate() {
//           updatedAt = LocalDateTime.now();
//       }
//       // getters + setters or @Data (Lombok)
//   }
//
// ── TaxRate.java (Entity) ─────────────────────────────────────
//
//   @Entity
//   @Table(name = "tax_rates")
//   public class TaxRate {
//       @Id
//       @GeneratedValue(strategy = GenerationType.IDENTITY)
//       private Long id;
//
//       @Column(name = "type", nullable = false, length = 50)
//       private String type;             // GST, TCS, TDS, Service Tax, VAT, Other
//
//       @Column(name = "rate", nullable = false, precision = 5, scale = 2)
//       private BigDecimal rate;
//
//       @Column(name = "calculation", length = 20)
//       private String calculation;      // Additive, Inclusive, Exclusive
//
//       @Column(name = "effective_from", nullable = false)
//       private LocalDate effectiveFrom;
//
//       @Column(name = "effective_to")
//       private LocalDate effectiveTo;   // null = currently active
//
//       @Column(name = "description", length = 500)
//       private String description;
//
//       @Column(name = "is_active")
//       private boolean isActive = true;
//
//       @Column(name = "created_at")
//       private LocalDateTime createdAt;
//
//       @PrePersist
//       protected void onCreate() { createdAt = LocalDateTime.now(); }
//       // getters + setters or @Data (Lombok)
//   }
//
// ── CompanyDTO.java ───────────────────────────────────────────
//
//   public class CompanyDTO {
//       private Long    id;
//       private String  name;
//       private String  prefix;
//       private String  email;
//       private String  phone;
//       private String  website;
//       private Integer operatingSince;
//       private Integer totalReviews;
//       private Integer tripsSold;
//       private String  gstin;
//       private String  tan;
//       private String  status;
//       private String  address;
//       private String  state;
//       private String  logoUrl;
//       private String  faviconUrl;
//       private String  createdDate;   // formatted e.g. "May 29, 2026"
//       // getters + setters or @Data (Lombok)
//   }
//
// ── TaxRateDTO.java ───────────────────────────────────────────
//
//   public class TaxRateDTO {
//       private Long       id;
//       private String     type;
//       private BigDecimal rate;
//       private String     calculation;
//       private String     effectiveFrom;   // ISO date string "2026-06-18"
//       private String     effectiveTo;
//       private String     description;
//       private boolean    isActive;
//       private String     createdAt;
//       // getters + setters or @Data (Lombok)
//   }
//
// ── SubscriptionDTO.java ──────────────────────────────────────
//
//   public class SubscriptionDTO {
//       private String  plan;
//       private String  startDate;
//       private String  endDate;
//       private String  status;
//       private Integer daysLeft;
//       private List<String> features;
//   }
//
// ── AiCreditsDTO.java ─────────────────────────────────────────
//
//   public class AiCreditsDTO {
//       private Integer used;
//       private Integer total;
//       private Double  usedCost;
//   }
//
// ── TaxRateService.java (business logic) ─────────────────────
//
//   @Service
//   public class TaxRateService {
//
//       @Autowired private TaxRateRepository repo;
//
//       public List<TaxRateDTO> getAll() {
//           return repo.findAllByOrderByEffectiveFromDesc()
//               .stream().map(this::toDTO).collect(Collectors.toList());
//       }
//
//       public List<TaxRateDTO> getActive() {
//           return repo.findByIsActiveTrueOrderByTypeAsc()
//               .stream().map(this::toDTO).collect(Collectors.toList());
//       }
//
//       @Transactional
//       public TaxRateDTO create(TaxRateDTO dto) {
//           // Close previous active rate of same type
//           repo.findByTypeAndIsActiveTrue(dto.getType()).ifPresent(existing -> {
//               existing.setIsActive(false);
//               existing.setEffectiveTo(
//                   LocalDate.parse(dto.getEffectiveFrom()).minusDays(1)
//               );
//               repo.save(existing);
//           });
//
//           TaxRate rate = new TaxRate();
//           rate.setType(dto.getType());
//           rate.setRate(dto.getRate());
//           rate.setCalculation(dto.getCalculation());
//           rate.setEffectiveFrom(LocalDate.parse(dto.getEffectiveFrom()));
//           rate.setDescription(dto.getDescription());
//           rate.setIsActive(true);
//           return toDTO(repo.save(rate));
//       }
//
//       public void delete(Long id) {
//           repo.deleteById(id);
//       }
//
//       private TaxRateDTO toDTO(TaxRate r) {
//           TaxRateDTO dto = new TaxRateDTO();
//           dto.setId(r.getId());
//           dto.setType(r.getType());
//           dto.setRate(r.getRate());
//           dto.setCalculation(r.getCalculation());
//           dto.setEffectiveFrom(r.getEffectiveFrom().toString());
//           dto.setEffectiveTo(r.getEffectiveTo()!=null?r.getEffectiveTo().toString():null);
//           dto.setDescription(r.getDescription());
//           dto.setIsActive(r.isActive());
//           dto.setCreatedAt(r.getCreatedAt().toString());
//           return dto;
//       }
//   }
//
// ── application.properties (PostgreSQL) ──────────────────────
//
//   spring.datasource.url=jdbc:postgresql://localhost:5432/travel_crm
//   spring.datasource.username=postgres
//   spring.datasource.password=yourpassword
//   spring.datasource.driver-class-name=org.postgresql.Driver
//   spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
//   spring.jpa.hibernate.ddl-auto=update
//   spring.jpa.show-sql=true
//   spring.jpa.properties.hibernate.format_sql=true
//   server.port=8080
//
//   # File upload limits
//   spring.servlet.multipart.max-file-size=2MB
//   spring.servlet.multipart.max-request-size=5MB
//
//   # File storage path (local) — or replace with S3 config
//   app.upload.dir=uploads/
//
// ── pom.xml dependencies (add these) ─────────────────────────
//
//   <!-- PostgreSQL Driver -->
//   <dependency>
//     <groupId>org.postgresql</groupId>
//     <artifactId>postgresql</artifactId>
//     <scope>runtime</scope>
//   </dependency>
//
//   <!-- Spring Data JPA -->
//   <dependency>
//     <groupId>org.springframework.boot</groupId>
//     <artifactId>spring-boot-starter-data-jpa</artifactId>
//   </dependency>
//
//   <!-- Spring Web (multipart support) -->
//   <dependency>
//     <groupId>org.springframework.boot</groupId>
//     <artifactId>spring-boot-starter-web</artifactId>
//   </dependency>
//
//   <!-- Lombok (optional — removes boilerplate) -->
//   <dependency>
//     <groupId>org.projectlombok</groupId>
//     <artifactId>lombok</artifactId>
//     <optional>true</optional>
//   </dependency>
//
// ── .env (React — project root) ──────────────────────────────
//
//   REACT_APP_API_URL=http://localhost:8080
//
// ─────────────────────────────────────────────────────────────
// ── PostgreSQL Schema ─────────────────────────────────────────
//
//   -- Companies table
//   CREATE TABLE companies (
//     id               BIGSERIAL PRIMARY KEY,
//     name             VARCHAR(255)  NOT NULL,
//     prefix           VARCHAR(5)    NOT NULL UNIQUE,
//     email            VARCHAR(255)  NOT NULL UNIQUE,
//     phone            VARCHAR(20),
//     website          VARCHAR(500),
//     operating_since  INTEGER,
//     total_reviews    INTEGER       DEFAULT 0,
//     trips_sold       INTEGER       DEFAULT 0,
//     gstin            VARCHAR(15),
//     tan              VARCHAR(10),
//     status           VARCHAR(20)   DEFAULT 'Active',
//     address          TEXT,
//     state            VARCHAR(100),
//     logo_url         VARCHAR(500),
//     favicon_url      VARCHAR(500),
//     created_at       TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
//     updated_at       TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
//   );
//
//   -- Auto-update updated_at on every UPDATE
//   CREATE OR REPLACE FUNCTION update_updated_at_column()
//   RETURNS TRIGGER AS $$
//   BEGIN
//     NEW.updated_at = CURRENT_TIMESTAMP;
//     RETURN NEW;
//   END;
//   $$ language 'plpgsql';
//
//   CREATE TRIGGER set_companies_updated_at
//   BEFORE UPDATE ON companies
//   FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
//
//   -- Tax rates table
//   CREATE TABLE tax_rates (
//     id              BIGSERIAL PRIMARY KEY,
//     type            VARCHAR(50)    NOT NULL,    -- GST, TCS, TDS, etc.
//     rate            NUMERIC(5, 2)  NOT NULL,
//     calculation     VARCHAR(20)    DEFAULT 'Additive',
//     effective_from  DATE           NOT NULL,
//     effective_to    DATE,                       -- NULL = currently active
//     description     VARCHAR(500),
//     is_active       BOOLEAN        DEFAULT TRUE,
//     created_at      TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
//
//     CONSTRAINT chk_rate_positive CHECK (rate >= 0),
//     CONSTRAINT chk_effective_dates CHECK (
//       effective_to IS NULL OR effective_to > effective_from
//     )
//   );
//
//   CREATE INDEX idx_tax_rates_type      ON tax_rates (type);
//   CREATE INDEX idx_tax_rates_is_active ON tax_rates (is_active);
//
//   -- Subscriptions table
//   CREATE TABLE subscriptions (
//     id           BIGSERIAL PRIMARY KEY,
//     company_id   BIGINT         NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
//     plan         VARCHAR(255),
//     start_date   DATE,
//     end_date     DATE,
//     status       VARCHAR(20)    DEFAULT 'Active',
//     features     TEXT[],                        -- PostgreSQL array of strings
//     created_at   TIMESTAMP      DEFAULT CURRENT_TIMESTAMP
//   );
//
//   CREATE INDEX idx_subscriptions_company ON subscriptions (company_id);
//
//   -- AI credits table
//   CREATE TABLE ai_credits (
//     id           BIGSERIAL PRIMARY KEY,
//     company_id   BIGINT   NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
//     used         INTEGER  DEFAULT 0,
//     total        INTEGER  DEFAULT 10,
//     used_cost    NUMERIC(10, 2) DEFAULT 0.00,
//     created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//   );
//
//   CREATE UNIQUE INDEX idx_ai_credits_company ON ai_credits (company_id);
//
//   -- Seed company data
//   INSERT INTO companies
//     (name, prefix, email, phone, website, operating_since,
//      total_reviews, trips_sold, gstin, tan, status, address, state)
//   VALUES
//     ('Nepal Tours And Travels', 'NTAT', 'nepaltours.travels@gmail.com',
//      '9918001088', 'https://nepaltoursandtravels.com/', 1999,
//      313, 0, '09EKTPS8464R1ZE', 'ABCD1234SE', 'Active',
//      'Opp. Gate No. -1,' || chr(10) || 'Railway Station, Gorakhpur' || chr(10) || '(U.P) - 273001',
//      'Uttar Pradesh');
//
//   -- Seed subscription
//   INSERT INTO subscriptions (company_id, plan, start_date, end_date, status, features)
//   VALUES (1, 'Dolphin Plan Monthly - Subscription Plan',
//           '2026-05-29', '2026-06-28', 'Active', ARRAY['All Core Features']);
//
//   -- Seed AI credits
//   INSERT INTO ai_credits (company_id, used, total, used_cost) VALUES (1, 0, 10, 5.67);
//
//   -- Seed tax rates
//   INSERT INTO tax_rates (type, rate, calculation, effective_from, description, is_active)
//   VALUES
//     ('GST', 0.00, 'Additive', '2026-05-29', 'Standard GST', TRUE),
//     ('TCS', 5.00, 'Additive', '2026-05-29', 'TCS on tour packages', TRUE);
// ─────────────────────────────────────────────────────────────