"use client";

import { Eye, EyeOff, Plus, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface WalletCardProps {
  balance: number;
  currency?: string;
  walletAddress?: string;
}

export function WalletCard({ balance, currency = "USD", walletAddress }: WalletCardProps) {
  const [showBalance, setShowBalance] = useState(true);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl gradient-primary p-6 text-white">
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/10 -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/2" />
      
      <div className="relative">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-white/70 text-sm mb-1">Total Balance</p>
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-bold tracking-tight">
                {showBalance ? formatCurrency(balance) : "••••••"}
              </h2>
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              >
                {showBalance ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
          <div className="text-right">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 backdrop-blur">
              <svg
                viewBox="0 0 24 24"
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
          </div>
        </div>

        {walletAddress && (
          <div className="mb-6">
            <p className="text-white/50 text-xs mb-1">Wallet Address</p>
            <p className="font-mono text-sm">{`${walletAddress.slice(0, 8)}...${walletAddress.slice(-6)}`}</p>
          </div>
        )}

        <div className="flex items-center gap-3">
          <button className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur transition-all font-medium text-sm">
            <Plus className="w-4 h-4" />
            Add Funds
          </button>
          <button className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur transition-all">
            <ArrowUpRight className="w-5 h-5" />
          </button>
          <button className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur transition-all">
            <ArrowDownLeft className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
