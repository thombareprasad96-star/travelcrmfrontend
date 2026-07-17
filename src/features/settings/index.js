// src/features/settings/index.js
// Public API of the settings feature.
// companyService is exported because dashboard and profile/CompanyProfile
// legitimately read company data.

export { default as CompanySettings } from "./pages/CompanySettings";
export { default as EmailConfiguration } from "./pages/EmailConfiguration";
export { default as WhatsAppConfiguration } from "./pages/WhatsAppConfiguration";
export { default as LeadSources } from "./pages/LeadSources";
export { companyService, taxRateService } from "./api/companyService";
export { leadSourceService } from "./api/leadSourceService";
