import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { eventService } from '@/services/event.service'
import { ArrowLeft, Key, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GlassCard } from '@/components/ui/glass-card'
import { GradientButton } from '@/components/ui/gradient-button'
import { cn } from '@/lib/utils'

export default function JoinEventPage() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [eventCode, setEventCode] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    const formatEventCode = (value: string) => {
        // Remove non-alphanumeric characters and convert to uppercase
        const cleaned = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase()
        // Format as XXX-XXX
        if (cleaned.length <= 3) return cleaned
        return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}`
    }

    const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatEventCode(e.target.value)
        setEventCode(formatted)
        setError('')
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        // Used directly as ID for now, as per plan
        // The "code" is just the numeric ID in the backend currently
        // If the user enters XXX-XXX, we might need to strip or parse if backend expects int
        // But for now, let's assume valid ID input or strip non-numeric if we want strictly int

        // Strategy: Try to join with the code as ID.
        // If the input format was XXX-XXX, we remove hyphen.
        // However, backend IDs are integers (1, 2, 3).
        // Let's assume for this hackathon version, users enter the numeric ID.
        // But the UI encourages 6 chars. 
        // We'll strip hyphens and try sending that.

        const cleanCode = eventCode.replace(/[^0-9]/g, '');

        try {
            await eventService.join(cleanCode);
            setSuccess(true);
            // Redirect after short delay
            setTimeout(() => {
                navigate(`/events/${cleanCode}`)
            }, 1000)
        } catch (err) {
            console.error(err);
            setError('Failed to join event. Invalid code or already joined.');
        } finally {
            setLoading(false)
        }
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
            <main className="container mx-auto px-4 py-8 max-w-md">
                <div className="min-h-[60vh] flex flex-col justify-center">
                    {!success ? (
                        <>
                            <div className="text-center mb-8">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary mb-4">
                                    <Key className="w-8 h-8 text-white" />
                                </div>
                                <h1 className="text-3xl font-bold text-foreground mb-2">Join Event</h1>
                                <p className="text-muted-foreground">
                                    Enter the event code shared by the organizer
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <GlassCard className="p-6">
                                    <div className="space-y-4">
                                        <Label htmlFor="eventCode" className="text-sm font-medium">
                                            Event Code
                                        </Label>
                                        <Input
                                            id="eventCode"
                                            placeholder="XXX-XXX"
                                            className={cn(
                                                "h-16 text-center text-2xl font-bold tracking-widest rounded-xl",
                                                "bg-secondary/50 border-border/50",
                                                "focus:border-primary focus:ring-primary/20",
                                                error && "border-destructive focus:border-destructive"
                                            )}
                                            value={eventCode}
                                            onChange={handleCodeChange}
                                            maxLength={7}
                                            required
                                            autoFocus
                                        />
                                        {error && (
                                            <p className="text-sm text-destructive text-center">{error}</p>
                                        )}
                                    </div>
                                </GlassCard>

                                <GradientButton
                                    type="submit"
                                    className="w-full h-12 text-base"
                                    loading={loading}
                                    disabled={!eventCode}
                                >
                                    Join Event
                                </GradientButton>
                            </form>

                            {/* Help Text */}
                            <GlassCard className="p-4 mt-6 bg-muted/30">
                                <p className="text-sm text-muted-foreground text-center">
                                    💡 Don't have a code? Ask the event organizer to share it with you
                                </p>
                            </GlassCard>
                        </>
                    ) : (
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-success/10 mb-6">
                                <CheckCircle2 className="w-10 h-10 text-success" />
                            </div>
                            <h2 className="text-2xl font-bold text-foreground mb-2">Successfully Joined!</h2>
                            <p className="text-muted-foreground mb-6">
                                Redirecting to event...
                            </p>
                            <div className="flex justify-center">
                                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
