// src/services/notificationSettingsService.js
// ─────────────────────────────────────────────────────────────
// Notification Settings Page — API Service
// Backend: Java Spring Boot REST API
// ─────────────────────────────────────────────────────────────

import axios from "axios";

// ── BASE URL ──────────────────────────────────────────────────
// Add this to your .env file in React project root:
// REACT_APP_API_URL=http://localhost:8080
const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080";

// ── AXIOS INSTANCE ────────────────────────────────────────────
const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
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
// NOTIFICATION SETTINGS SERVICE
// Spring Boot Controller: /api/notification-settings
// ═════════════════════════════════════════════════════════════
const notificationSettingsService = {

  // ── GET ALL STAGE SETTINGS ─────────────────────────────────
  // GET /api/notification-settings
  // @GetMapping("/api/notification-settings")
  // public ResponseEntity<List<NotificationSettingDTO>> getAll()
  //
  // Returns one row per lead stage (8 rows): New Lead, Contacted,
  // Prospect, Quotation Sent, In Negotiation, Payment Awaited,
  // Ready to Book, Lost.
  //
  // Response example:
  // [
  //   {
  //     "key": "new_lead",
  //     "stageLabel": "New Lead",
  //     "helperText": "When a lead is marked as New Lead",
  //     "enabled": true,
  //     "reminderType": "First_contact",
  //     "hours": 8,
  //     "priority": "High",
  //     "titleTemplate": "Contact New Lead: {lead_name}",
  //     "descTemplate": "New lead requires initial contact"
  //   },
  //   ...
  // ]
  getAll: () => {
    return api.get("/api/notification-settings");
  },

  // ── GET SINGLE STAGE SETTING ───────────────────────────────
  // GET /api/notification-settings/{key}
  // @GetMapping("/api/notification-settings/{key}")
  // public ResponseEntity<NotificationSettingDTO> getByKey(@PathVariable String key)
  //
  // key examples: new_lead, contacted, prospect, quotation_sent,
  //               in_negotiation, payment_awaited, ready_to_book, lost
  getByKey: (key) => {
    return api.get(`/api/notification-settings/${key}`);
  },

  // ── UPDATE SINGLE STAGE SETTING ────────────────────────────
  // PUT /api/notification-settings/{key}
  // @PutMapping("/api/notification-settings/{key}")
  // public ResponseEntity<NotificationSettingDTO> update(
  //     @PathVariable String key, @RequestBody NotificationSettingDTO dto)
  update: (key, data) => {
    return api.put(`/api/notification-settings/${key}`, data);
  },

  // ── UPDATE ALL STAGE SETTINGS (bulk save) ──────────────────
  // PUT /api/notification-settings
  // @PutMapping("/api/notification-settings")
  // public ResponseEntity<List<NotificationSettingDTO>> updateAll(
  //     @RequestBody List<NotificationSettingDTO> settings)
  //
  // Used by the "Save Settings" button — saves all 8 cards in one call.
  // Request body: array of all stage objects (same shape as getAll() response)
  updateAll: (settingsArray) => {
    return api.put("/api/notification-settings", settingsArray);
  },

  // ── TOGGLE ENABLE/DISABLE FOR ONE STAGE ────────────────────
  // PATCH /api/notification-settings/{key}/toggle
  // @PatchMapping("/api/notification-settings/{key}/toggle")
  // public ResponseEntity<NotificationSettingDTO> toggle(
  //     @PathVariable String key, @RequestBody Map<String, Boolean> body)
  //
  // Body: { enabled: true }
  // Useful if you want instant save on toggle flip instead of
  // waiting for the global "Save Settings" button.
  toggle: (key, enabled) => {
    return api.patch(`/api/notification-settings/${key}/toggle`, { enabled });
  },

  // ── RESET ALL TO DEFAULTS ──────────────────────────────────
  // POST /api/notification-settings/reset
  // @PostMapping("/api/notification-settings/reset")
  // public ResponseEntity<List<NotificationSettingDTO>> resetToDefaults()
  //
  // Used by the "Reset" button — restores factory default values
  // for all 8 stages on the server side.
  resetToDefaults: () => {
    return api.post("/api/notification-settings/reset");
  },
};

export default notificationSettingsService;


// ═════════════════════════════════════════════════════════════
// HOW TO USE IN NotificationSettings.jsx
// ═════════════════════════════════════════════════════════════
//
// 1. IMPORT AT TOP OF NotificationSettings.jsx:
//    import notificationSettingsService from "../services/notificationSettingsService";
//
// ─────────────────────────────────────────────────────────────
// 2. REPLACE mock useEffect WITH REAL API CALL:
//
//    useEffect(() => {
//      setLoading(true);
//      notificationSettingsService
//        .getAll()
//        .then((res) => setStages(res.data))
//        .catch(() => showToast("Failed to load settings.", "error"))
//        .finally(() => setLoading(false));
//    }, []);
//
// ─────────────────────────────────────────────────────────────
// 3. REPLACE handleSave:
//
//    const handleSave = async () => {
//      setSaving(true);
//      try {
//        const res = await notificationSettingsService.updateAll(stages);
//        setStages(res.data);
//        showToast("Notification settings saved successfully! ✅");
//      } catch (err) {
//        showToast(
//          err?.response?.data?.message || "Failed to save settings.",
//          "error"
//        );
//      } finally {
//        setSaving(false);
//      }
//    };
//
// ─────────────────────────────────────────────────────────────
// 4. REPLACE handleReset:
//
//    const handleReset = async () => {
//      try {
//        const res = await notificationSettingsService.resetToDefaults();
//        setStages(res.data);
//        showToast("Settings reset to defaults.");
//      } catch {
//        showToast("Failed to reset settings.", "error");
//      }
//    };
//
// ─────────────────────────────────────────────────────────────
// 5. OPTIONAL — instant-save toggle (saves immediately on flip,
//    instead of waiting for "Save Settings" button):
//
//    const handleUpdateStage = useCallback((key, updatedStage) => {
//      setStages((prev) => prev.map((s) => (s.key === key ? updatedStage : s)));
//    }, []);
//
//    // Pass a separate handler just for the toggle switch:
//    const handleToggleStage = async (key, enabled) => {
//      setStages((prev) =>
//        prev.map((s) => (s.key === key ? { ...s, enabled } : s))
//      );
//      try {
//        await notificationSettingsService.toggle(key, enabled);
//      } catch {
//        showToast("Failed to update toggle.", "error");
//      }
//    };
//
//    // Then in StageCard's ToggleSwitch onChange:
//    // onChange={(v) => { update("enabled", v); onToggleSave(stage.key, v); }}
//
// ═════════════════════════════════════════════════════════════
// SPRING BOOT JAVA BACKEND — QUICK REFERENCE
// ═════════════════════════════════════════════════════════════
//
// ── NotificationSetting.java (Entity) ────────────────────────
//
//   @Entity
//   @Table(name = "notification_settings")
//   public class NotificationSetting {
//       @Id
//       @Column(name = "stage_key")
//       private String key;             // new_lead, contacted, prospect, ...
//
//       @Column(name = "stage_label")
//       private String stageLabel;      // "New Lead", "Contacted", ...
//
//       @Column(name = "helper_text")
//       private String helperText;
//
//       private boolean enabled = true;
//
//       @Enumerated(EnumType.STRING)
//       @Column(name = "reminder_type")
//       private ReminderType reminderType;   // First_contact, Payment_reminder, etc.
//
//       private Double hours;
//
//       @Enumerated(EnumType.STRING)
//       private Priority priority;            // High, Medium, Low
//
//       @Column(name = "title_template", length = 500)
//       private String titleTemplate;
//
//       @Column(name = "desc_template", length = 1000)
//       private String descTemplate;
//
//       @Column(name = "updated_at")
//       private LocalDateTime updatedAt;
//
//       @PreUpdate
//       protected void onUpdate() { updatedAt = LocalDateTime.now(); }
//   }
//
// ─────────────────────────────────────────────────────────────
// ── NotificationSettingController.java ───────────────────────
//
//   @RestController
//   @RequestMapping("/api/notification-settings")
//   @CrossOrigin(origins = "http://localhost:3000")
//   public class NotificationSettingController {
//
//       @Autowired private NotificationSettingService service;
//
//       @GetMapping
//       public ResponseEntity<List<NotificationSettingDTO>> getAll() {
//           return ResponseEntity.ok(service.getAll());
//       }
//
//       @GetMapping("/{key}")
//       public ResponseEntity<NotificationSettingDTO> getByKey(@PathVariable String key) {
//           return ResponseEntity.ok(service.getByKey(key));
//       }
//
//       @PutMapping("/{key}")
//       public ResponseEntity<NotificationSettingDTO> update(
//           @PathVariable String key, @RequestBody NotificationSettingDTO dto) {
//           return ResponseEntity.ok(service.update(key, dto));
//       }
//
//       @PutMapping
//       public ResponseEntity<List<NotificationSettingDTO>> updateAll(
//           @RequestBody List<NotificationSettingDTO> settings) {
//           return ResponseEntity.ok(service.updateAll(settings));
//       }
//
//       @PatchMapping("/{key}/toggle")
//       public ResponseEntity<NotificationSettingDTO> toggle(
//           @PathVariable String key, @RequestBody Map<String, Boolean> body) {
//           return ResponseEntity.ok(service.setEnabled(key, body.get("enabled")));
//       }
//
//       @PostMapping("/reset")
//       public ResponseEntity<List<NotificationSettingDTO>> resetToDefaults() {
//           return ResponseEntity.ok(service.resetToDefaults());
//       }
//   }
//
// ─────────────────────────────────────────────────────────────
// ── NotificationSettingDTO.java ──────────────────────────────
//
//   public class NotificationSettingDTO {
//       private String key;
//       private String stageLabel;
//       private String helperText;
//       private boolean enabled;
//       private String reminderType;   // First_contact, Follow_up, Quotation,
//                                       // Payment_reminder, Document, Confirmation, Custom
//       private Double hours;
//       private String priority;        // High, Medium, Low
//       private String titleTemplate;
//       private String descTemplate;
//       // getters + setters or @Data (Lombok)
//   }
//
// ─────────────────────────────────────────────────────────────
// ── Example: how ReminderService consumes these settings ──────
//
//   // Inside LeadService.java, whenever a lead's stage changes:
//   public void onStageChange(Lead lead, String newStage) {
//       NotificationSetting setting = notificationSettingRepo.findByKey(newStage);
//       if (setting == null || !setting.isEnabled()) return;
//
//       String title = setting.getTitleTemplate().replace("{lead_name}", lead.getName());
//       String desc  = setting.getDescTemplate().replace("{lead_name}", lead.getName());
//
//       Reminder reminder = new Reminder();
//       reminder.setTitle(title);
//       reminder.setDescription(desc);
//       reminder.setType(setting.getReminderType());
//       reminder.setPriority(setting.getPriority());
//       reminder.setLeadId(lead.getId());
//       reminder.setLeadName(lead.getName());
//       reminder.setPhone(lead.getPhone());
//       reminder.setAssignTo(lead.getAssignedUserId());
//       reminder.setDueDate(LocalDateTime.now().plusHours(setting.getHours().longValue()));
//       reminder.setStatus("Active");
//
//       reminderRepository.save(reminder);
//
//       // Optionally also create a Notification row (see notificationService.js)
//       notificationService.create(NotificationDTO.builder()
//           .category("Reminder_alert")
//           .title("New Reminder: " + title)
//           .message(desc)
//           .link("/Reminders")
//           .userId(lead.getAssignedUserId())
//           .build());
//   }
//
// ─────────────────────────────────────────────────────────────
// ── application.properties ───────────────────────────────────
//
//   spring.datasource.url=jdbc:mysql://localhost:3306/travel_crm
//   spring.datasource.username=root
//   spring.datasource.password=yourpassword
//   spring.jpa.hibernate.ddl-auto=update
//   spring.jpa.show-sql=true
//   server.port=8080
//
// ── .env (React — project root) ──────────────────────────────
//
//   REACT_APP_API_URL=http://localhost:8080
//
// ─────────────────────────────────────────────────────────────
// ── MySQL Table ───────────────────────────────────────────────
//
//   CREATE TABLE notification_settings (
//     stage_key      VARCHAR(50) PRIMARY KEY,   -- new_lead, contacted, ...
//     stage_label    VARCHAR(100) NOT NULL,
//     helper_text    VARCHAR(255),
//     enabled        BOOLEAN DEFAULT TRUE,
//     reminder_type  ENUM('First_contact','Follow_up','Quotation',
//                        'Payment_reminder','Document','Confirmation','Custom')
//                    NOT NULL DEFAULT 'First_contact',
//     hours          DECIMAL(6,2) NOT NULL DEFAULT 24,
//     priority       ENUM('High','Medium','Low') DEFAULT 'Medium',
//     title_template VARCHAR(500),
//     desc_template  VARCHAR(1000),
//     updated_at     DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
//   );
//
//   -- Seed data (8 default rows matching the reference screenshots)
//   INSERT INTO notification_settings
//     (stage_key, stage_label, helper_text, enabled, reminder_type, hours, priority, title_template, desc_template)
//   VALUES
//     ('new_lead',        'New Lead',        'When a lead is marked as New Lead',                    TRUE,  'First_contact',    8,   'High',   'Contact New Lead: {lead_name}',   'New lead requires initial contact'),
//     ('contacted',       'Contacted',       'When a lead is marked as Contacted',                   TRUE,  'First_contact',    24,  'Medium', 'Follow-up Contact: {lead_name}',  'Follow-up required after initial contact'),
//     ('prospect',        'Prospect',        'When a lead is marked as Prospect',                    TRUE,  'First_contact',    24,  'Medium', 'Follow-up Prospect: {lead_name}', 'Prospect needs attention and follow-up'),
//     ('quotation_sent',  'Quotation Sent',  'When a quotation is sent to lead',                     TRUE,  'First_contact',    48,  'Medium', 'Follow-up Quotation: {lead_name}','Quotation sent - follow-up required'),
//     ('in_negotiation',  'In Negotiation',  'When lead enters negotiation stage',                   TRUE,  'First_contact',    24,  'Medium', 'Negotiation Follow-up: {lead_name}', 'Lead in negotiation - check progress'),
//     ('payment_awaited', 'Payment Awaited', 'When payment is pending from customer',                TRUE,  'Payment_reminder', 12,  'High',   'Payment Follow-up: {lead_name}',  'Payment pending - follow-up required'),
//     ('ready_to_book',   'Ready to Book',   'When lead is ready to book',                           TRUE,  'First_contact',    24,  'Medium', 'Booking Follow-up: {lead_name}',  'Lead ready to book - close the deal'),
//     ('lost',            'Lost',            'When a lead is marked as lost (for revival attempts)', FALSE, 'First_contact',    168, 'Low',    'Revival Attempt: {lead_name}',    'Attempt to revive lost lead');
// ─────────────────────────────────────────────────────────────