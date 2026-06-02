"use client";

import { Calendar, Users, MoreHorizontal } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import type { Event } from "@/types";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const progress = (event.currentSpent / event.totalBudget) * 100;

  const statusStyles = {
    active: "bg-success/10 text-success",
    settled: "bg-muted text-muted-foreground",
    pending: "bg-warning/10 text-warning",
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Link to={`/events/${event.id}`}>
      <GlassCard className="group hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-foreground truncate">{event.name}</h3>
              <span
                className={cn(
                  "text-[10px] font-medium px-2 py-0.5 rounded-full capitalize",
                  statusStyles[event.status]
                )}
              >
                {event.status}
              </span>
            </div>
            {event.description && (
              <p className="text-sm text-muted-foreground line-clamp-1">{event.description}</p>
            )}
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
          >
            <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between text-sm mb-1.5">
              <span className="text-muted-foreground">Budget</span>
              <span className="font-medium text-foreground">
                {formatCurrency(event.currentSpent)} / {formatCurrency(event.totalBudget)}
              </span>
            </div>
            <div className="h-2 rounded-full bg-secondary overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  progress > 90 ? "bg-destructive" : progress > 70 ? "bg-warning" : "gradient-primary"
                )}
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Calendar className="w-3.5 h-3.5" />
              <span className="text-xs">{formatDate(event.startDate)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Users className="w-3.5 h-3.5" />
              <span className="text-xs">{event.participantCount} members</span>
            </div>
          </div>
        </div>
      </GlassCard>
    </Link>
  );
}
