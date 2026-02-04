import { Router } from "express";
import { authenticate } from "../middleware/authenticate.middleware";
import { allowSelf } from "../middleware/allowSelf.middleware";
import {
  getUserById,
  updateUserById,
  getUserEvents
} from "../controllers/user.controller";

const router = Router();

// GET /users/:id
router.get(
  "/:id",
  authenticate,
  allowSelf,
  getUserById
);

// PUT /users/:id
router.put(
  "/:id",
  authenticate,
  allowSelf,
  updateUserById
);

// GET /users/:id/events
router.get(
  "/:id/events",
  authenticate,
  allowSelf,
  getUserEvents
);

export default router;
