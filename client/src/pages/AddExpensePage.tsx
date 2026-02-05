import { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router'
import { ArrowLeft, Calendar, Tag, FileText, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GlassCard } from '@/components/ui/glass-card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { eventService } from '@/services/event.service'

export default function AddExpensePage() {
    const navigate = useNavigate()
    const { id } = useParams()
    const location = useLocation()
    const [loading, setLoading] = useState(false)
    const [categories, setCategories] = useState<any[]>([])

    // Pre-fill from OCR if available
    const initialData = location.state || {}

    const [formData, setFormData] = useState({
        description: initialData.merchant || '',
        amount: initialData.amount || '',
        categoryId: '',
        date: initialData.date || new Date().toISOString().split('T')[0]
    })

    useEffect(() => {
        if (id) {
            eventService.getCategories(id).then(setCategories).catch(console.error)
        }
    }, [id])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!id) return;
        setLoading(true)

        try {
            await eventService.addExpense(id, {
                description: formData.description,
                amount: parseFloat(formData.amount),
                categoryId: formData.categoryId ? Number(formData.categoryId) : undefined,
                date: formData.date
            });
            navigate(`/events/${id}`)
        } catch (error) {
            console.error("Failed to add expense", error)
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-background">
            <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-xl">
                <div className="container mx-auto px-4 h-16 flex items-center">
                    <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Cancel
                    </Button>
                    <h1 className="text-lg font-semibold ml-4">Add Expense</h1>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 max-w-lg">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Amount Input */}
                    <div className="text-center space-y-2">
                        <Label>Amount</Label>
                        <div className="relative inline-block">
                            <span className="absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 pr-2 text-2xl font-bold text-muted-foreground">
                                $
                            </span>
                            <Input
                                type="number"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                className="text-4xl font-bold h-auto bg-transparent border-none text-center focus-visible:ring-0 p-0 w-32 placeholder:text-muted-foreground/30"
                                placeholder="0.00"
                                autoFocus
                                step="0.01"
                                required
                            />
                        </div>
                    </div>

                    <GlassCard className="p-6 space-y-4">
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <div className="relative">
                                <FileText className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="What was this for?"
                                    className="pl-9"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Category (Optional)</Label>
                            <div className="relative">
                                <Tag className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-9 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={formData.categoryId}
                                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                >
                                    <option value="">Select a category</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Date</Label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                <Input
                                    type="date"
                                    className="pl-9"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                />
                            </div>
                        </div>

                        {initialData.receipt && (
                            <div className="flex items-center gap-2 text-sm text-green-500 bg-green-500/10 p-2 rounded-lg">
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Receipt attached from scan</span>
                            </div>
                        )}
                    </GlassCard>

                    <Button type="submit" className="w-full h-12 gradient-primary" disabled={loading}>
                        {loading ? 'Adding Expense...' : 'Add Expense'}
                    </Button>
                </form>
            </main>
        </div>
    )
}
