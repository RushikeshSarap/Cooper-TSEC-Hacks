"use client";

import { MoreHorizontal, TrendingUp, TrendingDown } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { UserAvatar } from "@/components/user-avatar";
import { cn } from "@/lib/utils";
import type { Participant } from "@/types";

interface ParticipantListProps {
  participants: Participant[];
}

export function ParticipantList({ participants }: ParticipantListProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(Math.abs(amount));
  };

  return (
    <div className="space-y-3">
      {participants.map((participant) => (
        <GlassCard key={participant.id} className="p-4">
          <div className="flex items-center gap-3">
            <UserAvatar
              name={participant.user.name}
              avatar={participant.user.avatar}
              showStatus
              status="online"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium text-foreground truncate">
                  {participant.user.name}
                </p>
                {participant.role === "organizer" && (
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                    Organizer
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Deposited {formatCurrency(participant.depositAmount)}</span>
                <span>•</span>
                <span>Spent {formatCurrency(participant.spentAmount)}</span>
              </div>
            </div>
            <div className="text-right">
              <div
                className={cn(
                  "flex items-center gap-1 font-semibold",
                  participant.balance >= 0 ? "text-success" : "text-destructive"
                )}
              >
                {participant.balance >= 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span>{formatCurrency(participant.balance)}</span>
              </div>
              <p className="text-[10px] text-muted-foreground">
                {participant.balance >= 0 ? "to receive" : "to pay"}
              </p>
            </div>
            <button className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
              <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </GlassCard>
      ))}
    </div>
  );
}
