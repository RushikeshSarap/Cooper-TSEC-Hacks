"use client";

import { useState } from "react";
import { DollarSign, Wallet, CreditCard, Building } from "lucide-react";
import { Input } from "@/components/ui/input";

import { GlassCard } from "@/components/ui/glass-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { cn } from "@/lib/utils";

const paymentMethods = [
  {
    id: "wallet",
    name: "Connected Wallet",
    icon: Wallet,
    description: "0x1234...5678",
    available: 2847.5,
  },
  {
    id: "card",
    name: "Debit Card",
    icon: CreditCard,
    description: "•••• 4242",
    available: null,
  },
  {
    id: "bank",
    name: "Bank Transfer",
    icon: Building,
    description: "Chase ••1234",
    available: null,
  },
];

const quickAmounts = [50, 100, 200, 500];

interface DepositFormProps {
  eventName?: string;
  suggestedAmount?: number;
  onDeposit?: (amount: number, method: string) => void;
}

export function DepositForm({
  eventName = "Event",
  suggestedAmount,
  onDeposit,
}: DepositFormProps) {
  const [amount, setAmount] = useState(suggestedAmount?.toString() || "");
  const [selectedMethod, setSelectedMethod] = useState("wallet");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!amount) return;
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    onDeposit?.(parseFloat(amount), selectedMethod);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <GlassCard>
        <h3 className="font-semibold text-foreground mb-4">Deposit Amount</h3>

        <div className="space-y-4">
          <div className="relative">
            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
            <Input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={cn(
                "pl-12 h-16 rounded-2xl bg-secondary/50 border-border/50 text-3xl font-bold text-center",
                "focus:border-primary focus:ring-primary/20"
              )}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {quickAmounts.map((quickAmount) => (
              <button
                key={quickAmount}
                type="button"
                onClick={() => setAmount(quickAmount.toString())}
                className={cn(
                  "flex-1 min-w-[60px] py-2 rounded-xl text-sm font-medium transition-all",
                  amount === quickAmount.toString()
                    ? "gradient-primary text-white"
                    : "bg-secondary/50 text-foreground hover:bg-secondary"
                )}
              >
                ${quickAmount}
              </button>
            ))}
          </div>

          <p className="text-xs text-center text-muted-foreground">
            Depositing to: <span className="text-foreground font-medium">{eventName}</span>
          </p>
        </div>
      </GlassCard>

      <GlassCard>
        <h3 className="font-semibold text-foreground mb-4">Payment Method</h3>

        <div className="space-y-2">
          {paymentMethods.map((method) => {
            const Icon = method.icon;
            return (
              <button
                key={method.id}
                type="button"
                onClick={() => setSelectedMethod(method.id)}
                className={cn(
                  "w-full flex items-center gap-4 p-4 rounded-xl border transition-all",
                  selectedMethod === method.id
                    ? "border-primary bg-primary/5"
                    : "border-border/50 bg-secondary/30 hover:border-primary/30"
                )}
              >
                <div
                  className={cn(
                    "p-2.5 rounded-xl",
                    selectedMethod === method.id ? "gradient-primary" : "bg-secondary"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-5 h-5",
                      selectedMethod === method.id ? "text-white" : "text-muted-foreground"
                    )}
                  />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-foreground">{method.name}</p>
                  <p className="text-xs text-muted-foreground">{method.description}</p>
                </div>
                {method.available && (
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Available</p>
                    <p className="text-sm font-semibold text-success">
                      ${method.available.toLocaleString()}
                    </p>
                  </div>
                )}
                <div
                  className={cn(
                    "w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center",
                    selectedMethod === method.id
                      ? "border-primary bg-primary"
                      : "border-muted-foreground"
                  )}
                >
                  {selectedMethod === method.id && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </GlassCard>

      <GradientButton
        onClick={handleSubmit}
        loading={loading}
        disabled={!amount || parseFloat(amount) <= 0}
        className="w-full"
        size="lg"
      >
        Deposit ${amount || "0.00"}
      </GradientButton>
    </div>
  );
}
