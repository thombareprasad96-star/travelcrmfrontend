// src/services/fleetService.js
// ─────────────────────────────────────────────────────────────
// Fleet / Vehicle Diary service — Travel CRM
//
// Every call goes through the shared authenticated axios instance (`API`), so the
// JWT (and therefore the server-side TenantContext) rides along automatically.
// NO tenantId is ever sent from the client — tenant isolation is enforced server-side.
//
// All IDs in URLs / params / payloads are publicId (UUID). The internal Long id is
// never exposed by the backend and never used here.
//
// Backend base: /api/fleet/**  (envelope: ApiResponse<T> / PagedApiResponse<T>)
// ─────────────────────────────────────────────────────────────

import API from "@shared/api/http";

/* ── Envelope unwrap helpers (app idiom: res.data?.data ?? res.data) ───────── */
const pick = (res) => res?.data?.data ?? res?.data ?? null;
const pickPage = (res) => ({
  items: res?.data?.data ?? [],
  pagination: res?.data?.pagination ?? null,
});

/** Strip null / undefined / "" so we never send empty filters as query params. */
function cleanParams(params = {}) {
  const out = {};
  Object.entries(params).forEach(([k, v]) => {
    if (v !== null && v !== undefined && v !== "") out[k] = v;
  });
  return out;
}

const fleetService = {
  /* ══ VEHICLES ══════════════════════════════════════════════════════════ */
  // GET /fleet/vehicles?status=&ownerType=&search=&page=&size=  → { items, pagination }
  listVehicles: ({ status, ownerType, search, page = 0, size = 10 } = {}) =>
    API.get("/fleet/vehicles", { params: cleanParams({ status, ownerType, search, page, size }) }).then(pickPage),

  // GET /fleet/vehicles/{publicId} → FleetVehicleResponseDto
  getVehicle: (publicId) => API.get(`/fleet/vehicles/${publicId}`).then(pick),

  // POST /fleet/vehicles → FleetVehicleResponseDto
  createVehicle: (body) => API.post("/fleet/vehicles", body).then(pick),

  // PUT /fleet/vehicles/{publicId} (full replace) → FleetVehicleResponseDto
  updateVehicle: (publicId, body) => API.put(`/fleet/vehicles/${publicId}`, body).then(pick),

  // PATCH /fleet/vehicles/{publicId}/status  (ON_TRIP rejected server-side)
  changeVehicleStatus: (publicId, status) =>
    API.patch(`/fleet/vehicles/${publicId}/status`, { status }).then(pick),

  // DELETE /fleet/vehicles/{publicId}  → soft-delete to Trash
  deleteVehicle: (publicId) => API.delete(`/fleet/vehicles/${publicId}`).then((r) => r?.data),

  // GET /fleet/vehicles/options?status=  → [{ publicId, label, status }]
  vehicleOptions: (status) =>
    API.get("/fleet/vehicles/options", { params: cleanParams({ status }) }).then(pick),

  // GET /fleet/vehicles/vendor-options  → active vendors for the owner link
  vendorOptions: () => API.get("/fleet/vehicles/vendor-options").then(pick),

  /* ══ DRIVERS ═══════════════════════════════════════════════════════════ */
  listDrivers: ({ status, search, page = 0, size = 10 } = {}) =>
    API.get("/fleet/drivers", { params: cleanParams({ status, search, page, size }) }).then(pickPage),

  getDriver: (publicId) => API.get(`/fleet/drivers/${publicId}`).then(pick),

  createDriver: (body) => API.post("/fleet/drivers", body).then(pick),

  updateDriver: (publicId, body) => API.put(`/fleet/drivers/${publicId}`, body).then(pick),

  changeDriverStatus: (publicId, status) =>
    API.patch(`/fleet/drivers/${publicId}/status`, { status }).then(pick),

  deleteDriver: (publicId) => API.delete(`/fleet/drivers/${publicId}`).then((r) => r?.data),

  // GET /fleet/drivers/options?status=  → [{ publicId, label, status }]
  driverOptions: (status) =>
    API.get("/fleet/drivers/options", { params: cleanParams({ status }) }).then(pick),

  /* ══ TRIPS ═════════════════════════════════════════════════════════════ */
  // GET /fleet/trips?vehicleId=&driverId=&status=&bookingId=&fromDate=&toDate=&search=&page=&size=
  listTrips: ({ vehicleId, driverId, status, bookingId, fromDate, toDate, search, page = 0, size = 10 } = {}) =>
    API.get("/fleet/trips", {
      params: cleanParams({ vehicleId, driverId, status, bookingId, fromDate, toDate, search, page, size }),
    }).then(pickPage),

  getTrip: (publicId) => API.get(`/fleet/trips/${publicId}`).then(pick),

  // POST /fleet/trips  (PLANNED, or COMPLETED when endDatetime is supplied)
  createTrip: (body) => API.post("/fleet/trips", body).then(pick),

  // PUT /fleet/trips/{publicId}  (partial — only non-null fields applied)
  updateTrip: (publicId, body) => API.put(`/fleet/trips/${publicId}`, body).then(pick),

  // PATCH /fleet/trips/{publicId}/start   body: { startOdometer, startDatetime? }
  startTrip: (publicId, body) => API.patch(`/fleet/trips/${publicId}/start`, body).then(pick),

  // PATCH /fleet/trips/{publicId}/close   body: { endOdometer, endDatetime?, fuelCost?, tollCost?, driverAllowance?, remarks? }
  closeTrip: (publicId, body) => API.patch(`/fleet/trips/${publicId}/close`, body).then(pick),

  // PATCH /fleet/trips/{publicId}/cancel  (no body)
  cancelTrip: (publicId) => API.patch(`/fleet/trips/${publicId}/cancel`).then(pick),

  deleteTrip: (publicId) => API.delete(`/fleet/trips/${publicId}`).then((r) => r?.data),

  /* ══ FUEL LOGS (nested under a vehicle) ════════════════════════════════ */
  listFuelLogs: (vehiclePublicId, { page = 0, size = 10 } = {}) =>
    API.get(`/fleet/vehicles/${vehiclePublicId}/fuel-logs`, { params: { page, size } }).then(pickPage),

  addFuelLog: (vehiclePublicId, body) =>
    API.post(`/fleet/vehicles/${vehiclePublicId}/fuel-logs`, body).then(pick),

  updateFuelLog: (publicId, body) => API.put(`/fleet/fuel-logs/${publicId}`, body).then(pick),

  deleteFuelLog: (publicId) => API.delete(`/fleet/fuel-logs/${publicId}`).then((r) => r?.data),

  /* ══ MAINTENANCE LOGS (nested under a vehicle) ═════════════════════════ */
  listMaintenanceLogs: (vehiclePublicId, { page = 0, size = 10 } = {}) =>
    API.get(`/fleet/vehicles/${vehiclePublicId}/maintenance-logs`, { params: { page, size } }).then(pickPage),

  addMaintenanceLog: (vehiclePublicId, body) =>
    API.post(`/fleet/vehicles/${vehiclePublicId}/maintenance-logs`, body).then(pick),

  updateMaintenanceLog: (publicId, body) =>
    API.put(`/fleet/maintenance-logs/${publicId}`, body).then(pick),

  deleteMaintenanceLog: (publicId) =>
    API.delete(`/fleet/maintenance-logs/${publicId}`).then((r) => r?.data),

  /* ══ DASHBOARD ═════════════════════════════════════════════════════════ */
  getDashboard: () => API.get("/fleet/dashboard").then(pick),

  listAlerts: ({ page = 0, size = 10 } = {}) =>
    API.get("/fleet/alerts", { params: { page, size } }).then(pickPage),
};

export default fleetService;