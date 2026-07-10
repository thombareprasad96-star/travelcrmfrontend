import axios from "axios";
import { createAuthRealm, matchesAuthPath } from "@shared/api/authRealm";
import { getConsoleToken, clearConsoleSession } from "../lib/consoleAuth";

/**
 * Axios instance for the platform console. Separate from the tenant app's shared `http.js`:
 * it attaches the console token ("sa_token") and, on an expired/invalid session, redirects to
 * the CONSOLE login (never the tenant login).
 *
 * It gets its own auth realm for exactly that reason — a single shared logout latch would let a
 * tenant-app 401 bounce a console tab to `/login`.
 *
 * No `onMaintenance` handler: the console is the surface an operator uses to turn maintenance mode
 * back OFF, so it must never render the maintenance overlay. (The backend also exempts platform
 * traffic — MaintenanceModeFilter only gates requests that carry a tenantId.)
 */
const CONSOLE_LOGIN = "/superadmin/login";
const ConsoleAPI = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
  timeout: 30000,
  headers: { "Content-Type": "application/json", Accept: "application/json" },
});

ConsoleAPI.interceptors.request.use((config) => {
  const token = getConsoleToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const consoleRealm = createAuthRealm({
  loginPath: CONSOLE_LOGIN,
  // Auth calls (login) surface 401 as "wrong credentials" for the caller to handle — don't redirect.
  isAuthUrl: (url) => matchesAuthPath(url),
  clearSession: clearConsoleSession,
});

ConsoleAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    consoleRealm.handleError(error);
    return Promise.reject(error);
  }
);

/** Unwrap the ApiResponse envelope: `res.data.data ?? res.data`. */
export const unwrap = (res) => res?.data?.data ?? res?.data;

export default ConsoleAPI;