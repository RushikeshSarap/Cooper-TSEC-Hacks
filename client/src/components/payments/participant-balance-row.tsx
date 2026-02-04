"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { UserAvatar } from "@/components/user-avatar";
import { cn } from "@/lib/utils";
import type { User } from "@/types";

interface ParticipantBalanceRowProps {
  user: User;
  deposited: number;
  spent: number;
  balance: number;
  onClick?: () => void;
}

export function ParticipantBalanceRow({
  user,
  deposited,
  spent,
  balance,
  onClick,
}: ParticipantBalanceRowProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(Math.abs(amount));
  };

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 p-4 rounded-2xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-soft transition-all"
    >
      <UserAvatar name={user.name} avatar={user.avatar} />

      <div className="flex-1 text-left">
        <p className="font-medium text-foreground">{user.name}</p>
        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
          <span>Deposited: {formatCurrency(deposited)}</span>
          <span>•</span>
          <span>Spent: {formatCurrency(spent)}</span>
        </div>
      </div>

      <div className="text-right">
        <div
          className={cn(
            "flex items-center justify-end gap-1 font-semibold",
            balance > 0 ? "text-success" : balance < 0 ? "text-destructive" : "text-muted-foreground"
          )}
        >
          {balance > 0 ? (
            <TrendingUp className="w-4 h-4" />
          ) : balance < 0 ? (
            <TrendingDown className="w-4 h-4" />
          ) : (
            <Minus className="w-4 h-4" />
          )}
          <span>{formatCurrency(balance)}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          {balance > 0 ? "to receive" : balance < 0 ? "to pay" : "settled"}
        </p>
      </div>
    </button>
  );
}
