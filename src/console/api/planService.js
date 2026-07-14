import ConsoleAPI, { unwrap } from "./consoleHttp";

/** Platform plan catalogue + subscription ops. */
export const planService = {
  list: () => ConsoleAPI.get("/super-admin/plans").then(unwrap),
  update: (publicId, payload) =>
    ConsoleAPI.put(`/super-admin/plans/${publicId}`, payload).then(unwrap),
  runExpiry: () => ConsoleAPI.post("/super-admin/subscriptions/run-expiry").then(unwrap),
  // Invoice-dunning sweep: ACTIVE→PAST_DUE (overdue) and PAST_DUE→EXPIRED (past grace).
  runDunning: () => ConsoleAPI.post("/super-admin/subscriptions/run-dunning").then(unwrap),
};

/** Canonical module keys a plan can unlock (display/edit only this phase; enforced in Feature Flags). */
export const ALL_MODULES = [
  "LEADS", "BOOKINGS", "QUOTATIONS", "CUSTOMERS", "MASTERS",
  "VENDORS", "REPORTS", "FLEET", "WHATSAPP", "DISHA_AI", "PORTAL",
];