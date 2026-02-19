"use client";

import React from "react"

import { useState } from "react";
import { Mail, X, UserPlus, Copy, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { UserAvatar } from "@/components/user-avatar";
import { cn } from "@/lib/utils";

interface Participant {
  id: string;
  email: string;
  name?: string;
  status: "pending" | "accepted";
}

interface ParticipantInviteProps {
  participants: Participant[];
  onAdd: (email: string) => void;
  onRemove: (id: string) => void;
}

export function ParticipantInvite({ participants, onAdd, onRemove }: ParticipantInviteProps) {
  const [email, setEmail] = useState("");
  const [copied, setCopied] = useState(false);

  const handleAdd = () => {
    if (email && email.includes("@")) {
      onAdd(email);
      setEmail("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://splitflow.app/invite/abc123");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-sm font-medium">Invite by Email</Label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="email"
              placeholder="friend@example.com"
              className={cn(
                "pl-10 h-12 rounded-xl bg-secondary/50 border-border/50",
                "focus:border-primary focus:ring-primary/20"
              )}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <GradientButton onClick={handleAdd} className="px-4">
            <UserPlus className="w-4 h-4" />
          </GradientButton>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Or share invite link</Label>
        <div className="flex gap-2">
          <Input
            readOnly
            value="https://splitflow.app/invite/abc123"
            className={cn(
              "h-12 rounded-xl bg-secondary/50 border-border/50 text-muted-foreground"
            )}
          />
          <button
            onClick={handleCopyLink}
            className={cn(
              "flex items-center justify-center w-12 h-12 rounded-xl border transition-all",
              copied
                ? "border-success bg-success/10 text-success"
                : "border-border/50 bg-secondary/50 text-muted-foreground hover:text-foreground"
            )}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {participants.length > 0 && (
        <div className="space-y-3">
          <Label className="text-sm font-medium">
            Invited ({participants.length})
          </Label>
          <div className="space-y-2">
            {participants.map((participant) => (
              <GlassCard key={participant.id} className="p-3">
                <div className="flex items-center gap-3">
                  <UserAvatar
                    name={participant.name || participant.email}
                    size="sm"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm truncate">
                      {participant.name || participant.email}
                    </p>
                    {participant.name && (
                      <p className="text-xs text-muted-foreground truncate">
                        {participant.email}
                      </p>
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-[10px] font-medium px-2 py-0.5 rounded-full",
                      participant.status === "accepted"
                        ? "bg-success/10 text-success"
                        : "bg-warning/10 text-warning"
                    )}
                  >
                    {participant.status}
                  </span>
                  <button
                    onClick={() => onRemove(participant.id)}
                    className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
