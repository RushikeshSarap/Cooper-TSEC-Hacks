import type { Request, Response } from "express";
import db from "../config/db.config.js";
import { createPaymentIntent, getPaymentIntent } from "../services/finternet.service.js";

/* ================= PAYMENTS ================= */

export const addPayment = async (req: Request, res: Response) => {
  const { amount, currency, description } = req.body;
  const { eventId } = req.params;

  if (!amount || !currency) {
    return res.status(400).json({ error: "Amount and currency required" });
  }

  try {
    const paymentIntent = await createPaymentIntent(amount, currency, description);

    await db.query(
      `INSERT INTO payments (event_id, paid_by, gateway_txn_id, amount)
       VALUES ($1, $2, $3, $4)`,
      [eventId, (req as any).user.id, paymentIntent.id, amount]
    );

    res.json({
      paymentUrl: paymentIntent.paymentUrl,
      intentId: paymentIntent.id,
      status: paymentIntent.status,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create payment" });
  }
};


export const addExpense = async (req: Request, res: Response) => {
  const { amount, description, categoryId, date } = req.body;
  const { eventId } = req.params;

  if (!amount || !description) {
    return res.status(400).json({ error: "Amount and description required" });
  }

  try {
    await db.query(
      `INSERT INTO payments
       (event_id, paid_by, amount, description, category_id, created_at)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        eventId,
        (req as any).user.id,
        amount,
        description,
        categoryId || null,
        date || new Date(),
      ]
    );

    res.json({ message: "Expense added" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add expense" });
  }
};


/* ================= EVENTS ================= */

export const createEvent = async (req: Request, res: Response) => {
  const { name, description, startDate, endDate, budget } = req.body;

  const result = await db.query(
    `INSERT INTO events
     (name, description, start_date, end_date, total_budget, created_by)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id`,
    [name, description, startDate, endDate, budget, (req as any).user.id]
  );

  const eventId = result.rows[0].id;

  await db.query(
    `INSERT INTO event_participants (event_id, user_id)
     VALUES ($1, $2)`,
    [eventId, (req as any).user.id]
  );

  res.status(201).json({ message: "Event created", eventId });
};


export const getAllEvents = async (req: Request, res: Response) => {
  const result = await db.query(
    `
    SELECT e.*
    FROM events e
    JOIN event_participants ep ON ep.event_id = e.id
    WHERE ep.user_id = $1
    `,
    [(req as any).user.id]
  );
  res.json(result.rows);
};


export const getEventById = async (req: Request, res: Response) => {
  const eventId = req.params.eventId;

  const eventRes = await db.query(
    `SELECT * FROM events WHERE id = $1`,
    [eventId]
  );

  if (!eventRes.rows.length) {
    return res.status(404).json({ message: "Event not found" });
  }

  const event = eventRes.rows[0];

  const partRes = await db.query(
    `SELECT COUNT(*)::int as count
     FROM event_participants
     WHERE event_id = $1`,
    [eventId]
  );
  event.participant_count = partRes.rows[0].count;

  const spentRes = await db.query(
    `SELECT COALESCE(SUM(amount),0) as total
     FROM payments
     WHERE event_id = $1`,
    [eventId]
  );
  event.current_spent = spentRes.rows[0].total;

  res.json(event);
};


export const joinEvent = async (req: Request, res: Response) => {
  const eventId = Number(req.params.eventId);

  await db.query(
    `
    INSERT INTO event_participants (event_id, user_id)
    VALUES ($1, $2)
    ON CONFLICT (event_id, user_id) DO NOTHING
    `,
    [eventId, (req as any).user.id]
  );

  res.json({ message: "Joined event" });
};


export const removeParticipant = async (req: Request, res: Response) => {
  await db.query(
    `DELETE FROM event_participants
     WHERE event_id = $1 AND user_id = $2`,
    [req.params.eventId, req.params.userId]
  );
  res.json({ message: "Participant removed" });
};


export const updateEvent = async (req: Request, res: Response) => {
  const { name, description, startDate, endDate, totalBudget, status } = req.body;

  await db.query(
    `
    UPDATE events SET
      name = $1,
      description = $2,
      start_date = $3,
      end_date = $4,
      total_budget = $5,
      status = $6
    WHERE id = $7
    `,
    [name, description, startDate, endDate, totalBudget, status, req.params.eventId]
  );

  res.json({ message: "Event updated" });
};


export const deleteEvent = async (req: Request, res: Response) => {
  await db.query(
    `DELETE FROM events WHERE id = $1`,
    [req.params.eventId]
  );
  res.json({ message: "Event deleted" });
};


/* ================= PARTICIPANTS ================= */

export const inviteUser = async (req: Request, res: Response) => {
  const { userId } = req.body;
  const eventId = req.params.eventId;

  const userRes = await db.query(
    `SELECT id FROM users WHERE id = $1`,
    [userId]
  );
  if (!userRes.rows.length) {
    return res.status(404).json({ message: "User not found" });
  }

  await db.query(
    `
    INSERT INTO event_participants (event_id, user_id)
    VALUES ($1, $2)
    ON CONFLICT (event_id, user_id) DO NOTHING
    `,
    [eventId, userId]
  );

  res.json({ message: "User invited successfully" });
};


export const getParticipants = async (req: Request, res: Response) => {
  const result = await db.query(
    `
    SELECT ep.id as participant_id, ep.role,
           u.id as user_id, u.name, u.email
    FROM event_participants ep
    JOIN users u ON ep.user_id = u.id
    WHERE ep.event_id = $1
    `,
    [req.params.eventId]
  );

  const participants = result.rows.map((row: any) => ({
    id: row.participant_id,
    user: {
      id: row.user_id,
      name: row.name,
      email: row.email,
      balance: 0
    },
    role: row.role,
    depositAmount: 0,
    spentAmount: 0,
    balance: 0,
    joinedAt: new Date().toISOString()
  }));

  res.json(participants);
};


/* ================= WALLET ================= */

export const depositToEvent = async (req: Request, res: Response) => {
  await db.query(
    `INSERT INTO deposits (event_id, user_id, amount)
     VALUES ($1, $2, $3)`,
    [req.params.eventId, (req as any).user.id, req.body.amount]
  );
  res.json({ message: "Deposit successful" });
};


export const getWallet = async (req: Request, res: Response) => {
  const result = await db.query(
    `
    SELECT COALESCE(SUM(amount),0) as balance
    FROM deposits
    WHERE event_id = $1 AND user_id = $2
    `,
    [req.params.eventId, (req as any).user.id]
  );
  res.json(result.rows[0]);
};


export const getDeposits = async (req: Request, res: Response) => {
  const result = await db.query(
    `SELECT * FROM deposits WHERE event_id = $1`,
    [req.params.eventId]
  );
  res.json(result.rows);
};


/* ================= CATEGORIES ================= */

export const addCategory = async (req: Request, res: Response) => {
  await db.query(
    `INSERT INTO expense_categories (event_id, name)
     VALUES ($1, $2)`,
    [req.params.eventId, req.body.name]
  );
  res.json({ message: "Category added" });
};


export const getCategories = async (req: Request, res: Response) => {
  try {
    const result = await db.query(
      `SELECT * FROM expense_categories WHERE event_id = $1`,
      [req.params.eventId]
    );
    res.json(result.rows);
  } catch {
    res.json([]);
  }
};


/* ================= RULES ================= */

export const addRule = async (req: Request, res: Response) => {
  const { maxAmount, allowedRoles, approvalRequired } = req.body;

  await db.query(
    `INSERT INTO payment_rules
     (event_id, max_amount, allowed_roles, approval_required)
     VALUES ($1, $2, $3, $4)`,
    [req.params.eventId, maxAmount, allowedRoles, approvalRequired]
  );

  res.json({ message: "Rule added" });
};


export const getRules = async (req: Request, res: Response) => {
  try {
    const result = await db.query(
      `SELECT * FROM payment_rules WHERE event_id = $1`,
      [req.params.eventId]
    );
    res.json(result.rows);
  } catch {
    res.json([]);
  }
};


/* ================= FETCH PAYMENTS ================= */

export const getPayments = async (req: Request, res: Response): Promise<void> => {
  const { eventId } = req.params;

  try {
    const result = await db.query(
      `
      SELECT p.*, u.id as user_id, u.name as user_name, u.email as user_email
      FROM payments p
      JOIN users u ON p.paid_by = u.id
      WHERE p.event_id = $1
      `,
      [eventId]
    );

    const set = result.rows.map((row: any) => ({
      id: row.id,
      eventId: row.event_id,
      categoryId: row.category_id,
      description: row.description || "Payment",
      amount: row.amount,
      paidBy: {
        id: row.user_id,
        name: row.user_name,
        email: row.user_email
      },
      splitBetween: [],
      createdAt: row.created_at,
      status: "approved"
    }));

    res.json(set);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch payments" });
  }
};


/* ================= SETTLEMENT ================= */

export const settleEvent = async (_req: Request, res: Response) => {
  res.json({ message: "Event settled" });
};

export const getSettlement = async (req: Request, res: Response) => {
  const result = await db.query(
    `SELECT * FROM settlements WHERE event_id = $1`,
    [req.params.eventId]
  );
  res.json(result.rows);
};


/* ================= REPORTS ================= */

export const getSummary = async (_req: Request, res: Response) => {
  res.json({ message: "Summary generated" });
};

/* ⚠️ URGENT: ledger table does NOT exist in your schema */
export const getLedger = async (req: Request, res: Response) => {
  const result = await db.query(
    `SELECT * FROM ledger WHERE event_id = $1`,
    [req.params.eventId]
  );
  res.json(result.rows);
};
