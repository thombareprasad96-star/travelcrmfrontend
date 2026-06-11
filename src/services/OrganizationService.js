import axios from "axios";

// ==========================================================
// 🌐 BACKEND API BASE URL SETUP
// ==========================================================
const API = axios.create({
  // Verify and adjust your actual Java backend URL here
  baseURL: "http://localhost:8080/api/organizations", 
  headers: { "Content-Type": "application/json" },
});

// ==========================================================
// 👉 JWT TOKEN INTERCEPTOR
// ==========================================================
// Extracts the token from localStorage and adds it to the Authorization header
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

// ==========================================================
// 🌟 DATA TRANSFORMER: Frontend to Backend Format
// ==========================================================
function transformOrganizationData(frontendData) {
  return {
    // Left: Keys expected by your Java Spring Boot JSON Payload
    // Right: Variables from your React Form State
    
    // Organization Details
    organizationName: frontendData.organizationName,
    organizationCode: frontendData.organizationCode,
    email: frontendData.email,
    phone: frontendData.phone,
    address: frontendData.address,
    
    // Subscription Details
    subscriptionStartDate: frontendData.subscriptionStartDate,
    subscriptionEndDate: frontendData.subscriptionEndDate,
    
    // Default Admin Credentials
    adminUsername: frontendData.adminUsername,
    adminEmail: frontendData.adminEmail,
    adminPassword: frontendData.adminPassword
  };
}

// ==========================================================
// 🚀 API METHODS FOR ORGANIZATION
// ==========================================================
export const organizationService = {
  
  // 1. REGISTER NEW ORGANIZATION
  // This matches your exact JSON payload structure
  registerOrganization: (formData) => {
    const mappedData = transformOrganizationData(formData);
    return API.post("/register", mappedData);
  },

  // 2. GET ALL ORGANIZATIONS (For Super Admin Dashboard)
  getAllOrganizations: () => {
    return API.get("/");
  },

  // 3. GET ORGANIZATION BY ID
  getOrganizationById: (id) => {
    return API.get(`/${id}`);
  },

  // 4. UPDATE ORGANIZATION DETAILS
  updateOrganization: (id, formData) => {
    // You might need a different transformer here if you don't update passwords/admin details on this route
    const mappedData = transformOrganizationData(formData); 
    return API.put(`/${id}`, mappedData);
  },

  // 5. UPDATE SUBSCRIPTION STATUS/DATES
  updateSubscription: (id, subscriptionData) => {
    return API.patch(`/${id}/subscription`, {
      subscriptionStartDate: subscriptionData.startDate,
      subscriptionEndDate: subscriptionData.endDate
    });
  },

  // 6. DELETE / DEACTIVATE ORGANIZATION
  deleteOrganization: (id) => {
    return API.delete(`/${id}`);
  }
};