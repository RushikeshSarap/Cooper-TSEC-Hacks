/* =========================
   Auth & User Types
========================= */

export type UserRole = "organizer" | "member";

/**
 * User entity (DB / API)
 */
export interface User {
  id: string;
  name: string;
  email: string;
  role?: UserRole;
  createdAt: string;
}

/* =========================
   Auth Requests
========================= */

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

/* =========================
   Auth Responses
========================= */

export interface AuthResponse {
  token: string;
  user: User;
}

/* =========================
   JWT Payload
========================= */

// export interface JwtPayload {
//   userId: string;
//   email?: string;
// }
import type { JwtPayload } from "jsonwebtoken";

export interface AuthJwtPayload extends JwtPayload {
  id: number;
  email: string;
}
