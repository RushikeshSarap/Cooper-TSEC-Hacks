"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calculator,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { SettlementBreakdownTable } from "@/components/payments/settlement-breakdown-table";
import { ParticipantBalanceRow } from "@/components/payments/participant-balance-row";
import { ExportCSVButton } from "@/components/payments/export-csv-button";
import type { Participant, SettlementTransaction } from "@/types";

const mockParticipants: Participant[] = [
  {
    id: "1",
    name: "Alex Chen",
    email: "alex@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "admin",
    depositAmount: 500,
    balance: 125.5,
  },
  {
    id: "2",
    name: "Sarah Kim",
    email: "sarah@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "member",
    depositAmount: 400,
    balance: -45.25,
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "member",
    depositAmount: 350,
    balance: 87.75,
  },
  {
    id: "4",
    name: "Emma Wilson",
    email: "emma@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "member",
    depositAmount: 300,
    balance: -168.0,
  },
];

const mockSettlements: SettlementTransaction[] = [
  {
    id: "1",
    fromParticipantId: "4",
    toParticipantId: "1",
    amount: 125.5,
    status: "pending",
  },
  {
    id: "2",
    fromParticipantId: "4",
    toParticipantId: "3",
    amount: 42.5,
    status: "pending",
  },
  {
    id: "3",
    fromParticipantId: "2",
    toParticipantId: "3",
    amount: 45.25,
    status: "pending",
  },
];

export default function SettlementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [isSettling, setIsSettling] = useState(false);

  const totalOwed = mockParticipants
    .filter((p) => (p.balance || 0) < 0)
    .reduce((sum, p) => sum + Math.abs(p.balance || 0), 0);

  const settledCount = mockSettlements.filter(
    (s) => s.status === "completed"
  ).length;
  const progressPercent = (settledCount / mockSettlements.length) * 100;

  const handleSettleAll = () => {
    setIsSettling(true);
    // Simulate settlement process
    setTimeout(() => setIsSettling(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 glass-strong border-b border-border/50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/events/1">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-foreground">
                  Settlement
                </h1>
                <p className="text-sm text-muted-foreground">
                  Barcelona Trip 2024
                </p>
              </div>
            </div>
            <ExportCSVButton
              eventName="Barcelona Trip 2024"
              participants={mockParticipants}
              settlements={mockSettlements}
            />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Settlement Progress */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full gradient-primary flex items-center justify-center">
                <Calculator className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">
                  Settlement Progress
                </h2>
                <p className="text-sm text-muted-foreground">
                  {settledCount} of {mockSettlements.length} transfers completed
                </p>
              </div>
            </div>
            <Badge
              variant="secondary"
              className="bg-warning/10 text-warning-foreground border-warning/20"
            >
              <Clock className="h-3 w-3 mr-1" />
              In Progress
            </Badge>
          </div>
          <Progress value={progressPercent} className="h-2 mb-4" />
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Total to settle: ${totalOwed.toFixed(2)}
            </span>
            <span className="text-foreground font-medium">
              {progressPercent.toFixed(0)}% Complete
            </span>
          </div>
        </GlassCard>

        {/* Participant Balances */}
        <GlassCard className="p-6">
          <h2 className="font-semibold text-foreground mb-4">
            Participant Balances
          </h2>
          <div className="space-y-3">
            {mockParticipants.map((participant) => (
              <ParticipantBalanceRow
                key={participant.id}
                participant={participant}
              />
            ))}
          </div>
        </GlassCard>

        {/* Settlement Breakdown */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground">
              Settlement Breakdown
            </h2>
            <Badge variant="outline" className="text-xs">
              Optimized for minimum transfers
            </Badge>
          </div>
          <SettlementBreakdownTable
            participants={mockParticipants}
            settlements={mockSettlements}
          />
        </GlassCard>

        {/* Warnings */}
        <GlassCard className="p-4 border-warning/30 bg-warning/5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />
            <div>
              <p className="font-medium text-foreground">Pending Deposits</p>
              <p className="text-sm text-muted-foreground">
                Emma Wilson needs to deposit an additional $168.00 before
                settlement can be completed.
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button variant="outline" className="flex-1 bg-transparent" asChild>
            <Link href="/events/1">Back to Event</Link>
          </Button>
          <GradientButton
            className="flex-1"
            onClick={handleSettleAll}
            disabled={isSettling}
          >
            {isSettling ? (
              <>
                <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                Processing...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Settle All Balances
              </>
            )}
          </GradientButton>
        </div>
      </main>
    </div>
  );
}
