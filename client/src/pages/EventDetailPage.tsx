import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router'
import { ArrowLeft, Plus, DollarSign, Users as UsersIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { GlassCard } from '@/components/ui/glass-card'
import { EventHeader } from '@/components/events/event-header'
import { ParticipantList } from '@/components/events/participant-list'
import { CategoryList } from '@/components/events/category-list'
import { TransactionTimeline } from '@/components/events/transaction-timeline'
import type { Event, Participant, Category, Transaction } from '@/types'
import { eventService } from '@/services/event.service'

export default function EventDetailPage() {
    const { id } = useParams()
    const [activeTab, setActiveTab] = useState("overview")
    const [event, setEvent] = useState<Event | null>(null);
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            try {
                // Use Promise.allSettled to prevent one failure from blocking everything
                const results = await Promise.allSettled([
                    eventService.getById(id),
                    eventService.getParticipants(id),
                    eventService.getCategories(id),
                    eventService.getPayments(id)
                ]);

                // Check Event Fetch
                if (results[0].status === 'fulfilled') {
                    setEvent(results[0].value);
                } else {
                    console.error("Failed to fetch event:", results[0].reason);
                }

                if (results[1].status === 'fulfilled') setParticipants(results[1].value);
                else console.error("Failed to fetch participants:", results[1].reason);

                if (results[2].status === 'fulfilled') setCategories(results[2].value);
                else console.warn("Failed to fetch categories:", results[2].reason);

                if (results[3].status === 'fulfilled') setTransactions(results[3].value);
                else console.warn("Failed to fetch transactions:", results[3].reason);

            } catch (error) {
                console.error("General fetch error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading event...</div>
    }

    if (!event) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <h2 className="text-xl font-semibold mb-2">Event not found</h2>
                <p className="text-muted-foreground mb-4">Could not load event details. ID: {id}</p>
                <Link to="/dashboard">
                    <Button variant="outline">Back to Dashboard</Button>
                </Link>
            </div>
        )
    }

    const handleDelete = async () => {
        if (!event || !confirm("Are you sure you want to delete this event?")) return;
        try {
            await eventService.delete(event.id);
            alert("Event deleted successfully");
            window.location.href = "/dashboard";
        } catch (error) {
            console.error("Delete failed", error);
            alert("Failed to delete event");
        }
    };

    const handleInvite = async () => {
        const email = prompt("Enter email to invite:");
        if (!email || !id) return;
        try {
            await eventService.inviteUser(id, email);
            alert("Invitation sent!");
            // Refresh participants
            const parts = await eventService.getParticipants(id);
            setParticipants(parts);
        } catch (error) {
            console.error("Invite failed", error);
            alert("Failed to invite user (User must exist)");
        }
    };

    const handleAddCategory = async () => {
        const name = prompt("Enter category name:");
        if (!name || !id) return;
        try {
            await eventService.addCategory(id, name);
            // Refresh categories
            const cats = await eventService.getCategories(id);
            setCategories(cats);
        } catch (error) {
            console.error("Add category failed", error);
        }
    };

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
                <EventHeader event={event} />

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
                                                <p className="font-semibold text-foreground">${event.currentSpent.toLocaleString()}</p>
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
                                                <p className="font-semibold text-foreground">${(event.totalBudget - event.currentSpent).toLocaleString()}</p>
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
                                                <p className="font-semibold text-foreground">{event.participantCount} members</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </GlassCard>

                            {/* Recent Activity */}
                            <GlassCard className="p-6">
                                <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
                                <div className="space-y-3">
                                    {transactions.slice(0, 3).map((txn) => (
                                        <div key={txn.id} className="flex items-center justify-between p-2 rounded-lg bg-secondary/30">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-foreground truncate">{txn.description}</p>
                                                <p className="text-xs text-muted-foreground">by {txn.paidBy?.name || 'Unknown'}</p>
                                            </div>
                                            <p className="text-sm font-semibold text-foreground">${txn.amount}</p>
                                        </div>
                                    ))}
                                    {transactions.length === 0 && (
                                        <p className="text-sm text-muted-foreground">No recent activity.</p>
                                    )}
                                </div>
                            </GlassCard>
                        </div>

                        {/* Categories */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-foreground">Budget Categories</h3>
                                <Button size="sm" variant="outline" onClick={handleAddCategory}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Category
                                </Button>
                            </div>
                            <CategoryList categories={categories} />
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
                        <TransactionTimeline transactions={transactions} />
                    </TabsContent>

                    {/* Members Tab */}
                    <TabsContent value="members" className="space-y-6 mt-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-foreground">Event Members</h3>
                            <Button size="sm" variant="outline" onClick={handleInvite}>
                                <Plus className="w-4 h-4 mr-2" />
                                Invite Member
                            </Button>
                        </div>
                        <ParticipantList participants={participants} />

                        <GlassCard className="p-6 text-center">
                            <h4 className="font-semibold text-foreground mb-2">Share Event Code</h4>
                            <p className="text-muted-foreground mb-4">Share this code with others to join the event</p>
                            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-secondary/50 border border-border/50">
                                <span className="text-2xl font-bold tracking-widest">{event.id}</span>
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
                                    <p className="text-sm text-muted-foreground mt-1">{event.name}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-foreground">Description</label>
                                    <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-foreground">Budget</label>
                                    <p className="text-sm text-muted-foreground mt-1">${event.totalBudget.toLocaleString()}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-foreground">Status</label>
                                    <p className="text-sm text-muted-foreground mt-1 capitalize">{event.status}</p>
                                </div>
                            </div>
                            <Button variant="outline" className="mt-4" disabled>Edit (Coming Soon)</Button>
                        </GlassCard>

                        <GlassCard className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-foreground">Categories</h3>
                                <Button size="sm" variant="outline" onClick={handleAddCategory}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add
                                </Button>
                            </div>
                            <CategoryList categories={categories} />
                        </GlassCard>

                        <GlassCard className="p-6 border-destructive/30">
                            <h3 className="text-lg font-semibold text-destructive mb-2">Danger Zone</h3>
                            <p className="text-sm text-muted-foreground mb-4">Once you delete an event, there is no going back.</p>
                            <Button variant="destructive" onClick={handleDelete}>Delete Event</Button>
                        </GlassCard>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    )
}
