// src/features/marketing/api/marketingService.js
// ─────────────────────────────────────────────────────────────────────────────
// API client for the Marketing & Campaigns module. One object literal, every
// method returns an axios response; callers unwrap the ApiResponse envelope
// (res.data.data) and PagedApiResponse (res.data.data list + res.data.pagination).
// Paths are under /marketing/**, per the LOCKED contract (docs/MARKETING_MODULE_CONTRACT.md).
// ─────────────────────────────────────────────────────────────────────────────
import API from "@shared/api/http";

const marketingService = {
  // ── Segments ────────────────────────────────────────────────────────────────
  getSegmentFields:  () => API.get("/marketing/segments/fields"),
  listSegments:      (params) => API.get("/marketing/segments", { params }),
  getSegment:        (id) => API.get(`/marketing/segments/${id}`),
  createSegment:     (data) => API.post("/marketing/segments", data),
  updateSegment:     (id, data) => API.put(`/marketing/segments/${id}`, data),
  deleteSegment:     (id) => API.delete(`/marketing/segments/${id}`),
  previewSegment:    (data) => API.post("/marketing/segments/preview", data),
  getSegmentMembers: (id, params) => API.get(`/marketing/segments/${id}/members`, { params }),

  // ── Campaigns ───────────────────────────────────────────────────────────────
  listCampaigns:        (params) => API.get("/marketing/campaigns", { params }),
  getCampaignSummary:   () => API.get("/marketing/campaigns/summary"),
  getCampaign:          (id) => API.get(`/marketing/campaigns/${id}`),
  createCampaign:       (data) => API.post("/marketing/campaigns", data),
  updateCampaign:       (id, data) => API.put(`/marketing/campaigns/${id}`, data),
  deleteCampaign:       (id) => API.delete(`/marketing/campaigns/${id}`),
  sendCampaign:         (id) => API.post(`/marketing/campaigns/${id}/send`),
  cancelCampaign:       (id) => API.post(`/marketing/campaigns/${id}/cancel`),
  testCampaign:         (id, to) => API.post(`/marketing/campaigns/${id}/test`, { to }),
  getCampaignRecipients:(id, params) => API.get(`/marketing/campaigns/${id}/recipients`, { params }),

  // ── Drips ───────────────────────────────────────────────────────────────────
  listDrips:          (params) => API.get("/marketing/drips", { params }),
  getDrip:            (id) => API.get(`/marketing/drips/${id}`),
  createDrip:         (data) => API.post("/marketing/drips", data),
  updateDrip:         (id, data) => API.put(`/marketing/drips/${id}`, data),
  deleteDrip:         (id) => API.delete(`/marketing/drips/${id}`),
  activateDrip:       (id) => API.post(`/marketing/drips/${id}/activate`),
  pauseDrip:          (id) => API.post(`/marketing/drips/${id}/pause`),
  getDripEnrollments: (id, params) => API.get(`/marketing/drips/${id}/enrollments`, { params }),

  // ── Automations ─────────────────────────────────────────────────────────────
  listAutomations:        () => API.get("/marketing/automations"),
  getAutomation:          (type) => API.get(`/marketing/automations/${type}`),
  updateAutomation:       (type, data) => API.put(`/marketing/automations/${type}`, data),
  testAutomation:         (type, to) => API.post(`/marketing/automations/${type}/test`, { to }),
  getUpcomingCelebrations:(params) => API.get("/marketing/automations/upcoming", { params }),

  // ── Shared ──────────────────────────────────────────────────────────────────
  getMergeTags: () => API.get("/marketing/merge-tags"),
};

export default marketingService;