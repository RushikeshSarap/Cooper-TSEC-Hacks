import { useState } from 'react'
import { useNavigate } from 'react-router'
import { ArrowLeft, Check, Coffee, ShoppingBag, Car, Home, Plane, Ticket, Utensils, Music, Laptop, Gift, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GlassCard } from '@/components/ui/glass-card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const ICONS = [
    { id: 'food', icon: Utensils, label: 'Food' },
    { id: 'transport', icon: Car, label: 'Transport' },
    { id: 'shopping', icon: ShoppingBag, label: 'Shopping' },
    { id: 'housing', icon: Home, label: 'Housing' },
    { id: 'travel', icon: Plane, label: 'Travel' },
    { id: 'entertainment', icon: Ticket, label: 'Fun' },
    { id: 'coffee', icon: Coffee, label: 'Coffee' },
    { id: 'music', icon: Music, label: 'Music' },
    { id: 'tech', icon: Laptop, label: 'Tech' },
    { id: 'gift', icon: Gift, label: 'Gift' },
    { id: 'utilities', icon: Zap, label: 'Bills' },
]

const COLORS = [
    '#6366f1', // Indigo
    '#ec4899', // Pink
    '#10b981', // Emerald
    '#f59e0b', // Amber
    '#3b82f6', // Blue
    '#8b5cf6', // Violet
    '#ef4444', // Red
    '#14b8a6', // Teal
]

export default function AddExpenseCategoryPage() {
    const navigate = useNavigate()
    const [name, setName] = useState('')
    const [budget, setBudget] = useState('')
    const [selectedIcon, setSelectedIcon] = useState(ICONS[0].id)
    const [selectedColor, setSelectedColor] = useState(COLORS[0])
    const [loading, setLoading] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        // Simulate API call
        setTimeout(() => {
            navigate(-1)
        }, 800)
    }

    return (
        <div className="min-h-screen bg-background">
            <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-xl">
                <div className="container mx-auto px-4 h-16 flex items-center">
                    <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                    <h1 className="text-lg font-semibold ml-4">New Category</h1>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 max-w-lg">
                <GlassCard className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Preview */}
                        <div className="flex justify-center mb-6">
                            <div
                                className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all duration-300"
                                style={{ backgroundColor: selectedColor }}
                            >
                                {ICONS.find(i => i.id === selectedIcon)?.icon({
                                    className: "w-10 h-10 text-white"
                                }) || <Coffee className="w-10 h-10 text-white" />}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Category Name</Label>
                            <Input
                                placeholder="e.g. Weekend Snacks"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Monthly Limit (Optional)</Label>
                            <Input
                                type="number"
                                placeholder="$0.00"
                                value={budget}
                                onChange={(e) => setBudget(e.target.value)}
                            />
                        </div>

                        <div className="space-y-3">
                            <Label>Icon</Label>
                            <div className="grid grid-cols-4 gap-3">
                                {ICONS.map((item) => {
                                    const Icon = item.icon
                                    const isSelected = selectedIcon === item.id
                                    return (
                                        <button
                                            key={item.id}
                                            type="button"
                                            onClick={() => setSelectedIcon(item.id)}
                                            className={`p-3 rounded-xl flex flex-col items-center justify-center gap-2 transition-all ${isSelected
                                                    ? 'bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2 ring-offset-background'
                                                    : 'bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground'
                                                }`}
                                        >
                                            <Icon className="w-5 h-5" />
                                            <span className="text-[10px] uppercase font-medium">{item.label}</span>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label>Color Tag</Label>
                            <div className="flex flex-wrap gap-3">
                                {COLORS.map((color) => (
                                    <button
                                        key={color}
                                        type="button"
                                        onClick={() => setSelectedColor(color)}
                                        className={`w-10 h-10 rounded-full transition-transform hover:scale-110 relative ${selectedColor === color ? 'ring-2 ring-offset-2 ring-offset-background ring-foreground scale-110' : ''
                                            }`}
                                        style={{ backgroundColor: color }}
                                    >
                                        {selectedColor === color && (
                                            <Check className="w-4 h-4 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="pt-4">
                            <Button type="submit" className="w-full gradient-primary" disabled={loading}>
                                {loading ? 'Saving...' : 'Create Category'}
                            </Button>
                        </div>
                    </form>
                </GlassCard>
            </main>
        </div>
    )
}
