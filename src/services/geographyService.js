// src/services/geographyService.js
// ─────────────────────────────────────────────────────────────
// Geography cascade API client (Country → Destination → City).
//
// Uses the shared axiosInstance (baseURL ".../api") so the JWT
// interceptor and 401→login redirect are applied consistently.
//
// Backed entirely by the real unified dropdown endpoints — no mock
// data, no fallback lists:
//   GET /masters/dropdown/countries
//   GET /masters/dropdown/destinations?countryId=
//   GET /masters/dropdown/cities?destinationId=
//   GET /masters/dropdown/cities?countryId=
//
// The backend returns DropdownDto { value: Long, label: String }.
// We normalise every list to { id, name } so the UI code stays uniform.
// ─────────────────────────────────────────────────────────────

import API from "./axiosInstance";

// DropdownDto { value, label } → { id, name }
const toOptions = (res) =>
  (res.data?.data ?? []).map((o) => ({ id: o.value ?? o.id, name: o.label ?? o.name }));

export const geographyService = {
  /** All countries for the tenant. → [{ id, name }] */
  getCountries: () => API.get("/masters/dropdown/countries").then(toOptions),

  /** Active destinations under a country (incl. global). → [{ id, name }] */
  getDestinationsByCountry: (countryId) =>
    API.get("/masters/dropdown/destinations", { params: { countryId } }).then(toOptions),

  /** ALL active destinations visible to the tenant (no country filter). → [{ id, name }] */
  getAllDestinations: () =>
    API.get("/masters/dropdown/destinations").then(toOptions),

  /** Cities linked to a destination. → [{ id, name }] */
  getCitiesByDestination: (destinationId) =>
    API.get("/masters/dropdown/cities", { params: { destinationId } }).then(toOptions),

  /** Cities belonging directly to a country. → [{ id, name }] */
  getCitiesByCountry: (countryId) =>
    API.get("/masters/dropdown/cities", { params: { countryId } }).then(toOptions),

  /**
   * Cities under a destination resolved by NAME (CityDto list). Used where the
   * record stores the destination as a name string rather than an id
   * (e.g. Sightseeing). → [{ id, name }]
   */
  getCitiesByDestinationName: (destinationName) =>
    API.get("/destinations/cities", { params: { destination: destinationName } })
      .then((r) => (r.data?.data ?? []).map((c) => ({ id: c.cityId ?? c.id, name: c.name }))),

  /**
   * Full DestinationDto for a single destination (used to resolve the parent
   * countryId when pre-filling a cascade in edit mode).
   * → { destinationId, countryId, countryName, name, ... } | null
   */
  getDestinationById: (destinationId) =>
    API.get(`/destinations/${destinationId}`).then((r) => r.data?.data ?? null),
};

export default geographyService;