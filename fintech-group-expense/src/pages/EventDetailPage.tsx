import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { ArrowLeft, Plus, DollarSign, Users as UsersIcon, Settings as SettingsIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { GlassCard } from '@/components/ui/glass-card'
import { EventHeader } from '@/components/events/event-header'
import { ParticipantList } from '@/components/events/participant-list'
import { CategoryList } from '@/components/events/category-list'
import { TransactionTimeline } from '@/components/events/transaction-timeline'
import { SettlementBreakdownTable } from '@/components/payments/settlement-breakdown-table'
import type { Event, Participant, Category, Transaction, Settlement } from '@/types'

// Mock data for the event
const mockEvent: Event = {
    id: "1",
    name: "Ski Trip 2026",
    description: "Annual winter ski trip to Aspen",
    startDate: "2026-02-15",
    endDate: "2026-02-22",
    status: "active",
    totalBudget: 5000,
    currentSpent: 3250,
    participantCount: 6,
    createdBy: "1",
    createdAt: "2026-01-10",
}

const mockParticipants: Participant[] = [
    {
        id: "1",
        user: {
            id: "1",
            name: "Alex Johnson",
            email: "alex@example.com",
            balance: 2847.50,
        },
        role: "organizer",
        depositAmount: 1000,
        spentAmount: 850,
        balance: 150,
        joinedAt: "2026-01-10",
    },
    {
        id: "2",
        user: {
            id: "2",
            name: "Sarah Williams",
            email: "sarah@example.com",
            balance: 1200,
        },
        role: "member",
        depositAmount: 800,
        spentAmount: 950,
        balance: -150,
        joinedAt: "2026-01-12",
    },
    {
        id: "3",
        user: {
            id: "3",
            name: "Mike Chen",
            email: "mike@example.com",
            balance: 500,
        },
        role: "member",
        depositAmount: 1000,
        spentAmount: 800,
        balance: 200,
        joinedAt: "2026-01-15",
    },
]

const mockCategories: Category[] = [
    {
        id: "1",
        name: "Accommodation",
        icon: "accommodation",
        color: "#6366f1",
        budget: 2000,
        spent: 1800,
        participantIds: ["1", "2", "3"],
    },
    {
        id: "2",
        name: "Food & Drinks",
        icon: "food",
        color: "#8b5cf6",
        budget: 1500,
        spent: 950,
        participantIds: ["1", "2", "3"],
    },
    {
        id: "3",
        name: "Ski Passes",
        icon: "activities",
        color: "#06b6d4",
        budget: 1000,
        spent: 500,
        participantIds: ["1", "2", "3"],
    },
]

const mockTransactions: Transaction[] = [
    {
        id: "1",
        eventId: "1",
        categoryId: "1",
        description: "Cabin rental for the week",
        amount: 1800,
        paidBy: {
            id: "1",
            name: "Alex Johnson",
            email: "alex@example.com",
            balance: 2847.50,
        },
        splitBetween: [
            { id: "1", name: "Alex Johnson", email: "alex@example.com", balance: 2847.50 },
            { id: "2", name: "Sarah Williams", email: "sarah@example.com", balance: 1200 },
            { id: "3", name: "Mike Chen", email: "mike@example.com", balance: 500 },
        ],
        receipt: "/receipts/cabin.jpg",
        createdAt: "2026-02-15T10:00:00Z",
        status: "approved",
    },
    {
        id: "2",
        eventId: "1",
        categoryId: "2",
        description: "Grocery shopping for the week",
        amount: 450,
        paidBy: {
            id: "2",
            name: "Sarah Williams",
            email: "sarah@example.com",
            balance: 1200,
        },
        splitBetween: [
            { id: "1", name: "Alex Johnson", email: "alex@example.com", balance: 2847.50 },
            { id: "2", name: "Sarah Williams", email: "sarah@example.com", balance: 1200 },
            { id: "3", name: "Mike Chen", email: "mike@example.com", balance: 500 },
        ],
        createdAt: "2026-02-16T14:30:00Z",
        status: "approved",
    },
    {
        id: "3",
        eventId: "1",
        categoryId: "3",
        description: "Ski lift passes - 3 days",
        amount: 500,
        paidBy: {
            id: "3",
            name: "Mike Chen",
            email: "mike@example.com",
            balance: 500,
        },
        splitBetween: [
            { id: "1", name: "Alex Johnson", email: "alex@example.com", balance: 2847.50 },
            { id: "2", name: "Sarah Williams", email: "sarah@example.com", balance: 1200 },
            { id: "3", name: "Mike Chen", email: "mike@example.com", balance: 500 },
        ],
        createdAt: "2026-02-17T09:00:00Z",
        status: "pending",
    },
]

const mockSettlements: Settlement[] = [
    {
        id: "1",
        eventId: "1",
        from: {
            id: "2",
            name: "Sarah Williams",
            email: "sarah@example.com",
            balance: 1200,
        },
        to: {
            id: "1",
            name: "Alex Johnson",
            email: "alex@example.com",
            balance: 2847.50,
        },
        amount: 150,
        status: "pending",
    },
]

export default function EventDetailPage() {
    const { id } = useParams()
    const [activeTab, setActiveTab] = useState("overview")

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-xl">
                <div className="container mx-auto px-4 h-16 flex items-center gap-4">
                    <Link to="/dashboard">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>
                    </Link>
                    <div className="flex-1" />
                    <Link to={`/events/${id}/bill/upload`}>
                        <Button size="sm" className="gradient-primary text-white">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Expense
                        </Button>
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-6 space-y-6">
                {/* Event Header */}
                <EventHeader event={mockEvent} />

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-4 glass">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="expenses">Expenses</TabsTrigger>
                        <TabsTrigger value="members">Members</TabsTrigger>
                        <TabsTrigger value="settings">Settings</TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-6 mt-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Quick Stats */}
                            <GlassCard className="p-6">
                                <h3 className="text-lg font-semibold text-foreground mb-4">Quick Stats</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-primary/10">
                                                <DollarSign className="w-4 h-4 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground">Total Spent</p>
                                                <p className="font-semibold text-foreground">${mockEvent.currentSpent.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-success/10">
                                                <DollarSign className="w-4 h-4 text-success" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground">Remaining Budget</p>
                                                <p className="font-semibold text-foreground">${(mockEvent.totalBudget - mockEvent.currentSpent).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-accent/10">
                                                <UsersIcon className="w-4 h-4 text-accent" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground">Participants</p>
                                                <p className="font-semibold text-foreground">{mockEvent.participantCount} members</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </GlassCard>

                            {/* Recent Activity */}
                            <GlassCard className="p-6">
                                <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
                                <div className="space-y-3">
                                    {mockTransactions.slice(0, 3).map((txn) => (
                                        <div key={txn.id} className="flex items-center justify-between p-2 rounded-lg bg-secondary/30">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-foreground truncate">{txn.description}</p>
                                                <p className="text-xs text-muted-foreground">by {txn.paidBy.name}</p>
                                            </div>
                                            <p className="text-sm font-semibold text-foreground">${txn.amount}</p>
                                        </div>
                                    ))}
                                </div>
                            </GlassCard>
                        </div>

                        {/* Categories */}
                        <div>
                            <h3 className="text-lg font-semibold text-foreground mb-4">Budget Categories</h3>
                            <CategoryList categories={mockCategories} />
                        </div>
                    </TabsContent>

                    {/* Expenses Tab */}
                    <TabsContent value="expenses" className="space-y-6 mt-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-foreground">All Expenses</h3>
                            <div className="flex gap-2">
                                <Link to={`/events/${id}/ledger`}>
                                    <Button size="sm" variant="outline">
                                        View Ledger
                                    </Button>
                                </Link>
                                <Link to={`/events/${id}/settlements`}>
                                    <Button size="sm" variant="outline">
                                        Settlement Plan
                                    </Button>
                                </Link>
                                <Link to={`/events/${id}/bill/upload`}>
                                    <Button size="sm" className="gradient-primary">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Expense
                                    </Button>
                                </Link>
                            </div>
                        </div>
                        <TransactionTimeline transactions={mockTransactions} />
                    </TabsContent>

                    {/* Members Tab */}
                    <TabsContent value="members" className="space-y-6 mt-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-foreground">Event Members</h3>
                            <Button size="sm" variant="outline">
                                <Plus className="w-4 h-4 mr-2" />
                                Invite Member
                            </Button>
                        </div>
                        <ParticipantList participants={mockParticipants} />

                        <GlassCard className="p-6 text-center">
                            <h4 className="font-semibold text-foreground mb-2">Share Event Code</h4>
                            <p className="text-muted-foreground mb-4">Share this code with others to join the event</p>
                            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-secondary/50 border border-border/50">
                                <span className="text-2xl font-bold tracking-widest">ABC-123</span>
                            </div>
                        </GlassCard>
                    </TabsContent>

                    {/* Settings Tab */}
                    <TabsContent value="settings" className="space-y-6 mt-6">
                        <GlassCard className="p-6">
                            <h3 className="text-lg font-semibold text-foreground mb-4">Event Settings</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-foreground">Event Name</label>
                                    <p className="text-sm text-muted-foreground mt-1">{mockEvent.name}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-foreground">Description</label>
                                    <p className="text-sm text-muted-foreground mt-1">{mockEvent.description}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-foreground">Budget</label>
                                    <p className="text-sm text-muted-foreground mt-1">${mockEvent.totalBudget.toLocaleString()}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-foreground">Status</label>
                                    <p className="text-sm text-muted-foreground mt-1 capitalize">{mockEvent.status}</p>
                                </div>
                            </div>
                        </GlassCard>

                        <GlassCard className="p-6">
                            <h3 className="text-lg font-semibold text-foreground mb-4">Categories</h3>
                            <CategoryList categories={mockCategories} />
                        </GlassCard>

                        <GlassCard className="p-6 border-destructive/30">
                            <h3 className="text-lg font-semibold text-destructive mb-2">Danger Zone</h3>
                            <p className="text-sm text-muted-foreground mb-4">Once you delete an event, there is no going back.</p>
                            <Button variant="destructive">Delete Event</Button>
                        </GlassCard>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    )
}
