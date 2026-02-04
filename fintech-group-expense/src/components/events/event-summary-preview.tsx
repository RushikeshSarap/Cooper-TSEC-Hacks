"use client";

import { Calendar, DollarSign, Users, Shield, CheckCircle2 } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { UserAvatar } from "@/components/user-avatar";
import type { Rule } from "@/types";

interface EventSummaryData {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  budget: string;
}

interface Participant {
  id: string;
  email: string;
  name?: string;
  status: "pending" | "accepted";
}

interface EventSummaryPreviewProps {
  event: EventSummaryData;
  participants: Participant[];
  rules: Rule[];
}

export function EventSummaryPreview({
  event,
  participants,
  rules,
}: EventSummaryPreviewProps) {
  const formatDate = (date: string) => {
    if (!date) return "Not set";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatCurrency = (amount: string) => {
    const num = parseFloat(amount);
    if (isNaN(num)) return "$0.00";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(num);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary mb-4">
          <CheckCircle2 className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Review Your Event</h2>
        <p className="text-muted-foreground mt-1">
          Make sure everything looks good before creating
        </p>
      </div>

      <GlassCard>
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Event Details
        </h3>
        <div className="space-y-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Event Name</p>
            <p className="font-medium text-foreground">
              {event.name || "Untitled Event"}
            </p>
          </div>
          {event.description && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Description</p>
              <p className="text-sm text-foreground">{event.description}</p>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Calendar className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Dates</p>
                <p className="text-sm font-medium text-foreground">
                  {formatDate(event.startDate)}
                  {event.endDate && ` - ${formatDate(event.endDate)}`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-success/10">
                <DollarSign className="w-4 h-4 text-success" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Budget</p>
                <p className="text-sm font-medium text-foreground">
                  {formatCurrency(event.budget)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Participants</h3>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Users className="w-4 h-4" />
            <span className="text-sm">{participants.length + 1}</span>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-secondary/30">
            <UserAvatar name="You" size="sm" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">You</p>
              <p className="text-xs text-muted-foreground">Organizer</p>
            </div>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
              Organizer
            </span>
          </div>
          {participants.map((participant) => (
            <div
              key={participant.id}
              className="flex items-center gap-3 p-2 rounded-xl bg-secondary/30"
            >
              <UserAvatar
                name={participant.name || participant.email}
                size="sm"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {participant.name || participant.email}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {participant.email}
                </p>
              </div>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-warning/10 text-warning">
                {participant.status}
              </span>
            </div>
          ))}
        </div>
      </GlassCard>

      {rules.length > 0 && (
        <GlassCard>
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">
              Spending Rules
            </h3>
          </div>
          <div className="space-y-2">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className="flex items-center justify-between p-3 rounded-xl bg-secondary/30"
              >
                <p className="text-sm font-medium text-foreground">{rule.name}</p>
                <p className="text-sm text-muted-foreground">{rule.value}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  );
}
