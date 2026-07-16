// features/calendar/api/taskService.js
// ─────────────────────────────────────────────────────────────
// Task board + team workload service — maps to Spring Boot /api/tasks.
// The backend returns BARE DTOs (no ApiResponse envelope), so every call
// resolves directly to res.data (an object / array). Path ids are the
// task's publicId (UUID), never a numeric id.
// ─────────────────────────────────────────────────────────────
import API from "@shared/api/http";

const taskService = {
  // GET /api/tasks?status=&priority=&category=&assignee=&from=&to=
  // from/to are ISO-8601 instants (e.g. 2025-05-01T00:00:00Z). assignee is a user publicId.
  list: async (params = {}) => (await API.get("/tasks", { params })).data,

  // GET /api/tasks/my — open tasks assigned to me, ranked by priority then due date
  my: async () => (await API.get("/tasks/my")).data,

  // GET /api/tasks/{publicId}
  getById: async (publicId) => (await API.get(`/tasks/${publicId}`)).data,

  // POST /api/tasks
  create: async (payload) => (await API.post("/tasks", payload)).data,

  // PUT /api/tasks/{publicId} — partial update (only sent fields change)
  update: async (publicId, payload) => (await API.put(`/tasks/${publicId}`, payload)).data,

  // PATCH /api/tasks/{publicId}/status — move on the board
  changeStatus: async (publicId, status) =>
    (await API.patch(`/tasks/${publicId}/status`, { status })).data,

  // PATCH /api/tasks/{publicId}/complete
  complete: async (publicId) => (await API.patch(`/tasks/${publicId}/complete`)).data,

  // POST /api/tasks/{publicId}/logs
  addLog: async (publicId, log) =>
    (await API.post(`/tasks/${publicId}/logs`, { log })).data,

  // DELETE /api/tasks/{publicId}
  remove: async (publicId) => {
    await API.delete(`/tasks/${publicId}`);
  },

  // GET /api/tasks/stats  (CRM_FULL) — { total, todo, inProgress, done, cancelled, overdue, dueToday }
  stats: async () => (await API.get("/tasks/stats")).data,

  // GET /api/tasks/workload  (CRM_FULL) — [{ assigneePublicId, assigneeName, todo, inProgress, done, overdue, total, activeLeads }]
  workload: async () => (await API.get("/tasks/workload")).data,

  // GET /api/users/available — assignable tenant users. ApiResponse-wrapped: { data: [{ publicId, fullName, role, email }] }.
  assignableUsers: async () => {
    const res = await API.get("/users/available");
    return res.data?.data ?? res.data ?? [];
  },
};

export default taskService;