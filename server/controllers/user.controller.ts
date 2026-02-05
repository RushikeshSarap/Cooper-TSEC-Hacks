import type { Request, Response } from "express";
import db from "../config/db.config.js";
import { createPaymentIntent } from "../services/finternet.service.js";

// GET /users/:id
export const getUserById = async (req: Request, res: Response) => {
  const [rows]: any = await db.query(
    "SELECT id, name, email, wallet_balance FROM users WHERE id = ?",
    [req.params.id]
  );
  res.json(rows[0]);
};

export const depositToWallet = async (req: Request, res: Response) => {
  const userId = (req.user as any).id;
  const { amount, paymentMethod } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ message: "Invalid amount" });
  }

  try {
    console.log(`Processing ${paymentMethod || 'card'} deposit for user ${userId}`);

    // 1. Create intent on Finternet
    const intent = await createPaymentIntent(
      amount.toString(),
      "USD",
      "Wallet Deposit"
    );

    // 2. Update local wallet balance immediately (Mocking success for prototype)
    // In production, we would wait for webhook confirmation.
    await db.query(
      "UPDATE users SET wallet_balance = wallet_balance + ? WHERE id = ?",
      [amount, userId]
    );

    // 3. Log the transaction (optional, creates basic ledger)
    // Check if ledger table exists? The user prompt mentioned ledger API.
    // Assuming no personal ledger table yet, skipping or creating one if needed.
    // There is 'deposits' table: event_id, user_id, amount.
    // If this is a GENERAL deposit, event_id is null? Schema says event_id NOT NULL.
    // So we can't use 'deposits' table for personal wallet unless we relax constraint.
    // We'll stick to updating users.wallet_balance for now.

    res.json({
      message: "Deposit initiated",
      newBalance: await getUserBalance(userId),
      paymentIntent: intent
    });

  } catch (error: any) {
    console.error("Deposit error:", error);
    res.status(500).json({ message: "Deposit failed" });
  }
};

const getUserBalance = async (userId: number) => {
  const [rows]: any = await db.query("SELECT wallet_balance FROM users WHERE id = ?", [userId]);
  return rows[0]?.wallet_balance || 0;
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
