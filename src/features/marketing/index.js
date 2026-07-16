// src/features/marketing/index.js
// Public surface of the Marketing & Campaigns feature. The router picks named
// exports off this barrel (lazyPage) so the feature boundary holds.
export { default as MarketingDashboard } from "./pages/MarketingDashboard";
export { default as Segments } from "./pages/Segments";
export { default as Campaigns } from "./pages/Campaigns";
export { default as DripSequences } from "./pages/DripSequences";
export { default as Automations } from "./pages/Automations";