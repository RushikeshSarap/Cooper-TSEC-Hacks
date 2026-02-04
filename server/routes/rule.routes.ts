import { Router } from "express";
import { authenticate } from "../middleware/authenticate.middleware";
import { validateRuleUpdate } from "../middleware/validateRule.middleware";
import { updateRule } from "../controllers/rule.controller";

const router = Router();

router.put(
  "/:ruleId",
  authenticate,        // user must be logged in
  validateRuleUpdate,  // validate params + body
  updateRule           // actual business logic
);

export default router;