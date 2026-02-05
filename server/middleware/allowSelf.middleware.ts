import type { Request, Response, NextFunction } from "express";

export const allowSelf = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const tokenUserId = Number((req as any).user?.id);
  const paramUserId = Number(req.params.id);

  if (!tokenUserId || tokenUserId !== paramUserId) {
    return res.status(403).json({ message: "Forbidden" });
  }

  next();
};
