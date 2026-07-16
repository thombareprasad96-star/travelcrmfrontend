// src/features/subagents/api/subAgentService.js
// ─────────────────────────────────────────────────────────────
// Sub-Agent (B2B franchise) service — tenant-facing staff app.
//
// Uses the shared axios client (@shared/api/http): baseURL ".../api",
// JWT from localStorage "token", centralized 401/403/5xx handling.
//
// Thin passthrough — every method returns the raw axios promise. Unwrap the
// backend envelope at the CALL SITE:  res.data?.data ?? res.data
// Errors are handled in the pages (getErrorMessage / isAlreadyReported).
//
// The whole /api/subagents API is gated on USER_* (TENANT_ADMIN only).
// IDs in paths are the SubAgentProfile.publicId (UUID) — never a Long id.
// ─────────────────────────────────────────────────────────────

import API from "@shared/api/http";

const subAgentService = {
  // ── CRUD ──────────────────────────────────────────────────
  // GET  /api/subagents                 → ApiResponse<SubAgentResponse[]>
  getAll: () => API.get("/subagents"),

  // GET  /api/subagents/{publicId}      → ApiResponse<SubAgentResponse>
  getById: (publicId) => API.get(`/subagents/${publicId}`),

  // POST /api/subagents                 → ApiResponse<SubAgentResponse> (201)
  // Body: { name, email, password, phoneNumber, markupType, markupValue, brand* }
  create: (data) => API.post("/subagents", data),

  // PUT  /api/subagents/{publicId}      → ApiResponse<SubAgentResponse>
  // Partial: only non-null fields change (name/phone/markup*/status/active/brand*).
  update: (publicId, data) => API.put(`/subagents/${publicId}`, data),

  // DELETE /api/subagents/{publicId}    → ApiResponse<void>
  remove: (publicId) => API.delete(`/subagents/${publicId}`),

  // ── Parent roll-up + commission ────────────────────────────
  // GET  /api/subagents/rollup          → ApiResponse<SubAgentRollupRow[]>
  getRollup: () => API.get("/subagents/rollup"),

  // GET  /api/subagents/{publicId}/commissions → ApiResponse<SubAgentCommissionLedgerDto>
  getCommissions: (publicId) => API.get(`/subagents/${publicId}/commissions`),

  // ── Seat-license purchases (Travel Partner over-cap) ───────
  // When create() returns { licenseRequired:true, licenseRequest }, the partner is PENDING_LICENSE and a
  // one-time seat license must be paid + SuperAdmin-approved before they activate. Same pay flow as plan
  // upgrades: pay the linked invoice online (Razorpay) or supply an offline reference verified at approval.

  // GET  /api/subagents/license-requests → ApiResponse<SubAgentLicenseRequestResponse[]>
  getLicenseRequests: () => API.get("/subagents/license-requests"),

  // POST /api/subagents/license-requests → open/resubmit a purchase for an existing PENDING_LICENSE partner.
  // Body: { subAgentPublicId, paymentMode:'ONLINE'|'OFFLINE', offlineMode?, offlineReference?, offlineNotes? }
  openLicense: (body) => API.post("/subagents/license-requests", body),

  // POST /api/subagents/license-requests/{publicId}/cancel  (removes the pending partner)
  cancelLicense: (publicId) => API.post(`/subagents/license-requests/${publicId}/cancel`),

  // POST /api/subagents/license-requests/{publicId}/proof  (offline) — multipart
  uploadLicenseProof: (publicId, file) => {
    const fd = new FormData();
    fd.append("file", file);
    return API.post(`/subagents/license-requests/${publicId}/proof`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // POST /api/company/billing/{invoicePublicId}/pay-intent → PaymentOrderResponse (Razorpay order).
  // The tenant admin holds SETTINGS_MANAGE, so this shared self-serve billing endpoint is reachable here.
  createPayIntent: (invoicePublicId) => API.post(`/company/billing/${invoicePublicId}/pay-intent`),
};

export default subAgentService;
