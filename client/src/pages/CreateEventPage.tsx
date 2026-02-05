import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { eventService } from '@/services/event.service'
import { ArrowLeft, Calendar, Users, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { GlassCard } from '@/components/ui/glass-card'
import { GradientButton } from '@/components/ui/gradient-button'
import { cn } from '@/lib/utils'

const categories = [
    { value: 'trip', label: '✈️ Trip', color: 'bg-blue-500' },
    { value: 'party', label: '🎉 Party', color: 'bg-purple-500' },
    { value: 'roommates', label: '🏠 Roommates', color: 'bg-green-500' },
    { value: 'office', label: '💼 Office', color: 'bg-orange-500' },
    { value: 'sports', label: '⚽ Sports', color: 'bg-red-500' },
    { value: 'other', label: '📦 Other', color: 'bg-gray-500' },
]

export default function CreateEventPage() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        totalMembers: '',
        category: 'trip',
        startDate: '',
        endDate: '',
        budget: '',
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const result = await eventService.create({
                name: formData.name,
                description: formData.description,
                startDate: formData.startDate,
                endDate: formData.endDate,
                budget: Number(formData.budget),
            });

            // Redirect to event details
            navigate(`/events/${result.eventId}`)
        } catch (error) {
            console.error("Failed to create event:", error);
            // You might want to show an error toast here
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value })
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-xl">
                <div className="container mx-auto px-4 h-16 flex items-center gap-4">
                    <Link to="/dashboard">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Dashboard
                        </Button>
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8 max-w-2xl">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary mb-4">
                        <Calendar className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">Create New Event</h1>
                    <p className="text-muted-foreground">Set up a new group expense event</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <GlassCard className="p-6">
                        <h3 className="text-lg font-semibold text-foreground mb-4">Event Details</h3>

                        {/* Event Name */}
                        <div className="space-y-2 mb-4">
                            <Label htmlFor="name" className="text-sm font-medium">
                                Event Name *
                            </Label>
                            <Input
                                id="name"
                                placeholder="e.g., Ski Trip 2026"
                                className={cn(
                                    "h-12 rounded-xl bg-secondary/50 border-border/50",
                                    "focus:border-primary focus:ring-primary/20"
                                )}
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                required
                            />
                        </div>

                        {/* Description */}
                        <div className="space-y-2 mb-4">
                            <Label htmlFor="description" className="text-sm font-medium">
                                Description
                            </Label>
                            <Textarea
                                id="description"
                                placeholder="What's this event about?"
                                className={cn(
                                    "min-h-[100px] rounded-xl bg-secondary/50 border-border/50",
                                    "focus:border-primary focus:ring-primary/20"
                                )}
                                value={formData.description}
                                onChange={(e) => handleChange('description', e.target.value)}
                            />
                        </div>

                        {/* Category */}
                        <div className="space-y-2 mb-4">
                            <Label className="text-sm font-medium">Category *</Label>
                            <div className="grid grid-cols-3 gap-2">
                                {categories.map((cat) => (
                                    <button
                                        key={cat.value}
                                        type="button"
                                        onClick={() => handleChange('category', cat.value)}
                                        className={cn(
                                            "p-3 rounded-xl border-2 transition-all",
                                            "hover:scale-105 hover:shadow-lg",
                                            formData.category === cat.value
                                                ? "border-primary bg-primary/10"
                                                : "border-border/50 bg-secondary/30"
                                        )}
                                    >
                                        <span className="text-sm font-medium">{cat.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Dates */}
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div className="space-y-2">
                                <Label htmlFor="startDate" className="text-sm font-medium">
                                    Start Date *
                                </Label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="startDate"
                                        type="date"
                                        className={cn(
                                            "pl-10 h-12 rounded-xl bg-secondary/50 border-border/50",
                                            "focus:border-primary focus:ring-primary/20"
                                        )}
                                        value={formData.startDate}
                                        onChange={(e) => handleChange('startDate', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="endDate" className="text-sm font-medium">
                                    End Date
                                </Label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="endDate"
                                        type="date"
                                        className={cn(
                                            "pl-10 h-12 rounded-xl bg-secondary/50 border-border/50",
                                            "focus:border-primary focus:ring-primary/20"
                                        )}
                                        value={formData.endDate}
                                        onChange={(e) => handleChange('endDate', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Budget & Members */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="budget" className="text-sm font-medium">
                                    Total Budget
                                </Label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="budget"
                                        type="number"
                                        placeholder="5000"
                                        className={cn(
                                            "pl-10 h-12 rounded-xl bg-secondary/50 border-border/50",
                                            "focus:border-primary focus:ring-primary/20"
                                        )}
                                        value={formData.budget}
                                        onChange={(e) => handleChange('budget', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="totalMembers" className="text-sm font-medium">
                                    Expected Members
                                </Label>
                                <div className="relative">
                                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="totalMembers"
                                        type="number"
                                        placeholder="6"
                                        className={cn(
                                            "pl-10 h-12 rounded-xl bg-secondary/50 border-border/50",
                                            "focus:border-primary focus:ring-primary/20"
                                        )}
                                        value={formData.totalMembers}
                                        onChange={(e) => handleChange('totalMembers', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </GlassCard>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <Link to="/dashboard" className="flex-1">
                            <Button variant="outline" className="w-full h-12">
                                Cancel
                            </Button>
                        </Link>
                        <GradientButton
                            type="submit"
                            className="flex-1 h-12 text-base"
                            loading={loading}
                        >
                            Create Event
                        </GradientButton>
                    </div>
                </form>

                {/* Info Card */}
                <GlassCard className="p-4 mt-6 bg-primary/5 border-primary/20">
                    <p className="text-sm text-muted-foreground text-center">
                        💡 After creating, you'll receive an event code to share with participants
                    </p>
                </GlassCard>
            </main>
        </div>
    )
}
