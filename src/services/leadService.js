// import axios from "axios";

// const API = axios.create({
//   baseURL: "http://localhost:8080/api",
//   headers: { "Content-Type": "application/json" },
// });

// // Transform React form data → Java DTO shape
// function transformFormData(formData, services, itinerary) {
//   return {
//     customerName:  formData.customerName,
//     phone:         formData.phone,
//     email:         formData.email,
//     leadSource:    formData.leadSource,
//     leadType:      formData.leadType,
//     leadStage:     formData.leadStage || "New Lead",
//     assignTo:      formData.assignTo,
//     birthDate:     formData.birthDate || null,
//     travelDate:    formData.travelDate || null,
//     departCountry: formData.departCountry,
//     departCity:    formData.departCity,
//     rooms:         formData.rooms    || 1,
//     adults:        formData.adults   || 1,
//     children:      formData.children || 0,
//     infants:       formData.infants  || 0,
//     extraBeds:     formData.extraBeds|| 0,
//     services:      services,
//     notes:         formData.notes,
//     itinerary:     itinerary.map(({ destination, city, nights }) => ({
//       destination, city, nights
//     })),
//   };
// }

// export const leadService = {
//   createLead: (formData, services, itinerary) =>
//     API.post("/leads", transformFormData(formData, services, itinerary)),

//   searchByPhone: (phone) =>
//     API.get("/leads/search", { params: { phone } }),

//   getAllLeads: () =>
//     API.get("/leads"),
// };




import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: { "Content-Type": "application/json" },
});

// 👉 Attach JWT token automatically to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Transform React form data → Java DTO shape
function transformFormData(formData, services, itinerary) {
  return {
    customerName: formData.customerName,
    phone: formData.phone,
    email: formData.email,
    leadSource: formData.leadSource,
    leadType: formData.leadType,
    leadStage: formData.leadStage || "New Lead",
    assignTo: formData.assignTo,
    birthDate: formData.birthDate || null,
    travelDate: formData.travelDate || null,
    departCountry: formData.departCountry,
    departCity: formData.departCity,
    rooms: formData.rooms || 1,
    adults: formData.adults || 1,
    children: formData.children || 0,
    infants: formData.infants || 0,
    extraBeds: formData.extraBeds || 0,
    services: services,
    notes: formData.notes,
    itinerary: itinerary.map(({ destination, city, nights }) => ({
      destination,
      city,
      nights,
    })),
  };
}

export const leadService = {
  createLead: (formData, services, itinerary) =>
    API.post("/leads", transformFormData(formData, services, itinerary)),

  searchByPhone: (phone) =>
    API.get("/leads/search", { params: { phone } }),

  getAllLeads: () =>
    API.get("/leads"),
};