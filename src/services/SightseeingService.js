// import API from "./axiosInstance";

// // ============================================================
// // TRANSFORMER: Frontend form state  ➜  Backend DTO
// //
// // AddSightseeingModal ka form shape:
// // {
// //   destination, city, title, sequence, estimatedHours,
// //   suggestedStartTime, image (File object), description (HTML), remarks (HTML)
// // }
// // ============================================================
// export function transformSightseeingData(formData) {
//   return {
//     // form.destination       → Destination select
//     destination:        formData.destination?.trim(),

//     // form.city              → City select (destination se dependent)
//     city:               formData.city?.trim(),

//     // form.title             → Title input (required)
//     title:              formData.title?.trim(),

//     // form.sequence          → Sequence number input — string se number
//     sequence:           formData.sequence !== "" && formData.sequence != null
//       ? parseInt(formData.sequence)
//       : 1,

//     // form.estimatedHours    → "2.5" jaise string — float mein convert
//     estimatedHours:     formData.estimatedHours !== ""
//       ? parseFloat(formData.estimatedHours)
//       : null,

//     // form.suggestedStartTime → "HH:MM" time input string
//     suggestedStartTime: formData.suggestedStartTime || null,

//     // form.description       → RichTextEditor se aaya HTML string
//     description:        formData.description || "",

//     // form.remarks           → RichTextEditor se aaya HTML string
//     remarks:            formData.remarks || "",

//     // imagePath upload ke baad milti hai — uploadSightseeingImage() se set hoti hai
//     imagePath:          formData.imagePath || null,
//   };
// }

// // ============================================================
// // REVERSE TRANSFORMER: Backend response  ➜  Frontend form state
// // Edit modal kholne par form pre-fill karne ke liye
// // ============================================================
// export function transformSightseeingResponse(backendData) {
//   return {
//     destination:        backendData.destination       ?? "",
//     city:               backendData.city              ?? "",
//     title:              backendData.title             ?? "",
//     sequence:           backendData.sequence          != null
//       ? backendData.sequence.toString()               // number input expects string
//       : "1",
//     estimatedHours:     backendData.estimatedHours    != null
//       ? backendData.estimatedHours.toString()
//       : "",
//     suggestedStartTime: backendData.suggestedStartTime ?? "",
//     description:        backendData.description        ?? "",
//     remarks:            backendData.remarks            ?? "",

//     // image fields
//     image:              null,                         // File object — edit mein nahi rehta
//     imagePath:          backendData.imagePath         ?? null,
//     imagePreview:       backendData.imagePath         ?? null, // preview ke liye URL use
//   };
// }

// // ============================================================
// // DESTINATION SERVICE — destinations list ke liye
// // SightseeingMaster page pe accordion aur dropdowns ke liye
// // ============================================================
// export const destinationService = {
//   // Destinations accordion ke liye — id, name, attractions count, cities list
//   getAllDestinations: () => API.get("/destinations/"),

//   // City dropdown ke liye — specific destination ki cities
//   getCitiesByDestination: (destinationName) =>
//     API.get(`/destinations/cities`, { params: { destination: destinationName } }),
// };

// // ============================================================
// // SIGHTSEEING SERVICE — all API methods
// // ============================================================
// export const sightseeingService = {

//   // ──────────────────────────────────────────────────────────
//   // 1. GET ALL SIGHTSEEINGS
//   //    Page load par destinations ke saath attractions load karne ke liye
//   // ──────────────────────────────────────────────────────────
//   getAllSightseeings: () => {
//     return API.get("/sightseeings/");
//   },

//   // ──────────────────────────────────────────────────────────
//   // 2. GET BY DESTINATION
//   //    DestinationRow expand hone par us destination ki
//   //    attractions load karne ke liye
//   // ──────────────────────────────────────────────────────────
//   getSightseeingsByDestination: (destination) => {
//     return API.get("/sightseeings/", { params: { destination } });
//   },

//   // ──────────────────────────────────────────────────────────
//   // 3. GET BY DESTINATION + CITY
//   //    City filter ke saath attractions fetch karne ke liye
//   // ──────────────────────────────────────────────────────────
//   getSightseeingsByCity: (destination, city) => {
//     return API.get("/sightseeings/", { params: { destination, city } });
//   },

//   // ──────────────────────────────────────────────────────────
//   // 4. GET SIGHTSEEING BY ID
//   //    Edit modal open karne se pehle fresh data fetch
//   // ──────────────────────────────────────────────────────────
//   getSightseeingById: (id) => {
//     return API.get(`/sightseeings/${id}`);
//   },

//   // ──────────────────────────────────────────────────────────
//   // 5. CREATE SIGHTSEEING
//   //    Modal ka "Save Sightseeing" button press hone par
//   //    Pehle image upload karo (agar hai toh), phir create karo
//   // ──────────────────────────────────────────────────────────
//   createSightseeing: (formData) => {
//     const mappedData = transformSightseeingData(formData);
//     return API.post("/sightseeings/", mappedData);
//   },

//   // ──────────────────────────────────────────────────────────
//   // 6. UPDATE SIGHTSEEING
//   //    Edit mode mein save karne par
//   // ──────────────────────────────────────────────────────────
//   updateSightseeing: (id, formData) => {
//     const mappedData = transformSightseeingData(formData);
//     return API.put(`/sightseeings/${id}`, mappedData);
//   },

//   // ──────────────────────────────────────────────────────────
//   // 7. DELETE SIGHTSEEING
//   //    List row ka delete button
//   // ──────────────────────────────────────────────────────────
//   deleteSightseeing: (id) => {
//     return API.delete(`/sightseeings/${id}`);
//   },

//   // ──────────────────────────────────────────────────────────
//   // 8. UPLOAD ATTRACTION IMAGE
//   //    handleFile() ke baad call karo —
//   //    Returns { imagePath: "https://..." }
//   //    imagePath wapas formData mein set karo taaki save pe bheja jaye
//   // ──────────────────────────────────────────────────────────
//   uploadSightseeingImage: (imageFile) => {
//     const formData = new FormData();
//     formData.append("file", imageFile);
//     return API.post("/sightseeings/upload-image", formData, {
//       headers: { "Content-Type": "multipart/form-data" },
//     });
//   },

//   // ──────────────────────────────────────────────────────────
//   // 9. SEARCH SIGHTSEEINGS
//   //    Search input ke liye — agar backend search chahiye
//   //    Warna frontend filtering already component mein hai
//   // ──────────────────────────────────────────────────────────
//   searchSightseeings: (query) => {
//     return API.get("/sightseeings/search", { params: { q: query } });
//   },
// };




import API from "./axiosInstance";

// ============================================================
// ☁️ CLOUDINARY DIRECT UPLOAD
//
// Browser se seedha Cloudinary pe image upload hoti hai (backend
// pe load nahi). Sirf secure_url (https link) wapas milta hai jo
// imagePath ke roop mein backend ko bheja jaata hai.
//
// .env mein yeh hona chahiye (HotelMaster ke liye already set):
//   VITE_CLOUDINARY_CLOUD_NAME=dfjawtgv6
//   VITE_CLOUDINARY_UPLOAD_PRESET=<your_unsigned_preset>
// ============================================================
const CLOUD_NAME    = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

/**
 * Image ko directly Cloudinary pe upload karta hai.
 * @param {File} file        - upload karne wali image file
 * @param {Function} onProgress - (optional) progress % callback (0-100)
 * @returns {Promise<string>} secure_url (Cloudinary https link)
 */
export function uploadSightseeingImageToCloudinary(file, onProgress) {
  return new Promise((resolve, reject) => {
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      reject(new Error(
        "Cloudinary config missing. Add VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET to your .env, then restart the dev server."
      ));
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`);

    // Progress tracking
    if (onProgress) {
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          onProgress(Math.round((e.loaded / e.total) * 100));
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const res = JSON.parse(xhr.responseText);
          resolve(res.secure_url);   // ← yahi imagePath banega
        } catch {
          reject(new Error("Failed to parse Cloudinary response."));
        }
      } else {
        reject(new Error("Cloudinary upload failed. Check your upload preset (must be unsigned)."));
      }
    };

    xhr.onerror = () => reject(new Error("Network error during image upload."));
    xhr.send(formData);
  });
}

// ============================================================
// TRANSFORMER: Frontend form state  ➜  Backend DTO
//
// AddSightseeingModal ka form shape:
// {
//   destination, destinationId, city, title, sequence, estimatedHours,
//   suggestedStartTime, image (File object), description (HTML), remarks (HTML),
//   imagePath (Cloudinary URL)
// }
// ============================================================
export function transformSightseeingData(formData) {
  return {
    // form.destination       → Destination select (NAME — backend isi se kaam karta)
    destination:        formData.destination?.trim(),

    // form.city              → City select (destination se dependent)
    city:               formData.city?.trim(),

    // form.title             → Title input (required)
    title:              formData.title?.trim(),

    // form.sequence          → Sequence number input — string se number
    sequence:           formData.sequence !== "" && formData.sequence != null
      ? parseInt(formData.sequence)
      : 1,

    // form.estimatedHours    → "2.5" jaise string — float mein convert
    estimatedHours:     formData.estimatedHours !== ""
      ? parseFloat(formData.estimatedHours)
      : null,

    // form.suggestedStartTime → "HH:MM" time input string
    suggestedStartTime: formData.suggestedStartTime || null,

    // form.description       → RichTextEditor se aaya HTML string
    description:        formData.description || "",

    // form.remarks           → RichTextEditor se aaya HTML string
    remarks:            formData.remarks || "",

    // ☁️ Cloudinary se aayi image ka secure_url
    imagePath:          formData.imagePath || null,
  };
}

// ============================================================
// REVERSE TRANSFORMER: Backend response  ➜  Frontend form state
// Edit modal kholne par form pre-fill karne ke liye
// ============================================================
export function transformSightseeingResponse(backendData) {
  return {
    destination:        backendData.destination       ?? "",
    // destinationId — cities cascade ke liye (agar backend deta hai)
    destinationId:      backendData.destinationId      != null
      ? backendData.destinationId.toString()
      : "",
    city:               backendData.city              ?? "",
    title:              backendData.title             ?? "",
    sequence:           backendData.sequence          != null
      ? backendData.sequence.toString()
      : "1",
    estimatedHours:     backendData.estimatedHours    != null
      ? backendData.estimatedHours.toString()
      : "",
    suggestedStartTime: backendData.suggestedStartTime ?? "",
    description:        backendData.description        ?? "",
    remarks:            backendData.remarks            ?? "",

    // image fields
    image:              null,                          // File object — edit mein nahi rehta
    imagePath:          backendData.imagePath          ?? null,
    imagePreview:       backendData.imagePath          ?? null, // preview ke liye URL
  };
}

// ============================================================
// DESTINATION SERVICE — destinations list ke liye
// SightseeingMaster page pe accordion aur dropdowns ke liye
// ============================================================
export const destinationService = {
  // Destinations accordion ke liye — id, name, attractions count, cities list
  getAllDestinations: () => API.get("/destinations"),

  // City dropdown ke liye — specific destination ki cities
  getCitiesByDestination: (destinationName) =>
    API.get(`/destinations/cities`, { params: { destination: destinationName } }),
};

// ============================================================
// SIGHTSEEING SERVICE — all API methods
// ============================================================
export const sightseeingService = {

  // ──────────────────────────────────────────────────────────
  // 1. GET ALL SIGHTSEEINGS
  // ──────────────────────────────────────────────────────────
  getAllSightseeings: () => {
    return API.get("/sightseeings");
  },

  // ──────────────────────────────────────────────────────────
  // 1b. GET ALL DESTINATIONS (accordion ke liye)
  // ──────────────────────────────────────────────────────────
  getAllDestinations: () => {
    return API.get("/destinations");
  },

  // ──────────────────────────────────────────────────────────
  // 2. GET BY DESTINATION
  // ──────────────────────────────────────────────────────────
  getSightseeingsByDestination: (destination) => {
    return API.get("/sightseeings", { params: { destination } });
  },

  // ──────────────────────────────────────────────────────────
  // 3. GET BY DESTINATION + CITY
  // ──────────────────────────────────────────────────────────
  getSightseeingsByCity: (destination, city) => {
    return API.get("/sightseeings", { params: { destination, city } });
  },

  // ──────────────────────────────────────────────────────────
  // 4. GET SIGHTSEEING BY ID
  // ──────────────────────────────────────────────────────────
  getSightseeingById: (id) => {
    return API.get(`/sightseeings/${id}`);
  },

  // ──────────────────────────────────────────────────────────
  // 5. CREATE SIGHTSEEING
  //    imagePath already Cloudinary se set ho chuki hoti hai
  // ──────────────────────────────────────────────────────────
  createSightseeing: (formData) => {
    const mappedData = transformSightseeingData(formData);
    return API.post("/sightseeings", mappedData);
  },

  // ──────────────────────────────────────────────────────────
  // 6. UPDATE SIGHTSEEING
  // ──────────────────────────────────────────────────────────
  updateSightseeing: (id, formData) => {
    const mappedData = transformSightseeingData(formData);
    return API.put(`/sightseeings/${id}`, mappedData);
  },

  // ──────────────────────────────────────────────────────────
  // 7. DELETE SIGHTSEEING
  // ──────────────────────────────────────────────────────────
  deleteSightseeing: (id) => {
    return API.delete(`/sightseeings/${id}`);
  },

  // ──────────────────────────────────────────────────────────
  // 8. ☁️ UPLOAD ATTRACTION IMAGE (Cloudinary direct)
  //    handleFile() mein call karo — secure_url wapas milta hai
  //    jo imagePath mein set karna hai
  // ──────────────────────────────────────────────────────────
  uploadSightseeingImage: (imageFile, onProgress) => {
    return uploadSightseeingImageToCloudinary(imageFile, onProgress);
  },

  // ──────────────────────────────────────────────────────────
  // 9. SEARCH SIGHTSEEINGS
  // ──────────────────────────────────────────────────────────
  searchSightseeings: (query) => {
    return API.get("/sightseeings/search", { params: { q: query } });
  },
};

export default sightseeingService;