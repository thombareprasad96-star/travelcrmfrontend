// // src/services/userService.js
// // ─────────────────────────────────────────────────────────────
// // Users Page — API Service
// // Backend: Java Spring Boot REST API
// // Database: PostgreSQL
// // ─────────────────────────────────────────────────────────────

// import API from "@shared/api/http";


// // ═════════════════════════════════════════════════════════════
// // USER SERVICE
// // Spring Boot Controller: /api/users
// // PostgreSQL Table: users
// // ═════════════════════════════════════════════════════════════
// const userService = {

//   // ── GET ALL USERS ──────────────────────────────────────────
//   // GET /api/users
//   // @GetMapping("/api/users")
//   // public ResponseEntity<List<UserDTO>> getAll(
//   //     @RequestParam(required=false) String status)
//   //
//   // Optional query param: ?status=Active | Inactive
//   //
//   // Response example:
//   // [
//   //   {
//   //     id: 34,
//   //     username: "Shreyash_Shahi",
//   //     fullName: "Shreyash Raghvendra Shahi",
//   //     email: "nepaltours.travels@gmail.com",
//   //     phone: "+91 90990 97103",
//   //     role: "Staff",
//   //     status: "Active",
//   //     lastLogin: "Jun 18, 2026 10:53",
//   //     createdAt: "Jun 13, 2026"
//   //   },
//   //   ...
//   // ]
//   getAll: (params = {}) => {
//     return API.get("/users", { params });
//     // Example: userService.getAll({ status: "Active" })
//   },

//   // ── GET USER BY ID ─────────────────────────────────────────
//   // GET /api/users/{id}
//   // @GetMapping("/api/users/{id}")
//   // public ResponseEntity<UserDTO> getById(@PathVariable Long id)
//   getById: (id) => {
//     return API.get(`/users/${id}`);
//   },

//   // ── CREATE USER ────────────────────────────────────────────
//   // POST /api/users
//   // @PostMapping("/api/users")
//   // public ResponseEntity<UserDTO> create(@RequestBody CreateUserRequest request)
//   //
//   // Request body:
//   // {
//   //   username:        "john_doe",
//   //   fullName:        "John Doe",
//   //   email:           "john@email.com",
//   //   phone:           "+91 98765 43210",
//   //   role:            "Staff",     // Staff | Admin | Manager
//   //   status:          "Active",    // Active | Inactive
//   //   password:        "Pass@1234",
//   //   confirmPassword: "Pass@1234"
//   // }
//   //
//   // Backend:
//   //   - Validates username uniqueness
//   //   - Validates email uniqueness
//   //   - BCrypt hashes the password
//   //   - Returns created UserDTO (no password field)
//   create: (data) => {
//     return API.post("/users", data);
//   },

//   // ── UPDATE USER ────────────────────────────────────────────
//   // PUT /api/users/{id}
//   // @PutMapping("/api/users/{id}")
//   // public ResponseEntity<UserDTO> update(
//   //     @PathVariable Long id, @RequestBody UpdateUserRequest request)
//   //
//   // Request body (password NOT included — use resetPassword for that):
//   // {
//   //   username: "john_doe",
//   //   fullName: "John Doe",
//   //   email:    "john@email.com",
//   //   phone:    "+91 98765 43210",
//   //   role:     "Admin",
//   //   status:   "Active"
//   // }
//   update: (id, data) => {
//     return API.put(`/users/${id}`, data);
//   },

//   // ── DELETE USER ────────────────────────────────────────────
//   // DELETE /api/users/{id}
//   // @DeleteMapping("/api/users/{id}")
//   // public ResponseEntity<Void> delete(@PathVariable Long id)
//   //
//   // Backend: soft-delete or hard-delete depending on your setup.
//   // Recommended: soft-delete by setting status = "Deleted"
//   delete: (id) => {
//     return API.delete(`/users/${id}`);
//   },

//   // ── RESET USER PASSWORD (by admin) ────────────────────────
//   // POST /api/users/{id}/reset-password
//   // @PostMapping("/api/users/{id}/reset-password")
//   // public ResponseEntity<MessageResponse> resetPassword(
//   //     @PathVariable Long id, @RequestBody ResetPasswordRequest request)
//   //
//   // Request body:
//   // {
//   //   newPassword:     "NewPass@456",
//   //   confirmPassword: "NewPass@456"
//   // }
//   //
//   // Backend:
//   //   - Admin-only endpoint (verify role in JWT)
//   //   - BCrypt hashes new password
//   //   - Invalidates all existing sessions for that user
//   //   - Returns: { message: "Password reset successfully." }
//   resetPassword: (id, newPassword, confirmPassword) => {
//     return API.post(`/users/${id}/reset-password`, {
//       newPassword,
//       confirmPassword,
//     });
//   },

//   // ── TOGGLE USER STATUS (Active <-> Inactive) ───────────────
//   // PATCH /api/users/{id}/toggle-status
//   // @PatchMapping("/api/users/{id}/toggle-status")
//   // public ResponseEntity<UserDTO> toggleStatus(@PathVariable Long id)
//   toggleStatus: (id) => {
//     return API.patch(`/users/${id}/toggle-status`);
//   },

//   // ── GET STATS (for stat cards) ─────────────────────────────
//   // GET /api/users/stats
//   // @GetMapping("/api/users/stats")
//   // public ResponseEntity<UserStatsDTO> getStats()
//   //
//   // Returns: { total, active, inactive, admins }
//   getStats: () => {
//     return API.get("/users/stats");
//   },

//   // ── GET FOR DROPDOWN (lightweight — id + name only) ────────
//   // GET /api/users/dropdown
//   // @GetMapping("/api/users/dropdown")
//   // public ResponseEntity<List<UserDropdownDTO>> getForDropdown()
//   //
//   // Returns: [{ id, fullName }]
//   // Used in: CreateReminder, AssignTo fields, etc.
//   getForDropdown: () => {
//     return API.get("/users/dropdown");
//   },

//   // ── GET ACTIVE USERS (for dropdown) ───────────────────────
//   // GET /api/users/active
//   // @GetMapping("/api/users/active")
//   // public ResponseEntity<List<UserDTO>> getActive()
//   getActive: () => {
//     return API.get("/users/active");
//   },

//   // ── SEARCH USERS ───────────────────────────────────────────
//   // GET /api/users/search?query=john
//   // @GetMapping("/api/users/search")
//   // public ResponseEntity<List<UserDTO>> search(@RequestParam String query)
//   search: (query) => {
//     return API.get("/users/search", { params: { query } });
//   },
// };

// export default userService;


// // ═════════════════════════════════════════════════════════════
// // HOW TO USE IN Users.jsx
// // ═════════════════════════════════════════════════════════════
// //
// // STEP 1 — Import at top of Users.jsx:
// //   import userService from "../services/userService";
// //
// // ─────────────────────────────────────────────────────────────
// // STEP 2 — Replace mock useEffect with real API call:
// //
// //   useEffect(() => {
// //     setLoading(true);
// //     userService
// //       .getAll()
// //       .then((res) => setUsers(res.data))
// //       .catch(() => showToast("Failed to load users.", "error"))
// //       .finally(() => setLoading(false));
// //   }, []);
// //
// // ─────────────────────────────────────────────────────────────
// // STEP 3 — Replace handleAdd in UserFormModal:
// //
// //   const handleSave = async (form) => {
// //     setSaving(true);
// //     try {
// //       const res = await userService.create(form);
// //       setUsers((prev) => [res.data, ...prev]);
// //       showToast(`User "${res.data.fullName}" created successfully!`);
// //       setShowAdd(false);
// //     } catch (err) {
// //       showToast(
// //         err?.response?.data?.message || "Failed to create user.",
// //         "error"
// //       );
// //     } finally {
// //       setSaving(false);
// //     }
// //   };
// //
// // ─────────────────────────────────────────────────────────────
// // STEP 4 — Replace handleEdit:
// //
// //   const handleEdit = async (form) => {
// //     try {
// //       const res = await userService.update(editUser.id, form);
// //       setUsers((prev) =>
// //         prev.map((u) => (u.id === editUser.id ? res.data : u))
// //       );
// //       showToast(`User "${res.data.fullName}" updated successfully!`);
// //       setEditUser(null);
// //     } catch (err) {
// //       showToast(
// //         err?.response?.data?.message || "Failed to update user.",
// //         "error"
// //       );
// //     }
// //   };
// //
// // ─────────────────────────────────────────────────────────────
// // STEP 5 — Replace handleDelete:
// //
// //   const handleDelete = async () => {
// //     try {
// //       await userService.delete(deleteUser.id);
// //       setUsers((prev) => prev.filter((u) => u.id !== deleteUser.id));
// //       showToast(`"${deleteUser.fullName}" deleted.`);
// //     } catch (err) {
// //       showToast(
// //         err?.response?.data?.message || "Failed to delete user.",
// //         "error"
// //       );
// //     } finally {
// //       setDeleteUser(null);
// //     }
// //   };
// //
// // ─────────────────────────────────────────────────────────────
// // STEP 6 — Replace handleReset in ResetPasswordModal:
// //
// //   const handleReset = async () => {
// //     // validate first...
// //     setSaving(true);
// //     try {
// //       await userService.resetPassword(user.id, newPass, confirm);
// //       showToast(`Password for ${user.fullName} has been reset successfully.`);
// //       onClose();
// //     } catch (err) {
// //       showToast(
// //         err?.response?.data?.message || "Failed to reset password.",
// //         "error"
// //       );
// //     } finally {
// //       setSaving(false);
// //     }
// //   };
// //
// // ─────────────────────────────────────────────────────────────
// // STEP 7 — Optional: load stats separately for stat cards:
// //
// //   useEffect(() => {
// //     userService.getStats().then((res) => setStats(res.data));
// //   }, []);
// //
// // ═════════════════════════════════════════════════════════════
// // SPRING BOOT JAVA BACKEND — FULL REFERENCE
// // ═════════════════════════════════════════════════════════════
// //
// // ── UserController.java ───────────────────────────────────────
// //
// //   @RestController
// //   @RequestMapping("/api/users")
// //   @CrossOrigin(origins = "http://localhost:3000")
// //   public class UserController {
// //
// //       @Autowired private UserService service;
// //
// //       @GetMapping
// //       public ResponseEntity<List<UserDTO>> getAll(
// //           @RequestParam(required = false) String status) {
// //           return ResponseEntity.ok(service.getAll(status));
// //       }
// //
// //       @GetMapping("/{id}")
// //       public ResponseEntity<UserDTO> getById(@PathVariable Long id) {
// //           return ResponseEntity.ok(service.getById(id));
// //       }
// //
// //       @PostMapping
// //       public ResponseEntity<UserDTO> create(
// //           @RequestBody CreateUserRequest request) {
// //           return ResponseEntity.status(HttpStatus.CREATED)
// //               .body(service.create(request));
// //       }
// //
// //       @PutMapping("/{id}")
// //       public ResponseEntity<UserDTO> update(
// //           @PathVariable Long id,
// //           @RequestBody UpdateUserRequest request) {
// //           return ResponseEntity.ok(service.update(id, request));
// //       }
// //
// //       @DeleteMapping("/{id}")
// //       public ResponseEntity<Void> delete(@PathVariable Long id) {
// //           service.delete(id);
// //           return ResponseEntity.noContent().build();
// //       }
// //
// //       @PostMapping("/{id}/reset-password")
// //       public ResponseEntity<?> resetPassword(
// //           @PathVariable Long id,
// //           @RequestBody ResetPasswordRequest request) {
// //           service.resetPassword(id, request.getNewPassword());
// //           return ResponseEntity.ok(
// //               Map.of("message", "Password reset successfully."));
// //       }
// //
// //       @PatchMapping("/{id}/toggle-status")
// //       public ResponseEntity<UserDTO> toggleStatus(@PathVariable Long id) {
// //           return ResponseEntity.ok(service.toggleStatus(id));
// //       }
// //
// //       @GetMapping("/stats")
// //       public ResponseEntity<UserStatsDTO> getStats() {
// //           return ResponseEntity.ok(service.getStats());
// //       }
// //
// //       @GetMapping("/dropdown")
// //       public ResponseEntity<List<UserDropdownDTO>> getForDropdown() {
// //           return ResponseEntity.ok(service.getForDropdown());
// //       }
// //
// //       @GetMapping("/active")
// //       public ResponseEntity<List<UserDTO>> getActive() {
// //           return ResponseEntity.ok(service.getAll("Active"));
// //       }
// //
// //       @GetMapping("/search")
// //       public ResponseEntity<List<UserDTO>> search(
// //           @RequestParam String query) {
// //           return ResponseEntity.ok(service.search(query));
// //       }
// //   }
// //
// // ── UserService.java ──────────────────────────────────────────
// //
// //   @Service
// //   public class UserService {
// //
// //       @Autowired private UserRepository userRepo;
// //       @Autowired private PasswordEncoder passwordEncoder;
// //
// //       public List<UserDTO> getAll(String status) {
// //           List<User> users = (status != null)
// //               ? userRepo.findByStatusOrderByIdDesc(status)
// //               : userRepo.findAllByOrderByIdDesc();
// //           return users.stream().map(this::toDTO).collect(Collectors.toList());
// //       }
// //
// //       public UserDTO getById(Long id) {
// //           return toDTO(userRepo.findById(id)
// //               .orElseThrow(() -> new ResponseStatusException(
// //                   HttpStatus.NOT_FOUND, "User not found")));
// //       }
// //
// //       @Transactional
// //       public UserDTO create(CreateUserRequest req) {
// //           if (userRepo.existsByUsername(req.getUsername()))
// //               throw new ResponseStatusException(
// //                   HttpStatus.BAD_REQUEST, "Username already taken.");
// //           if (userRepo.existsByEmail(req.getEmail()))
// //               throw new ResponseStatusException(
// //                   HttpStatus.BAD_REQUEST, "Email already registered.");
// //
// //           User user = new User();
// //           user.setUsername(req.getUsername());
// //           user.setFullName(req.getFullName());
// //           user.setEmail(req.getEmail());
// //           user.setPhone(req.getPhone());
// //           user.setRole(req.getRole());
// //           user.setStatus(req.getStatus() != null ? req.getStatus() : "Active");
// //           user.setPassword(passwordEncoder.encode(req.getPassword()));
// //           return toDTO(userRepo.save(user));
// //       }
// //
// //       @Transactional
// //       public UserDTO update(Long id, UpdateUserRequest req) {
// //           User user = userRepo.findById(id)
// //               .orElseThrow(() -> new ResponseStatusException(
// //                   HttpStatus.NOT_FOUND, "User not found"));
// //           user.setUsername(req.getUsername());
// //           user.setFullName(req.getFullName());
// //           user.setEmail(req.getEmail());
// //           user.setPhone(req.getPhone());
// //           user.setRole(req.getRole());
// //           user.setStatus(req.getStatus());
// //           return toDTO(userRepo.save(user));
// //       }
// //
// //       @Transactional
// //       public void delete(Long id) {
// //           if (!userRepo.existsById(id))
// //               throw new ResponseStatusException(
// //                   HttpStatus.NOT_FOUND, "User not found");
// //           userRepo.deleteById(id);
// //           // OR soft-delete: user.setStatus("Deleted"); userRepo.save(user);
// //       }
// //
// //       @Transactional
// //       public void resetPassword(Long id, String newPassword) {
// //           User user = userRepo.findById(id)
// //               .orElseThrow(() -> new ResponseStatusException(
// //                   HttpStatus.NOT_FOUND, "User not found"));
// //           user.setPassword(passwordEncoder.encode(newPassword));
// //           userRepo.save(user);
// //       }
// //
// //       @Transactional
// //       public UserDTO toggleStatus(Long id) {
// //           User user = userRepo.findById(id)
// //               .orElseThrow(() -> new ResponseStatusException(
// //                   HttpStatus.NOT_FOUND, "User not found"));
// //           user.setStatus(user.getStatus().equals("Active") ? "Inactive" : "Active");
// //           return toDTO(userRepo.save(user));
// //       }
// //
// //       public UserStatsDTO getStats() {
// //           return new UserStatsDTO(
// //               userRepo.count(),
// //               userRepo.countByStatus("Active"),
// //               userRepo.countByStatus("Inactive"),
// //               userRepo.countByRole("Admin")
// //           );
// //       }
// //
// //       public List<UserDropdownDTO> getForDropdown() {
// //           return userRepo.findByStatusOrderByFullNameAsc("Active")
// //               .stream()
// //               .map(u -> new UserDropdownDTO(u.getId(), u.getFullName()))
// //               .collect(Collectors.toList());
// //       }
// //
// //       public List<UserDTO> search(String query) {
// //           return userRepo.searchUsers(query)
// //               .stream().map(this::toDTO).collect(Collectors.toList());
// //       }
// //
// //       private UserDTO toDTO(User u) {
// //           UserDTO dto = new UserDTO();
// //           dto.setId(u.getId());
// //           dto.setUsername(u.getUsername());
// //           dto.setFullName(u.getFullName());
// //           dto.setEmail(u.getEmail());
// //           dto.setPhone(u.getPhone());
// //           dto.setRole(u.getRole());
// //           dto.setStatus(u.getStatus());
// //           dto.setLastLogin(u.getLastLogin() != null
// //               ? u.getLastLogin().format(DateTimeFormatter.ofPattern("MMM dd, yyyy HH:mm"))
// //               : "Never");
// //           dto.setCreatedAt(u.getCreatedAt()
// //               .format(DateTimeFormatter.ofPattern("MMM dd, yyyy")));
// //           return dto;
// //       }
// //   }
// //
// // ── User.java (Entity) ────────────────────────────────────────
// //
// //   @Entity
// //   @Table(name = "users")
// //   public class User {
// //       @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
// //       private Long id;
// //
// //       @Column(nullable = false, unique = true, length = 50)
// //       private String username;
// //
// //       @Column(name = "full_name", nullable = false)
// //       private String fullName;
// //
// //       @Column(nullable = false, unique = true)
// //       private String email;
// //
// //       @Column(length = 20)
// //       private String phone;
// //
// //       @Column(length = 255, nullable = false)
// //       private String password;   // BCrypt hashed
// //
// //       @Column(length = 20)
// //       private String role = "Staff";    // Staff | Admin | Manager
// //
// //       @Column(length = 20)
// //       private String status = "Active"; // Active | Inactive
// //
// //       @Column(name = "last_login")
// //       private LocalDateTime lastLogin;
// //
// //       @Column(name = "created_at")
// //       private LocalDateTime createdAt;
// //
// //       @Column(name = "updated_at")
// //       private LocalDateTime updatedAt;
// //
// //       @PrePersist
// //       protected void onCreate() {
// //           createdAt = LocalDateTime.now();
// //           updatedAt = LocalDateTime.now();
// //       }
// //
// //       @PreUpdate
// //       protected void onUpdate() { updatedAt = LocalDateTime.now(); }
// //
// //       // getters + setters or @Data (Lombok)
// //   }
// //
// // ── UserDTO.java ──────────────────────────────────────────────
// //
// //   public class UserDTO {
// //       private Long   id;
// //       private String username;
// //       private String fullName;
// //       private String email;
// //       private String phone;
// //       private String role;
// //       private String status;
// //       private String lastLogin;   // formatted string
// //       private String createdAt;   // formatted string
// //       // NO password field — never expose it
// //       // getters + setters or @Data (Lombok)
// //   }
// //
// // ── CreateUserRequest.java ────────────────────────────────────
// //
// //   public class CreateUserRequest {
// //       @NotBlank private String username;
// //       @NotBlank private String fullName;
// //       @NotBlank @Email private String email;
// //       private String phone;
// //       @NotBlank @Size(min = 6) private String password;
// //       private String confirmPassword;
// //       private String role   = "Staff";
// //       private String status = "Active";
// //       // getters + setters
// //   }
// //
// // ── UpdateUserRequest.java ────────────────────────────────────
// //
// //   public class UpdateUserRequest {
// //       @NotBlank private String username;
// //       @NotBlank private String fullName;
// //       @NotBlank @Email private String email;
// //       private String phone;
// //       private String role;
// //       private String status;
// //       // getters + setters
// //   }
// //
// // ── ResetPasswordRequest.java ─────────────────────────────────
// //
// //   public class ResetPasswordRequest {
// //       @NotBlank @Size(min = 6) private String newPassword;
// //       @NotBlank private String confirmPassword;
// //       // getters + setters
// //   }
// //
// // ── UserStatsDTO.java ─────────────────────────────────────────
// //
// //   public class UserStatsDTO {
// //       private long total;
// //       private long active;
// //       private long inactive;
// //       private long admins;
// //       // constructor + getters
// //   }
// //
// // ── UserDropdownDTO.java ──────────────────────────────────────
// //
// //   public class UserDropdownDTO {
// //       private Long   id;
// //       private String fullName;
// //       // constructor + getters
// //   }
// //
// // ── UserRepository.java ───────────────────────────────────────
// //
// //   @Repository
// //   public interface UserRepository extends JpaRepository<User, Long> {
// //       List<User> findAllByOrderByIdDesc();
// //       List<User> findByStatusOrderByIdDesc(String status);
// //       List<User> findByStatusOrderByFullNameAsc(String status);
// //       boolean existsByUsername(String username);
// //       boolean existsByEmail(String email);
// //       long countByStatus(String status);
// //       long countByRole(String role);
// //
// //       @Query("SELECT u FROM User u WHERE " +
// //              "LOWER(u.username) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
// //              "LOWER(u.fullName) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
// //              "LOWER(u.email)    LIKE LOWER(CONCAT('%', :q, '%')) OR " +
// //              "CAST(u.id AS string) LIKE CONCAT('%', :q, '%')")
// //       List<User> searchUsers(@Param("q") String query);
// //   }
// //
// // ─────────────────────────────────────────────────────────────
// // ── application.properties (PostgreSQL) ──────────────────────
// //
// //   spring.datasource.url=jdbc:postgresql://localhost:5432/travel_crm
// //   spring.datasource.username=postgres
// //   spring.datasource.password=yourpassword
// //   spring.datasource.driver-class-name=org.postgresql.Driver
// //   spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
// //   spring.jpa.hibernate.ddl-auto=update
// //   spring.jpa.show-sql=true
// //   server.port=8080
// //
// // ── .env (React — project root) ──────────────────────────────
// //
// //   REACT_APP_API_URL=http://localhost:8080
// //
// // ─────────────────────────────────────────────────────────────
// // ── PostgreSQL Schema ─────────────────────────────────────────
// //
// //   CREATE TABLE users (
// //     id          BIGSERIAL     PRIMARY KEY,
// //     username    VARCHAR(50)   NOT NULL UNIQUE,
// //     full_name   VARCHAR(255)  NOT NULL,
// //     email       VARCHAR(255)  NOT NULL UNIQUE,
// //     phone       VARCHAR(20),
// //     password    VARCHAR(255)  NOT NULL,
// //     role        VARCHAR(20)   DEFAULT 'Staff',
// //     status      VARCHAR(20)   DEFAULT 'Active',
// //     last_login  TIMESTAMP,
// //     created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
// //     updated_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
// //
// //     CONSTRAINT chk_role   CHECK (role   IN ('Staff','Admin','Manager')),
// //     CONSTRAINT chk_status CHECK (status IN ('Active','Inactive','Deleted'))
// //   );
// //
// //   -- Auto update updated_at
// //   CREATE OR REPLACE FUNCTION update_users_updated_at()
// //   RETURNS TRIGGER AS $$
// //   BEGIN
// //     NEW.updated_at = CURRENT_TIMESTAMP;
// //     RETURN NEW;
// //   END;
// //   $$ LANGUAGE plpgsql;
// //
// //   CREATE TRIGGER set_users_updated_at
// //   BEFORE UPDATE ON users
// //   FOR EACH ROW EXECUTE PROCEDURE update_users_updated_at();
// //
// //   -- Indexes for fast search & filter
// //   CREATE INDEX idx_users_status   ON users (status);
// //   CREATE INDEX idx_users_role     ON users (role);
// //   CREATE INDEX idx_users_email    ON users (email);
// //   CREATE INDEX idx_users_username ON users (username);
// //
// //   -- Seed data (passwords are BCrypt hashes of "Test@1234")
// //   INSERT INTO users (username, full_name, email, phone, password, role, status, last_login, created_at)
// //   VALUES
// //     ('Shreyash_Shahi',   'Shreyash Raghvendra Shahi', 'nepaltours.travels@gmail.com',     '+91 90990 97103', '$2a$12$xxx', 'Staff', 'Active',   '2026-06-18 10:53:00', '2026-06-13 00:00:00'),
// //     ('deepti_paul',      'Deepti Paul',               'pauldeepti74@gmail.com',            '+91 98765 00001', '$2a$12$xxx', 'Staff', 'Active',   NULL,                  '2026-05-30 00:00:00'),
// //     ('vaishnavi_jagtap', 'Vaishnavi Shrikant Jagtap', 'vaishnavisjagtap00@gmail.com',      '+91 98765 00002', '$2a$12$xxx', 'Staff', 'Active',   NULL,                  '2026-05-30 00:00:00'),
// //     ('testuser1',        'Test',                      'thombareprasad96@gmail.com',        '+91 98765 00003', '$2a$12$xxx', 'Staff', 'Active',   '2026-05-30 11:04:00', '2026-05-29 00:00:00'),
// //     ('admin_raj',        'Rajesh Kumar',              'rajesh.kumar@nepaltravel.com',       '+91 98765 00004', '$2a$12$xxx', 'Admin', 'Active',   '2026-06-19 09:00:00', '2026-05-29 00:00:00');
// // ─────────────────────────────────────────────────────────────







// src/services/profileUserService.js
// ─────────────────────────────────────────────────────────────
// Users page — API service.
// Talks to the real backend (/api/users, publicId + ApiResponse),
// adapting responses to the page model via userMappers.
// ─────────────────────────────────────────────────────────────

import API from "@shared/api/http";
import { mapUserFromApi, unwrap } from "./userMappers";

const userService = {
  // GET /api/users → mapped list
  getAll: async () => {
    const res = await API.get("/users");
    return { data: (unwrap(res) || []).map(mapUserFromApi) };
  },

  // GET /api/users/stats → { total, active, inactive, managers }
  getStats: async () => {
    const res = await API.get("/users/stats");
    return { data: unwrap(res) };
  },

  // GET /api/users/search?query=
  search: async (query) => {
    const res = await API.get("/users/search", { params: { query } });
    return { data: (unwrap(res) || []).map(mapUserFromApi) };
  },

  // DELETE /api/users/{publicId} (soft delete)
  delete: (publicId) => API.delete(`/users/${publicId}`),

  // PATCH /api/users/{publicId}/toggle-status
  toggleStatus: async (publicId) => {
    const res = await API.patch(`/users/${publicId}/toggle-status`);
    return { data: mapUserFromApi(unwrap(res)) };
  },

  // POST /api/users/{publicId}/reset-password
  resetPassword: (publicId, newPassword, confirmPassword) =>
    API.post(`/users/${publicId}/reset-password`, { newPassword, confirmPassword }),
};

export default userService;