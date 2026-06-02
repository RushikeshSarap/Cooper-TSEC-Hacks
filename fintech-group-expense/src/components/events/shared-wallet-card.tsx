"use client";

import { Wallet, Plus, RefreshCw } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientButton } from "@/components/ui/gradient-button";

interface SharedWalletCardProps {
  balance: number;
  totalDeposits: number;
  pendingDeposits: number;
  onDeposit?: () => void;
}

export function SharedWalletCard({
  balance,
  totalDeposits,
  pendingDeposits,
  onDeposit,
}: SharedWalletCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <GlassCard>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl gradient-primary">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Shared Wallet</p>
            <p className="text-xl font-bold text-foreground">{formatCurrency(balance)}</p>
          </div>
        </div>
        <GradientButton size="sm" onClick={onDeposit}>
          <Plus className="w-4 h-4 mr-1" />
          Deposit
        </GradientButton>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Total Collected</p>
          <p className="font-semibold text-foreground">{formatCurrency(totalDeposits)}</p>
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <p className="text-xs text-muted-foreground">Pending</p>
            {pendingDeposits > 0 && (
              <RefreshCw className="w-3 h-3 text-warning animate-spin" />
            )}
          </div>
          <p className="font-semibold text-foreground">{formatCurrency(pendingDeposits)}</p>
        </div>
      </div>
    </GlassCard>
  );
}
