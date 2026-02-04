import type { Request, Response } from "express";
import db from "../config/db.config";
import { createPaymentIntent, getPaymentIntent } from "../services/finternet.service";

export const addPayment = async (req: Request, res: Response) => {
  // let amount: string = "10";
  // let currency: string = "USD";
  // let description: string = "Event payment";
  const { amount, currency, description } = req.body;
  const { eventId } = req.params;

  // const userId = 1;

  if (!amount || !currency) {
    return res.status(400).json({ error: "Amount and currency required" });
  }

  try {
    // 1️⃣ Create a payment intent on Finternet
    const paymentIntent = await createPaymentIntent(amount, currency, description);

    // 2️⃣ Save intent.id, eventId, userId in your DB
    await db.query(
      "INSERT INTO event_payments (event_id, user_id, intent_id, amount, status) VALUES (?, ?, ?, ?, ?)",
      [eventId, req.user!.id, paymentIntent.id, amount, paymentIntent.status]
    );

    // 3️⃣ Return the payment URL to frontend
    res.json({
      paymentUrl: paymentIntent.paymentUrl,
      intentId: paymentIntent.id,
      status: paymentIntent.status,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create payment" });
    res.end();
  }
};

export const createEvent = async (req: Request, res: Response) => {
  const { name, description } = req.body;

  const [result]: any = await db.query(
    "INSERT INTO events (name, description, created_by) VALUES (?, ?, ?)",
    [name, description, req.user!.id]
  );

  // creator automatically joins
  await db.query(
    "INSERT INTO event_participants (event_id, user_id) VALUES (?, ?)",
    [result.insertId, req.user!.id]
  );

  res.status(201).json({
    message: "Event created",
    eventId: result.insertId
  });
};

export const getAllEvents = async (req: Request, res: Response) => {
  const [rows]: any = await db.query(
    `
    SELECT e.*
    FROM events e
    JOIN event_participants ep ON ep.event_id = e.id
    WHERE ep.user_id = ?
    `,
    [req.user!.id]
  );
  res.json(rows);
};

/* Core */
export const getEventById = async (req: Request, res: Response) => {
  const [rows]: any = await db.query(
    "SELECT * FROM events WHERE id = ?",
    [req.params.eventId]
  );
  res.json(rows[0]);
};

export const joinEvent = async (req: Request, res: Response) => {
  const eventId = Number(req.params.eventId);

  await db.query(
    "INSERT IGNORE INTO event_participants (event_id, user_id) VALUES (?, ?)",
    [eventId, req.user!.id]
  );

  res.json({ message: "Joined event" });
};

export const removeParticipant = async (req: Request, res: Response) => {
  const eventId = Number(req.params.eventId);
  const userId = Number(req.params.userId);

  await db.query(
    "DELETE FROM event_participants WHERE event_id = ? AND user_id = ?",
    [eventId, userId]
  );
  res.json({ message: "Participant removed" });
};

export const updateEvent = async (req: Request, res: Response) => {
  await db.query(
    "UPDATE events SET ? WHERE id = ?",
    [req.body, req.params.eventId]
  );
  res.json({ message: "Event updated" });
};

export const deleteEvent = async (req: Request, res: Response) => {
  await db.query(
    "DELETE FROM events WHERE id = ?",
    [req.params.eventId]
  );
  res.json({ message: "Event deleted" });
};

/* Participation */
export const inviteUser = async (req: Request, res: Response) => {
  const { userId } = req.body;
  const eventId = req.params.eventId;

  // Check if user exists
  const [userRows]: any = await db.query(
    "SELECT id FROM users WHERE id = ?",
    [userId]
  );
  if (!userRows.length) {
    return res.status(404).json({ message: "User not found" });
  }

  // Check if already a participant
  const [participantRows]: any = await db.query(
    "SELECT id FROM event_participants WHERE event_id = ? AND user_id = ?",
    [eventId, userId]
  );
  if (participantRows.length) {
    return res.status(400).json({ message: "User is already a participant" });
  }

  await db.query(
    "INSERT INTO event_participants (event_id, user_id) VALUES (?, ?)",
    [eventId, userId]
  );
  res.json({ message: "User invited successfully" });
};

export const getParticipants = async (req: Request, res: Response) => {
  const [rows]: any = await db.query(
    "SELECT user_id FROM event_participants WHERE event_id = ?",
    [req.params.eventId]
  );
  res.json(rows);
};

/* Wallet */
export const depositToEvent = async (req: Request, res: Response) => {
  await db.query(
    "INSERT INTO deposits (event_id, user_id, amount) VALUES (?, ?, ?)",
    [req.params.eventId, req.user!.id, req.body.amount]
  );
  res.json({ message: "Deposit successful" });
};

export const getWallet = async (req: Request, res: Response) => {
  const [rows]: any = await db.query(
    "SELECT SUM(amount) as balance FROM deposits WHERE event_id = ? AND user_id = ?",
    [req.params.eventId, req.user!.id]
  );
  res.json(rows[0]);
};

export const getDeposits = async (req: Request, res: Response) => {
  const [rows]: any = await db.query(
    "SELECT * FROM deposits WHERE event_id = ?",
    [req.params.eventId]
  );
  res.json(rows);
};

/* Rules & categories */
export const addCategory = async (req: Request, res: Response) => {
  await db.query(
    "INSERT INTO expense_categories (event_id, name) VALUES (?, ?)",
    [req.params.eventId, req.body.name]
  );
  res.json({ message: "Category added" });
};

export const getCategories = async (req: Request, res: Response) => {
  const [rows]: any = await db.query(
    "SELECT * FROM expense_categories WHERE event_id = ?",
    [req.params.eventId]
  );
  res.json(rows);
};

export const addRule = async (req: Request, res: Response) => {
  const { maxAmount, allowedRoles, approvalRequired } = req.body;
  await db.query(
    "INSERT INTO payment_rules (event_id, max_amount, allowed_roles, approval_required) VALUES (?, ?, ?, ?)",
    [req.params.eventId, maxAmount, allowedRoles, approvalRequired]
  );
  res.json({ message: "Rule added" });
};

export const getRules = async (req: Request, res: Response) => {
  const [rows]: any = await db.query(
    "SELECT * FROM payment_rules WHERE event_id = ?",
    [req.params.eventId]
  );
  res.json(rows);
};

/* Payments & settlement */


export const getPayments = async (req: Request, res: Response): Promise<void> => {
  const { eventId } = req.params;

  try {
    const payments: any[] = await db.query(
      "SELECT * FROM event_payments WHERE event_id = ?",
      [eventId]
    );

    // Optional: fetch real-time status from Finternet
    for (let p of payments) {
      if (p.status !== "SUCCESS") {
        const intent = await getPaymentIntent(p.intent_id);
        p.status = intent.status; // update status if changed
      }
    }

    res.json(payments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch payments" });
  }
};


export const settleEvent = async (req: Request, res: Response) => {
  // settlement logic placeholder
  res.json({ message: "Event settled" });
};

export const getSettlement = async (req: Request, res: Response) => {
  const [rows]: any = await db.query(
    "SELECT * FROM settlements WHERE event_id = ?",
    [req.params.eventId]
  );
  res.json(rows);
};

/* Reports */
export const getSummary = async (req: Request, res: Response) => {
  res.json({ message: "Summary generated" });
};

export const getLedger = async (req: Request, res: Response) => {
  const [rows]: any = await db.query(
    "SELECT * FROM ledger WHERE event_id = ?",
    [req.params.eventId]
  );
  res.json(rows);
};