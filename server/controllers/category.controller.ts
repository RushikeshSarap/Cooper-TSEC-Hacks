import type { Request, Response } from "express";
import db from "../config/db.config";

export const updateCategory = async (req: Request, res: Response) => {
  const { categoryId } = req.params;
  const { name, totalAmount } = req.body;

  await db.query(
    `UPDATE expense_categories SET name = ?, total_amount = ? WHERE id = ?`,
    [name, totalAmount,  categoryId]
  );

  res.json({ message: "Category updated successfully" });
};

export const joinCategory = async (req: Request, res: Response) => {
  const { categoryId } = req.params;
  const userId = req.user!.id;

  await db.query(
    `
    INSERT IGNORE INTO category_participants (category_id, user_id)
    VALUES (?, ?)
    `,
    [categoryId, userId]
  );

  res.json({ message: "Joined category" });
};

export const leaveCategory = async (req: Request, res: Response) => {
  const { categoryId } = req.params;
  const userId = req.user!.id;

  await db.query(
    `
    DELETE FROM category_participants
    WHERE category_id = ? AND user_id = ?
    `,
    [categoryId, userId]
  );

  res.json({ message: "Left category" });
};

export const getCategoryParticipants = async (
  req: Request,
  res: Response
) => {
  const { categoryId } = req.params;

  const [rows]: any = await db.query(
    `
    SELECT u.id, u.name, u.email
    FROM users u
    JOIN category_participants cp ON cp.user_id = u.id
    WHERE cp.category_id = ?
    `,
    [categoryId]
  );

  res.json(rows);
};

export const uploadBill = async (req: Request, res: Response) => {
  const { categoryId } = req.params;
  const { imageUrl, extractedAmount, merchant } = req.body;
  const userId = req.user!.id;

  await db.query(
    `
    INSERT INTO bills (category_id, image_url, extracted_amount, merchant, uploaded_by)
    VALUES (?, ?, ?, ?, ?)
    `,
    [categoryId, imageUrl, extractedAmount, merchant, userId]
  );

  res.status(201).json({ message: "Bill uploaded successfully" });
};

export const getBills = async (req: Request, res: Response) => {
  const { categoryId } = req.params;

  const [rows]: any = await db.query(
    `
    SELECT *
    FROM bills
    WHERE category_id = ?
    ORDER BY created_at DESC
    `,
    [categoryId]
  );

  res.json(rows);
};
