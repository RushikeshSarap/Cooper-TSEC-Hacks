"use client";

import { useState } from "react";
import { Edit2, Plus, Trash2, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { cn } from "@/lib/utils";

interface LineItem {
  id: string;
  description: string;
  amount: number;
}

interface OCRPreviewEditorProps {
  items: LineItem[];
  total: number;
  onItemsChange: (items: LineItem[]) => void;
  onTotalChange: (total: number) => void;
  onConfirm: () => void;
}

export function OCRPreviewEditor({
  items,
  total,
  onItemsChange,
  onTotalChange,
  onConfirm,
}: OCRPreviewEditorProps) {
  const [editingId, setEditingId] = useState<string | null>(null);

  const updateItem = (id: string, updates: Partial<LineItem>) => {
    onItemsChange(
      items.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const removeItem = (id: string) => {
    onItemsChange(items.filter((item) => item.id !== id));
  };

  const addItem = () => {
    const newItem: LineItem = {
      id: Date.now().toString(),
      description: "New item",
      amount: 0,
    };
    onItemsChange([...items, newItem]);
    setEditingId(newItem.id);
  };

  const calculatedTotal = items.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="space-y-4">
      <GlassCard className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Scanned Items</h3>
          <button
            onClick={addItem}
            className="flex items-center gap-1 text-xs text-primary hover:underline"
          >
            <Plus className="w-3 h-3" />
            Add item
          </button>
        </div>

        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className={cn(
                "flex items-center gap-2 p-3 rounded-xl transition-all",
                editingId === item.id ? "bg-primary/5 ring-1 ring-primary/20" : "bg-secondary/30"
              )}
            >
              {editingId === item.id ? (
                <>
                  <Input
                    value={item.description}
                    onChange={(e) => updateItem(item.id, { description: e.target.value })}
                    className="flex-1 h-8 text-sm"
                    autoFocus
                  />
                  <Input
                    type="number"
                    value={item.amount}
                    onChange={(e) => updateItem(item.id, { amount: parseFloat(e.target.value) || 0 })}
                    className="w-24 h-8 text-sm text-right"
                  />
                  <button
                    onClick={() => setEditingId(null)}
                    className="p-1.5 rounded-lg bg-success/10 text-success"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <>
                  <p className="flex-1 text-sm text-foreground truncate">
                    {item.description}
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    ${item.amount.toFixed(2)}
                  </p>
                  <button
                    onClick={() => setEditingId(item.id)}
                    className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-border/50">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Subtotal</span>
            <span className="font-medium text-foreground">
              ${calculatedTotal.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="font-semibold text-foreground">Total</span>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-foreground">
                ${total.toFixed(2)}
              </span>
              {calculatedTotal !== total && (
                <button
                  onClick={() => onTotalChange(calculatedTotal)}
                  className="text-xs text-primary hover:underline"
                >
                  Sync
                </button>
              )}
            </div>
          </div>
        </div>
      </GlassCard>

      <GradientButton onClick={onConfirm} className="w-full">
        <CheckCircle2 className="w-4 h-4 mr-2" />
        Confirm Details
      </GradientButton>
    </div>
  );
}
