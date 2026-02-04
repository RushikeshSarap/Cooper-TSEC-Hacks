import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware";

export const depositFunds = async (req: AuthRequest, res: Response) => {
  const { amount } = req.body;

  res.json({
    eventId: req.params.eventId,
    deposited: amount
  });
};

export const getWalletBalance = async (req: AuthRequest, res: Response) => {
  res.json({
    eventId: req.params.eventId,
    balance: 0
  });
};