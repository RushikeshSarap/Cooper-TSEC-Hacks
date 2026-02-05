import type { Request, Response } from "express";
import db from "../config/db.config.js";
import { createPaymentIntent } from "../services/finternet.service.js";

// ⚠️ URGENT: your Postgres users table schema does NOT contain wallet_balance column.
// Either add it to schema or remove wallet logic below.

// GET /users/:id
export const getUserById = async (req: Request, res: Response) => {
  const result = await db.query(
    `SELECT id, name, email, wallet_balance
     FROM users
     WHERE id = $1`,
    [req.params.id]
  );

  res.json(result.rows[0]);
};


export const depositToWallet = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { amount, paymentMethod } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ message: "Invalid amount" });
  }

  try {
    console.log(`Processing ${paymentMethod || "card"} deposit for user ${userId}`);

    const intent = await createPaymentIntent(
      amount.toString(),
      "USD",
      "Wallet Deposit"
    );

    await db.query(
      `UPDATE users
       SET wallet_balance = wallet_balance + $1
       WHERE id = $2`,
      [amount, userId]
    );

    res.json({
      message: "Deposit initiated",
      newBalance: await getUserBalance(userId),
      paymentIntent: intent
    });

  } catch (error) {
    console.error("Deposit error:", error);
    res.status(500).json({ message: "Deposit failed" });
  }
};


const getUserBalance = async (userId: number) => {
  const result = await db.query(
    `SELECT wallet_balance FROM users WHERE id = $1`,
    [userId]
  );
  return result.rows[0]?.wallet_balance || 0;
};


// PUT /users/:id
export const updateUserById = async (req: Request, res: Response) => {
  const userId = Number(req.params.id);
  const { email } = req.body;

  await db.query(
    `UPDATE users SET email = $1 WHERE id = $2`,
    [email, userId]
  );

  res.json({ message: "User updated successfully" });
};


// GET /users/:id/events
// ⚠️ URGENT: events table uses created_by, not user_id
export const getUserEvents = async (req: Request, res: Response) => {
  const userId = Number(req.params.id);

  const result = await db.query(
    `SELECT * FROM events WHERE created_by = $1`,
    [userId]
  );

  res.json(result.rows);
};
