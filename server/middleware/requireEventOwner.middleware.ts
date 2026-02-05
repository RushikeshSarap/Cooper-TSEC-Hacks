import type { Request, Response, NextFunction } from "express";
import db from "../config/db.config.js";

export const requireEventOwner = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const eventId = Number(req.params.eventId);
  const userId = req.user!.id;

  if (isNaN(eventId)) {
    return res.status(400).json({ message: "Invalid event ID" });
  }

  const result = await db.query(
    "SELECT created_by FROM events WHERE id = $1",
    [eventId]
  );

  if (result.rows.length === 0 || result.rows[0].created_by !== userId) {
    return res.status(403).json({ message: "Forbidden" });
  }

  next();
};
