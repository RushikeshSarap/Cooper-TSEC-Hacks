import type { Request, Response, NextFunction } from "express";
import db from "../config/db.config";

export const isEventParticipant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { categoryId } = req.params;
  const userId = req.user!.id;

  const [rows]: any = await db.query(
    `
    SELECT ep.id
    FROM event_participants ep
    JOIN expense_categories ec ON ec.event_id = ep.event_id
    WHERE ec.id = ? AND ep.user_id = ?
    `,
    [categoryId, userId]
  );

  if (!rows.length) {
    return res.status(403).json({ message: "Not an event participant" });
  }

  next();
};
