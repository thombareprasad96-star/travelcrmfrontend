import axios from "axios";

// Backend API Base URL setup
const API = axios.create({
  // Verify and adjust your actual Java backend URL here
  baseURL: "http://localhost:8080/api/destinations", 
  headers: { "Content-Type": "application/json" },
});

// 👉 JWT Token Interceptor
// This extracts the token from localStorage and adds it to the Authorization header before every request
API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("token");
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ==========================================================
// 🌟 DATA TRANSFORMER: Mapping Frontend data to Backend format
// ==========================================================
function transformDestinationData(frontendData) {
  return {
    // Left side: Variable names expected by Java Spring Boot (Backend)
    // Right side: Variable names from React's formData state (Frontend)
    name: frontendData.name,
    country: frontendData.country,
    type: frontendData.type,
   
    imagePath: frontendData.imagePath,
    inclusions: frontendData.inclusions,
    exclusions: frontendData.exclusions,
    paymentPolicies: frontendData.paymentPolicies,
    cancellationPolicies: frontendData.cancellationPolicies,
    bookingTerms: frontendData.bookingTerms
    
    // If you are sending an array of selected cities, it will be mapped here as well:
    // cities: frontendData.selectedCities 
  };
}

export const destinationService = {
  // 1. GET ALL DESTINATIONS
  getAllDestinations: () => {
    return API.get("/");
  },

  // 2. GET BY ID
  getDestinationById: (id) => {
    return API.get(`/${id}`);
  },

  // 3. CREATE DESTINATION 
  createDestination: (formData) => {
    // 👉 Transform the form data first, then send the request
    const mappedData = transformDestinationData(formData);
    return API.post("/", mappedData);
  },

  // 4. UPDATE DESTINATION
  updateDestination: (id, formData) => {
    // 👉 Data should also be transformed before sending an update request
    const mappedData = transformDestinationData(formData);
    return API.put(`/${id}`, mappedData);
  },

  // 5. DELETE DESTINATION
  deleteDestination: (id) => {
    return API.delete(`/${id}`);
  },

  // 6. UPLOAD IMAGE
  uploadImage: (imageFile) => {
    const formData = new FormData();
    formData.append("file", imageFile);
    
    return API.post("/upload-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
};