import type { JwtPayload } from "jsonwebtoken";

export interface JwtUserPayload extends JwtPayload {
  id: number;
  email: string;
}

