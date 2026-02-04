import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware";

export const makePayment = async (req: AuthRequest, res: Response) => {
  const { amount, categoryId } = req.body;

  res.json({
    eventId: req.params.eventId,
    categoryId,
    amount,
    status: "PAID"
  });
};

export const getAllPayments = async (req: AuthRequest, res: Response) => {
  res.json({ payments: [] });
};