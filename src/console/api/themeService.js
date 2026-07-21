import ConsoleAPI, { unwrap } from "./consoleHttp";

export const consoleThemeService = {
  get: (tenantId) => ConsoleAPI.get(`/super-admin/tenants/${tenantId}/theme`).then(unwrap),
  update: (tenantId, values) => ConsoleAPI.put(`/super-admin/tenants/${tenantId}/theme`, { values }).then(unwrap),
  reset: (tenantId) => ConsoleAPI.post(`/super-admin/tenants/${tenantId}/theme/reset`).then(unwrap),
  clone: (targetId, sourceId) => ConsoleAPI.post(`/super-admin/tenants/${targetId}/theme/clone/${sourceId}`).then(unwrap),
  uploadLoginBackground: (tenantId, file) => { const body=new FormData(); body.append("file",file); return ConsoleAPI.post(`/super-admin/tenants/${tenantId}/theme/login-background`,body,{headers:{"Content-Type":"multipart/form-data"}}).then(unwrap); },
};
