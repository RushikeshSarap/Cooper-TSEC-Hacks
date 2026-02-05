import { Router } from "express";
import { authenticate } from "../middleware/authenticate.middleware.js";
import { validateRuleUpdate } from "../middleware/validateRule.middleware.js";
import { updateRule } from "../controllers/rule.controller.js";

const router = Router();

router.put(
  "/:ruleId",
  authenticate,        // user must be logged in
  validateRuleUpdate,  // validate params + body
  updateRule           // actual business logic
);

export default router;