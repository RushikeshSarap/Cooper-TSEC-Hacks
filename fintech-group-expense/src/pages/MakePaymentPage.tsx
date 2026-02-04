import { useState } from 'react'
import { useNavigate } from 'react-router'
import { ArrowLeft, Search, ChevronRight, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { FinternetService } from '@/services/finternet'

export default function MakePaymentPage() {
    const navigate = useNavigate()
    const [step, setStep] = useState(1)
    const [selectedUser, setSelectedUser] = useState<string | null>(null)
    const [amount, setAmount] = useState('')
    const [note, setNote] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    // Mock Users
    const users = [
        { id: '1', name: 'Alex Johnson', email: 'alex@example.com', avatar: '/avatars/alex.jpg' },
        { id: '2', name: 'Sarah Williams', email: 'sarah@example.com', avatar: '/avatars/sarah.jpg' },
        { id: '3', name: 'Mike Chen', email: 'mike@example.com', avatar: '/avatars/mike.jpg' },
    ]

    const handlePayment = async () => {
        setLoading(true)
        try {
            const recipient = users.find(u => u.id === selectedUser)
            const result = await FinternetService.initiatePayment(
                parseFloat(amount),
                'USD',
                `Payment to ${recipient?.name}: ${note}`
            )

            if (result.success) {
                setLoading(false)
                setSuccess(true)
                setTimeout(() => {
                    navigate(-1)
                }, 2000)
            }
        } catch (error) {
            console.error("Payment failed", error)
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
                <div className="space-y-6 text-center animate-in fade-in zoom-in-95 duration-500">
                    <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                        <Send className="w-10 h-10 text-primary" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold text-foreground">Payment Sent!</h2>
                        <p className="text-muted-foreground text-lg">
                            ${parseFloat(amount).toFixed(2)} sent to {users.find(u => u.id === selectedUser)?.name}
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-xl">
                <div className="container mx-auto px-4 h-16 flex items-center">
                    <Button variant="ghost" size="sm" onClick={() => step === 1 ? navigate(-1) : setStep(1)}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        {step === 1 ? 'Back' : 'Change Recipient'}
                    </Button>
                    <h1 className="text-lg font-semibold ml-4">{step === 1 ? 'Select Recipient' : 'Send Payment'}</h1>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 max-w-lg">
                {step === 1 ? (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input placeholder="Search name, email, or phone" className="pl-10" />
                        </div>

                        <div className="space-y-2">
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Recent</span>
                            <div className="space-y-2">
                                {users.map((user) => (
                                    <button
                                        key={user.id}
                                        onClick={() => {
                                            setSelectedUser(user.id)
                                            setStep(2)
                                        }}
                                        className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-secondary/50 transition-colors text-left group"
                                    >
                                        <Avatar>
                                            <AvatarImage src={user.avatar} />
                                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <p className="font-medium group-hover:text-primary transition-colors">{user.name}</p>
                                            <p className="text-sm text-muted-foreground">{user.email}</p>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="flex flex-col items-center gap-3">
                            <Avatar className="w-20 h-20 border-4 border-background shadow-xl">
                                <AvatarImage src={users.find(u => u.id === selectedUser)?.avatar} />
                                <AvatarFallback className="text-2xl">{users.find(u => u.id === selectedUser)?.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="text-center">
                                <p className="text-sm text-muted-foreground">Paying</p>
                                <h3 className="text-xl font-bold">{users.find(u => u.id === selectedUser)?.name}</h3>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="relative text-center">
                                <span className="absolute left-1/2 -translate-x-full top-1/2 -translate-y-1/2 pr-2 text-3xl font-bold text-muted-foreground transform -ml-16">
                                    $
                                </span>
                                <Input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="text-5xl font-bold h-auto bg-transparent border-none text-center focus-visible:ring-0 p-0 w-full placeholder:text-muted-foreground/30"
                                    placeholder="0.00"
                                    autoFocus
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Add a note</Label>
                                <Input
                                    placeholder="What's this for?"
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    className="text-center bg-secondary/30 border-transparent focus:bg-background"
                                />
                            </div>
                        </div>

                        <Button
                            className="w-full h-14 text-lg gradient-primary shadow-lg shadow-primary/20"
                            onClick={handlePayment}
                            disabled={!amount || loading}
                        >
                            {loading ? 'Sending...' : 'Send Payment'}
                        </Button>
                    </div>
                )}
            </main>
        </div>
    )
}
