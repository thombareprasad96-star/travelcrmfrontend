// src/features/portal/api/portalClient.js
//
// Dedicated axios instance for the customer-facing Traveler Portal.
// It uses its OWN token key ("travelerToken") so it NEVER collides with the
// staff app's "token" (@shared/api/http). On a 401 outside the login flow it
// clears the traveler session and bounces to /portal/login — mirroring the
// staff client's behaviour for its own realm.
//
// The realm separation is the point: a traveler's expired session must never redirect a staff tab,
// and vice versa. Each realm owns its own logout latch, so parallel 401s produce one redirect each.

import axios from "axios";
import { createAuthRealm, matchesAuthPath } from "@shared/api/authRealm";

export const TRAVELER_TOKEN_KEY = "travelerToken";
export const TRAVELER_NAME_KEY = "travelerName";

const portalClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
  timeout: 30000,
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

/* ── ERROR POLICY: 401 → drop session + go to portal login ───────────────── */
const portalRealm = createAuthRealm({
  loginPath: "/portal/login",
  // The OTP endpoints legitimately return 401 (bad / expired code) — let the login page render that
  // inline instead of redirecting mid-flow.
  isAuthUrl: (url) => matchesAuthPath(url, "portal/auth"),
  clearSession: () => {
    localStorage.removeItem(TRAVELER_TOKEN_KEY);
    localStorage.removeItem(TRAVELER_NAME_KEY);
  },
});

portalClient.interceptors.response.use(
  (response) => response,
  (error) => {
    portalRealm.handleError(error);
    return Promise.reject(error);
  }
);

export default portalClient;