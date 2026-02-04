import { useNavigate } from 'react-router'
import { ArrowLeft, CheckCircle2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GlassCard } from '@/components/ui/glass-card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

// Mock Data
const settlements = [
    {
        id: '1',
        from: { name: 'Sarah Williams', avatar: '/avatars/sarah.jpg', email: 'sarah@example.com' },
        to: { name: 'Alex Johnson', avatar: '/avatars/alex.jpg', email: 'alex@example.com' },
        amount: 150.00,
        status: 'pending'
    },
    {
        id: '2',
        from: { name: 'Mike Chen', avatar: '/avatars/mike.jpg', email: 'mike@example.com' },
        to: { name: 'Alex Johnson', avatar: '/avatars/alex.jpg', email: 'alex@example.com' },
        amount: 75.50,
        status: 'completed'
    }
]

export default function SettlementSummaryPage() {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-background">
            <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-xl">
                <div className="container mx-auto px-4 h-16 flex items-center">
                    <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                    <h1 className="text-lg font-semibold ml-4">Settlement Plan</h1>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 max-w-2xl">
                <div className="mb-8 text-center">
                    <h2 className="text-2xl font-bold mb-2">How to settle up?</h2>
                    <p className="text-muted-foreground">The most efficient way to clear all debts.</p>
                </div>

                <div className="space-y-4">
                    {settlements.map((item) => (
                        <GlassCard key={item.id} className="p-0 overflow-hidden group">
                            <div className="p-6 flex items-center justify-between gap-4">
                                {/* From User */}
                                <div className="flex flex-col items-center gap-2 min-w-[80px]">
                                    <Avatar className="w-12 h-12 border-2 border-background">
                                        <AvatarImage src={item.from.avatar} />
                                        <AvatarFallback>{item.from.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <span className="text-xs font-medium text-center truncate w-full">{item.from.name}</span>
                                </div>

                                {/* Flow Visualization */}
                                <div className="flex-1 flex flex-col items-center gap-2">
                                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Owes</span>
                                    <div className="relative w-full h-1 bg-secondary rounded-full overflow-hidden">
                                        <div className={`absolute inset-y-0 left-0 bg-primary w-full origin-left transition-transform duration-1000 ${item.status === 'completed' ? 'scale-x-100' : 'scale-x-50 animate-pulse'
                                            }`} />
                                    </div>
                                    <span className="text-lg font-bold">${item.amount.toFixed(2)}</span>
                                </div>

                                {/* To User */}
                                <div className="flex flex-col items-center gap-2 min-w-[80px]">
                                    <Avatar className="w-12 h-12 border-2 border-background">
                                        <AvatarImage src={item.to.avatar} />
                                        <AvatarFallback>{item.to.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <span className="text-xs font-medium text-center truncate w-full">{item.to.name}</span>
                                </div>
                            </div>

                            {/* Action Footer */}
                            <div className="bg-secondary/30 p-4 flex items-center justify-between border-t border-border/50">
                                {item.status === 'completed' ? (
                                    <div className="flex items-center gap-2 text-green-500 font-medium">
                                        <CheckCircle2 className="w-4 h-4" />
                                        <span>Settled</span>
                                    </div>
                                ) : (
                                    <>
                                        <span className="text-sm text-muted-foreground">Pending payment</span>
                                        <Button size="sm" variant="outline" className="gap-2" onClick={() => navigate('/wallet/pay')}>
                                            Pay Now <ArrowRight className="w-4 h-4" />
                                        </Button>
                                    </>
                                )}
                            </div>
                        </GlassCard>
                    ))}
                </div>

                <div className="mt-8 p-4 rounded-xl bg-primary/5 border border-primary/20 text-center">
                    <p className="text-sm text-muted-foreground">
                        All settlements are calculated to minimize the total number of transactions required.
                    </p>
                </div>
            </main>
        </div>
    )
}
