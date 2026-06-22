




// src/services/cityService.js

// import API from "./axiosInstance";

// // Transform React form data → Java DTO shape for City
// function transformCityData(country, name, code) {
//   return {
//     country : country,
//     name    : name,
//     code    : code ? code.toUpperCase() : "",
//     status  : "Active",
//   };
// }

// export const cityService = {

//   // 1. Nayi city create karo (POST)
//   createCity: (country, name, code) =>
//     API.post("/cities", transformCityData(country, name, code)),

//   // 2. Saari cities fetch karo (GET)
//   getAllCities: () =>
//     API.get("/cities"),

//   // 3. City delete karo (DELETE)
//   deleteCity: (id) =>
//     API.delete(`/cities/${id}`),

//   // 4. City update karo (PUT)
//   updateCity: (id, country, name, code) =>
//     API.put(`/cities/${id}`, transformCityData(country, name, code)),
// };




// src/services/cityService.js

import API from "./axiosInstance";

// ── Transform → Java DTO ──────────────────────────────────
function transformCityData(countryId, destinationId, name, code) {
  return {
    countryId     : countryId,
    destinationId : destinationId,
    name          : name,
    code          : code ? code.toUpperCase() : "",
    status        : "Active",
  };
}

export const cityService = {

  // 1. Saari cities fetch karo (GET)
  getAllCities: () =>
    API.get("/cities"),

  // 2. Single city fetch karo (GET)
  getCityById: (id) =>
    API.get(`/cities/${id}`),

  // 3. Destination ke hisaab se cities fetch karo (GET)
  getCitiesByDestination: (destinationId) =>
    API.get(`/cities/destination/${destinationId}`),

  // 4. Country ke hisaab se cities fetch karo (GET)
  getCitiesByCountry: (countryId) =>
    API.get(`/cities/country/${countryId}`),

  // 5. Nayi city create karo (POST)
  createCity: (countryId, destinationId, name, code) =>
    API.post("/cities", transformCityData(countryId, destinationId, name, code)),

  // 6. City update karo (PUT)
  updateCity: (id, countryId, destinationId, name, code) =>
    API.put(`/cities/${id}`, transformCityData(countryId, destinationId, name, code)),

  // 7. City delete karo (DELETE)
  deleteCity: (id) =>
    API.delete(`/cities/${id}`),
};