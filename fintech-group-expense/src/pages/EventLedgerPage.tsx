import { useNavigate } from 'react-router'
import { ArrowLeft, Download, Filter, MessageSquare, Receipt, Banknote, ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GlassCard } from '@/components/ui/glass-card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

// Mock Activity Data
const activities = [
    {
        id: '1',
        type: 'expense',
        title: 'Dinner at Nobu',
        amount: 350.00,
        currency: 'USD',
        date: '2026-02-15T19:30:00Z',
        user: { name: 'Alex Johnson', avatar: '/avatars/alex.jpg' },
        split: 'Split equally by 5 people'
    },
    {
        id: '2',
        type: 'payment',
        title: 'Paid Sarah Williams',
        amount: 50.00,
        currency: 'USD',
        date: '2026-02-16T10:15:00Z',
        user: { name: 'Mike Chen', avatar: '/avatars/mike.jpg' },
        note: 'For the uber ride'
    },
    {
        id: '3',
        type: 'system',
        title: 'Ski Trip 2026 created',
        date: '2026-01-10T09:00:00Z',
        user: { name: 'Alex Johnson', avatar: '/avatars/alex.jpg' },
    },
    {
        id: '4',
        type: 'expense',
        title: 'Lift Tickets',
        amount: 800.00,
        currency: 'USD',
        date: '2026-02-16T08:30:00Z',
        user: { name: 'Sarah Williams', avatar: '/avatars/sarah.jpg' },
        split: 'Full group split'
    },
    {
        id: '5',
        type: 'comment',
        title: 'Commented on "Cabin Rental"',
        description: '"Can we get an extra key?"',
        date: '2026-02-14T15:20:00Z',
        user: { name: 'Mike Chen', avatar: '/avatars/mike.jpg' },
    }
]

export default function EventLedgerPage() {
    const navigate = useNavigate()

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'expense': return <Receipt className="w-4 h-4 text-orange-500" />
            case 'payment': return <Banknote className="w-4 h-4 text-green-500" />
            case 'comment': return <MessageSquare className="w-4 h-4 text-blue-500" />
            default: return <ShieldAlert className="w-4 h-4 text-purple-500" />
        }
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' }).format(date)
    }

    return (
        <div className="min-h-screen bg-background">
            <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-xl">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center">
                        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>
                        <h1 className="text-lg font-semibold ml-4">Event Ledger</h1>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="icon">
                            <Filter className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="icon">
                            <Download className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 max-w-2xl">
                <div className="space-y-4">
                    {activities.map((item) => (
                        <GlassCard key={item.id} className="p-4 flex gap-4 items-start">
                            <div className="pt-1">
                                <Avatar className="w-10 h-10 border border-border">
                                    <AvatarImage src={item.user.avatar} />
                                    <AvatarFallback>{item.user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="font-medium text-foreground flex items-center gap-2">
                                            {item.title}
                                            <span className="p-1 rounded-full bg-secondary/50">
                                                {getActivityIcon(item.type)}
                                            </span>
                                        </p>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                                            <span>{item.user.name}</span>
                                            <span>•</span>
                                            <span>{formatDate(item.date)}</span>
                                        </div>
                                    </div>
                                    {item.amount && (
                                        <span className={`font-semibold whitespace-nowrap ${item.type === 'payment' ? 'text-green-500' : 'text-foreground'
                                            }`}>
                                            {item.type === 'payment' ? '+' : ''}${item.amount.toFixed(2)}
                                        </span>
                                    )}
                                </div>

                                {(item.split || item.note || item.description) && (
                                    <p className="text-sm text-muted-foreground mt-2 bg-secondary/20 p-2 rounded-lg inline-block">
                                        {item.split || item.note || item.description}
                                    </p>
                                )}
                            </div>
                        </GlassCard>
                    ))}
                </div>
            </main>
        </div>
    )
}
