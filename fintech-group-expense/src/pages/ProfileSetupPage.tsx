import { useState } from 'react'
import { useNavigate } from 'react-router'
import { ArrowLeft, Camera, CreditCard, ChevronRight, Check, Wallet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GlassCard } from '@/components/ui/glass-card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function ProfileSetupPage() {
    const navigate = useNavigate()
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)

    const handleContinue = () => {
        if (step < 3) {
            setStep(step + 1)
        } else {
            setLoading(true)
            setTimeout(() => {
                navigate('/dashboard')
            }, 1000)
        }
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <header className="p-4">
                <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </Button>
            </header>

            <main className="flex-1 container mx-auto px-4 py-8 max-w-lg">
                <div className="mb-8 text-center space-y-2">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-accent">
                        Set Up Your Profile
                    </h1>
                    <p className="text-muted-foreground">
                        Let's get your account ready for expenses
                    </p>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    {[1, 2, 3].map((s) => (
                        <div
                            key={s}
                            className={`h-2 rounded-full transition-all duration-300 ${s === step ? 'w-8 bg-primary' : s < step ? 'w-2 bg-primary/50' : 'w-2 bg-secondary'
                                }`}
                        />
                    ))}
                </div>

                <GlassCard className="p-6">
                    {step === 1 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="text-center">
                                <div className="w-24 h-24 rounded-full bg-secondary/50 mx-auto mb-4 flex items-center justify-center relative cursor-pointer hover:bg-secondary/70 transition-colors border-2 border-dashed border-muted-foreground/30">
                                    <Camera className="w-8 h-8 text-muted-foreground" />
                                    <div className="absolute bottom-0 right-0 p-1.5 rounded-full bg-primary text-primary-foreground shadow-lg">
                                        <PlusIcon className="w-4 h-4" />
                                    </div>
                                </div>
                                <h3 className="font-semibold text-lg">Upload Photo</h3>
                                <p className="text-xs text-muted-foreground">Or choose an avatar</p>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Full Name</Label>
                                    <Input placeholder="e.g. Alex Johnson" defaultValue="Alex Johnson" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Username</Label>
                                    <Input placeholder="@alexj" />
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 rounded-2xl bg-primary/20 mx-auto mb-4 flex items-center justify-center">
                                    <Wallet className="w-8 h-8 text-primary" />
                                </div>
                                <h3 className="font-semibold text-lg">Default Currency</h3>
                                <p className="text-sm text-muted-foreground">Select your primary currency for expenses</p>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                {['USD ($)', 'EUR (€)', 'GBP (£)', 'JPY (¥)'].map((curr) => (
                                    <button
                                        key={curr}
                                        className="p-4 rounded-xl border border-border/50 bg-secondary/20 hover:bg-primary/10 hover:border-primary/50 transition-all text-left group"
                                    >
                                        <span className="font-medium group-hover:text-primary transition-colors">{curr}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 rounded-2xl bg-accent/20 mx-auto mb-4 flex items-center justify-center">
                                    <CreditCard className="w-8 h-8 text-accent" />
                                </div>
                                <h3 className="font-semibold text-lg">Link Payment Method</h3>
                                <p className="text-sm text-muted-foreground">How you'll settle expenses</p>
                            </div>

                            <div className="space-y-3">
                                <button className="w-full flex items-center justify-between p-4 rounded-xl border border-border/50 bg-secondary/20 hover:bg-secondary/40 transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center">
                                            <CreditCard className="w-5 h-5" />
                                        </div>
                                        <div className="text-left">
                                            <p className="font-medium">Link Card</p>
                                            <p className="text-xs text-muted-foreground">Credit or Debit</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                </button>
                                <button className="w-full flex items-center justify-between p-4 rounded-xl border border-border/50 bg-secondary/20 hover:bg-secondary/40 transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center">
                                            <Wallet className="w-5 h-5" />
                                        </div>
                                        <div className="text-left">
                                            <p className="font-medium">Connect Bank</p>
                                            <p className="text-xs text-muted-foreground">Direct debit via Plaid</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="pt-6 mt-6 border-t border-border/50">
                        <Button
                            className="w-full h-12 text-lg gradient-primary"
                            onClick={handleContinue}
                            disabled={loading}
                        >
                            {loading ? (
                                'Setting up...'
                            ) : step === 3 ? (
                                <>
                                    Complete Setup <Check className="w-5 h-5 ml-2" />
                                </>
                            ) : (
                                <>
                                    Continue <ChevronRight className="w-5 h-5 ml-2" />
                                </>
                            )}
                        </Button>
                    </div>
                </GlassCard>
            </main>
        </div>
    )
}

function PlusIcon({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
        </svg>
    )
}
