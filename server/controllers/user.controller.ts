import type { Request, Response } from "express";
import db from "../config/db.config";

// GET /users/:id
export const getUserById = async (req: Request, res: Response) => {
  const userId = Number(req.params.id);

  const [rows]: any = await db.query(
    "SELECT id, email, created_at FROM users WHERE id = ?",
    [userId]
  );

  if (!rows.length) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(rows[0]);
};

// PUT /users/:id
export const updateUserById = async (req: Request, res: Response) => {
  const userId = Number(req.params.id);
  const { email } = req.body;

  await db.query(
    "UPDATE users SET email = ? WHERE id = ?",
    [email, userId]
  );

  res.json({ message: "User updated successfully" });
};

// GET /users/:id/events
export const getUserEvents = async (req: Request, res: Response) => {
  const userId = Number(req.params.id);

  const [rows]: any = await db.query(
    "SELECT * FROM events WHERE user_id = ?",
    [userId]
  );

  res.json(rows);
};
