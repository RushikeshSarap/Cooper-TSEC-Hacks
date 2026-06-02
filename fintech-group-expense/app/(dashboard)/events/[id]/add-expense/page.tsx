"use client";

import { useState } from "react";
import { ArrowLeft, DollarSign, FileText, Tag } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { BillUpload } from "@/components/expenses/bill-upload";
import { OCRPreviewEditor } from "@/components/expenses/ocr-preview-editor";
import { CategoryParticipantsSelector } from "@/components/expenses/category-participants-selector";
import { cn } from "@/lib/utils";
import type { User } from "@/types";

const mockParticipants: User[] = [
  { id: "1", name: "Alex Johnson", email: "alex@example.com", balance: 385 },
  { id: "2", name: "Sarah Chen", email: "sarah@example.com", balance: 150 },
  { id: "3", name: "Mike Davis", email: "mike@example.com", balance: -127.5 },
  { id: "4", name: "Emma Wilson", email: "emma@example.com", balance: -85 },
  { id: "5", name: "Chris Brown", email: "chris@example.com", balance: 200 },
  { id: "6", name: "Lisa Park", email: "lisa@example.com", balance: -50 },
];

const categories = [
  { id: "1", name: "Accommodation", icon: "🏨" },
  { id: "2", name: "Food & Drinks", icon: "🍽️" },
  { id: "3", name: "Ski Rentals", icon: "🎿" },
  { id: "4", name: "Transport", icon: "🚗" },
  { id: "5", name: "Other", icon: "📦" },
];

export default function AddExpensePage() {
  const [loading, setLoading] = useState(false);
  const [showOCR, setShowOCR] = useState(false);
  const [ocrItems, setOcrItems] = useState<{ id: string; description: string; amount: number }[]>([]);
  const [ocrTotal, setOcrTotal] = useState(0);

  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    category: "",
    notes: "",
  });

  const [selectedParticipants, setSelectedParticipants] = useState<string[]>(
    mockParticipants.map((p) => p.id)
  );

  const handleScanComplete = (data: { total: number; items: string[] }) => {
    setOcrItems(
      data.items.map((item, index) => {
        const match = item.match(/(.*) - \$([\d.]+)/);
        return {
          id: index.toString(),
          description: match ? match[1] : item,
          amount: match ? parseFloat(match[2]) : 0,
        };
      })
    );
    setOcrTotal(data.total);
    setShowOCR(true);
    setFormData({ ...formData, amount: data.total.toString() });
  };

  const handleOCRConfirm = () => {
    setShowOCR(false);
  };

  const handleSubmit = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setLoading(false);
    // Navigate back or show success
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
          <Link
            href="/events/1"
            className="p-2 rounded-xl hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </Link>
          <div>
            <h1 className="font-semibold text-foreground">Add Expense</h1>
            <p className="text-xs text-muted-foreground">Ski Trip 2026</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 max-w-lg space-y-6">
        {/* Receipt Upload */}
        <BillUpload onScanComplete={handleScanComplete} />

        {/* OCR Results */}
        {showOCR && (
          <OCRPreviewEditor
            items={ocrItems}
            total={ocrTotal}
            onItemsChange={setOcrItems}
            onTotalChange={(total) => {
              setOcrTotal(total);
              setFormData({ ...formData, amount: total.toString() });
            }}
            onConfirm={handleOCRConfirm}
          />
        )}

        {/* Manual Entry Form */}
        <GlassCard>
          <h3 className="font-semibold text-foreground mb-4">Expense Details</h3>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Description
              </Label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="description"
                  placeholder="What was this expense for?"
                  className={cn(
                    "pl-10 h-12 rounded-xl bg-secondary/50 border-border/50",
                    "focus:border-primary focus:ring-primary/20"
                  )}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount" className="text-sm font-medium">
                Amount
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  step="0.01"
                  className={cn(
                    "pl-10 h-12 rounded-xl bg-secondary/50 border-border/50 text-xl font-semibold",
                    "focus:border-primary focus:ring-primary/20"
                  )}
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Category</Label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: category.id })}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-xl border transition-all",
                      formData.category === category.id
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border/50 bg-secondary/30 text-foreground hover:border-primary/30"
                    )}
                  >
                    <span>{category.icon}</span>
                    <span className="text-sm font-medium">{category.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-medium">
                Notes (Optional)
              </Label>
              <Textarea
                id="notes"
                placeholder="Any additional details..."
                className={cn(
                  "min-h-[80px] rounded-xl bg-secondary/50 border-border/50",
                  "focus:border-primary focus:ring-primary/20"
                )}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
          </div>
        </GlassCard>

        {/* Split Selection */}
        <GlassCard>
          <h3 className="font-semibold text-foreground mb-4">Split Between</h3>
          <CategoryParticipantsSelector
            participants={mockParticipants}
            selectedIds={selectedParticipants}
            onSelectionChange={setSelectedParticipants}
          />

          {selectedParticipants.length > 0 && formData.amount && (
            <div className="mt-4 pt-4 border-t border-border/50">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Each person pays
                </span>
                <span className="text-lg font-bold gradient-text">
                  ${(parseFloat(formData.amount) / selectedParticipants.length).toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </GlassCard>
      </main>

      {/* Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4 max-w-lg">
          <GradientButton
            onClick={handleSubmit}
            loading={loading}
            disabled={!formData.description || !formData.amount}
            className="w-full"
          >
            Add Expense
          </GradientButton>
        </div>
      </div>
    </div>
  );
}
