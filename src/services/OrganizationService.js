




import API from "@shared/api/http";

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

// const adminUsername=localStorage.getItem("adminUsername");
// console.log(adminUsername)
// ==========================================================
// 🚀 API METHODS FOR ORGANIZATION
// ==========================================================
export const organizationService = {
  
  // 1. REGISTER NEW ORGANIZATION
  registerOrganization: (formData) => {
    const mappedData = transformOrganizationData(formData);
    return API.post("/super-admin/tenants", mappedData);
  },

  // 2. GET ALL ORGANIZATIONS (For Super Admin Dashboard)
  getAllOrganizations: () => {
    return API.get("/super-admin/tenants");
  },

  // 3. GET ORGANIZATION BY ID
  getOrganizationById: (id) => {
    return API.get(`/super-admin/tenants/${id}`);
  },

  // 4. UPDATE ORGANIZATION DETAILS
  updateOrganization: (id, formData) => {
    const mappedData = transformOrganizationData(formData); 
    return API.put(`/super-admin/tenants/${id}`, mappedData);
  },

  // 5. UPDATE SUBSCRIPTION STATUS/DATES
  updateSubscription: (id, subscriptionData) => {
    return API.patch(`/super-admin/tenants/${id}/subscription`, {
      subscriptionStartDate: subscriptionData.startDate,
      subscriptionEndDate: subscriptionData.endDate
    });
  },

  // 6. DELETE / DEACTIVATE ORGANIZATION
  deleteOrganization: (id) => {
    return API.delete(`/super-admin/tenants/${id}`);
  }
};