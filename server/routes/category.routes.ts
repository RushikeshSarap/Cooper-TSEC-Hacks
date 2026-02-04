import { Router } from "express";
import { authenticate } from "../middleware/authenticate.middleware";
import { isEventParticipant } from "../middleware/isEventParticipant.middleware";
import { isOrganizer } from "../middleware/isOrganizer.middleware";

import {
  updateCategory,
  joinCategory,
  leaveCategory,
  getCategoryParticipants,
  uploadBill,
  getBills
} from "../controllers/category.controller";

const router = Router();

router.put(
  "/:categoryId",
  authenticate,
  isOrganizer,
  updateCategory
);

router.post(
  "/:categoryId/join",
  authenticate,
  isEventParticipant,
  joinCategory
);

router.post(
  "/:categoryId/leave",
  authenticate,
  isEventParticipant,
  leaveCategory
);

router.get(
  "/:categoryId/participants",
  authenticate,
  isEventParticipant,
  getCategoryParticipants
);

router.post(
  "/:categoryId/bills",
  authenticate,
  isEventParticipant,
  uploadBill
);

router.get(
  "/:categoryId/bills",
  authenticate,
  isEventParticipant,
  getBills
);

export default router;
