import type { Request, Response, NextFunction } from "express";
import db from "../config/db.config.js";

export const isEventParticipant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { categoryId } = req.params;
  const userId = req.user!.id;

  const result = await db.query(
    `
    SELECT ep.id
    FROM event_participants ep
    JOIN expense_categories ec ON ec.event_id = ep.event_id
    WHERE ec.id = $1 AND ep.user_id = $2
    `,
    [categoryId, userId]
  );

  if (result.rows.length === 0) {
    return res.status(403).json({ message: "Not an event participant" });
  }

  next();
};
