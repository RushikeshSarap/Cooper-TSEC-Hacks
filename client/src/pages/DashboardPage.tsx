"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { WalletCard } from "@/components/dashboard/wallet-card";
import { EventList } from "@/components/dashboard/event-list";
import { CreateEventButton } from "@/components/dashboard/create-event-button";
import { NotificationBanner } from "@/components/dashboard/notification-banner";
import { GlassCard } from "@/components/ui/glass-card";
import { UserAvatar } from "@/components/user-avatar";
import { Bell, Settings, TrendingUp, TrendingDown, Clock } from "lucide-react";
import type { Event } from "@/types";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Axios instance with token
  const api = axios.create({
    baseURL: "http://localhost:5000/api/v1",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
});
console.log(localStorage.getItem("token"));

  // ✅ Fetch user + events
  const fetchDashboardData = async () => {
    try {
      const [userRes, eventRes] = await Promise.all([
        api.get("/auth/me"),
        api.get("/events"),
      ]);

      setUser(userRes.data.user);
      setEvents(eventRes.data.events || []);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-destructive">
          Failed to load user data. Please log in again.
        </p>
      </div>
    );
  }

  // ✅ Filter active and past events
  const activeEvents = events.filter((e) => e.status === "active");
  const pastEvents = events.filter((e) => e.status === "settled");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl gradient-primary">
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="font-bold text-lg text-foreground">SplitFlow</span>
          </div>
          <div className="flex items-center gap-2">
            {/* Static Notification Icon — no API now */}
            <button className="relative p-2 rounded-xl hover:bg-secondary transition-colors">
              <Bell className="w-5 h-5 text-muted-foreground" />
            </button>
            <button className="p-2 rounded-xl hover:bg-secondary transition-colors">
              <Settings className="w-5 h-5 text-muted-foreground" />
            </button>
            <UserAvatar name={user.name} size="sm" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 pb-24 space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome back, {user.name.split(" ")[0]}
          </h1>
          <p className="text-muted-foreground mt-1">
            Here&apos;s an overview of your group expenses
          </p>
        </div>

        {/* (Optional) Notification Banner placeholder */}
        <NotificationBanner
          notification={{
            id: "1",
            type: "info",
            title: "Welcome!",
            message: "You’re all caught up. No new notifications.",
            read: true,
            createdAt: new Date().toISOString(),
          }}
        />

        {/* Wallet Card */}
        <WalletCard
          balance={user.balance || 0}
          walletAddress={user.walletAddress || "N/A"}
        />

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <GlassCard className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-success/10">
                <TrendingUp className="w-4 h-4 text-success" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">You&apos;re owed</p>
                <p className="font-semibold text-foreground">
                  ${user.owed ?? 0}
                </p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-destructive/10">
                <TrendingDown className="w-4 h-4 text-destructive" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">You owe</p>
                <p className="font-semibold text-foreground">
                  ${user.owe ?? 0}
                </p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10">
                <Clock className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Pending</p>
                <p className="font-semibold text-foreground">
                  {user.pendingItems ?? 0} items
                </p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-accent/10">
                <svg
                  viewBox="0 0 24 24"
                  className="w-4 h-4 text-accent"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Active Events</p>
                <p className="font-semibold text-foreground">
                  {activeEvents.length}
                </p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Active Events */}
        <EventList
          events={activeEvents}
          title="Active Events"
          emptyMessage="No active events. Create one to get started!"
        />

        {/* Past Events */}
        {pastEvents.length > 0 && (
          <EventList events={pastEvents} title="Past Events" />
        )}
      </main>

      {/* Floating Action Button */}
      <CreateEventButton />
    </div>
  );
}
