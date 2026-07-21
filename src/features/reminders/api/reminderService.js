




// src/services/reminderService.js
// ─────────────────────────────────────────────────────────────
// Reminder Service — Travel CRM
// Backend: Java Spring Boot REST API
// API client baseURL should already contain /api
// Final endpoint example: /api/reminders
// ─────────────────────────────────────────────────────────────

import API from "@shared/api/http";

const BASE_URL = "/reminders";

/**
 * Extract usable reminder ID.
 * Supports numeric id and UUID publicId.
 */
const getReminderId = (value) => {
  if (value === null || value === undefined || value === "") {
    throw new Error("Reminder ID is required.");
  }

  if (typeof value === "object") {
    const id =
      value.publicId ??
      value.reminderPublicId ??
      value.reminderId ??
      value.id;

    if (id === null || id === undefined || id === "") {
      throw new Error("Reminder ID is missing.");
    }

    return id;
  }

  return value;
};

/**
 * Normalize list response.
 *
 * Supports:
 * response.data = []
 * response.data.data = []
 * response.data.content = []
 * response.data.data.content = []
 * response.data.reminders = []
 * response.data.data.reminders = []
 */
export const extractReminderList = (response) => {
  const body = response?.data ?? response;

  if (Array.isArray(body)) return body;
  if (Array.isArray(body?.data)) return body.data;
  if (Array.isArray(body?.content)) return body.content;
  if (Array.isArray(body?.data?.content)) return body.data.content;
  if (Array.isArray(body?.reminders)) return body.reminders;
  if (Array.isArray(body?.data?.reminders)) return body.data.reminders;
  if (Array.isArray(body?.items)) return body.items;
  if (Array.isArray(body?.data?.items)) return body.data.items;

  return [];
};

const reminderService = {
  /**
   * GET /api/reminders
   */
  getAll: (params = {}) => {
    return API.get(BASE_URL, { params });
  },

  /**
   * Alias for compatibility.
   */
  getAllReminders: (params = {}) => {
    return API.get(BASE_URL, { params });
  },

  /**
   * GET /api/reminders/{id}
   */
  getById: (id) => {
    const reminderId = getReminderId(id);
    return API.get(`${BASE_URL}/${reminderId}`);
  },

  /**
   * POST /api/reminders
   */
  create: (reminderData) => {
    if (!reminderData?.title?.trim()) {
      return Promise.reject(new Error("Reminder title is required."));
    }

    if (!reminderData?.dueDate) {
      return Promise.reject(new Error("Reminder due date is required."));
    }

    return API.post(BASE_URL, reminderData);
  },

  /**
   * PUT /api/reminders/{id}
   */
  replace: (id, reminderData) => {
    const reminderId = getReminderId(id);
    return API.put(`${BASE_URL}/${reminderId}`, reminderData);
  },

  /**
   * PATCH /api/reminders/{id}
   *
   * Corrected Reminders page can use this for editing.
   * If PATCH is not implemented in backend, it falls back to PUT.
   */
  update: async (id, reminderData) => {
    const reminderId = getReminderId(id);

    try {
      return await API.patch(
        `${BASE_URL}/${reminderId}`,
        reminderData
      );
    } catch (error) {
      const status = error?.response?.status;

      if (status === 404 || status === 405) {
        return API.put(
          `${BASE_URL}/${reminderId}`,
          reminderData
        );
      }

      throw error;
    }
  },

  /**
   * PATCH /api/reminders/{id}
   */
  patch: (id, fields) => {
    const reminderId = getReminderId(id);
    return API.patch(`${BASE_URL}/${reminderId}`, fields);
  },

  /**
   * DELETE /api/reminders/{id}
   */
  remove: (id) => {
    const reminderId = getReminderId(id);
    return API.delete(`${BASE_URL}/${reminderId}`);
  },

  /**
   * Existing-name compatibility.
   */
  delete: (id) => {
    const reminderId = getReminderId(id);
    return API.delete(`${BASE_URL}/${reminderId}`);
  },

  /**
   * Generic status update.
   *
   * Tries:
   * PATCH /api/reminders/{id}/status
   *
   * Fallback:
   * PATCH /api/reminders/{id}
   */
  updateStatus: async (id, status) => {
    const reminderId = getReminderId(id);

    try {
      return await API.patch(
        `${BASE_URL}/${reminderId}/status`,
        { status }
      );
    } catch (error) {
      const responseStatus = error?.response?.status;

      if (responseStatus === 404 || responseStatus === 405) {
        return API.patch(
          `${BASE_URL}/${reminderId}`,
          { status }
        );
      }

      throw error;
    }
  },

  /**
   * PATCH /api/reminders/{id}/complete
   */
  markComplete: async (id) => {
    const reminderId = getReminderId(id);

    try {
      return await API.patch(
        `${BASE_URL}/${reminderId}/complete`
      );
    } catch (error) {
      const status = error?.response?.status;

      if (status === 404 || status === 405) {
        return reminderService.updateStatus(
          reminderId,
          "Completed"
        );
      }

      throw error;
    }
  },

  /**
   * PATCH /api/reminders/{id}/dismiss
   */
  dismiss: async (id) => {
    const reminderId = getReminderId(id);

    try {
      return await API.patch(
        `${BASE_URL}/${reminderId}/dismiss`
      );
    } catch (error) {
      const status = error?.response?.status;

      if (status === 404 || status === 405) {
        return reminderService.updateStatus(
          reminderId,
          "Dismissed"
        );
      }

      throw error;
    }
  },

  /**
   * PATCH /api/reminders/{id}/snooze
   *
   * Body:
   * {
   *   snoozedUntil: "2026-07-22T10:00:00.000Z"
   * }
   */
  snooze: async (id, snoozedUntilISO) => {
    const reminderId = getReminderId(id);

    const payload = {
      snoozedUntil: snoozedUntilISO,
    };

    try {
      return await API.patch(
        `${BASE_URL}/${reminderId}/snooze`,
        payload
      );
    } catch (error) {
      const status = error?.response?.status;

      if (status === 404 || status === 405) {
        try {
          return await API.post(
            `${BASE_URL}/${reminderId}/snooze`,
            payload
          );
        } catch (postError) {
          const postStatus = postError?.response?.status;

          if (postStatus === 404 || postStatus === 405) {
            return API.patch(
              `${BASE_URL}/${reminderId}`,
              {
                status: "Snoozed",
                dueDate: snoozedUntilISO,
                snoozedUntil: snoozedUntilISO,
              }
            );
          }

          throw postError;
        }
      }

      throw error;
    }
  },

  /**
   * POST /api/reminders/{id}/logs
   */
  addLog: (id, logText) => {
    const reminderId = getReminderId(id);

    return API.post(
      `${BASE_URL}/${reminderId}/logs`,
      {
        log: logText,
      }
    );
  },

  /**
   * GET /api/reminders/overdue
   */
  getOverdue: () => {
    return API.get(`${BASE_URL}/overdue`);
  },

  /**
   * GET /api/reminders/lead/{leadName}
   */
  getByLeadName: (leadName) => {
    if (!leadName?.trim()) {
      return Promise.reject(
        new Error("Lead name is required.")
      );
    }

    return API.get(
      `${BASE_URL}/lead/${encodeURIComponent(
        leadName.trim()
      )}`
    );
  },

  /**
   * PATCH /api/reminders/complete-all-overdue
   */
  completeAllOverdue: () => {
    return API.patch(
      `${BASE_URL}/complete-all-overdue`
    );
  },

  /**
   * GET /api/reminders/stats
   */
  getStats: () => {
    return API.get(`${BASE_URL}/stats`);
  },

  /**
   * GET /api/reminders/export/csv
   */
  exportCSV: () => {
    return API.get(
      `${BASE_URL}/export/csv`,
      {
        responseType: "blob",
      }
    );
  },
};

export { reminderService };
export default reminderService;