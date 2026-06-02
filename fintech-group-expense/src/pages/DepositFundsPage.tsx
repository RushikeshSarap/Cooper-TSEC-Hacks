import { useState } from 'react'
import { useNavigate } from 'react-router'
import { ArrowLeft, CreditCard, Shield, Apple, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GlassCard } from '@/components/ui/glass-card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FinternetService } from '@/services/finternet'

const PRESET_AMOUNTS = [50, 100, 200, 500]

export default function DepositFundsPage() {
    const navigate = useNavigate()
    const [amount, setAmount] = useState('')
    const [selectedMethod, setSelectedMethod] = useState('finternet')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    const handleDeposit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const result = await FinternetService.initiatePayment(
                parseFloat(amount),
                'USD',
                'Wallet Deposit'
            );

            if (result.success) {
                setLoading(false)
                setSuccess(true)

                setTimeout(() => {
                    navigate('/dashboard')
                }, 2000)
            }
        } catch (error) {
            console.error("Deposit failed", error)
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
                <div className="space-y-6 text-center animate-in fade-in zoom-in-95 duration-500">
                    <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-12 h-12 text-green-500" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold text-foreground">Deposit Successful!</h2>
                        <p className="text-muted-foreground text-lg">
                            ${parseFloat(amount).toFixed(2)} has been added to your wallet
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
                    <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Cancel
                    </Button>
                    <h1 className="text-lg font-semibold ml-4">Add Funds</h1>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 max-w-lg">
                <form onSubmit={handleDeposit} className="space-y-8">
                    {/* Amount Input */}
                    <div className="text-center space-y-6">
                        <div className="relative inline-block">
                            <span className="absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 pr-2 text-4xl font-bold text-muted-foreground">
                                $
                            </span>
                            <Input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="text-6xl font-bold h-auto bg-transparent border-none text-center focus-visible:ring-0 p-0 w-48 placeholder:text-muted-foreground/30"
                                placeholder="0"
                                autoFocus
                                required
                                min="1"
                            />
                        </div>

                        <div className="flex justify-center gap-3">
                            {PRESET_AMOUNTS.map((val) => (
                                <button
                                    key={val}
                                    type="button"
                                    onClick={() => setAmount(val.toString())}
                                    className="px-4 py-2 rounded-full border border-border/50 bg-secondary/30 hover:bg-primary/10 hover:border-primary/50 transition-all font-medium text-sm"
                                >
                                    +${val}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Payment Method */}
                    <GlassCard className="p-6 space-y-4">
                        <div className="flex items-center justify-between mb-2">
                            <Label className="text-base">Payment Method</Label>
                            <Button variant="link" size="sm" className="h-auto p-0 text-primary">
                                Manage
                            </Button>
                        </div>

                        <div className="space-y-3">
                            <button
                                type="button"
                                onClick={() => setSelectedMethod('finternet')}
                                className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${selectedMethod === 'finternet'
                                    ? 'border-primary bg-primary/5'
                                    : 'border-border/50 bg-secondary/20 hover:bg-secondary/40'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                                        <Shield className="w-5 h-5 fill-current" />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-medium">Finternet Secure Pay</p>
                                        <p className="text-xs text-muted-foreground">Connected •••• dbb6</p>
                                    </div>
                                </div>
                                {selectedMethod === 'finternet' && <div className="w-4 h-4 rounded-full bg-primary" />}
                            </button>

                            <button
                                type="button"
                                onClick={() => setSelectedMethod('apple')}
                                className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${selectedMethod === 'apple'
                                    ? 'border-primary bg-primary/5'
                                    : 'border-border/50 bg-secondary/20 hover:bg-secondary/40'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center text-white">
                                        <Apple className="w-5 h-5 fill-current" />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-medium">Apple Pay</p>
                                        <p className="text-xs text-muted-foreground">Visa •••• 4242</p>
                                    </div>
                                </div>
                                {selectedMethod === 'apple' && <div className="w-4 h-4 rounded-full bg-primary" />}
                            </button>

                            <button
                                type="button"
                                onClick={() => setSelectedMethod('card')}
                                className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${selectedMethod === 'card'
                                    ? 'border-primary bg-primary/5'
                                    : 'border-border/50 bg-secondary/20 hover:bg-secondary/40'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                                        <CreditCard className="w-5 h-5" />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-medium">Chase Sapphire</p>
                                        <p className="text-xs text-muted-foreground">Mastercard •••• 8899</p>
                                    </div>
                                </div>
                                {selectedMethod === 'card' && <div className="w-4 h-4 rounded-full bg-primary" />}
                            </button>
                        </div>
                    </GlassCard>

                    {/* Security Note */}
                    <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                        <Shield className="w-3 h-3" />
                        <span>256-bit secure encryption</span>
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-14 text-lg gradient-primary"
                        disabled={!amount || loading}
                    >
                        {loading ? 'Processing...' : `Add $${amount || '0'} Funds`}
                    </Button>
                </form>
            </main>
        </div>
    )
}
