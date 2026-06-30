// src/services/trashService.js
// ─────────────────────────────────────────────────────────────
// Trash (Recycle Bin) Service Layer — Travel CRM
// Backed by the universal Trash API (/api/trash). Records are addressed
// by entityType KEY (LEAD / CUSTOMER / …) + publicId (UUID) — never the
// internal Long id. Uses the shared axiosInstance (JWT + 401 interceptor).
//
// Backend surface (confirmed):
//   GET    /api/trash                              → ApiResponse<TrashGroupDto[]>
//   POST   /api/trash/{type}/{publicId}/restore    → ApiResponse<Void>
//   DELETE /api/trash/{type}/{publicId}            → ApiResponse<Void>
//
// There is NO pagination / server-side filter / bulk endpoint — the page
// fetches once and filters + paginates client-side.
// ─────────────────────────────────────────────────────────────

import API from "./axiosInstance";

/* res.data?.data ?? res.data — the envelope unwrap used across the app. */
const unwrap = (res) => res?.data?.data ?? res?.data;

const trashService = {
  /**
   * All trashed records for the current tenant, grouped by module.
   * @returns {Promise<Array<{ entityType, module, count, items: Array }>>}
   *   items[]: { entityType, module, publicId, label, deletedAt, deletedBy, purgeAt, daysUntilPurge }
   */
  getTrash: async () => {
    const res = await API.get("/trash");
    return unwrap(res) ?? [];
  },

  /**
   * Restore a single trashed record back to its module.
   * @param {string} entityType  registry key (LEAD, CUSTOMER, BOOKING, …)
   * @param {string} publicId    record UUID (never the internal Long id)
   */
  restoreItem: async (entityType, publicId) => {
    const res = await API.post(`/trash/${entityType}/${publicId}/restore`);
    return unwrap(res);
  },

  /**
   * Permanently (hard) delete a single trashed record now. Irreversible.
   * Gated server-side by TRASH_DELETE (tenant-admin only by default).
   * @param {string} entityType  registry key
   * @param {string} publicId    record UUID
   */
  permanentlyDeleteItem: async (entityType, publicId) => {
    const res = await API.delete(`/trash/${entityType}/${publicId}`);
    return unwrap(res);
  },
};

export default trashService;