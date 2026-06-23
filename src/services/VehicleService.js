import API from "./axiosInstance";

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
    return API.get("/vehicles");
  },

  // ──────────────────────────────────────────────────────────
  // 2. GET VEHICLE BY ID
 
  // ──────────────────────────────────────────────────────────
  getVehicleById: (publicId) => {
    return API.get(`/vehicles${publicId}`);
  },

  // ──────────────────────────────────────────────────────────
  // 3. CREATE VEHICLE

  // ──────────────────────────────────────────────────────────
  createVehicle: (formData) => {
    const mappedData = transformVehicleData(formData);
    return API.post("/vehicles", mappedData);
  },

  // ──────────────────────────────────────────────────────────
  // 4. UPDATE VEHICLE
  
  // ──────────────────────────────────────────────────────────
  updateVehicle: (publicId, formData) => {
    const mappedData = transformVehicleData(formData);
    return API.put(`/vehicles/${publicId}`, mappedData);
  },

  // ──────────────────────────────────────────────────────────
  // 5. DELETE VEHICLE

  // ──────────────────────────────────────────────────────────
  deleteVehicle: (publicId) => {
    return API.delete(`/vehicles/${publicId}`);
  },

  // ──────────────────────────────────────────────────────────
  // 6. UPLOAD VEHICLE IMAGE

  //    Returns: { data: { imagePath: "https://..." } }
 
  // ──────────────────────────────────────────────────────────
  uploadVehicleImage: (imageFile) => {
    const formData = new FormData();

    formData.append("file", imageFile);

    return API.post("/vehicles/upload-image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // ──────────────────────────────────────────────────────────

  // ──────────────────────────────────────────────────────────
  getVehiclesByType: (type) => {
    return API.get(`/vehicles/filter`, { params: { type } });
  },

  // ──────────────────────────────────────────────────────────
  // 8. SEARCH VEHICLES (optional search endpoint)
 
  // ──────────────────────────────────────────────────────────
  searchVehicles: (searchTerm) => {
    return API.get(`/vehicles/search`, { params: { q: searchTerm } });
  },
};