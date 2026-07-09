import ConsoleAPI, { unwrap } from "./consoleHttp";

/** Read-only platform audit ledger. */
export const auditService = {
  list: async ({ action = "", success = "", from = "", to = "", q = "", page = 0, size = 20 } = {}) => {
    const params = { page, size };
    if (action) params.action = action;
    if (success !== "") params.success = success;
    if (from) params.from = from;
    if (to) params.to = to;
    if (q) params.q = q;
    const res = await ConsoleAPI.get("/super-admin/audit-logs", { params });
    const body = res?.data ?? {};
    return { rows: body.data ?? [], pagination: body.pagination ?? {} };
  },
  actions: () => ConsoleAPI.get("/super-admin/audit-logs/actions").then(unwrap),
};