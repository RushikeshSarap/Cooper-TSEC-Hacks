import type { Request, Response } from "express";

export const updateRule = async (req: Request, res: Response) => {
  const { ruleId } = req.params;
  const updateData = req.body;

  // Example DB logic
  // await RuleModel.update(updateData, { where: { id: ruleId } });

  return res.status(200).json({
    message: "Rule updated successfully",
    ruleId,
    updatedData: updateData
  });
};
