import API from "@shared/api/http";
import { LABEL_TO_ROLE, mapUserFromApi, unwrap } from "./userMappers";

export const editUserService = {
  // GET /api/users/{publicId}
  getById: async (publicId) => {
    const res = await API.get(`/users/${publicId}`);
    return { data: mapUserFromApi(unwrap(res)) };
  },

  // PUT /api/users/{publicId} — partial update (no email, no password)
  update: async (publicId, data) => {
    const payload = {
      name:        (data.fullName || "").trim(),
      role:        LABEL_TO_ROLE[data.role] || "TRAVEL_AGENT",
      phoneNumber: (data.phone || "").trim() || null,
      isActive:    data.isActive ?? (data.status === "Active"),
    };
    const res = await API.put(`/users/${publicId}`, payload);
    return { data: mapUserFromApi(unwrap(res)) };
  },

  // POST /api/users/{publicId}/reset-password
  resetPassword: (publicId, newPassword, confirmPassword) =>
    API.post(`/users/${publicId}/reset-password`, { newPassword, confirmPassword }),

  // Convenience: update profile, then reset password if a new one was provided.
  fullUpdate: async (publicId, data) => {
    const result = await editUserService.update(publicId, data);
    if (data.newPassword) {
      await editUserService.resetPassword(publicId, data.newPassword, data.confirmPassword);
    }
    return result;
  },
};

export default editUserService;