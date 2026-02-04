import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware";

export const createEvent = async (req: AuthRequest, res: Response) => {
  const { name } = req.body;

  res.status(201).json({
    eventId: "event-id",
    name,
    createdBy: req.user?.userId
  });
};

export const getAllEvents = async (req: AuthRequest, res: Response) => {
  res.json({ events: [] });
};

export const getEventById = async (req: AuthRequest, res: Response) => {
  res.json({ eventId: req.params.eventId });
};

export const joinEvent = async (req: AuthRequest, res: Response) => {
  res.json({ message: "Joined event" });
};

export const removeParticipant = async (req: AuthRequest, res: Response) => {
  res.json({ message: "Participant removed" });
};