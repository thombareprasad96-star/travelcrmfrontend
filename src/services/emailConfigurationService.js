// src/services/emailConfigurationService.js
// ─────────────────────────────────────────────────────────────
// Email Configuration Page — API Service
// Page: EmailConfiguration.jsx
// Route: /Settings/Email
// Backend: Java Spring Boot REST API
// Database: PostgreSQL
// Covers:
//   - Get current SMTP configuration (load form on mount)
//   - Save SMTP configuration
//   - Test email (send test message to any address)
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
// EMAIL CONFIGURATION SERVICE
// Spring Boot Controller: /api/settings/email
// PostgreSQL Table: tenant_settings (smtp columns)
// ═════════════════════════════════════════════════════════════
const emailConfigurationService = {

  // ── GET CURRENT SMTP CONFIG (load form on mount) ───────────
  // GET /api/settings/email/config
  // @GetMapping("/api/settings/email/config")
  // public ResponseEntity<EmailConfigDTO> getConfig()
  //
  // Used on page mount to pre-fill the form fields
  //
  // IMPORTANT — Password field:
  //   Never return the real password/app-key to the frontend.
  //   Return passwordSet: true/false so the UI can show
  //   "••••••••" as a placeholder when a password already exists.
  //
  // Response:
  // {
  //   configured:    false,
  //   smtpHost:      "smtp.gmail.com",   // or null if not set
  //   smtpPort:      "587 (TLS)",        // formatted string
  //   portNumber:    587,                // raw integer
  //   encryption:    "TLS",
  //   username:      "admin_ntat",       // or null
  //   passwordSet:   true,               // true = password exists in DB (never return actual value)
  //   fromEmail:     "noreply@nepaltoursandtravels.com",
  //   fromName:      "Nepal Tours And Travels",
  //   lastTestedAt:  "Jun 25, 2026",     // or null
  //   lastSavedAt:   "Jun 20, 2026"      // or null
  // }
  getConfig: () => {
    return api.get("/api/settings/email/config");
  },

  // ── SAVE SMTP CONFIGURATION ────────────────────────────────
  // POST /api/settings/email/config
  // @PostMapping("/api/settings/email/config")
  // public ResponseEntity<SaveConfigResponseDTO> saveConfig(
  //     @RequestBody @Valid EmailConfigRequest request)
  //
  // IMPORTANT — Password handling:
  //   If the user didn't change the password field (left it as "••••••••"),
  //   send passwordChanged: false and omit the password field.
  //   The backend keeps the existing stored password untouched.
  //   Only send the actual password when the user typed a new one.
  //
  // Request body:
  // {
  //   smtpHost:        "smtp.gmail.com",
  //   portNumber:      587,               // raw integer — backend parses from select value
  //   encryption:      "TLS",
  //   username:        "admin_ntat",
  //   passwordChanged: true,              // true = new password provided, false = keep existing
  //   password:        "new-app-password",// only included when passwordChanged=true
  //   fromEmail:       "noreply@company.com",
  //   fromName:        "Nepal Tours And Travels"
  // }
  //
  // Backend logic:
  //   1. Validates all required fields (400 if missing)
  //   2. Validates email format for fromEmail
  //   3. If passwordChanged=true: AES-encrypts the new password and stores it
  //   4. Saves to tenant_settings where tenant_id = TenantContext.current
  //   5. Updates tenant_settings.updated_at = NOW()
  //
  // Response (200 OK):
  // {
  //   success:   true,
  //   message:   "Email configuration saved successfully",
  //   savedAt:   "Jun 25, 2026 10:15"
  // }
  //
  // Error responses:
  //   400 — { message: "SMTP Host is required" }
  //   400 — { message: "Invalid email format for From Email" }
  //   500 — { message: "Failed to save configuration" }
  saveConfig: (formData) => {
    // Parse port number from display string e.g. "587 (TLS)" → 587
    const portNumber = parseInt(formData.smtpPort?.split(" ")[0], 10) || 587;

    return api.post("/api/settings/email/config", {
      smtpHost:        formData.smtpHost.trim(),
      portNumber,
      encryption:      formData.encryption,
      username:        formData.username.trim(),
      passwordChanged: formData.passwordChanged || false,
      password:        formData.passwordChanged ? formData.password : undefined,
      fromEmail:       formData.fromEmail.trim(),
      fromName:        formData.fromName.trim(),
    });
  },

  // ── SEND TEST EMAIL ────────────────────────────────────────
  // POST /api/settings/email/test
  // @PostMapping("/api/settings/email/test")
  // public ResponseEntity<TestEmailResponseDTO> sendTestEmail(
  //     @RequestBody TestEmailRequest request)
  //
  // Used in the Test Email modal
  //
  // Backend logic:
  //   1. Reads current SMTP config from tenant_settings
  //   2. Decrypts stored password
  //   3. Builds JavaMailSender with stored config
  //   4. Sends a test email to the provided address
  //   5. Updates tenant_settings.email_last_tested_at = NOW()
  //   6. Returns success or error details
  //
  // Request body:
  // {
  //   recipientEmail: "test@example.com"
  // }
  //
  // Response (200 OK — test succeeded):
  // {
  //   success:   true,
  //   message:   "Test email sent successfully to test@example.com",
  //   testedAt:  "Jun 25, 2026 10:20"
  // }
  //
  // Response (200 OK — test failed — don't throw 500, return structured error):
  // {
  //   success:  false,
  //   message:  "Authentication failed. Check your username and App Password.",
  //   error:    "535 5.7.8 Username and Password not accepted"
  // }
  //
  // Error responses:
  //   400 — { message: "Recipient email address is required" }
  //   422 — { message: "SMTP is not configured. Save configuration first." }
  testEmail: (recipientEmail) => {
    return api.post("/api/settings/email/test", {
      recipientEmail: recipientEmail.trim(),
    });
  },
};

export default emailConfigurationService;


// ═════════════════════════════════════════════════════════════
// HOW TO USE IN EmailConfiguration.jsx
// ═════════════════════════════════════════════════════════════
//
// STEP 1 — Import:
//   import emailConfigurationService
//     from "../services/emailConfigurationService";
//
// ─────────────────────────────────────────────────────────────
// STEP 2 — Load form on mount:
//
//   const [loadingConfig, setLoadingConfig] = useState(true);
//
//   useEffect(() => {
//     setLoadingConfig(true);
//     emailConfigurationService
//       .getConfig()
//       .then((res) => {
//         const d = res.data;
//         setForm({
//           smtpHost:        d.smtpHost      || "",
//           smtpPort:        d.smtpPort      || "587 (TLS)",
//           encryption:      d.encryption    || "TLS",
//           username:        d.username      || "",
//           // Show masked placeholder if password already set
//           password:        d.passwordSet   ? "••••••••" : "",
//           fromEmail:       d.fromEmail     || "",
//           fromName:        d.fromName      || "",
//         });
//         // Track whether the password was pre-filled as masked
//         setPasswordPreFilled(d.passwordSet);
//         // Update the status badge: "Not Configured" vs "Configured"
//         setIsConfigured(d.configured);
//       })
//       .catch(() => {})
//       .finally(() => setLoadingConfig(false));
//   }, []);
//
// ─────────────────────────────────────────────────────────────
// STEP 3 — Replace handleSave:
//
//   const [passwordPreFilled, setPasswordPreFilled] = useState(false);
//   const [isConfigured,      setIsConfigured]      = useState(false);
//
//   const handleSave = async (e) => {
//     e.preventDefault();
//     const v = validate();
//     if (Object.keys(v).length) {
//       setErrs(v);
//       showToast("Fix the errors below.", "error");
//       return;
//     }
//     setSaving(true);
//     try {
//       // If the password field still shows "••••••••" the user didn't change it
//       const passwordChanged = form.password !== "••••••••";
//       const res = await emailConfigurationService.saveConfig({
//         ...form,
//         passwordChanged,
//         password: passwordChanged ? form.password : undefined,
//       });
//       setIsConfigured(true);
//       showToast(res.data.message || "Email configuration saved! ✅");
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
// STEP 4 — Replace test email handler inside TestEmailModal:
//
//   const handleSend = async () => {
//     if (!testEmail.trim() || !/\S+@\S+\.\S+/.test(testEmail)) {
//       setResult("error");
//       setResultMsg("Please enter a valid email address.");
//       return;
//     }
//     setSending(true);
//     setResult(null);
//     try {
//       const res = await emailConfigurationService.testEmail(testEmail);
//       if (res.data.success) {
//         setResult("success");
//         setResultMsg(res.data.message);
//       } else {
//         setResult("error");
//         setResultMsg(res.data.message);
//       }
//     } catch (err) {
//       setResult("error");
//       setResultMsg(
//         err?.response?.data?.message ||
//         "Failed to send test email. Check your SMTP configuration."
//       );
//     } finally {
//       setSending(false);
//     }
//   };
//
// ═════════════════════════════════════════════════════════════
// SPRING BOOT JAVA BACKEND — FULL REFERENCE
// ═════════════════════════════════════════════════════════════
//
// ── EmailConfigController.java ────────────────────────────────
//
//   @RestController
//   @RequestMapping("/api/settings/email")
//   @CrossOrigin(origins = "http://localhost:3000")
//   public class EmailConfigController {
//
//       @Autowired private EmailConfigService service;
//
//       @GetMapping("/config")
//       public ResponseEntity<EmailConfigDTO> getConfig() {
//           return ResponseEntity.ok(service.getConfig());
//       }
//
//       @PostMapping("/config")
//       public ResponseEntity<SaveConfigResponseDTO> saveConfig(
//           @RequestBody @Valid EmailConfigRequest request) {
//           return ResponseEntity.ok(service.saveConfig(request));
//       }
//
//       @PostMapping("/test")
//       public ResponseEntity<TestEmailResponseDTO> sendTestEmail(
//           @RequestBody @Valid TestEmailRequest request) {
//           return ResponseEntity.ok(service.sendTestEmail(request));
//       }
//   }
//
// ── EmailConfigService.java ───────────────────────────────────
//
//   @Service @Transactional
//   public class EmailConfigService {
//
//       @Autowired private TenantSettingsRepository settingsRepo;
//       @Autowired private TenantContext            tenantCtx;
//       @Autowired private AesEncryptUtil           aes;
//
//       public EmailConfigDTO getConfig() {
//           String tenantId   = tenantCtx.getTenantId();
//           TenantSettings ts = settingsRepo.findByTenantId(tenantId)
//               .orElse(new TenantSettings());
//           boolean configured = ts.getSmtpHost() != null
//               && !ts.getSmtpHost().isBlank();
//           DateTimeFormatter fmt = DateTimeFormatter.ofPattern("MMM dd, yyyy");
//           return EmailConfigDTO.builder()
//               .configured(configured)
//               .smtpHost(ts.getSmtpHost())
//               .smtpPort(formatPort(ts.getSmtpPort(), ts.getEncryption()))
//               .portNumber(ts.getSmtpPort() != null ? ts.getSmtpPort() : 587)
//               .encryption(ts.getEncryption() != null ? ts.getEncryption() : "TLS")
//               .username(ts.getSmtpUsername())
//               // NEVER return the decrypted password — only indicate if one is stored
//               .passwordSet(ts.getSmtpPasswordEnc() != null
//                   && !ts.getSmtpPasswordEnc().isBlank())
//               .fromEmail(ts.getEmailFromAddress())
//               .fromName(ts.getEmailFromName())
//               .lastTestedAt(ts.getEmailLastTestedAt() != null
//                   ? ts.getEmailLastTestedAt().format(fmt) : null)
//               .lastSavedAt(ts.getUpdatedAt() != null
//                   ? ts.getUpdatedAt().format(fmt) : null)
//               .build();
//       }
//
//       public SaveConfigResponseDTO saveConfig(EmailConfigRequest req) {
//           String tenantId   = tenantCtx.getTenantId();
//           TenantSettings ts = settingsRepo.findByTenantId(tenantId)
//               .orElse(new TenantSettings(tenantId));
//           ts.setSmtpHost(req.getSmtpHost().trim());
//           ts.setSmtpPort(req.getPortNumber());
//           ts.setEncryption(req.getEncryption());
//           ts.setSmtpUsername(req.getUsername().trim());
//           // Only update the stored password if the user changed it
//           if (req.isPasswordChanged() && req.getPassword() != null
//                   && !req.getPassword().isBlank()) {
//               ts.setSmtpPasswordEnc(aes.encrypt(req.getPassword()));
//           }
//           ts.setEmailFromAddress(req.getFromEmail().trim());
//           ts.setEmailFromName(req.getFromName().trim());
//           settingsRepo.save(ts);
//           String savedAt = LocalDateTime.now()
//               .format(DateTimeFormatter.ofPattern("MMM dd, yyyy HH:mm"));
//           return new SaveConfigResponseDTO(
//               true, "Email configuration saved successfully", savedAt);
//       }
//
//       public TestEmailResponseDTO sendTestEmail(TestEmailRequest req) {
//           String tenantId   = tenantCtx.getTenantId();
//           TenantSettings ts = settingsRepo.findByTenantId(tenantId)
//               .orElseThrow(() -> new ResponseStatusException(
//                   HttpStatus.UNPROCESSABLE_ENTITY,
//                   "SMTP is not configured. Save configuration first."));
//           boolean configured = ts.getSmtpHost() != null
//               && !ts.getSmtpHost().isBlank();
//           if (!configured)
//               throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY,
//                   "SMTP is not configured. Save configuration first.");
//           try {
//               // Build JavaMailSender dynamically from stored settings
//               JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
//               mailSender.setHost(ts.getSmtpHost());
//               mailSender.setPort(ts.getSmtpPort() != null ? ts.getSmtpPort() : 587);
//               mailSender.setUsername(ts.getSmtpUsername());
//               mailSender.setPassword(aes.decrypt(ts.getSmtpPasswordEnc()));
//               Properties props = mailSender.getJavaMailProperties();
//               props.put("mail.transport.protocol", "smtp");
//               props.put("mail.smtp.auth", "true");
//               if ("TLS".equals(ts.getEncryption())) {
//                   props.put("mail.smtp.starttls.enable", "true");
//               } else if ("SSL".equals(ts.getEncryption())) {
//                   props.put("mail.smtp.ssl.enable", "true");
//               }
//               // Send the test message
//               SimpleMailMessage msg = new SimpleMailMessage();
//               msg.setFrom(ts.getEmailFromAddress()
//                   + " <" + ts.getEmailFromAddress() + ">");
//               msg.setTo(req.getRecipientEmail());
//               msg.setSubject("Test Email from " + ts.getEmailFromName());
//               msg.setText("This is a test email from your Travel CRM.\n\n"
//                   + "If you received this message, your SMTP configuration is working correctly.\n\n"
//                   + "— " + ts.getEmailFromName());
//               mailSender.send(msg);
//               // Update last tested timestamp
//               ts.setEmailLastTestedAt(LocalDateTime.now());
//               settingsRepo.save(ts);
//               String testedAt = LocalDateTime.now()
//                   .format(DateTimeFormatter.ofPattern("MMM dd, yyyy HH:mm"));
//               return new TestEmailResponseDTO(
//                   true,
//                   "Test email sent successfully to " + req.getRecipientEmail(),
//                   null,
//                   testedAt
//               );
//           } catch (MailException ex) {
//               // Return structured error — don't throw 500
//               return new TestEmailResponseDTO(
//                   false,
//                   "Authentication failed. Check your username and App Password.",
//                   ex.getMessage(),
//                   null
//               );
//           }
//       }
//
//       private String formatPort(Integer port, String encryption) {
//           if (port == null) return "587 (TLS)";
//           if (port == 465)  return "465 (SSL)";
//           if (port == 587)  return "587 (TLS)";
//           if (port == 25)   return "25 (SMTP)";
//           if (port == 2525) return "2525 (Alt)";
//           return port + (encryption != null ? " (" + encryption + ")" : "");
//       }
//   }
//
// ── DTOs ──────────────────────────────────────────────────────
//
//   // EmailConfigRequest.java
//   public class EmailConfigRequest {
//       @NotBlank(message = "SMTP Host is required")
//       private String  smtpHost;
//       private int     portNumber;         // 587 | 465 | 25 | 2525
//       private String  encryption;         // "TLS" | "SSL" | "None"
//       @NotBlank(message = "Username is required")
//       private String  username;
//       private boolean passwordChanged;    // true = new password in the request
//       private String  password;           // only present when passwordChanged=true
//       @NotBlank(message = "From Email is required")
//       @Email(message = "Invalid email format for From Email")
//       private String  fromEmail;
//       @NotBlank(message = "From Name is required")
//       private String  fromName;
//       // getters + setters
//   }
//
//   // EmailConfigDTO.java
//   @Data @Builder
//   public class EmailConfigDTO {
//       private boolean configured;
//       private String  smtpHost;
//       private String  smtpPort;        // formatted: "587 (TLS)"
//       private int     portNumber;      // raw: 587
//       private String  encryption;
//       private String  username;
//       private boolean passwordSet;     // true = password exists in DB
//       private String  fromEmail;
//       private String  fromName;
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
//   // TestEmailRequest.java
//   public class TestEmailRequest {
//       @NotBlank(message = "Recipient email is required")
//       @Email(message = "Invalid recipient email address")
//       private String recipientEmail;
//       // getters + setters
//   }
//
//   // TestEmailResponseDTO.java
//   @Data @AllArgsConstructor
//   public class TestEmailResponseDTO {
//       private boolean success;
//       private String  message;
//       private String  error;     // SMTP error string, or null on success
//       private String  testedAt;  // "Jun 25, 2026 10:20", or null on failure
//   }
//
// ─────────────────────────────────────────────────────────────
// ── PostgreSQL Schema (tenant_settings — email columns) ───────
//
//   -- These columns should already exist from companySettingsService
//   -- Adding here for completeness:
//   ALTER TABLE tenant_settings
//     ADD COLUMN IF NOT EXISTS smtp_host            VARCHAR(255),
//     ADD COLUMN IF NOT EXISTS smtp_port            INTEGER       DEFAULT 587,
//     ADD COLUMN IF NOT EXISTS encryption           VARCHAR(10)   DEFAULT 'TLS',
//     ADD COLUMN IF NOT EXISTS smtp_username        VARCHAR(255),
//     ADD COLUMN IF NOT EXISTS smtp_password_enc    TEXT,          -- AES-256 encrypted
//     ADD COLUMN IF NOT EXISTS email_from_address   VARCHAR(255),
//     ADD COLUMN IF NOT EXISTS email_from_name      VARCHAR(255),
//     ADD COLUMN IF NOT EXISTS email_last_tested_at TIMESTAMP;
//
//   -- Index for fast per-tenant lookup
//   CREATE INDEX IF NOT EXISTS idx_ts_tenant_id ON tenant_settings (tenant_id);
//
//   -- Constraint on encryption type
//   ALTER TABLE tenant_settings
//     ADD CONSTRAINT IF NOT EXISTS chk_encryption
//     CHECK (encryption IN ('TLS', 'SSL', 'None'));
//
// ── AES encryption util ───────────────────────────────────────
//   @Component
//   public class AesEncryptUtil {
//       @Value("${app.encryption.key}")
//       private String secretKey;  // 32-char key from env, never from code
//
//       public String encrypt(String plainText) { /* AES-256 CBC encrypt */ }
//       public String decrypt(String cipherText) { /* AES-256 CBC decrypt */ }
//   }
//
// ── application.properties ───────────────────────────────────
//   spring.datasource.url=jdbc:postgresql://localhost:5432/travel_crm
//   spring.datasource.username=postgres
//   spring.datasource.password=yourpassword
//   spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
//   spring.jpa.hibernate.ddl-auto=update
//   server.port=8080
//   app.encryption.key=${AES_SECRET_KEY}   # 32-char key, set in env only
//
//   # Optional: Spring Mail default (overridden dynamically per-tenant)
//   spring.mail.properties.mail.smtp.connectiontimeout=5000
//   spring.mail.properties.mail.smtp.timeout=5000
//   spring.mail.properties.mail.smtp.writetimeout=5000
//
// ── .env (React) ──────────────────────────────────────────────
//   REACT_APP_API_URL=http://localhost:8080
// ─────────────────────────────────────────────────────────────