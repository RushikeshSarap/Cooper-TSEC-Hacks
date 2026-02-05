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
      "INSERT INTO payments (event_id, paid_by, gateway_txn_id, amount) VALUES (?, ?, ?, ?)",
      [eventId, (req.user as any).id, paymentIntent.id, amount]
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




export const addExpense = async (req: Request, res: Response) => {
  const { amount, description, categoryId, date } = req.body;
  const { eventId } = req.params;

  if (!amount || !description) {
    return res.status(400).json({ error: "Amount and description required" });
  }

  try {
    await db.query(
      "INSERT INTO payments (event_id, paid_by, amount, description, category_id, created_at) VALUES (?, ?, ?, ?, ?, ?)",
      [eventId, (req.user as any).id, amount, description, categoryId || null, date || new Date()]
    );

    res.json({ message: "Expense added" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add expense" });
  }
};


export const createEvent = async (req: Request, res: Response) => {
  const { name, description, startDate, endDate, budget } = req.body;

  const [result]: any = await db.query(
    "INSERT INTO events (name, description, start_date, end_date, total_budget, created_by) VALUES (?, ?, ?, ?, ?, ?)",
    [name, description, startDate, endDate, budget, (req.user as any).id]
  );

  // creator automatically joins
  await db.query(
    "INSERT INTO event_participants (event_id, user_id) VALUES (?, ?)",
    [result.insertId, (req.user as any).id]
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
    [(req.user as any).id]
  );
  res.json(rows);
};

/* Core */
export const getEventById = async (req: Request, res: Response) => {
  const eventId = req.params.eventId;

  // Fetch event details
  const [eventRows]: any = await db.query(
    "SELECT * FROM events WHERE id = ?",
    [eventId]
  );

  if (!eventRows.length) {
    return res.status(404).json({ message: "Event not found" });
  }

  const event = eventRows[0];

  // Get participant count
  const [partRows]: any = await db.query(
    "SELECT COUNT(*) as count FROM event_participants WHERE event_id = ?",
    [eventId]
  );
  event.participant_count = partRows[0].count;

  // Get total spent (sum of payments)
  const [spentRows]: any = await db.query(
    "SELECT SUM(amount) as total FROM payments WHERE event_id = ?",
    [eventId]
  );
  event.current_spent = spentRows[0].total || 0;

  res.json(event);
};

export const joinEvent = async (req: Request, res: Response) => {
  const eventId = Number(req.params.eventId);

  await db.query(
    "INSERT IGNORE INTO event_participants (event_id, user_id) VALUES (?, ?)",
    [eventId, (req.user as any).id]
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
    `
    SELECT ep.id as participant_id, ep.role,
           u.id as user_id, u.name, u.email
    FROM event_participants ep
    JOIN users u ON ep.user_id = u.id
    WHERE ep.event_id = ?
    `,
    [req.params.eventId]
  );

  // Transform to match frontend Participant interface if needed
  // Frontend expects: { id, user: {id, name, email}, role, ... }
  const participants = rows.map((row: any) => ({
    id: row.participant_id,
    user: {
      id: row.user_id,
      name: row.name,
      email: row.email,
      balance: 0 // Mock balance for now
    },
    role: row.role,
    depositAmount: 0,
    spentAmount: 0,
    balance: 0,
    joinedAt: new Date().toISOString() // Fallback as column doesn't exist
  }));

  res.json(participants);
};

/* Wallet */
export const depositToEvent = async (req: Request, res: Response) => {
  await db.query(
    "INSERT INTO deposits (event_id, user_id, amount) VALUES (?, ?, ?)",
    [req.params.eventId, (req.user as any).id, req.body.amount]
  );
  res.json({ message: "Deposit successful" });
};

export const getWallet = async (req: Request, res: Response) => {
  const [rows]: any = await db.query(
    "SELECT SUM(amount) as balance FROM deposits WHERE event_id = ? AND user_id = ?",
    [req.params.eventId, (req.user as any).id]
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
  try {
    const [rows]: any = await db.query(
      "SELECT * FROM expense_categories WHERE event_id = ?",
      [req.params.eventId]
    );
    res.json(rows);
  } catch (err) {
    console.warn("Error getting categories:", err);
    res.json([]); // Return empty
  }
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
  try {
    const [rows]: any = await db.query(
      "SELECT * FROM payment_rules WHERE event_id = ?",
      [req.params.eventId]
    );
    res.json(rows);
  } catch (err) {
    console.error("Error getting rules:", err);
    // Return empty array instead of 500 to prevent frontend crash
    res.json([]);
  }
};

/* Payments & settlement */


export const getPayments = async (req: Request, res: Response): Promise<void> => {
  const { eventId } = req.params;

  try {
    const rows: any[] = await db.query(
      `SELECT p.*, u.id as user_id, u.name as user_name, u.email as user_email 
       FROM payments p
       JOIN users u ON p.paid_by = u.id
       WHERE p.event_id = ?`,
      [eventId]
    );

    // Optional: fetch real-time status from Finternet
    for (let p of rows) {
      if (p.gateway_txn_id) {
        // p.status = ... fetch status
      }
    }

    const set = rows.map((row: any) => ({
      id: row.id,
      eventId: row.event_id,
      categoryId: row.category_id,
      description: row.description || "Payment",
      // Actually payments table is for settling? Or expense items?
      // Schema checks: payments has (event_id, category_id, paid_by, amount, gateway_txn_id)
      // It seems 'payments' here are actual money transfers? 
      // But the UI uses 'transactions' for "Expenses".
      // The mock data "Grocery shopping" implies these are EXPENSES (bills).
      // The schema has `bills` table for expenses: 
      // CREATE TABLE bills ( category_id, image_url, extracted_amount, merchant, uploaded_by ... )
      // The frontend expects "Transactions" which look like Expenses.
      // If I use `payments` table, that might be for "Settlements" or "Deposits".
      // BUT the controller `addPayment` inserts into `payments`.

      // Let's assume for now `payments` are what we want, but we need to map it.
      amount: row.amount,
      paidBy: {
        id: row.user_id,
        name: row.user_name,
        email: row.user_email
      },
      splitBetween: [], // details not in payments table yet
      createdAt: row.created_at,
      status: 'approved'
    }));

    res.json(set);
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