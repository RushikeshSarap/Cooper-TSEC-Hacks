import { Router, Response } from "express";
import { authenticate, AuthRequest } from "../middleware/auth.middleware";

const router = Router();

router.post(
  "/:eventId",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    const { name } = req.body;

    res.status(201).json({
      categoryId: "category-id",
      name
    });
  }
);

router.post(
  "/join/:categoryId",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    res.json({ message: "Joined category" });
  }
);

router.post(
  "/leave/:categoryId",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    res.json({ message: "Left category" });
  }
);

export default router;
