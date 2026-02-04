"use client";

import { Check } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { UserAvatar } from "@/components/user-avatar";
import { cn } from "@/lib/utils";
import type { User } from "@/types";

interface CategoryParticipantsSelectorProps {
  participants: User[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
}

export function CategoryParticipantsSelector({
  participants,
  selectedIds,
  onSelectionChange,
}: CategoryParticipantsSelectorProps) {
  const toggleParticipant = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter((i) => i !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };

  const selectAll = () => {
    onSelectionChange(participants.map((p) => p.id));
  };

  const deselectAll = () => {
    onSelectionChange([]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-foreground">
          Select Participants ({selectedIds.length}/{participants.length})
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={selectAll}
            className="text-xs text-primary hover:underline"
          >
            Select all
          </button>
          <span className="text-muted-foreground">|</span>
          <button
            type="button"
            onClick={deselectAll}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {participants.map((participant) => {
          const isSelected = selectedIds.includes(participant.id);
          return (
            <button
              key={participant.id}
              type="button"
              onClick={() => toggleParticipant(participant.id)}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl border transition-all text-left",
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border/50 bg-secondary/30 hover:border-primary/30"
              )}
            >
              <div className="relative">
                <UserAvatar
                  name={participant.name}
                  avatar={participant.avatar}
                  size="sm"
                />
                {isSelected && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {participant.name}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
