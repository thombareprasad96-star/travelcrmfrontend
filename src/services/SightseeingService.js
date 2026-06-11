import axios from "axios";

// ============================================================
// Backend API Base URL Setup
// ============================================================
const API = axios.create({
  baseURL: "http://localhost:8080/api/sightseeings",
  headers: { "Content-Type": "application/json" },
});

// ============================================================
// JWT Token Interceptor
// ============================================================
API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("token");
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
  },
  (error) => Promise.reject(error)
);

// ============================================================
// TRANSFORMER: Frontend form state  ➜  Backend DTO
//
// AddSightseeingModal ka form shape:
// {
//   destination, city, title, sequence, estimatedHours,
//   suggestedStartTime, image (File object), description (HTML), remarks (HTML)
// }
// ============================================================
export function transformSightseeingData(formData) {
  return {
    // form.destination       → Destination select
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

    // imagePath upload ke baad milti hai — uploadSightseeingImage() se set hoti hai
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
    city:               backendData.city              ?? "",
    title:              backendData.title             ?? "",
    sequence:           backendData.sequence          != null
      ? backendData.sequence.toString()               // number input expects string
      : "1",
    estimatedHours:     backendData.estimatedHours    != null
      ? backendData.estimatedHours.toString()
      : "",
    suggestedStartTime: backendData.suggestedStartTime ?? "",
    description:        backendData.description        ?? "",
    remarks:            backendData.remarks            ?? "",

    // image fields
    image:              null,                         // File object — edit mein nahi rehta
    imagePath:          backendData.imagePath         ?? null,
    imagePreview:       backendData.imagePath         ?? null, // preview ke liye URL use
  };
}

// ============================================================
// DESTINATION SERVICE — destinations list ke liye
// SightseeingMaster page pe accordion aur dropdowns ke liye
// ============================================================
const DEST_API = axios.create({
  baseURL: "http://localhost:8080/api/destinations",
  headers: { "Content-Type": "application/json" },
});

DEST_API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("token");
    if (token) req.headers.Authorization = `Bearer ${token}`;
    return req;
  },
  (error) => Promise.reject(error)
);

export const destinationService = {
  // Destinations accordion ke liye — id, name, attractions count, cities list
  getAllDestinations: () => DEST_API.get("/"),

  // City dropdown ke liye — specific destination ki cities
  getCitiesByDestination: (destinationName) =>
    DEST_API.get(`/cities`, { params: { destination: destinationName } }),
};

// ============================================================
// SIGHTSEEING SERVICE — all API methods
// ============================================================
export const sightseeingService = {

  // ──────────────────────────────────────────────────────────
  // 1. GET ALL SIGHTSEEINGS
  //    Page load par destinations ke saath attractions load karne ke liye
  // ──────────────────────────────────────────────────────────
  getAllSightseeings: () => {
    return API.get("/");
  },

  // ──────────────────────────────────────────────────────────
  // 2. GET BY DESTINATION
  //    DestinationRow expand hone par us destination ki
  //    attractions load karne ke liye
  // ──────────────────────────────────────────────────────────
  getSightseeingsByDestination: (destination) => {
    return API.get("/", { params: { destination } });
  },

  // ──────────────────────────────────────────────────────────
  // 3. GET BY DESTINATION + CITY
  //    City filter ke saath attractions fetch karne ke liye
  // ──────────────────────────────────────────────────────────
  getSightseeingsByCity: (destination, city) => {
    return API.get("/", { params: { destination, city } });
  },

  // ──────────────────────────────────────────────────────────
  // 4. GET SIGHTSEEING BY ID
  //    Edit modal open karne se pehle fresh data fetch
  // ──────────────────────────────────────────────────────────
  getSightseeingById: (id) => {
    return API.get(`/${id}`);
  },

  // ──────────────────────────────────────────────────────────
  // 5. CREATE SIGHTSEEING
  //    Modal ka "Save Sightseeing" button press hone par
  //    Pehle image upload karo (agar hai toh), phir create karo
  // ──────────────────────────────────────────────────────────
  createSightseeing: (formData) => {
    const mappedData = transformSightseeingData(formData);
    return API.post("/", mappedData);
  },

  // ──────────────────────────────────────────────────────────
  // 6. UPDATE SIGHTSEEING
  //    Edit mode mein save karne par
  // ──────────────────────────────────────────────────────────
  updateSightseeing: (id, formData) => {
    const mappedData = transformSightseeingData(formData);
    return API.put(`/${id}`, mappedData);
  },

  // ──────────────────────────────────────────────────────────
  // 7. DELETE SIGHTSEEING
  //    List row ka delete button
  // ──────────────────────────────────────────────────────────
  deleteSightseeing: (id) => {
    return API.delete(`/${id}`);
  },

  // ──────────────────────────────────────────────────────────
  // 8. UPLOAD ATTRACTION IMAGE
  //    handleFile() ke baad call karo —
  //    Returns { imagePath: "https://..." }
  //    imagePath wapas formData mein set karo taaki save pe bheja jaye
  // ──────────────────────────────────────────────────────────
  uploadSightseeingImage: (imageFile) => {
    const formData = new FormData();
    formData.append("file", imageFile);
    return API.post("/upload-image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // ──────────────────────────────────────────────────────────
  // 9. SEARCH SIGHTSEEINGS
  //    Search input ke liye — agar backend search chahiye
  //    Warna frontend filtering already component mein hai
  // ──────────────────────────────────────────────────────────
  searchSightseeings: (query) => {
    return API.get("/search", { params: { q: query } });
  },
};