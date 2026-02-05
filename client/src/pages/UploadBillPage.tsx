import { useState } from 'react'
import { useNavigate } from 'react-router'
import { ArrowLeft, Camera, UploadCloud, ScanLine, X, Check, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GlassCard } from '@/components/ui/glass-card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { processReceiptImage } from '@/lib/ocr-utils'

export default function UploadBillPage() {
    const navigate = useNavigate()
    const [uploadedFile, setUploadedFile] = useState<File | null>(null)
    const [extractedData, setExtractedData] = useState<{ merchant: string; amount: string; date: string } | null>(null)
    const [loading, setLoading] = useState(false)

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            setUploadedFile(file)
            await handleExtraction(file)
        }
    }

    const handleExtraction = async (file: File) => {
        setLoading(true)
        try {
            const data = await processReceiptImage(file)
            setExtractedData({
                merchant: data.merchant,
                amount: data.amount,
                date: data.date
            })
        } catch (error) {
            console.error("Extraction failed", error)
            // Ideally show toast error here
        } finally {
            setLoading(false)
        }
    }

    const startCamera = () => {
        // Trigger the file input with capture="environment" which acts as camera on mobile
        // effectively same as clicking the upload input but we can try to force it via hidden input if needed
        // For now, let's reuse the hidden file input but simulate a click on it
         const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
         if (fileInput) {
             fileInput.click();
         }
    }

    const handleSubmit = () => {
        // Here you would navigate to Add Expense with pre-filled data
        // Extract ID from current URL or assume it is passed or we need regex
        // Current location is /events/:id/bill/upload. We want /events/:id/expenses/add
        // We can use standard relative navigation or split current path
        // Simplest: use relative path if Router supports it, or parse.
        // Assuming we are at /events/:id/bill/upload, navigating to ../expenses/add works?
        // Let's rely on splitting logical string for Hackathon speed as useParams might be available in context but hooks are top level.
        // useParams IS available here? Yes.
        // But wait, the route for this page needs to capture :id.
        // Let's assume useParams() works if configured in App.tsx
        // If useParams returns nothing, we fallback.
        const pathParts = window.location.pathname.split('/');
        const eventId = pathParts[2]; // /events/123/... -> 123
        navigate(`/events/${eventId}/expenses/add`, { state: { ...extractedData, receipt: uploadedFile } })
    }

    return (
        <div className="min-h-screen bg-background">
            <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-xl">
                <div className="container mx-auto px-4 h-16 flex items-center">
                    <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                    <h1 className="text-lg font-semibold ml-4">Scan Receipt</h1>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 max-w-lg">
                {!extractedData ? (
                    <div className="space-y-6">
                        <GlassCard className="p-8 text-center border-dashed border-2 border-primary/30 hover:border-primary/60 transition-colors cursor-pointer group relative overflow-hidden">
                            <input
                                type="file"
                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                accept="image/*,.pdf"
                                capture="environment"
                                onChange={handleFileUpload}
                            />
                            <div className="flex flex-col items-center gap-4">
                                <div className="p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                    <UploadCloud className="w-10 h-10 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium">Upload Receipt</h3>
                                    <p className="text-sm text-muted-foreground mt-1">Drag & drop or tap to browse</p>
                                </div>
                            </div>
                        </GlassCard>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-border/50" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">Or</span>
                            </div>
                        </div>

                        <Button
                            className="w-full h-14 text-lg"
                            variant="outline"
                            onClick={startCamera}
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex items-center gap-2 animate-pulse">
                                    <ScanLine className="w-5 h-5" /> Processing...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <Camera className="w-5 h-5" /> Use Camera
                                </span>
                            )}
                        </Button>
                    </div>
                ) : (
                    <GlassCard className="p-6 space-y-6 animate-in fade-in zoom-in-95 duration-300">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                                <Check className="w-5 h-5 text-green-500" />
                                Review Details
                            </h3>
                            <Button variant="ghost" size="icon" onClick={() => {
                                setExtractedData(null)
                                setUploadedFile(null)
                            }}>
                                <X className="w-4 h-4" />
                            </Button>
                        </div>

                        {uploadedFile && (
                            <div className="p-4 rounded-xl bg-secondary/30 flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-background">
                                    <FileText className="w-6 h-6 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium truncate">{uploadedFile.name}</p>
                                    <p className="text-xs text-muted-foreground">Receipt Image</p>
                                </div>
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Merchant</Label>
                                <Input disabled value={extractedData.merchant} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Total</Label>
                                    <Input disabled value={`$${extractedData.amount}`} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Date</Label>
                                    <Input disabled value={extractedData.date} />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 flex gap-3">
                            <Button className="flex-1" variant="outline" onClick={() => setExtractedData(null)}>
                                Retake
                            </Button>
                            <Button className="flex-1 gradient-primary" onClick={handleSubmit}>
                                Confirm & Add
                            </Button>
                        </div>
                    </GlassCard>
                )}

                {loading && (
                    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center flex-col gap-4">
                        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                        <p className="font-medium text-lg animate-pulse">Analyzing receipt...</p>
                    </div>
                )}
            </main>
        </div>
    )
}
