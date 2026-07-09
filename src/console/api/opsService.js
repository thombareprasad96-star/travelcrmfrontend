import ConsoleAPI from "./consoleHttp";

/** Ops / Danger Zone — data export + irreversible tenant hard-delete. */
export const opsService = {
  downloadTenantsCsv: async () => {
    const res = await ConsoleAPI.get("/super-admin/export/tenants.csv", { responseType: "blob" });
    return res.data; // Blob
  },
  hardDeleteTenant: (publicId, organizationCode) =>
    ConsoleAPI.post(`/super-admin/tenants/${publicId}/hard-delete`, { organizationCode }),
};