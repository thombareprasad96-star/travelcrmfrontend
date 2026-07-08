// src/features/profile/index.js
// Public API of the profile (users & permissions) feature.
// profileUserService is exported for the dashboard aggregation page.

export { default as Users } from "./pages/Users";
export { default as CreateUser } from "./pages/CreateUser";
export { default as EditUser } from "./pages/EditUser";
export { default as UserPermissions } from "./pages/UserPermissions";
export { default as PermissionTemplates } from "./pages/PermissionTemplates";
export { default as CreatePermissionTemplate } from "./pages/CreatePermissionTemplate";
export { default as CompanyProfile } from "./pages/CompanyProfile";
export { default as ChangePassword } from "./pages/ChangePassword";
export { default as profileUserService } from "./api/profileUserService";
