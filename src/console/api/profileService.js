import ConsoleAPI, { unwrap } from "./consoleHttp";

/**
 * The SuperAdmin's own account.
 *
 * Distinct from userService, which administers TENANT users: `userService.resetPassword` acts on
 * someone else's account by publicId and needs no current password. This one is self-service and
 * proves possession of the existing password first.
 */
const profileService = {
  /** GET the authenticated SuperAdmin's profile. */
  me: () => ConsoleAPI.get("/super-admin/me").then(unwrap),

  /**
   * Change the SuperAdmin's own password.
   *
   * This is the ONLY way to rotate it. The account is created at the first boot from
   * SUPER_ADMIN_PASSWORD in the server's env file, and that runner is a no-op once the row exists —
   * so editing the env file afterwards does nothing. The tenant flow at /auth/change-password 401s
   * a SuperAdmin principal outright.
   */
  changePassword: ({ currentPassword, newPassword }) =>
    ConsoleAPI.post("/super-admin/me/change-password", { currentPassword, newPassword }).then(unwrap),
};

export default profileService;
