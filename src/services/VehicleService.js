// import API from "@shared/api/http";

// // ============================================================
// // RESPONSE NORMALIZER

// // ============================================================
// export function normalizeVehicleList(responseData) {
//   if (Array.isArray(responseData)) {
//     return responseData;
//   }
//   if (responseData && Array.isArray(responseData.data)) {
//     return responseData.data;
//   }
//   if (responseData && Array.isArray(responseData.vehicles)) {
//     return responseData.vehicles;
//   }
//   return [];
// }

// // ============================================================
// // TRANSFORMER: Frontend formData  ➜  Backend DTO

// // ============================================================
// function transformVehicleData(formData) {
//   return {
//     // form.name        → Vehicle Name input (required)
//     name:        formData.name?.trim(),

//     // form.type        → Vehicle Type input (required) e.g. "SUV", "Bus"
//     type:        formData.type?.trim(),

//     // form.capacity    → Capacity input (number) — string se number convert
//     capacity:    formData.capacity !== "" && formData.capacity != null
//       ? Number(formData.capacity)
//       : null,

//     // form.description → Description textarea
//     description: formData.description?.trim() || "",

   
//     imagePath:   formData.imagePath || null,

   
//     createdAt:   new Date().toISOString().slice(0, 10),
//   };
// }

// // ============================================================
// // REVERSE TRANSFORMER: Backend response  ➜  Frontend formData
// //

// // ============================================================
// export function transformVehicleResponse(backendData) {
//   return {
//     name:         backendData.name         ?? "",
//     type:         backendData.type         ?? "",
//     capacity:     backendData.capacity     != null
//       ? backendData.capacity.toString()                // number input expects string
//       : "",
//     description:  backendData.description  ?? "",

   
//     image:        backendData.imagePath    ?? backendData.image ?? null,
//     imagePreview: backendData.imagePath    ?? backendData.image ?? null,

//     // imagePath alag rakhte hain taaki save ke waqt wapas bhej sakein
//     imagePath:    backendData.imagePath    ?? backendData.image ?? null,
//   };
// }

// // ============================================================
// // VEHICLE SERVICE — all API methods
// // ============================================================
// export const vehicleService = {

//   // ──────────────────────────────────────────────────────────
//   // 1. GET ALL VEHICLES

//   // ──────────────────────────────────────────────────────────
//   getAllVehicles: () => {
//     return API.get("/vehicles");
//   },

//   // ──────────────────────────────────────────────────────────
//   // 2. GET VEHICLE BY ID
 
//   // ──────────────────────────────────────────────────────────
//   getVehicleById: (publicId) => {
//     return API.get(`/vehicles${publicId}`);
//   },

//   // ──────────────────────────────────────────────────────────
//   // 3. CREATE VEHICLE

//   // ──────────────────────────────────────────────────────────
//   createVehicle: (formData) => {
//     const mappedData = transformVehicleData(formData);
//     return API.post("/vehicles", mappedData);
//   },

//   // ──────────────────────────────────────────────────────────
//   // 4. UPDATE VEHICLE
  
//   // ──────────────────────────────────────────────────────────
//   updateVehicle: (publicId, formData) => {
//     const mappedData = transformVehicleData(formData);
//     return API.put(`/vehicles/${publicId}`, mappedData);
//   },

//   // ──────────────────────────────────────────────────────────
//   // 5. DELETE VEHICLE

//   // ──────────────────────────────────────────────────────────
//   deleteVehicle: (publicId) => {
//     return API.delete(`/vehicles/${publicId}`);
//   },

//   // ──────────────────────────────────────────────────────────
//   // 6. UPLOAD VEHICLE IMAGE

//   //    Returns: { data: { imagePath: "https://..." } }
 
//   // ──────────────────────────────────────────────────────────
//   uploadVehicleImage: (imageFile) => {
//     const formData = new FormData();

//     formData.append("file", imageFile);

//     return API.post("/vehicles/upload-image", formData, {
//       headers: { "Content-Type": "multipart/form-data" },
//     });
//   },

//   // ──────────────────────────────────────────────────────────

//   // ──────────────────────────────────────────────────────────
//   getVehiclesByType: (type) => {
//     return API.get(`/vehicles/filter`, { params: { type } });
//   },

//   // ──────────────────────────────────────────────────────────
//   // 8. SEARCH VEHICLES (optional search endpoint)
 
//   // ──────────────────────────────────────────────────────────
//   searchVehicles: (searchTerm) => {
//     return API.get(`/vehicles/search`, { params: { q: searchTerm } });
//   },
// };





import API from "@shared/api/http";

// ============================================================
// CLOUDINARY CONFIG — .env se aata hai
// ============================================================
const CLOUDINARY_CLOUD_NAME    = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

/**
 * Direct browser → Cloudinary upload (unsigned preset)
 * Backend ko sirf secure_url bhejo — file kabhi backend pe nahi jaati
 *
 * @param {File} file
 * @param {(percent: number) => void} [onProgress]
 * @returns {Promise<string>} secure_url
 */
export function uploadImageToCloudinary(file, onProgress) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error("No file selected."));
      return;
    }
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      reject(new Error(
        "Cloudinary not configured. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in .env"
      ));
      return;
    }

    const url      = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
    const formData = new FormData();
    formData.append("file",           file);
    formData.append("upload_preset",  CLOUDINARY_UPLOAD_PRESET);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);

    // Progress callback
    xhr.upload.onprogress = (event) => {
      if (typeof onProgress === "function" && event.lengthComputable) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      let payload = null;
      try { payload = JSON.parse(xhr.responseText); } catch { payload = null; }

      if (xhr.status >= 200 && xhr.status < 300 && payload?.secure_url) {
        resolve(payload.secure_url);
      } else {
        reject(new Error(
          payload?.error?.message || `Upload failed (status ${xhr.status}). Try again.`
        ));
      }
    };

    xhr.onerror = () => reject(new Error("Network error during upload."));
    xhr.onabort = () => reject(new Error("Upload cancelled."));

    xhr.send(formData);
  });
}

// ============================================================
// RESPONSE NORMALIZER
// ============================================================
export function normalizeVehicleList(responseData) {
  if (Array.isArray(responseData))                          return responseData;
  if (responseData && Array.isArray(responseData.data))     return responseData.data;
  if (responseData && Array.isArray(responseData.vehicles)) return responseData.vehicles;
  return [];
}

// ============================================================
// TRANSFORMER: Frontend formData → Backend DTO
// ============================================================
function transformVehicleData(formData) {
  return {
    name        : formData.name?.trim(),
    type        : formData.type?.trim(),
    capacity    : formData.capacity !== "" && formData.capacity != null
                    ? Number(formData.capacity)
                    : null,
    description : formData.description?.trim() || "",
    // imagePath = Cloudinary secure_url (already uploaded)
    imagePath   : formData.imagePath || null,
  };
}

// ============================================================
// REVERSE TRANSFORMER: Backend response → Frontend formData
// ============================================================
export function transformVehicleResponse(backendData) {
  return {
    name         : backendData.name        ?? "",
    type         : backendData.type        ?? "",
    capacity     : backendData.capacity    != null
                     ? backendData.capacity.toString()
                     : "",
    description  : backendData.description ?? "",
    image        : backendData.imagePath   ?? backendData.image ?? null,
    imagePreview : backendData.imagePath   ?? backendData.image ?? null,
    imagePath    : backendData.imagePath   ?? backendData.image ?? null,
  };
}

// ============================================================
// VEHICLE SERVICE
// ============================================================
export const vehicleService = {

  // 1. GET ALL
  getAllVehicles: () =>
    API.get("/vehicles"),

  // 2. GET BY ID
  getVehicleById: (publicId) =>
    API.get(`/vehicles/${publicId}`),

  // 3. CREATE — imagePath already in formData (from Cloudinary)
  createVehicle: (formData) =>
    API.post("/vehicles", transformVehicleData(formData)),

  // 4. UPDATE
  updateVehicle: (publicId, formData) =>
    API.put(`/vehicles/${publicId}`, transformVehicleData(formData)),

  // 5. DELETE
  deleteVehicle: (publicId) =>
    API.delete(`/vehicles/${publicId}`),

  // 6. FILTER BY TYPE
  getVehiclesByType: (type) =>
    API.get("/vehicles/filter", { params: { type } }),

  // 7. SEARCH
  searchVehicles: (searchTerm) =>
    API.get("/vehicles/search", { params: { q: searchTerm } }),
};