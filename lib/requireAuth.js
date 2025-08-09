import { jwtDecode } from "jwt-decode";

/**
 * Role check helper
 * @param {object} session - Auth0 session
 * @param {object} opts - Optional { roles: ["admin", "manager"] }
 */
export function requireAuth(session, opts = {}) {
  if (!session || !session.user) {
    return { authorized: false, reason: "unauthorized" };
  }

  if (opts.roles && opts.roles.length > 0) {
    const token = session.tokenSet?.accessToken;
    if (token) {
      const decoded = jwtDecode(token);
      const userRoles = decoded["https://healthcare.com/roles"] || [];
      const hasRole = opts.roles.some(r => userRoles.includes(r));

      if (!hasRole) {
        return { authorized: false};
      }
    }
  }

  return { authorized: true };
}
