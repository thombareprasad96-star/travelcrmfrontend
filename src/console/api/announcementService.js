import ConsoleAPI, { unwrap } from "./consoleHttp";

/** Platform announcements (broadcast → tenants). */
export const announcementService = {
  send: (payload) => ConsoleAPI.post("/super-admin/announcements", payload).then(unwrap),
  history: async ({ page = 0, size = 20 } = {}) => {
    const res = await ConsoleAPI.get("/super-admin/announcements", { params: { page, size } });
    const body = res?.data ?? {};
    return { rows: body.data ?? [], pagination: body.pagination ?? {} };
  },
};