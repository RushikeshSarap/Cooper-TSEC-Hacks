import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";

const router = Router();

router.post("/register", async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  // TODO: hash password & save user
  res.status(201).json({ message: "User registered" });
});

router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // TODO: validate user
  const token = jwt.sign(
    { userId: "mock-user-id" },
    process.env.JWT_SECRET as string,
    { expiresIn: "1d" }
  );

  res.json({ token });
});

router.get("/me", async (req: Request, res: Response) => {
  res.json({ user: "current-user" });
});

export default router;
