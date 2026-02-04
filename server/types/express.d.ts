import { JwtPayload } from "../server/node_modules/@types/jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
      };
    }
  }
}

