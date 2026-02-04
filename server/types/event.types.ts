/* =========================
   Event Core Types
========================= */

export type EventStatus = "active" | "settled";

/**
 * Event entity
 */
export interface Event {
  id: string;
  name: string;
  createdBy: string;
  status: EventStatus;
  createdAt: string;
}

/* =========================
   Event Requests
========================= */

export interface CreateEventRequest {
  name: string;
}

export interface JoinEventRequest {
  eventId: string;
}

/* =========================
   Participants
========================= */

export interface EventParticipant {
  userId: string;
  role: "organizer" | "member";
}

/* =========================
   Event Responses
========================= */

export interface EventResponse {
  event: Event;
  participants: EventParticipant[];
}

/* =========================
   Dashboard / List View
========================= */

export interface EventListItem {
  id: string;
  name: string;
  status: EventStatus;
  balance: number;
}
