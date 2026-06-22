// src/services/createPermissionTemplateService.js
// ─────────────────────────────────────────────────────────────
// Create Permission Template Page — API Service
// Page: CreatePermissionTemplate.jsx
// Backend: Java Spring Boot REST API
// Database: PostgreSQL
// Covers:
//   - Load users dropdown ("Copy From Existing User")
//   - Load preset details (quick mode: ?type=sales_executive etc.)
//   - Create custom template (blank or copy from user)
//   - Create quick template (from preset)
// ─────────────────────────────────────────────────────────────

import axios from "axios";

// ── BASE URL ──────────────────────────────────────────────────
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
// CREATE PERMISSION TEMPLATE SERVICE
// ═════════════════════════════════════════════════════════════
const createPermissionTemplateService = {

  // ── GET USERS FOR "COPY FROM" DROPDOWN ─────────────────────
  // GET /api/users/dropdown
  // @GetMapping("/api/users/dropdown")
  // public ResponseEntity<List<UserDropdownDTO>> getUsersForDropdown()
  //
  // Response:
  // [
  //   { id: 34, fullName: "Shreyash Raghvendra Shahi",
  //     username: "Shreyash_Shahi", role: "Staff", status: "Active" },
  //   { id: 21, fullName: "Deepti Paul",
  //     username: "deepti_paul", role: "Staff", status: "Active" },
  //   ...
  // ]
  //
  // Used to populate the "Copy Permissions From Existing User"
  // dropdown in custom template creation (Image 1)
  getUsersForDropdown: () => {
    return api.get("/api/users/dropdown");
  },

  // ── GET PRESET DETAILS (for quick template preview) ────────
  // GET /api/permission-templates/presets/{presetType}
  // @GetMapping("/api/permission-templates/presets/{presetType}")
  // public ResponseEntity<PresetDetailDTO> getPresetDetail(
  //     @PathVariable String presetType)
  //
  // presetType: "sales_executive" | "data_entry" | "manager" | "view_only"
  //
  // Response (used to build Template Preview card + teal banner):
  // {
  //   id: "sales_executive",
  //   title: "Sales Executive",
  //   description: "Full lead management, quotation creation, own data only",
  //   totalPermissions: 14,
  //   breakdown: [
  //     { module: "Dashboard.php", pages: 1 },
  //     { module: "Leads",         pages: 6 },
  //     { module: "Reminders",     pages: 3 },
  //     { module: "Quotations",    pages: 4 }
  //   ]
  // }
  //
  // NOTE: You can also keep this frontend-only (as in the current
  // QUICK_PRESETS constant) if preset data never changes.
  // Only call this if preset data comes from the DB.
  getPresetDetail: (presetType) => {
    return api.get(`/api/permission-templates/presets/${presetType}`);
  },

  // ── CREATE CUSTOM TEMPLATE (blank or copy from user) ───────
  // POST /api/permission-templates
  // @PostMapping("/api/permission-templates")
  // public ResponseEntity<PermissionTemplateDTO> create(
  //     @RequestBody @Valid CreateTemplateRequest request)
  //
  // Request body (custom mode — Image 1):
  // {
  //   name:         "My Custom Template",    // required, min 3 chars
  //   description:  "Optional description",  // optional
  //   copyFromUser: 34,                      // null = blank template
  //   isDefault:    false
  // }
  //
  // Backend logic:
  //   - If copyFromUser != null:
  //       Copies that user's user_permissions rows as the template's
  //       permissions JSONB map
  //   - If copyFromUser == null:
  //       Creates with only dashboard_access = true (blank template)
  //   - If isDefault = true:
  //       Clears isDefault=false on all other templates first
  //   - Auto-generates a URL-safe "value" slug from the name
  //   - Returns 201 Created with full PermissionTemplateDTO
  //
  // Error responses:
  //   400 — { message: "Template name is required" }
  //   400 — { message: "Name must be at least 3 characters" }
  //   409 — { message: "A template with this name already exists" }
  //   404 — { message: "User not found" } (if copyFromUser is invalid)
  create: (data) => {
    return api.post("/api/permission-templates", {
      name:         data.templateName.trim(),
      description:  (data.description || "").trim() || null,
      copyFromUser: data.copyFromUser ? Number(data.copyFromUser) : null,
      isDefault:    data.isDefault || false,
    });
  },

  // ── CREATE QUICK TEMPLATE (from built-in preset) ───────────
  // POST /api/permission-templates/quick
  // @PostMapping("/api/permission-templates/quick")
  // public ResponseEntity<PermissionTemplateDTO> createQuick(
  //     @RequestBody @Valid CreateQuickTemplateRequest request)
  //
  // Request body (quick mode — Images 2-5):
  // {
  //   name:       "Sales Executive",     // customizable, pre-filled from preset
  //   presetType: "sales_executive",     // from URL query param ?type=
  //   isDefault:  false
  // }
  //
  // Backend logic:
  //   - Loads built-in preset permissions map for presetType
  //   - Creates a new permission_templates row with those permissions
  //   - Sets pages count from the preset map
  //   - Stores presetType in the "preset" column
  //   - Returns 201 Created with full PermissionTemplateDTO
  //
  // Error responses:
  //   400 — { message: "Template name is required" }
  //   400 — { message: "Invalid preset type" }
  //   409 — { message: "A template with this name already exists" }
  createQuick: (data) => {
    return api.post("/api/permission-templates/quick", {
      name:       data.templateName.trim(),
      presetType: data.presetType,
      isDefault:  data.isDefault || false,
    });
  },
};

export default createPermissionTemplateService;


// ═════════════════════════════════════════════════════════════
// HOW TO USE IN CreatePermissionTemplate.jsx
// ═════════════════════════════════════════════════════════════
//
// STEP 1 — Import at top of CreatePermissionTemplate.jsx:
//   import createPermissionTemplateService
//     from "../services/createPermissionTemplateService";
//
// ─────────────────────────────────────────────────────────────
// STEP 2 — Load users dropdown on mount (add to useEffect):
//
//   const [users, setUsers] = useState([]);
//
//   useEffect(() => {
//     // Load users for "Copy From Existing User" dropdown
//     createPermissionTemplateService
//       .getUsersForDropdown()
//       .then((res) => setUsers(res.data))
//       .catch(() => {}); // non-critical, fail silently
//   }, []);
//
//   // Then replace MOCK_USERS in the select options:
//   // {users.map(u => (
//   //   <option key={u.id} value={u.id}>
//   //     {u.fullName} ({u.username})
//   //   </option>
//   // ))}
//
// ─────────────────────────────────────────────────────────────
// STEP 3 — Replace mock handleSubmit with smart dual-mode API:
//
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const errs2 = validate();
//     if (Object.keys(errs2).length) {
//       setErrs(errs2);
//       showToast("Please fix the errors below.", "error");
//       return;
//     }
//     setSaving(true);
//     try {
//       let res;
//
//       if (isQuickMode) {
//         // Quick template — uses preset from URL ?type=
//         res = await createPermissionTemplateService.createQuick({
//           templateName: templateName,
//           presetType:   typeParam,    // "sales_executive" | "data_entry" | ...
//           isDefault:    isDefault,
//         });
//       } else {
//         // Custom template — blank or copy from user
//         res = await createPermissionTemplateService.create({
//           templateName: templateName,
//           description:  description,
//           copyFromUser: copyFromUser,  // "" = blank, userId = copy
//           isDefault:    isDefault,
//         });
//       }
//
//       showToast(
//         `Template "${res.data.name}" created successfully! ✅`
//       );
//       setTimeout(() => navigate("/PermissionTemplates"), 1500);
//
//     } catch (err) {
//       showToast(
//         err?.response?.data?.message || "Failed to create template.",
//         "error"
//       );
//     } finally {
//       setSaving(false);
//     }
//   };
//
// ─────────────────────────────────────────────────────────────
// STEP 4 — OPTIONAL: Load preset details from backend
//          (only if preset config lives in DB, not frontend constant)
//
//   useEffect(() => {
//     if (!typeParam) return;
//     createPermissionTemplateService
//       .getPresetDetail(typeParam)
//       .then((res) => setPresetFromApi(res.data))
//       .catch(() => {}); // fallback to QUICK_PRESETS constant
//   }, [typeParam]);
//
// ═════════════════════════════════════════════════════════════
// SPRING BOOT JAVA BACKEND — FULL REFERENCE
// ═════════════════════════════════════════════════════════════
//
// ── PermissionTemplateController.java (create endpoints) ─────
//
//   @RestController
//   @RequestMapping("/api/permission-templates")
//   @CrossOrigin(origins = "http://localhost:3000")
//   public class PermissionTemplateController {
//
//       @Autowired private PermissionTemplateService service;
//
//       // Custom template (blank or copy from user)
//       @PostMapping
//       public ResponseEntity<PermissionTemplateDTO> create(
//           @RequestBody @Valid CreateTemplateRequest request) {
//           return ResponseEntity.status(HttpStatus.CREATED)
//               .body(service.create(request));
//       }
//
//       // Quick template (from preset)
//       @PostMapping("/quick")
//       public ResponseEntity<PermissionTemplateDTO> createQuick(
//           @RequestBody @Valid CreateQuickTemplateRequest request) {
//           return ResponseEntity.status(HttpStatus.CREATED)
//               .body(service.createQuick(request));
//       }
//
//       // Preset detail (optional — only if preset data lives in DB)
//       @GetMapping("/presets/{presetType}")
//       public ResponseEntity<PresetDetailDTO> getPresetDetail(
//           @PathVariable String presetType) {
//           return ResponseEntity.ok(service.getPresetDetail(presetType));
//       }
//   }
//
//   // Users dropdown (already in UserController)
//   // @GetMapping("/api/users/dropdown")
//   // public ResponseEntity<List<UserDropdownDTO>> getForDropdown()
//
// ── PermissionTemplateService.java (create methods) ──────────
//
//   // Built-in preset permission maps (used by createQuick)
//   private static final Map<String, Map<String, Object>> PRESETS = Map.of(
//     "sales_executive", Map.of(
//       "dashboard_access",  Map.of("access", true,  "scope", "own"),
//       "list_leads",        Map.of("access", true,  "scope", "own"),
//       "create_lead",       Map.of("access", true,  "scope", "own"),
//       "edit_lead",         Map.of("access", true,  "scope", "own"),
//       "view_lead",         Map.of("access", true,  "scope", "own"),
//       "import_leads",      Map.of("access", true,  "scope", "own"),
//       "my_reminders",      Map.of("access", true,  "scope", "own"),
//       "create_reminder",   Map.of("access", true,  "scope", "own"),
//       "notifications",     Map.of("access", true,  "scope", "own"),
//       "create_quotation",  Map.of("access", true,  "scope", "own"),
//       "edit_quotation",    Map.of("access", true,  "scope", "own"),
//       "view_quotation",    Map.of("access", true,  "scope", "own"),
//       "pdf_designer",      Map.of("access", true,  "scope", "own"),
//       "quotation_templates",Map.of("access", true, "scope", "own")
//     ),
//     "data_entry", Map.of(
//       "dashboard_access",   Map.of("access", true, "scope", "own"),
//       "list_cities",        Map.of("access", true, "scope", "own"),
//       "create_city",        Map.of("access", true, "scope", "own"),
//       "edit_city",          Map.of("access", true, "scope", "own"),
//       "view_city",          Map.of("access", true, "scope", "own"),
//       "delete_city",        Map.of("access", true, "scope", "own"),
//       "list_destinations",  Map.of("access", true, "scope", "own"),
//       "create_destination", Map.of("access", true, "scope", "own"),
//       "edit_destination",   Map.of("access", true, "scope", "own"),
//       "view_destination",   Map.of("access", true, "scope", "own"),
//       "delete_destination", Map.of("access", true, "scope", "own"),
//       "list_hotels",        Map.of("access", true, "scope", "own"),
//       "create_hotel",       Map.of("access", true, "scope", "own"),
//       "edit_hotel",         Map.of("access", true, "scope", "own"),
//       "view_hotel",         Map.of("access", true, "scope", "own"),
//       "delete_hotel",       Map.of("access", true, "scope", "own"),
//       "list_airlines",      Map.of("access", true, "scope", "own"),
//       "create_airline",     Map.of("access", true, "scope", "own"),
//       "edit_airline",       Map.of("access", true, "scope", "own"),
//       "view_airline",       Map.of("access", true, "scope", "own"),
//       "delete_airline",     Map.of("access", true, "scope", "own"),
//       "list_vehicles",      Map.of("access", true, "scope", "own"),
//       "create_vehicle",     Map.of("access", true, "scope", "own"),
//       "edit_vehicle",       Map.of("access", true, "scope", "own"),
//       "view_vehicle",       Map.of("access", true, "scope", "own")
//     ),
//     "manager", Map.of(
//       "dashboard_access",   Map.of("access", true, "scope", "team"),
//       "list_leads",         Map.of("access", true, "scope", "team"),
//       "create_lead",        Map.of("access", true, "scope", "team"),
//       "edit_lead",          Map.of("access", true, "scope", "team"),
//       "view_lead",          Map.of("access", true, "scope", "team"),
//       "import_leads",       Map.of("access", true, "scope", "team"),
//       "lead_logs",          Map.of("access", true, "scope", "team"),
//       "my_reminders",       Map.of("access", true, "scope", "team"),
//       "create_reminder",    Map.of("access", true, "scope", "team"),
//       "notifications",      Map.of("access", true, "scope", "team"),
//       "reminder_logs",      Map.of("access", true, "scope", "team"),
//       "create_quotation",   Map.of("access", true, "scope", "team"),
//       "edit_quotation",     Map.of("access", true, "scope", "team"),
//       "view_quotation",     Map.of("access", true, "scope", "team"),
//       "pdf_designer",       Map.of("access", true, "scope", "team"),
//       "quotation_templates",Map.of("access", true, "scope", "team"),
//       "list_bookings",      Map.of("access", true, "scope", "team"),
//       "view_booking",       Map.of("access", true, "scope", "team"),
//       "list_customers",     Map.of("access", true, "scope", "team"),
//       "view_customer",      Map.of("access", true, "scope", "team"),
//       "list_vendors",       Map.of("access", true, "scope", "team")
//     ),
//     "view_only", Map.of(
//       "dashboard_access",   Map.of("access", true, "scope", "own"),
//       "list_leads",         Map.of("access", true, "scope", "own"),
//       "view_lead",          Map.of("access", true, "scope", "own"),
//       "my_reminders",       Map.of("access", true, "scope", "own"),
//       "notifications",      Map.of("access", true, "scope", "own"),
//       "list_cities",        Map.of("access", true, "scope", "own"),
//       "view_city",          Map.of("access", true, "scope", "own"),
//       "list_destinations",  Map.of("access", true, "scope", "own"),
//       "view_destination",   Map.of("access", true, "scope", "own"),
//       "view_quotation",     Map.of("access", true, "scope", "own"),
//       "list_customers",     Map.of("access", true, "scope", "own")
//     )
//   );
//
//   public PermissionTemplateDTO create(CreateTemplateRequest req) {
//       // Validate name uniqueness
//       String slug = req.getName().toLowerCase()
//           .replaceAll("[^a-z0-9]+", "_").replaceAll("_+$", "");
//       if (repo.existsByValue(slug))
//           throw new ResponseStatusException(HttpStatus.CONFLICT,
//               "A template with this name already exists.");
//
//       // Build permissions map
//       Map<String, Object> perms;
//       if (req.getCopyFromUser() != null) {
//           perms = buildFromUser(req.getCopyFromUser());
//       } else {
//           perms = Map.of("dashboard_access",
//               Map.of("access", true, "scope", "own"));
//       }
//
//       if (req.isDefault()) clearExistingDefaults();
//
//       PermissionTemplate t = new PermissionTemplate();
//       t.setName(req.getName().trim());
//       t.setDescription(req.getDescription());
//       t.setPermissions(toJson(perms));
//       t.setPages(countEnabled(perms));
//       t.setIsDefault(req.isDefault());
//       return toDTO(repo.save(t));
//   }
//
//   public PermissionTemplateDTO createQuick(CreateQuickTemplateRequest req) {
//       if (!PRESETS.containsKey(req.getPresetType()))
//           throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
//               "Invalid preset type: " + req.getPresetType());
//
//       Map<String, Object> perms = PRESETS.get(req.getPresetType());
//       if (req.isDefault()) clearExistingDefaults();
//
//       PermissionTemplate t = new PermissionTemplate();
//       t.setName(req.getName().trim());
//       t.setPreset(req.getPresetType());
//       t.setPermissions(toJson(perms));
//       t.setPages(countEnabled(perms));
//       t.setIsDefault(req.isDefault());
//       return toDTO(repo.save(t));
//   }
//
//   public PresetDetailDTO getPresetDetail(String presetType) {
//       return switch (presetType) {
//           case "sales_executive" -> new PresetDetailDTO(
//               "sales_executive", "Sales Executive",
//               "Full lead management, quotation creation, own data only",
//               14, List.of(
//                   new ModuleBreakdown("Dashboard.php", 1),
//                   new ModuleBreakdown("Leads",         6),
//                   new ModuleBreakdown("Reminders",     3),
//                   new ModuleBreakdown("Quotations",    4)
//               )
//           );
//           case "data_entry" -> new PresetDetailDTO(
//               "data_entry", "Data Entry Operator",
//               "Master data management only, all CRUD operations",
//               25, List.of(
//                   new ModuleBreakdown("Dashboard.php", 1),
//                   new ModuleBreakdown("Masters",       24)
//               )
//           );
//           case "manager" -> new PresetDetailDTO(
//               "manager", "Manager",
//               "Access to core functions, team data visibility",
//               21, List.of(
//                   new ModuleBreakdown("Dashboard.php", 1),
//                   new ModuleBreakdown("Leads",         7),
//                   new ModuleBreakdown("Reminders",     4),
//                   new ModuleBreakdown("Quotations",    5),
//                   new ModuleBreakdown("Bookings",      2),
//                   new ModuleBreakdown("Customers",     2)
//               )
//           );
//           case "view_only" -> new PresetDetailDTO(
//               "view_only", "View Only User",
//               "Read-only access to leads and basic data",
//               11, List.of(
//                   new ModuleBreakdown("Dashboard.php", 1),
//                   new ModuleBreakdown("Leads",         3),
//                   new ModuleBreakdown("Reminders",     2),
//                   new ModuleBreakdown("Masters",       4),
//                   new ModuleBreakdown("Quotations",    1)
//               )
//           );
//           default -> throw new ResponseStatusException(
//               HttpStatus.NOT_FOUND, "Preset not found");
//       };
//   }
//
//   private Map<String, Object> buildFromUser(Long userId) {
//       List<UserPermission> rows = userPermRepo.findByUserId(userId);
//       return rows.stream().collect(Collectors.toMap(
//           UserPermission::getPageId,
//           r -> Map.of("access", r.isAccess(), "scope", r.getScope())
//       ));
//   }
//
//   private int countEnabled(Map<String, Object> perms) {
//       return (int) perms.values().stream()
//           .filter(v -> v instanceof Map &&
//               Boolean.TRUE.equals(((Map<?,?>)v).get("access")))
//           .count();
//   }
//
// ── CreateTemplateRequest.java ────────────────────────────────
//
//   public class CreateTemplateRequest {
//       @NotBlank(message = "Template name is required")
//       @Size(min = 3, message = "Name must be at least 3 characters")
//       private String  name;
//       private String  description;
//       private Long    copyFromUser;   // null = blank
//       private boolean isDefault;
//       // getters + setters
//   }
//
// ── CreateQuickTemplateRequest.java ──────────────────────────
//
//   public class CreateQuickTemplateRequest {
//       @NotBlank(message = "Template name is required")
//       @Size(min = 3, message = "Name must be at least 3 characters")
//       private String  name;
//       @NotBlank(message = "Preset type is required")
//       private String  presetType;   // sales_executive | data_entry | manager | view_only
//       private boolean isDefault;
//       // getters + setters
//   }
//
// ── PresetDetailDTO.java ──────────────────────────────────────
//
//   public class PresetDetailDTO {
//       private String id;
//       private String title;
//       private String description;
//       private int    totalPermissions;
//       private List<ModuleBreakdown> breakdown;
//       // constructor + getters
//   }
//
// ── ModuleBreakdown.java ──────────────────────────────────────
//
//   public class ModuleBreakdown {
//       private String module;
//       private int    pages;
//       // constructor + getters
//   }
//
// ── UserDropdownDTO.java ──────────────────────────────────────
//
//   public class UserDropdownDTO {
//       private Long   id;
//       private String fullName;
//       private String username;
//       private String role;
//       private String status;
//       // getters + setters
//   }
//
// ─────────────────────────────────────────────────────────────
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