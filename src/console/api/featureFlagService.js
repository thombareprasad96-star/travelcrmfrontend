import ConsoleAPI, { unwrap } from "./consoleHttp";

/** Per-tenant module entitlements (Feature Flags). */
export const featureFlagService = {
  getModules: (publicId) =>
    ConsoleAPI.get(`/super-admin/tenants/${publicId}/modules`).then(unwrap),
  updateModules: (publicId, modules) =>
    ConsoleAPI.put(`/super-admin/tenants/${publicId}/modules`, { modules }).then(unwrap),
};