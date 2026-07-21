import API from "@shared/api/http";

export const themeService = {
  get: () => API.get("/theme"),
  update: (values) => API.put("/theme", { values }),
  reset: () => API.post("/theme/reset"),
  importTheme: (values) => API.post("/theme/import", { values }),
  getPublic: (code) => API.get(`/public/themes/${encodeURIComponent(code)}`),
  uploadLoginBackground: (file) => { const body=new FormData(); body.append("file",file); return API.post("/theme/login-background",body,{headers:{"Content-Type":"multipart/form-data"}}); },
};

export const adminThemeService = {
  get: (tenantId) => API.get(`/super-admin/tenants/${tenantId}/theme`),
  update: (tenantId, values) => API.put(`/super-admin/tenants/${tenantId}/theme`, { values }),
  reset: (tenantId) => API.post(`/super-admin/tenants/${tenantId}/theme/reset`),
  clone: (targetId, sourceId) => API.post(`/super-admin/tenants/${targetId}/theme/clone/${sourceId}`),
};
