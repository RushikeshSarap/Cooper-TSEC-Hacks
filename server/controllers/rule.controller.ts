import type { Request, Response } from "express";
import db from "../config/db.config.js";

export const updateRule = async (req: Request, res: Response) => {
  const { ruleId } = req.params;
  const { maxAmount, allowedRoles, approvalRequired } = req.body;

  await db.query(
    `
    UPDATE payment_rules
    SET max_amount = $1,
        allowed_roles = $2,
        approval_required = $3
    WHERE id = $4
    `,
    [maxAmount, allowedRoles, approvalRequired, ruleId]
  );

  return res.status(200).json({
    message: "Rule updated successfully",
    ruleId
  });
};
