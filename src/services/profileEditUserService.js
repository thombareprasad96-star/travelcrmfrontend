// src/services/editUserService.js
// ─────────────────────────────────────────────────────────────
// Edit User Page — API Service
// Backend: Java Spring Boot REST API
// Database: PostgreSQL
// Covers: Get User | Update User | Reset Password | Permissions
// ─────────────────────────────────────────────────────────────

import API from "./axiosInstance";


// ═════════════════════════════════════════════════════════════
// 1. EDIT USER SERVICE
//    Spring Boot Controller: /api/users
//    PostgreSQL Table: users
// ═════════════════════════════════════════════════════════════
export const editUserService = {

  // ── GET USER BY ID ─────────────────────────────────────────
  // GET /api/users/{id}
  // @GetMapping("/api/users/{id}")
  // public ResponseEntity<UserDetailDTO> getById(@PathVariable Long id)
  //
  // Response (full detail for edit page):
  // {
  //   id: 34,
  //   username: "Shreyash_Shahi",
  //   fullName: "Shreyash Raghvendra Shahi",
  //   email: "nepaltours.travels@gmail.com",
  //   phone: "+91 90990 97103",
  //   role: "Staff",
  //   status: "Active",
  //   permissions: { pages: 5, total: 5 },
  //   createdAt:   "Jun 13, 2026 11:14 AM",
  //   lastUpdated: "Jun 19, 2026 9:11 AM",
  //   lastLogin:   "Jun 19, 2026 9:11 AM"
  // }
  getById: (id) => {
    return API.get(`/users/${id}`);
  },

  // ── UPDATE USER ────────────────────────────────────────────
  // PUT /api/users/{id}
  // @PutMapping("/api/users/{id}")
  // public ResponseEntity<UserDetailDTO> update(
  //     @PathVariable Long id,
  //     @RequestBody UpdateUserRequest request)
  //
  // Request body:
  // {
  //   email:    "updated@email.com",
  //   fullName: "Updated Full Name",
  //   phone:    "+91 98765 43210",
  //   role:     "Admin",
  //   status:   "Active"          // Active | Inactive
  // }
  //
  // Note: username is NOT included — it cannot be changed
  // Note: password is NOT included — use resetPassword for that
  //
  // Response: updated UserDetailDTO
  update: (id, data) => {
    return API.put(`/users/${id}`, {
      email:    data.email,
      fullName: data.fullName,
      phone:    data.phone || null,
      role:     data.role,
      status:   data.isActive ? "Active" : "Inactive",
    });
  },

  // ── RESET PASSWORD (admin sets new password for user) ──────
  // POST /api/users/{id}/reset-password
  // @PostMapping("/api/users/{id}/reset-password")
  // public ResponseEntity<MessageResponse> resetPassword(
  //     @PathVariable Long id,
  //     @RequestBody ResetPasswordRequest request)
  //
  // Request body:
  // {
  //   newPassword:     "NewPass@456",
  //   confirmPassword: "NewPass@456"
  // }
  //
  // Backend:
  //   - BCrypt hashes the new password
  //   - Invalidates all existing refresh tokens for the user
  //   - Returns: { message: "Password updated successfully." }
  resetPassword: (id, newPassword, confirmPassword) => {
    return API.post(`/users/${id}/reset-password`, {
      newPassword,
      confirmPassword,
    });
  },

  // ── UPDATE USER + RESET PASSWORD IN ONE CALL ───────────────
  // PUT /api/users/{id}/full-update
  // @PutMapping("/api/users/{id}/full-update")
  // public ResponseEntity<UserDetailDTO> fullUpdate(
  //     @PathVariable Long id,
  //     @RequestBody FullUpdateUserRequest request)
  //
  // Request body (when "Set new password" toggle is ON):
  // {
  //   email:           "updated@email.com",
  //   fullName:        "Updated Full Name",
  //   phone:           "+91 98765 43210",
  //   role:            "Admin",
  //   status:          "Active",
  //   newPassword:     "NewPass@456",      // optional — only when toggle is ON
  //   confirmPassword: "NewPass@456"       // optional — only when toggle is ON
  // }
  //
  // Recommended: use this single endpoint when password change is included,
  // to avoid two separate API calls from the frontend.
  fullUpdate: (id, data) => {
    const payload = {
      email:    data.email,
      fullName: data.fullName,
      phone:    data.phone || null,
      role:     data.role,
      status:   data.isActive ? "Active" : "Inactive",
    };
    // Only include password fields when "Set new password" is toggled ON
    if (data.newPassword) {
      payload.newPassword     = data.newPassword;
      payload.confirmPassword = data.confirmPassword;
    }
    return API.put(`/users/${id}/full-update`, payload);
  },

  // ── GET USER PERMISSIONS ───────────────────────────────────
  // GET /api/users/{id}/permissions
  // @GetMapping("/api/users/{id}/permissions")
  // public ResponseEntity<UserPermissionsDTO> getPermissions(@PathVariable Long id)
  //
  // Response:
  // {
  //   userId: 34,
  //   pages:  5,
  //   total:  5,
  //   details: [
  //     { page: "Leads",     canView: true,  canCreate: true, canEdit: true, canDelete: false },
  //     { page: "Bookings",  canView: true,  canCreate: true, canEdit: true, canDelete: false },
  //     { page: "Reports",   canView: true,  canCreate: false,canEdit: false,canDelete: false },
  //     { page: "Customers", canView: true,  canCreate: false,canEdit: true, canDelete: false },
  //     { page: "Settings",  canView: false, canCreate: false,canEdit: false,canDelete: false },
  //   ]
  // }
  getPermissions: (id) => {
    return API.get(`/users/${id}/permissions`);
  },

  // ── UPDATE USER PERMISSIONS ────────────────────────────────
  // PUT /api/users/{id}/permissions
  // @PutMapping("/api/users/{id}/permissions")
  // public ResponseEntity<UserPermissionsDTO> updatePermissions(
  //     @PathVariable Long id,
  //     @RequestBody UpdatePermissionsRequest request)
  //
  // Request body:
  // {
  //   permissions: [
  //     { page: "Leads",     canView: true,  canCreate: true, canEdit: true, canDelete: true },
  //     { page: "Bookings",  canView: true,  canCreate: true, canEdit: true, canDelete: false },
  //     ...
  //   ]
  // }
  updatePermissions: (id, permissions) => {
    return API.put(`/users/${id}/permissions`, { permissions });
  },

  // ── TOGGLE USER STATUS (Active <-> Inactive) ───────────────
  // PATCH /api/users/{id}/toggle-status
  // @PatchMapping("/api/users/{id}/toggle-status")
  // public ResponseEntity<UserDetailDTO> toggleStatus(@PathVariable Long id)
  toggleStatus: (id) => {
    return API.patch(`/users/${id}/toggle-status`);
  },
};


// ═════════════════════════════════════════════════════════════
// DEFAULT EXPORT
// ═════════════════════════════════════════════════════════════
export default editUserService;


// ═════════════════════════════════════════════════════════════
// HOW TO USE IN EditUser.jsx
// ═════════════════════════════════════════════════════════════
//
// STEP 1 — Import at top of EditUser.jsx:
//   import editUserService from "../services/editUserService";
//
// ─────────────────────────────────────────────────────────────
// STEP 2 — Replace mock useEffect with real API call:
//
//   useEffect(() => {
//     setLoading(true);
//     editUserService
//       .getById(id)
//       .then((res) => {
//         const u = res.data;
//         setUser(u);
//         setForm({
//           email:    u.email,
//           fullName: u.fullName,
//           phone:    u.phone || "",
//           role:     u.role,
//           isActive: u.status === "Active",
//         });
//       })
//       .catch(() => showToast("Failed to load user data.", "error"))
//       .finally(() => setLoading(false));
//   }, [id]);
//
// ─────────────────────────────────────────────────────────────
// STEP 3 — Replace mock handleSubmit with real API call:
//
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const formErrs = validate();
//     const pErrs = setNewPass ? validatePass() : {};
//     if (Object.keys(formErrs).length || Object.keys(pErrs).length) {
//       setErrs(formErrs);
//       setPassErrs(pErrs);
//       showToast("Please fix the errors below.", "error");
//       return;
//     }
//     setSubmitting(true);
//     try {
//       // If password change is toggled ON — use fullUpdate (one API call)
//       // If no password change — use update
//       const payload = {
//         ...form,
//         ...(setNewPass && { newPassword, confirmPassword: confirmPass }),
//       };
//       const res = setNewPass
//         ? await editUserService.fullUpdate(id, payload)
//         : await editUserService.update(id, payload);
//
//       showToast(`User "${res.data.fullName}" updated successfully! ✅`);
//       setTimeout(() => navigate("/Users"), 1500);
//     } catch (err) {
//       showToast(
//         err?.response?.data?.message || "Failed to update user.",
//         "error"
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   };
//
// ─────────────────────────────────────────────────────────────
// STEP 4 — Load permissions for the permissions panel:
//
//   useEffect(() => {
//     if (!id) return;
//     editUserService
//       .getPermissions(id)
//       .then((res) => setPermissions(res.data))
//       .catch(() => {});
//   }, [id]);
//
// ═════════════════════════════════════════════════════════════
// SPRING BOOT JAVA BACKEND — FULL REFERENCE
// ═════════════════════════════════════════════════════════════
//
// ── UserController.java (edit-related endpoints) ──────────────
//
//   @RestController
//   @RequestMapping("/api/users")
//   @CrossOrigin(origins = "http://localhost:3000")
//   public class UserController {
//
//       @Autowired private UserService service;
//
//       // Get user by ID (full detail for edit page)
//       @GetMapping("/{id}")
//       public ResponseEntity<UserDetailDTO> getById(@PathVariable Long id) {
//           return ResponseEntity.ok(service.getDetailById(id));
//       }
//
//       // Update user (no password change)
//       @PutMapping("/{id}")
//       public ResponseEntity<UserDetailDTO> update(
//               @PathVariable Long id,
//               @RequestBody @Valid UpdateUserRequest request) {
//           return ResponseEntity.ok(service.update(id, request));
//       }
//
//       // Full update (with optional password change)
//       @PutMapping("/{id}/full-update")
//       public ResponseEntity<UserDetailDTO> fullUpdate(
//               @PathVariable Long id,
//               @RequestBody @Valid FullUpdateUserRequest request) {
//           return ResponseEntity.ok(service.fullUpdate(id, request));
//       }
//
//       // Reset password only
//       @PostMapping("/{id}/reset-password")
//       public ResponseEntity<?> resetPassword(
//               @PathVariable Long id,
//               @RequestBody @Valid ResetPasswordRequest request) {
//           service.resetPassword(id, request.getNewPassword());
//           return ResponseEntity.ok(
//               Map.of("message", "Password updated successfully."));
//       }
//
//       // Get permissions
//       @GetMapping("/{id}/permissions")
//       public ResponseEntity<UserPermissionsDTO> getPermissions(
//               @PathVariable Long id) {
//           return ResponseEntity.ok(service.getPermissions(id));
//       }
//
//       // Update permissions
//       @PutMapping("/{id}/permissions")
//       public ResponseEntity<UserPermissionsDTO> updatePermissions(
//               @PathVariable Long id,
//               @RequestBody UpdatePermissionsRequest request) {
//           return ResponseEntity.ok(
//               service.updatePermissions(id, request.getPermissions()));
//       }
//
//       // Toggle Active <-> Inactive
//       @PatchMapping("/{id}/toggle-status")
//       public ResponseEntity<UserDetailDTO> toggleStatus(
//               @PathVariable Long id) {
//           return ResponseEntity.ok(service.toggleStatus(id));
//       }
//   }
//
// ── UpdateUserRequest.java ────────────────────────────────────
//
//   public class UpdateUserRequest {
//       @NotBlank(message = "Full name is required")
//       private String fullName;
//
//       @NotBlank(message = "Email is required")
//       @Email(message = "Enter a valid email")
//       private String email;
//
//       private String phone;
//
//       @NotBlank(message = "Role is required")
//       private String role;    // Staff | Admin | Manager
//
//       private String status;  // Active | Inactive
//       // NOTE: username is NOT here — it cannot be updated
//       // getters + setters or @Data (Lombok)
//   }
//
// ── FullUpdateUserRequest.java ────────────────────────────────
//
//   public class FullUpdateUserRequest extends UpdateUserRequest {
//       // Optional — only present when "Set new password" toggle is ON
//       @Size(min = 8, message = "Password must be at least 8 characters")
//       private String newPassword;
//
//       private String confirmPassword;
//       // getters + setters or @Data (Lombok)
//   }
//
// ── ResetPasswordRequest.java ─────────────────────────────────
//
//   public class ResetPasswordRequest {
//       @NotBlank @Size(min = 8)
//       private String newPassword;
//
//       @NotBlank
//       private String confirmPassword;
//       // getters + setters or @Data (Lombok)
//   }
//
// ── UserDetailDTO.java ────────────────────────────────────────
//
//   public class UserDetailDTO {
//       private Long   id;
//       private String username;    // read-only, shown grayed out
//       private String fullName;
//       private String email;
//       private String phone;
//       private String role;
//       private String status;
//       private PermissionSummary permissions;  // { pages, total }
//       private String createdAt;   // "Jun 13, 2026 11:14 AM"
//       private String lastUpdated; // "Jun 19, 2026 9:11 AM"
//       private String lastLogin;   // "Jun 19, 2026 9:11 AM" or "Never"
//       // getters + setters or @Data (Lombok)
//   }
//
// ── PermissionSummary.java ────────────────────────────────────
//
//   public class PermissionSummary {
//       private int pages;
//       private int total;
//       // constructor + getters
//   }
//
// ── UserPermissionsDTO.java ───────────────────────────────────
//
//   public class UserPermissionsDTO {
//       private Long userId;
//       private int  pages;
//       private int  total;
//       private List<PagePermission> details;
//       // getters + setters or @Data (Lombok)
//   }
//
// ── PagePermission.java ───────────────────────────────────────
//
//   public class PagePermission {
//       private String  page;        // "Leads", "Bookings", etc.
//       private boolean canView;
//       private boolean canCreate;
//       private boolean canEdit;
//       private boolean canDelete;
//       // getters + setters or @Data (Lombok)
//   }
//
// ── UserService.java — edit-related methods ───────────────────
//
//   @Transactional
//   public UserDetailDTO update(Long id, UpdateUserRequest req) {
//       User user = userRepo.findById(id)
//           .orElseThrow(() -> new ResponseStatusException(
//               HttpStatus.NOT_FOUND, "User not found"));
//       user.setFullName(req.getFullName());
//       user.setEmail(req.getEmail());
//       user.setPhone(req.getPhone());
//       user.setRole(req.getRole());
//       user.setStatus(req.getStatus());
//       return toDetailDTO(userRepo.save(user));
//   }
//
//   @Transactional
//   public UserDetailDTO fullUpdate(Long id, FullUpdateUserRequest req) {
//       User user = userRepo.findById(id)
//           .orElseThrow(() -> new ResponseStatusException(
//               HttpStatus.NOT_FOUND, "User not found"));
//       user.setFullName(req.getFullName());
//       user.setEmail(req.getEmail());
//       user.setPhone(req.getPhone());
//       user.setRole(req.getRole());
//       user.setStatus(req.getStatus());
//
//       // Optional password update
//       if (req.getNewPassword() != null && !req.getNewPassword().isBlank()) {
//           if (!req.getNewPassword().equals(req.getConfirmPassword()))
//               throw new ResponseStatusException(
//                   HttpStatus.BAD_REQUEST, "Passwords do not match.");
//           if (!isStrongPassword(req.getNewPassword()))
//               throw new ResponseStatusException(
//                   HttpStatus.BAD_REQUEST, "Password too weak.");
//           user.setPassword(passwordEncoder.encode(req.getNewPassword()));
//           // Invalidate all sessions
//           refreshTokenRepo.deleteAllByUser(user);
//       }
//       return toDetailDTO(userRepo.save(user));
//   }
//
//   @Transactional
//   public void resetPassword(Long id, String newPassword) {
//       User user = userRepo.findById(id)
//           .orElseThrow(() -> new ResponseStatusException(
//               HttpStatus.NOT_FOUND, "User not found"));
//       user.setPassword(passwordEncoder.encode(newPassword));
//       userRepo.save(user);
//       refreshTokenRepo.deleteAllByUser(user);
//   }
//
//   @Transactional
//   public UserDetailDTO toggleStatus(Long id) {
//       User user = userRepo.findById(id)
//           .orElseThrow(() -> new ResponseStatusException(
//               HttpStatus.NOT_FOUND, "User not found"));
//       user.setStatus(
//           user.getStatus().equals("Active") ? "Inactive" : "Active");
//       return toDetailDTO(userRepo.save(user));
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
//   -- users table already created (see userService.js)
//   -- Just the permissions table below:
//
//   CREATE TABLE user_permissions (
//     id          BIGSERIAL PRIMARY KEY,
//     user_id     BIGINT    NOT NULL REFERENCES users(id) ON DELETE CASCADE,
//     page        VARCHAR(100) NOT NULL,   -- "Leads", "Bookings", etc.
//     can_view    BOOLEAN   DEFAULT FALSE,
//     can_create  BOOLEAN   DEFAULT FALSE,
//     can_edit    BOOLEAN   DEFAULT FALSE,
//     can_delete  BOOLEAN   DEFAULT FALSE,
//     created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//
//     CONSTRAINT uq_user_page UNIQUE (user_id, page)
//   );
//
//   CREATE INDEX idx_user_permissions_user ON user_permissions (user_id);
//
//   -- Auto update updated_at
//   CREATE TRIGGER set_user_permissions_updated_at
//   BEFORE UPDATE ON user_permissions
//   FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
//   -- (reuses the function created in companies table trigger)
//
//   -- Seed permissions for user id=34 (Shreyash_Shahi)
//   INSERT INTO user_permissions (user_id, page, can_view, can_create, can_edit, can_delete)
//   VALUES
//     (34, 'Leads',     TRUE,  TRUE,  TRUE,  FALSE),
//     (34, 'Bookings',  TRUE,  TRUE,  TRUE,  FALSE),
//     (34, 'Customers', TRUE,  FALSE, TRUE,  FALSE),
//     (34, 'Reports',   TRUE,  FALSE, FALSE, FALSE),
//     (34, 'Settings',  FALSE, FALSE, FALSE, FALSE);
// ─────────────────────────────────────────────────────────────