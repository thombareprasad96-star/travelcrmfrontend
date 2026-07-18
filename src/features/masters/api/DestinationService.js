import API from "@shared/api/http";
import { uploadImageViaApi } from "./imageUpload";

const BASE = "/destinations";

/**
 * Destination image upload — backend-proxied (quota-enforced + metered).
 * Naam legacy hai; signature same rakhi hai taaki koi caller na toote.
 *
 * @param {File} file                          The image file selected by the user.
 * @param {(percent:number)=>void} [onProgress] Called with 0–100 during upload.
 * @returns {Promise<string>}                  Resolves with the Cloudinary `secure_url`.
 */
export function uploadImageToCloudinary(file, onProgress) {
  return uploadImageViaApi(`${BASE}/upload-image`, file, onProgress);
}

// Map the React form state to the exact field names the Spring Boot DTO expects.
function transformDestinationData(formData) {
  return {
    name                 : formData.name,
    country              : formData.country,
    type                 : formData.type,
    imagePath            : formData.imagePath,
    inclusions           : formData.inclusions,
    exclusions           : formData.exclusions,
    paymentPolicies      : formData.paymentPolicies,
    cancellationPolicies : formData.cancellationPolicies,
    bookingTerms         : formData.bookingTerms,
    status               : formData.status,
    // tenantId deliberately omitted — server-assigned from the JWT.
  };
}

export const destinationService = {

  // ── Existing endpoints (unchanged) ───────────────────────

  // GET /destinations?page&size&sortBy&sortDir → PagedApiResponse
  getAllDestinations: ({ page = 0, size = 50, sortBy = "createdAt", sortDir = "desc" } = {}) =>
    API.get(BASE, { params: { page, size, sortBy, sortDir } }),

  // GET /destinations/{id} → ApiResponse<DestinationMasterResponseDTO>
  getDestinationById: (id) =>
    API.get(`${BASE}/${id}`),

  // POST /destinations
  createDestination: (formData) =>
    API.post(BASE, transformDestinationData(formData)),

  // PUT /destinations/{id}
  updateDestination: (id, formData) =>
    API.put(`${BASE}/${id}`, transformDestinationData(formData)),

  // DELETE /destinations/{id}
  deleteDestination: (id) =>
    API.delete(`${BASE}/${id}`),

  // Upload image straight to Cloudinary; returns the secure_url to store as imagePath.
  uploadImageToCloudinary,

  // ── NEW: City cascade ke liye ─────────────────────────────

  // GET /destinations/country/{countryId}
  // Country choose karne pe destinations load karo (Cities modal cascade)
  getDestinationsByCountry: (countryId) =>
    API.get(`/countries/${countryId}/destinations`),
};


