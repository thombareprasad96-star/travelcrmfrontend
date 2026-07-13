import ConsoleAPI, { unwrap } from "./consoleHttp";

/**
 * Platform tenant usage-metering & quota API. `dashboard` returns `{ overview, tenants }`;
 * all quota operations are keyed by tenant `publicId` (UUID).
 */
export const usageService = {
  dashboard: () => ConsoleAPI.get("/super-admin/usage").then(unwrap),
  get: (publicId) => ConsoleAPI.get(`/super-admin/usage/${publicId}`).then(unwrap),
  overrideQuota: (publicId, payload) =>
    ConsoleAPI.put(`/super-admin/usage/${publicId}/quota`, payload).then(unwrap),
};
