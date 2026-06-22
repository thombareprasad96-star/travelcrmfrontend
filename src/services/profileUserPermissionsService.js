// src/services/userPermissionsService.js
// ─────────────────────────────────────────────────────────────
// User Permissions Page — API Service
// Backend: Java Spring Boot REST API
// Database: PostgreSQL
// Covers:
//   1. userPermissionsService — get/update permissions per user
//   2. permissionTemplateService — get/create/apply templates
// ─────────────────────────────────────────────────────────────

import API from "./axiosInstance";


// ═════════════════════════════════════════════════════════════
// 1. USER PERMISSIONS SERVICE
//    Spring Boot Controller: /api/users/{id}/permissions
//    PostgreSQL Table: user_permissions
// ═════════════════════════════════════════════════════════════
export const userPermissionsService = {

  // ── GET ALL PERMISSIONS FOR A USER ─────────────────────────
  // GET /api/users/{userId}/permissions
  // @GetMapping("/api/users/{userId}/permissions")
  // public ResponseEntity<UserPermissionsDTO> getPermissions(
  //     @PathVariable Long userId)
  //
  // Response:
  // {
  //   userId: 34,
  //   pages: 5,
  //   total: 5,
  //   permissions: {
  //     "dashboard_access":  { access: true,  scope: "own" },
  //     "list_leads":        { access: true,  scope: "own" },
  //     "create_lead":       { access: false, scope: "own" },
  //     "edit_lead":         { access: false, scope: "own" },
  //     "view_lead":         { access: true,  scope: "own" },
  //     "delete_lead":       { access: false, scope: "own" },
  //     "my_reminders":      { access: true,  scope: "own" },
  //     "notifications":     { access: true,  scope: "own" },
  //     ...
  //   }
  // }
  getPermissions: (userId) => {
    return API.get(`/users/${userId}/permissions`);
  },

  // ── UPDATE ALL PERMISSIONS FOR A USER (bulk save) ──────────
  // PUT /api/users/{userId}/permissions
  // @PutMapping("/api/users/{userId}/permissions")
  // public ResponseEntity<UserPermissionsDTO> updatePermissions(
  //     @PathVariable Long userId,
  //     @RequestBody UpdatePermissionsRequest request)
  //
  // Request body — the full permissions map from React state:
  // {
  //   permissions: {
  //     "dashboard_access":  { access: true,  scope: "own"  },
  //     "list_leads":        { access: true,  scope: "team" },
  //     "create_lead":       { access: false, scope: "own"  },
  //     "view_lead":         { access: true,  scope: "all"  },
  //     ...
  //   }
  // }
  //
  // Backend logic:
  //   - Upserts each row in user_permissions table
  //   - Returns updated summary (pages count, total count)
  updatePermissions: (userId, permissions) => {
    return API.put(`/users/${userId}/permissions`, { permissions });
  },

  // ── TOGGLE SINGLE PERMISSION ───────────────────────────────
  // PATCH /api/users/{userId}/permissions/{pageId}
  // @PatchMapping("/api/users/{userId}/permissions/{pageId}")
  // public ResponseEntity<PermissionRowDTO> togglePermission(
  //     @PathVariable Long userId,
  //     @PathVariable String pageId,
  //     @RequestBody PermissionPatchRequest request)
  //
  // Request body: { access: true, scope: "own" }
  // Use for immediate single-row update without saving the whole form
  togglePermission: (userId, pageId, access, scope) => {
    return API.patch(`/users/${userId}/permissions/${pageId}`, {
      access,
      scope,
    });
  },

  // ── SELECT ALL ACCESS ──────────────────────────────────────
  // PATCH /api/users/{userId}/permissions/select-all
  // @PatchMapping("/api/users/{userId}/permissions/select-all")
  // public ResponseEntity<UserPermissionsDTO> selectAll(
  //     @PathVariable Long userId)
  //
  // Sets access=true for ALL permission rows of this user
  selectAll: (userId) => {
    return API.patch(`/users/${userId}/permissions/select-all`);
  },

  // ── CLEAR ALL ACCESS ───────────────────────────────────────
  // PATCH /api/users/{userId}/permissions/clear-all
  // @PatchMapping("/api/users/{userId}/permissions/clear-all")
  // public ResponseEntity<UserPermissionsDTO> clearAll(
  //     @PathVariable Long userId)
  //
  // Sets access=false for ALL permission rows of this user
  clearAll: (userId) => {
    return API.patch(`/users/${userId}/permissions/clear-all`);
  },

  // ── SET DATA SCOPE DEFAULT FOR ALL PAGES ───────────────────
  // PATCH /api/users/{userId}/permissions/scope-default
  // @PatchMapping("/api/users/{userId}/permissions/scope-default")
  // public ResponseEntity<UserPermissionsDTO> setScopeDefault(
  //     @PathVariable Long userId,
  //     @RequestBody Map<String, String> body)
  //
  // Body: { scope: "team" }
  // Sets the data scope to the given value for ALL rows
  setScopeDefault: (userId, scope) => {
    return API.patch(`/users/${userId}/permissions/scope-default`, {
      scope,
    });
  },

  // ── TOGGLE ALL IN A SECTION ────────────────────────────────
  // PATCH /api/users/{userId}/permissions/section/{sectionId}
  // @PatchMapping("/api/users/{userId}/permissions/section/{sectionId}")
  // public ResponseEntity<UserPermissionsDTO> toggleSection(
  //     @PathVariable Long userId,
  //     @PathVariable String sectionId,
  //     @RequestBody Map<String, Boolean> body)
  //
  // Body: { access: true }
  // Enables or disables all pages in a section (e.g. "lead_management")
  toggleSection: (userId, sectionId, access) => {
    return API.patch(
      `/users/${userId}/permissions/section/${sectionId}`,
      { access }
    );
  },
};


// ═════════════════════════════════════════════════════════════
// 2. PERMISSION TEMPLATE SERVICE
//    Spring Boot Controller: /api/permission-templates
//    PostgreSQL Table: permission_templates
// ═════════════════════════════════════════════════════════════
export const permissionTemplateService = {

  // ── GET ALL TEMPLATES (for Apply Template dropdown) ────────
  // GET /api/permission-templates
  // @GetMapping("/api/permission-templates")
  // public ResponseEntity<List<PermissionTemplateDTO>> getAll()
  //
  // Response:
  // [
  //   { value: "basic",   label: "Basic Access Only",  permissions: {...} },
  //   { value: "sales",   label: "Sales Team Access",  permissions: {...} },
  //   { value: "support", label: "Support Access",     permissions: {...} },
  //   { value: "full",    label: "Full Access",        permissions: {...} },
  // ]
  getAll: () => {
    return API.get("/permission-templates");
  },

  // ── GET TEMPLATE BY VALUE ──────────────────────────────────
  // GET /api/permission-templates/{value}
  // @GetMapping("/api/permission-templates/{value}")
  // public ResponseEntity<PermissionTemplateDTO> getByValue(
  //     @PathVariable String value)
  //
  // Returns the full permissions map for a specific template
  getByValue: (value) => {
    return API.get(`/permission-templates/${value}`);
  },

  // ── APPLY TEMPLATE TO USER ─────────────────────────────────
  // POST /api/users/{userId}/permissions/apply-template
  // @PostMapping("/api/users/{userId}/permissions/apply-template")
  // public ResponseEntity<UserPermissionsDTO> applyTemplate(
  //     @PathVariable Long userId,
  //     @RequestBody Map<String, String> body)
  //
  // Body: { template: "sales" }
  // Backend clones the template's permissions to the user
  applyTemplate: (userId, templateValue) => {
    return API.post(`/users/${userId}/permissions/apply-template`, {
      template: templateValue,
    });
  },

  // ── SAVE CURRENT USER PERMISSIONS AS A NEW TEMPLATE ────────
  // POST /api/permission-templates
  // @PostMapping("/api/permission-templates")
  // public ResponseEntity<PermissionTemplateDTO> create(
  //     @RequestBody CreateTemplateRequest request)
  //
  // Request body:
  // {
  //   label:       "My Custom Template",
  //   value:       "custom_1",
  //   permissions: { "dashboard_access": { access: true, scope: "own" }, ... }
  // }
  saveAsTemplate: (label, value, permissions) => {
    return API.post("/permission-templates", {
      label,
      value,
      permissions,
    });
  },

  // ── DELETE TEMPLATE ────────────────────────────────────────
  // DELETE /api/permission-templates/{value}
  // @DeleteMapping("/api/permission-templates/{value}")
  // public ResponseEntity<Void> delete(@PathVariable String value)
  delete: (value) => {
    return API.delete(`/permission-templates/${value}`);
  },
};


// ═════════════════════════════════════════════════════════════
// DEFAULT EXPORT
// ═════════════════════════════════════════════════════════════
export default { userPermissionsService, permissionTemplateService };


// ═════════════════════════════════════════════════════════════
// HOW TO USE IN UserPermissions.jsx
// ═════════════════════════════════════════════════════════════
//
// STEP 1 — Import at top of UserPermissions.jsx:
//   import { userPermissionsService, permissionTemplateService }
//     from "../services/userPermissionsService";
//
// ─────────────────────────────────────────────────────────────
// STEP 2 — Replace mock useEffect to load user + permissions:
//
//   useEffect(() => {
//     setLoading(true);
//     Promise.all([
//       editUserService.getById(id),
//       userPermissionsService.getPermissions(id),
//       permissionTemplateService.getAll(),
//     ])
//       .then(([userRes, permRes, templatesRes]) => {
//         setUser(userRes.data);
//         setPermissions(permRes.data.permissions);  // already { pageId: { access, scope } }
//         setTemplates(templatesRes.data);
//       })
//       .catch(() => showToast("Failed to load permissions.", "error"))
//       .finally(() => setLoading(false));
//   }, [id]);
//
// ─────────────────────────────────────────────────────────────
// STEP 3 — Replace handleSave:
//
//   const handleSave = async () => {
//     setSaving(true);
//     try {
//       await userPermissionsService.updatePermissions(id, permissions);
//       showToast("Permissions saved successfully! ✅");
//     } catch (err) {
//       showToast(
//         err?.response?.data?.message || "Failed to save permissions.",
//         "error"
//       );
//     } finally {
//       setSaving(false);
//     }
//   };
//
// ─────────────────────────────────────────────────────────────
// STEP 4 — Replace handleSelectAll:
//
//   const handleSelectAll = async () => {
//     try {
//       const res = await userPermissionsService.selectAll(id);
//       setPermissions(res.data.permissions);
//       showToast("All permissions enabled.");
//     } catch {
//       showToast("Failed to update.", "error");
//     }
//   };
//
// ─────────────────────────────────────────────────────────────
// STEP 5 — Replace handleClearAll:
//
//   const handleClearAll = async () => {
//     try {
//       const res = await userPermissionsService.clearAll(id);
//       setPermissions(res.data.permissions);
//       showToast("All permissions cleared.");
//     } catch {
//       showToast("Failed to update.", "error");
//     }
//   };
//
// ─────────────────────────────────────────────────────────────
// STEP 6 — Replace handleApplyScopeDefault:
//
//   const handleApplyScopeDefault = async (scope) => {
//     setScopeDefault(scope);
//     try {
//       const res = await userPermissionsService.setScopeDefault(id, scope);
//       setPermissions(res.data.permissions);
//       showToast(`Data scope set to "${scope}" for all pages.`);
//     } catch {
//       showToast("Failed to update scope.", "error");
//     }
//   };
//
// ─────────────────────────────────────────────────────────────
// STEP 7 — Replace handleApplyTemplate:
//
//   const handleApplyTemplate = async (templateValue) => {
//     if (!templateValue) return;
//     setTemplate(templateValue);
//     try {
//       const res = await permissionTemplateService.applyTemplate(id, templateValue);
//       setPermissions(res.data.permissions);
//       showToast(`Template applied successfully.`);
//     } catch {
//       showToast("Failed to apply template.", "error");
//     }
//   };
//
// ─────────────────────────────────────────────────────────────
// STEP 8 — Replace "Save as Template" button handler:
//
//   const handleSaveAsTemplate = async () => {
//     const label = prompt("Enter template name:");
//     if (!label) return;
//     const value = label.toLowerCase().replace(/\s+/g, "_");
//     try {
//       await permissionTemplateService.saveAsTemplate(label, value, permissions);
//       showToast(`Template "${label}" saved.`);
//     } catch {
//       showToast("Failed to save template.", "error");
//     }
//   };
//
// ─────────────────────────────────────────────────────────────
// STEP 9 — Replace handleToggleAll (section enable/disable):
//
//   const handleToggleAll = async (section, enable) => {
//     // Optimistic UI update first
//     setPermissions(prev => {
//       const next = { ...prev };
//       section.pages.forEach(pg => { next[pg.id] = { ...next[pg.id], access: enable }; });
//       return next;
//     });
//     try {
//       await userPermissionsService.toggleSection(id, section.id, enable);
//     } catch {
//       showToast("Failed to update section.", "error");
//       // Rollback on failure by re-fetching
//       userPermissionsService.getPermissions(id).then(res => setPermissions(res.data.permissions));
//     }
//   };
//
// ═════════════════════════════════════════════════════════════
// SPRING BOOT JAVA BACKEND — FULL REFERENCE
// ═════════════════════════════════════════════════════════════
//
// ── UserPermissionController.java ────────────────────────────
//
//   @RestController
//   @RequestMapping("/api/users/{userId}/permissions")
//   @CrossOrigin(origins = "http://localhost:3000")
//   public class UserPermissionController {
//
//       @Autowired private UserPermissionService service;
//
//       @GetMapping
//       public ResponseEntity<UserPermissionsDTO> getPermissions(
//           @PathVariable Long userId) {
//           return ResponseEntity.ok(service.getPermissions(userId));
//       }
//
//       @PutMapping
//       public ResponseEntity<UserPermissionsDTO> updatePermissions(
//           @PathVariable Long userId,
//           @RequestBody UpdatePermissionsRequest request) {
//           return ResponseEntity.ok(service.updateAll(userId, request.getPermissions()));
//       }
//
//       @PatchMapping("/{pageId}")
//       public ResponseEntity<PermissionRowDTO> togglePermission(
//           @PathVariable Long userId,
//           @PathVariable String pageId,
//           @RequestBody PermissionPatchRequest request) {
//           return ResponseEntity.ok(service.toggleOne(userId, pageId, request));
//       }
//
//       @PatchMapping("/select-all")
//       public ResponseEntity<UserPermissionsDTO> selectAll(
//           @PathVariable Long userId) {
//           return ResponseEntity.ok(service.setAllAccess(userId, true));
//       }
//
//       @PatchMapping("/clear-all")
//       public ResponseEntity<UserPermissionsDTO> clearAll(
//           @PathVariable Long userId) {
//           return ResponseEntity.ok(service.setAllAccess(userId, false));
//       }
//
//       @PatchMapping("/scope-default")
//       public ResponseEntity<UserPermissionsDTO> setScopeDefault(
//           @PathVariable Long userId,
//           @RequestBody Map<String, String> body) {
//           return ResponseEntity.ok(service.setScopeDefault(userId, body.get("scope")));
//       }
//
//       @PatchMapping("/section/{sectionId}")
//       public ResponseEntity<UserPermissionsDTO> toggleSection(
//           @PathVariable Long userId,
//           @PathVariable String sectionId,
//           @RequestBody Map<String, Boolean> body) {
//           return ResponseEntity.ok(service.toggleSection(userId, sectionId, body.get("access")));
//       }
//
//       @PostMapping("/apply-template")
//       public ResponseEntity<UserPermissionsDTO> applyTemplate(
//           @PathVariable Long userId,
//           @RequestBody Map<String, String> body) {
//           return ResponseEntity.ok(service.applyTemplate(userId, body.get("template")));
//       }
//   }
//
// ── PermissionTemplateController.java ────────────────────────
//
//   @RestController
//   @RequestMapping("/api/permission-templates")
//   @CrossOrigin(origins = "http://localhost:3000")
//   public class PermissionTemplateController {
//
//       @Autowired private PermissionTemplateService service;
//
//       @GetMapping
//       public ResponseEntity<List<PermissionTemplateDTO>> getAll() {
//           return ResponseEntity.ok(service.getAll());
//       }
//
//       @GetMapping("/{value}")
//       public ResponseEntity<PermissionTemplateDTO> getByValue(
//           @PathVariable String value) {
//           return ResponseEntity.ok(service.getByValue(value));
//       }
//
//       @PostMapping
//       public ResponseEntity<PermissionTemplateDTO> create(
//           @RequestBody CreateTemplateRequest request) {
//           return ResponseEntity.status(HttpStatus.CREATED)
//               .body(service.create(request));
//       }
//
//       @DeleteMapping("/{value}")
//       public ResponseEntity<Void> delete(@PathVariable String value) {
//           service.delete(value);
//           return ResponseEntity.noContent().build();
//       }
//   }
//
// ── UserPermission.java (Entity) ──────────────────────────────
//
//   @Entity
//   @Table(name = "user_permissions",
//          uniqueConstraints = @UniqueConstraint(columnNames = {"user_id","page_id"}))
//   public class UserPermission {
//       @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
//       private Long id;
//
//       @Column(name = "user_id", nullable = false)
//       private Long userId;
//
//       @Column(name = "page_id", nullable = false, length = 100)
//       private String pageId;      // e.g. "list_leads", "create_lead"
//
//       @Column(name = "section_id", length = 100)
//       private String sectionId;   // e.g. "lead_management", "reminders"
//
//       @Column(name = "access")
//       private boolean access = false;
//
//       @Column(name = "scope", length = 20)
//       private String scope = "own";  // own | team | all | none
//
//       @Column(name = "updated_at")
//       private LocalDateTime updatedAt;
//
//       @PrePersist @PreUpdate
//       protected void onUpdate() { updatedAt = LocalDateTime.now(); }
//       // getters + setters or @Data (Lombok)
//   }
//
// ── UserPermissionsDTO.java ───────────────────────────────────
//
//   public class UserPermissionsDTO {
//       private Long userId;
//       private int  pages;    // count of pages with access=true
//       private int  total;    // total pages defined
//       private Map<String, PermissionEntry> permissions;
//       // getters + setters
//   }
//
// ── PermissionEntry.java ──────────────────────────────────────
//
//   public class PermissionEntry {
//       private boolean access;
//       private String  scope;   // own | team | all | none
//       // getters + setters
//   }
//
// ── UpdatePermissionsRequest.java ────────────────────────────
//
//   public class UpdatePermissionsRequest {
//       private Map<String, PermissionEntry> permissions;
//       // getters + setters
//   }
//
// ── PermissionPatchRequest.java ───────────────────────────────
//
//   public class PermissionPatchRequest {
//       private boolean access;
//       private String  scope;
//       // getters + setters
//   }
//
// ── PermissionTemplateDTO.java ────────────────────────────────
//
//   public class PermissionTemplateDTO {
//       private String value;   // "sales", "basic", etc.
//       private String label;   // "Sales Team Access"
//       private Map<String, PermissionEntry> permissions;
//       // getters + setters
//   }
//
// ── CreateTemplateRequest.java ────────────────────────────────
//
//   public class CreateTemplateRequest {
//       private String label;
//       private String value;
//       private Map<String, PermissionEntry> permissions;
//       // getters + setters
//   }
//
// ── UserPermissionService.java — core methods ─────────────────
//
//   @Service @Transactional
//   public class UserPermissionService {
//
//       @Autowired private UserPermissionRepository repo;
//       @Autowired private PermissionTemplateRepository templateRepo;
//
//       public UserPermissionsDTO getPermissions(Long userId) {
//           List<UserPermission> rows = repo.findByUserId(userId);
//           Map<String, PermissionEntry> map = rows.stream()
//               .collect(Collectors.toMap(
//                   UserPermission::getPageId,
//                   r -> new PermissionEntry(r.isAccess(), r.getScope())
//               ));
//           int pages = (int) rows.stream().filter(UserPermission::isAccess).count();
//           return new UserPermissionsDTO(userId, pages, rows.size(), map);
//       }
//
//       public UserPermissionsDTO updateAll(Long userId,
//               Map<String, PermissionEntry> permissions) {
//           permissions.forEach((pageId, entry) -> {
//               UserPermission row = repo.findByUserIdAndPageId(userId, pageId)
//                   .orElse(new UserPermission());
//               row.setUserId(userId);
//               row.setPageId(pageId);
//               row.setAccess(entry.isAccess());
//               row.setScope(entry.getScope());
//               repo.save(row);
//           });
//           return getPermissions(userId);
//       }
//
//       public UserPermissionsDTO setAllAccess(Long userId, boolean access) {
//           repo.findByUserId(userId).forEach(row -> {
//               row.setAccess(access);
//               repo.save(row);
//           });
//           return getPermissions(userId);
//       }
//
//       public UserPermissionsDTO setScopeDefault(Long userId, String scope) {
//           repo.findByUserId(userId).forEach(row -> {
//               row.setScope(scope);
//               repo.save(row);
//           });
//           return getPermissions(userId);
//       }
//
//       public UserPermissionsDTO toggleSection(Long userId,
//               String sectionId, boolean access) {
//           repo.findByUserIdAndSectionId(userId, sectionId).forEach(row -> {
//               row.setAccess(access);
//               repo.save(row);
//           });
//           return getPermissions(userId);
//       }
//
//       public UserPermissionsDTO applyTemplate(Long userId, String templateValue) {
//           PermissionTemplate tpl = templateRepo.findByValue(templateValue)
//               .orElseThrow(() -> new ResponseStatusException(
//                   HttpStatus.NOT_FOUND, "Template not found"));
//           return updateAll(userId, tpl.getPermissions());
//       }
//   }
//
// ─────────────────────────────────────────────────────────────
// ── application.properties (PostgreSQL) ──────────────────────
//
//   spring.datasource.url=jdbc:postgresql://localhost:5432/travel_crm
//   spring.datasource.username=postgres
//   spring.datasource.password=yourpassword
//   spring.datasource.driver-class-name=org.postgresql.Driver
//   spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
//   spring.jpa.hibernate.ddl-auto=update
//   spring.jpa.show-sql=true
//   server.port=8080
//
// ── .env (React — project root) ──────────────────────────────
//
//   REACT_APP_API_URL=http://localhost:8080
//
// ─────────────────────────────────────────────────────────────
// ── PostgreSQL Schema ─────────────────────────────────────────
//
//   CREATE TABLE user_permissions (
//     id          BIGSERIAL    PRIMARY KEY,
//     user_id     BIGINT       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
//     page_id     VARCHAR(100) NOT NULL,
//     section_id  VARCHAR(100),
//     access      BOOLEAN      DEFAULT FALSE,
//     scope       VARCHAR(20)  DEFAULT 'own',
//     updated_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
//
//     CONSTRAINT uq_user_page UNIQUE (user_id, page_id),
//     CONSTRAINT chk_scope CHECK (scope IN ('own','team','all','none'))
//   );
//
//   CREATE INDEX idx_user_permissions_user    ON user_permissions (user_id);
//   CREATE INDEX idx_user_permissions_section ON user_permissions (user_id, section_id);
//
//   -- Permission Templates table
//   CREATE TABLE permission_templates (
//     id          BIGSERIAL    PRIMARY KEY,
//     value       VARCHAR(50)  NOT NULL UNIQUE,
//     label       VARCHAR(100) NOT NULL,
//     permissions JSONB        NOT NULL,    -- JSONB for efficient querying
//     created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
//   );
//
//   -- Auto-update trigger for user_permissions
//   CREATE OR REPLACE FUNCTION update_updated_at_column()
//   RETURNS TRIGGER AS $$
//   BEGIN NEW.updated_at = CURRENT_TIMESTAMP; RETURN NEW; END;
//   $$ language 'plpgsql';
//
//   CREATE TRIGGER set_user_permissions_updated_at
//   BEFORE UPDATE ON user_permissions
//   FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
//
//   -- Seed permission templates (JSONB format)
//   INSERT INTO permission_templates (value, label, permissions) VALUES
//   ('basic', 'Basic Access Only', '{
//     "dashboard_access":  {"access": true,  "scope": "own"},
//     "list_leads":        {"access": false, "scope": "own"},
//     "my_reminders":      {"access": false, "scope": "own"}
//   }'),
//   ('sales', 'Sales Team Access', '{
//     "dashboard_access":  {"access": true, "scope": "own"},
//     "list_leads":        {"access": true, "scope": "own"},
//     "create_lead":       {"access": true, "scope": "own"},
//     "edit_lead":         {"access": true, "scope": "own"},
//     "view_lead":         {"access": true, "scope": "own"},
//     "my_reminders":      {"access": true, "scope": "own"},
//     "create_reminder":   {"access": true, "scope": "own"}
//   }'),
//   ('full', 'Full Access', '{}');
//   -- Note: for "full" template, the backend sets access=true for ALL pages
// ─────────────────────────────────────────────────────────────