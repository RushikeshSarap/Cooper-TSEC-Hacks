import type { Request, Response } from "express";
import db from "../config/db.config.js";

/* ================= UPDATE CATEGORY ================= */
export const updateCategory = async (req: Request, res: Response) => {
  const { categoryId } = req.params;
  const { name, totalAmount } = req.body;

  await db.query(
    `UPDATE expense_categories
     SET name = $1, total_amount = $2
     WHERE id = $3`,
    [name, totalAmount, categoryId]
  );

  res.json({ message: "Category updated successfully" });
};


/* ================= JOIN CATEGORY ================= */
export const joinCategory = async (req: Request, res: Response) => {
  const { categoryId } = req.params;
  const userId = (req as any).user.id;

  await db.query(
    `
    INSERT INTO category_participants (category_id, user_id)
    VALUES ($1, $2)
    ON CONFLICT (category_id, user_id) DO NOTHING
    `,
    [categoryId, userId]
  );

  res.json({ message: "Joined category" });
};


/* ================= LEAVE CATEGORY ================= */
export const leaveCategory = async (req: Request, res: Response) => {
  const { categoryId } = req.params;
  const userId = (req as any).user.id;

  await db.query(
    `
    DELETE FROM category_participants
    WHERE category_id = $1 AND user_id = $2
    `,
    [categoryId, userId]
  );

  res.json({ message: "Left category" });
};


/* ================= GET PARTICIPANTS ================= */
export const getCategoryParticipants = async (
  req: Request,
  res: Response
) => {
  const { categoryId } = req.params;

  const result = await db.query(
    `
    SELECT u.id, u.name, u.email
    FROM users u
    JOIN category_participants cp ON cp.user_id = u.id
    WHERE cp.category_id = $1
    `,
    [categoryId]
  );

  res.json(result.rows);
};


/* ================= UPLOAD BILL ================= */
export const uploadBill = async (req: Request, res: Response) => {
  const { categoryId } = req.params;
  const { imageUrl, extractedAmount, merchant } = req.body;
  const userId = (req as any).user.id;

  await db.query(
    `
    INSERT INTO bills
    (category_id, image_url, extracted_amount, merchant, uploaded_by)
    VALUES ($1, $2, $3, $4, $5)
    `,
    [categoryId, imageUrl, extractedAmount, merchant, userId]
  );

  res.status(201).json({ message: "Bill uploaded successfully" });
};


/* ================= GET BILLS ================= */
export const getBills = async (req: Request, res: Response) => {
  const { categoryId } = req.params;

  const result = await db.query(
    `
    SELECT *
    FROM bills
    WHERE category_id = $1
    ORDER BY created_at DESC
    `,
    [categoryId]
  );

  res.json(result.rows);
};
