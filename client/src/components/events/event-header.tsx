"use client";

import { Calendar, Users, Settings, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Event } from "@/types";

interface EventHeaderProps {
  event: Event;
}

export function EventHeader({ event }: EventHeaderProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const progress = (event.currentSpent / event.totalBudget) * 100;



  return (
    <div className="relative overflow-hidden rounded-2xl gradient-primary p-6 text-white">
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/10 -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/2" />

      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div>
            <span
              className={cn(
                "inline-block text-[10px] font-medium px-2 py-0.5 rounded-full mb-2 capitalize",
                "bg-white/20 text-white"
              )}
            >
              {event.status}
            </span>
            <h1 className="text-2xl font-bold">{event.name}</h1>
            {event.description && (
              <p className="text-white/70 mt-1 text-sm">{event.description}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-4 text-sm">
          <div className="flex items-center gap-1.5 text-white/70">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(event.startDate)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-white/70">
            <Users className="w-4 h-4" />
            <span>{event.participantCount} members</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/70">Budget Used</span>
            <span className="font-semibold">
              ${event.currentSpent.toLocaleString()} / ${event.totalBudget.toLocaleString()}
            </span>
          </div>
          <div className="h-2 rounded-full bg-white/20 overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                progress > 90 ? "bg-red-400" : progress > 70 ? "bg-yellow-400" : "bg-white"
              )}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
