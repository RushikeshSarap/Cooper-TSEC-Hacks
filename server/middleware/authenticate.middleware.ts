import type { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import type  { Request, Response, NextFunction } from "express";

// extend Request type
declare module "express-serve-static-core" {
  interface Request {
    user?: string | JwtPayload;
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  console.log("Auth Middleware: Header:", authHeader); // DEBUG
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("Auth Middleware: No Bearer token found"); // DEBUG
    return res.status(401).json({ message: "No token provided" });
  }

  // extract token (could be undefined)
  const token = authHeader.split(" ")[1];
  if (typeof token !== "string" || token.length === 0) {
    return res.status(401).json({ message: "Invalid token" });
  }

  const secretKey = process.env.JWT_SECRET;
  if (typeof secretKey !== "string" || secretKey.length === 0) {
    console.error("JWT_SECRET missing");
    return res.status(500).json({ message: "Server configuration error" });
  }

  try {
    // TS now knows token and secretKey are strings
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};