import ConsoleAPI, { unwrap } from "./consoleHttp";

/** Read-only platform analytics for the console dashboard. */
export const analyticsService = {
  overview: () => ConsoleAPI.get("/super-admin/analytics/overview").then(unwrap),
};