import { Router, Response } from "express";
import { authenticate, AuthRequest } from "../middleware/auth.middleware";

const router = Router();

router.post(
  "/:eventId/settle",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    res.json({
      eventId: req.params.eventId,
      status: "SETTLED"
    });
  }
);

router.get(
  "/:eventId",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    res.json({
      settlements: []
    });
  }
);

export default router;
