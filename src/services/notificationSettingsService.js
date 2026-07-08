// src/services/notificationSettingsService.js
// ─────────────────────────────────────────────────────────────
// Notification Settings Page — API Service
// Backend: Java Spring Boot REST API
// ─────────────────────────────────────────────────────────────

import API from "@shared/api/http";


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
    return API.get("/notification-settings");
  },

  // ── GET SINGLE STAGE SETTING ───────────────────────────────
  // GET /api/notification-settings/{key}
  // @GetMapping("/api/notification-settings/{key}")
  // public ResponseEntity<NotificationSettingDTO> getByKey(@PathVariable String key)
  //
  // key examples: new_lead, contacted, prospect, quotation_sent,
  //               in_negotiation, payment_awaited, ready_to_book, lost
  getByKey: (key) => {
    return API.get(`/notification-settings/${key}`);
  },

  // ── UPDATE SINGLE STAGE SETTING ────────────────────────────
  // PUT /api/notification-settings/{key}
  // @PutMapping("/api/notification-settings/{key}")
  // public ResponseEntity<NotificationSettingDTO> update(
  //     @PathVariable String key, @RequestBody NotificationSettingDTO dto)
  update: (key, data) => {
    return API.put(`/notification-settings/${key}`, data);
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
    return API.put("/notification-settings", settingsArray);
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
    return API.patch(`/notification-settings/${key}/toggle`, { enabled });
  },

  // ── RESET ALL TO DEFAULTS ──────────────────────────────────
  // POST /api/notification-settings/reset
  // @PostMapping("/api/notification-settings/reset")
  // public ResponseEntity<List<NotificationSettingDTO>> resetToDefaults()
  //
  // Used by the "Reset" button — restores factory default values
  // for all 8 stages on the server side.
  resetToDefaults: () => {
    return API.post("/notification-settings/reset");
  },
};

export default notificationSettingsService;
// ─────────────────────────────────────────────────────────────