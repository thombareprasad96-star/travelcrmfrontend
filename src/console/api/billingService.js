import ConsoleAPI, { unwrap } from "./consoleHttp";

/** Platform billing (SuperAdmin → tenant invoices). */
export const billingService = {
  listForTenant: (tenantPublicId) =>
    ConsoleAPI.get(`/super-admin/tenants/${tenantPublicId}/billing`).then(unwrap),
  create: (tenantPublicId, payload) =>
    ConsoleAPI.post(`/super-admin/tenants/${tenantPublicId}/billing`, payload).then(unwrap),
  markPaid: (publicId) =>
    ConsoleAPI.post(`/super-admin/billing/${publicId}/mark-paid`).then(unwrap),
  markUnpaid: (publicId) =>
    ConsoleAPI.post(`/super-admin/billing/${publicId}/mark-unpaid`).then(unwrap),
};