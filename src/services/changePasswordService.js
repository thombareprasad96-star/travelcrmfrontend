// src/services/authService.js
// ─────────────────────────────────────────────────────────────
// Auth / Change Password Service
// Backend: Java Spring Boot + PostgreSQL
// ─────────────────────────────────────────────────────────────

import API from "@shared/api/http";

// ═════════════════════════════════════════════════════════════
// AUTH SERVICE
// ═════════════════════════════════════════════════════════════
const authService = {

  // ── CHANGE PASSWORD ────────────────────────────────────────
  // POST /api/auth/change-password
  // @PostMapping("/api/auth/change-password")
  // public ResponseEntity<MessageResponse> changePassword(
  //     @RequestBody ChangePasswordRequest request)
  //
  // Request body:
  // {
  //   currentPassword: "OldPass@123",
  //   newPassword:     "NewPass@456"
  // }
  //
  // Response (success 200):
  // { message: "Password changed successfully." }
  //
  // Response (error 400):
  // { message: "Current password is incorrect." }
  changePassword: (currentPassword, newPassword) => {
    return API.post("/auth/change-password", {
      currentPassword,
      newPassword,
    });
  },

  // ── LOGOUT ALL SESSIONS (optional) ────────────────────────
  // POST /api/auth/logout-all
  // @PostMapping("/api/auth/logout-all")
  // public ResponseEntity<MessageResponse> logoutAll()
  //
  // Invalidates all refresh tokens for the current user.
  // Called automatically by the backend after changePassword,
  // but can also be triggered manually from a "Security" page.
  logoutAll: () => {
    return API.post("/auth/logout-all");
  },
};

export default authService;


// ═════════════════════════════════════════════════════════════
// HOW TO USE IN ChangePassword.jsx
// ═════════════════════════════════════════════════════════════
//
// 1. IMPORT:
//    import authService from "../services/authService";
//
// 2. REPLACE mock handleSubmit with:
//
//    const handleSubmit = async (e) => {
//      e.preventDefault();
//      const errs = validate();
//      if (Object.keys(errs).length) { setErrors(errs); return; }
//      setSaving(true);
//      try {
//        await authService.changePassword(current, newPass);
//        showToast("Password changed successfully! ✅");
//        setCurrent(""); setNewPass(""); setConfirm(""); setErrors({});
//        setTimeout(() => navigate("/Settings"), 2000);
//      } catch (err) {
//        showToast(
//          err?.response?.data?.message || "Failed to change password.",
//          "error"
//        );
//      } finally {
//        setSaving(false);
//      }
//    };
//
// ═════════════════════════════════════════════════════════════
// SPRING BOOT JAVA BACKEND — FULL REFERENCE
// ═════════════════════════════════════════════════════════════
//
// ── ChangePasswordRequest.java ────────────────────────────────
//
//   public class ChangePasswordRequest {
//       @NotBlank private String currentPassword;
//       @NotBlank @Size(min=6) private String newPassword;
//       // getters + setters or @Data (Lombok)
//   }
//
// ── AuthController.java ───────────────────────────────────────
//
//   @RestController
//   @RequestMapping("/api/auth")
//   @CrossOrigin(origins = "http://localhost:3000")
//   public class AuthController {
//
//       @Autowired private AuthService authService;
//
//       @PostMapping("/change-password")
//       public ResponseEntity<?> changePassword(
//               @RequestBody ChangePasswordRequest request,
//               @AuthenticationPrincipal UserDetails userDetails) {
//           authService.changePassword(
//               userDetails.getUsername(),
//               request.getCurrentPassword(),
//               request.getNewPassword()
//           );
//           return ResponseEntity.ok(
//               Map.of("message", "Password changed successfully.")
//           );
//       }
//
//       @PostMapping("/logout-all")
//       public ResponseEntity<?> logoutAll(
//               @AuthenticationPrincipal UserDetails userDetails) {
//           authService.invalidateAllSessions(userDetails.getUsername());
//           return ResponseEntity.ok(
//               Map.of("message", "All sessions invalidated.")
//           );
//       }
//   }
//
// ── AuthService.java ──────────────────────────────────────────
//
//   @Service
//   public class AuthService {
//
//       @Autowired private UserRepository userRepo;
//       @Autowired private PasswordEncoder passwordEncoder;
//       @Autowired private RefreshTokenRepository tokenRepo;  // if using refresh tokens
//
//       @Transactional
//       public void changePassword(String username,
//                                  String currentPassword,
//                                  String newPassword) {
//           User user = userRepo.findByEmail(username)
//               .orElseThrow(() -> new RuntimeException("User not found"));
//
//           // Verify current password
//           if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
//               throw new ResponseStatusException(
//                   HttpStatus.BAD_REQUEST,
//                   "Current password is incorrect."
//               );
//           }
//
//           // Prevent reuse of same password
//           if (passwordEncoder.matches(newPassword, user.getPassword())) {
//               throw new ResponseStatusException(
//                   HttpStatus.BAD_REQUEST,
//                   "New password must differ from current password."
//               );
//           }
//
//           // Save hashed new password
//           user.setPassword(passwordEncoder.encode(newPassword));
//           userRepo.save(user);
//
//           // Invalidate all other active sessions / refresh tokens
//           tokenRepo.deleteAllByUser(user);
//       }
//
//       public void invalidateAllSessions(String username) {
//           User user = userRepo.findByEmail(username).orElseThrow();
//           tokenRepo.deleteAllByUser(user);
//       }
//   }
//
// ── application.properties (PostgreSQL) ──────────────────────
//
//   spring.datasource.url=jdbc:postgresql://localhost:5432/travel_crm
//   spring.datasource.username=postgres
//   spring.datasource.password=yourpassword
//   spring.datasource.driver-class-name=org.postgresql.Driver
//   spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
//   spring.jpa.hibernate.ddl-auto=update
//   server.port=8080
//
// ── .env (React) ──────────────────────────────────────────────
//
//   REACT_APP_API_URL=http://localhost:8080
//
// ── PostgreSQL Schema ─────────────────────────────────────────
//
//   CREATE TABLE users (
//     id           BIGSERIAL PRIMARY KEY,
//     email        VARCHAR(255) NOT NULL UNIQUE,
//     password     VARCHAR(255) NOT NULL,   -- BCrypt hashed
//     name         VARCHAR(255),
//     role         VARCHAR(50)  DEFAULT 'USER',
//     status       VARCHAR(20)  DEFAULT 'Active',
//     created_at   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
//     updated_at   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
//   );
//
//   -- Optional: refresh tokens table (for session invalidation)
//   CREATE TABLE refresh_tokens (
//     id          BIGSERIAL PRIMARY KEY,
//     user_id     BIGINT       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
//     token       TEXT         NOT NULL UNIQUE,
//     expires_at  TIMESTAMP    NOT NULL,
//     created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
//   );
//
//   CREATE INDEX idx_refresh_tokens_user ON refresh_tokens (user_id);
//   CREATE INDEX idx_refresh_tokens_token ON refresh_tokens (token);
// ─────────────────────────────────────────────────────────────