import { Router, Response } from "express";
import { authenticate, AuthRequest } from "../middleware/auth.middleware";

const router = Router();

router.post(
  "/:eventId/deposit",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    const { amount } = req.body;

    res.json({
      eventId: req.params.eventId,
      deposited: amount
    });
  }
);

router.get(
  "/:eventId",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    res.json({
      eventId: req.params.eventId,
      balance: 0
    });
  }
);

export default router;
