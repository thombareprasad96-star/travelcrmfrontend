import axios from "axios";

// Base API instance setup
const API = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: { "Content-Type": "application/json" },
});

// Transform React form data → Java DTO shape for City
function transformCityData(country, name, code) {
  return {
    country: country,
    name: name,
    code: code ? code.toUpperCase() : "", // Airport code ko hamesha uppercase me bhejna better practice hai
    status: "Active" // Optional: Agar backend status expect karta hai
  };
}

// Service Object export for City CRUD operations
export const cityService = {
      
  // 1. Nayi city create karne ke liye (POST Request)
  createCity: (country, name, code) => 
    API.post("/cities", transformCityData(country, name, code)),

  // 2. Saari cities fetch karne ke liye (GET Request)
  getAllCities: () => 
    API.get("/cities"),

  // 3. Kisi specific city ko delete karne ke liye (DELETE Request)
  deleteCity: (id) => 
    API.delete(`/cities/${id}`),

  // 4. Kisi city ko update karne ke liye (PUT Request)
  updateCity: (id, country, name, code) => 
    API.put(`/cities/${id}`, transformCityData(country, name, code)),
};  