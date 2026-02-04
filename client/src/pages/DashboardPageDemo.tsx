import { WalletCard } from "@/components/dashboard/wallet-card"
import { EventList } from "@/components/dashboard/event-list"
import { CreateEventButton } from "@/components/dashboard/create-event-button"
import { NotificationBanner } from "@/components/dashboard/notification-banner"
import { GlassCard } from "@/components/ui/glass-card"
import { UserAvatar } from "@/components/user-avatar"
import { Bell, Settings, TrendingUp, TrendingDown, Clock } from "lucide-react"
import type { Event, Notification } from "@/types"

// Mock data
const mockUser = {
    id: "1",
    name: "Alex Johnson",
    email: "alex@example.com",
    balance: 2847.50,
    walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
}

const mockEvents: Event[] = [
    {
        id: "1",
        name: "Ski Trip 2026",
        description: "Annual winter ski trip to Aspen",
        startDate: "2026-02-15",
        status: "active",
        totalBudget: 5000,
        currentSpent: 3250,
        participantCount: 6,
        createdBy: "1",
        createdAt: "2026-01-10",
    },
    {
        id: "2",
        name: "Office Party",
        description: "Q1 Team celebration dinner",
        startDate: "2026-02-28",
        status: "active",
        totalBudget: 1500,
        currentSpent: 450,
        participantCount: 12,
        createdBy: "1",
        createdAt: "2026-02-01",
    },
    {
        id: "3",
        name: "Beach Vacation",
        description: "Summer getaway to Malibu",
        startDate: "2025-08-10",
        status: "settled",
        totalBudget: 8000,
        currentSpent: 7650,
        participantCount: 4,
        createdBy: "2",
        createdAt: "2025-07-01",
    },
]

const mockNotification: Notification = {
    id: "1",
    type: "info",
    title: "Pending Deposit",
    message: "You have $150 pending deposit for Ski Trip 2026",
    read: false,
    createdAt: new Date().toISOString(),
}

const activeEvents = mockEvents.filter((e) => e.status === "active")
const pastEvents = mockEvents.filter((e) => e.status === "settled")

export default function DashboardPage() {
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
                        <button className="relative p-2 rounded-xl hover:bg-secondary transition-colors">
                            <Bell className="w-5 h-5 text-muted-foreground" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
                        </button>
                        <button className="p-2 rounded-xl hover:bg-secondary transition-colors">
                            <Settings className="w-5 h-5 text-muted-foreground" />
                        </button>
                        <UserAvatar name={mockUser.name} size="sm" />
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-6 pb-24 space-y-6">
                {/* Welcome Section */}
                <div>
                    <h1 className="text-2xl font-bold text-foreground">
                        Welcome back, {mockUser.name.split(" ")[0]}
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Here&apos;s an overview of your group expenses
                    </p>
                </div>

                {/* Notification */}
                <NotificationBanner notification={mockNotification} />

                {/* Wallet Card */}
                <WalletCard
                    balance={mockUser.balance}
                    walletAddress={mockUser.walletAddress}
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
                                <p className="font-semibold text-foreground">$385.00</p>
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
                                <p className="font-semibold text-foreground">$127.50</p>
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
                                <p className="font-semibold text-foreground">3 items</p>
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
                                <p className="font-semibold text-foreground">{activeEvents.length}</p>
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
    )
}
