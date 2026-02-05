import type { Request, Response, NextFunction } from "express";
import db from "../config/db.config.js";

export const isOrganizer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { categoryId } = req.params;
  const userId = req.user!.id;

  const result = await db.query(
    `
    SELECT ep.role
    FROM event_participants ep
    JOIN expense_categories ec ON ec.event_id = ep.event_id
    WHERE ec.id = $1 AND ep.user_id = $2
    `,
    [categoryId, userId]
  );

  if (result.rows.length === 0 || result.rows[0].role !== "organizer") {
    return res.status(403).json({ message: "Organizer access required" });
  }

  next();
};
