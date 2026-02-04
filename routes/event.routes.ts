import { Router, Response } from "express";
import { authenticate, AuthRequest } from "../middleware/auth.middleware";

const router = Router();

router.post("/", authenticate, async (req: AuthRequest, res: Response) => {
  const { name } = req.body;

  res.status(201).json({
    eventId: "event-id",
    name,
    createdBy: req.user?.userId
  });
});

router.get("/", authenticate, async (req: AuthRequest, res: Response) => {
  res.json({ events: [] });
});

router.get("/:eventId", authenticate, async (req: AuthRequest, res: Response) => {
  res.json({ eventId: req.params.eventId });
});

router.post("/:eventId/join", authenticate, async (req: AuthRequest, res: Response) => {
  res.json({ message: "Joined event" });
});

router.delete(
  "/:eventId/participants/:userId",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    res.json({ message: "Participant removed" });
  }
);

export default router;
