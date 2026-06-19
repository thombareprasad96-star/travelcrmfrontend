// src/services/createUserService.js
// ─────────────────────────────────────────────────────────────
// Create User Page — API Service
// Backend: Java Spring Boot REST API
// Database: PostgreSQL
// Covers: Create User + Permission Templates + Active Users Count
// ─────────────────────────────────────────────────────────────

import axios from "axios";

// ── BASE URL ──────────────────────────────────────────────────
// Add this to your .env file in React project root:
// REACT_APP_API_URL=http://localhost:8080
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

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
// 1. CREATE USER SERVICE
//    Spring Boot Controller: /api/users
//    PostgreSQL Table: users
// ═════════════════════════════════════════════════════════════
export const createUserService = {

  // ── CREATE NEW USER ────────────────────────────────────────
  // POST /api/users
  // @PostMapping("/api/users")
  // public ResponseEntity<UserDTO> create(@RequestBody CreateUserRequest request)
  //
  // Request body:
  // {
  //   username:           "admin_ntat",
  //   fullName:           "Shreyash Raghvendra Shahi",
  //   email:              "shreyash@email.com",
  //   phone:              "+91 90990 97103",
  //   password:           "Pass@1234",
  //   confirmPassword:    "Pass@1234",
  //   role:               "Staff",            // Staff | Admin | Manager
  //   permissionTemplate: "basic",            // basic | sales | support | full | custom
  //   status:             "Active"            // Active | Inactive
  // }
  //
  // Response (201 Created):
  // {
  //   id: 35,
  //   username: "admin_ntat",
  //   fullName: "Shreyash Raghvendra Shahi",
  //   email: "shreyash@email.com",
  //   phone: "+91 90990 97103",
  //   role: "Staff",
  //   status: "Active",
  //   lastLogin: "Never",
  //   createdAt: "Jun 19, 2026"
  // }
  //
  // Error responses:
  // 400 - { message: "Username already taken." }
  // 400 - { message: "Password does not meet requirements." }
  // 409 - { message: "Email already registered." }
  create: (data) => {
    return api.post("/api/users", {
      username:           data.username,
      fullName:           data.fullName,
      email:              data.email,
      phone:              data.phone || null,
      password:           data.password,
      confirmPassword:    data.confirmPassword,
      role:               data.role,
      permissionTemplate: data.permissionTemplate,
      status:             data.isActive ? "Active" : "Inactive",
    });
  },

  // ── CHECK USERNAME AVAILABILITY ────────────────────────────
  // GET /api/users/check-username?username=admin_ntat
  // @GetMapping("/api/users/check-username")
  // public ResponseEntity<Map<String, Boolean>> checkUsername(
  //     @RequestParam String username)
  //
  // Response: { available: true } or { available: false }
  // Use for real-time username validation as user types
  checkUsername: (username) => {
    return api.get("/api/users/check-username", {
      params: { username },
    });
  },

  // ── CHECK EMAIL AVAILABILITY ───────────────────────────────
  // GET /api/users/check-email?email=user@email.com
  // @GetMapping("/api/users/check-email")
  // public ResponseEntity<Map<String, Boolean>> checkEmail(
  //     @RequestParam String email)
  //
  // Response: { available: true } or { available: false }
  checkEmail: (email) => {
    return api.get("/api/users/check-email", {
      params: { email },
    });
  },

  // ── GET ACTIVE USERS COUNT (for header badge) ──────────────
  // GET /api/users/active-count
  // @GetMapping("/api/users/active-count")
  // public ResponseEntity<Map<String, Long>> getActiveCount()
  //
  // Response: { count: 4 }
  // Used for the "Active Users: 4" badge in the page header
  getActiveCount: () => {
    return api.get("/api/users/active-count");
  },
};


// ═════════════════════════════════════════════════════════════
// 2. PERMISSION TEMPLATE SERVICE
//    Spring Boot Controller: /api/permission-templates
//    PostgreSQL Table: permission_templates
// ═════════════════════════════════════════════════════════════
export const permissionTemplateService = {

  // ── GET ALL TEMPLATES (for dropdown) ──────────────────────
  // GET /api/permission-templates
  // @GetMapping("/api/permission-templates")
  // public ResponseEntity<List<PermissionTemplateDTO>> getAll()
  //
  // Response:
  // [
  //   { value: "basic",   label: "Basic Access Only"  },
  //   { value: "sales",   label: "Sales Team Access"  },
  //   { value: "support", label: "Support Access"     },
  //   { value: "full",    label: "Full Access"        },
  //   { value: "custom",  label: "Custom Permissions" }
  // ]
  getAll: () => {
    return api.get("/api/permission-templates");
  },
};


// ═════════════════════════════════════════════════════════════
// DEFAULT EXPORT
// ═════════════════════════════════════════════════════════════
export default { createUserService, permissionTemplateService };


// ═════════════════════════════════════════════════════════════
// HOW TO USE IN CreateUser.jsx
// ═════════════════════════════════════════════════════════════
//
// STEP 1 — Import at top of CreateUser.jsx:
//   import { createUserService, permissionTemplateService }
//     from "../services/createUserService";
//
// ─────────────────────────────────────────────────────────────
// STEP 2 — Load active users count + permission templates on mount:
//
//   const [activeUsersCount,     setActiveUsersCount]     = useState(0);
//   const [permissionTemplates,  setPermissionTemplates]  = useState([]);
//
//   useEffect(() => {
//     // Load active users count for header badge
//     createUserService.getActiveCount()
//       .then((res) => setActiveUsersCount(res.data.count))
//       .catch(() => {});
//
//     // Load permission templates for dropdown
//     permissionTemplateService.getAll()
//       .then((res) => setPermissionTemplates(res.data))
//       .catch(() => {});
//   }, []);
//
// ─────────────────────────────────────────────────────────────
// STEP 3 — Replace mock handleSubmit with real API call:
//
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const errs2 = validate();
//     if (Object.keys(errs2).length) {
//       setErrs(errs2);
//       showToast("Please fix the errors below.", "error");
//       return;
//     }
//     setSubmitting(true);
//     try {
//       const res = await createUserService.create(form);
//       showToast(`User "${res.data.fullName}" created successfully! 🎉`);
//       setTimeout(() => navigate("/Users"), 1500);
//     } catch (err) {
//       showToast(
//         err?.response?.data?.message || "Failed to create user.",
//         "error"
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   };
//
// ─────────────────────────────────────────────────────────────
// STEP 4 — OPTIONAL: Real-time username availability check:
//
//   // Add debounced check as user types username
//   const [usernameAvailable, setUsernameAvailable] = useState(null);
//
//   useEffect(() => {
//     if (!form.username || form.username.length < 3) {
//       setUsernameAvailable(null);
//       return;
//     }
//     const timer = setTimeout(() => {
//       createUserService.checkUsername(form.username)
//         .then((res) => setUsernameAvailable(res.data.available))
//         .catch(() => setUsernameAvailable(null));
//     }, 500); // debounce 500ms
//     return () => clearTimeout(timer);
//   }, [form.username]);
//
//   // Then show under username field:
//   // {usernameAvailable === true  && <p className="text-emerald-500">✓ Username available</p>}
//   // {usernameAvailable === false && <p className="text-red-500">✗ Username already taken</p>}
//
// ═════════════════════════════════════════════════════════════
// SPRING BOOT JAVA BACKEND — FULL REFERENCE
// ═════════════════════════════════════════════════════════════
//
// ── UserController.java (relevant endpoints) ──────────────────
//
//   @RestController
//   @RequestMapping("/api/users")
//   @CrossOrigin(origins = "http://localhost:3000")
//   public class UserController {
//
//       @Autowired private UserService service;
//
//       // Create new user
//       @PostMapping
//       public ResponseEntity<UserDTO> create(
//               @RequestBody @Valid CreateUserRequest request) {
//           return ResponseEntity
//               .status(HttpStatus.CREATED)
//               .body(service.create(request));
//       }
//
//       // Check username availability
//       @GetMapping("/check-username")
//       public ResponseEntity<Map<String, Boolean>> checkUsername(
//               @RequestParam String username) {
//           boolean available = !userRepo.existsByUsername(username);
//           return ResponseEntity.ok(Map.of("available", available));
//       }
//
//       // Check email availability
//       @GetMapping("/check-email")
//       public ResponseEntity<Map<String, Boolean>> checkEmail(
//               @RequestParam String email) {
//           boolean available = !userRepo.existsByEmail(email);
//           return ResponseEntity.ok(Map.of("available", available));
//       }
//
//       // Active users count for badge
//       @GetMapping("/active-count")
//       public ResponseEntity<Map<String, Long>> getActiveCount() {
//           long count = userRepo.countByStatus("Active");
//           return ResponseEntity.ok(Map.of("count", count));
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
//       @Autowired private PermissionTemplateRepository repo;
//
//       @GetMapping
//       public ResponseEntity<List<PermissionTemplateDTO>> getAll() {
//           return ResponseEntity.ok(
//               repo.findAll().stream()
//                   .map(t -> new PermissionTemplateDTO(t.getValue(), t.getLabel()))
//                   .collect(Collectors.toList())
//           );
//       }
//   }
//
// ── CreateUserRequest.java ────────────────────────────────────
//
//   public class CreateUserRequest {
//       @NotBlank(message = "Username is required")
//       @Pattern(regexp = "^\\S+$", message = "Username cannot contain spaces")
//       private String username;
//
//       @NotBlank(message = "Full name is required")
//       private String fullName;
//
//       @NotBlank(message = "Email is required")
//       @Email(message = "Enter a valid email")
//       private String email;
//
//       private String phone;
//
//       @NotBlank(message = "Password is required")
//       @Size(min = 8, message = "Password must be at least 8 characters")
//       private String password;
//
//       private String confirmPassword;
//
//       private String role               = "Staff";
//       private String permissionTemplate = "basic";
//       private String status             = "Active";
//
//       // getters + setters or @Data (Lombok)
//   }
//
// ── UserService.java — create method ─────────────────────────
//
//   @Transactional
//   public UserDTO create(CreateUserRequest req) {
//       // 1. Check username uniqueness
//       if (userRepo.existsByUsername(req.getUsername()))
//           throw new ResponseStatusException(
//               HttpStatus.BAD_REQUEST, "Username already taken.");
//
//       // 2. Validate password match
//       if (!req.getPassword().equals(req.getConfirmPassword()))
//           throw new ResponseStatusException(
//               HttpStatus.BAD_REQUEST, "Passwords do not match.");
//
//       // 3. Validate password strength
//       if (!isStrongPassword(req.getPassword()))
//           throw new ResponseStatusException(
//               HttpStatus.BAD_REQUEST,
//               "Password must have uppercase, lowercase, number, and special character.");
//
//       // 4. Build and save user
//       User user = new User();
//       user.setUsername(req.getUsername());
//       user.setFullName(req.getFullName());
//       user.setEmail(req.getEmail());
//       user.setPhone(req.getPhone());
//       user.setPassword(passwordEncoder.encode(req.getPassword()));
//       user.setRole(req.getRole() != null ? req.getRole() : "Staff");
//       user.setPermissionTemplate(req.getPermissionTemplate());
//       user.setStatus(req.getStatus() != null ? req.getStatus() : "Active");
//
//       return toDTO(userRepo.save(user));
//   }
//
//   private boolean isStrongPassword(String p) {
//       return p.length() >= 8
//           && p.chars().anyMatch(Character::isUpperCase)
//           && p.chars().anyMatch(Character::isLowerCase)
//           && p.chars().anyMatch(Character::isDigit)
//           && p.chars().anyMatch(c -> !Character.isLetterOrDigit(c));
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
//       @Column(unique = true, length = 50)
//       private String value;   // basic | sales | support | full | custom
//
//       @Column(length = 100)
//       private String label;   // "Basic Access Only"
//
//       @Column(columnDefinition = "TEXT")
//       private String permissions;  // JSON string of permission flags
//
//       // getters + setters or @Data (Lombok)
//   }
//
// ── PermissionTemplateDTO.java ────────────────────────────────
//
//   public class PermissionTemplateDTO {
//       private String value;
//       private String label;
//       // constructor + getters
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
//   -- Users table (permission_template column added)
//   ALTER TABLE users
//     ADD COLUMN IF NOT EXISTS permission_template
//       VARCHAR(50) DEFAULT 'basic';
//
//   -- Permission templates table
//   CREATE TABLE permission_templates (
//     id          BIGSERIAL    PRIMARY KEY,
//     value       VARCHAR(50)  NOT NULL UNIQUE,
//     label       VARCHAR(100) NOT NULL,
//     permissions TEXT,
//     created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
//   );
//
//   -- Seed default permission templates
//   INSERT INTO permission_templates (value, label, permissions) VALUES
//     ('basic',   'Basic Access Only',  '{"leads":true,"bookings":false,"reports":false,"settings":false}'),
//     ('sales',   'Sales Team Access',  '{"leads":true,"bookings":true,"reports":true,"settings":false}'),
//     ('support', 'Support Access',     '{"leads":true,"bookings":true,"reports":false,"settings":false}'),
//     ('full',    'Full Access',        '{"leads":true,"bookings":true,"reports":true,"settings":true}'),
//     ('custom',  'Custom Permissions', '{}');
//
// ─────────────────────────────────────────────────────────────