// src/features/accounting/index.js
// Public surface of the Accounting / GST feature. The router picks named exports
// off this barrel (lazyPage) so the feature boundary holds — pages stay private.
export { default as AccountingDashboard } from "./pages/AccountingDashboard";
export { default as Invoices } from "./pages/Invoices";
export { default as VendorBills } from "./pages/VendorBills";
export { default as AccountingReports } from "./pages/AccountingReports";
export { default as AccountingSettings } from "./pages/AccountingSettings";