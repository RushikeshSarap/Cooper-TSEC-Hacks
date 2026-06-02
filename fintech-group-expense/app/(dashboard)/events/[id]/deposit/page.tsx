"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { DepositForm } from "@/components/payments/deposit-form";
import { PaymentAuthorizationModal } from "@/components/payments/payment-authorization-modal";
import type { Participant } from "@/types";

const mockParticipants: Participant[] = [
  {
    id: "1",
    name: "You",
    email: "you@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "admin",
    depositAmount: 500,
    depositedAt: new Date().toISOString(),
    balance: 125.5,
  },
];

export default function DepositPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [showAuth, setShowAuth] = useState(false);
  const [depositAmount, setDepositAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<string>("");

  const handleDeposit = (amount: number, method: string) => {
    setDepositAmount(amount);
    setPaymentMethod(method);
    setShowAuth(true);
  };

  const handleConfirmPayment = () => {
    setShowAuth(false);
    // Handle successful payment
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 glass-strong border-b border-border/50">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/events/1">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-semibold text-foreground">
                Add Funds
              </h1>
              <p className="text-sm text-muted-foreground">
                Deposit to shared wallet
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <GlassCard className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-12 w-12 rounded-full gradient-primary flex items-center justify-center">
              <Wallet className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Your Balance</p>
              <p className="text-2xl font-bold text-foreground">
                ${mockParticipants[0].balance?.toFixed(2)}
              </p>
            </div>
          </div>
        </GlassCard>

        <DepositForm
          eventId="1"
          currentBalance={mockParticipants[0].balance || 0}
          onDeposit={handleDeposit}
        />
      </main>

      <PaymentAuthorizationModal
        open={showAuth}
        onOpenChange={setShowAuth}
        amount={depositAmount}
        paymentMethod={paymentMethod}
        onConfirm={handleConfirmPayment}
      />
    </div>
  );
}
