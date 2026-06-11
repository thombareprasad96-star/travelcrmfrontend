import axios from "axios";

// ============================================================
// Backend API Base URL Setup
// ============================================================
const API = axios.create({
  // Verify and adjust your actual Java Spring Boot backend URL here
  baseURL: "http://localhost:8080/api/vehicles",
  headers: { "Content-Type": "application/json" },
});

// ============================================================
// JWT Token Interceptor
// Reads token from localStorage and attaches to every request
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
// RESPONSE NORMALIZER

// ============================================================
export function normalizeVehicleList(responseData) {
  if (Array.isArray(responseData)) {
    return responseData;
  }
  if (responseData && Array.isArray(responseData.data)) {
    return responseData.data;
  }
  if (responseData && Array.isArray(responseData.vehicles)) {
    return responseData.vehicles;
  }
  return [];
}

// ============================================================
// TRANSFORMER: Frontend formData  ➜  Backend DTO

// ============================================================
function transformVehicleData(formData) {
  return {
    // form.name        → Vehicle Name input (required)
    name:        formData.name?.trim(),

    // form.type        → Vehicle Type input (required) e.g. "SUV", "Bus"
    type:        formData.type?.trim(),

    // form.capacity    → Capacity input (number) — string se number convert
    capacity:    formData.capacity !== "" && formData.capacity != null
      ? Number(formData.capacity)
      : null,

    // form.description → Description textarea
    description: formData.description?.trim() || "",

   
    imagePath:   formData.imagePath || null,

   
    createdAt:   new Date().toISOString().slice(0, 10),
  };
}

// ============================================================
// REVERSE TRANSFORMER: Backend response  ➜  Frontend formData
//

// ============================================================
export function transformVehicleResponse(backendData) {
  return {
    name:         backendData.name         ?? "",
    type:         backendData.type         ?? "",
    capacity:     backendData.capacity     != null
      ? backendData.capacity.toString()                // number input expects string
      : "",
    description:  backendData.description  ?? "",

   
    image:        backendData.imagePath    ?? backendData.image ?? null,
    imagePreview: backendData.imagePath    ?? backendData.image ?? null,

    // imagePath alag rakhte hain taaki save ke waqt wapas bhej sakein
    imagePath:    backendData.imagePath    ?? backendData.image ?? null,
  };
}

// ============================================================
// VEHICLE SERVICE — all API methods
// ============================================================
export const vehicleService = {

  // ──────────────────────────────────────────────────────────
  // 1. GET ALL VEHICLES

  // ──────────────────────────────────────────────────────────
  getAllVehicles: () => {
    return API.get("/");
  },

  // ──────────────────────────────────────────────────────────
  // 2. GET VEHICLE BY ID
 
  // ──────────────────────────────────────────────────────────
  getVehicleById: (id) => {
    return API.get(`/${id}`);
  },

  // ──────────────────────────────────────────────────────────
  // 3. CREATE VEHICLE

  // ──────────────────────────────────────────────────────────
  createVehicle: (formData) => {
    const mappedData = transformVehicleData(formData);
    return API.post("/", mappedData);
  },

  // ──────────────────────────────────────────────────────────
  // 4. UPDATE VEHICLE
  
  // ──────────────────────────────────────────────────────────
  updateVehicle: (id, formData) => {
    const mappedData = transformVehicleData(formData);
    return API.put(`/${id}`, mappedData);
  },

  // ──────────────────────────────────────────────────────────
  // 5. DELETE VEHICLE

  // ──────────────────────────────────────────────────────────
  deleteVehicle: (id) => {
    return API.delete(`/${id}`);
  },

  // ──────────────────────────────────────────────────────────
  // 6. UPLOAD VEHICLE IMAGE

  //    Returns: { data: { imagePath: "https://..." } }
 
  // ──────────────────────────────────────────────────────────
  uploadVehicleImage: (imageFile) => {
    const formData = new FormData();

    formData.append("file", imageFile);

    return API.post("/upload-image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // ──────────────────────────────────────────────────────────

  // ──────────────────────────────────────────────────────────
  getVehiclesByType: (type) => {
    return API.get(`/filter`, { params: { type } });
  },

  // ──────────────────────────────────────────────────────────
  // 8. SEARCH VEHICLES (optional search endpoint)
 
  // ──────────────────────────────────────────────────────────
  searchVehicles: (searchTerm) => {
    return API.get(`/search`, { params: { q: searchTerm } });
  },
};