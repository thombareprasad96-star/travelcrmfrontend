import ConsoleAPI, { unwrap } from "./consoleHttp";

/**
 * Platform plan-upgrade request review API. `list` takes an optional status filter (PENDING/APPROVED/
 * REJECTED/CANCELLED; blank = all). Approve/reject are keyed by request `publicId` (UUID); approving
 * activates the tenant's plan, rejecting keeps them put.
 */
export const upgradeRequestService = {
  list: (status) =>
    ConsoleAPI.get("/super-admin/upgrade-requests", { params: status ? { status } : {} }).then(unwrap),

  pendingCount: () =>
    ConsoleAPI.get("/super-admin/upgrade-requests/pending-count").then(unwrap),

  approve: (publicId) =>
    ConsoleAPI.post(`/super-admin/upgrade-requests/${publicId}/approve`).then(unwrap),

  reject: (publicId, reason) =>
    ConsoleAPI.post(`/super-admin/upgrade-requests/${publicId}/reject`, { reason }).then(unwrap),
};

export default upgradeRequestService;
