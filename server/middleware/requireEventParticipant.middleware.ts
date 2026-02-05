import type { Request, Response, NextFunction } from "express";
import db from "../config/db.config.js";

export const requireEventParticipant = async (
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
    "SELECT 1 FROM event_participants WHERE event_id = $1 AND user_id = $2",
    [eventId, userId]
  );

  if (result.rows.length === 0) {
    return res.status(403).json({ message: "Not a participant" });
  }

  next();
};
