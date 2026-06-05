// src/services/axiosInstance.js

import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

/* ── REQUEST INTERCEPTOR ──────────────────────────────────────
   Attach JWT token to every request if available in localStorage
─────────────────────────────────────────────────────────────── */
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* ── RESPONSE INTERCEPTOR ─────────────────────────────────────
   Handle global errors: 401 redirect, 403 forbidden, 500 etc.
─────────────────────────────────────────────────────────────── */
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const status  = error.response?.status;
    const message = error.response?.data?.message || "Something went wrong.";

    if (status === 401) {
      // Token expired or invalid — redirect to login
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    if (status === 403) {
      console.error("Access denied:", message);
    }

    if (status === 500) {
      console.error("Server error:", message);
    }

    console.error(`API Error [${status}]:`, message);
    return Promise.reject(error);
  }
);

export default API;