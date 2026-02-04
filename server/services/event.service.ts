export interface Event {
  id: string;
  name: string;
  createdBy: string;
  status: "active" | "settled";
}

export class EventService {
  static async createEvent(
    name: string,
    userId: string
  ): Promise<Event> {
    // TODO: Insert into DB
    return {
      id: "event-id",
      name,
      createdBy: userId,
      status: "active"
    };
  }

  static async getEvent(eventId: string): Promise<Event | null> {
    // TODO: Fetch from DB
    return null;
  }

  static async closeEvent(eventId: string): Promise<void> {
    // TODO: Update event status to "settled"
  }
}
