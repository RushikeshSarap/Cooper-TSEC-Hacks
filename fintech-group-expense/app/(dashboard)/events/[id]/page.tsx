"use client";

import { useState } from "react";
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import { EventHeader } from "@/components/events/event-header";
import { SharedWalletCard } from "@/components/events/shared-wallet-card";
import { ParticipantList } from "@/components/events/participant-list";
import { CategoryList } from "@/components/events/category-list";
import { TransactionTimeline } from "@/components/events/transaction-timeline";
import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";
import type { Event, Participant, Category, Transaction, User } from "@/types";

// Mock data
const mockEvent: Event = {
  id: "1",
  name: "Ski Trip 2026",
  description: "Annual winter ski trip to Aspen with the crew",
  startDate: "2026-02-15",
  endDate: "2026-02-20",
  status: "active",
  totalBudget: 5000,
  currentSpent: 3250,
  participantCount: 6,
  createdBy: "1",
  createdAt: "2026-01-10",
};

const mockUsers: User[] = [
  { id: "1", name: "Alex Johnson", email: "alex@example.com", balance: 385 },
  { id: "2", name: "Sarah Chen", email: "sarah@example.com", balance: 150 },
  { id: "3", name: "Mike Davis", email: "mike@example.com", balance: -127.5 },
  { id: "4", name: "Emma Wilson", email: "emma@example.com", balance: -85 },
  { id: "5", name: "Chris Brown", email: "chris@example.com", balance: 200 },
  { id: "6", name: "Lisa Park", email: "lisa@example.com", balance: -50 },
];

const mockParticipants: Participant[] = mockUsers.map((user, index) => ({
  id: `p${index + 1}`,
  user,
  role: index === 0 ? "organizer" : "member",
  depositAmount: 800 + Math.random() * 200,
  spentAmount: 300 + Math.random() * 400,
  balance: user.balance,
  joinedAt: "2026-01-15",
}));

const mockCategories: Category[] = [
  { id: "1", name: "Accommodation", icon: "accommodation", color: "#6366f1", budget: 2000, spent: 1850, participantIds: ["1", "2", "3", "4", "5", "6"] },
  { id: "2", name: "Food & Drinks", icon: "food", color: "#8b5cf6", budget: 1200, spent: 680, participantIds: ["1", "2", "3", "4", "5", "6"] },
  { id: "3", name: "Ski Rentals", icon: "activities", color: "#06b6d4", budget: 1000, spent: 520, participantIds: ["2", "3", "4", "5"] },
  { id: "4", name: "Transport", icon: "transport", color: "#10b981", budget: 500, spent: 200, participantIds: ["1", "2", "3", "4", "5", "6"] },
];

const mockTransactions: Transaction[] = [
  { id: "1", eventId: "1", categoryId: "1", description: "Airbnb - Mountain Lodge", amount: 1850, paidBy: mockUsers[0], splitBetween: mockUsers, receipt: "receipt1.jpg", createdAt: "2026-02-15T14:30:00", status: "approved" },
  { id: "2", eventId: "1", categoryId: "2", description: "Grocery Store Run", amount: 245.50, paidBy: mockUsers[1], splitBetween: mockUsers, createdAt: "2026-02-15T18:00:00", status: "approved" },
  { id: "3", eventId: "1", categoryId: "3", description: "Ski Equipment Rental", amount: 520, paidBy: mockUsers[2], splitBetween: mockUsers.slice(1, 5), receipt: "receipt2.jpg", createdAt: "2026-02-16T09:15:00", status: "approved" },
  { id: "4", eventId: "1", categoryId: "2", description: "Dinner at Mountain Grill", amount: 320, paidBy: mockUsers[0], splitBetween: mockUsers, createdAt: "2026-02-16T20:30:00", status: "pending" },
  { id: "5", eventId: "1", categoryId: "4", description: "Uber to Airport", amount: 85, paidBy: mockUsers[4], splitBetween: [mockUsers[0], mockUsers[4]], createdAt: "2026-02-15T10:00:00", status: "approved" },
];

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "participants", label: "Participants" },
  { id: "categories", label: "Categories" },
  { id: "transactions", label: "Transactions" },
  { id: "settlement", label: "Settlement" },
];

export default function EventDetailPage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
          <Link
            href="/dashboard"
            className="p-2 rounded-xl hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </Link>
          <div className="flex-1">
            <h1 className="font-semibold text-foreground truncate">{mockEvent.name}</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 space-y-6">
        <EventHeader event={mockEvent} />

        {/* Tab Navigation */}
        <div className="glass rounded-2xl p-1.5 overflow-x-auto">
          <div className="flex items-center gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap",
                  activeTab === tab.id
                    ? "gradient-primary text-white shadow-md"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <SharedWalletCard
              balance={mockEvent.totalBudget - mockEvent.currentSpent}
              totalDeposits={4800}
              pendingDeposits={200}
            />

            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">Recent Activity</h2>
                <button
                  onClick={() => setActiveTab("transactions")}
                  className="text-sm text-primary hover:underline"
                >
                  View all
                </button>
              </div>
              <TransactionTimeline transactions={mockTransactions.slice(0, 3)} />
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">Categories</h2>
                <button
                  onClick={() => setActiveTab("categories")}
                  className="text-sm text-primary hover:underline"
                >
                  View all
                </button>
              </div>
              <CategoryList categories={mockCategories.slice(0, 2)} />
            </div>
          </div>
        )}

        {activeTab === "participants" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">
                Participants ({mockParticipants.length})
              </h2>
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg gradient-primary text-white text-sm font-medium">
                <Plus className="w-4 h-4" />
                Invite
              </button>
            </div>
            <ParticipantList participants={mockParticipants} />
          </div>
        )}

        {activeTab === "categories" && (
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Expense Categories
            </h2>
            <CategoryList categories={mockCategories} />
          </div>
        )}

        {activeTab === "transactions" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">
                All Transactions
              </h2>
              <Link
                href={`/events/${mockEvent.id}/add-expense`}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg gradient-primary text-white text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Expense
              </Link>
            </div>
            <TransactionTimeline transactions={mockTransactions} />
          </div>
        )}

        {activeTab === "settlement" && (
          <div className="space-y-6">
            <GlassCard>
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Settlement Summary
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                Simplified payments to settle all balances
              </p>
              <div className="space-y-3">
                {[
                  { from: mockUsers[2], to: mockUsers[0], amount: 127.5 },
                  { from: mockUsers[3], to: mockUsers[0], amount: 85 },
                  { from: mockUsers[5], to: mockUsers[1], amount: 50 },
                ].map((settlement, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30"
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <div className="text-sm font-medium text-foreground">
                        {settlement.from.name}
                      </div>
                      <div className="flex-1 border-t border-dashed border-border" />
                      <div className="text-sm font-medium text-foreground">
                        {settlement.to.name}
                      </div>
                    </div>
                    <div className="font-semibold text-primary">
                      ${settlement.amount.toFixed(2)}
                    </div>
                    <button className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors">
                      Pay
                    </button>
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard>
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Balance Overview
              </h2>
              <div className="space-y-2">
                {mockParticipants.map((participant) => (
                  <div
                    key={participant.id}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary/30 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full",
                          participant.balance >= 0 ? "bg-success" : "bg-destructive"
                        )}
                      />
                      <span className="text-sm text-foreground">
                        {participant.user.name}
                      </span>
                    </div>
                    <span
                      className={cn(
                        "text-sm font-semibold",
                        participant.balance >= 0 ? "text-success" : "text-destructive"
                      )}
                    >
                      {participant.balance >= 0 ? "+" : ""}${participant.balance.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        )}
      </main>

      {/* Floating Add Button */}
      <Link
        href={`/events/${mockEvent.id}/add-expense`}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full gradient-primary shadow-lg shadow-primary/30 hover:scale-110 hover:shadow-glow active:scale-95 transition-all duration-300"
      >
        <Plus className="w-6 h-6 text-white" />
      </Link>
    </div>
  );
}
