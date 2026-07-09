import ConsoleAPI, { unwrap } from "./consoleHttp";

/** Global platform config + maintenance mode. */
export const configService = {
  listConfig: () => ConsoleAPI.get("/super-admin/config").then(unwrap),
  setConfig: (key, value, description) =>
    ConsoleAPI.put(`/super-admin/config/${encodeURIComponent(key)}`, { value, description }).then(unwrap),
  getMaintenance: () => ConsoleAPI.get("/super-admin/maintenance").then(unwrap),
  setMaintenance: (enabled, message) =>
    ConsoleAPI.put("/super-admin/maintenance", { enabled, message }).then(unwrap),
};