// src/services/whatsAppConfigService.js
// ─────────────────────────────────────────────────────────────
// WhatsApp Configuration Page — API Service
// Page: WhatsAppConfiguration.jsx
// Route: /Settings/WhatsApp
// Backend: Java Spring Boot REST API
// Database: PostgreSQL
// Covers:
//   - Get current WhatsApp config (load form on mount)
//   - Save WhatsApp configuration
//   - Send test WhatsApp message
//   - Get integration stats (sidebar quick stats)
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


// ═════════════════════════════════════════════════════════════
// WHATSAPP CONFIGURATION SERVICE
// Spring Boot Controller: /api/settings/whatsapp
// PostgreSQL Table: tenant_settings (whatsapp columns)
// ═════════════════════════════════════════════════════════════
const whatsAppConfigService = {

  // ── GET CURRENT WHATSAPP CONFIG (load form on mount) ───────
  // GET /api/settings/whatsapp/config
  // @GetMapping("/api/settings/whatsapp/config")
  // public ResponseEntity<WhatsAppConfigDTO> getConfig()
  //
  // Used on page mount to pre-fill the form fields
  //
  // IMPORTANT — API Key security:
  //   Never return the real API key to the frontend.
  //   Return apiKeySet: true/false so the UI can show
  //   "••••••••" as a placeholder when a key already exists.
  //
  // Response:
  // {
  //   configured:        true,
  //   apiKeySet:         true,       // true = key exists (never return actual value)
  //   templateName:      "quotation_template",
  //   templateLanguage:  "en",
  //   headerImageUrl:    "https://example.com/header.jpg",
  //   whatsAppPhone:     "+91-9099097103",
  //   lastTestedAt:      "Jun 25, 2026",   // or null
  //   lastSavedAt:       "Jun 20, 2026"    // or null
  // }
  getConfig: () => {
    return api.get("/api/settings/whatsapp/config");
  },

  // ── SAVE WHATSAPP CONFIGURATION ────────────────────────────
  // POST /api/settings/whatsapp/config
  // @PostMapping("/api/settings/whatsapp/config")
  // public ResponseEntity<SaveConfigResponseDTO> saveConfig(
  //     @RequestBody @Valid WhatsAppConfigRequest request)
  //
  // IMPORTANT — API Key handling:
  //   If the user didn't change the API key (left it as "••••••••"),
  //   send apiKeyChanged: false and omit the apiKey field.
  //   The backend keeps the existing encrypted key untouched.
  //   Only send the actual key when the user typed a new one.
  //
  // Request body:
  // {
  //   apiKeyChanged:     true,                 // true = new key provided
  //   apiKey:            "new-interakt-key",   // only when apiKeyChanged=true
  //   templateName:      "quotation_template",
  //   templateLanguage:  "en",
  //   headerImageUrl:    "https://example.com/header.jpg"  // optional
  // }
  //
  // Backend logic:
  //   1. Validates required fields (400 if missing)
  //   2. If apiKeyChanged=true: AES-encrypts the new API key and stores it
  //   3. Saves template settings to tenant_settings
  //   4. Updates tenant_settings.updated_at = NOW()
  //
  // Response (200 OK):
  // {
  //   success:   true,
  //   message:   "WhatsApp configuration saved successfully",
  //   savedAt:   "Jun 25, 2026 10:15"
  // }
  //
  // Error responses:
  //   400 — { message: "API Key is required" }
  //   400 — { message: "Template Name is required" }
  //   400 — { message: "Template Language is required" }
  //   500 — { message: "Failed to save configuration" }
  saveConfig: (formData) => {
    return api.post("/api/settings/whatsapp/config", {
      apiKeyChanged:    formData.apiKeyChanged    || false,
      apiKey:           formData.apiKeyChanged    ? formData.apiKey : undefined,
      templateName:     formData.templateName.trim(),
      templateLanguage: formData.templateLanguage.trim(),
      headerImageUrl:   formData.headerImageUrl?.trim() || null,
    });
  },

  // ── SEND TEST WHATSAPP MESSAGE ─────────────────────────────
  // POST /api/settings/whatsapp/test
  // @PostMapping("/api/settings/whatsapp/test")
  // public ResponseEntity<TestWhatsAppResponseDTO> sendTestMessage(
  //     @RequestBody @Valid TestWhatsAppRequest request)
  //
  // Used in the Test WhatsApp Integration section
  //
  // Backend logic:
  //   1. Reads current WhatsApp config from tenant_settings
  //   2. Decrypts stored API key
  //   3. Calls Interakt API POST /api/v1/send/whatsapp/
  //      with the stored template + the recipient phone
  //   4. Updates tenant_settings.wa_last_tested_at = NOW()
  //   5. Logs the test message to whatsapp_logs table
  //   6. Returns success or structured error
  //
  // Request body:
  // {
  //   phoneNumber: "9099097103"   // 10-digit without country code
  //                               // backend prepends +91
  // }
  //
  // Response (200 OK — test sent):
  // {
  //   success:   true,
  //   message:   "Test message sent successfully to +919099097103",
  //   testedAt:  "Jun 25, 2026 10:20"
  // }
  //
  // Response (200 OK — test failed — structured error, not 500):
  // {
  //   success:  false,
  //   message:  "Invalid API key. Check your Interakt credentials.",
  //   error:    "401 Unauthorized from Interakt API"
  // }
  //
  // Error responses:
  //   400 — { message: "Phone number is required" }
  //   400 — { message: "Phone number must be 10 digits" }
  //   422 — { message: "WhatsApp is not configured. Save configuration first." }
  sendTestMessage: (phoneNumber) => {
    return api.post("/api/settings/whatsapp/test", {
      phoneNumber: phoneNumber.replace(/\D/g, "").slice(0, 10),
    });
  },

  // ── GET INTEGRATION STATS (sidebar quick stats) ────────────
  // GET /api/settings/whatsapp/stats
  // @GetMapping("/api/settings/whatsapp/stats")
  // public ResponseEntity<WhatsAppStatsDTO> getStats()
  //
  // Used to populate the Integration Stats sidebar card:
  //   Messages Sent | Delivery Rate | Last Tested | API Status
  //
  // Response:
  // {
  //   messagesSent:  128,              // total this month
  //   deliveryRate:  "98%",
  //   lastTestedAt:  "Jun 25, 2026",  // or null
  //   apiStatus:     "Active",         // "Active" | "Inactive" | "Error"
  //   apiStatusSub:  "Connected"
  // }
  getStats: () => {
    return api.get("/api/settings/whatsapp/stats");
  },
};

export default whatsAppConfigService;


// ═════════════════════════════════════════════════════════════
// HOW TO USE IN WhatsAppConfiguration.jsx
// ═════════════════════════════════════════════════════════════
//
// STEP 1 — Import:
//   import whatsAppConfigService
//     from "../services/whatsAppConfigService";
//
// ─────────────────────────────────────────────────────────────
// STEP 2 — Add state at top of WhatsAppConfiguration():
//
//   const [loadingConfig,   setLoadingConfig]   = useState(true);
//   const [apiKeyPreFilled, setApiKeyPreFilled] = useState(false);
//   const [stats,           setStats]           = useState(null);
//
// ─────────────────────────────────────────────────────────────
// STEP 3 — Load config + stats on mount:
//
//   useEffect(() => {
//     setLoadingConfig(true);
//     Promise.all([
//       whatsAppConfigService.getConfig(),
//       whatsAppConfigService.getStats(),
//     ])
//       .then(([configRes, statsRes]) => {
//         const d = configRes.data;
//         setForm({
//           apiKey:           d.apiKeySet ? "••••••••" : "",
//           templateName:     d.templateName     || "",
//           templateLanguage: d.templateLanguage || "en",
//           headerImageUrl:   d.headerImageUrl   || "",
//         });
//         setApiKeyPreFilled(d.apiKeySet);
//         setStats(statsRes.data);
//       })
//       .catch(() => {})
//       .finally(() => setLoadingConfig(false));
//   }, []);
//
// ─────────────────────────────────────────────────────────────
// STEP 4 — Replace handleSave:
//
//   const handleSave = async (ev) => {
//     ev.preventDefault();
//     const v = validate();
//     if (Object.keys(v).length) {
//       setErrs(v);
//       showToast("Fix the errors below.", "error");
//       return;
//     }
//     setSaving(true);
//     try {
//       // Detect if the user changed the API key
//       const apiKeyChanged = form.apiKey !== "••••••••";
//       const res = await whatsAppConfigService.saveConfig({
//         ...form,
//         apiKeyChanged,
//         apiKey: apiKeyChanged ? form.apiKey : undefined,
//       });
//       showToast(res.data.message || "WhatsApp configuration saved! ✅");
//       setApiKeyPreFilled(true);
//       // Refresh stats after save
//       whatsAppConfigService.getStats().then(r => setStats(r.data));
//     } catch (err) {
//       showToast(
//         err?.response?.data?.message || "Failed to save configuration.",
//         "error"
//       );
//     } finally {
//       setSaving(false);
//     }
//   };
//
// ─────────────────────────────────────────────────────────────
// STEP 5 — Replace handleTestSend:
//
//   const handleTestSend = async () => {
//     if (!testPhone.trim() || testPhone.replace(/\D/g, "").length !== 10) {
//       setTestResult({ type: "error", msg: "Enter a valid 10-digit phone number." });
//       return;
//     }
//     setTestSending(true);
//     setTestResult(null);
//     try {
//       const res = await whatsAppConfigService.sendTestMessage(testPhone);
//       if (res.data.success) {
//         setTestResult({ type: "success", msg: res.data.message });
//         // Refresh stats to update "Last Tested"
//         whatsAppConfigService.getStats().then(r => setStats(r.data));
//       } else {
//         setTestResult({ type: "error", msg: res.data.message });
//       }
//     } catch (err) {
//       setTestResult({
//         type: "error",
//         msg: err?.response?.data?.message
//           || "Failed to send test message. Check your API key and template.",
//       });
//     } finally {
//       setTestSending(false);
//     }
//   };
//
// ─────────────────────────────────────────────────────────────
// STEP 6 — Bind stats to sidebar card:
//
//   // Replace hardcoded array values in the stats card:
//   const STATS_ROWS = stats
//     ? [
//         { label:"Messages Sent", value:String(stats.messagesSent), sub:"This month",       color:"text-green-600"   },
//         { label:"Delivery Rate", value:stats.deliveryRate,         sub:"Last 30 days",     color:"text-blue-600"    },
//         { label:"Last Tested",   value:stats.lastTestedAt || "—",  sub:"Test result",      color:"text-teal-600"    },
//         { label:"API Status",    value:stats.apiStatus,            sub:stats.apiStatusSub, color:"text-emerald-600" },
//       ]
//     : [];
//
// ═════════════════════════════════════════════════════════════
// SPRING BOOT JAVA BACKEND — FULL REFERENCE
// ═════════════════════════════════════════════════════════════
//
// ── WhatsAppConfigController.java ─────────────────────────────
//
//   @RestController
//   @RequestMapping("/api/settings/whatsapp")
//   @CrossOrigin(origins = "http://localhost:3000")
//   public class WhatsAppConfigController {
//
//       @Autowired private WhatsAppConfigService service;
//
//       @GetMapping("/config")
//       public ResponseEntity<WhatsAppConfigDTO> getConfig() {
//           return ResponseEntity.ok(service.getConfig());
//       }
//
//       @PostMapping("/config")
//       public ResponseEntity<SaveConfigResponseDTO> saveConfig(
//           @RequestBody @Valid WhatsAppConfigRequest request) {
//           return ResponseEntity.ok(service.saveConfig(request));
//       }
//
//       @PostMapping("/test")
//       public ResponseEntity<TestWhatsAppResponseDTO> sendTestMessage(
//           @RequestBody @Valid TestWhatsAppRequest request) {
//           return ResponseEntity.ok(service.sendTestMessage(request));
//       }
//
//       @GetMapping("/stats")
//       public ResponseEntity<WhatsAppStatsDTO> getStats() {
//           return ResponseEntity.ok(service.getStats());
//       }
//   }
//
// ── WhatsAppConfigService.java ────────────────────────────────
//
//   @Service @Transactional
//   public class WhatsAppConfigService {
//
//       @Autowired private TenantSettingsRepository settingsRepo;
//       @Autowired private WhatsAppLogRepository    waLogRepo;
//       @Autowired private TenantContext            tenantCtx;
//       @Autowired private AesEncryptUtil           aes;
//       @Autowired private InteraktApiClient        interaktClient;
//
//       public WhatsAppConfigDTO getConfig() {
//           String tenantId   = tenantCtx.getTenantId();
//           TenantSettings ts = settingsRepo.findByTenantId(tenantId)
//               .orElse(new TenantSettings());
//           boolean configured = ts.getWhatsAppApiKeyEnc() != null
//               && !ts.getWhatsAppApiKeyEnc().isBlank();
//           DateTimeFormatter fmt = DateTimeFormatter.ofPattern("MMM dd, yyyy");
//           return WhatsAppConfigDTO.builder()
//               .configured(configured)
//               .apiKeySet(configured)       // NEVER return the actual key
//               .templateName(ts.getWaTemplateName())
//               .templateLanguage(ts.getWaTemplateLanguage() != null
//                   ? ts.getWaTemplateLanguage() : "en")
//               .headerImageUrl(ts.getWaHeaderImageUrl())
//               .whatsAppPhone(ts.getWhatsAppPhone())
//               .lastTestedAt(ts.getWaLastTestedAt() != null
//                   ? ts.getWaLastTestedAt().format(fmt) : null)
//               .lastSavedAt(ts.getUpdatedAt() != null
//                   ? ts.getUpdatedAt().format(fmt) : null)
//               .build();
//       }
//
//       public SaveConfigResponseDTO saveConfig(WhatsAppConfigRequest req) {
//           String tenantId   = tenantCtx.getTenantId();
//           TenantSettings ts = settingsRepo.findByTenantId(tenantId)
//               .orElse(new TenantSettings(tenantId));
//           // Only update the API key when user actually changed it
//           if (req.isApiKeyChanged() && req.getApiKey() != null
//                   && !req.getApiKey().isBlank()) {
//               ts.setWhatsAppApiKeyEnc(aes.encrypt(req.getApiKey()));
//           }
//           ts.setWaTemplateName(req.getTemplateName().trim());
//           ts.setWaTemplateLanguage(req.getTemplateLanguage().trim());
//           ts.setWaHeaderImageUrl(req.getHeaderImageUrl() != null
//               ? req.getHeaderImageUrl().trim() : null);
//           settingsRepo.save(ts);
//           String savedAt = LocalDateTime.now()
//               .format(DateTimeFormatter.ofPattern("MMM dd, yyyy HH:mm"));
//           return new SaveConfigResponseDTO(
//               true, "WhatsApp configuration saved successfully", savedAt);
//       }
//
//       public TestWhatsAppResponseDTO sendTestMessage(TestWhatsAppRequest req) {
//           String tenantId   = tenantCtx.getTenantId();
//           TenantSettings ts = settingsRepo.findByTenantId(tenantId)
//               .orElseThrow(() -> new ResponseStatusException(
//                   HttpStatus.UNPROCESSABLE_ENTITY,
//                   "WhatsApp is not configured. Save configuration first."));
//           boolean configured = ts.getWhatsAppApiKeyEnc() != null
//               && !ts.getWhatsAppApiKeyEnc().isBlank();
//           if (!configured)
//               throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY,
//                   "WhatsApp is not configured. Save configuration first.");
//
//           String decryptedKey = aes.decrypt(ts.getWhatsAppApiKeyEnc());
//           String fullPhone    = "+91" + req.getPhoneNumber().replaceAll("\\D", "");
//
//           try {
//               // Call Interakt API
//               InteraktSendRequest body = new InteraktSendRequest();
//               body.setPhoneNumber(fullPhone);
//               body.setCallbackData("test_message");
//               body.setType("Template");
//               body.setTemplate(new InteraktTemplate(
//                   ts.getWaTemplateName(),
//                   ts.getWaTemplateLanguage(),
//                   List.of("Test User"),          // bodyValues: {{1}} = "Test User"
//                   ts.getWaHeaderImageUrl() != null
//                       ? ts.getWaHeaderImageUrl() : null,
//                   "https://example.com/test"    // button URL value {{1}}
//               ));
//               interaktClient.sendMessage(decryptedKey, body);
//
//               // Update last tested timestamp
//               ts.setWaLastTestedAt(LocalDateTime.now());
//               settingsRepo.save(ts);
//
//               // Log to whatsapp_logs
//               WhatsAppLog log = new WhatsAppLog(tenantId, fullPhone,
//                   ts.getWaTemplateName(), "SENT", null, LocalDateTime.now());
//               waLogRepo.save(log);
//
//               String testedAt = LocalDateTime.now()
//                   .format(DateTimeFormatter.ofPattern("MMM dd, yyyy HH:mm"));
//               return new TestWhatsAppResponseDTO(
//                   true,
//                   "Test message sent successfully to " + fullPhone,
//                   null, testedAt);
//
//           } catch (Exception ex) {
//               // Log failed attempt
//               WhatsAppLog log = new WhatsAppLog(tenantId, fullPhone,
//                   ts.getWaTemplateName(), "FAILED", ex.getMessage(), LocalDateTime.now());
//               waLogRepo.save(log);
//               // Return structured error — not 500
//               return new TestWhatsAppResponseDTO(
//                   false,
//                   "Failed to send message. Check your API key and template name.",
//                   ex.getMessage(), null);
//           }
//       }
//
//       public WhatsAppStatsDTO getStats() {
//           String tenantId    = tenantCtx.getTenantId();
//           TenantSettings ts  = settingsRepo.findByTenantId(tenantId)
//               .orElse(new TenantSettings());
//           boolean configured = ts.getWhatsAppApiKeyEnc() != null
//               && !ts.getWhatsAppApiKeyEnc().isBlank();
//           LocalDate startOfMonth = LocalDate.now().withDayOfMonth(1);
//           long sent         = configured
//               ? waLogRepo.countByTenantIdAndStatusAndSentAtAfter(
//                   tenantId, "SENT", startOfMonth.atStartOfDay()) : 0;
//           long total        = configured
//               ? waLogRepo.countByTenantIdAndSentAtAfter(
//                   tenantId, startOfMonth.atStartOfDay()) : 0;
//           String rate       = total > 0
//               ? Math.round((double) sent / total * 100) + "%" : "—";
//           DateTimeFormatter fmt = DateTimeFormatter.ofPattern("MMM dd, yyyy");
//           String lastTested = ts.getWaLastTestedAt() != null
//               ? ts.getWaLastTestedAt().format(fmt) : null;
//           String apiStatus  = configured ? "Active"   : "Inactive";
//           String apiSub     = configured ? "Connected" : "Not configured";
//           return new WhatsAppStatsDTO(sent, rate, lastTested, apiStatus, apiSub);
//       }
//   }
//
// ── InteraktApiClient.java (HTTP client for Interakt) ─────────
//
//   @Component
//   public class InteraktApiClient {
//
//       private static final String INTERAKT_URL =
//           "https://api.interakt.ai/v1/public/message/";
//
//       @Autowired private RestTemplate restTemplate;
//
//       public void sendMessage(String apiKey, InteraktSendRequest body) {
//           HttpHeaders headers = new HttpHeaders();
//           headers.setContentType(MediaType.APPLICATION_JSON);
//           headers.set("Authorization", "Basic " + apiKey);
//           HttpEntity<InteraktSendRequest> entity = new HttpEntity<>(body, headers);
//           ResponseEntity<String> response = restTemplate.exchange(
//               INTERAKT_URL, HttpMethod.POST, entity, String.class);
//           if (!response.getStatusCode().is2xxSuccessful())
//               throw new RuntimeException("Interakt API error: " + response.getBody());
//       }
//   }
//
// ── All DTOs ──────────────────────────────────────────────────
//
//   // WhatsAppConfigRequest.java
//   public class WhatsAppConfigRequest {
//       private boolean apiKeyChanged;    // true = new key provided
//       private String  apiKey;           // only present when apiKeyChanged=true
//       @NotBlank(message = "Template Name is required")
//       private String  templateName;
//       @NotBlank(message = "Template Language is required")
//       private String  templateLanguage;
//       private String  headerImageUrl;   // optional
//       // getters + setters
//   }
//
//   // WhatsAppConfigDTO.java
//   @Data @Builder
//   public class WhatsAppConfigDTO {
//       private boolean configured;
//       private boolean apiKeySet;         // true = key exists, never return key
//       private String  templateName;
//       private String  templateLanguage;
//       private String  headerImageUrl;
//       private String  whatsAppPhone;
//       private String  lastTestedAt;
//       private String  lastSavedAt;
//   }
//
//   // SaveConfigResponseDTO.java
//   @Data @AllArgsConstructor
//   public class SaveConfigResponseDTO {
//       private boolean success;
//       private String  message;
//       private String  savedAt;
//   }
//
//   // TestWhatsAppRequest.java
//   public class TestWhatsAppRequest {
//       @NotBlank(message = "Phone number is required")
//       @Pattern(regexp = "\\d{10}", message = "Phone number must be 10 digits")
//       private String phoneNumber;
//       // getters + setters
//   }
//
//   // TestWhatsAppResponseDTO.java
//   @Data @AllArgsConstructor
//   public class TestWhatsAppResponseDTO {
//       private boolean success;
//       private String  message;
//       private String  error;      // Interakt error string, or null on success
//       private String  testedAt;   // "Jun 25, 2026 10:20", or null on failure
//   }
//
//   // WhatsAppStatsDTO.java
//   @Data @AllArgsConstructor
//   public class WhatsAppStatsDTO {
//       private long   messagesSent;
//       private String deliveryRate;  // "98%"
//       private String lastTestedAt;  // "Jun 25, 2026" or null
//       private String apiStatus;     // "Active" | "Inactive"
//       private String apiStatusSub;  // "Connected" | "Not configured"
//   }
//
// ─────────────────────────────────────────────────────────────
// ── PostgreSQL Schema (tenant_settings — WhatsApp columns) ────
//
//   ALTER TABLE tenant_settings
//     ADD COLUMN IF NOT EXISTS whatsapp_api_key_enc TEXT,      -- AES-256 encrypted
//     ADD COLUMN IF NOT EXISTS whatsapp_phone        VARCHAR(20),
//     ADD COLUMN IF NOT EXISTS wa_template_name      VARCHAR(255),
//     ADD COLUMN IF NOT EXISTS wa_template_language  VARCHAR(20) DEFAULT 'en',
//     ADD COLUMN IF NOT EXISTS wa_header_image_url   TEXT,
//     ADD COLUMN IF NOT EXISTS wa_last_tested_at     TIMESTAMP;
//
//   -- WhatsApp message log table (tracks every sent message)
//   CREATE TABLE IF NOT EXISTS whatsapp_logs (
//     id          BIGSERIAL    PRIMARY KEY,
//     tenant_id   VARCHAR(100) NOT NULL,
//     phone       VARCHAR(20)  NOT NULL,
//     template    VARCHAR(255),
//     status      VARCHAR(20)  NOT NULL DEFAULT 'SENT',  -- SENT | FAILED | DELIVERED
//     error_msg   TEXT,
//     sent_at     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
//
//     CONSTRAINT chk_wa_status CHECK (status IN ('SENT','FAILED','DELIVERED','READ'))
//   );
//
//   CREATE INDEX IF NOT EXISTS idx_wal_tenant_id ON whatsapp_logs (tenant_id);
//   CREATE INDEX IF NOT EXISTS idx_wal_sent_at   ON whatsapp_logs (tenant_id, sent_at DESC);
//   CREATE INDEX IF NOT EXISTS idx_wal_status    ON whatsapp_logs (tenant_id, status);
//
// ── application.properties ───────────────────────────────────
//   spring.datasource.url=jdbc:postgresql://localhost:5432/travel_crm
//   spring.datasource.username=postgres
//   spring.datasource.password=yourpassword
//   spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
//   spring.jpa.hibernate.ddl-auto=update
//   server.port=8080
//   app.encryption.key=${AES_SECRET_KEY}    # 32-char, set in env only — never in code
//
// ── .env (React) ──────────────────────────────────────────────
//   REACT_APP_API_URL=http://localhost:8080
// ─────────────────────────────────────────────────────────────