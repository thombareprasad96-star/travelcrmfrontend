// src/services/CountryService.js

import API from "./axiosInstance";

export const countryService = {
  /**
   * Fetch all countries as dropdown options
   * @returns {Promise<Array>} Array of DropdownDto {id, name, ...}
   */
  async getCountries() {
    try {
      const response = await API.get("/masters/dropdown/countries");
      // Response structure: { success, message, data: [...] }
      return response.data?.data || [];
    } catch (error) {
      console.error("Error fetching countries:", error);
      throw error;
    }
  },
};
