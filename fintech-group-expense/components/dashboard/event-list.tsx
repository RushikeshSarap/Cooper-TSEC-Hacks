"use client";

import { EventCard } from "./event-card";
import type { Event } from "@/types";

interface EventListProps {
  events: Event[];
  title?: string;
  emptyMessage?: string;
}

export function EventList({ events, title, emptyMessage = "No events found" }: EventListProps) {
  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary mb-4">
          <svg
            viewBox="0 0 24 24"
            className="w-8 h-8 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </svg>
        </div>
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div>
      {title && <h2 className="text-lg font-semibold text-foreground mb-4">{title}</h2>}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}
