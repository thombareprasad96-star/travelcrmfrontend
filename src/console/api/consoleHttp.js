import axios from "axios";
import { getConsoleToken, clearConsoleSession } from "../lib/consoleAuth";

/**
 * Axios instance for the platform console. Separate from the tenant app's shared `http.js`:
 * it attaches the console token ("sa_token") and, on an expired/invalid session, redirects to
 * the CONSOLE login (never the tenant login).
 */
const CONSOLE_LOGIN = "/superadmin/login";
const ConsoleAPI = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
  timeout: 15000,
  headers: { "Content-Type": "application/json", Accept: "application/json" },
});

ConsoleAPI.interceptors.request.use((config) => {
  const token = getConsoleToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

ConsoleAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    // Auth calls (login) surface 401 as "wrong credentials" for the caller to handle —
    // don't redirect on those.
    const isAuthRequest = (error.config?.url || "").includes("auth/");

    if (status === 401 && !isAuthRequest) {
      clearConsoleSession();
      if (!window.location.pathname.startsWith(CONSOLE_LOGIN)) {
        window.location.href = CONSOLE_LOGIN;
      }
    }
    return Promise.reject(error);
  }
);

/** Unwrap the ApiResponse envelope: `res.data.data ?? res.data`. */
export const unwrap = (res) => res?.data?.data ?? res?.data;

export default ConsoleAPI;