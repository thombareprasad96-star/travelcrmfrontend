import ConsoleAPI, { unwrap } from "./consoleHttp";

/**
 * Platform sub-agent (Travel Partner) seat-license request review API — the seat add-on sibling of
 * {@link upgradeRequestService}. `list` takes an optional status filter (PENDING/APPROVED/REJECTED/
 * CANCELLED; blank = all). Approve/reject are keyed by request `publicId` (UUID); approving grants the
 * seats + activates the pending partner, rejecting leaves them PENDING_LICENSE.
 *
 * These requests surface alongside plan upgrades in the one Subscription & Add-on Requests queue.
 */
export const subAgentLicenseService = {
  list: (status) =>
    ConsoleAPI.get("/super-admin/subagent-license-requests", { params: status ? { status } : {} }).then(unwrap),

  pendingCount: () =>
    ConsoleAPI.get("/super-admin/subagent-license-requests/pending-count").then(unwrap),

  approve: (publicId) =>
    ConsoleAPI.post(`/super-admin/subagent-license-requests/${publicId}/approve`).then(unwrap),

  reject: (publicId, reason) =>
    ConsoleAPI.post(`/super-admin/subagent-license-requests/${publicId}/reject`, { reason }).then(unwrap),
};

export default subAgentLicenseService;