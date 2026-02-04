import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware";

export const createCategory = async (req: AuthRequest, res: Response) => {
  const { name } = req.body;

  res.status(201).json({
    categoryId: "category-id",
    name
  });
};

export const joinCategory = async (req: AuthRequest, res: Response) => {
  res.json({ message: "Joined category" });
};

export const leaveCategory = async (req: AuthRequest, res: Response) => {
  res.json({ message: "Left category" });
};