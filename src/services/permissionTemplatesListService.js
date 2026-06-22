// src/services/permissionTemplatesListService.js
// ─────────────────────────────────────────────────────────────
// Permission Templates LIST Page — API Service
// Page: PermissionTemplates.jsx
// Backend: Java Spring Boot REST API
// Database: PostgreSQL
// Covers:
//   - Load all templates
//   - Subscription info (banner)
//   - Delete template
//   - Duplicate template
// ─────────────────────────────────────────────────────────────

import axios from "axios";

// ── BASE URL ────────────────────────────────────────────────
// Add to your .env file:
// REACT_APP_API_URL=http://localhost:8080
const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080";

// ── AXIOS INSTANCE ────────────────────────────────────────────
const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// ── REQUEST INTERCEPTOR — attach JWT token ────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ── RESPONSE INTERCEPTOR — handle 401 globally ───────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);


// ═════════════════════════════════════════════════════════════
// PERMISSION TEMPLATES LIST SERVICE
// Spring Boot Controller: /api/permission-templates
// PostgreSQL Table: permission_templates
// ═════════════════════════════════════════════════════════════
const permissionTemplatesListService = {

  // ── GET ALL TEMPLATES ──────────────────────────────────────
  // GET /api/permission-templates
  // @GetMapping("/api/permission-templates")
  // public ResponseEntity<List<PermissionTemplateDTO>> getAll()
  //
  // Response:
  // [
  //   {
  //     id: 1,
  //     name: "Sales Executive",
  //     description: "Full lead management, quotation creation",
  //     value: "sales_executive",
  //     preset: "sales_executive",
  //     pages: 14,
  //     usersCount: 3,
  //     isDefault: false,
  //     badgeColor: "bg-blue-100 text-blue-700",
  //     createdAt: "Jun 20, 2026"
  //   },
  //   ...
  // ]
  getAll: () => {
    return api.get("/api/permission-templates");
  },

  // ── GET SUBSCRIPTION INFO (for teal banner) ────────────────
  // GET /api/permission-templates/subscription-info
  // @GetMapping("/api/permission-templates/subscription-info")
  // public ResponseEntity<SubscriptionInfoDTO> getSubscriptionInfo()
  //
  // Response: { modulesAvailable: 13, plan: "Dolphin Plan Monthly" }
  // Used for the teal info banner:
  // "Templates can only include permissions for your subscribed
  //  modules (13 modules available)."
  getSubscriptionInfo: () => {
    return api.get("/api/permission-templates/subscription-info");
  },

  // ── DELETE TEMPLATE ────────────────────────────────────────
  // DELETE /api/permission-templates/{id}
  // @DeleteMapping("/api/permission-templates/{id}")
  // public ResponseEntity<Void> delete(@PathVariable Long id)
  //
  // Backend:
  //   - Removes the template row
  //   - Does NOT cascade delete user permissions
  //     (users who had this template keep their permissions)
  //   - Returns 204 No Content
  //
  // Error: 404 if template not found
  delete: (id) => {
    return api.delete(`/api/permission-templates/${id}`);
  },

  // ── DUPLICATE TEMPLATE ─────────────────────────────────────
  // POST /api/permission-templates/{id}/duplicate
  // @PostMapping("/api/permission-templates/{id}/duplicate")
  // public ResponseEntity<PermissionTemplateDTO> duplicate(
  //     @PathVariable Long id)
  //
  // Backend:
  //   - Creates a copy with name = "{original} (Copy)"
  //   - isDefault is always false on the duplicate
  //   - Copies the full permissions JSONB map
  //   - Returns the newly created duplicate
  duplicate: (id) => {
    return api.post(`/api/permission-templates/${id}/duplicate`);
  },

  // ── SET AS DEFAULT TEMPLATE ────────────────────────────────
  // PATCH /api/permission-templates/{id}/set-default
  // @PatchMapping("/api/permission-templates/{id}/set-default")
  // public ResponseEntity<PermissionTemplateDTO> setDefault(
  //     @PathVariable Long id)
  //
  // Backend:
  //   - Clears isDefault=false on all other templates
  //   - Sets isDefault=true on this template
  //   - Returns updated PermissionTemplateDTO
  setDefault: (id) => {
    return api.patch(`/api/permission-templates/${id}/set-default`);
  },
};

export default permissionTemplatesListService;


// ═════════════════════════════════════════════════════════════
// HOW TO USE IN PermissionTemplates.jsx
// ═════════════════════════════════════════════════════════════
//
// STEP 1 — Import at top of PermissionTemplates.jsx:
//   import permissionTemplatesListService
//     from "../services/permissionTemplatesListService";
//
// ─────────────────────────────────────────────────────────────
// STEP 2 — Replace mock useEffect with real API:
//
//   const [subscriptionModules, setSubscriptionModules] = useState(13);
//
//   useEffect(() => {
//     setLoading(true);
//     Promise.all([
//       permissionTemplatesListService.getAll(),
//       permissionTemplatesListService.getSubscriptionInfo(),
//     ])
//       .then(([tplRes, subRes]) => {
//         setTemplates(tplRes.data);
//         setSubscriptionModules(subRes.data.modulesAvailable);
//       })
//       .catch(() => showToast("Failed to load templates.", "error"))
//       .finally(() => setLoading(false));
//   }, []);
//
// ─────────────────────────────────────────────────────────────
// STEP 3 — Replace handleDelete:
//
//   const handleDelete = async () => {
//     try {
//       await permissionTemplatesListService.delete(deleteTarget.id);
//       setTemplates(prev =>
//         prev.filter(t => t.id !== deleteTarget.id)
//       );
//       showToast(`Template "${deleteTarget.name}" deleted.`);
//     } catch (err) {
//       showToast(
//         err?.response?.data?.message || "Failed to delete template.",
//         "error"
//       );
//     } finally {
//       setDeleteTarget(null);
//     }
//   };
//
// ─────────────────────────────────────────────────────────────
// STEP 4 — Replace handleDuplicate:
//
//   const handleDuplicate = async (template) => {
//     try {
//       const res = await permissionTemplatesListService.duplicate(template.id);
//       setTemplates(prev => [res.data, ...prev]);
//       showToast(`Template duplicated as "${res.data.name}".`);
//     } catch (err) {
//       showToast(
//         err?.response?.data?.message || "Failed to duplicate.",
//         "error"
//       );
//     }
//   };
//
// ═════════════════════════════════════════════════════════════
// SPRING BOOT JAVA BACKEND — FULL REFERENCE
// ═════════════════════════════════════════════════════════════
//
// ── PermissionTemplateController.java (list endpoints) ───────
//
//   @RestController
//   @RequestMapping("/api/permission-templates")
//   @CrossOrigin(origins = "http://localhost:3000")
//   public class PermissionTemplateController {
//
//       @Autowired private PermissionTemplateService service;
//
//       // Load all templates for the list page
//       @GetMapping
//       public ResponseEntity<List<PermissionTemplateDTO>> getAll() {
//           return ResponseEntity.ok(service.getAll());
//       }
//
//       // Subscription info for teal banner
//       @GetMapping("/subscription-info")
//       public ResponseEntity<SubscriptionInfoDTO> getSubscriptionInfo() {
//           return ResponseEntity.ok(service.getSubscriptionInfo());
//       }
//
//       // Delete template
//       @DeleteMapping("/{id}")
//       public ResponseEntity<Void> delete(@PathVariable Long id) {
//           service.delete(id);
//           return ResponseEntity.noContent().build();
//       }
//
//       // Duplicate template
//       @PostMapping("/{id}/duplicate")
//       public ResponseEntity<PermissionTemplateDTO> duplicate(
//           @PathVariable Long id) {
//           return ResponseEntity.status(HttpStatus.CREATED)
//               .body(service.duplicate(id));
//       }
//
//       // Set as default template
//       @PatchMapping("/{id}/set-default")
//       public ResponseEntity<PermissionTemplateDTO> setDefault(
//           @PathVariable Long id) {
//           return ResponseEntity.ok(service.setDefault(id));
//       }
//   }
//
// ── PermissionTemplateService.java (list methods) ─────────────
//
//   @Service @Transactional
//   public class PermissionTemplateService {
//
//       @Autowired private PermissionTemplateRepository repo;
//
//       public List<PermissionTemplateDTO> getAll() {
//           return repo.findAllByOrderByCreatedAtDesc()
//               .stream().map(this::toDTO)
//               .collect(Collectors.toList());
//       }
//
//       public SubscriptionInfoDTO getSubscriptionInfo() {
//           // Fetch from subscription table or return config
//           return new SubscriptionInfoDTO(13, "Dolphin Plan Monthly");
//       }
//
//       public void delete(Long id) {
//           if (!repo.existsById(id))
//               throw new ResponseStatusException(
//                   HttpStatus.NOT_FOUND, "Template not found");
//           repo.deleteById(id);
//       }
//
//       public PermissionTemplateDTO duplicate(Long id) {
//           PermissionTemplate original = repo.findById(id)
//               .orElseThrow(() -> new ResponseStatusException(
//                   HttpStatus.NOT_FOUND, "Template not found"));
//           PermissionTemplate copy = new PermissionTemplate();
//           copy.setName(original.getName() + " (Copy)");
//           copy.setDescription(original.getDescription());
//           copy.setPermissions(original.getPermissions());
//           copy.setPages(original.getPages());
//           copy.setPreset(original.getPreset());
//           copy.setIsDefault(false);
//           copy.setUsersCount(0);
//           return toDTO(repo.save(copy));
//       }
//
//       public PermissionTemplateDTO setDefault(Long id) {
//           // Clear existing defaults
//           repo.findByIsDefaultTrue().forEach(t -> {
//               t.setIsDefault(false); repo.save(t);
//           });
//           PermissionTemplate t = repo.findById(id)
//               .orElseThrow(() -> new ResponseStatusException(
//                   HttpStatus.NOT_FOUND, "Template not found"));
//           t.setIsDefault(true);
//           return toDTO(repo.save(t));
//       }
//
//       private PermissionTemplateDTO toDTO(PermissionTemplate t) {
//           PermissionTemplateDTO dto = new PermissionTemplateDTO();
//           dto.setId(t.getId());
//           dto.setName(t.getName());
//           dto.setDescription(t.getDescription());
//           dto.setValue(t.getValue());
//           dto.setPreset(t.getPreset());
//           dto.setPages(t.getPages());
//           dto.setUsersCount(t.getUsersCount());
//           dto.setDefault(t.isDefault());
//           dto.setBadgeColor(resolveBadgeColor(t.getPreset()));
//           dto.setCreatedAt(t.getCreatedAt()
//               .format(DateTimeFormatter.ofPattern("MMM dd, yyyy")));
//           return dto;
//       }
//
//       private String resolveBadgeColor(String preset) {
//           if (preset == null) return "bg-slate-100 text-slate-600";
//           return switch (preset) {
//               case "sales_executive" -> "bg-blue-100 text-blue-700";
//               case "data_entry"      -> "bg-teal-100 text-teal-700";
//               case "manager"         -> "bg-purple-100 text-purple-700";
//               case "view_only"       -> "bg-slate-100 text-slate-600";
//               default                -> "bg-slate-100 text-slate-600";
//           };
//       }
//   }
//
// ── PermissionTemplateDTO.java ────────────────────────────────
//
//   public class PermissionTemplateDTO {
//       private Long    id;
//       private String  name;
//       private String  description;
//       private String  value;
//       private String  preset;
//       private Integer pages;
//       private Integer usersCount;
//       private boolean isDefault;
//       private String  badgeColor;
//       private String  createdAt;
//       // getters + setters or @Data (Lombok)
//   }
//
// ── SubscriptionInfoDTO.java ──────────────────────────────────
//
//   public class SubscriptionInfoDTO {
//       private int    modulesAvailable;
//       private String plan;
//       // constructor + getters
//   }
//
// ── PermissionTemplateRepository.java ────────────────────────
//
//   @Repository
//   public interface PermissionTemplateRepository
//       extends JpaRepository<PermissionTemplate, Long> {
//       List<PermissionTemplate> findAllByOrderByCreatedAtDesc();
//       List<PermissionTemplate> findByIsDefaultTrue();
//   }
//
// ── PermissionTemplate.java (Entity) ─────────────────────────
//
//   @Entity
//   @Table(name = "permission_templates")
//   public class PermissionTemplate {
//       @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
//       private Long id;
//
//       @Column(nullable = false)
//       private String name;
//
//       @Column(length = 500)
//       private String description;
//
//       @Column(unique = true, length = 100)
//       private String value;          // auto-slug e.g. "sales_executive"
//
//       @Column(length = 50)
//       private String preset;         // null = custom
//
//       @Column(columnDefinition = "JSONB", nullable = false)
//       private String permissions = "{}";
//
//       @Column(name = "pages")
//       private Integer pages = 0;
//
//       @Column(name = "users_count")
//       private Integer usersCount = 0;
//
//       @Column(name = "is_default")
//       private boolean isDefault = false;
//
//       @Column(name = "created_at")
//       private LocalDateTime createdAt;
//
//       @Column(name = "updated_at")
//       private LocalDateTime updatedAt;
//
//       @PrePersist
//       protected void onCreate() {
//           createdAt = LocalDateTime.now();
//           updatedAt = LocalDateTime.now();
//           if (value == null && name != null)
//               value = name.toLowerCase()
//                   .replaceAll("[^a-z0-9]+", "_")
//                   .replaceAll("_+$", "");
//       }
//       @PreUpdate
//       protected void onUpdate() { updatedAt = LocalDateTime.now(); }
//       // getters + setters or @Data (Lombok)
//   }
//
// ─────────────────────────────────────────────────────────────
// ── PostgreSQL Schema ─────────────────────────────────────────
//
//   CREATE TABLE permission_templates (
//     id           BIGSERIAL    PRIMARY KEY,
//     name         VARCHAR(255) NOT NULL,
//     description  VARCHAR(500),
//     value        VARCHAR(100) UNIQUE,
//     preset       VARCHAR(50),
//     permissions  JSONB        NOT NULL DEFAULT '{}',
//     pages        INTEGER      DEFAULT 0,
//     users_count  INTEGER      DEFAULT 0,
//     is_default   BOOLEAN      DEFAULT FALSE,
//     created_at   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
//     updated_at   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
//   );
//
//   CREATE INDEX idx_pt_value      ON permission_templates (value);
//   CREATE INDEX idx_pt_preset     ON permission_templates (preset);
//   CREATE INDEX idx_pt_is_default ON permission_templates (is_default);
//   CREATE INDEX idx_pt_created    ON permission_templates (created_at DESC);
//
//   -- Auto-update updated_at
//   CREATE TRIGGER set_pt_updated_at
//   BEFORE UPDATE ON permission_templates
//   FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
//
// ── .env (React) ──────────────────────────────────────────────
//   REACT_APP_API_URL=http://localhost:8080
//
// ── application.properties ───────────────────────────────────
//   spring.datasource.url=jdbc:postgresql://localhost:5432/travel_crm
//   spring.datasource.username=postgres
//   spring.datasource.password=yourpassword
//   spring.datasource.driver-class-name=org.postgresql.Driver
//   spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
//   spring.jpa.hibernate.ddl-auto=update
//   server.port=8080
// ─────────────────────────────────────────────────────────────