import { Router, Response } from "express";
import { authenticate, AuthRequest } from "../middleware/auth.middleware";

const router = Router();

router.post(
  "/:eventId/pay",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    const { amount, categoryId } = req.body;

    res.json({
      eventId: req.params.eventId,
      categoryId,
      amount,
      status: "PAID"
    });
  }
);

router.get(
  "/:eventId",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    res.json({ payments: [] });
  }
);

export default router;
