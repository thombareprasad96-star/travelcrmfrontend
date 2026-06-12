// src/services/index.js
// ─────────────────────────────────────────────────────────────
// Central export point for all API services.
// Import from here instead of individual files:
//
//   import { customerService, bookingService } from "../services";
//
// ─────────────────────────────────────────────────────────────

export { default as customerService } from "./customerService";
export { default as bookingService  } from "./bookingService";
export { default as API             } from "./axiosInstance";
export { default as vendorService   } from "./vendorService";