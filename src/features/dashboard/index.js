// src/features/dashboard/index.js
// Public API of the dashboard feature.
// Dashboard owns analytics data and still reads operations data from neighboring features.

export { default as dashboardService } from "./api/dashboardService";
export { default as Dashboard } from "./pages/Dashboard";
