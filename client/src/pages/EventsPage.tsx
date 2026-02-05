import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Key, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GlassCard } from '@/components/ui/glass-card'
import { GradientButton } from '@/components/ui/gradient-button'
import { EventList } from '@/components/dashboard/event-list'
import { eventService } from '@/services/event.service'
import type { Event } from '@/types'

export default function EventsPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const data = await eventService.getAll();
                setEvents(data);
            } catch (error) {
                console.error("Failed to fetch events:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading events...</div>
    }

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
                        events={events}
                        title="Your Events"
                        emptyMessage="You haven't joined or created any events yet"
                    />
                </div>
            </main>
        </div>
    )
}
