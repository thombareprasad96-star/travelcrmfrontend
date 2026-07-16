import ConsoleAPI, { unwrap } from "./consoleHttp";

/**
 * Platform-wide Travel Partner (sub-agent) seat pricing — the SAME amount across every tenant.
 *
 * - `recurringSeatFee` is billed monthly per ACTIVE seat and folds into each tenant's plan invoice
 *   (plan price + activePartners × fee).
 * - `oneTimeLicenseFee` is the one-time unlock charged when a partner is purchased over cap; null/blank
 *   falls back to the recurring rate.
 *
 * GET → { recurringSeatFee, oneTimeLicenseFee, effectiveLicenseFee, licenseFeeUsingRecurringFallback, currency }
 * PUT { recurringSeatFee, oneTimeLicenseFee } (oneTimeLicenseFee null = clear → use recurring).
 */
export const subAgentPricingService = {
  get: () => ConsoleAPI.get("/super-admin/subagent-pricing").then(unwrap),
  set: (payload) => ConsoleAPI.put("/super-admin/subagent-pricing", payload).then(unwrap),
};

export default subAgentPricingService;