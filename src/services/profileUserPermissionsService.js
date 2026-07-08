import API from "@shared/api/http";
import { unwrap } from "./userMappers";

// ── USER PERMISSIONS ─────────────────────────────────────────
export const userPermissionsService = {
  // GET /api/users/{publicId}/permissions → { userPublicId, pages, total, permissions }
  getPermissions: async (userPublicId) => {
    const res = await API.get(`/users/${userPublicId}/permissions`);
    return { data: unwrap(res) };
  },

  // PUT /api/users/{publicId}/permissions — full replace of the map
  updatePermissions: async (userPublicId, permissions) => {
    const res = await API.put(`/users/${userPublicId}/permissions`, { permissions });
    return { data: unwrap(res) };
  },
};

// ── PERMISSION TEMPLATES ─────────────────────────────────────
function mapTemplate(d) {
  if (!d) return null;
  return {
    id:          d.value,          // pages use `id` for delete/edit/duplicate (= backend `value`)
    value:       d.value,
    publicId:    d.publicId,
    name:        d.label,
    label:       d.label,
    description: d.description || "",
    pages:       d.pages ?? 0,
    usersCount:  d.usersCount ?? 0,
    isDefault:   !!d.isDefault,
    permissions: d.permissions || {},
    badgeColor:  "bg-blue-100 text-blue-700",
    createdAt:   d.createdAt
      ? new Date(d.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
      : "",
  };
}

export const permissionTemplateService = {
  // GET /api/permission-templates
  getAll: async () => {
    const res = await API.get("/permission-templates");
    return { data: (unwrap(res) || []).map(mapTemplate) };
  },

  // GET /api/permission-templates/{value}
  getByValue: async (value) => {
    const res = await API.get(`/permission-templates/${value}`);
    return { data: mapTemplate(unwrap(res)) };
  },

  // POST /api/permission-templates
  // payload: { label, value?, description?, isDefault?, copyFromUserPublicId?, permissions? }
  create: async (payload) => {
    const res = await API.post("/permission-templates", payload);
    return { data: mapTemplate(unwrap(res)) };
  },

  // PUT /api/permission-templates/{value} — edit an existing template
  update: async (value, payload) => {
    const res = await API.put(`/permission-templates/${value}`, payload);
    return { data: mapTemplate(unwrap(res)) };
  },

  // DELETE /api/permission-templates/{value}
  delete: (value) => API.delete(`/permission-templates/${value}`),
};

// ── PERMISSION CATALOG (single source of truth = backend Permission enum) ──
export const permissionCatalogService = {
  // GET /api/permissions/catalog → [{ module, permissions: [{ key, label }] }]
  getCatalog: async () => {
    const res = await API.get("/permissions/catalog");
    return unwrap(res) || [];
  },
};

export default { userPermissionsService, permissionTemplateService, permissionCatalogService };