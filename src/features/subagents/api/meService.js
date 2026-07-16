// src/features/subagents/api/meService.js
// ─────────────────────────────────────────────────────────────
// Self-service ("me") API — the authenticated user's own profile + a sub-agent's own commission.
// Thin passthrough over @shared/api/http; unwrap res.data?.data ?? res.data at the call site.
// ─────────────────────────────────────────────────────────────
import API from "@shared/api/http";

const meService = {
  // GET  /api/me/profile              → ApiResponse<{ name, email, phoneNumber, role }>
  getProfile: () => API.get("/me/profile"),
  // PUT  /api/me/profile  { name, phoneNumber } → ApiResponse<profile>
  updateProfile: (data) => API.put("/me/profile", data),

  // POST /api/auth/change-password  { currentPassword, newPassword }
  changePassword: (currentPassword, newPassword) =>
    API.post("/auth/change-password", { currentPassword, newPassword }),

  // GET  /api/me/commissions          → ApiResponse<{ name, commissionType, commissionRate, totalEarned, entries[] }>
  // (SUB_AGENT self view; 404 if the caller isn't a sub-agent)
  getMyCommission: () => API.get("/me/commissions"),
};

export default meService;