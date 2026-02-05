import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { ArrowLeft, Wallet, TrendingUp, History, PlusCircle, CreditCard, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GlassCard } from '@/components/ui/glass-card'
import api from '@/services/api'

interface Transaction {
    id: string;
    amount: string;
    currency: string;
    type: string;
    timestamp: string;
    description?: string;
}

export default function WalletPage() {
    const navigate = useNavigate()
    const [balance, setBalance] = useState<{ available: number; pending: number; currency: string } | null>(null)
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [loading, setLoading] = useState(true)
    const [amount, setAmount] = useState<string>('')
    const [showDeposit, setShowDeposit] = useState(false)
    const [processingDeposit, setProcessingDeposit] = useState(false)
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        fetchWalletData()
    }, [])

    const fetchWalletData = async () => {
        try {
            setLoading(true)
            const [balanceRes, txRes] = await Promise.all([
                api.get('/wallet/balance'),
                api.get('/wallet/transactions')
            ])
            setBalance(balanceRes.data)
            setTransactions(txRes.data)
        } catch (error) {
            console.error("Failed to fetch wallet data", error)
        } finally {
            setLoading(false)
        }
    }

    const handleAddFunds = async () => {
        if (!amount || isNaN(Number(amount))) return
        
        try {
            setProcessingDeposit(true)
            const res = await api.post('/wallet/deposit', {
                amount: Number(amount),
                description: "User Top-up"
            })
            
            // Redirect to Finternet payment URL
            if (res.data.paymentUrl) {
                window.location.href = res.data.paymentUrl
            }
        } catch (error) {
            console.error("Deposit failed", error)
        } finally {
            setProcessingDeposit(false)
        }
    }

    const copyWalletAddress = () => {
         // Mock address for now or get from API if available
        navigator.clipboard.writeText("0x1234...5678")
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="min-h-screen bg-background pb-20">
             {/* Header */}
             <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-xl">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <h1 className="text-lg font-semibold">My Wallet</h1>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-6 space-y-6">
                
                {/* Balance Card */}
                <GlassCard className="p-6 relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-sm text-muted-foreground font-medium mb-1">Total Balance</p>
                        <div className="flex items-baseline gap-1">
                             <span className="text-4xl font-bold tracking-tight">
                                {balance ? `$${Number(balance.available).toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '---'}
                             </span>
                             <span className="text-sm font-medium text-muted-foreground">USD</span>
                        </div>
                        
                        <div className="mt-6 flex gap-3">
                            <Button 
                                className="flex-1 gradient-primary shadow-lg shadow-primary/20"
                                onClick={() => setShowDeposit(true)}
                            >
                                <PlusCircle className="w-4 h-4 mr-2" /> Add Funds
                            </Button>
                            <Button variant="outline" className="flex-1" onClick={copyWalletAddress}>
                                {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                                {copied ? "Copied" : "Copy Address"}
                            </Button>
                        </div>
                    </div>
                    
                    {/* Background decorations */}
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Wallet className="w-32 h-32" />
                    </div>
                </GlassCard>

                {/* Ledger / Transactions */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                        <History className="w-5 h-5 text-primary" />
                        Recent Activity
                    </h3>
                    
                    <div className="space-y-3">
                        {loading ? (
                            <p className="text-center text-muted-foreground py-8">Loading transactions...</p>
                        ) : transactions.length > 0 ? (
                            transactions.map((tx) => (
                                <GlassCard key={tx.id} className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-full bg-secondary/50">
                                            {tx.type === 'DEPOSIT' || Number(tx.amount) > 0 ? (
                                                <TrendingUp className="w-5 h-5 text-green-500" />
                                            ) : (
                                                <CreditCard className="w-5 h-5 text-orange-500" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">{tx.description || 'Transaction'}</p>
                                            <p className="text-xs text-muted-foreground">{new Date(tx.timestamp).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <span className={`font-semibold ${Number(tx.amount) > 0 ? 'text-green-500' : ''}`}>
                                        {Number(tx.amount) > 0 ? '+' : ''}${Math.abs(Number(tx.amount)).toFixed(2)}
                                    </span>
                                </GlassCard>
                            ))
                        ) : (
                            <div className="text-center py-10 bg-secondary/20 rounded-xl border border-dashed border-border">
                                <p className="text-muted-foreground text-sm">No recent transactions</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Deposit Modal / Sheet (Simplified inline for now) */}
            {showDeposit && (
                <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
                    <GlassCard className="w-full max-w-sm p-6 space-y-6 animate-in slide-in-from-bottom-10 fade-in">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">Add Funds</h3>
                            <Button variant="ghost" size="icon" onClick={() => setShowDeposit(false)}>
                                <ArrowLeft className="w-4 h-4" /> 
                            </Button>
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Amount (USD)</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">$</span>
                                <input 
                                    type="number" 
                                    className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 pl-8 text-lg ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="0.00"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    autoFocus
                                />
                            </div>
                        </div>

                        <Button 
                            className="w-full h-12 text-lg gradient-primary" 
                            onClick={handleAddFunds}
                            disabled={processingDeposit || !amount}
                        >
                            {processingDeposit ? 'Processing...' : 'Pay with Debit Card'}
                        </Button>
                        
                         <p className="text-xs text-center text-muted-foreground">
                            Secured by Finternet Gateway
                        </p>
                    </GlassCard>
                </div>
            )}
        </div>
    )
}
