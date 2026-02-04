import type { Request, Response, NextFunction } from "express";

export const validateRuleUpdate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { ruleId } = req.params;

  if (!ruleId || isNaN(Number(ruleId))) {
    return res.status(400).json({ message: "Invalid ruleId" });
  }

  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: "Update data required" });
  }

  next();
};
