"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import { eventService } from "@/services/event.service";
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
  const [loadingError, setLoadingError] = useState<string | null>(null);

  // ✅ Fetch user + events
  const fetchDashboardData = async () => {
    try {
      // Fetch user data directly via api service
      const userRes = await api.get("/auth/me");
      setUser(userRes.data.user);

      // Fetch events via event service (handles mapping)
      const eventsData = await eventService.getAll();
      setEvents(eventsData);
    } catch (err: any) {
      console.error("Dashboard fetch error:", err);
      setLoadingError(err.message || "Unknown error");
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
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <GlassCard className="p-8 text-center max-w-sm w-full">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-destructive/10 mb-4">
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-destructive" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2">Failed to load dashboard</h2>
          <p className="text-muted-foreground text-sm mb-6">
            We couldn't fetch your profile data. Please check your connection or try again.
            <br />
            <span className="text-xs text-destructive font-mono mt-2 block bg-destructive/5 p-2 rounded">
              Error: {loadingError}
            </span>
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors"
            >
              Retry
            </button>
            <button
               onClick={() => {
                 localStorage.removeItem("token");
                 window.location.href = "/login";
               }}
               className="px-4 py-2 rounded-xl border border-border hover:bg-secondary transition-colors text-sm font-medium"
            >
              Log out
            </button>
          </div>
        </GlassCard>
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
        <div onClick={() => window.location.href = '/wallet'} className="cursor-pointer transition-transform hover:scale-[1.02]">
            <WalletCard
              balance={Number(user.wallet_balance || 0)}
              walletAddress={user.walletAddress || "N/A"}
            />
        </div>

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
