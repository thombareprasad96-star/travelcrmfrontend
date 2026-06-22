// // src/services/CountryService.js

// import API from "./axiosInstance";

// export const countryService = {
//   /**
//    * Fetch all countries as dropdown options
//    * @returns {Promise<Array>} Array of DropdownDto {id, name, ...}
//    */
//   async getCountries() {
//     try {
//       const response = await API.get("/masters/dropdown/countries");
//       // Response structure: { success, message, data: [...] }
//       return response.data?.data || [];
//     } catch (error) {
//       console.error("Error fetching countries:", error);
//       throw error;
//     }
//   },
// };




// src/services/countryService.js

import API from "./axiosInstance";

// ── Transform → Java DTO ──────────────────────────────────
function transformCountryData(name, code) {
  return {
    name   : name,
    code   : code ? code.toUpperCase() : "",
    status : "Active",
  };
}

export const countryService = {

  // 1. Saare countries fetch karo (GET)
  getAllCountries: () =>
    API.get("/countries"),

  // 2. Single country fetch karo (GET)
  getCountryById: (id) =>
    API.get(`/countries/${id}`),

  // 3. Nayi country create karo (POST)
  createCountry: (name, code) =>
    API.post("/countries", transformCountryData(name, code)),

  // 4. Country update karo (PUT)
  updateCountry: (id, name, code) =>
    API.put(`/countries/${id}`, transformCountryData(name, code)),

  // 5. Country delete karo (DELETE)
  deleteCountry: (id) =>
    API.delete(`/countries/${id}`),
};