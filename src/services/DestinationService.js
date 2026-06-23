









// // src/services/DestinationService.js
// // ─────────────────────────────────────────────────────────────
// // Destination master API client.
// //
// // Uses the shared axiosInstance (baseURL ".../api") so the JWT
// // interceptor, 401→login redirect and timeout are applied consistently.
// // Endpoints intentionally have NO trailing slash: Spring Boot 3 disables
// // trailing-slash matching, so GET "/destinations/" would 404.
// //
// // NOTE: tenantId is NEVER sent from the client. The backend derives it from
// // the authenticated principal (SuperAdmin → global, tenant admin → own tenant).
// // ─────────────────────────────────────────────────────────────

// import API from "./axiosInstance";

// const BASE = "/destinations";

// // ─────────────────────────────────────────────────────────────
// // Cloudinary (unsigned) image upload.
// //
// // Images are uploaded DIRECTLY from the browser to Cloudinary using an
// // unsigned upload preset — the file/binary never touches our Spring Boot
// // backend. Only the resulting `secure_url` (an https string) is later sent
// // to the backend as `imagePath`.
// //
// // Config comes from Vite env vars (see .env):
// //   VITE_CLOUDINARY_CLOUD_NAME, VITE_CLOUDINARY_UPLOAD_PRESET
// //
// // NOTE: we deliberately do NOT use the shared axiosInstance here. That
// // instance targets our own API baseURL and attaches our JWT — neither of
// // which should ever be sent to Cloudinary. XMLHttpRequest is used so we can
// // report real upload progress for the UI.
// // ─────────────────────────────────────────────────────────────
// const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
// const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

// /**
//  * Upload a single image file to Cloudinary using the unsigned preset.
//  *
//  * @param {File} file                 The image file selected by the user.
//  * @param {(percent:number)=>void} [onProgress]  Called with 0–100 during upload.
//  * @returns {Promise<string>}         Resolves with the Cloudinary `secure_url`.
//  * @throws  {Error}                   On misconfiguration, network error, or a
//  *                                    non-2xx Cloudinary response (message is
//  *                                    safe to show to the user).
//  */
// export function uploadImageToCloudinary(file, onProgress) {
//   return new Promise((resolve, reject) => {
//     if (!file) {
//       reject(new Error("No file selected for upload."));
//       return;
//     }
//     if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
//       reject(
//         new Error(
//           "Image upload is not configured. Please set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET."
//         )
//       );
//       return;
//     }

//     const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

//     const xhr = new XMLHttpRequest();
//     xhr.open("POST", url, true);

//     xhr.upload.onprogress = (event) => {
//       if (typeof onProgress === "function" && event.lengthComputable) {
//         onProgress(Math.round((event.loaded / event.total) * 100));
//       }
//     };

//     xhr.onload = () => {
//       let payload = null;
//       try {
//         payload = JSON.parse(xhr.responseText);
//       } catch {
//         payload = null;
//       }

//       if (xhr.status >= 200 && xhr.status < 300 && payload?.secure_url) {
//         resolve(payload.secure_url);
//       } else {
//         const message =
//           payload?.error?.message ||
//           `Image upload failed (status ${xhr.status}). Please try again.`;
//         reject(new Error(message));
//       }
//     };

//     xhr.onerror = () =>
//       reject(new Error("Network error while uploading image. Please check your connection."));
//     xhr.onabort = () => reject(new Error("Image upload was cancelled."));

//     xhr.send(formData);
//   });
// }

// // Map the React form state to the exact field names the Spring Boot DTO expects.
// function transformDestinationData(formData) {
//   return {
//     name: formData.name,
//     country: formData.country,
//     type: formData.type,
//     imagePath: formData.imagePath,
//     inclusions: formData.inclusions,
//     exclusions: formData.exclusions,
//     paymentPolicies: formData.paymentPolicies,
//     cancellationPolicies: formData.cancellationPolicies,
//     bookingTerms: formData.bookingTerms,
//     status: formData.status,
//     // tenantId deliberately omitted — server-assigned from the JWT.
//   };
// }

// export const destinationService = {
//   // GET /destinations?page&size&sortBy&sortDir → PagedApiResponse
//   getAllDestinations: ({ page = 0, size = 50, sortBy = "createdAt", sortDir = "desc" } = {}) =>
//     API.get(BASE, { params: { page, size, sortBy, sortDir } }),

//   // GET /destinations/{id} → ApiResponse<DestinationMasterResponseDTO>
//   getDestinationById: (id) => API.get(`${BASE}/${id}`),

//   // POST /destinations  (SUPERADMIN → global, TENANT_ADMIN → own tenant)
//   createDestination: (formData) => API.post(BASE, transformDestinationData(formData)),

//   // PUT /destinations/{id}
//   updateDestination: (id, formData) => API.put(`${BASE}/${id}`, transformDestinationData(formData)),

//   // DELETE /destinations/{id}
//   deleteDestination: (id) => API.delete(`${BASE}/${id}`),

//   // Upload image straight to Cloudinary; returns the secure_url to store as imagePath.
//   uploadImageToCloudinary,
// };



// src/services/DestinationService.js
// ─────────────────────────────────────────────────────────────
// Destination master API client.
//
// Uses the shared axiosInstance (baseURL ".../api") so the JWT
// interceptor, 401→login redirect and timeout are applied consistently.
// Endpoints intentionally have NO trailing slash: Spring Boot 3 disables
// trailing-slash matching, so GET "/destinations/" would 404.
//
// NOTE: tenantId is NEVER sent from the client. The backend derives it from
// the authenticated principal (SuperAdmin → global, tenant admin → own tenant).
// ─────────────────────────────────────────────────────────────

// import API from "./axiosInstance";

// const BASE = "/destinations";

// // ─────────────────────────────────────────────────────────────
// // Cloudinary (unsigned) image upload.
// //
// // Images are uploaded DIRECTLY from the browser to Cloudinary using an
// // unsigned upload preset — the file/binary never touches our Spring Boot
// // backend. Only the resulting `secure_url` (an https string) is later sent
// // to the backend as `imagePath`.
// //
// // Config comes from Vite env vars (see .env):
// //   VITE_CLOUDINARY_CLOUD_NAME, VITE_CLOUDINARY_UPLOAD_PRESET
// //
// // NOTE: we deliberately do NOT use the shared axiosInstance here. That
// // instance targets our own API baseURL and attaches our JWT — neither of
// // which should ever be sent to Cloudinary. XMLHttpRequest is used so we can
// // report real upload progress for the UI.
// // ─────────────────────────────────────────────────────────────
// const CLOUDINARY_CLOUD_NAME    = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
// const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

// /**
//  * Upload a single image file to Cloudinary using the unsigned preset.
//  *
//  * @param {File} file                          The image file selected by the user.
//  * @param {(percent:number)=>void} [onProgress] Called with 0–100 during upload.
//  * @returns {Promise<string>}                  Resolves with the Cloudinary `secure_url`.
//  * @throws  {Error}                            On misconfiguration, network error, or a
//  *                                             non-2xx Cloudinary response.
//  */
// export function uploadImageToCloudinary(file, onProgress) {
//   return new Promise((resolve, reject) => {
//     if (!file) {
//       reject(new Error("No file selected for upload."));
//       return;
//     }
//     if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
//       reject(
//         new Error(
//           "Image upload is not configured. Please set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET."
//         )
//       );
//       return;
//     }

//     const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

//     const xhr = new XMLHttpRequest();
//     xhr.open("POST", url, true);

//     xhr.upload.onprogress = (event) => {
//       if (typeof onProgress === "function" && event.lengthComputable) {
//         onProgress(Math.round((event.loaded / event.total) * 100));
//       }
//     };

//     xhr.onload = () => {
//       let payload = null;
//       try { payload = JSON.parse(xhr.responseText); }
//       catch { payload = null; }

//       if (xhr.status >= 200 && xhr.status < 300 && payload?.secure_url) {
//         resolve(payload.secure_url);
//       } else {
//         const message =
//           payload?.error?.message ||
//           `Image upload failed (status ${xhr.status}). Please try again.`;
//         reject(new Error(message));
//       }
//     };

//     xhr.onerror = () =>
//       reject(new Error("Network error while uploading image. Please check your connection."));
//     xhr.onabort = () =>
//       reject(new Error("Image upload was cancelled."));

//     xhr.send(formData);
//   });
// }

// // Map the React form state to the exact field names the Spring Boot DTO expects.
// function transformDestinationData(formData) {
//   return {
//     name                 : formData.name,
//     country              : formData.country,
//     type                 : formData.type,
//     imagePath            : formData.imagePath,
//     inclusions           : formData.inclusions,
//     exclusions           : formData.exclusions,
//     paymentPolicies      : formData.paymentPolicies,
//     cancellationPolicies : formData.cancellationPolicies,
//     bookingTerms         : formData.bookingTerms,
//     status               : formData.status,
//     // tenantId deliberately omitted — server-assigned from the JWT.
//   };
// }

// export const destinationService = {

//   // ── Existing endpoints (unchanged) ───────────────────────

//   // GET /destinations?page&size&sortBy&sortDir → PagedApiResponse
//   getAllDestinations: ({ page = 0, size = 50, sortBy = "createdAt", sortDir = "desc" } = {}) =>
//     API.get(BASE, { params: { page, size, sortBy, sortDir } }),

//   // GET /destinations/{id} → ApiResponse<DestinationMasterResponseDTO>
//   getDestinationById: (id) =>
//     API.get(`${BASE}/${id}`),

//   // POST /destinations
//   createDestination: (formData) =>
//     API.post(BASE, transformDestinationData(formData)),

//   // PUT /destinations/{id}
//   updateDestination: (id, formData) =>
//     API.put(`${BASE}/${id}`, transformDestinationData(formData)),

//   // DELETE /destinations/{id}
//   deleteDestination: (id) =>
//     API.delete(`${BASE}/${id}`),

//   // Upload image straight to Cloudinary; returns the secure_url to store as imagePath.
//   uploadImageToCloudinary,

//   // ── NEW: City cascade ke liye ─────────────────────────────

//   // GET /destinations/country/{countryId}
//   // Country choose karne pe destinations load karo (Cities modal cascade)
//   getDestinationsByCountry: (countryId) =>
//     API.get(`${BASE}/country/${countryId}`),
// };



import API from "./axiosInstance";

const BASE = "/destinations";

// ─────────────────────────────────────────────────────────────
// Cloudinary (unsigned) image upload.
//
// Images are uploaded DIRECTLY from the browser to Cloudinary using an
// unsigned upload preset — the file/binary never touches our Spring Boot
// backend. Only the resulting `secure_url` (an https string) is later sent
// to the backend as `imagePath`.
//
// Config comes from Vite env vars (see .env):
//   VITE_CLOUDINARY_CLOUD_NAME, VITE_CLOUDINARY_UPLOAD_PRESET
//
// NOTE: we deliberately do NOT use the shared axiosInstance here. That
// instance targets our own API baseURL and attaches our JWT — neither of
// which should ever be sent to Cloudinary. XMLHttpRequest is used so we can
// report real upload progress for the UI.
// ─────────────────────────────────────────────────────────────
const CLOUDINARY_CLOUD_NAME    = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

/**
 * Upload a single image file to Cloudinary using the unsigned preset.
 *
 * @param {File} file                          The image file selected by the user.
 * @param {(percent:number)=>void} [onProgress] Called with 0–100 during upload.
 * @returns {Promise<string>}                  Resolves with the Cloudinary `secure_url`.
 * @throws  {Error}                            On misconfiguration, network error, or a
 *                                             non-2xx Cloudinary response.
 */
export function uploadImageToCloudinary(file, onProgress) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error("No file selected for upload."));
      return;
    }
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      reject(
        new Error(
          "Image upload is not configured. Please set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET."
        )
      );
      return;
    }

    const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);

    xhr.upload.onprogress = (event) => {
      if (typeof onProgress === "function" && event.lengthComputable) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      let payload = null;
      try { payload = JSON.parse(xhr.responseText); }
      catch { payload = null; }

      if (xhr.status >= 200 && xhr.status < 300 && payload?.secure_url) {
        resolve(payload.secure_url);
      } else {
        const message =
          payload?.error?.message ||
          `Image upload failed (status ${xhr.status}). Please try again.`;
        reject(new Error(message));
      }
    };

    xhr.onerror = () =>
      reject(new Error("Network error while uploading image. Please check your connection."));
    xhr.onabort = () =>
      reject(new Error("Image upload was cancelled."));

    xhr.send(formData);
  });
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


