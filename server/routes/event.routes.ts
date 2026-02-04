import { Router } from "express";
import { authenticate } from "../middleware/authenticate.middleware";
import { requireEventOwner } from "../middleware/requireEventOwner.middleware";
import { requireEventParticipant } from "../middleware/requireEventParticipant.middleware";
import * as controller from "../controllers/event.controller";

const router = Router();

/* ───────────── Event core ───────────── */

router.post(
  "/:eventId/payments",
  // authenticate,
  // requireEventParticipant,
  controller.addPayment
);


// Create event
router.post(
  "/",
  authenticate,
  controller.createEvent
);

// Get all events for logged-in user
router.get(
  "/",
  authenticate,
  controller.getAllEvents
);

/* ───────────── Event core ───────────── */

router.get(
  "/:eventId",
  authenticate,
  requireEventParticipant,
  controller.getEventById
);

/* ───────────── Participation ───────────── */

// Join event
router.post(
  "/:eventId/join",
  authenticate,
  controller.joinEvent
);

// Remove participant (owner only)
router.delete(
  "/:eventId/participants/:userId",
  authenticate,
  requireEventOwner,
  controller.removeParticipant
);
router.get(
  "/:eventId",
  authenticate,
  requireEventParticipant,
  controller.getEventById
);

router.put(
  "/:eventId",
  authenticate,
  requireEventOwner,
  controller.updateEvent
);

router.delete(
  "/:eventId",
  authenticate,
  requireEventOwner,
  controller.deleteEvent
);

/* ───────────── Participation ───────────── */

router.post(
  "/:eventId/invite",
  authenticate,
  requireEventOwner,
  controller.inviteUser
);

router.get(
  "/:eventId/participants",
  authenticate,
  requireEventParticipant,
  controller.getParticipants
);

/* ───────────── Wallet / deposits ───────────── */

// router.post(
//   "/:eventId/deposit",
//   authenticate,
//   requireEventParticipant,
//   controller.depositToEvent
// );

router.get(
  "/:eventId/wallet",
  authenticate,
  requireEventParticipant,
  controller.getWallet
);

// router.get(
//   "/:eventId/deposits",
//   authenticate,
//   requireEventParticipant,
//   controller.getDeposits
// );

/* ───────────── Rules & categories ───────────── */

router.post(
  "/:eventId/categories",
  authenticate,
  requireEventOwner,
  controller.addCategory
);

router.get(
  "/:eventId/categories",
  authenticate,
  requireEventParticipant,
  controller.getCategories
);

router.post(
  "/:eventId/rules",
  authenticate,
  requireEventOwner,
  controller.addRule
);

router.get(
  "/:eventId/rules",
  authenticate,
  requireEventParticipant,
  controller.getRules
);

/* ───────────── Payments & settlement ───────────── */

router.post(
  "/:eventId/payments",
  // authenticate,
  // requireEventParticipant,
  controller.addPayment
);

router.get(
  "/:eventId/payments",
  authenticate,
  requireEventParticipant,
  controller.getPayments
);

router.post(
  "/:eventId/settle",
  authenticate,
  requireEventOwner,
  controller.settleEvent
);

router.get(
  "/:eventId/settlement",
  authenticate,
  requireEventParticipant,
  controller.getSettlement
);

/* ───────────── Reports ───────────── */

router.get(
  "/:eventId/summary",
  authenticate,
  requireEventParticipant,
  controller.getSummary
);

router.get(
  "/:eventId/ledger",
  authenticate,
  requireEventParticipant,
  controller.getLedger
);

export default router;