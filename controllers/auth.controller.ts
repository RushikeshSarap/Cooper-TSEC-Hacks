import type { Request, Response } from "express";
import jwt from "jsonwebtoken";

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  // TODO: hash password & save user
  res.status(201).json({ message: "User registered" });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // TODO: validate user
  const token = jwt.sign(
    { userId: "mock-user-id" },
    process.env.JWT_SECRET as string,
    { expiresIn: "1d" }
  );

  res.json({ token });
};

export const getMe = async (req: Request, res: Response) => {
  res.json({ user: "current-user" });
};