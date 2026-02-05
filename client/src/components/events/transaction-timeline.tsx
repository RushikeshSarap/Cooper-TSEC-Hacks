"use client";

import { Receipt, ImageIcon, Clock, CheckCircle2, XCircle } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { UserAvatar } from "@/components/user-avatar";

import type { Transaction } from "@/types";

interface TransactionTimelineProps {
  transactions: Transaction[];
}

export function TransactionTimeline({ transactions }: TransactionTimelineProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const statusIcons = {
    pending: <Clock className="w-4 h-4 text-warning" />,
    approved: <CheckCircle2 className="w-4 h-4 text-success" />,
    rejected: <XCircle className="w-4 h-4 text-destructive" />,
  };

  const groupByDate = (txns: Transaction[]) => {
    const groups: Record<string, Transaction[]> = {};
    txns.forEach((txn) => {
      const date = new Date(txn.createdAt).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      });
      if (!groups[date]) groups[date] = [];
      groups[date].push(txn);
    });
    return groups;
  };

  const grouped = groupByDate(transactions);

  if (transactions.length === 0) {
    return (
      <GlassCard className="p-8 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary mb-3">
          <Receipt className="w-6 h-6 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground">No transactions yet</p>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([date, txns]) => (
        <div key={date}>
          <p className="text-sm font-medium text-muted-foreground mb-3">{date}</p>
          <div className="space-y-3">
            {txns.map((transaction) => (
              <GlassCard key={transaction.id} className="p-4">
                <div className="flex items-start gap-3">
                  <UserAvatar
                    name={transaction.paidBy.name}
                    avatar={transaction.paidBy.avatar}
                    size="sm"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-foreground truncate">
                        {transaction.description}
                      </p>
                      {statusIcons[transaction.status]}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>Paid by {transaction.paidBy.name}</span>
                      <span>•</span>
                      <span>Split {transaction.splitBetween.length} ways</span>
                    </div>
                    {transaction.receipt && (
                      <button className="flex items-center gap-1 mt-2 text-xs text-primary hover:underline">
                        <ImageIcon className="w-3 h-3" />
                        View receipt
                      </button>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">
                      {formatCurrency(transaction.amount)}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {formatTime(transaction.createdAt)}
                    </p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
