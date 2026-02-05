"use client";

import { ArrowRight, Download } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { UserAvatar } from "@/components/user-avatar";

import type { User } from "@/types";

interface Settlement {
  id: string;
  from: User;
  to: User;
  amount: number;
  status: "pending" | "completed";
}

interface SettlementBreakdownTableProps {
  settlements: Settlement[];
  onPayment?: (settlementId: string) => void;
  onExport?: () => void;
}

export function SettlementBreakdownTable({
  settlements,
  onPayment,
  onExport,
}: SettlementBreakdownTableProps) {
  const totalOwed = settlements
    .filter((s) => s.status === "pending")
    .reduce((sum, s) => sum + s.amount, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-foreground">Settlement Summary</h3>
          <p className="text-sm text-muted-foreground">
            {settlements.filter((s) => s.status === "pending").length} payments remaining
          </p>
        </div>
        {onExport && (
          <button
            onClick={onExport}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border/50 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        )}
      </div>

      {/* Total Summary Card */}
      <GlassCard variant="gradient" className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Total to settle</p>
            <p className="text-2xl font-bold gradient-text">{formatCurrency(totalOwed)}</p>
          </div>
          <GradientButton size="sm">Settle All</GradientButton>
        </div>
      </GlassCard>

      {/* Settlement List */}
      <div className="space-y-2">
        {settlements.map((settlement) => (
          <GlassCard key={settlement.id} className="p-4">
            <div className="flex items-center gap-3">
              <UserAvatar
                name={settlement.from.name}
                avatar={settlement.from.avatar}
                size="sm"
              />
              <div className="flex items-center gap-2 flex-1">
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {settlement.from.name}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                <div className="flex-1 text-right">
                  <p className="text-sm font-medium text-foreground">
                    {settlement.to.name}
                  </p>
                </div>
              </div>
              <UserAvatar
                name={settlement.to.name}
                avatar={settlement.to.avatar}
                size="sm"
              />
            </div>

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
              <span className="text-lg font-bold text-foreground">
                {formatCurrency(settlement.amount)}
              </span>
              {settlement.status === "pending" ? (
                <button
                  onClick={() => onPayment?.(settlement.id)}
                  className="px-4 py-1.5 rounded-lg gradient-primary text-white text-sm font-medium hover:shadow-glow transition-all"
                >
                  Pay Now
                </button>
              ) : (
                <span className="px-3 py-1 rounded-full bg-success/10 text-success text-xs font-medium">
                  Completed
                </span>
              )}
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
