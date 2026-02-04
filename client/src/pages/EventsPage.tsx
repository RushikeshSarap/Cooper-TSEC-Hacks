import { Link } from 'react-router'
import { Plus, Key, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GlassCard } from '@/components/ui/glass-card'
import { GradientButton } from '@/components/ui/gradient-button'
import { EventList } from '@/components/dashboard/event-list'
import type { Event } from '@/types'

// Mock events data
const mockCreatedEvents: Event[] = [
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
]

const mockJoinedEvents: Event[] = [
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

export default function EventsPage() {
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
                        <span className="font-bold text-lg text-foreground">My Events</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link to="/events/join">
                            <Button variant="outline" size="sm">
                                <Key className="w-4 h-4 mr-2" />
                                Join Event
                            </Button>
                        </Link>
                        <Link to="/events/create">
                            <GradientButton size="sm">
                                <Plus className="w-4 h-4 mr-2" />
                                Create Event
                            </GradientButton>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8 space-y-8">
                {/* Quick Actions */}
                <div className="grid md:grid-cols-2 gap-4">
                    <Link to="/events/create">
                        <GlassCard className="p-6 hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-xl gradient-primary">
                                    <Calendar className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground">Create New Event</h3>
                                    <p className="text-sm text-muted-foreground">Start a new group expense event</p>
                                </div>
                            </div>
                        </GlassCard>
                    </Link>

                    <Link to="/events/join">
                        <GlassCard className="p-6 hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-success/10">
                                    <Key className="w-6 h-6 text-success" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground">Join with Code</h3>
                                    <p className="text-sm text-muted-foreground">Enter an event code to join</p>
                                </div>
                            </div>
                        </GlassCard>
                    </Link>
                </div>

                {/* Events I Created */}
                <div>
                    <EventList
                        events={mockCreatedEvents}
                        title="Events I Created"
                        emptyMessage="You haven't created any events yet"
                    />
                </div>

                {/* Events I Joined */}
                <div>
                    <EventList
                        events={mockJoinedEvents}
                        title="Events I Joined"
                        emptyMessage="You haven't joined any events yet"
                    />
                </div>
            </main>
        </div>
    )
}
