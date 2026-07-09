import ConsoleAPI, { unwrap } from "./consoleHttp";

/**
 * Cross-tenant user control (SuperAdmin). `list` returns the paged envelope split into
 * `{ rows, pagination }`; the mutations return the unwrapped updated user.
 */
export const userService = {
  list: async ({ search = "", tenantId = "", page = 0, size = 20 } = {}) => {
    const params = { page, size };
    if (search) params.search = search;
    if (tenantId) params.tenantId = tenantId;
    const res = await ConsoleAPI.get("/super-admin/users", { params });
    const body = res?.data ?? {};
    return { rows: body.data ?? [], pagination: body.pagination ?? {} };
  },

  lock: (publicId) => ConsoleAPI.post(`/super-admin/users/${publicId}/lock`).then(unwrap),
  unlock: (publicId) => ConsoleAPI.post(`/super-admin/users/${publicId}/unlock`).then(unwrap),
  resetPassword: (publicId, newPassword) =>
    ConsoleAPI.post(`/super-admin/users/${publicId}/reset-password`, { newPassword }).then(unwrap),

  impersonate: (publicId) =>
    ConsoleAPI.post(`/super-admin/users/${publicId}/impersonate`).then(unwrap),
};