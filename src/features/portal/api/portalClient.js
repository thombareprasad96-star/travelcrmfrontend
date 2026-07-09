// src/features/portal/api/portalClient.js
//
// Dedicated axios instance for the customer-facing Traveler Portal.
// It uses its OWN token key ("travelerToken") so it NEVER collides with the
// staff app's "token" (@shared/api/http). On a 401 outside the login flow it
// clears the traveler session and bounces to /portal/login — mirroring the
// staff client's behaviour for its own realm.

import axios from "axios";

export const TRAVELER_TOKEN_KEY = "travelerToken";
export const TRAVELER_NAME_KEY = "travelerName";

const portalClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

/* ── REQUEST: attach the traveler JWT if present ─────────────────────────── */
portalClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TRAVELER_TOKEN_KEY);
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

/* ── RESPONSE: 401 → drop session + go to portal login ───────────────────── */
portalClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    // The OTP endpoints legitimately return 401 (bad / expired code) — let the
    // login page render that inline instead of redirecting mid-flow.
    const isAuthCall = (error.config?.url || "").includes("/portal/auth/");
    if (status === 401 && !isAuthCall) {
      localStorage.removeItem(TRAVELER_TOKEN_KEY);
      localStorage.removeItem(TRAVELER_NAME_KEY);
      if (!window.location.pathname.startsWith("/portal/login")) {
        window.location.href = "/portal/login";
      }
    }
    return Promise.reject(error);
  }
);

export default portalClient;