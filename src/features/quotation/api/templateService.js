// src/features/quotation/api/templateService.js
//
// API client for Quotation (Package) Templates. Every method returns the unwrapped payload —
// callers never see the ApiResponse / PagedApiResponse envelope.
//
// Backend: /api/quotation-templates (rides the QUOTATIONS module + QUOTATION_* permissions).

import API from "@shared/api/http";

const unwrap = (res) => res.data?.data ?? res.data;

export const templateService = {
  /** Paged list. Returns { items, pagination }. */
  async list({ keyword = "", active = null, page = 0, size = 20, sortBy = "createdAt", sortDir = "desc" } = {}) {
    const params = { page, size, sortBy, sortDir };
    if (keyword) params.keyword = keyword;
    if (active !== null && active !== undefined) params.active = active;
    const res = await API.get("/quotation-templates", { params });
    return { items: res.data?.data ?? [], pagination: res.data?.pagination ?? null };
  },

  async get(publicId) {
    return unwrap(await API.get(`/quotation-templates/${publicId}`));
  },

  async create(payload) {
    return unwrap(await API.post("/quotation-templates", payload));
  },

  async update(publicId, payload) {
    return unwrap(await API.put(`/quotation-templates/${publicId}`, payload));
  },

  async remove(publicId) {
    return unwrap(await API.delete(`/quotation-templates/${publicId}`));
  },

  /**
   * Rank the tenant's active templates against a lead.
   * @param body {leadId, hotelTier?, durationNights?, budget?, travelMonth?, limit?}
   * @returns TemplateMatchResponse[] — highest match first
   */
  async match(body) {
    return unwrap(await API.post("/quotation-templates/match", body)) ?? [];
  },

  /**
   * Clone a template into a new DRAFT quotation for a lead.
   * @returns the created QuotationResponseDto (carries publicId)
   */
  async apply(templatePublicId, body) {
    return unwrap(await API.post(`/quotation-templates/${templatePublicId}/apply`, body));
  },
};

export default templateService;